<#
.SYNOPSIS
  paytesla.kr AI 운영 루프 — 관찰 → 지난 결정 판정 → 개선 → 검증 → 커밋·푸시.
  Windows 작업 스케줄러가 3일마다 10:00에 호출한다.

.DESCRIPTION
  Tier 1은 매 회차 GSC 관찰, 과거 결정의 실측 판정, 상태 기록을 수행한다.
  Tier 2는 판정 기일·급변·28일 정기 점검 중 하나가 있을 때만 AI를 실행한다.
  AI 변경은 콘텐츠 감사·lint·test·build와 독립 리뷰 PASS 뒤에만 자동 커밋·푸시한다.

.PARAMETER Days
  분석 구간 길이 (기본 28일)

.PARAMETER SkipAgent
  리포트만 만들고 에이전트는 실행하지 않는다 (동작 확인용)

.PARAMETER DryRun
  쓰기 도구를 차단하고 분석·계획만 시킨다 (코드 변경 없음)

.PARAMETER SkipReview
  리뷰 단계를 건너뛴다 (권장하지 않음 — 품질 게이트가 사라진다)

.PARAMETER SkipNotify
  알림 에이전트를 건너뛴다 (러너 자체 토스트는 그대로 뜬다)

.PARAMETER Force
  트리거 조건과 관계없이 Tier 2 판단을 실행한다
#>
[CmdletBinding()]
param(
    [int]$Days = 28,
    [switch]$SkipAgent,
    [switch]$DryRun,
    [switch]$SkipReview,
    [switch]$SkipNotify,
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

# scripts/schedule -> scripts -> tesla-quote-app -> f:\개인\tesla (git 저장소 루트)
$AppRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$RepoRoot = Split-Path -Parent $AppRoot
$ReportDir = Join-Path $AppRoot 'reports\gsc'
$LogDir = Join-Path $ReportDir 'logs'
$Stamp = Get-Date -Format 'yyyy-MM-dd'
$LogPath = Join-Path $LogDir "run-$Stamp.log"

New-Item -ItemType Directory -Force -Path $ReportDir | Out-Null
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $line = "[{0}] [{1}] {2}" -f (Get-Date -Format 'HH:mm:ss'), $Level, $Message
    Write-Output $line
    Add-Content -Path $LogPath -Value $line -Encoding UTF8
}

function Send-Toast {
    <# 알림 에이전트가 못 도는 상황(단계 실패 등)에서 러너가 직접 띄우는 최소 알림 #>
    param([string]$Title, [string]$Message)
    try {
        Add-Type -AssemblyName System.Windows.Forms -ErrorAction Stop
        Add-Type -AssemblyName System.Drawing -ErrorAction Stop
        $icon = New-Object System.Windows.Forms.NotifyIcon
        $icon.Icon = [System.Drawing.SystemIcons]::Information
        $icon.BalloonTipTitle = $Title
        $icon.BalloonTipText = $Message
        $icon.Visible = $true
        $icon.ShowBalloonTip(15000)
        Start-Sleep -Seconds 10
        $icon.Dispose()
        Write-Log "데스크톱 알림 전송 완료"
    } catch {
        Write-Log "데스크톱 알림 실패: $($_.Exception.Message)" 'WARN'
    }
}

function Send-Webhook {
    param([string]$Message)
    $hook = $env:GSC_NOTIFY_WEBHOOK
    if ([string]::IsNullOrWhiteSpace($hook)) { return }
    try {
        $payload = @{ text = $Message; content = $Message } | ConvertTo-Json -Compress
        Invoke-RestMethod -Uri $hook -Method Post -ContentType 'application/json' -Body $payload | Out-Null
        Write-Log "웹훅 알림 전송 완료"
    } catch {
        Write-Log "웹훅 알림 실패: $($_.Exception.Message)" 'WARN'
    }
}

function Get-RepoStatusMap {
    <# 경로 -> status+내용 지문. M->M 변경도 에이전트 변경으로 식별한다. #>
    $map = @{}
    foreach ($line in (& git -C $RepoRoot status --porcelain --untracked-files=all)) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $code = $line.Substring(0, 2)
        $path = $line.Substring(3).Trim().Trim('"')
        $fullPath = Join-Path $RepoRoot $path
        $fingerprint = if (Test-Path -LiteralPath $fullPath -PathType Leaf) {
            (Get-FileHash -LiteralPath $fullPath -Algorithm SHA256).Hash
        } elseif (Test-Path -LiteralPath $fullPath) {
            'directory'
        } else {
            'missing'
        }
        $map[$path] = "$code|$fingerprint"
    }
    return $map
}

function Get-AgentTouchedPaths {
    <# 실행 전부터 더러웠던 파일은 제외하고, 이번 회차에 새로 생긴 변경만 골라낸다. #>
    param([hashtable]$Before, [hashtable]$After)
    $touched = @()
    foreach ($path in $After.Keys) {
        # 회차별 리포트는 부산물이고 state/ 만 운영 기억으로 취급한다.
        if ($path -like 'tesla-quote-app/reports/gsc*' -and
            $path -notlike 'tesla-quote-app/reports/gsc/state/*') { continue }
        if ($path -like '.omc/*') { continue }
        if ($path -like '.claude/settings.local.json') { continue }
        if (-not $Before.ContainsKey($path)) { $touched += $path }
        elseif ($Before[$path] -ne $After[$path]) { $touched += $path }
    }
    return $touched
}

function Undo-AgentChanges {
    param([string[]]$Paths, [hashtable]$StatusMap)
    foreach ($p in $Paths) {
        $full = Join-Path $RepoRoot $p
        try {
            if ($StatusMap[$p] -match '\?') {
                if (Test-Path $full) { Remove-Item -Recurse -Force $full }
                Write-Log "  되돌림(삭제): $p"
            } else {
                & git -C $RepoRoot checkout -- $p 2>&1 | Out-Null
                Write-Log "  되돌림(복원): $p"
            }
        } catch {
            Write-Log "  되돌림 실패: $p — $($_.Exception.Message)" 'WARN'
        }
    }
}

function Resolve-ClaudeBinary {
    <# npm shim 이 깨진 환경이 있어 VSCode 확장 번들 바이너리까지 탐색한다. #>
    if ($env:CLAUDE_BIN -and (Test-Path $env:CLAUDE_BIN)) { return $env:CLAUDE_BIN }

    $extRoot = Join-Path $env:USERPROFILE '.vscode\extensions'
    if (Test-Path $extRoot) {
        $candidate = Get-ChildItem -Path $extRoot -Filter 'anthropic.claude-code-*' -Directory -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            ForEach-Object { Join-Path $_.FullName 'resources\native-binary\claude.exe' } |
            Where-Object { Test-Path $_ } |
            Select-Object -First 1
        if ($candidate) { return $candidate }
    }

    $onPath = Get-Command claude -ErrorAction SilentlyContinue
    if ($onPath) { return $onPath.Source }

    return $null
}

function Write-Utf8NoBom {
    <# Set-Content -Encoding UTF8 은 PS 5.1 에서 BOM 을 붙인다 — 마크다운 첫 글자가 깨진다. #>
    param([string]$Path, [string]$Text)
    [System.IO.File]::WriteAllText($Path, $Text, (New-Object System.Text.UTF8Encoding($false)))
}

function Invoke-ClaudeAgent {
    <# 헤드리스 에이전트 1회 실행. 표준출력 전문을 문자열로 돌려준다. #>
    param(
        [string]$AgentName,
        [string]$Prompt,
        [string[]]$AllowedTools,
        [string[]]$DisallowedTools,
        [string]$OutputPath
    )
    $claudeArgs = @(
        '-p', $Prompt,
        '--agent', $AgentName,
        '--permission-mode', 'acceptEdits',
        '--allowedTools'
    ) + $AllowedTools + @('--disallowedTools') + $DisallowedTools

    Push-Location $RepoRoot
    try {
        $output = & $script:ClaudeBin @claudeArgs 2>&1
        $script:LastAgentExit = $LASTEXITCODE
    } finally {
        Pop-Location
    }

    $text = ($output | Out-String).Trim()
    if ($OutputPath) {
        Write-Utf8NoBom -Path $OutputPath -Text $text
        Write-Log "$AgentName 출력 저장: $OutputPath (exit $script:LastAgentExit)"
    }
    return $text
}

function Test-AgentChanges {
    <# 보호 경로·변경 규모·콘텐츠·lint·test·build 를 러너가 독립 검증한다. #>
    param([string[]]$Touched)
    $reasons = @()
    if ($Touched.Count -eq 0) { return $reasons }

    # (1) 보호 경로 침범 — 도구 차단을 우회했더라도 여기서 잡는다.
    #     lib/ 은 통째로 막지 않는다: 공개 가이드와 답변 콘텐츠는 작업 대상이고,
    #     금액을 만드는 계산 로직과 URL 통합 정책만 파일 단위로 잠근다.
    #     app/sitemap.js 는 신규 페이지 색인 연결에 필요해 허용 대상이다.
    $protectedPattern = '^tesla-quote-app/(' +
        'lib/(quoteCalculations|calcExtra|subsidy|vehicleData|regions|rivalData|supabase|supabase-server|archivedGuides|mergedGuides)\.js|' +
        '__tests__/|scripts/|data/|supabase/|app/api/|app/admin/|app/auth/|app/robots\.js|' +
        'package(-lock)?\.json|next\.config\.mjs|tailwind\.config\.js|eslint\.config\.js|vitest\.config\.js' +
        ')|^\.github/'
    $violations = @($Touched | Where-Object { $_ -match $protectedPattern })
    if ($violations.Count -gt 0) {
        $reasons += "보호 경로 수정: $($violations -join ', ')"
    }

    $sourceTouched = @($Touched | Where-Object { $_ -notlike 'tesla-quote-app/reports/gsc/state/*' })

    # (2) 변경 규모 폭주 — 회차당 결정 1건이 소스 8개를 넘길 이유가 없다
    if ($sourceTouched.Count -gt 8) {
        $reasons += "소스 변경 파일 $($sourceTouched.Count)개로 과다 (상한 8개)"
    }

    # (3) 소스 변경에는 채점 가능한 결정 파일이 반드시 따라야 한다.
    if ($sourceTouched.Count -gt 0) {
        $decisionTouched = @($Touched | Where-Object {
            $_ -like 'tesla-quote-app/reports/gsc/state/decisions/*.json'
        })
        if ($decisionTouched.Count -eq 0) {
            $reasons += "소스 변경에 대응하는 GSC 결정 파일 없음"
        }
    }

    # (4) 정적 콘텐츠 품질 감사
    Write-Log "콘텐츠 감사 실행 중..."
    & npm --prefix $AppRoot run content:audit 2>&1 | Select-Object -Last 12 | ForEach-Object { Write-Log "  audit: $_" }
    if ($LASTEXITCODE -ne 0) { $reasons += "npm run content:audit 실패" }

    # (5) lint — eslint 에러(경고 아님)가 나면 실패
    Write-Log "lint 실행 중..."
    & npm --prefix $AppRoot run lint 2>&1 | Select-Object -Last 12 | ForEach-Object { Write-Log "  lint: $_" }
    if ($LASTEXITCODE -ne 0) { $reasons += "npm run lint 실패" }

    # (6) 테스트 — 계산 로직과 콘텐츠 스키마 회귀를 잡는다.
    Write-Log "테스트 실행 중..."
    & npm --prefix $AppRoot test 2>&1 | Select-Object -Last 15 | ForEach-Object { Write-Log "  test: $_" }
    if ($LASTEXITCODE -ne 0) { $reasons += "npm test 실패" }

    # (7) 프로덕션 정적 페이지 생성까지 확인한다.
    Write-Log "프로덕션 빌드 실행 중..."
    & npm --prefix $AppRoot run build 2>&1 | Select-Object -Last 20 | ForEach-Object { Write-Log "  build: $_" }
    if ($LASTEXITCODE -ne 0) { $reasons += "npm run build 실패" }

    return $reasons
}

function Invoke-AutoCommit {
    <# 검증된 경로만 stage하고 main에 커밋·푸시한다. 다른 사용자 변경은 포함하지 않는다. #>
    param([string[]]$Paths, [string]$Message)

    $targets = @($Paths | Where-Object { -not [string]::IsNullOrWhiteSpace($_) } | Sort-Object -Unique)
    if ($targets.Count -eq 0) { return 'NO_CHANGE' }

    & git -C $RepoRoot add -- $targets
    if ($LASTEXITCODE -ne 0) {
        Write-Log "자동 stage 실패" 'ERROR'
        return 'ADD_FAILED'
    }
    & git -C $RepoRoot diff --cached --quiet
    if ($LASTEXITCODE -eq 0) {
        Write-Log "커밋할 변경 없음"
        return 'NO_CHANGE'
    }

    & git -C $RepoRoot commit -m $Message 2>&1 | ForEach-Object { Write-Log "  commit: $_" }
    if ($LASTEXITCODE -ne 0) {
        Write-Log "자동 커밋 실패" 'ERROR'
        return 'COMMIT_FAILED'
    }
    & git -C $RepoRoot push origin main 2>&1 | ForEach-Object { Write-Log "  push: $_" }
    if ($LASTEXITCODE -ne 0) {
        Write-Log "커밋은 완료됐지만 push 실패 — 다음 회차 시작 시 재시도" 'ERROR'
        return 'PUSH_FAILED'
    }
    Write-Log "자동 커밋·푸시 완료"
    return 'PUSHED'
}

# ---------------------------------------------------------------- 0. 작업 트리·원격 동기화

Write-Log "===== paytesla AI 운영 루프 시작 (repo: $RepoRoot) ====="
Set-Location $AppRoot
$env:PYTHONIOENCODING = 'utf-8'

$pythonExe = (Get-Command python -ErrorAction SilentlyContinue)
if (-not $pythonExe) { $pythonExe = (Get-Command py -ErrorAction SilentlyContinue) }
if (-not $pythonExe) {
    Write-Log "python 실행 파일을 찾을 수 없습니다." 'ERROR'
    Send-Toast -Title 'GSC 루틴 실패' -Message 'python 을 찾을 수 없습니다.'
    exit 1
}

$branch = (& git -C $RepoRoot rev-parse --abbrev-ref HEAD).Trim()
if ($branch -ne 'main') {
    Write-Log "현재 브랜치가 main이 아님: $branch — 자동화를 중단합니다" 'ERROR'
    exit 1
}

$syncStatus = Get-RepoStatusMap
$workspaceDirty = @($syncStatus.Keys | Where-Object {
    $_ -notlike 'tesla-quote-app/reports/gsc*' -and
    $_ -notlike '.omc/*' -and
    $_ -notlike '.claude/settings.local.json'
})
if ($workspaceDirty.Count -gt 0) {
    Write-Log "사용자 작업 파일 $($workspaceDirty.Count)개가 있어 분석만 수행하고 AI 변경·커밋은 생략합니다" 'WARN'
    $workspaceDirty | ForEach-Object { Write-Log "  기존 변경: $_" 'WARN' }
} else {
    Write-Log "원격 main 동기화 중..."
    & git -C $RepoRoot fetch origin --quiet
    if ($LASTEXITCODE -ne 0) {
        Write-Log "git fetch 실패" 'ERROR'
        exit 1
    }
    $behind = [int]((& git -C $RepoRoot rev-list --count 'HEAD..origin/main').Trim())
    $ahead = [int]((& git -C $RepoRoot rev-list --count 'origin/main..HEAD').Trim())
    if ($behind -gt 0) {
        & git -C $RepoRoot pull --ff-only 2>&1 | ForEach-Object { Write-Log "  pull: $_" }
        if ($LASTEXITCODE -ne 0) { Write-Log "git pull --ff-only 실패" 'ERROR'; exit 1 }
    }
    if ($ahead -gt 0) {
        & git -C $RepoRoot push origin main 2>&1 | ForEach-Object { Write-Log "  retry-push: $_" }
        if ($LASTEXITCODE -ne 0) { Write-Log "이전 로컬 커밋 push 재시도 실패" 'ERROR'; exit 1 }
    }
}

# ---------------------------------------------------------------- 1. Tier 1 — 관찰·판정 근거·기억

Write-Log "GSC 리포트 생성 중 (최근 ${Days}일)..."
& $pythonExe.Source -m scripts.analytics.gsc_daily_insight --days $Days 2>&1 | ForEach-Object { Write-Log $_ }

if ($LASTEXITCODE -ne 0) {
    Write-Log "리포트 생성 실패 (exit $LASTEXITCODE)" 'ERROR'
    Send-Toast -Title 'GSC 루틴 실패' -Message '리포트 생성 단계에서 실패했습니다. 로그를 확인하세요.'
    exit 1
}

$latestJson = Join-Path $ReportDir 'latest.json'
if (-not (Test-Path $latestJson)) {
    Write-Log "latest.json 이 생성되지 않았습니다." 'ERROR'
    exit 1
}

$report = Get-Content $latestJson -Raw -Encoding UTF8 | ConvertFrom-Json
$cur = $report.summary.current
$headline = "클릭 {0} / 노출 {1} / CTR {2:P2} / 평균순위 {3:N1}" -f `
    $cur.clicks, $cur.impressions, $cur.ctr, $cur.position
Write-Log "리포트 요약 — $headline"

$indexAlert = [bool]$report.fallback_used
if ($indexAlert) {
    Write-Log "색인 이탈 신호 — $($report.fallback_reason)" 'WARN'
}

Write-Log "과거 결정 판정 근거 생성 중..."
& $pythonExe.Source -m scripts.analytics.gsc_evaluate 2>&1 | ForEach-Object { Write-Log $_ }
if ($LASTEXITCODE -ne 0) {
    Write-Log "결정 판정 근거 생성 실패" 'ERROR'
    exit 1
}
& $pythonExe.Source -m scripts.analytics.gsc_evaluate --record-observation 2>&1 | ForEach-Object { Write-Log $_ }
$statusJson = & $pythonExe.Source -m scripts.analytics.gsc_evaluate --status 2>&1 | Select-Object -Last 1
$loopStatus = $null
try { $loopStatus = $statusJson | ConvertFrom-Json } catch {
    Write-Log "루프 상태 파싱 실패: $statusJson" 'ERROR'
    exit 1
}

$dueCount = [int]$loopStatus.due_count
$daysSinceDeep = [int]$loopStatus.days_since_last_deep_run
$anomalyFlags = @($report.anomaly.flags)
Write-Log "Tier 1 완료 — 판정기일 $dueCount / 급변 $($anomalyFlags.Count) / 마지막 심층 후 ${daysSinceDeep}일"

if ($SkipAgent) {
    Write-Log "SkipAgent 지정됨 — Tier 1만 수행하고 자동 커밋은 생략"
    if (-not $SkipNotify) { Send-Toast -Title 'GSC 리포트 생성 완료' -Message $headline }
    exit 0
}

if ($workspaceDirty.Count -gt 0) {
    if (-not $SkipNotify) {
        Send-Toast -Title 'paytesla AI 운영 루프' -Message '기존 작업 트리가 변경 중이라 GSC 관찰만 수행했습니다.'
    }
    exit 0
}

$tier2Reasons = @()
if ($Force) { $tier2Reasons += '수동 Force' }
if ($dueCount -gt 0) { $tier2Reasons += "판정 기일 ${dueCount}건" }
if ($anomalyFlags.Count -gt 0) { $tier2Reasons += "급변: $($anomalyFlags -join ', ')" }
if ($daysSinceDeep -ge 28) { $tier2Reasons += "정기 심층 점검(${daysSinceDeep}일)" }
if ($indexAlert) { $tier2Reasons += '색인 이탈 신호' }

if ($tier2Reasons.Count -eq 0) {
    Write-Log "Tier 2 트리거 없음 — 관찰 기록만 커밋합니다"
    $commitResult = if ($DryRun) { 'DRY_RUN' } else {
        Invoke-AutoCommit -Paths @('tesla-quote-app/reports/gsc/state') `
            -Message "ops: record paytesla GSC observation $Stamp"
    }
    Send-Toast -Title 'paytesla GSC 관찰 완료' -Message "$headline`n심층 변경 없음 · $commitResult"
    exit 0
}
Write-Log "Tier 2 실행 — $($tier2Reasons -join ' / ')"

# ---------------------------------------------------------------- 2. Tier 2 — 전략 에이전트

$script:ClaudeBin = Resolve-ClaudeBinary
if (-not $script:ClaudeBin) {
    Write-Log "claude 실행 파일을 찾을 수 없습니다. CLAUDE_BIN 환경변수로 지정하세요." 'ERROR'
    Send-Toast -Title 'GSC 루틴 실패' -Message 'claude CLI 를 찾을 수 없습니다.'
    exit 1
}
Write-Log "claude 바이너리: $($script:ClaudeBin)"

# 쓰기 범위는 "콘텐츠·구조는 열고, 계산·데이터는 잠근다" 원칙으로 나눈다.
#
# 이 사이트의 실제 콘텐츠는 lib/answers/** 에 데이터로 들어 있다 —
# 여기를 막으면 에이전트가 할 수 있는 일이 문구 손질뿐이 되고,
# "유저가 못 얻고 간 답을 만들라"는 이 루틴의 목적 자체가 사라진다.
# 대신 __tests__/answers.test.js 가 답변 스키마(필수 필드·FAQ·출처·링크 유효성)를
# 강제하므로, 잘못 만든 콘텐츠는 러너의 npm test 단계에서 걸린다.
#
# 반대로 금액을 만들어내는 계산 로직과 보조금 원본 데이터는 SEO 개선과 무관하고
# 잘못 건드리면 금액이 틀리므로 파일 단위로 잠근다.
#
# 경로 규칙은 Edit(...) 형태로만 쓴다 — Write(path) 규칙은 파일 권한 검사에서
# 매칭되지 않고(무시됨), Edit(path) 하나가 Write 를 포함한 모든 파일 편집 도구를 덮는다.
$protectedWrites = @(
    # 계산·데이터 로직 — 금액의 출처
    'Edit(tesla-quote-app/lib/quoteCalculations.js)',
    'Edit(tesla-quote-app/lib/calcExtra.js)',
    'Edit(tesla-quote-app/lib/subsidy.js)',
    'Edit(tesla-quote-app/lib/vehicleData.js)',
    'Edit(tesla-quote-app/lib/regions.js)',
    'Edit(tesla-quote-app/lib/rivalData.js)',
    'Edit(tesla-quote-app/lib/supabase.js)',
    'Edit(tesla-quote-app/lib/supabase-server.js)',
    'Edit(tesla-quote-app/data/**)',
    # URL 통합 정책은 자동 변경하지 않는다. 공개 가이드 본문은 품질 감사 아래 허용한다.
    'Edit(tesla-quote-app/lib/archivedGuides.js)',
    'Edit(tesla-quote-app/lib/mergedGuides.js)',
    # 인프라
    'Edit(tesla-quote-app/scripts/**)',
    'Edit(tesla-quote-app/__tests__/**)',
    'Edit(tesla-quote-app/supabase/**)',
    'Edit(tesla-quote-app/app/api/**)',
    'Edit(tesla-quote-app/app/admin/**)',
    'Edit(tesla-quote-app/app/auth/**)',
    'Edit(tesla-quote-app/app/robots.js)',
    'Edit(tesla-quote-app/package.json)', 'Edit(tesla-quote-app/package-lock.json)',
    'Edit(tesla-quote-app/next.config.mjs)', 'Edit(tesla-quote-app/tailwind.config.js)',
    'Edit(tesla-quote-app/eslint.config.js)', 'Edit(tesla-quote-app/vitest.config.js)',
    'Edit(.github/**)'
)
$gitDenied = @('Bash(git add*)', 'Bash(git commit*)', 'Bash(git push*)',
               'Bash(git checkout*)', 'Bash(git reset*)')

$strategistAllowed = @(
    'Read', 'Edit', 'Write', 'Glob', 'Grep',
    'Bash(npm --prefix*)', 'Bash(git status*)', 'Bash(git diff*)'
)
$strategistDenied = $gitDenied + @('WebSearch') + $protectedWrites

$strategistPrompt = @'
이번 회차 paytesla AI 운영 루프의 1막(지난 결정 판정)과 2막(현재 결정)을 수행하라.

tesla-quote-app/reports/gsc/latest.json 과 latest.md 는 방금 생성되어 있다 (다시 생성할 필요 없음).
tesla-quote-app/reports/gsc/state/evaluation-input.json 과 evaluation-input.md,
goals.md, beliefs.md, verdicts.md 를 먼저 읽어라.

먼저 판정 기일이 도래한 과거 결정의 실측 결과를 처리하고 믿음과 판정 이력을 갱신하라.
그 다음 현재 데이터에서 가장 큰 병목을 한 문장으로 정하고, N/H/O/A/B/C/D 중
한 가지 행동만 선택하라. 아무것도 하지 않는 것도 근거가 있다면 정답이다.

코드를 바꾸면 반증 가능한 baseline·예측을 담은 결정 JSON을
tesla-quote-app/reports/gsc/state/decisions/ 에 반드시 남겨라.
동결 대상과 신규 결정 상한을 지키고, 기존 대표 글 30편으로 답할 수 있는 질문은
새 페이지로 중복 생성하지 말고 기존 글의 깊이와 내부 순환을 개선하라.

콘텐츠 감사, lint, test, build를 모두 통과시켜라. git 쓰기 명령은 실행하지 마라.
독립 리뷰 PASS 뒤의 커밋·푸시는 러너가 수행한다.
'@

if ($indexAlert) {
    $strategistPrompt += @"


[색인 이탈 진단 모드]
최근 $Days 일 노출이 0이라 리포트가 확대 구간으로 작성됐다($($report.fallback_reason)).
이것은 "순위가 낮다"와 다른 문제다. 콘텐츠를 늘리기 전에 **왜 노출 자체가 사라졌는지**를 먼저 코드에서 점검하라.

점검 대상(읽기): app/robots.js · app/sitemap.js 산출 · 각 페이지 metadata 의 robots/noindex ·
alternates.canonical 일관성 · 리다이렉트 설정 · 빌드 산출물에 페이지가 실제로 포함되는지.

코드에서 고칠 수 있는 원인(잘못된 noindex, canonical 오류, 사이트맵 누락, 잘못된 disallow)을 찾으면 고치고,
코드 밖 원인(도메인·DNS·수동 조치·색인 요청)으로 판단되면 고치지 말고 보고서에 근거와 함께 적어라.
확대 구간의 검색어는 "이 사이트가 원래 무엇으로 노출됐는가"의 근거로 쓴다.
"@
}

if ($DryRun) {
    $strategistDenied += @('Edit', 'Write', 'NotebookEdit')
    $strategistPrompt += "`n`n[DRY-RUN] 이번 실행에서는 파일을 수정하지 마라. 판정·병목·행동 계획만 근거 수치와 함께 보고하라."
}

Write-Log ("전략 에이전트 실행 (mode={0}, 색인이탈={1})..." -f $(if ($DryRun) { 'dry-run/분석만' } else { '코드 반영' }), $indexAlert)

$preStatus = Get-RepoStatusMap
$dirtyAtStart = @($preStatus.Keys | Where-Object {
    $_ -notlike 'tesla-quote-app/reports/gsc*' -and $_ -notlike '.omc/*'
})
if ($dirtyAtStart.Count -gt 0) {
    Write-Log "실행 전 이미 변경된 파일 $($dirtyAtStart.Count)개 — 자동 되돌림 대상에서 제외됩니다" 'WARN'
}

$agentOutPath = Join-Path $ReportDir "agent-$Stamp.md"
$agentText = Invoke-ClaudeAgent -AgentName 'gsc-daily-strategist' -Prompt $strategistPrompt `
    -AllowedTools $strategistAllowed -DisallowedTools $strategistDenied -OutputPath $agentOutPath

if ($script:LastAgentExit -ne 0) {
    Write-Log "전략 에이전트 실행 실패 (exit $script:LastAgentExit)" 'ERROR'
    Send-Toast -Title 'GSC 루틴 — 전략 에이전트 실패' -Message "exit $script:LastAgentExit. $agentOutPath 확인"
    exit 1
}

if ($DryRun) {
    Write-Log "DryRun 종료 — 코드 변경 없음"
    Send-Toast -Title "GSC 루틴 (분석만) — $Stamp" -Message $headline
    Write-Output $agentText
    exit 0
}

# ---------------------------------------------------------------- 3. 러너 검증

$postStatus = Get-RepoStatusMap
$agentTouched = Get-AgentTouchedPaths -Before $preStatus -After $postStatus
Write-Log "전략 에이전트 변경 파일 $($agentTouched.Count)개"
$agentTouched | ForEach-Object { Write-Log "  변경: $_" }

$rejectReasons = Test-AgentChanges -Touched $agentTouched

if ($rejectReasons.Count -gt 0) {
    Write-Log "러너 검증 실패 — 변경을 되돌립니다" 'ERROR'
    $rejectReasons | ForEach-Object { Write-Log "  사유: $_" 'ERROR' }
    Undo-AgentChanges -Paths $agentTouched -StatusMap $postStatus

    $failMsg = "검증 실패로 변경을 되돌렸습니다: $($rejectReasons -join ' / ')"
    Send-Toast -Title "GSC 루틴 — 변경 취소 ($Stamp)" -Message $failMsg
    Send-Webhook -Message "**GSC 루틴 — 변경 취소 ($Stamp)**`n$failMsg`n로그: $LogPath"
    exit 2
}

# ---------------------------------------------------------------- 4. 품질·디자인 리뷰

$reviewAllowed = @('Read', 'Glob', 'Grep', 'Bash(git status*)', 'Bash(git diff*)', 'Bash(git show*)', 'Bash(npm --prefix*)')
$reviewDenied = $gitDenied + @('Edit', 'Write', 'NotebookEdit', 'WebSearch')
$reviewPath = Join-Path $ReportDir "review-$Stamp.md"
$verdict = 'SKIPPED'

if ($SkipReview) {
    Write-Log "SkipReview 지정됨 — 품질·디자인 리뷰 생략" 'WARN'
} elseif ($agentTouched.Count -eq 0) {
    Write-Log "변경 없음 — 리뷰 생략"
    $verdict = 'NO_CHANGE'
} else {
    $reviewPrompt = @'
방금 작업 트리에 반영된 paytesla GSC 결정과 변경을 검사하라.

git status --porcelain 과 git diff 로 변경분을 읽고, gsc-loop-reviewer 지침의
실효성·콘텐츠·코드·SEO 기준을 모두 점검하라. 근거는 latest.md, evaluation-input.md,
전략 에이전트 보고, decisions/*.json 에서 확인하라.

특히 동결 침범, 중복 콘텐츠, 결정 기록 누락, 공식 출처 부족, 품질 게이트 결과를 확인하라.

응답 첫 줄은 반드시 VERDICT: PASS / FIX_REQUIRED / REJECT 중 하나여야 한다.
코드를 직접 수정하지 마라.
'@
    Write-Log "리뷰 에이전트 실행..."
    $reviewText = Invoke-ClaudeAgent -AgentName 'gsc-loop-reviewer' -Prompt $reviewPrompt `
        -AllowedTools $reviewAllowed -DisallowedTools $reviewDenied -OutputPath $reviewPath

    if ($script:LastAgentExit -ne 0) {
        Write-Log "리뷰 에이전트 실행 실패 (exit $script:LastAgentExit) — 판정 없이 진행" 'WARN'
        $verdict = 'REVIEW_FAILED'
    } else {
        $match = [regex]::Match($reviewText, 'VERDICT:\s*(PASS|FIX_REQUIRED|REJECT)')
        $verdict = if ($match.Success) { $match.Groups[1].Value } else { 'UNPARSED' }
        Write-Log "리뷰 판정: $verdict"
    }

    # --- FIX_REQUIRED: 수정 지시를 물려 전략 에이전트를 1회 더 돌린다 ---
    if ($verdict -eq 'FIX_REQUIRED') {
        Write-Log "수정 라운드 실행 (1회)..."
        $fixPrompt = @"
직전 회차 변경에 대해 리뷰 에이전트가 FIX_REQUIRED 판정을 냈다.
아래 리뷰 보고의 [수정 지시] 항목을 그대로 반영하라.

새로운 개선 기회를 추가로 착수하지 마라 — 지적된 부분만 고친다.
수정 후 content:audit, lint, test, build를 다시 통과시켜라.
git add / commit / push 는 금지.

--- 리뷰 보고 ---
$reviewText
"@
        $fixPath = Join-Path $ReportDir "agent-fix-$Stamp.md"
        Invoke-ClaudeAgent -AgentName 'gsc-daily-strategist' -Prompt $fixPrompt `
            -AllowedTools $strategistAllowed -DisallowedTools $strategistDenied -OutputPath $fixPath | Out-Null

        $postStatus = Get-RepoStatusMap
        $agentTouched = Get-AgentTouchedPaths -Before $preStatus -After $postStatus
        $rejectReasons = Test-AgentChanges -Touched $agentTouched
        if ($rejectReasons.Count -gt 0) {
            Write-Log "수정 라운드 검증 실패 — 변경을 되돌립니다" 'ERROR'
            Undo-AgentChanges -Paths $agentTouched -StatusMap $postStatus
            $failMsg = "수정 라운드 검증 실패로 되돌렸습니다: $($rejectReasons -join ' / ')"
            Send-Toast -Title "GSC 루틴 — 변경 취소 ($Stamp)" -Message $failMsg
            Send-Webhook -Message "**GSC 루틴 — 변경 취소 ($Stamp)**`n$failMsg"
            exit 2
        }

        # 재리뷰 — 여기서도 REJECT 면 되돌린다. FIX_REQUIRED 면 남기되 경고로 알린다.
        $reviewText = Invoke-ClaudeAgent -AgentName 'gsc-loop-reviewer' -Prompt $reviewPrompt `
            -AllowedTools $reviewAllowed -DisallowedTools $reviewDenied -OutputPath $reviewPath
        $match = [regex]::Match($reviewText, 'VERDICT:\s*(PASS|FIX_REQUIRED|REJECT)')
        $verdict = if ($match.Success) { $match.Groups[1].Value } else { 'UNPARSED' }
        Write-Log "재리뷰 판정: $verdict"
    }

    # PASS가 아니면 자동 발행하지 않는다. 모호한 판정을 통과로 간주하지 않는다.
    if ($verdict -ne 'PASS') {
        Write-Log "최종 리뷰가 PASS가 아님($verdict) — 이 회차 변경을 되돌립니다" 'ERROR'
        Undo-AgentChanges -Paths $agentTouched -StatusMap $postStatus
        $failMsg = "리뷰 $verdict 로 변경을 되돌렸습니다. 사유는 $reviewPath 확인"
        Send-Toast -Title "GSC 루틴 — 리뷰 반려 ($Stamp)" -Message $failMsg
        Send-Webhook -Message "**GSC 루틴 — 리뷰 반려 ($Stamp)**`n$failMsg"
        exit 3
    }
}

if ($agentTouched.Count -gt 0 -and $verdict -ne 'PASS') {
    Write-Log "독립 리뷰 PASS 없이 자동 반영할 수 없어 변경을 되돌립니다" 'ERROR'
    $currentStatus = Get-RepoStatusMap
    Undo-AgentChanges -Paths $agentTouched -StatusMap $currentStatus
    exit 3
}

# ---------------------------------------------------------------- 5. 패치 보관

if ($agentTouched.Count -gt 0) {
    $patchDir = Join-Path $ReportDir 'patches'
    New-Item -ItemType Directory -Force -Path $patchDir | Out-Null
    $patchPath = Join-Path $patchDir "$Stamp.patch"
    & git -C $RepoRoot diff -- $agentTouched > $patchPath
    Write-Log "변경 패치 저장: $patchPath"
    Write-Log "되돌리려면: git checkout -- $($agentTouched -join ' ')"
}

# ---------------------------------------------------------------- 6. 심층 실행 기록·자동 커밋·푸시

& $pythonExe.Source -m scripts.analytics.gsc_evaluate --mark-deep-run 2>&1 | ForEach-Object { Write-Log $_ }

$commitTargets = @($agentTouched) + @('tesla-quote-app/reports/gsc/state')
$commitResult = Invoke-AutoCommit -Paths $commitTargets `
    -Message "seo: apply paytesla GSC decision $Stamp"
if ($commitResult -in @('ADD_FAILED', 'COMMIT_FAILED', 'PUSH_FAILED')) {
    $failMessage = "품질 검증은 통과했지만 자동 반영 실패: $commitResult"
    Send-Toast -Title "paytesla AI 운영 루프 — 반영 실패" -Message $failMessage
    Send-Webhook -Message "**paytesla AI 운영 루프 — 반영 실패**`n$failMessage`n$LogPath"
    exit 4
}

# ---------------------------------------------------------------- 7. 알림

$notifyDone = $false
if (-not $SkipNotify) {
    $notifyAllowed = @(
        'Read', 'Glob', 'Grep',
        'Edit(tesla-quote-app/reports/gsc/**)',
        'Bash(node tesla-quote-app/scripts/notify-gsc.mjs*)',
        'Bash(git status*)', 'Bash(git diff*)'
    )
    $notifyDenied = $gitDenied + @('Edit', 'NotebookEdit', 'WebSearch')
    $notifyPrompt = @"
GSC 개선 루틴이 끝났다. 결과를 정리하고 알림을 보내라.

- 리포트: tesla-quote-app/reports/gsc/latest.md
- 전략 에이전트 보고: tesla-quote-app/reports/gsc/agent-$Stamp.md
- 리뷰 판정: $verdict (상세: tesla-quote-app/reports/gsc/review-$Stamp.md)
- 이번 회차 변경 파일 수: $($agentTouched.Count)
- 색인 이탈 신호: $indexAlert
- 자동 커밋·푸시 결과: $commitResult

gsc-report-notifier 지침대로 tesla-quote-app/reports/gsc/notify-$Stamp.md 를 작성하고,
node tesla-quote-app/scripts/notify-gsc.mjs 로 알림을 전송한 뒤, 한국어 요약을 출력하라.
알림 제목에는 사이트 이름(paytesla)을 포함하라 — 같은 PC에서 다른 사이트 루틴도 돈다.
"@
    Write-Log "알림 에이전트 실행..."
    $notifyText = Invoke-ClaudeAgent -AgentName 'gsc-report-notifier' -Prompt $notifyPrompt `
        -AllowedTools $notifyAllowed -DisallowedTools $notifyDenied `
        -OutputPath (Join-Path $ReportDir "notify-agent-$Stamp.md")
    if ($script:LastAgentExit -eq 0) {
        $notifyDone = $true
        Write-Output ""
        Write-Output "--------- 알림 요약 ---------"
        Write-Output $notifyText
    } else {
        Write-Log "알림 에이전트 실패 (exit $script:LastAgentExit) — 러너 기본 알림으로 대체" 'WARN'
    }
}

if (-not $notifyDone) {
    $body = if ($agentTouched.Count -eq 0) {
        "$headline`n이번 회차 코드 변경 없음 · $commitResult"
    } else {
        "$headline`n변경 $($agentTouched.Count)개 · 리뷰 $verdict · $commitResult"
    }
    Send-Toast -Title "GSC 루틴 완료 ($Stamp)" -Message $body
    Send-Webhook -Message "**GSC 루틴 완료 — $Stamp**`n$body`n리포트: $agentOutPath"
}

Write-Log "===== 완료 (리뷰: $verdict, 변경 $($agentTouched.Count)개, 반영: $commitResult) ====="
Write-Output ""
Write-Output "--------- 전략 에이전트 보고 ---------"
Write-Output $agentText
exit 0

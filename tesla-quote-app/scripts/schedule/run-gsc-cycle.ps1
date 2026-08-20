<#
.SYNOPSIS
  paytesla.kr GSC 개선 루틴 — 분석 → 코드 반영 → 품질/디자인 리뷰 → 알림.
  매주 월요일 10:00 작업 스케줄러가 호출한다 (블로그 루틴 09:10 과 겹치지 않게).

.DESCRIPTION
  1) scripts/analytics/gsc_daily_insight.py 로 GSC 리포트 생성
  2) gsc-strategist 에이전트 -> 개선안을 코드로 반영
  3) 러너가 독립적으로 보호경로·변경규모·lint·test 검증
  4) gsc-change-reviewer 에이전트 -> 코딩 품질·디자인 적합성 판정
     FIX_REQUIRED 면 수정 지시를 물려 전략 에이전트를 1회 더 돌린다
     REJECT 면 그 회차 변경을 통째로 되돌린다
  5) gsc-report-notifier 에이전트 -> 결과 요약 + 데스크톱/웹훅 알림
  커밋·푸시는 하지 않는다. 사용자가 검토 후 직접 수행한다.

.PARAMETER Days
  분석 구간 길이 (기본 14일)

.PARAMETER SkipAgent
  리포트만 만들고 에이전트는 실행하지 않는다 (동작 확인용)

.PARAMETER DryRun
  쓰기 도구를 차단하고 분석·계획만 시킨다 (코드 변경 없음)

.PARAMETER SkipReview
  리뷰 단계를 건너뛴다 (권장하지 않음 — 품질 게이트가 사라진다)

.PARAMETER SkipNotify
  알림 에이전트를 건너뛴다 (러너 자체 토스트는 그대로 뜬다)
#>
[CmdletBinding()]
param(
    [int]$Days = 14,
    [switch]$SkipAgent,
    [switch]$DryRun,
    [switch]$SkipReview,
    [switch]$SkipNotify
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
    <# 경로 -> git status 코드 맵. 에이전트가 만진 파일을 정확히 식별하기 위해 쓴다. #>
    $map = @{}
    foreach ($line in (& git -C $RepoRoot status --porcelain)) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        $code = $line.Substring(0, 2)
        $path = $line.Substring(3).Trim().Trim('"')
        $map[$path] = $code
    }
    return $map
}

function Get-AgentTouchedPaths {
    <# 실행 전부터 더러웠던 파일은 제외하고, 이번 회차에 새로 생긴 변경만 골라낸다. #>
    param([hashtable]$Before, [hashtable]$After)
    $touched = @()
    foreach ($path in $After.Keys) {
        # 리포트·로그·세션 아티팩트는 에이전트 산출물이 아니라 루틴 부산물이다
        if ($path -like 'tesla-quote-app/reports/gsc*') { continue }
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
    <# 보호 경로·변경 규모·lint·test 를 러너가 직접 검증한다. 에이전트 보고를 믿지 않는다. #>
    param([string[]]$Touched)
    $reasons = @()
    if ($Touched.Count -eq 0) { return $reasons }

    # (1) 보호 경로 침범 — 도구 차단을 우회했더라도 여기서 잡는다.
    #     lib/ 은 통째로 막지 않는다: lib/answers/** 등 콘텐츠·동선 레이어는 작업 대상이고,
    #     금액을 만드는 계산 로직과 색인 차단된 가이드 자산만 파일 단위로 잠근다.
    #     app/sitemap.js 는 신규 페이지 색인 연결에 필요해 허용 대상이다.
    $protectedPattern = '^tesla-quote-app/(' +
        'lib/(quoteCalculations|calcExtra|subsidy|vehicleData|regions|rivalData|supabase|supabase-server|guides|archivedGuides|mergedGuides)\.js|' +
        '__tests__/|scripts/|data/|supabase/|app/api/|app/admin/|app/auth/|app/robots\.js|' +
        'package(-lock)?\.json|next\.config\.mjs|tailwind\.config\.js|eslint\.config\.js|vitest\.config\.js' +
        ')|^\.github/'
    $violations = @($Touched | Where-Object { $_ -match $protectedPattern })
    if ($violations.Count -gt 0) {
        $reasons += "보호 경로 수정: $($violations -join ', ')"
    }

    # (2) 변경 규모 폭주 — 회차당 1~3건 개선이 8개 파일을 넘길 이유가 없다
    if ($Touched.Count -gt 8) {
        $reasons += "변경 파일 $($Touched.Count)개로 과다 (상한 8개)"
    }

    # (3) lint — eslint 에러(경고 아님)가 나면 실패
    Write-Log "lint 실행 중..."
    & npm --prefix $AppRoot run lint 2>&1 | Select-Object -Last 12 | ForEach-Object { Write-Log "  lint: $_" }
    if ($LASTEXITCODE -ne 0) { $reasons += "npm run lint 실패" }

    # (4) 테스트 — 계산 로직 회귀를 잡는 최후 방어선
    Write-Log "테스트 실행 중..."
    & npm --prefix $AppRoot test 2>&1 | Select-Object -Last 15 | ForEach-Object { Write-Log "  test: $_" }
    if ($LASTEXITCODE -ne 0) { $reasons += "npm test 실패" }

    return $reasons
}

# ---------------------------------------------------------------- 1. 리포트 생성

Write-Log "===== paytesla GSC 루틴 시작 (repo: $RepoRoot) ====="
Set-Location $AppRoot
$env:PYTHONIOENCODING = 'utf-8'

$pythonExe = (Get-Command python -ErrorAction SilentlyContinue)
if (-not $pythonExe) { $pythonExe = (Get-Command py -ErrorAction SilentlyContinue) }
if (-not $pythonExe) {
    Write-Log "python 실행 파일을 찾을 수 없습니다." 'ERROR'
    Send-Toast -Title 'GSC 루틴 실패' -Message 'python 을 찾을 수 없습니다.'
    exit 1
}

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

if ($SkipAgent) {
    Write-Log "SkipAgent 지정됨 — 에이전트 실행 생략"
    Send-Toast -Title 'GSC 리포트 생성 완료' -Message $headline
    exit 0
}

if ($cur.impressions -eq 0) {
    Write-Log "노출 데이터 없음 — 에이전트 실행 생략" 'WARN'
    Send-Toast -Title 'GSC 루틴' -Message '최근 구간 노출 데이터가 없어 조치를 건너뜁니다.'
    exit 0
}

# ---------------------------------------------------------------- 2. 전략 에이전트

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
    # 색인 차단된 가이드 자산 — 되살리면 AdSense 이슈가 재발한다
    'Edit(tesla-quote-app/lib/guides.js)',
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
이번 회차 GSC 개선 루틴을 수행하라.

tesla-quote-app/reports/gsc/latest.json 과 latest.md 는 방금 생성되어 있다 (다시 생성할 필요 없음).
tesla-quote-app/reports/gsc/action-log.md 를 먼저 읽어 최근 처리 항목과 중복되지 않게 하라.

gsc-strategist 지침의 STEP 2~6 을 순서대로 수행하라:
유입 형태와 검색어·니즈를 해석하고, 임팩트 큰 개선 기회를 최대 3건 선정해
실제 코드로 반영한 뒤, lint·test 로 검증하고, action-log.md 에 기록한 다음,
지정된 형식의 한국어 요약 보고를 출력하라.

변경은 tesla-quote-app/app/** 과 tesla-quote-app/components/** 안에서만 한다.
반드시 가장 비슷한 기존 페이지의 구조와 클래스 패턴을 먼저 읽고 그대로 따르라 —
디자인 적합성은 별도 리뷰 에이전트가 판정하며, 어긋나면 이 회차 변경이 반려된다.

git add / git commit / git push 는 절대 실행하지 마라. 커밋은 사용자가 직접 한다.
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
    $strategistPrompt += "`n`n[DRY-RUN] 이번 실행에서는 파일을 수정하지 마라. 분석·기회 선정까지만 하고, 어떤 파일을 어떻게 바꿀 계획인지 근거 수치와 함께 보고만 하라."
}

Write-Log ("전략 에이전트 실행 (mode={0}, 색인이탈={1})..." -f $(if ($DryRun) { 'dry-run/분석만' } else { '코드 반영' }), $indexAlert)

$preStatus = Get-RepoStatusMap
$dirtyAtStart = @($preStatus.Keys | Where-Object { $_ -notlike 'tesla-quote-app/reports/gsc*' -and $_ -notlike '.omc/*' })
if ($dirtyAtStart.Count -gt 0) {
    Write-Log "실행 전 이미 변경된 파일 $($dirtyAtStart.Count)개 — 자동 되돌림 대상에서 제외됩니다" 'WARN'
}

$agentOutPath = Join-Path $ReportDir "agent-$Stamp.md"
$agentText = Invoke-ClaudeAgent -AgentName 'gsc-strategist' -Prompt $strategistPrompt `
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
방금 작업 트리에 반영된 GSC 개선 변경을 검사하라.

git -C f:/개인/tesla status --porcelain 과 git diff 로 변경분을 읽고,
gsc-change-reviewer 지침의 A(코딩 품질) · B(디자인 적합성) · C(SEO·정책) 항목을 모두 점검하라.
근거는 tesla-quote-app/reports/gsc/latest.md 와 전략 에이전트 보고(reports/gsc/agent-*.md)에서 확인하라.

디자인 판단은 취향이 아니라 "이 사이트가 이미 쓰는 언어와 같은가"로 하라.
같은 타입의 기존 페이지를 실제로 열어 대조하고, 어떤 페이지와 대조했는지 보고에 밝혀라.

응답 첫 줄은 반드시 VERDICT: PASS / FIX_REQUIRED / REJECT 중 하나여야 한다.
코드를 직접 수정하지 마라.
'@
    Write-Log "리뷰 에이전트 실행..."
    $reviewText = Invoke-ClaudeAgent -AgentName 'gsc-change-reviewer' -Prompt $reviewPrompt `
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
수정 후 npm --prefix tesla-quote-app run lint 와 npm --prefix tesla-quote-app test 를 다시 통과시켜라.
git add / commit / push 는 금지.

--- 리뷰 보고 ---
$reviewText
"@
        $fixPath = Join-Path $ReportDir "agent-fix-$Stamp.md"
        Invoke-ClaudeAgent -AgentName 'gsc-strategist' -Prompt $fixPrompt `
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
        $reviewText = Invoke-ClaudeAgent -AgentName 'gsc-change-reviewer' -Prompt $reviewPrompt `
            -AllowedTools $reviewAllowed -DisallowedTools $reviewDenied -OutputPath $reviewPath
        $match = [regex]::Match($reviewText, 'VERDICT:\s*(PASS|FIX_REQUIRED|REJECT)')
        $verdict = if ($match.Success) { $match.Groups[1].Value } else { 'UNPARSED' }
        Write-Log "재리뷰 판정: $verdict"
    }

    # --- REJECT: 이 회차 변경 폐기 ---
    if ($verdict -eq 'REJECT') {
        Write-Log "리뷰 REJECT — 이 회차 변경을 되돌립니다" 'ERROR'
        Undo-AgentChanges -Paths $agentTouched -StatusMap $postStatus
        $failMsg = "리뷰 REJECT 로 변경을 되돌렸습니다. 사유는 $reviewPath 확인"
        Send-Toast -Title "GSC 루틴 — 리뷰 반려 ($Stamp)" -Message $failMsg
        Send-Webhook -Message "**GSC 루틴 — 리뷰 반려 ($Stamp)**`n$failMsg"
        exit 3
    }
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

# ---------------------------------------------------------------- 6. 알림

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
        "$headline`n이번 회차 코드 변경 없음."
    } else {
        "$headline`n변경 $($agentTouched.Count)개 · 리뷰 $verdict — 검토 후 커밋해주세요."
    }
    Send-Toast -Title "GSC 루틴 완료 ($Stamp)" -Message $body
    Send-Webhook -Message "**GSC 루틴 완료 — $Stamp**`n$body`n리포트: $agentOutPath"
}

Write-Log "===== 완료 (리뷰: $verdict, 변경 $($agentTouched.Count)개) ====="
Write-Output ""
Write-Output "--------- 전략 에이전트 보고 ---------"
Write-Output $agentText
exit 0

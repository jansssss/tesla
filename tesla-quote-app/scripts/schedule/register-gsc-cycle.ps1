<#
.SYNOPSIS
  paytesla AI 운영 루프를 Windows 작업 스케줄러에 등록한다. 기본은 3일마다 10:00.

.DESCRIPTION
  10:00 은 블로그(ohyess) 루틴 09:10 과 겹치지 않게 잡은 시각이다.
  두 루틴이 동시에 돌면 어느 쪽 알림인지 헷갈리고, 같은 PC에서 claude 세션이
  둘 다 붙어 lint/test 가 서로 느려진다.

  3일마다 Tier 1 관찰은 수행하지만, AI 심층 판단은 판정 기일·급변·28일 정기
  점검 중 하나가 있을 때만 실행한다. 검증과 독립 리뷰를 통과한 변경은 자동으로
  main 브랜치에 커밋·푸시한다.

.EXAMPLE
  # 등록 — 3일마다 10:00, 최근 28일 구간 분석 (기본값)
  powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1

.EXAMPLE
  # 간격·시각 변경
  powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -EveryDays 5 -At "10:30"

.EXAMPLE
  # 등록 해제 / 지금 한 번 실행
  powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -Unregister
  powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -RunNow
#>
[CmdletBinding()]
param(
    [string]$TaskName = 'paytesla-ai-os',
    [string]$At = '10:00',
    [int]$Days = 28,
    [ValidateRange(1, 31)]
    [int]$EveryDays = 3,
    [switch]$Unregister,
    [switch]$RunNow
)

$ErrorActionPreference = 'Stop'

$AppRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$RunnerPath = Join-Path $PSScriptRoot 'run-gsc-cycle.ps1'

if ($Unregister) {
    if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
        Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
        Write-Host "[OK] 작업 '$TaskName' 등록 해제 완료" -ForegroundColor Green
    } else {
        Write-Host "[SKIP] 작업 '$TaskName' 이 등록되어 있지 않습니다" -ForegroundColor Yellow
    }
    return
}

if ($RunNow) {
    if (-not (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue)) {
        Write-Host "[ERROR] 작업 '$TaskName' 이 등록되어 있지 않습니다. 먼저 등록하세요." -ForegroundColor Red
        exit 1
    }
    Start-ScheduledTask -TaskName $TaskName
    Write-Host "[OK] 작업 '$TaskName' 실행 요청 완료. 로그: tesla-quote-app\reports\gsc\logs\" -ForegroundColor Green
    return
}

if (-not (Test-Path $RunnerPath)) {
    Write-Host "[ERROR] 러너를 찾을 수 없습니다: $RunnerPath" -ForegroundColor Red
    exit 1
}

# --- 사전 점검 1: 다른 GSC 루틴과 시각이 겹치지 않는가 ---
$others = Get-ScheduledTask -ErrorAction SilentlyContinue |
    Where-Object { $_.TaskName -ne $TaskName -and $_.TaskName -match 'gsc' }
foreach ($task in $others) {
    foreach ($trigger in $task.Triggers) {
        if ($trigger.StartBoundary) {
            $otherAt = ([datetime]$trigger.StartBoundary).ToString('HH:mm')
            if ($otherAt -eq $At) {
                Write-Host "[WARN] '$($task.TaskName)' 도 $otherAt 에 실행됩니다 — 시각을 겹치지 않게 잡으세요." -ForegroundColor Yellow
            } else {
                Write-Host "[INFO] 기존 GSC 작업 '$($task.TaskName)' 실행 시각: $otherAt" -ForegroundColor Cyan
            }
        }
    }
}

# --- 사전 점검 2: claude 바이너리 존재 여부 ---
$claudeFound = $null
if ($env:CLAUDE_BIN -and (Test-Path $env:CLAUDE_BIN)) {
    $claudeFound = $env:CLAUDE_BIN
} else {
    $extRoot = Join-Path $env:USERPROFILE '.vscode\extensions'
    if (Test-Path $extRoot) {
        $claudeFound = Get-ChildItem -Path $extRoot -Filter 'anthropic.claude-code-*' -Directory -ErrorAction SilentlyContinue |
            Sort-Object Name -Descending |
            ForEach-Object { Join-Path $_.FullName 'resources\native-binary\claude.exe' } |
            Where-Object { Test-Path $_ } |
            Select-Object -First 1
    }
    if (-not $claudeFound) {
        $cmd = Get-Command claude -ErrorAction SilentlyContinue
        if ($cmd) { $claudeFound = $cmd.Source }
    }
}
if ($claudeFound) {
    Write-Host "[CHECK] claude 바이너리: $claudeFound" -ForegroundColor Cyan
} else {
    Write-Host "[WARN] claude 실행 파일을 찾지 못했습니다. CLAUDE_BIN 환경변수를 설정하세요." -ForegroundColor Yellow
}

# --- 사전 점검 3: GSC 토큰 ---
$tokenPath = Join-Path $AppRoot 'scripts\credentials\token.json'
if (Test-Path $tokenPath) {
    Write-Host "[CHECK] GSC 토큰 확인: $tokenPath" -ForegroundColor Cyan
} else {
    Write-Host "[WARN] GSC 토큰이 없습니다. 최초 1회 인증을 사람이 직접 해야 합니다:" -ForegroundColor Yellow
    Write-Host "       python -m scripts.analytics.gsc_daily_insight --days 14" -ForegroundColor Yellow
    Write-Host "       (scripts\schedule\README.md 참고)" -ForegroundColor Yellow
}

# --- 작업 등록 ---
$action = New-ScheduledTaskAction `
    -Execute 'powershell.exe' `
    -Argument "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$RunnerPath`" -Days $Days" `
    -WorkingDirectory $AppRoot

$trigger = New-ScheduledTaskTrigger -Daily -DaysInterval $EveryDays -At $At
$scheduleLabel = "${EveryDays}일마다 $At"

# StartWhenAvailable 을 켜지 않는다 — PC가 꺼져 있어 정시를 놓치면
# 나중에 따라잡지 않고 그 회차는 건너뛴다.
$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -RunOnlyIfNetworkAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Hours 2) `
    -MultipleInstances IgnoreNew

# 알림이 보이도록 로그온 세션에서 실행 (S4U/서비스 세션이면 토스트가 안 뜬다)
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Limited

if (Get-ScheduledTask -TaskName $TaskName -ErrorAction SilentlyContinue) {
    Unregister-ScheduledTask -TaskName $TaskName -Confirm:$false
    Write-Host "[INFO] 기존 작업을 교체합니다" -ForegroundColor Yellow
}

# 중단된 옛 주간 작업이 남아 있으면 중복 실행을 막기 위해 제거한다.
if ($TaskName -ne 'paytesla-gsc-weekly' -and
    (Get-ScheduledTask -TaskName 'paytesla-gsc-weekly' -ErrorAction SilentlyContinue)) {
    Unregister-ScheduledTask -TaskName 'paytesla-gsc-weekly' -Confirm:$false
    Write-Host "[INFO] 옛 작업 'paytesla-gsc-weekly' 제거" -ForegroundColor Yellow
}

Register-ScheduledTask `
    -TaskName $TaskName `
    -Action $action `
    -Trigger $trigger `
    -Settings $settings `
    -Principal $principal `
    -Description 'paytesla.kr — GSC 관찰 → 과거 결정 판정 → AI 개선 → 품질 검증 → 자동 커밋·푸시' | Out-Null

Write-Host ""
Write-Host "[OK] 작업 '$TaskName' 등록 완료 — $scheduleLabel 실행" -ForegroundColor Green
Write-Host "  분석 구간: 최근 ${Days}일"
Write-Host "  러너   : $RunnerPath"
Write-Host "  작업경로: $AppRoot"
Write-Host "  로그   : $(Join-Path $AppRoot 'reports\gsc\logs')"
Write-Host "  놓친 실행: 따라잡지 않음 (PC가 꺼져 있었다면 그 회차는 건너뜀)"
Write-Host ""
Write-Host "지금 한 번 테스트하려면:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File `"$PSCommandPath`" -RunNow"
Write-Host "등록 해제하려면:" -ForegroundColor Cyan
Write-Host "  powershell -ExecutionPolicy Bypass -File `"$PSCommandPath`" -Unregister"

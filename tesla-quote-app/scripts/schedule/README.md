# paytesla GSC 개선 루틴

Google Search Console 유입 데이터를 읽어 **개선안을 코드로 반영**하고, 그 변경이
**코딩 품질·사이트 디자인에 맞는지 검사**한 뒤, **결과를 알림으로 통지**하는 자동 루틴이다.

커밋·푸시는 하지 않는다. 작업 트리에 변경만 남고, **검토 후 커밋·푸시는 사용자가 직접** 한다.

---

## 구성

| 단계 | 주체 | 산출물 |
|---|---|---|
| 1. 리포트 생성 | `scripts/analytics/gsc_daily_insight.py` | `reports/gsc/latest.json` · `latest.md` |
| 2. 개선 코드 반영 | `gsc-strategist` 에이전트 | 작업 트리 변경 + `reports/gsc/agent-<날짜>.md` |
| 3. 러너 자체 검증 | `run-gsc-cycle.ps1` | 보호경로·변경규모·lint·test |
| 4. 품질·디자인 리뷰 | `gsc-change-reviewer` 에이전트 | `reports/gsc/review-<날짜>.md` (PASS/FIX_REQUIRED/REJECT) |
| 5. 알림 | `gsc-report-notifier` 에이전트 + `scripts/notify-gsc.mjs` | `reports/gsc/notify-<날짜>.md` + 데스크톱/웹훅 알림 |

에이전트 정의는 저장소 루트의 `.claude/agents/` 에 있다.

```
f:\개인\tesla\.claude\agents\
  gsc-strategist.md        분석 → 개선 코드 반영
  gsc-change-reviewer.md   코딩 품질 + 디자인 적합성 판정 (코드 수정 안 함)
  gsc-report-notifier.md   결과 요약 + 알림 전송
```

### 판정에 따른 동작

| 판정 | 러너 동작 |
|---|---|
| `PASS` | 변경을 그대로 남기고 알림 (커밋 대기) |
| `FIX_REQUIRED` | 수정 지시를 물려 전략 에이전트를 **1회 더** 실행 → 재검증 → 재리뷰 |
| `REJECT` | 이 회차 변경을 **전부 되돌리고** 사유와 함께 알림 (exit 3) |
| 러너 검증 실패 | 보호 경로 침범 / 변경 8개 초과 / lint·test 실패 → **되돌림** (exit 2) |

되돌리기 쉽도록 통과한 변경은 `reports/gsc/patches/<날짜>.patch` 로도 남는다.

---

## 최초 설정 (1회)

### 1. 파이썬 의존성

```powershell
pip install -r scripts\analytics\requirements.txt
```

### 2. GSC 자격증명

`scripts/credentials/` 에 아래 두 파일이 있어야 한다 (이 디렉터리는 `.gitignore` 대상).

- `client_secret.json` — Google Cloud OAuth 데스크톱 클라이언트
- `token.json` — 최초 인증으로 생성되는 액세스/리프레시 토큰

토큰이 없으면 **사람이 직접 한 번** 아래를 실행한다. 브라우저 동의 화면이 뜬다.
(스케줄러가 처음 이걸 만나면 창을 못 띄우고 그대로 멈춘다.)

```powershell
python -m scripts.analytics.gsc_daily_insight --days 14
```

경로를 바꾸고 싶으면 `.env.local` 에 지정한다.

```
GSC_SITE_URL=sc-domain:paytesla.kr
GSC_CLIENT_SECRET_PATH=...\client_secret.json
GSC_TOKEN_PATH=...\token.json
GSC_NOTIFY_WEBHOOK=https://hooks.slack.com/...   # 선택 — Slack/Discord 호환
```

### 3. claude 실행 파일

러너가 자동 탐색한다(PATH → VSCode 확장 번들). 못 찾으면 `CLAUDE_BIN` 환경변수로 지정한다.

---

## 사용법

```powershell
# 리포트만 생성해서 동작 확인 (에이전트 실행 안 함)
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1 -SkipAgent

# 코드는 안 고치고 분석·계획만
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1 -DryRun

# 전체 루틴 1회 실행
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1

# 스케줄 등록 — 매주 월요일 10:00 (블로그 루틴 09:10 과 겹치지 않게)
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1

# 등록된 작업 지금 실행 / 등록 해제
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -RunNow
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -Unregister
```

주요 옵션: `-Days <N>` 분석 구간 · `-SkipReview` 리뷰 생략(권장 안 함) · `-SkipNotify` 알림 에이전트 생략.

로그는 `reports/gsc/logs/run-<날짜>.log`.

---

## 왜 주 1회 10:00 인가

- **주 1회**: 리포트가 누적 구간(기본 14일)을 보므로 매일 돌리면 대부분 같은 데이터를 다시 본다.
  SEO 변경은 재크롤링·재평가에 며칠~몇 주가 걸려서, 매일 손대면 무엇이 효과가 있었는지 알 수 없다.
  일간 클릭이 두 자리로 올라오면 `-Daily -Days 7` 로 전환한다.
- **10:00**: 블로그(ohyess) 루틴이 09:10 이다. 같은 시각에 돌리면 어느 쪽 알림인지 헷갈리고,
  한 PC에서 claude 세션이 둘 다 붙어 lint/test 가 서로 느려진다.
  `register-gsc-cycle.ps1` 은 등록 시 다른 GSC 작업과 시각이 겹치면 경고한다.
- **놓친 실행은 따라잡지 않는다**: PC가 꺼져 있었다면 그 회차는 건너뛰고 다음 정시를 기다린다.

---

## 안전장치 요약

에이전트 보고를 신뢰하지 않는다. 러너가 독립적으로 다시 검증한다.

- **쓰기 범위 — 콘텐츠·구조는 열고, 계산·데이터는 잠근다**
  - 열림: `app/**` · `components/**` · **`lib/answers/**`(답변 콘텐츠·여정)** ·
    `lib/answerLabels.js` · `lib/calculators.js`(계산기 레지스트리=동선) · `lib/calcLinks.js` ·
    `lib/categories.js` · `app/sitemap.js`
  - 잠김: `lib/quoteCalculations.js` · `lib/calcExtra.js` · `lib/subsidy.js` · `lib/vehicleData.js` ·
    `lib/regions.js` · `lib/rivalData.js` · `lib/supabase*.js` · `data/**` ·
    `lib/guides.js`(색인 차단 자산) · `__tests__/` · `scripts/` · `.github/` · `supabase/` ·
    빌드 설정 · `app/robots.js` · `app/api|admin|auth/**` — 도구 레벨 차단 + 러너 재검사

  콘텐츠 레이어를 연 이유: 이 사이트의 실제 콘텐츠(답변 100개)는 `lib/answers/**` 에 데이터로 있다.
  여기를 막으면 에이전트가 할 수 있는 일이 문구 손질뿐이 되어 루틴의 목적이 사라진다.
  대신 `__tests__/answers.test.js` 가 답변 스키마(필수 필드·FAQ 블록·출처·`dataNote`·링크 유효성)를
  강제하므로, 잘못 만든 콘텐츠는 러너의 `npm test` 에서 걸린다.

- **실효성 게이트**: 리뷰 에이전트가 회차 산출물의 등급을 판정한다 —
  A(콘텐츠 신설) / B(구조 변경) / C(콘텐츠 심화) / D(metadata 손질).
  근거 약한 D-only 회차, 지난 회차와 같은 처방 반복, 얇은 신규 콘텐츠는 `FIX_REQUIRED`.
- **git 차단**: `add` / `commit` / `push` / `checkout` / `reset` 을 도구 레벨에서 막는다.
- **변경 규모 상한**: 8개 파일. 초과하면 전량 되돌림.
- **품질 게이트**: `npm run lint`(에러 기준) + `npm test`(계산 로직 회귀) 를 러너가 직접 실행.
- **디자인 게이트**: 리뷰 에이전트가 기존 페이지와 대조해 색·형태·간격·모바일·접근성을 판정.
- **정책 게이트**: `/guides/**` 색인 차단 유지, Product/Offer 구조화 데이터 금지,
  금액 하드코딩 금지, 기존 콘텐츠 삭제 금지, 순위 10위 이내 페이지 title·h1 변경 금지.
- **실행 전부터 더러웠던 파일은 되돌림 대상에서 제외**된다.

# paytesla AI 운영체제

Google Search Console의 실제 유입을 3일마다 관찰하고, 과거 판단을 채점한 뒤,
필요할 때만 콘텐츠·내부 링크·페이지 구조를 개선하는 폐쇄형 운영 루프다.

```
관찰 -> 과거 결정 판정 -> 현재 병목 진단 -> 행동 또는 무행동 선택
     -> 품질 검증 -> 독립 리뷰 -> 자동 커밋·푸시 -> 동결 -> 다음 판정
```

## 실행 주기

- Windows 작업: `paytesla-ai-os`
- 주기: 3일마다
- 시각: 오전 10:00 (KST)
- 분석 창: 최근 28일, GSC 확정 지연 3일 제외
- 놓친 실행: PC가 꺼져 있으면 건너뛰고 다음 주기를 기다림

오예스 루틴과 동시에 Claude·테스트·빌드를 실행하지 않도록 10시로 분리했다.

## 두 단계 실행

### Tier 1: 매 회차

- paytesla.kr GSC 검색어·페이지·기기·국가 성과 수집
- 최근 7일 급변 감지
- 이전 결정의 배포일을 Git 이력에서 확인
- 판정 기일이 된 결정의 before/after 수치 산출
- 압축 관찰 기록을 `reports/gsc/state/observations/`에 저장

### Tier 2: 필요할 때만

다음 중 하나가 참일 때 AI 판단을 실행한다.

- 과거 결정의 판정 기일이 됨
- 최근 7일 노출이 40% 이상 변하거나 클릭·노출이 소멸함
- 마지막 심층 판단 후 28일이 지남
- 수동 실행에서 `-Force`를 지정함

변경할 이유가 없거나 관찰 중인 대상만 있다면 N/H를 선택하고 콘텐츠를 만들지 않는다.

## 판단의 기억

`reports/gsc/state/`만 Git으로 추적한다.

- `goals.md`: 사용자의 상위 목표와 현재 병목
- `beliefs.md`: 판정으로 검증하거나 폐기할 작업 가설
- `verdicts.md`: 적중·빗나감·변화없음·판정불가 이력
- `decisions/*.json`: 가설, 행동, baseline, 예측, 동결 일정
- `observations/*.json`: 회차별 압축 GSC 시계열

대용량 원본 리포트·로그·패치는 로컬에만 두고 Git에 넣지 않는다.

## 안전장치

- 동시 실험 최대 3건, 회차당 신규 결정 최대 1건
- 등급별 24~42일 동결 후 첫 판정
- 대상 순위 변화에서 사이트 전체 순위 변화를 빼서 판정
- 공식 출처 없는 가격·보조금·정책 수치 금지
- 계산 로직·가격 데이터·보조금 원천·인증·인프라 수정 차단
- 기존 구매 질문과 겹치는 얇은 페이지 생성 금지
- 소스 변경에는 반증 가능한 결정 JSON 필수
- 소스 변경 최대 8파일
- 독립 리뷰가 PASS가 아니면 전부 되돌림

자동 커밋·푸시 전 다음을 모두 통과해야 한다.

```powershell
npm run content:audit
npm run lint
npm test
npm run build
```

## GSC 인증

오예스에서 사용하던 Google OAuth 클라이언트와 토큰을 테슬라 프로젝트의 Git 제외
경로인 `scripts/credentials/`에 복사해 사용한다. 동일 Google 계정이
`sc-domain:paytesla.kr` 속성에 접근할 수 있어야 한다.

`.env.local`:

```dotenv
GSC_SITE_URL=sc-domain:paytesla.kr
```

자격증명과 `.env.local`은 절대 커밋하지 않는다.

## 등록과 실행

`tesla-quote-app`에서 실행한다.

```powershell
# 3일마다 오전 10시로 등록 또는 교체
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1

# Tier 1만 연결 점검
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1 -SkipAgent

# 코드 변경 없이 AI 판단만 확인
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1 -DryRun -Force

# 전체 루프 즉시 실행
powershell -ExecutionPolicy Bypass -File scripts\schedule\run-gsc-cycle.ps1 -Force

# 등록 작업 즉시 실행 또는 해제
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -RunNow
powershell -ExecutionPolicy Bypass -File scripts\schedule\register-gsc-cycle.ps1 -Unregister
```

실행 로그는 `reports/gsc/logs/`, 에이전트 보고는 `reports/gsc/agent-*.md`,
변경 패치는 `reports/gsc/patches/`에 남는다.

## 자동 반영 규칙

1. 시작 시 작업 트리가 깨끗한지 확인한다. 사용자 변경이 있으면 관찰만 하고 종료한다.
2. `origin/main`을 fast-forward로 동기화한다.
3. AI는 git 쓰기 명령을 사용할 수 없다.
4. 러너가 품질 게이트와 독립 리뷰를 다시 실행한다.
5. PASS인 경로와 GSC 상태 파일만 stage한다.
6. `seo: apply paytesla GSC decision YYYY-MM-DD`로 커밋하고 `origin/main`에 푸시한다.
7. push 실패 시 로컬 커밋을 유지하고 다음 회차 시작 시 재시도한다.

## 판정 기간

| 등급 | 행동 | 동결 | 첫 판정 | 최종 판정 |
|---|---|---:|---:|---:|
| D | 제목·설명 개선 | 24일 | 24일 | 42일 |
| C | 기존 콘텐츠 심화 | 28일 | 28일 | 56일 |
| B | 내부 링크·구조 변경 | 42일 | 42일 | 70일 |
| A | 독립 정적 페이지 신설 | 42일 | 42일 | 84일 |

판정 전 같은 페이지나 검색어를 다시 수정하지 않는다. 그래야 어떤 결정이 실제로
효과가 있었는지 다음 회차에 학습할 수 있다.

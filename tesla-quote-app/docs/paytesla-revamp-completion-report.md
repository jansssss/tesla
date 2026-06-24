# paytesla.kr 리뷰 & 개선 작업 완료 보고서

> 작업 완료일: 2026-06-24

---

## 1. 작업 개요

paytesla.kr을 "테슬라 뉴스 요약 사이트"에서 "테슬라 구매 의사결정 실용 도구 사이트"로 전환하기 위한 사이트 전반 개선 작업을 완료했습니다.

---

## 2. 완료된 작업 목록

### 2-1. 프로젝트 감사 (Section 1)
- **파일**: `/docs/paytesla-site-audit.md`
- 프레임워크, 라우팅 구조, 데이터 흐름, 계산기 로직, SEO 처리, 발견된 버그 및 문제점 전수 문서화

---

### 2-2. 신뢰·정확성 수정 (Section 2)

| 문제 | 수정 내용 | 파일 |
|---|---|---|
| Model 3 vs Y 비교 페이지 하드코딩 월납입금 차이 문구 ("약 13,000~15,000원") | 계산기 안내 문구로 교체 | `app/compare/model-3-vs-model-y/page.js` |
| 비교 페이지 데이터 기준일 없음 | `CALC_DATA_DATE` import + 면책 문구 추가 | 동일 |
| 모델 페이지 데이터 기준일 없음 | `CALC_DATA_DATE` import + 면책 문구 추가 | `app/models/model-3/page.js`, `app/models/model-y/page.js` |

---

### 2-3. 관리자 보안 (Section 3)

| 항목 | 수정 내용 | 파일 |
|---|---|---|
| Footer 비로그인 ADMIN 링크 | `else` 브랜치 제거 — 로그인 상태에서만 표시 | `components/Footer.js` |
| 관리자 페이지 noindex | `layout.js`에 `robots: { index: false, follow: false }` 추가 | `app/admin/layout.js` |
| robots.txt `/admin/` 미차단 | `disallow: ['/admin/', '/auth/']` 추가 | `app/robots.js` |

---

### 2-4. 신규 가이드 8편 (Section 5 + Section 7)

아래 8편의 가이드가 `lib/guides.js`에 추가되어 `/guides/[slug]` 동적 라우트를 통해 바로 접근 가능합니다.

| 슬러그 | 카테고리 | 제목 |
|---|---|---|
| `tesla-subsidy-apply-guide` | 보조금·구매 | 테슬라 전기차 보조금 신청방법 완전 가이드 |
| `tesla-subsidy-required-docs` | 보조금·구매 | 테슬라 구매 보조금 서류 체크리스트 |
| `tesla-corporate-purchase-guide` | 보조금·구매 | 법인 테슬라 구매 가이드 |
| `tesla-calculator-how-to-use` | 구매 계산·도구 | 테슬라 계산기 사용법 |
| `tesla-monthly-payment-guide` | 구매 계산·도구 | 테슬라 월납입금 완전 이해 가이드 |
| `tesla-ev-maintenance-cost` | 유지비·충전 | 테슬라 유지비 완전 분석 |
| `tesla-long-distance-driving-experience` | 운영자 경험 | 테슬라로 장거리 이동 — 실제 경험 |
| `tesla-daily-life-changes` | 운영자 경험 | 테슬라 일상 — 충전·주차·관리로 달라진 것들 |

---

### 2-5. 신규 계산기 3개 (Section 6)

| URL | 컴포넌트 | 설명 |
|---|---|---|
| `/calc/monthly-real-cost` | `MonthlyRealCostCalculator.js` | 할부금 + 충전비 + 보험료 + 자동차세 = 월 실제 부담금 |
| `/calc/switch-to-tesla` | `SwitchToTeslaCalculator.js` | 내연기관 월 비용 vs 테슬라 월 비용 비교, 월 절감액·회수 기간 |
| `/calc/ev-purchase-readiness` | `EvPurchaseReadinessCalculator.js` | 5문항 충전환경·주행거리·예산 점수화, 맞춤 조언 제공 |

각 계산기는 서버 컴포넌트 page.js + 클라이언트 컴포넌트 Calculator.js 분리 패턴 적용 (기존 calc 페이지와 동일).

---

### 2-6. 홈페이지 핵심 진입점 6개 (Section 8)

`components/HomeContent.js` 상단에 ENTRY_POINTS 6개 카드 섹션 추가:

1. 월 실제 부담금 계산 → `/calc/monthly-real-cost`
2. 내연기관 vs 테슬라 비교 → `/calc/switch-to-tesla`
3. 구매 준비도 체크 → `/calc/ev-purchase-readiness`
4. Model 3 vs Y 비교 → `/compare/model-3-vs-model-y`
5. 보조금 신청방법 가이드 → `/guides/tesla-subsidy-apply-guide`
6. 보조금 서류 체크리스트 → `/guides/tesla-subsidy-required-docs`

---

### 2-7. 계산기 레지스트리 확장 (연계 업데이트)

`lib/calculators.js`에 신규 계산기 3개 추가 → SiteNav, 홈 계산기 모음, 관련 계산기 링크 자동 반영.

`components/SiteNav.js` 빠른 링크에 신규 계산기 3개 추가.

---

### 2-8. sitemap.js 신규 페이지 반영 (Section 9 연계)

`app/sitemap.js`에 다음 3개 URL 추가:
- `/calc/monthly-real-cost`
- `/calc/switch-to-tesla`
- `/calc/ev-purchase-readiness`

신규 가이드 8편은 `getAllGuides()`를 통해 sitemap에 자동 포함 (기존 정적 가이드 처리 로직 활용).

---

## 3. 데이터 무결성 원칙 준수 확인

아래 항목은 **절대 임의로 만들어 넣지 않음**:
- 차량 출고가, 트림 정보: 기존 TRIMS 배열 유지 (수정 없음)
- 보조금 금액: 기존 CSV 로더 활용, 특정 금액 가이드 본문에 미기재
- 국고보조금·지방보조금 수치: 가이드에서 "공식 홈페이지 및 무공해차 통합누리집 확인" 안내로 대체
- 보험료·자동차세 기본값: `lib/calcExtra.js` CALC_DEFAULTS 기존값 그대로 사용

---

## 4. 미완료 / 향후 작업 권장

| 항목 | 사유 |
|---|---|
| TCO vs 5년현금지출 개념 명확화 | 기존 계산기 UI 수정이 필요하며, 이번 작업 범위 내 안전하게 수정할 여지 적음 |
| 차량 데이터 중앙화 | TRIMS 배열이 여러 파일에 분산 — 별도 `lib/vehicles.js` 파일로 통합 시 유지보수성 향상 |
| 계산기 단위 테스트 | `lib/calcExtra.js`, `lib/quoteCalculations.js` 순수함수에 Jest 테스트 추가 권장 |
| 신규 가이드 관리자 에디터 연동 | 현재 정적 guides.js에 추가 — 향후 Supabase 마이그레이션 고려 가능 |

---

## 5. 수정된 파일 목록

```
components/Footer.js              — ADMIN 링크 비로그인 노출 제거
components/HomeContent.js         — 핵심 진입점 6개 섹션 추가
components/SiteNav.js             — 신규 계산기 3개 링크 추가
components/calc/MonthlyRealCostCalculator.js   — 신규
components/calc/SwitchToTeslaCalculator.js     — 신규
components/calc/EvPurchaseReadinessCalculator.js — 신규
app/admin/layout.js               — noindex metadata 추가
app/robots.js                     — /admin/, /auth/ disallow 추가
app/sitemap.js                    — 신규 calc 3개 추가
app/calc/monthly-real-cost/page.js — 신규
app/calc/switch-to-tesla/page.js  — 신규
app/calc/ev-purchase-readiness/page.js — 신규
app/compare/model-3-vs-model-y/page.js — 하드코딩 수정 + 기준일 추가
app/models/model-3/page.js        — 데이터 기준일·면책 문구 추가
app/models/model-y/page.js        — 데이터 기준일·면책 문구 추가
lib/calculators.js                — 신규 계산기 3개 등록
lib/guides.js                     — 신규 가이드 8편 추가
docs/paytesla-site-audit.md       — 신규
docs/paytesla-revamp-completion-report.md — 이 파일
```

# paytesla.kr 사이트 감사 보고서

> 작성일: 2026-06-24

---

## 1. 프레임워크 및 버전

| 항목 | 내용 |
|---|---|
| Framework | Next.js ^16.2.3 (App Router) |
| React | 18.3.1 |
| Node | — |
| CSS | Tailwind CSS |
| 렌더링 방식 | SSR + ISR (일부 Client Component) |

---

## 2. 라우팅 구조 (App Router)

```
app/
  page.js                          홈 (실구매가 계산기)
  sitemap.js                       sitemap.xml 생성
  robots.js                        robots.txt 생성

  models/
    model-3/page.js                Model 3 트림·가격
    model-y/page.js                Model Y 트림·가격

  compare/
    model-3-vs-model-y/page.js     Model 3 vs Y 비교
    rwd-vs-awd/page.js             RWD vs AWD 비교

  calc/
    maintenance/page.js            유지비 계산기
    charging/page.js               충전비 계산기
    tco/page.js                    총소유비용(TCO) 계산기
    compare/page.js                모델 비교 계산기

  guides/
    page.js                        가이드 목록
    [slug]/page.js                 가이드 상세 (동적)

  subsidy/
    [region]/page.js               지역별 보조금 (동적, 17개)

  admin/
    page.js                        /admin/posts 리디렉트
    login/page.js                  관리자 로그인
    editor/page.js                 가이드 에디터
    posts/page.js                  글 관리 목록

  about/page.js
  contact/page.js
  privacy/page.js
  terms/page.js
  disclaimer/page.js
  editorial-policy/page.js
  shop/page.js
  auth/reset-password/page.js
```

---

## 3. 차량 모델 데이터 위치

- **Model 3**: `app/models/model-3/page.js` — TRIMS 배열 하드코딩 (RWD: 41,990,000 / LR: 52,990,000 / Performance: 59,990,000)
- **Model Y**: `app/models/model-y/page.js` — TRIMS 배열 하드코딩
- **비교 페이지**: `app/compare/model-3-vs-model-y/page.js` — COMPARE_DATA, SCENARIOS 하드코딩
- **계산기 연결**: `QuoteWizard` 컴포넌트 — 내부에 차량·트림 목록 포함

> ⚠️ **문제**: 차량 가격, 주행거리, 트림 정보가 여러 파일에 중복 하드코딩되어 있어 가격 변동 시 모든 파일을 수동으로 업데이트해야 함.

---

## 4. 계산기 로직 파일

| 파일 | 내용 |
|---|---|
| `lib/quoteCalculations.js` | `monthlyPayment()`, `calculateQuote()`, `compareQuotes()`, `calculateUpgradeSuggestions()` |
| `lib/calcExtra.js` | `calcMaintenance()`, `calcCharging()`, `calcTco()`, `CALC_DEFAULTS`, `CALC_DATA_DATE` |
| `components/calc/MaintenanceCalculator.js` | 유지비 계산기 UI |
| `components/calc/ChargingCalculator.js` | 충전비 계산기 UI |
| `components/calc/TcoCalculator.js` | TCO 계산기 UI |
| `components/calc/CompareCalculator.js` | 모델 비교 계산기 UI |
| `components/calc/CalcArticle.js` | 계산기 하단 설명 아티클 (공통) |

---

## 5. 보조금 데이터 구조

- **파일**: `data/latest.csv` (또는 `../보조금/tesla_subsidy_by_local_YYYYMMDD.csv`)
- **로더**: `lib/subsidy.js` → `loadSubsidySnapshot()` (서버 전용)
- **메타**: `data/subsidy-meta.json` (dataDate 기록)
- **필드**: `local_code`, `local_name`, `national_subsidy_manwon`, `local_subsidy_manwon`, `total_subsidy_manwon`, 차량 트림별 컬럼
- **기준일**: `lib/calcExtra.js` `CALC_DATA_DATE = "2026-06-17"`

---

## 6. 콘텐츠/가이드 저장 방식

- **Supabase** (운영 데이터베이스): `guides` 테이블, `guide_sections` 테이블
- **관리자 에디터** (`/admin/editor`): content_html 직접 편집 → Supabase PATCH
- **정적 레지스트리**: 별도 `guidesRegistry.js` 미사용 — Supabase + `lib/guides.js` `getAllGuides()`가 정적 가이드도 관리
- **가이드 목록 병합**: `app/guides/page.js` → `fetchAllGuidesForList()` + 정적 목록 병합

---

## 7. 메타 태그 및 SEO 처리

- Next.js App Router `export const metadata = { ... }` 패턴 사용
- 각 page.js에서 `title`, `description`, `openGraph`, `alternates.canonical` 설정
- `components/seo/` 디렉터리 존재 (Breadcrumb, Schema 등 추가 SEO 컴포넌트)
- **⚠️ 문제**: 관리자 페이지 (`/admin/*`)에 `noindex` 메타 태그 미설정

---

## 8. Sitemap 생성

- **파일**: `app/sitemap.js`
- **포함**: 정적 페이지 17개, 지역별 보조금 17개, Supabase 가이드, 정적 가이드
- **제외**: `/admin/*` 경로 (명시적 추가 없음 — 현재 정상)
- **⚠️ 문제**: 새로 추가될 `/calc/monthly-real-cost`, `/calc/switch-to-tesla`, `/calc/ev-purchase-readiness`, 신규 가이드 6편이 포함되지 않음

---

## 9. robots.txt

- **파일**: `app/robots.js`
- **현재**: `allow: '/'` — 모든 경로 허용
- **⚠️ 문제**: `/admin/` 경로가 크롤러에 노출됨 → `Disallow: /admin/` 추가 필요

---

## 10. 관리자 로그인 및 관리자 링크

- **로그인 페이지**: `/admin/login`
- **에디터**: `/admin/editor`
- **글 관리**: `/admin/posts`
- **⚠️ 문제**: `components/Footer.js` — 비로그인 상태에서도 `ADMIN` 링크(`/admin/login`) 노출
- **인증 방식**: Supabase Auth (`supabase.auth.signInWithPassword`) + `localStorage('adminToken')`

---

## 11. Footer / Header / Navigation 구조

| 컴포넌트 | 내용 |
|---|---|
| `components/SiteHeader.js` | 로고, 상단 메뉴 (계산기, 모델, 비교, 지역보조금, 가이드) |
| `components/SiteNav.js` | 스크롤 가능한 빠른 링크 바 (계산기, 보조금, 모델, 비교) |
| `components/Footer.js` | 하단 링크 + **ADMIN 링크 노출 문제** |

---

## 12. Model 3 vs Model Y 비교 페이지

- **위치**: `app/compare/model-3-vs-model-y/page.js`
- **구조**: `COMPARE_DATA` (정적 표), `SCENARIOS` (4가지 시나리오), CTA 버튼
- **⚠️ 문제**: SCENARIOS에 `"월납입금이 약 13,000~15,000원 낮음"` 하드코딩 → 실제 계산값과 다를 수 있음
- **⚠️ 문제**: `COMPARE_DATA` 가격/주행거리 하드코딩 (데이터 기준일 없음)
- **모델 비교 계산기**: `/calc/compare` 별도 존재

---

## 13. TCO 계산기

- **위치**: `app/calc/tco/page.js` + `components/calc/TcoCalculator.js`
- **계산 로직**: `lib/calcExtra.js` `calcTco()`
- **수식**: `TCO = (실구매가 - 잔존가치) + 운영비 × 보유기간`
- **잔존가치**: 차량가 × (1 - 감가율)^보유연수
- **현황**: TCO(잔존가치 포함) 개념은 올바르게 구현됨
- **⚠️ 문제**: "5년 예상 현금지출"(잔존가치 미포함)과 "5년 TCO"(잔존가치 포함)가 명확히 구분되지 않음

---

## 14. 현재 빌드/린트/테스트 실행 방법

```bash
# 개발 서버 (로컬 실행 지양 — GitHub+Vercel 배포 파이프라인 사용)
npm run dev

# 빌드
npx next build

# 타입 체크 (JS 프로젝트라 tsc 미사용, 빌드로 대체)
npx next build

# 데이터 준비 (CSV)
npm run prepare:data   # (package.json에 정의된 경우)
```

> 테스트 파일 없음 (unit test 미구성)

---

## 15. 발견된 주요 문제 요약

| 우선순위 | 문제 | 파일 |
|---|---|---|
| 🔴 높음 | Footer에 비로그인 ADMIN 링크 노출 | `components/Footer.js` |
| 🔴 높음 | 관리자 페이지 noindex 미설정 | `app/admin/*/page.js` |
| 🔴 높음 | robots.txt `/admin/` 미차단 | `app/robots.js` |
| 🟡 중간 | 비교 페이지 월납입금 차이 하드코딩 | `app/compare/model-3-vs-model-y/page.js` |
| 🟡 중간 | 차량 데이터 기준일·면책 문구 없음 | `app/models/*/page.js` |
| 🟡 중간 | 5년 현금지출 vs TCO 개념 미구분 | 계산기 전반 |
| 🟢 낮음 | 신규 가이드·계산기 미존재 | — |
| 🟢 낮음 | 홈페이지 핵심 진입점 부족 | `app/page.js` |

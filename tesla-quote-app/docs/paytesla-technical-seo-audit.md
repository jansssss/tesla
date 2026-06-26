# paytesla.kr 기술 SEO 감사 보고서

작성일: 2026-06-26

---

## 1. 기술 구조

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16+ (App Router) |
| 언어 | JavaScript (TypeScript 미사용) |
| CSS | Tailwind CSS 3.4 |
| DB | Supabase (가이드 콘텐츠) |
| 빌드 | `npm run build` (= `prepare:data && next build`) |
| 데이터 사전준비 | `scripts/sync-subsidy.js` → `data/latest.csv` |
| 배포 도메인 | https://paytesla.kr |

---

## 2. 라우팅 구조

```
app/
├── page.js                        # 홈 — 실구매가·월납입금 계산기
├── models/model-3/page.js         # Model 3 트림 정보
├── models/model-y/page.js         # Model Y 트림 정보
├── compare/
│   ├── model-3-vs-model-y/page.js
│   └── rwd-vs-awd/page.js
├── calc/
│   ├── monthly-real-cost/page.js  # 월 실제 부담금
│   ├── maintenance/page.js        # 유지비
│   ├── charging/page.js           # 충전비
│   ├── tco/page.js                # TCO
│   ├── compare/page.js            # 모델 비교
│   ├── switch-to-tesla/page.js    # 전환 비교
│   └── ev-purchase-readiness/page.js
├── subsidy/[region]/page.js       # 지역별 보조금 (17개)
├── guides/page.js                 # 가이드 목록
├── guides/[slug]/page.js          # 개별 가이드 (Supabase + 정적)
├── admin/                         # 관리자 (noindex, robots disallow)
├── auth/                          # 인증 (robots disallow)
└── api/                           # API 라우트 (robots disallow)
```

---

## 3. 핵심 파일 위치

| 역할 | 파일 |
|------|------|
| 차량 데이터 단일 원본 | `lib/vehicleData.js` (신규 생성) |
| 계산기 공용 로직 | `lib/calcExtra.js`, `lib/quoteCalculations.js` |
| 계산기 레지스트리 | `lib/calculators.js` |
| 가이드 정적 목록 | `lib/guides.js` |
| Supabase 서버 | `lib/supabase-server.js` |
| 지역·보조금 데이터 | `lib/regions.js`, `data/latest.csv` |
| SEO 공통 헤더 | `components/SiteHeader.js` |
| 푸터 (어드민 조건부) | `components/Footer.js` |
| sitemap | `app/sitemap.js` |
| robots | `app/robots.js` |
| 관리자 레이아웃 | `app/admin/layout.js` |

---

## 4. SEO 설정 현황

### robots.txt (app/robots.js)
```
Disallow: /admin/
Disallow: /auth/
Disallow: /api/        ← 이번 작업에서 추가
Allow: /
Sitemap: https://paytesla.kr/sitemap.xml
```

### 어드민 메타 (app/admin/layout.js)
```js
robots: { index: false, follow: false }
```
→ 어드민 레이아웃 자체에 noindex 적용됨. 개별 admin 페이지에는 별도 설정 불필요.

### sitemap.js
- admin, auth, api URL 미포함 ✅
- 정적 페이지 19개 + 지역 17개 + Supabase 가이드 + 정적 가이드 보완
- canonical은 각 page.js의 `alternates: { canonical }` 으로 설정

### 어드민 링크 (Footer.js)
- `localStorage.getItem('adminToken')` 가 있을 때만 렌더링 → 비로그인 사용자에게 미노출 ✅
- AdminEditButton: `app/guides/[slug]/page.js` 에서만 사용, 조건부 렌더링으로 추정

---

## 5. 발견된 문제 및 조치

### 5-1. 계산기 NaN/Infinity 출력 [심각도: 높음] ✅ 수정 완료

**파일**: `components/calc/MonthlyRealCostCalculator.js`

**원인**: 
- `fmt(n)` = `Math.round(n).toLocaleString()` — n이 NaN이면 "NaN" 출력
- Field `onChange={(e) => onChange(Number(e.target.value))}` — "-" 입력 시 NaN 전파

**수정**:
```js
function safeNum(val) {
  const n = Number(val);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}
function fmt(n) {
  if (!Number.isFinite(n)) return "0";
  return Math.round(n).toLocaleString("ko-KR");
}
// onChange에서 safeNum 사용
onChange={(e) => onChange(safeNum(e.target.value))}
```

**기타 계산기**: `calcTco`, `calcMaintenance`, `calcCharging` 모두 `Number(val) || 0` 패턴으로 방어됨. `formatWon`도 `Number(value || 0)` 패턴 사용. 추가 수정 불필요.

---

### 5-2. robots.txt /api/ 미차단 [심각도: 중간] ✅ 수정 완료

**파일**: `app/robots.js`

`/api/` 라우트가 disallow 목록에 없었음 → Googlebot이 API 엔드포인트 크롤링 시도 가능.

**수정**: `disallow: ['/admin/', '/auth/', '/api/']`

---

### 5-3. 차량 데이터 중복·충돌 [심각도: 높음] ✅ 단일 원본 생성 완료

**발견된 데이터 충돌**:

| 트림 | 항목 | QuoteWizard | models/페이지 |
|------|------|------------|--------------|
| Model 3 RWD | 주행거리 | 382 km | 682 km |
| Model 3 LR | 주행거리 | 538 km | 713 km |
| Model 3 LR | 가속 | 5.2초 | 5.3초 |
| Model 3 Perf | 주행거리 | 450 km | 528 km |
| Model 3 Perf | 최고속도 | 261 km/h | 262 km/h |
| Model Y RWD | 주행거리 | 400 km | "400 km+" |
| Model Y LR | 주행거리 | 505 km | 533 km |
| Model Y LR | 가속 | 4.8초 | 5.0초 |

**수정**: `lib/vehicleData.js` 신규 생성 — 충돌 수치는 `null` 처리, 확인 목록은 `docs/vehicle-data-verification-todo.md`에 기재.

> ⚠️ QuoteWizard.js, models/ 페이지의 하드코딩 TRIMS는 vehicleData.js로 교체하는 작업 잔여. 현재는 단일 원본 파일만 생성된 상태.

---

### 5-4. TCO 금융비용 미표기 [심각도: 낮음] ✅ 수정 완료

TCO = 감가상각 + 운영비(보험+충전) — 할부 이자 미포함.  
잔존가치는 포함(감가상각 계산에 반영).  
컴포넌트 결과 헤더에 "할부 이자 등 금융비용 미포함" 문구 추가.  
TCO 페이지 FAQ에는 이미 설명 있었음.

---

## 6. 잔여 권고사항

### 우선순위 높음
- **차량 데이터 검증**: `docs/vehicle-data-verification-todo.md` 항목 공식 홈페이지 대조 후 vehicleData.js 업데이트
- **QuoteWizard·models/ 페이지 하드코딩 교체**: vehicleData.js를 실제로 import해서 사용하도록 리팩토링
- **콘텐츠 신뢰도**: 가이드에서 1인칭 실경험 주장("직접 사봤더니") 있으면 제거. 공식자료 기반 설명으로 대체.

### 우선순위 중간
- **GSC 대표 페이지 전략**: 동일 검색의도를 가진 페이지 중복 여부 확인 (예: 보조금 관련 페이지가 subsidy/[region], 모델 페이지, 가이드 등에 분산)
- **연간 유지비 계산기**: 단위 테스트 없음 — 로직 변경 시 회귀 위험

### 우선순위 낮음
- **/data-sources 페이지**: 사이트 신뢰도·애드센스 품질 향상용. 이번 작업에서 신규 생성.
- **적재공간(L) 수집**: vehicleData.js의 cargoLiters 필드 채우기

---

## 7. 빌드·검증 명령어

```bash
npm run build        # prepare:data + next build
# lint 미설정 (package.json에 lint 스크립트 없음)
# 테스트 미설정 (package.json에 test 스크립트 없음)
```

> ⚠️ lint·test 스크립트 미설정. 타입 안전성을 위해 JSDoc + TypeScript strict mode 또는 최소한 eslint-plugin-react 설치 권장.

# GSC 대표 페이지 전략 — 콘텐츠 통합 계획

작성일: 2026-06-26  
기준: 실제 GSC 데이터 없음 — 현재 프로젝트 파일 구조 기반 추정

> GSC(Google Search Console)에서 실제 클릭·노출·CTR 데이터 확인 후 이 문서를 업데이트하세요.

---

## 검색 의도별 대표 URL 전략

| 검색 의도 | 대표 URL | 보조 URL | 현재 문제 | 추천 조치 | 우선순위 |
|---------|--------|--------|--------|--------|------|
| 테슬라 보조금 계산 | `/subsidy/[region]` (지역별) | `/` (홈 계산기) | 홈과 지역 페이지가 동일 의도 경쟁 가능 | 홈 → 지역 페이지 내부링크 강화, 지역 페이지에 canonical 명시 | 높음 |
| 테슬라 월 납입금 계산 | `/` (홈 계산기) | `/calc/monthly-real-cost` | 홈은 "실구매가+월납입금" 복합, monthly-real-cost는 "할부+유지비 합산" — 의도 다름 | 각 페이지 타이틀/설명 차별화 유지 | 낮음 |
| 테슬라 유지비 계산 | `/calc/maintenance` | `/calc/monthly-real-cost` | 두 페이지 모두 "월 유지비" 관련 | monthly-real-cost에서 maintenance로 명확한 내부링크 제공 | 중간 |
| 테슬라 충전비 계산 | `/calc/charging` | `/calc/maintenance` | maintenance가 충전비 포함 → 중복 의도 가능 | charging 페이지 "순수 충전비 전용" 포지셔닝 명확화 | 중간 |
| 테슬라 총소유비용 TCO | `/calc/tco` | 가이드 페이지 | TCO 관련 가이드가 있으면 canonical을 `/calc/tco`로 지정 | 가이드에서 `/calc/tco`로 CTA 링크 강화 | 중간 |
| Model 3 vs Model Y 비교 | `/compare/model-3-vs-model-y` | `/models/model-3`, `/models/model-y` | 모델 페이지들이 비교 쿼리 경쟁 가능 | compare 페이지를 canonical 대표로 유지, 모델 페이지에서 compare 링크 강조 | 높음 |
| 테슬라 Model 3 가격 | `/models/model-3` | `/` (홈) | 홈이 Model 3 기본 선택 → 의도 분산 가능 | models/model-3에 더 구체적인 트림별 가격 정보 보강 | 높음 |
| 테슬라 Model Y 가격 | `/models/model-y` | `/` (홈) | 위와 동일 | 동일 | 높음 |
| 테슬라 보조금 신청방법 | `/guides/[보조금-가이드-slug]` | `/subsidy/seoul` 등 | 가이드가 있으면 대표 URL | 가이드 → subsidy 페이지 내부링크 | 중간 |
| 테슬라 전기차 전환 비용 | `/calc/switch-to-tesla` | `/calc/tco` | switch-to-tesla는 "현재차→테슬라 전환" 특화 | 포지셔닝 차별화 유지 | 낮음 |

---

## 내부링크 강화 권고

### 현재 내부링크 현황 (파악된 것)
- `/models/model-3` → `/models/model-y`, `/compare/...`, `/subsidy/[slug]` 4개 ✅
- `/models/model-y` → `/models/model-3`, `/compare/...`, `/subsidy/[slug]` 4개 ✅
- `/calc/monthly-real-cost` → `/calc/maintenance`, `/calc/tco`, `/calc/switch-to-tesla` ✅
- Footer → `/guides`, `/about`, `/contact` ✅

### 추가 필요 내부링크

| 출발 페이지 | 목적지 | 이유 |
|-----------|------|------|
| `/models/model-3` | `/calc/tco` | 트림 선택 후 총소유비용 확인 동선 |
| `/models/model-y` | `/calc/tco` | 동일 |
| `/models/model-3`, `/models/model-y` | `/calc/monthly-real-cost` | "할부+유지비 합산" 계산기로 연결 |
| `/calc/tco` | `/calc/monthly-real-cost` | 월 실제 부담 확인 동선 |
| `/compare/model-3-vs-model-y` | `/models/model-3`, `/models/model-y` | 비교 후 상세 페이지 이동 |
| 홈 `/` | `/data-sources` | 데이터 신뢰도 안내 |

---

## 중복/유사 콘텐츠 위험 페이지

### 주의 필요
1. **`/calc/maintenance` vs `/calc/monthly-real-cost`**  
   - maintenance: 충전비+보험+세금 → 유지비  
   - monthly-real-cost: 할부금+충전비+보험+세금 → 월 실제 부담  
   - 차이: monthly-real-cost는 할부금(금융 비용) 포함. 이 차이를 각 페이지 h1/description에서 명확히 표현해야 함.

2. **`/subsidy/[region]` 17개 페이지**  
   - 각 페이지가 지역만 다르고 구조 동일 → Googlebot이 중복 판단 가능  
   - 현재 각 페이지에 `alternates: { canonical }` 있으면 OK  
   - 추가 권고: 각 지역 페이지에 해당 지자체 고유 정보(보조금 신청처, 예산 현황 등) 1~2문단 추가

3. **가이드 중복 주제 위험**  
   - "테슬라 보조금" 주제 가이드가 여러 개면 canonical 지정 또는 통합 검토

---

## 실행 우선순위

### 즉시 실행 가능
- [ ] 홈 페이지에 `/data-sources` 링크 추가 (신뢰도 시그널)
- [ ] `/models/model-3`, `/models/model-y`에 `/calc/tco`, `/calc/monthly-real-cost` 링크 추가
- [ ] `/calc/tco`에서 `/calc/monthly-real-cost`로 CTA 추가

### GSC 데이터 확인 후
- [ ] 클릭수 낮은 subsidy/[region] 페이지 식별 → 지역 고유 정보 보강
- [ ] "테슬라 월납입금" 쿼리 대표 페이지 확인 (홈 vs monthly-real-cost)
- [ ] 검색 유입 없는 가이드 slug 식별 → 제목/설명 개선 또는 통합 검토

---

## GSC 확인 방법

1. Google Search Console → 실적 → 쿼리별 클릭수·노출 확인
2. 동일 쿼리에 두 URL이 노출되면 → 낮은 URL에서 높은 URL로 canonical 또는 내부링크 강화
3. CTR이 낮은 URL → 메타 description 개선 (계산 결과 예시 포함)
4. 노출은 있으나 클릭 없는 URL → h1/title 클릭 유도 문구 개선

---

*이 문서는 실제 GSC 데이터 없이 코드 구조 분석만으로 작성되었습니다.  
GSC에서 쿼리·클릭·노출 데이터를 확인한 후 각 항목을 업데이트하세요.*

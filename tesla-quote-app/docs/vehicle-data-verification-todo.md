# 차량 데이터 확인 필요 항목

`lib/vehicleData.js`에서 `null`로 표시된 항목 목록.  
**확인 방법**: 테슬라 공식 홈페이지(tesla.com/ko_kr) 또는 환경부 에너지소비효율 공시 기준으로 대조 후 값 입력, `lastVerifiedAt` 날짜 업데이트.

---

## 주행거리 (rangeKm) — 파일 간 충돌

| 트림 | QuoteWizard.js | models/ 페이지 | 상태 |
|------|---------------|--------------|------|
| Model 3 RWD | 382 km | 682 km | ❌ 충돌 — 확인 필요 |
| Model 3 Long Range | 538 km | 713 km | ❌ 충돌 — 확인 필요 |
| Model 3 Performance | 450 km | 528 km | ❌ 충돌 — 확인 필요 |
| Model Y RWD | 400 km | "400 km+" (불명확) | ❌ 정확한 수치 확인 필요 |
| Model Y Long Range | 505 km | 533 km | ❌ 충돌 — 확인 필요 |
| Model Y L AWD | 543 km | 543 km | ✅ 일치 — vehicleData.js에 반영 완료 |

> **주의**: 주행거리는 측정 기준(WLTP/EPA/국내 인증)에 따라 크게 다릅니다. 확인 시 기준도 함께 기재하세요.

---

## 가속 시간 (zeroToHundred) — 파일 간 충돌

| 트림 | QuoteWizard.js | models/ 페이지 | 상태 |
|------|---------------|--------------|------|
| Model 3 Long Range | 5.2초 | 5.3초 | ❌ 충돌 — 확인 필요 |
| Model Y Long Range | 4.8초 | 5.0초 | ❌ 충돌 — 확인 필요 |

---

## 최고 속도 (topSpeedKph) — 파일 간 충돌

| 트림 | QuoteWizard.js | models/ 페이지 | 상태 |
|------|---------------|--------------|------|
| Model 3 Performance | 261 km/h | 262 km/h | ❌ 충돌 — 확인 필요 |

---

## 적재 공간 (cargoLiters) — 미수집

현재 코드 어디에도 트렁크 용량(L) 데이터가 없습니다.  
필요 시 공식 사양 페이지에서 수집하여 vehicleData.js에 추가하세요.  
**절대 주행거리(km)를 적재공간(L)으로 오기재하지 마세요.**

---

## 수정 방법

1. `lib/vehicleData.js`의 해당 트림 `rangeKm`, `zeroToHundred`, `topSpeedKph` 등에 확인된 값 입력
2. `rangeStandard` 필드에 측정 기준 기재 (`"WLTP"` / `"EPA"` / `"국내인증"`)
3. `lastVerifiedAt` 필드에 확인 날짜 입력 (예: `"2026-06-26"`)
4. `QuoteWizard.js`와 `app/models/` 페이지의 하드코딩 수치를 vehicleData.js 값으로 교체

---

*생성일: 2026-06-26*

# 차량 데이터 확인 필요 항목

`lib/vehicleData.js`가 차량 스펙의 **단일 원본(Single Source of Truth)** 이다.
페이지에 수치를 직접 문자열로 적지 말고 항상 이 파일에서 파생시킨다.

**확인 방법**: 테슬라 공식 홈페이지(tesla.com/ko_kr) 또는 환경부 에너지소비효율 공시 기준으로 대조 후 값 입력, `lastVerifiedAt` 날짜 업데이트.

---

## 해결 완료 (2026-07-31)

기존에 "파일 간 충돌"로 적어둔 주행거리·가속·최고속도 항목은 **모두 vehicleData.js 파생으로 통일**되어 충돌 자체가 사라졌다.

| 항목 | 처리 |
|------|------|
| 주행거리·가속·최고속도 | `app/models/model-3`, `app/models/model-y`, `app/compare/model-3-vs-model-y` 하드코딩 제거 → vehicleData.js 파생 |
| QuoteWizard 스펙 표기 | `getTrimStats()` 사용 (이미 단일 원본) |
| 국고보조금 수치 | 비교표 하드코딩(168/170만원) 제거 → `getNationalSubsidyManwon()`으로 `data/latest.csv`에서 조회 |
| Model Y L 좌석 수 | **6인승(2+2+2) 3열**로 확정. 기존 "7인승" 표기는 오류였고 전부 수정. 2026-04-03 국내 출시 보도 기준 |
| 좌석 수 필드 | `seats` 필드 신설 (Model 3 전 트림 5, Model Y RWD·LR 5, Model Y L 6) |

---

## 남은 미확인 항목

### 적재 공간 (cargoLiters·cargo) — Model Y L만 확정

과거 페이지에 있던 **594L(Model 3) / 1,925L(Model Y L)** 표기는 출처 불명이라 삭제했다.

**Model Y L AWD는 2026-07-31 확인 완료** — `cargoLiters: 2539` + `cargo` 상세:

| 탑승 구성 | 뒤 적재공간 | 총 적재공간(프렁크 116L 포함) |
|---|---|---|
| 6명 (3열 사용) | 420L | 536L |
| 4명 (3열 폴딩) | 1,076L | 1,192L |
| 2명 (2·3열 폴딩) | 2,423L | **2,539L (최대)** |

**미확인 = Model 3 전 트림, Model Y RWD·Long Range.** 해당 페이지는 리터 수치 대신 "세단 트렁크 / 해치백 구조" 같은 정성 서술만 사용한다. 확인되면 `cargoLiters`(+ 필요 시 `cargo.configs`)에 입력하면 카드·표·본문에 자동 반영된다.

- **절대 주행거리(km)를 적재공간(L)으로 오기재하지 말 것.**
- 최대 용량 단일 숫자만 비교하지 말 것. 좌석 구성에 따라 420L~2,423L로 6배 차이가 난다.

### 좌석 수 출처 격상

`seats` 값은 국내 출시 보도 기준이다. 공식 홈페이지 스펙 표로 재확인되면 주석의 출처 표기를 갱신할 것.

---

## 수정 방법

1. `lib/vehicleData.js`의 해당 트림 필드(`rangeKm`, `zeroToHundred`, `topSpeedKph`, `cargoLiters`, `seats`)에 확인된 값 입력
2. `rangeStandard` 필드에 측정 기준 기재 (`"WLTP"` / `"EPA"` / `"KOR"`)
3. `lastVerifiedAt` 필드에 확인 날짜 입력
4. 페이지에는 값을 직접 적지 말고 vehicleData.js에서 가져다 쓸 것

---

*생성일: 2026-06-26 · 최종 수정: 2026-07-31*

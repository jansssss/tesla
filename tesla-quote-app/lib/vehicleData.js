/**
 * 차량 데이터 단일 원본 (Single Source of Truth)
 *
 * 규칙:
 * - 모든 수치는 테슬라 한국 공식 홈페이지 기준
 * - 주행거리 = 한국 환경부 복합 인증 기준 (스크린샷 공식 확인)
 * - lastVerifiedAt: 이 파일의 데이터를 마지막으로 공식 홈페이지와 대조한 날짜
 *
 * @typedef {Object} VehicleTrim
 * @property {string} id               - 내부 식별자 (예: "m3-rwd")
 * @property {string} model            - 모델명 (예: "Model 3")
 * @property {string} trim             - 트림 레이블 (예: "RWD")
 * @property {string} trimFull         - 전체 트림명 (예: "Model 3 RWD")
 * @property {string} csvModel         - subsidy CSV 파일의 모델명 키
 * @property {string} driveType        - 구동 방식 ("RWD" | "AWD")
 * @property {number} priceKrw         - 출고가(원), 보조금 미반영
 * @property {number|null} rangeKm     - 주행거리(km), 한국 환경부 복합 인증
 * @property {string|null} rangeStandard - 주행거리 측정 기준 ("WLTP" | "EPA" | "KOR" | null)
 * @property {number|null} topSpeedKph - 최고 속도(km/h)
 * @property {number|null} zeroToHundred - 0→100km/h 가속(초)
 * @property {number|null} cargoLiters - 트렁크 적재 공간(L) — 주행거리와 무관한 별개 항목
 * @property {boolean} subsidyEligible - 보조금 대상 여부 (기본 true)
 * @property {boolean} highlight       - 추천/인기 트림 여부
 * @property {string|null} lastVerifiedAt - 공식 홈페이지 마지막 확인일 (YYYY-MM-DD)
 */

/** @type {VehicleTrim[]} */
export const VEHICLE_TRIMS = [
  // ─── Model 3 ────────────────────────────────────────────────────────────────
  {
    id: "m3-rwd",
    model: "Model 3",
    trim: "RWD",
    trimFull: "Model 3 RWD",
    csvModel: "Model 3 RWD",
    driveType: "RWD",
    priceKrw: 41990000,
    rangeKm: 382,
    rangeStandard: "KOR",
    topSpeedKph: 201,
    zeroToHundred: 6.2,
    cargoLiters: null,       // 공식 홈 스펙 페이지에 미표기
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-06-26",
  },
  {
    id: "m3-lr",
    model: "Model 3",
    trim: "Long Range",
    trimFull: "Model 3 Long Range",
    csvModel: "Model 3 Premium Long Range RWD",
    driveType: "RWD",
    priceKrw: 52990000,
    rangeKm: 538,
    rangeStandard: "KOR",
    topSpeedKph: 201,
    zeroToHundred: 5.2,
    cargoLiters: null,
    subsidyEligible: true,
    highlight: true,
    lastVerifiedAt: "2026-06-26",
  },
  {
    id: "m3-perf",
    model: "Model 3",
    trim: "Performance",
    trimFull: "Model 3 Performance",
    csvModel: "Model 3 Performance",
    driveType: "AWD",
    priceKrw: 64990000,      // 2026-06-26 공식 확인: 6,499만원 (기존 5,999만원에서 인상)
    rangeKm: 450,
    rangeStandard: "KOR",
    topSpeedKph: 261,
    zeroToHundred: 3.1,
    cargoLiters: null,
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-06-26",
  },

  // ─── Model Y ────────────────────────────────────────────────────────────────
  {
    id: "my-rwd",
    model: "Model Y",
    trim: "RWD",
    trimFull: "Model Y RWD",
    csvModel: "Model Y Premium RWD",
    driveType: "RWD",
    priceKrw: 49990000,
    rangeKm: 400,
    rangeStandard: "KOR",
    topSpeedKph: 201,        // 공식 확인: 201km/h (기존 217 오류 수정)
    zeroToHundred: 5.9,
    cargoLiters: null,
    subsidyEligible: true,
    highlight: true,
    lastVerifiedAt: "2026-06-26",
  },
  {
    id: "my-lr",
    model: "Model Y",
    trim: "Long Range",
    trimFull: "Model Y Long Range",
    csvModel: "Model Y Premium Long Range",
    driveType: "AWD",
    priceKrw: 63990000,      // 2026-06-26 공식 확인: 6,399만원 (기존 5,999만원에서 인상)
    rangeKm: 505,
    rangeStandard: "KOR",
    topSpeedKph: 201,        // 공식 확인: 201km/h (기존 217 오류 수정)
    zeroToHundred: 4.8,
    cargoLiters: null,
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-06-26",
  },
  {
    id: "my-l-awd",
    model: "Model Y",
    trim: "L AWD",
    trimFull: "Model Y L AWD",
    csvModel: "Model Y L AWD",
    driveType: "AWD",
    priceKrw: 69990000,
    rangeKm: 543,
    rangeStandard: "KOR",
    topSpeedKph: 201,
    zeroToHundred: 5.0,
    cargoLiters: null,
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-06-26",
  },
];

/** ID로 단일 트림 조회 */
export function getTrimById(id) {
  return VEHICLE_TRIMS.find((t) => t.id === id) ?? null;
}

/** 특정 모델의 트림 목록 */
export function getTrimsByModel(model) {
  return VEHICLE_TRIMS.filter((t) => t.model === model);
}

/** 보조금 CSV 키 → 트림 조회 */
export function getTrimByCsvModel(csvModel) {
  return VEHICLE_TRIMS.find((t) => t.csvModel === csvModel) ?? null;
}

/** 모든 출고가 조회 (계산기 기본값 설정용) */
export const TRIM_PRICES = Object.fromEntries(
  VEHICLE_TRIMS.map((t) => [t.id, t.priceKrw])
);

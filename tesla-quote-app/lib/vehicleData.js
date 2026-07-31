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
 * @property {number|null} cargoLiters - 최대 총 적재 공간(L) = 뒤 적재공간 최대 + 프렁크
 * @property {CargoDetail|null} cargo  - 좌석 사용 구성별 적재 공간 상세
 * @property {number|null} seats      - 좌석 수(명). Model Y L은 6인승(2+2+2) 3열 구조
 * @property {boolean} subsidyEligible - 보조금 대상 여부 (기본 true)
 * @property {boolean} highlight       - 추천/인기 트림 여부
 * @property {string|null} lastVerifiedAt - 공식 홈페이지 마지막 확인일 (YYYY-MM-DD)
 */

/**
 * @typedef {Object} CargoDetail
 * @property {number} frunkL           - 프렁크 용량(L)
 * @property {CargoConfig[]} configs   - 좌석 사용 구성별 적재 용량(좁은 순 → 넓은 순)
 *
 * @typedef {Object} CargoConfig
 * @property {string} label            - 구성 설명 (예: "4명 탑승 (3열 폴딩)")
 * @property {number} rearL            - 뒤 적재공간(L)
 * @property {number} totalL           - 총 적재공간(L) = rearL + 프렁크
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
    priceKrw: 46990000,      // 2026-07-02 공식 확인: 4,699만원
    rangeKm: 382,
    rangeStandard: "KOR",
    topSpeedKph: 201,
    zeroToHundred: 6.2,
    cargoLiters: null,       // 공식 홈 스펙 페이지에 미표기
    cargo: null,
    seats: 5,
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-07-02",
  },
  {
    id: "m3-lr",
    model: "Model 3",
    trim: "Long Range",
    trimFull: "Model 3 Long Range",
    csvModel: "Model 3 Premium Long Range RWD",
    driveType: "RWD",
    priceKrw: 59990000,      // 2026-07-02 공식 확인: 5,999만원
    rangeKm: 538,
    rangeStandard: "KOR",
    topSpeedKph: 201,
    zeroToHundred: 5.2,
    cargoLiters: null,
    cargo: null,
    seats: 5,
    subsidyEligible: true,
    highlight: true,
    lastVerifiedAt: "2026-07-02",
  },
  {
    id: "m3-perf",
    model: "Model 3",
    trim: "Performance",
    trimFull: "Model 3 Performance",
    csvModel: "Model 3 Performance",
    driveType: "AWD",
    priceKrw: 69990000,      // 2026-07-02 공식 확인: 6,999만원
    rangeKm: 450,
    rangeStandard: "KOR",
    topSpeedKph: 261,
    zeroToHundred: 3.1,
    cargoLiters: null,
    cargo: null,
    seats: 5,
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-07-02",
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
    cargo: null,
    seats: 5,
    subsidyEligible: true,
    highlight: true,
    lastVerifiedAt: "2026-07-02",
  },
  {
    id: "my-lr",
    model: "Model Y",
    trim: "Long Range",
    trimFull: "Model Y Long Range",
    csvModel: "Model Y Premium Long Range",
    driveType: "AWD",
    priceKrw: 66990000,      // 2026-07-02 공식 확인: 6,699만원
    rangeKm: 505,
    rangeStandard: "KOR",
    topSpeedKph: 201,        // 공식 확인: 201km/h (기존 217 오류 수정)
    zeroToHundred: 4.8,
    cargoLiters: null,
    cargo: null,
    seats: 5,
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-07-02",
  },
  {
    id: "my-l-awd",
    model: "Model Y",
    trim: "L AWD",
    trimFull: "Model Y L AWD",
    csvModel: "Model Y L AWD",
    driveType: "AWD",
    priceKrw: 72990000,      // 2026-07-02 공식 확인: 7,299만원
    rangeKm: 543,
    rangeStandard: "KOR",
    topSpeedKph: 201,
    zeroToHundred: 5.0,
    // 적재 공간 확인일 2026-07-31. 최대(2명 탑승 + 2·3열 폴딩) = 뒤 2,423L + 프렁크 116L
    cargoLiters: 2539,
    cargo: {
      frunkL: 116,
      configs: [
        { label: "6명 탑승 (3열 사용)", rearL: 420, totalL: 536 },
        { label: "4명 탑승 (3열 폴딩)", rearL: 1076, totalL: 1192 },
        { label: "2명 탑승 (2·3열 폴딩)", rearL: 2423, totalL: 2539 },
      ],
    },
    seats: 6,          // 6인승(2+2+2) 3열 — 2026-04 국내 출시 사양
    subsidyEligible: true,
    highlight: false,
    lastVerifiedAt: "2026-07-02",
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

/**
 * 차량 데이터(가격·스펙)를 공식 홈페이지와 마지막으로 대조한 날짜(YYYY-MM-DD).
 * 보조금 데이터 기준일(snapshot.dataDate)과 분리해서 표기한다.
 */
export const VEHICLE_DATA_VERIFIED_AT = VEHICLE_TRIMS.reduce(
  (latest, t) => (t.lastVerifiedAt && t.lastVerifiedAt > latest ? t.lastVerifiedAt : latest),
  ""
);

/**
 * 화면 표기용 스펙 카드([{label,value,unit}]) 생성 — 단일 원본에서 파생.
 * @param {string} id 트림 id
 */
export function getTrimStats(id) {
  const t = getTrimById(id);
  if (!t) return [];
  return [
    { label: "주행 가능 거리", value: t.rangeKm == null ? "-" : String(t.rangeKm), unit: "km" },
    { label: "최고 속도", value: t.topSpeedKph == null ? "-" : String(t.topSpeedKph), unit: "km/h" },
    { label: "0-100 km/h", value: t.zeroToHundred == null ? "-" : String(t.zeroToHundred), unit: "초" },
  ];
}

/**
 * 경쟁 차종 참고 데이터 (아이오닉 5 · EV6)
 *
 * ⚠️ vehicleData.js와 성격이 다르다.
 * - vehicleData.js: 테슬라 공식 홈페이지를 직접 대조한 '확정 데이터'
 * - 이 파일: 타사 차량의 '참고 데이터'. 트림·연식·프로모션에 따라 자주 바뀌므로
 *   페이지에서는 반드시 "참고값이며 공식 홈페이지 확인 필요"를 함께 표기한다.
 *
 * 원칙:
 * - 정확한 트림별 가격은 적지 않는다. 구간(밴드)으로만 표기한다.
 * - 주행거리는 국내 환경부 복합 인증 기준으로 알려진 값만 적는다.
 * - 확신이 없는 값은 null로 두고 화면에서 "-"로 표기한다.
 */

/** @type {{id:string, brand:string, name:string, priceBand:string, rangeKm:number|null, note:string}[]} */
export const RIVALS = [
  {
    id: "ioniq5-std",
    brand: "현대",
    name: "아이오닉 5 스탠다드",
    priceBand: "4,700만원대~",
    rangeKm: 368,
    note: "작은 배터리 트림. 보조금 적용 시 실구매가 진입 장벽이 가장 낮은 구간.",
  },
  {
    id: "ioniq5-lr",
    brand: "현대",
    name: "아이오닉 5 롱레인지 2WD",
    priceBand: "5,000만~5,900만원대",
    rangeKm: 485,
    note: "트림(E-Lite·익스클루시브·프레스티지)에 따라 가격 폭이 크다.",
  },
  {
    id: "ev6-lr-2wd",
    brand: "기아",
    name: "EV6 롱레인지 2WD",
    priceBand: "5,000만원대",
    rangeKm: null,
    note: "2026년 가격 인하가 반영된 구간. 트림별 편차가 커 공식 가격표 확인 필요.",
  },
  {
    id: "ev6-lr-awd",
    brand: "기아",
    name: "EV6 롱레인지 AWD",
    priceBand: "5,400만원대~",
    rangeKm: 458,
    note: "사륜 구동. 800V 초급속 충전 구조를 기본으로 갖춘 것이 특징.",
  },
];

/** 경쟁 차종 데이터 마지막 확인일 — 테슬라 데이터 기준일과 분리해서 표기한다. */
export const RIVAL_DATA_VERIFIED_AT = "2026-08-10";

/** 경쟁 차종 공식 출처 (페이지 하단 sources에 공용으로 사용) */
export const RIVAL_SOURCES = [
  {
    name: "현대자동차 공식 — 아이오닉 5 가격",
    url: "https://www.hyundai.com/kr/ko/e/vehicles/ioniq5/price",
    note: "아이오닉 5 트림·가격 원본",
  },
  {
    name: "기아 공식 — EV6 가격",
    url: "https://www.kia.com/kr/vehicles/ev6/price",
    note: "EV6 트림·가격 원본",
  },
];

/** id로 조회 */
export function getRival(id) {
  return RIVALS.find((r) => r.id === id) ?? null;
}

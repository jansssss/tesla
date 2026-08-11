/**
 * 가이드 카테고리 → 가장 관련 있는 계산기로 연결하는 맥락 딥링크 매핑.
 * "구매 의사결정 플랫폼"의 핵심 동선: 모든 글이 알맞은 계산기로 흐르게 한다.
 */
import { CALCULATORS } from "@/lib/calculators";

const BY_HREF = Object.fromEntries(CALCULATORS.map((c) => [c.href, c]));

/**
 * 카테고리 문자열에서 가장 적합한 계산기 경로를 키워드로 추론.
 * 정적 guides.js 카테고리와 파이프라인/관리자 카테고리를 모두 커버한다.
 */
export function calcForCategory(category = "") {
  const c = String(category);
  if (/(유지비|세제|보험)/.test(c)) return "/calc/maintenance";
  if (/(충전)/.test(c)) return "/calc/charging";
  if (/(총소유|TCO|리스|감가)/.test(c)) return "/calc/tco";
  if (/(비교|차종|트림|차량)/.test(c)) return "/calc/compare";
  // 보조금·지역·구매·가격·금융·FSD 등 → 실구매가·월납입금(보조금 확인)
  return "/subsidy";
}

const CTA_COPY = {
  "/subsidy": {
    title: "내 지역 보조금으로 실구매가를 계산해보세요",
    desc: "거주 지역과 트림을 선택하면 보조금이 자동 적용된 실구매가와 월 납입금을 바로 확인할 수 있습니다.",
    button: "실구매가·월납입금 계산기",
  },
  "/calc/maintenance": {
    title: "이 차의 유지비를 직접 계산해보세요",
    desc: "주행거리·충전 단가·보험료·자동차세를 입력하면 월·연·5년 유지비를 바로 확인할 수 있습니다.",
    button: "유지비 계산기 바로가기",
  },
  "/calc/charging": {
    title: "월 충전비를 직접 계산해보세요",
    desc: "주행거리와 전비, 급속·완속 비율을 입력하면 월·연 충전비를 바로 확인할 수 있습니다.",
    button: "충전비 계산기 바로가기",
  },
  "/calc/tco": {
    title: "총소유비용을 직접 계산해보세요",
    desc: "감가상각과 운영비를 합산한 실제 소유 비용, 내연기관 대비 차이까지 확인할 수 있습니다.",
    button: "총소유비용 계산기 바로가기",
  },
  "/calc/compare": {
    title: "Model 3와 Model Y를 직접 비교해보세요",
    desc: "트림과 조건을 입력하면 실구매가·월납입금·유지비·5년 총비용을 한 표로 비교할 수 있습니다.",
    button: "모델 비교 계산기 바로가기",
  },
};

/** 카테고리에 맞는 계산기 CTA 정보 반환 */
export function calcCtaForCategory(category) {
  const href = calcForCategory(category);
  const calc = BY_HREF[href];
  return { href, shortLabel: calc?.shortLabel ?? "계산기", ...CTA_COPY[href] };
}

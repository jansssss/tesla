/**
 * 가이드 카테고리 표시 명칭 통일.
 * 정적 guides.js·파이프라인·관리자 글의 분열된 카테고리 라벨을
 * 데이터 수정 없이 렌더링 시점에 정규화한다.
 */
const CANONICAL = [
  { test: /(유지비|세제|보험)/, label: "유지비·세제" },
  { test: /(충전)/, label: "충전" },
  { test: /(총소유|TCO)/, label: "총소유비용" },
  { test: /(차종|트림|차량\s*비교|비교)/, label: "모델·비교" },
  { test: /(금융|옵션|리스|할부|대출)/, label: "구매·금융" },
  { test: /(가격)/, label: "가격 전략" },
  { test: /(보조금|지역)/, label: "보조금" },
  { test: /(FSD|자율주행)/, label: "FSD·자율주행" },
  { test: /(소유|관리)/, label: "소유·관리" },
  { test: /(구매)/, label: "구매 가이드" },
];

export function normalizeCategory(category = "") {
  const c = String(category).trim();
  if (!c) return "테슬라";
  for (const { test, label } of CANONICAL) {
    if (test.test(c)) return label;
  }
  return c;
}

/**
 * 중복/통합 대상 가이드의 301 리다이렉트 정의.
 *
 * 설계 원칙(되돌리기 쉬움):
 * - 원본 글 콘텐츠는 guides.js에 그대로 둔다(삭제하지 않음).
 * - URL만 canonical 글로 301 리다이렉트하고, 목록/사이트맵에서만 숨긴다.
 * - 통합을 취소하려면 아래 배열에서 해당 항목만 지우면 원상복구된다.
 *
 * 보수적 운영: Search Console 유입 데이터 확보 전까지는
 * 주제가 명백히 겹치는 항목만 통합한다. (from → to)
 */
export const MERGED_REDIRECTS = [
  // FSD·하드웨어
  { from: "fsd-real-world-korea-roads", to: "fsd-korea-status-2026" },
  { from: "autopilot-fsd-option-guide", to: "fsd-korea-status-2026" },
  { from: "fsd-transfer-cancel-guide", to: "fsd-subscription-vs-purchase" },

  // 보조금·세금 — 특정 지역·시점·자격별 얇은 글을 절차형 대표 글로 통합
  { from: "seoul-vs-naju-ev-subsidy-2026", to: "subsidy-remaining-check" },
  { from: "model3-vs-modely-subsidy-threshold-2026", to: "tesla-subsidy-apply-guide" },
  { from: "ev-tax-benefits-running-cost-guide", to: "subsidy-vs-tax-deduction" },
  { from: "youth-low-income-extra-benefit-guide", to: "tesla-subsidy-required-docs" },
  { from: "individual-vs-corporate-ev-purchase-guide", to: "subsidy-vs-tax-deduction" },
  { from: "moving-region-subsidy-strategy", to: "how-to-read-local-subsidy-notice" },
  { from: "family-name-vs-own-name-subsidy", to: "tesla-subsidy-required-docs" },
  { from: "july-subsidy-change-2026", to: "how-to-read-local-subsidy-notice" },
  { from: "regional-subsidy-top5-2026", to: "subsidy-remaining-check" },
  { from: "ev-subsidy-apply-guide", to: "tesla-subsidy-apply-guide" },
  { from: "ev-scrap-support-2026", to: "tesla-subsidy-apply-guide" },
  { from: "tesla-corporate-purchase-guide", to: "tesla-subsidy-required-docs" },

  // 모델·구매·금융
  { from: "down-payment-loan-scenario-guide", to: "tesla-monthly-payment-guide" },
  { from: "used-tesla-vs-new-tesla-guide", to: "new-vs-used-tesla-2026" },
  { from: "model-y-rwd-vs-lr-real-comparison", to: "model-y-trim-2026" },
  { from: "tesla-price-history-buying-timing", to: "tesla-purchase-process-for-beginners" },
  { from: "new-model3-2026", to: "model3-trim-comparison" },
  { from: "model-y-facelift-2026", to: "model-y-trim-2026" },
  { from: "tesla-buy-now-or-wait-2026", to: "tesla-purchase-process-for-beginners" },
  { from: "tesla-regret-prevention-guide", to: "tesla-buying-mistakes-checklist" },
  { from: "tesla-calculator-how-to-use", to: "tesla-monthly-payment-guide" },

  // 충전·보유 — 경험담형 글은 검증 가능한 조건형 대표 글로 통합
  { from: "apartment-tesla-charging-reality", to: "apartment-charging-checklist" },
  { from: "tesla-long-distance-driving-experience", to: "tesla-supercharger-charging-guide" },
  { from: "tesla-daily-life-changes", to: "tesla-ev-maintenance-cost" },
];

/** 리다이렉트로 숨겨질 원본 slug 집합 */
export const MERGED_SLUGS = new Set(MERGED_REDIRECTS.map((r) => r.from));

/** 통합된(리다이렉트) 글인지 여부 */
export function isMergedSlug(slug) {
  return MERGED_SLUGS.has(slug);
}

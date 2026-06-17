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
  // FSD 옵션 선택(구버전) → FSD 구독 vs 일시불(최신·포괄)
  { from: "autopilot-fsd-option-guide", to: "fsd-subscription-vs-purchase" },
  // 중고 vs 신차 보조금 차이(구버전) → 신차 vs 2년식 중고(최신·구체)
  { from: "used-tesla-vs-new-tesla-guide", to: "new-vs-used-tesla-2026" },
];

/** 리다이렉트로 숨겨질 원본 slug 집합 */
export const MERGED_SLUGS = new Set(MERGED_REDIRECTS.map((r) => r.from));

/** 통합된(리다이렉트) 글인지 여부 */
export function isMergedSlug(slug) {
  return MERGED_SLUGS.has(slug);
}

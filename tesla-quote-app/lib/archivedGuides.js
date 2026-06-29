/**
 * 파이프라인 자동생성 Supabase 글 명시적 차단목록(archived).
 *
 * 이 글들은 content_html을 가지고 있어 "사람 작성"과 휴리스틱으로 구분되지 않으므로
 * slug를 직접 지정해 archived 처리한다.
 *   - 목록(/guides)·사이트맵·홈·관련글·정적생성에서 제외
 *   - 직접 URL 접근 시 notFound()(404), 본문·메타·구조화데이터 미노출
 *   - 원문은 Supabase에 보관만, AI 재작성 후 재공개하지 않는다.
 *
 * 공개 유지(사람 작성)는 이 목록에 넣지 않는다: 20260619-jvovmc, 20260616-3-6.
 */
export const ARCHIVED_SUPABASE_SLUGS = new Set([
  "20260421-ioniq-3-640km-electric-hatchback-guide",
  "20260414-tesla-model3-price-cut-subsidy-2026",
]);

/** 해당 slug가 archived된 Supabase 자동생성 글인지 */
export function isArchivedSupabaseSlug(slug) {
  return ARCHIVED_SUPABASE_SLUGS.has(slug);
}

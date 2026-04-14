/**
 * 서버 전용 Supabase REST 유틸
 * anon key로 공개 데이터 조회 (RLS: SELECT 전체 허용)
 */

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * slug로 가이드 + 섹션 조회 → 정적 guides.js 포맷으로 변환
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function fetchGuideBySlug(slug) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    };

    // 가이드 메타 조회 (content_html 포함)
    const guideRes = await fetch(
      `${SUPABASE_URL}/rest/v1/guides?slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!guideRes.ok) return null;
    const guideRows = await guideRes.json();
    if (!guideRows.length) return null;
    const g = guideRows[0];

    // 섹션 조회
    const secRes = await fetch(
      `${SUPABASE_URL}/rest/v1/guide_sections?guide_id=eq.${g.id}&order=order_index.asc`,
      { headers, next: { revalidate: 3600 } }
    );
    const secRows = secRes.ok ? await secRes.json() : [];

    // 정적 guides.js 포맷으로 변환
    return {
      slug: g.slug,
      category: g.category,
      title: g.title,
      description: g.description,
      publishedAt: g.published_at,
      updatedAt: (g.updated_at || g.published_at || "").slice(0, 10),
      readTime: g.read_time,
      keyPoints: g.key_points ?? [],
      sources: g.sources ?? [],
      contentHtml: g.content_html ?? null,
      sections: secRows.map((s) => ({
        title: s.title,
        paragraphs: s.paragraphs ?? [],
        bullets: s.bullets ?? null,
        callout: s.callout ?? null,
        table: s.section_table ?? null,
      })),
    };
  } catch {
    return null;
  }
}

/**
 * 최근 발행된 가이드 목록 조회
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchRecentGuides(limit = 6) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const url = `${SUPABASE_URL}/rest/v1/guides?select=slug,category,title,description,read_time,published_at&order=published_at.desc&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      next: { revalidate: 3600 }, // 1시간 캐시
    });

    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

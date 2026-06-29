/**
 * 서버 전용 Supabase REST 유틸
 * anon key로 공개 데이터 조회 (RLS: SELECT 전체 허용)
 *
 * 공개 모델: status='published' 인 글만 노출.
 * 마이그레이션 전(status 컬럼 부재)에는 레거시(content_html 존재 - 차단목록)로 폴백해
 * 라이브 노출이 끊기지 않게 한다.
 */

import { isArchivedSupabaseSlug } from "./archivedGuides.js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function authHeaders() {
  return { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` };
}

/**
 * status='published' 글만 조회. status 컬럼이 없으면(마이그레이션 전)
 * 레거시(content_html 존재 - 차단목록)로 폴백.
 * @param {string} query  select/order/limit 등 ? 뒤 쿼리 문자열 (status 필터는 내부에서 부착)
 */
async function fetchPublishedGuides(query) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];
  const base = `${SUPABASE_URL}/rest/v1/guides?${query}`;
  try {
    const res = await fetch(`${base}&status=eq.published`, {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    });
    if (res.ok) return await res.json();
    // 폴백: status 컬럼 부재 등 → content_html 존재 글에서 차단목록 제외
    const legacy = await fetch(`${base}&content_html=not.is.null`, {
      headers: authHeaders(),
      next: { revalidate: 3600 },
    });
    if (!legacy.ok) return [];
    return (await legacy.json()).filter((g) => !isArchivedSupabaseSlug(g.slug));
  } catch {
    return [];
  }
}

/**
 * slug로 가이드 + 섹션 조회 → 정적 guides.js 포맷으로 변환
 * (공개 여부 판단은 호출부에서 status/source로 처리)
 * @param {string} slug
 * @returns {Promise<object|null>}
 */
export async function fetchGuideBySlug(slug) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return null;

  try {
    const headers = authHeaders();

    // 가이드 메타 조회 (content_html·status·source 포함)
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
      status: g.status ?? null,   // 마이그레이션 전이면 null
      source: g.source ?? null,
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
 * sitemap용 published 가이드 slug + 날짜 목록
 * @returns {Promise<Array<{slug, published_at, updated_at}>>}
 */
export async function fetchAllGuidesMeta() {
  return fetchPublishedGuides(
    "select=slug,published_at,updated_at&order=published_at.desc"
  );
}

/**
 * /guides 목록용 published 가이드 (카드 포맷)
 * @returns {Promise<Array<{slug,category,title,description,readTime,publishedAt,updatedAt}>>}
 */
export async function fetchAllGuidesForList() {
  const rows = await fetchPublishedGuides(
    "select=slug,category,title,description,read_time,published_at,updated_at&order=published_at.desc"
  );
  return rows.map((g) => ({
    slug: g.slug,
    category: g.category,
    title: g.title,
    description: g.description,
    readTime: g.read_time || "5분",
    publishedAt: (g.published_at || "").slice(0, 10),
    updatedAt: (g.updated_at || g.published_at || "").slice(0, 10),
  }));
}

/**
 * 홈 '최근 게시물'용 published 가이드
 * @param {number} limit
 */
export async function fetchRecentGuides(limit = 6) {
  return fetchPublishedGuides(
    `select=slug,category,title,description,read_time,published_at&order=published_at.desc&limit=${limit}`
  );
}

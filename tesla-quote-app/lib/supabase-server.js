/**
 * 서버 전용 Supabase REST 유틸
 * anon key로 공개 데이터 조회 (RLS: SELECT 전체 허용)
 */

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

/**
 * 최근 발행된 가이드 목록 조회
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function fetchRecentGuides(limit = 6) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) return [];

  try {
    const url = `${SUPABASE_URL}/rest/v1/guides?select=slug,category,title,description,read_time,published_at&order=created_at.desc&limit=${limit}`;
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

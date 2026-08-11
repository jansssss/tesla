import { METRO_REGIONS, calcMetroSubsidyStats } from '@/lib/regions';
import { loadSubsidySnapshot } from '@/lib/subsidy';
import { getAllGuides, GUIDES_SECTION_PUBLIC } from "@/lib/guides";
import { fetchAllGuidesMeta } from "@/lib/supabase-server";
import { getAnswerSlugs, ANSWERS_UPDATED_AT } from "@/lib/answers";

export default async function sitemap() {
  const baseUrl = 'https://www.paytesla.kr';
  const now = new Date().toISOString();

  const staticPages = [
    { url: baseUrl,                              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    // 대표 계산기 — 홈을 랜딩으로 바꾸면서 계산 도구는 /subsidy가 canonical이 됐다.
    { url: `${baseUrl}/subsidy`,                 lastModified: now, changeFrequency: 'weekly',  priority: 0.98 },
    { url: `${baseUrl}/calc`,                    lastModified: now, changeFrequency: 'weekly',  priority: 0.95 },
    { url: `${baseUrl}/models/model-3`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/models/model-y`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/models/model-y-l`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/compare/model-3-vs-model-y`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/compare/rwd-vs-awd`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${baseUrl}/calc/maintenance`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/charging`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/charging-time`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/charger-install`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/tco`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/compare`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/monthly-real-cost`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/switch-to-tesla`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/ev-purchase-readiness`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/answers`,                 lastModified: ANSWERS_UPDATED_AT, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/about`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/disclaimer`,              lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/editorial-policy`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/data-sources`,            lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // 지역별 보조금 페이지 — 광역시/특별시(si) 중 보조금 데이터가 있는 페이지만 색인.
  //  - '도(do)': 시/군/구 위임형 얇은 템플릿 → 제외
  //  - 데이터 없는(수치 0) 지역: draft 취급 → 제외
  const subsidySnapshot = loadSubsidySnapshot();
  const regionPages = METRO_REGIONS
    .filter((r) => {
      if (r.type !== 'si') return false;
      const stats = calcMetroSubsidyStats(subsidySnapshot.rows, r);
      return stats.statsByModel.some((s) => (s.max || 0) > 0);
    })
    .map((r) => ({
      url: `${baseUrl}/subsidy/${r.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  // 가이드 — 섹션 비노출(GUIDES_SECTION_PUBLIC=false) 기간에는 사이트맵에서 제외한다.
  // 개별 글은 noindex 처리되어 있으므로 사이트맵에 넣으면 신호가 충돌한다.
  let guidePages = [];
  if (GUIDES_SECTION_PUBLIC) {
    const supabaseGuides = await fetchAllGuidesMeta();
    const supabaseSlugs = new Set(supabaseGuides.map((g) => g.slug));

    const supabaseGuidePages = supabaseGuides.map((g) => ({
      url: `${baseUrl}/guides/${g.slug}`,
      lastModified: (g.updated_at || g.published_at || now).slice(0, 10),
      changeFrequency: 'monthly',
      priority: 0.8,
    }));

    // 정적 guides.js에만 있는 항목 보완
    const staticGuidePages = getAllGuides()
      .filter((g) => !supabaseSlugs.has(g.slug))
      .map((g) => ({
        url: `${baseUrl}/guides/${g.slug}`,
        lastModified: g.updatedAt || now,
        changeFrequency: 'monthly',
        priority: 0.8,
      }));

    guidePages = [...supabaseGuidePages, ...staticGuidePages];
  }

  // 구매 질문 답변 페이지 — 정적 생성되는 22개.
  const answerPages = getAnswerSlugs().map((slug) => ({
    url: `${baseUrl}/answers/${slug}`,
    lastModified: ANSWERS_UPDATED_AT,
    changeFrequency: 'monthly',
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...answerPages,
    ...regionPages,
    ...guidePages,
  ];
}

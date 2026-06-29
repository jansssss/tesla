import { METRO_REGIONS } from '@/lib/regions';
import { getAllGuides } from "@/lib/guides";
import { fetchAllGuidesMeta } from "@/lib/supabase-server";

export default async function sitemap() {
  const baseUrl = 'https://paytesla.kr';
  const now = new Date().toISOString();

  const staticPages = [
    { url: baseUrl,                              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/models/model-3`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/models/model-y`,          lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/compare/model-3-vs-model-y`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/compare/rwd-vs-awd`,      lastModified: now, changeFrequency: 'weekly',  priority: 0.85 },
    { url: `${baseUrl}/calc/maintenance`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/charging`,           lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/tco`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/compare`,            lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/monthly-real-cost`,  lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/switch-to-tesla`,    lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${baseUrl}/calc/ev-purchase-readiness`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/guides`,                  lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/about`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/disclaimer`,              lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/editorial-policy`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/data-sources`,            lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // 지역별 보조금 페이지 — 단일 수치가 있는 광역시/특별시(si)만 색인.
  // '도(do)' 페이지는 시/군/구로 위임하는 얇은 템플릿이라 noindex + 사이트맵 제외.
  const regionPages = METRO_REGIONS
    .filter((r) => r.type === 'si')
    .map((r) => ({
      url: `${baseUrl}/subsidy/${r.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.85,
    }));

  // 가이드 — Supabase 우선, 정적 파일로 보완
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

  return [
    ...staticPages,
    ...regionPages,
    ...supabaseGuidePages,
    ...staticGuidePages,
  ];
}

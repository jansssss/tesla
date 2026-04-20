import { ALL_SLUGS } from '@/lib/regions';
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
    { url: `${baseUrl}/guides`,                  lastModified: now, changeFrequency: 'daily',   priority: 0.9 },
    { url: `${baseUrl}/about`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/contact`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/privacy`,                 lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/terms`,                   lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/disclaimer`,              lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${baseUrl}/editorial-policy`,        lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
  ];

  // 지역별 보조금 페이지 (17개)
  const regionPages = ALL_SLUGS.map((slug) => ({
    url: `${baseUrl}/subsidy/${slug}`,
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

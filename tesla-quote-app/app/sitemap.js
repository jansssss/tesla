import { ALL_SLUGS } from '@/lib/regions';

export default function sitemap() {
  const baseUrl = 'https://paytesla.kr';
  const currentDate = new Date().toISOString();

  // 기존 정적 페이지 (6개)
  const staticPages = [
    { url: baseUrl,                 lastModified: currentDate, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${baseUrl}/about`,      lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`,    lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/privacy`,    lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/terms`,      lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/disclaimer`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.6 },
  ];

  // 지역별 SEO 페이지 (17개)
  const regionPages = ALL_SLUGS.map((slug) => ({
    url: `${baseUrl}/subsidy/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 모델별 페이지 (2개)
  const modelPages = [
    { url: `${baseUrl}/models/model-3`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/models/model-y`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.85 },
  ];

  // 비교 페이지 (2개)
  const comparePages = [
    { url: `${baseUrl}/compare/model-3-vs-model-y`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/compare/rwd-vs-awd`,         lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
  ];

  // 총 27개 URL
  return [...staticPages, ...regionPages, ...modelPages, ...comparePages];
}

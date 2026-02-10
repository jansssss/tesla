export default function robots() {
  const baseUrl = 'https://howmuch-tesla.kr';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

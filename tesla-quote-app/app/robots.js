export default function robots() {
  const baseUrl = 'https://paytesla.kr';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/auth/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

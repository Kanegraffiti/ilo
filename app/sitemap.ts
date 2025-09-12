import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function sitemap(): MetadataRoute.Sitemap {
  const host = headers().get('host');
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (host ? `https://${host}` : 'http://localhost:3000');
  const pages = ['','/features','/pricing','/about','/faq','/blog','/status','/privacy','/terms'];
  return pages.map((p) => ({ url: `${baseUrl}${p}`, changefreq: 'weekly', priority: p === '' ? 1 : 0.7 }));
}

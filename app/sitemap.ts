import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://ilo.example';
  const pages = ['', '/features', '/pricing', '/about', '/faq', '/blog', '/status', '/privacy', '/terms'];
  return pages.map((p) => ({ url: `${baseUrl}${p}`, changefreq: 'weekly', priority: p === '' ? 1 : 0.7 }));
}

import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default function robots(): MetadataRoute.Robots {
  const host = headers().get('host');
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    (host ? `https://${host}` : 'http://localhost:3000');
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

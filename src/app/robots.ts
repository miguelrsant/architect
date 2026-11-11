import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/site';

// /robots.txt: tudo liberado, inclusive os robôs de busca das IAs (OAI-SearchBot, Claude-SearchBot, PerplexityBot),
// com o endereço do sitemap. A rota do formulário fica de fora.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

import type { MetadataRoute } from 'next';
import { abs, pages, site } from '@/content/site';

// /sitemap.xml: a home e as páginas internas, com a data da última mudança de verdade (site.updated).
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', ...pages.map((p) => p.path)].map((path) => ({
    url: abs(path),
    lastModified: site.updated[path],
    changeFrequency: path === '/' ? 'monthly' : 'yearly',
    priority: path === '/' ? 1 : 0.5,
  }));
}

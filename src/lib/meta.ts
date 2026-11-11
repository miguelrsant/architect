// Metadados de uma página: título, descrição, canonical absoluto, a versão em Markdown e os dados de compartilhamento.
import type { Metadata } from 'next';
import { project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import { abs, site } from '@/content/site';

export function pageMeta(page: { path: string; title: string; description: string }): Metadata {
  const images = [{ url: abs(site.ogImage), width: 1200, height: 630, alt: copy.meta.ogAlt }];
  const md = page.path === '/' ? '/index.md' : `${page.path}.md`;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: abs(page.path), types: { 'text/markdown': abs(md) } },
    openGraph: { type: 'website', locale: 'pt_BR', siteName: project.name, title: page.title, description: page.description, url: abs(page.path), images },
    twitter: { card: 'summary_large_image', title: page.title, description: page.description, images },
  };
}

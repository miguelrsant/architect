// JSON-LD (schema.org): quem fez (Person), o site, o projeto (CreativeWork) e a página atual, ligados por @id.
import { brand } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import { SITE_URL, abs, site } from '@/content/site';

interface PageLd {
  path: string;
  title: string;
  description: string;
  type: 'WebPage' | 'AboutPage' | 'ContactPage';
  name?: string;
}

export function jsonLd(page: PageLd) {
  const person = `${brand.url}/#miguel`;
  const website = `${SITE_URL}/#site`;
  const work = `${SITE_URL}/#projeto`;
  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': person,
      name: brand.author,
      url: brand.url,
      jobTitle: 'Desenvolvedor full stack e designer',
      email: `mailto:${brand.email}`,
      address: { '@type': 'PostalAddress', addressLocality: 'Franca', addressRegion: 'SP', addressCountry: 'BR' },
      contactPoint: { '@type': 'ContactPoint', contactType: 'orçamentos e projetos', email: brand.email, url: `${brand.url}/contato`, availableLanguage: ['pt-BR', 'en'] },
      sameAs: [brand.instagram, brand.github, brand.linkedin],
      knowsAbout: ['desenvolvimento web', 'Next.js', 'React', 'TypeScript', 'WebGL', 'design de interface', 'motion design'],
    },
    {
      '@type': 'WebSite',
      '@id': website,
      name: site.name,
      alternateName: 'arqATLAS · Imagine. Projete. Habite.',
      url: `${SITE_URL}/`,
      description: site.description,
      inLanguage: 'pt-BR',
      author: { '@id': person },
      publisher: { '@id': person },
    },
    {
      '@type': 'CreativeWork',
      '@id': work,
      name: site.name,
      headline: 'Imagine. Projete. Habite.',
      description: site.description,
      url: `${SITE_URL}/`,
      image: abs(site.ogImage),
      inLanguage: 'pt-BR',
      genre: 'Atlas ilustrado',
      keywords: ['arquitetura', 'futuro das cidades', 'São Paulo', 'Blade Runner', 'Akira', 'Copan', 'MASP', 'Ponte Estaiada', 'Bosco Verticale', 'Shanghai Tower'],
      isAccessibleForFree: true,
      creator: { '@id': person },
      author: { '@id': person },
      codeRepository: brand.repo,
      sameAs: [brand.repo],
    },
    {
      '@type': page.type,
      '@id': `${abs(page.path)}#pagina`,
      url: abs(page.path),
      name: page.title,
      description: page.description,
      inLanguage: 'pt-BR',
      isPartOf: { '@id': website },
      about: { '@id': work },
      mainEntity: { '@id': page.type === 'WebPage' && page.path === '/' ? work : person },
      dateModified: site.updated[page.path] ?? site.updated['/'],
      primaryImageOfPage: abs(site.ogImage),
    },
  ];
  if (page.path === '/') {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE_URL}/#perguntas`,
      mainEntity: copy.faq.itens.map((i) => ({ '@type': 'Question', name: i.pergunta, acceptedAnswer: { '@type': 'Answer', text: i.resposta } })),
    });
  } else {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: site.name, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.name ?? page.title, item: abs(page.path) },
      ],
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

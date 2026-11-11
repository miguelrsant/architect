import Link from 'next/link';
import type { ReactNode } from 'react';
import { project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import type { InnerPage as Page } from '@/content/site';
import { jsonLd } from '@/lib/jsonld';
import { Footer } from './Footer';
import { JsonLd } from './JsonLd';
import styles from './InnerPage.module.css';

// Links em Markdown simples dentro dos textos: [texto](https://...) vira <a>.
function rich(text: string): ReactNode[] {
  return text.split(/(\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!m) return part;
    const externo = /^https?:/.test(m[2]);
    return (
      <a key={i} href={m[2]} {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {m[1]}
      </a>
    );
  });
}

/** Sobre, Contato e Privacidade: mesma barra, mesmo rodapé, texto em coluna de leitura. */
export function InnerPage({ page }: { page: Page }) {
  return (
    <>
      <JsonLd data={jsonLd({ path: page.path, title: page.title, description: page.description, type: page.type, name: page.eyebrow })} />
      <header className={styles.bar}>
        <div className={`wrap ${styles.barIn}`}>
          <Link className={styles.wordmark} href="/" aria-label={`${project.name}, voltar ao início`}>
            <span>{project.wordmark.light}</span>
            <b>{project.wordmark.bold}</b>
          </Link>
          <Link className={styles.back} href="/">
            <span aria-hidden="true">←</span> Início
          </Link>
        </div>
      </header>
      <main className={`wrap ${styles.main}`}>
        <p className={styles.eyebrow}>{page.eyebrow}</p>
        <h1 className={styles.h1}>{page.h1}</h1>
        <p className={styles.lead}>{page.description}</p>
        {page.blocks.map((b, i) => (
          <section key={i} className={styles.block}>
            {b.h && <h2>{b.h}</h2>}
            {b.p?.map((t, j) => <p key={j}>{rich(t)}</p>)}
            {b.list && (
              <ul>
                {b.list.map((t, j) => (
                  <li key={j}>{rich(t)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
        <p className={styles.cta}>
          <Link className="btn btn-primary" href="/">
            {copy.nav.voltarInicio}
          </Link>
        </p>
      </main>
      <Footer />
    </>
  );
}

import Link from 'next/link';
import type { Metadata } from 'next';
import { Footer } from '@/components/Footer';
import styles from '@/components/InnerPage.module.css';
import { project } from '@/content/brand';
import { pages } from '@/content/site';

export const metadata: Metadata = {
  title: { absolute: 'Página não encontrada · arqATLAS' },
  description: 'Este endereço não existe no arqATLAS.',
  robots: { index: false, follow: true },
};

// 404 no visual do site, com os caminhos de volta.
export default function NotFound() {
  return (
    <>
      <header className={styles.bar}>
        <div className={`wrap ${styles.barIn}`}>
          <Link className={styles.wordmark} href="/" aria-label={`${project.name}, voltar ao início`}>
            <span>{project.wordmark.light}</span>
            <b>{project.wordmark.bold}</b>
          </Link>
        </div>
      </header>
      <main className={`wrap ${styles.main}`}>
        <p className={styles.code}>ERRO 404</p>
        <h1 className={styles.h1}>Esta rua não está no atlas.</h1>
        <p className={styles.lead}>O endereço que você abriu não existe, ou mudou de lugar. A cidade continua logo ali.</p>
        <p className={styles.cta}>
          <Link className="btn btn-primary" href="/">
            Voltar ao início
          </Link>
        </p>
        <ul className={styles.links}>
          {pages.map((p) => (
            <li key={p.path}>
              <a href={p.path}>{p.eyebrow}</a>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}

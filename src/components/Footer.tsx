import Link from 'next/link';
import Image from 'next/image';
import { brand, project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import { pages } from '@/content/site';
import styles from './Footer.module.css';

const externo = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function Footer() {
  const t = copy.rodape;
  // Todas as fontes do site, uma vez cada: os filmes e o monotrilho, as notas da Torre e os prédios de São Paulo.
  const todas = [
    ...copy.mapa.fontes,
    ...copy.mapa.pontos.flatMap((p) => (p.fonte ? [{ ...p.fonte, sobre: p.nome }] : [])),
    ...copy.projete.notas.map((n) => ({ ...n.fonte, sobre: n.referencia })),
    ...copy.habite.moradas.map((m) => ({ ...m.fonte, sobre: m.predio })),
  ];
  const fontes = todas.filter((f, i) => todas.findIndex((g) => g.url === f.url) === i);

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.about}>
          <Link className={styles.wordmark} href="/#top" aria-label={copy.nav.voltar}>
            <span>{project.wordmark.light}</span>
            <b>{project.wordmark.bold}</b>
          </Link>
          <p>{t.sobre}</p>
          <nav className={styles.pages} aria-label={t.paginas}>
            {pages.map((p) => (
              <a key={p.path} href={p.path}>
                {p.eyebrow}
              </a>
            ))}
          </nav>
        </div>
        <div>
          <p className={styles.label}>{t.imagensTitulo}</p>
          <p className={styles.text}>{t.imagens}</p>
        </div>
        <div>
          <p className={styles.label}>{t.fontesTitulo}</p>
          <ul className={styles.sources}>
            {fontes.map((fonte) => (
              <li key={fonte.url}>
                <a href={fonte.url} {...externo}>
                  {fonte.nome}
                </a>{' '}
                <span>· {fonte.sobre}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.creditRow}>
        <div className={`wrap ${styles.credit}`}>
          <a className={styles.dev} href={brand.url} {...externo}>
            <Image src={brand.logoSrc} alt={brand.logoAlt} width={48} height={48} className={styles.logo} />
            <span className={styles.devName}>
              <small>{t.desenvolvidoPor}</small>
              <strong>{brand.author}</strong>
            </span>
            <span className={styles.site}>
              {brand.site} <span aria-hidden="true">↗</span>
            </span>
          </a>
          <nav className={styles.social} aria-label={t.redes}>
            <a href={brand.instagram} {...externo}>
              Instagram
            </a>
            <a href={brand.linkedin} {...externo}>
              LinkedIn
            </a>
            <a href={brand.github} {...externo}>
              GitHub
            </a>
            <a href={brand.repo} {...externo}>
              {t.codigo}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}

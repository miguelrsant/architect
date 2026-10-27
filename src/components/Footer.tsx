import Image from 'next/image';
import { brand, project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import styles from './Footer.module.css';

const externo = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function Footer() {
  const t = copy.rodape;
  const fontes = copy.capitulos.lista.flatMap((c) => c.fontes.map((fonte) => ({ ...fonte, predio: c.predio })));

  return (
    <footer className={styles.footer}>
      <div className={`wrap ${styles.grid}`}>
        <div className={styles.about}>
          <a className={styles.wordmark} href="#top" aria-label={copy.nav.voltar}>
            <span>{project.wordmark.light}</span>
            <b>{project.wordmark.bold}</b>
          </a>
          <p>{t.sobre}</p>
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
                <span>· {fonte.predio}</span>
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
              <small>{t.feitoPor}</small>
              <strong>{brand.author}</strong>
            </span>
            <span className={styles.site}>
              {brand.site} <span aria-hidden="true">↗</span>
            </span>
          </a>
          <nav className={styles.social} aria-label={t.redes}>
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

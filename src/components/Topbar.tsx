'use client';

import { useEffect, useRef } from 'react';
import { project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import styles from './Topbar.module.css';

export function Topbar() {
  const ref = useRef<HTMLElement>(null);

  // Transparente sobre a ilustração; fica sólida depois de ~30% da altura da tela.
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const onScroll = () => bar.classList.toggle(styles.solid, window.scrollY > window.innerHeight * 0.3);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={styles.topbar} ref={ref}>
      <div className={`wrap ${styles.nav}`}>
        <div className={styles.inner}>
          <a className={styles.logo} href="#top" aria-label={copy.nav.voltar}>
            <span>{project.wordmark.light}</span>
            <b>{project.wordmark.bold}</b>
          </a>
          <nav className={styles.links} aria-label={copy.nav.rotulo}>
            {copy.nav.links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <a className="btn btn-primary" href={copy.nav.cta.href}>
          {copy.nav.cta.label}{' '}
          <span className="arr" aria-hidden="true">
            →
          </span>
        </a>
      </div>
    </header>
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import styles from './Topbar.module.css';

/**
 * O ato da vez, pela linha de leitura a 40% da tela: Imagine até a Torre chegar, depois Projete e Habite;
 * nas perguntas e no convite, nenhum. Devolve o href do link do menu.
 */
function atoDaVez(): string | null {
  const linha = window.innerHeight * 0.4;
  const projete = document.getElementById('projete')?.getBoundingClientRect();
  const habite = document.getElementById('habite')?.getBoundingClientRect();
  if (!projete || !habite) return null;
  if (projete.top > linha) return '#top';
  if (projete.bottom > linha) return '#projete';
  if (habite.bottom > linha) return '#habite';
  return null;
}

export function Topbar() {
  const ref = useRef<HTMLElement>(null);
  const [agora, setAgora] = useState<string | null>(null);

  // Transparente sobre a ilustração; fica sólida depois de ~30% da altura da tela.
  useEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    let frame = 0;
    const medir = () => {
      frame = 0;
      bar.classList.toggle(styles.solid, window.scrollY > window.innerHeight * 0.3);
      setAgora(atoDaVez());
    };
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
    };
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
              <a key={link.href} href={link.href} aria-current={agora === link.href ? 'location' : undefined}>
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

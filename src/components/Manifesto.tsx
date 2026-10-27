'use client';

import { useEffect, useRef } from 'react';
import { copy } from '@/content/copy.pt-BR';
import { litWords } from '@/lib/daynight';
import { Emphasis } from './Emphasis';
import { Meta } from './Meta';
import styles from './Manifesto.module.css';

const words = copy.manifesto.texto.split(/\s+/);

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);

  // As palavras acendem conforme a linha de leitura passa por elas.
  useEffect(() => {
    const text = ref.current;
    if (!text) return;
    const spans = Array.from(text.querySelectorAll<HTMLElement>('[data-w]'));
    const light = (n: number) => spans.forEach((s, i) => s.classList.toggle(styles.on, i < n));
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      light(spans.length);
      return;
    }

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = text.getBoundingClientRect();
      light(litWords(r.top, r.height, window.innerHeight, spans.length));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <section className={styles.manifesto} aria-label={copy.manifesto.rotulo}>
      <div className="wrap">
        <Meta items={copy.manifesto.meta} className={styles.meta} />
        <p className={styles.reveal} ref={ref}>
          {words.map((word, i) => (
            <span key={i}>
              {i > 0 && ' '}
              <span data-w="" className={styles.word}>
                {word}
              </span>
            </span>
          ))}
        </p>
        <p className={styles.closing}>
          <Emphasis {...copy.manifesto.fecho} />
        </p>
      </div>
    </section>
  );
}

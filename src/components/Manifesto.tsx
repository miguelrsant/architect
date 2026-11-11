'use client';

import { useEffect, useRef } from 'react';
import { copy } from '@/content/copy.pt-BR';
import { litWords } from '@/lib/daynight';
import { Meta } from './Meta';
import styles from './Manifesto.module.css';

// A frase, palavra por palavra; as do trecho em destaque acendem em itálico rosa.
const { texto, destaque } = copy.manifesto.texto;
const inicio = texto.indexOf(destaque);
const palavras = Array.from(texto.matchAll(/\S+/g), (m) => ({ palavra: m[0], destaque: inicio >= 0 && m.index >= inicio }));

/** Ato 2, a frase: as palavras acendem conforme a linha de leitura passa por elas. */
export function Manifesto() {
  const secao = useRef<HTMLElement>(null);
  const ref = useRef<HTMLParagraphElement>(null);

  // Sem JavaScript (ou com movimento reduzido) a frase fica inteira acesa; com ele, apaga e acende rolando.
  useEffect(() => {
    const sec = secao.current;
    const text = ref.current;
    if (!sec || !text || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const spans = Array.from(text.querySelectorAll<HTMLElement>('[data-w]'));
    const light = (n: number) => spans.forEach((s, i) => s.classList.toggle(styles.on, i < n));
    sec.dataset.acende = '';

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
      delete sec.dataset.acende;
    };
  }, []);

  return (
    <section className={styles.manifesto} ref={secao} aria-label={copy.manifesto.rotulo}>
      <div className="wrap">
        <Meta items={copy.manifesto.meta} className={styles.meta} />
        <p className={styles.reveal} ref={ref}>
          {palavras.map((p, i) => (
            <span key={i}>
              {i > 0 && ' '}
              <span data-w="" className={p.destaque ? `${styles.word} ${styles.destaque}` : styles.word}>
                {p.palavra}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

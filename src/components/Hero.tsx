'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import megacidade from '@/assets/megacidade.jpg';
import megacidadeRetrato from '@/assets/megacidade-retrato.jpg';
import { copy } from '@/content/copy.pt-BR';
import { heroProgress, smoothstep } from '@/lib/daynight';
import { Meta } from './Meta';
import { TallSource } from './TallSource';
import styles from './Hero.module.css';

// Largura com que a ilustração aparece: a moldura passa da tela (parallax) e a imagem
// cobre pela altura quando a tela é mais estreita que ~2:1 (deitada) ou ~4:5 (em pé, recorte 3:4).
const SIZES = '(max-aspect-ratio: 49/25) 202vh, 106vw';
// 82vh (e não os 87vh exatos) faz o celular comum pedir a versão de 1200px em vez da de 1920px: ~40% menos
// bytes na imagem do LCP, com 5% de ampliação que o grão da arte esconde.
const SIZES_EM_PE = '(max-aspect-ratio: 4/5) 82vh, 106vw';

/** Abertura, ato 1 (Imagine): a Megacidade que a ficção sonhou, e o caminho do site no título. */
export function Hero() {
  const t = copy.imagine;
  const ref = useRef<HTMLElement>(null);

  // Rolando, a cidade se aproxima e escurece até virar o fundo da frase; o ponteiro dá um parallax leve.
  useEffect(() => {
    const hero = ref.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--p', smoothstep(heroProgress(r.top, r.height)).toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onPointer = (e: PointerEvent) => {
      hero.style.setProperty('--mx', `${((e.clientX / window.innerWidth - 0.5) * -14).toFixed(1)}px`);
      hero.style.setProperty('--my', `${((e.clientY / window.innerHeight - 0.5) * -8).toFixed(1)}px`);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    hero.addEventListener('pointermove', onPointer);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      hero.removeEventListener('pointermove', onPointer);
    };
  }, []);

  return (
    <section className={styles.hero} id="top" ref={ref} aria-labelledby="hero-titulo">
      <div className={styles.art}>
        <div className={styles.stack}>
          <picture className="fill-picture">
            <TallSource src={megacidadeRetrato} sizes={SIZES_EM_PE} />
            <Image
              src={megacidade}
              alt={t.alt}
              fill
              sizes={SIZES}
              quality={85}
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              className={styles.img}
            />
          </picture>
        </div>
      </div>
      <div className={styles.shade} aria-hidden="true" />
      <div className={styles.fade} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className={styles.copy}>
        <h1 className={styles.titulo} id="hero-titulo">
          {t.titulo.map((item, i) => (
            <span key={item.verbo} className={styles.linha} data-agora={i === 0 || undefined}>
              <span className={styles.n} aria-hidden="true">
                {item.n}
              </span>
              <span className={styles.word}>{item.verbo}</span>
              {i < t.titulo.length - 1 && ' '}
            </span>
          ))}
        </h1>
        <p className={styles.apoio}>{t.apoio}</p>
        <Meta items={t.meta} className={styles.meta} />
      </div>
    </section>
  );
}

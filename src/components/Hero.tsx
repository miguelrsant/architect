'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import noite from '@/assets/sao-paulo-2080-noite.jpg';
import noiteRetrato from '@/assets/sao-paulo-2080-noite-retrato.jpg';
import porDoSol from '@/assets/sao-paulo-2080-por-do-sol.jpg';
import porDoSolRetrato from '@/assets/sao-paulo-2080-por-do-sol-retrato.jpg';
import { copy } from '@/content/copy.pt-BR';
import { dayNight, heroProgress, smoothstep } from '@/lib/daynight';
import { Meta } from './Meta';
import { TallSource } from './TallSource';
import styles from './Hero.module.css';

// Largura com que a ilustração aparece: a moldura passa da tela (parallax) e a imagem
// cobre pela altura quando a tela é mais estreita que ~2:1 (deitada) ou ~4:5 (em pé, recorte 3:4).
const SIZES = '(max-aspect-ratio: 49/25) 202vh, 106vw';
const SIZES_EM_PE = '(max-aspect-ratio: 4/5) 87vh, 106vw';

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // O scroll leva a cena do pôr do sol à noite; o ponteiro dá um parallax leve.
  useEffect(() => {
    const hero = ref.current;
    if (!hero || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const r = hero.getBoundingClientRect();
      const p = heroProgress(r.top, r.height);
      const { night, glow } = dayNight(p);
      hero.style.setProperty('--p', smoothstep(p).toFixed(4));
      hero.style.setProperty('--night', night.toFixed(3));
      hero.style.setProperty('--glow', glow.toFixed(3));
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
            <TallSource src={porDoSolRetrato} sizes={SIZES_EM_PE} />
            <Image
              src={porDoSol}
              alt={copy.hero.alt}
              fill
              sizes={SIZES}
              quality={85}
              loading="eager"
              fetchPriority="high"
              placeholder="blur"
              className={styles.img}
            />
          </picture>
          <picture className="fill-picture">
            <TallSource src={noiteRetrato} sizes={SIZES_EM_PE} />
            <Image
              src={noite}
              alt=""
              aria-hidden="true"
              fill
              sizes={SIZES}
              quality={85}
              fetchPriority="low"
              className={`${styles.img} ${styles.night}`}
            />
          </picture>
        </div>
      </div>
      <div className={styles.dusk} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.fade} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className={styles.copy}>
        <h1 className="headline" id="hero-titulo">
          {copy.hero.titulo.map((word, i) => (
            <span key={word}>
              {i > 0 && ' '}
              <span className={styles.word}>{word}</span>
            </span>
          ))}
        </h1>
        <Meta items={copy.hero.meta} className={styles.meta} />
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import noite from '@/assets/sao-paulo-2080-noite.jpg';
import porDoSol from '@/assets/sao-paulo-2080-por-do-sol.jpg';
import { copy } from '@/content/copy.pt-BR';
import { dayNight, heroProgress, smoothstep } from '@/lib/daynight';
import { Meta } from './Meta';
import styles from './Hero.module.css';

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
      hero.style.setProperty('--fade', (0.45 + p * 0.55).toFixed(3));
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
          <Image
            src={porDoSol}
            alt={copy.hero.alt}
            fill
            sizes="100vw"
            quality={85}
            preload
            placeholder="blur"
            className={styles.img}
          />
          <Image
            src={noite}
            alt=""
            aria-hidden="true"
            fill
            sizes="100vw"
            quality={85}
            className={`${styles.img} ${styles.night}`}
          />
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

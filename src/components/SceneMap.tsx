'use client';

import Image from 'next/image';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import porDoSol from '@/assets/sao-paulo-2080-por-do-sol.jpg';
import { copy, type Ponto } from '@/content/copy.pt-BR';
import { Emphasis } from './Emphasis';
import styles from './SceneMap.module.css';

const CARD_ID = 'mapa-cartao';

const position = (p: Ponto) => ({ '--x': `${p.x}%`, '--y': `${p.y}%`, '--i': p.n }) as CSSProperties;

// O cartão abre para dentro da imagem: perto da borda ele se alinha ao ponto em vez de centralizar.
function cardPlacement(p: Ponto): string {
  const h = p.x < 30 ? styles.alignStart : p.x > 70 ? styles.alignEnd : styles.alignCenter;
  const v = p.y > 48 ? styles.above : styles.below;
  return `${h} ${v}`;
}

export function SceneMap() {
  const t = copy.mapa;
  const [aberto, setAberto] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Fecha com Esc ou com um toque fora do mapa.
  useEffect(() => {
    if (aberto === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAberto(null);
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setAberto(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
    };
  }, [aberto]);

  const selo = (p: Ponto) => (p.selo === 'existe' ? t.legenda.existe : t.legenda.futuro);
  const ponto = t.pontos.find((p) => p.n === aberto);

  return (
    <section id="mapa" className={styles.section} aria-labelledby="mapa-titulo">
      <div className="wrap">
        <p className="eyebrow">
          <i className="sq" aria-hidden="true" /> {t.eyebrow}
        </p>
        <h2 className="h2" id="mapa-titulo">
          <Emphasis {...t.titulo} />
        </h2>
        <div className={styles.head}>
          <p className="lead">{t.lead}</p>
          <p className={styles.legend}>
            <span className="chip chip-real">{t.legenda.existe}</span>
            <span className="chip chip-future">{t.legenda.futuro}</span>
          </p>
        </div>
      </div>

      <div className={styles.frame}>
        <div className={styles.map} ref={ref}>
          {/* Os pontos ficam numa camada do tamanho exato da imagem; o cartão vem depois dela. */}
          <div className={styles.stage}>
            <div className={styles.art}>
              <Image
                src={porDoSol}
                alt={t.alt}
                fill
                sizes="(max-width: 1352px) 100vw, 1320px"
                placeholder="blur"
                className={styles.img}
              />
            </div>
            {t.pontos.map((p) => {
              const open = aberto === p.n;
              return (
                <button
                  key={p.n}
                  type="button"
                  className={[styles.pin, p.selo === 'existe' ? styles.real : styles.future, open && styles.open]
                    .filter(Boolean)
                    .join(' ')}
                  style={position(p)}
                  aria-expanded={open}
                  aria-controls={open ? CARD_ID : undefined}
                  aria-label={`${p.n}. ${p.nome} (${selo(p)})`}
                  onClick={() => setAberto(open ? null : p.n)}
                >
                  {p.n}
                </button>
              );
            })}
          </div>
          {ponto && (
            <div id={CARD_ID} className={`${styles.card} ${cardPlacement(ponto)}`} style={position(ponto)}>
              <span className={`chip ${ponto.selo === 'existe' ? 'chip-real' : 'chip-future'}`}>{selo(ponto)}</span>
              <p className={styles.cardTitle}>
                <span className={styles.cardNumber}>{ponto.n}</span> {ponto.nome}
              </p>
              <p className={styles.cardText}>{ponto.texto}</p>
              {ponto.capitulo && (
                <a className={styles.cardLink} href={`#${ponto.capitulo}`} onClick={() => setAberto(null)}>
                  {t.irPara} <span aria-hidden="true">→</span>
                </a>
              )}
              <button type="button" className={styles.close} aria-label={t.fechar} onClick={() => setAberto(null)}>
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

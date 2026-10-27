'use client';

import Image from 'next/image';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import porDoSol from '@/assets/sao-paulo-2080-por-do-sol.jpg';
import { copy, type Ponto } from '@/content/copy.pt-BR';
import { Emphasis } from './Emphasis';
import styles from './SceneMap.module.css';

const CARD_ID = 'mapa-cartao';

/** Celular em pé (a mesma regra do CSS): o mapa vira imagem parada no topo + lista dos pontos. */
const CELULAR = '(max-width: 720px) and (orientation: portrait)';
/** No celular, quanto a cena se aproxima do ponto da vez. */
const ZOOM = 1.4;
/** O item que passa a até esta distância (px) da base da imagem é o da vez. */
const LINHA = 48;

const position = (p: Ponto) => ({ '--x': `${p.x}%`, '--y': `${p.y}%`, '--i': p.n }) as CSSProperties;
const itemId = (n: number) => `mapa-ponto-${n}`;

// O cartão abre para dentro da imagem: perto da borda ele se alinha ao ponto em vez de centralizar.
function cardPlacement(p: Ponto): string {
  const h = p.x < 30 ? styles.alignStart : p.x > 70 ? styles.alignEnd : styles.alignCenter;
  const v = p.y > 48 ? styles.above : styles.below;
  return `${h} ${v}`;
}

// Leva o ponto para o meio da moldura sem mostrar a borda da imagem (o deslocamento é em % da própria cena).
function camera(p: Ponto): CSSProperties {
  const eixo = (v: number) => `${(Math.min(0, Math.max(1 - ZOOM, 0.5 - (ZOOM * v) / 100)) * 100).toFixed(2)}%`;
  return { '--zoom': ZOOM, '--cx': eixo(p.x), '--cy': eixo(p.y) } as CSSProperties;
}

// O item da lista que acabou de passar pela base da imagem (parada no topo) é o da vez.
function daVezNaLista(view: HTMLElement, lista: HTMLElement): number | null {
  const r = view.getBoundingClientRect();
  if (r.top > parseFloat(getComputedStyle(view).top) + 1) return null; // a imagem ainda não chegou ao topo: cena inteira
  let n: number | null = null;
  for (const item of lista.children) {
    if (item.getBoundingClientRect().top > r.bottom + LINHA) break;
    n = Number((item as HTMLElement).dataset.n);
  }
  return n;
}

export function SceneMap() {
  const t = copy.mapa;
  const [aberto, setAberto] = useState<number | null>(null);
  const [ativo, setAtivo] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLOListElement>(null);

  // No celular a imagem fica parada no topo enquanto a lista passa por baixo dela, e o ponto da vez acende.
  useEffect(() => {
    const mq = window.matchMedia(CELULAR);
    let frame = 0;
    const medir = () => {
      frame = 0;
      const v = view.current;
      const l = lista.current;
      setAtivo(mq.matches && v && l ? daVezNaLista(v, l) : null);
    };
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };
    const ligar = () => {
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      if (mq.matches) {
        window.addEventListener('scroll', agendar, { passive: true });
        window.addEventListener('resize', agendar);
      }
      agendar();
    };
    ligar();
    mq.addEventListener('change', ligar);
    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener('change', ligar);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
    };
  }, []);

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

  // No computador o ponto abre o cartão; no celular ele desce até o item da lista.
  const tocar = (p: Ponto) => {
    if (window.matchMedia(CELULAR).matches) {
      document.getElementById(itemId(p.n))?.scrollIntoView({ block: 'start' });
      return;
    }
    setAberto(aberto === p.n ? null : p.n);
  };

  const selo = (p: Ponto) => (p.selo === 'existe' ? t.legenda.existe : t.legenda.futuro);
  const anel = (p: Ponto) => (p.selo === 'existe' ? styles.real : styles.future);
  const ponto = t.pontos.find((p) => p.n === aberto);
  const daVez = t.pontos.find((p) => p.n === ativo);

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
        <div className={`${styles.map} ${daVez ? styles.tour : ''}`} ref={ref}>
          {/* Os pontos ficam numa camada do tamanho exato da imagem; o cartão vem depois dela. */}
          <div className={styles.view} ref={view}>
            <div className={styles.stage} style={daVez ? camera(daVez) : undefined}>
              <div className={styles.art}>
                <Image
                  src={porDoSol}
                  alt={t.alt}
                  fill
                  sizes={`${CELULAR} ${Math.round(ZOOM * 100)}vw, (max-width: 1352px) 100vw, 1320px`}
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
                    className={[styles.pin, anel(p), open && styles.open].filter(Boolean).join(' ')}
                    style={position(p)}
                    aria-expanded={open}
                    aria-controls={open ? CARD_ID : undefined}
                    aria-current={ativo === p.n || undefined}
                    aria-label={`${p.n}. ${p.nome} (${selo(p)})`}
                    onClick={() => tocar(p)}
                  >
                    {p.n}
                  </button>
                );
              })}
            </div>
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
          {/* Celular: os mesmos pontos em lista, um embaixo do outro. */}
          <ol className={styles.lista} ref={lista}>
            {t.pontos.map((p) => (
              <li
                key={p.n}
                id={itemId(p.n)}
                data-n={p.n}
                className={`${styles.item} ${anel(p)}`}
                aria-current={ativo === p.n || undefined}
              >
                <span className={styles.itemNumber}>{p.n}</span>
                <div className={styles.itemBody}>
                  <p className={styles.itemHead}>
                    <span className={styles.itemName}>{p.nome}</span>
                    <span className={`chip ${p.selo === 'existe' ? 'chip-real' : 'chip-future'}`}>{selo(p)}</span>
                  </p>
                  <p className={styles.cardText}>{p.texto}</p>
                  {p.capitulo && (
                    <a className={styles.cardLink} href={`#${p.capitulo}`}>
                      {t.irPara} <span aria-hidden="true">→</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

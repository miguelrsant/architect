'use client';

import Image from 'next/image';
import { type CSSProperties, useEffect, useRef, useState } from 'react';
import megacidade from '@/assets/megacidade.jpg';
import { copy, type Ponto } from '@/content/copy.pt-BR';
import { passoDaVez, veuSaida } from '@/lib/cena';
import { Emphasis } from './Emphasis';
import { LEITURA } from './useCena';
import { useEntrada } from './useEntrada';
import styles from './SceneMap.module.css';

const CARD_ID = 'mapa-cartao';

/** Celular em pé (a mesma regra do CSS): os pontos viram cartões. */
const CELULAR = '(max-width: 720px) and (orientation: portrait)';
/**
 * Com movimento, a Megacidade fica fixada na tela inteira, os cartões sobem por cima dela e a câmera anda
 * pela cidade até o ponto da vez. Sem movimento, a imagem inteira fica parada no topo e a lista passa embaixo.
 */
const COM_MOVIMENTO = '(prefers-reduced-motion: no-preference)';
/** Sem movimento: o item que passa a até esta distância (px) da base da imagem é o da vez. */
const LINHA = 48;

const position = (p: Ponto) => ({ '--x': `${p.x}%`, '--y': `${p.y}%`, '--i': p.n }) as CSSProperties;
const itemId = (n: number) => `mapa-ponto-${n}`;

function Fonte({ nome, url }: { nome: string; url: string }) {
  return (
    <p className={styles.cardFonte}>
      {copy.mapa.fonte}:{' '}
      <a href={url} target="_blank" rel="noreferrer">
        {nome}
      </a>
    </p>
  );
}

// O cartão abre para dentro da imagem: perto da borda ele se alinha ao ponto em vez de centralizar.
function cardPlacement(p: Ponto): string {
  const h = p.x < 30 ? styles.alignStart : p.x > 70 ? styles.alignEnd : styles.alignCenter;
  const v = p.y > 48 ? styles.above : styles.below;
  return `${h} ${v}`;
}

// O ponto da vez no celular, só com a cena já no topo. Com movimento, é o último cartão que passou da linha
// de leitura (como na Torre); sem movimento, o último item que passou pela base da imagem parada.
function daVezNaLista(view: HTMLElement, lista: HTMLElement, sobre: boolean): number | null {
  const r = view.getBoundingClientRect();
  if (r.top > parseFloat(getComputedStyle(view).top) + 1) return null; // a imagem ainda não chegou ao topo
  const itens = Array.from(lista.children) as HTMLElement[];
  const topos = itens.map((li) => (sobre ? (li.firstElementChild ?? li) : li).getBoundingClientRect().top);
  const i = passoDaVez(topos, sobre ? window.innerHeight * LEITURA : r.bottom + LINHA);
  return i < 0 ? null : Number(itens[i].dataset.n);
}

/** Ato 1, o que a ficção acertou: a Megacidade com seis pontos, do que já chegou ao que ainda é sonho. */
export function SceneMap() {
  const t = copy.mapa;
  const [aberto, setAberto] = useState<number | null>(null);
  const [ativo, setAtivo] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const view = useRef<HTMLDivElement>(null);
  const lista = useRef<HTMLOListElement>(null);

  // Os pontos entram em sequência quando a cena chega na tela.
  const entrada = useEntrada(view);

  // No celular a imagem fica parada e os pontos passam em cartões; o ponto da vez acende. Com movimento, a
  // cena apaga antes de soltar (o véu de noite), e o Projete começa no escuro, sem corte de imagem para imagem.
  // Ela chega acesa: antes dela vem o título do mapa, não outra imagem.
  useEffect(() => {
    const mq = window.matchMedia(CELULAR);
    const mov = window.matchMedia(COM_MOVIMENTO);
    let frame = 0;
    const medir = () => {
      frame = 0;
      const v = view.current;
      const l = lista.current;
      const m = ref.current;
      if (!mq.matches || !v || !l || !m) {
        setAtivo(null);
        v?.style.removeProperty('--veu');
        return;
      }
      setAtivo(daVezNaLista(v, l, mov.matches));
      if (mov.matches) {
        const r = m.getBoundingClientRect();
        const falta = r.height - v.offsetHeight - (parseFloat(getComputedStyle(v).top) - r.top);
        v.style.setProperty('--veu', veuSaida(falta, window.innerHeight).toFixed(3));
      } else {
        v.style.removeProperty('--veu');
      }
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
    mov.addEventListener('change', agendar);
    return () => {
      cancelAnimationFrame(frame);
      mq.removeEventListener('change', ligar);
      mov.removeEventListener('change', agendar);
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

  // No computador o ponto abre o cartão. No celular ele leva ao cartão dele: com movimento, o cartão para
  // logo acima da linha de leitura, por cima da cena; sem movimento, o item fica logo abaixo da imagem.
  const tocar = (p: Ponto) => {
    if (window.matchMedia(CELULAR).matches) {
      const item = document.getElementById(itemId(p.n));
      if (!item) return;
      if (window.matchMedia(COM_MOVIMENTO).matches) {
        const cartao = (item.firstElementChild ?? item).getBoundingClientRect();
        window.scrollTo({ top: window.scrollY + cartao.top - window.innerHeight * (LEITURA - 0.15) });
      } else {
        item.scrollIntoView({ block: 'start' });
      }
      return;
    }
    setAberto(aberto === p.n ? null : p.n);
  };

  const selo = (p: Ponto) => (p.selo === 'existe' ? t.legenda.existe : t.legenda.ficcao);
  const anel = (p: Ponto) => (p.selo === 'existe' ? styles.real : styles.future);
  const ponto = t.pontos.find((p) => p.n === aberto);
  const daVez = t.pontos.find((p) => p.n === ativo);

  return (
    <section id="mapa" className={styles.section} aria-labelledby="mapa-titulo">
      <div className="wrap">
        <p className="eyebrow">
          <i className="sq" aria-hidden="true" /> {copy.imagine.numero} · {t.eyebrow}
        </p>
        <h2 className="h2" id="mapa-titulo">
          <Emphasis {...t.titulo} />
        </h2>
        <div className={styles.head}>
          <div className={styles.texto}>
            <p className="lead">{t.lead}</p>
            <p className={styles.cardFonte}>
              {t.fonte}s:{' '}
              {t.fontes.map((f, i) => (
                <span key={f.url}>
                  {i > 0 && ' · '}
                  <a href={f.url} target="_blank" rel="noreferrer">
                    {f.nome}
                  </a>{' '}
                  ({f.sobre})
                </span>
              ))}
            </p>
          </div>
          <p className={styles.legend}>
            <span className="chip chip-real">{t.legenda.existe}</span>
            <span className="chip chip-future">{t.legenda.ficcao}</span>
          </p>
        </div>
      </div>

      <div className={styles.frame}>
        <div className={`${styles.map} ${daVez ? styles.tour : ''}`} ref={ref} data-entrada={entrada}>
          {/* Os pontos ficam numa camada do tamanho exato da imagem; o cartão vem depois dela. */}
          <div className={styles.view} ref={view}>
            {/* --cx: a câmera do celular leva o ponto da vez (em % da largura da arte) para o meio da tela */}
            <div className={styles.stage} style={{ '--cx': String(daVez?.x ?? 50) } as CSSProperties}>
              <div className={styles.art}>
                <Image
                  src={megacidade}
                  alt={t.alt}
                  fill
                  sizes={`${CELULAR} and ${COM_MOVIMENTO} calc((100vh - 60px) * 1.8), (max-width: 1352px) 100vw, 1320px`}
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
              {/* Celular com movimento: o nome do ponto da vez, em cima dele */}
              {daVez && (
                <span key={daVez.n} className={`${styles.rotulo} ${anel(daVez)}`} style={position(daVez)} aria-hidden="true">
                  {daVez.nome}
                </span>
              )}
            </div>
          </div>
          {ponto && (
            <div id={CARD_ID} className={`${styles.card} ${cardPlacement(ponto)}`} style={position(ponto)}>
              <span className={`chip ${ponto.selo === 'existe' ? 'chip-real' : 'chip-future'}`}>{selo(ponto)}</span>
              <p className={styles.cardTitle}>
                <span className={styles.cardNumber}>{ponto.n}</span> {ponto.nome}
              </p>
              <p className={styles.cardText}>{ponto.texto}</p>
              {ponto.fonte && <Fonte {...ponto.fonte} />}
              <button type="button" className={styles.close} aria-label={t.fechar} onClick={() => setAberto(null)}>
                ×
              </button>
            </div>
          )}
          {/* Celular: os mesmos pontos em cartões, um depois do outro. */}
          <ol className={styles.lista} ref={lista}>
            {t.pontos.map((p) => (
              <li
                key={p.n}
                id={itemId(p.n)}
                data-n={p.n}
                className={`${styles.item} ${anel(p)}`}
                aria-current={ativo === p.n || undefined}
              >
                <div className={styles.itemCard}>
                  <span className={styles.itemNumber}>{p.n}</span>
                  <div className={styles.itemBody}>
                    <p className={styles.itemHead}>
                      <span className={styles.itemName}>{p.nome}</span>
                      <span className={`chip ${p.selo === 'existe' ? 'chip-real' : 'chip-future'}`}>{selo(p)}</span>
                    </p>
                    <p className={styles.cardText}>{p.texto}</p>
                    {p.fonte && <Fonte {...p.fonte} />}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

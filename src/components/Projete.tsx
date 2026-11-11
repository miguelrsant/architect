'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import desenhoParado from '@/assets/projete/torre-retrato-desenho.webp';
import sobeEmPe from '@/assets/projete/torre-retrato-sobe.webp';
import tempoEmPe from '@/assets/projete/torre-retrato-tempo.webp';
import sobeLargo from '@/assets/projete/torre-sobe.webp';
import tempoLargo from '@/assets/projete/torre-tempo.webp';
import torre from '@/assets/torre-icone.jpg';
import torreRetrato from '@/assets/torre-icone-retrato.jpg';
import { copy } from '@/content/copy.pt-BR';
import { fasesTorre, QUADRO } from '@/lib/cena';
import { carregar, criarTraco, type Traco } from '@/lib/traco-gl';
import { Emphasis } from './Emphasis';
import { marca } from './marca';
import { TallSource } from './TallSource';
import { EM_PE, useCena } from './useCena';
import styles from './Cena.module.css';

// A capa cobre o palco (tela menos o menu): a larga no computador, o recorte 3:4 em pé (pela altura).
const SIZES = '(max-aspect-ratio: 2560/1429) calc((100vh - 60px) * 1.8), 100vw';
const SIZES_EM_PE = '(max-aspect-ratio: 3/4) calc((100vh - 60px) * 0.75), 100vw';
/** Largura da arte na escala em que o nanquim tem ~2 px: a imagem larga e o recorte em pé. */
const ARTE = { largo: 2560, emPe: 1072 };

type Modo = 'parado' | 'carregando' | 'desenho';

export function Projete() {
  const t = copy.projete;
  const trilho = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const notas = useRef<HTMLOListElement>(null);
  const tela = useRef<HTMLCanvasElement>(null);
  const arte = useRef<HTMLImageElement>(null);
  const traco = useRef<Traco | null>(null);
  const progresso = useRef(0);
  const [modo, setModo] = useState<Modo>('parado');

  const desenhar = () => {
    const f = fasesTorre(progresso.current);
    traco.current?.desenhar(f.desenho, f.cor);
  };

  const ativo = useCena({ cena: trilho, palco, notas }, QUADRO.projete, (p) => {
    progresso.current = p;
    desenhar();
  });

  // O sombreador nasce perto da cena, com movimento permitido. Até ficar pronto (ou sem WebGL) a ilustração
  // colorida fica no palco; quando fica, o desenho entra por cima dela.
  useEffect(() => {
    const canvas = tela.current;
    const img = arte.current;
    const area = trilho.current;
    if (!canvas || !img || !area || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const emPe = window.matchMedia(EM_PE);
    let vivo = true;
    let versao = 0;
    setModo('carregando');

    const iniciar = async () => {
      const minha = ++versao;
      traco.current?.limpar();
      traco.current = null;
      try {
        if (!img.complete || !img.naturalWidth) {
          await new Promise((ok, erro) => {
            img.addEventListener('load', ok, { once: true });
            img.addEventListener('error', erro, { once: true });
          });
        }
        const vertical = emPe.matches;
        // a mesma imagem que o pôster já baixou, mas sem srcset: o tamanho dela é o de verdade, em pixels
        const [pixels, tempo, sobe] = await Promise.all([
          carregar(img.currentSrc || img.src),
          carregar(vertical ? tempoEmPe.src : tempoLargo.src),
          carregar(vertical ? sobeEmPe.src : sobeLargo.src),
        ]);
        if (!vivo || minha !== versao) return;
        const novo = criarTraco(canvas, { arte: pixels, tempo, sobe }, vertical ? ARTE.emPe : ARTE.largo);
        if (!novo) throw new Error('sem WebGL');
        traco.current = novo;
        desenhar();
        setModo('desenho');
      } catch {
        if (vivo && minha === versao) setModo('parado');
      }
    };

    const perto = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        perto.disconnect();
        img.loading = 'eager'; // o pôster começa a baixar já, sem esperar a regra do navegador
        void iniciar();
      },
      { rootMargin: '250% 0px' },
    );
    perto.observe(area);

    const medida = new ResizeObserver(() => {
      traco.current?.ajustar();
      desenhar();
    });
    medida.observe(canvas);

    // girar o aparelho troca o recorte: espera a imagem nova e refaz as texturas
    const girar = () => {
      if (!traco.current) return;
      setModo('carregando');
      img.addEventListener('load', () => void iniciar(), { once: true });
    };
    emPe.addEventListener('change', girar);

    const perdeu = (e: Event) => {
      e.preventDefault();
      traco.current = null;
      setModo('parado');
    };
    canvas.addEventListener('webglcontextlost', perdeu);

    return () => {
      vivo = false;
      perto.disconnect();
      medida.disconnect();
      emPe.removeEventListener('change', girar);
      canvas.removeEventListener('webglcontextlost', perdeu);
      traco.current?.limpar();
      traco.current = null;
    };
  }, []);

  return (
    <section id="projete" className={styles.projete} aria-labelledby="projete-titulo" data-modo={modo}>
      <div className={styles.cena}>
        <div className={styles.trilho} ref={trilho} aria-hidden="true" />
        <div className={styles.palco} ref={palco}>
          <div className={styles.capa}>
            <picture className="fill-picture">
              {/* 85: o traço sai desta imagem, e com 75 a compressão vira ruído no desenho */}
              <TallSource src={torreRetrato} sizes={SIZES_EM_PE} quality={85} />
              <Image ref={arte} src={torre} alt={t.alt} fill sizes={SIZES} quality={85} className={styles.arte} />
            </picture>
            <canvas ref={tela} className={styles.tela} aria-hidden="true" />
            {t.notas.map((nota, i) => (
              <span
                key={nota.n}
                className={styles.marca}
                style={marca(nota.marca)}
                data-ativa={ativo - 1 === i || undefined}
                aria-hidden="true"
              >
                <i className={styles.anel}>{nota.n}</i>
                <span className={styles.rotulo}>{nota.rotulo}</span>
              </span>
            ))}
          </div>
        </div>

        <ol className={styles.passos} ref={notas}>
          <li className={styles.abertura}>
            <div className={styles.cartaoAbertura}>
              <p className="eyebrow">
                <i className="sq" aria-hidden="true" /> {t.numero} · {t.eyebrow}
              </p>
              <h2 className={styles.titulo} id="projete-titulo">
                <span className={styles.verbo}>Projete.</span> <Emphasis {...t.titulo} />
              </h2>
              <p className={styles.lead}>{t.lead}</p>
            </div>
          </li>
          {t.notas.map((nota, i) => (
            <li key={nota.n} className={styles.passo} aria-current={ativo - 1 === i || undefined}>
              <article className={styles.cartao} aria-labelledby={`nota-${nota.n}`}>
                <p className={styles.num}>{nota.n}</p>
                <h3 className={styles.nome} id={`nota-${nota.n}`}>
                  {nota.titulo}
                </h3>
                <p className={styles.texto}>{nota.texto}</p>
                <p className={styles.fonte}>
                  Fonte:{' '}
                  <a href={nota.fonte.url} target="_blank" rel="noreferrer">
                    {nota.fonte.nome}
                  </a>
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>

      {/* Movimento reduzido: o desenho técnico parado ao lado da torre colorida (só baixa nesse modo). */}
      <figure className={styles.parado}>
        <Image src={desenhoParado} alt={t.altDesenho} sizes="(max-width: 860px) 100vw, 50vw" className={styles.paradoImg} />
      </figure>
    </section>
  );
}

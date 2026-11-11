'use client';

import Image, { type StaticImageData } from 'next/image';
import { useRef } from 'react';
import copanNoite from '@/assets/copan-noite.jpg';
import copanDia from '@/assets/copan-por-do-sol.jpg';
import maspNoite from '@/assets/masp-noite.jpg';
import maspDia from '@/assets/masp-por-do-sol.jpg';
import ponteNoite from '@/assets/ponte-noite.jpg';
import ponteDia from '@/assets/ponte-por-do-sol.jpg';
import noite from '@/assets/sao-paulo-2080-noite.jpg';
import noiteRetrato from '@/assets/sao-paulo-2080-noite-retrato.jpg';
import porDoSol from '@/assets/sao-paulo-2080-por-do-sol.jpg';
import porDoSolRetrato from '@/assets/sao-paulo-2080-por-do-sol-retrato.jpg';
import { copy, type Predio } from '@/content/copy.pt-BR';
import { noiteHabite, QUADRO } from '@/lib/cena';
import { Emphasis } from './Emphasis';
import { marca } from './marca';
import { TallSource } from './TallSource';
import { useCena } from './useCena';
import styles from './Cena.module.css';

const SIZES = '(max-aspect-ratio: 2560/1429) calc((100vh - 60px) * 1.8), 100vw';
const SIZES_EM_PE = '(max-aspect-ratio: 87/200) 100vw, 44vh';

const MINIATURAS: Record<Predio, { dia: StaticImageData; noite: StaticImageData }> = {
  copan: { dia: copanDia, noite: copanNoite },
  masp: { dia: maspDia, noite: maspNoite },
  ponte: { dia: ponteDia, noite: ponteNoite },
};

/** Ato 3, Habite: São Paulo do pôr do sol à noite, com os três prédios que a cidade já mora. */
export function Habite() {
  const t = copy.habite;
  const secao = useRef<HTMLElement>(null);
  const trilho = useRef<HTMLDivElement>(null);
  const palco = useRef<HTMLDivElement>(null);
  const notas = useRef<HTMLOListElement>(null);

  const ativo = useCena({ cena: trilho, palco, notas }, QUADRO.habite, (p) => {
    secao.current?.style.setProperty('--noite', noiteHabite(p).toFixed(3));
  });

  return (
    <section id="habite" className={styles.habite} ref={secao} aria-labelledby="habite-titulo">
      <div className={styles.cena}>
        <div className={styles.trilho} ref={trilho} aria-hidden="true" />
        <div className={styles.palco} ref={palco}>
          <div className={styles.capa}>
            <picture className="fill-picture">
              <TallSource src={porDoSolRetrato} sizes={SIZES_EM_PE} />
              <Image src={porDoSol} alt={t.alt} fill sizes={SIZES} quality={85} className={styles.arte} />
            </picture>
            <picture className={`fill-picture ${styles.noite}`}>
              <TallSource src={noiteRetrato} sizes={SIZES_EM_PE} />
              <Image src={noite} alt="" aria-hidden="true" fill sizes={SIZES} quality={85} className={styles.arte} />
            </picture>
            {t.moradas.map((m, i) => (
              <span
                key={m.id}
                className={styles.marca}
                style={marca(m.marca)}
                data-ativa={ativo - 1 === i || undefined}
                data-fora={m.marca.emPe ? undefined : ''}
                aria-hidden="true"
              >
                <i className={styles.anel}>{i + 1}</i>
                <span className={styles.rotulo}>{m.predio}</span>
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
              <h2 className={styles.titulo} id="habite-titulo">
                <span className={styles.verbo}>Habite.</span> <Emphasis {...t.titulo} />
              </h2>
              <p className={styles.lead}>{t.lead}</p>
            </div>
          </li>
          {t.moradas.map((m, i) => (
            <li key={m.id} className={styles.passo} aria-current={ativo - 1 === i || undefined}>
              <article className={styles.cartao} aria-labelledby={`morada-${m.id}`}>
                <figure className={styles.miniatura} aria-hidden="true">
                  <Image src={MINIATURAS[m.id].dia} alt="" fill sizes="(max-width: 520px) 34vw, 180px" />
                  <Image src={MINIATURAS[m.id].noite} alt="" fill sizes="(max-width: 520px) 34vw, 180px" className={styles.noite} />
                </figure>
                <p className={styles.num}>
                  {String(i + 1).padStart(2, '0')} · {m.assinatura}
                </p>
                <h3 className={styles.nome} id={`morada-${m.id}`}>
                  {m.predio}
                </h3>
                <p className={styles.numero}>
                  {m.numero} <small>{m.unidade}</small>
                </p>
                <p className={styles.texto}>{m.texto}</p>
                <p className={styles.fonte}>
                  Fonte:{' '}
                  <a href={m.fonte.url} target="_blank" rel="noreferrer">
                    {m.fonte.nome}
                  </a>
                </p>
              </article>
            </li>
          ))}
          <li className={styles.passo}>
            <p className={styles.fecho}>{t.fecho}</p>
          </li>
        </ol>
      </div>

      {/* Movimento reduzido: a noite parada depois do pôr do sol, em vez de uma virar a outra (só baixa nesse modo). */}
      <figure className={`${styles.parado} ${styles.paradoLargo}`}>
        <Image src={noite} alt={t.altNoite} sizes="(max-width: 1152px) 100vw, 1120px" className={styles.paradoImg} />
      </figure>
    </section>
  );
}

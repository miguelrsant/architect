'use client';

import Image, { type StaticImageData } from 'next/image';
import { useState } from 'react';
import { type Capitulo, copy } from '@/content/copy.pt-BR';
import { Emphasis } from './Emphasis';
import styles from './Chapters.module.css';

type Modo = 'hoje' | '2080';

interface Props {
  capitulo: Capitulo;
  imagens: { porDoSol: StaticImageData; noite: StaticImageData };
  reverse?: boolean;
}

const SIZES = '(max-width: 860px) 100vw, 600px';

export function Chapter({ capitulo, imagens, reverse = false }: Props) {
  const [modo, setModo] = useState<Modo>('hoje');
  const futuro = modo === '2080';
  const t = copy.capitulos;
  const tituloId = `${capitulo.id}-titulo`;

  return (
    <article
      id={capitulo.id}
      className={[styles.chapter, reverse && styles.reverse, futuro && styles.isFuture].filter(Boolean).join(' ')}
      aria-labelledby={tituloId}
    >
      <figure className={styles.figure}>
        <Image
          src={imagens.porDoSol}
          alt={capitulo.imagem.porDoSol}
          aria-hidden={futuro}
          fill
          sizes={SIZES}
          placeholder="blur"
          className={styles.img}
        />
        <Image
          src={imagens.noite}
          alt={capitulo.imagem.noite}
          aria-hidden={!futuro}
          fill
          sizes={SIZES}
          className={`${styles.img} ${styles.night}`}
        />
        <span className={styles.verb} aria-hidden="true">
          {capitulo.verbo}
        </span>
      </figure>

      <div className={styles.body}>
        <p className="eyebrow">
          <i className="sq" aria-hidden="true" /> {t.capitulo} {capitulo.numero} · {capitulo.predio}
        </p>
        <h3 className={styles.title} id={tituloId}>
          <Emphasis {...capitulo.titulo} />
        </h3>
        <p className={styles.signature}>{capitulo.assinatura}</p>

        <div className={styles.toggle} role="group" aria-label={`${t.toggle.rotulo}: ${capitulo.predio}`}>
          <button type="button" aria-pressed={!futuro} onClick={() => setModo('hoje')}>
            {t.toggle.hoje}
          </button>
          <button type="button" aria-pressed={futuro} onClick={() => setModo('2080')}>
            {t.toggle.futuro}
          </button>
        </div>

        {/* Os dois textos ocupam a mesma célula: a troca não empurra a ficha para baixo. */}
        <div className={styles.texts}>
          <div className={`${styles.text} ${futuro ? '' : styles.active}`} aria-hidden={futuro} inert={futuro}>
            <span className="chip chip-real">{t.selo.existe}</span>
            <p>{capitulo.hoje}</p>
          </div>
          <div className={`${styles.text} ${futuro ? styles.active : ''}`} aria-hidden={!futuro} inert={!futuro}>
            <span className="chip chip-future">{t.selo.futuro}</span>
            <p>{capitulo.futuro}</p>
          </div>
        </div>

        <dl className={`specs ${styles.specs}`} aria-label={t.ficha}>
          {capitulo.ficha.map((item) => (
            <div key={item.rotulo}>
              <dt>{item.rotulo}</dt>
              <dd>
                {item.valor}
                {item.unidade && <small>{item.unidade}</small>}
              </dd>
            </div>
          ))}
        </dl>

        <p className={styles.source}>
          {capitulo.fontes.length > 1 ? t.fontes : t.fonte}:{' '}
          {capitulo.fontes.map((fonte, i) => (
            <span key={fonte.url}>
              {i > 0 && ', '}
              <a href={fonte.url} target="_blank" rel="noopener noreferrer">
                {fonte.nome}
              </a>
            </span>
          ))}
        </p>
      </div>
    </article>
  );
}

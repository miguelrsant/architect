'use client';

import { type CSSProperties, useRef } from 'react';
import { useEntrada } from './useEntrada';
import styles from './Finale.module.css';

/** O título do convite, que sobe linha por linha quando chega na tela. */
export function FinaleTitulo({ linhas, id }: { linhas: readonly string[]; id: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const entrada = useEntrada(ref);
  return (
    <h2 className={`headline ${styles.title}`} id={id} ref={ref} data-entrada={entrada}>
      {linhas.map((linha, i) => (
        <span key={linha}>
          {i > 0 && ' '}
          <span className={styles.linha} style={{ '--i': i } as CSSProperties}>
            {linha}
          </span>
        </span>
      ))}
    </h2>
  );
}

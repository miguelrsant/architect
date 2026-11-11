'use client';

import { type RefObject, useEffect, useState } from 'react';

/** `espera`: ainda abaixo da tela, escondido; `vez`: entrou e anima; `undefined`: nada se esconde. */
export type Entrada = 'espera' | 'vez' | undefined;

/**
 * Entrada ao chegar na tela, para pôr em `data-entrada`. Só esconde o que ainda está abaixo da tela
 * quando o JavaScript roda e o movimento é permitido; sem ele, o conteúdo fica visível desde o HTML.
 */
export function useEntrada(ref: RefObject<HTMLElement | null>): Entrada {
  const [entrada, setEntrada] = useState<Entrada>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) return;
    setEntrada('espera');
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        setEntrada('vez');
      },
      { rootMargin: '0px 0px -20% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return entrada;
}

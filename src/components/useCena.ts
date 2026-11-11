'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';
import { passoDaVez, progressoCena, veuCena } from '@/lib/cena';

/** Telas em pé: a ilustração vira o recorte vertical (a mesma regra do CSS). */
export const EM_PE = '(max-aspect-ratio: 1/1)';

/** A linha de leitura dos cartões, em fração da altura da tela. */
export const LEITURA = 0.6;

interface Partes {
  cena: RefObject<HTMLElement | null>;
  palco: RefObject<HTMLElement | null>;
  notas: RefObject<HTMLElement | null>;
}

/**
 * Cena fixada: o palco fica parado enquanto os cartões rolam por cima dele. A cada quadro de rolagem chama
 * `aoMover` com o progresso de 0 a 1, põe o véu de noite no palco (`--veu`: a cena chega escura e apaga
 * antes de soltar) e devolve o cartão da vez, o último que passou da linha de leitura.
 * Com `?quadro` na URL o progresso fica parado em `quadro` e sem véu (quadros de estilo e fotos do README).
 */
export function useCena({ cena, palco, notas }: Partes, quadro: number, aoMover: (p: number) => void): number {
  const [ativo, setAtivo] = useState(-1);
  const mover = useRef(aoMover);

  useEffect(() => {
    mover.current = aoMover;
  });

  useEffect(() => {
    const parado = new URLSearchParams(window.location.search).has('quadro');
    const reduz = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;

    const medir = () => {
      frame = 0;
      const c = cena.current;
      const pc = palco.current;
      const n = notas.current;
      if (!c || !pc || !n) return;
      const r = c.getBoundingClientRect();
      const menu = parseFloat(getComputedStyle(pc).top) || 0;
      const fixada = !parado && !reduz.matches;
      const p = parado ? quadro : fixada ? progressoCena(r.top, r.height, pc.offsetHeight, menu) : 1;
      const passou = menu - r.top;
      const curso = r.height - pc.offsetHeight;
      pc.style.setProperty('--veu', fixada ? veuCena(passou, curso - passou, window.innerHeight).toFixed(3) : '0');
      const topos = Array.from(n.children, (li) => (li.firstElementChild ?? li).getBoundingClientRect().top);
      setAtivo(passoDaVez(topos, window.innerHeight * LEITURA));
      mover.current(p);
    };
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    reduz.addEventListener('change', agendar);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      reduz.removeEventListener('change', agendar);
    };
  }, [cena, palco, notas, quadro]);

  return ativo;
}

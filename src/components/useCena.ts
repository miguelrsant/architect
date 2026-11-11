'use client';

import { type RefObject, useEffect, useRef, useState } from 'react';
import { passoDaVez, progressoCena } from '@/lib/cena';

/** Telas em pé: o palco fica no topo e os cartões passam embaixo dele (a mesma regra do CSS). */
export const EM_PE = '(max-aspect-ratio: 1/1)';

interface Partes {
  cena: RefObject<HTMLElement | null>;
  palco: RefObject<HTMLElement | null>;
  notas: RefObject<HTMLElement | null>;
}

/**
 * Cena fixada: o palco fica parado enquanto os cartões rolam por cima (computador) ou embaixo dele
 * (em pé). A cada quadro de rolagem chama `aoMover` com o progresso de 0 a 1 e devolve o cartão da vez.
 * Com `?quadro` na URL o progresso fica parado em `quadro` (quadros de estilo e fotos do README).
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
    const emPe = window.matchMedia(EM_PE);
    let frame = 0;

    const medir = () => {
      frame = 0;
      const c = cena.current;
      const pc = palco.current;
      const n = notas.current;
      if (!c || !pc || !n) return;
      const r = c.getBoundingClientRect();
      const menu = parseFloat(getComputedStyle(pc).top) || 0;
      const p = parado ? quadro : reduz.matches ? 1 : progressoCena(r.top, r.height, pc.offsetHeight, menu);
      // a linha de leitura: logo abaixo do palco (em pé) ou a 60% da tela
      const linha = emPe.matches ? pc.getBoundingClientRect().bottom + 48 : window.innerHeight * 0.6;
      const topos = Array.from(n.children, (li) => (li.firstElementChild ?? li).getBoundingClientRect().top);
      setAtivo(passoDaVez(topos, linha));
      mover.current(p);
    };
    const agendar = () => {
      if (!frame) frame = requestAnimationFrame(medir);
    };

    medir();
    window.addEventListener('scroll', agendar, { passive: true });
    window.addEventListener('resize', agendar);
    emPe.addEventListener('change', agendar);
    reduz.addEventListener('change', agendar);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', agendar);
      window.removeEventListener('resize', agendar);
      emPe.removeEventListener('change', agendar);
      reduz.removeEventListener('change', agendar);
    };
  }, [cena, palco, notas, quadro]);

  return ativo;
}

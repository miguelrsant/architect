// Matemática das cenas fixadas (Projete e Habite): funções puras, testadas em tests/cena.test.ts.
import { clamp01, smoothstep } from './daynight';

/**
 * Quanto da cena já passou: 0 quando o palco encosta embaixo do menu, 1 quando a seção vai soltar.
 * `topo` e `altura` são da seção, `palco` é a altura do palco fixado e `menu` a do menu fixo.
 */
export function progressoCena(topo: number, altura: number, palco: number, menu: number): number {
  const curso = altura - palco;
  return curso > 0 ? clamp01((menu - topo) / curso) : 0;
}

/** O passo da vez: o último cujo topo já passou da linha de leitura (-1 antes do primeiro). */
export function passoDaVez(topos: readonly number[], linha: number): number {
  let n = -1;
  topos.forEach((topo, i) => {
    if (topo <= linha) n = i;
  });
  return n;
}

/** Projete: na primeira metade a torre se desenha; depois a cor sobe da base até o topo. */
export function fasesTorre(p: number): { desenho: number; cor: number } {
  return { desenho: clamp01(p / 0.5), cor: clamp01((p - 0.52) / 0.4) };
}

/** Habite: o pôr do sol vira noite entre 20% e 85% da cena. */
export function noiteHabite(p: number): number {
  return smoothstep((p - 0.2) / 0.65);
}

/** Estados parados dos quadros de estilo (`?quadro` na URL): o momento mais representativo de cada cena. */
export const QUADRO = { projete: 0.7, habite: 0.55 } as const;

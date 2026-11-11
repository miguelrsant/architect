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

/**
 * Projete: até 46% da cena a torre se desenha; depois a cor sobe da base até o topo e fica pronta em 77%,
 * quando chega o último cartão. O resto é a torre inteira, parada, até o véu da saída.
 */
export function fasesTorre(p: number): { desenho: number; cor: number } {
  return { desenho: clamp01(p / 0.46), cor: clamp01((p - 0.47) / 0.3) };
}

/** Habite: o pôr do sol vira noite entre 15% e 63% da cena, antes da frase final. */
export function noiteHabite(p: number): number {
  return smoothstep((p - 0.15) / 0.48);
}

/** Quanto da altura da tela se rola enquanto o véu sobe (a cena acende) e enquanto ele desce (a cena apaga). */
const ACENDE = 0.55;
const APAGA = 0.5;

/** Só a saída do véu: a cena apaga antes de soltar (para a que já chega acesa, depois de um texto). */
export function veuSaida(falta: number, tela: number): number {
  return tela > 0 ? 1 - smoothstep(falta / (APAGA * tela)) : 0;
}

/**
 * O véu de noite sobre o palco fixado, de 0 (cena acesa) a 1 (só a noite). A cena chega escura, acende
 * depois de fixar e escurece antes de soltar: um ato passa ao outro pela noite, com o título do próximo no
 * escuro, sem corte de imagem para imagem. `passou` é quanto já se rolou desde que o palco fixou e `falta`
 * quanto falta para ele soltar, em px (negativos fora da cena); `tela` é a altura da tela.
 */
export function veuCena(passou: number, falta: number, tela: number): number {
  if (tela <= 0) return 0;
  return Math.max(1 - smoothstep(passou / (ACENDE * tela)), veuSaida(falta, tela));
}

/** Estados parados dos quadros de estilo (`?quadro` na URL): o momento mais representativo de cada cena. */
export const QUADRO = { projete: 0.6, habite: 0.4 } as const;

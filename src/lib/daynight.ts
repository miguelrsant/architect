// Matemática do scroll: funções puras, testadas em tests/daynight.test.ts.

export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export function smoothstep(t: number): number {
  const x = clamp01(t);
  return x * x * (3 - 2 * x);
}

/** Quanto do herói já passou: 0 com ele inteiro na tela, 1 quando 55% da altura saiu por cima. */
export function heroProgress(top: number, height: number): number {
  return height > 0 ? clamp01(-top / (height * 0.55)) : 0;
}

/**
 * Pôr do sol → noite. `night` é a opacidade da ilustração noturna (começa depois de 10% do
 * caminho) e `glow` é o brilho rosa do crepúsculo, que sobe e some antes do fim.
 */
export function dayNight(t: number): { night: number; glow: number } {
  const e = smoothstep(t);
  return {
    night: clamp01((e - 0.1) / 0.75),
    glow: Math.sin(Math.min(1, e * 1.4) * Math.PI) * 0.6,
  };
}

/** Quantas palavras do manifesto estão acesas: a linha de leitura fica a 82% da altura da tela. */
export function litWords(top: number, height: number, viewport: number, count: number): number {
  const progress = (viewport * 0.82 - top) / (height + viewport * 0.25);
  return Math.round(clamp01(progress) * count);
}

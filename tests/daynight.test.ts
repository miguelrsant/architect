import { describe, expect, it } from 'vitest';
import { dayNight, heroProgress, litWords, smoothstep } from '@/lib/daynight';

describe('smoothstep', () => {
  it('vai de 0 a 1 e satura fora do intervalo', () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(0)).toBe(0);
    expect(smoothstep(0.5)).toBe(0.5);
    expect(smoothstep(1)).toBe(1);
    expect(smoothstep(2)).toBe(1);
  });
});

describe('heroProgress', () => {
  it('é 0 com o herói inteiro na tela e 1 quando 55% dele saiu por cima', () => {
    expect(heroProgress(0, 900)).toBe(0);
    expect(heroProgress(120, 900)).toBe(0);
    expect(heroProgress(-900 * 0.55, 900)).toBe(1);
    expect(heroProgress(-2000, 900)).toBe(1);
  });

  it('não divide por zero', () => {
    expect(heroProgress(-10, 0)).toBe(0);
  });
});

describe('dayNight', () => {
  it('começa no pôr do sol, sem brilho, e termina na noite, sem brilho', () => {
    expect(dayNight(0)).toEqual({ night: 0, glow: 0 });
    const fim = dayNight(1);
    expect(fim.night).toBe(1);
    expect(fim.glow).toBeCloseTo(0, 6);
  });

  it('a noite só cresce e o brilho do crepúsculo aparece no meio do caminho', () => {
    let anterior = -1;
    for (let t = 0; t <= 1; t += 0.05) {
      const { night, glow } = dayNight(t);
      expect(night).toBeGreaterThanOrEqual(anterior);
      expect(glow).toBeGreaterThanOrEqual(0);
      expect(glow).toBeLessThanOrEqual(0.6);
      anterior = night;
    }
    expect(dayNight(0.45).glow).toBeGreaterThan(0.5);
  });
});

describe('litWords', () => {
  it('nenhuma palavra acesa antes da linha de leitura, todas depois do parágrafo', () => {
    expect(litWords(900, 300, 900, 50)).toBe(0);
    expect(litWords(-400, 300, 900, 50)).toBe(50);
  });
});

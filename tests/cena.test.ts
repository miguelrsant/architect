import { describe, expect, it } from 'vitest';
import { fasesTorre, noiteHabite, passoDaVez, progressoCena } from '@/lib/cena';

describe('progressoCena', () => {
  it('é 0 até o palco encostar no menu e 1 quando a seção vai soltar', () => {
    // seção de 3000 px, palco de 800 px, menu de 60 px: o curso é de 2200 px
    expect(progressoCena(400, 3000, 800, 60)).toBe(0);
    expect(progressoCena(60, 3000, 800, 60)).toBe(0);
    expect(progressoCena(60 - 1100, 3000, 800, 60)).toBe(0.5);
    expect(progressoCena(60 - 2200, 3000, 800, 60)).toBe(1);
    expect(progressoCena(-9000, 3000, 800, 60)).toBe(1);
  });

  it('não divide por zero quando a seção não é mais alta que o palco', () => {
    expect(progressoCena(-100, 800, 800, 60)).toBe(0);
    expect(progressoCena(-100, 600, 800, 60)).toBe(0);
  });
});

describe('passoDaVez', () => {
  it('é o último cartão que já passou da linha de leitura', () => {
    expect(passoDaVez([900, 1400, 1900], 540)).toBe(-1);
    expect(passoDaVez([500, 1000, 1500], 540)).toBe(0);
    expect(passoDaVez([-400, 100, 540], 540)).toBe(2);
    expect(passoDaVez([], 540)).toBe(-1);
  });
});

describe('fasesTorre', () => {
  it('desenha na primeira metade e pinta depois, de baixo para cima', () => {
    expect(fasesTorre(0)).toEqual({ desenho: 0, cor: 0 });
    expect(fasesTorre(0.25)).toEqual({ desenho: 0.5, cor: 0 });
    expect(fasesTorre(0.5)).toEqual({ desenho: 1, cor: 0 });
    expect(fasesTorre(0.72).cor).toBeCloseTo(0.5);
    expect(fasesTorre(1)).toEqual({ desenho: 1, cor: 1 });
  });

  it('satura fora do intervalo', () => {
    expect(fasesTorre(-1)).toEqual({ desenho: 0, cor: 0 });
    expect(fasesTorre(2)).toEqual({ desenho: 1, cor: 1 });
  });
});

describe('noiteHabite', () => {
  it('fica no pôr do sol até 20% e chega à noite em 85%', () => {
    expect(noiteHabite(0)).toBe(0);
    expect(noiteHabite(0.2)).toBe(0);
    expect(noiteHabite(0.525)).toBeCloseTo(0.5);
    expect(noiteHabite(0.85)).toBe(1);
    expect(noiteHabite(1)).toBe(1);
  });
});

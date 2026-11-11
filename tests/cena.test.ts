import { describe, expect, it } from 'vitest';
import { fasesTorre, noiteHabite, passoDaVez, progressoCena, veuCena, veuSaida } from '@/lib/cena';

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
  it('desenha até 46% e pinta depois, de baixo para cima, pronta em 77%', () => {
    expect(fasesTorre(0)).toEqual({ desenho: 0, cor: 0 });
    expect(fasesTorre(0.23).desenho).toBeCloseTo(0.5);
    expect(fasesTorre(0.23).cor).toBe(0);
    expect(fasesTorre(0.46)).toEqual({ desenho: 1, cor: 0 });
    expect(fasesTorre(0.62).cor).toBeCloseTo(0.5);
    expect(fasesTorre(0.77).cor).toBeCloseTo(1);
    expect(fasesTorre(1)).toEqual({ desenho: 1, cor: 1 });
  });

  it('satura fora do intervalo', () => {
    expect(fasesTorre(-1)).toEqual({ desenho: 0, cor: 0 });
    expect(fasesTorre(2)).toEqual({ desenho: 1, cor: 1 });
  });
});

describe('noiteHabite', () => {
  it('fica no pôr do sol até 15% e chega à noite em 63%, antes da frase final', () => {
    expect(noiteHabite(0)).toBe(0);
    expect(noiteHabite(0.15)).toBe(0);
    expect(noiteHabite(0.39)).toBeCloseTo(0.5);
    expect(noiteHabite(0.63)).toBeCloseTo(1);
    expect(noiteHabite(0.8)).toBe(1);
    expect(noiteHabite(1)).toBe(1);
  });
});

describe('veuSaida', () => {
  // tela de 900 px: a cena apaga nos últimos 450 px antes de soltar
  it('deixa a cena acesa até meia tela do fim e chega à noite quando ela solta', () => {
    expect(veuSaida(2000, 900)).toBe(0);
    expect(veuSaida(450, 900)).toBe(0);
    expect(veuSaida(225, 900)).toBeCloseTo(0.5);
    expect(veuSaida(0, 900)).toBe(1);
    expect(veuSaida(-300, 900)).toBe(1);
  });

  it('não faz nada sem altura de tela', () => {
    expect(veuSaida(0, 0)).toBe(0);
  });
});

describe('veuCena', () => {
  // tela de 900 px: a cena acende nos primeiros 495 px depois de fixar e apaga nos últimos 450 px
  it('chega escura, acende depois de fixar e apaga antes de soltar', () => {
    expect(veuCena(-400, 3400, 900)).toBe(1);
    expect(veuCena(0, 3000, 900)).toBe(1);
    expect(veuCena(247.5, 2750, 900)).toBeCloseTo(0.5);
    expect(veuCena(495, 2500, 900)).toBe(0);
    expect(veuCena(1500, 1500, 900)).toBe(0);
    expect(veuCena(2775, 225, 900)).toBeCloseTo(0.5);
    expect(veuCena(3000, 0, 900)).toBe(1);
    expect(veuCena(3300, -300, 900)).toBe(1);
  });

  it('numa cena curta fica a parte mais escura das duas', () => {
    // 300 px de curso: o véu nunca some, e o meio é o ponto mais claro
    expect(veuCena(150, 150, 900)).toBeGreaterThan(0.5);
    expect(veuCena(150, 150, 900)).toBeLessThan(1);
  });

  it('não faz nada sem altura de tela', () => {
    expect(veuCena(0, 0, 0)).toBe(0);
  });
});

import { describe, expect, it } from 'vitest';
import { brand } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';

const { lista } = copy.capitulos;

describe('capítulos', () => {
  it('são os três do roteiro, na ordem: morar, encontrar, atravessar', () => {
    expect(lista.map((c) => c.id)).toEqual(['copan', 'masp', 'ponte']);
    expect(lista.map((c) => c.verbo)).toEqual(['morar', 'encontrar', 'atravessar']);
  });

  it.each(lista)('$predio tem os dois textos, ficha de quatro números e fonte https', (c) => {
    expect(c.hoje.length).toBeGreaterThan(80);
    expect(c.futuro.length).toBeGreaterThan(60);
    expect(c.ficha).toHaveLength(4);
    expect(c.fontes.length).toBeGreaterThan(0);
    for (const fonte of c.fontes) expect(fonte.url).toMatch(/^https:\/\//);
    expect(c.titulo.texto).toContain(c.titulo.destaque);
  });

  it('os números da ficha batem com o texto de "Hoje"', () => {
    const [copan, masp, ponte] = lista;
    expect(copan.hoje).toContain('1.160 apartamentos');
    expect(copan.hoje).toContain('140 metros');
    expect(masp.hoje).toContain('74 metros');
    expect(ponte.hoje).toContain('138 metros');
    expect(ponte.hoje).toContain('144 estais');
  });
});

describe('mapa da cena', () => {
  const { pontos } = copy.mapa;

  it('tem oito pontos numerados de 1 a 8, dentro da imagem', () => {
    expect(pontos.map((p) => p.n)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    for (const p of pontos) {
      expect(p.x).toBeGreaterThan(0);
      expect(p.x).toBeLessThan(100);
      expect(p.y).toBeGreaterThan(0);
      expect(p.y).toBeLessThan(100);
    }
  });

  it('separa cinco coisas que existem de três imaginadas', () => {
    expect(pontos.filter((p) => p.selo === 'existe')).toHaveLength(5);
    expect(pontos.filter((p) => p.selo === '2080')).toHaveLength(3);
  });

  it('os pontos dos prédios levam a capítulos que existem', () => {
    const ids = new Set(lista.map((c) => c.id));
    const comCapitulo = pontos.filter((p) => p.capitulo);
    expect(comCapitulo).toHaveLength(3);
    for (const p of comCapitulo) expect(ids.has(p.capitulo!)).toBe(true);
  });
});

describe('textos', () => {
  it('título do herói e destaques usados nos títulos', () => {
    expect(copy.hero.titulo.join(' ')).toBe('Imagine. Projete. Habite.');
    for (const d of [copy.manifesto.fecho, copy.capitulos.titulo, copy.mapa.titulo, copy.faq.titulo]) {
      expect(d.texto).toContain(d.destaque);
    }
  });

  it('crédito do rodapé aponta para o site do Miguel', () => {
    expect(brand.author).toBe('Miguel Angelo');
    expect(brand.url).toBe('https://miguelrsant.com.br');
    expect(brand.logoSrc).toBe('/brand/miguelrsant-icon-light.svg');
  });
});

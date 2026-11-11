import { describe, expect, it } from 'vitest';
import { brand } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';

const dentro = (v: number) => v > 0 && v < 100;

describe('roteiro', () => {
  it('o título é o caminho do site: Imagine, Projete e Habite, nos três atos e no menu', () => {
    expect(copy.imagine.titulo.map((l) => l.verbo).join(' ')).toBe('Imagine. Projete. Habite.');
    expect(copy.nav.links.map((l) => l.label)).toEqual(['Imagine', 'Projete', 'Habite']);
    expect([copy.imagine.numero, copy.projete.numero, copy.habite.numero]).toEqual(['01', '02', '03']);
  });

  it('a frase começa como o convite termina e acaba como o Habite começa', () => {
    expect(copy.manifesto.texto.texto.startsWith(copy.final.titulo.join(' ').replace(/\.$/, ''))).toBe(true);
    expect(copy.manifesto.texto.texto).toContain(copy.manifesto.texto.destaque);
    expect(copy.habite.titulo.texto).toContain('só fica pronta quando alguém mora nela');
  });

  it('todo destaque aparece dentro do próprio texto', () => {
    for (const d of [copy.projete.titulo, copy.habite.titulo, copy.mapa.titulo, copy.faq.titulo]) {
      expect(d.texto).toContain(d.destaque);
    }
  });
});

describe('o que a ficção acertou', () => {
  const { pontos } = copy.mapa;

  it('tem seis pontos numerados de 1 a 6, dentro da imagem', () => {
    expect(pontos.map((p) => p.n)).toEqual([1, 2, 3, 4, 5, 6]);
    for (const p of pontos) expect(dentro(p.x) && dentro(p.y)).toBe(true);
  });

  it('separa três coisas que já existem de três que ainda são ficção', () => {
    expect(pontos.filter((p) => p.selo === 'existe').map((p) => p.nome)).toEqual([
      'Monotrilho',
      'Telões nas fachadas',
      'Jardins nos telhados',
    ]);
    expect(pontos.filter((p) => p.selo === 'ficcao')).toHaveLength(3);
  });

  it('o monotrilho de São Paulo tem data e fonte', () => {
    const monotrilho = pontos[0];
    expect(monotrilho.texto).toContain('30 de agosto de 2014');
    expect(monotrilho.fonte?.url).toMatch(/^https:\/\//);
  });
});

describe('Projete e Habite', () => {
  it('a Torre tem quatro notas, cada uma com um prédio real, fonte https e marca dentro das duas imagens', () => {
    expect(copy.projete.notas.map((n) => n.referencia)).toEqual([
      'Hearst Tower',
      'Shanghai Tower',
      'Jewel Changi',
      'Bosco Verticale',
    ]);
    for (const n of copy.projete.notas) {
      expect(n.fonte.url).toMatch(/^https:\/\//);
      expect(dentro(n.marca.largo.x) && dentro(n.marca.largo.y)).toBe(true);
      expect(n.marca.emPe && dentro(n.marca.emPe.x) && dentro(n.marca.emPe.y)).toBe(true);
    }
  });

  it('os números das notas são os das fontes', () => {
    const [diagonal, torcao, cachoeira, floresta] = copy.projete.notas.map((n) => n.texto);
    expect(diagonal).toContain('20% menos aço');
    expect(torcao).toContain('632 m');
    expect(torcao).toContain('120 graus');
    expect(torcao).toContain('24%');
    expect(cachoeira).toContain('40 metros');
    expect(floresta).toContain('700 árvores');
  });

  it('São Paulo tem o Copan, o MASP e a Ponte, cada um com o seu número e fonte https', () => {
    const moradas = copy.habite.moradas;
    expect(moradas.map((m) => m.id)).toEqual(['copan', 'masp', 'ponte']);
    expect(moradas.map((m) => m.numero)).toEqual(['1.160', '74', '138']);
    for (const m of moradas) expect(m.fonte.url).toMatch(/^https:\/\//);
  });
});

describe('textos', () => {
  it('nenhum texto fala mais de "São Paulo 2080" ou do botão Hoje/2080', () => {
    const tudo = JSON.stringify(copy);
    expect(tudo).not.toContain('São Paulo 2080');
    expect(tudo).not.toContain('“2080”');
  });

  it('crédito do rodapé aponta para o site do Miguel', () => {
    expect(brand.author).toBe('Miguel Angelo');
    expect(brand.url).toBe('https://miguelrsant.com.br');
    expect(brand.logoSrc).toBe('/brand/miguelrsant-icon-light.svg');
  });
});

import { expect, test } from '@playwright/test';

// Tela de um Android comum (412 × 872 CSS px, densidade 2,625), como o celular em que o site foi revisado.
test.use({ viewport: { width: 412, height: 872 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });

test('celular: a capa usa o recorte vertical em alta resolução', async ({ page }) => {
  await page.goto('/');
  const capa = page.getByRole('img', { name: /São Paulo em 2080 ao pôr do sol/ });
  await expect(capa).toBeVisible();
  await expect.poll(() => capa.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain('retrato');
  // pede pelo menos ~2000 px de largura: a imagem cobre a tela pela altura
  const largura = await capa.evaluate((img: HTMLImageElement) => Number(new URL(img.currentSrc).searchParams.get('w')));
  expect(largura).toBeGreaterThanOrEqual(1920);
});

test('celular: a capa termina no preto da página em qualquer ponto do scroll', async ({ page }) => {
  await page.goto('/');
  for (const y of [0, 160, 420]) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(150);
    // A camada que termina no preto da página (#07070B) cobre a borda de baixo, sempre opaca.
    const base = await page.locator('#top').evaluate((hero) => {
      const fundo = hero.getBoundingClientRect().bottom;
      const camada = [...hero.children].find((el) => /rgb\(7, 7, 11\) \d+%\)$/.test(getComputedStyle(el).backgroundImage));
      if (!camada) return null;
      return { cobre: camada.getBoundingClientRect().bottom >= fundo, opacidade: getComputedStyle(camada).opacity };
    });
    expect(base, `camada de saída da capa (scroll ${y})`).not.toBeNull();
    expect(base!.cobre).toBe(true);
    expect(base!.opacidade).toBe('1');
  }
});

test('celular: o texto do final cobre a seção inteira, sem faixa solta no topo', async ({ page }) => {
  await page.goto('/');
  const final = page.locator('#receber');
  await final.scrollIntoViewIfNeeded();
  const folga = await final.evaluate((s) => {
    const bloco = s.querySelector('h2')!.parentElement!;
    return { topo: bloco.getBoundingClientRect().top - s.getBoundingClientRect().top, base: s.getBoundingClientRect().bottom - bloco.getBoundingClientRect().bottom };
  });
  expect(Math.abs(folga.topo)).toBeLessThan(1);
  expect(Math.abs(folga.base)).toBeLessThan(1);
});

test('celular: linha de metadados da capa sem quadrado sobrando', async ({ page }) => {
  await page.goto('/');
  const quadrados = page.locator('#top p.meta i');
  await expect(quadrados.nth(0)).toBeVisible();
  await expect(quadrados.nth(1)).toBeHidden();
});

test('celular: o mapa cabe na tela e a lista acende o ponto da vez, sem rolar para os lados', async ({ page }) => {
  await page.goto('/');
  const masp = page.getByRole('button', { name: /^2\. MASP/ });
  await masp.scrollIntoViewIfNeeded();
  const cena = masp.locator('xpath=ancestor::div[contains(@class, "view")][1]');
  const medidas = await cena.evaluate((el) => ({
    pagina: document.documentElement.scrollWidth,
    tela: window.innerWidth,
    cena: el.getBoundingClientRect().width,
    rola: el.scrollWidth > el.clientWidth && getComputedStyle(el).overflowX !== 'hidden',
  }));
  expect(medidas.pagina).toBeLessThanOrEqual(medidas.tela);
  expect(medidas.cena).toBeLessThanOrEqual(medidas.tela);
  expect(medidas.rola).toBe(false);

  const itens = page.locator('#mapa ol > li');
  await expect(itens).toHaveCount(8);
  await expect(itens.nth(1)).toContainText('O museu suspenso de Lina Bo Bardi');

  // Tocar no 2 desce até o MASP na lista: o item fica logo abaixo da imagem, parada no topo, e os dois acendem.
  await masp.click();
  const item = page.locator('#mapa-ponto-2');
  const logoAbaixo = async () => {
    const [v, i] = await Promise.all([cena.boundingBox(), item.boundingBox()]);
    return v!.y < 64 && i!.y >= v!.y + v!.height - 1 && i!.y < v!.y + v!.height + 48;
  };
  await expect.poll(logoAbaixo).toBe(true);
  await expect(item).toHaveAttribute('aria-current', 'true');
  await expect(masp).toHaveAttribute('aria-current', 'true');

  // Descendo pela lista, o ponto seguinte acende no lugar dele.
  await page.evaluate(() => {
    const [a, b] = ['mapa-ponto-2', 'mapa-ponto-3'].map((id) => document.getElementById(id)!.getBoundingClientRect().top);
    window.scrollBy({ top: b - a, behavior: 'instant' });
  });
  await expect(page.locator('#mapa-ponto-3')).toHaveAttribute('aria-current', 'true');
  await expect(masp).not.toHaveAttribute('aria-current');
  await expect(item.getByRole('link', { name: /Ler o capítulo/ })).toHaveAttribute('href', '#masp');
});

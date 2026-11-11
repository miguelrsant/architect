import { expect, test } from '@playwright/test';

// Tela de um Android comum (412 × 872 CSS px, densidade 2,625), como o celular em que o site foi revisado.
test.use({ viewport: { width: 412, height: 872 }, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true });

test('celular: a capa usa o recorte vertical da Megacidade em alta resolução', async ({ page }) => {
  await page.goto('/');
  const capa = page.getByRole('img', { name: /megacidade futurista/ });
  await expect(capa).toBeVisible();
  await expect.poll(() => capa.evaluate((img: HTMLImageElement) => img.currentSrc)).toContain('retrato');
  // pede pelo menos ~1900 px de largura: a imagem cobre a tela pela altura
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

test('celular: linha de metadados da capa sem quadrado sobrando', async ({ page }) => {
  await page.goto('/');
  const quadrados = page.locator('#top p.meta i');
  await expect(quadrados.nth(0)).toBeVisible();
  await expect(quadrados.nth(1)).toBeHidden();
});

test('celular: o mapa da Megacidade cabe na tela e a lista acende o ponto da vez, sem rolar para os lados', async ({ page }) => {
  await page.goto('/');
  const telao = page.getByRole('button', { name: /^2\. Telões nas fachadas/ });
  await telao.scrollIntoViewIfNeeded();
  const cena = telao.locator('xpath=ancestor::div[contains(@class, "view")][1]');
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
  await expect(itens).toHaveCount(6);
  await expect(itens.nth(0)).toContainText('30 de agosto de 2014');
  await expect(itens.nth(0).getByRole('link', { name: 'Wikipedia' })).toHaveAttribute('href', /Line_15/);

  // Tocar no 2 desce até o telão na lista: o item fica logo abaixo da imagem, parada no topo, e os dois acendem.
  await telao.click();
  const item = page.locator('#mapa-ponto-2');
  const logoAbaixo = async () => {
    const [v, i] = await Promise.all([cena.boundingBox(), item.boundingBox()]);
    return v!.y < 64 && i!.y >= v!.y + v!.height - 1 && i!.y < v!.y + v!.height + 48;
  };
  await expect.poll(logoAbaixo).toBe(true);
  await expect(item).toHaveAttribute('aria-current', 'true');
  await expect(telao).toHaveAttribute('aria-current', 'true');

  // Descendo pela lista, o ponto seguinte acende no lugar dele.
  await page.evaluate(() => {
    const [a, b] = ['mapa-ponto-2', 'mapa-ponto-3'].map((id) => document.getElementById(id)!.getBoundingClientRect().top);
    window.scrollBy({ top: b - a, behavior: 'instant' });
  });
  await expect(page.locator('#mapa-ponto-3')).toHaveAttribute('aria-current', 'true');
  await expect(telao).not.toHaveAttribute('aria-current');
});

test('celular: a Torre fica no topo, desenhando, e os cartões passam embaixo dela', async ({ page }) => {
  await page.goto('/');
  const secao = page.locator('#projete');
  // o cartão da torção logo abaixo do palco (que fica a 60 px do topo, embaixo do menu)
  await secao.locator('ol > li:nth-child(3) article').evaluate((el) => {
    const palco = document.querySelector<HTMLElement>('#projete > div > div:nth-child(2)')!;
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - (60 + palco.offsetHeight + 20), behavior: 'instant' });
  });
  await expect(secao).toHaveAttribute('data-modo', 'desenho', { timeout: 20_000 });
  const palco = secao.locator('> div > div:nth-child(2)');
  const [p, cartao] = await Promise.all([palco.boundingBox(), secao.locator('ol > li:nth-child(3) article').boundingBox()]);
  expect(Math.round(p!.y)).toBe(60); // encostado embaixo do menu
  expect(cartao!.y).toBeGreaterThanOrEqual(p!.y + p!.height); // o cartão passa embaixo do palco, sem cobrir a torre
  await expect(secao.locator('ol > li:nth-child(3)')).toHaveAttribute('aria-current', 'true');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
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

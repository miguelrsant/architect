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

test('celular: a Megacidade ocupa a tela, os cartões sobem por cima e a câmera leva o ponto da vez ao meio', async ({ page }) => {
  await page.goto('/');
  const mapa = page.locator('#mapa');
  const cena = mapa.locator('div[class*="view"]').first();
  // a cena acabou de encostar embaixo do menu: nenhum cartão por cima ainda
  await mapa.locator('ol').evaluate((lista) =>
    window.scrollTo({ top: window.scrollY + lista.parentElement!.getBoundingClientRect().top - 60, behavior: 'instant' }),
  );
  const v = await cena.boundingBox();
  expect(Math.round(v!.y)).toBe(60);
  expect(Math.round(v!.y + v!.height)).toBe(page.viewportSize()!.height);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

  const itens = mapa.locator('ol > li');
  await expect(itens).toHaveCount(6);
  await expect(itens.nth(0)).toContainText('30 de agosto de 2014');
  await expect(itens.nth(0).getByRole('link', { name: 'Wikipedia' })).toHaveAttribute('href', /Line_15/);

  // Tocar no 4 leva ao cartão dele, por cima da cena; o ponto e o cartão acendem, e o nome aparece no ponto.
  const carros = page.getByRole('button', { name: /^4\. Carros voadores/ });
  await carros.click();
  const item = page.locator('#mapa-ponto-4');
  await expect(item).toHaveAttribute('aria-current', 'true');
  await expect(carros).toHaveAttribute('aria-current', 'true');
  await expect(mapa.locator('span[class*="rotulo"]')).toHaveText('Carros voadores');
  const c = await item.locator('> div').boundingBox();
  expect(c!.y).toBeGreaterThan(v!.y);
  expect(c!.y + c!.height).toBeLessThan(v!.y + v!.height);
  // a câmera anda pela cidade até o ponto ficar no meio da tela
  const meio = page.viewportSize()!.width / 2;
  await expect
    .poll(async () => {
      const b = await carros.boundingBox();
      return Math.abs(b!.x + b!.width / 2 - meio);
    })
    .toBeLessThan(4);

  // Descendo, o cartão seguinte passa da linha de leitura e o ponto dele acende no lugar.
  await page.evaluate(() => {
    const [a, b] = ['mapa-ponto-4', 'mapa-ponto-5'].map((id) => document.getElementById(id)!.getBoundingClientRect().top);
    window.scrollBy({ top: b - a, behavior: 'instant' });
  });
  await expect(page.locator('#mapa-ponto-5')).toHaveAttribute('aria-current', 'true');
  await expect(carros).not.toHaveAttribute('aria-current');
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('celular com menos movimento: a Megacidade fica parada no topo e a lista acende o ponto da vez', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const telao = page.getByRole('button', { name: /^2\. Telões nas fachadas/ });
  await telao.scrollIntoViewIfNeeded();
  const cena = telao.locator('xpath=ancestor::div[contains(@class, "view")][1]');
  const medidas = await cena.evaluate((el) => ({
    pagina: document.documentElement.scrollWidth,
    tela: window.innerWidth,
    cena: el.getBoundingClientRect().width,
  }));
  expect(medidas.pagina).toBeLessThanOrEqual(medidas.tela);
  expect(medidas.cena).toBeLessThanOrEqual(medidas.tela);

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

test('celular: a Torre ocupa a tela e os cartões sobem por cima dela, como no computador', async ({ page }) => {
  await page.goto('/');
  const secao = page.locator('#projete');
  const cartao = secao.locator('ol > li:nth-child(3) article');
  // o cartão da torção acima da linha de leitura (60% da tela), por cima do desenho
  await cartao.evaluate((el) =>
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.4, behavior: 'instant' }),
  );
  await expect(secao).toHaveAttribute('data-modo', 'desenho', { timeout: 20_000 });
  const palco = secao.locator('> div > div:nth-child(2)');
  const [p, c] = await Promise.all([palco.boundingBox(), cartao.boundingBox()]);
  expect(Math.round(p!.y)).toBe(60); // encostado embaixo do menu
  expect(Math.round(p!.y + p!.height)).toBe(page.viewportSize()!.height); // e até o pé da tela
  expect(c!.y).toBeGreaterThan(p!.y); // o cartão passa por cima do desenho
  expect(c!.y + c!.height).toBeLessThan(p!.y + p!.height);
  await expect(secao.locator('ol > li:nth-child(3)')).toHaveAttribute('aria-current', 'true');
  // só a marca da vez aparece, e o traço sai na resolução da tela (mais que 2x)
  await expect(secao.locator('[data-ativa]')).toContainText('Torção');
  await expect(secao.locator('[data-ativa]')).toHaveCSS('opacity', '1');
  await expect(secao.locator('span[aria-hidden]:not([data-ativa])').first()).toHaveCSS('opacity', '0');
  const nitidez = await secao.locator('canvas').evaluate((c: HTMLCanvasElement) => c.width / c.clientWidth);
  expect(nitidez).toBeGreaterThan(2.5);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);
});

test('celular: São Paulo ocupa a tela e a câmera anda até o prédio de cada cartão', async ({ page }) => {
  await page.goto('/');
  const secao = page.locator('#habite');
  const cartao = secao.locator('ol > li:nth-child(3) article');
  // o cartão do MASP acima da linha de leitura (60% da tela), por cima da cidade
  await cartao.evaluate((el) =>
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.4, behavior: 'instant' }),
  );
  await expect(secao.locator('ol > li:nth-child(3)')).toHaveAttribute('aria-current', 'true');
  const palco = secao.locator('> div > div:nth-child(2)');
  const [p, c] = await Promise.all([palco.boundingBox(), cartao.boundingBox()]);
  expect(Math.round(p!.y)).toBe(60); // encostado embaixo do menu
  expect(Math.round(p!.y + p!.height)).toBe(page.viewportSize()!.height); // e até o pé da tela
  expect(c!.y).toBeGreaterThan(p!.y); // o cartão passa por cima da cidade
  expect(c!.y + c!.height).toBeLessThan(p!.y + p!.height);
  // só a marca da vez aparece, e a câmera leva o MASP para o meio da tela
  const marca = secao.locator('[data-ativa]');
  await expect(marca).toContainText('MASP');
  await expect(marca).toHaveCSS('opacity', '1');
  await expect(secao.locator('span[aria-hidden]:not([data-ativa])').first()).toHaveCSS('opacity', '0');
  const meio = page.viewportSize()!.width / 2;
  await expect
    .poll(async () => {
      const b = await marca.locator('i').boundingBox();
      return Math.abs(b!.x + b!.width / 2 - meio);
    })
    .toBeLessThan(4);
  // a cidade larga cobre a cena sem mostrar a borda, e a página não rola para os lados
  const capa = await palco.locator('> div').boundingBox();
  expect(capa!.x).toBeLessThanOrEqual(0);
  expect(capa!.x + capa!.width).toBeGreaterThanOrEqual(page.viewportSize()!.width);
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

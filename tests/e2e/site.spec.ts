import { expect, test, type Page } from '@playwright/test';

async function open(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  await page.goto('/');
  return errors;
}

/** Rola até `fracao` do curso da cena fixada (0: o palco encostou no menu; 1: a seção vai soltar). */
async function rolarCena(page: Page, id: string, fracao: number) {
  await page.evaluate(
    ({ id, fracao }) => {
      const trilho = document.querySelector(`#${id} > div > div:nth-child(1)`)!;
      const palco = document.querySelector<HTMLElement>(`#${id} > div > div:nth-child(2)`)!;
      const menu = parseFloat(getComputedStyle(palco).top) || 0;
      const topo = trilho.getBoundingClientRect().top + window.scrollY - menu;
      const curso = (trilho as HTMLElement).offsetHeight - palco.offsetHeight;
      window.scrollTo({ top: topo + curso * fracao, behavior: 'instant' });
    },
    { id, fracao },
  );
}

const menuAgora = (page: Page) => page.locator('header nav a[aria-current]');

test('abre sem erros no console, com a Megacidade e o título que é o caminho do site', async ({ page }) => {
  const errors = await open(page);
  await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/Imagine\.\s*Projete\.\s*Habite\./);
  await expect(page.getByRole('img', { name: /megacidade futurista/ })).toBeVisible();
  await expect(menuAgora(page)).toHaveText('Imagine');
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.locator('#top').evaluate((el) => Number(el.style.getPropertyValue('--p')))).toBeGreaterThan(0.3);
  expect(errors).toEqual([]);
});

test('a frase acende palavra por palavra e termina em destaque', async ({ page }) => {
  await open(page);
  const frase = page.locator('section[aria-label="A frase"]');
  const palavras = frase.locator('[data-w]');
  const acesas = () => frase.evaluate((s) => [...s.querySelectorAll('[data-w]')].filter((w) => getComputedStyle(w).opacity === '1').length);
  const texto = frase.locator('p').last();
  const total = await palavras.count();
  // com a frase no meio da tela, parte das palavras já acendeu e o resto ainda espera
  await texto.evaluate((p) => window.scrollTo({ top: window.scrollY + p.getBoundingClientRect().top - window.innerHeight * 0.55, behavior: 'instant' }));
  await expect.poll(async () => {
    const n = await acesas();
    return n > 0 && n < total;
  }).toBe(true);
  await texto.evaluate((p) => window.scrollTo({ top: window.scrollY + p.getBoundingClientRect().bottom, behavior: 'instant' }));
  await expect.poll(acesas).toBe(total);
  await expect(palavras.last()).toHaveText('nela.');
  await expect(palavras.last()).toHaveCSS('font-style', 'italic');
});

test('o que a ficção acertou: o ponto abre o cartão com o selo e a fonte, e Esc fecha', async ({ page }) => {
  await open(page);
  await page.locator('#mapa').scrollIntoViewIfNeeded();
  const monotrilho = page.getByRole('button', { name: /^1\. Monotrilho \(Já existe\)/ });
  await monotrilho.click();
  await expect(monotrilho).toHaveAttribute('aria-expanded', 'true');
  const cartao = page.locator('#mapa-cartao');
  await expect(cartao).toContainText('30 de agosto de 2014');
  await expect(cartao.getByRole('link', { name: 'Wikipedia' })).toHaveAttribute('href', /Line_15/);
  await page.keyboard.press('Escape');
  await expect(cartao).toHaveCount(0);

  await page.getByRole('button', { name: /^5\. O monólito sem janelas/ }).click();
  await expect(cartao).toContainText('Ainda é ficção');
});

test('Projete: a Torre se desenha, o cartão da vez acende a sua marca e o menu marca o ato', async ({ page }) => {
  await open(page);
  const secao = page.locator('#projete');
  await rolarCena(page, 'projete', 0);
  await expect(secao).toHaveAttribute('data-modo', 'desenho', { timeout: 20_000 });
  await expect(secao.locator('canvas')).toHaveCSS('opacity', '1');
  await expect(menuAgora(page)).toHaveText('Projete');

  // o cartão da cachoeira na linha de leitura acende a marca 03 na torre
  await secao.locator('ol > li:nth-child(4) article').evaluate((el) =>
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.5, behavior: 'instant' }),
  );
  await expect(secao.locator('ol > li:nth-child(4)')).toHaveAttribute('aria-current', 'true');
  await expect(secao.locator('[data-ativa]')).toContainText('Cachoeira');
});

test('Habite: São Paulo vai do pôr do sol à noite com a rolagem', async ({ page }) => {
  await open(page);
  const noite = () => page.locator('#habite').evaluate((el) => Number(el.style.getPropertyValue('--noite')));
  await rolarCena(page, 'habite', 0.05);
  await expect.poll(noite).toBeLessThan(0.05);
  await expect(menuAgora(page)).toHaveText('Habite');
  await rolarCena(page, 'habite', 0.95);
  await expect.poll(noite).toBe(1);
  await expect(page.getByText('As janelas acendem. Alguém chegou em casa.')).toBeVisible();

  await page.locator('#perguntas').evaluate((el) => window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top, behavior: 'instant' }));
  await expect(menuAgora(page)).toHaveCount(0);
});

test('entre um ato e outro a cena passa pela noite: chega escura, acende e apaga antes de soltar', async ({ page }) => {
  await open(page);
  const veu = (id: string) => () =>
    page.locator(`#${id} > div > div:nth-child(2)`).evaluate((el) => Number((el as HTMLElement).style.getPropertyValue('--veu')));
  for (const id of ['projete', 'habite']) {
    await rolarCena(page, id, 0);
    await expect.poll(veu(id), { message: `${id} chega escura` }).toBe(1);
    await rolarCena(page, id, 0.5);
    await expect.poll(veu(id), { message: `${id} acesa no meio` }).toBe(0);
    await rolarCena(page, id, 1);
    await expect.poll(veu(id), { message: `${id} apaga antes de soltar` }).toBe(1);
  }
});

test('rodapé: logo e nome levam para miguelrsant.com.br em nova aba', async ({ page }) => {
  await open(page);
  const credito = page.locator('footer a', { hasText: 'Miguel Angelo' });
  await expect(credito).toHaveAttribute('href', 'https://miguelrsant.com.br');
  await expect(credito).toHaveAttribute('target', '_blank');
  await expect(credito).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(credito.locator('img')).toHaveAttribute('src', '/brand/miguelrsant-icon-light.svg');
  await expect(credito.locator('img')).toHaveAttribute('alt', 'miguelrsant');
  await expect(page.locator('footer').getByRole('link', { name: 'Thornton Tomasetti' })).toBeVisible();
});

test('formulário: valida o e-mail e responde ao envio', async ({ page }) => {
  await open(page);
  const form = page.locator('#receber form');
  await form.scrollIntoViewIfNeeded();
  await form.getByPlaceholder('seu@email.com').fill('incompleto@');
  await form.getByRole('button', { name: /Receber o atlas/ }).click();
  await expect(form.getByRole('status')).toContainText('incompleto');

  await form.getByPlaceholder('seu@email.com').fill('leitor@exemplo.com');
  await form.getByRole('button', { name: /Receber o atlas/ }).click();
  await expect(form.getByRole('status')).toContainText(/Obrigado|Pronto/);
});

test.describe('movimento reduzido', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nada fica fixado: a Torre colorida com o desenho parado e a noite depois do pôr do sol', async ({ page }) => {
    const errors = await open(page);
    const projete = page.locator('#projete');
    await expect(projete).toHaveAttribute('data-modo', 'parado');
    await expect(projete.locator('> div > div:nth-child(2)')).toHaveCSS('position', 'relative');
    await expect(projete.getByRole('img', { name: /desenho técnico/ })).toBeVisible();
    await expect(page.locator('#habite').getByRole('img', { name: /São Paulo à noite/ })).toBeVisible();

    // a frase inteira acesa, sem esperar a rolagem
    const frase = page.locator('section[aria-label="A frase"]');
    await expect(frase.locator('[data-w]').first()).toHaveCSS('opacity', '1');
    await expect(frase.locator('[data-w]').last()).toHaveCSS('opacity', '1');
    expect(errors).toEqual([]);
  });
});

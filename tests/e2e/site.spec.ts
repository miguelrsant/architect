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

test('carrega sem erros no console e mostra o herói', async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator('h1')).toHaveText('Imagine. Projete. Habite.');
  await expect(page.getByRole('img', { name: /São Paulo em 2080 ao pôr do sol/ })).toBeVisible();
  await page.mouse.wheel(0, 600);
  await expect.poll(() => page.locator('#top').evaluate((el) => Number(el.style.getPropertyValue('--night')))).toBeGreaterThan(0.5);
  expect(errors).toEqual([]);
});

test('rodapé: logo e nome levam para miguelrsant.com.br em nova aba', async ({ page }) => {
  await open(page);
  const credito = page.locator('footer a', { hasText: 'Miguel Angelo' });
  await expect(credito).toHaveAttribute('href', 'https://miguelrsant.com.br');
  await expect(credito).toHaveAttribute('target', '_blank');
  await expect(credito).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(credito.locator('img')).toHaveAttribute('src', '/brand/miguelrsant-icon-light.svg');
  await expect(credito.locator('img')).toHaveAttribute('alt', 'miguelrsant');
});

test('capítulo: o botão troca entre Hoje e 2080', async ({ page }) => {
  await open(page);
  const copan = page.locator('#copan');
  await copan.scrollIntoViewIfNeeded();
  await expect(copan.getByText('Existe hoje')).toBeVisible();
  await copan.getByRole('button', { name: '2080' }).click();
  await expect(copan.getByRole('button', { name: '2080' })).toHaveAttribute('aria-pressed', 'true');
  await expect(copan.getByText('2080 · imaginado')).toBeVisible();
  await expect(copan.getByText(/painéis solares/)).toBeVisible();
  await expect(copan.getByText('Existe hoje')).toBeHidden();
});

test('mapa: o ponto abre o cartão, o link leva ao capítulo e Esc fecha', async ({ page }) => {
  await open(page);
  await page.locator('#mapa').scrollIntoViewIfNeeded();
  const ponte = page.getByRole('button', { name: /^3\. Ponte Estaiada/ });
  await ponte.click();
  await expect(ponte).toHaveAttribute('aria-expanded', 'true');
  const cartao = page.locator('#mapa-cartao');
  await expect(cartao).toContainText('O X de 138 metros');
  await expect(cartao.getByRole('link')).toHaveAttribute('href', '#ponte');
  await page.keyboard.press('Escape');
  await expect(cartao).toHaveCount(0);

  await page.getByRole('button', { name: /^7\. Torre-cápsula/ }).click();
  await expect(cartao).toContainText('2080');
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

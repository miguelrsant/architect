// Gera as imagens do README em docs/ (uso: npm run build && npm start, depois npm run shots [url] [saida]).
// Usa o Google Chrome instalado; CHROMIUM_PATH aponta outro executável.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const url = process.argv[2] ?? 'http://localhost:3000/';
const out = process.argv[3] ?? 'docs';
mkdirSync(out, { recursive: true });

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : { channel: 'chrome' },
);
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const shot = (name) => page.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 86 });
const center = (selector) =>
  page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), selector);

await page.goto(url, { waitUntil: 'networkidle' });
// Espera as fontes e a decodificação das duas ilustrações (sem isso, sai o placeholder borrado)
await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.querySelectorAll('#top img')].map((i) => i.decode())]));
await page.waitForTimeout(2500); // o título termina de subir
await shot('capa');

// Capítulo do Copan já em 2080 (recorte noturno e texto imaginado)
await center('#copan');
await page.locator('#copan').getByRole('button', { name: '2080' }).click();
await page.waitForTimeout(1800);
await shot('capitulo');

// Mapa da cena com o MASP aberto
await center('#mapa img');
await page.waitForTimeout(800);
await page.getByRole('button', { name: /^2\. MASP/ }).click();
await page.waitForTimeout(600);
await shot('mapa');

await browser.close();
console.log(`Imagens salvas em ${out}/: capa.jpg, capitulo.jpg, mapa.jpg`);

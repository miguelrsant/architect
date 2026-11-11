// Gera as imagens do README em docs/ (uso: npm run build && npm start, depois npm run shots [url] [saida]).
// Usa o Google Chrome instalado; CHROMIUM_PATH aponta outro executável. O desenho da Torre usa WebGL:
// sem placa de vídeo, ele roda no SwiftShader.
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const url = new URL(process.argv[2] ?? 'http://localhost:3000/');
url.searchParams.set('quadro', ''); // cada cena parada no seu momento mais representativo
const out = process.argv[3] ?? 'docs';
mkdirSync(out, { recursive: true });

const args = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'];
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH, args } : { channel: 'chrome', args },
);
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const shot = (name) => page.screenshot({ path: `${out}/${name}.jpg`, type: 'jpeg', quality: 86 });
const topo = (selector, fracao = 0) =>
  page.evaluate(
    ([s, f]) => {
      const el = document.querySelector(s);
      window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - window.innerHeight * f, behavior: 'instant' });
    },
    [selector, fracao],
  );

await page.goto(url.href, { waitUntil: 'networkidle' });
// Espera as fontes e a decodificação da capa (sem isso, sai o placeholder borrado)
await page.evaluate(() => Promise.all([document.fonts.ready, ...[...document.querySelectorAll('#top img')].map((i) => i.decode())]));
await page.waitForTimeout(3000); // o título termina de subir e a cidade de chegar
await shot('capa');

// A Torre no meio do desenho, com a nota da cachoeira na linha de leitura
await topo('#projete ol > li:nth-child(4) article', 0.36);
await page.waitForFunction(() => document.querySelector('#projete')?.dataset.modo === 'desenho', null, { timeout: 20000 });
await page.waitForTimeout(1500);
await shot('torre');

// O que a ficção acertou: a Megacidade com o monotrilho aberto
await topo('#mapa img', 0.12);
await page.waitForTimeout(1500);
await page.getByRole('button', { name: /^1\. Monotrilho/ }).click();
await page.waitForTimeout(600);
await shot('mapa');

await browser.close();
console.log(`Imagens salvas em ${out}/: capa.jpg, torre.jpg, mapa.jpg`);

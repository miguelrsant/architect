import { defineConfig } from '@playwright/test';

// Roda contra o build de produção. Usa o Google Chrome instalado (como no casa_3d);
// CHROMIUM_PATH aponta outro executável, por exemplo o Chromium do Playwright em CI.
const port = 3100;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: /.*\.spec\.ts/,
  timeout: 60_000,
  workers: 1,
  use: {
    baseURL: `http://localhost:${port}`,
    headless: true,
    viewport: { width: 1440, height: 900 },
    // O desenho da Torre usa WebGL: sem placa de vídeo (CI, servidor), ele roda no SwiftShader.
    launchOptions: {
      args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
      ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    },
    ...(process.env.CHROMIUM_PATH ? {} : { channel: 'chrome' as const }),
  },
  webServer: {
    command: `npm run build && npm run start -- --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: true,
    timeout: 240_000,
  },
});

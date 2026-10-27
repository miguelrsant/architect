import { afterEach, describe, expect, it, vi } from 'vitest';
import { POST } from '@/app/api/inscricao/route';
import { isEmail, normalizeEmail } from '@/lib/inscricao';

const post = (body: unknown) =>
  POST(
    new Request('http://localhost/api/inscricao', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
  );

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('isEmail', () => {
  it.each(['a@b.co', 'miguel@exemplo.com.br', 'nome.sobrenome+atlas@mail.com'])('aceita %s', (e) => {
    expect(isEmail(e)).toBe(true);
  });

  it.each(['', 'sem-arroba', 'a@b', 'a @b.com', '@b.com', `${'a'.repeat(250)}@b.com`])('recusa %j', (e) => {
    expect(isEmail(e)).toBe(false);
  });

  it('normaliza espaços e maiúsculas', () => {
    expect(normalizeEmail('  Miguel@Exemplo.COM ')).toBe('miguel@exemplo.com');
  });
});

describe('POST /api/inscricao', () => {
  it('recusa JSON quebrado e e-mail inválido', async () => {
    expect((await post('{')).status).toBe(400);
    const res = await post({ email: 'nada' });
    expect(res.status).toBe(422);
    expect(await res.json()).toEqual({ ok: false, erro: 'email' });
  });

  it('sem serviço configurado responde em modo demonstração', async () => {
    vi.stubEnv('INSCRICAO_WEBHOOK_URL', '');
    const res = await post({ email: 'leitor@exemplo.com' });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, demo: true });
  });

  it('com INSCRICAO_WEBHOOK_URL repassa o e-mail normalizado', async () => {
    vi.stubEnv('INSCRICAO_WEBHOOK_URL', 'https://hooks.exemplo.com/atlas');
    const fetchMock = vi.fn(async () => new Response('ok'));
    vi.stubGlobal('fetch', fetchMock);

    const res = await post({ email: ' Leitor@Exemplo.com ' });
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe('https://hooks.exemplo.com/atlas');
    expect(JSON.parse(String(init.body))).toMatchObject({ email: 'leitor@exemplo.com', origem: 'arqatlas' });
  });

  it('avisa quando o serviço de e-mail falha', async () => {
    vi.stubEnv('INSCRICAO_WEBHOOK_URL', 'https://hooks.exemplo.com/atlas');
    vi.stubGlobal('fetch', vi.fn(async () => new Response('erro', { status: 500 })));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await post({ email: 'leitor@exemplo.com' });
    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ ok: false, erro: 'webhook' });
  });

  it('campo-armadilha preenchido: finge sucesso e não chama o serviço', async () => {
    vi.stubEnv('INSCRICAO_WEBHOOK_URL', 'https://hooks.exemplo.com/atlas');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const res = await post({ email: 'robo@exemplo.com', empresa: 'ACME' });
    expect(await res.json()).toEqual({ ok: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

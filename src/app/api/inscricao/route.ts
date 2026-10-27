import { type InscricaoResposta, isEmail, normalizeEmail } from '@/lib/inscricao';

/**
 * Recebe o e-mail do formulário "Receber o atlas".
 * Com INSCRICAO_WEBHOOK_URL definido, repassa { email, origem, data } em JSON para esse endereço
 * (Zapier, Make, n8n, Google Apps Script...). Sem ele, responde em modo demonstração e não guarda nada.
 */
export async function POST(request: Request) {
  const responder = (body: InscricaoResposta, status = 200) => Response.json(body, { status });

  let body: { email?: unknown; empresa?: unknown };
  try {
    body = await request.json();
  } catch {
    return responder({ ok: false, erro: 'json' }, 400);
  }

  // Campo-armadilha preenchido: é robô. Responde como se tivesse dado certo.
  if (typeof body.empresa === 'string' && body.empresa.trim() !== '') return responder({ ok: true });

  const email = typeof body.email === 'string' ? normalizeEmail(body.email) : '';
  if (!isEmail(email)) return responder({ ok: false, erro: 'email' }, 422);

  const webhook = process.env.INSCRICAO_WEBHOOK_URL;
  if (!webhook) return responder({ ok: true, demo: true });

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, origem: 'arqatlas', data: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (err) {
    console.error('inscricao: falha no webhook', err);
    return responder({ ok: false, erro: 'webhook' }, 502);
  }
  return responder({ ok: true });
}

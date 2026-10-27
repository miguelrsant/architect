// Validação do e-mail, usada no formulário e na rota /api/inscricao.
// Simples de propósito: só barra o que claramente não é e-mail; quem confirma é o serviço de envio.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isEmail(value: string): boolean {
  return value.length <= 254 && EMAIL.test(value);
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export interface InscricaoResposta {
  ok: boolean;
  /** true quando nenhum serviço de e-mail está configurado (INSCRICAO_WEBHOOK_URL vazio). */
  demo?: boolean;
  erro?: 'json' | 'email' | 'webhook';
}

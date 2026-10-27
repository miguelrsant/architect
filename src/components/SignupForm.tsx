'use client';

import { type FormEvent, useState } from 'react';
import { copy } from '@/content/copy.pt-BR';
import { type InscricaoResposta, isEmail } from '@/lib/inscricao';
import styles from './Finale.module.css';

type Estado = 'parado' | 'enviando' | 'ok' | 'demo' | 'invalido' | 'erro';

export function SignupForm() {
  const t = copy.final.form;
  const [estado, setEstado] = useState<Estado>('parado');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const email = String(data.get('email') ?? '').trim();
    if (!isEmail(email)) {
      setEstado('invalido');
      return;
    }
    setEstado('enviando');
    try {
      const res = await fetch('/api/inscricao', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, empresa: data.get('empresa') ?? '' }),
      });
      const body = (await res.json()) as InscricaoResposta;
      if (!res.ok || !body.ok) throw new Error(body.erro ?? String(res.status));
      form.reset();
      setEstado(body.demo ? 'demo' : 'ok');
    } catch {
      setEstado('erro');
    }
  }

  const mensagem = { parado: '', enviando: '', ok: t.ok, demo: t.demo, invalido: t.invalido, erro: t.erro }[estado];
  const problema = estado === 'invalido' || estado === 'erro';

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <label htmlFor="inscricao-email" className="sr-only">
          {t.rotulo}
        </label>
        <input
          id="inscricao-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder={t.placeholder}
          aria-invalid={estado === 'invalido'}
          aria-describedby="inscricao-status"
        />
        {/* Campo-armadilha para robôs: fica fora da tela e ninguém preenche. */}
        <input type="text" name="empresa" tabIndex={-1} autoComplete="off" aria-hidden="true" className={styles.trap} />
        <button className="btn btn-primary btn-lg" type="submit" disabled={estado === 'enviando'}>
          {estado === 'enviando' ? t.enviando : t.botao}{' '}
          <span className="arr" aria-hidden="true">
            →
          </span>
        </button>
      </div>
      <p id="inscricao-status" className={`${styles.status} ${problema ? styles.problem : ''}`} role="status">
        {mensagem}
      </p>
    </form>
  );
}

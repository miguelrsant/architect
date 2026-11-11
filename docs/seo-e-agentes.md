# SEO, agentes de IA e velocidade

O que o site tem para ser bem indexado no Google e lido por agentes de IA. Os textos saem de uma fonte só: `src/content/site.ts` (páginas internas e dados do site), `src/content/copy.pt-BR.ts` (home) e `src/content/brand.ts` (autor e links).

## O que existe

- **Markdown para agentes**: qualquer página pedida com `Accept: text/markdown` ou com `.md` no fim (`/index.md`, `/sobre.md`) devolve Markdown, com `Vary: Accept`. Quem resolve é `src/proxy.ts`; o texto é montado em `src/lib/agents.ts`.
- **404**: HTML no visual do site, com `noindex` (`src/app/not-found.tsx`), e Markdown para agentes, com links para `/llms.txt` e `/sitemap.xml`.
- **`/llms.txt`** no formato do llmstxt.org, com a seção `## When to use`.
- **JSON-LD** (`src/lib/jsonld.ts`): `Person` (o autor), `WebSite`, `CreativeWork` e o tipo de cada página.
- **`/robots.txt` e `/sitemap.xml`** (`src/app/robots.ts`, `src/app/sitemap.ts`), com a data real de cada página.
- **Páginas de confiança**: `/sobre`, `/contato` e `/privacidade`, linkadas no rodapé. `/about`, `/contact` e `/privacy` redirecionam (308).
- **Metadados** (`src/lib/meta.ts`): título e descrição por página, canonical absoluto, Open Graph e Twitter card.
- **Um domínio só**: os endereços `*-miguelrsants-projects.vercel.app` redirecionam para o oficial (`next.config.ts`).
- **Crédito**: o rodapé diz quem desenvolveu o site, com link para miguelrsant.com.br, Instagram e o repositório.

## Como testar

```bash
npm run build && npm start        # em outro terminal
npm run test:agents               # BASE_URL=https://arqatlas-theta.vercel.app testa o site publicado
```

## Pendente (depende do dono)

- Novo scan no https://is-agentic.com e PageSpeed no endereço publicado.
- Registrar o domínio no Google Search Console e no Bing Webmaster Tools e enviar o sitemap.
- O formulário de contato está em modo de demonstração: não envia nem guarda nada. Se passar a enviar, atualizar `/privacidade`.

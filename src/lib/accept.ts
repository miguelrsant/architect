// Negociação pelo cabeçalho Accept: o Markdown só vence quando text/markdown aparece pelo nome
// com peso (q) maior ou igual ao do HTML; */* e text/* continuam recebendo HTML, como os navegadores.
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  let md = 0;
  const html: Record<"exact" | "text" | "any", number | undefined> = { exact: undefined, text: undefined, any: undefined };
  for (const part of accept.toLowerCase().split(",")) {
    const [type, ...params] = part.split(";").map((s) => s.trim());
    const qParam = params.find((p) => p.startsWith("q="));
    const parsed = qParam ? Number(qParam.slice(2)) : 1;
    const q = Number.isFinite(parsed) ? Math.min(Math.max(parsed, 0), 1) : 0;
    if (type === "text/markdown" || type === "text/x-markdown") md = Math.max(md, q);
    else if (type === "text/html" || type === "application/xhtml+xml") html.exact = Math.max(html.exact ?? 0, q);
    else if (type === "text/*") html.text = Math.max(html.text ?? 0, q);
    else if (type === "*/*") html.any = Math.max(html.any ?? 0, q);
  }
  const htmlQ = html.exact ?? html.text ?? html.any ?? 0;
  return md > 0 && md >= htmlQ;
}

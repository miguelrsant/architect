// Quem pede Accept: text/markdown, ou um endereço terminado em .md, recebe a página em Markdown
// (ou um 404 em Markdown), com Vary: Accept. O resto segue para o HTML normal.
import { NextResponse, type NextRequest } from 'next/server';
import { prefersMarkdown } from '@/lib/accept';
import { markdownFor } from '@/lib/agents';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isFile = /\.[a-z0-9]+$/i.test(pathname) && !pathname.endsWith('.md');
  if (isFile || pathname.startsWith('/api/') || !['GET', 'HEAD'].includes(request.method)) return NextResponse.next();

  if (pathname.endsWith('.md') || prefersMarkdown(request.headers.get('accept'))) {
    const { status, body } = markdownFor(pathname);
    return new NextResponse(request.method === 'HEAD' ? null : body, {
      status,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        Vary: 'Accept',
        'x-markdown-tokens': String(Math.ceil(body.length / 4)),
        'Cache-Control': 'public, max-age=300',
        'X-Robots-Tag': 'noindex',
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    { source: '/((?!_next/).*)', has: [{ type: 'header', key: 'accept', value: '.*markdown.*' }] },
    '/(.*\\.md)',
  ],
};

import { llmsTxt } from '@/lib/agents';

// /llms.txt: índice do site para agentes de IA (llmstxt.org).
export function GET() {
  return new Response(llmsTxt(), {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}

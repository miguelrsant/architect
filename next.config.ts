import type { NextConfig } from 'next';

// Domínio oficial. Os endereços de projeto da Vercel redirecionam para ele (um domínio só para o Google).
const OFICIAL = 'arqatlas-theta.vercel.app';
const OUTROS = ['arqatlas-miguelrsants-projects.vercel.app', 'arqatlas-git-main-miguelrsants-projects.vercel.app'];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF primeiro (menor), WebP como reserva. 85 só nas cenas em tela cheia.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
  },
  async redirects() {
    return [
      // Os auditores de agentes testam os nomes em inglês.
      { source: '/about', destination: '/sobre', permanent: true },
      { source: '/contact', destination: '/contato', permanent: true },
      { source: '/privacy', destination: '/privacidade', permanent: true },
      ...OUTROS.map((host) => ({
        source: '/:path*',
        has: [{ type: 'host' as const, value: host }],
        destination: `https://${OFICIAL}/:path*`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: '/',
        headers: [{ key: 'Link', value: '</sitemap.xml>; rel="sitemap", </index.md>; rel="alternate"; type="text/markdown", </llms.txt>; rel="describedby"; type="text/markdown"' }],
      },
    ];
  },
};

export default nextConfig;

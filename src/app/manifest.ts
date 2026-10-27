import type { MetadataRoute } from 'next';
import { project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${project.name} · São Paulo 2080`,
    short_name: project.name,
    description: copy.meta.description,
    lang: 'pt-BR',
    start_url: '/',
    display: 'standalone',
    background_color: '#07070B',
    theme_color: '#07070B',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}

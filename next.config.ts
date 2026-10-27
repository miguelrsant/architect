import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // AVIF primeiro (menor), WebP como reserva. 85 só nas cenas em tela cheia.
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
  },
};

export default nextConfig;

import type { Metadata, Viewport } from 'next';
import { Geist, Instrument_Serif, JetBrains_Mono, Newsreader } from 'next/font/google';
import { brand, project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import './globals.css';

const display = Instrument_Serif({
  variable: '--ff-display',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});
const serif = Newsreader({
  variable: '--ff-serif',
  subsets: ['latin'],
  style: ['normal', 'italic'],
  axes: ['opsz'],
});
const sans = Geist({ variable: '--ff-sans', subsets: ['latin'] });
const mono = JetBrains_Mono({ variable: '--ff-mono', subsets: ['latin'] });

// Na Vercel, o domínio de produção vira a base das URLs absolutas (imagem de compartilhamento).
const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: copy.meta.title,
  description: copy.meta.description,
  applicationName: project.name,
  authors: [{ name: brand.author, url: brand.url }],
  creator: brand.author,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: project.name,
    title: copy.meta.title,
    description: copy.meta.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: copy.meta.title,
    description: copy.meta.description,
  },
};

export const viewport: Viewport = {
  themeColor: '#07070B',
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}

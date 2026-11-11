import type { Metadata, Viewport } from 'next';
import { Geist, Instrument_Serif, JetBrains_Mono, Newsreader } from 'next/font/google';
import { brand, project } from '@/content/brand';
import { copy } from '@/content/copy.pt-BR';
import { SITE_URL } from '@/content/site';
import { pageMeta } from '@/lib/meta';
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...pageMeta({ path: '/', title: copy.meta.title, description: copy.meta.description }),
  applicationName: project.name,
  authors: [{ name: brand.author, url: brand.url }],
  creator: brand.author,
  publisher: brand.author,
  keywords: ['arqATLAS', 'atlas ilustrado', 'futuro das cidades', 'arquitetura', 'São Paulo', 'Copan', 'MASP', 'Ponte Estaiada', 'Blade Runner', 'Akira'],
  other: { 'is-agentic-site-type': 'content' },
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

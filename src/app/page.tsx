import { Faq } from '@/components/Faq';
import { Finale } from '@/components/Finale';
import { Footer } from '@/components/Footer';
import { Habite } from '@/components/Habite';
import { Hero } from '@/components/Hero';
import { Manifesto } from '@/components/Manifesto';
import { Projete } from '@/components/Projete';
import { SceneMap } from '@/components/SceneMap';
import { Ticker } from '@/components/Ticker';
import { Topbar } from '@/components/Topbar';
import { JsonLd } from '@/components/JsonLd';
import { copy } from '@/content/copy.pt-BR';
import { jsonLd } from '@/lib/jsonld';

// Roteiro "Do sonho à casa": Imagine (a Megacidade, a frase e o que a ficção acertou), Projete (a Torre se
// desenha) e Habite (São Paulo do pôr do sol à noite), depois as perguntas e o convite.
export default function Home() {
  return (
    <>
      <JsonLd data={jsonLd({ path: '/', title: copy.meta.title, description: copy.meta.description, type: 'WebPage' })} />
      <Ticker />
      <Topbar />
      <main>
        <Hero />
        <Manifesto />
        <SceneMap />
        <Projete />
        <Habite />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}

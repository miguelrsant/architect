import { Chapters } from '@/components/Chapters';
import { Faq } from '@/components/Faq';
import { Finale } from '@/components/Finale';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Manifesto } from '@/components/Manifesto';
import { SceneMap } from '@/components/SceneMap';
import { Ticker } from '@/components/Ticker';
import { Topbar } from '@/components/Topbar';

// Ordem do roteiro: ticker, herói, manifesto, três capítulos, mapa da cena, perguntas e fechamento.
export default function Home() {
  return (
    <>
      <Ticker />
      <Topbar />
      <main>
        <Hero />
        <Manifesto />
        <Chapters />
        <SceneMap />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}

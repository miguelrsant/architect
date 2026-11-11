import { Faq } from '@/components/Faq';
import { Finale } from '@/components/Finale';
import { Footer } from '@/components/Footer';
import { Habite } from '@/components/Habite';
import { Hero } from '@/components/Hero';
import { Projete } from '@/components/Projete';
import { Ticker } from '@/components/Ticker';
import { Topbar } from '@/components/Topbar';

// Roteiro "Do sonho à casa": Imagine (a Megacidade), Projete (a Torre se desenha) e Habite (São Paulo).
export default function Home() {
  return (
    <>
      <Ticker />
      <Topbar />
      <main>
        <Hero />
        <Projete />
        <Habite />
        <Faq />
        <Finale />
      </main>
      <Footer />
    </>
  );
}

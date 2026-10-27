import type { StaticImageData } from 'next/image';
import copanNoite from '@/assets/copan-noite.jpg';
import copanPorDoSol from '@/assets/copan-por-do-sol.jpg';
import maspNoite from '@/assets/masp-noite.jpg';
import maspPorDoSol from '@/assets/masp-por-do-sol.jpg';
import ponteNoite from '@/assets/ponte-noite.jpg';
import pontePorDoSol from '@/assets/ponte-por-do-sol.jpg';
import { type Capitulo, copy } from '@/content/copy.pt-BR';
import { Chapter } from './Chapter';
import { Emphasis } from './Emphasis';
import styles from './Chapters.module.css';

// Recortes da mesma cena: pôr do sol para "Hoje", noite para "2080".
const imagens: Record<Capitulo['id'], { porDoSol: StaticImageData; noite: StaticImageData }> = {
  copan: { porDoSol: copanPorDoSol, noite: copanNoite },
  masp: { porDoSol: maspPorDoSol, noite: maspNoite },
  ponte: { porDoSol: pontePorDoSol, noite: ponteNoite },
};

export function Chapters() {
  const t = copy.capitulos;
  return (
    <section id="capitulos" className={styles.chapters} aria-labelledby="capitulos-titulo">
      <div className="wrap">
        <p className="eyebrow">
          <i className="sq" aria-hidden="true" /> {t.eyebrow}
        </p>
        <h2 className="h2" id="capitulos-titulo">
          <Emphasis {...t.titulo} />
        </h2>
        <p className="lead">{t.lead}</p>
        <div className={styles.list}>
          {t.lista.map((capitulo, i) => (
            <Chapter key={capitulo.id} capitulo={capitulo} imagens={imagens[capitulo.id]} reverse={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

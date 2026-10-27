import Image from 'next/image';
import noite from '@/assets/sao-paulo-2080-noite.jpg';
import noiteRetrato from '@/assets/sao-paulo-2080-noite-retrato.jpg';
import { copy } from '@/content/copy.pt-BR';
import { Meta } from './Meta';
import { SignupForm } from './SignupForm';
import { TallSource } from './TallSource';
import styles from './Finale.module.css';

// A seção tem ~82% da altura da tela: a imagem cobre pela altura em telas mais estreitas que 3:2.
const SIZES = '(max-aspect-ratio: 3/2) 147vh, 100vw';
const SIZES_EM_PE = '(max-aspect-ratio: 2/3) 70vh, 100vw';

export function Finale() {
  const t = copy.final;
  return (
    <section id="receber" className={styles.finale} aria-labelledby="receber-titulo">
      <picture className="fill-picture">
        <TallSource src={noiteRetrato} sizes={SIZES_EM_PE} />
        <Image src={noite} alt={t.alt} fill sizes={SIZES} quality={85} placeholder="blur" className={styles.img} />
      </picture>
      <div className={styles.night} aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className={styles.copy}>
        <h2 className={`headline ${styles.title}`} id="receber-titulo">
          {t.titulo}
        </h2>
        <p className={styles.support}>{t.apoio}</p>
        <SignupForm />
        <Meta items={t.meta} className={styles.meta} />
      </div>
    </section>
  );
}

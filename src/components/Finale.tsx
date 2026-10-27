import Image from 'next/image';
import noite from '@/assets/sao-paulo-2080-noite.jpg';
import { copy } from '@/content/copy.pt-BR';
import { Meta } from './Meta';
import { SignupForm } from './SignupForm';
import styles from './Finale.module.css';

export function Finale() {
  const t = copy.final;
  return (
    <section id="receber" className={styles.finale} aria-labelledby="receber-titulo">
      <Image src={noite} alt={t.alt} fill sizes="100vw" quality={85} placeholder="blur" className={styles.img} />
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

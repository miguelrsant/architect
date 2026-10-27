import { copy } from '@/content/copy.pt-BR';
import { Emphasis } from './Emphasis';
import styles from './Faq.module.css';

export function Faq() {
  const t = copy.faq;
  return (
    <section id="perguntas" className={styles.section} aria-labelledby="perguntas-titulo">
      <div className={`wrap ${styles.grid}`}>
        <div>
          <p className="eyebrow">
            <i className="sq" aria-hidden="true" /> {t.eyebrow}
          </p>
          <h2 className="h2" id="perguntas-titulo">
            <Emphasis {...t.titulo} />
          </h2>
        </div>
        <div className={styles.list}>
          {t.itens.map((item, i) => (
            <details key={item.pergunta} className={styles.item} open={i === 0}>
              <summary>
                {item.pergunta}{' '}
                <span className={styles.plus} aria-hidden="true">
                  +
                </span>
              </summary>
              <p>{item.resposta}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

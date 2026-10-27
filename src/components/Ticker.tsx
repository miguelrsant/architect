import { copy } from '@/content/copy.pt-BR';
import styles from './Ticker.module.css';

export function Ticker() {
  // Duas metades iguais: a faixa anda -50% e recomeça sem emenda.
  const half = Array.from({ length: 4 }, () => copy.ticker).flat();
  return (
    <div className={styles.ticker}>
      <p className="sr-only">{copy.ticker.join(', ')}</p>
      <div className={styles.track} aria-hidden="true">
        {[...half, ...half].map((item, i) => (
          <span key={i}>
            {item} <i className="sq" />
          </span>
        ))}
      </div>
    </div>
  );
}

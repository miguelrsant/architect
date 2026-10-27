import { Fragment } from 'react';

/** Linha de metadados em mono, separada por quadrados vermelhos. */
export function Meta({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <p className={className ? `meta ${className}` : 'meta'}>
      {items.map((item, i) => (
        <Fragment key={item}>
          {i > 0 && <i className="sq" aria-hidden="true" />}
          <span>{item}</span>
        </Fragment>
      ))}
    </p>
  );
}

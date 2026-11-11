import type { CSSProperties } from 'react';
import type { Marca } from '@/content/copy.pt-BR';

/** Posição de uma marca nas duas versões da ilustração (larga e em pé), como variáveis CSS. */
export const marca = ({ largo, emPe }: Marca) =>
  ({
    '--xl': `${largo.x}%`,
    '--yl': `${largo.y}%`,
    '--xp': `${emPe?.x ?? 50}%`,
    '--yp': `${emPe?.y ?? 50}%`,
  }) as CSSProperties;

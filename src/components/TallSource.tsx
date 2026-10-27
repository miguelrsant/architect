import { getImageProps, type StaticImageData } from 'next/image';

/** Telas em pé (celular, tablet em pé): a ilustração larga vira um recorte vertical. */
const EM_PE = '(max-aspect-ratio: 1/1)';

/**
 * `<source>` de um `<picture>` com o recorte vertical em alta resolução.
 * Vem antes do `<Image>` largo; o navegador baixa só um dos dois. Qualidade 75: o recorte já tem
 * mais pixels que a tela do celular, e com o grão da arte a diferença para 85 não aparece.
 */
export function TallSource({ src, sizes, quality = 75 }: { src: StaticImageData; sizes: string; quality?: number }) {
  const { props } = getImageProps({ src, sizes, quality, fill: true, alt: '' });
  return <source media={EM_PE} srcSet={props.srcSet} sizes={props.sizes} />;
}

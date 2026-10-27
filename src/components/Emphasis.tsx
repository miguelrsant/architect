import type { Destaque } from '@/content/copy.pt-BR';

/** Escreve o texto com o trecho `destaque` em itálico rosa. */
export function Emphasis({ texto, destaque }: Destaque) {
  const at = texto.indexOf(destaque);
  if (at < 0) return <>{texto}</>;
  return (
    <>
      {texto.slice(0, at)}
      <em className="em">{destaque}</em>
      {texto.slice(at + destaque.length)}
    </>
  );
}

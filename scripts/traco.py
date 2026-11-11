"""Gera as texturas do ato Projete a partir da própria ilustração da Torre-ícone.

O traço é o nanquim da arte (top-hat escuro: fechamento menos imagem). O tempo é a distância
geodésica a partir da base da imagem, andando rápido pelo traço e devagar fora dele, então o
desenho cresce pelas linhas, de baixo para cima. A cor sobe depois, por uma versão suave do tempo.
O próprio traço o navegador tira da ilustração no sombreador (src/lib/traco-gl.ts): aqui saem só
os dois campos de tempo, que pesam poucos KB.

uso: python3 scripts/traco.py ilustracao.jpg saida/prefixo [k=5] [--desenho]
Gera prefixo-tempo.webp (quando cada linha aparece) e prefixo-sobe.webp (quando a cor chega);
com --desenho, também prefixo-desenho.webp, o desenho técnico parado para o movimento reduzido.
Precisa só de numpy e Pillow.
"""
import sys

import numpy as np
from PIL import Image, ImageFilter

INF = np.float32(1e9)
CUSTO_FORA = 7.0  # andar fora do traço custa 7x: o desenho segue as linhas e só pula vãos curtos


def tracos(img: Image.Image, k: int) -> np.ndarray:
    """Linhas escuras e finas da arte, de 0 a 1."""
    rgb = np.asarray(img.convert('RGB'), dtype=np.float32) / 255
    lum = 0.2126 * rgb[..., 0] + 0.7152 * rgb[..., 1] + 0.0722 * rgb[..., 2]
    li = Image.fromarray((lum * 255).astype(np.uint8))
    fechado = li.filter(ImageFilter.MaxFilter(k)).filter(ImageFilter.MinFilter(k))
    th = np.asarray(fechado, dtype=np.float32) - np.asarray(li, dtype=np.float32)
    return np.clip((th * 2.2 - 18) * 2.0, 0, 255) / 255


def _varredura(t: np.ndarray, c: np.ndarray, de_cima: bool) -> None:
    """Uma passada vertical; na horizontal, a propagação sai de um mínimo acumulado (sem laço por pixel)."""
    h, _ = t.shape
    s2 = np.float32(np.sqrt(2))
    for y in (range(1, h) if de_cima else range(h - 2, -1, -1)):
        prev = t[y - 1] if de_cima else t[y + 1]
        cy = c[y]
        lados = np.minimum(np.concatenate(([INF], prev[:-1])), np.concatenate((prev[1:], [INF])))
        linha = np.minimum(t[y], np.minimum(prev + cy, lados + s2 * cy))
        acc = np.cumsum(cy, dtype=np.float64)
        linha = np.minimum(linha, (np.minimum.accumulate(linha - acc) + acc).astype(np.float32))
        inv, cinv = linha[::-1], cy[::-1]
        acc = np.cumsum(cinv, dtype=np.float64)
        inv = np.minimum(inv, (np.minimum.accumulate(inv - acc) + acc).astype(np.float32))
        t[y] = inv[::-1]


def tempo(mascara: np.ndarray, rodadas: int = 3) -> np.ndarray:
    """Distância geodésica a partir da última linha, igualada pela quantidade de traço (ritmo constante)."""
    custo = np.where(mascara > 0.3, 1.0, CUSTO_FORA).astype(np.float32)
    t = np.full(mascara.shape, INF, dtype=np.float32)
    t[-2:, :] = 0
    for _ in range(rodadas):
        _varredura(t, custo, de_cima=False)
        _varredura(t, custo, de_cima=True)
    no_traco = mascara > 0.3
    q = np.quantile(t[no_traco], np.linspace(0, 1, 257))
    return np.interp(t, q, np.linspace(0, 1, 257)).astype(np.float32)


def igualar(x: np.ndarray) -> np.ndarray:
    """Igualado pela área: a cor sobe num ritmo constante."""
    q = np.quantile(x, np.linspace(0, 1, 257))
    return np.interp(x, q, np.linspace(0, 1, 257)).astype(np.float32)


def suave(x: np.ndarray, fator: int) -> np.ndarray:
    h, w = x.shape
    im = Image.fromarray(x, mode='F').resize((max(1, w // fator), max(1, h // fator)), Image.BOX)
    return np.asarray(im.resize((w, h), Image.BICUBIC), dtype=np.float32)


def salvar(x: np.ndarray, tamanho, caminho: str, q: int) -> None:
    im = Image.fromarray(np.clip(x * 255 + 0.5, 0, 255).astype(np.uint8))
    if im.size != tamanho:
        im = im.resize(tamanho, Image.LANCZOS)
    im.save(caminho, quality=q, method=6)


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    src, prefixo = args[0], args[1]
    k = int(args[2]) if len(args) > 2 else 5
    arte = Image.open(src).convert('RGB')
    W, H = arte.size
    linhas = tracos(arte, k)
    # o campo de tempo é suave: calcula em 1/2 (ou 1/4 nas imagens ampliadas)
    red = 2 if W <= 2600 and H <= 2600 else 4
    pequeno = (W // red, H // red)
    m = np.asarray(Image.fromarray((linhas * 255).astype(np.uint8)).resize(pequeno, Image.BOX), dtype=np.float32) / 255
    m = np.clip(m * 1.6, 0, 1)
    t = tempo(m)
    sobe = igualar(suave(t, 24))
    salvar(t, pequeno, f'{prefixo}-tempo.webp', 92)
    salvar(sobe, (pequeno[0] // 4, pequeno[1] // 4), f'{prefixo}-sobe.webp', 92)
    if '--desenho' in sys.argv:
        # linhas claras sobre o azul-noite da página, no tamanho do recorte original (1072 de largura)
        noite = np.array([7, 7, 11], np.float32) / 255
        tinta = np.array([0.80, 0.87, 1.0], np.float32)
        rgb = noite + (tinta - noite) * linhas[..., None]
        im = Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8))
        alvo = (1072, round(1072 * H / W))
        im.resize(alvo, Image.LANCZOS).save(f'{prefixo}-desenho.webp', quality=82, method=6)
    print(prefixo, (W, H), pequeno)

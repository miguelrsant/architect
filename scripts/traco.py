"""Gera as texturas do ato Projete a partir da própria ilustração da Torre-ícone.

O traço é o nanquim da arte (top-hat escuro: fechamento menos imagem). O tempo é a distância
geodésica a partir da base da imagem, andando rápido pelo traço e devagar fora dele, então o
desenho cresce pelas linhas, de baixo para cima. A cor sobe depois, por uma versão suave do tempo
que só cresce de baixo para cima em cada coluna (nenhum pedaço de céu fica para trás, como ilha) e
sem colunas atrasadas (nenhum fio de céu escuro fica pendurado no topo).
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


def sem_ilhas(x: np.ndarray) -> np.ndarray:
    """Em cada coluna, o valor só cresce de baixo para cima: o que ainda não tem cor sempre encosta no topo."""
    return np.maximum.accumulate(x[::-1], axis=0)[::-1]


def aparar_fios(x: np.ndarray, largura: int) -> np.ndarray:
    """Abertura na horizontal (mínimo e depois máximo numa janela): uma coluna que demora mais que as
    vizinhas, e é mais estreita que a janela, passa a ter o tempo delas. Mínimo e máximo de colunas que
    só crescem para cima também só crescem para cima: continua sem ilhas."""
    r = max(1, largura // 2)

    def janela(v: np.ndarray, f) -> np.ndarray:
        p = np.pad(v, ((0, 0), (r, r)), mode='edge')
        return f(np.lib.stride_tricks.sliding_window_view(p, 2 * r + 1, axis=1), axis=-1)

    return janela(janela(x, np.min), np.max)


def rampa(altura: int) -> np.ndarray:
    """De 0 na base a 1 no topo: somada ao tempo, desfaz os platôs (o trecho de coluna que ganharia cor de uma vez)."""
    return np.linspace(1, 0, altura, dtype=np.float32)[:, None]


def borrar(x: np.ndarray, raios: tuple[int, int], vezes: int = 3) -> np.ndarray:
    """Média móvel separável (três passadas ~ gaussiana), raio na vertical e na horizontal.
    Pesos positivos: não cria ilhas novas."""
    for _ in range(vezes):
        for eixo, raio in enumerate(raios):
            pad = [(0, 0), (0, 0)]
            pad[eixo] = (raio, raio)
            c = np.cumsum(np.pad(x, pad, mode='edge'), axis=eixo, dtype=np.float64)
            c = np.insert(c, 0, 0, axis=eixo)
            n = x.shape[eixo]
            fim = np.take(c, np.arange(2 * raio + 1, 2 * raio + 1 + n), axis=eixo)
            ini = np.take(c, np.arange(0, n), axis=eixo)
            x = ((fim - ini) / (2 * raio + 1)).astype(np.float32)
    return x


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
    # a cor só sobe; as colunas atrasadas, mais estreitas que 1/6 da largura, ganham o tempo das vizinhas
    sobe = sem_ilhas(suave(t, 24))
    sobe = aparar_fios(sobe, pequeno[0] // 6) + 0.15 * rampa(sobe.shape[0])
    sobe = igualar(borrar(sobe, (3, max(4, pequeno[0] // 40))))
    salvar(t, pequeno, f'{prefixo}-tempo.webp', 92)
    # sem perda: a compressão com perda criaria pontinhos fora de ordem, que virariam ilhas de céu
    reduzido = (pequeno[0] // 4, pequeno[1] // 4)
    Image.fromarray(np.clip(sobe * 255 + 0.5, 0, 255).astype(np.uint8)).resize(reduzido, Image.BOX).save(
        f'{prefixo}-sobe.webp', lossless=True, method=6)
    if '--desenho' in sys.argv:
        # linhas claras sobre o azul-noite da página, no tamanho do recorte original (1072 de largura)
        noite = np.array([7, 7, 11], np.float32) / 255
        tinta = np.array([0.80, 0.87, 1.0], np.float32)
        rgb = noite + (tinta - noite) * linhas[..., None]
        im = Image.fromarray((np.clip(rgb, 0, 1) * 255).astype(np.uint8))
        alvo = (1072, round(1072 * H / W))
        im.resize(alvo, Image.LANCZOS).save(f'{prefixo}-desenho.webp', quality=82, method=6)
    print(prefixo, (W, H), pequeno)

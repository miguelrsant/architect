// Todos os textos do site. O conteúdo segue o roteiro "São Paulo 2080: roteiro da landing".

export type Selo = 'existe' | '2080';

/** Texto com um trecho em itálico rosa (o `destaque` precisa aparecer dentro do `texto`). */
export interface Destaque {
  texto: string;
  destaque: string;
}

export interface Fonte {
  nome: string;
  url: string;
}

export interface ItemFicha {
  rotulo: string;
  valor: string;
  unidade?: string;
}

export interface Capitulo {
  id: 'copan' | 'masp' | 'ponte';
  numero: string;
  verbo: string;
  predio: string;
  assinatura: string;
  titulo: Destaque;
  hoje: string;
  futuro: string;
  ficha: ItemFicha[];
  fontes: Fonte[];
  /** Texto alternativo dos dois recortes da ilustração. */
  imagem: { porDoSol: string; noite: string };
}

export interface Ponto {
  n: number;
  nome: string;
  selo: Selo;
  texto: string;
  /** Posição na ilustração, em % da largura e da altura. */
  x: number;
  y: number;
  capitulo?: Capitulo['id'];
}

const capitulos: Capitulo[] = [
  {
    id: 'copan',
    numero: '01',
    verbo: 'morar',
    predio: 'Edifício Copan',
    assinatura: 'Oscar Niemeyer · Centro de São Paulo',
    titulo: { texto: 'Uma cidade inteira numa onda.', destaque: 'onda' },
    hoje: 'Oscar Niemeyer desenhou o Copan em 1951, e os primeiros moradores chegaram em 1963. São 1.160 apartamentos, 140 metros de altura e 72 lojas no térreo, abertas para a rua. As faixas horizontais de concreto fazem sombra e desenham a curva.',
    futuro:
      'As faixas de concreto ganham painéis solares e floreiras. O térreo vira uma praça coberta, aberta dia e noite, e o topo ganha uma horta com mirante público.',
    ficha: [
      { rotulo: 'Altura', valor: '140', unidade: 'm' },
      { rotulo: 'Andares', valor: '37' },
      { rotulo: 'Apartamentos', valor: '1.160' },
      { rotulo: 'Área construída', valor: '116.152', unidade: 'm²' },
    ],
    fontes: [{ nome: 'Assembleia Legislativa de SP', url: 'https://www.al.sp.gov.br/noticia/?id=313140' }],
    imagem: {
      porDoSol:
        'Recorte da ilustração: o Copan ao pôr do sol, uma lâmina curva com faixas horizontais de concreto entre nuvens douradas.',
      noite: 'O mesmo recorte à noite: o Copan com as faixas de janelas acesas.',
    },
  },
  {
    id: 'masp',
    numero: '02',
    verbo: 'encontrar',
    predio: 'MASP',
    assinatura: 'Lina Bo Bardi · Avenida Paulista',
    titulo: { texto: 'Um museu que deu a praça para a cidade.', destaque: 'praça' },
    hoje: 'Lina Bo Bardi pendurou a caixa do museu em vigas de concreto protendido sobre quatro pilares, deixando um vão livre de 74 metros. O prédio abriu em 7 de novembro de 1968, e o vão virou praça coberta para encontros, cultura e manifestações. Lá dentro, as obras ficam soltas em cavaletes de cristal.',
    futuro:
      'O vão livre vira a sala de estar da cidade, com sombra, água e bancos. À noite, a fachada de vidro acende e mostra as obras para quem passa na Paulista.',
    ficha: [
      { rotulo: 'Vão livre', valor: '74', unidade: 'm' },
      { rotulo: 'Pilares', valor: '4' },
      { rotulo: 'Acervo', valor: '+11 mil', unidade: 'obras' },
      { rotulo: 'Prédios', valor: '2', unidade: 'desde 2025' },
    ],
    fontes: [
      {
        nome: 'Correio Braziliense',
        url: 'https://www.correiobraziliense.com.br/cbradar/como-foi-construido-o-vao-livre-do-masp/',
      },
      {
        nome: 'Portal Tela',
        url: 'https://www.portaltela.com/noticias/geral/2026/06/01/estrutura-de-1968-sustentada-por-quatro-pilares-vermelhos-tem-vao-de-74-m/',
      },
      {
        nome: 'Times Brasil',
        url: 'https://timesbrasil.com.br/entretenimento/novo-masp-abre-no-proximo-dia-28-de-marco-e-passa-a-ter-dois-predios/',
      },
    ],
    imagem: {
      porDoSol:
        'Recorte da ilustração: o MASP ao pôr do sol, com a caixa de vidro presa aos pórticos vermelhos e gente no vão livre.',
      noite: 'O mesmo recorte à noite: o MASP com a caixa de vidro acesa por dentro e o vão iluminado.',
    },
  },
  {
    id: 'ponte',
    numero: '03',
    verbo: 'atravessar',
    predio: 'Ponte Estaiada',
    assinatura: 'Ponte Octávio Frias de Oliveira · Rio Pinheiros',
    titulo: { texto: 'Duas curvas penduradas num X.', destaque: 'X' },
    hoje: 'A Ponte Octávio Frias de Oliveira abriu em 10 de maio de 2008 sobre o rio Pinheiros. O mastro em X tem 138 metros e segura duas pistas curvas com 144 estais. É a única ponte do mundo com duas pistas curvas presas a um só mastro.',
    futuro:
      'Um monotrilho passa entre as pistas e liga as margens sem trânsito. O rio Pinheiros aparece limpo, com margens verdes, e à noite os estais viram linhas de luz.',
    ficha: [
      { rotulo: 'Mastro', valor: '138', unidade: 'm' },
      { rotulo: 'Estais', valor: '144' },
      { rotulo: 'Pistas curvas', valor: '2' },
      { rotulo: 'Pistas', valor: '1.600', unidade: 'm' },
    ],
    fontes: [
      { nome: 'Wikipedia, em inglês', url: 'https://en.wikipedia.org/wiki/Oct%C3%A1vio_Frias_de_Oliveira_Bridge' },
    ],
    imagem: {
      porDoSol:
        'Recorte da ilustração: a Ponte Estaiada com o sol se pondo atrás do mastro em X e um monotrilho passando.',
      noite: 'O mesmo recorte à noite: a lua cheia atrás do mastro em X e os estais acesos.',
    },
  },
];

const pontos: Ponto[] = [
  {
    n: 1,
    nome: 'Copan',
    selo: 'existe',
    texto: 'A onda de 1.160 apartamentos de Niemeyer.',
    x: 18.8,
    y: 42.5,
    capitulo: 'copan',
  },
  {
    n: 2,
    nome: 'MASP',
    selo: 'existe',
    texto: 'O museu suspenso de Lina Bo Bardi.',
    x: 37.5,
    y: 62.7,
    capitulo: 'masp',
  },
  {
    n: 3,
    nome: 'Ponte Estaiada',
    selo: 'existe',
    texto: 'O X de 138 metros sobre o rio Pinheiros.',
    x: 63.8,
    y: 44.8,
    capitulo: 'ponte',
  },
  {
    n: 4,
    nome: 'Lanternas vermelhas',
    selo: 'existe',
    texto: 'Um aceno à Liberdade, bairro da imigração japonesa.',
    x: 76.4,
    y: 83.6,
  },
  {
    n: 5,
    nome: 'Ipês rosa',
    selo: 'existe',
    texto: 'As árvores que pintam São Paulo de rosa no inverno.',
    x: 6.9,
    y: 68.3,
  },
  {
    n: 6,
    nome: 'Monotrilho na ponte',
    selo: '2080',
    texto: 'A linha imaginada que atravessa o rio sem trânsito.',
    x: 60.6,
    y: 60.5,
  },
  {
    n: 7,
    nome: 'Torre-cápsula',
    selo: '2080',
    texto: 'Apartamentos em módulos que se trocam como peças.',
    x: 83.8,
    y: 56,
  },
  { n: 8, nome: 'Jardins suspensos', selo: '2080', texto: 'Praças e hortas no alto dos prédios.', x: 91, y: 31 },
];

export const copy = {
  meta: {
    title: 'arqATLAS · São Paulo 2080, um atlas ilustrado',
    description:
      'Três prédios reais de São Paulo explicados hoje e imaginados em 2080: Copan, MASP e Ponte Estaiada. Um atlas ilustrado, um capítulo por vez.',
  },
  nav: {
    voltar: 'arqATLAS, voltar ao topo',
    rotulo: 'Seções',
    links: [
      { label: 'Capítulos', href: '#capitulos' },
      { label: 'Mapa', href: '#mapa' },
      { label: 'Perguntas', href: '#perguntas' },
    ],
    cta: { label: 'Receber o atlas', href: '#receber' },
  },
  ticker: ['3 prédios reais', '1 cidade em 2080', 'Copan', 'MASP', 'Ponte Estaiada', 'Um capítulo por vez'],
  hero: {
    titulo: ['Imagine.', 'Projete.', 'Habite.'],
    meta: ['São Paulo 2080', 'Um atlas ilustrado', '3 prédios reais'],
    alt: 'Ilustração em estilo anime dos anos 90: São Paulo em 2080 ao pôr do sol, com o Copan à esquerda, o MASP suspenso nos pórticos vermelhos, a Ponte Estaiada com um monotrilho e o sol se pondo atrás do mastro em X, ipês rosa e gente na praça.',
  },
  manifesto: {
    rotulo: 'Manifesto',
    meta: ['Por que olhar', 'De 1951 a 2080'],
    texto:
      'Em 1951, Oscar Niemeyer desenhou uma onda de concreto com 1.160 apartamentos no centro de São Paulo. Em 1968, Lina Bo Bardi suspendeu um museu sobre um vão de 74 metros para deixar uma praça livre na Paulista. A cidade de 2080 começou a ser construída ali. Este atlas explica como esses prédios funcionam hoje e imagina o que eles podem virar.',
    fecho: {
      texto: 'O futuro de São Paulo já está construído. Só falta aprender a olhar para ele.',
      destaque: 'Só falta aprender a olhar para ele.',
    },
  },
  capitulos: {
    eyebrow: 'Os capítulos',
    titulo: { texto: 'Três prédios, três verbos.', destaque: 'três verbos' },
    lead: 'Cada capítulo explica um prédio que existe hoje e imagina o que ele pode virar em 2080. O botão troca o texto entre o real e o imaginado.',
    capitulo: 'Capítulo',
    toggle: { rotulo: 'Ver o prédio', hoje: 'Hoje', futuro: '2080' },
    selo: { existe: 'Existe hoje', futuro: '2080 · imaginado' },
    ficha: 'Ficha técnica',
    fonte: 'Fonte',
    fontes: 'Fontes',
    lista: capitulos,
  },
  mapa: {
    eyebrow: 'Mapa da cena',
    titulo: { texto: 'O real e o imaginado, num só lugar.', destaque: 'imaginado' },
    lead: 'A ilustração mistura o que já existe em São Paulo com ideias para 2080. Toque nos números para saber qual é qual.',
    legenda: { existe: 'Existe', futuro: '2080' },
    alt: 'A ilustração de São Paulo 2080 ao pôr do sol, com oito pontos numerados por cima.',
    irPara: 'Ler o capítulo',
    fechar: 'Fechar',
    pontos,
  },
  faq: {
    eyebrow: 'Perguntas',
    titulo: { texto: 'Perguntas frequentes.', destaque: 'frequentes' },
    itens: [
      {
        pergunta: 'Os prédios são de verdade?',
        resposta:
          'Sim. Copan, MASP e Ponte Estaiada existem, e os números vêm de fontes públicas. O que muda em 2080 é imaginação e aparece com o selo “2080”.',
      },
      {
        pergunta: 'As imagens são fotos?',
        resposta:
          'Não. São ilustrações feitas com IA a partir dos prédios reais, no estilo dos cenários de anime dos anos 90.',
      },
      {
        pergunta: 'O que chega no meu e-mail?',
        resposta: 'Um capítulo novo por vez, com um prédio explicado e imaginado.',
      },
      { pergunta: 'Quanto custa?', resposta: 'Nada. O atlas é gratuito.' },
    ],
  },
  final: {
    titulo: 'O futuro tem endereço.',
    apoio: 'Um prédio de São Paulo por capítulo, explicado e imaginado.',
    meta: ['Gratuito', 'Um capítulo por vez'],
    alt: 'São Paulo 2080 à noite, com lua cheia, janelas e letreiros acesos.',
    form: {
      rotulo: 'Seu e-mail',
      placeholder: 'seu@email.com',
      botao: 'Receber o atlas',
      enviando: 'Enviando',
      ok: 'Pronto! O próximo capítulo chega no seu e-mail.',
      demo: 'Obrigado! Este site ainda é uma demonstração, então o seu e-mail não foi guardado.',
      invalido: 'Esse e-mail parece incompleto. Confira e tente de novo.',
      erro: 'Não deu certo agora. Tente de novo em instantes.',
    },
  },
  rodape: {
    sobre: 'Um atlas ilustrado de São Paulo, de hoje a 2080.',
    imagensTitulo: 'Sobre as imagens',
    imagens:
      'As ilustrações foram feitas com IA a partir dos prédios reais, no estilo dos cenários de anime dos anos 90. Não são fotos. Tudo o que aparece com o selo “2080” é imaginação.',
    fontesTitulo: 'Fontes',
    feitoPor: 'Feito por',
    redes: 'Miguel Angelo na web',
    codigo: 'Código do site',
  },
};

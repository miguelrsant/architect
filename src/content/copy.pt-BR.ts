// Todos os textos do site. O conteúdo segue o documento "arqATLAS · novo conceito e roteiro" (conceito A, Do sonho à casa).

/** Selo dos pontos da Megacidade: o que da ficção já chegou e o que ainda é sonho. */
export type Selo = 'existe' | 'ficcao';

/** Texto com um trecho em itálico rosa (o `destaque` precisa aparecer dentro do `texto`). */
export interface Destaque {
  texto: string;
  destaque: string;
}

export interface Fonte {
  nome: string;
  url: string;
}

/** Os três prédios reais de São Paulo do ato Habite. */
export type Predio = 'copan' | 'masp' | 'ponte';

/** Ponto do mapa da Megacidade (o que a ficção acertou). */
export interface Ponto {
  n: number;
  nome: string;
  selo: Selo;
  texto: string;
  fonte?: Fonte;
  /** Posição na ilustração, em % da largura e da altura. */
  x: number;
  y: number;
}

/** Um ponto numa ilustração, em % da largura e da altura: na imagem larga e no recorte em pé. */
export interface Marca {
  largo: { x: number; y: number };
  /** Sem `emPe`, o ponto fica fora do recorte em pé e só aparece no cartão. */
  emPe?: { x: number; y: number };
}

/** Nota do ato Projete: uma parte da Torre-ícone e o prédio real que já faz aquilo. */
export interface Nota {
  n: string;
  titulo: string;
  /** O prédio real que já faz aquilo. */
  referencia: string;
  rotulo: string;
  texto: string;
  fonte: Fonte;
  marca: Marca;
}

/** Cartão do ato Habite: um prédio de São Paulo e o número que ele carrega. */
export interface Morada {
  id: Predio;
  predio: string;
  assinatura: string;
  numero: string;
  unidade: string;
  texto: string;
  fonte: Fonte;
  marca: Marca;
}

// O que a ficção acertou: seis pontos na Megacidade, do que já chegou ao que ainda é sonho.
const pontos: Ponto[] = [
  {
    n: 1,
    nome: 'Monotrilho',
    selo: 'existe',
    texto:
      'São Paulo tem um desde 30 de agosto de 2014: a Linha 15-Prata, o primeiro monotrilho de transporte de massa da América do Sul.',
    fonte: { nome: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Line_15_(S%C3%A3o_Paulo_Metro)' },
    x: 40.5,
    y: 79,
  },
  {
    n: 2,
    nome: 'Telões nas fachadas',
    selo: 'existe',
    texto: 'Prédio que vira tela já é paisagem de centro de cidade.',
    x: 7.6,
    y: 53,
  },
  {
    n: 3,
    nome: 'Jardins nos telhados',
    selo: 'existe',
    texto: 'Já existem, e cada vez mais: o telhado verde segura a água da chuva e deixa o prédio mais fresco.',
    x: 90.5,
    y: 46,
  },
  {
    n: 4,
    nome: 'Carros voadores',
    selo: 'ficcao',
    texto: 'O carro voador do cinema ainda não chegou à garagem de ninguém.',
    x: 54,
    y: 69.5,
  },
  {
    n: 5,
    nome: 'O monólito sem janelas',
    selo: 'ficcao',
    texto: 'Um prédio sem janela, sem porta e sem térreo aberto: um prédio que não conversa com a rua.',
    x: 78.5,
    y: 35,
  },
  {
    n: 6,
    nome: 'O letreiro Neo-Tóquio',
    selo: 'ficcao',
    texto: 'Uma homenagem à cidade de Akira, que o filme imaginou para 2019.',
    x: 27.9,
    y: 75.6,
  },
];

export const copy = {
  meta: {
    title: 'arqATLAS · Atlas ilustrado do futuro das cidades',
    description:
      'Um atlas ilustrado do futuro das cidades: a megacidade que o cinema imaginou, uma torre feita de soluções que já existem e os prédios de São Paulo onde o futuro já mora.',
    nomeApp: 'Da ficção a São Paulo',
    ogAlt: 'A megacidade ilustrada de céu azul, com torre de TV, monotrilho e um monólito roxo, e o título Imagine. Projete. Habite.',
  },
  nav: {
    voltar: 'arqATLAS, voltar ao topo',
    voltarInicio: 'Ver o atlas',
    rotulo: 'Seções',
    links: [
      { label: 'Imagine', href: '#top' },
      { label: 'Projete', href: '#projete' },
      { label: 'Habite', href: '#habite' },
    ],
    cta: { label: 'Receber o atlas', href: '#receber' },
  },
  ticker: ['Imagine', 'Projete', 'Habite', 'Da ficção a São Paulo', 'Um atlas ilustrado', 'Um capítulo por vez'],
  imagine: {
    numero: '01',
    eyebrow: 'Imagine',
    titulo: [
      { n: '01', verbo: 'Imagine.' },
      { n: '02', verbo: 'Projete.' },
      { n: '03', verbo: 'Habite.' },
    ],
    apoio: 'Como uma cidade sai da imaginação e vira lugar para morar.',
    meta: ['Da ficção a São Paulo', 'Um atlas ilustrado', 'Um capítulo por vez'],
    alt: 'Ilustração em estilo anime dos anos 90: uma megacidade futurista de céu azul, com torre de TV, um letreiro em japonês que diz Neo-Tóquio, um monotrilho fazendo a curva entre os prédios, carros voando, um monólito roxo sem janelas e um sol vermelho.',
  },
  projete: {
    numero: '02',
    eyebrow: 'Projete',
    titulo: { texto: 'Uma ideia vira projeto quando resolve um problema.', destaque: 'projeto' },
    lead: 'A Torre-ícone é imaginada, mas cada parte dela já existe em algum lugar do mundo.',
    alt: 'Ilustração da Torre-ícone: uma torre torcida com estrutura em diagonal, uma floresta e uma cachoeira no miolo, terraços com jardim e um anel no topo, no meio de uma cidade com monotrilho.',
    altDesenho: 'A mesma torre como desenho técnico: só as linhas, claras sobre fundo escuro.',
    notas: [
      {
        n: '01',
        titulo: 'Estrutura em diagonal',
        referencia: 'Hearst Tower',
        rotulo: 'Malha diagonal',
        texto: 'Na Hearst Tower, em Nova York (2006), a malha em diagonal usa cerca de 20% menos aço que uma estrutura comum.',
        fonte: { nome: 'Thornton Tomasetti', url: 'https://thorntontomasetti.com/project/hearst-tower' },
        marca: { largo: { x: 58.8, y: 72 }, emPe: { x: 40, y: 72 } },
      },
      {
        n: '02',
        titulo: 'A torção',
        referencia: 'Shanghai Tower',
        rotulo: 'Torção',
        texto: 'A Shanghai Tower (632 m, 2015) gira 120 graus enquanto sobe, e isso reduz em 24% a força do vento sobre ela.',
        fonte: { nome: 'Architectural Record', url: 'https://www.architecturalrecord.com/articles/10084-shanghai-tower' },
        marca: { largo: { x: 67.6, y: 23 }, emPe: { x: 61, y: 23 } },
      },
      {
        n: '03',
        titulo: 'Cachoeira',
        referencia: 'Jewel Changi',
        rotulo: 'Cachoeira',
        texto: 'Em Singapura, a HSBC Rain Vortex cai 40 metros dentro do Jewel Changi. É a cachoeira interna mais alta do mundo.',
        fonte: { nome: 'HSBC', url: 'https://www.about.hsbc.com.sg/news-and-media/the-hsbc-rain-vortex-is-ready-to-dazzle-visitors-at-jewel' },
        marca: { largo: { x: 62.2, y: 58 }, emPe: { x: 48, y: 58 } },
      },
      {
        n: '04',
        titulo: 'Floresta no miolo',
        referencia: 'Bosco Verticale',
        rotulo: 'Floresta',
        texto: 'Mais de 700 árvores já moram nas fachadas de duas torres de Milão, o Bosco Verticale, concluído em 2014.',
        fonte: { nome: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Bosco_Verticale' },
        marca: { largo: { x: 63.4, y: 44 }, emPe: { x: 51, y: 44 } },
      },
    ] satisfies Nota[],
  },
  habite: {
    numero: '03',
    eyebrow: 'Habite',
    titulo: { texto: 'Uma cidade só fica pronta quando alguém mora nela.', destaque: 'pronta' },
    lead: 'Os prédios mais futuristas de São Paulo foram desenhados há décadas. O que fez deles futuro foi a cidade que passou a viver neles.',
    alt: 'São Paulo ilustrada ao pôr do sol, com o Copan, o MASP e a Ponte Estaiada, que escurece até a noite com as janelas acesas.',
    altNoite: 'A mesma São Paulo à noite, com lua cheia e as janelas acesas.',
    fecho: 'As janelas acendem. Alguém chegou em casa.',
    moradas: [
      {
        id: 'copan',
        predio: 'Copan',
        assinatura: 'Oscar Niemeyer · 1951',
        numero: '1.160',
        unidade: 'apartamentos',
        texto: 'Uma onda de concreto no centro, desenhada em 1951, com lojas abertas para a rua no térreo.',
        fonte: { nome: 'Assembleia Legislativa de SP', url: 'https://www.al.sp.gov.br/noticia/?id=313140' },
        marca: { largo: { x: 18.8, y: 42.5 } },
      },
      {
        id: 'masp',
        predio: 'MASP',
        assinatura: 'Lina Bo Bardi · 1968',
        numero: '74',
        unidade: 'metros de vão livre',
        texto: 'O museu fica suspenso sobre quatro pilares, e a praça embaixo dele é da cidade.',
        fonte: {
          nome: 'Correio Braziliense',
          url: 'https://www.correiobraziliense.com.br/cbradar/como-foi-construido-o-vao-livre-do-masp/',
        },
        marca: { largo: { x: 39.6, y: 61 }, emPe: { x: 10.5, y: 61 } },
      },
      {
        id: 'ponte',
        predio: 'Ponte Estaiada',
        assinatura: 'Rio Pinheiros · 2008',
        numero: '138',
        unidade: 'metros de mastro em X',
        texto: 'Duas pistas curvas penduradas num mastro só, sobre o rio Pinheiros.',
        fonte: { nome: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Oct%C3%A1vio_Frias_de_Oliveira_Bridge' },
        marca: { largo: { x: 63.8, y: 44.8 }, emPe: { x: 67.1, y: 44.8 } },
      },
    ] satisfies Morada[],
  },
  manifesto: {
    rotulo: 'A frase',
    meta: ['Do sonho à casa'],
    texto: {
      texto:
        'Toda cidade começa como uma imagem na cabeça de alguém. Depois vira desenho, conta e estrutura. E só fica pronta quando alguém mora nela.',
      destaque: 'só fica pronta quando alguém mora nela.',
    },
  },
  mapa: {
    eyebrow: 'O que a ficção acertou',
    titulo: { texto: 'O futuro que o cinema prometeu para 2019.', destaque: '2019' },
    lead: 'Blade Runner (1982) se passava em Los Angeles, em novembro de 2019. Akira (1988), numa Neo-Tóquio do mesmo ano. O ano chegou e passou: parte daquela cidade já existe, parte ainda é sonho.',
    legenda: { existe: 'Já existe', ficcao: 'Ainda é ficção' },
    alt: 'A megacidade ilustrada com seis pontos numerados por cima: o monotrilho, um telão, um jardim no telhado, os carros voadores, o monólito roxo e o letreiro Neo-Tóquio.',
    fonte: 'Fonte',
    fechar: 'Fechar',
    fontes: [
      {
        nome: 'LAist',
        url: 'https://laist.com/news/entertainment/blade-runner-november-2019-los-angeles-future-is-here',
        sobre: 'Blade Runner',
      },
      { nome: 'CBR', url: 'https://www.cbr.com/akira-blade-runner-running-man-right-about-2019/', sobre: 'Akira' },
    ],
    pontos,
  },
  faq: {
    eyebrow: 'Perguntas',
    titulo: { texto: 'Perguntas frequentes.', destaque: 'frequentes' },
    itens: [
      {
        pergunta: 'As imagens são fotos?',
        resposta:
          'Não. São ilustrações feitas com IA, no estilo dos cenários de anime dos anos 90. Nenhum quadro de filme entra no site.',
      },
      {
        pergunta: 'Os números são de verdade?',
        resposta: 'Sim. Cada número tem a fonte ao lado, e a lista completa fica no rodapé.',
      },
      {
        pergunta: 'O que é ficção?',
        resposta:
          'A Megacidade e a Torre-ícone são imaginadas, mas cada parte da Torre já existe em algum prédio real. Em São Paulo, o Copan, o MASP e a Ponte Estaiada são de verdade; os toques de futuro em volta deles são imaginação.',
      },
      {
        pergunta: 'O que chega no meu e-mail?',
        resposta: 'Um capítulo novo por vez, com uma ideia de futuro e o prédio real que já faz aquilo.',
      },
      { pergunta: 'Quanto custa?', resposta: 'Nada. O atlas é gratuito.' },
    ],
  },
  final: {
    titulo: ['Toda cidade começa', 'como uma imagem.'],
    apoio: 'Um capítulo por vez: uma ideia de futuro, o prédio que já faz aquilo e a cidade que mora nele.',
    meta: ['Gratuito', 'Um capítulo por vez'],
    alt: 'São Paulo ilustrada à noite, com lua cheia, janelas e letreiros acesos.',
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
    sobre: 'Um atlas ilustrado, da ficção a São Paulo.',
    imagensTitulo: 'Sobre as imagens',
    imagens:
      'As ilustrações foram feitas com IA, no estilo dos cenários de anime dos anos 90. Não são fotos. A Megacidade e a Torre-ícone são imaginadas; o Copan, o MASP e a Ponte Estaiada são de verdade.',
    fontesTitulo: 'Fontes',
    feitoPor: 'Feito por',
    redes: 'Miguel Angelo na web',
    codigo: 'Código do site',
    paginas: 'Páginas do site',
    desenvolvidoPor: 'Site desenvolvido por',
  },
};

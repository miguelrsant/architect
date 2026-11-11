// Dados do site num lugar só: metadados, JSON-LD, sitemap, llms.txt, Markdown para agentes e as páginas internas.
import { brand, project } from './brand';
import { copy } from './copy.pt-BR';

/** Endereço oficial. Na Vercel vem do domínio de produção do projeto. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'https://arqatlas-theta.vercel.app')
).replace(/\/$/, '');

export const abs = (path: string) => SITE_URL + (path === '/' ? '/' : path);

export const site = {
  name: project.name,
  title: 'arqATLAS · Atlas ilustrado do futuro das cidades',
  description: copy.meta.description,
  ogImage: '/opengraph-image.jpg',
  /** Data da última mudança de verdade em cada página (vai para o sitemap e para o Markdown). Atualize ao mexer no conteúdo. */
  updated: { '/': '2026-11-11', '/sobre': '2026-11-11', '/contato': '2026-11-11', '/privacidade': '2026-11-11' } as Record<string, string>,
} as const;

// Páginas internas (Sobre, Contato, Privacidade). O HTML e o Markdown saem destes mesmos textos.
// Os textos aceitam links em Markdown: [texto](https://...).
export interface Block {
  h?: string;
  p?: string[];
  list?: string[];
}
export interface InnerPage {
  path: string;
  type: 'AboutPage' | 'ContactPage' | 'WebPage';
  eyebrow: string;
  h1: string;
  title: string;
  description: string;
  blocks: Block[];
}

export const pages: InnerPage[] = [
  {
    path: '/sobre',
    type: 'AboutPage',
    eyebrow: 'Sobre',
    h1: 'Sobre o arqATLAS',
    title: 'Sobre o arqATLAS, um atlas ilustrado do futuro das cidades',
    description:
      'O arqATLAS é um projeto de conceito de Miguel Angelo: um atlas ilustrado de uma página sobre como uma cidade sai da imaginação e vira lugar para morar.',
    blocks: [
      {
        p: [
          'O arqATLAS é um atlas ilustrado de uma página sobre como uma cidade sai da imaginação e vira lugar para morar. O título é o caminho do site, em três atos: Imagine, Projete e Habite.',
          'Em Imagine, a megacidade que o cinema sonhou para 2019 aparece com seis pontos que dizem o que já existe e o que ainda é ficção. Em Projete, uma torre imaginada se desenha em linhas de luz conforme a página rola, e cada parte dela já existe em algum prédio real. Em Habite, São Paulo vai do pôr do sol à noite, com o Copan, o MASP e a Ponte Estaiada.',
        ],
      },
      {
        h: 'Um projeto de conceito',
        p: [
          'Este site é um projeto de conceito: não é de uma empresa nem de um escritório de arquitetura. Ele foi criado para mostrar como fica uma narrativa guiada pela rolagem, com ilustração, dados com fonte e movimento.',
          'Todo número tem a fonte ao lado e na lista do rodapé. As quatro ilustrações foram feitas com IA, no estilo dos cenários de anime dos anos 90, e são a única arte do site. A Megacidade e a Torre-ícone são imaginadas; o Copan, o MASP e a Ponte Estaiada são de verdade.',
        ],
      },
      {
        h: 'Quem fez',
        p: [
          `O site foi desenhado e desenvolvido por [${brand.author}](${brand.url}), desenvolvedor full stack e designer de Franca (SP), que cuida do código, da interface e do movimento dos projetos que faz.`,
        ],
        list: [
          `Site: [${brand.site}](${brand.url})`,
          `Instagram: [${brand.instagramHandle}](${brand.instagram})`,
          `Código deste projeto no GitHub: [miguelrsant/architect](${brand.repo})`,
        ],
      },
      {
        h: 'Como foi feito',
        list: [
          'Next.js, React e TypeScript, com CSS Modules e um design system próprio (cores amostradas das ilustrações).',
          'O desenho da Torre é um sombreador WebGL escrito sem biblioteca, guiado pela rolagem.',
          'Testes de unidade conferem os números, as fontes e a posição de cada ponto; testes no navegador conferem as cenas no computador e no celular.',
          'Tudo continua legível com movimento reduzido e sem JavaScript.',
        ],
      },
    ],
  },
  {
    path: '/contato',
    type: 'ContactPage',
    eyebrow: 'Contato',
    h1: 'Contato',
    title: 'Contato · arqATLAS',
    description:
      'Fale com Miguel Angelo, que desenhou e desenvolveu o arqATLAS: site, Instagram, LinkedIn, GitHub e e-mail para orçamentos e conversas sobre projetos.',
    blocks: [
      {
        p: [
          `O arqATLAS é um projeto de conceito de ${brand.author}. Não existe equipe de atendimento nem telefone: quem responde é o próprio Miguel, pelos canais abaixo.`,
        ],
      },
      {
        h: 'Canais',
        list: [
          `Site e portfólio: [${brand.site}](${brand.url})`,
          `Instagram: [${brand.instagramHandle}](${brand.instagram})`,
          `LinkedIn: [linkedin.com/in/miguelrsant](${brand.linkedin})`,
          `GitHub: [github.com/miguelrsant](${brand.github})`,
          `E-mail: [${brand.email}](mailto:${brand.email})`,
        ],
      },
      {
        h: 'Quando falar com ele',
        list: [
          'Você quer um site com narrativa, ilustração e movimento para a sua marca, escritório ou produto.',
          'Você achou um erro em um número, em uma fonte ou no funcionamento do site.',
          'Você quer usar o código como referência: ele é aberto e está no GitHub.',
        ],
      },
      {
        h: 'O que mandar na primeira mensagem',
        p: [
          'Conte o que você quer construir, para quem é e se já existe identidade visual ou conteúdo. Com isso ele responde com as perguntas que faltam, uma ideia de prazo e o orçamento.',
          'O formulário "Receber o atlas" da página inicial não é um canal de contato: ele só pede um e-mail e, hoje, funciona em modo de demonstração.',
        ],
      },
    ],
  },
  {
    path: '/privacidade',
    type: 'WebPage',
    eyebrow: 'Privacidade',
    h1: 'Privacidade',
    title: 'Privacidade · arqATLAS',
    description:
      'O que o arqATLAS coleta: nada além dos registros técnicos da hospedagem. O formulário de e-mail roda em modo de demonstração e não guarda o endereço.',
    blocks: [
      {
        p: ['O arqATLAS é um projeto de conceito e foi feito para coletar o mínimo possível de dados de quem visita.'],
      },
      {
        h: 'O formulário "Receber o atlas"',
        p: [
          'O formulário da página inicial pede só um e-mail. Hoje ele roda em modo de demonstração: o endereço é conferido, o site agradece e avisa que o e-mail não foi guardado. Nada é gravado nem enviado para outro serviço.',
          'Se um dia o envio de capítulos por e-mail começar de verdade, esta página muda antes, dizendo onde o endereço fica guardado e como sair da lista.',
        ],
      },
      {
        h: 'O que o site não faz',
        list: [
          'Não tem cadastro, login nem área de cliente.',
          'Não usa cookies de rastreamento nem ferramentas de análise de audiência.',
          'Não exibe anúncios e não compartilha dados com anunciantes.',
        ],
      },
      {
        h: 'Registros técnicos da hospedagem',
        p: [
          'O site é hospedado na Vercel. Como em qualquer hospedagem, o servidor registra dados técnicos de cada acesso, como endereço IP, data e hora, página pedida e tipo de navegador. Esses registros servem para manter o site no ar e seguro e seguem a política de privacidade da Vercel.',
        ],
      },
      {
        h: 'Links para outros sites',
        p: [
          'As fontes dos números, o GitHub, o Instagram, o LinkedIn e o site de quem fez o projeto abrem em outros endereços. Ao clicar, você sai deste site e passa a valer a política de privacidade de cada um.',
        ],
      },
      {
        h: 'Dúvidas e direitos',
        p: [
          `Pela LGPD você pode perguntar se há dados seus e pedir a correção ou a exclusão. Como o site não guarda dados pessoais, a resposta costuma ser curta. Para qualquer dúvida, escreva para [${brand.email}](mailto:${brand.email}).`,
          'Última atualização: 11 de novembro de 2026.',
        ],
      },
    ],
  },
];

export const pageByPath = (path: string) => pages.find((p) => p.path === path);

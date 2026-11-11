// A Torre se desenha: um sombreador 2D, sem biblioteca. O traço sai da própria ilustração (o pixel mais
// escuro que o anel de 8 vizinhos em volta dele é nanquim), aparece quando o seu tempo passa do progresso
// do desenho e ganha cor depois, por um campo de tempo suave. Os dois campos vêm de scripts/traco.py.

const VERTICE = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAGMENTO = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D uArte;
uniform sampler2D uTempo;
uniform sampler2D uSobe;
uniform vec2 uRaio;
uniform float uDesenho;
uniform float uCor;
varying vec2 vUv;
const vec3 LUM = vec3(0.2126, 0.7152, 0.0722);
const vec3 TINTA = vec3(0.80, 0.87, 1.0);

float lum(vec2 uv) { return dot(texture2D(uArte, uv).rgb, LUM); }

void main() {
  vec3 arte = texture2D(uArte, vUv).rgb;
  vec2 r = uRaio;
  vec2 q = uRaio * 0.7071;
  float anel = max(
    max(max(lum(vUv + vec2(r.x, 0.0)), lum(vUv - vec2(r.x, 0.0))), max(lum(vUv + vec2(0.0, r.y)), lum(vUv - vec2(0.0, r.y)))),
    max(max(lum(vUv + q), lum(vUv - q)), max(lum(vUv + vec2(q.x, -q.y)), lum(vUv + vec2(-q.x, q.y))))
  );
  float linha = clamp((anel - dot(arte, LUM)) * 4.4 - 0.141, 0.0, 1.0);

  // o traço: aparece quando o tempo do pixel passa do desenho; a ponta da frente brilha
  float frente = uDesenho * 1.03 - texture2D(uTempo, vUv).r;
  float visto = clamp(frente / 0.012, 0.0, 1.0);
  float ponta = visto * (1.0 - clamp(frente / 0.035, 0.0, 1.0));
  float a = linha * max(visto, 0.1); // o desenho inteiro já aparece bem fraco, como um rascunho a lápis
  float brilho = linha * ponta * 0.7;
  vec3 desenho = TINTA * a + vec3(brilho);
  float alfa = clamp(a + brilho, 0.0, 1.0);

  // a cor: sobe da base por um campo suave, com uma borda clara e o traço ainda aceso logo atrás dela
  float x = uCor * 1.12 - texture2D(uSobe, vUv).r;
  float c = smoothstep(0.0, 0.022, x);
  float borda = smoothstep(0.0, 0.008, x) * (1.0 - smoothstep(0.008, 0.03, x)) * 0.12;
  float aceso = linha * c * (1.0 - smoothstep(0.0, 0.1, x)) * 0.45;
  vec3 rgb = mix(desenho, arte, c) + vec3(borda) + TINTA * aceso;
  gl_FragColor = vec4(rgb, clamp(mix(alfa, 1.0, c) + borda, 0.0, 1.0));
}`;

export interface Traco {
  /** Desenha o quadro: `desenho` e `cor` de 0 a 1. */
  desenhar(desenho: number, cor: number): void;
  /** Acompanha o tamanho do canvas na tela (chame ao mudar de tamanho). */
  ajustar(): void;
  limpar(): void;
}

export interface Imagens {
  arte: HTMLImageElement;
  tempo: HTMLImageElement;
  sobe: HTMLImageElement;
}

function compilar(gl: WebGLRenderingContext, tipo: number, fonte: string): WebGLShader | null {
  const s = gl.createShader(tipo);
  if (!s) return null;
  gl.shaderSource(s, fonte);
  gl.compileShader(s);
  return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
}

function textura(gl: WebGLRenderingContext, unidade: number, img: HTMLImageElement): WebGLTexture | null {
  const t = gl.createTexture();
  gl.activeTexture(gl.TEXTURE0 + unidade);
  gl.bindTexture(gl.TEXTURE_2D, t);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  return t;
}

/**
 * Prepara o sombreador no canvas. `larguraDaArte` é a largura da ilustração na escala em que o traço tem
 * ~2 px (2560 na imagem larga, 1072 no recorte em pé): o anel acompanha a resolução que o navegador baixou.
 * Devolve null sem WebGL; quem chama mostra a ilustração parada.
 */
export function criarTraco(canvas: HTMLCanvasElement, imagens: Imagens, larguraDaArte: number): Traco | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl) return null;
  const vs = compilar(gl, gl.VERTEX_SHADER, VERTICE);
  const fs = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO);
  const prog = gl.createProgram();
  if (!vs || !fs || !prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  // um triângulo que cobre a tela inteira
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const aPos = gl.getAttribLocation(prog, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const texturas = [textura(gl, 0, imagens.arte), textura(gl, 1, imagens.tempo), textura(gl, 2, imagens.sobe)];
  gl.uniform1i(gl.getUniformLocation(prog, 'uArte'), 0);
  gl.uniform1i(gl.getUniformLocation(prog, 'uTempo'), 1);
  gl.uniform1i(gl.getUniformLocation(prog, 'uSobe'), 2);
  const escala = imagens.arte.naturalWidth / larguraDaArte;
  const raio = 2 * escala;
  gl.uniform2f(gl.getUniformLocation(prog, 'uRaio'), raio / imagens.arte.naturalWidth, raio / imagens.arte.naturalHeight);
  const uDesenho = gl.getUniformLocation(prog, 'uDesenho');
  const uCor = gl.getUniformLocation(prog, 'uCor');
  gl.clearColor(0, 0, 0, 0);

  let ultimo = { desenho: -1, cor: -1 };
  const traco: Traco = {
    ajustar() {
      // até 3x a tela (o traço fica nítido no celular), e nunca mais pixels que a própria ilustração
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const w = Math.max(1, Math.min(Math.round(canvas.clientWidth * dpr), imagens.arte.naturalWidth));
      const h = Math.max(1, Math.round((w * canvas.clientHeight) / Math.max(1, canvas.clientWidth)));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        ultimo = { desenho: -1, cor: -1 };
      }
    },
    desenhar(desenho, cor) {
      if (gl.isContextLost() || (desenho === ultimo.desenho && cor === ultimo.cor)) return;
      ultimo = { desenho, cor };
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uDesenho, desenho);
      gl.uniform1f(uCor, cor);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
    limpar() {
      texturas.forEach((t) => gl.deleteTexture(t));
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    },
  };
  traco.ajustar();
  return traco;
}

/** Carrega uma imagem (mesma origem) e espera ela decodificar. */
export function carregar(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

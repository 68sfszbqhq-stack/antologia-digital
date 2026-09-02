// Motor de puntuación del Test de los Anillos de Landolt.
//
// Vive aparte del componente y sin una sola línea de React a propósito: así se
// puede correr desde Node y comprobar la aritmética contra el protocolo sin
// levantar un navegador. Es lo que hace scripts/probar-landolt.mjs.
//
// Protocolo: Instituto de Medicina del Deporte de Cuba (García Ucha, 2001),
// tal como aparece publicado en efdeportes.com/efd40/tenis1.htm
//
//   S  = [0.5436(N) − 2.807(n)] / T   velocidad de traslación, T en SEGUNDOS
//   IA = CA(100) / CT                 índice de atención, prueba de 5 minutos
//   IA = N / (n + 1)                  variante de 1 minuto (razón, no %)

/* ────────────────────────────────────────────────────────────────
   Test de los Anillos de Landolt — atención concentrada
   Protocolo: Instituto de Medicina del Deporte de Cuba
   (García Ucha, 2001). Hoja de 1050 anillos: 35 renglones × 30.

   Sin dependencias externas. Solo React.
   ──────────────────────────────────────────────────────────────── */

const COLUMNAS = 30;
const RENGLONES = 35;
const TOTAL = COLUMNAS * RENGLONES;

// Numeración de figuras: se parte de "arriba" y se avanza en sentido
// antihorario en pasos de 45°. Con esta convención la figura 6 queda con la
// abertura abajo a la derecha, que es la que indica el protocolo original.
// Si tu hoja impresa usa otro orden, cambia solo esta tabla.
const ANGULO = { 1: 270, 2: 225, 3: 180, 4: 135, 5: 90, 6: 45, 7: 0, 8: 315 };
const NOMBRE = {
  1: 'arriba', 2: 'arriba-izquierda', 3: 'izquierda', 4: 'abajo-izquierda',
  5: 'abajo', 6: 'abajo-derecha', 7: 'derecha', 8: 'arriba-derecha',
};

const TAMANOS = { chico: 20, medio: 26, grande: 34 };

/* ── motor de puntuación ─────────────────────────────────────── */

function mulberry32(semilla) {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function generarHoja(semilla) {
  const rnd = mulberry32(semilla);
  return Array.from({ length: TOTAL }, () => 1 + Math.floor(rnd() * 8));
}

const velocidadS = (N, n, T) => (T ? (0.5436 * N - 2.807 * n) / T : 0);

const calificarS = (S) =>
  S >= 1.24 ? 'Muy bien' : S > 1.02 ? 'Bien' : S > 0.84 ? 'Regular' : 'Mal';

const calificarIA = (IA) =>
  IA >= 90 ? 'Excelente' : IA >= 80 ? 'Muy bien' : IA >= 70 ? 'Bien' : IA >= 60 ? 'Regular' : 'Mal';

const calificarErrores = (n) =>
  n <= 2 ? 'Muy bien' : n <= 5 ? 'Bien' : n <= 10 ? 'Regular' : 'Mal';

function calcular(hoja, objetivo, marcas, T) {
  const idx = [...marcas.keys()];
  const N = idx.length ? Math.max(...idx) + 1 : 0;

  let CA = 0, falsos = 0;
  for (const i of idx) (hoja[i] === objetivo ? CA++ : falsos++);

  let CT = 0;
  for (let i = 0; i < N; i++) if (hoja[i] === objetivo) CT++;

  const omisiones = CT - CA;
  const n = falsos + omisiones;
  const S = velocidadS(N, n, T);

  // El protocolo define dos índices de atención DISTINTOS según la duración:
  // en la prueba de 5 minutos IA = CA(100)/CT, un porcentaje con su escala de
  // calificación; en la variante de un minuto IA = N/(n+1), que es una razón,
  // no un porcentaje, y para la que no hay escala publicada. No son
  // intercambiables: aplicar la escala de porcentajes a la razón calificaría
  // "Mal" a cualquiera. Por eso `variante` viaja junto al número.
  const variante = T <= 60 ? '1min' : '5min';
  const IA = variante === '1min' ? N / (n + 1) : (CT > 0 ? (CA / CT) * 100 : 0);

  return { N, n, CA, CT, falsos, omisiones, T, S, IA, variante };
}

function curvaPorMinuto(hoja, objetivo, marcas, T) {
  const bloques = Math.ceil(T / 60);
  const curva = [];
  let prev = 0;
  for (let b = 0; b < bloques; b++) {
    const desde = b * 60, hasta = Math.min((b + 1) * 60, T);
    const enBloque = [...marcas.entries()].filter(([, t]) => t >= desde && t < hasta);
    const fin = enBloque.length ? Math.max(...enBloque.map(([i]) => i)) + 1 : prev;
    const Nb = fin - prev;
    let CAb = 0, fb = 0;
    for (const [i] of enBloque) (hoja[i] === objetivo ? CAb++ : fb++);
    let CTb = 0;
    for (let i = prev; i < fin; i++) if (hoja[i] === objetivo) CTb++;
    const nb = fb + (CTb - CAb);
    curva.push({ minuto: b + 1, N: Nb, n: nb, CA: CAb, CT: CTb, S: velocidadS(Nb, nb, hasta - desde) });
    prev = fin;
  }
  return curva;
}

export {
  COLUMNAS, RENGLONES, TOTAL, ANGULO, NOMBRE, TAMANOS,
  generarHoja, velocidadS, calcular, curvaPorMinuto,
  calificarS, calificarIA, calificarErrores,
};

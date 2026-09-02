// Mapa del cuadernillo ediems-2026.
//
// GENERADO. No se edita a mano; se regenera con:
//
//     node scripts/mapear-cuadernillo.mjs <archivo.pdf> --id ediems-2026
//
// El cuadernillo NO se transcribe: se muestra el PDF original tal cual y este
// archivo solo dice DÓNDE está cada pregunta. Es a propósito, porque el examen
// trae diagramas, tablas y carteles, y copiarlos como texto los destruye. Lo
// único que se teclea aquí son números.
//
// OJO CON `PAGINA`: son páginas del PDF (1 = portada), no los folios impresos
// que se ven en la esquina de la hoja, que van uno atrás.
//
// Los nombres de las secciones salen de los renglones en mayúsculas del propio
// PDF y conviene revisarlos: es lo único que el script no puede garantizar.

/** Archivo del cuadernillo, dentro de public/. */
export const ARCHIVO = '/cuadernillos/ediems-2026.pdf';

export const TITULO = 'Evaluación Diagnóstica al Ingreso a la Educación Media Superior';

/** Cuántos minutos dura, según las instrucciones del propio cuadernillo. */
export const MINUTOS = 150;

/** Total de páginas del PDF. */
export const PAGINAS = 42;

/** Primera página con preguntas. Antes van portada e instrucciones. */
export const PAGINA_INICIAL = 4;

/** Las áreas que evalúa, con el tramo de preguntas de cada una. */
export const SECCIONES = [
  { id: 'ciencias_naturales_y_exp', nombre: 'Ciencias Naturales y Experimentales', desde: 1, hasta: 22 },
  { id: 'pensamiento_critico_refl', nombre: 'Pensamiento Crítico Reflexivo', desde: 23, hasta: 34 },
  { id: 'matematicas', nombre: 'Matemáticas', desde: 35, hasta: 54 },
  { id: 'ciencias_sociales', nombre: 'Ciencias Sociales', desde: 55, hasta: 68 },
  { id: 'lenguaje', nombre: 'Lenguaje', desde: 69, hasta: 88 },
];

/** Las cuatro opciones. Todas las preguntas del cuadernillo son A–D. */
export const OPCIONES = ['A', 'B', 'C', 'D'];

export const TOTAL = 88;

/** En qué página del PDF empieza cada pregunta. */
export const PAGINA = {
  1: 4,
  2: 4,
  3: 4,
  4: 4,
  5: 5,
  6: 5,
  7: 5,
  8: 6,
  9: 6,
  10: 6,
  11: 7,
  12: 7,
  13: 8,
  14: 8,
  15: 8,
  16: 9,
  17: 9,
  18: 9,
  19: 10,
  20: 10,
  21: 10,
  22: 11,
  23: 12,
  24: 12,
  25: 13,
  26: 13,
  27: 13,
  28: 14,
  29: 14,
  30: 14,
  31: 15,
  32: 15,
  33: 15,
  34: 16,
  35: 17,
  36: 17,
  37: 17,
  38: 18,
  39: 18,
  40: 18,
  41: 18,
  42: 19,
  43: 19,
  44: 19,
  45: 20,
  46: 20,
  47: 20,
  48: 21,
  49: 21,
  50: 21,
  51: 22,
  52: 22,
  53: 22,
  54: 23,
  55: 24,
  56: 24,
  57: 24,
  58: 25,
  59: 25,
  60: 26,
  61: 26,
  62: 26,
  63: 27,
  64: 27,
  65: 28,
  66: 28,
  67: 28,
  68: 29,
  69: 30,
  70: 31,
  71: 31,
  72: 32,
  73: 32,
  74: 33,
  75: 33,
  76: 34,
  77: 36,
  78: 36,
  79: 37,
  80: 37,
  81: 38,
  82: 38,
  83: 39,
  84: 39,
  85: 40,
  86: 41,
  87: 41,
  88: 42,
};

/** Las preguntas que empiezan en una página dada. */
export function preguntasDePagina(p) {
  const out = [];
  for (let n = 1; n <= TOTAL; n++) if (PAGINA[n] === p) out.push(n);
  return out;
}

/**
 * La página que hay que mostrar para contestar la pregunta `n`.
 * Si `n` no existe, devuelve la primera página con preguntas.
 */
export function paginaDePregunta(n) {
  return PAGINA[n] ?? PAGINA_INICIAL;
}

/** A qué área pertenece una pregunta. */
export function seccionDe(n) {
  return SECCIONES.find((s) => n >= s.desde && n <= s.hasta) ?? null;
}

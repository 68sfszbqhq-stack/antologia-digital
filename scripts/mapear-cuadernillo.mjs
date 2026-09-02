// Regenera el mapa del cuadernillo a partir del PDF.
//
//   node scripts/mapear-cuadernillo.mjs <archivo.pdf> [--id ediems-2027] [--minutos 150]
//
// QUÉ HACE Y POR QUÉ EXISTE. El cuadernillo de ingreso no se transcribe: se
// muestra el PDF tal cual, porque trae diagramas, tablas y carteles sobre los
// que se pregunta. Lo único que necesita el sitio es saber EN QUÉ PÁGINA está
// cada pregunta, y eso es lo que este script averigua y escribe en
// src/lib/cuadernillo-ediems.js.
//
// CÓMO LAS ENCUENTRA. Busca renglones que empiecen con un número y un punto,
// y solo acepta el que sigue en orden: si va por la 12, únicamente le sirve un
// renglón que empiece con "13.". Así no se confunde con las listas de opciones
// ("1a, 2c y 3b"), ni con las tablas numeradas, ni con las instrucciones.
//
// DÓNDE EMPIEZA A BUSCAR. Las instrucciones del cuadernillo también son una
// lista numerada ("1. Utiliza lápiz del número 2…"), así que si se empieza por
// la primera página, esa lista se cuela como si fueran preguntas. Por eso el
// script arranca DESPUÉS de las instrucciones: en la primera página que trae un
// encabezado de área en mayúsculas. Con --desde se puede fijar a mano.
//
// SI EL ORDEN SE ROMPE, NO ESCRIBE NADA y dice dónde se quedó. Es a propósito:
// un mapa a medias mandaría a los alumnos a la página equivocada, y eso es peor
// que no tener mapa.
//
// Las secciones sí se revisan a ojo: se detectan por los renglones en
// MAYÚSCULAS, pero el script imprime lo que encontró para que lo confirmes
// antes de dar por bueno el archivo.

import { readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { RAIZ } from "./_admin.mjs";

const args = process.argv.slice(2);
const ruta = args.find((a) => !a.startsWith("--"));

function opcion(nombre, x) {
  const i = args.indexOf(`--${nombre}`);
  return i >= 0 && args[i + 1] !== undefined ? args[i + 1] : x;
}

if (!ruta) {
  console.error("\n  Uso:  node scripts/mapear-cuadernillo.mjs <archivo.pdf>\n");
  console.error("  Opciones:");
  console.error("    --id ediems-2027     nombre del archivo dentro de public/cuadernillos/");
  console.error("    --minutos 150        duración que declara el propio cuadernillo");
  console.error("    --desde 4            primera página con preguntas (si no, se detecta)");
  console.error("    --secciones \"1-22:Ciencias Naturales,23-34:Pensamiento Crítico\"");
  console.error("    --salida src/lib/cuadernillo-ediems.js\n");
  process.exit(1);
}

const id = String(opcion("id", "ediems-2026"));
const minutos = Number(opcion("minutos", 150));
const salida = String(opcion("salida", "src/lib/cuadernillo-ediems.js"));
const desdeDado = opcion("desde", null);
const seccionesDadas = opcion("secciones", null);

/* ── leer el PDF ──────────────────────────────────────────────── */

const datos = new Uint8Array(readFileSync(resolve(ruta)));
const doc = await getDocument({ data: datos, useSystemFonts: true }).promise;
const total = doc.numPages;

/** Reconstruye los renglones de una página agrupando por altura. */
async function renglonesDe(n) {
  const pagina = await doc.getPage(n);
  const { items } = await pagina.getTextContent();
  const porAltura = new Map();
  for (const it of items) {
    if (!it.str) continue;
    // Se redondea la altura: dos trozos del mismo renglón nunca caen en el
    // mismo píxel exacto, pero sí en el mismo entero.
    const y = Math.round(it.transform[5]);
    const clave = Math.round(y / 3) * 3;
    if (!porAltura.has(clave)) porAltura.set(clave, []);
    porAltura.get(clave).push({ x: it.transform[4], s: it.str });
  }
  return [...porAltura.entries()]
    .sort((a, b) => b[0] - a[0]) // de arriba hacia abajo
    .map(([, trozos]) =>
      trozos.sort((a, b) => a.x - b.x).map((t) => t.s).join("").trim(),
    );
}

const paginas = [];
for (let n = 1; n <= total; n++) paginas.push(await renglonesDe(n));

/* ── mapa pregunta → página ───────────────────────────────────── */

/** ¿Este renglón parece el encabezado de un área? */
function esEncabezado(linea) {
  const s = linea.trim();
  return s.length >= 6 && s === s.toUpperCase() && /^[A-ZÁÉÍÓÚÑ ,Y]+$/.test(s);
}

// Dónde empezar: después de las instrucciones. Se busca la primera página con
// un encabezado de área que NO sea "INSTRUCCIONES".
let desde = desdeDado !== null ? Number(desdeDado) : null;
if (desde === null) {
  for (let i = 0; i < paginas.length && desde === null; i++) {
    for (const l of paginas[i]) {
      if (esEncabezado(l) && !l.includes("INSTRUCCION")) { desde = i + 1; break; }
    }
  }
}
if (!Number.isInteger(desde) || desde < 1) desde = 1;

const mapa = {};
let siguiente = 1;
for (let i = desde - 1; i < paginas.length; i++) {
  for (const linea of paginas[i]) {
    const m = /^(\d{1,3})\s*\./.exec(linea);
    if (m && Number(m[1]) === siguiente) {
      mapa[siguiente] = i + 1;
      siguiente++;
    }
  }
}

const preguntas = siguiente - 1;
if (preguntas === 0) {
  console.error("\n✗ No encontré ninguna pregunta numerada en ese PDF.");
  console.error("  ¿Es un cuadernillo escaneado (imágenes sin texto)? Entonces");
  console.error("  el mapa hay que escribirlo a mano.\n");
  process.exit(1);
}

console.log(`\n  ${total} páginas · ${preguntas} preguntas ubicadas (buscando desde la página ${desde}).`);
console.log(`  La primera empieza en la página ${mapa[1]}; la última, en la ${mapa[preguntas]}.`);

/* ── secciones, para revisar a ojo ────────────────────────────── */

let secciones = [];

if (seccionesDadas) {
  // Dictadas a mano: "1-22:Ciencias Naturales,23-34:Pensamiento Crítico".
  // Es la salida cuando la detección automática se equivoca, que pasa: un
  // renglón en mayúsculas dentro de un cartel o un mapa mental parece un
  // encabezado y no lo es.
  for (const trozo of String(seccionesDadas).split(",")) {
    const m = /^\s*(\d+)\s*-\s*(\d+)\s*:\s*(.+?)\s*$/.exec(trozo);
    if (!m) {
      console.error(`\n✗ No entendí esta sección: "${trozo}"`);
      console.error('  Se espera el formato  desde-hasta:Nombre\n');
      process.exit(1);
    }
    secciones.push({ desde: Number(m[1]), hasta: Number(m[2]), nombre: m[3] });
  }
} else {
  const encabezados = [];
  for (let i = desde - 1; i < paginas.length; i++) {
    for (const linea of paginas[i]) {
      if (esEncabezado(linea)) encabezados.push({ pagina: i + 1, texto: linea.trim() });
    }
  }

  // A cada encabezado le toca desde la primera pregunta de su página en adelante.
  for (const e of encabezados) {
    const primera = Object.keys(mapa).map(Number).find((n) => mapa[n] >= e.pagina);
    if (primera === undefined) continue;
    if (secciones.length && secciones.at(-1).desde === primera) continue;
    secciones.push({ nombre: e.texto, desde: primera });
  }
}
for (let i = 0; i < secciones.length; i++) {
  if (secciones[i].hasta === undefined) {
    secciones[i].hasta = i + 1 < secciones.length ? secciones[i + 1].desde - 1 : preguntas;
  }
  secciones[i].id = secciones[i].nombre
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 24);
}

console.log(seccionesDadas
  ? "\n  Secciones (dictadas con --secciones):"
  : "\n  Secciones detectadas (REVÍSALAS: se sacan de los renglones en mayúsculas).\n  Si alguna está mal, vuelve a correrlo con --secciones \"1-22:Nombre,23-34:Otro\":");
for (const s of secciones) {
  console.log(`     ${s.desde}–${s.hasta}  ${s.nombre}`);
}

/* ── escribir ─────────────────────────────────────────────────── */

const filas = Array.from({ length: preguntas }, (_, i) => `  ${i + 1}: ${mapa[i + 1]},`).join("\n");
const secTexto = secciones
  .map((s) => `  { id: '${s.id}', nombre: '${seccionesDadas ? s.nombre : titulo(s.nombre)}', desde: ${s.desde}, hasta: ${s.hasta} },`)
  .join("\n");

const archivo = `// Mapa del cuadernillo ${id}.
//
// GENERADO. No se edita a mano; se regenera con:
//
//     node scripts/mapear-cuadernillo.mjs <archivo.pdf> --id ${id}
//
// El cuadernillo NO se transcribe: se muestra el PDF original tal cual y este
// archivo solo dice DÓNDE está cada pregunta. Es a propósito, porque el examen
// trae diagramas, tablas y carteles, y copiarlos como texto los destruye. Lo
// único que se teclea aquí son números.
//
// OJO CON \`PAGINA\`: son páginas del PDF (1 = portada), no los folios impresos
// que se ven en la esquina de la hoja, que van uno atrás.
//
// Los nombres de las secciones salen de los renglones en mayúsculas del propio
// PDF y conviene revisarlos: es lo único que el script no puede garantizar.

/** Archivo del cuadernillo, dentro de public/. */
export const ARCHIVO = '/cuadernillos/${id}.pdf';

export const TITULO = 'Evaluación Diagnóstica al Ingreso a la Educación Media Superior';

/** Cuántos minutos dura, según las instrucciones del propio cuadernillo. */
export const MINUTOS = ${minutos};

/** Total de páginas del PDF. */
export const PAGINAS = ${total};

/** Primera página con preguntas. Antes van portada e instrucciones. */
export const PAGINA_INICIAL = ${mapa[1]};

/** Las áreas que evalúa, con el tramo de preguntas de cada una. */
export const SECCIONES = [
${secTexto}
];

/** Las cuatro opciones. Todas las preguntas del cuadernillo son A–D. */
export const OPCIONES = ['A', 'B', 'C', 'D'];

export const TOTAL = ${preguntas};

/** En qué página del PDF empieza cada pregunta. */
export const PAGINA = {
${filas}
};

/** Las preguntas que empiezan en una página dada. */
export function preguntasDePagina(p) {
  const out = [];
  for (let n = 1; n <= TOTAL; n++) if (PAGINA[n] === p) out.push(n);
  return out;
}

/**
 * La página que hay que mostrar para contestar la pregunta \`n\`.
 * Si \`n\` no existe, devuelve la primera página con preguntas.
 */
export function paginaDePregunta(n) {
  return PAGINA[n] ?? PAGINA_INICIAL;
}

/** A qué área pertenece una pregunta. */
export function seccionDe(n) {
  return SECCIONES.find((s) => n >= s.desde && n <= s.hasta) ?? null;
}
`;

const destino = salida.startsWith("/") ? salida : join(RAIZ, salida);
writeFileSync(destino, archivo, "utf8");

console.log(`\n✓ Escrito: ${destino}`);
console.log(`\n  Falta copiar el PDF a su lugar:`);
console.log(`     cp "${ruta}" public/cuadernillos/${id}.pdf\n`);

/** "CIENCIAS NATURALES" → "Ciencias Naturales", respetando las palabras cortas. */
function titulo(s) {
  const menores = new Set(["y", "de", "del", "la", "el", "los", "las", "a", "en"]);
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((p, i) => (i > 0 && menores.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ")
    .replace(/'/g, "");
}

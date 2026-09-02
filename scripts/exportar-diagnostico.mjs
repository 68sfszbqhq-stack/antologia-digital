// Saca los resultados del diagnóstico integral a CSV que abre Excel.
//
//   node scripts/exportar-diagnostico.mjs        → todas las aplicaciones
//   node scripts/exportar-diagnostico.mjs 1      → solo la aplicación 1
//   node scripts/exportar-diagnostico.mjs --clave clave-ediems.csv
//                                                → además califica el cuadernillo
//
// Salen TRES archivos, y no uno solo, porque son tres cosas que se leen
// distinto y meterlas en la misma hoja obliga a partirla a mano cada vez:
//
//   diagnostico-<fecha>.csv            un renglón por alumno, con lo resumido
//   diagnostico-respuestas-<fecha>.csv respuesta por respuesta de 2º y 3º
//   diagnostico-cuadernillo-<fecha>.csv  las 88 del cuadernillo de 1º
//
// Todos quedan en la raíz y están gitignoreados junto con los demás CSV: llevan
// nombre y fecha de nacimiento de menores. NO deben acabar en GitHub ni en un
// chat.
//
// SOBRE LA CLAVE DEL CUADERNILLO. El cuadernillo de ingreso que contesta el
// alumno no trae las respuestas correctas, así que el sitio guarda lo que
// marcó sin calificarlo. Cuando la autoridad publique la clave, se pone en un
// CSV de dos columnas (pregunta,respuesta) y se pasa con --clave: esto la
// aplica al exportar. Sin --clave, el cuadernillo sale sin calificar, que es lo
// honesto mientras no haya clave.

import { writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { conectar, campoCSV, leerCSV, RAIZ } from "./_admin.mjs";
import { TEMPERAMENTOS, ORDEN } from "../src/lib/temperamento.js";
import { SECCIONES, TOTAL } from "../src/lib/cuadernillo-ediems.js";

const args = process.argv.slice(2);
const posicional = args.find((a) => !a.startsWith("--"));
const aplicacion = posicional ? Number(posicional) : null;

const iClave = args.indexOf("--clave");
const rutaClave = iClave >= 0 ? args[iClave + 1] : null;

if (aplicacion !== null && (!Number.isInteger(aplicacion) || aplicacion < 1)) {
  console.error("\n✗ La aplicación tiene que ser un número entero de 1 en adelante.\n");
  process.exit(1);
}

/* ── clave del cuadernillo, si se dio ─────────────────────────── */

let clave = null;
if (rutaClave) {
  const ruta = existsSync(rutaClave) ? rutaClave : join(RAIZ, rutaClave);
  if (!existsSync(ruta)) {
    console.error(`\n✗ No encontré la clave en: ${rutaClave}\n`);
    process.exit(1);
  }
  // Se acepta cualquier par de columnas cuyo encabezado empiece por "pregunta"
  // y "respuesta", para no pelearse con cómo venga el archivo oficial.
  const filas = leerCSV(ruta);
  clave = {};
  for (const f of filas) {
    const k = Object.keys(f);
    const cn = k.find((x) => x.startsWith("pregunta")) ?? k[0];
    const cr = k.find((x) => x.startsWith("respuesta")) ?? k[1];
    const n = Number(f[cn]);
    const r = String(f[cr] ?? "").trim().toUpperCase();
    if (Number.isInteger(n) && /^[A-D]$/.test(r)) clave[n] = r;
  }
  const cuantas = Object.keys(clave).length;
  if (cuantas === 0) {
    console.error("\n✗ La clave no trajo ninguna respuesta válida.");
    console.error("  Se espera un CSV con columnas pregunta,respuesta (A–D).\n");
    process.exit(1);
  }
  console.log(`\n  Clave cargada: ${cuantas} de ${TOTAL} respuestas.`);
  if (cuantas < TOTAL) {
    console.log("  Las que falten se cuentan como no calificadas, no como error.");
  }
}

/* ── traer los registros ──────────────────────────────────────── */

const { db } = conectar();

let consulta = db.collection("diagnosticos");
if (aplicacion !== null) consulta = consulta.where("aplicacion", "==", aplicacion);

const snap = await consulta.get();

if (snap.empty) {
  console.log(
    aplicacion !== null
      ? `\n  No hay ningún resultado en la aplicación ${aplicacion}.\n`
      : "\n  Todavía no hay ningún resultado.\n",
  );
  process.exit(0);
}

const registros = snap.docs
  .map((d) => ({ id: d.id, ...d.data() }))
  .sort(
    (a, b) =>
      (a.aplicacion ?? 0) - (b.aplicacion ?? 0) ||
      String(a.grado ?? "").localeCompare(String(b.grado ?? "")) ||
      String(a.grupo ?? "").localeCompare(String(b.grupo ?? "")) ||
      String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es"),
  );

const fecha = new Date().toISOString().slice(0, 10);
const escribir = (nombre, filas) => {
  const ruta = join(RAIZ, nombre);
  // El BOM es lo que hace que Excel en Mac no destroce los acentos.
  writeFileSync(ruta, "﻿" + filas.map((f) => f.map(campoCSV).join(",")).join("\n"), "utf8");
  return ruta;
};

const cuando = (t) => (t?.toDate ? t.toDate().toLocaleString("es-MX") : "");

/* ── 1. resumen, un renglón por alumno ────────────────────────── */

const resumen = [[
  "Aplicación", "Estado", "Correo", "Entregado", "Nombre", "Nacimiento",
  "Género", "Grado", "Grupo", "Turno", "Procedencia",
  // atención
  "At_N", "At_CA", "At_CT", "At_falsos", "At_omisiones", "At_errores",
  "At_tiempo", "At_S", "At_IA", "At_variante",
  // temperamento
  "Tmp_dominante", "Tmp_secundario", "Tmp_sin_dominante_claro",
  ...ORDEN.map((t) => `Tmp_${TEMPERAMENTOS[t].nombre}`),
  // evaluación de 2º y 3º
  "Ev_aciertos", "Ev_total", "Ev_porcentaje",
  // cuadernillo de 1º
  "Cua_contestadas", "Cua_total",
  ...(clave ? ["Cua_aciertos", "Cua_porcentaje"] : []),
  ...SECCIONES.map((s) => `Cua_${s.id}${clave ? "_aciertos" : "_contestadas"}`),
]];

const califica = (c) => {
  if (!clave || !c) return null;
  let ok = 0;
  let calificadas = 0;
  const porSeccion = {};
  for (const s of SECCIONES) porSeccion[s.id] = 0;
  for (let n = 1; n <= (c.total ?? TOTAL); n++) {
    const buena = clave[n];
    if (!buena) continue;
    calificadas++;
    if (String(c.respuestas?.[n] ?? "").toUpperCase() === buena) {
      ok++;
      const s = SECCIONES.find((x) => n >= x.desde && n <= x.hasta);
      if (s) porSeccion[s.id]++;
    }
  }
  return { ok, calificadas, porcentaje: calificadas ? Math.round((ok / calificadas) * 100) : 0, porSeccion };
};

for (const r of registros) {
  const a = r.atencion;
  const t = r.temperamento;
  const e = r.academica;
  const c = r.cuadernillo;
  const cal = califica(c);

  resumen.push([
    r.aplicacion ?? "", r.estado ?? "", r.correo ?? "",
    cuando(r.entregado ?? r.actualizado), r.nombre ?? "", r.nacimiento ?? "",
    r.genero ?? "", r.grado ?? "", r.grupo ?? "", r.turno ?? "", r.procedencia ?? "",

    a?.N ?? "", a?.CA ?? "", a?.CT ?? "", a?.falsos ?? "", a?.omisiones ?? "",
    a?.n ?? "", a?.T ?? "", a?.S ?? "", a?.IA ?? "", a?.variante ?? "",

    t ? (TEMPERAMENTOS[t.dominante]?.nombre ?? t.dominante) : "",
    t ? (TEMPERAMENTOS[t.secundario]?.nombre ?? t.secundario) : "",
    t ? (t.empatado ? "sí" : "no") : "",
    ...ORDEN.map((k) => t?.puntos?.[k] ?? ""),

    e?.aciertos ?? "", e?.total ?? "", e?.porcentaje ?? "",

    c?.contestadas ?? "", c?.total ?? "",
    ...(clave ? [cal?.ok ?? "", cal?.porcentaje ?? ""] : []),
    ...SECCIONES.map((s) =>
      clave ? (cal?.porSeccion?.[s.id] ?? "") : (c?.porSeccion?.[s.id]?.contestadas ?? "")),
  ]);
}

/* ── 2. respuesta por respuesta, 2º y 3º ──────────────────────── */

const detalle = [["Aplicación", "Correo", "Nombre", "Grado", "Grupo", "Reactivo", "Respuesta"]];
for (const r of registros) {
  const e = r.academica;
  if (!e?.respuestas) continue;
  for (const [id, resp] of Object.entries(e.respuestas)) {
    detalle.push([r.aplicacion ?? "", r.correo ?? "", r.nombre ?? "", r.grado ?? "", r.grupo ?? "", id, resp]);
  }
}

/* ── 3. las 88 del cuadernillo, 1º ────────────────────────────── */

// Una columna por pregunta: así se pega tal cual en la hoja de captura y se ve
// de un golpe qué preguntas falló el grupo entero, que es la lectura útil.
const cabezaCua = ["Aplicación", "Estado", "Correo", "Nombre", "Grupo", "Contestadas"];
if (clave) cabezaCua.push("Aciertos", "Porcentaje");
for (let n = 1; n <= TOTAL; n++) cabezaCua.push(`P${n}`);
const cuadernillo = [cabezaCua];

if (clave) {
  const fila = ["", "", "", "CLAVE", "", "", "", ""];
  for (let n = 1; n <= TOTAL; n++) fila.push(clave[n] ?? "");
  cuadernillo.push(fila);
}

for (const r of registros) {
  const c = r.cuadernillo;
  if (!c) continue;
  const cal = califica(c);
  const fila = [r.aplicacion ?? "", r.estado ?? "", r.correo ?? "", r.nombre ?? "", r.grupo ?? "", c.contestadas ?? ""];
  if (clave) fila.push(cal?.ok ?? "", cal?.porcentaje ?? "");
  for (let n = 1; n <= TOTAL; n++) fila.push(c.respuestas?.[n] ?? "");
  cuadernillo.push(fila);
}

/* ── escribir ─────────────────────────────────────────────────── */

const r1 = escribir(`diagnostico-${fecha}.csv`, resumen);
console.log(`\n✓ ${registros.length} registro(s) exportados.\n`);
console.log(`  Resumen:      ${r1}`);

if (detalle.length > 1) {
  console.log(`  Respuestas:   ${escribir(`diagnostico-respuestas-${fecha}.csv`, detalle)}`);
}
if (cuadernillo.length > (clave ? 2 : 1)) {
  console.log(`  Cuadernillo:  ${escribir(`diagnostico-cuadernillo-${fecha}.csv`, cuadernillo)}`);
} else {
  console.log("  Cuadernillo:  (todavía nadie de primer año lo ha entregado)");
}

const aMedias = registros.filter((r) => r.estado !== "entregado");
if (aMedias.length) {
  console.log(`\n  ${aMedias.length} sin entregar todavía (salen igual, marcados "en curso"):`);
  for (const r of aMedias.slice(0, 15)) {
    console.log(`     ${r.grado ?? "?"} ${r.grupo ?? ""} · ${r.nombre ?? "(sin nombre)"} · ${r.correo ?? ""}`);
  }
  if (aMedias.length > 15) console.log(`     …y ${aMedias.length - 15} más.`);
  console.log("\n  Pueden volver a entrar con su misma cuenta de Google y");
  console.log("  continuar donde se quedaron, mientras la aplicación siga abierta.");
}

if (!clave) {
  console.log("\n  El cuadernillo de 1º sale SIN calificar: no trae clave de");
  console.log("  respuestas. Cuando la tengas, guárdala como CSV de dos");
  console.log("  columnas (pregunta,respuesta) y vuelve a exportar con:");
  console.log("     node scripts/exportar-diagnostico.mjs --clave clave-ediems.csv");
}
console.log("");

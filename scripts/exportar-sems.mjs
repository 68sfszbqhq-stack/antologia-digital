// Pasa el cuadernillo de 1º (88 preguntas) a la carga masiva de la SEMS,
// plataforma "Fortalece tu aprendizaje" (fortalecetuaprendizaje.cosfac.sems.gob.mx).
//
// Son DOS pasos porque la SEMS pide datos que el diagnóstico no recoge: CURP,
// apellidos por separado, promedio, tipo de secundaria y sostenimiento.
//
//   1) node scripts/exportar-sems.mjs
//        → escribe sems-hoja.csv: un renglón por alumno de 1º que contestó el
//          cuadernillo, con folio, nombre y género ya puestos y las columnas
//          que faltan en blanco. Se abre en Excel y se completa a mano.
//
//   2) node scripts/exportar-sems.mjs sems-hoja.csv
//        → con la hoja completa, escribe los dos archivos que pide la SEMS:
//            sems-1-ALTA-alumnos.csv   "Agregar estudiante(s) (carga masiva)"
//            sems-2-RESPUESTAS-test.csv "Agregar exámenes Test (carga masiva)"
//          El alta va PRIMERO: la plataforma no acepta respuestas de un folio
//          que no esté registrado.
//
//   2b) node scripts/exportar-sems.mjs sems-hoja.csv --parcial
//        → igual, pero con los renglones completos; avisa quién se quedó fuera.
//
// El folio es solo un consecutivo; lo que importa es que sea el mismo en los
// dos archivos, y por eso sale de la hoja. La hoja amarra cada folio al correo
// del alumno, así que se puede reordenar en Excel sin revolver respuestas.
//
// Los archivos de la SEMS salen en Latin-1 y con fin de línea de Windows, igual
// que las plantillas que ellos mismos dan: así no se destrozan los acentos al
// subirlos.
//
// Todo lleva CURP y nombre de menores: está gitignoreado (sems-*.csv).

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { conectar, campoCSV, leerCSV, RAIZ } from "./_admin.mjs";
import { TOTAL } from "../src/lib/cuadernillo-ediems.js";

// --parcial genera con los renglones completos y deja fuera los demás, para no
// frenar a todo el grupo por un par de datos que faltan.
const parcial = process.argv.includes("--parcial");
const rutaHoja = process.argv.slice(2).find((a) => !a.startsWith("--"));

/* ── traer al grupo de 1º con su cuadernillo ──────────────────── */

const { db } = conectar();
const snap = await db.collection("diagnosticos").get();
const alumnos = snap.docs
  .map((d) => d.data())
  .filter((r) => r.cuadernillo?.respuestas)
  .sort((a, b) => String(a.nombre ?? "").localeCompare(String(b.nombre ?? ""), "es"));

if (!alumnos.length) {
  console.log("\n  Nadie de primer año ha contestado el cuadernillo todavía.\n");
  process.exit(0);
}

const sinCuadernillo = snap.docs
  .map((d) => d.data())
  .filter((r) => r.grado === "1ero" && !r.cuadernillo?.respuestas);

const letraGenero = (g) => {
  const s = String(g ?? "").trim().toUpperCase();
  if (["H", "HOMBRE", "MASCULINO"].includes(s)) return "H";
  if (["M", "MUJER", "FEMENINO"].includes(s)) return "M";
  return "";
};

/* ── paso 1: la hoja para completar ───────────────────────────── */

const COLS_HOJA = [
  "folio", "correo", "nombre como lo escribio",
  "curp", "primer apellido", "segundo apellido", "nombres",
  "genero", "promedio", "tipo secundaria", "sostenimiento",
  "contestadas", "estado",
];

if (!rutaHoja) {
  const destino = join(RAIZ, "sems-hoja.csv");
  if (existsSync(destino)) {
    console.error(`\n✗ Ya existe ${destino}.`);
    console.error("  No la sobrescribo para no perder lo que hayas llenado.");
    console.error("  Si ya la completaste:  node scripts/exportar-sems.mjs sems-hoja.csv");
    console.error("  Si quieres empezar de cero, bórrala primero.\n");
    process.exit(1);
  }
  const filas = alumnos.map((r, i) => [
    i + 1, r.correo ?? "", r.nombre ?? "",
    "", "", "", "",
    letraGenero(r.genero), "", "", "",
    r.cuadernillo.contestadas ?? "", r.estado ?? "",
  ]);
  const csv = "﻿" + [COLS_HOJA, ...filas].map((f) => f.map(campoCSV).join(",")).join("\n") + "\n";
  writeFileSync(destino, csv, "utf8");

  console.log(`\n✓ ${filas.length} alumno(s) de 1º con cuadernillo.\n\n     ${destino}\n`);
  console.log("  Ábrela en Excel y llena, para cada alumno:");
  console.log("    curp · primer apellido · segundo apellido · nombres");
  console.log("    promedio         tal cual, con decimal (8.4); el script lo pasa a la escala 1–8");
  console.log("    tipo secundaria  1 General · 2 Técnica · 3 Para trabajadores");
  console.log("                     4 Comunitaria · 5 Telesecundaria · 6 Otra");
  console.log("    sostenimiento    1 Federal · 2 Estatal · 3 Particular");
  console.log("  No cambies las columnas folio ni correo.");
  console.log("  Guárdala como \"CSV UTF-8\" y luego corre:");
  console.log("     node scripts/exportar-sems.mjs sems-hoja.csv\n");
  if (sinCuadernillo.length) {
    console.log(`  ${sinCuadernillo.length} de 1º entraron pero no tienen cuadernillo; no van en la hoja.\n`);
  }
  process.exit(0);
}

/* ── paso 2: de la hoja a los archivos de la SEMS ─────────────── */

const ruta = existsSync(rutaHoja) ? rutaHoja : join(RAIZ, rutaHoja);
if (!existsSync(ruta)) {
  console.error(`\n✗ No encontré la hoja en: ${rutaHoja}\n`);
  process.exit(1);
}
if (readFileSync(ruta, "utf8").includes("�")) {
  console.error("\n✗ La hoja no está en UTF-8 y los acentos saldrían rotos.");
  console.error('  En Excel: Archivo → Guardar como → formato "CSV UTF-8".\n');
  process.exit(1);
}

const hoja = leerCSV(ruta);
const porCorreo = new Map(alumnos.map((r) => [String(r.correo ?? "").toLowerCase(), r]));

// Escala de la SEMS: 1 = 6.0–6.5, 2 = 6.6–7.0, … 8 = 9.6–10.
const escalaPromedio = (v) => {
  const p = Number(String(v).replace(",", "."));
  if (!Number.isFinite(p)) return null;
  if (p < 6 || p > 10) return null;
  const r = Math.round(p * 10) / 10;
  return Math.max(1, Math.ceil((r - 6) / 0.5 - 1e-9));
};
const CURP = /^[A-Z][AEIOUX][A-Z]{2}\d{6}[HMX][A-Z]{5}[A-Z0-9]\d$/;

const problemas = [];
const folios = new Set();
const curps = new Set();
const listos = [];

hoja.forEach((f, i) => {
  const linea = i + 2;
  const r = porCorreo.get(String(f.correo ?? "").toLowerCase());
  const quien = `línea ${linea} (${f["nombre como lo escribio"] || f.correo || "sin nombre"})`;
  const mal = [];

  const folio = String(f.folio ?? "").trim();
  if (!folio || folio.length > 10) mal.push("folio vacío o de más de 10 caracteres");
  else if (folios.has(folio)) mal.push(`folio ${folio} repetido`);
  folios.add(folio);

  if (!r) mal.push("su correo no aparece en el diagnóstico");

  const curp = String(f.curp ?? "").trim().toUpperCase();
  if (!CURP.test(curp)) mal.push(curp ? `CURP con forma incorrecta (${curp})` : "falta CURP");
  else if (curps.has(curp)) mal.push("CURP repetida");
  curps.add(curp);

  if (!f["primer apellido"]) mal.push("falta primer apellido");
  if (!f.nombres) mal.push("faltan nombres");

  const genero = letraGenero(f.genero);
  if (!genero) mal.push("género debe ser H o M");

  const promedio = escalaPromedio(f.promedio);
  if (promedio === null) mal.push("promedio vacío o fuera de 6–10");

  const tipo = Number(f["tipo secundaria"]);
  if (!(Number.isInteger(tipo) && tipo >= 1 && tipo <= 6)) mal.push("tipo secundaria debe ser 1–6");

  const sost = Number(f.sostenimiento);
  if (!(Number.isInteger(sost) && sost >= 1 && sost <= 3)) mal.push("sostenimiento debe ser 1–3");

  if (mal.length) return problemas.push(`${quien}: ${mal.join("; ")}`);

  listos.push({
    folio, curp, genero, promedio, tipo, sost,
    ap1: f["primer apellido"], ap2: f["segundo apellido"] ?? "", nombres: f.nombres,
    respuestas: r.cuadernillo.respuestas,
  });
});

if (problemas.length && !parcial) {
  console.error(`\n✗ La hoja tiene ${problemas.length} renglón(es) incompletos. No generé nada:\n`);
  problemas.forEach((p) => console.error("   " + p));
  console.error("\n  Corrige la hoja y vuelve a correr el script, o agrega --parcial");
  console.error("  para generar solo con los completos.\n");
  process.exit(1);
}
if (problemas.length) {
  console.log(`\n  ⚠ --parcial: se quedan fuera ${problemas.length} renglón(es) incompletos:`);
  problemas.forEach((p) => console.log("     " + p));
}

// Latin-1 y CRLF, como las plantillas de la SEMS.
const escribir = (nombre, filas) => {
  const destino = join(RAIZ, nombre);
  const texto = filas.map((f) => f.map(campoCSV).join(",")).join("\r\n") + "\r\n";
  writeFileSync(destino, Buffer.from(texto, "latin1"));
  return destino;
};

const alta = [[
  "folio", "curp", "Primer apellido", "Segundo apellido", "nombre(s)",
  "género", "promedio", "tipo_secundaria", "sostenimiento",
]];
for (const a of listos) {
  alta.push([a.folio, a.curp, a.ap1, a.ap2, a.nombres, a.genero, a.promedio, a.tipo, a.sost]);
}

const preguntas = Array.from({ length: TOTAL }, (_, i) => `pregunta ${i + 1}`);
const resp = [[
  "FOLIO", "GENERO", "PROMEDIO DE SECUNDARIA", "TIPO DE ESCUELA", "SOSTENIMIENTO", "CURP",
  ...preguntas,
]];
let enBlanco = 0;
for (const a of listos) {
  const marcas = preguntas.map((_, i) => {
    const r = String(a.respuestas[i + 1] ?? "").trim().toUpperCase();
    if (/^[A-D]$/.test(r)) return r;
    enBlanco++;
    return "X"; // la SEMS pide X cuando no hay respuesta
  });
  resp.push([a.folio, a.genero, a.promedio, a.tipo, a.sost, a.curp, ...marcas]);
}

const r1 = escribir("sems-1-ALTA-alumnos.csv", alta);
const r2 = escribir("sems-2-RESPUESTAS-test.csv", resp);

console.log(`\n✓ ${listos.length} alumno(s) listos para la SEMS.\n`);
console.log(`  1º sube:  ${r1}`);
console.log("            en \"Agregar estudiante(s) (carga masiva)\"");
console.log(`  2º sube:  ${r2}`);
console.log("            en \"Agregar respuestas Test\" → \"Agregar exámenes Test (carga masiva)\"");
console.log("            tipo de evaluación: \"Evaluación en hoja de respuestas\"");
if (enBlanco) console.log(`\n  ${enBlanco} pregunta(s) sin contestar salieron como X.`);
console.log("\n  ⚠ Llevan CURP de menores. No los mandes por chat y bórralos al terminar.\n");

// Genera los folios del cuestionario de nuevo ingreso, uno por familia.
//
//   node scripts/alta-folios.mjs 40                  → 40 folios sueltos
//   node scripts/alta-folios.mjs --csv lista.csv     → uno por alumno de la lista
//
// El CSV necesita al menos una columna "nombre"; si trae "grupo", se guarda
// también. Ejemplo:
//
//   nombre,grupo
//   Pérez López Juan,1A
//   Ramírez Soto Ana,1A
//
// Escribe folios-<fecha>.csv en la raíz del proyecto: esa es la lista que se
// reparte. Va gitignoreada porque un folio es una contraseña — quien lo tenga
// puede contestar por esa familia.
//
// Cada folio funciona UNA vez: en cuanto la familia entrega, las reglas
// rechazan cualquier segundo envío.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { conectar, generarCodigo, campoCSV, leerCSV, RAIZ } from "./_admin.mjs";
import { correoDeFolio, LARGO_FOLIO } from "../src/lib/folio.mjs";

const args = process.argv.slice(2);
const iCsv = args.indexOf("--csv");
const rutaCsv = iCsv >= 0 ? args[iCsv + 1] : null;
const cuantos = iCsv >= 0 ? null : Number(args[0]);

if (!rutaCsv && (!Number.isInteger(cuantos) || cuantos < 1 || cuantos > 500)) {
  console.error("\n✗ Dime cuántos folios generar (1 a 500), o pásame un CSV.\n");
  console.error("  node scripts/alta-folios.mjs 40");
  console.error("  node scripts/alta-folios.mjs --csv lista.csv\n");
  process.exit(1);
}

/** A quién se le asigna cada folio. Sin CSV, quedan sin nombre. */
let destinatarios;
if (rutaCsv) {
  let filas;
  try {
    filas = leerCSV(rutaCsv);
  } catch (e) {
    console.error(`\n✗ No pude leer ${rutaCsv}: ${e.message}\n`);
    process.exit(1);
  }
  destinatarios = filas
    .map((f) => ({ nombre: String(f.nombre ?? "").trim(), grupo: String(f.grupo ?? "").trim() }))
    .filter((d) => d.nombre);

  if (!destinatarios.length) {
    console.error(`\n✗ ${rutaCsv} no trae ninguna fila con columna "nombre".\n`);
    process.exit(1);
  }
} else {
  destinatarios = Array.from({ length: cuantos }, () => ({ nombre: "", grupo: "" }));
}

const { auth, db } = conectar();

const hechos = [];
const fallidos = [];

for (const d of destinatarios) {
  const folio = generarCodigo(LARGO_FOLIO);
  try {
    // El folio es a la vez el identificador y la contraseña. Ver src/lib/folio.mjs
    await auth.createUser({ uid: folio, email: correoDeFolio(folio), password: folio });
    await db.collection("folios").doc(folio).set({
      folio,
      nombre: d.nombre,
      grupo: d.grupo,
      creado: new Date(),
    });
    hechos.push({ folio, ...d });
  } catch (e) {
    fallidos.push({ ...d, error: e.code ?? e.message });
  }
}

if (hechos.length) {
  const csv =
    "﻿" +
    [["Folio", "Nombre", "Grupo"], ...hechos.map((h) => [h.folio, h.nombre, h.grupo])]
      .map((f) => f.map(campoCSV).join(","))
      .join("\n") + "\n";

  const nombre = `folios-${new Date().toISOString().slice(0, 10)}.csv`;
  const destino = join(RAIZ, nombre);
  writeFileSync(destino, csv, "utf8");

  console.log(`\n✓ ${hechos.length} folio(s) creados\n`);
  console.log(`     ${destino}\n`);
  console.log("  Los padres entran en:  /antologia-digital/expediente");
  console.log("  y escriben solo el folio. No hay contraseña aparte.\n");
  console.log("  ⚠ Un folio es una contraseña: quien lo tenga puede contestar");
  console.log("    por esa familia. Repártelos uno por uno, no en un grupo de");
  console.log("    WhatsApp. Este archivo no se sube a GitHub.\n");
}

if (fallidos.length) {
  console.error(`✗ ${fallidos.length} no se pudieron crear:`);
  for (const f of fallidos) console.error(`    ${f.nombre || "(sin nombre)"} — ${f.error}`);
  console.error("");
}

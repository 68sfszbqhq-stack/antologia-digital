// Saca los cuestionarios de nuevo ingreso a un CSV que abre Excel.
//
//   node scripts/exportar-expedientes.mjs           → todos
//   node scripts/exportar-expedientes.mjs --faltan  → quiénes NO han contestado
//
// Una columna por pregunta, en el mismo orden del cuestionario, tomado de
// src/lib/expediente-preguntas.js. Si algún día agregas una pregunta ahí, la
// columna aparece sola aquí.
//
// El archivo sale como expedientes-<fecha>.csv y está gitignoreado. Lleva CURP,
// domicilio implícito, salud del alumno y respuestas sobre violencia y consumo
// de sustancias dentro del hogar. No lo subas a ningún lado ni lo mandes por
// chat: si esa lista se filtra, el daño recae sobre familias concretas.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { conectar, campoCSV, RAIZ } from "./_admin.mjs";
import { CAMPOS } from "../src/lib/expediente-preguntas.js";

const soloFaltan = process.argv.includes("--faltan");

const { db } = conectar();

const [expSnap, folSnap] = await Promise.all([
  db.collection("expedientes").get(),
  db.collection("folios").get(),
]);

const entregados = new Map(expSnap.docs.map((d) => [d.id, d.data()]));

/* ── quiénes faltan ───────────────────────────────────────────── */

if (soloFaltan) {
  const pendientes = folSnap.docs
    .map((d) => d.data())
    .filter((f) => !entregados.has(f.folio))
    .sort((a, b) => String(a.grupo).localeCompare(String(b.grupo)) ||
                    String(a.nombre).localeCompare(String(b.nombre), "es"));

  if (!pendientes.length) {
    console.log(`\n✓ Todos contestaron: ${entregados.size} de ${folSnap.size}.\n`);
    process.exit(0);
  }

  console.log(`\n  Faltan ${pendientes.length} de ${folSnap.size}:\n`);
  for (const p of pendientes) {
    console.log(`    ${p.folio}   ${p.nombre || "(sin nombre)"}${p.grupo ? "  ·  " + p.grupo : ""}`);
  }
  console.log("");
  process.exit(0);
}

/* ── exportar ─────────────────────────────────────────────────── */

if (!entregados.size) {
  console.log("\n  Todavía no hay ningún cuestionario contestado.\n");
  process.exit(0);
}

// El nombre que la escuela le puso al folio, para poder cruzarlo con su lista.
const asignados = new Map(folSnap.docs.map((d) => [d.id, d.data()]));

const columnas = [
  "Folio", "Asignado a", "Grupo asignado", "Fecha de entrega",
  ...CAMPOS.map((c) => c.rotulo),
];

const filas = [...entregados.entries()]
  .map(([folio, d]) => ({ folio, d }))
  .sort((a, b) =>
    String(a.d.apellidoPaterno ?? "").localeCompare(String(b.d.apellidoPaterno ?? ""), "es"))
  .map(({ folio, d }) => {
    const ficha = asignados.get(folio) ?? {};
    return [
      folio,
      ficha.nombre ?? "",
      ficha.grupo ?? "",
      d.enviado?.toDate?.().toLocaleString("es-MX") ?? "",
      // Las respuestas de casillas son listas: se juntan con " | " para que
      // quepan en una celda sin romper el CSV.
      ...CAMPOS.map((c) => {
        const v = d[c.clave];
        if (Array.isArray(v)) return v.join(" | ");
        return v ?? "";
      }),
    ];
  });

const csv =
  "﻿" + [columnas, ...filas].map((f) => f.map(campoCSV).join(",")).join("\n") + "\n";

const nombre = `expedientes-${new Date().toISOString().slice(0, 10)}.csv`;
const destino = join(RAIZ, nombre);
writeFileSync(destino, csv, "utf8");

console.log(`\n✓ ${filas.length} cuestionario(s) exportados`);
if (folSnap.size) console.log(`  (de ${folSnap.size} folios repartidos)`);
console.log(`\n     ${destino}\n`);
console.log("  ⚠ Lleva CURP, datos de salud y respuestas sobre violencia y");
console.log("    consumo de sustancias en el hogar. No lo subas a GitHub, no lo");
console.log("    mandes por chat y bórralo cuando termines de usarlo.\n");

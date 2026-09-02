// Saca los resultados del test de Landolt a un CSV que abre Excel.
//
//   node scripts/exportar-landolt.mjs         → todas las rondas
//   node scripts/exportar-landolt.mjs 1       → solo la ronda 1
//
// El archivo sale en la raíz del proyecto como landolt-<fecha>.csv, y está
// gitignoreado junto con los demás CSV: lleva nombre y fecha de nacimiento de
// menores de edad, así que NO debe acabar en GitHub ni en un chat.
//
// Van los conteos crudos además de las calificaciones. Es a propósito: si algún
// día cambias los baremos, se recalcula sin volver a aplicarle la prueba a nadie.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { conectar, campoCSV, RAIZ } from "./_admin.mjs";
import { calificarS, calificarIA, calificarErrores } from "../src/lib/landolt-motor.js";

const ronda = process.argv[2] ? Number(process.argv[2]) : null;

if (ronda !== null && (!Number.isInteger(ronda) || ronda < 1)) {
  console.error("\n✗ La ronda tiene que ser un número entero de 1 en adelante.\n");
  process.exit(1);
}

const { db } = conectar();

let consulta = db.collection("landolt");
if (ronda !== null) consulta = consulta.where("aplicacion", "==", ronda);

const snap = await consulta.get();

if (snap.empty) {
  console.log(
    ronda !== null
      ? `\n  No hay ningún resultado en la ronda ${ronda}.\n`
      : "\n  Todavía no hay ningún resultado.\n",
  );
  process.exit(0);
}

const filas = snap.docs
  .map((d) => d.data())
  .sort(
    (a, b) =>
      (a.aplicacion ?? 0) - (b.aplicacion ?? 0) ||
      String(a.grupo).localeCompare(String(b.grupo)) ||
      String(a.nombre).localeCompare(String(b.nombre), "es"),
  );

const columnas = [
  "Ronda", "Nombre", "Fecha de nacimiento", "Edad", "Género", "Semestre",
  "Grupo", "Turno", "Secundaria", "Fecha de aplicación",
  "N", "CA", "CT", "Falsos", "Omisiones", "n", "T (seg)",
  "S (bit/seg)", "Evaluación S", "IA", "Evaluación IA", "Evaluación errores",
  "Variante",
];

const cuerpo = filas.map((r) => {
  const unMinuto = r.variante === "1min";
  return [
    r.aplicacion,
    r.nombre,
    r.nacimiento,
    edadEn(r.nacimiento, r.enviado?.toDate?.()),
    r.genero,
    r.semestre,
    r.grupo,
    r.turno,
    r.procedencia || "",
    r.enviado?.toDate?.().toLocaleString("es-MX") ?? "",
    r.N, r.CA, r.CT, r.falsos, r.omisiones, r.n, r.T,
    Number(r.S).toFixed(4),
    calificarS(Number(r.S)),
    Number(r.IA).toFixed(2),
    // La variante de un minuto usa IA = N/(n+1), que es una razón y no tiene
    // escala publicada. Calificarla con la escala de porcentajes sería inventar.
    unMinuto ? "sin escala publicada" : calificarIA(Number(r.IA)),
    calificarErrores(Number(r.n)),
    unMinuto ? "1 minuto — IA = N/(n+1)" : "5 minutos — IA = CA(100)/CT",
  ];
});

// El BOM es lo que hace que Excel en Windows respete los acentos.
const csv =
  "﻿" +
  [columnas, ...cuerpo].map((f) => f.map(campoCSV).join(",")).join("\n") +
  "\n";

const nombre = `landolt-${new Date().toISOString().slice(0, 10)}.csv`;
const destino = join(RAIZ, nombre);
writeFileSync(destino, csv, "utf8");

console.log(`\n✓ ${filas.length} resultado(s) exportados\n`);
console.log(`     ${destino}\n`);
console.log("  Lleva datos personales de menores: no lo subas a GitHub");
console.log("  ni lo mandes por chat.\n");

function edadEn(iso, cuando) {
  if (!iso || !cuando) return "";
  const f = new Date(iso + "T00:00:00");
  if (Number.isNaN(f.getTime())) return "";
  let edad = cuando.getFullYear() - f.getFullYear();
  const m = cuando.getMonth() - f.getMonth();
  if (m < 0 || (m === 0 && cuando.getDate() < f.getDate())) edad--;
  return edad;
}

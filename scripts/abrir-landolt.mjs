// Abre o cierra el Test de los Anillos de Landolt para el grupo.
//
//   node scripts/abrir-landolt.mjs              → dice cómo está ahora
//   node scripts/abrir-landolt.mjs 1            → abre la ronda 1
//   node scripts/abrir-landolt.mjs cerrar       → lo cierra para todos
//
//   Opciones al abrir:
//     --figura 6      qué anillo hay que marcar (1 a 8; 6 es el del protocolo)
//     --minutos 5     duración (5 es el protocolo; 1 es la variante corta)
//     --semilla 1234  orden de la hoja. Si no la pones, se inventa una.
//     --tamano medio  chico | medio | grande
//
// ABRIR Y CERRAR NO ES UN TRÁMITE. Como los alumnos de nuevo ingreso no tienen
// cuenta, mientras el test está abierto cualquiera con el enlace puede mandar un
// registro. Ábrelo al empezar la sesión y ciérralo al terminarla.
//
// ¿Por qué "rondas" y no un intento único? Porque el test SÍ está pensado para
// repetirse: lo que informa de verdad es comparar a la misma persona a lo largo
// del tiempo. Cada ronda es una medición. Y por eso cada ronda estrena semilla:
// si repites la misma hoja, la segunda vez mides cuánto la memorizaron.

import { conectar } from "./_admin.mjs";

const [crudo, ...resto] = process.argv.slice(2);
const arg = (crudo ?? "").trim().toLowerCase();

function opcion(nombre, x) {
  const i = resto.indexOf(`--${nombre}`);
  return i >= 0 && resto[i + 1] !== undefined ? resto[i + 1] : x;
}

const { db } = conectar();
const ref = db.collection("config").doc("landolt");

/* ── sin argumentos: informar ─────────────────────────────────── */

if (!arg) {
  const snap = await ref.get();
  const c = snap.exists ? snap.data() : {};
  const abierta = Number(c.abierta) || 0;
  const total = (await db.collection("landolt").count().get()).data().count;

  console.log(
    abierta > 0
      ? `\n  ABIERTO en la ronda ${abierta}.`
      : "\n  CERRADO. Ningún alumno puede entregar.",
  );
  if (abierta > 0) {
    console.log(`     figura ${c.objetivo ?? 6} · ${(c.duracion ?? 300) / 60} min · semilla ${c.semilla ?? "—"}`);
  }
  console.log(`\n  Registros guardados: ${total}\n`);
  console.log("  Abrir:     node scripts/abrir-landolt.mjs 1");
  console.log("  Cerrar:    node scripts/abrir-landolt.mjs cerrar");
  console.log("  Exportar:  node scripts/exportar-landolt.mjs\n");
  process.exit(0);
}

/* ── cerrar ───────────────────────────────────────────────────── */

if (arg === "cerrar" || arg === "0") {
  await ref.set({ abierta: 0 }, { merge: true });
  console.log("\n✓ Test CERRADO. Lo ya entregado se conserva.\n");
  process.exit(0);
}

/* ── abrir ────────────────────────────────────────────────────── */

const ronda = Number(arg);
if (!Number.isInteger(ronda) || ronda < 1) {
  console.error("\n✗ La ronda tiene que ser un número entero de 1 en adelante.");
  console.error("  Uso:  node scripts/abrir-landolt.mjs <número | cerrar>\n");
  process.exit(1);
}

const figura = Number(opcion("figura", 6));
const minutos = Number(opcion("minutos", 5));
const tamano = String(opcion("tamano", "medio"));

if (!Number.isInteger(figura) || figura < 1 || figura > 8) {
  console.error("\n✗ --figura tiene que ser un entero del 1 al 8.\n");
  process.exit(1);
}
if (!Number.isInteger(minutos) || minutos < 1 || minutos > 30) {
  console.error("\n✗ --minutos tiene que ser un entero del 1 al 30.\n");
  process.exit(1);
}
if (!["chico", "medio", "grande"].includes(tamano)) {
  console.error("\n✗ --tamano tiene que ser chico, medio o grande.\n");
  process.exit(1);
}

const previo = (await ref.get()).data() ?? {};

// Semilla nueva por ronda, salvo que se pida una a mano. Una ronda que reusa la
// hoja anterior no mide atención: mide memoria.
const semillaDada = opcion("semilla", null);
const semilla =
  semillaDada !== null
    ? Number(semillaDada)
    : previo.semillaRonda === ronda && previo.semilla
      ? Number(previo.semilla) // reabrir la MISMA ronda conserva su hoja
      : Math.floor(Math.random() * 900000000) + 100000000;

if (!Number.isInteger(semilla)) {
  console.error("\n✗ --semilla tiene que ser un número entero.\n");
  process.exit(1);
}

const yaHechos = (
  await db.collection("landolt").where("aplicacion", "==", ronda).count().get()
).data().count;

await ref.set(
  { abierta: ronda, semillaRonda: ronda, objetivo: figura, duracion: minutos * 60, semilla, tamano },
  { merge: true },
);

console.log(`\n✓ Test ABIERTO en la ronda ${ronda}.\n`);
console.log(`     figura ${figura} · ${minutos} min · semilla ${semilla} · anillo ${tamano}`);
console.log("\n  Los alumnos entran en:  /antologia-digital/landolt");
console.log("  No necesitan matrícula ni código: se registran ahí mismo.\n");

if (yaHechos > 0) {
  console.log(`  Ojo: esta ronda ya tiene ${yaHechos} entrega(s), y se`);
  console.log("  conservó su misma hoja. Para una segunda medición del mismo");
  console.log("  grupo abre la ronda siguiente, no esta.\n");
}

console.log("  ⚠ Ciérralo al terminar la sesión:");
console.log("     node scripts/abrir-landolt.mjs cerrar\n");

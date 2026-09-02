// Abre o cierra la evaluación diagnóstica integral.
//
//   node scripts/abrir-diagnostico.mjs            → dice cómo está ahora
//   node scripts/abrir-diagnostico.mjs 1          → abre la aplicación 1
//   node scripts/abrir-diagnostico.mjs cerrar     → la cierra para todos
//
//   Opciones al abrir:
//     --bloques atencion,temperamento,academica   qué partes se aplican
//     --figura 6      qué anillo hay que marcar en el test de atención (1 a 8)
//     --minutos 5     duración del test de atención
//     --semilla 1234  orden de la hoja de anillos. Si no la pones, se inventa.
//     --tamano medio  chico | medio | grande
//
// CUÁNTO TIEMPO DEJARLA ABIERTA. Aquí los alumnos entran con su cuenta de
// Google, así que cada entrega queda identificada y no hay riesgo de que llegue
// basura anónima: se puede dejar abierta toda la semana de aplicación. Y CONVIENE
// dejarla, porque mientras esté abierta es cuando un alumno que se atoró puede
// volver a entrar y continuar donde se quedó. Al cerrarla, las reglas ya no
// aceptan cambios: los que iban a medias se quedan a medias.
//
// (El test suelto de /landolt es lo contrario: allá se entra sin cuenta, así que
// ese sí hay que cerrarlo al acabar la sesión. Son dos interruptores distintos;
// cerrar uno no cierra el otro.)

import { conectar } from "./_admin.mjs";

const [crudo, ...resto] = process.argv.slice(2);
const arg = (crudo ?? "").trim().toLowerCase();

function opcion(nombre, x) {
  const i = resto.indexOf(`--${nombre}`);
  return i >= 0 && resto[i + 1] !== undefined ? resto[i + 1] : x;
}

const { db } = conectar();
const ref = db.collection("config").doc("diagnostico");

const NOMBRES = {
  atencion: "test de atención",
  temperamento: "test de temperamento",
  academica: "evaluación por grado",
};

/* ── sin argumentos: informar ─────────────────────────────────── */

if (!arg) {
  const snap = await ref.get();
  const c = snap.exists ? snap.data() : {};
  const abierta = Number(c.abierta) || 0;
  const total = (await db.collection("diagnosticos").count().get()).data().count;

  console.log(
    abierta > 0
      ? `\n  ABIERTA en la aplicación ${abierta}.`
      : "\n  CERRADA. Ningún alumno puede entregar.",
  );
  if (abierta > 0) {
    const b = c.bloques ?? {};
    const activos = Object.keys(NOMBRES).filter((k) => b[k] !== false);
    console.log(`     bloques: ${activos.map((k) => NOMBRES[k]).join(" · ")}`);
    console.log(`     atención: figura ${c.objetivo ?? 6} · ${(c.duracion ?? 300) / 60} min · semilla ${c.semilla ?? "—"}`);
  }
  const entregados = (
    await db.collection("diagnosticos").where("estado", "==", "entregado").count().get()
  ).data().count;
  console.log(`\n  Registros: ${total}  (${entregados} entregados, ${total - entregados} a medias)\n`);
  console.log("  Abrir:     node scripts/abrir-diagnostico.mjs 1");
  console.log("  Cerrar:    node scripts/abrir-diagnostico.mjs cerrar");
  console.log("  Exportar:  node scripts/exportar-diagnostico.mjs\n");
  process.exit(0);
}

/* ── cerrar ───────────────────────────────────────────────────── */

if (arg === "cerrar" || arg === "0") {
  await ref.set({ abierta: 0 }, { merge: true });
  console.log("\n✓ Evaluación CERRADA. Lo ya entregado se conserva.\n");
  process.exit(0);
}

/* ── abrir ────────────────────────────────────────────────────── */

const aplicacion = Number(arg);
if (!Number.isInteger(aplicacion) || aplicacion < 1) {
  console.error("\n✗ La aplicación tiene que ser un número entero de 1 en adelante.");
  console.error("  Uso:  node scripts/abrir-diagnostico.mjs <número | cerrar>\n");
  process.exit(1);
}

const pedidos = String(opcion("bloques", "atencion,temperamento,academica"))
  .split(",")
  .map((x) => x.trim().toLowerCase())
  .filter(Boolean);

const desconocido = pedidos.find((b) => !(b in NOMBRES));
if (desconocido) {
  console.error(`\n✗ Bloque desconocido: "${desconocido}".`);
  console.error(`  Los válidos son: ${Object.keys(NOMBRES).join(", ")}\n`);
  process.exit(1);
}
if (!pedidos.length) {
  console.error("\n✗ Hay que dejar al menos un bloque activo.\n");
  process.exit(1);
}

const bloques = Object.fromEntries(
  Object.keys(NOMBRES).map((k) => [k, pedidos.includes(k)]),
);

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

// Semilla nueva por aplicación, salvo que se pida una a mano. Repetir la hoja
// de anillos no mide atención: mide cuánto la memorizaron.
const semillaDada = opcion("semilla", null);
const semilla =
  semillaDada !== null
    ? Number(semillaDada)
    : previo.semillaAplicacion === aplicacion && previo.semilla
      ? Number(previo.semilla) // reabrir la MISMA aplicación conserva su hoja
      : Math.floor(Math.random() * 900000000) + 100000000;

if (!Number.isInteger(semilla)) {
  console.error("\n✗ --semilla tiene que ser un número entero.\n");
  process.exit(1);
}

const yaHechos = (
  await db.collection("diagnosticos").where("aplicacion", "==", aplicacion).count().get()
).data().count;

await ref.set(
  {
    abierta: aplicacion,
    semillaAplicacion: aplicacion,
    bloques,
    objetivo: figura,
    duracion: minutos * 60,
    semilla,
    tamano,
  },
  { merge: true },
);

console.log(`\n✓ Evaluación ABIERTA en la aplicación ${aplicacion}.\n`);
console.log(`     bloques: ${pedidos.map((k) => NOMBRES[k]).join(" · ")}`);
if (bloques.atencion) {
  console.log(`     atención: figura ${figura} · ${minutos} min · semilla ${semilla} · anillo ${tamano}`);
}
console.log("\n  Los alumnos entran en:");
console.log("     https://68sfszbqhq-stack.github.io/antologia-digital/diagnostico");
console.log("\n  Entran con su cuenta de Google. No hay que repartir contraseñas,");
console.log("  y si se atoran pueden volver y seguir donde se quedaron.");
console.log("  Eligen su grado y sobre ese grado se les aplica la evaluación:");
console.log("     1º → cuadernillo oficial de ingreso (PDF, 88 preguntas)");
console.log("     2º → 3 materias, 15 reactivos");
console.log("     3º → 6 materias, 31 reactivos\n");

if (yaHechos > 0) {
  console.log(`  Ojo: esta aplicación ya tiene ${yaHechos} entrega(s), y se`);
  console.log("  conservó su misma hoja de anillos. Para una segunda medición");
  console.log("  del mismo grupo abre la aplicación siguiente, no esta.\n");
}

console.log("  Déjala abierta mientras dure la aplicación: es lo que permite");
console.log("  que quien se atoró vuelva a entrar y continúe. Al terminar:");
console.log("     node scripts/abrir-diagnostico.mjs cerrar\n");

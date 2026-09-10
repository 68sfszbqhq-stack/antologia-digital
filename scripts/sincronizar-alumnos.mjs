#!/usr/bin/env node
//
// Crea la ficha de los módulos a partir de la evaluación diagnóstica de inicio
// de ciclo.
//
// Para qué sirve: los alumnos ya entraron una vez con su cuenta de Google, y
// ahí dejaron su nombre, su grado y su grupo. Copiar esos datos a la colección
// `alumnos` les ahorra volver a escribirlos, y —más importante— hace que la
// tabla del panel salga con los nombres bien escritos desde el primer día, en
// vez de con lo que cada quien teclee.
//
// No es obligatorio: quien no aparezca aquí puede darse de alta solo al entrar
// al primer módulo. Esto solo adelanta el trabajo.
//
// NUNCA pisa una ficha que ya exista. Volver a correrlo es seguro: sirve para
// recoger a los que hicieron el diagnóstico después.
//
//   node scripts/sincronizar-alumnos.mjs --ensayo   # dice qué haría, no escribe
//   node scripts/sincronizar-alumnos.mjs            # lo hace

import { conectar } from "./_admin.mjs";
import { armarGrupo, limpiarNombre } from "../src/lib/grupo.mjs";

const ensayo = process.argv.includes("--ensayo");

const { db } = conectar();

const [snapDiag, snapAlumnos] = await Promise.all([
  db.collection("diagnosticos").get(),
  db.collection("alumnos").get(),
]);

const yaTienen = new Set(snapAlumnos.docs.map((d) => d.id));

// Un alumno puede tener varios documentos de diagnóstico (uno por aplicación).
// Se queda el más reciente: es donde corrigió lo que había escrito mal.
const porUid = new Map();
for (const d of snapDiag.docs) {
  const x = d.data();
  const uid = x.uid ?? d.id.split("_")[0];
  if (!uid || !x.nombre) continue;
  const cuando = x.actualizado?.toMillis?.() ?? 0;
  const previo = porUid.get(uid);
  if (!previo || cuando > previo.cuando) porUid.set(uid, { datos: x, cuando });
}

const nuevos = [];
const saltados = [];

for (const [uid, { datos }] of porUid) {
  if (yaTienen.has(uid)) { saltados.push(uid); continue; }
  nuevos.push({
    uid,
    ficha: {
      matricula: "",
      nombre: limpiarNombre(datos.nombre),
      grupo: armarGrupo(datos),
      activo: true,
      correo: datos.correo ?? "",
      origen: "google",
    },
  });
}

nuevos.sort((a, b) => a.ficha.grupo.localeCompare(b.ficha.grupo, "es")
  || a.ficha.nombre.localeCompare(b.ficha.nombre, "es"));

console.log(`Diagnósticos leídos: ${snapDiag.size}  ·  alumnos distintos: ${porUid.size}`);
console.log(`Ya tenían ficha: ${saltados.length}  ·  por crear: ${nuevos.length}\n`);

const porGrupo = {};
for (const n of nuevos) porGrupo[n.ficha.grupo] = (porGrupo[n.ficha.grupo] ?? 0) + 1;
for (const [g, n] of Object.entries(porGrupo).sort()) console.log(`  ${g.padEnd(12)} ${n}`);

if (!nuevos.length) {
  console.log("\nNo hay nada que crear.");
  process.exit(0);
}

if (ensayo) {
  console.log("\n(--ensayo: no se escribió nada)");
  process.exit(0);
}

// En tandas de 400: un lote de Firestore aguanta 500 operaciones.
for (let i = 0; i < nuevos.length; i += 400) {
  const lote = db.batch();
  for (const n of nuevos.slice(i, i + 400)) {
    lote.set(db.collection("alumnos").doc(n.uid), n.ficha);
  }
  await lote.commit();
}

console.log(`\n✓ ${nuevos.length} fichas creadas.`);

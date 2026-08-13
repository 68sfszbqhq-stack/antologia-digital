// Da de alta un grupo completo y genera los códigos para repartir.
//
//   node scripts/alta-alumnos.mjs alumnos.csv           ← da de alta
//   node scripts/alta-alumnos.mjs alumnos.csv --ensayo  ← solo muestra qué haría
//
// El CSV de entrada necesita estas tres columnas (el orden da igual):
//
//   matricula,nombre,grupo
//   2024001,Juan Pérez López,CDI-A
//   2024002,Ana Ramírez Cruz,CDI-A
//
// Al terminar escribe credenciales-<grupo>.csv con el código de cada alumno,
// listo para imprimir y recortar. Ese archivo está gitignoreado.
//
// Volver a correrlo NO cambia los códigos de quien ya existe: solo da de alta a
// los nuevos. Así puedes agregar a los que llegaron tarde sin romperle el
// acceso al resto.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  conectar, generarCodigo, leerCSV, campoCSV, correoDeMatricula, RAIZ,
} from "./_admin.mjs";
import { normalizarMatricula } from "../src/lib/matricula.mjs";

const [, , rutaCSV, ...banderas] = process.argv;
const ensayo = banderas.includes("--ensayo") || banderas.includes("--dry-run");

if (!rutaCSV) {
  console.error(`
Uso:  node scripts/alta-alumnos.mjs <archivo.csv> [--ensayo]

El archivo necesita las columnas: matricula, nombre, grupo
Con --ensayo no se crea nada: solo te dice qué haría.
`);
  process.exit(1);
}

// ─── Leer y revisar el archivo antes de tocar nada ───────────────────────────

const filas = leerCSV(rutaCSV);
if (!filas.length) {
  console.error("✗ El archivo está vacío o no tiene filas de datos.");
  process.exit(1);
}

for (const col of ["matricula", "nombre", "grupo"]) {
  if (!(col in filas[0])) {
    console.error(`✗ Falta la columna "${col}". Encontré: ${Object.keys(filas[0]).join(", ")}`);
    process.exit(1);
  }
}

const problemas = [];
const vistas = new Set();
const alumnos = [];

filas.forEach((f, i) => {
  const linea = i + 2; // +1 por el encabezado, +1 porque las líneas cuentan desde 1
  const matricula = normalizarMatricula(f.matricula);
  if (!matricula) return problemas.push(`línea ${linea}: matrícula vacía o sin letras ni números`);
  if (!f.nombre) return problemas.push(`línea ${linea}: falta el nombre`);
  if (!f.grupo) return problemas.push(`línea ${linea}: falta el grupo`);
  if (vistas.has(matricula)) return problemas.push(`línea ${linea}: matrícula ${matricula} repetida`);
  vistas.add(matricula);
  alumnos.push({ matricula, nombre: f.nombre, grupo: f.grupo });
});

if (problemas.length) {
  console.error("✗ El archivo tiene problemas. No se dio de alta a nadie:\n");
  problemas.forEach((p) => console.error("   " + p));
  console.error("\nCorrige el archivo y vuelve a correr el script.");
  process.exit(1);
}

console.log(`\nLeí ${alumnos.length} alumnos de ${rutaCSV}`);
if (ensayo) console.log("Modo ENSAYO: no se va a crear nada.\n");

// ─── Alta ────────────────────────────────────────────────────────────────────

// En ensayo ni siquiera se conecta: la idea es poder revisar el archivo
// tranquilo, antes de tener la llave de Firebase o de tocar nada real.
if (ensayo) {
  for (const a of alumnos) {
    console.log(`   daría de alta  ${a.matricula.padEnd(12)} ${a.nombre}   [${a.grupo}]`);
  }
  console.log("\nEnsayo terminado. Quita --ensayo para darlos de alta de verdad.\n");
  process.exit(0);
}

const { auth, db } = conectar();
const nuevos = [];
const yaEstaban = [];
const fallidos = [];

for (const a of alumnos) {
  const correo = correoDeMatricula(a.matricula);
  const codigo = generarCodigo();

  try {
    // El UID es la matrícula: así los datos se leen solos en la consola de
    // Firebase ("alumnos/2024001") en vez de ser cadenas sin sentido.
    await auth.createUser({ uid: a.matricula, email: correo, password: codigo });
    await db.collection("alumnos").doc(a.matricula).set({
      matricula: a.matricula,
      nombre: a.nombre,
      grupo: a.grupo,
      activo: true,
      creado: new Date(),
    });
    nuevos.push({ ...a, codigo });
    console.log(`   ✓ ${a.matricula.padEnd(12)} ${a.nombre}`);
  } catch (e) {
    if (e.code === "auth/uid-already-exists" || e.code === "auth/email-already-exists") {
      // Ya existía: se respeta su código actual y solo se refresca la ficha,
      // por si le cambiaste el nombre o el grupo en el CSV.
      await db.collection("alumnos").doc(a.matricula).set(
        { matricula: a.matricula, nombre: a.nombre, grupo: a.grupo },
        { merge: true },
      );
      yaEstaban.push(a);
      console.log(`   · ${a.matricula.padEnd(12)} ${a.nombre}  (ya existía, código sin cambios)`);
    } else {
      fallidos.push({ ...a, error: e.message });
      console.log(`   ✗ ${a.matricula.padEnd(12)} ${a.nombre}  → ${e.message}`);
    }
  }
}

// ─── Hoja de códigos para repartir ───────────────────────────────────────────

if (nuevos.length) {
  const porGrupo = {};
  for (const a of nuevos) (porGrupo[a.grupo] ??= []).push(a);

  for (const [grupo, lista] of Object.entries(porGrupo)) {
    const archivo = join(RAIZ, `credenciales-${grupo.replace(/[^\w-]/g, "_")}.csv`);
    const contenido = [
      "matricula,nombre,codigo",
      ...lista.map((a) => [a.matricula, a.nombre, a.codigo].map(campoCSV).join(",")),
    ].join("\n");
    writeFileSync(archivo, contenido + "\n", "utf8");
    console.log(`\n📄 Códigos del grupo ${grupo}: ${archivo}`);
  }
}

console.log(`
Resumen
   nuevos ....... ${nuevos.length}
   ya existían .. ${yaEstaban.length}
   con error .... ${fallidos.length}
`);

if (nuevos.length) {
  console.log(`Los códigos SOLO están en ese archivo: no quedan guardados en ningún
otro lado, ni siquiera en Firebase (ahí viven cifrados). Si lo pierdes, hay que
regenerar códigos con scripts/reset-codigo.mjs.
`);
}

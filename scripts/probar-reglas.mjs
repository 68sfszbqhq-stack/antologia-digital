// Prueba end-to-end de las reglas de seguridad, usando el SDK de cliente
// (el mismo que corre en el navegador del alumno), no el Admin SDK.
// Los códigos se leen del archivo y nunca se imprimen.

import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, serverTimestamp,
} from "firebase/firestore";

const RAIZ = "/Users/josemendoza/proyectos/ANTOLOGIA DIGITAL";
const { configFirebase } = await import(`${RAIZ}/src/lib/firebase-config.ts`);

const app = initializeApp(configFirebase);
const auth = getAuth(app);
const db = getFirestore(app);

// Códigos de los alumnos de prueba
const filas = readFileSync(`${RAIZ}/credenciales-ZZ-PRUEBA.csv`, "utf8").trim().split("\n").slice(1);
const cred = Object.fromEntries(filas.map((l) => { const c = l.split(","); return [c[0], c[2]]; }));

let ok = 0, mal = 0;
function chequeo(nombre, paso) {
  if (paso) { console.log(`  ✓ ${nombre}`); ok++; }
  else { console.log(`  ✗ ${nombre}  ← FALLA`); mal++; }
}

async function debeFallar(nombre, fn) {
  try { await fn(); chequeo(nombre, false); }
  catch (e) { chequeo(`${nombre}  [${e.code ?? e.message}]`, e.code === "permission-denied"); }
}
async function debeFuncionar(nombre, fn) {
  try { await fn(); chequeo(nombre, true); }
  catch (e) { console.log(`  ✗ ${nombre}  ← FALLA (${e.code ?? e.message})`); mal++; }
}

const correo = (m) => `${m}@antologia.local`;

// Punto de partida limpio: se borran los intentos de prueba y se cierran todos
// los módulos. Sin esto la segunda corrida falla sola, porque el candado del
// intento único hace su trabajo.
const admin = await import(`${RAIZ}/scripts/_admin.mjs`);
const { db: dbAdmin } = admin.conectar();
for (const id of ["9999001_1", "9999001_2", "9999002_1"]) {
  await dbAdmin.collection("intentos").doc(id).delete();
}
await dbAdmin.collection("config").doc("modulos").set({ abiertos: [] });

console.log("\n═══ COMO ALUMNO 9999001 ═══\n");
await signInWithEmailAndPassword(auth, correo("9999001"), cred["9999001"]);
console.log("  ✓ entró con su matrícula y código");
ok++;

console.log("\n— Lo que NO debe poder hacer —");
await debeFallar("listar TODOS los intentos del grupo (fuga de calificaciones)",
  () => getDocs(collection(db, "intentos")));
await debeFallar("listar la lista completa de alumnos",
  () => getDocs(collection(db, "alumnos")));
await debeFallar("leer la ficha de OTRO alumno",
  () => getDoc(doc(db, "alumnos", "9999002")).then(s => { if (!s.exists()) throw { code: "permission-denied" }; }));
await debeFallar("entregar un módulo que el profesor NO ha abierto",
  () => setDoc(doc(db, "intentos", "9999001_1"), {
    uid: "9999001", dia: 1, aciertos: 10, total: 10, porcentaje: 100,
    porEje: {}, respuestas: [], enviado: serverTimestamp(),
  }));

console.log("\n— Lo que SÍ debe poder hacer —");
await debeFuncionar("leer su propia ficha", () => getDoc(doc(db, "alumnos", "9999001")));
await debeFuncionar("consultar qué módulos están abiertos", () => getDoc(doc(db, "config", "modulos")));
// Este caso parece trivial y no lo es: la página pregunta "¿ya contesté?" antes
// de contestar, o sea sobre un documento que aún no existe. Cuando esto fallaba,
// el sitio mostraba el cuestionario de módulos cerrados.
await debeFuncionar("preguntar por un intento suyo que TODAVÍA no existe",
  () => getDoc(doc(db, "intentos", "9999001_7")));

// El profesor abre el módulo 1
console.log("\n═══ EL PROFESOR ABRE EL MÓDULO 1 ═══\n");
await dbAdmin.collection("config").doc("modulos").set({ abiertos: [1] });
console.log("  ✓ módulo 1 abierto");
ok++;

console.log("\n═══ EL ALUMNO CONTESTA ═══\n");
await debeFuncionar("entregar el diagnóstico del módulo 1", () =>
  setDoc(doc(db, "intentos", "9999001_1"), {
    uid: "9999001", dia: 1, aciertos: 8, total: 10, porcentaje: 80,
    porEje: { Hardware: { ok: 4, total: 5 } }, respuestas: [1, 0, 2], enviado: serverTimestamp(),
  }));
await debeFuncionar("volver a ver su propia calificación", () => getDoc(doc(db, "intentos", "9999001_1")));

console.log("\n— El candado del intento único —");
await debeFallar("contestar el MISMO módulo por segunda vez", () =>
  setDoc(doc(db, "intentos", "9999001_1"), {
    uid: "9999001", dia: 1, aciertos: 10, total: 10, porcentaje: 100,
    porEje: {}, respuestas: [], enviado: serverTimestamp(),
  }));
await debeFallar("borrar su intento para volver a empezar",
  () => deleteDoc(doc(db, "intentos", "9999001_1")));
await debeFallar("entregar un intento a nombre de OTRO alumno", () =>
  setDoc(doc(db, "intentos", "9999002_1"), {
    uid: "9999002", dia: 1, aciertos: 0, total: 10, porcentaje: 0,
    porEje: {}, respuestas: [], enviado: serverTimestamp(),
  }));
await debeFallar("inventarse una calificación imposible (15 de 10)", () =>
  setDoc(doc(db, "intentos", "9999001_2"), {
    uid: "9999001", dia: 2, aciertos: 15, total: 10, porcentaje: 150,
    porEje: {}, respuestas: [], enviado: serverTimestamp(),
  }));

console.log("\n═══ COMO OTRO ALUMNO (9999002) ═══\n");
await signOut(auth);
await signInWithEmailAndPassword(auth, correo("9999002"), cred["9999002"]);
await debeFallar("espiar la calificación del compañero",
  () => getDoc(doc(db, "intentos", "9999001_1")).then(s => { if (!s.exists()) throw { code: "permission-denied" }; }));

console.log("\n═══ CÓDIGO EQUIVOCADO ═══\n");
await signOut(auth);
try {
  await signInWithEmailAndPassword(auth, correo("9999001"), "CODIGOFALSO123");
  chequeo("entrar con código incorrecto queda bloqueado", false);
} catch (e) {
  chequeo(`entrar con código incorrecto queda bloqueado  [${e.code}]`, true);
}

console.log("\n═══ COMO PROFESOR ═══\n");
// Se intenta entrar con un token temporal firmado por el Admin SDK, para probar
// el acceso del profesor sin necesitar su contraseña real. Firmar tokens exige
// una cuenta de servicio: con las credenciales de gcloud no se puede, así que
// esta parte se omite en vez de reventar la prueba.
try {
  const { auth: authAdmin } = admin.conectar();
  const token = await authAdmin.createCustomToken("profesor");
  const { signInWithCustomToken } = await import("firebase/auth");
  await signOut(auth);
  await signInWithCustomToken(auth, token);

  await debeFuncionar("ver TODAS las calificaciones del grupo", () => getDocs(collection(db, "intentos")));
  await debeFuncionar("ver la lista completa de alumnos", () => getDocs(collection(db, "alumnos")));
  await debeFuncionar("abrir y cerrar módulos", () => setDoc(doc(db, "config", "modulos"), { abiertos: [1] }));
  await debeFuncionar("borrar el intento de un alumno para que repita",
    () => deleteDoc(doc(db, "intentos", "9999001_1")));
} catch (e) {
  console.log("  ⚠ omitido: para firmar tokens hace falta serviceAccountKey.json");
  console.log("    Verifícalo entrando tú mismo a /profesor.");
}

console.log(`\n${"═".repeat(50)}\nRESULTADO:  ${ok} correctas,  ${mal} fallas\n`);
process.exit(mal ? 1 : 0);

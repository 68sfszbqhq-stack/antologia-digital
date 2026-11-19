// Prueba las reglas de /psicometrico en el EMULADOR (no toca datos reales).
// Uso: firebase emulators:exec --only firestore,auth --project demo-psico --config <config con puertos 8188/9199> "node scripts/probar-psicometrico.mjs"
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, addDoc, getDocs, collection, serverTimestamp } from "firebase/firestore";

const P = "demo-psico";
const app = initializeApp({ projectId: P, apiKey: "demo" });
const auth = getAuth(app); connectAuthEmulator(auth, "http://127.0.0.1:9199", { disableWarnings: true });
const db = getFirestore(app); connectFirestoreEmulator(db, "127.0.0.1", 8188);

// Ficha sembrada saltándose las reglas (token "owner" del emulador).
async function sembrarFicha(uid, ficha) {
  const f = Object.fromEntries(Object.entries(ficha).map(([k, v]) =>
    [k, typeof v === "boolean" ? { booleanValue: v } : { stringValue: v }]));
  const r = await fetch(`http://127.0.0.1:8188/v1/projects/${P}/databases/(default)/documents/alumnos/${uid}`,
    { method: "PATCH", headers: { Authorization: "Bearer owner", "Content-Type": "application/json" }, body: JSON.stringify({ fields: f }) });
  if (!r.ok) throw new Error(await r.text());
}

let ok = 0, mal = 0;
const marca = (n, p) => { console.log(`  ${p ? "✓" : "✗"} ${n}`); p ? ok++ : mal++; };
async function intento(n, datos, debe) {
  try { await addDoc(collection(db, "psicometrico"), { ...datos, enviado: serverTimestamp() }); marca(n, debe); }
  catch (e) { marca(`${n} [${e.code}]`, !debe && e.code === "permission-denied"); }
}

const base = { celular: "", total: 70, raz: 10, sit: 6, intP: 80, mentira: 0, discOk: 8, perfil: "S" };

// 1. Sin sesión
await intento("sin sesión se rechaza", { ...base, uid: "x", nombre: "Ana Pérez", grupo: "5.º A" }, false);

// 2. Con sesión pero sin ficha
const sinFicha = (await createUserWithEmailAndPassword(auth, "sinficha@prueba.mx", "secreto123")).user;
await intento("con cuenta pero sin ficha se rechaza", { ...base, uid: sinFicha.uid, nombre: "Ana Pérez", grupo: "5.º A" }, false);

// 3. Alumno con ficha activa
const yo = (await createUserWithEmailAndPassword(auth, "ana@prueba.mx", "secreto123")).user;
await sembrarFicha(yo.uid, { matricula: "", nombre: "Ana Pérez", grupo: "5.º A", activo: true, correo: "ana@prueba.mx", origen: "google" });
const mio = { ...base, uid: yo.uid, nombre: "Ana Pérez", grupo: "5.º A" };
await intento("alumno con ficha entrega su resultado", mio, true);
const resp = { discMas: Array(8).fill(0), discMenos: Array(8).fill(1), raz: Array(16).fill(-1), int: Array(12).fill(3), sit: Array(8).fill(2) };
await intento("entrega con respuestas y tiempos", { ...mio, resp, tiempos: [60, 300, 100, 200] }, true);
await intento("respuestas incompletas se rechazan", { ...mio, resp: { ...resp, raz: [1, 2] }, tiempos: [60, 300, 100, 200] }, false);
await intento("respuestas con campo extra se rechazan", { ...mio, resp: { ...resp, otra: [1] } }, false);
await intento("tiempos mal formados se rechazan", { ...mio, resp, tiempos: [1] }, false);
await intento("puede repetir la práctica", { ...mio, celular: "2221234567" }, true);
await intento("nombre distinto al de su ficha se rechaza", { ...mio, nombre: "Otro Alumno" }, false);
await intento("grupo distinto al de su ficha se rechaza", { ...mio, grupo: "3.º A" }, false);
await intento("a nombre de otro uid se rechaza", { ...mio, uid: "otro" }, false);
await intento("puntaje fuera de rango se rechaza", { ...mio, total: 150 }, false);
await intento("celular con letras se rechaza", { ...mio, celular: "55abc" }, false);
await intento("campo extra se rechaza", { ...mio, curp: "X" }, false);
try { await getDocs(collection(db, "psicometrico")); marca("el alumno NO puede ver la lista", false); }
catch (e) { marca(`el alumno NO puede ver la lista [${e.code}]`, e.code === "permission-denied"); }

// 4. Ficha desactivada
const baja = (await createUserWithEmailAndPassword(auth, "baja@prueba.mx", "secreto123")).user;
await sembrarFicha(baja.uid, { matricula: "", nombre: "Luis Ruiz", grupo: "5.º A", activo: false, correo: "baja@prueba.mx", origen: "google" });
await intento("alumno desactivado se rechaza", { ...base, uid: baja.uid, nombre: "Luis Ruiz", grupo: "5.º A" }, false);

console.log(`\n${ok} bien, ${mal} mal`);
process.exit(mal ? 1 : 0);

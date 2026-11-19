// Prueba las reglas de /gimnasio (avance del Gimnasio mental) en el EMULADOR (no toca datos reales).
// Uso: firebase emulators:exec --only firestore,auth --project demo-gim --config <config con puertos 8188/9199> "node scripts/probar-gimnasio.mjs"
import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator, doc, getDoc, getDocs, setDoc, collection, increment, serverTimestamp } from "firebase/firestore";

const P = "demo-gim";
const BASE = "http://127.0.0.1";
function cliente(nombre) {
  const app = initializeApp({ projectId: P, apiKey: "demo" }, nombre);
  const auth = getAuth(app); connectAuthEmulator(auth, `${BASE}:9199`, { disableWarnings: true });
  const db = getFirestore(app); connectFirestoreEmulator(db, "127.0.0.1", 8188);
  return { auth, db };
}
async function sembrarFicha(uid, ficha) {
  const f = Object.fromEntries(Object.entries(ficha).map(([k, v]) =>
    [k, typeof v === "boolean" ? { booleanValue: v } : { stringValue: v }]));
  const r = await fetch(`${BASE}:8188/v1/projects/${P}/databases/(default)/documents/alumnos/${uid}`,
    { method: "PATCH", headers: { Authorization: "Bearer owner", "Content-Type": "application/json" }, body: JSON.stringify({ fields: f }) });
  if (!r.ok) throw new Error(await r.text());
}
let ok = 0, mal = 0;
const marca = (n, p) => { console.log(`  ${p ? "✓" : "✗"} ${n}`); p ? ok++ : mal++; };
async function intento(n, fn, debe) {
  try { await fn(); marca(n, debe); }
  catch (e) { marca(`${n} [${e.code}]`, !debe && e.code === "permission-denied"); }
}

await fetch(`${BASE}:9199/identitytoolkit.googleapis.com/v1/projects/${P}/accounts`, {
  method: "POST", headers: { Authorization: "Bearer owner", "Content-Type": "application/json" },
  body: JSON.stringify({ localId: "profesor", email: "profe@prueba.mx", password: "secreto123" }),
});
const profe = cliente("profe");
await signInWithEmailAndPassword(profe.auth, "profe@prueba.mx", "secreto123");
const ana = cliente("ana");
const yo = (await createUserWithEmailAndPassword(ana.auth, "ana@prueba.mx", "secreto123")).user;
await sembrarFicha(yo.uid, { matricula: "", nombre: "Ana Pérez", grupo: "3º A Vesp", activo: true, correo: "ana@prueba.mx", origen: "google" });
const beto = cliente("beto");
const otro = (await createUserWithEmailAndPassword(beto.auth, "beto@prueba.mx", "secreto123")).user;
await sembrarFicha(otro.uid, { matricula: "", nombre: "Beto Ruiz", grupo: "3º A Vesp", activo: true, correo: "beto@prueba.mx", origen: "google" });
const intruso = cliente("intruso");
await createUserWithEmailAndPassword(intruso.auth, "sinficha@prueba.mx", "secreto123");

const ref = (c, uid) => doc(c.db, "gimnasio", uid);
const ronda = (uid, nombre, extra = {}) => ({
  uid, nombre, grupo: "3º A Vesp", rondas: increment(1), dominados: 7, ultimaBien: 7, ultimaDe: 10,
  av: { a1: { v: 1, m: 0, ultimo: "v" } }, actualizado: serverTimestamp(), ...extra,
});

console.log("Avance del alumno");
await intento("primera ronda bien formada", () => setDoc(ref(ana, yo.uid), ronda(yo.uid, "Ana Pérez"), { merge: true }), true);
await intento("segunda ronda (sube de una en una)", () => setDoc(ref(ana, yo.uid), ronda(yo.uid, "Ana Pérez", { dominados: 9 }), { merge: true }), true);
await intento("inflar las rondas de golpe", () => setDoc(ref(ana, yo.uid), ronda(yo.uid, "Ana Pérez", { rondas: 50 }), { merge: true }), false);
await intento("bajar las rondas", () => setDoc(ref(ana, yo.uid), ronda(yo.uid, "Ana Pérez", { rondas: 0 }), { merge: true }), false);
await intento("más de 60 dominados", () => setDoc(ref(ana, yo.uid), ronda(yo.uid, "Ana Pérez", { dominados: 61 }), { merge: true }), false);
await intento("más aciertos que preguntas", () => setDoc(ref(ana, yo.uid), ronda(yo.uid, "Ana Pérez", { ultimaBien: 11, ultimaDe: 10 }), { merge: true }), false);
await intento("nombre distinto al de su ficha", () => setDoc(ref(beto, otro.uid), ronda(otro.uid, "Campeón"), { merge: true }), false);
await intento("escribir el avance de otro", () => setDoc(ref(beto, yo.uid), ronda(yo.uid, "Ana Pérez"), { merge: true }), false);
await intento("campo inventado", () => setDoc(ref(beto, otro.uid), ronda(otro.uid, "Beto Ruiz", { calificacion: 10 }), { merge: true }), false);
await intento("hora inventada", () => setDoc(ref(beto, otro.uid), ronda(otro.uid, "Beto Ruiz", { actualizado: new Date(0) }), { merge: true }), false);
await intento("cuenta sin ficha no guarda", () => setDoc(ref(intruso, intruso.auth.currentUser.uid), ronda(intruso.auth.currentUser.uid, "X"), { merge: true }), false);
await intento("el alumno lee su propio avance", async () => {
  const s = await getDoc(ref(ana, yo.uid));
  if (s.data().rondas !== 2) throw new Error(`rondas = ${s.data().rondas}`);
}, true);
await intento("un alumno no lee el avance de otro", () => getDoc(ref(beto, yo.uid)), false);
await intento("un alumno no lista a todos", () => getDocs(collection(ana.db, "gimnasio")), false);
await intento("el profesor lista a todos", () => getDocs(collection(profe.db, "gimnasio")), true);

console.log(`\n${ok} bien, ${mal} mal`);
process.exit(mal ? 1 : 0);

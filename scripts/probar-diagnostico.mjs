// Comprueba que las reglas de /diagnosticos rechazan lo que deben.
//
//   node scripts/probar-diagnostico.mjs
//
// Usa el SDK de cliente —el mismo que corre en el navegador del alumno— y NO el
// Admin SDK, que se saltaría las reglas y no probaría nada. No crea ni borra
// nada: solo intenta hacer cosas que deben fallar, y confirma que fallan.
//
// Lo que NO puede probar desde aquí: el camino feliz. Ese exige entrar con una
// cuenta de Google de verdad, que no se puede automatizar sin la contraseña de
// alguien. Ese se prueba a mano, en el navegador, antes de aplicarla al grupo.

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore, doc, getDoc, setDoc, collection, getDocs, serverTimestamp,
} from "firebase/firestore";
import { join } from "node:path";
import { RAIZ } from "./_admin.mjs";

const { configFirebase } = await import(`file://${join(RAIZ, "src/lib/firebase-config.ts")}`);

const app = initializeApp(configFirebase);
const db = getFirestore(app);
getAuth(app); // a propósito, sin identificarse

let ok = 0;
let mal = 0;

async function debeFallar(nombre, fn) {
  try {
    await fn();
    console.log(`  ✗ ${nombre}  ← SE PERMITIÓ, y no debía`);
    mal++;
  } catch (e) {
    if (e?.code === "permission-denied") {
      console.log(`  ✓ ${nombre}`);
      ok++;
    } else {
      console.log(`  ? ${nombre}  (${e?.code ?? e})`);
      mal++;
    }
  }
}

console.log("\n  Sin identificarse, que es como llega cualquiera con el enlace:\n");

await debeFallar("no puede listar los diagnósticos del grupo", () =>
  getDocs(collection(db, "diagnosticos")));

await debeFallar("no puede leer el diagnóstico de otro alumno", () =>
  getDoc(doc(db, "diagnosticos", "uid-ajeno_1")));

await debeFallar("no puede crear un diagnóstico", () =>
  setDoc(doc(db, "diagnosticos", "inventado_1"), {
    aplicacion: 1, uid: "inventado", correo: "x@y.z", estado: "en curso",
    nombre: "Nombre Falso", nacimiento: "2010-01-01", genero: "Hombre",
    grado: "1ero", grupo: "A", turno: "Matutino", procedencia: "",
    atencion: null, temperamento: null, academica: null, cuadernillo: null,
    iniciado: serverTimestamp(), actualizado: serverTimestamp(),
  }));

await debeFallar("no puede leer la configuración de la evaluación", () =>
  getDoc(doc(db, "config", "diagnostico")));

console.log(`\n  ${ok} bien · ${mal} mal\n`);
process.exit(mal ? 1 : 0);

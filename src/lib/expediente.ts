// Lo que la familia puede hacer con el cuestionario de nuevo ingreso.
//
// Igual que en el resto del sitio: esto es la puerta amable, la seguridad vive
// en firestore.rules. La diferencia con el test de Landolt es importante y
// deliberada: allí se entra sin cuenta porque solo se miden anillos tachados;
// aquí se entra con folio porque el cuestionario recoge datos personales
// sensibles de menores —salud, violencia dentro de casa, ingresos— y una puerta
// abierta no es aceptable para eso.
//
// El expediente se entrega UNA sola vez. El candado es el mismo de siempre: el
// documento se llama como el folio, y las reglas conceden `create` pero nunca
// `update`. Si hay que corregir algo, lo corrige el profesor.

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { correoDeFolio, normalizarFolio } from "./folio.mjs";

export interface Expediente {
  [clave: string]: string | number | string[];
}

/** Entra con el folio que repartió la escuela. */
export async function entrarConFolio(folio: string): Promise<User> {
  await setPersistence(auth(), browserLocalPersistence);
  const limpio = normalizarFolio(folio);
  const cred = await signInWithEmailAndPassword(auth(), correoDeFolio(limpio), limpio);
  return cred.user;
}

export async function salirFolio(): Promise<void> {
  await signOut(auth());
}

export function observarFolio(cb: (u: User | null) => void): () => void {
  return onAuthStateChanged(auth(), cb);
}

/** ¿Esta familia ya entregó? Devuelve el expediente, o null. */
export async function expedientePrevio(uid: string) {
  const snap = await getDoc(doc(db(), "expedientes", uid));
  return snap.exists() ? snap.data() : null;
}

/** El grupo al que la escuela asignó este folio, si lo registró al darlo de alta. */
export async function fichaFolio(uid: string) {
  const snap = await getDoc(doc(db(), "folios", uid));
  return snap.exists() ? snap.data() : null;
}

/**
 * Guarda el expediente. Una sola vez: un segundo envío cae sobre un documento
 * que ya existe y las reglas lo rechazan, igual que en los diagnósticos.
 */
export async function guardarExpediente(
  uid: string,
  respuestas: Expediente,
): Promise<void> {
  try {
    await setDoc(
      doc(db(), "expedientes", uid),
      { folio: uid, ...respuestas, enviado: serverTimestamp() },
      { merge: false },
    );
  } catch (e: any) {
    if (e?.code === "permission-denied") throw new Error("YA_ENTREGADO");
    throw e;
  }
}

/** Traduce los códigos de Firebase a algo que un padre de familia entienda. */
export function mensajeFolio(e: any): string {
  switch (e?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Ese folio no existe. Revísalo bien; si sigue sin funcionar, pídelo de nuevo en la escuela.";
    case "auth/too-many-requests":
      return "Demasiados intentos seguidos. Espera unos minutos y vuelve a probar.";
    case "auth/network-request-failed":
      return "No hay conexión a internet. Revisa tu red e intenta de nuevo.";
    case "auth/user-disabled":
      return "Este folio fue desactivado. Avisa en la escuela.";
    default:
      if (e?.message === "YA_ENTREGADO") {
        return "Este cuestionario ya fue contestado. Si necesitas corregir algo, avisa en la escuela.";
      }
      return "Algo salió mal. Vuelve a intentar; si sigue igual, avisa en la escuela.";
  }
}

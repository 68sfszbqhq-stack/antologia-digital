// Todo lo que el alumno puede hacer contra Firebase: entrar, salir, saber si su
// módulo está abierto y entregar su diagnóstico una única vez.
//
// Nada de lo que hay aquí es la seguridad del sistema. Un alumno puede abrir la
// consola del navegador y llamar estas funciones a mano; lo que se lo impide es
// firestore.rules, del lado del servidor. Esto es solo la puerta de entrada
// amable.

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
import {
  correoDeMatricula,
  matriculaDeCorreo,
  normalizarCodigo,
} from "./matricula.mjs";

export interface Ficha {
  matricula: string;
  nombre: string;
  grupo: string;
  activo: boolean;
}

export interface ResultadoIntento {
  dia: number;
  aciertos: number;
  total: number;
  porcentaje: number;
  porEje: Record<string, { ok: number; total: number }>;
  respuestas: number[];
}

// ─── Entrar y salir ──────────────────────────────────────────────────────────

/**
 * Entra con matrícula y código. El código es la contraseña real ante Firebase,
 * así que quien decide si es correcto es Firebase, no esta página.
 */
export async function entrar(matricula: string, codigo: string): Promise<User> {
  // Persistencia local: el alumno escribe sus datos una sola vez y el navegador
  // lo recuerda para los ocho módulos, incluso si cierra la pestaña.
  await setPersistence(auth(), browserLocalPersistence);
  const cred = await signInWithEmailAndPassword(
    auth(),
    correoDeMatricula(matricula),
    normalizarCodigo(codigo),
  );
  return cred.user;
}

export async function salir(): Promise<void> {
  await signOut(auth());
}

/** Avisa cada vez que cambia quién está identificado. Devuelve cómo dejar de escuchar. */
export function observarSesion(cb: (u: User | null) => void): () => void {
  return onAuthStateChanged(auth(), cb);
}

export function matriculaActual(u: User | null): string {
  return u?.email ? matriculaDeCorreo(u.email) : "";
}

// ─── Datos ───────────────────────────────────────────────────────────────────

export async function fichaDe(uid: string): Promise<Ficha | null> {
  const snap = await getDoc(doc(db(), "alumnos", uid));
  return snap.exists() ? (snap.data() as Ficha) : null;
}

/** Los módulos que el profesor tiene abiertos. Si no hay config, no hay ninguno. */
export async function modulosAbiertos(): Promise<number[]> {
  try {
    const snap = await getDoc(doc(db(), "config", "modulos"));
    const abiertos = snap.exists() ? snap.data().abiertos : null;
    return Array.isArray(abiertos) ? abiertos.map(Number) : [];
  } catch {
    return [];
  }
}

export function idIntento(uid: string, dia: number): string {
  return `${uid}_${dia}`;
}

/** El intento previo de este alumno en este módulo, o null si aún no lo contesta. */
export async function intentoPrevio(uid: string, dia: number) {
  const snap = await getDoc(doc(db(), "intentos", idIntento(uid, dia)));
  return snap.exists() ? snap.data() : null;
}

/**
 * Guarda el diagnóstico.
 *
 * El candado del intento único no está aquí, sino en firestore.rules: como el
 * documento se llama "<uid>_<dia>", un segundo envío cae sobre uno que ya
 * existe, y las reglas solo conceden `create`, nunca `update`. Firestore lo
 * rechaza con permission-denied y aquí se traduce a `YA_CONTESTADO`. Es decir:
 * el bloqueo no depende de que esta página se porte bien.
 */
export async function guardarIntento(
  uid: string,
  r: ResultadoIntento,
): Promise<void> {
  try {
    await setDoc(
      doc(db(), "intentos", idIntento(uid, r.dia)),
      {
        uid,
        dia: r.dia,
        aciertos: r.aciertos,
        total: r.total,
        porcentaje: r.porcentaje,
        porEje: r.porEje,
        respuestas: r.respuestas,
        enviado: serverTimestamp(),
      },
      // Sin mezclar: se escribe el documento completo o no se escribe nada.
      { merge: false },
    );
  } catch (e: any) {
    if (e?.code === "permission-denied") throw new Error("YA_CONTESTADO");
    throw e;
  }
}

// ─── Mensajes para el alumno ─────────────────────────────────────────────────

/** Traduce los códigos de error de Firebase a algo que un alumno entienda. */
export function mensajeDeError(e: any): string {
  switch (e?.code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
    case "auth/invalid-email":
      return "Matrícula o código incorrectos. Revísalos y vuelve a intentar.";
    case "auth/too-many-requests":
      return "Demasiados intentos seguidos. Espera unos minutos y vuelve a probar.";
    case "auth/network-request-failed":
      return "No hay conexión a internet. Revisa tu red e intenta de nuevo.";
    case "auth/user-disabled":
      return "Tu acceso está desactivado. Avísale a tu profesor.";
    default:
      if (e?.message === "YA_CONTESTADO") {
        return "Ya contestaste este módulo. Solo se permite un intento.";
      }
      return "Algo salió mal. Avísale a tu profesor si vuelve a pasar.";
  }
}

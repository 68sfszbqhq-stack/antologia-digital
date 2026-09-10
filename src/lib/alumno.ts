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
import {
  entrarConGoogle as abrirGoogle,
  sesionPorRedireccion,
  esCuentaDeGoogle,
} from "./google-auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import {
  correoDeMatricula,
  matriculaDeCorreo,
  normalizarCodigo,
} from "./matricula.mjs";
import { armarGrupo, limpiarNombre } from "./grupo.mjs";

export interface Ficha {
  matricula: string;
  nombre: string;
  grupo: string;
  activo: boolean;
  /** Correo de Google, cuando entró por ahí. Con matrícula y código no hay. */
  correo?: string;
  /** Cómo se dio de alta: "google" la creó el propio alumno al entrar;
   *  las que hizo el profesor con scripts/alta-alumnos.mjs no traen este campo. */
  origen?: "google";
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

/**
 * Entra con la cuenta de Google, que es el camino normal desde el ciclo
 * 2026-2027.
 *
 * Se prefiere sobre la matrícula y el código por una razón práctica: el alumno
 * ya entró con esa misma cuenta a la evaluación diagnóstica de inicio de ciclo,
 * así que no hay nada que repartir en papel ni códigos que se pierdan. Y cada
 * entrega llega con el correo de quien la hizo, sin depender de que escriba
 * bien su nombre.
 *
 * La entrada con matrícula y código sigue viva (ver `entrar`) para quien no
 * tenga cuenta de Google.
 */
export async function entrarConGoogle(): Promise<User | null> {
  return abrirGoogle();
}

export { sesionPorRedireccion, esCuentaDeGoogle };

/**
 * Los correos que en `firestore.rules` cuentan como profesor.
 *
 * Aquí no dan ningún permiso —los permisos los decide Firestore, no esta
 * página—; sirven para no tratar al profesor como alumno. Sin esto, José entra
 * a revisar un módulo, el sitio no le encuentra ficha y le pide su nombre y su
 * grupo como si fuera de primero; si los llena, aparece en su propia lista de
 * calificaciones. Mantener igual que correosDeProfesor() en firestore.rules.
 */
const CORREOS_DE_PROFESOR = ["jose.mendoza.buap@gmail.com"];

export function esProfesor(u: User | null): boolean {
  const correo = u?.email?.toLowerCase() ?? "";
  return Boolean(correo) && CORREOS_DE_PROFESOR.includes(correo);
}

/**
 * Busca los datos que el alumno ya dejó en la evaluación diagnóstica de inicio
 * de ciclo, para no volvérselos a pedir.
 *
 * Es la razón de que entrar a los módulos no pregunte nada: el alumno ya
 * escribió su nombre, su grado y su grupo una vez, con esta misma cuenta. Aquí
 * solo se copian.
 *
 * Se prueban las primeras aplicaciones porque el documento se llama
 * `<uid>_<aplicación>` y desde el navegador no se puede listar la colección
 * —eso destaparía al grupo entero—, solo pedir un documento por su nombre. Son
 * tres lecturas en el peor caso, y una sola en la práctica.
 *
 * Devuelve null si nunca hizo el diagnóstico; entonces sí hay que preguntarle.
 */
export async function datosDelDiagnostico(
  u: User,
): Promise<{ nombre: string; grupo: string } | null> {
  for (const aplicacion of [1, 2, 3]) {
    try {
      const snap = await getDoc(doc(db(), "diagnosticos", `${u.uid}_${aplicacion}`));
      if (!snap.exists()) continue;
      const d = snap.data();
      if (!d.nombre) continue;
      return { nombre: limpiarNombre(d.nombre), grupo: armarGrupo(d) };
    } catch {
      // Sin permiso o sin conexión: no es motivo para trabar la entrada.
      // Se le acabará preguntando, que es el camino largo pero seguro.
    }
  }
  return null;
}

/**
 * Crea la ficha del propio alumno, con su nombre y su grupo.
 *
 * Sin ficha activa, firestore.rules no deja entregar ningún diagnóstico: esa es
 * justamente la regla que impide que cualquiera con una cuenta de Google mande
 * calificaciones. Al abrir los módulos a Google, la ficha ya no la crea solo el
 * profesor desde su Mac; también puede crearla el propio alumno la primera vez,
 * y por eso las reglas validan lo que escribe —y exigen que el correo sea de
 * verdad el suyo, no uno que haya tecleado.
 *
 * El profesor puede corregirla o desactivarla después desde el panel.
 */
export async function crearMiFicha(
  u: User,
  nombre: string,
  grupo: string,
): Promise<Ficha> {
  const ficha: Ficha = {
    matricula: "",
    nombre: nombre.trim().replace(/\s+/g, " "),
    grupo: grupo.trim(),
    activo: true,
    correo: u.email ?? "",
    origen: "google",
  };
  await setDoc(doc(db(), "alumnos", u.uid), ficha, { merge: false });
  return ficha;
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
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Se cerró la ventana de Google antes de terminar. Vuelve a tocar el botón.";
    case "auth/account-exists-with-different-credential":
      return "Esa cuenta ya se usó de otra forma. Avísale a tu profesor.";
    case "auth/unauthorized-domain":
      return "Este sitio todavía no está autorizado para entrar con Google. Avísale a tu profesor.";
    case "auth/operation-not-allowed":
      return "La entrada con Google no está habilitada. Avísale a tu profesor.";
    default:
      if (e?.message === "YA_CONTESTADO") {
        return "Ya contestaste este módulo. Solo se permite un intento.";
      }
      return "Algo salió mal. Avísale a tu profesor si vuelve a pasar.";
  }
}

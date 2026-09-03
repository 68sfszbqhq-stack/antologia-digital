// El diagnóstico integral: una sola sesión que encadena ficha → atención →
// temperamento → evaluación académica del grado.
//
// SE ENTRA CON CUENTA DE GOOGLE, y eso cambia tres cosas de fondo respecto al
// test de Landolt suelto (`/landolt`), que sigue entrando sin cuenta:
//
//   1. RASTREABLE. Cada entrega trae el correo de quien la hizo. No hay que
//      confiar en que el alumno escriba bien su nombre.
//   2. SE PUEDE RETOMAR. El documento se llama `<uid>_<aplicación>`, así que al
//      volver a entrar —el mismo día o tres días después, en otro aparato— el
//      sitio encuentra lo que ya llevaba y lo continúa donde se quedó.
//   3. NO HACE FALTA VIGILAR EL INTERRUPTOR. Con acceso anónimo, dejar la
//      evaluación abierta significaba que cualquiera con el enlace podía mandar
//      basura. Con Google, quien entra queda identificado; se puede dejar
//      abierta toda la semana de aplicación sin sobresaltos.
//
// SE GUARDA CONFORME AVANZA, no al final. Es la diferencia entre perder cuarenta
// minutos por un celular que se apagó y perder treinta segundos. El precio es
// que las reglas tienen que permitir `update`, cosa que en el resto del sitio se
// evita a propósito; el candado aquí es otro: en cuanto el documento queda en
// `entregado`, las reglas dejan de aceptar cambios. O sea, se puede corregir lo
// que aún no se entrega, y nada más.

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User,
} from "firebase/auth";
import {
  doc, getDoc, setDoc, updateDoc, serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "./firebase";

/** Los datos del alumno. Solo lo que hace falta para leer sus resultados: sin
 *  CURP, sin teléfono y sin dirección, a propósito. Lo sensible se recoge en el
 *  cuestionario de familias, que entra con folio. */
export interface FichaDiagnostico {
  nombre: string;
  nacimiento: string; // AAAA-MM-DD
  genero: string;
  grado: "1ero" | "2do" | "3ero";
  grupo: string;
  turno: string;
  procedencia: string;
}

export interface AjustesDiagnostico {
  abierta: number;
  /** Qué bloques pide esta aplicación. El profesor puede dejar solo los que
   *  necesite; el orden en pantalla no cambia. */
  bloques: { atencion: boolean; temperamento: boolean; academica: boolean };
  /** Configuración del test de atención, idéntica a la de `/landolt`. */
  objetivo: number;
  duracion: number;
  semilla: number;
  tamano: "chico" | "medio" | "grande";
}

const POR_OMISION: AjustesDiagnostico = {
  abierta: 0,
  bloques: { atencion: true, temperamento: true, academica: true },
  objetivo: 6,
  duracion: 300,
  semilla: 20260101,
  tamano: "medio",
};

// ─── Entrar y salir ──────────────────────────────────────────────────────────

/**
 * ¿Estamos dentro del navegador de una app (WhatsApp, Instagram, Facebook,
 * TikTok)? Ahí las ventanas emergentes sencillamente no abren, así que ni se
 * intenta: se va derecho por redirección.
 *
 * Importa porque el enlace de esta evaluación se reparte justamente por
 * WhatsApp, y lo natural es tocarlo ahí mismo.
 */
function dentroDeUnaApp(): boolean {
  const ua = navigator.userAgent || "";
  return /FBAN|FBAV|Instagram|Line|WhatsApp|TikTok|MicroMessenger|; wv\)/i.test(ua);
}

function proveedorGoogle(): GoogleAuthProvider {
  const p = new GoogleAuthProvider();
  // Que siempre pregunte cuál cuenta: en un salón es normal que varios alumnos
  // usen la misma computadora, y sin esto el segundo entraría como el primero.
  p.setCustomParameters({ prompt: "select_account" });
  return p;
}

/**
 * Entra con Google. Dos caminos, y hacen falta los dos.
 *
 *   · VENTANA EMERGENTE. Es la buena donde funciona: no recarga la página y no
 *     depende de cookies de terceros, que Chrome nuevo ya bloquea.
 *   · REDIRECCIÓN. Manda al alumno a Google y lo trae de vuelta. Es la que
 *     salva a los teléfonos viejos y a quien abrió el enlace dentro de WhatsApp,
 *     donde la emergente ni siquiera abre.
 *
 * Se intenta la emergente primero y, si el navegador la bloquea o no la
 * soporta, se cae a la redirección sin decirle nada al alumno: para él es el
 * mismo botón. Cuando `signInWithRedirect` toma el control, esta función ya no
 * regresa —la página se va—, y la sesión se recoge al volver con
 * `sesionPorRedireccion()`.
 */
export async function entrarConGoogle(): Promise<User | null> {
  // Persistencia local: el alumno entra una vez y el navegador lo recuerda,
  // que es lo que permite retomar sin volver a identificarse.
  await setPersistence(auth(), browserLocalPersistence);

  if (dentroDeUnaApp()) {
    await signInWithRedirect(auth(), proveedorGoogle());
    return null; // la página se va; no hay nada que devolver
  }

  try {
    const cred = await signInWithPopup(auth(), proveedorGoogle());
    return cred.user;
  } catch (e: any) {
    const codigo = e?.code ?? "";
    const laVentanaNoSirve =
      codigo === "auth/popup-blocked" ||
      codigo === "auth/operation-not-supported-in-this-environment" ||
      codigo === "auth/web-storage-unsupported" ||
      codigo === "auth/internal-error";
    if (!laVentanaNoSirve) throw e; // p. ej. el alumno la cerró a propósito

    await signInWithRedirect(auth(), proveedorGoogle());
    return null;
  }
}

/**
 * Recoge la sesión de quien volvió de Google por redirección.
 *
 * Hay que llamarla al cargar la página, siempre: si el alumno no venía de una
 * redirección devuelve null y no pasa nada. Sin esto, quien entró por ese camino
 * volvería a la página y parecería que no entró.
 */
export async function sesionPorRedireccion(): Promise<User | null> {
  try {
    const cred = await getRedirectResult(auth());
    return cred?.user ?? null;
  } catch {
    // Si falla, `observarDiagnostico` acabará avisando igual cuando haya sesión.
    return null;
  }
}

/** Cierra la sesión. Sirve para el "No soy yo": en un salón es normal que varios
 *  alumnos usen la misma computadora, y sin esto el segundo entraría como el
 *  primero. Cierra la única sesión que hay, sea cual sea. */
export async function salirDiagnostico(): Promise<void> {
  await signOut(auth());
}

/**
 * ¿Esta sesión de Firebase sirve para el diagnóstico?
 *
 * TODO EL SITIO COMPARTE LA MISMA SESIÓN DE FIREBASE, y las otras puertas
 * entran de otra forma: `/landolt` abre una sesión anónima y `/expediente` una
 * con folio (que ante Firebase es un correo y una contraseña de verdad). Si un
 * alumno hizo el test de atención hace un rato, o un papá contestó el
 * cuestionario en esa misma computadora, al llegar aquí Firebase diría que "ya
 * hay alguien identificado" y no lo hay: no es una cuenta de Google, no trae
 * correo real y las reglas rechazarían el documento con un error que nadie
 * entendería.
 *
 * Así que aquí solo cuenta quien entró con Google. Cualquier otra sesión se
 * trata como si no hubiera nadie, y se le pide entrar.
 */
function esCuentaDeGoogle(u: User | null): boolean {
  return Boolean(
    u && !u.isAnonymous && u.providerData.some((p) => p.providerId === "google.com"),
  );
}

/** Avisa cada vez que cambia quién está identificado CON GOOGLE. Devuelve cómo
 *  dejar de escuchar. */
export function observarDiagnostico(cb: (u: User | null) => void): () => void {
  return onAuthStateChanged(auth(), (u) => cb(esCuentaDeGoogle(u) ? u : null));
}

// ─── Configuración ───────────────────────────────────────────────────────────

/**
 * Lee la configuración que dejó el profesor. Si no hay documento o la lectura
 * falla, devuelve CERRADO: ante la duda, nadie entrega.
 */
export async function ajustesDiagnostico(): Promise<AjustesDiagnostico> {
  try {
    const snap = await getDoc(doc(db(), "config", "diagnostico"));
    if (!snap.exists()) return POR_OMISION;
    const d = snap.data();
    const entero = (v: unknown, x: number) =>
      Number.isInteger(Number(v)) ? Number(v) : x;
    const b = d.bloques ?? {};
    return {
      abierta: Math.max(0, entero(d.abierta, 0)),
      bloques: {
        atencion: b.atencion !== false,
        temperamento: b.temperamento !== false,
        academica: b.academica !== false,
      },
      objetivo: Math.min(8, Math.max(1, entero(d.objetivo, POR_OMISION.objetivo))),
      duracion: entero(d.duracion, POR_OMISION.duracion),
      semilla: entero(d.semilla, POR_OMISION.semilla),
      tamano: ["chico", "medio", "grande"].includes(d.tamano) ? d.tamano : "medio",
    };
  } catch {
    return POR_OMISION;
  }
}

// ─── La sesión del alumno ────────────────────────────────────────────────────

export interface BloqueAtencion {
  objetivo: number; semilla: number;
  N: number; CA: number; CT: number; falsos: number; omisiones: number;
  n: number; T: number; S: number; IA: number;
  variante: "1min" | "5min";
}

export interface BloqueTemperamento {
  puntos: Record<string, number>;
  porcentaje: Record<string, number>;
  dominante: string;
  secundario: string;
  empatado: boolean;
  respuestas: Record<string, number>;
}

export interface BloqueAcademica {
  grado: string;
  aciertos: number;
  total: number;
  porcentaje: number;
  materias: Record<string, { nombre: string; ok: number; total: number }>;
  respuestas: Record<string, string>;
}

/** Primer año no contesta materias tecleadas, sino el cuadernillo oficial en
 *  PDF. No lleva calificación: ese cuadernillo no trae clave de respuestas, así
 *  que aquí solo se guarda lo que marcó. La clave la aplica el profesor
 *  después, con scripts/exportar-diagnostico.mjs. */
export interface BloqueCuadernillo {
  cuadernillo: string;
  total: number;
  contestadas: number;
  respuestas: Record<string, string>;
  porSeccion?: Record<string, { nombre: string; total: number; contestadas: number }>;
}

export interface SesionDiagnostico {
  aplicacion: number;
  uid: string;
  correo: string;
  estado: "en curso" | "entregado";
  nombre: string;
  nacimiento: string;
  genero: string;
  grado: string;
  grupo: string;
  turno: string;
  procedencia: string;
  atencion: BloqueAtencion | null;
  temperamento: BloqueTemperamento | null;
  academica: BloqueAcademica | null;
  cuadernillo: BloqueCuadernillo | null;
}

/** El documento se llama así para que sea el MISMO cada vez que el alumno
 *  vuelve. De ahí sale todo lo de retomar. */
export function idSesion(uid: string, aplicacion: number): string {
  return `${uid}_${aplicacion}`;
}

/** Lo que este alumno lleva de esta aplicación, o null si es su primera vez. */
export async function sesionPrevia(
  uid: string,
  aplicacion: number,
): Promise<SesionDiagnostico | null> {
  const snap = await getDoc(doc(db(), "diagnosticos", idSesion(uid, aplicacion)));
  return snap.exists() ? (snap.data() as SesionDiagnostico) : null;
}

/**
 * Abre la sesión al terminar la ficha. A partir de aquí ya hay algo guardado:
 * si el alumno cierra la pestaña en el minuto siguiente, al volver lo encuentra.
 */
export async function abrirSesion(
  u: User,
  aplicacion: number,
  ficha: FichaDiagnostico,
): Promise<void> {
  await setDoc(
    doc(db(), "diagnosticos", idSesion(u.uid, aplicacion)),
    {
      aplicacion,
      uid: u.uid,
      correo: u.email ?? "",
      estado: "en curso",
      nombre: ficha.nombre,
      nacimiento: ficha.nacimiento,
      genero: ficha.genero,
      grado: ficha.grado,
      grupo: ficha.grupo,
      turno: ficha.turno,
      procedencia: ficha.procedencia,
      atencion: null,
      temperamento: null,
      academica: null,
      cuadernillo: null,
      iniciado: serverTimestamp(),
      actualizado: serverTimestamp(),
    },
    { merge: false },
  );
}

/**
 * Guarda un avance parcial. Se llama al terminar cada bloque y, durante el
 * cuadernillo de primer año, cada pocos segundos mientras contesta.
 *
 * No revienta si falla: un guardado intermedio que no llegó se vuelve a
 * intentar en el siguiente. Lo que no puede fallar en silencio es la entrega,
 * y esa sí avisa.
 */
export async function guardarAvance(
  uid: string,
  aplicacion: number,
  parche: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db(), "diagnosticos", idSesion(uid, aplicacion)), {
    ...parche,
    actualizado: serverTimestamp(),
  });
}

/**
 * Cierra la sesión: la marca como entregada. A partir de este momento las
 * reglas dejan de aceptar cambios, así que es el punto de no retorno.
 */
export async function entregarSesion(
  uid: string,
  aplicacion: number,
  parche: Record<string, unknown> = {},
): Promise<void> {
  await updateDoc(doc(db(), "diagnosticos", idSesion(uid, aplicacion)), {
    ...parche,
    estado: "entregado",
    actualizado: serverTimestamp(),
    entregado: serverTimestamp(),
  });
}

/** Traduce los errores de Firebase a algo que un alumno entienda. */
export function mensajeDiagnostico(e: any): string {
  switch (e?.code) {
    case "auth/popup-blocked":
      return "Tu navegador bloqueó la ventana de Google. Vuelve a tocar el botón: esta vez te va a mandar a Google y te va a regresar aquí.";
    case "auth/web-storage-unsupported":
      return "Tu navegador tiene bloqueadas las cookies y sin eso no se puede entrar. Actívalas en los ajustes, o abre esta página fuera del modo privado.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Cerraste la ventana de Google antes de terminar. Vuelve a intentarlo.";
    case "auth/unauthorized-domain":
      return "Este sitio todavía no está autorizado en Firebase. Avísale a tu profesor.";
    case "auth/operation-not-allowed":
      return "Falta activar el acceso con Google en Firebase. Avísale a tu profesor.";
    case "auth/network-request-failed":
    case "unavailable":
      return "No hay conexión a internet. Lo que llevas está guardado en este aparato; vuelve a entrar cuando tengas señal.";
    case "permission-denied":
      return "El profesor cerró la evaluación. Descarga tu resultado y entrégaselo.";
    case "not-found":
      return "No encontré tu sesión. Vuelve a entrar.";
    default:
      return e?.message ? `Algo salió mal (${e.message}).` : "Algo salió mal.";
  }
}

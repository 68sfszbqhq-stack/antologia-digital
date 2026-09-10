// Entrar con la cuenta de Google. Vive aparte porque lo usan dos puertas
// distintas del sitio y tienen que comportarse igual:
//
//   · La evaluación diagnóstica de inicio de ciclo (`/diagnostico`).
//   · El diagnóstico de cada módulo de la antología (`/sesion/N`).
//
// Antes esto vivía dentro de diagnostico.ts. Se sacó aquí al abrir los módulos
// a la cuenta de Google, para no tener dos copias de la misma lógica de
// ventana-emergente-o-redirección: es justo la parte que más se rompe en
// teléfonos viejos, y arreglarla en un solo lugar vale el archivo extra.

import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  setPersistence,
  browserLocalPersistence,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";

/**
 * ¿Estamos dentro del navegador de una app (WhatsApp, Instagram, Facebook,
 * TikTok)? Ahí las ventanas emergentes sencillamente no abren, así que ni se
 * intenta: se va derecho por redirección.
 *
 * Importa porque los enlaces de este sitio se reparten justamente por WhatsApp,
 * y lo natural es tocarlos ahí mismo.
 */
export function dentroDeUnaApp(): boolean {
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
  // que es lo que permite seguir en los demás módulos sin volver a entrar.
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
    // Si falla, el observador de sesión acabará avisando igual cuando la haya.
    return null;
  }
}

/**
 * ¿Esta sesión de Firebase es una cuenta de Google de verdad?
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
 * Así que donde se pide Google, cualquier otra sesión se trata como si no
 * hubiera nadie.
 */
export function esCuentaDeGoogle(u: User | null): boolean {
  return Boolean(
    u && !u.isAnonymous && u.providerData.some((p) => p.providerId === "google.com"),
  );
}

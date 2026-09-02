// Lo que necesita el Test de los Anillos de Landolt para funcionar sin cuentas.
//
// A diferencia de los diagnósticos de los módulos, este test lo aplican alumnos
// de bachillerato de nuevo ingreso que TODAVÍA NO tienen usuario ni código: se
// registran en el momento, con un formulario, y empiezan. Por eso aquí no
// aparece `alumnoActivo` por ningún lado.
//
// Cómo se sostiene entonces la seguridad, ya que no hay contraseña:
//
//   1. El test tiene que estar ABIERTO. Lo abre y lo cierra el profesor con
//      scripts/abrir-landolt.mjs. Cerrado, las reglas rechazan toda escritura.
//   2. Se entra con una sesión anónima de Firebase. No identifica a nadie, pero
//      obliga a pasar por Firebase y permite que las reglas exijan `request.auth`.
//   3. Las reglas validan que los conteos cuadren entre sí.
//
// Esto NO es a prueba de todo: mientras el test esté abierto, quien tenga el
// enlace puede mandar un registro. Es una compensación deliberada a cambio de
// que un grupo entero entre en treinta segundos sin repartir contraseñas. La
// contramedida real es cerrarlo al terminar la sesión.
//
// Nada de esto sustituye la supervisión: ninguna regla puede saber si el alumno
// estaba mirando la pantalla. Es una prueba que se aplica en clase, vigilada.

import { signInAnonymously } from "firebase/auth";
import { addDoc, collection, doc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

/** Ficha del alumno de nuevo ingreso. Solo lo que sirve para leer el resultado
 *  del test: sin CURP, sin teléfono y sin dirección, a propósito. */
export interface FichaNuevoIngreso {
  nombre: string;
  nacimiento: string; // AAAA-MM-DD
  genero: string;
  semestre: number;
  grupo: string;
  turno: string;
  procedencia: string;
}

/** Cómo queda configurada la prueba para todo el grupo. */
export interface AjustesLandolt {
  abierta: number;
  objetivo: number;
  duracion: number;
  semilla: number;
  tamano: "chico" | "medio" | "grande";
}

export interface ResultadoLandolt {
  objetivo: number;
  semilla: number;
  N: number;
  CA: number;
  CT: number;
  falsos: number;
  omisiones: number;
  n: number;
  T: number;
  S: number;
  IA: number;
  variante: "1min" | "5min";
  curva: { minuto: number; N: number; n: number; CA: number; CT: number; S: number }[];
}

const POR_OMISION: AjustesLandolt = {
  abierta: 0,
  objetivo: 6,
  duracion: 300,
  semilla: 20260101,
  tamano: "medio",
};

/**
 * Lee la configuración que dejó el profesor. Si no hay documento, o si la
 * lectura falla, devuelve el test CERRADO: ante la duda, nadie entrega.
 */
export async function ajustesLandolt(): Promise<AjustesLandolt> {
  try {
    const snap = await getDoc(doc(db(), "config", "landolt"));
    if (!snap.exists()) return POR_OMISION;
    const d = snap.data();
    const entero = (v: unknown, x: number) =>
      Number.isInteger(Number(v)) ? Number(v) : x;
    return {
      abierta: Math.max(0, entero(d.abierta, 0)),
      objetivo: Math.min(8, Math.max(1, entero(d.objetivo, POR_OMISION.objetivo))),
      duracion: entero(d.duracion, POR_OMISION.duracion),
      semilla: entero(d.semilla, POR_OMISION.semilla),
      tamano: ["chico", "medio", "grande"].includes(d.tamano) ? d.tamano : "medio",
    };
  } catch {
    return POR_OMISION;
  }
}

/** Sesión anónima. No pide nada al alumno y no lo identifica: solo sirve para
 *  que las reglas tengan un `request.auth` al que agarrarse. */
export async function entrarAnonimo(): Promise<string> {
  const cred = await signInAnonymously(auth());
  return cred.user.uid;
}

/**
 * Guarda el resultado. El identificador del documento lo pone Firestore: sin
 * cuentas no hay nada estable con qué nombrarlo, así que el candado de "una
 * sola vez" no puede vivir aquí. Contra las entregas repetidas por accidente
 * está la marca en el navegador (ver el componente); contra las repetidas a
 * propósito, la supervisión en el salón.
 */
export async function guardarLandolt(
  aplicacion: number,
  ficha: FichaNuevoIngreso,
  r: ResultadoLandolt,
): Promise<string> {
  const ref = await addDoc(collection(db(), "landolt"), {
    aplicacion,
    nombre: ficha.nombre,
    nacimiento: ficha.nacimiento,
    genero: ficha.genero,
    semestre: ficha.semestre,
    grupo: ficha.grupo,
    turno: ficha.turno,
    procedencia: ficha.procedencia,
    objetivo: r.objetivo,
    semilla: r.semilla,
    N: r.N,
    CA: r.CA,
    CT: r.CT,
    falsos: r.falsos,
    omisiones: r.omisiones,
    n: r.n,
    T: r.T,
    S: r.S,
    IA: r.IA,
    variante: r.variante,
    curva: r.curva,
    enviado: serverTimestamp(),
  });
  return ref.id;
}

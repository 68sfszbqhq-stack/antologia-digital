// Votaciones en vivo y quizzes del Máster en Comunicación Consciente
// (introducción de Lengua y Comunicación).
//
// Cómo se sincroniza la clase, sin servidor propio:
//
//   · El profesor, desde la presentación, escribe en `config/lyc` qué pregunta
//     está abierta (`activa`) y qué quizzes se pueden contestar (`quizzes`).
//   · El celular de cada alumno escucha ese documento y cambia de pantalla solo.
//   · Cada voto es un documento en `lyc_votos`; la presentación los cuenta en
//     vivo. Solo el profesor puede listarlos, así que las barras solo aparecen
//     en su pantalla (la del proyector).
//
// `activa` no es solo el id de la pregunta: lleva una "ronda" pegada
// ("s1-kross@lx3k9a"). Así, si el profesor da la misma sesión a otro grupo, los
// votos de un grupo no se suman a los del otro, y el alumno puede votar de
// nuevo si la pregunta se vuelve a abrir.
//
// Como en alumno.ts, nada de esto es la seguridad: la ponen las reglas de
// firestore.rules (un voto por alumno y ronda, solo en la pregunta abierta; un
// intento por quiz, solo con el quiz abierto).

import {
  doc, getDoc, setDoc, onSnapshot, collection, query, where,
  serverTimestamp, arrayUnion, arrayRemove, type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";

export interface ConfigLyc {
  /** "<idPregunta>@<ronda>", o "" si no hay votación abierta. */
  activa: string;
  quizzes: number[];
}

const CONFIG = () => doc(db(), "config", "lyc");

export function idDePregunta(activa: string): string {
  return activa.split("@")[0] ?? "";
}

/** Avisa cada vez que el profesor abre o cierra algo. */
export function observarConfig(cb: (c: ConfigLyc) => void, alFallar?: (e: unknown) => void): Unsubscribe {
  return onSnapshot(
    CONFIG(),
    (snap) => {
      const d = snap.exists() ? snap.data() : {};
      cb({
        activa: typeof d.activa === "string" ? d.activa : "",
        quizzes: Array.isArray(d.quizzes) ? d.quizzes.map(Number) : [],
      });
    },
    (e) => alFallar?.(e),
  );
}

// ─── Lo que hace el profesor ─────────────────────────────────────────────────

/** Abre la votación de una pregunta con una ronda nueva. Devuelve la clave de la ronda. */
export async function abrirVotacion(idPregunta: string): Promise<string> {
  const clave = `${idPregunta}@${Date.now().toString(36)}`;
  await setDoc(CONFIG(), { activa: clave }, { merge: true });
  return clave;
}

export async function cerrarVotacion(): Promise<void> {
  await setDoc(CONFIG(), { activa: "" }, { merge: true });
}

export async function abrirQuiz(n: number): Promise<void> {
  await setDoc(CONFIG(), { quizzes: arrayUnion(n) }, { merge: true });
}

export async function cerrarQuiz(n: number): Promise<void> {
  await setDoc(CONFIG(), { quizzes: arrayRemove(n) }, { merge: true });
}

/** Cuenta en vivo los votos de una ronda, por opción. */
export function observarVotos(
  clave: string,
  opciones: number,
  cb: (conteo: number[], total: number) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db(), "lyc_votos"), where("pregunta", "==", clave)),
    (snap) => {
      const conteo = Array(opciones).fill(0);
      for (const d of snap.docs) {
        const o = d.data().opcion;
        if (Number.isInteger(o) && o >= 0 && o < opciones) conteo[o]++;
      }
      cb(conteo, snap.size);
    },
  );
}

/** Cuántos alumnos entregaron hoy un quiz. Hoy, y no en total, para que el
 *  contador sea el del grupo que está en el salón y no el de toda la semana. */
export function observarEntregasDeHoy(n: number, cb: (cuantos: number) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db(), "lyc_quizzes"), where("quiz", "==", n)),
    (snap) => {
      const hoy = new Date().toDateString();
      cb(snap.docs.filter((d) => d.data().enviado?.toDate?.().toDateString() === hoy).length);
    },
  );
}

// ─── Lo que hace el alumno ───────────────────────────────────────────────────

export async function miVoto(uid: string, clave: string): Promise<number | null> {
  const snap = await getDoc(doc(db(), "lyc_votos", `${uid}_${clave}`));
  return snap.exists() ? (snap.data().opcion as number) : null;
}

export async function votar(uid: string, clave: string, opcion: number): Promise<void> {
  await setDoc(
    doc(db(), "lyc_votos", `${uid}_${clave}`),
    { uid, pregunta: clave, opcion, enviado: serverTimestamp() },
    { merge: false },
  );
}

export interface ResultadoQuiz {
  quiz: number;
  aciertos: number;
  total: number;
  porcentaje: number;
  respuestas: number[];
}

export async function quizPrevio(uid: string, n: number): Promise<ResultadoQuiz | null> {
  const snap = await getDoc(doc(db(), "lyc_quizzes", `${uid}_${n}`));
  return snap.exists() ? (snap.data() as ResultadoQuiz) : null;
}

/** Un solo intento: el documento se llama "<uid>_<quiz>" y las reglas solo
 *  permiten crearlo. Un segundo envío lo rechaza Firestore, no esta página. */
export async function guardarQuiz(uid: string, r: ResultadoQuiz): Promise<void> {
  try {
    await setDoc(
      doc(db(), "lyc_quizzes", `${uid}_${r.quiz}`),
      { uid, ...r, enviado: serverTimestamp() },
      { merge: false },
    );
  } catch (e: any) {
    if (e?.code === "permission-denied") throw new Error("QUIZ_RECHAZADO");
    throw e;
  }
}

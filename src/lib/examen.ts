// Exámenes de parcial: lo que el alumno y el profesor hacen contra Firebase.
//
// Cada alumno tiene UN documento por examen en /examenes, llamado
// "<uid>_<examen>". Su vida es corta y de un solo sentido:
//
//   1. Al tocar "Empezar" se CREA con estado "en curso" y la hora del servidor.
//      Desde ese momento ya gastó su intento: recargar no le da otro.
//   2. Se cierra UNA vez, con sus respuestas: "entregado" (lo envió o se le
//      acabó el tiempo) o "cancelado" (salió de la página).
//   3. Si fue cancelado, al volver se anota la hora de regreso, para que el
//      profesor vea cuánto tiempo estuvo fuera y decida si le borra el intento.
//
// Como en alumno.ts, esto es solo la puerta amable: quien impide un segundo
// intento, una entrega fuera de tiempo o escribir en el examen de otro es
// firestore.rules.

import {
  doc, getDoc, setDoc, updateDoc, deleteDoc, onSnapshot, collection, query, where,
  serverTimestamp, deleteField, arrayUnion, arrayRemove, type Timestamp, type Unsubscribe,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Ficha } from "./alumno";

export type Estado = "en curso" | "entregado" | "cancelado";

export interface RegistroExamen {
  uid: string;
  nombre: string;
  grupo: string;
  examen: string;
  estado: Estado;
  inicio: Timestamp | null;
  fin?: Timestamp | null;
  regreso?: Timestamp | null;
  /** Por qué se cerró: "enviado", "tiempo", "salió de la página", "recargó la página"… */
  motivo?: string;
  respuestas?: Record<string, string>;
  /** Lo que pone el profesor: puntos de cada pregunta de texto (0, 1 o 2). */
  puntos?: Record<string, number>;
}

const CONFIG = () => doc(db(), "config", "examenes");
const REGISTRO = (uid: string, examen: string) => doc(db(), "examenes", `${uid}_${examen}`);

// ─── Alumno ──────────────────────────────────────────────────────────────────

export async function examenAbierto(examen: string): Promise<boolean> {
  const snap = await getDoc(CONFIG());
  const abiertos = snap.exists() ? snap.data().abiertos : null;
  return Array.isArray(abiertos) && abiertos.includes(examen);
}

export async function miRegistro(uid: string, examen: string): Promise<RegistroExamen | null> {
  const snap = await getDoc(REGISTRO(uid, examen));
  return snap.exists() ? (snap.data() as RegistroExamen) : null;
}

/** Gasta el intento. Si ya existía, Firestore lo rechaza: no hay segundo inicio. */
export async function iniciar(uid: string, ficha: Ficha, examen: string): Promise<void> {
  await setDoc(
    REGISTRO(uid, examen),
    { uid, nombre: ficha.nombre, grupo: ficha.grupo, examen, estado: "en curso", inicio: serverTimestamp() },
    { merge: false },
  );
}

export async function cerrar(
  uid: string,
  examen: string,
  estado: "entregado" | "cancelado",
  motivo: string,
  respuestas: Record<string, string>,
): Promise<void> {
  await updateDoc(REGISTRO(uid, examen), { estado, motivo, respuestas, fin: serverTimestamp() });
}

export async function anotarRegreso(uid: string, examen: string): Promise<void> {
  await updateDoc(REGISTRO(uid, examen), { regreso: serverTimestamp() });
}

// ─── Profesor ────────────────────────────────────────────────────────────────

export function observarAbiertos(cb: (abiertos: string[]) => void): Unsubscribe {
  return onSnapshot(CONFIG(), (s) => {
    const a = s.exists() ? s.data().abiertos : null;
    cb(Array.isArray(a) ? a : []);
  });
}

export async function abrir(examen: string, si: boolean): Promise<void> {
  await setDoc(CONFIG(), { abiertos: si ? arrayUnion(examen) : arrayRemove(examen) }, { merge: true });
}

export function observarRegistros(
  examen: string,
  cb: (lista: (RegistroExamen & { id: string })[]) => void,
  alFallar: (e: unknown) => void,
): Unsubscribe {
  return onSnapshot(
    query(collection(db(), "examenes"), where("examen", "==", examen)),
    (s) => cb(s.docs.map((d) => ({ id: d.id, ...(d.data() as RegistroExamen) }))),
    alFallar,
  );
}

export async function ponerPuntos(id: string, pregunta: string, puntos: number | null): Promise<void> {
  await updateDoc(doc(db(), "examenes", id), {
    [`puntos.${pregunta}`]: puntos === null ? deleteField() : puntos,
  });
}

/** Borra el intento para que el alumno pueda volver a hacer el examen. */
export async function borrarIntento(id: string): Promise<void> {
  await deleteDoc(doc(db(), "examenes", id));
}

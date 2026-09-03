// El test vocacional CHASIDE, en su propia colección.
//
// Mismo patrón que src/lib/perfil.ts y por la misma razón: los instrumentos van
// llegando de uno en uno, y un alumno que ya entregó lo anterior tiene que poder
// contestar lo nuevo sin que se descongele nada de lo entregado. Cada
// instrumento con su documento y su propio ciclo de vida.

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";

export function idVocacional(uid: string, aplicacion: number): string {
  return `${uid}_${aplicacion}`;
}

export async function vocacionalPrevio(uid: string, aplicacion: number) {
  const snap = await getDoc(doc(db(), "vocacional", idVocacional(uid, aplicacion)));
  return snap.exists() ? snap.data() : null;
}

export async function abrirVocacional(
  u: User,
  aplicacion: number,
  ficha: { nombre: string; grado: string; grupo: string },
): Promise<void> {
  await setDoc(
    doc(db(), "vocacional", idVocacional(u.uid, aplicacion)),
    {
      aplicacion,
      uid: u.uid,
      correo: u.email ?? "",
      estado: "en curso",
      nombre: ficha.nombre,
      grado: ficha.grado,
      grupo: ficha.grupo,
      respuestas: {},
      iniciado: serverTimestamp(),
      actualizado: serverTimestamp(),
    },
    { merge: false },
  );
}

export async function guardarAvanceVocacional(
  uid: string,
  aplicacion: number,
  parche: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db(), "vocacional", idVocacional(uid, aplicacion)), {
    ...parche,
    actualizado: serverTimestamp(),
  });
}

export async function entregarVocacional(
  uid: string,
  aplicacion: number,
  resultado: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db(), "vocacional", idVocacional(uid, aplicacion)), {
    ...resultado,
    estado: "entregado",
    actualizado: serverTimestamp(),
    entregado: serverTimestamp(),
  });
}

// El perfil del alumno: diagnóstico socioemocional y condiciones de estudio.
//
// POR QUÉ VIVE EN SU PROPIO DOCUMENTO Y NO DENTRO DE `diagnosticos`.
//
// Cuando un alumno entrega su evaluación, el documento queda congelado: las
// reglas dejan de aceptar cambios. Eso es deliberado y no se va a aflojar, es
// lo que impide que alguien vuelva a abrir el test de atención —que solo mide
// bien la primera vez— y lo repita.
//
// Pero este bloque llegó DESPUÉS, y los 41 alumnos que ya entregaron tienen que
// poder contestarlo. Meterlo en el mismo documento obligaría a descongelarlo, y
// con eso se abriría también todo lo demás. Así que va aparte, con su propio
// ciclo de vida: el alumno entra con la misma cuenta de Google, ve una sección
// nueva en su perfil y la contesta, sin que nada de lo de ayer se toque.
//
// Se llama `<uid>_<aplicación>` por la misma razón de siempre: para que al
// volver a entrar se caiga sobre el mismo documento y se pueda retomar.

import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { User } from "firebase/auth";

export interface Perfil {
  aplicacion: number;
  uid: string;
  correo: string;
  estado: "en curso" | "entregado";
  nombre: string;
  grado: string;
  grupo: string;
  puntajes: Record<string, unknown>;
  banderas: { id: string; color: string; motivo: string }[];
  respuestasA: Record<string, number>;
  respuestasB: Record<string, string | number>;
  respuestasApoyo: Record<string, number>;
}

export function idPerfil(uid: string, aplicacion: number): string {
  return `${uid}_${aplicacion}`;
}

/** Lo que este alumno lleva de su perfil, o null si no ha empezado. */
export async function perfilPrevio(uid: string, aplicacion: number) {
  const snap = await getDoc(doc(db(), "perfiles", idPerfil(uid, aplicacion)));
  return snap.exists() ? snap.data() : null;
}

/** Abre el perfil en cuanto empieza, para que se pueda retomar desde el minuto uno. */
export async function abrirPerfil(
  u: User,
  aplicacion: number,
  ficha: { nombre: string; grado: string; grupo: string },
): Promise<void> {
  await setDoc(
    doc(db(), "perfiles", idPerfil(u.uid, aplicacion)),
    {
      aplicacion,
      uid: u.uid,
      correo: u.email ?? "",
      estado: "en curso",
      nombre: ficha.nombre,
      grado: ficha.grado,
      grupo: ficha.grupo,
      respuestasA: {},
      respuestasB: {},
      respuestasApoyo: {},
      iniciado: serverTimestamp(),
      actualizado: serverTimestamp(),
    },
    { merge: false },
  );
}

/** Guarda lo que lleva contestado, sin cerrar nada. */
export async function guardarAvancePerfil(
  uid: string,
  aplicacion: number,
  parche: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db(), "perfiles", idPerfil(uid, aplicacion)), {
    ...parche,
    actualizado: serverTimestamp(),
  });
}

/** Cierra el perfil. A partir de aquí las reglas ya no aceptan cambios. */
export async function entregarPerfil(
  uid: string,
  aplicacion: number,
  resultado: Record<string, unknown>,
): Promise<void> {
  await updateDoc(doc(db(), "perfiles", idPerfil(uid, aplicacion)), {
    ...resultado,
    estado: "entregado",
    actualizado: serverTimestamp(),
    entregado: serverTimestamp(),
  });
}

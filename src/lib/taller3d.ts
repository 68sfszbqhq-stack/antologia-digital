// Guardar el mejor tiempo del taller 3D del Módulo 1.1 en Firebase.
//
// Como en alumno.ts, esto es solo la puerta amable: quien decide qué entra es
// firestore.rules (bloque "Taller 3D"). Lo que hay que saber de allá:
//
//   · Un documento por alumno, armado y modo: `<uid>_<armado>` o
//     `<uid>_<armado>_reto`. Guarda el MEJOR tiempo; las reglas rechazan uno
//     peor, así que aquí se revisa antes para no mandar algo que va a rebotar.
//   · La captura va en /taller3d_capturas con el mismo nombre, y SOLO se
//     puede escribir en el mismo lote que el récord. Por eso se usa un batch.
//   · Nombre y grupo tienen que ser exactamente los de la ficha.

import { doc, getDoc, writeBatch, serverTimestamp } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "./firebase";
import type { Ficha } from "./alumno";

export type Armado = "escritorio" | "laptop";

export interface ResultadoTaller {
  armado: Armado;
  reto: boolean;
  segundos: number;
  errores: number;
  /** JPEG en data URL, ya reducida. */
  captura: string;
}

export function idTaller(uid: string, armado: Armado, reto: boolean): string {
  return `${uid}_${armado}${reto ? "_reto" : ""}`;
}

/** El récord guardado, o null si todavía no hay. */
export async function miRecord(uid: string, armado: Armado, reto: boolean) {
  const snap = await getDoc(doc(db(), "taller3d", idTaller(uid, armado, reto)));
  return snap.exists() ? (snap.data() as { segundos: number; errores: number }) : null;
}

/**
 * Guarda si es el primer tiempo o si mejora el anterior.
 * Devuelve qué pasó, para decírselo al alumno.
 */
export async function guardarTaller(
  u: User,
  ficha: Ficha,
  r: ResultadoTaller,
): Promise<{ estado: "nuevo" | "mejorado" | "no-mejoro"; previo: number | null }> {
  const previo = await miRecord(u.uid, r.armado, r.reto);
  if (previo && r.segundos >= previo.segundos) return { estado: "no-mejoro", previo: previo.segundos };

  const id = idTaller(u.uid, r.armado, r.reto);
  const lote = writeBatch(db());
  lote.set(doc(db(), "taller3d", id), {
    uid: u.uid,
    nombre: ficha.nombre,
    grupo: ficha.grupo,
    armado: r.armado,
    reto: r.reto,
    segundos: r.segundos,
    errores: r.errores,
    enviado: serverTimestamp(),
  });
  lote.set(doc(db(), "taller3d_capturas", id), {
    uid: u.uid,
    captura: r.captura,
    enviado: serverTimestamp(),
  });
  await lote.commit();
  return { estado: previo ? "mejorado" : "nuevo", previo: previo?.segundos ?? null };
}

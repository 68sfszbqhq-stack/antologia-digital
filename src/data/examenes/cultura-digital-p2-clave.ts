// Clave del Examen del Segundo Parcial de Cultura Digital.
//
// Solo la importa /examen/revisar; la página del alumno no la carga.
//
// Ojo con dos datos que se dicen mal a menudo:
//   · Un byte tiene 256 combinaciones (2^8). Van del 0 al 255: el 255 es el
//     número más alto, pero el 0 también cuenta.
//   · i3/i5/i7/i9 NO se dividen por la litografía (los nanómetros): los de una
//     misma generación se fabrican con la misma. Se dividen por núcleos,
//     velocidad y memoria caché.

import { EXAMEN_CD_P2 } from "./cultura-digital-p2";
import type { Pregunta } from "./cultura-digital-p1";
import type { Desglose } from "./cultura-digital-p1-clave";

/** Índice de la opción correcta, en el orden en que están escritas. */
export const CLAVE_OPCION: Record<string, number> = {
  q1: 1, q2: 2, q3: 3, q4: 1,            // bits y bytes
  q5: 2, q6: 3, q7: 1,                   // microprocesadores
  q8: 2, q9: 1, q10: 3, q11: 2,          // sistemas operativos
  q12: 3, q13: 1,                        // IP y DNS
  q14: 3, q15: 1,                        // licencias
  q17: 3,                               // impacto social (uso de datos)
  q18: 1, q19: 2, q20: 3, q21: 0,        // netiqueta, huella, marca personal
  q22: 2, q23: 1, q24: 3, q25: 2,        // ciberacoso, normatividad, seguridad
};

export const CLAVE_ORDEN: Record<string, { correcta: "antes" | "despues"; nota: string }[]> = {};
export const CLAVE_LOGOS: Record<string, { nombre: number; donde: number }> = {};

export const ESPERADO: Record<string, string> = {
  q26: "Bit: la unidad más pequeña, un 0 o un 1. Byte: 8 bits juntos. Con 8 espacios de 0 o 1 salen 2×2×2×2×2×2×2×2 = 256 combinaciones; como se empieza a contar en 0, el más alto es 255.",
  q27: "Ciberacoso: molestar, amenazar o humillar a alguien de forma repetida por internet o el celular. Consejo: no responder, guardar evidencia, bloquear y avisar a un adulto. / Huella digital: el rastro que dejas en internet (activa: lo que publicas; pasiva: lo que se registra sin darte cuenta). Consejo: pensar antes de publicar, revisar la privacidad, no dar datos personales.",
};

// ─── Cómo se calcula la calificación ─────────────────────────────────────────
//
// Opción múltiple 80 % (24 preguntas) y las dos abiertas 20 % (0, 1 o 2 cada
// una). Mientras falte calificar una abierta, sale como "provisional".

export const PESOS = { texto: 2, botones: 0, opcion: 8 } as const;

export function calificar(respuestas: Record<string, string>, puntosTexto: Record<string, number>): Desglose {
  const d: Desglose = {
    texto: { puntos: 0, max: 0, pendientes: 0 },
    botones: { aciertos: 0, total: 0 },
    opcion: { aciertos: 0, total: 0 },
    final: 0,
  };
  for (const p of EXAMEN_CD_P2.preguntas as Pregunta[]) {
    if (p.tipo === "texto") {
      d.texto.max += 2;
      if (!(respuestas[p.id] ?? "").trim()) continue;
      if (typeof puntosTexto[p.id] === "number") d.texto.puntos += puntosTexto[p.id];
      else d.texto.pendientes++;
    } else if (p.tipo === "opcion") {
      d.opcion.total++;
      if (respuestas[p.id] === String(CLAVE_OPCION[p.id])) d.opcion.aciertos++;
    }
  }
  const frac = (a: number, b: number) => (b ? a / b : 0);
  const final = PESOS.texto * frac(d.texto.puntos, d.texto.max) + PESOS.opcion * frac(d.opcion.aciertos, d.opcion.total);
  d.final = Math.round(final * 10) / 10;
  return d;
}

// Clave del Examen del Primer Parcial de Lengua y Comunicación (3º).
//
// Solo la importa /examen/revisar; la página del alumno no la carga.
//
// Los ejemplos de sesgos usan los nombres del PDF «Sesgos cognitivos» que se vio
// en clase. q15 no es «exceso de confianza» porque ese no está en la lista;
// «optimismo» es el más cercano de los que sí vieron.

import { EXAMEN_COM_P1 } from "./comunicacion-p1";
import type { Pregunta } from "./cultura-digital-p1";
import type { Desglose } from "./cultura-digital-p1-clave";

/** Índice de la opción correcta, en el orden en que están escritas. */
export const CLAVE_OPCION: Record<string, number> = {
  // Acuerdos: 0 palabras · 1 personal · 2 suposiciones · 3 lo máximo
  q1: 0, q2: 0, q3: 1, q4: 1, q5: 2, q6: 2, q7: 3, q8: 3,
  // Cialdini
  q9: 1, q10: 0, q11: 2, q12: 1,
  // Sesgos
  q13: 1, q14: 0, q15: 2,
};

export const CLAVE_ORDEN: Record<string, { correcta: "antes" | "despues"; nota: string }[]> = {};
export const CLAVE_LOGOS: Record<string, { nombre: number; donde: number }> = {};

export const ESPERADO: Record<string, string> = {
  q16: "Un fracaso: perdió en 2000 por «hablar como profesor» (largo, denso, frío); le rechazaron la tarjeta; no lo dejaban entrar a las fiestas de su partido. Una técnica: hablar POR la gente y no A la gente; pausas y silencios; regla del tres; estribillo («Yes we can»); escribir y luego decirlo en voz alta; ensayar mucho; contar su propia historia.",
};

// ─── Cómo se calcula la calificación ─────────────────────────────────────────
//
// Opción múltiple 75 % (15 preguntas, medio punto cada una) y la pregunta
// abierta 25 % (0, 1 o 2). Mientras no se califique la abierta, la calificación
// sale como "provisional".

export const PESOS = { texto: 2.5, botones: 0, opcion: 7.5 } as const;

export function calificar(respuestas: Record<string, string>, puntosTexto: Record<string, number>): Desglose {
  const d: Desglose = {
    texto: { puntos: 0, max: 0, pendientes: 0 },
    botones: { aciertos: 0, total: 0 },
    opcion: { aciertos: 0, total: 0 },
    final: 0,
  };
  for (const p of EXAMEN_COM_P1.preguntas as Pregunta[]) {
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

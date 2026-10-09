// Clave del Examen del Primer Parcial de Cultura Digital.
//
// Solo la importa la página del profesor (/examen/revisar). La página del
// alumno no la carga, así que las respuestas no viajan a su celular. Ojo: el
// sitio es público y su código también, así que esto evita que se vean durante
// el examen, no que existan.
//
// Las fechas son las que se dan por buenas en clase; si un alumno discute una,
// aquí está el dato para revisarlo.

import { EXAMEN_CD_P1, type Pregunta } from "./cultura-digital-p1";

/** "antes" = el primero de la pareja apareció antes que el segundo. */
export const CLAVE_ORDEN: Record<string, { correcta: "antes" | "despues"; nota: string }[]> = {
  q7: [{ correcta: "antes", nota: "Disquete 1971 · CD-ROM 1985" }],
  q8: [{ correcta: "antes", nota: "Tarjetas perforadas, siglo XIX · HDD 1956" }],
  q9: [{ correcta: "despues", nota: "USB 2000 · DVD 1996" }],
  q10: [{ correcta: "antes", nota: "Cinta magnética 1951 · disquete 1971" }],
  q11: [{ correcta: "despues", nota: "SSD en casa ~2007 · CD-ROM 1985" }],
  q12: [{ correcta: "despues", nota: "Nube ~2006 · disquete 1971" }],
  q16: [
    { correcta: "antes", nota: "Windows 1985 · Linux 1991" },
    { correcta: "despues", nota: "Android 2008 · iOS 2007" },
    { correcta: "antes", nota: "MS-DOS 1981 · Windows 1985" },
  ],
};

/** Por logo: índice correcto en `nombres` y en `donde` de la pregunta q15. */
export const CLAVE_LOGOS: Record<string, { nombre: number; donde: number }> = {
  l1: { nombre: 0, donde: 0 }, // Windows · Computadora
  l2: { nombre: 2, donde: 0 }, // Linux · Computadora
  l3: { nombre: 1, donde: 2 }, // Apple · Los dos (macOS en computadora, iOS en celular)
  l4: { nombre: 3, donde: 1 }, // Android · Celular
};

/** Índice de la opción correcta, en el orden en que están escritas. */
export const CLAVE_OPCION: Record<string, number> = { q21: 1, q22: 1 };

/** Lo que se espera en cada pregunta de texto, para calificar parejo. */
export const ESPERADO: Record<string, string> = {
  q1: "Hardware = la parte física, lo que se toca. Dos ejemplos: teclado, mouse, monitor, CPU, memoria…",
  q2: "Software = programas e instrucciones; no se tocan. Sin él la máquina no sabe qué hacer. Ej.: Windows, Word, Chrome, un juego.",
  q3: "Placa base / tarjeta madre (motherboard). Conecta y comunica todas las piezas y les reparte la energía.",
  q4: "El cerebro: procesa las instrucciones y hace los cálculos; ordena al resto.",
  q5: "Memoria temporal de trabajo, rápida. Al apagar se borra (es volátil).",
  q6: "Almacenamiento permanente (archivos, programas). La RAM es temporal y se borra; el HDD conserva todo apagado.",
  q13: "Tarjetas perforadas → disquete → CD-ROM → USB → nube. Ventaja: mucha más capacidad, acceso desde cualquier lugar, no se pierde/daña físicamente.",
  q14: "El programa principal que administra la computadora y deja que usemos los demás programas; intermediario entre la persona y la máquina.",
  q17: "Computadora: Windows, macOS, Linux. Celular: Android, iOS. Más una opinión con razón.",
  q18: "Libre: se puede usar, ver, cambiar y compartir el código (la receta). Licenciado: se paga o se acepta una licencia y no se puede ver ni cambiar el código.",
  q19: "Ej.: Linux, LibreOffice, Firefox, GIMP, VLC, Audacity, Blender.",
  q20: "Ej.: Windows, Microsoft Office, Photoshop, macOS, AutoCAD.",
};

// ─── Cómo se calcula la calificación ─────────────────────────────────────────
//
// Texto 60 %, botones (antes/después y logos) 30 %, opción múltiple 10 %.
// Cada texto vale 0 (mal o vacío), 1 (a medias) o 2 (bien). Mientras falte
// calificar algún texto, la calificación sale como "provisional".

export const PESOS = { texto: 6, botones: 3, opcion: 1 } as const;

export interface Desglose {
  texto: { puntos: number; max: number; pendientes: number };
  botones: { aciertos: number; total: number };
  opcion: { aciertos: number; total: number };
  /** Sobre 10, con un decimal. */
  final: number;
}

export function calificar(respuestas: Record<string, string>, puntosTexto: Record<string, number>): Desglose {
  const d: Desglose = {
    texto: { puntos: 0, max: 0, pendientes: 0 },
    botones: { aciertos: 0, total: 0 },
    opcion: { aciertos: 0, total: 0 },
    final: 0,
  };
  for (const p of EXAMEN_CD_P1.preguntas as Pregunta[]) {
    if (p.tipo === "texto") {
      d.texto.max += 2;
      const vacia = !(respuestas[p.id] ?? "").trim();
      if (vacia) continue; // vacía vale 0, no hay nada que calificar
      if (typeof puntosTexto[p.id] === "number") d.texto.puntos += puntosTexto[p.id];
      else d.texto.pendientes++;
    } else if (p.tipo === "orden") {
      CLAVE_ORDEN[p.id].forEach((c, i) => {
        d.botones.total++;
        if (respuestas[`${p.id}_${i}`] === c.correcta) d.botones.aciertos++;
      });
    } else if (p.tipo === "logos") {
      for (const l of p.logos) {
        d.botones.total += 2;
        if (respuestas[`${p.id}_${l}_n`] === String(CLAVE_LOGOS[l].nombre)) d.botones.aciertos++;
        if (respuestas[`${p.id}_${l}_d`] === String(CLAVE_LOGOS[l].donde)) d.botones.aciertos++;
      }
    } else if (p.tipo === "opcion") {
      d.opcion.total++;
      if (respuestas[p.id] === String(CLAVE_OPCION[p.id])) d.opcion.aciertos++;
    }
  }
  const frac = (a: number, b: number) => (b ? a / b : 0);
  const final =
    PESOS.texto * frac(d.texto.puntos, d.texto.max) +
    PESOS.botones * frac(d.botones.aciertos, d.botones.total) +
    PESOS.opcion * frac(d.opcion.aciertos, d.opcion.total);
  d.final = Math.round(final * 10) / 10;
  return d;
}

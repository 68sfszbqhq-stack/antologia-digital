// Tipos compartidos del contenido de cada módulo de Cultura Digital.
// Todo el contenido vive en datos: la página /sesion/[dia] no tiene texto quemado.

/** Clave de color; el mapa de clases Tailwind vive en [dia].astro */
export type Acento =
  | "cyan" | "violet" | "amber" | "emerald"
  | "rose" | "teal" | "blue" | "purple" | "indigo" | "sky";

/** Un dato duro con su fuente. Toda cifra mostrada debe poder rastrearse. */
export interface DatoDuro {
  cifra: string;
  etiqueta: string;
  fuente: string;
}

/** El bloque de apertura en tono keynote: gancho, cifras, chiste y llamado a la acción. */
export interface Keynote {
  gancho: string;
  parrafo: string;
  datos: DatoDuro[];
  chiste: string;
  ctaTitulo: string;
  ctaTexto: string;
  ctaBoton: string;
}

export interface Concepto {
  icono: string;
  etiqueta: string;
  titulo: string;
  cuerpo: string;
  dato: string;
  acento: Acento;
}

export interface Hito {
  year: string;
  era: string;
  categoria: string;
  titulo: string;
  pioneros: string;
  resumen: string;
  impacto: string;
  acento: Acento;
}

export interface Pregunta {
  pregunta: string;
  opciones: string[];
  correcta: number;
  categoria: string;
  explicacion: string;
}

export interface Rubrica {
  criterio: string;
  peso: number;
}

export interface Tarea {
  titulo: string;
  descripcion: string;
  requisitos: string[];
  rubrica: Rubrica[];
  simuladorTitulo: string;
  simuladorAyuda: string;
  phClave: string;
  phTexto: string;
  ejemplos: { clave: string; texto: string }[];
}

export interface ContenidoModulo {
  dia: number;
  /** Etiquetas de los cinco pasos de la secuencia didáctica */
  pasos: [string, string, string, string, string];
  keynote: Keynote;
  conceptosTitulo: string;
  conceptos: Concepto[];
  hitosTitulo: string;
  hitosSubtitulo: string;
  hitos: Hito[];
  /** Las 4 categorías del cuestionario, en el orden en que se grafican */
  ejes: { nombre: string; acento: Acento }[];
  preguntas: Pregunta[];
  tarea: Tarea;
}

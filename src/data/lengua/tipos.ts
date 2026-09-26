/**
 * Antología de Lengua y Comunicación.
 *
 * Los temas salen de las exposiciones que hizo el grupo; aquí se amplían con
 * autores y artículos. REGLA: toda cita del texto, como "(Kruger et al., 2005)",
 * debe tener su ficha en `fuentes` con esa misma `clave`, y toda ficha debe
 * citarse al menos una vez. Si no, el build falla (ver `revisarCitas` en
 * index.ts). Así no se publica una cita sin referencia ni una referencia suelta.
 *
 * Antes de agregar una fuente, comprobar que existe: el DOI en
 * https://api.crossref.org/works/<doi>, o el enlace abierto en el navegador.
 */

export type AcentoLyC = "amber" | "rose" | "sky" | "emerald" | "violet";

export interface FuenteLyC {
  /** Tal como aparece en el texto, sin paréntesis: "Kruger et al., 2005" */
  clave: string;
  /** Referencia completa en APA 7 */
  cita: string;
  /** DOI o enlace abierto, si lo hay */
  url?: string;
}

export interface TemaLyC {
  slug: string;
  titulo: string;
  subtitulo: string;
  /** Pregunta para abrir la clase */
  detonadora: string;
  /** La idea del tema en una o dos frases */
  idea: string;
  secciones: { titulo: string; parrafos: string[] }[];
  /** Error común y cómo hacerlo mejor */
  errores: { error: string; mejor: string }[];
  ejemplo?: { contexto: string; mal: string; bien: string; porque: string };
  actividad: { titulo: string; pasos: string[]; producto: string };
  reflexion: string[];
  fuentes: FuenteLyC[];
}

export interface UnidadLyC {
  numero: number;
  titulo: string;
  proposito: string;
  acento: AcentoLyC;
  temas: TemaLyC[];
}

/**
 * Avisos de la portada.
 *
 * CÓMO PUBLICAR UN AVISO. Copia uno de los bloques de abajo, pégalo al principio
 * de la lista y cambia el texto. Al publicar el sitio (push a `main`) aparece en
 * la portada. Para quitarlo, borra su bloque.
 *
 *   fecha     AAAA-MM-DD. Los avisos se ordenan solos, del más nuevo al más viejo.
 *   titulo    Corto: es lo primero que se lee.
 *   texto     El aviso. Una línea en blanco separa párrafos.
 *   etiqueta  Opcional. Una de las de `Etiqueta`, abajo.
 *   fijado    Opcional. `true` lo deja hasta arriba aunque sea viejo.
 *   enlace    Opcional. `href` puede ser una página del sitio ("/diagnostico")
 *             o una dirección completa ("https://...").
 *
 * Esto NO pasa por Firebase: es parte del sitio, como el contenido de los
 * módulos. Nadie puede publicar un aviso desde el navegador.
 */

export type Etiqueta = "General" | "Cultura Digital" | "Lengua y Comunicación" | "Evaluaciones";

export interface Aviso {
  fecha: string;
  titulo: string;
  texto: string;
  etiqueta?: Etiqueta;
  fijado?: boolean;
  enlace?: { texto: string; href: string };
}

export const avisos: Aviso[] = [
  {
    fecha: "2026-09-10",
    titulo: "Estrenamos portada",
    texto:
      "Desde hoy, en esta página se publican los avisos de la escuela. Revísala seguido.\n\n" +
      "El material de tus materias, Cultura Digital y Lengua y Comunicación, está en el menú ☰ de arriba a la derecha.",
    etiqueta: "General",
  },
];

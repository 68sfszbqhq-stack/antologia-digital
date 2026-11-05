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
    fecha: "2026-11-05",
    titulo: "Actividad: curso de Platzi, entrega el domingo 8 de noviembre",
    texto:
      "Vean el Curso de Fundamentos de Ingeniería de Software de Freddy Vega en Platzi. Platzi da días de prueba gratis al crear su cuenta, aprovéchenlos. Tienen tres días para verlo, hasta el domingo 8 de noviembre.\n\n" +
      "En su libreta hagan un reporte con: 1. Su nombre, la fecha y el nombre del curso. 2. Qué es un bit y qué es un byte, con sus palabras. 3. Para qué sirven el procesador y la memoria RAM. 4. Qué es un dominio de internet y para qué sirve el DNS. 5. Lo que más les sirvió del curso y una duda que les haya quedado.\n\n" +
      "Si no alcanzan a ver todo, anoten hasta qué clase llegaron.",
    etiqueta: "Cultura Digital",
    enlace: { texto: "Abrir el curso en Platzi", href: "https://platzi.com/cursos/ingenieria/" },
  },
  {
    fecha: "2026-09-10",
    titulo: "Estrenamos portada",
    texto:
      "Desde hoy, en esta página se publican los avisos de la escuela. Revísala seguido.\n\n" +
      "El material de tus materias, Cultura Digital y Lengua y Comunicación, está en el menú ☰ de arriba a la derecha.",
    etiqueta: "General",
  },
];

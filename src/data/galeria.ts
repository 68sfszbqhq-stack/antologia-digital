// Salón de la fama: los mejores trabajos de los alumnos, como recuerdo de su
// generación y como ejemplo para los que vienen.
//
// Para agregar uno, copia el bloque de ejemplo de abajo y llénalo.
//
// Antes de publicar un trabajo:
// - El alumno tiene que estar de acuerdo. Son menores de edad.
// - Solo nombre de pila e inicial del apellido ("Zayuri M."). Nunca matrícula,
//   correo ni nombre completo.
// - El enlace debe abrir sin pedir cuenta (Canva, Genially o Drive en modo
//   "cualquiera con el enlace puede ver").
//
// `modulo` es el número del módulo (1 = Módulo 1.1). El trabajo aparece en la
// sección «Tu Reto» de ese módulo y en la página /galeria.

export interface TrabajoDestacado {
  modulo: number;
  /** Ciclo escolar, ej. "2026-2027". Agrupa la página por generación. */
  ciclo: string;
  /** Nombre de pila e inicial del apellido. */
  autor: string;
  /** Grupo o semestre. Si no lo recuerdas, déjalo fuera. */
  grupo?: string;
  titulo: string;
  /** Formato del trabajo, ej. "Línea del tiempo en Canva". */
  formato: string;
  url: string;
  /** Por qué lo elegiste: es lo que más le sirve a quien lo vea después. */
  porque: string;
  /** Captura del trabajo, guardada en public/galeria/. Ej. "galeria/espiral.jpg" */
  imagen?: string;
  /** Código corto que se muestre en la tarjeta (para retos de programación). */
  codigo?: string;
}

export const galeria: TrabajoDestacado[] = [
  {
    modulo: 6,
    ciclo: "2025-2026",
    autor: "Zayuri",
    grupo: "4.º semestre",
    titulo: "Mi perfil profesional",
    formato: "Página web publicada en GitHub Pages",
    url: "https://zayuri-omnali.github.io/Mi-Perfil-Profesional/",
    porque:
      "Construyó su CV y portafolio como página web, casi todo desde el celular y con apoyo de IA, y la publicó gratis. Reúne su perfil, fortalezas, metas y proyectos: su identidad digital trabajando a su favor. Además ayudó a sus compañeros a publicar las suyas.",
  },
  {
    modulo: 8,
    ciclo: "2023-2024",
    autor: "Alumna de Cultura Digital",
    titulo: "Espiral cuadrada con la tortuga",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/espiral-turtle-academy.jpg",
    codigo: "repeat 120 [\n  forward 5 * repcount\n  right 90\n]",
    porque:
      "Con solo tres instrucciones dibujó 120 líneas. El ciclo repeat repite los pasos, y repcount es una variable que cuenta las vueltas: como cada línea mide 5 × la vuelta, crece un poco más que la anterior y sale la espiral.",
  },
  // {
  //   modulo: 1,
  //   ciclo: "2026-2027",
  //   autor: "Nombre A.",
  //   grupo: "1.º A",
  //   titulo: "De la válvula al chip",
  //   formato: "Línea del tiempo en Canva",
  //   url: "https://www.canva.com/...",
  //   porque: "Explica con sus palabras por qué el transistor lo cambió todo.",
  // },
];

export const trabajosDelModulo = (modulo: number) =>
  galeria.filter((t) => t.modulo === modulo);

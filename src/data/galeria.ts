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
  grupo: string;
  titulo: string;
  /** Formato del trabajo, ej. "Línea del tiempo en Canva". */
  formato: string;
  url: string;
  /** Por qué lo elegiste: es lo que más le sirve a quien lo vea después. */
  porque: string;
}

export const galeria: TrabajoDestacado[] = [
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

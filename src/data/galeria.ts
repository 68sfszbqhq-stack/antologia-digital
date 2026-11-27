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
  // ── 1.º A, 26-nov-2026: capturas que mandaron por WhatsApp ──
  // Los nombres salen del perfil de WhatsApp. Donde no se sabía, va genérico:
  // corregir con nombre de pila e inicial cuando José los confirme.
  {
    modulo: 8,
    ciclo: "2026-2027",
    autor: "Kennan",
    grupo: "1.º A",
    titulo: "Rosetón de cuadrados",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/turtle-1a-roseton.jpg",
    codigo: "repeat 36 [\n  repeat 4 [\n    fd 150\n    rt 90\n  ]\n  rt 10\n]",
    porque:
      "Un ciclo dentro de otro ciclo. El de adentro dibuja un cuadrado; el de afuera lo repite 36 veces girando 10° cada vez (36 × 10° = una vuelta completa). Son 144 líneas que salen de solo 7 renglones de código.",
  },
  {
    modulo: 8,
    ciclo: "2026-2027",
    autor: "Jan",
    grupo: "1.º A",
    titulo: "Estrella fugaz",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/turtle-1a-estrella-fugaz.jpg",
    codigo: "TO SHOOTINGSTAR\n  …\n  REPEAT 5 [\n    FD 35\n    RT 144\n  ]\nEND\n\nSHOOTINGSTAR",
    porque:
      "Creó su propio comando: con TO … END le enseñó a la tortuga qué significa SHOOTINGSTAR y después solo lo llamó por su nombre. Eso es una función. La estrella sale de repetir 5 veces avanzar y girar 144°.",
  },
  {
    modulo: 8,
    ciclo: "2026-2027",
    autor: "Nohemí",
    grupo: "1.º A",
    titulo: "Conejo",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/turtle-1a-conejo.jpg",
    porque:
      "Más de 100 líneas, ordenadas por partes con comentarios (; MEJILLA IZQUIERDA, ; BOQUITA). Ubica cada parte con coordenadas SETXY y hace los círculos con REPEAT 360 [FD 0.18 RT 1]: 360 pasos diminutos girando 1° cada vez.",
  },
  {
    modulo: 8,
    ciclo: "2026-2027",
    autor: "Alumna de 1.º A",
    grupo: "1.º A",
    titulo: "Mariposa",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/turtle-1a-mariposa.jpg",
    codigo: "; DECORACION DE ALAS\nPU\nSETXY -35 20\nPD\nREPEAT 360 [FD 0.18 RT 1]",
    porque:
      "Simetría con coordenadas: cada círculo de un ala tiene su gemelo con la X en negativo (-35 y 35). PU levanta la pluma para moverse sin rayar y PD la baja para dibujar.",
  },
  {
    modulo: 8,
    ciclo: "2026-2027",
    autor: "Alumno de 1.º A",
    grupo: "1.º A",
    titulo: "Casa",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/turtle-1a-casa.jpg",
    codigo: "setcolor 1\npu\nsetxy -60 -60\npd\nsetxy 60 -60\nsetxy 60 40\nsetxy -60 40\nsetxy -60 -60",
    porque:
      "Estructura secuencial pura: cada instrucción se ejecuta una tras otra. Cambia de color con setcolor para separar muros, techo y puerta, y une esquinas con setxy como en un plano cartesiano.",
  },
  {
    modulo: 8,
    ciclo: "2026-2027",
    autor: "Emilio",
    grupo: "1.º A",
    titulo: "Flor roja",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/turtle-1a-flor.jpg",
    porque:
      "Decenas de pétalos que salen del mismo centro: la tortuga repite ir, volver y girar un poco. Un solo ciclo basta para una figura que a mano tomaría muchísimo tiempo.",
  },
  {
    modulo: 8,
    ciclo: "2026-2027",
    autor: "Alumno de 1.º A",
    grupo: "1.º A",
    titulo: "Retrato a color",
    formato: "Programa en Turtle Academy (Logo)",
    url: "https://turtleacademy.com/playground",
    imagen: "galeria/turtle-1a-retrato.jpg",
    porque:
      "Se salió de las figuras geométricas e hizo un personaje completo con bloques rellenos de color. Muestra que con instrucciones muy simples se puede hacer arte.",
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

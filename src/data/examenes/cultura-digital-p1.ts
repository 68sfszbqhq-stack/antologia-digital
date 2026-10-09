// Examen del Primer Parcial de Cultura Digital: lo que ve el alumno.
//
// Aquí NO hay respuestas. La clave vive aparte, en cultura-digital-p1-clave.ts,
// y solo la importa la página del profesor (/examen/revisar). Así el código que
// baja al celular del alumno no trae las respuestas correctas, ni las fechas
// que delatarían el "antes o después".
//
// Tipos de pregunta:
//   · texto   — respuesta escrita; la califica el profesor (0, 1 o 2).
//   · orden   — "¿A apareció antes o después de B?", con dos botones.
//   · logos   — cada logo: de qué sistema es y si es de computadora o celular.
//   · opcion  — opción múltiple.
//
// El id de cada pregunta es la llave de la respuesta en Firestore. No cambiar un
// id con el examen ya aplicado: las respuestas guardadas dejarían de cuadrar.

export type Pregunta =
  | { id: string; tipo: "texto"; texto: string }
  | { id: string; tipo: "orden"; texto: string; pares: { a: string; b: string }[] }
  | { id: string; tipo: "logos"; texto: string; logos: string[]; nombres: string[]; donde: string[] }
  | { id: string; tipo: "opcion"; texto: string; opciones: string[] };

export interface Examen {
  id: string;
  titulo: string;
  materia: string;
  minutos: number;
  preguntas: Pregunta[];
}

const antesDespues = "Línea del tiempo: ¿qué llegó primero?";

export const EXAMEN_CD_P1: Examen = {
  id: "cd-p1",
  titulo: "Examen del Primer Parcial",
  materia: "Cultura Digital",
  minutos: 25,
  preguntas: [
    // ─── A. Hardware y software ───────────────────────────────────────────
    { id: "q1", tipo: "texto", texto: "Tu tío dice que \"la computadora es la pantalla\". Explícale con tus palabras qué es el HARDWARE y dale dos ejemplos que se puedan tocar." },
    { id: "q2", tipo: "texto", texto: "Ahora explícale qué es el SOFTWARE. ¿Por qué sin software el hardware \"no sirve de nada\"? Da dos ejemplos." },
    { id: "q3", tipo: "texto", texto: "Abriste una computadora y ves una tarjeta grande y verde donde se conecta todo. ¿Cómo se llama y cuál es su función?" },
    { id: "q4", tipo: "texto", texto: "Si comparamos la computadora con un cuerpo humano, ¿qué parte sería la CPU y por qué? Explica qué hace." },
    { id: "q5", tipo: "texto", texto: "Explica qué es la RAM. ¿Qué pasa con lo que está en la RAM cuando apagas la computadora?" },
    { id: "q6", tipo: "texto", texto: "Explica qué es un HDD (disco duro). ¿En qué se diferencia de la RAM?" },

    // ─── B. Línea del tiempo del almacenamiento ───────────────────────────
    { id: "q7", tipo: "orden", texto: antesDespues, pares: [{ a: "El disquete", b: "el CD-ROM" }] },
    { id: "q8", tipo: "orden", texto: antesDespues, pares: [{ a: "Las tarjetas perforadas", b: "el disco duro (HDD)" }] },
    { id: "q9", tipo: "orden", texto: antesDespues, pares: [{ a: "La memoria USB", b: "el DVD" }] },
    { id: "q10", tipo: "orden", texto: antesDespues, pares: [{ a: "La cinta magnética", b: "el disquete" }] },
    { id: "q11", tipo: "orden", texto: antesDespues, pares: [{ a: "El SSD en las computadoras de casa", b: "el CD-ROM" }] },
    { id: "q12", tipo: "orden", texto: antesDespues, pares: [{ a: "La nube", b: "el disquete" }] },
    { id: "q13", tipo: "texto", texto: "Ordena del más viejo al más nuevo: USB, tarjetas perforadas, CD-ROM, nube, disquete. Luego explica qué ventaja tiene el último sobre el primero." },

    // ─── C. Sistemas operativos ───────────────────────────────────────────
    { id: "q14", tipo: "texto", texto: "¿Qué es un sistema operativo? Explícalo como si se lo contaras a alguien que nunca ha usado una computadora." },
    {
      id: "q15", tipo: "logos",
      texto: "¿De qué sistema operativo es cada logo, y dónde se usa?",
      // Nombres de archivo neutros a propósito: "linux.svg" delataría la respuesta.
      logos: ["l1", "l2", "l3", "l4"],
      nombres: ["Windows", "Apple (macOS / iOS)", "Linux", "Android"],
      donde: ["Computadora", "Celular", "Los dos"],
    },
    {
      id: "q16", tipo: "orden", texto: antesDespues,
      pares: [
        { a: "Windows", b: "Linux" },
        { a: "Android", b: "iOS (iPhone)" },
        { a: "MS-DOS", b: "Windows" },
      ],
    },
    { id: "q17", tipo: "texto", texto: "Menciona los TRES sistemas operativos principales de computadora y los DOS principales de celular. Elige uno y di qué te gusta o no de él." },

    // ─── D. Software libre y licenciado ───────────────────────────────────
    { id: "q18", tipo: "texto", texto: "Explica la diferencia entre SOFTWARE LIBRE y SOFTWARE LICENCIADO (privativo). Usa el ejemplo de una receta de cocina: ¿cuál te deja ver y cambiar la receta?" },
    { id: "q19", tipo: "texto", texto: "Escribe 3 ejemplos de SOFTWARE LIBRE." },
    { id: "q20", tipo: "texto", texto: "Escribe 3 ejemplos de SOFTWARE LICENCIADO (de paga o privativo)." },

    // ─── Opción múltiple ──────────────────────────────────────────────────
    {
      id: "q21", tipo: "opcion",
      texto: "Una escuela no tiene dinero para pagar licencias. ¿Qué le conviene?",
      opciones: ["Piratear Windows", "Usar Linux y LibreOffice", "No usar computadoras"],
    },
    {
      id: "q22", tipo: "opcion",
      texto: "¿Cuál de estos guarda la información aunque se apague la computadora?",
      opciones: ["La RAM", "El disco duro (HDD)", "La pantalla"],
    },
  ],
};

export const EXAMENES: Record<string, Examen> = { [EXAMEN_CD_P1.id]: EXAMEN_CD_P1 };

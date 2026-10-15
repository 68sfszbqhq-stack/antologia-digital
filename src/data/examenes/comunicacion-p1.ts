// Examen del Primer Parcial de Lengua y Comunicación (3º): lo que ve el alumno.
//
// Como en cultura-digital-p1.ts, aquí NO hay respuestas: la clave vive en
// comunicacion-p1-clave.ts y solo la carga /examen/revisar.
//
// El id de cada pregunta es la llave de la respuesta en Firestore. No cambiar un
// id con el examen ya aplicado.

import type { Examen } from "./cultura-digital-p1";

const ACUERDOS = [
  "Sé impecable con tus palabras",
  "No te tomes nada personalmente",
  "No hagas suposiciones",
  "Haz siempre lo máximo que puedas",
];
const acuerdo = (id: string, situacion: string) => ({
  id, tipo: "opcion" as const, texto: `${situacion} ¿Qué acuerdo está practicando?`, opciones: ACUERDOS,
});

export const EXAMEN_COM_P1: Examen = {
  id: "com-p1",
  titulo: "Examen del Primer Parcial",
  materia: "Lengua y Comunicación",
  minutos: 20,
  preguntas: [
    // ─── A. Los cuatro acuerdos (Miguel Ruiz) ─────────────────────────────
    acuerdo("q1", "Valeria se enoja con un compañero y le dan ganas de contarle a todo el salón un secreto de él, pero decide no hacerlo."),
    acuerdo("q2", "Diego dice «soy un tonto, nunca me sale nada» y se corrige: «esta vez no me salió, pero puedo practicar»."),
    acuerdo("q3", "Alguien comenta en tu foto «qué feo saliste». En lugar de quedarte triste todo el día, piensas: «eso habla más de él que de mí»."),
    acuerdo("q4", "La maestra le regresa a Sofía su trabajo con muchas correcciones. Sofía no piensa «me odia», sino que son para que mejore."),
    acuerdo("q5", "Tu amiga dejó tu mensaje en «visto». En vez de pensar que está enojada contigo, le preguntas si está bien."),
    acuerdo("q6", "Luis no entiende bien qué hay que entregar de tarea, así que le pregunta al profesor en lugar de adivinar."),
    acuerdo("q7", "Ana tiene gripa y no rinde como siempre en el entrenamiento, pero da lo que puede ese día y no se siente culpable."),
    acuerdo("q8", "Carlos solo pudo estudiar 30 minutos, pero los aprovechó completos sin distraerse con el celular."),

    // ─── B. Influencia (Robert Cialdini) ──────────────────────────────────
    {
      id: "q9", tipo: "opcion",
      texto: "En el súper te dan a probar un pedacito de queso gratis y después sientes que «debes» comprar uno. ¿Qué principio de Cialdini es?",
      opciones: ["Escasez", "Reciprocidad", "Autoridad", "Unidad"],
    },
    {
      id: "q10", tipo: "opcion",
      texto: "Una tienda en línea dice: «¡Solo quedan 2 piezas! La oferta termina en 10 minutos». ¿Qué principio de Cialdini es?",
      opciones: ["Escasez", "Simpatía", "Prueba social", "Compromiso y coherencia"],
    },
    {
      id: "q11", tipo: "opcion",
      texto: "En el restaurante, la carta dice: «El platillo más pedido por nuestros clientes». ¿Qué principio de Cialdini es?",
      opciones: ["Autoridad", "Reciprocidad", "Prueba social", "Escasez"],
    },
    {
      id: "q12", tipo: "opcion",
      texto: "Te piden firmar una petición pequeña y una semana después te piden donar a esa misma causa. Aceptas porque «ya la apoyaste». ¿Qué principio de Cialdini es?",
      opciones: ["Simpatía", "Compromiso y coherencia", "Escasez", "Autoridad"],
    },

    // ─── C. Obama y los sesgos cognitivos ─────────────────────────────────
    {
      id: "q13", tipo: "opcion",
      texto: "En el año 2000, el rival de Obama dijo: «Es profesor de Harvard, no es de los nuestros». Mucha gente lo rechazó solo por esa etiqueta, sin escuchar sus propuestas. ¿Qué sesgo es?",
      opciones: ["Efecto halo", "Efecto cuerno", "Anclaje", "Costo hundido"],
    },
    {
      id: "q14", tipo: "opcion",
      texto: "En 2004 Obama dio un solo discurso de 17 minutos y esa misma noche los comentaristas ya lo llamaban «futuro presidente». ¿Qué sesgo es?",
      opciones: ["Efecto halo", "Negatividad", "Aversión a la pérdida", "Falso consenso"],
    },
    {
      id: "q15", tipo: "opcion",
      texto: "Antes de un debate contra Romney, Obama confió en que su experiencia le bastaba, no se preparó y perdió. Es como pensar «a otros les va mal por no prepararse, pero a mí no». ¿Qué sesgo es?",
      opciones: ["Arrastre", "Retrospectivo", "Optimismo", "Mera exposición"],
    },

    // ─── D. Pregunta abierta ──────────────────────────────────────────────
    {
      id: "q16", tipo: "texto",
      texto: "Escribe qué aprendiste sobre Barack Obama en el video «De profesor a presidente». Menciona al menos UN fracaso de su historia y UNA técnica que usaba para comunicar.",
    },
  ],
};

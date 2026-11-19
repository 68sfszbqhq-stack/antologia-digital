// Examen del Segundo Parcial de Cultura Digital (módulos 1.2 y 1.3, más los
// temas que se vieron en clase): lo que ve el alumno.
//
// Aquí NO hay respuestas. La clave vive en cultura-digital-p2-clave.ts y solo la
// importa /examen/revisar. Este archivo sí baja al celular del alumno, así que
// la opción correcta NO va siempre en el mismo lugar: si siempre fuera la
// primera, bastaría con leer el código para sacar 10. (Además el examen revuelve
// el orden de preguntas y opciones para cada alumno.)
//
// El id de cada pregunta es la llave de la respuesta en Firestore. No cambiar un
// id con el examen ya aplicado.

import type { Examen } from "./cultura-digital-p1";

export const EXAMEN_CD_P2: Examen = {
  id: "cd-p2",
  titulo: "Examen del Segundo Parcial",
  materia: "Cultura Digital",
  minutos: 25,
  preguntas: [
    // ─── Bits y bytes ─────────────────────────────────────────────────────
    {
      id: "q1", tipo: "opcion",
      texto: "Dentro de la computadora, toda la información (fotos, música, texto) se representa con:",
      opciones: ["Los números del 0 al 9", "Solo dos valores: 0 y 1", "Las letras de la A a la Z", "Colores y sonidos"],
    },
    {
      id: "q2", tipo: "opcion",
      texto: "¿Cuántos bits forman un byte?",
      opciones: ["4", "10", "8", "16"],
    },
    {
      id: "q3", tipo: "opcion",
      texto: "Un byte tiene 8 espacios y cada uno puede ser 0 o 1. ¿Cuántas combinaciones distintas se pueden formar?",
      opciones: ["8", "100", "1024", "256 (del 0 al 255)"],
    },
    {
      id: "q4", tipo: "opcion",
      texto: "¿Cuál está ordenado de MENOR a MAYOR?",
      opciones: [
        "byte, bit, MB, KB, TB, GB",
        "bit, byte, KB, MB, GB, TB",
        "KB, bit, byte, GB, MB, TB",
        "bit, KB, byte, MB, TB, GB",
      ],
    },

    // ─── Microprocesadores ────────────────────────────────────────────────
    {
      id: "q5", tipo: "opcion",
      texto: "Procesadores Intel Core de la misma generación. ¿Cuál está ordenado del MENOS al MÁS potente?",
      opciones: [
        "Core i9, Core i7, Core i5, Core i3",
        "Core i5, Core i3, Core i9, Core i7",
        "Core i3, Core i5, Core i7, Core i9",
        "Todos son igual de potentes",
      ],
    },
    {
      id: "q6", tipo: "opcion",
      texto: "¿Por qué Intel divide sus procesadores en Core i3, i5, i7 e i9?",
      opciones: [
        "Por el año en que salieron: el i3 es el más viejo",
        "Porque cada uno sirve para un sistema operativo distinto",
        "Por el color y el tamaño del chip",
        "Por su capacidad: más núcleos, más velocidad y más memoria caché conforme sube el número",
      ],
    },
    {
      id: "q7", tipo: "opcion",
      texto: "Un chip fabricado a 3 nanómetros, comparado con uno de 14 nanómetros:",
      opciones: [
        "Es más grande y pesado",
        "Tiene transistores más pequeños: caben más en el mismo espacio y gasta menos energía",
        "Es más lento",
        "Solo funciona en celulares",
      ],
    },

    // ─── Sistemas operativos (con trampa: navegadores y apps) ─────────────
    {
      id: "q8", tipo: "opcion",
      texto: "¿Cuál de estos SÍ es un sistema operativo?",
      opciones: ["Google Chrome", "Microsoft Word", "Linux", "WhatsApp"],
    },
    {
      id: "q9", tipo: "opcion",
      texto: "¿Cuál de estos SÍ es un sistema operativo?",
      opciones: ["Mozilla Firefox", "Android", "Safari", "Microsoft Edge"],
    },
    {
      id: "q10", tipo: "opcion",
      texto: "¿Cuál de estos NO es un sistema operativo?",
      opciones: ["Windows", "macOS", "iOS", "Opera"],
    },
    {
      id: "q11", tipo: "opcion",
      texto: "Google Chrome, Firefox, Safari y Edge son:",
      opciones: ["Sistemas operativos", "Antivirus", "Navegadores web", "Redes sociales"],
    },

    // ─── Internet: IP y DNS ───────────────────────────────────────────────
    {
      id: "q12", tipo: "opcion",
      texto: "¿Qué es una dirección IP?",
      opciones: [
        "La contraseña del wifi",
        "El nombre de una página, como google.com",
        "Un tipo de virus",
        "El número que identifica a cada dispositivo conectado a una red o a internet",
      ],
    },
    {
      id: "q13", tipo: "opcion",
      texto: "¿Qué hace el DNS cuando escribes una dirección web?",
      opciones: [
        "Protege la computadora de virus",
        "Traduce el nombre del sitio a la dirección IP del servidor",
        "Guarda tus contraseñas",
        "Hace más rápido el internet",
      ],
    },

    // ─── Licencias (1.2) ──────────────────────────────────────────────────
    {
      id: "q14", tipo: "opcion",
      texto: "Un programa que puedes usar, estudiar, modificar y compartir libremente es:",
      opciones: ["Software privativo", "Shareware", "Software pirata", "Software libre"],
    },
    {
      id: "q15", tipo: "opcion",
      texto: "En una licencia Creative Commons, la condición BY te obliga a:",
      opciones: ["Pagarle al autor", "Darle crédito al autor", "No compartir la obra", "Venderla"],
    },

    // ─── Impacto social (1.3) ─────────────────────────────────────────────
    {
      id: "q17", tipo: "opcion",
      texto: "Una app \"gratis\" recopila lo que haces para venderlo a anunciantes. ¿Qué significa?",
      opciones: [
        "Que la app es software libre",
        "Que no pasa nada con tus datos",
        "Que es una red privada",
        "Que tus datos son el pago: el producto eres tú",
      ],
    },

    // ─── Ciudadanía digital ───────────────────────────────────────────────
    {
      id: "q18", tipo: "opcion",
      texto: "¿Cuál es un ejemplo de NETIQUETA?",
      opciones: [
        "Hacer memes con la foto de un compañero",
        "Escribir con respeto y sin mayúsculas sostenidas, que se leen como gritos",
        "Reenviar cadenas al grupo de la clase",
        "Contestar con insultos si alguien opina distinto",
      ],
    },
    {
      id: "q19", tipo: "opcion",
      texto: "Tu huella digital es:",
      opciones: [
        "La marca de tu dedo en la pantalla",
        "Tu contraseña",
        "El rastro de todo lo que haces y publicas en internet",
        "Un programa antivirus",
      ],
    },
    {
      id: "q20", tipo: "opcion",
      texto: "¿Cuál es un ejemplo de huella digital PASIVA?",
      opciones: [
        "Una foto que subiste a Instagram",
        "Un comentario que escribiste",
        "Un formulario que llenaste",
        "Tu ubicación y tu dirección IP, que quedan registradas sin que te des cuenta",
      ],
    },
    {
      id: "q21", tipo: "opcion",
      texto: "Tu MARCA PERSONAL en internet es:",
      opciones: [
        "La imagen que proyectas de ti con lo que publicas, y que pueden ver escuelas y empleos",
        "El logo de una empresa",
        "Tu nombre de usuario",
        "La marca de tu celular",
      ],
    },
    {
      id: "q22", tipo: "opcion",
      texto: "Un compañero recibe burlas y amenazas constantes en un grupo de WhatsApp. ¿Qué es lo correcto?",
      opciones: [
        "Reenviarlo para que todos lo vean",
        "Unirte a las burlas para no ser el siguiente",
        "No compartirlo, guardar evidencia y avisar a un adulto o a la escuela",
        "Ignorarlo, no es asunto tuyo",
      ],
    },
    {
      id: "q23", tipo: "opcion",
      texto: "En México, la Ley Olimpia castiga:",
      opciones: [
        "Descargar música",
        "Difundir contenido íntimo de una persona sin su consentimiento",
        "Usar software libre",
        "Tener redes sociales antes de los 18 años",
      ],
    },
    {
      id: "q24", tipo: "opcion",
      texto: "Te llega un mensaje: \"Tu cuenta será bloqueada hoy. Entra a este enlace y escribe tu contraseña\". Es un ejemplo de:",
      opciones: ["Netiqueta", "Una actualización del sistema", "Software libre", "Phishing: un engaño para robar tus datos"],
    },
    {
      id: "q25", tipo: "opcion",
      texto: "¿Cuál es la contraseña más segura?",
      opciones: ["123456", "tunombre2009", "Mar!Pue6la-2026#Gato", "contraseña"],
    },

    // ─── Abiertas ─────────────────────────────────────────────────────────
    { id: "q26", tipo: "texto", texto: "Explica con tus palabras qué es un BIT y qué es un BYTE. ¿Por qué en un byte solo caben los números del 0 al 255?" },
    { id: "q27", tipo: "texto", texto: "Elige UNO: ciberacoso o huella digital. Explica qué es y da un consejo para protegerte." },
  ],
};

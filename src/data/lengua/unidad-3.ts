import type { UnidadLyC } from "./tipos";
import { F } from "./fuentes";

export const unidad3: UnidadLyC = {
  numero: 3,
  titulo: "Escribir y conversar en medios digitales",
  proposito:
    "Elegir el medio adecuado para cada mensaje y escribir de forma que el tono, la intención y la información lleguen como queremos, en el correo, el chat y la videollamada.",
  acento: "sky",
  temas: [
    // ────────────────────────────────────────────────────────────────────
    {
      slug: "tono-y-emocion-del-texto",
      titulo: "Tono y emoción del texto",
      subtitulo: "Evitar malentendidos al escribir",
      detonadora:
        "Lee en voz alta «NECESITO EL INFORME PARA HOY!!!». ¿Cómo sonó? ¿Así lo quiso decir quien lo escribió?",
      idea:
        "Al escribir perdemos la voz, la cara y los gestos que en persona aclaran nuestra intención. Por eso el receptor completa el tono a su manera, y con frecuencia lo lee más negativo de lo que quisimos.",
      secciones: [
        {
          titulo: "Creemos que se entiende, pero no",
          parrafos: [
            "Justin Kruger y sus colegas pidieron a varias personas que escribieran mensajes, unos en serio y otros con sarcasmo, y que calcularan si el receptor notaría la diferencia. Quienes escribían confiaban mucho en que sí; en realidad, los receptores acertaron poco más de lo que habrían acertado al azar. La explicación: quien escribe «escucha» su propio tono en la cabeza y supone que el otro también lo oirá (Kruger et al., 2005).",
          ],
        },
        {
          titulo: "El sesgo hacia lo negativo",
          parrafos: [
            "Kristin Byron revisó la investigación sobre las emociones en el correo electrónico y concluyó que los mensajes tienden a leerse más negativos de lo que se escribieron: un mensaje neutro puede parecer frío o molesto, y uno positivo, apenas neutro (Byron, 2008). La brevedad, las mayúsculas y los signos repetidos agravan el problema.",
          ],
        },
        {
          titulo: "Recursos para cuidar el tono",
          parrafos: [
            "Saludar y despedirse. Explicar el porqué de una petición. Usar fórmulas de cortesía («¿podrías…?», «gracias»). Evitar las mayúsculas sostenidas, que se leen como gritos, y los signos repetidos. Releer el mensaje imaginando que lo recibe alguien que está de mal humor. Y si el tema es delicado, preguntarse si no sería mejor una llamada.",
          ],
        },
      ],
      errores: [
        { error: "Escribir en mayúsculas para destacar.", mejor: "Destaca con negritas o poniendo el dato en la primera línea." },
        { error: "Mensajes secos por ahorrar tiempo: «ok», «ya».", mejor: "Una palabra más de contexto evita una conversación de aclaración." },
        { error: "Usar sarcasmo por escrito.", mejor: "Guarda la ironía para la conversación en persona." },
      ],
      ejemplo: {
        contexto: "Pedir un documento urgente.",
        mal: "NECESITO EL INFORME PARA HOY!!!",
        bien: "Hola, buen día. ¿Podrías enviarme el informe hoy antes de las 5? Lo necesito para la reunión de mañana. Muchas gracias.",
        porque: "La urgencia sigue ahí, pero con una razón y con cortesía; ya no suena a enojo.",
      },
      actividad: {
        titulo: "El termómetro del tono",
        pasos: [
          "Tu profesor les dará diez mensajes breves.",
          "Cada quien califica del 1 (muy molesto) al 5 (muy amable) cómo le suena cada uno.",
          "Comparen: ¿dónde hubo más diferencias? Reescriban esos mensajes para que todos los lean igual.",
        ],
        producto: "Tabla de calificaciones del grupo y mensajes corregidos.",
      },
      reflexion: [
        "¿Alguna vez te enojaste por un mensaje que después resultó no tener mala intención?",
        "¿Por qué quien escribe suele creer que su tono es obvio?",
      ],
      fuentes: [F.kruger, F.byron],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "el-asunto-del-correo",
      titulo: "El asunto del correo",
      subtitulo: "La línea que decide si tu mensaje se abre",
      detonadora:
        "Revisa tu bandeja de entrada: ¿qué correos abriste primero y cuáles ignoraste? ¿Qué decía el asunto?",
      idea:
        "El asunto es el título de tu correo: es lo primero que se ve y muchas veces lo único. Uno claro y específico ayuda a que el mensaje se abra, se entienda y se pueda encontrar después.",
      secciones: [
        {
          titulo: "Lo que dice la investigación sobre lectura en pantalla",
          parrafos: [
            "El Nielsen Norman Group, que estudia cómo leen las personas en pantalla, recomienda que el asunto describa con claridad el contenido, que las palabras con información vayan al principio para que no se corten en el teléfono, que no repita lo que ya dice el remitente y que evite los símbolos llamativos (Estes, 2014). Aunque sus consejos se refieren a boletines, valen igual para cualquier correo.",
          ],
        },
        {
          titulo: "Fórmula práctica",
          parrafos: [
            "Qué es + de quién o de qué + cuándo, si hay fecha. Por ejemplo: «Ensayo final – Juan Pérez, 3.º B», «Solicitud de constancia de estudios», «Reunión de equipo: cambio al jueves 10». Si el correo pide una acción, dilo: «Para revisar:», «Urgente:» solo cuando de verdad lo sea.",
          ],
        },
        {
          titulo: "Buenas costumbres",
          parrafos: [
            "Nunca dejes el asunto vacío: muchos filtros lo tratan como sospechoso y el receptor no sabe de qué se trata. Si cambia el tema de una conversación, cambia el asunto. Y no escribas todo el mensaje en el asunto: lo que no cabe en una línea va en el cuerpo del correo.",
          ],
        },
      ],
      errores: [
        { error: "Asunto vacío o genérico: «Hola», «Tarea», «Urgente».", mejor: "Di qué es y de quién: «Tarea 3 de Lengua – Ana López, 1.º A»." },
        { error: "Poner lo importante al final del asunto.", mejor: "Las primeras tres o cuatro palabras son las que se ven en el celular." },
        { error: "Usar mayúsculas y signos: «¡¡¡URGENTE!!!».", mejor: "Si es urgente, explícalo con una fecha: «Entrega hoy a las 5»." },
      ],
      ejemplo: {
        contexto: "Enviar un trabajo al profesor.",
        mal: "tarea",
        bien: "Ensayo sobre barreras de comunicación – Carlos Ruiz, 1.º B",
        porque: "El profesor sabe qué es y de quién sin abrirlo, y puede encontrarlo después con el buscador.",
      },
      actividad: {
        titulo: "Rescate de asuntos",
        pasos: [
          "Copia diez asuntos reales de tu bandeja (sin datos personales de nadie).",
          "Califica cada uno: ¿se entiende sin abrir el correo?",
          "Reescribe los que no pasen la prueba usando la fórmula qué + de quién + cuándo.",
        ],
        producto: "Lista de diez asuntos corregidos.",
      },
      reflexion: [
        "¿Cuántos correos tuyos sin asunto crees que se perdieron o se leyeron tarde?",
        "¿Qué diferencia hay entre el asunto de un correo y el título de un texto?",
      ],
      fuentes: [F.estes],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "correo-o-whatsapp",
      titulo: "¿Correo o WhatsApp?",
      subtitulo: "Elegir el medio según el mensaje",
      detonadora:
        "¿Le mandarías a tu director un audio de WhatsApp para pedir un permiso? ¿Por qué sí o por qué no?",
      idea:
        "No todos los medios sirven para todo. Algunos transmiten mucha información y matices (una conversación en persona); otros son más rápidos pero más pobres (un mensaje de texto). Elegir bien el medio es parte del mensaje.",
      secciones: [
        {
          titulo: "La riqueza de los medios",
          parrafos: [
            "Richard Daft y Robert Lengel propusieron que los medios de comunicación se pueden ordenar según su «riqueza»: cuántas señales permiten (voz, gestos, tono), qué tan rápido hay respuesta y qué tan personal es el mensaje. La conversación cara a cara es el medio más rico; el documento escrito impersonal, el más pobre. Su recomendación: usar medios ricos para situaciones ambiguas o delicadas y medios pobres para información clara y rutinaria (Daft y Lengel, 1986).",
          ],
        },
        {
          titulo: "Correo electrónico",
          parrafos: [
            "Formal, ordenado y fácil de archivar y buscar. Sirve para trámites, entregas, solicitudes a autoridades y todo lo que deba quedar registrado. Lleva asunto, saludo, cuerpo breve, despedida y firma. No exige respuesta inmediata.",
          ],
        },
        {
          titulo: "Mensajería instantánea",
          parrafos: [
            "Rápida e informal. Sirve para coordinar, recordar y resolver dudas breves con personas de confianza. Riesgos: se pierde entre cientos de mensajes, invita a responder sin pensar y a escribir a cualquier hora. En grupos escolares o de trabajo, conviene respetar horarios, no reenviar cadenas y escribir un solo mensaje completo en lugar de diez sueltos.",
          ],
        },
      ],
      errores: [
        { error: "Hacer un trámite formal por WhatsApp.", mejor: "Solicitudes, justificantes y entregas van por correo, que deja constancia." },
        { error: "Discutir un conflicto por chat.", mejor: "Para lo delicado, usa un medio rico: una llamada o una conversación en persona." },
        { error: "Escribir al grupo del trabajo a medianoche.", mejor: "Respeta horarios; programa el mensaje o espera a la mañana." },
      ],
      actividad: {
        titulo: "¿Qué medio elijo?",
        pasos: [
          "Lee diez situaciones (pedir un permiso, avisar que llegas tarde, reclamar una calificación, felicitar a alguien…).",
          "Para cada una, elige el medio más adecuado: en persona, llamada, correo o mensaje.",
          "Justifica tu elección con la idea de riqueza de los medios.",
        ],
        producto: "Tabla de situaciones, medio elegido y justificación.",
      },
      reflexion: [
        "¿Qué mensaje has mandado por un medio equivocado? ¿Qué pasó?",
        "¿Por qué una mala noticia se da mejor en persona?",
      ],
      fuentes: [F.daft],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "movil-o-computadora",
      titulo: "¿Celular o computadora?",
      subtitulo: "Cuándo cada aparato es la herramienta profesional",
      detonadora:
        "¿Has escrito un trabajo largo en el celular? ¿Cómo quedó comparado con uno hecho en computadora?",
      idea:
        "El celular es ideal para comunicarse rápido; la computadora, para producir textos largos y trabajos cuidados. Usar cada uno para lo que sirve mejora la calidad de lo que entregamos y cómo nos perciben.",
      secciones: [
        {
          titulo: "Para qué sirve cada uno",
          parrafos: [
            "Celular: mensajes breves, llamadas, confirmar citas, revisar la agenda, tomar una foto de un pizarrón, responder algo urgente. Computadora: redactar documentos, preparar presentaciones, llenar formularios largos, revisar ortografía y formato, trabajar con varias ventanas a la vez.",
            "Un correo formal escrito en el teléfono suele delatarse: sin saludo, con autocorrecciones raras y con la firma «Enviado desde mi iPhone». Si el mensaje es importante, vale la pena escribirlo con calma en la computadora.",
          ],
        },
        {
          titulo: "Atención dividida",
          parrafos: [
            "Un estudio de la Universidad de Stanford comparó a personas que usan muchos medios a la vez con personas que usan pocos. Las primeras tuvieron más dificultad para ignorar información irrelevante y para cambiar de tarea (Ophir et al., 2009). El estudio no prueba que el celular cause ese efecto, pero invita a preguntarse cuánto nos cuesta concentrarnos con las notificaciones encendidas.",
          ],
        },
        {
          titulo: "Hábitos profesionales",
          parrafos: [
            "Silenciar notificaciones mientras se estudia o trabaja. No usar el celular durante una reunión o una clase, salvo que sea parte de la actividad. Revisar en computadora lo que se redactó en el teléfono antes de enviarlo si es formal.",
          ],
        },
      ],
      errores: [
        { error: "Redactar un trabajo largo en el celular.", mejor: "Usa la computadora para producir; el celular, para comunicar." },
        { error: "Tener el celular a la vista durante una reunión.", mejor: "Guárdalo o ponlo boca abajo y en silencio." },
        { error: "Enviar un correo formal sin revisar el autocorrector.", mejor: "Relee antes de enviar, sobre todo nombres y cifras." },
      ],
      actividad: {
        titulo: "Mi mapa de dispositivos",
        pasos: [
          "Durante un día, anota cada tarea escolar que hiciste y en qué aparato la hiciste.",
          "Marca cuáles habrían salido mejor en otro aparato.",
          "Escribe tres reglas personales sobre cuándo usar cada uno.",
        ],
        producto: "Registro de un día y tus tres reglas.",
      },
      reflexion: [
        "¿Cuántas notificaciones recibes mientras haces una tarea?",
        "¿Qué impresión da un correo formal escrito con prisa desde el celular?",
      ],
      fuentes: [F.ophir],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "etiqueta-en-videoconferencia",
      titulo: "Etiqueta en videoconferencias",
      subtitulo: "Normas de cortesía para las reuniones virtuales",
      detonadora:
        "¿Qué es lo que más te molesta de una clase o reunión en línea? ¿Qué haces tú que podría molestar a otros?",
      idea:
        "Las reuniones virtuales tienen sus propias reglas de cortesía. Conocerlas hace que la conversación fluya, muestra respeto por el tiempo de los demás y reduce el cansancio que producen estas reuniones.",
      secciones: [
        {
          titulo: "La netiqueta no es nueva",
          parrafos: [
            "Desde 1995, la Internet Engineering Task Force publicó unas guías de netiqueta para el correo, los chats y los foros. Entre sus consejos: recordar que quien recibe el mensaje es un ser humano, ser breve sin ser cortante, no escribir en mayúsculas porque parece que se grita, y esperar un día antes de contestar un mensaje que nos hizo enojar (Hambridge, 1995). Las videollamadas heredaron esas normas y agregaron otras.",
          ],
        },
        {
          titulo: "Por qué cansan tanto",
          parrafos: [
            "Jeremy Bailenson, de la Universidad de Stanford, propuso cuatro causas de la llamada fatiga de Zoom: el contacto visual cercano y constante con muchas caras, el esfuerzo extra de enviar e interpretar gestos por una pantalla, verse a uno mismo todo el tiempo como en un espejo y la falta de movimiento al estar fijo frente a la cámara. Sugiere ocultar la vista propia, no poner la ventana a pantalla completa y alternar con momentos de solo audio (Bailenson, 2021).",
          ],
        },
        {
          titulo: "Normas básicas",
          parrafos: [
            "Conectarse puntual y probar audio y cámara antes. Mantener el micrófono apagado cuando no se habla. Usar un nombre de usuario reconocible. Pedir la palabra con la mano virtual o el chat. Cuidar el fondo y la iluminación. No comer ni hacer otra cosa frente a la cámara. Si hay que salir, avisar por el chat.",
          ],
        },
      ],
      errores: [
        { error: "Entrar con un nombre de usuario como «xXgamerXx».", mejor: "Usa tu nombre y apellido para que sepan quién eres." },
        { error: "Dejar el micrófono abierto con ruido de fondo.", mejor: "Silencia el micrófono y actívalo solo al hablar." },
        { error: "Hablar encima de otros.", mejor: "Pide la palabra con la mano virtual y espera tu turno." },
      ],
      actividad: {
        titulo: "Reglamento de la videollamada",
        pasos: [
          "En equipo, redacten diez normas para las videollamadas de su grupo.",
          "Para cada norma, expliquen qué problema evita.",
          "Incluyan al menos una recomendación para reducir la fatiga.",
        ],
        producto: "Reglamento de diez normas con su justificación.",
      },
      reflexion: [
        "¿Por qué cansa más una hora de videollamada que una hora de clase presencial?",
        "¿Qué norma de netiqueta te cuesta más cumplir?",
      ],
      fuentes: [F.rfc1855, F.bailenson],
    },
  ],
};

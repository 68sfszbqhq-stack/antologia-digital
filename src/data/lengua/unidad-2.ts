import type { UnidadLyC } from "./tipos";
import { F } from "./fuentes";

export const unidad2: UnidadLyC = {
  numero: 2,
  titulo: "Comunicarme con los demás",
  proposito:
    "Desarrollar las habilidades que hacen que una conversación funcione: escuchar de verdad, ponerse en el lugar del otro, decir lo que pienso con respeto, preguntar bien y dar o recibir críticas.",
  acento: "rose",
  temas: [
    // ────────────────────────────────────────────────────────────────────
    {
      slug: "escucha-activa-digital",
      titulo: "Escucha activa digital",
      subtitulo: "Prestar atención de verdad, también por pantalla",
      detonadora:
        "¿Cómo te das cuenta de que alguien no te está escuchando aunque diga «ajá»? ¿Y en un chat o una videollamada?",
      idea:
        "Escuchar activamente es atender no solo a las palabras, sino al sentido completo de lo que el otro quiere decir, y demostrarle que lo entendimos. En los medios digitales, donde faltan gestos y contacto visual, esa demostración tiene que ser más explícita.",
      secciones: [
        {
          titulo: "Qué es escuchar activamente",
          parrafos: [
            "Carl Rogers y Richard Farson describieron la escucha activa como un esfuerzo por captar el significado total de un mensaje: el contenido y también los sentimientos que lo acompañan. Proponían responder a esos sentimientos y fijarse en todas las señales, incluidas las no verbales, en lugar de apresurarse a juzgar o aconsejar (Rogers y Farson, 1957).",
            "Un estudio con entrevistas entre compañeros encontró que, cuando quien escucha parafrasea lo que oyó, la otra persona se siente más comprendida que cuando solo recibe un «entiendo» o un consejo (Weger et al., 2010). Parafrasear no es repetir: es devolver la idea con otras palabras para comprobar que la entendimos.",
          ],
        },
        {
          titulo: "El reto de lo digital",
          parrafos: [
            "En un mensaje de texto no vemos la cara del otro; en una videollamada vemos una imagen pequeña y con retraso. Por eso las señales de que estamos escuchando deben decirse: «entiendo que te preocupa la fecha, ¿es así?», «déjame ver si lo capté…».",
            "El enemigo más común es el phubbing, palabra que une phone y snubbing: ignorar a alguien por atender el teléfono. Una investigación mostró que las personas que más lo hacen también suelen ser las que más lo reciben, y que así termina por verse como algo normal (Chotpitayasunondh y Douglas, 2016). Que sea común no quiere decir que no se note: quien habla se da cuenta de que no le están prestando atención.",
          ],
        },
      ],
      errores: [
        { error: "Responder mientras se hace otra cosa.", mejor: "Si no puedes atender ahora, dilo y retoma después: «te leo con calma en 10 minutos»." },
        { error: "Preparar la respuesta mientras el otro todavía habla.", mejor: "Termina de escuchar y parafrasea antes de opinar." },
        { error: "Contestar audios largos con un emoji.", mejor: "Responde a lo principal y, si hubo emociones, reconócelas." },
      ],
      ejemplo: {
        contexto: "Un compañero escribe que no podrá terminar su parte del trabajo.",
        mal: "ok",
        bien: "Entiendo que no te va a dar tiempo con tu parte. ¿Qué te falta y cómo podemos repartirlo?",
        porque: "La segunda respuesta demuestra que se leyó el mensaje completo y abre una solución.",
      },
      actividad: {
        titulo: "Parafrasear antes de responder",
        pasos: [
          "En parejas, una persona cuenta durante dos minutos un problema real pero no delicado.",
          "La otra persona solo puede responder parafraseando: «lo que entiendo es que…».",
          "Cambien de papel y comenten cuándo se sintieron escuchados.",
        ],
        producto: "Tres frases de paráfrasis que te hayan funcionado.",
      },
      reflexion: [
        "¿Cuántas veces al día revisas el teléfono mientras alguien te habla?",
        "¿Qué señales puedes usar en un chat para demostrar que leíste con atención?",
      ],
      fuentes: [F.rogersFarson, F.weger, F.phubbing],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "empatia",
      titulo: "La empatía en la comunicación",
      subtitulo: "Decir la verdad, pero con consideración",
      detonadora:
        "Piensa en alguien que te dio una mala noticia de buena manera. ¿Qué hizo diferente?",
      idea:
        "La empatía es la capacidad de entender lo que otra persona piensa y siente, y de tomarlo en cuenta al comunicarnos. No consiste en evitar la verdad, sino en decirla de forma que el otro pueda recibirla.",
      secciones: [
        {
          titulo: "Una condición para ayudar",
          parrafos: [
            "El psicólogo Carl Rogers consideraba la comprensión empática una de las condiciones necesarias para que una persona cambie y crezca: sentir el mundo del otro «como si» fuera propio, sin perder de vista que no lo es (Rogers, 1957). Aunque lo pensó para la terapia, la idea se aplica al salón, a la familia y al trabajo.",
          ],
        },
        {
          titulo: "La empatía tiene varias caras",
          parrafos: [
            "Mark Davis mostró que la empatía no es una sola habilidad. Distinguió la toma de perspectiva (entender el punto de vista del otro), la preocupación empática (sentir compasión), el malestar personal (angustiarse ante el sufrimiento ajeno) y la fantasía (identificarse con personajes de historias) (Davis, 1983).",
            "Para comunicarnos, la toma de perspectiva es la más útil: nos ayuda a anticipar cómo va a sonar lo que decimos. El malestar personal, en cambio, puede hacer que evitemos la conversación difícil.",
          ],
        },
        {
          titulo: "Empatía en la práctica",
          parrafos: [
            "Reconoce la emoción antes de dar la información («sé que esperabas otra calificación»). Evita frases que minimizan («no es para tanto»). Separa a la persona del problema. Y ofrece un siguiente paso concreto.",
          ],
        },
      ],
      errores: [
        { error: "Confundir empatía con darle la razón a todo.", mejor: "Puedes entender cómo se siente alguien y aun así no estar de acuerdo." },
        { error: "Minimizar: «no te preocupes, no es nada».", mejor: "Nombra la emoción: «entiendo que te preocupe»." },
        { error: "Contar tu propia historia en lugar de escuchar la suya.", mejor: "Primero escucha; tu experiencia puede esperar." },
      ],
      ejemplo: {
        contexto: "Avisar a un compañero que su parte del trabajo tiene errores.",
        mal: "Tu parte está mal, la tuve que rehacer.",
        bien: "Sé que le dedicaste tiempo a tu parte. Encontré dos datos que no coinciden con la fuente; ¿los revisamos juntos?",
        porque: "Reconoce el esfuerzo, señala el problema concreto y propone una solución compartida.",
      },
      actividad: {
        titulo: "Reescribir con empatía",
        pasos: [
          "Lee cinco mensajes bruscos que te dará tu profesor o que inventes a partir de situaciones reales.",
          "Reescribe cada uno manteniendo la información completa pero con toma de perspectiva.",
          "Compara con un compañero: ¿alguno perdió claridad por suavizarlo de más?",
        ],
        producto: "Cinco mensajes reescritos.",
      },
      reflexion: [
        "¿Cuál de las cuatro caras de la empatía se te da más fácil?",
        "¿Cuándo la empatía puede convertirse en evitar decir algo importante?",
      ],
      fuentes: [F.rogers1957, F.davis],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "asertividad",
      titulo: "Asertividad",
      subtitulo: "Comunicación clara, respeto y límites saludables",
      detonadora:
        "Un compañero te pide, otra vez, que hagas su parte del trabajo. ¿Qué respondes? ¿Qué te gustaría responder?",
      idea:
        "La asertividad es expresar lo que pienso, siento y necesito de manera directa y honesta, respetando al mismo tiempo los derechos de los demás. Está entre dos extremos: quedarse callado (pasividad) e imponerse (agresividad).",
      secciones: [
        {
          titulo: "Un derecho y una habilidad",
          parrafos: [
            "Robert Alberti y Michael Emmons popularizaron la idea de que toda persona tiene derecho a expresarse y a defender sus intereses sin pasar por encima de los demás, y de que esa conducta se puede aprender (Alberti y Emmons, 1970).",
            "Una revisión más reciente recuerda que el entrenamiento en asertividad cuenta con respaldo de la investigación para mejorar la manera en que las personas se relacionan, aunque se use menos de lo que se debería (Speed et al., 2018).",
          ],
        },
        {
          titulo: "Tres estilos",
          parrafos: [
            "Pasivo: no expreso lo que pienso para evitar el conflicto; acumulo molestia. Agresivo: expreso lo que pienso sin respeto; gano la discusión pero daño la relación. Asertivo: expreso lo que pienso con claridad y respeto; puedo no obtener lo que quiero, pero el otro sabe dónde estoy.",
          ],
        },
        {
          titulo: "Herramientas",
          parrafos: [
            "Hablar en primera persona («yo necesito», «a mí me preocupa») en lugar de acusar («tú siempre»). Describir hechos concretos en lugar de etiquetas. Decir «no» sin dar diez justificaciones. Proponer una alternativa. Mantener un tono y un volumen tranquilos.",
          ],
        },
      ],
      errores: [
        { error: "Confundir asertividad con decir todo lo que pienso sin filtro.", mejor: "Ser asertivo incluye respetar al otro; no es permiso para herir." },
        { error: "Pedir perdón por poner un límite.", mejor: "Pon el límite con calma y sin culpa: «esta vez no puedo»." },
        { error: "Hablar de la persona en vez de la conducta.", mejor: "«Cuando llegas tarde a las reuniones» en lugar de «eres un irresponsable»." },
      ],
      ejemplo: {
        contexto: "Te piden otra vez que hagas la parte de otro.",
        mal: "Pasivo: «Bueno, está bien…». Agresivo: «¡Siempre es lo mismo contigo, hazlo tú!».",
        bien: "Esta vez no puedo hacer tu parte porque tengo la mía. Si te atoras, te explico cómo la hice yo.",
        porque: "Dice que no con claridad, da una razón breve y ofrece una alternativa sin atacar.",
      },
      actividad: {
        titulo: "Del «tú siempre» al «yo necesito»",
        pasos: [
          "Escribe tres situaciones en las que te costó decir que no o te enojaste.",
          "Para cada una, redacta la respuesta pasiva, la agresiva y la asertiva.",
          "Ensaya en voz alta la asertiva con un compañero.",
        ],
        producto: "Tabla de tres situaciones con los tres estilos de respuesta.",
      },
      reflexion: [
        "¿Con quién te cuesta más ser asertivo: con amigos, con familia o con autoridades?",
        "¿Qué pierdes cuando eres pasivo? ¿Y cuando eres agresivo?",
      ],
      fuentes: [F.alberti, F.speed],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "el-arte-de-preguntar",
      titulo: "El arte de preguntar",
      subtitulo: "Preguntas que aclaran, profundizan y acercan",
      detonadora:
        "¿Cuál fue la última pregunta que te hicieron y que te hizo pensar de verdad?",
      idea:
        "Preguntar bien es una habilidad: sirve para comprender, para aprender y para conectar con los demás. No se trata solo de pedir una respuesta, sino de mostrar interés genuino y abrir el diálogo.",
      secciones: [
        {
          titulo: "Preguntar genera simpatía",
          parrafos: [
            "Un equipo de la Universidad de Harvard analizó conversaciones reales, incluidas citas rápidas, y encontró que las personas que hacían más preguntas caían mejor a sus interlocutores. El efecto era mayor con las preguntas de seguimiento, las que retoman lo que el otro acaba de decir, porque demuestran que se le escuchó (Huang et al., 2017).",
          ],
        },
        {
          titulo: "Tipos de preguntas",
          parrafos: [
            "Alison Wood Brooks y Leslie John recomiendan preferir las preguntas abiertas («¿cómo te fue con…?») a las cerradas de sí o no cuando se quiere conocer a alguien, y cuidar el orden y el tono: en una relación que empieza conviene ir de lo sencillo a lo más personal (Brooks y John, 2018).",
            "Otras distinciones útiles: preguntas para aclarar («¿a qué te refieres con…?»), para profundizar («¿por qué crees que pasó?»), para comprobar («entonces, ¿lo entrego el jueves?») y para reflexionar («¿qué harías distinto?»).",
          ],
        },
        {
          titulo: "Preguntar en clase",
          parrafos: [
            "Muchos estudiantes no preguntan por miedo a parecer ignorantes. Pero una buena pregunta demuestra que se ha estado pensando. Una fórmula sencilla: di qué entendiste y señala exactamente dónde te perdiste. «Entendí que el párrafo tiene una idea principal; lo que no me queda claro es cómo distinguirla de una secundaria.»",
          ],
        },
      ],
      errores: [
        { error: "Hacer preguntas que ya contienen la respuesta: «¿verdad que está bien así?».", mejor: "Pregunta de forma abierta: «¿qué le cambiarías?»." },
        { error: "Encadenar preguntas como interrogatorio.", mejor: "Pregunta, escucha y haz una pregunta de seguimiento sobre lo que te dijeron." },
        { error: "Quedarse con la duda por pena.", mejor: "Di qué entendiste y en qué punto exacto te perdiste." },
      ],
      actividad: {
        titulo: "Entrevista con seguimiento",
        pasos: [
          "Entrevista a un compañero durante cinco minutos sobre un pasatiempo suyo.",
          "Por cada respuesta, haz al menos una pregunta de seguimiento.",
          "Al final, anota cuáles preguntas dieron las respuestas más interesantes y por qué.",
        ],
        producto: "Lista de preguntas clasificadas en abiertas, cerradas y de seguimiento.",
      },
      reflexion: [
        "¿Qué te impide preguntar en clase?",
        "¿Qué diferencia notas cuando alguien te hace una pregunta de seguimiento?",
      ],
      fuentes: [F.huang, F.brooksJohn],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "retroalimentacion",
      titulo: "Dar y recibir retroalimentación",
      subtitulo: "Una crítica no te hace menos: te da información para mejorar",
      detonadora:
        "Cuando alguien te dice «esto se puede mejorar», ¿qué es lo primero que sientes? ¿Y lo primero que haces?",
      idea:
        "La retroalimentación es información sobre lo que hicimos que nos ayuda a acercarnos a una meta. Bien dada, mejora el desempeño; mal dada, puede empeorarlo. Y saber recibirla es tan importante como saber darla.",
      secciones: [
        {
          titulo: "No toda retroalimentación ayuda",
          parrafos: [
            "Avraham Kluger y Angelo DeNisi reunieron cientos de estudios y encontraron que, en promedio, la retroalimentación mejora el desempeño, pero en más de un tercio de los casos lo empeoró. Uno de los factores clave: cuando el comentario apunta a la persona («eres descuidado») en lugar de la tarea, la atención se va a defender la autoestima y no a mejorar el trabajo (Kluger y DeNisi, 1996).",
          ],
        },
        {
          titulo: "Tres preguntas",
          parrafos: [
            "John Hattie y Helen Timperley proponen que una retroalimentación útil responde tres preguntas: ¿a dónde voy? (la meta), ¿cómo voy? (el avance respecto a esa meta) y ¿qué sigue? (el siguiente paso). También señalan que el elogio a la persona («qué inteligente») es de las formas menos eficaces, porque no dice nada sobre la tarea (Hattie y Timperley, 2007).",
          ],
        },
        {
          titulo: "Cómo recibirla",
          parrafos: [
            "Las reacciones más comunes son ponerse a la defensiva, tomarlo como algo personal o hacerse la víctima. Ayuda escuchar sin interrumpir, respirar antes de responder, preguntar para entender («¿qué parte exactamente?»), agradecer y, después, decidir con calma qué tomar y qué dejar. No toda crítica es perfecta, pero casi siempre contiene algo útil.",
          ],
        },
      ],
      errores: [
        { error: "Criticar a la persona: «eres flojo».", mejor: "Describe la tarea: «faltan las fuentes en la página 2»." },
        { error: "Dar solo elogios vagos: «muy bien».", mejor: "Di qué estuvo bien y por qué, para que se repita." },
        { error: "Defenderse antes de terminar de escuchar.", mejor: "Escucha completo, pregunta y agradece; decide después." },
      ],
      ejemplo: {
        contexto: "Comentar la exposición de un compañero.",
        mal: "Estuvo aburrida.",
        bien: "Tu tema quedó claro en la primera diapositiva (meta). Después leíste mucho texto y el grupo se distrajo (avance). Para la próxima, prueba con tres ideas por diapositiva y explícalas con tus palabras (siguiente paso).",
        porque: "Se centra en la tarea y responde las tres preguntas de Hattie y Timperley.",
      },
      actividad: {
        titulo: "Coevaluación con tres preguntas",
        pasos: [
          "Intercambia con un compañero un texto o trabajo reciente.",
          "Escribe tu retroalimentación respondiendo: ¿a dónde va?, ¿cómo va?, ¿qué sigue?",
          "Al recibir la tuya, escribe una respuesta de agradecimiento y un cambio concreto que harás.",
        ],
        producto: "Retroalimentación escrita y tu plan de mejora.",
      },
      reflexion: [
        "¿Recuerdas alguna crítica que te dolió pero que después te sirvió?",
        "¿Por qué el elogio «qué inteligente eres» ayuda menos que «tu conclusión retoma bien tu argumento»?",
      ],
      fuentes: [F.kluger, F.hattie],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "comunicacion-en-crisis",
      titulo: "Comunicación en crisis",
      subtitulo: "Cómo comunicar un problema de forma responsable",
      detonadora:
        "Si mañana se cancelara el viaje escolar que todos esperaban, ¿cómo te gustaría enterarte? ¿Qué te molestaría?",
      idea:
        "Cuando algo sale mal, la forma de comunicarlo puede calmar o agravar la situación. Una comunicación responsable informa pronto, con la verdad, cuida primero a las personas afectadas y dice qué se va a hacer.",
      secciones: [
        {
          titulo: "Primero las personas",
          parrafos: [
            "W. Timothy Coombs, autor de la teoría situacional de la comunicación de crisis, sostiene que lo primero es dar a los afectados la información que necesitan para protegerse y expresar interés por lo que les pasó; solo después se atiende la reputación de la organización (Coombs, 2007).",
            "Coombs explica que la gente juzga una crisis según cuánta responsabilidad le atribuye a quien la causó: no es lo mismo ser víctima de un fenómeno natural que haber cometido un error evitable. A más responsabilidad atribuida, más necesario es reconocerla y ofrecer reparación.",
          ],
        },
        {
          titulo: "Estrategias de reparación",
          parrafos: [
            "William Benoit clasificó las respuestas posibles ante una acusación: negar, evadir la responsabilidad, reducir la gravedad del hecho, tomar medidas correctivas y la mortificación, es decir, reconocer la culpa y pedir perdón (Benoit, 1997). Cuando el error fue real, negar o culpar a otros suele empeorar la situación en cuanto salen a la luz los hechos.",
          ],
        },
        {
          titulo: "Una estructura sencilla",
          parrafos: [
            "Qué pasó (hechos, sin adornos), a quién afecta, qué deben hacer las personas ahora, qué estamos haciendo nosotros, y cuándo volveremos a informar. Un solo vocero, mensajes consistentes y nada de especulaciones.",
          ],
        },
      ],
      errores: [
        { error: "Esperar a tener toda la información para decir algo.", mejor: "Informa pronto lo que se sabe y cuándo habrá más datos." },
        { error: "Culpar a otros o minimizar.", mejor: "Si hubo un error propio, reconócelo y di cómo se va a corregir." },
        { error: "Que cada quien diga una versión distinta.", mejor: "Acordar un mensaje y una persona que lo comunique." },
      ],
      ejemplo: {
        contexto: "Se perdieron los trabajos de un grupo por una falla en la plataforma.",
        mal: "Hubo un problema técnico ajeno a nosotros. Vuelvan a subir todo.",
        bien: "El martes, una falla en la plataforma borró los trabajos subidos entre las 8 y las 10. Si subiste en ese horario, vuelve a enviarlo antes del viernes; no habrá penalización. Estamos revisando cómo evitar que se repita y les avisamos el lunes.",
        porque: "Dice qué pasó, a quién afecta, qué hacer, qué se está haciendo y cuándo habrá más información.",
      },
      actividad: {
        titulo: "Comunicado de crisis",
        pasos: [
          "En equipo, elijan una crisis escolar ficticia (se suspende un evento, se filtra un examen, falla el transporte).",
          "Redacten el comunicado siguiendo la estructura: qué pasó, a quién afecta, qué hacer, qué hacemos, cuándo informamos.",
          "Otro equipo lo evalúa: ¿qué estrategia de Benoit usaron?",
        ],
        producto: "Comunicado de 150 palabras con su análisis.",
      },
      reflexion: [
        "¿Recuerdas una disculpa pública que te pareció sincera? ¿Y una que no?",
        "¿Por qué quedarse callado durante una crisis también es una forma de comunicar?",
      ],
      fuentes: [F.coombs, F.benoit],
    },
  ],
};

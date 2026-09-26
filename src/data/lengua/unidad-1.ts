import type { UnidadLyC } from "./tipos";
import { F } from "./fuentes";

export const unidad1: UnidadLyC = {
  numero: 1,
  titulo: "El proceso comunicativo y sus barreras",
  proposito:
    "Entender qué pasa entre que alguien quiere decir algo y otra persona lo entiende, y reconocer los obstáculos que se atraviesan en el camino.",
  acento: "amber",
  temas: [
    // ────────────────────────────────────────────────────────────────────
    {
      slug: "intencion-comunicativa",
      titulo: "Intención comunicativa",
      subtitulo: "Informar, convencer, entretener: para qué hablo antes de cómo hablo",
      detonadora:
        "Si mandas el mismo mensaje «mañana no hay clase» a tu grupo de amigos y al grupo oficial del salón, ¿lo escribirías igual? ¿Por qué no?",
      idea:
        "Todo mensaje tiene un propósito. Cuando sabemos cuál es, elegimos mejor el tono, las palabras y el medio; cuando no lo sabemos, el receptor tiene que adivinarlo.",
      secciones: [
        {
          titulo: "Hablar también es hacer",
          parrafos: [
            "El filósofo J. L. Austin observó que muchas frases no describen el mundo sino que actúan sobre él: «prometo entregarlo el lunes», «te pido una disculpa» o «queda abierta la sesión» no informan de algo, lo realizan (Austin, 1962). Por eso, antes de redactar, conviene preguntarse qué queremos que ocurra cuando la otra persona lea o escuche.",
            "Roman Jakobson propuso que cada mensaje puede cumplir varias funciones y que casi siempre una domina: la referencial (informar sobre algo), la emotiva (expresar lo que siente quien habla), la conativa (buscar que el otro haga algo), la fática (abrir o mantener el contacto, como «¿me escuchan?»), la metalingüística (explicar el propio código, como «“asertivo” quiere decir…») y la poética (cuidar la forma misma del mensaje) (Jakobson, 1960).",
          ],
        },
        {
          titulo: "Informar o entretener",
          parrafos: [
            "Cuando la intención es informar, lo importante es la precisión: datos verificables, orden lógico y un tono sereno. Un chiste mal colocado en un aviso de seguridad le resta credibilidad.",
            "Cuando la intención es entretener o integrar a un grupo, el tono ameno, las anécdotas y el humor ayudan a crear confianza. El problema aparece al mezclar sin darse cuenta: un tono demasiado serio en una dinámica de integración la vuelve rígida, y uno demasiado ligero en un reporte hace que nadie lo tome en serio.",
          ],
        },
      ],
      errores: [
        { error: "Empezar a escribir sin saber qué respuesta se espera.", mejor: "Antes de redactar, completa la frase «Después de leer esto, quiero que la otra persona…»." },
        { error: "Usar el mismo tono para todo.", mejor: "Ajusta el registro: serio para informar y decidir, ameno para integrar y motivar." },
        { error: "Esconder la petición al final de un mensaje largo.", mejor: "Si la función es conativa (que el otro haga algo), dilo en la primera línea." },
      ],
      ejemplo: {
        contexto: "Avisar al grupo que cambió la fecha de entrega.",
        mal: "Oigan jaja fíjense que al profe se le ocurrió algo, ya luego les cuento bien 😅",
        bien: "Cambio de fecha: el ensayo se entrega el viernes 3, no el lunes 30. El formato es el mismo.",
        porque: "La intención era informar. El segundo mensaje da el dato completo en la primera línea y no obliga a preguntar.",
      },
      actividad: {
        titulo: "Un mensaje, tres intenciones",
        pasos: [
          "Elige un hecho sencillo de la escuela (por ejemplo, la próxima feria de ciencias).",
          "Escribe tres versiones: una para informar, una para convencer a alguien de participar y una para entretener.",
          "Señala en cada versión qué función de Jakobson domina y qué palabras la delatan.",
        ],
        producto: "Tres mensajes breves con su función identificada.",
      },
      reflexion: [
        "¿Qué mensaje reciente tuyo fue malinterpretado porque no quedaba clara su intención?",
        "¿En qué situaciones de la escuela conviene cambiar de un tono serio a uno ameno?",
      ],
      fuentes: [F.austin, F.jakobson],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "adaptacion-a-la-audiencia",
      titulo: "Adaptación a la audiencia",
      subtitulo: "El mismo mensaje no llega igual a todas las personas",
      detonadora:
        "¿Cómo le explicarías qué es una red social a tu abuela, a un niño de ocho años y a tu maestro de informática?",
      idea:
        "Comunicar bien no es decir lo que yo sé, sino lograr que la otra persona lo entienda. Para eso hay que ajustar el vocabulario, los ejemplos y el nivel de detalle a quien escucha, sin cambiar el fondo del mensaje.",
      secciones: [
        {
          titulo: "Una idea con 2,400 años",
          parrafos: [
            "Aristóteles ya advertía en su Retórica que un discurso se construye pensando en quien lo recibe. Distinguía tres formas de convencer: el ethos (la credibilidad de quien habla), el pathos (las emociones del público) y el logos (los argumentos). Las tres dependen de conocer a la audiencia: lo que a un grupo le parece creíble o emotivo, a otro puede no decirle nada (Aristóteles, trad. 1990).",
          ],
        },
        {
          titulo: "Acercarse o alejarse",
          parrafos: [
            "La teoría de la acomodación comunicativa, desarrollada por Howard Giles y sus colegas, estudia cómo ajustamos nuestra forma de hablar según con quién estamos. Cuando nos acercamos al estilo del otro (convergencia) solemos generar simpatía y comprensión; cuando marcamos distancia (divergencia) señalamos diferencia o jerarquía (Giles et al., 1991).",
            "Acomodarse no significa imitar. Un adulto que usa jerga juvenil que no domina suele parecer forzado. La convergencia útil es la que ajusta el nivel de tecnicismo, la velocidad y los ejemplos para que el otro pueda seguirnos.",
          ],
        },
        {
          titulo: "Preguntas para conocer a tu público",
          parrafos: [
            "¿Qué sabe ya del tema? ¿Qué le interesa o le preocupa? ¿Cuánto tiempo y atención tiene? ¿Qué palabras usa? ¿Qué espera de mí? Con esas respuestas decides qué explicar, qué dar por sabido y qué ejemplo elegir.",
          ],
        },
      ],
      errores: [
        { error: "Explicar a todos con el mismo nivel técnico.", mejor: "Empieza por lo que tu audiencia ya conoce y construye desde ahí." },
        { error: "Confundir adaptarse con simplificar de más o con imitar.", mejor: "Cambia la forma (ejemplos, vocabulario, ritmo), no la verdad del contenido." },
        { error: "Suponer que el público piensa como uno.", mejor: "Pregunta, observa reacciones y ajusta sobre la marcha." },
      ],
      ejemplo: {
        contexto: "Explicar qué es la contraseña de dos pasos.",
        mal: "Es un segundo factor de autenticación basado en un OTP que se genera por TOTP.",
        bien: "Además de tu contraseña, la aplicación te pide un código que llega a tu teléfono. Si alguien roba tu contraseña, sin tu teléfono no puede entrar.",
        porque: "La segunda versión usa un ejemplo concreto y cotidiano para una audiencia que no es técnica.",
      },
      actividad: {
        titulo: "Tres públicos, un tema",
        pasos: [
          "Elige un tema que domines (un deporte, un videojuego, una receta).",
          "Explícalo en un párrafo para: un niño de primaria, una persona adulta que no lo conoce y alguien experto.",
          "Subraya qué cambiaste en cada versión: palabras, ejemplos o nivel de detalle.",
        ],
        producto: "Tres párrafos comparados con los cambios señalados.",
      },
      reflexion: [
        "¿Cuál de los tres recursos de Aristóteles (ethos, pathos, logos) usas más cuando quieres convencer a alguien?",
        "Recuerda una clase o video que no entendiste: ¿qué le faltó al expositor para adaptarse a ti?",
      ],
      fuentes: [F.aristoteles, F.giles],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "barreras-semanticas",
      titulo: "Barreras semánticas",
      subtitulo: "Cuando las mismas palabras no significan lo mismo",
      detonadora:
        "Si alguien te dice «ahorita lo hago», ¿cuándo esperas que lo haga? Pregunta a tres compañeros y compara respuestas.",
      idea:
        "Las palabras no traen el significado pegado: cada persona lo interpreta desde su experiencia, su cultura y el contexto. Cuando emisor y receptor no comparten el significado, el mensaje llega, pero se entiende otra cosa.",
      secciones: [
        {
          titulo: "El triángulo del significado",
          parrafos: [
            "C. K. Ogden e I. A. Richards explicaron que entre una palabra y la cosa a la que se refiere no hay un vínculo directo: la conexión pasa siempre por el pensamiento de quien la usa. Por eso «ahorita», «tarde» o «formal» pueden evocar ideas distintas en dos personas (Ogden y Richards, 1923).",
          ],
        },
        {
          titulo: "Fuentes típicas de confusión",
          parrafos: [
            "Tecnicismos que el receptor no domina; palabras con varios significados (polisemia); regionalismos y jerga de un grupo; abreviaturas y siglas sin explicar; y términos vagos como «pronto», «bien hecho» o «algo breve».",
            "Estas barreras causan errores en instrucciones, pérdida de tiempo, conflictos y la frustración de sentir que «no nos entendemos», aunque ambas partes hablen el mismo idioma.",
          ],
        },
        {
          titulo: "Cómo reducirlas",
          parrafos: [
            "Usa palabras concretas y medibles («el viernes a las 12:00», no «pronto»). Define los términos técnicos la primera vez que los uses. Da un ejemplo. Y, sobre todo, pide que la otra persona te devuelva el mensaje con sus palabras: si su paráfrasis no coincide con lo que querías decir, encontraste la barrera a tiempo.",
          ],
        },
      ],
      errores: [
        { error: "Suponer que si yo lo entiendo, el otro también.", mejor: "Verifica con una pregunta: «¿cómo lo harías tú?»." },
        { error: "Usar términos vagos en instrucciones.", mejor: "Cambia «pronto» por una fecha y «breve» por un número de palabras o minutos." },
        { error: "Usar siglas sin explicarlas.", mejor: "La primera vez, escribe el nombre completo y la sigla entre paréntesis." },
      ],
      ejemplo: {
        contexto: "Instrucciones de una tarea.",
        mal: "Hagan un resumen breve del texto para la próxima.",
        bien: "Resumen del texto de 150 a 200 palabras, a mano, para el jueves 9 al inicio de la clase.",
        porque: "«Breve» y «la próxima» significan cosas distintas para cada alumno; la segunda versión no deja espacio a interpretaciones.",
      },
      actividad: {
        titulo: "Cazadores de ambigüedad",
        pasos: [
          "Reúne cinco instrucciones reales que hayas recibido (de la escuela, de casa, del trabajo).",
          "Marca las palabras que podrían entenderse de más de una forma.",
          "Reescribe cada instrucción para que solo admita una interpretación.",
        ],
        producto: "Tabla con la instrucción original, la palabra ambigua y la versión corregida.",
      },
      reflexion: [
        "¿Qué palabra de tu grupo de amigos tendría que explicarle a un adulto para que te entienda?",
        "¿Por qué pedir que el otro repita con sus palabras es más útil que preguntar «¿me entendiste?»?",
      ],
      fuentes: [F.ogden],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "barreras-fisicas-y-tecnicas",
      titulo: "Barreras físicas y técnicas",
      subtitulo: "El ruido, la distancia y la mala conexión también comunican",
      detonadora:
        "¿Qué fue lo último que no pudiste escuchar o leer bien por culpa del lugar o del aparato: una videollamada que se cortó, un salón con eco, un audio saturado?",
      idea:
        "Algunos obstáculos no dependen de quien habla ni de quien escucha, sino del entorno o del medio. Prevenirlos es parte de comunicar con responsabilidad.",
      secciones: [
        {
          titulo: "El ruido según Shannon",
          parrafos: [
            "En 1948, el ingeniero Claude Shannon describió la comunicación como una cadena: una fuente produce un mensaje, un transmisor lo convierte en señal, la señal viaja por un canal, un receptor la vuelve a convertir en mensaje y este llega a su destino. En el canal aparece el ruido, cualquier interferencia que altera la señal (Shannon, 1948).",
            "Aunque su modelo pensaba en teléfonos y telégrafos, la idea sirve para cualquier situación: el ruido puede ser un camión que pasa, un micrófono de mala calidad o una imagen que no carga.",
          ],
        },
        {
          titulo: "Dos familias de barreras",
          parrafos: [
            "Físicas: ruido ambiental, distancia, mala iluminación, temperatura incómoda, mobiliario que impide ver al que habla, interrupciones.",
            "Técnicas: conexión inestable, equipo sin batería, audio o video de mala calidad, plataformas que el receptor no sabe usar, archivos en formatos que no se abren.",
          ],
        },
        {
          titulo: "Prevenir antes que corregir",
          parrafos: [
            "Probar el equipo antes, tener un plan B (enviar la presentación en PDF, llevar una copia impresa), elegir un lugar tranquilo, hablar de frente y a un volumen suficiente, y confirmar al inicio que todos ven y oyen bien.",
          ],
        },
      ],
      errores: [
        { error: "Descubrir el problema técnico frente al público.", mejor: "Haz una prueba completa minutos antes: audio, video, archivo y conexión." },
        { error: "Depender de un solo medio.", mejor: "Ten un respaldo: PDF, memoria USB o la presentación en tu correo." },
        { error: "Seguir hablando aunque haya ruido.", mejor: "Pausa, espera o cambia de lugar; lo que no se oye no se comunicó." },
      ],
      actividad: {
        titulo: "Lista de verificación",
        pasos: [
          "Piensa en tu próxima exposición o videollamada.",
          "Escribe todas las barreras físicas y técnicas que podrían aparecer.",
          "Para cada una, anota cómo prevenirla y qué harías si ocurre de todos modos.",
        ],
        producto: "Una lista de verificación de 8 a 10 puntos para usar antes de exponer.",
      },
      reflexion: [
        "¿Qué barrera técnica es la más frecuente en tu escuela o en tu casa?",
        "¿Qué responsabilidad tiene el emisor cuando el receptor no puede escuchar bien?",
      ],
      fuentes: [F.shannon],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "barreras-psicologicas",
      titulo: "Barreras psicológicas",
      subtitulo: "El miedo a hablar en público y cómo trabajarlo",
      detonadora:
        "¿Qué sientes en el cuerpo justo antes de pasar al frente a exponer? Escríbelo en tres palabras.",
      idea:
        "A veces sabemos el tema, pero los nervios, el miedo al error o a la crítica nos bloquean. Estas barreras son internas, son muy comunes y se pueden trabajar con acciones concretas.",
      secciones: [
        {
          titulo: "La aprensión comunicativa",
          parrafos: [
            "James McCroskey llamó aprensión comunicativa al miedo o la ansiedad ante una comunicación real o anticipada con otras personas. Puede presentarse solo en ciertas situaciones, como exponer frente a un grupo, o de forma más general (McCroskey, 1977).",
            "Graham Bodie revisó décadas de investigación sobre la ansiedad al hablar en público y describe cómo se combina lo que ocurre en el cuerpo (corazón acelerado, temblor) con lo que ocurre en la mente (pensamientos repetitivos sobre fallar). También reúne los tratamientos que han mostrado utilidad: exponerse de manera gradual, cambiar la forma de interpretar la situación y entrenar habilidades para hablar en público (Bodie, 2010).",
          ],
        },
        {
          titulo: "Nervios que se pueden aprovechar",
          parrafos: [
            "Alison Wood Brooks comparó qué pasa cuando las personas intentan calmarse antes de hablar en público y qué pasa cuando se dicen a sí mismas «estoy emocionado». Quienes reinterpretaron los nervios como emoción se sintieron más entusiasmados y dieron discursos que los evaluadores calificaron como más persuasivos y seguros (Brooks, 2014). La activación del cuerpo no desaparece, pero se le puede dar otro significado.",
          ],
        },
        {
          titulo: "Acciones que sí funcionan",
          parrafos: [
            "No memorizar todo: aprender bien el inicio y las ideas clave. Ensayar en voz alta, primero a solas y luego con una o dos personas. Hablar más despacio. Proponerse una meta realista («que entiendan la idea principal») en lugar de «que salga perfecto». Y aceptar que un error pequeño casi nunca lo nota el público tanto como uno.",
          ],
        },
      ],
      errores: [
        { error: "Creer que hay que eliminar los nervios por completo.", mejor: "Acepta la activación y dale otro nombre: «estoy emocionado, esto me importa»." },
        { error: "Memorizar el texto palabra por palabra.", mejor: "Memoriza el inicio y el orden de las ideas; lo demás, dilo con tus palabras." },
        { error: "Evitar exponer para no pasar el mal rato.", mejor: "Exponte poco a poco: primero a un amigo, luego a un equipo, luego al grupo." },
      ],
      actividad: {
        titulo: "Ensayo por escalones",
        pasos: [
          "Prepara una exposición de dos minutos sobre un tema que te guste.",
          "Preséntala primero grabándote en audio, después a una persona y después a un equipo de cuatro.",
          "Después de cada intento, anota del 1 al 10 qué tan nervioso estabas y qué salió mejor que la vez anterior.",
        ],
        producto: "Registro de tres ensayos con tu nivel de nervios y tus avances.",
      },
      reflexion: [
        "¿Qué pensamiento te pasa por la cabeza antes de exponer? ¿Es un hecho o una suposición?",
        "¿Qué diferencia hay entre decirte «cálmate» y «estoy emocionado»?",
      ],
      fuentes: [F.mccroskey, F.bodie, F.brooks2014],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "barreras-culturales",
      titulo: "Barreras culturales",
      subtitulo: "Costumbres, valores y maneras distintas de decir las cosas",
      detonadora:
        "En tu familia, ¿se dice «no» directamente o se da una vuelta? ¿Qué pasa cuando conoces a alguien que lo hace al revés?",
      idea:
        "Cada cultura tiene reglas no escritas sobre cómo hablar, cuánto decir de forma directa, cómo mostrar respeto o cómo tratar la jerarquía. Cuando dos personas siguen reglas distintas sin saberlo, aparecen malentendidos.",
      secciones: [
        {
          titulo: "Culturas de alto y bajo contexto",
          parrafos: [
            "El antropólogo Edward T. Hall distinguió entre culturas de alto contexto, donde gran parte del significado está en lo que no se dice (la relación, el tono, la situación), y culturas de bajo contexto, donde se espera que el mensaje explícito lo diga todo (Hall, 1976). Una persona acostumbrada a lo explícito puede sentir que la otra «no es clara»; y la otra puede sentir que la primera «es brusca».",
          ],
        },
        {
          titulo: "Las dimensiones de Hofstede",
          parrafos: [
            "Geert Hofstede comparó culturas nacionales en seis dimensiones: la distancia al poder (cuánto se acepta la jerarquía), la evitación de la incertidumbre, el individualismo frente al colectivismo, la orientación a los logros frente al cuidado, la orientación a largo o a corto plazo, y la indulgencia frente a la contención (Hofstede, 2011).",
            "El propio Hofstede advierte que estas dimensiones describen tendencias de sociedades, no de individuos: sirven para entender contextos, nunca para encasillar a una persona.",
          ],
        },
        {
          titulo: "Dentro de un mismo país",
          parrafos: [
            "Las barreras culturales no solo aparecen con extranjeros. Entre regiones, generaciones, comunidades indígenas y urbanas, o entre la escuela y el trabajo, cambian las formas de saludar, de pedir, de tratar a los mayores y de expresar desacuerdo. Reconocerlo es el primer paso para no juzgar como grosería lo que solo es una costumbre distinta.",
          ],
        },
      ],
      errores: [
        { error: "Juzgar como mala educación una costumbre diferente.", mejor: "Pregúntate si es una regla cultural distinta antes de sacar conclusiones." },
        { error: "Usar estereotipos para explicar a una persona.", mejor: "Las tendencias culturales describen grupos; cada persona es particular." },
        { error: "Hacer bromas sobre el origen, la lengua o las costumbres de alguien.", mejor: "Muestra curiosidad respetuosa: pregunta y escucha." },
      ],
      actividad: {
        titulo: "Mapa de costumbres",
        pasos: [
          "Entrevista a una persona de otra región, otra generación u otra comunidad.",
          "Pregúntale cómo se saluda, cómo se pide un favor y cómo se dice «no» en su entorno.",
          "Compara sus respuestas con las tuyas y ubica cada costumbre como de alto o de bajo contexto.",
        ],
        producto: "Cuadro comparativo de costumbres comunicativas con tu análisis.",
      },
      reflexion: [
        "¿Tu familia se comunica más con lo explícito o con lo implícito?",
        "¿Qué malentendido has vivido que ahora puedas explicar como barrera cultural?",
      ],
      fuentes: [F.hall, F.hofstede],
    },
  ],
};

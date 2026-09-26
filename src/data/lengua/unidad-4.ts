import type { UnidadLyC } from "./tipos";
import { F } from "./fuentes";

export const unidad4: UnidadLyC = {
  numero: 4,
  titulo: "Presentar ideas",
  proposito:
    "Preparar mensajes orales, visuales y sonoros que se entiendan y se recuerden: desde presentarse en un minuto hasta diseñar diapositivas y producir audio.",
  acento: "emerald",
  temas: [
    // ────────────────────────────────────────────────────────────────────
    {
      slug: "elevator-pitch",
      titulo: "El elevator pitch",
      subtitulo: "Presentarte a ti o a tu idea en menos de un minuto",
      detonadora:
        "Si te encontraras en el elevador con la persona que puede darte el trabajo de tus sueños, ¿qué le dirías antes de que se abran las puertas?",
      idea:
        "El elevator pitch es una presentación breve y persuasiva, de entre 30 y 60 segundos, en la que dices quién eres, qué haces o qué propones y por qué debería importarle a quien te escucha. Su nombre viene de la idea de caber en un viaje de elevador.",
      secciones: [
        {
          titulo: "Ideas que se quedan",
          parrafos: [
            "Chip y Dan Heath estudiaron por qué algunas ideas se recuerdan y otras se olvidan. Encontraron seis rasgos comunes: son simples, tienen algo inesperado, son concretas, resultan creíbles, despiertan una emoción y a menudo se cuentan como historia (Heath y Heath, 2007). Un buen pitch usa varios de ellos en muy poco tiempo.",
          ],
        },
        {
          titulo: "Ethos, pathos y logos en un minuto",
          parrafos: [
            "Los tres recursos que describió Aristóteles también sirven aquí: credibilidad (qué te respalda: lo que has hecho, lo que sabes), emoción (por qué te apasiona o por qué debería importarle al otro) y argumento (qué problema resuelves y cómo) (Aristóteles, trad. 1990).",
          ],
        },
        {
          titulo: "Estructura",
          parrafos: [
            "1. Gancho: una frase que despierte interés. 2. Quién eres o qué propones. 3. Qué problema resuelves o qué te hace diferente, con un dato o ejemplo concreto. 4. Qué le pides a quien escucha: una reunión, su correo, su opinión. Ensáyalo en voz alta y cronométralo: si pasa de un minuto, recorta.",
          ],
        },
      ],
      errores: [
        { error: "Recitar el currículum completo.", mejor: "Elige una o dos cosas que más le interesen a esa persona." },
        { error: "Usar frases vacías: «soy muy responsable y trabajador».", mejor: "Demuéstralo con un hecho: «organicé la feria de ciencias de mi escuela»." },
        { error: "Terminar sin pedir nada.", mejor: "Cierra con un siguiente paso concreto." },
      ],
      ejemplo: {
        contexto: "Una estudiante busca unas prácticas en una radio local.",
        mal: "Hola, me llamo Ana, estudio el bachillerato y me gusta mucho la radio y soy muy responsable.",
        bien: "Hola, soy Ana. En mi escuela hago un podcast de 10 minutos con noticias del plantel que escuchan mis compañeros cada semana. Me gustaría aprender a producir en una radio de verdad. ¿Puedo mandarle un episodio a su correo?",
        porque: "Tiene gancho, un dato concreto que la respalda y una petición clara.",
      },
      actividad: {
        titulo: "Mi pitch de 45 segundos",
        pasos: [
          "Escribe tu pitch siguiendo la estructura de cuatro pasos.",
          "Cronométralo en voz alta y recórtalo hasta que dure entre 30 y 60 segundos.",
          "Preséntalo a un compañero, que te dirá cuál rasgo de los hermanos Heath usaste mejor.",
        ],
        producto: "Guion del pitch y grabación en audio o video.",
      },
      reflexion: [
        "¿Qué es lo más interesante de ti que casi nunca mencionas?",
        "¿Por qué un ejemplo concreto convence más que un adjetivo?",
      ],
      fuentes: [F.heath, F.aristoteles],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "diseno-de-diapositivas",
      titulo: "Diseño de diapositivas",
      subtitulo: "Presentaciones que apoyan al expositor en lugar de reemplazarlo",
      detonadora:
        "Recuerda la peor presentación que hayas visto. ¿Qué tenían sus diapositivas?",
      idea:
        "Las diapositivas acompañan lo que dice el expositor: deben ayudar al público a entender y recordar, no ser un documento para leer en voz alta. Menos texto, más claridad.",
      secciones: [
        {
          titulo: "La memoria tiene límites",
          parrafos: [
            "John Sweller mostró que la memoria de trabajo, la que usamos para procesar información en el momento, puede manejar pocas cosas a la vez; cuando la saturamos, aprendemos menos (Sweller, 1988). Una diapositiva llena de texto, mientras el expositor dice otra cosa, obliga al público a leer y escuchar al mismo tiempo, y termina sin hacer bien ninguna de las dos.",
          ],
        },
        {
          titulo: "Errores que la psicología explica",
          parrafos: [
            "Stephen Kosslyn y su equipo revisaron presentaciones reales contra principios de la percepción y la memoria, y encontraron que los errores eran muy comunes: demasiada información por diapositiva, letras difíciles de leer, gráficos confusos y elementos decorativos que distraen (Kosslyn et al., 2012).",
          ],
        },
        {
          titulo: "Principios de diseño",
          parrafos: [
            "Una idea por diapositiva. Pocas palabras y letra grande, legible desde el fondo del salón. Buen contraste entre texto y fondo. Imágenes que expliquen, no que adornen. Un mismo estilo en toda la presentación. Garr Reynolds resume la idea en una palabra: sencillez; propone planear primero en papel lo que se quiere decir y solo después abrir el programa (Reynolds, 2008).",
          ],
        },
      ],
      errores: [
        { error: "Pegar párrafos completos y leerlos.", mejor: "Escribe frases clave; lo demás lo explicas tú." },
        { error: "Usar colores o fuentes difíciles de leer.", mejor: "Texto oscuro sobre fondo claro (o al revés) y una fuente sencilla." },
        { error: "Llenar de animaciones y transiciones.", mejor: "Usa animaciones solo para mostrar una idea paso a paso." },
      ],
      actividad: {
        titulo: "Rediseño",
        pasos: [
          "Toma tres diapositivas de una exposición que hayas hecho.",
          "Identifica los problemas usando los principios de este tema.",
          "Rediséñalas y compara el antes y el después con tu equipo.",
        ],
        producto: "Tres diapositivas en versión antes y después.",
      },
      reflexion: [
        "¿Por qué leer las diapositivas en voz alta aburre al público?",
        "¿Cuál es la diferencia entre una imagen que explica y una que adorna?",
      ],
      fuentes: [F.sweller, F.kosslyn, F.reynolds],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "integracion-multimedia",
      titulo: "Integración multimedia",
      subtitulo: "Combinar texto, imagen, audio y video para comunicar mejor",
      detonadora:
        "¿Qué aprendes mejor: leyendo un instructivo, viendo un diagrama o viendo un video? ¿Depende de qué?",
      idea:
        "La integración multimedia es combinar distintos medios (texto, imagen, audio, video) en un mismo mensaje. Bien hecha, ayuda a entender; mal hecha, satura. La clave es que cada medio aporte algo y no repita ni distraiga.",
      secciones: [
        {
          titulo: "Cómo aprendemos con varios medios",
          parrafos: [
            "Richard Mayer y Roxana Moreno explican que procesamos por canales separados lo que vemos y lo que escuchamos, y que cada canal tiene una capacidad limitada. De ahí proponen varias formas de no saturarlos (Mayer y Moreno, 2003):",
            "Coherencia: quitar todo lo que no sea necesario, aunque sea bonito o divertido. Señalización: destacar lo importante con flechas, colores o títulos. Modalidad: explicar una imagen con voz en lugar de con texto escrito, para repartir el trabajo entre ojos y oídos. Redundancia: no poner en pantalla el mismo texto que se está narrando. Contigüidad: colocar las palabras cerca de la parte de la imagen a la que se refieren y presentarlas al mismo tiempo.",
          ],
        },
        {
          titulo: "Cuándo usar cada medio",
          parrafos: [
            "Texto: para definiciones, datos precisos y lo que se va a consultar después. Imagen o diagrama: para relaciones, procesos y lugares. Audio: para explicar, dar tono y emoción. Video: para mostrar movimientos, procedimientos o situaciones reales. Antes de agregar un medio, pregúntate: ¿qué hace este elemento que no haga ya otro?",
          ],
        },
      ],
      errores: [
        { error: "Poner música de fondo mientras alguien explica.", mejor: "Si la música no aporta, quítala: compite con la voz." },
        { error: "Narrar exactamente el texto que está en pantalla.", mejor: "En pantalla, la imagen o palabras clave; la explicación, con la voz." },
        { error: "Agregar videos o GIF solo para decorar.", mejor: "Cada elemento debe ayudar a entender algo." },
      ],
      actividad: {
        titulo: "Explicar un proceso con multimedia",
        pasos: [
          "Elige un proceso sencillo (cómo se hace una receta, cómo funciona una bicicleta).",
          "Planea una explicación de un minuto combinando al menos dos medios.",
          "Revisa tu plan con los cinco principios de Mayer y Moreno y corrige lo que no los cumpla.",
        ],
        producto: "Guion multimedia de un minuto con los principios señalados.",
      },
      reflexion: [
        "¿Recuerdas un video educativo que te haya ayudado mucho? ¿Qué principios cumplía?",
        "¿Por qué más medios no siempre significa mejor comunicación?",
      ],
      fuentes: [F.mayer],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "podcast",
      titulo: "El podcast y el uso profesional del audio",
      subtitulo: "Comunicar con la voz para quien escucha cuando quiere",
      detonadora:
        "¿Escuchas algún podcast? ¿En qué momento del día y haciendo qué?",
      idea:
        "Un podcast es un programa de audio que se publica en episodios y que el oyente escucha cuando y donde quiere. Organizaciones, escuelas y empresas lo usan para informar, capacitar y contar historias.",
      secciones: [
        {
          titulo: "Radio a la carta",
          parrafos: [
            "Richard Berry analizó el podcast como una forma de radio, pero con diferencias importantes: el oyente decide cuándo escuchar, puede llevarlo a cualquier parte y se suscribe para recibir cada episodio nuevo. Además, cualquier persona con equipo sencillo puede producirlo, sin necesidad de una estación de radio (Berry, 2006).",
          ],
        },
        {
          titulo: "Usos en escuelas y organizaciones",
          parrafos: [
            "Informar novedades, capacitar sin reunir a todos a la misma hora, dar voz a los integrantes de una comunidad y documentar su historia. Sirve para quienes aprenden mejor escuchando y para quienes se trasladan largas distancias.",
          ],
        },
        {
          titulo: "Cómo producir un episodio",
          parrafos: [
            "Define un tema y un público. Escribe una escaleta, es decir, el orden de los bloques con su duración, en lugar de un guion palabra por palabra. Graba en un lugar silencioso, con el micrófono o el celular cerca de la boca. Presenta el tema al inicio y resume al final. Si usas música de otros, verifica su licencia. Y cuida la duración: mejor corto y constante que largo y ocasional.",
          ],
        },
      ],
      errores: [
        { error: "Grabar en un lugar con eco o ruido.", mejor: "Un clóset con ropa o un cuarto pequeño con cortinas absorbe el eco." },
        { error: "Leer un texto de forma monótona.", mejor: "Usa una escaleta y habla como si conversaras con una persona." },
        { error: "Usar música con derechos de autor sin permiso.", mejor: "Busca música con licencia libre y da el crédito." },
      ],
      actividad: {
        titulo: "Episodio piloto",
        pasos: [
          "En equipo, elijan un tema de interés para su escuela.",
          "Escriban una escaleta de tres a cinco minutos: presentación, dos bloques y cierre.",
          "Graben con el celular y compartan el audio con el grupo.",
        ],
        producto: "Escaleta y episodio grabado de tres a cinco minutos.",
      },
      reflexion: [
        "¿Qué ventajas tiene el audio frente al video para comunicar algo?",
        "¿Qué tema de tu escuela merecería un podcast?",
      ],
      fuentes: [F.berry],
    },
  ],
};

import type { UnidadLyC } from "./tipos";
import { F } from "./fuentes";

export const unidad5: UnidadLyC = {
  numero: 5,
  titulo: "Mi identidad, la ética y la seguridad",
  proposito:
    "Cuidar cómo me presento en el mundo escolar y laboral, respetar el trabajo de otros, usar la inteligencia artificial con honestidad y proteger mi información.",
  acento: "violet",
  temas: [
    // ────────────────────────────────────────────────────────────────────
    {
      slug: "cv-de-alto-impacto",
      titulo: "Redacción de un CV de alto impacto",
      subtitulo: "Tu currículum es un texto persuasivo",
      detonadora:
        "Si alguien leyera solo la primera mitad de tu currículum, ¿qué sabría de ti?",
      idea:
        "El currículum vítae (CV) es un texto breve que busca convencer a alguien de que te conozca en una entrevista. No es una lista de todo lo que has hecho, sino una selección de lo que demuestra que puedes hacer bien lo que te piden.",
      secciones: [
        {
          titulo: "Qué buscan quienes lo leen",
          parrafos: [
            "Un estudio con reclutadores que revisaban currículums de recién egresados encontró que usan el documento para formarse una idea de la preparación académica, la experiencia de trabajo y las actividades extracurriculares del candidato, y que con esa información deciden a quién llamar (Cole et al., 2007). Para un estudiante con poca experiencia laboral, los proyectos escolares, el voluntariado, el deporte o las responsabilidades familiares son información valiosa si se describen bien.",
          ],
        },
        {
          titulo: "Escribir para una lectura rápida",
          parrafos: [
            "Quien revisa muchos currículums los lee por encima. Por eso: datos de contacto claros arriba; un perfil de dos o tres líneas; secciones con títulos visibles; lo más relevante primero; y viñetas que empiecen con un verbo de acción y, si se puede, un resultado. «Coordiné a un equipo de cinco para organizar la feria de ciencias, con 12 proyectos presentados» dice mucho más que «responsable y trabajador en equipo».",
          ],
        },
        {
          titulo: "Adaptarlo a cada oferta",
          parrafos: [
            "Lee la vacante y usa sus mismas palabras cuando describan algo que de verdad sabes hacer. Quita lo que no tenga relación. Un currículum adaptado de una página suele funcionar mejor que uno genérico de tres.",
          ],
        },
      ],
      errores: [
        { error: "Correo poco profesional: «princesita2009@…».", mejor: "Usa un correo con tu nombre y apellido." },
        { error: "Adjetivos sin pruebas: «proactivo, líder, creativo».", mejor: "Cambia cada adjetivo por un hecho que lo demuestre." },
        { error: "Faltas de ortografía.", mejor: "Pide a dos personas que lo revisen antes de enviarlo." },
        { error: "Mentir o exagerar.", mejor: "Todo lo que escribes se puede preguntar en la entrevista." },
      ],
      ejemplo: {
        contexto: "Describir una experiencia escolar.",
        mal: "Participé en actividades de la escuela.",
        bien: "Organicé la colecta de útiles del plantel: coordiné a 8 compañeros y reunimos material para 40 alumnos.",
        porque: "Empieza con un verbo, dice qué hiciste y da un resultado concreto.",
      },
      actividad: {
        titulo: "Mi primer CV",
        pasos: [
          "Haz una lista de todo lo que has hecho: escuela, deporte, voluntariado, trabajos, responsabilidades en casa.",
          "Elige una vacante real o ficticia y selecciona lo que se relaciona con ella.",
          "Redacta un CV de una página con viñetas que empiecen con verbo de acción.",
        ],
        producto: "CV de una página adaptado a una vacante.",
      },
      reflexion: [
        "¿Qué has hecho que no considerabas «experiencia» y que sí lo es?",
        "¿Por qué un hecho convence más que un adjetivo?",
      ],
      fuentes: [F.cole],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "huella-digital-y-perfil",
      titulo: "Foto de perfil, biografía y huella digital",
      subtitulo: "Lo que tus redes dicen de ti a quien no te conoce",
      detonadora:
        "Busca tu nombre completo en internet. ¿Qué aparece? ¿Te gustaría que lo viera quien te va a entrevistar?",
      idea:
        "Todo lo que publicamos deja una huella digital que otras personas pueden encontrar: escuelas, empleadores, familiares. La foto de perfil y la biografía son la primera impresión que damos a quien todavía no nos conoce.",
      secciones: [
        {
          titulo: "Presentarse con cuidado",
          parrafos: [
            "Joseph Walther observó que en la comunicación por computadora las personas pueden cuidar mucho la imagen que muestran: eligen qué fotos subir, cómo describirse y cuándo responder. A esto lo llamó comunicación hiperpersonal, y explica por qué quien nos ve en línea puede formarse una impresión más marcada que en persona (Walther, 1996). Si esa impresión se construye de todos modos, conviene construirla con intención.",
          ],
        },
        {
          titulo: "Todos los públicos a la vez",
          parrafos: [
            "Alice Marwick y danah boyd llamaron colapso de contextos a lo que ocurre en redes sociales: una misma publicación la ven amigos, familia, maestros y desconocidos, públicos que en la vida diaria están separados. Quien publica suele imaginar a un solo público, pero lo leen todos (Marwick y boyd, 2011). Por eso, antes de publicar, conviene preguntarse: ¿me importaría que esto lo viera cualquiera de ellos?",
          ],
        },
        {
          titulo: "Perfil profesional",
          parrafos: [
            "Foto: rostro visible, buena luz, fondo sencillo, sin filtros exagerados. Biografía: quién eres, qué estudias o haces y qué te interesa, en una o dos líneas. Revisa la privacidad de tus redes personales y separa, si lo necesitas, una cuenta personal de una escolar o profesional.",
          ],
        },
      ],
      errores: [
        { error: "Usar la misma foto de fiesta para todo.", mejor: "Ten una foto sencilla y clara para perfiles escolares y profesionales." },
        { error: "Publicar pensando solo en tus amigos.", mejor: "Imagina que lo lee tu futuro jefe o tu abuela." },
        { error: "Creer que borrar algo lo elimina para siempre.", mejor: "Alguien pudo haber hecho captura; piensa antes de publicar." },
      ],
      actividad: {
        titulo: "Auditoría de mi huella",
        pasos: [
          "Busca tu nombre en un buscador y revisa las primeras dos páginas de resultados.",
          "Revisa la foto, la biografía y la configuración de privacidad de una de tus redes.",
          "Escribe una biografía profesional de dos líneas y describe qué cambiarías de tu perfil.",
        ],
        producto: "Informe breve de tu huella digital y tu nueva biografía.",
      },
      reflexion: [
        "¿Qué publicación tuya de hace dos años ya no subirías hoy?",
        "¿Quiénes son todos los públicos que ven lo que publicas?",
      ],
      fuentes: [F.walther, F.marwick],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "plagio-y-derechos-de-autor",
      titulo: "Plagio académico y derechos de autor",
      subtitulo: "Usar las ideas de otros con honestidad",
      detonadora:
        "Si copias un párrafo de internet y cambias algunas palabras, ¿ya es tuyo?",
      idea:
        "Plagiar es presentar como propias las ideas, palabras, imágenes o datos de otra persona sin reconocerla. Citar no es un trámite: es la forma honesta de mostrar de dónde viene lo que sabes y de dar crédito a quien lo pensó primero.",
      secciones: [
        {
          titulo: "Qué es plagio",
          parrafos: [
            "Copiar un texto sin comillas ni referencia; parafrasear cambiando unas cuantas palabras sin citar; usar imágenes, gráficas o datos ajenos sin dar el crédito; entregar un trabajo hecho por otra persona o por una herramienta como si fuera propio; y reutilizar un trabajo propio anterior sin avisar.",
          ],
        },
        {
          titulo: "Lo que dice la ley en México",
          parrafos: [
            "La Ley Federal del Derecho de Autor permite usar obras ya publicadas sin pedir permiso ni pagar, siempre que no se afecte su explotación normal, se cite invariablemente la fuente y no se altere la obra. Entre esos casos está la cita de textos, con la condición de que lo tomado no sea en realidad una reproducción disfrazada de una parte sustancial de la obra (Ley Federal del Derecho de Autor, 2026, art. 148). Es decir: citar está permitido y protegido; copiar sin citar, no.",
          ],
        },
        {
          titulo: "Cómo citar",
          parrafos: [
            "En la escuela y la universidad se usan normas como las de la American Psychological Association (APA): en el texto se escribe el apellido del autor y el año, y al final se pone la referencia completa para que cualquiera pueda encontrar la fuente (American Psychological Association, 2020). Esta misma antología está escrita así: cada nombre y año entre paréntesis corresponde a una fuente de la lista del final.",
          ],
        },
      ],
      errores: [
        { error: "Cambiar algunas palabras y creer que ya no es copia.", mejor: "Si la idea es de otro, cítala, aunque la escribas con tus palabras." },
        { error: "Poner solo «Fuente: Google» o «Wikipedia».", mejor: "Cita al autor y la página exacta de donde tomaste la información." },
        { error: "Usar imágenes de internet sin crédito.", mejor: "Busca imágenes con licencia abierta y anota su autor y licencia." },
      ],
      ejemplo: {
        contexto: "Usar una idea de un autor en un ensayo.",
        mal: "Las personas creen que sus correos se entienden mejor de lo que realmente se entienden.",
        bien: "Las personas creen que sus correos se entienden mejor de lo que realmente se entienden (Kruger et al., 2005).",
        porque: "La idea viene de una investigación; la cita reconoce a sus autores y permite al lector consultarla.",
      },
      actividad: {
        titulo: "Del copiado a la cita",
        pasos: [
          "Elige un párrafo de un artículo confiable sobre un tema de esta antología.",
          "Escribe una cita textual (entre comillas) y una paráfrasis (con tus palabras), ambas con su cita en APA.",
          "Agrega la referencia completa al final.",
        ],
        producto: "Cita textual, paráfrasis y referencia en formato APA.",
      },
      reflexion: [
        "¿Por qué citar hace más fuerte tu trabajo y no más débil?",
        "¿Cómo te sentirías si alguien presentara como suyo algo que tú escribiste?",
      ],
      fuentes: [F.lfda, F.apa, F.kruger],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "uso-etico-de-la-ia",
      titulo: "Uso ético de la inteligencia artificial",
      subtitulo: "Usar ChatGPT y otras herramientas para aprender, no para hacer trampa",
      detonadora:
        "Si una herramienta de IA escribe tu ensayo y tú lo entregas, ¿quién aprendió?",
      idea:
        "La inteligencia artificial generativa puede ser un buen apoyo para entender, organizar ideas y revisar textos. Usarla con ética significa que no reemplace tu pensamiento, que verifiques lo que produce y que digas cuándo la usaste.",
      secciones: [
        {
          titulo: "La postura de la UNESCO",
          parrafos: [
            "La guía de la UNESCO para el uso de IA generativa en educación e investigación propone un enfoque centrado en las personas: la IA debe apoyar las capacidades humanas, no sustituirlas. Advierte que estas herramientas pueden producir información falsa con apariencia convincente, reproducir sesgos y afectar la privacidad, y recomienda que su uso en la escuela esté guiado y sea transparente (Miao y Holmes, 2024).",
          ],
        },
        {
          titulo: "Usos que ayudan a aprender",
          parrafos: [
            "Pedir que te explique un tema difícil con otras palabras o con un ejemplo. Pedir preguntas para repasar. Organizar tus ideas antes de escribir. Revisar la ortografía y la claridad de un texto que tú escribiste. En todos estos casos, el trabajo intelectual sigue siendo tuyo.",
          ],
        },
        {
          titulo: "Usos que son trampa",
          parrafos: [
            "Entregar como propio un texto generado. Copiar respuestas sin leerlas ni entenderlas. Inventar citas o fuentes con ayuda de la IA, que a veces fabrica referencias que no existen. Presentar un trabajo generado cuando la tarea pedía tu opinión o tu experiencia.",
            "Una regla de oro: si no puedes explicar con tus propias palabras lo que entregas, no lo aprendiste.",
          ],
        },
      ],
      errores: [
        { error: "Copiar y pegar la respuesta de la IA.", mejor: "Úsala como tutor: pide explicaciones y escribe tú." },
        { error: "Confiar en todo lo que dice.", mejor: "Verifica datos, nombres y citas en fuentes confiables." },
        { error: "Ocultar que la usaste.", mejor: "Indica para qué la usaste, como harías con cualquier otra fuente." },
      ],
      actividad: {
        titulo: "La IA como tutor",
        pasos: [
          "Pide a una herramienta de IA que te explique un tema de esta antología.",
          "Verifica al menos dos afirmaciones de su respuesta con las fuentes del tema.",
          "Escribe con tus palabras un párrafo sobre el tema e incluye una nota de cómo usaste la IA.",
        ],
        producto: "Párrafo propio, verificación de dos datos y nota de uso de IA.",
      },
      reflexion: [
        "¿Qué diferencia hay entre usar una calculadora y pedirle a la IA que haga tu ensayo?",
        "¿Qué harías si la IA te da una cita que no puedes encontrar?",
      ],
      fuentes: [F.unesco],
    },

    // ────────────────────────────────────────────────────────────────────
    {
      slug: "ciberseguridad-basica",
      titulo: "Ciberseguridad básica",
      subtitulo: "Proteger tus contraseñas y tus datos personales",
      detonadora:
        "¿Usas la misma contraseña en más de una aplicación? ¿Qué pasaría si alguien la descubriera?",
      idea:
        "La ciberseguridad básica es el conjunto de hábitos que protegen nuestras cuentas y nuestros datos: contraseñas largas y distintas, verificación en dos pasos y desconfiar de los mensajes que piden información.",
      secciones: [
        {
          titulo: "Contraseñas: largas, no raras",
          parrafos: [
            "El Instituto Nacional de Estándares y Tecnología de Estados Unidos (NIST), cuyas guías se usan como referencia en todo el mundo, cambió en su versión más reciente varias costumbres que parecían obvias. Pide que una contraseña usada como única protección tenga al menos 15 caracteres; prohíbe obligar a mezclar mayúsculas, números y símbolos; y prohíbe obligar a cambiarla cada cierto tiempo, salvo que haya indicios de que alguien la robó. También pide rechazar las contraseñas comunes o que ya se filtraron (NIST, 2025).",
            "La lógica es que la longitud protege más que los símbolos, y que las reglas complicadas hacen que la gente elija contraseñas predecibles como «Hola123!». Una frase de varias palabras que solo tú conozcas es más fácil de recordar y más difícil de adivinar.",
          ],
        },
        {
          titulo: "Hábitos que protegen",
          parrafos: [
            "Una contraseña distinta para cada cuenta importante; un gestor de contraseñas si te cuesta recordarlas; verificación en dos pasos en el correo y las redes; no compartir contraseñas ni códigos de verificación con nadie; cerrar sesión en equipos compartidos; y actualizar el sistema del teléfono. El Instituto Nacional de Ciberseguridad de España ofrece guías sencillas sobre estos hábitos (INCIBE, s.f.).",
          ],
        },
        {
          titulo: "Suplantación de identidad",
          parrafos: [
            "Muchos ataques no rompen contraseñas: las piden. Llegan mensajes que parecen de tu banco, tu escuela o un amigo, con urgencia («tu cuenta será bloqueada») y un enlace. Antes de dar clic, revisa quién lo envía, desconfía de la prisa y entra al sitio escribiendo tú la dirección.",
          ],
        },
      ],
      errores: [
        { error: "Usar la misma contraseña para todo.", mejor: "Si una se filtra, las demás cuentas siguen a salvo." },
        { error: "Compartir el código que llega por mensaje.", mejor: "Nadie legítimo te pedirá ese código: no lo compartas." },
        { error: "Dar clic en enlaces urgentes.", mejor: "Entra al sitio oficial escribiendo tú la dirección." },
      ],
      actividad: {
        titulo: "Revisión de seguridad personal",
        pasos: [
          "Haz una lista de tus cuentas importantes (sin escribir contraseñas).",
          "Marca cuáles comparten contraseña y cuáles tienen verificación en dos pasos.",
          "Activa la verificación en dos pasos en al menos una cuenta y escribe una frase-contraseña de ejemplo que no vayas a usar.",
        ],
        producto: "Lista de cuentas con su nivel de protección y los cambios que hiciste.",
      },
      reflexion: [
        "¿Por qué «MiPerro2008!» es más débil de lo que parece?",
        "¿Qué datos tuyos serían más peligrosos en manos de un desconocido?",
      ],
      fuentes: [F.nist, F.incibe],
    },
  ],
};

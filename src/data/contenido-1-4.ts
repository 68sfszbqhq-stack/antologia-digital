import type { ContenidoModulo } from "./tipos";

// ─────────────────────────────────────────────────────────────────────────────
// MÓDULOS 1.1 – 1.4
// Toda cifra citada lleva fuente. Ver README de datos al final del archivo.
// ─────────────────────────────────────────────────────────────────────────────

export const modulo1: ContenidoModulo = {
  dia: 1,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "Línea del Tiempo", "Tu Reto"],

  keynote: {
    gancho: "El teléfono que traes en la bolsa es más potente que toda la computadora que llevó al ser humano a la Luna.",
    parrafo:
      "No es una metáfora motivacional. Es aritmética. La computadora de guía del Apolo 11 corría a 2.048 MHz con 4 KB de memoria de trabajo. Tu celular más barato tiene, mínimo, dos mil veces esa memoria y mil veces esa velocidad. En 55 años pasamos de una máquina que ocupaba un salón a una que se te cae al baño. Esa es la historia que vamos a estudiar hoy, y no es una historia de aparatos: es una historia de decisiones humanas.",
    datos: [
      { cifra: "17,468", etiqueta: "tubos de vacío tenía la ENIAC (1945). Pesaba 27 toneladas y consumía 150 kW", fuente: "Universidad de Pensilvania / Ejército de EE. UU." },
      { cifra: "2,300", etiqueta: "transistores tenía el Intel 4004, el primer microprocesador (1971)", fuente: "Intel Museum" },
      { cifra: "134 mil millones", etiqueta: "de transistores tiene el chip Apple M2 Ultra (2023)", fuente: "Apple Newsroom" },
      { cifra: "×58 millones", etiqueta: "creció la densidad de transistores en 52 años. Eso es la Ley de Moore en la práctica", fuente: "Cálculo sobre datos Intel/Apple" },
    ],
    chiste:
      "La ENIAC pesaba 27 toneladas, ocupaba 167 metros cuadrados y hacía 5,000 sumas por segundo. Tu celular pesa 200 gramos, cabe en tu bolsillo, hace miles de millones de operaciones por segundo… y lo usas para ver videos de gente cayéndose. La humanidad avanzó muchísimo. Tú decides si avanzas con ella.",
    ctaTitulo: "Antes de seguir, haz esto",
    ctaTexto:
      "Voltea a ver el aparato con el que estás leyendo esto. En 90 minutos vas a poder nombrar, uno por uno, los componentes que tiene adentro y explicar qué hace cada quien. Nadie que sepa eso vuelve a tratar su computadora como una caja mágica. Ese es el punto de esta clase: dejar de ser usuario y empezar a ser alguien que entiende.",
    ctaBoton: "Entendido, arranquemos",
  },

  conceptosTitulo: "Los 6 conceptos que ordenan todo lo demás",
  conceptos: [
    {
      icono: "🔩",
      etiqueta: "Concepto base",
      titulo: "Hardware: lo que sí puedes patear",
      cuerpo:
        "Es el conjunto de elementos físicos y tangibles de un dispositivo: circuitos, chips, cables, pantalla, batería, teclado. Si se puede tocar, pesar y romper al caerse, es hardware. Se divide en unidades de entrada, procesamiento, almacenamiento y salida.",
      dato: "Regla mnemotécnica: el hardware se descompone, el software se corrompe.",
      acento: "cyan",
    },
    {
      icono: "🧠",
      etiqueta: "Concepto base",
      titulo: "Software: lo que solo puedes maldecir",
      cuerpo:
        "Es el conjunto de programas, instrucciones y reglas que le dicen al hardware qué hacer. No tiene masa ni volumen. Se clasifica en software de sistema (el sistema operativo, que administra los recursos), software de aplicación (lo que tú usas: navegador, editor, juegos) y software de programación (con el que se crea el resto).",
      dato: "Sin software, una computadora es un calentador muy caro con luces bonitas.",
      acento: "purple",
    },
    {
      icono: "🔌",
      etiqueta: "El intermediario",
      titulo: "Firmware: el que despierta a los demás",
      cuerpo:
        "Es software grabado de fábrica en un chip de memoria de la placa base (BIOS o el más moderno UEFI). Es lo primero que se ejecuta al presionar el botón de encendido: revisa que el hardware responda (rutina POST), encuentra el disco donde vive el sistema operativo y le entrega el control.",
      dato: "UEFI reemplazó al BIOS: soporta discos mayores a 2 TB, arranca más rápido e incluye Secure Boot.",
      acento: "amber",
    },
    {
      icono: "📈",
      etiqueta: "La regla del juego",
      titulo: "Ley de Moore",
      cuerpo:
        "En 1965 Gordon Moore, cofundador de Intel, observó que el número de transistores que caben en un chip se duplicaba aproximadamente cada año; en 1975 corrigió el plazo a cada dos años. No es una ley física, es una observación económica que la industria convirtió en meta autocumplida durante medio siglo.",
      dato: "Hoy se está frenando: ya se fabrica a escala de 3 nanómetros, y un átomo de silicio mide 0.2 nm. El espacio se acabó.",
      acento: "emerald",
    },
    {
      icono: "🕰️",
      etiqueta: "Historia técnica",
      titulo: "Las cinco generaciones",
      cuerpo:
        "1ª (1940-1956): tubos de vacío. 2ª (1956-1963): transistores. 3ª (1964-1971): circuitos integrados. 4ª (1971-hoy): microprocesadores. 5ª (en curso): procesamiento paralelo masivo, inteligencia artificial y computación cuántica. Cada salto redujo tamaño, costo y consumo, y multiplicó la velocidad.",
      dato: "Cada generación no la definió un invento nuevo, sino un componente más chico que el anterior.",
      acento: "indigo",
    },
    {
      icono: "⚡",
      etiqueta: "Fundamento",
      titulo: "El bit: todo es 0 y 1",
      cuerpo:
        "Absolutamente todo — este texto, tus fotos, tu música, un videojuego — se representa dentro del hardware como ausencia o presencia de voltaje: 0 y 1. El transistor es el interruptor que produce esos dos estados. Agrupa 8 bits y tienes un byte, suficiente para representar un carácter.",
      dato: "Una canción de 4 minutos en MP3 son unos 4 millones de bytes: 32 millones de interruptores prendiéndose y apagándose.",
      acento: "rose",
    },
  ],

  hitosTitulo: "Línea del Tiempo Master de la Informática",
  hitosSubtitulo: "De la Máquina Analítica de Ada Lovelace a los chips de 3 nanómetros y GNU/Linux.",
  hitos: [
    {
      year: "1837", era: "Era Mecánica", categoria: "Hardware",
      titulo: "La Máquina Analítica y el primer algoritmo",
      pioneros: "Charles Babbage y Ada Lovelace",
      resumen: "Babbage diseña el primer computador mecánico de propósito general. En 1843, Ada Lovelace publica en sus notas el primer algoritmo pensado para ser ejecutado por una máquina: el cálculo de los números de Bernoulli.",
      impacto: "Lovelace fue la primera en entender que la máquina podía manipular símbolos, no solo números. Es la primera programadora de la historia.",
      acento: "amber",
    },
    {
      year: "1890", era: "Era Mecánica", categoria: "Hardware",
      titulo: "Tarjetas perforadas y el censo de Estados Unidos",
      pioneros: "Herman Hollerith",
      resumen: "Su máquina tabuladora procesó el censo estadounidense en una fracción del tiempo habitual usando tarjetas de cartón perforadas. La empresa que fundó terminó llamándose IBM.",
      impacto: "Nace el procesamiento masivo y automatizado de datos de población. También nace el negocio de vender esa capacidad a gobiernos.",
      acento: "amber",
    },
    {
      year: "1936", era: "Fundamentos teóricos", categoria: "Software",
      titulo: "La Máquina Universal de Turing",
      pioneros: "Alan Turing",
      resumen: "Turing define un modelo matemático abstracto que delimita qué puede y qué no puede calcularse. Demuestra además que existen problemas indecidibles: preguntas que ninguna computadora podrá resolver jamás.",
      impacto: "Es el cimiento teórico de toda la ciencia de la computación. Antes de que existiera una sola computadora, ya se sabía cuáles eran sus límites.",
      acento: "purple",
    },
    {
      year: "1945", era: "1ª Generación", categoria: "Hardware",
      titulo: "ENIAC y la arquitectura de Von Neumann",
      pioneros: "J. Presper Eckert, John Mauchly y John von Neumann",
      resumen: "La ENIAC, con 17,468 tubos de vacío y 27 toneladas, es la primera computadora electrónica de propósito general. Von Neumann formula la arquitectura donde programa y datos comparten la misma memoria.",
      impacto: "El esquema CPU + memoria + entrada/salida que describió en 1945 es exactamente el que tiene el aparato en el que estás leyendo esto.",
      acento: "cyan",
    },
    {
      year: "1947", era: "2ª Generación", categoria: "Hardware",
      titulo: "Invención del transistor",
      pioneros: "John Bardeen, Walter Brattain y William Shockley (Bell Labs)",
      resumen: "El 23 de diciembre de 1947 funciona el primer transistor de contacto puntual: un interruptor semiconductor de estado sólido que reemplaza al tubo de vacío, frágil, enorme y caliente.",
      impacto: "Les valió el Nobel de Física en 1956. Es, sin exageración, el invento que hace posible todo lo digital.",
      acento: "cyan",
    },
    {
      year: "1957", era: "2ª Generación", categoria: "Software",
      titulo: "FORTRAN y los lenguajes de alto nivel",
      pioneros: "John Backus (IBM)",
      resumen: "Primer lenguaje de programación de alto nivel de uso extendido. Permitió escribir fórmulas matemáticas legibles en lugar de instrucciones en lenguaje máquina.",
      impacto: "Programar dejó de ser una tarea exclusiva de ingenieros electrónicos y se volvió una herramienta para científicos de cualquier disciplina.",
      acento: "blue",
    },
    {
      year: "1964", era: "3ª Generación", categoria: "Hardware",
      titulo: "El circuito integrado llega a la producción masiva",
      pioneros: "Jack Kilby (Texas Instruments) y Robert Noyce (Fairchild)",
      resumen: "Múltiples transistores, resistencias y conexiones fabricados sobre una sola pastilla de silicio. El IBM System/360 lo lleva al mercado corporativo.",
      impacto: "Kilby recibió el Nobel de Física en 2000. La miniaturización deja de ser artesanal y se vuelve industrial.",
      acento: "cyan",
    },
    {
      year: "1969", era: "3ª Generación", categoria: "Software",
      titulo: "UNIX y el primer nodo de ARPANET",
      pioneros: "Ken Thompson, Dennis Ritchie y la agencia ARPA",
      resumen: "En Bell Labs nace UNIX, un sistema operativo multitarea y portable. El mismo año se enlaza el primer nodo de ARPANET, la red precursora de internet.",
      impacto: "La filosofía UNIX —herramientas pequeñas que hacen una cosa bien y se combinan entre sí— sigue rigiendo el diseño de software 55 años después.",
      acento: "blue",
    },
    {
      year: "1971", era: "4ª Generación", categoria: "Hardware",
      titulo: "Intel 4004: el primer microprocesador",
      pioneros: "Federico Faggin, Ted Hoff y Masatoshi Shima",
      resumen: "Una CPU completa en un solo chip: 2,300 transistores, 4 bits, 740 kHz. Fue diseñado originalmente para una calculadora japonesa.",
      impacto: "A partir de aquí la computadora puede caber en un escritorio, luego en una mochila y finalmente en un bolsillo.",
      acento: "cyan",
    },
    {
      year: "1976", era: "4ª Generación", categoria: "Hardware",
      titulo: "La computadora personal entra a las casas",
      pioneros: "Steve Wozniak, Steve Jobs, Bill Gates, Paul Allen",
      resumen: "Apple I (1976), Apple II (1977) e IBM PC con MS-DOS (1981). La computadora deja de ser propiedad exclusiva de empresas y universidades.",
      impacto: "Nace la industria del software de consumo y, con ella, la pregunta de quién es dueño del programa que corre en tu máquina.",
      acento: "indigo",
    },
    {
      year: "1983", era: "Software Libre", categoria: "Software Libre",
      titulo: "Se anuncia el Proyecto GNU",
      pioneros: "Richard Stallman",
      resumen: "El 27 de septiembre de 1983 Stallman anuncia que construirá un sistema operativo completo, compatible con UNIX, que cualquiera pueda usar, estudiar, copiar y modificar libremente.",
      impacto: "Define las cuatro libertades del software y convierte una molestia técnica en un movimiento ético que sigue vivo cuatro décadas después.",
      acento: "emerald",
    },
    {
      year: "1989", era: "Era de Internet", categoria: "Software",
      titulo: "Nace la World Wide Web",
      pioneros: "Tim Berners-Lee (CERN)",
      resumen: "Propone un sistema de hipertexto para compartir documentos entre científicos: HTTP, HTML y URL. En 1993 el CERN libera la tecnología al dominio público, sin cobrar regalías.",
      impacto: "Esa decisión de no cobrar es la razón por la que la web es universal. Si la hubieran patentado, hoy internet sería otra cosa.",
      acento: "teal",
    },
    {
      year: "1991", era: "Software Libre", categoria: "Software Libre",
      titulo: "Linus Torvalds libera el núcleo Linux",
      pioneros: "Linus Torvalds",
      resumen: "Un estudiante finlandés de 21 años publica en Usenet el núcleo que le faltaba al Proyecto GNU. Lo presentó diciendo que era 'solo un pasatiempo, nada grande ni profesional'.",
      impacto: "Ese pasatiempo hoy mueve el 100% de las 500 supercomputadoras más rápidas del mundo, la mayoría de los servidores de internet y todos los teléfonos Android.",
      acento: "emerald",
    },
    {
      year: "1998", era: "Open Source", categoria: "Software Libre",
      titulo: "Se acuña el término Open Source y Netscape libera su código",
      pioneros: "Eric S. Raymond, Bruce Perens, Christine Peterson",
      resumen: "Se funda la Open Source Initiative para hacer el código abierto comercialmente aceptable. Netscape libera el código de su navegador y de ahí nace el proyecto Mozilla.",
      impacto: "IBM, Sun y después Google adoptan el modelo. El código abierto pasa de contracultura a infraestructura de la industria.",
      acento: "emerald",
    },
    {
      year: "2007", era: "Era Móvil", categoria: "Hardware",
      titulo: "El teléfono se convierte en la computadora principal",
      pioneros: "Apple (iOS), Google (Android sobre núcleo Linux)",
      resumen: "Procesadores ARM de bajo consumo y memoria flash NAND sin partes móviles ponen una computadora completa en el bolsillo de miles de millones de personas.",
      impacto: "Para la mayoría de la humanidad, incluyendo México, el primer y único acceso a internet es un teléfono, no una computadora de escritorio.",
      acento: "cyan",
    },
    {
      year: "2020+", era: "Era de la IA", categoria: "Hardware",
      titulo: "Chips de 3 nm, NPU y arquitectura abierta RISC-V",
      pioneros: "TSMC, Apple, NVIDIA, comunidad RISC-V",
      resumen: "Se integran unidades de procesamiento neuronal (NPU) dedicadas a inteligencia artificial dentro del mismo chip, se fabrica a escala de 3 nanómetros y se consolida RISC-V, un conjunto de instrucciones abierto y sin regalías.",
      impacto: "Después de 50 años de arquitecturas propietarias, el propio diseño del procesador empieza a volverse libre.",
      acento: "rose",
    },
  ],

  ejes: [
    { nombre: "Hardware", acento: "cyan" },
    { nombre: "Software y Firmware", acento: "purple" },
    { nombre: "Evolución histórica", acento: "amber" },
    { nombre: "Software Libre", acento: "emerald" },
  ],
  preguntas: [
    {
      pregunta: "¿Qué es el hardware de un dispositivo electrónico?",
      opciones: [
        "El conjunto de programas y aplicaciones instaladas",
        "Los componentes físicos, eléctricos y tangibles que forman el dispositivo",
        "La velocidad de la conexión a internet",
        "Las reglas de privacidad del sistema operativo",
      ],
      correcta: 1, categoria: "Hardware",
      explicacion: "Hardware es todo lo que puedes tocar: placa madre, CPU, RAM, pantalla, batería. Si se cae y se rompe, era hardware.",
    },
    {
      pregunta: "¿Cuál es la función principal de la memoria RAM?",
      opciones: [
        "Guardar fotos y archivos de forma permanente aunque se apague el equipo",
        "Procesar exclusivamente los gráficos de los videojuegos",
        "Almacenar datos e instrucciones de forma temporal y volátil mientras los programas se ejecutan",
        "Proteger el equipo contra virus informáticos",
      ],
      correcta: 2, categoria: "Hardware",
      explicacion: "La RAM es volátil: al cortar la corriente pierde todo. Por eso cuando se va la luz sin haber guardado, el trabajo desaparece.",
    },
    {
      pregunta: "¿Qué componente se considera el cerebro de la computadora?",
      opciones: [
        "El disco duro o SSD",
        "La Unidad Central de Procesamiento (CPU)",
        "La fuente de alimentación",
        "La tarjeta de red Wi-Fi",
      ],
      correcta: 1, categoria: "Hardware",
      explicacion: "La CPU ejecuta el ciclo buscar-decodificar-ejecutar-escribir miles de millones de veces por segundo. Contiene la ALU, la unidad de control y la memoria caché.",
    },
    {
      pregunta: "¿Qué es el software de sistema?",
      opciones: [
        "Programas para editar fotos y videos",
        "Programas que administran los recursos del hardware y sirven de interfaz, como los sistemas operativos",
        "Páginas web de redes sociales",
        "Videojuegos en línea",
      ],
      correcta: 1, categoria: "Software y Firmware",
      explicacion: "GNU/Linux, Windows, macOS y Android son software de sistema: reparten memoria, tiempo de CPU y acceso a los dispositivos entre todos los programas.",
    },
    {
      pregunta: "¿Qué componente semiconductor sustituyó a los tubos de vacío en la 2ª generación de computadoras?",
      opciones: ["El transistor", "El microprocesador", "La memoria flash NAND", "El circuito integrado en 3D"],
      correcta: 0, categoria: "Evolución histórica",
      explicacion: "El transistor, creado en Bell Labs en 1947. Sus tres inventores recibieron el Nobel de Física en 1956.",
    },
    {
      pregunta: "¿Quién anunció el Proyecto GNU y definió el concepto de software libre en 1983?",
      opciones: ["Bill Gates", "Steve Jobs", "Richard Stallman", "Linus Torvalds"],
      correcta: 2, categoria: "Software Libre",
      explicacion: "Stallman anunció GNU el 27 de septiembre de 1983 y fundó la Free Software Foundation en 1985.",
    },
    {
      pregunta: "¿Cuál es la función de la placa base o tarjeta madre?",
      opciones: [
        "Proveer conexión inalámbrica a internet",
        "Interconectar y comunicar CPU, RAM, almacenamiento y periféricos mediante buses",
        "Almacenar el sistema operativo de forma permanente",
        "Convertir la corriente alterna en corriente continua",
      ],
      correcta: 1, categoria: "Hardware",
      explicacion: "Es el circuito impreso donde se enchufa todo. Sus pistas de cobre son los buses que transportan datos, direcciones y energía.",
    },
    {
      pregunta: "¿Cuál es la diferencia principal entre un SSD y un disco duro HDD tradicional?",
      opciones: [
        "El HDD usa memoria flash y el SSD discos magnéticos giratorios",
        "El SSD no tiene partes móviles y usa chips de memoria flash NAND, por lo que es mucho más rápido",
        "El HDD solo se usa en teléfonos móviles",
        "El SSD requiere borrar sus datos manualmente cada semana",
      ],
      correcta: 1, categoria: "Evolución histórica",
      explicacion: "Sin motor ni cabezal mecánico, un SSD NVMe alcanza velocidades de lectura de varios miles de MB/s frente a los ~150 MB/s de un HDD.",
    },
    {
      pregunta: "¿En qué año Linus Torvalds liberó el núcleo Linux?",
      opciones: ["1975", "1983", "1991", "2001"],
      correcta: 2, categoria: "Software Libre",
      explicacion: "En 1991. Al combinarse con las herramientas GNU nació el sistema operativo libre GNU/Linux, que hoy mueve la infraestructura de internet.",
    },
    {
      pregunta: "¿Qué es el firmware, por ejemplo el BIOS o el UEFI?",
      opciones: [
        "Un programa comercial de suscripción mensual",
        "El código de bajo nivel grabado en la placa base que inicializa y prueba el hardware al encender (POST)",
        "Un cable físico para conectar el monitor",
        "Una extensión del navegador web",
      ],
      correcta: 1, categoria: "Software y Firmware",
      explicacion: "Es lo primero que corre al presionar el botón de encendido, antes de que exista sistema operativo. Sin firmware, la máquina no sabría ni dónde buscarse a sí misma.",
    },
  ],

  tarea: {
    titulo: "Línea del tiempo: de la válvula al chip de 3 nanómetros",
    descripcion:
      "Construye una línea del tiempo gráfica que ordene los hitos que transformaron el hardware y el software. No se trata de copiar fechas: se trata de explicar por qué cada salto cambió lo que una computadora podía hacer y quién podía usarla.",
    requisitos: [
      "Incluir al menos 8 hitos con año, protagonistas y una frase de impacto.",
      "Explicar el paso de tubos de vacío a transistores y de transistores a microprocesadores.",
      "Diferenciar con tus palabras el papel de CPU, RAM, placa base, almacenamiento y firmware.",
      "Incluir obligatoriamente el Proyecto GNU (1983) y el núcleo Linux (1991).",
      "Cerrar con un párrafo: ¿qué hito te parece el más importante y por qué?",
      "Entregar en PDF o enlace a una herramienta interactiva (Canva, TimelineJS, Genially).",
    ],
    rubrica: [
      { criterio: "Exactitud cronológica y dominio de los conceptos de hardware", peso: 40 },
      { criterio: "Inclusión y comprensión del movimiento de software libre", peso: 30 },
      { criterio: "Diseño visual, claridad de los esquemas y jerarquía de la información", peso: 20 },
      { criterio: "Ortografía y redacción técnica", peso: 10 },
    ],
    simuladorTitulo: "Borrador de tu línea del tiempo",
    simuladorAyuda: "Agrega tus hitos aquí para revisar el formato antes de armar la versión final.",
    phClave: "Año (ej. 1947)",
    phTexto: "Hito y su impacto (ej. Transistor en Bell Labs: sustituye al tubo de vacío)",
    ejemplos: [
      { clave: "1947", texto: "Invención del transistor en Bell Labs" },
      { clave: "1983", texto: "Se anuncia el Proyecto GNU y las cuatro libertades" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const modulo2: ContenidoModulo = {
  dia: 2,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "Historia Legal", "Tu Reto"],

  keynote: {
    gancho: "Cada vez que aceptas los términos y condiciones sin leerlos, estás firmando un contrato legal vinculante. Todos lo hacemos. Todos.",
    parrafo:
      "Aquí está lo incómodo: el software que usas no es tuyo. Compraste una licencia de uso, no el programa. Hay una diferencia enorme entre esas dos cosas, y esa diferencia decide si puedes instalarlo en dos computadoras, si puedes revenderlo, si puedes ver cómo funciona por dentro, y si el día que la empresa cierre te quedas sin nada. Hoy vamos a aprender a leer esa letra chiquita. Y de paso, a entender por qué tu internet se siente más lento de lo que dice el recibo.",
    datos: [
      { cifra: "100.2 millones", etiqueta: "de personas usan internet en México: el 83.1 % de la población de 6 años o más", fuente: "INEGI, ENDUTIH 2024" },
      { cifra: "73.6 %", etiqueta: "de los hogares mexicanos tenían conexión a internet en 2024, más de 28 millones de casas", fuente: "INEGI, ENDUTIH 2024" },
      { cifra: "1989 · 1991 · 2007", etiqueta: "las tres versiones de la Licencia Pública General (GPL), la licencia que inventó el copyleft", fuente: "Free Software Foundation" },
      { cifra: "÷ 8", etiqueta: "el número que casi nadie aplica: hay 8 bits en 1 byte, y por eso tu descarga tarda más de lo que crees", fuente: "Sistema Internacional / IEC 80000-13" },
    ],
    chiste:
      "Contratas 100 megas de internet y descargas un archivo de 800 MB. Tú esperas 8 segundos. Tardan 64. Y culpas a tu proveedor, a la lluvia y al módem. Pero el proveedor vende megabits por segundo y el archivo pesa megabytes. Son ocho veces distinto. Tu internet no te está mintiendo: tú nunca dividiste entre ocho.",
    ctaTitulo: "El reto de hoy",
    ctaTexto:
      "Al terminar esta sesión vas a poder abrir cualquier programa que tengas instalado, encontrar su licencia y decir en voz alta si puedes copiarlo, modificarlo o revenderlo. Es una habilidad que la mayoría de los adultos con trabajo no tiene. Tú la vas a tener hoy.",
    ctaBoton: "Vamos a leer la letra chiquita",
  },

  conceptosTitulo: "Licencias, conexión y unidades: lo que hay que dominar",
  conceptos: [
    {
      icono: "©",
      etiqueta: "Punto de partida",
      titulo: "Derecho de autor: todos los derechos reservados",
      cuerpo:
        "Por defecto, en cuanto alguien crea una obra —un texto, una canción, un programa— nace protegida automáticamente. No hay que registrarla para que exista el derecho. Eso significa que el estado natural de todo lo que ves en internet es: no lo puedes copiar sin permiso.",
      dato: "En México la protección dura toda la vida del autor más 100 años tras su muerte, uno de los plazos más largos del mundo.",
      acento: "rose",
    },
    {
      icono: "🔓",
      etiqueta: "El giro de tuerca",
      titulo: "Copyleft y la licencia GPL",
      cuerpo:
        "El copyleft usa el derecho de autor al revés: en lugar de prohibir, obliga a compartir. La GPL dice que puedes usar, estudiar, copiar y modificar el programa, con una condición: si lo distribuyes modificado, tienes que hacerlo bajo la misma licencia y entregando el código fuente. La libertad se vuelve hereditaria.",
      dato: "GPLv1 en 1989, GPLv2 en 1991 (la del núcleo Linux) y GPLv3 en 2007. Escrita por Richard Stallman y el abogado Eben Moglen.",
      acento: "emerald",
    },
    {
      icono: "🎨",
      etiqueta: "Para obras creativas",
      titulo: "Creative Commons: seis licencias, cuatro piezas",
      cuerpo:
        "Fundada en 2001 por el jurista Lawrence Lessig; las primeras licencias se publicaron en diciembre de 2002. Se arman combinando cuatro condiciones: BY (dar crédito), SA (compartir igual), NC (no comercial) y ND (sin obras derivadas). De ahí salen seis licencias, de la más abierta (CC BY) a la más restrictiva (CC BY-NC-ND).",
      dato: "Wikipedia se publica bajo CC BY-SA. Por eso puedes copiar sus textos legalmente, siempre que des crédito y compartas igual.",
      acento: "violet",
    },
    {
      icono: "🔒",
      etiqueta: "El modelo dominante",
      titulo: "Software privativo y software como servicio",
      cuerpo:
        "El software privativo te vende una licencia de uso: no puedes ver el código, ni modificarlo, ni normalmente instalarlo en cuantos equipos quieras. El software como servicio (SaaS) va más lejos: el programa ni siquiera está en tu máquina, vive en el servidor de la empresa y tú pagas una renta mensual por entrar.",
      dato: "Si dejas de pagar un SaaS, no te quedas con una versión vieja: te quedas sin nada. Y a veces sin acceso a tus propios archivos.",
      acento: "amber",
    },
    {
      icono: "📏",
      etiqueta: "Matemática indispensable",
      titulo: "Bit, byte y sus múltiplos",
      cuerpo:
        "1 bit es un 0 o un 1. 8 bits forman 1 byte, suficiente para una letra. De ahí: 1 KB ≈ mil bytes, 1 MB ≈ un millón, 1 GB ≈ mil millones, 1 TB ≈ un billón. Ojo: los fabricantes usan potencias de 1000 y los sistemas operativos potencias de 1024, y por eso un disco de 1 TB aparece como 931 GB en tu computadora.",
      dato: "No te robaron 69 GB. Es la diferencia entre contar en base 10 y contar en base 2.",
      acento: "cyan",
    },
    {
      icono: "🚀",
      etiqueta: "Rendimiento",
      titulo: "Velocidad, latencia y procesamiento",
      cuerpo:
        "El ancho de banda (Mbps) es cuántos datos caben por segundo; la latencia (ms) es cuánto tarda el primer dato en llegar. Para ver video importa el ancho de banda; para jugar en línea o videollamadas importa la latencia. El procesamiento se mide en hercios: 1 GHz son mil millones de ciclos por segundo.",
      dato: "Puedes tener 500 Mbps y aun así que tu videollamada se corte, si la latencia es alta. Velocidad y respuesta no son lo mismo.",
      acento: "blue",
    },
    {
      icono: "🌐",
      etiqueta: "Cómo funciona",
      titulo: "Qué pasa cuando escribes una dirección web",
      cuerpo:
        "Tu navegador le pregunta al DNS qué número IP corresponde a ese nombre. Con la IP abre una conexión al servidor y le envía una petición HTTPS. El servidor responde con HTML, CSS y JavaScript. El navegador los interpreta y dibuja la página. Todo eso, típicamente, en menos de un segundo.",
      dato: "La S de HTTPS significa que el contenido viaja cifrado. Sin ella, cualquiera en la misma red podría leer lo que envías.",
      acento: "teal",
    },
    {
      icono: "🛡️",
      etiqueta: "Permisos",
      titulo: "Niveles de acceso",
      cuerpo:
        "Todo sistema separa quién puede hacer qué: el usuario común puede usar programas y editar sus archivos; el administrador (root en GNU/Linux) puede instalar software, cambiar configuración del sistema y ver archivos de todos. Trabajar siempre como administrador es cómodo y peligroso a partes iguales.",
      dato: "Si un virus entra con permisos de administrador, tiene los mismos poderes que tú. Por eso los sistemas piden contraseña para instalar cosas.",
      acento: "purple",
    },
  ],

  hitosTitulo: "Historia del derecho a copiar",
  hitosSubtitulo: "Tres siglos de discutir de quién es una obra, desde la imprenta hasta las licencias de la nube.",
  hitos: [
    {
      year: "1710", era: "Origen legal", categoria: "Licencias",
      titulo: "Estatuto de la Reina Ana",
      pioneros: "Parlamento de Gran Bretaña",
      resumen: "Primera ley de derecho de autor del mundo. Otorga al autor —no al impresor— el derecho exclusivo sobre su obra, pero por un plazo limitado, tras el cual la obra pasa al dominio público.",
      impacto: "Establece la idea fundacional: el copyright es un trato temporal con la sociedad, no una propiedad eterna.",
      acento: "amber",
    },
    {
      year: "1886", era: "Origen legal", categoria: "Licencias",
      titulo: "Convenio de Berna",
      pioneros: "Diez países firmantes iniciales",
      resumen: "Establece que la protección del derecho de autor es automática: no hay que registrar nada. Y que una obra protegida en un país lo está en todos los firmantes.",
      impacto: "Por eso todo lo que subes a internet nace protegido por defecto. México se adhirió en 1967.",
      acento: "amber",
    },
    {
      year: "1980", era: "Software Libre", categoria: "Licencias",
      titulo: "La impresora que no se dejó arreglar",
      pioneros: "Richard Stallman, MIT",
      resumen: "El laboratorio recibe una impresora Xerox que se atasca constantemente. Stallman quiere modificar su programa para que avise cuando falle, pero el fabricante se niega a entregar el código fuente.",
      impacto: "Un incidente de oficina se convierte en la chispa de todo el movimiento del software libre.",
      acento: "emerald",
    },
    {
      year: "1989", era: "Copyleft", categoria: "Licencias",
      titulo: "Se publica la GPL versión 1",
      pioneros: "Richard Stallman (Free Software Foundation)",
      resumen: "Primera licencia con copyleft fuerte: garantiza las libertades del usuario y exige que cualquier versión derivada las conserve.",
      impacto: "Convierte la ética del software libre en un instrumento jurídico exigible ante un tribunal.",
      acento: "emerald",
    },
    {
      year: "1991", era: "Copyleft", categoria: "Licencias",
      titulo: "GPL versión 2 y el núcleo Linux",
      pioneros: "Free Software Foundation / Linus Torvalds",
      resumen: "La GPLv2 corrige ambigüedades y añade la cláusula 'libertad o muerte': si una patente te impide cumplir la licencia, no puedes distribuir el programa en absoluto.",
      impacto: "Linux la adoptó y nunca migró a la v3. Es probablemente la licencia de software más usada de la historia.",
      acento: "emerald",
    },
    {
      year: "2001", era: "Cultura Libre", categoria: "Licencias",
      titulo: "Se funda Creative Commons",
      pioneros: "Lawrence Lessig y colaboradores",
      resumen: "Un jurista de Stanford propone llevar la lógica del copyleft más allá del software: a textos, fotos, música y video. Las primeras licencias salen en diciembre de 2002.",
      impacto: "Da a cualquier creador una forma sencilla y legal de decir 'sí puedes usar mi obra, bajo estas condiciones'.",
      acento: "violet",
    },
    {
      year: "2007", era: "Copyleft", categoria: "Licencias",
      titulo: "GPL versión 3",
      pioneros: "Richard Stallman y Eben Moglen",
      resumen: "Responde a dos amenazas nuevas: las patentes de software y la 'tivoización' (aparatos que incluyen software libre pero bloquean por hardware la instalación de versiones modificadas).",
      impacto: "Reconoce que la libertad del software se puede anular desde el hardware, y lo prohíbe explícitamente.",
      acento: "emerald",
    },
    {
      year: "2013", era: "Cultura Libre", categoria: "Licencias",
      titulo: "Creative Commons 4.0",
      pioneros: "Creative Commons",
      resumen: "Una sola versión internacional válida en todos los países, sin necesidad de adaptaciones locales, y con cobertura explícita sobre bases de datos.",
      impacto: "Es la versión que hoy usan repositorios académicos, museos y gobiernos para abrir sus acervos.",
      acento: "violet",
    },
    {
      year: "2024", era: "México hoy", categoria: "Conectividad",
      titulo: "100.2 millones de personas conectadas en México",
      pioneros: "INEGI, Encuesta ENDUTIH",
      resumen: "El 83.1 % de la población de 6 años o más usa internet y el 73.6 % de los hogares tiene conexión. La cifra creció, pero sigue habiendo aproximadamente 20 millones de personas fuera.",
      impacto: "Cada punto porcentual son cientos de miles de personas que no pueden hacer un trámite, estudiar en línea ni buscar trabajo por internet.",
      acento: "cyan",
    },
  ],

  ejes: [
    { nombre: "Licencias libres", acento: "emerald" },
    { nombre: "Derecho de autor", acento: "violet" },
    { nombre: "Conectividad", acento: "teal" },
    { nombre: "Unidades de medida", acento: "cyan" },
  ],
  preguntas: [
    {
      pregunta: "¿Qué caracteriza a una licencia con copyleft como la GPL?",
      opciones: [
        "Prohíbe cualquier uso comercial del programa",
        "Permite usar, estudiar, copiar y modificar, pero obliga a que las versiones derivadas conserven la misma licencia",
        "Cede la obra al dominio público sin ninguna condición",
        "Solo permite usar el programa durante un año",
      ],
      correcta: 1, categoria: "Licencias libres",
      explicacion: "El copyleft usa el derecho de autor para garantizar la libertad, no para restringirla. La libertad se hereda a toda versión derivada.",
    },
    {
      pregunta: "¿Cuántos bits hay en un byte?",
      opciones: ["4", "8", "16", "1024"],
      correcta: 1, categoria: "Unidades de medida",
      explicacion: "8 bits = 1 byte. Ese factor de 8 explica por qué una conexión de 100 Mbps descarga alrededor de 12.5 MB por segundo, no 100.",
    },
    {
      pregunta: "¿Qué significan las siglas de la condición 'SA' en una licencia Creative Commons?",
      opciones: [
        "Sin Autorización: no se puede usar la obra",
        "Share Alike o Compartir Igual: las obras derivadas deben llevar la misma licencia",
        "Sólo Académico: uso restringido a escuelas",
        "Servicio Anual: la licencia caduca cada año",
      ],
      correcta: 1, categoria: "Licencias libres",
      explicacion: "SA es la pieza copyleft de Creative Commons. Wikipedia usa CC BY-SA: puedes reutilizar su contenido si das crédito y compartes bajo la misma licencia.",
    },
    {
      pregunta: "¿En qué año se fundó Creative Commons?",
      opciones: ["1989", "1998", "2001", "2010"],
      correcta: 2, categoria: "Derecho de autor",
      explicacion: "Fundada en 2001 por Lawrence Lessig; el primer conjunto de licencias se publicó en diciembre de 2002.",
    },
    {
      pregunta: "Según la ENDUTIH 2024 del INEGI, ¿qué porcentaje de la población mexicana de 6 años o más usa internet?",
      opciones: ["58.4 %", "68.9 %", "83.1 %", "95.2 %"],
      correcta: 2, categoria: "Conectividad",
      explicacion: "83.1 %, equivalente a 100.2 millones de personas. Aun así, casi 20 millones siguen sin acceso.",
    },
    {
      pregunta: "¿Cuál es la diferencia entre ancho de banda y latencia?",
      opciones: [
        "Son sinónimos, ambos se miden en megabits por segundo",
        "El ancho de banda es cuántos datos caben por segundo; la latencia es cuánto tarda el primer dato en llegar",
        "El ancho de banda mide la señal Wi-Fi y la latencia mide el cable",
        "La latencia solo existe en conexiones por fibra óptica",
      ],
      correcta: 1, categoria: "Conectividad",
      explicacion: "Por eso puedes tener 500 Mbps y aun así una videollamada entrecortada: mucho ancho de banda no compensa una latencia alta.",
    },
    {
      pregunta: "¿Qué distingue al software como servicio (SaaS) del software instalado tradicional?",
      opciones: [
        "El SaaS siempre es gratuito",
        "El programa se ejecuta en servidores de la empresa y se accede por renta o suscripción, no se instala en tu equipo",
        "El SaaS solo funciona en teléfonos móviles",
        "El SaaS incluye siempre el código fuente",
      ],
      correcta: 1, categoria: "Derecho de autor",
      explicacion: "Al no tener el programa, si dejas de pagar pierdes el acceso por completo, y a veces también la posibilidad de exportar tus propios archivos.",
    },
    {
      pregunta: "¿Por qué un disco duro anunciado como de 1 TB aparece con menos capacidad en el sistema operativo?",
      opciones: [
        "Porque el fabricante reserva espacio para publicidad",
        "Porque el fabricante cuenta en potencias de 1000 y el sistema operativo en potencias de 1024",
        "Porque el disco viene con archivos preinstalados que ocupan 70 GB",
        "Porque el sistema operativo comprime automáticamente el espacio",
      ],
      correcta: 1, categoria: "Unidades de medida",
      explicacion: "1 TB comercial = 1,000,000,000,000 bytes, que el sistema muestra como unos 931 GiB. No falta nada: son dos formas de contar.",
    },
    {
      pregunta: "¿Qué hace el sistema DNS cuando escribes una dirección web?",
      opciones: [
        "Cifra la conexión con el servidor",
        "Traduce el nombre del sitio a la dirección IP numérica del servidor",
        "Comprime las imágenes de la página para que carguen más rápido",
        "Guarda tu historial de navegación",
      ],
      correcta: 1, categoria: "Conectividad",
      explicacion: "El DNS es la agenda telefónica de internet: convierte nombres que las personas recordamos en números que las máquinas usan.",
    },
    {
      pregunta: "¿Qué puede hacer una cuenta con permisos de administrador que no puede hacer una cuenta de usuario común?",
      opciones: [
        "Navegar por internet",
        "Instalar programas, modificar la configuración del sistema y acceder a archivos de otros usuarios",
        "Abrir documentos de texto",
        "Conectarse a una red Wi-Fi",
      ],
      correcta: 1, categoria: "Derecho de autor",
      explicacion: "Por eso conviene usar a diario una cuenta sin privilegios: si un programa malicioso entra, hereda exactamente los permisos que tú tenías en ese momento.",
    },
  ],

  tarea: {
    titulo: "Auditoría de licencias y conexión de tu propio equipo",
    descripcion:
      "Investiga bajo qué licencia usas el software de tu casa o de la escuela, y mide tu conexión real. Vas a descubrir cuánto de lo que usas no te pertenece y cuánta velocidad realmente tienes.",
    requisitos: [
      "Elegir 5 programas que uses habitualmente y determinar su licencia: privativa, libre (GPL, MIT, Apache) o servicio en línea.",
      "Para cada uno, responder: ¿puedes copiarlo legalmente a otra computadora? ¿Puedes ver su código?",
      "Proponer una alternativa libre para al menos 2 de los programas privativos.",
      "Medir tu conexión (velocidad de bajada en Mbps y latencia en ms) y calcular cuánto tardaría bajar un archivo de 4 GB. Mostrar la operación.",
      "Comparar tu resultado con la media nacional de la ENDUTIH 2024 y comentar la diferencia.",
      "Entregar en una tabla comparativa, en PDF o presentación.",
    ],
    rubrica: [
      { criterio: "Identificación correcta de los tipos de licencia y sus permisos", peso: 35 },
      { criterio: "Cálculo correcto de unidades de medida con el procedimiento visible", peso: 30 },
      { criterio: "Pertinencia de las alternativas libres propuestas", peso: 20 },
      { criterio: "Presentación, ortografía y citación de fuentes", peso: 15 },
    ],
    simuladorTitulo: "Tabla de licencias",
    simuladorAyuda: "Registra aquí cada programa y la licencia que le encontraste.",
    phClave: "Programa (ej. GIMP)",
    phTexto: "Licencia y qué te permite (ej. GPL: copiar, modificar y redistribuir)",
    ejemplos: [
      { clave: "LibreOffice", texto: "MPL 2.0 — libre: puedes copiarlo, estudiarlo y redistribuirlo" },
      { clave: "Microsoft Office 365", texto: "Privativa por suscripción — sin pago, sin acceso" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const modulo3: ContenidoModulo = {
  dia: 3,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "Cómo llegamos aquí", "Tu Reto"],

  keynote: {
    gancho: "En Sonora, 91 de cada 100 personas usan internet. En Chiapas, 65. Mismo país, misma Constitución, misma moneda.",
    parrafo:
      "Nos han contado que la tecnología iguala a todos. Los números dicen otra cosa: la tecnología amplifica las diferencias que ya existían. Quien tenía acceso, aprende más rápido; quien no lo tenía, se queda más atrás que antes. Y mientras eso pasa, un puñado de empresas convirtió tu atención —el tiempo que pasas mirando una pantalla— en el producto más rentable de la historia. Hoy no vamos a hablar de aparatos. Vamos a hablar de poder.",
    datos: [
      { cifra: "91.3 % vs 64.9 %", etiqueta: "usuarios de internet en Sonora frente a Chiapas. 26 puntos de diferencia dentro del mismo país", fuente: "INEGI, ENDUTIH 2024" },
      { cifra: "86.9 % vs 68.5 %", etiqueta: "la brecha entre zonas urbanas y rurales en México", fuente: "INEGI, ENDUTIH 2024" },
      { cifra: "~20 millones", etiqueta: "de personas en México siguen sin usar internet en 2024", fuente: "Cálculo sobre INEGI, ENDUTIH 2024" },
      { cifra: "1971", etiqueta: "año en que Herbert Simon advirtió que la abundancia de información produce pobreza de atención", fuente: "H. Simon, 'Designing Organizations for an Information-Rich World'" },
    ],
    chiste:
      "Las aplicaciones que más usas son gratis. Nadie te cobra un peso. Y sin embargo esas empresas están entre las más valiosas del planeta. Piénsalo dos segundos: si el servicio es gratis y la empresa vale miles de millones… el dinero sale de algún lado. Sale de ti. No de tu cartera: de tus ojos, tus horas y tus datos.",
    ctaTitulo: "Lo que te vas a llevar de esta clase",
    ctaTexto:
      "Al final vas a poder abrir tu teléfono, ver cuánto tiempo pasaste en cada aplicación esta semana y calcular exactamente cuántos días de tu vida al año se van ahí. No para que sientas culpa. Para que decidas tú, y no un algoritmo diseñado por gente que gana cuando no decides.",
    ctaBoton: "Quiero ver los números",
  },

  conceptosTitulo: "Siete ideas para leer críticamente la tecnología",
  conceptos: [
    {
      icono: "👁️",
      etiqueta: "Economía de la atención",
      titulo: "Tu atención es un recurso escaso y cotizado",
      cuerpo:
        "En 1971 el Nobel de Economía Herbert Simon escribió que en un mundo lleno de información, lo escaso deja de ser la información y pasa a ser la atención de quien la recibe. Cincuenta años después existe una industria completa dedicada a capturarla, medirla y venderla.",
      dato: "Simon lo dijo antes de que existieran internet, el celular y las redes sociales. Se adelantó medio siglo.",
      acento: "amber",
    },
    {
      icono: "🎰",
      etiqueta: "Diseño persuasivo",
      titulo: "Recompensa variable: por qué no puedes soltarlo",
      cuerpo:
        "El deslizar para actualizar, el desplazamiento infinito y las notificaciones agrupadas usan el mismo principio psicológico que una máquina tragamonedas: la recompensa llega de forma impredecible. Cuando no sabes si el siguiente contenido será interesante, sigues buscando. Eso no es un accidente de diseño, es el diseño.",
      dato: "El desplazamiento infinito fue inventado en 2006 por Aza Raskin. Años después declaró públicamente su arrepentimiento por haberlo creado.",
      acento: "rose",
    },
    {
      icono: "📡",
      etiqueta: "Concepto crítico",
      titulo: "Colonialismo de datos",
      cuerpo:
        "Concepto desarrollado por Nick Couldry y Ulises A. Mejías en 'The Costs of Connection' (2019). Sostienen que así como el colonialismo histórico se apropió de tierra y trabajo, hoy se apropia de la vida cotidiana convirtiéndola en datos: lo que compras, con quién hablas, por dónde caminas.",
      dato: "El flujo va del sur global hacia el norte: los datos se generan en todas partes, pero se procesan y monetizan en muy pocos lugares.",
      acento: "violet",
    },
    {
      icono: "📊",
      etiqueta: "Concepto crítico",
      titulo: "Capitalismo de vigilancia",
      cuerpo:
        "Término de la investigadora de Harvard Shoshana Zuboff (2019). Describe un modelo de negocio donde la materia prima gratuita es tu experiencia personal, y el producto final son predicciones sobre tu comportamiento futuro, que se venden a quien quiera influir en él.",
      dato: "El producto no eres tú exactamente. El producto es la predicción de lo que vas a hacer mañana.",
      acento: "purple",
    },
    {
      icono: "🇲🇽",
      etiqueta: "Datos de México",
      titulo: "La brecha digital no es una sola",
      cuerpo:
        "Hay al menos tres brechas simultáneas. Regional: Sonora 91.3 % contra Chiapas 64.9 %. Territorial: 86.9 % urbano contra 68.5 % rural. Y de género: 84.1 % de los hombres contra 82.3 % de las mujeres. Se acumulan: una mujer en una zona rural de Chiapas enfrenta las tres a la vez.",
      dato: "Fuente: ENDUTIH 2024 del INEGI. Son datos oficiales, públicos y descargables.",
      acento: "cyan",
    },
    {
      icono: "⛓️",
      etiqueta: "Riesgo estructural",
      titulo: "Dependencia tecnológica",
      cuerpo:
        "Ocurre cuando una persona, una escuela o un país no puede funcionar sin una tecnología que no controla ni puede reemplazar. Si toda la administración escolar vive en una plataforma extranjera y esa plataforma sube el precio, cambia las reglas o cierra, no hay plan B.",
      dato: "Es exactamente el argumento que usan los gobiernos que migran su administración pública a software libre: soberanía, no ahorro.",
      acento: "emerald",
    },
    {
      icono: "🫧",
      etiqueta: "Efecto algorítmico",
      titulo: "Burbuja de filtro y cámara de eco",
      cuerpo:
        "Los sistemas de recomendación te muestran más de lo que ya te gustó, porque eso maximiza el tiempo que pasas conectado. El efecto secundario es que dejas de encontrarte con ideas distintas a las tuyas y empiezas a creer que todo el mundo piensa como tú.",
      dato: "Dos personas buscando exactamente lo mismo el mismo día pueden recibir resultados diferentes. No existe 'el' internet: existe el tuyo.",
      acento: "teal",
    },
  ],

  hitosTitulo: "Cómo la información se volvió un negocio",
  hitosSubtitulo: "De una advertencia académica en 1971 a las empresas más valiosas del planeta.",
  hitos: [
    {
      year: "1971", era: "Advertencia temprana", categoria: "Sociedad",
      titulo: "Herbert Simon nombra la escasez de atención",
      pioneros: "Herbert A. Simon, Nobel de Economía 1978",
      resumen: "Escribe que la riqueza de información produce necesariamente pobreza de atención, y que por tanto habrá que aprender a repartir la atención con eficiencia entre demasiadas fuentes que la reclaman.",
      impacto: "Es el marco conceptual con el que hoy se analiza todo el negocio de las redes sociales, formulado décadas antes de que existieran.",
      acento: "amber",
    },
    {
      year: "2000", era: "Publicidad digital", categoria: "Corporaciones",
      titulo: "Nace la publicidad dirigida a escala",
      pioneros: "Google",
      resumen: "Google lanza su plataforma de anuncios: en lugar de vender espacio como un periódico, vende intención. Cobra solo cuando alguien hace clic y ordena los anuncios según lo que la persona está buscando en ese momento.",
      impacto: "Se descubre que los datos de comportamiento valen más que el espacio publicitario. Ese descubrimiento reordena internet entero.",
      acento: "violet",
    },
    {
      year: "2004", era: "Redes sociales", categoria: "Corporaciones",
      titulo: "Las redes sociales convierten la vida privada en contenido",
      pioneros: "Facebook y sus sucesoras",
      resumen: "El modelo cambia: ya no publicas para un público, publicas para una plataforma que registra cada interacción, cada pausa al desplazar y cada persona con la que hablas.",
      impacto: "La materia prima deja de ser lo que publicas y pasa a ser cómo te comportas mientras lo publicas.",
      acento: "rose",
    },
    {
      year: "2006", era: "Diseño persuasivo", categoria: "Sociedad",
      titulo: "Se inventa el desplazamiento infinito",
      pioneros: "Aza Raskin",
      resumen: "Elimina el botón de 'siguiente página'. Sin un punto natural de detención, el cerebro no recibe la señal de que ya terminó y sigue consumiendo.",
      impacto: "Raskin declaró años después su arrepentimiento público. Sigue implementado prácticamente en todas las aplicaciones que usas.",
      acento: "rose",
    },
    {
      year: "2013", era: "Vigilancia", categoria: "Sociedad",
      titulo: "Las revelaciones de Edward Snowden",
      pioneros: "Edward Snowden, The Guardian, The Washington Post",
      resumen: "Documentos filtrados muestran programas de vigilancia masiva de comunicaciones a escala global, con colaboración de grandes empresas tecnológicas.",
      impacto: "La privacidad deja de ser una preocupación teórica. Se acelera la adopción de HTTPS y del cifrado de extremo a extremo en mensajería.",
      acento: "blue",
    },
    {
      year: "2018", era: "Vigilancia", categoria: "Corporaciones",
      titulo: "El caso Cambridge Analytica",
      pioneros: "Christopher Wylie (denunciante), The Guardian, The Observer",
      resumen: "Se revela que los datos de decenas de millones de perfiles se usaron sin consentimiento para construir perfiles psicológicos y dirigir propaganda política personalizada.",
      impacto: "Demostró que los datos de comportamiento no solo sirven para venderte zapatos: sirven para intentar cambiar cómo votas.",
      acento: "rose",
    },
    {
      year: "2019", era: "Pensamiento crítico", categoria: "Sociedad",
      titulo: "Dos libros ponen nombre al fenómeno",
      pioneros: "Shoshana Zuboff / Nick Couldry y Ulises A. Mejías",
      resumen: "Se publican 'The Age of Surveillance Capitalism' y 'The Costs of Connection'. El primero describe el modelo de negocio; el segundo, su dimensión colonial y su efecto sobre el sur global.",
      impacto: "Le dan a la crítica de la tecnología un vocabulario preciso, que hoy se usa en tribunales, parlamentos y aulas como esta.",
      acento: "violet",
    },
    {
      year: "2024", era: "México hoy", categoria: "Desigualdad",
      titulo: "La brecha digital mexicana, medida",
      pioneros: "INEGI, Encuesta ENDUTIH",
      resumen: "100.2 millones de usuarios (83.1 %), pero con 26 puntos de diferencia entre el estado más conectado y el menos conectado, y 18 puntos entre zona urbana y rural.",
      impacto: "Mientras se discute la inteligencia artificial, uno de cada seis mexicanos todavía no puede hacer un trámite en línea.",
      acento: "cyan",
    },
  ],

  ejes: [
    { nombre: "Economía de la atención", acento: "amber" },
    { nombre: "Datos y vigilancia", acento: "violet" },
    { nombre: "Brecha digital", acento: "cyan" },
    { nombre: "Dependencia tecnológica", acento: "emerald" },
  ],
  preguntas: [
    {
      pregunta: "Según la ENDUTIH 2024, ¿cuál es la diferencia en uso de internet entre zonas urbanas y rurales en México?",
      opciones: ["86.9 % urbano frente a 68.5 % rural", "95 % urbano frente a 90 % rural", "70 % urbano frente a 65 % rural", "No existe diferencia medible"],
      correcta: 0, categoria: "Brecha digital",
      explicacion: "Más de 18 puntos porcentuales de diferencia. La brecha territorial sigue siendo una de las más marcadas del país.",
    },
    {
      pregunta: "¿Qué planteó Herbert Simon en 1971 sobre la información?",
      opciones: [
        "Que la información sería gratuita para siempre",
        "Que la abundancia de información genera escasez de atención",
        "Que las computadoras sustituirían a los periódicos",
        "Que internet debía ser regulado por los gobiernos",
      ],
      correcta: 1, categoria: "Economía de la atención",
      explicacion: "Formuló el principio de la economía de la atención antes de que existiera internet comercial. Es la base teórica del negocio actual de las plataformas.",
    },
    {
      pregunta: "¿Qué describe el concepto de colonialismo de datos de Couldry y Mejías?",
      opciones: [
        "El uso de servidores ubicados en países extranjeros",
        "La apropiación de la vida cotidiana convertida en datos, replicando la lógica del colonialismo histórico",
        "El costo de la conexión a internet en países pobres",
        "La censura de contenidos por parte de gobiernos",
      ],
      correcta: 1, categoria: "Datos y vigilancia",
      explicacion: "Así como el colonialismo se apropió de tierra y trabajo, este se apropia de la experiencia humana convertida en materia prima.",
    },
    {
      pregunta: "En el modelo de negocio de las plataformas gratuitas, ¿cuál es el producto que se vende?",
      opciones: [
        "El software de la aplicación",
        "Predicciones sobre el comportamiento futuro de las personas usuarias",
        "El espacio de almacenamiento en la nube",
        "Los dispositivos móviles",
      ],
      correcta: 1, categoria: "Economía de la atención",
      explicacion: "Zuboff lo llama capitalismo de vigilancia: la materia prima es tu experiencia y el producto final es una predicción sobre lo que harás.",
    },
    {
      pregunta: "¿Qué es la dependencia tecnológica?",
      opciones: [
        "Pasar demasiadas horas frente a una pantalla",
        "La incapacidad de una persona, institución o país de operar sin una tecnología que no controla ni puede reemplazar",
        "Necesitar cargar el teléfono todos los días",
        "Usar únicamente software libre",
      ],
      correcta: 1, categoria: "Dependencia tecnológica",
      explicacion: "No es un problema individual sino estructural: si la plataforma cambia sus reglas, sube el precio o cierra, no existe alternativa disponible.",
    },
    {
      pregunta: "¿Cuál es el estado de México con menor porcentaje de personas usuarias de internet según la ENDUTIH 2024?",
      opciones: ["Oaxaca", "Chiapas", "Guerrero", "Veracruz"],
      correcta: 1, categoria: "Brecha digital",
      explicacion: "Chiapas, con 64.9 %, seguido de Oaxaca con 69.2 %. El extremo opuesto es Sonora, con 91.3 %.",
    },
    {
      pregunta: "¿Qué es una burbuja de filtro?",
      opciones: [
        "Un antivirus que bloquea sitios peligrosos",
        "El efecto por el cual los algoritmos te muestran principalmente contenido que confirma lo que ya piensas",
        "Un tipo de conexión a internet por satélite",
        "Una función de privacidad del navegador",
      ],
      correcta: 1, categoria: "Datos y vigilancia",
      explicacion: "Al optimizar por tiempo de permanencia, el sistema te da más de lo que ya te gustó, reduciendo tu exposición a puntos de vista distintos.",
    },
    {
      pregunta: "¿Por qué el desplazamiento infinito resulta tan difícil de interrumpir?",
      opciones: [
        "Porque consume menos batería que la paginación",
        "Porque elimina los puntos naturales de detención y entrega recompensas de forma impredecible",
        "Porque carga las imágenes en mayor calidad",
        "Porque está diseñado para personas con poca vista",
      ],
      correcta: 1, categoria: "Economía de la atención",
      explicacion: "Es el mismo principio de recompensa variable de las máquinas de apuestas. Su creador, Aza Raskin, se ha disculpado públicamente por haberlo inventado.",
    },
    {
      pregunta: "¿Cuántas personas aproximadamente seguían sin usar internet en México en 2024?",
      opciones: ["Menos de 5 millones", "Alrededor de 20 millones", "Alrededor de 50 millones", "Más de 70 millones"],
      correcta: 1, categoria: "Brecha digital",
      explicacion: "Con 100.2 millones de personas usuarias equivalentes al 83.1 %, quedan cerca de 20 millones fuera. No es un detalle estadístico: son personas sin acceso a trámites, educación y empleo en línea.",
    },
    {
      pregunta: "¿Qué argumento principal usan los gobiernos que migran su administración pública a software libre?",
      opciones: [
        "Que el software libre es siempre más bonito",
        "La soberanía tecnológica: no depender de una empresa extranjera que puede cambiar precios o condiciones",
        "Que el software libre no necesita mantenimiento",
        "Que es obligatorio por tratados internacionales",
      ],
      correcta: 1, categoria: "Dependencia tecnológica",
      explicacion: "El ahorro es un efecto secundario. El argumento de fondo es el control sobre la infraestructura crítica del propio Estado.",
    },
  ],

  tarea: {
    titulo: "Auditoría de tu propia atención y foro de debate",
    descripcion:
      "Vas a medir con datos reales cuánto de tu tiempo capturan las plataformas, y después vas a defender una postura argumentada sobre si la tecnología iguala o profundiza las desigualdades en México.",
    requisitos: [
      "Registrar durante 7 días el tiempo de uso por aplicación (herramienta de bienestar digital del propio teléfono).",
      "Calcular el total semanal, proyectarlo a un año y expresarlo en días completos de vida.",
      "Identificar cuáles de esas aplicaciones son gratuitas y explicar de dónde sale su dinero.",
      "Comparar tu porcentaje de conectividad estatal con Chiapas (64.9 %) y Sonora (91.3 %) usando datos ENDUTIH 2024.",
      "Escribir una postura de una cuartilla: ¿la tecnología reduce o amplía la desigualdad? Con al menos 3 datos citados.",
      "Participar en el foro presentando tu postura y respondiendo a una postura contraria.",
    ],
    rubrica: [
      { criterio: "Uso correcto de datos reales y citación de fuentes oficiales", peso: 35 },
      { criterio: "Calidad del argumento crítico y de la postura personal", peso: 30 },
      { criterio: "Participación en el foro y respuesta a posturas contrarias", peso: 20 },
      { criterio: "Redacción, ortografía y presentación", peso: 15 },
    ],
    simuladorTitulo: "Registro de uso semanal",
    simuladorAyuda: "Anota cada aplicación con las horas que le dedicaste esta semana.",
    phClave: "Aplicación",
    phTexto: "Horas a la semana y para qué la usaste",
    ejemplos: [
      { clave: "Video corto", texto: "14 h/semana — 30 días completos al año" },
      { clave: "Mensajería", texto: "7 h/semana — mayormente grupos escolares" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const modulo4: ContenidoModulo = {
  dia: 4,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "La Rebelión", "Tu Reto"],

  keynote: {
    gancho: "Las 500 supercomputadoras más rápidas del planeta corren Linux. Las 500. El cien por ciento. Ninguna pagó licencia.",
    parrafo:
      "Esto debería ser imposible según todo lo que nos enseñaron sobre cómo funciona la economía. Un sistema operativo que nadie vende, construido por voluntarios repartidos por el mundo, terminó siendo el más confiable del planeta. Corre en los servidores de internet, en el telescopio espacial, en tu router, en tu televisión y en el teléfono Android de tu bolsillo. Hoy vas a entender por qué pasó, y por qué tú puedes usarlo todo sin pagar un peso y sin piratear nada.",
    datos: [
      { cifra: "500 de 500", etiqueta: "supercomputadoras del ranking TOP500 corren Linux, sin excepción, desde noviembre de 2017", fuente: "TOP500.org" },
      { cifra: "4", etiqueta: "libertades definen al software libre. Y están numeradas desde el cero", fuente: "Free Software Foundation" },
      { cifra: "1983 → 1991", etiqueta: "ocho años entre el anuncio del Proyecto GNU y el núcleo Linux que lo completó", fuente: "GNU Project / Linux Kernel Archives" },
      { cifra: "$0", etiqueta: "cuesta LibreOffice, GIMP, Inkscape, Krita, Audacity y Blender. Legalmente. Para siempre", fuente: "Licencias GPL / MPL de cada proyecto" },
    ],
    chiste:
      "Richard Stallman numeró las libertades del software empezando por la libertad CERO. ¿Por qué? Porque en programación se cuenta desde cero. Lleva cuarenta años un chiste de programador metido en un documento fundacional de ética, y nadie se ha atrevido a quitarlo. Eso te dice todo sobre esta gente.",
    ctaTitulo: "Tu tarea empieza hoy, no en casa",
    ctaTexto:
      "Antes de que termine la clase quiero que instales o abras al menos una alternativa libre. LibreOffice si escribes, GIMP si editas imágenes, Audacity si trabajas con audio. No para que abandones lo que usas: para que sepas que tienes salida. Quien conoce la alternativa negocia distinto.",
    ctaBoton: "Muéstrame las alternativas",
  },

  conceptosTitulo: "Las cuatro libertades y qué hacer con ellas",
  conceptos: [
    {
      icono: "0️⃣",
      etiqueta: "Libertad 0",
      titulo: "Usar el programa para lo que tú quieras",
      cuerpo:
        "Ejecutarlo con cualquier propósito, sin tener que justificarlo. Nadie puede decirte que solo lo uses para fines educativos, no comerciales, o dentro de un país. Sin esta libertad, las otras tres no sirven de nada.",
      dato: "Contrasta con las licencias educativas o de estudiante, que legalmente te prohíben cobrar por el trabajo que hiciste con ellas.",
      acento: "emerald",
    },
    {
      icono: "1️⃣",
      etiqueta: "Libertad 1",
      titulo: "Estudiar cómo funciona y modificarlo",
      cuerpo:
        "Poder abrir el programa, leer su código fuente y cambiarlo para que haga lo que tú necesitas. Requiere que el código fuente esté disponible: sin código, esta libertad es una promesa vacía.",
      dato: "Es la libertad que le negaron a Stallman con la impresora del MIT en 1980, y de ahí salió todo el movimiento.",
      acento: "cyan",
    },
    {
      icono: "2️⃣",
      etiqueta: "Libertad 2",
      titulo: "Redistribuir copias para ayudar a otros",
      cuerpo:
        "Pasarle el programa a un compañero, instalarlo en el laboratorio completo de la escuela o quemarlo en cien memorias USB, sin pedir permiso ni pagar por cada copia. Compartir deja de ser piratería y se vuelve un derecho reconocido.",
      dato: "Una escuela puede instalar GNU/Linux y LibreOffice en 200 computadoras legalmente. Con software privativo, serían 200 licencias.",
      acento: "violet",
    },
    {
      icono: "3️⃣",
      etiqueta: "Libertad 3",
      titulo: "Mejorarlo y publicar tus mejoras",
      cuerpo:
        "Si arreglas un error o le agregas una función, puedes publicar esa versión para que toda la comunidad se beneficie. Es lo que convierte al software libre en un bien acumulativo: cada mejora se queda para siempre y para todos.",
      dato: "El núcleo Linux recibe aportaciones de miles de personas y de empresas rivales entre sí, que colaboran en el mismo código.",
      acento: "amber",
    },
    {
      icono: "⚖️",
      etiqueta: "Distinción clave",
      titulo: "Software libre no es lo mismo que open source",
      cuerpo:
        "Técnicamente el código es casi siempre el mismo; lo que cambia es el argumento. El software libre parte de una posición ética: la libertad del usuario es un derecho. El open source, acuñado en 1998, parte de una posición pragmática: el código abierto produce mejor software y conviene a las empresas.",
      dato: "Mismo código, dos discursos. Stallman insiste en la diferencia porque quien solo argumenta eficiencia abandona la libertad en cuanto deja de ser eficiente.",
      acento: "purple",
    },
    {
      icono: "🐧",
      etiqueta: "El sistema",
      titulo: "GNU/Linux y sus distribuciones",
      cuerpo:
        "Linux es solo el núcleo: la parte que habla con el hardware. Las herramientas que lo vuelven un sistema usable vienen del Proyecto GNU. Una distribución empaqueta núcleo, herramientas, escritorio y programas: Ubuntu y Linux Mint para empezar, Debian para servidores, Fedora para tecnología reciente.",
      dato: "Android usa el núcleo Linux. Si tienes un teléfono Android, ya usas Linux todos los días sin haberlo elegido.",
      acento: "teal",
    },
    {
      icono: "🧰",
      etiqueta: "Manos a la obra",
      titulo: "El equivalente libre de lo que ya usas",
      cuerpo:
        "Para documentos, hojas de cálculo y presentaciones: LibreOffice. Para editar fotografía: GIMP. Para diseño vectorial: Inkscape. Para ilustración digital: Krita. Para audio: Audacity. Para modelado y animación 3D: Blender. Para video: Kdenlive o Shotcut.",
      dato: "Blender se usa en producciones cinematográficas profesionales. Es gratuito y su código es abierto. No es la versión barata de nada.",
      acento: "rose",
    },
    {
      icono: "🔧",
      etiqueta: "Cultura",
      titulo: "Cultura hacker y el hazlo tú mismo",
      cuerpo:
        "Hacker no significa delincuente informático (eso es cracker). Significa alguien que desarma las cosas para entender cómo funcionan y las mejora. Es la misma actitud de quien repara su bicicleta, reinstala un sistema o le da nueva vida a una computadora vieja con una distribución ligera.",
      dato: "Una laptop de 2011 que ya no soporta el sistema operativo actual puede quedar perfectamente usable con una distribución GNU/Linux ligera.",
      acento: "blue",
    },
  ],

  hitosTitulo: "Cuarenta años de la rebelión del software",
  hitosSubtitulo: "De una impresora atascada en el MIT a la infraestructura de internet.",
  hitos: [
    {
      year: "1980", era: "El detonante", categoria: "Software Libre",
      titulo: "La impresora que no se dejó reparar",
      pioneros: "Richard Stallman, laboratorio de IA del MIT",
      resumen: "El laboratorio recibe una impresora Xerox que se atasca sin avisar. Stallman quiere modificar su programa para que notifique los atascos, pero el fabricante se niega a entregar el código fuente y le exige firmar un acuerdo de confidencialidad.",
      impacto: "La frustración de no poder arreglar una máquina propia se convierte en una pregunta política: ¿de quién es el software que corre en tu equipo?",
      acento: "amber",
    },
    {
      year: "1983", era: "Fundación", categoria: "Software Libre",
      titulo: "Se anuncia el Proyecto GNU",
      pioneros: "Richard Stallman",
      resumen: "El 27 de septiembre publica el anuncio de que construirá un sistema operativo completo, libre y compatible con UNIX. GNU es un acrónimo recursivo: GNU's Not Unix.",
      impacto: "Es la primera vez que alguien plantea el software como un asunto de libertad y no solo de precio o calidad técnica.",
      acento: "emerald",
    },
    {
      year: "1985", era: "Fundación", categoria: "Software Libre",
      titulo: "Manifiesto GNU y Free Software Foundation",
      pioneros: "Richard Stallman",
      resumen: "Publica el Manifiesto GNU explicando el porqué del proyecto y funda la Free Software Foundation para sostenerlo jurídica y económicamente.",
      impacto: "El movimiento deja de depender de una persona y adquiere una estructura capaz de sobrevivir décadas.",
      acento: "emerald",
    },
    {
      year: "1989", era: "Herramienta legal", categoria: "Licencias",
      titulo: "La GPL convierte la ética en contrato",
      pioneros: "Richard Stallman y Eben Moglen",
      resumen: "Se publica la Licencia Pública General. Las cuatro libertades dejan de ser una declaración de principios y se vuelven cláusulas exigibles ante un juez.",
      impacto: "Sin la GPL, cualquier empresa podría tomar código libre, cerrarlo y venderlo. La licencia es lo que impide que eso ocurra.",
      acento: "violet",
    },
    {
      year: "1991", era: "La pieza faltante", categoria: "Software Libre",
      titulo: "Linus Torvalds publica el núcleo Linux",
      pioneros: "Linus Torvalds, Universidad de Helsinki",
      resumen: "Un estudiante de 21 años publica el núcleo que a GNU le faltaba. Lo anunció por Usenet describiéndolo como un pasatiempo que no sería 'nada grande ni profesional'.",
      impacto: "Combinado con las herramientas GNU, completa el primer sistema operativo enteramente libre. Es la definición de subestimar el propio trabajo.",
      acento: "cyan",
    },
    {
      year: "1996", era: "Alternativas", categoria: "Aplicaciones",
      titulo: "Nace GIMP",
      pioneros: "Spencer Kimball y Peter Mattis, Universidad de California en Berkeley",
      resumen: "Dos estudiantes crean un editor de imágenes libre como proyecto escolar. Para construir su interfaz desarrollaron la biblioteca GTK, que hoy sostiene escritorios completos de GNU/Linux.",
      impacto: "Demuestra que el software libre no se limita a herramientas de programadores: también puede atender a diseñadores y artistas.",
      acento: "rose",
    },
    {
      year: "1998", era: "Institucionalización", categoria: "Open Source",
      titulo: "Se funda la Open Source Initiative",
      pioneros: "Eric S. Raymond, Bruce Perens, Christine Peterson",
      resumen: "Se acuña el término open source para presentar el código abierto en lenguaje empresarial. Ese mismo año Netscape libera el código de su navegador, dando origen a Mozilla y después a Firefox.",
      impacto: "Abre la puerta a la adopción corporativa masiva, al costo de dejar el argumento ético en segundo plano.",
      acento: "blue",
    },
    {
      year: "2010", era: "Alternativas", categoria: "Aplicaciones",
      titulo: "Nace LibreOffice",
      pioneros: "The Document Foundation",
      resumen: "La comunidad de OpenOffice.org se separa tras la compra de Sun Microsystems por Oracle y crea una fundación independiente que garantice que el proyecto seguirá siendo libre.",
      impacto: "Es la prueba práctica de la libertad 3: cuando el dueño cambia de rumbo, la comunidad puede tomar el código y continuar sin él.",
      acento: "teal",
    },
    {
      year: "2017", era: "Consolidación", categoria: "Software Libre",
      titulo: "Linux alcanza el 100 % del TOP500",
      pioneros: "Comunidad global del núcleo Linux",
      resumen: "En noviembre de 2017, por primera vez, las 500 supercomputadoras más potentes del mundo corren Linux. Ninguna excepción.",
      impacto: "El software construido por voluntarios se vuelve la infraestructura de la ciencia de punta: clima, genoma, astronomía, física de partículas.",
      acento: "emerald",
    },
  ],

  ejes: [
    { nombre: "Las 4 libertades", acento: "emerald" },
    { nombre: "GNU/Linux", acento: "cyan" },
    { nombre: "Alternativas libres", acento: "violet" },
    { nombre: "Cultura hacker", acento: "amber" },
  ],
  preguntas: [
    {
      pregunta: "¿Cuál es la libertad 0 del software libre?",
      opciones: [
        "Descargar el programa sin pagar",
        "Ejecutar el programa para cualquier propósito, sin restricciones",
        "Vender el programa a terceros",
        "Recibir soporte técnico gratuito",
      ],
      correcta: 1, categoria: "Las 4 libertades",
      explicacion: "Se numera desde cero porque en programación se cuenta desde cero. Sin la libertad de uso irrestricto, las otras tres carecen de sentido.",
    },
    {
      pregunta: "¿Qué libertad exige obligatoriamente que el código fuente esté disponible?",
      opciones: ["La libertad 0", "La libertad 1, estudiar y modificar el programa", "La libertad 2", "Ninguna la exige"],
      correcta: 1, categoria: "Las 4 libertades",
      explicacion: "Sin código fuente no puedes estudiar ni modificar nada. Por eso la FSF considera el acceso al código una condición previa, no un extra.",
    },
    {
      pregunta: "¿Qué es exactamente Linux?",
      opciones: [
        "Un sistema operativo completo con todas sus aplicaciones",
        "El núcleo (kernel): la parte del sistema que se comunica con el hardware",
        "Un lenguaje de programación",
        "Una empresa de software",
      ],
      correcta: 1, categoria: "GNU/Linux",
      explicacion: "Linux es el núcleo; las herramientas que lo vuelven usable vienen del Proyecto GNU. Por eso el nombre técnicamente correcto es GNU/Linux.",
    },
    {
      pregunta: "¿Cuál es la principal diferencia entre 'software libre' y 'open source'?",
      opciones: [
        "El open source siempre cuesta dinero",
        "El énfasis del argumento: el software libre parte de la ética y la libertad del usuario; el open source, de la eficiencia técnica y comercial",
        "El software libre no permite uso comercial",
        "El open source no permite modificar el código",
      ],
      correcta: 1, categoria: "Cultura hacker",
      explicacion: "El código suele ser el mismo. Lo que cambia es el porqué: derecho frente a conveniencia. El término open source se acuñó en 1998.",
    },
    {
      pregunta: "¿Qué porcentaje de las 500 supercomputadoras más rápidas del mundo funciona con Linux?",
      opciones: ["Alrededor del 50 %", "Alrededor del 75 %", "Alrededor del 90 %", "El 100 %, desde noviembre de 2017"],
      correcta: 3, categoria: "GNU/Linux",
      explicacion: "Las 500, sin excepción, según el ranking TOP500. Es probablemente el dato más contundente sobre la calidad del software libre.",
    },
    {
      pregunta: "¿Cuál es la alternativa libre más común a una suite de ofimática privativa?",
      opciones: ["LibreOffice", "Blender", "Audacity", "Inkscape"],
      correcta: 0, categoria: "Alternativas libres",
      explicacion: "LibreOffice incluye procesador de textos, hoja de cálculo y presentaciones, y abre los formatos de las suites privativas.",
    },
    {
      pregunta: "¿Qué programa libre se usa para modelado, animación y render 3D a nivel profesional?",
      opciones: ["GIMP", "Krita", "Blender", "Kdenlive"],
      correcta: 2, categoria: "Alternativas libres",
      explicacion: "Blender se ha usado en producciones cinematográficas comerciales. Es gratuito, libre y compite de tú a tú con software de decenas de miles de pesos.",
    },
    {
      pregunta: "¿Qué incidente detonó el movimiento del software libre?",
      opciones: [
        "El lanzamiento de Windows 95",
        "Una impresora del MIT cuyo código fuente el fabricante se negó a entregar",
        "La creación de internet",
        "La quiebra de una empresa de software",
      ],
      correcta: 1, categoria: "Cultura hacker",
      explicacion: "En 1980, Stallman no pudo modificar el programa de una impresora Xerox para que avisara de los atascos. De esa molestia salió el Proyecto GNU.",
    },
    {
      pregunta: "En la cultura informática, ¿qué significa realmente el término 'hacker'?",
      opciones: [
        "Una persona que delinque accediendo ilegalmente a sistemas",
        "Alguien que explora a fondo cómo funcionan las cosas para entenderlas y mejorarlas",
        "Un vendedor de software pirata",
        "Un administrador de servidores",
      ],
      correcta: 1, categoria: "Cultura hacker",
      explicacion: "A quien accede ilegalmente a sistemas se le llama cracker o atacante. Hacker designa una actitud de curiosidad técnica y hazlo tú mismo.",
    },
    {
      pregunta: "¿Por qué nació LibreOffice en 2010?",
      opciones: [
        "Porque OpenOffice dejó de funcionar",
        "Porque la comunidad se separó tras la compra de Sun por Oracle, para garantizar que el proyecto siguiera siendo libre",
        "Porque Microsoft donó el código de Office",
        "Porque una universidad lo desarrolló desde cero",
      ],
      correcta: 1, categoria: "Alternativas libres",
      explicacion: "Es la libertad 3 en acción: cuando el nuevo dueño no dio garantías, la comunidad tomó el código y continuó por su cuenta. Con software privativo eso es imposible.",
    },
  ],

  tarea: {
    titulo: "Migración: una semana con alternativas libres",
    descripcion:
      "No basta con conocer las alternativas: hay que usarlas. Durante una semana vas a sustituir al menos dos programas privativos por sus equivalentes libres y documentar honestamente qué funcionó y qué no.",
    requisitos: [
      "Instalar y usar durante 7 días al menos 2 programas libres (LibreOffice, GIMP, Inkscape, Krita, Audacity, Blender u otro).",
      "Producir con ellos un trabajo real: un documento, una imagen editada o una pista de audio. Adjuntarlo.",
      "Elaborar una tabla comparativa con el programa privativo equivalente: qué se hace igual, qué es más difícil, qué es mejor.",
      "Explicar con tus palabras las 4 libertades y señalar cuál ejerciste al instalarlo.",
      "Investigar y describir una distribución GNU/Linux, indicando a qué tipo de persona usuaria está dirigida.",
      "Concluir: ¿migrarías definitivamente? Justifica con argumentos, no con gustos.",
    ],
    rubrica: [
      { criterio: "Uso real y documentado del software libre, con producto entregado", peso: 35 },
      { criterio: "Comprensión precisa de las 4 libertades y de la diferencia con open source", peso: 25 },
      { criterio: "Calidad de la tabla comparativa y de la investigación sobre distribuciones", peso: 25 },
      { criterio: "Conclusión argumentada, redacción y ortografía", peso: 15 },
    ],
    simuladorTitulo: "Tu plan de migración",
    simuladorAyuda: "Anota qué programa privativo vas a sustituir y con cuál alternativa libre.",
    phClave: "Programa privativo",
    phTexto: "Alternativa libre y para qué la vas a usar",
    ejemplos: [
      { clave: "Photoshop", texto: "GIMP — edición de fotografías para el proyecto de la clase" },
      { clave: "Word", texto: "LibreOffice Writer — reportes y tareas escolares" },
    ],
  },
};

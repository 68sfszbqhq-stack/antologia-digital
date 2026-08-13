import type { ContenidoModulo } from "./tipos";

// ─────────────────────────────────────────────────────────────────────────────
// MÓDULOS 1.5 – 1.8
// Toda cifra citada lleva fuente.
// ─────────────────────────────────────────────────────────────────────────────

export const modulo5: ContenidoModulo = {
  dia: 5,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "Marco Legal", "Tu Reto"],

  keynote: {
    gancho: "El 59 % de los fraudes financieros en México ya no ocurren en un cajero ni en la calle. Ocurren en una pantalla.",
    parrafo:
      "Solo en el primer semestre de 2024 hubo 3.5 millones de reclamaciones por posible fraude en México, por más de 9 mil millones de pesos. Seis de cada diez fueron fraudes cibernéticos. Nadie forzó una puerta. Alguien hizo clic donde no debía, o usó la misma contraseña en cinco lugares. Hoy vamos a hacer dos cosas: entender qué derechos tienes sobre tus datos —porque la ley cambió en 2025 y casi nadie se enteró— y cerrar los agujeros que tienes ahora mismo abiertos.",
    datos: [
      { cifra: "2.07 millones", etiqueta: "de reclamaciones por fraude cibernético en México solo en el primer semestre de 2024: el 59 % del total", fuente: "CONDUSEF, 2024" },
      { cifra: "$9,231 millones", etiqueta: "de pesos reclamados por posible fraude en ese mismo semestre", fuente: "CONDUSEF, 2024" },
      { cifra: "21 marzo 2025", etiqueta: "entró en vigor la nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares", fuente: "DOF, 20 de marzo de 2025" },
      { cifra: "4", etiqueta: "derechos ARCO tienes sobre tus datos: Acceso, Rectificación, Cancelación y Oposición", fuente: "LFPDPPP" },
    ],
    chiste:
      "Tu contraseña es el nombre de tu mascota con el año en que naciste, o de plano 123456. Lo sé. Todos lo sabemos. Un programa de fuerza bruta la adivina en menos tiempo del que tardaste en leer esta frase. Tu perro es adorable y merece todo el cariño del mundo, pero no es un sistema de seguridad.",
    ctaTitulo: "Esto no se hace en casa. Se hace ahora.",
    ctaTexto:
      "Al terminar la clase vas a activar la verificación en dos pasos en tu cuenta principal de correo. Ahí es donde llegan los enlaces para recuperar todas tus demás cuentas: si alguien entra a tu correo, entra a toda tu vida digital. Son tres minutos. Es lo más rentable que vas a hacer hoy.",
    ctaBoton: "Vamos a blindar tus cuentas",
  },

  conceptosTitulo: "Tus derechos, tus riesgos y tus defensas",
  conceptos: [
    {
      icono: "⚖️",
      etiqueta: "Ley vigente",
      titulo: "La nueva LFPDPPP de 2025",
      cuerpo:
        "Publicada en el Diario Oficial de la Federación el 20 de marzo de 2025 y en vigor desde el día siguiente. Sustituye a la ley de 2010 y traslada la autoridad en la materia: el INAI se extinguió y sus funciones sobre datos en manos de particulares pasaron a la Secretaría Anticorrupción y Buen Gobierno.",
      dato: "Si buscas información sobre este tema, verifica la fecha: casi todo lo publicado antes de 2025 menciona al INAI, que ya no existe.",
      acento: "rose",
    },
    {
      icono: "🔑",
      etiqueta: "Tus derechos",
      titulo: "Los derechos ARCO",
      cuerpo:
        "Acceso: saber qué datos tuyos tiene una empresa. Rectificación: corregirlos si están mal. Cancelación: pedir que los eliminen. Oposición: negarte a que los usen para un fin determinado. Se ejercen por escrito ante el responsable, y tiene un plazo legal para responderte.",
      dato: "No son un favor de la empresa. Son un derecho reconocido en el artículo 16 de la Constitución mexicana.",
      acento: "emerald",
    },
    {
      icono: "📄",
      etiqueta: "Documento clave",
      titulo: "El aviso de privacidad",
      cuerpo:
        "Es el documento donde quien recolecta tus datos debe decirte quién es, qué datos recoge, para qué los usará, si los compartirá con terceros y cómo puedes ejercer tus derechos ARCO. Es obligatorio, y no ponerlo a disposición es una infracción.",
      dato: "Ese texto larguísimo que nunca lees sí tiene consecuencias legales. Léelo al menos cuando entregues datos sensibles.",
      acento: "amber",
    },
    {
      icono: "🩺",
      etiqueta: "Categoría especial",
      titulo: "Datos personales sensibles",
      cuerpo:
        "Son los que, si se filtran, pueden generar discriminación o un riesgo grave: origen racial o étnico, estado de salud, información genética, creencias religiosas, opiniones políticas, preferencia sexual y datos biométricos. Requieren consentimiento expreso y por escrito.",
      dato: "Tu huella digital y tu rostro son datos biométricos. Piénsalo dos veces antes de entregarlos a cambio de una promoción.",
      acento: "violet",
    },
    {
      icono: "🎣",
      etiqueta: "Amenaza número uno",
      titulo: "Phishing, smishing y vishing",
      cuerpo:
        "Es engaño, no hackeo. Phishing por correo, smishing por mensaje de texto o WhatsApp, vishing por llamada telefónica. Siempre siguen el mismo guion: crean urgencia ('tu cuenta será bloqueada hoy'), piden que hagas clic o llames, y te llevan a una página idéntica a la real donde tú mismo entregas tus datos.",
      dato: "Regla práctica: ninguna institución financiera legítima te pide contraseñas, NIP ni códigos de verificación por ningún medio. Ninguna. Nunca.",
      acento: "rose",
    },
    {
      icono: "🔐",
      etiqueta: "Defensa esencial",
      titulo: "Verificación en dos pasos",
      cuerpo:
        "Añade un segundo factor además de la contraseña: un código de una aplicación de autenticación, una llave física o tu huella. Aunque roben tu contraseña, sin el segundo factor no entran. Es la única medida que detiene un ataque que ya tuvo éxito parcial.",
      dato: "Prefiere una aplicación de autenticación sobre los códigos por SMS: el SMS puede interceptarse mediante clonación de SIM.",
      acento: "cyan",
    },
    {
      icono: "🗝️",
      etiqueta: "Higiene básica",
      titulo: "Contraseñas y gestores",
      cuerpo:
        "El peor error no es tener una contraseña débil: es repetir la misma en varios sitios. Cuando se filtra la base de datos de un servicio cualquiera, los atacantes prueban esa misma combinación en tu banco y tu correo. Usa una contraseña distinta por sitio y un gestor que las recuerde por ti.",
      dato: "Una frase larga y memorable es más segura que una palabra corta llena de símbolos raros. La longitud vence a la complejidad.",
      acento: "teal",
    },
    {
      icono: "🤖",
      etiqueta: "Ética aplicada",
      titulo: "Uso responsable de la inteligencia artificial",
      cuerpo:
        "Los modelos generativos producen texto plausible, no necesariamente verdadero: inventan datos, fechas y citas con total seguridad (se le llama alucinación). Además reproducen los sesgos de los datos con los que se entrenaron, y todo lo que escribes en el chat sale de tu control.",
      dato: "Nunca pegues datos personales, contraseñas ni información confidencial de terceros en un chat de IA. Y verifica siempre toda cifra o cita que te dé.",
      acento: "purple",
    },
    {
      icono: "©",
      etiqueta: "Autoría",
      titulo: "Licencias, copyleft y contenido generado por IA",
      cuerpo:
        "Usar IA para producir un trabajo escolar sin declararlo es deshonestidad académica. Lo correcto es transparentarlo: decir qué herramienta usaste, para qué, y verificar el resultado. Además, la autoría del contenido generado por IA sigue siendo un terreno legal en disputa a nivel internacional.",
      dato: "Declarar que usaste IA y explicar cómo la verificaste demuestra criterio. Ocultarlo y que te descubran demuestra lo contrario.",
      acento: "blue",
    },
  ],

  hitosTitulo: "Cómo se construyó el derecho a la privacidad",
  hitosSubtitulo: "De la Declaración Universal de 1948 a la ley mexicana vigente desde marzo de 2025.",
  hitos: [
    {
      year: "1948", era: "Derechos humanos", categoria: "Normatividad",
      titulo: "La privacidad se reconoce como derecho humano",
      pioneros: "Organización de las Naciones Unidas",
      resumen: "El artículo 12 de la Declaración Universal de los Derechos Humanos establece que nadie será objeto de injerencias arbitrarias en su vida privada, familia, domicilio o correspondencia.",
      impacto: "Es la raíz de todas las leyes de protección de datos posteriores, escrita cuando la correspondencia todavía viajaba en papel.",
      acento: "amber",
    },
    {
      year: "2010", era: "México", categoria: "Normatividad",
      titulo: "Primera Ley Federal de Protección de Datos en Posesión de Particulares",
      pioneros: "Congreso de la Unión, México",
      resumen: "Publicada el 5 de julio de 2010. Establece por primera vez en México los derechos ARCO, la obligación del aviso de privacidad y el régimen de datos sensibles para el sector privado.",
      impacto: "Puso a México dentro del estándar internacional de protección de datos. Estuvo vigente casi 15 años.",
      acento: "cyan",
    },
    {
      year: "2013", era: "Vigilancia", categoria: "Seguridad",
      titulo: "Las revelaciones de Snowden cambian el cifrado",
      pioneros: "Edward Snowden",
      resumen: "La documentación de programas de vigilancia masiva de comunicaciones provoca una migración acelerada de toda la web hacia HTTPS y la adopción masiva del cifrado de extremo a extremo en mensajería.",
      impacto: "Que hoy tus mensajes viajen cifrados por defecto es consecuencia directa de ese escándalo.",
      acento: "blue",
    },
    {
      year: "2016", era: "Estándar global", categoria: "Normatividad",
      titulo: "Se aprueba el Reglamento General de Protección de Datos europeo",
      pioneros: "Unión Europea",
      resumen: "Aprobado en 2016 y aplicable desde mayo de 2018. Introduce el derecho al olvido, la obligación de notificar las filtraciones y multas de hasta el 4 % de la facturación global de la empresa.",
      impacto: "Al ser el mercado europeo demasiado grande para ignorarlo, sus reglas terminaron aplicándose a usuarios de todo el mundo.",
      acento: "violet",
    },
    {
      year: "2022", era: "Era de la IA", categoria: "Seguridad",
      titulo: "La IA generativa se vuelve masiva",
      pioneros: "Industria de modelos de lenguaje",
      resumen: "Los modelos generativos llegan al público general. Con ellos aparecen problemas nuevos: suplantación por voz e imagen sintética, desinformación a escala industrial y filtración de datos por lo que las personas escriben en los chats.",
      impacto: "Ver ya no es creer. Verificar la fuente pasa de ser una buena práctica a una competencia básica de supervivencia.",
      acento: "purple",
    },
    {
      year: "2024", era: "México", categoria: "Normatividad",
      titulo: "Decreto que extingue el INAI",
      pioneros: "Congreso de la Unión, México",
      resumen: "El 20 de diciembre de 2024 se publica la reforma constitucional que extingue varios organismos autónomos, entre ellos el Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales.",
      impacto: "La autoridad que durante años recibió las quejas por mal uso de datos personales deja de existir como organismo autónomo.",
      acento: "rose",
    },
    {
      year: "2025", era: "México", categoria: "Normatividad",
      titulo: "Nueva LFPDPPP y nueva autoridad",
      pioneros: "Congreso de la Unión / Secretaría Anticorrupción y Buen Gobierno",
      resumen: "Publicada el 20 de marzo de 2025 y vigente desde el 21 de marzo. Conserva los derechos ARCO y el aviso de privacidad, y traslada la vigilancia sobre datos en manos de particulares a la Secretaría Anticorrupción y Buen Gobierno.",
      impacto: "Es la ley que te aplica hoy. Cualquier material de estudio anterior a marzo de 2025 está desactualizado en este punto.",
      acento: "emerald",
    },
    {
      year: "2024", era: "México", categoria: "Seguridad",
      titulo: "El fraude cibernético supera al fraude tradicional",
      pioneros: "CONDUSEF",
      resumen: "En el primer semestre de 2024 se registran 3.5 millones de reclamaciones por posible fraude por 9,231 millones de pesos. El 59 % —2.07 millones de casos— corresponde a fraude cibernético.",
      impacto: "El delito financiero se mudó definitivamente a la pantalla. La defensa ya no es una reja: es una contraseña distinta por sitio y un segundo factor.",
      acento: "teal",
    },
  ],

  ejes: [
    { nombre: "Normatividad y ARCO", acento: "emerald" },
    { nombre: "Seguridad digital", acento: "rose" },
    { nombre: "Privacidad de datos", acento: "violet" },
    { nombre: "Ética e IA", acento: "purple" },
  ],
  preguntas: [
    {
      pregunta: "¿Qué significan las siglas ARCO en protección de datos personales?",
      opciones: [
        "Archivo, Registro, Consulta y Orden",
        "Acceso, Rectificación, Cancelación y Oposición",
        "Autorización, Reserva, Confidencialidad y Obligación",
        "Auditoría, Respaldo, Cifrado y Operación",
      ],
      correcta: 1, categoria: "Normatividad y ARCO",
      explicacion: "Son los cuatro derechos que puedes ejercer sobre tus datos ante cualquier empresa que los tenga. Su base está en el artículo 16 constitucional.",
    },
    {
      pregunta: "¿Desde cuándo está en vigor la nueva Ley Federal de Protección de Datos Personales en Posesión de los Particulares?",
      opciones: ["Desde julio de 2010", "Desde mayo de 2018", "Desde el 21 de marzo de 2025", "Todavía no ha entrado en vigor"],
      correcta: 2, categoria: "Normatividad y ARCO",
      explicacion: "Se publicó en el DOF el 20 de marzo de 2025 y entró en vigor al día siguiente, sustituyendo a la ley de 2010.",
    },
    {
      pregunta: "Tras la extinción del INAI, ¿qué autoridad vigila la protección de datos personales en posesión de particulares en México?",
      opciones: [
        "La Secretaría Anticorrupción y Buen Gobierno",
        "La Comisión Federal de Competencia Económica",
        "La Guardia Nacional",
        "Ninguna, el tema quedó sin autoridad",
      ],
      correcta: 0, categoria: "Normatividad y ARCO",
      explicacion: "El decreto de diciembre de 2024 extinguió al INAI y la ley de 2025 trasladó estas funciones a la Secretaría Anticorrupción y Buen Gobierno.",
    },
    {
      pregunta: "¿Cuál de estos se considera un dato personal sensible?",
      opciones: ["Tu nombre completo", "Tu estado de salud o tus datos biométricos", "Tu correo electrónico", "Tu código postal"],
      correcta: 1, categoria: "Privacidad de datos",
      explicacion: "Los datos sensibles son aquellos cuya filtración puede provocar discriminación o riesgo grave. Exigen consentimiento expreso y por escrito.",
    },
    {
      pregunta: "¿Qué es el phishing?",
      opciones: [
        "Un virus que borra archivos del disco duro",
        "Un engaño que suplanta a una institución de confianza para que tú mismo entregues tus datos",
        "Una técnica para acelerar la conexión a internet",
        "Un método legal de recolección de datos",
      ],
      correcta: 1, categoria: "Seguridad digital",
      explicacion: "No es un ataque técnico sino de ingeniería social: no rompen tu seguridad, te convencen de abrirles la puerta. Por SMS se llama smishing; por llamada, vishing.",
    },
    {
      pregunta: "Según CONDUSEF, ¿qué proporción de las reclamaciones por posible fraude en México durante el primer semestre de 2024 fueron fraudes cibernéticos?",
      opciones: ["12 %", "31 %", "59 %", "88 %"],
      correcta: 2, categoria: "Seguridad digital",
      explicacion: "El 59 %: 2.07 millones de casos de un total de 3.5 millones de reclamaciones, por más de 9 mil millones de pesos.",
    },
    {
      pregunta: "¿Cuál es el mayor riesgo de reutilizar la misma contraseña en varios servicios?",
      opciones: [
        "Que la olvides con más facilidad",
        "Que al filtrarse la base de datos de un solo servicio, los atacantes prueben esa combinación en todas tus demás cuentas",
        "Que el navegador funcione más lento",
        "No hay riesgo si la contraseña es larga",
      ],
      correcta: 1, categoria: "Seguridad digital",
      explicacion: "Se llama credential stuffing. Por eso una sola filtración en un sitio sin importancia puede terminar en el acceso a tu banco.",
    },
    {
      pregunta: "¿Por qué se recomienda una aplicación de autenticación sobre los códigos enviados por SMS?",
      opciones: [
        "Porque los SMS cuestan dinero",
        "Porque el SMS puede interceptarse mediante clonación o secuestro de la tarjeta SIM",
        "Porque las aplicaciones son más bonitas",
        "Porque el SMS no funciona sin internet",
      ],
      correcta: 1, categoria: "Seguridad digital",
      explicacion: "El robo de línea telefónica es un ataque documentado. La aplicación genera el código en tu propio dispositivo, sin pasar por la red celular.",
    },
    {
      pregunta: "En el uso de inteligencia artificial generativa, ¿qué es una 'alucinación'?",
      opciones: [
        "Un error visual en las imágenes generadas",
        "Que el modelo produzca información falsa presentada con total seguridad, como datos, fechas o citas inventadas",
        "Un fallo del servidor que interrumpe la respuesta",
        "El tiempo que tarda en generar el texto",
      ],
      correcta: 1, categoria: "Ética e IA",
      explicacion: "El modelo genera texto plausible, no verificado. Por eso toda cifra, cita o referencia que te entregue debe comprobarse en la fuente original.",
    },
    {
      pregunta: "¿Cuál es la práctica éticamente correcta al usar IA en un trabajo escolar?",
      opciones: [
        "Nunca usarla bajo ninguna circunstancia",
        "Usarla libremente sin mencionarlo, ya que es una herramienta más",
        "Declarar qué herramienta usaste y para qué, y verificar de forma independiente todo lo que produjo",
        "Copiar el resultado tal cual, corrigiendo solo la ortografía",
      ],
      correcta: 2, categoria: "Ética e IA",
      explicacion: "La transparencia y la verificación son lo que separan el uso responsable de la deshonestidad académica. Ocultarlo es lo que constituye la falta.",
    },
  ],

  tarea: {
    titulo: "Auditoría de seguridad digital personal",
    descripcion:
      "Vas a revisar tus propias cuentas como lo haría un especialista en seguridad, cerrar los agujeros que encuentres y documentar el antes y el después. Esta tarea no se simula: se hace de verdad.",
    requisitos: [
      "Revisar tus 5 cuentas más importantes y anotar si repites contraseña en alguna de ellas.",
      "Activar la verificación en dos pasos en al menos tu cuenta de correo principal. Adjuntar captura sin datos personales visibles.",
      "Revisar los permisos de 5 aplicaciones de tu teléfono y revocar los que no tengan justificación (ubicación, micrófono, contactos).",
      "Localizar el aviso de privacidad de una plataforma que uses y resumir en 5 líneas qué datos recoge y con quién los comparte.",
      "Redactar una solicitud de derecho ARCO de Acceso dirigida a esa plataforma, con el formato correcto.",
      "Analizar un intento real de phishing que hayas recibido y señalar las 3 señales que lo delatan.",
    ],
    rubrica: [
      { criterio: "Ejecución real y documentada de las medidas de seguridad", peso: 35 },
      { criterio: "Comprensión y correcta redacción de la solicitud de derechos ARCO", peso: 25 },
      { criterio: "Análisis del aviso de privacidad y del caso de phishing", peso: 25 },
      { criterio: "Presentación, ortografía y respeto a la privacidad en las evidencias", peso: 15 },
    ],
    simuladorTitulo: "Bitácora de tu auditoría",
    simuladorAyuda: "Registra cada cuenta o aplicación revisada y qué medida aplicaste.",
    phClave: "Cuenta o aplicación",
    phTexto: "Riesgo detectado y medida aplicada",
    ejemplos: [
      { clave: "Correo principal", texto: "Contraseña repetida en 3 sitios — cambiada y activada la verificación en dos pasos" },
      { clave: "App de linterna", texto: "Pedía acceso a contactos y ubicación — permisos revocados" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const modulo6: ContenidoModulo = {
  dia: 6,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "La Huella", "Tu Reto"],

  keynote: {
    gancho: "El mundo tiró 62 millones de toneladas de basura electrónica en un solo año. Se recicló formalmente el 22.3 %. El resto sigue en algún lado.",
    parrafo:
      "Y ese lado casi nunca es el país que compró el aparato. Aquí viene lo segundo: tu 'nube' no flota. Los centros de datos consumieron 415 teravatios-hora de electricidad en 2024, alrededor del 1.5 % de toda la electricidad del planeta, y la Agencia Internacional de Energía proyecta que para 2030 lleguen a 945: más o menos lo que consume Japón entero en un año. Cada foto duplicada que no borras vive en un edificio con aire acondicionado industrial. Hoy vamos a ver quién eres en internet y cuánto pesa serlo.",
    datos: [
      { cifra: "62 millones", etiqueta: "de toneladas de basura electrónica se generaron en el mundo en 2022, 82 % más que en 2010", fuente: "Global E-waste Monitor 2024 (ONU/UIT/UNITAR)" },
      { cifra: "22.3 %", etiqueta: "es todo lo que se recicló de forma documentada y adecuada", fuente: "Global E-waste Monitor 2024" },
      { cifra: "415 TWh", etiqueta: "consumieron los centros de datos en 2024: cerca del 1.5 % de la electricidad mundial", fuente: "Agencia Internacional de Energía, 2025" },
      { cifra: "945 TWh", etiqueta: "es la proyección para 2030: aproximadamente el consumo eléctrico anual de Japón", fuente: "Agencia Internacional de Energía, 2025" },
    ],
    chiste:
      "La llamaron 'la nube' y todos imaginamos algo blanco y ligero flotando en el cielo. En realidad es una bodega del tamaño de varias canchas de futbol, llena de servidores que hierven, con aire acondicionado industrial las 24 horas y que consume más luz que tu colonia completa. Le dijeron nube porque 'bodega gigante que hierve en Virginia' no se veía bien en el anuncio.",
    ctaTitulo: "Una acción concreta antes de irte",
    ctaTexto:
      "Abre tu almacenamiento en la nube y borra los archivos duplicados y los videos que nunca volviste a ver. No va a salvar el planeta por sí solo, y no te voy a mentir diciendo que sí. Pero es la primera vez que vas a tomar una decisión digital sabiendo que tiene un costo físico. Esa conciencia es la que sí escala.",
    ctaBoton: "Vamos a medir la huella",
  },

  conceptosTitulo: "Quién eres en línea y cuánto pesa estarlo",
  conceptos: [
    {
      icono: "🪪",
      etiqueta: "Identidad",
      titulo: "Identidad digital",
      cuerpo:
        "Es el conjunto de rasgos, datos y comportamientos que te identifican en el entorno digital: tus perfiles, tus publicaciones, tus compras, tus búsquedas y tus interacciones. No es una máscara que eliges libremente: buena parte se construye con lo que otros publican de ti y con lo que las plataformas registran sin preguntarte.",
      dato: "Tienes una identidad digital aunque no tengas redes sociales. La construyen tus trámites, tu banco y tu escuela.",
      acento: "cyan",
    },
    {
      icono: "👣",
      etiqueta: "Rastro",
      titulo: "Huella digital activa y pasiva",
      cuerpo:
        "La activa es lo que publicas a propósito: fotos, comentarios, formularios. La pasiva es lo que dejas sin darte cuenta: tu dirección IP, tu ubicación, cuánto tiempo miraste una publicación, desde qué dispositivo entraste. La pasiva suele ser mucho más grande y mucho más reveladora que la activa.",
      dato: "No necesitas escribir nada para dejar huella. Basta con abrir la aplicación.",
      acento: "violet",
    },
    {
      icono: "🔎",
      etiqueta: "Consecuencia",
      titulo: "Reputación digital: lo que no se borra",
      cuerpo:
        "Empresas y universidades revisan perfiles públicos. Una publicación borrada puede sobrevivir en capturas de pantalla, en el caché de los buscadores y en archivos históricos de la web. Borrar el original no garantiza que desaparezca la copia.",
      dato: "La prueba fácil: busca tu propio nombre en un buscador, en modo incógnito. Lo que salga ahí es lo que ve quien te va a contratar.",
      acento: "rose",
    },
    {
      icono: "🔑",
      etiqueta: "Acceso",
      titulo: "Credenciales: la llave de toda tu vida digital",
      cuerpo:
        "Tu correo principal es la llave maestra: por ahí llegan los enlaces para restablecer todas tus demás contraseñas. Protegerlo con verificación en dos pasos y una contraseña única no es una recomendación entre otras, es la medida que sostiene a todas las demás.",
      dato: "Si alguien entra a tu correo, no perdiste una cuenta. Perdiste todas.",
      acento: "amber",
    },
    {
      icono: "☁️",
      etiqueta: "Impacto ambiental",
      titulo: "Contaminación digital",
      cuerpo:
        "Cada archivo almacenado, cada correo conservado y cada video reproducido consume electricidad en un centro de datos y en la red que lo transporta. No es una emisión visible, pero existe y se suma. El almacenamiento redundante —copias de copias que nadie volverá a abrir— es una de sus formas más absurdas.",
      dato: "Los centros de datos pasaron de 415 TWh en 2024 a una proyección de 945 TWh en 2030 según la AIE: crecen cuatro veces más rápido que el resto del consumo eléctrico.",
      acento: "teal",
    },
    {
      icono: "🗑️",
      etiqueta: "Impacto ambiental",
      titulo: "Basura electrónica (e-waste)",
      cuerpo:
        "Los aparatos desechados contienen metales valiosos —cobre, oro, hierro— y también sustancias tóxicas como mercurio y retardantes de flama bromados. Cuando no se reciclan formalmente, terminan quemados o desarmados a mano en condiciones peligrosas, con frecuencia en países que no los consumieron.",
      dato: "En 2022 se generaron 62 millones de toneladas, con metales por valor de 91 mil millones de dólares dentro. Solo se recuperó documentadamente el 22.3 %.",
      acento: "emerald",
    },
    {
      icono: "📱",
      etiqueta: "Causa raíz",
      titulo: "Obsolescencia programada y percibida",
      cuerpo:
        "La programada es cuando el producto se diseña para durar poco o para que repararlo cueste casi lo mismo que reemplazarlo. La percibida es cuando el aparato funciona bien, pero la publicidad y las actualizaciones te convencen de que ya está viejo. Ambas alimentan directamente los 62 millones de toneladas.",
      dato: "El movimiento por el derecho a reparar exige que fabricantes vendan refacciones y publiquen manuales. Es exactamente la misma discusión de la libertad 1 del software.",
      acento: "purple",
    },
    {
      icono: "🤝",
      etiqueta: "Síntesis",
      titulo: "Ciudadanía digital",
      cuerpo:
        "Es ejercer derechos y responsabilidades en el entorno digital con la misma seriedad que fuera de él: cuidar tus datos y los ajenos, no difundir información sin verificar, respetar la autoría, no participar en acoso y considerar el costo ambiental de lo que consumes.",
      dato: "No es una lista de prohibiciones. Es tratar el espacio digital como un lugar real donde hay otras personas reales.",
      acento: "blue",
    },
  ],

  hitosTitulo: "La huella que dejamos",
  hitosSubtitulo: "Del primer correo electrónico a los 62 millones de toneladas de aparatos desechados.",
  hitos: [
    {
      year: "1971", era: "Primeros rastros", categoria: "Identidad",
      titulo: "Se envía el primer correo electrónico entre computadoras",
      pioneros: "Ray Tomlinson",
      resumen: "Tomlinson envía el primer mensaje entre dos máquinas distintas de ARPANET y elige el símbolo @ para separar el nombre del usuario del de la máquina.",
      impacto: "Ese formato nombre@dominio se convirtió en la primera identidad digital de la humanidad, y sigue siendo la llave maestra de todas las demás.",
      acento: "cyan",
    },
    {
      year: "1993", era: "Anonimato", categoria: "Identidad",
      titulo: "'En internet nadie sabe que eres un perro'",
      pioneros: "Peter Steiner, The New Yorker",
      resumen: "Una caricatura publicada el 5 de julio de 1993 muestra a un perro frente a una computadora diciendo esa frase. Se convirtió en el símbolo del anonimato en la red temprana.",
      impacto: "Treinta años después el chiste se invirtió: hoy la red sabe tu raza, tu edad, tu ubicación y a qué hora comes. El anonimato fue la excepción, no la regla.",
      acento: "amber",
    },
    {
      year: "2006", era: "La nube", categoria: "Ambiente",
      titulo: "La computación en la nube se vuelve un producto",
      pioneros: "Amazon Web Services",
      resumen: "Se comercializa el almacenamiento y el cómputo por renta: cualquiera puede usar servidores enormes sin comprarlos. El nombre 'nube' oculta que se trata de edificios físicos con consumo eléctrico masivo.",
      impacto: "Guardar cosas se volvió tan barato que dejamos de borrar. Ese cambio de hábito es el origen de buena parte de la contaminación digital.",
      acento: "teal",
    },
    {
      year: "2007", era: "Todo en el bolsillo", categoria: "Identidad",
      titulo: "El teléfono inteligente concentra la identidad digital",
      pioneros: "Industria de la telefonía móvil",
      resumen: "Correo, banco, fotos, ubicación, contactos y redes sociales quedan en un solo aparato que además reporta permanentemente dónde estás.",
      impacto: "También multiplica el problema ambiental: un aparato que se reemplaza cada dos o tres años, difícil de reparar y de reciclar.",
      acento: "violet",
    },
    {
      year: "2019", era: "Reparación", categoria: "Ambiente",
      titulo: "El derecho a reparar se vuelve agenda pública",
      pioneros: "Movimiento Right to Repair, Unión Europea",
      resumen: "Consumidores, talleres independientes y legisladores exigen que los fabricantes vendan refacciones, publiquen manuales y dejen de bloquear reparaciones por software.",
      impacto: "Traslada al hardware la misma pregunta que el software libre hizo en 1983: ¿puedes abrir y arreglar lo que compraste?",
      acento: "emerald",
    },
    {
      year: "2024", era: "Diagnóstico", categoria: "Ambiente",
      titulo: "Global E-waste Monitor: 62 millones de toneladas",
      pioneros: "ONU, Unión Internacional de Telecomunicaciones y UNITAR",
      resumen: "El informe documenta que en 2022 se generaron 62 millones de toneladas de residuos electrónicos, con solo 22.3 % recolectado y reciclado formalmente, y proyecta 82 millones para 2030.",
      impacto: "La generación de basura electrónica crece casi cinco veces más rápido que la capacidad formal de reciclarla.",
      acento: "rose",
    },
    {
      year: "2025", era: "Energía", categoria: "Ambiente",
      titulo: "La AIE mide el consumo eléctrico de los centros de datos",
      pioneros: "Agencia Internacional de Energía",
      resumen: "Estima 415 TWh consumidos en 2024, cerca del 1.5 % de la electricidad mundial, con proyección de 945 TWh para 2030, impulsada principalmente por la inteligencia artificial.",
      impacto: "Por primera vez el costo energético de lo digital entra en la discusión pública sobre transición energética.",
      acento: "blue",
    },
  ],

  ejes: [
    { nombre: "Identidad digital", acento: "cyan" },
    { nombre: "Credenciales y seguridad", acento: "amber" },
    { nombre: "Contaminación digital", acento: "teal" },
    { nombre: "Ciudadanía digital", acento: "blue" },
  ],
  preguntas: [
    {
      pregunta: "¿Cuál es la diferencia entre huella digital activa y pasiva?",
      opciones: [
        "La activa la dejas al usar el teclado y la pasiva al usar el ratón",
        "La activa es lo que publicas deliberadamente; la pasiva es lo que se registra de ti sin que lo notes",
        "La activa se borra sola y la pasiva no",
        "Son sinónimos",
      ],
      correcta: 1, categoria: "Identidad digital",
      explicacion: "La pasiva —IP, ubicación, tiempo de permanencia, dispositivo— suele ser mucho mayor y más reveladora que todo lo que publicas a propósito.",
    },
    {
      pregunta: "Según el Global E-waste Monitor 2024, ¿cuánta basura electrónica se generó en el mundo en 2022?",
      opciones: ["6 millones de toneladas", "24 millones de toneladas", "62 millones de toneladas", "150 millones de toneladas"],
      correcta: 2, categoria: "Contaminación digital",
      explicacion: "62 millones de toneladas, un 82 % más que en 2010, con una proyección de 82 millones para 2030.",
    },
    {
      pregunta: "¿Qué porcentaje de esa basura electrónica se recolectó y recicló de forma documentada?",
      opciones: ["22.3 %", "45 %", "68 %", "91 %"],
      correcta: 0, categoria: "Contaminación digital",
      explicacion: "Menos de una cuarta parte. El resto se quema, se entierra o se desarma a mano en condiciones peligrosas, con frecuencia fuera del país que lo consumió.",
    },
    {
      pregunta: "¿Por qué el correo electrónico principal se considera la cuenta más crítica que debes proteger?",
      opciones: [
        "Porque contiene mensajes importantes de la escuela",
        "Porque a través de él se restablecen las contraseñas de todas tus demás cuentas",
        "Porque ocupa mucho espacio de almacenamiento",
        "Porque es la única cuenta que la ley protege",
      ],
      correcta: 1, categoria: "Credenciales y seguridad",
      explicacion: "Es la llave maestra. Quien controla tu correo puede solicitar el restablecimiento de cualquier otra cuenta tuya y quedarse con ella.",
    },
    {
      pregunta: "¿Aproximadamente qué proporción de la electricidad mundial consumieron los centros de datos en 2024?",
      opciones: ["0.1 %", "1.5 %", "12 %", "30 %"],
      correcta: 1, categoria: "Contaminación digital",
      explicacion: "415 TWh, alrededor del 1.5 % del total mundial. La Agencia Internacional de Energía proyecta 945 TWh para 2030, cerca del 3 %.",
    },
    {
      pregunta: "¿Qué es la obsolescencia percibida?",
      opciones: [
        "Cuando un aparato deja de funcionar por una falla de fábrica",
        "Cuando el aparato sigue funcionando bien pero la publicidad y las novedades te convencen de que ya está viejo",
        "Cuando el fabricante deja de vender refacciones",
        "Cuando la batería pierde capacidad con el tiempo",
      ],
      correcta: 1, categoria: "Ciudadanía digital",
      explicacion: "No falla el aparato, falla la percepción. Es una de las causas del reemplazo acelerado que alimenta la basura electrónica.",
    },
    {
      pregunta: "¿Por qué borrar una publicación no garantiza que desaparezca?",
      opciones: [
        "Porque las redes sociales no permiten borrar nada",
        "Porque puede sobrevivir en capturas de pantalla, en el caché de los buscadores y en archivos históricos de la web",
        "Porque se necesita una orden judicial para borrar contenido",
        "Porque el borrado tarda exactamente 30 días en aplicarse",
      ],
      correcta: 1, categoria: "Identidad digital",
      explicacion: "Borras el original, no las copias. Por eso la mejor estrategia de reputación digital es pensar antes de publicar, no borrar después.",
    },
    {
      pregunta: "¿Qué exige el movimiento por el derecho a reparar?",
      opciones: [
        "Que los aparatos electrónicos sean gratuitos",
        "Que los fabricantes vendan refacciones, publiquen manuales y no bloqueen las reparaciones independientes",
        "Que se prohíba fabricar teléfonos nuevos",
        "Que todos los aparatos usen software libre",
      ],
      correcta: 1, categoria: "Ciudadanía digital",
      explicacion: "Es la misma pregunta que el software libre planteó en 1983, aplicada al hardware: ¿puedes abrir, entender y arreglar lo que compraste?",
    },
    {
      pregunta: "¿Qué caracteriza a una persona que ejerce ciudadanía digital responsable?",
      opciones: [
        "Tener el mayor número posible de seguidores",
        "Cuidar sus datos y los ajenos, verificar antes de difundir, respetar la autoría y considerar el impacto ambiental de su consumo digital",
        "No usar nunca redes sociales",
        "Usar exclusivamente software libre",
      ],
      correcta: 1, categoria: "Ciudadanía digital",
      explicacion: "Ciudadanía digital es ejercer derechos y responsabilidades en línea con la misma seriedad con que se ejercen fuera de línea.",
    },
    {
      pregunta: "¿Qué contienen los residuos electrónicos que los hace a la vez valiosos y peligrosos?",
      opciones: [
        "Únicamente plástico reciclable",
        "Metales valiosos como cobre, oro y hierro, junto con sustancias tóxicas como mercurio y retardantes de flama",
        "Solo vidrio y aluminio",
        "Materiales completamente inertes",
      ],
      correcta: 1, categoria: "Contaminación digital",
      explicacion: "Los metales en la basura electrónica de 2022 valían unos 91 mil millones de dólares. Recuperarlos mal libera mercurio y plásticos tóxicos al ambiente.",
    },
  ],

  tarea: {
    titulo: "Campaña escolar de reducción de huella digital y electrónica",
    descripcion:
      "Proyecto transversal: vas a medir tu propia huella digital, limpiarla y diseñar una campaña para que tu plantel haga lo mismo. Con datos, no con buenas intenciones.",
    requisitos: [
      "Buscar tu nombre en un buscador en modo incógnito y documentar qué información pública apareció.",
      "Auditar tu almacenamiento en la nube: cuántos GB ocupas, cuántos son duplicados o archivos que no abres desde hace un año.",
      "Ejecutar una limpieza real y reportar cuántos GB liberaste.",
      "Hacer un inventario de aparatos electrónicos en desuso en tu casa e investigar dónde se reciclan en tu municipio.",
      "Diseñar el material de una campaña escolar (cartel, infografía o video corto) citando al menos 3 datos con fuente.",
      "Incluir una propuesta concreta y realista de acción para el plantel, con responsables y plazos.",
    ],
    rubrica: [
      { criterio: "Rigor de la auditoría personal y de los datos reportados", peso: 30 },
      { criterio: "Calidad y viabilidad de la propuesta de campaña escolar", peso: 30 },
      { criterio: "Uso correcto de fuentes verificables sobre e-waste y consumo energético", peso: 25 },
      { criterio: "Diseño del material, ortografía y presentación", peso: 15 },
    ],
    simuladorTitulo: "Inventario de tu huella",
    simuladorAyuda: "Registra lo que encontraste al auditar tu almacenamiento y tus aparatos.",
    phClave: "Elemento auditado",
    phTexto: "Hallazgo y acción tomada",
    ejemplos: [
      { clave: "Galería en la nube", texto: "3.8 GB en fotos duplicadas — eliminadas" },
      { clave: "Laptop de 2013", texto: "En desuso — llevada a centro de acopio de residuos electrónicos" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const modulo7: ContenidoModulo = {
  dia: 7,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "Origen del Método", "Tu Reto"],

  keynote: {
    gancho: "La palabra 'algoritmo' viene del nombre de un matemático persa del siglo IX. No de Silicon Valley. Llevamos mil doscientos años haciendo esto.",
    parrafo:
      "Se llamaba Muhammad ibn Musa al-Juarismi y trabajaba en Bagdad. Al traducirse su nombre al latín quedó como 'Algoritmi', y así se quedó. Lo importante es esto: un algoritmo no es código, no es una computadora y no es inteligencia artificial. Es una secuencia finita y ordenada de pasos que resuelve un problema. Una receta de cocina es un algoritmo. Las instrucciones para llegar a tu casa son un algoritmo. Lo que vas a aprender hoy no sirve solo para programar: sirve para pensar.",
    datos: [
      { cifra: "Siglo IX", etiqueta: "vivió al-Juarismi en Bagdad. Su nombre latinizado dio origen a la palabra algoritmo", fuente: "Historia de las matemáticas" },
      { cifra: "1843", etiqueta: "Ada Lovelace publica el primer algoritmo diseñado para ser ejecutado por una máquina", fuente: "Notas a la memoria de Menabrea, Nota G" },
      { cifra: "ISO 5807", etiqueta: "la norma internacional de 1985 que estandariza la simbología de los diagramas de flujo", fuente: "Organización Internacional de Normalización" },
      { cifra: "5 pasos", etiqueta: "identificar, comprender, analizar alternativas, seleccionar y representar. Sin brincarse ninguno", fuente: "Metodología de resolución de problemas" },
    ],
    chiste:
      "Escribir un algoritmo es como darle instrucciones para hacer un sándwich a alguien que se toma absolutamente todo de forma literal. Si escribes 'pon el jamón sobre el pan', va a colocar el paquete cerrado de jamón encima de la bolsa cerrada de pan. Y técnicamente va a tener razón. Las computadoras no adivinan: obedecen exactamente lo que escribiste, no lo que quisiste escribir.",
    ctaTitulo: "La habilidad que te vas a llevar",
    ctaTexto:
      "Al final de esta sesión vas a poder tomar cualquier problema —de matemáticas, de tu trabajo, de tu casa— y partirlo en pasos tan pequeños que cualquiera pueda ejecutarlos. Esa capacidad se llama pensamiento algorítmico y es de las pocas cosas que sirven igual en programación, en logística, en medicina y en la vida diaria.",
    ctaBoton: "Enséñame el método",
  },

  conceptosTitulo: "El método, paso por paso",
  conceptos: [
    {
      icono: "🎯",
      etiqueta: "Paso 1",
      titulo: "Identificar el problema real, no el síntoma",
      cuerpo:
        "La mayoría de las soluciones fallan porque resolvieron el problema equivocado. 'La aplicación va lenta' es un síntoma; el problema puede ser la conexión, el dispositivo o una consulta mal escrita. Formula el problema como una pregunta específica y verificable, no como una queja.",
      dato: "Regla práctica: si no puedes escribir el problema en una sola oración concreta, todavía no lo entendiste.",
      acento: "rose",
    },
    {
      icono: "🔍",
      etiqueta: "Paso 2",
      titulo: "Comprender: entradas, salidas y restricciones",
      cuerpo:
        "Antes de resolver nada responde tres preguntas. ¿Qué datos tengo (entradas)? ¿Qué resultado exacto necesito (salida)? ¿Qué limitaciones existen (tiempo, recursos, reglas que no puedo romper)? Si alguna respuesta falta, aún no puedes empezar.",
      dato: "George Pólya lo formuló en 1945 en su libro 'How to Solve It': comprender, planear, ejecutar, revisar. Sigue siendo el mejor resumen del método.",
      acento: "cyan",
    },
    {
      icono: "🧩",
      etiqueta: "Herramienta",
      titulo: "Descomposición",
      cuerpo:
        "Partir un problema grande en subproblemas pequeños que sí sabes resolver. 'Organizar el festival escolar' es inabordable; 'reservar el espacio', 'armar el programa', 'conseguir el sonido' son tareas concretas. Resolver las partes y unirlas resuelve el todo.",
      dato: "Es la misma técnica que usa un programador con una aplicación de un millón de líneas: nunca la ve completa, la ve por pedazos.",
      acento: "violet",
    },
    {
      icono: "🪄",
      etiqueta: "Herramienta",
      titulo: "Abstracción y reconocimiento de patrones",
      cuerpo:
        "Abstraer es ignorar los detalles que no afectan la solución para quedarte con la estructura. Reconocer patrones es notar que este problema se parece a otro que ya resolviste. Juntas, estas dos habilidades te evitan empezar de cero cada vez.",
      dato: "Un mapa del metro no muestra las calles reales ni las distancias verdaderas. Es una abstracción, y por eso funciona mejor que un mapa exacto.",
      acento: "amber",
    },
    {
      icono: "⚖️",
      etiqueta: "Paso 3 y 4",
      titulo: "Analizar alternativas y elegir con criterios",
      cuerpo:
        "Casi nunca hay una sola solución. Genera al menos dos o tres y compáralas con criterios explícitos: tiempo que toma, recursos que consume, qué tan fácil es de entender y qué tan fácil de modificar después. Elegir sin criterios escritos no es decidir, es adivinar.",
      dato: "La solución más rápida de programar suele ser la más lenta de ejecutar. Casi siempre hay que negociar entre ambas.",
      acento: "emerald",
    },
    {
      icono: "📝",
      etiqueta: "Representación",
      titulo: "Pseudocódigo",
      cuerpo:
        "Es escribir el algoritmo en lenguaje natural estructurado, sin la sintaxis de ningún lenguaje de programación concreto. Sirve para pensar la lógica sin pelearte con los puntos y comas, y para que alguien que no programa pueda revisar tu razonamiento.",
      dato: "Un buen pseudocódigo se traduce a cualquier lenguaje. Un mal pseudocódigo no se traduce a ninguno.",
      acento: "blue",
    },
    {
      icono: "📐",
      etiqueta: "Representación",
      titulo: "Diagrama de flujo y su simbología",
      cuerpo:
        "Óvalo para inicio y fin; rectángulo para un proceso; romboide para entrada y salida de datos; rombo para una decisión con dos salidas (sí/no); flechas para el sentido del flujo. La simbología está estandarizada en la norma ISO 5807 desde 1985.",
      dato: "Un diagrama de flujo bien hecho lo entiende alguien que jamás ha programado. Ese es exactamente el punto.",
      acento: "teal",
    },
    {
      icono: "🧪",
      etiqueta: "Paso final",
      titulo: "Prueba de escritorio",
      cuerpo:
        "Antes de ejecutar nada, recorre tu algoritmo a mano con valores concretos y anota en una tabla cómo cambia cada variable en cada paso. Es aburrido y es donde aparecen la mayoría de los errores. Incluye siempre casos extremos: el cero, el vacío, el número negativo.",
      dato: "La prueba de escritorio no requiere computadora. Requiere papel, lápiz y honestidad.",
      acento: "purple",
    },
  ],

  hitosTitulo: "Mil doscientos años de resolver problemas por pasos",
  hitosSubtitulo: "De un matemático en Bagdad a la norma internacional de diagramas de flujo.",
  hitos: [
    {
      year: "s. IX", era: "Origen", categoria: "Algoritmos",
      titulo: "Al-Juarismi y el nacimiento de la palabra algoritmo",
      pioneros: "Muhammad ibn Musa al-Juarismi",
      resumen: "Matemático persa de la Casa de la Sabiduría de Bagdad. Sus tratados sobre el cálculo con numerales indios y sobre álgebra describen procedimientos paso a paso para resolver clases enteras de problemas.",
      impacto: "Su nombre latinizado como 'Algoritmi' dio origen a la palabra algoritmo. De su obra 'al-yabr' viene la palabra álgebra.",
      acento: "amber",
    },
    {
      year: "1843", era: "Primeros algoritmos", categoria: "Algoritmos",
      titulo: "Ada Lovelace publica el primer algoritmo para una máquina",
      pioneros: "Augusta Ada King, condesa de Lovelace",
      resumen: "En sus notas a la memoria de Menabrea sobre la Máquina Analítica incluye, en la célebre Nota G, un procedimiento detallado para calcular números de Bernoulli con la máquina.",
      impacto: "Fue también la primera en comprender que la máquina podría manipular símbolos y no solo números: música, texto, cualquier cosa representable.",
      acento: "violet",
    },
    {
      year: "1936", era: "Fundamentos", categoria: "Lógica",
      titulo: "Turing define qué es computable y qué no",
      pioneros: "Alan Turing",
      resumen: "Formaliza la noción de procedimiento efectivo mediante su máquina abstracta y demuestra el problema de la parada: no existe algoritmo general capaz de decidir si otro algoritmo terminará.",
      impacto: "Establece que hay límites duros a lo que cualquier computadora podrá resolver, sin importar cuánta potencia tenga.",
      acento: "purple",
    },
    {
      year: "1945", era: "Representación", categoria: "Diagramas",
      titulo: "Aparecen los primeros diagramas de flujo de programa",
      pioneros: "Herman Goldstine y John von Neumann",
      resumen: "Desarrollan una notación gráfica para planear el funcionamiento de un programa antes de escribirlo, mostrando el flujo de control con cajas y flechas.",
      impacto: "Separa por primera vez el diseño del algoritmo de su implementación. Piensas primero, escribes después.",
      acento: "cyan",
    },
    {
      year: "1945", era: "Método", categoria: "Algoritmos",
      titulo: "Pólya publica 'How to Solve It'",
      pioneros: "George Pólya",
      resumen: "Propone cuatro fases universales para resolver problemas: comprender el problema, concebir un plan, ejecutar el plan y examinar la solución obtenida.",
      impacto: "Es la base metodológica que hoy se enseña en matemáticas, en ingeniería y en esta clase. Ochenta años después nadie la ha superado.",
      acento: "emerald",
    },
    {
      year: "1968", era: "Buenas prácticas", categoria: "Lógica",
      titulo: "Dijkstra y la programación estructurada",
      pioneros: "Edsger W. Dijkstra",
      resumen: "Publica su célebre carta 'Go To Statement Considered Harmful', argumentando que los saltos arbitrarios vuelven un programa imposible de razonar y que todo debe construirse con estructuras de control claras.",
      impacto: "Cambió la forma de escribir software en el mundo entero. Es la razón por la que hoy se usan condicionales y ciclos en lugar de saltos.",
      acento: "rose",
    },
    {
      year: "1985", era: "Estandarización", categoria: "Diagramas",
      titulo: "La norma ISO 5807 estandariza los diagramas de flujo",
      pioneros: "Organización Internacional de Normalización",
      resumen: "Fija oficialmente qué símbolo representa cada acción: óvalo para inicio y fin, rectángulo para proceso, rombo para decisión, romboide para entrada y salida.",
      impacto: "Gracias a esa norma, un diagrama hecho en México lo entiende sin traducción alguien en Japón. Es un lenguaje visual universal.",
      acento: "teal",
    },
    {
      year: "Hoy", era: "Aplicación", categoria: "Algoritmos",
      titulo: "El pensamiento algorítmico como competencia básica",
      pioneros: "Sistemas educativos de todo el mundo",
      resumen: "Descomponer, abstraer, reconocer patrones y diseñar secuencias de pasos se enseña ya no como formación para programadores, sino como una forma general de razonar.",
      impacto: "Sirve igual para depurar un programa, organizar un evento escolar, diagnosticar una falla mecánica o planear un tratamiento médico.",
      acento: "blue",
    },
  ],

  ejes: [
    { nombre: "Definición de algoritmo", acento: "amber" },
    { nombre: "Método de resolución", acento: "emerald" },
    { nombre: "Diagramas de flujo", acento: "teal" },
    { nombre: "Historia y lógica", acento: "violet" },
  ],
  preguntas: [
    {
      pregunta: "¿Qué es exactamente un algoritmo?",
      opciones: [
        "Un programa escrito en un lenguaje de computadora",
        "Una secuencia finita y ordenada de pasos que resuelve un problema o realiza una tarea",
        "Un sistema de inteligencia artificial",
        "Una fórmula matemática avanzada",
      ],
      correcta: 1, categoria: "Definición de algoritmo",
      explicacion: "No requiere computadora. Una receta de cocina y un instructivo para armar un mueble son algoritmos perfectamente válidos.",
    },
    {
      pregunta: "¿De dónde proviene la palabra 'algoritmo'?",
      opciones: [
        "Del griego 'arithmos', número",
        "Del nombre latinizado del matemático persa al-Juarismi, del siglo IX",
        "Del inglés 'algorithm', acuñado en 1950",
        "Del nombre de la empresa que creó la primera computadora",
      ],
      correcta: 1, categoria: "Historia y lógica",
      explicacion: "Su nombre se latinizó como Algoritmi. De otra de sus obras, 'al-yabr', proviene la palabra álgebra.",
    },
    {
      pregunta: "¿Cuáles son las tres preguntas que debes responder para comprender un problema antes de resolverlo?",
      opciones: [
        "Quién, cuándo y dónde",
        "Qué datos tengo, qué resultado necesito y qué restricciones existen",
        "Cuánto cuesta, cuánto tarda y quién lo paga",
        "Qué lenguaje usar, qué computadora y qué sistema operativo",
      ],
      correcta: 1, categoria: "Método de resolución",
      explicacion: "Entradas, salida esperada y restricciones. Si te falta alguna de las tres, todavía no puedes empezar a diseñar la solución.",
    },
    {
      pregunta: "¿En qué consiste la descomposición de un problema?",
      opciones: [
        "En descartar el problema por ser demasiado difícil",
        "En dividir un problema grande en subproblemas más pequeños que sí sabes resolver",
        "En borrar los datos innecesarios",
        "En traducir el problema a lenguaje máquina",
      ],
      correcta: 1, categoria: "Método de resolución",
      explicacion: "Es la técnica central del pensamiento algorítmico. Nadie resuelve un problema enorme de golpe: lo parte hasta que las piezas sean manejables.",
    },
    {
      pregunta: "En un diagrama de flujo, ¿qué símbolo representa una decisión?",
      opciones: ["El óvalo", "El rectángulo", "El rombo", "El romboide"],
      correcta: 2, categoria: "Diagramas de flujo",
      explicacion: "El rombo, con dos salidas: sí y no. El óvalo marca inicio y fin, el rectángulo un proceso y el romboide entrada o salida de datos.",
    },
    {
      pregunta: "¿Qué norma internacional estandariza la simbología de los diagramas de flujo?",
      opciones: ["ISO 9001", "ISO 5807", "IEEE 802.11", "RFC 2616"],
      correcta: 1, categoria: "Diagramas de flujo",
      explicacion: "La norma ISO 5807, de 1985. Gracias a ella un diagrama es legible en cualquier país sin necesidad de traducción.",
    },
    {
      pregunta: "¿Qué es el pseudocódigo?",
      opciones: [
        "Un lenguaje de programación para principiantes",
        "La descripción del algoritmo en lenguaje natural estructurado, sin la sintaxis de ningún lenguaje concreto",
        "Un código con errores deliberados",
        "El código fuente comprimido",
      ],
      correcta: 1, categoria: "Método de resolución",
      explicacion: "Sirve para razonar la lógica sin pelearse con la sintaxis, y para que alguien que no programa pueda revisar tu planteamiento.",
    },
    {
      pregunta: "¿Para qué sirve una prueba de escritorio?",
      opciones: [
        "Para medir la velocidad de la computadora",
        "Para recorrer el algoritmo a mano con valores concretos y verificar que produce el resultado correcto",
        "Para imprimir el código en papel",
        "Para calificar la presentación del trabajo",
      ],
      correcta: 1, categoria: "Método de resolución",
      explicacion: "Se hace con papel y lápiz, anotando cómo cambia cada variable paso a paso. Ahí aparece la mayoría de los errores, antes de ejecutar nada.",
    },
    {
      pregunta: "¿Quién publicó en 1843 el primer algoritmo pensado para ser ejecutado por una máquina?",
      opciones: ["Charles Babbage", "Ada Lovelace", "Alan Turing", "George Boole"],
      correcta: 1, categoria: "Historia y lógica",
      explicacion: "En la Nota G de sus anotaciones a la memoria de Menabrea, donde detalla el cálculo de los números de Bernoulli con la Máquina Analítica.",
    },
    {
      pregunta: "¿Qué es la abstracción en el pensamiento algorítmico?",
      opciones: [
        "Hacer el problema más complicado de lo que es",
        "Ignorar los detalles que no afectan la solución para quedarse con la estructura esencial",
        "Escribir el algoritmo en un lenguaje difícil",
        "Eliminar las variables del programa",
      ],
      correcta: 1, categoria: "Definición de algoritmo",
      explicacion: "Un mapa del metro no muestra calles ni distancias reales: abstrae todo lo que no sirve para llegar de una estación a otra. Por eso funciona.",
    },
  ],

  tarea: {
    titulo: "Del problema real al diagrama de flujo",
    descripcion:
      "Vas a tomar un problema auténtico de tu vida escolar o cotidiana y llevarlo por el método completo: identificarlo, comprenderlo, generar alternativas, elegir una y representarla en pseudocódigo y en diagrama de flujo.",
    requisitos: [
      "Elegir un problema real y concreto (no hipotético) y enunciarlo en una sola oración verificable.",
      "Documentar entradas, salida esperada y restricciones.",
      "Descomponer el problema en al menos 4 subproblemas.",
      "Proponer 2 alternativas de solución y compararlas con criterios explícitos (tiempo, recursos, claridad).",
      "Escribir el pseudocódigo de la alternativa elegida.",
      "Dibujar el diagrama de flujo con simbología ISO 5807, incluyendo al menos una decisión y un ciclo.",
      "Realizar una prueba de escritorio con 3 juegos de datos, uno de ellos un caso extremo.",
    ],
    rubrica: [
      { criterio: "Aplicación correcta y completa de las 5 etapas del método", peso: 35 },
      { criterio: "Simbología ISO 5807 correcta y flujo lógico sin ambigüedades", peso: 30 },
      { criterio: "Calidad del pseudocódigo y de la prueba de escritorio", peso: 25 },
      { criterio: "Presentación, claridad y ortografía", peso: 10 },
    ],
    simuladorTitulo: "Descomposición de tu problema",
    simuladorAyuda: "Anota cada paso o subproblema en el orden en que debe resolverse.",
    phClave: "Paso número",
    phTexto: "Acción concreta de ese paso",
    ejemplos: [
      { clave: "Paso 1", texto: "Leer la calificación obtenida por el alumno" },
      { clave: "Paso 2", texto: "Decidir: ¿la calificación es mayor o igual a 6?" },
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────

export const modulo8: ContenidoModulo = {
  dia: 8,
  pasos: ["Diagnóstico", "Resultados", "La Clase", "De Boole a Python", "Tu Reto"],

  keynote: {
    gancho: "En 1854 un profesor inglés escribió un libro de lógica sin imaginar que existirían las computadoras. Ochenta y tres años después, un estudiante de maestría usó ese libro para inventar el circuito digital.",
    parrafo:
      "El profesor era George Boole y el estudiante era Claude Shannon, en el MIT, en 1937. Shannon se dio cuenta de que los interruptores eléctricos encendido/apagado se comportaban exactamente igual que el verdadero/falso del álgebra de Boole. Esa conexión —entre una idea abstracta de lógica y un cable con corriente— es literalmente el motivo de que exista la pantalla en la que estás leyendo esto. Hoy vas a aprender ese mismo lenguaje: variables, operadores y tres estructuras de control. Con eso se construye absolutamente todo el software del mundo.",
    datos: [
      { cifra: "1854", etiqueta: "Boole publica 'An Investigation of the Laws of Thought' y funda el álgebra booleana", fuente: "George Boole, 1854" },
      { cifra: "1937", etiqueta: "Shannon demuestra en su tesis de maestría que los circuitos eléctricos pueden implementar esa lógica", fuente: "Claude Shannon, MIT" },
      { cifra: "3", etiqueta: "estructuras de control bastan para escribir cualquier programa: secuencia, selección e iteración", fuente: "Teorema de Böhm-Jacopini, 1966" },
      { cifra: "3", etiqueta: "operadores lógicos fundamentales: Y (AND), O (OR) y NO (NOT). Con eso se arma todo lo demás", fuente: "Álgebra de Boole" },
    ],
    chiste:
      "El primer 'bug' de la historia fue literalmente un bicho: una polilla atorada en el relevador 70 de la computadora Mark II de Harvard, en 1947. Grace Hopper la despegó, la pegó con cinta adhesiva en la bitácora del laboratorio y anotó al lado: 'primer caso real de un bicho encontrado'. Desde entonces, cada vez que tu programa falla, le echas la culpa a una polilla que lleva casi ochenta años muerta.",
    ctaTitulo: "Lo que vas a poder hacer al salir",
    ctaTexto:
      "Vas a poder leer un fragmento de código de cualquier lenguaje —Python, JavaScript, C, lo que sea— y entender qué está haciendo, aunque nunca lo hayas estudiado. Porque todos usan las mismas tres estructuras y los mismos tres operadores. Aprende la lógica una vez y la sintaxis se vuelve un detalle.",
    ctaBoton: "Vamos a la lógica",
  },

  conceptosTitulo: "El vocabulario completo de la programación",
  conceptos: [
    {
      icono: "📦",
      etiqueta: "Fundamento",
      titulo: "Dato e información no son lo mismo",
      cuerpo:
        "El dato es un hecho aislado sin contexto: 38. La información es ese dato procesado y con significado: 38 grados centígrados de temperatura corporal, es decir, fiebre. Los programas reciben datos y su trabajo es convertirlos en información útil para alguien.",
      dato: "Un dato no sirve de nada por sí solo. Es el contexto el que lo convierte en información.",
      acento: "cyan",
    },
    {
      icono: "🏷️",
      etiqueta: "Almacenamiento",
      titulo: "Variables y constantes",
      cuerpo:
        "Una variable es un espacio de memoria con nombre cuyo valor puede cambiar durante la ejecución: contador, edad, promedio. Una constante es un valor que se define una vez y no cambia jamás: PI, IVA, VELOCIDAD_LUZ. Por convención las constantes se escriben en mayúsculas.",
      dato: "El nombre de la variable debe decir qué guarda. 'x' no le dice nada a nadie; 'promedioFinal' sí.",
      acento: "violet",
    },
    {
      icono: "🔢",
      etiqueta: "Clasificación",
      titulo: "Tipos de dato",
      cuerpo:
        "Entero (números sin decimales: 25), real o flotante (con decimales: 8.75), carácter (un solo símbolo: 'A'), cadena (texto: 'Cultura Digital') y booleano (solo dos valores posibles: verdadero o falso). El tipo determina qué operaciones puedes hacer con ese dato.",
      dato: "El texto '5' y el número 5 no son lo mismo. Sumar '5' + '5' puede darte '55' en lugar de 10.",
      acento: "amber",
    },
    {
      icono: "➗",
      etiqueta: "Operadores",
      titulo: "Aritméticos",
      cuerpo:
        "Suma (+), resta (−), multiplicación (*), división (/), módulo o residuo (%) y potencia (^ o **). El módulo es el más subestimado: devuelve el residuo de la división, y sirve para saber si un número es par (n % 2 = 0) o para recorrer listas en ciclo.",
      dato: "17 % 5 = 2, porque 17 entre 5 da 3 y sobran 2. Ese pequeño operador resuelve una cantidad enorme de problemas.",
      acento: "emerald",
    },
    {
      icono: "⚖️",
      etiqueta: "Operadores",
      titulo: "Relacionales",
      cuerpo:
        "Comparan dos valores y siempre devuelven verdadero o falso: igual que (==), distinto de (!=), mayor que (>), menor que (<), mayor o igual (>=), menor o igual (<=). Son los que alimentan cualquier decisión dentro de un programa.",
      dato: "Cuidado con confundir = (asignar un valor) con == (comparar dos valores). Es el error más común de quien empieza.",
      acento: "teal",
    },
    {
      icono: "🔗",
      etiqueta: "Operadores",
      titulo: "Lógicos y tablas de verdad",
      cuerpo:
        "Y (AND): verdadero solo si ambas condiciones lo son. O (OR): verdadero si al menos una lo es. NO (NOT): invierte el valor. Con estos tres se construye cualquier condición compleja, por complicada que parezca.",
      dato: "'Puedes entrar si tienes credencial Y estás inscrito' exige las dos cosas. Con O bastaría una. Cambiar una palabra cambia todo el sistema.",
      acento: "purple",
    },
    {
      icono: "➡️",
      etiqueta: "Estructura 1",
      titulo: "Secuencial",
      cuerpo:
        "Las instrucciones se ejecutan una tras otra, en el orden en que están escritas, sin saltos ni repeticiones. Es la estructura por omisión y la base de todas las demás.",
      dato: "El orden importa: no puedes calcular un promedio antes de haber leído las calificaciones.",
      acento: "blue",
    },
    {
      icono: "🔀",
      etiqueta: "Estructura 2",
      titulo: "Selectiva o condicional",
      cuerpo:
        "El programa evalúa una condición y elige un camino. Simple: si (condición) entonces… Doble: si (condición) entonces… si no… Múltiple: según el valor de una variable, ejecuta uno de varios casos (switch). Es donde el programa 'decide'.",
      dato: "En el diagrama de flujo siempre se dibuja como un rombo con dos flechas de salida: sí y no.",
      acento: "rose",
    },
    {
      icono: "🔁",
      etiqueta: "Estructura 3",
      titulo: "Repetitiva o iterativa",
      cuerpo:
        "Repite un bloque de instrucciones. Mientras (while): evalúa la condición antes, puede no ejecutarse nunca. Repetir-hasta (do-while): evalúa después, se ejecuta al menos una vez. Para (for): se usa cuando conoces de antemano el número de repeticiones.",
      dato: "Si la condición nunca se vuelve falsa, tienes un ciclo infinito y el programa se congela. Siempre verifica que algo dentro del ciclo modifique la condición.",
      acento: "amber",
    },
    {
      icono: "🧱",
      etiqueta: "Teorema",
      titulo: "Con tres estructuras basta para todo",
      cuerpo:
        "En 1966 Corrado Böhm y Giuseppe Jacopini demostraron matemáticamente que cualquier programa, por complejo que sea, puede escribirse usando solo secuencia, selección e iteración. No hace falta nada más.",
      dato: "Todo el software que existe —sistemas operativos, videojuegos, inteligencia artificial— está hecho con esas tres piezas y nada más.",
      acento: "cyan",
    },
  ],

  hitosTitulo: "De un libro de lógica a los lenguajes modernos",
  hitosSubtitulo: "Ciento setenta años entre el álgebra de Boole y el código que se escribe hoy.",
  hitos: [
    {
      year: "1854", era: "Fundamento", categoria: "Lógica",
      titulo: "Boole publica las Leyes del Pensamiento",
      pioneros: "George Boole",
      resumen: "Formula un álgebra donde las variables solo pueden valer verdadero o falso y se combinan con tres operaciones: Y, O y NO. Su intención era estudiar el razonamiento humano, no construir máquinas.",
      impacto: "Creó, sin saberlo, el lenguaje matemático exacto que ochenta años después haría posible la electrónica digital.",
      acento: "violet",
    },
    {
      year: "1937", era: "El puente", categoria: "Lógica",
      titulo: "Shannon conecta la lógica con los circuitos eléctricos",
      pioneros: "Claude Shannon, MIT",
      resumen: "En su tesis de maestría demuestra que un circuito de interruptores en serie equivale a un AND y uno en paralelo a un OR, y que por tanto cualquier expresión booleana puede construirse con cables y relevadores.",
      impacto: "Se ha llamado la tesis de maestría más influyente de la historia. Es el acta de nacimiento del circuito digital.",
      acento: "cyan",
    },
    {
      year: "1947", era: "Anécdota fundacional", categoria: "Programación",
      titulo: "El primer bug fue un bicho de verdad",
      pioneros: "Grace Hopper y el equipo de la Mark II, Universidad de Harvard",
      resumen: "Una polilla atorada en el relevador número 70 provoca una falla. El equipo la extrae, la pega con cinta en la bitácora y anota que es el primer caso real de un bicho encontrado.",
      impacto: "La palabra bug ya se usaba antes en ingeniería, pero este incidente la fijó para siempre en el vocabulario de la computación.",
      acento: "amber",
    },
    {
      year: "1952", era: "Programación", categoria: "Programación",
      titulo: "Grace Hopper crea el primer compilador",
      pioneros: "Grace Murray Hopper",
      resumen: "Desarrolla el compilador A-0, capaz de traducir instrucciones escritas de forma comprensible a lenguaje máquina. Le dijeron que las computadoras solo podían hacer aritmética; lo hizo de todos modos.",
      impacto: "Hizo posible programar con palabras en lugar de con números binarios. Después impulsó COBOL, uno de los lenguajes más longevos que existen.",
      acento: "rose",
    },
    {
      year: "1966", era: "Teoría", categoria: "Programación",
      titulo: "Teorema de Böhm-Jacopini",
      pioneros: "Corrado Böhm y Giuseppe Jacopini",
      resumen: "Demuestran que toda función computable puede expresarse combinando únicamente tres estructuras de control: secuencia, selección e iteración.",
      impacto: "Es el fundamento matemático de la programación estructurada y la razón por la que estas tres estructuras se enseñan en todo el mundo.",
      acento: "emerald",
    },
    {
      year: "1968", era: "Buenas prácticas", categoria: "Programación",
      titulo: "Dijkstra declara dañino el salto incondicional",
      pioneros: "Edsger W. Dijkstra",
      resumen: "Su carta 'Go To Statement Considered Harmful' sostiene que los saltos arbitrarios vuelven un programa imposible de razonar y defiende el uso exclusivo de estructuras de control bien definidas.",
      impacto: "Cambió la forma de escribir software en toda la industria. Es la razón por la que hoy programas con condicionales y ciclos, no con saltos.",
      acento: "purple",
    },
    {
      year: "1972", era: "Lenguajes", categoria: "Programación",
      titulo: "Nace el lenguaje C",
      pioneros: "Dennis Ritchie, Bell Labs",
      resumen: "Un lenguaje de alto nivel con acceso cercano al hardware, creado para reescribir el sistema operativo UNIX y hacerlo portable entre máquinas distintas.",
      impacto: "Su sintaxis de llaves, condicionales y ciclos se heredó a C++, Java, JavaScript, C# y PHP. Si aprendes esa forma, entiendes media industria.",
      acento: "blue",
    },
    {
      year: "1991", era: "Lenguajes", categoria: "Programación",
      titulo: "Guido van Rossum publica Python",
      pioneros: "Guido van Rossum",
      resumen: "Un lenguaje diseñado para que el código sea legible por humanos, con sintaxis limpia y sin llaves, usando la indentación como estructura.",
      impacto: "Es hoy el lenguaje más usado para enseñar programación, y también el de la ciencia de datos y la inteligencia artificial.",
      acento: "teal",
    },
  ],

  ejes: [
    { nombre: "Datos y variables", acento: "cyan" },
    { nombre: "Operadores", acento: "emerald" },
    { nombre: "Estructuras de control", acento: "amber" },
    { nombre: "Lógica booleana", acento: "violet" },
  ],
  preguntas: [
    {
      pregunta: "¿Cuál es la diferencia entre dato e información?",
      opciones: [
        "Son sinónimos",
        "El dato es un hecho aislado sin contexto; la información es ese dato procesado y con significado",
        "El dato es numérico y la información siempre es texto",
        "La información se guarda en el disco y el dato en la RAM",
      ],
      correcta: 1, categoria: "Datos y variables",
      explicacion: "38 es un dato. '38 °C de temperatura corporal, es decir, fiebre' es información. El contexto es lo que hace la diferencia.",
    },
    {
      pregunta: "¿Qué es una variable en programación?",
      opciones: [
        "Un valor que nunca cambia",
        "Un espacio de memoria identificado con un nombre, cuyo valor puede cambiar durante la ejecución",
        "Un error del programa",
        "Un tipo de operador matemático",
      ],
      correcta: 1, categoria: "Datos y variables",
      explicacion: "Su contraparte es la constante, cuyo valor se define una vez y no cambia. Por convención las constantes se escriben en mayúsculas.",
    },
    {
      pregunta: "¿Qué tipo de dato solo puede tomar los valores verdadero o falso?",
      opciones: ["Entero", "Cadena", "Booleano", "Flotante"],
      correcta: 2, categoria: "Datos y variables",
      explicacion: "Se llama booleano en honor a George Boole, quien formuló ese álgebra en 1854 sin imaginar que existirían las computadoras.",
    },
    {
      pregunta: "¿Qué devuelve el operador módulo (%)?",
      opciones: [
        "El resultado exacto de la división",
        "El residuo de la división entera",
        "El porcentaje de un número",
        "La raíz cuadrada",
      ],
      correcta: 1, categoria: "Operadores",
      explicacion: "17 % 5 = 2. Es la forma estándar de saber si un número es par (n % 2 == 0) y de recorrer listas de manera cíclica.",
    },
    {
      pregunta: "¿Cuál es la diferencia entre los operadores = y == ?",
      opciones: [
        "No hay diferencia, son intercambiables",
        "El signo = asigna un valor a una variable; el == compara dos valores y devuelve verdadero o falso",
        "El == solo funciona con números",
        "El = se usa en matemáticas y el == en física",
      ],
      correcta: 1, categoria: "Operadores",
      explicacion: "Confundirlos es el error más frecuente al empezar a programar, y produce fallas difíciles de detectar porque el programa sí se ejecuta.",
    },
    {
      pregunta: "Si A es verdadero y B es falso, ¿cuál es el resultado de A Y B (AND)?",
      opciones: ["Verdadero", "Falso", "Depende del lenguaje", "No se puede evaluar"],
      correcta: 1, categoria: "Lógica booleana",
      explicacion: "El AND solo devuelve verdadero cuando ambas condiciones lo son. Con OR el resultado habría sido verdadero, porque basta con una.",
    },
    {
      pregunta: "¿Cuáles son las tres estructuras de control que bastan para escribir cualquier programa?",
      opciones: [
        "Entrada, proceso y salida",
        "Secuencial, selectiva y repetitiva",
        "Variable, constante y operador",
        "Compilar, ejecutar y depurar",
      ],
      correcta: 1, categoria: "Estructuras de control",
      explicacion: "Lo demostraron Böhm y Jacopini en 1966. Todo el software del mundo está construido únicamente con esas tres piezas.",
    },
    {
      pregunta: "¿Cuál es la diferencia entre un ciclo 'mientras' (while) y un 'repetir-hasta' (do-while)?",
      opciones: [
        "El while es más rápido",
        "El while evalúa la condición antes de entrar, por lo que puede no ejecutarse nunca; el do-while la evalúa al final, por lo que se ejecuta al menos una vez",
        "El do-while solo funciona con números",
        "No hay diferencia real entre ambos",
      ],
      correcta: 1, categoria: "Estructuras de control",
      explicacion: "Es una diferencia decisiva: si necesitas garantizar que el bloque corra por lo menos una vez, tiene que ser do-while.",
    },
    {
      pregunta: "¿Qué provoca un ciclo infinito?",
      opciones: [
        "Que la computadora se quede sin memoria RAM",
        "Que la condición del ciclo nunca se vuelva falsa, porque nada dentro del ciclo la modifica",
        "Usar demasiadas variables",
        "Escribir mal el nombre del programa",
      ],
      correcta: 1, categoria: "Estructuras de control",
      explicacion: "Si la variable que controla la condición nunca cambia dentro del ciclo, este se repite para siempre y el programa se congela.",
    },
    {
      pregunta: "¿Qué demostró Claude Shannon en su tesis de maestría de 1937?",
      opciones: [
        "Que las computadoras podían jugar ajedrez",
        "Que los circuitos eléctricos de interruptores pueden implementar el álgebra booleana de Boole",
        "Que la información se puede comprimir",
        "Que existen problemas que ninguna computadora puede resolver",
      ],
      correcta: 1, categoria: "Lógica booleana",
      explicacion: "Interruptores en serie equivalen a un AND y en paralelo a un OR. Esa equivalencia es el acta de nacimiento de toda la electrónica digital.",
    },
  ],

  tarea: {
    titulo: "Laboratorio de lógica: del enunciado al programa",
    descripcion:
      "Vas a resolver problemas reales usando variables, operadores y las tres estructuras de control, y a demostrar con tablas de verdad y pruebas de escritorio que tu lógica es correcta.",
    requisitos: [
      "Resolver 3 problemas en pseudocódigo: uno secuencial, uno con condicional múltiple y uno con ciclo.",
      "Declarar explícitamente todas las variables y constantes con su tipo de dato.",
      "Construir la tabla de verdad completa de una condición compuesta con al menos dos operadores lógicos.",
      "Elaborar el diagrama de flujo de uno de los tres problemas, con simbología ISO 5807.",
      "Hacer la prueba de escritorio de los tres, incluyendo un caso extremo (cero, valor vacío o negativo).",
      "Explicar en 5 líneas por qué elegiste while o do-while en el problema con ciclo.",
    ],
    rubrica: [
      { criterio: "Corrección lógica de los tres algoritmos y de las estructuras elegidas", peso: 35 },
      { criterio: "Tabla de verdad correcta y uso preciso de los operadores", peso: 25 },
      { criterio: "Prueba de escritorio completa, con casos extremos incluidos", peso: 25 },
      { criterio: "Declaración de variables, presentación y ortografía", peso: 15 },
    ],
    simuladorTitulo: "Tabla de variables",
    simuladorAyuda: "Declara aquí cada variable de tu algoritmo con su tipo y para qué sirve.",
    phClave: "Nombre de la variable",
    phTexto: "Tipo de dato y qué almacena",
    ejemplos: [
      { clave: "promedioFinal", texto: "Real — guarda el promedio calculado de las calificaciones" },
      { clave: "esAprobado", texto: "Booleano — verdadero si el promedio es mayor o igual a 6" },
    ],
  },
};

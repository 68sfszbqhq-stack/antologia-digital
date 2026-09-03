// Test de Orientación Vocacional CHASIDE.
//
// 98 preguntas de sí o no que se suman en siete áreas: Administrativas y
// Contables (C), Humanísticas y Sociales (H), Artísticas (A), Medicina y
// Ciencias de la Salud (S), Ingeniería y Computación (I), Defensa y Seguridad
// (D), y Ciencias Exactas y Agropecuarias (E).
//
// Cada área se puntúa en dos bloques —Intereses y Aptitudes— y el puntaje final
// del área es la suma de los dos. Las dos áreas más altas son el perfil
// dominante.
//
// DOS RAREZAS DE LA CLAVE ORIGINAL, que NO son errores de este archivo:
//
//   · El ítem 5 cuenta DOS veces: en Intereses-D y en Aptitudes-A. Así viene en
//     la clave del instrumento y así se respeta.
//   · El ítem 50 no cuenta en ninguna área. Se pregunta, pero la clave no lo
//     asigna a ninguna columna.
//
// Se conservan tal cual porque cambiarlas volvería los resultados
// incomparables con los de cualquier otra aplicación del mismo test, que es
// justo lo que un instrumento estandarizado sirve para evitar. Si algún día
// hay que corregirlas, que sea una decisión explícita y anotada, no un arreglo
// silencioso.

export const AREAS = [
  { id: 'C', nombre: 'Administrativas y Contables',
    rasgos: 'Organizativo, supervisión, orden, análisis y síntesis, colaboración, cálculo, persuasivo, objetivo, práctico, tolerante, responsable, ambicioso.' },
  { id: 'H', nombre: 'Humanísticas y Sociales',
    rasgos: 'Precisión verbal, organización, relación de hechos, lingüística, orden, sentido de justicia, responsable, conciliador, persuasivo, sagaz, imaginativo.' },
  { id: 'A', nombre: 'Artísticas',
    rasgos: 'Estético, armónico, manual, visual, auditivo, sensible, imaginativo, creativo, detallista, innovador, intuitivo.' },
  { id: 'S', nombre: 'Medicina y Ciencias de la Salud',
    rasgos: 'Vocación de asistir, investigativo, precisión, senso-perceptivo, analítico, altruista, solidario, paciente, comprensivo, respetuoso, persuasivo.' },
  { id: 'I', nombre: 'Ingeniería y Computación',
    rasgos: 'Cálculo, científico, manual, exacto, planificador, preciso, práctico, crítico, analítico, riguroso.' },
  { id: 'D', nombre: 'Defensa y Seguridad',
    rasgos: 'Sentido de justicia, equidad, colaboración, espíritu de equipo, liderazgo, arriesgado, solidario, valiente, persuasivo.' },
  { id: 'E', nombre: 'Ciencias Exactas y Agropecuarias',
    rasgos: 'Investigación, orden, organización, análisis y síntesis, numérico, clasificador, metódico, analítico, observador, paciente.' },
];

/** La clave de calificación, copiada de la hoja del instrumento. */
export const CLAVE = {
  intereses: {
    C: [98, 12, 64, 53, 85],
    H: [9, 34, 80, 25, 95],
    A: [21, 45, 96, 57, 28],
    S: [33, 92, 70, 8, 87],
    I: [75, 6, 19, 38, 60],
    D: [84, 31, 48, 73, 5],
    E: [77, 42, 88, 17, 93],
  },
  aptitudes: {
    C: [1, 78, 15, 20, 51, 71, 2, 91, 46],
    H: [67, 41, 63, 74, 30, 56, 72, 89, 86],
    A: [11, 5, 22, 3, 39, 81, 76, 36, 82],
    S: [62, 23, 69, 44, 40, 16, 29, 52, 4],
    I: [27, 83, 26, 54, 59, 47, 90, 97, 10],
    D: [65, 14, 13, 37, 66, 58, 18, 24, 43],
    E: [32, 68, 94, 49, 7, 35, 79, 61, 55],
  },
};

export const TOTAL = 98;

/** El texto de cada pregunta, por número. */
export const PREGUNTAS = {
  1: "¿Aceptarías trabajar escribiendo artículos en la sección económica de un diario?",
  2: "¿Te ofrecerías para organizar la despedida de soltero(a) de un(a) amigo(a)?",
  3: "¿Te gustaría dirigir un proyecto de urbanización en tu ciudad/provincia?",
  4: "¿A una frustración siempre opones un pensamiento positivo?",
  5: "¿Te dedicarías a socorrer a personas accidentadas o en peligro?",
  6: "¿Cuando eras chico(a), te interesaba saber cómo estaban construidos tus juguetes?",
  7: "¿Te interesan más los misterios de la naturaleza que los secretos de la tecnología?",
  8: "¿Escuchas atentamente los problemas que te plantean tus amigos?",
  9: "¿Te ofrecerías para explicar a tus compañeros un tema que ellos no entendieron?",
  10: "¿Eres exigente y crítico(a) con tu equipo de trabajo?",
  11: "¿Te atrae armar rompecabezas o puzzles?",
  12: "¿Puedes establecer la diferencia conceptual entre macroeconomía y microeconomía?",
  13: "¿Usar uniforme te hace sentir distinto(a), importante?",
  14: "¿Participarías como profesional en un espectáculo de acrobacia aérea?",
  15: "¿Organizas tu dinero de manera que te alcance hasta el próximo cobro?",
  16: "¿Convences fácilmente a otras personas sobre la validez de tus argumentos?",
  17: "¿Estás informado(a) sobre nuevos descubrimientos científicos (ej. Teoría del Big Bang)?",
  18: "¿Ante una situación de emergencia actúas rápidamente?",
  19: "¿Cuando tienes que resolver un problema matemático, perseveras hasta encontrar la solución?",
  20: "¿Si tu club preferido te convocara para planificar, organizar y dirigir un campo de deportes, aceptarías?",
  21: "¿Eres quien pone un toque de alegría en las fiestas?",
  22: "¿Crees que los detalles son tan importantes como el todo?",
  23: "¿Te sentirías a gusto trabajando en un ámbito hospitalario?",
  24: "¿Te gustaría participar manteniendo el orden ante grandes desastres o emergencias?",
  25: "¿Pasarías varias horas leyendo un libro de tu interés?",
  26: "¿Planificas detalladamente tus trabajos antes de empezar?",
  27: "¿Entablas una relación casi personal con tu computadora?",
  28: "¿Disfrutas modelando con arcilla?",
  29: "¿Ayudas habitualmente a personas con discapacidad a cruzar la calle o similar?",
  30: "¿Consideras importante que desde la primaria se fomente la actitud crítica y la participación activa?",
  31: "¿Aceptarías que las mujeres formen parte de las fuerzas armadas bajo las mismas normas que los hombres?",
  32: "¿Te gustaría crear nuevas técnicas para descubrir patologías a través del microscopio?",
  33: "¿Participarías en una campaña de prevención de enfermedades?",
  34: "¿Te interesan los temas relacionados con el pasado y la evolución del ser humano?",
  35: "¿Te incluirías en un proyecto de investigación de movimientos sísmicos y sus consecuencias?",
  36: "¿Fuera del horario escolar, dedicas algún día de la semana a actividades corporales?",
  37: "¿Te interesan las actividades de acción y reacción rápida en situaciones imprevistas o de peligro?",
  38: "¿Te ofrecerías como voluntario(a) en un proyecto de investigación espacial?",
  39: "¿Te gusta más el trabajo manual que el trabajo intelectual?",
  40: "¿Estarías dispuesto(a) a renunciar a un momento placentero para ofrecer tu servicio profesional?",
  41: "¿Participarías de una investigación sobre violencia en eventos deportivos?",
  42: "¿Te gustaría trabajar en un laboratorio mientras estudias?",
  43: "¿Arriesgarías tu vida para salvar la vida de alguien que no conoces?",
  44: "¿Te agradaría hacer un curso de primeros auxilios?",
  45: "¿Toleras empezar tantas veces como sea necesario hasta obtener el logro deseado?",
  46: "¿Distribuyes tus horarios del día adecuadamente para hacer todo lo planeado?",
  47: "¿Harías un curso para aprender a fabricar instrumentos o piezas de máquinas?",
  48: "¿Elegirías una profesión que implique estar meses alejado(a) de tu familia (ej. marino)?",
  49: "¿Te radicarías en una zona agrícola-ganadera para desarrollar tus actividades como profesional?",
  50: "¿Cuando trabajas en grupo, te entusiasma producir ideas originales y que sean tomadas en cuenta?",
  51: "¿Te resulta fácil coordinar un grupo de trabajo?",
  52: "¿Te resultó interesante el estudio de las ciencias biológicas?",
  53: "¿Si una gran empresa solicita un gerente de comercialización, te sentirías a gusto en ese rol?",
  54: "¿Te incluirías en un proyecto nacional de desarrollo de un recurso importante de tu región?",
  55: "¿Tienes interés por saber las causas de ciertos fenómenos, aunque saberlo no altere tu vida?",
  56: "¿Descubriste algún filósofo o escritor que haya expresado ideas parecidas a las tuyas?",
  57: "¿Desearías que te regalen un instrumento musical de cumpleaños?",
  58: "¿Aceptarías colaborar con el cumplimiento de normas en lugares públicos?",
  59: "¿Crees que tus ideas son importantes y haces todo lo posible por ponerlas en práctica?",
  60: "¿Cuando se descompone un aparato en casa, te dispones prontamente a repararlo?",
  61: "¿Formarías parte de un equipo orientado a la preservación de flora y fauna en peligro?",
  62: "¿Acostumbras leer revistas sobre avances científicos y tecnológicos en salud?",
  63: "¿Te parece importante preservar las raíces culturales de tu país?",
  64: "¿Te gustaría investigar algo que contribuya a una distribución más justa de la riqueza?",
  65: "¿Te gustaría realizar tareas auxiliares en una embarcación (velas, pintura, motores, etc.)?",
  66: "¿Crees que un país debe poseer la más alta tecnología armamentista, a cualquier precio?",
  67: "¿La libertad y la justicia son valores fundamentales en tu vida?",
  68: "¿Aceptarías una práctica en una industria de alimentos, en control de calidad?",
  69: "¿Consideras que la salud pública debe ser prioritaria, gratuita y eficiente para todos?",
  70: "¿Te interesaría investigar sobre alguna nueva vacuna?",
  71: "¿En un equipo de trabajo, prefieres el rol de coordinador(a)?",
  72: "¿En una discusión entre amigos, te ofreces como mediador(a)?",
  73: "¿Estás de acuerdo con la formación de un cuerpo de soldados profesionales?",
  74: "¿Lucharías por una causa justa hasta las últimas consecuencias?",
  75: "¿Te gustaría investigar científicamente sobre cultivos agrícolas?",
  76: "¿Harías un nuevo diseño de una prenda pasada de moda ante una reunión imprevista?",
  77: "¿Visitarías un observatorio astronómico para conocer el funcionamiento de sus aparatos?",
  78: "¿Dirigirías el área de importación y exportación de una empresa?",
  79: "¿Te inhibes al entrar a un lugar nuevo con gente desconocida?",
  80: "¿Te gratificaría trabajar con niños?",
  81: "¿Harías el diseño de un cartel para una campaña de salud pública?",
  82: "¿Dirigirías un grupo de teatro independiente?",
  83: "¿Enviarías tu currículum a una empresa automotriz que solicita gerente de producción?",
  84: "¿Participarías en un grupo de defensa dentro de alguna fuerza armada?",
  85: "¿Costearías tus estudios trabajando en un área de auditoría?",
  86: "¿Eres de los que defienden causas perdidas?",
  87: "¿Ante una emergencia epidémica, participarías en una campaña brindando ayuda?",
  88: "¿Sabrías responder qué significa ADN y ARN?",
  89: "¿Elegirías una carrera cuya herramienta de trabajo fuera un idioma extranjero?",
  90: "¿Trabajar con objetos te resulta más gratificante que trabajar con personas?",
  91: "¿Te resultaría gratificante ser asesor(a) contable en una empresa reconocida?",
  92: "¿Ante un llamado solidario, te ofrecerías para cuidar a un enfermo?",
  93: "¿Te atrae investigar sobre los misterios del universo (ej. agujeros negros)?",
  94: "¿El trabajo individual te resulta más rápido y efectivo que el trabajo grupal?",
  95: "¿Dedicarías parte de tu tiempo a ayudar a personas de zonas vulnerables?",
  96: "¿Cuando eliges tu ropa o decoras un ambiente, consideras la combinación de colores y estilos?",
  97: "¿Te gustaría dirigir profesionalmente la construcción de una empresa hidroeléctrica?",
  98: "¿Sabes qué es el PIB (Producto Interno Bruto)?"
};

/**
 * Califica. `respuestas` es {numero: true|false}; solo los "sí" suman.
 *
 * Se devuelve también el máximo de cada área porque NO son comparables entre
 * sí en crudo: cada área tiene 5 ítems de intereses y 9 de aptitudes, salvo A
 * y D, que comparten el ítem 5. Sin el porcentaje, un 9 en un área y un 9 en
 * otra parecerían lo mismo y no lo son.
 */
export function calificarChaside(respuestas) {
  const puntajes = {};
  for (const a of AREAS) {
    const si = (lista) => lista.filter((n) => respuestas[n] === true).length;
    const intereses = si(CLAVE.intereses[a.id]);
    const aptitudes = si(CLAVE.aptitudes[a.id]);
    const max = CLAVE.intereses[a.id].length + CLAVE.aptitudes[a.id].length;
    puntajes[a.id] = {
      nombre: a.nombre,
      intereses,
      aptitudes,
      total: intereses + aptitudes,
      max,
      porcentaje: Math.round(((intereses + aptitudes) / max) * 100),
    };
  }

  // Las dos más altas. En empate manda el orden de AREAS, para que el mismo
  // resultado dé siempre el mismo perfil.
  const orden = AREAS.map((a) => a.id).sort((x, y) => puntajes[y].total - puntajes[x].total);
  const dominantes = orden.slice(0, 2);

  return {
    puntajes,
    dominantes,
    // Un empate en el segundo lugar hace que "las dos dominantes" sea una
    // decisión arbitraria. Conviene que el tutor lo sepa antes de orientar.
    empateEnSegundo:
      puntajes[orden[1]].total === puntajes[orden[2]]?.total,
    contestadas: Object.keys(respuestas).length,
  };
}

export function areaPorId(id) {
  return AREAS.find((a) => a.id === id) ?? null;
}

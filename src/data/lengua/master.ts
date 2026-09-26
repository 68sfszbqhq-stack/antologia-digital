/**
 * Máster en Comunicación Consciente: la introducción a Lengua y Comunicación,
 * en dos sesiones de 50 minutos.
 *
 *   Sesión 1 · Los cuatro acuerdos (Miguel Ruiz), puestos a prueba por la ciencia.
 *   Sesión 2 · Influencia (Robert Cialdini): los siete atajos del «sí».
 *
 * Cómo está pensada (y en qué se basa):
 *   · Cada 5–7 minutos el alumno decide, vota o discute: aprender haciendo rinde
 *     más que escuchar (Chi y Wylie, 2014; Freeman et al., 2014).
 *   · Antes de cada estudio, el grupo PREDICE el resultado. El hueco entre lo que
 *     creen y lo que pasó es lo que despierta la curiosidad (Loewenstein, 1994).
 *   · Recordar fija más que releer: repaso al abrir la sesión 2 y quiz al cierre
 *     de cada una (Roediger y Karpicke, 2006).
 *   · Con Cialdini, en vez de explicar los trucos, el grupo los caza: practicar
 *     con ejemplos débiles protege contra la manipulación real (Roozenbeek y van
 *     der Linden, 2019).
 *
 * REGLAS DEL CONTENIDO
 *   · Toda cifra y todo experimento sale de una fuente de `FUENTES_MASTER`, y
 *     cada DOI se comprobó contra Crossref el 26 de septiembre de 2026.
 *   · De los libros solo se parafrasea; no se copian pasajes.
 *   · Los `id` de las preguntas en vivo y los números de quiz se guardan en
 *     Firestore (colecciones lyc_votos y lyc_quizzes). Cambiar el TEXTO de una
 *     pregunta está bien; cambiar su `id`, o el orden de las opciones de un quiz
 *     que ya se aplicó, revuelve lo guardado.
 */

export interface PreguntaVivo {
  /** Corto y sin espacios: se vuelve parte del nombre del documento. */
  id: string;
  texto: string;
  opciones: string[];
  /** Sin `correcta` es un sondeo de opinión: no hay respuesta buena. */
  correcta?: number;
  explicacion?: string;
}

export interface PreguntaQuiz {
  texto: string;
  opciones: string[];
  correcta: number;
  explicacion: string;
}

export interface Quiz {
  numero: 1 | 2;
  titulo: string;
  preguntas: PreguntaQuiz[];
}

export interface Estudio {
  quien: string;
  hicieron: string;
  encontraron: string;
  clave: string;
}

export type Diapositiva =
  | { tipo: "portada"; modulo: string; titulo: string; subtitulo: string }
  | { tipo: "frase"; frase: string; firma?: string; detalle?: string }
  | { tipo: "conectar" }
  | { tipo: "voto"; kicker: string; pregunta: PreguntaVivo; contexto?: string }
  | {
      tipo: "ciencia";
      kicker: string;
      titulo: string;
      ruiz?: string;
      estudio: Estudio;
      veredicto?: { etiqueta: string; texto: string };
      enTuVida: string;
      parejas?: string;
    }
  | { tipo: "tarjetas"; kicker: string; titulo: string; tarjetas: { titulo: string; texto: string }[]; pie?: string }
  | { tipo: "caza"; kicker: string; titulo: string; casos: { mensaje: string; respuesta: string }[] }
  | { tipo: "lectura"; ganchos: { libro: string; pregunta: string; donde: string }[] }
  | { tipo: "reto"; titulo: string; niveles: { nombre: string; texto: string }[] }
  | { tipo: "quiz"; quiz: 1 | 2 }
  | { tipo: "fuentes"; claves: string[] };

export interface SesionMaster {
  numero: 1 | 2;
  slug: string;
  modulo: string;
  titulo: string;
  resumen: string;
  diapositivas: Diapositiva[];
}

// ─── Fuentes ─────────────────────────────────────────────────────────────────

export const FUENTES_MASTER: Record<string, { cita: string; url?: string }> = {
  "Ruiz, 1997": { cita: "Ruiz, M. (1997). The four agreements: A practical guide to personal freedom. Amber-Allen Publishing. [En español: Los cuatro acuerdos.]" },
  "Cialdini, 1984": { cita: "Cialdini, R. B. (1984). Influence: The psychology of persuasion. William Morrow. [En español: Influencia: la psicología de la persuasión.]" },
  "Cialdini, 2021": { cita: "Cialdini, R. B. (2021). Influence, new and expanded: The psychology of persuasion. Harper Business." },
  "Kross et al., 2014": { cita: "Kross, E., Bruehlman-Senecal, E., Park, J., Burson, A., Dougherty, A., Shablack, H., … Ayduk, O. (2014). Self-talk as a regulatory mechanism: How you do it matters. Journal of Personality and Social Psychology, 106(2), 304–324.", url: "https://doi.org/10.1037/a0035173" },
  "Gilovich et al., 2000": { cita: "Gilovich, T., Medvec, V. H., y Savitsky, K. (2000). The spotlight effect in social judgment: An egocentric bias in estimates of the salience of one's own actions and appearance. Journal of Personality and Social Psychology, 78(2), 211–222.", url: "https://doi.org/10.1037/0022-3514.78.2.211" },
  "Gross, 2002": { cita: "Gross, J. J. (2002). Emotion regulation: Affective, cognitive, and social consequences. Psychophysiology, 39(3), 281–291.", url: "https://doi.org/10.1017/S0048577201393198" },
  "Ross et al., 1977": { cita: "Ross, L. D., Amabile, T. M., y Steinmetz, J. L. (1977). Social roles, social control, and biases in social-perception processes. Journal of Personality and Social Psychology, 35(7), 485–494.", url: "https://doi.org/10.1037/0022-3514.35.7.485" },
  "Breines y Chen, 2012": { cita: "Breines, J. G., y Chen, S. (2012). Self-compassion increases self-improvement motivation. Personality and Social Psychology Bulletin, 38(9), 1133–1143.", url: "https://doi.org/10.1177/0146167212445599" },
  "Regan, 1971": { cita: "Regan, D. T. (1971). Effects of a favor and liking on compliance. Journal of Experimental Social Psychology, 7(6), 627–639.", url: "https://doi.org/10.1016/0022-1031(71)90025-4" },
  "Freedman y Fraser, 1966": { cita: "Freedman, J. L., y Fraser, S. C. (1966). Compliance without pressure: The foot-in-the-door technique. Journal of Personality and Social Psychology, 4(2), 195–202.", url: "https://doi.org/10.1037/h0023552" },
  "Goldstein et al., 2008": { cita: "Goldstein, N. J., Cialdini, R. B., y Griskevicius, V. (2008). A room with a viewpoint: Using social norms to motivate environmental conservation in hotels. Journal of Consumer Research, 35(3), 472–482.", url: "https://doi.org/10.1086/586910" },
  "Burger et al., 2004": { cita: "Burger, J. M., Messian, N., Patel, S., del Prado, A., y Anderson, C. (2004). What a coincidence! The effects of incidental similarity on compliance. Personality and Social Psychology Bulletin, 30(1), 35–43.", url: "https://doi.org/10.1177/0146167203258838" },
  "Milgram, 1963": { cita: "Milgram, S. (1963). Behavioral study of obedience. The Journal of Abnormal and Social Psychology, 67(4), 371–378.", url: "https://doi.org/10.1037/h0040525" },
  "Worchel et al., 1975": { cita: "Worchel, S., Lee, J., y Adewole, A. (1975). Effects of supply and demand on ratings of object value. Journal of Personality and Social Psychology, 32(5), 906–914.", url: "https://doi.org/10.1037/0022-3514.32.5.906" },
  "Roozenbeek y van der Linden, 2019": { cita: "Roozenbeek, J., y van der Linden, S. (2019). Fake news game confers psychological resistance against online misinformation. Palgrave Communications, 5, 65.", url: "https://doi.org/10.1057/s41599-019-0279-9" },
  "Roozenbeek et al., 2022": { cita: "Roozenbeek, J., van der Linden, S., Goldberg, B., Rathje, S., y Lewandowsky, S. (2022). Psychological inoculation improves resilience against misinformation on social media. Science Advances, 8(34), eabo6254.", url: "https://doi.org/10.1126/sciadv.abo6254" },
  "Chi y Wylie, 2014": { cita: "Chi, M. T. H., y Wylie, R. (2014). The ICAP framework: Linking cognitive engagement to active learning outcomes. Educational Psychologist, 49(4), 219–243.", url: "https://doi.org/10.1080/00461520.2014.965823" },
  "Freeman et al., 2014": { cita: "Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., y Wenderoth, M. P. (2014). Active learning increases student performance in science, engineering, and mathematics. PNAS, 111(23), 8410–8415.", url: "https://doi.org/10.1073/pnas.1319030111" },
  "Loewenstein, 1994": { cita: "Loewenstein, G. (1994). The psychology of curiosity: A review and reinterpretation. Psychological Bulletin, 116(1), 75–98.", url: "https://doi.org/10.1037/0033-2909.116.1.75" },
  "Roediger y Karpicke, 2006": { cita: "Roediger, H. L., y Karpicke, J. D. (2006). Test-enhanced learning: Taking memory tests improves long-term retention. Psychological Science, 17(3), 249–255.", url: "https://doi.org/10.1111/j.1467-9280.2006.01693.x" },
  "Delgado et al., 2018": { cita: "Delgado, P., Vargas, C., Ackerman, R., y Salmerón, L. (2018). Don't throw away your printed books: A meta-analysis on the effects of reading media on reading comprehension. Educational Research Review, 25, 23–38.", url: "https://doi.org/10.1016/j.edurev.2018.09.003" },
};

// ─── Quizzes con calificación ────────────────────────────────────────────────

export const QUIZZES: Record<1 | 2, Quiz> = {
  1: {
    numero: 1,
    titulo: "Los cuatro acuerdos",
    preguntas: [
      {
        texto: "Tu mejor amigo pasa junto a ti en el pasillo y no te saluda. ¿Qué acuerdo te ayuda más en ese momento?",
        opciones: ["Sé impecable con tus palabras", "No te tomes nada personalmente", "Haz siempre lo máximo que puedas", "Ninguno: seguro está enojado contigo"],
        correcta: 1,
        explicacion: "Lo que hizo puede tener mil razones que no tienen que ver contigo: iba distraído, preocupado o no te vio.",
      },
      {
        texto: "El profe pide «un trabajo para el lunes» y no dice la extensión. ¿Qué haría alguien que practica el tercer acuerdo?",
        opciones: ["Hacer diez hojas por si acaso", "Copiar lo que haga la mayoría", "Preguntar la extensión antes de empezar", "Esperar a que alguien más pregunte"],
        correcta: 2,
        explicacion: "No hagas suposiciones: una pregunta a tiempo te ahorra trabajo repetido y malentendidos.",
      },
      {
        texto: "Según el estudio de Kross y su equipo, ¿qué ayudó a las personas a dar mejor un discurso y a sentirse menos ansiosas?",
        opciones: ["Repetirse «yo puedo, yo puedo»", "Hablarse a sí mismas por su nombre o de «tú»", "No pensar en el discurso", "Ensayar frente al espejo"],
        correcta: 1,
        explicacion: "Hablarte como le hablarías a otra persona («Ana, tú puedes») te da distancia y calma. Cómo te hablas sí importa.",
      },
      {
        texto: "En el experimento de la playera vergonzosa (Gilovich), ¿qué descubrieron?",
        opciones: ["Todos notaron la playera", "La gente cree que los demás se fijan en ella mucho más de lo que realmente lo hacen", "Nadie notó la playera", "Los que la usaron no sintieron vergüenza"],
        correcta: 1,
        explicacion: "Es el «efecto reflector»: creían que la mitad del salón lo notaría y en realidad lo notó cerca de una cuarta parte.",
      },
      {
        texto: "«No tomarte nada personal» NO significa…",
        opciones: ["Buscar otras explicaciones de lo que pasó", "Tragarte lo que sientes y hacer como que no pasa nada", "Separar la crítica a tu trabajo de tu valor como persona", "Responder en lugar de reaccionar"],
        correcta: 1,
        explicacion: "Reprimir la emoción no la quita y cansa más. Lo que sí funciona es reinterpretar la situación (Gross, 2002).",
      },
      {
        texto: "En el experimento de los papeles sorteados (Ross), los observadores creyeron que quien hacía las preguntas era más listo. ¿Por qué fue un error?",
        opciones: ["Porque las preguntas eran fáciles", "Porque los papeles se sortearon: quien pregunta elige lo que sabe", "Porque los que contestaban eran profesores", "No fue un error: sí era más listo"],
        correcta: 1,
        explicacion: "Supusimos que era por su inteligencia e ignoramos la situación. Así nacen muchas suposiciones injustas sobre los demás.",
      },
      {
        texto: "Reprobaste un examen. Según Breines y Chen, ¿qué actitud te ayuda más a estudiar para el siguiente?",
        opciones: ["Decirte que eres un fracaso para motivarte", "Decirte que eres muy inteligente y que no pasa nada", "Tratarte con comprensión: fallar le pasa a todos y se puede mejorar", "Olvidarte del tema"],
        correcta: 2,
        explicacion: "Quienes se trataron con autocompasión estudiaron más tiempo para volver a intentarlo. Hacer tu máximo no es exigirte perfección.",
      },
      {
        texto: "¿Qué es correcto sobre el libro Los cuatro acuerdos?",
        opciones: ["Es un estudio científico con experimentos", "Es una guía de reflexión; algunas de sus ideas coinciden con lo que ha encontrado la psicología", "Todo lo que dice está comprobado", "Nada de lo que dice tiene relación con la ciencia"],
        correcta: 1,
        explicacion: "Es un libro de sabiduría personal, no de investigación. Por eso lo pusimos a prueba: leer también es preguntar «¿esto está comprobado?».",
      },
    ],
  },
  2: {
    numero: 2,
    titulo: "Influencia",
    preguntas: [
      {
        texto: "«Hola, soy tu tío, cambié de número. Urge que me deposites, ahorita te explico.» ¿Qué atajos usa este fraude?",
        opciones: ["Autoridad y reciprocidad", "Unidad (soy de tu familia) y escasez (urge)", "Prueba social y simpatía", "Ninguno: es un mensaje normal"],
        correcta: 1,
        explicacion: "Se presenta como «de los tuyos» y te apura para que no te detengas a pensar ni a comprobar.",
      },
      {
        texto: "En el súper te regalan una muestra de queso y luego te sientes un poco obligado a comprar. ¿Qué principio es?",
        opciones: ["Reciprocidad", "Autoridad", "Escasez", "Unidad"],
        correcta: 0,
        explicacion: "Sentimos que debemos devolver lo que nos dan, aunque no lo hayamos pedido.",
      },
      {
        texto: "En el experimento de las galletas (Worchel), ¿cuáles parecieron más valiosas?",
        opciones: ["Las del frasco con diez galletas", "Las del frasco con solo dos galletas", "Las dos iguales", "Las que eran más grandes"],
        correcta: 1,
        explicacion: "Eran las mismas galletas. Solo porque había menos, parecían mejores: eso es la escasez.",
      },
      {
        texto: "Un compañero te pide «solo una pregunta» de la tarea, luego «solo esta parte»… y terminas haciéndole todo. ¿Qué principio usó?",
        opciones: ["Compromiso y coherencia", "Prueba social", "Autoridad", "Escasez"],
        correcta: 0,
        explicacion: "Después de decir «sí» a algo pequeño, nos cuesta decir «no» a lo grande. Es la técnica del «pie en la puerta».",
      },
      {
        texto: "En los hoteles, ¿qué mensaje logró que más huéspedes reutilizaran su toalla (Goldstein, Cialdini y Griskevicius)?",
        opciones: ["«Ayuda a salvar el planeta»", "«La mayoría de los huéspedes reutiliza su toalla»", "«Está prohibido pedir toallas nuevas»", "«Cambiar toallas cuesta caro»"],
        correcta: 1,
        explicacion: "Saber lo que hacen los demás movió más que el argumento ecológico. Eso es la prueba social.",
      },
      {
        texto: "Un anuncio muestra a alguien con bata blanca recomendando un suplemento. ¿Qué principio intenta activar?",
        opciones: ["Simpatía", "Autoridad", "Reciprocidad", "Unidad"],
        correcta: 1,
        explicacion: "La bata hace que parezca experto, aunque no sepamos si lo es. Pregunta: ¿quién es y qué gana si le hago caso?",
      },
      {
        texto: "Según Burger y su equipo, ¿qué hizo que más personas aceptaran hacer un favor a un desconocido?",
        opciones: ["Que el desconocido les pagara", "Descubrir que cumplían años el mismo día", "Que el desconocido fuera famoso", "Que se los pidiera con prisa"],
        correcta: 1,
        explicacion: "Una coincidencia tan pequeña como la fecha de cumpleaños nos hace sentir cercanos y decir que sí: simpatía.",
      },
      {
        texto: "¿Cuál es la mejor defensa ante un mensaje que te apura a decidir?",
        opciones: ["Contestar rápido para no perder la oportunidad", "Hacer una pausa y preguntarte quién gana si dices que sí", "Reenviarlo a tus contactos", "Confiar si tiene muchos likes"],
        correcta: 1,
        explicacion: "Los atajos funcionan en automático. Detenerte unos segundos es lo que te devuelve la decisión.",
      },
      {
        texto: "(Repaso de la sesión 1) Tu amiga te deja en visto. ¿Qué acuerdo te evita inventar una historia en tu cabeza?",
        opciones: ["No hagas suposiciones", "Haz siempre lo máximo que puedas", "Sé impecable con tus palabras", "Ninguno"],
        correcta: 0,
        explicacion: "Antes de concluir «está enojada conmigo», pregunta o espera. Hay muchas explicaciones posibles.",
      },
      {
        texto: "(Repaso de la sesión 1) ¿Qué encontraron Breines y Chen sobre fallar?",
        opciones: ["Castigarte te motiva más", "Tratarte con comprensión te lleva a esforzarte más para mejorar", "Lo mejor es no volver a intentarlo", "La autoestima alta evita reprobar"],
        correcta: 1,
        explicacion: "La autocompasión no es flojera: quienes se trataron así estudiaron más para el siguiente intento.",
      },
    ],
  },
};

// ─── Sesión 1 ────────────────────────────────────────────────────────────────

const sesion1: SesionMaster = {
  numero: 1,
  slug: "sesion-1",
  modulo: "Módulo 01",
  titulo: "El código interno",
  resumen: "Los cuatro acuerdos de Miguel Ruiz, puestos a prueba por la ciencia.",
  diapositivas: [
    { tipo: "portada", modulo: "Módulo 01", titulo: "El código interno", subtitulo: "Los cuatro acuerdos, puestos a prueba por la ciencia" },
    {
      tipo: "frase",
      frase: "Todos los días tienes la conversación más larga de tu vida. Es contigo.",
      detalle: "Hoy no te voy a pedir que me creas. Te voy a pedir que lo compruebes.",
    },
    { tipo: "conectar" },
    {
      tipo: "voto",
      kicker: "Para empezar · sin respuestas malas",
      pregunta: {
        id: "s1-visto",
        texto: "Le escribes a alguien importante para ti y te deja en visto. ¿Qué es lo primero que piensas?",
        opciones: ["«Está enojado conmigo»", "«Hice algo mal»", "«Seguro está ocupado»", "No pienso nada"],
      },
    },
    {
      tipo: "tarjetas",
      kicker: "Miguel Ruiz · Los cuatro acuerdos (1997)",
      titulo: "Las reglas que aceptaste sin firmarlas",
      tarjetas: [
        { titulo: "La idea", texto: "Desde niños aprendemos creencias sobre nosotros mismos («soy malo para…», «no me quieren si…»). Ruiz las llama acuerdos, y dice que se pueden cambiar." },
        { titulo: "Los cuatro nuevos", texto: "Sé impecable con tus palabras · No te tomes nada personalmente · No hagas suposiciones · Haz siempre lo máximo que puedas." },
        { titulo: "Lo que haremos hoy", texto: "Es un libro de reflexión, no de ciencia. Por eso vamos a ponerlo a prueba: por cada acuerdo, un experimento real. Tú predices primero." },
      ],
    },

    // Acuerdo 1
    {
      tipo: "voto",
      kicker: "Acuerdo 1 · Predice el resultado",
      contexto: "Un grupo de personas tenía que dar un discurso con muy poco tiempo para prepararse. Antes, unas se dieron ánimos en primera persona («yo puedo») y otras se hablaron por su nombre o de «tú» («Ana, tú puedes»).",
      pregunta: {
        id: "s1-kross",
        texto: "¿A quiénes les fue mejor?",
        opciones: ["A los que dijeron «yo puedo»", "A los que se hablaron por su nombre o de «tú»", "A todos igual"],
        correcta: 1,
        explicacion: "Hablarte como le hablarías a un amigo te da distancia: sintieron menos ansiedad y los jueces calificaron mejor su discurso.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Acuerdo 1 de 4",
      titulo: "Sé impecable con tus palabras",
      ruiz: "Tus palabras crean realidad. No las uses contra otros… ni contra ti.",
      estudio: {
        quien: "Ethan Kross y su equipo, Universidad de Michigan",
        hicieron: "Pidieron a personas prepararse para un discurso hablándose en primera persona o por su nombre.",
        encontraron: "Quienes se hablaron por su nombre sintieron menos ansiedad y dieron mejor el discurso.",
        clave: "Kross et al., 2014",
      },
      veredicto: { etiqueta: "La ciencia: sí", texto: "Cómo te hablas cambia cómo te sientes y cómo te va." },
      enTuVida: "Antes de exponer, cambia «soy malísimo para esto» por «[tu nombre], ya lo ensayaste, tú puedes».",
      parejas: "En parejas (1 min): ¿qué frase te dices a ti mismo que nunca le dirías a un amigo?",
    },

    // Acuerdo 2
    {
      tipo: "voto",
      kicker: "Acuerdo 2 · Predice el resultado",
      contexto: "Unos estudiantes entraron a un salón lleno usando una playera vergonzosa (con la cara de un cantante pasado de moda). Después les preguntaron cuántos compañeros creían que la habían notado.",
      pregunta: {
        id: "s1-gilovich",
        texto: "¿Qué pasó?",
        opciones: ["Creían que la notó la mitad; la notó cerca de una cuarta parte", "Creían que la notó una cuarta parte; la notó la mitad", "Lo que creían y lo que pasó fue igual"],
        correcta: 0,
        explicacion: "Es el «efecto reflector»: sentimos que todos nos miran, pero cada quien está pensando en sí mismo.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Acuerdo 2 de 4",
      titulo: "No te tomes nada personalmente",
      ruiz: "Lo que otros dicen y hacen habla más de ellos que de ti.",
      estudio: {
        quien: "Thomas Gilovich y su equipo, Universidad de Cornell",
        hicieron: "Midieron cuánta gente creían los estudiantes que notaría su playera, y cuánta la notó en realidad.",
        encontraron: "Sobreestimamos muchísimo cuánto se fijan los demás en nosotros.",
        clave: "Gilovich et al., 2000",
      },
      veredicto: {
        etiqueta: "La ciencia: sí, con un matiz",
        texto: "No tomarlo personal NO es tragarte lo que sientes: reprimir la emoción no la quita. Lo que funciona es reinterpretar lo que pasó (Gross, 2002).",
      },
      enTuVida: "Cuando alguien critique tu trabajo, pregúntate: «¿está hablando de mi trabajo o de mí?». Casi siempre es del trabajo, y eso se puede mejorar.",
    },

    // Acuerdo 3
    {
      tipo: "voto",
      kicker: "Acuerdo 3 · Predice el resultado",
      contexto: "En un experimento se sortearon dos papeles. A unos les tocó inventar preguntas difíciles sobre lo que ellos sabían; a otros, contestarlas. Un público miraba.",
      pregunta: {
        id: "s1-ross",
        texto: "Al final, ¿quién le pareció más inteligente al público?",
        opciones: ["El que hacía las preguntas", "El que contestaba", "Los dos igual"],
        correcta: 0,
        explicacion: "Los papeles fueron un sorteo, y quien pregunta elige lo que sabe. Aun así, el público supuso que era más listo.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Acuerdo 3 de 4",
      titulo: "No hagas suposiciones",
      ruiz: "Ten el valor de preguntar y de decir lo que realmente quieres.",
      estudio: {
        quien: "Lee Ross y su equipo, Universidad de Stanford",
        hicieron: "Sortearon quién preguntaba y quién contestaba, y le pidieron a observadores calificar su inteligencia.",
        encontraron: "Juzgamos a las personas por lo que hacen e ignoramos la situación en la que están.",
        clave: "Ross et al., 1977",
      },
      veredicto: { etiqueta: "La ciencia: sí", texto: "Suponemos sin darnos cuenta, y solemos suponer mal. Preguntar es la salida." },
      enTuVida: "Antes de concluir «el profe me trae de encargo» o «ella me odia», busca una explicación de la situación. Y si puedes, pregunta.",
      parejas: "En parejas (1 min): cuenta una vez que supusiste algo y resultó falso.",
    },

    // Acuerdo 4
    {
      tipo: "voto",
      kicker: "Acuerdo 4 · Predice el resultado",
      contexto: "Unas personas reprobaron una prueba difícil. A unas se les animó a tratarse con comprensión («a todos nos pasa»). A otras, a subir su autoestima («eres inteligente»).",
      pregunta: {
        id: "s1-breines",
        texto: "¿Quiénes estudiaron más tiempo para volver a presentar la prueba?",
        opciones: ["Las que se trataron con comprensión", "Las que subieron su autoestima", "Ninguno estudió más"],
        correcta: 0,
        explicacion: "La autocompasión no es flojera: quita el miedo a fallar y te deja volver a intentarlo.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Acuerdo 4 de 4",
      titulo: "Haz siempre lo máximo que puedas",
      ruiz: "Tu máximo cambia de un día a otro. Da el de hoy, sin culparte.",
      estudio: {
        quien: "Juliana Breines y Serena Chen, Universidad de California en Berkeley",
        hicieron: "Después de un fracaso, compararon tratarse con comprensión contra subirse la autoestima.",
        encontraron: "La autocompasión llevó a esforzarse más para mejorar.",
        clave: "Breines y Chen, 2012",
      },
      veredicto: { etiqueta: "La ciencia: sí", texto: "Exigirte perfección te paraliza. Tratarte bien te hace volver a intentarlo." },
      enTuVida: "Dormiste cuatro horas: tu máximo de hoy es entregar completo, no perfecto. Mañana tu máximo será otro.",
    },

    // Repaso a la mitad
    {
      tipo: "voto",
      kicker: "Repaso relámpago",
      pregunta: {
        id: "s1-repaso",
        texto: "Tu equipo critica tu parte de la exposición. ¿Qué acuerdo aplicas primero?",
        opciones: ["Sé impecable con tus palabras", "No te tomes nada personalmente", "No hagas suposiciones", "Haz siempre lo máximo que puedas"],
        correcta: 1,
        explicacion: "Critican el trabajo, no a ti. Luego, si no queda claro qué cambiar… acuerdo 3: pregunta.",
      },
    },
    {
      tipo: "lectura",
      ganchos: [
        { libro: "Los cuatro acuerdos", pregunta: "Ruiz compara el chisme con un virus de computadora. ¿Por qué?", donde: "Capítulo del primer acuerdo" },
        { libro: "Los cuatro acuerdos", pregunta: "¿Qué es la «domesticación» y quién nos domesticó?", donde: "Primer capítulo" },
        { libro: "Los cuatro acuerdos", pregunta: "Si tu máximo cambia cada día, ¿cuándo se vuelve excusa?", donde: "Capítulo del cuarto acuerdo" },
      ],
    },
    {
      tipo: "reto",
      titulo: "Tu reto de 7 días",
      niveles: [
        { nombre: "Nivel 1 · Todos", texto: "Elige UN acuerdo. Cada noche escribe un renglón: una vez que lo cumpliste o una vez que no. En papel." },
        { nombre: "Nivel 2 · Lector", texto: "Lee el capítulo de tu acuerdo y trae la respuesta a su pregunta gancho." },
        { nombre: "Nivel 3 · Creador", texto: "Diseña un cartel o un post para tu escuela que ayude a otros a practicar tu acuerdo. Sin textos largos." },
      ],
    },
    { tipo: "quiz", quiz: 1 },
    {
      tipo: "voto",
      kicker: "Antes de salir",
      pregunta: {
        id: "s1-compromiso",
        texto: "¿Qué acuerdo vas a practicar esta semana?",
        opciones: ["Sé impecable con tus palabras", "No te tomes nada personalmente", "No hagas suposiciones", "Haz siempre lo máximo que puedas"],
      },
    },
    { tipo: "fuentes", claves: ["Ruiz, 1997", "Kross et al., 2014", "Gilovich et al., 2000", "Gross, 2002", "Ross et al., 1977", "Breines y Chen, 2012"] },
  ],
};

// ─── Sesión 2 ────────────────────────────────────────────────────────────────

const sesion2: SesionMaster = {
  numero: 2,
  slug: "sesion-2",
  modulo: "Módulo 02",
  titulo: "Inteligencia persuasiva",
  resumen: "Influencia de Robert Cialdini: los siete atajos que te hacen decir «sí».",
  diapositivas: [
    { tipo: "portada", modulo: "Módulo 02", titulo: "Inteligencia persuasiva", subtitulo: "Los siete atajos que te hacen decir «sí»" },
    { tipo: "conectar" },
    {
      tipo: "voto",
      kicker: "Repaso de la sesión 1",
      pregunta: {
        id: "s2-repaso-1",
        texto: "Te dices «soy malísimo para exponer». Según Kross, ¿qué te ayudaría más?",
        opciones: ["Repetirte «yo puedo»", "Hablarte por tu nombre: «Luis, ya lo ensayaste»", "No pensar en la exposición"],
        correcta: 1,
        explicacion: "Hablarte como a un amigo te da distancia y calma. Acuerdo 1.",
      },
    },
    {
      tipo: "voto",
      kicker: "Repaso de la sesión 1",
      pregunta: {
        id: "s2-repaso-2",
        texto: "¿Por qué el público creyó que quien preguntaba era más listo?",
        opciones: ["Porque sí lo era", "Porque ignoró que los papeles se sortearon", "Porque las respuestas eran malas"],
        correcta: 1,
        explicacion: "Suponemos por lo que vemos y olvidamos la situación. Acuerdo 3.",
      },
    },
    {
      tipo: "voto",
      kicker: "Antes de empezar · ¿Caerías?",
      contexto: "Te llega este WhatsApp de un número desconocido: «Hola, soy tu tío, cambié de número. Urge que me deposites, ahorita te explico.»",
      pregunta: {
        id: "s2-tio",
        texto: "¿Qué truco está usando?",
        opciones: ["Autoridad y reciprocidad", "Unidad y escasez (urgencia)", "Prueba social y simpatía", "Ninguno, es un mensaje normal"],
        correcta: 1,
        explicacion: "Guarda tu respuesta: al final de la clase lo volvemos a votar.",
      },
    },
    {
      tipo: "tarjetas",
      kicker: "Robert Cialdini · Influencia (1984)",
      titulo: "Clic… y dices que sí",
      tarjetas: [
        { titulo: "Quién es", texto: "Psicólogo social. Además de hacer experimentos, pasó tiempo entrenándose con vendedores, publicistas y recaudadores para ver cómo convencen." },
        { titulo: "Qué descubrió", texto: "Usamos atajos mentales para decidir rápido. Casi siempre nos ayudan. Pero quien los conoce puede activarlos a propósito, como quien aprieta un botón." },
        { titulo: "Cuántos son", texto: "Seis en el libro original. En la edición ampliada de 2021 agregó un séptimo: la unidad." },
      ],
    },

    // Reciprocidad
    {
      tipo: "voto",
      kicker: "Principio 1 · Predice",
      contexto: "En un experimento, un desconocido le trajo a algunas personas un refresco sin que se lo pidieran. Después les ofreció boletos de una rifa.",
      pregunta: {
        id: "s2-regan",
        texto: "¿Qué pasó con quienes recibieron el refresco?",
        opciones: ["Compraron más boletos", "Compraron menos boletos", "Compraron igual que los demás"],
        correcta: 0,
        explicacion: "Compraron más, incluso si el desconocido les caía mal. El regalo creó una deuda.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Principio 1 de 7",
      titulo: "Reciprocidad",
      estudio: {
        quien: "Dennis Regan, Universidad de Cornell",
        hicieron: "Un ayudante regalaba un refresco a unos participantes y no a otros; luego les vendía boletos.",
        encontraron: "Quienes recibieron el regalo le compraron más, aunque no les agradara.",
        clave: "Regan, 1971",
      },
      enTuVida: "Defensa: agradece el regalo, pero pregúntate si lo que te piden después vale la pena por sí mismo.",
    },

    // Compromiso
    {
      tipo: "ciencia",
      kicker: "Principio 2 de 7",
      titulo: "Compromiso y coherencia",
      estudio: {
        quien: "Jonathan Freedman y Scott Fraser, Universidad de Stanford",
        hicieron: "A unos vecinos primero les pidieron algo pequeño (firmar una petición). Días después, algo grande: poner un letrero enorme en su jardín.",
        encontraron: "Quienes aceptaron lo pequeño aceptaron lo grande mucho más que los demás. Se llama «pie en la puerta».",
        clave: "Freedman y Fraser, 1966",
      },
      enTuVida: "«¿Me pasas solo una respuesta?»… y terminas haciendo toda la tarea. Defensa: evalúa cada petición por separado.",
    },

    // Prueba social
    {
      tipo: "voto",
      kicker: "Principio 3 · Predice",
      contexto: "Un hotel quería que sus huéspedes reutilizaran las toallas. Probó dos letreros: «Ayuda a cuidar el medio ambiente» y «La mayoría de los huéspedes reutiliza su toalla».",
      pregunta: {
        id: "s2-toallas",
        texto: "¿Cuál funcionó mejor?",
        opciones: ["El del medio ambiente", "El de «la mayoría de los huéspedes»", "Los dos igual"],
        correcta: 1,
        explicacion: "Saber qué hacen los demás nos movió más que el argumento ecológico.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Principio 3 de 7",
      titulo: "Prueba social",
      estudio: {
        quien: "Noah Goldstein, Robert Cialdini y Vladas Griskevicius",
        hicieron: "Compararon letreros en las habitaciones de un hotel.",
        encontraron: "El mensaje sobre lo que hacía la mayoría logró más reutilización que el mensaje ecológico.",
        clave: "Goldstein et al., 2008",
      },
      enTuVida: "Los likes, «lo más vendido», el reto viral. Defensa: pregúntate «¿lo haría si nadie más lo hiciera?».",
    },

    // Simpatía
    {
      tipo: "ciencia",
      kicker: "Principio 4 de 7",
      titulo: "Simpatía",
      estudio: {
        quien: "Jerry Burger y su equipo, Universidad de Santa Clara",
        hicieron: "Una desconocida pedía un favor. A veces «descubría» que cumplía años el mismo día que el participante.",
        encontraron: "Con esa pequeña coincidencia, más personas aceptaron hacer el favor.",
        clave: "Burger et al., 2004",
      },
      enTuVida: "El influencer que «es igualito a ti» te recomienda un producto. Defensa: separa a la persona de lo que te vende.",
    },

    // Autoridad
    {
      tipo: "voto",
      kicker: "Principio 5 · Predice",
      contexto: "En 1963, un investigador de bata pidió a 40 voluntarios dar «descargas eléctricas» cada vez más fuertes a otra persona. (Las descargas eran falsas y el otro era un actor, pero ellos no lo sabían.)",
      pregunta: {
        id: "s2-milgram",
        texto: "¿Cuántos de los 40 llegaron hasta la descarga más fuerte?",
        opciones: ["Casi ninguno (1 o 2)", "Unos 10", "Unos 20", "26"],
        correcta: 3,
        explicacion: "26 de 40 obedecieron hasta el final solo porque alguien con autoridad se los pedía. Hoy ese experimento no se permitiría: les causó mucho estrés a los voluntarios.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Principio 5 de 7",
      titulo: "Autoridad",
      estudio: {
        quien: "Stanley Milgram, Universidad de Yale",
        hicieron: "Una figura de autoridad ordenaba castigar a otra persona.",
        encontraron: "La mayoría obedeció mucho más de lo que nadie imaginaba.",
        clave: "Milgram, 1963",
      },
      enTuVida: "La bata en el anuncio, la palomita azul, «un experto dice». Defensa: ¿de verdad sabe de esto? ¿Qué gana si le hago caso?",
    },

    // Escasez
    {
      tipo: "voto",
      kicker: "Principio 6 · Predice",
      contexto: "A unas personas les dieron a probar galletas de un frasco con diez. A otras, las mismas galletas de un frasco con solo dos.",
      pregunta: {
        id: "s2-galletas",
        texto: "¿Cuáles calificaron como más valiosas?",
        opciones: ["Las del frasco con diez", "Las del frasco con dos", "Igual"],
        correcta: 1,
        explicacion: "Eran idénticas. Solo porque había menos, parecían mejores.",
      },
    },
    {
      tipo: "ciencia",
      kicker: "Principio 6 de 7",
      titulo: "Escasez",
      estudio: {
        quien: "Stephen Worchel y su equipo",
        hicieron: "Ofrecieron las mismas galletas en un frasco lleno y en uno casi vacío.",
        encontraron: "Las del frasco casi vacío parecieron más deseables y valiosas.",
        clave: "Worchel et al., 1975",
      },
      enTuVida: "«Solo quedan 2», «la oferta acaba en 10 minutos», «urge». Defensa: si te apuran, frena. Lo urgente para ellos no es urgente para ti.",
    },

    // Unidad
    {
      tipo: "tarjetas",
      kicker: "Principio 7 de 7 · el más nuevo",
      titulo: "Unidad",
      tarjetas: [
        { titulo: "Qué es", texto: "Le creemos más a quien sentimos «de los nuestros»: familia, paisanos, mismo equipo, misma escuela. Cialdini lo agregó en 2021." },
        { titulo: "Dónde lo ves", texto: "«Entre mexicanos nos apoyamos», «somos familia», el fraude del «tío que cambió de número»." },
        { titulo: "Defensa", texto: "Si alguien dice ser de los tuyos, compruébalo por otro camino: llama al número que ya tenías." },
      ],
      pie: "Fuente: Cialdini, 2021",
    },

    // Cazadores de trucos
    {
      tipo: "caza",
      kicker: "En parejas · 5 minutos",
      titulo: "Cazadores de trucos",
      casos: [
        { mensaje: "«¡ÚLTIMAS 3 PIEZAS! Precio especial solo hoy.»", respuesta: "Escasez" },
        { mensaje: "«Más de 2 millones ya descargaron esta app.»", respuesta: "Prueba social" },
        { mensaje: "«Como dentista, te recomiendo esta pasta.» (actor con bata)", respuesta: "Autoridad" },
        { mensaje: "«Te regalo esta clase de prueba. ¿Te inscribo al curso completo?»", respuesta: "Reciprocidad" },
        { mensaje: "«Ya dijiste que te importa el planeta… ¿donas hoy?»", respuesta: "Compromiso y coherencia" },
        { mensaje: "«¡Somos del mismo barrio, carnal! Apóyame con tu voto.»", respuesta: "Unidad" },
      ],
    },
    {
      tipo: "tarjetas",
      kicker: "Tu escudo",
      titulo: "La pausa de 5 segundos",
      tarjetas: [
        { titulo: "1. ¿Me están apurando?", texto: "La prisa es la señal número uno. Nada importante se decide en diez segundos." },
        { titulo: "2. ¿Quién gana si digo que sí?", texto: "Si gana sobre todo el otro, detente y compruébalo." },
        { titulo: "3. ¿Lo haría si nadie más lo hiciera?", texto: "Si la respuesta es no, te está moviendo el grupo, no tu decisión." },
      ],
      pie: "Practicar con ejemplos, como hoy, te hace más difícil de engañar (Roozenbeek et al., 2022).",
    },
    {
      tipo: "tarjetas",
      kicker: "El lado bueno",
      titulo: "Convencer sin manipular",
      tarjetas: [
        { titulo: "Autoridad real", texto: "En tu exposición, cita una fuente seria. Eso es autoridad bien usada." },
        { titulo: "Prueba social real", texto: "«Tres compañeros ya lo probaron y les funcionó», si es verdad." },
        { titulo: "La regla de Cialdini", texto: "Usa los principios solo cuando sean ciertos. Inventar escasez o autoridad es manipular." },
      ],
    },
    {
      tipo: "voto",
      kicker: "¿Caerías? · Segunda vuelta",
      contexto: "Otra vez: «Hola, soy tu tío, cambié de número. Urge que me deposites, ahorita te explico.»",
      pregunta: {
        id: "s2-tio-final",
        texto: "¿Qué truco está usando?",
        opciones: ["Autoridad y reciprocidad", "Unidad y escasez (urgencia)", "Prueba social y simpatía", "Ninguno, es un mensaje normal"],
        correcta: 1,
        explicacion: "Unidad («soy tu tío») y escasez («urge»). Compara con lo que votó el grupo al inicio.",
      },
    },
    {
      tipo: "lectura",
      ganchos: [
        { libro: "Influencia", pregunta: "¿Por qué una tienda vendió todas sus joyas de turquesa justo cuando las subió de precio por error?", donde: "Primer capítulo" },
        { libro: "Influencia", pregunta: "¿Qué tienen que ver una mamá pava y una grabadora con tus decisiones?", donde: "Primer capítulo" },
        { libro: "Influencia", pregunta: "¿Por qué un grupo regalaba flores a desconocidos en los aeropuertos?", donde: "Capítulo de la reciprocidad" },
      ],
    },
    {
      tipo: "reto",
      titulo: "Tu reto de 7 días",
      niveles: [
        { nombre: "Nivel 1 · Todos", texto: "Cada día, caza un truco en un anuncio, un mensaje o una publicación. Anótalo: dónde, qué principio y qué te pedían." },
        { nombre: "Nivel 2 · Lector", texto: "Lee el capítulo de un principio y trae la respuesta a su pregunta gancho." },
        { nombre: "Nivel 3 · Creador", texto: "Haz una guía corta para tu familia: cómo reconocer el fraude del «familiar que cambió de número»." },
      ],
    },
    { tipo: "quiz", quiz: 2 },
    {
      tipo: "fuentes",
      claves: ["Cialdini, 1984", "Cialdini, 2021", "Regan, 1971", "Freedman y Fraser, 1966", "Goldstein et al., 2008", "Burger et al., 2004", "Milgram, 1963", "Worchel et al., 1975", "Roozenbeek et al., 2022"],
    },
  ],
};

export const SESIONES_MASTER: SesionMaster[] = [sesion1, sesion2];

/** Todas las preguntas en vivo, por id, para que el celular del alumno las muestre. */
export const PREGUNTAS_VIVO: Record<string, PreguntaVivo> = Object.fromEntries(
  SESIONES_MASTER.flatMap((s) => s.diapositivas)
    .filter((d): d is Extract<Diapositiva, { tipo: "voto" }> => d.tipo === "voto")
    .map((d) => [d.pregunta.id, d.pregunta]),
);

// Revisión al construir: ids únicos y cortos, y toda fuente citada existe.
{
  const vistos = new Set<string>();
  for (const s of SESIONES_MASTER) {
    for (const d of s.diapositivas) {
      if (d.tipo === "voto") {
        const id = d.pregunta.id;
        if (vistos.has(id)) throw new Error(`Máster: el id de pregunta "${id}" está repetido.`);
        if (!/^[a-z0-9-]{1,30}$/.test(id)) throw new Error(`Máster: el id "${id}" solo puede llevar minúsculas, números y guiones.`);
        if (d.pregunta.opciones.length > 6) throw new Error(`Máster: "${id}" tiene más de 6 opciones.`);
        vistos.add(id);
      }
      const claves =
        d.tipo === "ciencia" ? [d.estudio.clave] : d.tipo === "fuentes" ? d.claves : [];
      for (const c of claves) {
        if (!FUENTES_MASTER[c]) throw new Error(`Máster: la fuente "${c}" no está en FUENTES_MASTER.`);
      }
    }
  }
  for (const q of Object.values(QUIZZES)) {
    if (q.preguntas.length > 20) throw new Error(`Máster: el quiz ${q.numero} pasa de 20 preguntas.`);
  }
}

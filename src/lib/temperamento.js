// Test de los cuatro temperamentos — sanguíneo, colérico, melancólico y flemático.
//
// QUÉ ES Y QUÉ NO ES. Esto es un instrumento de orientación educativa, no un
// diagnóstico psicológico. Sirve para que el docente sepa cómo trabaja mejor
// cada alumno y para que el alumno se reconozca; no sirve para etiquetarlo, ni
// para decidir si puede o no hacer algo. Todos los textos de resultado están
// escritos con esa idea: describen una forma de reaccionar, no un defecto.
//
// CÓMO ESTÁ CONSTRUIDO
//
//   · 40 reactivos, 10 por temperamento.
//   · Escala de frecuencia de 4 puntos (0 a 3). Se eligió par a propósito: sin
//     punto medio, el alumno tiene que inclinarse y el resultado discrimina.
//   · Máximo 30 puntos por temperamento; el perfil se reporta en porcentaje
//     para que los cuatro se puedan comparar de un vistazo.
//   · Los reactivos van intercalados (sanguíneo, colérico, melancólico,
//     flemático, y otra vez) para que no se note el patrón y no se conteste
//     "en bloque".
//
// Casi nadie sale puro. Lo normal es un dominante y un segundo cercano; por eso
// el resultado siempre nombra los dos, y avisa cuando están empatados.

export const ESCALA = [
  { valor: 0, rotulo: 'Nunca' },
  { valor: 1, rotulo: 'Pocas veces' },
  { valor: 2, rotulo: 'Casi siempre' },
  { valor: 3, rotulo: 'Siempre' },
];

export const PUNTOS_MAX = 30; // 10 reactivos × 3

export const TEMPERAMENTOS = {
  sanguineo: {
    nombre: 'Sanguíneo',
    lema: 'Entusiasta y sociable',
    color: 'amber',
    descripcion:
      'Te mueves bien entre la gente: haces amistades rápido, contagias el ánimo y te entusiasmas con las ideas nuevas. Tu reto no es empezar, es terminar.',
    aprende:
      'Aprendes hablando, en equipo y con actividades que cambian seguido. Las clases largas de solo escuchar te apagan.',
    cuidado:
      'Cuida la organización: agenda, lista de tareas y fechas a la vista. Lo que más te cuesta es sostener el interés hasta el final.',
  },
  colerico: {
    nombre: 'Colérico',
    lema: 'Decidido y directo',
    color: 'rose',
    descripcion:
      'Tomas decisiones rápido, te fijas metas y no paras hasta lograrlas. En los equipos sueles acabar dirigiendo, aunque nadie te lo pida.',
    aprende:
      'Aprendes con retos, metas claras y competencia sana. Necesitas saber para qué sirve lo que estás estudiando.',
    cuidado:
      'Cuida la paciencia y la forma de decir las cosas. Tener la razón y ser escuchado no son lo mismo.',
  },
  melancolico: {
    nombre: 'Melancólico',
    lema: 'Reflexivo y detallista',
    color: 'violet',
    descripcion:
      'Piensas las cosas a fondo, notas detalles que a los demás se les pasan y te tomas en serio la calidad de lo que entregas.',
    aprende:
      'Aprendes leyendo, escribiendo y con tiempo para procesar. Te rinde más trabajar solo o en parejas que en equipos grandes.',
    cuidado:
      'Cuida el perfeccionismo: entregar algo bueno a tiempo vale más que algo perfecto que nunca sale. Y no todo lo que te dicen es una crítica personal.',
  },
  flematico: {
    nombre: 'Flemático',
    lema: 'Tranquilo y constante',
    color: 'emerald',
    descripcion:
      'Mantienes la calma cuando los demás se alteran, escuchas bien y sueles ser quien pone paz. Trabajas parejo, sin picos.',
    aprende:
      'Aprendes con rutina, instrucciones claras y sin prisas. El trabajo constante te favorece más que estudiar a última hora.',
    cuidado:
      'Cuida el arranque y decir lo que piensas. Ceder siempre para evitar el conflicto termina costándote a ti.',
  },
};

export const ORDEN = ['sanguineo', 'colerico', 'melancolico', 'flematico'];

// Los cuatro bloques de reactivos, antes de intercalarse. Se guardan por
// temperamento para que sea evidente cuántos hay de cada uno y no se
// desbalanceen sin querer al agregar o quitar uno.
const BLOQUES = {
  sanguineo: [
    'Hago amigos nuevos con facilidad, incluso donde no conozco a nadie.',
    'Me gusta llamar la atención cuando estoy en un grupo.',
    'Empiezo muchas cosas con entusiasmo, aunque no siempre las termino.',
    'Hablo mucho y con energía cuando algo me emociona.',
    'Se me olvidan las tareas o los materiales con frecuencia.',
    'Prefiero trabajar en equipo que trabajar solo.',
    'Se me pasa rápido el enojo y vuelvo a estar de buenas.',
    'Me aburro cuando tengo que hacer lo mismo durante mucho rato.',
    'Cuento lo que me pasa sin guardarme mucho.',
    'Levanto el ánimo del grupo cuando los demás están desanimados.',
  ],
  colerico: [
    'Cuando trabajo en equipo, termino organizando a los demás.',
    'Me molesta perder el tiempo en cosas que no llevan a ningún lado.',
    'Digo lo que pienso aunque a alguien le caiga mal.',
    'Me cuesta esperar cuando algo va lento.',
    'Me gusta competir y me importa ganar.',
    'Tomo decisiones rápido, sin darles muchas vueltas.',
    'Cuando me propongo algo, no paro hasta lograrlo.',
    'Me desespera la gente que no hace su parte del trabajo.',
    'Prefiero dirigir a que me dirijan.',
    'Discuto sin problema cuando creo que tengo la razón.',
  ],
  melancolico: [
    'Le doy muchas vueltas a las cosas antes de decidir.',
    'Me incomoda entregar un trabajo si no quedó como yo quería.',
    'Me afecta bastante cuando alguien me critica.',
    'Prefiero tener pocos amigos, pero de confianza.',
    'Me fijo en detalles que los demás no notan.',
    'Me quedo pensando en cosas que ya pasaron.',
    'Necesito estar un rato solo para recuperar energía.',
    'Planeo con anticipación en lugar de improvisar.',
    'Me cuesta empezar algo si no lo veo claro desde el principio.',
    'Me conmueve lo que les pasa a otras personas.',
  ],
  flematico: [
    'Casi nada me hace perder la calma.',
    'Prefiero ceder antes que meterme en un pleito.',
    'Sigo una rutina y me siento bien con ella.',
    'Los demás me buscan cuando hay que poner paz en un conflicto.',
    'Me tardo en decidir porque no quiero equivocarme.',
    'Puedo escuchar a alguien un buen rato sin interrumpirlo.',
    'Me acomodo a lo que decida el grupo sin hacer problema.',
    'Trabajo despacio pero parejo, sin acelerarme.',
    'Me cuesta arrancar cuando algo no me llama la atención.',
    'Rara vez levanto la voz.',
  ],
};

/* Intercalado: t1_1, t2_1, t3_1, t4_1, t1_2, … Los ids llevan el temperamento
 * dentro (san_3, col_3, …) porque así un resultado guardado se puede leer sin
 * necesidad de este archivo, aunque el orden cambie después. */
const SIGLA = { sanguineo: 'san', colerico: 'col', melancolico: 'mel', flematico: 'fle' };

export const REACTIVOS = Array.from({ length: 10 }, (_, i) =>
  ORDEN.map((t) => ({
    id: `${SIGLA[t]}_${i + 1}`,
    texto: BLOQUES[t][i],
    tipo: t,
  })),
).flat();

/**
 * Suma el perfil.
 *
 * `respuestas` es {idReactivo: 0..3}. Un reactivo sin contestar suma 0, así que
 * el componente exige contestarlos todos antes de dejar avanzar: un perfil a
 * medias no dice nada, y peor, dice algo falso.
 */
export function perfilTemperamento(respuestas) {
  const puntos = { sanguineo: 0, colerico: 0, melancolico: 0, flematico: 0 };
  let contestados = 0;

  for (const r of REACTIVOS) {
    const v = respuestas[r.id];
    if (typeof v === 'number' && v >= 0 && v <= 3) {
      puntos[r.tipo] += v;
      contestados++;
    }
  }

  const porcentaje = {};
  for (const t of ORDEN) porcentaje[t] = Math.round((puntos[t] / PUNTOS_MAX) * 100);

  // Se ordena por puntos; en empate manda el orden fijo de ORDEN para que el
  // resultado sea siempre el mismo con los mismos datos.
  const ranking = [...ORDEN].sort((a, b) => puntos[b] - puntos[a]);
  const dominante = ranking[0];
  const secundario = ranking[1];

  return {
    puntos,
    porcentaje,
    dominante,
    secundario,
    // Cuando los dos primeros están a un punto o menos, no hay un dominante
    // claro y decirlo es más honesto que inventar un ganador.
    empatado: puntos[dominante] - puntos[secundario] <= 1,
    contestados,
    completo: contestados === REACTIVOS.length,
  };
}

// Diagnóstico inicial: habilidades socioemocionales y condiciones de estudio.
//
// Son los dos bloques del documento "Diagnóstico Inicial de Bachillerato".
// Se aplican a TODOS los grados, a diferencia de la evaluación de conocimientos,
// que cambia según el año.
//
// QUÉ MIDE CADA BLOQUE, y por qué se tratan distinto:
//
//   · BLOQUE A (22 reactivos Likert) sí se puntúa. Cuatro subescalas que se
//     suman por separado; el total no dice gran cosa, lo útil es ver cuál de las
//     cuatro está baja.
//   · BLOQUE B NO se puntúa, y es a propósito. Mezcla cosas que no se pueden
//     sumar entre sí: tener internet no es "más" ni "menos" que trabajar medio
//     tiempo. Convertirlo en un número inventaría una escala que no existe. Sale
//     como banderas: rojo, amarillo o nada.
//
// LOS REACTIVOS INVERSOS. Seis están redactados al revés ("Dejo mis trabajos
// para el último momento") para que el alumno no conteste en piloto automático.
// Al calificar se voltean con 6 − respuesta, de forma que en TODAS las
// subescalas más alto siempre signifique mejor.

export const ESCALA = [
  { valor: 1, rotulo: 'Nunca' },
  { valor: 2, rotulo: 'Casi nunca' },
  { valor: 3, rotulo: 'A veces' },
  { valor: 4, rotulo: 'Casi siempre' },
  { valor: 5, rotulo: 'Siempre' },
];

/** Las cuatro subescalas del bloque A. `inverso` voltea el puntaje. */
export const SUBESCALAS = [
  {
    id: 'gestionTiempo',
    nombre: 'Gestión del tiempo',
    reactivos: [
      { id: 'a1', texto: 'Organizo mi tiempo para cumplir con tareas y estudiar.' },
      { id: 'a2', texto: 'Dejo mis trabajos para el último momento.', inverso: true },
      { id: 'a3', texto: 'Uso algún método (agenda, lista, calendario) para no olvidar pendientes.' },
      { id: 'a4', texto: 'Cumplo con los tiempos que me propongo para estudiar.' },
      { id: 'a5', texto: 'Me distraigo fácilmente cuando debo estudiar.', inverso: true },
      { id: 'a6', texto: 'Priorizo tareas según su importancia o fecha de entrega.' },
    ],
  },
  {
    id: 'motivacion',
    nombre: 'Motivación y compromiso',
    reactivos: [
      { id: 'a7', texto: 'Me interesa aprender más allá de lo que piden para la calificación.' },
      { id: 'a8', texto: 'Me esfuerzo aunque una materia no me guste.' },
      { id: 'a9', texto: 'Siento que lo que aprendo en la escuela me servirá a futuro.' },
      { id: 'a10', texto: 'Pierdo el interés fácilmente si algo se dificulta.', inverso: true },
      { id: 'a11', texto: 'Me propongo metas académicas concretas.' },
      { id: 'a12', texto: 'Participo activamente en clase.' },
    ],
  },
  {
    id: 'estres',
    nombre: 'Manejo del estrés',
    reactivos: [
      { id: 'a13', texto: 'Me siento abrumado(a) por la carga de trabajo escolar.', inverso: true },
      { id: 'a14', texto: 'Encuentro formas de calmarme cuando estoy estresado(a).' },
      { id: 'a15', texto: 'La presión escolar afecta mi sueño o mi apetito.', inverso: true },
      { id: 'a16', texto: 'Puedo seguir trabajando aunque esté nervioso(a) por un examen.' },
      { id: 'a17', texto: 'Pido ayuda cuando me siento sobrepasado(a).' },
    ],
  },
  {
    id: 'organizacion',
    nombre: 'Organización del estudio',
    reactivos: [
      { id: 'a18', texto: 'Tengo un espacio fijo para estudiar o hacer tarea.' },
      { id: 'a19', texto: 'Reviso mis apuntes aunque no haya examen próximo.' },
      { id: 'a20', texto: 'Estudio solo un día antes del examen.', inverso: true },
      { id: 'a21', texto: 'Identifico qué temas me cuestan más trabajo.' },
      { id: 'a22', texto: 'Busco recursos extra (videos, ejercicios) cuando no entiendo algo.' },
    ],
  },
];

/** Todos los reactivos del bloque A, en orden. */
export const REACTIVOS_A = SUBESCALAS.flatMap((s) =>
  s.reactivos.map((r) => ({ ...r, subescala: s.id })),
);

/* ── Bloque B ────────────────────────────────────────────────────────────────
 *
 * Cada opción trae su `bandera`: 'roja' cuando es un obstáculo real para
 * estudiar, 'amarilla' cuando conviene vigilarlo, y nada cuando no hay
 * problema. Las banderas viven junto a la opción, y no en una tabla aparte,
 * para que al cambiar una pregunta no se quede una regla huérfana apuntando a
 * una respuesta que ya no existe.
 */
export const BLOQUE_B = [
  {
    id: 'acceso',
    nombre: 'Acceso a recursos',
    campos: [
      {
        id: 'b1', texto: '¿Tienes acceso a internet en casa?',
        opciones: [
          { v: 'siempre', t: 'Sí, siempre' },
          { v: 'limitado', t: 'Sí, pero limitado', bandera: 'amarilla', motivo: 'Internet limitado en casa' },
          { v: 'no', t: 'No', bandera: 'roja', motivo: 'Sin internet en casa' },
        ],
      },
      {
        id: 'b2', texto: '¿Cuentas con computadora o laptop?',
        opciones: [
          { v: 'propia', t: 'Propia' },
          { v: 'compartida', t: 'Compartida' },
          { v: 'no', t: 'No tengo', bandera: 'roja', motivo: 'Sin computadora' },
        ],
      },
      {
        id: 'b3', texto: '¿Cómo describirías tu acceso a datos móviles?',
        opciones: [
          { v: 'ilimitado', t: 'Ilimitado' },
          { v: 'limitado', t: 'Limitado', bandera: 'amarilla', motivo: 'Datos móviles limitados' },
          { v: 'no', t: 'No tengo', bandera: 'amarilla', motivo: 'Sin datos móviles' },
        ],
      },
      {
        id: 'b4', texto: '¿Tienes un lugar tranquilo para estudiar en casa?',
        opciones: [
          { v: 'si', t: 'Sí' },
          { v: 'aveces', t: 'A veces', bandera: 'amarilla', motivo: 'Lugar de estudio inestable' },
          { v: 'no', t: 'No', bandera: 'roja', motivo: 'Sin lugar para estudiar' },
        ],
      },
    ],
  },
  {
    id: 'tiempoResponsabilidades',
    nombre: 'Tiempo y responsabilidades',
    campos: [
      {
        id: 'b5', texto: '¿Trabajas actualmente además de estudiar?',
        opciones: [
          { v: 'no', t: 'No' },
          { v: 'medio', t: 'Sí, medio tiempo', bandera: 'amarilla', motivo: 'Trabaja medio tiempo' },
          { v: 'completo', t: 'Sí, tiempo completo', bandera: 'roja', motivo: 'Trabaja tiempo completo' },
        ],
      },
      {
        id: 'b6', texto: 'Si trabajas, ¿cuántas horas a la semana?',
        tipo: 'numero', max: 80,
        // Solo tiene sentido si contestó que sí trabaja.
        depende: { campo: 'b5', valores: ['medio', 'completo'] },
      },
      {
        id: 'b7', texto: '¿Tienes responsabilidades de cuidado en casa (hermanos, familiares)?',
        opciones: [
          { v: 'no', t: 'No' },
          { v: 'ocasional', t: 'Ocasional' },
          { v: 'frecuente', t: 'Frecuente', bandera: 'amarilla', motivo: 'Cuida a alguien con frecuencia' },
        ],
      },
      {
        id: 'b8', texto: '¿Cuánto tiempo tardas en trasladarte a la escuela?',
        opciones: [
          { v: 'corto', t: 'Menos de 30 minutos' },
          { v: 'medio', t: 'Entre 30 y 60 minutos' },
          { v: 'largo', t: 'Más de una hora', bandera: 'amarilla', motivo: 'Más de una hora de traslado' },
        ],
      },
      {
        id: 'b9', texto: '¿Cuántas horas dedicas al estudio fuera de clase entre semana?',
        opciones: [
          { v: '0', t: 'Ninguna', bandera: 'roja', motivo: 'No estudia fuera de clase' },
          { v: '1-3', t: 'Entre 1 y 3' },
          { v: '4-6', t: 'Entre 4 y 6' },
          { v: '6+', t: 'Más de 6' },
        ],
      },
    ],
  },
];

/** Bloque B3: apoyo familiar. Es Likert, con la misma escala del bloque A, pero
 *  NO entra en el puntaje: describe el entorno, no una habilidad del alumno. */
export const APOYO = [
  { id: 'b10', texto: 'En mi casa me animan a seguir estudiando.' },
  { id: 'b11', texto: 'Tengo con quién resolver dudas fuera de la escuela.' },
  { id: 'b12', texto: 'Mi familia entiende las exigencias de la escuela.' },
  { id: 'b13', texto: 'Cuento con condiciones económicas para mis materiales escolares.' },
];

/** Un promedio bajo de apoyo familiar también es una bandera. */
const CORTE_APOYO_ROJO = 2.5;
const CORTE_APOYO_AMARILLO = 3.5;

// ─── Calificación ────────────────────────────────────────────────────────────

/** Vuelve comparable un reactivo inverso: en todas las subescalas, más es mejor. */
export function valorReal(reactivo, respuesta) {
  const v = Number(respuesta);
  if (!Number.isFinite(v)) return null;
  return reactivo.inverso ? 6 - v : v;
}

/**
 * Puntajes del bloque A por subescala.
 *
 * Se reporta el PORCENTAJE además de la suma porque las subescalas no miden
 * igual: dos tienen seis reactivos (máximo 30) y dos tienen cinco (máximo 25).
 * Comparar 24 contra 24 entre una y otra sería comparar cosas distintas.
 */
export function calificarA(respuestas) {
  const out = {};
  for (const s of SUBESCALAS) {
    let suma = 0;
    let contestados = 0;
    for (const r of s.reactivos) {
      const v = valorReal(r, respuestas[r.id]);
      if (v === null) continue;
      suma += v;
      contestados++;
    }
    const max = s.reactivos.length * 5;
    const min = s.reactivos.length;
    // El porcentaje se toma sobre el rango real (mínimo posible es 1 por
    // reactivo, no 0), si no, nadie puede sacar 0 % y la escala miente.
    const pct = contestados === s.reactivos.length
      ? Math.round(((suma - min) / (max - min)) * 100)
      : null;
    out[s.id] = {
      nombre: s.nombre,
      suma,
      max,
      contestados,
      total: s.reactivos.length,
      porcentaje: pct,
      nivel: pct === null ? null : pct <= 40 ? 'bajo' : pct <= 70 ? 'medio' : 'alto',
    };
  }
  return out;
}

export const NIVELES = {
  bajo:  { nombre: 'Bajo',  nota: 'Área de atención prioritaria' },
  medio: { nombre: 'Medio', nota: 'Conviene reforzar con estrategias puntuales' },
  alto:  { nombre: 'Alto',  nota: 'Fortaleza; puede servir de apoyo entre pares' },
};

/** Todos los campos del bloque B, aplanados. */
export const CAMPOS_B = BLOQUE_B.flatMap((g) => g.campos.map((c) => ({ ...c, grupo: g.id })));

/** Las banderas que levanta este alumno, con su motivo escrito. */
export function banderasDe(respuestasB, respuestasApoyo) {
  const banderas = [];
  for (const c of CAMPOS_B) {
    if (!c.opciones) continue;
    const op = c.opciones.find((o) => o.v === respuestasB[c.id]);
    if (op?.bandera) banderas.push({ id: c.id, color: op.bandera, motivo: op.motivo });
  }

  const vals = APOYO.map((a) => Number(respuestasApoyo?.[a.id])).filter(Number.isFinite);
  if (vals.length === APOYO.length) {
    const prom = vals.reduce((a, b) => a + b, 0) / vals.length;
    if (prom <= CORTE_APOYO_ROJO) {
      banderas.push({ id: 'apoyo', color: 'roja', motivo: 'Poco apoyo familiar para estudiar' });
    } else if (prom <= CORTE_APOYO_AMARILLO) {
      banderas.push({ id: 'apoyo', color: 'amarilla', motivo: 'Apoyo familiar limitado' });
    }
  }
  return banderas;
}

/**
 * Recomendaciones. Cruzan una subescala baja con la situación real del alumno,
 * porque el mismo puntaje pide cosas distintas según el contexto: "gestión del
 * tiempo baja" en alguien que trabaja tiempo completo no se arregla pidiéndole
 * que se organice mejor.
 *
 * Son sugerencias para el docente, no un dictamen. Por eso están redactadas
 * como acciones y no como etiquetas sobre el alumno.
 */
export function recomendaciones(puntajes, banderas) {
  const out = [];
  const tiene = (id) => banderas.some((b) => b.id === id);
  const rojas = banderas.filter((b) => b.color === 'roja');
  const bajo = (k) => puntajes[k]?.nivel === 'bajo';

  if (bajo('gestionTiempo')) {
    out.push(
      respuestaB(banderas, 'b5', ['completo', 'medio'])
        ? 'Gestión del tiempo baja y además trabaja: conviene un plan de estudio flexible, con entregas asincrónicas y fechas negociadas, antes que pedirle más organización.'
        : 'Gestión del tiempo baja: enseñar un método concreto (agenda o lista semanal) y revisarlo las primeras semanas.',
    );
  }
  if (bajo('estres')) {
    out.push('Manejo del estrés bajo: canalizar a orientación o tutoría. Revisar también la carga de trabajo del grupo, no solo la del alumno.');
  }
  if (bajo('motivacion')) {
    out.push('Motivación baja: ligar los contenidos con algo que le importe y fijar metas cortas y alcanzables para recuperar la sensación de avance.');
  }
  if (bajo('organizacion')) {
    out.push(
      tiene('b1') || tiene('b2')
        ? 'Organización del estudio baja y sin recursos digitales en casa: priorizar material impreso y trabajo terminado en clase.'
        : 'Organización del estudio baja: mostrarle cómo repasar por partes en vez de estudiar la víspera.',
    );
  }
  if (rojas.length >= 2) {
    out.push(`Este alumno levanta ${rojas.length} banderas rojas (${rojas.map((b) => b.motivo.toLowerCase()).join(', ')}). Conviene una charla individual antes de que se acumule el rezago.`);
  }
  if (!out.length) {
    out.push('No hay focos de atención en este diagnóstico. Puede servir de apoyo para compañeros en las áreas donde salió alto.');
  }
  return out;
}

function respuestaB(banderas, campo, valores) {
  return banderas.some((b) => b.id === campo && valores.length > 0);
}

/** Todo junto, que es lo que se guarda. */
export function calificarDiagnosticoInicial(respuestasA, respuestasB, respuestasApoyo) {
  const puntajes = calificarA(respuestasA);
  const banderas = banderasDe(respuestasB, respuestasApoyo);
  return {
    puntajes,
    banderas,
    rojas: banderas.filter((b) => b.color === 'roja').length,
    amarillas: banderas.filter((b) => b.color === 'amarilla').length,
    recomendaciones: recomendaciones(puntajes, banderas),
    respuestasA,
    respuestasB,
    respuestasApoyo,
  };
}

/** Cuántos reactivos son en total, para la barra de avance. */
export const TOTAL_REACTIVOS =
  REACTIVOS_A.length + CAMPOS_B.filter((c) => !c.depende).length + APOYO.length;

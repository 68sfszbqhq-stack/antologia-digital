// Catálogo del cuestionario de nuevo ingreso para padres de familia.
//
// Está aquí, como datos y no como formulario escrito a mano, para que cambiar
// una pregunta sea cambiar una línea de esta lista y no tocar React. El
// componente recorre estas secciones y arma los campos solo.
//
// Tipos de campo:
//   texto | texto largo | numero | fecha | correo | telefono | curp
//   opcion  → lista desplegable (una sola respuesta)
//   varias  → casillas (varias respuestas)
//   escala  → botones en fila, para frecuencias
//
// Reglas de cada campo:
//   clave        nombre con el que se guarda en la base. NO cambiarlo después
//                de aplicar el cuestionario: los datos viejos quedarían huérfanos.
//   requerido    si falta, no deja avanzar de sección.
//   depende      solo aparece si otro campo tiene cierto valor.
//   sensible     dato personal sensible según la ley. Siempre lleva la opción
//                "Prefiero no contestar" y nunca es obligatorio.
//
// SOBRE LAS PREGUNTAS SENSIBLES: salud, consumo de sustancias en casa, violencia
// dentro de la familia y el ingreso familiar. La ley mexicana pide consentimiento
// expreso para tratarlas, que es lo que firma la declaración del final. Ninguna
// de ellas es obligatoria, a propósito: obligar a una familia a declarar que hay
// violencia en su casa es tanto un problema legal como una forma de garantizar
// que te mientan.

const FRECUENCIA = ['Nunca', 'A veces', 'Frecuentemente', 'Siempre', 'Prefiero no contestar'];
const SI_NO = ['Sí', 'No'];

const ESCOLARIDAD = [
  'Sin estudios', 'Primaria incompleta', 'Primaria terminada',
  'Secundaria incompleta', 'Secundaria terminada', 'Bachillerato',
  'Carrera técnica o comercial', 'Licenciatura', 'Posgrado', 'No sé',
];

const PROBLEMAS = [
  'Inseguridad o delincuencia', 'Consumo de drogas', 'Consumo de alcohol',
  'Pandillerismo', 'Falta de empleo', 'Falta de servicios públicos',
  'Calles en mal estado', 'Basura o contaminación', 'Violencia familiar',
  'Falta de espacios deportivos o culturales', 'Falta de transporte',
  'Otro',
];

export const SECCIONES = [
  {
    id: 'alumno',
    titulo: 'Datos del alumno',
    nota: 'Escríbelos como aparecen en su acta de nacimiento.',
    campos: [
      { clave: 'curp', rotulo: 'CURP del alumno', tipo: 'curp', requerido: true,
        ayuda: '18 caracteres. Viene en su acta o en la constancia de la CURP.' },
      { clave: 'apellidoPaterno', rotulo: 'Apellido paterno', tipo: 'texto', requerido: true },
      { clave: 'apellidoMaterno', rotulo: 'Apellido materno', tipo: 'texto', requerido: true },
      { clave: 'nombres', rotulo: 'Nombre (s)', tipo: 'texto', requerido: true },
      { clave: 'genero', rotulo: 'Género', tipo: 'opcion', requerido: true,
        opciones: ['Hombre', 'Mujer'] },
      { clave: 'nacimiento', rotulo: 'Fecha de nacimiento', tipo: 'fecha', requerido: true },
      { clave: 'correo', rotulo: 'Correo electrónico vigente', tipo: 'correo', requerido: true,
        ayuda: 'Aquí se le avisará de cualquier asunto escolar. Revísalo bien.' },
    ],
  },

  {
    id: 'procedencia',
    titulo: 'Secundaria de procedencia',
    campos: [
      { clave: 'promedio', rotulo: 'Promedio de secundaria', tipo: 'numero', requerido: true,
        min: 6, max: 10, paso: 0.1, ayuda: 'Con un decimal. Por ejemplo: 8.4' },
      { clave: 'tipoSecundaria', rotulo: 'Tipo de secundaria', tipo: 'opcion', requerido: true,
        opciones: ['General', 'Técnica', 'Telesecundaria', 'Para trabajadores', 'CONAFE', 'Otra'] },
      { clave: 'sostenimiento', rotulo: 'Sostenimiento', tipo: 'opcion', requerido: true,
        opciones: ['Pública', 'Privada'] },
      { clave: 'nombreSecundaria', rotulo: 'Nombre de la secundaria', tipo: 'texto' },
    ],
  },

  {
    id: 'tutor',
    titulo: 'Padre, madre o tutor',
    nota: 'Quién es responsable del alumno ante la escuela.',
    campos: [
      { clave: 'tutorNombre', rotulo: 'Nombre completo del responsable', tipo: 'texto',
        requerido: true, ayuda: 'Comenzando por apellido paterno.' },
      { clave: 'parentesco', rotulo: 'Parentesco con el alumno', tipo: 'opcion', requerido: true,
        opciones: ['Madre', 'Padre', 'Abuela o abuelo', 'Tía o tío', 'Hermana o hermano',
                   'Tutor legal', 'Otro'] },
      { clave: 'telPadre', rotulo: 'Teléfono del padre', tipo: 'telefono' },
      { clave: 'telMadre', rotulo: 'Teléfono de la madre', tipo: 'telefono' },
      { clave: 'telTutor', rotulo: 'Teléfono del tutor', tipo: 'telefono' },
      { clave: 'telEmergencia', rotulo: 'Teléfono en caso de emergencia', tipo: 'telefono',
        requerido: true, ayuda: 'Puede ser uno de los anteriores, u otro distinto.' },
    ],
  },

  {
    id: 'familia',
    titulo: 'La familia',
    campos: [
      { clave: 'tipoFamilia', rotulo: 'Tipo de familia en la que vive el alumno',
        tipo: 'opcion', requerido: true,
        opciones: [
          'Nuclear (papá, mamá e hijos)',
          'Monoparental (solo papá o solo mamá)',
          'Extensa (con abuelos, tíos u otros familiares)',
          'Reconstituida (papá o mamá con nueva pareja)',
          'El alumno vive con otras personas',
          'Otra',
        ] },
      { clave: 'escolaridadMadre', rotulo: 'Último grado de estudios de la madre',
        tipo: 'opcion', opciones: ESCOLARIDAD },
      { clave: 'escolaridadPadre', rotulo: 'Último grado de estudios del padre',
        tipo: 'opcion', opciones: ESCOLARIDAD },
      { clave: 'ocupacionMadre', rotulo: 'Ocupación de la madre', tipo: 'texto' },
      { clave: 'ocupacionPadre', rotulo: 'Ocupación del padre', tipo: 'texto' },
      { clave: 'hermanos', rotulo: '¿Cuántos hermanos y hermanas tiene el alumno?',
        tipo: 'numero', min: 0, max: 20, paso: 1, requerido: true },
      { clave: 'seguridadSocial', rotulo: 'Atención de seguridad social que tiene el alumno',
        tipo: 'opcion', requerido: true,
        opciones: ['IMSS', 'ISSSTE', 'ISSSTEP', 'IMSS-Bienestar', 'Seguro médico privado',
                   'Ninguna', 'No sé'] },
    ],
  },

  {
    id: 'vivienda',
    titulo: 'La vivienda',
    campos: [
      { clave: 'casa', rotulo: 'La casa que habitan es', tipo: 'opcion', requerido: true,
        opciones: ['Propia', 'Rentada', 'Prestada', 'La están pagando (Infonavit, Fovissste)',
                   'Otra'] },
      { clave: 'habitantes', rotulo: '¿Cuántas personas habitan la vivienda?',
        tipo: 'numero', min: 1, max: 30, paso: 1, requerido: true },
      { clave: 'servicios', rotulo: 'Servicios con los que cuenta la vivienda',
        tipo: 'varias',
        opciones: ['Agua potable', 'Drenaje', 'Luz eléctrica', 'Gas', 'Internet',
                   'Recolección de basura', 'Calle pavimentada', 'Teléfono'] },
      { clave: 'automovil', rotulo: '¿Cuentan con automóvil propio?', tipo: 'opcion',
        opciones: SI_NO },
    ],
  },

  {
    id: 'economia',
    titulo: 'Economía familiar',
    nota: 'Esta sección es opcional. Sirve para gestionar becas y apoyos.',
    sensible: true,
    campos: [
      { clave: 'gastos', rotulo: 'Aproximadamente, ¿a cuánto ascienden los gastos familiares al mes?',
        tipo: 'opcion', sensible: true,
        opciones: ['Menos de $3,000', 'De $3,000 a $6,000', 'De $6,001 a $10,000',
                   'De $10,001 a $15,000', 'De $15,001 a $25,000', 'Más de $25,000',
                   'Prefiero no contestar'] },
      { clave: 'proveedores', rotulo: 'Número de personas que apoyan a la economía familiar',
        tipo: 'numero', min: 0, max: 15, paso: 1 },
      { clave: 'beca', rotulo: '¿Recibe el alumno algún tipo de beca o apoyo?',
        tipo: 'opcion',
        opciones: ['Beca Benito Juárez', 'Otra beca federal o estatal', 'Beca de la escuela',
                   'Apoyo de alguna asociación', 'Ninguna'] },
    ],
  },

  {
    id: 'situacion',
    titulo: 'Sobre el alumno',
    campos: [
      { clave: 'situacion', rotulo: 'Selecciona la situación en que se encuentra el alumno',
        tipo: 'opcion', requerido: true,
        opciones: ['Solo estudia', 'Estudia y trabaja', 'Estudia y ayuda en el negocio familiar',
                   'Estudia y cuida a un familiar', 'Otra'] },
      { clave: 'materias', rotulo: '¿Qué materias le agradan más al alumno?', tipo: 'varias',
        opciones: ['Matemáticas', 'Español y Literatura', 'Ciencias (Física, Química, Biología)',
                   'Historia y Ciencias Sociales', 'Inglés', 'Computación', 'Artes',
                   'Educación Física'] },
      { clave: 'actividades', rotulo: '¿Qué actividades prefiere realizar el alumno?',
        tipo: 'varias',
        opciones: ['Deportes', 'Música', 'Danza o baile', 'Dibujo o pintura', 'Teatro',
                   'Leer', 'Videojuegos', 'Redes sociales', 'Ayudar en casa',
                   'Actividades al aire libre'] },
      { clave: 'enfermedad', rotulo: '¿El alumno presenta alguna enfermedad o condición?',
        tipo: 'opcion', sensible: true,
        opciones: ['No', 'Sí', 'Prefiero no contestar'],
        ayuda: 'Sirve para que la escuela sepa cómo actuar ante una emergencia.' },
      { clave: 'enfermedadCual',
        rotulo: '¿Cuál es la enfermedad o condición, y qué tratamiento lleva?',
        tipo: 'texto largo', sensible: true, depende: { clave: 'enfermedad', valor: 'Sí' } },
      { clave: 'alergias', rotulo: '¿Es alérgico a algún medicamento o alimento?',
        tipo: 'texto', sensible: true,
        ayuda: 'Déjalo vacío si no aplica.' },
    ],
  },

  {
    id: 'comunidad',
    titulo: 'La comunidad donde viven',
    campos: [
      { clave: 'problema1', rotulo: 'Principal problema que enfrenta la comunidad',
        tipo: 'opcion', requerido: true, opciones: PROBLEMAS },
      { clave: 'problema2', rotulo: 'Segundo problema más frecuente',
        tipo: 'opcion', opciones: PROBLEMAS },
      { clave: 'problema3', rotulo: 'Tercer problema más frecuente',
        tipo: 'opcion', opciones: PROBLEMAS },
      { clave: 'problemaOtro', rotulo: 'Si consideras otro problema, menciónalo aquí',
        tipo: 'texto largo' },
      { clave: 'serviciosFaltan', rotulo: 'Marca si en tu comunidad falta alguno de estos servicios',
        tipo: 'varias',
        opciones: ['Agua potable', 'Drenaje', 'Luz eléctrica', 'Alumbrado público',
                   'Pavimentación', 'Recolección de basura', 'Transporte público',
                   'Centro de salud', 'Internet', 'Seguridad pública'] },
      { clave: 'recreacion',
        rotulo: '¿Existen espacios de recreación como parques, canchas o campos deportivos?',
        tipo: 'opcion', opciones: SI_NO },
      { clave: 'tradiciones',
        rotulo: '¿Realizan alguna tradición o costumbre donde participe la mayoría de los vecinos?',
        tipo: 'opcion', opciones: SI_NO },
      { clave: 'tradicionCual', rotulo: 'Menciona o explica la actividad que se realiza',
        tipo: 'texto largo', depende: { clave: 'tradiciones', valor: 'Sí' } },
    ],
  },

  {
    id: 'convivencia',
    titulo: 'Convivencia',
    nota: 'Esta sección es opcional y la lee únicamente el personal de la escuela. Sirve para dar acompañamiento a quien lo necesite.',
    sensible: true,
    campos: [
      { clave: 'alcoholCuadra', rotulo: 'En la cuadra donde viven, ¿hay personas que consumen alcohol o cigarro?',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'alcoholCasa', rotulo: 'En casa, ¿hay personas que consumen alcohol o cigarro?',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'drogasCuadra', rotulo: 'En la cuadra donde viven, ¿hay personas que consumen marihuana u otras drogas?',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'drogasCasa', rotulo: 'En casa, ¿hay personas que consumen marihuana u otras drogas?',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'peleasCuadra', rotulo: 'En la cuadra donde viven, ¿se presentan discusiones o peleas?',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'peleasCasa', rotulo: 'En casa, entre los miembros de la familia, ¿se presentan discusiones o peleas?',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'peleasIntensidad', rotulo: '¿Qué tan intensa llega a ser esa discusión o pelea?',
        tipo: 'opcion', sensible: true,
        opciones: ['Leve: se resuelve hablando', 'Moderada: hay gritos',
                   'Fuerte: hay insultos o amenazas', 'Muy fuerte: llega a los golpes',
                   'Prefiero no contestar'],
        depende: { clave: 'peleasCasa', valorNoEs: ['Nunca', 'Prefiero no contestar', ''] } },
    ],
  },

  {
    id: 'discriminacion',
    titulo: 'Discriminación en la comunidad',
    nota: 'Opcional. Ayuda a la escuela a planear sus talleres de convivencia.',
    sensible: true,
    campos: [
      { clave: 'machismo',
        rotulo: 'En su casa o comunidad, ¿se realizan prácticas machistas?',
        ayuda: 'Comportamientos y creencias que discriminan a las mujeres.',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'homofobia',
        rotulo: 'En su comunidad, ¿se realizan prácticas homofóbicas?',
        ayuda: 'Rechazo o discriminación por orientación sexual o identidad de género.',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'racismo',
        rotulo: 'En su comunidad, ¿se realizan prácticas racistas?',
        ayuda: 'Rechazo o discriminación por color de piel o cultura.',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
      { clave: 'clasismo',
        rotulo: 'En su comunidad, ¿se realizan prácticas clasistas?',
        ayuda: 'Rechazo o discriminación por nivel económico.',
        tipo: 'escala', opciones: FRECUENCIA, sensible: true },
    ],
  },
];

/** Todos los campos, aplanados, en el orden en que aparecen. */
export const CAMPOS = SECCIONES.flatMap((s) => s.campos);

/** Un campo condicionado solo cuenta si su condición se cumple ahora mismo. */
export function visible(campo, valores) {
  if (!campo.depende) return true;
  const actual = valores[campo.depende.clave] ?? '';
  if (campo.depende.valorNoEs) return !campo.depende.valorNoEs.includes(actual);
  return actual === campo.depende.valor;
}

/** Qué le falta a una sección para poder avanzar. Devuelve claves. */
export function faltantes(seccion, valores) {
  return seccion.campos
    .filter((c) => c.requerido && visible(c, valores))
    .filter((c) => {
      const v = valores[c.clave];
      return Array.isArray(v) ? v.length === 0 : v === undefined || String(v).trim() === '';
    })
    .map((c) => c.clave);
}

/** La CURP tiene una forma muy definida; casi todos los errores son dedazos. */
export function curpValida(s) {
  return /^[A-Z][AEIOUX][A-Z]{2}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(String(s).toUpperCase().trim());
}

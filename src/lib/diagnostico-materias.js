// Banco de reactivos de la evaluación diagnóstica, por grado y materia.
//
// Está aquí como datos y no escrito a mano dentro de un componente para que
// agregar una materia sea agregar un objeto a esta lista. La fuente es el
// documento institucional "Evaluaciones diagnósticas — Media Superior 2º y 3º".
//
// REGLAS DE ESTE ARCHIVO, para que los datos ya guardados no se vuelvan basura:
//
//   · `id` de materia y de reactivo NO se cambian después de aplicar la
//     evaluación. Son las llaves con las que se guarda cada respuesta; si las
//     cambias, los resultados viejos quedan huérfanos y no se pueden comparar.
//   · `correcta` es la letra de la opción. Las opciones se muestran en este
//     mismo orden, sin barajar, para que coincidan con el examen impreso y la
//     clave institucional se pueda cotejar sin traducir nada.
//   · Si una pregunta se retira, se marca aquí y se deja el id muerto; no se
//     reutiliza para otra pregunta distinta.

export const GRADOS = [
  {
    // Primer año NO tiene materias aquí: contesta el cuadernillo oficial de
    // ingreso (EDIEMS), que se muestra como PDF y no se transcribe. Por eso
    // lleva `cuadernillo` en vez de un tramo de esta lista. Ver
    // src/lib/cuadernillo-ediems.js.
    id: '1ero',
    nombre: 'Primer año',
    semestre: 'Primer semestre',
    cuadernillo: 'ediems-2026',
    reactivos: 88,
    descripcion: 'Cuadernillo oficial de ingreso: ciencias naturales, pensamiento crítico, matemáticas, ciencias sociales y lenguaje.',
  },
  {
    id: '2do',
    nombre: 'Segundo año',
    semestre: 'Tercer semestre',
    descripcion: 'Taller de Ciencias II, Lengua y Comunicación II e Inglés III.',
  },
  {
    id: '3ero',
    nombre: 'Tercer año',
    semestre: 'Quinto semestre',
    descripcion: 'Cultura Digital, Energía, Salud Integral, Sexualidad y Género, Derecho y Sociedad y Conciencia Histórica.',
  },
];

export const MATERIAS = {
  '2do': [
    {
      id: 'taller_ciencias_2',
      nombre: 'Taller de Ciencias II',
      instrucciones: 'Lee, analiza y elige la respuesta correcta.',
      preguntas: [
        {
          id: 'tc2_q1',
          texto: '¿Qué es un sistema?',
          opciones: [
            { clave: 'a', texto: 'Es un conjunto de partes interrelacionadas que forman un todo con un propósito o función común.' },
            { clave: 'b', texto: 'Es una magnitud física que permite realizar trabajo.' },
            { clave: 'c', texto: 'Cómo la energía se mueve y se transforma entre las distintas partes.' },
          ],
          correcta: 'a',
        },
        {
          id: 'tc2_q2',
          texto: '¿Qué es la energía?',
          opciones: [
            { clave: 'a', texto: 'Es un conjunto de partes interrelacionadas que forman un todo con un propósito o función común.' },
            { clave: 'b', texto: 'Es una magnitud física que permite realizar trabajo.' },
            { clave: 'c', texto: 'Cómo la energía se mueve y se transforma entre las distintas partes.' },
          ],
          correcta: 'b',
        },
        {
          id: 'tc2_q3',
          texto: '¿Qué es el flujo de energía?',
          opciones: [
            { clave: 'a', texto: 'Es un conjunto de partes interrelacionadas que forman un todo con un propósito o función común.' },
            { clave: 'b', texto: 'Es una magnitud física que permite realizar trabajo.' },
            { clave: 'c', texto: 'Cómo la energía se mueve y se transforma entre las distintas partes.' },
          ],
          correcta: 'c',
        },
        {
          id: 'tc2_q4',
          texto: 'Intercambian energía y/o materia con el entorno (por ejemplo, una casa o una planta).',
          opciones: [
            { clave: 'a', texto: 'Sistemas cerrados' },
            { clave: 'b', texto: 'Sistemas abiertos' },
            { clave: 'c', texto: 'Sistemas duales' },
          ],
          correcta: 'b',
        },
        {
          id: 'tc2_q5',
          texto: 'Intercambian solo energía (idealmente) o casi nada de materia. Son ejemplos teóricos: en la práctica, todos los sistemas intercambian algo de materia.',
          opciones: [
            { clave: 'a', texto: 'Sistemas cerrados' },
            { clave: 'b', texto: 'Sistemas abiertos' },
            { clave: 'c', texto: 'Sistemas duales' },
          ],
          correcta: 'a',
        },
      ],
    },
    {
      id: 'lengua_comunicacion_2',
      nombre: 'Lengua y Comunicación II',
      instrucciones: 'Selecciona la opción correcta.',
      preguntas: [
        {
          id: 'lc2_q1',
          texto: '¿Qué significa problematizar un tema?',
          opciones: [
            { clave: 'a', texto: 'Determinar si será útil para un ensayo.' },
            { clave: 'b', texto: 'Plantearlo como un problema.' },
            { clave: 'c', texto: 'Revisar la información que conocemos de él.' },
          ],
          correcta: 'b',
        },
        {
          id: 'lc2_q2',
          texto: 'Si un texto presenta un sesgo religioso, ¿de qué cualidad carece esta fuente de información?',
          opciones: [
            { clave: 'a', texto: 'Objetividad' },
            { clave: 'b', texto: 'Relevancia' },
            { clave: 'c', texto: 'Actualidad' },
          ],
          correcta: 'a',
        },
        {
          id: 'lc2_q3',
          texto: '¿En qué parte del ensayo se presenta el tema?',
          opciones: [
            { clave: 'a', texto: 'Introducción' },
            { clave: 'b', texto: 'Desarrollo' },
            { clave: 'c', texto: 'Conclusión' },
          ],
          correcta: 'a',
        },
        {
          id: 'lc2_q4',
          texto: '¿Cómo puedes encontrar un tema para tu ensayo?',
          opciones: [
            { clave: 'a', texto: 'Leyendo otros ensayos.' },
            { clave: 'b', texto: 'Explorando mis temas de interés.' },
            { clave: 'c', texto: 'Identificando los temas controversiales.' },
          ],
          correcta: 'c',
        },
        {
          id: 'lc2_q5',
          texto: '¿En qué etapa se corrige la ortografía?',
          opciones: [
            { clave: 'a', texto: 'Planeación' },
            { clave: 'b', texto: 'Revisión' },
            { clave: 'c', texto: 'Reconsideración del tema' },
          ],
          correcta: 'b',
        },
      ],
    },
    {
      id: 'ingles_3',
      nombre: 'Inglés III',
      instrucciones: 'Choose the correct option.',
      idioma: 'en',
      preguntas: [
        {
          id: 'ing3_q1',
          texto: 'Would you like _________ the concert this weekend?',
          opciones: [
            { clave: 'a', texto: 'to want to' },
            { clave: 'b', texto: 'to visit to' },
            { clave: 'c', texto: 'to go to' },
            { clave: 'd', texto: 'to play to' },
          ],
          correcta: 'c',
        },
        {
          id: 'ing3_q2',
          texto: 'Do you want _____________ the new restaurant with me?',
          opciones: [
            { clave: 'a', texto: 'to want to' },
            { clave: 'b', texto: 'to visit to' },
            { clave: 'c', texto: 'to go to' },
            { clave: 'd', texto: 'to play to' },
          ],
          correcta: 'c',
        },
        {
          id: 'ing3_q3',
          texto: 'Have you ever _________ Chinese food?',
          opciones: [
            { clave: 'a', texto: 'eating' },
            { clave: 'b', texto: 'eaten' },
            { clave: 'c', texto: 'eat' },
            { clave: 'd', texto: 'ate' },
          ],
          correcta: 'b',
        },
        {
          id: 'ing3_q4',
          texto: 'What __________ you doing yesterday morning?',
          opciones: [
            { clave: 'a', texto: 'were' },
            { clave: 'b', texto: 'is' },
            { clave: 'c', texto: 'was' },
            { clave: 'd', texto: 'are' },
          ],
          correcta: 'a',
        },
        {
          id: 'ing3_q5',
          texto: 'How long __________ you studied at Carlos Camacho Espíritu?',
          opciones: [
            { clave: 'a', texto: 'is' },
            { clave: 'b', texto: 'has' },
            { clave: 'c', texto: 'have' },
            { clave: 'd', texto: 'were' },
          ],
          correcta: 'c',
        },
      ],
    },
  ],

  '3ero': [
    {
      id: 'cultura_digital_3',
      nombre: 'Cultura Digital',
      instrucciones: 'Selecciona la opción correcta sobre uso de tecnologías, herramientas web y desarrollo.',
      preguntas: [
        {
          id: 'cd3_q1',
          texto: '¿Cuál es la función principal de un navegador web (web browser)?',
          opciones: [
            { clave: 'a', texto: 'Compilar código binario y gestionar el sistema operativo.' },
            { clave: 'b', texto: 'Interpretar documentos HTML, estilos CSS y scripts para mostrar sitios web interactivos.' },
            { clave: 'c', texto: 'Editar y renderizar videos de alta definición de forma local.' },
            { clave: 'd', texto: 'Proveer almacenamiento exclusivo en la nube sin conexión a la red.' },
          ],
          correcta: 'b',
        },
        {
          id: 'cd3_q2',
          texto: 'En la interacción mediante redes sociales y comunidades virtuales, ¿a qué se refiere el término «netiqueta»?',
          opciones: [
            { clave: 'a', texto: 'Al conjunto de normas de convivencia, respeto y cortesía aplicadas en entornos digitales.' },
            { clave: 'b', texto: 'A un protocolo de cifrado para contraseñas en navegadores web.' },
            { clave: 'c', texto: 'A la etiqueta publicitaria con la que las marcas categorizan a los usuarios.' },
            { clave: 'd', texto: 'Al software encargado de medir la velocidad de subida y bajada de datos.' },
          ],
          correcta: 'a',
        },
        {
          id: 'cd3_q3',
          texto: 'En el desarrollo de aplicaciones web, ¿cuál es el papel fundamental del lenguaje HTML?',
          opciones: [
            { clave: 'a', texto: 'Definir la interactividad dinámica y la conexión en tiempo real con bases de datos.' },
            { clave: 'b', texto: 'Estructurar el contenido de la página: títulos, secciones, párrafos y formularios.' },
            { clave: 'c', texto: 'Aplicar paletas de colores, animaciones visuales y tipografías adaptables.' },
            { clave: 'd', texto: 'Optimizar la velocidad de respuesta del servidor web.' },
          ],
          correcta: 'b',
        },
        {
          id: 'cd3_q4',
          texto: 'Si necesitas definir la apariencia visual, los colores de fondo, los espaciados y el diseño adaptable (responsive) de un sitio, ¿qué tecnología debes usar?',
          opciones: [
            { clave: 'a', texto: 'JavaScript' },
            { clave: 'b', texto: 'CSS (Cascading Style Sheets)' },
            { clave: 'c', texto: 'SQL' },
            { clave: 'd', texto: 'JSON' },
          ],
          correcta: 'b',
        },
        {
          id: 'cd3_q5',
          texto: '¿Cuál es el propósito central de JavaScript en una arquitectura web cliente-servidor?',
          opciones: [
            { clave: 'a', texto: 'Servir únicamente como procesador de texto para el navegador.' },
            { clave: 'b', texto: 'Proporcionar interactividad, manipular el DOM en tiempo real y gestionar los eventos del usuario.' },
            { clave: 'c', texto: 'Reemplazar la necesidad de usar etiquetas HTML en un documento.' },
            { clave: 'd', texto: 'Diseñar logotipos e interfaces gráficas vectoriales.' },
          ],
          correcta: 'b',
        },
      ],
    },
    {
      id: 'energia_vida_diaria_3',
      nombre: 'Energía en los Procesos de la Vida Diaria',
      instrucciones: 'Selecciona la opción correcta.',
      preguntas: [
        {
          id: 'env_q1',
          texto: 'Ley fundamental de la ciencia que dice que la materia no se crea ni se destruye, solo se transforma.',
          opciones: [
            { clave: 'a', texto: 'Ley de Coulomb' },
            { clave: 'b', texto: 'Ley de la gravitación' },
            { clave: 'c', texto: 'Ley de la conservación de la materia' },
            { clave: 'd', texto: 'Ley de la transformación' },
          ],
          correcta: 'c',
        },
        {
          id: 'env_q2',
          texto: 'Es un ejemplo de onda electromagnética:',
          opciones: [
            { clave: 'a', texto: 'Ondas sísmicas' },
            { clave: 'b', texto: 'Microondas' },
            { clave: 'c', texto: 'Ondas sonoras' },
            { clave: 'd', texto: 'Ondas magníficas' },
          ],
          correcta: 'b',
        },
        {
          id: 'env_q3',
          texto: '¿Qué proceso permite a las plantas capturar la energía del Sol?',
          opciones: [
            { clave: 'a', texto: 'Respiración' },
            { clave: 'b', texto: 'Combustión' },
            { clave: 'c', texto: 'Fotosíntesis' },
            { clave: 'd', texto: 'Digestión' },
          ],
          correcta: 'c',
        },
        {
          id: 'env_q4',
          texto: '¿Qué provoca el movimiento de las placas tectónicas?',
          opciones: [
            { clave: 'a', texto: 'El viento' },
            { clave: 'b', texto: 'El agua' },
            { clave: 'c', texto: 'El calor interno de la Tierra' },
            { clave: 'd', texto: 'La Luna' },
          ],
          correcta: 'c',
        },
        {
          id: 'env_q5',
          texto: '¿Qué fenómeno puede ocurrir cuando se libera energía en las placas tectónicas?',
          opciones: [
            { clave: 'a', texto: 'Lluvia' },
            { clave: 'b', texto: 'Sismo' },
            { clave: 'c', texto: 'Arcoíris' },
            { clave: 'd', texto: 'Niebla' },
          ],
          correcta: 'b',
        },
      ],
    },
    {
      id: 'salud_integral_3',
      nombre: 'Salud Integral I',
      instrucciones: 'Lee, analiza y elige la respuesta correcta.',
      preguntas: [
        {
          id: 'si3_q1',
          texto: 'Es uno de los pilares de la salud integral y se refiere al funcionamiento óptimo del cuerpo a través de prácticas que promueven el bienestar.',
          opciones: [
            { clave: 'a', texto: 'Salud mental' },
            { clave: 'b', texto: 'Salud física' },
            { clave: 'c', texto: 'Salud social' },
          ],
          correcta: 'b',
        },
        {
          id: 'si3_q2',
          texto: 'Es un componente clave de la salud integral que se enfoca en las relaciones con otras personas, la calidad de las interacciones y el sentido de pertenencia.',
          opciones: [
            { clave: 'a', texto: 'Salud mental' },
            { clave: 'b', texto: 'Salud física' },
            { clave: 'c', texto: 'Salud social' },
          ],
          correcta: 'c',
        },
        {
          id: 'si3_q3',
          texto: 'Es un componente esencial de la salud integral que engloba el bienestar emocional.',
          opciones: [
            { clave: 'a', texto: 'Salud mental' },
            { clave: 'b', texto: 'Salud física' },
            { clave: 'c', texto: 'Salud social' },
          ],
          correcta: 'a',
        },
        {
          id: 'si3_q4',
          texto: 'Factores biológicos y genéticos que impactan en la salud.',
          opciones: [
            { clave: 'a', texto: 'Rasgos fisiológicos y la edad' },
            { clave: 'b', texto: 'Cambios climáticos y eventos extremos' },
            { clave: 'c', texto: 'Calidad de los servicios y sus costos' },
          ],
          correcta: 'a',
        },
        {
          id: 'si3_q5',
          texto: 'Factores culturales y contextuales que impactan en la salud.',
          opciones: [
            { clave: 'a', texto: 'Rasgos fisiológicos y la edad' },
            { clave: 'b', texto: 'Cambios climáticos y eventos extremos' },
            { clave: 'c', texto: 'Calidad de los servicios y sus costos' },
          ],
          correcta: 'c',
        },
      ],
    },
    {
      id: 'sexualidad_genero_3',
      nombre: 'Sexualidad y Género',
      instrucciones: 'Lee, analiza y elige la respuesta correcta.',
      preguntas: [
        {
          id: 'sg3_q1',
          texto: '¿Cuál de las siguientes afirmaciones es más incluyente respecto al género?',
          opciones: [
            { clave: 'a', texto: 'Solo hay dos géneros: hombre y mujer.' },
            { clave: 'b', texto: 'El género es un espectro y las personas pueden identificarse de muchas maneras.' },
            { clave: 'c', texto: 'El género no es relevante para la salud.' },
          ],
          correcta: 'b',
        },
        {
          id: 'sg3_q2',
          texto: '¿Qué acción promueve una relación respetuosa de género en la escuela?',
          opciones: [
            { clave: 'a', texto: 'Evitar hablar sobre las diferencias de género.' },
            { clave: 'b', texto: 'Escuchar y validar las experiencias de otras personas, sin estereotipos.' },
            { clave: 'c', texto: 'Juzgar a quienes no cumplen con ciertos roles de género.' },
          ],
          correcta: 'b',
        },
        {
          id: 'sg3_q3',
          // Las dos preguntas siguientes se leen sobre este caso. Va como
          // `contexto` y no metido en el enunciado para que se muestre una vez,
          // en un recuadro aparte, como en el examen impreso.
          contexto: 'Alex, asignado como varón al nacer, se identifica como persona no binaria y prefiere pronombres neutros. En clase, un compañero insiste en usar pronombres masculinos y afirma que «todos deben ser como él».',
          texto: '¿Cuál es la razón principal para respetar la identidad de género y los pronombres que elige una persona?',
          opciones: [
            { clave: 'a', texto: 'Para evitar conflictos.' },
            { clave: 'b', texto: 'Para mantener la armonía sin cuestionar ideas.' },
            { clave: 'c', texto: 'Para reconocer la dignidad y la autonomía de la persona.' },
            { clave: 'd', texto: 'Para cumplir una norma burocrática.' },
          ],
          correcta: 'c',
        },
        {
          id: 'sg3_q4',
          contexto: 'Alex, asignado como varón al nacer, se identifica como persona no binaria y prefiere pronombres neutros. En clase, un compañero insiste en usar pronombres masculinos y afirma que «todos deben ser como él».',
          texto: '¿Qué acción es la más adecuada para la escuela ante esta situación?',
          opciones: [
            { clave: 'a', texto: 'Ignorar el incidente.' },
            { clave: 'b', texto: 'Reforzar las políticas de inclusión y apoyar a la persona afectada.' },
            { clave: 'c', texto: 'Castigar al estudiante que no respeta los pronombres.' },
            { clave: 'd', texto: 'Prohibir las conversaciones sobre género.' },
          ],
          correcta: 'b',
        },
        {
          id: 'sg3_q5',
          texto: '¿Qué es la identidad de género?',
          opciones: [
            { clave: 'a', texto: 'El conjunto de características biológicas con las que nace una persona.' },
            { clave: 'b', texto: 'La forma en que una persona se siente y se identifica internamente respecto a su género.' },
            { clave: 'c', texto: 'El rol de género que la sociedad espera de alguien.' },
            { clave: 'd', texto: 'La orientación sexual de una persona.' },
          ],
          correcta: 'b',
        },
      ],
    },
    {
      id: 'derecho_sociedad_3',
      nombre: 'Derecho y Sociedad I',
      instrucciones: 'Lee, analiza y elige la respuesta correcta.',
      preguntas: [
        {
          id: 'ds3_q1',
          texto: 'El derecho estudia:',
          opciones: [
            { clave: 'a', texto: 'Normas, instituciones, procesos de producción normativa y sus impactos en la convivencia social.' },
            { clave: 'b', texto: 'La combinación de métodos empíricos.' },
            { clave: 'c', texto: 'Las normas jurídicas exclusivamente teóricas.' },
          ],
          correcta: 'a',
        },
        {
          id: 'ds3_q2',
          texto: 'Se le consideraba la «ley del talión»:',
          opciones: [
            { clave: 'a', texto: 'Cilindro de Ciro' },
            { clave: 'b', texto: 'Código de Hammurabi' },
            { clave: 'c', texto: 'Corpus Iuris Civilis' },
          ],
          correcta: 'b',
        },
        {
          id: 'ds3_q3',
          texto: 'Es una regla de conducta creada, reconocida y exigida por una autoridad pública competente, cuyo cumplimiento puede obligarse mediante la coerción del Estado.',
          opciones: [
            { clave: 'a', texto: 'Normas jurídicas' },
            { clave: 'b', texto: 'Normas morales' },
            { clave: 'c', texto: 'Normas sociales' },
          ],
          correcta: 'a',
        },
        {
          id: 'ds3_q4',
          texto: 'Su incumplimiento no constituye un delito, pero sí puede traer consecuencias negativas por parte de la sociedad, como el rechazo o incluso la hostilidad.',
          opciones: [
            { clave: 'a', texto: 'Normas jurídicas' },
            { clave: 'b', texto: 'Normas morales' },
            { clave: 'c', texto: 'Normas sociales' },
          ],
          correcta: 'c',
        },
        {
          id: 'ds3_q5',
          texto: '¿Quién figura típicamente como jefe del poder Ejecutivo?',
          opciones: [
            { clave: 'a', texto: 'El presidente o el alcalde' },
            { clave: 'b', texto: 'El presidente del Congreso' },
            { clave: 'c', texto: 'El juez supremo' },
            { clave: 'd', texto: 'El defensor del pueblo' },
          ],
          correcta: 'a',
        },
      ],
    },
    {
      id: 'conciencia_historica_3',
      nombre: 'Conciencia Histórica II',
      instrucciones: 'Selecciona la opción correcta.',
      preguntas: [
        {
          id: 'ch3_q1',
          texto: 'Nombrado por el rey de España, concentraba el poder político y militar, pero respondía a los intereses de la metrópoli y no a las necesidades locales.',
          opciones: [
            { clave: 'a', texto: 'Criollos' },
            { clave: 'b', texto: 'Sistema judicial' },
            { clave: 'c', texto: 'Iglesia' },
            { clave: 'd', texto: 'Virrey' },
          ],
          correcta: 'd',
        },
        {
          id: 'ch3_q2',
          texto: 'Rousseau planteó que el poder político debía basarse en un pacto entre gobernantes y gobernados. A ese planteamiento se le llama:',
          opciones: [
            { clave: 'a', texto: 'Ilustración' },
            { clave: 'b', texto: 'Contrato social' },
            { clave: 'c', texto: 'Separación de poderes' },
            { clave: 'd', texto: 'Pensamiento crítico' },
          ],
          correcta: 'b',
        },
        {
          id: 'ch3_q3',
          texto: 'Orden religiosa expulsada durante las reformas borbónicas.',
          opciones: [
            { clave: 'a', texto: 'Franciscanos' },
            { clave: 'b', texto: 'Carmelitas' },
            { clave: 'c', texto: 'Jesuitas' },
            { clave: 'd', texto: 'Musulmanes' },
          ],
          correcta: 'c',
        },
        {
          id: 'ch3_q4',
          texto: 'Personas con mezcla racial (mestizos, mulatos y otros). Trabajaban como artesanos, pequeños comerciantes, capataces o soldados.',
          opciones: [
            { clave: 'a', texto: 'Criollos' },
            { clave: 'b', texto: 'Peninsulares' },
            { clave: 'c', texto: 'Castas' },
            { clave: 'd', texto: 'Indígenas y esclavos' },
          ],
          correcta: 'c',
        },
        {
          id: 'ch3_q5',
          texto: 'Hecho que propició la oportunidad para que las colonias buscaran su independencia.',
          opciones: [
            { clave: 'a', texto: 'La invasión francesa a España' },
            { clave: 'b', texto: 'La invasión francesa a México' },
            { clave: 'c', texto: 'La separación de poderes' },
            { clave: 'd', texto: 'La independencia de Estados Unidos' },
          ],
          correcta: 'a',
        },
        {
          id: 'ch3_q6',
          texto: 'Poseía poder e influencia y estaba controlada en sus altos puestos por clérigos peninsulares, aunque muchos sacerdotes criollos —como Hidalgo y Morelos— simpatizaban con las ideas de cambio.',
          opciones: [
            { clave: 'a', texto: 'Criollos' },
            { clave: 'b', texto: 'Sistema judicial' },
            { clave: 'c', texto: 'Iglesia' },
            { clave: 'd', texto: 'Virrey' },
          ],
          correcta: 'c',
        },
      ],
    },
  ],
};

/** Todas las preguntas de un grado, en orden de materia. */
export function preguntasDe(grado) {
  return (MATERIAS[grado] ?? []).flatMap((m) =>
    m.preguntas.map((p) => ({ ...p, materia: m.id, materiaNombre: m.nombre })),
  );
}

/** Cuántos reactivos tiene un grado. Sirve para avisarle al alumno cuánto falta.
 *  Primer año no está en MATERIAS —usa el cuadernillo en PDF—, así que su
 *  cuenta viene declarada en GRADOS. */
export function totalDe(grado) {
  const g = GRADOS.find((x) => x.id === grado);
  if (g?.cuadernillo) return g.reactivos;
  return (MATERIAS[grado] ?? []).reduce((s, m) => s + m.preguntas.length, 0);
}

/** ¿Este grado se evalúa con el cuadernillo en PDF en lugar de con MATERIAS? */
export function usaCuadernillo(grado) {
  return Boolean(GRADOS.find((x) => x.id === grado)?.cuadernillo);
}

/**
 * Califica. `respuestas` es {idPregunta: 'a'|'b'|...}; lo que no venga cuenta
 * como error, que es lo que hace un examen de opción múltiple: no contestar no
 * es lo mismo que no haber preguntado.
 */
export function calificar(grado, respuestas) {
  const materias = {};
  let aciertos = 0;
  let total = 0;

  for (const m of MATERIAS[grado] ?? []) {
    let ok = 0;
    for (const p of m.preguntas) {
      if (respuestas[p.id] === p.correcta) ok++;
    }
    materias[m.id] = { nombre: m.nombre, ok, total: m.preguntas.length };
    aciertos += ok;
    total += m.preguntas.length;
  }

  return {
    grado,
    aciertos,
    total,
    porcentaje: total ? Math.round((aciertos / total) * 100) : 0,
    materias,
  };
}

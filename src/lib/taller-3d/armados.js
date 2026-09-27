// Qué se arma en el taller 3D del Módulo 1.1 y en qué orden.
//
// Cada paso es una pieza que el alumno arrastra hasta su lugar. El motor
// (motor.js) solo sabe mover cosas y comparar distancias; todo lo que es
// contenido —nombre, para qué sirve, qué hay que instalar antes y por qué—
// vive aquí, para poder corregirlo sin tocar el 3D.
//
// Campos de un paso:
//   id        identifica el LUGAR donde va la pieza (la ranura).
//   tipo      piezas intercambiables comparten tipo (las dos RAM entran en
//             cualquiera de las dos ranuras). Si falta, es igual al id.
//   modelo    nombre de la función en modelos.js que dibuja la pieza.
//   en        a qué se sujeta al instalarse: 'gabinete', 'laptop' o 'mundo'.
//   pos, rot  dónde queda, en coordenadas de ese padre (rot en radianes).
//   bandeja   [x, z] donde espera la pieza sobre la mesa al empezar.
//   rotBandeja  giro distinto mientras espera (si no, el mismo que tendrá
//             instalada, para que el alumno la vea ya "en su postura").
//   requiere  ids de ranuras que deben estar ocupadas antes.
//   motivo    lo que se le dice al alumno si se adelanta. Siempre explica
//             el porqué, no solo el "todavía no".
//   radio     qué tan cerca hay que soltarla para que encaje.
//   cable     si al instalarse se dibuja un cable, de dónde a dónde.
//   ocultar   la pieza desaparece al conectarse (los rollos de cable).
//
// Los textos no inventan cifras: son hechos generales que cualquier manual de
// ensamble confirma. Ver la memoria "contenido fabricado" del proyecto.

const INTERNOS_PC = ['psu', 'placa', 'cpu', 'disipador', 'ram1', 'ram2', 'm2', 'gpu', 'hdd'];
const INTERNOS_LAPTOP = ['placa', 'ventilador', 'ram', 'ssd', 'bateria'];

export const ARMADOS = {
  escritorio: {
    id: 'escritorio',
    nombre: 'PC de escritorio',
    titulo: 'tu PC de escritorio',
    alturaArrastre: 3.1,
    regleta: [7.8, -4.4],
    // Mientras se arma, el gabinete está acostado con el costado abierto hacia
    // arriba, como lo pone un técnico. Al cerrar la tapa se pone de pie.
    gabinete: {
      acostado: { pos: [1.0, 1.05, -0.8], rotY: 0, rotZ: Math.PI / 2 },
      parado: { pos: [5.2, 0, -2.4], rotY: -0.5, rotZ: 0 },
    },
    fases: {
      armado: { objetivo: [0.4, 0.6, 0.2], ancho: 19, ladoMovil: true },
      escritorio: { objetivo: [0.3, 0.8, 0.3], ancho: 21, ladoMovil: true },
      final: { objetivo: [2.6, 1.8, -2.4], ancho: 13, anchoMovil: 10 },
    },
    fijos: {
      gabinete: {
        nombre: 'Gabinete',
        categoria: 'Estructura',
        funcion: 'La caja que sostiene y protege todo. Tiene los huecos para los puertos traseros, las bahías para discos y las entradas y salidas de aire.',
        dato: 'Los tornillos dorados del fondo se llaman separadores (standoffs): levantan la placa madre para que no toque el metal.',
      },
      regleta: {
        nombre: 'Regleta / multicontacto',
        categoria: 'Energía',
        funcion: 'Toma de corriente del escritorio.',
        dato: 'Un regulador o un no-break protegen al equipo de apagones y picos de voltaje; una regleta sencilla no.',
      },
    },
    pasos: [
      {
        id: 'psu', modelo: 'psu', nombre: 'Fuente de poder', categoria: 'Energía',
        en: 'gabinete', pos: [0, 0.53, -1.25], bandeja: [6.9, -2.3], radio: 0.9,
        funcion: 'Convierte la corriente alterna del enchufe (127 V en México) en corriente directa de 12, 5 y 3.3 V, que es la que usan los componentes.',
        dato: 'Si una fuente de mala calidad falla, puede dañar todo lo demás. Es la pieza en la que menos conviene ahorrar.',
        requiere: [],
      },
      {
        id: 'placa', modelo: 'placaMadre', nombre: 'Placa madre', categoria: 'Comunicación',
        en: 'gabinete', pos: [-0.92, 2.85, -0.45], bandeja: [3.9, -1.5], radio: 1.1,
        funcion: 'El circuito principal: conecta todas las piezas entre sí por medio de sus buses y guarda el firmware (UEFI/BIOS) que arranca el equipo.',
        dato: 'Se atornilla sobre separadores metálicos para que sus soldaduras no toquen el gabinete y hagan corto.',
        requiere: [],
      },
      {
        id: 'cpu', modelo: 'cpu', nombre: 'Procesador (CPU)', categoria: 'Procesamiento',
        en: 'gabinete', pos: [-0.86, 3.65, -0.85], bandeja: [6.4, -0.2], radio: 0.6,
        funcion: 'Ejecuta las instrucciones de los programas en el ciclo buscar–decodificar–ejecutar, miles de millones de veces por segundo.',
        dato: 'Entra en una sola posición: el triángulo dorado de una esquina coincide con el del socket. Nunca se fuerza.',
        requiere: ['placa'],
        motivo: 'El procesador va montado en el socket de la placa madre. Instala primero la placa.',
      },
      {
        id: 'disipador', modelo: 'disipador', nombre: 'Disipador con ventilador', categoria: 'Enfriamiento',
        en: 'gabinete', pos: [-0.56, 3.65, -0.85], bandeja: [7.7, 0.6], radio: 0.7,
        funcion: 'Saca el calor del procesador. Entre los dos va una capa delgada de pasta térmica, que rellena las imperfecciones microscópicas del metal.',
        dato: 'Un procesador sin disipador se calienta tanto en segundos que el equipo se apaga solo para protegerse.',
        requiere: ['cpu'],
        motivo: 'El disipador va ENCIMA del procesador. Sin procesador no hay nada que enfriar.',
      },
      {
        id: 'ram1', tipo: 'ram', modelo: 'ram', nombre: 'Memoria RAM', categoria: 'Memoria',
        en: 'gabinete', pos: [-0.72, 3.55, 0.05], bandeja: [2.9, 1.5], radio: 0.45,
        funcion: 'Memoria de trabajo: guarda los programas y datos que se están usando en este momento. Es volátil: al apagar, se borra.',
        dato: 'Tiene una muesca que no está en el centro: solo entra en un sentido.',
        requiere: ['placa'],
        motivo: 'La RAM se inserta en las ranuras de la placa madre. Instala primero la placa.',
      },
      {
        id: 'ram2', tipo: 'ram', modelo: 'ram', nombre: 'Memoria RAM', categoria: 'Memoria',
        en: 'gabinete', pos: [-0.72, 3.55, 0.27], bandeja: [2.9, 2.4], radio: 0.45,
        funcion: 'Memoria de trabajo: guarda los programas y datos que se están usando en este momento. Es volátil: al apagar, se borra.',
        dato: 'Dos módulos iguales trabajan en "doble canal": el procesador lee de los dos a la vez.',
        requiere: ['placa'],
        motivo: 'La RAM se inserta en las ranuras de la placa madre. Instala primero la placa.',
      },
      {
        id: 'm2', modelo: 'ssdM2', nombre: 'SSD NVMe M.2', categoria: 'Almacenamiento',
        en: 'gabinete', pos: [-0.87, 2.95, -0.7], bandeja: [4.6, 1.8], radio: 0.5,
        funcion: 'Guarda el sistema operativo y tus archivos aunque se apague el equipo. Es memoria flash: no tiene partes que se muevan.',
        dato: 'Se conecta directo a la placa, sin cables, y se sujeta con un solo tornillo.',
        requiere: ['placa'],
        motivo: 'El SSD M.2 se conecta directo a una ranura de la placa madre. Instala primero la placa.',
      },
      {
        id: 'gpu', modelo: 'gpu', nombre: 'Tarjeta de video (GPU)', categoria: 'Salida',
        en: 'gabinete', pos: [-0.3, 2.08, -0.5], bandeja: [8.2, -2.2], radio: 0.9,
        funcion: 'Procesa las imágenes y las manda al monitor. Tiene su propio procesador gráfico y su propia memoria (VRAM).',
        dato: 'Con tarjeta de video instalada, el monitor se conecta a ella y no a los puertos de video de la placa.',
        requiere: ['placa'],
        motivo: 'La tarjeta de video se inserta en la ranura PCI Express de la placa madre. Instala primero la placa.',
      },
      {
        id: 'hdd', modelo: 'hdd', nombre: 'Disco duro (HDD)', categoria: 'Almacenamiento',
        en: 'gabinete', pos: [0.1, 0.62, 1.3], bandeja: [6.0, 1.9], radio: 0.8,
        funcion: 'Almacenamiento masivo en platos magnéticos que giran. Más lento que el SSD, pero más barato por cada gigabyte.',
        dato: 'Por eso muchos equipos llevan los dos: el SSD para el sistema, el disco duro para guardar mucho.',
        requiere: [],
      },
      {
        id: 'tapa', modelo: 'tapaLateral', nombre: 'Tapa lateral', categoria: 'Estructura',
        en: 'gabinete', pos: [1.04, 2.3, 0], bandeja: [-6.2, -0.4], radio: 1.3,
        funcion: 'Cierra el gabinete: protege del polvo y hace que el aire circule en la dirección correcta.',
        dato: 'Con la tapa puesta, el gabinete se pone de pie y pasas a conectar los periféricos.',
        requiere: INTERNOS_PC,
        motivo: 'Antes de cerrar, todas las piezas internas deben estar en su lugar. Revisa la lista.',
        alInstalar: 'levantar',
      },
      {
        id: 'monitor', modelo: 'monitor', nombre: 'Monitor', categoria: 'Salida',
        en: 'mundo', pos: [0.4, 0, -3.1], bandeja: [-6.4, -4.1], radio: 1.4,
        funcion: 'Dispositivo de salida: muestra la imagen que le manda la tarjeta de video.',
        dato: 'La resolución es cuántos puntos (píxeles) tiene la pantalla; 1920 × 1080 es la llamada Full HD.',
        requiere: ['tapa'],
        motivo: 'Primero cierra el gabinete con la tapa lateral para ponerlo de pie en el escritorio.',
      },
      {
        id: 'cableVideo', modelo: 'cableHdmi', nombre: 'Cable HDMI', categoria: 'Conexión',
        // Se suelta sobre el gabinete (su centro); el cable se dibuja desde la
        // salida de la tarjeta de video, atrás.
        en: 'gabinete', pos: [0, 2.3, 0], rotBandeja: [0, 0, 0], bandeja: [-1.6, 3.9], radio: 2.3,
        funcion: 'Lleva la imagen y el sonido de la tarjeta de video al monitor.',
        dato: 'Suéltalo sobre el gabinete: se conecta atrás, en la salida de la tarjeta de video, no en la de la placa.',
        requiere: ['monitor', 'gpu'],
        motivo: 'Coloca primero el monitor en el escritorio: el cable va de la tarjeta de video al monitor.',
        cable: { a: { en: 'gabinete', pos: [-0.3, 2.0, -2.25] }, b: { en: 'pieza', id: 'monitor', pos: [0.9, 1.4, -0.28] }, color: 0x16181d },
        ocultar: true,
      },
      {
        id: 'teclado', modelo: 'teclado', nombre: 'Teclado', categoria: 'Entrada',
        en: 'mundo', pos: [0.4, 0, 0.7], bandeja: [-5.6, 3.6], radio: 1.3,
        funcion: 'Dispositivo de entrada: convierte cada tecla que presionas en un código que la computadora entiende.',
        dato: 'Se conecta por USB, que además de datos le da la energía que necesita.',
        requiere: ['tapa'],
        motivo: 'Primero cierra el gabinete con la tapa lateral.',
        cable: { a: { en: 'pieza', id: 'teclado', pos: [0.6, 0.08, -0.62] }, b: { en: 'gabinete', pos: [0.55, 4.62, 1.75] }, color: 0x2a2e36 },
      },
      {
        id: 'mouse', modelo: 'mouse', nombre: 'Mouse', categoria: 'Entrada',
        en: 'mundo', pos: [3.1, 0, 0.9], bandeja: [-3.3, 3.8], radio: 0.9,
        funcion: 'Dispositivo de entrada: un sensor óptico mide cuánto se mueve sobre la mesa y lo traduce en el movimiento del puntero.',
        dato: 'Los botones y la rueda son interruptores; el sensor es una pequeña cámara que toma miles de fotos por segundo de la superficie.',
        requiere: ['tapa'],
        motivo: 'Primero cierra el gabinete con la tapa lateral.',
        cable: { a: { en: 'pieza', id: 'mouse', pos: [0, 0.05, -0.3] }, b: { en: 'gabinete', pos: [0.3, 4.62, 1.75] }, color: 0x2a2e36 },
      },
      {
        id: 'corriente', modelo: 'cableCorriente', nombre: 'Cable de corriente', categoria: 'Energía',
        en: 'gabinete', pos: [0, 2.3, 0], rotBandeja: [0, 0, 0], bandeja: [0.2, 3.9], radio: 2.3,
        funcion: 'Conecta la fuente de poder a la toma de corriente.',
        dato: 'Suéltalo sobre el gabinete. Se conecta al final: nunca se arma ni se desarma un equipo enchufado.',
        requiere: ['psu', 'tapa', 'monitor', 'cableVideo', 'teclado', 'mouse'],
        motivo: 'Por seguridad, la corriente es lo ÚLTIMO que se conecta: primero termina de conectar todo lo demás.',
        cable: { a: { en: 'gabinete', pos: [0.35, 0.53, -2.25] }, b: { en: 'regleta', pos: [-0.55, 0.26, 0] }, color: 0x101114 },
        ocultar: true,
      },
    ],
    post: [
      'UEFI  ·  Autoprueba de encendido (POST)',
      '',
      'Procesador ..................... OK',
      'Memoria RAM: 2 módulos ......... OK',
      'Tarjeta de video ............... OK',
      'SSD NVMe ....................... detectado',
      'Disco duro ..................... detectado',
      'Teclado y mouse USB ............ detectados',
      '',
      'Buscando sistema operativo en el SSD...',
      'Entregando el control al sistema operativo.',
    ],
  },

  laptop: {
    id: 'laptop',
    nombre: 'Laptop',
    titulo: 'tu laptop',
    alturaArrastre: 1.7,
    regleta: [-6.6, -3.6],
    laptop: { pos: [-1.5, 0, -0.8] },
    fases: {
      armado: { objetivo: [-0.6, 0.3, 0.5], ancho: 20, ladoMovil: true },
      final: { objetivo: [-1.5, 1.2, -0.8], ancho: 11, anchoMovil: 8 },
    },
    fijos: {
      laptop: {
        nombre: 'Chasis de la laptop',
        categoria: 'Estructura',
        funcion: 'La carcasa inferior. Todo va apretado y a la medida: por eso en una laptop casi nada es intercambiable.',
        dato: 'Por los costados salen los puertos: USB, USB-C, audio y, en algunos modelos, HDMI.',
      },
      regleta: {
        nombre: 'Regleta / multicontacto',
        categoria: 'Energía',
        funcion: 'Toma de corriente del escritorio.',
        dato: 'Con la batería cargada, la laptop funciona sin estar conectada.',
      },
    },
    pasos: [
      {
        id: 'placa', modelo: 'placaLaptop', nombre: 'Placa madre (con CPU soldado)', categoria: 'Procesamiento',
        en: 'laptop', pos: [-0.5, 0.09, -0.95], bandeja: [4.4, -2.4], radio: 0.9,
        funcion: 'En la laptop, la placa madre ya trae el procesador soldado: no se puede cambiar ni mejorar después.',
        dato: 'Ese cuadro plateado es el procesador. En una PC de escritorio va en un socket y se puede reemplazar.',
        requiere: [],
      },
      {
        id: 'ventilador', modelo: 'ventiladorLaptop', nombre: 'Ventilador y tubo de calor', categoria: 'Enfriamiento',
        en: 'laptop', pos: [-2.05, 0.18, -1.0], bandeja: [3.1, 0.9], radio: 0.7,
        funcion: 'El tubo de cobre (heatpipe) lleva el calor del procesador al ventilador, que lo saca por la rejilla.',
        dato: 'Si tapas la rejilla con una cobija o con las piernas, la laptop se calienta y se vuelve lenta a propósito para no dañarse.',
        requiere: ['placa'],
        motivo: 'La placa de cobre del ventilador se apoya sobre el procesador. Instala primero la placa madre.',
      },
      {
        id: 'ram', modelo: 'soDimm', nombre: 'Memoria RAM SO-DIMM', categoria: 'Memoria',
        en: 'laptop', pos: [0.4, 0.14, -1.0], bandeja: [6.2, 0.9], radio: 0.5,
        funcion: 'La versión compacta de la RAM de escritorio. Misma función: memoria de trabajo que se borra al apagar.',
        dato: 'En muchas laptops delgadas la RAM viene soldada a la placa y no se puede ampliar. Conviene revisarlo antes de comprar.',
        requiere: ['placa'],
        motivo: 'La RAM se inserta en la ranura de la placa madre. Instala primero la placa.',
      },
      {
        id: 'ssd', modelo: 'ssdLaptop', nombre: 'SSD M.2', categoria: 'Almacenamiento',
        en: 'laptop', pos: [-0.2, 0.13, -0.5], bandeja: [7.6, 0.9], radio: 0.45,
        funcion: 'Guarda el sistema operativo y tus archivos sin necesitar energía. Es el mismo tipo de pieza que en la PC de escritorio.',
        dato: 'Es de los pocos componentes que casi siempre se puede cambiar en una laptop.',
        requiere: ['placa'],
        motivo: 'El SSD se conecta a una ranura de la placa madre. Instala primero la placa.',
      },
      {
        id: 'bateria', modelo: 'bateria', nombre: 'Batería', categoria: 'Energía',
        en: 'laptop', pos: [0, 0.12, 0.95], bandeja: [4.9, -0.5], radio: 0.9,
        funcion: 'Guarda energía química para que la laptop funcione sin cable. Es de iones de litio.',
        dato: 'Al abrir una laptop real, lo PRIMERO que se desconecta es la batería. Si una batería se infla, ya no se usa.',
        requiere: ['placa'],
        motivo: 'El conector de la batería va a la placa madre. Instala primero la placa.',
      },
      {
        id: 'reposamanos', modelo: 'reposamanos', nombre: 'Cubierta con teclado', categoria: 'Entrada',
        en: 'laptop', pos: [0, 0.37, 0], bandeja: [-1.5, 3.5], radio: 1.2,
        funcion: 'La cubierta superior, con el teclado integrado. Un teclado de laptop no se desconecta como uno de escritorio: va pegado a la cubierta.',
        dato: 'Bajo cada tecla hay una membrana que cierra un circuito al presionarla.',
        requiere: INTERNOS_LAPTOP,
        motivo: 'La cubierta tapa todo el interior. Antes, instala todas las piezas internas: revisa la lista.',
      },
      {
        id: 'trackpad', modelo: 'trackpad', nombre: 'Trackpad', categoria: 'Entrada',
        en: 'laptop', pos: [0, 0.41, 1.0], bandeja: [-6.0, 0.2], radio: 0.6,
        funcion: 'Sustituye al mouse: detecta la posición del dedo midiendo pequeños cambios eléctricos (capacitancia) en su superficie.',
        dato: 'Por eso no funciona con guantes ni con la uña: necesita la piel.',
        requiere: ['reposamanos'],
        motivo: 'El trackpad va en el hueco de la cubierta superior. Coloca primero la cubierta con teclado.',
      },
      {
        id: 'pantalla', modelo: 'pantallaLaptop', nombre: 'Pantalla', categoria: 'Salida',
        en: 'laptop', pos: [0, 0.4, -1.8], rot: [-1.92, 0, 0], rotBandeja: [0, 0, 0], bandeja: [4.7, 2.2], radio: 1.3,
        funcion: 'Panel LCD u OLED unido por bisagras. Su cable de video pasa por dentro de la bisagra hasta la placa madre.',
        dato: 'Suéltala sobre la parte de atrás de la laptop, donde están las bisagras.',
        requiere: ['reposamanos'],
        motivo: 'La pantalla se sujeta a las bisagras cuando la laptop ya está cerrada por arriba. Coloca primero la cubierta con teclado.',
      },
      {
        id: 'cargador', modelo: 'cargador', nombre: 'Cargador', categoria: 'Energía',
        en: 'laptop', pos: [-2.9, 0.2, -0.9], rotBandeja: [0, 0, 0], bandeja: [-6.0, 2.3], radio: 1.3,
        funcion: 'Convierte la corriente alterna del enchufe en corriente directa para cargar la batería.',
        dato: 'Se conecta al final, con la laptop ya cerrada y armada.',
        requiere: ['placa', 'ventilador', 'ram', 'ssd', 'bateria', 'reposamanos', 'trackpad', 'pantalla'],
        motivo: 'Por seguridad, la corriente es lo ÚLTIMO que se conecta: primero termina de armar la laptop.',
        cable: { a: { en: 'laptop', pos: [-2.63, 0.2, -0.9] }, b: { en: 'regleta', pos: [-0.55, 0.26, 0] }, color: 0x16181d },
        ocultar: true,
      },
    ],
    post: [
      'UEFI  ·  Autoprueba de encendido (POST)',
      '',
      'Procesador ..................... OK',
      'Memoria RAM .................... OK',
      'Batería ........................ cargando',
      'SSD M.2 ........................ detectado',
      'Teclado y trackpad ............. detectados',
      '',
      'Buscando sistema operativo en el SSD...',
      'Entregando el control al sistema operativo.',
    ],
  },
};

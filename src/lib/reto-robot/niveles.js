/* Niveles del reto «Programa a Chispa». Van en el orden del Módulo 2.4:
 * secuencia → for → funciones → if → if/else → while → variables → lógica.
 *
 * `crear()` arma el mapa cada vez que el alumno pulsa Ejecutar. Los niveles
 * con azar cambian en cada intento: así un programa que solo memoriza el
 * camino falla, y el alumno descubre por qué existen el if y el while.
 *
 * `requiere` son conceptos que el programa debe usar para dar el nivel por
 * bueno (ver conceptosUsados en lenguaje.js).
 */

const azar = (n) => Math.floor(Math.random() * n);

/** Repite `generar` hasta que `valido` diga que sí (para que el azar no regale el nivel). */
function hasta(generar, valido) {
  for (let i = 0; i < 50; i++) {
    const r = generar();
    if (valido(r)) return r;
  }
  return generar();
}

export const NOMBRE_CONCEPTO = {
  for: 'un ciclo for',
  while: 'un ciclo while',
  if: 'un if',
  else: 'un else',
  var: 'una variable (var)',
  func: 'una función tuya (func) y llamarla',
  logico: 'un operador lógico (!, && o ||)',
  relacional: 'un operador relacional (<, >, <=, >=, == o !=)',
};

export const NIVELES = [
  {
    id: 'un-comando',
    titulo: 'Tu primer comando',
    concepto: 'Un comando',
    mision: 'Chispa está parada sobre la gema. Solo tienes que recogerla: toca el botón recoger() y luego ▶ Ejecutar.',
    explicacion:
      'Un comando es una orden para la computadora. Se escribe con su nombre y dos paréntesis al final: recoger(). Chispa no hace nada que no le escribas.',
    pista: 'Toca el botón recoger() que está abajo del editor. Se escribe solo. Después toca ▶ Ejecutar.',
    inicial: '',
    requiere: [],
    crear: () => ({ mapa: ['G'], robot: { x: 0, y: 0, dir: 1 } }),
  },
  {
    id: 'un-paso',
    titulo: 'Un paso',
    concepto: 'Dos comandos en orden',
    mision: 'La gema está justo enfrente. Escribe avanzar() y abajo recoger().',
    explicacion:
      'Ahora son dos órdenes. La computadora las hace de arriba hacia abajo, una por una. Primero camina y después recoge.',
    pista: 'Renglón 1: avanzar(). Renglón 2: recoger(). Luego ▶ Ejecutar.',
    inicial: '',
    requiere: [],
    crear: () => ({ mapa: ['.G'], robot: { x: 0, y: 0, dir: 1 } }),
  },
  {
    id: 'secuencia',
    titulo: 'Camina más',
    concepto: 'Secuencia',
    mision: 'Ahora la gema está más lejos. Cuenta las casillas, camina hasta ella y recógela.',
    explicacion:
      'Un programa es una lista de instrucciones que se ejecutan una tras otra. Esa es la estructura secuencial: si cambias el orden, cambia el resultado.',
    pista: 'Son 3 casillas: escribe avanzar() tres veces y al final recoger().',
    inicial: '',
    requiere: [],
    crear: () => ({ mapa: ['...G'], robot: { x: 0, y: 0, dir: 1 } }),
  },
  {
    id: 'interruptor',
    titulo: 'Enciende la luz',
    concepto: 'Secuencia',
    mision: 'Camina hasta el interruptor gris y enciéndelo con activar(). Se pone verde cuando está encendido.',
    explicacion:
      'activar() enciende el interruptor que está debajo de Chispa. Si no hay interruptor en esa casilla, Chispa no puede hacerlo y te avisa.',
    pista: 'avanzar() dos veces y luego activar().',
    inicial: '',
    requiere: [],
    crear: () => ({ mapa: ['..S'], robot: { x: 0, y: 0, dir: 1 } }),
  },
  {
    id: 'un-giro',
    titulo: 'Tu primer giro',
    concepto: 'Girar',
    mision: 'Chispa mira hacia arriba, pero la gema está a su derecha. Gírala, avanza y recoge.',
    explicacion:
      'Girar no mueve a Chispa de casilla: solo cambia hacia dónde mira. Fíjate en la antena y los ojos para saber hacia dónde va a caminar.',
    pista: 'girarDerecha(), luego avanzar() y al final recoger().',
    inicial: '',
    requiere: [],
    crear: () => ({ mapa: ['.G'], robot: { x: 0, y: 0, dir: 0 } }),
  },
  {
    id: 'giros',
    titulo: 'Gira y activa',
    concepto: 'Secuencia con giros',
    mision: 'Recoge la gema de la esquina y enciende el interruptor.',
    explicacion:
      'Chispa gira sobre su lugar: girarIzquierda() y girarDerecha() no la mueven de casilla, solo cambian hacia dónde mira. activar() enciende el interruptor en el que está parada.',
    pista: 'Primero sube dos casillas y recoge. Luego gira a la derecha y avanza hasta el interruptor.',
    inicial: '',
    requiere: [],
    crear: () => ({
      mapa: [
        'G..S',
        '.   ',
        '.   ',
      ],
      robot: { x: 0, y: 2, dir: 0 },
    }),
  },
  {
    id: 'for',
    titulo: 'Repite con for',
    concepto: 'Ciclo for',
    mision: 'Recoge las cinco gemas usando un ciclo for.',
    explicacion:
      'Cuando sabes cuántas veces se repite algo, usas for. «for i in 1...5» repite el bloque 5 veces; i va contando 1, 2, 3, 4, 5. Todo lo que está entre las llaves { } se repite.',
    ejemplo: 'for i in 1...3 {\n  // esto se repite 3 veces\n}',
    pista: 'En cada vuelta Chispa hace lo mismo: avanzar() y recoger(). Mete esos dos comandos dentro del for.',
    inicial: 'for i in 1...5 {\n  \n}\n',
    requiere: ['for'],
    crear: () => ({ mapa: ['.GGGGG'], robot: { x: 0, y: 0, dir: 1 } }),
  },
  {
    id: 'func',
    titulo: 'Tu propio comando',
    concepto: 'Funciones',
    mision: 'Sube la escalera recogiendo las tres gemas. Crea una función que suba un escalón.',
    explicacion:
      'Una función es un comando nuevo que tú inventas. Con func le pones nombre a varios pasos y después solo lo llamas por su nombre. Así no repites código.',
    ejemplo: 'func escalon() {\n  // los pasos de un escalón\n}\n\nescalon()',
    pista: 'Un escalón es: avanzar, girar a la izquierda, avanzar, girar a la derecha y recoger. Llama a tu función 3 veces (o con un for).',
    inicial: 'func escalon() {\n  \n}\n\n',
    requiere: ['func'],
    crear: () => ({
      mapa: [
        '   G',
        '  G.',
        ' G. ',
        '..  ',
      ],
      robot: { x: 0, y: 3, dir: 1 },
    }),
  },
  {
    id: 'if',
    titulo: 'Decide con if',
    concepto: 'Condicional if',
    mision: 'Deja encendidos los cinco interruptores. Cuidado: cambian cada vez que ejecutas.',
    explicacion:
      'Con if, Chispa pregunta antes de actuar. Si la condición es verdadera hace el bloque; si es falsa se lo salta. Aquí importa: activar() un interruptor que ya está encendido lo apaga.',
    ejemplo: 'if hayInterruptorApagado {\n  activar()\n}',
    pista: 'Recorre las cinco casillas con un for. En cada una, pregunta con if hayInterruptorApagado antes de activar().',
    inicial: 'for i in 1...5 {\n  avanzar()\n  \n}\n',
    requiere: ['if'],
    crear: () => ({
      mapa: [hasta(
        () => '.' + Array.from({ length: 5 }, () => (azar(2) ? 'S' : 'E')).join(''),
        (f) => f.includes('S') && f.includes('E'),
      )],
      robot: { x: 0, y: 0, dir: 1 },
    }),
  },
  {
    id: 'else',
    titulo: 'Si no… (else)',
    concepto: 'Condicional if / else',
    mision: 'Cada casilla tiene una gema o un interruptor apagado, y cambian en cada intento. Recoge todas las gemas y enciende todos los interruptores.',
    explicacion:
      'Con else le das a Chispa un plan B: si la condición se cumple hace el primer bloque; si no, hace el segundo. Siempre hace uno de los dos, nunca ambos.',
    ejemplo: 'if hayGema {\n  // plan A\n} else {\n  // plan B\n}',
    pista: 'Dentro de un for de 6 vueltas: avanzar(), y luego if hayGema { recoger() } else { activar() }.',
    inicial: '',
    requiere: ['if', 'else'],
    crear: () => ({
      mapa: [hasta(
        () => '.' + Array.from({ length: 6 }, () => (azar(2) ? 'G' : 'S')).join(''),
        (f) => f.includes('G') && f.includes('S'),
      )],
      robot: { x: 0, y: 0, dir: 1 },
    }),
  },
  {
    id: 'while',
    titulo: 'Mientras… (while)',
    concepto: 'Ciclo while',
    mision: 'La gema está al final del pasillo, pero el pasillo mide distinto cada vez. Llega y recógela.',
    explicacion:
      'Cuando no sabes cuántas veces se repite algo, usas while: repite el bloque mientras la condición sea verdadera. El ! significa NO: «while !bloqueado» se lee «mientras NO esté bloqueado».',
    ejemplo: 'while !bloqueado {\n  // se repite hasta que choque con el final\n}',
    pista: 'Un for no sirve porque no sabes el largo. Avanza mientras no esté bloqueado y, al salir del ciclo, recoge.',
    inicial: '',
    requiere: ['while'],
    crear: () => {
      const n = 3 + azar(5); // de 3 a 7 casillas
      return { mapa: [('.'.repeat(n) + 'G').padEnd(8, ' ')], robot: { x: 0, y: 0, dir: 1 } };
    },
  },
  {
    id: 'variables',
    titulo: 'La espiral',
    concepto: 'Variables y operadores relacionales',
    mision: 'Sigue la espiral recogiendo una gema en cada esquina. Cada lado mide uno más que el anterior: 1, 2, 3, 4 y 5.',
    explicacion:
      'Una variable guarda un valor que puede cambiar. Aquí guarda el largo del lado: empieza en 1 y le sumas 1 en cada vuelta con largo += 1. El operador relacional <= decide cuándo parar. Es la misma idea de la espiral de la tortuga.',
    ejemplo: 'var largo = 1\nwhile largo <= 5 {\n  // …\n  largo += 1\n}',
    pista: 'Dentro del while: un for que avance «largo» veces (for i in 1...largo), luego recoger(), girarDerecha() y largo += 1.',
    inicial: 'var largo = 1\n',
    requiere: ['var', 'relacional'],
    crear: () => {
      // Se dibuja el camino a partir de los lados, para que mapa y solución coincidan.
      const mapa = Array.from({ length: 6 }, () => Array(5).fill(' '));
      let x = 2, y = 3, d = 0;
      const DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0];
      mapa[y][x] = '.';
      for (let largo = 1; largo <= 5; largo++) {
        for (let i = 0; i < largo; i++) { x += DX[d]; y += DY[d]; mapa[y][x] = '.'; }
        mapa[y][x] = 'G';
        d = (d + 1) % 4;
      }
      return { mapa: mapa.map((f) => f.join('')), robot: { x: 2, y: 3, dir: 0 } };
    },
  },
  {
    id: 'laberinto',
    titulo: 'El laberinto',
    concepto: 'Lógica booleana: todo junto',
    mision: 'Encuentra la gema dentro del laberinto con un solo programa que sirva para cualquier laberinto.',
    explicacion:
      'Con las tres estructuras (secuencia, decisión y repetición) se puede escribir cualquier programa: es el teorema de Böhm-Jacopini. Aquí las juntas con la regla de la mano derecha: camina tocando siempre la pared de tu derecha y tarde o temprano llegas.',
    ejemplo: 'while !hayGema {\n  if !bloqueadoDerecha {\n    // hay hueco a la derecha\n  } else if !bloqueado {\n    // sigue de frente\n  } else {\n    // ni derecha ni frente\n  }\n}',
    pista: 'Si a la derecha hay camino: girarDerecha() y avanzar(). Si no, pero enfrente sí: avanzar(). Si tampoco: girarIzquierda(). Al salir del while, recoger().',
    inicial: '',
    requiere: ['while', 'if', 'logico'],
    crear: () => ({
      mapa: [
        '...  G',
        '  .  .',
        '......',
        '.   . ',
        '.   ..',
      ],
      robot: { x: 0, y: 0, dir: 1 },
    }),
  },
];

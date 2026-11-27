/* Lenguaje del reto «Programa a Chispa» (Módulo 2.4).
 *
 * Es un pedacito de Swift con comandos en español: for, while, repeat-while,
 * if / else, var, let y func, más los operadores del módulo (aritméticos,
 * relacionales y lógicos). Aquí se lee el texto del alumno (lexer + parser) y
 * se ejecuta contra el mundo de src/lib/reto-robot/mundo.js.
 *
 * La ejecución no anima nada: corre todo de una vez y devuelve la lista de
 * «fotos» (frames) que la interfaz reproduce después. Por eso un ciclo
 * infinito no congela la página: se corta al pasar el límite de pasos.
 */

export const COMANDOS = ['avanzar', 'girarIzquierda', 'girarDerecha', 'recoger', 'activar'];
export const SENSORES = [
  'hayGema', 'hayInterruptorApagado', 'hayInterruptorEncendido',
  'bloqueado', 'bloqueadoIzquierda', 'bloqueadoDerecha', 'gemasRecogidas',
];
const PALABRAS = new Set(['for', 'in', 'while', 'repeat', 'if', 'else', 'var', 'let', 'func', 'true', 'false']);

export class ErrorCodigo extends Error {
  constructor(mensaje, linea) {
    super(mensaje);
    this.linea = linea;
  }
}

// ─── Lexer ──────────────────────────────────────────────────────────────────

const OPERADORES = ['...', '..<', '==', '!=', '<=', '>=', '&&', '||', '+=', '-=',
  '{', '}', '(', ')', ';', ',', '<', '>', '!', '+', '-', '*', '/', '%', '='];

function lexer(src) {
  const toks = [];
  let i = 0;
  let linea = 1;
  while (i < src.length) {
    const c = src[i];
    if (c === '\n') { linea++; i++; continue; }
    if (/\s/.test(c)) { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < src.length && src[i] !== '\n') i++; continue; }
    // El celular cambia "..." por "…" y las comillas rectas por curvas.
    if (c === '…') { toks.push({ t: '...', v: '...', linea }); i++; continue; }
    if (/[0-9]/.test(c)) {
      let j = i;
      while (j < src.length && /[0-9]/.test(src[j])) j++;
      toks.push({ t: 'num', v: Number(src.slice(i, j)), linea });
      i = j;
      continue;
    }
    if (/[A-Za-z_áéíóúñÁÉÍÓÚÑ]/.test(c)) {
      let j = i;
      while (j < src.length && /[A-Za-z0-9_áéíóúñÁÉÍÓÚÑ]/.test(src[j])) j++;
      const w = src.slice(i, j);
      toks.push({ t: PALABRAS.has(w) ? w : 'id', v: w, linea });
      i = j;
      continue;
    }
    if (src.startsWith('..', i) && !src.startsWith('...', i) && !src.startsWith('..<', i)) {
      throw new ErrorCodigo('El rango lleva tres puntos, no dos: 1...3', linea);
    }
    const op = OPERADORES.find((o) => src.startsWith(o, i));
    if (op) { toks.push({ t: op, v: op, linea }); i += op.length; continue; }
    throw new ErrorCodigo(`No entiendo el símbolo «${c}».`, linea);
  }
  toks.push({ t: 'fin', v: 'el final del programa', linea });
  return toks;
}

// ─── Sugerencias para nombres mal escritos ──────────────────────────────────

function distancia(a, b) {
  a = a.toLowerCase(); b = b.toLowerCase();
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
  }
  return d[a.length][b.length];
}

function sugerencia(nombre, conocidos) {
  let mejor = null;
  let min = Infinity;
  for (const k of conocidos) {
    const dd = distancia(nombre, k);
    if (dd < min) { min = dd; mejor = k; }
  }
  return min <= Math.max(2, Math.floor(nombre.length / 3)) ? mejor : null;
}

// ─── Parser ─────────────────────────────────────────────────────────────────

const NIVELES_OP = [['||'], ['&&'], ['==', '!='], ['<', '>', '<=', '>='], ['+', '-'], ['*', '/', '%']];

export function analizarTexto(src) {
  const toks = lexer(src);
  let p = 0;
  const es = (t) => toks[p].t === t;
  const toma = (t, msg) => {
    if (toks[p].t !== t) throw new ErrorCodigo(msg || `Esperaba «${t}» y encontré «${toks[p].v}».`, toks[p].linea);
    return toks[p++];
  };

  function bloque(quien) {
    if (es('=')) {
      throw new ErrorCodigo('Para comparar se usa == (dos signos). Un solo = sirve para guardar un valor en una variable.', toks[p].linea);
    }
    const abre = toma('{', `Después de ${quien} va una llave { para abrir el bloque.`);
    const cuerpo = [];
    while (!es('}')) {
      if (es('fin')) throw new ErrorCodigo(`Falta cerrar con } el bloque que abriste en la línea ${abre.linea}.`, abre.linea);
      cuerpo.push(...sentencia());
    }
    p++;
    return cuerpo;
  }

  function si() {
    const k = toma('if');
    const cond = expr();
    const entonces = bloque('la condición del if');
    let sino = null;
    if (es('else')) {
      p++;
      sino = es('if') ? [si()] : bloque('else');
    }
    return { t: 'if', cond, entonces, sino, linea: k.linea };
  }

  function sentencia() {
    const k = toks[p];
    switch (k.t) {
      case ';': p++; return [];
      case 'for': {
        p++;
        const v = toma('id', 'Después de for va el nombre del contador. Ejemplo: for i in 1...3 { }').v;
        toma('in', `Falta la palabra in. Ejemplo: for ${v} in 1...3 { }`);
        const desde = expr();
        let incluye;
        if (es('...')) incluye = true;
        else if (es('..<')) incluye = false;
        else throw new ErrorCodigo('El rango se escribe con tres puntos, por ejemplo 1...3', toks[p].linea);
        p++;
        const hasta = expr();
        return [{ t: 'for', v, desde, hasta, incluye, cuerpo: bloque('el for'), linea: k.linea }];
      }
      case 'while': {
        p++;
        if (es('{')) throw new ErrorCodigo('Falta la condición entre while y la llave. Ejemplo: while !bloqueado { }', k.linea);
        const cond = expr();
        return [{ t: 'while', cond, cuerpo: bloque('la condición del while'), linea: k.linea }];
      }
      case 'repeat': {
        p++;
        const cuerpo = bloque('repeat');
        toma('while', 'Después del bloque de repeat va while y la condición: repeat { … } while condición');
        return [{ t: 'repeat', cuerpo, cond: expr(), linea: k.linea }];
      }
      case 'if': return [si()];
      case 'else': throw new ErrorCodigo('Este else no tiene un if antes. Va justo después de la } del if: } else {', k.linea);
      case 'var':
      case 'let': {
        p++;
        const nombre = toma('id', `Después de ${k.t} va el nombre de la variable. Ejemplo: ${k.t} contador = 0`).v;
        toma('=', `Dale un valor inicial: ${k.t} ${nombre} = 0`);
        return [{ t: 'var', nombre, constante: k.t === 'let', e: expr(), linea: k.linea }];
      }
      case 'func': {
        p++;
        const nombre = toma('id', 'Después de func va el nombre de tu función. Ejemplo: func escalon() { }').v;
        toma('(', `Después del nombre van paréntesis: func ${nombre}() { }`);
        toma(')', `Las funciones de este reto no reciben datos: func ${nombre}() { }`);
        return [{ t: 'func', nombre, cuerpo: bloque(`func ${nombre}()`), linea: k.linea }];
      }
      case 'id': {
        p++;
        if (es('(')) {
          p++;
          toma(')', `Los comandos no llevan nada entre los paréntesis: ${k.v}()`);
          return [{ t: 'llamar', nombre: k.v, linea: k.linea }];
        }
        if (es('=') || es('+=') || es('-=')) {
          const op = toks[p++].t;
          return [{ t: 'asignar', nombre: k.v, op, e: expr(), linea: k.linea }];
        }
        if (COMANDOS.includes(k.v)) throw new ErrorCodigo(`A «${k.v}» le faltan los paréntesis: ${k.v}()`, k.linea);
        const s = sugerencia(k.v, COMANDOS);
        throw new ErrorCodigo(`No sé qué hacer con «${k.v}».${s ? ` ¿Quisiste decir ${s}()?` : ''}`, k.linea);
      }
      case '}': throw new ErrorCodigo('Sobra esta llave }: no hay ningún bloque abierto que cerrar.', k.linea);
      default: throw new ErrorCodigo(`No esperaba «${k.v}» aquí.`, k.linea);
    }
  }

  function expr(n = 0) {
    if (n === NIVELES_OP.length) return unario();
    let a = expr(n + 1);
    while (NIVELES_OP[n].includes(toks[p].t)) {
      const op = toks[p++];
      a = { t: 'bin', op: op.t, a, b: expr(n + 1), linea: op.linea };
    }
    return a;
  }
  function unario() {
    const k = toks[p];
    if (k.t === '!' || k.t === '-') { p++; return { t: 'un', op: k.t, e: unario(), linea: k.linea }; }
    return primario();
  }
  function primario() {
    const k = toks[p];
    if (k.t === 'num') { p++; return { t: 'num', v: k.v }; }
    if (k.t === 'true' || k.t === 'false') { p++; return { t: 'bool', v: k.t === 'true' }; }
    if (k.t === 'id') {
      p++;
      if (es('(')) {
        throw new ErrorCodigo(`${k.v}() es una acción, no una pregunta. Las condiciones van sin paréntesis, por ejemplo: hayGema`, k.linea);
      }
      return { t: 'id', v: k.v, linea: k.linea };
    }
    if (k.t === '(') {
      p++;
      const e = expr();
      toma(')', 'Falta cerrar el paréntesis )');
      return e;
    }
    throw new ErrorCodigo(`Aquí esperaba un valor o una condición y encontré «${k.v}».`, k.linea);
  }

  const programa = [];
  while (!es('fin')) programa.push(...sentencia());
  return programa;
}

// ─── Qué conceptos usó el alumno ────────────────────────────────────────────

export function conceptosUsados(ast) {
  const f = { for: false, while: false, repeat: false, if: false, else: false, var: false, func: false, logico: false, relacional: false };
  const declaradas = new Set();
  const llamadas = new Set();
  const expr = (e) => {
    if (!e) return;
    if (e.t === 'un') { if (e.op === '!') f.logico = true; expr(e.e); }
    if (e.t === 'bin') {
      if (e.op === '&&' || e.op === '||') f.logico = true;
      if (['==', '!=', '<', '>', '<=', '>='].includes(e.op)) f.relacional = true;
      expr(e.a); expr(e.b);
    }
  };
  const lista = (l) => l && l.forEach(nodo);
  function nodo(s) {
    switch (s.t) {
      case 'for': f.for = true; expr(s.desde); expr(s.hasta); lista(s.cuerpo); break;
      case 'while': f.while = true; expr(s.cond); lista(s.cuerpo); break;
      case 'repeat': f.repeat = true; f.while = true; expr(s.cond); lista(s.cuerpo); break;
      case 'if': f.if = true; if (s.sino) f.else = true; expr(s.cond); lista(s.entonces); lista(s.sino); break;
      case 'var': f.var = true; expr(s.e); break;
      case 'asignar': expr(s.e); break;
      case 'func': declaradas.add(s.nombre); lista(s.cuerpo); break;
      case 'llamar': llamadas.add(s.nombre); break;
    }
  }
  lista(ast);
  f.func = [...declaradas].some((n) => llamadas.has(n));
  return f;
}

// ─── Intérprete ─────────────────────────────────────────────────────────────

const MAX_PASOS = 20000;
const MAX_ACCIONES = 400;

/** Corre el programa. Devuelve { frames, error } y deja el mundo en su estado final. */
export function ejecutar(ast, mundo) {
  const frames = [mundo.foto(0, null)];
  const funciones = new Map();
  const ambitos = [new Map()];
  let pasos = 0;
  let profundidad = 0;

  const paso = (linea) => {
    if (++pasos > MAX_PASOS) {
      throw new ErrorCodigo('Ciclo infinito: el programa nunca terminó. Revisa que algo dentro del ciclo cambie la condición.', linea);
    }
  };

  const buscar = (nombre) => {
    for (let i = ambitos.length - 1; i >= 0; i--) if (ambitos[i].has(nombre)) return ambitos[i];
    return null;
  };

  function valor(e) {
    switch (e.t) {
      case 'num': return e.v;
      case 'bool': return e.v;
      case 'id': {
        const amb = buscar(e.v);
        if (amb) return amb.get(e.v).valor;
        if (SENSORES.includes(e.v)) return mundo.sensor(e.v);
        if (COMANDOS.includes(e.v)) throw new ErrorCodigo(`${e.v} es una acción, no una condición. ¿Quisiste preguntar algo como hayGema o bloqueado?`, e.linea);
        const s = sugerencia(e.v, [...SENSORES, ...ambitos.flatMap((a) => [...a.keys()])]);
        throw new ErrorCodigo(`No conozco «${e.v}».${s ? ` ¿Quisiste decir ${s}?` : ' Si es una variable, primero créala con var.'}`, e.linea);
      }
      case 'un': {
        const v = valor(e.e);
        if (e.op === '!') {
          if (typeof v !== 'boolean') throw new ErrorCodigo('El ! (NO) solo funciona con verdadero o falso.', e.linea);
          return !v;
        }
        if (typeof v !== 'number') throw new ErrorCodigo('El signo - solo funciona con números.', e.linea);
        return -v;
      }
      case 'bin': {
        if (e.op === '&&' || e.op === '||') {
          const a = valor(e.a);
          if (typeof a !== 'boolean') throw new ErrorCodigo(`${e.op} une condiciones de verdadero o falso, no números.`, e.linea);
          if (e.op === '&&' && !a) return false;
          if (e.op === '||' && a) return true;
          const b = valor(e.b);
          if (typeof b !== 'boolean') throw new ErrorCodigo(`${e.op} une condiciones de verdadero o falso, no números.`, e.linea);
          return b;
        }
        const a = valor(e.a);
        const b = valor(e.b);
        if (e.op === '==') return a === b;
        if (e.op === '!=') return a !== b;
        if (typeof a !== 'number' || typeof b !== 'number') {
          throw new ErrorCodigo(`El operador ${e.op} solo funciona con números.`, e.linea);
        }
        switch (e.op) {
          case '<': return a < b;
          case '>': return a > b;
          case '<=': return a <= b;
          case '>=': return a >= b;
          case '+': return a + b;
          case '-': return a - b;
          case '*': return a * b;
          case '/':
            if (b === 0) throw new ErrorCodigo('No se puede dividir entre cero.', e.linea);
            return Math.trunc(a / b);
          case '%':
            if (b === 0) throw new ErrorCodigo('No se puede sacar el residuo de dividir entre cero.', e.linea);
            return a % b;
        }
      }
    }
    throw new ErrorCodigo('Expresión desconocida.', e.linea);
  }

  const condicion = (e, quien, linea) => {
    const v = valor(e);
    if (typeof v !== 'boolean') {
      throw new ErrorCodigo(`La condición del ${quien} tiene que ser verdadera o falsa, y aquí da ${v}. ¿Te faltó comparar, por ejemplo con < o ==?`, linea);
    }
    return v;
  };

  function bloque(lista, extra) {
    ambitos.push(extra || new Map());
    try { lista.forEach(sentencia); } finally { ambitos.pop(); }
  }

  function accion(nombre, linea) {
    if (frames.length > MAX_ACCIONES) {
      throw new ErrorCodigo(`Chispa ya hizo más de ${MAX_ACCIONES} movimientos. ¿Hay un ciclo que nunca termina?`, linea);
    }
    const problema = mundo[nombre]();
    frames.push(mundo.foto(linea, nombre, problema));
    if (problema) throw new ErrorCodigo(problema, linea);
  }

  function sentencia(s) {
    paso(s.linea);
    switch (s.t) {
      case 'llamar': {
        if (COMANDOS.includes(s.nombre)) return accion(s.nombre, s.linea);
        const f = funciones.get(s.nombre);
        if (!f && SENSORES.includes(s.nombre)) {
          throw new ErrorCodigo(`${s.nombre} es una pregunta, no una acción. Se usa sin paréntesis dentro de un if o un while: if ${s.nombre} { }`, s.linea);
        }
        if (!f) {
          const sug = sugerencia(s.nombre, [...COMANDOS, ...funciones.keys()]);
          throw new ErrorCodigo(`No existe el comando ${s.nombre}().${sug ? ` ¿Quisiste decir ${sug}()?` : ''}`, s.linea);
        }
        if (++profundidad > 60) throw new ErrorCodigo(`La función ${s.nombre}() se llama a sí misma sin parar.`, s.linea);
        try { bloque(f.cuerpo); } finally { profundidad--; }
        return;
      }
      case 'func':
        return; // ya se registraron antes de correr
      case 'var': {
        if (COMANDOS.includes(s.nombre) || SENSORES.includes(s.nombre)) {
          throw new ErrorCodigo(`«${s.nombre}» ya es una palabra de Chispa. Usa otro nombre para tu variable.`, s.linea);
        }
        const amb = ambitos[ambitos.length - 1];
        if (amb.has(s.nombre)) throw new ErrorCodigo(`La variable ${s.nombre} ya existe. Para cambiarle el valor escribe: ${s.nombre} = …`, s.linea);
        amb.set(s.nombre, { valor: valor(s.e), constante: s.constante });
        return;
      }
      case 'asignar': {
        const amb = buscar(s.nombre);
        if (!amb) {
          if (SENSORES.includes(s.nombre)) throw new ErrorCodigo(`${s.nombre} es un sensor: Chispa lo mide, tú no puedes cambiarlo.`, s.linea);
          throw new ErrorCodigo(`La variable ${s.nombre} no existe. Créala primero: var ${s.nombre} = 0`, s.linea);
        }
        const celda = amb.get(s.nombre);
        if (celda.constante) throw new ErrorCodigo(`${s.nombre} se creó con let, así que es constante y no puede cambiar. Usa var si quieres que cambie.`, s.linea);
        const v = valor(s.e);
        if (s.op === '=') celda.valor = v;
        else {
          if (typeof celda.valor !== 'number' || typeof v !== 'number') throw new ErrorCodigo(`${s.op} solo funciona con números.`, s.linea);
          celda.valor = s.op === '+=' ? celda.valor + v : celda.valor - v;
        }
        return;
      }
      case 'for': {
        const desde = valor(s.desde);
        const hasta = valor(s.hasta);
        if (!Number.isInteger(desde) || !Number.isInteger(hasta)) throw new ErrorCodigo('Los límites del for tienen que ser números enteros.', s.linea);
        const fin = s.incluye ? hasta : hasta - 1;
        for (let i = desde; i <= fin; i++) {
          paso(s.linea);
          const amb = new Map();
          if (s.v !== '_') amb.set(s.v, { valor: i, constante: true });
          bloque(s.cuerpo, amb);
        }
        return;
      }
      case 'while':
        while (condicion(s.cond, 'while', s.linea)) { paso(s.linea); bloque(s.cuerpo); }
        return;
      case 'repeat':
        do { paso(s.linea); bloque(s.cuerpo); } while (condicion(s.cond, 'repeat-while', s.linea));
        return;
      case 'if':
        if (condicion(s.cond, 'if', s.linea)) bloque(s.entonces);
        else if (s.sino) bloque(s.sino);
        return;
    }
  }

  // Las funciones se registran antes de correr, como en Swift: se pueden
  // llamar aunque estén escritas más abajo.
  const registrar = (lista) => lista.forEach((s) => {
    if (s.t !== 'func') return;
    if (COMANDOS.includes(s.nombre)) throw new ErrorCodigo(`${s.nombre}() ya es un comando de Chispa. Ponle otro nombre a tu función.`, s.linea);
    if (funciones.has(s.nombre)) throw new ErrorCodigo(`Ya hay otra función llamada ${s.nombre}().`, s.linea);
    funciones.set(s.nombre, s);
  });

  try {
    registrar(ast);
    ast.forEach(sentencia);
    return { frames, error: null };
  } catch (err) {
    if (err instanceof ErrorCodigo) return { frames, error: err };
    throw err;
  }
}

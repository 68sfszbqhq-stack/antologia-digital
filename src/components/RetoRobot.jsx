import React, { useState, useEffect, useRef, useCallback } from 'react';
import { analizarTexto, ejecutar, conceptosUsados, ErrorCodigo } from '../lib/reto-robot/lenguaje.js';
import { crearMundo } from '../lib/reto-robot/mundo.js';
import { NIVELES, NOMBRE_CONCEPTO } from '../lib/reto-robot/niveles.js';

/* Reto del Módulo 2.4: «Programa a Chispa».
 *
 * El alumno escribe código con sintaxis de Swift (for, while, if, var, func)
 * y comandos en español para mover a Chispa, un robot, por una cuadrícula:
 * recoger gemas y encender interruptores. Nueve niveles, uno por concepto.
 *
 * El lenguaje y los niveles viven en src/lib/reto-robot/. Este archivo es solo
 * la interfaz: mapa en SVG, editor, botones de comandos y animación.
 *
 * El progreso y el código de cada nivel se guardan en el navegador
 * (localStorage). No usa Firebase: para entregar, el alumno copia sus
 * soluciones con el botón del final.
 */

const MARCA = 'antologia:reto-robot';
const ALTO_LINEA = 22;
const CELDA = 56;

function leerProgreso() {
  try { return JSON.parse(localStorage.getItem(MARCA)) || { codigo: {}, hechos: [] }; }
  catch { return { codigo: {}, hechos: [] }; }
}
function guardarProgreso(p) {
  try { localStorage.setItem(MARCA, JSON.stringify(p)); } catch { /* sin espacio o modo privado */ }
}

const VELOCIDADES = [
  { nombre: 'Lento', ms: 650 },
  { nombre: 'Normal', ms: 380 },
  { nombre: 'Rápido', ms: 140 },
];

const ACCIONES = [
  { txt: 'avanzar()', ayuda: 'Una casilla hacia donde mira' },
  { txt: 'girarIzquierda()', ayuda: 'Gira 90° a la izquierda' },
  { txt: 'girarDerecha()', ayuda: 'Gira 90° a la derecha' },
  { txt: 'recoger()', ayuda: 'Recoge la gema de su casilla' },
  { txt: 'activar()', ayuda: 'Enciende o apaga el interruptor' },
];
const ESTRUCTURAS = [
  { txt: 'for i in 1...3 {\n  \n}', etiqueta: 'for' },
  { txt: 'while !bloqueado {\n  \n}', etiqueta: 'while' },
  { txt: 'if hayGema {\n  \n}', etiqueta: 'if' },
  { txt: 'if hayGema {\n  \n} else {\n  \n}', etiqueta: 'if / else' },
  { txt: 'var contador = 0', etiqueta: 'var' },
  { txt: 'func nombre() {\n  \n}', etiqueta: 'func' },
];
const SENSORES_UI = [
  { txt: 'hayGema', ayuda: '¿Hay una gema aquí?' },
  { txt: 'hayInterruptorApagado', ayuda: '¿Hay un interruptor apagado aquí?' },
  { txt: 'hayInterruptorEncendido', ayuda: '¿Hay un interruptor encendido aquí?' },
  { txt: 'bloqueado', ayuda: '¿Hay pared enfrente?' },
  { txt: 'bloqueadoIzquierda', ayuda: '¿Hay pared a su izquierda?' },
  { txt: 'bloqueadoDerecha', ayuda: '¿Hay pared a su derecha?' },
  { txt: 'gemasRecogidas', ayuda: 'Número de gemas que lleva' },
];
const OPERADORES = ['!', '&&', '||', '==', '<', '<=', '+= 1'];

export default function RetoRobot() {
  const [progreso, setProgreso] = useState(leerProgreso);
  const [idx, setIdx] = useState(() => {
    const p = leerProgreso();
    const i = NIVELES.findIndex((n) => !p.hechos.includes(n.id));
    return i === -1 ? 0 : i;
  });
  const nivel = NIVELES[idx];
  const [codigo, setCodigo] = useState(() => progreso.codigo[nivel.id] ?? nivel.inicial);
  const [frame, setFrame] = useState(() => crearMundo(nivel.crear()).foto(0, null));
  const [corriendo, setCorriendo] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [vel, setVel] = useState(1);
  const [verPista, setVerPista] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [copiado, setCopiado] = useState('');
  const editorRef = useRef(null);
  const timerRef = useRef(null);

  const parar = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = null;
    setCorriendo(false);
  }, []);
  useEffect(() => parar, [parar]);

  // Guardar el código mientras escribe.
  useEffect(() => {
    setProgreso((p) => {
      if (p.codigo[nivel.id] === codigo) return p;
      const n = { ...p, codigo: { ...p.codigo, [nivel.id]: codigo } };
      guardarProgreso(n);
      return n;
    });
  }, [codigo, nivel.id]);

  function irANivel(i) {
    parar();
    const n = NIVELES[i];
    setIdx(i);
    setCodigo(progreso.codigo[n.id] ?? n.inicial);
    setFrame(crearMundo(n.crear()).foto(0, null));
    setResultado(null);
    setVerPista(false);
  }

  function reiniciar() {
    parar();
    setFrame(crearMundo(nivel.crear()).foto(0, null));
    setResultado(null);
  }

  function correr() {
    parar();
    setResultado(null);
    let ast;
    try {
      ast = analizarTexto(codigo);
    } catch (e) {
      if (!(e instanceof ErrorCodigo)) throw e;
      setResultado({ tipo: 'error', texto: e.message, linea: e.linea });
      return;
    }
    if (!ast.length) {
      setResultado({ tipo: 'info', texto: 'Tu programa está vacío. Escribe o toca algún comando de abajo.' });
      return;
    }
    const mundo = crearMundo(nivel.crear()); // los niveles con azar cambian en cada intento
    const { frames, error } = ejecutar(ast, mundo);
    const final = evaluar(error, mundo, ast);

    let i = 0;
    setFrame(frames[0]);
    setCorriendo(true);
    timerRef.current = setInterval(() => {
      i++;
      if (i >= frames.length) {
        parar();
        setResultado(final);
        if (final.tipo === 'ok') marcarHecho();
        return;
      }
      setFrame(frames[i]);
    }, VELOCIDADES[vel].ms);
  }

  function evaluar(error, mundo, ast) {
    if (error) return { tipo: 'error', texto: error.message, linea: error.linea };
    const { gemas, apagados } = mundo.pendientes();
    if (gemas || apagados) {
      const partes = [];
      if (gemas) partes.push(`${gemas} ${gemas === 1 ? 'gema' : 'gemas'}`);
      if (apagados) partes.push(`${apagados} ${apagados === 1 ? 'interruptor apagado' : 'interruptores apagados'}`);
      return { tipo: 'info', texto: `Casi. El programa terminó, pero quedan ${partes.join(' y ')}.` };
    }
    const usados = conceptosUsados(ast);
    const faltan = nivel.requiere.filter((k) => !usados[k]);
    if (faltan.length) {
      return {
        tipo: 'info',
        texto: `¡Chispa lo logró! Pero la misión de este nivel es practicar ${faltan.map((k) => NOMBRE_CONCEPTO[k]).join(' y ')}. Reescríbelo usándolo.`,
      };
    }
    const lineas = codigo.split('\n').filter((l) => l.trim() && !l.trim().startsWith('//')).length;
    return { tipo: 'ok', texto: `¡Nivel superado con ${lineas} ${lineas === 1 ? 'línea' : 'líneas'} de código!` };
  }

  function marcarHecho() {
    setProgreso((p) => {
      if (p.hechos.includes(nivel.id)) return p;
      const n = { ...p, hechos: [...p.hechos, nivel.id] };
      guardarProgreso(n);
      return n;
    });
  }

  // ─── Editor ───────────────────────────────────────────────────────────────

  function reemplazar(nuevo, cursor) {
    setCodigo(nuevo);
    requestAnimationFrame(() => {
      const ta = editorRef.current;
      if (!ta) return;
      ta.focus();
      ta.setSelectionRange(cursor, cursor);
    });
  }

  /** Inserta un fragmento respetando la sangría de la línea donde está el cursor. */
  function insertar(fragmento, enLinea = true) {
    const ta = editorRef.current;
    const ini = ta ? ta.selectionStart : codigo.length;
    const fin = ta ? ta.selectionEnd : codigo.length;
    const inicioLinea = codigo.lastIndexOf('\n', ini - 1) + 1;
    let finLinea = codigo.indexOf('\n', ini);
    if (finLinea === -1) finLinea = codigo.length;
    const linea = codigo.slice(inicioLinea, finLinea);
    const sangria = linea.match(/^\s*/)[0];

    if (!enLinea) {
      // Sensores y operadores: van justo donde está el cursor.
      const t = (/\S$/.test(codigo.slice(0, ini)) && !/^[!)]/.test(fragmento) ? ' ' : '') + fragmento;
      reemplazar(codigo.slice(0, ini) + t + codigo.slice(fin), ini + t.length);
      return;
    }

    const texto = fragmento.split('\n').map((l, i) => (i === 0 ? l : sangria + l)).join('\n');
    let nuevo, base;
    if (linea.trim() === '') {
      nuevo = codigo.slice(0, inicioLinea) + sangria + texto + codigo.slice(finLinea);
      base = inicioLinea + sangria.length;
    } else {
      nuevo = codigo.slice(0, finLinea) + '\n' + sangria + texto + codigo.slice(finLinea);
      base = finLinea + 1 + sangria.length;
    }
    // Cursor: en el primer renglón vacío del bloque, o al final de lo insertado.
    const hueco = texto.split('\n').findIndex((l, i) => i > 0 && l.trim() === '');
    let cursor = base + texto.length;
    if (hueco > 0) {
      const lineas = texto.split('\n');
      cursor = base + lineas.slice(0, hueco).join('\n').length + 1 + lineas[hueco].length;
    }
    reemplazar(nuevo, cursor);
  }

  function teclas(e) {
    const ta = e.currentTarget;
    const ini = ta.selectionStart;
    const antes = codigo.slice(0, ini);
    const despues = codigo.slice(ta.selectionEnd);
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      correr();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      reemplazar(antes + '  ' + despues, ini + 2);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const lineaActual = antes.slice(antes.lastIndexOf('\n') + 1);
      let sangria = lineaActual.match(/^\s*/)[0];
      if (/\{\s*$/.test(lineaActual)) sangria += '  ';
      reemplazar(antes + '\n' + sangria + despues, ini + 1 + sangria.length);
    } else if (e.key === '}') {
      const lineaActual = antes.slice(antes.lastIndexOf('\n') + 1);
      if (/^\s{2,}$/.test(lineaActual)) {
        e.preventDefault();
        const recorte = antes.slice(0, -2);
        reemplazar(recorte + '}' + despues, recorte.length + 1);
      }
    }
  }

  const numLineas = Math.max(codigo.split('\n').length, 8);
  const lineaActiva = corriendo ? frame.linea : resultado?.tipo === 'error' ? resultado.linea : 0;
  const hechos = progreso.hechos.length;

  async function copiarSoluciones() {
    const texto = NIVELES
      .filter((n) => progreso.hechos.includes(n.id))
      .map((n, i) => `// Nivel ${NIVELES.indexOf(n) + 1}: ${n.titulo} (${n.concepto})\n${(progreso.codigo[n.id] || '').trim()}`)
      .join('\n\n');
    try {
      await navigator.clipboard.writeText(texto || 'Todavía no supero ningún nivel.');
      setCopiado('Copiado. Pégalo en tu entrega.');
    } catch {
      setCopiado('Tu navegador no dejó copiar. Selecciona el código a mano.');
    }
    setTimeout(() => setCopiado(''), 4000);
  }

  return (
    <div id="reto-chispa" className="glass-card rounded-2xl p-5 sm:p-8 border border-violet-500/30 bg-violet-500/5 mb-8 scroll-mt-8">
      {/* Encabezado */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="max-w-2xl">
          <span className="tag-badge bg-violet-500/20 text-violet-300 border border-violet-500/40 mb-3 inline-block">Reto de programación</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">Programa a Chispa</h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Chispa es un robot que solo hace lo que le escribes. Dale instrucciones para que recoja las gemas y encienda los interruptores.
            Cada nivel te enseña una pieza de la clase: secuencia, <code className="text-violet-300">for</code>, funciones,{' '}
            <code className="text-violet-300">if</code>, <code className="text-violet-300">while</code>, variables y operadores lógicos.
            Se escribe como en <strong>Swift</strong>, el lenguaje de las apps de iPhone.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest block">Progreso</span>
          <span className="text-2xl font-black text-white font-mono-tech">{hechos}/{NIVELES.length}</span>
        </div>
      </div>

      {/* Niveles */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Niveles">
        {NIVELES.map((n, i) => {
          const hecho = progreso.hechos.includes(n.id);
          const actual = i === idx;
          return (
            <button
              key={n.id}
              type="button"
              role="tab"
              aria-selected={actual}
              title={`${n.titulo}: ${n.concepto}`}
              onClick={() => irANivel(i)}
              className={`h-9 min-w-9 px-3 rounded-lg text-xs font-mono-tech border transition ${
                actual ? 'bg-violet-500 text-white border-violet-400'
                  : hecho ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:border-emerald-400'
                    : 'bg-white/5 text-slate-300 border-white/10 hover:border-violet-400/50'
              }`}
            >
              {hecho && !actual ? '✓' : i + 1}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ── Columna izquierda: misión y mundo ── */}
        <div className="space-y-4 min-w-0">
          <div>
            <span className="text-[11px] font-mono-tech text-violet-300 uppercase tracking-widest">Nivel {idx + 1} · {nivel.concepto}</span>
            <h3 className="text-xl font-bold text-white mt-1">{nivel.titulo}</h3>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">🎯 {nivel.mision}</p>
          </div>

          <Mundo frame={frame} />

          <div className="flex flex-wrap gap-2 text-[11px] font-mono-tech text-slate-400">
            <Leyenda><IconoGema size={14} /> gema</Leyenda>
            <Leyenda><span className="w-3 h-3 rounded-sm bg-slate-600 border border-rose-400/70" /> interruptor apagado</Leyenda>
            <Leyenda><span className="w-3 h-3 rounded-sm bg-emerald-400" /> encendido</Leyenda>
          </div>

          <div className="p-4 rounded-xl bg-black/30 border border-white/10">
            <h4 className="text-xs font-mono-tech text-cyan-300 uppercase tracking-widest mb-2">💡 {nivel.concepto}</h4>
            <p className="text-xs text-slate-300 leading-relaxed">{nivel.explicacion}</p>
            {nivel.ejemplo && (
              <pre className="mt-3 text-[11px] font-mono-tech text-emerald-300 bg-black/40 border border-white/10 rounded-lg p-3 overflow-x-auto">{nivel.ejemplo}</pre>
            )}
            <button type="button" onClick={() => setVerPista((v) => !v)} className="mt-3 text-[11px] font-mono-tech text-amber-300 hover:text-amber-200">
              {verPista ? '▾ Ocultar pista' : '▸ Ver una pista'}
            </button>
            {verPista && <p className="mt-2 text-xs text-amber-100/90 leading-relaxed">{nivel.pista}</p>}
          </div>
        </div>

        {/* ── Columna derecha: código ── */}
        <div className="space-y-3 min-w-0">
          <div className="rounded-xl border border-white/10 bg-[#0b1020] overflow-hidden">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/[0.03]">
              <span className="text-[11px] font-mono-tech text-slate-400">programa.swift</span>
              {corriendo && <span className="text-[11px] font-mono-tech text-violet-300 animate-pulse">▶ ejecutando línea {frame.linea || '…'}</span>}
            </div>
            <div className="relative flex font-mono-tech text-[13px]" style={{ lineHeight: `${ALTO_LINEA}px` }}>
              <div className="select-none text-right text-slate-600 py-3 pl-3 pr-2 overflow-hidden" style={{ height: 14 * ALTO_LINEA + 24 }} aria-hidden="true">
                <div style={{ transform: `translateY(${-scroll}px)` }}>
                  {Array.from({ length: numLineas }, (_, i) => (
                    <div key={i} className={i + 1 === lineaActiva ? (resultado?.tipo === 'error' && !corriendo ? 'text-rose-400 font-bold' : 'text-violet-300 font-bold') : ''}>{i + 1}</div>
                  ))}
                </div>
              </div>
              <div className="relative flex-1 min-w-0">
                {lineaActiva > 0 && (
                  <div
                    aria-hidden="true"
                    className={`absolute left-0 right-0 pointer-events-none ${resultado?.tipo === 'error' && !corriendo ? 'bg-rose-500/15' : 'bg-violet-500/20'}`}
                    style={{ top: 12 + (lineaActiva - 1) * ALTO_LINEA - scroll, height: ALTO_LINEA }}
                  />
                )}
                <textarea
                  ref={editorRef}
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onKeyDown={teclas}
                  onScroll={(e) => setScroll(e.currentTarget.scrollTop)}
                  readOnly={corriendo}
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  autoComplete="off"
                  aria-label="Código del programa"
                  className="relative w-full bg-transparent text-slate-100 py-3 pr-3 pl-1 outline-none resize-none whitespace-pre overflow-auto"
                  style={{ height: 14 * ALTO_LINEA + 24, lineHeight: `${ALTO_LINEA}px`, tabSize: 2 }}
                />
              </div>
            </div>
          </div>

          {/* Botones principales */}
          <div className="flex flex-wrap items-center gap-2">
            {corriendo ? (
              <button type="button" onClick={reiniciar} className="btn-primary px-5 py-2.5 text-sm font-semibold">■ Detener</button>
            ) : (
              <button type="button" onClick={correr} className="btn-primary px-5 py-2.5 text-sm font-semibold">▶ Ejecutar</button>
            )}
            <button type="button" onClick={reiniciar} className="px-4 py-2.5 rounded-xl text-xs font-mono-tech bg-white/5 border border-white/10 text-slate-200 hover:border-violet-400/50">↺ Reiniciar mapa</button>
            <button
              type="button"
              onClick={() => { parar(); setCodigo(nivel.inicial); setResultado(null); }}
              className="px-4 py-2.5 rounded-xl text-xs font-mono-tech bg-white/5 border border-white/10 text-slate-400 hover:border-rose-400/50"
            >
              Borrar código
            </button>
            <label className="ml-auto flex items-center gap-2 text-[11px] font-mono-tech text-slate-400">
              Velocidad
              <select value={vel} onChange={(e) => setVel(Number(e.target.value))} className="bg-black/40 border border-white/10 rounded-lg px-2 py-1.5 text-slate-200">
                {VELOCIDADES.map((v, i) => <option key={v.nombre} value={i}>{v.nombre}</option>)}
              </select>
            </label>
          </div>

          {/* Resultado */}
          {resultado && (
            <div
              role="status"
              aria-live="polite"
              className={`rounded-xl px-4 py-3 text-sm leading-snug border ${
                resultado.tipo === 'ok' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-100'
                  : resultado.tipo === 'error' ? 'bg-rose-500/10 border-rose-500/40 text-rose-100'
                    : 'bg-amber-500/10 border-amber-500/40 text-amber-100'
              }`}
            >
              {resultado.tipo === 'error' && resultado.linea ? <strong className="font-mono-tech">Línea {resultado.linea}: </strong> : null}
              {resultado.tipo === 'ok' ? '🎉 ' : resultado.tipo === 'error' ? '🐞 ' : '🤔 '}
              {resultado.texto}
              {resultado.tipo === 'ok' && idx < NIVELES.length - 1 && (
                <button type="button" onClick={() => irANivel(idx + 1)} className="block mt-2 text-xs font-mono-tech text-emerald-300 hover:text-emerald-200">
                  Siguiente nivel →
                </button>
              )}
              {resultado.tipo === 'ok' && idx === NIVELES.length - 1 && (
                <span className="block mt-2 text-xs">Terminaste el último nivel. Ya programas con las tres estructuras que bastan para cualquier programa.</span>
              )}
            </div>
          )}

          {/* Paleta de comandos */}
          <Paleta titulo="Acciones de Chispa">
            {ACCIONES.map((a) => <Ficha key={a.txt} titulo={a.ayuda} onClick={() => insertar(a.txt)} clase="text-cyan-200">{a.txt}</Ficha>)}
          </Paleta>
          <Paleta titulo="Estructuras">
            {ESTRUCTURAS.map((a) => <Ficha key={a.etiqueta} titulo={a.txt} onClick={() => insertar(a.txt)} clase="text-violet-200">{a.etiqueta}</Ficha>)}
          </Paleta>
          <Paleta titulo="Preguntas (sensores) y operadores">
            {SENSORES_UI.map((a) => <Ficha key={a.txt} titulo={a.ayuda} onClick={() => insertar(a.txt, false)} clase="text-amber-200">{a.txt}</Ficha>)}
            {OPERADORES.map((o) => <Ficha key={o} titulo="Operador" onClick={() => insertar(o, false)} clase="text-rose-200">{o}</Ficha>)}
          </Paleta>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Toca un botón para escribirlo donde está el cursor, o escríbelo tú. Los comandos llevan paréntesis: <code>avanzar()</code>. Las preguntas no: <code>hayGema</code>.
          </p>
        </div>
      </div>

      {/* Entrega */}
      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-slate-400 max-w-xl">
          Tu avance y tu código se guardan en este navegador. Cuando termines, copia tus soluciones y pégalas en tu entrega junto con una captura.
        </p>
        <div className="text-right">
          <button type="button" onClick={copiarSoluciones} className="px-4 py-2.5 rounded-xl text-xs font-mono-tech bg-violet-500/15 border border-violet-500/40 text-violet-200 hover:bg-violet-500/25">
            📋 Copiar mis soluciones ({hechos})
          </button>
          {copiado && <p className="text-[11px] font-mono-tech text-emerald-300 mt-2">{copiado}</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Mapa ───────────────────────────────────────────────────────────────────

function Mundo({ frame }) {
  const ancho = Math.max(...frame.celdas.map((f) => f.length));
  const alto = frame.celdas.length;
  const pad = 10;
  const W = ancho * CELDA + pad * 2;
  const H = alto * CELDA + pad * 2;
  const choco = frame.problema && frame.accion === 'avanzar';

  return (
    <div className="rounded-xl bg-slate-950 border border-white/10 p-3 flex items-center justify-center overflow-hidden" style={{ minHeight: 200 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" style={{ maxHeight: 360, maxWidth: W * 1.4 }} role="img" aria-label="Mapa del nivel">
        <defs>
          <radialGradient id="chispa-brillo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
          </radialGradient>
        </defs>
        {frame.celdas.map((fila, y) => [...fila].map((c, x) => {
          if (c === ' ') return null;
          const px = pad + x * CELDA;
          const py = pad + y * CELDA;
          return (
            <g key={`${x}-${y}`}>
              <rect x={px + 2} y={py + 2} width={CELDA - 4} height={CELDA - 4} rx={8} fill="#1e293b" stroke="#334155" />
              {c === 'G' && (
                <g transform={`translate(${px + CELDA / 2} ${py + CELDA / 2})`}>
                  <polygon points="0,-14 11,-3 0,14 -11,-3" fill="#a78bfa" stroke="#ddd6fe" strokeWidth="1.5">
                    <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur="1.6s" repeatCount="indefinite" />
                  </polygon>
                </g>
              )}
              {(c === 'S' || c === 'E') && (
                <g>
                  {c === 'E' && <circle cx={px + CELDA / 2} cy={py + CELDA / 2} r={CELDA / 2} fill="url(#chispa-brillo)" />}
                  <rect x={px + 14} y={py + 14} width={CELDA - 28} height={CELDA - 28} rx={5}
                    fill={c === 'E' ? '#34d399' : '#475569'} stroke={c === 'E' ? '#a7f3d0' : '#fb7185'} strokeWidth="2" />
                  <circle cx={px + CELDA / 2} cy={py + CELDA / 2 + (c === 'E' ? -4 : 4)} r={4} fill={c === 'E' ? '#064e3b' : '#cbd5e1'} />
                </g>
              )}
            </g>
          );
        }))}

        {/* Chispa */}
        <g style={{ transform: `translate(${pad + frame.x * CELDA + CELDA / 2}px, ${pad + frame.y * CELDA + CELDA / 2}px)`, transition: 'transform 0.25s ease' }}>
          <g
            className={choco ? 'chispa-choque' : ''}
            style={{ transform: `rotate(${frame.angulo}deg)`, transition: 'transform 0.25s ease', transformBox: 'fill-box', transformOrigin: 'center' }}
          >
            <Robot />
          </g>
        </g>
      </svg>
      <style>{`
        @keyframes chispa-sacudir { 0%,100% { translate: 0 0 } 25% { translate: -3px 0 } 75% { translate: 3px 0 } }
        .chispa-choque { animation: chispa-sacudir 0.2s 2; }
      `}</style>
    </div>
  );
}

/** Chispa mirando hacia arriba (norte), centrada en 0,0. */
function Robot() {
  return (
    <>
      {/* Círculo invisible: hace la caja simétrica para que gire sobre su centro. */}
      <circle r="24" fill="transparent" />
      <line x1="0" y1="-14" x2="0" y2="-22" stroke="#fbbf24" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="0" cy="-22" r="3" fill="#fde68a" />
      <rect x="-15" y="-14" width="30" height="28" rx="9" fill="#f59e0b" stroke="#fde68a" strokeWidth="2" />
      <rect x="-10" y="-9" width="20" height="9" rx="4" fill="#0f172a" />
      <circle cx="-4" cy="-4.5" r="2.4" fill="#22d3ee" />
      <circle cx="4" cy="-4.5" r="2.4" fill="#22d3ee" />
      <rect x="-19" y="-4" width="4" height="12" rx="2" fill="#b45309" />
      <rect x="15" y="-4" width="4" height="12" rx="2" fill="#b45309" />
      <path d="M -5 7 Q 0 10 5 7" stroke="#78350f" strokeWidth="1.8" fill="none" strokeLinecap="round" />
    </>
  );
}

function IconoGema({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="-12 -15 24 30" aria-hidden="true">
      <polygon points="0,-14 11,-3 0,14 -11,-3" fill="#a78bfa" stroke="#ddd6fe" strokeWidth="1.5" />
    </svg>
  );
}

function Leyenda({ children }) {
  return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">{children}</span>;
}

function Paleta({ titulo, children }) {
  return (
    <div>
      <span className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-widest block mb-1.5">{titulo}</span>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Ficha({ children, titulo, onClick, clase = '' }) {
  return (
    <button
      type="button"
      title={titulo}
      onMouseDown={(e) => e.preventDefault()} // no robarle el cursor al editor
      onClick={onClick}
      className={`px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-violet-400/50 hover:bg-violet-500/10 text-xs font-mono-tech transition ${clase}`}
    >
      {children}
    </button>
  );
}

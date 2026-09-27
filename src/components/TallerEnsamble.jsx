import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ARMADOS } from '../lib/taller-3d/armados.js';
import { firebaseConfigurado } from '../lib/firebase-config';

/* Taller 3D del Módulo 1.1: el alumno arma una PC de escritorio o una laptop
 * pieza por pieza.
 *
 * Este archivo es solo la interfaz: la tarjeta que aparece en la sesión y la
 * pantalla completa del taller (cronómetro, lista de pasos, fichas, avisos).
 * El 3D vive en src/lib/taller-3d/ y se descarga con import() hasta que el
 * alumno pulsa el botón, para no cargarle three.js a quien solo lee.
 *
 * La pantalla completa se monta con un portal en <body>: dentro de la sesión
 * hay tarjetas con efectos de vidrio (backdrop-filter) y un `position: fixed`
 * adentro de ellas deja de cubrir toda la pantalla.
 *
 * Si el alumno entró con su cuenta (arriba, en la misma sesión), su mejor
 * tiempo se guarda en Firebase junto con una captura de la pantalla final, y
 * el profesor ve el ranking en /profesor. Ver src/lib/taller3d.ts y el bloque
 * "Taller 3D" de firestore.rules. Sin cuenta se puede practicar igual; la
 * captura se descarga para mandarla por otro lado.
 *
 * Aparte, el mejor tiempo se guarda en el navegador para mostrarlo en la
 * tarjeta. Si el navegador no deja, no pasa nada.
 */

const MARCA_RECORD = 'antologia:taller3d-records';

function leerRecords() {
  try {
    return JSON.parse(localStorage.getItem(MARCA_RECORD)) || {};
  } catch {
    return {};
  }
}

function guardarRecord(llave, segundos, errores) {
  const todos = leerRecords();
  const previo = todos[llave];
  const mejor = !previo || segundos < previo.segundos;
  if (mejor) {
    todos[llave] = { segundos, errores };
    try { localStorage.setItem(MARCA_RECORD, JSON.stringify(todos)); } catch { /* sin almacenamiento */ }
  }
  return { mejor, previo };
}

function hayWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * La captura que se guarda y se descarga: la escena final con una franja abajo
 * que dice de quién es, qué armó, en cuánto tiempo y cuándo. La franja es lo
 * que la vuelve evidencia: sin ella, una captura se puede pasar de un alumno a
 * otro.
 *
 * Se reduce hasta caber en el tope que ponen las reglas (400 000 caracteres).
 */
async function componerCaptura(base, { quien, que, segundos, errores, reto }) {
  const img = await new Promise((ok, mal) => {
    const i = new Image();
    i.onload = () => ok(i);
    i.onerror = mal;
    i.src = base;
  });
  for (const ancho of [1000, 800, 640, 480]) {
    const alto = Math.round((img.height / img.width) * ancho);
    const franja = Math.round(ancho * 0.09);
    const c = document.createElement('canvas');
    c.width = ancho;
    c.height = alto + franja;
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0, ancho, alto);
    g.fillStyle = '#0b1220';
    g.fillRect(0, alto, ancho, franja);
    g.fillStyle = '#22d3ee';
    g.fillRect(0, alto, ancho, 3);
    const t = franja * 0.3;
    g.fillStyle = '#ffffff';
    g.font = `bold ${t}px Inter, Arial, sans-serif`;
    g.textBaseline = 'middle';
    g.fillText(quien, franja * 0.3, alto + franja * 0.36);
    g.fillStyle = '#94a3b8';
    g.font = `${t * 0.78}px Inter, Arial, sans-serif`;
    const fecha = new Date().toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' });
    g.fillText(`Taller 3D · ${que}${reto ? ' · modo reto' : ''} · ${fecha}`, franja * 0.3, alto + franja * 0.72);
    g.textAlign = 'right';
    g.fillStyle = '#22d3ee';
    g.font = `bold ${t * 1.25}px "Roboto Mono", monospace`;
    g.fillText(reloj(segundos), ancho - franja * 0.3, alto + franja * 0.4);
    g.fillStyle = errores ? '#fda4af' : '#6ee7b7';
    g.font = `${t * 0.78}px "Roboto Mono", monospace`;
    g.fillText(`${errores} ${errores === 1 ? 'error' : 'errores'}`, ancho - franja * 0.3, alto + franja * 0.76);
    for (const calidad of [0.8, 0.65, 0.5]) {
      const url = c.toDataURL('image/jpeg', calidad);
      if (url.length <= 380000) return url;
    }
  }
  return null;
}

const reloj = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

const COLOR_CATEGORIA = {
  Entrada: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30',
  Salida: 'text-amber-300 bg-amber-500/10 border-amber-500/30',
  Procesamiento: 'text-cyan-300 bg-cyan-500/10 border-cyan-500/30',
  Memoria: 'text-violet-300 bg-violet-500/10 border-violet-500/30',
  Almacenamiento: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
  Energía: 'text-rose-300 bg-rose-500/10 border-rose-500/30',
};
const colorCat = (c) => COLOR_CATEGORIA[c] || 'text-slate-300 bg-white/5 border-white/15';

export default function TallerEnsamble() {
  const [abierto, setAbierto] = useState(null); // { armado, reto }
  const [reto, setReto] = useState(false);
  const [records, setRecords] = useState({});
  // null: sin cuenta · { user, ficha }: puede guardar · 'nada': Firebase no configurado
  const [alumno, setAlumno] = useState(firebaseConfigurado() ? null : 'nada');

  useEffect(() => { setRecords(leerRecords()); }, [abierto]);

  // Quién está identificado. Se entra arriba, en la misma sesión
  // (AccesoAlumno); aquí solo se escucha.
  useEffect(() => {
    if (!firebaseConfigurado()) return undefined;
    let dejar = () => {};
    let vivo = true;
    import('../lib/alumno').then(({ observarSesion, fichaDe, esProfesor }) => {
      if (!vivo) return;
      dejar = observarSesion(async (u) => {
        if (!u || esProfesor(u)) { setAlumno(null); return; }
        try {
          const ficha = await fichaDe(u.uid);
          setAlumno(ficha?.activo ? { user: u, ficha } : null);
        } catch {
          setAlumno(null);
        }
      });
    }).catch(() => {});
    return () => { vivo = false; dejar(); };
  }, []);

  const abrir = (armado) => setAbierto({ armado, reto });

  return (
    <>
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-cyan-500/30 bg-cyan-500/5 relative overflow-hidden">
        <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-20 pointer-events-none" style={{ background: 'radial-gradient(circle, #a855f7 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="relative">
          <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-widest">// Práctica · Taller 3D</span>
          <h3 className="text-xl sm:text-2xl font-black text-white mt-2 mb-2">🛠️ Arma tu propia computadora</h3>
          <p className="text-sm text-slate-300 leading-relaxed mb-6 max-w-3xl">
            Toma cada pieza, llévala a su lugar y conecta todo hasta que el equipo encienda. Si te adelantas
            —el disipador antes que el procesador, la corriente antes que el monitor— el taller te dice por qué no se puede.
            Funciona con el dedo en el celular o con el mouse.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            {[
              { id: 'escritorio', icono: '🖥️', detalle: 'Fuente, placa madre, CPU, RAM, SSD, tarjeta de video… y luego monitor, teclado y mouse.' },
              { id: 'laptop', icono: '💻', detalle: 'Placa con CPU soldado, RAM, SSD, batería, teclado, trackpad y pantalla.' },
            ].map((o) => {
              const r = records[`${o.id}${reto ? '-reto' : ''}`];
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => abrir(o.id)}
                  className="text-left p-5 rounded-2xl bg-black/30 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{o.icono}</span>
                    <span className="text-[10px] font-mono-tech text-slate-500">{ARMADOS[o.id].pasos.length} piezas</span>
                  </div>
                  <div className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">Armar {ARMADOS[o.id].titulo} →</div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1">{o.detalle}</p>
                  {r && <p className="text-[11px] font-mono-tech text-emerald-400 mt-3">🏆 Tu mejor tiempo: {reloj(r.segundos)} · {r.errores} errores</p>}
                </button>
              );
            })}
          </div>

          <label className="inline-flex items-center gap-3 text-sm text-slate-300 cursor-pointer select-none">
            <input type="checkbox" checked={reto} onChange={(e) => setReto(e.target.checked)} className="w-4 h-4 accent-cyan-400" />
            <span><strong className="text-white">Modo reto:</strong> sin siluetas de ayuda ni pistas. Solo tú y lo que aprendiste.</span>
          </label>

          {alumno && alumno !== 'nada' && (
            <p className="text-xs text-emerald-300/90 mt-4 leading-relaxed">
              ☁️ Tu mejor tiempo y tu captura se guardan con tu cuenta: <strong className="text-emerald-200">{alumno.ficha.nombre}</strong> · {alumno.ficha.grupo}.
            </p>
          )}
          {!alumno && (
            <p className="text-xs text-amber-300/90 mt-4 leading-relaxed">
              ⚠️ No has entrado con tu cuenta. Puedes practicar, pero tu tiempo no le llegará a tu profesor.
              Entra al inicio de esta sesión (paso 1) y regresa aquí.
            </p>
          )}
        </div>
      </div>

      {abierto && createPortal(
        <Taller
          key={`${abierto.armado}-${abierto.reto}`}
          armado={abierto.armado}
          reto={abierto.reto}
          alumno={alumno && alumno !== 'nada' ? alumno : null}
          onCambiar={(armado) => setAbierto({ armado, reto: abierto.reto })}
          onCerrar={() => setAbierto(null)}
        />,
        document.body,
      )}
    </>
  );
}

function Taller({ armado, reto, alumno, onCambiar, onCerrar }) {
  const A = ARMADOS[armado];
  const lienzoRef = useRef(null);
  const motorRef = useRef(null);
  const eventoRef = useRef(() => {});

  const [intento, setIntento] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [falla, setFalla] = useState('');
  const [ayuda, setAyuda] = useState(true);
  const [hechos, setHechos] = useState([]);
  const [errores, setErrores] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [corriendo, setCorriendo] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [ficha, setFicha] = useState(null);
  const [enMano, setEnMano] = useState(null);
  const [listo, setListo] = useState(false);
  const [encendiendo, setEncendiendo] = useState(false);
  const [fin, setFin] = useState(null);
  const [lista, setLista] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [captura, setCaptura] = useState(null);
  const [nube, setNube] = useState(null); // guardando | nuevo | mejorado | no-mejoro | error | sin-cuenta

  // Reiniciar = volver a montar todo desde cero.
  const reiniciar = () => {
    setHechos([]); setErrores(0); setSegundos(0); setCorriendo(false); setMensaje(null);
    setFicha(null); setEnMano(null); setListo(false); setEncendiendo(false); setFin(null); setResultado(null);
    setCaptura(null); setNube(null);
    setIntento((n) => n + 1);
  };

  const avisar = (tipo, texto) => setMensaje({ tipo, texto, id: Date.now() + Math.random() });

  eventoRef.current = (e) => {
    switch (e.tipo) {
      case 'progreso': setHechos(e.hechos); break;
      case 'agarrar':
        setEnMano(e.paso); setFicha(null);
        if (!corriendo && !fin) setCorriendo(true);
        break;
      case 'soltar': setEnMano(null); break;
      case 'instalado':
        setHechos(e.hechos);
        setFicha({ ...e.paso, recien: true });
        avisar('ok', `✓ ${e.paso.nombre} en su lugar`);
        break;
      case 'error':
        setErrores((n) => n + 1);
        avisar('error', e.mensaje);
        break;
      case 'aviso': avisar('info', e.mensaje); break;
      case 'info': setFicha(e.paso || e.fijo); break;
      case 'listo':
        setListo(true);
        avisar('ok', '¡Todo conectado! Ya puedes encenderlo.');
        break;
      case 'encendido': {
        setCorriendo(false);
        // Se espera a que la pantalla diga "¡Funciona!" antes de la foto.
        setTimeout(async () => {
          let url = null;
          try {
            const base = motorRef.current?.captura();
            if (base) {
              url = await componerCaptura(base, {
                quien: alumno ? `${alumno.ficha.nombre} · ${alumno.ficha.grupo}` : 'Sin cuenta',
                que: A.nombre, segundos: segundosRef.current, errores: erroresRef.current, reto,
              });
            }
          } catch (err) {
            console.error('[taller-3d] captura', err);
          }
          setCaptura(url);
          setFin(true);
        }, 1400);
        break;
      }
      default: break;
    }
  };

  // Los valores al momento del evento, no los de cuando se creó el closure.
  const segundosRef = useRef(0);
  const erroresRef = useRef(0);
  segundosRef.current = segundos;
  erroresRef.current = errores;

  // Montar el motor 3D.
  useEffect(() => {
    let vivo = true;
    setCargando(true);
    setFalla('');
    if (!hayWebGL()) {
      setFalla('Este navegador no puede mostrar gráficos 3D. Prueba con Chrome actualizado o en otra computadora.');
      setCargando(false);
      return undefined;
    }
    import('../lib/taller-3d/motor.js')
      .then(({ crearTaller }) => {
        if (!vivo || !lienzoRef.current) return;
        motorRef.current = crearTaller(lienzoRef.current, {
          armado,
          guia: !reto,
          onEvento: (e) => eventoRef.current(e),
        });
        if (import.meta.env.DEV) window.__taller = motorRef.current;
        setCargando(false);
      })
      .catch((err) => {
        console.error('[taller-3d]', err);
        if (vivo) {
          setFalla('No se pudo cargar el taller. Revisa tu conexión y vuelve a intentarlo.');
          setCargando(false);
        }
      });
    return () => {
      vivo = false;
      motorRef.current?.destruir();
      motorRef.current = null;
    };
  }, [armado, reto, intento]);

  // Cronómetro.
  useEffect(() => {
    if (!corriendo) return undefined;
    const t = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [corriendo]);

  // La ficha de una pieza recién instalada se va sola; la que el alumno pidió
  // tocando una pieza se queda hasta que la cierre.
  useEffect(() => {
    if (!ficha?.recien) return undefined;
    const t = setTimeout(() => setFicha((f) => (f === ficha ? null : f)), 7000);
    return () => clearTimeout(t);
  }, [ficha]);

  // Los avisos se van solos.
  useEffect(() => {
    if (!mensaje) return undefined;
    const t = setTimeout(() => setMensaje(null), mensaje.tipo === 'error' ? 4800 : 2800);
    return () => clearTimeout(t);
  }, [mensaje]);

  // Sin scroll de fondo y Esc para salir.
  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;
  useEffect(() => {
    const previo = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const tecla = (e) => { if (e.key === 'Escape') cerrarRef.current(); };
    window.addEventListener('keydown', tecla);
    return () => {
      document.body.style.overflow = previo;
      window.removeEventListener('keydown', tecla);
    };
  }, []);

  // Al terminar, se guarda el récord una sola vez.
  useEffect(() => {
    if (!fin || resultado) return;
    setResultado(guardarRecord(`${armado}${reto ? '-reto' : ''}`, segundos, errores));
    if (!alumno) { setNube('sin-cuenta'); return; }
    if (!captura) { setNube('error'); return; }
    setNube('guardando');
    import('../lib/taller3d')
      .then(({ guardarTaller }) => guardarTaller(alumno.user, alumno.ficha, { armado, reto, segundos, errores, captura }))
      .then((r) => setNube(r.estado))
      .catch((err) => { console.error('[taller-3d] guardar', err); setNube('error'); });
  }, [fin]); // eslint-disable-line react-hooks/exhaustive-deps

  const pasos = A.pasos;
  const siguiente = useMemo(
    () => pasos.find((p) => !hechos.includes(p.id) && p.requiere.every((r) => hechos.includes(r))),
    [pasos, hechos],
  );

  const encender = () => {
    setEncendiendo(true);
    motorRef.current?.encender();
  };

  // Para el resumen final: qué pieza fue de qué tipo.
  const porCategoria = useMemo(() => {
    const m = {};
    for (const p of pasos) {
      const nombre = p.nombre.replace(/ \(.*\)$/, '');
      if (!m[p.categoria]) m[p.categoria] = new Set();
      m[p.categoria].add(nombre);
    }
    // Primero el esquema clásico entrada → proceso → almacenamiento → salida.
    const orden = ['Entrada', 'Procesamiento', 'Memoria', 'Almacenamiento', 'Salida'];
    const lugar = (c) => (orden.includes(c) ? orden.indexOf(c) : orden.length);
    return Object.entries(m).sort((a, b) => lugar(a[0]) - lugar(b[0]));
  }, [pasos]);

  const otro = armado === 'escritorio' ? 'laptop' : 'escritorio';

  return (
    <div className="fixed inset-0 z-[300] flex flex-col bg-[#0b1220] text-slate-200" role="dialog" aria-modal="true" aria-label={`Taller 3D: arma ${A.titulo}`}>
      {/* ── Barra superior ── */}
      <header className="flex items-center gap-2 px-3 sm:px-4 py-2 border-b border-white/10 bg-black/50 flex-shrink-0">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest truncate">Taller 3D{reto ? ' · Modo reto' : ''}</p>
          <h2 className="text-sm sm:text-base font-bold text-white truncate">Arma {A.titulo}</h2>
        </div>
        <Chip titulo="Tiempo" siempre>⏱ {reloj(segundos)}</Chip>
        <Chip titulo="Piezas instaladas" clase="text-emerald-300 border-emerald-500/30">✓ {hechos.length}/{pasos.length}</Chip>
        <Chip titulo="Errores" clase={errores ? 'text-rose-300 border-rose-500/40' : ''}>✗ {errores}</Chip>
        <div className="flex items-center gap-1 ml-1">
          <Boton titulo="Centrar la vista" onClick={() => motorRef.current?.encuadrar()}>🎯</Boton>
          <Boton titulo="Empezar de nuevo" onClick={reiniciar}>↺</Boton>
          <Boton titulo="Salir del taller" onClick={onCerrar}>✕</Boton>
        </div>
      </header>

      <div className="relative flex-1 min-h-0">
        <div ref={lienzoRef} className="absolute inset-0" />

        {cargando && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm font-mono-tech text-cyan-300 animate-pulse">Preparando el taller…</p>
          </div>
        )}
        {falla && (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div className="glass-card rounded-2xl p-6 border border-rose-500/30 max-w-md text-center">
              <p className="text-3xl mb-3">😕</p>
              <p className="text-sm text-slate-200 mb-5">{falla}</p>
              <button type="button" className="btn-primary text-sm px-5 py-2.5" onClick={onCerrar}>Volver a la sesión</button>
            </div>
          </div>
        )}

        {/* ── Siguiente paso (solo en modo guía) ── */}
        {!reto && !cargando && !falla && !listo && siguiente && !enMano && (
          <div className="absolute top-3 left-3 max-w-[calc(100%-7rem)] sm:max-w-xs pointer-events-none">
            <div className="rounded-xl px-3.5 py-2.5 bg-black/60 border border-cyan-500/30 backdrop-blur-sm">
              <p className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest">Siguiente</p>
              <p className="text-sm font-bold text-white leading-snug">{siguiente.nombre}</p>
            </div>
          </div>
        )}

        {/* ── Pieza en la mano ── */}
        {enMano && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 pointer-events-none">
            <div className="rounded-full px-4 py-2 bg-cyan-500/20 border border-cyan-400/50 text-sm font-bold text-cyan-100 whitespace-nowrap backdrop-blur-sm">
              ✋ {enMano.nombre}
            </div>
          </div>
        )}

        {/* ── Lista de pasos ── */}
        {!cargando && !falla && (
          <>
            <button
              type="button"
              onClick={() => setLista((v) => !v)}
              className="absolute top-3 right-3 lg:hidden rounded-xl px-3 py-2 bg-black/60 border border-white/15 text-xs font-mono-tech text-slate-200"
              aria-expanded={lista}
            >
              📋 Lista {hechos.length}/{pasos.length}
            </button>
            <aside className={`${lista ? 'block' : 'hidden'} lg:block absolute right-3 top-14 lg:top-3 w-64 max-h-[calc(100%-7rem)] lg:max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-2xl bg-black/65 border border-white/10 backdrop-blur-sm p-3`}>
              <p className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest mb-2 px-1">Orden de armado</p>
              <ol className="space-y-1">
                {pasos.map((p, i) => {
                  const hecho = hechos.includes(p.id);
                  const puede = p.requiere.every((r) => hechos.includes(r));
                  const actual = !reto && siguiente?.id === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setFicha(p)}
                        className={`w-full text-left flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${actual ? 'bg-cyan-500/15 border border-cyan-500/40' : 'border border-transparent hover:bg-white/5'}`}
                      >
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono-tech flex-shrink-0 ${hecho ? 'bg-emerald-500 text-black' : puede ? 'bg-white/10 text-slate-200' : 'bg-white/5 text-slate-600'}`}>
                          {hecho ? '✓' : i + 1}
                        </span>
                        <span className={hecho ? 'text-slate-500 line-through' : puede ? 'text-slate-100' : 'text-slate-500'}>{p.nombre}</span>
                      </button>
                    </li>
                  );
                })}
              </ol>
              {reto && <p className="text-[10px] text-slate-500 mt-3 px-1 leading-relaxed">Modo reto: la lista no marca el siguiente paso. El orden lo decides tú.</p>}
            </aside>
          </>
        )}

        {/* ── Aviso ── */}
        {mensaje && (
          <div className="absolute bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] max-w-lg pointer-events-none" role="status" aria-live="polite">
            <div className={`rounded-xl px-4 py-3 text-sm leading-snug border backdrop-blur-sm text-center ${
              mensaje.tipo === 'error' ? 'bg-rose-950/85 border-rose-500/50 text-rose-100'
                : mensaje.tipo === 'ok' ? 'bg-emerald-950/85 border-emerald-500/50 text-emerald-100'
                  : 'bg-slate-900/90 border-white/15 text-slate-100'}`}
            >
              {mensaje.tipo === 'error' && <strong className="block text-rose-300 text-xs font-mono-tech uppercase tracking-widest mb-0.5">Todavía no</strong>}
              {mensaje.texto}
            </div>
          </div>
        )}

        {/* ── Ficha de la pieza ── */}
        {/* No atrapa toques (salvo la ✕): debajo puede haber piezas en la mesa. */}
        {ficha && !fin && (
          <div className="absolute left-3 right-3 bottom-3 sm:right-auto sm:w-96 pointer-events-none">
            <div className="rounded-2xl bg-slate-950/90 border border-white/15 backdrop-blur-sm p-4 shadow-2xl">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`inline-block text-[10px] font-mono-tech uppercase tracking-widest px-2 py-0.5 rounded border ${colorCat(ficha.categoria)}`}>{ficha.categoria}</span>
                  <h4 className="text-base font-bold text-white mt-1.5">{ficha.recien ? '✓ ' : ''}{ficha.nombre}</h4>
                </div>
                <button type="button" onClick={() => setFicha(null)} className="pointer-events-auto text-slate-400 hover:text-white text-lg leading-none p-1" aria-label="Cerrar ficha">✕</button>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{ficha.funcion}</p>
              {ficha.dato && <p className="text-[11px] sm:text-xs font-mono-tech text-slate-400 leading-relaxed border-t border-white/10 pt-2 mt-3">💡 {ficha.dato}</p>}
            </div>
          </div>
        )}

        {/* ── Encender ── */}
        {listo && !encendiendo && (
          <div className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none">
            <button type="button" onClick={encender} className="pointer-events-auto btn-primary text-base px-8 py-4 shadow-2xl animate-pulse">
              ⏻ Encender
            </button>
          </div>
        )}

        {/* ── Cómo se juega ── */}
        {ayuda && !cargando && !falla && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/55">
            <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 max-w-md w-full bg-slate-950/90">
              <p className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest mb-1">Antes de empezar</p>
              <h3 className="text-xl font-black text-white mb-4">Así se usa el taller</h3>
              <ul className="space-y-3 text-sm text-slate-300 mb-6">
                <li className="flex gap-3"><span>✋</span><span><strong className="text-white">Arrastra una pieza</strong> con el dedo o el mouse y suéltala en su lugar.</span></li>
                {!reto && <li className="flex gap-3"><span>🟢</span><span>Mientras la llevas, una <strong className="text-emerald-300">silueta verde</strong> marca dónde va. Si sale <strong className="text-rose-300">roja</strong>, falta instalar algo antes.</span></li>}
                <li className="flex gap-3"><span>🔄</span><span>Arrastra el <strong className="text-white">fondo</strong> para girar la vista. Con dos dedos (o la rueda del mouse) acercas y alejas.</span></li>
                <li className="flex gap-3"><span>👆</span><span><strong className="text-white">Toca una pieza</strong> sin moverla para ver qué es y para qué sirve.</span></li>
                <li className="flex gap-3"><span>⚡</span><span>Como técnico de verdad: <strong className="text-white">la corriente se conecta al final.</strong></span></li>
              </ul>
              <button type="button" className="btn-primary w-full text-sm py-3" onClick={() => { setAyuda(false); setCorriendo(true); }}>
                ¡A armar!
              </button>
            </div>
          </div>
        )}

        {/* ── Final ── */}
        {fin && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/60 overflow-y-auto">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-emerald-500/40 max-w-lg w-full bg-slate-950/95 my-auto">
              <p className="text-[10px] font-mono-tech text-emerald-400 uppercase tracking-widest mb-1">Equipo encendido</p>
              <h3 className="text-2xl font-black text-white mb-4">¡{A.titulo[0].toUpperCase() + A.titulo.slice(1)} funciona! 🎉</h3>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
                  <div className="text-2xl font-black font-mono-tech text-cyan-300">{reloj(segundos)}</div>
                  <div className="text-[10px] font-mono-tech text-slate-500 uppercase mt-1">Tiempo</div>
                </div>
                <div className="rounded-xl bg-black/40 border border-white/10 p-3 text-center">
                  <div className={`text-2xl font-black font-mono-tech ${errores ? 'text-rose-300' : 'text-emerald-300'}`}>{errores}</div>
                  <div className="text-[10px] font-mono-tech text-slate-500 uppercase mt-1">Errores</div>
                </div>
              </div>
              {resultado?.mejor && resultado.previo && <p className="text-sm text-emerald-300 mb-4">🏆 ¡Nuevo récord! Antes: {reloj(resultado.previo.segundos)}</p>}
              {resultado && !resultado.mejor && <p className="text-xs text-slate-400 mb-4">Tu mejor tiempo sigue siendo {reloj(resultado.previo.segundos)}.</p>}

              <EstadoNube nube={nube} />
              {captura && (
                <div className="mb-5">
                  <img src={captura} alt="Captura de tu armado terminado" className="w-full rounded-xl border border-white/10 mb-2" />
                  <a
                    href={captura}
                    download={`taller3d-${armado}${reto ? '-reto' : ''}-${reloj(segundos).replace(':', 'm')}s.jpg`}
                    className="flex items-center justify-center gap-2 w-full text-sm py-2.5 rounded-xl border border-cyan-400/40 text-cyan-200 hover:bg-cyan-500/10 transition"
                  >
                    📸 Descargar captura
                  </a>
                </div>
              )}

              <p className="text-[10px] font-mono-tech text-slate-400 uppercase tracking-widest mb-2">Lo que armaste, por función</p>
              <div className="space-y-1.5 mb-6">
                {porCategoria.map(([cat, nombres]) => (
                  <div key={cat} className="flex items-start gap-2 text-xs">
                    <span className={`flex-shrink-0 text-[10px] font-mono-tech uppercase px-2 py-0.5 rounded border ${colorCat(cat)}`}>{cat}</span>
                    <span className="text-slate-300 leading-relaxed">{[...nombres].join(', ')}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button type="button" className="btn-primary flex-1 text-sm py-3" onClick={reiniciar}>↺ Armar otra vez</button>
                <button type="button" className="flex-1 text-sm py-3 rounded-xl border border-white/15 hover:border-cyan-400/50 hover:bg-cyan-500/10 transition" onClick={() => onCambiar(otro)}>
                  Armar {ARMADOS[otro].titulo} →
                </button>
              </div>
              <button type="button" className="w-full text-xs text-slate-500 hover:text-slate-300 mt-4" onClick={onCerrar}>Volver a la sesión</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EstadoNube({ nube }) {
  if (!nube) return null;
  const t = {
    guardando: ['text-slate-300 border-white/15 bg-white/5', '☁️ Guardando tu tiempo…'],
    nuevo: ['text-emerald-200 border-emerald-500/40 bg-emerald-500/10', '✓ Guardado. Tu profesor ya puede ver tu tiempo y tu captura.'],
    mejorado: ['text-emerald-200 border-emerald-500/40 bg-emerald-500/10', '✓ ¡Mejoraste tu tiempo! Se guardó el nuevo, con su captura.'],
    'no-mejoro': ['text-slate-300 border-white/15 bg-white/5', 'Tu tiempo guardado sigue siendo mejor que este, así que se quedó el anterior. ¡Inténtalo otra vez!'],
    error: ['text-rose-200 border-rose-500/40 bg-rose-500/10', 'No se pudo guardar (¿sin internet?). Descarga tu captura y mándasela a tu profesor.'],
    'sin-cuenta': ['text-amber-200 border-amber-500/40 bg-amber-500/10', 'No entraste con tu cuenta, así que esto no se guardó. Descarga tu captura y mándasela a tu profesor.'],
  }[nube];
  return <p className={`text-xs leading-relaxed rounded-xl border px-3 py-2.5 mb-4 ${t[0]}`} role="status">{t[1]}</p>;
}

function Chip({ children, titulo, clase = '', siempre = false }) {
  return (
    <span title={titulo} className={`${siempre ? 'inline-flex' : 'hidden sm:inline-flex'} items-center text-xs font-mono-tech px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-200 whitespace-nowrap ${clase}`}>
      {children}
    </span>
  );
}

function Boton({ children, titulo, onClick }) {
  return (
    <button type="button" title={titulo} aria-label={titulo} onClick={onClick} className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-400/50 hover:bg-cyan-500/10 text-slate-200 text-sm flex items-center justify-center transition">
      {children}
    </button>
  );
}

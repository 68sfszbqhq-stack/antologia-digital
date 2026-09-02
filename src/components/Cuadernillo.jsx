import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import {
  ARCHIVO, PAGINAS, PAGINA_INICIAL, SECCIONES, OPCIONES, TOTAL,
  PAGINA, preguntasDePagina, paginaDePregunta, seccionDe,
} from '../lib/cuadernillo-ediems.js';
import { u } from '../lib/url';

/* El cuadernillo de ingreso, en versión web.
 *
 * POR QUÉ SE MUESTRA EL PDF Y NO SE TRANSCRIBE EL TEXTO. El examen trae
 * diagramas de Lewis, una tabla periódica, mapas mentales y carteles
 * publicitarios sobre los que se pregunta directamente. Pasarlo a HTML
 * significaría reacomodar esas imágenes a mano, con el riesgo de que una quede
 * mal y la pregunta deje de tener sentido —o peor, que tenga otro—. Aquí el
 * alumno ve la hoja EXACTA que vería en papel; lo único que cambia es que
 * rellena el círculo con el dedo.
 *
 * DOS FORMAS SEGÚN LA PANTALLA, y no es un capricho de diseño:
 *
 *   · En computadora: la hoja a la izquierda y, a la derecha, las preguntas de
 *     esa hoja. Las dos cosas caben a la vez, así que se ven a la vez.
 *   · En celular: la hoja arriba y abajo una barra fija que se desliza de lado,
 *     una pregunta a la vez. En un celular no cabe todo, y obligar al alumno a
 *     subir y bajar entre la pregunta y sus opciones es la forma más segura de
 *     que marque la casilla equivocada. Deslizar de lado avanza también la hoja
 *     de arriba: nunca están viendo una pregunta y contestando otra.
 *
 * NO HAY CLAVE DE RESPUESTAS. El cuadernillo es el del alumno y no la trae, así
 * que esto guarda lo que contestó, sin calificar. La clave la carga el profesor
 * después. Es deliberado: inventar una clave para que la pantalla muestre un
 * porcentaje sería peor que no mostrar ninguno.
 */

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

/* DOS RESPALDOS, Y LOS DOS HACEN FALTA.
 *
 * Un examen de 150 minutos que se pierde no se puede volver a aplicar: la
 * segunda vez el alumno ya conoce el cuadernillo. Por eso lo contestado se
 * guarda por partida doble:
 *
 *   · En el navegador, en cada toque. Instantáneo y funciona sin internet, pero
 *     vive en ESE aparato: si el alumno cambia de celular, no le sirve.
 *   · En la nube, unos segundos después de dejar de marcar (`onAvance`). Tarda
 *     un poco y necesita señal, pero le permite volver desde donde sea.
 *
 * Se espera a que deje de marcar en vez de mandar en cada toque porque, marcando
 * a buen ritmo, serían ochenta y ocho escrituras seguidas contra la base.
 */
const BORRADOR = 'antologia:cuadernillo-ediems';

/** Cuánto se espera, sin que el alumno toque nada, antes de mandar a la nube. */
const ESPERA_GUARDADO = 4000;

export default function Cuadernillo({ onFinalizar, onAvance, respuestasIniciales = null }) {
  const [pagina, setPagina] = useState(PAGINA_INICIAL);
  const [activa, setActiva] = useState(1);
  const [respuestas, setRespuestas] = useState(() => {
    // Manda lo que venga de la nube: es lo que permite retomar en otro aparato.
    // El borrador local es el respaldo para cuando no hay nada guardado allá.
    if (respuestasIniciales && Object.keys(respuestasIniciales).length) {
      return { ...respuestasIniciales };
    }
    try { return JSON.parse(localStorage.getItem(BORRADOR) || '{}'); } catch { return {}; }
  });
  const [hoja, setHoja] = useState(false);
  const [confirmar, setConfirmar] = useState(false);

  const contestadas = Object.keys(respuestas).length;

  const relojGuardado = useRef(null);
  const onAvanceRef = useRef(onAvance);
  onAvanceRef.current = onAvance;

  /** Programa el envío a la nube; cada toque nuevo reinicia la cuenta. */
  const programarGuardado = useCallback((respuestasAhora) => {
    if (!onAvanceRef.current) return;
    clearTimeout(relojGuardado.current);
    relojGuardado.current = setTimeout(() => {
      onAvanceRef.current?.(armarEntrega(respuestasAhora));
    }, ESPERA_GUARDADO);
  }, []);

  // Si el alumno cierra la pestaña con un guardado pendiente, se manda ya.
  useEffect(() => {
    const alSalir = () => {
      if (relojGuardado.current) {
        clearTimeout(relojGuardado.current);
        onAvanceRef.current?.(armarEntrega(respuestas));
      }
    };
    window.addEventListener('pagehide', alSalir);
    return () => {
      window.removeEventListener('pagehide', alSalir);
      clearTimeout(relojGuardado.current);
    };
  }, [respuestas]);

  const responder = useCallback((n, letra) => {
    setRespuestas((prev) => {
      // Volver a tocar la misma opción la borra: en papel se puede borrar, y
      // las instrucciones del cuadernillo dicen expresamente que es preferible
      // no marcar nada a marcar al azar.
      const sig = { ...prev };
      if (sig[n] === letra) delete sig[n]; else sig[n] = letra;
      try { localStorage.setItem(BORRADOR, JSON.stringify(sig)); } catch { /* da igual */ }
      programarGuardado(sig);
      return sig;
    });
  }, [programarGuardado]);

  /** Ir a una pregunta: manda la hoja a su página. */
  const irAPregunta = useCallback((n) => {
    const m = Math.min(TOTAL, Math.max(1, n));
    setActiva(m);
    setPagina(paginaDePregunta(m));
    setHoja(false);
  }, []);

  /** Cambiar de página: la pregunta activa pasa a ser la primera de esa hoja. */
  const cambiarPagina = useCallback((p) => {
    const q = typeof p === 'function' ? p(pagina) : p;
    const destino = Math.min(PAGINAS, Math.max(1, q));
    setPagina(destino);
    const v = preguntasVisibles(destino);
    if (v.length) setActiva(v[0]);
  }, [pagina]);

  const entregar = () => {
    // El guardado parcial que estuviera en camino ya no sirve: lo que sigue es
    // la entrega completa, que lo incluye todo.
    clearTimeout(relojGuardado.current);
    relojGuardado.current = null;
    try { localStorage.removeItem(BORRADOR); } catch { /* da igual */ }
    onFinalizar(armarEntrega(respuestas));
  };

  const visibles = useMemo(() => preguntasVisibles(pagina), [pagina]);
  const seccion = seccionDe(activa);

  return (
    <div>
      <BarraAvance contestadas={contestadas} onAbrirHoja={() => setHoja(true)} />

      {/* En celular la barra de abajo va fija, así que hay que dejarle su
          espacio o tapa el final de la hoja. */}
      <div className="grid lg:grid-cols-[minmax(0,1fr)_21rem] gap-5 items-start pb-44 lg:pb-0">

        {/* ── la hoja ── */}
        <div className="min-w-0">
          <VisorPDF pagina={pagina} onPagina={cambiarPagina} />
        </div>

        {/* ── respuestas: solo en computadora ── */}
        <aside className="hidden lg:block lg:sticky lg:top-20 min-w-0">
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between gap-2"
                 style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-widest truncate">
                {seccion ? seccion.nombre : 'Cuadernillo'}
              </span>
              <span className="text-[11px] font-mono-tech text-slate-500 shrink-0">pág. {pagina}</span>
            </div>

            <div className="p-4 space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
              {visibles.length === 0 ? (
                <p className="text-sm text-slate-500 leading-relaxed">
                  Esta página no tiene preguntas nuevas: es la continuación de la
                  anterior.
                </p>
              ) : (
                visibles.map((n) => (
                  <Reactivo
                    key={n}
                    n={n}
                    valor={respuestas[n]}
                    continuada={PAGINA[n] !== pagina}
                    onResponder={responder}
                  />
                ))
              )}
            </div>

            <div className="px-4 py-3 flex items-center justify-between gap-2"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <button type="button" onClick={() => setHoja(true)}
                      className="text-xs font-mono-tech text-slate-400 hover:text-cyan-400 transition">
                Ver las 88
              </button>
              <button type="button" onClick={() => setConfirmar(true)}
                      className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition">
                Entregar →
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-600 leading-relaxed mt-3 px-1">
            Lo que marcas se guarda en este dispositivo al instante. Si se
            recarga la página, no pierdes nada.
          </p>
        </aside>
      </div>

      {/* ── respuestas: solo en celular ── */}
      <BarraMovil
        activa={activa}
        respuestas={respuestas}
        onActiva={irAPregunta}
        onResponder={responder}
        onAbrirHoja={() => setHoja(true)}
        onEntregar={() => setConfirmar(true)}
      />

      {hoja && (
        <HojaDeRespuestas
          respuestas={respuestas}
          onIr={irAPregunta}
          onResponder={responder}
          onCerrar={() => setHoja(false)}
        />
      )}

      {confirmar && (
        <Confirmacion
          contestadas={contestadas}
          respuestas={respuestas}
          onIr={(n) => { setConfirmar(false); irAPregunta(n); }}
          onCancelar={() => setConfirmar(false)}
          onEntregar={entregar}
        />
      )}
    </div>
  );
}

/* ── barra de respuestas para celular ────────────────────────── */

/* Una tira horizontal con las 88 preguntas, fija al pie de la pantalla.
 *
 * Se desliza con el dedo y cada tarjeta se acomoda sola en el centro
 * (scroll-snap). Al quedarse en una, la hoja de arriba se va a la página de esa
 * pregunta. Es el gesto que ya conoce cualquiera que use un celular, y evita el
 * problema de fondo: en una pantalla chica, la pregunta y sus opciones no caben
 * juntas, y cualquier solución que obligue a subir y bajar termina en respuestas
 * marcadas en el renglón equivocado.
 */
function BarraMovil({ activa, respuestas, onActiva, onResponder, onAbrirHoja, onEntregar }) {
  const tira = useRef(null);
  const propio = useRef(false);   // el desplazamiento lo provocamos nosotros
  const temporizador = useRef(null);

  // Cuando `activa` cambia desde fuera (flechas de la hoja, hoja de respuestas)
  // hay que mover la tira. Si el cambio vino de la propia tira, no: sería
  // pelearse con el dedo del alumno a media pasada.
  useEffect(() => {
    const t = tira.current;
    if (!t || propio.current) { propio.current = false; return; }
    const tarjeta = t.children[activa - 1];
    if (tarjeta) {
      t.scrollTo({ left: tarjeta.offsetLeft - (t.clientWidth - tarjeta.clientWidth) / 2, behavior: 'smooth' });
    }
  }, [activa]);

  // Qué tarjeta quedó en el centro. Se calcula al parar de deslizar, no en cada
  // píxel: si no, la hoja de arriba se volvería a dibujar decenas de veces por
  // pasada y el celular se traba.
  const alDeslizar = () => {
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      const t = tira.current;
      if (!t) return;
      const centro = t.scrollLeft + t.clientWidth / 2;
      let mejor = 1;
      let dist = Infinity;
      for (let i = 0; i < t.children.length; i++) {
        const c = t.children[i];
        const d = Math.abs(c.offsetLeft + c.clientWidth / 2 - centro);
        if (d < dist) { dist = d; mejor = i + 1; }
      }
      if (mejor !== activa) { propio.current = true; onActiva(mejor); }
    }, 120);
  };

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const seccion = seccionDe(activa);

  return (
    <div
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass"
      style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-center justify-between gap-3 px-4 pt-2.5 pb-1">
        <span className="text-[10px] font-mono-tech text-cyan-400 uppercase tracking-widest truncate">
          {seccion?.nombre ?? 'Cuadernillo'}
        </span>
        <div className="flex items-center gap-3 shrink-0">
          <button type="button" onClick={onAbrirHoja}
                  className="text-[11px] font-mono-tech text-slate-400 hover:text-cyan-400 transition">
            Las 88
          </button>
          <button type="button" onClick={onEntregar}
                  className="text-[11px] font-semibold text-cyan-400">
            Entregar
          </button>
        </div>
      </div>

      <div
        ref={tira}
        onScroll={alDeslizar}
        className="flex gap-3 overflow-x-auto px-[12vw] pb-3 pt-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {Array.from({ length: TOTAL }, (_, i) => i + 1).map((n) => (
          <TarjetaMovil
            key={n}
            n={n}
            valor={respuestas[n]}
            atenuada={n !== activa}
            onResponder={onResponder}
          />
        ))}
      </div>

      {/* Flechas, para quien prefiera tocar a deslizar. */}
      <div className="flex items-center justify-between px-4 pb-2.5">
        <button
          type="button" onClick={() => onActiva(activa - 1)} disabled={activa <= 1}
          className="text-xs font-mono-tech text-slate-500 disabled:opacity-25 px-2 py-1"
        >
          ← anterior
        </button>
        <span className="text-[11px] font-mono-tech text-slate-500 tabular-nums">
          {activa} de {TOTAL}
        </span>
        <button
          type="button" onClick={() => onActiva(activa + 1)} disabled={activa >= TOTAL}
          className="text-xs font-mono-tech text-slate-500 disabled:opacity-25 px-2 py-1"
        >
          siguiente →
        </button>
      </div>
    </div>
  );
}

function TarjetaMovil({ n, valor, atenuada, onResponder }) {
  return (
    <div
      className={`snap-center shrink-0 w-[76vw] max-w-sm rounded-xl border p-3 transition-opacity duration-200 ${
        valor ? 'border-cyan-400/40 bg-cyan-400/[0.07]' : 'border-white/10 bg-white/[0.02]'
      } ${atenuada ? 'opacity-45' : 'opacity-100'}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-black text-white tabular-nums">Pregunta {n}</span>
        {valor && <span className="text-[11px] font-mono-tech text-cyan-400">marcada: {valor}</span>}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {OPCIONES.map((letra) => {
          const activo = valor === letra;
          return (
            <button
              key={letra}
              type="button"
              onClick={() => onResponder(n, letra)}
              aria-pressed={activo}
              aria-label={`Pregunta ${n}, opción ${letra}`}
              className={`h-12 rounded-lg font-mono-tech font-bold text-base border transition-all duration-150 ${
                activo
                  ? 'bg-cyan-400/25 border-cyan-400/70 text-cyan-200'
                  : 'bg-white/[0.04] border-white/10 text-slate-400 active:bg-white/10'
              }`}
            >
              {letra}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── visor ───────────────────────────────────────────────────── */

function VisorPDF({ pagina, onPagina }) {
  const lienzo = useRef(null);
  const caja = useRef(null);
  const docRef = useRef(null);
  const tareaRef = useRef(null);
  const [estado, setEstado] = useState('cargando'); // cargando | listo | falla
  const [zoom, setZoom] = useState(1);

  // El documento se abre UNA vez y se guarda; volver a abrirlo en cada cambio
  // de página descargaría los 790 kB otra vez, que en el salón se nota.
  useEffect(() => {
    let vivo = true;
    // pdf.js pide el parámetro con nombre: pasarle la ruta suelta deja de
    // funcionar a partir de la versión 6. Y la ruta va absoluta porque quien la
    // resuelve es el worker, que no comparte la página actual.
    const tarea = pdfjs.getDocument({
      url: new URL(u(ARCHIVO), window.location.href).href,
    });
    tarea.promise.then(
      (doc) => { if (vivo) { docRef.current = doc; setEstado('listo'); } },
      (e) => {
        if (!vivo) return;
        // Se registra en consola además de mostrar el aviso: cuando esto falla
        // en un salón, el mensaje amable no basta para saber por qué.
        console.error('[cuadernillo] no se pudo abrir el PDF:', e);
        setEstado('falla');
      },
    );
    return () => { vivo = false; tarea.destroy?.(); };
  }, []);

  const dibujar = useCallback(async () => {
    const doc = docRef.current;
    const cv = lienzo.current;
    if (!doc || !cv) return;

    // Si el alumno pasa páginas rápido, el dibujo anterior sigue corriendo y
    // los dos escribirían sobre el mismo lienzo. Se cancela el que quedó.
    tareaRef.current?.cancel();

    const p = await doc.getPage(pagina);
    const ancho = (caja.current?.clientWidth ?? 700) * zoom;
    const base = p.getViewport({ scale: 1 });
    // El dibujo se hace a la densidad real de la pantalla; si no, en un celular
    // el texto del examen sale borroso y hay preguntas que no se pueden leer.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const escala = (ancho / base.width) * dpr;
    const vista = p.getViewport({ scale: escala });

    cv.width = Math.floor(vista.width);
    cv.height = Math.floor(vista.height);
    cv.style.width = `${Math.floor(vista.width / dpr)}px`;
    cv.style.height = `${Math.floor(vista.height / dpr)}px`;

    const tarea = p.render({ canvasContext: cv.getContext('2d'), viewport: vista });
    tareaRef.current = tarea;
    try { await tarea.promise; } catch { /* cancelada: no pasa nada */ }
  }, [pagina, zoom]);

  useEffect(() => { if (estado === 'listo') dibujar(); }, [estado, dibujar]);

  useEffect(() => {
    const alRedimensionar = () => { if (estado === 'listo') dibujar(); };
    window.addEventListener('resize', alRedimensionar);
    return () => window.removeEventListener('resize', alRedimensionar);
  }, [estado, dibujar]);

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <BotonIcono onClick={() => onPagina((p) => p - 1)} rotulo="Página anterior" desactivado={pagina <= 1}>
            <path d="M15 18l-6-6 6-6" />
          </BotonIcono>
          <span className="text-xs font-mono-tech text-slate-400 tabular-nums px-1">
            {pagina} / {PAGINAS}
          </span>
          <BotonIcono onClick={() => onPagina((p) => p + 1)} rotulo="Página siguiente" desactivado={pagina >= PAGINAS}>
            <path d="M9 18l6-6-6-6" />
          </BotonIcono>
        </div>

        <div className="flex items-center gap-1.5">
          <BotonIcono onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} rotulo="Reducir">
            <circle cx="11" cy="11" r="7" /><path d="M8 11h6M21 21l-4.3-4.3" />
          </BotonIcono>
          <BotonIcono onClick={() => setZoom((z) => Math.min(3, z + 0.2))} rotulo="Ampliar">
            <circle cx="11" cy="11" r="7" /><path d="M11 8v6M8 11h6M21 21l-4.3-4.3" />
          </BotonIcono>
          <a
            href={u(ARCHIVO)} target="_blank" rel="noopener"
            className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition"
            aria-label="Abrir el cuadernillo en otra pestaña"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
            </svg>
          </a>
        </div>
      </div>

      {/* En celular la hoja ocupa la mitad de arriba y la barra de respuestas la
          de abajo; en computadora puede crecer, porque las respuestas van al
          lado y no le quitan espacio. */}
      <div
        ref={caja}
        className="glass-card rounded-2xl border border-white/10 p-2 sm:p-3 overflow-auto max-h-[52vh] lg:max-h-[calc(100vh-12rem)]"
      >
        {estado === 'cargando' && (
          <div className="py-20 text-center">
            <div className="inline-block w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            <p className="text-sm text-slate-400 mt-3 font-mono-tech">Abriendo el cuadernillo…</p>
          </div>
        )}

        {estado === 'falla' && (
          <div className="py-16 px-6 text-center">
            <p className="text-sm text-amber-300 mb-4">
              No se pudo abrir el cuadernillo dentro de la página.
            </p>
            <a href={u(ARCHIVO)} target="_blank" rel="noopener" className="btn-primary px-5 py-2.5">
              Abrirlo en otra pestaña
            </a>
            <p className="text-xs text-slate-600 mt-4">
              Puedes contestar igual: deja el PDF abierto en la otra pestaña y
              regresa aquí a marcar.
            </p>
          </div>
        )}

        <canvas
          ref={lienzo}
          className="mx-auto rounded-lg bg-white"
          style={{ display: estado === 'listo' ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
}

function BotonIcono({ children, onClick, rotulo, desactivado = false }) {
  return (
    <button
      type="button" onClick={onClick} disabled={desactivado} aria-label={rotulo}
      className="w-9 h-9 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 disabled:opacity-30 disabled:pointer-events-none transition"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </button>
  );
}

/* ── un reactivo (computadora) ───────────────────────────────── */

function Reactivo({ n, valor, continuada, onResponder }) {
  return (
    <div className={`rounded-xl border p-3 transition-colors ${valor ? 'border-cyan-400/40 bg-cyan-400/[0.06]' : 'border-white/10'}`}>
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-sm font-black text-white tabular-nums">{n}</span>
        {continuada && (
          <span className="text-[10px] font-mono-tech text-slate-600 uppercase tracking-wide">
            viene de la página anterior
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {OPCIONES.map((letra) => {
          const activo = valor === letra;
          return (
            <button
              key={letra}
              type="button"
              onClick={() => onResponder(n, letra)}
              aria-pressed={activo}
              aria-label={`Pregunta ${n}, opción ${letra}`}
              className={`h-10 rounded-lg font-mono-tech font-bold text-sm border transition-all duration-150 ${
                activo
                  ? 'bg-cyan-400/20 border-cyan-400/70 text-cyan-300'
                  : 'bg-white/[0.03] border-white/10 text-slate-500 hover:border-white/30 hover:text-slate-200'
              }`}
            >
              {letra}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── barra de avance ─────────────────────────────────────────── */

function BarraAvance({ contestadas, onAbrirHoja }) {
  const pct = Math.round((contestadas / TOTAL) * 100);
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3 text-xs font-mono-tech mb-2">
        <span className="text-cyan-400 uppercase tracking-widest truncate">
          Cuadernillo de ingreso
        </span>
        <button
          type="button" onClick={onAbrirHoja}
          className="text-slate-400 hover:text-cyan-400 transition shrink-0 tabular-nums"
        >
          {contestadas} / {TOTAL} contestadas
        </button>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/* ── hoja de respuestas completa ─────────────────────────────── */

/* El equivalente a la hoja de burbujas de papel: las 88 de un vistazo, para ver
 * los huecos. Sirve sobre todo al final, que es cuando en papel se descubre que
 * se saltó una y se recorrieron todas las demás. */
function HojaDeRespuestas({ respuestas, onIr, onResponder, onCerrar }) {
  return (
    <Modal onCerrar={onCerrar} titulo="Hoja de respuestas">
      <div className="space-y-6">
        {SECCIONES.map((s) => (
          <div key={s.id}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
                {s.nombre}
              </span>
              <span className="text-[11px] font-mono-tech text-slate-500 tabular-nums shrink-0">
                {contarTramo(respuestas, s.desde, s.hasta)} / {s.hasta - s.desde + 1}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {rango(s.desde, s.hasta).map((n) => (
                <div key={n} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onIr(n)}
                    className="w-8 shrink-0 text-xs font-mono-tech text-slate-500 hover:text-cyan-400 transition tabular-nums text-right"
                    aria-label={`Ir a la pregunta ${n} en el cuadernillo`}
                  >
                    {n}
                  </button>
                  <div className="grid grid-cols-4 gap-1 flex-1">
                    {OPCIONES.map((letra) => {
                      const activo = respuestas[n] === letra;
                      return (
                        <button
                          key={letra}
                          type="button"
                          onClick={() => onResponder(n, letra)}
                          aria-pressed={activo}
                          aria-label={`Pregunta ${n}, opción ${letra}`}
                          className={`h-8 rounded-md font-mono-tech text-[11px] font-bold border transition ${
                            activo
                              ? 'bg-cyan-400/20 border-cyan-400/70 text-cyan-300'
                              : 'bg-white/[0.03] border-white/10 text-slate-600 hover:border-white/30'
                          }`}
                        >
                          {letra}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

/* ── confirmación de entrega ─────────────────────────────────── */

function Confirmacion({ contestadas, respuestas, onIr, onCancelar, onEntregar }) {
  const faltan = rango(1, TOTAL).filter((n) => !respuestas[n]);

  return (
    <Modal onCerrar={onCancelar} titulo="Entregar el cuadernillo">
      <p className="text-sm text-slate-300 leading-relaxed mb-5">
        Contestaste <strong className="text-white">{contestadas} de {TOTAL}</strong>.
        Una vez que entregues no vas a poder cambiar nada.
      </p>

      {faltan.length > 0 && (
        <div className="mb-6">
          <p className="text-sm text-amber-300 mb-3">
            Te faltan {faltan.length}. Toca un número para ir a esa pregunta:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {faltan.map((n) => (
              <button
                key={n} type="button" onClick={() => onIr(n)}
                className="text-xs font-mono-tech px-2.5 py-1.5 rounded-lg bg-amber-400/10 text-amber-300 border border-amber-400/30 hover:bg-amber-400/20 transition tabular-nums"
              >
                {n}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mt-3">
            El propio cuadernillo dice que es preferible no marcar nada a marcar
            al azar, así que dejarlas en blanco también es una opción válida.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={onEntregar} className="btn-primary px-6 py-3">
          Sí, entregar
        </button>
        <button
          type="button" onClick={onCancelar}
          className="text-sm font-semibold text-slate-400 hover:text-white transition px-4 py-3"
        >
          Seguir contestando
        </button>
      </div>
    </Modal>
  );
}

function Modal({ titulo, children, onCerrar }) {
  useEffect(() => {
    const alTeclear = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', alTeclear);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', alTeclear);
      document.body.style.overflow = '';
    };
  }, [onCerrar]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onCerrar} />
      <div
        role="dialog" aria-modal="true" aria-label={titulo}
        className="glass relative rounded-2xl border border-white/10 w-full max-w-2xl max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-4"
             style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 className="text-sm font-bold text-white">{titulo}</h3>
          <button
            type="button" onClick={onCerrar} aria-label="Cerrar"
            className="w-8 h-8 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/30 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>
  );
}

/* ── utilidades ──────────────────────────────────────────────── */

/** El paquete que se guarda, igual para un avance a medias que para la entrega
 *  final. Sin calificación: el cuadernillo no trae clave de respuestas. */
function armarEntrega(respuestas) {
  return {
    cuadernillo: 'ediems-2026',
    total: TOTAL,
    contestadas: Object.keys(respuestas).length,
    respuestas,
    porSeccion: Object.fromEntries(
      SECCIONES.map((s) => [
        s.id,
        {
          nombre: s.nombre,
          total: s.hasta - s.desde + 1,
          contestadas: contarTramo(respuestas, s.desde, s.hasta),
        },
      ]),
    ),
  };
}

function rango(a, b) {
  return Array.from({ length: b - a + 1 }, (_, i) => a + i);
}

function contarTramo(respuestas, a, b) {
  let c = 0;
  for (let n = a; n <= b; n++) if (respuestas[n]) c++;
  return c;
}

/**
 * Qué preguntas se contestan estando en esta página.
 *
 * Normalmente son las que empiezan aquí. Pero hay páginas que solo traen la
 * continuación de una pregunta larga —un texto de lectura, una tabla— y en esas
 * se muestra la pregunta que viene arrastrando, para que el alumno no tenga que
 * regresar una hoja solo para marcar.
 */
function preguntasVisibles(p) {
  const propias = preguntasDePagina(p);
  if (propias.length) return propias;
  let ultima = null;
  for (let n = 1; n <= TOTAL; n++) if (PAGINA[n] < p) ultima = n; else break;
  return ultima ? [ultima] : [];
}

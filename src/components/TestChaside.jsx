import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PREGUNTAS, AREAS, TOTAL, calificarChaside, areaPorId } from '../lib/chaside.js';

/* Test de orientación vocacional CHASIDE.
 *
 * Noventa y ocho preguntas de sí o no. Van de catorce en catorce y no todas de
 * corrido: una lista de noventa y ocho en un celular se contesta a lo loco, y
 * por pantallas se puede exigir que cada una esté completa antes de seguir.
 *
 * NO HAY RESPUESTAS CORRECTAS y el texto lo repite. Las instrucciones del
 * instrumento piden además algo que es fácil de olvidar: contestar según lo que
 * de verdad interesa, sin pensar en el dinero, el prestigio ni en qué carrera
 * es más fácil. Si el alumno contesta pensando en eso, el resultado apunta a la
 * carrera que cree que debería querer, no a la que quiere.
 */

const POR_PAGINA = 14;
const PAGINAS = Math.ceil(TOTAL / POR_PAGINA);

export default function TestChaside({ onFinalizar, onAvance, respuestasIniciales = null }) {
  const [pagina, setPagina] = useState(0);
  const [respuestas, setRespuestas] = useState(() => respuestasIniciales ?? {});
  const [regano, setRegano] = useState(false);
  const arriba = useRef(null);

  const numeros = useMemo(
    () => Array.from({ length: POR_PAGINA }, (_, i) => pagina * POR_PAGINA + i + 1).filter((n) => n <= TOTAL),
    [pagina],
  );
  const contestadas = Object.keys(respuestas).length;
  const faltan = numeros.filter((n) => respuestas[n] === undefined);
  const ultima = pagina === PAGINAS - 1;

  useEffect(() => {
    arriba.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pagina]);

  // Con función, no leyendo el estado de fuera: React agrupa los cambios y dos
  // toques seguidos perderían el primero.
  const responder = (n, v) => { setRespuestas((p) => ({ ...p, [n]: v })); setRegano(false); };

  const avanzar = () => {
    if (faltan.length) { setRegano(true); return; }
    onAvance?.(respuestas);
    if (!ultima) { setPagina((p) => p + 1); return; }
    onFinalizar({ ...calificarChaside(respuestas), respuestas });
  };

  return (
    <div ref={arriba}>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
          <span className="text-cyan-400 uppercase tracking-widest">Parte {pagina + 1} de {PAGINAS}</span>
          <span className="text-slate-500">{contestadas} / {TOTAL}</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-cyan-400 transition-all duration-300"
               style={{ width: `${(contestadas / TOTAL) * 100}%` }} />
        </div>
      </div>

      {pagina === 0 && (
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 mb-6">
          <p className="text-sm text-slate-400 leading-relaxed">
            <strong className="text-slate-200">No hay respuestas correctas.</strong> Contesta
            según lo que de verdad te interesa, <strong className="text-slate-200">sin pensar
            en el dinero, el prestigio ni en qué carrera es más fácil</strong>. Si contestas
            pensando en eso, el resultado va a apuntar a la carrera que crees que deberías
            querer, no a la que quieres.
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {numeros.map((n) => {
          const v = respuestas[n];
          const falta = regano && v === undefined;
          return (
            <div key={n}
                 className={`glass-card rounded-xl p-4 border transition-colors ${falta ? 'border-amber-400/50' : 'border-white/10'}`}>
              <p className="text-sm text-slate-200 leading-snug mb-3">
                <span className="font-mono-tech text-xs text-slate-600 mr-2">{n}.</span>
                {PREGUNTAS[n]}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[['si', true, 'Sí'], ['no', false, 'No']].map(([k, valor, rotulo]) => {
                  const activo = v === valor;
                  return (
                    <button
                      key={k} type="button"
                      onClick={() => responder(n, valor)}
                      aria-pressed={activo}
                      aria-label={`Pregunta ${n}: ${rotulo}`}
                      className={`h-11 rounded-lg font-semibold text-sm border transition-all duration-150 ${
                        activo
                          ? 'bg-cyan-400/20 border-cyan-400/60 text-cyan-300'
                          : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                      }`}
                    >
                      {rotulo}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {regano && faltan.length > 0 && (
        <p className="text-sm text-amber-400 mt-5 font-mono-tech">
          Te faltan {faltan.length} de esta parte. Están marcadas en ámbar.
        </p>
      )}

      <div className="flex items-center justify-between gap-4 mt-8">
        <button type="button" onClick={() => setPagina((p) => Math.max(0, p - 1))}
                disabled={pagina === 0}
                className="text-sm font-semibold text-slate-500 hover:text-slate-300 disabled:opacity-0 disabled:pointer-events-none transition px-4 py-3">
          ← Anterior
        </button>
        <button type="button" onClick={avanzar} className="btn-primary px-7 py-3.5">
          {ultima ? 'Ver mi resultado' : 'Continuar'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── resultado ───────────────────────────────────────────────── */

export function ResultadoChaside({ r }) {
  const dom = r.dominantes.map(areaPorId).filter(Boolean);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
      <span className="text-xs font-mono-tech text-slate-500 uppercase tracking-widest block mb-4">
        Orientación vocacional
      </span>

      <div className="rounded-xl bg-cyan-400/[0.07] border border-cyan-400/30 p-4 mb-6">
        <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-widest block mb-2">
          Hacia dónde apuntas
        </span>
        <p className="text-base sm:text-lg font-bold text-white leading-snug mb-2">
          {dom.map((a) => a.nombre).join(' · ')}
        </p>
        {dom[0] && <p className="text-xs text-slate-400 leading-relaxed">{dom[0].rasgos}</p>}
        {r.empateEnSegundo && (
          <p className="text-[11px] text-amber-300 mt-3 leading-relaxed">
            Ojo: hubo empate en el segundo lugar, así que esa segunda área no es
            concluyente. Conviene revisarla con tu tutor.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {AREAS.map((a) => {
          const p = r.puntajes[a.id];
          const esDom = r.dominantes.includes(a.id);
          return (
            <div key={a.id}>
              <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
                <span className={`truncate ${esDom ? 'text-cyan-300 font-semibold' : 'text-slate-300'}`}>
                  <span className="font-mono-tech mr-1.5">{a.id}</span>{a.nombre}
                </span>
                <span className="font-mono-tech text-slate-500 shrink-0 tabular-nums">
                  {p.total} / {p.max}
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#2c2c2a' }}>
                <div className="h-full rounded-full transition-all duration-700"
                     style={{ width: `${p.porcentaje}%`, background: esDom ? '#3987e5' : '#4a5568' }} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mt-5">
        Esto dice hacia dónde se inclinan tus intereses hoy, no qué puedes o no
        puedes estudiar. Sirve para abrir la conversación con tu tutor, no para
        cerrarla.
      </p>
    </div>
  );
}

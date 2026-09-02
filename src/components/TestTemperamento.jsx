import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  REACTIVOS, ESCALA, ORDEN, TEMPERAMENTOS, PUNTOS_MAX,
  perfilTemperamento,
} from '../lib/temperamento.js';

/* Test de los cuatro temperamentos.
 *
 * Cuarenta afirmaciones en cinco páginas de ocho. Se pagina, en vez de poner
 * una lista larga con scroll, por dos razones prácticas de salón: en un celular
 * una lista de cuarenta se contesta a lo loco, y con páginas se puede exigir
 * que la página esté completa antes de avanzar, que es la forma más simple de
 * evitar perfiles a medias.
 *
 * No hay respuestas correctas y el componente lo dice en voz alta. Un alumno
 * que cree que lo están calificando contesta lo que suena bien, y entonces el
 * resultado no vale nada.
 */

const POR_PAGINA = 8;
const PAGINAS = Math.ceil(REACTIVOS.length / POR_PAGINA);

const TONO = {
  amber:   { texto: 'text-amber-400',   barra: 'bg-amber-400',   borde: 'border-amber-400/40',   fondo: 'bg-amber-400/10' },
  rose:    { texto: 'text-rose-400',    barra: 'bg-rose-400',    borde: 'border-rose-400/40',    fondo: 'bg-rose-400/10' },
  violet:  { texto: 'text-violet-400',  barra: 'bg-violet-400',  borde: 'border-violet-400/40',  fondo: 'bg-violet-400/10' },
  emerald: { texto: 'text-emerald-400', barra: 'bg-emerald-400', borde: 'border-emerald-400/40', fondo: 'bg-emerald-400/10' },
};

export default function TestTemperamento({ onFinalizar }) {
  const [pagina, setPagina] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [regano, setRegano] = useState(false);
  const arriba = useRef(null);

  const bloque = useMemo(
    () => REACTIVOS.slice(pagina * POR_PAGINA, (pagina + 1) * POR_PAGINA),
    [pagina],
  );

  const contestadas = Object.keys(respuestas).length;
  const faltanEnPagina = bloque.filter((r) => respuestas[r.id] === undefined);
  const ultima = pagina === PAGINAS - 1;

  useEffect(() => {
    arriba.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [pagina]);

  const responder = (id, valor) => {
    setRespuestas((prev) => ({ ...prev, [id]: valor }));
    setRegano(false);
  };

  const avanzar = () => {
    if (faltanEnPagina.length) { setRegano(true); return; }
    if (!ultima) { setPagina((p) => p + 1); return; }
    onFinalizar({ ...perfilTemperamento(respuestas), respuestas });
  };

  return (
    <div ref={arriba}>
      {/* Avance */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
          <span className="text-cyan-400 uppercase tracking-widest">
            Parte {pagina + 1} de {PAGINAS}
          </span>
          <span className="text-slate-500">{contestadas} / {REACTIVOS.length}</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${(contestadas / REACTIVOS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass-card rounded-2xl p-4 sm:p-6 border border-white/10 mb-6">
        <p className="text-sm text-slate-400 leading-relaxed">
          <strong className="text-slate-200">Aquí no hay respuestas correctas.</strong>{' '}
          Lee cada frase y marca qué tanto se parece a como eres en realidad, no
          a como te gustaría ser. Contesta rápido: la primera reacción suele ser
          la más honesta.
        </p>
      </div>

      <div className="space-y-3">
        {bloque.map((r, i) => (
          <Reactivo
            key={r.id}
            numero={pagina * POR_PAGINA + i + 1}
            reactivo={r}
            valor={respuestas[r.id]}
            faltante={regano && respuestas[r.id] === undefined}
            onResponder={responder}
          />
        ))}
      </div>

      {regano && faltanEnPagina.length > 0 && (
        <p className="text-sm text-amber-400 mt-5 font-mono-tech">
          Te faltan {faltanEnPagina.length} de esta parte. Están marcadas en ámbar.
        </p>
      )}

      <div className="flex items-center justify-between gap-4 mt-8">
        <button
          type="button"
          onClick={() => setPagina((p) => Math.max(0, p - 1))}
          disabled={pagina === 0}
          className="text-sm font-semibold text-slate-500 hover:text-slate-300 disabled:opacity-0 disabled:pointer-events-none transition px-4 py-3"
        >
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

function Reactivo({ numero, reactivo, valor, faltante, onResponder }) {
  return (
    <div
      className={`glass-card rounded-xl p-4 sm:p-5 border transition-colors ${
        faltante ? 'border-amber-400/50' : 'border-white/10'
      }`}
    >
      <p className="text-sm sm:text-base text-slate-200 leading-snug mb-4">
        <span className="font-mono-tech text-xs text-slate-600 mr-2">{numero}.</span>
        {reactivo.texto}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {ESCALA.map((op) => {
          const activo = valor === op.valor;
          return (
            <button
              key={op.valor}
              type="button"
              onClick={() => onResponder(reactivo.id, op.valor)}
              aria-pressed={activo}
              className={`text-xs sm:text-[13px] font-medium rounded-lg px-2 py-2.5 border transition-all duration-150 ${
                activo
                  ? 'bg-cyan-400/15 border-cyan-400/60 text-cyan-300'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
              }`}
            >
              {op.rotulo}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Resultado. Se muestra al alumno y también se reutiliza en el resumen final
 * del diagnóstico completo, por eso está exportado aparte. */
export function ResultadoTemperamento({ perfil }) {
  const dom = TEMPERAMENTOS[perfil.dominante];
  const sec = TEMPERAMENTOS[perfil.secundario];
  const tonoDom = TONO[dom.color];

  return (
    <div>
      <div className={`glass-card rounded-2xl p-6 sm:p-8 border ${tonoDom.borde} mb-6`}>
        <span className="text-xs font-mono-tech text-slate-500 uppercase tracking-widest block mb-2">
          {perfil.empatado ? 'Tu perfil combina dos' : 'Tu temperamento dominante'}
        </span>
        <h3 className={`text-2xl sm:text-3xl font-black mb-1 ${tonoDom.texto}`}>
          {perfil.empatado ? `${dom.nombre} y ${sec.nombre}` : dom.nombre}
        </h3>
        <p className="text-sm text-slate-500 font-mono-tech mb-5">{dom.lema}</p>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
          {dom.descripcion}
        </p>
        {perfil.empatado && (
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-4">
            {sec.descripcion}
          </p>
        )}

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1.5">
              Cómo aprendes mejor
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">{dom.aprende}</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <span className="text-[11px] font-mono-tech text-amber-400 uppercase tracking-widest block mb-1.5">
              Qué te conviene cuidar
            </span>
            <p className="text-sm text-slate-400 leading-relaxed">{dom.cuidado}</p>
          </div>
        </div>
      </div>

      {/* El perfil completo. Importa mostrar los cuatro: casi nadie es puro, y
          ver los cuatro evita que el alumno se quede con una etiqueta. */}
      <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
        <span className="text-xs font-mono-tech text-slate-500 uppercase tracking-widest block mb-4">
          Tu perfil completo
        </span>
        <div className="space-y-3">
          {ORDEN.map((t) => {
            const tono = TONO[TEMPERAMENTOS[t].color];
            return (
              <div key={t}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className={`font-semibold ${tono.texto}`}>{TEMPERAMENTOS[t].nombre}</span>
                  <span className="font-mono-tech text-slate-500">
                    {perfil.puntos[t]} / {PUNTOS_MAX}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full ${tono.barra} transition-all duration-700`}
                    style={{ width: `${perfil.porcentaje[t]}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-slate-600 leading-relaxed mt-5">
          Esto describe una forma de reaccionar, no una capacidad ni un límite.
          Casi nadie sale de un solo tipo: lo normal es una mezcla.
        </p>
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { MATERIAS, calificar, totalDe } from '../lib/diagnostico-materias.js';

/* Evaluación diagnóstica por grado: una materia por pantalla.
 *
 * Se aplican TODAS las materias del grado en una sola sesión, no una por clase.
 * Es una decisión de aplicación, no técnica: un diagnóstico partido en seis
 * ratos distintos casi nunca se completa, y el valor está justamente en tener
 * el perfil entero del alumno el mismo día.
 *
 * Una materia por pantalla —y no las treinta y un preguntas de corrido— porque
 * así el alumno ve un final cercano seis veces en vez de uno lejano una sola
 * vez, y porque deja pedir que la materia esté completa antes de pasar a la
 * siguiente.
 *
 * NO se muestra si acertó o falló mientras contesta. Es un diagnóstico de
 * entrada: si el alumno ve el marcador subir o bajar, deja de contestar lo que
 * sabe y empieza a contestar lo que cree que quieren oír.
 */

const LETRA = { a: 'A', b: 'B', c: 'C', d: 'D' };

export default function EvaluacionAcademica({ grado, onFinalizar }) {
  const materias = MATERIAS[grado] ?? [];
  const [indice, setIndice] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [regano, setRegano] = useState(false);
  const arriba = useRef(null);

  const materia = materias[indice];
  const ultima = indice === materias.length - 1;
  const total = totalDe(grado);
  const contestadas = Object.keys(respuestas).length;

  useEffect(() => {
    arriba.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [indice]);

  if (!materia) return null;

  const faltan = materia.preguntas.filter((p) => respuestas[p.id] === undefined);

  const responder = (id, clave) => {
    setRespuestas((prev) => ({ ...prev, [id]: clave }));
    setRegano(false);
  };

  const avanzar = () => {
    if (faltan.length) { setRegano(true); return; }
    if (!ultima) { setIndice((i) => i + 1); return; }
    onFinalizar({ ...calificar(grado, respuestas), respuestas });
  };

  // El enunciado del caso se repite en varias preguntas seguidas (Sexualidad y
  // Género). Se muestra una sola vez, cuando cambia.
  let contextoMostrado = null;

  return (
    <div ref={arriba}>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
          <span className="text-cyan-400 uppercase tracking-widest">
            Materia {indice + 1} de {materias.length}
          </span>
          <span className="text-slate-500">{contestadas} / {total} reactivos</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full bg-cyan-400 transition-all duration-300"
            style={{ width: `${(contestadas / total) * 100}%` }}
          />
        </div>
      </div>

      <header className="mb-6">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{materia.nombre}</h3>
        <p className="text-sm text-slate-400">{materia.instrucciones}</p>
      </header>

      <div className="space-y-4">
        {materia.preguntas.map((p, i) => {
          const nuevoContexto = p.contexto && p.contexto !== contextoMostrado;
          if (p.contexto) contextoMostrado = p.contexto;
          return (
            <React.Fragment key={p.id}>
              {nuevoContexto && (
                <div className="glass-card rounded-xl p-4 sm:p-5 border border-violet-400/30">
                  <span className="text-[11px] font-mono-tech text-violet-400 uppercase tracking-widest block mb-2">
                    Lee esta situación
                  </span>
                  <p className="text-sm text-slate-300 leading-relaxed italic">{p.contexto}</p>
                </div>
              )}
              <Pregunta
                numero={i + 1}
                pregunta={p}
                valor={respuestas[p.id]}
                faltante={regano && respuestas[p.id] === undefined}
                onResponder={responder}
              />
            </React.Fragment>
          );
        })}
      </div>

      {regano && faltan.length > 0 && (
        <p className="text-sm text-amber-400 mt-5 font-mono-tech">
          Te faltan {faltan.length} de esta materia. Están marcadas en ámbar.
        </p>
      )}

      <div className="flex items-center justify-between gap-4 mt-8">
        <button
          type="button"
          onClick={() => setIndice((i) => Math.max(0, i - 1))}
          disabled={indice === 0}
          className="text-sm font-semibold text-slate-500 hover:text-slate-300 disabled:opacity-0 disabled:pointer-events-none transition px-4 py-3"
        >
          ← Materia anterior
        </button>
        <button type="button" onClick={avanzar} className="btn-primary px-7 py-3.5">
          {ultima ? 'Terminar la evaluación' : 'Siguiente materia'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

function Pregunta({ numero, pregunta, valor, faltante, onResponder }) {
  return (
    <div
      className={`glass-card rounded-xl p-4 sm:p-5 border transition-colors ${
        faltante ? 'border-amber-400/50' : 'border-white/10'
      }`}
    >
      <p className="text-sm sm:text-base text-slate-200 leading-snug mb-4">
        <span className="font-mono-tech text-xs text-slate-600 mr-2">{numero}.</span>
        {pregunta.texto}
      </p>
      <div className="space-y-2">
        {pregunta.opciones.map((op) => {
          const activo = valor === op.clave;
          return (
            <button
              key={op.clave}
              type="button"
              onClick={() => onResponder(pregunta.id, op.clave)}
              aria-pressed={activo}
              className={`w-full text-left flex items-start gap-3 rounded-lg px-3 py-2.5 border transition-all duration-150 ${
                activo
                  ? 'bg-cyan-400/15 border-cyan-400/60'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/25'
              }`}
            >
              <span
                className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-mono-tech font-bold border ${
                  activo
                    ? 'bg-cyan-400/20 border-cyan-400/60 text-cyan-300'
                    : 'border-white/15 text-slate-500'
                }`}
              >
                {LETRA[op.clave] ?? op.clave.toUpperCase()}
              </span>
              <span className={`text-sm leading-snug ${activo ? 'text-cyan-100' : 'text-slate-400'}`}>
                {op.texto}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* Resultado por materia. El alumno ve su porcentaje; el desglose es lo que de
 * verdad le sirve al docente, y también al alumno para saber por dónde empezar. */
export function ResultadoAcademico({ resultado }) {
  const color = (pct) =>
    pct >= 80 ? 'emerald' : pct >= 60 ? 'cyan' : pct >= 40 ? 'amber' : 'rose';
  const BARRA = { emerald: 'bg-emerald-400', cyan: 'bg-cyan-400', amber: 'bg-amber-400', rose: 'bg-rose-400' };
  const TEXTO = { emerald: 'text-emerald-400', cyan: 'text-cyan-400', amber: 'text-amber-400', rose: 'text-rose-400' };
  const g = color(resultado.porcentaje);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono-tech text-slate-500 uppercase tracking-widest block mb-1">
            Evaluación diagnóstica
          </span>
          <p className="text-sm text-slate-400">
            {resultado.aciertos} de {resultado.total} reactivos
          </p>
        </div>
        <span className={`text-4xl font-black ${TEXTO[g]}`}>{resultado.porcentaje}%</span>
      </div>

      <div className="space-y-3">
        {Object.entries(resultado.materias).map(([id, m]) => {
          const pct = m.total ? Math.round((m.ok / m.total) * 100) : 0;
          const c = color(pct);
          return (
            <div key={id}>
              <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
                <span className="text-slate-300 truncate">{m.nombre}</span>
                <span className="font-mono-tech text-slate-500 shrink-0">
                  {m.ok} / {m.total}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full ${BARRA[c]} transition-all duration-700`} style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mt-5">
        Es un diagnóstico de entrada: mide lo que traes al empezar, no tu
        calificación. Las materias más bajas son por donde conviene empezar.
      </p>
    </div>
  );
}

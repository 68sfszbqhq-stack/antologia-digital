import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ESCALA, SUBESCALAS, REACTIVOS_A, BLOQUE_B, APOYO, CAMPOS_B,
  NIVELES, calificarDiagnosticoInicial, TOTAL_REACTIVOS,
} from '../lib/diagnostico-inicial.js';

/* Diagnóstico inicial: cómo estudia el alumno y en qué condiciones.
 *
 * Se aplica a los tres grados por igual, a diferencia de la evaluación de
 * conocimientos, que cambia según el año.
 *
 * Va en cuatro pantallas y no en una lista de treinta y cuatro reactivos: en un
 * celular esa lista se contesta a lo loco, y por pantallas se puede exigir que
 * cada una esté completa antes de seguir.
 *
 * SOBRE EL BLOQUE B. Ahí no hay respuestas buenas ni malas y el texto lo dice.
 * Se pregunta si trabaja, si tiene internet, si cuida a alguien: si el alumno
 * sospecha que lo están calificando, contesta lo que cree que suena bien y el
 * dato deja de servir justo para lo que se recogió, que es acomodarle la carga.
 */

const caja = 'glass-card rounded-2xl border border-white/10';

export default function DiagnosticoInicial({
  onFinalizar, onAvance, respuestasIniciales = null,
}) {
  const [paso, setPaso] = useState(0); // 0..3 = subescalas ; 4 = bloque B ; 5 = apoyo
  const [A, setA] = useState(() => respuestasIniciales?.respuestasA ?? {});
  const [B, setB] = useState(() => respuestasIniciales?.respuestasB ?? {});
  const [ap, setAp] = useState(() => respuestasIniciales?.respuestasApoyo ?? {});
  const [regano, setRegano] = useState(false);
  const arriba = useRef(null);

  const PASOS = SUBESCALAS.length + 2; // 4 subescalas + bloque B + apoyo
  const contestadas =
    Object.keys(A).length + Object.keys(B).filter((k) => B[k] !== '').length + Object.keys(ap).length;

  useEffect(() => {
    arriba.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [paso]);

  // Se manda a la nube al cambiar de pantalla, no en cada toque: son 34
  // reactivos y escribir en cada uno sería una escritura por toque.
  const guardar = (a, b, p) => onAvance?.({ respuestasA: a, respuestasB: b, respuestasApoyo: p });

  /* Los tres actualizan con función y no leyendo el estado de fuera. No es
   * estilo: React agrupa los cambios, así que dos toques seguidos antes de que
   * se vuelva a dibujar leerían el MISMO estado viejo y el primero se perdería.
   * En un celular lento —que es justo donde esto se aplica— pasa de verdad. */
  const responderA = (id, v) => { setA((p) => ({ ...p, [id]: v })); setRegano(false); };
  const responderB = (id, v) => { setB((p) => ({ ...p, [id]: v })); setRegano(false); };
  const responderAp = (id, v) => { setAp((p) => ({ ...p, [id]: v })); setRegano(false); };

  /** Qué falta en la pantalla actual. */
  const faltantes = useMemo(() => {
    if (paso < SUBESCALAS.length) {
      return SUBESCALAS[paso].reactivos.filter((r) => A[r.id] === undefined).map((r) => r.id);
    }
    if (paso === SUBESCALAS.length) {
      return CAMPOS_B.filter((c) => {
        if (c.depende) {
          const v = B[c.depende.campo];
          if (!c.depende.valores.includes(v)) return false; // no aplica
        }
        return B[c.id] === undefined || B[c.id] === '';
      }).map((c) => c.id);
    }
    return APOYO.filter((a) => ap[a.id] === undefined).map((a) => a.id);
  }, [paso, A, B, ap]);

  const avanzar = () => {
    if (faltantes.length) { setRegano(true); return; }
    guardar(A, B, ap);
    if (paso < PASOS - 1) { setPaso((p) => p + 1); return; }
    onFinalizar(calificarDiagnosticoInicial(A, B, ap));
  };

  return (
    <div ref={arriba}>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono-tech mb-2">
          <span className="text-cyan-400 uppercase tracking-widest">
            Parte {paso + 1} de {PASOS}
          </span>
          <span className="text-slate-500">{contestadas} / {TOTAL_REACTIVOS}</span>
        </div>
        <div className="h-1 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full bg-cyan-400 transition-all duration-300"
               style={{ width: `${(contestadas / TOTAL_REACTIVOS) * 100}%` }} />
        </div>
      </div>

      {paso < SUBESCALAS.length && (
        <PantallaLikert
          titulo={SUBESCALAS[paso].nombre}
          nota="No hay respuestas correctas. Marca qué tanto se parece a como eres en realidad."
          reactivos={SUBESCALAS[paso].reactivos}
          valores={A}
          faltantes={regano ? faltantes : []}
          onResponder={responderA}
        />
      )}

      {paso === SUBESCALAS.length && (
        <PantallaContexto
          B={B}
          faltantes={regano ? faltantes : []}
          onResponder={responderB}
        />
      )}

      {paso === SUBESCALAS.length + 1 && (
        <PantallaLikert
          titulo="Apoyo en casa"
          nota="Esto no se califica ni se le comparte a tu familia. Sirve para saber con qué cuentas."
          reactivos={APOYO}
          valores={ap}
          faltantes={regano ? faltantes : []}
          onResponder={responderAp}
        />
      )}

      {regano && faltantes.length > 0 && (
        <p className="text-sm text-amber-400 mt-5 font-mono-tech">
          Te faltan {faltantes.length} de esta parte. Están marcadas en ámbar.
        </p>
      )}

      <div className="flex items-center justify-between gap-4 mt-8">
        <button type="button" onClick={() => setPaso((p) => Math.max(0, p - 1))}
                disabled={paso === 0}
                className="text-sm font-semibold text-slate-500 hover:text-slate-300 disabled:opacity-0 disabled:pointer-events-none transition px-4 py-3">
          ← Anterior
        </button>
        <button type="button" onClick={avanzar} className="btn-primary px-7 py-3.5">
          {paso === PASOS - 1 ? 'Ver mi resultado' : 'Continuar'}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ── pantallas ───────────────────────────────────────────────── */

function PantallaLikert({ titulo, nota, reactivos, valores, faltantes, onResponder }) {
  return (
    <>
      <header className="mb-5">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{titulo}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{nota}</p>
      </header>
      <div className="space-y-3">
        {reactivos.map((r, i) => (
          <div key={r.id}
               className={`${caja} p-4 sm:p-5 ${faltantes.includes(r.id) ? '!border-amber-400/50' : ''}`}>
            <p className="text-sm sm:text-base text-slate-200 leading-snug mb-4">
              <span className="font-mono-tech text-xs text-slate-600 mr-2">{i + 1}.</span>
              {r.texto}
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {ESCALA.map((op) => {
                const activo = valores[r.id] === op.valor;
                return (
                  <button
                    key={op.valor} type="button"
                    onClick={() => onResponder(r.id, op.valor)}
                    aria-pressed={activo}
                    aria-label={`${r.texto} — ${op.rotulo}`}
                    className={`rounded-lg px-1 py-2.5 border text-[11px] sm:text-xs font-medium leading-tight transition-all duration-150 ${
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
        ))}
      </div>
    </>
  );
}

function PantallaContexto({ B, faltantes, onResponder }) {
  return (
    <>
      <header className="mb-5">
        <h3 className="text-xl sm:text-2xl font-black text-white mb-2">Tus condiciones para estudiar</h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          Aquí <strong className="text-slate-200">no hay respuestas buenas ni malas</strong>, y
          nada de esto baja tu calificación. Sirve para acomodarte la carga: si trabajas o no
          tienes internet en casa, tu profesor necesita saberlo para no pedirte cosas imposibles.
        </p>
      </header>

      <div className="space-y-5">
        {BLOQUE_B.map((grupo) => (
          <div key={grupo.id}>
            <span className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-widest block mb-3">
              {grupo.nombre}
            </span>
            <div className="space-y-3">
              {grupo.campos.map((c) => {
                // Un campo que depende de otro solo aparece cuando toca. Sin
                // esto se le preguntaría cuántas horas trabaja a quien dijo que
                // no trabaja.
                if (c.depende && !c.depende.valores.includes(B[c.depende.campo])) return null;
                const falta = faltantes.includes(c.id);
                return (
                  <div key={c.id} className={`${caja} p-4 ${falta ? '!border-amber-400/50' : ''}`}>
                    <p className="text-sm text-slate-200 leading-snug mb-3">{c.texto}</p>
                    {c.tipo === 'numero' ? (
                      <input
                        type="number" min="0" max={c.max} inputMode="numeric"
                        value={B[c.id] ?? ''}
                        onChange={(e) => onResponder(c.id, e.target.value)}
                        placeholder="Horas por semana"
                        className="w-full sm:w-48 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 transition"
                      />
                    ) : (
                      <div className="grid sm:grid-cols-3 gap-2">
                        {c.opciones.map((o) => {
                          const activo = B[c.id] === o.v;
                          return (
                            <button
                              key={o.v} type="button"
                              onClick={() => onResponder(c.id, o.v)}
                              aria-pressed={activo}
                              className={`rounded-lg px-3 py-2.5 border text-xs sm:text-[13px] text-left transition-all duration-150 ${
                                activo
                                  ? 'bg-cyan-400/15 border-cyan-400/60 text-cyan-300'
                                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:border-white/25 hover:text-slate-200'
                              }`}
                            >
                              {o.t}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── resultado ───────────────────────────────────────────────── */

/* Se le muestra al alumno su propio perfil. Las banderas se nombran por lo que
 * SON —"sin internet en casa"— y no como un juicio sobre él. */
export function ResultadoInicial({ r }) {
  const TONO = {
    bajo: { texto: 'text-amber-400', barra: 'bg-amber-400' },
    medio: { texto: 'text-cyan-400', barra: 'bg-cyan-400' },
    alto: { texto: 'text-emerald-400', barra: 'bg-emerald-400' },
  };

  return (
    <div className={`${caja} p-5 sm:p-6`}>
      <span className="text-xs font-mono-tech text-slate-500 uppercase tracking-widest block mb-4">
        Cómo estudias
      </span>

      <div className="space-y-3 mb-6">
        {SUBESCALAS.map((s) => {
          const p = r.puntajes[s.id];
          if (!p || p.porcentaje === null) return null;
          const t = TONO[p.nivel];
          return (
            <div key={s.id}>
              <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
                <span className="text-slate-200 truncate">{s.nombre}</span>
                <span className={`font-mono-tech shrink-0 tabular-nums ${t.texto}`}>
                  {p.porcentaje}% · {NIVELES[p.nivel].nombre}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full ${t.barra} transition-all duration-700`}
                     style={{ width: `${p.porcentaje}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {r.banderas.length > 0 && (
        <div className="mb-6">
          <span className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest block mb-2">
            Lo que tu profesor debe tomar en cuenta
          </span>
          <div className="flex flex-wrap gap-1.5">
            {r.banderas.map((b, i) => (
              <span key={b.id + i}
                    className={`text-[11px] font-mono-tech px-2.5 py-1.5 rounded-lg border ${
                      b.color === 'roja'
                        ? 'bg-rose-400/10 text-rose-300 border-rose-400/30'
                        : 'bg-amber-400/10 text-amber-300 border-amber-400/30'}`}>
                {b.color === 'roja' ? '🔴' : '🟡'} {b.motivo}
              </span>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-600 leading-relaxed">
        Esto describe cómo estudias hoy y con qué cuentas, no qué tan capaz eres.
        Lo que salió bajo es justamente lo que se puede trabajar.
      </p>
    </div>
  );
}

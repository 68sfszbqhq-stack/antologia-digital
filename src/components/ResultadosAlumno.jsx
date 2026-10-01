import React from 'react';
import { ResultadoTemperamento } from './TestTemperamento.jsx';
import { ResultadoAcademico } from './EvaluacionAcademica.jsx';
import { ResultadoInicial } from './DiagnosticoInicial.jsx';
import { ResultadoChaside } from './TestChaside.jsx';

/* Los resultados tal como los ve el alumno al terminar el diagnóstico.
 *
 * Vive en su propio archivo porque se usa en DOS lugares: la pantalla final del
 * alumno y la ficha del alumno en el panel de coordinación ("Ver como lo ve el
 * alumno"). Si fueran dos copias, tarde o temprano el profesor vería algo
 * distinto de lo que ve el alumno, que es justo lo que ese botón quiere evitar.
 */
export default function ResultadosAlumno({ entrega, perfil, vocacional }) {
  return (
    <div className="space-y-6">
      {perfil?.estado === 'entregado' && <ResultadoInicial r={perfil} />}
      {vocacional?.estado === 'entregado' && <ResultadoChaside r={vocacional} />}
      {entrega?.atencion && <ResumenAtencion a={entrega.atencion} />}
      {entrega?.temperamento && <ResultadoTemperamento perfil={entrega.temperamento} />}
      {entrega?.academica && <ResultadoAcademico resultado={entrega.academica} />}
      {entrega?.cuadernillo && <ResumenCuadernillo c={entrega.cuadernillo} />}
    </div>
  );
}

/* El test de atención trae su propia pantalla de resultados dentro del
 * componente, pero aquí no se muestra: en el diagnóstico integral el alumno pasa
 * derecho al siguiente bloque. Este resumen es la versión corta. */
function ResumenAtencion({ a }) {
  const dato = (r, v) => (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
      <div className="text-2xl font-black text-cyan-400">{v}</div>
      <div className="text-[11px] text-slate-500 font-mono-tech uppercase tracking-wide mt-1">{r}</div>
    </div>
  );
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
      <span className="text-xs font-mono-tech text-slate-500 uppercase tracking-widest block mb-4">
        Atención concentrada
      </span>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {dato('Revisados', a.N)}
        {dato('Aciertos', a.CA)}
        {dato('Errores', a.n)}
        {dato('Índice', Number(a.IA).toFixed(2))}
      </div>
      <p className="text-xs text-slate-600 leading-relaxed mt-4">
        Estos números los interpreta tu profesor. Por sí solos no dicen si
        estuviste bien o mal: se comparan con los del resto del grupo.
      </p>
    </div>
  );
}

/* El cuadernillo de ingreso no se califica en pantalla: no trae clave de
 * respuestas. Lo honesto es decir cuántas contestó y dónde quedaron huecos, que
 * es lo único que se sabe sin la clave. */
function ResumenCuadernillo({ c }) {
  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 border border-white/10">
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <span className="text-xs font-mono-tech text-slate-500 uppercase tracking-widest block mb-1">
            Cuadernillo de ingreso
          </span>
          <p className="text-sm text-slate-400">Entregado</p>
        </div>
        <span className="text-4xl font-black text-cyan-400">
          {c.contestadas}<span className="text-lg text-slate-600">/{c.total}</span>
        </span>
      </div>

      {c.porSeccion && (
        <div className="space-y-3">
          {Object.entries(c.porSeccion).map(([id, s]) => {
            const pct = s.total ? Math.round((s.contestadas / s.total) * 100) : 0;
            return (
              <div key={id}>
                <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
                  <span className="text-slate-300 truncate">{s.nombre}</span>
                  <span className="font-mono-tech text-slate-500 shrink-0">
                    {s.contestadas} / {s.total}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full bg-cyan-400 transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-slate-600 leading-relaxed mt-5">
        Aquí no aparece una calificación porque el cuadernillo del alumno no trae
        la clave de respuestas. Tu profesor la aplica después.
      </p>
    </div>
  );
}


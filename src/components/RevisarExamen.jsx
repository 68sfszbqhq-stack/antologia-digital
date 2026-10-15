import React, { useState, useEffect, useMemo } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { firebaseConfigurado } from '../lib/firebase-config';
import { observarAbiertos, abrir, observarRegistros, ponerPuntos, guardarCalificacion, borrarIntento } from '../lib/examen';
import { campoCSV, descargarCSV } from '../lib/csv-idoceo';
import { EXAMENES } from '../data/examenes/index';
import { CLAVES } from '../data/examenes/claves';
import { u } from '../lib/url';
import EntradaProfesor from './EntradaProfesor.jsx';

/* El lado del profesor del examen de parcial: abrirlo y cerrarlo, ver quién
 * lo entregó o lo canceló, calificar las respuestas de texto y descargar las
 * calificaciones para iDoceo.
 *
 * Las preguntas cerradas (antes/después, logos, opción múltiple) se califican
 * aquí con la clave, a partir de las respuestas guardadas: no se confía en una
 * calificación que haya calculado el celular del alumno.
 *
 * Solo el profesor puede leer /examenes; con otra cuenta las reglas no
 * devuelven nada. */

const caja = 'glass-card rounded-2xl border border-white/10';

// Qué examen se revisa: ?examen=<id> en la dirección, o el primero de la lista.
function examenDeLaLiga() {
  const id = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('examen') : null;
  return id && EXAMENES[id] ? id : Object.keys(EXAMENES)[0];
}

const segundos = (a, b) => (a?.seconds != null && b?.seconds != null ? b.seconds - a.seconds : null);
const reloj = (s) => (s == null ? '—' : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`);

export default function RevisarExamen() {
  const hayFirebase = firebaseConfigurado();
  const [usuario, setUsuario] = useState(hayFirebase ? undefined : null);
  const [abiertos, setAbiertos] = useState([]);
  const [registros, setRegistros] = useState(null);
  const [error, setError] = useState('');
  const [viendo, setViendo] = useState(null);
  const [examenId, setExamenId] = useState(examenDeLaLiga);
  const EXAMEN = EXAMENES[examenId];
  const clave = CLAVES[examenId];

  const cambiarExamen = (id) => {
    setExamenId(id); setViendo(null); setRegistros(null);
    history.replaceState(null, '', `?examen=${id}`);
  };

  useEffect(() => {
    if (!hayFirebase) return;
    return onAuthStateChanged(auth(), (us) => setUsuario(us ?? null));
  }, [hayFirebase]);

  useEffect(() => {
    if (!usuario) return;
    const q1 = observarAbiertos(setAbiertos);
    const q2 = observarRegistros(EXAMEN.id, setRegistros, (e) => {
      setError(e?.code === 'permission-denied'
        ? 'Esta cuenta no tiene permiso para ver los exámenes. Entra con la cuenta de profesor.'
        : `No se pudieron cargar los exámenes (${e?.code ?? e}).`);
      setRegistros([]);
    });
    return () => { q1(); q2(); };
  }, [usuario, EXAMEN.id]);

  const filas = useMemo(() => (registros ?? [])
    .map((r) => ({ ...r, calif: clave.calificar(r.respuestas ?? {}, r.puntos ?? {}) }))
    .sort((a, b) => a.grupo.localeCompare(b.grupo) || a.nombre.localeCompare(b.nombre)), [registros, clave]);

  if (!hayFirebase) return <div className={`${caja} p-6 text-amber-300`}>Firebase no está configurado.</div>;
  if (usuario === undefined) return <p className="text-slate-400">Un momento…</p>;
  if (!usuario) return <EntradaProfesor titulo="Revisar examen" error={error} />;

  const abierto = abiertos.includes(EXAMEN.id);
  const actual = filas.find((f) => f.id === viendo);
  const ligaAlumno = typeof location !== 'undefined' ? `${location.origin}${u(`/examen/${EXAMEN.id}`)}` : '';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
            // {EXAMEN.materia}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{EXAMEN.titulo}</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono-tech text-slate-600 truncate max-w-[14rem]">{usuario.email}</span>
          <button onClick={() => signOut(auth())} className="text-xs font-mono-tech text-slate-500 hover:text-rose-400">Salir</button>
        </div>
      </div>

      {/* Qué examen */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.values(EXAMENES).map((ex) => (
          <button key={ex.id} onClick={() => cambiarExamen(ex.id)}
                  className={`rounded-xl px-4 py-2 text-sm border ${ex.id === examenId
                    ? 'border-cyan-400 bg-cyan-400/15 text-white' : 'border-white/10 text-slate-400 hover:text-white'}`}>
            {ex.materia}
            {abiertos.includes(ex.id) && <span className="text-emerald-300"> ●</span>}
          </button>
        ))}
      </div>

      {error && <p className="mb-6 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">{error}</p>}

      {/* Interruptor */}
      <div className={`${caja} p-5 mb-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between`}>
        <div>
          <p className="text-white font-semibold">
            {abierto ? <span className="text-emerald-300">● Abierto</span> : <span className="text-slate-400">○ Cerrado</span>}
            <span className="text-slate-400 font-normal"> · {EXAMEN.minutos} min · {EXAMEN.preguntas.length} preguntas</span>
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Liga para los alumnos: <a href={u(`/examen/${EXAMEN.id}`)} className="text-cyan-400 hover:underline break-all">{ligaAlumno}</a>
          </p>
        </div>
        <button onClick={() => abrir(EXAMEN.id, !abierto).catch((e) => setError(`No se pudo cambiar (${e?.code ?? e}).`))}
                className={abierto ? 'rounded-xl border border-rose-400/40 text-rose-300 px-5 py-2.5' : 'btn-primary px-5 py-2.5'}>
          {abierto ? 'Cerrar examen' : 'Abrir examen'}
        </button>
      </div>

      {registros === null ? <p className="text-slate-400">Trayendo los exámenes…</p>
        : actual ? <Detalle examen={EXAMEN} clave={clave} r={actual} alVolver={() => setViendo(null)} />
        : <Tabla examen={EXAMEN} filas={filas} alVer={setViendo} />}
    </div>
  );
}

function Tabla({ examen: EXAMEN, filas, alVer }) {
  const entregados = filas.filter((f) => f.estado === 'entregado').length;
  const cancelados = filas.filter((f) => f.estado === 'cancelado').length;
  const enCurso = filas.length - entregados - cancelados;

  const csv = () => {
    const enc = ['!Alumno', '!Grupo', '!Estado', `${EXAMEN.titulo} (examen)`];
    const lineas = filas.map((f) => [f.nombre, f.grupo, f.estado,
      typeof f.calificacion === 'number' ? f.calificacion : f.estado === 'entregado' ? f.calif.final : '']);
    descargarCSV(`examen-${EXAMEN.id}.csv`,
      [enc, ...lineas].map((l) => l.map(campoCSV).join(',')).join('\r\n') + '\r\n');
  };

  if (!filas.length) {
    return <div className={`${caja} p-6 text-slate-400 text-sm`}>Nadie ha empezado el examen todavía.</div>;
  }
  return (
    <div className={`${caja} p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-slate-400">
          <span className="text-emerald-300">{entregados} entregados</span> ·{' '}
          <span className="text-rose-300">{cancelados} cancelados</span>
          {enCurso > 0 && <> · <span className="text-cyan-300">{enCurso} en curso</span></>}
        </p>
        <button onClick={csv} className="text-sm text-cyan-400 hover:underline">Descargar CSV para iDoceo</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[11px] font-mono-tech text-slate-500 uppercase">
              <th className="py-2 pr-3">Alumno</th><th className="pr-3">Grupo</th><th className="pr-3">Estado</th>
              <th className="pr-3">Duró</th><th className="pr-3">Fuera</th><th className="pr-3 text-right">Calif.</th><th className="pr-3">Guardada</th><th />
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.id} className="border-t border-white/5">
                <td className="py-2.5 pr-3 text-white">{f.nombre}</td>
                <td className="pr-3 text-slate-400 whitespace-nowrap">{f.grupo}</td>
                <td className="pr-3"><Estado f={f} /></td>
                <td className="pr-3 font-mono-tech text-slate-400">{reloj(segundos(f.inicio, f.fin))}</td>
                <td className="pr-3 font-mono-tech text-slate-400">
                  {f.estado === 'cancelado' ? (f.regreso ? reloj(segundos(f.fin, f.regreso)) : 'no volvió') : ''}
                </td>
                <td className="pr-3 text-right font-mono-tech">
                  {f.estado === 'en curso' ? '' : (
                    <span className={f.calif.texto.pendientes ? 'text-amber-300' : 'text-white font-bold'}>
                      {f.calif.final}{f.calif.texto.pendientes ? '*' : ''}
                    </span>
                  )}
                </td>
                <td className="pr-3 text-xs">
                  {typeof f.calificacion === 'number' && (f.calificacion === f.calif.final
                    ? <span className="text-emerald-400">✓ {f.calificacion}</span>
                    : <span className="text-amber-300">cambió, volver a guardar</span>)}
                </td>
                <td className="text-right"><button onClick={() => alVer(f.id)} className="text-cyan-400 hover:underline">Ver</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] text-slate-500 mt-4">
        * Provisional: faltan respuestas de texto por calificar. «Fuera»: cuánto tardó en volver a la página después de salir.
      </p>
    </div>
  );
}

function Estado({ f }) {
  const c = { entregado: 'text-emerald-300', cancelado: 'text-rose-300', 'en curso': 'text-cyan-300' }[f.estado];
  return (
    <span className={c}>
      {f.estado}
      {f.motivo && f.motivo !== 'enviado' && <span className="block text-[11px] text-slate-500">{f.motivo}</span>}
    </span>
  );
}

function Detalle({ examen: EXAMEN, clave, r, alVolver }) {
  const { CLAVE_ORDEN, CLAVE_LOGOS, CLAVE_OPCION, ESPERADO } = clave;
  const resp = r.respuestas ?? {};
  const puntos = r.puntos ?? {};
  const c = r.calif;
  const [msg, setMsg] = useState('');

  return (
    <div>
      <button onClick={alVolver} className="text-sm text-cyan-400 hover:underline mb-4">← Todos los alumnos</button>
      <div className={`${caja} p-5 mb-4 flex flex-wrap items-center justify-between gap-4`}>
        <div>
          <p className="text-white font-bold text-lg">{r.nombre}</p>
          <p className="text-sm text-slate-400">{r.grupo} · <Estado f={r} /></p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-black text-white">{c.final}<span className="text-base text-slate-500"> / 10</span></p>
          <p className="text-[11px] font-mono-tech text-slate-500">
            texto {c.texto.puntos}/{c.texto.max} · botones {c.botones.aciertos}/{c.botones.total} · opción {c.opcion.aciertos}/{c.opcion.total}
          </p>
          {c.texto.pendientes > 0 && <p className="text-xs text-amber-300">Faltan {c.texto.pendientes} textos por calificar</p>}
        </div>
      </div>
      {msg && <p className="mb-4 text-sm text-rose-300">{msg}</p>}

      <BotonGuardar r={r} final={c.final} pendientes={c.texto.pendientes} alFallar={setMsg} />

      <div className="space-y-3">
        {EXAMEN.preguntas.map((p, n) => (
          <div key={p.id} className={`${caja} p-4`}>
            <p className="text-[11px] font-mono-tech text-slate-500">{n + 1}</p>
            {p.tipo === 'texto' && (
              <>
                <p className="text-slate-300 text-sm">{p.texto}</p>
                <p className="mt-2 text-white whitespace-pre-wrap bg-white/5 rounded-lg px-3 py-2 min-h-[2.5rem]">
                  {resp[p.id]?.trim() || <span className="text-slate-600 italic">Sin respuesta (vale 0)</span>}
                </p>
                <p className="mt-2 text-xs text-slate-500">Se espera: {ESPERADO[p.id]}</p>
                {resp[p.id]?.trim() && (
                  <div className="flex gap-2 mt-3">
                    {[[0, 'Mal'], [1, 'A medias'], [2, 'Bien']].map(([v, t]) => (
                      <button key={v}
                              onClick={() => ponerPuntos(r.id, p.id, puntos[p.id] === v ? null : v)
                                .catch((e) => setMsg(`No se guardó (${e?.code ?? e}).`))}
                              className={`rounded-lg px-3 py-1.5 text-sm border ${puntos[p.id] === v
                                ? 'border-cyan-400 bg-cyan-400/15 text-white' : 'border-white/10 text-slate-400'}`}>
                        {t} · {v}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
            {p.tipo === 'orden' && p.pares.map((par, k) => {
              const clave = CLAVE_ORDEN[p.id][k];
              const dio = resp[`${p.id}_${k}`];
              return (
                <p key={k} className="text-sm text-slate-300">
                  <Marca ok={dio === clave.correcta} /> {par.a} — {par.b}: <strong className="text-white">{dio ?? '—'}</strong>
                  {dio !== clave.correcta && <span className="text-emerald-300"> (era {clave.correcta})</span>}
                  <span className="text-slate-600"> · {clave.nota}</span>
                </p>
              );
            })}
            {p.tipo === 'logos' && (
              <div className="grid sm:grid-cols-2 gap-2">
                {p.logos.map((l) => {
                  const n = resp[`${p.id}_${l}_n`], d = resp[`${p.id}_${l}_d`];
                  const k = CLAVE_LOGOS[l];
                  return (
                    <div key={l} className="flex items-center gap-3 text-sm text-slate-300">
                      <img src={u(`/examen/logos/${l}.svg`)} alt="" className="h-8 w-8" />
                      <span>
                        <Marca ok={n === String(k.nombre)} /> {p.nombres[n] ?? '—'}<br />
                        <Marca ok={d === String(k.donde)} /> {p.donde[d] ?? '—'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
            {p.tipo === 'opcion' && (
              <>
                <p className="text-slate-300 text-sm">{p.texto}</p>
                <p className="text-sm mt-1">
                  <Marca ok={resp[p.id] === String(CLAVE_OPCION[p.id])} />{' '}
                  <span className="text-white">{p.opciones[resp[p.id]] ?? '—'}</span>
                </p>
              </>
            )}
          </div>
        ))}
      </div>

      <BotonGuardar r={r} final={c.final} pendientes={c.texto.pendientes} alFallar={setMsg} />

      <div className="mt-8 text-center">
        <button
          onClick={async () => {
            if (!confirm(`¿Borrar el intento de ${r.nombre}? Podrá volver a hacer el examen desde cero.`)) return;
            try { await borrarIntento(r.id); alVolver(); }
            catch (e) { setMsg(`No se pudo borrar (${e?.code ?? e}).`); }
          }}
          className="text-sm text-rose-400 hover:underline">
          Borrar este intento para que lo repita
        </button>
      </div>
    </div>
  );
}

function BotonGuardar({ r, final, pendientes, alFallar }) {
  const [ocupado, setOcupado] = useState(false);
  const guardada = typeof r.calificacion === 'number' && r.calificacion === final;
  return (
    <div className={`${caja} p-4 my-4 flex flex-wrap items-center justify-between gap-3`}>
      <p className="text-sm">
        {guardada
          ? <span className="text-emerald-400">✓ Calificación guardada: {r.calificacion}</span>
          : pendientes > 0
            ? <span className="text-amber-300">Faltan {pendientes} textos por calificar. Si guardas ahora, cuentan como 0.</span>
            : <span className="text-slate-400">Calificación lista para guardar: {final}</span>}
      </p>
      <button
        disabled={ocupado || guardada}
        onClick={async () => {
          if (pendientes > 0 && !confirm(`Faltan ${pendientes} textos por calificar y contarán como 0. ¿Guardar ${final} de todos modos?`)) return;
          setOcupado(true);
          try { await guardarCalificacion(r.id, final); }
          catch (e) { alFallar(`No se guardó (${e?.code ?? e}).`); }
          setOcupado(false);
        }}
        className="btn-primary px-5 py-2.5 disabled:opacity-40">
        {ocupado ? 'Guardando…' : guardada ? 'Guardada' : `Guardar calificación (${final})`}
      </button>
    </div>
  );
}

function Marca({ ok }) {
  return <span className={ok ? 'text-emerald-400' : 'text-rose-400'}>{ok ? '✓' : '✗'}</span>;
}

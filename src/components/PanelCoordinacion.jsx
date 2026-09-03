import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  signInWithEmailAndPassword, signOut, onAuthStateChanged,
  setPersistence, browserLocalPersistence,
} from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { firebaseConfigurado } from '../lib/firebase-config';
import { GRADOS } from '../lib/diagnostico-materias.js';
import { TEMPERAMENTOS } from '../lib/temperamento.js';
import {
  normalizarGrupo, claveGrupo, entregados, aMedias, conteo, redondear,
  resumenAtencion, resumenTemperamento, resumenAcademico, reactivosMasFallados,
  resumenCuadernillo, leerClave, porGrupo,
} from '../lib/estadisticas.js';

/* Panel de coordinación: lo que hay que entregarle a Supervisión.
 *
 * Va aparte de /profesor a propósito. Aquel panel es para dar clase —abrir un
 * módulo, ver quién contestó, borrar un intento—. Este es para rendir cuentas:
 * cuántos presentaron, cómo salió cada grupo, qué se les dificultó y de dónde
 * salió cada número. Son dos usos con urgencias distintas y meterlos en la
 * misma pantalla habría hecho las dos peores.
 *
 * DOS REGLAS QUE NO SE ROMPEN AQUÍ, porque esto acaba en un oficio:
 *
 *   1. Lo que no se contestó NO cuenta como cero. Cuenta como que no está. Cada
 *      promedio dice sobre cuántos alumnos está calculado.
 *   2. El cuadernillo de 1º no se califica mientras no haya clave oficial. Se
 *      informa cuántas contestaron, que es lo único cierto.
 *
 * Quien entra es la cuenta de profesor. La seguridad no está en esta pantalla
 * sino en firestore.rules: quien no sea profesor no recibe ni un dato, aunque
 * llegue a esta página.
 */

const caja = 'glass-card rounded-2xl border border-white/10';

export default function PanelCoordinacion() {
  const hayFirebase = firebaseConfigurado();
  const [usuario, setUsuario] = useState(hayFirebase ? undefined : null);
  const [registros, setRegistros] = useState(null);
  const [config, setConfig] = useState(null);
  const [error, setError] = useState('');
  const [clave, setClave] = useState(null);

  // filtros
  const [fAplicacion, setFAplicacion] = useState('');
  const [fGrado, setFGrado] = useState('');
  const [fGrupo, setFGrupo] = useState('');
  const [fTurno, setFTurno] = useState('');
  const [fEstado, setFEstado] = useState('');
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    if (!hayFirebase) return;
    return onAuthStateChanged(auth(), (u) => setUsuario(u ?? null));
  }, [hayFirebase]);

  const cargar = useCallback(async () => {
    setError('');
    try {
      const [snap, cfg] = await Promise.all([
        getDocs(collection(db(), 'diagnosticos')),
        getDoc(doc(db(), 'config', 'diagnostico')).catch(() => null),
      ]);
      setRegistros(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setConfig(cfg?.exists() ? cfg.data() : null);
    } catch (e) {
      setError(
        e?.code === 'permission-denied'
          ? 'Esta cuenta no tiene permiso para ver los resultados. Entra con la cuenta de profesor.'
          : `No se pudieron cargar los datos (${e?.code ?? e}).`,
      );
      setRegistros([]);
    }
  }, []);

  useEffect(() => { if (usuario) cargar(); }, [usuario, cargar]);

  /* ── filtrado ────────────────────────────────────────────────── */

  const filtrados = useMemo(() => {
    if (!registros) return [];
    return registros.filter((r) =>
      (!fAplicacion || String(r.aplicacion) === fAplicacion) &&
      (!fGrado || r.grado === fGrado) &&
      (!fGrupo || claveGrupo(r) === fGrupo) &&
      (!fTurno || r.turno === fTurno) &&
      (!fEstado || (fEstado === 'entregado' ? r.estado === 'entregado' : r.estado !== 'entregado')),
    );
  }, [registros, fAplicacion, fGrado, fGrupo, fTurno, fEstado]);

  // Casi todo el informe se calcula SOLO sobre los entregados: incluir a quien
  // va a la mitad bajaría todos los promedios por una razón que no es académica.
  const listos = useMemo(() => entregados(filtrados), [filtrados]);
  const pendientes = useMemo(() => aMedias(filtrados), [filtrados]);

  /* ── pantallas ───────────────────────────────────────────────── */

  if (!hayFirebase) {
    return (
      <div className={`${caja} p-6`}>
        <p className="text-sm text-amber-300">
          Firebase no está configurado en este sitio, así que no hay datos que mostrar.
        </p>
      </div>
    );
  }

  if (usuario === undefined) return <Cargando texto="Un momento…" />;
  if (!usuario) return <Entrada onError={setError} error={error} />;
  if (registros === null) return <Cargando texto="Trayendo los resultados…" />;

  return (
    <div>
      <Encabezado
        usuario={usuario}
        config={config}
        onRecargar={cargar}
        onSalir={() => signOut(auth())}
      />

      {error && (
        <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-6">
          {error}
        </p>
      )}

      <Filtros
        registros={registros}
        valores={{ fAplicacion, fGrado, fGrupo, fTurno, fEstado }}
        set={{ setFAplicacion, setFGrado, setFGrupo, setFTurno, setFEstado }}
        mostrando={filtrados.length}
        total={registros.length}
      />

      <Cobertura filtrados={filtrados} listos={listos} pendientes={pendientes} />

      <TablaGrupos registros={filtrados} />

      <BloqueAtencion registros={listos} />

      <BloqueTemperamento registros={listos} />

      {GRADOS.filter((g) => !g.cuadernillo).map((g) => (
        <BloqueAcademico key={g.id} registros={listos} grado={g.id} />
      ))}

      <BloqueCuadernillo registros={listos} clave={clave} onClave={setClave} />

      <TablaAlumnos registros={filtrados} onVer={setDetalle} clave={clave} />

      <Descargas registros={filtrados} clave={clave} />

      {detalle && <FichaAlumno r={detalle} clave={clave} onCerrar={() => setDetalle(null)} />}
    </div>
  );
}

/* ── entrar ──────────────────────────────────────────────────── */

function Entrada({ error }) {
  const [correo, setCorreo] = useState('');
  const [clave, setClave] = useState('');
  const [msg, setMsg] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setOcupado(true);
    setMsg('');
    try {
      await setPersistence(auth(), browserLocalPersistence);
      await signInWithEmailAndPassword(auth(), correo.trim(), clave);
    } catch (err) {
      setMsg(
        err?.code === 'auth/invalid-credential' || err?.code === 'auth/wrong-password'
          ? 'Correo o contraseña incorrectos.'
          : `No se pudo entrar (${err?.code ?? err}).`,
      );
      setOcupado(false);
    }
  };

  const campo = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400/50 transition';

  return (
    <div className={`${caja} p-8 max-w-md mx-auto`}>
      <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-2">
        // Acceso restringido
      </span>
      <h1 className="text-2xl font-bold text-white mb-2">Panel de coordinación</h1>
      <p className="text-sm text-slate-400 mb-6">
        Entra con la cuenta de profesor. Sin ella, las reglas de seguridad no
        devuelven ni un dato.
      </p>
      <form onSubmit={enviar} className="space-y-4" noValidate>
        <input type="email" required value={correo} onChange={(e) => setCorreo(e.target.value)}
               placeholder="Correo" autoComplete="username" className={campo} />
        <input type="password" required value={clave} onChange={(e) => setClave(e.target.value)}
               placeholder="Contraseña" autoComplete="current-password" className={campo} />
        {(msg || error) && (
          <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
            {msg || error}
          </p>
        )}
        <button type="submit" disabled={ocupado} className="btn-primary w-full justify-center py-3 disabled:opacity-50">
          {ocupado ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

function Cargando({ texto }) {
  return (
    <div className={`${caja} p-10 text-center`}>
      <div className="inline-block w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 mt-3 font-mono-tech">{texto}</p>
    </div>
  );
}

function Encabezado({ usuario, config, onRecargar, onSalir }) {
  const abierta = Number(config?.abierta) || 0;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
          // Coordinación
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Evaluación diagnóstica</h1>
        <p className="text-xs font-mono-tech text-slate-500 mt-1">
          {abierta > 0
            ? `Aplicación ${abierta} abierta · los alumnos pueden entrar y continuar`
            : 'Cerrada · nadie puede entregar ni continuar'}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button onClick={onRecargar} className="text-xs font-mono-tech text-slate-400 hover:text-cyan-400 transition">
          Actualizar
        </button>
        <span className="text-xs font-mono-tech text-slate-700">·</span>
        <span className="text-xs font-mono-tech text-slate-600 truncate max-w-[14rem]">{usuario.email}</span>
        <button onClick={onSalir} className="text-xs font-mono-tech text-slate-500 hover:text-rose-400 transition">
          Salir
        </button>
      </div>
    </div>
  );
}

/* ── filtros ─────────────────────────────────────────────────── */

function Filtros({ registros, valores, set, mostrando, total }) {
  const aplicaciones = useMemo(() => conteo(registros, (r) => String(r.aplicacion)), [registros]);
  const grupos = useMemo(() => conteo(registros, claveGrupo), [registros]);
  const sel = 'bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white font-mono-tech focus:outline-none focus:border-cyan-400/50';

  return (
    <div className={`${caja} p-4 mb-6`}>
      <div className="flex flex-wrap items-center gap-2.5">
        <select value={valores.fAplicacion} onChange={(e) => set.setFAplicacion(e.target.value)} className={sel}>
          <option value="">Todas las aplicaciones</option>
          {aplicaciones.map(([a, c]) => <option key={a} value={a}>Aplicación {a} ({c})</option>)}
        </select>
        <select value={valores.fGrado} onChange={(e) => set.setFGrado(e.target.value)} className={sel}>
          <option value="">Todos los grados</option>
          {GRADOS.map((g) => <option key={g.id} value={g.id}>{g.nombre}</option>)}
        </select>
        <select value={valores.fGrupo} onChange={(e) => set.setFGrupo(e.target.value)} className={sel}>
          <option value="">Todos los grupos</option>
          {grupos.map(([g, c]) => <option key={g} value={g}>{g.replace('·', ' · ')} ({c})</option>)}
        </select>
        <select value={valores.fTurno} onChange={(e) => set.setFTurno(e.target.value)} className={sel}>
          <option value="">Los dos turnos</option>
          <option value="Matutino">Matutino</option>
          <option value="Vespertino">Vespertino</option>
        </select>
        <select value={valores.fEstado} onChange={(e) => set.setFEstado(e.target.value)} className={sel}>
          <option value="">Todos</option>
          <option value="entregado">Solo entregados</option>
          <option value="curso">Solo a medias</option>
        </select>
        <span className="text-xs font-mono-tech text-slate-500 ml-auto">
          {mostrando} de {total}
        </span>
      </div>
    </div>
  );
}

/* ── cobertura ───────────────────────────────────────────────── */

function Cobertura({ filtrados, listos, pendientes }) {
  const porGrado = conteo(listos, (r) => r.grado);
  const pct = filtrados.length ? Math.round((listos.length / filtrados.length) * 100) : 0;

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Cobertura</h2>
      <p className="text-xs text-slate-500 mb-5">
        Cuántos presentaron. Es el primer dato que pide Supervisión.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Dato valor={filtrados.length} rotulo="Registrados" />
        <Dato valor={listos.length} rotulo="Entregados" tono="text-emerald-400" />
        <Dato valor={pendientes.length} rotulo="A medias" tono="text-amber-400" />
        <Dato valor={`${pct}%`} rotulo="Terminaron" tono="text-cyan-400" />
      </div>

      <div className="flex flex-wrap gap-2">
        {porGrado.map(([g, c]) => (
          <span key={g} className="text-xs font-mono-tech px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-slate-300">
            {GRADOS.find((x) => x.id === g)?.nombre ?? g}: <strong className="text-white">{c}</strong>
          </span>
        ))}
      </div>

      {pendientes.length > 0 && (
        <div className="mt-5 rounded-xl bg-amber-400/[0.06] border border-amber-400/20 p-4">
          <p className="text-xs font-mono-tech text-amber-300 uppercase tracking-widest mb-2">
            Sin terminar ({pendientes.length})
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Pueden volver a entrar con su misma cuenta y continuar, mientras la
            aplicación siga abierta. Si ya la cerraste, se quedan así.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {pendientes.slice(0, 30).map((r) => (
              <span key={r.id} className="text-[11px] font-mono-tech px-2 py-1 rounded bg-white/5 text-slate-400 border border-white/5">
                {r.nombre} · {r.correo}
              </span>
            ))}
            {pendientes.length > 30 && (
              <span className="text-[11px] font-mono-tech text-slate-600 px-2 py-1">
                y {pendientes.length - 30} más
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function Dato({ valor, rotulo, tono = 'text-white' }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
      <div className={`text-2xl sm:text-3xl font-black ${tono}`}>{valor}</div>
      <div className="text-[11px] text-slate-500 font-mono-tech uppercase tracking-wide mt-1">{rotulo}</div>
    </div>
  );
}

/* ── por grupo ───────────────────────────────────────────────── */

function TablaGrupos({ registros }) {
  const filas = useMemo(() => porGrupo(registros), [registros]);
  if (!filas.length) return null;

  const disparejos = filas.filter((f) => f.gruposEscritos.length > 1);

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Por grupo</h2>
      <p className="text-xs text-slate-500 mb-5">
        Los grupos se juntan ignorando mayúsculas, espacios y signos: «1-A», «1 A»
        y «1a» son el mismo grupo.
      </p>

      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table className="w-full text-sm border-collapse">
          <thead className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-wider">
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-3">Grupo</th>
              <th className="text-right py-2 px-3">Alumnos</th>
              <th className="text-right py-2 px-3">Entregados</th>
              <th className="text-right py-2 px-3">A medias</th>
              <th className="text-right py-2 px-3">Atención (IA)</th>
              <th className="text-right py-2 pl-3">Evaluación</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {filas.map((f) => (
              <tr key={f.clave} className="border-b border-white/5">
                <td className="py-2.5 pr-3 font-mono-tech text-white whitespace-nowrap">
                  {f.grado} · {f.grupo}
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums">{f.alumnos}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400">{f.entregados}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-amber-400">{f.aMedias || '—'}</td>
                <td className="py-2.5 px-3 text-right tabular-nums">{f.atencionIA ?? '—'}</td>
                <td className="py-2.5 pl-3 text-right tabular-nums">
                  {f.academico !== null ? `${f.academico}%` : (f.cuadernilloContestadas !== null ? `${f.cuadernilloContestadas}/88` : '—')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {disparejos.length > 0 && (
        <p className="text-[11px] text-slate-600 leading-relaxed mt-4">
          Ojo: hay grupos que los alumnos escribieron de varias formas.{' '}
          {disparejos.map((f) => `${f.grado} ${f.grupo} (${f.gruposEscritos.join(', ')})`).join(' · ')}
        </p>
      )}
    </section>
  );
}

/* ── atención ────────────────────────────────────────────────── */

function BloqueAtencion({ registros }) {
  const r = useMemo(() => resumenAtencion(registros), [registros]);
  if (!r) return null;
  const f = (x) => (x === null ? '—' : redondear(x, 2));

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Atención concentrada</h2>
      <p className="text-xs text-slate-500 mb-5">
        Anillos de Landolt · calculado sobre {r.n} alumno(s) que presentaron este bloque.
      </p>
      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table className="w-full text-sm">
          <thead className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-wider">
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-3">Indicador</th>
              <th className="text-right py-2 px-3">Media</th>
              <th className="text-right py-2 px-3">Mediana</th>
              <th className="text-right py-2 pl-3">Desv. est.</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {[
              ['Anillos revisados', r.revisados],
              ['Aciertos', r.aciertos],
              ['Errores', r.errores],
              ['Ritmo (S)', r.ritmo],
              ['Índice de atención (IA)', r.indice],
            ].map(([nombre, d]) => (
              <tr key={nombre} className="border-b border-white/5">
                <td className="py-2.5 pr-3">{nombre}</td>
                <td className="py-2.5 px-3 text-right tabular-nums text-white">{f(d.media)}</td>
                <td className="py-2.5 px-3 text-right tabular-nums">{f(d.mediana)}</td>
                <td className="py-2.5 pl-3 text-right tabular-nums text-slate-500">{f(d.de)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ── temperamento ────────────────────────────────────────────── */

function BloqueTemperamento({ registros }) {
  const r = useMemo(() => resumenTemperamento(registros), [registros]);
  if (!r) return null;
  const COLOR = { sanguineo: 'bg-amber-400', colerico: 'bg-rose-400', melancolico: 'bg-violet-400', flematico: 'bg-emerald-400' };

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Temperamento</h2>
      <p className="text-xs text-slate-500 mb-5">
        Cómo se reparte el grupo · {r.n} alumno(s). Describe formas de reaccionar,
        no capacidades: no sirve para separar ni para etiquetar a nadie.
      </p>
      <div className="space-y-3">
        {r.filas.map((f) => (
          <div key={f.id}>
            <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
              <span className="text-slate-200">{f.nombre}</span>
              <span className="font-mono-tech text-slate-500 shrink-0 tabular-nums">
                {f.cuantos} · {f.porcentaje}% · puntaje medio {f.puntajeMedio}/30
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full ${COLOR[f.id]} transition-all duration-700`} style={{ width: `${f.porcentaje}%` }} />
            </div>
          </div>
        ))}
      </div>
      {r.sinDominanteClaro > 0 && (
        <p className="text-[11px] text-slate-600 mt-4">
          {r.sinDominanteClaro} alumno(s) sin un temperamento claramente dominante
          (los dos primeros quedaron a un punto o menos).
        </p>
      )}
    </section>
  );
}

/* ── evaluación de 2º y 3º ───────────────────────────────────── */

function BloqueAcademico({ registros, grado }) {
  const r = useMemo(() => resumenAcademico(registros, grado), [registros, grado]);
  const fallados = useMemo(() => reactivosMasFallados(registros, grado, 8), [registros, grado]);
  if (!r) return null;
  const nombre = GRADOS.find((g) => g.id === grado)?.nombre ?? grado;
  const tono = (p) => (p >= 80 ? 'text-emerald-400' : p >= 60 ? 'text-cyan-400' : p >= 40 ? 'text-amber-400' : 'text-rose-400');

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <div className="flex items-end justify-between gap-4 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Evaluación · {nombre}</h2>
          <p className="text-xs text-slate-500">
            {r.n} alumno(s) · {r.reprobados} por debajo del 60 %
          </p>
        </div>
        <span className={`text-3xl font-black ${tono(r.porcentaje)}`}>{r.porcentaje}%</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <Dato valor={`${r.porcentaje}%`} rotulo="Promedio" />
        <Dato valor={`${r.mediana}%`} rotulo="Mediana" />
        <Dato valor={r.de ?? '—'} rotulo="Desv. est." />
      </div>

      <p className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest mb-3">
        Por materia · de la más baja a la más alta
      </p>
      <div className="space-y-3 mb-6">
        {r.materias.map((m) => (
          <div key={m.id}>
            <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
              <span className="text-slate-200 truncate">{m.nombre}</span>
              <span className="font-mono-tech text-slate-500 shrink-0 tabular-nums">
                {m.porcentaje}% · {m.reactivos} reactivos
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <div className={`h-full ${m.porcentaje >= 60 ? 'bg-cyan-400' : 'bg-amber-400'}`}
                   style={{ width: `${m.porcentaje}%` }} />
            </div>
          </div>
        ))}
      </div>

      {fallados.length > 0 && (
        <>
          <p className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest mb-3">
            Lo que más se les dificultó
          </p>
          <div className="space-y-2">
            {fallados.map((p) => (
              <div key={p.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <span className="text-[11px] font-mono-tech text-slate-500">{p.materia}</span>
                  <span className={`text-xs font-mono-tech shrink-0 tabular-nums ${tono(p.porcentaje)}`}>
                    {p.porcentaje}% · {p.aciertos}/{p.respondieron}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug">{p.texto}</p>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed mt-4">
            Esta es la parte accionable del informe: dice qué hay que volver a
            enseñar antes de seguir avanzando.
          </p>
        </>
      )}
    </section>
  );
}

/* ── cuadernillo de 1º ───────────────────────────────────────── */

function BloqueCuadernillo({ registros, clave, onClave }) {
  const r = useMemo(() => resumenCuadernillo(registros, clave), [registros, clave]);
  const archivo = useRef(null);
  const [aviso, setAviso] = useState('');

  if (!r) return null;

  const cargarClave = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const texto = await f.text();
    const c = leerClave(texto);
    if (!c) { setAviso('Ese archivo no traía respuestas válidas. Se espera un CSV de dos columnas: pregunta,respuesta (A–D).'); return; }
    onClave(c);
    setAviso(`Clave cargada: ${Object.keys(c).length} de ${r.total} respuestas.`);
  };

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Cuadernillo de ingreso · Primer año</h2>
      <p className="text-xs text-slate-500 mb-5">
        {r.n} alumno(s) · {r.contestadas.completas} lo contestaron completo
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <Dato valor={`${r.contestadas.media}/${r.total}`} rotulo="Contestadas (media)" />
        <Dato valor={`${r.contestadas.mediana}/${r.total}`} rotulo="Mediana" />
        <Dato valor={r.contestadas.completas} rotulo="Completos" tono="text-emerald-400" />
      </div>

      {r.calificacion ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <Dato valor={`${r.calificacion.porcentaje}%`} rotulo="Promedio" tono="text-cyan-400" />
          <Dato valor={`${r.calificacion.mediana}%`} rotulo="Mediana" />
          <Dato valor={r.calificacion.de ?? '—'} rotulo="Desv. est." />
          <Dato valor={r.calificacion.reprobados} rotulo="Bajo 60 %" tono="text-amber-400" />
        </div>
      ) : (
        <div className="rounded-xl bg-amber-400/[0.06] border border-amber-400/20 p-4 mb-6">
          <p className="text-xs text-amber-200 leading-relaxed mb-3">
            <strong>Sin calificar todavía.</strong> El cuadernillo que contesta el
            alumno no trae la clave de respuestas, así que lo único que se sabe es
            cuántas contestó. En cuanto tengas la clave oficial, cárgala aquí y
            todo el informe se recalcula.
          </p>
          <input ref={archivo} type="file" accept=".csv,text/csv,text/plain" onChange={cargarClave} className="hidden" />
          <button onClick={() => archivo.current?.click()} className="btn-primary px-5 py-2.5 text-xs">
            Cargar la clave de respuestas
          </button>
          <p className="text-[11px] text-slate-600 mt-3">
            Un CSV de dos columnas: <code className="font-mono-tech text-slate-500">pregunta,respuesta</code> — por
            ejemplo <code className="font-mono-tech text-slate-500">1,B</code>. La clave se queda en
            este navegador; no se sube a ningún lado.
          </p>
        </div>
      )}

      {aviso && <p className="text-xs font-mono-tech text-cyan-400 mb-4">{aviso}</p>}

      <p className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest mb-3">Por área</p>
      <div className="space-y-3">
        {r.secciones.map((s) => {
          const valor = s.porcentaje !== null ? s.porcentaje : (s.contestadas / s.reactivos) * 100;
          return (
            <div key={s.id}>
              <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
                <span className="text-slate-200 truncate">{s.nombre}</span>
                <span className="font-mono-tech text-slate-500 shrink-0 tabular-nums">
                  {s.porcentaje !== null
                    ? `${s.porcentaje}% de aciertos`
                    : `${s.contestadas}/${s.reactivos} contestadas`}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                <div className={`h-full ${s.porcentaje !== null ? 'bg-cyan-400' : 'bg-slate-500'}`}
                     style={{ width: `${Math.min(100, valor)}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── tabla de alumnos ────────────────────────────────────────── */

function TablaAlumnos({ registros, onVer, clave }) {
  const [busca, setBusca] = useState('');
  const filas = useMemo(() => {
    const t = busca.trim().toLowerCase();
    const base = t
      ? registros.filter((r) =>
          `${r.nombre} ${r.correo} ${r.grupo}`.toLowerCase().includes(t))
      : registros;
    return [...base].sort((a, b) =>
      String(a.grado).localeCompare(String(b.grado)) ||
      normalizarGrupo(a.grupo).localeCompare(normalizarGrupo(b.grupo)) ||
      String(a.nombre ?? '').localeCompare(String(b.nombre ?? ''), 'es'));
  }, [registros, busca]);

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold text-white mb-1">Alumnos</h2>
          <p className="text-xs text-slate-500">Toca un renglón para ver todo su detalle.</p>
        </div>
        <input
          value={busca} onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nombre, correo o grupo"
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 sm:w-72"
        />
      </div>

      <div className="overflow-x-auto -mx-5 sm:-mx-6 px-5 sm:px-6">
        <table className="w-full text-sm border-collapse">
          <thead className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-wider">
            <tr className="border-b border-white/10">
              <th className="text-left py-2 pr-3">Alumno</th>
              <th className="text-left py-2 px-3">Grado/grupo</th>
              <th className="text-left py-2 px-3">Estado</th>
              <th className="text-right py-2 px-3">Atención</th>
              <th className="text-left py-2 px-3">Temperamento</th>
              <th className="text-right py-2 pl-3">Evaluación</th>
            </tr>
          </thead>
          <tbody className="text-slate-300">
            {filas.map((r) => (
              <tr key={r.id} onClick={() => onVer(r)}
                  className="border-b border-white/5 hover:bg-white/[0.03] cursor-pointer transition">
                <td className="py-2.5 pr-3">
                  <div className="text-white">{r.nombre}</div>
                  <div className="text-[11px] font-mono-tech text-slate-600 truncate max-w-[16rem]">{r.correo}</div>
                </td>
                <td className="py-2.5 px-3 font-mono-tech whitespace-nowrap">
                  {r.grado} · {normalizarGrupo(r.grupo)}
                </td>
                <td className="py-2.5 px-3">
                  <span className={`text-[11px] font-mono-tech px-2 py-1 rounded ${
                    r.estado === 'entregado'
                      ? 'bg-emerald-400/10 text-emerald-400'
                      : 'bg-amber-400/10 text-amber-400'}`}>
                    {r.estado === 'entregado' ? 'entregado' : 'a medias'}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right tabular-nums">
                  {r.atencion ? redondear(Number(r.atencion.IA), 2) : '—'}
                </td>
                <td className="py-2.5 px-3 text-[11px]">
                  {r.temperamento ? (TEMPERAMENTOS[r.temperamento.dominante]?.nombre ?? '—') : '—'}
                </td>
                <td className="py-2.5 pl-3 text-right tabular-nums">
                  {r.academica ? `${r.academica.porcentaje}%`
                    : r.cuadernillo ? `${r.cuadernillo.contestadas}/${r.cuadernillo.total}`
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!filas.length && <p className="text-sm text-slate-500 py-6 text-center">No hay alumnos con esos filtros.</p>}
    </section>
  );
}

/* ── ficha de un alumno ──────────────────────────────────────── */

function FichaAlumno({ r, clave, onCerrar }) {
  useEffect(() => {
    const t = (e) => { if (e.key === 'Escape') onCerrar(); };
    document.addEventListener('keydown', t);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', t); document.body.style.overflow = ''; };
  }, [onCerrar]);

  const cuando = (t) => (t?.toDate ? t.toDate().toLocaleString('es-MX') : '—');

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onCerrar} />
      <div role="dialog" aria-modal="true" aria-label={`Detalle de ${r.nombre}`}
           className="glass relative rounded-2xl border border-white/10 w-full max-w-2xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-white truncate">{r.nombre}</h3>
            <p className="text-[11px] font-mono-tech text-slate-500 truncate">{r.correo}</p>
          </div>
          <button onClick={onCerrar} aria-label="Cerrar"
                  className="w-8 h-8 shrink-0 rounded-lg border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition">
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-5">
          <Campos filas={[
            ['Grado', r.grado], ['Grupo (como lo escribió)', r.grupo],
            ['Grupo normalizado', normalizarGrupo(r.grupo)], ['Turno', r.turno],
            ['Nacimiento', r.nacimiento], ['Género', r.genero],
            ['Procedencia', r.procedencia || '—'], ['Estado', r.estado],
            ['Aplicación', r.aplicacion],
            ['Inició', cuando(r.iniciado)], ['Entregó', cuando(r.entregado)],
          ]} />

          {r.atencion && (
            <Bloque titulo="Atención">
              <Campos filas={[
                ['Anillos revisados (N)', r.atencion.N], ['Aciertos (CA)', r.atencion.CA],
                ['Objetivos en el tramo (CT)', r.atencion.CT],
                ['Falsos', r.atencion.falsos], ['Omisiones', r.atencion.omisiones],
                ['Errores (n)', r.atencion.n], ['Ritmo (S)', r.atencion.S],
                ['Índice (IA)', r.atencion.IA], ['Duración', `${r.atencion.T} s`],
              ]} />
            </Bloque>
          )}

          {r.temperamento && (
            <Bloque titulo="Temperamento">
              <p className="text-sm text-slate-300 mb-3">
                Dominante: <strong className="text-white">{TEMPERAMENTOS[r.temperamento.dominante]?.nombre}</strong>
                {r.temperamento.empatado && ' (sin dominante claro)'}
              </p>
              <Campos filas={Object.entries(r.temperamento.puntos ?? {}).map(([k, v]) =>
                [TEMPERAMENTOS[k]?.nombre ?? k, `${v}/30`])} />
            </Bloque>
          )}

          {r.academica && (
            <Bloque titulo={`Evaluación · ${r.academica.aciertos}/${r.academica.total} (${r.academica.porcentaje}%)`}>
              <Campos filas={Object.values(r.academica.materias ?? {}).map((m) =>
                [m.nombre, `${m.ok}/${m.total}`])} />
            </Bloque>
          )}

          {r.cuadernillo && (
            <Bloque titulo={`Cuadernillo · ${r.cuadernillo.contestadas}/${r.cuadernillo.total} contestadas`}>
              <div className="grid grid-cols-8 sm:grid-cols-11 gap-1">
                {Array.from({ length: r.cuadernillo.total }, (_, i) => i + 1).map((n) => {
                  const dada = r.cuadernillo.respuestas?.[n];
                  const bien = clave?.[n] ? String(dada ?? '').toUpperCase() === clave[n] : null;
                  return (
                    <div key={n}
                         title={`Pregunta ${n}${clave?.[n] ? ` · correcta ${clave[n]}` : ''}`}
                         className={`text-[10px] font-mono-tech text-center rounded py-1 border ${
                           !dada ? 'border-white/5 text-slate-700'
                           : bien === true ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                           : bien === false ? 'border-rose-400/40 bg-rose-400/10 text-rose-300'
                           : 'border-white/10 text-slate-300'}`}>
                      {dada ?? '·'}
                    </div>
                  );
                })}
              </div>
            </Bloque>
          )}
        </div>
      </div>
    </div>
  );
}

function Bloque({ titulo, children }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
      <p className="text-[11px] font-mono-tech text-cyan-400 uppercase tracking-widest mb-3">{titulo}</p>
      {children}
    </div>
  );
}

function Campos({ filas }) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
      {filas.map(([k, v]) => (
        <React.Fragment key={k}>
          <dt className="text-slate-500 truncate">{k}</dt>
          <dd className="text-slate-200 font-mono-tech text-right tabular-nums truncate">{String(v ?? '—')}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}

/* ── descargas ───────────────────────────────────────────────── */

function Descargas({ registros, clave }) {
  const bajar = (nombre, filas) => {
    const esc = (x) => {
      const s = String(x ?? '');
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    // El BOM es lo que hace que Excel en Mac no destroce los acentos.
    const csv = '﻿' + filas.map((f) => f.map(esc).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    a.download = `${nombre}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const cuando = (t) => (t?.toDate ? t.toDate().toLocaleString('es-MX') : '');

  const general = () => {
    const filas = [[
      'Aplicación', 'Estado', 'Correo', 'Nombre', 'Grado', 'Grupo', 'Grupo normalizado',
      'Turno', 'Nacimiento', 'Género', 'Procedencia', 'Entregó',
      'At_N', 'At_CA', 'At_errores', 'At_S', 'At_IA',
      'Tmp_dominante', 'Tmp_secundario',
      'Ev_aciertos', 'Ev_total', 'Ev_porcentaje',
      'Cua_contestadas', 'Cua_total',
    ]];
    for (const r of registros) {
      filas.push([
        r.aplicacion, r.estado, r.correo, r.nombre, r.grado, r.grupo,
        normalizarGrupo(r.grupo), r.turno, r.nacimiento, r.genero, r.procedencia,
        cuando(r.entregado),
        r.atencion?.N ?? '', r.atencion?.CA ?? '', r.atencion?.n ?? '',
        r.atencion?.S ?? '', r.atencion?.IA ?? '',
        r.temperamento ? (TEMPERAMENTOS[r.temperamento.dominante]?.nombre ?? '') : '',
        r.temperamento ? (TEMPERAMENTOS[r.temperamento.secundario]?.nombre ?? '') : '',
        r.academica?.aciertos ?? '', r.academica?.total ?? '', r.academica?.porcentaje ?? '',
        r.cuadernillo?.contestadas ?? '', r.cuadernillo?.total ?? '',
      ]);
    }
    bajar('diagnostico-general', filas);
  };

  const grupos = () => {
    const filas = [['Grado', 'Grupo', 'Alumnos', 'Entregados', 'A medias', 'Atención IA', 'Evaluación %', 'Cuadernillo contestadas']];
    for (const g of porGrupo(registros)) {
      filas.push([g.grado, g.grupo, g.alumnos, g.entregados, g.aMedias,
        g.atencionIA ?? '', g.academico ?? '', g.cuadernilloContestadas ?? '']);
    }
    bajar('diagnostico-por-grupo', filas);
  };

  const respuestas = () => {
    const filas = [['Correo', 'Nombre', 'Grado', 'Grupo', 'Reactivo', 'Respuesta']];
    for (const r of registros) {
      for (const [id, v] of Object.entries(r.academica?.respuestas ?? {})) {
        filas.push([r.correo, r.nombre, r.grado, normalizarGrupo(r.grupo), id, v]);
      }
    }
    bajar('diagnostico-respuestas', filas);
  };

  const cuadernillo = () => {
    const conC = registros.filter((r) => r.cuadernillo);
    if (!conC.length) return;
    const total = conC[0].cuadernillo.total ?? 88;
    const cabeza = ['Correo', 'Nombre', 'Grupo', 'Estado', 'Contestadas'];
    if (clave) cabeza.push('Aciertos', 'Porcentaje');
    for (let n = 1; n <= total; n++) cabeza.push(`P${n}`);
    const filas = [cabeza];
    if (clave) {
      const f = ['', 'CLAVE', '', '', '', '', ''];
      for (let n = 1; n <= total; n++) f.push(clave[n] ?? '');
      filas.push(f);
    }
    for (const r of conC) {
      const f = [r.correo, r.nombre, normalizarGrupo(r.grupo), r.estado, r.cuadernillo.contestadas];
      if (clave) {
        let ok = 0; let cal = 0;
        for (let n = 1; n <= total; n++) {
          if (!clave[n]) continue;
          cal++;
          if (String(r.cuadernillo.respuestas?.[n] ?? '').toUpperCase() === clave[n]) ok++;
        }
        f.push(ok, cal ? Math.round((ok / cal) * 100) : '');
      }
      for (let n = 1; n <= total; n++) f.push(r.cuadernillo.respuestas?.[n] ?? '');
      filas.push(f);
    }
    bajar('diagnostico-cuadernillo', filas);
  };

  const botones = [
    ['General', 'Un renglón por alumno con todo lo resumido', general],
    ['Por grupo', 'Lo que suele pedir Supervisión', grupos],
    ['Respuestas 2º y 3º', 'Reactivo por reactivo', respuestas],
    ['Cuadernillo 1º', 'Las 88, una columna cada una', cuadernillo],
  ];

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Descargas</h2>
      <p className="text-xs text-slate-500 mb-5">
        Salen con los filtros que tengas puestos arriba. Abren en Excel sin
        romper los acentos.
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        {botones.map(([titulo, nota, fn]) => (
          <button key={titulo} onClick={fn}
                  className="text-left rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-400/5 p-4 transition">
            <span className="block text-sm font-semibold text-white mb-0.5">{titulo}</span>
            <span className="block text-xs text-slate-500">{nota}</span>
          </button>
        ))}
      </div>
      <p className="text-[11px] text-slate-600 leading-relaxed mt-5">
        Estos archivos llevan nombre, correo y fecha de nacimiento de menores de
        edad. Trátalos como el expediente que son: no los subas a la nube ni los
        mandes por chat.
      </p>
    </section>
  );
}

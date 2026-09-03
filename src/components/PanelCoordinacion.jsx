import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  signInWithEmailAndPassword, sendPasswordResetEmail, signOut, onAuthStateChanged,
  setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { firebaseConfigurado } from '../lib/firebase-config';
import { GRADOS } from '../lib/diagnostico-materias.js';
import { TEMPERAMENTOS } from '../lib/temperamento.js';
import { SUBESCALAS, NIVELES } from '../lib/diagnostico-inicial.js';
import { AREAS as AREAS_CHASIDE } from '../lib/chaside.js';
import { Barras, BarrasApiladas, Histograma, Leyenda, SERIE, MAGNITUD } from './Graficas.jsx';
import {
  normalizarGrupo, claveGrupo, entregados, aMedias, conteo, redondear,
  resumenAtencion, resumenTemperamento, resumenAcademico, reactivosMasFallados,
  resumenCuadernillo, leerClave, porGrupo, resumenPerfil, resumenVocacional,
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
  const [perfiles, setPerfiles] = useState([]);
  const [vocacionales, setVocacionales] = useState([]);
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
      // La configuración se pide APARTE, no dentro del mismo Promise.all: si la
      // lista de resultados falla —por ejemplo porque quien entró no es el
      // profesor—, un Promise.all tiraría también la configuración, y el
      // encabezado acabaría diciendo "cerrada" sin saberlo. Afirmar que la
      // evaluación está cerrada cuando no lo está es peor que no decir nada.
      const cfg = await getDoc(doc(db(), 'config', 'diagnostico')).catch(() => null);
      setConfig(cfg?.exists() ? cfg.data() : null);
      const [snap, snapP, snapV] = await Promise.all([
        getDocs(collection(db(), 'diagnosticos')),
        getDocs(collection(db(), 'perfiles')).catch(() => null),
        getDocs(collection(db(), 'vocacional')).catch(() => null),
      ]);
      setRegistros(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      // Las secciones nuevas se piden con `catch`: llegaron después y puede que
      // todavía no tengan ni un documento. Que falten no debe tumbar el panel.
      setPerfiles(snapP ? snapP.docs.map((d) => ({ id: d.id, ...d.data() })) : []);
      setVocacionales(snapV ? snapV.docs.map((d) => ({ id: d.id, ...d.data() })) : []);
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

  // Las secciones nuevas se filtran por los mismos criterios, comparando contra
  // el conjunto de correos que sobrevivió al filtro: así "solo 3ero B" recorta
  // las tres cosas a la vez y los números de la pantalla siempre cuadran entre sí.
  const correosVisibles = useMemo(
    () => new Set(filtrados.map((r) => r.correo).filter(Boolean)), [filtrados]);
  const perfilesF = useMemo(
    () => perfiles.filter((p) => correosVisibles.has(p.correo)), [perfiles, correosVisibles]);
  const vocacionalesF = useMemo(
    () => vocacionales.filter((v) => correosVisibles.has(v.correo)), [vocacionales, correosVisibles]);
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

      <BloquePerfil perfiles={perfilesF} />

      <BloqueVocacional registros={vocacionalesF} />

      <TablaAlumnos registros={filtrados} onVer={setDetalle} clave={clave}
                    perfiles={perfilesF} vocacionales={vocacionalesF} />

      <Descargas registros={filtrados} clave={clave}
                 perfiles={perfilesF} vocacionales={vocacionalesF} />

      {detalle && (
        <FichaAlumno
          r={detalle} clave={clave} onCerrar={() => setDetalle(null)}
          perfil={perfiles.find((p) => p.correo === detalle.correo)}
          vocacional={vocacionales.find((v) => v.correo === detalle.correo)}
        />
      )}
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

      {/* La cuenta del profesor quedó vinculada a Google sobre el mismo UID, así
          que este botón entra igual que el correo y la contraseña. Va primero
          porque es el camino sin nada que recordar. */}
      <button
        type="button"
        disabled={ocupado}
        onClick={async () => {
          setOcupado(true);
          setMsg('');
          try {
            await setPersistence(auth(), browserLocalPersistence);
            const prov = new GoogleAuthProvider();
            prov.setCustomParameters({ prompt: 'select_account' });
            try {
              await signInWithPopup(auth(), prov);
            } catch (e) {
              // Igual que del lado del alumno: si el navegador bloquea la
              // ventanita, se cae a redirección en vez de dejarlo varado.
              const codigo = e?.code ?? '';
              if (codigo === 'auth/popup-blocked'
                  || codigo === 'auth/operation-not-supported-in-this-environment') {
                await signInWithRedirect(auth(), prov);
                return;
              }
              throw e;
            }
          } catch (e) {
            setMsg(`No se pudo entrar con Google (${e?.code ?? e}).`);
            setOcupado(false);
          }
        }}
        className="w-full inline-flex items-center justify-center gap-3 rounded-xl bg-white text-slate-800 font-semibold px-6 py-3.5 hover:bg-slate-100 disabled:opacity-60 transition mb-5"
      >
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4z"/>
          <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.5 46 24 46z"/>
          <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-2.9.7-4.3v-5.7H4.5C2.9 17.2 2 20.5 2 24s.9 6.8 2.5 9.7l7.3-5.4z"/>
          <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.8 4.5 14.3l7.3 5.7c1.7-5.2 6.5-9.3 12.2-9.3z"/>
        </svg>
        {ocupado ? 'Abriendo Google…' : 'Entrar con Google'}
      </button>

      <div className="flex items-center gap-3 mb-5">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-[11px] font-mono-tech text-slate-600">o con contraseña</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
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

      <button
        type="button"
        onClick={async () => {
          if (!correo.trim()) { setMsg('Escribe tu correo arriba y vuelve a tocar aquí.'); return; }
          try {
            await sendPasswordResetEmail(auth(), correo.trim());
            setMsg(`Te mandé un correo a ${correo.trim()} para restablecer la contraseña.`);
          } catch (e) {
            setMsg(`No se pudo enviar (${e?.code ?? e}).`);
          }
        }}
        className="text-xs font-mono-tech text-slate-500 hover:text-cyan-400 transition mt-5 block mx-auto"
      >
        Olvidé mi contraseña
      </button>

      <p className="text-[11px] text-slate-600 leading-relaxed mt-5 text-center">
        Cualquiera de los dos caminos sirve, siempre que sea la cuenta del
        profesor: las reglas reconocen esa identidad, no el correo.
      </p>
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
  // `null` no es lo mismo que cerrada: es que no se pudo leer.
  const abierta = config ? (Number(config.abierta) || 0) : null;
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
          // Coordinación
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Evaluación diagnóstica</h1>
        <p className="text-xs font-mono-tech text-slate-500 mt-1">
          {abierta === null
            ? 'No se pudo leer el estado de la evaluación'
            : abierta > 0
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

      {(() => {
        const filas = porGrupo(filtrados).map((g) => ({
          etiqueta: `${g.grado} · ${g.grupo}`,
          partes: [g.entregados, g.aMedias],
          total: g.alumnos,
        }));
        if (filas.length < 2) return null;
        return (
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <BarrasApiladas
              titulo="Quiénes terminaron, por grupo"
              filas={filas}
              series={[
                { nombre: 'Entregado', color: SERIE[0] },
                { nombre: 'A medias', color: SERIE[1] },
              ]}
            />
          </div>
        );
      })()}

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
              <th className="text-right py-2 px-3">Evaluación</th>
              <th className="text-center py-2 px-3">Perfil</th>
              <th className="text-left py-2 pl-3">Vocacional</th>
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

      <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <Histograma
          titulo="Cómo se reparte el índice de atención"
          nota="El promedio solo dice el centro. Esto dice si el grupo salió parejo o si hay dos grupos dentro del grupo, que es lo que cambia qué hacer en clase."
          valores={registros.filter((r) => r.atencion).map((r) => Number(r.atencion.IA))}
          min={0} max={1} tramos={10} sufijo=""
        />
      </div>
    </section>
  );
}

/* ── temperamento ────────────────────────────────────────────── */

function BloqueTemperamento({ registros }) {
  const r = useMemo(() => resumenTemperamento(registros), [registros]);
  if (!r) return null;

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Temperamento</h2>
      <p className="text-xs text-slate-500 mb-5">
        Cómo se reparte el grupo · {r.n} alumno(s). Describe formas de reaccionar,
        no capacidades: no sirve para separar ni para etiquetar a nadie.
      </p>
      <Barras
        filas={r.filas.map((f, i) => ({
          etiqueta: f.nombre,
          valor: f.porcentaje,
          texto: `${f.cuantos} · ${f.porcentaje}%`,
          color: SERIE[i % SERIE.length],
          nota: `Puntaje medio del rasgo en todo el grupo: ${f.puntajeMedio}/30`,
        }))}
        max={100}
      />
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

      <div className="mb-6">
        <Barras
          titulo="Por materia · de la más baja a la más alta"
          filas={r.materias.map((m) => ({
            etiqueta: m.nombre,
            valor: m.porcentaje ?? 0,
            texto: `${m.porcentaje}%`,
            nota: `${m.reactivos} reactivos · ${m.n} alumno(s)`,
          }))}
          max={100}
        />
      </div>

      <div className="mb-6">
        <Histograma
          titulo="Cómo se reparten las calificaciones"
          nota="Un promedio de 60 puede ser todos en 60, o mitad en 30 y mitad en 90. Esto lo distingue."
          valores={registros.filter((x) => x.academica && x.grado === grado).map((x) => Number(x.academica.porcentaje))}
          min={0} max={100} tramos={10} sufijo="%"
        />
      </div>

      {fallados.length > 0 && (
        <>
          <p className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest mb-3">
            Lo que más se les dificultó
          </p>
          <div className="space-y-2">
            {fallados.map((p) => (
              <div key={p.id} className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <span className="text-[11px] font-mono-tech text-slate-500">{p.materia}</span>
                  <span className="text-xs font-mono-tech shrink-0 tabular-nums text-slate-400">
                    {p.porcentaje}% · {p.aciertos}/{p.respondieron}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-snug mb-2">{p.texto}</p>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#2c2c2a' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.porcentaje}%`, background: MAGNITUD }} />
                </div>
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

      <Barras
        titulo="Por área"
        filas={r.secciones.map((x) => ({
          etiqueta: x.nombre,
          valor: x.porcentaje !== null ? x.porcentaje : (x.contestadas / x.reactivos) * 100,
          texto: x.porcentaje !== null
            ? `${x.porcentaje}% de aciertos`
            : `${x.contestadas} de ${x.reactivos} contestadas`,
        }))}
        max={100}
      />

      <div className="mt-6">
        <Histograma
          titulo="Cuántas alcanzó a contestar cada quien"
          nota="Si muchos se quedan cortos, el problema fue el tiempo, no el contenido."
          valores={registros.filter((x) => x.cuadernillo).map((x) => Number(x.cuadernillo.contestadas))}
          min={0} max={r.total} tramos={11} sufijo=""
        />
      </div>
    </section>
  );
}

/* ── perfil socioemocional ───────────────────────────────────── */

function BloquePerfil({ perfiles }) {
  const r = useMemo(() => resumenPerfil(perfiles, SUBESCALAS), [perfiles]);
  if (!r) return null;

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Cómo y en qué condiciones estudian</h2>
      <p className="text-xs text-slate-500 mb-5">
        {r.n} entregados{r.aMedias ? ` · ${r.aMedias} a medias` : ''}. Se reporta cuántos
        alumnos caen en cada nivel y no el promedio: un promedio «medio» puede
        esconder a diez alumnos en nivel bajo.
      </p>

      <p className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest mb-3">
        Por subescala · lo más urgente arriba
      </p>
      <div className="space-y-4 mb-6">
        {r.subescalas.map((sub) => {
          const { bajo, medio, alto } = sub.niveles;
          return (
            <div key={sub.id}>
              <div className="flex items-center justify-between text-xs mb-1.5 gap-3">
                <span className="text-slate-200 truncate">{sub.nombre}</span>
                <span className="font-mono-tech text-slate-500 shrink-0 tabular-nums">
                  {sub.pctBajo}% en nivel bajo · promedio {sub.promedio}%
                </span>
              </div>
              <div className="flex h-2 rounded-full overflow-hidden" style={{ background: '#2c2c2a', gap: 2 }}>
                {[[bajo, '#d95926'], [medio, '#3987e5'], [alto, '#199e70']].map(([v, color], i) =>
                  v > 0 ? (
                    <div key={i} title={`${['Bajo','Medio','Alto'][i]}: ${v}`}
                         style={{ width: `${(v / sub.n) * 100}%`, background: color, borderRadius: '9999px' }} />
                  ) : null)}
              </div>
              <p className="text-[11px] text-slate-600 mt-1 tabular-nums">
                {bajo} bajo · {medio} medio · {alto} alto
              </p>
            </div>
          );
        })}
      </div>
      <Leyenda series={[
        { nombre: 'Bajo', color: '#d95926' },
        { nombre: 'Medio', color: '#3987e5' },
        { nombre: 'Alto', color: '#199e70' },
      ]} />

      {r.banderas.length > 0 && (
        <div className="mt-6">
          <p className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest mb-3">
            Condiciones que se repiten
          </p>
          <div className="flex flex-wrap gap-1.5">
            {r.banderas.map((b) => (
              <span key={b.motivo}
                    className={`text-[11px] font-mono-tech px-2.5 py-1.5 rounded-lg border ${
                      b.color === 'roja'
                        ? 'bg-rose-400/10 text-rose-300 border-rose-400/30'
                        : 'bg-amber-400/10 text-amber-300 border-amber-400/30'}`}>
                {b.color === 'roja' ? '🔴' : '🟡'} {b.motivo} · <b>{b.cuantas}</b> ({b.porcentaje}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {r.seguimiento.length > 0 && (
        <div className="mt-6 rounded-xl bg-rose-400/[0.06] border border-rose-400/25 p-4">
          <p className="text-xs font-mono-tech text-rose-300 uppercase tracking-widest mb-2">
            Prioridad de seguimiento · {r.seguimiento.length} alumno(s)
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Dos o más banderas rojas. Es el corte que pide el instrumento para
            atender primero; conviene una charla individual antes de que se
            acumule el rezago.
          </p>
          <div className="space-y-2">
            {r.seguimiento.map((a) => (
              <div key={a.correo} className="rounded-lg bg-white/[0.03] border border-white/10 p-3">
                <div className="flex items-baseline justify-between gap-3 mb-1">
                  <span className="text-sm text-white">{a.nombre}</span>
                  <span className="text-[11px] font-mono-tech text-slate-500 shrink-0">
                    {a.grado} · {a.grupo} · {a.rojas} rojas
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {a.motivos.join(' · ')}
                  {a.bajas.length ? ` — bajo en: ${a.bajas.join(', ')}` : ''}
                </p>
                <p className="text-[11px] font-mono-tech text-slate-600 mt-1">{a.correo}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── vocacional ──────────────────────────────────────────────── */

function BloqueVocacional({ registros }) {
  const r = useMemo(() => resumenVocacional(registros, AREAS_CHASIDE), [registros]);
  if (!r) return null;

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Orientación vocacional · Tercer año</h2>
      <p className="text-xs text-slate-500 mb-5">
        CHASIDE · {r.n} entregados{r.aMedias ? ` · ${r.aMedias} a medias` : ''}. Cada alumno
        aporta dos áreas dominantes, así que los porcentajes suman más de 100: cada
        uno dice en cuántos alumnos aparece esa área.
      </p>

      <Barras
        titulo="Hacia dónde apunta el grupo"
        filas={r.areas.map((a) => ({
          etiqueta: `${a.id} · ${a.nombre}`,
          valor: a.porcentaje,
          texto: `${a.dominante} alumno(s) · ${a.porcentaje}%`,
          nota: `Puntaje medio ${a.puntajeMedio} de ${a.max}`,
        }))}
        max={100}
      />

      {r.empatados.length > 0 && (
        <div className="mt-6 rounded-xl bg-amber-400/[0.06] border border-amber-400/25 p-4">
          <p className="text-xs font-mono-tech text-amber-300 uppercase tracking-widest mb-2">
            Sin perfil claro · {r.empatados.length} alumno(s)
          </p>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Empataron en el segundo lugar, así que su segunda área dominante es
            arbitraria. Con estos conviene conversar, no entregarles un dictamen.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {r.empatados.map((a) => (
              <span key={a.correo}
                    className="text-[11px] font-mono-tech px-2.5 py-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/5">
                {a.nombre} · {a.grupo} · {a.dominantes.join('/')}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* ── tabla de alumnos ────────────────────────────────────────── */

function TablaAlumnos({ registros, onVer, clave, perfiles = [], vocacionales = [] }) {
  const porCorreo = (lista) => new Map(lista.map((x) => [x.correo, x]));
  const mapaP = useMemo(() => porCorreo(perfiles), [perfiles]);
  const mapaV = useMemo(() => porCorreo(vocacionales), [vocacionales]);
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
                <td className="py-2.5 px-3 text-right tabular-nums">
                  {r.academica ? `${r.academica.porcentaje}%`
                    : r.cuadernillo ? `${r.cuadernillo.contestadas}/${r.cuadernillo.total}`
                    : '—'}
                </td>
                <td className="py-2.5 px-3 text-center">
                  {(() => {
                    const p = mapaP.get(r.correo);
                    if (!p) return <span className="text-slate-700">—</span>;
                    if (p.estado !== 'entregado') return <span className="text-[11px] text-amber-400">a medias</span>;
                    return (p.rojas ?? 0) >= 2
                      ? <span className="text-[11px] font-mono-tech text-rose-300">{p.rojas} rojas</span>
                      : <span className="text-[11px] text-emerald-400">✓</span>;
                  })()}
                </td>
                <td className="py-2.5 pl-3 text-[11px] font-mono-tech">
                  {(() => {
                    const v = mapaV.get(r.correo);
                    if (!v) return <span className="text-slate-700">—</span>;
                    if (v.estado !== 'entregado') return <span className="text-amber-400">a medias</span>;
                    return <span className="text-slate-300">{(v.dominantes ?? []).join(' · ')}</span>;
                  })()}
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

function FichaAlumno({ r, clave, onCerrar, perfil, vocacional }) {
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

          {perfil?.estado === 'entregado' && (
            <Bloque titulo="Cómo y en qué condiciones estudia">
              <Campos filas={SUBESCALAS.map((sub) => {
                const v = perfil.puntajes?.[sub.id];
                return [sub.nombre, v ? `${v.porcentaje}% · ${NIVELES[v.nivel]?.nombre ?? '—'}` : '—'];
              })} />
              {(perfil.banderas ?? []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {perfil.banderas.map((b, i) => (
                    <span key={b.id + i}
                          className={`text-[11px] font-mono-tech px-2 py-1 rounded border ${
                            b.color === 'roja'
                              ? 'bg-rose-400/10 text-rose-300 border-rose-400/30'
                              : 'bg-amber-400/10 text-amber-300 border-amber-400/30'}`}>
                      {b.color === 'roja' ? '🔴' : '🟡'} {b.motivo}
                    </span>
                  ))}
                </div>
              )}
            </Bloque>
          )}

          {vocacional?.estado === 'entregado' && (
            <Bloque titulo={`Vocacional · ${(vocacional.dominantes ?? []).join(' y ')}`}>
              <Campos filas={AREAS_CHASIDE.map((a) => {
                const v = vocacional.puntajes?.[a.id];
                return [`${a.id} · ${a.nombre}`, v ? `${v.total}/${v.max}` : '—'];
              })} />
              {vocacional.empateEnSegundo && (
                <p className="text-[11px] text-amber-300 mt-3 leading-relaxed">
                  Empató en el segundo lugar: esa segunda área no es concluyente.
                </p>
              )}
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

function Descargas({ registros, clave, perfiles = [], vocacionales = [] }) {
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

  // ── segmentos sueltos ──────────────────────────────────────────
  // Cada bloque del informe se puede bajar por su cuenta. Es lo que se pide en
  // la práctica: Supervisión quiere la tabla de cobertura, orientación quiere
  // los temperamentos y la academia quiere los reactivos fallados, y nadie
  // quiere recortar a mano una hoja de cincuenta columnas.

  const cobertura = () => {
    const listos = entregados(registros);
    const filas = [['Indicador', 'Valor']];
    filas.push(['Registrados', registros.length]);
    filas.push(['Entregados', listos.length]);
    filas.push(['A medias', registros.length - listos.length]);
    filas.push(['% que terminó', registros.length ? Math.round((listos.length / registros.length) * 100) : 0]);
    filas.push([]);
    filas.push(['Grado', 'Registrados', 'Entregados']);
    for (const [g] of conteo(registros, (r) => r.grado)) {
      filas.push([g, registros.filter((r) => r.grado === g).length, listos.filter((r) => r.grado === g).length]);
    }
    filas.push([]);
    filas.push(['Turno', 'Registrados']);
    for (const [t, c] of conteo(registros, (r) => r.turno)) filas.push([t, c]);
    bajar('cobertura', filas);
  };

  const pendientesCSV = () => {
    const filas = [['Correo', 'Nombre', 'Grado', 'Grupo', 'Turno', 'Atención', 'Temperamento', 'Evaluación', 'Cuadernillo']];
    for (const r of aMedias(registros)) {
      filas.push([r.correo, r.nombre, r.grado, normalizarGrupo(r.grupo), r.turno,
        r.atencion ? 'hecho' : 'falta',
        r.temperamento ? 'hecho' : 'falta',
        r.academica ? 'hecho' : 'falta',
        r.cuadernillo ? `${r.cuadernillo.contestadas}/${r.cuadernillo.total}` : 'falta']);
    }
    bajar('sin-terminar', filas);
  };

  const atencionCSV = () => {
    const filas = [['Correo', 'Nombre', 'Grado', 'Grupo', 'Figura', 'Revisados N', 'Aciertos CA',
      'Objetivos CT', 'Falsos', 'Omisiones', 'Errores n', 'Tiempo s', 'Ritmo S', 'Índice IA', 'Variante']];
    for (const r of registros) {
      const a = r.atencion;
      if (!a) continue;
      filas.push([r.correo, r.nombre, r.grado, normalizarGrupo(r.grupo), a.objetivo,
        a.N, a.CA, a.CT, a.falsos, a.omisiones, a.n, a.T, a.S, a.IA, a.variante]);
    }
    bajar('atencion', filas);
  };

  const temperamentoCSV = () => {
    const filas = [['Correo', 'Nombre', 'Grado', 'Grupo', 'Dominante', 'Secundario',
      'Sin dominante claro', 'Sanguíneo', 'Colérico', 'Melancólico', 'Flemático']];
    for (const r of registros) {
      const t = r.temperamento;
      if (!t) continue;
      filas.push([r.correo, r.nombre, r.grado, normalizarGrupo(r.grupo),
        TEMPERAMENTOS[t.dominante]?.nombre ?? t.dominante,
        TEMPERAMENTOS[t.secundario]?.nombre ?? t.secundario,
        t.empatado ? 'sí' : 'no',
        t.puntos?.sanguineo ?? '', t.puntos?.colerico ?? '',
        t.puntos?.melancolico ?? '', t.puntos?.flematico ?? '']);
    }
    bajar('temperamento', filas);
  };

  const materiasCSV = () => {
    const filas = [['Grado', 'Materia', 'Reactivos', 'Alumnos', 'Promedio %', 'Desv. est.']];
    for (const g of GRADOS.filter((x) => !x.cuadernillo)) {
      const r = resumenAcademico(entregados(registros), g.id);
      if (!r) continue;
      for (const m of r.materias) {
        filas.push([g.nombre, m.nombre, m.reactivos, m.n, m.porcentaje ?? '', m.de ?? '']);
      }
      filas.push([g.nombre, 'GENERAL', '', r.n, r.porcentaje, r.de ?? '']);
      filas.push([]);
    }
    bajar('promedios-por-materia', filas);
  };

  const falladosCSV = () => {
    const filas = [['Grado', 'Materia', 'Reactivo', 'Pregunta', 'Respondieron', 'Aciertos', '% de acierto']];
    for (const g of GRADOS.filter((x) => !x.cuadernillo)) {
      for (const p of reactivosMasFallados(entregados(registros), g.id, 100)) {
        filas.push([g.nombre, p.materia, p.id, p.texto, p.respondieron, p.aciertos, p.porcentaje]);
      }
    }
    bajar('reactivos-mas-fallados', filas);
  };

  const perfilCSV = () => {
    const listos = perfiles.filter((p) => p.estado === 'entregado');
    if (!listos.length) return;
    const filas = [[
      'Correo', 'Nombre', 'Grado', 'Grupo',
      ...SUBESCALAS.flatMap((s) => [`${s.nombre} %`, `${s.nombre} nivel`]),
      'Banderas rojas', 'Banderas amarillas', 'Motivos',
    ]];
    for (const p of listos) {
      filas.push([
        p.correo, p.nombre, p.grado, normalizarGrupo(p.grupo),
        ...SUBESCALAS.flatMap((s) => {
          const v = p.puntajes?.[s.id];
          return [v?.porcentaje ?? '', v?.nivel ?? ''];
        }),
        p.rojas ?? 0, p.amarillas ?? 0,
        (p.banderas ?? []).map((b) => b.motivo).join(' · '),
      ]);
    }
    bajar('perfil-socioemocional', filas);
  };

  const seguimientoCSV = () => {
    const r = resumenPerfil(perfiles, SUBESCALAS);
    if (!r?.seguimiento.length) return;
    const filas = [['Correo', 'Nombre', 'Grado', 'Grupo', 'Banderas rojas', 'Motivos', 'Subescalas bajas']];
    for (const a of r.seguimiento) {
      filas.push([a.correo, a.nombre, a.grado, a.grupo, a.rojas, a.motivos.join(' · '), a.bajas.join(' · ')]);
    }
    bajar('prioridad-de-seguimiento', filas);
  };

  const vocacionalCSV = () => {
    const listos = vocacionales.filter((v) => v.estado === 'entregado');
    if (!listos.length) return;
    const filas = [[
      'Correo', 'Nombre', 'Grado', 'Grupo', 'Dominante 1', 'Dominante 2', 'Empate en 2º',
      ...AREAS_CHASIDE.map((a) => `${a.id} total`),
    ]];
    for (const v of listos) {
      filas.push([
        v.correo, v.nombre, v.grado, normalizarGrupo(v.grupo),
        (v.dominantes ?? [])[0] ?? '', (v.dominantes ?? [])[1] ?? '',
        v.empateEnSegundo ? 'sí' : 'no',
        ...AREAS_CHASIDE.map((a) => v.puntajes?.[a.id]?.total ?? ''),
      ]);
    }
    bajar('vocacional-chaside', filas);
  };

  const botones = [
    ['Cobertura', 'Cuántos presentaron, por grado y turno', cobertura],
    ['Sin terminar', 'Quiénes van a medias y qué bloque les falta', pendientesCSV],
    ['Por grupo', 'La tabla que suele pedir Supervisión', grupos],
    ['Atención', 'Todos los indicadores de Landolt, por alumno', atencionCSV],
    ['Temperamento', 'Dominante y los cuatro puntajes, por alumno', temperamentoCSV],
    ['Promedios por materia', 'Resumen de 2º y 3º con desviación', materiasCSV],
    ['Reactivos más fallados', 'Qué hay que volver a enseñar', falladosCSV],
    ['Respuestas 2º y 3º', 'Reactivo por reactivo', respuestas],
    ['Cuadernillo 1º', 'Las 88, una columna cada una', cuadernillo],
    ['General', 'Un renglón por alumno con todo', general],
    ['Perfil socioemocional', 'Subescalas, niveles y banderas por alumno', perfilCSV],
    ['Prioridad de seguimiento', 'Quiénes tienen 2+ banderas rojas', seguimientoCSV],
    ['Vocacional CHASIDE', 'Áreas dominantes y puntajes de 3º', vocacionalCSV],
  ];

  return (
    <section className={`${caja} p-5 sm:p-6 mb-6`}>
      <h2 className="text-lg font-bold text-white mb-1">Descargas</h2>
      <p className="text-xs text-slate-500 mb-5">
        Cada bloque por separado, con los filtros que tengas puestos arriba.
        Abren directo en Excel sin romper los acentos.
      </p>
      <div className="grid sm:grid-cols-2 gap-2.5">
        {botones.map(([titulo, nota, fn]) => (
          <button key={titulo} onClick={fn}
                  className="text-left rounded-xl bg-white/[0.03] border border-white/10 hover:border-cyan-400/40 hover:bg-cyan-400/5 p-3.5 transition">
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

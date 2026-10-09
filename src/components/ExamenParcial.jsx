import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { firebaseConfigurado } from '../lib/firebase-config';
import { EXAMENES } from '../data/examenes/cultura-digital-p1';
import { u } from '../lib/url';

/* El examen de parcial, en el celular del alumno.
 *
 *   · Una pregunta por pantalla, en un orden distinto para cada alumno (y las
 *     opciones de la opción múltiple, también revueltas).
 *   · Reloj de cuenta atrás. Al llegar a cero se entrega solo.
 *   · Si sale de la página —otra pestaña, otra app, minimizar, recargar— el
 *     examen se CANCELA y se guarda lo que llevaba. Al volver se anota la hora,
 *     para que el profesor vea cuánto tiempo estuvo fuera.
 *   · Un solo intento: lo garantiza firestore.rules, no esta pantalla.
 *
 * El profesor puede "probar como alumno": recorre el examen completo, con el
 * reloj y la cancelación, pero sin escribir nada en Firestore.
 *
 * Esta pantalla NO carga la clave de respuestas: la calificación se calcula en
 * /examen/revisar, que es del profesor. */

const caja = 'glass-card rounded-2xl border border-white/10';
const alumno = () => import('../lib/alumno');
const examenLib = () => import('../lib/examen');

function revolver(lista) {
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lo que lleva contestado, por si recarga: así el intento cancelado se guarda
// con sus respuestas y no vacío.
const LLAVE = (examen, uid) => `examen-${examen}-${uid}`;
function leerLocal(examen, uid) {
  try { return JSON.parse(localStorage.getItem(LLAVE(examen, uid)) ?? 'null'); } catch { return null; }
}
function guardarLocal(examen, uid, datos) {
  try { localStorage.setItem(LLAVE(examen, uid), JSON.stringify(datos)); } catch {}
}

export default function ExamenParcial({ examenId }) {
  const examen = EXAMENES[examenId];
  const hayFirebase = firebaseConfigurado();
  const [fase, setFase] = useState(hayFirebase ? 'cargando' : 'sinfirebase');
  const [usuario, setUsuario] = useState(null);
  const [ficha, setFicha] = useState(null);
  const [prueba, setPrueba] = useState(false);
  const [msg, setMsg] = useState('');
  const [cierre, setCierre] = useState(null); // { motivo, salida, regreso }
  const escribiendo = useRef(null);

  // ─── Quién es y en qué punto va ─────────────────────────────────────────
  useEffect(() => {
    if (!hayFirebase) return;
    let quitar = () => {};
    (async () => {
      const a = await alumno();
      a.sesionPorRedireccion();
      quitar = a.observarSesion(async (us) => {
        setUsuario(us);
        setMsg('');
        if (!us) { setFase('login'); return; }
        setFase('cargando');
        if (a.esProfesor(us)) { setFase('profesor'); return; }
        try {
          let f = await a.fichaDe(us.uid);
          if (!f && a.esCuentaDeGoogle(us)) {
            const d = await a.datosDelDiagnostico(us);
            if (d) f = await a.crearMiFicha(us, d.nombre, d.grupo).catch(() => null);
          }
          if (!f) { setFase('datos'); return; }
          if (!f.activo) { setMsg('Tu acceso está desactivado. Avísale a tu profesor.'); setFase('error'); return; }
          setFicha(f);
          await revisarEstado(us);
        } catch (e) {
          setMsg(`No se pudo conectar (${e?.code ?? e}).`);
          setFase('error');
        }
      });
    })();
    return () => quitar();
  }, [hayFirebase]);

  async function revisarEstado(us) {
    const ex = await examenLib();
    const reg = await ex.miRegistro(us.uid, examenId);
    if (!reg) {
      setFase((await ex.examenAbierto(examenId)) ? 'aviso' : 'cerrado');
      return;
    }
    if (reg.estado === 'entregado') { setFase('entregado'); return; }
    if (reg.estado === 'en curso') {
      // Ya había empezado y la página se recargó o se cerró: eso es salir.
      const local = leerLocal(examenId, us.uid);
      setCierre({ motivo: 'recargó o cerró la página', salida: local?.salida ?? null });
      setFase('cancelado');
      await ex.cerrar(us.uid, examenId, 'cancelado', 'recargó o cerró la página', local?.respuestas ?? {})
        .catch(() => {});
      await ex.anotarRegreso(us.uid, examenId).catch(() => {});
      return;
    }
    // Cancelado. Si no se había anotado el regreso, este es el regreso.
    setCierre({ motivo: reg.motivo ?? 'salió de la página' });
    setFase('cancelado');
    if (!reg.regreso) await ex.anotarRegreso(us.uid, examenId).catch(() => {});
  }

  // ─── Empezar y terminar ─────────────────────────────────────────────────
  async function empezar() {
    setMsg('');
    if (!prueba) {
      try {
        await (await examenLib()).iniciar(usuario.uid, ficha, examenId);
      } catch (e) {
        setMsg(e?.code === 'permission-denied'
          ? 'No se pudo empezar: el examen está cerrado o ya lo habías iniciado.'
          : `No se pudo empezar (${e?.code ?? e}). Revisa tu conexión.`);
        return;
      }
      guardarLocal(examenId, usuario.uid, { respuestas: {}, salida: null });
    }
    setFase('examen');
  }

  const terminar = useCallback(async (estado, motivo, respuestas) => {
    const salida = estado === 'cancelado' ? Date.now() : null;
    setCierre({ motivo, salida, regreso: null });
    setFase(estado);
    if (prueba) return;
    guardarLocal(examenId, usuario.uid, { respuestas, salida });
    const ex = await examenLib();
    escribiendo.current = (async () => {
      try {
        await ex.cerrar(usuario.uid, examenId, estado, motivo, respuestas);
      } catch (e) {
        if (estado !== 'entregado') throw e;
        // Se pasó del tiempo (sin red al final, por ejemplo): que no se pierda.
        await ex.cerrar(usuario.uid, examenId, 'cancelado', 'entregó fuera de tiempo', respuestas);
        setCierre({ motivo: 'entregó fuera de tiempo' });
        setFase('cancelado');
      }
    })().catch(() => setMsg('No se pudo guardar por la conexión. No cierres esta página y avísale a tu profesor.'));
  }, [prueba, usuario, examenId]);

  // Al volver después de una cancelación: anotar la hora de regreso.
  useEffect(() => {
    if (fase !== 'cancelado' || !cierre?.salida || cierre.regreso) return;
    const alVolver = async () => {
      if (document.hidden) return;
      const regreso = Date.now();
      setCierre((c) => ({ ...c, regreso }));
      if (prueba) return;
      await escribiendo.current?.catch(() => {});
      await (await examenLib()).anotarRegreso(usuario.uid, examenId).catch(() => {});
    };
    document.addEventListener('visibilitychange', alVolver);
    window.addEventListener('focus', alVolver);
    return () => {
      document.removeEventListener('visibilitychange', alVolver);
      window.removeEventListener('focus', alVolver);
    };
  }, [fase, cierre, prueba, usuario, examenId]);

  // ─── Pantallas ──────────────────────────────────────────────────────────
  if (!examen) return <Caja><p className="text-white">Este examen no existe.</p></Caja>;

  if (fase === 'examen') {
    return (
      <Aplicacion
        examen={examen}
        prueba={prueba}
        alCambiar={(r) => !prueba && guardarLocal(examenId, usuario.uid, { respuestas: r, salida: null })}
        alTerminar={terminar}
      />
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <Encabezado examen={examen} ficha={ficha} prueba={prueba} />
      {fase === 'cargando' && <Caja><p className="text-slate-400 text-center">Un momento…</p></Caja>}
      {fase === 'sinfirebase' && <Caja><p className="text-white">El examen en línea no está disponible en este sitio.</p></Caja>}
      {fase === 'login' && <Login />}
      {fase === 'datos' && <DatosAlumno usuario={usuario} />}
      {fase === 'profesor' && (
        <Caja>
          <p className="text-white font-semibold">Entraste como profesor.</p>
          <p className="text-sm text-slate-400 mt-2">
            Puedes recorrer el examen tal como lo verá un alumno, con el reloj y la
            cancelación al salir. En modo prueba no se guarda nada.
          </p>
          <button onClick={() => { setPrueba(true); setFicha({ nombre: 'Vista de prueba', grupo: '' }); setFase('aviso'); }}
                  className="btn-primary w-full justify-center py-3 mt-5">
            Probar como alumno
          </button>
          <a href={u('/examen/revisar')} className="block text-center text-sm text-cyan-400 hover:underline mt-4">
            Ir a abrir el examen y calificar →
          </a>
        </Caja>
      )}
      {fase === 'cerrado' && (
        <Caja>
          <p className="text-white font-semibold">El examen todavía no está abierto.</p>
          <p className="text-sm text-slate-400 mt-2">Espera la indicación de tu profesor y vuelve a cargar esta página.</p>
          <button onClick={() => location.reload()} className="btn-primary w-full justify-center py-3 mt-5">Volver a revisar</button>
        </Caja>
      )}
      {fase === 'aviso' && <Aviso examen={examen} alEmpezar={empezar} />}
      {fase === 'entregado' && (
        <Caja>
          <p className="text-3xl text-center">✓</p>
          <p className="text-white font-semibold text-center mt-2">
            {cierre?.motivo === 'tiempo' ? 'Se acabó el tiempo. Tu examen se entregó.' : 'Tu examen se entregó.'}
          </p>
          <p className="text-sm text-slate-400 text-center mt-2">
            {prueba ? 'Modo prueba: no se guardó nada.' : 'Tu profesor lo va a calificar. Ya puedes cerrar esta página.'}
          </p>
        </Caja>
      )}
      {fase === 'cancelado' && <Cancelado cierre={cierre} prueba={prueba} />}
      {fase === 'error' && <Caja><p className="text-white">{msg || 'Algo salió mal.'}</p></Caja>}
      {msg && fase !== 'error' && <Falla>{msg}</Falla>}
      {usuario && (
        <p className="text-center mt-8">
          <button onClick={async () => { await (await alumno()).salir(); location.reload(); }}
                  className="text-xs text-slate-600 hover:text-slate-400">Salir de esta cuenta</button>
        </p>
      )}
    </div>
  );
}

// ─── El examen en curso ─────────────────────────────────────────────────────

function Aplicacion({ examen, prueba, alCambiar, alTerminar }) {
  // Orden distinto para cada alumno. Se fija una vez y no cambia mientras contesta.
  const orden = useMemo(() => revolver(examen.preguntas).map((p) =>
    p.tipo === 'opcion' ? { ...p, mezcla: revolver(p.opciones.map((_, i) => i)) } : p), [examen]);
  const [i, setI] = useState(0);
  const [resp, setResp] = useState({});
  const [revisando, setRevisando] = useState(false);
  const fin = useRef(Date.now() + examen.minutos * 60_000);
  const [quedan, setQuedan] = useState(examen.minutos * 60);
  const ultima = useRef(resp);
  const cerrado = useRef(false);
  ultima.current = resp;

  const cerrar = useCallback((estado, motivo) => {
    if (cerrado.current) return;
    cerrado.current = true;
    alTerminar(estado, motivo, ultima.current);
  }, [alTerminar]);

  // Reloj.
  useEffect(() => {
    const t = setInterval(() => {
      const s = Math.max(0, Math.round((fin.current - Date.now()) / 1000));
      setQuedan(s);
      if (s === 0) cerrar('entregado', 'tiempo');
    }, 500);
    return () => clearInterval(t);
  }, [cerrar]);

  // Salir de la página cancela. `blur` cubre la computadora (otra ventana al
  // lado sin ocultar la pestaña); `visibilitychange`, el celular y las pestañas.
  useEffect(() => {
    const salio = () => cerrar('cancelado', 'salió de la página');
    const oculta = () => { if (document.hidden) salio(); };
    document.addEventListener('visibilitychange', oculta);
    window.addEventListener('blur', salio);
    window.addEventListener('pagehide', salio);
    return () => {
      document.removeEventListener('visibilitychange', oculta);
      window.removeEventListener('blur', salio);
      window.removeEventListener('pagehide', salio);
    };
  }, [cerrar]);

  const poner = (llave, valor) => setResp((r) => {
    const n = { ...r, [llave]: valor };
    alCambiar(n);
    return n;
  });

  const contestada = (p) => {
    if (p.tipo === 'texto' || p.tipo === 'opcion') return Boolean((resp[p.id] ?? '').trim());
    if (p.tipo === 'orden') return p.pares.every((_, k) => resp[`${p.id}_${k}`]);
    return p.logos.every((l) => resp[`${p.id}_${l}_n`] && resp[`${p.id}_${l}_d`]);
  };
  const faltan = orden.filter((p) => !contestada(p)).length;
  const p = orden[i];
  const mm = String(Math.floor(quedan / 60)).padStart(2, '0');
  const ss = String(quedan % 60).padStart(2, '0');

  return (
    <div className="max-w-lg mx-auto select-none">
      {/* Barra fija: reloj y avance */}
      <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-slate-950/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono-tech text-slate-400">
            {revisando ? 'Revisión' : `Pregunta ${i + 1} de ${orden.length}`}
            {prueba && <span className="ml-2 text-amber-300">· PRUEBA</span>}
          </span>
          <span className={`font-mono-tech text-lg font-bold ${quedan <= 120 ? 'text-rose-400' : 'text-cyan-300'}`}>
            {mm}:{ss}
          </span>
        </div>
        <div className="flex gap-1 mt-2">
          {orden.map((q, k) => (
            <button key={q.id} onClick={() => { setRevisando(false); setI(k); }}
                    aria-label={`Ir a la pregunta ${k + 1}`}
                    className={`h-1.5 flex-1 rounded-full ${k === i && !revisando ? 'bg-cyan-300'
                      : contestada(q) ? 'bg-cyan-700' : 'bg-white/10'}`} />
          ))}
        </div>
      </div>

      {revisando ? (
        <Caja>
          <p className="text-white font-semibold text-lg">¿Enviar tu examen?</p>
          <p className="text-sm text-slate-400 mt-2">
            {faltan === 0
              ? 'Contestaste todas las preguntas.'
              : `Te faltan ${faltan} pregunta${faltan === 1 ? '' : 's'}. Toca una barrita de arriba para ir a ella.`}
          </p>
          <p className="text-sm text-slate-400 mt-2">Después de enviarlo ya no se puede cambiar.</p>
          <button onClick={() => cerrar('entregado', 'enviado')} className="btn-primary w-full justify-center py-3 mt-5">
            Enviar examen
          </button>
          <button onClick={() => setRevisando(false)} className="w-full text-sm text-slate-400 mt-3 py-2">
            Seguir contestando
          </button>
        </Caja>
      ) : (
        <>
          <Caja>
            <PreguntaVista p={p} resp={resp} poner={poner} />
          </Caja>
          <div className="flex gap-3 mt-4">
            <button disabled={i === 0} onClick={() => setI(i - 1)}
                    className="flex-1 rounded-xl border border-white/10 py-3 text-slate-300 disabled:opacity-30">
              ← Anterior
            </button>
            {i < orden.length - 1 ? (
              <button onClick={() => setI(i + 1)} className="flex-1 btn-primary justify-center py-3">Siguiente →</button>
            ) : (
              <button onClick={() => setRevisando(true)} className="flex-1 btn-primary justify-center py-3">Terminar</button>
            )}
          </div>
        </>
      )}
      <p className="text-[11px] text-slate-600 text-center mt-6">
        No salgas de esta página: si cambias de app o de pestaña, el examen se cancela.
      </p>
    </div>
  );
}

function PreguntaVista({ p, resp, poner }) {
  if (p.tipo === 'texto') {
    return (
      <>
        <p className="text-white font-semibold leading-snug">{p.texto}</p>
        <textarea
          value={resp[p.id] ?? ''}
          onChange={(e) => poner(p.id, e.target.value.slice(0, 1500))}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
          rows={7}
          autoComplete="off"
          writingsuggestions="false"
          placeholder="Escribe aquí con tus palabras…"
          className="mt-4 w-full select-text bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-base focus:outline-none focus:border-cyan-400/50"
        />
      </>
    );
  }
  if (p.tipo === 'orden') {
    return (
      <>
        <p className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">{p.texto}</p>
        <div className="space-y-5 mt-4">
          {p.pares.map((par, k) => {
            const llave = `${p.id}_${k}`;
            return (
              <div key={k}>
                <p className="text-white text-lg leading-snug">
                  <strong>{par.a}</strong>, <span className="text-cyan-300">¿antes o después que</span> <strong>{par.b}</strong>?
                </p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {[['antes', 'Antes'], ['despues', 'Después']].map(([v, t]) => (
                    <Opcion key={v} activa={resp[llave] === v} onClick={() => poner(llave, v)}>{t}</Opcion>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  if (p.tipo === 'logos') {
    return (
      <>
        <p className="text-white font-semibold leading-snug">{p.texto}</p>
        <div className="space-y-6 mt-4">
          {p.logos.map((l) => (
            <div key={l} className="rounded-xl border border-white/10 p-4">
              <img src={u(`/examen/logos/${l}.svg`)} alt="Logo" draggable="false"
                   className="h-16 w-16 mx-auto pointer-events-none" />
              <p className="text-[11px] font-mono-tech text-slate-500 mt-3">¿De cuál es?</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {p.nombres.map((n, k) => (
                  <Opcion key={k} chica activa={resp[`${p.id}_${l}_n`] === String(k)}
                          onClick={() => poner(`${p.id}_${l}_n`, String(k))}>{n}</Opcion>
                ))}
              </div>
              <p className="text-[11px] font-mono-tech text-slate-500 mt-3">¿Dónde se usa?</p>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {p.donde.map((d, k) => (
                  <Opcion key={k} chica activa={resp[`${p.id}_${l}_d`] === String(k)}
                          onClick={() => poner(`${p.id}_${l}_d`, String(k))}>{d}</Opcion>
                ))}
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }
  // opción múltiple: se guarda el índice ORIGINAL, aunque se muestren revueltas.
  return (
    <>
      <p className="text-white font-semibold leading-snug">{p.texto}</p>
      <div className="space-y-3 mt-4">
        {p.mezcla.map((k) => (
          <Opcion key={k} activa={resp[p.id] === String(k)} onClick={() => poner(p.id, String(k))}>
            {p.opciones[k]}
          </Opcion>
        ))}
      </div>
    </>
  );
}

// ─── Piezas ─────────────────────────────────────────────────────────────────

function Opcion({ activa, onClick, chica, children }) {
  return (
    <button type="button" onClick={onClick}
            className={`w-full rounded-xl border text-left transition ${chica ? 'px-3 py-2 text-sm' : 'px-4 py-3'} ${
              activa ? 'border-cyan-400 bg-cyan-400/15 text-white' : 'border-white/10 bg-white/5 text-slate-300'}`}>
      {children}
    </button>
  );
}

function Caja({ children }) {
  return <div className={`${caja} p-6 mt-5`}>{children}</div>;
}

function Falla({ children }) {
  return <p className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">{children}</p>;
}

function Encabezado({ examen, ficha, prueba }) {
  return (
    <div className="text-center">
      <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">{examen.materia}</span>
      <h1 className="text-2xl font-black text-white mt-1">{examen.titulo}</h1>
      {ficha && <p className="text-xs text-slate-500 mt-1">{ficha.nombre}{ficha.grupo && ` · ${ficha.grupo}`}{prueba && ' · modo prueba'}</p>}
    </div>
  );
}

function Aviso({ examen, alEmpezar }) {
  const [ocupado, setOcupado] = useState(false);
  return (
    <Caja>
      <p className="text-xs font-mono-tech text-amber-300 uppercase tracking-widest">Antes de empezar</p>
      <ul className="text-sm text-slate-300 space-y-3 mt-4 list-disc pl-5">
        <li>Tienes <strong className="text-white">{examen.minutos} minutos</strong> y {examen.preguntas.length} preguntas. Al acabarse el tiempo, el examen se entrega solo.</li>
        <li><strong className="text-white">Solo hay un intento.</strong> En cuanto toques «Empezar», ya cuenta.</li>
        <li><strong className="text-rose-300">Si sales de esta página, el examen se cancela:</strong> cambiar de app o de pestaña, minimizar o recargar. Se guarda lo que llevabas y no podrás volver a entrar.</li>
        <li>Pon tu celular en <strong className="text-white">No molestar</strong>: una llamada o tocar una notificación también te saca.</li>
        <li>Contesta con tus propias palabras. No se puede pegar texto.</li>
      </ul>
      <button disabled={ocupado} onClick={async () => { setOcupado(true); await alEmpezar(); setOcupado(false); }}
              className="btn-primary w-full justify-center py-3 mt-6 disabled:opacity-50">
        {ocupado ? 'Empezando…' : 'Empezar'}
      </button>
    </Caja>
  );
}

function Cancelado({ cierre, prueba }) {
  const fuera = cierre?.salida && cierre?.regreso ? Math.round((cierre.regreso - cierre.salida) / 1000) : null;
  return (
    <Caja>
      <p className="text-3xl text-center">✗</p>
      <p className="text-white font-semibold text-center mt-2">Tu examen se canceló.</p>
      <p className="text-sm text-slate-400 text-center mt-2">
        Motivo: {cierre?.motivo ?? 'salió de la página'}.
        {fuera !== null && ` Estuviste fuera ${fuera} segundo${fuera === 1 ? '' : 's'}.`}
      </p>
      <p className="text-sm text-slate-400 text-center mt-2">
        {prueba
          ? 'Modo prueba: así lo vería el alumno. No se guardó nada.'
          : 'Se guardó lo que llevabas. Si fue un accidente (una llamada, por ejemplo), habla con tu profesor.'}
      </p>
    </Caja>
  );
}

function Login() {
  const [msg, setMsg] = useState('');
  return (
    <Caja>
      <p className="text-white font-semibold">Entra con tu cuenta de Google</p>
      <p className="text-sm text-slate-400 mt-2">La misma de tu evaluación diagnóstica.</p>
      <button onClick={async () => {
                setMsg('');
                const a = await alumno();
                try { await a.entrarConGoogle(); } catch (e) { setMsg(a.mensajeDeError(e)); }
              }}
              className="w-full rounded-xl bg-white text-slate-800 font-semibold px-6 py-3.5 mt-5">
        Entrar con Google
      </button>
      {msg && <Falla>{msg}</Falla>}
    </Caja>
  );
}

function DatosAlumno({ usuario }) {
  const [nombre, setNombre] = useState(usuario?.displayName ?? '');
  const [grado, setGrado] = useState('1º');
  const [letra, setLetra] = useState('');
  const [turno, setTurno] = useState('Vesp');
  const [msg, setMsg] = useState('');
  const campo = 'mt-1 w-full bg-white/5 border border-white/10 rounded-xl px-3 py-3 text-white';
  return (
    <Caja>
      <form noValidate onSubmit={async (e) => {
        e.preventDefault();
        if (nombre.trim().length < 3) return setMsg('Escribe tu nombre completo.');
        if (!letra.trim()) return setMsg('Escribe la letra de tu grupo.');
        const a = await alumno();
        try {
          await a.crearMiFicha(usuario, nombre, `${grado} ${letra.trim().toUpperCase()} ${turno}`);
          location.reload();
        } catch (err) { setMsg(a.mensajeDeError(err)); }
      }}>
        <p className="text-white font-semibold">¿Quién eres?</p>
        <p className="text-sm text-slate-400 mt-2">No encontramos tu evaluación diagnóstica. Dinos tu nombre y grupo, solo esta vez.</p>
        <label className="block mt-4 text-xs text-slate-400">Nombre completo (apellidos primero)
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} className={campo} />
        </label>
        <div className="grid grid-cols-3 gap-3 mt-3">
          <label className="text-xs text-slate-400">Grado
            <select value={grado} onChange={(e) => setGrado(e.target.value)} className={campo}>
              <option>1º</option><option>2º</option><option>3º</option>
            </select>
          </label>
          <label className="text-xs text-slate-400">Grupo
            <input value={letra} maxLength={2} onChange={(e) => setLetra(e.target.value)} className={`${campo} uppercase`} />
          </label>
          <label className="text-xs text-slate-400">Turno
            <select value={turno} onChange={(e) => setTurno(e.target.value)} className={campo}>
              <option value="Vesp">Vesp.</option><option value="Mat">Mat.</option>
            </select>
          </label>
        </div>
        <button type="submit" className="btn-primary w-full justify-center py-3 mt-5">Continuar</button>
        {msg && <Falla>{msg}</Falla>}
      </form>
    </Caja>
  );
}

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { firebaseConfigurado } from '../lib/firebase-config';
import { SECCIONES, visible, faltantes, curpValida } from '../lib/expediente-preguntas.js';
import { folioBienFormado, normalizarFolio } from '../lib/folio.mjs';
import {
  entrarConFolio, salirFolio, observarFolio, expedientePrevio,
  guardarExpediente, mensajeFolio,
} from '../lib/expediente';

/* Cuestionario de nuevo ingreso para padres de familia.
 *
 * Se contesta desde el celular, en casa, así que está armado como un paso por
 * sección en vez de una página kilométrica: son unas cincuenta preguntas y de
 * corrido nadie las termina.
 *
 * EL AVANCE SE GUARDA EN EL PROPIO TELÉFONO, no en la base. Es a propósito. Un
 * expediente a medias, con la sección de violencia contestada y sin que nadie
 * haya aceptado todavía la declaración del final, no debería existir en el
 * servidor. Lo que se sube es el cuestionario completo, una sola vez, cuando la
 * familia le da a enviar. Mientras tanto vive en su teléfono y en ningún otro
 * lado.
 */

const caja = 'glass-card rounded-2xl p-5 sm:p-8 border border-white/10';
const borrador = (uid) => `antologia:expediente:${uid}`;

export default function ExpedienteFamilia() {
  const hayFirebase = firebaseConfigurado();
  const [fase, setFase] = useState(hayFirebase ? 'cargando' : 'sinFirebase');
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    if (!hayFirebase) return;
    return observarFolio(async (u) => {
      setUsuario(u);
      if (!u) { setFase('folio'); return; }
      setFase('cargando');
      try {
        const previo = await expedientePrevio(u.uid);
        setFase(previo ? 'hecho' : 'cuestionario');
      } catch {
        setFase('cuestionario'); // que un fallo de lectura no bloquee la entrega
      }
    });
  }, [hayFirebase]);

  if (fase === 'sinFirebase') {
    return (
      <div className={caja}>
        <h2 className="text-xl font-bold text-white mb-2">Cuestionario no disponible</h2>
        <p className="text-sm text-slate-400">
          Este sitio todavía no está conectado a la base de datos, así que el
          cuestionario no puede guardarse. Avisa en la escuela.
        </p>
      </div>
    );
  }

  if (fase === 'cargando') {
    return (
      <div className={`${caja} text-center`}>
        <div className="inline-block w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 mt-3 font-mono-tech">Un momento…</p>
      </div>
    );
  }

  if (fase === 'folio') return <PedirFolio />;

  if (fase === 'hecho') {
    return (
      <div className={caja}>
        <h2 className="text-xl font-bold text-white mb-2">Ya está contestado</h2>
        <p className="text-sm text-slate-400 mb-5">
          Este folio ya entregó su cuestionario. Si necesitas corregir algo,
          avisa en la escuela y ahí lo ajustan.
        </p>
        <button onClick={() => salirFolio()}
                className="text-xs font-mono-tech text-slate-500 hover:text-cyan-400 transition">
          Salir
        </button>
      </div>
    );
  }

  return <Cuestionario uid={usuario.uid} />;
}

/* ── entrada con folio ───────────────────────────────────────── */

function PedirFolio() {
  const [folio, setFolio] = useState('');
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const enviar = async (ev) => {
    ev.preventDefault();
    if (!folioBienFormado(folio)) {
      setError('El folio son 10 caracteres. Revisa que no falte ninguno.');
      return;
    }
    setError('');
    setOcupado(true);
    try {
      await entrarConFolio(folio);
    } catch (e) {
      setError(mensajeFolio(e));
      setOcupado(false);
    }
  };

  return (
    <div className={caja}>
      <div className="max-w-md mx-auto">
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
          // Acceso
        </span>
        <h2 className="text-2xl font-bold text-white mb-2">Escribe tu folio</h2>
        <p className="text-sm text-slate-400 mb-6">
          Es el código de 10 caracteres que te dieron en la escuela. Sirve una
          sola vez, para el cuestionario de tu hijo o hija.
        </p>

        <form onSubmit={enviar} noValidate>
          <label htmlFor="exp-folio"
                 className="text-xs font-mono-tech text-slate-400 uppercase tracking-wider block mb-1.5">
            Folio
          </label>
          <input
            id="exp-folio" type="text" required value={folio}
            onChange={(e) => setFolio(normalizarFolio(e.target.value))}
            autoComplete="off" autoCapitalize="characters" spellCheck="false"
            placeholder="XXXXXXXXXX" maxLength={14} inputMode="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white
                       font-mono-tech text-lg tracking-[0.25em] text-center
                       placeholder:text-slate-700 focus:outline-none focus:border-cyan-400/50
                       focus:bg-white/[0.07] transition"
          />

          {error && (
            <p className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button type="submit" disabled={ocupado}
                  className="btn-primary w-full justify-center py-3.5 mt-5 disabled:opacity-50">
            {ocupado ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── el cuestionario ─────────────────────────────────────────── */

function Cuestionario({ uid }) {
  const [paso, setPaso] = useState(0);
  const [v, setV] = useState({});
  const [errores, setErrores] = useState([]);
  const [acepta, setAcepta] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [falloEnvio, setFalloEnvio] = useState('');
  const [listo, setListo] = useState(false);

  const total = SECCIONES.length + 1; // +1 por la declaración final
  const seccion = SECCIONES[paso] ?? null;

  // Recuperar el borrador de este teléfono.
  useEffect(() => {
    try {
      const crudo = localStorage.getItem(borrador(uid));
      if (crudo) {
        const d = JSON.parse(crudo);
        setV(d.v ?? {});
        setPaso(Math.min(d.paso ?? 0, SECCIONES.length));
      }
    } catch { /* sin borrador, se empieza de cero */ }
  }, [uid]);

  // Guardarlo en cada cambio.
  useEffect(() => {
    try {
      localStorage.setItem(borrador(uid), JSON.stringify({ v, paso }));
    } catch { /* almacenamiento lleno o bloqueado: se sigue sin borrador */ }
  }, [uid, v, paso]);

  const poner = useCallback((clave, valor) => {
    setV((x) => ({ ...x, [clave]: valor }));
    setErrores((e) => e.filter((c) => c !== clave));
  }, []);

  const avanzar = () => {
    const faltan = faltantes(seccion, v);
    const malos = [...faltan];

    // La CURP mal escrita arruina el expediente sin que nadie lo note hasta que
    // se cruza con los sistemas de la SEP. Se revisa aquí.
    if (seccion.campos.some((c) => c.tipo === 'curp') && v.curp && !curpValida(v.curp)) {
      malos.push('curp');
    }
    if (seccion.campos.some((c) => c.tipo === 'correo') && v.correo &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v.correo).trim())) {
      malos.push('correo');
    }

    if (malos.length) {
      setErrores(malos);
      const primero = document.getElementById(`campo-${malos[0]}`);
      primero?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setErrores([]);
    setPaso((p) => p + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const retroceder = () => {
    setErrores([]);
    setPaso((p) => Math.max(0, p - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enviar = async () => {
    setEnviando(true);
    setFalloEnvio('');
    try {
      await guardarExpediente(uid, limpiar(v));
      try { localStorage.removeItem(borrador(uid)); } catch { /* da igual */ }
      setListo(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setFalloEnvio(mensajeFolio(e));
    } finally {
      setEnviando(false);
    }
  };

  if (listo) {
    return (
      <div className={caja}>
        <h2 className="text-2xl font-bold text-white mb-2">Listo, quedó registrado</h2>
        <p className="text-sm text-slate-400 mb-5">
          Gracias. Ya puedes cerrar esta página. Si algo cambia durante el
          ciclo escolar, avisa directamente en la escuela.
        </p>
        <button onClick={() => salirFolio()}
                className="text-xs font-mono-tech text-slate-500 hover:text-cyan-400 transition">
          Salir
        </button>
      </div>
    );
  }

  return (
    <div>
      <Progreso paso={paso} total={total} />

      {seccion ? (
        <div className={caja}>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">{seccion.titulo}</h2>
          {seccion.nota && (
            <p className="text-sm text-slate-400 mb-6">{seccion.nota}</p>
          )}
          {!seccion.nota && <div className="mb-6" />}

          <div className="space-y-6">
            {seccion.campos.filter((c) => visible(c, v)).map((c) => (
              <Campo key={c.clave} campo={c} valor={v[c.clave]}
                     onCambio={poner} malo={errores.includes(c.clave)} />
            ))}
          </div>
        </div>
      ) : (
        <Declaracion acepta={acepta} onAcepta={setAcepta}
                     valores={v} fallo={falloEnvio} />
      )}

      <div className="flex items-center gap-3 mt-6">
        {paso > 0 && (
          <button onClick={retroceder} disabled={enviando}
                  className="px-5 py-3 rounded-xl text-sm font-medium text-slate-400
                             border border-white/10 hover:text-white hover:border-white/20
                             transition disabled:opacity-50">
            Atrás
          </button>
        )}

        {seccion ? (
          <button onClick={avanzar} className="btn-primary flex-1 justify-center py-3">
            Siguiente
          </button>
        ) : (
          <button onClick={enviar} disabled={!acepta || enviando}
                  className="btn-primary flex-1 justify-center py-3 disabled:opacity-40">
            {enviando ? 'Enviando…' : 'Enviar cuestionario'}
          </button>
        )}
      </div>

      {errores.length > 0 && (
        <p className="mt-4 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
          Revisa lo que está marcado en rojo para poder seguir.
        </p>
      )}

      <p className="mt-6 text-xs text-slate-600 text-center">
        Tus respuestas se guardan en este teléfono mientras contestas. Se envían
        hasta que le des a <span className="text-slate-500">Enviar cuestionario</span>.
      </p>
    </div>
  );
}

/* ── piezas ──────────────────────────────────────────────────── */

function Progreso({ paso, total }) {
  const pct = Math.round((paso / total) * 100);
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between text-xs font-mono-tech text-slate-500 mb-2">
        <span>Sección {Math.min(paso + 1, total)} de {total}</span>
        <span>{pct}%</span>
      </div>
      <div className="h-1 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full bg-cyan-400/70 transition-all duration-300"
             style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function Campo({ campo, valor, onCambio, malo }) {
  const base =
    'w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder:text-slate-600 ' +
    'focus:outline-none focus:bg-white/[0.07] transition [color-scheme:dark] ' +
    (malo ? 'border-rose-500/50' : 'border-white/10 focus:border-cyan-400/50');

  const comun = {
    id: `campo-${campo.clave}`,
    value: valor ?? '',
    onChange: (e) => onCambio(campo.clave, e.target.value),
    className: base,
  };

  return (
    <div>
      <label htmlFor={`campo-${campo.clave}`}
             className="text-sm text-slate-200 block mb-1.5 leading-snug">
        {campo.rotulo}
        {campo.requerido && <span className="text-cyan-400 ml-1">*</span>}
      </label>
      {campo.ayuda && (
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">{campo.ayuda}</p>
      )}

      {campo.tipo === 'opcion' && (
        <select {...comun}>
          <option value="">Selecciona…</option>
          {campo.opciones.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      )}

      {campo.tipo === 'escala' && (
        <div className="flex flex-wrap gap-2">
          {campo.opciones.map((o) => {
            const activo = valor === o;
            return (
              <button
                key={o} type="button"
                onClick={() => onCambio(campo.clave, activo ? '' : o)}
                className={
                  'px-3.5 py-2 rounded-xl text-sm border transition ' +
                  (activo
                    ? 'bg-cyan-400/15 border-cyan-400/50 text-cyan-200'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/25')
                }
              >
                {o}
              </button>
            );
          })}
        </div>
      )}

      {campo.tipo === 'varias' && (
        <div className="grid sm:grid-cols-2 gap-2">
          {campo.opciones.map((o) => {
            const lista = Array.isArray(valor) ? valor : [];
            const activo = lista.includes(o);
            return (
              <label key={o}
                     className={
                       'flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm border cursor-pointer transition ' +
                       (activo
                         ? 'bg-cyan-400/10 border-cyan-400/40 text-cyan-100'
                         : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/25')
                     }>
                <input
                  type="checkbox" checked={activo}
                  onChange={() => onCambio(
                    campo.clave,
                    activo ? lista.filter((x) => x !== o) : [...lista, o],
                  )}
                  className="accent-cyan-400 w-4 h-4 flex-shrink-0"
                />
                <span className="leading-snug">{o}</span>
              </label>
            );
          })}
        </div>
      )}

      {campo.tipo === 'texto largo' && (
        <textarea {...comun} rows={3} />
      )}

      {campo.tipo === 'texto' && <input {...comun} type="text" />}
      {campo.tipo === 'fecha' && <input {...comun} type="date" />}
      {campo.tipo === 'correo' && (
        <input {...comun} type="email" inputMode="email" autoCapitalize="off" spellCheck="false" />
      )}
      {campo.tipo === 'telefono' && (
        <input {...comun} type="tel" inputMode="tel" placeholder="10 dígitos" maxLength={15} />
      )}
      {campo.tipo === 'numero' && (
        <input {...comun} type="number" inputMode="decimal"
               min={campo.min} max={campo.max} step={campo.paso} />
      )}
      {campo.tipo === 'curp' && (
        <input {...comun} type="text" maxLength={18} autoCapitalize="characters"
               spellCheck="false"
               className={`${base} font-mono-tech tracking-widest uppercase`}
               onChange={(e) => onCambio(campo.clave, e.target.value.toUpperCase())} />
      )}

      {malo && (
        <p className="text-xs text-rose-300 mt-1.5">{razon(campo, valor)}</p>
      )}
    </div>
  );
}

/** Por qué está marcado en rojo este campo. */
function razon(campo, valor) {
  const vacio = Array.isArray(valor)
    ? valor.length === 0
    : valor === undefined || String(valor).trim() === '';

  if (vacio) return 'Falta contestar esto.';
  if (campo.tipo === 'curp') return 'La CURP no tiene la forma correcta. Cópiala de su acta.';
  if (campo.tipo === 'correo') return 'Ese correo no parece válido. Revisa que tenga @ y un punto.';
  return 'Revisa este dato.';
}

/* ── declaración final ───────────────────────────────────────── */

function Declaracion({ acepta, onAcepta, valores, fallo }) {
  const nombre = [valores.apellidoPaterno, valores.apellidoMaterno, valores.nombres]
    .filter(Boolean).join(' ');

  return (
    <div className={caja}>
      <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Declaración</h2>

      <div className="rounded-xl bg-white/[0.03] border border-white/10 px-4 py-4 mb-5">
        <p className="text-sm text-slate-300 leading-relaxed">
          Bajo protesta de decir verdad, manifiesto que la información
          proporcionada en este documento es cierta.
        </p>
        {nombre && (
          <p className="text-sm text-slate-500 mt-3">
            Cuestionario de <span className="text-slate-300">{nombre}</span>
          </p>
        )}
      </div>

      <p className="text-xs text-slate-500 leading-relaxed mb-5">
        Los datos de este cuestionario los usa la escuela únicamente para el
        expediente del alumno, para gestionar becas y apoyos, y para planear el
        acompañamiento que necesite. Los consulta solo el personal autorizado.
        Las preguntas sobre salud, convivencia y economía eran opcionales.
      </p>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox" checked={acepta}
          onChange={(e) => onAcepta(e.target.checked)}
          className="accent-cyan-400 w-5 h-5 mt-0.5 flex-shrink-0"
        />
        <span className="text-sm text-slate-300 leading-relaxed">
          Acepto la declaración y autorizo que la escuela trate estos datos para
          los fines señalados.
        </span>
      </label>

      {fallo && (
        <p className="mt-5 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
          {fallo}
        </p>
      )}
    </div>
  );
}

/* ── utilidades ──────────────────────────────────────────────── */

/** Quita lo vacío y recorta lo que viene con espacios de más, para que la base
 *  no se llene de cadenas en blanco que luego hay que filtrar al exportar. */
function limpiar(v) {
  const out = {};
  for (const [k, valor] of Object.entries(v)) {
    if (Array.isArray(valor)) {
      if (valor.length) out[k] = valor;
    } else if (typeof valor === 'string') {
      const s = valor.trim();
      if (s !== '') out[k] = s;
    } else if (valor !== undefined && valor !== null) {
      out[k] = valor;
    }
  }
  return out;
}

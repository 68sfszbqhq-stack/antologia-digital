import React, { useState, useEffect, useCallback, useRef } from 'react';
import TestAnillosLandolt from './TestAnillosLandolt.jsx';
import { firebaseConfigurado } from '../lib/firebase-config';
import { ajustesLandolt, entrarAnonimo, guardarLandolt } from '../lib/landolt';

/* Registro y aplicación del test para alumnos de nuevo ingreso.
 *
 * Estos alumnos no tienen usuario ni código: llenan una ficha corta y empiezan.
 * El orden es:
 *
 *   1. ¿El profesor tiene el test abierto?  → si no, no se muestra la ficha
 *   2. Ficha de nuevo ingreso                → nombre, semestre, grupo, etc.
 *   3. El test, ya configurado por el profesor (figura, duración, semilla)
 *   4. Se guarda en la nube Y se ofrece la descarga
 *
 * El paso 4 hace las dos cosas a propósito. Guardar en la nube es lo cómodo,
 * pero si falla —no hay internet en el salón, se cayó Firebase, el test se
 * cerró a media aplicación— el alumno acaba de gastar cinco minutos de
 * concentración y ese dato no se puede recuperar pidiéndole que lo repita: la
 * segunda vez ya conoce la hoja. Por eso el botón de descarga aparece siempre,
 * haya funcionado el guardado o no.
 */

const caja = 'glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-8';

/** Que no se pierda un resultado por cerrar la pestaña sin querer. */
const MARCA = 'antologia:landolt-entregado';

/* Con qué se aplica el test cuando no hay forma de preguntarle a Firebase.
 * Son los valores del protocolo: figura 6 y cinco minutos. */
const RESPALDO = {
  abierta: 0, objetivo: 6, duracion: 300, semilla: 20260101, tamano: 'medio',
};

export default function LandoltAlumno() {
  const hayFirebase = firebaseConfigurado();

  const [fase, setFase] = useState('cargando'); // cargando | cerrado | ficha | test | fin
  const [ajustes, setAjustes] = useState(null);
  const [ficha, setFicha] = useState(null);
  const [guardado, setGuardado] = useState('pendiente'); // pendiente | ok | falla
  const [detalleFalla, setDetalleFalla] = useState('');
  const [repetido, setRepetido] = useState(false);
  const resultadoRef = useRef(null);

  useEffect(() => {
    let vivo = true;

    // Sin Firebase el test corre igual y solo se descarga. Ese respaldo es
    // intencional en todo el sitio: una configuración a medias no rompe nada.
    if (!hayFirebase) {
      setAjustes(RESPALDO);
      setFase('ficha');
      return;
    }

    (async () => {
      // La sesión anónima va PRIMERO, antes de leer la configuración: las
      // reglas solo dejan leer config/ a quien esté autenticado, así que sin
      // este paso la lectura falla y el test parecería cerrado siempre.
      // De paso, si el acceso anónimo no está habilitado en Firebase nos
      // enteramos ahora y no después de cinco minutos de prueba.
      try {
        await entrarAnonimo();
      } catch (e) {
        if (!vivo) return;
        setDetalleFalla(descifrar(e));
        // Con estos ajustes el test corre igual; solo no se guarda.
        setAjustes(RESPALDO);
        setFase('sinAcceso');
        return;
      }

      const a = await ajustesLandolt();
      if (!vivo) return;
      setAjustes(a);
      if (a.abierta === 0) { setFase('cerrado'); return; }
      try {
        const previo = localStorage.getItem(MARCA);
        if (previo === String(a.abierta)) setRepetido(true);
      } catch { /* navegador sin almacenamiento: seguimos */ }
      setFase('ficha');
    })();

    return () => { vivo = false; };
  }, [hayFirebase]);

  const alRegistrar = useCallback((datos) => {
    setFicha(datos);
    setFase('test');
  }, []);

  const alFinalizar = useCallback(async (r) => {
    resultadoRef.current = { ...r, ficha };
    setFase('fin');

    if (!hayFirebase || !ajustes?.abierta) { setGuardado('falla'); return; }
    try {
      await guardarLandolt(ajustes.abierta, ficha, r);
      setGuardado('ok');
      try { localStorage.setItem(MARCA, String(ajustes.abierta)); } catch { /* da igual */ }
    } catch (e) {
      setGuardado('falla');
      setDetalleFalla(descifrar(e));
    }
  }, [hayFirebase, ajustes, ficha]);

  /* ── pantallas ───────────────────────────────────────────────── */

  if (fase === 'cargando') {
    return (
      <div className={`${caja} text-center`}>
        <div className="inline-block w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 mt-3 font-mono-tech">Un momento…</p>
      </div>
    );
  }

  // No se pudo abrir sesión: casi siempre es que falta activar el acceso
  // anónimo en Firebase. No se bloquea al alumno por eso; el test corre y el
  // resultado se descarga.
  if (fase === 'sinAcceso') {
    return (
      <>
        <div className={`${caja} border-amber-400/20`}>
          <p className="text-sm text-amber-200/90">
            <strong className="block mb-1">No hay conexión con la base de datos.</strong>
            {detalleFalla} Puedes hacer el test de todos modos: al terminar,
            descarga tu resultado y entrégaselo a tu profesor.
          </p>
        </div>
        <Ficha onListo={alRegistrar} sinNube />
      </>
    );
  }

  if (fase === 'cerrado') {
    return (
      <div className={caja}>
        <h2 className="text-xl font-bold text-white mb-2">El test no está abierto</h2>
        <p className="text-sm text-slate-400">
          Tu profesor todavía no lo habilita. Espera a que te lo indique en clase.
        </p>
      </div>
    );
  }

  if (fase === 'ficha') {
    return (
      <>
        {repetido && (
          <div className={`${caja} border-amber-400/20`}>
            <p className="text-sm text-amber-200/90">
              Este dispositivo ya entregó una vez. Si eres otra persona, adelante;
              si eres tú, avísale a tu profesor antes de repetir.
            </p>
          </div>
        )}
        <Ficha onListo={alRegistrar} sinNube={!hayFirebase} />
      </>
    );
  }

  /* 'test' y 'fin' comparten este render a propósito. El test guarda sus
   * marcas y sus resultados en su propio estado, así que tiene que quedarse en
   * la MISMA posición del árbol: si lo pusiera en otra rama según la fase,
   * React lo remontaría y borraría lo que el alumno acaba de hacer. Lo único
   * que cambia entre las dos fases es lo que va encima. */
  return (
    <>
      {fase === 'fin' ? (
        <Acuse estado={hayFirebase ? guardado : 'sinNube'} detalle={detalleFalla} />
      ) : (
        <div className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <span className="text-cyan-400 text-xs">●</span>
          <span className="text-xs font-mono-tech text-slate-300 truncate">{ficha.nombre}</span>
          <span className="text-xs font-mono-tech text-slate-600 truncate">
            {ficha.semestre}º {ficha.grupo} · {ficha.turno}
          </span>
        </div>
      )}

      <TestAnillosLandolt
        evaluado={ficha.nombre}
        ajustes={ajustes}
        onFinalizar={alFinalizar}
      />
    </>
  );
}

/* ── acuse de recibo ─────────────────────────────────────────── */

function Acuse({ estado, detalle }) {
  if (estado === 'ok') {
    return (
      <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
        Tu resultado quedó guardado. Ya puedes cerrar la página.
      </div>
    );
  }

  const texto =
    estado === 'sinNube'
      ? 'Este equipo no está conectado a la base de datos.'
      : `No se pudo guardar en la nube. ${detalle}`;

  return (
    <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-amber-500/10 border border-amber-500/20 text-amber-200">
      <strong className="block mb-1">{texto}</strong>
      Baja tu resultado con el botón <em>Descargar CSV</em> que está más abajo y
      entrégaselo a tu profesor. No repitas el test: la segunda vez ya no mide lo
      mismo, porque ya conoces la hoja.
    </div>
  );
}

/* ── ficha de nuevo ingreso ──────────────────────────────────── */

const GENEROS = ['Mujer', 'Hombre', 'Prefiero no decirlo'];
const TURNOS = ['Matutino', 'Vespertino'];

function Ficha({ onListo, sinNube }) {
  const [v, setV] = useState({
    nombre: '', nacimiento: '', genero: '', semestre: '1',
    grupo: '', turno: 'Matutino', procedencia: '',
  });
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const cambiar = (campo) => (e) => setV((x) => ({ ...x, [campo]: e.target.value }));

  const enviar = async (ev) => {
    ev.preventDefault();
    const nombre = v.nombre.trim().replace(/\s+/g, ' ');
    const grupo = v.grupo.trim().toUpperCase();

    if (nombre.length < 5 || !nombre.includes(' ')) {
      setError('Escribe tu nombre completo, con apellidos.');
      return;
    }
    if (!v.nacimiento) { setError('Falta tu fecha de nacimiento.'); return; }

    // Una fecha absurda casi siempre es un dedazo en el año, y arruina el dato
    // sin que nadie se dé cuenta hasta que se analiza el grupo entero.
    const edad = edadEn(v.nacimiento);
    if (edad === null || edad < 12 || edad > 25) {
      setError('Revisa tu fecha de nacimiento: esa edad no cuadra para bachillerato.');
      return;
    }
    if (!v.genero) { setError('Falta seleccionar una opción en género.'); return; }
    if (!grupo) { setError('Falta tu grupo.'); return; }

    setError('');
    setOcupado(true);
    await onListo({
      nombre,
      nacimiento: v.nacimiento,
      genero: v.genero,
      semestre: Number(v.semestre),
      grupo,
      turno: v.turno,
      procedencia: v.procedencia.trim(),
    });
  };

  const campo =
    'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white ' +
    'placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/50 ' +
    'focus:bg-white/[0.07] transition [color-scheme:dark]';
  const rotulo = 'text-xs font-mono-tech text-slate-400 uppercase tracking-wider block mb-1.5';

  return (
    <div className={caja}>
      <div className="max-w-xl mx-auto">
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
          // Registro
        </span>
        <h2 className="text-2xl font-bold text-white mb-2">Tus datos</h2>
        <p className="text-sm text-slate-400 mb-6">
          Llénalos una sola vez, antes de empezar. Sirven para que tu profesor
          sepa de quién es cada resultado.
        </p>

        <form onSubmit={enviar} className="space-y-4" noValidate>
          <div>
            <label htmlFor="lan-nombre" className={rotulo}>Nombre completo</label>
            <input
              id="lan-nombre" type="text" required value={v.nombre}
              onChange={cambiar('nombre')} autoComplete="name"
              placeholder="Nombre y apellidos" className={campo}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="lan-nac" className={rotulo}>Fecha de nacimiento</label>
              <input
                id="lan-nac" type="date" required value={v.nacimiento}
                onChange={cambiar('nacimiento')} className={campo}
              />
            </div>
            <div>
              <label htmlFor="lan-genero" className={rotulo}>Género</label>
              <select id="lan-genero" required value={v.genero}
                      onChange={cambiar('genero')} className={campo}>
                <option value="">Selecciona…</option>
                {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="lan-sem" className={rotulo}>Semestre</label>
              <select id="lan-sem" value={v.semestre}
                      onChange={cambiar('semestre')} className={campo}>
                {[1, 2, 3, 4, 5, 6].map((s) => <option key={s} value={s}>{s}º</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="lan-grupo" className={rotulo}>Grupo</label>
              <input
                id="lan-grupo" type="text" required value={v.grupo}
                onChange={cambiar('grupo')} placeholder="A" maxLength={4}
                autoCapitalize="characters" className={campo}
              />
            </div>
            <div>
              <label htmlFor="lan-turno" className={rotulo}>Turno</label>
              <select id="lan-turno" value={v.turno}
                      onChange={cambiar('turno')} className={campo}>
                {TURNOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="lan-proc" className={rotulo}>
              Secundaria de procedencia <span className="text-slate-600 normal-case">(opcional)</span>
            </label>
            <input
              id="lan-proc" type="text" value={v.procedencia}
              onChange={cambiar('procedencia')} placeholder="Nombre de tu secundaria"
              className={campo}
            />
          </div>

          {error && (
            <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <p className="text-xs text-slate-500 leading-relaxed">
            Tus datos se usan solo para este diagnóstico escolar.
            {sinNube && ' Este equipo no está conectado: al terminar tendrás que descargar tu resultado.'}
          </p>

          <button type="submit" disabled={ocupado}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50">
            {ocupado ? 'Preparando…' : 'Continuar'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ── utilidades ──────────────────────────────────────────────── */

function edadEn(iso) {
  const f = new Date(iso + 'T00:00:00');
  if (Number.isNaN(f.getTime())) return null;
  const hoy = new Date();
  let edad = hoy.getFullYear() - f.getFullYear();
  const m = hoy.getMonth() - f.getMonth();
  if (m < 0 || (m === 0 && hoy.getDate() < f.getDate())) edad--;
  return edad;
}

function descifrar(e) {
  if (e?.code === 'permission-denied') return 'El profesor cerró el test.';
  if (e?.code === 'auth/operation-not-allowed') return 'Falta activar el acceso anónimo en Firebase.';
  if (e?.code === 'auth/network-request-failed') return 'No hay conexión a internet.';
  if (e?.code === 'unavailable') return 'No hay conexión con la base de datos.';
  return 'Avísale a tu profesor.';
}

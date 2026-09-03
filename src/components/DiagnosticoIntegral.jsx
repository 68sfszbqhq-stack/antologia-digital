import React, { useState, useEffect, useCallback, useRef, Suspense, lazy } from 'react';
import TestAnillosLandolt from './TestAnillosLandolt.jsx';
import TestTemperamento, { ResultadoTemperamento } from './TestTemperamento.jsx';
import EvaluacionAcademica, { ResultadoAcademico } from './EvaluacionAcademica.jsx';
import DiagnosticoInicial, { ResultadoInicial } from './DiagnosticoInicial.jsx';
import TestChaside, { ResultadoChaside } from './TestChaside.jsx';

/* El cuadernillo se carga aparte, y solo cuando un alumno de primer año llega a
 * él. NO es una optimización de peso: es lo que permite que el sitio funcione en
 * celulares viejos.
 *
 * El cuadernillo arrastra pdf.js, que usa `Promise.withResolvers` —una función
 * que solo existe desde Chrome 119, de finales de 2023—. Mientras se importaba
 * aquí arriba, ese código entraba en el mismo archivo que todo lo demás, así que
 * un teléfono más viejo ni siquiera lograba leerlo: la página se quedaba en
 * blanco y el alumno "no podía entrar", aunque fuera de segundo o tercero y no
 * tuviera nada que ver con el cuadernillo.
 *
 * Con `lazy` ese código vive en su propio archivo, que solo se descarga cuando
 * de verdad hace falta. Los de segundo y tercero no lo tocan nunca. */
const Cuadernillo = lazy(() => import('./Cuadernillo.jsx'));
import { GRADOS, totalDe, usaCuadernillo } from '../lib/diagnostico-materias.js';
import { TEMPERAMENTOS } from '../lib/temperamento.js';
import { firebaseConfigurado } from '../lib/firebase-config';
import {
  ajustesDiagnostico, entrarConGoogle, salirDiagnostico, observarDiagnostico,
  sesionPorRedireccion, sesionPrevia, abrirSesion, guardarAvance, entregarSesion,
  mensajeDiagnostico,
} from '../lib/diagnostico';
import {
  perfilPrevio, abrirPerfil, guardarAvancePerfil, entregarPerfil,
} from '../lib/perfil';
import {
  vocacionalPrevio, abrirVocacional, guardarAvanceVocacional, entregarVocacional,
} from '../lib/vocacional';

/* La sesión completa de diagnóstico, de principio a fin.
 *
 * EL ORDEN ES FIJO Y ESTÁ PENSADO:
 *
 *   1. Entrar con Google → identifica al alumno y es lo que permite retomar.
 *   2. Datos             → una sola vez, y ahí se elige el grado.
 *   3. Atención          → PRIMERO, mientras está fresco. Es lo único con reloj;
 *                          aplicado al final mediría el cansancio de la sesión.
 *   4. Temperamento      → en medio. Sin reloj y sin respuestas correctas,
 *                          funciona como descanso entre las dos partes duras.
 *   5. Evaluación        → al final, porque es la más larga.
 *
 * SE GUARDA CONFORME AVANZA. Cada bloque terminado se manda en cuanto termina, y
 * el cuadernillo de primer año se manda cada pocos segundos mientras contesta.
 * Si el alumno cierra la pestaña, se le apaga el celular o se acaba la clase,
 * vuelve a entrar con la misma cuenta y sigue donde iba: el documento se llama
 * `<uid>_<aplicación>` justamente para eso.
 *
 * Y pase lo que pase con el guardado, al final siempre se ofrece la descarga. Si
 * la nube falla, el alumno acaba de gastar una hora y ese dato no se recupera
 * pidiéndole que lo repita.
 */

const caja = 'glass-card rounded-2xl p-6 sm:p-8 border border-white/10 mb-8';

const RESPALDO = {
  abierta: 0,
  bloques: { atencion: true, temperamento: true, academica: true },
  objetivo: 6, duracion: 300, semilla: 20260101, tamano: 'medio',
};

export default function DiagnosticoIntegral() {
  const hayFirebase = firebaseConfigurado();

  // undefined = todavía no sabemos quién es; null = nadie.
  const [usuario, setUsuario] = useState(hayFirebase ? undefined : null);

  // cargando | entrar | preparando | cerrado | ficha
  // | atencion | temperamento | academica | fin
  const [fase, setFase] = useState('cargando');
  const [ajustes, setAjustes] = useState(null);
  const [ficha, setFicha] = useState(null);
  const [entrega, setEntrega] = useState({
    atencion: null, temperamento: null, academica: null, cuadernillo: null,
  });
  const [guardado, setGuardado] = useState('pendiente'); // pendiente | ok | falla
  const [detalleFalla, setDetalleFalla] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [retomado, setRetomado] = useState(false);
  const [yaEstaba, setYaEstaba] = useState(false);
  // El perfil socioemocional vive en su propio documento, con su propio ciclo:
  // llegó después de que 41 alumnos ya habían entregado, y su evaluación quedó
  // congelada a propósito. Ver src/lib/perfil.ts.
  const [perfil, setPerfil] = useState(null);
  const [vocacional, setVocacional] = useState(null);

  const entregaRef = useRef(entrega);
  entregaRef.current = entrega;
  const fichaRef = useRef(ficha);
  fichaRef.current = ficha;

  /* ── quién entró ─────────────────────────────────────────────── */

  useEffect(() => {
    if (!hayFirebase) { setAjustes(RESPALDO); setFase('ficha'); return; }
    // Si el alumno viene de vuelta de Google por redirección, hay que recoger
    // esa sesión: sin esto volvería a la página y parecería que no entró.
    sesionPorRedireccion();
    return observarDiagnostico((u) => setUsuario(u ?? null));
  }, [hayFirebase]);

  /* ── preparar la sesión de quien entró ───────────────────────── */

  useEffect(() => {
    if (!hayFirebase || usuario === undefined) return;
    if (!usuario) { setFase('entrar'); return; }

    let vivo = true;
    (async () => {
      setFase('preparando');

      // La configuración solo se puede leer estando identificado, así que este
      // paso va necesariamente después de entrar con Google.
      const a = await ajustesDiagnostico();
      if (!vivo) return;
      setAjustes(a);
      if (a.abierta === 0) { setFase('cerrado'); return; }

      let previa = null;
      try {
        previa = await sesionPrevia(usuario.uid, a.abierta);
      } catch (e) {
        // Si no se puede leer lo previo, se empieza de cero en vez de trabarse.
        // Lo peor que pasa es que se repita, y eso es mejor que no poder entrar.
        console.error('[diagnóstico] no se pudo leer la sesión previa:', e);
      }
      if (!vivo) return;

      // El perfil se busca siempre, haya entregado o no: es una sección aparte.
      try {
        const [pr, vo] = await Promise.all([
          perfilPrevio(usuario.uid, a.abierta),
          vocacionalPrevio(usuario.uid, a.abierta),
        ]);
        if (vivo) { setPerfil(pr); setVocacional(vo); }
      } catch (e) {
        console.error('[diagnóstico] no se pudieron leer las secciones nuevas:', e);
      }
      if (!vivo) return;

      if (!previa) { setFase('ficha'); return; }

      const recuperada = {
        atencion: previa.atencion ?? null,
        temperamento: previa.temperamento ?? null,
        academica: previa.academica ?? null,
        cuadernillo: previa.cuadernillo ?? null,
      };
      setEntrega(recuperada);
      setFicha({
        nombre: previa.nombre, nacimiento: previa.nacimiento,
        genero: previa.genero, grado: previa.grado, grupo: previa.grupo,
        turno: previa.turno, procedencia: previa.procedencia,
      });

      if (previa.estado === 'entregado') {
        setYaEstaba(true);
        setGuardado('ok');
        setFase('fin');
        return;
      }

      setRetomado(true);
      setFase(dondeSeQuedo(previa, a.bloques));
    })();

    return () => { vivo = false; };
  }, [hayFirebase, usuario]);

  /* ── entrar con Google ───────────────────────────────────────── */

  const entrar = useCallback(async () => {
    setEntrando(true);
    setDetalleFalla('');
    try {
      const u = await entrarConGoogle();
      // `null` significa que se tomó el camino de la redirección: la página se
      // está yendo a Google. No se apaga el "ocupado" ni se muestra nada más,
      // porque en un segundo esta pantalla ya no existe.
      if (!u) return;
      // Si entró por la ventana emergente, el resto lo dispara observarDiagnostico.
    } catch (e) {
      setDetalleFalla(mensajeDiagnostico(e));
      setEntrando(false);
    }
  }, []);

  /* ── avanzar ─────────────────────────────────────────────────── */

  /** El siguiente bloque activo después del que se acaba de terminar. */
  const siguienteFase = useCallback((desde) => {
    const b = ajustes?.bloques ?? RESPALDO.bloques;
    const orden = ['atencion', 'temperamento', 'academica'];
    // El cuadernillo ocupa el lugar de 'academica': terminarlo termina la sesión.
    const paso = desde === 'cuadernillo' ? 'academica' : desde;
    const i = paso === null ? 0 : orden.indexOf(paso) + 1;
    for (let k = i; k < orden.length; k++) if (b[orden[k]]) return orden[k];
    return 'fin';
  }, [ajustes]);

  const alRegistrar = useCallback(async (datos) => {
    setFicha(datos);
    if (hayFirebase && usuario && ajustes?.abierta) {
      try {
        await abrirSesion(usuario, ajustes.abierta, datos);
      } catch (e) {
        // No se bloquea al alumno por esto: puede contestar y descargar. Pero
        // se avisa desde ahora, no hasta el final, porque si algo está mal en
        // la configuración es mejor enterarse antes de la hora de examen.
        setDetalleFalla(mensajeDiagnostico(e));
      }
    }
    setFase(siguienteFase(null));
  }, [hayFirebase, usuario, ajustes, siguienteFase]);

  /** Guarda un avance sin interrumpir al alumno si falla. */
  const avanzar = useCallback(async (parche) => {
    if (!hayFirebase || !usuario || !ajustes?.abierta) return;
    try {
      await guardarAvance(usuario.uid, ajustes.abierta, parche);
    } catch (e) {
      console.error('[diagnóstico] no se pudo guardar el avance:', e);
    }
  }, [hayFirebase, usuario, ajustes]);

  const cerrarTodo = useCallback(async (entregaFinal) => {
    setFase('fin');
    if (!hayFirebase || !usuario || !ajustes?.abierta) {
      setGuardado('falla');
      setDetalleFalla((d) => d || 'Este equipo no está conectado a la base de datos.');
      return;
    }
    try {
      await entregarSesion(usuario.uid, ajustes.abierta, {
        atencion: entregaFinal.atencion ?? null,
        temperamento: entregaFinal.temperamento ?? null,
        academica: entregaFinal.academica ?? null,
        cuadernillo: entregaFinal.cuadernillo ?? null,
      });
      setGuardado('ok');
    } catch (e) {
      setGuardado('falla');
      setDetalleFalla(mensajeDiagnostico(e));
    }
  }, [hayFirebase, usuario, ajustes]);

  const terminarBloque = useCallback(async (bloque, datos) => {
    const nueva = { ...entregaRef.current, [bloque]: datos };
    setEntrega(nueva);

    const sig = siguienteFase(bloque);
    if (sig === 'fin') { cerrarTodo(nueva); return; }

    // Se guarda ANTES de pasar al siguiente bloque: si el alumno cierra la
    // pestaña justo aquí, lo que ya contestó no se pierde.
    await avanzar({ [bloque]: datos });
    setFase(sig);
  }, [siguienteFase, avanzar, cerrarTodo]);

  /** Avance parcial del cuadernillo, mientras el alumno todavía contesta. */
  const avanceCuadernillo = useCallback((parcial) => {
    setEntrega((e) => ({ ...e, cuadernillo: parcial }));
    avanzar({ cuadernillo: parcial });
  }, [avanzar]);

  const cambiarDeCuenta = useCallback(async () => {
    try { await salirDiagnostico(); } catch { /* da igual */ }
    setFicha(null);
    setEntrega({ atencion: null, temperamento: null, academica: null, cuadernillo: null });
    setGuardado('pendiente');
    setDetalleFalla('');
    setRetomado(false);
    setYaEstaba(false);
  }, []);

  /* ── pantallas ───────────────────────────────────────────────── */

  if (fase === 'cargando' || fase === 'preparando') {
    return (
      <div className={`${caja} text-center`}>
        <div className="inline-block w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
        <p className="text-sm text-slate-400 mt-3 font-mono-tech">
          {fase === 'preparando' ? 'Buscando si ya habías empezado…' : 'Un momento…'}
        </p>
      </div>
    );
  }

  if (fase === 'entrar') {
    return <Entrada onEntrar={entrar} ocupado={entrando} error={detalleFalla} />;
  }

  if (fase === 'cerrado') {
    return (
      <div className={caja}>
        <h2 className="text-xl font-bold text-white mb-2">La evaluación está cerrada</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-4">
          Tu profesor la abre durante los días en que se aplica. Si ya empezaron y
          sigues viendo esto, avísale: seguramente falta abrirla.
        </p>
        <BotonSalir usuario={usuario} onSalir={cambiarDeCuenta} />
      </div>
    );
  }

  if (fase === 'ficha') {
    return (
      <>
        <Identificado usuario={usuario} onSalir={cambiarDeCuenta} />
        <Ficha
          onListo={alRegistrar}
          sinNube={!hayFirebase}
          bloques={ajustes?.bloques}
          nombreSugerido={usuario?.displayName ?? ''}
        />
      </>
    );
  }

  if (fase === 'atencion') {
    return (
      <>
        <Identificado usuario={usuario} onSalir={cambiarDeCuenta} />
        {retomado && <AvisoRetomado />}
        <Paso n={1} de={contar(ajustes?.bloques)} titulo="Test de atención" />
        <div className="glass-card rounded-2xl p-4 sm:p-5 border border-white/10 mb-6">
          <p className="text-sm text-slate-400 leading-relaxed">
            Vas a ver una hoja llena de anillos con una abertura en distintas
            posiciones. Marca, lo más rápido que puedas y sin equivocarte, solo
            los que tengan la abertura donde se te indique. Empieza por la
            primera fila y sigue en orden, como si leyeras.
            <strong className="text-slate-200"> El reloj no se detiene.</strong>
          </p>
        </div>
        <TestAnillosLandolt
          evaluado={ficha?.nombre ?? ''}
          ajustes={ajustes}
          onFinalizar={(r) => terminarBloque('atencion', {
            objetivo: r.objetivo, semilla: r.semilla,
            N: r.N, CA: r.CA, CT: r.CT, falsos: r.falsos, omisiones: r.omisiones,
            n: r.n, T: r.T, S: r.S, IA: r.IA, variante: r.variante,
          })}
        />
      </>
    );
  }

  if (fase === 'temperamento') {
    return (
      <>
        <Identificado usuario={usuario} onSalir={cambiarDeCuenta} />
        {retomado && <AvisoRetomado />}
        <Paso
          n={ajustes?.bloques?.atencion ? 2 : 1}
          de={contar(ajustes?.bloques)}
          titulo="Test de temperamento"
        />
        <TestTemperamento onFinalizar={(p) => terminarBloque('temperamento', p)} />
      </>
    );
  }

  if (fase === 'academica') {
    // Primer año contesta el cuadernillo oficial en PDF; los otros dos, la
    // evaluación por materias. Es la misma casilla del flujo, con otra puerta.
    const conCuadernillo = usaCuadernillo(ficha?.grado);
    return (
      <>
        <Identificado usuario={usuario} onSalir={cambiarDeCuenta} />
        {retomado && <AvisoRetomado />}
        <Paso
          n={contar(ajustes?.bloques)}
          de={contar(ajustes?.bloques)}
          titulo={`Evaluación diagnóstica · ${gradoNombre(ficha?.grado)}`}
        />
        {conCuadernillo ? (
          <Suspense fallback={<CargandoCuadernillo />}>
            <Cuadernillo
              respuestasIniciales={entrega.cuadernillo?.respuestas ?? null}
              onAvance={avanceCuadernillo}
              onFinalizar={(r) => terminarBloque('cuadernillo', r)}
            />
          </Suspense>
        ) : (
          <EvaluacionAcademica
            grado={ficha.grado}
            onFinalizar={(r) => terminarBloque('academica', r)}
          />
        )}
      </>
    );
  }

  if (fase === 'perfil') {
    return (
      <>
        <Identificado usuario={usuario} onSalir={cambiarDeCuenta} />
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
            Sección nueva
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-mono-tech text-slate-500">Cómo y en qué condiciones estudias</span>
        </div>
        <DiagnosticoInicial
          respuestasIniciales={perfil}
          onAvance={async (parcial) => {
            if (!hayFirebase || !usuario || !ajustes?.abierta) return;
            try {
              if (!perfil) {
                await abrirPerfil(usuario, ajustes.abierta, {
                  nombre: ficha?.nombre ?? '', grado: ficha?.grado ?? '', grupo: ficha?.grupo ?? '',
                });
                setPerfil({ estado: 'en curso', ...parcial });
              }
              await guardarAvancePerfil(usuario.uid, ajustes.abierta, parcial);
            } catch (e) {
              console.error('[perfil] no se pudo guardar el avance:', e);
            }
          }}
          onFinalizar={async (r) => {
            const listo = { ...r, estado: 'entregado' };
            setPerfil(listo);
            setFase('fin');
            if (!hayFirebase || !usuario || !ajustes?.abierta) return;
            try {
              if (!perfil) {
                await abrirPerfil(usuario, ajustes.abierta, {
                  nombre: ficha?.nombre ?? '', grado: ficha?.grado ?? '', grupo: ficha?.grupo ?? '',
                });
              }
              await entregarPerfil(usuario.uid, ajustes.abierta, {
                puntajes: r.puntajes,
                banderas: r.banderas,
                rojas: r.rojas,
                amarillas: r.amarillas,
                respuestasA: r.respuestasA,
                respuestasB: r.respuestasB,
                respuestasApoyo: r.respuestasApoyo,
              });
            } catch (e) {
              setDetalleFalla(mensajeDiagnostico(e));
            }
          }}
        />
      </>
    );
  }

  if (fase === 'vocacional') {
    // Guarda por si se llega aquí por otro camino: la lista de arriba ya la
    // esconde, pero la pantalla no debe depender de que la lista se porte bien.
    if (ficha?.grado !== '3ero') { setFase('fin'); return null; }
    return (
      <>
        <Identificado usuario={usuario} onSalir={cambiarDeCuenta} />
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
            Sección nueva
          </span>
          <span className="h-px flex-1 bg-white/10" />
          <span className="text-xs font-mono-tech text-slate-500">Orientación vocacional</span>
        </div>
        <TestChaside
          respuestasIniciales={vocacional?.respuestas ?? null}
          onAvance={async (respuestas) => {
            if (!hayFirebase || !usuario || !ajustes?.abierta) return;
            try {
              if (!vocacional) {
                await abrirVocacional(usuario, ajustes.abierta, {
                  nombre: ficha?.nombre ?? '', grado: ficha?.grado ?? '', grupo: ficha?.grupo ?? '',
                });
                setVocacional({ estado: 'en curso', respuestas });
              }
              await guardarAvanceVocacional(usuario.uid, ajustes.abierta, { respuestas });
            } catch (e) {
              console.error('[vocacional] no se pudo guardar el avance:', e);
            }
          }}
          onFinalizar={async (r) => {
            setVocacional({ ...r, estado: 'entregado' });
            setFase('fin');
            if (!hayFirebase || !usuario || !ajustes?.abierta) return;
            try {
              if (!vocacional) {
                await abrirVocacional(usuario, ajustes.abierta, {
                  nombre: ficha?.nombre ?? '', grado: ficha?.grado ?? '', grupo: ficha?.grupo ?? '',
                });
              }
              await entregarVocacional(usuario.uid, ajustes.abierta, {
                puntajes: r.puntajes,
                dominantes: r.dominantes,
                empateEnSegundo: r.empateEnSegundo,
                respuestas: r.respuestas,
              });
            } catch (e) {
              setDetalleFalla(mensajeDiagnostico(e));
            }
          }}
        />
      </>
    );
  }

  /* ── fin ─────────────────────────────────────────────────────── */

  return (
    <>
      <Identificado usuario={usuario} onSalir={cambiarDeCuenta} />
      <Cierre
        ficha={ficha}
        entrega={entrega}
        estado={guardado}
        detalle={detalleFalla}
        yaEstaba={yaEstaba}
        perfil={perfil}
        onPerfil={() => setFase('perfil')}
        vocacional={vocacional}
        onVocacional={() => setFase('vocacional')}
      />
    </>
  );
}

/* ── entrada con Google ──────────────────────────────────────── */

function Entrada({ onEntrar, ocupado, error }) {
  return (
    <div className={caja}>
      <div className="max-w-lg mx-auto text-center">
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-3">
          // Antes de empezar
        </span>
        <h2 className="text-2xl font-bold text-white mb-3">Entra con tu cuenta de Google</h2>
        <p className="text-sm text-slate-400 leading-relaxed mb-7">
          Sirve para dos cosas: que tu profesor sepa de quién es cada respuesta,
          y que si te sales a media evaluación puedas volver y seguir donde te
          quedaste. No se guarda tu contraseña: de Google solo llega tu correo.
        </p>

        <button
          type="button"
          onClick={onEntrar}
          disabled={ocupado}
          className="inline-flex items-center gap-3 rounded-xl bg-white text-slate-800 font-semibold px-6 py-3.5 hover:bg-slate-100 disabled:opacity-60 transition"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v9h11.8c-.5 2.7-2 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.4z"/>
            <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.3l-7.1-5.5c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.7C8.1 41.2 15.5 46 24 46z"/>
            <path fill="#FBBC05" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-2.9.7-4.3v-5.7H4.5C2.9 17.2 2 20.5 2 24s.9 6.8 2.5 9.7l7.3-5.4z"/>
            <path fill="#EA4335" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.1 29.9 2 24 2 15.5 2 8.1 6.8 4.5 14.3l7.3 5.7c1.7-5.2 6.5-9.3 12.2-9.3z"/>
          </svg>
          {ocupado ? 'Abriendo Google…' : 'Continuar con Google'}
        </button>

        {error && (
          <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mt-6 text-left">
            {error}
          </p>
        )}

        <p className="text-xs text-slate-600 leading-relaxed mt-7">
          Se abre una ventanita de Google. Si no aparece, revisa que no estés
          abriendo esta página dentro de WhatsApp o Instagram: ábrela en Chrome o
          Safari.
        </p>
      </div>
    </div>
  );
}

function Identificado({ usuario, onSalir }) {
  if (!usuario) return null;
  return (
    <div className="flex items-center justify-between gap-3 mb-5 px-1">
      <span className="text-xs font-mono-tech text-slate-500 truncate">
        {usuario.email}
      </span>
      <button
        type="button"
        onClick={onSalir}
        className="text-xs font-mono-tech text-slate-500 hover:text-cyan-400 transition shrink-0"
      >
        No soy yo
      </button>
    </div>
  );
}

function BotonSalir({ usuario, onSalir }) {
  if (!usuario) return null;
  return (
    <button
      type="button" onClick={onSalir}
      className="text-sm font-semibold text-slate-400 hover:text-white transition"
    >
      Entrar con otra cuenta
    </button>
  );
}

function CargandoCuadernillo() {
  return (
    <div className={`${caja} text-center`}>
      <div className="inline-block w-6 h-6 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
      <p className="text-sm text-slate-400 mt-3 font-mono-tech">Cargando el cuadernillo…</p>
      <p className="text-xs text-slate-600 mt-2">
        Son unos segundos la primera vez. No cierres la página.
      </p>
    </div>
  );
}

function AvisoRetomado() {
  return (
    <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-cyan-500/10 border border-cyan-500/20 text-cyan-200">
      <strong className="block mb-1">Continuamos donde te quedaste.</strong>
      Lo que ya habías contestado quedó guardado; no tienes que repetirlo.
    </div>
  );
}

/* ── piezas ──────────────────────────────────────────────────── */

/** Dónde retomar: el primer bloque activo que todavía no está completo. */
function dondeSeQuedo(previa, bloques) {
  const b = bloques ?? RESPALDO.bloques;
  if (b.atencion && !previa.atencion) return 'atencion';
  if (b.temperamento && !previa.temperamento) return 'temperamento';
  if (b.academica) {
    // El cuadernillo se guarda a medias mientras se contesta, así que su sola
    // presencia no significa que esté terminado: lo que lo da por terminado es
    // que el documento pase a 'entregado'. Como aquí sigue 'en curso', se
    // retoma con lo que llevaba.
    if (usaCuadernillo(previa.grado)) return 'academica';
    if (!previa.academica) return 'academica';
  }
  return 'fin';
}

function contar(bloques) {
  const b = bloques ?? RESPALDO.bloques;
  return ['atencion', 'temperamento', 'academica'].filter((k) => b[k]).length;
}

function gradoNombre(id) {
  return GRADOS.find((g) => g.id === id)?.nombre ?? '';
}

function Paso({ n, de, titulo }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest">
        Paso {n} de {de}
      </span>
      <span className="h-px flex-1 bg-white/10" />
      <span className="text-xs font-mono-tech text-slate-500">{titulo}</span>
    </div>
  );
}

function Cierre({ ficha, entrega, estado, detalle, yaEstaba, perfil, onPerfil, vocacional, onVocacional }) {
  const [bajado, setBajado] = useState(false);

  const descargar = () => {
    const csv = aCSV(ficha, entrega);
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `diagnostico-${(ficha?.nombre ?? 'alumno').replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    setBajado(true);
  };

  return (
    <div>
      {estado === 'ok' ? (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-emerald-500/10 border border-emerald-500/20 text-emerald-300">
          {yaEstaba
            ? 'Esta evaluación ya la habías entregado. Aquí están tus resultados.'
            : 'Listo. Tus resultados quedaron guardados y ya puedes cerrar la página.'}
        </div>
      ) : (
        <div className="mb-6 px-4 py-3 rounded-xl text-sm bg-amber-500/10 border border-amber-500/20 text-amber-200">
          <strong className="block mb-1">No se pudo guardar en la nube. {detalle}</strong>
          Descarga tu resultado con el botón de abajo y entrégaselo a tu
          profesor. No repitas la evaluación: la segunda vez ya no mide lo mismo.
        </div>
      )}

      <header className="mb-8">
        <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-2">
          // Resultados de {ficha?.nombre}
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          Esto es lo que salió
        </h2>
      </header>

      {/* Las secciones nuevas van ARRIBA de los resultados, no al final: quien
          ya entregó entra a ver lo suyo y se toparía con el aviso hasta abajo,
          después de tres bloques de gráficas.

          Se arman desde una lista y no como bloques copiados, porque los
          instrumentos siguen llegando de uno en uno: el que siga se agrega aquí
          con tres líneas. */}
      {[
        {
          id: 'perfil', doc: perfil, ir: onPerfil,
          soloSi: true, // este va para los tres grados
          titulo: 'Cómo y en qué condiciones estudias',
          nota: '34 preguntas, sin respuestas correctas y sin reloj.',
        },
        {
          id: 'vocacional', doc: vocacional, ir: onVocacional,
          // Solo tercero: es el año en que se decide la carrera, y aplicarlo
          // antes mide un interés que todavía se está formando.
          soloSi: ficha?.grado === '3ero',
          titulo: 'Orientación vocacional',
          nota: '98 preguntas de sí o no. Dice hacia dónde se inclinan tus intereses.',
        },
      ].filter((x) => x.soloSi !== false && x.doc?.estado !== 'entregado').map((x) => (
        <div key={x.id} className="glass-card rounded-2xl p-5 sm:p-6 border border-cyan-400/40 mb-4">
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-2">
            // Sección nueva
          </span>
          <h3 className="text-lg font-bold text-white mb-2">{x.titulo}</h3>
          <p className="text-sm text-slate-400 leading-relaxed mb-4">
            {x.nota} No toca nada de lo que ya entregaste
            {x.doc ? ', y lo que llevabas contestado sigue guardado' : ''}.
          </p>
          <button type="button" onClick={x.ir} className="btn-primary px-6 py-3">
            {x.doc ? 'Continuar esa sección' : 'Contestarla ahora'}
          </button>
        </div>
      ))}

      <div className="space-y-6">
        {perfil?.estado === 'entregado' && <ResultadoInicial r={perfil} />}
        {vocacional?.estado === 'entregado' && <ResultadoChaside r={vocacional} />}
        {entrega.atencion && <ResumenAtencion a={entrega.atencion} />}
        {entrega.temperamento && <ResultadoTemperamento perfil={entrega.temperamento} />}
        {entrega.academica && <ResultadoAcademico resultado={entrega.academica} />}
        {entrega.cuadernillo && <ResumenCuadernillo c={entrega.cuadernillo} />}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button type="button" onClick={descargar} className="btn-primary px-6 py-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          Descargar mis resultados
        </button>
        {bajado && (
          <span className="text-xs font-mono-tech text-emerald-400">Archivo descargado.</span>
        )}
      </div>
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

/* ── ficha ───────────────────────────────────────────────────── */

const GENEROS = ['Mujer', 'Hombre', 'Prefiero no decirlo'];
const TURNOS = ['Matutino', 'Vespertino'];

function Ficha({ onListo, sinNube, bloques, nombreSugerido }) {
  const [v, setV] = useState({
    nombre: nombreSugerido || '', nacimiento: '', genero: '', grado: '',
    grupo: '', turno: 'Matutino', procedencia: '',
  });
  const [error, setError] = useState('');
  const [ocupado, setOcupado] = useState(false);

  const cambiar = (campo) => (e) => setV((x) => ({ ...x, [campo]: e.target.value }));

  const enviar = async (ev) => {
    ev.preventDefault();
    const nombre = v.nombre.trim().replace(/\s+/g, ' ');
    // Se limpia aquí, al capturarlo, y no solo al contar: los alumnos escriben
    // el grupo de todas las formas posibles —"1-A", "1 A", '"A"', "A."— y cada
    // variante se vuelve un grupo distinto en los informes. Mejor que nazca
    // limpio que andarlo arreglando después.
    const grupo = v.grupo.toUpperCase().replace(/[^A-Z0-9]/g, '');

    if (nombre.length < 5 || !nombre.includes(' ')) {
      setError('Escribe tu nombre completo, con apellidos.');
      return;
    }
    if (!v.nacimiento) { setError('Falta tu fecha de nacimiento.'); return; }
    const edad = edadEn(v.nacimiento);
    if (edad === null || edad < 12 || edad > 25) {
      setError('Revisa tu fecha de nacimiento: esa edad no cuadra para bachillerato.');
      return;
    }
    if (!v.genero) { setError('Falta seleccionar una opción en género.'); return; }
    if (!v.grado) { setError('Falta elegir tu grado. De eso depende qué evaluación te toca.'); return; }
    if (!grupo) { setError('Falta tu grupo.'); return; }

    setError('');
    setOcupado(true);
    await onListo({
      nombre,
      nacimiento: v.nacimiento,
      genero: v.genero,
      grado: v.grado,
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

  const b = bloques ?? RESPALDO.bloques;

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
            <label htmlFor="dg-nombre" className={rotulo}>Nombre completo</label>
            <input
              id="dg-nombre" type="text" required value={v.nombre}
              onChange={cambiar('nombre')} autoComplete="name"
              placeholder="Nombre y apellidos" className={campo}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dg-nac" className={rotulo}>Fecha de nacimiento</label>
              <input
                id="dg-nac" type="date" required value={v.nacimiento}
                onChange={cambiar('nacimiento')} className={campo}
              />
            </div>
            <div>
              <label htmlFor="dg-genero" className={rotulo}>Género</label>
              <select id="dg-genero" required value={v.genero}
                      onChange={cambiar('genero')} className={campo}>
                <option value="">Selecciona…</option>
                {GENEROS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* El grado no es un dato más: decide qué evaluación se aplica. Por
              eso son tarjetas grandes y no un desplegable escondido entre los
              demás campos. */}
          <div>
            <span className={rotulo}>Grado que cursas</span>
            <div className="grid sm:grid-cols-3 gap-3">
              {GRADOS.map((g) => {
                const activo = v.grado === g.id;
                return (
                  <button
                    key={g.id} type="button"
                    onClick={() => setV((x) => ({ ...x, grado: g.id }))}
                    aria-pressed={activo}
                    className={`text-left rounded-xl p-4 border transition-all duration-150 ${
                      activo
                        ? 'bg-cyan-400/15 border-cyan-400/60'
                        : 'bg-white/[0.03] border-white/10 hover:border-white/25'
                    }`}
                  >
                    <span className={`block font-bold mb-1 ${activo ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {g.nombre}
                    </span>
                    <span className="block text-[11px] font-mono-tech text-slate-500 mb-2">
                      {g.semestre} · {totalDe(g.id)} reactivos
                    </span>
                    <span className="block text-xs text-slate-500 leading-snug">
                      {g.descripcion}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dg-grupo" className={rotulo}>Grupo</label>
              <input
                id="dg-grupo" type="text" required value={v.grupo}
                onChange={cambiar('grupo')} placeholder="A" maxLength={4}
                autoCapitalize="characters" className={campo}
              />
              <p className="text-[11px] text-slate-600 mt-1.5">
                Solo la letra o el número, sin comillas ni puntos.
              </p>
            </div>
            <div>
              <label htmlFor="dg-turno" className={rotulo}>Turno</label>
              <select id="dg-turno" value={v.turno}
                      onChange={cambiar('turno')} className={campo}>
                {TURNOS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="dg-proc" className={rotulo}>
              Escuela de procedencia <span className="text-slate-600 normal-case">(opcional)</span>
            </label>
            <input
              id="dg-proc" type="text" value={v.procedencia}
              onChange={cambiar('procedencia')} placeholder="Nombre de tu escuela anterior"
              className={campo}
            />
          </div>

          {error && (
            <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
            <span className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest block mb-2">
              Lo que vas a contestar
            </span>
            <ul className="text-xs text-slate-400 space-y-1">
              {b.atencion && <li>· Test de atención — 5 minutos, con reloj.</li>}
              {b.temperamento && <li>· Test de temperamento — 40 frases, sin reloj.</li>}
              {b.academica && (
                <li>
                  · Evaluación diagnóstica de tu grado —{' '}
                  {v.grado ? `${totalDe(v.grado)} reactivos` : 'depende del grado que elijas'}.
                </li>
              )}
            </ul>
            <p className="text-xs text-slate-600 leading-relaxed mt-3">
              No tienes que terminarlo de una sentada: se va guardando solo, y si
              te sales puedes volver con esta misma cuenta y seguir.
            </p>
          </div>

          {sinNube && (
            <p className="text-xs text-amber-300/80 leading-relaxed">
              Este equipo no está conectado a la base de datos: al terminar
              tendrás que descargar tu resultado y entregárselo a tu profesor.
            </p>
          )}

          <button type="submit" disabled={ocupado}
                  className="btn-primary w-full justify-center py-3 disabled:opacity-50">
            {ocupado ? 'Preparando…' : 'Empezar'}
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

/** El respaldo en papel: si la nube falla, esto es todo lo que hubo. */
function aCSV(ficha, e) {
  const esc = (x) => {
    const s = String(x ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const filas = [
    ['Diagnóstico integral'],
    ['Alumno', ficha?.nombre],
    ['Fecha', new Date().toLocaleString('es-MX')],
    ['Grado', ficha?.grado],
    ['Grupo', ficha?.grupo],
    ['Turno', ficha?.turno],
    ['Nacimiento', ficha?.nacimiento],
    ['Género', ficha?.genero],
    ['Procedencia', ficha?.procedencia],
    [],
  ];

  if (e.atencion) {
    const a = e.atencion;
    filas.push(['ATENCIÓN — Anillos de Landolt']);
    filas.push(['Figura objetivo', a.objetivo], ['Semilla', a.semilla]);
    filas.push(['N revisados', a.N], ['CA aciertos', a.CA], ['CT objetivos', a.CT]);
    filas.push(['Falsos', a.falsos], ['Omisiones', a.omisiones], ['Errores n', a.n]);
    filas.push(['Tiempo (s)', a.T], ['S', a.S], ['IA', a.IA], ['Variante', a.variante]);
    filas.push([]);
  }

  if (e.temperamento) {
    const t = e.temperamento;
    filas.push(['TEMPERAMENTO']);
    filas.push(['Dominante', TEMPERAMENTOS[t.dominante]?.nombre ?? t.dominante]);
    filas.push(['Secundario', TEMPERAMENTOS[t.secundario]?.nombre ?? t.secundario]);
    filas.push(['Sin dominante claro', t.empatado ? 'sí' : 'no']);
    for (const [k, v] of Object.entries(t.puntos)) {
      filas.push([TEMPERAMENTOS[k]?.nombre ?? k, v, `${t.porcentaje[k]}%`]);
    }
    filas.push([]);
  }

  if (e.cuadernillo) {
    const c = e.cuadernillo;
    filas.push(['CUADERNILLO DE INGRESO', c.cuadernillo]);
    filas.push(['Contestadas', c.contestadas], ['Total', c.total]);
    filas.push([]);
    if (c.porSeccion) {
      filas.push(['Área', 'Contestadas', 'Total']);
      for (const s of Object.values(c.porSeccion)) filas.push([s.nombre, s.contestadas, s.total]);
      filas.push([]);
    }
    filas.push(['Pregunta', 'Respuesta']);
    for (let n = 1; n <= c.total; n++) filas.push([n, c.respuestas?.[n] ?? '']);
    filas.push([]);
  }

  if (e.academica) {
    const a = e.academica;
    filas.push(['EVALUACIÓN DIAGNÓSTICA']);
    filas.push(['Aciertos', a.aciertos], ['Total', a.total], ['Porcentaje', `${a.porcentaje}%`]);
    filas.push([]);
    filas.push(['Materia', 'Aciertos', 'Total']);
    for (const m of Object.values(a.materias)) filas.push([m.nombre, m.ok, m.total]);
    filas.push([]);
    filas.push(['Reactivo', 'Respuesta']);
    for (const [id, r] of Object.entries(a.respuestas)) filas.push([id, r]);
  }

  return filas.map((f) => f.map(esc).join(',')).join('\n');
}

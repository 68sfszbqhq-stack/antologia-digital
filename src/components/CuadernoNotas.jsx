import React, { useState, useEffect, useMemo, useRef } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import {
  collection, doc, onSnapshot, addDoc, updateDoc, deleteField, serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { firebaseConfigurado } from '../lib/firebase-config';
import { campoCSV, descargarCSV } from '../lib/csv-idoceo';
import EntradaProfesor from './EntradaProfesor.jsx';

/* Cuaderno de notas: calificar un parcial a mano, criterio por criterio, como
 * en iDoceo.
 *
 * Cada parcial de cada grupo es UN documento de /cuadernos:
 *
 *   { titulo, grupo,
 *     alumnos:  [{ id, nombre }],          en el orden de la lista oficial
 *     columnas: [{ id, nombre, max, peso }],  los criterios del parcial
 *     notas:    { <alumnoId>: { <columnaId>: número } },
 *     vaciasCuentanCero }
 *
 * Los nombres de los alumnos viven en Firestore y no en el código: este sitio
 * es público y su código también. Solo el profesor puede leer /cuadernos.
 *
 * Cada calificación se guarda sola al salir de la casilla (una escritura por
 * casilla, no el documento entero), y la pantalla escucha el documento en vivo:
 * si se califica en el iPad, la Mac lo ve al instante.
 *
 * VACÍO NO ES CERO. Una casilla vacía es "todavía no lo califico"; por omisión
 * no cuenta ni a favor ni en contra, igual que en iDoceo. Al cerrar el parcial
 * se activa "Vacías cuentan como 0" y lo que no se entregó pesa como cero.
 *
 * PONDERACIÓN, COMO EN iDoceo. Si ningún criterio tiene peso, el total es la
 * suma de puntos sobre la suma de máximos. En cuanto uno lo tiene, el total es
 * la media ponderada: cada criterio se lleva a porcentaje de su máximo y se
 * multiplica por su peso. Así una libreta /16 con 40 % pesa lo mismo que si
 * valiera /10 o /28: lo que manda es el peso, no cuántos puntos tiene.
 */

const caja = 'glass-card rounded-2xl border border-white/10';
const nuevoId = (p) => p + Math.random().toString(36).slice(2, 8);

export default function CuadernoNotas() {
  const hayFirebase = firebaseConfigurado();
  const [usuario, setUsuario] = useState(hayFirebase ? undefined : null);
  const [cuadernos, setCuadernos] = useState(null);
  const [actual, setActual] = useState(null);
  const [error, setError] = useState('');
  const [creando, setCreando] = useState(false);

  useEffect(() => {
    if (!hayFirebase) return;
    return onAuthStateChanged(auth(), (u) => setUsuario(u ?? null));
  }, [hayFirebase]);

  useEffect(() => {
    if (!usuario) return;
    setError('');
    return onSnapshot(
      collection(db(), 'cuadernos'),
      (snap) => {
        const lista = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (a.creado?.seconds ?? 0) - (b.creado?.seconds ?? 0));
        setCuadernos(lista);
        // Recuerda cuál estaba abierto; si no, el más reciente.
        setActual((prev) => {
          if (prev && lista.some((c) => c.id === prev)) return prev;
          let guardado = null;
          try { guardado = localStorage.getItem('cuaderno-actual'); } catch {}
          if (guardado && lista.some((c) => c.id === guardado)) return guardado;
          return lista.at(-1)?.id ?? null;
        });
      },
      (e) => {
        setError(
          e?.code === 'permission-denied'
            ? 'Esta cuenta no tiene permiso para ver las calificaciones. Entra con la cuenta de profesor.'
            : `No se pudieron cargar los cuadernos (${e?.code ?? e}).`,
        );
        setCuadernos([]);
      },
    );
  }, [usuario]);

  useEffect(() => {
    if (actual) try { localStorage.setItem('cuaderno-actual', actual); } catch {}
  }, [actual]);

  if (!hayFirebase) {
    return (
      <div className={`${caja} p-6`}>
        <p className="text-sm text-amber-300">
          Firebase no está configurado en este sitio, así que no hay dónde guardar calificaciones.
        </p>
      </div>
    );
  }
  if (usuario === undefined) return <Cargando texto="Un momento…" />;
  if (!usuario) return <EntradaProfesor titulo="Cuaderno de notas" error={error} />;
  if (cuadernos === null) return <Cargando texto="Trayendo los cuadernos…" />;

  const cuaderno = cuadernos.find((c) => c.id === actual);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest block mb-1">
            // Calificaciones
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Cuaderno de notas</h1>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono-tech text-slate-600 truncate max-w-[14rem]">{usuario.email}</span>
          <button onClick={() => signOut(auth())} className="text-xs font-mono-tech text-slate-500 hover:text-rose-400 transition">
            Salir
          </button>
        </div>
      </div>

      {error && <Aviso>{error}</Aviso>}

      {/* Pestañas: un cuaderno por parcial y grupo, como las de colores de iDoceo. */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {cuadernos.map((c) => (
          <button
            key={c.id}
            onClick={() => { setActual(c.id); setCreando(false); }}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition ${
              c.id === actual && !creando
                ? 'bg-cyan-400/15 border-cyan-400/50 text-cyan-300'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
          >
            {c.titulo}
            {c.grupo && <span className="ml-2 text-[11px] font-mono-tech opacity-70">{c.grupo}</span>}
          </button>
        ))}
        <button
          onClick={() => setCreando(true)}
          className="px-4 py-2 rounded-xl text-sm border border-dashed border-white/15 text-slate-500 hover:text-cyan-300 hover:border-cyan-400/40 transition"
        >
          + Nuevo cuaderno
        </button>
      </div>

      {creando || !cuaderno ? (
        <NuevoCuaderno
          puedeCancelar={Boolean(cuaderno)}
          onCancelar={() => setCreando(false)}
          onCreado={(id) => { setActual(id); setCreando(false); }}
        />
      ) : (
        <Cuaderno key={cuaderno.id} c={cuaderno} onError={setError} />
      )}
    </div>
  );
}

/* ── un cuaderno ─────────────────────────────────────────────── */

function Cuaderno({ c, onError }) {
  const ref = doc(db(), 'cuadernos', c.id);
  const alumnos = c.alumnos ?? [];
  const columnas = c.columnas ?? [];
  const notas = c.notas ?? {};
  const cuentanCero = Boolean(c.vaciasCuentanCero);
  const [editando, setEditando] = useState(null); // id de columna, 'nueva', 'datos' o 'alumno'

  const guardar = async (cambios) => {
    try {
      await updateDoc(ref, { ...cambios, actualizado: serverTimestamp() });
    } catch (e) {
      onError(`No se guardó el cambio (${e?.code ?? e}). Revisa tu conexión y vuelve a intentarlo.`);
    }
  };

  const ponerNota = (alumnoId, colId, valor) =>
    guardar({ [`notas.${alumnoId}.${colId}`]: valor === null ? deleteField() : valor });

  // Pegar una columna copiada de Excel, Numbers o iDoceo: llena hacia abajo
  // desde la casilla donde se pegó, un renglón por alumno. Un renglón vacío deja
  // vacía esa casilla. Todo va en una sola escritura.
  const [avisoPegar, setAvisoPegar] = useState('');
  const pegarColumna = (fila, col, renglones) => {
    const cambios = {};
    const malos = [];
    renglones.slice(0, alumnos.length - fila).forEach((txt, i) => {
      const a = alumnos[fila + i];
      const limpio = txt.trim().replace(',', '.');
      if (limpio === '') {
        if (notas[a.id]?.[col.id] !== undefined) cambios[`notas.${a.id}.${col.id}`] = deleteField();
        return;
      }
      const n = Number(limpio);
      if (!Number.isFinite(n) || n < 0 || n > col.max) { malos.push(`${a.nombre} (${txt.trim()})`); return; }
      cambios[`notas.${a.id}.${col.id}`] = n;
    });
    const sobran = renglones.length - (alumnos.length - fila);
    setAvisoPegar([
      malos.length && `No se pegaron ${malos.length} por pasarse de ${col.max} o no ser número: ${malos.join(', ')}.`,
      sobran > 0 && `Sobraron ${sobran} renglones al final de la lista.`,
    ].filter(Boolean).join(' '));
    if (Object.keys(cambios).length) guardar(cambios);
  };

  const totales = useMemo(() => {
    const t = {};
    for (const a of alumnos) t[a.id] = totalDe(notas[a.id], columnas, cuentanCero);
    return t;
  }, [alumnos, columnas, notas, cuentanCero]);

  const promediosColumna = useMemo(() => {
    const p = {};
    for (const col of columnas) {
      const vals = alumnos.map((a) => notas[a.id]?.[col.id]).filter((v) => typeof v === 'number');
      p[col.id] = vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : null;
    }
    return p;
  }, [alumnos, columnas, notas]);

  const ponderado = columnas.some((col) => col.peso > 0);
  const sumaPesos = columnas.reduce((s, col) => s + (col.peso > 0 ? col.peso : 0), 0);

  const califs = alumnos.map((a) => totales[a.id].calif).filter((v) => v !== null);
  const promedioGrupo = califs.length ? califs.reduce((s, v) => s + v, 0) / califs.length : null;
  const reprobados = califs.filter((v) => v < 6).length;

  const exportar = () => {
    const enc = ['!Alumno', ...columnas.map((col) => `${col.nombre} (/${col.max})`), 'Calificación'];
    const filas = alumnos.map((a) => [
      a.nombre,
      ...columnas.map((col) => notas[a.id]?.[col.id] ?? ''),
      totales[a.id].calif === null ? '' : redondea(totales[a.id].calif),
    ]);
    const csv = [enc, ...filas].map((f) => f.map(campoCSV).join(',')).join('\r\n') + '\r\n';
    descargarCSV(`${c.titulo} ${c.grupo || ''}`.trim().replace(/[^\wÁÉÍÓÚÑáéíóúñº ]+/g, '') + '.csv', csv);
  };

  // Enter baja a la siguiente fila, como en una hoja de cálculo. Tab ya avanza
  // a la derecha por sí solo.
  const tabla = useRef(null);
  const bajar = (fila, colIdx) => {
    const sig = tabla.current?.querySelector(`[data-celda="${fila + 1}-${colIdx}"]`);
    if (sig) { sig.focus(); sig.select(); }
  };

  return (
    <div>
      {/* Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <Dato etiqueta="Alumnos" valor={alumnos.length} />
        <Dato etiqueta="Criterios" valor={columnas.length} />
        <Dato etiqueta="Promedio del grupo" valor={promedioGrupo === null ? '—' : redondea(promedioGrupo)} />
        <Dato etiqueta="Debajo de 6" valor={califs.length ? reprobados : '—'} alerta={reprobados > 0} />
      </div>

      {/* Herramientas */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <BotonChico onClick={() => setEditando('nueva')}>+ Criterio</BotonChico>
        <BotonChico onClick={() => setEditando('alumno')}>+ Alumno</BotonChico>
        <BotonChico onClick={() => setEditando('datos')}>Nombre del cuaderno</BotonChico>
        <BotonChico onClick={exportar} disabled={!columnas.length}>Descargar CSV para iDoceo</BotonChico>
        <label className="ml-auto flex items-center gap-2 text-xs font-mono-tech text-slate-400 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={cuentanCero}
            onChange={(e) => guardar({ vaciasCuentanCero: e.target.checked })}
            className="accent-cyan-400"
          />
          Vacías cuentan como 0
        </label>
      </div>

      {editando === 'nueva' && (
        <EditorColumna
          onCancelar={() => setEditando(null)}
          onGuardar={({ nombre, max }) => {
            guardar({ columnas: [...columnas, { id: nuevoId('c'), nombre, max }] });
            setEditando(null);
          }}
        />
      )}
      {columnas.some((col) => col.id === editando) && (
        <EditorColumna
          columna={columnas.find((col) => col.id === editando)}
          onCancelar={() => setEditando(null)}
          onGuardar={({ nombre, max }) => {
            guardar({ columnas: columnas.map((col) => (col.id === editando ? { ...col, nombre, max } : col)) });
            setEditando(null);
          }}
          onBorrar={() => {
            // Se borra el criterio y, con él, las notas que tenía.
            const cambios = { columnas: columnas.filter((col) => col.id !== editando) };
            for (const a of alumnos) {
              if (notas[a.id]?.[editando] !== undefined) cambios[`notas.${a.id}.${editando}`] = deleteField();
            }
            guardar(cambios);
            setEditando(null);
          }}
        />
      )}
      {editando === 'datos' && (
        <EditorDatos
          c={c}
          onCancelar={() => setEditando(null)}
          onGuardar={(d) => { guardar(d); setEditando(null); }}
        />
      )}
      {editando === 'alumno' && (
        <EditorAlumno
          onCancelar={() => setEditando(null)}
          onGuardar={(nombre) => {
            guardar({ alumnos: [...alumnos, { id: nuevoId('a'), nombre }] });
            setEditando(null);
          }}
        />
      )}

      {ponderado && Math.abs(sumaPesos - 100) > 0.01 && (
        <p className="text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-3 mb-4">
          Los pesos suman {redondea(sumaPesos)} % y deberían sumar 100 %. La calificación se calcula
          igual —en proporción a los pesos que hay—, pero revisa que no falte ni sobre ninguno.
          {columnas.some((col) => !(col.peso > 0)) && ' Los criterios sin peso no cuentan en el total.'}
        </p>
      )}
      {avisoPegar && <Aviso>{avisoPegar}</Aviso>}

      {!columnas.length && (
        <div className={`${caja} p-6 mb-4 text-sm text-slate-400`}>
          Todavía no hay criterios. Toca <b className="text-cyan-300">+ Criterio</b> para agregar el
          primero (por ejemplo: Participación, Libreta, Examen) y su valor máximo.
        </div>
      )}

      {/* La tabla */}
      <div ref={tabla} className={`${caja} overflow-x-auto`}>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="sticky left-0 z-10 bg-[#0d1119] text-left px-3 py-3 text-xs font-mono-tech text-slate-500 font-normal min-w-[15rem]">
                Alumno
              </th>
              <th className="px-3 py-3 text-xs font-mono-tech text-cyan-400 font-normal min-w-[5.5rem]">Total</th>
              {columnas.map((col) => (
                <th key={col.id} className="px-1 py-2 font-normal align-bottom min-w-[6rem] max-w-[8rem]">
                  <button
                    onClick={() => setEditando(col.id)}
                    title="Cambiar o borrar este criterio"
                    className="w-full rounded-lg px-2 py-1 hover:bg-white/5 transition"
                  >
                    <span className="block text-[11px] font-semibold text-slate-200 uppercase leading-tight break-words">
                      {col.nombre}
                    </span>
                    <span className="block text-[10px] font-mono-tech text-slate-500 mt-0.5">
                      /{col.max}
                      {ponderado && (
                        <span className={col.peso > 0 ? ' text-cyan-300' : ' text-slate-600'}>
                          {' · '}{col.peso > 0 ? `${redondea(col.peso)} %` : 'sin peso'}
                        </span>
                      )}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {alumnos.map((a, fila) => {
              const t = totales[a.id];
              return (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="sticky left-0 z-10 bg-[#0d1119] px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono-tech text-slate-600 w-5 text-right shrink-0">{fila + 1}</span>
                      <span className="text-[13px] font-semibold text-white leading-tight">{a.nombre}</span>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center">
                    {t.calif === null ? (
                      <span className="text-slate-600">—</span>
                    ) : (
                      <>
                        <span className={`block text-base font-black ${colorTexto(t.calif / 10)}`}>{redondea(t.calif)}</span>
                        <span className="block text-[10px] font-mono-tech text-slate-500">
                          {ponderado ? `${redondea(t.calif * 10)} %` : `${redondea(t.puntos)}/${t.max}`}
                        </span>
                      </>
                    )}
                  </td>
                  {columnas.map((col, colIdx) => (
                    <td key={col.id} className="p-1 text-center">
                      <Celda
                        valor={notas[a.id]?.[col.id]}
                        max={col.max}
                        dataCelda={`${fila}-${colIdx}`}
                        onGuardar={(v) => ponerNota(a.id, col.id, v)}
                        onEnter={() => bajar(fila, colIdx)}
                        onPegarVarias={(renglones) => pegarColumna(fila, col, renglones)}
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {columnas.length > 0 && (
            <tfoot>
              <tr>
                <td className="sticky left-0 z-10 bg-[#0d1119] px-3 py-3 text-xs font-mono-tech text-slate-500">
                  Promedio del criterio
                </td>
                <td className="px-3 py-3 text-center text-xs font-mono-tech text-cyan-300">
                  {promedioGrupo === null ? '—' : redondea(promedioGrupo)}
                </td>
                {columnas.map((col) => (
                  <td key={col.id} className="px-1 py-3 text-center text-xs font-mono-tech text-slate-400">
                    {promediosColumna[col.id] === null ? '—' : redondea(promediosColumna[col.id])}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <p className="text-[11px] text-slate-600 leading-relaxed mt-4">
        Cada calificación se guarda sola al salir de la casilla. <b>Enter</b> baja al siguiente alumno;
        <b> Tab</b> pasa al siguiente criterio. Para pegar una columna entera copiada de Excel o iDoceo,
        pégala en la casilla del primer alumno.{' '}
        {ponderado
          ? 'El total es la media ponderada: cada criterio en porcentaje de su máximo, multiplicado por su peso, en escala de 10.'
          : 'El total es la suma de puntos sobre la suma de máximos, en escala de 10. Ponle peso a los criterios para ponderar como en iDoceo.'}{' '}
        {cuentanCero
          ? 'Las casillas vacías cuentan como cero.'
          : 'Las casillas vacías no cuentan todavía: marca "Vacías cuentan como 0" al cerrar el parcial.'}
      </p>
    </div>
  );
}

/**
 * La calificación de un alumno, en escala de 10.
 *
 * Sin pesos: suma de puntos sobre suma de máximos.
 * Con pesos (como iDoceo): Σ peso × (nota / máximo) ÷ Σ peso. Los criterios sin
 * peso no entran. Si un criterio está vacío y las vacías no cuentan, su peso se
 * reparte entre los que sí tienen nota, igual que hace iDoceo.
 */
function totalDe(notasAlumno = {}, columnas, cuentanCero) {
  const ponderado = columnas.some((col) => col.peso > 0);
  let puntos = 0, max = 0, acumulado = 0, pesos = 0;
  for (const col of columnas) {
    const v = notasAlumno[col.id];
    const hay = typeof v === 'number';
    if (!hay && !cuentanCero) continue;
    const nota = hay ? v : 0;
    puntos += nota; max += col.max;
    if (col.peso > 0) { acumulado += col.peso * (nota / col.max); pesos += col.peso; }
  }
  const calif = ponderado
    ? (pesos ? (acumulado / pesos) * 10 : null)
    : (max ? (puntos / max) * 10 : null);
  return { puntos, max, calif };
}

function redondea(n) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function colorTexto(fraccion) {
  if (fraccion >= 0.9) return 'text-emerald-300';
  if (fraccion < 0.6) return 'text-rose-300';
  return 'text-white';
}

/* ── casilla ─────────────────────────────────────────────────── */

function Celda({ valor, max, dataCelda, onGuardar, onEnter, onPegarVarias }) {
  const [texto, setTexto] = useState(valor ?? '');
  const [mal, setMal] = useState(false);
  const enfocada = useRef(false);

  // Si el valor cambia desde otro dispositivo, se refleja, salvo que se esté
  // escribiendo justo en esta casilla.
  useEffect(() => { if (!enfocada.current) setTexto(valor ?? ''); }, [valor]);

  const confirmar = () => {
    const limpio = String(texto).trim().replace(',', '.');
    if (limpio === '') {
      setMal(false);
      if (valor !== undefined) onGuardar(null);
      return;
    }
    const n = Number(limpio);
    if (!Number.isFinite(n) || n < 0 || n > max) {
      setMal(true);
      return;
    }
    setMal(false);
    if (n !== valor) onGuardar(n);
  };

  const fondo = typeof valor === 'number' && !mal
    ? valor / max >= 0.9 ? 'bg-emerald-500/20 text-emerald-200'
      : valor / max < 0.6 ? 'bg-rose-500/20 text-rose-200'
      : 'bg-white/[0.03] text-white'
    : 'bg-white/[0.03] text-white';

  return (
    <input
      type="text"
      inputMode="decimal"
      data-celda={dataCelda}
      value={texto}
      title={mal ? `Debe ser un número entre 0 y ${max}` : undefined}
      onFocus={(e) => { enfocada.current = true; e.target.select(); }}
      onChange={(e) => { setTexto(e.target.value); setMal(false); }}
      onPaste={(e) => {
        const txt = e.clipboardData.getData('text');
        // Se quita solo el último salto de línea, que Excel siempre agrega; los
        // renglones vacíos de en medio son alumnos sin nota y se respetan.
        const renglones = txt.replace(/\r/g, '').replace(/\n$/, '').split('\n')
          .map((r) => r.split('\t')[0]);
        if (renglones.length < 2) return; // un solo número: pegado normal
        e.preventDefault();
        enfocada.current = false;
        e.target.blur();
        onPegarVarias(renglones);
      }}
      onBlur={() => { enfocada.current = false; confirmar(); }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') { e.preventDefault(); confirmar(); onEnter(); }
        if (e.key === 'Escape') { setTexto(valor ?? ''); setMal(false); e.target.blur(); }
      }}
      className={`w-16 text-center rounded-lg py-2 text-sm font-semibold border focus:outline-none focus:border-cyan-400/60 transition ${fondo} ${
        mal ? 'border-rose-500 bg-rose-500/10 text-rose-300' : 'border-transparent'}`}
    />
  );
}

/* ── editores ────────────────────────────────────────────────── */

function EditorColumna({ columna, onGuardar, onCancelar, onBorrar }) {
  const [nombre, setNombre] = useState(columna?.nombre ?? '');
  const [max, setMax] = useState(columna?.max ?? 10);
  const [peso, setPeso] = useState(columna?.peso ?? '');
  const pesoTxt = String(peso).replace('%', '').replace(',', '.').trim();
  const pesoN = pesoTxt === '' ? 0 : Number(pesoTxt);
  const [seguro, setSeguro] = useState(false);
  const maxN = Number(String(max).replace(',', '.'));
  const valido = nombre.trim() && Number.isFinite(maxN) && maxN > 0
    && Number.isFinite(pesoN) && pesoN >= 0 && pesoN <= 100;

  return (
    <Panel titulo={columna ? 'Cambiar criterio' : 'Nuevo criterio'}>
      <form
        onSubmit={(e) => { e.preventDefault(); if (valido) onGuardar({ nombre: nombre.trim(), max: maxN, peso: pesoN }); }}
        className="flex flex-wrap items-end gap-3"
      >
        <Campo etiqueta="Nombre" className="flex-1 min-w-[12rem]">
          <input autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)}
                 placeholder="Ej. Participación" className={claseCampo} />
        </Campo>
        <Campo etiqueta="Vale" className="w-24">
          <input value={max} inputMode="decimal" onChange={(e) => setMax(e.target.value)} className={claseCampo} />
        </Campo>
        <Campo etiqueta="Peso %" className="w-24">
          <input value={peso} inputMode="decimal" placeholder="—" onChange={(e) => setPeso(e.target.value)} className={claseCampo} />
        </Campo>
        <button type="submit" disabled={!valido} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40">
          Guardar
        </button>
        <button type="button" onClick={onCancelar} className="text-sm text-slate-400 hover:text-white px-3 py-2.5">
          Cancelar
        </button>
        {onBorrar && (
          <button
            type="button"
            onClick={() => (seguro ? onBorrar() : setSeguro(true))}
            className={`ml-auto text-sm px-3 py-2.5 rounded-xl transition ${
              seguro ? 'bg-rose-500/20 text-rose-200 border border-rose-500/40' : 'text-rose-400 hover:text-rose-300'}`}
          >
            {seguro ? 'Sí, borrar criterio y sus notas' : 'Borrar criterio'}
          </button>
        )}
      </form>
      <p className="text-[11px] text-slate-500 mt-3">
        <b>Vale</b> es la nota más alta posible en este criterio (por ejemplo, 16 sellos de libreta).
        <b> Peso</b> es cuánto cuenta en la calificación del parcial; déjalo vacío si no ponderas.
        {columna && ' Si bajas el valor máximo, las notas que ya lo rebasen se quedan como están: revísalas.'}
      </p>
    </Panel>
  );
}

function EditorDatos({ c, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(c.titulo ?? '');
  const [grupo, setGrupo] = useState(c.grupo ?? '');
  return (
    <Panel titulo="Nombre del cuaderno">
      <form
        onSubmit={(e) => { e.preventDefault(); if (titulo.trim()) onGuardar({ titulo: titulo.trim(), grupo: grupo.trim() }); }}
        className="flex flex-wrap items-end gap-3"
      >
        <Campo etiqueta="Parcial" className="flex-1 min-w-[12rem]">
          <input autoFocus value={titulo} onChange={(e) => setTitulo(e.target.value)} className={claseCampo} />
        </Campo>
        <Campo etiqueta="Grupo" className="flex-1 min-w-[10rem]">
          <input value={grupo} onChange={(e) => setGrupo(e.target.value)} className={claseCampo} />
        </Campo>
        <button type="submit" disabled={!titulo.trim()} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40">
          Guardar
        </button>
        <button type="button" onClick={onCancelar} className="text-sm text-slate-400 hover:text-white px-3 py-2.5">
          Cancelar
        </button>
      </form>
    </Panel>
  );
}

function EditorAlumno({ onGuardar, onCancelar }) {
  const [nombre, setNombre] = useState('');
  return (
    <Panel titulo="Agregar alumno al final de la lista">
      <form
        onSubmit={(e) => { e.preventDefault(); if (nombre.trim()) onGuardar(limpiarNombre(nombre)); }}
        className="flex flex-wrap items-end gap-3"
      >
        <Campo etiqueta="Nombre completo (apellidos primero)" className="flex-1 min-w-[14rem]">
          <input autoFocus value={nombre} onChange={(e) => setNombre(e.target.value)} className={claseCampo} />
        </Campo>
        <button type="submit" disabled={!nombre.trim()} className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40">
          Agregar
        </button>
        <button type="button" onClick={onCancelar} className="text-sm text-slate-400 hover:text-white px-3 py-2.5">
          Cancelar
        </button>
      </form>
    </Panel>
  );
}

function NuevoCuaderno({ onCreado, onCancelar, puedeCancelar }) {
  const [titulo, setTitulo] = useState('');
  const [grupo, setGrupo] = useState('');
  const [lista, setLista] = useState('');
  const [msg, setMsg] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const nombres = lista.split('\n').map(limpiarNombre).filter(Boolean);

  const crear = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !nombres.length) return;
    setOcupado(true);
    setMsg('');
    try {
      const r = await addDoc(collection(db(), 'cuadernos'), {
        titulo: titulo.trim(),
        grupo: grupo.trim(),
        alumnos: nombres.map((nombre, i) => ({ id: `a${i + 1}`, nombre })),
        columnas: [],
        notas: {},
        vaciasCuentanCero: false,
        creado: serverTimestamp(),
        actualizado: serverTimestamp(),
      });
      onCreado(r.id);
    } catch (err) {
      setMsg(`No se pudo crear (${err?.code ?? err}).`);
      setOcupado(false);
    }
  };

  return (
    <Panel titulo="Nuevo cuaderno">
      <form onSubmit={crear} className="space-y-4">
        <div className="flex flex-wrap gap-3">
          <Campo etiqueta="Parcial" className="flex-1 min-w-[12rem]">
            <input autoFocus value={titulo} onChange={(e) => setTitulo(e.target.value)}
                   placeholder="Ej. Primer parcial" className={claseCampo} />
          </Campo>
          <Campo etiqueta="Grupo" className="flex-1 min-w-[10rem]">
            <input value={grupo} onChange={(e) => setGrupo(e.target.value)}
                   placeholder="Ej. 1º A Vespertino" className={claseCampo} />
          </Campo>
        </div>
        <Campo etiqueta={`Lista oficial · un alumno por renglón${nombres.length ? ` · ${nombres.length} alumnos` : ''}`}>
          <textarea value={lista} onChange={(e) => setLista(e.target.value)} rows={10}
                    placeholder={'ANDRADE VALENCIA NOHEMI\nCARRANZA GARCIA CAMILA…'}
                    className={`${claseCampo} font-mono-tech text-xs`} />
        </Campo>
        {msg && <Aviso>{msg}</Aviso>}
        <div className="flex gap-3">
          <button type="submit" disabled={ocupado || !titulo.trim() || !nombres.length}
                  className="btn-primary px-5 py-2.5 text-sm disabled:opacity-40">
            {ocupado ? 'Creando…' : 'Crear cuaderno'}
          </button>
          {puedeCancelar && (
            <button type="button" onClick={onCancelar} className="text-sm text-slate-400 hover:text-white px-3 py-2.5">
              Cancelar
            </button>
          )}
        </div>
      </form>
    </Panel>
  );
}

/** Quita los espacios de relleno que trae la lista al copiarla de Excel o del SIGEMS. */
function limpiarNombre(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

/* ── piezas ──────────────────────────────────────────────────── */

const claseCampo = 'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-cyan-400/50 transition';

function Panel({ titulo, children }) {
  return (
    <div className={`${caja} p-5 mb-4`}>
      <h2 className="text-xs font-mono-tech text-cyan-400 uppercase tracking-widest mb-4">{titulo}</h2>
      {children}
    </div>
  );
}

function Campo({ etiqueta, className = '', children }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-wider block mb-1.5">{etiqueta}</span>
      {children}
    </label>
  );
}

function BotonChico({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:text-cyan-300 hover:border-cyan-400/40 disabled:opacity-40 transition"
    >
      {children}
    </button>
  );
}

function Dato({ etiqueta, valor, alerta }) {
  return (
    <div className={`${caja} px-4 py-3`}>
      <span className="text-[10px] font-mono-tech text-slate-500 uppercase tracking-wider block">{etiqueta}</span>
      <span className={`text-2xl font-black ${alerta ? 'text-rose-300' : 'text-white'}`}>{valor}</span>
    </div>
  );
}

function Aviso({ children }) {
  return (
    <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 mb-4">
      {children}
    </p>
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

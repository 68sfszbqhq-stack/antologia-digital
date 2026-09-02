import React, { useState, useEffect, useRef, useCallback, useMemo, memo } from 'react';
import {
  COLUMNAS, RENGLONES, TOTAL, ANGULO, NOMBRE, TAMANOS,
  generarHoja, calcular, curvaPorMinuto,
  calificarS, calificarIA, calificarErrores,
} from '../lib/landolt-motor.js';

/* ────────────────────────────────────────────────────────────────
   Test de los Anillos de Landolt — atención concentrada.
   La interfaz. Toda la aritmética vive en ../lib/landolt-motor.js
   ──────────────────────────────────────────────────────────────── */

/* ── anillo ──────────────────────────────────────────────────── */
// Proporción Landolt 5:1 — diámetro externo 5 u, trazo y abertura 1 u.
// El hueco se logra con dasharray sobre la circunferencia media (r = 2).

const CIRC = 2 * Math.PI * 2; // 12.566

const Anillo = memo(function Anillo({ figura, marcado, estado, px, onClick }) {
  const color =
    estado === 'omision' ? 'var(--lan-alerta)'
    : estado === 'falso' ? 'var(--lan-alerta)'
    : marcado ? 'var(--lan-acento)'
    : 'var(--lan-tinta)';

  return (
    <svg
      width={px} height={px} viewBox="-3 -3 6 6"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default', display: 'block', flex: '0 0 auto' }}
    >
      <circle cx="0" cy="0" r="2.9" fill="transparent" />
      <circle
        cx="0" cy="0" r="2" fill="none"
        stroke={color} strokeWidth="1"
        strokeDasharray={`${CIRC - 1} 1`}
        transform={`rotate(${ANGULO[figura] + 14.32})`}
      />
      {marcado && (
        <line x1="0" y1="-3" x2="0" y2="3"
              stroke="var(--lan-acento)" strokeWidth="0.5" strokeLinecap="round" />
      )}
      {estado === 'omision' && (
        <circle cx="0" cy="0" r="2.85" fill="none"
                stroke="var(--lan-alerta)" strokeWidth="0.3" opacity="0.55" />
      )}
    </svg>
  );
});

const Renglon = memo(function Renglon({ figuras, base, marcas, revision, objetivo, px, onMarcar, acumulado }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {figuras.map((f, c) => {
        const i = base + c;
        const marcado = marcas.has(i);
        let estado = null;
        if (revision) {
          if (marcado && f !== objetivo) estado = 'falso';
          else if (!marcado && f === objetivo) estado = 'omision';
        }
        return (
          <Anillo key={i} figura={f} marcado={marcado} estado={estado} px={px}
                  onClick={onMarcar ? () => onMarcar(i) : undefined} />
        );
      })}
      <span style={{
        marginLeft: 10, minWidth: 40, textAlign: 'right',
        fontSize: 11, color: 'var(--lan-apagado)', fontVariantNumeric: 'tabular-nums',
      }}>{acumulado}</span>
    </div>
  );
});

/* ── curva minuto a minuto, SVG plano ────────────────────────── */

function Curva({ datos }) {
  const W = 520, H = 180, ML = 42, MB = 28, MT = 14, MR = 12;
  const max = Math.max(1.5, ...datos.map((d) => d.S)) * 1.15;
  const x = (i) => ML + (i * (W - ML - MR)) / Math.max(1, datos.length - 1);
  const y = (v) => MT + (H - MT - MB) * (1 - v / max);
  const linea = datos.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.S)}`).join(' ');

  const bandas = [
    { desde: 1.24, hasta: max, etiqueta: 'Muy bien' },
    { desde: 1.02, hasta: 1.24, etiqueta: 'Bien' },
    { desde: 0.84, hasta: 1.02, etiqueta: 'Regular' },
    { desde: 0, hasta: 0.84, etiqueta: 'Mal' },
  ];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto' }}>
      {bandas.map((b, k) => b.hasta > b.desde && (
        <g key={b.etiqueta}>
          <rect x={ML} y={y(b.hasta)} width={W - ML - MR} height={Math.max(0, y(b.desde) - y(b.hasta))}
                fill="var(--lan-tinta)" opacity={0.03 + k * 0.012} />
          <line x1={ML} x2={W - MR} y1={y(b.desde)} y2={y(b.desde)}
                stroke="var(--lan-borde)" strokeWidth="0.5" />
          <text x={ML - 6} y={y(b.desde) + 3} textAnchor="end"
                style={{ fontSize: 9, fill: 'var(--lan-apagado)', fontVariantNumeric: 'tabular-nums' }}>
            {b.desde.toFixed(2)}
          </text>
        </g>
      ))}
      <path d={linea} fill="none" stroke="var(--lan-acento)" strokeWidth="2"
            strokeLinejoin="round" strokeLinecap="round" />
      {datos.map((d, i) => (
        <g key={d.minuto}>
          <circle cx={x(i)} cy={y(d.S)} r="3.5" fill="var(--lan-hoja)"
                  stroke="var(--lan-acento)" strokeWidth="2" />
          <text x={x(i)} y={H - 9} textAnchor="middle"
                style={{ fontSize: 10, fill: 'var(--lan-apagado)' }}>{d.minuto}′</text>
        </g>
      ))}
    </svg>
  );
}

/* ── componente principal ────────────────────────────────────── */

/* `ajustes` fija la prueba desde fuera: figura, duración, semilla y tamaño.
 * Cuando viene, la pantalla de configuración NO se muestra y el alumno pasa
 * derecho a la instrucción. Es a propósito: la figura y sobre todo la semilla
 * las decide el profesor para todo el grupo, porque comparar entre personas
 * solo tiene sentido si todos recorrieron la misma hoja. Sin `ajustes` el
 * componente sigue siendo autónomo, que es como se prueba suelto. */
export default function TestAnillosLandolt({
  onFinalizar,
  evaluado: evaluadoInicial = '',
  ajustes = null,
}) {
  const [fase, setFase] = useState(ajustes ? 'listo' : 'config'); // config | listo | prueba | resultados
  const [evaluado, setEvaluado] = useState(evaluadoInicial);
  const [objetivo, setObjetivo] = useState(ajustes?.objetivo ?? 6);
  const [duracion, setDuracion] = useState(ajustes?.duracion ?? 300);
  const [semilla, setSemilla] = useState(ajustes?.semilla ?? 20260101);
  const [tamano, setTamano] = useState(ajustes?.tamano ?? 'medio');

  const [marcas, setMarcas] = useState(() => new Map());
  const [restante, setRestante] = useState(300);
  const [revision, setRevision] = useState(false);

  const inicioRef = useRef(null);
  const hoja = useMemo(() => generarHoja(semilla), [semilla]);
  const px = TAMANOS[tamano];

  /* cronómetro */
  useEffect(() => {
    if (fase !== 'prueba') return;
    inicioRef.current = Date.now();
    const id = setInterval(() => {
      const seg = Math.floor((Date.now() - inicioRef.current) / 1000);
      const falta = duracion - seg;
      setRestante(falta);
      if (falta <= 0) { clearInterval(id); setFase('resultados'); }
    }, 250);
    return () => clearInterval(id);
  }, [fase, duracion]);

  const marcar = useCallback((i) => {
    const seg = Math.floor((Date.now() - inicioRef.current) / 1000);
    setMarcas((prev) => {
      const sig = new Map(prev);
      if (sig.has(i)) sig.delete(i); else sig.set(i, seg);
      return sig;
    });
  }, []);

  const iniciar = () => {
    setMarcas(new Map());
    setRestante(duracion);
    setRevision(false);
    setFase('prueba');
  };

  const resultado = useMemo(() => {
    if (fase !== 'resultados') return null;
    const T = duracion;
    const r = calcular(hoja, objetivo, marcas, T);
    return { ...r, curva: curvaPorMinuto(hoja, objetivo, marcas, T) };
  }, [fase, hoja, objetivo, marcas, duracion]);

  useEffect(() => {
    if (resultado && onFinalizar) {
      onFinalizar({ evaluado, objetivo, semilla, fecha: new Date().toISOString(), ...resultado });
    }
  }, [resultado]); // eslint-disable-line react-hooks/exhaustive-deps

  const exportarCSV = () => {
    const r = resultado;
    const filas = [
      ['Test de los Anillos de Landolt'],
      ['Evaluado', evaluado || '(sin nombre)'],
      ['Fecha', new Date().toLocaleString('es-MX')],
      ['Figura objetivo', `${objetivo} (${NOMBRE[objetivo]})`],
      ['Semilla de hoja', semilla],
      [],
      ['N (anillos revisados)', r.N],
      ['CA (aciertos)', r.CA],
      ['CT (objetivos en el tramo)', r.CT],
      ['Falsos positivos', r.falsos],
      ['Omisiones', r.omisiones],
      ['n (errores totales)', r.n],
      ['T (segundos)', r.T],
      ['S (bit/seg)', r.S.toFixed(4)],
      ['Evaluación de S', calificarS(r.S)],
      [r.variante === '1min' ? 'IA — N/(n+1)' : 'IA (%)', r.IA.toFixed(2)],
      ['Evaluación de IA', r.variante === '1min' ? 'sin escala publicada' : calificarIA(r.IA)],
      ['Evaluación de errores', calificarErrores(r.n)],
      [],
      ['Minuto', 'N', 'n', 'CA', 'CT', 'S'],
      ...r.curva.map((c) => [c.minuto, c.N, c.n, c.CA, c.CT, c.S.toFixed(4)]),
    ];
    const csv = '\uFEFF' + filas.map((f) => f.join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `landolt_${(evaluado || 'evaluado').replace(/\s+/g, '_')}_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const mmss = (s) => `${Math.floor(Math.max(0, s) / 60)}:${String(Math.max(0, s) % 60).padStart(2, '0')}`;

  const renglones = useMemo(
    () => Array.from({ length: RENGLONES }, (_, r) => hoja.slice(r * COLUMNAS, (r + 1) * COLUMNAS)),
    [hoja]
  );

  return (
    <div style={estilos.raiz}>
      <style>{css}</style>

      {fase === 'config' && (
        <div style={estilos.panel}>
          <h2 style={estilos.titulo}>Test de los anillos de Landolt</h2>
          <p style={estilos.bajada}>
            Mide atención concentrada y velocidad de traslación de la información.
            Hoja de {TOTAL} anillos en {RENGLONES} renglones de {COLUMNAS}.
          </p>

          <div style={estilos.campos}>
            <label style={estilos.campo}>
              <span style={estilos.etiqueta}>Evaluado</span>
              <input style={estilos.input} value={evaluado}
                     onChange={(e) => setEvaluado(e.target.value)}
                     placeholder="Nombre o matrícula" />
            </label>

            <label style={estilos.campo}>
              <span style={estilos.etiqueta}>Figura a tachar</span>
              <select style={estilos.input} value={objetivo}
                      onChange={(e) => setObjetivo(+e.target.value)}>
                {Object.keys(ANGULO).map((k) => (
                  <option key={k} value={k}>{k} — abertura {NOMBRE[k]}</option>
                ))}
              </select>
            </label>

            <label style={estilos.campo}>
              <span style={estilos.etiqueta}>Duración</span>
              <select style={estilos.input} value={duracion}
                      onChange={(e) => setDuracion(+e.target.value)}>
                <option value={60}>1 minuto</option>
                <option value={180}>3 minutos</option>
                <option value={300}>5 minutos (protocolo)</option>
              </select>
            </label>

            <label style={estilos.campo}>
              <span style={estilos.etiqueta}>Tamaño del anillo</span>
              <select style={estilos.input} value={tamano}
                      onChange={(e) => setTamano(e.target.value)}>
                <option value="chico">Chico</option>
                <option value="medio">Medio</option>
                <option value="grande">Grande</option>
              </select>
            </label>

            <label style={estilos.campo}>
              <span style={estilos.etiqueta}>Semilla de hoja</span>
              <input style={estilos.input} type="number" value={semilla}
                     onChange={(e) => setSemilla(+e.target.value || 1)} />
            </label>
          </div>

          <p style={estilos.nota}>
            La semilla fija el orden de los anillos. Usa la misma para todo un grupo si
            vas a comparar entre personas; cámbiala entre aplicaciones a la misma persona
            para evitar que memorice la hoja.
          </p>

          <div style={estilos.muestra}>
            <span style={estilos.etiqueta}>Buscarás esta figura</span>
            <Anillo figura={objetivo} marcado={false} estado={null} px={46} />
          </div>

          <button style={estilos.botonPrincipal} onClick={iniciar}>Iniciar prueba</button>
        </div>
      )}

      {fase === 'listo' && (
        <div style={estilos.panel}>
          <h2 style={estilos.titulo}>Prepárate</h2>
          <p style={estilos.bajada}>
            Vas a marcar <strong>solo</strong> los anillos que tengan la abertura
            en esta posición. Empieza por el primer renglón y sigue en orden, de
            izquierda a derecha, como si leyeras.
          </p>

          <div style={estilos.muestra}>
            <span style={estilos.etiqueta}>Busca esta figura</span>
            <Anillo figura={objetivo} marcado={false} estado={null} px={46} />
            <span style={{ ...estilos.etiqueta, marginLeft: 'auto' }}>
              abertura {NOMBRE[objetivo]}
            </span>
          </div>

          <p style={estilos.nota}>
            Tienes {Math.round(duracion / 60)} minuto{duracion >= 120 ? 's' : ''}. El
            reloj empieza en cuanto le des al botón y no se detiene. Si te equivocas,
            vuelve a hacer clic en el anillo para desmarcarlo. No te regreses a revisar.
          </p>

          <button style={estilos.botonPrincipal} onClick={iniciar}>Empezar</button>
        </div>
      )}

      {fase === 'prueba' && (
        <>
          <div style={estilos.barra}>
            <div style={estilos.barraIzq}>
              <Anillo figura={objetivo} marcado={false} estado={null} px={26} />
              <span style={estilos.barraTexto}>Tacha esta figura, renglón por renglón</span>
            </div>
            <div style={estilos.reloj}>{mmss(restante)}</div>
          </div>
          <div style={estilos.progreso}>
            <div style={{ ...estilos.progresoRelleno, width: `${(1 - restante / duracion) * 100}%` }} />
          </div>

          <div style={estilos.hoja}>
            {renglones.map((figuras, r) => (
              <Renglon key={r} figuras={figuras} base={r * COLUMNAS} marcas={marcas}
                       revision={false} objetivo={objetivo} px={px}
                       onMarcar={marcar} acumulado={(r + 1) * COLUMNAS} />
            ))}
          </div>

          <div style={estilos.pie}>
            <button style={estilos.botonSecundario} onClick={() => setFase('resultados')}>
              Terminar antes
            </button>
          </div>
        </>
      )}

      {fase === 'resultados' && resultado && (
        <div style={estilos.panel}>
          <h2 style={estilos.titulo}>Resultados</h2>
          <p style={estilos.bajada}>
            {evaluado || 'Sin nombre'} · figura {objetivo} ({NOMBRE[objetivo]}) · {resultado.T} s
          </p>

          <div style={estilos.tarjetas}>
            <Metrica valor={resultado.S.toFixed(2)} unidad="bit/seg"
                     rotulo="Velocidad de traslación" juicio={calificarS(resultado.S)} destacada />
            <Metrica valor={resultado.IA.toFixed(1)}
                     unidad={resultado.variante === '1min' ? '' : '%'}
                     rotulo={resultado.variante === '1min'
                       ? 'Índice de atención — N/(n+1)'
                       : 'Índice de atención'}
                     juicio={resultado.variante === '1min'
                       ? 'sin escala publicada'
                       : calificarIA(resultado.IA)} />
            <Metrica valor={resultado.n} rotulo="Errores" juicio={calificarErrores(resultado.n)} />
          </div>

          <div style={estilos.detalle}>
            {[
              ['N — anillos revisados', resultado.N],
              ['CA — aciertos', resultado.CA],
              ['CT — objetivos en el tramo', resultado.CT],
              ['Falsos positivos', resultado.falsos],
              ['Omisiones', resultado.omisiones],
            ].map(([k, v]) => (
              <div key={k} style={estilos.filaDetalle}>
                <span>{k}</span><b style={{ fontVariantNumeric: 'tabular-nums' }}>{v}</b>
              </div>
            ))}
          </div>

          {resultado.curva.length > 1 && (
            <div style={estilos.bloque}>
              <h3 style={estilos.subtitulo}>Curva minuto a minuto</h3>
              <p style={estilos.nota}>
                La caída entre el primer y el último minuto es el indicador de fatiga
                atencional. Una curva plana vale más que un pico alto seguido de desplome.
              </p>
              <Curva datos={resultado.curva} />
            </div>
          )}

          <div style={estilos.acciones}>
            <button style={estilos.botonPrincipal} onClick={exportarCSV}>Descargar CSV</button>
            <button style={estilos.botonSecundario} onClick={() => setRevision((v) => !v)}>
              {revision ? 'Ocultar hoja' : 'Revisar hoja'}
            </button>
            <button style={estilos.botonSecundario} onClick={() => setFase('config')}>
              Nueva aplicación
            </button>
          </div>

          {revision && (
            <>
              <div style={estilos.leyenda}>
                <Chip color="var(--lan-acento)" texto="Marcado" />
                <Chip color="var(--lan-alerta)" texto="Omitido o mal marcado" />
              </div>
              <div style={estilos.hoja}>
                {renglones.map((figuras, r) => (
                  <Renglon key={r} figuras={figuras} base={r * COLUMNAS} marcas={marcas}
                           revision objetivo={objetivo} px={px}
                           onMarcar={null} acumulado={(r + 1) * COLUMNAS} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function Metrica({ valor, unidad, rotulo, juicio, destacada }) {
  return (
    <div style={{ ...estilos.tarjeta, ...(destacada ? estilos.tarjetaDestacada : {}) }}>
      <div style={estilos.tarjetaValor}>
        {valor}{unidad && <span style={estilos.tarjetaUnidad}>{unidad}</span>}
      </div>
      <div style={estilos.tarjetaRotulo}>{rotulo}</div>
      <div style={estilos.tarjetaJuicio}>{juicio}</div>
    </div>
  );
}

function Chip({ color, texto }) {
  return (
    <span style={estilos.chip}>
      <span style={{ width: 9, height: 9, borderRadius: 9, background: color, display: 'inline-block' }} />
      {texto}
    </span>
  );
}

/* ── estilos ─────────────────────────────────────────────────── */

const css = `
:root{
  --lan-fondo:#EDEFF2; --lan-hoja:#FFFFFF; --lan-tinta:#14181F;
  --lan-acento:#1F6F6B; --lan-alerta:#A8622A;
  --lan-apagado:#6B7480; --lan-borde:#D6DAE0;
}
.lan-raiz *{box-sizing:border-box}
.lan-raiz button:focus-visible,.lan-raiz input:focus-visible,.lan-raiz select:focus-visible{
  outline:2px solid var(--lan-acento); outline-offset:2px;
}
@media (prefers-reduced-motion:reduce){ .lan-raiz *{transition:none!important} }
`;

const estilos = {
  raiz: {
    background: 'var(--lan-fondo)', color: 'var(--lan-tinta)', padding: 20,
    fontFamily: 'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
    minHeight: '100%',
  },
  panel: { maxWidth: 760, margin: '0 auto' },
  titulo: { fontSize: 26, fontWeight: 620, letterSpacing: '-0.015em', margin: '0 0 6px' },
  subtitulo: { fontSize: 16, fontWeight: 600, margin: '0 0 6px' },
  bajada: { color: 'var(--lan-apagado)', fontSize: 14, lineHeight: 1.5, margin: '0 0 22px' },
  nota: { color: 'var(--lan-apagado)', fontSize: 13, lineHeight: 1.55, margin: '10px 0 0', maxWidth: '68ch' },

  campos: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14 },
  campo: { display: 'flex', flexDirection: 'column', gap: 6 },
  etiqueta: { fontSize: 12, color: 'var(--lan-apagado)', fontWeight: 500 },
  input: {
    padding: '9px 11px', border: '1px solid var(--lan-borde)', borderRadius: 6,
    background: 'var(--lan-hoja)', fontSize: 14, color: 'var(--lan-tinta)', width: '100%',
  },

  muestra: {
    display: 'flex', alignItems: 'center', gap: 14, margin: '22px 0',
    padding: '14px 18px', background: 'var(--lan-hoja)',
    border: '1px solid var(--lan-borde)', borderRadius: 8,
  },

  botonPrincipal: {
    padding: '11px 22px', border: 'none', borderRadius: 6, cursor: 'pointer',
    background: 'var(--lan-acento)', color: '#fff', fontSize: 15, fontWeight: 550,
  },
  botonSecundario: {
    padding: '11px 18px', borderRadius: 6, cursor: 'pointer',
    background: 'var(--lan-hoja)', border: '1px solid var(--lan-borde)',
    color: 'var(--lan-tinta)', fontSize: 14,
  },

  barra: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '10px 14px', background: 'var(--lan-hoja)',
    border: '1px solid var(--lan-borde)', borderRadius: 8, marginBottom: 8,
    position: 'sticky', top: 0, zIndex: 5,
  },
  barraIzq: { display: 'flex', alignItems: 'center', gap: 10 },
  barraTexto: { fontSize: 13, color: 'var(--lan-apagado)' },
  reloj: { fontSize: 22, fontWeight: 600, fontVariantNumeric: 'tabular-nums' },
  progreso: { height: 3, background: 'var(--lan-borde)', borderRadius: 3, marginBottom: 14 },
  progresoRelleno: { height: '100%', background: 'var(--lan-acento)', borderRadius: 3 },

  hoja: {
    background: 'var(--lan-hoja)', border: '1px solid var(--lan-borde)', borderRadius: 8,
    padding: '16px 14px', overflowX: 'auto', display: 'flex',
    flexDirection: 'column', gap: 2, marginTop: 12,
  },
  pie: { display: 'flex', justifyContent: 'center', marginTop: 16 },

  tarjetas: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12 },
  tarjeta: {
    background: 'var(--lan-hoja)', border: '1px solid var(--lan-borde)',
    borderRadius: 8, padding: '16px 18px',
  },
  tarjetaDestacada: { borderColor: 'var(--lan-acento)', borderWidth: 2 },
  tarjetaValor: { fontSize: 32, fontWeight: 600, fontVariantNumeric: 'tabular-nums', lineHeight: 1.1 },
  tarjetaUnidad: { fontSize: 13, fontWeight: 400, color: 'var(--lan-apagado)', marginLeft: 5 },
  tarjetaRotulo: { fontSize: 13, color: 'var(--lan-apagado)', marginTop: 4 },
  tarjetaJuicio: { fontSize: 14, fontWeight: 550, marginTop: 8, color: 'var(--lan-acento)' },

  detalle: {
    background: 'var(--lan-hoja)', border: '1px solid var(--lan-borde)',
    borderRadius: 8, padding: '6px 18px', marginTop: 14,
  },
  filaDetalle: {
    display: 'flex', justifyContent: 'space-between', padding: '9px 0',
    fontSize: 14, borderBottom: '1px solid var(--lan-fondo)',
  },

  bloque: {
    background: 'var(--lan-hoja)', border: '1px solid var(--lan-borde)',
    borderRadius: 8, padding: 18, marginTop: 14,
  },
  acciones: { display: 'flex', gap: 10, marginTop: 18, flexWrap: 'wrap' },
  leyenda: { display: 'flex', gap: 16, marginTop: 16, fontSize: 13, color: 'var(--lan-apagado)' },
  chip: { display: 'inline-flex', alignItems: 'center', gap: 7 },
};

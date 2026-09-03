import React from 'react';

/* Las gráficas del panel, dibujadas a mano.
 *
 * SIN LIBRERÍA DE GRÁFICAS, a propósito. Media clase entra desde teléfonos de
 * gama baja, y ya hubo que rescatar el sitio una vez porque un paquete pesado
 * (pdf.js) dejaba la página en blanco en esos aparatos. Meter ahora una
 * librería de gráficas de varios cientos de kilobytes sería repetir el error.
 * Todo esto son <div> con un ancho en porcentaje: pesa nada y se ve igual.
 *
 * LA PALETA NO ES DECORATIVA. Está tomada de una paleta validada para daltonismo
 * y comprobada contra la superficie real de estas tarjetas (#0d1019): las cuatro
 * ranuras pasan banda de luminosidad, croma, separación CVD y contraste ≥ 3:1.
 * Los tonos neón del sitio (#00f5ff) se ven bien pero no pasan esas pruebas, así
 * que aquí no se usan para codificar datos: se quedan para los acentos de la
 * interfaz.
 *
 * Reglas que se respetan en todo el archivo:
 *   · Una barra siempre lleva su valor escrito. El color nunca es el único
 *     canal, y el número no depende de pasar el dedo encima.
 *   · Rejilla y ejes en un tono apenas por encima del fondo; nunca punteados.
 *   · Hueco de 2 px entre segmentos apilados, no un borde alrededor.
 *   · Nada de gráficas de pastel para comparar valores cercanos.
 */

// Paleta categórica validada (modo oscuro, superficie #0d1019).
export const SERIE = ['#3987e5', '#d95926', '#199e70', '#c98500'];
/** Un solo tono cuando la gráfica mide magnitud y no identidad. */
export const MAGNITUD = '#3987e5';

const TINTA = 'text-slate-200';
const TENUE = 'text-slate-500';

/* ── barras horizontales ─────────────────────────────────────── */

/**
 * `filas` = [{ etiqueta, valor, texto?, color?, nota? }]
 *
 * Horizontal y no vertical porque las etiquetas son nombres de materias y de
 * grupos: en vertical habría que girarlas y dejan de leerse.
 */
export function Barras({ titulo, nota, filas, max, sufijo = '', color = MAGNITUD }) {
  if (!filas?.length) return null;
  const tope = max ?? Math.max(...filas.map((f) => f.valor), 1);

  return (
    <figure className="m-0">
      {titulo && (
        <figcaption className="mb-1">
          <span className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest">
            {titulo}
          </span>
        </figcaption>
      )}
      {nota && <p className="text-xs text-slate-600 mb-3">{nota}</p>}

      <div className="space-y-2.5">
        {filas.map((f, i) => {
          const ancho = tope ? Math.max(0, Math.min(100, (f.valor / tope) * 100)) : 0;
          return (
            <div key={f.etiqueta + i}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className={`text-xs ${TINTA} truncate`}>{f.etiqueta}</span>
                <span className={`text-xs font-mono-tech ${TENUE} shrink-0 tabular-nums`}>
                  {f.texto ?? `${f.valor}${sufijo}`}
                </span>
              </div>
              {/* El riel es la rejilla: un tono apenas por encima del fondo. */}
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: '#2c2c2a' }}
                title={`${f.etiqueta}: ${f.texto ?? f.valor + sufijo}${f.nota ? ` · ${f.nota}` : ''}`}
              >
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${ancho}%`,
                    background: f.color ?? color,
                    borderRadius: '9999px',
                  }}
                />
              </div>
              {f.nota && <p className="text-[11px] text-slate-600 mt-1">{f.nota}</p>}
            </div>
          );
        })}
      </div>
    </figure>
  );
}

/* ── barras apiladas ─────────────────────────────────────────── */

/**
 * Para partes de un todo: entregados contra los que van a medias.
 * `filas` = [{ etiqueta, partes: [n, n], total }]
 */
export function BarrasApiladas({ titulo, nota, filas, series }) {
  if (!filas?.length) return null;

  return (
    <figure className="m-0">
      {titulo && (
        <figcaption className="mb-1">
          <span className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest">
            {titulo}
          </span>
        </figcaption>
      )}
      {nota && <p className="text-xs text-slate-600 mb-3">{nota}</p>}

      {/* Con dos series o más la leyenda va siempre: el color no puede ser el
          único canal que distingue una parte de la otra. */}
      <Leyenda series={series} />

      <div className="space-y-2.5 mt-3">
        {filas.map((f) => {
          const total = f.total || f.partes.reduce((a, b) => a + b, 0) || 1;
          return (
            <div key={f.etiqueta}>
              <div className="flex items-baseline justify-between gap-3 mb-1">
                <span className={`text-xs ${TINTA} truncate`}>{f.etiqueta}</span>
                <span className={`text-xs font-mono-tech ${TENUE} shrink-0 tabular-nums`}>
                  {f.partes[0]} de {total}
                </span>
              </div>
              {/* `gap` de 2 px: los segmentos se separan con un hueco del fondo,
                  no con un borde alrededor de cada uno. */}
              <div className="flex h-2 rounded-full overflow-hidden" style={{ background: '#2c2c2a', gap: 2 }}>
                {f.partes.map((v, i) =>
                  v > 0 ? (
                    <div
                      key={i}
                      title={`${f.etiqueta} · ${series[i].nombre}: ${v}`}
                      style={{
                        width: `${(v / total) * 100}%`,
                        background: series[i].color,
                        borderRadius: '9999px',
                      }}
                    />
                  ) : null,
                )}
              </div>
            </div>
          );
        })}
      </div>
    </figure>
  );
}

export function Leyenda({ series }) {
  if (!series?.length) return null;
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {series.map((s) => (
        <span key={s.nombre} className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
          <span className="text-[11px] font-mono-tech text-slate-400">{s.nombre}</span>
        </span>
      ))}
    </div>
  );
}

/* ── histograma ──────────────────────────────────────────────── */

/**
 * Reparto de una medida en tramos. Es la gráfica que contesta la pregunta que
 * el promedio esconde: si el grupo salió parejo o si hay dos grupos dentro del
 * grupo. Un promedio de 60 puede ser todos en 60, o mitad en 30 y mitad en 90,
 * y eso cambia por completo qué hacer en clase.
 */
export function Histograma({ titulo, nota, valores, tramos = 10, min = 0, max = 100, sufijo = '%' }) {
  const v = (valores ?? []).filter((x) => typeof x === 'number' && Number.isFinite(x));
  if (!v.length) return null;

  const paso = (max - min) / tramos;
  const cubetas = Array.from({ length: tramos }, (_, i) => ({
    desde: min + i * paso,
    hasta: min + (i + 1) * paso,
    n: 0,
  }));
  for (const x of v) {
    let i = Math.floor((x - min) / paso);
    if (i < 0) i = 0;
    if (i >= tramos) i = tramos - 1; // el tope entra en el último tramo
    cubetas[i].n++;
  }
  const tope = Math.max(...cubetas.map((c) => c.n), 1);

  return (
    <figure className="m-0">
      {titulo && (
        <figcaption className="mb-1">
          <span className="text-[11px] font-mono-tech text-slate-500 uppercase tracking-widest">
            {titulo}
          </span>
        </figcaption>
      )}
      {nota && <p className="text-xs text-slate-600 mb-3">{nota}</p>}

      <div className="flex items-end gap-1 h-28" style={{ borderBottom: '1px solid #383835' }}>
        {cubetas.map((c, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full"
               title={`${Math.round(c.desde)}–${Math.round(c.hasta)}${sufijo}: ${c.n} alumno(s)`}>
            {c.n > 0 && (
              <span className="text-[10px] font-mono-tech text-slate-500 mb-1 tabular-nums">{c.n}</span>
            )}
            <div
              className="w-full transition-all duration-700"
              style={{
                height: `${(c.n / tope) * 100}%`,
                minHeight: c.n > 0 ? 3 : 0,
                background: MAGNITUD,
                borderRadius: '4px 4px 0 0',
              }}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-1.5">
        {cubetas.map((c, i) => (
          <span key={i} className="flex-1 text-center text-[9px] font-mono-tech text-slate-600 tabular-nums">
            {Math.round(c.desde)}
          </span>
        ))}
      </div>
      <p className="text-[11px] text-slate-600 mt-2">
        {v.length} alumno(s) · cada barra es cuántos cayeron en ese tramo
      </p>
    </figure>
  );
}

/* ── número destacado ────────────────────────────────────────── */

/* Cuando la historia es UN número, un número es mejor gráfica que una barra
 * sola. Sin `tabular-nums`: a este tamaño los dígitos de ancho fijo se ven
 * sueltos. */
export function Destacado({ valor, rotulo, nota, tono = 'text-white' }) {
  return (
    <div className="rounded-xl bg-white/[0.03] border border-white/10 p-4">
      <div className={`text-3xl font-black ${tono}`}>{valor}</div>
      <div className="text-[11px] text-slate-500 font-mono-tech uppercase tracking-wide mt-1">
        {rotulo}
      </div>
      {nota && <div className="text-[11px] text-slate-600 mt-1.5 leading-snug">{nota}</div>}
    </div>
  );
}

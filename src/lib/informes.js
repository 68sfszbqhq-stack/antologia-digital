// Los dos informes que se bajan del panel de coordinación:
//
//   · PDF de retroalimentación: una hoja (o más) por alumno con lo mismo que él
//     ve en pantalla, más lo que solo le toca ver al profesor (banderas y
//     recomendaciones de trabajo).
//   · Markdown del grupo: las características del grupo en texto, para dárselo a
//     la IA de planeación de clase.
//
// El Markdown es ANÓNIMO a propósito: va a salir de esta computadora hacia un
// servicio de IA, y son datos de menores de edad. A la planeación le sirve saber
// que "5 de 28 no tienen internet en casa", no quiénes son.
//
// jsPDF se importa solo al pulsar el botón: pesa lo suyo y quien entra al panel
// a ver números no tiene por qué descargarlo.

import { GRADOS } from './diagnostico-materias.js';
import { retroalimentacion } from './diagnostico-materias.js';
import { TEMPERAMENTOS } from './temperamento.js';
import { SUBESCALAS, NIVELES } from './diagnostico-inicial.js';
import { AREAS as AREAS_CHASIDE } from './chaside.js';
import {
  normalizarGrupo, claveGrupo, entregados, resumenAcademico, reactivosMasFallados,
  resumenAtencion, resumenTemperamento, resumenPerfil, resumenVocacional, redondear, promedio,
} from './estadisticas.js';

const alumnos = (n) => `${n} ${n === 1 ? 'alumno' : 'alumnos'}`;
const gradoNombre = (id) => GRADOS.find((g) => g.id === id)?.nombre ?? id ?? '';
const hoy = () => new Date().toISOString().slice(0, 10);
const cuando = (t) => (t?.toDate ? t.toDate().toLocaleDateString('es-MX') : '');

function bajar(blob, nombre) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

const limpio = (s) => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase();

/* ── PDF de retroalimentación ─────────────────────────────────── */

/**
 * `alumnos` es una lista de { r, perfil, vocacional }: `r` es el documento del
 * diagnóstico y los otros dos, los de las secciones aparte (pueden faltar).
 */
export async function pdfRetroalimentacion(alumnos, nombreArchivo) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({ unit: 'mm', format: 'letter' });
  const M = 18;                                   // margen
  const ANCHO = pdf.internal.pageSize.getWidth() - M * 2;
  const ALTO = pdf.internal.pageSize.getHeight();
  let y = M;

  const espacio = (mm) => { if (y + mm > ALTO - M) { pdf.addPage(); y = M; } };

  // Escribe un párrafo con salto de línea y de página automáticos.
  const texto = (t, { tam = 10, negrita = false, color = [40, 40, 40], sangria = 0, despues = 1.5 } = {}) => {
    pdf.setFont('helvetica', negrita ? 'bold' : 'normal');
    pdf.setFontSize(tam);
    pdf.setTextColor(...color);
    const alto = tam * 0.42;
    for (const linea of pdf.splitTextToSize(String(t), ANCHO - sangria)) {
      espacio(alto);
      pdf.text(linea, M + sangria, y + alto * 0.8);
      y += alto;
    }
    y += despues;
  };

  const titulo = (t) => {
    espacio(14);
    y += 3;
    texto(t, { tam: 12, negrita: true, color: [14, 116, 144], despues: 0.5 });
    pdf.setDrawColor(200, 220, 225);
    pdf.line(M, y, M + ANCHO, y);
    y += 3;
  };

  const GRIS = [110, 110, 110];
  const ROJO = [185, 50, 70];
  const VERDE = [20, 120, 70];

  alumnos.forEach(({ r, perfil, vocacional }, i) => {
    if (i > 0) { pdf.addPage(); y = M; }

    texto('Retroalimentación de la evaluación diagnóstica', { tam: 9, color: GRIS, despues: 1 });
    texto(r.nombre ?? 'Sin nombre', { tam: 17, negrita: true, color: [20, 20, 20], despues: 1 });
    texto(
      [gradoNombre(r.grado), r.grupo && `Grupo ${normalizarGrupo(r.grupo)}`, r.turno,
        r.entregado && `Entregó el ${cuando(r.entregado)}`].filter(Boolean).join('  ·  '),
      { tam: 9.5, color: GRIS, despues: 2 },
    );

    if (r.estado !== 'entregado') {
      texto('Este alumno todavía no termina el diagnóstico: lo que sigue es solo lo que lleva contestado.',
        { tam: 9.5, color: ROJO });
    }

    // Evaluación por materias (2º y 3º)
    if (r.academica) {
      const fb = retroalimentacion(r.academica);
      titulo(`Evaluación diagnóstica: ${r.academica.aciertos} de ${r.academica.total} (${r.academica.porcentaje}%)`);
      if (fb.fuerte) {
        texto(`Materia más fuerte: ${fb.fuerte.nombre} (${fb.fuerte.pct}%). Donde más conviene poner atención al empezar: ${fb.debil.nombre} (${fb.debil.pct}%).`);
      }
      for (const m of fb.materias) {
        y += 1;
        texto(`${m.nombre}: ${m.ok}/${m.total} (${m.pct}%) · ${m.nivel.nombre}`, { negrita: true, despues: 0.5 });
        texto(m.nivel.mensaje, { tam: 9.5, sangria: 3 });
        m.fallos.forEach((f, k) => {
          texto(`${k + 1}. ${f.texto}`, { tam: 9, sangria: 6, despues: 0.3 });
          texto(`Su respuesta: ${f.tuya ?? 'sin contestar'}`, { tam: 8.5, sangria: 10, color: ROJO, despues: 0.3 });
          texto(`Correcta: ${f.correcta}`, { tam: 8.5, sangria: 10, color: VERDE, despues: 1.2 });
        });
      }
    }

    // Cuadernillo (1º): sin clave no hay calificación
    if (r.cuadernillo) {
      titulo(`Cuadernillo de ingreso: ${r.cuadernillo.contestadas} de ${r.cuadernillo.total} contestadas`);
      texto('El cuadernillo no se califica en la plataforma mientras no haya clave oficial de respuestas.', { tam: 9.5, color: GRIS });
    }

    // Cómo estudia
    if (perfil?.estado === 'entregado') {
      titulo('Cómo y en qué condiciones estudia');
      for (const s of SUBESCALAS) {
        const v = perfil.puntajes?.[s.id];
        if (!v || v.porcentaje === null) continue;
        texto(`${s.nombre}: ${v.porcentaje}% · ${NIVELES[v.nivel]?.nombre ?? ''}. ${NIVELES[v.nivel]?.nota ?? ''}`, { tam: 9.5, despues: 0.8 });
      }
      if ((perfil.banderas ?? []).length) {
        y += 1;
        texto('Situaciones a tomar en cuenta:', { tam: 9.5, negrita: true, despues: 0.5 });
        for (const b of perfil.banderas) {
          texto(`${b.color === 'roja' ? '[Roja]' : '[Amarilla]'} ${b.motivo}`, { tam: 9, sangria: 3, color: b.color === 'roja' ? ROJO : [150, 100, 0], despues: 0.5 });
        }
      }
      if ((perfil.recomendaciones ?? []).length) {
        y += 1;
        texto('Recomendaciones para el docente:', { tam: 9.5, negrita: true, despues: 0.5 });
        for (const rec of perfil.recomendaciones) texto(`- ${rec}`, { tam: 9, sangria: 3, despues: 0.8 });
      }
    }

    // Temperamento
    if (r.temperamento) {
      const t = TEMPERAMENTOS[r.temperamento.dominante];
      titulo(`Temperamento: ${t?.nombre ?? ''}${r.temperamento.empatado ? ' (sin dominante claro)' : ''}`);
      if (t) {
        texto(t.lema, { tam: 9.5, negrita: true, despues: 0.8 });
        texto(`Cómo aprende: ${t.aprende}`, { tam: 9.5, despues: 0.8 });
        texto(`Qué cuidar: ${t.cuidado}`, { tam: 9.5 });
      }
    }

    // Atención
    if (r.atencion) {
      const a = r.atencion;
      titulo('Atención concentrada');
      texto(`Revisados: ${a.N} · Aciertos: ${a.CA} · Errores: ${a.n} · Índice: ${Number(a.IA).toFixed(2)}`, { tam: 9.5 });
      texto('Se interpreta comparando con el resto del grupo, no por sí solo.', { tam: 8.5, color: GRIS });
    }

    // Vocacional (3º)
    if (vocacional?.estado === 'entregado') {
      titulo('Orientación vocacional');
      const nombres = (vocacional.dominantes ?? []).map((id) => AREAS_CHASIDE.find((a) => a.id === id)?.nombre ?? id);
      texto(`Áreas dominantes: ${nombres.join(' y ')}.`, { tam: 9.5 });
      if (vocacional.empateEnSegundo) texto('Empató en el segundo lugar: esa segunda área no es concluyente.', { tam: 8.5, color: GRIS });
    }
  });

  // Pie con número de página en todas las hojas.
  const paginas = pdf.getNumberOfPages();
  for (let p = 1; p <= paginas; p++) {
    pdf.setPage(p);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(150, 150, 150);
    pdf.text(`Documento confidencial: datos de menores de edad · Página ${p} de ${paginas}`, M, ALTO - 8);
  }

  bajar(pdf.output('blob'), nombreArchivo ?? `retroalimentacion-${hoy()}.pdf`);
}

/** Nombre de archivo para el PDF de un solo alumno. */
export const archivoAlumno = (r) => `retroalimentacion-${limpio(r.nombre) || 'alumno'}.pdf`;

/* ── Markdown del grupo, para la IA de planeación ─────────────── */

// Cómo aprende cada temperamento, en tercera persona y para un grupo.
const APRENDE = {
  sanguineo: 'aprenden mejor hablando, en equipo y con actividades que cambian seguido; las exposiciones largas los apagan',
  colerico: 'aprenden con retos, metas claras y competencia sana; necesitan saber para qué sirve lo que estudian',
  melancolico: 'aprenden leyendo, escribiendo y con tiempo para procesar; rinden más solos o en parejas que en equipos grandes',
  flematico: 'aprenden con rutina, instrucciones claras y sin prisas; les favorece el trabajo constante',
};

function seccionGrupo(rs, perfiles, vocacionales) {
  const listos = entregados(rs);
  const correos = new Set(rs.map((r) => r.correo).filter(Boolean));
  const pf = perfiles.filter((p) => correos.has(p.correo));
  const vo = vocacionales.filter((v) => correos.has(v.correo));
  const grado = rs[0]?.grado;
  const grupo = normalizarGrupo(rs[0]?.grupo) || 'sin grupo';
  const turnos = [...new Set(rs.map((r) => r.turno).filter(Boolean))].join(' y ');
  const L = [];
  const implicaciones = [];

  L.push(`## ${gradoNombre(grado)}, grupo ${grupo}${turnos ? ` (${turnos})` : ''}`);
  L.push('');
  L.push(`- Presentaron el diagnóstico completo: **${listos.length} de ${rs.length}** alumnos registrados.`);
  const generos = [['Mujer', 'mujer', 'mujeres'], ['Hombre', 'hombre', 'hombres']].map(([g, uno, varios]) => {
    const n = listos.filter((r) => r.genero === g).length;
    return `${n} ${n === 1 ? uno : varios}`;
  });
  L.push(`- Composición: ${generos.join(', ')}.`);
  L.push('');

  // Conocimientos previos
  const ac = resumenAcademico(listos, grado);
  if (ac) {
    L.push('### Conocimientos previos (evaluación diagnóstica)');
    L.push('');
    L.push(`Promedio general: **${ac.porcentaje}%** (mediana ${ac.mediana}%). ${ac.reprobados} de ${alumnos(ac.n)} quedaron por debajo del 60%.`);
    L.push('');
    L.push('| Materia | Promedio del grupo |');
    L.push('|---|---|');
    for (const m of ac.materias) L.push(`| ${m.nombre} | ${m.porcentaje ?? '-'}% |`);
    L.push('');
    const fallados = reactivosMasFallados(listos, grado, 8).filter((p) => p.porcentaje < 60);
    if (fallados.length) {
      L.push('Temas que el grupo menos domina (reactivos con menor porcentaje de acierto):');
      L.push('');
      for (const p of fallados) L.push(`- ${p.materia}: "${p.texto}" (${p.porcentaje}% de acierto)`);
      L.push('');
    }
    const baja = ac.materias[0];
    if (baja?.porcentaje != null) {
      implicaciones.push(`Reforzar al inicio los conocimientos previos de ${baja.nombre} (${baja.porcentaje}% de promedio), empezando por los temas con menor acierto.`);
    }
  }

  if (listos.some((r) => r.cuadernillo)) {
    const con = listos.filter((r) => r.cuadernillo);
    L.push('### Cuadernillo de ingreso');
    L.push('');
    L.push(`${alumnos(con.length)} lo entregaron; contestaron en promedio ${redondear(promedio(con.map((r) => Number(r.cuadernillo.contestadas))), 1)} de ${con[0].cuadernillo.total} reactivos. Todavía no se califica: no hay clave oficial.`);
    L.push('');
  }

  // Temperamento
  const tm = resumenTemperamento(listos);
  if (tm) {
    L.push('### Temperamento y estilo de trabajo');
    L.push('');
    for (const f of tm.filas.filter((x) => x.cuantos)) {
      L.push(`- **${f.nombre}**: ${alumnos(f.cuantos)} (${f.porcentaje}%). ${APRENDE[f.id][0].toUpperCase()}${APRENDE[f.id].slice(1)}.`);
    }
    L.push('');
    const [top, segundo] = tm.filas;
    // Solo se dice que "predomina" si de verdad hay uno arriba de los demás.
    if (top?.cuantos && top.cuantos > (segundo?.cuantos ?? 0)) implicaciones.push(`Predomina el temperamento ${top.nombre.toLowerCase()}: ${APRENDE[top.id]}.`);
  }

  // Atención
  const at = resumenAtencion(listos);
  if (at) {
    L.push('### Atención concentrada (test de anillos de Landolt)');
    L.push('');
    L.push(`Índice de atención promedio: ${redondear(at.indice.media, 2)} (desviación ${redondear(at.indice.de, 2)}). Errores promedio: ${redondear(at.errores.media, 1)}. Sirve para comparar grupos y alumnos entre sí, no como calificación.`);
    L.push('');
  }

  // Hábitos y condiciones
  const pr = resumenPerfil(pf, SUBESCALAS);
  if (pr) {
    L.push('### Hábitos y condiciones de estudio');
    L.push('');
    L.push(`Contestado por ${alumnos(pr.n)}.`);
    L.push('');
    L.push('| Área | Nivel bajo | Medio | Alto |');
    L.push('|---|---|---|---|');
    for (const s of pr.subescalas) L.push(`| ${s.nombre} | ${s.niveles.bajo} (${s.pctBajo}%) | ${s.niveles.medio} | ${s.niveles.alto} |`);
    L.push('');
    if (pr.banderas.length) {
      L.push('Situaciones del grupo a tomar en cuenta:');
      L.push('');
      for (const b of pr.banderas) L.push(`- ${b.motivo}: ${alumnos(b.cuantas)} (${b.porcentaje}%)`);
      L.push('');
    }
    if (pr.seguimiento.length) {
      L.push(`${alumnos(pr.seguimiento.length)} con dos o más situaciones de riesgo (seguimiento individual).`);
      L.push('');
    }
    const peor = pr.subescalas[0];
    if (peor?.pctBajo >= 25) implicaciones.push(`${peor.pctBajo}% del grupo sale bajo en ${peor.nombre.toLowerCase()}: incluir en las secuencias estrategias explícitas para trabajarlo.`);
    const digital = pr.banderas.filter((b) => /internet|computadora|datos/i.test(b.motivo));
    if (digital.length) implicaciones.push('Hay alumnos sin recursos digitales en casa: que las actividades con tecnología se puedan terminar en clase o tengan alternativa impresa.');
    if (pr.banderas.some((b) => /trabaja/i.test(b.motivo))) implicaciones.push('Hay alumnos que trabajan: conviene dar tiempos flexibles para las tareas fuera de clase.');
  }

  // Vocacional
  const vc = resumenVocacional(vo, AREAS_CHASIDE);
  if (vc) {
    L.push('### Intereses vocacionales (CHASIDE)');
    L.push('');
    for (const a of vc.areas.filter((x) => x.dominante).slice(0, 4)) {
      L.push(`- ${a.nombre}: dominante en ${alumnos(a.dominante)} (${a.porcentaje}%)`);
    }
    L.push('');
    const top = vc.areas[0];
    if (top?.dominante) implicaciones.push(`Los intereses del grupo se inclinan hacia ${top.nombre.toLowerCase()}: usar ejemplos y proyectos de esa área para dar sentido a los contenidos.`);
  }

  if (implicaciones.length) {
    L.push('### Implicaciones para la planeación');
    L.push('');
    for (const i of implicaciones) L.push(`- ${i}`);
    L.push('');
  }

  return L.join('\n');
}

export function markdownGrupos({ registros, perfiles = [], vocacionales = [] }) {
  const grupos = new Map();
  for (const r of registros) {
    const k = claveGrupo(r);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(r);
  }
  // Un grupo donde nadie terminó no dice nada sobre el grupo.
  const claves = [...grupos.keys()]
    .filter((k) => entregados(grupos.get(k)).length > 0)
    .sort((a, b) => a.localeCompare(b, 'es'));

  const partes = [
    '# Características de los grupos (evaluación diagnóstica de inicio de ciclo)',
    '',
    `Generado el ${hoy()} desde el panel de coordinación de la Antología Digital.`,
    '',
    '> Contexto para la IA de planeación: estos son datos agregados y anónimos del diagnóstico de inicio de ciclo. Úsalos para ajustar la planeación didáctica a las características reales del grupo (conocimientos previos, estilos de trabajo, hábitos y condiciones de estudio). No son calificaciones.',
    '',
    ...claves.map((k) => seccionGrupo(grupos.get(k), perfiles, vocacionales)),
  ];
  return partes.join('\n');
}

export function descargarMarkdownGrupos(datos) {
  const md = markdownGrupos(datos);
  const grupos = new Set(datos.registros.map((r) => claveGrupo(r)));
  const sufijo = grupos.size === 1 ? limpio([...grupos][0]) : 'todos';
  bajar(new Blob([md], { type: 'text/markdown;charset=utf-8' }), `caracteristicas-grupo-${sufijo}-${hoy()}.md`);
}

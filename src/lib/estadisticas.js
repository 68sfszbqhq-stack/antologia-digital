// Las cuentas del panel de coordinación, aparte de la pantalla que las muestra.
//
// Están separadas por dos razones prácticas: se pueden probar sin abrir un
// navegador, y el día que Supervisión pida el dato de otra forma se cambia aquí
// sin tocar la interfaz.
//
// TODO LO QUE SALE DE AQUÍ SE VA A UN OFICIO. Por eso ninguna función inventa
// datos para rellenar: lo que no se contestó no cuenta como cero, cuenta como
// que no está. Un promedio calculado sobre alumnos que no presentaron es un
// número falso, y en un informe a Supervisión eso no se puede sostener.

import { MATERIAS } from './diagnostico-materias.js';
import { TEMPERAMENTOS, ORDEN } from './temperamento.js';
import { SECCIONES as SECCIONES_CUADERNILLO } from './cuadernillo-ediems.js';

/**
 * Deja el grupo en una forma comparable.
 *
 * Hace falta porque el alumno lo escribe a mano y llega de todas las formas
 * imaginables: "A", "a", "1", "1-A", "1 A", '"A"', "A.". Sin esto, el mismo
 * grupo aparece como seis grupos distintos y cualquier conteo por grupo queda
 * mal. Se conserva SIEMPRE el texto original al lado, porque para corregir un
 * dato hay que poder ver qué escribió la persona.
 */
export function normalizarGrupo(bruto) {
  const limpio = String(bruto ?? '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ''); // fuera comillas, puntos, espacios y guiones
  return limpio || '(sin grupo)';
}

/** La etiqueta con la que se agrupa en los informes: grado + grupo. */
export function claveGrupo(r) {
  return `${r.grado ?? '?'}·${normalizarGrupo(r.grupo)}`;
}

// ─── Números básicos ─────────────────────────────────────────────────────────

export function promedio(xs) {
  const v = xs.filter((x) => typeof x === 'number' && Number.isFinite(x));
  if (!v.length) return null;
  return v.reduce((a, b) => a + b, 0) / v.length;
}

export function mediana(xs) {
  const v = xs.filter((x) => typeof x === 'number' && Number.isFinite(x)).sort((a, b) => a - b);
  if (!v.length) return null;
  const m = Math.floor(v.length / 2);
  return v.length % 2 ? v[m] : (v[m - 1] + v[m]) / 2;
}

/** Desviación estándar de la muestra. Supervisión suele pedirla junto al promedio. */
export function desviacion(xs) {
  const v = xs.filter((x) => typeof x === 'number' && Number.isFinite(x));
  if (v.length < 2) return null;
  const m = promedio(v);
  return Math.sqrt(v.reduce((s, x) => s + (x - m) ** 2, 0) / (v.length - 1));
}

export function redondear(x, d = 1) {
  if (x === null || x === undefined || !Number.isFinite(x)) return null;
  const f = 10 ** d;
  return Math.round(x * f) / f;
}

// ─── Cortes de la población ──────────────────────────────────────────────────

/** Cuántos hay de cada valor de un campo, ordenado de mayor a menor. */
export function conteo(registros, sacar) {
  const m = new Map();
  for (const r of registros) {
    const k = sacar(r);
    if (k === null || k === undefined || k === '') continue;
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  return [...m.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0]), 'es'));
}

export function entregados(registros) {
  return registros.filter((r) => r.estado === 'entregado');
}

export function aMedias(registros) {
  return registros.filter((r) => r.estado !== 'entregado');
}

// ─── Atención (Anillos de Landolt) ───────────────────────────────────────────

/**
 * Resumen del test de atención. Solo entra quien tiene el bloque: si a alguien
 * no se le aplicó, no puede contar como un cero.
 */
export function resumenAtencion(registros) {
  const con = registros.filter((r) => r.atencion);
  if (!con.length) return null;
  const campo = (k) => con.map((r) => Number(r.atencion[k]));
  return {
    n: con.length,
    revisados: { media: promedio(campo('N')), mediana: mediana(campo('N')), de: desviacion(campo('N')) },
    aciertos: { media: promedio(campo('CA')), mediana: mediana(campo('CA')), de: desviacion(campo('CA')) },
    errores: { media: promedio(campo('n')), mediana: mediana(campo('n')), de: desviacion(campo('n')) },
    indice: { media: promedio(campo('IA')), mediana: mediana(campo('IA')), de: desviacion(campo('IA')) },
    ritmo: { media: promedio(campo('S')), mediana: mediana(campo('S')), de: desviacion(campo('S')) },
  };
}

// ─── Temperamento ────────────────────────────────────────────────────────────

/** Cuántos alumnos de cada temperamento dominante, con su porcentaje. */
export function resumenTemperamento(registros) {
  const con = registros.filter((r) => r.temperamento?.dominante);
  if (!con.length) return null;
  const filas = ORDEN.map((t) => {
    const cuantos = con.filter((r) => r.temperamento.dominante === t).length;
    return {
      id: t,
      nombre: TEMPERAMENTOS[t].nombre,
      cuantos,
      porcentaje: Math.round((cuantos / con.length) * 100),
      // El promedio del puntaje bruto de ese rasgo en TODO el grupo, no solo en
      // quienes lo tienen como dominante: dice qué tanto pesa el rasgo en general.
      puntajeMedio: redondear(promedio(con.map((r) => Number(r.temperamento.puntos?.[t]))), 1),
    };
  }).sort((a, b) => b.cuantos - a.cuantos);
  return {
    n: con.length,
    filas,
    sinDominanteClaro: con.filter((r) => r.temperamento.empatado).length,
  };
}

// ─── Evaluación de 2º y 3º ───────────────────────────────────────────────────

/** Promedio general y por materia, para un grado. */
export function resumenAcademico(registros, grado) {
  const con = registros.filter((r) => r.academica && r.grado === grado);
  if (!con.length) return null;

  const materias = (MATERIAS[grado] ?? []).map((m) => {
    const pares = con
      .map((r) => r.academica.materias?.[m.id])
      .filter((x) => x && typeof x.ok === 'number' && x.total > 0);
    const pcts = pares.map((x) => (x.ok / x.total) * 100);
    return {
      id: m.id,
      nombre: m.nombre,
      reactivos: m.preguntas.length,
      n: pares.length,
      porcentaje: redondear(promedio(pcts), 1),
      de: redondear(desviacion(pcts), 1),
    };
  }).sort((a, b) => (a.porcentaje ?? 999) - (b.porcentaje ?? 999)); // la más baja primero

  const generales = con.map((r) => Number(r.academica.porcentaje));
  return {
    grado,
    n: con.length,
    porcentaje: redondear(promedio(generales), 1),
    mediana: redondear(mediana(generales), 1),
    de: redondear(desviacion(generales), 1),
    // Cuántos por debajo del 60 %, que es el corte con el que se suele reportar.
    reprobados: generales.filter((x) => x < 60).length,
    materias,
  };
}

/**
 * Qué reactivos falló más el grupo. Es lo más accionable de todo el informe:
 * dice exactamente qué hay que volver a enseñar.
 */
export function reactivosMasFallados(registros, grado, cuantos = 10) {
  const con = registros.filter((r) => r.academica && r.grado === grado);
  if (!con.length) return [];

  const filas = [];
  for (const m of MATERIAS[grado] ?? []) {
    for (const p of m.preguntas) {
      let respondieron = 0;
      let aciertos = 0;
      for (const r of con) {
        const dada = r.academica.respuestas?.[p.id];
        if (dada === undefined) continue;
        respondieron++;
        if (dada === p.correcta) aciertos++;
      }
      if (!respondieron) continue;
      filas.push({
        id: p.id,
        materia: m.nombre,
        texto: p.texto,
        respondieron,
        aciertos,
        porcentaje: Math.round((aciertos / respondieron) * 100),
      });
    }
  }
  return filas.sort((a, b) => a.porcentaje - b.porcentaje).slice(0, cuantos);
}

// ─── Cuadernillo de 1º ───────────────────────────────────────────────────────

/**
 * Resumen del cuadernillo de ingreso.
 *
 * `clave` es opcional: mientras no exista la clave oficial de respuestas, esto
 * solo puede decir cuántas contestó cada quien, no cuántas acertó. Se reporta
 * así y no se disfraza de calificación.
 */
export function resumenCuadernillo(registros, clave = null) {
  const con = registros.filter((r) => r.cuadernillo);
  if (!con.length) return null;

  const total = con[0].cuadernillo.total ?? 88;
  const contestadas = con.map((r) => Number(r.cuadernillo.contestadas));

  const secciones = SECCIONES_CUADERNILLO.map((s) => {
    const deLaSeccion = con.map((r) => {
      let c = 0;
      let ok = 0;
      for (let n = s.desde; n <= s.hasta; n++) {
        const dada = r.cuadernillo.respuestas?.[n];
        if (dada === undefined) continue;
        c++;
        if (clave && clave[n] && String(dada).toUpperCase() === clave[n]) ok++;
      }
      return { c, ok };
    });
    const reactivos = s.hasta - s.desde + 1;
    return {
      id: s.id,
      nombre: s.nombre,
      reactivos,
      contestadas: redondear(promedio(deLaSeccion.map((x) => x.c)), 1),
      porcentaje: clave
        ? redondear(promedio(deLaSeccion.map((x) => (x.ok / reactivos) * 100)), 1)
        : null,
    };
  });

  let calificacion = null;
  if (clave) {
    const pcts = con.map((r) => {
      let ok = 0;
      let calificadas = 0;
      for (let n = 1; n <= total; n++) {
        if (!clave[n]) continue;
        calificadas++;
        if (String(r.cuadernillo.respuestas?.[n] ?? '').toUpperCase() === clave[n]) ok++;
      }
      return calificadas ? (ok / calificadas) * 100 : null;
    }).filter((x) => x !== null);
    calificacion = {
      porcentaje: redondear(promedio(pcts), 1),
      mediana: redondear(mediana(pcts), 1),
      de: redondear(desviacion(pcts), 1),
      reprobados: pcts.filter((x) => x < 60).length,
    };
  }

  return {
    n: con.length,
    total,
    contestadas: {
      media: redondear(promedio(contestadas), 1),
      mediana: mediana(contestadas),
      completas: contestadas.filter((x) => x === total).length,
    },
    secciones,
    calificacion,
  };
}

/** Lee una clave de respuestas desde el texto de un CSV "pregunta,respuesta". */
export function leerClave(texto) {
  const clave = {};
  for (const linea of String(texto).split(/\r?\n/)) {
    const m = /^\s*"?(\d{1,3})"?\s*[,;\t]\s*"?([A-Da-d])"?\s*$/.exec(linea);
    if (m) clave[Number(m[1])] = m[2].toUpperCase();
  }
  return Object.keys(clave).length ? clave : null;
}

// ─── Por grupo, que es como lo pide Supervisión ──────────────────────────────

/**
 * Una fila por grupo, con lo que se reporta: cuántos presentaron, cuántos
 * faltan y los promedios de cada bloque.
 */
export function porGrupo(registros) {
  const grupos = new Map();
  for (const r of registros) {
    const k = claveGrupo(r);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(r);
  }

  return [...grupos.entries()]
    .map(([clave, rs]) => {
      const listos = entregados(rs);
      const conAcad = listos.filter((r) => r.academica);
      const conCua = listos.filter((r) => r.cuadernillo);
      const [grado, grupo] = clave.split('·');
      return {
        clave, grado, grupo,
        alumnos: rs.length,
        entregados: listos.length,
        aMedias: rs.length - listos.length,
        atencionIA: redondear(promedio(listos.filter((r) => r.atencion).map((r) => Number(r.atencion.IA))), 2),
        academico: redondear(promedio(conAcad.map((r) => Number(r.academica.porcentaje))), 1),
        cuadernilloContestadas: redondear(promedio(conCua.map((r) => Number(r.cuadernillo.contestadas))), 1),
        // Los nombres tal como los escribieron, para poder corregir el dato.
        gruposEscritos: [...new Set(rs.map((r) => r.grupo))].filter(Boolean),
      };
    })
    .sort((a, b) => a.grado.localeCompare(b.grado) || a.grupo.localeCompare(b.grupo, 'es'));
}

// ─── Perfil socioemocional y condiciones de estudio ──────────────────────────

/**
 * Reparto por nivel de cada subescala, y quién necesita seguimiento.
 *
 * Lo que se reporta a Supervisión no es el promedio de la subescala —un
 * promedio "medio" puede esconder a diez alumnos en nivel bajo—, sino CUÁNTOS
 * caen en cada nivel. Eso sí se puede convertir en una acción.
 */
export function resumenPerfil(perfiles, SUBESCALAS) {
  const listos = perfiles.filter((p) => p.estado === 'entregado');
  if (!listos.length) return null;

  const subescalas = SUBESCALAS.map((s) => {
    const niveles = { bajo: 0, medio: 0, alto: 0 };
    const pcts = [];
    for (const p of listos) {
      const v = p.puntajes?.[s.id];
      if (!v || v.nivel === null || v.nivel === undefined) continue;
      niveles[v.nivel]++;
      if (typeof v.porcentaje === 'number') pcts.push(v.porcentaje);
    }
    const n = niveles.bajo + niveles.medio + niveles.alto;
    return {
      id: s.id,
      nombre: s.nombre,
      n,
      niveles,
      // El porcentaje de alumnos en nivel bajo es el número accionable: dice a
      // cuántos hay que atender, no qué tan bien está "el grupo" en abstracto.
      pctBajo: n ? Math.round((niveles.bajo / n) * 100) : 0,
      promedio: redondear(promedio(pcts), 1),
    };
  }).sort((a, b) => b.pctBajo - a.pctBajo); // lo más urgente arriba

  // Cuántas veces se levantó cada bandera en todo el grupo.
  const motivos = new Map();
  for (const p of listos) {
    for (const b of p.banderas ?? []) {
      const k = `${b.color}|${b.motivo}`;
      motivos.set(k, (motivos.get(k) ?? 0) + 1);
    }
  }
  const banderas = [...motivos.entries()]
    .map(([k, cuantas]) => {
      const [color, motivo] = k.split('|');
      return { color, motivo, cuantas, porcentaje: Math.round((cuantas / listos.length) * 100) };
    })
    .sort((a, b) => b.cuantas - a.cuantas);

  // Dos o más banderas rojas: es el corte que pide el documento para priorizar
  // seguimiento. Se ordena por cuántas tiene, no alfabéticamente.
  const seguimiento = listos
    .filter((p) => (p.rojas ?? 0) >= 2)
    .map((p) => ({
      nombre: p.nombre, correo: p.correo, grado: p.grado,
      grupo: normalizarGrupo(p.grupo),
      rojas: p.rojas ?? 0,
      motivos: (p.banderas ?? []).filter((b) => b.color === 'roja').map((b) => b.motivo),
      bajas: Object.entries(p.puntajes ?? {})
        .filter(([, v]) => v?.nivel === 'bajo')
        .map(([, v]) => v.nombre),
    }))
    .sort((a, b) => b.rojas - a.rojas || String(a.nombre).localeCompare(String(b.nombre), 'es'));

  return { n: listos.length, aMedias: perfiles.length - listos.length, subescalas, banderas, seguimiento };
}

// ─── Vocacional (CHASIDE) ────────────────────────────────────────────────────

/** Hacia dónde apunta el grupo, y quiénes quedaron sin un perfil claro. */
export function resumenVocacional(registros, AREAS) {
  const listos = registros.filter((r) => r.estado === 'entregado');
  if (!listos.length) return null;

  const areas = AREAS.map((a) => {
    const dominante = listos.filter((r) => (r.dominantes ?? []).includes(a.id)).length;
    const totales = listos.map((r) => Number(r.puntajes?.[a.id]?.total)).filter(Number.isFinite);
    return {
      id: a.id,
      nombre: a.nombre,
      dominante,
      // Cada alumno aporta DOS áreas dominantes, así que el porcentaje se toma
      // sobre los alumnos, no sobre el total de menciones: dice "en cuántos
      // alumnos aparece esta área", que es lo que se quiere saber.
      porcentaje: Math.round((dominante / listos.length) * 100),
      puntajeMedio: redondear(promedio(totales), 1),
      max: 14,
    };
  }).sort((a, b) => b.dominante - a.dominante);

  return {
    n: listos.length,
    aMedias: registros.length - listos.length,
    areas,
    // Un empate en el segundo lugar hace que la segunda área dominante sea
    // arbitraria. Estos alumnos necesitan una charla, no un dictamen.
    empatados: listos.filter((r) => r.empateEnSegundo).map((r) => ({
      nombre: r.nombre, correo: r.correo, grupo: normalizarGrupo(r.grupo),
      dominantes: r.dominantes ?? [],
    })),
  };
}

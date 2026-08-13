// Arma el CSV que iDoceo importa como columnas de evaluación.
//
// Formato, según la documentación de iDoceo: la primera fila son encabezados, y
// una columna cuyo nombre empieza con "!" se trata como dato personal del
// alumno en vez de como calificación. Todo lo demás entra al cuaderno de notas.
//
//   !Alumno,!Matrícula,Diagnóstico 1.1,Diagnóstico 1.2
//   Pérez López Juan,2024001,8,9
//
// En iDoceo:  Herramientas → Clase → Importar CSV/XLS → Importación guiada.

export interface FilaAlumno {
  nombre: string;
  matricula: string;
  /** Aciertos por módulo. Si falta la clave, es que no lo contestó. */
  puntajes: Record<number, number>;
}

function campo(v: string | number): string {
  const s = String(v ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/**
 * @param alumnos  filas ya ordenadas como se quieran ver
 * @param modulos  qué módulos incluir, en orden (p. ej. [1,2,3])
 * @param etiqueta cómo nombrar la columna de cada módulo
 */
export function csvParaIdoceo(
  alumnos: FilaAlumno[],
  modulos: number[],
  etiqueta: (dia: number) => string,
): string {
  const encabezado = ["!Alumno", "!Matrícula", ...modulos.map(etiqueta)];

  const filas = alumnos.map((a) => [
    a.nombre,
    a.matricula,
    // Ojo: quien no contestó queda VACÍO, no en cero. Un cero dice "lo hizo y
    // falló todo"; el vacío dice "no lo entregó". No son lo mismo y en el acta
    // se pagan distinto.
    ...modulos.map((d) => (a.puntajes[d] === undefined ? "" : a.puntajes[d])),
  ]);

  return [encabezado, ...filas].map((f) => f.map(campo).join(",")).join("\r\n") + "\r\n";
}

/** Dispara la descarga del archivo en el navegador. */
export function descargarCSV(nombreArchivo: string, contenido: string) {
  // El BOM hace que Excel y Numbers abran los acentos bien.
  const blob = new Blob(["﻿" + contenido], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

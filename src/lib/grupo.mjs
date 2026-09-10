// Cómo se escribe un grupo, en un solo lugar.
//
// Lo usan el sitio (para copiar los datos del diagnóstico a la ficha del
// alumno) y scripts/sincronizar-alumnos.mjs (para lo mismo, pero de golpe y
// desde la Mac). Es .mjs, no .ts, justamente para que ambos puedan importarlo.

/**
 * Arma el grupo como lo va a ver el profesor en la tabla: "1º A Vesp".
 *
 * Los alumnos escribieron su grupo a mano en el diagnóstico y salió de todo:
 * "A", "1", "1-A", "1A", '"A"', "A.". Todos querían decir lo mismo. Se toma la
 * primera letra que aparezca y se deja ir el resto; si no hay ninguna, se asume
 * A, que es lo que hay en el plantel.
 */
export function armarGrupo({ grado, grupo, turno } = {}) {
  const g = { "1ero": "1º", "2do": "2º", "3ero": "3º" }[grado] ?? "?";
  const letra = (String(grupo ?? "").match(/[A-Za-z]/)?.[0] ?? "A").toUpperCase();
  const t = String(turno ?? "").toLowerCase().startsWith("mat") ? "Mat" : "Vesp";
  return `${g} ${letra} ${t}`;
}

/** "  pérez   lópez  juan " → "pérez lópez juan", sin dobles espacios. */
export function limpiarNombre(n) {
  return String(n ?? "").trim().replace(/\s+/g, " ").slice(0, 80);
}

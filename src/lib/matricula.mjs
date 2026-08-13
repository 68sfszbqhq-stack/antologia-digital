// Convierte una matrícula en el correo interno con el que Firebase la reconoce.
//
// El alumno solo escribe su matrícula; nunca ve ni teclea un correo. Por debajo
// se arma "<matricula>@antologia.local" para poder usar Firebase Authentication
// de verdad, en lugar de validar el código dentro de la página (que sería
// trivial de saltar abriendo las herramientas del navegador).
//
// En JavaScript puro y no en TypeScript a propósito: lo usan tanto el sitio
// como los scripts de alta que corren en Node. Un solo lugar, una sola regla.

export const DOMINIO_INTERNO = "antologia.local";

/**
 * Deja la matrícula en una forma estable: sin espacios, sin acentos, sin
 * guiones y en minúsculas. Así "2024-001", " 2024001 " y "2024001" son el mismo
 * alumno, y nadie queda fuera por haber tecleado un guion de más.
 * @param {string} matricula
 * @returns {string}
 */
export function normalizarMatricula(matricula) {
  return String(matricula ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * @param {string} matricula
 * @returns {string} el correo interno, p. ej. "2024001@antologia.local"
 */
export function correoDeMatricula(matricula) {
  return `${normalizarMatricula(matricula)}@${DOMINIO_INTERNO}`;
}

/**
 * @param {string} correo
 * @returns {string} la matrícula de vuelta, para mostrarla en el panel
 */
export function matriculaDeCorreo(correo) {
  return String(correo ?? "").split("@")[0] ?? "";
}

/**
 * Deja el código en su forma canónica: mayúsculas, sin espacios ni guiones.
 *
 * Se aplica en los dos extremos —al generarlo y al teclearlo—, así que un
 * alumno que escriba "k7m2-p9rt" entra igual que quien escriba "K7M2P9RT". El
 * código sigue siendo la contraseña real ante Firebase; lo único que se pierde
 * es la distinción entre mayúsculas y minúsculas, a cambio de no perder media
 * clase resolviendo "no me deja entrar".
 * @param {string} codigo
 * @returns {string}
 */
export function normalizarCodigo(codigo) {
  return String(codigo ?? "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
}

/**
 * El alfabeto de los códigos. Sin 0/O ni 1/I/L: son las confusiones que
 * garantizan llamadas de "mi código no sirve" cuando alguien lee un papel.
 */
export const ALFABETO_CODIGO = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

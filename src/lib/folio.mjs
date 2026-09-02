// Convierte un folio de familia en el correo interno con el que Firebase lo
// reconoce. Mismo truco que matricula.mjs, y por la misma razón: el padre solo
// teclea el folio, pero por debajo hay una cuenta de Firebase Authentication de
// verdad, en vez de una comprobación dentro de la página que cualquiera podría
// saltarse abriendo las herramientas del navegador.
//
// El folio es a la vez el nombre de usuario y la contraseña. Suena raro, pero es
// exactamente lo mismo que un enlace secreto: lo que protege es que sea largo y
// aleatorio, no que haya dos campos. A cambio, el padre escribe una sola cosa
// desde el celular, que es donde se va a contestar esto.
//
// En JavaScript puro y no en TypeScript a propósito: lo usan tanto el sitio como
// los scripts que corren en Node.

import { normalizarCodigo, ALFABETO_CODIGO } from "./matricula.mjs";

export const DOMINIO_FOLIO = "expediente.local";

/** Diez caracteres. Con el alfabeto sin letras confundibles son unas 8×10^14
 *  combinaciones: no se adivina probando. */
export const LARGO_FOLIO = 10;

/**
 * Deja el folio en su forma canónica: mayúsculas, sin espacios ni guiones.
 * Se aplica al generarlo y al teclearlo, así que "k7m2-p9rt xy" entra igual
 * que "K7M2P9RTXY".
 * @param {string} folio
 * @returns {string}
 */
export function normalizarFolio(folio) {
  return normalizarCodigo(folio);
}

/**
 * @param {string} folio
 * @returns {string} el correo interno, p. ej. "K7M2P9RTXY@expediente.local"
 */
export function correoDeFolio(folio) {
  return `${normalizarFolio(folio)}@${DOMINIO_FOLIO}`;
}

/** ¿Tiene la forma de un folio? No dice si existe, solo si vale la pena
 *  molestar a Firebase preguntando. */
export function folioBienFormado(folio) {
  const f = normalizarFolio(folio);
  return f.length === LARGO_FOLIO && [...f].every((c) => ALFABETO_CODIGO.includes(c));
}

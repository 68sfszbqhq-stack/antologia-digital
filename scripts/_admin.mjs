// Piezas compartidas por los scripts de administración.
//
// Estos scripts corren en la Mac de José, NUNCA en el navegador. Usan el Admin
// SDK, que pasa por encima de firestore.rules: por eso necesitan
// serviceAccountKey.json y por eso ese archivo jamás debe subirse a GitHub.

import { readFileSync, existsSync } from "node:fs";
import { randomInt } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { ALFABETO_CODIGO, correoDeMatricula } from "../src/lib/matricula.mjs";

export const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const LLAVE = join(RAIZ, "serviceAccountKey.json");

/** Arranca el Admin SDK, o explica con claridad qué falta. */
export function conectar() {
  if (!existsSync(LLAVE)) {
    console.error(`
✗ No encuentro serviceAccountKey.json

  Descárgalo así:
    Consola de Firebase → ⚙️ Configuración del proyecto
    → Cuentas de servicio → "Generar nueva clave privada"

  Guárdalo como:
    ${LLAVE}

  Ese archivo es una llave maestra de tu base de datos. Ya está en .gitignore,
  así que no se sube a GitHub. No lo mandes por correo ni por WhatsApp.
`);
    process.exit(1);
  }

  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(readFileSync(LLAVE, "utf8"))) });
  }
  return { auth: getAuth(), db: getFirestore() };
}

/**
 * Un código de 8 caracteres, legible en papel y aleatorio de verdad
 * (randomInt del módulo crypto, no Math.random).
 */
export function generarCodigo(largo = 8) {
  let out = "";
  for (let i = 0; i < largo; i++) {
    out += ALFABETO_CODIGO[randomInt(ALFABETO_CODIGO.length)];
  }
  return out;
}

/**
 * Lee un CSV respetando las comillas, porque los nombres traen comas:
 * "Pérez López, Juan" tiene que llegar entero.
 */
export function leerCSV(ruta) {
  const texto = readFileSync(ruta, "utf8").replace(/^﻿/, "");
  const filas = [];
  let campo = "";
  let fila = [];
  let enComillas = false;

  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (enComillas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') enComillas = false;
      else campo += c;
    } else if (c === '"') enComillas = true;
    else if (c === ",") { fila.push(campo); campo = ""; }
    else if (c === "\n") { fila.push(campo); filas.push(fila); fila = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  if (campo || fila.length) { fila.push(campo); filas.push(fila); }

  const noVacias = filas.filter((f) => f.some((c) => c.trim() !== ""));
  if (!noVacias.length) return [];

  const encabezados = noVacias[0].map((h) => h.trim().toLowerCase());
  return noVacias.slice(1).map((f) =>
    Object.fromEntries(encabezados.map((h, i) => [h, (f[i] ?? "").trim()])),
  );
}

/** Escapa un campo para escribirlo en un CSV. */
export function campoCSV(v) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export { correoDeMatricula };

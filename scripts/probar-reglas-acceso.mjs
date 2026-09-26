#!/usr/bin/env node
//
// Prueba las reglas de acceso a los módulos SIN tocar la base de datos y SIN
// necesitar el emulador (que pide Java).
//
// Manda firestore.rules a la API de Firebase Rules junto con una lista de
// peticiones inventadas —"este alumno intenta crear la ficha de otro"— y
// compara lo que las reglas contestan con lo que debería pasar. Nada de esto
// se publica ni se guarda: es una simulación del lado de Google.
//
//   node scripts/probar-reglas-acceso.mjs
//
// Correrlo SIEMPRE después de tocar firestore.rules y ANTES de publicarlas con
// `npm run publicar-reglas`. Un permiso de más aquí no se ve en la pantalla: se
// ve cuando alguien lee las calificaciones del grupo.
//
// Requiere haber autorizado la cuenta una vez:  gcloud auth application-default login

import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PROYECTO = "antologia-digital";
const reglas = readFileSync(join(RAIZ, "firestore.rules"), "utf8");

// Los paths del request van tal cual; los que reciben get() y exists() DENTRO
// de las reglas llegan codificados. Si un mock no coincide carácter por
// carácter no se aplica, la función devuelve vacío y la prueba falla sin decir
// por qué. Costó encontrarlo: no borrar este comentario.
const DB = "/databases/(default)/documents";
const DBM = "/databases/%28default%29/documents";

const UID = "alumnoGoogle123";
const OTRO = "otroAlumno456";
const CORREO = "alumno@gmail.com";
const AHORA = "2026-09-10T20:00:00Z"; // un timestamp viaja como texto ISO

const googleDe = (uid = UID, correo = CORREO, verificado = true) => ({
  uid, token: { email: correo, email_verified: verificado,
                firebase: { sign_in_provider: "google.com" } },
});
const conCodigo = (uid = UID) => ({
  uid, token: { email: "2024001@antologia.local", email_verified: false,
                firebase: { sign_in_provider: "password" } },
});
const anonimo = () => ({
  uid: "anon1", token: { email_verified: false,
                         firebase: { sign_in_provider: "anonymous" } },
});
const profesor = () => ({
  uid: "profeGoogleUID",
  token: { email: "jose.mendoza.buap@gmail.com", email_verified: true,
           firebase: { sign_in_provider: "google.com" } },
});

const FICHA = { matricula: "", nombre: "Pérez López Juan", grupo: "1º A Vesp",
                activo: true, correo: CORREO, origen: "google" };

const INTENTO = { uid: UID, dia: 1, aciertos: 8, total: 10, porcentaje: 80,
                  porEje: { a: { ok: 4, total: 5 } }, respuestas: [0, 1, 2],
                  enviado: AHORA };

const get = (ruta, data) => ({ function: "get", args: [{ exactValue: ruta.replace(DB, DBM) }],
                               result: { value: { data } } });
const existe = (ruta, v) => ({ function: "exists", args: [{ exactValue: ruta.replace(DB, DBM) }],
                               result: { value: v } });

const casos = [];
function caso(nombre, espera, metodo, ruta, auth, { data, mocks, actual } = {}) {
  const request = { auth, method: metodo, path: DB + ruta, time: AHORA };
  if (data !== undefined) request.resource = { data };
  const tc = { expectation: espera, request, functionMocks: mocks ?? [],
               pathEncoding: "PLAIN", expressionReportLevel: "NONE" };
  if (actual !== undefined) tc.resource = { data: actual };
  casos.push([nombre, tc]);
}

// ─── Fichas ──────────────────────────────────────────────────────────────────
caso("Google crea SU ficha", "ALLOW", "create", `/alumnos/${UID}`, googleDe(), { data: FICHA });
caso("No crea la ficha de otro", "DENY", "create", `/alumnos/${OTRO}`, googleDe(), { data: FICHA });
caso("No pone un correo ajeno", "DENY", "create", `/alumnos/${UID}`, googleDe(),
     { data: { ...FICHA, correo: "director@escuela.mx" } });
caso("No se da de alta desactivado", "DENY", "create", `/alumnos/${UID}`, googleDe(),
     { data: { ...FICHA, activo: false } });
caso("No se inventa campos", "DENY", "create", `/alumnos/${UID}`, googleDe(),
     { data: { ...FICHA, calificacion: 10 } });
caso("Nombre vacío, no", "DENY", "create", `/alumnos/${UID}`, googleDe(),
     { data: { ...FICHA, nombre: "A" } });
caso("Sesión anónima no crea ficha", "DENY", "create", `/alumnos/${UID}`, anonimo(),
     { data: FICHA });
caso("Correo sin verificar, no", "DENY", "create", `/alumnos/${UID}`,
     googleDe(UID, CORREO, false), { data: FICHA });
caso("Ve su ficha", "ALLOW", "get", `/alumnos/${UID}`, googleDe());
caso("NO ve la ficha de otro", "DENY", "get", `/alumnos/${OTRO}`, googleDe());
caso("No lista el grupo", "DENY", "list", `/alumnos/${UID}`, googleDe());
caso("El profesor sí lista", "ALLOW", "list", `/alumnos/${UID}`, profesor());
caso("No borra su ficha", "DENY", "delete", `/alumnos/${UID}`, googleDe());
caso("Corrige su grupo", "ALLOW", "update", `/alumnos/${UID}`, googleDe(),
     { data: { ...FICHA, grupo: "2º B Mat" }, actual: FICHA });
caso("Desactivado NO se reactiva", "DENY", "update", `/alumnos/${UID}`, googleDe(),
     { data: FICHA, actual: { ...FICHA, activo: false } });
caso("Ficha de código: el alumno no la toca", "DENY", "update", `/alumnos/${UID}`,
     conCodigo(), { data: FICHA,
     actual: { matricula: "2024001", nombre: "Juan", grupo: "A", activo: true } });

// ─── Intentos ────────────────────────────────────────────────────────────────
const conFicha = [existe(`${DB}/alumnos/${UID}`, true), get(`${DB}/alumnos/${UID}`, FICHA)];
const abierto = [...conFicha, existe(`${DB}/config/modulos`, true),
                 get(`${DB}/config/modulos`, { abiertos: [1, 2] })];
const cerrado = [...conFicha, existe(`${DB}/config/modulos`, true),
                 get(`${DB}/config/modulos`, { abiertos: [] })];
const sinFicha = [existe(`${DB}/alumnos/${UID}`, false), existe(`${DB}/config/modulos`, true),
                  get(`${DB}/config/modulos`, { abiertos: [1] })];

caso("Entrega en módulo abierto", "ALLOW", "create", `/intentos/${UID}_1`, googleDe(),
     { data: INTENTO, mocks: abierto });
caso("Módulo cerrado: no entrega", "DENY", "create", `/intentos/${UID}_1`, googleDe(),
     { data: INTENTO, mocks: cerrado });
caso("Sin ficha: no entrega", "DENY", "create", `/intentos/${UID}_1`, googleDe(),
     { data: INTENTO, mocks: sinFicha });
caso("No entrega a nombre de otro", "DENY", "create", `/intentos/${OTRO}_1`, googleDe(),
     { data: { ...INTENTO, uid: OTRO }, mocks: abierto });
caso("No se cambia la calificación", "DENY", "update", `/intentos/${UID}_1`, googleDe(),
     { data: INTENTO, mocks: abierto });
caso("No borra su intento para repetir", "DENY", "delete", `/intentos/${UID}_1`, googleDe(),
     { mocks: abierto });
caso("No lee la calificación de otro", "DENY", "get", `/intentos/${OTRO}_1`, googleDe(),
     { mocks: [get(`${DB}/intentos/${OTRO}_1`, { ...INTENTO, uid: OTRO })] });
caso("No lista las calificaciones", "DENY", "list", `/intentos/${UID}_1`, googleDe(),
     { mocks: abierto });

// ─── El interruptor de los módulos ───────────────────────────────────────────
caso("No abre módulos por su cuenta", "DENY", "update", "/config/modulos", googleDe(),
     { data: { abiertos: [1, 2, 3, 4, 5, 6, 7, 8] } });
caso("El profesor sí abre módulos", "ALLOW", "update", "/config/modulos", profesor(),
     { data: { abiertos: [1] } });

// ─── Lengua y Comunicación: votos y quizzes ─────────────────────────────────
const RONDA = "s1-kross@abc123";
const lyc = (config) => [...conFicha, existe(`${DB}/config/lyc`, true), get(`${DB}/config/lyc`, config)];
const lycAbierta = lyc({ activa: RONDA, quizzes: [1] });
const lycCerrada = lyc({ activa: "", quizzes: [] });
const VOTO = { uid: UID, pregunta: RONDA, opcion: 1, enviado: AHORA };
const QUIZ = { uid: UID, quiz: 1, aciertos: 6, total: 8, porcentaje: 75,
               respuestas: [0, 1, 2, 1, 1, 1, 2, 1], enviado: AHORA };

caso("Vota en la pregunta abierta", "ALLOW", "create", `/lyc_votos/${UID}_${RONDA}`, googleDe(),
     { data: VOTO, mocks: lycAbierta });
caso("No vota con la votación cerrada", "DENY", "create", `/lyc_votos/${UID}_${RONDA}`, googleDe(),
     { data: VOTO, mocks: lycCerrada });
caso("No vota en otra pregunta", "DENY", "create", `/lyc_votos/${UID}_s1-ross@abc123`, googleDe(),
     { data: { ...VOTO, pregunta: "s1-ross@abc123" }, mocks: lycAbierta });
caso("No vota a nombre de otro", "DENY", "create", `/lyc_votos/${OTRO}_${RONDA}`, googleDe(),
     { data: { ...VOTO, uid: OTRO }, mocks: lycAbierta });
caso("No cambia su voto", "DENY", "update", `/lyc_votos/${UID}_${RONDA}`, googleDe(),
     { data: VOTO, actual: VOTO, mocks: lycAbierta });
caso("Opción fuera de rango, no", "DENY", "create", `/lyc_votos/${UID}_${RONDA}`, googleDe(),
     { data: { ...VOTO, opcion: 9 }, mocks: lycAbierta });
caso("Sin ficha no vota", "DENY", "create", `/lyc_votos/${UID}_${RONDA}`, googleDe(),
     { data: VOTO, mocks: [existe(`${DB}/alumnos/${UID}`, false), existe(`${DB}/config/lyc`, true),
                           get(`${DB}/config/lyc`, { activa: RONDA, quizzes: [1] })] });
caso("El alumno no lista los votos", "DENY", "list", `/lyc_votos/${UID}_${RONDA}`, googleDe());
caso("El profesor sí lista los votos", "ALLOW", "list", `/lyc_votos/${UID}_${RONDA}`, profesor());

caso("Entrega el quiz abierto", "ALLOW", "create", `/lyc_quizzes/${UID}_1`, googleDe(),
     { data: QUIZ, mocks: lycAbierta });
caso("Quiz cerrado: no entrega", "DENY", "create", `/lyc_quizzes/${UID}_2`, googleDe(),
     { data: { ...QUIZ, quiz: 2 }, mocks: lycAbierta });
caso("No cambia su calificación del quiz", "DENY", "update", `/lyc_quizzes/${UID}_1`, googleDe(),
     { data: { ...QUIZ, aciertos: 8, porcentaje: 100 }, actual: QUIZ, mocks: lycAbierta });
caso("No entrega el quiz de otro", "DENY", "create", `/lyc_quizzes/${OTRO}_1`, googleDe(),
     { data: { ...QUIZ, uid: OTRO }, mocks: lycAbierta });
caso("Más aciertos que preguntas, no", "DENY", "create", `/lyc_quizzes/${UID}_1`, googleDe(),
     { data: { ...QUIZ, aciertos: 9 }, mocks: lycAbierta });
caso("No lee el quiz de otro", "DENY", "get", `/lyc_quizzes/${OTRO}_1`, googleDe(),
     { mocks: [get(`${DB}/lyc_quizzes/${OTRO}_1`, { ...QUIZ, uid: OTRO })] });
caso("No lista los quizzes", "DENY", "list", `/lyc_quizzes/${UID}_1`, googleDe());
caso("El profesor sí lista los quizzes", "ALLOW", "list", `/lyc_quizzes/${UID}_1`, profesor());
caso("El alumno no abre la votación", "DENY", "update", "/config/lyc", googleDe(),
     { data: { activa: RONDA, quizzes: [1, 2] } });
caso("El profesor sí abre la votación", "ALLOW", "update", "/config/lyc", profesor(),
     { data: { activa: RONDA, quizzes: [1] } });

// ─── A correr ────────────────────────────────────────────────────────────────
let token;
try {
  token = execFileSync("gcloud",
    ["auth", "application-default", "print-access-token"], { encoding: "utf8" }).trim();
} catch {
  console.error("\n✗ Falta autorizar la cuenta:  gcloud auth application-default login\n");
  process.exit(1);
}

const respuesta = await fetch(
  `https://firebaserules.googleapis.com/v1/projects/${PROYECTO}:test`,
  { method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      source: { files: [{ name: "firestore.rules", content: reglas }] },
      testSuite: { testCases: casos.map(([, c]) => c) },
    }) });

const res = await respuesta.json();

if (!res.testResults) {
  // Un error de sintaxis en las reglas sale por aquí, con línea y columna.
  console.error("\n✗ Las reglas no compilaron o la API falló:\n");
  console.error(JSON.stringify(res, null, 2).slice(0, 2000));
  process.exit(1);
}

let bien = 0, mal = 0;
res.testResults.forEach((r, i) => {
  const [nombre] = casos[i];
  if (r.state === "SUCCESS") { console.log(`  ✓ ${nombre}`); bien++; }
  else {
    console.log(`  ✗ ${nombre}   ← FALLA`);
    for (const e of r.visitedExpressions ?? []) {
      if (e.value === false) console.log(`      regla de la línea ${e.sourcePosition?.line}`);
    }
    mal++;
  }
});

console.log(`\n${bien} bien, ${mal} mal, de ${casos.length} pruebas`);
process.exit(mal ? 1 : 0);

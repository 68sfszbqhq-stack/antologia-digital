// Baja el Markdown anónimo de "características del grupo" para la IA de
// planeación, igual que el botón del panel de coordinación pero sin abrirlo.
//
//   node scripts/exportar-caracteristicas.mjs [aplicación]
//
// Sin número, usa la aplicación más reciente. El archivo queda en ~/Downloads.
// No lleva nombres ni correos: ver src/lib/informes.js.

import { writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { conectar } from "./_admin.mjs";
import { markdownGrupos } from "../src/lib/informes.js";

const { db } = conectar();
const leer = async (c) => (await db.collection(c).get()).docs.map((d) => ({ id: d.id, ...d.data() }));
const [todos, perfiles, vocacionales] = await Promise.all([
  leer("diagnosticos"), leer("perfiles").catch(() => []), leer("vocacional").catch(() => []),
]);

const aplicaciones = [...new Set(todos.map((r) => r.aplicacion))].sort((a, b) => a - b);
const aplicacion = process.argv[2] ? Number(process.argv[2]) : aplicaciones.at(-1);
const registros = todos.filter((r) => r.aplicacion === aplicacion);

const md = markdownGrupos({ registros, perfiles, vocacionales });
const destino = join(homedir(), "Downloads", `caracteristicas-grupos-${new Date().toISOString().slice(0, 10)}.md`);
writeFileSync(destino, md);
console.log(`Aplicaciones encontradas: ${aplicaciones.join(", ")} · usada: ${aplicacion}`);
console.log(`${registros.length} alumnos → ${destino}`);

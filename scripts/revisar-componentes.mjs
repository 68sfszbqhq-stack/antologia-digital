// Busca componentes usados en JSX que no estén definidos ni importados.
//
// POR QUÉ EXISTE. Tres veces seguidas se publicó una página que se quedaba en
// blanco por lo mismo: un componente usado sin importar. El navegador no avisa
// —tira un ReferenceError y no dibuja nada—, el `astro build` tampoco, porque
// para el empaquetador es una variable global que quizá exista en tiempo de
// ejecución. El error solo aparece al abrir la página.
//
// Esto lo caza antes de publicar. No sustituye a probar la página de verdad,
// pero atrapa la falla que se ha repetido.
//
//     node scripts/revisar-componentes.mjs
//
// Devuelve 1 si encuentra algo, para poder encadenarlo antes de un despliegue.

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { RAIZ } from "./_admin.mjs";

const DIR = join(RAIZ, "src/components");

// Etiquetas que son HTML, no componentes. Empiezan con minúscula, así que el
// filtro de mayúscula ya las descarta; aquí solo van las de React.
const PROPIAS = new Set(["Fragment", "React"]);

let problemas = 0;

for (const archivo of readdirSync(DIR).filter((f) => /\.jsx$/.test(f))) {
  const src = readFileSync(join(DIR, archivo), "utf8");

  // Lo que el archivo tiene disponible: importado, declarado o definido.
  const disponibles = new Set(PROPIAS);
  for (const m of src.matchAll(/import\s+(?:([A-Za-z_$][\w$]*)\s*,?\s*)?(?:\{([^}]*)\})?\s*from/g)) {
    if (m[1]) disponibles.add(m[1]);
    if (m[2]) {
      for (const parte of m[2].split(",")) {
        const nombre = parte.split(/\s+as\s+/).pop().trim();
        if (nombre) disponibles.add(nombre);
      }
    }
  }
  for (const m of src.matchAll(/(?:function|const|let|class)\s+([A-Z][\w$]*)/g)) disponibles.add(m[1]);

  // Lo que usa como componente: <Algo con mayúscula inicial.
  const usados = new Set();
  for (const m of src.matchAll(/<([A-Z][\w$.]*)/g)) usados.add(m[1].split(".")[0]);

  const faltantes = [...usados].filter((u) => !disponibles.has(u));
  if (faltantes.length) {
    problemas += faltantes.length;
    console.log(`\n  ✗ ${archivo}`);
    faltantes.forEach((f) => console.log(`      <${f}> se usa pero no está importado ni definido`));
  }
}

if (problemas) {
  console.log(`\n  ${problemas} componente(s) sin definir. La página se quedaría en blanco.\n`);
  process.exit(1);
}
console.log("\n  ✓ Todos los componentes usados están importados o definidos.\n");

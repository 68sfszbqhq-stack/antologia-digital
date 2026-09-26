import type { TemaLyC, UnidadLyC } from "./tipos";
import { unidad1 } from "./unidad-1";
import { unidad2 } from "./unidad-2";
import { unidad3 } from "./unidad-3";
import { unidad4 } from "./unidad-4";
import { unidad5 } from "./unidad-5";

export const unidades: UnidadLyC[] = [unidad1, unidad2, unidad3, unidad4, unidad5];

/** Todos los temas en orden, con su unidad y su número "1.3". */
export const temas = unidades.flatMap((unidad) =>
  unidad.temas.map((tema, i) => ({ unidad, tema, numero: `${unidad.numero}.${i + 1}` })),
);

/**
 * Cada "(Autor, año)" del texto debe tener su ficha, y cada ficha debe citarse.
 * Se busca entre paréntesis cualquier tramo que termine en ", 2005", ", trad. 1990"
 * o ", s.f."; varias citas juntas se separan con ";". Corre al construir: si algo
 * no cuadra, el build se detiene con el nombre del tema y la cita.
 */
function revisarCitas(tema: TemaLyC) {
  const texto = [
    tema.idea,
    ...tema.secciones.flatMap((s) => s.parrafos),
    tema.ejemplo ? `${tema.ejemplo.mal} ${tema.ejemplo.bien} ${tema.ejemplo.porque}` : "",
  ].join(" ");

  const claves = new Set(tema.fuentes.map((f) => f.clave));
  const citadas = new Set<string>();

  for (const [, dentro] of texto.matchAll(/\(([^()]+)\)/g)) {
    for (const trozo of dentro.split(";")) {
      const cita = trozo.trim().replace(/, art\. \d+$/, "");
      if (!/, (trad\. )?(\d{4}|s\.f\.)$/.test(cita)) continue;
      if (!claves.has(cita)) {
        throw new Error(`Lengua y Comunicación, «${tema.titulo}»: la cita "(${cita})" no tiene ficha en fuentes.`);
      }
      citadas.add(cita);
    }
  }
  for (const clave of claves) {
    if (!citadas.has(clave)) {
      throw new Error(`Lengua y Comunicación, «${tema.titulo}»: la fuente "${clave}" está en la lista pero no se cita en el texto.`);
    }
  }
}

const slugs = new Set<string>();
for (const { tema } of temas) {
  if (slugs.has(tema.slug)) throw new Error(`Lengua y Comunicación: el slug "${tema.slug}" está repetido.`);
  slugs.add(tema.slug);
  revisarCitas(tema);
}

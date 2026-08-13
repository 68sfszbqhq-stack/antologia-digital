import type { ContenidoModulo } from "./tipos";
import { modulo1, modulo2, modulo3, modulo4 } from "./contenido-1-4";
import { modulo5, modulo6, modulo7, modulo8 } from "./contenido-5-8";

/** Contenido completo de cada módulo, indexado por el número de día/sesión. */
export const contenido: Record<number, ContenidoModulo> = {
  1: modulo1,
  2: modulo2,
  3: modulo3,
  4: modulo4,
  5: modulo5,
  6: modulo6,
  7: modulo7,
  8: modulo8,
};

export default contenido;

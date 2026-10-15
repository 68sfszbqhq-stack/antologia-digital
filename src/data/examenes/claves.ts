// Las claves de cada examen, por id. Solo las importa /examen/revisar.

import * as cdP1 from "./cultura-digital-p1-clave";
import * as comP1 from "./comunicacion-p1-clave";

export const CLAVES = {
  "cd-p1": cdP1,
  "com-p1": comP1,
} as const;

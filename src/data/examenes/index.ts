// Todos los exámenes de parcial, por id. Lo que ve el alumno: sin claves.
// Para agregar uno: su archivo de preguntas, su archivo de clave, y una línea
// aquí y otra en claves.ts.

import { EXAMEN_CD_P1, type Examen } from "./cultura-digital-p1";
import { EXAMEN_COM_P1 } from "./comunicacion-p1";

export const EXAMENES: Record<string, Examen> = {
  [EXAMEN_CD_P1.id]: EXAMEN_CD_P1,
  [EXAMEN_COM_P1.id]: EXAMEN_COM_P1,
};

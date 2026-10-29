import contenido from './fundamentos.json';
import { exposiciones } from './exposiciones';

export const fundamentos = contenido.temas;
export const fuentesFundamentos = contenido.fuentes;
export const fechaRevision = contenido.fechaRevision;

// Cada turno debe tener una lectura completa y referencias resolubles al compilar.
if (fundamentos.length !== exposiciones.length || new Set(fundamentos.map(t => t.numero)).size !== fundamentos.length) {
  throw new Error('El reparto y las lecturas de fundamentos no coinciden.');
}
for (const exposicion of exposiciones) {
  const lectura = fundamentos.find(t => t.numero === exposicion.numero);
  if (!lectura || lectura.conceptos.length < 3 || lectura.pasos.length < 3 || lectura.fuentes.length < 2) {
    throw new Error(`Fundamentos incompletos para el turno ${exposicion.numero}.`);
  }
  for (const clave of lectura.fuentes) {
    if (!(clave in fuentesFundamentos)) throw new Error(`Fuente desconocida: ${clave}`);
  }
}

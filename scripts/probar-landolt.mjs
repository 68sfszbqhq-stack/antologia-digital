// Comprueba la aritmética del test de Landolt contra el protocolo publicado.
// Corre con:  npm run probar-landolt
//
// No toca Firebase ni el navegador: solo el motor puro de ../src/lib.
// Si algún día cambian los baremos, esta es la red que avisa qué se rompió.

import {
  generarHoja, calcular, curvaPorMinuto, calificarS, calificarIA,
} from '../src/lib/landolt-motor.js';

let fallos = 0;
const ok = (nombre, cond, extra = '') => {
  console.log(`${cond ? '  OK  ' : ' FALLA'} ${nombre}${extra ? ' → ' + extra : ''}`);
  if (!cond) fallos++;
};

const hoja = generarHoja(20260101);
const OBJ = 6;
const objetivos = hoja.map((f, i) => (f === OBJ ? i : -1)).filter((i) => i >= 0);

console.log(`\nHoja: ${hoja.length} anillos, ${objetivos.length} son la figura ${OBJ}`);
ok('la hoja tiene 1050 anillos', hoja.length === 1050);
ok('todas las figuras están entre 1 y 8', hoja.every((f) => f >= 1 && f <= 8));
ok('la semilla es reproducible', JSON.stringify(generarHoja(20260101)) === JSON.stringify(hoja));
ok('otra semilla da otra hoja', JSON.stringify(generarHoja(999)) !== JSON.stringify(hoja));

// ── 1. Ejecutante perfecto: marca TODOS los objetivos hasta el 600
console.log('\n1) Ejecutante perfecto (recorre 600 anillos, 0 errores)');
{
  const hasta = 600;
  const m = new Map(objetivos.filter((i) => i < hasta).map((i) => [i, 10]));
  const r = calcular(hoja, OBJ, m, 300);
  ok('sin falsos positivos', r.falsos === 0, `falsos=${r.falsos}`);
  ok('sin omisiones', r.omisiones === 0, `omisiones=${r.omisiones}`);
  ok('errores n = 0', r.n === 0);
  ok('IA = 100%', Math.abs(r.IA - 100) < 1e-9, `IA=${r.IA}`);
  ok('S = 0.5436*N/T', Math.abs(r.S - (0.5436 * r.N) / 300) < 1e-9, `S=${r.S.toFixed(4)}`);
  ok('N coincide con el último objetivo marcado', r.N === Math.max(...m.keys()) + 1, `N=${r.N}`);
}

// ── 2. Con errores: 3 falsos positivos y 4 omisiones
console.log('\n2) Con 3 falsos positivos y 4 omisiones');
{
  const hasta = 600;
  const dentro = objetivos.filter((i) => i < hasta);
  // Se omiten 4 objetivos DE EN MEDIO, no del final: N se define por el último
  // anillo marcado, así que omitir al final solo acorta el tramo recorrido y no
  // cuenta como error. Es el comportamiento correcto del protocolo.
  const omitidos = new Set([dentro[10], dentro[20], dentro[30], dentro[40]]);
  const m = new Map(dentro.filter((i) => !omitidos.has(i)).map((i) => [i, 10]));
  const noObjetivo = hoja.map((f, i) => (f !== OBJ ? i : -1)).filter((i) => i >= 0 && i < hasta);
  for (const i of noObjetivo.slice(0, 3)) m.set(i, 10); // 3 falsos
  const r = calcular(hoja, OBJ, m, 300);
  ok('cuenta 3 falsos positivos', r.falsos === 3, `falsos=${r.falsos}`);
  ok('cuenta 4 omisiones', r.omisiones === 4, `omisiones=${r.omisiones}`);
  ok('n = falsos + omisiones', r.n === r.falsos + r.omisiones, `n=${r.n}`);
  ok('CA = CT - omisiones', r.CA === r.CT - r.omisiones);
  ok('IA baja de 100', r.IA < 100, `IA=${r.IA.toFixed(2)}%`);
}

// ── 3. Registro vacío: no debe romperse ni dividir entre cero
console.log('\n3) Registro vacío (no marcó nada)');
{
  const r = calcular(hoja, OBJ, new Map(), 300);
  ok('N = 0', r.N === 0);
  ok('IA = 0 y no NaN', r.IA === 0 && !Number.isNaN(r.IA));
  ok('S = 0 y no NaN', r.S === 0 && !Number.isNaN(r.S));
  ok('variante 5min', r.variante === '5min');
}

// ── 4. LA CORRECCIÓN: variante de 1 minuto usa IA = N/(n+1)
console.log('\n4) Variante de 1 minuto — la fórmula corregida');
{
  const hasta = 200;
  const dentro = objetivos.filter((i) => i < hasta);
  const om = new Set([dentro[5], dentro[9]]); // 2 omisiones en medio del tramo
  const m = new Map(dentro.filter((i) => !om.has(i)).map((i) => [i, 5]));
  const r = calcular(hoja, OBJ, m, 60);
  ok('marca la variante 1min', r.variante === '1min');
  ok('IA = N/(n+1)', Math.abs(r.IA - r.N / (r.n + 1)) < 1e-9, `IA=${r.IA.toFixed(2)} N=${r.N} n=${r.n}`);
  ok('IA NO es el porcentaje CA*100/CT', Math.abs(r.IA - (r.CA / r.CT) * 100) > 1,
     `razón=${r.IA.toFixed(1)} vs porcentaje=${((r.CA / r.CT) * 100).toFixed(1)}`);

  const r5 = calcular(hoja, OBJ, m, 300);
  ok('a 5 min la misma ejecución usa el porcentaje',
     r5.variante === '5min' && Math.abs(r5.IA - (r5.CA / r5.CT) * 100) < 1e-9,
     `IA5min=${r5.IA.toFixed(2)}%`);
}

// ── 5. La curva por minuto debe sumar los totales
console.log('\n5) Coherencia de la curva por minuto con los totales');
{
  const hasta = 600;
  const dentro = objetivos.filter((i) => i < hasta);
  const m = new Map(dentro.map((i, k) => [i, Math.min(299, Math.floor((k / dentro.length) * 300))]));
  const r = calcular(hoja, OBJ, m, 300);
  const curva = curvaPorMinuto(hoja, OBJ, m, 300);
  ok('la curva tiene 5 bloques', curva.length === 5, `bloques=${curva.length}`);
  const sumaN = curva.reduce((a, c) => a + c.N, 0);
  const sumaCA = curva.reduce((a, c) => a + c.CA, 0);
  ok('los N por minuto suman el N total', sumaN === r.N, `${sumaN} vs ${r.N}`);
  ok('los aciertos por minuto suman el total', sumaCA === r.CA, `${sumaCA} vs ${r.CA}`);
}

// ── 6. Escalas contra la fuente publicada
console.log('\n6) Escalas de calificación contra la fuente');
{
  ok('S = 1.24 → Muy bien', calificarS(1.24) === 'Muy bien');
  ok('S = 1.10 → Bien', calificarS(1.10) === 'Bien');
  ok('S = 1.02 → Regular (la fuente dice "igual o menor que 1.02")', calificarS(1.02) === 'Regular');
  ok('S = 0.90 → Regular', calificarS(0.90) === 'Regular');
  ok('S = 0.50 → Mal', calificarS(0.50) === 'Mal');
  ok('IA = 95 → Excelente', calificarIA(95) === 'Excelente');
  ok('IA = 59 → Mal', calificarIA(59) === 'Mal');
  ok('IA = 60 → Regular', calificarIA(60) === 'Regular');
}

console.log(fallos === 0 ? '\n✓ Todas las comprobaciones pasaron\n' : `\n✗ ${fallos} fallaron\n`);
process.exit(fallos === 0 ? 0 : 1);

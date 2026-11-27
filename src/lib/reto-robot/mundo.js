/* El mundo de Chispa: una cuadrícula con piso, gemas e interruptores.
 *
 * Letras del mapa:
 *   ' '  vacío (Chispa no puede pisarlo)
 *   '.'  piso
 *   'G'  gema
 *   'S'  interruptor apagado
 *   'E'  interruptor encendido
 *
 * Direcciones: 0 norte (arriba), 1 este, 2 sur, 3 oeste.
 * El nivel se gana sin gemas en el piso y con todos los interruptores encendidos.
 */

const DX = [0, 1, 0, -1];
const DY = [-1, 0, 1, 0];

export function crearMundo(def) {
  const celdas = def.mapa.map((fila) => fila.split(''));
  const alto = celdas.length;
  const ancho = Math.max(...def.mapa.map((f) => f.length));
  let { x, y, dir } = def.robot;
  let angulo = dir * 90; // acumulado, para que la animación no dé la vuelta larga
  let gemas = 0;

  const celda = (cx, cy) => (cy >= 0 && cy < alto && cx >= 0 && cx < ancho ? celdas[cy][cx] || ' ' : ' ');
  const libre = (cx, cy) => celda(cx, cy) !== ' ';
  const bloqueadoHacia = (d) => !libre(x + DX[d], y + DY[d]);

  return {
    ancho,
    alto,
    avanzar() {
      if (bloqueadoHacia(dir)) return 'Chispa chocó: enfrente no hay camino. Revisa los giros o cuántas veces avanzas.';
      x += DX[dir];
      y += DY[dir];
      return null;
    },
    girarIzquierda() { dir = (dir + 3) % 4; angulo -= 90; return null; },
    girarDerecha() { dir = (dir + 1) % 4; angulo += 90; return null; },
    recoger() {
      if (celda(x, y) !== 'G') return 'Aquí no hay ninguna gema que recoger.';
      celdas[y][x] = '.';
      gemas++;
      return null;
    },
    activar() {
      const c = celda(x, y);
      if (c === 'S') { celdas[y][x] = 'E'; return null; }
      if (c === 'E') { celdas[y][x] = 'S'; return null; } // lo apaga: no es error, pero deja el nivel incompleto
      return 'Aquí no hay ningún interruptor.';
    },
    sensor(nombre) {
      switch (nombre) {
        case 'hayGema': return celda(x, y) === 'G';
        case 'hayInterruptorApagado': return celda(x, y) === 'S';
        case 'hayInterruptorEncendido': return celda(x, y) === 'E';
        case 'bloqueado': return bloqueadoHacia(dir);
        case 'bloqueadoIzquierda': return bloqueadoHacia((dir + 3) % 4);
        case 'bloqueadoDerecha': return bloqueadoHacia((dir + 1) % 4);
        case 'gemasRecogidas': return gemas;
      }
      return undefined;
    },
    pendientes() {
      let gemasFaltan = 0;
      let apagados = 0;
      for (const fila of celdas) for (const c of fila) {
        if (c === 'G') gemasFaltan++;
        if (c === 'S') apagados++;
      }
      return { gemas: gemasFaltan, apagados };
    },
    foto(linea, accion, problema = null) {
      return { x, y, dir, angulo, gemas, linea, accion, problema, celdas: celdas.map((f) => f.join('')) };
    },
  };
}

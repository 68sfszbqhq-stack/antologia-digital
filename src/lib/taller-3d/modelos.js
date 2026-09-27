// Las piezas del taller 3D, dibujadas con cajas y cilindros.
//
// POR QUÉ NO SE USAN MODELOS DESCARGADOS (.glb). Los alumnos entran con
// teléfonos de gama baja y datos limitados. Un modelo realista de cada pieza
// pesaría megas; esto pesa unos cuantos kilobytes de código y se dibuja en un
// instante. El detalle se consigue con texturas pintadas en un <canvas>.
//
// Convenciones:
//   · Una unidad ≈ 10 cm a escala "de maqueta" (no son medidas reales).
//   · Las piezas de la PC se dibujan en las coordenadas del gabinete DE PIE:
//     x apunta al costado abierto, y hacia arriba, z hacia el frente.
//   · Los periféricos (monitor, teclado…) tienen su origen al ras de la mesa.
//   · Lo que tiene que animarse al encender se anota en userData:
//     ventiladores (giran), luces (se prenden), pantalla (el POST).

import * as THREE from 'three';

// ─── Utilidades ──────────────────────────────────────────────────────────────

const cacheMat = new Map();

/** Material con caché: muchas piezas repiten el mismo negro o el mismo metal. */
function M(color, metal = 0.2, rugosidad = 0.6, extra = {}) {
  const llave = `${color}|${metal}|${rugosidad}|${JSON.stringify(extra)}`;
  if (!extra.map && cacheMat.has(llave)) return cacheMat.get(llave);
  const m = new THREE.MeshStandardMaterial({ color, metalness: metal, roughness: rugosidad, ...extra });
  if (!extra.map) cacheMat.set(llave, m);
  return m;
}

/** Se llama al destruir el taller: los materiales en caché ya se liberaron. */
export function limpiarCache() {
  cacheMat.clear();
}

function caja(w, h, d, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  m.position.set(x, y, z);
  return m;
}

/** Cilindro acostado sobre el eje indicado ('x', 'y' o 'z'). */
function cil(r, h, material, eje = 'y', x = 0, y = 0, z = 0, seg = 20) {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg), material);
  if (eje === 'x') m.rotation.z = Math.PI / 2;
  if (eje === 'z') m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  return m;
}

/** Textura pintada a mano en un canvas. */
function lienzo(w, h, pintar) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const g = c.getContext('2d');
  pintar(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Caja con una textura en UNA cara. Orden de caras: +x, -x, +y, -y, +z, -z. */
function cajaConCara(w, h, d, base, cara, textura, x = 0, y = 0, z = 0) {
  const idx = { px: 0, nx: 1, py: 2, ny: 3, pz: 4, nz: 5 }[cara];
  const mats = Array.from({ length: 6 }, () => base);
  mats[idx] = new THREE.MeshStandardMaterial({ map: textura, metalness: base.metalness, roughness: base.roughness });
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mats);
  m.position.set(x, y, z);
  return m;
}

function etiqueta(texto, { fondo = '#111418', color = '#e2e8f0', w = 256, h = 128, tam = 40, sub = '' } = {}) {
  return lienzo(w, h, (g) => {
    g.fillStyle = fondo;
    g.fillRect(0, 0, w, h);
    g.fillStyle = color;
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.font = `bold ${tam}px Inter, Arial, sans-serif`;
    g.fillText(texto, w / 2, sub ? h * 0.4 : h / 2);
    if (sub) {
      g.globalAlpha = 0.7;
      g.font = `${Math.round(tam * 0.55)}px "Roboto Mono", monospace`;
      g.fillText(sub, w / 2, h * 0.72);
    }
  });
}

/** Aspas de ventilador que giran alrededor del eje indicado. */
function aspas(radio, eje, material) {
  const g = new THREE.Group();
  const n = 7;
  for (let i = 0; i < n; i++) {
    const a = caja(radio * 0.9, 0.02, radio * 0.32, material);
    a.position.x = radio * 0.5;
    const brazo = new THREE.Group();
    brazo.add(a);
    brazo.rotation.y = (i / n) * Math.PI * 2;
    a.rotation.x = 0.35;
    g.add(brazo);
  }
  g.add(cil(radio * 0.3, 0.05, M(0x1c1f25, 0.3, 0.5), 'y'));
  const cont = new THREE.Group();
  cont.add(g);
  if (eje === 'x') cont.rotation.z = Math.PI / 2;
  if (eje === 'z') cont.rotation.x = Math.PI / 2;
  cont.userData.giro = g; // gira sobre su propio "y"
  return cont;
}

// ─── Mesa y escenario ────────────────────────────────────────────────────────

export function mesa() {
  const g = new THREE.Group();
  const madera = lienzo(512, 512, (c, w, h) => {
    c.fillStyle = '#6b4a2f';
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 90; i++) {
      c.strokeStyle = `rgba(${40 + Math.random() * 30},${25 + Math.random() * 20},${10},${0.15 + Math.random() * 0.2})`;
      c.lineWidth = 1 + Math.random() * 3;
      c.beginPath();
      const y = Math.random() * h;
      c.moveTo(0, y);
      c.bezierCurveTo(w * 0.3, y + Math.random() * 20 - 10, w * 0.6, y + Math.random() * 20 - 10, w, y);
      c.stroke();
    }
  });
  madera.wrapS = madera.wrapT = THREE.RepeatWrapping;
  madera.repeat.set(3, 2);
  const tablero = caja(21, 0.35, 12.5, new THREE.MeshStandardMaterial({ map: madera, roughness: 0.75, metalness: 0.05 }), 0, -0.2, 0);
  tablero.receiveShadow = true;
  g.add(tablero);

  // Tapete antiestático, como el de cualquier taller de reparación.
  const tapete = lienzo(512, 320, (c, w, h) => {
    c.fillStyle = '#29425a';
    c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(255,255,255,0.06)';
    c.lineWidth = 1;
    for (let x = 0; x < w; x += 16) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, h); c.stroke(); }
    for (let y = 0; y < h; y += 16) { c.beginPath(); c.moveTo(0, y); c.lineTo(w, y); c.stroke(); }
    c.fillStyle = 'rgba(255,255,255,0.35)';
    c.font = 'bold 14px "Roboto Mono", monospace';
    c.fillText('ESD SAFE · TAPETE ANTIESTÁTICO', 14, h - 14);
  });
  const t = caja(19.5, 0.03, 11.2, new THREE.MeshStandardMaterial({ map: tapete, roughness: 0.95 }), 0, -0.015, 0);
  t.receiveShadow = true;
  g.add(t);
  return g;
}

export function regleta() {
  const g = new THREE.Group();
  const cara = lienzo(256, 64, (c, w, h) => {
    c.fillStyle = '#e9ecef';
    c.fillRect(0, 0, w, h);
    for (let i = 0; i < 4; i++) {
      const x = 22 + i * 58;
      c.fillStyle = '#c4c9cf';
      c.fillRect(x, 14, 40, 36);
      c.fillStyle = '#2b2f36';
      c.fillRect(x + 11, 22, 4, 14);
      c.fillRect(x + 25, 22, 4, 14);
      c.beginPath(); c.arc(x + 20, 42, 3, 0, 7); c.fill();
    }
  });
  g.add(cajaConCara(2.2, 0.26, 0.55, M(0xe9ecef, 0, 0.5), 'py', cara, 0, 0.13, 0));
  const luz = caja(0.12, 0.05, 0.12, M(0x7f1d1d, 0, 0.4, { emissive: 0xff3b3b, emissiveIntensity: 0.9 }), 0.95, 0.28, 0);
  g.add(luz);
  return g;
}

// ─── PC de escritorio ────────────────────────────────────────────────────────

export function gabinete() {
  const g = new THREE.Group();
  const metal = M(0x2b303b, 0.65, 0.42);
  const interior = M(0x1a1e26, 0.4, 0.6);

  g.add(caja(0.08, 4.6, 4.2, interior, -1.0, 2.3, 0)); // bandeja de la placa
  g.add(caja(2.08, 0.08, 4.2, metal, 0, 4.56, 0)); // techo
  g.add(caja(2.08, 0.08, 4.2, metal, 0, 0.04, 0)); // piso

  const malla = lienzo(256, 512, (c, w, h) => {
    c.fillStyle = '#15181e';
    c.fillRect(0, 0, w, h);
    c.fillStyle = '#2c323d';
    for (let y = 6; y < h - 60; y += 12) {
      for (let x = (y / 12) % 2 ? 6 : 12; x < w; x += 12) {
        c.beginPath(); c.arc(x, y, 3.6, 0, 7); c.fill();
      }
    }
    c.fillStyle = '#8b95a5';
    c.font = 'bold 22px Inter, Arial';
    c.textAlign = 'center';
    c.fillText('BGO · PC', w / 2, h - 24);
  });
  g.add(cajaConCara(2.08, 4.6, 0.1, metal, 'pz', malla, 0, 2.3, 2.1)); // frente
  g.add(caja(2.08, 4.6, 0.08, metal, 0, 2.3, -2.1)); // parte trasera

  // Detalles de la parte trasera: hueco de puertos, ranuras de expansión y
  // hueco de la fuente.
  const negro = M(0x0b0d10, 0.2, 0.8);
  g.add(caja(0.4, 0.95, 0.03, negro, -0.6, 3.75, -2.15));
  for (let i = 0; i < 5; i++) g.add(caja(0.9, 0.1, 0.03, M(0x8d96a3, 0.8, 0.35), -0.25, 2.45 - i * 0.2, -2.15));
  g.add(caja(1.45, 0.8, 0.03, negro, 0, 0.53, -2.15));
  g.add(cil(0.42, 0.03, M(0x3a404c, 0.5, 0.5), 'z', -0.3, 3.8, -2.15, 24)); // ventilador trasero

  // Separadores dorados donde se atornilla la placa.
  const oro = M(0xc9a13b, 0.9, 0.3);
  for (const [y, z] of [[1.5, -1.7], [1.5, 0.8], [2.85, -1.7], [2.85, 0.8], [4.2, -1.7], [4.2, 0.8]]) {
    g.add(cil(0.05, 0.1, oro, 'x', -0.92, y, z, 8));
  }

  // Patas.
  for (const [x, z] of [[-0.7, -1.7], [0.7, -1.7], [-0.7, 1.7], [0.7, 1.7]]) {
    g.add(caja(0.35, 0.1, 0.35, negro, x, -0.05, z));
  }

  // Botón de encendido y puertos USB frontales (arriba, al frente).
  const boton = cil(0.12, 0.05, M(0x1f2937, 0.5, 0.4, { emissive: 0x00e5ff, emissiveIntensity: 0 }), 'y', 0, 4.62, 1.55);
  g.add(boton);
  g.add(caja(0.1, 0.03, 0.18, negro, 0.55, 4.61, 1.75));
  g.add(caja(0.1, 0.03, 0.18, negro, 0.3, 4.61, 1.75));
  // Tira de luz del frente.
  const tira = caja(0.06, 3.6, 0.02, M(0x0c4a6e, 0, 0.5, { emissive: 0x00e5ff, emissiveIntensity: 0 }), 0.9, 2.4, 2.16);
  g.add(tira);
  g.userData.luces = [boton.material, tira.material];
  return g;
}

export function psu() {
  const g = new THREE.Group();
  const cuerpo = M(0x16181c, 0.5, 0.5);
  const sello = etiqueta('FUENTE DE PODER', { sub: '650 W · 127 V~', fondo: '#1d2027', tam: 26 });
  g.add(cajaConCara(1.5, 0.85, 1.5, cuerpo, 'px', sello));
  // Enchufe y switch atrás.
  g.add(caja(0.35, 0.25, 0.05, M(0x050607), 0.35, 0, -0.77));
  g.add(caja(0.15, 0.2, 0.05, M(0x7f1d1d, 0.2, 0.5), -0.1, 0, -0.77));
  // Rejilla del ventilador (hacia el piso del gabinete, pero se ve al tomarla).
  const rejilla = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.025, 6, 32), M(0x6b7280, 0.8, 0.3));
  rejilla.rotation.x = Math.PI / 2;
  rejilla.position.set(0, -0.44, 0);
  g.add(rejilla);
  // Mazo de cables que sale hacia el frente.
  const cable = M(0x0f1012, 0.1, 0.8);
  for (let i = 0; i < 4; i++) g.add(cil(0.05, 0.5, cable, 'z', -0.4 + i * 0.12, 0.2 - (i % 2) * 0.1, 0.95, 8));
  return g;
}

export function placaMadre() {
  const g = new THREE.Group();
  const pcb = lienzo(512, 512, (c, w, h) => {
    c.fillStyle = '#1a2620';
    c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(120,200,160,0.18)';
    c.lineWidth = 2;
    for (let i = 0; i < 70; i++) {
      c.beginPath();
      let x = Math.random() * w, y = Math.random() * h;
      c.moveTo(x, y);
      for (let k = 0; k < 3; k++) {
        if (Math.random() > 0.5) x += (Math.random() - 0.5) * 160; else y += (Math.random() - 0.5) * 160;
        c.lineTo(x, y);
      }
      c.stroke();
    }
    c.fillStyle = 'rgba(255,255,255,0.4)';
    c.font = 'bold 20px "Roboto Mono", monospace';
    c.fillText('ATX · MOTHERBOARD', 18, h - 18);
  });
  g.add(cajaConCara(0.06, 3.0, 2.9, M(0x1a2620, 0.3, 0.6), 'px', pcb));

  const gris = M(0xb8bdc6, 0.7, 0.35);
  const negro = M(0x111317, 0.2, 0.7);
  // Socket del CPU con su palanca.
  g.add(caja(0.04, 0.62, 0.62, gris, 0.05, 0.8, -0.4));
  g.add(caja(0.04, 0.5, 0.5, M(0x2a2f38, 0.3, 0.6), 0.075, 0.8, -0.4));
  g.add(caja(0.03, 0.04, 0.55, gris, 0.08, 0.46, -0.4));
  // Ranuras de RAM.
  for (const z of [0.5, 0.72]) {
    g.add(caja(0.08, 1.4, 0.07, negro, 0.07, 0.7, z));
    g.add(caja(0.1, 0.06, 0.09, M(0xe5e7eb, 0.1, 0.5), 0.08, 1.42, z));
  }
  // Ranura PCI Express (con refuerzo metálico).
  g.add(caja(0.08, 0.09, 1.45, gris, 0.07, -0.77, -0.1));
  // Ranura M.2.
  g.add(caja(0.05, 0.24, 0.08, negro, 0.05, 0.1, -0.68));
  // Disipadores de los reguladores de voltaje (VRM).
  const vrm = M(0x3b4250, 0.8, 0.35);
  g.add(caja(0.22, 0.32, 0.95, vrm, 0.14, 1.26, -0.45));
  g.add(caja(0.22, 0.85, 0.28, vrm, 0.14, 0.75, -1.12));
  // Bloque de puertos traseros.
  g.add(caja(0.38, 0.9, 0.22, M(0x2a2f38, 0.6, 0.4), 0.22, 0.9, -1.36));
  // Chipset.
  g.add(caja(0.09, 0.55, 0.55, vrm, 0.07, -0.95, 0.82));
  // Conector de 24 pines.
  g.add(caja(0.2, 0.9, 0.12, M(0xe5e7eb, 0.1, 0.6), 0.13, 0.55, 1.38));
  // Capacitores alrededor del socket.
  const cap = M(0x0e0f12, 0.6, 0.35);
  for (let i = 0; i < 6; i++) g.add(cil(0.04, 0.12, cap, 'x', 0.09, 0.35 + i * 0.1, 0.05, 10));
  // Pila de la BIOS: guarda la hora y la configuración con el equipo apagado.
  g.add(cil(0.1, 0.03, M(0xd1d5db, 0.9, 0.25), 'x', 0.05, -0.4, 0.8, 20));
  return g;
}

export function cpu() {
  const g = new THREE.Group();
  g.add(caja(0.02, 0.45, 0.45, M(0x1f5130, 0.3, 0.5)));
  const tapa = etiqueta('CPU', { fondo: '#c8cdd4', color: '#374151', w: 128, h: 128, tam: 34, sub: '8 núcleos' });
  g.add(cajaConCara(0.03, 0.37, 0.37, M(0xc8cdd4, 0.85, 0.3), 'px', tapa, 0.025, 0, 0));
  // Triángulo dorado que indica la orientación.
  const tri = new THREE.Mesh(new THREE.CircleGeometry(0.035, 3), M(0xd4a017, 0.9, 0.3));
  tri.rotation.y = Math.PI / 2;
  tri.position.set(0.012, -0.19, -0.19);
  g.add(tri);
  return g;
}

export function disipador() {
  const g = new THREE.Group();
  g.add(caja(0.06, 0.55, 0.55, M(0xb87333, 0.9, 0.3), -0.27, 0, 0)); // base de cobre
  const aletas = M(0xa7b0bd, 0.85, 0.35);
  for (let i = 0; i < 9; i++) g.add(caja(0.28, 0.02, 0.8, aletas, -0.08, -0.4 + i * 0.1, 0));
  g.add(caja(0.12, 0.88, 0.88, M(0x1c1f25, 0.3, 0.6), 0.14, 0, 0)); // marco del ventilador
  const a = aspas(0.38, 'x', M(0x0e7490, 0.2, 0.5));
  a.position.set(0.21, 0, 0);
  g.add(a);
  g.userData.ventiladores = [a.userData.giro];
  return g;
}

export function ram() {
  const g = new THREE.Group();
  g.add(caja(0.34, 1.3, 0.03, M(0x1f5130, 0.3, 0.5)));
  const lado = etiqueta('DDR5', { fondo: '#2b303b', color: '#e2e8f0', w: 128, h: 256, tam: 30, sub: '16 GB' });
  g.add(cajaConCara(0.3, 1.26, 0.025, M(0x2b303b, 0.6, 0.4), 'pz', lado, 0.01, 0, 0.028));
  g.add(cajaConCara(0.3, 1.26, 0.025, M(0x2b303b, 0.6, 0.4), 'nz', lado, 0.01, 0, -0.028));
  const luz = caja(0.04, 1.26, 0.08, M(0x155e75, 0, 0.4, { emissive: 0x22d3ee, emissiveIntensity: 0.15 }), 0.18, 0, 0);
  g.add(luz);
  g.add(caja(0.03, 1.1, 0.032, M(0xd4a017, 0.9, 0.3), -0.17, 0, 0)); // contactos
  g.userData.luces = [luz.material];
  return g;
}

export function ssdM2() {
  const g = new THREE.Group();
  const cara = etiqueta('NVMe SSD', { fondo: '#111827', color: '#e2e8f0', w: 256, h: 64, tam: 22, sub: '1 TB · M.2' });
  g.add(caja(0.02, 0.22, 0.8, M(0x14301f, 0.3, 0.5)));
  g.add(cajaConCara(0.02, 0.2, 0.6, M(0x111827, 0.4, 0.5), 'px', cara, 0.02, 0, 0.05));
  g.add(caja(0.025, 0.2, 0.05, M(0xd4a017, 0.9, 0.3), 0, 0, -0.41));
  return g;
}

export function gpu() {
  const g = new THREE.Group();
  const carcasa = M(0x1e222a, 0.5, 0.45);
  const lado = etiqueta('GPU', { fondo: '#1e222a', color: '#22d3ee', w: 512, h: 128, tam: 60, sub: 'TARJETA DE VIDEO' });
  g.add(cajaConCara(1.05, 0.34, 2.7, carcasa, 'px', lado, 0.02, -0.04, 0));
  g.add(caja(0.95, 0.04, 2.6, M(0x14301f, 0.3, 0.5), 0.0, 0.16, 0)); // tarjeta
  g.add(caja(1.0, 0.03, 2.62, M(0x3b4250, 0.7, 0.35), 0.02, 0.2, 0)); // placa trasera
  const ventiladores = [];
  for (const z of [-0.65, 0.65]) {
    const a = aspas(0.45, 'y', M(0x2b303b, 0.3, 0.5));
    a.position.set(0.02, -0.22, z);
    g.add(a);
    ventiladores.push(a.userData.giro);
  }
  // Escuadra metálica con la salida HDMI.
  const escuadra = M(0x9aa3ad, 0.85, 0.3);
  g.add(caja(1.1, 0.42, 0.03, escuadra, -0.02, 0.0, -1.38));
  g.add(caja(0.12, 0.06, 0.05, M(0x050607), 0.1, 0.0, -1.41));
  g.add(caja(0.12, 0.06, 0.05, M(0x050607), -0.15, 0.0, -1.41));
  // Contactos PCIe.
  g.add(caja(0.08, 0.035, 0.95, M(0xd4a017, 0.9, 0.3), -0.52, 0.16, -0.45));
  const luz = caja(0.02, 0.06, 1.8, M(0x155e75, 0, 0.4, { emissive: 0x22d3ee, emissiveIntensity: 0 }), 0.55, 0.08, 0.2);
  g.add(luz);
  g.userData.ventiladores = ventiladores;
  g.userData.luces = [luz.material];
  return g;
}

export function hdd() {
  const g = new THREE.Group();
  const cara = etiqueta('DISCO DURO', { fondo: '#d1d5db', color: '#1f2937', w: 256, h: 256, tam: 30, sub: '2 TB · 7200 rpm' });
  g.add(cajaConCara(1.0, 0.25, 1.45, M(0x9aa3ad, 0.85, 0.3), 'py', cara));
  const inf = cajaConCara(0.98, 0.24, 1.43, M(0x9aa3ad, 0.85, 0.3), 'px', cara, 0.012, 0, 0);
  g.add(inf);
  g.add(caja(0.5, 0.12, 0.05, M(0x111317), 0.1, 0, -0.74)); // conectores SATA
  return g;
}

export function tapaLateral() {
  const g = new THREE.Group();
  const vidrio = new THREE.MeshStandardMaterial({
    color: 0x9fd8ff, transparent: true, opacity: 0.18, roughness: 0.05, metalness: 0.1, depthWrite: false,
  });
  g.add(caja(0.04, 4.5, 4.1, vidrio));
  const marco = M(0x1c1f25, 0.5, 0.5);
  g.add(caja(0.06, 0.1, 4.2, marco, 0, 2.27, 0));
  g.add(caja(0.06, 0.1, 4.2, marco, 0, -2.27, 0));
  g.add(caja(0.06, 4.6, 0.1, marco, 0, 0, 2.07));
  g.add(caja(0.06, 4.6, 0.1, marco, 0, 0, -2.07));
  const tornillo = M(0x9aa3ad, 0.9, 0.3);
  for (const [y, z] of [[1.9, 1.7], [1.9, -1.7], [-1.9, 1.7], [-1.9, -1.7]]) g.add(cil(0.08, 0.06, tornillo, 'x', 0.03, y, z, 12));
  return g;
}

/** Pantalla que se puede redibujar: monitor y laptop. */
function panel(w, h, pw, ph) {
  const c = document.createElement('canvas');
  c.width = pw;
  c.height = ph;
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.MeshBasicMaterial({ map: tex });
  const malla = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  const pantalla = { canvas: c, textura: tex };
  dibujarPantalla(pantalla, { tipo: 'apagada' });
  return { malla, pantalla };
}

/**
 * Dibuja en una pantalla. estado:
 *   { tipo: 'apagada' } · { tipo: 'post', lineas, visibles } · { tipo: 'listo', titulo }
 */
export function dibujarPantalla(pantalla, estado) {
  const { canvas, textura } = pantalla;
  const g = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  g.fillStyle = '#05070a';
  g.fillRect(0, 0, w, h);
  if (estado.tipo === 'apagada') {
    g.fillStyle = 'rgba(148,163,184,0.18)';
    g.font = `${Math.round(h * 0.05)}px "Roboto Mono", monospace`;
    g.textAlign = 'center';
    g.fillText(estado.texto || '', w / 2, h / 2);
  } else if (estado.tipo === 'post') {
    const tam = Math.round(h * 0.052);
    g.font = `${tam}px "Roboto Mono", monospace`;
    g.textAlign = 'left';
    estado.lineas.slice(0, estado.visibles).forEach((l, i) => {
      g.fillStyle = i === 0 ? '#22d3ee' : l.includes('OK') || l.includes('detect') ? '#a7f3d0' : '#cbd5e1';
      g.fillText(l, w * 0.06, h * 0.12 + i * tam * 1.45);
    });
  } else if (estado.tipo === 'listo') {
    const grad = g.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#0e7490');
    grad.addColorStop(1, '#6d28d9');
    g.fillStyle = grad;
    g.fillRect(0, 0, w, h);
    g.fillStyle = '#ffffff';
    g.textAlign = 'center';
    g.font = `bold ${Math.round(h * 0.11)}px Inter, Arial, sans-serif`;
    g.fillText(estado.titulo, w / 2, h * 0.47);
    g.globalAlpha = 0.85;
    g.font = `${Math.round(h * 0.05)}px Inter, Arial, sans-serif`;
    g.fillText(estado.sub || '', w / 2, h * 0.62);
    g.globalAlpha = 1;
  }
  textura.needsUpdate = true;
}

export function monitor() {
  const g = new THREE.Group();
  const negro = M(0x15171c, 0.4, 0.5);
  g.add(caja(1.5, 0.06, 0.9, negro, 0, 0.03, -0.15));
  g.add(caja(0.3, 1.5, 0.12, negro, 0, 0.8, -0.3));
  g.add(caja(4.9, 2.85, 0.14, negro, 0, 2.15, -0.2));
  const { malla, pantalla } = panel(4.65, 2.62, 1024, 576);
  malla.position.set(0, 2.17, -0.125);
  g.add(malla);
  dibujarPantalla(pantalla, { tipo: 'apagada', texto: 'Sin señal' });
  const luz = caja(0.06, 0.03, 0.02, M(0x1f2937, 0, 0.5, { emissive: 0x22c55e, emissiveIntensity: 0 }), 2.2, 0.8, -0.12);
  g.add(luz);
  g.userData.pantalla = pantalla;
  g.userData.luces = [luz.material];
  return g;
}

function texturaTeclado(w, h, { fondo = '#1b1e24', tecla = '#2b303a', letra = '#94a3b8', filas = 5, cols = 15 } = {}) {
  return lienzo(w, h, (c) => {
    c.fillStyle = fondo;
    c.fillRect(0, 0, w, h);
    const m = w * 0.03;
    const kw = (w - m * 2) / cols, kh = (h - m * 2) / filas;
    const letras = '1234567890QWERTYUIOPASDFGHJKLÑZXCVBNM';
    let n = 0;
    for (let f = 0; f < filas; f++) {
      for (let k = 0; k < cols; k++) {
        const x = m + k * kw + kw * 0.08, y = m + f * kh + kh * 0.1;
        let ancho = kw * 0.84;
        if (f === filas - 1 && k === 4) ancho = kw * 5.84; // barra espaciadora
        if (f === filas - 1 && k > 4 && k < 10) continue;
        c.fillStyle = tecla;
        c.fillRect(x, y, ancho, kh * 0.8);
        if (f > 0 && f < 4 && k > 0 && k < 11 && n < letras.length) {
          c.fillStyle = letra;
          c.font = `${Math.round(kh * 0.34)}px Inter, Arial`;
          c.fillText(letras[n++], x + kw * 0.18, y + kh * 0.45);
        }
      }
    }
  });
}

export function teclado() {
  const g = new THREE.Group();
  const tex = texturaTeclado(1024, 340);
  g.add(cajaConCara(3.6, 0.14, 1.2, M(0x1b1e24, 0.3, 0.55), 'py', tex, 0, 0.07, 0));
  return g;
}

export function mouse() {
  const g = new THREE.Group();
  const cuerpo = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 16), M(0x22262e, 0.3, 0.45));
  cuerpo.scale.set(0.36, 0.2, 0.6);
  cuerpo.position.y = 0.09;
  g.add(cuerpo);
  g.add(caja(0.012, 0.03, 0.26, M(0x0b0d10), 0, 0.185, -0.12));
  g.add(cil(0.03, 0.06, M(0x6b7280, 0.3, 0.5), 'x', 0, 0.19, -0.16, 12)); // rueda
  return g;
}

function rollo(color, conector) {
  const g = new THREE.Group();
  const mat = M(color, 0.2, 0.6);
  for (let i = 0; i < 3; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.42 - i * 0.03, 0.035, 8, 36), mat);
    t.rotation.x = Math.PI / 2;
    t.position.y = 0.04 + i * 0.07;
    g.add(t);
  }
  g.add(conector);
  return g;
}

export function cableHdmi() {
  const c = new THREE.Group();
  c.add(caja(0.26, 0.1, 0.16, M(0x16181d, 0.3, 0.5), 0.55, 0.08, 0));
  c.add(caja(0.12, 0.06, 0.14, M(0xb8bdc6, 0.9, 0.3), 0.74, 0.08, 0));
  return rollo(0x16181d, c);
}

export function cableCorriente() {
  const c = new THREE.Group();
  c.add(caja(0.26, 0.14, 0.2, M(0x101114, 0.2, 0.6), 0.56, 0.09, 0));
  const pata = M(0xd1d5db, 0.9, 0.3);
  c.add(caja(0.12, 0.08, 0.02, pata, 0.74, 0.09, 0.05));
  c.add(caja(0.12, 0.08, 0.02, pata, 0.74, 0.09, -0.05));
  return rollo(0x101114, c);
}

// ─── Laptop ──────────────────────────────────────────────────────────────────

const ALUMINIO = 0x9aa3ad;

export function laptopBase() {
  const g = new THREE.Group();
  const alu = M(ALUMINIO, 0.75, 0.35);
  g.add(caja(5.2, 0.05, 3.6, alu, 0, 0.025, 0));
  g.add(caja(5.1, 0.01, 3.5, M(0x1a1e26, 0.3, 0.7), 0, 0.055, 0));
  g.add(caja(5.2, 0.34, 0.05, alu, 0, 0.17, 1.775));
  g.add(caja(5.2, 0.34, 0.05, alu, 0, 0.17, -1.775));
  g.add(caja(0.05, 0.34, 3.6, alu, 2.575, 0.17, 0));
  g.add(caja(0.05, 0.34, 3.6, alu, -2.575, 0.17, 0));
  const negro = M(0x0b0d10, 0.2, 0.8);
  // Puertos del costado izquierdo: USB-C (cargador), USB-A y audio.
  g.add(caja(0.02, 0.06, 0.18, negro, -2.605, 0.2, -0.9));
  g.add(caja(0.02, 0.09, 0.26, negro, -2.605, 0.2, -0.4));
  g.add(cil(0.04, 0.02, negro, 'x', -2.605, 0.2, 0.1, 12));
  g.add(caja(0.02, 0.09, 0.26, negro, 2.605, 0.2, -0.6)); // USB-A derecho
  // Rejilla trasera.
  for (let i = 0; i < 12; i++) g.add(caja(0.06, 0.12, 0.02, negro, -2.3 + i * 0.12, 0.2, -1.8));
  // Bisagras.
  for (const x of [-1.9, 1.9]) g.add(cil(0.1, 0.7, M(0x3b4250, 0.8, 0.3), 'x', x, 0.4, -1.8, 16));
  // Bocinas a los lados de la batería.
  for (const x of [-2.25, 2.25]) g.add(caja(0.35, 0.08, 1.0, M(0x2b303b, 0.3, 0.7), x, 0.1, 0.95));
  return g;
}

export function placaLaptop() {
  const g = new THREE.Group();
  const pcb = lienzo(512, 256, (c, w, h) => {
    c.fillStyle = '#16241c';
    c.fillRect(0, 0, w, h);
    c.strokeStyle = 'rgba(120,200,160,0.18)';
    c.lineWidth = 2;
    for (let i = 0; i < 45; i++) {
      c.beginPath();
      c.moveTo(Math.random() * w, Math.random() * h);
      c.lineTo(Math.random() * w, Math.random() * h);
      c.stroke();
    }
  });
  g.add(cajaConCara(2.8, 0.04, 1.3, M(0x16241c, 0.3, 0.6), 'py', pcb));
  // Procesador soldado.
  g.add(caja(0.55, 0.02, 0.55, M(0x1f5130, 0.3, 0.5), 0, 0.03, -0.05));
  g.add(caja(0.34, 0.025, 0.3, M(0xc8cdd4, 0.85, 0.3), 0, 0.045, -0.05));
  const negro = M(0x111317, 0.3, 0.6);
  g.add(caja(1.15, 0.05, 0.12, negro, 0.9, 0.045, -0.3)); // ranura SO-DIMM
  g.add(caja(0.08, 0.04, 0.22, negro, 0.0, 0.04, 0.45)); // ranura M.2
  for (let i = 0; i < 5; i++) g.add(caja(0.18, 0.03, 0.18, negro, -1.0 + (i % 3) * 0.25, 0.035, 0.3 - Math.floor(i / 3) * 0.3));
  g.add(caja(0.2, 0.05, 0.08, M(0xe5e7eb, 0.1, 0.5), 0.3, 0.045, 0.6)); // conector de batería
  return g;
}

export function ventiladorLaptop() {
  const g = new THREE.Group();
  g.add(cil(0.45, 0.14, M(0x1c1f25, 0.4, 0.5), 'y', 0, 0, 0, 28));
  const a = aspas(0.36, 'y', M(0x374151, 0.3, 0.5));
  a.position.y = 0.08;
  g.add(a);
  const cobre = M(0xb87333, 0.9, 0.3);
  g.add(caja(1.3, 0.04, 0.1, cobre, 1.0, 0.02, 0.0));
  g.add(caja(1.3, 0.04, 0.1, cobre, 1.0, 0.02, -0.14));
  g.add(caja(0.5, 0.03, 0.5, cobre, 1.55, -0.02, -0.05));
  g.userData.ventiladores = [a.userData.giro];
  return g;
}

export function soDimm() {
  const g = new THREE.Group();
  const cara = etiqueta('SO-DIMM', { fondo: '#1f5130', color: '#e2e8f0', w: 256, h: 128, tam: 26, sub: 'DDR5 · 8 GB' });
  g.add(cajaConCara(1.1, 0.03, 0.5, M(0x1f5130, 0.3, 0.5), 'py', cara));
  const chip = M(0x111317, 0.3, 0.6);
  for (let i = 0; i < 4; i++) g.add(caja(0.16, 0.02, 0.14, chip, -0.36 + i * 0.24, 0.025, 0.12));
  g.add(caja(1.0, 0.032, 0.05, M(0xd4a017, 0.9, 0.3), 0, 0, -0.24));
  return g;
}

export function ssdLaptop() {
  const g = new THREE.Group();
  const cara = etiqueta('SSD', { fondo: '#111827', color: '#e2e8f0', w: 256, h: 64, tam: 24, sub: 'M.2 · 512 GB' });
  g.add(cajaConCara(0.75, 0.025, 0.2, M(0x111827, 0.4, 0.5), 'py', cara));
  g.add(caja(0.05, 0.03, 0.18, M(0xd4a017, 0.9, 0.3), 0.39, 0, 0));
  return g;
}

export function bateria() {
  const g = new THREE.Group();
  const cara = etiqueta('BATERÍA Li-ion', { fondo: '#1b1e24', color: '#fbbf24', w: 512, h: 160, tam: 40, sub: 'No perforar · No calentar' });
  g.add(cajaConCara(4.2, 0.14, 1.2, M(0x1b1e24, 0.3, 0.6), 'py', cara));
  g.add(caja(0.25, 0.04, 0.3, M(0xe5e7eb, 0.1, 0.5), -0.2, 0.05, -0.72)); // conector
  return g;
}

export function reposamanos() {
  const g = new THREE.Group();
  // Cubierta de aluminio con el hueco del trackpad y el área del teclado.
  const tex = lienzo(1024, 710, (c, w, h) => {
    c.fillStyle = '#a8b1bc';
    c.fillRect(0, 0, w, h);
    const tk = texturaTeclado(820, 300, { fondo: '#1f232b', tecla: '#2c313b', letra: '#cbd5e1' }).image;
    c.drawImage(tk, (w - 820) / 2, h * 0.07);
    // Hueco del trackpad (las medidas coinciden con la pieza trackpad).
    c.fillStyle = '#20242b';
    const tw = (1.8 / 5.2) * w, th = (0.95 / 3.6) * h;
    c.fillRect(w / 2 - tw / 2, h * (0.5 + 1.0 / 3.6) - th / 2, tw, th);
  });
  // Retroiluminación: solo brillan las teclas, no el aluminio.
  const brillo = lienzo(1024, 710, (c, w, h) => {
    c.fillStyle = '#000';
    c.fillRect(0, 0, w, h);
    const tk = texturaTeclado(820, 300, { fondo: '#000', tecla: '#0e3440', letra: '#b5f3ff' }).image;
    c.drawImage(tk, (w - 820) / 2, h * 0.07);
  });
  const mat = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.55, roughness: 0.4, emissive: 0xffffff, emissiveMap: brillo, emissiveIntensity: 0 });
  const mats = Array.from({ length: 6 }, () => M(ALUMINIO, 0.75, 0.35));
  mats[2] = mat;
  g.add(new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.06, 3.6), mats));
  g.userData.luces = [mat];
  return g;
}

export function trackpad() {
  const g = new THREE.Group();
  g.add(caja(1.75, 0.025, 0.92, M(0x2b2f36, 0.2, 0.3)));
  return g;
}

export function pantallaLaptop() {
  // Origen en la bisagra; cerrada, la tapa se extiende hacia +z.
  const g = new THREE.Group();
  const logo = lienzo(512, 350, (c, w, h) => {
    c.fillStyle = '#a8b1bc';
    c.fillRect(0, 0, w, h);
    c.fillStyle = 'rgba(255,255,255,0.55)';
    c.font = 'bold 44px Inter, Arial';
    c.textAlign = 'center';
    c.fillText('BGO', w / 2, h / 2 + 15);
  });
  g.add(cajaConCara(5.2, 0.08, 3.5, M(ALUMINIO, 0.75, 0.35), 'py', logo, 0, 0.04, 1.75));
  g.add(caja(5.1, 0.005, 3.4, M(0x0b0d10, 0.2, 0.6), 0, -0.003, 1.75)); // marco negro
  const { malla, pantalla } = panel(4.85, 3.05, 1024, 644);
  malla.rotation.x = Math.PI / 2;
  malla.position.set(0, -0.007, 1.8);
  g.add(malla);
  g.userData.pantalla = pantalla;
  return g;
}

export function cargador() {
  const c = new THREE.Group();
  c.add(caja(0.2, 0.06, 0.1, M(0x16181d, 0.3, 0.5), 0.55, 0.06, 0));
  const g = rollo(0x16181d, c);
  g.add(caja(0.8, 0.22, 0.5, M(0x16181d, 0.3, 0.55), -0.1, 0.11, 0.75)); // eliminador
  return g;
}

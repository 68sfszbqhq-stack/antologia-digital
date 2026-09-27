// Motor del taller 3D: escena, cámara, arrastre y encaje de piezas.
//
// Lo usa src/components/TallerEnsamble.jsx, que lo carga con import()
// solo cuando el alumno abre el taller: three.js pesa bastante y no tiene caso
// que lo descargue quien solo viene a leer la sesión.
//
// Cómo se juega, visto desde aquí:
//   · Un dedo (o el mouse) sobre una pieza suelta → se arrastra flotando a una
//     altura fija sobre la mesa.
//   · Un dedo sobre el fondo o sobre algo ya instalado → gira la cámara.
//     Dos dedos → zoom y desplazamiento. Eso lo hace OrbitControls.
//   · Al soltar, se busca la ranura libre más cercana. Si es la de esa pieza y
//     ya está lo que requiere, encaja. Si no, se explica por qué y regresa.
//   · Un toque sin arrastrar sobre cualquier pieza → su ficha informativa.
//
// El motor no dibuja interfaz: todo lo que el alumno lee lo pinta el
// componente de React a partir de los eventos que se emiten con onEvento.

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as modelos from './modelos.js';
import { ARMADOS } from './armados.js';

const MESA = { x: 9.8, z: 5.6 }; // hasta dónde se puede soltar algo

const suave = (k) => 1 - Math.pow(1 - k, 3);
const suaveDoble = (k) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
const quat = (r = [0, 0, 0]) => new THREE.Quaternion().setFromEuler(new THREE.Euler(r[0], r[1], r[2]));

/** ¿Este navegador puede dibujar 3D? Se pregunta antes de descargar nada más. */
export function hayWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function crearTaller(contenedor, { armado = 'escritorio', guia = true, onEvento = () => {} }) {
  const A = ARMADOS[armado];
  const emitir = (tipo, datos = {}) => onEvento({ tipo, ...datos });
  const tactil = window.matchMedia?.('(pointer: coarse)').matches;

  // ─── Render, escena, cámara ──────────────────────────────────────────────
  const renderer = new THREE.WebGLRenderer({ antialias: (window.devicePixelRatio || 1) < 2 });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, tactil ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  // Sombras solo en computadora: en un teléfono de gama baja cuestan más
  // cuadros por segundo de lo que aportan.
  renderer.shadowMap.enabled = !tactil;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const canvas = renderer.domElement;
  canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:none;outline:none';
  contenedor.appendChild(canvas);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0b1220);
  scene.fog = new THREE.Fog(0x0b1220, 40, 75);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 200);

  scene.add(new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 1.3));
  const sol = new THREE.DirectionalLight(0xffffff, 2.0);
  sol.position.set(6, 16, 9);
  sol.castShadow = true;
  sol.shadow.mapSize.set(2048, 2048);
  Object.assign(sol.shadow.camera, { left: -12, right: 12, top: 9, bottom: -9, near: 1, far: 40 });
  sol.shadow.bias = -0.0008;
  scene.add(sol);
  const relleno = new THREE.DirectionalLight(0x93c5fd, 0.6);
  relleno.position.set(-8, 6, -6);
  scene.add(relleno);

  scene.add(modelos.mesa());

  // ─── Lo que ya está en la mesa ───────────────────────────────────────────
  const fijos = {};
  const regleta = modelos.regleta();
  regleta.position.set(A.regleta[0], 0, A.regleta[1]);
  regleta.userData.fijo = 'regleta';
  scene.add(regleta);
  fijos.regleta = regleta;

  let fase = 'armado';
  if (armado === 'escritorio') {
    const gab = modelos.gabinete();
    gab.userData.fijo = 'gabinete';
    ponerGabinete(gab, A.gabinete.acostado);
    scene.add(gab);
    fijos.gabinete = gab;
  } else {
    const base = modelos.laptopBase();
    base.userData.fijo = 'laptop';
    base.position.set(...A.laptop.pos);
    scene.add(base);
    fijos.laptop = base;
  }

  function ponerGabinete(gab, p) {
    gab.position.set(...p.pos);
    gab.rotation.set(0, p.rotY, p.rotZ);
  }

  // ─── Piezas y ranuras ────────────────────────────────────────────────────
  const ranuras = A.pasos.map((paso) => ({ paso, id: paso.id, tipo: paso.tipo || paso.id, ocupada: false }));
  const ranuraPorId = Object.fromEntries(ranuras.map((r) => [r.id, r]));

  const piezas = A.pasos.map((paso) => {
    const obj = modelos[paso.modelo]();
    obj.userData.piezaId = paso.id;
    scene.add(obj);
    return { paso, id: paso.id, tipo: paso.tipo || paso.id, obj, instalada: false, ocupada: false, reposo: new THREE.Vector3(), quatBandeja: new THREE.Quaternion(), altoReposo: 0 };
  });
  const piezaPorId = Object.fromEntries(piezas.map((p) => [p.id, p]));

  function padreDe(en) {
    if (en === 'mundo') return scene;
    return fijos[en];
  }

  /** Dónde queda una ranura en el mundo, con el gabinete como esté ahorita. */
  function poseDestino(r) {
    const padre = padreDe(r.paso.en);
    padre.updateWorldMatrix(true, false);
    const pos = new THREE.Vector3(...r.paso.pos).applyMatrix4(padre.matrixWorld);
    const q = padre.getWorldQuaternion(new THREE.Quaternion()).multiply(quat(r.paso.rot));
    return { pos, quat: q };
  }

  function anclaMundo(a) {
    const base = a.en === 'pieza' ? piezaPorId[a.id].obj : padreDe(a.en);
    base.updateWorldMatrix(true, false);
    return new THREE.Vector3(...a.pos).applyMatrix4(base.matrixWorld);
  }

  for (const p of piezas) {
    const q = p.paso.rotBandeja ? quat(p.paso.rotBandeja) : poseDestino(ranuraPorId[p.id]).quat;
    p.obj.quaternion.copy(q);
    p.obj.position.set(0, 0, 0);
    p.obj.updateMatrixWorld(true);
    const caja = new THREE.Box3().setFromObject(p.obj);
    p.altoReposo = -caja.min.y + 0.01;
    p.obj.position.set(p.paso.bandeja[0], p.altoReposo, p.paso.bandeja[1]);
    p.reposo.copy(p.obj.position);
    p.quatBandeja.copy(q);
  }

  // Zona de agarre invisible: una caja un poco más grande que cada pieza.
  // Sin ella, agarrar un rollo de cable o una memoria delgada con el dedo es
  // cuestión de suerte (el dedo cae en el hueco o junto al borde).
  const matAgarre = new THREE.MeshBasicMaterial({ visible: false });
  const minAgarre = tactil ? 0.8 : 0.5; // un dedo es más grueso que un puntero
  for (const p of piezas) {
    const q = p.obj.quaternion.clone(), pos = p.obj.position.clone();
    p.obj.quaternion.identity();
    p.obj.position.set(0, 0, 0);
    p.obj.updateMatrixWorld(true);
    const caja = new THREE.Box3().setFromObject(p.obj);
    const tam = caja.getSize(new THREE.Vector3());
    const zona = new THREE.Mesh(
      new THREE.BoxGeometry(Math.max(tam.x, minAgarre) + 0.15, Math.max(tam.y, minAgarre) + 0.15, Math.max(tam.z, minAgarre) + 0.15),
      matAgarre,
    );
    caja.getCenter(zona.position);
    zona.userData.agarre = true;
    p.obj.add(zona);
    p.obj.quaternion.copy(q);
    p.obj.position.copy(pos);
  }

  const conSombra = (o) => o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
  piezas.forEach((p) => conSombra(p.obj));
  Object.values(fijos).forEach(conSombra);

  // ─── Animaciones cortas ──────────────────────────────────────────────────
  let animaciones = [];
  function animar(dur, paso, fin) {
    animaciones.push({ dur, t: 0, paso, fin });
  }

  // ─── Cámara ──────────────────────────────────────────────────────────────
  // Los listeners propios se registran ANTES de crear OrbitControls: así, al
  // tocar una pieza, se apagan los controles antes de que ellos reciban el
  // mismo toque y la cámara no gira mientras se arrastra.
  canvas.addEventListener('pointerdown', alBajar);
  canvas.addEventListener('pointermove', alMover);
  canvas.addEventListener('pointerup', alSubir);
  canvas.addEventListener('pointercancel', alCancelar);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.09;
  controls.minDistance = 4;
  controls.maxDistance = 48;
  controls.minPolarAngle = 0.12;
  controls.maxPolarAngle = 1.32;
  controls.screenSpacePanning = false;
  controls.touches = { ONE: THREE.TOUCH.ROTATE, TWO: THREE.TOUCH.DOLLY_PAN };

  // Cómo se ve la mesa. En pantalla horizontal, de frente. En un teléfono
  // vertical la mesa (que es más ancha que profunda) no cabe de frente sin que
  // todo se vuelva diminuto; en las fases marcadas con ladoMovil la cámara se
  // pone de COSTADO, casi desde arriba, y lo largo de la mesa queda a lo alto
  // de la pantalla.
  const PROFUNDIDAD_MESA = 11.5;
  function encuadrar(conAnimacion = true) {
    const f = A.fases[fase];
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const tanH = tanV * camera.aspect;
    const objetivo = new THREE.Vector3(...f.objetivo);
    let dir, dist;
    if (camera.aspect < 1 && f.ladoMovil) {
      dir = new THREE.Vector3(0.36, 0.93, 0).normalize();
      dist = Math.max(PROFUNDIDAD_MESA / 2 / tanH, (f.ancho * 0.93) / 2 / tanV);
      objetivo.z = 0;
    } else {
      const ancho = camera.aspect < 1 ? f.anchoMovil : f.ancho;
      dir = new THREE.Vector3(0, 0.8, 0.6).normalize();
      dist = ancho / 2 / tanH;
      // En pantallas anchas la lista de pasos ocupa el costado derecho: se
      // corre la vista para que no tape las piezas de ese lado.
      if (contenedor.clientWidth >= 1024) objetivo.x += ancho * 0.11;
    }
    dist = THREE.MathUtils.clamp(dist, 8, 40);
    const destino = objetivo.clone().addScaledVector(dir, dist);
    if (!conAnimacion) {
      camera.position.copy(destino);
      controls.target.copy(objetivo);
      controls.update();
      return;
    }
    const p0 = camera.position.clone(), t0 = controls.target.clone();
    animar(0.9, (k) => {
      const e = suaveDoble(k);
      camera.position.lerpVectors(p0, destino, e);
      controls.target.lerpVectors(t0, objetivo, e);
    });
  }

  // ─── Fantasmas: la silueta verde de dónde va la pieza ────────────────────
  let fantasmas = [];
  function mostrarFantasmas(p) {
    if (!guia) return;
    for (const r of ranuras) {
      if (r.ocupada || r.tipo !== p.tipo) continue;
      const lista = r.paso.requiere.every((id) => ranuraPorId[id].ocupada);
      const mat = new THREE.MeshBasicMaterial({ color: lista ? 0x34d399 : 0xf87171, transparent: true, opacity: 0.25, depthWrite: false });
      const f = p.obj.clone(true);
      f.traverse((o) => {
        if (o.userData.agarre) o.visible = false;
        else if (o.isMesh) { o.material = mat; o.castShadow = false; o.receiveShadow = false; }
      });
      f.scale.setScalar(1);
      const d = poseDestino(r);
      f.position.copy(d.pos);
      f.quaternion.copy(p.paso.ocultar ? p.obj.quaternion : d.quat);
      scene.add(f);
      fantasmas.push({ f, r, mat });
    }
  }
  function quitarFantasmas() {
    fantasmas.forEach(({ f, mat }) => { scene.remove(f); mat.dispose(); });
    fantasmas = [];
  }

  // ─── Cables ──────────────────────────────────────────────────────────────
  function dibujarCable({ a, b, color }) {
    const pa = anclaMundo(a), pb = anclaMundo(b);
    const bajo = 0.05;
    const puntos = [
      pa,
      new THREE.Vector3(pa.x, Math.max(bajo, pa.y * 0.35), pa.z),
      new THREE.Vector3((pa.x + pb.x) / 2, bajo, (pa.z + pb.z) / 2),
      new THREE.Vector3(pb.x, Math.max(bajo, pb.y * 0.35), pb.z),
      pb,
    ];
    const curva = new THREE.CatmullRomCurve3(puntos);
    const tubo = new THREE.Mesh(new THREE.TubeGeometry(curva, 64, 0.04, 8, false), new THREE.MeshStandardMaterial({ color, roughness: 0.6 }));
    tubo.castShadow = true;
    scene.add(tubo);
  }

  // ─── Arrastre ────────────────────────────────────────────────────────────
  const rayo = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let gesto = null;

  function apuntar(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    rayo.setFromCamera(ndc, camera);
  }

  function queHayBajo(e) {
    apuntar(e);
    // Las piezas instaladas cuelgan del gabinete o de la laptop, así que el
    // recorrido hacia arriba encuentra primero la pieza y luego el fijo.
    const objetos = piezas.filter((p) => p.obj.visible && p.obj.parent === scene).map((p) => p.obj).concat(Object.values(fijos));
    for (const hit of rayo.intersectObjects(objetos, true)) {
      let o = hit.object;
      while (o) {
        if (o.userData.piezaId) return { pieza: piezaPorId[o.userData.piezaId] };
        if (o.userData.fijo) return { fijo: o.userData.fijo };
        o = o.parent;
      }
    }
    return null;
  }

  function puntoEnPlano(e, altura) {
    apuntar(e);
    const v = new THREE.Vector3();
    return rayo.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0, 1, 0), -altura), v) ? v : null;
  }

  function alBajar(e) {
    if (gesto) { gesto.variosDedos = true; return; }
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const h = queHayBajo(e);
    if (!h) return;
    gesto = { ...h, id: e.pointerId, x0: e.clientX, y0: e.clientY, arrastrando: false };
    // Las piezas instaladas y el gabinete dejan girar la cámara; solo se
    // arrastra una pieza suelta que no se esté moviendo ya sola.
    if (h.pieza && !h.pieza.instalada && !h.pieza.ocupada) {
      gesto.arrastrable = true;
      gesto.inicio = e;
      controls.enabled = false;
      try { canvas.setPointerCapture(e.pointerId); } catch { /* algunos navegadores viejos */ }
    }
  }

  function alMover(e) {
    if (!gesto || e.pointerId !== gesto.id) return;
    const movido = Math.hypot(e.clientX - gesto.x0, e.clientY - gesto.y0);
    if (!gesto.arrastrando) {
      if (!gesto.arrastrable || movido < 6) return;
      const p = gesto.pieza;
      const altura = p.paso.alturaArrastre ?? A.alturaArrastre;
      const agarre = puntoEnPlano(gesto.inicio, p.obj.position.y);
      gesto.arrastrando = true;
      gesto.altura = altura;
      gesto.desfase = agarre ? new THREE.Vector3(p.obj.position.x - agarre.x, 0, p.obj.position.z - agarre.z) : new THREE.Vector3();
      if (gesto.desfase.length() > 1.2) gesto.desfase.setLength(1.2);
      gesto.objetivo = p.obj.position.clone();
      mostrarFantasmas(p);
      emitir('agarrar', { paso: p.paso });
    }
    const v = puntoEnPlano(e, gesto.altura);
    if (!v) return;
    gesto.objetivo.set(
      THREE.MathUtils.clamp(v.x + gesto.desfase.x, -MESA.x, MESA.x),
      gesto.altura,
      THREE.MathUtils.clamp(v.z + gesto.desfase.z, -MESA.z, MESA.z),
    );
  }

  function soltarGesto(e) {
    try { canvas.releasePointerCapture(e.pointerId); } catch { /* nada */ }
    controls.enabled = true;
    gesto = null;
  }

  function alSubir(e) {
    if (!gesto || e.pointerId !== gesto.id) return;
    const g = gesto;
    soltarGesto(e);
    if (g.arrastrando) return soltar(g.pieza);
    if (!g.variosDedos && Math.hypot(e.clientX - g.x0, e.clientY - g.y0) < 6) {
      if (g.pieza) emitir('info', { paso: g.pieza.paso });
      else emitir('info', { fijo: A.fijos[g.fijo] });
    }
  }

  function alCancelar(e) {
    if (!gesto || e.pointerId !== gesto.id) return;
    const g = gesto;
    soltarGesto(e);
    if (g.arrastrando) { quitarFantasmas(); regresar(g.pieza); }
  }

  // ─── Soltar: encaja, se explica o se queda en la mesa ────────────────────
  function listaParaInstalar(r) {
    return r.paso.requiere.every((id) => ranuraPorId[id].ocupada);
  }

  function soltar(p) {
    quitarFantasmas();
    emitir('soltar', { paso: p.paso });
    const pos = p.obj.position;
    let mejor = null, otra = null;
    for (const r of ranuras) {
      if (r.ocupada) continue;
      const d0 = poseDestino(r).pos;
      const d = Math.hypot(pos.x - d0.x, pos.z - d0.z);
      if (d > (r.paso.radio ?? 0.8)) continue;
      if (r.tipo === p.tipo) { if (!mejor || d < mejor.d) mejor = { r, d }; }
      else if (listaParaInstalar(r) && (!otra || d < otra.d)) otra = { r, d };
    }

    // Si cayó en el lugar de otra pieza pero SU lugar está cerca y todavía no
    // se puede usar, es más útil explicar eso que decir "ahí no va".
    if (!mejor && otra) {
      const propia = ranuras
        .filter((r) => !r.ocupada && r.tipo === p.tipo && !listaParaInstalar(r))
        .map((r) => { const d0 = poseDestino(r).pos; return { r, d: Math.hypot(pos.x - d0.x, pos.z - d0.z) }; })
        .sort((a, b) => a.d - b.d)[0];
      if (propia && propia.d < (propia.r.paso.radio ?? 0.8) * 2 + 0.8) mejor = propia;
    }

    if (mejor) {
      if (!listaParaInstalar(mejor.r)) {
        emitir('error', { mensaje: mejor.r.paso.motivo || 'Todavía no: falta instalar algo antes.', paso: p.paso });
        return regresar(p);
      }
      return instalar(p, mejor.r);
    }
    if (otra) {
      emitir('error', { mensaje: `Ahí no va. Ese lugar es para: ${otra.r.paso.nombre}.`, paso: p.paso });
      return regresar(p);
    }
    if (sobreLaEstructura(pos)) {
      emitir('aviso', { mensaje: guia ? 'Casi: acércala a la silueta verde.' : 'Ese no es su lugar exacto. Intenta de nuevo.' });
      return regresar(p);
    }
    // Suelta en la mesa, donde el alumno quiso.
    p.ocupada = true;
    const desde = pos.clone();
    const hasta = new THREE.Vector3(pos.x, p.altoReposo, pos.z);
    animar(0.35, (k) => p.obj.position.lerpVectors(desde, hasta, k * k), () => { p.ocupada = false; });
  }

  function sobreLaEstructura(pos) {
    const est = fijos.gabinete || fijos.laptop;
    const caja = new THREE.Box3().setFromObject(est).expandByScalar(0.3);
    return pos.x > caja.min.x && pos.x < caja.max.x && pos.z > caja.min.z && pos.z < caja.max.z;
  }

  function regresar(p) {
    p.ocupada = true;
    const desde = p.obj.position.clone(), q0 = p.obj.quaternion.clone();
    const alto = Math.max(desde.y, p.reposo.y) + 1;
    animar(0.55, (k) => {
      const e = suave(k);
      p.obj.position.lerpVectors(desde, p.reposo, e);
      p.obj.position.y = (1 - e) * (1 - e) * desde.y + 2 * (1 - e) * e * alto + e * e * p.reposo.y;
      p.obj.quaternion.slerpQuaternions(q0, p.quatBandeja, e);
    }, () => { p.ocupada = false; });
  }

  function instalar(p, r) {
    p.ocupada = true;
    p.instalada = true;
    r.ocupada = true;
    const destino = poseDestino(r);
    const desde = p.obj.position.clone(), q0 = p.obj.quaternion.clone();
    const alto = Math.max(desde.y, destino.pos.y) + 0.3;
    animar(0.45, (k) => {
      const e = suave(k);
      p.obj.position.lerpVectors(desde, destino.pos, e);
      p.obj.position.y = (1 - e) * (1 - e) * desde.y + 2 * (1 - e) * e * alto + e * e * destino.pos.y;
      if (p.paso.ocultar) p.obj.scale.setScalar(1 - e * 0.85);
      else p.obj.quaternion.slerpQuaternions(q0, destino.quat, e);
    }, () => {
      padreDe(r.paso.en).attach(p.obj);
      p.obj.position.set(...r.paso.pos);
      p.obj.quaternion.copy(quat(r.paso.rot));
      if (p.paso.ocultar) p.obj.visible = false;
      if (r.paso.cable) dibujarCable(r.paso.cable);
      p.ocupada = false;
      emitir('instalado', { paso: p.paso, hechos: ranuras.filter((x) => x.ocupada).map((x) => x.id) });
      if (r.paso.alInstalar === 'levantar') levantarGabinete();
      else revisarFin();
    });
  }

  function levantarGabinete() {
    const gab = fijos.gabinete;
    const a = A.gabinete.acostado, b = A.gabinete.parado;
    const pa = new THREE.Vector3(...a.pos), pb = new THREE.Vector3(...b.pos);
    emitir('aviso', { mensaje: 'Gabinete cerrado. Ahora lo ponemos de pie para conectar los periféricos.' });
    fase = 'escritorio';
    encuadrar(true);
    animar(1.6, (k) => {
      const e = suaveDoble(k);
      gab.position.lerpVectors(pa, pb, e);
      gab.position.y += Math.sin(Math.PI * k) * 2.2;
      gab.rotation.set(0, a.rotY + (b.rotY - a.rotY) * e, a.rotZ + (b.rotZ - a.rotZ) * e);
    }, () => {
      emitir('fase', { fase });
      revisarFin();
    });
  }

  function revisarFin() {
    if (!ranuras.every((r) => r.ocupada)) return;
    // Todo armado: la cámara va al frente, a donde se verá la pantalla.
    if (A.fases.final) { fase = 'final'; encuadrar(true); }
    emitir('listo');
  }

  // ─── Encender ────────────────────────────────────────────────────────────
  let encendido = false;
  const temporizadores = [];
  function encender() {
    if (encendido || !ranuras.every((r) => r.ocupada)) return;
    encendido = true;
    const luces = [];
    const buscar = (o) => o.traverse((m) => { if (m.userData.luces) luces.push(...m.userData.luces); });
    Object.values(fijos).forEach(buscar);
    piezas.forEach((p) => buscar(p.obj));
    animar(0.8, (k) => luces.forEach((m) => { m.emissiveIntensity = k * 1.4; }));

    const conPantalla = piezas.find((p) => p.obj.userData.pantalla);
    const pantalla = conPantalla?.obj.userData.pantalla;
    if (!pantalla) return emitir('encendido');
    const lineas = A.post;
    lineas.forEach((_, i) => {
      temporizadores.push(setTimeout(() => modelos.dibujarPantalla(pantalla, { tipo: 'post', lineas, visibles: i + 1 }), 500 + i * 280));
    });
    temporizadores.push(setTimeout(() => {
      modelos.dibujarPantalla(pantalla, { tipo: 'listo', titulo: '¡Funciona!', sub: `Armaste ${A.titulo.replace('tu ', 'tu propia ')}` });
      emitir('encendido');
    }, 900 + lineas.length * 280));
  }

  const ventiladores = () => {
    const v = [];
    piezas.forEach((p) => p.obj.traverse((o) => { if (o.userData.ventiladores) v.push(...o.userData.ventiladores); }));
    return v;
  };
  let listaVentiladores = [];

  // ─── Ciclo de dibujo ─────────────────────────────────────────────────────
  const reloj = new THREE.Clock();
  let tiempo = 0;
  function cuadro() {
    const dt = Math.min(reloj.getDelta(), 0.05);
    tiempo += dt;

    if (animaciones.length) {
      // Se cambia la lista antes de recorrerla: una animación puede crear
      // otra al terminar, y esa nueva debe empezar en el siguiente cuadro.
      const actuales = animaciones;
      animaciones = [];
      for (const a of actuales) {
        a.t += dt;
        const k = Math.min(1, a.t / a.dur);
        a.paso(k);
        if (k >= 1) a.fin?.(); else animaciones.push(a);
      }
    }

    if (gesto?.arrastrando) {
      const o = gesto.pieza.obj;
      o.position.lerp(gesto.objetivo, 1 - Math.exp(-dt * 20));
      // La silueta más cercana se enciende más: "aquí, aquí".
      for (const f of fantasmas) {
        const d0 = poseDestino(f.r).pos;
        const cerca = Math.hypot(o.position.x - d0.x, o.position.z - d0.z) < (f.r.paso.radio ?? 0.8);
        f.mat.opacity = cerca ? 0.55 : 0.18 + Math.sin(tiempo * 5) * 0.07;
      }
    }

    if (encendido) {
      if (!listaVentiladores.length) listaVentiladores = ventiladores();
      listaVentiladores.forEach((g) => { g.rotation.y += dt * 22; });
    }

    // Que la cámara no se vaya lejos de la mesa al desplazarla.
    controls.target.x = THREE.MathUtils.clamp(controls.target.x, -9, 9);
    controls.target.z = THREE.MathUtils.clamp(controls.target.z, -6, 6);
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, 0, 4);
    controls.update();
    renderer.render(scene, camera);
  }

  let primerTamano = true;
  let eraVertical = null;
  const ro = new ResizeObserver(() => {
    const w = contenedor.clientWidth, h = contenedor.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Primera vez, o el teléfono se giró: volver a encuadrar.
    const vertical = w < h;
    if (primerTamano || vertical !== eraVertical) { primerTamano = false; encuadrar(false); }
    eraVertical = vertical;
  });
  ro.observe(contenedor);
  renderer.setAnimationLoop(cuadro);

  emitir('progreso', { hechos: [] });

  /** Solo para pruebas: dónde se ve en pantalla una pieza o su ranura. */
  function enPantalla(v) {
    const r = canvas.getBoundingClientRect();
    const p = v.clone().project(camera);
    return { x: Math.round(r.left + ((p.x + 1) / 2) * r.width), y: Math.round(r.top + ((1 - p.y) / 2) * r.height) };
  }

  return {
    depurar: {
      pieza: (id) => enPantalla(new THREE.Box3().setFromObject(piezaPorId[id].obj).getCenter(new THREE.Vector3())),
      ranura: (id) => enPantalla(poseDestino(ranuraPorId[id]).pos),
      // Dónde soltar: la ranura vista a la altura a la que flota la pieza.
      soltarEn: (id, piezaId = id) => {
        const v = poseDestino(ranuraPorId[id]).pos;
        v.y = piezaPorId[piezaId].paso.alturaArrastre ?? A.alturaArrastre;
        return enPantalla(v);
      },
      pos: (id) => piezaPorId[id].obj.getWorldPosition(new THREE.Vector3()).toArray().map((n) => +n.toFixed(2)),
      queHay: (x, y) => { const h = queHayBajo({ clientX: x, clientY: y }); return h?.pieza?.id || h?.fijo || null; },
    },
    encuadrar: () => encuadrar(true),
    encender,
    /** Foto de la escena tal como se ve. Se dibuja y se lee en el mismo
     *  instante: sin eso el canvas de WebGL ya viene borrado. */
    captura() {
      renderer.render(scene, camera);
      return canvas.toDataURL('image/jpeg', 0.9);
    },
    destruir() {
      renderer.setAnimationLoop(null);
      temporizadores.forEach(clearTimeout);
      ro.disconnect();
      controls.dispose();
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : o.material ? [o.material] : [];
        mats.forEach((m) => { m.map?.dispose(); m.emissiveMap?.dispose(); m.dispose(); });
      });
      modelos.limpiarCache();
      renderer.dispose();
      renderer.forceContextLoss?.();
      canvas.remove();
    },
  };
}

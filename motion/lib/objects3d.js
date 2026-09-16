/* Real 3D objects for the motion graphics style, drawn by three.js into canvases that sit on the
 * board like any other element. Matte, soft-lit, an orthographic three-quarter view, a contact
 * shadow on a transparent ground — so the object reads as sitting on the paper.
 *
 * Nothing here is generated: geometry is built from primitives, so it re-renders deterministically
 * frame by frame and carries no synthetic-content disclosure.
 *
 *   import { view, terminal, tiles, envelope, ease } from '../../lib/objects3d.js';
 *   const v = view(canvas, { w:900, h:900, span:11 });   // span = half-height of the ortho frustum
 *   v.add(terminal());  v.render();
 */
import * as THREE from '../assets/vendor/three.module.js';
import { RoundedBoxGeometry } from '../assets/vendor/RoundedBoxGeometry.js';

export const C = { ink:0x141416, ink2:0x1F2026, accent:0xF5C518, paper:0xFAF8F2, paper2:0xECEAE3, muted:0x9A9A9E, screen:0x0E1013 };
export const ease = { out: p => 1 - Math.pow(1 - p, 3), inout: p => p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p + 2, 3) / 2, in: p => p*p*p };
export const clamp01 = p => p < 0 ? 0 : p > 1 ? 1 : p;
export const seg = (t, s, d) => clamp01((t - s) / d);

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness:.62, metalness:0, ...o });

/* one canvas = one view: scene, ortho camera, lights, shadow ground */
export function view(canvas, { w, h, span = 10, dpr = 2, elev = 30, azim = -34, shadow = .16, ty = 0 } = {}) {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true, preserveDrawingBuffer:true });
  renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 0);
  const scene = new THREE.Scene();
  const a = w / h, cam = new THREE.OrthographicCamera(-span * a, span * a, span, -span, .1, 200);
  const el = THREE.MathUtils.degToRad(elev), az = THREE.MathUtils.degToRad(azim), R = 60;
  cam.position.set(R * Math.cos(el) * Math.sin(az), ty + R * Math.sin(el), R * Math.cos(el) * Math.cos(az)); cam.lookAt(0, ty, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xE6E4DD, 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(-7, 12, 7); sun.castShadow = true;
  sun.shadow.mapSize.set(768, 768); sun.shadow.radius = 4; sun.shadow.bias = -0.0006;
  Object.assign(sun.shadow.camera, { left:-span * 1.6, right:span * 1.6, top:span * 1.6, bottom:-span * 1.6, near:1, far:60 });
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xFFF4D6, .35); fill.position.set(8, 4, -6); scene.add(fill);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.ShadowMaterial({ opacity:shadow, transparent:true }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  let ratio = dpr;
  const v = { renderer, scene, cam, ground, w, h, dpr,
    add: o => (scene.add(o), o),
    render: () => renderer.render(scene, cam),
    /* the backing store follows the on-screen scale: a canvas the camera shows at 0.3x needs no 2x pixels.
       SwiftShader raster is the render's whole cost, so this is what makes a 3D board affordable. */
    setScale(k) { const r = Math.min(dpr, Math.max(.4, k * 1.5)); if (Math.abs(r - ratio) / ratio > .08) { ratio = r; renderer.setPixelRatio(r); renderer.setSize(w, h, false); } },
    /* world -> canvas CSS px, for DOM elements that have to meet a 3D edge */
    project: p => { const q = p.clone().project(cam); return { x:(q.x + 1) / 2 * w, y:(1 - q.y) / 2 * h }; } };
  return v;
}

/* a card terminal: a slab with a screen, a printer bar and a paper slot, standing at a lean.
   The screen texture carries the wordmark — the terminal is the only branded object allowed. */
export function terminal({ lean = 62 } = {}) {
  const g = new THREE.Group();
  const W = 6.6, D = 1.5, H = 13.2;
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, D, H, 6, .55), mat(C.ink, { roughness:.5 }));
  body.castShadow = true; body.receiveShadow = true; g.add(body);
  /* screen: 5.5in of the front — an inset plane with a canvas texture */
  const sc = document.createElement('canvas'); sc.width = 640; sc.height = 1024;
  const x = sc.getContext('2d');
  x.fillStyle = '#0E1013'; x.fillRect(0, 0, 640, 1024);
  x.fillStyle = '#F5C518'; x.fillRect(0, 0, 640, 14);
  x.font = '800 150px Chivo'; x.textBaseline = 'middle'; x.letterSpacing = '-7px';
  const nw = x.measureText('Nero').width, pw = x.measureText('Pay').width, x0 = (640 - nw - pw) / 2;
  x.fillStyle = '#FFFFFF'; x.fillText('Nero', x0, 470);
  x.fillStyle = '#F5C518'; x.fillText('Pay', x0 + nw, 470);
  x.font = '400 34px "Martian Mono"'; x.fillStyle = '#9A9A9E'; x.letterSpacing = '5px'; x.textAlign = 'center'; x.fillText('TAP TO PAY', 320, 600);
  x.fillStyle = '#F5C518'; x.beginPath(); x.arc(320, 780, 62, 0, Math.PI * 2); x.stroke(); x.lineWidth = 8; x.strokeStyle = '#F5C518'; x.beginPath(); x.arc(320, 780, 62, 0, Math.PI * 2); x.stroke();
  x.beginPath(); x.arc(320, 780, 34, 0, Math.PI * 2); x.stroke();
  const tex = new THREE.CanvasTexture(sc); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.0, H * .66), new THREE.MeshStandardMaterial({ map:tex, roughness:.3, metalness:0, emissive:0xffffff, emissiveIntensity:.55, emissiveMap:tex }));
  screen.rotation.x = -Math.PI / 2; screen.position.set(0, D / 2 + .012, H * .09); g.add(screen);
  /* bezel around the screen: a thin lighter frame */
  const bez = new THREE.Mesh(new THREE.PlaneGeometry(W - .8, H * .66 + .2), mat(C.ink2, { roughness:.4 }));
  bez.rotation.x = -Math.PI / 2; bez.position.set(0, D / 2 + .006, H * .09); g.add(bez);
  /* printer bar at the top, with a paper slot */
  const bar = new THREE.Mesh(new RoundedBoxGeometry(W - .6, .5, 2.6, 4, .2), mat(C.ink2, { roughness:.45 }));
  bar.position.set(0, D / 2 + .2, -H / 2 + 1.7); bar.castShadow = true; g.add(bar);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(W - 1.6, .06, .18), mat(0x000000, { roughness:1 }));
  slot.position.set(0, D / 2 + .46, -H / 2 + .55); g.add(slot);
  /* a sliver of receipt paper */
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.9, 1.6), mat(C.paper, { side:THREE.DoubleSide, roughness:.9 }));
  paper.position.set(0, D / 2 + .5, -H / 2 - .5); paper.rotation.x = -Math.PI / 2 + .35; g.add(paper);
  /* a yellow card-slot lip at the foot — the one accent on the body */
  const lip = new THREE.Mesh(new RoundedBoxGeometry(2.6, .12, .5, 2, .05), mat(C.accent, { roughness:.5 }));
  lip.position.set(0, D / 2 + .02, H / 2 - .5); g.add(lip);
  const stand = new THREE.Group(); stand.add(g);
  g.rotation.x = THREE.MathUtils.degToRad(lean); g.position.y = D / 2 + Math.abs(Math.sin(THREE.MathUtils.degToRad(lean))) * H / 2;
  return stand;
}

/* a run of tiles (months, days): an instanced rounded box, each with its own drop-in progress and colour.
   layout: cols per row, size and gap in world units. Tile i is at row floor(i/cols), col i%cols.
   setProgress(i, p) drops tile i from above; setColor(i, hex). */
export function tiles(n, { cols = n, size = 1, gap = .18, height = .5, color = C.paper } = {}) {
  const geo = new RoundedBoxGeometry(size, height, size, 3, Math.min(.12, size * .14));
  const m = new THREE.InstancedMesh(geo, mat(color, { roughness:.7 }), n);
  m.castShadow = true; m.receiveShadow = true;
  const rows = Math.ceil(n / cols), pitch = size + gap;
  const ox = -((Math.min(n, cols) - 1) * pitch) / 2, oz = -((rows - 1) * pitch) / 2;
  const M = new THREE.Matrix4(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3(1, 1, 1);
  const col = new THREE.Color();
  const prog = new Float32Array(n), lift = new Float32Array(n), fall = new Float32Array(n);
  const place = i => { const r = Math.floor(i / cols), c = i % cols, p = prog[i];
    const y = (p <= 0 || fall[i] >= 1) ? -40 : height / 2 + (1 - p) * 6 + lift[i] - fall[i] * fall[i] * 14;
    P.set(ox + c * pitch, y, oz + r * pitch); S.set(1, 1, 1); M.compose(P, Q, S); m.setMatrixAt(i, M); };
  for (let i = 0; i < n; i++) { prog[i] = 0; place(i); m.setColorAt(i, col.set(color)); }
  m.instanceMatrix.needsUpdate = true; m.instanceColor.needsUpdate = true;
  return Object.assign(m, {
    pitch, cols, rows, ox, oz,
    setProgress(i, p) { prog[i] = p; place(i); m.instanceMatrix.needsUpdate = true; },
    setLift(i, y) { lift[i] = y; place(i); m.instanceMatrix.needsUpdate = true; },
    setFall(i, p) { fall[i] = p; place(i); m.instanceMatrix.needsUpdate = true; },
    setColor(i, hex) { m.setColorAt(i, col.set(hex)); m.instanceColor.needsUpdate = true; },
    /* world position of tile i's top-centre — for a DOM label that has to sit on it */
    top(i) { const r = Math.floor(i / cols), c = i % cols; return new THREE.Vector3(ox + c * pitch, height, oz + r * pitch); },
  });
}

/* an envelope standing up, leaning back, flap hinged at the top. open(p) swings the flap.
   The letter itself is a DOM card (crisp type) that rises behind the front panel — topEdge() gives the
   front panel's top edge in canvas px so the DOM card can be clipped to look as if it is inside. */
export function envelope({ w = 13, h = 9, lean = -14 } = {}) {
  const g = new THREE.Group(), t = .22;
  const back = new THREE.Mesh(new RoundedBoxGeometry(w, h, t, 3, .12), mat(C.paper2, { roughness:.85 }));
  back.castShadow = true; back.receiveShadow = true; g.add(back);
  const front = new THREE.Mesh(new RoundedBoxGeometry(w, h * .62, t, 3, .12), mat(C.paper, { roughness:.85 }));
  front.position.set(0, -h * .19, t + .9); front.castShadow = true; g.add(front);
  /* the two side flaps of the front: lighter triangles meeting at the centre */
  for (const sgn of [-1, 1]) { const sh = new THREE.Shape(); sh.moveTo(sgn * w / 2, h * .12); sh.lineTo(sgn * w / 2, -h * .5); sh.lineTo(0, -h * .19 - h * .05); sh.closePath();
    const side = new THREE.Mesh(new THREE.ShapeGeometry(sh), mat(C.paper2, { roughness:.85 })); side.position.set(0, 0, t + .9 + t / 2 + .01); g.add(side); }
  /* the flap — a wedge hinged at the back's top edge; inside face is the accent */
  const flapShape = new THREE.Shape(); flapShape.moveTo(-w / 2, 0); flapShape.lineTo(w / 2, 0); flapShape.lineTo(0, -h * .58); flapShape.closePath();
  const flapGeo = new THREE.ExtrudeGeometry(flapShape, { depth:t * .6, bevelEnabled:false });
  const flapMat = [mat(C.paper, { roughness:.85 }), mat(C.paper, { roughness:.85 })];
  const flap = new THREE.Mesh(flapGeo, flapMat); flap.castShadow = true;
  const inner = new THREE.Mesh(new THREE.ShapeGeometry(flapShape), mat(C.accent, { side:THREE.DoubleSide, roughness:.7 }));
  inner.position.z = -.01; const hinge = new THREE.Group(); hinge.position.set(0, h / 2, t / 2 + .05); hinge.add(flap); hinge.add(inner); g.add(hinge);
  const stand = new THREE.Group(); stand.add(g); g.position.set(0, h / 2 + .6, 0); g.rotation.x = THREE.MathUtils.degToRad(lean);
  return Object.assign(stand, {
    open(p) { hinge.rotation.x = -THREE.MathUtils.degToRad(128) * p; },
    /* the front panel's top edge, world space */
    frontTop() { const y = -h * .19 + h * .31, z = t + .9 + t / 2; const L = new THREE.Vector3(-w / 2, y, z), R = new THREE.Vector3(w / 2, y, z);
      g.updateWorldMatrix(true, false); return [L.applyMatrix4(g.matrixWorld), R.applyMatrix4(g.matrixWorld)]; },
    /* the slot where the letter sits, world space (top-centre of the back panel) */
    slotTop() { g.updateWorldMatrix(true, false); return new THREE.Vector3(0, h / 2, 0).applyMatrix4(g.matrixWorld); },
  });
}

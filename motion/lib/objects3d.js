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
  const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.position.set(-4, 16, 5); sun.castShadow = true;
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

/* a run of tiles (months, days): an instanced rounded box, each with its own rise-in progress and colour.
   v5: tiles rise out of the ground (which hides what is below it) — nothing ever enters from above a canvas.
   layout: cols per row, size and gap in world units. Tile i is at row floor(i/cols), col i%cols.
   setProgress(i, p) raises tile i from the ground; setColor(i, hex). */
export function tiles(n, { cols = n, size = 1, gap = .18, height = .5, color = C.paper } = {}) {
  const geo = new RoundedBoxGeometry(size, height, size, 3, Math.min(.12, size * .14));
  const m = new THREE.InstancedMesh(geo, mat(color, { roughness:.7 }), n);
  m.castShadow = true; m.receiveShadow = true;
  /* never cull: the renderer caches the bounding sphere on the first draw, and on that frame every tile is
     still parked below the ground — a sequential render would then cull the whole run for good */
  m.frustumCulled = false;
  const rows = Math.ceil(n / cols), pitch = size + gap;
  const ox = -((Math.min(n, cols) - 1) * pitch) / 2, oz = -((rows - 1) * pitch) / 2;
  const M = new THREE.Matrix4(), P = new THREE.Vector3(), Q = new THREE.Quaternion(), S = new THREE.Vector3(1, 1, 1);
  const col = new THREE.Color();
  const prog = new Float32Array(n), lift = new Float32Array(n), fall = new Float32Array(n);
  const place = i => { const r = Math.floor(i / cols), c = i % cols, p = prog[i];
    const y = (p <= 0 || fall[i] >= 1) ? -40 : height / 2 - (1 - p) * (height * 2.2 + .6) + lift[i] - fall[i] * fall[i] * 14;
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
    open(p) { hinge.rotation.x = THREE.MathUtils.degToRad(128) * p; },   /* v5: swings back, away from the camera, so a letter in front of it is never hidden */
    /* the front panel's top edge, world space */
    frontTop() { const y = -h * .19 + h * .31, z = t + .9 + t / 2; const L = new THREE.Vector3(-w / 2, y, z), R = new THREE.Vector3(w / 2, y, z);
      g.updateWorldMatrix(true, false); return [L.applyMatrix4(g.matrixWorld), R.applyMatrix4(g.matrixWorld)]; },
    /* the slot where the letter sits, world space (top-centre of the back panel) */
    slotTop() { g.updateWorldMatrix(true, false); return new THREE.Vector3(0, h / 2, 0).applyMatrix4(g.matrixWorld); },
  });
}

/* ---------------------------------------------------------------------------------------------
   v4 terminals, 16 Sep 2026. Two devices, so a video can show the one you are tied to and the
   one you can switch to without naming anyone:
     neroTerminal() — NeroPay's smart terminal, modelled on the product photos: a white slab with
                      a full-height display, a small camera, the till UI on screen, on a white dock.
                      Branding is the wordmark on the dock and on the screen's status line — subtle.
     oldTerminal()  — a generic, older machine: grey, chunky, a little monochrome LCD, rubber keys,
                      a paper slot. No maker's mark, no colour anyone owns.
   Both stand upright (front = +z) with a slight lean back, feet on the ground plane.
--------------------------------------------------------------------------------------------- */
function uiTexture() {
  const c = document.createElement('canvas'); c.width = 720; c.height = 1280; const x = c.getContext('2d');
  x.fillStyle = '#FAFAF8'; x.fillRect(0, 0, 720, 1280);
  /* status line with the wordmark */
  x.fillStyle = '#F5C518'; x.fillRect(36, 60, 648, 64);
  x.font = '800 30px Chivo'; x.textBaseline = 'middle'; x.fillStyle = '#141416'; x.fillText('NeroPay', 58, 92);
  x.font = '500 26px Chivo'; x.fillStyle = '#3A3A3E'; x.fillText('ready to take payments', 200, 93);
  /* amount */
  x.font = '800 128px Chivo'; x.textAlign = 'center'; x.fillStyle = '#141416'; x.fillText('£0.00', 360, 230);
  /* keypad 3x4 + an ops column */
  const keys = [['1','2','3'],['4','5','6'],['7','8','9'],['C','0','←']];
  x.font = '600 52px Chivo';
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
    const kx = 52 + k * 176, ky = 330 + r * 150;
    x.fillStyle = '#EEEEEC'; x.beginPath(); x.roundRect(kx, ky, 150, 122, 22); x.fill();
    x.fillStyle = '#141416'; x.fillText(keys[r][k], kx + 75, ky + 63);
  }
  const ops = ['C', '+', '−', '÷', '×', '='];
  x.font = '600 40px Chivo';
  for (let i = 0; i < 6; i++) { const ky = 330 + i * 96;
    x.fillStyle = i === 5 ? '#F5C518' : '#EEEEEC'; x.beginPath(); x.roundRect(600, ky, 84, 76, 16); x.fill();
    x.fillStyle = '#141416'; x.fillText(ops[i], 642, ky + 40); }
  /* charge button */
  x.fillStyle = '#141416'; x.beginPath(); x.roundRect(52, 950, 632, 104, 18); x.fill();
  x.font = '700 40px Chivo'; x.fillStyle = '#FFFFFF'; x.fillText('CHARGE', 368, 1004);
  /* bottom nav: five simple glyphs with labels */
  const nav = ['Link', 'Card', 'Sales', 'Alerts', 'More'];
  x.font = '500 22px Chivo';
  for (let i = 0; i < 5; i++) { const nx = 100 + i * 130;
    x.fillStyle = '#141416'; x.beginPath(); x.roundRect(nx - 22, 1120, 44, 34, 8); x.fill();
    x.fillStyle = '#6F6F74'; x.fillText(nav[i], nx, 1188); }
  x.fillStyle = '#F5C518'; x.beginPath(); x.arc(100 + 3 * 130 + 18, 1118, 9, 0, Math.PI * 2); x.fill();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return tex;
}
function wordmarkTexture(w = 512, h = 128, dark = false) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  x.font = '800 84px Chivo'; x.textBaseline = 'middle'; x.letterSpacing = '-4px';
  const nw = x.measureText('Nero').width, pw = x.measureText('Pay').width, x0 = (w - nw - pw) / 2;
  x.fillStyle = dark ? '#141416' : '#FFFFFF'; x.fillText('Nero', x0, h / 2);
  x.fillStyle = '#F5C518'; x.fillText('Pay', x0 + nw, h / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return tex;
}

export function neroTerminal({ lean = -8 } = {}) {
  const g = new THREE.Group();
  const W = 6.8, H = 14.0, D = 1.15;
  const shell = mat(0xF3F3F1, { roughness:.42 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 8, .62), shell); body.castShadow = true; body.receiveShadow = true; g.add(body);
  /* the display: a black glass panel nearly edge to edge, the UI inside it */
  const glass = new THREE.Mesh(new RoundedBoxGeometry(W - .7, H - 1.0, .08, 4, .42), mat(0x0B0B0D, { roughness:.18, metalness:.1 }));
  glass.position.z = D / 2 + .02; g.add(glass);
  const ui = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.25, (W - 1.25) * 1280 / 720), new THREE.MeshStandardMaterial({ map:uiTexture(), roughness:.3, emissive:0xffffff, emissiveIntensity:.5, emissiveMap:null }));
  ui.material.emissiveMap = ui.material.map;
  ui.position.set(0, -.15, D / 2 + .075); g.add(ui);
  /* camera dot */
  const cam = new THREE.Mesh(new THREE.CircleGeometry(.14, 24), mat(0x2A2A2E, { roughness:.3 })); cam.position.set(1.3, H / 2 - .6, D / 2 + .075); g.add(cam);
  /* wordmark on the lower bezel, tiny */
  const wm = new THREE.Mesh(new THREE.PlaneGeometry(1.7, .42), new THREE.MeshBasicMaterial({ map:wordmarkTexture(), transparent:true }));
  wm.position.set(0, -H / 2 + .58, D / 2 + .075); g.add(wm);
  /* the dock: a white wedge the terminal stands in, wordmark on its front */
  const dock = new THREE.Mesh(new RoundedBoxGeometry(W + .6, 1.6, 4.2, 6, .5), shell); dock.position.set(0, .8, .9); dock.castShadow = true; dock.receiveShadow = true;
  const dwm = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .55), new THREE.MeshBasicMaterial({ map:wordmarkTexture(512, 128, true), transparent:true }));
  dwm.position.set(0, .75, 3.01); 
  const stand = new THREE.Group();
  g.rotation.x = THREE.MathUtils.degToRad(lean); g.position.set(0, 1.5 + H / 2 * Math.cos(THREE.MathUtils.degToRad(lean)), -0.2);
  stand.add(g); stand.add(dock); stand.add(dwm);
  return stand;
}

export function oldTerminal({ lean = -12 } = {}) {
  const g = new THREE.Group();
  const W = 7.2, H = 15.5, D = 3.0;
  const grey = mat(0x5A5B60, { roughness:.85 }), light = mat(0xC9C9C4, { roughness:.9 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(W, H, D, 6, .5), grey); body.castShadow = true; body.receiveShadow = true; g.add(body);
  /* paper slot and a curl of receipt at the top */
  const slot = new THREE.Mesh(new THREE.BoxGeometry(W - 1.6, .12, .8), mat(0x1A1A1C)); slot.position.set(0, H / 2 - .3, D / 2 - .5); g.add(slot);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(W - 2.4, 1.3), mat(C.paper, { side:THREE.DoubleSide, roughness:.95 }));
  paper.position.set(0, H / 2 + .55, D / 2 - .55); paper.rotation.x = -.3; g.add(paper);
  /* a small monochrome LCD */
  const lc = document.createElement('canvas'); lc.width = 512; lc.height = 224; const x = lc.getContext('2d');
  x.fillStyle = '#B9C7A6'; x.fillRect(0, 0, 512, 224); x.fillStyle = '#2C3A2A'; x.font = '700 54px "Martian Mono"'; x.textBaseline = 'middle';
  x.fillText('ENTER AMOUNT', 34, 80); x.fillText('£ ______', 34, 150);
  const ltex = new THREE.CanvasTexture(lc); ltex.colorSpace = THREE.SRGBColorSpace;
  const bezel = new THREE.Mesh(new RoundedBoxGeometry(W - 1.4, 3.2, .1, 3, .2), mat(0x2E2F33, { roughness:.6 })); bezel.position.set(0, H / 2 - 3.2, D / 2 + .03); g.add(bezel);
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(W - 2.2, 2.4), new THREE.MeshStandardMaterial({ map:ltex, roughness:.7 })); lcd.position.set(0, H / 2 - 3.2, D / 2 + .09); g.add(lcd);
  /* rubber keys: 3 x 4, a red and a green on the bottom row */
  const key = new RoundedBoxGeometry(1.5, 1.05, .45, 3, .18);
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
    const m = r === 3 && k === 0 ? mat(0xB8352F, { roughness:.8 }) : r === 3 && k === 2 ? mat(0x3D8A46, { roughness:.8 }) : light;
    const kk = new THREE.Mesh(key, m); kk.position.set(-1.9 + k * 1.9, H / 2 - 6.6 - r * 1.5, D / 2 + .2); kk.castShadow = true; g.add(kk);
  }
  /* a card swipe groove down the right side */
  const groove = new THREE.Mesh(new THREE.BoxGeometry(.12, H - 2, .3), mat(0x2A2A2E)); groove.position.set(W / 2 - .01, 0, D / 2 - .9); g.add(groove);
  const stand = new THREE.Group();
  g.rotation.x = THREE.MathUtils.degToRad(lean); g.position.set(0, H / 2 * Math.cos(THREE.MathUtils.degToRad(lean)) + .1, 0);
  stand.add(g);
  return stand;
}

/* pillars: a small bar chart in the round. specs = [{ h, color }]; setRise(i, p) grows pillar i from the
   ground, setSink(i, p) drops it through the floor. top(i) is the top-centre for a DOM label. */
export function pillars(specs, { w = 2.2, gap = 1.1, depth = 2.2 } = {}) {
  const g = new THREE.Group(); const n = specs.length, pitch = w + gap, ox = -((n - 1) * pitch) / 2;
  const meshes = specs.map((s, i) => {
    const m = new THREE.Mesh(new RoundedBoxGeometry(w, s.h, depth, 4, .22), mat(s.color, { roughness:.7 }));
    m.castShadow = true; m.receiveShadow = true; m.position.set(ox + i * pitch, s.h / 2, 0); m.userData = { h:s.h, rise:0, sink:0 }; g.add(m); return m; });
  const place = m => { const { h, rise, sink } = m.userData; const sc = Math.max(rise, .001); m.scale.y = sc; m.position.y = h * sc / 2 - sink * sink * (h + 4); m.visible = sink < 1 && rise > 0; };
  meshes.forEach(place);
  return Object.assign(g, {
    setRise(i, p) { meshes[i].userData.rise = p; place(meshes[i]); },
    setSink(i, p) { meshes[i].userData.sink = p; place(meshes[i]); },
    top(i) { const m = meshes[i]; return new THREE.Vector3(m.position.x, m.userData.h * Math.max(m.userData.rise, .001), 0); },
    visible(i) { return meshes[i].visible; },
  });
}

/* rise(obj, p, h): an object of height h comes up out of the ground as p goes 0 -> 1. Below the ground it is
   hidden by the shadow plane, so this never clips against a canvas edge the way a drop from above did. */
export function rise(obj, p, h = 16) { obj.position.y = -(h + 1) * (1 - p); obj.visible = p > 0; }
/* sink(obj, p, h): the reverse — down through the paper. */
export function sink(obj, p, h = 16) { obj.position.y = -(h + 1) * p * p; obj.visible = p < 1; }

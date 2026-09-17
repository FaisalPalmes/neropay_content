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
  /* the till screen, as on the product: a banner, the amount, a keypad with an operator column, CHARGE, a nav row */
  const c = document.createElement('canvas'); c.width = 720; c.height = 1280; const x = c.getContext('2d');
  x.fillStyle = '#EDEDEB'; x.fillRect(0, 0, 720, 1280);
  /* banner */
  x.fillStyle = '#F5C518'; x.beginPath(); x.roundRect(40, 56, 640, 70, 12); x.fill();
  x.font = '800 30px Chivo'; x.textBaseline = 'middle'; x.fillStyle = '#141416'; x.fillText('PAYOUT', 64, 92);
  x.font = '400 26px Chivo'; x.fillStyle = '#3A3A3E'; x.fillText('see your daily total', 210, 93);
  /* amount */
  x.font = '800 124px Chivo'; x.textAlign = 'center'; x.fillStyle = '#141416'; x.fillText('£0.00', 360, 226);
  /* keypad 4 x 3, white keys with a soft edge, and an operator column */
  const keys = [['1','2','3'],['4','5','6'],['7','8','9'],['C','0','←']];
  x.font = '600 50px Chivo';
  for (let r = 0; r < 4; r++) for (let k = 0; k < 3; k++) {
    const kx = 44 + k * 178, ky = 318 + r * 146;
    x.fillStyle = '#D6D6D3'; x.beginPath(); x.roundRect(kx, ky + 5, 158, 122, 22); x.fill();
    x.fillStyle = '#FFFFFF'; x.beginPath(); x.roundRect(kx, ky, 158, 122, 22); x.fill();
    x.fillStyle = '#141416'; x.fillText(keys[r][k], kx + 79, ky + 63);
  }
  x.strokeStyle = '#D9D9D6'; x.lineWidth = 2; x.beginPath(); x.moveTo(596, 318); x.lineTo(596, 900); x.stroke();
  const ops = ['C', '+', '−', '÷', '×', '='];
  x.font = '600 40px Chivo';
  for (let i = 0; i < 6; i++) { const ky = 318 + i * 97;
    x.fillStyle = i === 5 ? '#F5C518' : '#FFFFFF'; x.beginPath(); x.roundRect(606, ky, 74, 80, 16); x.fill();
    x.fillStyle = '#141416'; x.fillText(ops[i], 643, ky + 41); }
  /* charge: inactive grey until an amount is keyed, as on the product */
  x.fillStyle = '#C9C9CE'; x.beginPath(); x.roundRect(44, 936, 636, 104, 18); x.fill();
  x.font = '700 40px Chivo'; x.fillStyle = '#FFFFFF'; x.fillText('CHARGE', 362, 990);
  /* nav: five glyphs with labels, a badge on notifications */
  const nav = ['Link Pay', 'QR Pay', 'Transactions', 'Notifications', 'Menu'];
  x.font = '500 20px Chivo';
  for (let i = 0; i < 5; i++) { const nx = 96 + i * 132;
    x.fillStyle = '#141416'; x.beginPath(); x.roundRect(nx - 20, 1116, 40, 32, 8); x.fill();
    x.fillStyle = '#6F6F74'; x.fillText(nav[i], nx, 1182); }
  x.fillStyle = '#D6322A'; x.beginPath(); x.arc(96 + 3 * 132 + 22, 1114, 11, 0, Math.PI * 2); x.fill();
  x.fillStyle = '#FFFFFF'; x.font = '700 15px Chivo'; x.fillText('2', 96 + 3 * 132 + 22, 1115);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return tex;
}
function wordmarkTexture(w = 512, h = 128, dark = false, align = 'center', pay = null) {
  const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d');
  x.font = '800 84px Chivo'; x.textBaseline = 'middle'; x.letterSpacing = '-4px';
  const nw = x.measureText('Nero').width, pw = x.measureText('Pay').width, x0 = align === 'left' ? 6 : (w - nw - pw) / 2;
  x.fillStyle = dark ? '#141416' : '#FFFFFF'; x.fillText('Nero', x0, h / 2);
  x.fillStyle = pay || '#F5C518'; x.fillText('Pay', x0 + nw, h / 2);
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return tex;
}
/* the contactless indicator as on the product: an ellipse holding four arcs and a hand tapping a card. Drawn to a
   canvas in ink; a decal on the head. */
function contactlessTexture(ink = '#141416') {
  const c = document.createElement('canvas'); c.width = 640; c.height = 380; const x = c.getContext('2d');
  x.strokeStyle = ink; x.fillStyle = ink; x.lineCap = 'round'; x.lineJoin = 'round';
  /* the ellipse */
  x.lineWidth = 15; x.beginPath(); x.ellipse(320, 190, 296, 166, 0, 0, Math.PI * 2); x.stroke();
  /* four arcs opening to the right */
  x.lineWidth = 17;
  for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(118, 190, 46 + i * 38, -Math.PI * .34, Math.PI * .34); x.stroke(); }
  /* the card, tilted, and the hand holding it from the lower right */
  x.save(); x.translate(392, 150); x.rotate(-.42);
  x.lineWidth = 13; x.beginPath(); x.roundRect(-64, -42, 128, 84, 10); x.stroke();
  /* thumb over the card's near corner */
  x.beginPath(); x.moveTo(-20, 42); x.quadraticCurveTo(-6, 20, 24, 14); x.stroke();
  /* fingers under the card */
  for (let i = 0; i < 3; i++) { x.beginPath(); x.roundRect(-28 + i * 30, 44, 22, 46, 11); x.stroke(); }
  x.restore();
  /* wrist to the rim */
  x.lineWidth = 13; x.beginPath(); x.moveTo(438, 232); x.quadraticCurveTo(470, 290, 545, 318); x.stroke();
  x.beginPath(); x.moveTo(500, 214); x.quadraticCurveTo(540, 250, 585, 262); x.stroke();
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return tex;
}

/* v6, 16 Sep 2026 — the terminal as it is: a standalone slim handheld, no dock, no stand. One body: a single side
   profile (flat front, rounded foot, a back that swells at the top for the printer, a domed top) extruded across the
   width with soft ends, then split at the seam line — yellow above, white below — so the head and the body share
   every curve and read as one moulding. A black frame sits inset on the front around the full-height display,
   the contactless indicator on the yellow, the wordmark bottom-left of the front. Slight lean back. */
function clipPoly(pts, keepAbove, y) {
  /* Sutherland–Hodgman against the line y = const; pts are Vector2 (x = depth z, y = height) */
  const out = [], inside = p => keepAbove ? p.y >= y : p.y <= y;
  for (let i = 0; i < pts.length; i++) { const P = pts[i], Q = pts[(i + 1) % pts.length];
    const pi = inside(P), qi = inside(Q);
    if (pi) out.push(P);
    if (pi !== qi) { const t = (y - P.y) / (Q.y - P.y); out.push(new THREE.Vector2(P.x + (Q.x - P.x) * t, y)); } }
  return out;
}
export function neroTerminal({ lean = -6 } = {}) {
  const g = new THREE.Group();
  const W = 6.4, H = 14.6, D = 1.55, HEAD = 2.7, FD = .42, b = .55;
  const white = mat(0xF1F1EE, { roughness:.5 }), black = mat(0x1E1F23, { roughness:.4, metalness:.2 }), yellow = mat(0xF5C518, { roughness:.7 });
  /* the rig's sun is ~3x on an upward face, which blows brand yellow out to white; clamp this material's lit colour
     to a touch above the brand value (linear), so the top reads as the same yellow catching light */
  yellow.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <opaque_fragment>', 'outgoingLight = min(outgoingLight, vec3(1.0, 0.64, 0.024));\n#include <opaque_fragment>'); };
  /* the side profile, in (z, y): front is +z */
  const fz = D / 2, bz0 = -D / 2, bz = -(D / 2 + 1.05), yTop = H / 2, yBot = -H / 2, y0 = yTop - HEAD, rb = .75, rt = 1.0;
  const prof = new THREE.Shape();
  prof.moveTo(fz, yBot + rb); prof.lineTo(fz, yTop - rt);
  prof.quadraticCurveTo(fz, yTop - .08, fz - rt, yTop - .03);                /* front-top corner */
  prof.quadraticCurveTo((fz + bz) / 2, yTop + .2, bz + rt, yTop - .03);      /* domed top */
  prof.quadraticCurveTo(bz, yTop - .08, bz, yTop - rt);                      /* back-top corner */
  prof.lineTo(bz, y0 - .2);
  prof.bezierCurveTo(bz, y0 - 1.6, bz0, y0 - 1.5, bz0, y0 - 2.6);           /* the printer swell eases into the flat back */
  prof.lineTo(bz0, yBot + rb);
  prof.quadraticCurveTo(bz0, yBot, bz0 + rb, yBot); prof.lineTo(fz - rb, yBot); prof.quadraticCurveTo(fz, yBot, fz, yBot + rb);
  prof.closePath();
  const pts = prof.getPoints(18);
  const extrude = (poly, grow) => { const sh = new THREE.Shape(poly);
    const gm = new THREE.ExtrudeGeometry(sh, { depth:W - 2 * b, bevelEnabled:true, bevelThickness:b, bevelSize:b - .02, bevelOffset:-(b - .02) + grow, bevelSegments:8, curveSegments:4 });
    gm.rotateY(-Math.PI / 2); gm.computeBoundingBox(); gm.translate(-(gm.boundingBox.max.x + gm.boundingBox.min.x) / 2, 0, 0); return gm; };
  const shell = new THREE.Mesh(extrude(clipPoly(pts, false, y0 + .3), 0), white); shell.castShadow = true; shell.receiveShadow = true; g.add(shell);
  const head = new THREE.Mesh(extrude(clipPoly(pts, true, y0), .022), yellow); head.castShadow = true; head.receiveShadow = true; g.add(head);
  /* the print slot: a fine dark line along the seam */
  const slot = new THREE.Mesh(new THREE.PlaneGeometry(W - 1.6, .09), mat(0x2A2A2E, { roughness:1 })); slot.position.set(0, y0 - .09, fz + .03); g.add(slot);
  /* the black frame, inset on the front, up to the seam */
  const frameH = (y0 - .16) - yBot - .25;
  const front = new THREE.Mesh(new RoundedBoxGeometry(W - .34, frameH, FD, 8, .3), black); front.position.set(0, yBot + .25 + frameH / 2, fz - FD / 2 + .06); front.castShadow = true; g.add(front);
  const ffz = fz + .06;
  /* the contactless indicator, large and centred on the yellow */
  const cl = new THREE.Mesh(new THREE.PlaneGeometry(2.9, 2.9 * 380 / 640), new THREE.MeshBasicMaterial({ map:contactlessTexture('#141416'), transparent:true }));
  cl.position.set(0, y0 + HEAD / 2 + .02, fz + .022 + .012); g.add(cl);
  /* the display: black glass inside the frame, from just under the seam to just above the wordmark, the UI in it */
  const SH = frameH - 1.55, SY = yBot + .25 + 1.2 + SH / 2;
  const glass = new THREE.Mesh(new RoundedBoxGeometry(W - .94, SH, .08, 4, .34), mat(0x0A0A0C, { roughness:.16, metalness:.1 }));
  glass.position.set(0, SY, ffz + .02); g.add(glass);
  const UW = W - 1.34, UH = UW * 1280 / 720;
  const ui = new THREE.Mesh(new THREE.PlaneGeometry(UW, UH), new THREE.MeshStandardMaterial({ map:uiTexture(), roughness:.3, emissive:0xffffff, emissiveIntensity:.5 }));
  ui.material.emissiveMap = ui.material.map; ui.position.set(0, SY - (SH - UH) / 2 + .02, ffz + .075); g.add(ui);
  const cam = new THREE.Mesh(new THREE.CircleGeometry(.1, 24), mat(0x3A3A3E, { roughness:.3 })); cam.position.set(0, SY + SH / 2 - .28, ffz + .075); g.add(cam);
  /* the wordmark, bottom-left of the front */
  const wm = new THREE.Mesh(new THREE.PlaneGeometry(2.2, .55), new THREE.MeshBasicMaterial({ map:wordmarkTexture(512, 128, false, 'left'), transparent:true }));
  wm.position.set(-W / 2 + .5 + 1.1, yBot + .25 + .6, ffz + .075); g.add(wm);
  const stand = new THREE.Group();
  g.rotation.x = THREE.MathUtils.degToRad(lean); g.position.set(0, H / 2 * Math.cos(THREE.MathUtils.degToRad(lean)) + .05, 0);
  stand.add(g);
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

/* a run of simplified shopfronts (the partner programme's "street"): a dark body, a wide window across the front, an
   awning over it and a door beside it. light(i, p) brings the window and the awning up to the accent — a shop "lit"
   is one introduced. setProgress(i, p) rises it out of the ground like tiles(). Trading type only, never a name. */
export function shops(n, { w = 4.4, h = 3.6, d = 3.2, gap = 1.5, color = 0x1D2027, lit = C.accent } = {}) {
  const g = new THREE.Group(); const pitch = w + gap, ox = -((n - 1) * pitch) / 2;
  const cLit = new THREE.Color(lit), cWin = new THREE.Color(0x2B2F38), cAwn = new THREE.Color(0x3C4049), cGlow = new THREE.Color(lit).multiplyScalar(.5), black = new THREE.Color(0);
  const items = [];
  for (let i = 0; i < n; i++) {
    const s = new THREE.Group(); s.position.x = ox + i * pitch;
    const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .2), mat(color, { roughness:.78 })); body.position.y = h / 2; body.castShadow = body.receiveShadow = true; s.add(body);
    const winM = new THREE.MeshStandardMaterial({ color:cWin.clone(), emissive:0x000000, roughness:.35, metalness:.05 });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(w * .56, h * .42), winM); win.position.set(-w * .12, h * .5, d / 2 + .015); s.add(win);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(w * .18, h * .58), new THREE.MeshStandardMaterial({ color:0x0E1013, roughness:.8 })); door.position.set(w * .3, h * .29, d / 2 + .015); s.add(door);
    const awnM = mat(0x3C4049, { roughness:.6 });
    const awn = new THREE.Mesh(new RoundedBoxGeometry(w * .94, .26, 1.25, 2, .08), awnM); awn.position.set(0, h * .8, d / 2 + .45); awn.castShadow = true; s.add(awn);
    s.visible = false; g.add(s); items.push({ s, winM, awnM });
  }
  const tmp = new THREE.Color();
  return Object.assign(g, {
    pitch, ox, h,
    setProgress(i, p) { rise(items[i].s, p, h + 1); },
    light(i, p) { const it = items[i]; it.winM.color.copy(tmp.copy(cWin).lerp(cLit, p)); it.winM.emissive.copy(tmp.copy(black).lerp(cGlow, p)); it.awnM.color.copy(tmp.copy(cAwn).lerp(cLit, p)); },
    lift(i, y) { const it = items[i]; it.s.position.y = Math.max(it.s.position.y, 0) + y; },
    /* local position of shop i's top-centre, for a label standing on it */
    top(i) { return new THREE.Vector3(ox + i * pitch, h, 0); },
  });
}

/* rise(obj, p, h): an object of height h comes up out of the ground as p goes 0 -> 1. Below the ground it is
   hidden by the shadow plane, so this never clips against a canvas edge the way a drop from above did. */
export function rise(obj, p, h = 16) { obj.position.y = -(h + 1) * (1 - p); obj.visible = p > 0; }
/* sink(obj, p, h): the reverse — down through the paper. */
export function sink(obj, p, h = 16) { obj.position.y = -(h + 1) * p * p; obj.visible = p < 1; }

/* ---------------------------------------------------------------------------------------------------------------
   PP02 — the street (17 Sep 2026). One long row of paper shopfronts of mixed heights and widths, a few with shutters,
   no names and no place — any English high street. light(i, p) as shops(); shutter(i, p) rolls a shutter down over
   the front; label positions from top(i). Built once for the whole world, not per section.
--------------------------------------------------------------------------------------------------------------- */
export function street(n, { pitch = 6.6, x0 = 0, color = 0xEDEAE2, lit = C.accent, seed = 3, scale = 1 } = {}) {
  const g = new THREE.Group();
  const cLit = new THREE.Color(lit), cWin = new THREE.Color(0x2B2F38), cAwn = new THREE.Color(0x3C4049), cGlow = new THREE.Color(lit).multiplyScalar(.5), black = new THREE.Color(0);
  let s = seed; const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const items = [];
  for (let i = 0; i < n; i++) {
    const w = (4.2 + rnd() * 1.4) * scale, h = (3.3 + rnd() * 1.6) * scale, d = 3.2 * scale;
    const sh = new THREE.Group(); sh.position.x = x0 + i * pitch;
    const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .2), mat(color, { roughness:.78 })); body.position.y = h / 2; body.castShadow = body.receiveShadow = true; sh.add(body);
    const winM = new THREE.MeshStandardMaterial({ color:cWin.clone(), emissive:0x000000, roughness:.35, metalness:.05 });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(w * .56, h * .42), winM); win.position.set(-w * .12, h * .5, d / 2 + .015); sh.add(win);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(w * .18, h * .58), new THREE.MeshStandardMaterial({ color:0x0E1013, roughness:.8 })); door.position.set(w * .3, h * .29, d / 2 + .015); sh.add(door);
    const awnM = mat(0x3C4049, { roughness:.6 });
    const awn = new THREE.Mesh(new RoundedBoxGeometry(w * .94, .26, 1.25, 2, .08), awnM); awn.position.set(0, h * .8, d / 2 + .45); awn.castShadow = true; sh.add(awn);
    /* a shutter: a ribbed grey plane that slides down from under the awning over the window and the door */
    const shut = new THREE.Mesh(new THREE.PlaneGeometry(w * .9, h * .76), mat(0xC9C7C0, { roughness:.9 }));
    shut.position.set(0, h * .78 - (h * .76) / 2, d / 2 + .03); shut.scale.y = .001; shut.visible = false; sh.add(shut);
    /* a couple of roof details so the row is not one silhouette: a parapet on some, a step on others */
    if (rnd() > .5) { const par = new THREE.Mesh(new RoundedBoxGeometry(w * .6, .5, d * .6, 2, .1), mat(color, { roughness:.8 })); par.position.set((rnd() - .5) * w * .3, h + .25, 0); par.castShadow = true; sh.add(par); }
    g.add(sh); items.push({ sh, w, h, d, winM, awnM, shut, door:door.position.clone() });
  }
  const tmp = new THREE.Color();
  return Object.assign(g, {
    pitch, n,
    light(i, p) { const it = items[i]; it.winM.color.copy(tmp.copy(cWin).lerp(cLit, p)); it.winM.emissive.copy(tmp.copy(black).lerp(cGlow, p)); it.awnM.color.copy(tmp.copy(cAwn).lerp(cLit, p)); },
    /* the shutter rolls down from the awning: p 0 = up, 1 = down to the pavement */
    shutter(i, p) { const it = items[i]; const H = it.h * .76; it.shut.visible = p > .002; it.shut.scale.y = Math.max(.001, p); it.shut.position.y = it.h * .78 - (H * p) / 2; },
    /* local position of shop i's top-centre, and of its door's top (for the receipt) */
    top(i) { const it = items[i]; return new THREE.Vector3(it.sh.position.x, it.h, 0); },
    doorTop(i) { const it = items[i]; return new THREE.Vector3(it.sh.position.x + it.door.x, it.h * .58, it.d / 2); },
    x(i) { return items[i].sh.position.x; },
    height(i) { return items[i].h; },
  });
}

/* a lamp post: a slim pole, a short arm and a lamp head; signs (DOM) hang beside the arm */
export function lampPost({ h = 12, color = 0x2A2B30 } = {}) {
  const g = new THREE.Group();
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.16, .22, h, 16), mat(color, { roughness:.55 })); pole.position.y = h / 2; pole.castShadow = true; g.add(pole);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.42, .5, .5, 16), mat(color, { roughness:.6 })); base.position.y = .25; base.castShadow = true; g.add(base);
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(.11, .11, 2.4, 12), mat(color, { roughness:.55 })); arm.rotation.z = Math.PI / 2; arm.position.set(1.2, h - .2, 0); g.add(arm);
  const head = new THREE.Mesh(new RoundedBoxGeometry(1.1, .5, .7, 3, .12), mat(color, { roughness:.5 })); head.position.set(2.4, h - .35, 0); head.castShadow = true; g.add(head);
  const lamp = new THREE.Mesh(new THREE.PlaneGeometry(.9, .5), new THREE.MeshStandardMaterial({ color:0xFFF1C2, emissive:0xFFE08A, emissiveIntensity:.6, roughness:.4 })); lamp.rotation.x = Math.PI / 2; lamp.position.set(2.4, h - .61, 0); g.add(lamp);
  g.userData.h = h; return g;
}

/* a phone standing on the pavement, leaning back a touch; the screen is a canvas texture the composition draws into
   (draw(fn) — fn(ctx, W, H)), so a contact card can type in frame by frame. No maker's mark, no UI chrome but ours. */
export function phone({ w = 4.2, lean = -8 } = {}) {
  const h = w * 2.1, d = w * .085;
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, w * .11), mat(0x1E1F23, { roughness:.35, metalness:.15 })); body.castShadow = true; g.add(body);
  const c = document.createElement('canvas'); c.width = 720; c.height = 1512; const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(w * .9, h * .93), new THREE.MeshStandardMaterial({ map:tex, emissive:0xffffff, emissiveIntensity:.55, emissiveMap:tex, roughness:.3 }));
  scr.position.z = d / 2 + .012; g.add(scr);
  const stand = new THREE.Group(); g.rotation.x = THREE.MathUtils.degToRad(lean); g.position.y = h / 2 * Math.cos(THREE.MathUtils.degToRad(lean)) + .04; stand.add(g);
  return Object.assign(stand, { w, h, draw(fn) { ctx.save(); fn(ctx, c.width, c.height); ctx.restore(); tex.needsUpdate = true; } });
}

/* a till receipt printing up out of a slot: a paper plane whose visible height grows from the slot (a local clipping
   plane, so the print stays sharp and unstretched), leaning toward the camera. draw(fn) paints the paper. */
export function receipt({ w = 3.4, h = 6.4, lean = -14 } = {}) {
  const g = new THREE.Group();
  const c = document.createElement('canvas'); c.width = 680; c.height = Math.round(680 * h / w); const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const clip = new THREE.Plane(new THREE.Vector3(0, -1, 0), 0);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map:tex, roughness:.9, side:THREE.DoubleSide, clippingPlanes:[clip], clipShadows:true }));
  paper.position.y = h / 2; paper.castShadow = true; g.add(paper);
  const slot = new THREE.Mesh(new RoundedBoxGeometry(w + .5, .28, .6, 2, .1), mat(0x2A2B30, { roughness:.6 })); slot.position.y = 0; g.add(slot);
  g.rotation.x = THREE.MathUtils.degToRad(lean);
  const wp = new THREE.Vector3();
  return Object.assign(g, {
    w, h,
    draw(fn) { ctx.save(); fn(ctx, c.width, c.height); ctx.restore(); tex.needsUpdate = true; },
    /* p 0..1 of the paper out of the slot — the clip is set in world space each frame */
    setProgress(p) { g.updateWorldMatrix(true, false); paper.visible = p > .005;
      const top = g.localToWorld(wp.set(0, h * p, 0)); clip.constant = top.y; },
  });
}

/* a small unbranded white van (v3, PP02): body and cab, a windscreen with pillars, cab side windows, a grille and two
   headlights, tail lights, bumpers, wing mirrors, hub caps, a thin yellow band both sides and across the back, and a
   sliding side door on the +z (camera) side that opens on to a dark load bay. roll(dist) turns the wheels by distance
   travelled; open(p) slides the door back. Drives along its own x; the cab is the +x end. No name on it. */
export function van({ L = 6.2, color = 0xF4F2EC, band = C.accent } = {}) {
  const g = new THREE.Group(); const W = 2.6, H = 2.2, R = .46;
  const paint = mat(color, { roughness:.5 }), dark = mat(0x1E2026, { roughness:.25, metalness:.2 }), trim = mat(0x2A2B30, { roughness:.6 });
  const body = new THREE.Mesh(new RoundedBoxGeometry(L * .62, H, W, 4, .22), paint); body.position.set(-L * .19, R + H / 2, 0); body.castShadow = true; g.add(body);
  const cab = new THREE.Mesh(new RoundedBoxGeometry(L * .38, H * .82, W, 4, .3), paint); cab.position.set(L * .31, R + H * .41, 0); cab.castShadow = true; g.add(cab);
  /* the windscreen, raked, with a dark pillar each side; the cab's side windows */
  const wsc = new THREE.Mesh(new RoundedBoxGeometry(.16, H * .34, W * .86, 2, .05), dark); wsc.position.set(L * .5 - .02, R + H * .6, 0); wsc.rotation.z = -.28; g.add(wsc);
  for (const zz of [W / 2, -W / 2]) { const side = new THREE.Mesh(new THREE.PlaneGeometry(L * .26, H * .3), dark); side.position.set(L * .3, R + H * .62, zz + Math.sign(zz) * .012); if (zz < 0) side.rotation.y = Math.PI; g.add(side); }
  /* grille, bumpers, two headlights, two tail lights */
  const grille = new THREE.Mesh(new RoundedBoxGeometry(.14, .3, W * .5, 2, .05), trim); grille.position.set(L * .5 + .02, R + H * .22, 0); g.add(grille);
  const bF = new THREE.Mesh(new RoundedBoxGeometry(.22, .22, W + .1, 2, .08), trim); bF.position.set(L * .5, R + .02, 0); g.add(bF);
  const bB = bF.clone(); bB.position.x = -L * .5; g.add(bB);
  const lampM = new THREE.MeshStandardMaterial({ color:0xFFF4D2, emissive:0xFFE39A, emissiveIntensity:.7, roughness:.35 });
  for (const zz of [W * .34, -W * .34]) { const hl = new THREE.Mesh(new RoundedBoxGeometry(.12, .26, .42, 2, .05), lampM); hl.position.set(L * .5 + .04, R + H * .36, zz); g.add(hl);
    const tl = new THREE.Mesh(new RoundedBoxGeometry(.1, .4, .3, 2, .05), new THREE.MeshStandardMaterial({ color:0xE0433A, emissive:0xB4231C, emissiveIntensity:.5, roughness:.4 })); tl.position.set(-L * .5 - .02, R + H * .5, zz); g.add(tl); }
  /* wing mirrors */
  for (const zz of [W / 2 + .2, -W / 2 - .2]) { const m = new THREE.Mesh(new RoundedBoxGeometry(.16, .28, .22, 2, .05), trim); m.position.set(L * .44, R + H * .62, zz); g.add(m); }
  /* the band, both sides and across the back */
  for (const zz of [W / 2 + .01, -W / 2 - .01]) { const bm = new THREE.Mesh(new THREE.PlaneGeometry(L * .96, .18), mat(band, { roughness:.6 })); bm.position.set(-L * .02, R + H * .28, zz); if (zz < 0) bm.rotation.y = Math.PI; g.add(bm); }
  { const bm = new THREE.Mesh(new THREE.PlaneGeometry(W * .9, .18), mat(band, { roughness:.6 })); bm.position.set(-L * .5 - .01, R + H * .28, 0); bm.rotation.y = -Math.PI / 2; g.add(bm); }
  /* the sliding door on the camera side: a bay cut as a dark panel, the door a paint panel that slides back over the body */
  const bay = new THREE.Mesh(new THREE.PlaneGeometry(L * .3, H * .78), mat(0x15161A, { roughness:.9 })); bay.position.set(-L * .04, R + H * .47, W / 2 + .005); g.add(bay);
  const door = new THREE.Group(); door.position.set(-L * .04, R + H * .47, W / 2 + .03);
  const dp = new THREE.Mesh(new RoundedBoxGeometry(L * .31, H * .8, .05, 2, .02), paint); door.add(dp);
  const seam = new THREE.Mesh(new THREE.PlaneGeometry(L * .31, H * .8), new THREE.MeshStandardMaterial({ color:0x000000, transparent:true, opacity:.0 })); door.add(seam);
  const dband = new THREE.Mesh(new THREE.PlaneGeometry(L * .31, .18), mat(band, { roughness:.6 })); dband.position.set(0, R + H * .28 - (R + H * .47), .03); door.add(dband);
  const handle = new THREE.Mesh(new RoundedBoxGeometry(.5, .08, .06, 2, .02), trim); handle.position.set(L * .1, .1, .04); door.add(handle);
  const dwin = new THREE.Mesh(new THREE.PlaneGeometry(L * .2, H * .26), dark); dwin.position.set(0, H * .16, .03); door.add(dwin);
  g.add(door);
  /* wheels on axles, hub caps, wheel arches suggested by a darker ring */
  const wheelG = new THREE.CylinderGeometry(R, R, .5, 24); const wheelM = mat(0x232428, { roughness:.85 }); const hubG = new THREE.CylinderGeometry(R * .5, R * .5, .54, 16); const hubM = mat(0xD9D6CE, { roughness:.5, metalness:.3 });
  const axles = [];
  for (const [x, z] of [[L * .3, W / 2], [L * .3, -W / 2], [-L * .3, W / 2], [-L * .3, -W / 2]]) { const pv = new THREE.Group(); pv.position.set(x, R, z);
    const wh = new THREE.Mesh(wheelG, wheelM); wh.rotation.x = Math.PI / 2; wh.castShadow = true; pv.add(wh);
    const hb = new THREE.Mesh(hubG, hubM); hb.rotation.x = Math.PI / 2; pv.add(hb); g.add(pv); axles.push(pv); }
  return Object.assign(g, {
    L, W, H, R,
    roll(dist) { for (const pv of axles) pv.rotation.z = -dist / R; },
    open(p) { door.position.x = -L * .04 - L * .27 * p; },
  });
}

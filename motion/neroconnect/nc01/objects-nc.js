/* NC01 — the objects this episode adds, kept beside it so the shared library (`motion/lib/`) is not touched by the
   social session. Same rules as objects3d.js: primitives only, matte, one contact shadow, nothing generated, nothing
   enters from above. Canvas textures are drawn per frame through draw(fn) so the composition owns every pixel of
   text — and the text is ours, never a screenshot of the product.                                            */
import * as THREE from '../../assets/vendor/three.module.js';
import { RoundedBoxGeometry } from '../../assets/vendor/RoundedBoxGeometry.js';
import { neroTerminal, van, C } from '../../lib/objects3d.js';

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness:.62, metalness:0, ...o });
const d2r = THREE.MathUtils.degToRad;

/* a canvas-faced slab: a frosted white rounded box standing upright with a slight lean, its front carrying a canvas the
   composition draws into. The base for the dashboard, the till screen, the ledger strip and the document. */
export function canvasSlab({ w = 20, h = 13, d = .7, lean = -7, px = 60, tone = 0xF7F5EF, glass = true } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, Math.min(w, h) * .05),
    glass ? new THREE.MeshPhysicalMaterial({ color:tone, roughness:.28, metalness:0, clearcoat:.5, clearcoatRoughness:.3, envMapIntensity:1.2 }) : mat(tone, { roughness:.85 }));
  body.castShadow = true; body.receiveShadow = true; g.add(body);
  const c = document.createElement('canvas'); c.width = Math.round(w * px); c.height = Math.round(h * px); const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w - .3, h - .3), new THREE.MeshBasicMaterial({ map:tex, transparent:true }));
  face.position.z = d / 2 + .012; g.add(face);
  /* a thin ink rim at the back edge, the pencil-world outline that makes a pale object read on a pale ground */
  const rim = new THREE.Mesh(body.geometry, new THREE.MeshBasicMaterial({ color:0x141416, transparent:true, opacity:.08, side:THREE.BackSide, depthWrite:false }));
  rim.scale.setScalar(1.012); g.add(rim);
  const stand = new THREE.Group(); g.rotation.x = d2r(lean); g.position.y = h / 2 * Math.cos(d2r(lean)) + .04; stand.add(g);
  return Object.assign(stand, { w, h, canvas:c, draw(fn) { ctx.save(); ctx.clearRect(0, 0, c.width, c.height); fn(ctx, c.width, c.height); ctx.restore(); tex.needsUpdate = true; } });
}

/* our terminal with a swappable badge: the wordmark plane at the bottom-left of the front is replaced by a canvas the
   composition can crossfade from the NeroPay wordmark to a placeholder mark (YOUR BRAND). Re-badged, not repainted —
   the yellow head and the white shell stay exactly as the product. brand(p): 0 = NeroPay, 1 = the placeholder. */
export function brandTerminal(opts = {}) {
  const t = neroTerminal(opts);
  let wm = null;
  t.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && Math.abs(o.geometry.parameters.width - 2.2) < .01 && Math.abs(o.geometry.parameters.height - .55) < .01) wm = o; });
  const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const paint = p => {
    x.clearRect(0, 0, 512, 128);
    /* the wordmark, fading out */
    x.save(); x.globalAlpha = 1 - p; x.font = '800 84px Chivo'; x.textBaseline = 'middle'; x.letterSpacing = '-4px';
    const nw = x.measureText('Nero').width; x.fillStyle = '#FFFFFF'; x.fillText('Nero', 6, 64); x.fillStyle = '#F5C518'; x.fillText('Pay', 6 + nw, 64); x.restore();
    /* the placeholder: a small rounded mark and YOUR BRAND, white — a generic badge, never a real logo */
    x.save(); x.globalAlpha = p; x.fillStyle = '#FFFFFF'; x.beginPath(); x.roundRect(6, 28, 72, 72, 18); x.fill();
    x.fillStyle = '#1E1F23'; x.beginPath(); x.arc(42, 64, 16, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#FFFFFF'; x.font = '700 50px Poppins'; x.textBaseline = 'middle'; x.letterSpacing = '1px'; x.fillText('YOUR BRAND', 96, 66); x.restore();
    tex.needsUpdate = true;
  };
  paint(0);
  if (wm) { wm.material = new THREE.MeshBasicMaterial({ map:tex, transparent:true }); wm.geometry = new THREE.PlaneGeometry(4.4, 1.1); wm.position.x += 1.1; }
  let last = -1;
  return Object.assign(t, { brand(p) { p = Math.max(0, Math.min(1, p)); if (Math.abs(p - last) > .002) { paint(p); last = p; } } });
}

/* a flat sheet standing on its edge (a document, a contract, a notice) — a canvas slab with paper proportions */
export function sheet({ w = 8, h = 10.4, lean = -9 } = {}) { return canvasSlab({ w, h, d:.16, lean, px:70, tone:0xFBF9F2, glass:false }); }

/* a bank-shaped tile: a low box with a small pediment, paper-coloured, that lights to the accent on light(p) */
export function bankTile({ w = 6, h = 3.2, d = 4 } = {}) {
  const g = new THREE.Group();
  const cBase = new THREE.Color(0xEDEAE2), cLit = new THREE.Color(C.accent), tmp = new THREE.Color();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .2), mat(0xEDEAE2, { roughness:.75 })); body.position.y = h / 2; body.castShadow = body.receiveShadow = true; g.add(body);
  const roof = new THREE.Mesh(new THREE.CylinderGeometry(0, w * .62, 1.4, 4, 1), mat(0xE4E1D8, { roughness:.8 })); roof.rotation.y = Math.PI / 4; roof.position.y = h + .7; roof.castShadow = true; g.add(roof);
  for (let i = 0; i < 4; i++) { const col = new THREE.Mesh(new THREE.CylinderGeometry(.22, .22, h * .7, 12), mat(0xF7F5EF, { roughness:.8 })); col.position.set(-w * .33 + i * w * .22, h * .35, d / 2 + .1); g.add(col); }
  return Object.assign(g, { light(p) { body.material.color.copy(tmp.copy(cBase).lerp(cLit, p)); body.material.emissive.copy(tmp.set(C.accent).multiplyScalar(.35 * p)); } });
}

/* the payment path: a yellow line that draws along the floor from a to b (local x/z), with a dot running its head.
   set(p) draws 0..1; the dot leaves when the line completes. The line lies flat, a hair above the floor. */
export function pathLine(a, b, { w = .34 } = {}) {
  const g = new THREE.Group();
  const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz), ang = Math.atan2(-dz, dx);
  const line = new THREE.Mesh(new THREE.BoxGeometry(1, .05, w), mat(C.accent, { roughness:.6 })); line.position.y = .03; g.add(line);
  const dot = new THREE.Mesh(new THREE.SphereGeometry(.42, 20, 16), mat(0x141416, { roughness:.4 })); dot.position.y = .45; dot.castShadow = true; g.add(dot);
  g.position.set(a.x, 0, a.z); g.rotation.y = ang;
  return Object.assign(g, { L, set(p) { const l = Math.max(.001, L * p); line.scale.x = l; line.position.x = l / 2; dot.position.x = L * p; dot.visible = p > .01 && p < .995; g.visible = p > 0; } });
}

/* a small cluster of shopfronts under one roofline — "a group of merchants" — paper tone; light(p) lights every window */
export function shopGroup(n = 4, { w = 3.6, h = 3.0, d = 3.0, gap = .35 } = {}) {
  const g = new THREE.Group(); const pitch = w + gap, ox = -((n - 1) * pitch) / 2;
  const cWin = new THREE.Color(0x2B2F38), cLit = new THREE.Color(C.accent), cGlow = new THREE.Color(C.accent).multiplyScalar(.5), black = new THREE.Color(0), tmp = new THREE.Color();
  const wins = [];
  for (let i = 0; i < n; i++) {
    const body = new THREE.Mesh(new RoundedBoxGeometry(w, h + (i % 2) * .5, d, 3, .16), mat(0xEDEAE2, { roughness:.78 })); body.position.set(ox + i * pitch, (h + (i % 2) * .5) / 2, 0); body.castShadow = body.receiveShadow = true; g.add(body);
    const wm = new THREE.MeshStandardMaterial({ color:cWin.clone(), emissive:0x000000, roughness:.35 });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(w * .6, h * .4), wm); win.position.set(ox + i * pitch, h * .5, d / 2 + .015); g.add(win); wins.push(wm);
    const awn = new THREE.Mesh(new RoundedBoxGeometry(w * .9, .22, 1.0, 2, .06), mat(0x3C4049, { roughness:.6 })); awn.position.set(ox + i * pitch, h * .78, d / 2 + .4); awn.castShadow = true; g.add(awn);
  }
  const roof = new THREE.Mesh(new RoundedBoxGeometry(n * pitch + .4, .3, d + .4, 2, .08), mat(0xE4E1D8, { roughness:.8 })); roof.position.y = h + .55; roof.castShadow = true; g.add(roof);
  return Object.assign(g, { h:h + .8, light(p) { for (const m of wins) { m.color.copy(tmp.copy(cWin).lerp(cLit, p)); m.emissive.copy(tmp.copy(black).lerp(cGlow, p)); } } });
}

/* the installer's van: the library van with a ladder rack on the roof */
export function installerVan() {
  const g = van(); const L = 6.2, W = 2.6, H = 2.2, R = .46, top = R + H + .12;
  const rail = mat(0x2A2B30, { roughness:.55 });
  for (const z of [-W * .34, W * .34]) { const bar = new THREE.Mesh(new THREE.BoxGeometry(L * .92, .1, .1), rail); bar.position.set(-.05, top + .35, z); g.add(bar); }
  for (const x of [-L * .38, 0, L * .38]) { const cross = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, W * .72), rail); cross.position.set(x, top + .35, 0); g.add(cross);
    for (const z of [-W * .34, W * .34]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.1, .35, .1), rail); leg.position.set(x, top + .17, z); g.add(leg); } }
  const ladder = new THREE.Mesh(new THREE.BoxGeometry(L * .8, .12, .5), mat(0xC9C7C0, { roughness:.7 })); ladder.position.set(-.2, top + .48, 0); ladder.castShadow = true; g.add(ladder);
  return g;
}

/* a floating platform slab: a plain frosted slab (no canvas) that stands on the pillars in the "underneath" section */
export function platformSlab({ w = 26, h = 1.1, d = 12 } = {}) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, .4), new THREE.MeshPhysicalMaterial({ color:0xF7F5EF, roughness:.3, clearcoat:.5, clearcoatRoughness:.3, envMapIntensity:1.2 }));
  m.castShadow = true; m.receiveShadow = true; return m;
}

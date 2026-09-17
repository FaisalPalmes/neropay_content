/* NC01 — the objects this episode adds, kept beside it so the shared library (`motion/lib/`) is not touched by the
   social session. Same rules as objects3d.js: primitives only, matte, one contact shadow, nothing generated, nothing
   enters from above. Canvas textures are drawn per frame through draw(fn) so the composition owns every pixel of
   text — and the text is ours, never a screenshot of the product.
   v2, 17 Sep 2026 (Faisal's notes on v1): more detail in the bank and the van, glass pillars with a mark set in them,
   a shelf for the stack, a pulse that runs the payment path, and every object footed so nothing cuts the floor.   */
import * as THREE from '../../assets/vendor/three.module.js';
import { RoundedBoxGeometry } from '../../assets/vendor/RoundedBoxGeometry.js';
import { neroTerminal, C } from '../../lib/objects3d.js';
import { glassMat, rimShell, MARKS } from '../../lib/glass.js';

const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness:.62, metalness:0, ...o });
const d2r = THREE.MathUtils.degToRad;
const PAPER = 0xEDEAE2, PAPER2 = 0xF6F4EE, INK = 0x1E1F23, DARK = 0x2A2B30, GLASSC = 0x1E2026;

/* a mark etched into a surface: white with a soft ink shadow (the glass.js look), on a transparent plane */
function etch(mark, size = 2.2, { ink = false } = {}) {
  const c = document.createElement('canvas'); c.width = c.height = 512; const x = c.getContext('2d');
  x.save(); x.translate(256, 256); x.lineCap = 'round'; x.lineJoin = 'round';
  const passes = ink ? [[0, 0, '#141416', .9]] : [[6, 8, '#141416', .16], [0, 0, '#FFFFFF', .9]];
  for (const [dx, dy, col, a] of passes) { x.save(); x.translate(dx, dy); x.globalAlpha = a; x.strokeStyle = x.fillStyle = col; MARKS[mark](x, 512); x.restore(); }
  x.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map:t, transparent:true, opacity:.9, depthWrite:false }));
}

/* a word set into a surface — a canvas plane with mono uppercase text, ink. WebGL paints over the CSS layer, so a label
   that has to sit ON an object (a pillar's word) is one of these, not a sign. w is the plane width; the height follows. */
export function textPlane(text, { w = 2.8, weight = 700, family = '"Martian Mono"', color = '#141416', ls = 5, ratio = 5 } = {}) {
  const c = document.createElement('canvas'); c.width = 1280; c.height = Math.round(1280 / ratio); const x = c.getContext('2d');
  x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle'; x.letterSpacing = ls + 'px';
  let size = c.height * .62; x.font = `${weight} ${size}px ${family}`; while (x.measureText(text).width > c.width * .92 && size > 20) { size -= 4; x.font = `${weight} ${size}px ${family}`; }
  x.fillText(text, c.width / 2, c.height / 2 + size * .04);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, w / ratio), new THREE.MeshBasicMaterial({ map:t, transparent:true, depthWrite:false }));
}

/* the wordmark set into a surface: Nero in ink, Pay in the accent (light ground) */
export function wordmarkPlane(w = 4) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 256; const x = c.getContext('2d');
  x.font = '800 176px Chivo'; x.textBaseline = 'middle'; x.letterSpacing = '-8px';
  const nw = x.measureText('Nero').width, pw = x.measureText('Pay').width, x0 = (1024 - nw - pw) / 2;
  x.fillStyle = '#141416'; x.fillText('Nero', x0, 132); x.fillStyle = '#F5C518'; x.fillText('Pay', x0 + nw, 132);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return new THREE.Mesh(new THREE.PlaneGeometry(w, w / 4), new THREE.MeshBasicMaterial({ map:t, transparent:true, depthWrite:false }));
}

/* a canvas-faced slab: a frosted white rounded box standing upright with a slight lean, its front carrying a canvas the
   composition draws into. The base for the dashboard, the till screen, the ledger strip and the document. Footed: the
   group's origin is on the floor, so the slab never cuts it whatever the lean. */
export function canvasSlab({ w = 20, h = 13, d = .7, lean = -7, px = 60, tone = 0xF7F5EF, glass = true } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, Math.min(w, h) * .05),
    glass ? new THREE.MeshPhysicalMaterial({ color:tone, roughness:.28, metalness:0, clearcoat:.5, clearcoatRoughness:.3, envMapIntensity:1.2 }) : mat(tone, { roughness:.85 }));
  body.castShadow = true; body.receiveShadow = true; g.add(body);
  const c = document.createElement('canvas'); c.width = Math.round(w * px); c.height = Math.round(h * px); const ctx = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 4;
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w - .3, h - .3), new THREE.MeshBasicMaterial({ map:tex, transparent:true }));
  face.position.z = d / 2 + .012; g.add(face);
  const rim = new THREE.Mesh(body.geometry, new THREE.MeshBasicMaterial({ color:0x141416, transparent:true, opacity:.08, side:THREE.BackSide, depthWrite:false }));
  rim.scale.setScalar(1.012); g.add(rim);
  const stand = new THREE.Group(); g.rotation.x = d2r(lean); g.position.y = h / 2 * Math.cos(d2r(lean)) + (d / 2) * Math.abs(Math.sin(d2r(lean))) + .04; stand.add(g);
  return Object.assign(stand, { w, h, canvas:c, draw(fn) { ctx.save(); ctx.clearRect(0, 0, c.width, c.height); fn(ctx, c.width, c.height); ctx.restore(); tex.needsUpdate = true; } });
}

/* our terminal with a swappable badge: the wordmark plane at the bottom-left of the front is replaced by a canvas the
   composition can crossfade from the NeroPay wordmark to a placeholder mark (YOUR BRAND). Re-badged, not repainted. */
export function brandTerminal(opts = {}) {
  const t = neroTerminal(opts);
  let wm = null;
  t.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && Math.abs(o.geometry.parameters.width - 2.2) < .01 && Math.abs(o.geometry.parameters.height - .55) < .01) wm = o; });
  const c = document.createElement('canvas'); c.width = 512; c.height = 128; const x = c.getContext('2d');
  const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const paint = p => {
    x.clearRect(0, 0, 512, 128);
    x.save(); x.globalAlpha = 1 - p; x.font = '800 84px Chivo'; x.textBaseline = 'middle'; x.letterSpacing = '-4px';
    const nw = x.measureText('Nero').width; x.fillStyle = '#FFFFFF'; x.fillText('Nero', 6, 64); x.fillStyle = '#F5C518'; x.fillText('Pay', 6 + nw, 64); x.restore();
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

/* a flat sheet standing on its edge (a document, a contract, a notice) */
export function sheet({ w = 8, h = 10.4, lean = -9 } = {}) { return canvasSlab({ w, h, d:.16, lean, px:70, tone:0xFBF9F2, glass:false }); }

/* a frosted tile with a payment mark set in it — pale yellow, blush or lilac glass that still reads on white (the shared
   glassTile is too clear for the intro), a thin rim, an ink mark. For the intro's flourish around the terminal. */
export function markTile({ s = 4.4, d = .6, tint = 0xFFE9A8, mark = 'wave' } = {}) {
  const g = new THREE.Group();
  const geo = new RoundedBoxGeometry(s, s, d, 5, s * .12);
  const body = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color:tint, transparent:true, opacity:.78, roughness:.14, metalness:0, clearcoat:1, clearcoatRoughness:.08, envMapIntensity:2.6 }));
  body.castShadow = true; body.renderOrder = 6; g.add(body); g.add(rimShell(geo, 1.02));
  const e = etch(mark, s * .62, { ink:true }); e.position.z = d / 2 + .02; e.renderOrder = 7; g.add(e);
  return g;
}

/* the contactless ripple: thin yellow rings that grow out of a point and fade — set(p) for each ring */
export function ripple(n = 3, { r = 1.2, tube = .07 } = {}) {
  const g = new THREE.Group(); const R = [];
  for (let i = 0; i < n; i++) { const m = new THREE.Mesh(new THREE.TorusGeometry(r, tube, 12, 64), new THREE.MeshBasicMaterial({ color:C.accent, transparent:true, opacity:0, depthWrite:false })); m.visible = false; g.add(m); R.push(m); }
  return Object.assign(g, { set(i, p) { const m = R[i]; m.visible = p > 0 && p < 1; m.scale.setScalar(1 + p * 3.2); m.material.opacity = (1 - p) * .9; } });
}

/* a shelf: a low frosted slab the stack stands on, so five objects read as one set */
export function shelf({ w = 34, d = 9, h = .7, mark = false } = {}) {
  const g = new THREE.Group();
  if (mark) { const m = wordmarkPlane(h * 3.2); m.position.set(0, h / 2, d / 2 + .02); g.add(m); }
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 4, .3), new THREE.MeshPhysicalMaterial({ color:0xF7F5EF, roughness:.3, clearcoat:.5, clearcoatRoughness:.3, envMapIntensity:1.2 }));
  m.position.y = h / 2; m.castShadow = true; m.receiveShadow = true; g.add(m);
  const rim = new THREE.Mesh(m.geometry, new THREE.MeshBasicMaterial({ color:0x141416, transparent:true, opacity:.07, side:THREE.BackSide, depthWrite:false })); rim.position.y = h / 2; rim.scale.setScalar(1.01); g.add(rim);
  return Object.assign(g, { top:h });
}

/* a glass pillar with a mark set into its face — the rails underneath. setRise(p) grows it from the floor. */
export function glassPillar({ w = 3.4, h = 12, d = 3.0, tint = 'w', mark = 'wave', label = '' } = {}) {
  const g = new THREE.Group();
  const geo = new RoundedBoxGeometry(w, h, d, 4, .3);
  const body = new THREE.Mesh(geo, new THREE.MeshPhysicalMaterial({ color:0xF7F5EF, transparent:true, opacity:.62, roughness:.12, metalness:0, clearcoat:1, clearcoatRoughness:.06, envMapIntensity:3, depthWrite:true }));
  body.castShadow = true; body.receiveShadow = true; body.renderOrder = 6; g.add(body);
  const rim = rimShell(geo, 1.02); g.add(rim);
  const cap = new THREE.Mesh(new RoundedBoxGeometry(w + .5, .35, d + .5, 3, .12), mat(0xF1EFE8, { roughness:.6 })); cap.position.y = h / 2 + .17; cap.castShadow = true; g.add(cap);
  const foot = new THREE.Mesh(new RoundedBoxGeometry(w + .7, .45, d + .7, 3, .14), mat(0xE8E5DC, { roughness:.7 })); foot.position.y = -h / 2 - .2; foot.receiveShadow = true; g.add(foot);
  const e = etch(mark, w * .62, { ink:true }); e.position.set(0, h * .22, d / 2 + .03); e.renderOrder = 7; g.add(e);
  if (label) { const tp = textPlane(label, { w:w * .92, ratio:3.4 }); tp.position.set(0, -h * .12, d / 2 + .03); tp.renderOrder = 7; g.add(tp); }
  const wrap = new THREE.Group(); wrap.add(g); g.position.y = h / 2 + .45;
  let rise = 0;
  const place = () => { const s = Math.max(rise, .001); g.scale.y = s; g.position.y = (h / 2 + .45) * s; wrap.visible = rise > 0; };
  place();
  return Object.assign(wrap, { h:h + .9, setRise(p) { rise = p; place(); }, top() { return new THREE.Vector3(0, (h + .9) * Math.max(rise, .001), 0); } });
}

/* a bank: two steps, four fluted columns, an entablature, a pediment with a £ set into it, a door, two windows. Paper tones;
   light(p) warms the windows and the door to the accent. Footed at y 0. */
export function bank({ w = 8.4, d = 6, h = 4.2 } = {}) {
  const g = new THREE.Group();
  const cWin = new THREE.Color(0x2B2F38), cLit = new THREE.Color(C.accent), cGlow = new THREE.Color(C.accent).multiplyScalar(.5), black = new THREE.Color(0), tmp = new THREE.Color();
  const step1 = new THREE.Mesh(new RoundedBoxGeometry(w + 1.6, .35, d + 1.6, 2, .1), mat(0xE8E5DC, { roughness:.8 })); step1.position.y = .175; step1.receiveShadow = true; g.add(step1);
  const step2 = new THREE.Mesh(new RoundedBoxGeometry(w + .8, .35, d + .8, 2, .1), mat(0xEDEAE2, { roughness:.8 })); step2.position.y = .525; step2.receiveShadow = true; step2.castShadow = true; g.add(step2);
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 3, .18), mat(PAPER, { roughness:.78 })); body.position.set(0, .7 + h / 2, -.6); body.castShadow = body.receiveShadow = true; g.add(body);
  const winM = new THREE.MeshStandardMaterial({ color:cWin.clone(), emissive:0x000000, roughness:.35 }); const wins = [winM];
  for (const x of [-w * .3, w * .3]) { const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.9), winM); win.position.set(x, .7 + h * .55, d / 2 - .6 + .015); g.add(win); }
  const doorM = new THREE.MeshStandardMaterial({ color:0x0E1013, emissive:0x000000, roughness:.8 }); wins.push(doorM);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 2.6), doorM); door.position.set(0, .7 + 1.3, d / 2 - .6 + .015); g.add(door);
  const colGeo = new THREE.CylinderGeometry(.34, .38, h + .3, 18);
  for (let i = 0; i < 4; i++) { const col = new THREE.Mesh(colGeo, mat(PAPER2, { roughness:.75 })); col.position.set(-w * .36 + i * (w * .24), .7 + (h + .3) / 2, d / 2 + .3); col.castShadow = true; g.add(col);
    const base = new THREE.Mesh(new RoundedBoxGeometry(.9, .22, .9, 2, .06), mat(0xE4E1D8)); base.position.set(col.position.x, .81, d / 2 + .3); g.add(base); }
  const ent = new THREE.Mesh(new RoundedBoxGeometry(w + .6, .6, d + 1.3, 3, .1), mat(0xE4E1D8, { roughness:.8 })); ent.position.set(0, .7 + h + .3, -.15); ent.castShadow = true; g.add(ent);
  const ped = new THREE.Shape(); ped.moveTo(-(w + .6) / 2, 0); ped.lineTo((w + .6) / 2, 0); ped.lineTo(0, 1.9); ped.closePath();
  const pedM = new THREE.Mesh(new THREE.ExtrudeGeometry(ped, { depth:d + 1.1, bevelEnabled:false }), mat(0xEDEAE2, { roughness:.8 })); pedM.position.set(0, .7 + h + .6, -.15 - (d + 1.1) / 2); pedM.castShadow = true; g.add(pedM);
  const e = etch('pound', 1.3, { ink:true }); e.position.set(0, .7 + h + 1.3, d / 2 + .5); g.add(e);
  return Object.assign(g, { h:.7 + h + 2.6, light(p) { winM.color.copy(tmp.copy(cWin).lerp(cLit, p)); winM.emissive.copy(tmp.copy(black).lerp(cGlow, p)); doorM.emissive.copy(tmp.copy(black).lerp(cGlow, p * .6)); } });
}

/* the installer's van, detailed: body and cab in one line, a windscreen and side glass, wheel arches, bumpers, headlights,
   mirrors, a roof rack with a ladder, a thin yellow band. Drives along its own x. */
export function installerVan({ L = 6.6, color = 0xF4F2EC } = {}) {
  const g = new THREE.Group(); const W = 2.7, H = 2.3, R = .48;
  const body = new THREE.Mesh(new RoundedBoxGeometry(L * .6, H, W, 4, .22), mat(color, { roughness:.5 })); body.position.set(-L * .2, R + H / 2, 0); body.castShadow = true; g.add(body);
  const cab = new THREE.Mesh(new RoundedBoxGeometry(L * .42, H * .84, W, 4, .34), mat(color, { roughness:.5 })); cab.position.set(L * .3, R + H * .42, 0); cab.castShadow = true; g.add(cab);
  const glassM = mat(GLASSC, { roughness:.2, metalness:.25 });
  const shield = new THREE.Mesh(new RoundedBoxGeometry(.22, H * .38, W * .86, 2, .06), glassM); shield.position.set(L * .5, R + H * .58, 0); shield.rotation.z = -.28; g.add(shield);
  for (const s of [-1, 1]) { const side = new THREE.Mesh(new THREE.PlaneGeometry(L * .28, H * .3), glassM); side.position.set(L * .3, R + H * .6, s * (W / 2 + .012)); if (s < 0) side.rotation.y = Math.PI; g.add(side);
    const rear = new THREE.Mesh(new THREE.PlaneGeometry(L * .34, H * .26), mat(0xE8E5DC, { roughness:.7 })); rear.position.set(-L * .28, R + H * .62, s * (W / 2 + .012)); if (s < 0) rear.rotation.y = Math.PI; g.add(rear);
    const band = new THREE.Mesh(new THREE.PlaneGeometry(L * .58, .16), mat(C.accent, { roughness:.6 })); band.position.set(-L * .2, R + H * .3, s * (W / 2 + .012)); if (s < 0) band.rotation.y = Math.PI; g.add(band);
    const mirror = new THREE.Mesh(new RoundedBoxGeometry(.18, .28, .22, 2, .05), mat(DARK)); mirror.position.set(L * .44, R + H * .62, s * (W / 2 + .2)); g.add(mirror); }
  for (const [x, col] of [[L * .5 + .02, 0xFFF1C2], [-L * .5 - .02, 0xD6322A]]) for (const s of [-1, 1]) { const lamp = new THREE.Mesh(new RoundedBoxGeometry(.08, .28, .5, 2, .04), new THREE.MeshStandardMaterial({ color:col, emissive:col, emissiveIntensity:.5, roughness:.4 })); lamp.position.set(x, R + H * .32, s * W * .32); g.add(lamp); }
  for (const x of [L * .5 + .04, -L * .5 - .04]) { const bumper = new THREE.Mesh(new RoundedBoxGeometry(.16, .3, W * .96, 2, .06), mat(DARK, { roughness:.7 })); bumper.position.set(x, R + .35, 0); g.add(bumper); }
  const wheelG = new THREE.CylinderGeometry(R, R, .5, 24), archG = new THREE.CylinderGeometry(R + .16, R + .16, .12, 24, 1, false, 0, Math.PI), wheelM = mat(0x232428, { roughness:.85 }), hubM = mat(0xC9C7C0, { roughness:.4, metalness:.3 });
  for (const [x, z] of [[L * .3, W / 2], [L * .3, -W / 2], [-L * .3, W / 2], [-L * .3, -W / 2]]) {
    const wh = new THREE.Mesh(wheelG, wheelM); wh.rotation.x = Math.PI / 2; wh.position.set(x, R, z); wh.castShadow = true; g.add(wh);
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(R * .45, R * .45, .52, 16), hubM); hub.rotation.x = Math.PI / 2; hub.position.set(x, R, z); g.add(hub);
    const arch = new THREE.Mesh(archG, mat(DARK, { roughness:.8 })); arch.rotation.x = Math.PI / 2; arch.rotation.y = 0; arch.position.set(x, R, z + (z > 0 ? .02 : -.02)); g.add(arch); }
  const top = R + H + .1, rail = mat(DARK, { roughness:.55 });
  for (const z of [-W * .34, W * .34]) { const bar = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, L * .92, 10), rail); bar.rotation.z = Math.PI / 2; bar.position.set(-.05, top + .36, z); g.add(bar); }
  for (const x of [-L * .38, 0, L * .38]) { const cross = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, W * .72, 10), rail); cross.rotation.x = Math.PI / 2; cross.position.set(x, top + .36, 0); g.add(cross);
    for (const z of [-W * .34, W * .34]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(.1, .34, .1), rail); leg.position.set(x, top + .17, z); g.add(leg); } }
  const ladM = mat(0xC9C7C0, { roughness:.6, metalness:.2 });
  for (const z of [-.2, .2]) { const rung = new THREE.Mesh(new THREE.BoxGeometry(L * .82, .08, .08), ladM); rung.position.set(-.2, top + .5, z); g.add(rung); }
  for (let i = 0; i < 7; i++) { const step = new THREE.Mesh(new THREE.BoxGeometry(.07, .07, .42), ladM); step.position.set(-.2 - L * .38 + i * (L * .82 / 6), top + .5, 0); g.add(step); }
  return g;
}

/* the payment path: a yellow line that draws along the floor from a to b (local x/z), and pulses — small dark dots that run
   its length while it is complete. set(p) draws 0..1; pulse(t) moves the dots. */
export function pathLine(a, b, { w = .34, dots = 3 } = {}) {
  const g = new THREE.Group();
  const dx = b.x - a.x, dz = b.z - a.z, L = Math.hypot(dx, dz), ang = Math.atan2(-dz, dx);
  const line = new THREE.Mesh(new THREE.BoxGeometry(1, .05, w), mat(C.accent, { roughness:.6 })); line.position.y = .03; g.add(line);
  const D = []; for (let i = 0; i < dots; i++) { const dot = new THREE.Mesh(new THREE.SphereGeometry(.34, 18, 14), mat(0x141416, { roughness:.4 })); dot.position.y = .38; dot.castShadow = true; dot.visible = false; g.add(dot); D.push(dot); }
  g.position.set(a.x, 0, a.z); g.rotation.y = ang;
  let P = 0;
  return Object.assign(g, { L, set(p) { P = p; const l = Math.max(.001, L * p); line.scale.x = l; line.position.x = l / 2; g.visible = p > 0; },
    pulse(t, speed = 9) { D.forEach((d, i) => { if (P < 1) { d.visible = i === 0 && P > .01; d.position.x = L * P; return; } const u = ((t * speed + i * (L / dots)) % L); d.visible = true; d.position.x = u; }); } });
}

/* a small cluster of shopfronts under one roofline — "a group of merchants" — paper tone; light(p) lights every window */
export function shopGroup(n = 4, { w = 3.6, h = 3.0, d = 3.0, gap = .35 } = {}) {
  const g = new THREE.Group(); const pitch = w + gap, ox = -((n - 1) * pitch) / 2;
  const cWin = new THREE.Color(0x2B2F38), cLit = new THREE.Color(C.accent), cGlow = new THREE.Color(C.accent).multiplyScalar(.5), black = new THREE.Color(0), tmp = new THREE.Color();
  const wins = [];
  for (let i = 0; i < n; i++) { const hh = h + (i % 2) * .5;
    const body = new THREE.Mesh(new RoundedBoxGeometry(w, hh, d, 3, .16), mat(PAPER, { roughness:.78 })); body.position.set(ox + i * pitch, hh / 2, 0); body.castShadow = body.receiveShadow = true; g.add(body);
    const wm = new THREE.MeshStandardMaterial({ color:cWin.clone(), emissive:0x000000, roughness:.35 });
    const win = new THREE.Mesh(new THREE.PlaneGeometry(w * .56, h * .38), wm); win.position.set(ox + i * pitch - w * .1, h * .52, d / 2 + .015); g.add(win); wins.push(wm);
    const door = new THREE.Mesh(new THREE.PlaneGeometry(w * .18, h * .56), mat(0x0E1013, { roughness:.8 })); door.position.set(ox + i * pitch + w * .32, h * .28, d / 2 + .015); g.add(door);
    const awn = new THREE.Mesh(new RoundedBoxGeometry(w * .9, .22, 1.0, 2, .06), mat(0x3C4049, { roughness:.6 })); awn.position.set(ox + i * pitch, h * .78, d / 2 + .4); awn.castShadow = true; g.add(awn); }
  const roof = new THREE.Mesh(new RoundedBoxGeometry(n * pitch + .4, .3, d + .4, 2, .08), mat(0xE4E1D8, { roughness:.8 })); roof.position.y = h + .7; roof.castShadow = true; g.add(roof);
  return Object.assign(g, { h:h + .9, light(p) { for (const m of wins) { m.color.copy(tmp.copy(cWin).lerp(cLit, p)); m.emissive.copy(tmp.copy(black).lerp(cGlow, p)); } } });
}

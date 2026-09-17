/* Liquid-glass texture objects for the white world — PP01 v4, 17 Sep 2026.
   Faisal's note on v3: no 3D balls; a few subtle fintech elements instead, to give the space texture and lift, with the
   liquid-glass look — light catching a frosted surface, a mark embedded inside the glass. Reference only, not copied.

   Everything here is a pale tinted glass slab with a clearcoat (the sun and the room environment give the highlights) and,
   inside it, an etched mark drawn to a canvas: the contactless wave, a pound sign, a percent, a tick, a sparkline. Never a
   number — the figures on screen belong to the modules and their conditions. Never a brand, never a card number, never a
   competitor's colour: the tints are the house blush, lilac and yellow. Shadows off; they float, they do not sit.

   Objects: glassCard (a payment-card slab), glassRing (a torus), glassCoin (a thin disc with a glyph), glassTile (a
   square slab with a glyph). All are groups; call `spin(g, t)` per frame to keep them moving. */
import * as THREE from '../assets/vendor/three.module.js';
import { RoundedBoxGeometry } from '../assets/vendor/RoundedBoxGeometry.js';

export const TINT = { y:0xFFE9A8, b:0xFAD9D2, l:0xE4DAFA, w:0xF7F5EF };

export function glassMat(tint = 'w', { opacity = .3, roughness = .05 } = {}) {
  /* no transmission: the WebGL layer is drawn over a transparent clear, so a refracting material would sample nothing
     and go dark. The glass reads from three things instead — a low opacity so the paper and the type show through,
     the room environment reflected off a near-mirror clearcoat (the light "hitting" it), and a dark rim (rimShell). */
  return new THREE.MeshPhysicalMaterial({
    color: TINT[tint] ?? tint, transparent:true, opacity, roughness, metalness:0,
    clearcoat:1, clearcoatRoughness:.04, envMapIntensity:6, specularIntensity:1.0, specularColor:0xffffff, ior:1.5,
    depthWrite:false, side:THREE.FrontSide });
}

/* the pencil-world outline for a glass object: the same geometry, back faces only, a touch larger, ink at low alpha —
   a soft dark edge where the surface turns away, which is what makes a pale glass read on a pale ground */
export function rimShell(geometry, scale = 1.025) {
  const m = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color:0x141416, transparent:true, opacity:.09, side:THREE.BackSide, depthWrite:false }));
  m.scale.setScalar(scale); m.renderOrder = 4; m.castShadow = false; return m;
}

/* the mark inside the glass: white with a soft ink shadow, so it reads as embossed under the surface */
function etchTexture(draw, size = 512) {
  const c = document.createElement('canvas'); c.width = c.height = size; const x = c.getContext('2d');
  x.clearRect(0, 0, size, size);
  x.save(); x.translate(size / 2, size / 2);
  x.lineCap = 'round'; x.lineJoin = 'round';
  /* shadow pass (ink, offset) then the light pass */
  for (const [dx, dy, col, a] of [[6, 8, '#141416', .16], [0, 0, '#FFFFFF', .85]]) {
    x.save(); x.translate(dx, dy); x.globalAlpha = a; x.strokeStyle = x.fillStyle = col; draw(x, size); x.restore();
  }
  x.restore();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t;
}

export const MARKS = {
  wave: (x, s) => { x.lineWidth = s * .05; for (const r of [s * .10, s * .19, s * .28]) { x.beginPath(); x.arc(-s * .1, 0, r, -Math.PI / 3.2, Math.PI / 3.2); x.stroke(); } },
  pound: (x, s) => { x.font = `700 ${s * .62}px Poppins, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('£', 0, s * .02); },
  percent: (x, s) => { x.font = `700 ${s * .58}px Poppins, sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('%', 0, s * .02); },
  tick: (x, s) => { x.lineWidth = s * .07; x.beginPath(); x.moveTo(-s * .22, s * .02); x.lineTo(-s * .06, s * .18); x.lineTo(s * .26, -s * .18); x.stroke(); },
  spark: (x, s) => { x.lineWidth = s * .045; x.beginPath(); const pts = [[-.34, .14], [-.2, .06], [-.08, .12], [.04, -.04], [.16, .02], [.34, -.18]];
    pts.forEach(([px, py], i) => i ? x.lineTo(px * s, py * s) : x.moveTo(px * s, py * s)); x.stroke();
    x.beginPath(); x.arc(.34 * s, -.18 * s, s * .035, 0, 6.29); x.fill(); },
  chip: (x, s) => { x.lineWidth = s * .03; const w = s * .3, h = s * .22; x.strokeRect(-w / 2, -h / 2, w, h);
    x.beginPath(); x.moveTo(-w / 2, 0); x.lineTo(w / 2, 0); x.moveTo(-w / 6, -h / 2); x.lineTo(-w / 6, h / 2); x.moveTo(w / 6, -h / 2); x.lineTo(w / 6, h / 2); x.stroke(); },
};

function etchPlane(mark, w, h, { scale = 1, x = 0, y = 0 } = {}) {
  const tex = etchTexture(MARKS[mark]);
  const s = Math.min(w, h) * scale;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map:tex, transparent:true, opacity:.85, depthWrite:false }));
  m.position.set(x, y, 0); return m;
}

/* a payment-card slab, portrait or landscape by w/h, one mark set into it */
export function glassCard({ w = 16, h = 10, d = .9, tint = 'w', mark = 'wave', markScale = .55, markX = 0, markY = 0 } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, Math.min(w, h) * .09), glassMat(tint));
  body.castShadow = false; body.renderOrder = 6; g.add(body); g.add(rimShell(body.geometry));
  if (mark) { const e = etchPlane(mark, w, h, { scale:markScale, x:markX, y:markY }); e.position.z = d / 2 - .12; e.renderOrder = 5; g.add(e); }
  g.userData.kind = 'card'; return g;
}

/* a square tile with a glyph — a percent, a pound, a tick */
export function glassTile({ s = 9, d = 1.2, tint = 'w', mark = 'percent', markScale = .8 } = {}) {
  return glassCard({ w:s, h:s, d, tint, mark, markScale });
}

/* a torus, the reference's ring; no mark */
export function glassRing({ R = 8, r = 1.5, tint = 'w' } = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.TorusGeometry(R, r, 28, 96), glassMat(tint, { opacity:.4 }));
  m.castShadow = false; m.renderOrder = 6; g.add(m); g.add(rimShell(m.geometry, 1.02)); g.userData.kind = 'ring'; return g;
}

/* a thin disc with a glyph on its face */
export function glassCoin({ r = 5, d = .8, tint = 'y', mark = 'pound', markScale = .8 } = {}) {
  const g = new THREE.Group();
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, d, 72, 1), glassMat(tint, { opacity:.4 }));
  m.rotation.x = Math.PI / 2; m.castShadow = false; m.renderOrder = 6; g.add(m); const rs = rimShell(m.geometry); rs.rotation.x = Math.PI / 2; g.add(rs);
  if (mark) { const e = etchPlane(mark, r * 2, r * 2, { scale:markScale }); e.position.z = d / 2 + .02; e.renderOrder = 5; g.add(e); }
  g.userData.kind = 'coin'; return g;
}

/* per-frame drift: a slow bob and a slow turn, deterministic from the object's seed (no Math.random — renders must repeat) */
export function drift(o, t) {
  const { y0, x0, seed = 0, turn = .12, bob = .35 } = o.userData;
  o.position.y = y0 + bob * Math.sin(t * (.28 + seed * .05) + seed);
  o.position.x = x0 + .25 * Math.sin(t * .17 + seed * 1.7);
  o.rotation.y = o.userData.ry + turn * Math.sin(t * .21 + seed * .9);
  o.rotation.x = o.userData.rx + turn * .5 * Math.sin(t * .16 + seed * 2.3);
}

/* place a list of glass objects on a section: [kind, x, y, z, { rx, ry, rz, ...opts }] */
export function place(section, list, out = []) {
  const make = { card:glassCard, tile:glassTile, ring:glassRing, coin:glassCoin };
  list.forEach(([kind, x, y, z, opts = {}], i) => {
    const { rx = 0, ry = 0, rz = 0, ...rest } = opts;
    const g = make[kind](rest); g.position.set(x, y, z); g.rotation.set(rx, ry, rz);
    Object.assign(g.userData, { x0:x, y0:y, rx, ry, seed:out.length + i * 1.3 + 1 });
    section.add(g); out.push(g);
  });
  return out;
}

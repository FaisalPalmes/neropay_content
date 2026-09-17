/* One continuous 3D world for a motion graphics episode, v5 (16 Sep 2026).
 *
 * The v4 board was flat: a 2D paper with 3D objects drawn into canvases that sat on it, and a camera
 * that panned. Here the whole episode is a single three.js scene — a paper floor, a mat for each section,
 * the objects standing on it — and the type stands in the scene too, as DOM signs placed with the CSS3D
 * renderer under a transparent WebGL layer. One perspective camera flies from section to section, so the
 * cut between beats is a journey across the floor, with parallax, not a pan.
 *
 * Layering: the CSS3D layer (#board) is underneath, the WebGL canvas (#gl) on top. WebGL objects therefore
 * always occlude signs, which is right when the signs stand behind the objects — lay every section out that
 * way. The floor is transparent (shadows and a faint grain only) so the signs show through it.
 *
 *   const W = world(stage, { fov:28 });
 *   const S = W.section({ x, z, ry, az, el, bw, bh, cy });   // a group on the floor with its own camera pose
 *   S.add(neroTerminal());  S.sign(el, { x, y, z, face:true });
 *   W.setCamera(pose);  W.render();
 */
import * as THREE from '../assets/vendor/three.module.js';
import { CSS3DObject, CSS3DRenderer } from '../assets/vendor/CSS3DRenderer.js';
import { RoomEnvironment } from '../assets/vendor/RoomEnvironment.js';

export const K = 1 / 40;            /* world units per DOM px: a 120px heading is 3 units tall, a 14-unit terminal 560px */
const d2r = THREE.MathUtils.degToRad;

/* dark: the charcoal ground (motion/CLAUDE.md, "for the money videos") — the haze, the hemisphere's ground bounce, the
   grain and the default mat and route tones swap to the dark palette; the floor's shadow deepens so it still reads on
   near-black mats. Everything else — the sun, the room, the objects — is unchanged. First used by motion/partner/pp01. */
export function world(stage, { fov = 28, near = 1, far = 900, shadow = .17, grain = .07, env = .32, haze = true, dark = false } = {}) {
  const PAL = dark
    ? { fog:0x0A0B0D, hemiGround:0x1A1C21, grainTone:200, mat:'#141619', route:'#171A1F', shadow:Math.max(shadow, .55) }
    : { fog:0xF6F4EE, hemiGround:0xE6E4DD, grainTone:20,  mat:'#EFECE4', route:'#D6D3C8', shadow };
  /* CSS3D under, WebGL over */
  const css = new CSS3DRenderer();
  css.domElement.id = 'board'; Object.assign(css.domElement.style, { position:'absolute', left:0, top:0 });
  stage.appendChild(css.domElement);
  const canvas = document.createElement('canvas'); canvas.id = 'gl'; Object.assign(canvas.style, { position:'absolute', left:0, top:0, display:'block' });
  stage.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha:true, antialias:true, preserveDrawingBuffer:true });
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFShadowMap;   /* v5: PCF, not PCFSoft — the soft filter on a full-frame floor was most of the render cost */
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.NoToneMapping;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(fov, 1, near, far);
  const probe = new THREE.PerspectiveCamera(fov, 1, near, far);   /* for fitting a section's box, without touching the live camera */
  /* v6: a room environment for reflections on the glass and the shells (subtle, most of the light is still the
     hemisphere and the sun), and a faint paper-coloured haze so the far end of a flight sits back in the world */
  if (env > 0) { const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; scene.environmentIntensity = env; pm.dispose(); }
  if (haze) scene.fog = new THREE.Fog(PAL.fog, 140, 520);
  scene.add(new THREE.HemisphereLight(0xffffff, PAL.hemiGround, env > 0 ? 1.15 : 1.35));
  const sun = new THREE.DirectionalLight(0xffffff, 2.1); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.radius = 3; sun.shadow.bias = -0.0008;
  Object.assign(sun.shadow.camera, { left:-34, right:34, top:34, bottom:-34, near:1, far:120 });
  scene.add(sun); scene.add(sun.target);
  const fill = new THREE.DirectionalLight(0xFFF4D6, .35); fill.position.set(8, 4, -6); scene.add(fill);

  /* the floor: shadows only, plus a faint paper grain that fades with distance */
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.ShadowMaterial({ opacity:PAL.shadow, transparent:true }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  /* the floor is solid to the depth buffer but not to the eye: anything parked below it (a tile before it rises, a
     machine that has sunk) is hidden, while the CSS layer beneath still shows through. This is what makes rise()
     and sink() work with a perspective camera — a transparent ground hides nothing on its own. */
  const occ = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshBasicMaterial({ colorWrite:false }));
  occ.rotation.x = -Math.PI / 2; occ.position.y = -.02; occ.renderOrder = -10; scene.add(occ);
  if (grain > 0) {
    const gc = document.createElement('canvas'); gc.width = gc.height = 256; const gx = gc.getContext('2d');
    const img = gx.createImageData(256, 256); let s = 7;
    for (let i = 0; i < img.data.length; i += 4) { s = (s * 16807) % 2147483647; const v = (s / 2147483647); img.data[i] = img.data[i + 1] = img.data[i + 2] = PAL.grainTone; img.data[i + 3] = v < .12 ? Math.floor(255 * grain * (v / .12)) : 0; }
    gx.putImageData(img, 0, 0);
    const gt = new THREE.CanvasTexture(gc); gt.wrapS = gt.wrapT = THREE.RepeatWrapping; gt.repeat.set(200, 200); gt.anisotropy = 4;
    const gm = new THREE.Mesh(new THREE.PlaneGeometry(1600, 1600), new THREE.MeshBasicMaterial({ map:gt, transparent:true, depthWrite:false }));
    gm.rotation.x = -Math.PI / 2; gm.position.y = .01; scene.add(gm);
  }

  let W = 0, H = 0;
  const cssObjs = [];
  const v = {
    renderer, scene, camera, sun, css,
    /* the stage size — set once per crop before the first frame */
    resize(w, h) { W = w; H = h; renderer.setSize(w, h, false); css.setSize(w, h); camera.aspect = w / h; camera.updateProjectionMatrix(); probe.aspect = camera.aspect; probe.updateProjectionMatrix(); },
    size() { return { W, H }; },
    /* a mat: a slightly different paper tone under a section, so the floor reads as sections of one place.
       Drawn in the CSS layer (a flat DOM plane) so it can never paint over a sign — the WebGL layer above it
       carries only objects and their shadows, which fall on the mat as they should. */
    mat(x, z, w, d, { ry = 0, tone = PAL.mat, r = 2.5 } = {}) {
      const el = document.createElement('div'); Object.assign(el.style, { width:(w / K) + 'px', height:(d / K) + 'px', background:tone, borderRadius:(r / K) + 'px' });
      const o = new CSS3DObject(el); o.rotation.order = 'YXZ'; o.rotation.y = ry; o.rotation.x = -Math.PI / 2; o.position.set(x, 0, z); o.scale.setScalar(K);
      scene.add(o); return o; },
    /* a route on the floor between two points: a thin flat ribbon, the colour of a pencil line — CSS too */
    route(a, b, { w = .22, tone = PAL.route } = {}) {
      const d = b.clone().sub(a); const len = d.length();
      const el = document.createElement('div'); Object.assign(el.style, { width:(len / K) + 'px', height:(w / K) + 'px', background:tone });
      const o = new CSS3DObject(el); o.rotation.order = 'YXZ'; o.rotation.y = Math.atan2(-d.z, d.x); o.rotation.x = -Math.PI / 2;
      o.position.copy(a).lerp(b, .5); o.position.y = .004; o.scale.setScalar(K); scene.add(o); return o; },
    /* a DOM element standing in the world. Centre at (x,y,z) in the parent's frame, face:true turns it to
       the section's camera; scale in world units per px. Returns the CSS3DObject. */
    sign(el, parent, { x = 0, y = 0, z = 0, ry = 0, rx = 0, scale = K } = {}) {
      const o = new CSS3DObject(el); o.position.set(x, y, z); o.rotation.set(rx, ry, 0); o.scale.setScalar(scale);
      el.style.pointerEvents = 'none'; (parent || scene).add(o); cssObjs.push(o); return o; },
    /* camera pose: position and target in world units. The sun follows the target so the shadow map stays sharp. */
    setCamera(pos, target, R = 40) {
      camera.position.copy(pos); camera.lookAt(target); camera.updateMatrixWorld();
      const half = Math.max(34, R * .42); if (half !== sun.shadow.camera.right) { Object.assign(sun.shadow.camera, { left:-half, right:half, top:half, bottom:-half }); sun.shadow.camera.updateProjectionMatrix(); }
      sun.position.set(target.x - 10, target.y + 34, target.z + 12); sun.target.position.copy(target); sun.target.updateMatrixWorld(); },
    /* distance at which a bw x bh box, upright at the target, fills the frame at this aspect with a margin */
    fit(bw, bh, margin = 1.1) { const t = Math.tan(d2r(fov) / 2); return Math.max(bh / (2 * t), bw / (2 * t * camera.aspect)) * margin; },
    render() { scene.updateMatrixWorld(); renderer.render(scene, camera); css.render(scene, camera); },
    /* world -> stage px */
    project(p) { const q = p.clone().project(camera); return { x:(q.x + 1) / 2 * W, y:(1 - q.y) / 2 * H }; },
    /* a section: a group at (x, z) turned ry about y. Everything inside is laid out in its own frame — +z toward
       its camera, +x to the right of the view. The camera pose for the section is derived from az/el/box. */
    section({ x = 0, z = 0, ry = 0, az = -20, el = 18, box = { x:[-13, 13], y:[0, 30], z:[-4, 6] }, ty = null, margin = 1.08 } = {}) {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = ry; scene.add(g);
      const bw = box.x[1] - box.x[0], bh = box.y[1] - box.y[0], tyv = ty ?? bh / 2;
      const corners = []; for (const cx of box.x) for (const cy of box.y) for (const cz of box.z) corners.push(new THREE.Vector3(cx, cy, cz));
      const sec = { g, az, el, bw, bh, box, ty:tyv, margin,
        add: o => (g.add(o), o),
        sign: (elm, opts = {}) => v.sign(elm, g, { ry:(opts.face ? d2r(az) * .55 : 0), ...opts }),
        local: (lx, ly, lz) => (g.updateWorldMatrix(true, false), g.localToWorld(new THREE.Vector3(lx, ly, lz))),
        /* the camera pose that frames this section for the current aspect */
        /* the nearest camera on the section's view ray that keeps every corner of its box inside the frame (with the
           margin), for the current aspect — searched numerically, so elevation, depth and perspective are all accounted for */
        pose() { g.updateWorldMatrix(true, false); const a = d2r(az), e = d2r(el);
          const target = g.localToWorld(new THREE.Vector3(0, tyv, 0));
          const dir = g.localToWorld(new THREE.Vector3(Math.sin(a) * Math.cos(e), Math.sin(e), Math.cos(a) * Math.cos(e))).sub(g.localToWorld(new THREE.Vector3(0, 0, 0))).normalize();
          const W = corners.map(c => g.localToWorld(c.clone()));
          const lim = 1 / margin, q = new THREE.Vector3();
          const fits = R => { probe.position.copy(target).addScaledVector(dir, R); probe.lookAt(target); probe.updateMatrixWorld(); probe.matrixWorldInverse.copy(probe.matrixWorld).invert();
            for (const c of W) { q.copy(c).project(probe); if (Math.abs(q.x) > lim || Math.abs(q.y) > lim) return false; } return true; };
          let lo = 4, hi = 600; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (fits(m)) hi = m; else lo = m; }
          const R = hi; return { pos: target.clone().addScaledVector(dir, R), target, R }; } };
      return sec; },
  };
  return v;
}

/* a flight between two section poses: the target slides across, the camera pulls up and back through the middle
   to a wide view of the world (wideR: the distance that frames both sections), then settles into the next.
   p in 0..1, already eased. */
export function flight(a, b, p, { wideR = 200, high = .55 } = {}) {
  const s = Math.pow(Math.sin(Math.PI * p), .9);
  const target = a.target.clone().lerp(b.target, p);
  const da = a.pos.clone().sub(a.target).normalize(), db = b.pos.clone().sub(b.target).normalize();
  const dir = da.lerp(db, p); dir.y += high * s; dir.normalize();
  const R = a.R + (b.R - a.R) * p + Math.max(0, wideR - (a.R + (b.R - a.R) * p)) * s;
  return { pos: target.clone().addScaledVector(dir, R), target, R };
}

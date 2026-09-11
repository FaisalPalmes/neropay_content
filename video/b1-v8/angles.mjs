/* One place for the crop per shot. data/angles.json names an angle (a window on the 3840×2160 source) and the
   side Ava sits on; this turns that into the ffmpeg crop sandbox.sh applies and into her face position on the
   1920×1080 proxy, which build.mjs uses to keep every panel in the column she isn't in.
     node angles.mjs        → "<id> <angle> <ava> <ffmpeg -vf>" per shot, for sandbox.sh */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ANGLES = JSON.parse(fs.readFileSync(path.join(HERE, 'data/angles.json'), 'utf8'));
const SRC = { w: 3840, h: 2160, fx: 1950, fy: 900 };
export function cropFor(id) {
  const shot = ANGLES.shots[id];
  if (!shot) throw new Error('angles.json has no shot ' + id);
  const win = ANGLES.windows[shot.angle];
  if (!win) throw new Error('angles.json has no window ' + shot.angle);
  const p = shot.ava === 'L' ? win.p : shot.ava === 'R' ? 1 - win.p : 0.5;
  const x = Math.round(Math.min(Math.max(SRC.fx - p * win.w, 0), SRC.w - win.w));
  const vf = win.w === SRC.w ? 'scale=1920:1080:flags=lanczos' : `crop=${win.w}:${win.h}:${x}:${win.y},scale=1920:1080:flags=lanczos`;
  const face = { x: Math.round((SRC.fx - x) / win.w * 1920), y: Math.round((SRC.fy - win.y) / win.h * 1080) };
  return { angle: shot.angle, ava: shot.ava, x, y: win.y, w: win.w, h: win.h, vf, face };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const id of Object.keys(ANGLES.shots)) { const c = cropFor(id); console.log(id, c.angle, c.ava, c.vf); }
}

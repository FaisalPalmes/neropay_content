/* Quality check without watching: pulls a frame at every cut, overlay start, card and a
   few caption moments into out/qc/<VID>/, and measures the integrated loudness of the
   final file. Usage: node scripts/check.mjs B1 */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { renderStill, selectComposition } from '@remotion/renderer';
import { ROOT, OUT, CHROME, FFMPEG, serveUrl, ensure } from './lib.mjs';

const vid = process.argv[2];
/* optional: only frames whose name contains this text, e.g. `check B1 overlay` */
const only = process.argv[3];
if (!vid) { console.error('usage: node scripts/check.mjs <VID>'); process.exit(1); }
const dir = ensure(path.join(OUT, 'qc', vid));
const url = await serveUrl();
const composition = await selectComposition({ serveUrl: url, id: 'Main', inputProps: { vid }, browserExecutable: CHROME });
const tl = composition.props.timeline;

const frames = [];
tl.segments.forEach((s) => { frames.push([s.from + 4, s.kind + '-' + (s.id || '') + '-in']); if (s.kind === 'clip') frames.push([s.from + Math.floor(s.dur / 2), 'clip-' + s.id + '-mid']); });
tl.overlays.forEach((o) => { frames.push([o.from + 20, 'overlay-' + o.id + '-in']); frames.push([o.from + Math.floor(o.dur / 2), 'overlay-' + o.id + '-mid']); });
frames.push([30, 'disclosure']);
for (const [frame, name] of frames.filter((f) => !only || f[1].includes(only))) {
  if (frame < 0 || frame >= composition.durationInFrames) continue;
  await renderStill({ composition, serveUrl: url, frame, output: path.join(dir, String(frame).padStart(5, '0') + '-' + name + '.jpg'), imageFormat: 'jpeg', jpegQuality: 80, browserExecutable: CHROME, inputProps: { vid } });
}
console.log('wrote frames to ' + path.relative(ROOT, dir));

const final = path.join(OUT, vid + '-final.mp4');
if (fs.existsSync(final)) {
  const r = spawnSync(FFMPEG, ['-i', final, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = (r.stderr || '').match(/I:\s+(-?[\d.]+) LUFS[\s\S]*?Peak:\s+(-?[\d.]+) dBFS/);
  if (m) console.log('loudness ' + m[1] + ' LUFS, true peak ' + m[2] + ' dBFS (target -14 / -1.5)');
}

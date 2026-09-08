/* Renders a finished video. Usage:
     node scripts/render.mjs B1            full render → out/B1.mp4 (+ loudness-normalised out/B1-final.mp4)
     node scripts/render.mjs B1 --test     the first 20 seconds only, for a look before committing the time
   Runs the captions probe first so real clip lengths are used. */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { ROOT, OUT, CHROME, FFMPEG, serveUrl, ensure, mb } from './lib.mjs';

const args = process.argv.slice(2);
const vid = args.find((a) => !a.startsWith('--'));
if (!vid) { console.error('usage: node scripts/render.mjs <VID> [--test]'); process.exit(1); }
const test = args.includes('--test');
ensure(OUT);

const t0 = Date.now();
const probe = spawnSync('node', [path.join(ROOT, 'scripts', 'captions.mjs'), vid], { stdio: 'inherit' });
if (probe.status !== 0) process.exit(probe.status);

const url = await serveUrl();
const inputProps = { vid };
const composition = await selectComposition({ serveUrl: url, id: 'Main', inputProps, browserExecutable: CHROME });
const frames = composition.durationInFrames;
const range = test ? [0, Math.min(frames - 1, composition.fps * 20)] : null;
console.log(vid + ': ' + composition.width + '×' + composition.height + ', ' + (frames / composition.fps).toFixed(1) + 's' + (test ? ' — rendering the first 20s' : ''));

const raw = path.join(OUT, vid + (test ? '-test' : '') + '.mp4');
let last = -1;
await renderMedia({
  composition, serveUrl: url, codec: 'h264', outputLocation: raw, inputProps, browserExecutable: CHROME,
  concurrency: 3, crf: 18, audioBitrate: '192k', frameRange: range,
  onProgress: ({ progress }) => { const p = Math.floor(progress * 10); if (p > last) { last = p; process.stdout.write('  ' + p * 10 + '%'); } }
});
console.log('\nrendered ' + path.relative(ROOT, raw) + ' · ' + mb(raw));

/* YouTube plays at about -14 LUFS; normalise once, video untouched */
const final = raw.replace(/\.mp4$/, '-final.mp4');
const ln = spawnSync(FFMPEG, ['-y', '-loglevel', 'error', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', final], { stdio: 'inherit' });
if (ln.status === 0 && fs.existsSync(final)) console.log('normalised → ' + path.relative(ROOT, final) + ' · ' + mb(final));
else console.log('loudness pass failed; ' + path.relative(ROOT, raw) + ' is still a good file');
console.log('took ' + ((Date.now() - t0) / 60000).toFixed(1) + ' min');

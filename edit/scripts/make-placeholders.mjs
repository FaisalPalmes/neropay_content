/* Renders stand-in clips for every shot of a video into public/clips, so the pipeline can
   be run and checked before the Higgsfield renders arrive. Never overwrites a file that
   is already there, so real clips are safe. Usage: node scripts/make-placeholders.mjs B1 */
import fs from 'node:fs';
import path from 'node:path';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { ROOT, PUBLIC, CHROME, serveUrl, ensure } from './lib.mjs';

globalThis.window = globalThis;
await import('../../videos.js');
await import('../../calls.js');
const { clipIds } = await import('../src/timeline.js');

const vid = process.argv[2];
if (!vid) { console.error('usage: node scripts/make-placeholders.mjs <VID>'); process.exit(1); }
const dir = ensure(path.join(PUBLIC, 'clips'));
const ids = clipIds({ VIDEOS: window.VIDEOS, CALLS: window.CALLS }, vid);
const todo = ids.filter((c) => !c.optional && !fs.existsSync(path.join(dir, c.id + '.mp4')));
console.log(vid + ': ' + ids.length + ' clips, ' + todo.length + ' to render as placeholders');
if (!todo.length) process.exit(0);

const url = await serveUrl();
for (const c of todo) {
  const inputProps = { id: c.id, secs: c.secs, text: c.spoken || 'listening loop' };
  const composition = await selectComposition({ serveUrl: url, id: 'Placeholder', inputProps, browserExecutable: CHROME });
  await renderMedia({ composition, serveUrl: url, codec: 'h264', outputLocation: path.join(dir, c.id + '.mp4'), inputProps,
    browserExecutable: CHROME, concurrency: 2, crf: 28, onProgress: () => {} });
  console.log('  ' + c.id + ' · ' + c.secs + 's');
}
console.log('done — now run: npm run captions -- ' + vid);

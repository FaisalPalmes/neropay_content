/* Takes a folder of Higgsfield downloads, whatever they are called, and maps them to the
   shot ids the editor expects. Two passes:

     node scripts/ingest.mjs B1 /path/to/downloads
        → probes every video in the folder, proposes a shot id for each, and writes
          ingest/B1.csv. Read it, fix any line that's wrong, then:

     node scripts/ingest.mjs B1 /path/to/downloads --apply
        → copies each file to public/clips/<shot id>.mp4 according to the CSV.

   How the proposal is made: files are taken in the order they were created (the order you
   generated them), matched against the shot list in order, and each one is checked against
   the planned length. A file that is more than two seconds off gets a "?" so it stands out.
   If the shot id already appears in the filename (B1-03, C2-H1, LISTEN-2) that wins. */
import fs from 'node:fs';
import path from 'node:path';
import { parseMedia } from '@remotion/media-parser';
import { nodeReader } from '@remotion/media-parser/node';
import { ROOT, PUBLIC, ensure } from './lib.mjs';

globalThis.window = globalThis;
await import('../../videos.js');
await import('../../calls.js');
const { clipIds } = await import('../src/timeline.js');

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const vid = args[0], src = args[1], apply = process.argv.includes('--apply');
if (!vid || !src) { console.error('usage: node scripts/ingest.mjs <VID> <folder> [--apply]'); process.exit(1); }
const csvPath = path.join(ensure(path.join(ROOT, 'ingest')), vid + '.csv');
const shots = clipIds({ VIDEOS: window.VIDEOS, CALLS: window.CALLS }, vid);
const VIDEO = /\.(mp4|mov|m4v|webm)$/i;

if (apply) {
  if (!fs.existsSync(csvPath)) { console.error('no ' + path.relative(ROOT, csvPath) + ' yet — run without --apply first'); process.exit(1); }
  const rows = fs.readFileSync(csvPath, 'utf8').split('\n').slice(1).map((l) => l.split(',')).filter((r) => r.length >= 2 && r[0] && r[1]);
  const dir = ensure(path.join(PUBLIC, 'clips'));
  let n = 0;
  for (const [file, id] of rows) {
    const clean = id.replace('?', '').trim();
    if (!clean || clean === '-') continue;
    const from = path.join(src, file.trim());
    if (!fs.existsSync(from)) { console.log('  missing ' + file); continue; }
    fs.copyFileSync(from, path.join(dir, clean + '.mp4')); n++;
    console.log('  ' + file.trim() + '  →  clips/' + clean + '.mp4');
  }
  console.log(n + ' clips in place. Next: npm run render -- ' + vid + ' --test');
  process.exit(0);
}

const files = fs.readdirSync(src).filter((f) => VIDEO.test(f))
  .map((f) => ({ f, t: fs.statSync(path.join(src, f)).birthtimeMs || fs.statSync(path.join(src, f)).mtimeMs }))
  .sort((a, b) => a.t - b.t).map((x) => x.f);
if (!files.length) { console.error('no video files in ' + src); process.exit(1); }

const probed = [];
for (const f of files) {
  const { durationInSeconds } = await parseMedia({ src: path.join(src, f), fields: { durationInSeconds: true }, reader: nodeReader, acknowledgeRemotionLicense: true });
  probed.push({ f, dur: +durationInSeconds.toFixed(2) });
}

/* pass 1: ids named in the filename; "intro" anywhere in the name means the presenter's intro */
const taken = new Set(), rows = [];
probed.forEach((p) => {
  let hit = shots.find((s) => new RegExp('(^|[^A-Z0-9])' + s.id.replace(/-/g, '[-_ ]') + '([^0-9]|$)', 'i').test(p.f));
  if (!hit && /intro/i.test(p.f)) hit = shots.find((s) => s.optional);
  if (hit && !taken.has(hit.id)) { taken.add(hit.id); rows.push({ ...p, id: hit.id, how: 'named', planned: hit.secs }); }
  else rows.push({ ...p, id: null });
});
/* pass 2: the rest in creation order, against the required shots not yet taken */
const rest = shots.filter((s) => !taken.has(s.id) && !s.optional);
let k = 0;
rows.forEach((r) => {
  if (r.id) return;
  const s = rest[k++];
  if (!s) { r.id = '-'; r.how = 'extra'; return; }
  r.id = s.id; r.planned = s.secs; r.how = 'order';
  if (Math.abs(r.dur - s.secs) > 2) r.id = r.id + '?';
});

const csv = 'file,shot,seconds,planned,how\n' + rows.map((r) => [r.f, r.id, r.dur, r.planned || '', r.how].join(',')).join('\n') + '\n';
fs.writeFileSync(csvPath, csv);
console.log(vid + ': ' + files.length + ' files, ' + shots.length + ' shots expected.\n');
rows.forEach((r) => console.log('  ' + r.f.padEnd(46) + '→ ' + String(r.id).padEnd(10) + r.dur + 's' + (r.planned ? '  (planned ' + r.planned + 's)' : '') + '  ' + r.how));
const missing = shots.filter((s) => !rows.some((r) => r.id === s.id));
if (missing.length) console.log('\nnot matched to any file: ' + missing.map((s) => s.id).join(', '));
console.log('\nwrote ' + path.relative(ROOT, csvPath) + ' — check it, fix any "?" line, then run again with --apply');

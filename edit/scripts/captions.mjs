/* Probes the clips in public/clips for one video and writes public/captions/<VID>.json:
   real clip lengths, plus word timings — Whisper's if captions/<VID>.words.json exists,
   otherwise an estimate from the script (the composition estimates too; the file just
   pins it). Usage: node scripts/captions.mjs B1 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseMedia } from '@remotion/media-parser';
import { nodeReader } from '@remotion/media-parser/node';

globalThis.window = globalThis;
await import('../../videos.js');
await import('../../calls.js');
const { clipIds, estimateWords } = await import('../src/timeline.js');

const vid = process.argv[2];
if (!vid) { console.error('usage: node scripts/captions.mjs <VID>'); process.exit(1); }
const here = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(here, '..', 'public');
const clipsDir = path.join(pub, 'clips'), capDir = path.join(pub, 'captions');
fs.mkdirSync(capDir, { recursive: true });

const DATA = { VIDEOS: window.VIDEOS, CALLS: window.CALLS };
const ids = clipIds(DATA, vid);
const wordsFile = path.join(here, '..', 'captions', vid + '.words.json');
const real = fs.existsSync(wordsFile) ? JSON.parse(fs.readFileSync(wordsFile, 'utf8')) : {};

const probe = { vid, generatedAt: new Date().toISOString(), clips: {}, words: {}, missing: [], estimated: [] };
for (const c of ids) {
  const file = path.join(clipsDir, c.id + '.mp4');
  if (!fs.existsSync(file)) { if (!c.optional) probe.missing.push(c.id); continue; }
  const { durationInSeconds } = await parseMedia({ src: file, fields: { durationInSeconds: true }, reader: nodeReader, acknowledgeRemotionLicense: true });
  probe.clips[c.id] = { dur: +durationInSeconds.toFixed(3), planned: c.secs };
  if (c.spoken) {
    if (real[c.id] && real[c.id].length) probe.words[c.id] = real[c.id];
    else { probe.words[c.id] = estimateWords(c.spoken, durationInSeconds); probe.estimated.push(c.id); }
  }
}
fs.writeFileSync(path.join(capDir, vid + '.json'), JSON.stringify(probe, null, 1));
console.log(vid + ': ' + Object.keys(probe.clips).length + ' clips probed, ' + probe.missing.length + ' missing' + (probe.missing.length ? ' (' + probe.missing.join(', ') + ')' : '') +
  ', word timing ' + (probe.estimated.length ? 'estimated for ' + probe.estimated.length : 'from Whisper') + '.');
Object.keys(probe.clips).forEach((id) => { const p = probe.clips[id]; if (Math.abs(p.dur - p.planned) > 1.5) console.log('  note: ' + id + ' runs ' + p.dur + 's, planned ' + p.planned + 's'); });

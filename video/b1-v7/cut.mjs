#!/usr/bin/env node
/* Tighten every clip: drop the dead air Whisper found between phrases, and the slack before the
   first word and after the last. Writes assets/cut/<id>.mp4 and data/cuts.json (kept ranges and
   the word timings remapped onto the cut clip). build.mjs reads cuts.json when it exists.

     node cut.mjs                 → cuts from assets/clips (the angle proxies in the sandbox, placeholders here)
     node cut.mjs --dry           → print the plan only

   Same rules as b1-rate-you-were-quoted/cut.mjs (LESSONS.md #26): cut only where Whisper shows a gap
   longer than GAP_MIN, keep KEEP_AFTER / KEEP_BEFORE around the cut, never cut inside a word. Two
   differences for v7: edit.json may set `tail` per clip (air kept after the last word, so an overlay
   gets the hold MOTION-SYSTEM.md §3 demands), and no blurred copies are written — the v7 panels are a
   flat translucent fill (§4), not glass sampled from the footage. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ffmpeg = process.env.HYPERFRAMES_FFMPEG_PATH || 'ffmpeg', ffprobe = process.env.HYPERFRAMES_FFPROBE_PATH || 'ffprobe';
const LEAD = 0.18, GAP_MIN = 0.6, KEEP_AFTER = 0.24, KEEP_BEFORE = 0.14, TAIL = 0.32, TAIL_LAST = 0.5;
const dry = process.argv.includes('--dry');
const r3 = (n) => Math.round(n * 1000) / 1000;
const WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'data/words.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/edit.json'), 'utf8'));
const dur = (f) => parseFloat(execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const filters = execFileSync(ffmpeg, ['-hide_banner', '-filters']).toString();
const hasFade = /\bafade\b/.test(filters);
/* --placeholder (or an ffmpeg without setpts, as in the web container): a clip of the cut length via -t —
   right duration for `hyperframes check`, wrong pictures */
const placeholder = process.argv.includes('--placeholder') || !/\bsetpts\b/.test(filters);
const LAST = 'B1-18';

const cuts = {};
fs.mkdirSync(path.join(HERE, 'assets/cut'), { recursive: true });
for (const id of Object.keys(WORDS)) {
  const src = path.join(HERE, 'assets/clips', id + '.mp4');
  if (!fs.existsSync(src)) { console.log('skip', id, '(no clip)'); continue; }
  const full = r3(dur(src));
  const E = EDIT[id] || {};
  const words = WORDS[id].map((w) => (w.s < full - 0.1 ? w : { w: w.w, s: r3(full - 0.1), e: r3(full - 0.05) }));
  const inn = Math.max(E.in || 0, words[0].s - LEAD, 0);
  if (E.endAtWord) {
    const k = words.findIndex((w) => w.w === E.endAtWord);
    if (k < 0) throw new Error(id + ': endAtWord "' + E.endAtWord + '" not found');
    words.splice(k + 1);
  }
  const last = words[words.length - 1];
  const wantTail = E.tail != null ? E.tail : id === LAST ? TAIL_LAST : E.endAtWord ? 0.45 : TAIL;
  const tail = Math.min(full, last.e + wantTail, full - (E.out || 0));
  if (E.tail != null && tail < last.e + E.tail - 0.02) console.log('note', id, 'asked for', E.tail + 's of tail, the take only has', r3(tail - last.e) + 's');
  const keep = []; let a = r3(inn);
  for (let i = 0; i < words.length - 1; i++) {
    const gap = words[i + 1].s - words[i].e;
    if (gap > GAP_MIN) { keep.push([a, r3(words[i].e + KEEP_AFTER)]); a = r3(words[i + 1].s - KEEP_BEFORE); }
  }
  keep.push([a, r3(tail)]);
  const map = (t) => { let acc = 0; for (const [p, q] of keep) { if (t <= p) return r3(acc); if (t <= q) return r3(acc + t - p); acc += q - p; } return r3(acc); };
  const cutWords = words.map((w) => ({ w: w.w, s: map(w.s), e: map(w.e) }));
  const total = r3(keep.reduce((s, [p, q]) => s + (q - p), 0));
  const removed = r3(full - total);
  cuts[id] = { keep, dur: total, removed, words: cutWords };
  console.log(id.padEnd(9), full.toFixed(2) + 's → ' + total.toFixed(2) + 's', '(−' + removed.toFixed(2) + 's, ' + keep.length + ' piece' + (keep.length > 1 ? 's' : '') + ')');
  if (dry) continue;
  const parts = [], labels = [];
  keep.forEach(([p, q], i) => {
    const d = q - p;
    parts.push(`[0:v]trim=start=${p}:end=${q},setpts=PTS-STARTPTS[v${i}]`);
    const fade = hasFade && d > 0.05 ? `,afade=t=in:d=0.01,afade=t=out:st=${r3(Math.max(0, d - 0.01))}:d=0.01` : '';
    parts.push(`[0:a]atrim=start=${p}:end=${q},asetpts=PTS-STARTPTS${fade}[a${i}]`);
    labels.push(`[v${i}][a${i}]`);
  });
  const graph = parts.join(';') + ';' + labels.join('') + `concat=n=${keep.length}:v=1:a=1[v][a]`;
  const out = path.join(HERE, 'assets/cut', id + '.mp4');
  if (placeholder) execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-t', String(total), '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-b:a', '96k', out]);
  else execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-filter_complex', graph, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]);
}
if (!dry) fs.writeFileSync(path.join(HERE, 'data/cuts.json'), JSON.stringify(cuts, null, 1));
const tot = Object.values(cuts).reduce((s, c) => s + c.removed, 0);
console.log((placeholder && !dry ? 'PLACEHOLDER clips written — ' : '') + (dry ? 'plan: ' : 'cut: ') + r3(tot) + 's of dead air removed across ' + Object.keys(cuts).length + ' clips' + (hasFade ? '' : ' (no afade in this ffmpeg — cuts are unfaded)'));

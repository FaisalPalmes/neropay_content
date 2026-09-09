#!/usr/bin/env node
/* Tighten every clip: drop the dead air Whisper found between phrases, and the slack before the
   first word and after the last. Writes assets/cut/<id>.mp4 and data/cuts.json (kept ranges and
   the word timings remapped onto the cut clip). build.mjs reads cuts.json when it exists.

     node cut.mjs                 → cuts from assets/clips (proxies in the sandbox, placeholders here)
     node cut.mjs --dry           → print the plan only

   Rules (LESSONS.md): cut only where Whisper shows a gap longer than GAP_MIN; keep KEEP_AFTER of
   air after the word and KEEP_BEFORE before the next so consonant tails and breaths survive; never
   cut inside a word. The presenter is static and locked off, so the jump is a head twitch at most. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ffmpeg = process.env.HYPERFRAMES_FFMPEG_PATH || 'ffmpeg', ffprobe = process.env.HYPERFRAMES_FFPROBE_PATH || 'ffprobe';
const LEAD = 0.18, GAP_MIN = 0.6, KEEP_AFTER = 0.24, KEEP_BEFORE = 0.14, TAIL = 0.32, TAIL_LAST = 0.5;
const dry = process.argv.includes('--dry');
/* --placeholder (or an ffmpeg without setpts, as in the web container): write a clip of the cut length
   with -t instead of the real trim graph — right duration for `hyperframes check`, wrong pictures */
const r3 = (n) => Math.round(n * 1000) / 1000;
const WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'data/words.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/edit.json'), 'utf8'));
const dur = (f) => parseFloat(execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const filters = execFileSync(ffmpeg, ['-hide_banner', '-filters']).toString();
const hasFade = /\bafade\b/.test(filters);
const placeholder = process.argv.includes('--placeholder') || !/\bsetpts\b/.test(filters);
const LAST = 'B1-18';

const cuts = {};
fs.mkdirSync(path.join(HERE, 'assets/cut'), { recursive: true });
for (const id of Object.keys(WORDS)) {
  const src = path.join(HERE, 'assets/clips', id + '.mp4');
  if (!fs.existsSync(src)) { console.log('skip', id, '(no clip)'); continue; }
  const full = r3(dur(src));
  /* a word past the end of the file (a placeholder shorter than the take) is clamped to the tail, not dropped,
     so every cue the build asks for still resolves */
  const words = WORDS[id].map((w) => (w.s < full - 0.1 ? w : { w: w.w, s: r3(full - 0.1), e: r3(full - 0.05) }));
  const inn = Math.max((EDIT[id] && EDIT[id].in) || 0, words[0].s - LEAD, 0);
  const last = words[words.length - 1];
  const tail = Math.min(full, last.e + (id === LAST ? TAIL_LAST : TAIL), full - ((EDIT[id] && EDIT[id].out) || 0));
  const keep = []; let a = r3(inn);
  for (let i = 0; i < words.length - 1; i++) {
    const gap = words[i + 1].s - words[i].e;
    if (gap > GAP_MIN) { keep.push([a, r3(words[i].e + KEEP_AFTER)]); a = r3(words[i + 1].s - KEEP_BEFORE); }
  }
  keep.push([a, r3(tail)]);
  /* map a source time onto the cut clip */
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
  if (placeholder) { execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-t', String(total), '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac', '-b:a', '96k', out]); continue; }
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-filter_complex', graph, '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-preset', 'fast', '-crf', '16', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', out]);
}
if (!dry) fs.writeFileSync(path.join(HERE, 'data/cuts.json'), JSON.stringify(cuts, null, 1));
const tot = Object.values(cuts).reduce((s, c) => s + c.removed, 0);
console.log((placeholder && !dry ? 'PLACEHOLDER clips written — ' : '') + (dry ? 'plan: ' : 'cut: ') + r3(tot) + 's of dead air removed across ' + Object.keys(cuts).length + ' clips' + (hasFade ? '' : ' (no afade in this ffmpeg — cuts are unfaded)'));

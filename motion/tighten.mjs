/* Tighten a take: shrink every silence between words to a fixed length, without touching the words.
 *
 *   node motion/tighten.mjs <series>/<episode> [--gap 0.34] [--min 0.5]
 *
 * Reads data/vo.mp3 + data/vo_words.json (the raw take and its Whisper timings), cuts the middle of every
 * gap longer than --min down to --gap (leaving the edges of the silence so no consonant is clipped), and
 * writes data/vo.mp3 (tight) + data/vo_words.json (shifted) + data/words.js. The raw take is kept as
 * data/vo-raw.mp3 and data/vo_words-raw.json so the operation is repeatable from the original.
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), ep = resolve(HERE, args[0]);
const opt = (k, d) => args.includes(k) ? +args[args.indexOf(k) + 1] : d;
const GAP = opt('--gap', .34), MIN = opt('--min', .5), EDGE = .12;
const D = resolve(ep, 'data');
if (!existsSync(resolve(D, 'vo-raw.mp3'))) { copyFileSync(resolve(D, 'vo.mp3'), resolve(D, 'vo-raw.mp3')); copyFileSync(resolve(D, 'vo_words.json'), resolve(D, 'vo_words-raw.json')); }
const words = JSON.parse(readFileSync(resolve(D, 'vo_words-raw.json'), 'utf8'));
const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', resolve(D, 'vo-raw.mp3')]).toString();
/* the cuts: [from, to] in raw time, each removing (gap - GAP) from the middle of a silence */
const cuts = [];
for (let i = 1; i < words.length; i++) {
  const g = words[i].s - words[i - 1].e;
  if (g > MIN) { const remove = g - GAP, mid = (words[i - 1].e + words[i].s) / 2; cuts.push([mid - remove / 2, mid + remove / 2]); }
}
/* keep segments between cuts, concat */
const keep = []; let t = 0;
for (const [a, b] of cuts) { keep.push([t, a]); t = b; } keep.push([t, dur]);
const parts = keep.map(([a, b], i) => `[0:a]atrim=${a.toFixed(3)}:${b.toFixed(3)},asetpts=PTS-STARTPTS[k${i}]`);
const fc = parts.join(';') + ';' + keep.map((_, i) => `[k${i}]`).join('') + `concat=n=${keep.length}:v=0:a=1[out]`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', resolve(D, 'vo-raw.mp3'), '-filter_complex', fc, '-map', '[out]', '-c:a', 'libmp3lame', '-q:a', '2', resolve(D, 'vo.mp3')]);
/* shift the timings */
const shift = t => { let s = 0; for (const [a, b] of cuts) { if (t >= b) s += b - a; else if (t > a) s += t - a; } return +(t - s).toFixed(3); };
const out = words.map(w => ({ w: w.w, s: shift(w.s), e: shift(w.e) }));
writeFileSync(resolve(D, 'vo_words.json'), JSON.stringify(out));
writeFileSync(resolve(D, 'words.js'), 'window.WORDS=' + JSON.stringify(out) + ';\n');
const removed = cuts.reduce((a, [x, y]) => a + (y - x), 0);
console.log(`${cuts.length} gaps tightened to ${GAP}s, ${removed.toFixed(2)}s removed: ${dur.toFixed(2)}s -> ${(dur - removed).toFixed(2)}s`);

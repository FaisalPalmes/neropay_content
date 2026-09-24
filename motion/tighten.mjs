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
/* --tempo 1.06: after the cuts, play the take a little faster with the pitch held (ffmpeg atempo) and scale the timings to
   match — a UGC read that still breathes but doesn't dawdle (PP01, Faisal's "no gaps" note, 16 Sep 2026). 1.0 = off. */
const TEMPO = opt('--tempo', 1);
const D = resolve(ep, 'data');
if (!existsSync(resolve(D, 'vo-raw.mp3'))) { copyFileSync(resolve(D, 'vo.mp3'), resolve(D, 'vo-raw.mp3')); copyFileSync(resolve(D, 'vo_words.json'), resolve(D, 'vo_words-raw.json')); }
const words = JSON.parse(readFileSync(resolve(D, 'vo_words-raw.json'), 'utf8'));
const dur = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', resolve(D, 'vo-raw.mp3')]).toString();
/* the cuts: [from, to] in raw time, each removing (gap - GAP) from the middle of a silence.
   Guard (24 Sep 2026): a gap is only a gap if it is quiet. Whisper timed "Reports" in the NeroConnect explainer as starting
   after its first syllable, the "silence" before it held "Re", and the cut took it out — the take said "ports". So every
   cut is checked against the audio: if any 20 ms inside it is louder than -26 dBFS (speech; a breath is -32 to -38 and the gate takes it), the cut is skipped and reported. */
const SR = 16000, pcm = new Float32Array((b => b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))(
  execFileSync('ffmpeg', ['-v', 'error', '-i', resolve(D, 'vo-raw.mp3'), '-ac', '1', '-ar', String(SR), '-f', 'f32le', '-'], { maxBuffer: 1 << 30 })));
const loudest = (a, b) => { let m = 0; for (let x = Math.floor(a * SR); x + 320 <= b * SR; x += 160) {
  let e = 0; for (let k = x; k < x + 320; k++) e += pcm[k] * pcm[k]; m = Math.max(m, e / 320); } return 10 * Math.log10(m + 1e-12); };
const cuts = [];
for (let i = 1; i < words.length; i++) {
  const g = words[i].s - words[i - 1].e;
  if (g > MIN) { const remove = g - GAP, a0 = words[i - 1].e, b0 = words[i].s;
    /* place the cut on the quietest stretch of the gap, not its middle (NeroConnect v3.6, 24 Sep 2026): "logo" trailed off
       for 0.3 s past Whisper's end, the middle cut landed in that tail at -27 dBFS (under the -26 guard) and chopped it, which
       Faisal heard as a stutter. Slide the cut across the gap in 10 ms steps and keep the position whose loudest 20 ms is lowest. */
    let c = [(a0 + b0) / 2 - remove / 2, (a0 + b0) / 2 + remove / 2], db = loudest(c[0], c[1]);
    for (let x = a0; x + remove <= b0 + 1e-9; x += 0.01) { const d = loudest(x, x + remove); if (d < db - 0.5) { db = d; c = [x, x + remove]; } }
    /* only true silence is cut: -40 dBFS (was -26, which let the "logo" cut through a word's tail). A gap with no silent stretch
       long enough is kept whole: it is a word Whisper mistimed, a trailing sound or a breath the gate will take */
    if (db > -40) console.log(`  kept a ${g.toFixed(2)}s gap before "${words[i].w}" at ${words[i].s}s: no silent stretch (${db.toFixed(1)} dBFS)`);
    else cuts.push(c); }
}
/* keep segments between cuts, concat */
const keep = []; let t = 0;
for (const [a, b] of cuts) { keep.push([t, a]); t = b; } keep.push([t, dur]);
const parts = keep.map(([a, b], i) => `[0:a]atrim=${a.toFixed(3)}:${b.toFixed(3)},asetpts=PTS-STARTPTS[k${i}]`);
const fc = parts.join(';') + ';' + keep.map((_, i) => `[k${i}]`).join('') + `concat=n=${keep.length}:v=0:a=1` + (TEMPO !== 1 ? `,atempo=${TEMPO}` : '') + '[out]';
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', resolve(D, 'vo-raw.mp3'), '-filter_complex', fc, '-map', '[out]', '-c:a', 'libmp3lame', '-q:a', '2', resolve(D, 'vo.mp3')]);
/* shift the timings (and scale them if the tempo changed) */
const shift = t => { let s = 0; for (const [a, b] of cuts) { if (t >= b) s += b - a; else if (t > a) s += t - a; } return +((t - s) / TEMPO).toFixed(3); };
const out = words.map(w => ({ w: w.w, s: shift(w.s), e: shift(w.e) }));
writeFileSync(resolve(D, 'vo_words.json'), JSON.stringify(out));
writeFileSync(resolve(D, 'words.js'), 'window.WORDS=' + JSON.stringify(out) + ';\n');
const removed = cuts.reduce((a, [x, y]) => a + (y - x), 0);
console.log(`${cuts.length} gaps tightened to ${GAP}s, ${removed.toFixed(2)}s removed: ${dur.toFixed(2)}s -> ${(dur - removed).toFixed(2)}s` + (TEMPO !== 1 ? ` -> ${((dur - removed) / TEMPO).toFixed(2)}s at tempo ${TEMPO}` : ''));

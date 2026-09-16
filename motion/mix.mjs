/* Mix the VO and the SFX cues for an episode into out/mix.m4a, loudnormed in two passes.
 *
 *   node motion/mix.mjs <series>/<episode>
 *
 * Reads <episode>/data/mix.json: { duration, head, vo: "data/vo.mp3", target: -14, cues: [{sfx, t, gain}],
 *   bed?: { file, t, gain, duck?: { threshold, ratio, attack, release }, fade } }
 * `t` is composition time (seconds); the VO is delayed by `head`. SFX come from video/library/sfx/<sfx>.mp3.
 * The bed is a repo path; it is ducked under the voice with sidechaincompress (the VO is the key) and
 * faded out over `fade` seconds before the end, so a bed longer than the piece never tears the tail.
 * Two passes because a single-pass loudnorm undershot ep01 by 2 LU (motion/README.md).
 */
import { execFileSync, spawnSync } from 'node:child_process';
const measure = (args) => { const r = spawnSync('ffmpeg', args, { encoding:'utf8' }); const o = r.stderr + r.stdout; return JSON.parse(o.slice(o.lastIndexOf('{'))); };
import { readFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ep = resolve(HERE, process.argv[2] || '');
const spec = JSON.parse(readFileSync(resolve(ep, 'data/mix.json'), 'utf8'));
const SFX = resolve(HERE, '..', 'video/library/sfx');
const out = resolve(ep, 'out'); mkdirSync(out, { recursive: true });
const target = spec.target ?? -16, tp = spec.tp ?? -1.5;

const inputs = ['-i', resolve(ep, spec.vo || 'data/vo.mp3')];
const chains = [`[0:a]adelay=${Math.round(spec.head * 1000)}|${Math.round(spec.head * 1000)},volume=1.0[v]`];
let n = 1; const labels = ['[v]'];
for (const c of spec.cues) {
  const f = resolve(SFX, `${c.sfx}.mp3`);
  if (!existsSync(f)) throw new Error(`no such sfx: ${c.sfx}`);
  inputs.push('-i', f);
  const ms = Math.round(c.t * 1000);
  chains.push(`[${n}:a]adelay=${ms}|${ms},volume=${c.gain}[s${n}]`);
  labels.push(`[s${n}]`); n++;
}
if (spec.bed) {
  const b = spec.bed, f = resolve(HERE, '..', b.file);
  if (!existsSync(f)) throw new Error(`no such bed: ${b.file}`);
  inputs.push('-i', f);
  const ms = Math.round((b.t || 0) * 1000), fade = b.fade ?? 1.2;
  chains.push(`[${n}:a]adelay=${ms}|${ms},volume=${b.gain},afade=t=out:st=${(spec.duration - fade).toFixed(3)}:d=${fade}[bed0]`);
  if (b.duck) {
    /* a copy of the delayed VO keys the compressor; the compressed bed is what goes to the mix */
    chains[0] = chains[0].replace('[v]', '[v0]'); chains.push('[v0]asplit=2[v][vk]');
    const d = b.duck; chains.push(`[bed0][vk]sidechaincompress=threshold=${d.threshold}:ratio=${d.ratio}:attack=${d.attack}:release=${d.release}:makeup=1[bed]`);
  } else chains.push('[bed0]anull[bed]');
  labels.push('[bed]'); n++;
}
chains.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0:dropout_transition=0,apad=whole_dur=${spec.duration},atrim=0:${spec.duration}[mix]`);
const raw = resolve(out, 'mix-raw.wav');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-filter_complex', chains.join(';'), '-map', '[mix]', '-ar', '48000', raw], { stdio: 'inherit' });

/* pass 1: measure */
const j = measure(['-i', raw, '-af', `loudnorm=I=${target}:TP=${tp}:LRA=11:print_format=json`, '-f', 'null', '-']);
/* pass 2: apply with the measured values */
const ln = `loudnorm=I=${target}:TP=${tp}:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true:print_format=summary`;
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', raw, '-af', ln, '-ar', '48000', '-c:a', 'aac', '-b:a', '192k', resolve(out, 'mix.m4a')], { stdio: 'inherit' });
const k = measure(['-i', resolve(out, 'mix.m4a'), '-af', 'loudnorm=print_format=json', '-f', 'null', '-']);
console.log(`mix.m4a  ${spec.duration}s  ${spec.cues.length} cues${spec.bed ? '  + bed' : ''}  ${k.input_i} LUFS  ${k.input_tp} dBTP  (target ${target})`);

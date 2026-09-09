#!/usr/bin/env node
// Fetch every sound in sounds.json from Freesound, normalise it to -3 dBFS as .m4a (AAC 192k), and
// copy the set into a project's assets/sfx. Run where Freesound is reachable (the Higgsfield sandbox,
// Faisal's PC). The web container cannot reach freesound.org, so there `--placeholder` writes silent
// files of the right length instead — enough for `hyperframes check`, never for a delivery render.
//
//   node fetch-sounds.mjs --into ../b1-rate-you-were-quoted/assets/sfx            # real files
//   node fetch-sounds.mjs --into ../b1-rate-you-were-quoted/assets/sfx --placeholder
//
// Token: FREESOUND_TOKEN in the environment or in library/.env (git-ignored).
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const LIB = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const into = opt('--into'); const placeholder = args.includes('--placeholder');
if (!into) { console.error('usage: node fetch-sounds.mjs --into <project>/assets/sfx [--placeholder]'); process.exit(2); }
if (!process.env.FREESOUND_TOKEN && fs.existsSync(path.join(LIB, '.env'))) {
  for (const line of fs.readFileSync(path.join(LIB, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
const ffmpeg = process.env.HYPERFRAMES_FFMPEG_PATH || 'ffmpeg';
const { sounds } = JSON.parse(fs.readFileSync(path.join(LIB, 'sounds.json'), 'utf8'));
const cache = path.join(LIB, 'freesound'); fs.mkdirSync(cache, { recursive: true }); fs.mkdirSync(into, { recursive: true });
const out = path.resolve(into);

for (const [role, s] of Object.entries(sounds)) {
  const target = path.join(out, role + '.m4a');
  if (placeholder) {
    /* a silent WAV written by hand (this container's ffmpeg has no lavfi), then encoded */
    const n = Math.round(s.duration * 48000), hdr = Buffer.alloc(44);
    hdr.write('RIFF', 0); hdr.writeUInt32LE(36 + n * 4, 4); hdr.write('WAVEfmt ', 8); hdr.writeUInt32LE(16, 16); hdr.writeUInt16LE(1, 20); hdr.writeUInt16LE(2, 22);
    hdr.writeUInt32LE(48000, 24); hdr.writeUInt32LE(48000 * 4, 28); hdr.writeUInt16LE(4, 32); hdr.writeUInt16LE(16, 34); hdr.write('data', 36); hdr.writeUInt32LE(n * 4, 40);
    const wav = path.join(cache, 'silence.wav'); fs.writeFileSync(wav, Buffer.concat([hdr, Buffer.alloc(n * 4)]));
    execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', wav, '-c:a', 'aac', '-b:a', '96k', '-f', 'mp4', target]);
    console.log('placeholder', role, s.duration + 's'); continue;
  }
  const raw = path.join(cache, s.id + '.mp3');
  if (!fs.existsSync(raw)) {
    const token = process.env.FREESOUND_TOKEN; if (!token) { console.error('FREESOUND_TOKEN missing'); process.exit(1); }
    const meta = await (await fetch(`https://freesound.org/apiv2/sounds/${s.id}/?fields=previews,license,name,username&token=${token}`)).json();
    if (!meta.previews) { console.error('freesound', s.id, JSON.stringify(meta).slice(0, 200)); process.exit(1); }
    if (!/publicdomain\/zero/.test(meta.license)) { console.error(role, s.id, 'is not CC0:', meta.license); process.exit(1); }
    fs.writeFileSync(raw, Buffer.from(await (await fetch(meta.previews['preview-hq-mp3'])).arrayBuffer()));
  }
  const gain = Math.pow(10, (-3 - s.peak) / 20);
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', raw, '-af', `volume=${gain.toFixed(3)}`, '-ar', '48000', '-ac', '2', '-c:a', 'aac', '-b:a', '192k', '-f', 'mp4', target]);
  console.log('fetched', role, '←', s.id, s.name, `gain ×${gain.toFixed(2)}`);
}

/* derived cuts of the music bed with baked fades — HyperFrames plays audio as-is, so the fade is in the file */
const { derived = {} } = JSON.parse(fs.readFileSync(path.join(LIB, 'sounds.json'), 'utf8'));
for (const [name, d] of Object.entries(derived)) {
  const src = path.join(out, d.from + '.m4a'), target = path.join(out, name + '.m4a');
  if (placeholder) { execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-t', String(d.len), '-c:a', 'aac', '-b:a', '96k', '-f', 'mp4', target]); console.log('placeholder', name, d.len + 's'); continue; }
  const af = [`afade=t=in:d=${d.fadeIn || 0.05}`, `afade=t=out:st=${(d.len - (d.fadeOut || 0.5)).toFixed(3)}:d=${d.fadeOut || 0.5}`].join(',');
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-t', String(d.len), '-af', af, '-c:a', 'aac', '-b:a', '192k', '-f', 'mp4', target]);
  console.log('derived', name, d.len + 's from', d.from);
}

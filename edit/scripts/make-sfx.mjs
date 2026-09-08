/* Synthesises the handful of subtle sound effects the edit uses, so nothing is downloaded
   and nothing is licensed. Run once: npm run sfx. Writes 48 kHz 16-bit mono WAVs. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SR = 48000;
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.join(here, '..', 'public', 'sfx');
fs.mkdirSync(out, { recursive: true });

function wav(samples) {
  const n = samples.length, buf = Buffer.alloc(44 + n * 2);
  buf.write('RIFF', 0); buf.writeUInt32LE(36 + n * 2, 4); buf.write('WAVE', 8);
  buf.write('fmt ', 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write('data', 36); buf.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) buf.writeInt16LE(Math.max(-1, Math.min(1, samples[i])) * 32767, 44 + i * 2);
  return buf;
}
const secs = (s) => Math.round(s * SR);
const env = (i, n, a, r) => Math.min(1, i / (a * SR)) * Math.min(1, (n - i) / (r * SR));

/* whoosh: filtered noise, cutoff sweeping up then down, soft envelope */
function whoosh() {
  const n = secs(0.55), s = new Float32Array(n); let y = 0, seed = 12345;
  for (let i = 0; i < n; i++) {
    seed = (seed * 1664525 + 1013904223) >>> 0; const noise = (seed / 4294967296) * 2 - 1;
    const p = i / n, cutoff = 300 + 2800 * Math.sin(Math.PI * p);
    const k = 1 - Math.exp(-2 * Math.PI * cutoff / SR); y += k * (noise - y);
    s[i] = y * Math.pow(Math.sin(Math.PI * p), 1.6) * 0.9;
  }
  return s;
}
/* tick: a short click and a quick sine decay */
function tick() {
  const n = secs(0.09), s = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR; s[i] = Math.sin(2 * Math.PI * 1400 * t) * Math.exp(-t * 60) * 0.7 + (i < 40 ? 0.5 * (1 - i / 40) : 0); }
  return s;
}
/* rise: a gentle sweep for the intro card */
function rise() {
  const n = secs(0.9), s = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const p = i / n, f = 180 + 480 * p * p; ph += 2 * Math.PI * f / SR; s[i] = (Math.sin(ph) * 0.6 + Math.sin(2 * ph) * 0.15) * env(i, n, 0.15, 0.35) * 0.5; }
  return s;
}
/* pop: a low thump with a pitch drop, for the question card */
function pop() {
  const n = secs(0.16), s = new Float32Array(n); let ph = 0;
  for (let i = 0; i < n; i++) { const t = i / SR, f = 320 * Math.exp(-t * 18) + 90; ph += 2 * Math.PI * f / SR; s[i] = Math.sin(ph) * Math.exp(-t * 22) * 0.8; }
  return s;
}
/* tone: twelve seconds of low hum with a beep every second — for placeholder clips only */
function tone() {
  const n = secs(12), s = new Float32Array(n);
  for (let i = 0; i < n; i++) { const t = i / SR, inSec = t % 1; s[i] = Math.sin(2 * Math.PI * 110 * t) * 0.05 + (inSec < 0.06 ? Math.sin(2 * Math.PI * 1000 * t) * 0.25 * (1 - inSec / 0.06) : 0); }
  return s;
}

const files = { whoosh, tick, rise, pop, tone };
Object.keys(files).forEach((k) => { fs.writeFileSync(path.join(out, k + '.wav'), wav(files[k]())); console.log('wrote sfx/' + k + '.wav'); });

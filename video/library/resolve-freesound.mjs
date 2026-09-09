#!/usr/bin/env node
// Search Freesound for a sound effect, download the best CC0 match, and append a ledger line.
//   node resolve-freesound.mjs "soft whoosh" [--out sfx] [--name whoosh-soft] [--any-licence]
// The token (free from https://freesound.org/apiv2/apply) goes in library/.env as FREESOUND_TOKEN=..., never in git. Without --any-licence only CC0 files are
// accepted, because CC0 is the one Creative Commons licence that needs no attribution and allows
// commercial use without conditions. Preview-quality MP3 (the high-quality original needs OAuth).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const LIB = path.dirname(fileURLToPath(import.meta.url));
// The token lives in library/.env (git-ignored) as FREESOUND_TOKEN=...; an exported variable wins.
if (!process.env.FREESOUND_TOKEN && fs.existsSync(path.join(LIB, '.env'))) {
  for (const line of fs.readFileSync(path.join(LIB, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/); if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const args = process.argv.slice(2);
const query = args.find((a) => !a.startsWith('--'));
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const outDir = path.resolve(LIB, opt('--out', 'sfx'));
const anyLicence = args.includes('--any-licence');
const token = process.env.FREESOUND_TOKEN;
if (!query || !token) { console.error('usage: node resolve-freesound.mjs "query" [--out dir] [--name file] [--any-licence]'); process.exit(2); }

const filter = anyLicence ? '' : '&filter=license:"Creative Commons 0"';
const url = `https://freesound.org/apiv2/search/text/?query=${encodeURIComponent(query)}${filter}&fields=id,name,username,license,duration,previews,url&sort=score&page_size=10&token=${token}`;
const res = await fetch(url);
if (!res.ok) { console.error('freesound', res.status, await res.text()); process.exit(1); }
const { results } = await res.json();
if (!results?.length) { console.error('no results for', query); process.exit(1); }
console.log(results.map((r, i) => `${i + 1}. ${r.name} — ${r.duration.toFixed(2)}s — ${r.license} — by ${r.username}`).join('\n'));
const pick = results[0];
const name = opt('--name', pick.name.replace(/\.[a-z0-9]+$/i, '').replace(/[^a-z0-9]+/gi, '-').toLowerCase());
fs.mkdirSync(outDir, { recursive: true });
const file = path.join(outDir, name + '.mp3');
const mp3 = await fetch(pick.previews['preview-hq-mp3']);
fs.writeFileSync(file, Buffer.from(await mp3.arrayBuffer()));
const line = `- \`${path.relative(LIB, file)}\` — "${pick.name}" by ${pick.username}, ${pick.license}, ${pick.url} (query: ${query})`;
fs.appendFileSync(path.join(LIB, 'LEDGER.md'), '\n' + line + '\n');
console.log('\nsaved', file, '\nledger:', line);

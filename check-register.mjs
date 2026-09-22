#!/usr/bin/env node
/* check-register.mjs — the register is only useful if its references resolve.

   Every record in published.js points at an id in library.js or posts.js. A typo there does not throw,
   it just silently vanishes from library.html — the exact failure mode the register exists to prevent.
   This fails loudly instead. Run it before pushing; it is in CLAUDE.md's verification list.        */

import { readFile } from 'node:fs/promises';

const load = async (f, key) => {
  const w = {};
  new Function('window', await readFile(f, 'utf8'))(w);
  return w[key];
};

const LIB = await load('library.js', 'LIBRARY');
const PUB = await load('published.js', 'PUBLISHED');
const POSTS = await load('posts.js', 'POSTS');

const ids = new Set([...LIB.videos.map(v => v.id), ...POSTS.map(p => p.id)]);
const PLATFORMS = ['youtube', 'instagram', 'facebook', 'tiktok', 'linkedin', 'website', 'paid-meta'];
const STATES = ['brief', 'building', 'review', 'ready', 'approved', 'published'];
const fail = [];

for (const v of LIB.videos) {
  if (!STATES.includes(v.status)) fail.push(`library.js ${v.id}: unknown status "${v.status}"`);
  if (!v.by) fail.push(`library.js ${v.id}: no "by" — every state must say who set it and when`);
  for (const p of v.clearedFor || []) if (!PLATFORMS.includes(p)) fail.push(`library.js ${v.id}: clearedFor "${p}" is not a platform`);
  for (const p of Object.keys(v.notCleared || {})) if (!PLATFORMS.includes(p)) fail.push(`library.js ${v.id}: notCleared "${p}" is not a platform`);
  if (v.clearedFor && v.notCleared) for (const p of v.clearedFor)
    if (p in v.notCleared) fail.push(`library.js ${v.id}: "${p}" is both cleared and not cleared`);
}

for (const [i, r] of (PUB.records || []).entries()) {
  const at = `published.js record ${i + 1} (${r.ref || 'no ref'})`;
  if (!ids.has(r.ref)) fail.push(`${at}: ref does not match any video or post id`);
  if (!PLATFORMS.includes(r.platform)) fail.push(`${at}: "${r.platform}" is not a platform — one of ${PLATFORMS.join(', ')}`);
  if (!['organic', 'paid'].includes(r.kind)) fail.push(`${at}: kind must be organic or paid`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(r.on || '')) fail.push(`${at}: "on" must be an ISO date`);
  if (!r.by) fail.push(`${at}: no "by" — an entry nobody can attribute is how the tracking got lost`);
  const v = LIB.videos.find(x => x.id === r.ref);
  if (v && v.notCleared && r.platform in v.notCleared)
    fail.push(`${at}: ${r.ref} is NOT CLEARED for ${r.platform} — ${v.notCleared[r.platform]}`);
}

const dup = new Set(), seen = new Set();
for (const v of LIB.videos) { if (seen.has(v.id)) dup.add(v.id); seen.add(v.id); }
for (const d of dup) fail.push(`library.js: duplicate video id "${d}"`);

if (fail.length) { console.error('register check FAILED\n' + fail.map(f => '  · ' + f).join('\n')); process.exit(1); }
console.log(`register ok — ${LIB.videos.length} videos, ${POSTS.length} posts, ${(PUB.records || []).length} publish records`);

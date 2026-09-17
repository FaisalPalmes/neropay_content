/* caps.js from the word timings: the take split into caption lines at punctuation, at most 6 words a line.
   node motion/neroconnect/nc01/mkcaps.mjs  -> data/caps.js  ({text, idx:[word indices], tok:[[i,i],…]}) */
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path'; import { fileURLToPath } from 'node:url';
const D = resolve(dirname(fileURLToPath(import.meta.url)), 'data');
const W = JSON.parse(readFileSync(resolve(D, 'vo_words.json'), 'utf8'));
const lines = []; let cur = [];
const flush = () => { if (cur.length) { lines.push(cur); cur = []; } };
W.forEach((w, i) => { cur.push(i); const t = w.w; const endp = /[.?!]$/.test(t), comma = /[,:]$/.test(t);
  if (endp || (comma && cur.length >= 3) || cur.length >= 6) flush(); });
flush();
/* a one-word tail line joins the line before it */
for (let i = lines.length - 1; i > 0; i--) if (lines[i].length === 1 && lines[i - 1].length < 7) { lines[i - 1].push(...lines[i]); lines.splice(i, 1); }
const caps = lines.map(idx => ({ text: idx.map(i => W[i].w.replace(/^\./, '')).join(' ').replace(/ \./g, '.'), idx, tok: idx.map(i => [i, i]) }));
writeFileSync(resolve(D, 'caps.js'), 'window.CAPS=' + JSON.stringify(caps) + ';\n');
console.log(caps.length, 'caption lines'); caps.slice(0, 6).forEach(c => console.log('  ' + c.text));

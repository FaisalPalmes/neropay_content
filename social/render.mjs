#!/usr/bin/env node
/* social/render.mjs — the finished files for the social posts, on the light stage.

   Reads posts.js, and for every post with an `assets` field picks a template in social/templates/ by the
   asset's `t` (stat · quote · cards · cover), fills it through the template's window.fill(), and screenshots
   it at the card's exact pixels in Playwright's Chromium. Writes to social/out/<post id>/, git-ignored:

     <id>-<n>.png                 a stat, quote or cover
     <id>-<n>-<card>.png          each carousel card
     <id>-<n>.pdf                 the carousel as a LinkedIn document (one 1080×1350 page per card)
     caption.txt                  the post copy, verbatim
     alt.txt                      the alt text, if the asset carries `alt`
   and social/out/contact-sheet.png — every card from this run at half size, for the review the brief requires.

     node social/render.mjs                 every unblocked post
     node social/render.mjs L9 M11          just these
     node social/render.mjs --all           blocked posts too

   `ref` assets are the video overlays on youtube.html and are not social files; they are listed and skipped.
   Playwright 1.56 is global in a cloud session (npm root -g); locally `npm i -D playwright` at root works too.
   Nothing here touches the network: fonts are the committed woff2 files, loaded by relative path.        */

import { mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const TPL = join(HERE, 'templates');
const OUT = join(HERE, 'out');
const SIZES = { sq: [1080, 1080], pt: [1080, 1350], st: [1080, 1920] };

async function loadPlaywright() {
  const req = createRequire(import.meta.url);
  try { return req('playwright'); } catch {}
  try { return req(join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'playwright')); } catch {}
  throw new Error('Playwright not found. `npm i -D playwright` at the repo root, or run in a cloud session.');
}

const argv = process.argv.slice(2);
const all = argv.includes('--all');
const wanted = argv.filter(a => !a.startsWith('--'));

const posts = await (async () => {
  const src = await readFile(join(ROOT, 'posts.js'), 'utf8');
  const w = {}; new Function('window', src)(w); return w.POSTS;
})();
const known = new Set(posts.map(p => p.id));
for (const id of wanted) if (!known.has(id)) { console.error(`No post with id ${id}`); process.exit(1); }
const targets = wanted.length ? posts.filter(p => wanted.includes(p.id)) : posts.filter(p => all || !p.blocked);

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('requestfailed', r => errors.push('request failed: ' + r.url()));

const kickFor = p => p.pillar === 'Partner' ? 'NeroPay partners' : p.pillar === 'Statement' ? 'Explained by NeroPay' : p.pillar;

async function shoot(template, size, data, file) {
  const [w, h] = SIZES[size] || SIZES.sq;
  await page.setViewportSize({ width: w, height: h });
  await page.goto(pathToFileURL(join(TPL, template + '.html')).href, { waitUntil: 'load' });
  await page.evaluate(d => window.fill(d), { ...data, size });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: file, clip: { x: 0, y: 0, width: w, height: h } });
}

async function pdfFrom(pngs, size, file) {
  const [w, h] = SIZES[size] || SIZES.pt;
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @page{size:${w}px ${h}px;margin:0} html,body{margin:0;padding:0}
    img{display:block;width:${w}px;height:${h}px;page-break-after:always} img:last-child{page-break-after:auto}
  </style></head><body>${pngs.map(p => `<img src="${pathToFileURL(p).href}">`).join('')}</body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({ path: file, width: `${w}px`, height: `${h}px`, printBackground: true, preferCSSPageSize: true });
}

const sheet = [];
let files = 0;
for (const p of targets) {
  const dir = join(OUT, p.id);
  await rm(dir, { recursive: true, force: true });
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'caption.txt'), p.copy + '\n');
  const alts = [];
  const assets = p.assets || [];
  if (!assets.length) { console.log(`${p.id}  no assets`); continue; }

  for (let i = 0; i < assets.length; i++) {
    const a = assets[i], n = i + 1, size = a.size || (a.t === 'cards' ? 'pt' : a.t === 'cover' ? 'st' : 'sq');
    if (a.t === 'ref') { console.log(`${p.id}  ${n}  ref ${a.id} — video asset, not rendered here`); continue; }
    const kick = a.kick || kickFor(p);
    if (a.t === 'cards') {
      const pngs = [];
      for (let j = 0; j < a.cards.length; j++) {
        const f = join(dir, `${p.id}-${n}-${j + 1}.png`);
        await shoot('cards', size, { kick, i: j, total: a.cards.length, card: a.cards[j] }, f);
        pngs.push(f); sheet.push({ f, label: `${p.id} · ${j + 1}/${a.cards.length}` }); files++;
      }
      if (p.channel === 'linkedin' || a.pdf) { await pdfFrom(pngs, size, join(dir, `${p.id}-${n}.pdf`)); files++; }
      console.log(`${p.id}  ${n}  carousel · ${a.cards.length} cards · ${size}${p.channel === 'linkedin' ? ' · PDF' : ''}`);
    } else {
      const f = join(dir, `${p.id}-${n}.png`);
      const data = a.t === 'stat' ? { kick, big: a.big, line: a.line, src: a.src }
        : a.t === 'quote' ? { kick, text: a.text, sub: a.sub, src: a.src }
        : { kick: a.kick || kickFor(p), title: a.title, sub: a.sub, ai: !!a.ai };
      await shoot(a.t, size, data, f);
      sheet.push({ f, label: `${p.id} · ${a.t}` }); files++;
      console.log(`${p.id}  ${n}  ${a.t} · ${size}`);
    }
    if (a.alt) alts.push(`${p.id}-${n}: ${a.alt}`);
  }
  if (alts.length) await writeFile(join(dir, 'alt.txt'), alts.join('\n') + '\n');
}

/* the contact sheet — every card at half size, labelled, one image to look at before anything goes out */
if (sheet.length) {
  const cols = Math.min(4, sheet.length), cw = 540, cell = cw + 28;
  const rows = Math.ceil(sheet.length / cols);
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    body{margin:0;padding:28px;background:#e9e7e1;font:13px/1.3 "Martian Mono",ui-monospace,monospace;color:#333}
    .g{display:grid;grid-template-columns:repeat(${cols},${cw}px);gap:28px;align-items:start}
    figure{margin:0} img{display:block;width:${cw}px;height:auto;box-shadow:0 6px 20px rgba(0,0,0,.12)} figcaption{margin-top:8px}
  </style></head><body><div class="g">${sheet.map(s => `<figure><img src="${pathToFileURL(s.f).href}"><figcaption>${s.label}</figcaption></figure>`).join('')}</div></body></html>`;
  await page.setViewportSize({ width: cols * cell + 28, height: Math.min(4000, rows * 1000) });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: join(OUT, 'contact-sheet.png'), fullPage: true });
  console.log(`\ncontact sheet → social/out/contact-sheet.png (${sheet.length} cards)`);
}

await browser.close();
console.log(`${files} files → ${OUT}`);
if (errors.length) { console.error('\nPage errors:\n' + errors.join('\n')); process.exit(2); }

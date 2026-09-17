#!/usr/bin/env node
/* export-assets.mjs — render every drawn creative for a set of social posts to disk.

   Headless version of the PNG / SVG buttons on social.html. Loads the page over file://,
   asks overlays.js for each post's asset ids, renders them in the browser exactly as a click
   would (fonts embedded), and writes the files to social-out/<post id>/.

     node export-assets.mjs                 every unblocked post
     node export-assets.mjs L2 M2 L3 M6     just these
     node export-assets.mjs --all           blocked posts too
     node export-assets.mjs --out somewhere override the output folder

   Each post folder gets: one PNG per asset (opaque cards as-is; referenced overlays both
   transparent and on black), the matching SVG, and caption.txt holding the post copy verbatim.
   social-out/ is git-ignored — the files are for handing to Faisal, not for the repo.

   Needs Playwright. In a cloud session it is installed globally (npm root -g); locally,
   `npm i -D playwright` at root works too. Never uses a CDN.                                */

import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));

async function loadPlaywright() {
  const req = createRequire(import.meta.url);
  try { return req('playwright'); } catch {}
  try {
    const g = execSync('npm root -g', { encoding: 'utf8' }).trim();
    return req(join(g, 'playwright'));
  } catch {}
  throw new Error('Playwright not found. `npm i -D playwright` at the repo root, or run in a cloud session.');
}

const argv = process.argv.slice(2);
const all = argv.includes('--all');
const oi = argv.indexOf('--out');
const OUT = resolve(ROOT, oi >= 0 ? argv[oi + 1] : 'social-out');
const wanted = argv.filter((a, i) => !a.startsWith('--') && !(oi >= 0 && i === oi + 1));

// posts.js is a browser script; evaluate it in a bare sandbox to get the list without a page.
const posts = await (async () => {
  const src = await readFile(join(ROOT, 'posts.js'), 'utf8');
  const w = {};
  new Function('window', src)(w);
  return w.POSTS;
})();

const known = new Set(posts.map(p => p.id));
for (const id of wanted) if (!known.has(id)) { console.error(`No post with id ${id}`); process.exit(1); }

const targets = wanted.length
  ? posts.filter(p => wanted.includes(p.id))
  : posts.filter(p => all || !p.blocked);

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });

// The page embeds Chivo and Martian Mono from Google Fonts so the PNG matches the preview. In a
// cloud session Chromium does not trust the outbound proxy's certificate and the fonts fall back
// to a system sans; Node does trust it (NODE_EXTRA_CA_CERTS), so serve those requests from here.
// TLS is still verified — by Node, not the browser. Anything else stays on the browser's own path.
await page.route(/^https:\/\/fonts\.(googleapis|gstatic)\.com\//, async route => {
  try {
    const rq = route.request();
    const r = await fetch(rq.url(), { headers: { 'user-agent': rq.headers()['user-agent'] || '' } });
    await route.fulfill({
      status: r.status,
      headers: { 'content-type': r.headers.get('content-type') || 'application/octet-stream', 'access-control-allow-origin': '*' },
      body: Buffer.from(await r.arrayBuffer())
    });
  } catch { await route.abort(); }
});

await page.goto(pathToFileURL(join(ROOT, 'social.html')).href, { waitUntil: 'load' });
await page.waitForFunction(() => window.OVERLAY_ART && window.OVERLAY_ART.postAssets);

let files = 0;
for (const p of targets) {
  const ids = await page.evaluate(id => window.OVERLAY_ART.postAssets(id), p.id);
  const dir = join(OUT, p.id);
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, 'caption.txt'), p.copy + '\n');
  if (!ids.length) { console.log(`${p.id}  no drawn creative`); continue; }

  for (const id of ids) {
    const meta = await page.evaluate(id => window.OVERLAY_ART.meta(id), id);
    const variants = meta.opaque ? [{ tr: false, suf: '.png' }] : [{ tr: true, suf: '.png' }, { tr: false, suf: '-black.png' }];
    for (const v of variants) {
      const b64 = await page.evaluate(async ([id, tr]) => {
        const blob = await window.OVERLAY_ART.toPng(id, { transparent: tr });
        const buf = await blob.arrayBuffer();
        let s = ''; const u8 = new Uint8Array(buf);
        for (let i = 0; i < u8.length; i += 0x8000) s += String.fromCharCode.apply(null, u8.subarray(i, i + 0x8000));
        return btoa(s);
      }, [id, v.tr]);
      const name = await page.evaluate(([id, suf]) => window.OVERLAY_ART.fileName(id, suf), [id, v.suf]);
      await writeFile(join(dir, name), Buffer.from(b64, 'base64'));
      files++;
    }
    const svg = await page.evaluate(id => window.OVERLAY_ART.svg(id, { transparent: !window.OVERLAY_ART.meta(id).opaque }), id);
    const sname = await page.evaluate(id => window.OVERLAY_ART.fileName(id, '.svg'), id);
    await writeFile(join(dir, sname), svg);
    files++;
    console.log(`${p.id}  ${id}  ${meta.w}×${meta.h}  ${meta.title}`);
  }
}

await browser.close();
console.log(`\n${files} files → ${OUT}`);
if (errors.length) { console.error('\nPage errors:\n' + errors.join('\n')); process.exit(2); }

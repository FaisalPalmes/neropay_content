/* Shared renderer for every motion graphics series.
 *
 *   node motion/render.mjs <series>/<episode> [--ratio 9x16] [--draft] [--jpeg]
 *
 * Drives the composition's setFrame(n) and takes one screenshot per frame, then
 * hands the sequence to ffmpeg. The composition owns the timeline; this file
 * only turns it into pixels. Absolute paths throughout — backgrounding a render
 * with & breaks a cd chain and frames land in $HOME.
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
/* a 3D-transformed sign is re-rastered by the compositor a frame after its transform changes; two animation frames settle it */
const settle = pg => pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const CROPS = { '16x9':[1920,1080], '9x16':[1080,1920], '4x5':[1080,1350], '1x1':[1080,1080] };

const args = process.argv.slice(2);
const target = args[0];
if (!target) { console.error('usage: node motion/render.mjs <series>/<episode>'); process.exit(1); }
const only  = args.includes('--ratio') ? args[args.indexOf('--ratio') + 1] : null;
const draft = args.includes('--draft');
const pageURL = ratio => pathToFileURL(page_).href + (ratio === '16x9' ? '?caps=0' : '');   /* v6: captions live in the composition; the 16:9 master stays clean */
const jpeg  = args.includes('--jpeg');   /* frames as JPEG q97 instead of PNG: the PNG encode is two-thirds of a full-frame 3D render's cost */

const epDir = resolve(HERE, target);
const page_ = resolve(epDir, 'index.html');
const out   = resolve(epDir, 'out');
if (!existsSync(page_)) { console.error(`no index.html at ${page_}`); process.exit(1); }
mkdirSync(out, { recursive:true });

/* The container ships Chrome under PLAYWRIGHT_BROWSERS_PATH and the npm
   playwright may expect a newer build than is present. Use what is on disk
   rather than downloading — the web container may not be able to fetch it. */
function findChrome(){
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
  if (!existsSync(root)) return undefined;
  const builds = readdirSync(root)
    .filter(d => d.startsWith('chromium-'))
    .sort((a, b) => (+b.split('-')[1] || 0) - (+a.split('-')[1] || 0));
  for (const b of builds) {
    const exe = resolve(root, b, 'chrome-linux', 'chrome');
    if (existsSync(exe)) return exe;
  }
  return undefined;
}
const executablePath = findChrome();
console.log(`  chrome: ${executablePath || 'playwright default'}`);
const browser = await chromium.launch({ executablePath, args:['--allow-file-access-from-files'] });

/* ---- the timing law, asserted before a single frame is written ---- */
{
  const pg = await browser.newPage({ viewport:{ width:1080, height:1920 } });
  await pg.goto(pathToFileURL(page_).href);
  await pg.evaluate(() => document.fonts.ready); await pg.waitForFunction(() => window.READY !== false && typeof window.setFrame === 'function', null, { timeout:60000 });
  const rows = await pg.evaluate(() => window.lawReport());
  const dur  = await pg.evaluate(() => window.DURATION);
  console.log(`\n  timing law — hold = max(1.5, words x 0.4)\n`);
  const w = Math.max(...rows.map(r => r.beat.length));
  for (const r of rows)
    console.log(`  ${r.pass ? 'ok  ' : 'FAIL'}${r.beat.padEnd(w)}  ${String(r.words).padStart(2)} words` +
                `  needs ${String(r.required).padStart(5)}s  holds ${String(r.hold).padStart(5)}s`);
  const bad = rows.filter(r => !r.pass);
  console.log(`\n  duration ${dur.toFixed(2)}s`);
  if (bad.length) { console.error(`\n  ${bad.length} beat(s) break the timing law. Nothing rendered.\n`); process.exit(1); }
  await pg.close();
}

/* ---- frame scan: nothing may overflow the stage or sit under the footer ----
   Sampled across the whole timeline at every ratio. Caught the beat-3 stack
   running 10px past the right edge of the 9:16 frame on the first build. */
{
  const FAIL = [];
  for (const [ratio, [W, H]] of Object.entries(CROPS)) {
    if (only && ratio !== only) continue;
    const pg = await browser.newPage({ viewport:{ width:W, height:H } });
    await pg.goto(pageURL(ratio));
    await pg.evaluate(() => document.fonts.ready); await pg.waitForFunction(() => window.READY !== false && typeof window.setFrame === 'function', null, { timeout:60000 });
    await pg.addStyleTag({ content:`#stage{width:${W}px;height:${H}px}` });
    const { fps, dur } = await pg.evaluate(() => ({ fps:window.FPS, dur:window.DURATION }));
    for (let t = 0; t < dur; t += 0.25) {
      await pg.evaluate(f => window.setFrame(f), Math.round(t * fps));
      const bad = await pg.evaluate(([W, H]) => {
        const out = [];
        const footEl = document.querySelector('#footer'); const foot = footEl ? footEl.getBoundingClientRect() : { top:Infinity, bottom:Infinity };   /* v3 compositions carry no persistent footer */
        /* board compositions mark the station the camera has landed on with data-active;
           only that station's content is scanned. Between beats (camera moving) nothing on
           the board is active and only stage-level layers are checked. */
        const active = [...document.querySelectorAll('[data-active]')];   /* v5 worlds mark every sign of the current section */
        for (const el of document.querySelectorAll('#stage *')) {
          if (el.id === 'footer' || el.closest('#footer') || el.id === 'cut') continue;
          if (el.closest('#board') && !active.some(a => a.contains(el))) continue;
          if (el.closest('[data-noscan]')) continue;   /* a ruler that runs off the edge by design */
          /* .layer boxes are inset:0 by design — only leaf content can overflow */
          if (el.classList.contains('layer') || el.children.length) continue;
          const cs = getComputedStyle(el);
          if (cs.opacity === '0' || cs.visibility === 'hidden') continue;
          /* hidden by any ancestor (a masked span, a faded layer) — not on screen, not scanned */
          let hidden = false;
          for (let a = el.parentElement; a && a.id !== 'stage'; a = a.parentElement){
            const ac = getComputedStyle(a); if (ac.opacity === '0' || ac.visibility === 'hidden' || ac.display === 'none'){ hidden = true; break; } }
          if (hidden) continue;
          if (!el.textContent.trim() && !String(el.className).includes('fill')) continue;
          const r = el.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) continue;
          const tag = el.id || el.className || el.tagName;
          if (r.right > W + 0.5)  out.push(`${tag} right ${Math.round(r.right)} > ${W}`);
          if (r.left  < -0.5)     out.push(`${tag} left ${Math.round(r.left)} < 0`);
          if (r.bottom > foot.top - 8 && r.top < foot.bottom)
            out.push(`${tag} collides with the source footer`);
        }
        return [...new Set(out)];
      }, [W, H]);
      if (bad.length) FAIL.push(`  ${ratio} @ ${t.toFixed(2)}s — ${bad.join('; ')}`);
    }
    await pg.close();
  }
  if (FAIL.length) {
    console.error(`\n  frame scan failed:\n${[...new Set(FAIL)].slice(0, 12).join('\n')}`);
    console.error(`\n  ${FAIL.length} overflow(s). Nothing rendered.\n`);
    process.exit(1);
  }
  console.log(`  frame scan: no overflow, no footer collision`);
}

for (const [ratio, [W, H]] of Object.entries(CROPS)) {
  if (only && ratio !== only) continue;
  const frames = resolve(out, `frames-${ratio}`);
  rmSync(frames, { recursive:true, force:true });
  mkdirSync(frames, { recursive:true });

  const pg = await browser.newPage({ viewport:{ width:W, height:H }, deviceScaleFactor:1 });
  await pg.goto(pageURL(ratio));
  await pg.evaluate(() => document.fonts.ready); await pg.waitForFunction(() => window.READY !== false && typeof window.setFrame === 'function', null, { timeout:60000 });
  const { fps, dur } = await pg.evaluate(() => ({ fps:window.FPS, dur:window.DURATION }));
  const total = Math.ceil(dur * fps);
  const stage = pg.locator('#stage');
  await pg.addStyleTag({ content:`#stage{width:${W}px;height:${H}px}` });

  process.stdout.write(`\n  ${ratio}  ${W}x${H}  ${total} frames  `);
  for (let n = 0; n < total; n++) {
    await pg.evaluate(f => window.setFrame(f), n); await settle(pg);
    await stage.screenshot(jpeg ? { path:resolve(frames, String(n).padStart(5,'0') + '.jpg'), type:'jpeg', quality:97 } : { path:resolve(frames, String(n).padStart(5,'0') + '.png') });
    if (n % 150 === 0) process.stdout.write('.');
  }
  await pg.close();

  const mp4 = resolve(out, `${basename(epDir)}-${ratio}.mp4`);
  execFileSync('ffmpeg', ['-y','-loglevel','error','-framerate',String(fps),
    '-i', resolve(frames, jpeg ? '%05d.jpg' : '%05d.png'),
    '-c:v','libx264','-crf', draft ? '26' : '18','-pix_fmt','yuv420p',
    '-movflags','+faststart', mp4], { stdio:'inherit' });
  console.log(` -> ${mp4.replace(resolve(HERE,'..') + '/','')}`);
}
await browser.close();
console.log();

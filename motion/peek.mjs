/* Stills at chosen times, plus the law report — a look before a render.
 *   node motion/peek.mjs <series>/<episode> <ratio> t1 t2 ...      -> <episode>/out/peek/<ratio>-<t>.png + sheet.jpg
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = dirname(fileURLToPath(import.meta.url));
/* a 3D-transformed sign is re-rastered by the compositor a frame after its transform changes; two animation frames settle it */
const settle = pg => pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
const CROPS = { '16x9':[1920,1080], '9x16':[1080,1920], '4x5':[1080,1350], '1x1':[1080,1080] };
const [target, ratio, ...times] = process.argv.slice(2);
const ep = resolve(HERE, target), out = resolve(ep, 'out/peek'); mkdirSync(out, { recursive:true });
const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const build = readdirSync(root).filter(d => d.startsWith('chromium-')).sort().pop();
const browser = await chromium.launch({ executablePath: resolve(root, build, 'chrome-linux/chrome'), args:['--allow-file-access-from-files'] });
const [W, H] = CROPS[ratio];
const pg = await browser.newPage({ viewport:{ width:W, height:H } }); pg.on('pageerror', e => console.log('  pageerror:', e.message)); pg.on('console', m => { if (!/GL Driver/.test(m.text())) console.log('  console:', m.text()); });
await pg.goto(pathToFileURL(resolve(ep, 'index.html')).href);
await pg.evaluate(() => document.fonts.ready); await pg.waitForFunction(() => window.READY !== false && typeof window.setFrame === 'function', null, { timeout:60000 });
await pg.addStyleTag({ content:`#stage{width:${W}px;height:${H}px}` });
const rows = await pg.evaluate(() => window.lawReport()); const dur = await pg.evaluate(() => window.DURATION); const cams = await pg.evaluate(() => window.CAMS || null); if (cams) console.log('  camera:', cams.map(c => `${c.st}@${c.t}+${c.d}`).join('  '));
for (const r of rows) console.log(`  ${r.pass ? 'ok  ' : 'FAIL'} ${r.beat.padEnd(14)} ${String(r.words).padStart(2)} words  needs ${r.required}s  holds ${r.hold}s`);
console.log(`  duration ${dur}s`);
const files = [];
for (const ts of times){ const t = +ts; await pg.evaluate(f => window.setFrame(f), Math.round(t * 30)); await settle(pg);
  const f = resolve(out, `${ratio}-${t.toFixed(2).padStart(6,'0')}.png`); await pg.locator('#stage').screenshot({ path:f }); files.push(f); }
await browser.close();
if (files.length){ const cols = Math.min(4, files.length), rowsN = Math.ceil(files.length / cols);
  execFileSync('ffmpeg', ['-y','-loglevel','error','-pattern_type','glob','-i', resolve(out, `${ratio}-*.png`), '-vf',
    `scale=${ratio === '16x9' ? 480 : 300}:-1,tile=${cols}x${rowsN}:padding=6:margin=6:color=0x1A1D22`, '-frames:v','1', resolve(out, `sheet-${ratio}.jpg`)]);
  console.log(`  sheet: ${resolve(out, `sheet-${ratio}.jpg`)}`); }

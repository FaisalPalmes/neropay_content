/* Assert the timing law on a HyperFrames composition that exposes window.lawReport().
   node motion/law.mjs motion/showcase/index.html */
import { chromium } from 'playwright';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
const file = resolve(process.argv[2]);
const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const build = readdirSync(root).filter(d => d.startsWith('chromium-')).sort((a, b) => (+b.split('-')[1]) - (+a.split('-')[1]))[0];
const exe = resolve(root, build, 'chrome-linux', 'chrome');
const br = await chromium.launch({ executablePath: existsSync(exe) ? exe : undefined });
const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
await pg.goto(pathToFileURL(file).href);
await pg.evaluate(() => document.fonts.ready);
const rows = await pg.evaluate(() => window.lawReport());
const w = Math.max(...rows.map(r => r.beat.length));
console.log('\n  timing law — hold = max(1.5, words x 0.4)\n');
for (const r of rows) console.log(`  ${r.pass ? 'ok  ' : 'FAIL'}${r.beat.padEnd(w)}  ${String(r.words).padStart(2)} words  needs ${String(r.required).padStart(5)}s  holds ${String(r.hold).padStart(5)}s`);
await br.close();
const bad = rows.filter(r => !r.pass).length;
console.log(bad ? `\n  ${bad} beat(s) break the law.\n` : '\n  All beats pass.\n');
process.exit(bad ? 1 : 0);

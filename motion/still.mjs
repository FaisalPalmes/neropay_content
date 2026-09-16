/* A still of any HTML page: node motion/still.mjs <page.html> <out.png> [W H]. Waits for window.READY. */
import { chromium } from 'playwright';
import { readdirSync } from 'node:fs'; import { resolve } from 'node:path'; import { pathToFileURL } from 'node:url';
const [page_, out, W = '1920', H = '900'] = process.argv.slice(2);
const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers'; const build = readdirSync(root).filter(d => d.startsWith('chromium-')).sort().pop();
const browser = await chromium.launch({ executablePath: resolve(root, build, 'chrome-linux/chrome'), args:['--allow-file-access-from-files'] });
const pg = await browser.newPage({ viewport:{ width:+W, height:+H } }); pg.on('pageerror', e => console.log('  pageerror:', e.message));
await pg.goto(pathToFileURL(resolve(page_)).href);
await pg.waitForFunction(() => window.READY !== false, null, { timeout:60000 });
await pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
await pg.screenshot({ path:resolve(out) }); await browser.close(); console.log('  ->', out);

import { chromium } from 'playwright';
import { readdirSync } from 'node:fs'; import { resolve } from 'node:path'; import { pathToFileURL } from 'node:url';
const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers'; const build = readdirSync(root).filter(d => d.startsWith('chromium-')).sort().pop();
const browser = await chromium.launch({ executablePath: resolve(root, build, 'chrome-linux/chrome'), args:['--allow-file-access-from-files'] });
const pg = await browser.newPage({ viewport:{ width:1080, height:1920 } });
await pg.goto(pathToFileURL(resolve(process.argv[2])).href);
await pg.waitForFunction(() => window.READY !== false, null, { timeout:60000 });
console.log(JSON.stringify(await pg.evaluate(() => ({ anchors:window.ANCHORS, cams:window.CAMS, dur:window.DURATION, head:window.HEAD, beat:window.BEAT }))));
await browser.close();

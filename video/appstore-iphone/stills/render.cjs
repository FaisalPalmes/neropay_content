// Captures stills/index.html#1…#6 at 2× (1320 × 2868, Apple's 6.9" portrait size) into stills/out/.
//   node stills/render.cjs      (from video/appstore-iphone; uses the repo's pinned Playwright + pre-installed Chromium)
const path = require('path'), fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../motion/node_modules/playwright'));
(async () => {
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(fs.existsSync);
  const b = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files', '--no-sandbox'] });
  const out = path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
  for (let n = 1; n <= 6; n++) {
    const pg = await b.newPage({ viewport: { width: 660, height: 1434 }, deviceScaleFactor: 2 });
    await pg.goto('file://' + path.join(__dirname, 'index.html') + '#' + n);
    await pg.evaluate(() => document.fonts.ready);
    await pg.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(out, `neropay-appstore-6.9-${n}.png`) });
    await pg.close();
  }
  await b.close(); console.log('rendered 6 to', out);
})();

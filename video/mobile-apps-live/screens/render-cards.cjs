// Screenshots each card in cards.html on a transparent ground at 2x. node render-cards.cjs <outdir>
const path = require('path');
const fs = require('fs');
// Playwright from motion/ (cloud) or from whatever the local machine installed; the cloud's pinned Chromium if it exists
let pw; try { pw = require(path.resolve(__dirname, '../../../motion/node_modules/playwright')); } catch { pw = require('playwright'); }
const { chromium } = pw;
const EXE = ['/opt/pw-browsers/chromium'].find(p => fs.existsSync(p));
(async () => {
  const out = process.argv[2]; fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
  const p = await b.newPage({ viewport: { width: 600, height: 500 }, deviceScaleFactor: 2 });
  for (const c of ['shop', 'bunch', 'deliver', 'paid']) {
    await p.goto('file://' + path.resolve(__dirname, 'cards.html') + '?card=' + c);
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.locator('#w').screenshot({ path: path.join(out, c + '.png'), omitBackground: true });
  }
  await b.close();
})();

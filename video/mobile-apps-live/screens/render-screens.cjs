// Renders ?app=<name> to a 24 fps PNG sequence, 121 frames, 780x1688 (2x). node render-screens.cjs <app> <outdir> [frames]
const path = require('path');
const fs = require('fs');
// Playwright from motion/ (cloud) or from whatever the local machine installed; the cloud's pinned Chromium if it exists
let pw; try { pw = require(path.resolve(__dirname, '../../../motion/node_modules/playwright')); } catch { pw = require('playwright'); }
const { chromium } = pw;
const EXE = ['/opt/pw-browsers/chromium'].find(p => fs.existsSync(p));
(async () => {
  const [app, out, n = 121] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await p.goto('file://' + path.resolve(__dirname, 'screens.html') + '?app=' + app);
  await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
  for (let i = 0; i < +n; i++) {
    await p.evaluate(t => window.render(t), i / 24);
    await p.screenshot({ path: path.join(out, String(i).padStart(4, '0') + '.png') });
  }
  await b.close();
})();

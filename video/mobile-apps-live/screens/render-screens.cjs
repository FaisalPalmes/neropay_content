// Renders ?app=<name> to a 24 fps PNG sequence, 780x1688 (2x), one PNG per plate frame.
// node render-screens.cjs <app> <fingers.json> <outdir> [frames]   (fingers.json from tools/fingers.py)
const path = require('path');
const fs = require('fs');
// Playwright from motion/ (cloud) or from whatever the local machine installed; the cloud's pinned Chromium if it exists
let pw; try { pw = require(path.resolve(__dirname, '../../../motion/node_modules/playwright')); } catch { pw = require('playwright'); }
const { chromium } = pw;
const EXE = ['/opt/pw-browsers/chromium'].find(p => fs.existsSync(p));
(async () => {
  const [app, fingers, out, n = 121] = process.argv.slice(2);
  fs.mkdirSync(out, { recursive: true });
  const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  p.on('console', m => console.log(app, m.text())); p.on('pageerror', e => { console.error(app, e.message); process.exitCode = 1; });
  await p.goto('file://' + path.resolve(__dirname, 'screens.html') + '?app=' + app);
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  await p.evaluate(f => window.setup(f), JSON.parse(fs.readFileSync(fingers, 'utf8')));
  await p.waitForTimeout(200);
  for (let i = 0; i < +n; i++) {
    await p.evaluate(k => window.render(k), i);
    await p.screenshot({ path: path.join(out, String(i).padStart(4, '0') + '.png') });
  }
  await b.close();
})();

// Renders a liquid-glass overlay spec over its frames. node render-overlay.cjs <spec.json> <outdir>
const path = require('path'), fs = require('fs');
let pw; try { pw = require(path.resolve(__dirname, '../../../motion/node_modules/playwright')); } catch { pw = require('playwright'); }
const { chromium } = pw;
const EXE = ['/opt/pw-browsers/chromium'].find(p => fs.existsSync(p));
(async () => {
  const [specPath, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  spec.frames = spec.frames.map(f => 'file://' + path.resolve(f));
  const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
  const p = await b.newPage({ viewport: { width: spec.w, height: spec.h }, deviceScaleFactor: 1 });
  await p.goto('file://' + path.resolve(__dirname, 'overlay.html'));
  await p.evaluate(s => window.init(s), spec);
  await p.evaluate(() => document.fonts.ready);
  for (let n = 0; n < spec.frames.length; n++) {
    await p.evaluate(n => window.setFrame(n), n);
    await p.screenshot({ path: path.join(out, String(n).padStart(4, '0') + '.png') });
  }
  await b.close();
})();

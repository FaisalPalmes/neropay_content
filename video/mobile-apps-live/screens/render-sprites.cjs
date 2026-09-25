// Renders every card in a glass spec as three 3x sprites (shadow, mask, face) for tools/glass_comp.py.
// node render-sprites.cjs <spec.json> <outdir>
const path = require('path'), fs = require('fs');
let pw; try { pw = require(path.resolve(__dirname, '../../../motion/node_modules/playwright')); } catch { pw = require('playwright'); }
const { chromium } = pw;
const EXE = ['/opt/pw-browsers/chromium'].find(p => fs.existsSync(p));
(async () => {
  const [specPath, out] = process.argv.slice(2); fs.mkdirSync(out, { recursive: true });
  const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
  const b = await chromium.launch(EXE ? { executablePath: EXE } : {});
  const p = await b.newPage({ viewport: { width: 1400, height: 700 }, deviceScaleFactor: 3 });
  await p.goto('file://' + path.resolve(__dirname, 'overlay.html'));
  for (const c of spec.cards) {
    for (const mode of ['face', 'mask', 'shadow']) {
      let box = await p.evaluate(([h, m]) => window.sprite(h, m), [c.html, mode]);
      // whole CSS pixels, so the sprite's centre is the card's centre exactly
      await p.evaluate(() => { const e = document.getElementById('c'), r = e.getBoundingClientRect();
        e.style.width = Math.ceil(r.width) + 'px'; e.style.height = Math.ceil(r.height) + 'px'; });
      await p.evaluate(() => Promise.all([document.fonts.ready, ...[...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))]));
      box = await p.evaluate(() => { const r = document.getElementById('c').getBoundingClientRect(); return { x: r.left - 100, y: r.top - 100, width: r.width + 200, height: r.height + 200 }; });
      await p.screenshot({ path: path.join(out, `${c.id}-${mode}.png`), clip: box, omitBackground: true });
    }
  }
  await b.close();
})();

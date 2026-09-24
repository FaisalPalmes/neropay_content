// The jitter gate (24 Sep 2026). v3's first master shimmered: every scene's layer was scaled for a slow push, and scaled type
// re-snaps its glyphs to the pixel grid every frame. This proves the type is dead still once it has landed: for each scene it
// takes the headline's box at a moment after its last reveal, screenshots it on three consecutive frames and compares the
// ink cores (pixels far darker than any ground, so the drifting light and panes behind the soft glyph edges do not count). Any change fails the build.
//   node check-still.cjs          exit 1 on a moving headline
const { chromium } = require(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => document.fonts.ready);
  const scenes = await p.evaluate(() => SCENES_FOR_CHECK());
  let fail = 0;
  for (const s of scenes) {
    if (s.t === null) { console.log(`  scene ${s.i + 1}: no settled moment, skipped`); continue; }
    const inks = [];
    for (const k of [0, 1, 2]) {
      await p.evaluate(t => setTime(t), s.t + k / 25);
      const box = await p.evaluate(i => { const r = document.querySelectorAll('.sc')[i].querySelector('.h').getBoundingClientRect();
        return { x: Math.floor(r.x), y: Math.floor(r.y), width: Math.ceil(r.width), height: Math.ceil(r.height) }; }, s.i);
      const buf = await p.screenshot({ clip: box });
      inks.push(await p.evaluate(async b64 => { const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height).data; let bits = ''; for (let j = 0; j < d.length; j += 4) bits += (d[j] + d[j + 1] + d[j + 2] < 150) ? '1' : '0';
        return bits; }, buf.toString('base64')));
    }
    /* a moving glyph shifts hundreds of core pixels; the light passing behind flips at most a handful of edge pixels */
    const diff = (x, y) => { let n = 0; for (let j = 0; j < x.length; j++) if (x[j] !== y[j]) n++; return n; };
    const moved = Math.max(diff(inks[0], inks[1]), diff(inks[1], inks[2])) > 12;
    console.log(`  scene ${s.i + 1} at ${s.t.toFixed(2)}s: ${moved ? 'HEADLINE MOVES' : 'still'}`); if (moved) fail++;
  }
  await b.close();
  console.log(fail ? `FAIL: ${fail} scene(s) with moving type` : 'ok: every headline is still once landed');
  process.exit(fail ? 1 : 0);
})();

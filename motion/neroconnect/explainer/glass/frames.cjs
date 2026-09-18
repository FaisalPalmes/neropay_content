// node frames.js <file.html> [still|seq] [from] [to]
// still: one 2x PNG of the rest state (frame 200) -> out/glass/<name>.png
// seq:   1x PNGs frames from..to -> out/glass/<name>/frame_%05d.png
const { chromium } = require('playwright');
const path = require('path'); const fs = require('fs');
(async () => {
  const [,, file, mode='still', from='0', to='120'] = process.argv;
  const name = path.basename(file, '.html');
  const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const build = fs.existsSync(path.join(root, 'chromium')) ? path.join(root, 'chromium') : path.join(root, fs.readdirSync(root).filter(d => d.startsWith('chromium-')).sort().pop(), 'chrome-linux/chrome');
const b = await chromium.launch({ executablePath: build, args: ['--allow-file-access-from-files'] });
  if (mode === 'still') {
    const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 });
    await pg.goto('file://' + path.resolve(file)); await pg.waitForTimeout(300);
    await pg.evaluate(() => setFrame(300));
    fs.mkdirSync('out/glass', { recursive: true });
    await pg.screenshot({ path: `out/glass/${name}.png` }); console.log(`out/glass/${name}.png`);
  } else {
    const pg = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await pg.goto('file://' + path.resolve(file)); await pg.waitForTimeout(300);
    const dir = `out/glass/${name}`; fs.mkdirSync(dir, { recursive: true });
    for (let f = +from; f <= +to; f++) {
      await pg.evaluate(n => setFrame(n), f);
      await pg.screenshot({ path: `${dir}/frame_${String(f).padStart(5, '0')}.png` });
    }
    console.log(dir);
  }
  await b.close();
})();

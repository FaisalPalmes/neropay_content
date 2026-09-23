// Captures stills/index.html#1…#6 at 2× (1320 × 2868, Apple's 6.9" portrait size) into stills/out/.
//   node stills/render.cjs          the carousel: slide 1 white hero, 2–6 the features, 7 the dark hero
//   node stills/render.cjs heroes   the eight frame-1 variants (#1-1 … #1-8) as out/hero-v1…8.png
//   node stills/render.cjs marks    Faisal's pick (#1-5) with the mark placed ten ways, out/hero-mark1…10.png
const path = require('path'), fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../motion/node_modules/playwright'));
(async () => {
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(fs.existsSync);
  const b = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files', '--no-sandbox'] });
  const out = path.join(__dirname, 'out'); fs.mkdirSync(out, { recursive: true });
  const jobs = process.argv[2] === 'heroes' ? [1,2,3,4,5,6,7,8].map(v => ['1-' + v, `hero-v${v}`])
    : process.argv[2] === 'more' ? [1,2,3,4,5,6,7,8,9,10].map(m => ['1-6-' + m, `hero-more${m}`])
    : process.argv[2] === 'marks' ? [1,2,3,4,5,6,7,8,9,10].map(m => ['1-5-' + m, `hero-mark${m}`])
    : [['1-5-2','neropay-appstore-6.9-1'], ...[2,3,4,5,6].map(n => [String(n), `neropay-appstore-6.9-${n}`]),
       ['1-5-10','neropay-appstore-6.9-7']];   /* slide 1 the white tap screen (Faisal's pick); 7 the dark one */
  for (const [n, name] of jobs) {
    const pg = await b.newPage({ viewport: { width: 660, height: 1434 }, deviceScaleFactor: 2 });
    await pg.goto('file://' + path.join(__dirname, 'index.html') + '#' + n);
    await pg.evaluate(() => document.fonts.ready);
    await pg.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(out, name + '.png') });
    await pg.close();
  }
  await b.close(); console.log('rendered', jobs.length, 'to', out);
})();

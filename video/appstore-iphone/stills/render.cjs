// Captures stills/index.html#1…#6 at 2× (1320 × 2868, Apple's 6.9" portrait size) into stills/out/.
//   node stills/render.cjs          the carousel: slide 1 white hero, 2–6 the features, 7 the dark hero
//   node stills/render.cjs heroes   the eight frame-1 variants (#1-1 … #1-8) as out/hero-v1…8.png
//   node stills/render.cjs marks    Faisal's pick (#1-5) with the mark placed ten ways, out/hero-mark1…10.png
//   node stills/render.cjs layers   the video's baked layers (?layer=…), 2920 × 2868 transparent, into ../assets/v6/
//   node stills/render.cjs ipad     the carousel refitted to the iPad 13" (2064 × 2752) into out/ipad/
//   node stills/render.cjs play     the carousel refitted to Google Play's phone size (1080 × 1920) into out/play/
const path = require('path'), fs = require('fs');
const { chromium } = require(path.resolve(__dirname, '../../../motion/node_modules/playwright'));
(async () => {
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find(fs.existsSync);
  const b = await chromium.launch({ executablePath: exe, args: ['--allow-file-access-from-files', '--no-sandbox'] });
  const FMT = ['ipad', 'play'].includes(process.argv[2]) ? process.argv[2] : null;
  const DIM = { ipad: [1032, 1376, 2], play: [810, 1440, 4/3] }[FMT] || [660, 1434, 2];
  const out = path.join(__dirname, process.argv[2] === 'layers' ? '../assets/v6' : FMT ? 'out/' + FMT : 'out'); fs.mkdirSync(out, { recursive: true });
  const stem = { ipad: 'neropay-appstore-ipad13-', play: 'neropay-play-phone-' }[FMT] || 'neropay-appstore-6.9-';
  const LAY = process.argv[2] === 'layers';
  const jobs = LAY ? [['1-5-2','h'], ['2','a'], ['3','s'], ['3','h'], ['4','a'], ['5','s'], ['5','h'], ['6','s'], ['6','h']]
      .map(([n, l]) => [n + '?' + l, `L${n.split('-')[0]}${l}`])
    : process.argv[2] === 'heroes' ? [1,2,3,4,5,6,7,8].map(v => ['1-' + v, `hero-v${v}`])
    : process.argv[2] === 'more' ? [1,2,3,4,5,6,7,8,9,10].map(m => ['1-6-' + m, `hero-more${m}`])
    : process.argv[2] === 'marks' ? [1,2,3,4,5,6,7,8,9,10].map(m => ['1-5-' + m, `hero-mark${m}`])
    : [['1-5-2', stem + '1'], ...[2,3,4,5,6].map(n => [String(n), stem + n]), ['1-5-10', stem + '7']];   /* slide 1 the white tap screen (Faisal's pick); 7 the dark one */
  for (const [n, name] of jobs) {
    const [hash, layer] = n.split('?');
    const pg = await b.newPage({ viewport: { width: layer ? 1460 : DIM[0], height: DIM[1] }, deviceScaleFactor: DIM[2] });
    await pg.goto('file://' + path.join(__dirname, 'index.html') + (layer ? '?layer=' + layer : FMT ? '?fmt=' + FMT : '') + '#' + hash);
    await pg.evaluate(() => document.fonts.ready);
    await pg.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
    await pg.waitForTimeout(300);
    await pg.screenshot({ path: path.join(out, name + '.png'), omitBackground: !!layer });
    await pg.close();
  }
  await b.close(); console.log('rendered', jobs.length, 'to', out);
})();

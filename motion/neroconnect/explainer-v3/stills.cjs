// Review stills: one frame per time given, and a contact sheet.  node stills.cjs <outdir> t1 t2 ...
const { chromium } = require(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright');
const path = require('path');
(async () => { const [out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = []; p.on('pageerror', e => errs.push(String(e)));
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => document.fonts.ready);
  for (const t of ts) { await p.evaluate(x => setTime(x), +t); await p.screenshot({ path: path.join(out, `t${String(t).padStart(6, '0')}.png`) }); }
  console.log('errors:', errs.length ? errs : 'none'); await b.close(); })();

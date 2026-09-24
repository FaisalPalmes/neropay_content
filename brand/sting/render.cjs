// Renders the locked NeroPay logo sting and outro: every look x every format, 60fps, H.264.
//   node brand/sting/render.cjs                        all twelve masters into brand/sting/
//   node brand/sting/render.cjs outro yellow 16x9      one of them (piece: sting | outro)
//   SMALL="Next episode" BIG="The Maths, part two" node brand/sting/render.cjs outro yellow 16x9 out.mp4
//                                                      an outro with its own subtext, to a named file
// Served over http, not file:// — Chromium refuses a CSS mask image from a file:// page and the bars vanish.
const { chromium } = require(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..'), OUT = __dirname, FPS = 60;
const PIECES = { sting: ['index.html', 2.6], outro: ['outro.html', 5.0] };
const SIZE = { '9x16': [1080, 1920], '16x9': [1920, 1080], '1x1': [1080, 1080] };
const [, , A, B, C, NAMED] = process.argv;
const WHICH = A ? [A] : Object.keys(PIECES);
const LOOKS = B ? [B] : ['yellow', 'white'];
const FMTS = C ? [C] : Object.keys(SIZE);
const SUBQ = (process.env.SMALL !== undefined ? '&small=' + encodeURIComponent(process.env.SMALL) : '') + (process.env.BIG ? '&big=' + encodeURIComponent(process.env.BIG) : '');
const TYPES = { '.html': 'text/html', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(ROOT) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(0);
(async () => {
  const port = server.address().port, b = await chromium.launch();
  for (const piece of WHICH) for (const v of LOOKS) for (const fmt of FMTS) {
    const [page, DUR] = PIECES[piece];
    const [w, h] = SIZE[fmt], tmp = fs.mkdtempSync(path.join(require('os').tmpdir(), 'sting-'));
    const p = await b.newPage({ viewport: { width: w, height: h } }); const errs = [];
    p.on('pageerror', e => errs.push(String(e)));
    await p.goto(`http://127.0.0.1:${port}/sting/${page}?v=${v}&fmt=${fmt}${piece === 'outro' ? SUBQ : ''}`, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready);
    const n = Math.round(DUR * FPS);
    for (let f = 0; f < n; f++) { await p.evaluate(k => window.setFrame(k, 60), f);
      await p.screenshot({ path: path.join(tmp, String(f).padStart(4, '0') + '.png') }); }
    await p.close();
    const out = NAMED ? path.resolve(NAMED) : path.join(OUT, `neropay-${piece}-${v}-${fmt}.mp4`);
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, '%04d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-movflags', '+faststart', out]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log(path.basename(out), n, 'frames', errs.length ? errs : 'no errors');
  }
  await b.close(); server.close();
})();

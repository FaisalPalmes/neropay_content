// NeroConnect explainer v3 — render the film, splice in the locked outro, write the sound cues, mix, mux.
//   node render.cjs --preview        1280×720 review cut  → out/ncx-v3-preview.mp4
//   node render.cjs                  1920×1080 master      → out/ncx-v3-16x9.mp4
//   node render.cjs --from 60 --to 75 --preview   a slice, for checking one stretch
// Frames at 25 fps from index.html's setTime(t); from OUTRO_AT the frames come from brand/sting/outro.html (yellow,
// "The full guides are at / docs.neropay.app"), served over http because Chromium drops a CSS mask on a file:// page.
// Cues come from the page itself (every glass arrival, every scene change), so a retime re-times the sound too.
const { chromium } = require(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const HERE = __dirname, REPO = path.resolve(HERE, '../../..'), FPS = 25;
const A = process.argv.slice(2), PREVIEW = A.includes('--preview');
const arg = k => A.includes(k) ? +A[A.indexOf(k) + 1] : null;
const [W, H] = PREVIEW ? [1280, 720] : [1920, 1080];
const OUT = path.join(HERE, 'out'), FR = path.join(OUT, PREVIEW ? 'frames-preview' : 'frames');
const T = { '.html': 'text/html', '.png': 'image/png', '.woff2': 'font/woff2', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const f = path.join(REPO, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(REPO) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);

(async () => {
  /* the jitter gate: no render while any landed headline moves */
  if (!A.includes('--from')) execFileSync('node', [path.join(HERE, 'check-still.cjs')], { stdio: 'inherit' });
  const port = srv.address().port, b = await chromium.launch();
  const mk = async url => { const p = await b.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: W / 1920 });
    const errs = []; p.on('pageerror', e => errs.push(String(e))); await p.goto(url, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); p.errs = errs; return p; };
  const film = await mk(`http://127.0.0.1:${port}/motion/neroconnect/explainer-v3/index.html`);
  const outro = await mk(`http://127.0.0.1:${port}/brand/sting/outro.html?v=yellow&fmt=16x9&small=${encodeURIComponent('The full guides are at')}&big=docs.neropay.app`);
  const { OUTRO_AT, DURATION, arrivals, scenes } = await film.evaluate(() => ({ OUTRO_AT, DURATION,
    arrivals: [...document.querySelectorAll('.g[data-at]')].map(e => +e.dataset.at).sort((a, b) => a - b),
    scenes: [...document.querySelectorAll('.sc')].map((_, i) => i) }));
  const f0 = Math.round((arg('--from') ?? 0) * FPS), f1 = Math.round((arg('--to') ?? DURATION) * FPS);
  fs.rmSync(FR, { recursive: true, force: true }); fs.mkdirSync(FR, { recursive: true });
  const t0 = Date.now();
  for (let f = f0; f < f1; f++) {
    const t = f / FPS, p = t < OUTRO_AT ? film : outro;
    await p.evaluate(x => setTime(x), t < OUTRO_AT ? t : Math.min(t - OUTRO_AT, 5.0));
    await p.screenshot({ path: path.join(FR, `f_${String(f - f0).padStart(5, '0')}.jpg`), type: 'jpeg', quality: PREVIEW ? 88 : 95 });
    if (f % 250 === 0) console.log(`  ${t.toFixed(1)}s  ${((Date.now() - t0) / 1000).toFixed(0)}s elapsed`);
  }
  console.log('page errors:', [...film.errs, ...outro.errs].length ? [...film.errs, ...outro.errs] : 'none');
  await b.close(); srv.close();

  /* the sound: one soft tick per glass arrival (never two within 0.45 s, never the same effect twice running), a short air
     on each scene change, the sting's hit where its letters meet and a sparkle as the line lands */
  const starts = (await (async () => { const s = fs.readFileSync(path.join(HERE, 'index.html'), 'utf8');
    return [...s.matchAll(/\{ t: \[([\d.]+), [\d.]+\]/g)].map(m => +m[1]).slice(1); })());
  const cues = []; let last = -9, k = 0;
  for (const t of arrivals) { if (t - last < 0.45 || t >= OUTRO_AT) continue; last = t;
    cues.push({ sfx: ['click-soft', 'pop'][k++ % 2], t: +(t + 0.05).toFixed(3), gain: 0.06, why: 'a glass card lands' }); }
  starts.forEach((t, i) => cues.push({ sfx: ['whoosh-short', 'whoosh'][i % 2], t: +(t - 0.15).toFixed(3), gain: 0.05, why: 'scene change' }));
  cues.push({ sfx: 'impact-bass-1', t: +(OUTRO_AT + 0.92).toFixed(3), gain: 0.2, why: 'the sting: the letters meet' });
  cues.push({ sfx: 'sparkle', t: +(OUTRO_AT + 2.05).toFixed(3), gain: 0.07, why: 'the line slides out under the tile' });
  cues.sort((a, b) => a.t - b.t);
  const mix = { duration: DURATION, head: 0.6, vo: '../explainer/data/vo-master.mp3', target: -14, tp: -3.0,
    vo_filter: 'acompressor=threshold=-20dB:ratio=2.5:attack=8:release=160:makeup=1.6',
    bed: { file: 'video/library/bgm/neroconnect-pulse-100.mp3', t: 0, gain: 0.17, loop_at: 103.35,
      duck: { threshold: 0.025, ratio: 5, attack: 12, release: 420 }, fade: 2.8 }, cues };
  fs.mkdirSync(path.join(HERE, 'data'), { recursive: true });
  fs.writeFileSync(path.join(HERE, 'data/mix.json'), JSON.stringify(mix, null, 1));
  if (arg('--from') !== null || arg('--to') !== null) { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, 'f_%05d.jpg'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', path.join(OUT, 'slice.mp4')]); console.log(path.join(OUT, 'slice.mp4')); return; }
  execFileSync('node', [path.join(REPO, 'motion/mix.mjs'), 'neroconnect/explainer-v3'], { stdio: 'inherit' });
  const name = path.join(OUT, `ncx-v3-${PREVIEW ? 'preview' : '16x9'}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, 'f_%05d.jpg'), '-i', path.join(OUT, 'mix.m4a'),
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', PREVIEW ? '21' : '16', '-preset', PREVIEW ? 'medium' : 'slow', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'copy', '-shortest', '-movflags', '+faststart', name]);
  console.log(name);
})();

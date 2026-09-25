// Partner Programme explainer (25 Sep 2026) — render the film, splice in the locked outro, write the sound cues, mix, mux.
// Built on the NeroConnect explainer v3.6 renderer.
//   node render.cjs --preview        1280×720 review cut  → out/ncx-v3-preview.mp4
//   node render.cjs                  1920×1080 master      → out/ncx-v3-16x9.mp4
//   node render.cjs --from 60 --to 75 --preview   a slice, for checking one stretch
// Frames at 25 fps from index.html's setTime(t); from OUTRO_AT the frames come from brand/sting/outro.html (yellow, the
// NeroConnect lockup Faisal picked on 24 Sep, "Check out NeroConnect at / docs.neropay.app"), served over http because Chromium drops a CSS mask on a file:// page.
// Cues come from the page itself (every glass arrival, every scene change), so a retime re-times the sound too.
const { chromium } = require(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright');
const http = require('http'), fs = require('fs'), path = require('path'), { execFileSync } = require('child_process');
const HERE = __dirname, REPO = path.resolve(HERE, '../../..'), FPS = 25;
const A = process.argv.slice(2), PREVIEW = A.includes('--preview'), SQ = A.includes('--square');   /* --square: the 1:1 (25 Sep 2026) */
const arg = k => A.includes(k) ? +A[A.indexOf(k) + 1] : null;
const [VW, VH] = SQ ? [1080, 1080] : [1920, 1080];
const [W, H] = SQ ? [1080, 1080] : PREVIEW ? [1280, 720] : [1920, 1080];
const OUT = path.join(HERE, 'out'), FR = path.join(OUT, SQ ? 'frames-1x1' : PREVIEW ? 'frames-preview' : 'frames');
const T = { '.html': 'text/html', '.png': 'image/png', '.woff2': 'font/woff2', '.js': 'text/javascript' };
const srv = http.createServer((q, r) => { const f = path.join(REPO, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(REPO) || !fs.existsSync(f)) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r); }).listen(0);

(async () => {
  /* the jitter gate: no render while any landed headline moves */
  if (!A.includes('--from')) for (const g of ['check-still.cjs', 'check-layout.cjs']) execFileSync('node', [path.join(HERE, g)].concat(SQ ? ['1x1'] : []), { stdio: 'inherit' });
  const port = srv.address().port, b = await chromium.launch();
  const mk = async url => { const p = await b.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: W / VW });
    const errs = []; p.on('pageerror', e => errs.push(String(e))); await p.goto(url, { waitUntil: 'networkidle' });
    await p.evaluate(() => document.fonts.ready); await p.waitForFunction(() => window.LAYOUT_READY !== false); p.errs = errs; return p; };
  const film = await mk(`http://127.0.0.1:${port}/motion/partner/street/index.html${SQ ? '?fmt=1x1' : ''}`);
  const outro = await mk(`http://127.0.0.1:${port}/brand/sting/outro.html?v=yellow&fmt=${SQ ? '1x1' : '16x9'}&mark=neropartner&small=${encodeURIComponent('For more info, visit')}&big=neropay.app/partners`);
  const { OUTRO_AT, DURATION, arrivals, scenes } = await film.evaluate(() => ({ OUTRO_AT, DURATION,
    arrivals: [...window.SFX_AT],
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
    cues.push({ sfx: ['click-soft', 'pop'][k++ % 2], t: +(t + 0.05).toFixed(3), gain: 0.06, why: 'a shop lights' }); }
  cues.push({ sfx: 'impact-bass-2', t: 29.96 + 0.1, gain: 0.12, why: 'the Active Partner badge lands' });
  /* scene changes land on the bed's beat, the nearest beat to the cut */
  const BEAT = 60 / 117.84;   /* partner-upbeat-118, measured 117.84 bpm */
  starts.forEach((t, i) => cues.push({ sfx: ['whoosh-short', 'whoosh'][i % 2], t: +(Math.round((t - 0.15) / BEAT) * BEAT).toFixed(3), gain: 0.06, why: 'scene change, on the beat' }));
  cues.push({ sfx: 'impact-bass-1', t: +(OUTRO_AT + 0.92).toFixed(3), gain: 0.2, why: 'the sting: the letters meet' });
  cues.push({ sfx: 'sparkle', t: +(OUTRO_AT + 2.05).toFixed(3), gain: 0.07, why: 'the line slides out under the tile' });
  cues.sort((a, b) => a.t - b.t);
  /* Faisal on v1 (25 Sep): "more dynamic range, it's too flat". The flatness was the chain: a peak limiter on the voice at
     -10.5 dBFS and then ~11.6 dB of limiting to reach -14 LUFS. Now a gentle compressor and no voice limiter, mastered to
     -16 LUFS with peaks to -1 dBTP (a normal web level), so the mix keeps her rises and falls. */
  const mix = { duration: DURATION, head: 0.6, vo: 'data/vo.mp3', target: -16, tp: -1.0,
    vo_filter: 'acompressor=threshold=-26dB:ratio=1.7:attack=12:release=160:makeup=1',
    bed: { file: 'video/library/bgm/partner-upbeat-118.mp3', t: 0, gain: 0.0072, loop_at: +(28 * 4 * 60 / 117.84).toFixed(3), fade: 3.0 }, cues };   /* the PP01 bed, as low as the NeroConnect v3.6.1 music; looped on bar 28, before its own fade at ~58 s */
  fs.mkdirSync(path.join(HERE, 'data'), { recursive: true });
  fs.writeFileSync(path.join(HERE, 'data/mix.json'), JSON.stringify(mix, null, 1));
  if (arg('--from') !== null || arg('--to') !== null) { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, 'f_%05d.jpg'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', path.join(OUT, 'slice.mp4')]); console.log(path.join(OUT, 'slice.mp4')); return; }
  execFileSync('node', [path.join(REPO, 'motion/mix.mjs'), 'partner/street'], { stdio: 'inherit' });
  const name = path.join(OUT, `partner-street-${SQ ? '1x1' : PREVIEW ? 'preview' : '16x9'}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, 'f_%05d.jpg'), '-i', path.join(OUT, 'mix.m4a'),
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', PREVIEW ? '21' : '16', '-preset', PREVIEW ? 'medium' : 'slow', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'copy', '-shortest', '-movflags', '+faststart', name]);
  console.log(name);
})();

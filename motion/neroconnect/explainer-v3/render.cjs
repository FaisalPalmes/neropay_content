// NeroConnect explainer v3 — render the film, splice in the locked outro, write the sound cues, mix, mux.
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
  const film = await mk(`http://127.0.0.1:${port}/motion/neroconnect/explainer-v3/index.html${SQ ? '?fmt=1x1' : ''}`);
  const outro = await mk(`http://127.0.0.1:${port}/brand/sting/outro.html?v=yellow&fmt=${SQ ? '1x1' : '16x9'}&mark=neroconnect&small=${encodeURIComponent('Check out NeroConnect at')}&big=docs.neropay.app`);
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
  /* scene changes land on the bed's beat (neroconnect-pulse-100: 99.85 bpm from 0), the nearest beat to the cut */
  const BEAT = 60 / 99.85;
  starts.forEach((t, i) => cues.push({ sfx: ['whoosh-short', 'whoosh'][i % 2], t: +(Math.round((t - 0.15) / BEAT) * BEAT).toFixed(3), gain: 0.06, why: 'scene change, on the beat' }));
  cues.push({ sfx: 'impact-bass-1', t: +(OUTRO_AT + 0.92).toFixed(3), gain: 0.2, why: 'the sting: the letters meet' });
  cues.push({ sfx: 'sparkle', t: +(OUTRO_AT + 2.05).toFixed(3), gain: 0.07, why: 'the line slides out under the tile' });
  cues.sort((a, b) => a.t - b.t);
  const mix = { duration: DURATION, head: 0.6, vo: 'data/vo.mp3', target: -14, tp: -3.0,
    vo_filter: 'acompressor=threshold=-24dB:ratio=2.5:attack=5:release=120:makeup=1,alimiter=limit=0.30:attack=1:release=60:level=false',   /* the v3.3 take is more dynamic (crest 20.7 dB): a compressor and a peak limiter on the voice */
    /* the bed, per Faisal on v3.5 (24 Sep): too loud and uneven. The track fades itself out from 95 s, and v3.5 looped it at
       103.35 s, so its own fade played mid-film and then it came back at full level; the ducking pumped between sentences.
       Now: looped at bar 39 (93.74 s, before its fade), one steady level with no ducking, faded only at the very end.
       25 Sep: Faisal on v3.6, "way too loud … 20% of the current": gain 0.18 -> 0.036, the voice untouched. */
    bed: { file: 'video/library/bgm/neroconnect-pulse-100.mp3', t: 0, gain: 0.036, loop_at: +(39 * 4 * 60 / 99.85).toFixed(3), fade: 3.0 }, cues };
  fs.mkdirSync(path.join(HERE, 'data'), { recursive: true });
  fs.writeFileSync(path.join(HERE, 'data/mix.json'), JSON.stringify(mix, null, 1));
  if (arg('--from') !== null || arg('--to') !== null) { execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, 'f_%05d.jpg'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '20', path.join(OUT, 'slice.mp4')]); console.log(path.join(OUT, 'slice.mp4')); return; }
  if (!SQ) {
    execFileSync('node', [path.join(REPO, 'motion/mix.mjs'), 'neroconnect/explainer-v3'], { stdio: 'inherit' });
    /* v3.6.1 (Faisal, 25 Sep): the music at 20% and the voice exactly where v3.6 had it. mix.mjs normalises the whole mix to
       -14 LUFS, which with the music gone pushed the voice up ~2.8 dB; so the raw mix gets v3.6's own master gain (+10.08 dB)
       and a true-peak limiter run at 4x (the AAC pass had put inter-sample peaks over 0 dBTP). Lands at about -15.6 LUFS. */
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', path.join(OUT, 'mix-raw.wav'), '-af',
      'volume=10.08dB,aresample=192000,alimiter=limit=0.79:attack=3:release=60:level=false,aresample=48000', '-c:a', 'aac', '-b:a', '192k', path.join(OUT, 'mix.m4a')]);
    fs.copyFileSync(path.join(OUT, 'mix.m4a'), path.join(OUT, 'mix-16x9.m4a'));
  }
  const name = path.join(OUT, `ncx-v3-${SQ ? '1x1' : PREVIEW ? 'preview' : '16x9'}.mp4`);
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(FR, 'f_%05d.jpg'), '-i', path.join(OUT, SQ ? 'mix-16x9.m4a' : 'mix.m4a'),
    '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-crf', PREVIEW ? '21' : '16', '-preset', PREVIEW ? 'medium' : 'slow', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'copy', '-shortest', '-movflags', '+faststart', name]);
  console.log(name);
})();

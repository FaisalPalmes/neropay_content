/* NeroConnect explainer — assemble the film from the scene overlays and the take.
 *
 *   node build.mjs [--preview] [--scenes 1,2,3]
 *
 * Reads data/scenes.json (scene, file, start, end — seconds on the film's timeline; the take sits at HEAD) and renders
 * every scene's frames by driving its setFrame(n) at 25 fps from its own frame 0 (empty) to its end plus the dissolve,
 * then joins the scenes with a 10-frame cross-dissolve (a hard cut into the close) and muxes the voice. --preview renders
 * at 1280×720 with the same timing so a review cut is a third of the work; the master is 1920×1080.
 * Frames land in out/frames/<scene>/ and the film in out/nc-explainer-16x9[-preview].mp4. Absolute paths throughout.
 */
import { chromium } from 'playwright';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const PREVIEW = args.includes('--preview');
const ONLY = args.includes('--scenes') ? args[args.indexOf('--scenes') + 1].split(',').map(Number) : null;
const JOIN = args.includes('--join');   /* join only: the frames were rendered by parallel runs with --scenes */
const FPS = 25, XF = 10;                       /* the dissolve, in frames */
const spec = JSON.parse(readFileSync(resolve(HERE, 'data/scenes.json'), 'utf8'));
const S = spec.scenes;
const W = PREVIEW ? 1280 : 1920, H = PREVIEW ? 720 : 1080, DSF = PREVIEW ? 1280 / 1920 : 1;
const OUT = resolve(HERE, 'out'); mkdirSync(OUT, { recursive: true });

const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const build = existsSync(resolve(root, 'chromium')) ? resolve(root, 'chromium') : resolve(root, readdirSync(root).filter(d => d.startsWith('chromium-')).sort().pop(), 'chrome-linux/chrome');
const browser = JOIN ? null : await chromium.launch({ executablePath: build, args: ['--allow-file-access-from-files'] });

const t0 = Date.now();
for (const sc of (JOIN ? [] : S)) {
  if (ONLY && !ONLY.includes(sc.scene)) continue;
  const frames = Math.round((sc.end - sc.start) * FPS) + (sc.last ? 0 : XF);
  const dir = resolve(OUT, 'frames' + (PREVIEW ? '-preview' : ''), sc.file.replace('.html', '')); rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const pg = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: DSF });
  await pg.goto(pathToFileURL(resolve(HERE, 'scenes', sc.file)).href); await pg.waitForTimeout(400);
  await pg.evaluate(() => document.fonts.ready);
  for (let f = 0; f < frames; f++) {
    await pg.evaluate(n => setFrame(n), f);
    await pg.screenshot({ path: `${dir}/f_${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: PREVIEW ? 88 : 96 });
  }
  await pg.close();
  console.log(`  scene ${sc.scene}  ${sc.file}  ${frames} frames  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
}
if (browser) await browser.close();
if (ONLY && !JOIN) process.exit(0);

/* join: each scene is a clip; xfade chains them with the dissolve inside the overlap the render added */
const inputs = [], filters = []; let prev = null, offset = 0;
S.forEach((sc, k) => {
  const dir = resolve(OUT, 'frames' + (PREVIEW ? '-preview' : ''), sc.file.replace('.html', ''));
  inputs.push('-framerate', String(FPS), '-i', `${dir}/f_%05d.jpg`);
  const n = readdirSync(dir).length;
  if (k === 0) { prev = '[0:v]'; offset = n / FPS - XF / FPS; return; }
  const out = k === S.length - 1 ? '[v]' : `[x${k}]`;
  const tr = sc.hardcut ? 'fade' : 'fade'; const dur = sc.hardcut ? 1 / FPS : XF / FPS;
  filters.push(`${prev}[${k}:v]xfade=transition=${tr}:duration=${dur.toFixed(3)}:offset=${offset.toFixed(3)}${out}`);
  prev = out; offset += n / FPS - XF / FPS;
});
const film = resolve(OUT, `nc-explainer-16x9${PREVIEW ? '-preview' : ''}.mp4`);
const vo = resolve(HERE, spec.vo || 'data/vo.mp3');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...inputs, '-i', vo, '-filter_complex', filters.join(';') + `;[${S.length}:a]adelay=${Math.round(spec.head * 1000)}|${Math.round(spec.head * 1000)},apad[a]`,
  '-map', '[v]', '-map', '[a]', '-c:v', 'libx264', '-crf', PREVIEW ? '22' : '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', film]);
console.log(film);

/* Generates index.html for the B1 master, v7 — the first edit built on MOTION-SYSTEM.md.

     node cut.mjs              → tightens every clip (assets/cut, data/cuts.json)
     node build.mjs            → writes index.html and review/manifest.json
     npx hyperframes check     → lint + layout + contrast
     npx hyperframes render -q draft | high

   What is different from b1-rate-you-were-quoted/build.mjs (v6), and why:

   - Three camera angles (MOTION-SYSTEM.md §1). data/angles.json names FRONT / SIDE / CLOSE per shot;
     sandbox.sh cuts each angle from the 4K source before anything else, so the clip on disk already
     IS the angle. SIDE puts Ava in the right third with the whiteboard wall to her left as negative
     space — every large overlay lives there. CLOSE never carries an overlay. A FRONT-to-FRONT cut is
     refused at build time.
   - Seven overlay archetypes (§2), nothing else: B kinetic label, C card fan, D glass spec table,
     E floating document, F arrow relation, G status pills. One accent colour, Inter caps, elements in
     the room with a soft shadow, nothing over the face.
   - The timing law (§3): BUILD → HOLD → EXIT, hold = max(1.5 s, words × 0.4), asserted by law() below.
     A graphic that grows on her words is checked twice — the whole graphic against the total time it
     is on screen, and the last thing to land against the time left after it — and the build refuses
     to write index.html if either fails. Where a take had the air, edit.json keeps more of its tail
     so the hold fits; nothing is stretched.
   - Real alpha (§4): panels are a flat translucent fill with a hairline, not glass sampled from the
     footage. No blurred copies, no Screen blend.
   - Sound effects sit 3 dB under v6 (SFX_GAIN) — Faisal's note on the last edit. The music beds are
     unchanged.
   - The title arrives from the middle of the frame: a small slab with EXPLAINED BY appears where she
     says it, then expands to fill the screen as she says the name, and the card builds from there.

   Everything the composition does is a pure function of timeline time (HyperFrames seeks every
   frame), so all motion is authored here as absolute fromTo tweens on one paused GSAP timeline.
   ../LESSONS.md and ../PLAYBOOK.md still apply where the spec is silent (captions, cuts, the outro). */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const W = 1920, H = 1080, FPS = 30, Y = '#F5C518', INK = '#141416';
const SFX_GAIN = 0.75;  // every effect 2.5 dB under the v6 mix (Faisal: "slightly lower"); the music beds are not effects
const WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'data/words.json'), 'utf8'));
const SCRIPT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/script.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/edit.json'), 'utf8'));
const ANGLES = JSON.parse(fs.readFileSync(path.join(HERE, 'data/angles.json'), 'utf8'));
const CUTS = fs.existsSync(path.join(HERE, 'data/cuts.json')) ? JSON.parse(fs.readFileSync(path.join(HERE, 'data/cuts.json'), 'utf8')) : null;
const SOUNDS = JSON.parse(fs.readFileSync(path.join(HERE, '../library/sounds.json'), 'utf8'));
const EMPH = ['effective', 'statement', 'fees', 'fee', 'flat', 'tiered', 'exit', 'term', 'rental', 'average', 'debit', 'credit', 'amex', 'own', 'renting', 'choose', 'cheapest', 'most', 'double', 'less', 'payout', 'calculator'];

const ffprobe = process.env.HYPERFRAMES_FFPROBE_PATH || 'ffprobe';
function dur(file) {
  const out = execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim();
  return Math.round(parseFloat(out) * 1000) / 1000;
}
const r3 = (n) => Math.round(n * 1000) / 1000;
const F = (n) => r3(n / FPS);                 // frames → seconds
const clean = (w) => String(w).toLowerCase().replace(/^[“"'(]+|[”"')\.,!?;:]+$/g, '');
const isNum = (w) => /\d|£|%/.test(w);
const isEmph = (w) => isNum(w) || EMPH.includes(clean(w));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const nWords = (s) => String(s).replace(/<[^>]+>/g, ' ').split(/\s+/).filter((w) => /[A-Za-z0-9£%]/.test(w)).length;

/* Spread the script across the clip when Whisper timings are missing (local placeholder builds). */
function estimateWords(text, d, lead = 0.35, tail = 0.3) {
  const tokens = String(text || '').split(/\s+/).filter(Boolean);
  const weight = (w) => w.replace(/[^\w£%.]/g, '').length + 1 + (/[.,!?;:]["”]?$/.test(w) ? 3 : 0);
  const total = tokens.reduce((a, w) => a + weight(w), 0), speak = Math.max(0.6, d - lead - tail);
  let cursor = lead;
  return tokens.map((w) => { const span = (speak * weight(w)) / total; const o = { w, s: r3(cursor), e: r3(cursor + span - 0.03) }; cursor += span; return o; });
}

/* ---------- the cut ---------- */
const ORDER = ['B1-01', 'B1-02', 'B1-INTRO', '[TITLE]', 'B1-03', 'B1-04', 'B1-05', 'B1-06', 'B1-07', 'B1-08', 'B1-09', 'B1-10', 'B1-11', 'B1-12', 'B1-13', 'B1-14', 'B1-15', 'B1-16', 'B1-17', 'B1-18', '[END]'];
const BEAT = 60 / SOUNDS.sounds.music.bpm, BAR2 = 2 * BEAT;     // the music grid the cards move on
const CARD = { '[TITLE]': r3(6 * BEAT), '[END]': 18.0 };
let t = 0;
const segs = [];
let estimated = [], cutUsed = 0;
for (const id of ORDER) {
  if (CARD[id]) { segs.push({ id, kind: 'card', start: r3(t), dur: CARD[id] }); t += CARD[id]; continue; }
  const cutFile = path.join(HERE, 'assets/cut', id + '.mp4');
  const useCut = CUTS && CUTS[id] && fs.existsSync(cutFile);
  const file = useCut ? cutFile : path.join(HERE, 'assets/clips', id + '.mp4');
  if (!fs.existsSync(file)) { console.log('skip ' + id + ' (no clip)'); continue; }
  let d, inn = 0, words;
  if (useCut) {
    d = dur(file); words = CUTS[id].words.filter((w) => w.s < d); cutUsed++;
  } else {
    const full = dur(file); inn = (EDIT[id] && EDIT[id].in) || 0; const out = (EDIT[id] && EDIT[id].out) || 0;
    d = r3(full - inn - out);
    let raw = WORDS[id];
    if (!raw || !raw.length) { raw = estimateWords(SCRIPT[id], full); estimated.push(id); }
    words = raw.map((w) => ({ w: w.w, s: r3(w.s - inn), e: r3(w.e - inn) })).filter((w) => w.e > 0 && w.s < d);
  }
  const angle = ANGLES[id];
  if (!angle) throw new Error('no angle for ' + id + ' in data/angles.json');
  segs.push({ id, kind: 'clip', start: r3(t), dur: d, mediaStart: inn, words, angle, src: (useCut ? 'assets/cut/' : 'assets/clips/') + id + '.mp4' });
  t += d;
}
const TOTAL = r3(t);
const S = Object.fromEntries(segs.map((s) => [s.id, s]));
const at = (id, local) => r3(S[id].start + local);
const endOf = (id) => r3(S[id].start + S[id].dur);
const base = (a) => String(a).replace(/\d$/, '');           // SIDE2 → SIDE
/* global start of the nth word whose cleaned text matches (or starts with) `text` */
const findWord = (id, text, nth = 0) => {
  let k = 0;
  for (const w of S[id].words) if (clean(w.w) === text || clean(w.w).startsWith(text)) { if (k++ === nth) return at(id, w.s); }
  throw new Error('no word "' + text + '" in ' + id + ': ' + S[id].words.map((w) => w.w).join(' '));
};
/* §1 step 5: a cut between two shots on the identical framing is a jump cut — refuse it */
{
  const clips = segs.filter((s) => s.kind === 'clip');
  for (let i = 1; i < clips.length; i++) {
    const p = clips[i - 1], q = clips[i];
    if (S[ORDER[ORDER.indexOf(q.id) - 1]] && S[ORDER[ORDER.indexOf(q.id) - 1]].kind === 'card') continue;   // a card sits between them
    if (p.angle === q.angle) throw new Error(`angles: ${p.id} → ${q.id} are both ${p.angle} — move one to the other variant or to CLOSE (MOTION-SYSTEM.md §1, step 5)`);
  }
}

/* ---------- the timing law (§3) ----------
   Every overlay registers here. build = first frame it exists → fully formed (≤ 20 frames and ≤ 25 %
   of its life). hold = fully formed → the exit starts (or the cut). exit = 6–8 frames, or none under
   a cut. hold must be ≥ max(1.5 s, words × 0.4). A graphic that lands piece by piece on her words is
   checked as a whole against its total time on screen, and its last piece against what is left after
   it. The build throws rather than quietly compressing anything. */
const LAW = [], LAWFAIL = [];
function law(id, { archetype, shot, start, formed, end, cut = false, words, last, stage = false }) {
  const EXIT = cut ? 0 : F(7);
  const lastFormed = last ? last.formed : formed, lastWords = last ? last.words : words;
  const life = r3(end - start), build = r3(formed - start);
  const holdAll = r3(end - EXIT - formed), holdLast = r3(end - EXIT - lastFormed);
  const needAll = r3(Math.max(1.5, words * 0.4)), needLast = r3(Math.max(1.5, lastWords * 0.4));
  const fails = [];
  if (!stage && build > F(20) + 0.001) fails.push(`build ${build}s > 20 frames`);
  if (!stage && build > life * 0.25 + 0.001 && build > F(8)) fails.push(`build ${build}s > 25% of ${life}s`);
  if (last) { if (r3(end - start) < needAll) fails.push(`on screen ${r3(end - start)}s < ${needAll}s for ${words} words`); if (holdLast < needLast - 0.001) fails.push(`final hold ${holdLast}s < ${needLast}s for the last ${lastWords} words`); }
  else if (holdAll < needAll - 0.001) fails.push(`hold ${holdAll}s < ${needAll}s for ${words} words`);
  if (fails.length) LAWFAIL.push(`${id} (${archetype}, ${shot}): ${fails.join('; ')}`);
  LAW.push({ id, archetype, shot, start, formed, end, cut, words, build_f: Math.round(build * FPS), hold_f: Math.round((last ? holdLast : holdAll) * FPS), exit_f: cut ? 0 : 7, held_frame_at: r3(end - EXIT - 0.05) });
}

/* ---------- captions: phrases of up to five words, no orphan at the end ---------- */
function phrases(words) {
  const out = []; let cur = [];
  words.forEach((w, i) => {
    cur.push(w);
    const end = /[.!?]["”]?$/.test(w.w) || (/[,;:]["”]?$/.test(w.w) && cur.length >= 3) || cur.length >= 5;
    if (end || i === words.length - 1) { out.push(cur); cur = []; }
  });
  for (let i = out.length - 1; i > 0; i--) if (out[i].length === 1 && out[i - 1].length <= 5) { out[i - 1] = out[i - 1].concat(out[i]); out.splice(i, 1); }
  return out;
}

/* ---------- html pieces ---------- */
const html = [], js = [], audio = [], stages = [];
let wordIndex = 0;
const WORDLIST = [];

/* ---------- primitives ---------- */
const show = (sel, when) => js.push(`tl.set("${sel}", { autoAlpha: 1 }, ${r3(when)});`);
const kill = (sel, when) => js.push(`tl.set("${sel}", { autoAlpha: 0 }, ${r3(when)});`);
/* B build: mask on left to right, 8 frames, no fade, no slide */
function maskOn(sel, when, frames = 8) {
  show(sel, when);
  js.push(`tl.fromTo("${sel}", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: ${F(frames)}, ease: "none", immediateRender: false }, ${r3(when)});`);
}
/* the one exit: 7 frames, then a hard kill on the same selector */
function fadeOut(sel, when, frames = 7) {
  js.push(`tl.fromTo("${sel}", { autoAlpha: 1 }, { autoAlpha: 0, duration: ${F(frames)}, ease: "power1.in", immediateRender: false }, ${r3(when)});`);
  kill(sel, r3(when + F(frames) + 0.001));
}
/* D build: the panel scales up from 0.96 with its fill fading in, 10 frames */
function panelIn(sel, when) {
  show(sel, when);
  js.push(`tl.fromTo("${sel}", { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: ${F(10)}, ease: "power2.out", immediateRender: false }, ${r3(when)});`);
}
/* a D row: its divider draws (4 frames) before its text (4 frames) */
function rowIn(sel, when) {
  show(sel, when);
  js.push(`tl.fromTo("${sel} .hl", { scaleX: 0 }, { scaleX: 1, duration: ${F(4)}, ease: "none", immediateRender: false }, ${r3(when)});`);
  js.push(`tl.fromTo("${sel} .k, ${sel} .v", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${F(4)}, ease: "none", immediateRender: false }, ${r3(when + F(4))});`);
}
/* a figure counting to its value as she says it — inside the row's build, 12 frames */
let cu = 0;
function countUp(sel, to, when, { from = 0, dur: d = F(12), prefix = '', suffix = '', dp = 0, sep = true } = {}) {
  const v = 'cu' + (cu++);
  js.push(`const ${v} = { n: ${from} }, ${v}el = document.querySelector("${sel}");
  const ${v}f = () => { const n = ${v}.n; const s = n.toFixed(${dp}); ${v}el.textContent = "${prefix}" + (${sep} ? s.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : s) + "${suffix}"; };
  ${v}f();
  tl.fromTo(${v}, { n: ${from} }, { n: ${to}, duration: ${d}, ease: "power2.out", onUpdate: ${v}f, immediateRender: false }, ${r3(when)});`);
}
/* Sound: every file comes from video/library (sounds.json, CC0 from Freesound, normalised to -3 dBFS
   by fetch-sounds.mjs) and sits in assets/sfx as <role>.m4a. Volumes are the v6 mix × SFX_GAIN. */
const SFXDUR = {}; let sfxN = 0;
function sfx(role, start, vol, { bed = false, maxLen } = {}) {
  const file = path.join(HERE, 'assets/sfx', role + '.m4a');
  if (!fs.existsSync(file)) throw new Error('missing sound ' + role + ' — run ../library/fetch-sounds.mjs --into assets/sfx');
  if (!SFXDUR[role]) SFXDUR[role] = dur(file);
  const d = maxLen ? Math.min(SFXDUR[role], maxLen) : SFXDUR[role];
  const s = Math.max(0, r3(start));
  const v = r3(bed ? vol : vol * SFX_GAIN);
  audio.push(`<audio id="sfx-${role}-${Math.round(s * 100)}" src="assets/sfx/${role}.m4a" data-start="${s}" data-duration="${r3(Math.min(d, TOTAL - s))}" data-track-index="${12 + (sfxN++)}" data-volume="${v}"></audio>`);
}

/* ---------- camera ----------
   One world wrapper: screen = S·offset + T, translation clamped to what the scale covers. With the angle
   already cut into each clip the camera only breathes — a slow push or pull of a few percent per shot,
   alternating, so a graphic in the room moves with the room and nothing else moves. */
const cam = [];
const clampCam = (c) => {
  const mx = (c.scale - 1) * W / 2, my = (c.scale - 1) * H / 2;
  return { scale: c.scale, x: r3(Math.max(-mx, Math.min(mx, c.x))), y: r3(Math.max(-my, Math.min(my, c.y))) };
};
function move(t0, t1, from, to, ease = 'power1.inOut') { if (t1 - t0 < 0.05) return; cam.push({ t0: r3(t0), t1: r3(t1), from: clampCam(from), to: clampCam(to), ease }); }
const flat = (S_, x = 0, y = 0) => ({ scale: S_, x, y });

/* ---------- video, audio, captions for every clip ---------- */
let dirn = 1;
for (const s of segs) {
  if (s.kind !== 'clip') continue;
  html.push(`<video id="v-${s.id}" class="clip" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="0" muted playsinline></video>`);
  audio.push(`<audio id="a-${s.id}" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="10" data-volume="1"></audio>`);
  /* the breath: FRONT and SIDE ±3 %, CLOSE ±5 %, alternating direction shot to shot */
  const amt = base(s.angle) === 'CLOSE' ? 0.05 : 0.03;
  const a = s.id === 'B1-INTRO' ? 1.0 : 1.0 + (dirn > 0 ? 0 : amt), b = s.id === 'B1-INTRO' ? 1.0 : 1.0 + (dirn > 0 ? amt : 0);
  if (s.id !== 'B1-INTRO') { move(s.start, endOf(s.id), flat(a), flat(b), 'none'); dirn = -dirn; }
  const groups = phrases(s.words);
  groups.forEach((p, gi) => {
    const ps = r3(s.start + p[0].s);
    const next = groups[gi + 1] ? r3(s.start + groups[gi + 1][0].s) : Infinity;
    const pe = Math.min(r3(s.start + p[p.length - 1].e + 0.35), next, endOf(s.id));
    const pd = r3(pe - ps);
    if (pd <= 0.05) return;
    const spans = p.map((w) => {
      WORDLIST.push([r3(s.start + w.s), r3(s.start + w.e)]);
      return `<span class="w${isEmph(w.w) ? ' em' : ''}" data-i="${wordIndex++}">${esc(w.w)}</span>`;
    }).join(' ');
    html.push(`<div id="cap-${s.id}-${Math.round(p[0].s * 100)}" class="clip cap" data-start="${ps}" data-duration="${pd}" data-track-index="6"><div class="line">${spans}</div></div>`);
  });
}

/* ---------- layout constants, measured on the real frames ----------
   FRONT: Ava centred (hair 795–1155, head top ≈300, shoulders ≈705). Small type sits right of her at eye
   height (x ≥ 1250) or in the band above her head (y 196–256). SIDE: Ava in the right third (face at
   x ≈ 1460, her near shoulder at x ≈ 1000); the column x 80–960 is clean negative space over the
   whiteboard wall. CLOSE: no overlay, ever. */
const SIDE = { x: 80, w: 880 };
const RIGHT = { x: 1250, w: 620 };
const BAND = { y: 196 };

/* ---------- 1 · hook — B1-01 (FRONT): the name plate, then B "QUOTED 0.5%", struck through ---------- */
{
  const s = S['B1-01'], a = s.start, b = endOf('B1-01');
  html.push(`<div id="plate" class="ov plate" style="left:72px;top:72px"><i></i><div><b>Ava</b><span>NeroPay</span></div></div>`);
  maskOn('#plate', a + 0.25); fadeOut('#plate', a + 3.2);
  law('plate', { archetype: 'B', shot: 'B1-01', start: a + 0.25, formed: a + 0.25 + F(8), end: a + 3.2, words: 2 });
  const tMaybe = findWord('B1-01', 'maybe'), tNot = findWord('B1-01', 'not');
  html.push(`<div id="quoted" class="ov lbl" style="left:${RIGHT.x}px;top:372px"><b>Quoted 0.5%</b><i class="strike"></i></div>`);
  maskOn('#quoted', tMaybe); sfx('swish', tMaybe, 0.14);
  /* "not paying that": the label greys and a line goes through it — the same graphic, marked, not a second one */
  js.push(`tl.fromTo("#quoted b", { color: "${Y}" }, { color: "rgba(255,255,255,0.45)", duration: ${F(6)}, ease: "none", immediateRender: false }, ${tNot});`);
  js.push(`tl.fromTo("#quoted .strike", { scaleX: 0 }, { scaleX: 1, duration: ${F(6)}, ease: "power2.out", immediateRender: false }, ${tNot});`);
  sfx('swish', tNot, 0.14);
  kill('#quoted', b);
  law('quoted', { archetype: 'B', shot: 'B1-01', start: tMaybe, formed: tMaybe + F(8), end: b, cut: true, words: 2, last: { formed: tNot + F(6), words: 0 } });
}

/* ---------- 2 · nobody lied — B1-02 (CLOSE): nothing on screen ---------- */

/* ---------- 3 · the title, from the middle of the frame — B1-INTRO (FRONT) + [TITLE] ----------
   A small charcoal slab appears at the centre as she says "Explained", masking EXPLAINED BY on. On
   "NeroPay" it expands to fill the frame; the kicker rises to its slot, the wordmark masks on, the
   episode line lands word by word, a yellow arc draws and keeps turning slowly under the hold. Hard
   cut out on the beat. */
{
  const tExpl = findWord('B1-INTRO', 'explained'), tNero = findWord('B1-INTRO', 'neropay');
  const seedAt = r3(tExpl - 0.05), expandAt = tNero, EXP = F(22), landAt = r3(expandAt + EXP);
  const tEnd = endOf('[TITLE]');
  const ep = 'The rate you were quoted';
  stages.push(`<div id="title" class="clip stage" data-start="${seedAt}" data-duration="${r3(tEnd - seedAt)}" data-track-index="4">
    <div class="bgd"><div class="grid"></div><svg class="arc" viewBox="0 0 1920 1080"><circle class="ring" cx="1500" cy="1180" r="760"/><circle class="sweep" cx="1500" cy="1180" r="760"/></svg></div>
    <div class="kick"><b>Explained by</b></div>
    <div class="wm"><b>Nero</b><em>Pay</em></div>
    <div class="ep">${ep.split(' ').map((w) => `<span class="ew">${esc(w)}</span>`).join(' ')}</div>
  </div>`);
  const SEED = 'inset(44.5% 38% 44.5% 38% round 26px)', FULL = 'inset(0% 0% 0% 0% round 0px)';
  js.push(`tl.set("#title", { autoAlpha: 1, clipPath: "${SEED}" }, ${seedAt});`);
  maskOn('#title .kick', seedAt + 0.05); sfx('tick', seedAt + 0.05, 0.18);
  js.push(`tl.fromTo("#title", { clipPath: "${SEED}" }, { clipPath: "${FULL}", duration: ${EXP}, ease: "power3.inOut", immediateRender: false }, ${expandAt});`);
  js.push(`tl.fromTo("#title .kick", { y: 0 }, { y: -280, duration: ${F(14)}, ease: "power3.out", immediateRender: false }, ${r3(landAt - F(4))});`);
  maskOn('#title .wm', landAt, 14); sfx('impact', landAt, 0.28);
  ep.split(' ').forEach((_, i) => js.push(`tl.fromTo("#title .ep .ew:nth-child(${i + 1})", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: ${F(8)}, ease: "power3.out", immediateRender: false }, ${r3(landAt + 0.45 + i * F(3))});`));
  js.push(`tl.fromTo("#title .sweep", { strokeDashoffset: 4776 }, { strokeDashoffset: 2900, duration: 2.4, ease: "power2.out", immediateRender: false }, ${r3(landAt - 0.2)});`);
  js.push(`tl.fromTo("#title .arc", { rotation: 0 }, { rotation: 16, duration: ${r3(tEnd - landAt + 0.2)}, ease: "sine.inOut", immediateRender: false }, ${r3(landAt - 0.2)});`);
  js.push(`tl.fromTo("#title .grid", { x: 0, y: 0 }, { x: -48, y: -30, duration: ${r3(tEnd - seedAt)}, ease: "none", immediateRender: false }, ${seedAt});`);
  kill('#title', tEnd);
  sfx('riser', r3(landAt - SOUNDS.sounds.riser.duration), 0.26);
  sfx('music-intro', expandAt, 0.34, { bed: true });
  law('title', { archetype: 'TITLE', shot: 'B1-INTRO→[TITLE]', start: seedAt, formed: r3(landAt + 0.45 + 4 * F(3) + F(8)), end: tEnd, cut: true, words: 2 + 1 + nWords(ep), stage: true });
}

/* ---------- 4 · the card ladder — B1-03 + B1-04 (SIDE): C, five cards on an arc, each on its word ----------
   Cheapest on the left. The debit card lands on "nought point five" with its rate, and gets its name
   on "debit"; the other four arrive as she names them in B1-04. Held until the cut. */
{
  const a3 = S['B1-03'].start, b4 = endOf('B1-04');
  const tRate = findWord('B1-03', 'nought'), tDebit = findWord('B1-03', 'debit');
  const tCredit = at('B1-04', 0.15), tCompany = findWord('B1-04', 'company'), tAmex = findWord('B1-04', 'amex'), tOver = findWord('B1-04', 'overseas');
  const cards = [['Debit', '0.50%', tRate, tDebit], ['Credit', '1.20%', tCredit], ['Amex', '1.75%', tAmex], ['Business', '2.60%', tCompany], ['Overseas', '2.90%', tOver]];
  const cx = [200, 370, 540, 710, 880], cy = [388, 322, 300, 322, 388], rot = [-10, -5, 0, 5, 10];
  html.push(`<div id="fan" class="ov fan">${cards.map(([n, r], i) => `<div class="cardw k${i}" style="left:${cx[i] - 84}px;top:${cy[i]}px;transform:rotate(${rot[i]}deg)"><div class="cardf"><b>${r}</b><small>from</small></div><em class="cname">${n}</em></div>`).join('')}</div>`);
  show('#fan', tRate);
  cards.forEach(([, , when, nameAt], i) => {
    show(`#fan .k${i}`, when);
    js.push(`tl.fromTo("#fan .k${i} .cardf", { autoAlpha: 0, scale: 0.9, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: ${F(10)}, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
    js.push(`tl.fromTo("#fan .k${i} .cname", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${F(5)}, ease: "none", immediateRender: false }, ${r3((nameAt || when) + F(6))});`);
    sfx('pop', when, 0.15);
  });
  kill('#fan', b4);
  law('fan', { archetype: 'C', shot: 'B1-03→B1-04', start: tRate, formed: tRate + F(10), end: b4, cut: true, words: 10, last: { formed: tOver + F(11), words: 2 } });
}

/* ---------- 5 · you don't choose — B1-05 (CLOSE): nothing on screen ---------- */

/* ---------- 6 · the statement — B1-06 … B1-09 (SIDE): E, a specimen statement in the room beside her ----------
   A sheet of paper on a tilted card. It arrives on "made-up month" with its header; every line prints
   as she reads it; a yellow marker goes over the advertised rate and, at the end, over the payout line.
   Figures are the pack's (generation-pack.md, overlays.js OV-2 and OV-3) and reconcile to £308.46. */
{
  const a6 = S['B1-06'].start, b9 = endOf('B1-09');
  const tMade = findWord('B1-06', 'made'), tTwenty = findWord('B1-06', 'twenty'), tSeven = findWord('B1-06', 'seven'), tNought = findWord('B1-06', 'nought');
  const tDebit = findWord('B1-07', 'debit'), tCred = findWord('B1-07', 'credit'), tComp = findWord('B1-07', 'company'), tAnd = findWord('B1-07', 'and'), tOver = findWord('B1-07', 'overseas'), tNine = findWord('B1-07', 'nine');
  const tFour = findWord('B1-08', 'four'), tSeventeen = findWord('B1-08', 'seventeen'), tPci = findWord('B1-08', 'pci');
  const tAccount = findWord('B1-09', 'account'), tPayout = findWord('B1-09', 'payout');
  const cardRows = [['Consumer debit', '601', '£20,164.00', '0.50%', '£100.82', tDebit], ['Consumer credit', '118', '£5,590.00', '1.20%', '£67.08', tCred], ['Business / commercial', '31', '£1,420.00', '2.60%', '£36.92', tComp], ['American Express', '14', '£658.00', '1.75%', '£11.52', tAnd], ['International / non-UK', '16', '£568.00', '2.90%', '£16.47', tOver]];
  const feeRows = [['Authorisation fees', '780 at 4p', '£31.20', tFour], ['Terminal rental', 'monthly', '£17.50', tSeventeen], ['PCI DSS compliance fee', 'monthly', '£9.95', tPci], ['Account / statement fee', 'monthly', '£5.00', tAccount], ['Payout fee — to your bank', '4 at £3.00', '£12.00', tPayout]];
  html.push(`<div id="doc" class="ov doc" style="left:${SIDE.x + 10}px;top:104px;width:${SIDE.w - 20}px;height:760px"><div class="tilt"><div class="paper">
    <div class="dh"><b>Northwick Payment Services</b><span>Card processing statement · August</span><em>Illustrative — not a real statement</em></div>
    <div class="dl s0"><span>Card turnover</span><b>£0.00</b></div>
    <div class="dl s1"><span>Transactions</span><b>0</b></div>
    <div class="dl s2"><i class="mk"></i><span>Rate advertised</span><b>from 0.50%</b></div>
    <div class="dt">
      <div class="dr dhd"><span>Card type</span><span>Txns</span><span>Value</span><span>Rate</span><span>Charge</span></div>
      ${cardRows.map((r, i) => `<div class="dr c${i}"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span><span>${r[4]}</span></div>`).join('')}
      <div class="dr dsub"><span>Card charges</span><span></span><span>£28,400.00</span><span></span><span>£232.81</span></div>
      ${feeRows.map((r, i) => `<div class="dr fee f${i}"><i class="mk"></i><span class="lab">${r[0]}</span><span class="how">${r[1]}</span><span class="amt">${r[2]}</span></div>`).join('')}
    </div>
  </div></div></div>`);
  /* E build: the card arrives from further away and turns the last degrees into place, 14 frames, then
     an almost imperceptible drift for the rest of the hold */
  show('#doc', tMade);
  js.push(`tl.fromTo("#doc .tilt", { autoAlpha: 0, z: -260, rotationY: -24, x: -40 }, { autoAlpha: 1, z: 0, rotationY: -10, x: 0, duration: ${F(14)}, ease: "power4.out", immediateRender: false }, ${tMade});`);
  js.push(`tl.fromTo("#doc .tilt", { rotationY: -10, y: 0 }, { rotationY: -8.5, y: -6, duration: ${r3(b9 - tMade - F(14))}, ease: "sine.inOut", immediateRender: false }, ${r3(tMade + F(14))});`);
  sfx('whoosh', tMade - 0.05, 0.14);
  const line = (sel, when) => { js.push(`tl.fromTo("${sel}", { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: ${F(6)}, ease: "power2.out", immediateRender: false }, ${r3(when)});`); sfx('tick', when, 0.18); };
  line('#doc .s0', tTwenty); countUp('#doc .s0 b', 28400, tTwenty, { prefix: '£', suffix: '.00' });
  line('#doc .s1', tSeven); countUp('#doc .s1 b', 780, tSeven);
  line('#doc .s2', tNought); js.push(`tl.fromTo("#doc .s2 .mk", { scaleX: 0 }, { scaleX: 1, duration: ${F(8)}, ease: "power2.out", immediateRender: false }, ${r3(tNought + F(4))});`);
  line('#doc .dhd', tDebit - 0.3);
  cardRows.forEach((r, i) => line(`#doc .c${i}`, r[5]));
  line('#doc .dsub', tNine);
  feeRows.forEach((r, i) => line(`#doc .f${i}`, r[3]));
  js.push(`tl.fromTo("#doc .f4 .mk", { scaleX: 0 }, { scaleX: 1, duration: ${F(8)}, ease: "power2.out", immediateRender: false }, ${r3(tPayout + F(6))});`);
  kill('#doc', b9);
  const wordsOnDoc = 3 + 5 + 4 + 4 + 5 * 5 + 4 + 5 * 3 + 6;
  law('doc', { archetype: 'E', shot: 'B1-06→B1-09', start: tMade, formed: tMade + F(14), end: b9, cut: true, words: wordsOnDoc, last: { formed: tPayout + F(14), words: 5 } });
}

/* ---------- 7 · the formula — B1-10 (FRONT): F, in the band above her head ----------
   ALL CHARGES masks on at "add up", ÷ CARD TURNOVER at "divide", and on "multiply" the line draws with
   × 100 over it, the head lands and THE RATE YOU PAY masks on. Held to the cut. */
{
  const a = S['B1-10'].start, b = endOf('B1-10');
  const tAdd = findWord('B1-10', 'add'), tDivide = findWord('B1-10', 'divide'), tMult = findWord('B1-10', 'multiply');
  html.push(`<div id="formula" class="ov rel" style="left:180px;top:${BAND.y}px;width:1560px"><span class="t1"><b class="ta">All charges</b><b class="tb">&nbsp;÷ card turnover</b></span><span class="ln"><i class="shaft"></i><i class="head"></i><em class="tag">× 100</em></span><span class="t2"><b>The rate you pay</b></span></div>`);
  show('#formula', tAdd);
  maskOn('#formula .ta', tAdd); sfx('swish', tAdd, 0.14);
  maskOn('#formula .tb', tDivide); sfx('swish', tDivide, 0.14);
  show('#formula .ln', tMult);
  js.push(`tl.fromTo("#formula .shaft", { scaleX: 0 }, { scaleX: 1, duration: ${F(12)}, ease: "power2.inOut", immediateRender: false }, ${tMult});`);
  js.push(`tl.fromTo("#formula .head", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: ${F(5)}, ease: "back.out(2.5)", immediateRender: false }, ${r3(tMult + F(10))});`);
  js.push(`tl.fromTo("#formula .tag", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: ${F(6)}, ease: "power2.out", immediateRender: false }, ${r3(tMult + F(4))});`);
  maskOn('#formula .t2 b', tMult + F(10)); sfx('pop', tMult + F(10), 0.15);
  kill('#formula', b);
  law('formula', { archetype: 'F', shot: 'B1-10', start: tAdd, formed: tAdd + F(8), end: b, cut: true, words: 9, last: { formed: tMult + F(18), words: 5 } });
}

/* ---------- 8 · what that month really cost — B1-11 (SIDE): D, three rows, the rate in yellow ---------- */
{
  const a = S['B1-11'].start, b = endOf('B1-11');
  const tCharges = findWord('B1-11', 'charges'), tThree = findWord('B1-11', 'three'), tTwenty = findWord('B1-11', 'twenty'), tOne = findWord('B1-11', 'one');
  html.push(`<div id="cost" class="ov panel" style="left:${SIDE.x}px;top:150px;width:${SIDE.w}px;height:410px"><div class="tilt"><div class="slab">
    <div class="ph">What that month really cost</div>
    <div class="row r0"><i class="hl"></i><span class="k">All charges</span><span class="v">£0.00</span></div>
    <div class="row r1"><i class="hl"></i><span class="k">Card turnover</span><span class="v">£0</span></div>
    <div class="row r2 y"><i class="hl"></i><span class="k">Effective rate</span><span class="v">0.00%</span></div>
    <div class="pf">Illustrative example, not a real statement</div>
  </div></div></div>`);
  panelIn('#cost', tCharges); sfx('whoosh', tCharges - 0.05, 0.14);
  rowIn('#cost .r0', tThree); countUp('#cost .r0 .v', 308.46, tThree + F(4), { prefix: '£', dp: 2 }); sfx('tick', tThree, 0.18);
  rowIn('#cost .r1', tTwenty); countUp('#cost .r1 .v', 28400, tTwenty + F(4), { prefix: '£' }); sfx('tick', tTwenty, 0.18);
  rowIn('#cost .r2', tOne); countUp('#cost .r2 .v', 1.09, tOne + F(4), { suffix: '%', dp: 2, sep: false }); sfx('chime', tOne, 0.2);
  kill('#cost', b);
  law('cost', { archetype: 'D', shot: 'B1-11', start: tCharges, formed: tCharges + F(10), end: b, cut: true, words: 12, last: { formed: tOne + F(16), words: 3 } });
}

/* ---------- 9 · quoted against paid — B1-12 (FRONT): F, the headline as a relation above her head ---------- */
{
  const a = S['B1-12'].start, b = endOf('B1-12');
  const tQuoted = findWord('B1-12', 'quoted'), tActually = findWord('B1-12', 'actually'), tMore = findWord('B1-12', 'more');
  html.push(`<div id="paid" class="ov rel" style="left:420px;top:${BAND.y}px;width:1080px"><span class="t1"><b class="ta">Quoted 0.50%</b></span><span class="ln"><i class="shaft"></i><i class="head"></i></span><span class="t2"><b>Paying 1.09%</b></span></div>`);
  show('#paid', tQuoted);
  maskOn('#paid .ta', tQuoted); sfx('swish', tQuoted, 0.14);
  show('#paid .ln', tActually);
  js.push(`tl.fromTo("#paid .shaft", { scaleX: 0 }, { scaleX: 1, duration: ${F(12)}, ease: "power2.inOut", immediateRender: false }, ${tActually});`);
  js.push(`tl.fromTo("#paid .head", { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: ${F(5)}, ease: "back.out(2.5)", immediateRender: false }, ${r3(tActually + F(10))});`);
  maskOn('#paid .t2 b', tMore); sfx('pop', tMore, 0.16);
  kill('#paid', b);
  law('paid', { archetype: 'F', shot: 'B1-12', start: tQuoted, formed: tQuoted + F(8), end: b, cut: true, words: 4, last: { formed: tMore + F(8), words: 2 } });
}

/* ---------- 10 · the bit worth knowing — B1-13 (CLOSE): nothing on screen ---------- */

/* ---------- 11 · the same month, two ways — B1-14 (SIDE) into B1-15: D, held across the cut ----------
   The take ends 0.3 s after "less", so the panel stays through the first beats of B1-15 (the same
   angle) and folds away before the next panel arrives. */
{
  const tHundred = findWord('B1-14', 'hundred'), tThree = findWord('B1-14', 'three'), tLess = findWord('B1-14', 'less');
  const tAsk = findWord('B1-15', 'ask');
  const end = r3(tAsk - 0.35);
  html.push(`<div id="ways" class="ov panel" style="left:${SIDE.x}px;top:150px;width:${SIDE.w}px;height:430px"><div class="tilt"><div class="slab">
    <div class="ph">The same month, two ways</div>
    <div class="row r0"><i class="hl"></i><span class="k">0.70% flat, no fees</span><span class="v">£0.00</span></div>
    <div class="row r1"><i class="hl"></i><span class="k">Quoted 0.50%, plus fees</span><span class="v">£0.00</span></div>
    <div class="row r2 y"><i class="hl"></i><span class="k">A month less</span><span class="v">£0.00</span></div>
    <div class="pf">Illustrative figures</div>
  </div></div></div>`);
  panelIn('#ways', tHundred - 0.3); sfx('whoosh', tHundred - 0.35, 0.14);
  rowIn('#ways .r0', tHundred); countUp('#ways .r0 .v', 198.81, tHundred + F(4), { prefix: '£', dp: 2 }); sfx('tick', tHundred, 0.18);
  rowIn('#ways .r1', tThree); countUp('#ways .r1 .v', 308.46, tThree + F(4), { prefix: '£', dp: 2 }); sfx('tick', tThree, 0.18);
  rowIn('#ways .r2', tLess); countUp('#ways .r2 .v', 109.65, tLess + F(4), { prefix: '£', dp: 2 }); sfx('chime', tLess, 0.2);
  fadeOut('#ways', end);
  law('ways', { archetype: 'D', shot: 'B1-14→B1-15', start: tHundred - 0.3, formed: tHundred - 0.3 + F(10), end: end + F(7), words: 15, last: { formed: tLess + F(16), words: 4 } });
}

/* ---------- 12 · ask any provider — B1-15 + B1-16 (SIDE): D, eight questions, the last one in yellow ---------- */
{
  const b16 = endOf('B1-16');
  const tAsk = findWord('B1-15', 'ask'), tCredit = findWord('B1-15', 'credit'), tCompany = findWord('B1-15', 'company'), tAmex = findWord('B1-15', 'amex'), tPayout = findWord('B1-15', 'payout');
  const tPci = findWord('B1-16', 'pci'), tAccount = findWord('B1-16', 'account'), tMinimum = findWord('B1-16', 'minimum'), tEffective = findWord('B1-16', 'effective');
  const qs = [['What do credit cards cost?', tCredit], ['And business cards?', tCompany], ['And American Express?', tAmex], ['What does each payout cost?', tPayout], ['Is there a PCI fee?', tPci], ['An account fee?', tAccount], ['A minimum monthly charge?', tMinimum], ['What is my effective rate?', tEffective]];
  html.push(`<div id="ask" class="ov panel" style="left:${SIDE.x}px;top:110px;width:${SIDE.w}px;height:420px"><div class="tilt"><div class="slab">
    <div class="ph">Ask any provider</div>
    ${qs.map(([q], i) => `<div class="row q${i}${i === 7 ? ' y' : ''}"><i class="hl"></i><span class="k">${esc(q)}</span><span class="v n">0${i + 1}</span></div>`).join('')}
  </div></div></div>`);
  panelIn('#ask', tAsk); sfx('whoosh', tAsk - 0.05, 0.14);
  js.push(`tl.set("#ask", { height: 732 }, ${S['B1-16'].start});`);   // grows under the cut, where a jump is invisible
  qs.forEach(([, when], i) => { rowIn(`#ask .q${i}`, when); sfx('tick', when, 0.18); });
  sfx('chime', tEffective, 0.18);
  kill('#ask', b16);
  law('ask', { archetype: 'D', shot: 'B1-15→B1-16', start: tAsk, formed: tAsk + F(10), end: b16, cut: true, words: qs.reduce((n, [q]) => n + nWords(q), 3), last: { formed: tEffective + F(8), words: 5 } });
}

/* ---------- 13 · two minutes with a statement — B1-17 (FRONT): G, do this / not that, right of her ---------- */
{
  const b = endOf('B1-17');
  const tStatement = findWord('B1-17', 'statement'), tCalc = findWord('B1-17', 'calculator'), tAdvert = findWord('B1-17', 'advert');
  const pills = [['ok', 'Last month’s statement', tStatement], ['ok', 'A calculator', tCalc], ['no', 'Any advert', tAdvert]];
  html.push(`<div id="two" class="ov pills" style="left:${RIGHT.x}px;top:330px">${pills.map(([k, s], i) => `<div class="pill p${i} ${k}"><i class="badge"></i><span>${esc(s)}</span></div>`).join('')}</div>`);
  show('#two', tStatement);
  pills.forEach(([, , when], i) => {
    show(`#two .p${i}`, when);
    js.push(`tl.fromTo("#two .p${i} .badge", { scale: 0 }, { scale: 1, duration: ${F(5)}, ease: "back.out(3)", immediateRender: false }, ${r3(when)});`);
    js.push(`tl.fromTo("#two .p${i} span", { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: ${F(8)}, ease: "power2.out", immediateRender: false }, ${r3(when + F(3))});`);
    sfx('pop', when, 0.15);
  });
  kill('#two', b);
  law('two', { archetype: 'G', shot: 'B1-17', start: tStatement, formed: tStatement + F(11), end: b, cut: true, words: 7, last: { formed: tAdvert + F(11), words: 2 } });
}

/* ---------- 14 · sign-off — B1-18 (CLOSE): nothing on screen ---------- */

/* ---------- 15 · end card, on the beat: the wordmark, subscribe, six plain lines, then the concession ----------
   Same stage as the title. Generic labels only, one per two beats, one fade in and out each. Rail 8: the
   card ends on the line telling the viewer when to stay where they are. */
{
  const s = S['[END]'], a = s.start, d = s.dur;
  const offer = ['Payment terminal', 'Free POS software', 'Online ordering', 'Booking system', 'QR payments', 'API for ecommerce'];
  const concede = 'Check your statement first. If it matches your quote, stay put.';
  stages.push(`<div id="end" class="clip stage" data-start="${a}" data-duration="${d}" data-track-index="4">
    <div class="bgd"><div class="grid"></div><svg class="arc" viewBox="0 0 1920 1080"><circle class="ring" cx="420" cy="1180" r="760"/><circle class="sweep" cx="420" cy="1180" r="760"/></svg></div>
    <div class="brand"><div class="wm"><b>Nero</b><em>Pay</em></div><div class="sub"><b>Subscribe for more</b></div></div>
    <div class="items"><div class="kick2"><b>What comes with NeroPay</b></div><div class="list">${offer.map((o, i) => `<div class="row t${i}"><i class="hl"></i><span class="k">${esc(o)}</span><span class="v n">0${i + 1}</span></div>`).join('')}</div></div>
    <div class="final"><div class="wm"><b>Nero</b><em>Pay</em></div><div class="sub"><b>Subscribe for more</b></div><p class="concede">${esc(concede)}</p></div>
  </div>`);
  const g = (k) => r3(a + k * BAR2);
  const land = r3(a + 0.3);
  show('#end', a);
  js.push(`tl.fromTo("#end .grid", { x: 0, y: 0 }, { x: -60, y: -36, duration: ${d}, ease: "none", immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .sweep", { strokeDashoffset: 4776 }, { strokeDashoffset: 2900, duration: 2.6, ease: "power2.out", immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .arc", { rotation: 0 }, { rotation: -22, duration: ${d}, ease: "sine.inOut", immediateRender: false }, ${a});`);
  maskOn('#end .brand .wm', land, 14); sfx('impact', land, 0.26);
  js.push(`tl.fromTo("#end .brand .sub", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: ${F(8)}, ease: "power3.out", immediateRender: false }, ${g(1)});`); sfx('tick', g(1), 0.18);
  fadeOut('#end .brand', g(3) - 0.4, 8);
  js.push(`tl.fromTo("#end .items .kick2", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${F(8)}, ease: "none", immediateRender: false }, ${g(3)});`);
  offer.forEach((_, i) => { rowIn(`#end .items .t${i}`, g(3 + i)); sfx('tick', g(3 + i), 0.18); });
  const fin = g(3 + offer.length);
  fadeOut('#end .items', fin - 0.4, 8);
  maskOn('#end .final .wm', fin, 14); sfx('pop', fin, 0.16);
  js.push(`tl.fromTo("#end .final .sub", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: ${F(8)}, ease: "power3.out", immediateRender: false }, ${r3(fin + 0.3)});`);
  js.push(`tl.fromTo("#end .final .concede", { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: ${F(8)}, ease: "power3.out", immediateRender: false }, ${r3(fin + 0.1)});`); sfx('tick', fin + 0.1, 0.18);
  sfx('music-outro', a, 0.42, { bed: true });
  law('end', { archetype: 'END', shot: '[END]', start: a, formed: r3(fin + 0.1 + F(8)), end: r3(a + d), cut: true, words: nWords(concede), stage: true });
}

if (LAWFAIL.length) throw new Error('timing law (MOTION-SYSTEM.md §3) — simplify the graphic or keep more tail in edit.json; never stretch the take:\n  ' + LAWFAIL.join('\n  '));

/* ---------- camera tweens ---------- */
cam.sort((p, q) => p.t0 - q.t0);
for (let i = 1; i < cam.length; i++) if (cam[i].t0 < cam[i - 1].t1 - 0.001) throw new Error('camera segments overlap at ' + cam[i].t0 + ' (' + cam[i - 1].t0 + '-' + cam[i - 1].t1 + ')');
const camCode = cam.map((c) => {
  const to = { ...c.to, duration: r3(c.t1 - c.t0), ease: c.ease };
  return `tl.fromTo(cam, ${JSON.stringify(c.from)}, Object.assign(${JSON.stringify(to)}, { onUpdate: applyCam, immediateRender: false }), ${c.t0});`;
}).join('\n');

/* ---------- write ---------- */
const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=${W}, height=${H}" />
<script src="assets/vendor/gsap.min.js"></script>
<style>
@font-face{font-family:Poppins;font-weight:600;src:url(assets/fonts/poppins-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:800;src:url(assets/fonts/poppins-latin-800-normal.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:800;font-style:italic;src:url(assets/fonts/poppins-latin-800-italic.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:500;src:url(assets/fonts/inter-latin-500-normal.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:600;src:url(assets/fonts/inter-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:700;src:url(assets/fonts/inter-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:Inter;font-weight:800;src:url(assets/fonts/inter-latin-800-normal.woff2) format("woff2")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
body{font-family:Inter,"Helvetica Neue",Arial,sans-serif;color:#fff}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:${INK}}
#world{position:absolute;inset:0;transform-origin:50% 50%}
video.clip{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
.clip{position:absolute}
/* every overlay starts hidden and is revealed by its first tween (LESSONS.md #23) */
.ov{position:absolute;opacity:0;visibility:hidden}
.ov .cue{opacity:0;visibility:hidden}
/* ---- type: labels 600–800 caps, tracked; values 600, normal tracking (MOTION-SYSTEM.md §5) ---- */
.caps{text-transform:uppercase;letter-spacing:0.06em}
/* B — kinetic label */
.lbl b{display:block;font-weight:800;font-size:64px;line-height:1;text-transform:uppercase;letter-spacing:0.06em;color:${Y};white-space:nowrap;text-shadow:0 6px 28px rgba(0,0,0,.55)}
.lbl .strike{position:absolute;left:-2%;top:50%;width:104%;height:6px;margin-top:-3px;display:block;background:#fff;border-radius:3px;transform:rotate(-5deg);transform-origin:0 50%}
/* the name plate: a small B */
.plate{display:flex;align-items:center;gap:14px;opacity:0;visibility:hidden}
.plate i{display:block;width:12px;height:12px;background:${Y};border-radius:3px;flex:none}
.plate b{display:block;font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;line-height:1;text-shadow:0 4px 18px rgba(0,0,0,.6)}
.plate span{display:block;margin-top:5px;font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:rgba(255,255,255,.6);line-height:1}
/* D — glass spec table: a flat translucent fill, a hairline, a soft low shadow, sitting in the room */
.panel .tilt{position:absolute;inset:0;transform:perspective(1400px) rotateY(-10deg) rotateX(2deg);transform-origin:100% 50%}
.slab{position:absolute;inset:0;border-radius:22px;background:rgba(16,18,22,.62);border:1px solid rgba(255,255,255,.22);filter:drop-shadow(0 24px 48px rgba(0,0,0,.45));padding:34px 40px 30px;display:flex;flex-direction:column}
.ph{font-size:22px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:rgba(255,255,255,.6);margin-bottom:14px}
.row{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px;height:78px;padding:0 2px;opacity:0;visibility:hidden}
.row .hl{position:absolute;left:0;right:0;top:0;height:1px;display:block;background:rgba(255,255,255,.22);transform-origin:0 50%}
.row .k{font-size:29px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#fff;white-space:nowrap}
.row .v{font-size:38px;font-weight:600;color:#fff;letter-spacing:-0.01em;white-space:nowrap;text-align:right}
.row .v.n{font-size:26px;color:rgba(255,255,255,.45);font-weight:600}
.row.y .k,.row.y .v{color:${Y}}
#ask .row{height:78px} #ask .row .k{font-size:27px}
.pf{margin-top:auto;padding-top:14px;font-size:17px;font-weight:500;letter-spacing:0.02em;color:rgba(255,255,255,.55)}
/* C — card fan: rounded portrait cards on a shallow arc, a small yellow caption under each */
.fan{left:0;top:0;width:${W}px;height:${H}px}
.cardw{position:absolute;width:168px;height:280px;transform-origin:50% 100%;opacity:0;visibility:hidden}
.cardf{position:absolute;left:0;top:0;width:168px;height:236px;border-radius:18px;background:rgba(16,18,22,.62);border:1px solid rgba(255,255,255,.22);filter:drop-shadow(0 24px 48px rgba(0,0,0,.45));display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;transform-origin:50% 100%}
.cardf b{font-size:40px;font-weight:700;letter-spacing:-0.02em;line-height:1}
.cardf small{font-size:15px;font-weight:600;text-transform:uppercase;letter-spacing:0.1em;color:rgba(255,255,255,.5)}
.cardw .cname{position:absolute;left:-40px;right:-40px;top:250px;display:block;text-align:center;font-style:normal;font-size:20px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:${Y};text-shadow:0 3px 14px rgba(0,0,0,.6)}
/* E — floating document: paper on a card turned to the wall, dark ink, one yellow marker */
.doc .tilt{position:absolute;inset:0;transform:perspective(1400px) rotateY(-10deg);transform-origin:100% 50%;opacity:0;visibility:hidden}
.paper{position:absolute;inset:0;border-radius:14px;background:#f6f3ec;color:#17181b;filter:drop-shadow(0 24px 48px rgba(0,0,0,.45));padding:30px 34px 26px;display:flex;flex-direction:column;overflow:hidden}
.dh{display:flex;flex-direction:column;gap:3px;padding-bottom:12px;border-bottom:2px solid #17181b;margin-bottom:12px}
.dh b{font-size:22px;font-weight:800;text-transform:uppercase;letter-spacing:0.08em}
.dh span{font-size:16px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#5a5a58}
.dh em{font-style:normal;font-size:14px;font-weight:600;letter-spacing:0.02em;color:#6b6b68}
.dl{position:relative;display:flex;justify-content:space-between;align-items:baseline;height:36px;font-size:20px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;opacity:0;visibility:hidden}
.dl b{font-weight:800;letter-spacing:0;text-transform:none;font-size:22px}
.mk{position:absolute;left:-10px;right:-10px;top:4px;height:26px;display:block;background:rgba(245,197,24,.55);border-radius:4px;transform:scaleX(0);transform-origin:0 50%;z-index:0}
.dl span,.dl b,.dr span{position:relative;z-index:1}
.dt{margin-top:10px;border-top:1px solid #c9c6bf;padding-top:6px}
.dr{position:relative;display:grid;grid-template-columns:2.3fr 0.7fr 1.2fr 0.8fr 1fr;align-items:center;height:35px;font-size:18px;font-weight:600;letter-spacing:0;white-space:nowrap;opacity:0;visibility:hidden}
.dr span:nth-child(n+2){text-align:right} .dr .mk + span{text-align:left}
.dr.fee .lab{grid-column:1}
.dr.fee .how{grid-column:2 / 5;text-align:left;color:#6b6b68;font-weight:500}
.dr.fee .amt{grid-column:5;text-align:right}
.dr.dhd{font-size:13px;text-transform:uppercase;letter-spacing:0.08em;color:#6b6b68;height:26px}
.dr.dsub{border-top:1px solid #c9c6bf;border-bottom:1px solid #c9c6bf;font-weight:800;margin:2px 0}
.dr.f0{margin-top:4px}
/* F — arrow relation: two terms and a thin line with a head */
.rel{display:flex;align-items:center;gap:26px;height:64px}
.rel .t1,.rel .t2{display:flex;align-items:center;white-space:nowrap}
.rel b{display:block;font-size:38px;font-weight:800;text-transform:uppercase;letter-spacing:0.06em;line-height:1;color:#fff;text-shadow:0 6px 28px rgba(0,0,0,.55);opacity:0;visibility:hidden}
.rel .t2 b{color:${Y}}
.rel .ln{position:relative;flex:1;height:64px;min-width:200px;opacity:0;visibility:hidden}
.rel .shaft{position:absolute;left:0;right:14px;top:31px;height:2px;display:block;background:rgba(255,255,255,.85);transform-origin:0 50%;box-shadow:0 4px 18px rgba(0,0,0,.5)}
.rel .head{position:absolute;right:0;top:22px;width:0;height:0;display:block;border-left:18px solid rgba(255,255,255,.95);border-top:10px solid transparent;border-bottom:10px solid transparent;transform-origin:100% 50%}
.rel .tag{position:absolute;left:0;right:14px;top:-6px;text-align:center;font-style:normal;font-size:22px;font-weight:700;letter-spacing:0.06em;color:${Y};text-shadow:0 4px 18px rgba(0,0,0,.6)}
/* G — status pills: a badge, then a lozenge; the affirmative filled yellow, the negative outlined */
.pills{display:flex;flex-direction:column;gap:14px}
.pill{display:flex;align-items:center;gap:16px;opacity:0;visibility:hidden}
.pill .badge{position:relative;display:block;flex:none;width:46px;height:46px;border-radius:50%;transform-origin:50% 50%;filter:drop-shadow(0 8px 20px rgba(0,0,0,.45))}
.pill.ok .badge{background:${Y}} .pill.ok .badge::after{content:"";position:absolute;left:16px;top:10px;width:11px;height:20px;border-right:4px solid ${INK};border-bottom:4px solid ${INK};transform:rotate(45deg)}
.pill.no .badge{border:2px solid rgba(255,255,255,.55)} .pill.no .badge::before,.pill.no .badge::after{content:"";position:absolute;left:12px;top:20px;width:18px;height:3px;background:#fff;transform:rotate(45deg)} .pill.no .badge::after{transform:rotate(-45deg)}
.pill span{display:block;height:56px;line-height:56px;padding:0 26px;border-radius:28px;font-size:24px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;white-space:nowrap;transform-origin:0 50%;filter:drop-shadow(0 12px 28px rgba(0,0,0,.45))}
.pill.ok span{background:${Y};color:${INK}} .pill.no span{border:2px solid rgba(255,255,255,.55);color:#fff;line-height:52px}
/* ---- the title and end stages: charcoal, a fine drifting grid, one yellow arc ---- */
.stage{left:0;top:0;width:${W}px;height:${H}px;background:${INK};overflow:hidden;opacity:0;visibility:hidden}
.stage .bgd{position:absolute;inset:0;overflow:hidden}
.stage .grid{position:absolute;left:-120px;top:-120px;width:${W + 240}px;height:${H + 240}px;background-image:linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px);background-size:120px 120px}
.stage .arc{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:50% 50%}
.stage .ring{fill:none;stroke:rgba(255,255,255,.12);stroke-width:1}
.stage .sweep{fill:none;stroke:${Y};stroke-width:3;stroke-linecap:round;stroke-dasharray:4776;stroke-dashoffset:4776}
.stage .kick,.stage .kick2{position:absolute;left:0;right:0;top:520px;text-align:center;opacity:0;visibility:hidden}
.stage .kick b,.stage .kick2 b,.stage .sub b{display:inline-block;font-size:30px;font-weight:700;text-transform:uppercase;letter-spacing:0.3em;padding-left:0.3em;color:${Y};line-height:1.3}
.stage .wm{position:absolute;left:0;right:0;top:430px;line-height:1;text-align:center;font-family:Poppins,Inter,sans-serif;font-size:230px;font-weight:800;letter-spacing:-0.05em;line-height:1;opacity:0;visibility:hidden}
.stage .wm em{font-style:normal;color:${Y}}
.stage .ep{position:absolute;left:0;right:0;top:700px;text-align:center;font-size:40px;font-weight:600;text-transform:uppercase;letter-spacing:0.12em;color:#fff}
.stage .ep .ew{display:inline-block;margin:0 0.18em;opacity:0;visibility:hidden}
/* the end card's three layers */
#end .brand,#end .items,#end .final{position:absolute;inset:0}
#end .brand .wm,#end .final .wm{top:280px}
#end .sub{position:absolute;left:0;right:0;top:600px;text-align:center;opacity:0;visibility:hidden}
#end .sub b{color:#fff;letter-spacing:0.22em;font-size:28px}
#end .items .kick2{top:160px;color:${Y}}
#end .list{position:absolute;left:360px;top:250px;width:1200px}
#end .list .row{height:88px}
#end .list .row .k{font-size:34px}
#end .final .concede{position:absolute;left:0;right:0;top:700px;text-align:center;font-size:30px;font-weight:500;letter-spacing:0;color:rgba(255,255,255,.85);opacity:0;visibility:hidden}
#floor{position:absolute;left:0;right:0;bottom:0;height:300px;pointer-events:none;background:linear-gradient(180deg,rgba(10,10,12,0) 0%,rgba(10,10,12,.28) 45%,rgba(10,10,12,.5) 100%)}
/* captions: no plate, no shadow, tight Poppins, yellow on the spoken word (LESSONS.md #4) */
.cap{left:0;right:0;width:${W}px;bottom:118px;display:flex;justify-content:center;pointer-events:none;font-family:Poppins,Inter,sans-serif}
.cap .line{max-width:1500px;text-align:center;font-size:56px;font-weight:600;line-height:1.16;letter-spacing:-0.035em;text-wrap:balance}
.cap .w{display:inline-block;color:rgba(255,255,255,.86);margin:0 0.03em}
.cap .w.em{font-style:italic;font-weight:800;font-size:1.06em}
</style>
</head>
<body>
<div id="root" data-composition-id="b1v7" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
  <div id="world">
${html.filter((h) => !/class="clip cap"/.test(h)).map((h) => '    ' + h).join('\n')}
  </div>
  <div id="floor"></div>
${stages.map((h) => '  ' + h).join('\n')}
${html.filter((h) => /class="clip cap"/.test(h)).map((h) => '  ' + h).join('\n')}
${audio.map((a) => '  ' + a).join('\n')}
</div>
<script>
(function () {
  const tl = gsap.timeline({ paused: true });
  const world = document.getElementById("world");
  const cam = { scale: 1, x: 0, y: 0 };
  function applyCam() { world.style.transform = "translate(" + cam.x + "px, " + cam.y + "px) scale(" + cam.scale + ")"; }
  applyCam();
${camCode.split('\n').map((l) => '  ' + l).join('\n')}
  const WORDS = ${JSON.stringify(WORDLIST)};
  const spans = Array.from(document.querySelectorAll(".cap .w")).sort((p, q) => +p.dataset.i - +q.dataset.i);
  const driver = { t: 0 };
  function paint() {
    const now = driver.t;
    for (let i = 0; i < spans.length; i++) {
      const s = WORDS[i][0], e = WORDS[i][1], el = spans[i];
      if (now < s - 0.02) el.style.color = "rgba(255,255,255,0.86)";
      else if (now < e + 0.04) el.style.color = "${Y}";
      else el.style.color = "#ffffff";
    }
  }
  paint();
  tl.fromTo(driver, { t: 0 }, { t: ${TOTAL}, duration: ${TOTAL}, ease: "none", onUpdate: paint, immediateRender: false }, 0);
${js.map((l) => '  ' + l).join('\n')}
  window.__timelines["b1v7"] = tl;
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'index.html'), page);
/* the manifest MOTION-SYSTEM.md §7 asks for: the angle per shot, every overlay with its archetype and
   computed build / hold / exit, and the frame to snapshot for overlays-contact.png */
fs.mkdirSync(path.join(HERE, 'review'), { recursive: true });
const manifest = {
  built: new Date().toISOString().slice(0, 10), total: TOTAL, fps: FPS, sfx_gain: SFX_GAIN,
  shots: segs.map((s) => ({ id: s.id, kind: s.kind, start: s.start, dur: s.dur, angle: s.angle || null })),
  overlays: LAW,
  contact_at: LAW.map((l) => l.held_frame_at),
};
fs.writeFileSync(path.join(HERE, 'review/manifest.json'), JSON.stringify(manifest, null, 1));
console.log('index.html — ' + TOTAL + 's, ' + segs.length + ' segments, ' + WORDLIST.length + ' words, ' + cam.length + ' camera moves, ' + sfxN + ' sounds, ' + LAW.length + ' overlays pass the timing law' + (cutUsed ? ', ' + cutUsed + ' clips from assets/cut' : ', RAW clips (run cut.mjs)') + (estimated.length ? ' — word timing ESTIMATED for ' + estimated.join(', ') : ''));
segs.forEach((s) => console.log('  ' + s.id.padEnd(9) + String(s.start).padStart(8) + 's  ' + String(s.dur).padEnd(7) + (s.angle || '')));
LAW.forEach((l) => console.log('  overlay ' + l.id.padEnd(8) + l.archetype.padEnd(6) + l.shot.padEnd(15) + 'build ' + String(l.build_f).padStart(2) + 'f  hold ' + String(l.hold_f).padStart(3) + 'f  exit ' + l.exit_f + 'f  ' + l.words + ' words'));

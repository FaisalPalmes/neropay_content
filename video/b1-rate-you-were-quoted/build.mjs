/* Generates index.html for B1 "The rate you were quoted" from the clips on disk, the Whisper word
   timings and the hand trims. Run it again whenever a clip, a timing or a trim changes:

     node build.mjs            → writes index.html
     npx hyperframes check     → lint + layout + contrast
     npx hyperframes render -q draft | high

   Everything the composition does is a pure function of timeline time (HyperFrames seeks every
   frame), so all motion is authored here as absolute fromTo tweens on one paused GSAP timeline.
   Design rules that came out of Faisal's reviews live in ../LESSONS.md — read it before changing
   anything here. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const W = 1920, H = 1080, FPS = 30, Y = '#F5C518';
const WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'data/words.json'), 'utf8'));
const SCRIPT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/script.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/edit.json'), 'utf8'));
const EMPH = ['effective', 'statement', 'fees', 'fee', 'flat', 'tiered', 'exit', 'term', 'rental', 'average', 'debit', 'credit', 'amex', 'own', 'renting', 'choose', 'cheapest', 'most', 'double', 'less', 'payout', 'calculator'];

const ffprobe = process.env.HYPERFRAMES_FFPROBE_PATH || 'ffprobe';
function dur(file) {
  const out = execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim();
  return Math.round(parseFloat(out) * 1000) / 1000;
}
const r3 = (n) => Math.round(n * 1000) / 1000;
const clean = (w) => String(w).toLowerCase().replace(/^[“"'(]+|[”"')\.,!?;:]+$/g, '');
const isNum = (w) => /\d|£|%/.test(w);
const isEmph = (w) => isNum(w) || EMPH.includes(clean(w));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

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
const CARD = { '[TITLE]': 3.2, '[END]': 6.0 };
const XF = 0.4;                        // crossfade into and out of the title card
let t = 0;
const segs = [];
let estimated = [];
for (const id of ORDER) {
  if (CARD[id]) { segs.push({ id, kind: 'card', start: r3(t), dur: CARD[id] }); t += CARD[id]; continue; }
  const file = path.join(HERE, 'assets/clips', id + '.mp4');
  if (!fs.existsSync(file)) { console.log('skip ' + id + ' (no clip)'); continue; }
  const full = dur(file), inn = (EDIT[id] && EDIT[id].in) || 0, out = (EDIT[id] && EDIT[id].out) || 0;
  const d = r3(full - inn - out);
  let raw = WORDS[id];
  if (!raw || !raw.length) { raw = estimateWords(SCRIPT[id], full); estimated.push(id); }
  const words = raw.map((w) => ({ w: w.w, s: r3(w.s - inn), e: r3(w.e - inn) })).filter((w) => w.e > 0 && w.s < d);
  segs.push({ id, kind: 'clip', start: r3(t), dur: d, mediaStart: inn, words, src: 'assets/clips/' + id + '.mp4' });
  t += d;
}
const TOTAL = r3(t);
const S = Object.fromEntries(segs.map((s) => [s.id, s]));
const at = (id, local) => r3(S[id].start + local);
const endOf = (id) => r3(S[id].start + S[id].dur);
/* global start of the nth word whose cleaned text matches (or starts with) `text` */
const findWord = (id, text, nth = 0) => {
  let k = 0;
  for (const w of S[id].words) if (clean(w.w) === text || clean(w.w).startsWith(text)) { if (k++ === nth) return at(id, w.s); }
  throw new Error('no word "' + text + '" in ' + id + ': ' + S[id].words.map((w) => w.w).join(' '));
};

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
const html = [], js = [], audio = [];
let wordIndex = 0;
const WORDLIST = [];

/* Glass panel. Structure: .clip.p3d (placed) > .float (3D entrance / exit) > .idle (2D bob) > .glass
   (blur lives on its ::before, the element itself is never transformed — see LESSONS.md #2, #3). */
function glass(id, { start, dur: life, x, y, w, h, inner, enterFrom = 22, track = 2, quiet = false }) {
  html.push(`<div id="${id}" class="clip p3d" data-start="${start}" data-duration="${life}" data-track-index="${track}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
  <div class="float"><div class="idle"><div class="glass" style="width:${w}px;height:${h}px"><div class="body">${inner}</div><i class="sheen"></i></div></div></div></div>`);
  js.push(`tl.fromTo("#${id} .float", { autoAlpha: 0, rotationY: ${enterFrom}, x: ${enterFrom > 0 ? 50 : -50}, z: -140, transformPerspective: 1600 }, { autoAlpha: 1, rotationY: 0, x: 0, z: 0, duration: 0.8, ease: "power3.out", immediateRender: false }, ${start});`);
  js.push(`tl.fromTo("#${id} .float", { autoAlpha: 1, y: 0, scale: 1 }, { autoAlpha: 0, y: 18, scale: 0.985, duration: 0.4, ease: "power2.in", immediateRender: false }, ${r3(start + life - 0.4)});`);
  js.push(`tl.set("#${id} .float", { autoAlpha: 0 }, ${r3(start + life)});`);
  const cycle = 3.4, reps = Math.max(0, Math.floor(life / cycle) - 1);
  js.push(`tl.fromTo("#${id} .idle", { y: 0 }, { y: -7, duration: ${cycle / 2}, ease: "sine.inOut", yoyo: true, repeat: ${reps * 2 + 1}, immediateRender: false }, ${start});`);
  const sreps = Math.max(0, Math.floor((life - 1.4) / 3.5));
  js.push(`tl.fromTo("#${id} .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.4, ease: "power2.inOut", repeat: ${sreps}, repeatDelay: 2.1, immediateRender: false }, ${r3(start + 0.3)});`);
  if (!quiet) sfx('whoosh', start, 0.14);
}
/* a row / line inside a panel arriving on its word */
const arrive = (sel, when, dx = 36) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, x: ${dx} }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
const rise = (sel, when) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
/* a figure counting up to its value as it is said (stat count-up; the value is a function of time) */
let cu = 0;
function countUp(sel, to, when, { from = 0, dur: d = 0.9, prefix = '', suffix = '', dp = 0, sep = true } = {}) {
  const v = 'cu' + (cu++);
  js.push(`const ${v} = { n: ${from} }, ${v}el = document.querySelector("${sel}");
  const ${v}f = () => { const n = ${v}.n; const s = n.toFixed(${dp}); ${v}el.textContent = "${prefix}" + (${sep} ? s.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : s) + "${suffix}"; };
  ${v}f();
  tl.fromTo(${v}, { n: ${from} }, { n: ${to}, duration: ${d}, ease: "power2.out", onUpdate: ${v}f, immediateRender: false }, ${r3(when)});`);
}
const SFXDUR = {}; let sfxN = 0;
function sfx(name, start, vol) {
  const id = 'sfx-' + name + '-' + Math.round(start * 100);
  if (!SFXDUR[name]) SFXDUR[name] = dur(path.join(HERE, 'assets/sfx', name + '.wav'));
  audio.push(`<audio id="${id}" src="assets/sfx/${name}.wav" data-start="${r3(start)}" data-duration="${SFXDUR[name]}" data-track-index="${12 + (sfxN++)}" data-volume="${vol}"></audio>`);
}

/* ---------- camera ---------- */
/* One world wrapper carries the camera (viewport-change): screen = S·offset + T, so to centre a point
   at world offset (ox, oy) from frame centre at scale S, translate by T = -offset·S. Translation is
   clamped to what the scale covers so the frame edge never shows. Segments run back to back. */
const cam = [];
const clampCam = (c) => {
  const mx = (c.scale - 1) * W / 2, my = (c.scale - 1) * H / 2;
  return { scale: c.scale, x: r3(Math.max(-mx, Math.min(mx, c.x))), y: r3(Math.max(-my, Math.min(my, c.y))) };
};
function move(t0, t1, from, to, ease = 'power2.inOut') { if (t1 - t0 < 0.05) return; cam.push({ t0: r3(t0), t1: r3(t1), from: clampCam(from), to: clampCam(to), ease }); }
const focus = (S_, px, py) => ({ scale: S_, x: r3(-(px - W / 2) * S_), y: r3(-(py - H / 2) * S_) });
const flat = (S_, x = 0, y = 0) => ({ scale: S_, x, y });
/* a whole-shot camera line: from → to across the clip, with an optional punch at a word */
function shotCam(id, from, to, punch) {
  const a = S[id].start, b = endOf(id);
  if (!punch) { move(a, b, from, to, 'power1.inOut'); return; }
  const { when, hold = 1.2, target, back } = punch;
  const mid = { scale: r3(from.scale + (to.scale - from.scale) * ((when - a) / (b - a))), x: r3(from.x + (to.x - from.x) * ((when - a) / (b - a))), y: r3(from.y + (to.y - from.y) * ((when - a) / (b - a))) };
  move(a, when, from, mid, 'power1.inOut');
  const t1 = r3(Math.min(when + 0.7, b)), t2 = r3(Math.min(when + 0.7 + hold, b));
  move(when, t1, mid, target, 'power3.out');
  if (t2 > t1) move(t1, t2, target, { scale: r3(target.scale + 0.02), x: target.x, y: target.y }, 'none');
  if (b > t2 + 0.3) move(t2, b, { scale: r3(target.scale + 0.02), x: target.x, y: target.y }, back || to, 'power2.inOut');
}

/* ---------- video, audio, captions for every clip ---------- */
for (const s of segs) {
  if (s.kind !== 'clip') continue;
  html.push(`<video id="v-${s.id}" class="clip" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="0" muted playsinline></video>`);
  audio.push(`<audio id="a-${s.id}" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="10" data-volume="1"></audio>`);
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

/* ---------- 1 · hook: 0.5%? --- B1-01 ---------- */
{
  const s = S['B1-01'], a = s.start, b = endOf('B1-01');
  /* name plate for the first three seconds */
  html.push(`<div id="plate" class="clip p3d" data-start="${a}" data-duration="3.2" data-track-index="8" style="left:72px;top:72px;width:300px;height:92px">
  <div class="float"><div class="idle"><div class="glass" style="width:300px;height:92px;border-radius:24px"><div class="body plate"><b></b><div><strong>Ava</strong><span>NeroPay</span></div></div><i class="sheen"></i></div></div></div></div>`);
  js.push(`tl.fromTo("#plate .float", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, ${a});`);
  js.push(`tl.fromTo("#plate .float", { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: -30, duration: 0.4, ease: "power2.in", immediateRender: false }, ${r3(a + 2.8)});`);
  js.push(`tl.set("#plate .float", { autoAlpha: 0 }, ${r3(a + 3.2)});`);
  js.push(`tl.fromTo("#plate .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.2, ease: "power2.inOut", immediateRender: false }, ${r3(a + 0.3)});`);
  const tMaybe = findWord('B1-01', 'maybe'), tCent = findWord('B1-01', 'cent'), tNot = findWord('B1-01', 'not');
  const cx = 1200, cy = 220, cw = 460, ch = 210;
  glass('chip', { start: tMaybe, dur: r3(b - tMaybe), x: cx, y: cy, w: cw, h: ch, enterFrom: 26,
    inner: `<div class="chip"><span class="big">0.5%</span><span class="q">?</span><i class="strike"></i></div>` });
  js.push(`tl.set("#chip .strike", { scaleX: 0, rotation: -8 }, ${tMaybe});`);
  js.push(`tl.fromTo("#chip .q", { autoAlpha: 0, scale: 0.4, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, ${tCent});`);
  js.push(`tl.fromTo("#chip .strike", { scaleX: 0, rotation: -8 }, { scaleX: 1, rotation: -8, duration: 0.4, ease: "power3.inOut", immediateRender: false }, ${tNot});`);
  js.push(`tl.fromTo("#chip .big", { color: "#ffffff" }, { color: "rgba(255,255,255,0.5)", duration: 0.4, immediateRender: false }, ${tNot});`);
  sfx('pop', tCent, 0.14);
  shotCam('B1-01', flat(1.0), flat(1.08), { when: tNot, target: focus(1.2, cx + cw / 2 - 120, cy + ch / 2 + 90), hold: 0.8, back: flat(1.08) });
}

/* ---------- 2 · one card, then a lot more --- B1-02 ---------- */
{
  const s = S['B1-02'], a = s.start, b = endOf('B1-02');
  const tOne = findWord('B1-02', 'one'), tMore = findWord('B1-02', 'more');
  const cards = [0, 1, 2, 3].map((i) => `<div class="card c${i}"><i class="cchip"></i><i class="cstripe"></i>${i === 0 ? '<span class="cname">DEBIT</span>' : ''}</div>`).join('');
  html.push(`<div id="fan" class="clip space" data-start="${tOne}" data-duration="${r3(b - tOne)}" data-track-index="2" style="left:1120px;top:120px;width:720px;height:560px"><div class="orbit">${cards}</div></div>`);
  /* the first card lands from depth; three more slide out behind it into their own 3D space */
  js.push(`tl.fromTo("#fan .c0", { autoAlpha: 0, z: -400, rotationY: 40, rotationX: 10 }, { autoAlpha: 1, z: 0, rotationY: -14, rotationX: 6, duration: 0.8, ease: "power3.out" }, ${tOne});`);
  [1, 2, 3].forEach((i) => {
    js.push(`tl.fromTo("#fan .c${i}", { autoAlpha: 0, x: 0, y: 0, z: -60, rotationY: -14, rotationX: 6, rotationZ: 0 }, { autoAlpha: 1, x: ${i * 92}, y: ${-i * 54}, z: ${-i * 90}, rotationY: -14, rotationX: 6, rotationZ: ${i * 4}, duration: 0.7, ease: "power3.out", immediateRender: false }, ${r3(tMore + (i - 1) * 0.12)});`);
  });
  js.push(`tl.fromTo("#fan .orbit", { rotationY: -5 }, { rotationY: 5, duration: ${r3((b - tOne))}, ease: "sine.inOut", immediateRender: false }, ${tOne});`);
  js.push(`tl.fromTo("#fan .orbit", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4, ease: "power2.in", immediateRender: false }, ${r3(b - 0.4)});`);
  js.push(`tl.set("#fan .orbit", { autoAlpha: 0 }, ${b});`);
  sfx('pop', tOne, 0.14); sfx('whoosh', tMore, 0.14);
  shotCam('B1-02', flat(1.08, 40, 0), flat(1.03, -30, 0), { when: tMore, target: focus(1.12, 1420, 400), hold: 1.0, back: flat(1.05, -30, 0) });
}

/* ---------- 3 · Ava's line --- B1-INTRO ---------- */
{
  const a = S['B1-INTRO'].start, b = endOf('B1-INTRO');
  move(a, r3(b - XF), flat(1.0), flat(1.06), 'power1.inOut');
}

/* ---------- 4 · title card ---------- */
{
  const s = S['[TITLE]'], a = r3(s.start - XF), d = r3(s.dur + 2 * XF);
  html.push(`<div id="title" class="clip card-full" data-start="${a}" data-duration="${d}" data-track-index="4">
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="p3d" style="left:${(W - 1280) / 2}px;top:${(H - 560) / 2}px;width:1280px;height:560px"><div class="float"><div class="idle"><div class="glass tglass" style="width:1280px;height:560px">
    <div class="body tstack"><span class="kicker">EXPLAINED BY</span><span class="wordmark"><b>Nero</b><em>Pay</em></span><span class="ep">Why the rate you were quoted isn't the rate you pay</span></div><i class="sheen"></i></div></div></div></div></div>`);
  js.push(`tl.fromTo("#title", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${XF}, ease: "power2.inOut" }, ${a});`);
  js.push(`tl.fromTo("#title", { autoAlpha: 1 }, { autoAlpha: 0, duration: ${XF}, ease: "power2.inOut", immediateRender: false }, ${r3(a + d - XF)});`);
  js.push(`tl.set("#title", { autoAlpha: 0 }, ${r3(a + d)});`);
  js.push(`tl.fromTo("#title .float", { autoAlpha: 0, rotationY: -14, rotationX: 5, z: -220, scale: 0.94, transformPerspective: 1800 }, { autoAlpha: 1, rotationY: 0, rotationX: 0, z: 0, scale: 1, duration: 1.1, ease: "power4.out", immediateRender: false }, ${r3(a + XF * 0.5)});`);
  js.push(`tl.fromTo("#title .idle", { y: 0 }, { y: -6, duration: 1.7, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${r3(a + XF)});`);
  js.push(`tl.fromTo("#title .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.6, ease: "power2.inOut", immediateRender: false }, ${r3(a + XF + 0.5)});`);
  rise('#title .kicker', a + XF + 0.45); rise('#title .wordmark', a + XF + 0.55); rise('#title .ep', a + XF + 0.85);
  js.push(`tl.fromTo("#title .g1", { scale: 0.9, opacity: 0.35 }, { scale: 1.12, opacity: 0.55, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#title .g2", { scale: 1.1, opacity: 0.25 }, { scale: 0.9, opacity: 0.4, duration: 1.9, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  sfx('rise', r3(a + XF), 0.2);
  move(a, r3(a + d - XF), flat(1.06), flat(1.0), 'power1.inOut');
}

/* ---------- 5 · the advertised-rate table --- B1-03 ---------- */
const PX = 1110, PW = 760;   // panel column, clear of Ava
{
  const b = endOf('B1-03');
  const tAdv = findWord('B1-03', 'advertised'), tDebit = findWord('B1-03', 'debit'), tCheap = findWord('B1-03', 'cheapest');
  const rows = [['Consumer debit', '0.50%'], ['Consumer credit', '1.20%'], ['Business / commercial', '2.60%'], ['American Express', '1.75%'], ['International / non-UK', '2.90%']];
  const ty = 150, th = 580;
  glass('table', { start: r3(tAdv - 0.2), dur: r3(b - tAdv + 0.2), x: PX, y: ty, w: PW, h: th, enterFrom: 24,
    inner: `<div class="pad"><span class="th">the advertised rate, by card</span>${rows.map(([n, v], i) => `<div class="row r${i}${i === 0 ? ' hot' : ''}"><span>${n}</span><b>${v}</b></div>`).join('')}</div>` });
  rows.forEach((_, i) => arrive(`#table .r${i}`, tAdv + 0.3 + i * 0.1));
  js.push(`tl.fromTo("#table .r0", { backgroundColor: "rgba(245,197,24,0)" }, { backgroundColor: "rgba(245,197,24,0.18)", duration: 0.4, ease: "power2.out", immediateRender: false }, ${tDebit});`);
  js.push(`tl.fromTo("#table .r0 b", { scale: 1 }, { scale: 1.2, duration: 0.4, ease: "back.out(2)", immediateRender: false }, ${tDebit});`);
  js.push(`tl.fromTo("#table .r0 b", { scale: 1.2 }, { scale: 1.1, duration: 0.4, ease: "power2.inOut", immediateRender: false }, ${tCheap});`);
  const cellX = PX + PW - 120, cellY = ty + 110 + 46;
  shotCam('B1-03', flat(1.0), flat(1.06, -50, 0), { when: tDebit, target: focus(1.28, cellX - 200, cellY + 130), hold: 1.4, back: flat(1.06, -40, 0) });
}

/* ---------- 6 · the rate ladder --- B1-04 ---------- */
{
  const s = S['B1-04'], a = s.start;
  const tCredit = findWord('B1-04', 'credit'), tCompany = findWord('B1-04', 'company'), tAmex = findWord('B1-04', 'amex'), tOver = findWord('B1-04', 'overseas'), tMost = findWord('B1-04', 'most');
  const bars = [['Debit', '0.50%', 0.18, a + 0.05, 0.5], ['Credit', '1.20%', 0.42, tCredit + 0.15, 1.2], ['Business', '2.60%', 0.86, tCompany + 0.1, 2.6], ['Amex', '1.75%', 0.6, tAmex + 0.1, 1.75], ['Overseas', '2.90%', 0.96, tOver + 0.1, 2.9]];
  const ly = 130, lh = 660;
  glass('ladder', { start: a, dur: s.dur, x: PX, y: ly, w: PW, h: lh, enterFrom: 24,
    inner: `<div class="pad"><span class="th">what each card costs</span><div class="bars">${bars.map(([n, v, h], i) => `<div class="bar b${i}"><b style="bottom:calc(${Math.round(h * 100)}% + 60px)">${v}</b><i style="height:${Math.round(h * 100)}%"></i><span>${n}</span></div>`).join('')}</div></div>` });
  bars.forEach(([, , , when, val], i) => {
    js.push(`tl.fromTo("#ladder .b${i} i", { scaleY: 0 }, { scaleY: 1, duration: 0.8, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
    countUp(`#ladder .b${i} b`, val, when, { dur: 0.8, suffix: '%', dp: 2, sep: false });
    js.push(`tl.fromTo("#ladder .b${i} b", { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
    js.push(`tl.fromTo("#ladder .b${i} span", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, ${r3(when)});`);
  });
  js.push(`tl.fromTo("#ladder .b4 i", { scaleY: 1 }, { scaleY: 1.04, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tMost});`);
  shotCam('B1-04', flat(1.04, 30, 0), flat(1.08, -80, 0), { when: tMost, target: focus(1.2, PX + PW - 190, ly + 340), hold: 0.9, back: flat(1.08, -80, 0) });
}

/* ---------- 7 · their card, your rate --- B1-05 ---------- */
{
  const s = S['B1-05'], a = s.start, b = endOf('B1-05');
  const tChoose = findWord('B1-05', 'choose'), tPocket = findWord('B1-05', 'pocket'), tRate = findWord('B1-05', 'rate');
  const cards = [0, 1, 2, 3].map((i) => `<div class="card c${i}"><i class="cchip"></i><i class="cstripe"></i>${i === 3 ? '<span class="cname">OVERSEAS</span>' : ''}</div>`).join('');
  html.push(`<div id="hand" class="clip space" data-start="${a}" data-duration="${s.dur}" data-track-index="2" style="left:1120px;top:80px;width:740px;height:640px"><div class="orbit">${cards}<div class="tagwrap"><div class="tag glass"><div class="body"><span>their card.</span><em>your rate.</em></div><i class="sheen"></i></div></div></div></div>`);
  [0, 1, 2, 3].forEach((i) => js.push(`tl.fromTo("#hand .c${i}", { autoAlpha: 0, y: 120, z: -300, rotationY: 30, rotationX: 8, rotationZ: 0, x: 0 }, { autoAlpha: 1, y: ${-i * 40}, x: ${i * 86}, z: ${-i * 70}, rotationY: -12, rotationX: 8, rotationZ: ${-10 + i * 7}, duration: 0.7, ease: "power3.out", immediateRender: false }, ${r3(a + 0.1 + i * 0.1)});`));
  /* on "pocket" the overseas card comes forward, upright, in front; the rest sink back */
  js.push(`tl.fromTo("#hand .c3", { x: 258, y: -120, z: -210, rotationZ: 11, rotationY: -12, scale: 1 }, { x: 150, y: 40, z: 160, rotationZ: 0, rotationY: 0, scale: 1.25, duration: 0.7, ease: "power3.out", immediateRender: false }, ${tPocket});`);
  [0, 1, 2].forEach((i) => js.push(`tl.fromTo("#hand .c${i}", { autoAlpha: 1 }, { autoAlpha: 0.35, duration: 0.5, ease: "power2.inOut", immediateRender: false }, ${tPocket});`));
  js.push(`tl.fromTo("#hand .tagwrap", { autoAlpha: 0, y: 30, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.4)", immediateRender: false }, ${r3(tRate - 0.1)});`);
  js.push(`tl.fromTo("#hand .tag .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.0, ease: "power2.inOut", immediateRender: false }, ${r3(tRate + 0.2)});`);
  js.push(`tl.fromTo("#hand .orbit", { rotationY: 4 }, { rotationY: -4, duration: ${s.dur}, ease: "sine.inOut", immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#hand .orbit", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.4, ease: "power2.in", immediateRender: false }, ${r3(b - 0.4)});`);
  js.push(`tl.set("#hand .orbit", { autoAlpha: 0 }, ${b});`);
  sfx('whoosh', a + 0.1, 0.14); sfx('pop', tPocket, 0.16);
  shotCam('B1-05', flat(1.0), flat(1.1, 0, 20), { when: tPocket, target: focus(1.2, 1500, 400), hold: 1.0, back: flat(1.04) });
}

/* ---------- 8 · a made-up month --- B1-06 + the statement --- B1-07 (one panel) ---------- */
{
  const tHere = findWord('B1-06', 'here'), tTwenty = findWord('B1-06', 'twenty'), tSeven = findWord('B1-06', 'seven'), tNought = findWord('B1-06', 'nought');
  const t70 = findWord('B1-07', 'seventy'), tCred = findWord('B1-07', 'credit'), tComp = findWord('B1-07', 'company'), tOver = findWord('B1-07', 'overseas');
  const b = endOf('B1-07');
  const rows = [['Consumer debit', 71, '0.50%'], ['Consumer credit', 20, '1.20%'], ['Business / commercial', 5, '2.60%'], ['International / non-UK', 2, '2.90%']];
  const py = 96, ph = 690;
  glass('month', { start: r3(tHere - 0.1), dur: r3(b - tHere + 0.1), x: PX, y: py, w: PW, h: ph, enterFrom: 24,
    inner: `<div class="pad"><span class="th">a made-up month, one restaurant</span>
      <div class="stats"><div class="stat s0"><b>£0</b><span>card turnover</span></div><div class="stat s1"><b>0</b><span>card payments</span></div><div class="stat s2"><b>0.00%</b><span>the quoted rate</span></div></div>
      <div class="split">${rows.map(([n, pct, r], i) => `<div class="srow q${i}"><div class="lab"><span>${n}</span><b>${r}</b></div><div class="track"><i style="width:${pct}%"></i><em>${pct}%</em></div></div>`).join('')}</div>
      <span class="foot">Illustrative example, not a real statement.</span></div>` });
  rise('#month .s0', tTwenty); countUp('#month .s0 b', 28400, tTwenty, { prefix: '£', dur: 1.0 });
  rise('#month .s1', tSeven); countUp('#month .s1 b', 780, tSeven, { dur: 0.8 });
  rise('#month .s2', tNought); countUp('#month .s2 b', 0.5, tNought, { suffix: '%', dp: 2, sep: false, dur: 0.6 });
  [t70, tCred, tComp, tOver].forEach((when, i) => {
    arrive(`#month .q${i}`, when);
    js.push(`tl.fromTo("#month .q${i} .track i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", immediateRender: false }, ${r3(when + 0.1)});`);
    js.push(`tl.fromTo("#month .q${i} .track em", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, ${r3(when + 0.5)});`);
  });
  rise('#month .foot', tOver + 0.6);
  shotCam('B1-06', flat(1.0), flat(1.06, -40, 0), { when: tTwenty, target: focus(1.18, PX + 200, py + 200), hold: 1.2, back: flat(1.06, -40, 0) });
  shotCam('B1-07', flat(1.06, -40, 0), flat(1.09, -90, 0), { when: tOver, target: focus(1.16, PX + PW - 160, py + 520), hold: 0.8, back: flat(1.08, -80, 0) });
}

/* ---------- 9 · the charges that aren't a percentage --- B1-08 + B1-09 (one panel) ---------- */
{
  const tThen = findWord('B1-08', 'then'), tFour = findWord('B1-08', 'four'), tSeventeen = findWord('B1-08', 'seventeen'), tPci = findWord('B1-08', 'pci');
  const tAccount = findWord('B1-09', 'account'), tThree = findWord('B1-09', 'payout'), tOwn = findWord('B1-09', 'own');
  const b = endOf('B1-09');
  const rows = [['Authorisation fees', '780 × 4p', 31.2], ['Terminal rental', 'monthly', 17.5], ['PCI compliance fee', 'monthly', 9.95], ['Account fee', 'monthly', 5], ['Payout fees', 'every time they pay you', 12]];
  const py = 96, ph = 680;
  glass('fixed', { start: r3(tThen + 0.2), dur: r3(b - tThen - 0.2), x: PX, y: py, w: PW, h: ph, enterFrom: 24,
    inner: `<div class="pad"><span class="th">the charges that aren't a percentage</span>
      ${rows.map(([n, how, v], i) => `<div class="frow f${i}"><div><span>${n}</span><small>${how}</small></div><b>£${v.toFixed(2)}</b></div>`).join('')}
      <div class="ftotal"><span>these alone</span><b>£75.65</b><em>0.27% of turnover</em></div></div>` });
  [[tFour, 0], [tSeventeen, 1], [tPci, 2], [tAccount, 3], [tThree, 4]].forEach(([when, i]) => {
    arrive(`#fixed .f${i}`, when);
    countUp(`#fixed .f${i} b`, rows[i][2], when + 0.1, { prefix: '£', dp: 2, dur: 0.7 });
  });
  js.push(`tl.fromTo("#fixed .f4", { backgroundColor: "rgba(245,197,24,0)" }, { backgroundColor: "rgba(245,197,24,0.18)", duration: 0.4, immediateRender: false }, ${tOwn});`);
  rise('#fixed .ftotal', tOwn + 0.9); countUp('#fixed .ftotal b', 75.65, tOwn + 0.9, { prefix: '£', dp: 2, dur: 0.8 });
  shotCam('B1-08', flat(1.02, 20, 0), flat(1.06, -50, 0), { when: tFour, target: focus(1.14, PX + 300, py + 170), hold: 0.6, back: flat(1.06, -50, 0) });
  shotCam('B1-09', flat(1.06, -50, 0), flat(1.08, -70, 0), { when: tThree, target: focus(1.18, PX + PW - 170, py + 440), hold: 1.3, back: flat(1.06, -60, 0) });
}

/* ---------- 10 · the formula --- B1-10 ---------- */
{
  const s = S['B1-10'], a = s.start;
  const tAdd = findWord('B1-10', 'add'), tDivide = findWord('B1-10', 'divide'), tMultiply = findWord('B1-10', 'multiply');
  const py = 250, ph = 400;
  glass('formula', { start: r3(tAdd - 0.2), dur: r3(endOf('B1-10') - tAdd + 0.2), x: PX - 60, y: py, w: PW + 60, h: ph, enterFrom: 20,
    inner: `<div class="pad formula"><span class="th">your effective rate</span>
      <div class="frac"><div class="num">every charge on the statement</div><i class="line"></i><div class="den">total card turnover</div></div>
      <div class="ops"><span class="x100">× 100</span><span class="eq">=</span><b class="res">effective rate</b></div></div>` });
  rise('#formula .num', tAdd);
  js.push(`tl.fromTo("#formula .line", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut", immediateRender: false }, ${tDivide});`);
  rise('#formula .den', tDivide + 0.1);
  rise('#formula .x100', tMultiply); rise('#formula .eq', tMultiply + 0.25); rise('#formula .res', tMultiply + 0.4);
  shotCam('B1-10', flat(1.0), flat(1.08, -60, 0), { when: tMultiply, target: focus(1.16, PX + 320, py + 300), hold: 1.2, back: flat(1.06, -40, 0) });
}

/* ---------- 11 · £308 on £28,400 is 1.09% --- B1-11 + quoted vs paid --- B1-12 ---------- */
{
  const tThree = findWord('B1-11', 'three'), tTwenty = findWord('B1-11', 'twenty'), tOne = findWord('B1-11', 'one');
  const tQuoted = findWord('B1-12', 'quoted'), tDouble = findWord('B1-12', 'double');
  const b = endOf('B1-12');
  const py = 100, ph = 680;
  glass('sum', { start: r3(tThree - 0.2), dur: r3(b - tThree + 0.2), x: PX, y: py, w: PW, h: ph, enterFrom: 24,
    inner: `<div class="pad sum"><span class="th">what that month really cost</span>
      <div class="sline l0"><span>all charges</span><b>£0.00</b></div>
      <div class="sline l1"><span>card turnover</span><b>£0</b></div>
      <div class="big1"><em>effective rate</em><b>0.00%</b></div>
      <div class="vs"><div class="v0"><em>quoted</em><b>0.50%</b></div><i class="arrow"></i><div class="v1"><em>paying</em><b>1.09%</b></div></div>
      <span class="tag2">more than double</span></div>` });
  rise('#sum .l0', tThree); countUp('#sum .l0 b', 308.46, tThree, { prefix: '£', dp: 2, dur: 1.0 });
  rise('#sum .l1', tTwenty); countUp('#sum .l1 b', 28400, tTwenty, { prefix: '£', dur: 0.9 });
  rise('#sum .big1', tOne); countUp('#sum .big1 b', 1.09, tOne, { suffix: '%', dp: 2, sep: false, dur: 1.0 });
  /* B1-12: the comparison slides in under it */
  rise('#sum .v0', tQuoted);
  js.push(`tl.fromTo("#sum .arrow", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(tQuoted + 0.5)});`);
  rise('#sum .v1', tQuoted + 0.7);
  js.push(`tl.fromTo("#sum .tag2", { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, ${tDouble});`);
  sfx('pop', tDouble, 0.16);
  shotCam('B1-11', flat(1.0), flat(1.06, -50, 0), { when: tOne, target: focus(1.24, PX + 400, py + 400), hold: 1.4, back: flat(1.08, -60, 0) });
  shotCam('B1-12', flat(1.08, -60, 0), flat(1.1, -90, 0), { when: tDouble, target: focus(1.18, PX + 400, py + 540), hold: 1.2, back: flat(1.06, -50, 0) });
}

/* ---------- 12 · 0.70% flat costs less --- B1-13 + B1-14 (one panel) ---------- */
{
  const tNought = findWord('B1-13', 'nought'), tFlat = findWord('B1-13', 'flat'), tLess = findWord('B1-13', 'less');
  const tHundred = findWord('B1-14', 'hundred'), tHigher = findWord('B1-14', 'higher'), tLess2 = findWord('B1-14', 'less');
  const b = endOf('B1-14');
  const py = 96, ph = 690;
  glass('flatp', { start: r3(tNought - 0.2), dur: r3(b - tNought + 0.2), x: PX, y: py, w: PW, h: ph, enterFrom: 24,
    inner: `<div class="pad"><span class="th">the same month, two ways</span>
      <div class="head"><b>0.70%</b><span>flat, every card, no fees</span></div>
      <div class="hbars">
        <div class="hb h0"><em>quoted 0.50% + fees</em><div class="hbt"><i style="width:100%"></i></div><b>£308.46</b></div>
        <div class="hb h1"><em>0.70% flat</em><div class="hbt"><i style="width:64%"></i></div><b>£198.81</b></div>
      </div>
      <div class="save"><b>£109.65</b><span>a month cheaper on the higher headline rate</span></div></div>` });
  rise('#flatp .head', tNought); countUp('#flatp .head b', 0.7, tNought, { suffix: '%', dp: 2, sep: false, dur: 0.6 });
  arrive('#flatp .h0', tFlat + 0.2);
  js.push(`tl.fromTo("#flatp .h0 .hbt i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", immediateRender: false }, ${r3(tFlat + 0.3)});`);
  countUp('#flatp .h0 b', 308.46, tFlat + 0.3, { prefix: '£', dp: 2, dur: 0.9 });
  arrive('#flatp .h1', tLess);
  js.push(`tl.fromTo("#flatp .h1 .hbt i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", immediateRender: false }, ${r3(tLess + 0.1)});`);
  countUp('#flatp .h1 b', 198.81, tHundred, { prefix: '£', dp: 2, dur: 0.9 });
  js.push(`tl.fromTo("#flatp .h1 .hbt i", { scaleX: 1 }, { scaleX: 1.03, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tHigher});`);
  rise('#flatp .save', tLess2); countUp('#flatp .save b', 109.65, tLess2, { prefix: '£', dp: 2, dur: 0.8 });
  sfx('pop', tLess2, 0.16);
  shotCam('B1-13', flat(1.0), flat(1.06, -50, 0), { when: tLess, target: focus(1.18, PX + 380, py + 430), hold: 1.0, back: flat(1.06, -50, 0) });
  shotCam('B1-14', flat(1.06, -50, 0), flat(1.08, -70, 0), { when: tLess2, target: focus(1.18, PX + 380, py + 600), hold: 1.4, back: flat(1.06, -50, 0) });
}

/* ---------- 13 · the questions to ask --- B1-15 + B1-16 (one panel) ---------- */
{
  const tAsk = findWord('B1-15', 'ask'), tCredit = findWord('B1-15', 'credit'), tCompany = findWord('B1-15', 'company'), tAmex = findWord('B1-15', 'amex'), tPayout = findWord('B1-15', 'payout');
  const tPci = findWord('B1-16', 'pci'), tAccount = findWord('B1-16', 'account'), tMinimum = findWord('B1-16', 'minimum'), tEffective = findWord('B1-16', 'effective');
  const b = endOf('B1-16');
  const items = ['What do credit cards cost?', 'And business cards?', 'And American Express?', 'What does each payout cost?', 'Is there a PCI fee?', 'An account fee?', 'A minimum monthly charge?', 'So what is my effective rate?'];
  const py = 90, ph = 700;
  glass('ask', { start: r3(tAsk - 0.2), dur: r3(b - tAsk + 0.2), x: PX, y: py, w: PW, h: ph, enterFrom: 24,
    inner: `<div class="pad"><span class="th">ask any provider</span>${items.map((q, i) => `<div class="qrow k${i}${i === 7 ? ' last' : ''}"><i></i><span>${q}</span></div>`).join('')}</div>` });
  [tCredit, tCompany, tAmex, tPayout, tPci, tAccount, tMinimum, tEffective].forEach((when, i) => {
    arrive(`#ask .k${i}`, when, 30);
    js.push(`tl.fromTo("#ask .k${i} i", { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.2)", immediateRender: false }, ${r3(when + 0.25)});`);
  });
  shotCam('B1-15', flat(1.0), flat(1.06, -50, 0), { when: tPayout, target: focus(1.14, PX + 300, py + 380), hold: 0.8, back: flat(1.06, -50, 0) });
  shotCam('B1-16', flat(1.06, -50, 0), flat(1.08, -70, 0), { when: tEffective, target: focus(1.16, PX + 300, py + 640), hold: 1.2, back: flat(1.06, -50, 0) });
}

/* ---------- 14 · two minutes with a statement --- B1-17 ---------- */
{
  const tTwo = findWord('B1-17', 'two'), tCalc = findWord('B1-17', 'calculator');
  glass('two', { start: r3(tTwo - 0.1), dur: r3(endOf('B1-17') - tTwo + 0.1), x: PX + 120, y: 200, w: 640, h: 230, enterFrom: 20,
    inner: `<div class="pad twomin"><b>2 min</b><div><span>last month's statement</span><span class="c2">+ a calculator</span></div></div>` });
  rise('#two .c2', tCalc);
  shotCam('B1-17', flat(1.06, -30, 0), flat(1.0), null);
}

/* ---------- 15 · follow --- B1-18 ---------- */
{
  const tFollow = findWord('B1-18', 'follow');
  glass('follow', { start: r3(tFollow - 0.1), dur: r3(endOf('B1-18') - tFollow + 0.1), x: PX + 100, y: 220, w: 660, h: 170, enterFrom: 20,
    inner: `<div class="pad follow"><span class="mark"><b>Nero</b><em>Pay</em></span><span class="sub">more like this on the channel</span></div>` });
  shotCam('B1-18', flat(1.0), flat(1.05), null);
}

/* ---------- 16 · end card ---------- */
{
  const s = S['[END]'], a = s.start, d = s.dur;
  html.push(`<div id="end" class="clip card-full" data-start="${a}" data-duration="${d}" data-track-index="4">
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="p3d" style="left:${(W - 1100) / 2}px;top:${(H - 520) / 2}px;width:1100px;height:520px"><div class="float"><div class="idle"><div class="glass tglass" style="width:1100px;height:520px">
    <div class="body tstack end"><span class="wordmark"><b>Nero</b><em>Pay</em></span><span class="sub">Subscribe for more</span><span class="legal">Illustrative figures. No saving is guaranteed. NeroPay is a trading name of Nero Panda Ltd.</span></div><i class="sheen"></i></div></div></div></div></div>`);
  js.push(`tl.fromTo("#end", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .float", { autoAlpha: 0, rotationY: 12, z: -200, scale: 0.94, transformPerspective: 1800 }, { autoAlpha: 1, rotationY: 0, z: 0, scale: 1, duration: 1.1, ease: "power4.out", immediateRender: false }, ${r3(a + 0.25)});`);
  js.push(`tl.fromTo("#end .idle", { y: 0 }, { y: -6, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: 3, immediateRender: false }, ${r3(a + 0.25)});`);
  js.push(`tl.fromTo("#end .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.5, ease: "power2.inOut", repeat: 1, repeatDelay: 2, immediateRender: false }, ${r3(a + 0.8)});`);
  rise('#end .wordmark', a + 0.6); rise('#end .sub', a + 0.85); rise('#end .legal', a + 1.2);
  js.push(`tl.fromTo("#end .g1", { scale: 1.1, opacity: 0.4 }, { scale: 0.92, opacity: 0.55, duration: 3, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .g2", { scale: 0.9, opacity: 0.3 }, { scale: 1.1, opacity: 0.42, duration: 3, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  sfx('tick', a + 0.3, 0.16);
  move(a, r3(a + d), flat(1.04), flat(1.0), 'power1.out');
}

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
@font-face{font-family:Poppins;font-weight:500;src:url(assets/fonts/poppins-latin-500-normal.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:600;src:url(assets/fonts/poppins-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:700;src:url(assets/fonts/poppins-latin-700-normal.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:800;src:url(assets/fonts/poppins-latin-800-normal.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:700;font-style:italic;src:url(assets/fonts/poppins-latin-700-italic.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:800;font-style:italic;src:url(assets/fonts/poppins-latin-800-italic.woff2) format("woff2")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#141416}
body{font-family:Poppins,"Helvetica Neue",Arial,sans-serif;color:#fff;letter-spacing:-0.03em}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#141416}
#world{position:absolute;inset:0;transform-origin:50% 50%}
video.clip{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
.clip{position:absolute}
.p3d{position:absolute;perspective:1600px}
.float{position:absolute;inset:0;transform-style:preserve-3d}
.idle{position:absolute;inset:0}
/* liquid glass — blur on an oversized ::before clipped by the panel so the backdrop dissolves at
   the edges; even tint; the backdrop is dimmed so white and yellow type keep contrast; nothing on
   this element is ever transformed */
.glass{position:absolute;left:0;top:0;border-radius:36px;overflow:hidden;isolation:isolate;
  background:linear-gradient(135deg,rgba(255,255,255,.17) 0%,rgba(255,255,255,.09) 45%,rgba(255,255,255,.08) 60%,rgba(255,255,255,.15) 100%);
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(255,255,255,.18),inset 1px 0 0 rgba(255,255,255,.26),inset -1px 0 0 rgba(255,255,255,.14),0 40px 80px rgba(0,0,0,.40),0 6px 18px rgba(0,0,0,.24)}
.glass::before{content:"";position:absolute;inset:-60px;z-index:0;
  -webkit-backdrop-filter:blur(34px) saturate(125%) brightness(.52);backdrop-filter:blur(34px) saturate(125%) brightness(.52)}
.glass::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.22),inset 0 0 30px rgba(255,255,255,.06);
  background:radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,.20),transparent 55%),radial-gradient(80% 60% at 100% 100%,rgba(245,197,24,.10),transparent 60%)}
.glass .body{position:absolute;inset:0;z-index:3}
.sheen{position:absolute;top:-20%;left:0;width:45%;height:140%;display:block;pointer-events:none;z-index:1;
  background:linear-gradient(105deg,transparent 0%,rgba(255,255,255,.04) 35%,rgba(255,255,255,.18) 50%,rgba(255,255,255,.04) 65%,transparent 100%)}
.pad{height:100%;padding:38px 46px 34px;display:flex;flex-direction:column}
.th{display:block;font-size:24px;font-weight:500;letter-spacing:0;color:rgba(255,255,255,.72);margin-bottom:16px}
b.y,.y{color:${Y}}
/* name plate */
.plate{display:flex;align-items:center;gap:16px;padding:0 26px;height:100%}
.plate b{display:block;width:14px;height:14px;background:${Y};border-radius:4px;flex:none}
.plate strong{display:block;font-size:30px;font-weight:700;line-height:1.05}
.plate span{display:block;font-size:17px;font-weight:500;color:rgba(255,255,255,.85);margin-top:3px;letter-spacing:0}
/* hook chip */
.chip{display:flex;align-items:center;justify-content:center;gap:12px;height:100%}
.chip .big{display:block;font-size:118px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.chip .q{display:block;font-size:118px;font-weight:800;font-style:italic;color:${Y};line-height:1;transform-origin:50% 60%}
.chip .strike{position:absolute;left:62px;top:50%;width:340px;height:11px;margin-top:-6px;display:block;background:${Y};border-radius:6px;transform-origin:0 50%}
/* cards in their own 3D space: no backdrop blur (so they can rotate), solid frosted gradient */
.space{perspective:1500px;overflow:visible}
.orbit{position:absolute;inset:0;transform-style:preserve-3d;transform-origin:50% 55%}
.card{position:absolute;left:60px;top:220px;width:330px;height:208px;border-radius:26px;display:block;transform-style:preserve-3d;transform-origin:50% 50%;
  background:linear-gradient(135deg,rgba(255,255,255,.34),rgba(255,255,255,.14) 45%,rgba(255,255,255,.22));
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.7),inset 0 0 0 1px rgba(255,255,255,.22),0 30px 60px rgba(0,0,0,.45)}
.card .cchip{position:absolute;left:30px;top:30px;width:60px;height:44px;border-radius:9px;display:block;background:linear-gradient(135deg,${Y},#c99a0a)}
.card .cstripe{position:absolute;left:0;right:0;bottom:52px;height:28px;display:block;background:rgba(20,20,22,.5)}
.card .cname{position:absolute;left:30px;bottom:16px;font-size:18px;font-weight:700;letter-spacing:0.12em;color:rgba(255,255,255,.9)}
.card.c1 .cchip{background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(255,255,255,.55))}
.card.c2 .cchip{background:linear-gradient(135deg,#9ad0ff,#4b86c6)}
.card.c3 .cchip{background:linear-gradient(135deg,#ffd27a,${Y})}
#hand .tagwrap{position:absolute;left:60px;top:505px;width:500px;height:110px}
#hand .tag{width:500px;height:110px;border-radius:28px;font-size:40px;font-weight:600}
#hand .tag .body{display:flex;align-items:center;justify-content:center;gap:14px}
#hand .tag em{font-style:italic;font-weight:800;color:${Y}}
/* table */
.row{display:flex;align-items:center;justify-content:space-between;height:84px;padding:0 24px;border-radius:18px;font-size:36px;font-weight:600;margin-bottom:6px}
.row span{display:block}
.row b{display:block;font-size:44px;font-weight:800;letter-spacing:-0.04em;color:${Y};transform-origin:100% 50%}
/* ladder */
.bars{position:absolute;left:46px;right:46px;top:104px;bottom:34px;display:flex;align-items:flex-end;justify-content:space-between;gap:22px}
.bar{position:relative;flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:46px}
.bar i{display:block;width:100%;background:linear-gradient(180deg,${Y},#d9ab10);border-radius:16px 16px 8px 8px;transform-origin:50% 100%;box-shadow:inset 0 2px 0 rgba(255,255,255,.55)}
.bar b{position:absolute;left:0;right:0;text-align:center;font-size:34px;font-weight:800;letter-spacing:-0.04em;color:${Y}}
.bar span{position:absolute;bottom:0;display:block;font-size:24px;font-weight:500;color:rgba(255,255,255,.9)}
/* made-up month */
.stats{display:flex;gap:18px;margin-bottom:18px}
.stat{flex:1;display:flex;flex-direction:column;gap:2px}
.stat b{display:block;font-size:46px;font-weight:800;letter-spacing:-0.04em;color:${Y};line-height:1.05}
.stat span{display:block;font-size:20px;font-weight:500;color:rgba(255,255,255,.8);letter-spacing:0}
.split{display:flex;flex-direction:column;gap:9px}
.srow .lab{display:flex;justify-content:space-between;align-items:baseline;font-size:25px;font-weight:600}
.srow .lab b{font-size:30px;font-weight:800;color:${Y}}
.srow .track{position:relative;height:20px;margin-top:5px;border-radius:11px;background:rgba(255,255,255,.14);overflow:hidden}
.srow .track i{display:block;height:100%;border-radius:11px;background:linear-gradient(90deg,${Y},#ffd968);transform-origin:0 50%}
.srow .track em{position:absolute;right:10px;top:-1px;font-size:18px;font-weight:700;font-style:normal;color:rgba(20,20,22,.85);line-height:24px}
.srow.q0 .track em{color:rgba(20,20,22,.85)} .srow.q1 .track em,.srow.q2 .track em,.srow.q3 .track em{color:rgba(255,255,255,.9)}
.foot{display:block;margin-top:auto;font-size:18px;font-weight:500;color:rgba(255,255,255,.6);letter-spacing:0}
/* fixed charges */
.frow{display:flex;justify-content:space-between;align-items:center;height:74px;padding:0 20px;border-radius:18px;margin-bottom:6px}
.frow span{display:block;font-size:27px;font-weight:600}
.frow small{display:block;font-size:19px;font-weight:500;color:rgba(255,255,255,.7);letter-spacing:0}
.frow b{display:block;font-size:36px;font-weight:800;color:${Y};letter-spacing:-0.04em}
.ftotal{margin-top:auto;display:flex;align-items:baseline;gap:18px;padding-top:18px;border-top:2px solid rgba(255,255,255,.22)}
.ftotal span{font-size:24px;font-weight:500;color:rgba(255,255,255,.8)}
.ftotal b{font-size:50px;font-weight:800;color:${Y};letter-spacing:-0.04em}
.ftotal em{font-size:22px;font-style:italic;font-weight:700;color:rgba(255,255,255,.85);margin-left:auto}
/* formula */
.formula{justify-content:center}
.frac{display:flex;flex-direction:column;align-items:center;gap:10px;margin:8px 0 18px}
.frac .num,.frac .den{display:block;font-size:34px;font-weight:700;letter-spacing:0;text-align:center}
.frac .line{display:block;width:640px;height:5px;background:#fff;border-radius:3px;transform-origin:50% 50%}
.ops{display:flex;align-items:center;justify-content:center;gap:22px;font-size:40px;font-weight:600}
.ops .res{font-size:44px;font-weight:800;color:${Y};font-style:italic}
/* sum */
.sline{display:flex;justify-content:space-between;align-items:baseline;font-size:30px;font-weight:600;padding:8px 0}
.sline b{font-size:40px;font-weight:800;color:${Y};letter-spacing:-0.04em}
.big1{display:flex;flex-direction:column;align-items:flex-start;margin:6px 0 16px}
.big1 em{font-style:normal;font-size:22px;font-weight:500;color:rgba(255,255,255,.75);letter-spacing:0}
.big1 b{font-size:92px;font-weight:800;color:${Y};letter-spacing:-0.05em;line-height:1}
.vs{display:flex;align-items:center;gap:22px;margin-top:auto}
.vs > div{display:flex;flex-direction:column}
.vs em{font-style:normal;font-size:20px;font-weight:500;color:rgba(255,255,255,.7);letter-spacing:0.06em;text-transform:uppercase}
.vs b{font-size:54px;font-weight:800;letter-spacing:-0.04em;line-height:1.05}
.vs .v0 b{color:rgba(255,255,255,.85)} .vs .v1 b{color:${Y}}
.vs .arrow{display:block;flex:1;height:5px;background:${Y};border-radius:3px;transform-origin:0 50%;position:relative}
.vs .arrow::after{content:"";position:absolute;right:-2px;top:-9px;width:22px;height:22px;border-right:5px solid ${Y};border-top:5px solid ${Y};transform:rotate(45deg)}
.tag2{display:inline-block;align-self:flex-start;margin-top:16px;padding:8px 20px;border-radius:14px;background:${Y};color:#141416;font-size:26px;font-weight:800;font-style:italic;letter-spacing:-0.02em}
/* flat vs tiered */
.head{display:flex;align-items:baseline;gap:18px;margin-bottom:26px}
.head b{font-size:84px;font-weight:800;color:${Y};letter-spacing:-0.05em;line-height:1}
.head span{font-size:24px;font-weight:500;color:rgba(255,255,255,.8);letter-spacing:0}
.hbars{display:flex;flex-direction:column;gap:18px}
.hb em{display:block;font-style:normal;font-size:24px;font-weight:600;margin-bottom:8px}
.hb .hbt{height:38px;border-radius:14px;background:rgba(255,255,255,.12);overflow:hidden}
.hb .hbt i{display:block;height:100%;border-radius:14px;transform-origin:0 50%;background:rgba(255,255,255,.55)}
.hb.h1 .hbt i{background:linear-gradient(90deg,${Y},#ffd968)}
.hb b{display:block;margin-top:6px;font-size:40px;font-weight:800;letter-spacing:-0.04em}
.hb.h0 b{color:rgba(255,255,255,.85)} .hb.h1 b{color:${Y}}
.save{margin-top:auto;display:flex;align-items:baseline;gap:16px;padding-top:18px;border-top:2px solid rgba(255,255,255,.22)}
.save b{font-size:52px;font-weight:800;color:${Y};letter-spacing:-0.04em}
.save span{font-size:22px;font-weight:500;color:rgba(255,255,255,.8);letter-spacing:0}
/* questions */
.qrow{display:flex;align-items:center;gap:20px;height:68px;font-size:28px;font-weight:600}
.qrow i{display:block;flex:none;width:34px;height:34px;border-radius:50%;background:${Y};position:relative;transform-origin:50% 50%}
.qrow i::after{content:"";position:absolute;left:12px;top:6px;width:8px;height:16px;border-right:4px solid #141416;border-bottom:4px solid #141416;transform:rotate(45deg)}
.qrow.last span{color:${Y};font-weight:800;font-style:italic}
/* two minutes + follow */
.twomin{flex-direction:row;align-items:center;gap:26px}
.twomin b{font-size:84px;font-weight:800;color:${Y};letter-spacing:-0.05em;line-height:1}
.twomin div{display:flex;flex-direction:column;gap:4px}
.twomin span{display:block;font-size:28px;font-weight:600}
.twomin .c2{color:rgba(255,255,255,.85)}
.follow{flex-direction:row;align-items:center;gap:26px;padding:0 40px}
.mark{display:block;font-size:64px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.mark em,.wordmark em{font-style:normal;color:${Y}}
.follow .sub{display:block;font-size:26px;font-weight:500;color:rgba(255,255,255,.85);padding-left:24px;border-left:2px solid rgba(255,255,255,.3);letter-spacing:0}
/* title + end cards */
.card-full{left:0;top:0;width:${W}px;height:${H}px;background:#141416;overflow:hidden}
.glow{position:absolute;width:1200px;height:1200px;border-radius:50%;display:block;filter:blur(40px);pointer-events:none}
.glow.g1{left:-300px;top:-450px;background:radial-gradient(circle,rgba(245,197,24,.28),transparent 62%)}
.glow.g2{right:-400px;bottom:-500px;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 62%)}
.tstack{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center}
.kicker{display:block;font-size:26px;font-weight:500;letter-spacing:0.38em;color:rgba(255,255,255,.66);padding-left:0.38em}
.wordmark{display:block;font-size:220px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.tstack .ep{display:block;font-size:32px;font-weight:500;letter-spacing:-0.01em;color:rgba(255,255,255,.72);margin-top:4px}
.tstack.end .wordmark{font-size:150px}
.tstack .sub{display:block;font-size:52px;font-weight:600}
.tstack .legal{display:block;max-width:900px;font-size:24px;font-weight:500;color:rgba(255,255,255,.62);margin-top:26px;letter-spacing:0}
#floor{position:absolute;left:0;right:0;bottom:0;height:300px;pointer-events:none;background:linear-gradient(180deg,rgba(10,10,12,0) 0%,rgba(10,10,12,.28) 45%,rgba(10,10,12,.5) 100%)}
/* captions: no plate, no shadow, tight Poppins, yellow on the spoken word */
.cap{left:0;right:0;width:${W}px;bottom:118px;display:flex;justify-content:center;pointer-events:none}
.cap .line{max-width:1500px;text-align:center;font-size:56px;font-weight:600;line-height:1.16;letter-spacing:-0.035em;text-wrap:balance}
.cap .w{display:inline-block;color:rgba(255,255,255,.86);margin:0 0.03em}
.cap .w.em{font-style:italic;font-weight:800;font-size:1.06em}
</style>
</head>
<body>
<div id="root" data-composition-id="b1" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
  <div id="world">
${html.filter((h) => !/class="clip cap"/.test(h)).map((h) => '    ' + h).join('\n')}
  </div>
  <div id="floor"></div>
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
  window.__timelines["b1"] = tl;
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'index.html'), page);
console.log('index.html — ' + TOTAL + 's, ' + segs.length + ' segments, ' + WORDLIST.length + ' words, ' + cam.length + ' camera moves' + (estimated.length ? ' — word timing ESTIMATED for ' + estimated.join(', ') : ''));
segs.forEach((s) => console.log('  ' + s.id.padEnd(9) + String(s.start).padStart(8) + 's  ' + s.dur + 's'));

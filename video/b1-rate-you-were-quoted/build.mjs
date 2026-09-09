/* Generates index.html for B1 "The rate you were quoted" from the clips on disk, the Whisper word
   timings and the hand trims. Run it again whenever a clip, a timing or a trim changes:

     node cut.mjs              → tightens every clip (assets/cut, data/cuts.json)
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
const W = 1920, H = 1080, FPS = 30, Y = '#F5C518', INK = '#141416';
const WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'data/words.json'), 'utf8'));
const SCRIPT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/script.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/edit.json'), 'utf8'));
const CUTS = fs.existsSync(path.join(HERE, 'data/cuts.json')) ? JSON.parse(fs.readFileSync(path.join(HERE, 'data/cuts.json'), 'utf8')) : null;
const SOUNDS = JSON.parse(fs.readFileSync(path.join(HERE, '../library/sounds.json'), 'utf8'));
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
const BEAT = 60 / SOUNDS.sounds.music.bpm, BAR2 = 2 * BEAT;     // the music grid the cards move on
const CARD = { '[TITLE]': r3(6 * BEAT), '[END]': 18.0 };
const XF = 0.4;                        // crossfade into and out of the title card
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
  segs.push({ id, kind: 'clip', start: r3(t), dur: d, mediaStart: inn, words, src: (useCut ? 'assets/cut/' : 'assets/clips/') + id + '.mp4' });
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

/* ---------- glass ----------
   The glass is not a backdrop-filter any more (LESSONS.md #27). Every panel shows the footage through
   itself by carrying its own copy of the clip — the 480×270 blurred copy cut.mjs writes next to each
   cut clip — positioned so it lines up with the frame underneath, clipped by the panel's own rounded
   box. So the blur edge is the panel edge at every frame, the whole slab (blur, tint, rim, content)
   fades as one thing, and any transform is safe: nothing is sampled from behind. A slab that tilts a
   few degrees carries its blurred picture with it; at this blur radius that is invisible.

   Structure: .panel (untimed wrapper — a timed <video> may not sit inside a timed element) >
   .float (fade, lean, drift) > .glass (clip) > .bg (the copy) + .tint + .sheen + .body + .rim.

   Choreography, from Faisal's third review: the panel arrives flat and empty (a fade, a small rise);
   at `cueAt` — the moment she starts on the graphic — the heading rises, the slab leans into 3D and
   the camera zooms, together; the rest of the data arrives on its words; the exit is one fade with
   the lean coming off, and a hard kill on the last frame. */
const clipsIn = (start, end) => segs.filter((s) => s.kind === 'clip' && Math.min(end, r3(s.start + s.dur)) - Math.max(start, s.start) > 0.04);
function bgFor(id, start, end, x, y) {
  const vids = clipsIn(start, end).map((s) => {
    const a = r3(Math.max(start, s.start)), b = r3(Math.min(end, s.start + s.dur));
    const blur = s.src.replace(/\.mp4$/, '.blur.mp4'), has = fs.existsSync(path.join(HERE, blur));
    return `<video id="bg-${id}-${s.id}" class="bgv ${has ? 'lo' : 'hi'}" src="${has ? blur : s.src}" data-start="${a}" data-duration="${r3(b - a)}" data-media-start="${r3(s.mediaStart + a - s.start)}" data-track-index="1" muted playsinline></video>`;
  });
  return `<div class="bg" style="left:${-x}px;top:${-y}px">${vids.join('')}</div>`;
}
const PANEL = {};
function glass(id, { start, dur: life, x, y, w, h, inner, cueAt, lean = -6, quiet = false, light = false, radius = 36 }) {
  start = r3(start); const end = r3(start + life);
  const c = r3(cueAt == null ? start : Math.max(cueAt, start));
  html.push(`<div id="${id}" class="panel p3d" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
  <div class="float"><div class="glass${light ? ' lglass' : ''}" style="width:${w}px;height:${h}px;border-radius:${radius}px">${light ? '' : bgFor(id, start, end, x, y)}<i class="tint"></i><i class="sheen"></i><div class="body">${inner}</div><i class="rim"></i></div></div></div>`);
  js.push(`tl.fromTo("#${id} .float", { autoAlpha: 0, y: 16, scale: 0.985, transformPerspective: 1600 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power2.out", immediateRender: false }, ${start});`);
  if (lean) {
    const rx = lean < 0 ? 2.5 : -2.5;
    js.push(`tl.fromTo("#${id} .float", { rotationY: 0, rotationX: 0 }, { rotationY: ${lean}, rotationX: ${rx}, duration: 0.9, ease: "power3.out", immediateRender: false }, ${c});`);
    js.push(`tl.fromTo("#${id} .float", { rotationY: ${lean}, rotationX: ${rx} }, { rotationY: 0, rotationX: 0, duration: 0.5, ease: "power2.in", immediateRender: false }, ${r3(end - 0.5)});`);
  }
  js.push(`tl.fromTo("#${id} .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.3, ease: "power2.inOut", immediateRender: false }, ${r3(c + 0.05)});`);
  js.push(`tl.fromTo("#${id} .float", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: 0.45, ease: "power2.in", immediateRender: false }, ${r3(end - 0.45)});`);
  js.push(`tl.set("#${id} .float", { autoAlpha: 0 }, ${end});`);
  if (/class="th cue"/.test(inner)) rise(`#${id} .th`, c, 14);
  if (!quiet) { sfx('whoosh', r3(start - 0.05), 0.14); if (c > start + 0.3) sfx('swish', c, 0.1); }
  return (PANEL[id] = { start, end, bottom: y + h, cue: c });
}
/* a row / line inside a panel arriving on its word (starts hidden through .cue) */
const arrive = (sel, when, dx = 36) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, x: ${dx} }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
const rise = (sel, when, dy = 22) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, y: ${dy} }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
const leave = (sel, when, dy = -16) => js.push(`tl.fromTo("${sel}", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: ${dy}, duration: 0.42, ease: "power2.in", immediateRender: false }, ${r3(when)});
  tl.set("${sel}", { autoAlpha: 0 }, ${r3(when + 0.42)});`);
/* a figure counting up to its value as it is said (stat count-up; the value is a function of time) */
let cu = 0;
function countUp(sel, to, when, { from = 0, dur: d = 0.9, prefix = '', suffix = '', dp = 0, sep = true } = {}) {
  const v = 'cu' + (cu++);
  js.push(`const ${v} = { n: ${from} }, ${v}el = document.querySelector("${sel}");
  const ${v}f = () => { const n = ${v}.n; const s = n.toFixed(${dp}); ${v}el.textContent = "${prefix}" + (${sep} ? s.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : s) + "${suffix}"; };
  ${v}f();
  tl.fromTo(${v}, { n: ${from} }, { n: ${to}, duration: ${d}, ease: "power2.out", onUpdate: ${v}f, immediateRender: false }, ${r3(when)});`);
}
/* Sound: every file comes from video/library (sounds.json, CC0 from Freesound, normalised to -3 dBFS
   by fetch-sounds.mjs) and sits in assets/sfx as <role>.m4a. Volumes here are the mix. */
const SFXDUR = {}; let sfxN = 0;
function sfx(role, start, vol, maxLen) {
  const file = path.join(HERE, 'assets/sfx', role + '.m4a');
  if (!fs.existsSync(file)) throw new Error('missing sound ' + role + ' — run ../library/fetch-sounds.mjs');
  if (!SFXDUR[role]) SFXDUR[role] = dur(file);
  const d = maxLen ? Math.min(SFXDUR[role], maxLen) : SFXDUR[role];
  const s = Math.max(0, r3(start));
  audio.push(`<audio id="sfx-${role}-${Math.round(s * 100)}" src="assets/sfx/${role}.m4a" data-start="${s}" data-duration="${r3(Math.min(d, TOTAL - s))}" data-track-index="${12 + (sfxN++)}" data-volume="${vol}"></audio>`);
}

/* ---------- cards ----------
   A card is a small glass slab in a real 3D space (.space > .orbit preserve-3d): eight thin layers behind
   the face give it a body you see on the rotated side, the face carries its own blurred copy of the
   footage under a dense frost, a metal chip, a band and one static highlight. No drop shadow. */
function cardHtml(id, i, start, end, wx, wy) {
  const edges = [1, 2, 3, 4, 5, 6, 7, 8].map((k) => `<i class="edge" style="transform:translateZ(${-2 * k}px)"></i>`).join('');
  return `<div class="card c${i} cue">${edges}<div class="face">${bgFor(id + 'c' + i, start, end, wx, wy)}<i class="ctint"></i><i class="cband"></i><i class="cchip"></i><i class="cshine"></i><i class="crim"></i></div></div>`;
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
/* focus on a panel: the point is raised so the panel's bottom edge stays above the captions (LESSONS.md #15) */
const pf = (id, S_, px, py) => { const g = PANEL[id]; const lim = g ? g.bottom - 300 / S_ : py; return focus(S_, px, Math.max(py, lim)); };
const bump = (c, d = 0.02) => ({ scale: r3(c.scale + d), x: c.x, y: c.y });
/* a run of camera points inside one clip: each time is clamped to the clip, zero-length legs are dropped,
   so a cue near the end of a take (or a shorter placeholder) can never make segments overlap */
function chain(id, pts) {
  const a = S[id].start, b = endOf(id);
  const P = pts.map((p) => ({ t: r3(Math.min(Math.max(p.t, a), b)), c: p.c, ease: p.ease || 'power2.inOut' }));
  for (let i = 1; i < P.length; i++) P[i].t = Math.max(P[i].t, P[i - 1].t);      // never run backwards
  let last = P[0];
  for (let i = 1; i < P.length; i++) { if (P[i].t - last.t >= 0.05) { move(last.t, P[i].t, last.c, P[i].c, P[i].ease); last = P[i]; } }
}
/* the standard run on a panel: flat until the cue, zoom onto the panel with the lean, walk the points she
   names, hold, and pull back over the last stretch of the clip */
const hold = (t, c) => ({ t, c: bump(c), ease: 'none' });

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

const PX = 1110, PW = 760;   // right column, clear of Ava
const LX = 50;               // left column — where she points

/* ---------- 1 · hook: 0.5%? --- B1-01 ---------- */
{
  const s = S['B1-01'], a = s.start, b = endOf('B1-01');
  glass('plate', { start: a, dur: 3.2, x: 72, y: 72, w: 300, h: 92, lean: 0, quiet: true, radius: 24,
    inner: `<div class="plate cue"><b></b><div><strong>Ava</strong><span>NeroPay</span></div></div>` });
  rise('#plate .plate', a + 0.15, 10);
  const tMaybe = findWord('B1-01', 'maybe'), tCent = findWord('B1-01', 'cent'), tNot = findWord('B1-01', 'not');
  const cx = 1200, cy = 220, cw = 460, ch = 210;
  glass('chip', { start: tMaybe - 0.55, dur: r3(b - tMaybe + 0.55), x: cx, y: cy, w: cw, h: ch, cueAt: tMaybe, lean: -7,
    inner: `<div class="chip"><span class="big cue">0.5%</span><span class="q cue">?</span><i class="strike"></i></div>` });
  rise('#chip .big', tMaybe, 18);
  js.push(`tl.set("#chip .strike", { scaleX: 0, rotation: -8 }, ${r3(tMaybe - 0.55)});`);
  js.push(`tl.fromTo("#chip .q", { autoAlpha: 0, scale: 0.4, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, ${tCent});`);
  js.push(`tl.fromTo("#chip .strike", { scaleX: 0, rotation: -8 }, { scaleX: 1, rotation: -8, duration: 0.4, ease: "power3.inOut", immediateRender: false }, ${tNot});`);
  js.push(`tl.fromTo("#chip .big", { color: "#ffffff" }, { color: "rgba(255,255,255,0.5)", duration: 0.4, immediateRender: false }, ${tNot});`);
  sfx('pop', tCent, 0.16); sfx('swish', tNot, 0.14);
  const f1 = focus(1.16, cx + cw / 2 - 100, cy + ch / 2 + 110), f2 = focus(1.22, cx + cw / 2 - 120, cy + ch / 2 + 90);
  chain('B1-01', [{ t: a, c: flat(1.0) }, { t: tMaybe, c: flat(1.02) }, { t: tMaybe + 0.9, c: f1, ease: 'power3.out' }, hold(tNot, f1), { t: tNot + 0.5, c: f2, ease: 'power3.out' }, hold(b - 0.45, f2), { t: b, c: flat(1.06) }]);
}

/* ---------- 2 · one card, then a lot more --- B1-02 ---------- */
{
  const s = S['B1-02'], a = s.start, b = endOf('B1-02');
  const tOne = findWord('B1-02', 'one'), tMore = findWord('B1-02', 'more');
  const FX = 1120, FY = 120;
  const cards = [0, 1, 2, 3].map((i) => cardHtml('fan', i, tOne, b, FX + 60, FY + 220)).join('');
  html.push(`<div id="fan" class="space" style="left:${FX}px;top:${FY}px;width:720px;height:560px"><div class="orbit">${cards}</div></div>`);
  /* the first card lands from depth; three more slide out behind it into their own 3D space */
  js.push(`tl.fromTo("#fan .c0", { autoAlpha: 0, z: -420, rotationY: 44, rotationX: 12, y: 40 }, { autoAlpha: 1, z: 0, rotationY: -14, rotationX: 6, y: 0, duration: 0.9, ease: "power3.out", immediateRender: false }, ${tOne});`);
  [1, 2, 3].forEach((i) => {
    js.push(`tl.fromTo("#fan .c${i}", { autoAlpha: 0, x: 0, y: 0, z: -60, rotationY: -14, rotationX: 6, rotationZ: 0 }, { autoAlpha: 1, x: ${i * 92}, y: ${-i * 54}, z: ${-i * 90}, rotationY: -14, rotationX: 6, rotationZ: ${i * 4}, duration: 0.75, ease: "power3.out", immediateRender: false }, ${r3(tMore + (i - 1) * 0.12)});`);
  });
  js.push(`tl.fromTo("#fan .orbit", { rotationY: -5 }, { rotationY: 5, duration: ${r3(b - tOne)}, ease: "sine.inOut", immediateRender: false }, ${tOne});`);
  /* ease out: the fan fades as one thing while it drifts up a touch — no sink, no jump */
  js.push(`tl.fromTo("#fan .orbit", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -18, duration: 0.55, ease: "power2.inOut", immediateRender: false }, ${r3(b - 0.55)});`);
  js.push(`tl.set("#fan .orbit", { autoAlpha: 0 }, ${b});`);
  sfx('pop', tOne, 0.16); sfx('whoosh', r3(tMore - 0.05), 0.15);
  const f1 = focus(1.12, 1420, 400);
  chain('B1-02', [{ t: a, c: flat(1.06, 40, 0) }, { t: tOne, c: flat(1.04, 20, 0) }, { t: tMore + 0.7, c: f1, ease: 'power3.out' }, hold(b - 0.55, f1), { t: b, c: flat(1.05, -30, 0) }]);
}

/* ---------- 3 · Ava's line --- B1-INTRO ---------- */
{
  const a = S['B1-INTRO'].start, b = endOf('B1-INTRO');
  move(a, r3(b - XF), flat(1.0), flat(1.06), 'power1.inOut');
}

/* ---------- 4 · title card (light: white ground, blurred yellow; "Pay" is yellow from its first frame) ---------- */
{
  const s = S['[TITLE]'], a = r3(s.start - XF), d = r3(s.dur + 2 * XF);
  const land = r3(a + XF * 0.5 + 0.55);       // the glass settles here; the riser crests on it
  html.push(`<div id="title" class="clip card-full light" data-start="${a}" data-duration="${d}" data-track-index="4">
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <div class="p3d" style="left:${(W - 1320) / 2}px;top:${(H - 600) / 2}px;width:1320px;height:600px"><div class="float"><div class="glass lglass" style="width:1320px;height:600px"><i class="tint"></i><i class="sheen"></i>
    <div class="body tstack"><span class="kicker cue">EXPLAINED BY</span><span class="wordmark cue"><b>Nero</b><em>Pay</em></span><span class="ep cue">Why the rate you were quoted isn't the rate you pay</span></div><i class="rim"></i></div></div></div></div>`);
  js.push(`tl.fromTo("#title", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${XF}, ease: "power2.inOut" }, ${a});`);
  js.push(`tl.fromTo("#title", { autoAlpha: 1 }, { autoAlpha: 0, duration: ${XF}, ease: "power2.inOut", immediateRender: false }, ${r3(a + d - XF)});`);
  js.push(`tl.set("#title", { autoAlpha: 0 }, ${r3(a + d)});`);
  js.push(`tl.fromTo("#floor", { autoAlpha: 1 }, { autoAlpha: 0, duration: ${XF}, immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#floor", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${XF}, immediateRender: false }, ${r3(a + d - XF)});`);
  js.push(`tl.fromTo("#title .float", { autoAlpha: 0, rotationX: 14, y: 90, z: -320, scale: 0.9, transformPerspective: 1800 }, { autoAlpha: 1, rotationX: 0, y: 0, z: 0, scale: 1, duration: 1.15, ease: "power4.out", immediateRender: false }, ${r3(a + XF * 0.5)});`);
  js.push(`tl.fromTo("#title .float", { rotationY: 0 }, { rotationY: -4, duration: ${r3(d - 1.2)}, ease: "sine.inOut", immediateRender: false }, ${r3(a + 0.9)});`);
  js.push(`tl.fromTo("#title .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.6, ease: "power2.inOut", immediateRender: false }, ${r3(land + 0.1)});`);
  rise('#title .kicker', land - 0.1); rise('#title .wordmark', land, 34); rise('#title .ep', land + BEAT * 0.5, 18);
  sfx('riser', r3(land - SOUNDS.sounds.riser.duration), 0.26);
  sfx('impact', land, 0.28);
  sfx('music-intro', a, 0.34);
  move(a, r3(a + d - XF), flat(1.05), flat(1.0), 'power1.inOut');
}

/* ---------- 5 · the rate ladder --- B1-03 + B1-04 (one panel, one bar per card as she names it) ---------- */
{
  const a3 = S['B1-03'].start, b3 = endOf('B1-03'), a4 = S['B1-04'].start, b4 = endOf('B1-04');
  const tAdv = findWord('B1-03', 'advertised'), tDebit = findWord('B1-03', 'debit'), tCheap = findWord('B1-03', 'cheapest');
  const tCredit = findWord('B1-04', 'credit'), tCompany = findWord('B1-04', 'company'), tAmex = findWord('B1-04', 'amex'), tOver = findWord('B1-04', 'overseas'), tMost = findWord('B1-04', 'most');
  const bars = [['Debit', 0.5, 0.18, tDebit], ['Credit', 1.2, 0.42, tCredit], ['Business', 2.6, 0.86, tCompany], ['Amex', 1.75, 0.6, tAmex], ['Overseas', 2.9, 0.96, tOver]];
  const ly = 110, lh = 600;
  glass('ladder', { start: Math.max(a3, tAdv - 0.7), dur: r3(b4 - Math.max(a3, tAdv - 0.7)), x: PX, y: ly, w: PW, h: lh, cueAt: tAdv, lean: -7,
    inner: `<div class="pad"><span class="th cue">the advertised rate, by card</span><div class="bars">${bars.map(([n, v, h], i) => `<div class="bar b${i} cue"><b>0.00%</b><div class="col" style="height:${Math.round(h * 100)}%"><i class="base"></i><i class="fill"></i></div><span>${n}</span></div>`).join('')}</div></div>` });
  bars.forEach(([, val, , when], i) => {
    js.push(`tl.fromTo("#ladder .b${i}", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.25, immediateRender: false }, ${r3(when)});`);
    js.push(`tl.fromTo("#ladder .b${i} .col", { scaleY: 0 }, { scaleY: 1, duration: 0.85, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
    countUp(`#ladder .b${i} b`, val, when, { dur: 0.85, suffix: '%', dp: 2, sep: false });
    js.push(`tl.fromTo("#ladder .b${i} b", { y: 14 }, { y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
    /* the bar she has moved on from turns grey; only the one she is naming is yellow */
    if (i > 0) {
      js.push(`tl.fromTo("#ladder .b${i - 1} .fill", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.45, ease: "power2.inOut", immediateRender: false }, ${r3(when)});`);
      js.push(`tl.fromTo("#ladder .b${i - 1} b", { color: "${Y}" }, { color: "rgba(255,255,255,0.55)", duration: 0.45, immediateRender: false }, ${r3(when)});`);
    }
    sfx('swish', when, 0.15);
  });
  js.push(`tl.fromTo("#ladder .b4 .col", { scaleY: 1 }, { scaleY: 1.04, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tMost});`);
  js.push(`tl.fromTo("#ladder .b3 .fill", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, immediateRender: false }, ${tMost});`);
  js.push(`tl.fromTo("#ladder .b3 b", { color: "rgba(255,255,255,0.55)" }, { color: "${Y}", duration: 0.4, immediateRender: false }, ${tMost});`);
  const barX = (i) => PX + 46 + (PW - 92) * (i + 0.5) / 5;
  const c0 = pf('ladder', 1.12, PX + PW / 2, ly + 320), c0b = pf('ladder', 1.2, barX(0) + 120, ly + 480);
  chain('B1-03', [{ t: a3, c: flat(1.0) }, { t: tAdv - 0.1, c: flat(1.02) }, { t: tAdv + 0.9, c: c0, ease: 'power3.out' }, hold(tDebit, c0), { t: tDebit + 0.7, c: c0b, ease: 'power3.out' }, hold(b3, c0b)]);
  /* B1-04: the camera walks the ladder with her — credit, company, then up to the most expensive */
  const c1 = pf('ladder', 1.14, barX(1) + 60, ly + 400), c2 = pf('ladder', 1.18, barX(2), ly + 330), c4 = pf('ladder', 1.2, barX(4) - 90, ly + 300), c4b = pf('ladder', 1.24, barX(4) - 110, ly + 280);
  chain('B1-04', [
    { t: a4, c: bump(c0b) }, { t: tCredit + 0.6, c: c1, ease: 'power1.inOut' }, { t: tCompany + 0.7, c: c2, ease: 'power3.out' },
    hold(tAmex, c2), { t: tOver + 0.6, c: c4 }, { t: tMost + 0.5, c: c4b, ease: 'power2.out' },
    hold(b4 - 0.9, c4b), { t: b4, c: flat(1.06, -50, 0) }]);
}

/* ---------- 6 · their card, your rate --- B1-05 ---------- */
{
  const s = S['B1-05'], a = s.start, b = endOf('B1-05');
  const tWhat = findWord('B1-05', 'whatever'), tPocket = findWord('B1-05', 'pocket'), tRate = findWord('B1-05', 'rate');
  const HX = 1120, HY = 80, c0 = r3(Math.max(a, tWhat - 0.3));
  const cards = [0, 1, 2, 3].map((i) => cardHtml('hand', i, c0, b, HX + 60, HY + 220)).join('');
  const TX = HX + 60, TY = HY + 505;
  html.push(`<div id="hand" class="space" style="left:${HX}px;top:${HY}px;width:740px;height:640px"><div class="orbit">${cards}<div class="tagwrap cue"><div class="glass tag" style="width:500px;height:110px;border-radius:28px">${bgFor('tag', c0, b, TX, TY)}<i class="tint"></i><i class="sheen"></i><div class="body"><span>their card.</span><em>your rate.</em></div><i class="rim"></i></div></div></div></div>`);
  [0, 1, 2, 3].forEach((i) => js.push(`tl.fromTo("#hand .c${i}", { autoAlpha: 0, y: 140, z: -340, rotationY: 34, rotationX: 10, rotationZ: 0, x: 0 }, { autoAlpha: 1, y: ${-i * 40}, x: ${i * 86}, z: ${-i * 70}, rotationY: -12, rotationX: 8, rotationZ: ${-10 + i * 7}, duration: 0.8, ease: "power3.out", immediateRender: false }, ${r3(c0 + i * 0.1)});`));
  /* on "pocket" the fourth card comes forward, upright, in front; the rest sink back */
  js.push(`tl.fromTo("#hand .c3", { x: 258, y: -120, z: -210, rotationZ: 11, rotationY: -12, rotationX: 8, scale: 1 }, { x: 150, y: 40, z: 160, rotationZ: 0, rotationY: -4, rotationX: 4, scale: 1.25, duration: 0.8, ease: "power3.inOut", immediateRender: false }, ${tPocket});`);
  [0, 1, 2].forEach((i) => js.push(`tl.fromTo("#hand .c${i}", { autoAlpha: 1 }, { autoAlpha: 0.45, duration: 0.5, ease: "power2.inOut", immediateRender: false }, ${tPocket});`));
  js.push(`tl.fromTo("#hand .tagwrap", { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(tRate - 0.1)});`);
  js.push(`tl.fromTo("#hand .tag .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.0, ease: "power2.inOut", immediateRender: false }, ${r3(tRate + 0.2)});`);
  js.push(`tl.fromTo("#hand .orbit", { rotationY: 4 }, { rotationY: -4, duration: ${r3(b - c0)}, ease: "sine.inOut", immediateRender: false }, ${c0});`);
  js.push(`tl.fromTo("#hand .orbit", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -18, duration: 0.55, ease: "power2.inOut", immediateRender: false }, ${r3(b - 0.55)});`);
  js.push(`tl.set("#hand .orbit", { autoAlpha: 0 }, ${b});`);
  sfx('whoosh', c0, 0.15); sfx('pop', tPocket, 0.16); sfx('tick', r3(tRate - 0.1), 0.2);
  const f1 = focus(1.1, 1480, 420), f2 = focus(1.2, 1500, 400);
  chain('B1-05', [{ t: a, c: flat(1.0) }, { t: c0 + 0.8, c: f1, ease: 'power2.out' }, { t: tPocket + 0.6, c: f2, ease: 'power3.out' }, hold(b - 0.55, f2), { t: b, c: flat(1.04) }]);
}

/* ---------- 7 · a made-up month --- B1-06 + the statement --- B1-07 (one panel, on the left where she points) ---------- */
{
  const a6 = S['B1-06'].start, b6 = endOf('B1-06'), a7 = S['B1-07'].start, b7 = endOf('B1-07');
  const tHere = findWord('B1-06', 'here'), tTwenty = findWord('B1-06', 'twenty'), tSeven = findWord('B1-06', 'seven'), tNought = findWord('B1-06', 'nought');
  const t70 = findWord('B1-07', 'seventy'), tCred = findWord('B1-07', 'credit'), tComp = findWord('B1-07', 'company'), tOver = findWord('B1-07', 'overseas');
  const rows = [['Consumer debit', 71, '0.50%'], ['Consumer credit', 20, '1.20%'], ['Business / commercial', 5, '2.60%'], ['International / non-UK', 2, '2.90%']];
  const py = 96, ph = 690, st = r3(Math.max(a6, tHere - 0.6));
  glass('month', { start: st, dur: r3(b7 - st), x: LX, y: py, w: PW, h: ph, cueAt: tHere, lean: 7,
    inner: `<div class="pad"><span class="th cue">a made-up month, one restaurant</span>
      <div class="stats"><div class="stat s0 cue"><b>£0</b><span>card turnover</span></div><div class="stat s1 cue"><b>0</b><span>card payments</span></div><div class="stat s2 cue"><b>0.00%</b><span>the quoted rate</span></div></div>
      <div class="split">${rows.map(([n, pct, r], i) => `<div class="srow q${i} cue"><div class="lab"><span>${n}</span><b>${r}</b></div><div class="track"><i style="width:${pct}%"></i><em>${pct}%</em></div></div>`).join('')}</div>
      <span class="foot cue">Illustrative example, not a real statement.</span></div>` });
  rise('#month .s0', tTwenty); countUp('#month .s0 b', 28400, tTwenty, { prefix: '£', dur: 1.0 }); sfx('tick', tTwenty, 0.18);
  rise('#month .s1', tSeven); countUp('#month .s1 b', 780, tSeven, { dur: 0.8 }); sfx('tick', tSeven, 0.18);
  rise('#month .s2', tNought); countUp('#month .s2 b', 0.5, tNought, { suffix: '%', dp: 2, sep: false, dur: 0.6 }); sfx('tick', tNought, 0.18);
  [t70, tCred, tComp, tOver].forEach((when, i) => {
    arrive(`#month .q${i}`, when, -36);
    js.push(`tl.fromTo("#month .q${i} .track i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", immediateRender: false }, ${r3(when + 0.1)});`);
    js.push(`tl.fromTo("#month .q${i} .track em", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, ${r3(when + 0.5)});`);
    sfx('swish', when, 0.13);
  });
  rise('#month .foot', tOver + 0.6);
  const m0 = pf('month', 1.12, LX + PW / 2, py + 320), m1 = pf('month', 1.14, LX + 240, py + 300), m2 = pf('month', 1.14, LX + PW / 2, py + 420), m3 = pf('month', 1.16, LX + PW - 200, py + 520);
  chain('B1-06', [{ t: a6, c: flat(1.0) }, { t: tHere - 0.1, c: flat(1.02) }, { t: tHere + 0.9, c: m0, ease: 'power3.out' }, hold(tTwenty, m0), { t: tTwenty + 0.7, c: m1, ease: 'power3.out' }, hold(b6, m1)]);
  chain('B1-07', [{ t: a7, c: bump(m1) }, { t: t70 + 0.6, c: m2 }, hold(tOver, m2), { t: tOver + 0.6, c: m3, ease: 'power3.out' }, hold(b7 - 0.6, m3), { t: b7, c: flat(1.06, 40, 0) }]);
}

/* ---------- 8 · the charges that aren't a percentage --- B1-08 + B1-09 (one panel) ---------- */
{
  const a8 = S['B1-08'].start, b8 = endOf('B1-08'), a9 = S['B1-09'].start, b9 = endOf('B1-09');
  const tCharges = findWord('B1-08', 'charges'), tFour = findWord('B1-08', 'four'), tSeventeen = findWord('B1-08', 'seventeen'), tPci = findWord('B1-08', 'pci');
  const tAccount = findWord('B1-09', 'account'), tPayout = findWord('B1-09', 'payout'), tOwn = findWord('B1-09', 'own');
  const rows = [['Authorisation fees', '780 × 4p', 31.2], ['Terminal rental', 'monthly', 17.5], ['PCI compliance fee', 'monthly', 9.95], ['Account fee', 'monthly', 5], ['Payout fees', 'every time they pay you', 12]];
  const py = 96, ph = 680;
  glass('fixed', { start: a8, dur: r3(b9 - a8), x: PX, y: py, w: PW, h: ph, cueAt: tCharges, lean: -7,
    inner: `<div class="pad"><span class="th cue">the charges that aren't a percentage</span>
      ${rows.map(([n, how, v], i) => `<div class="frow f${i} cue"><div><span>${n}</span><small>${how}</small></div><b>£0.00</b></div>`).join('')}
      <div class="ftotal cue"><span>these alone</span><b>£0.00</b><em>0.27% of turnover</em></div></div>` });
  [[tFour, 0], [tSeventeen, 1], [tPci, 2], [tAccount, 3], [tPayout, 4]].forEach(([when, i]) => {
    arrive(`#fixed .f${i}`, when);
    countUp(`#fixed .f${i} b`, rows[i][2], when + 0.1, { prefix: '£', dp: 2, dur: 0.7 });
    sfx('tick', when, 0.18);
  });
  js.push(`tl.fromTo("#fixed .f4", { backgroundColor: "rgba(245,197,24,0)" }, { backgroundColor: "rgba(245,197,24,0.18)", duration: 0.4, immediateRender: false }, ${tOwn});`);
  rise('#fixed .ftotal', tOwn + 0.9); countUp('#fixed .ftotal b', 75.65, tOwn + 0.9, { prefix: '£', dp: 2, dur: 0.8 }); sfx('pop', tOwn + 0.9, 0.16);
  const x0 = pf('fixed', 1.1, PX + PW / 2, py + 300), x1 = pf('fixed', 1.14, PX + 300, py + 280), x2 = pf('fixed', 1.18, PX + PW - 170, py + 440);
  chain('B1-08', [{ t: a8, c: flat(1.02, 20, 0) }, { t: tCharges + 0.9, c: x0, ease: 'power3.out' }, hold(tFour, x0), { t: tFour + 0.6, c: x1, ease: 'power3.out' }, hold(b8, x1)]);
  chain('B1-09', [{ t: a9, c: bump(x1) }, hold(tPayout, x1), { t: tPayout + 0.6, c: x2, ease: 'power3.out' }, hold(b9 - 0.6, x2), { t: b9, c: flat(1.06, -60, 0) }]);
}

/* ---------- 9 · the formula --- B1-10 (left, big, built as she says it) ---------- */
{
  const s = S['B1-10'], a = s.start, b = endOf('B1-10');
  const tAdd = findWord('B1-10', 'add'), tDivide = findWord('B1-10', 'divide'), tMultiply = findWord('B1-10', 'multiply'), tHundred = findWord('B1-10', 'hundred');
  const fx = LX, fy = 190, fw = 900, fh = 560, st = r3(Math.max(a, tAdd - 0.7));
  glass('formula', { start: st, dur: r3(b - st), x: fx, y: fy, w: fw, h: fh, cueAt: tAdd, lean: 8,
    inner: `<div class="pad formula"><span class="th cue">your effective rate</span>
      <div class="frac"><div class="num cue">every charge on the statement</div><i class="line"></i><div class="den cue">total card turnover</div></div>
      <div class="ops"><span class="x100 cue">× 100</span><span class="eq cue">=</span><b class="res cue">effective rate</b></div></div>` });
  rise('#formula .num', tAdd + 0.15); sfx('tick', tAdd, 0.18);
  js.push(`tl.set("#formula .line", { scaleX: 0 }, ${st});`);
  js.push(`tl.fromTo("#formula .line", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.inOut", immediateRender: false }, ${tDivide});`);
  rise('#formula .den', tDivide + 0.1); sfx('swish', tDivide, 0.14);
  rise('#formula .x100', tMultiply); rise('#formula .eq', tMultiply + 0.25); rise('#formula .res', tMultiply + 0.4); sfx('tick', tMultiply, 0.18);
  js.push(`tl.fromTo("#formula .res", { scale: 1 }, { scale: 1.12, duration: 0.35, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tHundred});`);
  sfx('pop', tHundred, 0.14);
  const f0 = pf('formula', 1.14, fx + fw / 2, fy + fh / 2 + 40), f1 = pf('formula', 1.2, fx + fw / 2, fy + fh / 2 + 40);
  chain('B1-10', [{ t: a, c: flat(1.0) }, { t: tAdd - 0.1, c: flat(1.02) }, { t: tAdd + 0.9, c: f0, ease: 'power3.out' }, hold(tDivide, f0), { t: tDivide + 0.7, c: f1, ease: 'power3.out' }, hold(b - 0.5, f1), { t: b, c: flat(1.06, 40, 0) }]);
}

/* ---------- 10 · £308 on £28,400 is 1.09% --- B1-11 + quoted vs paid --- B1-12 (the headline) ---------- */
{
  const a11 = S['B1-11'].start, b11 = endOf('B1-11'), a12 = S['B1-12'].start, b12 = endOf('B1-12');
  const tHere = findWord('B1-11', 'here'), tThree = findWord('B1-11', 'three'), tTwenty = findWord('B1-11', 'twenty'), tOne = findWord('B1-11', 'one');
  const tQuoted = findWord('B1-12', 'quoted'), tActually = findWord('B1-12', 'actually'), tDouble = findWord('B1-12', 'double'), tStatement = findWord('B1-12', 'statement');
  const sx = 1040, sy = 50, sw = 840, sh = 740;
  glass('sum', { start: a11, dur: r3(b12 - a11), x: sx, y: sy, w: sw, h: sh, cueAt: tHere, lean: -6,
    inner: `<div class="pad sum"><span class="th cue">what that month really cost</span>
      <div class="sline l0 cue"><span>all charges</span><b>£0.00</b></div>
      <div class="sline l1 cue"><span>card turnover</span><b>£0</b></div>
      <div class="big1 cue"><em>effective rate</em><b>0.00%</b></div>
      <div class="vs"><div class="v0 cue"><em>quoted</em><b>0.50%</b></div>
        <div class="arrowwrap cue"><svg viewBox="0 0 236 64" width="236" height="64"><path class="ashaft" d="M8 50 C 84 50, 150 14, 222 14" fill="none" stroke="${Y}" stroke-width="6" stroke-linecap="round"/><path class="ahead" d="M232 14 l-22 -13 v26 z" fill="${Y}"/></svg></div>
        <div class="v1 cue"><em>paying</em><b>1.09%</b></div></div>
      <span class="tag2 cue">more than double</span></div>` });
  rise('#sum .l0', tThree); countUp('#sum .l0 b', 308.46, tThree, { prefix: '£', dp: 2, dur: 1.0 }); sfx('tick', tThree, 0.18);
  rise('#sum .l1', tTwenty); countUp('#sum .l1 b', 28400, tTwenty, { prefix: '£', dur: 0.9 }); sfx('tick', tTwenty, 0.18);
  rise('#sum .big1', tOne, 40); countUp('#sum .big1 b', 1.09, tOne, { suffix: '%', dp: 2, sep: false, dur: 1.1 }); sfx('chime', tOne, 0.22);
  js.push(`tl.fromTo("#sum .big1 b", { scale: 0.9 }, { scale: 1, duration: 1.1, ease: "power2.out", immediateRender: false }, ${tOne});`);
  /* B1-12: "quoted 0.50%" on the left; nothing else until "but they're actually paying" — then the arrow
     draws itself across to the right, the head lands, 1.09% rises under it and the camera rides along */
  rise('#sum .v0', tQuoted); sfx('tick', tQuoted, 0.18);
  const tArrow = r3(tActually - 0.1);
  js.push(`const shaft = document.querySelector("#sum .ashaft"), shaftL = shaft.getTotalLength();
  gsap.set(shaft, { strokeDasharray: shaftL, strokeDashoffset: shaftL });
  gsap.set("#sum .ahead", { scale: 0, svgOrigin: "232 14" });
  tl.set("#sum .arrowwrap", { autoAlpha: 1 }, ${tArrow});
  tl.fromTo(shaft, { strokeDashoffset: shaftL }, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut", immediateRender: false }, ${tArrow});
  tl.fromTo("#sum .ahead", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2.5)", immediateRender: false }, ${r3(tArrow + 0.55)});`);
  sfx('swish', tArrow, 0.16);
  rise('#sum .v1', tArrow + 0.7, 30); sfx('pop', tArrow + 0.7, 0.18);
  js.push(`tl.fromTo("#sum .v1 b", { scale: 0.8 }, { scale: 1.08, duration: 0.5, ease: "back.out(2)", immediateRender: false }, ${r3(tArrow + 0.7)});`);
  js.push(`tl.fromTo("#sum .v1 b", { scale: 1.08 }, { scale: 1, duration: 0.4, ease: "power2.inOut", immediateRender: false }, ${r3(tArrow + 1.2)});`);
  js.push(`tl.fromTo("#sum .tag2", { autoAlpha: 0, scale: 0.7, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, ${tDouble});`);
  sfx('bounce', tDouble, 0.22);
  /* camera: B1-11 lands on the big figure; B1-12 sits on 0.50%, follows the arrow to 1.09%, holds, eases out */
  const bigY = sy + 380, vsY = sy + 560;
  const s0 = pf('sum', 1.12, sx + 420, sy + 300), s1 = pf('sum', 1.22, sx + 330, bigY), s2 = pf('sum', 1.12, sx + 420, sy + 500);
  chain('B1-11', [{ t: a11, c: flat(1.0) }, { t: tHere + 0.9, c: s0, ease: 'power3.out' }, hold(tOne, s0), { t: tOne + 0.7, c: s1, ease: 'power3.out' }, hold(b11 - 0.9, s1), { t: b11, c: s2 }]);
  const q0 = pf('sum', 1.3, sx + 190, vsY), q1 = pf('sum', 1.3, sx + 640, vsY), qb = pf('sum', 1.22, sx + 480, vsY + 40);
  chain('B1-12', [
    { t: a12, c: s2 }, { t: tQuoted + 0.2, c: q0 }, hold(tArrow, q0),
    { t: tArrow + 0.85, c: q1 }, hold(tDouble, q1), { t: tDouble + 0.6, c: qb, ease: 'power3.out' },
    hold(b12 - 0.6, qb), { t: b12, c: flat(1.06, -50, 0) }]);
}

/* ---------- 11 · 0.70% flat costs less --- B1-13 + B1-14 (one panel) ---------- */
{
  const a13 = S['B1-13'].start, b13 = endOf('B1-13'), a14 = S['B1-14'].start, b14 = endOf('B1-14');
  const tNought = findWord('B1-13', 'nought'), tFlat = findWord('B1-13', 'flat'), tLess = findWord('B1-13', 'less');
  const tHundred = findWord('B1-14', 'hundred'), tHigher = findWord('B1-14', 'higher'), tLess2 = findWord('B1-14', 'less');
  const py = 96, ph = 690, st = r3(Math.max(a13, tNought - 0.7));
  glass('flatp', { start: st, dur: r3(b14 - st), x: PX, y: py, w: PW, h: ph, cueAt: tNought, lean: -7,
    inner: `<div class="pad"><span class="th cue">the same month, two ways</span>
      <div class="head cue"><b>0.00%</b><span>flat, every card, no fees</span></div>
      <div class="hbars">
        <div class="hb h0 cue"><em>quoted 0.50% + fees</em><div class="hbt"><i style="width:100%"></i></div><b>£0.00</b></div>
        <div class="hb h1 cue"><em>0.70% flat</em><div class="hbt"><i style="width:64%"></i></div><b>£0.00</b></div>
      </div>
      <div class="save cue"><b>£0.00</b><span>a month cheaper on the higher headline rate</span></div></div>` });
  rise('#flatp .head', tNought + 0.1); countUp('#flatp .head b', 0.7, tNought + 0.1, { suffix: '%', dp: 2, sep: false, dur: 0.6 }); sfx('tick', tNought, 0.18);
  arrive('#flatp .h0', tFlat + 0.2); sfx('swish', tFlat + 0.2, 0.14);
  js.push(`tl.fromTo("#flatp .h0 .hbt i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", immediateRender: false }, ${r3(tFlat + 0.3)});`);
  countUp('#flatp .h0 b', 308.46, tFlat + 0.3, { prefix: '£', dp: 2, dur: 0.9 });
  arrive('#flatp .h1', tLess); sfx('swish', tLess, 0.14);
  js.push(`tl.fromTo("#flatp .h1 .hbt i", { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: "power3.out", immediateRender: false }, ${r3(tLess + 0.1)});`);
  countUp('#flatp .h1 b', 198.81, tHundred, { prefix: '£', dp: 2, dur: 0.9 });
  js.push(`tl.fromTo("#flatp .h1 .hbt i", { scaleX: 1 }, { scaleX: 1.03, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tHigher});`);
  rise('#flatp .save', tLess2); countUp('#flatp .save b', 109.65, tLess2, { prefix: '£', dp: 2, dur: 0.8 }); sfx('pop', tLess2, 0.16);
  const w0 = pf('flatp', 1.12, PX + PW / 2, py + 330), w1 = pf('flatp', 1.18, PX + 380, py + 430), w2 = pf('flatp', 1.18, PX + 380, py + 600);
  chain('B1-13', [{ t: a13, c: flat(1.0) }, { t: tNought - 0.1, c: flat(1.02) }, { t: tNought + 0.9, c: w0, ease: 'power3.out' }, hold(tLess, w0), { t: tLess + 0.6, c: w1, ease: 'power3.out' }, hold(b13, w1)]);
  chain('B1-14', [{ t: a14, c: bump(w1) }, hold(tLess2, w1), { t: tLess2 + 0.6, c: w2, ease: 'power3.out' }, hold(b14 - 0.6, w2), { t: b14, c: flat(1.06, -50, 0) }]);
}

/* ---------- 12 · the questions to ask --- B1-15 + B1-16 (one panel, each line only as she says it) ---------- */
{
  const a15 = S['B1-15'].start, b15 = endOf('B1-15'), a16 = S['B1-16'].start, b16 = endOf('B1-16');
  const tAsk = findWord('B1-15', 'ask'), tCredit = findWord('B1-15', 'credit'), tCompany = findWord('B1-15', 'company'), tAmex = findWord('B1-15', 'amex'), tPayout = findWord('B1-15', 'payout');
  const tPci = findWord('B1-16', 'pci'), tAccount = findWord('B1-16', 'account'), tMinimum = findWord('B1-16', 'minimum'), tEffective = findWord('B1-16', 'effective'), tOnly = findWord('B1-16', 'only');
  const items = ['What do credit cards cost?', 'And business cards?', 'And American Express?', 'What does each payout cost?', 'Is there a PCI fee?', 'An account fee?', 'A minimum monthly charge?', 'So what is my effective rate?'];
  const qx = 1020, qy = 60, qw = 860, qh = 760, st = r3(Math.max(a15, tAsk - 0.7));
  glass('ask', { start: st, dur: r3(b16 - st), x: qx, y: qy, w: qw, h: qh, cueAt: tAsk, lean: -7,
    inner: `<div class="pad"><span class="th cue">ask any provider</span>${items.map((q, i) => `<div class="qrow k${i}${i === 7 ? ' last' : ''} cue"><i></i><span>${q}</span></div>`).join('')}</div>` });
  [tCredit, tCompany, tAmex, tPayout, tPci, tAccount, tMinimum, tEffective].forEach((when, i) => {
    arrive(`#ask .k${i}`, when, 40);
    js.push(`tl.fromTo("#ask .k${i} i", { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.2)", immediateRender: false }, ${r3(when + 0.2)});`);
    sfx('tick', when, 0.2);
  });
  js.push(`tl.fromTo("#ask .k7 span", { scale: 1 }, { scale: 1.06, duration: 0.4, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tOnly});`);
  sfx('pop', tOnly, 0.14);
  const rowY = (i) => qy + 120 + 72 * i + 36;
  const k0 = pf('ask', 1.1, qx + 330, qy + 300), k1 = pf('ask', 1.12, qx + 330, rowY(3)), k2 = pf('ask', 1.14, qx + 330, rowY(5)), k3 = pf('ask', 1.2, qx + 330, rowY(7) - 60);
  chain('B1-15', [{ t: a15, c: flat(1.0) }, { t: tAsk - 0.1, c: flat(1.02) }, { t: tAsk + 0.9, c: k0, ease: 'power3.out' }, hold(tPayout, k0), { t: tPayout + 0.6, c: k1, ease: 'power3.out' }, hold(b15, k1)]);
  chain('B1-16', [{ t: a16, c: bump(k1) }, { t: tPci + 0.6, c: k2 }, hold(tEffective, k2), { t: tEffective + 0.6, c: k3, ease: 'power3.out' }, hold(b16 - 0.6, k3), { t: b16, c: flat(1.06, -50, 0) }]);
}

/* ---------- 13 · two minutes with a statement --- B1-17 ---------- */
{
  const s = S['B1-17'], a = s.start, b = endOf('B1-17');
  const tTwo = findWord('B1-17', 'two'), tCalc = findWord('B1-17', 'calculator');
  glass('two', { start: a, dur: r3(b - a), x: PX + 120, y: 200, w: 640, h: 230, cueAt: tTwo + 0.05, lean: -6,
    inner: `<div class="pad twomin"><b class="cue">2 min</b><div><span class="c1 cue">last month's statement</span><span class="c2 cue">+ a calculator</span></div></div>` });
  rise('#two b', tTwo + 0.05, 16); rise('#two .c1', tTwo + 0.3, 12); rise('#two .c2', tCalc); sfx('tick', tCalc, 0.18);
  chain('B1-17', [{ t: a, c: flat(1.06, -30, 0) }, { t: tTwo + 0.9, c: flat(1.1, -60, 0), ease: 'power3.out' }, hold(b - 1.0, flat(1.1, -60, 0)), { t: b, c: flat(1.0) }]);
}

/* ---------- 14 · follow --- B1-18 ---------- */
{
  const s = S['B1-18'], a = s.start, b = endOf('B1-18');
  const tFollow = findWord('B1-18', 'follow'), st = r3(Math.max(a, tFollow - 0.6));
  glass('follow', { start: st, dur: r3(b - st), x: PX + 100, y: 220, w: 660, h: 170, cueAt: tFollow, lean: -6,
    inner: `<div class="pad follow"><span class="mark cue"><b>Nero</b><em>Pay</em></span><span class="sub cue">more like this on the channel</span></div>` });
  rise('#follow .mark', tFollow, 16); rise('#follow .sub', tFollow + 0.25, 12);
  chain('B1-18', [{ t: a, c: flat(1.0) }, { t: tFollow + 0.9, c: flat(1.06, -20, 0), ease: 'power2.out' }, { t: b, c: flat(1.05, -20, 0), ease: 'none' }]);
}

/* ---------- 15 · end card (light, on the beat): NeroPay → subscribe → six plain lines → NeroPay, subscribe, legal ----------
   Minimal by Faisal's brief: no product names, generic labels only, one tile per two beats, one fade in and
   one fade out per tile, nothing wipes. "Pay" is yellow from its first frame; no colour ever changes. */
{
  const s = S['[END]'], a = s.start, d = s.dur;
  const offer = ['Payment Terminal', 'Free POS Software', 'Online Ordering System', 'Booking System', 'QR Payments', 'API for Ecommerce'];
  html.push(`<div id="end" class="clip card-full light" data-start="${a}" data-duration="${d}" data-track-index="4">
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <div class="p3d" style="left:${(W - 1400) / 2}px;top:${(H - 660) / 2}px;width:1400px;height:660px"><div class="float"><div class="glass lglass" style="width:1400px;height:660px"><i class="tint"></i><i class="sheen"></i>
    <div class="body estage">
      <div class="layer brand"><span class="wordmark cue"><b>Nero</b><em>Pay</em></span><span class="sub cue">Subscribe for more</span></div>
      <div class="layer items"><span class="kicker cue">WHAT COMES WITH NEROPAY</span><div class="grid">${offer.map((t, i) => `<div class="tile t${i} cue"><i></i><span>${esc(t)}</span></div>`).join('')}</div></div>
      <div class="layer final"><span class="wordmark cue"><b>Nero</b><em>Pay</em></span><span class="sub cue">Subscribe</span><span class="legal cue">Illustrative figures. No saving is guaranteed. NeroPay is a trading name of Nero Panda Ltd.</span></div>
    </div><i class="rim"></i></div></div></div></div>`);
  const land = r3(a + 0.25 + 0.6);
  js.push(`tl.fromTo("#end", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#floor", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.45, immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .float", { autoAlpha: 0, rotationX: 12, y: 80, z: -300, scale: 0.92, transformPerspective: 1800 }, { autoAlpha: 1, rotationX: 0, y: 0, z: 0, scale: 1, duration: 1.15, ease: "power4.out", immediateRender: false }, ${r3(a + 0.25)});`);
  js.push(`tl.fromTo("#end .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.6, ease: "power2.inOut", immediateRender: false }, ${r3(land + 0.1)});`);
  /* beat grid: the music starts with the card, first beat at 0 */
  const g = (k) => r3(a + k * BAR2);
  rise('#end .brand .wordmark', land, 34); sfx('impact', land, 0.26);
  rise('#end .brand .sub', g(1), 24); sfx('tick', g(1), 0.2);
  /* brand goes, the six lines arrive one per two beats and stay, then all go together for the final ask */
  leave('#end .brand .wordmark', g(3) - 0.5); leave('#end .brand .sub', g(3) - 0.45);
  rise('#end .items .kicker', g(3), 16);
  offer.forEach((_, i) => {
    const tin = g(3 + i);
    js.push(`tl.fromTo("#end .items .t${i}", { autoAlpha: 0, y: 26, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, ${tin});`);
    sfx('tick', tin, 0.2);
  });
  const fin = g(3 + offer.length);
  leave('#end .items .kicker', fin - 0.5);
  offer.forEach((_, i) => leave(`#end .items .t${i}`, fin - 0.5 + i * 0.03));
  rise('#end .final .wordmark', fin, 34); sfx('pop', fin, 0.18);
  rise('#end .final .sub', g(4 + offer.length), 24); sfx('tick', g(4 + offer.length), 0.2);
  rise('#end .final .legal', g(4 + offer.length) + 0.5, 12);
  sfx('music-outro', a, 0.42);
  /* the camera pans across the lines as they fill in, a gentle lean on the glass */
  move(a, g(3), flat(1.04, 20, 0), flat(1.02, 0, 0), 'power1.inOut');
  move(g(3), fin, flat(1.02, 0, 0), flat(1.06, -40, 0), 'none');
  move(fin, r3(a + d), flat(1.06, -40, 0), flat(1.0), 'power1.inOut');
  js.push(`tl.fromTo("#end .float", { rotationY: 0 }, { rotationY: 4, duration: ${r3(fin - g(3))}, ease: "sine.inOut", immediateRender: false }, ${g(3)});`);
  js.push(`tl.fromTo("#end .float", { rotationY: 4 }, { rotationY: 0, duration: 1.2, ease: "power2.inOut", immediateRender: false }, ${fin});`);
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
@font-face{font-family:Poppins;font-weight:500;font-style:italic;src:url(assets/fonts/poppins-latin-500-italic.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:700;font-style:italic;src:url(assets/fonts/poppins-latin-700-italic.woff2) format("woff2")}
@font-face{font-family:Poppins;font-weight:800;font-style:italic;src:url(assets/fonts/poppins-latin-800-italic.woff2) format("woff2")}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden;background:#141416}
body{font-family:Poppins,"Helvetica Neue",Arial,sans-serif;color:#fff;letter-spacing:-0.03em}
#root{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:#141416}
#world{position:absolute;inset:0;transform-origin:50% 50%}
video.clip{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:cover}
.clip{position:absolute}
.panel,.p3d{position:absolute}
.p3d{perspective:1600px}
.float{position:absolute;inset:0;opacity:0;visibility:hidden;transform-origin:50% 50%}
.cue{opacity:0;visibility:hidden}
/* liquid glass, built from the footage itself: .bg is the panel's own copy of the clip (blurred, dimmed,
   a touch more saturated) lined up with the frame under it and clipped by the panel; .tint is the frost;
   .rim is the polished edge — a bright top lip, a thin bright line all round, and a wide soft bevel
   that lightens toward the edges the way thick glass does. No backdrop-filter anywhere (LESSONS.md #27). */
.glass{position:absolute;left:0;top:0;border-radius:36px;overflow:hidden;isolation:isolate;background:rgba(26,26,30,.30);
  box-shadow:0 30px 60px rgba(0,0,0,.26),0 6px 16px rgba(0,0,0,.16)}
.glass .bg{position:absolute;width:${W}px;height:${H}px;z-index:0}
.bgv{position:absolute;left:0;top:0;width:${W}px;height:${H}px;object-fit:cover;transform:scale(1.06)}
.bgv.lo{filter:blur(7px) saturate(1.3) brightness(.5)}
.bgv.hi{filter:blur(30px) saturate(1.3) brightness(.5)}
.glass .tint{position:absolute;inset:0;z-index:1;display:block;
  background:linear-gradient(135deg,rgba(255,255,255,.17) 0%,rgba(255,255,255,.08) 45%,rgba(255,255,255,.07) 60%,rgba(255,255,255,.14) 100%),
  radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,.16),transparent 55%),radial-gradient(80% 60% at 100% 100%,rgba(245,197,24,.10),transparent 60%)}
.sheen{position:absolute;top:-20%;left:0;width:45%;height:140%;display:block;pointer-events:none;z-index:2;
  background:linear-gradient(105deg,transparent 0%,rgba(255,255,255,.04) 35%,rgba(255,255,255,.16) 50%,rgba(255,255,255,.04) 65%,transparent 100%)}
.glass .body{position:absolute;inset:0;z-index:3}
.glass .rim{position:absolute;inset:0;z-index:4;display:block;border-radius:inherit;pointer-events:none;
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.66),inset 0 -1px 0 rgba(255,255,255,.14),inset 1px 0 0 rgba(255,255,255,.24),inset -1px 0 0 rgba(255,255,255,.12),inset 0 0 0 1px rgba(255,255,255,.18)}
.glass .rim::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:26px;
  background:linear-gradient(160deg,rgba(255,255,255,.30),rgba(255,255,255,.05) 38%,rgba(255,255,255,.02) 62%,rgba(245,197,24,.20));
  -webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
/* light glass for the cards on white: a frosted white slab, the same rim */
.lglass{background:linear-gradient(135deg,rgba(255,255,255,.80) 0%,rgba(255,255,255,.62) 50%,rgba(255,255,255,.74) 100%);color:${INK};
  box-shadow:0 40px 90px rgba(20,20,22,.10),0 8px 24px rgba(20,20,22,.06)}
.lglass .tint{background:radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,.7),transparent 55%),radial-gradient(70% 60% at 100% 100%,rgba(245,197,24,.16),transparent 60%)}
.lglass .rim{box-shadow:inset 0 2px 0 rgba(255,255,255,1),inset 0 0 0 1px rgba(255,255,255,.9)}
.lglass .rim::before{background:linear-gradient(160deg,rgba(255,255,255,.9),rgba(255,255,255,.2) 38%,rgba(255,255,255,.1) 62%,rgba(245,197,24,.18))}
.lglass .sheen{background:linear-gradient(105deg,transparent 0%,rgba(255,255,255,.1) 35%,rgba(255,255,255,.55) 50%,rgba(255,255,255,.1) 65%,transparent 100%)}
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
/* cards: a real 3D space; each card is a frosted glass slab with a body (eight layers behind the face),
   its own blurred copy of the footage, a metal chip, a band, one static highlight, no drop shadow */
.space{position:absolute;perspective:1500px;overflow:visible}
.orbit{position:absolute;inset:0;transform-style:preserve-3d;transform-origin:50% 55%}
.card{position:absolute;left:60px;top:220px;width:330px;height:208px;display:block;transform-style:preserve-3d;transform-origin:50% 50%}
.card .edge{position:absolute;inset:0;display:block;border-radius:26px;background:linear-gradient(135deg,rgba(150,150,160,.98),rgba(92,92,102,.98))}
.card .face{position:absolute;inset:0;border-radius:26px;overflow:hidden;isolation:isolate;background:rgba(255,255,255,.12)}
.card .face .bg{position:absolute;width:${W}px;height:${H}px;z-index:0}
.card .face .bgv{filter:blur(7px) saturate(1.2) brightness(1.05)}
.card .face .bgv.hi{filter:blur(30px) saturate(1.2) brightness(1.05)}
.card .ctint{position:absolute;inset:0;z-index:1;display:block;background:linear-gradient(135deg,rgba(255,255,255,.74) 0%,rgba(255,255,255,.50) 50%,rgba(214,214,222,.60) 100%)}
.card .cshine{position:absolute;left:-30%;top:-40%;width:70%;height:180%;z-index:2;display:block;transform:rotate(18deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.30),transparent)}
.card .cchip{position:absolute;left:30px;top:30px;width:60px;height:44px;border-radius:9px;z-index:3;display:block;background:linear-gradient(135deg,#ffe38a 0%,${Y} 45%,#c99a0a 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.12)}
.card .cchip::after{content:"";position:absolute;left:8px;right:8px;top:14px;height:1px;background:rgba(0,0,0,.18);box-shadow:0 8px 0 rgba(0,0,0,.18)}
.card .cband{position:absolute;left:0;right:0;bottom:52px;height:28px;z-index:3;display:block;background:rgba(20,20,22,.36)}
.card .crim{position:absolute;inset:0;z-index:4;display:block;border-radius:26px;box-shadow:inset 0 1.5px 0 rgba(255,255,255,.95),inset 0 0 0 1px rgba(255,255,255,.55),inset 0 -1px 0 rgba(0,0,0,.10),inset 0 -14px 30px rgba(255,255,255,.10)}
.card .crim::before{content:"";position:absolute;inset:0;border-radius:inherit;padding:14px;background:linear-gradient(160deg,rgba(255,255,255,.9),rgba(255,255,255,.15) 40%,rgba(255,255,255,.05) 60%,rgba(245,197,24,.18));-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);mask-composite:exclude}
.card.c1 .cchip{background:linear-gradient(135deg,#ffffff,#d6d6dc 55%,#b8b8c0)}
.card.c2 .cchip{background:linear-gradient(135deg,#bfe2ff,#7fb4e8 50%,#4b86c6)}
.card.c3 .cchip{background:linear-gradient(135deg,#fff0bf,#ffd27a 50%,${Y})}
#hand .tagwrap{position:absolute;left:60px;top:505px;width:500px;height:110px}
#hand .tag{font-size:40px;font-weight:600}
#hand .tag .body{display:flex;align-items:center;justify-content:center;gap:14px}
#hand .tag em{font-style:italic;font-weight:800;color:${Y}}
/* ladder: one bar per card, the named one yellow, the rest grey */
.bars{position:absolute;left:46px;right:46px;top:104px;bottom:34px;display:flex;align-items:flex-end;justify-content:space-between;gap:22px}
.bar{position:relative;flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:46px}
.bar .col{position:relative;width:100%;transform-origin:50% 100%}
.bar .col i{position:absolute;inset:0;display:block;border-radius:16px 16px 8px 8px}
.bar .col .base{background:rgba(255,255,255,.22);box-shadow:inset 0 2px 0 rgba(255,255,255,.3)}
.bar .col .fill{background:linear-gradient(180deg,${Y},#d9ab10);box-shadow:inset 0 2px 0 rgba(255,255,255,.55)}
.bar b{display:block;margin-bottom:12px;text-align:center;font-size:34px;font-weight:800;letter-spacing:-0.04em;color:${Y}}
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
/* formula — big, on the left */
.formula{justify-content:center}
.frac{display:flex;flex-direction:column;align-items:center;gap:16px;margin:6px 0 30px}
.frac .num,.frac .den{display:block;font-size:46px;font-weight:700;letter-spacing:-0.02em;text-align:center}
.frac .line{display:block;width:760px;height:6px;background:#fff;border-radius:3px;transform-origin:50% 50%}
.ops{display:flex;align-items:center;justify-content:center;gap:28px;font-size:54px;font-weight:600}
.ops .res{font-size:62px;font-weight:800;color:${Y};font-style:italic;transform-origin:50% 50%}
/* sum — the headline of the video */
.sline{display:flex;justify-content:space-between;align-items:baseline;font-size:32px;font-weight:600;padding:8px 0}
.sline b{font-size:44px;font-weight:800;color:${Y};letter-spacing:-0.04em}
.big1{display:flex;flex-direction:column;align-items:flex-start;margin:10px 0 18px}
.big1 em{font-style:normal;font-size:24px;font-weight:500;color:rgba(255,255,255,.75);letter-spacing:0}
.big1 b{font-size:120px;font-weight:800;color:${Y};letter-spacing:-0.05em;line-height:1;transform-origin:0 60%}
.vs{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:auto}
.vs > div.v0,.vs > div.v1{display:flex;flex-direction:column;flex:none}
.vs em{font-style:normal;font-size:22px;font-weight:500;color:rgba(255,255,255,.7);letter-spacing:0.06em;text-transform:uppercase}
.vs b{font-size:74px;font-weight:800;letter-spacing:-0.04em;line-height:1.05;display:block;transform-origin:0 60%}
.vs .v0 b{color:rgba(255,255,255,.8)} .vs .v1 b{color:${Y}}
.vs .arrowwrap{flex:none;width:236px;height:64px;margin-top:22px}
.vs .arrowwrap svg{display:block;overflow:visible;filter:drop-shadow(0 0 8px rgba(245,197,24,.55))}
.tag2{display:inline-block;align-self:flex-start;margin-top:18px;padding:10px 24px;border-radius:16px;background:${Y};color:#141416;font-size:30px;font-weight:800;font-style:italic;letter-spacing:-0.02em;transform-origin:20% 50%}
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
.qrow{display:flex;align-items:center;gap:22px;height:72px;font-size:32px;font-weight:600}
.qrow i{display:block;flex:none;width:38px;height:38px;border-radius:50%;background:${Y};position:relative;transform-origin:50% 50%}
.qrow i::after{content:"";position:absolute;left:13px;top:7px;width:9px;height:18px;border-right:4px solid #141416;border-bottom:4px solid #141416;transform:rotate(45deg)}
.qrow.last span{color:${Y};font-weight:800;font-style:italic;display:inline-block;transform-origin:0 50%}
/* two minutes + follow */
.twomin{flex-direction:row;align-items:center;gap:26px}
.twomin b{white-space:nowrap;font-size:84px;font-weight:800;color:${Y};letter-spacing:-0.05em;line-height:1}
.twomin div{display:flex;flex-direction:column;gap:4px}
.twomin span{display:block;font-size:28px;font-weight:600}
.twomin .c2{color:rgba(255,255,255,.85)}
.follow{flex-direction:row;align-items:center;gap:26px;padding:0 40px}
.mark{display:block;font-size:64px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.mark em,.wordmark em{font-style:normal;color:${Y}}
.follow .sub{display:block;font-size:26px;font-weight:500;color:rgba(255,255,255,.85);padding-left:24px;border-left:2px solid rgba(255,255,255,.3);letter-spacing:0}
/* title + end cards: white ground, soft yellow blooms (static — a blurred element must not move) */
.card-full{left:0;top:0;width:${W}px;height:${H}px;background:#141416;overflow:hidden}
.card-full.light{background:#f7f6f2;color:${INK}}
.blob{position:absolute;border-radius:50%;display:block;filter:blur(90px);pointer-events:none}
.blob.b1{left:-260px;top:-360px;width:1200px;height:1100px;background:radial-gradient(circle,rgba(245,197,24,.55),rgba(245,197,24,0) 62%)}
.blob.b2{right:-380px;bottom:-460px;width:1300px;height:1200px;background:radial-gradient(circle,rgba(245,197,24,.42),rgba(245,197,24,0) 62%)}
.blob.b3{left:40%;top:55%;width:700px;height:600px;background:radial-gradient(circle,rgba(255,255,255,.9),rgba(255,255,255,0) 62%)}
.tstack{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center}
.kicker{display:block;font-size:26px;font-weight:500;letter-spacing:0.38em;color:#6d6c68;padding-left:0.38em}
.wordmark{display:block;font-size:220px;font-weight:800;letter-spacing:-0.05em;line-height:1;color:${INK}}
.tstack .ep{display:block;font-size:34px;font-weight:500;font-style:italic;letter-spacing:-0.01em;color:#4d4c48;margin-top:30px}
/* end card stage: three layers in the same box */
.estage{padding:0 90px}
.estage .layer{position:absolute;left:90px;right:90px;top:0;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center}
.estage .wordmark{font-size:170px}
.estage .sub{display:block;font-size:54px;font-weight:600;color:${INK}}
.estage .legal{display:block;max-width:1000px;font-size:22px;font-weight:500;color:#6d6c68;margin-top:28px;letter-spacing:0}
.estage .items{justify-content:flex-start;padding-top:70px}
.estage .items .kicker{margin-bottom:34px}
.estage .grid{display:grid;grid-template-columns:1fr 1fr;gap:22px 26px;width:1180px}
.estage .tile{height:118px;border-radius:26px;display:flex;align-items:center;gap:24px;padding:0 36px;text-align:left;transform-origin:50% 50%;
  background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(255,255,255,.72));box-shadow:inset 0 1.5px 0 #fff,inset 0 0 0 1px rgba(255,255,255,.95),0 10px 30px rgba(20,20,22,.05)}
.estage .tile i{display:block;flex:none;width:16px;height:16px;border-radius:5px;background:${Y}}
.estage .tile span{display:block;font-size:40px;font-weight:700;letter-spacing:-0.03em;color:${INK};line-height:1.1}
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
const nBg = (page.match(/class="bgv/g) || []).length;
console.log('index.html — ' + TOTAL + 's, ' + segs.length + ' segments, ' + WORDLIST.length + ' words, ' + cam.length + ' camera moves, ' + sfxN + ' sounds, ' + nBg + ' glass copies' + (cutUsed ? ', ' + cutUsed + ' clips from assets/cut' : ', RAW clips (run cut.mjs)') + (estimated.length ? ' — word timing ESTIMATED for ' + estimated.join(', ') : ''));
segs.forEach((s) => console.log('  ' + s.id.padEnd(9) + String(s.start).padStart(8) + 's  ' + s.dur + 's'));

/* B1 as a Facebook / Meta ad: 4:5 (1080×1350), under a minute, built from the same cut clips, word
   timings, sounds and glass as ../b1-rate-you-were-quoted. Seven takes carry the argument; two of them
   (the formula and the result) are audio only, played under full-frame diagrams built as she says the
   words. Everything is a pure function of timeline time on one paused GSAP timeline.

     (in ../b1-rate-you-were-quoted)  ORIENT=vertical node cut.mjs   → the 4:5 proxies cut into assets/cut
     node build.mjs                                                   → writes index.html
     npx hyperframes check · render -q high

   Assets are the B1 project's (the `assets` symlink): the sandbox makes the 4:5 proxies with
   ORIENT=vertical, so a clip fills this frame edge to edge with nothing upscaled. Ad rails from the repo
   CLAUDE.md: no NeroPay rate on screen (the 0.70% clips are left out), no earnings claim, no guaranteed
   saving — the end card concedes the case where the reader should stay put. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const B1 = path.join(HERE, '../b1-rate-you-were-quoted');
const W = 1080, H = 1350, FPS = 30, Y = '#F5C518', INK = '#141416';
const WORDS = JSON.parse(fs.readFileSync(path.join(B1, 'data/words.json'), 'utf8'));
const SCRIPT = JSON.parse(fs.readFileSync(path.join(B1, 'data/script.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(B1, 'data/edit.json'), 'utf8'));
const CUTS = fs.existsSync(path.join(B1, 'data/cuts.json')) ? JSON.parse(fs.readFileSync(path.join(B1, 'data/cuts.json'), 'utf8')) : null;
const SOUNDS = JSON.parse(fs.readFileSync(path.join(HERE, '../library/sounds.json'), 'utf8'));
const EMPH = ['effective', 'statement', 'fees', 'fee', 'flat', 'exit', 'rental', 'average', 'debit', 'credit', 'amex', 'own', 'choose', 'cheapest', 'most', 'double', 'less', 'payout', 'calculator', 'quoted', 'paying'];

const ffprobe = process.env.HYPERFRAMES_FFPROBE_PATH || 'ffprobe';
const dur = (file) => Math.round(parseFloat(execFileSync(ffprobe, ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString()) * 1000) / 1000;
const r3 = (n) => Math.round(n * 1000) / 1000;
const clean = (w) => String(w).toLowerCase().replace(/^[“"'(]+|[”"')\.,!?;:]+$/g, '');
const isEmph = (w) => /\d|£|%/.test(w) || EMPH.includes(clean(w));
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
function estimateWords(text, d, lead = 0.35, tail = 0.3) {
  const tokens = String(text || '').split(/\s+/).filter(Boolean);
  const weight = (w) => w.replace(/[^\w£%.]/g, '').length + 1 + (/[.,!?;:]["”]?$/.test(w) ? 3 : 0);
  const total = tokens.reduce((a, w) => a + weight(w), 0), speak = Math.max(0.6, d - lead - tail);
  let cursor = lead;
  return tokens.map((w) => { const span = (speak * weight(w)) / total; const o = { w, s: r3(cursor), e: r3(cursor + span - 0.03) }; cursor += span; return o; });
}

/* ---------- the cut: seven takes and the end card ---------- */
const ORDER = ['B1-01', 'B1-02', 'B1-05', 'B1-10', 'B1-11', 'B1-12', 'B1-17', '[END]'];
const BEAT = 60 / SOUNDS.sounds.music.bpm, BAR2 = 2 * BEAT;
const END_DUR = 7.0;
let t = 0;
const segs = [];
let estimated = [], cutUsed = 0;
for (const id of ORDER) {
  if (id === '[END]') { segs.push({ id, kind: 'card', start: r3(t), dur: END_DUR }); t += END_DUR; continue; }
  const cutFile = path.join(HERE, 'assets/cut', id + '.mp4');
  const useCut = CUTS && CUTS[id] && fs.existsSync(cutFile);
  const file = useCut ? cutFile : path.join(HERE, 'assets/clips', id + '.mp4');
  if (!fs.existsSync(file)) { console.log('skip ' + id + ' (no clip)'); continue; }
  let d, inn = 0, words;
  if (useCut) { d = dur(file); words = CUTS[id].words.filter((w) => w.e > 0 && w.s < d); cutUsed++; }
  else {
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
const findWord = (id, text, nth = 0) => {
  let k = 0;
  for (const w of S[id].words) if (clean(w.w) === text || clean(w.w).startsWith(text)) { if (k++ === nth) return at(id, Math.max(0, w.s)); }
  throw new Error('no word "' + text + '" in ' + id + ': ' + S[id].words.map((w) => w.w).join(' '));
};

/* ---------- captions ---------- */
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

const html = [], js = [], audio = [];
let wordIndex = 0;
const WORDLIST = [];

/* ---------- glass (the B1 pattern: the panel carries its own blurred copy of the footage) ---------- */
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
function glass(id, { start, dur: life, x, y, w, h, inner, cueAt, lean = -6, quiet = false, light = false, solid = false, radius = 36 }) {
  start = r3(start); const end = r3(start + life);
  const c = r3(cueAt == null ? start : Math.max(cueAt, start));
  html.push(`<div id="${id}" class="panel p3d" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
  <div class="float"><div class="glass${light ? ' lglass' : solid ? ' sglass' : ''}" style="width:${w}px;height:${h}px;border-radius:${radius}px">${light || solid ? '' : bgFor(id, start, end, x, y)}<i class="tint"></i><i class="sheen"></i><div class="body">${inner}</div><i class="rim"></i></div></div></div>`);
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
const arrive = (sel, when, dx = 36) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, x: ${dx} }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
const rise = (sel, when, dy = 22) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, y: ${dy} }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
const leave = (sel, when, dy = -16) => js.push(`tl.fromTo("${sel}", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: ${dy}, duration: 0.42, ease: "power2.in", immediateRender: false }, ${r3(when)});
  tl.set("${sel}", { autoAlpha: 0 }, ${r3(when + 0.42)});`);
const big = (sel, when) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, ${r3(when)});`);
let cu = 0;
function countUp(sel, to, when, { from = 0, dur: d = 0.9, prefix = '', suffix = '', dp = 0, sep = true } = {}) {
  const v = 'cu' + (cu++);
  js.push(`const ${v} = { n: ${from} }, ${v}el = document.querySelector("${sel}");
  const ${v}f = () => { const n = ${v}.n; const s = n.toFixed(${dp}); ${v}el.textContent = "${prefix}" + (${sep} ? s.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ",") : s) + "${suffix}"; };
  ${v}f();
  tl.fromTo(${v}, { n: ${from} }, { n: ${to}, duration: ${d}, ease: "power2.out", onUpdate: ${v}f, immediateRender: false }, ${r3(when)});`);
}
const SFXDUR = {}; let sfxN = 0;
function sfx(role, start, vol, { maxLen, mediaStart = 0 } = {}) {
  const file = path.join(HERE, 'assets/sfx', role + '.m4a');
  if (!fs.existsSync(file)) throw new Error('missing sound ' + role + ' — run ../library/fetch-sounds.mjs');
  if (!SFXDUR[role]) SFXDUR[role] = dur(file);
  const d = Math.min(SFXDUR[role] - mediaStart, maxLen || 1e9);
  const s = Math.max(0, r3(start));
  audio.push(`<audio id="sfx-${role}-${Math.round(s * 100)}" src="assets/sfx/${role}.m4a" data-start="${s}" data-duration="${r3(Math.min(d, TOTAL - s))}" data-media-start="${mediaStart}" data-track-index="${12 + (sfxN++)}" data-volume="${vol}"></audio>`);
}

/* ---------- cards (B1 pattern; opacity only on the leaves, LESSONS.md #32) ---------- */
function cardHtml(i) {
  const edges = [1, 2, 3, 4, 5, 6].map((k) => `<i class="edge" style="transform:translateZ(${-2 * k}px)"></i>`).join('');
  return `<div class="card k${i} cue">${edges}<div class="face"><i class="cchip"></i><i class="cband"></i><i class="cshine"></i><i class="crim"></i></div></div>`;
}
const leaves = (sel) => `${sel} .face, ${sel} .edge`;

/* ---------- camera ---------- */
const cam = [];
const clampCam = (c) => {
  const mx = (c.scale - 1) * W / 2, my = (c.scale - 1) * H / 2;
  return { scale: c.scale, x: r3(Math.max(-mx, Math.min(mx, c.x))), y: r3(Math.max(-my, Math.min(my, c.y))) };
};
function move(t0, t1, from, to, ease = 'power2.inOut') { if (t1 - t0 < 0.05) return; cam.push({ t0: r3(t0), t1: r3(t1), from: clampCam(from), to: clampCam(to), ease }); }
const focus = (S_, px, py) => ({ scale: S_, x: r3(-(px - W / 2) * S_), y: r3(-(py - H / 2) * S_) });
const flat = (S_, x = 0, y = 0) => ({ scale: S_, x, y });
const bump = (c, d = 0.02) => ({ scale: r3(c.scale + d), x: c.x, y: c.y });
function chain(id, pts) {
  const a = S[id].start, b = endOf(id);
  const P = pts.map((p) => ({ t: r3(Math.min(Math.max(p.t, a), b)), c: p.c, ease: p.ease || 'power2.inOut' }));
  for (let i = 1; i < P.length; i++) P[i].t = Math.max(P[i].t, P[i - 1].t);
  let last = P[0];
  for (let i = 1; i < P.length; i++) { if (P[i].t - last.t >= 0.05) { move(last.t, P[i].t, last.c, P[i].c, P[i].ease); last = P[i]; } }
}
const hold = (t, c) => ({ t, c: bump(c), ease: 'none' });

/* ---------- footage, audio, captions ---------- */
const STAGE_CLIPS = ['B1-10', 'B1-11'];          // audio only: the diagrams play instead
for (const s of segs) {
  if (s.kind !== 'clip') continue;
  if (!STAGE_CLIPS.includes(s.id)) html.push(`<video id="v-${s.id}" class="clip" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="0" muted playsinline></video>`);
  audio.push(`<audio id="a-${s.id}" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="10" data-volume="1"></audio>`);
  const groups = phrases(s.words);
  groups.forEach((p, gi) => {
    const ps = r3(s.start + Math.max(0, p[0].s));
    const next = groups[gi + 1] ? r3(s.start + groups[gi + 1][0].s) : Infinity;
    const pe = Math.min(r3(s.start + p[p.length - 1].e + 0.35), next, endOf(s.id));
    const pd = r3(pe - ps);
    if (pd <= 0.05) return;
    const spans = p.map((w) => {
      WORDLIST.push([r3(s.start + Math.max(0, w.s)), r3(s.start + w.e)]);
      return `<span class="w${isEmph(w.w) ? ' em' : ''}" data-i="${wordIndex++}">${esc(w.w)}</span>`;
    }).join(' ');
    html.push(`<div id="cap-${s.id}-${Math.round(Math.max(0, p[0].s) * 100)}" class="clip cap" data-start="${ps}" data-duration="${pd}" data-track-index="6"><div class="line">${spans}</div></div>`);
  });
}
/* the music bed: the whole track, quiet, under the argument; it runs out exactly where the last take
   starts, which leaves "two minutes with a statement" bare before the end card's sting */
sfx('music', 0, 0.13);

/* ---------- 1 · the hook: the rate you were quoted → 0.5%? --- B1-01 ---------- */
{
  const s = S['B1-01'], a = s.start, b = endOf('B1-01');
  const tWere = findWord('B1-01', 'were'), tRate = findWord('B1-01', 'rate'), tMaybe = findWord('B1-01', 'maybe'), tCent = findWord('B1-01', 'cent'), tNot = findWord('B1-01', 'not');
  html.push(`<div id="hook" class="bigline hook"><span class="h1 cue">you were quoted</span><span class="h2 cue">a rate.</span></div>`);
  big('#hook .h1', tWere); big('#hook .h2', tRate);
  sfx('tick', tWere, 0.18); sfx('bounce', tRate, 0.14);
  leave('#hook .h1', tMaybe - 0.5, -30); leave('#hook .h2', tMaybe - 0.45, -30);
  const cx = 560, cy = 110, cw = 460, ch = 210;
  glass('chip', { start: tMaybe - 0.2, dur: r3(b - tMaybe + 0.2), x: cx, y: cy, w: cw, h: ch, cueAt: tMaybe + 0.1, lean: -7,
    inner: `<div class="chip"><span class="big cue">0.5%</span><span class="q cue">?</span><i class="strike"></i></div>` });
  rise('#chip .big', tMaybe + 0.1, 18);
  js.push(`tl.set("#chip .strike", { scaleX: 0, rotation: -8 }, ${r3(tMaybe - 0.2)});`);
  js.push(`tl.fromTo("#chip .q", { autoAlpha: 0, scale: 0.4, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, ${tCent});`);
  js.push(`tl.fromTo("#chip .strike", { scaleX: 0, rotation: -8 }, { scaleX: 1, rotation: -8, duration: 0.4, ease: "power3.inOut", immediateRender: false }, ${tNot});`);
  js.push(`tl.fromTo("#chip .big", { color: "#ffffff" }, { color: "rgba(255,255,255,0.5)", duration: 0.4, immediateRender: false }, ${tNot});`);
  sfx('pop', tCent, 0.16); sfx('swish', tNot, 0.14);
  const f1 = focus(1.1, 600, 420), f2 = focus(1.16, 620, 400);
  chain('B1-01', [{ t: a, c: flat(1.0) }, { t: tMaybe, c: flat(1.03) }, { t: tMaybe + 0.9, c: f1, ease: 'power3.out' }, hold(tNot, f1), { t: tNot + 0.5, c: f2, ease: 'power3.out' }, hold(b, f2)]);
}

/* ---------- 2 · one type of card, then a lot more --- B1-02 ---------- */
{
  const s = S['B1-02'], a = s.start, b = endOf('B1-02');
  const tOne = findWord('B1-02', 'one'), tMore = findWord('B1-02', 'more');
  const FX = 440, FY = -40;
  html.push(`<div id="fan" class="space" style="left:${FX}px;top:${FY}px;width:640px;height:520px"><div class="orbit">${[0, 1, 2, 3].map((i) => cardHtml(i)).join('')}</div></div>`);
  js.push(`tl.set("#fan .k0", { autoAlpha: 1 }, ${tOne});`);
  js.push(`tl.fromTo("${leaves('#fan .k0')}", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, ${tOne});`);
  js.push(`tl.fromTo("#fan .k0", { z: -420, rotationY: 44, rotationX: 12, y: 40 }, { z: 0, rotationY: -14, rotationX: 6, y: 0, duration: 0.9, ease: "power3.out", immediateRender: false }, ${tOne});`);
  [1, 2, 3].forEach((i) => {
    const t0 = r3(tMore + (i - 1) * 0.07);
    js.push(`tl.set("#fan .k${i}", { autoAlpha: 1 }, ${t0});`);
    js.push(`tl.fromTo("${leaves('#fan .k' + i)}", { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, ${t0});`);
    js.push(`tl.fromTo("#fan .k${i}", { x: 0, y: 0, z: -60, rotationY: -14, rotationX: 6, rotationZ: 0 }, { x: ${i * 64}, y: ${-i * 46}, z: ${-i * 120}, rotationY: -14, rotationX: 6, rotationZ: ${i * 4}, duration: 0.55, ease: "power3.out", immediateRender: false }, ${t0});`);
  });
  js.push(`tl.fromTo("#fan .orbit", { rotationY: -8 }, { rotationY: 8, duration: ${r3(b - tOne)}, ease: "sine.inOut", immediateRender: false }, ${tOne});`);
  const out = r3(b - 0.36);
  js.push(`tl.fromTo("${leaves('#fan .card')}", { opacity: 1 }, { opacity: 0, duration: 0.36, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.fromTo("#fan .orbit", { y: 0 }, { y: -14, duration: 0.36, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.set("${leaves('#fan .card')}", { opacity: 0 }, ${b});`);
  js.push(`tl.set("#fan .card", { autoAlpha: 0 }, ${b});`);
  sfx('pop', tOne, 0.16); sfx('whoosh', r3(tMore - 0.05), 0.15);
  const f1 = focus(1.12, 640, 420);
  chain('B1-02', [{ t: a, c: flat(1.04, 20, 0) }, { t: tOne, c: flat(1.03, 10, 0) }, { t: tMore + 0.7, c: f1, ease: 'power3.out' }, hold(b, f1)]);
}

/* ---------- 3 · their card, your rate --- B1-05 ---------- */
{
  const s = S['B1-05'], a = s.start, b = endOf('B1-05');
  const tWhat = findWord('B1-05', 'whatever'), tPocket = findWord('B1-05', 'pocket'), tRate = findWord('B1-05', 'rate');
  const HX = 540, HY = -90, c0 = r3(Math.max(a, tWhat - 0.3));
  html.push(`<div id="hand" class="space" style="left:${HX}px;top:${HY}px;width:560px;height:560px"><div class="orbit">${[0, 1, 2, 3].map((i) => cardHtml(i)).join('')}</div></div>
  <div id="bigline" class="bigline"><span class="b1 cue">their card.</span><span class="b2 cue">your rate.</span></div>`);
  [0, 1, 2, 3].forEach((i) => {
    const t0 = r3(c0 + i * 0.1);
    js.push(`tl.set("#hand .k${i}", { autoAlpha: 1 }, ${t0});`);
    js.push(`tl.fromTo("${leaves('#hand .k' + i)}", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, ${t0});`);
    js.push(`tl.fromTo("#hand .k${i}", { y: 160, z: -380, rotationY: 34, rotationX: 10, rotationZ: 0, x: 0 }, { y: ${-i * 40}, x: ${i * 60}, z: ${-i * 110}, rotationY: -12, rotationX: 8, rotationZ: ${-10 + i * 7}, duration: 0.8, ease: "power3.out", immediateRender: false }, ${t0});`);
  });
  js.push(`tl.fromTo("#hand .k3", { x: 180, y: -120, z: -330, rotationZ: 11, rotationY: -12, rotationX: 8, scale: 1 }, { x: 70, y: 70, z: 160, rotationZ: 0, rotationY: -4, rotationX: 4, scale: 1.2, duration: 0.8, ease: "power3.inOut", immediateRender: false }, ${tPocket});`);
  [0, 1, 2].forEach((i) => js.push(`tl.fromTo("${leaves('#hand .k' + i)}", { opacity: 1 }, { opacity: 0.45, duration: 0.5, ease: "power2.inOut", immediateRender: false }, ${tPocket});`));
  js.push(`tl.fromTo("#hand .orbit", { rotationY: 6 }, { rotationY: -6, duration: ${r3(b - c0)}, ease: "sine.inOut", immediateRender: false }, ${c0});`);
  big('#bigline .b1', tPocket + 0.15); big('#bigline .b2', tRate - 0.05);
  sfx('whoosh', c0, 0.15); sfx('pop', tPocket, 0.16); sfx('tick', tPocket + 0.15, 0.18); sfx('bounce', r3(tRate - 0.05), 0.16);
  const out = r3(b - 0.3);
  js.push(`tl.fromTo("${leaves('#hand .card')}", { opacity: 1 }, { opacity: 0, duration: 0.3, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.fromTo("#hand .orbit", { y: 0 }, { y: -14, duration: 0.3, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.fromTo("#bigline .b1, #bigline .b2", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.set("${leaves('#hand .card')}", { opacity: 0 }, ${b});`);
  js.push(`tl.set("#bigline .b1, #bigline .b2", { autoAlpha: 0 }, ${b});`);
  js.push(`tl.set("#hand .card", { autoAlpha: 0 }, ${b});`);
  const f1 = focus(1.06, W / 2, 400), f2 = focus(1.1, W / 2, 380);
  chain('B1-05', [{ t: a, c: flat(1.0) }, { t: c0 + 0.8, c: f1, ease: 'power2.out' }, { t: tPocket + 0.6, c: f2, ease: 'power3.out' }, hold(b, f2)]);
}

/* ---------- 4 + 5 · the diagrams: her voice under a full-frame stage --- B1-10 (formula) + B1-11 (the result) ---------- */
{
  const a10 = S['B1-10'].start, b10 = endOf('B1-10'), a11 = S['B1-11'].start, b11 = endOf('B1-11');
  const tAdd = findWord('B1-10', 'add'), tDivide = findWord('B1-10', 'divide'), tMultiply = findWord('B1-10', 'multiply'), tHundred = findWord('B1-10', 'hundred');
  const tHere = findWord('B1-11', 'here'), tThree = findWord('B1-11', 'three'), tTwenty = findWord('B1-11', 'twenty'), tOne = findWord('B1-11', 'one');
  const XF = 0.35;
  html.push(`<div id="stage" class="clip card-full dark" data-start="${a10}" data-duration="${r3(b11 - a10)}" data-track-index="3"><div class="blob d1"></div><div class="blob d2"></div><div class="grain"></div></div>`);
  js.push(`tl.fromTo("#stage", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${XF}, ease: "power2.inOut", immediateRender: false }, ${a10});`);
  js.push(`tl.fromTo("#stage", { autoAlpha: 1 }, { autoAlpha: 0, duration: ${XF}, ease: "power2.inOut", immediateRender: false }, ${r3(b11 - XF)});`);
  js.push(`tl.set("#stage", { autoAlpha: 0 }, ${b11});`);
  sfx('whoosh', a10 - 0.05, 0.18);
  /* the formula slab: builds on add / divide / multiply / hundred */
  const fx = 70, fy = 230, fw = 940, fh = 640;
  glass('formula', { start: a10 + 0.2, dur: r3(tHere - 0.1 - (a10 + 0.2)), x: fx, y: fy, w: fw, h: fh, cueAt: tAdd, lean: 6, solid: true,
    inner: `<div class="pad formula"><span class="th cue">your effective rate</span>
      <div class="frac">
        <div class="row num cue"><i class="badge">£</i><span>every charge on the statement</span></div>
        <i class="line"></i>
        <div class="row den cue"><i class="badge">÷</i><span>total card turnover</span></div>
      </div>
      <div class="ops"><span class="x100 cue">× 100</span><span class="eq cue">=</span><b class="res cue">effective rate<i class="under"></i></b></div></div>` });
  rise('#formula .num', tAdd + 0.15); sfx('tick', tAdd, 0.18);
  js.push(`tl.set("#formula .line", { scaleX: 0 }, ${r3(a10 + 0.2)});`);
  js.push(`tl.fromTo("#formula .line", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power3.inOut", immediateRender: false }, ${tDivide});`);
  rise('#formula .den', tDivide + 0.12); sfx('swish', tDivide, 0.14);
  js.push(`tl.fromTo("#formula .x100", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, ${tMultiply});`);
  rise('#formula .eq', tMultiply + 0.25); sfx('tick', tMultiply, 0.18);
  js.push(`tl.fromTo("#formula .res", { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(tMultiply + 0.4)});`);
  js.push(`tl.set("#formula .under", { scaleX: 0 }, ${r3(a10 + 0.2)});`);
  js.push(`tl.fromTo("#formula .under", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, ${tHundred});`);
  js.push(`tl.fromTo("#formula .res", { scale: 1 }, { scale: 1.08, duration: 0.35, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tHundred});`);
  sfx('pop', tHundred, 0.14);
  /* the result slab: the same shape, the numbers count in, 1.09% lands with the chime */
  const sy = 190, sh = 740;
  glass('sum', { start: tHere - 0.1, dur: r3(b11 - (tHere - 0.1)), x: fx, y: sy, w: fw, h: sh, cueAt: tHere + 0.1, lean: -4, solid: true,
    inner: `<div class="pad sum"><span class="th cue">a made-up month, one restaurant</span>
      <div class="sline l0 cue"><span>every charge</span><b>£0.00</b></div>
      <div class="sline l1 cue"><span>card turnover</span><b>£0</b></div>
      <i class="rule cue"></i>
      <div class="big1 cue"><em>effective rate</em><b>0.00%</b></div>
      <span class="foot cue">Illustrative example, not a real statement.</span></div>` });
  rise('#sum .l0', tThree); countUp('#sum .l0 b', 308.46, tThree, { prefix: '£', dp: 2, dur: 1.0 }); sfx('tick', tThree, 0.18);
  rise('#sum .l1', tTwenty); countUp('#sum .l1 b', 28400, tTwenty, { prefix: '£', dur: 0.9 }); sfx('tick', tTwenty, 0.18);
  js.push(`tl.fromTo("#sum .rule", { autoAlpha: 0, scaleX: 0 }, { autoAlpha: 1, scaleX: 1, duration: 0.5, ease: "power3.inOut", immediateRender: false }, ${r3(tOne - 0.3)});`);
  rise('#sum .big1', tOne, 40); countUp('#sum .big1 b', 1.09, tOne, { suffix: '%', dp: 2, sep: false, dur: 1.1 }); sfx('chime', tOne, 0.22);
  js.push(`tl.fromTo("#sum .big1 b", { scale: 0.9 }, { scale: 1, duration: 1.1, ease: "power2.out", immediateRender: false }, ${tOne});`);
  rise('#sum .foot', tOne + 0.8, 10);
  /* camera: a slow push on the formula, a settle, then in on the big figure */
  const f0 = focus(1.06, W / 2, fy + fh / 2), f1 = focus(1.1, W / 2, fy + fh / 2 + 40);
  chain('B1-10', [{ t: a10, c: flat(1.0) }, { t: tAdd + 0.9, c: f0, ease: 'power3.out' }, hold(tMultiply, f0), { t: tMultiply + 0.6, c: f1, ease: 'power3.out' }, hold(b10, f1)]);
  const s0 = focus(1.03, W / 2, sy + 300), s1 = focus(1.08, W / 2, sy + 470);
  chain('B1-11', [{ t: a11, c: bump(f1) }, { t: tHere + 0.6, c: s0 }, hold(tOne, s0), { t: tOne + 0.7, c: s1, ease: 'power3.out' }, hold(b11 - 0.4, s1), { t: b11, c: flat(1.0) }]);
}

/* ---------- 6 · quoted 0.50% → paying 1.09%, more than double --- B1-12 ---------- */
{
  const s = S['B1-12'], a = s.start, b = endOf('B1-12');
  const tQuoted = findWord('B1-12', 'quoted'), tActually = findWord('B1-12', 'actually'), tDouble = findWord('B1-12', 'double');
  const vx = 100, vy = 60, vw = 880, vh = 310;
  glass('vs', { start: a, dur: r3(b - a), x: vx, y: vy, w: vw, h: vh, cueAt: tQuoted, lean: -6,
    inner: `<div class="pad vsp"><div class="vs"><div class="v0 cue"><em>quoted</em><b>0.50%</b></div>
        <div class="arrowwrap cue"><svg viewBox="0 0 236 64" width="236" height="64"><path class="ashaft" d="M8 50 C 84 50, 150 14, 222 14" fill="none" stroke="${Y}" stroke-width="6" stroke-linecap="round"/><path class="ahead" d="M232 14 l-22 -13 v26 z" fill="${Y}"/></svg></div>
        <div class="v1 cue"><em>paying</em><b>1.09%</b></div></div>
      <span class="tag2 cue">more than double</span></div>` });
  rise('#vs .v0', tQuoted); sfx('tick', tQuoted, 0.18);
  const tArrow = r3(tActually - 0.1);
  js.push(`const shaft = document.querySelector("#vs .ashaft"), shaftL = shaft.getTotalLength();
  gsap.set(shaft, { strokeDasharray: shaftL, strokeDashoffset: shaftL });
  gsap.set("#vs .ahead", { scale: 0, svgOrigin: "232 14" });
  tl.set("#vs .arrowwrap", { autoAlpha: 1 }, ${tArrow});
  tl.fromTo(shaft, { strokeDashoffset: shaftL }, { strokeDashoffset: 0, duration: 0.75, ease: "power2.inOut", immediateRender: false }, ${tArrow});
  tl.fromTo("#vs .ahead", { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2.5)", immediateRender: false }, ${r3(tArrow + 0.55)});`);
  sfx('swish', tArrow, 0.16);
  rise('#vs .v1', tArrow + 0.7, 30); sfx('pop', tArrow + 0.7, 0.18);
  js.push(`tl.fromTo("#vs .v1 b", { scale: 0.8 }, { scale: 1.08, duration: 0.5, ease: "back.out(2)", immediateRender: false }, ${r3(tArrow + 0.7)});`);
  js.push(`tl.fromTo("#vs .v1 b", { scale: 1.08 }, { scale: 1, duration: 0.4, ease: "power2.inOut", immediateRender: false }, ${r3(tArrow + 1.2)});`);
  js.push(`tl.fromTo("#vs .tag2", { autoAlpha: 0, scale: 0.7, rotation: -6 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.8)", immediateRender: false }, ${tDouble});`);
  sfx('bounce', tDouble, 0.22);
  const q0 = focus(1.08, 470, 330), q1 = focus(1.08, 590, 330), q2 = focus(1.14, W / 2, 360);
  chain('B1-12', [{ t: a, c: flat(1.0) }, { t: tQuoted + 0.5, c: q0, ease: 'power3.out' }, hold(tArrow, q0), { t: tArrow + 0.85, c: q1 }, hold(tDouble, q1), { t: tDouble + 0.5, c: q2, ease: 'power3.out' }, hold(b, q2)]);
}

/* ---------- 7 · two minutes with a statement --- B1-17 ---------- */
{
  const s = S['B1-17'], a = s.start, b = endOf('B1-17');
  const tTwo = findWord('B1-17', 'two'), tStatement = findWord('B1-17', 'statement'), tCalc = findWord('B1-17', 'calculator');
  const tx = 90, ty = 60, tw = 900, th = 300;
  glass('two', { start: a, dur: r3(b - a), x: tx, y: ty, w: tw, h: th, cueAt: tTwo + 0.05, lean: -6,
    inner: `<div class="pad twomin"><b class="n cue">2 min</b><div class="lines"><span class="l1 cue"><i></i>last month's statement</span><span class="l2 cue"><i></i>+ a calculator</span></div></div>` });
  js.push(`tl.fromTo("#two .n", { autoAlpha: 0, scale: 0.5, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", immediateRender: false }, ${r3(tTwo + 0.05)});`);
  sfx('pop', tTwo + 0.05, 0.18);
  arrive('#two .l1', tStatement, 40); sfx('tick', tStatement, 0.18);
  arrive('#two .l2', tCalc, 40); sfx('tick', tCalc, 0.18);
  const f1 = focus(1.1, W / 2, 360);
  chain('B1-17', [{ t: a, c: flat(1.04, 0, 0) }, { t: tTwo + 0.9, c: f1, ease: 'power3.out' }, hold(b - 0.5, f1), { t: b, c: flat(1.0) }]);
}

/* ---------- 8 · end card: NeroPay, what it is, and the honest line ---------- */
{
  const s = S['[END]'], a = s.start, d = s.dur, EW = 940, EH = 640;
  html.push(`<div id="end" class="clip card-full light" data-start="${a}" data-duration="${d}" data-track-index="4">
  <div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
  <div class="p3d" style="left:${(W - EW) / 2}px;top:${(H - EH) / 2}px;width:${EW}px;height:${EH}px"><div class="float"><div class="glass lglass" style="width:${EW}px;height:${EH}px"><i class="tint"></i><i class="sheen"></i>
    <div class="body tstack"><span class="wordmark cue"><b>Nero</b><em>Pay</em></span><span class="sub cue">Card terminal. Free EPOS software.</span><span class="foot cue">Check your statement first. If it matches your quote, stay where you are.</span></div><i class="rim"></i></div></div></div></div>`);
  const land = r3(a + 0.25 + 0.6);
  js.push(`tl.fromTo("#end", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#floor", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.45, immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .float", { autoAlpha: 0, rotationX: 12, y: 80, z: -300, scale: 0.92, transformPerspective: 1800 }, { autoAlpha: 1, rotationX: 0, y: 0, z: 0, scale: 1, duration: 1.15, ease: "power4.out", immediateRender: false }, ${r3(a + 0.25)});`);
  js.push(`tl.fromTo("#end .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.6, ease: "power2.inOut", immediateRender: false }, ${r3(land + 0.1)});`);
  js.push(`tl.fromTo("#end .float", { rotationY: 0 }, { rotationY: -4, duration: ${r3(d - 1.2)}, ease: "sine.inOut", immediateRender: false }, ${r3(a + 0.9)});`);
  rise('#end .wordmark', land, 34); sfx('impact', land, 0.28);
  rise('#end .sub', r3(land + BAR2 * 0.5), 24); sfx('tick', r3(land + BAR2 * 0.5), 0.2);
  rise('#end .foot', r3(land + BAR2 * 1.25), 16); sfx('tick', r3(land + BAR2 * 1.25), 0.16);
  sfx('riser', r3(a - SOUNDS.sounds.riser.duration + 0.85), 0.24);
  /* the last seconds of the track land on the end of the ad */
  sfx('music-outro', a, 0.4, { mediaStart: r3(Math.max(0, SOUNDS.sounds.music.outro - d)) });
  move(a, r3(a + d), flat(1.05, 0, 0), flat(1.0), 'power1.inOut');
}

/* brand mark, top left, on top of everything until the end card (pushed last so the stage never covers it) */
html.push(`<div id="brand" class="brand cue"><b>Nero</b><em>Pay</em></div>`);
rise('#brand', 0.25, 10);
leave('#brand', r3(S['[END]'].start - 0.45));

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
.brand{position:absolute;left:44px;top:40px;font-size:38px;font-weight:800;letter-spacing:-0.05em;line-height:1;text-shadow:0 6px 20px rgba(0,0,0,.45)}
.brand em,.wordmark em{font-style:normal;color:${Y}}
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
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.55),inset 0 -1px 0 rgba(255,255,255,.10),inset 1px 0 0 rgba(255,255,255,.18),inset -1px 0 0 rgba(255,255,255,.10)}
/* a slab on the dark stage: no footage behind it, so it is a lighter charcoal with the same rim */
.sglass{background:linear-gradient(135deg,rgba(255,255,255,.10) 0%,rgba(255,255,255,.05) 50%,rgba(255,255,255,.09) 100%)}
.lglass{background:linear-gradient(135deg,rgba(255,255,255,.80) 0%,rgba(255,255,255,.62) 50%,rgba(255,255,255,.74) 100%);color:${INK};
  box-shadow:0 40px 90px rgba(20,20,22,.10),0 8px 24px rgba(20,20,22,.06)}
.lglass .tint{background:radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,.7),transparent 55%),radial-gradient(70% 60% at 100% 100%,rgba(245,197,24,.16),transparent 60%)}
.lglass .rim{box-shadow:inset 0 2px 0 rgba(255,255,255,1),inset 0 0 0 1px rgba(255,255,255,.9)}
.lglass .sheen{background:linear-gradient(105deg,transparent 0%,rgba(255,255,255,.1) 35%,rgba(255,255,255,.55) 50%,rgba(255,255,255,.1) 65%,transparent 100%)}
.pad{height:100%;padding:38px 46px 34px;display:flex;flex-direction:column}
.th{display:block;font-size:26px;font-weight:500;letter-spacing:0;color:rgba(255,255,255,.72);margin-bottom:16px}
/* hook chip */
.chip{display:flex;align-items:center;justify-content:center;gap:12px;height:100%}
.chip .big{display:block;font-size:118px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.chip .q{display:block;font-size:118px;font-weight:800;font-style:italic;color:${Y};line-height:1;transform-origin:50% 60%}
.chip .strike{position:absolute;left:62px;top:50%;width:340px;height:11px;margin-top:-6px;display:block;background:${Y};border-radius:6px;transform-origin:0 50%}
/* cards */
.space{position:absolute;perspective:1500px;overflow:visible}
.orbit{position:absolute;inset:0;transform-style:preserve-3d;transform-origin:50% 55%}
.card{position:absolute;left:60px;top:220px;width:330px;height:208px;display:block;transform-style:preserve-3d;transform-origin:50% 50%}
.card .edge{position:absolute;inset:0;display:block;border-radius:26px;opacity:0}
.card .face{position:absolute;inset:0;border-radius:26px;overflow:hidden;opacity:0;box-shadow:0 26px 44px rgba(0,0,0,.34),0 6px 14px rgba(0,0,0,.18)}
.card.k0 .face{background:linear-gradient(135deg,#3a3a41 0%,#232327 55%,#2c2c31 100%)} .card.k0 .edge{background:#121214}
.card.k1 .face{background:linear-gradient(135deg,#ffdc63 0%,${Y} 50%,#d9a90f 100%)} .card.k1 .edge{background:#a37d0a}
.card.k2 .face{background:linear-gradient(135deg,#55698d 0%,#33425c 55%,#3d4d6a 100%)} .card.k2 .edge{background:#1b2332}
.card.k3 .face{background:linear-gradient(135deg,#faf8f3 0%,#e4e1d9 55%,#efece5 100%)} .card.k3 .edge{background:#b5b2a9}
.card .cshine{position:absolute;left:-30%;top:-40%;width:70%;height:180%;display:block;transform:rotate(18deg);background:linear-gradient(90deg,transparent,rgba(255,255,255,.22),transparent)}
.card .cchip{position:absolute;left:30px;top:30px;width:60px;height:44px;border-radius:9px;display:block;background:linear-gradient(135deg,#ffe38a 0%,${Y} 45%,#c99a0a 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(0,0,0,.18),0 1px 2px rgba(0,0,0,.2)}
.card .cchip::after{content:"";position:absolute;left:8px;right:8px;top:14px;height:1px;background:rgba(0,0,0,.2);box-shadow:0 8px 0 rgba(0,0,0,.2)}
.card.k1 .cchip{background:linear-gradient(135deg,#ffffff,#d6d6dc 55%,#b8b8c0)}
.card .cband{position:absolute;left:0;right:0;bottom:52px;height:28px;display:block;background:rgba(20,20,22,.34)}
.card.k0 .cband,.card.k2 .cband{background:rgba(0,0,0,.42)}
.card .crim{position:absolute;inset:0;display:block;border-radius:26px;box-shadow:inset 0 1.5px 0 rgba(255,255,255,.5),inset 0 -1px 0 rgba(0,0,0,.12)}
.card.k3 .crim{box-shadow:inset 0 1.5px 0 rgba(255,255,255,.95),inset 0 -1px 0 rgba(0,0,0,.08)}
/* big type, no glass */
.bigline{position:absolute;left:70px;top:96px;width:560px;display:flex;flex-direction:column;gap:6px}
.bigline span{display:block;font-size:86px;font-weight:800;letter-spacing:-0.045em;line-height:1.05;text-shadow:0 10px 34px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.35);transform-origin:0 50%}
.bigline .b2,.bigline .h2{color:${Y};font-style:italic}
.bigline.hook{top:110px;width:700px}
/* formula */
.formula{justify-content:center}
.frac{display:flex;flex-direction:column;align-items:stretch;gap:14px;margin:4px 0 30px;padding:0 10px}
.frac .row{display:flex;align-items:center;gap:22px;font-size:42px;font-weight:700;letter-spacing:-0.02em}
.frac .badge{display:flex;align-items:center;justify-content:center;flex:none;width:58px;height:58px;border-radius:50%;background:${Y};color:#141416;font-style:normal;font-size:32px;font-weight:800}
.frac .den{color:rgba(255,255,255,.88)}
.frac .line{display:block;height:5px;margin:2px 0;background:${Y};border-radius:3px;transform-origin:50% 50%;box-shadow:0 0 14px rgba(245,197,24,.55)}
.ops{display:flex;align-items:center;justify-content:center;gap:26px;font-size:50px;font-weight:600}
.ops .x100{display:inline-block;padding:6px 26px;border-radius:18px;background:rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.35);transform-origin:50% 50%}
.ops .res{position:relative;display:inline-block;font-size:64px;font-weight:800;color:${Y};font-style:italic;transform-origin:50% 50%;padding-bottom:6px}
.ops .res .under{position:absolute;left:0;right:0;bottom:-4px;height:6px;display:block;border-radius:3px;background:${Y};transform-origin:0 50%;box-shadow:0 0 12px rgba(245,197,24,.6)}
/* the result */
.sum{justify-content:center}
.sline{display:flex;justify-content:space-between;align-items:baseline;font-size:36px;font-weight:600;padding:10px 0}
.sline b{font-size:52px;font-weight:800;color:${Y};letter-spacing:-0.04em}
.sum .rule{display:block;height:3px;margin:14px 0 22px;background:rgba(255,255,255,.28);border-radius:2px;transform-origin:0 50%}
.big1{display:flex;flex-direction:column;align-items:flex-start;margin:0 0 10px}
.big1 em{font-style:normal;font-size:26px;font-weight:500;color:rgba(255,255,255,.75);letter-spacing:0}
.big1 b{font-size:190px;font-weight:800;color:${Y};letter-spacing:-0.06em;line-height:1;transform-origin:0 60%}
.foot{display:block;margin-top:auto;font-size:18px;font-weight:500;color:rgba(255,255,255,.6);letter-spacing:0}
/* quoted vs paying */
.vsp{justify-content:center;padding:26px 46px}
.vs{display:flex;align-items:center;justify-content:space-between;gap:16px}
.vs > div.v0,.vs > div.v1{display:flex;flex-direction:column;flex:none}
.vs em{font-style:normal;font-size:22px;font-weight:500;color:rgba(255,255,255,.7);letter-spacing:0.06em;text-transform:uppercase}
.vs b{font-size:84px;font-weight:800;letter-spacing:-0.04em;line-height:1.05;display:block;transform-origin:0 60%}
.vs .v0 b{color:rgba(255,255,255,.8)} .vs .v1 b{color:${Y}}
.vs .arrowwrap{flex:none;width:236px;height:64px;margin-top:22px}
.vs .arrowwrap svg{display:block;overflow:visible;filter:drop-shadow(0 0 8px rgba(245,197,24,.55))}
.tag2{display:inline-block;align-self:center;margin-top:18px;padding:8px 24px;border-radius:16px;background:${Y};color:#141416;font-size:30px;font-weight:800;font-style:italic;letter-spacing:-0.02em;transform-origin:50% 50%}
/* two minutes */
.twomin{flex-direction:row;align-items:center;gap:28px;padding:0 40px}
.twomin .n{display:block;flex:none;font-size:112px;font-weight:800;color:${Y};letter-spacing:-0.06em;line-height:1;white-space:nowrap;transform-origin:50% 60%}
.twomin .lines{display:flex;flex-direction:column;gap:14px}
.twomin .lines span{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:600;white-space:nowrap}
.twomin .lines i{display:block;flex:none;width:14px;height:14px;border-radius:4px;background:${Y}}
.twomin .l2{color:rgba(255,255,255,.88)}
/* full-frame cards: the dark stage for the diagrams, the light end card (blurred blobs are static) */
.card-full{left:0;top:0;width:${W}px;height:${H}px;background:#141416;overflow:hidden}
.card-full.dark{background:radial-gradient(120% 90% at 50% 110%,#26262c 0%,#141416 60%)}
.card-full.light{background:#f7f6f2;color:${INK}}
.blob{position:absolute;border-radius:50%;display:block;filter:blur(90px);pointer-events:none}
.blob.b1{left:-260px;top:-360px;width:1000px;height:900px;background:radial-gradient(circle,rgba(245,197,24,.55),rgba(245,197,24,0) 62%)}
.blob.b2{right:-380px;bottom:-460px;width:1100px;height:1000px;background:radial-gradient(circle,rgba(245,197,24,.42),rgba(245,197,24,0) 62%)}
.blob.b3{left:30%;top:50%;width:600px;height:500px;background:radial-gradient(circle,rgba(255,255,255,.9),rgba(255,255,255,0) 62%)}
.blob.d1{right:-300px;top:-300px;width:900px;height:900px;background:radial-gradient(circle,rgba(245,197,24,.22),rgba(245,197,24,0) 62%)}
.blob.d2{left:-360px;bottom:-380px;width:900px;height:900px;background:radial-gradient(circle,rgba(255,255,255,.10),rgba(255,255,255,0) 62%)}
.grain{position:absolute;inset:0;display:block;background:repeating-linear-gradient(0deg,rgba(255,255,255,.012) 0 2px,transparent 2px 4px)}
.tstack{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:0 70px}
.wordmark{display:block;font-size:176px;font-weight:800;letter-spacing:-0.05em;line-height:1;color:${INK}}
.tstack .sub{display:block;font-size:40px;font-weight:600;color:${INK};margin-top:6px}
.tstack .foot{display:block;margin-top:26px;font-size:24px;font-weight:500;color:#6d6c68;letter-spacing:0;max-width:760px;line-height:1.35}
#floor{position:absolute;left:0;right:0;bottom:0;height:380px;pointer-events:none;background:linear-gradient(180deg,rgba(10,10,12,0) 0%,rgba(10,10,12,.28) 45%,rgba(10,10,12,.5) 100%)}
.cap{left:0;right:0;width:${W}px;bottom:96px;display:flex;justify-content:center;pointer-events:none}
.cap .line{max-width:940px;text-align:center;font-size:52px;font-weight:600;line-height:1.16;letter-spacing:-0.035em;text-wrap:balance}
.cap .w{display:inline-block;color:rgba(255,255,255,.86);margin:0 0.03em}
.cap .w.em{font-style:italic;font-weight:800;font-size:1.06em}
</style>
</head>
<body>
<div id="root" data-composition-id="b1-ad" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
  <div id="world">
${html.filter((h) => !/class="clip cap"|id="brand"/.test(h)).map((h) => '    ' + h).join('\n')}
  </div>
  <div id="floor"></div>
${html.filter((h) => /class="clip cap"|id="brand"/.test(h)).map((h) => '  ' + h).join('\n')}
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
  window.__timelines = window.__timelines || {};
  window.__timelines["b1-ad"] = tl;
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'index.html'), page);
console.log('index.html — ' + TOTAL + 's, ' + segs.length + ' segments, ' + WORDLIST.length + ' words, ' + cam.length + ' camera moves, ' + sfxN + ' sounds' + (cutUsed ? ', ' + cutUsed + ' clips from assets/cut' : ', RAW clips (run cut.mjs)') + (estimated.length ? ' — word timing ESTIMATED for ' + estimated.join(', ') : ''));
segs.forEach((s) => console.log('  ' + s.id.padEnd(9) + String(s.start).padStart(8) + 's  ' + s.dur + 's'));

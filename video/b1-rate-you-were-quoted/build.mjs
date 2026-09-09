/* Generates index.html for the B1 re-edit from the clips on disk, the Whisper word timings and
   the hand trims. Run it again whenever a clip, a timing or a trim changes:

     node build.mjs            → writes index.html
     npx hyperframes check     → lint + layout + contrast
     npx hyperframes render -q draft

   Everything the composition does is a pure function of timeline time (HyperFrames seeks every
   frame), so all motion is authored here as absolute fromTo tweens on one paused GSAP timeline. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const W = 1920, H = 1080, FPS = 30, Y = '#F5C518';
const WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'data/words.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/edit.json'), 'utf8'));
const EMPH = ['effective', 'statement', 'fees', 'fee', 'flat', 'tiered', 'exit', 'term', 'rental', 'average', 'debit', 'credit', 'amex', 'own', 'renting', 'choose', 'cheapest', 'most'];

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

/* ---------- the cut ---------- */
const ORDER = ['B1-01', 'B1-02', 'B1-INTRO', '[TITLE]', 'B1-03', 'B1-04', 'B1-05', '[END]'];
const CARD = { '[TITLE]': 3.0, '[END]': 6.0 };
const XF = 0.35;                       // crossfade into and out of the title card
let t = 0;
const segs = [];
for (const id of ORDER) {
  if (CARD[id]) { segs.push({ id, kind: 'card', start: r3(t), dur: CARD[id] }); t += CARD[id]; continue; }
  const file = path.join(HERE, 'assets/clips', id + '.mp4');
  if (!fs.existsSync(file)) { console.log('skip ' + id + ' (no clip)'); continue; }
  const full = dur(file), inn = (EDIT[id] && EDIT[id].in) || 0, out = (EDIT[id] && EDIT[id].out) || 0;
  const d = r3(full - inn - out);
  const words = (WORDS[id] || []).map((w) => ({ w: w.w, s: r3(w.s - inn), e: r3(w.e - inn) })).filter((w) => w.e > 0 && w.s < d);
  segs.push({ id, kind: 'clip', start: r3(t), dur: d, mediaStart: inn, words, src: 'assets/clips/' + id + '.mp4' });
  t += d;
}
const TOTAL = r3(t);
const S = Object.fromEntries(segs.map((s) => [s.id, s]));
const at = (id, local) => r3(S[id].start + local);           // global time of a clip-local second
const wordAt = (id, i) => S[id].words[i];
const findWord = (id, text, nth = 0) => {                      // global start of the nth word matching text
  let k = 0;
  for (const w of S[id].words) if (clean(w.w) === text) { if (k++ === nth) return at(id, w.s); }
  throw new Error('no word ' + text + ' in ' + id);
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
const html = [], css = [], js = [];
const audio = [];
let wordIndex = 0;
const WORDLIST = [];   // [globalStart, globalEnd] per word, in DOM order

/* glass panel with 3D wrapper: <div class="clip p3d"><div class="float"><div class="glass">…<i class="sheen"></i></div></div></div> */
function glass(id, { start, dur, x, y, w, h, inner, cls = '', enterFrom = 22, track = 2 }) {
  html.push(`<div id="${id}" class="clip p3d ${cls}" data-start="${start}" data-duration="${dur}" data-track-index="${track}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px">
  <div class="float"><div class="idle"><div class="glass" style="width:${w}px;height:${h}px"><div class="body">${inner}</div><i class="sheen"></i></div></div></div></div>`);
  /* entrance on the 3D wrapper (never on the blurred element itself — Chrome drops frames when
     backdrop-filter and a 3D transform share an element); settle flat; exit: sink and fade */
  js.push(`tl.fromTo("#${id} .float", { autoAlpha: 0, rotationY: ${enterFrom}, x: ${enterFrom > 0 ? 50 : -50}, z: -140, transformPerspective: 1600 }, { autoAlpha: 1, rotationY: 0, x: 0, z: 0, duration: 0.75, ease: "power3.out", immediateRender: false }, ${start});`);
  js.push(`tl.fromTo("#${id} .float", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 22, duration: 0.35, ease: "power2.in", immediateRender: false }, ${r3(start + dur - 0.35)});`);
  js.push(`tl.set("#${id} .float", { autoAlpha: 0 }, ${r3(start + dur)});`);
  /* idle: a slow 2D bob, finite repeats sized to the panel's life */
  const cycle = 3.2, reps = Math.max(0, Math.floor(dur / cycle) - 1);
  js.push(`tl.fromTo("#${id} .idle", { y: 0 }, { y: -7, duration: ${cycle / 2}, ease: "sine.inOut", yoyo: true, repeat: ${reps * 2 + 1}, immediateRender: false }, ${start});`);
  /* travelling sheen: once on arrival, again every three seconds */
  const sreps = Math.max(0, Math.floor((dur - 1.4) / 3));
  js.push(`tl.fromTo("#${id} .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.4, ease: "power2.inOut", repeat: ${sreps}, repeatDelay: 1.6, immediateRender: false }, ${r3(start + 0.25)});`);
  sfx('whoosh', start, 0.16);
}
const SFXDUR = {}; let sfxN = 0;
function sfx(name, start, vol) {
  const id = 'sfx-' + name + '-' + Math.round(start * 100);
  if (!SFXDUR[name]) SFXDUR[name] = dur(path.join(HERE, 'assets/sfx', name + '.wav'));
  audio.push(`<audio id="${id}" src="assets/sfx/${name}.wav" data-start="${r3(start)}" data-duration="${SFXDUR[name]}" data-track-index="${12 + (sfxN++)}" data-volume="${vol}"></audio>`);
}

/* ---------- camera ---------- */
/* One world wrapper carries the camera (viewport-change): screen = S·offset + T, so to centre a point
   at world offset (ox, oy) from frame centre at scale S, translate by T = -offset·S.  Segments are
   authored back to back so no two tweens ever own the camera at once. */
const cam = [];
const clampCam = (c) => {                                   // a scaled world must still cover the frame
  const mx = (c.scale - 1) * W / 2, my = (c.scale - 1) * H / 2;
  return { scale: c.scale, x: r3(Math.max(-mx, Math.min(mx, c.x))), y: r3(Math.max(-my, Math.min(my, c.y))) };
};
function move(t0, t1, from, to, ease = 'power2.inOut') { cam.push({ t0: r3(t0), t1: r3(t1), from: clampCam(from), to: clampCam(to), ease }); }
const focus = (S, px, py) => ({ scale: S, x: r3(-(px - W / 2) * S), y: r3(-(py - H / 2) * S) });
const flat = (S, x = 0, y = 0) => ({ scale: S, x, y });

/* ---------- scenes ---------- */
for (const s of segs) {
  if (s.kind === 'clip') {
    html.push(`<video id="v-${s.id}" class="clip" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="0" muted playsinline></video>`);
    audio.push(`<audio id="a-${s.id}" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="10" data-volume="1"></audio>`);
    /* captions */
    const groups = phrases(s.words);
    groups.forEach((p, gi) => {
      const ps = r3(s.start + p[0].s);
      const next = groups[gi + 1] ? r3(s.start + groups[gi + 1][0].s) : Infinity;   // a phrase never overlaps the next
      const pe = Math.min(r3(s.start + p[p.length - 1].e + 0.35), next, r3(s.start + s.dur));
      const pd = r3(pe - ps);
      const spans = p.map((w) => {
        WORDLIST.push([r3(s.start + w.s), r3(s.start + w.e)]);
        return `<span class="w${isEmph(w.w) ? ' em' : ''}" data-i="${wordIndex++}">${esc(w.w)}</span>`;
      }).join(' ');
      const pid = 'cap-' + s.id + '-' + Math.round(p[0].s * 100);
      html.push(`<div id="${pid}" class="clip cap" data-start="${ps}" data-duration="${pd}" data-track-index="6"><div class="line">${spans}</div></div>`);
      /* phrases hard-cut: the only motion in a caption is the word turning yellow */
    });
  }
}

/* --- Frame 1: hook --- */
{
  const s = S['B1-01'], a = s.start, b = r3(s.start + s.dur);
  /* name plate for the first three seconds; the AI line is the on-screen disclosure the rails require */
  html.push(`<div id="disc" class="clip p3d" data-start="${a}" data-duration="3" data-track-index="8" style="left:72px;top:72px;width:340px;height:92px">
  <div class="float"><div class="idle"><div class="glass" style="width:340px;height:92px;border-radius:24px"><div class="body disc"><b></b><div><strong>Ava</strong><span>NeroPay · AI presenter</span></div></div><i class="sheen"></i></div></div></div></div>`);
  js.push(`tl.fromTo("#disc .float", { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out" }, ${a});`);
  js.push(`tl.fromTo("#disc .float", { autoAlpha: 1, x: 0 }, { autoAlpha: 0, x: -30, duration: 0.35, ease: "power2.in", immediateRender: false }, ${r3(a + 2.65)});`);
  js.push(`tl.set("#disc .float", { autoAlpha: 0 }, ${r3(a + 3)});`);
  js.push(`tl.fromTo("#disc .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.2, ease: "power2.inOut", immediateRender: false }, ${r3(a + 0.3)});`);
  /* the "0.5%?" chip */
  const tMaybe = findWord('B1-01', 'maybe'), tCent = findWord('B1-01', 'cent'), tNot = findWord('B1-01', 'not');
  const cx = 1230, cy = 250, cw = 400, ch = 190;
  glass('chip', { start: tMaybe, dur: r3(b - tMaybe), x: cx, y: cy, w: cw, h: ch, enterFrom: 26,
    inner: `<div class="chip"><span class="big">0.5%</span><span class="q">?</span><i class="strike"></i></div>` });
  js.push(`tl.fromTo("#chip .q", { autoAlpha: 0, scale: 0.4, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, ${tCent});`);
  js.push(`tl.fromTo("#chip .strike", { scaleX: 0, rotation: -8 }, { scaleX: 1, rotation: -8, duration: 0.4, ease: "power3.inOut", immediateRender: false }, ${tNot});`);
  js.push(`tl.set("#chip .strike", { scaleX: 0, rotation: -8 }, ${tMaybe});`);
  js.push(`tl.fromTo("#chip .big", { color: "#ffffff" }, { color: "rgba(255,255,255,0.55)", duration: 0.4, immediateRender: false }, ${tNot});`);
  /* camera: slow push, then a punch to the chip when she says it is not the rate you pay */
  move(a, tMaybe, flat(1.0), flat(1.05));
  move(tMaybe, r3(tMaybe + 0.9), flat(1.05), focus(1.12, cx + cw / 2 - 250, cy + ch / 2 + 140), 'power3.out');
  move(r3(tMaybe + 0.9), tNot, focus(1.12, cx + cw / 2 - 250, cy + ch / 2 + 140), focus(1.14, cx + cw / 2 - 240, cy + ch / 2 + 150), 'none');
  move(tNot, r3(tNot + 0.7), focus(1.14, cx + cw / 2 - 240, cy + ch / 2 + 150), focus(1.22, cx + cw / 2 - 120, cy + ch / 2 + 90), 'power3.out');
  move(r3(tNot + 0.7), b, focus(1.22, cx + cw / 2 - 120, cy + ch / 2 + 90), flat(1.08), 'power2.inOut');
}

/* --- Frame 2: one card, then a lot more --- */
{
  const s = S['B1-02'], a = s.start, b = r3(s.start + s.dur);
  const tOne = findWord('B1-02', 'one'), tMore = findWord('B1-02', 'more');
  const cards = [0, 1, 2, 3].map((i) => `<div class="card c${i}"><i class="cchip"></i><i class="cstripe"></i></div>`).join('');
  html.push(`<div id="fan" class="clip p3d" data-start="${tOne}" data-duration="${r3(b - tOne)}" data-track-index="2" style="left:1180px;top:170px;width:560px;height:420px"><div class="float">${cards}</div></div>`);
  js.push(`tl.fromTo("#fan .c0", { autoAlpha: 0, y: 50, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, ${tOne});`);
  [1, 2, 3].forEach((i) => {
    js.push(`tl.fromTo("#fan .c${i}", { autoAlpha: 0, x: 0, y: 0, rotation: 0 }, { autoAlpha: 1, x: ${i * 96}, y: ${-i * 42}, rotation: ${i * 7}, duration: 0.55, ease: "back.out(1.4)", immediateRender: false }, ${r3(tMore + (i - 1) * 0.1)});`);
  });
  js.push(`tl.fromTo("#fan .float", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: 30, duration: 0.3, ease: "power2.in", immediateRender: false }, ${r3(b - 0.3)});`);
  js.push(`tl.set("#fan .float", { autoAlpha: 0 }, ${b});`);
  sfx('pop', tOne, 0.14); sfx('whoosh', tMore, 0.14);
  /* camera: pull back with a drift from left to right, then lean toward the fan */
  move(a, tOne, flat(1.08, 40, 0), flat(1.0, -30, 0));
  move(tOne, tMore, flat(1.0, -30, 0), flat(1.04, -60, 10), 'power1.inOut');
  move(tMore, b, flat(1.04, -60, 10), focus(1.10, 1300, 470), 'power2.inOut');
}

/* --- Frame 3: Ava's intro line --- */
{
  const s = S['B1-INTRO'], a = s.start, b = r3(s.start + s.dur);
  move(a, r3(b - XF), flat(1.0), flat(1.06), 'power1.inOut');
}

/* --- Frame 4: title card --- */
{
  const s = S['[TITLE]'], a = r3(s.start - XF), d = r3(s.dur + 2 * XF);
  html.push(`<div id="title" class="clip card-full" data-start="${a}" data-duration="${d}" data-track-index="4">
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="p3d" style="left:${(W - 1240) / 2}px;top:${(H - 560) / 2}px;width:1240px;height:560px"><div class="float"><div class="idle"><div class="glass tglass" style="width:1240px;height:560px">
    <div class="body tstack"><span class="kicker">EXPLAINED BY</span><span class="wordmark"><b>Nero</b><em>Pay</em></span><span class="ep">The rate you were quoted</span></div><i class="sheen"></i></div></div></div></div></div>`);
  js.push(`tl.fromTo("#title", { autoAlpha: 0 }, { autoAlpha: 1, duration: ${XF}, ease: "power2.inOut" }, ${a});`);
  js.push(`tl.fromTo("#title", { autoAlpha: 1 }, { autoAlpha: 0, duration: ${XF}, ease: "power2.inOut", immediateRender: false }, ${r3(a + d - XF)});`);
  js.push(`tl.set("#title", { autoAlpha: 0 }, ${r3(a + d)});`);
  js.push(`tl.fromTo("#title .float", { autoAlpha: 0, rotationY: -16, rotationX: 5, z: -220, scale: 0.94, transformPerspective: 1800 }, { autoAlpha: 1, rotationY: 0, rotationX: 0, z: 0, scale: 1, duration: 1.0, ease: "power4.out", immediateRender: false }, ${r3(a + XF * 0.5)});`);
  js.push(`tl.fromTo("#title .idle", { y: 0 }, { y: -6, duration: 1.6, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${r3(a + XF)});`);
  js.push(`tl.fromTo("#title .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.5, ease: "power2.inOut", immediateRender: false }, ${r3(a + XF + 0.5)});`);
  js.push(`tl.fromTo("#title .kicker", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(a + XF + 0.45)});`);
  js.push(`tl.fromTo("#title .wordmark", { autoAlpha: 0, y: 30, scale: 0.94 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, ${r3(a + XF + 0.55)});`);
  js.push(`tl.fromTo("#title .ep", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(a + XF + 0.8)});`);
  js.push(`tl.fromTo("#title .g1", { scale: 0.9, opacity: 0.35 }, { scale: 1.12, opacity: 0.55, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#title .g2", { scale: 1.1, opacity: 0.25 }, { scale: 0.9, opacity: 0.4, duration: 1.8, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  sfx('rise', r3(a + XF), 0.2);
  move(a, r3(a + d - XF), flat(1.06), flat(1.0), 'power1.inOut');
}

/* --- Frame 5: the advertised-rate table --- */
{
  const s = S['B1-03'], a = s.start, b = r3(s.start + s.dur);
  const tAdv = findWord('B1-03', 'advertised'), tDebit = findWord('B1-03', 'debit'), tCheap = findWord('B1-03', 'cheapest');
  const rows = [['Consumer debit', '0.50%', 'debit'], ['Consumer credit', '1.20%'], ['Business / commercial', '2.60%'], ['American Express', '1.75%'], ['International / non-UK', '2.90%']];
  const tx = 1130, ty = 150, tw = 720, th = 560;
  glass('table', { start: r3(tAdv - 0.2), dur: r3(b - tAdv + 0.2), x: tx, y: ty, w: tw, h: th, enterFrom: 24,
    inner: `<div class="table"><span class="th">the advertised rate</span>${rows.map(([n, v, c]) => `<div class="row${c ? ' ' + c : ''}"><span>${n}</span><b>${v}</b></div>`).join('')}</div>` });
  rows.forEach((_, i) => js.push(`tl.fromTo("#table .row:nth-of-type(${i + 1})", { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: "power3.out", immediateRender: false }, ${r3(tAdv + 0.25 + i * 0.09)});`));
  js.push(`tl.fromTo("#table .row.debit", { backgroundColor: "rgba(245,197,24,0)" }, { backgroundColor: "rgba(245,197,24,0.16)", duration: 0.35, ease: "power2.out", immediateRender: false }, ${tDebit});`);
  js.push(`tl.fromTo("#table .row.debit b", { scale: 1, color: "#F5C518" }, { scale: 1.18, color: "#F5C518", duration: 0.35, ease: "back.out(2)", immediateRender: false }, ${tDebit});`);
  js.push(`tl.fromTo("#table .row.debit b", { scale: 1.18 }, { scale: 1.08, duration: 0.4, ease: "power2.inOut", immediateRender: false }, ${tCheap});`);
  /* camera: settle, then push onto the 0.50% cell, hold, ease back on "cheapest" */
  const cellX = tx + tw - 110, cellY = ty + 108 + 52;
  move(a, tAdv, flat(1.0), flat(1.03, -20, 0), 'power1.inOut');
  move(tAdv, tDebit, flat(1.03, -20, 0), flat(1.05, -60, 0), 'power1.inOut');
  move(tDebit, r3(tDebit + 0.9), flat(1.05, -60, 0), focus(1.32, cellX - 210, cellY + 120), 'power3.out');
  move(r3(tDebit + 0.9), tCheap, focus(1.32, cellX - 210, cellY + 120), focus(1.34, cellX - 200, cellY + 130), 'none');
  move(tCheap, r3(tCheap + 1.1), focus(1.34, cellX - 200, cellY + 130), flat(1.06, -40, 0), 'power2.inOut');
  move(r3(tCheap + 1.1), b, flat(1.06, -40, 0), flat(1.08, -50, 0), 'none');
}

/* --- Frame 6: the rate ladder --- */
{
  const s = S['B1-04'], a = s.start, b = r3(s.start + s.dur);
  const tCredit = findWord('B1-04', 'credit'), tCompany = findWord('B1-04', 'company'), tAmex = findWord('B1-04', 'amex'), tOver = findWord('B1-04', 'overseas'), tMost = findWord('B1-04', 'most');
  const bars = [['Debit', '0.50%', 0.18, a + 0.05], ['Credit', '1.20%', 0.42, tCredit + 0.15], ['Business', '2.60%', 0.86, tCompany + 0.1], ['Amex', '1.75%', 0.6, tAmex + 0.1], ['Overseas', '2.90%', 0.96, tOver + 0.1]];
  const lx = 1110, ly = 130, lw = 750, lh = 640;
  glass('ladder', { start: a, dur: s.dur, x: lx, y: ly, w: lw, h: lh, enterFrom: 24,
    inner: `<div class="ladder"><span class="th">what each card costs</span><div class="bars">${bars.map(([n, v, h], i) => `<div class="bar b${i}"><b style="bottom:calc(${Math.round(h * 100)}% + 58px)">${v}</b><i style="height:${Math.round(h * 100)}%"></i><span>${n}</span></div>`).join('')}</div></div>` });
  bars.forEach(([, , , when], i) => {
    js.push(`tl.fromTo("#ladder .b${i} i", { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, ${r3(when)});`);
    js.push(`tl.fromTo("#ladder .b${i} b", { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power3.out", immediateRender: false }, ${r3(when + 0.3)});`);
    js.push(`tl.fromTo("#ladder .b${i} span", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, immediateRender: false }, ${r3(when)});`);
  });
  js.push(`tl.fromTo("#ladder .b4 i", { backgroundColor: "rgba(255,255,255,0.6)" }, { backgroundColor: "#F5C518", duration: 0.35, immediateRender: false }, ${tMost});`);
  js.push(`tl.fromTo("#ladder .b2 i", { backgroundColor: "rgba(255,255,255,0.6)" }, { backgroundColor: "#F5C518", duration: 0.35, immediateRender: false }, ${tMost});`);
  /* camera: pan across the shot toward the ladder, then punch on "most" */
  move(a, tAmex, flat(1.04, 30, 0), flat(1.06, -70, 0), 'none');
  move(tAmex, tMost, flat(1.06, -70, 0), flat(1.08, -90, 0), 'power1.inOut');
  move(tMost, r3(tMost + 0.6), flat(1.08, -90, 0), focus(1.2, lx + lw - 200, ly + 330), 'power3.out');
  move(r3(tMost + 0.6), b, focus(1.2, lx + lw - 200, ly + 330), focus(1.22, lx + lw - 210, ly + 335), 'none');
}

/* --- Frame 7: their card, your rate --- */
{
  const s = S['B1-05'], a = s.start, b = r3(s.start + s.dur);
  const tChoose = findWord('B1-05', 'choose'), tPocket = findWord('B1-05', 'pocket'), tRate = findWord('B1-05', 'rate');
  const cards = [0, 1, 2, 3].map((i) => `<div class="card c${i}"><i class="cchip"></i><i class="cstripe"></i></div>`).join('');
  html.push(`<div id="hand" class="clip p3d" data-start="${a}" data-duration="${s.dur}" data-track-index="2" style="left:1200px;top:110px;width:600px;height:560px"><div class="float">${cards}<div class="tagwrap"><div class="tag glass"><div class="body"><span>their card.</span><em>your rate.</em></div><i class="sheen"></i></div></div></div></div>`);
  [0, 1, 2, 3].forEach((i) => js.push(`tl.fromTo("#hand .c${i}", { autoAlpha: 0, y: 90, rotation: 0, x: 0, rotationY: 24, transformPerspective: 1400 }, { autoAlpha: 1, y: ${-i * 30}, x: ${i * 84}, rotation: ${-12 + i * 9}, rotationY: -6, duration: 0.55, ease: "back.out(1.4)", immediateRender: false }, ${r3(a + 0.1 + i * 0.08)});`));
  /* on "pocket" the last card comes forward and grows; the others sink */
  js.push(`tl.fromTo("#hand .c3", { x: 252, y: -90, rotation: 15, scale: 1, rotationY: -6 }, { x: 130, y: 30, rotation: 0, scale: 1.35, rotationY: 0, z: 120, duration: 0.6, ease: "power3.out", immediateRender: false }, ${tPocket});`);
  [0, 1, 2].forEach((i) => js.push(`tl.fromTo("#hand .c${i}", { autoAlpha: 1, y: ${-i * 30} }, { autoAlpha: 0.35, y: ${-i * 30 + 40}, duration: 0.5, ease: "power2.inOut", immediateRender: false }, ${tPocket});`));
  js.push(`tl.fromTo("#hand .tagwrap", { autoAlpha: 0, y: 30, scale: 0.92 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(1.4)", immediateRender: false }, ${r3(tRate - 0.1)});`);
  js.push(`tl.fromTo("#hand .tag .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.0, ease: "power2.inOut", immediateRender: false }, ${r3(tRate + 0.2)});`);
  js.push(`tl.fromTo("#hand .float", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.3, ease: "power2.in", immediateRender: false }, ${r3(b - 0.3)});`);
  js.push(`tl.set("#hand .float", { autoAlpha: 0 }, ${b});`);
  sfx('whoosh', a + 0.1, 0.14); sfx('pop', tPocket, 0.16);
  /* camera: push onto Ava for the line, slide to the card on "pocket", release at the end */
  move(a, tChoose, flat(1.0), flat(1.1, 0, 20), 'power2.out');
  move(tChoose, tPocket, flat(1.1, 0, 20), flat(1.08, -30, 10), 'power1.inOut');
  move(tPocket, r3(tPocket + 0.7), flat(1.08, -30, 10), focus(1.2, 1200 + 300, 150 + 260), 'power3.out');
  move(r3(tPocket + 0.7), r3(b - 0.6), focus(1.2, 1500, 410), focus(1.22, 1495, 405), 'none');
  move(r3(b - 0.6), b, focus(1.22, 1495, 405), flat(1.04), 'power2.inOut');
}

/* --- Frame 8: end card --- */
{
  const s = S['[END]'], a = s.start, d = s.dur;
  html.push(`<div id="end" class="clip card-full" data-start="${a}" data-duration="${d}" data-track-index="4">
  <div class="glow g1"></div><div class="glow g2"></div>
  <div class="p3d" style="left:${(W - 1100) / 2}px;top:${(H - 520) / 2}px;width:1100px;height:520px"><div class="float"><div class="idle"><div class="glass tglass" style="width:1100px;height:520px">
    <div class="body tstack end"><span class="wordmark"><b>Nero</b><em>Pay</em></span><span class="sub">Subscribe for more</span><span class="legal">Illustrative figures. No saving is guaranteed. NeroPay is a trading name of Nero Panda Ltd.</span></div><i class="sheen"></i></div></div></div></div></div>`);
  js.push(`tl.fromTo("#end", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, ease: "power2.inOut", immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .float", { autoAlpha: 0, rotationY: 14, z: -200, scale: 0.94, transformPerspective: 1800 }, { autoAlpha: 1, rotationY: 0, z: 0, scale: 1, duration: 1.0, ease: "power4.out", immediateRender: false }, ${r3(a + 0.25)});`);
  js.push(`tl.fromTo("#end .idle", { y: 0 }, { y: -6, duration: 1.5, ease: "sine.inOut", yoyo: true, repeat: 3, immediateRender: false }, ${r3(a + 0.25)});`);
  js.push(`tl.fromTo("#end .sheen", { xPercent: -140 }, { xPercent: 240, duration: 1.5, ease: "power2.inOut", repeat: 1, repeatDelay: 2, immediateRender: false }, ${r3(a + 0.8)});`);
  js.push(`tl.fromTo("#end .wordmark", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out", immediateRender: false }, ${r3(a + 0.6)});`);
  js.push(`tl.fromTo("#end .sub", { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(a + 0.85)});`);
  js.push(`tl.fromTo("#end .legal", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, immediateRender: false }, ${r3(a + 1.2)});`);
  js.push(`tl.fromTo("#end .g1", { scale: 1.1, opacity: 0.4 }, { scale: 0.92, opacity: 0.55, duration: 3, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  js.push(`tl.fromTo("#end .g2", { scale: 0.9, opacity: 0.3 }, { scale: 1.1, opacity: 0.42, duration: 3, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${a});`);
  sfx('tick', a + 0.3, 0.16);
  move(a, r3(a + d), flat(1.04), flat(1.0), 'power1.out');
}

/* ---------- camera tweens: back to back, explicit from/to ---------- */
cam.sort((p, q) => p.t0 - q.t0);
for (let i = 1; i < cam.length; i++) if (cam[i].t0 < cam[i - 1].t1 - 0.001) throw new Error('camera segments overlap at ' + cam[i].t0);
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
/* liquid glass — the blur sits on an oversized ::before (clipped by the panel) so the backdrop
   dissolves at the edges instead of ending in a hard block; the tint is even so no patch of the
   footage stays saturated; nothing on this element is ever transformed */
.glass{position:absolute;left:0;top:0;border-radius:34px;overflow:hidden;isolation:isolate;
  background:linear-gradient(135deg,rgba(255,255,255,.30) 0%,rgba(255,255,255,.18) 45%,rgba(255,255,255,.16) 60%,rgba(255,255,255,.26) 100%);
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.7),inset 0 -1px 0 rgba(255,255,255,.18),inset 1px 0 0 rgba(255,255,255,.26),inset -1px 0 0 rgba(255,255,255,.14),0 40px 80px rgba(0,0,0,.40),0 6px 18px rgba(0,0,0,.24)}
.glass::before{content:"";position:absolute;inset:-60px;z-index:0;
  -webkit-backdrop-filter:blur(34px) saturate(135%) brightness(1.02);backdrop-filter:blur(34px) saturate(135%) brightness(1.02)}
.glass::after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:2;
  box-shadow:inset 0 0 0 1px rgba(255,255,255,.22),inset 0 0 30px rgba(255,255,255,.06);
  background:radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,.22),transparent 55%),radial-gradient(80% 60% at 100% 100%,rgba(245,197,24,.08),transparent 60%)}
.glass .body{position:absolute;inset:0;z-index:3}
.sheen{position:absolute;top:-20%;left:0;width:45%;height:140%;display:block;pointer-events:none;z-index:1;
  background:linear-gradient(105deg,transparent 0%,rgba(255,255,255,.04) 35%,rgba(255,255,255,.20) 50%,rgba(255,255,255,.04) 65%,transparent 100%)}
/* disclosure */
.disc{display:flex;align-items:center;gap:18px;padding:0 28px}
.disc b{display:block;width:14px;height:14px;background:${Y};border-radius:4px;flex:none}
.disc strong{display:block;font-size:30px;font-weight:700;line-height:1.05}
.disc span{display:block;font-size:17px;font-weight:500;color:rgba(255,255,255,.88);margin-top:3px;letter-spacing:0}
/* hook chip */
.chip{display:flex;align-items:center;justify-content:center;gap:10px;height:100%}
.chip .big{display:block;font-size:104px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.chip .q{display:block;font-size:104px;font-weight:800;font-style:italic;color:${Y};line-height:1;transform-origin:50% 60%}
.chip .strike{position:absolute;left:52px;top:50%;width:296px;height:10px;margin-top:-5px;display:block;background:${Y};border-radius:5px;transform-origin:0 50%}
/* cards */
.card{position:absolute;left:40px;top:180px;width:300px;height:190px;border-radius:26px;display:block;transform-origin:50% 100%;
  background:linear-gradient(135deg,rgba(255,255,255,.26),rgba(255,255,255,.08) 45%,rgba(255,255,255,.16));
  -webkit-backdrop-filter:blur(22px) saturate(170%);backdrop-filter:blur(22px) saturate(170%);
  box-shadow:inset 0 1.5px 0 rgba(255,255,255,.6),inset 0 0 0 1px rgba(255,255,255,.18),0 30px 60px rgba(0,0,0,.4)}
.card .cchip{position:absolute;left:28px;top:28px;width:56px;height:42px;border-radius:9px;display:block;background:linear-gradient(135deg,${Y},#c99a0a)}
.card .cstripe{position:absolute;left:0;right:0;bottom:44px;height:26px;display:block;background:rgba(20,20,22,.55)}
.card.c1 .cchip{background:linear-gradient(135deg,rgba(255,255,255,.9),rgba(255,255,255,.5))}
.card.c2 .cchip{background:linear-gradient(135deg,#9ad0ff,#4b86c6)}
.card.c3 .cchip{background:linear-gradient(135deg,#ffd27a,${Y})}
#hand .tag{left:60px;top:440px;width:470px;height:104px;border-radius:26px;display:flex;align-items:center;justify-content:center;gap:14px;font-size:38px;font-weight:600}
#hand .tag em{font-style:italic;font-weight:800;color:${Y}}
/* table */
.table{height:100%;padding:36px 44px;display:flex;flex-direction:column;gap:8px}
.th{display:block;font-size:24px;font-weight:500;letter-spacing:0.02em;color:rgba(255,255,255,.88);margin-bottom:12px}
.table .row{display:flex;align-items:center;justify-content:space-between;height:84px;padding:0 24px;border-radius:18px;font-size:36px;font-weight:600}
.table .row span{display:block}
.table .row b{display:block;font-size:42px;font-weight:800;letter-spacing:-0.04em;transform-origin:100% 50%}
.table .row.debit b{color:${Y}}
/* ladder */
.ladder{position:relative;height:100%;padding:36px 44px 30px}
.bars{position:absolute;left:44px;right:44px;top:100px;bottom:30px;display:flex;align-items:flex-end;justify-content:space-between;gap:22px}
.bar{position:relative;flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end}
.bar i{display:block;width:100%;background:rgba(255,255,255,.6);border-radius:16px 16px 8px 8px;transform-origin:50% 100%;box-shadow:inset 0 2px 0 rgba(255,255,255,.7)}
.bar b{position:absolute;left:0;right:0;text-align:center;font-size:34px;font-weight:800;letter-spacing:-0.04em}
.bar span{display:block;margin-top:14px;font-size:24px;font-weight:600;color:rgba(255,255,255,.95);height:30px}
.bar{padding-bottom:44px}
.bar i{margin-bottom:0}
.bar span{position:absolute;bottom:0}
.bar .lbl{display:none}
/* title + end cards */
.card-full{left:0;top:0;width:${W}px;height:${H}px;background:#141416;overflow:hidden}
.glow{position:absolute;width:1200px;height:1200px;border-radius:50%;display:block;filter:blur(40px);pointer-events:none}
.glow.g1{left:-300px;top:-450px;background:radial-gradient(circle,rgba(245,197,24,.28),transparent 62%)}
.glow.g2{right:-400px;bottom:-500px;background:radial-gradient(circle,rgba(255,255,255,.12),transparent 62%)}

.tstack{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px;text-align:center}
.kicker{display:block;font-size:30px;font-weight:500;letter-spacing:0.38em;color:rgba(255,255,255,.7);padding-left:0.38em}
.wordmark{display:block;font-size:210px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.tstack .ep{display:block;font-size:54px;font-weight:600;font-style:italic;letter-spacing:-0.03em;color:rgba(255,255,255,.92)}
.tstack.end .wordmark{font-size:150px}
.tstack .sub{display:block;font-size:52px;font-weight:600}
.tstack .legal{display:block;max-width:900px;font-size:24px;font-weight:500;color:rgba(255,255,255,.62);margin-top:26px;letter-spacing:0}
/* captions: no plate, tight Poppins, yellow on the spoken word */
.cap{left:0;right:0;width:${W}px;bottom:118px;display:flex;justify-content:center;pointer-events:none}
.cap .line{max-width:1500px;text-align:center;font-size:56px;font-weight:600;line-height:1.16;letter-spacing:-0.035em;
  text-wrap:balance}
.cap .w{display:inline-block;color:rgba(255,255,255,.8);transform-origin:50% 60%;margin:0 0.03em}
.cap .w.em{font-style:italic;font-weight:800;font-size:1.06em}
</style>
</head>
<body>
<div id="root" data-composition-id="b1" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
  <div id="world">
${html.filter((h) => !/class="clip cap"/.test(h)).map((h) => '    ' + h).join('\n')}
  </div>
${html.filter((h) => /class="clip cap"/.test(h)).map((h) => '  ' + h).join('\n')}
${audio.map((a) => '  ' + a).join('\n')}
</div>
<script>
(function () {
  const tl = gsap.timeline({ paused: true });
  /* camera (viewport-change): one world transform composed from one state object */
  const world = document.getElementById("world");
  const cam = { scale: 1, x: 0, y: 0 };
  function applyCam() { world.style.transform = "translate(" + cam.x + "px, " + cam.y + "px) scale(" + cam.scale + ")"; }
  applyCam();
${camCode.split('\n').map((l) => '  ' + l).join('\n')}
  /* captions: one linear driver colours the word being spoken (asr-keyword-glow, single driver) */
  const WORDS = ${JSON.stringify(WORDLIST)};
  const spans = Array.from(document.querySelectorAll(".cap .w")).sort((p, q) => +p.dataset.i - +q.dataset.i);
  const driver = { t: 0 };
  function paint() {
    const now = driver.t;
    for (let i = 0; i < spans.length; i++) {
      const s = WORDS[i][0], e = WORDS[i][1], el = spans[i];
      if (now < s - 0.02) { el.style.color = "rgba(255,255,255,0.8)"; el.style.transform = "scale(1)"; }
      else if (now < e + 0.04) {
        const k = Math.min(1, (now - s + 0.02) / 0.12);          // 120 ms attack
        const pop = 1 + 0.07 * (k < 1 ? k : 1);
        el.style.color = "${Y}"; el.style.transform = "scale(" + pop.toFixed(3) + ")";
      } else { el.style.color = "#ffffff"; el.style.transform = "scale(1)"; }
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
console.log('index.html — ' + TOTAL + 's, ' + segs.length + ' segments, ' + WORDLIST.length + ' words, ' + cam.length + ' camera moves');
segs.forEach((s) => console.log('  ' + s.id.padEnd(9) + String(s.start).padStart(7) + 's  ' + s.dur + 's'));

/* Generates index.html for B1 "The rate you were quoted" — v8: the v6 liquid-glass overlays (Faisal, 11 Sep 2026:
   "I want the previous liquid glass look, the animated bar charts, the large 0.5% with the line through it") on
   v7's angle-cut proxies, with v7's title animation re-themed light and an end card in the same style. Run it
   again whenever a clip, a timing or a trim changes:

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
import { cropFor } from './angles.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const V = process.env.ORIENT === 'vertical';   // 9:16 for Reels / TikTok: the same cut, sounds and overlays, re-laid out
const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = 30, Y = '#F5C518', INK = '#141416';
/* Vertical: the footage is a 4:5 crop on Ava (sandbox.sh cuts it from the 4K source, so nothing is upscaled),
   FH tall, sat on the floor of the frame; a blurred, darkened copy of the same clip fills the band above it.
   Every overlay lives in that top band, the captions sit over her chest, all inside the Reels/TikTok safe
   area (nothing in the bottom 440px, nothing hugging the right edge). */
const FT = V ? 570 : 0, FH = V ? 1350 : H;
const WORDS = JSON.parse(fs.readFileSync(path.join(HERE, 'data/words.json'), 'utf8'));
const SCRIPT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/script.json'), 'utf8'));
const EDIT = JSON.parse(fs.readFileSync(path.join(HERE, 'data/edit.json'), 'utf8'));
const CUTS = fs.existsSync(path.join(HERE, 'data/cuts.json')) ? JSON.parse(fs.readFileSync(path.join(HERE, 'data/cuts.json'), 'utf8')) : null;
const SOUNDS = JSON.parse(fs.readFileSync(path.join(HERE, '../library/sounds.json'), 'utf8'));
const EMPH = ['effective', 'statement', 'fees', 'fee', 'flat', 'tiered', 'exit', 'term', 'rental', 'average', 'debit', 'credit', 'amex', 'own', 'renting', 'choose', 'cheapest', 'most', 'double', 'less', 'payout', 'calculator'];

const ffprobe = process.env.HYPERFRAMES_FFPROBE_PATH || 'ffprobe';
const ffmpeg = process.env.HYPERFRAMES_FFMPEG_PATH || 'ffmpeg';
const SFX_GAIN = 0.75;                      // every effect 2.5 dB under the v6 mix (Faisal: "slightly lower"); the music beds are not effects
const BEDS = new Set(['music-intro', 'music-outro']);
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
/* Every segment starts and ends on the frame grid (LESSONS.md #63): the renderer floors each boundary to a frame
   and clocks the clip's media from the raw start, so a start that is not exactly k/FPS — above it or below it —
   shows the previous shot's held picture under the next shot's caption and camera for one frame. Segment lengths
   are whole frames and the start is written as the exact double k/FPS (String() round-trips it), never rounded. */
const grid = (frames) => frames / FPS;
let tf = 0;                              // the timeline, in frames
const segs = [];
let estimated = [], cutUsed = 0;
for (const id of ORDER) {
  if (CARD[id]) {
    const cf = Math.round(CARD[id] * FPS);
    segs.push({ id, kind: 'card', start: grid(tf), dur: grid(cf) }); tf += cf; continue;
  }
  const cutFile = path.join(HERE, 'assets/cut', id + '.mp4');
  const useCut = CUTS && CUTS[id] && fs.existsSync(cutFile);
  const file = useCut ? cutFile : path.join(HERE, 'assets/clips', id + '.mp4');
  if (!fs.existsSync(file)) { console.log('skip ' + id + ' (no clip)'); continue; }
  let d, inn = 0, words;
  if (useCut) {
    d = dur(file); words = CUTS[id].words; cutUsed++;
  } else {
    const full = dur(file); inn = (EDIT[id] && EDIT[id].in) || 0; const out = (EDIT[id] && EDIT[id].out) || 0;
    d = r3(full - inn - out);
    let raw = WORDS[id];
    if (!raw || !raw.length) { raw = estimateWords(SCRIPT[id], full); estimated.push(id); }
    words = raw.map((w) => ({ w: w.w, s: r3(w.s - inn), e: r3(w.e - inn) }));
  }
  const df = Math.round(d * FPS);
  const start = grid(tf), dur_ = grid(df);
  words = words.filter((w) => w.s < dur_);
  segs.push({ id, kind: 'clip', start, dur: dur_, mediaStart: inn, words, src: (useCut ? 'assets/cut/' : 'assets/clips/') + id + '.mp4' });
  tf += df;
}
const TOTAL = grid(tf);
const S = Object.fromEntries(segs.map((s) => [s.id, s]));
const at = (id, local) => r3(S[id].start + local);
const endOf = (id) => r3(S[id].start + S[id].dur);
/* global start of the nth word whose cleaned text matches (or starts with) `text` */
const findWord = (id, text, nth = 0) => {
  let k = 0;
  for (const w of S[id].words) if (clean(w.w) === text || clean(w.w).startsWith(text)) { if (k++ === nth) return at(id, w.s); }
  throw new Error('no word "' + text + '" in ' + id + ': ' + S[id].words.map((w) => w.w).join(' '));
};

/* the title's timings, needed before the clip loop: the INTRO caption ends as the card starts to grow */
const TT = (() => {
  const tExpl = findWord('B1-INTRO', 'explained'), tNero = findWord('B1-INTRO', 'neropay'), EXP = r3(22 / FPS);
  return { seedAt: r3(tExpl - 0.05), expandAt: tNero, EXP, landAt: r3(tNero + EXP) };
})();

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
const html = [], js = [], audio = [], stages = [];   // stages: the title and end cards, outside the camera
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
    const attrs = `src="${has ? blur : s.src}" data-start="${a}" data-duration="${r3(b - a)}" data-media-start="${r3(s.mediaStart + a - s.start)}" data-track-index="1" muted playsinline`;
    return (V ? `<video id="bgf-${id}-${s.id}" class="bgv f ${has ? 'lo' : 'hi'}" ${attrs}></video>` : '') + `<video id="bg-${id}-${s.id}" class="bgv ${has ? 'lo' : 'hi'}" ${attrs}></video>`;
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
  const v = r3(BEDS.has(role) ? vol : vol * SFX_GAIN);
  const fit = r3(Math.min(d, TOTAL - s));
  let src = `assets/sfx/${role}.m4a`;
  if (SFXDUR[role] > fit + 0.01) {
    // the renderer runs to the end of the file, not to data-duration (LESSONS.md #56): a bed longer than the time
    // left is cut to fit, with a short fade so it doesn't click, and the cut copy is what the page references
    const name = `${role}-fit${Math.round(s * 100)}.m4a`, out = path.join(HERE, 'assets/sfx', name);
    if (!fs.existsSync(out) || Math.abs(dur(out) - fit) > 0.05) {
      const args = ['-nostdin', '-y', '-v', 'error', '-i', file, '-t', String(fit), '-c:a', 'aac', '-b:a', '192k', out];
      try { execFileSync(ffmpeg, [...args.slice(0, -1), '-af', `afade=t=out:st=${r3(Math.max(0, fit - 0.3))}:d=0.3`, out]); }
      catch { execFileSync(ffmpeg, args); }
    }
    src = `assets/sfx/${name}`;
  }
  audio.push(`<audio id="sfx-${role}-${Math.round(s * 100)}" src="${src}" data-start="${s}" data-duration="${fit}" data-track-index="${12 + (sfxN++)}" data-volume="${v}"></audio>`);
}

/* the wordmark on a light stage: the black "NeroPay" masks on left to right, the yellow full stop pops in
   as it finishes (back.out, ten frames) and takes one slow, shallow breath — the only motion Faisal asked for */
function wordmark(stage, when) {
  js.push(`tl.set("${stage} .wm", { autoAlpha: 1 }, ${r3(when)});`);
  js.push(`tl.fromTo("${stage} .wm .wt", { clipPath: "inset(-20% 100% -30% 0%)" }, { clipPath: "inset(-20% 0% -30% 0%)", duration: ${r3(14 / FPS)}, ease: "none", immediateRender: false }, ${r3(when)});`);
  js.push(`tl.fromTo("${stage} .wm .dot", { scale: 0 }, { scale: 1, duration: ${r3(10 / FPS)}, ease: "back.out(2.4)", immediateRender: false }, ${r3(when + 12 / FPS)});`);
  js.push(`tl.fromTo("${stage} .wm .dot", { scale: 1 }, { scale: 1.12, duration: 0.7, ease: "sine.inOut", yoyo: true, repeat: 1, immediateRender: false }, ${r3(when + 0.9)});`);
  sfx('pop', r3(when + 12 / FPS), 0.12);
}

/* ---------- cards ----------
   A card is a solid object in a real 3D space (.space > .orbit preserve-3d): six thin layers behind the
   face give it a body you see on the turned side, the face is a coloured gradient with a metal chip, a
   band, one static highlight and a soft drop shadow. Four colours: charcoal, yellow, slate, off-white.
   Opacity only ever moves on the leaves (.face, .edge): opacity below 1 on a preserve-3d element
   flattens it for that frame, which reads as the cards jumping (LESSONS.md #32). */
function cardHtml(i) {
  const edges = [1, 2, 3, 4, 5, 6].map((k) => `<i class="edge" style="transform:translateZ(${-2 * k}px)"></i>`).join('');
  return `<div class="card k${i} cue">${edges}<div class="face"><i class="cchip"></i><i class="cband"></i><i class="cshine"></i><i class="crim"></i></div></div>`;
}
const leaves = (sel) => `${sel} .face, ${sel} .edge`;

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
/* the push onto a panel stops at ZMAX: with Ava 30% in from one edge, a bigger push toward the other column would
   carry her out of frame (the translation is clamped to the scale, so the push is all sideways) */
const ZMAX = V ? 1.3 : 1.12;
const focus = (S_, px, py) => { S_ = Math.min(S_, ZMAX); return { scale: S_, x: r3(-(px - W / 2) * S_), y: r3(-(py - H / 2) * S_) }; };
const flat = (S_, x = 0, y = 0) => ({ scale: S_, x, y });
/* focus on a panel: the point is raised so the panel's bottom edge stays above the captions (LESSONS.md #15) */
const pf = (id, S_, px, py) => { const g = PANEL[id]; const lim = g ? g.bottom - 330 / S_ : py; return focus(S_, px, Math.max(py, lim)); };   // 330: a 760-tall panel keeps its top in at ZMAX too
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
segs.forEach((s, i) => {
  const next = segs[i + 1];
  if (s.kind === 'card' && next && next.kind === 'clip') {
    // a muted copy of the next clip runs under the card, hidden by the stage: without it the renderer paints the
    // first frame after a gap on the video track blank — one flat frame at the cut (LESSONS.md #55)
    html.push(`<video id="v-under-${i}" class="clip" src="${next.src}" data-start="${s.start}" data-duration="${r3(next.start - s.start)}" data-media-start="${next.mediaStart}" data-track-index="0" muted playsinline></video>`);
  }
});
for (const s of segs) {
  if (s.kind !== 'clip') continue;
  if (V) {
    const blur = s.src.replace(/\.mp4$/, '.blur.mp4'), has = fs.existsSync(path.join(HERE, blur));
    html.push(`<video id="f-${s.id}" class="clip fill ${has ? 'lo' : 'hi'}" src="${has ? blur : s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="2" muted playsinline></video>`);
  }
  html.push(`<video id="v-${s.id}" class="clip" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="0" muted playsinline></video>`);
  audio.push(`<audio id="a-${s.id}" src="${s.src}" data-start="${s.start}" data-duration="${s.dur}" data-media-start="${s.mediaStart}" data-track-index="10" data-volume="1"></audio>`);
  const groups = phrases(s.words);
  groups.forEach((p, gi) => {
    const ps = r3(s.start + p[0].s);
    const next = groups[gi + 1] ? r3(s.start + groups[gi + 1][0].s) : Infinity;
    const pe = Math.min(r3(s.start + p[p.length - 1].e + 0.35), next, endOf(s.id), s.id === 'B1-INTRO' ? TT.expandAt : Infinity);
    const pd = r3(pe - ps);
    if (pd <= 0.05) return;
    const spans = p.map((w) => {
      WORDLIST.push([r3(s.start + w.s), r3(s.start + w.e)]);
      return `<span class="w${isEmph(w.w) ? ' em' : ''}" data-i="${wordIndex++}">${esc(w.w)}</span>`;
    }).join(' ');
    html.push(`<div id="cap-${s.id}-${Math.round(p[0].s * 100)}" class="clip cap" data-start="${ps}" data-duration="${pd}" data-track-index="6"><div class="line">${spans}</div></div>`);
  });
}

if (V) html.push(`<div id="seam"></div>`);   // the shadow the footage casts up into the fill band
const PX = V ? 80 : 1110, PW = V ? 920 : 760;   // right column (vertical: the one column, in the top band)
/* Ava's side per shot comes from data/angles.json (angles.mjs cuts the proxy to it); every panel takes the other
   column (Faisal, 11 Sep: nothing over her face). colX mirrors a right-column x when she is on the right, and the
   lean follows the column — the near edge comes forward, so left leans positive, right negative. */
const AVA = (id) => (V ? 'C' : cropFor(id).ava);
const colX = (id, xRight, w) => (AVA(id) === 'R' ? W - xRight - w : xRight);
const colLean = (id, right) => (AVA(id) === 'R' ? Math.abs(right) : -Math.abs(right));
const FACE = (id) => cropFor(id).face;   // her face on the 1920×1080 proxy
const PLATE = V ? { x: 730, y: 1130 } : { x: FACE('B1-01').x + 300, y: FACE('B1-01').y + 280 };   // name plate, off her shoulder
const LX = V ? 80 : 50;               // left column — where she points
const CX = W / 2, PY = V ? 200 : 96;   // vertical: the top band starts under the app chrome

/* ---------- 1 · hook: 0.5%? --- B1-01 ---------- */
{
  const s = S['B1-01'], a = s.start, b = endOf('B1-01');
  /* name plate beside her head, small and quiet (PLATE is set from a real frame) */
  glass('plate', { start: a + 0.2, dur: 3.0, x: PLATE.x, y: PLATE.y, w: 268, h: 80, lean: 0, quiet: true, radius: 22,
    inner: `<div class="plate cue"><b></b><div><strong>Ava</strong><span>NeroPay</span></div></div>` });
  rise('#plate .plate', a + 0.4, 8);
  const tMaybe = findWord('B1-01', 'maybe'), tCent = findWord('B1-01', 'cent'), tNot = findWord('B1-01', 'not');
  const cw = V ? 500 : 560, ch = V ? 230 : 250, cx = V ? 290 : colX('B1-01', 1180, cw), cy = V ? 600 : 200;   // a size up on v6: Faisal asked for the 0.5% large
  glass('chip', { start: tMaybe - 0.55, dur: r3(b - tMaybe + 0.55), x: cx, y: cy, w: cw, h: ch, cueAt: tMaybe, lean: colLean('B1-01', -7),
    inner: `<div class="chip"><span class="big cue">0.5%</span><span class="q cue">?</span><i class="strike"></i></div>` });
  rise('#chip .big', tMaybe, 18);
  js.push(`tl.set("#chip .strike", { scaleX: 0, rotation: -8 }, ${r3(tMaybe - 0.55)});`);
  js.push(`tl.fromTo("#chip .q", { autoAlpha: 0, scale: 0.4, rotation: -20 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.2)", immediateRender: false }, ${tCent});`);
  js.push(`tl.fromTo("#chip .strike", { scaleX: 0, rotation: -8 }, { scaleX: 1, rotation: -8, duration: 0.4, ease: "power3.inOut", immediateRender: false }, ${tNot});`);
  js.push(`tl.fromTo("#chip .big", { color: "#ffffff" }, { color: "rgba(255,255,255,0.5)", duration: 0.4, immediateRender: false }, ${tNot});`);
  sfx('pop', tCent, 0.16); sfx('swish', tNot, 0.14);
  const f1 = V ? focus(1.14, CX, cy + ch / 2 + 250) : focus(1.16, cx + cw / 2 - 100, cy + ch / 2 + 110), f2 = V ? focus(1.2, CX + 24, cy + ch / 2 + 230) : focus(1.22, cx + cw / 2 - 120, cy + ch / 2 + 90);
  chain('B1-01', [{ t: a, c: flat(1.0) }, { t: tMaybe, c: flat(1.02) }, { t: tMaybe + 0.9, c: f1, ease: 'power3.out' }, hold(tNot, f1), { t: tNot + 0.5, c: f2, ease: 'power3.out' }, hold(b - 0.45, f2), { t: b, c: flat(1.06) }]);
}

/* ---------- 2 · one card, then a lot more --- B1-02 ---------- */
{
  const s = S['B1-02'], a = s.start, b = endOf('B1-02');
  const tOne = findWord('B1-02', 'one'), tMore = findWord('B1-02', 'more');
  const FX = V ? 180 : colX('B1-02', 1120, 720), FY = V ? 300 : 120;
  html.push(`<div id="fan" class="space" style="left:${FX}px;top:${FY}px;width:720px;height:560px"><div class="orbit">${[0, 1, 2, 3].map((i) => cardHtml(i)).join('')}</div></div>`);
  /* the first card lands from depth; three more slide out behind it, each deeper than the last, so the
     slow turn of the group gives them parallax */
  js.push(`tl.set("#fan .k0", { autoAlpha: 1 }, ${tOne});`);
  js.push(`tl.fromTo("${leaves('#fan .k0')}", { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out", immediateRender: false }, ${tOne});`);
  js.push(`tl.fromTo("#fan .k0", { z: -420, rotationY: 44, rotationX: 12, y: 40 }, { z: 0, rotationY: -14, rotationX: 6, y: 0, duration: 0.9, ease: "power3.out", immediateRender: false }, ${tOne});`);
  [1, 2, 3].forEach((i) => {
    const t0 = r3(tMore + (i - 1) * 0.07);
    js.push(`tl.set("#fan .k${i}", { autoAlpha: 1 }, ${t0});`);
    js.push(`tl.fromTo("${leaves('#fan .k' + i)}", { opacity: 0 }, { opacity: 1, duration: 0.35, immediateRender: false }, ${t0});`);
    js.push(`tl.fromTo("#fan .k${i}", { x: 0, y: 0, z: -60, rotationY: -14, rotationX: 6, rotationZ: 0 }, { x: ${i * 96}, y: ${-i * 58}, z: ${-i * 140}, rotationY: -14, rotationX: 6, rotationZ: ${i * 4}, duration: 0.55, ease: "power3.out", immediateRender: false }, ${t0});`);
  });
  js.push(`tl.fromTo("#fan .orbit", { rotationY: -8 }, { rotationY: 8, duration: ${r3(b - tOne)}, ease: "sine.inOut", immediateRender: false }, ${tOne});`);
  /* out: the faces fade (never the group), a small drift on the group's transform only */
  const out = r3(b - 0.36);
  js.push(`tl.fromTo("${leaves('#fan .card')}", { opacity: 1 }, { opacity: 0, duration: 0.36, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.fromTo("#fan .orbit", { y: 0 }, { y: -14, duration: 0.36, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.set("${leaves('#fan .card')}", { opacity: 0 }, ${b});`);
  js.push(`tl.set("#fan .card", { autoAlpha: 0 }, ${b});`);
  sfx('pop', tOne, 0.16); sfx('whoosh', r3(tMore - 0.05), 0.15);
  const f1 = V ? focus(1.14, CX, 640) : focus(1.12, FX + 300, 400);
  chain('B1-02', [{ t: a, c: flat(1.06, 40, 0) }, { t: tOne, c: flat(1.04, 20, 0) }, { t: tMore + 0.7, c: f1, ease: 'power3.out' }, hold(b, f1)]);
}

/* ---------- 3 · Ava's line --- B1-INTRO ---------- */
{
  const a = S['B1-INTRO'].start, b = endOf('B1-INTRO');
  move(a, r3(b - XF), flat(1.0), flat(1.06), 'power1.inOut');
}

/* ---------- 4 · the title, from the middle of the frame — B1-INTRO + [TITLE] ----------
   v7's animation on the light theme Faisal asked for (11 Sep): a small white slab appears at the centre as she
   says "Explained", masking EXPLAINED BY on; on "NeroPay" it grows to the whole frame — near-white ground with
   soft, diffused yellow blooms behind (blurred glass), black type; the wordmark is "NeroPay" in black with a
   yellow full stop that arrives with a very small pop and one shallow breath. Hard cut out on the beat. */
{
  const { seedAt, expandAt, EXP, landAt } = TT;
  const tEnd = endOf('[TITLE]');
  const ep = 'The rate you were quoted';
  stages.push(`<div id="title" class="clip stage" data-start="${seedAt}" data-duration="${r3(tEnd - seedAt)}" data-track-index="4">
    <div class="bgd"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><i class="frost"></i></div>
    <div class="kick"><b>Explained by</b></div>
    <div class="wm"><span class="wt">NeroPay</span><i class="dot"></i></div>
    <div class="ep">${ep.split(' ').map((w) => `<span class="ew">${esc(w)}</span>`).join(' ')}</div>
  </div>`);
  const SEED = 'inset(44.5% 38% 44.5% 38% round 26px)', FULL = 'inset(0% 0% 0% 0% round 0px)';
  js.push(`tl.set("#title", { autoAlpha: 1, clipPath: "${SEED}" }, ${seedAt});`);
  js.push(`tl.set("#title .kick", { autoAlpha: 1 }, ${r3(seedAt + 0.05)});`);
  js.push(`tl.fromTo("#title .kick", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: ${r3(8 / FPS)}, ease: "none", immediateRender: false }, ${r3(seedAt + 0.05)});`);
  sfx('tick', seedAt + 0.05, 0.18);
  js.push(`tl.fromTo("#title", { clipPath: "${SEED}" }, { clipPath: "${FULL}", duration: ${EXP}, ease: "power3.inOut", immediateRender: false }, ${expandAt});`);
  js.push(`tl.fromTo("#title .kick", { y: 0 }, { y: -280, duration: ${r3(14 / FPS)}, ease: "power3.out", immediateRender: false }, ${r3(landAt - 4 / FPS)});`);
  wordmark('#title', landAt);
  sfx('impact', landAt, 0.28);
  ep.split(' ').forEach((_, i) => js.push(`tl.fromTo("#title .ep .ew:nth-child(${i + 1})", { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: ${r3(8 / FPS)}, ease: "power3.out", immediateRender: false }, ${r3(landAt + 0.45 + i * 3 / FPS)});`));
  js.push(`tl.set("#title", { autoAlpha: 0 }, ${tEnd});`);
  sfx('riser', r3(landAt - SOUNDS.sounds.riser.duration), 0.26);
  sfx('music-intro', expandAt, 0.34);
  /* the camera lands on 1.0 under the card so B1-03 starts flat (the stage sits outside the camera) */
  move(r3(endOf('B1-INTRO') - XF), tEnd, flat(1.06), flat(1.0), 'none');
}

/* ---------- 5 · the rate ladder --- B1-03 + B1-04 (one panel, one bar per card as she names it) ---------- */
{
  const a3 = S['B1-03'].start, b3 = endOf('B1-03'), a4 = S['B1-04'].start, b4 = endOf('B1-04');
  const tAdv = findWord('B1-03', 'advertised'), tDebit = findWord('B1-03', 'debit'), tCheap = findWord('B1-03', 'cheapest');
  const tCredit = findWord('B1-04', 'credit'), tCompany = findWord('B1-04', 'company'), tAmex = findWord('B1-04', 'amex'), tOver = findWord('B1-04', 'overseas'), tMost = findWord('B1-04', 'most');
  const bars = [['Debit', 0.5, 0.18, tDebit], ['Credit', 1.2, 0.42, tCredit], ['Business', 2.6, 0.86, tCompany], ['Amex', 1.75, 0.6, tAmex], ['Overseas', 2.9, 0.96, tOver]];
  const ly = V ? 210 : 110, lh = 600;
  const lx = colX('B1-03', PX, PW);
  glass('ladder', { start: Math.max(a3, tAdv - 0.7), dur: r3(b4 - Math.max(a3, tAdv - 0.7)), x: lx, y: ly, w: PW, h: lh, cueAt: tAdv, lean: colLean('B1-03', -7),
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
  const barX = (i) => lx + 46 + (PW - 92) * (i + 0.5) / 5;
  const c0 = pf('ladder', 1.12, lx + PW / 2, ly + 320), c0b = pf('ladder', 1.2, barX(0) + 120, ly + 480);
  chain('B1-03', [{ t: a3, c: flat(1.0) }, { t: tAdv - 0.1, c: flat(1.02) }, { t: tAdv + 0.9, c: c0, ease: 'power3.out' }, hold(tDebit, c0), { t: tDebit + 0.7, c: c0b, ease: 'power3.out' }, hold(b3, c0b)]);
  /* B1-04: the camera walks the ladder with her — credit, company, then up to the most expensive */
  const c1 = pf('ladder', 1.14, barX(1) + 60, ly + 400), c2 = pf('ladder', 1.18, barX(2), ly + 330), c4 = pf('ladder', 1.2, barX(4) - 90, ly + 300), c4b = pf('ladder', 1.24, barX(4) - 110, ly + 280);
  chain('B1-04', [
    { t: a4, c: bump(c0b) }, { t: tCredit + 0.6, c: c1, ease: 'power1.inOut' }, { t: tCompany + 0.7, c: c2, ease: 'power3.out' },
    hold(tAmex, c2), { t: tOver + 0.6, c: c4 }, { t: tMost + 0.5, c: c4b, ease: 'power2.out' },
    hold(b4 - 0.9, c4b), { t: b4, c: flat(1.06, -50, 0) }]);
}

/* ---------- 6 · their card, your rate --- B1-05 (cards, then two big lines of type, no glass) ---------- */
{
  const s = S['B1-05'], a = s.start, b = endOf('B1-05');
  const tWhat = findWord('B1-05', 'whatever'), tPocket = findWord('B1-05', 'pocket'), tRate = findWord('B1-05', 'rate');
  const HX = V ? 230 : colX('B1-05', 1120, 740), HY = V ? 300 : 20, c0 = r3(Math.max(a, tWhat - 0.3));
  html.push(`<div id="hand" class="space" style="left:${HX}px;top:${HY}px;width:740px;height:640px"><div class="orbit">${[0, 1, 2, 3].map((i) => cardHtml(i)).join('')}</div></div>
  <div id="bigline" class="bigline"${V ? '' : ` style="left:${HX + 30}px"`}><span class="b1 cue">their card.</span><span class="b2 cue">your rate.</span></div>`);
  [0, 1, 2, 3].forEach((i) => {
    const t0 = r3(c0 + i * 0.1);
    js.push(`tl.set("#hand .k${i}", { autoAlpha: 1 }, ${t0});`);
    js.push(`tl.fromTo("${leaves('#hand .k' + i)}", { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, ${t0});`);
    js.push(`tl.fromTo("#hand .k${i}", { y: 160, z: -380, rotationY: 34, rotationX: 10, rotationZ: 0, x: 0 }, { y: ${-i * 44}, x: ${i * 88}, z: ${-i * 110}, rotationY: -12, rotationX: 8, rotationZ: ${-10 + i * 7}, duration: 0.8, ease: "power3.out", immediateRender: false }, ${t0});`);
  });
  /* on "pocket" the fourth card comes forward, upright, in front; the rest sink back and dim */
  js.push(`tl.fromTo("#hand .k3", { x: 264, y: -132, z: -330, rotationZ: 11, rotationY: -12, rotationX: 8, scale: 1 }, { x: 150, y: 60, z: 160, rotationZ: 0, rotationY: -4, rotationX: 4, scale: 1.22, duration: 0.8, ease: "power3.inOut", immediateRender: false }, ${tPocket});`);
  [0, 1, 2].forEach((i) => js.push(`tl.fromTo("${leaves('#hand .k' + i)}", { opacity: 1 }, { opacity: 0.45, duration: 0.5, ease: "power2.inOut", immediateRender: false }, ${tPocket});`));
  js.push(`tl.fromTo("#hand .orbit", { rotationY: 6 }, { rotationY: -6, duration: ${r3(b - c0)}, ease: "sine.inOut", immediateRender: false }, ${c0});`);
  /* the two lines, big, on her words */
  const big = (sel, when) => js.push(`tl.fromTo("${sel}", { autoAlpha: 0, y: 40, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.5, ease: "back.out(1.6)", immediateRender: false }, ${r3(when)});`);
  big('#bigline .b1', tPocket + 0.15); big('#bigline .b2', tRate - 0.05);
  sfx('whoosh', c0, 0.15); sfx('pop', tPocket, 0.16); sfx('tick', tPocket + 0.15, 0.18); sfx('bounce', r3(tRate - 0.05), 0.16);
  const out = r3(b - 0.36);
  js.push(`tl.fromTo("${leaves('#hand .card')}", { opacity: 1 }, { opacity: 0, duration: 0.36, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.fromTo("#hand .orbit", { y: 0 }, { y: -14, duration: 0.36, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.fromTo("#bigline .b1, #bigline .b2", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.36, ease: "power2.in", immediateRender: false }, ${out});`);
  js.push(`tl.set("${leaves('#hand .card')}", { opacity: 0 }, ${b});`);
  js.push(`tl.set("#bigline .b1, #bigline .b2", { autoAlpha: 0 }, ${b});`);
  js.push(`tl.set("#hand .card", { autoAlpha: 0 }, ${b});`);
  const f1 = V ? focus(1.1, CX, 700) : focus(1.08, HX + 360, 420), f2 = V ? focus(1.12, CX, 700) : focus(1.12, HX + 380, 420);
  chain('B1-05', [{ t: a, c: flat(1.0) }, { t: c0 + 0.8, c: f1, ease: 'power2.out' }, { t: tPocket + 0.6, c: f2, ease: 'power3.out' }, hold(b, f2)]);
}

/* ---------- 7 · a made-up month --- B1-06 + the statement --- B1-07 (one panel, on the left where she points) ---------- */
{
  const a6 = S['B1-06'].start, b6 = endOf('B1-06'), a7 = S['B1-07'].start, b7 = endOf('B1-07');
  const tHere = findWord('B1-06', 'here'), tTwenty = findWord('B1-06', 'twenty'), tSeven = findWord('B1-06', 'seven'), tNought = findWord('B1-06', 'nought');
  const t70 = findWord('B1-07', 'seventy'), tCred = findWord('B1-07', 'credit'), tComp = findWord('B1-07', 'company'), tOver = findWord('B1-07', 'overseas');
  const rows = [['Consumer debit', 71, '0.50%'], ['Consumer credit', 20, '1.20%'], ['Business / commercial', 5, '2.60%'], ['International / non-UK', 2, '2.90%']];
  const py = PY, ph = 690, st = r3(Math.max(a6, tHere - 0.6));
  const mx = V ? LX : colX('B1-06', PX, PW);
  glass('month', { start: st, dur: r3(b7 - st), x: mx, y: py, w: PW, h: ph, cueAt: tHere, lean: V ? 7 : colLean('B1-06', -7),
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
  const m0 = pf('month', 1.12, mx + PW / 2, py + 320), m1 = pf('month', 1.14, mx + 240, py + 300), m2 = pf('month', 1.14, mx + PW / 2, py + 420), m3 = pf('month', 1.16, mx + PW - 200, py + 520);
  chain('B1-06', [{ t: a6, c: flat(1.0) }, { t: tHere - 0.1, c: flat(1.02) }, { t: tHere + 0.9, c: m0, ease: 'power3.out' }, hold(tTwenty, m0), { t: tTwenty + 0.7, c: m1, ease: 'power3.out' }, hold(b6, m1)]);
  chain('B1-07', [{ t: a7, c: bump(m1) }, { t: t70 + 0.6, c: m2 }, hold(tOver, m2), { t: tOver + 0.6, c: m3, ease: 'power3.out' }, hold(b7 - 0.6, m3), { t: b7, c: flat(1.06, 40, 0) }]);
}

/* ---------- 8 · the charges that aren't a percentage --- B1-08 + B1-09 (one panel) ---------- */
{
  const a8 = S['B1-08'].start, b8 = endOf('B1-08'), a9 = S['B1-09'].start, b9 = endOf('B1-09');
  const tCharges = findWord('B1-08', 'charges'), tFour = findWord('B1-08', 'four'), tSeventeen = findWord('B1-08', 'seventeen'), tPci = findWord('B1-08', 'pci');
  const tAccount = findWord('B1-09', 'account'), tPayout = findWord('B1-09', 'payout'), tOwn = findWord('B1-09', 'own');
  const rows = [['Authorisation fees', '780 × 4p', 31.2], ['Terminal rental', 'monthly', 17.5], ['PCI compliance fee', 'monthly', 9.95], ['Account fee', 'monthly', 5], ['Payout fees', 'every time they pay you', 12]];
  const py = PY, ph = 680;
  const xx = colX('B1-08', PX, PW);
  glass('fixed', { start: a8, dur: r3(b9 - a8), x: xx, y: py, w: PW, h: ph, cueAt: tCharges, lean: colLean('B1-08', -7),
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
  const fw = 920, fx = V ? LX : colX('B1-10', W - LX - fw, fw), fy = V ? 240 : 170, fh = 600, st = r3(Math.max(a, tAdd - 0.7));
  glass('formula', { start: st, dur: r3(b - st), x: fx, y: fy, w: fw, h: fh, cueAt: tAdd, lean: V ? 8 : colLean('B1-10', -8),
    inner: `<div class="pad formula"><span class="th cue">your effective rate</span>
      <div class="frac">
        <div class="row num cue"><i class="badge">£</i><span>every charge on the statement</span></div>
        <i class="line"></i>
        <div class="row den cue"><i class="badge">÷</i><span>total card turnover</span></div>
      </div>
      <div class="ops"><span class="x100 cue">× 100</span><span class="eq cue">=</span><b class="res cue">effective rate<i class="under"></i></b></div></div>` });
  rise('#formula .num', tAdd + 0.15); sfx('tick', tAdd, 0.18);
  js.push(`tl.set("#formula .line", { scaleX: 0 }, ${st});`);
  js.push(`tl.fromTo("#formula .line", { scaleX: 0 }, { scaleX: 1, duration: 0.55, ease: "power3.inOut", immediateRender: false }, ${tDivide});`);
  rise('#formula .den', tDivide + 0.12); sfx('swish', tDivide, 0.14);
  js.push(`tl.fromTo("#formula .x100", { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)", immediateRender: false }, ${tMultiply});`);
  rise('#formula .eq', tMultiply + 0.25); sfx('tick', tMultiply, 0.18);
  js.push(`tl.fromTo("#formula .res", { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power3.out", immediateRender: false }, ${r3(tMultiply + 0.4)});`);
  js.push(`tl.set("#formula .under", { scaleX: 0 }, ${st});`);
  js.push(`tl.fromTo("#formula .under", { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, ${tHundred});`);
  js.push(`tl.fromTo("#formula .res", { scale: 1 }, { scale: 1.08, duration: 0.35, ease: "back.out(2)", yoyo: true, repeat: 1, immediateRender: false }, ${tHundred});`);
  sfx('pop', tHundred, 0.14);
  const f0 = pf('formula', 1.14, fx + fw / 2, fy + fh / 2 + 40), f1 = pf('formula', 1.2, fx + fw / 2, fy + fh / 2 + 40);
  chain('B1-10', [{ t: a, c: flat(1.0) }, { t: tAdd - 0.1, c: flat(1.02) }, { t: tAdd + 0.9, c: f0, ease: 'power3.out' }, hold(tDivide, f0), { t: tDivide + 0.7, c: f1, ease: 'power3.out' }, hold(b - 0.5, f1), { t: b, c: flat(1.06, 40, 0) }]);
}

/* ---------- 10 · £308 on £28,400 is 1.09% --- B1-11 + quoted vs paid --- B1-12 (the headline) ---------- */
{
  const a11 = S['B1-11'].start, b11 = endOf('B1-11'), a12 = S['B1-12'].start, b12 = endOf('B1-12');
  const tHere = findWord('B1-11', 'here'), tThree = findWord('B1-11', 'three'), tTwenty = findWord('B1-11', 'twenty'), tOne = findWord('B1-11', 'one');
  const tQuoted = findWord('B1-12', 'quoted'), tActually = findWord('B1-12', 'actually'), tDouble = findWord('B1-12', 'double');
  const sw = V ? 920 : 840, sx = V ? 80 : colX('B1-11', 1040, sw), sy = V ? 190 : 50, sh = 740;
  glass('sum', { start: a11, dur: r3(b12 - a11), x: sx, y: sy, w: sw, h: sh, cueAt: tHere, lean: colLean('B1-11', -6),
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
    { t: tArrow + 0.85, c: q1 }, hold(tDouble, q1), { t: tDouble + 0.6, c: qb, ease: 'power3.out' }, hold(b12, qb)]);
}

/* ---------- 11 · 0.70% flat costs less --- B1-13 + B1-14 (one panel) ---------- */
{
  const a13 = S['B1-13'].start, b13 = endOf('B1-13'), a14 = S['B1-14'].start, b14 = endOf('B1-14');
  const tNought = findWord('B1-13', 'nought'), tFlat = findWord('B1-13', 'flat'), tLess = findWord('B1-13', 'less');
  const tHundred = findWord('B1-14', 'hundred'), tHigher = findWord('B1-14', 'higher'), tLess2 = findWord('B1-14', 'less');
  const py = PY, ph = 690, st = r3(Math.max(a13, tNought - 0.7));
  const wx = colX('B1-13', PX, PW);
  glass('flatp', { start: st, dur: r3(b14 - st), x: wx, y: py, w: PW, h: ph, cueAt: tNought, lean: colLean('B1-13', -7),
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
  const w0 = pf('flatp', 1.12, wx + PW / 2, py + 330), w1 = pf('flatp', 1.18, wx + 380, py + 430), w2 = pf('flatp', 1.18, wx + 380, py + 600);
  chain('B1-13', [{ t: a13, c: flat(1.0) }, { t: tNought - 0.1, c: flat(1.02) }, { t: tNought + 0.9, c: w0, ease: 'power3.out' }, hold(tLess, w0), { t: tLess + 0.6, c: w1, ease: 'power3.out' }, hold(b13, w1)]);
  chain('B1-14', [{ t: a14, c: bump(w1) }, hold(tLess2, w1), { t: tLess2 + 0.6, c: w2, ease: 'power3.out' }, hold(b14 - 0.6, w2), { t: b14, c: flat(1.06, -50, 0) }]);
}

/* ---------- 12 · the questions to ask --- B1-15 + B1-16 (one panel, each line only as she says it) ---------- */
{
  const a15 = S['B1-15'].start, b15 = endOf('B1-15'), a16 = S['B1-16'].start, b16 = endOf('B1-16');
  const tAsk = findWord('B1-15', 'ask'), tCredit = findWord('B1-15', 'credit'), tCompany = findWord('B1-15', 'company'), tAmex = findWord('B1-15', 'amex'), tPayout = findWord('B1-15', 'payout');
  const tPci = findWord('B1-16', 'pci'), tAccount = findWord('B1-16', 'account'), tMinimum = findWord('B1-16', 'minimum'), tEffective = findWord('B1-16', 'effective'), tOnly = findWord('B1-16', 'only');
  const items = ['What do credit cards cost?', 'And business cards?', 'And American Express?', 'What does each payout cost?', 'Is there a PCI fee?', 'An account fee?', 'A minimum monthly charge?', 'So what is my effective rate?'];
  const qw = V ? 920 : 860, qx = V ? 80 : colX('B1-15', 1020, qw), qy = V ? 180 : 60, qh = 760, st = r3(Math.max(a15, tAsk - 0.7));
  glass('ask', { start: st, dur: r3(b16 - st), x: qx, y: qy, w: qw, h: qh, cueAt: tAsk, lean: colLean('B1-15', -7),
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

/* ---------- 13 · two minutes with a statement --- B1-17 (each piece on its word) ---------- */
{
  const s = S['B1-17'], a = s.start, b = endOf('B1-17');
  const tTwo = findWord('B1-17', 'two'), tStatement = findWord('B1-17', 'statement'), tCalc = findWord('B1-17', 'calculator');
  const tw = V ? 880 : 800, tx = V ? 100 : colX('B1-17', PX - 20, tw), ty = V ? 560 : 170, th = 300;
  glass('two', { start: a, dur: r3(b - a), x: tx, y: ty, w: tw, h: th, cueAt: tTwo + 0.05, lean: colLean('B1-17', -6),
    inner: `<div class="pad twomin"><b class="n cue">2 min</b><div class="lines"><span class="l1 cue"><i></i>last month's statement</span><span class="l2 cue"><i></i>+ a calculator</span></div></div>` });
  js.push(`tl.fromTo("#two .n", { autoAlpha: 0, scale: 0.5, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.7)", immediateRender: false }, ${r3(tTwo + 0.05)});`);
  sfx('pop', tTwo + 0.05, 0.18);
  arrive('#two .l1', tStatement, 40); sfx('tick', tStatement, 0.18);
  arrive('#two .l2', tCalc, 40); sfx('tick', tCalc, 0.18);
  const f1 = pf('two', 1.12, tx + tw / 2, ty + th / 2 + 60);
  chain('B1-17', [{ t: a, c: flat(1.04, -30, 0) }, { t: tTwo + 0.9, c: f1, ease: 'power3.out' }, hold(b - 0.8, f1), { t: b, c: flat(1.0) }]);
}

/* ---------- 14 · follow --- B1-18: the wordmark wipes in, four social tiles pop, all of it goes ---------- */
{
  const s = S['B1-18'], a = s.start, b = endOf('B1-18');
  const tFollow = findWord('B1-18', 'follow');
  const ICON = {
    ig: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5.5" fill="none" stroke="#fff" stroke-width="2"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="17.4" cy="6.6" r="1.3" fill="#fff"/></svg>',
    li: '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="4.5" fill="#fff"/><text x="12" y="17.2" font-size="12.5" font-weight="800" text-anchor="middle" fill="#141416" font-family="Poppins,Arial,sans-serif">in</text></svg>',
    yt: '<svg viewBox="0 0 24 24"><rect x="1.5" y="5" width="21" height="14" rx="4.5" fill="#fff"/><path d="M10 8.8l5.2 3.2L10 15.2z" fill="#141416"/></svg>',
    tt: '<svg viewBox="0 0 24 24"><path d="M13.3 3h3.2a4.2 4.2 0 0 0 4.2 4.1v3.2a7.4 7.4 0 0 1-4.2-1.4v6.2a5.6 5.6 0 1 1-5.6-5.6h.6v3.3h-.6a2.3 2.3 0 1 0 2.4 2.3z" fill="#fff"/></svg>',
  };
  const socX = V ? 330 : colX('B1-18', PX + 20, 760);
  html.push(`<div id="social" class="social" style="left:${socX}px;top:${V ? 640 : 250}px;width:760px;height:260px">
    <span class="smark"><b>Nero</b><em>Pay</em></span><i class="wipe"></i>
    <div class="icons">${['ig', 'li', 'yt', 'tt'].map((k) => `<i class="ic ${k} cue">${ICON[k]}</i>`).join('')}</div></div>`);
  const t0 = r3(tFollow - 0.1);
  js.push(`tl.set("#social", { autoAlpha: 1 }, ${t0});`);
  js.push(`tl.fromTo("#social .smark", { clipPath: "inset(-20% 100% -30% 0%)" }, { clipPath: "inset(-20% 0% -30% 0%)", duration: 0.55, ease: "power3.inOut", immediateRender: false }, ${t0});`);
  js.push(`tl.fromTo("#social .wipe", { autoAlpha: 1, x: 0 }, { x: 520, duration: 0.55, ease: "power3.inOut", immediateRender: false }, ${t0});`);
  js.push(`tl.fromTo("#social .wipe", { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.15, immediateRender: false }, ${r3(t0 + 0.5)});`);
  ['ig', 'li', 'yt', 'tt'].forEach((k, i) => {
    const t = r3(t0 + 0.45 + i * 0.14);
    js.push(`tl.fromTo("#social .ic.${k}", { autoAlpha: 0, scale: 0.3, y: 20 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.45, ease: "back.out(2.4)", immediateRender: false }, ${t});`);
    sfx('pop', t, 0.13);
  });
  sfx('swish', t0, 0.15);
  const tOut = r3(Math.min(t0 + 3.2, b - 0.5));
  js.push(`tl.fromTo("#social", { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -24, duration: 0.4, ease: "power2.in", immediateRender: false }, ${tOut});`);
  js.push(`tl.set("#social", { autoAlpha: 0 }, ${r3(tOut + 0.4)});`);
  sfx('whoosh', tOut, 0.1);
  const sp = AVA('B1-18') === 'R' ? 30 : -30;
  chain('B1-18', [{ t: a, c: flat(1.0) }, { t: t0 + 0.9, c: flat(1.06, sp, 0), ease: 'power2.out' }, hold(tOut, flat(1.06, sp, 0)), { t: b, c: flat(1.0) }]);
}

/* ---------- 15 · end card, on the beat, in the title's style: NeroPay. → subscribe → six plain lines → NeroPay. + the concession ----------
   The same light ground and blooms as the title, black type, the yellow full stop. Generic labels only, one tile
   per two beats, one fade in and one out each, nothing wipes. Rail 8: it ends on the line that tells the viewer
   when to stay where they are. */
{
  const s = S['[END]'], a = s.start, d = s.dur;
  const offer = ['Payment terminal', 'Free POS software', 'Online ordering', 'Booking system', 'QR payments', 'API for ecommerce'];
  const concede = 'Check your statement first. If it matches your quote, stay put.';
  // three frames past the root end: the renderer floors every boundary to a frame (LESSONS.md #56)
  stages.push(`<div id="end" class="clip stage" data-start="${a}" data-duration="${r3(d + 3 / FPS)}" data-track-index="4">
    <div class="bgd"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div><i class="frost"></i></div>
    <div class="layer brand"><div class="wm"><span class="wt">NeroPay</span><i class="dot"></i></div><span class="sub cue">Subscribe for more</span></div>
    <div class="layer items"><div class="kick2 cue"><b>What comes with NeroPay</b></div><div class="grid">${offer.map((t, i) => `<div class="tile t${i} cue"><i></i><span>${esc(t)}</span></div>`).join('')}</div></div>
    <div class="layer final"><div class="wm"><span class="wt">NeroPay</span><i class="dot"></i></div><span class="sub cue">Subscribe for more</span><p class="concede cue">${esc(concede)}</p></div>
  </div>`);
  const g = (k) => r3(a + k * BAR2), land = r3(a + 0.3);
  js.push(`tl.fromTo("#end", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: "power2.inOut", immediateRender: false }, ${a});`);
  wordmark('#end .brand', land); sfx('impact', land, 0.26);
  rise('#end .brand .sub', g(1), 24); sfx('tick', g(1), 0.2);
  leave('#end .brand .wm', g(3) - 0.5); leave('#end .brand .sub', g(3) - 0.45);
  rise('#end .items .kick2', g(3), 16);
  offer.forEach((_, i) => {
    const tin = g(3 + i);
    js.push(`tl.fromTo("#end .items .t${i}", { autoAlpha: 0, y: 26, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out", immediateRender: false }, ${tin});`);
    sfx('tick', tin, 0.2);
  });
  const fin = g(3 + offer.length);
  leave('#end .items .kick2', fin - 0.5);
  offer.forEach((_, i) => leave(`#end .items .t${i}`, fin - 0.5 + i * 0.03));
  wordmark('#end .final', fin);
  rise('#end .final .sub', r3(fin + 0.5), 24); sfx('tick', r3(fin + 0.5), 0.2);
  rise('#end .final .concede', g(4 + offer.length), 14); sfx('tick', g(4 + offer.length), 0.18);
  sfx('music-outro', a, 0.42);
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
video.clip{position:absolute;left:0;top:${FT}px;width:${W}px;height:${FH}px;object-fit:cover}
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
.bgv{position:absolute;left:0;top:${FT}px;width:${W}px;height:${FH}px;object-fit:cover;transform:scale(1.06)}
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
/* light glass for the cards on white: a frosted white slab, the same rim */
.lglass{background:linear-gradient(135deg,rgba(255,255,255,.80) 0%,rgba(255,255,255,.62) 50%,rgba(255,255,255,.74) 100%);color:${INK};
  box-shadow:0 40px 90px rgba(20,20,22,.10),0 8px 24px rgba(20,20,22,.06)}
.lglass .tint{background:radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,.7),transparent 55%),radial-gradient(70% 60% at 100% 100%,rgba(245,197,24,.16),transparent 60%)}
.lglass .rim{box-shadow:inset 0 2px 0 rgba(255,255,255,1),inset 0 0 0 1px rgba(255,255,255,.9)}
.lglass .sheen{background:linear-gradient(105deg,transparent 0%,rgba(255,255,255,.1) 35%,rgba(255,255,255,.55) 50%,rgba(255,255,255,.1) 65%,transparent 100%)}
.pad{height:100%;padding:38px 46px 34px;display:flex;flex-direction:column}
.th{display:block;font-size:24px;font-weight:500;letter-spacing:0;color:rgba(255,255,255,.72);margin-bottom:16px}
b.y,.y{color:${Y}}
/* name plate */
.plate{display:flex;align-items:center;gap:14px;padding:0 24px;height:100%}
.plate b{display:block;width:12px;height:12px;background:${Y};border-radius:4px;flex:none}
.plate strong{display:block;font-size:27px;font-weight:700;line-height:1.05}
.plate span{display:block;font-size:16px;font-weight:500;color:rgba(255,255,255,.85);margin-top:2px;letter-spacing:0}
/* hook chip */
.chip{display:flex;align-items:center;justify-content:center;gap:12px;height:100%}
.chip .big{display:block;font-size:${V ? 118 : 144}px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.chip .q{display:block;font-size:${V ? 118 : 144}px;font-weight:800;font-style:italic;color:${Y};line-height:1;transform-origin:50% 60%}
.chip .strike{position:absolute;left:${V ? 62 : 70}px;top:50%;width:${V ? 340 : 420}px;height:${V ? 11 : 13}px;margin-top:-6px;display:block;background:${Y};border-radius:6px;transform-origin:0 50%}
/* cards: solid objects in a real 3D space — a coloured face, six layers of body behind it, chip, band,
   one highlight, a soft shadow. Opacity is only ever animated on .face and .edge (LESSONS.md #32). */
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
/* two big lines of type beside the cards, no glass */
.bigline{position:absolute;left:1150px;top:500px;width:740px;display:flex;flex-direction:column;gap:6px}
.bigline span{display:block;font-size:76px;font-weight:800;letter-spacing:-0.045em;line-height:1.05;text-shadow:0 10px 34px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.35);transform-origin:0 50%}
.bigline .b2{color:${Y};font-style:italic}
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
.stat span{display:block;font-size:20px;font-weight:500;color:rgba(255,255,255,.9);letter-spacing:0}
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
/* formula — big, on the left: two rows with a badge each, a glowing line between, then × 100 = result */
.formula{justify-content:center}
.frac{display:flex;flex-direction:column;align-items:stretch;gap:14px;margin:4px 0 30px;padding:0 20px}
.frac .row{display:flex;align-items:center;gap:22px;font-size:44px;font-weight:700;letter-spacing:-0.02em}
.frac .badge{display:flex;align-items:center;justify-content:center;flex:none;width:58px;height:58px;border-radius:50%;background:${Y};color:#141416;font-style:normal;font-size:32px;font-weight:800}
.frac .den{color:rgba(255,255,255,.88)}
.frac .line{display:block;height:5px;margin:2px 0;background:${Y};border-radius:3px;transform-origin:50% 50%;box-shadow:0 0 14px rgba(245,197,24,.55)}
.ops{display:flex;align-items:center;justify-content:center;gap:26px;font-size:50px;font-weight:600}
.ops .x100{display:inline-block;padding:6px 26px;border-radius:18px;background:rgba(255,255,255,.12);box-shadow:inset 0 1px 0 rgba(255,255,255,.35);transform-origin:50% 50%}
.ops .res{position:relative;display:inline-block;font-size:66px;font-weight:800;color:${Y};font-style:italic;transform-origin:50% 50%;padding-bottom:6px}
.ops .res .under{position:absolute;left:0;right:0;bottom:-4px;height:6px;display:block;border-radius:3px;background:${Y};transform-origin:0 50%;box-shadow:0 0 12px rgba(245,197,24,.6)}
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
/* two minutes: the number big, the two lines on their words */
.twomin{flex-direction:row;align-items:center;gap:28px;padding:0 40px}
.twomin .n{display:block;flex:none;font-size:108px;font-weight:800;color:${Y};letter-spacing:-0.06em;line-height:1;white-space:nowrap;transform-origin:50% 60%}
.twomin .lines{display:flex;flex-direction:column;gap:14px}
.twomin .lines span{display:flex;align-items:center;gap:14px;font-size:28px;font-weight:600;white-space:nowrap}
.twomin .lines i{display:block;flex:none;width:14px;height:14px;border-radius:4px;background:${Y}}
.twomin .l2{color:rgba(255,255,255,.88)}
/* follow: wordmark wipe, four tiles */
.social{position:absolute;opacity:0;visibility:hidden}
.social .smark{display:block;font-size:104px;font-weight:800;letter-spacing:-0.05em;line-height:1;text-shadow:0 10px 34px rgba(0,0,0,.5)}
.social .smark em{font-style:normal;color:${Y}}
.social .wipe{position:absolute;left:0;top:6px;width:10px;height:100px;display:block;border-radius:5px;background:${Y};box-shadow:0 0 18px rgba(245,197,24,.8);opacity:0}
.social .icons{display:flex;gap:22px;margin-top:26px}
.social .ic{display:flex;align-items:center;justify-content:center;width:92px;height:92px;border-radius:26px;background:rgba(255,255,255,.14);box-shadow:inset 0 1.5px 0 rgba(255,255,255,.45),0 18px 40px rgba(0,0,0,.35);transform-origin:50% 50%}
.social .ic svg{width:52px;height:52px;display:block}
.mark{display:block;font-size:64px;font-weight:800;letter-spacing:-0.05em;line-height:1}
.mark em,.wordmark em{font-style:normal;color:${Y}}
/* the title and end stages (Faisal, 11 Sep): near-white ground, soft diffused yellow blooms behind it like blurred
   glass (static — a blurred element must not move), a faint frost over them, black type, the yellow full stop */
.stage{left:0;top:0;width:${W}px;height:${H}px;background:#fbfaf7;color:${INK};overflow:hidden;opacity:0;visibility:hidden}
.stage .bgd{position:absolute;inset:0;overflow:hidden}
.blob{position:absolute;border-radius:50%;display:block;filter:blur(90px);pointer-events:none}
.blob.b1{left:-260px;top:-360px;width:1200px;height:1100px;background:radial-gradient(circle,rgba(245,197,24,.50),rgba(245,197,24,0) 62%)}
.blob.b2{right:-380px;bottom:-460px;width:1300px;height:1200px;background:radial-gradient(circle,rgba(245,197,24,.38),rgba(245,197,24,0) 62%)}
.blob.b3{left:40%;top:55%;width:700px;height:600px;background:radial-gradient(circle,rgba(255,255,255,.9),rgba(255,255,255,0) 62%)}
.stage .frost{position:absolute;inset:0;display:block;background:linear-gradient(135deg,rgba(255,255,255,.55) 0%,rgba(255,255,255,.18) 50%,rgba(255,255,255,.42) 100%)}
.stage .kick,.stage .kick2{position:absolute;left:0;right:0;top:520px;text-align:center;opacity:0;visibility:hidden}
.stage .kick b,.stage .kick2 b{display:inline-block;font-size:28px;font-weight:600;text-transform:uppercase;letter-spacing:0.36em;padding-left:0.36em;color:#6d6c68;line-height:1.3}
.stage .wm{position:absolute;left:0;right:0;top:430px;text-align:center;font-size:230px;font-weight:800;letter-spacing:-0.05em;line-height:1;color:${INK};white-space:nowrap;opacity:0;visibility:hidden}
.stage .wm .wt{display:inline-block}
.stage .wm .dot{display:inline-block;width:0.17em;height:0.17em;border-radius:50%;background:${Y};margin-left:0.04em;transform:scale(0);transform-origin:50% 50%}
.stage .ep{position:absolute;left:0;right:0;top:700px;text-align:center;font-size:34px;font-weight:500;font-style:italic;letter-spacing:-0.01em;color:#4d4c48}
.stage .ep .ew{display:inline-block;opacity:0;visibility:hidden;margin:0 0.05em}
/* end card: three layers in the same frame, every piece on its own line */
.stage .layer{position:absolute;inset:0}
.stage .layer .wm{font-size:190px;top:380px}
.stage .layer .sub{position:absolute;left:0;right:0;top:620px;text-align:center;font-size:50px;font-weight:600;color:${INK}}
.stage .final .wm{top:300px} .stage .final .sub{top:540px}
.stage .final .concede{position:absolute;left:0;right:0;top:660px;text-align:center;font-size:30px;font-weight:500;font-style:italic;color:#4d4c48;letter-spacing:0}
.stage .items .kick2{top:150px}
.stage .items .grid{position:absolute;left:${(W - 1180) / 2}px;top:250px;width:1180px;display:grid;grid-template-columns:1fr 1fr;gap:22px 26px}
.stage .tile{height:118px;border-radius:26px;display:flex;align-items:center;gap:24px;padding:0 36px;text-align:left;transform-origin:50% 50%;
  background:linear-gradient(135deg,rgba(255,255,255,.92),rgba(255,255,255,.72));box-shadow:inset 0 1.5px 0 #fff,inset 0 0 0 1px rgba(255,255,255,.95),0 10px 30px rgba(20,20,22,.05)}
.stage .tile i{display:block;flex:none;width:16px;height:16px;border-radius:50%;background:${Y}}
.stage .tile span{display:block;font-size:40px;font-weight:700;letter-spacing:-0.03em;color:${INK};line-height:1.1}
#floor{position:absolute;left:0;right:0;bottom:0;height:${V ? 520 : 300}px;pointer-events:none;background:linear-gradient(180deg,rgba(10,10,12,0) 0%,rgba(10,10,12,.28) 45%,rgba(10,10,12,.5) 100%)}
/* captions: no plate, no shadow, tight Poppins, yellow on the spoken word */
.cap{left:0;right:0;width:${W}px;bottom:${V ? 400 : 118}px;display:flex;justify-content:center;pointer-events:none}
.cap .line{max-width:${V ? 900 : 1500}px;text-align:center;font-size:${V ? 54 : 56}px;font-weight:600;line-height:1.16;letter-spacing:-0.035em;text-wrap:balance}
.cap .w{display:inline-block;color:rgba(255,255,255,.86);margin:0 0.03em}
.cap .w.em{font-style:italic;font-weight:800;font-size:1.06em}
${V ? `/* vertical: the fill band, the seam, the type that was sized for a wide frame */
video.clip.fill{top:0;height:${H}px}
.fill.lo{filter:blur(6px) saturate(1.15) brightness(.45)}
.fill.hi{filter:blur(28px) saturate(1.15) brightness(.45)}
#seam{position:absolute;left:0;top:${FT - 150}px;width:${W}px;height:210px;pointer-events:none;
  background:linear-gradient(180deg,rgba(20,20,22,0) 0%,rgba(20,20,22,.42) 71.4%,rgba(0,0,0,.32) 71.5%,rgba(0,0,0,0) 100%)}
.bgv.f{top:0;height:${H}px}
.bigline{left:110px;top:190px;width:860px}
.bigline span{font-size:84px}
.wordmark{font-size:176px}
.tstack{padding:0 50px}
.tstack .ep{font-size:31px;margin-top:22px}
.estage{padding:0 60px}
.estage .layer{left:60px;right:60px}
.estage .wordmark{font-size:150px}
.estage .items{padding-top:56px}
.estage .grid{grid-template-columns:1fr;width:800px;gap:18px}
.estage .tile{height:106px}
.estage .tile span{font-size:36px}
.social .smark{font-size:112px}` : ''}
</style>
</head>
<body>
<div id="root" data-composition-id="b1" data-start="0" data-duration="${TOTAL}" data-width="${W}" data-height="${H}" data-fps="${FPS}">
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
  window.__timelines["b1"] = tl;
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(HERE, 'index.html'), page);
/* review/manifest.json — the moments sandbox.sh pulls as stills (MOTION-SYSTEM.md §7): every glass panel just
   before its exit fade, the card fans, the title and the end card's last screen */
const contact = Object.values(PANEL).map((g) => r3(g.end - 0.5));
contact.push(r3(endOf('B1-02') - 0.4), r3(endOf('B1-05') - 0.4), r3(endOf('[TITLE]') - 0.05), r3(endOf('B1-18') - 0.6), r3(TOTAL - 0.1));
fs.mkdirSync(path.join(HERE, 'review'), { recursive: true });
fs.writeFileSync(path.join(HERE, 'review/manifest.json'), JSON.stringify({ total: TOTAL, panels: PANEL, contact_at: contact.sort((a, b) => a - b) }, null, 2));
const nBg = (page.match(/class="bgv/g) || []).length;
console.log('index.html — ' + TOTAL + 's, ' + segs.length + ' segments, ' + WORDLIST.length + ' words, ' + cam.length + ' camera moves, ' + sfxN + ' sounds, ' + nBg + ' glass copies' + (cutUsed ? ', ' + cutUsed + ' clips from assets/cut' : ', RAW clips (run cut.mjs)') + (estimated.length ? ' — word timing ESTIMATED for ' + estimated.join(', ') : ''));
segs.forEach((s) => console.log('  ' + s.id.padEnd(9) + String(s.start).padStart(8) + 's  ' + s.dur + 's'));

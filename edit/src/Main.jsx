import React, { useMemo, useState, useEffect, useLayoutEffect, useRef, createContext, useContext } from 'react';
import {
  AbsoluteFill, Sequence, OffthreadVideo, Audio, Loop, staticFile,
  useCurrentFrame, useVideoConfig, interpolate, spring, Easing, delayRender, continueRender
} from 'remotion';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import '@fontsource/poppins/700-italic.css';
import '@fontsource/poppins/800-italic.css';
import { ART } from './data.js';
import { isEmphasis, spokenNumber } from './emphasis.js';
import { SECS } from './timeline.js';
import { FOCUS, DEFAULT_FOCUS } from './focus.js';

const Y = '#F5C518', FONT = 'Poppins, "Helvetica Neue", Arial, sans-serif';
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const clean = (w) => String(w).toLowerCase().replace(/^[“"'(]+|[”"')\.,!?;:]+$/g, '');

/* ---------- where a hovering graphic sits ----------
   The overlays are drawn full-frame in overlays.js. In the edit they hover as a panel on the
   right of the picture, clear of the presenter, so each one is measured once (getBBox on its
   content) and fitted into that region. The measurement is cached for the whole render. */
const BBOX = {};
const MeasureCtx = createContext(() => {});
function panelRegion(width, height) { return { x: width * 0.555, y: height * 0.07, w: width * 0.43, h: height * 0.69, pad: 44 }; }
function fitFor(asset, width, height) {
  const b = BBOX[asset]; if (!b) return null;
  const P = panelRegion(width, height);
  const s = Math.min((P.w - 2 * P.pad) / b.w, (P.h - 2 * P.pad) / b.h, 0.8);
  const ox = P.x + (P.w - b.w * s) / 2 - b.x * s, oy = P.y + (P.h - b.h * s) / 2 - b.y * s;
  return { s, ox, oy, b, P, plate: { left: ox + b.x * s - P.pad, top: oy + b.y * s - P.pad, width: b.w * s + 2 * P.pad, height: b.h * s + 2 * P.pad } };
}

/* wait for Poppins before the first frame is captured */
function useFonts() {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const faces = ['500 40px Poppins', '600 40px Poppins', '700 40px Poppins', '800 40px Poppins', 'italic 700 40px Poppins', 'italic 800 40px Poppins'];
    const ready = document.fonts ? Promise.all(faces.map((f) => document.fonts.load(f))) : Promise.resolve();
    ready.then(() => continueRender(h), () => continueRender(h));
  }, [h]);
}

/* an SVG asset from overlays.js, drawn to fill the frame */
function Art({ id, transparent, style }) {
  const svg = useMemo(() => ART.svg(id, { transparent: !!transparent }), [id, transparent]);
  return <div style={{ position: 'absolute', inset: 0, ...style }} dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ').replace(/Chivo,/g, 'Poppins,') }} />;
}

function Sfx({ name, volume = 0.2, at = 0 }) {
  return <Sequence from={at}><Audio src={staticFile('sfx/' + name + '.wav')} volume={volume} /></Sequence>;
}

/* an overlay fitted into the hover panel; measures itself on first mount */
function HoverArt({ id }) {
  const bump = useContext(MeasureCtx), ref = useRef(null), { width, height } = useVideoConfig();
  const svg = useMemo(() => ART.svg(id, { transparent: true }).replace('<svg ', '<svg style="width:100%;height:100%;display:block;overflow:visible" ').replace(/Chivo,/g, 'Poppins,'), [id]);
  useLayoutEffect(() => {
    if (BBOX[id] || !ref.current) return;
    const el = ref.current.querySelector('svg'); if (!el) return;
    try {
      const bb = el.getBBox();
      if (bb.width > 0 && bb.height > 0) { BBOX[id] = { x: bb.x, y: bb.y, w: bb.width, h: bb.height }; bump((n) => n + 1); }
    } catch (e) { /* leave unfitted */ }
  }, [id]);
  const fit = fitFor(id, width, height);
  return (
    <>
      {fit && <div style={{ position: 'absolute', ...fit.plate, borderRadius: 26, background: 'rgba(10,10,12,0.56)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(255,255,255,0.09)' }} />}
      <div ref={ref} style={{ position: 'absolute', left: 0, top: 0, width, height, transformOrigin: '0 0', opacity: fit ? 1 : 0,
        transform: fit ? `translate(${fit.ox}px, ${fit.oy}px) scale(${fit.s})` : 'none' }} dangerouslySetInnerHTML={{ __html: svg }} />
    </>
  );
}

/* ---------- what is being said right now ---------- */
function activeWord(seg, frame, fps) {
  const t = frame / fps;
  return (seg.words || []).find((w) => t >= w.s && t < w.e);
}
function segAt(timeline, abs) { return timeline.segments.find((s) => s.kind === 'clip' && abs >= s.from && abs < s.from + s.dur); }
function overlayAt(timeline, abs) { return timeline.overlays.find((o) => abs >= o.from && abs < o.from + o.dur); }

/* the moment, inside an overlay's span, when a word that belongs to its figure is spoken:
   the whole picture zooms into that figure and eases back a beat later */
function figureZoom(timeline, abs, fps, width, height) {
  const o = overlayAt(timeline, abs);
  if (!o) return { z: 0, fx: 0.5, fy: 0.5 };
  const f0 = FOCUS[o.asset] || DEFAULT_FOCUS, fit = fitFor(o.asset, width, height);
  /* the focus is written against the full-frame drawing; move it to where the panel put it */
  const f = fit ? { x: (fit.ox + f0.x * width * fit.s) / width, y: (fit.oy + f0.y * height * fit.s) / height, words: f0.words } : f0;
  const seg = segAt(timeline, abs);
  if (!seg) return { z: 0, fx: f.x, fy: f.y };
  /* find the most recent trigger word at or before this frame within the overlay span */
  let at = null;
  (seg.words || []).forEach((w) => {
    const start = seg.from + Math.round(w.s * fps);
    if (start > abs || start < o.from) return;
    const hit = spokenNumber(w.w) || f.words.some((k) => clean(w.w).indexOf(k) === 0 || clean(w.w) === k);
    if (hit && (at == null || start > at)) at = start;
  });
  if (at == null) return { z: 0, fx: f.x, fy: f.y };
  const inn = spring({ frame: abs - at, fps, config: { damping: 20, stiffness: 60, mass: 1 }, durationInFrames: 28 });
  const hold = Math.round(1.6 * fps);
  const out = abs - at > hold ? spring({ frame: abs - at - hold, fps, config: { damping: 22, stiffness: 50, mass: 1 }, durationInFrames: 30 }) : 0;
  return { z: clamp01(inn - out), fx: f.x, fy: f.y };
}

/* ---------- captions ---------- */
function phrases(words) {
  const out = []; let cur = [];
  words.forEach((w, i) => {
    cur.push(w);
    const end = /[.!?]["”]?$/.test(w.w) || /[,;:]["”]?$/.test(w.w) && cur.length >= 3 || cur.length >= 5;
    if (end || i === words.length - 1) { out.push(cur); cur = []; }
  });
  /* a lone word at the end of a sentence ("cent.") reads better attached to the group before it */
  for (let i = out.length - 1; i > 0; i--) if (out[i].length === 1 && out[i - 1].length <= 5) { out[i - 1] = out[i - 1].concat(out[i]); out.splice(i, 1); }
  return out.map((p) => ({ words: p, s: p[0].s, e: p[p.length - 1].e }));
}
function Captions({ seg, series, tall, hook }) {
  const frame = useCurrentFrame(), { fps, width, height } = useVideoConfig();
  const t = frame / fps, abs = seg.from + frame;
  const groups = useMemo(() => phrases(seg.words || []), [seg.words]);
  const g = groups.find((p) => t >= p.s - 0.08 && t <= p.e + 0.45);
  if (!g) return null;
  const enter = spring({ frame: frame - Math.round(g.s * fps), fps, config: { damping: 18, stiffness: 220, mass: 0.6 }, durationInFrames: 10 });
  const size = tall ? 60 : hook ? 58 : 52;
  /* the disclosure plate holds the bottom-left for three seconds: captions sit higher */
  const discl = abs < Math.round(SECS.disclosure * fps);
  const bottom = tall ? height * 0.30 : discl ? height * 0.27 : series === 'C' ? height * 0.24 : height * 0.14;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
      <div style={{
        maxWidth: width * 0.76, padding: '12px 28px', borderRadius: 12, background: 'rgba(8,8,10,0.44)',
        transform: `translateY(${(1 - enter) * 14}px) scale(${0.96 + 0.04 * enter})`, opacity: enter,
        fontFamily: FONT, fontWeight: 600, fontSize: size, letterSpacing: '-0.025em', lineHeight: 1.18, color: '#fff',
        textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,0.55)', textWrap: 'balance'
      }}>
        {g.words.map((w, i) => {
          const on = t >= w.s - 0.02 && t < w.e + 0.02, past = t >= w.e;
          const num = spokenNumber(w.w), emp = num || isEmphasis(w.w, series);
          const pop = emp ? spring({ frame: frame - Math.round(w.s * fps), fps, config: { damping: 14, stiffness: 260, mass: 0.5 }, durationInFrames: 9 }) : 0;
          /* numbers: bold and yellow. key words: italic, heavier, yellow. everything else: white, dimmer until said */
          return (
            <span key={i} style={{
              display: 'inline-block', margin: '0 0.13em',
              color: emp && (on || past) ? Y : on ? '#fff' : 'rgba(255,255,255,0.7)',
              fontWeight: emp ? 800 : 600, fontStyle: emp && !num ? 'italic' : 'normal',
              transform: emp ? `scale(${1 + 0.10 * pop})` : 'none'
            }}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- a clip with its motion ---------- */
function Clip({ seg }) {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const push = 1 + 0.045 * clamp01(frame / Math.max(1, seg.dur));
  const w = activeWord(seg, frame, fps);
  const punchAt = w && spokenNumber(w.w) ? Math.round(w.s * fps) : null;
  const punch = punchAt != null ? spring({ frame: frame - punchAt, fps, config: { damping: 16, stiffness: 180, mass: 0.7 }, durationInFrames: 10 }) : 0;
  return (
    <AbsoluteFill style={{ transform: `scale(${push + 0.04 * punch})`, transformOrigin: '50% 45%' }}>
      <OffthreadVideo src={staticFile(seg.src)} startFrom={seg.startFrom || 0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
}

/* ---------- an overlay hovering over the footage ---------- */
function OverlayLayer({ o }) {
  const frame = useCurrentFrame();
  const enter = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const leave = interpolate(frame, [o.dur - 12, o.dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a = Math.min(enter, leave);
  /* a slow float, so the graphic feels placed on the picture rather than stamped on it */
  const dy = 5 * Math.sin(frame / 26), ds = 1 + 0.004 * Math.sin(frame / 34);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ transform: `translateY(${(1 - enter) * 22 + dy}px) scale(${ds})`, transformOrigin: '77% 42%' }}>
        <HoverArt id={o.asset} />
      </AbsoluteFill>
      <Sfx name="whoosh" volume={0.18} />
    </AbsoluteFill>
  );
}

/* ---------- cards ---------- */
function Intro({ asset, dur }) {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const reveal = spring({ frame, fps, config: { damping: 22, stiffness: 80 }, durationInFrames: 22 });
  const out = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#000', opacity: out }}>
      <AbsoluteFill style={{ transform: `scale(${1.05 - 0.05 * reveal})`, opacity: reveal, clipPath: `inset(0 ${(1 - reveal) * 100}% 0 0)` }}>
        <Art id={asset} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, bottom: 0, height: 4, width: `${reveal * 100}%`, background: Y }} />
      <Sfx name="rise" volume={0.22} />
    </AbsoluteFill>
  );
}
function QCard({ asset, dur }) {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 8, dur - 8, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ background: '#000', opacity: a }}><Art id={asset} /><Sfx name="pop" volume={0.16} /></AbsoluteFill>;
}
function Outro({ asset, dur }) {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const rise = spring({ frame, fps, config: { damping: 20, stiffness: 70 }, durationInFrames: 26 });
  const fade = interpolate(frame, [dur - 15, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ background: '#141416', opacity: fade }}>
      <AbsoluteFill style={{ transform: `translateY(${(1 - rise) * 24}px)`, opacity: rise }}><Art id={asset} /></AbsoluteFill>
      <Sfx name="tick" volume={0.16} />
    </AbsoluteFill>
  );
}
function Disclosure({ asset, dur }) {
  const frame = useCurrentFrame();
  const a = interpolate(frame, [0, 6, dur - 10, dur], [0, 1, 1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: a }}><Art id={asset} transparent /></AbsoluteFill>;
}
function Plate({ asset, dur }) {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const inn = spring({ frame, fps, config: { damping: 18, stiffness: 140 }, durationInFrames: 12 });
  const out = interpolate(frame, [dur - 8, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: inn * out, transform: `translateY(${(1 - inn) * 10}px)` }}><Art id={asset} transparent /></AbsoluteFill>;
}
/* the host listening in the top-right box, only while an owner talks */
function HostBox({ timeline, seg }) {
  const clips = timeline.listen.filter((l) => l.dur > 0);
  if (!clips.length) return null;
  const l = clips[(seg.bite || 0) % clips.length];
  const box = { left: 1440, top: 80, width: 400, height: 225 };
  return (
    <>
      <div style={{ position: 'absolute', ...box, overflow: 'hidden', background: '#000' }}>
        <Loop durationInFrames={l.dur}>
          <OffthreadVideo src={staticFile(l.src)} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </Loop>
      </div>
      <Art id={timeline.hostFrame} transparent />
    </>
  );
}

/* the picture — footage and overlays together — so a zoom into a figure moves both */
function Stage({ timeline, children }) {
  const frame = useCurrentFrame(), { fps, width, height } = useVideoConfig();
  const { z, fx, fy } = figureZoom(timeline, frame, fps, width, height);
  return (
    <AbsoluteFill style={{ transform: `scale(${1 + 0.2 * z})`, transformOrigin: `${fx * 100}% ${fy * 100}%`, background: '#000' }}>
      {children}
    </AbsoluteFill>
  );
}

/* ---------- the whole video ---------- */
export function Main({ timeline }) {
  useFonts();
  const { width, height } = useVideoConfig();
  const tall = height > width, series = timeline.series;
  const fpsDur = (s) => Math.round(s * timeline.fps);
  const [, bump] = useState(0);
  return (
    <MeasureCtx.Provider value={bump}>
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      <Stage timeline={timeline}>
        {timeline.segments.map((seg, i) => (
          <Sequence key={i} from={seg.from} durationInFrames={seg.dur} name={seg.id || seg.kind}>
            {seg.kind === 'clip' && <Clip seg={seg} />}
          </Sequence>
        ))}
        {timeline.overlays.map((o, i) => (
          <Sequence key={'o' + i} from={o.from} durationInFrames={o.dur} name={'overlay ' + o.id}>
            <OverlayLayer o={o} />
          </Sequence>
        ))}
      </Stage>
      {timeline.segments.map((seg, i) => (
        <Sequence key={'k' + i} from={seg.from} durationInFrames={seg.dur} name={seg.kind}>
          {seg.kind === 'intro' && <Intro asset={seg.asset} dur={seg.dur} />}
          {seg.kind === 'qcard' && <QCard asset={seg.asset} dur={seg.dur} />}
          {seg.kind === 'outro' && <Outro asset={seg.asset} dur={seg.dur} />}
        </Sequence>
      ))}
      {timeline.segments.filter((s) => s.kind === 'clip').map((seg, i) => (
        <Sequence key={'c' + i} from={seg.from} durationInFrames={seg.dur} name={'captions ' + seg.id}>
          {series === 'C' && seg.plate && !seg.cold && <HostBox timeline={timeline} seg={seg} />}
          {series === 'C' && seg.plate && !seg.cold && (
            <Sequence from={0} durationInFrames={Math.min(seg.dur, fpsDur(SECS.plate))}><Plate asset={seg.plate} dur={Math.min(seg.dur, fpsDur(SECS.plate))} /></Sequence>
          )}
          <Captions seg={seg} series={series} tall={tall} hook={seg.hook} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={fpsDur(SECS.disclosure)} name="disclosure">
        <Disclosure asset={timeline.disclosure} dur={fpsDur(SECS.disclosure)} />
      </Sequence>
    </AbsoluteFill>
    </MeasureCtx.Provider>
  );
}

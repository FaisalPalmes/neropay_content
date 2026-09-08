import React, { useMemo, useState, useEffect } from 'react';
import {
  AbsoluteFill, Sequence, OffthreadVideo, Audio, Loop, staticFile,
  useCurrentFrame, useVideoConfig, interpolate, spring, Easing, delayRender, continueRender
} from 'remotion';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import '@fontsource/poppins/800.css';
import { ART } from './data.js';
import { isEmphasis, spokenNumber } from './emphasis.js';
import { SECS } from './timeline.js';

const Y = '#F5C518', FONT = 'Poppins, "Helvetica Neue", Arial, sans-serif';
const clamp01 = (x) => Math.max(0, Math.min(1, x));

/* wait for Poppins before the first frame is captured */
function useFonts() {
  const [h] = useState(() => delayRender('fonts'));
  useEffect(() => {
    const ready = document.fonts ? Promise.all(['500', '600', '700', '800'].map((w) => document.fonts.load(w + ' 40px Poppins'))) : Promise.resolve();
    ready.then(() => continueRender(h), () => continueRender(h));
  }, [h]);
}

/* an SVG asset from overlays.js, drawn to fill the frame */
function Art({ id, transparent, style }) {
  const svg = useMemo(() => ART.svg(id, { transparent: !!transparent }), [id, transparent]);
  return <div style={{ position: 'absolute', inset: 0, ...style }} dangerouslySetInnerHTML={{ __html: svg.replace('<svg ', '<svg style="width:100%;height:100%;display:block" ') }} />;
}

function Sfx({ name, volume = 0.2, at = 0 }) {
  return <Sequence from={at}><Audio src={staticFile('sfx/' + name + '.wav')} volume={volume} /></Sequence>;
}

/* ---------- captions ---------- */
function phrases(words) {
  const out = []; let cur = [];
  words.forEach((w, i) => {
    cur.push(w);
    const end = /[.!?]["”]?$/.test(w.w) || /[,;:]["”]?$/.test(w.w) && cur.length >= 3 || cur.length >= 5;
    if (end || i === words.length - 1) { out.push(cur); cur = []; }
  });
  return out.map((p) => ({ words: p, s: p[0].s, e: p[p.length - 1].e }));
}
function Captions({ seg, series, tall, hook, timeline }) {
  const frame = useCurrentFrame(), { fps, width, height } = useVideoConfig();
  const t = frame / fps, abs = seg.from + frame;
  const groups = useMemo(() => phrases(seg.words || []), [seg.words]);
  const g = groups.find((p) => t >= p.s - 0.08 && t <= p.e + 0.45);
  if (!g) return null;
  const enter = spring({ frame: frame - Math.round(g.s * fps), fps, config: { damping: 18, stiffness: 220, mass: 0.6 }, durationInFrames: 10 });
  const size = tall ? 60 : hook ? 60 : 54;
  /* an overlay is up: the presenter is in the bottom-right corner, so captions sit left */
  const ovUp = !tall && timeline.overlays.some((o) => abs >= o.from && abs < o.from + o.dur);
  /* the disclosure plate holds the bottom-left for three seconds: captions sit higher */
  const discl = abs < Math.round(SECS.disclosure * fps);
  const bottom = tall ? height * 0.30 : discl ? height * 0.27 : series === 'C' ? height * 0.24 : height * 0.15;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom, display: 'flex', justifyContent: ovUp ? 'flex-start' : 'center', paddingLeft: ovUp ? width * 0.075 : 0, pointerEvents: 'none' }}>
      <div style={{
        maxWidth: width * (ovUp ? 0.58 : 0.78), padding: '12px 26px', borderRadius: 12, background: 'rgba(8,8,10,0.46)',
        transform: `translateY(${(1 - enter) * 14}px) scale(${0.96 + 0.04 * enter})`, opacity: enter,
        fontFamily: FONT, fontWeight: 600, fontSize: size, letterSpacing: '-0.02em', lineHeight: 1.18, color: '#fff',
        textAlign: ovUp ? 'left' : 'center', textShadow: '0 2px 12px rgba(0,0,0,0.55)', textWrap: 'balance'
      }}>
        {g.words.map((w, i) => {
          const on = t >= w.s - 0.02 && t < w.e + 0.02, past = t >= w.e, emp = isEmphasis(w.w, series);
          const pop = emp ? spring({ frame: frame - Math.round(w.s * fps), fps, config: { damping: 14, stiffness: 260, mass: 0.5 }, durationInFrames: 9 }) : 0;
          return (
            <span key={i} style={{
              display: 'inline-block', margin: '0 0.14em',
              color: emp && (on || past) ? Y : on ? '#fff' : 'rgba(255,255,255,0.72)',
              fontWeight: emp ? 800 : 600,
              transform: emp ? `scale(${1 + 0.10 * pop})` : 'none'
            }}>{w.w}</span>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- a clip with its motion ---------- */
function activeWord(seg, frame, fps) {
  const t = frame / fps;
  return (seg.words || []).find((w) => t >= w.s && t < w.e);
}
function Clip({ seg, timeline, tall }) {
  const frame = useCurrentFrame(), { fps, width, height } = useVideoConfig();
  const abs = seg.from + frame;
  const ov = timeline.overlays.find((o) => abs >= o.from && abs < o.from + o.dur);
  /* slow push over the whole shot, a small punch when a number lands */
  const push = 1 + 0.05 * clamp01(frame / Math.max(1, seg.dur));
  const w = activeWord(seg, frame, fps);
  const punchAt = w && spokenNumber(w.w) ? Math.round(w.s * fps) : null;
  const punch = punchAt != null ? spring({ frame: frame - punchAt, fps, config: { damping: 16, stiffness: 180, mass: 0.7 }, durationInFrames: 10 }) : 0;
  /* while an overlay is up, the presenter tucks into the corner */
  let pip = 0;
  if (ov && !tall) {
    const enter = spring({ frame: abs - ov.from, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 16 });
    const exitAt = ov.from + ov.dur - 12, exit = abs >= exitAt ? spring({ frame: abs - exitAt, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: 12 }) : 0;
    pip = clamp01(enter - exit);
  }
  /* corner box: 28% of the frame, 40px in from the bottom-right */
  const scale = (push + 0.05 * punch) * (1 - 0.72 * pip);
  const tx = pip * (width * 0.36 - 40), ty = pip * (height * 0.36 - 40);
  return (
    <AbsoluteFill style={{ background: 'transparent' }}>
      <AbsoluteFill style={{
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`, transformOrigin: '50% 50%',
        borderRadius: 10 * pip, overflow: 'hidden', boxShadow: pip ? `0 20px 60px rgba(0,0,0,${0.6 * pip})` : 'none'
      }}>
        <OffthreadVideo src={staticFile(seg.src)} startFrom={seg.startFrom || 0} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
}

/* ---------- overlays, drawn under the corner presenter ---------- */
function OverlayLayer({ o, timeline }) {
  const frame = useCurrentFrame(), { fps } = useVideoConfig();
  const abs = o.from + frame;
  const seg = timeline.segments.find((s) => s.kind === 'clip' && abs >= s.from && abs < s.from + s.dur);
  const w = seg ? activeWord(seg, abs - seg.from, fps) : null;
  const zoomAt = w && spokenNumber(w.w) ? Math.round(w.s * fps) + seg.from : null;
  const zoom = zoomAt != null ? spring({ frame: abs - zoomAt, fps, config: { damping: 18, stiffness: 90, mass: 0.9 }, durationInFrames: 24 }) : 0;
  const enter = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) });
  const leave = interpolate(frame, [o.dur - 10, o.dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const a = Math.min(enter, leave);
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <AbsoluteFill style={{ background: '#000' }} />
      <AbsoluteFill style={{ transform: `translateY(${(1 - enter) * 18}px) scale(${1 + 0.08 * zoom})`, transformOrigin: '38% 52%' }}>
        <Art id={o.asset} transparent />
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

/* ---------- the whole video ---------- */
export function Main({ timeline }) {
  useFonts();
  const { width, height } = useVideoConfig();
  const tall = height > width, series = timeline.series;
  const fpsDur = (s) => Math.round(s * timeline.fps);
  return (
    <AbsoluteFill style={{ background: '#000', fontFamily: FONT }}>
      {/* overlays sit underneath: the presenter shrinks into the corner on top of them */}
      {timeline.overlays.map((o, i) => (
        <Sequence key={'o' + i} from={o.from} durationInFrames={o.dur} name={'overlay ' + o.id}>
          <OverlayLayer o={o} timeline={timeline} />
        </Sequence>
      ))}
      {timeline.segments.map((seg, i) => (
        <Sequence key={i} from={seg.from} durationInFrames={seg.dur} name={seg.id || seg.kind}>
          {seg.kind === 'clip' && <Clip seg={seg} timeline={timeline} tall={tall} />}
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
          <Captions seg={seg} series={series} tall={tall} hook={seg.hook} timeline={timeline} />
        </Sequence>
      ))}
      <Sequence from={0} durationInFrames={fpsDur(SECS.disclosure)} name="disclosure">
        <Disclosure asset={timeline.disclosure} dur={fpsDur(SECS.disclosure)} />
      </Sequence>
    </AbsoluteFill>
  );
}

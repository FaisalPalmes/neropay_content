import React from 'react';
import { AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

/* A stand-in for a Higgsfield render, so the whole pipeline can be exercised before the
   real clips exist. Charcoal frame, the shot id, a moving bar, and a ticking tone so
   audio timing is visible on a waveform. Never ships. */
export function Placeholder({ id, text }) {
  const frame = useCurrentFrame(), { fps, durationInFrames, width, height } = useVideoConfig();
  const p = frame / durationInFrames;
  return (
    <AbsoluteFill style={{ background: '#1C1C21', color: '#fff', fontFamily: 'Poppins, Arial, sans-serif' }}>
      <div style={{ position: 'absolute', left: 60, top: 50, fontSize: 28, letterSpacing: '0.2em', color: '#9A9A9A' }}>PLACEHOLDER RENDER</div>
      <div style={{ position: 'absolute', left: 60, top: 100, fontSize: 120, fontWeight: 800 }}>{id}</div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 270, fontSize: 30, lineHeight: 1.4, color: '#D6D6D6' }}>{text}</div>
      <div style={{ position: 'absolute', left: 60, bottom: 60, height: 8, width: (width - 120) * p, background: '#F5C518' }} />
      <div style={{ position: 'absolute', right: 60, bottom: 50, fontSize: 26, color: '#9A9A9A' }}>{(frame / fps).toFixed(1)}s</div>
      <Audio src={staticFile('sfx/tone.wav')} volume={0.5} />
    </AbsoluteFill>
  );
}

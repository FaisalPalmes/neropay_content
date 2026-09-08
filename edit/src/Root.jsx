import React from 'react';
import { Composition, staticFile } from 'remotion';
import { DATA } from './data.js';
import { buildTimeline, FPS } from './timeline.js';
import { Main } from './Main.jsx';
import { Placeholder } from './Placeholder.jsx';

async function loadProbe(vid) {
  try {
    const r = await fetch(staticFile('captions/' + vid + '.json'));
    if (!r.ok) return null;
    return await r.json();
  } catch (e) { return null; }
}

export const Root = () => (
  <>
    <Composition
      id="Main"
      component={Main}
      fps={FPS}
      width={1920}
      height={1080}
      durationInFrames={300}
      defaultProps={{ vid: 'B1' }}
      calculateMetadata={async ({ props }) => {
        const probe = await loadProbe(props.vid);
        const timeline = buildTimeline(DATA, props.vid, probe, props);
        return { durationInFrames: timeline.total, width: timeline.width, height: timeline.height, props: { ...props, timeline } };
      }}
    />
    <Composition
      id="Placeholder"
      component={Placeholder}
      fps={FPS}
      width={1280}
      height={720}
      durationInFrames={150}
      defaultProps={{ id: 'B1-01', secs: 5, text: '' }}
      calculateMetadata={async ({ props }) => ({ durationInFrames: Math.round(props.secs * FPS) })}
    />
  </>
);

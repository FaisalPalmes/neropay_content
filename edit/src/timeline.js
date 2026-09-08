/* Builds the edit from the repo's data. Pure: no browser, no Remotion, so the same
   function runs in the composition and in the node scripts.

   probe (optional) comes from public/captions/<VID>.json:
     { clips: { "B1-01": { dur: 9.83 } }, words: { "B1-01": [ { w, s, e } ] } }
   dur is the real length of the render in seconds; words are Whisper timings when
   you have them. Anything missing falls back to the planned length and an estimate. */

export const FPS = 30;
export const SECS = { intro: 3, outro: 6, qcard: 3, cold: 3, plate: 4, disclosure: 3 };
/* the presenter's own intro line, when a <VID>-INTRO clip is supplied */
export const INTRO_LINE = "Hi, I'm Ava, and this is Explained by NeroPay.";

const f = (s) => Math.round(s * FPS);

export function plannedSecs(shot) {
  if (shot.secs) return shot.secs;
  const m = (shot.prompt || '').match(/ - (\d+)s/);
  return m ? +m[1] : 8;
}

/* Spread the known script across the clip when there are no real word timings.
   Speech in a generated clip starts a beat in and ends a beat before the cut. */
export function estimateWords(text, dur, lead = 0.35, tail = 0.3) {
  const tokens = String(text || '').split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  const weight = (w) => w.replace(/[^\w£%.]/g, '').length + 1 + (/[.,!?;:]["”]?$/.test(w) ? 3 : 0);
  const total = tokens.reduce((a, w) => a + weight(w), 0);
  const speak = Math.max(0.6, dur - lead - tail);
  let cursor = lead;
  return tokens.map((w) => {
    const span = (speak * weight(w)) / total;
    const out = { w, s: +cursor.toFixed(3), e: +(cursor + span - 0.03).toFixed(3) };
    cursor += span;
    return out;
  });
}

/* Words for one clip, relative to the frames we actually show (after startFrom). */
function wordsFor(probe, id, spoken, dur, startFrom = 0) {
  const real = probe && probe.words && probe.words[id];
  /* an estimate is already spread over the part we show; real timings are shifted by the trim */
  const words = real && real.length ? real.map((x) => ({ w: x.w, s: x.s - startFrom, e: x.e - startFrom })) : estimateWords(spoken, dur);
  return words
    .filter((x) => x.e > 0)
    .map((x) => ({ w: x.w, s: Math.max(0, x.s), e: x.e }));
}

function assets(series, aspect) {
  if (series === 'C') return { intro: 'CALL/TITLE', outro: 'CALL/END', disclosure: 'CALL/DISCLOSURE', frame: 'CALL/FRAME' };
  const tall = aspect === '9:16';
  return { intro: tall ? 'TITLE/9x16' : 'TITLE/16x9', outro: series === 'A' ? 'END/A' : 'END/B', disclosure: tall ? 'AI/9x16' : 'AI/16x9' };
}

export function buildTimeline({ VIDEOS, CALLS }, vid, probe, opts = {}) {
  const series = vid.charAt(0);
  const clipDur = (id, planned) => (probe && probe.clips && probe.clips[id] && probe.clips[id].dur) || planned;
  /* hand trims from captions/<VID>.trims.json, carried in the probe: seconds cut from the head / tail */
  const trimIn = (id) => (probe && probe.clips && probe.clips[id] && probe.clips[id].in) || 0;
  const trimOut = (id) => (probe && probe.clips && probe.clips[id] && probe.clips[id].out) || 0;
  const segments = [], overlays = [];
  let t = 0;
  const push = (seg) => { seg.from = t; t += seg.dur; segments.push(seg); return seg; };

  if (series === 'C') {
    const e = CALLS.episodes.find((x) => x.id === vid);
    if (!e) throw new Error('No episode ' + vid);
    const cast = {}; CALLS.cast.forEach((c) => { cast[c.key] = c; });
    const A = assets('C', '16:9');
    if (e.cold) {
      const dur = clipDur(e.cold.id, e.cold.secs), startFrom = Math.max(0, dur - SECS.cold);
      push({ kind: 'clip', id: e.cold.id, src: 'clips/' + e.cold.id + '.mp4', dur: f(Math.min(SECS.cold, dur)), startFrom: f(startFrom),
        spoken: e.cold.spoken, words: wordsFor(probe, e.cold.id, e.cold.spoken, dur, startFrom), who: e.cold.who, cold: true, hook: true });
    }
    let bite = 0;
    e.shots.forEach((s) => {
      if (s.kind === 'title') { push({ kind: 'intro', asset: A.intro, dur: f(SECS.intro) }); push({ kind: 'qcard', asset: vid + '/Q', dur: f(SECS.qcard) }); return; }
      if (s.kind === 'end') { push({ kind: 'outro', asset: A.outro, dur: f(SECS.outro) }); return; }
      const dur = clipDur(s.id, s.secs);
      const seg = { kind: 'clip', id: s.id, src: 'clips/' + s.id + '.mp4', dur: f(dur), startFrom: 0, spoken: s.spoken,
        words: wordsFor(probe, s.id, s.spoken, dur), delivery: s.delivery, hook: segments.every((x) => x.kind !== 'intro') };
      if (s.kind === 'host') seg.who = 'host';
      else { const c = cast[s.who]; seg.who = s.who; seg.plate = 'CALL/NAME-' + s.who.toUpperCase(); seg.name = c.name; seg.bite = bite++; }
      push(seg);
    });
    const listen = CALLS.listen.map((l) => ({ id: l.id, src: 'clips/' + l.id + '.mp4', dur: f(clipDur(l.id, l.secs)) }));
    return { vid, series, fps: FPS, width: 1920, height: 1080, segments, overlays, total: t, disclosure: A.disclosure, hostFrame: A.frame, listen, title: e.title };
  }

  const v = VIDEOS.videos.find((x) => x.id === vid);
  if (!v) throw new Error('No video ' + vid);
  const A = assets(series, v.aspect);
  /* once the clips have been probed, a shot with no render is left out of the cut rather
     than breaking it — so a partial batch still produces a watchable video */
  const present = (id) => !probe || !probe.clips || !!probe.clips[id];
  const byId = {}; v.shots.forEach((s) => { if (!s.spoken || present(s.id)) byId[s.id] = s; });
  const cover = (o) => {
    let ids = o.over.match(/[AB]\d-\d\d/g) || [];
    if (ids.length === 2 && /\bto\b/.test(o.over)) {
      const a = +ids[0].slice(3), b = +ids[1].slice(3), pre = ids[0].slice(0, 3), all = [];
      for (let i = a; i <= b; i++) all.push(pre + (i < 10 ? '0' : '') + i);
      ids = all;
    }
    return ids.filter((id) => byId[id]);
  };
  /* an optional presenter intro ("Hi, I'm Ava, this is Explained by NeroPay") sits just
     before the title card, if a clip called <VID>-INTRO.mp4 was supplied */
  const introId = vid + '-INTRO', hasIntro = probe && probe.clips && probe.clips[introId];
  v.shots.forEach((s) => {
    if (s.id === '[TITLE]') {
      if (hasIntro) {
        const inn = trimIn(introId), dur = probe.clips[introId].dur - inn - trimOut(introId), line = INTRO_LINE;
        push({ kind: 'clip', id: introId, src: 'clips/' + introId + '.mp4', dur: f(dur), startFrom: f(inn), spoken: line,
          words: wordsFor(probe, introId, line, dur, inn), who: 'presenter', hook: true, intro: true });
      }
      push({ kind: 'intro', asset: A.intro, dur: f(SECS.intro) }); return;
    }
    if (s.id === '[END]') { push({ kind: 'outro', asset: A.outro, dur: f(SECS.outro) }); return; }
    if (!present(s.id)) return;
    const inn = trimIn(s.id), dur = clipDur(s.id, plannedSecs(s)) - inn - trimOut(s.id);
    push({ kind: 'clip', id: s.id, src: 'clips/' + s.id + '.mp4', dur: f(dur), startFrom: f(inn), spoken: s.spoken,
      words: wordsFor(probe, s.id, s.spoken, dur, inn), delivery: s.delivery, ov: s.ov, who: 'presenter', hook: segments.every((x) => x.kind !== 'intro') });
  });
  const segById = {}; segments.forEach((s) => { if (s.id) segById[s.id] = s; });
  v.overlays.forEach((o) => {
    const ids = cover(o).filter((id) => segById[id]); if (!ids.length) return;
    const first = segById[ids[0]], last = segById[ids[ids.length - 1]];
    if (!first || !last) return;
    overlays.push({ id: o.id, asset: vid + '/' + o.id, from: first.from, dur: last.from + last.dur - first.from, over: ids });
  });
  const tall = v.aspect === '9:16';
  return { vid, series, fps: FPS, width: tall ? 1080 : 1920, height: tall ? 1920 : 1080, segments, overlays, total: t, disclosure: A.disclosure, title: v.title };
}

/* Everything the timeline expects to find in public/clips for this video. */
export function clipIds({ VIDEOS, CALLS }, vid) {
  if (vid.charAt(0) === 'C') {
    const e = CALLS.episodes.find((x) => x.id === vid);
    return e.shots.filter((s) => s.kind === 'host' || s.kind === 'bite').map((s) => ({ id: s.id, secs: s.secs, spoken: s.spoken }))
      .concat(CALLS.listen.map((l) => ({ id: l.id, secs: l.secs, spoken: '' })));
  }
  const v = VIDEOS.videos.find((x) => x.id === vid);
  return v.shots.filter((s) => s.spoken).map((s) => ({ id: s.id, secs: plannedSecs(s), spoken: s.spoken }))
    .concat([{ id: vid + '-INTRO', secs: 4, spoken: INTRO_LINE, optional: true }]);
}

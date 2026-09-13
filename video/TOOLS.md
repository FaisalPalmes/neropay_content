# Tools register — third-party libraries worth keeping an eye on

Repos Faisal has come across and wants kept. Each entry says what the thing is, what it would do for NeroPay content,
what it would do for the paid-social client work, and the verdict as of the date on the row. Nothing here is installed
unless the entry says so. Before pulling any of them into a build, re-read the environment rules in `CLAUDE.md`
(no CDN scripts — vendor the file; every frame must be seek-safe and deterministic for HyperFrames).

| Repo | What it is | Licence | Saved |
|---|---|---|---|
| [dashersw/liquid-glass-js](https://github.com/dashersw/liquid-glass-js) | Apple "Liquid Glass" panels for the web: WebGL refraction, blur and tint over whatever sits behind the element. Rounded, circle and pill shapes; nested glass. ~1,300 lines, no build step. Samples the page with html2canvas. | MIT | 13 Sep 2026 |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | React renderer for three.js — 3D scenes written as JSX components. v9 pairs with React 19. | MIT | 13 Sep 2026 |
| [ruucm/shadergradient](https://github.com/ruucm/shadergradient) | Animated 3D gradients (the Framer / Figma plugin); the `@shadergradient/react` package renders through react-three-fiber + three. Presets, camera controls, driven by props or a query string. | MIT | 13 Sep 2026 |
| [collidingScopes/liquid-logo](https://github.com/collidingScopes/liquid-logo) | Browser tool that turns a logo PNG into a "liquid metal" animation: a fragment shader finds the edges, builds a vector field and flows simplex noise along it with a metallic sheen. Exports PNG or MP4 (WebCodecs + mp4-muxer) in the browser. | MIT | 13 Sep 2026 |

## What each one means for this project

**liquid-glass-js — the look we already have, built a way we can't render.** Our panels (v6 onward, `video/b1-v8/build.mjs`
`glass()`) are the liquid-glass look: a blurred copy of the footage behind each panel, tint, sheen, rim. LESSONS #27 is why
they are not a `backdrop-filter` — Chrome re-rasterises the blur under a transform, so the blur edge drifts during the lean
and the fold-away. liquid-glass-js has the same problem one layer down: its refraction reads the page through html2canvas,
which cannot see a `<video>` frame, and it runs on `requestAnimationFrame`, which a frame-by-frame render does not drive.
So it is not a drop-in for the panels. What it *is* good for: the refraction shader itself (`container.js`) as a reference
if Faisal ever asks for the panel edge to bend the footage rather than blur it — that would be a new pass over the `.bg`
copy, written as our own shader with the time driven from HyperFrames' seek clock, not this library. Also a decent
reference for the pill and circle shapes if we ever want a glass chip that isn't a rounded rectangle. Verdict: keep as a
reference, don't install.

**react-three-fiber — not for the videos, maybe for the editor.** The HyperFrames compositions are plain HTML + GSAP, and
HyperFrames already has a three.js adapter for a 3D scene if one is ever needed; putting React in front of it adds a
bundler and a runtime for no gain. The one place it would slot in is `edit/`, the Remotion editor, which is React — Remotion
has `@remotion/three` for exactly this. But nothing in the series calls for a 3D scene: the brand rule is that the terminal
is the only branded object in frame, and a 3D terminal would need a model and a lot of care to look real rather than like
a render. Verdict: nothing to do now. Revisit only if Faisal asks for a 3D product shot of the Flex (and then compare with
Higgsfield's 3D generation first).

**shadergradient — the only one with a job in reach, and it's a small one.** The title and end card sit on a near-white
ground with three static, heavily blurred yellow blooms (MOTION-SYSTEM v3, chosen 11 Sep). A slow, barely moving version
of that ground is the kind of thing shadergradient makes, and its presets are close to our palette. Two things stand in
the way. It needs React + react-three-fiber + three, which is the wrong weight for a background on two cards; the same
result is a few dozen lines of GLSL or even animated CSS gradients, seek-safe, no dependencies. And the brand asks for
everything sharp and still — the blooms are static on purpose, and a moving background under "NeroPay" is a taste call
for Faisal, not a default. Verdict: keep for the palette and the presets as a reference; if Faisal wants the blooms to
breathe, write it as our own shader and time it from the seek clock. For the paid-social clients (below) it is more
directly useful.

**liquid-logo — off-brand for NeroPay, useful for client stings.** Liquid chrome is the opposite of the NeroPay wordmark
(Nero white, Pay yellow, flat, on charcoal), so this stays out of the series. Where it earns its place is a client logo
sting for the paid-social work: drop the client's PNG in, pick a preset, export a 3–5 s MP4 in the browser, use it as a
Reel opener or the last card of an ad. It runs entirely client-side (the logo never leaves the machine — fine for client
assets). Its shader is also driven by uniforms, so the same effect could be run inside a HyperFrames composition with the
time uniform bound to the seek clock — but the browser export is the quick path and is enough for a sting. Verdict: the
first one to actually use, for clients, not for NeroPay.

## For the paid-social client work

- **A logo sting or Reel opener**: liquid-logo, straight from the browser tool. Five minutes per client.
- **A moving gradient ground for stat cards, hooks, end cards**: shadergradient's presets as the reference; render either
  via its Framer/Figma plugin (if the client work is designed there) or as a small shader in a HyperFrames stat card.
- **Glass UI chips over footage**: liquid-glass-js for the look on a *website* or landing page; for video, our own
  `glass()` pattern in `video/b1-v8/build.mjs`, which is already the same aesthetic and renders deterministically.
- **3D**: react-three-fiber only if a client brief genuinely needs a 3D scene in a React app; for a one-off 3D product
  shot in a video, Higgsfield's generation tools get there faster.

## Rules that apply before any of these touch a build

- No CDN scripts in the web container — vendor into `video/vendor/` (liquid-glass-js's quick start loads html2canvas from
  jsdelivr; that line would be blocked).
- HyperFrames renders frame by frame: anything driven by `requestAnimationFrame`, `Date.now()` or `performance.now()` has to be
  rewritten to take its time from the seek clock or it renders wrong. liquid-logo and liquid-glass-js both use wall-clock time.
- Brand rules from `CLAUDE.md` hold for every frame: Nero white, Pay yellow as an accent on charcoal, no bokeh, no props.

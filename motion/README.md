# motion/ — the motion graphics workspace

`motion/CLAUDE.md` is the style spec — read it first. Each series has its own folder and its own
`CLAUDE.md` carrying the premise and the episode bank. This file is the workspace mechanics and the
open tooling questions that apply to every series.

## Layout

```
figures.json              repo root — the figure register, shared by every series
motion/
  CLAUDE.md               the style spec: rails, look, timing law, pipeline
  verify.py               stage 3 — the arithmetic gate, run before any frame is rendered
  <series>/
    CLAUDE.md             premise, spec, episode bank for that series
    <episode>/
      checks.py           computes every on-screen figure and asserts it. Required.
      index.html          self-contained, setFrame(n) drives the render
      script.md           VO script and on-screen copy
      out/                git-ignored
```

```
python3 motion/verify.py                    # audit figures.json
python3 motion/verify.py maths/episode-4    # audit, then run that episode's checks
```

`checks.py` runs with `figure()`, `check()`, `scan_copy()` and `crossover()` in scope. Any figure it
touches must resolve to a confirmed `figures.json` record or the build stops.

## Adding a series

A folder in `motion/`, a `CLAUDE.md` in it, a row in the table in `motion/CLAUDE.md`. Nothing else —
the style, the rails and the gate are already there and apply automatically. A series that can't
state a number yet (the partner programme, while the incentive model is unsigned) is still worth
scaffolding; it just ships without figures until the block lifts.

## Open tooling questions — awaiting Faisal

**Renderer.** The series brief specifies a bespoke Playwright `setFrame(n)` + ffmpeg pipeline and names
`anim.py` and `edit.py` as existing code to reuse. Neither is in this repo — `/CLAUDE.md` already
records that `anim.py` and `neropay-edit-pipeline.zip` were never attached. Meanwhile `video/` is a
HyperFrames workspace that already does HTML → frames → ffmpeg, is installed by the session-start
hook, and has `video/b1-rate-you-were-quoted/` as a working reference. Either bring `anim.py` and
`edit.py` across, or build on HyperFrames and keep the brief's discipline — `figures.json`, the timing
law, the stage-3 gate — on top of it. Faisal's call, not one to make in passing.

**ElevenLabs.** The MCP isn't connected in the session that set this up, so no VO and no word
timestamps there. Since the pipeline is audio-first, an episode can be written, verified and laid out,
but not rendered to a real timeline until that's available.

**The site page.** These videos get their own page in the content warehouse, the same way
`youtube.html` carries the presenter series. Not built yet. It will need a nav link adding to the six
existing pages, and it is dark-first against a light site, so it paints its own ground.

## `showcase/` — the HyperFrames route, worked through once

Faisal's 15 Sep 2026 capability test: a ~25 s liquid-glass piece on the ep01 figures, built as a HyperFrames
project (`motion/showcase/`), with the library's Pixabay effects and the CC0 bed on an 82 bpm grid. It settles
the renderer question for anything with sound: **HyperFrames** (`motion/node_modules/.bin/hyperframes`, pinned
0.8.31), with `law.mjs` asserting the hold law against the composition's `lawReport()` before render. Music can
only be fetched from the Higgsfield sandbox, so `showcase/sandbox.sh` is the delivery route — the web container
builds, checks and renders a silent-bed draft. `render.mjs` stays for the frame-by-frame route with no sound.

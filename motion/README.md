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

**ElevenLabs — settled 15 Sep 2026.** The ElevenLabs connector is on Faisal's Claude account (work admin),
so no API key is needed for a session that has it. Three things it taught us:

- `creative_generate_speech` makes the take (one generation, `generations_count: 1` — the default is
  four takes and four charges). The series voice is Verity, `oW8bn5YtBB89X2nJ0DT9` (`MOTION.voice` in `motion.js`),
  chosen by Faisal on 15 September 2026 from five samples; `jP5jSWhfXz3nfQENMtf4` is retired.
- **Scribe through the connector returns text only, no word timings.** Word timings come from
  faster-whisper `small.en` in the Higgsfield sandbox (the web container cannot download the model,
  403 through the proxy) — the same route as B1's `words.json`. `motion/maths/ep01/data/vo_words.json`
  is the shape: `[{w, s, e}]`, seconds from the start of the take.
- The workspace can also run **music** (`eleven_music_v2`, instrumental, 3–600 s) and **sound
  effects**, which is a second route for a bed when Freesound is out of reach. Anything generated
  still needs a ledger line and a commercial-use check before it ships.

Captions burned with libass need a **TTF**: it cannot read the vendored woff2, so
`motion/assets/fonts-ttf/` carries `Chivo-ExtraBold.ttf` built from it (fontTools). Its internal family
name is `Chivo Medium ExtraBold` — that is the `Fontname` the `.ass` style must use.

**The site page.** These videos get their own page in the content warehouse, the same way
`youtube.html` carries the presenter series. Not built yet. It will need a nav link adding to the six
existing pages, and it is dark-first against a light site, so it paints its own ground.

## The tools, as of MG02 (15 Sep 2026)

All shared, all run from the repo root, all take `<series>/<episode>`:

| Tool | Does | Notes |
|---|---|---|
| `python3 motion/verify.py print/mg02` | stage 3 — figures audit + the episode's `checks.py` | hard gate, run first |
| `node motion/peek.mjs print/mg02 9x16 1.2 8.4 …` | the law report and stills at chosen times, tiled into `out/peek/sheet-<ratio>.jpg` | look before a render; run for 9x16, 16x9 and 1x1 — the crops fail differently |
| `node motion/render.mjs print/mg02 [--ratio 9x16] [--draft]` | law check, frame scan, then every frame of every crop → `out/<ep>-<ratio>.mp4` (silent) | ~6 min for four crops |
| `node motion/mix.mjs print/mg02` | `data/mix.json` cues + `data/vo.mp3` + the `bed` (ducked under the voice, faded out) → `out/mix.m4a`, two-pass loudnorm to −14 LUFS with a true-peak limiter | SFX from `video/library/sfx/`, beds from `video/library/bgm/` |
| `python3 motion/captions.py print/mg02` | `data/captions.json` clauses aligned to `data/vo_words.json` → three `.ass` files | Chivo TTF, box captions; a short word Whisper swallowed is skipped, not chased |
| `motion/lib/objects3d.js` | the 3D objects: `view()`, `terminal()`, `tiles()`, `envelope()` — three.js vendored in `motion/assets/vendor/` | import from the composition; `lib/test3d.html` is the smoke test |
| `motion/<series>/<ep>/finish.sh` | burn captions (not 16:9), mux the mix, contact sheet, loudness, spike scan, md5 | per episode; copy and change `EP=` |

**Module compositions** (anything importing `objects3d.js`) need `--allow-file-access-from-files`, which `render.mjs` and `peek.mjs` pass, and they set `window.READY` when built; both renderers wait for it. The frame scan no longer requires a `#footer` — v3 compositions have none.

**Board compositions and the frame scan.** A board (one `#board` under a virtual camera) has content off
the frame by design, so `render.mjs` scans only the station the camera has landed on: the composition
sets `data-active` on that station's element while the camera is still, and nothing on the board while
it moves. A ruler that runs off the edge on purpose is marked `data-noscan`. Anything hidden by a
masked or faded ancestor is not scanned either. `motion/print/mg02/index.html` is the reference: four
stations in a 2×2 and a pull-back, the camera schedule in `CAM`, the perspective tilt on `#tilt`, a 3D canvas per station.

## `showcase/` — the HyperFrames route, worked through once

Faisal's 15 Sep 2026 capability test: a ~25 s liquid-glass piece on the ep01 figures, built as a HyperFrames
project (`motion/showcase/`), with the library's Pixabay effects and the CC0 bed on an 82 bpm grid. It settles
the renderer question for anything with sound: **HyperFrames** (`motion/node_modules/.bin/hyperframes`, pinned
0.8.31), with `law.mjs` asserting the hold law against the composition's `lawReport()` before render. Music can
only be fetched from the Higgsfield sandbox, so `showcase/sandbox.sh` is the delivery route — the web container
builds, checks and renders a silent-bed draft. `render.mjs` stays for the frame-by-frame route with no sound.

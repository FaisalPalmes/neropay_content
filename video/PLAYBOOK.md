# NeroPay video playbook — read this with LESSONS.md before any edit

> **Overlays, camera angles and overlay timing: `../MOTION-SYSTEM.md` is the current spec and
> outranks anything here that disagrees with it.** Three angles per video, seven overlay
> archetypes, a BUILD → HOLD → EXIT law with the hold asserted in code, and real alpha instead
> of the retired build-on-black-and-Screen-blend route. One open conflict: its §9 wants the AI
> disclosure on screen and persistent, which contradicts §2 below. Raise it, don't pick a side.

Written 10 Sep 2026, at the end of the B1 English video (master, vertical cut, Meta ad).
`LESSONS.md` is the fault log: what broke and the rule that stops it. **This file is the brief**:
what Faisal wants, how the pipeline runs, and what "finished" means. Read both. Root `CLAUDE.md`
still outranks everything here on copy rails.

---

## 1. Who this is for and what good looks like

Faisal runs marketing and operations at NeroPay and is the only reviewer. They (Faisal uses no
stated pronouns — use they/them) review by watching the render, not by reading code, and give notes
in plain language. Every note so far has had one physical cause, and the same causes repeat.

**The register of a finished NeroPay video:** calm, sharp, still. Nothing moves that isn't
carrying meaning. It should look like a product company explaining something, not like a
motion-graphics reel. If a graphic exists only because it looks nice, cut it.

### Faisal's words → what they actually mean

Keep this table. It has saved three review rounds already.

| What Faisal says | What is physically wrong |
|---|---|
| "flicker", "stutter" | a blur and a transform on the same element, or a fade revealing an element that was already visible |
| "sticker", "it doesn't look like glass" | the blur is sampled inside the panel box, so the edge behind stays crisp |
| "hard solid line" | a fade-out ending on the tint layer after the blur has already gone |
| "the yellow flashes" | a colour tween on the wordmark — "Pay" is `#F5C518` from frame one, never tweened |
| "the cards jump / teleport" | opacity or a filter on a `preserve-3d` element flattens it for that frame |
| "too much going on" | a second box drawn inside the glass, or a panel where big type would do |
| "it drags" | dead air between her words, or an outro longer than four beats |

### The taste rules, distilled

1. **Nothing appears before she says it.** Every reveal, count-up and camera move is timed to a
   word from the Whisper transcript (`findWord`), never to a round number.
2. **Stillness is the default.** Panels enter, hold *dead still*, and leave. No idle bob, no drift,
   no looping shimmer. Captions hard-cut; the only motion in a caption is the spoken word turning yellow.
3. **Figures yellow, labels white.** The number she is saying is the only thing competing for the eye,
   and it counts up as she says it.
4. **Panels carry data; type carries emphasis.** A phrase she says is big type on the footage with a
   soft shadow. Don't put a sentence in a box.
5. **One slab.** The glass is a blurred copy of the footage, an even tint, a thin edge highlight.
   Nothing drawn inset from the edge, no rings, no inner rectangles.
6. **Cards have a body.** Real 3D space, layered edges, no blur on the card itself.
7. **The end is short.** A minimal outro, generic labels only, no product-name soup, no follow-us.
8. **Every educational piece concedes.** The end card carries a line telling the viewer when to stay
   where they are ("Check your statement first. If it matches your quote, stay where you are.").
   This is rail 8 and it is also what makes the rest believable.
9. **Sound is from the library, never synthesised.** Beds and effects are real files with a ledger line.
   A music bed ends on purpose, on a beat that means something — not by fading out anywhere.

---

## 2. Rails that apply to every frame

Root `CLAUDE.md` has the full list; these are the ones that have actually bitten in video:

- **No terminal price, no transaction rate on screen or in the voice track.** The 0.70% takes are
  cut from the ad for this reason. The internal figures conflict and it is an open question for Eray.
- **No earnings claims, no guaranteed savings, no lending / NeroFinance / credit language.**
- **No real data.** Illustrative examples only, and labelled as illustrative on the frame.
- **No AI wording inside the video.** Faisal's decision, 9 Sep 2026: the presenter's plate reads
  "Ava / NeroPay", and disclosure happens at upload — YouTube's "altered or synthetic content"
  setting plus a line in the description, and the equivalent tick in Meta Ads Manager for a paid cut.
  Raise it once per new series, then follow the decision.
- **Brand:** "Nero" white, "Pay" `#F5C518`. Yellow only as an accent on charcoal. Poppins, tight
  letter-spacing. Deep depth of field, no bokeh, no props, the terminal is the only branded object.
- **Secrets:** the Freesound token lives in the git-ignored `video/library/.env` or an env var.
  Never committed, never echoed into a log or a transcript.

---

## 3. The three delivery formats

One build produces the master and the vertical; the ad is a sibling project on the same assets.

| Cut | Frame | Where | How |
|---|---|---|---|
| Master | 1920×1080 | YouTube | `node build.mjs` (default) |
| Vertical | 1080×1920 | Reels, TikTok | `ORIENT=vertical node build.mjs` |
| Meta ad | 1080×1350 (4:5) | Facebook / Instagram feed | `video/b1-ad-4x5/build.mjs`, shares the 4:5 proxies |

**Rules that come with them:**

- The landscape output must stay byte-identical when the vertical branch changes — diff `index.html`
  before and after. Every position is a `V ? vertical : landscape` pair; timings, cues, sounds and
  captions are shared, never forked.
- Vertical crops a 4:5 window on Ava (she sits at 51% across this set) **from the 4K source**, then
  sits that footage on the floor of the 9:16 frame with a blurred, darkened copy of the same clip
  filling the band above and a soft gradient on the seam. Panels live in that band: start below
  y=180 (the TikTok header), end above her hair (~950). Captions at bottom 400, max-width 900.
- 4:5 has no room to pan sideways: every focus point is centred on x, and panels live in the top
  380 px. The camera can only translate ±(S−1)·540 on a 1080-wide frame.
- An ad is a **trim of the argument, not a shortened video**: hook in the first second, seven takes,
  nothing that names a rate, no outro. A take can be audio-only — drop the `<video>`, keep the
  `<audio>`, fade a full-frame stage in over the last footage frame and build a diagram on her words.
  Anything fixed on screen (brand mark, captions) must live **outside `#world`** or the camera pushes
  it off canvas.
- Everything must work muted: captions run throughout on every cut.

---

## 4. The pipeline — this is the only way that works

The web container cannot reach the Higgsfield CDN, its ffmpeg lacks blur and setpts, and the real
clips are not here. So:

**Here (authoring):** placeholder clips, build, `npx hyperframes check`, snapshot. Layout, timing and
runtime errors are all catchable locally. Contrast findings on grey placeholders are not real.

**Higgsfield sandbox (truth):** `sandbox.sh` rebuilds a clean box end to end — clone the repo, pull the
4K clips from the CDN using `data/sources.json`, transcode proxies, fetch sounds, `cut.mjs`, build,
check, render, loudnorm to −14 LUFS, ffprobe.

```bash
bash sandbox.sh                                     # 16:9 master
ORIENT=vertical bash sandbox.sh                     # 9:16 Reels / TikTok
ORIENT=vertical AD=1 bash sandbox.sh                # 4:5 Meta ad (shares the 4:5 proxies)
QUALITY=draft bash sandbox.sh                       # review pass
```

Sandbox facts that cost a day each to learn:

- Run it through `sandbox_exec` with `background:true`. A foreground call discards the sandbox about
  ten seconds after it returns; a background call holds a 15-minute lease, renewed by another
  background call (a backgrounded `sleep 840`) before it lapses. `nohup` does not hold it.
- The call times out at 60 s and stdout truncates around 20 K characters, so poll a log file rather
  than waiting, and bring stills back as ≤14.5 K base64 chunks reassembled from the session log.
- 4K clips crash the Chrome capture — always render from proxies.
- Never keep state only in the sandbox. Everything needed to rebuild is in the repo.
- Don't use a `sleep` in a foreground Bash call here either — the tool's sleep guard blocks it. Poll.

**Delivery:** `media_upload` presigned PUT → `media_confirm` → send Faisal the CloudFront link. The
Drive connector cannot carry files over a few MB. `out/` and `renders/` are git-ignored.

---

## 5. How the build is put together

`video/b1-rate-you-were-quoted/build.mjs` is the reference. Copy its patterns rather than inventing.

- **Data in, HTML out.** `data/words.json` (Whisper timings) + `data/edit.json` (trims, `endAtWord`) +
  `data/sources.json` (clip → CDN) + the clips on disk. `cut.mjs` shrinks gaps over 0.6 s to 0.38 s,
  trims heads and tails, remaps every word timing, and writes the blurred copies. Cut a line in
  `edit.json`, never by hand — every later cue moves with the timeline because cues come from words.
- **Fake glass, no `backdrop-filter` anywhere.** `cut.mjs` writes `assets/cut/<id>.blur.mp4`
  (`scale=480:-2,gblur=sigma=11`); `bgFor(id,start,end,x,y)` drops a timed blurred `<video class="bgv">`
  at `left:-x;top:-y` inside `.glass{overflow:hidden}`, so the blur edge *is* the panel edge under any
  transform. On the dark ad stage use `glass({solid:true})` — a charcoal slab with no footage behind it.
- **One camera.** A single `#world` wrapper: `screen = S·offset + T`, translation clamped to
  `(S−1)·W/2` and `(S−1)·H/2`. Helpers: `focus(S,px,py)`, `pf()` (panel-aware, keeps a panel above the
  caption zone), `flat()`, `chain(id, pts)` (clamped to the clip, never runs backwards), `hold`, `bump`.
- **HyperFrames contract:** one paused GSAP timeline on `window.__timelines[id]`; `data-start` /
  `data-duration` / `data-media-start` / `data-track-index` / `data-volume`; seek-safe `fromTo` with
  `immediateRender:false`; every exit fade needs a matching `tl.set` hard kill on the identical
  selector at the rounded end time; a timed `<video>` may not sit inside a timed element, so panel
  wrappers are untimed `.panel` divs; every cued element carries `.cue` (hidden in CSS) or it shows
  from frame one.
- **Sounds** are catalogued in `video/library/sounds.json` by role (whoosh, swish, pop, tick, chime,
  riser, impact, bounce, music) with a licence line in `library/LEDGER.md`; CC0 only unless told
  otherwise. `fetch-sounds.mjs --into assets/sfx` pulls them in the sandbox. Every `<audio>` gets its
  own track index and a `data-duration`.
- **No CDN scripts or webfonts** — the container blocks them and the render comes out black. GSAP is
  vendored at `video/vendor/gsap.min.js`; fonts from `@fontsource/*` or a local `.woff2`.

---

## 6. The review loop

1. Build locally, `npx hyperframes check --json`, fix every runtime and layout error. Zero is the bar.
2. Snapshot a sheet of stills at the interesting moments (`hyperframes snapshot --at`) and *look at it*
   — panel over text at rest, mid-entrance and mid-exit; text behind must be unreadable in all three.
3. Render draft in the sandbox on the real clips, montage it, read the contrast report — findings on
   real footage are real. Warm footage (Ava's set: wood, lamps) needs the blur layer at `brightness(.52)`.
4. Only then render `-q high`, loudnorm to −14 LUFS / 48 kHz, upload.
5. After every review from Faisal, add the fault and its rule to `LESSONS.md`, newest at the top.

**Known standing warning:** one WCAG contrast note on the yellow "Pay" against the white end card
(1.59:1). It is on all three cuts, it is the brand lockup, and it is accepted — not a defect to fix.

### The delivery message Faisal expects

Link, then frame sheet, then the beat list with timings and *why each beat is there*, then the rails
note (what was kept off screen), then any warning, then the commit. Plain sentences, no bullets full
of adjectives. Mention the upload disclosure every time a cut is being published somewhere new.

---

## 7. Git

Develop on the session branch, and push the same commit to `main` as well — Faisal's convention;
Vercel redeploys `main` automatically. Commit messages short, plain, present tense. No model or tool
identifiers in commits, PR bodies or code comments.

---

## 8. B1 ledger (the reference build, finished 10 Sep 2026)

| Cut | Spec | Commit |
|---|---|---|
| Master 16:9 | 1920×1080, ~2:43, −14 LUFS | `2b913b3` (v6) |
| Vertical 9:16 | 1080×1920, 162.667 s, 175 MB | `1c682e5` |
| Meta ad 4:5 | 1080×1350, 50.816 s, 46.8 MB | `5054f42` |

## 9. B1 v7 — the MOTION-SYSTEM.md build (11 Sep 2026)

`video/b1-v7/` is the B1 master rebuilt on `../MOTION-SYSTEM.md`, and the reference for every build that
follows the spec. `b1-rate-you-were-quoted/` (v6) stays as the reference for the glass look, the vertical
cut and the Meta ad, which still read its assets.

What is different, in one paragraph: three camera angles cut from the 4K takes (`data/angles.json`,
`sandbox.sh`), the seven overlay archetypes and nothing else (B label, C card fan, D spec table, E floating
document, F arrow relation, G status pills), the BUILD → HOLD → EXIT law asserted in `build.mjs` (`law()`),
flat translucent panels with real alpha instead of glass sampled from the footage, a title that grows from
the centre of the frame on "NeroPay", and effects 2.5 dB under v6. Same words, same cuts (`cut.mjs`), same
captions, same outro shape.

Run it the same way — `sandbox.sh` through `sandbox_exec` with `background:true`, `FREESOUND_TOKEN` in the
environment, `QUALITY=draft` for the review pass — and it leaves `review/overlays-contact.png` (every
overlay's last held frame at full size, §7) and `review/frames-contact.jpg` (a frame every six seconds)
beside the render.

**One interpretation to confirm with Faisal.** The spec's hold formula assumes a graphic that appears whole.
For a table or a statement that prints row by row as she reads it, the build checks the whole graphic
against its total time on screen and the last row against the time left after it (LESSONS #45). If Faisal
wants the literal reading — every graphic fully formed, then max(1.5 s, words × 0.4) of stillness — the
statement and the two long tables have to be split into smaller graphics on more shots.

**Angles, honestly.** SIDE and CLOSE here are windows on the one FRONT take, not a second camera: the wall
does not recede in perspective the way the reference frames show. Real SIDE and CLOSE takes need
`00 start frames/` and a generation run with the credit gate (MOTION-SYSTEM.md §1, §7).

| Cut | Spec | Commit |
|---|---|---|
| Master 16:9 v7 | 1920×1080, 164.467 s, −14 LUFS, 213 MB, check clean on the real footage | `65cf0ca` |

Ad structure, as an example of trimming an explainer to an ad: hook on footage (0–7 s) → one rate
covers one card type (7–12 s) → "their card. your rate." (12–16 s) → **audio-only, formula diagram**
(16–24 s) → **audio-only, result counting to an illustrative 1.09%** (24–32 s) → quoted vs paying,
"more than double" (32–38 s) → "2 min" statement check (38–43 s) → end card with the concession
(43–51 s). The music bed runs out at 38 s on purpose; the last two beats are bare voice.

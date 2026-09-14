# The Maths — motion graphics series

The spec for everything in `maths/`. The repo rails in `/CLAUDE.md` apply unchanged on top of this.


Added 14 September 2026 from `MOTION-SERIES-BRIEF v1.0` (Faisal). This is the standing spec for the
faceless motion-graphics series. It is a **different series** from the presenter-led Explained videos
(`generation-pack.md`, B1–B6) and Behind the Counter (`calls.js`) — don't mix the styles and don't
reuse presenter assets here.

**Premise.** Each episode takes one number out of a merchant's life and works it out on screen.
We show our own workings, including the cases where NeroPay is not the best answer. That concession
is the format's whole reason to exist, and it's rail 8 doing the work.

**Spec.** 30–45 seconds · primary 9:16, also exported 16:9 / 4:5 / 1:1 · faceless, no presenter, no
stock people · one number per episode, two ideas means two episodes · "we", never Faisal · no
competitor ever named. Judged on **saves and shares**, never likes or follower count.

**Rendered, not generated.** Graphics are HTML/CSS, screenshotted frame by frame and assembled with
ffmpeg. Not an image or video model. That's what buys exact figures, exact typography, no credit
cost, and a back catalogue that re-renders when a price changes. Higgsfield is secondary — 2–3
second photographic texture beats only, never text, never figures, never the body of a video.

## figures.json is the gate

`figures.json` at repo root is the register of every number the series states. **Nothing goes on
screen unless it has a record there with `status: "confirmed"`.** A record's `internal_source` may
name a provider for traceability; on screen you use `on_screen_label` and never the name. Records go
stale at 90 days.

Records with `status: "blocked"` are the figures we may not state and why. Referencing one fails the
build. Currently blocked: any NeroPay transaction rate, the 8p fixed fee, Flex pricing, the partner
incentive.

`maths/verify.py` is **stage 3 of the pipeline and a hard gate**. It audits `figures.json`, then runs
`maths/<episode>/checks.py`, which must compute every on-screen percentage, fee and crossover and
assert it against the stated value. Fail the build on mismatch. The table prints to stdout so the
working appears in the transcript. A motion graphic stating a wrong rate is a compliance incident,
not a typo.

## Series rails — on top of the ten above, not instead of them

1. **No earnings claims, ever.** The only safe construction is **cost at a stated transaction value**.
   "At a £40 sale, each option charges X" is fine. "Save £X a year" is not. No guaranteed savings.
2. **Never name a competitor.** No brand name, logo, wordmark, recognisable colour, no "the one with
   the white reader", nothing in alt text or a file name that identifies one. Comparisons run against
   an **unnamed, clearly-labelled benchmark** — "a flat rate with no fixed fee", "a typical paid
   restaurant POS tier" — with the benchmark's figure stated and labelled illustrative in the footer.
   This isn't only safer: it removes disparagement and trade-mark risk, kills the screenshot
   substantiation burden, and **stops the video rotting** the day a provider changes price. The
   trade-off is that it's less concrete, and the answer to that is the calculator.
3. **Unconfirmed items never appear on screen**: Flex pricing, the partner incentive figure, the
   0.70%/8p question, the free-POS-tier correction. If an episode needs one, stop and flag it.
4. **Approval gate. Generate to draft, never auto-publish.** Faisal reviews, then it goes out.

Rails 1, 3, 5, 6, 7, 9 and 10 above apply unchanged. Rail 4 (AI presenter disclosure) doesn't bite on
a faceless episode — but if a Higgsfield texture beat is ever used, raise the disclosure question
before it ships rather than assuming it's exempt.

## Style

**Ground.** Near-black charcoal. Dark-first, always. Never a light background — this series is the
one place in the repo that ignores the site's light default.

```
--ground    #0E1013   page ground
--surface   #1A1D22   raised panels, bars
--ink       #FFFFFF   primary type, figures
--muted     #8A9099   labels, footnotes, sources
--accent    #F5C518   NeroPay yellow — accent only
--loss      #6B7280   the "we lose" state, deliberately grey not red
```

The brief proposed `#F2B705` for the accent and said the repo's brand file wins. It does:
**`#F5C518`** is the NeroPay yellow everywhere in this repo (`style.css`, `MOTION-SYSTEM.md`,
`video/LESSONS.md`) and it stays that here.

**Yellow discipline.** One thing per frame — the number under discussion. Never a background, never
a large fill, never two things at once. In the wordmark NERO is white and PAY is yellow, always.

**Type.** Display and headlines **Chivo**, heavy, tight tracking. Anything numeric — figures, rates,
currency — **Martian Mono**, because a monospace face stops digits jittering as they count up.
Long-form or quoted text **Source Serif**. Footnotes and source lines Chivo 11px, `--muted`.
This is the v2 type system, deliberately; the `video/` pieces are still Poppins and stay that way.

**Motion.** Figures count up, they don't fade in. Bars draw from their origin, they don't scale.
Text arrives by mask-up, never blur or bounce. Everything eases out, nothing overshoots. Honour
`prefers-reduced-motion` in the markup even though the render ignores it — the same markup gets
reused on the site.

**Timing law.** `hold_seconds = max(1.5, on_screen_words × 0.4)` — the same law as `MOTION-SYSTEM.md`,
not a second one. Every overlay comes fully to rest and holds at least one second before anything
else moves. The commonest failure in this format is graphics leaving before they can be read.
Assert it in code.

**Persistent source footer.** Every video carries a fixed `--muted` 11px line for its whole duration,
not just at the end: the figures used and the date verified. Each `figures.json` record supplies its
`footer` string.

**Layout.** Container query units (`cqmin`, `cqw`) so one layout holds across 16:9, 9:16, 4:5 and 1:1
without a rewrite. Crops: `{"16x9":(1920,1080), "9x16":(1080,1920), "4x5":(1080,1350), "1x1":(1080,1080)}`.

## Pipeline

Read `CLAUDE.md` + `figures.json` + the episode spec → write VO and on-screen copy against the rails
→ **stage 3 gate** → VO and word timestamps → SFX → build HTML and render frames to the VO's real
timeline → optional texture beat → composite, burn captions, mix, `loudnorm` → export four crops and
a contact sheet → **Faisal reviews** → commit and publish only after approval.

**Audio before graphics.** Generate the VO first and build the timeline against its real durations and
word timestamps. Building to estimated timings and generating audio afterwards means hand-nudging
keyframes, which is the manual work this pipeline exists to remove.

**Voice.** ElevenLabs MCP (`elevenlabs/elevenlabs-mcp`), voice `jP5jSWhfXz3nfQENMtf4`,
`eleven_multilingual_v2`, `mp3_44100_128`, output mode **files**, **always request word-level
timestamps** — they drive both caption timing and overlay in-points. Budget: 50,000 credits/period,
a 40-second VO is ~500–600. No speculative batches, and ask before any run over ~3,000 credits.

**Higgsfield**, if a brief calls for it: `gpt_image_2_5` defaults to `quality: low` and `1k`, so set
`quality: "high"` and `resolution: "2k"` or `"4k"` explicitly. Video is `kling3_0`, 1080p. Workspace
`9fbbb426` — the private workspace has no credits.

**Gotchas already paid for.** CSS `%` breaks Python `%`-formatting — use `@@TOKEN@@` placeholders and
`.replace()`. Backgrounding a render with `&` breaks the `cd` chain and frames land in `$HOME` — use
absolute paths in render scripts, always. Never re-attach a screenshot of a previous render to make
an edit; generation loss stacks, re-render from source. And no CDN scripts — the web container blocks
them, so vendor fonts (`@fontsource/*` or a local `.woff2`) and libraries.

**Alpha.** PNG sequence with alpha, or ProRes 4444 (`yuva444p10le`). The "build on black + Screen
blend" workaround is retired, here as everywhere else in the repo.

## Episode bank

| # | Number | The turn | State |
|---|---|---|---|
| 1 | 3.30% | What you'd pay *us* on a £4 coffee. Don't switch. | **Blocked** — states a NeroPay transaction rate |
| 2 | £0 | Our POS software against what a paid restaurant POS tier costs a year | Needs the free-tier concession on screen |
| 3 | £20.51 | The average sale where a fixed fee stops hurting and starts helping | **Blocked** — the crossover is 8p ÷ (1.69% − 1.30%) |
| 4 | 42% | UK merchants who haven't considered switching in two years | **Clear** — fully sourced, nothing blocked |
| 5 | 8p vs 15p | Why the fixed fee moves more money than the rate | **Blocked** — open question with Eray |

**Destination.** Every episode ends at `neropay.app/maths`, a public break-even calculator that
returns the honest answer including when NeroPay loses. Not built yet — until it exists, end cards
point at `neropay.app`.

## Ask, don't guess

Stop and ask Faisal rather than inventing: any pricing figure without a confirmed `figures.json`
record · anything touching Flex, partner incentives or bespoke rates · whether a claim counts as an
earnings claim (if you're unsure, it does) · restructuring existing repo files · anything over ~3,000
ElevenLabs credits in one run. If a task needs context beyond this file, ask for the doc from the
NeroPay Project rather than guessing at it.

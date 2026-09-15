# Motion graphics — the video style

The spec for everything in `motion/`. The repo rails in `/CLAUDE.md` apply unchanged on top of this.

This is NeroPay's **third video style**, alongside the presenter-led Explained videos
(`generation-pack.md`, B1–B6) and Behind the Counter (`calls.js`). It is not a single series — it is a
way of making videos, and each series inside it has its own folder and its own brief.

Don't mix the styles and don't reuse presenter assets here. Nothing in `motion/` has a presenter.

| Series | Folder | What it is |
|---|---|---|
| The Maths | `motion/maths/` | One number out of a merchant's life, worked out on screen |
| Small Print | `motion/print/` | The law, the deadline and the rule a card machine touches — tips, contracts, surcharges, disputes, HMRC. White editorial, a stamp on the date, and "if this doesn't apply to you, do nothing". Briefed in `motion.js` |
| *(proposed)* Partner programme | `motion/partner/` | The partner programme explained as an animated diagram. **Blocked on figures** — the incentive model isn't signed off, and rail 10 blocks partner commission regardless. A figureless version explaining the mechanics is publishable now |

Adding a series: a folder in `motion/`, a `CLAUDE.md` in it carrying the premise, the spec and the
episode bank, and episodes beneath that. Everything below applies to all of them.

**Rendered, not generated.** Graphics are HTML/CSS, screenshotted frame by frame and assembled with
ffmpeg. Not an image or video model. That's what buys exact figures, exact typography, no credit
cost, and a back catalogue that re-renders when a price changes. Voice is ElevenLabs. Higgsfield is
secondary — 2–3 second photographic texture beats only, never text, never figures, never the body of
a video.

**Faceless.** No presenter, no stock people, no talking head, in any series here.

**Not to be confused with `MOTION-SYSTEM.md`**, which is the overlay and camera spec for the
*presenter* videos. The two share a timing law and nothing else. If you're working in `motion/`,
this file is the spec.

## figures.json is the gate

`figures.json` at repo root is the register of every number a motion graphic states. **Nothing goes
on screen unless it has a record there with `status: "confirmed"`.** A record's `internal_source` may
name a provider for traceability; on screen you use `on_screen_label` and never the name. Records go
stale at 90 days.

Records with `status: "blocked"` are the figures we may not state, and why. Referencing one fails the
build. Currently blocked: any NeroPay transaction rate, the 8p fixed fee, Flex pricing, the partner
incentive.

`motion/verify.py` is **stage 3 of the pipeline and a hard gate**. It audits `figures.json`, then runs
`motion/<series>/<episode>/checks.py`, which must compute every on-screen percentage, fee and
crossover and assert it against the stated value. Fail the build on mismatch. The table prints to
stdout so the working appears in the transcript. A motion graphic stating a wrong rate is a
compliance incident, not a typo.

```
python3 motion/verify.py                    # audit figures.json
python3 motion/verify.py maths/episode-4    # audit, then run that episode's checks
```

## Rails for this style — on top of the ten above, not instead of them

1. **No earnings claims, ever.** The only safe construction is **cost at a stated transaction value**.
   "At a £40 sale, each option charges X" is fine. "Save £X a year" is not. No guaranteed savings.
2. **Never name a competitor.** No brand name, logo, wordmark, recognisable colour, no "the one with
   the white reader", nothing in alt text or a file name that identifies one. Comparisons run against
   an **unnamed, clearly-labelled benchmark** — "a flat rate with no fixed fee", "a typical paid
   restaurant POS tier" — with the benchmark's figure stated and labelled illustrative in the footer.
   This isn't only safer: it removes disparagement and trade-mark risk, kills the screenshot
   substantiation burden, and **stops the video rotting** the day a provider changes price. The
   trade-off is that it's less concrete, and the answer to that is a calculator, not a named rival.
3. **Unconfirmed items never appear on screen**: Flex pricing, the partner incentive figure, the
   0.70%/8p question, the free-POS-tier correction. If a video needs one, stop and flag it.
4. **Concede something.** Every educational video here names a case where the viewer should stay
   where they are. It's rail 8, and in this style it's also the reason anyone watches to the end.
5. **Approval gate. Generate to draft, never auto-publish.** Faisal reviews, then it goes out.

Rails 1, 3, 5, 6, 7, 9 and 10 above apply unchanged. Rail 4 (AI presenter disclosure) doesn't bite on
a faceless video — but if a Higgsfield texture beat is ever used, raise the disclosure question
before it ships rather than assuming it's exempt.

## What v1 got wrong — Faisal, 15 Sep 2026

Episode 1 v1 rendered clean and it read as **AI slop**: a level, dry read; one centred figure on a dark
card; every beat the same shape; nothing a person would stop for. The fault was not the maths, it was
the register. This section replaces it. The rules below are the ruling for every video in `motion/`.

**Two jobs, in this order.** A short-form video is an **attention grab first** and an explainer
second. The first 1.5 seconds carry the hook — spoken, on screen, or both — and the hook is never
"here is a number". It is a claim that costs the viewer something to ignore: *"That sign in your
window has been illegal since 2018."* The maths earns its place after that, or it doesn't appear.

## Style — v2, editorial

**Look.** Apple-editorial, high-end commercial. Calm, sharp, still — but *composed*, not centred.
Type sits where a magazine art director would put it, with air around it. One idea per frame, but
that idea can be a small word and a large one, a number and its qualifier, a serif whisper under a
sans shout. **Tasteful use of the whole frame**: something small in a corner, something large across
the middle, and empty space that is doing work.

**Ground.** Two grounds, chosen per video, never mixed inside one:

- **White editorial** — `#FBFAF7` off-white, ink `#141416`, the yellow as the single accent. The Apple
  register. Default for regulatory and "did you know" videos.
- **Charcoal** — `#0E1013` as before. For the money videos where the number needs to glow.

**Liquid glass, tastefully.** The `video/b1-v8` glass system (a blurred copy of what is behind,
an even tint, one sheen pass on entrance, a thin rim — never `backdrop-filter`) is used for the
*one* element that carries data on a frame: a card, a pill, a receipt. Never for type on its own,
never two glass objects competing, never as decoration. On white it is the frosted-white slab
(`.lglass`); on charcoal the dark slab.

**Type hierarchy is the animation.** Three faces, each with a job:

| Face | Job | How it moves |
|---|---|---|
| **Chivo 800**, tight | The shout — the claim, the big word, the number's label | Masks up hard, lands on the beat |
| **Martian Mono 700** | Every figure, rate, date, deadline | Counts, ticks, or stamps; never fades |
| **Source Serif 4 italic** | The human line — the aside, the concession, the "and honestly…" | Rises softly, half a beat late, smaller |

Colour by phrase, not by rule: the thing the voice is *hitting* is the thing that's yellow. A word
the voice throws away is `--muted` and small. Italic is the voice dropping to an aside. Caps and
size are the voice raising. **The typography should be readable as the narrator's performance with
the sound off.**

**Motion vocabulary.** Figures count up, bars draw, text masks up — unchanged. New: **stamps** (a
date or a deadline lands with a 2-frame overshoot-free scale from 1.06 to 1 and a thud), **strikes**
(a line drawn through a claim as it's retracted — the B1 0.5% strike), **ledger ticks** (rows
appearing on the beat with a dry tick), and **camera travel** (below). Everything eases out; the only
thing that overshoots is nothing.

**The board.** Some videos are shot on **one large board** — a 2D layout three or four frames wide
and tall, every station laid out at once, and a virtual camera that travels between stations as the
video goes on: a push, a pan, a pull-back to reveal the whole board at the end. The board is the
video's map; the viewer feels the space. Rules: the camera moves *only between* beats, never during
a hold; moves are 0.6–0.9 s, eased, and land dead still; each station is composed to be read at its
own zoom; the pull-back at the end shows the whole argument in one frame. Built as one `#board`
element under a clamped transform — the `video/b1-rate-you-were-quoted` virtual camera pattern.
Not every video is a board; a board earns itself when the video has four or more stations that
relate spatially (a calendar, a receipt, a ledger, a route).

**Higgsfield plates.** Allowed now, for images only, under overlays: a photographic **plate** — a
card terminal on a counter, a receipt, a street at night, a till drawer — generated in Higgsfield
(`gpt_image_2_5`, `quality: "high"`, `resolution: "2k"`, 9:16), colour-graded to the ground, sitting
behind the type or the glass card. Rules: no text in the image (we set it), no people, no NeroPay
props (the terminal is the only branded object and must not carry a competitor's mark), sharp and
deep (no bokeh, MOTION-SYSTEM §1), and one plate per beat at most. A plate is a *texture for a
beat*, never the body of the video. Rail 4: an AI image under a caption is synthetic content — the
upload disclosure applies as it does for the presenter series; raise it once per series.

## Narration — the performance

**Model.** `eleven_v3` with inline audio tags, one take per video, the series voice **Verity**
(`oW8bn5YtBB89X2nJ0DT9`), approved by Faisal on 15 September 2026. `eleven_multilingual_v2` produced the level v1 read and is retired for this style. Tags
are sparse and specific; the script is punctuated for delivery.

**How the voice was chosen, 15 September 2026.** Faisal rejected `jP5jSWhfXz3nfQENMtf4` ("podcast-like
and chill"). Five British female candidates were sampled on the same tagged line (MG02 hook,
`eleven_v3`, one take each, on flow `ns3m8FupNDBjPPLIO8eV`) and Faisal picked **Verity**. The other
four stay listed so nobody re-samples them. The voice is `MOTION.voice` in `motion.js`.

| Candidate | `voice_id` | Library description |
|---|---|---|
| Amelia | `ZF6FPAbjXT4488VcRRnw` | young and enthusiastic |
| **Verity — chosen** | `oW8bn5YtBB89X2nJ0DT9` | chatty, fast-paced storyteller (adverts, UGC) |
| Lucy | `Gv42yFG3G6CHLsU5y8g6` | upbeat, commercials |
| Valory B | `kIYbb5iUo0dJb8oRw5Mt` | conversational girl-next-door, UK brands |
| Rachel | `c3QefzBhE1Cx4Yl23IV3` | natural British female, YouTube and corporate narration |

Changing the voice later means changing it here, under Pipeline, in `motion/README.md` and in
`MOTION.voice`, then re-voicing every episode — one voice across every series.

**Register.** Real, human, awake. High energy is not shouting — it is *investment*: the narrator
finds this genuinely interesting and wants you to get it. The tone changes on the phrase: a claim
lands flat and sure; a number is said like it matters; the concession drops to an aside and a
smile; the close is direct. Never sales-voice, never radio-voice, never the dry v1 read.

**Every video carries a `narrator` block** in `motion.js` with three parts: the *energy curve* (one
line per beat — where it lifts, where it drops), the *tags* used and why, and *the one word* in
each beat that gets the hit. Every `say` line in the shot list is written with its tags in place, so
the take can be generated from the warehouse without a second interpretation.

**Tag vocabulary** (keep to these): `[excited]` `[curious]` `[serious]` `[deadpan]` `[whispers]`
`[sighs]` `[laughs softly]` `[warmly]` `[urgent]`. Emphasis by CAPITALS on at most one word per line.
Pauses by an ellipsis `…` (thoughtful) or an em dash `—` (a beat). No tag on more than one line in
three; the words do most of it.

**Word timings** still drive every in-point. Scribe through the connector returns text only, so the
take goes through faster-whisper in the Higgsfield sandbox (`motion/README.md`), and the composition
takes the `[{w,s,e}]` array in directly, as `maths/ep01` does.

## Pipeline

Read `/CLAUDE.md` + this file + the series brief + `figures.json` → write VO and on-screen copy against
the rails → **stage 3 gate** → VO and word timestamps → SFX → build HTML and render frames to the VO's
real timeline → optional texture beat → composite, burn captions, mix, `loudnorm` → export the crops
and a contact sheet → **Faisal reviews** → commit and publish only after approval.

**Audio before graphics.** Generate the VO first and build the timeline against its real durations and
word timestamps. Building to estimated timings and generating audio afterwards means hand-nudging
keyframes, which is the manual work this pipeline exists to remove.

**Voice.** The ElevenLabs connector on Faisal's account (`creative_generate_speech`,
`generations_count: 1`), voice Verity `oW8bn5YtBB89X2nJ0DT9`, **`eleven_v3`** with the narration spec above.
One fixed voice across every series. A 40-second take is ~500–600 credits. No speculative batches,
and ask before any run over ~3,000 credits. Word timings via the sandbox — see Narration.

**Higgsfield** for plates (see Style): `gpt_image_2_5` defaults to `quality: low` and `1k`, so set
`quality: "high"` and `resolution: "2k"` explicitly. Workspace `9fbbb426` — the private workspace has
no credits. No video generation in this style.

**Gotchas already paid for.** CSS `%` breaks Python `%`-formatting — use `@@TOKEN@@` placeholders and
`.replace()`. Backgrounding a render with `&` breaks the `cd` chain and frames land in `$HOME` — use
absolute paths in render scripts, always. Never re-attach a screenshot of a previous render to make
an edit; generation loss stacks, re-render from source. And no CDN scripts — the web container blocks
them, so vendor fonts (`@fontsource/*` or a local `.woff2`) and libraries.

**Alpha.** PNG sequence with alpha, or ProRes 4444 (`yuva444p10le`). The "build on black + Screen
blend" workaround is retired, here as everywhere else in the repo.

## Where the briefs live

Every video in this style is briefed in **`motion.js`** at repo root and rendered on `motion.html` — hook,
need, source, format, board plan, plate, the narrator block and the beats with their `say` lines. A
video is built from that brief; the brief is the spec the take is generated from.

## Ask, don't guess

Stop and ask Faisal rather than inventing: any pricing figure without a confirmed `figures.json`
record · anything touching Flex, partner incentives or bespoke rates · whether a claim counts as an
earnings claim (if you're unsure, it does) · restructuring existing repo files · anything over ~3,000
ElevenLabs credits in one run. If a task needs context beyond these files, ask for the doc from the
NeroPay Project rather than guessing at it.

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
| Partner Programme | `motion/partner/` | The partner programme — what a partner earns and the condition, said condition-first, in the white world. Briefed by Faisal in `motion/partner/BRIEF.md` (v4 final, 17 Sep 2026); the figures are confirmed records in `figures.json`. `motion/partner/pp01/` is the first video |
| NeroConnect | `motion/neroconnect/` | The white-label platform, for business-minded viewers — the network model that already exists, run under someone else's name. Briefed in `motion/neroconnect/CLAUDE.md`; NC01 is the intro, proposal 17 Sep 2026 |

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

**Read alongside this file:** `/STACK.md` (what a session has to work with — connectors, credentials,
what the network reaches, the seventeen committed HyperFrames skills) and `video/AUDIO.md` (the sound
note: the committed effects, the ledger rule, the mix and beat grid, the voiceover route). Both were
written on `main` on 15 Sep 2026. Two of their rules bind every episode here: **nothing ships silent**,
and **every sound and every generated voice has a row in `video/library/LEDGER.md`** before delivery.

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
"here is a number". **v4 ruling, 16 Sep 2026:** the on-screen hook is a *question the owner has to
think about*, typed in under the narrator's first line — *When does your card machine contract actually
end?* — not a slogan and not a dare. The spoken line under it is plain: who this is for and that there's
something worth knowing. No "Quick one", no "Did they?", nothing that exists to sound clever.

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

**Type hierarchy is the animation.** Three faces, each with a job. **Poppins is the family** (Faisal, 16 Sep
2026 — it is the brand face in `/CLAUDE.md` too); the other two are the editorial voices beside it:

| Face | Job | How it moves |
|---|---|---|
| **Poppins 700**, tight | The shout — the heading, the big word, the pills, the letter's rows | Masks up hard, lands on the beat |
| **Martian Mono 700 / 400** | Every figure, date and deadline; the small uppercase kickers | Counts, ticks, or stamps; never fades |
| **Source Serif 4 italic** | The human line — the opening question, the aside, the concession | Rises softly, half a beat late |

Chivo 800 survives only inside the terminal's screen texture (the wordmark). Captions are drawn by the composition
in Poppins 700 (v6); the `.ass` files and `Poppins-Bold.ttf` remain for anything that still burns.

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

**Real 3D objects — v3, 16 Sep 2026.** The board carries objects, not only type: a card terminal, a run of
month tiles, an envelope, a day grid. They are built from primitives in `motion/lib/objects3d.js` (three.js,
vendored at `motion/assets/vendor/`) and drawn into a `<canvas>` that sits on the board like any other element —
orthographic three-quarter view, matte materials, one soft contact shadow on a transparent ground, so the object
reads as sitting on the paper. Nothing is generated, so it re-renders deterministically and carries no synthetic-
content disclosure. Rules: one object per station, doing the job the type can't (the thing itself, the count, the
letter arriving); objects move on the beat and settle without overshoot like everything else; a DOM element that
has to meet a 3D edge (a label on a tile, a letter rising out of an envelope) is placed from `view.project()`,
never eyeballed. The terminal is the only branded object and its screen carries the wordmark.

**What v3 removed.** No episode number on screen — each video has to stand on its own when someone meets it
cold, so the masthead is the mark and the series name, nothing else. No persistent footer: the source and the
scope go on the station where the rule is stated (a mono kicker: "Payment Systems Regulator · PS22/2", "14
largest providers · July 2023") and leave with it. Masks carry room for descenders (`.mask` padding) — the v2
"cropped text" Faisal saw was descenders clipped by a `line-height: .92` mask.

**Two machines, never a name — v4.** `neroTerminal()` is our product, modelled on the product photos (white
slab, full-height display with the till UI, a small camera, a white dock; the wordmark on the dock and on the
screen's status line and nowhere louder). `oldTerminal()` is the generic older machine — grey, chunky, a small
monochrome LCD, rubber keys, a paper slot — for "the one you're tied to" and for any side-by-side. No maker's mark
on either, and the maker of our hardware is never named in any file, on screen or in a take. The old one appears
when the script is about being stuck; ours when it is about switching or getting a quote.

**Nothing enters from above — v4.1, 16 Sep 2026.** A 3D canvas is a rectangle on the board, and an object
dropping in from above it is clipped by its top edge; a long shadow is clipped by its bottom. Faisal saw both as
"an invisible cut-off line". So: objects are already on the board when the camera arrives; an entrance that has
to be seen comes *up out of the paper* (`rise()` — the shadow ground hides what is below it) and an exit sinks
into it (`sink()`); tiles rise the same way; pillars grow from the ground; the light is steep enough that shadows
stay by the object. Every view carries headroom above the tallest thing in it, including an opened flap.

**No pauses, no bare screen — v4.1.** The take is tightened before anything is built: `motion/tighten.mjs`
cuts the middle of every silence longer than half a second down to a third of a second and shifts the word
timings, so the read runs straight on without sounding rushed (MG02: 58.7 s → 53.6 s). Camera moves are half a
second and start just after the last word. The heading and stamp of a station are up when the camera lands,
the first word of the opening question is on beat 1, and no frame is ever type-only for long — a station always
has its object on it.

**Stations are drawn only while the camera is on them (v4 board; v5 keeps the rule for type, see below).** The board hides every station except the current one
and the one being left (which fades over the move), so a neighbour never peeks into the wide crop and the frame
scan sees what the viewer sees. A **highlighter** stroke (`.hl`, a marker drawn behind the word the voice is
hitting) joins the motion vocabulary; the masthead is gone altogether.

**One world, and the camera travels — v5, 16 Sep 2026.** Faisal's direction after v4.1: keep the script, change
the picture — "that 3D environment vibe, where the camera looks like it's travelling from one section to another".
So the board is gone. An episode is one three.js scene (`motion/lib/world3d.js`): a paper floor, a mat under each
section, the objects standing on the mats, and the type standing in the scene with them — DOM signs placed by the
CSS3D renderer under a transparent WebGL layer, so the type stays crisp Poppins and the highlighter, masks and pills
all still work. One perspective camera (28° vertical). The rules that come with it:

- **Sections sit along a route**, each 60 units to the right of the last with the view turning 29° — an arc drawn
  on the floor as a pencil line between the mats. At rest a neighbour is *beside* the frame, never ahead of it,
  because a 9:16 frame at 18° elevation sees a long way ahead and anything up the route would be in shot.
- **Each section declares its box** (x across, y up from the floor, z depth) and the camera is fitted to it
  numerically per crop — the nearest position on the section's view ray that keeps all eight corners in frame
  with the margin. Elevation, depth and perspective are all in that search; the old bw/bh fit clipped 16:9.
- **A flight is a journey, not a slide.** Between sections the target slides across, the camera climbs and pulls
  back to a wide view that holds both sections (`flight()`, `wideR` = the distance that frames them), then settles.
  0.8 s, eased in-out, starting just after the last word; the next heading rises mid-flight so it is up on landing.
  In the air every section's type is on screen — that wide view is the map of the world; at rest only the current
  section's type is (a neighbour's heading seen edge-on at the bottom of a 9:16 frame is clutter).
- **The floor is solid to the depth buffer and invisible to the eye.** A transparent ground hides nothing in
  perspective — the tiles parked at −40 showed through the paper. `world3d.js` draws a colour-less occluder at
  floor level, so `rise()` and `sink()` still mean what they say and everything below the paper is gone.
- **Nothing on the floor may paint over type.** The WebGL layer sits *over* the CSS one, so mats and the route are
  DOM planes in the CSS layer, not meshes; the WebGL layer carries only objects and their shadows. Signs stand
  behind the objects of their section, and anything low (a pill on the floor, a kicker) sits beside the objects,
  never behind them on screen.
- **The letter is a texture**, drawn to a canvas (Poppins and mono, the glass look baked in) on a plane inside the
  envelope, so the envelope's front really hides it and the flap swings *back*, away from the camera.
- **Settle before you shoot.** The compositor re-rasters a 3D-transformed sign a frame after its transform changes;
  a screenshot taken straight after `setFrame` can carry the blurry raster from mid-flight. `render.mjs` and
  `peek.mjs` wait two animation frames per frame. Spans inside masks carry no `will-change`.
- The frame scan marks every sign of the current section `data-active` (several elements now, not one).
- Cost: a full-frame 3D render is about 0.8 s a frame on this box, and two-thirds of that is Playwright's PNG
  encode, not WebGL (shadows and MSAA barely register; PCF replaces PCFSoft anyway). `render.mjs --jpeg` writes
  the frames as JPEG q97 and halves the time — use it for review cuts. Crops run *sequentially*: four processes
  on four cores thrash SwiftShader and finish later than one after another. Peek first, always.

**v6, 16 Sep 2026 — captions in the picture, glass, a room, the terminal as it is.** Faisal's notes on v5:

- **Captions are drawn by the composition, not burned.** No black box, no fixed strap. A stage-level layer
  (`#caps`, appended *after* the world's two layers so nothing paints over it) shows one caption line at a time
  from `data/caps.js` (the lines of `captions.json` aligned to word indices), grey Poppins 700, the word being
  spoken in ink on a yellow marker, spoken words a shade darker after. A line that carries the section's figure or
  action is *big* (`BIG` regex) and sits a little higher. Lines rise in over 0.24 s and fade out in 0.12 s. The
  16:9 master renders without them (`?caps=0` on the page URL; `render.mjs` and `peek.mjs` add it), so YouTube
  stays clean and nothing is burned in `finish.sh` any more.
- **Liquid glass, kept to the rule.** The pills are frosted slabs — even white tint, thin rim, soft drop shadow,
  one sheen pass on entrance (`--sh`, driven from `stamp()`) — and the solid pill is the same slab tinted yellow.
  The end card adds four glass tiles with the social marks drawn as inline SVG in ink (Instagram, Facebook,
  TikTok, YouTube), stamping in on "follow". Still one glass object per idea, never glass for its own sake.
- **A room and a haze.** `world3d.js` builds a `RoomEnvironment` PMREM as `scene.environment` at low intensity
  (`env`, 0.32) so the glass, the shells and the tile tops carry real reflections, with the hemisphere eased to
  compensate; a faint paper-coloured fog from 140 to 520 units sits the far end of a flight back in the world.
  Subtle by design — the look is still paper and ink.
- **The terminal is one moulding.** `neroTerminal()` v6: a single side profile (flat front, rounded foot, a back
  that swells at the top for the printer, a domed top) extruded across the width with soft ends, then split at the
  seam into a yellow head and a white shell so both share every curve; a black frame inset on the front around the
  full-height display; the contactless indicator (ellipse, arcs, hand and card) large on the yellow; the wordmark
  once, bottom-left. No dock, no stand. The yellow material clamps its lit colour so the top stays brand yellow
  under the sun. `motion/lib/preview-terminal.html` + `motion/still.mjs` are the sign-off loop for any object.

**Every video closes the same way — the house sign-off, v4.** What to do about it (compare), how to reach us
("Get a quote in minutes" · MESSAGE US · CALL US · neropay.app), "That's it for today", then the follow line.
The middle of the sign-off changes with the video; the shape does not.

**Every video closes on two CTAs.** The site (`neropay.app`, spoken and on screen with the underline drawing)
and, for anything educational, a follow ("Follow us for more of this"). Both are in the take and on screen, and
`checks.py` asserts both. The end card is the mark, one line about who we are, the follow pill, the URL.

**Higgsfield plates.** Allowed now, for images only, under overlays: a photographic **plate** — a
card terminal on a counter, a receipt, a street at night, a till drawer — generated in Higgsfield
(`gpt_image_2_5`, `quality: "high"`, `resolution: "2k"`, 9:16), colour-graded to the ground, sitting
behind the type or the glass card. Rules: no text in the image (we set it), no people, no NeroPay
props (the terminal is the only branded object and must not carry a competitor's mark), sharp and
deep (no bokeh, MOTION-SYSTEM §1), and one plate per beat at most. A plate is a *texture for a
beat*, never the body of the video. Rail 4: an AI image under a caption is synthetic content — the
upload disclosure applies as it does for the presenter series; raise it once per series.

**Light mode only — Faisal, 17 Sep 2026.** NeroPay content is white: the off-white ground, ink type, the yellow as the
accent, and a little blush or lilac where a graphic earns it. PP01 was first built on the partner brief's dark ground and
Faisal rejected it outright ("no more black background theme"). `world({ dark:true })` stays in `world3d.js` as a
switch, but nothing in `motion/` uses it and nothing new should. The charcoal ground listed under Style above is
retired with it.

**PP01, 16–17 Sep 2026 — the white world that keeps moving, a UGC read, the two modules as glass.** The first partner
video, built from Faisal's brief (`motion/partner/BRIEF.md`) and his notes on the first two cuts. What it added:

- **Movement the whole time.** The camera never stops: a slow orbit and breath around the target, a continuous function
  of time, so a flight starts and ends without a jump. Shaded spheres (yellow, a few blush and lilac) float over every
  section and bob; objects sway a few degrees; the field of tiles breathes. The reference's rule — cuts land on motion.
- **Variety in the frame.** Sections alternate: the view swings left (az −22) then right (az +20) then centre, and the
  type is anchored to match (`.in`, `.in.r`, `.in.c`), so nothing sits in the same corner twice running.
- **Phrases become graphics.** "Found it in the terms" is a terms sheet with one line highlighted; "you introduce them"
  draws connector paths on the floor from a YOU pill to the three shops with a dot running each; "we set them up" lands
  a small terminal beside each shop; "every month you hit it" ticks four month chips; "quiet month … only bring one"
  ticks one of four weeks. Badges (brief 03's value badge: ink fill, white type) slam in with two frames of sparks.
- **The reference, borrowed.** The Bonus Dial is a stack: the ledger row tilted above the dial slab. The close turns
  three arc rings at their own rates behind the address (the converge). Poppins stays the family; the brief's Inter and
  DejaVu Mono are not adopted (house ruling of the same day).
- **Squarer crops get room under the objects.** With captions on and the aspect over 0.7, the section boxes drop 6
  units below the floor (`setBox`) so the caption never sits over a pillar or a tile.
- **The brief's two modules as glass slabs.** The Bonus Dial (bonus above the marker, volume below, thresholds appearing
  as they are passed, the rest frame with "£40,000+" and "per merchant" and the only permitted "up to") and the Rate
  Climb (count beside rate, chips lighting as each step is passed, "111+ · 40%" and "Most partners start at 20%: three a
  month." at rest). Both start at the base, never skip a step, and hold their rest frames ≥ 2.4 s; the camera waits for
  them. `shops()` in `objects3d.js` is the brief's street: a run of shopfronts that light yellow when introduced.
- **A UGC read.** Faisal's note on the first take: fully UGC-sounding, continuous, no one-liners, no gaps, no breaths.
  So the script is one piece of talking with the condition said first, and the take goes through `tighten.mjs` with
  `--gap .2 --min .3 --tempo 1.06` (pitch held) and then `gate.py`, which mutes what is left between the words —
  breaths — with 30 ms ramps, leaving alone any gap whose peak says it is a word edge Whisper timed late. Anchors are
  found *by the word* (`at('three hundred')`), never by index, so a re-take re-times the whole composition.
- **An upbeat bed, generated.** `bgm/partner-upbeat-118.mp3` (Eleven Music v2, no vocals — checked with Whisper),
  tempo measured with `motion/tempo.py` (numpy onset autocorrelation; librosa isn't in the sandbox), extended past the
  cut at a bar boundary with a crossfade rather than looped from 0.
- **The draft gate, for next time.** `figures.json` can carry `status: "draft"` and `verify.py` a `draft_figure()`: a
  draft record passes stage 3 but marks the build DRAFT for exports named `-DRAFT` that do not post. PP01 used it for
  a day; the partner figures were confirmed final on 17 Sep 2026 and are ordinary confirmed records now. `checks.py`
  scans for the brief's banned register (Part 6) and asserts every pound figure sits with the condition that earns it.
- **The voice is per video when Faisal says so.** Verity stays the merchant series voice; PP01 is **Olivia — Warm,
  British Female** (`pPoztmvzd5p26S3MsNrV`) at Faisal's request mid-build. Record any such choice in the ledger and in
  the episode's `script.md`.
- **Two mixer faults, found on the v3 master.** `amix` takes the first input's channel layout, and the VO is mono, so
  every mix before 17 Sep 2026 folded its stereo bed to mono; `mix.mjs` now makes every input stereo first. And a linear
  loudnorm pass stops short of the target when the peaks would cross the ceiling (v3 landed 1.1 LU under): when the
  measured gain would push the true peak over `tp`, the mixer now runs a limiter at the ceiling first and measures again.
  `finish.sh` copies the mastered AAC into the crops rather than encoding it a second time.
- **Glass fintech pieces, not balls — v4, 17 Sep 2026.** Faisal's note on v3: no 3D balls; a few subtle fintech elements
  to give the space texture and lift, with the liquid-glass look from his reference (light catching the glass, a mark
  set inside it). `motion/lib/glass.js`: a payment-card slab, a ring, a coin, a square tile — pale yellow, blush or
  lilac glass (a near-mirror clearcoat reflecting the room environment, low opacity so the paper shows through, a dark
  back-face rim so a pale object reads on a pale ground) with a mark etched inside: the contactless wave, £, %, a tick,
  a sparkline, a chip. **Never a number in the glass**, never a brand, never a card number. Two per section, at the
  edges, half in frame, drifting and turning slowly from a deterministic seed. Refraction (`transmission`) is not used:
  the WebGL layer draws over a transparent clear, so a refracting material samples nothing and goes dark. The v3 spheres
  are gone.
- **One real card, not shapes — v4.1, the same day.** Faisal's note on the glass pieces: no floating shapes; one real asset
  relevant to payments per section, large, subtly in the frame, hinting at a card without becoming the focus.
  `paymentCard()` in `glass.js`: bank-card proportions, an ivory matte body with a soft sheen, a gold chip with its
  contact grid, the contactless wave pressed into the face, a thin yellow band, a dark stripe on the back. No number,
  no name, no expiry, no scheme mark, and never a NeroPay card. One per section, at the edge, a third to a half out of
  the frame, drifting and turning slowly, placed clear of every heading (the WebGL layer draws over the type, so a card
  that crosses a heading hides it — S2's card went above the heading, S3's beside the slab). The glass ring, coin and
  tile builders stay in `glass.js` unused.
- **Generated plates, for certain beats — v4.** Faisal generates clips in a video tool (no people, no text, no brand, the
  white world, the specs in `motion/partner/pp01/AI-PLATES.md`) and we composite our type, captions and modules over
  them; frames are pulled with ffmpeg and loaded per frame so the render stays deterministic. Texture for a beat, never
  the body; the upload disclosure covers them.
- **The gate, leniently.** The v2 settings (`tighten --gap .2 --min .3 --tempo 1.06`, `gate --inset .06 --max -18`)
  clipped into words. The ruling: `--gap .32 --min .45 --tempo 1.03` and `--inset .12 --max -30` — a split second of
  gap is allowed, 120 ms either side of every word is never touched.
- **The hook, for a stranger.** v3 leads with what an introduction pays, per merchant with the condition on the same
  frame, as if the viewer has never heard of NeroPay; who we are comes second. The v2 "here's the catch" opening assumed
  they already knew us.
- The timing law counts the words a viewer has to *read* — sentences, kickers, the rest-frame lines — not the numerals
  and chips they glance at; the compliance super is its own beat.

**PP02, 17 Sep 2026 — one street, the camera walks it, the type moves word by word.** The second partner video
(`motion/partner/pp02/`). What it added: `street()` (a long row of paper shopfronts of mixed heights with shutters, built
once at scene level behind every stop), `lampPost()`, `phone()` (a canvas screen the composition draws into per frame),
`receipt()` (paper printing out of a slot through a **local clipping plane** — `renderer.localClippingEnabled` — so the
print stays sharp) and `van()`; a straight dolly between stops (`walk()`, no pull-back, the stops facing alternately left
and right); the pavement, kerb and road as DOM planes. Type: word-by-word rise with a stagger and a tracking settle,
a typewriter whose caret follows the last character, an odometer that snaps digit to digit, strikes, hanging signs, a
per-word pop on the captions. Two rules learnt: a WebGL object placed near a heading hides it whatever its depth (the
receipt went to the shop on the far side of the type; the lamp-post signs rose above the projected shop tops), and a
frame with the street in it needs a shallower box (y to 18, elevation 12°) or the shops read as a strip at the bottom.

**PP02 v2 — grand figures, once (Faisal, 17 Sep 2026).** Money and stats are the hero of their frame: one figure, large
(the 164 px hero on the marker, the 130 px climb row), with its condition in readable type beneath — never a second, small
copy of the same figure elsewhere in the frame (the receipt beside the hero was the fault). The count that opens a video
flies in large and settles as the scene sets, pops on each change, and hands over to the next mark; no rolling digit
columns (partial glyphs read as clipping). Every stop's type slides up and settles as the camera lands, and the box sits
low and shallow enough that the frame is full — empty sky at the top is a fault. These are standing rules.

**PP02 v3 — the voice leads (Faisal, 17 Sep 2026).** Nothing is on screen before she has said it. Every graphic is
anchored to the start of the word that earns it, not to the camera landing: a heading that mirrors the take rises word by
*spoken* word (`sync(el, t, times('pays you'))`), a typewriter types each word across the time she takes to say it
(`typeSync`), a shop lights on the word that names it, the phone types on "name" and "number", the van stops on "close",
the strike lands as she finishes the claim. A stop's camera walk is timed so it has landed by the first word that puts
something on it; "things that wait for the camera" is retired as an anchor. The overlays must feel as if she is pointing at
them. Two more from the same review: the opening count is the hook — large, in a glass tile, counting the shops the view
rides past, flipping into a large question mark that is the question's own (the kicker retypes under it), never a lone
"?"; and liquid glass is used sparingly and only under what matters (three slabs in PP02: the count, the money, the climb),
tilting in on a perspective with a sheen that passes now and then. A vehicle that delivers stops in frame; a terminal at
the edge sits inside the frame, never cut by it. The type sits high — the frame above the box is real space, and the
4:5 frame's top third must not be sky.

**PP02 v4 — floating objects, red strikes, room in the stack (Faisal, 17 Sep 2026).** The phone, the terminals and the
receipts float in the upper half of the frame, above the roofs, with a slow bob and turn — never on the pavement in front
of a shop, never intersecting one, never cut by the frame. A van sits flat on the road: rotating it about its ground origin
lifted its wheels and read as hovering. A count that opens a video stands bare — no glass, no marker under the question
mark — with its line typed well below it. Strikes are red and animated (the claim shakes and greys). A climb runs
continuously in a fixed-width slot with the rate rolling up on each threshold; numbers never teleport. A stack of panels
keeps at least a unit of clear space between items, and nothing sits behind another overlay. Type and panels carry a
soft shadow for depth, never a hard one.

**PP02 v5 — the diagram over a ghosted street (Faisal, 17 Sep 2026).** When a stop explains a figure, the explanation is a
diagram — bars, large, centred, just above the caption — and the street behind it fades to a trace for that stop only
(`street().fade(i, p)`), so the figures carry the frame; the other stops keep the street solid. A panel with a large
figure gets one short condition line with real clearance below it, not two serif lines under the slab's edge.

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

**The script — v4, 16 Sep 2026.** Written *with* Faisal, draft by draft, and approved before the take is
generated; that is the process from now on. It has to sound like a British person explaining something to
another, not performing: plain words, nothing forced, no line that exists to sound clever (v3's "Quick one" and
"Did they?" were cut for exactly that). Order: who this is for · the rule and its date · what they must do · what
that means for you · a one-clause concession, then straight into the push to act · how to reach us · "that's it
for today" · follow. Rails still hold in the room: a savings figure ("hundreds if not thousands") does not go in,
however it is asked for — say "adds up over a year" and stop. Read it aloud before generating: if a line would
sound odd across a counter in Rusholme, cut it.

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

**A bed under every video, on a grid.** Nothing ships silent (`video/AUDIO.md`): each episode carries a neutral
instrumental bed, generated once with Eleven Music v2 through the connector (`creative_generate_in_flow`,
`node_type: music`, `eleven_music_v2`, ~900–1,700 credits a minute, ask for "no vocals, no hook, constant tempo")
or taken from the library, committed under `video/library/bgm/` with a ledger row. Measure its tempo (librosa in
the sandbox), derive `BEAT`, start the bed at composition 0 and put the VO on a beat (`HEAD = 2 × BEAT`).
Everything not tied to a word lands on the grid — the hook's stamps, the first and last camera moves. Word-anchored
events stay on their words. `motion/mix.mjs` ducks the bed under the voice (sidechain, 5:1) and masters to
**−14 LUFS / −1.5 dBTP**, the `video/AUDIO.md` target; the −16 of the first two cuts is retired. Effects: one per
motivated movement, no sound twice in a row, and never the same whoosh on every camera move.

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

**Module compositions.** A composition that imports `objects3d.js` is an ES module, so it loads over `file://`
only with `--allow-file-access-from-files` (`render.mjs` and `peek.mjs` pass it) and it declares
`window.READY = false` in a classic script first and sets it `true` when the module has built its scenes; the
renderers wait for it. WebGL runs on SwiftShader in the container — under 5 ms a frame for these scenes.

**A 3D gotcha peeks cannot catch.** three.js caches an instanced mesh's bounding sphere on its first draw. A
run of tiles first drawn while every tile is parked below the ground (a camera move into the station) is then
culled for the rest of a sequential render — the stills look right, the video has no tiles. `tiles()` sets
`frustumCulled = false`; do the same for anything that starts off-frame, and after any 3D change walk the timeline
in one page before trusting a peek (the contact sheet from `finish.sh` is where this one showed).

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

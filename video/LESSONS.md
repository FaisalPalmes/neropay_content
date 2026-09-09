# Video edit faults log — read before every edit, add to it after every review

Each entry: what went wrong, why, the rule that stops it happening again. Newest at the top.
The B1 build (`b1-rate-you-were-quoted/build.mjs`) already applies every rule below.

## 10 Sep 2026 — v6, Faisal's fourth review (the inner rectangle, the card jump, less glass)

32. **Opacity flattens a 3D group.** The cards "teleported" on their way out because the exit faded
    `.orbit`, and any opacity below 1 on a `preserve-3d` element forces it flat for that frame, so the
    fanned cards snapped into one plane at the first frame of the fade. Rule: opacity only ever moves
    on leaves with no 3D children (`.face`, `.edge`); groups and cards move by transform only. The same
    goes for `filter` — a drop shadow on a 3D card goes on the face as `box-shadow`.
33. **No decoration inside the glass.** A masked gradient ring drawn 26 px inside the panel edge read
    as a second, harder box under the glass, on every panel and every card. The glass is one slab: the
    blurred copy, an even tint, a thin edge highlight. Nothing drawn inset from the edge.
34. **Not everything is a panel.** A phrase she says ("their card. your rate.") is big type on the
    footage with a soft shadow, not another box. Panels carry data; type carries emphasis.
35. **Cut a line, keep the joins.** `edit.json` `endAtWord` drops a clip's tail after a word, cut.mjs
    remaps, and every later cue moves with the timeline because cues come from words, not seconds.

## 9 Sep 2026 — v5, Faisal's third review (flicker, the hard line, the blur edge, the yellow flash)

27. **The glass is no longer a `backdrop-filter`.** Even with #22 applied, Chrome re-rasterises a backdrop
    blur under any transform on the panel, so the blur edge drifted off the frame edge during the lean and
    the scale-based unfold, the fold-away exit ended on a thin bright slab (the "hard solid line"), and the
    content faded before the blur did. Rule: every panel carries its own copy of the footage — cut.mjs
    writes a 480×270 gaussian-blurred `<id>.blur.mp4` beside each cut clip, and `bgFor()` in build.mjs
    places it inside the panel at `left:-x; top:-y` so it lines up with the frame, clipped by the panel's
    own rounded box. The blur edge *is* the panel edge, on every frame, under any transform; the whole slab
    (blur, tint, rim, content) fades as one thing; and nothing above it is off limits any more — opacity,
    3D rotation, preserve-3d all safe. A timed `<video>` may not sit inside a timed element, so the panel
    wrapper is an untimed div (`.panel`) and the `.float` is hidden by CSS until its first tween.
28. **Cards are small glass slabs in the same way.** Eight `translateZ` layers behind the face give them a
    body you see on the turned side; the face carries its own blurred copy under a dense frost with a lit
    gradient (bright top-left, cooler bottom-right), a metal chip, one static highlight, a rim, no shadow.
    Exits are one fade with a small drift — never a sink into depth, which reads as a jump.
29. **Empty first, then 3D.** A panel arrives flat and empty (a fade and a small rise) a beat before she gets
    to it; at `cueAt` — the moment she starts on the graphic — the heading rises, the slab leans and the
    camera zooms, together (`glass({cueAt})` plus a `chain()` whose first zoom lands at `cueAt + 0.9`).
    Data still arrives on its own words. A row that is not spoken yet is not on screen — the sum panel's
    arrow was visible from the start in v4 because `.arrowwrap` lacked `.cue`.
30. **A colour never changes on a wordmark.** The title and end cards tweened "Pay" from ink to yellow on
    landing; Faisal saw it as the yellow flashing. "Pay" is `#F5C518` from its first frame. The only colour
    tweens left are the ladder's yellow-to-grey hand-off and the strike-through dimming 0.5%, both slow.
31. **The outro is minimal.** Six generic labels (Payment Terminal, Free POS Software, Online Ordering
    System, Booking System, QR Payments, API for Ecommerce), one tile per two beats, one fade in and one
    fade out each, no product names, no wipes. No AI wording anywhere in the video (rail 4).

## 9 Sep 2026 — the re-cut (Faisal's second review of the full edit)

21. **The idle bob is gone.** A blurred panel that drifts re-samples its backdrop every frame, which reads
    as shimmer. Panels enter, hold still, and leave. One sheen pass on entrance.
22. **Three things blind the glass, and all three were in the build.** Under HyperFrames' Chrome a
    `backdrop-filter` goes dead when any ancestor has `transform-style: preserve-3d`, an opacity below 1,
    or a clip-path. This was the root of every glass complaint since v1: the panels were tinted boxes
    with a crisp backdrop (the "sticker") and the blur popped in and out with every fade (the "flicker").
    Rules: nothing above a `.glass` carries preserve-3d; the panel wrapper is never faded or clipped — it
    unfolds with a 2D scale from its entering edge while it leans into place, folds down on exit, and only
    the content (a child of the glass) fades. Plain transforms, 3D rotations included, are safe. The cards
    keep their real 3D space because they have no backdrop blur at all. Test: snapshot a panel over text
    at rest, mid-entrance and mid-exit — the text behind must be unreadable in all three.

23. **Nothing is on screen before she says it.** Every cued element carries `.cue` (hidden in CSS) and is
    revealed by a fromTo; a fromTo alone leaves the element visible until its start time because
    HyperFrames renders frames in order.
24. **The left column sits over the whiteboard.** Panels there use `.glass.dark` (brightness .36 and a
    charcoal tint) so white and yellow type still clear contrast.
25. **A panel-aware focus.** `pf(id, S, px, py)` raises the focus point so the panel's bottom edge never
    drops into the caption zone at any zoom; camera runs inside a clip go through `chain()`, which clamps
    every point to the clip and never runs backwards.
26. **Dead air is cut with `cut.mjs`, not by hand.** Gaps longer than 0.6 s between Whisper words shrink
    to 0.38 s, heads and tails are trimmed; the word timings are remapped. Faded audio cuts need the full
    ffmpeg (the sandbox); the web container only writes placeholder lengths.

## 9 Sep 2026 — sound

20. **Sound effects come from `video/library/`, never synthesised on the fly.** B1's first cut used five
    tones generated with ffmpeg because nothing else was to hand. Rule: every effect or music bed is a
    file in `video/library/` with a line in `library/LEDGER.md` (source URL, licence, attribution if
    any). The bundled Pixabay pack is the default palette; Freesound through `resolve-freesound.mjs`
    when the pack misses (CC0 only unless told otherwise). Copy the file into the project's `assets/`
    and reference it locally. Pixabay's API has no audio endpoint, so its music and effects are
    downloaded by hand from the site.

## 9 Sep 2026 — rendering the full B1 edit on the real clips

16. **4K source clips crash the check and the snapshot.** Higgsfield exports are 3840×2160; with nineteen of
    them on the page the Chrome capture dies ("video frame injection failed … Target closed") and
    `hyperframes check` reports one runtime error with no message. Rule: transcode every clip to a 1080p
    proxy (`scale=1920:1080`, 24 fps, crf 16, audio kept) before build, check, snapshot or render. The
    composition renders at 1080p, so nothing is lost.
17. **The sandbox is ephemeral — keep the rebuild in the repo.** The Higgsfield sandbox was recycled between
    the check and the render and everything in it went (clips, node, hyperframes, transcripts). Rule: the
    clip-to-CDN mapping lives in `data/sources.json` and `sandbox.sh` rebuilds the whole environment from a
    clean box in one run. Never keep state only in the sandbox.
18. **Warm footage needs darker glass.** On Ava's set (wood, lamps) the panels at brightness .6 left small
    labels below 3:1. Rule: the blur layer runs `brightness(.52)`; check the contrast report on real
    footage, not on the grey placeholders.
19. **Long sandbox work runs with `background:true`, never `nohup`.** The sandbox is discarded about ten
    seconds after a foreground call returns; only a background call holds a 15-minute lease (renew it with
    another background call before it lapses). The tool call times out at 60 s and its output truncates
    around 20K characters, so stills come back as ≤14.5K-character base64 chunks decoded locally from the
    session log.

## 9 Sep 2026 — full B1 edit, Faisal's notes on v2

11. **No on-screen "AI" wording.** Faisal's decision, given after the risk was explained: the name plate reads
    "Ava / NeroPay" and no generated video carries an AI line. The disclosure moves to the upload: tick
    YouTube's "altered or synthetic content" setting and keep a line in the description. Root CLAUDE.md
    rail 4 carries the same note.
12. **Figures are yellow, labels are white.** Every number she says is the thing the viewer should look at,
    so it is `#F5C518`, counts up as she says it, and nothing else on the panel competes with it.
13. **Cards live in a real 3D space.** No blur on the cards themselves (blur and 3D rotation must not share
    an element), a perspective parent with `preserve-3d`, a slow orbit on the group, and a container big
    enough that nothing clips at the edge.
14. **Whisper is the script.** Ava's take can differ from the pack (shot 9 says "the payout fee", shot 18 has
    a different close). Cues come from the transcript, never from the script text, and any on-screen copy
    that quotes her must match what she actually said.
15. **Tall panels meet the captions once the camera zooms.** Keep a panel's bottom at or above y=800 on the
    1920×1080 frame and cap the push on it at about 1.18×.

## 9 Sep 2026 — B1 glass edit, Faisal's review of the first render

1. **Title card panel stuck top-left.** The panel wrapper had `left/top` but no `position:absolute`, so the
   offsets were ignored. Rule: every positioned wrapper gets `position:absolute` in its class, never only
   inline offsets. Snapshot the title and end cards at their midpoint before any render.
2. **Overlays flicker / stutter on entry and exit.** `backdrop-filter` and a 3D transform were on the same
   element; Chrome re-rasterises the blur inconsistently under rotation and drops frames. Rule: the blurred
   element is never transformed. Structure is `.p3d > .float (3D entrance/exit) > .idle (2D bob) > .glass`.
   Cards and chips follow the same rule: 2D motion only on anything that blurs its backdrop.
3. **Glass showed the footage as a hard-edged "sticker".** The blur was sampled inside the panel box, so
   the wall's edge stayed crisp and the tint was too weak to lift it. Rule: put the blur on an oversized
   `::before` (inset -60px, clipped by the panel), keep the white tint even (≥ .16 alpha everywhere), keep
   saturate ≤ 140%, keep the sheen weak (≤ .20) and behind the content.
4. **Captions looked like they flickered.** Every phrase slid up, faded in and faded out, so the bottom of the
   frame moved every 1–2 s. Rule: phrases hard-cut. The only motion in a caption is the spoken word turning
   yellow. No text-shadow, no outline, no scale pop.
5. **Disclosure pill was too big and too loud.** Rule: first three seconds carry a small name plate — "Ava"
   with "NeroPay · AI presenter" beneath — top-left, ~340×92. The AI wording stays: hard rail 4 (ASA guidance
   22 Jun 2026, EU AI Act Art. 50). Never label an AI presenter as staff or a real person.
6. **Redundant graphic.** An "Explained by NeroPay" lower-third ran one second before the title card said
   the same thing. Rule: a graphic exists only if it adds a fact, a number or a name the viewer doesn't
   already have on screen. Before each render, list every graphic with its purpose in one line; cut any
   line that reads "looks nice".
7. **Camera exposed the frame edge.** Push-ins translated further than the scale covered. Rule:
   `|x| ≤ (S−1)·W/2`, `|y| ≤ (S−1)·H/2`, clamped in code, and at S = 1 there is no translation at all.
8. **Sound effects stacked on one track.** Rule: every `<audio>` carries `data-duration` and its own track.
9. **Lint hard-kill and rounding errors.** Rule: every exit fade ends with a `tl.set` at the exact clip end,
   and the end time is rounded first so the fade start derives from it.
10. **Panels over the presenter.** Rule: panels start at x ≥ 1110 on the 1920 frame for this set (Ava sits
    centre-frame); check a real-footage frame before the final render.

## Standing rules for every edit

- Build and `npx hyperframes check` locally against placeholders; render draft in the Higgsfield sandbox on
  the real clips; look at a montage; only then render high. Contrast findings on real footage are real.
- Every graphic and every camera move is timed to a word (`findWord`) — never to a round number.
- No CDN scripts, no fonts from the network: `assets/vendor`, `assets/fonts`.
- Deliver via Higgsfield media upload; note the link in Drive "03 Finished".

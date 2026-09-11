# Video edit faults log — read before every edit, add to it after every review

Each entry: what went wrong, why, the rule that stops it happening again. Newest at the top.
The B1 builds (`b1-v7/build.mjs` on MOTION-SYSTEM.md, `b1-rate-you-were-quoted/build.mjs` for the glass look, the vertical and the ad) already apply every rule below.
**Read `PLAYBOOK.md` beside this file first** — it carries the brief (what Faisal wants, the three
delivery formats, the sandbox pipeline, what a finished cut looks like); this file is the fault log.

## 11 Sep 2026 — v8, Faisal's review of v7.1 (the tilt, the flat look, the light cards)

59. **A spec is not a review.** v7 was built to `MOTION-SYSTEM.md` to the letter and Faisal rejected the look in one
    line: the flat dark panels, the hairline boxes, the numbered tables. What he wanted was the liquid glass he had
    already approved four times on v6. Rule: a new spec changes the *structure* (angles, timing, the scan) unless
    Faisal has seen the new look on real footage and said yes; the look that passed review stays until he sees a
    reason to change it. The spec now says so in its v3 section.
60. **The lean goes toward the centre.** He called the v7 statement "tilted the wrong way" and he was right: a
    left-column panel at `rotateY(-10deg)` brings its far edge forward. v6's rule, now written down: left column
    `+7`, right column `-6/-7`, the edge nearest her comes forward (`glass()`, `lean`).
61. **The light stage.** Ground `#fbfaf7`, three static blurred blooms (`filter: blur(90px)` on a radial gradient;
    a blurred element never moves), a faint white frost gradient over them, black type. The wordmark is the word
    in black with a yellow full stop — `.wm .wt` masks on over fourteen frames, `.wm .dot` pops from zero with
    `back.out(2.4)` over ten frames twelve frames later, then one 12 % breath over 1.4 s. Faisal asked for "very
    subtle"; that is the whole animation.
62. **The INTRO caption ends when the slab starts to grow.** Captions are drawn above the stages, so the last
    phrase ("…Explained by NeroPay.") in white would sit on the white card as it opens. Its `data-duration` is
    capped at `TT.expandAt` in the caption loop.

## 11 Sep 2026 — v7, the first build on MOTION-SYSTEM.md (`b1-v7/`)

43. **An angle is a crop decided at build time.** Every take is the one locked-off FRONT framing, so `data/angles.json`
    names FRONT / SIDE / CLOSE per shot and `sandbox.sh` cuts that window from the 3840×2160 source before anything
    else (SIDE: 2560×1440 from the left edge, Ava in the right third; CLOSE: 2259×1271 on her face). The clip on disk
    *is* the angle; the in-page camera only breathes ±3 %. `build.mjs` refuses a cut between two shots on the identical
    framing (§1 step 5); where two adjacent shots need the same angle, the second uses the looser variant (SIDE2,
    CLOSE2, FRONT2) so the cut is a punch, not a jump.
44. **The hold law is asserted, and it changes the cut, not the graphic.** `law()` in `build.mjs` computes build / hold /
    exit per overlay and refuses to write `index.html` if hold < max(1.5 s, words × 0.4). Where a take has the air,
    `edit.json` `tail` keeps more of it after the last word (B1-10 0.8 s, B1-17 1.0 s; B1-01, B1-04 and B1-11 keep all
    the air they have, 0.34–0.68 s); nothing is stretched. Where it doesn't, the graphic loses words (the title lost its
    episode pill, the end card its footnote), lands earlier (the hook's strike on "almost", the 1.09 % on "actually",
    the fan's cards in eight frames), or is held across a cut on the same angle (the two-ways table into B1-15).
44a. **Plan against the takes, not the placeholders.** v6's `cuts.json` recorded the *placeholder* lengths as source
    lengths (B1-01 "10.05 s" — the take is 8.04), so a tail budget planned here failed in the sandbox. `data/takes.json`
    now records every take's real length (ffprobe on the CDN files) and `make-placeholders.sh` cuts the local stand-ins
    to match, so `node cut.mjs && node build.mjs` here fails the law exactly where the sandbox would. Run it before
    trusting any local hold.
45. **A graphic that grows on her words is checked twice.** The spec's formula assumes a graphic that appears whole. For
    a table or a statement that prints row by row as she reads it, `law()` checks the whole graphic against its total
    time on screen and the last thing to land against the time left after it — the words she has already said have
    already been read. This is an interpretation, written down here and in PLAYBOOK §9, for Faisal to confirm.
46. **Panels are a flat fill, not glass.** `rgba(16,18,22,.62)` with a 1 px hairline at 22 % white and
    `filter: drop-shadow(0 24px 48px rgba(0,0,0,.45))` — no blurred copy of the footage, no `backdrop-filter`. The
    drop-shadow filter is safe because nothing above it is `preserve-3d` (#32 still holds for anything that is).
47. **Overlay class names are namespaced.** A card caption called `.cap` inherited the captions' `.cap` rule
    (`width:1920px; bottom:118px; display:flex`) and flew 900 px to the right. The check's `escaped_container` info
    is the tell — read the info findings, not only the errors.
48. **Mask the element that carries the hidden state.** `.rel b` starts hidden, so `maskOn('#formula .t2 b')`, not the
    span around it — otherwise the right-hand term of the relation never appears and nothing errors.
49. **Rows with fewer cells get explicit grid columns.** Auto-placement put the statement's fee amounts in column two;
    `.fee .lab{grid-column:1} .fee .how{grid-column:2/5} .fee .amt{grid-column:5}` puts them where the card lines are.
50. **A size change under a hard cut is invisible.** The eight-question panel is four rows tall through B1-15 and
    takes its full height with a `tl.set` at the first frame of B1-16 — the cut is already a jump, so the panel
    growing on the same frame reads as nothing at all. Use this instead of an empty slab holding space.
51. **The title comes from the middle of the frame.** `#title` is the full stage from the first frame; a `clipPath`
    inset tween takes it from a 460×120 window at the centre to the whole frame over 22 frames on "NeroPay". Everything
    inside is laid out in its final position; the kicker sits at the centre while the window is small and rises to its
    slot as the window opens, so nothing has to be re-parented or scaled.
52. **Effects sit 2.5 dB under v6 (`SFX_GAIN = 0.75`), the music beds unchanged.** Faisal's note on v6 was that the
    effects were too loud; the base levels stay at v6 parity so the gain is the only difference and can be tuned once.
53. **A sandbox can be recycled mid-render, lease or no lease.** The first high-quality run vanished with the whole
    box about twenty minutes in, despite `sleep 840` renewals. Rule: the upload is part of the render command — the
    `curl -X PUT` to the `media_upload` URL sits in the same background command as `sandbox.sh`, right after the
    loudnorm, so a finished file leaves the box before anything else can happen to it. Don't run a second heavy job in
    the same box while a render is capturing (the review sheet and the high render shared a box; only the sheet survived).
54. **Stills come back through the session log, not by retyping.** Print each still as base64 in ≤15 K chunks with a
    marker (`=====D0=====`), then a local script pulls the chunks out of the session's `.jsonl` transcript, joins them and
    checks the md5 the sandbox printed. Zero transcription, a 40 KB JPEG in one call each way. A four-frame 960×540
    sheet at `-q:v 9 -pix_fmt yuvj420p` is 40 KB; an eight-frame sheet was 130 KB — keep them small and ask for the
    frames that carry the risk (an overlay over the whiteboard, the band under the lamp, one CLOSE).

55. **The review sheet caught a one-frame flash the eye never would.** The twelve-tile sheet showed the title's held
    frame as empty charcoal. Chasing it: a per-frame mean-luma scan of the master (`signalstats`, 480×270) found exactly
    one single-frame spike in 4,934 — frame 631, a flat frame between the title card and B1-03 — reproduced locally on
    a 22.5 s cut, and the cause is the renderer, not the composition (a snapshot of the same instant is perfect). The
    export runtime floors every `data-start` to the frame grid, so a clip that starts at 21.091 is shown from frame 632
    with a media time still below zero, and when nothing was playing on that track before it (the title card sits in a
    gap) the first frame paints blank; a clip that follows another clip does not. Rule: under every card that a clip
    follows, `build.mjs` places a muted copy of that clip on track 0 (`v-under-*`), fully covered by the opaque stage —
    with it the cut frame is footage. Aligning the cut to the frame grid also fixes it, but every boundary would have to
    be aligned; the under-clip is one line and changes no timing. The scan is now step 6 of `sandbox.sh` and part of the
    §7 gate: `review/spikes.txt` must say zero.
56. **The file ran 0.5 s past the composition, and its last frame was blank.** The outro bed is 18.6 s and only 18 s fit;
    the page clamped `data-duration` but the renderer ran to the end of the file, so the master was 4,934 frames for a
    163.958 s root and the last one had nothing on it. Rule: a sound that runs past the composition is cut to length
    with ffmpeg at build time (`role-fit<start>.m4a`, 0.3 s fade) and the page references the cut copy; the end card's
    duration is chosen so the composition ends on the frame grid; and the end stage overhangs the root by three frames
    so the flooring can't strip its last frame. Root and file are now the same length, and the frame scan proves it.
57. **Local renders were failing for a reason that had nothing to do with the composition.** The session hook pointed
    `HYPERFRAMES_FFMPEG_PATH` at Remotion's bundled ffmpeg, which is built with `--disable-filters`; HyperFrames' frame
    extraction (`-vf fps=30` to `frame_%05d.jpg`) dies in 100 ms with "VIDEO_SOURCE_UNRENDERABLE; ffmpeg_failed" and no
    stderr. Wrap the binary in a script that logs argv and stderr to see it. The hook now installs the distro ffmpeg
    when it can and prefers `/usr/bin/ffmpeg`; a build or scan run by hand needs `HYPERFRAMES_FFMPEG_PATH=/usr/bin/ffmpeg`
    too, and a truncated test cut needs `HF_VIDEO_COVERAGE_THRESHOLD=0` or the coverage gate aborts on the clips outside it.

58. **The box lives fifteen minutes from the start of the last *background* call. Polls don't extend it; a new
    background call does.** Three losses today line up on that clock to the minute: a render launched at 02:57 was gone
    by 03:16, one launched at 03:32 was gone by 03:49, and the box that had a background call at 03:23 outlived the
    03:16 one's lease because of it. Foreground polls every two minutes changed nothing; LESSONS #53's `sleep 840`
    was one background call that ran out at fourteen minutes. Rule: while a render runs, fire a trivial background
    call (`sleep 2`) every eight to ten minutes — each one resets the lease — and poll for progress with foreground
    calls in between. A B1 render is five minutes of setup, seventeen of capture and three of loudnorm, sheets, scan
    and upload; that is three renewals. `SETUP_ONLY=1` stays useful for a build that might need a second look before
    the render. More capture workers don't help: the parallel path stores every frame on disk first (41 GB for 4,933
    frames on a box with 18 GB free), so it is one worker and the streaming encoder at ~5 fps.

## 10 Sep 2026 — the Meta ad cut of B1 (4:5, 50 s)

40. **An ad is a second project on the same assets.** `video/b1-ad-4x5` symlinks the B1 `assets` folder and
    reads the B1 data files, so it shares the cut clips, words, sounds and glass; `ORIENT=vertical AD=1
    bash sandbox.sh` renders it from the 4:5 proxies. Seven takes, the argument only: hook, one card /
    many, their card your rate, formula, result, more than double, two minutes. Nothing that names a NeroPay
    rate (the 0.70% takes), no follow-us, no long outro.
41. **Her voice under a diagram.** A take can be audio only: the `<video>` is left out, a full-frame stage
    fades in over the last footage frame and the slab builds on her words. Anything fixed on screen (the
    brand mark, captions) lives outside `#world`, or the camera pushes it off the canvas.
42. **4:5 panels live in the top 380 px** — above her head on this set — and every pan is centred on x,
    because a 1080-wide frame has no room to pan a 900-wide panel sideways.

## 10 Sep 2026 — the vertical cut (Reels / TikTok) of B1

36. **One build, two frames.** `ORIENT=vertical node build.mjs` writes the 1080×1920 version of the same
    composition into `index.html` (the CLI only checks and snapshots index.html); the default stays 1920×1080
    and must stay byte-identical when the vertical branch changes — diff it. Every position is a
    `V ? vertical : landscape` pair; timings, sounds, cues and captions are shared.
37. **Crop from the 4K source, never upscale the proxy.** `sandbox.sh ORIENT=vertical` cuts a 4:5 window on
    Ava (she is at 51% across this set) straight from the 3840×2160 sources to 1080×1350. A 9:16 crop of the
    1080p proxy would be soft and would leave no room above her head for the panels.
38. **Vertical layout.** Footage sits on the floor of the frame (top 570); above it a blurred, darkened copy
    of the same clip fills the band and a soft gradient sits on the seam. Panels live in that band, starting
    at y ≥ 180 (the TikTok header) and ending above her hair (~950); captions at bottom 400 (the app UI),
    max-width 900; the big type goes above the cards, not beside them. The camera can only pan ±(S−1)·540 on a
    1080-wide frame, so every zoom centres on Ava and the bar-walk pans are gentle by nature.
39. **The glass shows two layers in vertical.** Each panel's own copy of the footage is the fill band plus
    the footage window, both from the `.blur.mp4` (now cut at the clip's own aspect, `scale=480:-2`).

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

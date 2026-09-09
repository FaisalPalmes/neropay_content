# Video edit faults log — read before every edit, add to it after every review

Each entry: what went wrong, why, the rule that stops it happening again. Newest at the top.
The B1 build (`b1-rate-you-were-quoted/build.mjs`) already applies every rule below.

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

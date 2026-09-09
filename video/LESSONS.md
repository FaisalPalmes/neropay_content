# Video edit faults log — read before every edit, add to it after every review

Each entry: what went wrong, why, the rule that stops it happening again. Newest at the top.
The B1 build (`b1-rate-you-were-quoted/build.mjs`) already applies every rule below.

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

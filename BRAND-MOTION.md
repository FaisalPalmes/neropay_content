# The Shutter — NeroPay's motion signature

Written 21 September 2026 by the social session, at Faisal's direction, for the session that owns
`motion/`, `video/` and `edit/` to build. **This file is the spec; it is not a build.** Nothing in
`motion/`, `video/` or `edit/` has been touched.

It comes out of an idea of Eray's on 21 Sep — *"neropay n letter like door, so we can do outro
animation like closing door for shop or opening door."* What follows is that idea taken apart and
put back together against the measured artwork and the rails.

`BRAND.md` remains the authority on the identity itself. `MOTION-SYSTEM.md` remains the overlay and
camera spec for the presenter videos, and its BUILD → HOLD → EXIT timing law is unchanged and
governs everything here. This file adds one thing neither of them has: **what a NeroPay video does
at the top, at the cut and at the end.**

---

## 1. Why a shutter and not a door

The mark is a container shape with a movement inside it: a rounded square cut by a single hard
diagonal. Containers open. That is what Eray is seeing, and he is right about the mechanism even
though "door" is the wrong word for it.

It should be a **shutter**, for a reason that has nothing to do with design. Every merchant in the
Rusholme → Longsight → Levenshulme corridor pulls a shutter down at the end of the night. It is the
object their day ends on. A door is any building; a shutter is a shop. The metaphor has to come from
the audience's day or it is decoration.

**One hard limit, and it is a rail, not a preference.** The shutter is a picture and a sound. **It
never becomes a line of copy.** "Opening doors", "opening up new opportunities", "unlocking" — that
register is Rail 2 (earnings and opportunity claims), and "unlock" and "access" drift into Rail 1
(s.21 FSMA) as well. The visual may be a shutter for the rest of the company's life. The script may
never mention one. A reviewer who sees the words and the picture agree on "opening" is looking at a
financial promotion.

## 2. The measured geometry — use these numbers, do not round them

Measured from `brand/favicon/neropay-icon-512.png` and the 1080 reference:

| | Value | Where it came from |
|---|---|---|
| **The angle** | **46.5° below horizontal, running down-right** | both bars of the N, fitted independently |
| Tile corner radius | 15.5% of tile width | the icon's rounded square |
| Bar width | 17.5% of tile width | the N's stroke |

`social/templates/stage.css` already carries these as `--ang: 46.5deg`, `--gang: 46.5deg` (the same
angle as a CSS gradient direction), `--shear: 43.5deg` (measured from vertical, for `skewX`) and
`--tile-r: 15.5%`. **Copy those tokens rather than re-deriving them**, so a card and a frame are the
same object.

46.5° is not 45°. The difference is visible when a wipe and a static card sit in the same edit.

## 3. The five components

Timings are targets at 25fps. Every hold still obeys `MOTION-SYSTEM.md`'s law:
`hold = max(1.5s, on_screen_words × 0.4)`.

### 3.1 Shutter up — the intro
**0.6s.** The frame opens as the solid yellow tile, full bleed. It splits on the 46.5° seam and the
two halves travel apart *along* that angle — not left/right, not up/down — wiping to the first shot.
One beat, fast, no bounce, no overshoot. Nothing else happens in those 0.6s: no logo, no title.

### 3.2 Shutter down — the outro
**1.0s close, 0.8s hold.** The two halves travel back in along the seam and meet. As they meet, the
wordmark lands on the join — fade plus an 8px rise, **as a single object**. Hold, then out.

> The kit is raster only. The wordmark has no vector and no font file, so its letters cannot move
> independently, now or ever, until Eray supplies vector. The whole system is built around animating
> **panels** for exactly this reason. Do not attempt a letter-by-letter build; it is what `BRAND.md`
> §5 rules out.

### 3.3 The cut — the transition
**0.3s.** One panel sweeps across on the same 46.5° seam. Between every scene. This is the
workhorse — six to ten per video — and it is what makes four separate videos read as one set.

### 3.4 The tile — the container
Static. Rounded square at 15.5% radius. A hero figure sits in a **yellow tile with ink type**; a
supporting figure sits in a **charcoal tile with white type**.

`#FFCF24` behind `#111114` is 12.75:1 and is the one place yellow may be a ground. **Yellow type on
a light ground is 1.42:1 and is never allowed** (`BRAND.md` §3).

### 3.5 Open / Closed — the one narrative use
The literal sign flip, reserved for Street content and the trading-hours story. Once a month at
most. Used more often than that it stops being a signature and becomes a tic.

## 4. What it replaces

**The yellow full stop is retired.** Faisal ruled on 21 Sep 2026, closing `BRAND.md` §6.2 question 2.
The dot was punctuation belonging to a typeset wordmark that no longer exists; the diagonal is the
signature now. `social/templates/stage.css` already reflects this — the rounded yellow bar is gone
and the rule is the mark's two bars in miniature, cut at 46.5°.

**The finished renders are untouched.** The B1 master, the NeroConnect explainer, The Maths episode 1
and the partner pieces all end on the old typeset `NeroPay.` lockup. They are approved and in some
cases delivered. `BRAND.md` §6.3 stands: whether they are reissued is Faisal's call and a job with
its own review gate, not a side effect of this spec.

## 5. What is missing before this can be built well

From `BRAND.md` §5, the gaps that bite this spec specifically:

- ~~**No dark-on-yellow lockup.**~~ **Settled by Faisal, 22 Sep 2026: there is no dark-on-yellow,
  because there is no dark lockup going forward.** The wordmark is used in its **light or white**
  version only, on yellow or on black. So shutter down puts the light wordmark straight onto the
  yellow join — no charcoal fallback, and nothing to wait on Eray for. The two combinations in use
  are light on yellow and light on black.
  *One thing to confirm when Faisal next reads this: whether the black wordmark files in
  `brand/logos/` are retired outright, or only barred from a yellow ground.*
- **No vector.** A full-bleed yellow tile at 4K is fine because it is drawn in code, but any supplied
  artwork scaled up will soften. Keep the wordmark at or below its native 1200px.
- **Five yellows in the supplied artwork** (`#FBCB1E`, `#FCCA16`, `#FCCA17`, `#FDD315`) against the
  declared `#FFCF24`. Code draws the declared value, so a panel will read very slightly brighter than
  a placed logo beside it. Invisible in a feed; `BRAND.md` §6.1 is still open with Eray.

## 6. The rails, applied to a frame

Unchanged from `CLAUDE.md`, restated because this spec invites the breach:

- No credit or lending language, in the copy or on screen. No "unlock", no "access to funds".
- No earnings claims, and no large money figure as the dominant element of a frame.
- No terminal price and no transaction rate on screen — the internal figures conflict and it is an
  open question for Eray. The one exception is `neropay_workhorse_rate`, and only for The Maths ep 1.
- Nothing goes on screen without a `confirmed` record in `figures.json`.
- Never name a competitor in motion graphics.
- The terminal is the only branded object in frame. No cards, pens, mugs or props.
- Everything sharp. Deep depth of field, no bokeh, locked-off framing.

---

## 7. The logo sting — locked 23 Sep 2026

Faisal locked an animated logo for all future content on 23 Sep 2026. **It is not the Shutter.** The supplied
wordmark's letters converge and a glass tile carrying the N grows out of them, with no split and no seam. It
comes in three looks (yellow glass with ink bars, white glass with yellow bars, silver glass with yellow bars),
all on off-white and none with a glow. The source, nine masters and the open questions for Eray are in
`brand/sting/`, and `brand/sting/README.md` is the spec. Use the files; don't rebuild the motion. The Shutter
components above stay a spec that nobody has built.

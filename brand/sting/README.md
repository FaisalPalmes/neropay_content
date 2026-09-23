# The NeroPay logo sting

**Locked by Faisal, 23 Sep 2026:** *"let's lock them in actually, as the animated logo … for whichever content
we make in the future."* This is the animated logo for every video from here on. Built by the CONTENT VIDEO
session. Any session that makes video uses these files and does not rebuild the motion.

## What it does

The supplied wordmark (`brand/logos/neropay-light-1200.png`) holds, then its seven letters, cut from the PNG
and kept rigid (never redrawn, never reshaped), slide together and pile up. A glass tile carrying the N's two
bars grows out of the pile, one light reflection crosses the glass, and it holds.

| Time | What happens |
|---|---|
| 0.00–0.45s | wordmark holds |
| 0.45–0.92s | letters converge, accelerating |
| 0.86–0.98s | glass tile grows from the pile (30% → 100%) |
| 1.15–1.80s | one light pass across the glass |
| to 2.60s | holds on the tile |

There is no shutter in it. Faisal chose this motion over the shutter squeeze and over a mix of the two.

## The three looks

All three are on the off-white ground `#FBFAF7`, with **no glow**. Faisal rejected the yellow glow behind the
glass. The glass effect comes from the tile itself: the body gradient, a 14px rim, a top highlight, a bottom
caustic line, raised bars with a drop shadow, and the light pass.

| `v=` | Tile | Bars |
|---|---|---|
| `yellow` | yellow glass | ink |
| `white` | white glass | yellow |
| `silver` | silver glass | yellow |

Faisal has not ruled which look is the default.

## Files

- `neropay-sting-{yellow,white,silver}-{9x16,16x9,1x1}.mp4`: nine masters, 60fps, H.264, 2.6s, silent.
- `index.html`: the source. `?v=` picks the look, `?fmt=9x16|16x9|1x1` the frame, and `?bg=none` gives a
  transparent ground for compositing. `window.setTime(s)` or `window.setFrame(n, fps)` drives it, so it can be
  rendered at 25, 30 or 60fps. Nothing runs on a clock.
- `render.cjs`: `node brand/sting/render.cjs [look] [fmt]` re-renders the masters. It serves the page over
  http, because Chromium drops a CSS mask image on a `file://` page and the bars vanish.
- `bars-mask.png`: the N's bars, taken from `brand/favicon/neropay-icon-512.png` and edge-smoothed.

Geometry comes from `BRAND-MOTION.md` §2: tile radius 15.5%, bars at 46.5°, taken directly from the supplied icon.

## What a video session still owes it

- **Sound.** No NeroPay video ships silent (`video/AUDIO.md`). The masters are silent on purpose, so the sound
  sits in each video's mix. A hit at 0.92s where the letters meet, and something soft under the light pass.
- **The ground.** The sting uses the light wordmark, so it lives on light grounds. A dark-ground version would
  need the white wordmark and has not been made.
- **Intro or outro placement** is the video's call. Playing it in reverse is not approved.

## Open with Eray. It is locked for use, but these are his to answer

1. The motion cuts his wordmark into letters and moves them. They are not deformed, but it is still his artwork being taken apart.
2. `white` and `silver` recolour the symbol (yellow bars on a pale tile). `yellow` keeps his colours.
3. The glass tiles are our rebuild of the icon, not supplied artwork.

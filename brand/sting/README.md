# The NeroPay logo sting and outro

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

## The outro — locked 24 Sep 2026

Faisal, 24 Sep 2026: *"lock that in as the official logo and neropay text animation, then the animation of the logo
up is also great, the subtext under can be varied depending on the video."* He tried a slower, smoother retime
the same day and rejected it: *"this slow one is not what I wanted."* **The fast timing is the official one. Don't
slow it down.**

The outro is the sting above, frame for frame, to 1.85s. Then:

| Time | What happens |
|---|---|
| 1.85–2.45s | the tile rises by half the height of the subtext plus the gap |
| 1.97–2.52s | the subtext slides 34px down from behind the tile and fades in, so the pair ends centred |
| to 5.00s | holds |

**The subtext changes per video.** It is two lines of Poppins: a small grey line (500, 30px, `#6B6B73`) over a
bold one (600, 52px, ink). The default is *Follow for more / @neropayapp*, which Faisal picked from six options.
Pass `?small=…&big=…` to the page, or call `window.setSub(small, big)` from a composition; `small=` empty drops the
top line. Keep it to one short thing: a handle, a next episode, a site. Every rail applies. No rate, fee,
saving or earnings wording, and for paid Meta the Route C rules apply to this line too.

**`@neropayapp` is only confirmed for Instagram.** Check the handle for each platform before a TikTok or YouTube
upload carries it.


- `neropay-sting-{yellow,white,silver}-{9x16,16x9,1x1}.mp4`: nine masters, 60fps, H.264, 2.6s, silent.
- `neropay-outro-{yellow,white,silver}-{9x16,16x9,1x1}.mp4`: nine outro masters, 5.0s, silent, default subtext.
- `outro.html`: the outro source, with the same parameters as `index.html` plus `small` / `big`.
- `fonts/`: Poppins 500 and 600 (latin), vendored, because the web container blocks font CDNs.
- `index.html`: the source. `?v=` picks the look, `?fmt=9x16|16x9|1x1` the frame, and `?bg=none` gives a
  transparent ground for compositing. `window.setTime(s)` or `window.setFrame(n, fps)` drives it, so it can be
  rendered at 25, 30 or 60fps. Nothing runs on a clock.
- `render.cjs`: `node brand/sting/render.cjs [sting|outro] [look] [fmt] [out.mp4]` re-renders the masters. Set
  `SMALL` and `BIG` in the environment to render an outro with its own subtext. It serves the page over
  http, because Chromium drops a CSS mask image on a `file://` page and the bars vanish.
- `bars-mask.png`: the N's bars, taken from `brand/favicon/neropay-icon-512.png` and edge-smoothed.

Geometry comes from `BRAND-MOTION.md` §2: tile radius 15.5%, bars at 46.5°, taken directly from the supplied icon.

## What a video session still owes it

- **Sound.** No NeroPay video ships silent (`video/AUDIO.md`). The masters are silent on purpose, so the sound
  sits in each video's mix. A hit at 0.92s where the letters meet, and something soft under the light pass.
- **The ground.** The sting uses the light wordmark, so it lives on light grounds. A dark-ground version would
  need the white wordmark and has not been made.
- **Placement.** The sting is for the top of a video and `outro.html` for the end. Playing either in reverse is not approved.

## Open with Eray. It is locked for use, but these are his to answer

1. The motion cuts his wordmark into letters and moves them. They are not deformed, but it is still his artwork being taken apart.
2. `white` and `silver` recolour the symbol (yellow bars on a pale tile). `yellow` keeps his colours.
3. The glass tiles are our rebuild of the icon, not supplied artwork.

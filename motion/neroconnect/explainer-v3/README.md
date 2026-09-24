# NeroConnect explainer — v3, the rebuild on the new brand

Rebuilt 24 Sep 2026 by the CONTENT VIDEO session, at Faisal's request, from his notes on v2:

> "More on the new brand … the motion graphics could be a lot better, right now they are a bit clumsy and too much going
> on on the screen. Maybe we can keep it more minimal … the pill-shaped overlays, I don't want them at all. They could be
> more real, and liquid glass, clear liquid glass. Everything seems to have like a hard bevel edge. I don't want that."

v2 (`../explainer/`) is left as it was. This folder is the whole of v3.

## What changed from v2

| v2 | v3 |
|---|---|
| Inter, the kit's own system | Poppins, the brand face; ink `#111114`, yellow `#FFCF24` as the marker and one edge per scene |
| 3–4 things per frame, cards cropped by the frame, captions laid over cards | one headline and one glass object per frame; nothing is cut by the frame; no captions (the headline carries the line) |
| thick 14px inset rims (the "bevel"), pills everywhere | clear glass: a translucent body, a hairline rim, a bright top edge, a soft shadow, one sheen as it lands; **no pill shape anywhere** |
| three drifting coloured lights | one soft yellow light that moves to a new place each scene, and two huge clear panes drifting behind, as in the app motion |
| its own end card with socials | the locked outro (`brand/sting/outro.html`, yellow) with the NeroConnect wordmark (`?mark=neroconnect`, Faisal 24 Sep) and "Check out NeroConnect at / docs.neropay.app" as its line |

## The take

**Take 3 (v3.5, 24 Sep 2026) is the one that ships**: Olivia, `eleven_v3`, one continuous take of the whole revised script
(take 2's text and delivery tags, "minimum" for "floor", and the close "Then check out NeroConnect"), tightened
`--gap .32 --min .45 --tempo 1.03`, gated `--inset .12 --max -30`, 130.8 s. Faisal asked for it because the v3.4 splice of a
separately voiced "minimum" passage was audible. Word timings are from faster-whisper in the Higgsfield sandbox; every reveal
was moved from the v3.4 take with `retime.py`, then audited against the new words (118 anchors, all within 0.3 s of the word
that earns them). Older takes stay in `data/` (`vo-take2-*`, `seg-minimum.mp3`, `vo_words-v34.json`) and are not used.
`data-at` in `index.html` is seconds on the film's timeline, and the take starts at 0.6 s.

## Two gates run before every render

- `check-still.cjs`: once landed, no headline moves (the v3 jitter).
- `check-layout.cjs`: every card and headline sits inside the frame with a 40 px margin, no two cards overlap, nothing covers
  a headline or the corner mark (`data-layered` marks a card stacked on purpose). Added after v3.4 shipped with flashed cards
  knocked out of place: the flash's `[data-hit]{position:relative}` overrode the cards' absolute placement.

## Files

- `index.html`: the whole film as one page, sixteen scenes, driven by `setTime(t)`. It is deterministic, with no clock.
- `render.cjs`: renders the frames (25 fps), splices in the outro from `OUTRO_AT` (127.4 s), runs both gates first, writes `data/mix.json`
  from the page's own timings, runs `motion/mix.mjs`, then muxes. `--preview` renders at 720p; `--from/--to` renders a slice.
- `stills.cjs`: review stills at given times.
- `data/mix.json`: generated. The bed is `neroconnect-pulse-100` (already in the ledger) at 0.17, ducked under the
  voice. The cues are a soft tick per glass card, a short air on each scene change, and the sting's hit and sparkle.
  Mastered to −14 LUFS.

## Figures on screen

Only the seven approved in the 18 Sep kit, plus the dashboard's count of two items needing attention:

| Figure | Where | Source |
|---|---|---|
| 37 | merchants live, s3 | kit `v2-tilted-panel` |
| £1,842.60 | taken, s3; payments, s12 | kit `v3` / `m18` |
| £41.20 | your fee, s8, s12 | kit `v4-cascade` |
| £22.85 | NeroPay's cost, s8, s12 | kit `v4-cascade` |
| £18.35 | your margin, s3, s8, s12 | kit `v4-cascade` |
| £2,418.36 | available balance, s14 | kit `m18` |
| 2 | needs you today, s3 | v2 dashboard |

No rate, no percentage, no support price, no date. Merchant and platform names are the invented set in
`../explainer/data.json` (Harbourline Ltd). The deadlines in s4 ("Respond in 3 days" and so on) are invented and relative.

## Open, for Faisal

1. **The series note versus this film.** `../CLAUDE.md` (17 Sep) bars margin figures, reports and support tiers. The
   18 Sep brief allows them, and Faisal's 24 Sep script carries all three. So the later ruling stands for this film,
   and the series note should say so.
2. **One line in the take:** "so you can never lose money on a service." It is true of the price floor, but "never lose
   money" is the register rail 2 watches for, and it would not survive a paid-Meta review. On screen the scene says
   "You can't set it below NeroPay's cost" instead. Re-voicing that one line would cost a short take.
3. **The take says "your merchant see your brand"** (a slip in the 18 Sep read). It is audible but minor.
4. Cut-downs (9:16, 1:1) have not been made. The layout keeps the text inside the frame's middle, but these would need their own pass.

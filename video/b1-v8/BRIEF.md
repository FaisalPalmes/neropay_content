---
workflow: general-video
flow: companion
storyboard: no
message: "The rate you were quoted is the debit rate; every other card costs more, and you don't choose which one comes out"
destination: youtube
aspect: 1920x1080
language: en
length: ~2:44
angle: explainer-recut
---

## Intent

v8 (11 Sep 2026, Faisal's review of v7.1): the v6 liquid-glass overlays back — the glass panels that show the footage
through themselves, the animated bar charts, the large 0.5% struck through on "not" — on v7's angle-cut proxies and
cut, with v7's grow-from-the-centre title re-themed light (near-white ground, diffused yellow blooms, black type,
"NeroPay" with a yellow full stop that pops in) and an end card in the same style. The paragraph below is v7's.


The B1 master re-edited on `../../MOTION-SYSTEM.md` — three camera angles cut from the 4K takes,
the seven overlay archetypes, the BUILD → HOLD → EXIT law asserted in `build.mjs`, real alpha
instead of glass sampled from the footage. Faisal's brief for this pass, verbatim where it
matters: landscape for YouTube; all the clips from the Drive folder; the new overlays in the
spec's format and look; the intro screen animates into full screen from the middle of the
frame with an animated background and animated text, engaging throughout; sound effects
slightly lower than the last edit.

## Assets

- assets/clips/B1-01..18.mp4, B1-INTRO.mp4 — one 1080p proxy per take, already cut to its angle by `sandbox.sh` (placeholders here)
- data/words.json — Whisper word timings from the real audio (unchanged from v6)
- data/angles.json — the angle per shot, decided at build time
- data/edit.json — hand trims; `tail` keeps more air after a line where an overlay needs its hold
- assets/sfx/*.m4a — the Freesound set from `../library/sounds.json` (placeholders here)
- assets/fonts — Inter 500–800 for every overlay, Poppins for captions and the wordmark

## Notes

- Rails: no NeroPay rate or terminal price presented as NeroPay's; the 0.70% flat figure is the pack's illustrative comparison and every panel that carries a figure says so. No AI wording inside the video (Faisal, 9 Sep 2026 — the conflict with MOTION-SYSTEM.md §9 is logged in root `CLAUDE.md` and left for him).
- `../b1-rate-you-were-quoted/` is v6, the previous master, kept as the reference for the vertical and ad cuts.

---
workflow: general-video
flow: companion
storyboard: no
message: "The rate you were quoted is the debit rate; every other card costs more, and you don't choose which one comes out"
destination: youtube
aspect: 1920x1080
language: en
length: ~47s (five of eighteen shots rendered so far)
angle: explainer-recut
---

## Intent

Re-edit of B1 "The rate you were quoted" (Explained by NeroPay) from the Higgsfield presenter clips,
replacing the Remotion cut. Faisal's brief, verbatim where it matters: captions with no background,
"nice and sleek", the spoken word highlighted in yellow, Poppins with tight letter-spacing, italics
when applicable; every overlay and asset in an Apple-style liquid-glass 3D treatment; "nice
animations to explain things in simple terms when applicable"; zoom in and out to focus on key
details; pan in and out at different stages so it is not one flat same-looking video.

## Assets

- assets/clips/B1-01..05.mp4, B1-INTRO.mp4 — the presenter takes (real files live on the Higgsfield CDN; local copies are placeholders until the sandbox render)
- data/words.json — Whisper word timings from the real audio
- data/edit.json — hand trims (B1-05 starts at 1.55 s: the first take of the line stumbled)
- assets/sfx/*.wav — the synthesised whoosh / rise / tick / pop from the Remotion edit
- assets/fonts/poppins-*.woff2 — Poppins 500/600/700/800 + 700i/800i

## Customizations

- Virtual camera on a single world wrapper (viewport-change): slow push / pull per shot, alternating direction; punch-ins on the key figure of each overlay with counter-translation so the figure lands centre-frame; captions sit outside the camera and never soften.
- Liquid-glass panels: blurred, saturated backdrop, inner specular edge, travelling sheen, perspective tilt on entry and a slow float while up.
- Explanatory graphics: struck-through "0.5%?" chip (hook), one card fanning to four (statement), advertised-rate table with the debit row lit (B1-03), rate ladder bars rising in time with the words (B1-04), the customer's card fan with one card pulled forward (B1-05).
- Captions: Poppins 600, -0.035em, no plate; upcoming words dim white, spoken word #F5C518 with a small pop, spoken-past words white; numbers and the series' emphasis words italic 800.

## Notes

- Hard rails: no terminal price, no transaction rate for NeroPay itself, no earnings claims; the advertised-rate figures are the generic card-type rates already in overlays.js. AI-presenter disclosure in the first three seconds.
- No music bed (none in the series; add on request). Clip audio only plus the four SFX.
- Shots B1-06..18 are not generated yet; the sequence skips missing clips.

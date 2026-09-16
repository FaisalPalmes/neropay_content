# Hyperframes Composition Brief: NeroPay Content Warehouse

## Objective
Create a short, polished launch-style brag video for the NeroPay Content Warehouse site.

## Output
- Composition directory: `video/brag-output/composition/`
- Rendered video: `video/brag-output/brag.mp4`
- Format: landscape — 1920x1080, 30 fps
- Duration: 21 seconds

## Source Material
- Project root: repo root (`index.html`, `style.css`, `README.md`, `posts.js`, `videos.js`, `calls.js`)
- Product name: NeroPay Content Warehouse (lockup on the site: `Nero<i>Pay</i> · Content`)
- Tagline / strongest claim: "Everything NeroPay publishes, in one place."
- Key UI or visual moment to recreate: the six-page hub (section 00, "Where things are") and the hero stat strip
- Copy that must appear verbatim:
  - "Everything NeroPay publishes, in one place."
  - "Content warehouse · September 2026"
  - "Where things are"
  - Social posts · YouTube series · Ideas · Assets · Calendar · Rails
  - "What to post, when, and what they must never say."
- Counts from the data files: 18 posts, 12 videos across 3 series, 16 weeks, 10 hard rails

## Creative Direction
- Tone preset: polished
- Creative direction: a quiet internal-tool film
- Interpretation: four scenes, slow reveals, soft 0.6 s crossfades, one idea per scene, no lists
- Angle: the site's own claim, shown
- Hook: the headline at full scale, two lines, kicker above
- Outro / punchline: the lede's last clause, then the wordmark and tagline, then silence
- Avoid: generic SaaS language, abstract filler, anything not on the site

## Visual Identity
- Background: #0E0E10 · surfaces #16161A / #1C1C21 · rule #24242A
- Text: #F4F3F0 · secondary #B8B6B1 · muted #7D7B84
- Accent: #F5C518 · soft rgba(245,197,24,.11)
- Display font: Chivo 500/700/900 (`assets/fonts/chivo-latin-*.woff2`)
- Body font: Source Serif 4 400; labels and numbers Martian Mono 400/500 — all local woff2, no CDN
- Runtime: GSAP 3.14.2 from `assets/vendor/gsap.min.js` — never a CDN in this container

## Storyboard
Use the storyboard in `brag-plan.md` as the creative contract.
1. Hook — 5.0 s — kicker, headline in two lines, yellow rule
2. The six pages — 5.5 s — six cards, one every 0.5 s, hold
3. The numbers, and the switch — 6.5 s — four count-ups; EN/TR toggle flips
4. Outro — 5.0 s — one sentence; wordmark + tagline; silence

## Audio
- Audio role: sparse professional accents; no music bed (none licensed and reachable in this session)
- Audio arc: one soft impact → six card slides → a drop and a click → one bell → silence
- SFX files (Kenney CC0, copied to `assets/sfx/`): impactSoft_medium_001, card-slide-1 ×5, card-place-1,
  impactSoft_medium_003, drop_001, impactBell_heavy_000
- Levels: accents 0.14–0.22, the bell 0.26; master to −14 LUFS / −1.5 dBTP after render

## Delivery
- `npx hyperframes check` clean, then draft render for review, then `--quality high`
- loudnorm pass with ffmpeg, poster frame from the wordmark beat baked as frame 0, `share-copy.txt`

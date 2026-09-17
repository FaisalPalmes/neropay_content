# Social creative brief — the look, the type, the content, the route

Written 17 Sep 2026 for the social session. This is the standing brief for every social creative
NeroPay makes from here on: what it looks like, what it says, and how it gets made inside Claude
Code without waiting on anyone. It sits beside `SOCIAL-HANDOVER.md` (the job) and `CLAUDE.md` (the
rails). Where this brief and the charcoal card drawer in `overlays.js` disagree on the look, this
brief wins — the drawer is the old look and stays only as the on-site preview until it is re-skinned.

Everything in §1–§3 comes from Faisal's rulings of 11–12 Sep 2026 on the B1 v8 build
(`video/PLAYBOOK.md` §10–12, `MOTION-SYSTEM.md` v3 section, `video/b1-v8/build.mjs`). The values are
lifted from that build so a social card and a video end card are visibly the same object.

---

## 1. The look — light glass

**Default stage is light.** Near-white ground, black type, soft yellow light behind a frost, and
frosted-glass slabs carrying the content. Faisal, 11 Sep: "theme it light — white background with the
yellow subtle diffused blur as if it's blurred glass, black text, NeroPay in black with a yellow dot at
the end."

| Element | Value | Note |
|---|---|---|
| Ground | `#fbfaf7` | Never pure white. Never grey. |
| Ink | `#141416` | Headlines, the wordmark, body |
| Kicker | `#6d6c68` | Uppercase, `letter-spacing: 0.36em`, 600 |
| Secondary line | `#4d4c48` | Italic 500 — an episode line, a sub |
| Accent | `#F5C518` | The full stop, one value, one rule, the blooms. Nothing else. |
| Bloom 1 | `radial-gradient(circle, rgba(245,197,24,.50), rgba(245,197,24,0) 62%)`, ~1200 px, `filter: blur(90px)`, off the top-left | Static. A blurred element never moves. |
| Bloom 2 | same, `.38`, ~1300 px, off the bottom-right | |
| Bloom 3 | white, `rgba(255,255,255,.9)` → 0, ~700 px, centre-low | Lifts the middle so type sits on near-white |
| Frost over the blooms | `linear-gradient(135deg, rgba(255,255,255,.55), rgba(255,255,255,.18) 50%, rgba(255,255,255,.42))` | The "blurred glass" — the yellow reads through it, never on top of it |

**Light glass slab** (`.lglass` in the v8 build) — the object that carries a stat, a quote, a card:

```css
.lglass{
  border-radius:36px; overflow:hidden; isolation:isolate;
  background:linear-gradient(135deg,rgba(255,255,255,.80) 0%,rgba(255,255,255,.62) 50%,rgba(255,255,255,.74) 100%);
  box-shadow:0 40px 90px rgba(20,20,22,.10),0 8px 24px rgba(20,20,22,.06);
}
.lglass .tint{position:absolute;inset:0;
  background:radial-gradient(120% 80% at 10% 0%,rgba(255,255,255,.7),transparent 55%),
             radial-gradient(70% 60% at 100% 100%,rgba(245,197,24,.16),transparent 60%)}
.lglass .rim{position:absolute;inset:0;border-radius:inherit;
  box-shadow:inset 0 2px 0 rgba(255,255,255,1),inset 0 0 0 1px rgba(255,255,255,.9)}
.lglass .sheen{position:absolute;top:-20%;left:0;width:45%;height:140%;
  background:linear-gradient(105deg,transparent,rgba(255,255,255,.1) 35%,rgba(255,255,255,.55) 50%,rgba(255,255,255,.1) 65%,transparent)}
```

A slab has four layers in this order: tint, sheen, body, rim. On a still the sheen is parked at
about 30% across; in motion it passes once on the cue. The yellow in the tint's corner is the only
yellow inside a slab unless a value is set in yellow.

**Dark stage — allowed, not default.** Charcoal `#141416` ground, white type, "Nero" white and
"Pay" yellow. Use it when the creative sits *over footage* (a Reel with glass panels, a street photo
with a caption plate) or when Faisal asks for it. The dark glass is the v8 `.glass`: a blurred copy of
the image under it (`blur(30px) saturate(1.3) brightness(.5)`), `rgba(26,26,30,.30)` fill, a white
tint gradient at 7–17%, a 1.5 px top rim at 55% white, shadow `0 30px 60px rgba(0,0,0,.26)`.

**The wordmark, both stages.**

- Light: **NeroPay** in ink, Poppins 800, `letter-spacing: -0.05em`, followed by a yellow full stop
  0.17 em wide with 0.04 em gap. Not "Pay" in yellow — that is the dark rule.
- Dark: **Nero** white, **Pay** yellow, same weight and tracking, no full stop.
- Always bottom-left on a card, 40–48 px at 1080 wide. Never centred on a card unless the card *is* the
  wordmark (a title or end frame).
- In motion the seven letters rise one after another (`y: 72 → 0`, 0.5 s, `power4.out`, stagger 0.04),
  the word settles (`scaleX 1.035 → 1`), the full stop pops in on `back.out(2.4)` over ten frames and takes
  one shallow breath. No clip-path near it — it cuts the descender of the y (LESSONS #69).

**What the look is not.** No flat dark panels, no hairline boxes, no numbered spec tables, no bevel, no
gradient fills on type, no glow for its own sake, no motion blur, no bokeh, no props, no stock. The
blooms are the only soft thing in the frame; everything else is sharp.

## 2. Type

**Poppins carries the brand.** Wordmark, headline, values, labels — always Poppins, 500–800, tight
tracking (`-0.03em` on headlines, `-0.05em` on the wordmark, normal on labels). Committed at
`video/b1-v8/assets/fonts/` as woff2 (500/600/700/800 plus italics). Never from Google Fonts or a CDN.

**One editorial secondary per creative, chosen by what the card is doing.** Committed at
`video/brag-output/composition/assets/fonts/`:

| Secondary | When | How |
|---|---|---|
| **Source Serif 4** 400 | A quote card, a long-read carousel body, a concession line, anything that should read as said rather than shouted | Body at 38–44 px on a card, `line-height: 1.3`, ink or `#4d4c48`. Never for a figure. |
| **Martian Mono** 400/500 | The "correct as of" line, a source, a date, a card counter, a small table of figures | 22–26 px, `letter-spacing: 0.06–0.14em` on labels, `font-variant-numeric: tabular-nums` on numbers. This is the warehouse's own label face, so it ties the card to the site. |
| **Chivo** 700/900 | A one-word editorial hit on a Street post ("Counted.") when Poppins would look like a product | Sparingly — at most one line on the card, never the wordmark |

Rules: Poppins plus at most one secondary. The wordmark and the headline are never in the secondary.
If a card needs a third face, the card has two ideas on it — split it.

Sizes at 1080 wide, for reference: headline 76–96 px (three lines maximum), a figure 150–320 px by
its length (three characters 320, six 220, twelve 150), body 38–44 px, label 22–28 px, wordmark 40–48 px.
Margins 90 px (100 px on 9:16).

## 3. Layout — one idea per frame

| Size | Pixels | Use | Safe zones |
|---|---|---|---|
| `sq` | 1080×1080 | LinkedIn image, Instagram/Facebook feed | 90 px margin |
| `pt` | 1080×1350 | Meta feed (the taller crop wins the feed), LinkedIn image | 90 px margin |
| `st` | 1080×1920 | Reels, Stories, TikTok, YouTube Shorts | Keep type out of the top 250 px and bottom 320 px — the platform UI lives there |

Fixed furniture on every card: kicker top-left (pillar or series, uppercase, `#6d6c68`), the source or
date line bottom-right in Martian Mono when the card carries a figure, the wordmark bottom-left. The
content sits on a light-glass slab in the middle two-thirds, or directly on the stage when the card is
a single big line.

Hierarchy: the eye lands on one thing. A figure, a line, or a photograph. Everything else is a size
down. If two things are fighting, one of them is a second card.

## 4. The creative archetypes for social

Each one is an HTML template (§6). What it carries and the rule that governs it:

| Archetype | What it is | Governing rule |
|---|---|---|
| **Stat** | One figure on a slab, one line under it, source and date | A money figure is never the big element. `51% → 16%` yes; `£308.46` no; `£1,200 a year` no, however true. Rail 2. |
| **Bars** | Two to four horizontal bars, the one the post is about in yellow, the rest grey `#c9c7c1` | The v8 animated bars, stilled. Labels in sentence case. A competitor bar carries its date. Never a NeroPay rate as a bar. |
| **Strike** | A large quoted figure with the yellow line drawn through its middle, at −6°, the correction beside it | "0.5%?" is the B1 hook. The line passes through the *middle* of the figure whatever the font metrics (v8.3). A quoted rate is a competitor's or a specimen's, never ours. |
| **Quote** | One sentence from the post, Source Serif 4, the post id small under it | Optional on a text-only post — the post is text first. A concession line makes the best quote card. |
| **Carousel** | Title card (bigger heading) + n cards, each a slab, `n / total` top-right in mono, `next` cue on all but the last | Body under 25 words a card. Concede on the last card. Instagram: up to 10 images. LinkedIn: one PDF (§5). |
| **Statement** | An excerpt of the specimen statement, fictional provider, three or four lines, the one the post is about highlighted | Specimen only, never a real statement (rail 7). The pack's figures reconcile to £308.46; take the lines from `overlays.js` `STATEMENT/TIERED`. |
| **Street photo** | Faisal's real photograph, full-bleed, a dark-glass caption plate in the bottom third, wordmark on the plate | The photograph is real and untouched — no grade that makes it look shot on purpose. No AI street, shopfront, merchant or customer. Ever. |
| **Product still** | The terminal on a counter, deep focus, no props, the light stage as the ground | Higgsfield `generate_image` is acceptable here and only here when there is no photograph. The terminal is the only branded object. No price on the screen it shows. |
| **Cover** | The first frame of a Reel: kicker, a three-line headline, the wordmark landing | `ai: true` tag only for Behind the Counter. Explained-series covers carry no AI wording — the disclosure is at upload (rail 4, Faisal 9 Sep). |
| **Title / end** | The v8 light stage as-is: blooms, frost, wordmark with the full stop, kicker, italic line | Copy it from `video/b1-v8/build.mjs`, don't redraw it. The end card carries the concession line. |

## 5. What goes with the creative — the content brief per post

A post is not ready because a PNG exists. Every post ships as a set:

1. **The caption**, verbatim from the post's `copy` in `posts.js`. LinkedIn up to about 1,300 characters
   before the fold hides it — the first two lines are the post. Instagram cuts at 125 characters in the
   feed; the first line is the post. No hashtag piles; one or two plain ones at most, or none.
2. **The creative files**, named `<post id>-<n>.png` (carousel cards `<post id>-<n>-<card>.png`), at the size
   the channel wants. LinkedIn carousels are *document* posts: the cards go into one PDF, 1080×1350 pages,
   and the PDF is the file. Instagram and Facebook take the PNGs as a multi-image post.
3. **Alt text** for every image: a plain description of what is on it, no figures, no finance words.
   "A light card with one statistic about hospitality confidence and the NeroPay wordmark."
4. **The disclosure line** for the description when a synthetic voice or presenter is in the piece, and a
   note to tick the platform's synthetic-content setting. Per upload, per language.
5. **The schedule line**: channel, date, the slot (field-day posts go up the same evening; Statement posts
   Mon or Wed morning; Partner posts on LinkedIn Tue–Thu before 9).
6. **One sentence to Faisal** saying what it is and what they have to do.

The copy rules that bite (the full list is `CLAUDE.md`): "we" never "I"; product-led, third person, no
personal-attributes phrasing; no credit, lending, finance, cash-advance words anywhere including alt
text; no earnings claims; no price, no rate; concede a case in every educational post; every competitor
figure carries its date; nobody named — not Faisal, not a merchant without signed consent, not Elif.

## 6. The route — everything inside Claude Code

The principle: the session makes the finished file itself, from HTML, on the light stage, and only reaches
for an image model when the archetype says so (product still) and Faisal has no photograph.

**Templates.** One HTML file per archetype in `social/templates/`, using the §1 CSS, fonts by relative path
to the committed woff2 files, and a `data-post` hook so a small renderer can fill them from `posts.js`.
Build them once, in the v8 style, and the session never designs a stat card again — it fills one.

**Renderer.** `social/render.mjs`: load `posts.js`, for each post with an `assets` field pick the template
by `t`, fill it, open it in Playwright's Chromium (`/opt/pw-browsers/chromium-1194` in a cloud session,
Playwright 1.56 is installed globally), screenshot at the card's exact pixels with `deviceScaleFactor: 1`,
write `social/out/<post id>/<file>.png`. Carousels for LinkedIn additionally go through one PDF pass
(`page.pdf` on a 1080×1350 page per card, or ffmpeg/ImageMagick if simpler). `social/out/` is git-ignored;
the templates and the renderer are committed.

**Keep `assets` as the data.** The post's `assets` entries stay exactly as `README.md` documents them, so
`social.html` keeps previewing them in the old charcoal drawer and the renderer reads the same object for
the light-stage file. One source, two outputs. Re-skinning the on-site drawer to the light look is a
design change to `overlays.js` — propose it, don't do it unasked.

**Review before delivery.** Render a contact sheet of every card at half size and look at it before sending
anything: wrapped headline colliding with a rule, an orphaned last word, a figure that is money and too big,
the wordmark's dot missing, a bloom that moved, the sheen sitting over the type. Faisal caught two of these
on the `/brag` run that `check` did not (LESSONS #73). The sheet is not optional.

**Motion.** A card that moves — a stat count-up, a Reel cover with the wordmark landing, a bars hit — is a
HyperFrames piece in `video/<name>/`, built from the same templates and the v8 motion vocabulary: bars land
with a small `back.out` overshoot, figures count up on a tweened object, panels lean ±7° toward the centre
of the frame on their cue, everything on a 30 fps grid, sound per `video/AUDIO.md`, never silent. Pure
graphics render in the container in under a minute; anything on real footage renders in the Higgsfield
sandbox.

**When an image model is allowed.**

| Need | Route |
|---|---|
| Product still, no photo exists | Higgsfield `generate_image` — light stage, terminal only, no props, deep focus, then composed into the template |
| Voiceover for a Reel | ElevenLabs connector, `creative_list_voices`, one British voice kept for the series |
| A street, a shopfront, a merchant, a customer, a hand, a till | **No.** Real photograph or the post waits. |
| A "before/after" statement, a receipt, a dashboard | **No.** The specimen statement in `overlays.js` and nothing else (rail 7). |

## 7. Do / don't, for the wall

**Do**
- Light stage, black type, yellow through frost.
- One idea, one figure, one line.
- Poppins for the brand, one secondary for the register.
- Date every competitor number. Concede on the last card.
- Real photographs, untouched.
- A contact sheet before a file goes to Faisal.

**Don't**
- A money figure as the big thing.
- "Pay" in yellow on a light stage, or a full stop on a dark one.
- A blurred element that moves. A glow that isn't a bloom. Bokeh.
- A price, a rate, a finance word, a merchant's name, Faisal's name.
- AI-generated people or places.
- A third typeface.

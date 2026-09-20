# NeroPay brand — the 19 Sep 2026 identity

Eray issued a new brand kit on 19 September 2026. It is committed whole at `brand/`, with Eray's own
readme kept as `brand/ERAY-READ-ME.md`. **This file supersedes the brand paragraph in `CLAUDE.md`, the
palette in `SOCIAL-BRIEF.md` §1 and the light-stage values in `MOTION-SYSTEM.md` v3.** Where any older
file still says "Nero in white, Pay in yellow" typeset in Poppins, that file is out of date.

Every value below was measured from the supplied files, not copied from the readme. Where the
artwork and the readme disagree, both numbers are given, because the disagreement is real and Eray
needs to settle it (§6).

---

## 1. The wordmark

The wordmark is now **lowercase `neropay`**, set in a rounded geometric letterform with a single-storey
`a` and a straight-tailed `y`. `nero` takes the dark or light value, `pay` takes the yellow. There is
**no full stop**. It is supplied artwork in four versions, and Eray's rule is explicit: it is not a font
to recreate.

| Version | File | Use on |
|---|---|---|
| Light | `brand/logos/neropay-light-*.png` | white and very light grounds. `nero` charcoal, `pay` yellow, thin dark contour around both |
| Dark | `brand/logos/neropay-dark-*.png` | charcoal and dark grounds. `nero` white, `pay` yellow |
| Black | `brand/logos/neropay-black-*.png` | one colour, dark |
| White | `brand/logos/neropay-white-*.png` | one colour, light |

Sizes 320, 640, 1200 and "large" as PNG; 640 as WebP in `brand/web/`. Aspect is about **5.48 : 1**
(1200 × 219). Clear space is half the height of the `o` on every side. Never stretch, rotate, recolour,
filter, or rebuild it in type.

**In running text it is still `NeroPay`**, capital N, capital P. The lowercase form is the logo only.

## 2. The symbol

A yellow rounded square with a diagonal-slash `N` knocked out in charcoal. `brand/favicon/` carries
16 / 32 / 48 / 64 / 180 / 192 / 256 / 512 px plus `favicon.ico` and `apple-touch-icon.png`; both are
copied to the repo root and linked from every page. `brand/linkedin/neropay-company-logo-dark-*.png`
is the same symbol on charcoal at 400 and 1080, safe for a circular crop.

## 3. Colour

| Token | Value | Notes |
|---|---|---|
| NeroPay Yellow | `#FFCF24` | the readme's declared value, and what we use in code |
| Ink | `#111114` | type and dark grounds |
| Charcoal | `#151519` | the darker ground, e.g. the LinkedIn square |
| White | `#FFFFFF` | |

The new yellow is the **same hue** as the old `#F5C518` (46.8° against 47.0°) and about 8% brighter,
so nothing in the existing layouts changes shape. It is still a warm gold, not an acid lime.

**Yellow is never type on a light ground.** `#FFCF24` on `#F7F6F3` is 1.42:1. The site already solves
this with a darkened accent (`--yl`) for light mode, and that stays. On ink, `#FFCF24` reaches 12.75:1
and is safe for large figures and rules.

## 4. Where the values live in code

| Surface | File | Token |
|---|---|---|
| The site | `style.css` `:root` | `--yl` (light, darkened for contrast), `--yl` under `[data-theme="dark"]`, `--yl-soft`, `--yl-line` |
| Social cards | `social/templates/stage.css` | `--y`, `--ink` |
| The site's drawn creative | `overlays.js` | `var Y`, `var INK` |
| Sketch wireframes | `app.js` | inline fills in the statcard sketch |
| Video | `video/b1-v8/build.mjs`, `motion/lib/*`, each episode's `index.html` | `const Y`, `INK` |

Change the token, never a literal.

## 5. What the kit does not contain

Worth knowing before a job depends on it. None of these is a fault in the artwork; they are simply
not in the box.

- **No vector.** PNG, WebP, JPG and ICO only. Eray's readme says so directly and adds that large-format
  print needs separate vector artwork. This has three consequences for us:
  1. `overlays.js` currently draws the wordmark as SVG text and can no longer be correct. Video and
     card furniture has to place the supplied PNG instead.
  2. The letter-by-letter wordmark animation in `video/b1-v8/build.mjs` cannot be rebuilt from raster.
     A raster wordmark can fade, rise, scale or wipe as one object, but the letters cannot move
     independently. See §6.
  3. Any print job — a pull-up banner, a vehicle graphic, a shop sticker — is blocked until vector exists.
- **No font file.** The letterform cannot be extended to a new word. There is no way to set "NeroConnect",
  "NeroPOS" or "Flex" in the logo face. Those stay in Poppins as they are now.
- **No Instagram assets.** No 320 × 320 profile crop and no story-safe lockup. Instagram and Facebook are
  where merchants are, so this is the gap that bites soonest. The 1080 LinkedIn square crops to a circle
  acceptably in the meantime.
- **No YouTube assets.** No 2560 × 1440 channel art, no thumbnail lockup. YouTube is the production
  channel the whole social plan distributes from.
- **No terminal artwork.** Nothing showing the mark as it appears on the Flex's shell or screen.
- **No dark-on-yellow lockup**, which is what a yellow-ground card or a sticker would need.

## 6. Open questions for Eray — do not resolve these locally

1. **The artwork does not match its own colour spec, and is not internally consistent.** Measured from
   the supplied files: the light wordmark is `#FCCA16`, the dark wordmark `#FCCA17`, the app icon
   `#FBCB1E`, the LinkedIn square `#FDD315`. The readme declares `#FFCF24`. That is five yellows. The
   inks differ too: `#0C0C0E` in the light wordmark, `#100F11` in the black one, `#161519` in the
   LinkedIn square, against a declared `#111114` and `#151519`.
   We have taken the **declared** values as authority, so a yellow rule drawn in code will read very
   slightly brighter than the supplied logo beside it. Nobody will catch it in a feed; a printer will.
   Ask Eray for artwork that matches the spec, ideally as vector.
2. **The yellow full stop is gone.** Faisal chose it on 11 Sep 2026 — "NeroPay in black with a yellow
   dot at the end with a very subtle animation" — and it is built into `MOTION-SYSTEM.md` v3, the B1
   master's title and end stages, and every social card's furniture. The new kit has no full stop. Two
   readings: the dot was a device belonging to the old typeset wordmark and retires with it, or it stays
   as a motion signature beside the new artwork. **Faisal decides.** Until then the cards and the
   templates carry the new wordmark without the dot, and the finished video masters are untouched.
3. **The finished videos now carry an old logo.** The B1 master, the NeroConnect explainer, The Maths
   episode 1 and the partner pieces all end on the typeset `NeroPay.` lockup. They are approved,
   rendered and in some cases delivered. Re-rendering every end card is a real job with a review gate,
   not a find-and-replace. Faisal decides whether they are reissued, and when.
4. **The light wordmark carries a contour.** A thin dark outline around both words, which is why the
   light and dark versions are not the same artwork recoloured. At feed thumbnail size that outline
   fills in and the letters thicken. Prefer the dark version on a dark card wherever there is a choice.

## 7. What changed in this repo on 19 Sep 2026

- `brand/` added: the kit whole, plus Eray's readme as `brand/ERAY-READ-ME.md`.
- `favicon.ico` and `apple-touch-icon.png` at root, linked from all seven pages. The site had no
  favicon at all before this.
- Yellow `#F5C518` → `#FFCF24` and ink `#141416` → `#111114` in `style.css`, `social/templates/stage.css`,
  `overlays.js` and `app.js`. The light-mode darkened accent moved to the new hue.
- The social card templates place `brand/logos/neropay-light-640.png` instead of typesetting the
  wordmark in Poppins.
- `video/` and `motion/` were **not** touched. Those are finished, approved renders and another
  session's live work; §6.3 is the decision that governs them.

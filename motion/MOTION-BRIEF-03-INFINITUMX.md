# Brief 03 — InfinitumX (Pigeon) → NeroPay retune

**Source:** *Top 10 Animated Motion Graphics Videos made in After Effects* — chapter 9, 7:57–9:18 (~81s)
**Studio:** Pigeon
**Analysis:** ~40 frames at ~0.4s intervals across the segment. No audio.
**Retuned to:** NeroPay white + yellow (see `neropay-motion-reference.md` §1 for tokens).

---

## 1. What this is, and an honest warning

**Flat-vector character animation.** Bold characters, geometric props, vivid gradient meshes, glitch transitions, and an isometric world section. No 3D rendering, no depth of field, no camera — depth comes entirely from overlap and scale.

**This is a different system from the Webflow one, not an extension of it.** Webflow is calm, premium, slow, dimensional. This is playful, graphic, fast, flat. Both are good. **Mixing them in one video will look confused.** §8 covers when to pick which.

That said — **this is the most directly useful segment in the whole video for NeroPay.** It's the only one that actually animates *money concepts*: price tags, a "TAXED" stamp, cost comparison, an anthropomorphic coin. That's your subject matter, and the Webflow system has no vocabulary for it.

---

## 2. Section breakdown

The piece moves through five distinct worlds.

### 2.1 Dark fold (≈7:57–8:05)
Near-black ground. A **folded plane** — like an open book or creased card — with a vivid gradient mesh on its inner faces. It rotates slowly; the crease catches the two faces at different angles so they read as differently lit. Thin-outline geometric shapes and small purple blocks float around it.

### 2.2 Glitch break (≈8:05–8:12)
**Datamosh / glitch transition.** Horizontal streak-tearing, RGB channel split, scan-line displacement. The gradient mesh shreds into horizontal bands.

Then large, widely letter-spaced thin letterforms ("...n i t u m...") sweep through with glitch streaks behind them.

### 2.3 Flat character scene (≈8:12–8:32)
Dark ground. A pink/lilac figure with a striped body **carries a large gradient-mesh canvas**, walks with it, then releases it — the mesh blooms upward like smoke.

Around it: an anthropomorphic **dollar coin character** with top hat and moustache, a pink mask/smile shape, purple grid blocks, thin-outline rectangles, small connector lines. Everything is flat fill with hard edges.

### 2.4 Light UI scene (≈8:32–8:52)
Register flips: **pale ground**. A phone mockup with a social post, a character inside whose expression changes, and a large **orange cursor** that taps it. The gradient mesh reappears and **squashes and stretches elastically** into a pill shape. Small radiating line-bursts mark each impact.

### 2.5 Isometric platform world (≈8:52–9:18) ★ the valuable one
Dark ground. A field of **floating isometric diamond platforms** — gradient tops, some plain, each with a **thick coloured edge band** on its leading side. Tiny characters stand on them.

**Price badges** appear as flat labels: `$21.00`, then `$42.00`, then a `TAXED` stamp slamming down. A **giant hand and forearm** reaches in from off-frame and stamps a platform — enormous scale contrast against the tiny figures.

---

## 3. The six techniques

### 3.1 Scale contrast ★ biggest idea
Tiny figures on platforms; a giant hand reaching in. The size difference does the emotional work — it says *this is being done to them*, with no copy at all.

Directly applicable: fees, charges, a competitor's pricing, regulation landing on a small business. It's a payments-industry metaphor that draws itself.

### 3.2 Isometric platform field
Floating diamonds with gradient tops and **thick coloured edge bands**. That edge band is the detail — it gives each platform physical thickness and stops the isometric world looking like flat wallpaper.

Platforms at varying heights, some near, some far, with generous dark space between. Reusable as a general "marketplace / network / merchants" environment.

### 3.3 Floating value badges
Flat rounded labels carrying numbers, arriving with a stamp impact. `$21.00`, `$42.00`, `TAXED`.

This is the single most transferable component for NeroPay — transaction values, fee comparisons, savings, rate changes. It's exactly the `StatReveal` gap I flagged in `motion-graphics-brief.md` §11, solved with a device that has personality.

### 3.4 Elastic gradient mesh
A soft rainbow mesh rectangle that deforms — squashing into a pill, blooming upward like smoke, being carried as a physical object.

It's a *recurring character* in the piece, standing in for "value" or "content". Having one abstract object that recurs and deforms gives a film continuity without narration.

### 3.5 Glitch / datamosh transition
Horizontal tearing, RGB split, scan-line displacement. Short and violent.

Useful, but see §8 — it clashes hard with NeroPay's trust register. Use sparingly if at all.

### 3.6 Impact spark marks
Small radiating line-bursts at every collision — a tap, a stamp, a landing. Three to five short lines, one frame or two, then gone.

Almost invisible individually, but they're what makes flat animation feel like it has weight. Cheap and high-impact.

---

## 4. NeroPay retune

The source is dark-dominant with rainbow saturation. NeroPay is white and yellow, so the balance inverts.

| Source | NeroPay |
|---|---|
| Near-black ground (dominant) | `offWhite` / `paper` ground **dominant**; `ink` reserved for one dark section |
| Rainbow gradient mesh | `gradients.yellowToPink` — warmer, narrower range |
| Vivid pink/purple characters | `ink` linework, `yellow` fills, `pink` accents |
| Orange cursor | `yellow` with `ink` outline |
| Platform gradient tops | `gradients.yellowWash` and `paperLift`, alternating |
| Platform edge bands | `ink` or `yellowDeep` — this is what gives them thickness |
| Price badges | `ink` fill, `white` type — **high contrast, always readable** |
| `TAXED` stamp | `pink` fill, `ink` type |
| Glitch streaks | `yellow` / `pink` channel split against `ink` |

### Two retune rules

**Invert the light balance.** The source is dark with bright objects. NeroPay is light with `ink` objects. So the isometric world runs on an `offWhite` ground with `ink`-edged platforms, and you use one **dark** section as the contrast beat rather than as the default — same late tonal shift as the main reference doc (§5).

**Badges are the one place type must be perfectly legible.** `ink` fill, `white` type. Never yellow type, never yellow fill behind dark type. A fee figure that's hard to read is a failed graphic.

---

## 5. Component library

```
flat2d/
  IsoPlatform.tsx          // ★ diamond platform, gradient top, thick edge band
  IsoField.tsx             // ★ arranged field of platforms at varying heights
  ValueBadge.tsx           // ★ price/label badge with stamp impact
  GiantHand.tsx            // oversized limb reaching in from frame edge
  ElasticMesh.tsx          // gradient mesh that squashes / blooms / is carried
  ImpactSparks.tsx         // radiating line burst, 2-3 frames
  FlatCharacter.tsx        // simple rigged walk / carry / react
  GlitchTear.tsx           // ⚠ RGB split + horizontal displacement
```

All CSS/SVG. No 3D dependency. Much cheaper to build than the Webflow-derived set.

### Implementation notes
- `IsoPlatform`: a rotated square with `skew`, a separate edge-band element offset down-left. The band is what sells it — don't skip it.
- `ValueBadge`: arrives with a fast scale-down from 1.15 → 1.0 plus `ImpactSparks` on the landing frame. Hold long — a number needs at least 45 frames to read.
- `ElasticMesh`: CSS `radial-gradient` layers with `filter: blur(40px)` over each other, deformed with `scaleX`/`scaleY` from a single spring. Real mesh gradients aren't necessary at this blur level.
- `GiantHand`: the whole effect is scale ratio. Make it absurd — 8–10× the figure. Half-measures read as a mistake.
- `ImpactSparks`: 3–5 lines, radiating, `ink`, 2 frames, gone. Any longer and it reads as a cartoon.

---

## 6. Purpose and use

**Class:** staged reveal (sequenced beats), with `IsoField` usable as an ambient environment.

**Use for:**
- **Fee and pricing explainers** — the badge + stamp vocabulary is purpose-built for it
- **Comparison content** — "what you pay with X vs NeroPay", using two platforms and two badges
- **Merchant-facing benefit videos** where warmth matters more than gravitas
- **Social-first content** — this style reads well small and fast

**Don't use for:**
- Enterprise or partnership communication — too playful
- Anything where NeroPay needs to look institutional
- Mixed into a Webflow-register piece

---

## 7. What's genuinely worth taking

Ranked by value to you:

1. **`ValueBadge` + `ImpactSparks`.** Fills the biggest gap in your library. Build these first.
2. **Scale contrast (giant hand).** One idea, enormous communicative payload, trivial to implement.
3. **`IsoField`.** A reusable "merchants / network / marketplace" environment.
4. **`ElasticMesh` as a recurring object.** Gives a video continuity without narration.
5. **Glitch.** Interesting, mostly wrong for you. See below.

---

## 8. Register: which system when

You now have **three** distinct systems documented. They don't blend.

| | **Premium 3D** (`neropay-motion-reference.md`) | **Flat playful** (this brief) | **2D social** (`motion-graphics-brief.md`) |
|---|---|---|---|
| Feel | calm, expensive, dimensional | warm, graphic, energetic | punchy, direct |
| Depth | real DOF, camera | overlap + scale, flat | none |
| Easing | slow glide | elastic, squash/stretch | springs, snap |
| Best for | product, brand, trust | fees, pricing, merchant stories | lists, stats, steps |
| Build cost | high (R3F) | low (CSS/SVG) | low |

**Rule: one system per video.** Pick by audience. Institutional or product-led → premium 3D. Merchant-facing or money-mechanics → flat playful. Quick social explainer → 2D social.

**On the glitch specifically:** it signals instability and breakage. That's fine for a crypto/tech brand; it's actively wrong for a payments company asking small businesses to trust it with their money. My recommendation is to build `GlitchTear` but reserve it for studioPalmes work, not NeroPay. If you do want it for NeroPay, keep it under 4 frames and make it read as a fast wipe rather than a malfunction.

---

*Reference system: `neropay-motion-reference.md`. Other briefs: `brief-01-webflow.md`, `brief-02-stockcharts-neropay.md`.*

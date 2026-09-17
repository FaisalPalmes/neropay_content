# Motion Graphics System — Build Brief

**For:** a Claude Code session building a reusable Remotion component library
**Client:** Faisal Palmes — NeroPay (UK fintech, card terminals + EPOS) and studioPalmes (freelance agency, local businesses)
**Source:** 29 Jitter motion templates reviewed and analysed frame-by-frame
**Date:** 17 Sep 2026

---

## 1. What you are building and why

Faisal produces short-form video with Claude Code + Higgsfield (generated visuals) + ElevenLabs (voiceover). A large share of output is **faceless, text-driven explainer and educational video** — no presenter, no stock footage, just motion graphics carrying the idea while VO narrates.

Right now those videos have no visual system. The job is to build one: **a Remotion component library where every component has a stated communicative purpose**, so Faisal (or a future Claude session) can script a video by choosing beats — "hook, then a 3-step list, then a stat, then a testimonial, then CTA" — and have the motion already solved.

This is **not** a request to clone Jitter templates. Jitter was the reference sweep. What follows is the extracted system.

### Hard constraints

| Constraint | Value |
|---|---|
| Aspect ratios | **16:9** (1920×1080) and **1:1** (1080×1080) / **4:5** (1080×1350). No 9:16 required. |
| Frame rate | 30fps |
| Timing model | Must work **both** VO-first and visuals-first |
| Brands | Two, with different registers (see §8) |

Because two very different ratios are in scope, **no component may hardcode pixel positions**. Layout derives from a scale token off composition width. A component that only looks right at 1920×1080 is a failed component.

Because timing is sometimes VO-driven and sometimes not, **no component may hardcode frame numbers internally**. Every component takes `durationInFrames` and an optional `beats[]` array and distributes its own internal timing across whatever it's given.

---

## 2. The three functional classes

Everything in the library falls into one of three classes. This matters because each is scripted against VO completely differently. **Tag every component with its class.**

### Class A — Staged reveal
Has a beginning, ordered beats, and an end. Carries **one idea**. Timed to a sentence or phrase of VO.
*Examples: stat reveal, step number, testimonial card, product reveal.*

### Class B — Ambient loop
No beats, no end. Carries **texture or mood**. Runs underneath a whole section, indifferent to what the VO is saying.
*Examples: orbiting card conveyor, gradient drift, dithered rotating sphere, recursive zoom.*

### Class C — Transition
Gets you from one beat to the next without a jump cut. Duration is short and fixed-ish.
*Examples: vertical stretch wipe, shape morph, recursive zoom-through, split wipe.*

A well-built video layers these: **Class B underneath for the whole section, Class A on top timed to the narration, Class C between sections.** Some references combined A and B in one piece (a headline resolving over a rotating ring field) — support that by making ambient backgrounds composable as a separate layer rather than baking them into foreground components.

---

## 3. The five signature techniques

These are what separated the premium references from the generic ones. They are cheap to implement and they are most of the perceived quality. **Build these as primitives first — before any individual component.**

### 3.1 Type sandwiched behind the subject ★ highest value
The single highest-leverage move in the entire sweep. It appeared in four separate references independently (*The Edit: Split Reveal*, *The Track: Product Reveal*, *The Track: Tagline*, *Share Your Work*).

A large wordmark or headline renders **between the background and a cut-out of the hero object**. The object occludes part of the type. Instantly reads as designed rather than "text slapped on top", and costs nothing but a transparent PNG.

```
<SandwichTitle
  background={<Img src={bg} />}
  text="NEROPAY"
  subject={<Img src={terminalCutoutPng} />}  // transparent PNG
/>
```

Higgsfield can generate the subject; run it through background removal once and it's reusable forever. **Use this everywhere.** It is the house style.

### 3.2 Face shading tied to rotation angle
On any 3D-ish rotation (card flip, product turn), overlay a gradient whose position and opacity are **a function of the same rotation value driving the transform**. Leading edge lightens, trailing edge darkens — a simulated light source.

Without this a flip looks like cheap CSS. With it, it looks like it was rendered. Do not skip it.

### 3.3 Duotone + grain on generated imagery
The fastest way to stop Higgsfield / AI-generated footage looking generic. Map the image to two brand colours and add fine grain. *The Track: Session Complete* used exactly this — fixed foreground type over a background that swaps between flat colour and a duotone-red treated photo.

Build as `<Treated image duotone={[dark, light]} grain={0.08} />`. It unifies imagery from wildly different sources into one brand look, which is precisely Faisal's problem with mixed-source footage.

### 3.4 Blur-to-sharp on type entrance
Text enters at `filter: blur(12px)`, opacity 0, and resolves to sharp. Cheapest premium cue available. Used in *Blurry Text Spin* to great effect. Pair with a slight scale-down from 1.04 → 1.0.

### 3.5 Hard cut on the beat
*Countdown: Bold* and *The Crust: Animated Menu* both derive their confidence from **hard cuts, not crossfades**, between full-frame states — and in Countdown's case a full colour-pair flip per number.

A crossfade says "these are related". A hard cut with a palette change says "this is a new thing, look at it". For enumerated content (steps, list items, counts) the hard cut is correct. Resist the urge to soften it.

---

## 4. Motion system

### 4.1 Easing vocabulary

Four curves. Do not invent more.

| Name | Use | Remotion |
|---|---|---|
| `ENTRANCE` | Anything arriving on screen | `spring({ config: { damping: 18, stiffness: 110, mass: 0.8 } })` |
| `SNAP` | Emphasis, stretch-and-release, pops | `spring({ config: { damping: 10, stiffness: 200, mass: 0.6 } })` — visible overshoot |
| `EXIT` | Anything leaving | `Easing.bezier(0.4, 0, 1, 1)` — accelerates out, never eases out |
| `AMBIENT` | Loops, conveyors, drifts | `Easing.linear` — constant velocity, no easing at all |

The `AMBIENT` = linear rule is load-bearing. *Orbit: Cards* works **because** it's a constant-velocity conveyor. Easing an ambient loop makes it feel like it's trying to say something, which fights the foreground.

### 4.2 Duration scale (at 30fps)

| Token | Frames | Use |
|---|---|---|
| `micro` | 7 | Icon pops, badges, cursor blinks |
| `standard` | 16 | Default entrance for any element |
| `statement` | 27 | Hero type, product reveals |
| `holdMin` | 45 | **Minimum** hold on anything that must be read |
| `transition` | 20 | Class C components |

`holdMin` is a floor, not a target. Text that must be read holds for at least 1.5s after it finishes animating. Most amateur motion graphics fail here — they animate beautifully and then yank the text away.

### 4.3 Stagger

Sibling elements stagger **4 frames** apart. Never animate a group simultaneously; never stagger so wide the group stops reading as a group (past ~8 frames it fragments).

### 4.4 Hierarchy through order

From the testimonial reference: body copy → attribution → micro accent. **The order elements arrive in expresses their importance**, and it runs most-to-least important. The smallest, least important element arrives last. This is free hierarchy and it's more reliable than sizing things differently.

### 4.5 Single-subject discipline

*Card Flip* works partly because the background is dead flat black and **nothing else moves**. When one thing needs attention, everything else holds still. Ambient layers pause or dim under a Class A beat — don't let a background loop compete with the point.

---

## 5. Component catalogue

Grouped by communicative job. Each entry: what it says, when to reach for it, and how it moves.

### 5.1 Structural / educational — *the core set for faceless explainer*

These are the highest priority. They are what a text-driven educational video is actually made of, and they were the thinnest area in the reference sweep.

#### `StepNumber` — Class A ★ build first
*Derived from: Countdown: Bold*

**Says:** "this is item N of a sequence."
**Use:** "3 things you need to know", numbered process steps, chaptering a long explainer, ranked lists.
**Motion:** Giant numeral filling the frame. Hard cut per step to a **new colour pair from the brand palette array** — the flip gives each step its own identity and resets viewer attention. Numeral enters with `SNAP` (squash and settle).
**Props:** `index`, `total`, `label?`, `palette[]`
**Note:** Hard cut, never a crossfade.

#### `StatReveal` — Class A ★ build first
*Not present in the sweep — this is a gap you must fill.*

**Says:** "here is one number that matters."
**Use:** Fees, percentages, savings, transaction volumes, time saved. Every fintech explainer needs this repeatedly and none of the 29 templates covered it.
**Motion:** Numeral counts up on `ENTRANCE` with the count finishing ~4 frames *before* the spring settles (so it lands, then settles — the reverse feels broken). Unit/suffix arrives on `micro` after. Supporting label fades in last. Hold `holdMin` minimum.
**Props:** `from`, `to`, `format` (currency/percent/plain), `label`, `sublabel?`
**Note:** Format-aware — `£1,247` and `3.2%` and `12×` all need different treatment. Use `Intl.NumberFormat`.

#### `ComparisonSplit` — Class A ★ build first
*Not present in the sweep — second gap.*

**Says:** "A versus B."
**Use:** Old way vs new way, your rate vs theirs, before vs after. Core explainer grammar, entirely missing from the references.
**Motion:** Frame divides; two panels arrive from opposite edges with `ENTRANCE`, staggered 4 frames. The divider draws. Losing side desaturates or dims once both have landed.
**Props:** `left`, `right`, `verdict?` ("winner" side to emphasise)

#### `ProcessFlow` — Class A
*Not present in the sweep — third gap.*

**Says:** "this connects to this connects to this."
**Use:** How a payment moves, onboarding steps, any pipeline.
**Motion:** Nodes arrive staggered; connectors draw between them (`strokeDashoffset`); a pulse travels the completed path.
**Props:** `nodes[]`, `orientation`

#### `BulletCascade` — Class A
*Derived from: The Stack: Testimonial (line-by-line reveal) + The Crust (list pacing)*

**Says:** "here are the points, in order."
**Use:** Feature lists, "what's included", key takeaways.
**Motion:** Lines reveal via **upward mask**, staggered 4 frames. The container is **content-sized and grows its own height** as lines land — this is the detail from the testimonial reference that makes it feel real rather than pre-laid-out.
**Props:** `items[]`, `revealMode: 'line' | 'word'`

#### `TypewriterLine` — Class A
*Derived from: The Stack: Livestream*

**Says:** "this is being produced right now / live."
**Use:** Live announcements, terminal/code moments, "we asked the AI…" beats.
**Motion:** Character-by-character with a visible blinking cursor. Cursor blink is `micro`, independent of typing rate.

---

### 5.2 Emphasis & titling

#### `StretchSnapText` — Class A
*From: Stretch & Snap Text*

**Says:** "this phrase matters."
**Use:** Hook in the first 1–2s; punching a key phrase mid-VO.
**Motion:** `letterSpacing` and glyph `scaleX` both driven from **one** `SNAP` spring value so stretch and release share a curve. Baseline fixed. The overshoot on the snap is the whole effect.

#### `BlurResolveTitle` — Class A
*From: Blurry Text Spin*

**Says:** "here is something considered and premium."
**Use:** Feature names, "now available", spec callouts. **Best register match for NeroPay.**
**Motion:** Technique 3.4 (blur→sharp) over an optional `ConcentricField` ambient layer.

#### `SandwichTitle` — Class A ★ build first
Technique 3.1 as a component. The house-style primitive. See §3.1.

#### `ScrollingStatement` — Class A
*From: The Track: Tagline*

**Says:** "this is what we stand for."
**Use:** Manifesto, about-us, brand film opener.
**Motion:** Very large type scrolling vertically through frame, subject photo behind it (uses `SandwichTitle` layering), corner registration marks, small spec card. Slow — this one earns a long duration.

#### `InflateMorphWord` — Class A
*From: Morph: Inflating Text*

**Says:** "we're playful."
**Use:** Brand sting, channel ident, section break. **studioPalmes only — wrong register for NeroPay.**
**Motion:** Gooey merge via SVG `feGaussianBlur` + `feColorMatrix` contrast trick on a letter group; individual letters scale on staggered `SNAP` springs underneath.
**Caution:** Legibility drops at peak inflation. Never use for anything that must be read quickly.

---

### 5.3 Product & reveal

#### `CardFlip3D` — Class A/B hybrid ★ build first
*From: Card Flip — directly on-brand for NeroPay*

**Says:** "two sides of one thing."
**Use:** Literal (card, terminal, packaging). Abstract (before/after, claim → the detail behind it, surface vs substance). Excellent as a **payoff beat** — the long holds give VO room to land a line on each face.
**Motion:** `rotateY` on a `preserve-3d` parent, `perspective: 1200px` on the wrapper. Two absolutely-positioned faces, `backfaceVisibility: hidden`, back pre-rotated 180°. Driven by a spring for the settle. **Rhythm is hold → fast flip → hold**, not constant rotation.
**Must include:** Technique 3.2 (angle-linked sheen).
**Modes:** `once` (flip and hold) and `loop` (A/B forever).
**Note:** The back face should be a genuinely different design, not a mirror.

#### `HeroProductReveal` — Class A
*From: The Track: Product Reveal*

**Says:** "this is the thing."
**Use:** NeroPay terminal or card hero shot; a single feature presented as the subject.
**Motion:** Product centred, slow float. Concentric rings pulse outward behind. Wordmark **behind** the product (3.1). Corner registration marks + tiny meta labels. Holds long.

#### `UIMicroInteraction` — Class A
*From: View Cart Button: Split*

**Says:** "here's how the product behaves."
**Use:** ★ Showing NeroPay EPOS / app behaviour **without screen recording**. Build the UI as real components and animate it — cleaner than a screen capture, infinitely re-brandable, and no need to stage a real device.
**Motion:** Elements split, recombine, state-change at UI scale on a near-white or brand surface.

#### `GridTeaser` — Class A
*From: Project Teaser*

**Says:** "here's the work / here's what we built."
**Use:** ★ studioPalmes case studies and portfolio posts.
**Motion:** Modular grid; image reveals cell by cell; flat brand colour blocks animate into the empty cells on stagger.

---

### 5.4 Social proof & offers

#### `TestimonialCard` — Class A
*From: The Stack: Testimonial*

**Says:** "someone real vouches for this."
**Use:** After a claim, to back it. Late in an explainer, or standalone social.
**Motion:** Frosted-glass card (`backdrop-filter: blur`) over a still background. Quote reveals line-by-line with upward masks; **card height grows with content**. Attribution (avatar + name + role) slides up only after the last quote line settles. Micro accent (heart/star) pops last.
**Note:** Background does not move. All motion is in the overlay.

#### `OfferBurst` — Class A
*From: The Stack: Sale*

**Says:** "act on this."
**Use:** Pricing, discounts, limited offers. studioPalmes client promos.
**Motion:** Radial dotted sunburst behind centred offer text; burst rotates slowly. Cheap attention magnet, adapts to any brand colour.

#### `StatementCard` — Class A
*From: The Track: Session Complete*

**Says:** "done / here is the conclusion."
**Use:** Outro, milestone, result, key takeaway.
**Motion:** Fixed bold headline; **background swaps underneath it** — flat colour → duotone treated photo → mono. Type never moves. Uses technique 3.3.

#### `EventCard` — Class A
*From: The Stack: Livestream*

**Says:** "this is happening at this time."
**Use:** Webinars, launches, going-live posts.
**Motion:** Details set with `TypewriterLine`; isometric blocks assemble and drift below.

---

### 5.5 Ambient backgrounds — Class B

All of these run **underneath** foreground beats. All use `AMBIENT` (linear) easing. All must dim/desaturate on demand so they never compete with a Class A beat on top.

| Component | From | Says | Notes |
|---|---|---|---|
| `OrbitConveyor` | Orbit: Cards | "there's a lot of this" | Cards tangent-aligned to a huge off-screen circle. Rotation **and** vertical position both derive from angular position — centre card upright and high, edge cards tilted ~30° and dropped. Constant angular velocity. Seamless loop = advance exactly one card-slot per period. |
| `ConcentricField` | Blurry Text Spin | calm, premium, focus | N nested rounded rects, index-based rotation/scale offset. Pairs with `BlurResolveTitle`. |
| `DitherSphere` | Dithering Effect | "technology / network / global" | ★ Strong NeroPay fit. Threshold map over a gradient sphere. Cheap, high perceived quality, **survives compression better than smooth gradients**. |
| `MeshGradient` | Gradient Background | mood | Slow drift. Use sparingly — it's the most generic option here. |
| `GradientBands` | Procedural Gradient Background | energy | Vertical bands sliding under bold type. |
| `VortexCards` | Blur: Swirl | "endless possibility" | Image cards orbiting a centred headline with motion blur. |
| `ZeroGravityWords` | Zero Gravity Bouncy Words | playful chaos | ★ studioPalmes only. Low information density — wrong for fintech unless dialled right back. |

### 5.6 Transitions — Class C

| Component | From | Notes |
|---|---|---|
| `StretchWipe` | Image Stretch Transition | Boundary row smears vertically (slit-scan feel), dragging the next scene in. Energy without a hard cut. |
| `RecursiveZoom` | The Edit: Nested Images | Droste zoom. N layers, `scale = pow(ratio, t - index)`, recycle layers past frame. Seamless when the ratio between layers is constant. Doubles as an ambient loop. |
| `ShapeMorph` | Vector Animation | Flat geometric shapes scaling through each other, hard brand colour. Abstract sting. |
| `RippleDisplace` | Ripple Effect | Sine-over-Y displacement, animated phase. SVG `feDisplacementMap` or a WebGL pass. |
| `DuotoneCrossfade` | Blend Modes: Double Exposure | Blend-mode composite between two images. Editorial; low utility for fintech. |

---

## 6. Project structure

```
src/
  system/
    tokens.ts          // durations, stagger, easing configs
    easings.ts         // ENTRANCE / SNAP / EXIT / AMBIENT
    layout.ts          // scale(), safeArea(), ratio-aware helpers
    brands/
      neropay.ts
      studiopalmes.ts
  primitives/
    SandwichTitle.tsx  // 3.1  — build first
    AngleShading.tsx   // 3.2
    Treated.tsx        // 3.3  duotone + grain
    BlurResolve.tsx    // 3.4
  components/
    structural/        // StepNumber, StatReveal, ComparisonSplit, ProcessFlow, BulletCascade, TypewriterLine
    titling/
    product/
    proof/
    ambient/
    transitions/
  compositions/
    Explainer.tsx      // beat-sequencer shell
```

### Every component's contract

```ts
interface MotionComponentProps {
  durationInFrames: number;   // never hardcode internally
  beats?: number[];           // optional VO-derived anchor frames
  brand: BrandTokens;
  ratio: '16:9' | '1:1' | '4:5';
}
```

Components distribute their internal timing **proportionally** across `durationInFrames`, or snap to `beats[]` when provided. This is what makes the same component work VO-first and visuals-first.

### Layout rule

One scale function off composition width. No magic pixel values anywhere.

```ts
const s = (n: number) => (n / 1920) * width;
```

Design at 16:9, verify at 1:1 and 4:5. Text that fits a 16:9 line will wrap at 1:1 — components must handle two-line headlines without breaking their layout.

---

## 7. VO synchronisation

Support both modes from one codebase:

**Visuals-first:** components run at their default `durationInFrames`. VO is scripted to the storyboard.

**VO-first:** transcribe the ElevenLabs output to word-level timestamps, emit a `beats[]` array, pass it in. Components snap their key moments to those frames.

Build a small `useBeats(beats, durationInFrames)` hook that returns normalised internal timings either way, so component code never branches on which mode it's in.

**Rule:** a beat lands **on** the stressed word, not after it. Graphics that arrive late feel like subtitles; graphics that arrive on the beat feel authored.

---

## 8. Brand registers

The two brands need genuinely different treatment — this is not just a palette swap.

### NeroPay — fintech, trust, clarity
- Restrained. Blur-to-sharp over bouncy springs. `ENTRANCE` far more than `SNAP`.
- Ambient: `DitherSphere`, `ConcentricField`. Avoid `ZeroGravityWords`, `InflateMorphWord`.
- Long holds. Nothing rushed. Confidence reads as stillness.
- `CardFlip3D` and `UIMicroInteraction` are the signature components — the product *is* cards and terminals.

### studioPalmes — agency, energy, craft
- Wider range. `SNAP` and overshoot welcome. Playful components unlocked.
- `GridTeaser` for case studies, `OfferBurst` for client promos.
- Should demonstrate range — it's a portfolio, so the motion is itself the sales pitch.

Both brands define: `palette[]` (ordered colour pairs for `StepNumber`), `type` (display + body), `radius`, `grain`, `easingBias` (a multiplier nudging springs toward damped or bouncy).

---

## 9. Build order

1. **`system/`** — tokens, easings, layout. Nothing else works without these.
2. **The four primitives** (§3.1–3.4). They're dependencies of half the catalogue.
3. **`StepNumber`, `StatReveal`, `ComparisonSplit`, `BulletCascade`.** These four cover the majority of a faceless explainer's actual runtime. Ship these and Faisal can make real videos.
4. **`CardFlip3D`, `SandwichTitle`, `UIMicroInteraction`** — the NeroPay signature set.
5. **Two ambient backgrounds** (`DitherSphere`, `ConcentricField`) and **two transitions** (`StretchWipe`, `RecursiveZoom`).
6. Everything else, by demand.

**Build a demo composition after step 3** that strings the four structural components into a 30-second mock explainer at all three ratios. That's the real test of the layout system, and it surfaces reflow bugs before the catalogue grows.

---

## 10. Anti-patterns

- **Crossfading enumerated content.** Steps and counts hard-cut. Crossfade says "related"; you want "new thing, look".
- **Easing an ambient loop.** Linear or it fights the foreground.
- **Yanking text before it's read.** `holdMin` is a floor.
- **Flipping without angle-linked shading.** Looks like cheap CSS.
- **Hardcoded pixels or frame numbers.** Breaks both ratio flex and VO sync.
- **Everything moving at once.** When one thing matters, the rest holds still.
- **Untreated generated imagery.** Higgsfield output goes through `Treated` or it looks like stock.
- **Inflation/chaos components in fintech content.** Register mismatch reads as unserious.

---

## 11. Gaps worth naming

The reference sweep was 29 templates from a social-media-first library, and it skewed heavily toward **brand aesthetics** over **explanation**. Four things an educational video needs constantly had *no* representation:

- presenting a single number (`StatReveal`)
- comparing two things (`ComparisonSplit`)
- showing a process or flow (`ProcessFlow`)
- annotating or callout-ing part of an image

Those are specified above from first principles rather than derived from a reference. They're also, for Faisal's actual use case, **the most important components in the library** — so they should get more design attention than the ones that came with a reference attached, not less.

If Faisal wants to extend the reference set later, the useful search is *data visualisation in motion* and *technical explainer* work, not social templates.

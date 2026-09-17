# NeroPay Motion Graphics — Standing Reference

**Purpose:** persistent reference for Claude Code sessions building NeroPay motion-graphics video.
**Status:** living document. Read this before building any NeroPay motion piece.
**Derived from:** frame-by-frame analysis of the Webflow product film by Ordinary Folk (~90 frames, 103s), retuned to NeroPay's identity.
**Stack:** Remotion (React video) + ElevenLabs VO. Higgsfield optional for generated imagery.

---

## 0. How to use this document

This is the **house style** for NeroPay faceless motion-graphics video. It defines the palette, materials, camera behaviour, scene grammar and component set.

- Building a NeroPay explainer? Read §1–§6, then §9 for a ready scene recipe.
- Adding a new component? Check it against §3 (materials) and §7 (register) before you build.
- Told to "make it look like the reference"? That's this document.

Companion doc: `motion-graphics-brief.md` covers the broader 2D social-graphics library (stat reveals, step numbers, comparisons). **The two systems do not mix** — see §7.

---

## 1. Palette

NeroPay's brand is **white and yellow**. This system keeps that identity and adds a **soft pink** as a secondary, used sparingly for warmth and depth. Near-black is retained purely as a structural anchor — for type, for thin dark panels, and for the dark tonal beat.

```ts
// system/brands/neropay.ts
export const neropay = {
  // Base — the brand ground and the "air" in the frame
  white:      '#FFFFFF',
  offWhite:   '#FCFAF6',
  paper:      '#F4F1EA',

  // Yellow — the dominant. Brand primary.
  yellowDeep: '#D99B00',   // shading / terminator only
  yellow:     '#FFC72C',   // the brand yellow
  yellowLite: '#FFDC74',
  yellowPale: '#FFF0C2',

  // Pink — the secondary. Subtle. Never competes with yellow.
  pink:       '#E89A92',
  pinkLite:   '#F4BDB6',
  blush:      '#FBDED8',

  // Ink — structural anchor. Type, dark panels, vignette, dark beat.
  ink:        '#111111',
  inkWarm:    '#1C1A16',
  charcoal:   '#2E2A24',
} as const;
```

> **Swap in official brand hexes if they exist.** These are tuned to read correctly on screen; if NeroPay has exact brand values for the yellow, replace `yellow` and re-derive `yellowLite` / `yellowDeep` from it.

### 1.1 Gradients

Every surface carries a gradient. **There is no flat fill anywhere in this system.**

```ts
export const gradients = {
  yellowWash:   'linear-gradient(135deg, #FFDC74 0%, #FFC72C 55%, #D99B00 100%)',
  pinkWash:     'linear-gradient(135deg, #FBDED8 0%, #F4BDB6 60%, #E89A92 100%)',
  yellowToPink: 'linear-gradient(120deg, #FFDC74 0%, #F4BDB6 100%)',  // the signature
  paperLift:    'linear-gradient(160deg, #FFFFFF 0%, #FCFAF6 50%, #F4F1EA 100%)',
  inkDepth:     'linear-gradient(140deg, #2E2A24 0%, #111111 100%)',  // dark beat
};
```

`yellowToPink` is the signature gradient. Use it on hero surfaces and the resolve.

### 1.2 Three warnings specific to this palette

**Yellow on white is the worst contrast pair in design.** Never set type in yellow on a light ground. Type is `ink` on light, `white` on dark. Yellow is for *surfaces and objects*, never for reading.

**Everything here is light and warm — there is no cool colour and no dark ground by default.** This palette will wash out and go marshmallow if you let it. **`ink` is the spine.** Put it in every single scene: a thin dark panel, dark type, a vignette edge, one dark slab in the collage. Without it the frames have no structure.

**Pink is a seasoning, not a co-star.** Roughly 70% yellow / 20% pink / 10% ink by visual weight. If pink starts reading as a second brand colour, pull it back — the brand is white and yellow, and pink is there to stop the yellow feeling flat.

### 1.3 Saturated / pale alternation

Alternate saturated scenes (yellow-dominant, dense) with pale scenes (white-dominant, airy). Two saturated yellow scenes back to back is genuinely fatiguing — yellow is the most tiring hue on the eye at high coverage. This alternation is a requirement, not a preference.

---

## 2. Format & timing

| | |
|---|---|
| Ratios | **16:9** (1920×1080) and **1:1** (1080×1080) / **4:5** (1080×1350) |
| Frame rate | 30fps |
| Timing | Works both VO-first and visuals-first |

No hardcoded pixels — layout derives from `const s = (n: number) => (n / 1920) * width`.
No hardcoded frame numbers inside components — every component takes `durationInFrames` and optional `beats[]`.

---

## 3. Material language — four materials, no more

The restraint is what makes different scenes read as one film. Do not add a fifth.

### 3.1 Glass / translucent
Refractive; you see through it to what's behind and inside.

**The critical detail: hard, bright specular lines along the edges.** Not a soft glow — a crisp bright rim following each edge of the form. In this palette those rim lines are `yellowLite` or near-white, never grey. That single detail is what makes a form read as glass rather than a tinted box.

### 3.2 Shaded yellow — the hero material
Yellow is **not** a metal. Do not give it a gold/metallic treatment; that's off-brand and it muddies the hue.

But **flat yellow kills form**. A flat yellow sphere reads as a 2D circle, not a sphere. Yellow needs **strong tonal range across the form**:

```
3D (R3F):  metalness 0.0, roughness 0.45,
           warm key + soft fill. Let the terminator fall to yellowDeep.
CSS 3D:    radial-gradient(circle at 32% 28%,
             #FFF0C2 0%, #FFDC74 30%, #FFC72C 62%, #D99B00 100%)
```

The rule: **light side reaches `yellowPale`, shadow side reaches `yellowDeep`.** That full range is what gives yellow volume. Compress it and everything goes flat and plastic.

Optional: a very faint `blush` bounce on the shadow side. Subtle — it should read as light behaviour, not as pink.

### 3.3 Emissive-edged slabs — the UI material
Interface elements are **extruded with real thickness**, and their edges **glow**. Form rows, cards, buttons, list items — all slabs, all with a bloom coming off the perimeter (`yellowPale` or white at low opacity).

This is what makes flat interface parts feel like objects rather than rectangles. It is the most transferable technique in the whole system.

### 3.4 Thin line
Wireframes, ghost twins, connector paths, grid floors, tunnels. Near-1px, low opacity. In this palette: `ink` at 15–25% on light grounds, `yellowPale` on dark grounds.

### 3.5 Lighting
- **Long, low, raking shadows** — low-angle key light. Soft, warm-tinted, never grey.
- **Deep vignette** in the dark beat — corners fall to `ink`, subject is the only lit thing.
- **Blown-out cores** — vanishing points and the resolve overexpose to pure white. Easy and effective on a white brand.
- **Radial bloom** behind hero objects — a soft `blush` or `yellowPale` halo.

---

## 4. The five techniques

### 4.1 Depth of field, used aggressively ★ biggest single lever
Foreground blurred, mid sharp, background blurred — hard enough that the nearest object is sometimes near-abstract.

Buys two things: it reads as *rendered in 3D* rather than *layers in After Effects*, and it makes dense frames legible by telling the eye where to look. If you implement one thing from this document, implement this.

### 4.2 The camera never stops; cuts land on motion
No static shots. Dolly, crane, orbit, push, fly-through — always moving, always slowly.

Cuts happen while both shots are in motion, so energy carries across instead of resetting. This is what lets a wordless minute-plus hold attention.

### 4.3 UI as extruded, emissive-edged objects ★ most transferable
Not planes — slabs with thickness and glowing edges, tilted in space, occluding each other, with yellow spheres intersecting them.

**This is how NeroPay's EPOS and terminal interfaces get shown without a screen recording.** It's also the cheapest technique here: CSS 3D, real DOM panels, real components, rebrandable forever.

### 4.4 Differential rotation on concentric rings
Multiple concentric arc rings at different radii, each rotating at its own rate, each carrying content fragments, converging on a blown-out white centre.

The "everything comes together" resolve. Reusable as the standard NeroPay outro.

### 4.5 The wireframe ghost twin
Alongside a solid hero object, a thin-line wireframe of a related form. Says "structure underneath the surface" with no copy.

Thematically perfect for a payments company — the system behind the interface.

---

## 5. Scene grammar

Alternate two scene types on a 6–10s cycle:

```
ABSTRACT (mood, no information)  ⇄  PRODUCT-LITERAL (what NeroPay does)
```

- **Abstract:** yellow sphere field, glass hero object, grid tunnel, dark corridor.
- **Product-literal:** terminal UI close-up, EPOS screen in space, isometric stack of app states, flat panel collage.

**Never two information beats back to back** — no room to breathe, retention drops.
**Never two mood beats back to back** — the film stops saying anything.

### The late tonal shift
Around 60% through, **go dark**. After a stretch of bright white-and-yellow product world, drop into high-contrast `ink` with hard light shafts and a single glowing yellow sphere for 10–15 seconds, then resolve back to white.

On a white-and-yellow brand this contrast is even more effective than it was in the source film, because the return to white lands like a lift. Copy this structurally even when you copy nothing else.

### Reference structure (~100s)

| Beat | ~Duration | Type |
|---|---|---|
| Yellow sphere field, lateral dolly | 6s | Abstract — establish |
| Extruded tile slab, camera orbit | 6s | Abstract |
| Sphere resting on panel edge, crane up | 5s | Abstract |
| Glass hero object + wireframe twin | 9s | Abstract — hero |
| Grid tunnel flythrough | 7s | Abstract — transit |
| Terminal/EPOS UI close-up, emissive slabs | 9s | **Product** |
| Full interface in space, angled | 7s | **Product** |
| Isometric exploded stack of app states | 6s | **Product** |
| Dark corridor, light shafts, yellow sphere | 13s | ⚠ tonal shift |
| Flat panel collage + connector path | 16s | **Product** |
| Radial converge to white | 15s | Resolve |

---

## 6. Component library

```
ui3d/                        ← CSS 3D. Build these first.
  ExtrudedPanel.tsx          // ★ slab, thickness, emissive edge
  PanelStack.tsx             // ★ isometric exploded stack of screens
  PanelCollage.tsx           // ★ layered light/dark flat collage
  ConnectorPath.tsx          // curved line, dot travelling along it
  DepthBlur.tsx              // z-depth → blur amount
  GridTunnel.tsx             // perspective tunnel flythrough

abstract3d/                  ← @remotion/three
  SphereField.tsx            // grid of shaded yellow spheres, lateral dolly
  GlassHero.tsx              // rotating translucent form + contents
  WireframeGhost.tsx         // thin-line twin of a solid form
  MosaicSlab.tsx             // extruded tile wall

resolve/
  RadialConverge.tsx         // ★ concentric arc rings, differential rotation

camera/
  useCameraPath.ts           // dolly / crane / orbit / push, frame-driven
```

Every component signature:

```ts
interface MotionComponentProps {
  durationInFrames: number;
  beats?: number[];
  ratio: '16:9' | '1:1' | '4:5';
}
```

### Build routes

**Route A — CSS 3D.** `perspective` + `preserve-3d` + `translateZ`, `filter: blur()` by z-depth for DOF, `drop-shadow` for emissive edges. Covers all six `ui3d/` components — **the ones carrying the actual message**. Panels stay real DOM: real NeroPay interface, editable, rebrandable.

**Route B — `@remotion/three`.** Spheres via `MeshStandardMaterial` (metalness 0, roughness ~0.45 — see §3.2), glass via drei's `MeshTransmissionMaterial`, DOF and Bloom via `@react-three/postprocessing`, camera animated off `useCurrentFrame()`. **Bloom is not optional** — it's what makes the emissive edges and blown cores work. Benchmark render times before committing; set up separate preview and final sample configs.

**Route C — Hybrid ★ recommended.** R3F for abstract scenes, CSS 3D for product scenes, cut between them. Constant camera motion (§4.2) disguises the seam.

**Build order:** `ExtrudedPanel` → `PanelCollage` → `RadialConverge`. All CSS-3D-achievable, and the third gives you a reusable NeroPay outro immediately.

---

## 7. Register rules

This system is **calm, premium, slow, bright**. It is NeroPay's register. It is *not* the register of punchy social content.

**Do not mix this with the 2D social library** (`motion-graphics-brief.md`). They rest on opposite assumptions:

| | 2D social library | This system |
|---|---|---|
| Easing | springs, overshoot | slow glide, zero bounce |
| Cuts | hard, on the beat | on motion, disguised |
| Camera | static frame | never stops |
| Density | one idea per frame | dense; DOF sorts it |
| Materials | flat colour | gradient + glass + glow |

Pick one system per video. Both in one piece reads as confused, not versatile.

### Hard don'ts
- **Yellow type on a light ground.** Type is `ink` on light, `white` on dark.
- **Flat yellow.** It needs the full tonal range, `yellowPale` → `yellowDeep` (§3.2).
- **Metallic/gold treatment on the yellow.** Off-brand.
- **A scene with no `ink` in it.** The palette needs its spine (§1.2).
- **Pink reading as a co-star.** ~70/20/10 yellow/pink/ink.
- Springs, overshoot, bounce. Everything glides.
- A static camera.
- Two saturated scenes back to back, or two information beats back to back.
- A fifth material.

---

## 8. Higgsfield integration

When generated imagery enters a piece built in this system, it must be **treated** or it will read as foreign.

- Duotone-map it to `ink` → `yellow`, then add fine grain. (`ink` → `pink` occasionally, for variety.)
- Match the DOF of surrounding scenes — generated stills are usually too uniformly sharp.
- Keep it behind or between extruded panels rather than full-frame, so it sits inside the built space rather than interrupting it.

Existing Higgsfield defaults (`nano_banana_2`, 16:9, photorealistic 4K, documentary feel) produce material that is *too* photographic for this system straight out. The duotone pass is what reconciles them.

---

## 9. Ready scene recipes

**Product explainer (~60s)**
Yellow sphere field → terminal UI close-up → grid tunnel → EPOS screens isometric stack → dark corridor → panel collage → radial converge.

**Feature announcement (~30s)**
Glass hero + wireframe twin → feature UI in extruded slabs → radial converge.

**Merchant-facing benefit piece (~45s)**
Pale white open → panel collage of merchant-side screens with connector path → dark tonal beat → yellow sphere resolve.

**Outro / sting (~8s)**
`RadialConverge` alone, yellow-to-pink arcs, blown white centre, mark resolves at the core.

---

## 10. Open items

- Confirm the official NeroPay yellow hex and replace §1 values if it differs.
- Benchmark `@remotion/three` render times — this decides how much of the abstract set is reachable.
- Build `ExtrudedPanel` against a real NeroPay screen first; that's the proof this direction works.

---

*Source analysis: `brief-01-webflow.md`. Broader 2D social library: `motion-graphics-brief.md`.*

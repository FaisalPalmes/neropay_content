# Brief 02 — StockCharts (Yum Yum Videos) → NeroPay retune

**Source:** *Top 10 Animated Motion Graphics Videos made in After Effects* — chapter 7, 6:14–6:49
**Studio:** Yum Yum Videos
**Analysis:** ~26 frames at ~0.4s intervals. No audio.
**Retuned to:** NeroPay white + yellow (see `neropay-motion-reference.md` §1 for tokens).

---

## 1. What this is

A **logo reveal / brand sting**. Not an explainer — roughly 12–15 seconds of a mark assembling itself, then the wordmark arriving.

Completely different genre from the Webflow piece: flat vector, soft light, no 3D, no depth of field, no camera. Where Webflow is a premium product *world*, this is a clean brand *moment*. Both are useful to you; they do different jobs.

**Why it matters for NeroPay:** you need an ident. Something that opens or closes every faceless explainer and makes a string of separate videos read as one channel. This is the cleanest reference in the whole video for that job, and it's the easiest thing here to build well.

---

## 2. Shot breakdown

| Beat | What happens |
|---|---|
| 1 | A **curved trail** swoops in from the upper right — a tapered stroke with a gradient along its length, decelerating hard as it arrives. |
| 2 | The trail's **tip becomes the icon**. The rounded-square outline draws itself first. |
| 3 | The **inner grid** fills in — cell divisions appearing across the square. |
| 4 | The **chart lines draw on**: a heavy zigzag, then a lighter trend line rising across it. Progressive stroke reveal, left to right. |
| 5 | The icon **settles** — it arrived at a slight rotation and corrects to level with a small overshoot. |
| 6 | Icon **scales down and shifts left**; the **wordmark arrives letter by letter**, each letter dropping in with its own slight rotation and settle. |
| 7 | Hold. |

Background throughout: a **soft radial light burst** — hot white core, faint rays, a pale wash of colour left and right. It never moves much; it just breathes.

---

## 3. The four techniques

### 3.1 Trail-becomes-object ★ the signature move
The path that flies in *turns into* the thing. The stroke doesn't fade out and get replaced — its endpoint is the seed the icon grows from.

This is the whole charm of the piece. One continuous gesture from empty frame to finished mark, no cuts.

### 3.2 Progressive stroke draw
Everything draws rather than fades: outline first, then structure, then content. Classic `strokeDashoffset` animation.

The **order** is what reads as intelligent — container before contents, structure before data. Get the order wrong and it looks like a loading spinner.

### 3.3 Per-letter rotation settle
Wordmark letters don't just fade in. Each arrives at a few degrees of rotation and corrects, staggered.

Subtle but it's the difference between "animated logo" and "text appeared".

### 3.4 Radial burst background
A hot core with faint rays and a soft colour wash. It does two things: it hides the fact that the background is empty, and it puts a light source in the frame so the flat mark feels lit rather than pasted.

Cheap, and it carries a lot of the production value.

---

## 4. NeroPay retune

The source used pale blue / pale pink on white. Straight swap into NeroPay:

| Source element | NeroPay |
|---|---|
| Radial burst core | `white` → `yellowPale` rays |
| Background wash | `offWhite` base, `yellowPale` left, `blush` right — very low saturation |
| Icon outline + grid | `ink` |
| Primary data line | `ink` |
| Secondary / trend line | `yellow` (this is the one element that carries brand colour) |
| Incoming trail | `gradients.yellowToPink`, tapered |
| Wordmark | `ink` |

**Contrast check:** the trend line is the only yellow on a light ground and it's a *stroke*, not type — that's fine. Everything readable stays `ink`. See `neropay-motion-reference.md` §1.2.

**The `ink` spine:** this piece is naturally very light, so the ink outline and wordmark are carrying the whole structural load. Don't be tempted to lighten them to grey — the mark will dissolve.

### What the NeroPay icon should be
The source drew a stock chart because that's the brand. For NeroPay the equivalent object is the **card terminal** or a **transaction line** — something that can draw in the same order: outline → structure → data. A terminal outline, then its screen divisions, then a rising line or a tick on the screen, works with this exact grammar.

---

## 5. Remotion implementation

Genuinely easy — this is **2D SVG**, no 3D, no `@remotion/three`.

```
sting/
  BrandSting.tsx           // the composition
  TrailIn.tsx              // tapered gradient stroke, decelerating
  DrawPath.tsx             // strokeDashoffset progressive reveal
  RadialBurst.tsx          // background: core + rays + wash
  WordmarkSettle.tsx       // per-letter rotation settle, staggered
```

Notes:
- `TrailIn` decelerates hard — `Easing.bezier(0.16, 1, 0.3, 1)` or an over-damped spring. It should feel like it's braking, not gliding.
- `DrawPath` takes `delay` so you can sequence outline → grid → lines from one parent.
- The settle overshoots. **This is the one place in the NeroPay system where overshoot is allowed** — it's a sting, not the film. See §7.
- `RadialBurst` rays: 12–16 thin triangles from centre, very low opacity, slow rotation. Don't animate the rays fast; they should be nearly static.

**Suggested timing (30fps):** trail in 18f → outline draw 12f → grid 10f → data lines 16f → settle 8f → wordmark 20f staggered 3f/letter → hold 45f. **~2.5–3s for a reusable sting**, or stretch to ~5s for a full outro.

---

## 6. Purpose and use

**Class:** staged reveal, fixed duration.

**Use it for:**
- Channel ident at the top of every NeroPay explainer
- Outro / sign-off
- Section break in a longer educational piece (short version, icon only, no wordmark)

**Don't use it for:** anything carrying information. It says "NeroPay" and nothing else, which is exactly its job.

---

## 7. Register note — reconciling with the main system

This piece allows **overshoot and settle**, which `neropay-motion-reference.md` §7 bans.

That's not a contradiction, it's a scope boundary: **the ban applies to the film, not the sting.** A brand mark is allowed a little snap because it's a punctuation mark, not a scene. But keep it small — a few degrees, one bounce, over-damped. If the logo boings, it's wrong.

Everything else stays consistent: no flat yellow (§3.2 of the reference — though here the mark is stroke-based so it barely applies), `ink` for anything readable, and the same palette tokens.

---

*Reference system: `neropay-motion-reference.md`. Other briefs: `brief-01-webflow.md`, `brief-03-infinitumx-neropay.md`.*

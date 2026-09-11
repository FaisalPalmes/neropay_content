# NeroPay video — motion graphics system and run brief (v3)

Paste this whole file as the first message of a fresh Claude Code session, and attach the seven
reference screenshots with it. Also commit it to the repo as `MOTION-SYSTEM.md` — it is the
permanent spec for every video from here on, not a one-off instruction.

---

## WHAT CHANGED ON 11 SEP 2026 — v3, Faisal's review of the v7.1 master

Faisal reviewed the first build on this spec (`video/b1-v7/`) and reversed the look, keeping the rest.
This section is the ruling; where it contradicts §2, §4, §5 or §8 below, it wins, and those sections carry
a `v3:` note at the line that changed. The reference build is now `video/b1-v8/`.

1. **The overlays are the liquid-glass system again, not the seven flat archetypes.** Faisal: "I want the
   previous liquid glass look, the animated bar charts for stats, the nice large 0.5% that gets a line
   through it." The glass is the v6 system (`video/b1-rate-you-were-quoted/build.mjs`, `glass()`): every
   panel carries its own blurred copy of the footage lined up with the frame under it and clipped by its
   rounded box, a frost tint, one sheen pass on the cue, a polished rim, a soft low shadow. It arrives flat
   and empty, leans into 3D on its cue, its rows and bars arrive on her words, and it leaves as one fade
   with the lean coming off. Stats are animated: bars scale up on the word, figures count up, the bar she
   has moved on from turns grey. The hook is the large "0.5%?" chip with the yellow line drawn through it on
   "not". No dark flat panels, no hairline boxes, no numbered spec tables.
2. **The lean goes toward the centre of the frame.** A panel in the left column leans `rotationY: +7`
   (its right edge, nearest her, comes forward); a panel in the right column leans `-6` or `-7`. v7 turned
   the statement the other way (`rotateY(-10deg)` on a left-column panel) and Faisal called it "tilted the
   wrong way" — the far edge came forward. The §4 line "rotateY(-14deg) … tune against the SIDE frame" is
   superseded by this rule.
3. **The title keeps v7's animation on a light theme.** A small white slab at the centre on "Explained",
   the whole frame on "NeroPay". Near-white ground (`#fbfaf7`), three static, heavily blurred yellow blooms
   behind it with a faint white frost over them (blurred glass), black type. The wordmark is **NeroPay** in
   black — not "Pay" in yellow — with a yellow full stop that pops in (ten frames, `back.out(2.4)`) as the
   word finishes and takes one shallow breath. Kicker in `#6d6c68`, episode line in `#4d4c48` italic.
4. **The end card is the same stage.** Same ground, blooms and full stop: NeroPay. → Subscribe for more →
   the six generic lines as white frosted tiles, one per two beats → NeroPay. + the concession line. No
   charcoal, no grid.
5. **A panel never covers her face — she takes one side of the frame, the panel takes the other.** Faisal's
   second review of v8 (11 Sep): "some of them cover the staff's face … make it so the staff is either on the
   left or right side of the screen and the overlays are on the other side." So the crop per shot now carries
   a side: `data/angles.json` says `ava: "L" | "R" | "C"`, `angles.mjs` cuts the window so her face sits 30 %
   in from that edge, and every panel in `build.mjs` goes in the other column (`colX`), with the lean following
   the column (`colLean`). The sides alternate down the video — chip right, ladder left, month left, fixed
   right, formula left, sum right, flat left, questions right, two-minutes left, follow right — and the camera's
   push onto a panel stops at 1.12 (`ZMAX`) so the push, which is all sideways once she is on an edge, never
   carries her out of frame. §1's "SIDE puts the presenter in the right third" is superseded: SIDE is the
   1.5× window, and which third she is in is decided per shot by the panel.
   *v8.3, later the same day: the crop is gone too. Faisal's preview note — "I don't want it always zoomed in with the
   staff on the left or right … don't zoom in unless there's an overlay" — makes every proxy the whole FRONT frame
   and moves the side framing into the virtual camera: flat when nothing is up, a 1.42× push to her side only while a
   panel is on screen, overlays outside the camera so they keep their size. The three angles of §1 are now a camera
   behaviour, not a cut.*
6. **Unchanged:** the three angles (§1), the words-first timing (v8 times every piece to a word, as v6 did;
   the §3 law stays the target and its report is still worth running), the alpha compositing principle (§4 —
   the graphics are authored inside the HyperFrames composition, so alpha is native), the rails (§9), and
   Faisal's 9 Sep decision that the AI disclosure is made at upload, not in the frame.

---

## WHAT HAS CHANGED SINCE THE LAST RUN (v2, 10 Sep 2026)

Four things. Read all four before you touch anything, because the third one invalidates a rule
that was in the previous briefs.

1. **Three camera angles per video, not one.** Two or three start frames are supplied per video and
   you pick the right one per shot.
2. **Overlays now hold on screen long enough to be read.** They were building and leaving too fast.
3. **Overlays are rendered with a real alpha channel and composited normally — the "build on pure
   black and Screen blend" rule is dead.** That rule only ever existed because Higgsfield output has
   no alpha. We render our own overlays now, so it does not apply.
4. **There is a defined motion graphics vocabulary.** Seven named archetypes, drawn from the
   attached references. Pick from them; do not invent a new look per overlay.

---

## 1. THE THREE-ANGLE SYSTEM

### The angles

| Code | Framing | Purpose |
|---|---|---|
| **FRONT** | Presenter centred, front on, locked off, desk in shot | The default. Talking beats, and small type-only overlays that sit above or beside the head. |
| **SIDE** | Presenter in the **right third**, camera angled so the left two-thirds is clean negative space with the wall receding in perspective | Every large overlay. The empty left volume is where a panel, table, card fan or floating document lives, sitting in the room rather than stuck on the glass. |

*v3: SIDE is the 1.5× window; the third she sits in is set per shot (`ava` in `data/angles.json`), opposite the panel, alternating down the video. Same for CLOSE, which does carry a panel in v8 when the shot needs the emphasis.*

| **CLOSE** | Tighter on the face, shoulders up | Emphasis beats only. The concession, the number said out loud, the sign-off. **Never carries an overlay.** |

The SIDE angle is the whole reason the graphics can look like the references. Look at reference 1
and reference 5: the subject is right of frame and the graphic occupies real space to their left,
angled to match the wall. That is a framing decision, not an effects decision.

### Picking the angle for each shot

The overlay decides the angle. Apply in this order:

1. Shot carries a **large overlay** (table, card fan, floating document, arc cycle) → **SIDE**.
2. Shot carries a **small type-only overlay** (label, arrow relation) → **FRONT**.
3. Shot is an **emphasis beat** — the concession, the headline figure, the sign-off, the hook's
   turn — and has no overlay → **CLOSE**.
4. Everything else → **FRONT**.
5. **Then fix the repeats.** If two adjacent shots both land on FRONT with no overlay change, move
   one to CLOSE. Cutting FRONT to FRONT on identical framing is a jump cut, which is what the old
   single-angle videos were stuck with. Three angles is how that problem goes away — do not waste it.

Write the chosen angle into the manifest as `"angle": "FRONT" | "SIDE" | "CLOSE"` **at manifest-build
time**, before any generation. The angle determines the start frame, and the start frame is an input
to the generation — it cannot be decided later.

### The start frames folder

```
00 start frames/
  ├── FRONT.png
  ├── SIDE.png
  └── CLOSE.png        (optional — if absent, fall back to FRONT and say so in the log)
```

Upload each supplied frame to Higgsfield **once** with the media upload widget. Record all of them:

```json
"start_frames": {"FRONT":"<media_id>","SIDE":"<media_id>","CLOSE":"<media_id>"}
```

Then every shot passes its own angle's `media_id` as `role: "start_image"`. Nothing else about the
generation call changes.

**Check before you generate:** all supplied frames must be the same room, same person, same clothing,
same lighting. If FRONT and SIDE disagree on any of those, the cuts will not hold together and no
amount of editing fixes it. Say so and stop rather than generating twenty clips that do not match.

---

## 2. THE MOTION GRAPHICS VOCABULARY

Seven archetypes, each taken from one of the attached references. Use the closest one. Do not
invent an eighth without asking.

*v3: retired as the look. The shapes are still a useful vocabulary for what a graphic is doing (a
comparison, a document, a relation, a list) but every one of them is drawn as liquid glass now — see the
v3 section at the top and `video/b1-v8/build.mjs`.*

### What these references have in common — this is the vibe, get it right
- **One accent colour on otherwise white or grey type.** Never two accents in one graphic.
- **Bold, all-caps, tightly tracked sans.** Labels are small and confident, not shouty.
- **Elements live in the room.** They sit in perspective, angled to the wall, with a soft shadow —
  not flat stickers pasted on the front of the frame.
- **Nothing crosses the face.** Ever. The graphics occupy negative space, which is what the SIDE
  angle exists to provide.
- **Restraint.** One idea per graphic. No boxes inside boxes, no gradients, no glow, no bounce.
  *v3: the glass itself is a gradient tint, a sheen and a rim, and a bar landing may overshoot a few
  percent (`back.out`) — those are the look Faisal chose. "One idea per graphic" still holds.*

### The seven

**A — ARC CYCLE** *(reference 1: "LAUNCH DELAYED" curved over an arc with "TOO LATE", "PAY TWICE",
"EARLY" following the circle)*
Text set on a circular path. One phrase at the apex in yellow, supporting phrases around the arc in
white at 45% opacity, small arrows between them implying a loop.
**Build:** the arc draws clockwise, phrases fading up as the sweep passes each one, apex phrase last.
**Use it for:** a cycle or a chain of consequences. The fee stack. "Quoted → signed → charged →
repeat." Not for data.

**B — KINETIC LABEL** *(reference 2: "EDITORIAL EXPLAINERS")*
One line of yellow caps in negative space, at roughly the speaker's eye height.
**Build:** mask on left to right, 8 frames. No fade, no slide.
**Use it for:** naming a concept at the moment it is said. "EFFECTIVE RATE." "AVERAGE SALE."
The cheapest and most-used graphic in the set — reach for this before anything heavier.

**C — CARD FAN** *(reference 3: seven rounded portrait cards arced across frame with small yellow
captions beneath each)*
Rounded portrait cards on a shallow arc, each with a small yellow caption under it, each rotated a
few degrees along the arc.
**Build:** cards deal in from the centre outward, 3-frame stagger, slight scale-up settle. Captions
fade in after their card lands.
**Use it for:** a set of comparable things. This is the right home for B1's card-type ladder — debit,
credit, business, Amex, international — as five cards with the rate under each.
**Constraint:** in the references the cards pass *behind* the speaker. That needs a matte of the
presenter and we are not doing that yet. Keep the fan entirely in the SIDE angle's negative space
and it reads fine without occlusion. Do not attempt to matte the presenter in this run.

**D — GLASS SPEC TABLE** *(reference 4: rounded panel, hairline rows, CLIENTS / PAY / LENGTH with
right-aligned values)*
A rounded rectangle with a semi-transparent dark fill, a 1px hairline border at about 25% white,
and hairline row dividers. Label left in white caps, value right-aligned. One value per panel in
yellow — the one that matters.
**Build:** panel scales up from 0.96 with its fill fading in, 10 frames. Rows then reveal top to
bottom, 4-frame stagger, each row's divider drawing before its text.
**Use it for:** every figure comparison NeroPay makes. This is the workhorse — B2's cafe and
restaurant cards, the charge breakdowns, the questions-to-ask list. If you are unsure which
archetype to use for a data overlay, it is this one.

**E — FLOATING DOCUMENT** *(reference 5: a webpage screenshot on a perspective-tilted card hovering
beside the speaker)*
An image — a statement, a screenshot, a rate card — on a rounded card, rotated on the Y axis to sit
flat against the room's perspective, with a soft drop shadow.
**Build:** the card arrives from slightly further away and rotates the last few degrees into place,
14 frames, heavy ease-out. Then a slow, almost imperceptible drift for the rest of the hold so it
does not feel frozen.
**Use it for:** the specimen statements. B1's whole middle section is a person talking about a
document — put the document in the room next to her.

**F — ARROW RELATION** *(reference 6: "HARD WORK ——→ RESULT")*
Two terms joined by a thin line with an arrowhead, spanning the negative space.
**Build:** left term masks on, line draws left to right, arrowhead pops on arrival, right term masks
on. Roughly 20 frames end to end.
**Use it for:** cause and effect, or a two-term formula. "TURNOVER ÷ TRANSACTIONS → AVERAGE SALE."
Works front-on, above the head.

**G — STATUS PILLS** *(reference 7: green tick + yellow filled pill, red cross + outlined pill)*
Stacked lozenges. Each has a badge on the left — tick or cross — then the pill. The affirmative pill
is filled yellow with dark text; the negative is outlined only, in white or a muted red, never filled.
**Build:** badges pop in first with a single-frame scale overshoot, pills expand from the badge
outward, 8 frames each, 5-frame stagger down the stack.
**Use it for:** do this / not that. What to ask a provider versus what to ignore. Good deal versus
not. Two or three rows maximum — four is a table, and a table is archetype D.

### Mapping the existing videos
- **B1** — card ladder → **C**. The statement → **E**. The effective-rate formula → **F**. The
  five questions → **G**. The charge lines → **D**.
- **B2** — the two options → **D**. The coffee worked example → **D**. £26.67 crossover → **B** or
  **F**. Cafe and restaurant → **D**. The formula → **F**.
- **A1** — the three steps → **G** or **D**.

---

## 3. THE TIMING LAW — this is the fix that was asked for

Every overlay has three phases, and the middle one was too short.

```
BUILD  →  HOLD  →  EXIT
```

- **BUILD** — no more than **25% of the overlay's duration**, and never more than 20 frames.
  The graphic assembles and stops. It does not keep animating.
- **HOLD** — the graphic sits **completely still and fully formed**, so it can actually be read.
  Minimum **1.5 seconds**, and longer for denser graphics:

  ```
  hold_seconds = max(1.5, on_screen_words × 0.4)
  ```

  A six-field spec table is roughly 12 words, so 4.8 seconds of hold. A two-word kinetic label gets
  the 1.5s floor. **Count the words and apply the formula — do not eyeball it.**

- **EXIT** — 6 to 8 frames, or no exit at all if the shot cuts underneath it. A cut is a cleaner
  exit than an animation.

**If build + hold + exit does not fit inside the shot, the graphic is too complex for that shot.**
Simplify the graphic. Do not speed up the build, do not shorten the hold, and never stretch the
presenter clip to make room.

Assert this in code when you generate each overlay, and fail loudly rather than quietly compressing
the hold. The hold is the entire point of this change.

---

## 4. HOW OVERLAYS ARE BUILT — alpha, not Screen blend

### The change
Previous briefs said to build overlays on pure solid black and composite with a Screen blend. That
was a workaround for Higgsfield having no alpha channel. **We render overlays ourselves now, so
render them with real transparency and composite them properly.**

This matters because Screen blend makes every dark pixel disappear — which rules out exactly the
things the references depend on: dark translucent panels, soft shadows, muted outlines, anything
that is not brighter than the footage.

Verified working, both routes:
- PNG sequence with alpha, composited straight over the video — no intermediate encode, no loss.
- Or encode to ProRes 4444 (`-c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le`) if an editable
  intermediate is wanted.

### The pipeline
1. Build the graphic as an HTML page at the master resolution, transparent background
   (`body { background: transparent }` — no black fill anywhere).
2. Drive it with a JavaScript `setFrame(n)` function implementing BUILD / HOLD / EXIT.
3. Screenshot each frame with Playwright at `omitBackground: true` so the PNGs carry alpha.
4. Composite in ffmpeg:

```bash
ffmpeg -y -i presenter.mp4 -framerate 25 -i ov/%05d.png \
  -filter_complex "[0][1]overlay=x=0:y=0:format=auto:enable='between(t,START,END)'" \
  -c:v libx264 -crf 18 -pix_fmt yuv420p out.mp4
```

`anim.py` in `neropay-edit-pipeline.zip` is the working reference for steps 1–3. Add
`omitBackground: true` to its screenshot call — it currently renders opaque.

### Techniques for the archetypes
- **3D tilt (D, E):** `transform: perspective(1400px) rotateY(-14deg) rotateX(3deg)`. Tune the
  rotateY against the SIDE start frame so the card sits parallel to the wall behind it. Get this
  angle right and the graphic looks like it is in the room; get it wrong and it looks pasted on.
  *v3: superseded — the lean is toward the centre of the frame, `+7` in the left column, `-6/-7` in the
  right, applied on the cue and taken off on the exit (`glass()`, `lean`). The v7 statement leaned the
  other way and read as tilted wrong.*
- **Curved text (A):** SVG `<textPath>` on a `<path>` circle. Animate with `startOffset` and a
  `stroke-dasharray` sweep on the guide arc.
- **Frosted glass (D):** `backdrop-filter` does **not** work here — there is nothing behind it on a
  transparent page to blur. Use a semi-transparent dark fill instead
  (`rgba(16,18,22,0.62)`) with a `1px solid rgba(255,255,255,0.22)` border. Tested, and it reads
  correctly over footage. If real frosted glass is wanted later it has to be done at composite time
  by blurring the video under the panel shape — do not attempt that in this run.
  *v3: real frosted glass is what is wanted, and it is done the way this paragraph anticipated: the panel
  carries a blurred copy of the clip (`cut.mjs` writes one beside every cut), positioned to line up with
  the frame and clipped by the panel, so the blur edge is the panel edge and any transform is safe. No
  `backdrop-filter`, no flat dark fill.*
- **Shadow (C, D, E):** `filter: drop-shadow(0 24px 48px rgba(0,0,0,0.45))`. Soft and low. This is
  what sells the graphic as an object in the room.

---

## 5. COLOUR AND TYPE

| Role | Value |
|---|---|
| Accent | **`#F5C518`** — the NeroPay yellow, unchanged |
| Primary type | `#FFFFFF` |
| Secondary type | `#FFFFFF` at 45–60% opacity |
| Panel fill | `rgba(16,18,22,0.62)` |
| Hairline | `rgba(255,255,255,0.22)`, 1px |
| Negative pill outline | `rgba(255,255,255,0.55)` or `#D9534F` for a genuine "don't" |
| Face | Inter / Inter Display. Labels 600–800, all caps, `letter-spacing: 0.06em`. Values 600, tracking normal to slightly tight. |

*v3: the glass panels keep v6's type — Poppins 500–800, tight tracking, labels in sentence case at 60–90 %
white, values in the yellow. The light stages: ground `#fbfaf7`, type `#141416`, kicker `#6d6c68`, episode
line `#4d4c48`, the full stop `#F5C518`. The panel-fill and hairline rows above belong to the retired flat
look.*

**On the accent:** the references use an acid lime-yellow. Ours is a warmer gold. Keep ours — it is
on the statements, the print, the end cards and the site, and a second yellow is a worse trade than
a slightly less punchy one. If it disappears against the footage, fix it with weight and size, not
with a new colour. Flag it if that happens rather than substituting.

---

## 6. ON WHETHER TO GENERATE THE GRAPHICS IN HIGGSFIELD INSTEAD

**No.** The attached references were not generated — they were composited over filmed footage in a
motion graphics application. The tells are unambiguous: type is pixel-identical and correctly kerned
frame to frame, hairlines stay exactly one pixel, panel edges do not breathe, and the cards occlude
cleanly against a moving subject. No video model holds text like that, and every one of these
graphics carries text that has to be exactly right.

Render them. It is free, it is exact, it is re-renderable when a figure changes, and it is the only
route that gets a real alpha channel. Higgsfield stays where it is genuinely better: the presenter.

---

## 7. THE RUN — same shape as before

Stages, gates and Drive structure are unchanged from the previous briefs, with these amendments:

- `00 start frame/` becomes **`00 start frames/`** and holds FRONT, SIDE and CLOSE.
- The manifest gains `"angle"` per shot and a `"start_frames"` map.
- Each overlay entry gains `"archetype"` (A–G) and computed `"build_f"`, `"hold_f"`, `"exit_f"`,
  and the assertion that they sum to no more than the shot length.
- The review folder gains **`overlays-contact.png`**: the final held frame of every overlay at full
  size, so every figure can be read and checked in one image.

**The two hard gates stand:** tell me the credit total before generating anything, and stop at the
review gate.

Two additions to the review checklist, both from this change:
- **Does every overlay hold still long enough to read?** Watch the rough cut and read each one. If
  you cannot finish reading before it moves, the hold is wrong.
- **Do the angles cut together?** Same room, same person, same clothing, same light across FRONT,
  SIDE and CLOSE. And no FRONT-to-FRONT cut left in the timeline.

---

## 8. THINGS NOT TO DO

- Do not put a graphic over the presenter's face or body. That is what the SIDE angle is for.
- Do not use two accent colours in one graphic.
- Do not animate during the hold. Still means still. The one exception is the slow drift on
  archetype E.
- Do not add glow, bevel, gradient fills, bounce easing or motion blur.
  *v3: the glass has its gradient tint, sheen and rim by design; a small `back.out` overshoot on a bar or a
  figure is allowed. Still no motion blur, still nothing glowing for its own sake.*
- Do not build overlays on black and Screen-blend them. That rule is retired.
- Do not attempt to matte the presenter for occlusion in this run.
- Do not stretch a presenter clip to fit a graphic.
- Do not invent an eighth archetype without asking.

---

## 9. RAILS — unchanged, not negotiable

- **Never mention NeroFinance, merchant cash advance or terminal finance** in any frame, caption,
  filename or description. s.21 FSMA — unauthorised financial promotion is a criminal offence.
- AI-presenter disclosure on screen inside the first three seconds, and persistent.
- No guaranteed savings, stated or implied. Illustrative figures labelled as such.
- Every concession in the script stays in. They are not padding.
- No real merchant, no real transaction data, no live dashboard, no KYC documents.
- Voice is "we", never Faisal, never a named employee.
- Do not touch Drive folders outside the video's own folder. Do not push, publish or post.

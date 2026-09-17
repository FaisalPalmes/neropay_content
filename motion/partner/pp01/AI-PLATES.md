# PP01 — AI-generated plates: the brief for the video generator

Faisal, 17 Sep 2026: the motion graphics stay ours (rendered HTML, ElevenLabs, this pipeline), but certain beats may sit
on a generated clip — a better-lit, better-textured object or background — with our type, captions, modules and
graphics composited over it. No people in any of them. These are texture for a beat, never the body of the video
(`motion/CLAUDE.md`, "Higgsfield plates"), and each is used for a few seconds under our graphics.

Generate these in the video tool of your choice, then hand the files over (chat attachment, or drop them at the repo
root through the GitHub web uploader with the names below and I will move them into `plates/`). I will not run the
final render until they are in.

## Hard specs — every clip

- **No people, no hands, no faces, no text, no numbers, no logos, no brand marks, no card numbers, no screens with UI.**
  We set every word and every figure; a generated digit is a compliance risk and a generated logo is a trade-mark one.
- **Any card terminal must be generic**: a plain white slab, blank dark screen, no maker's mark, no keypad brand. We put
  our own screen on it in post. Never a competitor's device or colour.
- **White world.** Background off-white `#FBFAF7` to `#F4F2EC`, matte paper or white studio cyclorama, so it blends
  with our ground. Light from the top-left, soft but directional, one key and a soft fill. No dark or black backgrounds.
- **Sharp and deep.** Deep depth of field, everything in focus, **no bokeh**, no lens flare, no film grain, no vignette.
- **Camera locked off or a very slow push / drift.** No whip pans, no handheld shake, no zoom bursts, no cuts inside the
  clip. We add the movement.
- **Palette.** Pale surfaces; the brand yellow `#F5C518` only as a small accent (an edge, a rim, one object); a little
  blush `#F7CFC9` and lilac `#D9CCF8` in the glass tints. No blue, no green, no saturated colour fields.
- **Format.** 4:5 (1080×1350) preferred; 1:1 at 1080 or 9:16 at 1080×1920 if the tool can't do 4:5 (I will crop).
  24 or 30 fps, H.264 MP4, highest quality the tool offers, no watermark. **6–10 seconds each**; a seamless loop
  where the prompt says so.
- **Naming.** `pp01-plate-01-light.mp4` … `pp01-plate-07-close.mp4`, as below.

Negative prompt to paste into every generation, where the tool takes one:
`people, person, hands, face, text, letters, numbers, logo, watermark, brand, card number, UI, screen content, bokeh,
blur, lens flare, film grain, vignette, dark background, black background, neon, blue, saturated colour, camera shake,
fast motion, cuts, glitch`

## The seven plates and where each goes

### 01 — moving light on paper (used under every section, looped)
File `pp01-plate-01-light.mp4` · 10 s · seamless loop

> A flat off-white paper surface (#FBFAF7) filling the frame, viewed straight on, with soft refracted light slowly
> drifting across it — the caustic pattern that sunlight makes through a sheet of glass, pale and low-contrast, gently
> moving from top-left to bottom-right. Faint paper texture. Nothing else in frame. Very subtle, almost still. Seamless loop.

How it is used: multiplied onto our ground at low opacity so the floor carries moving light under every section — the
"4D" feel — without any object in it. This is the most useful plate of the seven; if you only make one, make this one.

### 02 — hook: a frosted glass payment card, the light sweeping over it
File `pp01-plate-02-card.mp4` · 8 s

> A single frosted glass payment card, blank, no numbers, no chip, no logo, tinted a faint warm yellow, floating and
> turning very slowly in a white studio. A soft band of light sweeps across its face once, catching the bevelled edge.
> Deep focus, off-white background, matte paper floor with a soft contact shadow beneath. Slow, calm, premium.

Where: the hook (0–11 s), top-right, behind "You could be earning £100–£300", replacing our rendered ring on that beat.

### 03 — who we are: a paper-model street of small shopfronts
File `pp01-plate-03-street.mp4` · 8 s

> A miniature architectural model of a row of five small shopfronts made of white card and pale grey board, no signs,
> no text, blank awnings, viewed from a three-quarter high angle, on an off-white paper ground. Soft top-left daylight,
> deep focus. The camera drifts very slowly sideways along the row. Clean, minimal, like a model on an architect's desk.

Where: section 1 (11–25 s), as a window behind "Card terminals. Free till software." while the shops light up.

### 04 — bonus: glass coins, a stack rising
File `pp01-plate-04-coins.mp4` · 8 s

> Three thick frosted glass discs, blank, tinted pale yellow, resting on an off-white paper surface, lit from the top
> left so light passes through their edges. One disc slowly lifts and settles onto the stack. Deep focus, no text, no
> markings, soft contact shadows. Minimal and quiet.

Where: section 2 (25–39 s), beside the Bonus Dial as the steps £100 · £200 · £300 rise.

### 05 — share: frosted glass steps climbing
File `pp01-plate-05-steps.mp4` · 8 s

> A staircase of six frosted glass blocks rising from left to right, tinted pale lilac, on an off-white paper ground,
> lit from the top left with light refracting inside each block. A soft band of light climbs the steps once. Deep focus,
> no text, no numbers, no people. Calm, architectural, premium.

Where: section 3 (39–50 s), behind the Rate Climb as the count passes 3, 21, 36, 61, 111.

### 06 — quiet month: a single glass tile rocking gently
File `pp01-plate-06-tile.mp4` · 8 s · seamless loop

> One square frosted glass tile, blank, tinted faint blush, standing on its edge on an off-white paper surface and rocking
> very slowly, a soft highlight moving across its face as it moves. Deep focus, soft contact shadow, nothing else in
> frame. Seamless loop.

Where: section 4 (50–55 s), at the edge of the frame beside "Your bonus is yours either way."

### 07 — close: a white card terminal on a counter, light sweep
File `pp01-plate-07-close.mp4` · 10 s

> A generic white card terminal — a plain white slab with a blank dark screen, no keypad, no brand, no maker's mark —
> standing on a pale stone counter in a bright white café interior with no people, no signage and no text anywhere.
> Soft daylight from the top left, deep focus, one slow gentle push-in. Minimal and calm.

Where: the close (55–68 s), as a plate behind "neropay.app/partners"; our own screen UI is composited onto the
terminal, and our rendered terminal may stay in front of it instead if the generated one does not match.

## What I do with them

- Pull frames from each clip (ffmpeg, 30 fps) and load the frame for the current time into the composition — a CSS layer
  under the world for plate 01, a rounded glass window inside the section for 02–07 — so every frame renders
  deterministically as it does now.
- Colour-grade each plate to the ground (levels lifted to the paper white, a touch of warmth) so nothing looks pasted.
- Keep the type, the captions, the modules and the terminal exactly as they are; the plates sit behind or beside them.
- Rail 4: a generated clip under a caption is synthetic content. The upload keeps the "synthetic content" setting ticked
  and the description says "Visuals partly generated with AI. Voice generated with AI."

## Then the final render

Once the plates are in and graded: the 4:5 render (about 30 minutes), `finish.sh`, the spike and diff scans, the contact
sheet, the Higgsfield upload and the Drive note — the same hand-over as v3.

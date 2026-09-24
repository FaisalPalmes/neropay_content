# NeroConnect explainer v3: Higgsfield image prompts

Written 24 Sep 2026 for Faisal to generate. He sends the results back before any change is made to the film.

**Settings for every prompt:** GPT Image 2.5 (or Nano Banana Pro for the edits), `quality: high`, `resolution: 2k`.
Aspect ratio is given per prompt. Workspace `9fbbb426` (the private workspace has no credits).

**Rules every image follows:** no people and no hands. No text except where a prompt asks for "YOUR LOGO". No brand,
no maker's mark, no card-scheme logo. Everything sharp with deep focus and no bokeh. Soft, even studio light. A plain
seamless background, so each image can be cut out and placed on the video's glass. **The terminal's maker is never
named, in a prompt or anywhere else.**

---

## A. The real terminal, unbranded. Attach the photo of our terminal to each of these

A single terminal is the priority. A1 is the one image that must work, and A2–A4 are the angles.

**A1: front, three-quarter left (the hero).** 4:5
```
Edit the attached product photo of a card payment terminal. Keep the hardware exactly as it is: the same shape, proportions, colours, materials, screen, buttons, printer head and contactless symbol. Remove every "NeroPay" wordmark, logo and name wherever it appears: on the bezel, on the printer head, on the screen and on the back. In the place of the main wordmark on the front bezel, print the words "YOUR LOGO" in a clean, neutral, medium-weight sans-serif, dark grey, the same size and position as the original wordmark, looking printed on the plastic rather than overlaid. On the screen, keep a simple payment keypad showing £0.00, with no brand name and no other text. Present the terminal standing upright, turned about 25 degrees to the left, camera at chest height looking slightly down. Isolated on a plain seamless warm off-white background (#FBFAF7) with a soft natural contact shadow directly beneath. Soft, even studio light from the upper left. Photographic, crisp, everything in focus, no bokeh, no reflections of people, no text other than "YOUR LOGO", no other logos.
```

**A2: front, three-quarter right.** 4:5. Use the A1 prompt, but change *"turned about 25 degrees to the left … light from the upper left"* to:
```
turned about 25 degrees to the right, camera at chest height looking slightly down … soft, even studio light from the upper right.
```

**A3: straight on, flat to camera (for the store scene's shelf).** 4:5. Use the A1 prompt, but change the presentation sentence to:
```
Present the terminal standing upright, facing the camera straight on, camera level with the middle of the screen.
```

**A4: lying on a counter, top-down at 30 degrees (for the dashboard and "taking payments" beats).** 16:9
```
Edit the attached product photo of a card payment terminal. Keep the hardware exactly as it is. Remove every "NeroPay" wordmark, logo and name wherever it appears, and print "YOUR LOGO" in a clean neutral sans-serif, dark grey, where the main wordmark was on the front bezel, looking printed on the plastic. The screen shows a simple payment keypad with £0.00 and no brand name. Place the terminal lying on a pale, plain, matte stone counter, seen from above at about 30 degrees, set to the right third of the frame with empty counter on the left for text. Nothing else on the counter. Soft, even daylight from the left, a soft short shadow. Photographic, crisp, everything in focus, no bokeh, no people, no hands, no text other than "YOUR LOGO", no other logos.
```

**A5 (optional): the same terminal carrying the invented platform's brand, to match scene 10's login.** 4:5. Use the A1
prompt, with *"YOUR LOGO"* replaced by:
```
a small solid dark navy rounded-square mark followed by the word "Harbourline" in a clean medium-weight sans-serif, dark navy (#1D3B53)
```
Harbourline Ltd is the invented platform in the explainer's data. The series rule says the terminal carries a placeholder
("YOUR LOGO"), so A5 is only used if Faisal prefers the story to match the login screen.

## B. The store: tills and accessories. We have no real images of these

**B1: a countertop till, unbranded.** 4:5
```
Product photo of a modern countertop EPOS till: a slim tablet-style touchscreen on a sleek white and pale grey swivel stand, with a small matching receipt printer beside it. The screen shows a simple grid of blank product tiles in soft neutral colours, with no words, no numbers and no logos. No brand, no maker's mark, no text anywhere. Isolated on a plain seamless warm off-white background (#FBFAF7) with a soft contact shadow. Three-quarter view from the left, camera slightly above. Soft, even studio light. Photographic, crisp, everything in focus, no bokeh, no people, no hands.
```

**B2: accessories, a small still life.** 4:5
```
Product still life of card payment terminal accessories, neatly arranged: a white charging dock for a handheld card terminal (empty, no terminal in it), three rolls of white thermal receipt paper standing on end, and a folded charging cable. White and pale grey, matte. No brand, no maker's mark, no text, no logos anywhere. Isolated on a plain seamless warm off-white background (#FBFAF7) with soft contact shadows. Seen from the front at a slight angle from above. Soft, even studio light. Photographic, crisp, everything in focus, no bokeh, no people, no hands.
```

## C. The opening: cafés, takeaways, shops (optional, for the three tiles in scene 1)

Each image sits inside one of the three glass tiles, so every one is square and has nothing but the place in it.

**C1: café.** 1:1
```
Interior of a small independent café counter in the morning: a coffee machine, cups stacked on top, a glass pastry case with pastries, pale wood and white tiles, warm light. No people. No text, no signs, no menus with writing, no logos or brand names anywhere. Straight-on view at counter height. Photographic, crisp, everything in focus, deep depth of field, no bokeh.
```

**C2: takeaway.** 1:1
```
Interior of a small independent takeaway counter in the evening: a stainless steel counter, a warming display with trays of food, paper bags folded on the side, white tiles, warm light. No people. No text, no signs, no menu boards with writing, no logos or brand names anywhere. Straight-on view at counter height. Photographic, crisp, everything in focus, deep depth of field, no bokeh.
```

**C3: shop.** 1:1
```
Interior of a small independent corner shop by the till: neat shelves of unbranded plain packaged goods in soft colours, a clean counter in the foreground, bright even daylight. No people. No text, no readable labels, no signs, no logos or brand names anywhere. Straight-on view at counter height. Photographic, crisp, everything in focus, deep depth of field, no bokeh.
```

---

## What each image is for

| Image | Scene | Replaces |
|---|---|---|
| A1 | s11 store (hero), s16 before the outro | the old 3D terminal render |
| A2 | s2 "NeroPay processes the payments" or s6 "they're taking payments" | nothing yet: adds hardware to a text scene |
| A3 | s11 store shelf | — |
| A4 | s3 dashboard or s6, as a plate under the glass | — |
| B1, B2 | s11 "tills and accessories" | the two empty text tiles |
| C1–C3 | s1 opening tiles | the plain word tiles |

**Rail 4:** a generated image in the film is synthetic content, so the upload needs the altered-or-synthetic setting and
the description line. The voice already needs both.

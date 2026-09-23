# Hero still — Higgsfield prompt (23 Sep 2026)

The first App Store screenshot, after Square's: a card tapped on a phone. Higgsfield makes the photograph; the
headline goes on in `index.html#1` and the phone's screen is replaced with a real NeroPay screen, so the model only
has to get the hands, the card, the phone and the light right.

**Settings:** a photoreal image model, portrait 9:16 (the page crops to 1320 × 2868), 4 variations.

## Prompt (v2, 23 Sep 2026 — Faisal: a Visa card, two women, colourful nail art)

> Photorealistic close-up product photograph, vertical format. Two women's hands meet in the centre of the frame
> against a plain warm off-white plaster wall with a faint natural texture. The lower hand, a shop owner's, holds a
> modern black smartphone upright from below, screen facing the camera almost straight on (tilted no more than ten
> degrees), the phone filling the middle half of the frame vertically and centred left to right. The phone has thin
> even bezels, rounded corners and no logo. Its screen is a flat, evenly lit, pure chroma green (#00FF00) with no
> reflections, no glare and nothing displayed. The upper hand, a customer's, comes in from the top right holding a
> deep royal-blue Visa debit card by its edge and touches the card flat against the top third of the phone's screen,
> the card overlapping the phone's top edge at a slight angle. The card is clean and minimal: the word "VISA" in
> crisp white capitals in the bottom right corner, a gold EMV chip on the left, and a small white contactless wave
> symbol beside the chip. Nothing else on the card: no cardholder name, no card number, no expiry date, no bank
> name, no other text. The customer has long glossy coffin-shaped acrylic nails with gel nail art: a lilac-to-pink
> ombré with fine gold foil lines and a few tiny clear rhinestones near the cuticles. The shop owner has medium-length
> almond-shaped gel nails in glossy emerald green with a thin gold chrome tip. Natural, realistic hands with five
> fingers each; one hand a medium brown skin tone, the other a deep brown skin tone. No rings, no watches, no
> bracelets, no tattoos. Soft daylight from the left, gentle natural shadows on the wall. Everything in sharp focus
> front to back, deep depth of field, f/8, 50mm lens, no bokeh, no blur. Leave the top quarter and the bottom fifth
> of the frame as clear empty wall. Clean, bright, premium, true-to-life colour.

## Negative prompt

> cardholder name, card number, digits, expiry date, bank name, extra text, misspelled logo, distorted lettering,
> Mastercard, Apple logo, watermark, yellow card, extra fingers, fused fingers, deformed hands, broken nails, chipped
> polish, rings, watches, bracelets, screen content, app interface, screen reflection, glare, bokeh, shallow depth of
> field, blurred background, motion blur, café clutter, faces, dark moody lighting, heavy shadows, fisheye, wide angle
> distortion

## Why it is written this way

- **Green screen, flat to camera.** The phone's screen is replaced with a real NeroPay screen, so the App Store
  shows the app as it is (Apple's rule that screenshots show the app in use) and nothing on screen is invented.
  Keeping the phone within ten degrees of straight-on lets it be placed without warping.
- **A Visa card, otherwise blank (Faisal, v2).** Check the "VISA" lettering in every variation before using one:
  models often warp it, and Visa's brand rules do not allow an altered mark. If every variation is off, pick the best
  hands and the lettering can be cleaned up in the composite. Never a yellow card: it would read as a NeroPay card,
  and `CLAUDE.md` allows the terminal as the only branded object.
- **Sharp throughout, no bokeh:** the brand rule for every NeroPay frame.
- **Empty wall top and bottom:** room for the headline in white with the yellow marker.

## Still needed from Faisal before it ships

1. **A screenshot of the app's tap screen**, the one the customer taps against, full resolution from the phone.
   That goes on the green screen. Without it the keypad screen (£45.75) stands in.
2. **Confirmation that Tap to Pay on iPhone is live in the NeroPay app.** If it is, Apple's marketing guidelines for
   it apply to this image: the feature is named exactly "Tap to Pay on iPhone" if named at all, and Apple's own
   checkout screen must not be altered. The headline as built ("Take card payments on your phone.") does not use
   Apple's name.

## Feature slides — three more hand shots (23 Sep 2026)

For slides 3 (NeroPOS), 5 (Reports) and 6 (Payment links), so the carousel alternates: photo, glass screenshot, photo,
glass screenshot, photo, photo. Slides 2 and 4 stay bare screenshots in the yellow glass outline. Every shot uses the
same wall, the same shop owner's hand and the same green screen, so the cut-out and the screen swap work exactly as
on slide 1. Portrait 9:16, 4 variations each. Negative prompt as above, plus: `second phone, tablet, laptop, props`.

Common to all three (paste at the end of each): *Plain warm off-white plaster wall with a faint natural texture.
The phone is a modern black smartphone with thin even bezels, rounded corners and no logo; its screen is a flat,
evenly lit, pure chroma green (#00FF00) with no reflections, no glare and nothing displayed, facing the camera
almost straight on (tilted no more than ten degrees). The phone's top edge sits about a third of the way down the
frame and the phone fills the lower middle of the frame, centred left to right; the top third of the frame is clear
empty wall. The shop owner's hand is a deep brown skin tone with medium-length almond-shaped gel nails in glossy
emerald green with a thin gold chrome tip; no rings, no watches, no bracelets, no tattoos. Soft daylight from the
left, gentle natural shadows. Everything in sharp focus, deep depth of field, f/8, 50mm lens, no bokeh. Photorealistic,
clean, bright, true-to-life colour.*

**A — slide 3, NeroPOS (tapping the menu).** Photorealistic close-up product photograph, vertical format. One hand
holds a smartphone upright from below; the index finger of the same person's other hand, coming in from the lower
right, lightly touches the lower right quarter of the screen as if tapping an item on a menu.

**B — slide 5, Reports (reading the numbers).** Photorealistic close-up product photograph, vertical format. One
hand holds a smartphone upright, fingers wrapped around the back and the thumb resting on the left edge of the frame
of the phone, not on the screen, the phone tilted very slightly back as if being read.

**C — slide 6, Payment links (typing).** Photorealistic close-up product photograph, vertical format. Two hands hold
a smartphone upright from either side, both thumbs resting on the lower part of the screen as if typing, only the
thumb tips overlapping the screen.

## Feature slides, v2 — three different women, fair skin (Faisal, 23 Sep 2026)

Same three shots, same wall, phone and green screen; each slide now a different woman: fair to light skin, slim
hands, her own nails, and at most one small piece of jewellery, never the focus. Portrait 9:16, 4 variations each.

Common ending for all three: *Plain warm off-white plaster wall with a faint natural texture. The phone is a modern
black smartphone with thin even bezels, rounded corners and no logo; its screen is a flat, evenly lit, pure chroma
green (#00FF00) with no reflections, no glare and nothing displayed, facing the camera almost straight on (tilted no
more than ten degrees). The phone's top edge sits about a third of the way down the frame and the phone fills the
lower middle of the frame, centred left to right; the top third of the frame is clear empty wall. Natural, realistic
slim hands with five fingers each, no tattoos, no watch. Soft daylight from the left, gentle natural shadows.
Everything in sharp focus, deep depth of field, f/8, 50mm lens, no bokeh. Photorealistic, clean, bright,
true-to-life colour.*

Negative: `text, words, logos, brand names, Apple logo, watermark, extra fingers, fused fingers, deformed hands,
broken nails, chipped polish, chunky jewellery, large rings, watches, screen content, app interface, screen
reflection, glare, bokeh, shallow depth of field, blurred background, motion blur, props, second phone, faces, dark
moody lighting, heavy shadows, fisheye, wide angle distortion`

**A — slide 3, NeroPOS.** A woman with fair, light skin and slim, slender hands holds a smartphone upright from below
in one hand; the index finger of her other hand, coming in from the lower right, lightly touches the lower right
quarter of the screen as if tapping an item on a menu. Short squoval nails in a glossy milky nude-pink gel. One thin
plain gold band on the index finger of the tapping hand.

**B — slide 5, Reports.** A woman with fair, light skin and slim, slender hands holds a smartphone upright in one hand,
fingers wrapped around the back and the thumb resting on the left edge of the phone's frame, not on the screen, the
phone tilted very slightly back as if being read. Medium almond-shaped nails in a glossy deep cherry red. A delicate
fine gold chain bracelet on the wrist, only just in frame.

**C — slide 6, Payment links.** A woman with fair, light skin and slim, slender hands holds a smartphone upright
from either side with both hands, both thumbs resting on the lower part of the screen as if typing, only the thumb
tips overlapping the screen. Short rounded nails with a classic French manicure, soft sheer pink base and fine white
tips. One slim polished silver band on the ring finger of the left hand.

**Used (23 Sep 2026):** A → slide 3 (`photo-pos-src.webp`, nude nails, gold band) and B → slide 5
(`photo-reports-src.webp`, cherry nails, gold chain). Slide 6 keeps the v1 typing photo with the emerald nails, as
Faisal chose. `cut-photo.py` holds the fair-skin wall test, the reports shadow boxes and the luma matte at the screen edge.

# Hero still — Higgsfield prompt (23 Sep 2026)

The first App Store screenshot, after Square's: a card tapped on a phone. Higgsfield makes the photograph; the
headline goes on in `index.html#1` and the phone's screen is replaced with a real NeroPay screen, so the model only
has to get the hands, the card, the phone and the light right.

**Settings:** a photoreal image model, portrait 9:16 (the page crops to 1320 × 2868), 4 variations.

## Prompt

> Photorealistic close-up product photograph, vertical format. Two hands meet in the centre of the frame against a
> plain warm off-white plaster wall with a faint natural texture. The lower hand, a shop owner's, holds a modern
> black smartphone upright from below, screen facing the camera almost straight on (tilted no more than ten
> degrees), the phone filling the middle half of the frame vertically and centred left to right. The phone has thin
> even bezels, rounded corners and no logo. Its screen is a flat, evenly lit, pure chroma green (#00FF00) with no
> reflections, no glare and nothing displayed. The upper hand, a customer's, comes in from the top right holding a
> plain matte light-grey payment card by its edge and touches the card flat against the top third of the phone's
> screen, the card overlapping the phone's top edge at a slight angle. The card has only a gold EMV chip and a small
> contactless wave symbol: no bank name, no card network logo, no numbers, no text. Natural, realistic hands with
> five fingers each, short clean unpainted nails, no rings, no watches, no bracelets, no tattoos; one hand a medium
> brown skin tone, the other a light skin tone. Soft daylight from the left, gentle natural shadows on the wall.
> Everything in sharp focus front to back, deep depth of field, f/8, 50mm lens, no bokeh, no blur. Leave the top
> quarter and the bottom fifth of the frame as clear empty wall. Calm, clean, premium, true-to-life colour.

## Negative prompt

> text, words, letters, numbers, logos, brand names, Visa, Mastercard, Apple logo, watermark, yellow card, branded
> card, extra fingers, fused fingers, deformed hands, jewellery, nail polish, screen content, app interface, screen
> reflection, glare, bokeh, shallow depth of field, blurred background, motion blur, café clutter, people's faces,
> dark moody lighting, heavy shadows, fisheye, wide angle distortion

## Why it is written this way

- **Green screen, flat to camera.** The phone's screen is replaced with a real NeroPay screen, so the App Store
  shows the app as it is (Apple's rule that screenshots show the app in use) and nothing on screen is invented.
  Keeping the phone within ten degrees of straight-on lets it be placed without warping.
- **No card network logos, no yellow card.** Visa and Mastercard control how their marks appear, and a model mangles
  logos. A yellow card would read as a NeroPay card: `CLAUDE.md` allows the terminal as the only branded object and
  no NeroPay props.
- **Sharp throughout, no bokeh:** the brand rule for every NeroPay frame.
- **Empty wall top and bottom:** room for the headline in white with the yellow marker.

## Still needed from Faisal before it ships

1. **A screenshot of the app's tap screen**, the one the customer taps against, full resolution from the phone.
   That goes on the green screen. Without it the keypad screen (£45.75) stands in.
2. **Confirmation that Tap to Pay on iPhone is live in the NeroPay app.** If it is, Apple's marketing guidelines for
   it apply to this image: the feature is named exactly "Tap to Pay on iPhone" if named at all, and Apple's own
   checkout screen must not be altered. The headline as built ("Take card payments on your phone.") does not use
   Apple's name.

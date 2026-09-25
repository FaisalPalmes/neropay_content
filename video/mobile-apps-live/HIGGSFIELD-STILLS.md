# Mobile Apps, live action (MA02): Higgsfield still frames

Written 24 Sep 2026 for Faisal to generate. Revised the same day for his casting ruling (§1), then for his notes on skin, cast, room and framing (§4). Each still is the **first frame** of a 3–6 second image-to-video
clip. Send the stills back before any clip is made. The pilot (§6) runs through keying and compositing
before we spend credits on the rest.

## 1. What this video is, and the rulings it runs under

A cinematic launch ad for NeroPay Mobile Apps. Hyper-real AI-generated **customers** use a merchant's own
app on an unbranded phone. The phone screen is green in every clip. We key it, track its four corners
and composite the invented merchant screens from MA01 into it (Sage & Co, Kestrel, Ironvale, Marigold).
Real screen recordings replace those screens later, and the tracking data is kept so that swap is a
re-composite, not a reshoot.

**Casting, Faisal, 24 Sep 2026, for every video with AI-generated people:** mid to late twenties only.
Fit, slim and well maintained. Attractive and photogenic, because that performs on social, but it must
still read as a real person, not a retouched model. Women have done nails (a gel manicure, designs
allowed, not too long), a pedicure where feet show, hair freshly done and fresh natural makeup. Men are
freshly cut and groomed, with a sharp line-up where there is a beard.

**One-video exceptions, Faisal, 24 Sep 2026.** He overrides the brand's photographic rules for this ad
only. Shallow depth of field, bokeh and handheld cinematic framing are allowed here. **Do not copy these
exceptions into any other piece.** Everything else still applies:

- **No brand in frame except the app on the screen.** No Apple logo, and no phone design a viewer would
  read as an iPhone (no triangular three-lens camera, no Dynamic Island). No shop names, signage, logos,
  readable text, number plates or recognisable landmarks.
- **Customers, not owners.** Nobody plays a merchant. Nobody is named on screen, speaks to camera or
  says anything about NeroPay. The cast names below exist to keep a character consistent between
  shots. They never appear in the video.
- **No NeroPay price, rate or fee anywhere.** The prices inside the apps are the invented merchants' own.
- **AI disclosure is made at upload** (Faisal, 9 Sep 2026): YouTube's altered or synthetic content
  setting plus a line in the description. The Meta session decides the Meta label. There is no AI
  wording inside the video.
- **Ends on the locked outro** (`brand/sting/outro.html`, yellow), "Available on Android & iOS" over
  neropay.app, the same as MA01.

## 2. Settings for every still

- **Model:** your choice of the current photoreal models. GPT Image 2.5 or Nano Banana Pro worked for the
  NeroConnect stills. `quality: high`, `resolution: 2k` (4k if the model offers it).
- **Aspect ratio: 16:9** for every shot. This is the landscape master.
- **Workspace:** `9fbbb426`.
- **Consistency:** generate each character's first shot, pick the best, then attach it as the reference
  image only where a shot deliberately repeats a person (none in the pilot). The reference keeps the face, skin, hair and wardrobe the same.
- **Generate 4 per prompt** and send back the best one or two. Send every attempt where the screen stays
  flat green, even if the face is weaker. The screen is the harder part to get right.

## 3. The rules for the frame (these decide whether a clip can be composited)

**The phone screen:**

1. The whole display is a flat, uniform chroma green (#00FF00), edge to edge. No interface, icons, text,
   notch, punch-hole, glare, reflection or gradient.
2. **At least three of the four screen corners are visible, ideally all four.** A thumb may cross the
   screen. A hand covering a corner breaks the track.
3. The screen fills enough of the frame. In an insert, the phone is at least a third of the frame height.
4. The screen faces the lens at no more than about 45 degrees. Edge-on is unusable.
5. If the screen cannot be seen (the back of the phone faces us), no compositing is needed. That's
   deliberate for shots 01, 03 and 05: they cost nothing downstream.

**Composition, for the other formats.** Keep the face, the hands and the phone inside the **centre 56%
of the width**. The 1:1 Meta cut is a centre crop of this frame, so anything outside that band is lost.
The 9:16 Reel cannot be cropped from a 1080p clip without losing too much resolution. For each shot used
in the Reel, we reframe the still to 9:16 (outpaint top and bottom) and animate that version separately.
Keep the subject near the centre so the reframe has room.

**The phone, identical in every prompt:** a modern unbranded smartphone, about 6.1 inches, with a flat
satin graphite aluminium frame, flat glass front, thin even black bezels and softly rounded corners. The
back is matte graphite glass with a small two-lens camera module in a slim vertical pill at the top left,
and no logo or text anywhere.

**The look, shared by every shot.** A premium app launch commercial, shot on an ARRI Alexa 35 with
spherical primes. Soft natural light, gentle contrast, clean highlights, warm neutral grade, fine 35mm
film grain. Everyone is in their mid to late twenties, slim, fit, well groomed and attractive in a
believable way. Skin is healthy and real: visible pores, fine vellus hair, a natural glow. No heavy
retouching, no beauty filter, no plastic smoothness. Hands are anatomically correct: five fingers,
natural knuckle creases. Women's nails are a fresh gel manicure; men's are neatly trimmed. Skin is
**hyper-real** in every prompt: pores, peach fuzz, tonal variation, individual lashes. The cast is
light-skinned, European-looking or mixed Asian and European, the men British or European (Faisal,
24 Sep 2026). **A small yellow accent sits in each frame** (a
cushion, a mug, a scarf), close to the brand yellow and never branded. It is what ties the four worlds
together.

**The avoid line, which goes at the end of every prompt.** It is already included below.

### Phone motion for green-screen plates (25 Sep 2026)

This comes from the local DaVinci session's track of the pilot. The tracker follows the edge where the green meets the
black bezel, on every frame.

- **What tracks.** Slow, smooth drift: the table phone moved about 60 px over 5 s, about 1.2 px a frame. Fingers over the
  screen and green spill on skin are fine.
- **What breaks it.**
  - Fast side-to-side tilting: the pavement phone reversed about ten times in 5 s, and the edit could use only its
    last two seconds.
  - Jolts of 5–6 px in one frame.
  - A finger lying along an edge for more than about a second.
  - Two corners covered at once.
- **So every screen shot:**
  - The phone rests on something, or both hands hold it steady and level, with the forearms supported where the
    pose allows.
  - The phone does not wobble, rock, tilt or twist, and it keeps its exact shape and size.
  - Only the thumb or finger moves.
  - The camera is "static camera with a very slight, slow drift in". If it must feel handheld, no more than a barely
    perceptible slow breath.
  - One action at a time, at normal speed: a tap is a clear press and lift, and a scroll is one slow drag up the
    screen. Each action is given a rough second in the prompt, so the app can be built to it.
- **Every motion prompt opens with the screen lock and names Kling's failures.** Kling painted a notch and status-bar
  icons onto the pavement green from about 1 s, and a pale glare swept across it at 2–3 s. The standard opening is:
  *"The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, notch, status bar,
  icon, image, text, glare, sweep of light or reflection ever appears on it."*
- **The still decides as much as the prompt.**
  - The phone is at least 40% of the frame height.
  - The screen is within about 35 degrees of facing the lens.
  - All four corners are visible, with the black bezel showing all the way round.
  - No sun edge or shadow edge crosses the screen.
  - Nothing green is near the phone.
- **Generate 2–3 takes of every screen clip.** The local session tracks them and keeps the steadiest.

## 4. The cast

Revised 24 Sep 2026 on Faisal's notes: light-skinned, European-looking or mixed Asian and European; the
men British or European; hyper-real skin; a new room for the couch shots; stronger, more unusual framing.

| | Who | App | Where |
|---|---|---|---|
| **A** | Leo, 27, British | Order: Sage & Co (café) | Modern city district, late afternoon |
| **B** | Mia, 26, mixed Japanese and English | Book: Kestrel (salon) | A converted mill loft, on the sofa |
| **C** | Hannah, 28, British | Join: Ironvale (gym studio) | Her kitchen, early morning |
| **D** | Theo, 28, British | Pay: Marigold (florist) | Terraced street, autumn |

**Every shot is its own person** (Faisal, 24 Sep 2026). The video model cannot be trusted to keep a
person and a room consistent between two shots, so the inserts no longer try to match the wide shots.
The screen composites and the edit still carry the story. The cast names above belong to the wide
shots; each insert has its own person, written in full in its prompt. Shots 05, 09 and 11 still assume
a matching person and are rewritten on the same basis before they are generated.

Kestrel is a barbershop in MA01. For the booking shot we build a salon version of that screen (hair, nails,
brows). The screen is ours to change, so the still is not affected.

**The loft (Mia's room, replacing the beige living room).** A converted red-brick mill apartment: one wall
of whitewashed exposed brick, a tall black steel-framed factory window with a grid of small panes, warm
afternoon sun throwing the window grid as sharp shadow lines across the wall and floor, pale oak
floorboards, a deep olive-green velvet sofa, a mustard-yellow cushion. Uncluttered: one trailing plant,
one low travertine coffee table.

## 5. The shots

The order is the edit order. "Composite" names the screen that goes into the green. Every shot has a
named framing idea. It is there so the edit has shape (low, high, through, over, overhead), not twelve
medium shots.

---

### 01. Leo comes down the steps (establishing). Composite: none

**Framing:** low angle from knee height, wide, the buildings' verticals converging above him.
**Planned motion (5s):** the camera rises slowly as he walks down the steps towards it, glancing at the phone.

```
Cinematic 16:9 film still from a premium smartphone app commercial. Dramatic low-angle wide shot from knee height, 24mm lens, looking up at a 27-year-old British man walking down broad pale stone steps towards the camera, centred, between two contemporary buildings of glass and red brick whose vertical lines converge in the sky above him. Late afternoon in autumn, low warm sun catching one glass facade, the rest in soft shade. He looks down at a smartphone in his right hand at chest height, its back facing the camera, the start of a smile. He is slim and fit with an athletic build, handsome and photogenic in a natural, believable way, the kind of good-looking real person who does well on social media, not a retouched model. He has fair skin with a warm olive undertone, hazel eyes, groomed eyebrows, short dark-brown hair with natural wave, freshly cut with tapered sides and a little length on top, and a light, neatly kept stubble with a clean line. Hyper-realistic skin: visible pores across the nose and cheeks, fine peach fuzz catching the light, subtle natural variation in tone, a real healthy sheen, individual eyelashes and brow hairs, shot like an unretouched high-end campaign portrait. He wears a well-fitted stone-coloured waxed cotton overshirt, unbuttoned, over a heavyweight off-white crew-neck T-shirt, slim dark navy tapered chinos with a single cuff and plain white leather low-top trainers with no logo. A mustard-yellow knitted beanie is tucked into his overshirt pocket. His personality: easy-going and organised, the friend who has already ordered by the time everyone arrives. No shopfronts, no signs, no readable text, no recognisable landmarks, a few distant blurred pedestrians. The phone: a modern unbranded smartphone with a flat satin graphite aluminium frame and a matte graphite glass back with a small two-lens camera module in a slim vertical pill at the top left, no logo or text anywhere. Shot on an ARRI Alexa 35, 24mm spherical lens at f/2.8, natural light, gentle contrast, warm neutral grade, fine 35mm film grain, hyper-realistic, photoreal. Avoid: older people, wrinkles, ageing skin, messy or unkempt hair, bitten or unpainted nails on women, plastic skin, airbrushed skin, waxy skin, beauty filter, logos, Apple logo, triangular camera module, brand names, readable text, signage, watermarks, extra fingers, deformed hands, oversaturated colour, HDR look, CGI look.
```

---

### 02C. Close-up at the table, golden hour (pilot). Composite: Sage & Co, the order screen

**Framing:** Faisal's reference of 24 Sep: a high-angle close-up from above and behind her shoulder,
two hands holding the phone over a terrazzo table, a pastry on an oak tray and a coffee beside it,
mustard knit cuffs, and low golden sun from the side throwing long hand shadows across the table. Faceless.
Shallow depth of field is allowed here. It replaces 02A and 02B in the pilot; they are parked. The sun
is kept off the screen so the green stays even for the key.
**Planned motion (5s):**
```
Static camera with a very slight, slow drift in. Her right thumb taps the middle of the screen once, then again a moment later. A faint wisp of steam rises from the coffee. The golden sunlight and the long shadows stay steady; the hands' shadows move only with the hands. No one else appears. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

```
Warm, natural lifestyle photograph, looking like a real frame from a 35mm film camera, not a render. A high-angle close-up from just above and behind a young woman's right shoulder, looking down at about 45 degrees onto her two hands holding a smartphone over a terrazzo table on a quiet late afternoon at home. We see only her hands, her wrists and the ends of her sleeves; her face, head and shoulder are not in the frame. She is the only person in the image.

How she holds it: the phone is upright in portrait orientation, held in both hands about 15 cm above the table, tilted up towards her at about 30 degrees, so the camera sees the screen at a slight angle. Her left hand cradles the phone from the left and below, the left thumb resting along the left edge and her left fingers behind the phone. Her right hand holds the right edge from behind, and her right thumb is lifted just above the middle of the screen, about to tap. The phone sits left of centre in the frame and fills about 50% of the frame height. All four corners of the screen are clearly visible and no finger or palm covers a corner. The phone is the true size of a 6.1-inch phone in a woman's hands.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Her hands: slim, elegant young hands with long fingers and light skin with a warm golden undertone. Real skin texture with fine creases over the knuckles, faint veins on the backs of the hands and a little natural pinkness at the fingertips. Her nails are a fresh gel manicure in a medium-length almond shape, soft milky nude with a thin gold chrome French tip, glossy, with neat cuticles. A thin gold ring on her right middle finger. The cuffs of a chunky mustard-yellow ribbed-knit jumper come down over her wrists at the lower edge of the frame, the knit texture sharp and detailed.

The table: a pale beige terrazzo top with scattered chips of cream, rust and grey stone, a real matte surface with fine wear. To the right of the phone, slightly out of focus: a light oak serving tray with a glossy, twisted cinnamon knot pastry on it, and beyond that a speckled off-white handmade ceramic cup of black coffee with a faint wisp of steam. Beyond the table, far out of focus: the curved oak back of a dining chair with a cream upholstered seat, and a warm plaster wall.

Light: golden hour. Low, warm evening sun comes in through a window at frame right and falls across the table and the backs of her hands, casting long, soft shadows of her hands and the phone to the left across the terrazzo. The light is warm but natural: golden highlights on the skin and the pastry, soft warm shadows, and warm bounce light from the table. The sunlight falls on the table and her hands, not across the phone screen, which stays evenly lit.

Photographed on a 50mm lens at f/2, a shallow depth of field: the hands, nails and phone sharp, the pastry slightly soft, the coffee cup softer, the chair and wall melting into smooth, creamy blur. Warm, natural colour, true skin tones, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched, like a high-end lifestyle photograph for an app.

Avoid: her face, her head, a second person, a person in the background, AI-generated look, CGI, render, orange skin, oversaturated colour, HDR, teal and orange grade, glowing edges, oversharpening, plastic skin, neon or glowing green screen, sunlight, glare or shadows on the screen, fingers or palm covering the screen corners, chunky or older-looking hands, chipped or unpainted nails, logos, Apple logo, brand names, readable text, watermarks, extra fingers, deformed hands.
```

---

### 02A. Faceless, over the shoulder, against a building wall. Composite: Sage & Co, the order screen

**Framing:** faceless. The frame cuts below his ear. A 25-year-old mixed-race athlete, light-skinned,
against one plain rendered wall split by a single diagonal shadow line. The setting is real but reads
as abstract, and nothing competes with the screen. Faisal's Pinterest references are the model: the hand and
phone carry the shot and the background stays quiet.
**Planned motion (5s):**
```
Subtle handheld camera, breathing slightly. He stands still; his thumb scrolls up once, then taps. The shadow line on the wall stays still. His face never enters the frame. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. The hand keeps five fingers throughout. Natural, unhurried, realistic movement.
```

```
Candid, minimal photograph, looking like a real frame from a 35mm film camera, not a render. A faceless over-the-shoulder shot of a 25-year-old athletic man of mixed Black and white British heritage, light-skinned with a warm golden-brown tone, standing close to the plain side wall of a modern building and looking down at the phone in his right hand. His face is not in the picture: the top edge of the frame cuts just below his ear, so we see only the side of his neck, the back of his right shoulder, his right arm, his hand and the phone.

The camera is just behind and slightly above his right shoulder, about 25 cm away, looking down at about 25 degrees past the shoulder onto the phone. He stands relaxed, his weight on one leg, his right elbow bent and tucked against his side, so the phone sits in front of his lower chest with the screen tilted up towards his eyes. The camera sees the screen at a slight angle, as in a real over-the-shoulder shot.

How he holds it: one-handed, the phone upright, its lower half resting across his palm and the base of his fingers, his four fingers wrapped around the left edge with their tips just showing along that edge, his little finger tucked under the back near the bottom to support it, and his thumb resting on the lower third of the screen, slightly bent, about to tap. The phone is the true size of a 6.1-inch phone in a grown man's hand. All four corners of the screen are clearly visible and no finger covers a corner.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, flat graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Him: an athlete's build, broad shoulders and a lean, strong forearm with visible veins and defined muscle. Real skin with visible pores, fine hairs on the forearm and the back of the hand, natural creases over the knuckles, short clean nails. He wears a fitted plain black short-sleeved technical T-shirt with no logo, the fabric creasing naturally at the shoulder seam. The side of his neck shows a fresh, clean skin fade at the hairline. Slim, fit, well kept, mid-twenties.

The environment is real but reads as abstract: behind the phone, filling the whole background, is one large, plain, smooth wall of warm off-white rendered concrete on the side of a modern building, with a faint real texture, a few hairline cracks and fine weathering. Nothing else is in the frame: no windows, no signs, no people, no street. Sunlight falls on the upper part of the wall, and the shadow of a neighbouring building cuts across it in one clean diagonal line, dividing the wall into a warm sunlit plane and a cool shaded plane. He stands in the open shade, so his arm, hand and the phone are lit by soft, even, cool daylight, with no sun on them.

Photographed on a 50mm lens at f/2.8, the phone and thumb sharp, the wall softly out of focus but its texture and the shadow line still readable. Natural, slightly muted colour, true-to-life whites, gentle contrast, real film grain, faint lens softness towards the corners. Minimal, graphic and quiet, with all attention on the screen. Photoreal, hyper-realistic, unretouched.

Avoid: his face, his eyes, his nose, his mouth, the back of his head filling the frame, AI-generated look, CGI, render, golden hour, glowing highlights, rim light, HDR, teal and orange grade, oversaturated colour, oversharpening, plastic skin, heavy bokeh, a busy background, windows, people, signs, text, neon or glowing green screen, glare or shadows on the screen, fingers covering the screen corners, oversized hand, fingers pinching the phone, the screen flat-on to the camera, logos, Apple logo, brand names, watermarks, extra fingers, deformed hands.
```

---

### 02B. The same shot in a yellow studio. Composite: Sage & Co, the order screen

**Framing:** the same as 02A, on a warm sunflower-yellow seamless paper backdrop, in a white T-shirt.
The brand yellow as a place.
**Planned motion (5s):**
```
Subtle handheld camera, breathing slightly. He stands still against the yellow backdrop; his thumb scrolls up once, then taps. His face never enters the frame. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. The hand keeps five fingers throughout. Natural, unhurried, realistic movement.
```

```
Minimal studio photograph, looking like a real frame from a 35mm film camera in a real photo studio, not a render. A faceless over-the-shoulder shot of a 25-year-old athletic man of mixed Black and white British heritage, light-skinned with a warm golden-brown tone, standing in front of a warm sunflower-yellow seamless paper backdrop (close to #FFCF24) and looking down at the phone in his right hand. His face is not in the picture: the top edge of the frame cuts just below his ear, so we see only the side of his neck, the back of his right shoulder, his right arm, his hand and the phone.

The camera is just behind and slightly above his right shoulder, about 25 cm away, looking down at about 25 degrees past the shoulder onto the phone. He stands relaxed, his weight on one leg, his right elbow bent and tucked against his side, so the phone sits in front of his lower chest with the screen tilted up towards his eyes. The camera sees the screen at a slight angle, as in a real over-the-shoulder shot.

How he holds it: one-handed, the phone upright, its lower half resting across his palm and the base of his fingers, his four fingers wrapped around the left edge with their tips just showing along that edge, his little finger tucked under the back near the bottom to support it, and his thumb resting on the lower third of the screen, slightly bent, about to tap. The phone is the true size of a 6.1-inch phone in a grown man's hand. All four corners of the screen are clearly visible and no finger covers a corner.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, flat graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Him: an athlete's build, broad shoulders and a lean, strong forearm with visible veins and defined muscle. Real skin with visible pores, fine hairs on the forearm and the back of the hand, natural creases over the knuckles, short clean nails. He wears a fitted plain white heavyweight cotton T-shirt with no logo, the fabric creasing naturally at the shoulder seam. The side of his neck shows a fresh, clean skin fade at the hairline. Slim, fit, well kept, mid-twenties.

The studio: a real seamless paper backdrop in warm sunflower yellow fills the whole background, with the faint texture of the paper, a gentle gradient where the light falls off towards the edges, and a soft, slightly darker band where the paper curves down to the floor far behind him. Nothing else is in the frame. Lighting: one large soft key light from the upper left through a big diffuser, and a little warm yellow light bouncing off the backdrop onto the edge of his arm and shoulder, as it would in a real studio. The phone screen stays evenly lit and matte.

Photographed on a 50mm lens at f/2.8, the phone and thumb sharp, the backdrop softly out of focus. Natural colour with a clean white T-shirt and a true, warm yellow, gentle contrast, real film grain, faint lens softness towards the corners. Minimal, graphic and bold, with all attention on the screen. Photoreal, hyper-realistic, unretouched.

Avoid: his face, his eyes, his nose, his mouth, the back of his head filling the frame, AI-generated look, CGI, render, a flat digital yellow fill, lemon or neon yellow, orange, glowing highlights, rim light, HDR, oversaturated colour, oversharpening, plastic skin, props, objects, other people, text, neon or glowing green screen, glare or shadows on the screen, fingers covering the screen corners, oversized hand, fingers pinching the phone, the screen flat-on to the camera, logos, Apple logo, brand names, watermarks, extra fingers, deformed hands.
```

---

### 02 (street, superseded). Over a man's shoulder at the kerb, ordering. Composite: Sage & Co, the order screen

*Superseded on 24 Sep 2026 by 02A and 02B below: Faisal wants the over-the-shoulder shot faceless, in a quiet setting, with the screen as the focus. Kept for reference.*

**Framing:** from just behind and above his right shoulder, looking down about 35 degrees onto the phone,
the zebra crossing blurred beyond it. His legs and feet stay out of frame. A camera looking steeply
down past a shoulder shows the feet, and that is what looks wrong.
**v2, 24 Sep 2026, after Faisal's first result read as AI.** The faults in that still: low golden
backlight while his hand was lit flat from the front (the light didn't agree); a neon green screen
brighter than anything else in the frame; a glittering rim on the beard; a spotless empty street with
leaves scattered evenly like confetti; a hand too big and weathered for 27, pinching the phone at its
base; the screen turned flat to the camera instead of to his eyes; heavy uniform blur. The fix: overcast
Manchester light, the less saturated broadcast green (#00B140, which keys just as well), a real grip at
true phone scale, f/4 so the street still reads, and ordinary street life. The words "cinematic" and
"premium commercial" are dropped because they push the model towards the glossy look.

**Planned motion (5s):** a subtle handheld sway. He stands still at the kerb, scrolls once, then taps.

```
Candid documentary-style photograph, looking like a real frame pulled from a 35mm film camera, not a render. Over-the-shoulder shot from just behind the right shoulder of a 27-year-old British man standing at the kerb of a zebra crossing on an ordinary weekday in a city-centre street in Manchester, waiting to cross and ordering something on his phone. Overcast, damp autumn afternoon: a soft, even, white-grey sky, no sun, no golden hour, no lens flare, the road still wet from earlier rain. The light on him and on the street is the same flat, soft daylight from above.

The camera is at the height of his ear, about 30 cm behind his right shoulder, looking down at about 30 degrees past his shoulder onto the phone. His head is bent forward and down, looking at the screen. His weight is on his left leg, his shoulders relaxed, his left hand in his coat pocket, out of frame. His right elbow is bent and tucked against his side, so the phone sits in front of his lower chest, about 35 cm from his face.

How he holds it, exactly as a real person does: one-handed, phone upright, the lower half of the phone resting across the palm and the base of his fingers, his four fingers wrapped around the left edge with their tips just showing along that edge, his little finger tucked under the back of the phone near the bottom to support it, and his thumb resting on the lower third of the screen, slightly bent, about to tap. The phone is the true size of a 6.1-inch phone in an adult man's hand: it spans from the heel of his palm to the middle of his fingers. The screen is tilted up towards his eyes, so the camera sees it at a slight angle, like a real over-the-shoulder shot, with all four corners clearly visible and no finger covering a corner.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen indoors, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, flat satin graphite aluminium frame with slight real-world wear on the corners, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

His hand is a young man's hand: slim, fair skin with a warm olive undertone, real skin texture with fine creases over the knuckles, slightly dry skin on the knuckles, a little natural redness at the fingertips, fine dark hairs on the back of the hand, short neatly trimmed nails. The cuff of a dark navy wool coat sits at his wrist, with the cuff of a grey hoodie showing underneath. In the upper-left of the frame, softly out of focus, is his right shoulder in the navy wool coat with the grey hood lying over the collar, the edge of his jaw with short, neatly kept dark stubble with no highlight on it, and short dark-brown hair freshly cut at the temple. His legs and feet are not in frame. He is slim and good-looking in a normal, real way.

Beyond the phone, softly out of focus but still readable as a real place: the wet dark-grey road with the white stripes of the zebra crossing, the paint worn and scuffed where people walk, a metal drain cover, clumps of wet brown leaves gathered in the gutter rather than scattered evenly, and a black-and-white striped Belisha beacon pole at the edge of the kerb. On the far pavement, other people going about their day: a woman in a beige trench coat walking past with a tote bag, a man in a dark puffer jacket waiting to cross, a cyclist in a rain jacket riding past. Behind them, a normal city-centre street of mixed red-brick and glass office buildings, a parked white van with no markings, a bike rack, a black litter bin and a lamp post. No readable signs, no shopfronts, no number plates, no logos.

Photographed on a 35mm lens at f/4, at eye level behind his shoulder, so the background is soft but not smeared into bokeh. Natural, slightly muted colour with true-to-life whites and greys, gentle contrast, real film grain, faint lens softness towards the corners, a trace of chromatic aberration on high-contrast edges. Looks like a still from a documentary-style commercial, photoreal, hyper-realistic, unretouched.

Avoid: AI-generated look, CGI, render, golden hour, low sun, backlight, glowing highlights, rim-lit or glittering beard, teal and orange grade, HDR, oversaturated colour, oversharpening, smooth plastic skin, neon or glowing green screen, glowing windows, perfectly clean empty street, evenly scattered leaves, perfect fresh road markings, heavy uniform bokeh, oversized hand, older or weathered hands, fingers pinching the phone, the screen facing the camera flat-on, legs or feet in frame, logos, Apple logo, brand names, readable text, signage, number plates, watermarks, extra fingers, deformed hands.
```

---

### 03. Mia on the floor against the sofa, straight on (hero). Composite: none

**Framing:** straight on from coffee-table height. She sits on the floor with her back against the sofa,
facing us, with the table and her mug soft in the foreground. The room is lived in, not a showroom.
**v2, 24 Sep 2026.** Faisal made a character sheet for Mia. Attach it as image 1; the prompt tells the
model to take her face and build from it and everything else from the text. The realism fixes from 02 are
applied: overcast light, no golden glow, f/4, more real clutter.

**Planned motion (6s):** a very slow push-in across the table. She scrolls, smiles, taps, and rests
her head back against the sofa.

```
Use the woman in the attached reference image (image 1, her character sheet) as the person in this photograph. Keep her face, features, skin tone, eye shape, hair colour, hair length and build exactly as they are in image 1. Do not invent a different woman or change her face. Only her pose, clothes, nails and the setting come from this prompt.

Candid documentary-style photograph of a real, lived-in home, looking like a frame from a 35mm film camera, not a render and not a showroom. Straight-on shot from low down, at coffee-table height, of the woman from image 1, aged 26, sitting on the floor of her living room, centred in the frame and facing the camera. She sits on a worn rug with her back leaning against the front of a deep olive-green velvet sofa, her knees drawn up loosely and slightly apart, her forearms resting on her knees. She holds a smartphone in both hands at chest height, with the back of the phone facing the camera, and looks down at the screen with a small, private, pleased smile, absorbed in it and not looking at the camera.

Between her and the camera, softly out of focus along the lower edge of the frame, is a low, round travertine coffee table. On it: a plain mustard-yellow ceramic mug of tea, half drunk, with a faint ring on the stone beside it; a glass of water; a TV remote; a small candle in an amber glass jar, burnt down unevenly; and a couple of envelopes lying face down. Her feet are hidden behind the table.

Her styling: her hair as in image 1, freshly blow-dried and glossy, one side tucked behind her ear. Soft, fresh, natural makeup. Real skin texture with visible pores, fine peach fuzz, natural variation in tone and no retouching. Her nails, visible on the fingers wrapped around the phone, are a fresh gel manicure: medium-length almond shape, sheer milky pink, with fine gold line-art on two nails. Small gold huggie earrings, a fine gold chain necklace, a thin gold ring on her right index finger. She wears a cropped cream cable-knit cardigan with the sleeves pushed up, over a fitted white ribbed vest, and relaxed light-blue straight-leg jeans with a slightly frayed hem. Her personality: warm, organised and a little bit of a planner; she books everything ahead and this is her treating herself.

The sofa behind her is used and slightly messy: creased seat cushions, a chunky oatmeal knit throw slumped over one arm and trailing onto the floor, a mustard-yellow linen cushion and a faded rust cushion squashed into the corner, a grey hoodie thrown over the back, and an open paperback lying face down with its spine turned away.

The room is a converted red-brick mill flat in Manchester that someone has lived in for years. Behind the sofa is a whitewashed exposed-brick wall with uneven mortar and chipped paint. On a floating oak shelf above the sofa are a large unframed abstract canvas in terracotta and cream leaning against the wall, two handmade ceramic vases (one with dried eucalyptus), a stack of books with their spines to the wall, and a trailing pothos with a couple of yellowing leaves. At frame left is a tall black steel-framed factory window with small panes. At frame right, a paper globe floor lamp is switched on and glowing warm, next to a fiddle-leaf fig in a woven basket. The floor is pale oak boards, scuffed near the sofa, under a worn vintage rug in faded rust, cream and indigo that is slightly rucked up at one corner. Real signs of life: a charging cable trailing from behind the sofa, a pair of socks kicked off by the rug, a canvas tote bag slumped against the sofa leg with nothing printed on it. Tidy enough to look nice, messy enough to be real.

Light: a bright overcast afternoon. Soft, even daylight comes through the factory window from the left and mixes with the warm glow of the lamp. No hard sun beams, no golden glow, no rim light on her hair. The phone: a modern unbranded smartphone with a flat graphite aluminium frame and a matte graphite back with a small two-lens camera module in a slim vertical pill at the top left, no logo or text anywhere. Photographed on a 35mm lens at f/4 from coffee-table height, the table softly out of focus and the room behind her soft but readable. Natural, slightly muted colour with true-to-life whites, gentle contrast, real film grain, faint lens softness towards the corners. Photoreal, hyper-realistic, unretouched.

Avoid: a different woman from image 1, changing her face, AI-generated look, CGI, render, showroom or catalogue styling, perfectly tidy room, golden hour, glowing highlights, rim light, HDR, teal and orange grade, oversaturated colour, oversharpening, smooth plastic skin, beauty filter, heavy bokeh, looking at the camera, bitten or unpainted nails, logos, Apple logo, triangular camera module, brand names, readable text, book titles, watermarks, extra fingers, deformed hands.
```

---

### 04. Her point of view at a kitchen island, booking. Composite: Kestrel, salon version (service, then time slot)

**Framing:** her point of view, looking down at the phone above her crossed legs, on a crumpled bed on a
Sunday morning. This is a different woman from 03 (see §4).
**v2, 24 Sep 2026.** The first version produced a second woman in the frame, because the prompt
described "a 25-year-old woman sitting on her bed" and the model drew her. v2 describes only what the
camera sees (her hands, forearms and blurred knees) and says in plain words that no one else is in the
room. It also uses the 02 realism fixes and a bedroom that isn't styled.

**v3, 24 Sep 2026.** v2's bedroom came out too messy. Faisal moved the shot to a modern Deansgate
flat: she sits on a high stool at the kitchen island, with the island edge, her knees, the floor and the
kitchen in view. Slim, light-skinned hands, blush-pink gel nails with gold designs, small signs of life,
tidy.

**Planned motion (5s):** near-static, with the faint natural movement of hands holding a phone. Her thumb
taps a service, then a time.

```
Candid first-person photograph, taken from the eyes of a young woman sitting on a high stool at the kitchen island of her modern city-centre apartment in Deansgate, Manchester, looking down at the phone in her own hands. The camera is her eyes. She is the only person in this image, and the only parts of her we see are her own two hands holding the phone, her slim forearms, and, at the very bottom of the frame and out of focus, her knees in trousers below the edge of the island. There is no other person in the apartment: no face, no head, no second body, nobody on the other stools, no reflection of anyone in the windows or cabinets, and no photo of a person anywhere. It is a point-of-view shot only.

Her position: she sits close to the corner of the island, her forearms resting lightly on its rounded front edge, and holds the phone upright in portrait orientation in both hands just above that edge, about 35 cm below her eyes, with the screen facing up towards the camera and tilted slightly towards it. The phone is in the centre of the frame and fills about 45% of the frame height. Below the phone, the rounded edge of the island worktop runs across the frame; below that edge, out of focus, are her knees, the chrome footrest of the stool, and a patch of the pale oak floor.

How she holds it: the phone rests in her left palm, with her left fingers curled around the left edge and the back, and the fingertips just visible along the left side between the corners. Her left little finger is tucked against the back near the bottom, not under the bottom edge. Her right hand cups the right edge from below, and her right thumb is lifted just above the lower half of the screen, about to tap. All four corners of the screen are clearly visible and no finger covers a corner. The phone is the true size of a 6.1-inch phone in a woman's hands.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen indoors, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, flat graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Her hands: slim, elegant young hands with long slender fingers and light, fair skin with a warm undertone. Real skin texture with fine creases over the knuckles, faint veins on the backs of the hands and a little natural pinkness at the fingertips. Her nails are a fresh salon gel manicure in a medium-length almond shape, glossy soft blush pink, with fine hand-painted gold gel designs: thin gold line-work swirling across three of the nails and a single gold foil fleck on the others. Neat cuticles, the gloss catching the window light. A thin gold ring on her right index finger and a delicate gold chain bracelet on her left wrist. The pushed-up sleeves of a soft oatmeal knit jumper rest on her forearms.

The kitchen and living space, beyond the phone, soft but readable: the island is pale grey-veined white quartz, and on it, slightly out of focus, sit a white ceramic mug of coffee half drunk, a set of keys, a small stack of post lying face down, and a wooden bowl with a few lemons and a banana. Across the island is the kitchen run: flat-fronted matte sage-green cabinets with slim brass handles, a white quartz splashback, a black induction hob, a tea towel hanging over the oven door handle, a kettle, and a potted basil plant by the sink. To one side, the edge of the open-plan living room: a pale grey sofa with a throw over the arm and a large leafy plant in the corner. Along the back wall, floor-to-ceiling windows look out over soft, out-of-focus city-centre rooftops under a pale overcast sky, with no recognisable landmarks. The flat is modern, clean and cared for, with small signs of someone living there. Not messy, not a showroom.

Light: soft, even daylight from the big windows on an overcast late morning, with the warm under-cabinet lights switched on. No sun beams and no hard shadows on the phone. Photographed on a 28mm lens at f/4 from her eye level, the hands, nails and phone sharp and the kitchen soft but readable. Natural, slightly muted colour with true-to-life whites, gentle contrast, real film grain, faint lens softness towards the corners. Photoreal, hyper-realistic, unretouched.

Avoid: a second person, another woman, any face, any head, anyone on the other stools, a person in the background, reflections of people in the windows, cabinets or phone, a selfie, the photographer visible, a bedroom, clutter, mess, a showroom or catalogue kitchen, AI-generated look, CGI, render, golden hour, glowing light, HDR, teal and orange grade, oversaturated colour, oversharpening, plastic skin, neon or glowing green screen, glare or shadows on the screen, fingers covering the screen corners, chunky or older-looking hands, chipped or unpainted nails, logos on appliances, Apple logo, brand names, readable text, recognisable landmarks, watermarks, extra fingers, deformed hands.
```

---

### 05. Mia in profile, booked. Composite: none

**Framing:** a tight profile close-up against the bright window, the sun as a rim light on her hair
and lashes, the steel window grid soft behind.
**Planned motion (3s):** she lowers the phone and looks out of the window with a small contented breath.

```
Cinematic 16:9 film still from a premium smartphone app commercial. Tight profile close-up of a 26-year-old woman of mixed Japanese and English heritage, facing frame left towards a tall black steel-framed factory window, her face placed in the centre of the frame, a quiet, satisfied half-smile. Warm low afternoon sun from the window rims her profile, catching the fine peach fuzz on her cheek, her lashes and loose strands of hair; the window's grid of small panes glows softly out of focus behind her. The top edge of a smartphone rests against her chin, its back facing the camera, her fingers with a fresh gel manicure in sheer milky pink with fine gold line-art visible holding it. She is slim and strikingly pretty in a natural, believable way. She has light skin with a warm undertone, soft almond-shaped dark-brown eyes, and fresh, soft natural makeup: a dewy glow, groomed brows, defined lashes and a glossy rose-nude lip. Hyper-realistic skin: visible pores across the nose and cheeks, fine peach fuzz catching the light, subtle natural variation in tone, a real healthy sheen, individual eyelashes and brow hairs, shot like an unretouched high-end campaign portrait. Long, glossy dark-brown hair, freshly blow-dried, tucked behind one ear, a small gold huggie earring. The collar of a cream cable-knit cardigan. Shot on an ARRI Alexa 35, 85mm spherical lens at f/2, warm neutral grade, fine 35mm film grain, hyper-realistic, photoreal. Avoid: older people, wrinkles, ageing skin, messy or unkempt hair, bitten or unpainted nails on women, plastic skin, airbrushed skin, waxy skin, beauty filter, logos, Apple logo, triangular camera module, brand names, readable text, signage, watermarks, extra fingers, deformed hands, oversaturated colour, HDR look, CGI look.
```

---

### 06. Hannah in the kitchen, through the doorway. Composite: none

**Framing:** a frame within a frame, from the dark hallway through the kitchen doorway into bright
morning light.
**Planned motion (5s):** a slow dolly towards the doorway. She drinks her coffee and scrolls.

```
Cinematic 16:9 film still from a premium smartphone app commercial. Frame-within-a-frame shot from a dim hallway, looking through an open doorway whose dark painted frame borders the image, into a bright modern UK kitchen at seven in the morning. Centred in the doorway, a 28-year-old British woman leans with her hip against a pale quartz worktop, dressed for training before work, a plain mustard-yellow ceramic mug in her left hand and a smartphone in her right at waist height, its back facing the camera, looking down at it with a focused, decisive expression. She is slim and athletic, and pretty in a natural, believable way, the kind of attractive real woman who does well on social media, not a retouched model. She has fair, clear skin with a light dusting of freckles across the nose and a fresh healthy flush, with minimal fresh makeup: groomed brows, a touch of mascara and a tinted lip balm. Hyper-realistic skin: visible pores across the nose and cheeks, fine peach fuzz catching the light, subtle natural variation in tone, a real healthy sheen, individual eyelashes and brow hairs, shot like an unretouched high-end campaign portrait. Her long honey-blonde hair is in a sleek high ponytail, glossy and well cared for. Her nails are a fresh gel manicure, short-to-medium squoval shape in milky pink with a small chrome accent on the ring finger. She wears a fitted charcoal half-zip training top with the sleeves pushed up, black full-length leggings and white socks. Her personality: busy, practical and decisive; she fits a class in before work and does not waste a minute. The kitchen: matte sage-green cabinets, a white tiled splashback, cool early daylight from a window with a band of warm sun across the worktop, no appliances with visible brands, no readable text. The phone: a modern unbranded smartphone with a flat satin graphite aluminium frame and a matte graphite glass back with a small two-lens camera module in a slim vertical pill at the top left, no logo or text anywhere. Shot on an ARRI Alexa 35, 40mm spherical lens at f/2.8, the doorway frame soft and dark, the kitchen bright, warm neutral grade, fine 35mm film grain, hyper-realistic, photoreal. Avoid: older people, wrinkles, ageing skin, messy or unkempt hair, bitten or unpainted nails on women, plastic skin, airbrushed skin, waxy skin, beauty filter, logos, Apple logo, triangular camera module, brand names, readable text, signage, watermarks, extra fingers, deformed hands, oversaturated colour, HDR look, CGI look.
```

---

### 07. Overhead flat lay, joining. Composite: Ironvale, the class list, then "Join"

**Framing:** exactly overhead, the phone square to the frame, a graphic flat lay with a diagonal band of
sun across the worktop. **The easiest shot to track.**
**Planned motion (4s):** static. Her finger taps a class, then the join button. Steam rises from the mug.

```
Cinematic 16:9 film still from a premium smartphone app commercial. Exactly overhead flat-lay shot, camera pointing straight down at a pale quartz kitchen worktop, a smartphone lying flat in the centre of the frame, square to the frame edges, the screen facing up, the phone filling about 50% of the frame height. A young woman's right index finger just touches the lower half of the screen, her slim fair hand coming in from the lower right with a fresh gel manicure in milky pink, short-to-medium squoval with a small chrome accent on the ring finger, and the pushed-up sleeve of a charcoal training top at the wrist. All four corners of the screen are clearly visible and uncovered. The screen is a perfectly flat, uniform, bright chroma-key green (#00FF00) from edge to edge, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, flat satin graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere. Arranged around the phone in a clean composition: a plain mustard-yellow ceramic mug of black coffee at the upper left with a wisp of steam, a rolled grey gym towel at the upper right, a set of plain keys at the lower left. A diagonal band of warm morning sun crosses the worktop from the upper left, with soft natural shadows, and does not touch the screen. Shot on an ARRI Alexa 35, 50mm spherical lens at f/5.6, the phone sharp across its whole surface, warm neutral grade, fine 35mm film grain, hyper-realistic, photoreal. Avoid: any interface or image on the phone screen, glare, reflections or shadows on the screen, notch, older-looking or wrinkled hands, bitten or unpainted nails on women, plastic skin, logos, Apple logo, brand names, readable text, signage, watermarks, extra fingers, deformed hands, CGI look.
```

---

### 08. Theo across the street, long lens. Composite: none

**Framing:** 135mm from the far pavement, the red-brick terrace compressed flat behind him, walking
through a band of low sun between the houses.
**Planned motion (5s):** a slow pan following him left to right. He slows and looks at the phone.

```
Cinematic 16:9 film still from a premium smartphone app commercial. Long-lens shot from the opposite pavement, 135mm, of a 28-year-old British man walking along a quiet red-brick terraced street in northern England on a crisp autumn afternoon, framed from the knees up in the centre of the frame, the row of terraced houses compressed flat behind him with painted front doors, bay windows and low garden walls. He steps into a band of low golden sun falling between two houses, which lights one side of his face and his hair. He looks down at a smartphone in his right hand at chest height, its back facing the camera, with a thoughtful, slightly amused expression, as if he has just remembered something. He is slim, fit and well dressed, and handsome in a natural, believable way, the kind of good-looking real person who does well on social media, not a retouched model. He has fair skin, blue-grey eyes, groomed eyebrows, a clean-shaven jaw with a faint shadow, and light-brown hair, freshly cut, styled with texture and swept back from the forehead. Hyper-realistic skin: visible pores across the nose and cheeks, fine peach fuzz catching the light, subtle natural variation in tone, a real healthy sheen, individual eyelashes and brow hairs, shot like an unretouched high-end campaign portrait. He wears a tailored navy wool overcoat, open, over a grey marl merino crew-neck jumper with the collar of a pale-blue oxford shirt showing, slim charcoal trousers, and a mustard-yellow wool scarf loosely wrapped once. His personality: thoughtful and dependable, the one who never forgets a birthday. Fallen orange leaves on the pavement, no house numbers, no street signs, no cars with number plates, no readable text. The phone: a modern unbranded smartphone with a flat satin graphite aluminium frame and a matte graphite glass back with a small two-lens camera module in a slim vertical pill at the top left, no logo or text anywhere. Shot on an ARRI Alexa 35, 135mm spherical lens at f/2.8, warm neutral grade, fine 35mm film grain, hyper-realistic, photoreal. Avoid: older people, wrinkles, ageing skin, messy or unkempt hair, bitten or unpainted nails on women, plastic skin, airbrushed skin, waxy skin, beauty filter, logos, Apple logo, triangular camera module, brand names, readable text, signage, watermarks, extra fingers, deformed hands, oversaturated colour, HDR look, CGI look.
```

---

### 09. Beside Theo's cheek, paying. Composite: Marigold, the basket, then "Pay"

**Framing:** from right beside his head, his cheek and jaw soft in the left foreground, the phone sharp
beyond it.
**Planned motion (4s):** he stops, and his thumb taps the pay button and holds. Very slight sway.

```
Cinematic 16:9 film still from a premium smartphone app commercial. Tight shot from right beside a young man's head: his cheek, jaw and ear fill the left third of the frame in soft focus in the foreground, and beyond them, sharp in the centre, the smartphone in his right hand at chest height with the screen angled towards the camera, the phone filling about 40% of the frame height. His thumb hovers just above the lower third of the screen. All four corners of the screen are clearly visible and uncovered. The screen is a perfectly flat, uniform, bright chroma-key green (#00FF00) from edge to edge, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, flat satin graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere. His hand is slim and well kept, fair-skinned with visible knuckle creases, neatly trimmed clean nails and a plain silver ring on the little finger. The cuff of a navy wool overcoat at the wrist, and the loose end of a mustard-yellow wool scarf at the lower edge of the frame. His skin in the foreground is hyper-real: visible pores, a faint shadow of stubble along the jaw, light-brown hair freshly cut at the temple. Behind, far out of focus: warm red-brick terraced houses, orange autumn leaves and low golden sunlight. No readable text anywhere. Shot on an ARRI Alexa 35, 50mm spherical lens at f/2, the phone and thumb pin-sharp, warm neutral grade, fine 35mm film grain, hyper-realistic, photoreal. Avoid: any interface or image on the phone screen, glare, reflections or shadows on the screen, notch, older-looking or wrinkled hands, bitten or unpainted nails on women, plastic skin, logos, Apple logo, brand names, readable text, signage, watermarks, extra fingers, deformed hands, CGI look.
```

---

### 10. The hero: hands and phone into the light. Composite: the home screen with the four apps, then the end card

**Framing:** straight on and symmetrical, the hands rise into a band of sun across a warm off-white wall,
the steel window grid as shadow lines behind.
**Planned motion (6s):** a slow push-in. The four app icons land on the home screen, then the phone lowers
out of frame onto "Available on Android & iOS".

```
Cinematic 16:9 film still from a premium smartphone app commercial. Straight-on, perfectly symmetrical product shot of a young woman's two hands holding a smartphone upright towards the camera in the exact centre of the frame, the screen facing the lens squarely, the phone filling about 60% of the frame height. The hands hold the phone lightly from the sides at the lower half, the thumbs resting along the side edges and not touching the screen; all four corners of the screen are clearly visible. The screen is a perfectly flat, uniform, bright chroma-key green (#00FF00) from edge to edge, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, flat satin graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere. The hands are slim and elegant, light skin with a warm undertone, hyper-realistic texture with visible knuckle creases and fine lines, a fresh flawless gel manicure in medium-length almond shape, sheer milky pink with fine gold line-art on two nails, a thin gold ring on the right index finger, and the soft cuffs of a cream cable-knit cardigan at the wrists. Behind, a warm off-white plaster wall (#FBF9F7), out of focus, crossed by the soft shadow lines of a steel-framed window grid and a band of warm yellow afternoon sun from the left. The phone's graphite frame catches a thin clean highlight along its edge. Shot on an ARRI Alexa 35, 85mm spherical lens at f/4, the whole phone sharp, warm neutral grade, fine 35mm film grain, hyper-realistic, photoreal. Avoid: any interface or image on the phone screen, glare, reflections or shadows on the screen, notch, older-looking or wrinkled hands, bitten or unpainted nails on women, plastic skin, logos, Apple logo, brand names, readable text, signage, watermarks, extra fingers, deformed hands, CGI look.
```

---

### Optional

**11. Leo, a reflection (composite: none).** Use the shot 01 prompt with the framing changed to *"shot
through a floor-to-ceiling glass facade: his reflection walks across the glass, overlaid on the city
behind, then he looks up from the phone with a half-smile"*, 50mm at f/2. Attach the 01 still as the
reference.

**12. The thumb tap, extreme close (composite: any app).** Use the shot 04 prompt, reframed to *"an
extreme close-up of the thumb touching the lower half of the screen, the phone filling the frame with all
four corners just inside it"*, 100mm macro at f/5.6. This is a cutaway for whichever app needs it.

## 5b. Reference-style shots (Faisal's board, 24 Sep 2026)

Five looks from references Faisal sent, for video starting frames and for still adverts. The three
object-only shots (P1–P3) have no hands, so they are the most reliable composites of all. Static
adverts made from them belong to the images session; these frames serve both.

### P1. The phone on a suede chair, yellow studio. Composite: home screen with the four apps (the hero)

Reference: a phone lying on a channel-tufted suede chair on an orange sweep. Ours is on brand yellow. No hands, so it is the easiest shot to composite, and it works as a static advert too.

**Planned motion (5s):**
```
Very slow, smooth push-in towards the phone from above, with a slight turn. Nothing else moves; the light stays steady on the suede. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. No people, no hands.
```

```
Minimal, bold still-life photograph for an app advert, looking like a real studio photograph shot on film, not a render. A smartphone lies face up on the seat of a plush, channel-tufted lounge chair upholstered in soft oatmeal-cream suede, the seat made of deep, rounded horizontal channels that curve and sag slightly like a real cushion. The chair sits in a studio where the floor and the wall are one seamless sweep of warm sunflower yellow (close to #FFCF24), a real painted cyclorama with a faint texture and a soft gradient of light falloff, the yellow filling every part of the frame around the chair. A slim bent-oak frame of the chair shows at the lower corners.

The camera looks down at the chair from above at about 70 degrees, with the phone in the exact centre of the frame, lying slightly angled along the curve of the channels, filling about 40% of the frame height. The phone rests naturally in the soft suede, which dips a little under its weight. All four corners of the screen are clearly visible. The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Light: one large soft key light from the upper left, like a big window, giving the suede a soft sheen and gentle shadows in each channel, a soft contact shadow under the phone, and warm yellow light bouncing up from the floor onto the cream suede. The phone screen stays evenly lit and matte. Photographed on a 50mm lens at f/5.6, everything in focus from the phone to the chair edges. Natural colour, true-to-life whites, gentle contrast, real film grain, faint lens softness towards the corners. Photoreal, hyper-realistic, unretouched, like a high-end commercial photograph for an app.

Avoid: people, hands, other objects, props, AI-generated look, CGI, render, HDR, oversaturated colour, oversharpening, neon or glowing green screen, glare, reflections or shadows on the screen, logos, Apple logo, bitten-apple logo, brand names, readable text, watermarks, a flat digital yellow fill, lemon or neon yellow, orange.
```

---

### P2. The phone on an oak table, bands of sun. Composite: Marigold, "Payment confirmed"

Reference: a phone on the edge of a round oak table, crossed by hard window light, a tablet beside it. The phone sits inside one band of sun, because a shadow edge across the green would break the key.

**Planned motion (5s):**
```
Very slow, smooth slide along the table edge towards the phone. The bands of sunlight drift very slightly, as if a cloud passes; no shadow edge crosses the phone screen. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. No people, no hands.
```

```
Quiet, sunlit still-life photograph for an app advert, looking like a real photograph shot on film, not a render. A smartphone lies face up near the curved edge of a round, pale oak dining table with a fine, straight wood grain and a softly rounded, layered edge. Beside it, to the left and partly out of frame, lies a tablet with its dark screen switched off and no logo. The table is in a calm, modern flat; the wall and floor behind are soft warm grey and far out of focus.

Low afternoon sun comes through a window out of frame and falls across the table in broad, clean diagonal bands of warm light and cool shadow. The phone lies entirely inside one band of sunlight, so no shadow edge crosses its screen; the sharp edge of the next shadow band runs across the table just beyond it. The phone casts a short, crisp shadow on the wood.

The camera looks down at about 40 degrees from the side of the table, the phone in the centre of the frame, turned at a slight angle to the lens, filling about 35% of the frame height. All four corners of the screen are clearly visible. The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Photographed on a 50mm lens at f/2.8, the phone and the table edge around it sharp, the tablet slightly soft, the background melting into soft grey. Natural colour, true-to-life whites, gentle contrast, real film grain, faint lens softness towards the corners. Photoreal, hyper-realistic, unretouched, like a high-end commercial photograph for an app.

Avoid: people, hands, AI-generated look, CGI, render, HDR, oversaturated colour, oversharpening, neon or glowing green screen, glare, reflections or shadows on the screen, logos, Apple logo, bitten-apple logo, brand names, readable text, watermarks, a shadow edge crossing the phone screen, clutter, a logo on the tablet.
```

---

### P3. The phone between a laptop and a coffee. Composite: Sage & Co, the order screen

Reference: a phone on a beige desk between a laptop and a coffee, with soft window shadows. The laptop carries no logo.

**Planned motion (5s):**
```
Very slow, smooth push-in towards the phone. A faint wisp of steam rises from the coffee. The window light stays steady; no shadow edge crosses the phone screen. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. No people, no hands.
```

```
Soft, real workspace still-life photograph for an app advert, looking like a real photograph shot on film, not a render. A smartphone lies face up on a warm beige desk, between an open silver aluminium laptop at the upper left of the frame and a plain white ceramic cup of black coffee at the lower right, only partly in frame. The laptop has no logo anywhere, and its keyboard keys are too soft and far to read. The desk surface is a matte, warm sand-beige laminate with faint real wear.

Soft late-afternoon window light falls across the desk in wide, gentle diagonal bands of light and soft shadow, from a window out of frame at the upper right. The phone lies fully inside one band of light, so no shadow edge crosses its screen. The phone casts a soft shadow on the desk.

The camera looks down at about 55 degrees, the phone in the centre of the frame and turned at a slight angle, filling about 45% of the frame height. All four corners of the screen are clearly visible. The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Photographed on a 50mm lens at f/2.8, the phone sharp, the laptop and cup softly out of focus at the frame edges. Warm, calm and minimal. Natural colour, true-to-life whites, gentle contrast, real film grain, faint lens softness towards the corners. Photoreal, hyper-realistic, unretouched, like a high-end commercial photograph for an app.

Avoid: people, hands, AI-generated look, CGI, render, HDR, oversaturated colour, oversharpening, neon or glowing green screen, glare, reflections or shadows on the screen, logos, Apple logo, bitten-apple logo, brand names, readable text, watermarks, a logo on the laptop, readable keys, a shadow edge crossing the phone screen, clutter, papers, notebooks with text.
```

---

### 02D. Over the shoulder, hair in the foreground (Faisal attaches the reference). Composite: Sage & Co or Kestrel

Reference: the high over-the-shoulder shot looking past her hair onto two hands and the phone, pavement far below. Faisal attaches that image, and the prompt tells the model to take only the angle and framing from it, recast to his casting rule.

**Planned motion (5s):**
```
Subtle handheld over-the-shoulder camera, breathing slightly. Her hair sways a little in a light breeze. Her right thumb taps the screen once, then again a moment later. Her face never enters the frame. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

```
Use the attached reference image for the camera angle, framing and composition only: the high over-the-shoulder view looking down past her hair onto two hands holding a phone, with the pavement blurred far below. Replace the person, her hair, her clothes, the phone and the screen with what is described here.

Candid street photograph, looking like a real frame shot on film, not a render. A high-angle over-the-shoulder shot from just behind and above the right shoulder of a 25-year-old woman standing on a city pavement, looking down at the smartphone in her hands. Her face is not in the frame. Long, glossy, straight chestnut-brown hair falls down the left side of the frame in the soft-focus foreground, hanging past her shoulder. She holds the phone upright in both hands at the height of her waist: her left hand holds the top-left of the phone from behind, her right hand holds the right edge from behind, and her right thumb is on the lower third of the screen, tapping. The phone sits in the centre of the frame, filling about 40% of the frame height, the screen tilted up towards her and seen by the camera at a slight angle. All four corners of the screen are clearly visible and no finger covers a corner. The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Her hands: slim, elegant young hands with light skin and a warm undertone, real skin texture with fine creases over the knuckles. Her nails are a fresh gel manicure, medium almond shape, glossy sheer pink with fine gold line-art on three nails. She wears a soft pale-blue knitted cardigan, its cuff at her right wrist, over a pale blue and white floral cotton dress, visible below the phone in soft focus.

Far below and behind, heavily out of focus: grey concrete paving slabs with their joints running diagonally, on an overcast day. Soft, even daylight, no sun, no hard shadows. Photographed on a 50mm lens at f/2.2, the hands and phone sharp, the hair in the foreground soft, the pavement a smooth blur. Natural colour, true-to-life whites, gentle contrast, real film grain, faint lens softness towards the corners. Photoreal, hyper-realistic, unretouched, like a high-end commercial photograph for an app.

Avoid: her face, a second person, the person from the reference image, braids, AI-generated look, CGI, render, HDR, oversaturated colour, oversharpening, neon or glowing green screen, glare, reflections or shadows on the screen, logos, Apple logo, bitten-apple logo, brand names, readable text, watermarks, fingers covering the screen corners, chipped or unpainted nails, extra fingers, deformed hands.
```

---

### F1. Direct flash, a hand holds the phone out, hard shadow on the wall. Composite: Ironvale, "Join"

Reference: an on-camera flash shot, a hand holding the phone out over white trousers, the hand's hard shadow on the wall. The risk is flash glare on the screen: the prompt moves the flash off-axis and asks for a matte screen. Check the still before animating it.

**Planned motion (5s):**
```
Near-static, with the faint natural movement of a hand holding a phone out. The hard shadow on the wall moves with the hand. No one else appears. The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, image or text ever appears on it. The hand keeps five fingers throughout.
```

```
Direct-flash photograph, like a real point-and-shoot or on-camera flash shot on film, not a render. A first-person view of a young man sitting on the floor, holding a smartphone out in front of him in his right hand at chest height, the screen facing the camera, while his legs stretch out below in soft, white waffle-knit lounge trousers. He is the only person in the image; his face is not in the frame.

A hard, direct flash from just above the camera lights the hand, the phone and the white fabric brightly, and throws one crisp, dark shadow of the hand and the phone onto the warm taupe plaster wall behind. The flash is slightly off to the left of the lens so its reflection does not land on the phone screen. The rest of the room falls off into warm, dim shadow, as it does in real flash photography.

How he holds it: the phone upright, gripped from the left side, his fingers wrapped around the right edge with the fingertips just showing, his thumb resting along the left edge, not on the screen. The phone is in the centre of the frame and fills about 45% of the frame height, square to the camera with a slight tilt. All four corners of the screen are clearly visible. The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

His hand: a young man's hand, slim, light skin with a warm undertone, real skin texture with creases over the knuckles, short clean nails. The cuff of a white waffle-knit long-sleeved top at the wrist. Below, his knees and white trousers, one bare foot soft at the edge of the frame. 25 years old, slim, well kept.

Photographed on a 35mm lens at f/5.6 with direct flash: bright, flat light on the subject, crisp hard shadows, slightly warm ambient falloff, true colour, real film grain. Editorial, raw and stylish. Photoreal, hyper-realistic, unretouched.

Avoid: his face, a second person, AI-generated look, CGI, render, HDR, oversaturated colour, oversharpening, neon or glowing green screen, glare, reflections or shadows on the screen, logos, Apple logo, bitten-apple logo, brand names, readable text, watermarks, a flash hotspot or reflection on the screen, soft or diffused light, bokeh, extra fingers, deformed hands.
```

---

## 6. The pilot, before anything else

Generate **03, 04 and 02C**. Only 03 takes a reference image: Faisal's character sheet for Mia, attached as image 1. Then make
image-to-video clips of all three at 1080p: **03 at 6s, 04 at 5s, 02 at 5s**. If the model only offers 5
or 10, choose 5; past about 6s, faces and hands start to morph. These are the video prompts:

**03**
```
Very slow push-in across the coffee table towards her, the candle flame flickering gently in the foreground. She scrolls with her thumb, pauses, a small smile spreads, then she taps once and lets her head rest back against the sofa for a moment. The sunlight and the window-grid shadows stay still on the brick. The phone's back faces the camera throughout. Natural, unhurried, realistic movement.
```

**04**
```
Point of view, near-static, with only the faint natural movement of hands holding a phone and a slight breath. Her right thumb taps the lower half of the screen once, then again a moment later. The nails stay exactly as they are. The phone screen stays a perfectly flat, uniform chroma-key green for the entire clip; no interface, image or text ever appears on it. The hands keep five fingers throughout. Natural, unhurried movement.
```

**02**
```
Subtle handheld over-the-shoulder camera, breathing slightly. He stands still at the kerb; his thumb scrolls up once, then taps. In the soft background a pedestrian passes. His legs and feet stay out of frame. The phone screen stays a perfectly flat, uniform chroma-key green for the entire clip; no interface, image or text ever appears on it. The hands keep five fingers throughout. Natural, unhurried movement.
```

Tell me when they're done. I pull them from your Higgsfield generations through the sandbox, key 04 and 02,
track the corners and composite the Kestrel and Sage & Co screens. I then send you the two composited
clips. **Only then are the other shots worth generating.** If the green won't hold in the video model or
the corners won't track, we change the method (for example, a still phone composited in post, or
tracking markers) before spending credits on the other eight.

**Pilot result, 24 Sep 2026: passed.** Three Kling 3.0 clips (5s, 1912x1080, 24 fps) from Faisal's stills: the
pavement over-the-shoulder, the terrazzo table and Mia on the floor. With the locked prompts the green held in both
screen clips; Kling added a notch and some glare to the pavement phone, and both are kept (the notch reads as a real
phone; the glare is lifted off the green and laid back over the app). Screens: Sage & Co on the pavement, a new pink
nail-salon app (Rosehip Nails, invented; needs the same Companies House check) on the table, Marigold Lane as floating
glass cards around Mia's phone. Taps are timed to the fingertip track, and the time slot is scrolled to sit under her
finger when she taps. Tools: `tools/comp_video.py` (key, track, composite), `tools/float_cards.py` (phone track and
cards), `screens/` (app screens and cards, rendered with Playwright). Corner and phone tracks are in `pilot/`, so new
screens go in without re-tracking.

## 7. What happens after the pilot

1. The remaining stills, then the clips, landscape 16:9.
2. I key, track and composite every clip. The plates and the corner data are stored in this folder, so
   your real screen recordings can go in later without regenerating anything.
3. The 16:9 master is edited in HyperFrames: the MA01 headlines (Order. Book. Join. Pay.), "Available on
   Android & iOS", neropay.app, the locked outro and the mix.
4. The 1:1 cut is cropped from the master. For the 9:16 cut, the Reel's shots are reframed and re-animated
   as described in §3.
5. A register row is written in `library.js` in the same commit as the first render.

## 8. Open before posting

- The Companies House check on Sage & Co, Kestrel, Ironvale and Marigold carries over from MA01.
- The copy has to say who the ad is for. The frames show customers, but the buyer is a merchant.
  Without a line like "Your customers. Your app." a viewer reads it as a consumer app. That line is
  drafted at the edit, not now.

## 9. The full ad (25 Sep 2026)

The pilot passed in DaVinci (v05): tracking and spill are solved. This is the shot list for the full 16:9 advert, about
30 s plus the locked outro. The three pilot stills stay: the pavement, the terrazzo table and Mia on the floor. Five
stills are new. Every screen shot follows *Phone motion for green-screen plates* (§3).

**Clips.** Use Kling 3.0: 5 s, 1080p, 24 fps. Make 2–3 takes of every clip with a green screen and one of the others.
Regenerate the **pavement** clip from its existing start still: its phone rocks. The **table** and **Mia** clips
tracked cleanly and stay. Their new motion prompts are here for a retake only if the edit needs one.

| # | Shot | Still | Screen | Edit (s) | Line on screen (draft) |
|---|---|---|---|---|---|
| 1 | The tap, yellow studio | new | home screen, taps Sage & Co | 0–2.5 | Your shop, on their phone. |
| 2 | Pavement, over the shoulder | have | Sage & Co: scroll, add | 2.5–6 | Order. |
| 3 | Terrazzo table | have | Rosehip Nails: service, scroll, time | 6–9.5 | Book. |
| 4 | Hannah through the doorway | new | none (back of phone) | 9.5–11.5 | |
| 5 | Overhead on the worktop | new | Ironvale: class, Join | 11.5–14.5 | Join. |
| 6 | Mia on the floor | have | none (glass cards in the room) | 14.5–18 | |
| 7 | Mia's hands, paying | new | Marigold Lane: basket, Pay | 18–20.5 | Pay. |
| 8 | The phone on the yellow chair (P1) | new | home screen, the four apps land | 20.5–26 | Your customers. Your app. / Available on Android & iOS |
| | Locked yellow outro | | | 26–29 | neropay.app |

The lines are drafts for the edit, not approved copy. §8 still applies: the ad has to say it is for the merchant.

### 9.1 The tap, yellow studio (new). Screen: home screen, the finger opens Sage & Co

**Still**
```
Minimal studio photograph, looking like a real frame shot on film in a real photo studio, not a render. A close-up of a young woman's two hands holding a smartphone upright in portrait orientation in front of a warm sunflower-yellow seamless paper backdrop (close to #FFCF24). We see only her hands, her wrists and the cuffs of her sleeves; she is the only person in the image and her face is not in the frame.

The phone is in the centre of the frame at chest height, about 40 cm from the lens, facing the camera almost squarely with a slight tilt back of about 15 degrees, and fills about 65% of the frame height. Her left hand holds it from below and behind: the phone's lower edge rests on her left fingers, and her left thumb rests along the left side of the phone's frame, not on the screen. Her right hand is raised beside the phone at the lower right, the index finger extended and relaxed about 3 cm in front of the upper half of the screen, about to tap. All four corners of the screen are clearly visible, with the thin black bezel showing all the way round; no finger covers a corner or lies along an edge.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Her hands: slim, elegant young hands with long fingers and light skin with a warm undertone. Hyper-real skin texture: fine creases over the knuckles, faint veins on the backs of the hands, a little natural pinkness at the fingertips. Her nails are a fresh gel manicure, medium-length soft almond shape, glossy sheer nude with a fine gold chrome tip, neat cuticles. A thin gold ring on her right ring finger. The crisp cuffs of a white cotton shirt at her wrists.

Light: one large soft key light from the upper left through a big diffuser, and warm yellow light bouncing off the backdrop onto the backs of her hands and the edge of the phone's frame, as it would in a real studio. The screen stays evenly lit and matte, with no reflection of the light. Photographed on an 85mm lens at f/5.6, the hands and the whole phone sharp, the backdrop smooth with the faint texture of the paper. Natural colour, true warm yellow, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: her face, a second person, props, AI-generated look, CGI, render, a flat digital yellow fill, lemon or neon yellow, orange, glowing highlights, HDR, oversaturated colour, oversharpening, plastic skin, neon or glowing green screen, glare or a reflection of the light on the screen, fingers covering the screen corners, oversized hands, chipped or unpainted nails, logos, Apple logo, brand names, readable text, watermarks, extra fingers, deformed hands.
```

**Motion (5 s)**
```
The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, notch, status bar, icon, image, text, glare, sweep of light or reflection ever appears on it. Static camera with a very slight, slow drift in. Her left hand holds the phone completely steady and level; the phone does not wobble, rock, tilt or twist, and keeps its exact shape and size. Only her right hand moves. At about one second her index finger moves in and taps the upper half of the screen once, a clear, deliberate press and lift. The hand then lowers slowly out of the frame at the lower right, never covering a corner of the screen. The yellow backdrop and the light stay still. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

### 9.2 Pavement, over the shoulder (have the still: regenerate the clip). Screen: Sage & Co, scroll, then add

Start still: `hf_20260924_215954_d057fbb2-509b-4d6b-b598-f1a8e771bee3.png`.

**Motion (5 s)**
```
The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, notch, status bar, icon, image, text, glare, sweep of light or reflection ever appears on it. Static camera with a very slight, slow drift in. She holds the phone steady and level in both hands, close to her body; the phone does not wobble, rock, tilt or twist, and keeps its exact shape and size. Her hair in the foreground stays still. Only her right thumb moves. At about one second it lands on the lower third of the screen and drags slowly and smoothly up to the middle in one scroll, then lifts. At about three seconds it taps the lower middle of the screen once, a clear, deliberate press and lift, then stays just above the screen for the rest of the clip. The thumb never lies along the edge of the screen. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

### 9.3 Terrazzo table (have the still and a good clip; retake only if needed). Screen: Rosehip Nails

**Motion (5 s)**
```
The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, notch, status bar, icon, image, text, glare, sweep of light or reflection ever appears on it. Static camera with a very slight, slow drift in. Her left hand holds the phone steady and level; the phone does not wobble, rock, tilt or twist, and keeps its exact shape and size. Only her right hand moves. At about one second her index finger taps the middle of the screen once, a clear, deliberate press and lift. At about two seconds it touches the lower third of the screen and drags slowly up to the upper third in one smooth scroll, then lifts. At about four seconds it taps the upper third of the screen once, then the hand withdraws to the right. The finger never covers a corner of the screen. A faint wisp of steam rises from the coffee; the golden sunlight and the long shadows stay still. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

### 9.4 Hannah through the doorway (new). Screen: none, the back of the phone faces us

**Still**
```
Candid documentary-style photograph of a real home, looking like a frame from a 35mm film camera, not a render. A frame-within-a-frame shot from a dim hallway, looking through an open doorway whose painted dark-grey frame borders the image, into a bright, modern kitchen in a Manchester flat at seven in the morning. In the centre of the doorway, a 28-year-old British woman leans with her hip against a pale quartz worktop, dressed for training before work. She holds a plain mustard-yellow ceramic mug of coffee in her left hand and a smartphone in her right hand at waist height, the back of the phone facing the camera, and looks down at it with a focused, pleased expression. She is the only person in the image.

She is slim and athletic, and pretty in a natural, believable way, not a retouched model. She has fair, clear skin with a light dusting of freckles across the nose and a fresh healthy flush, and minimal fresh makeup: groomed brows, a touch of mascara, a tinted lip balm. Hyper-real skin: visible pores, fine peach fuzz catching the light, subtle variation in tone, individual lashes. Her long honey-blonde hair is in a sleek high ponytail, glossy and well cared for. Her nails are a fresh gel manicure, short-to-medium squoval shape in milky pink with a small chrome accent on the ring finger. She wears a fitted charcoal half-zip training top with the sleeves pushed up, black full-length leggings and white socks.

The kitchen is lived in and tidy: matte sage-green flat-fronted cabinets, a white tiled splashback, a kettle, a wooden chopping board leaning against the tiles, a bowl of bananas, a set of keys and a rolled grey gym towel on the worktop. Soft, cool early daylight comes through a window at frame right, with one warm band of low sun across the worktop behind her. The hallway in the foreground is dim, with the soft edge of a coat on a hook at frame left. The phone: a modern unbranded smartphone with a flat graphite aluminium frame and a matte graphite glass back with a small two-lens camera module in a slim vertical pill at the top left, no logo or text anywhere. Photographed on a 40mm lens at f/4, the doorway frame soft and dark, the kitchen bright and readable. Natural, slightly muted colour, true-to-life whites, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: a second person, older people, wrinkles, messy or unkempt hair, bitten or unpainted nails, AI-generated look, CGI, render, showroom kitchen, golden glow over everything, HDR, teal and orange grade, oversaturated colour, oversharpening, plastic skin, beauty filter, the phone screen facing the camera, logos on appliances, Apple logo, brand names, readable text, watermarks, extra fingers, deformed hands.
```

**Motion (5 s)**
```
Slow, smooth dolly forward towards the doorway, steady, no shake. She takes a sip of coffee, looks down at the phone, a small smile spreads, and she taps it once with her thumb. The back of the phone faces the camera throughout. The window light and the band of sun stay still. She is the only person in the scene. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

### 9.5 Overhead on the worktop (new). Screen: Ironvale, a class, then "Join"

The easiest shot to track: the phone lies flat and never moves.

**Still**
```
Clean overhead photograph, looking like a real frame shot on film, not a render. The camera points straight down at a pale grey-veined white quartz kitchen worktop. A smartphone lies flat on the worktop, face up, slightly left of the centre of the frame, square to the frame edges, filling about 55% of the frame height. A young woman's right hand comes in from the right-hand edge of the frame, level with the middle of the phone, her index finger extended and hovering just above the middle of the screen, about to tap. Her hand stays to the right of the phone and does not cover any corner of it. All four corners of the screen are clearly visible, with the thin black bezel showing all the way round.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Her hand: slim and fair, hyper-real skin with fine knuckle creases, a fresh gel manicure in milky pink, short-to-medium squoval, with a small chrome accent on the ring finger, and the pushed-up sleeve of a charcoal training top at the wrist. Around the phone, in a loose, natural arrangement: a plain mustard-yellow ceramic mug of black coffee at the upper left with a wisp of steam, a rolled grey gym towel at the upper right, a set of plain keys at the lower left. A soft diagonal band of warm morning sun crosses the worktop at the upper left and stops well short of the phone; the phone and the hand are in soft, even daylight. Photographed on a 50mm lens at f/5.6, the whole phone and the hand sharp. Natural colour, true-to-life whites, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: a second person, any face, AI-generated look, CGI, render, HDR, oversaturated colour, oversharpening, plastic skin, neon or glowing green screen, glare, reflections or shadows on the screen, a sun edge across the phone, the hand covering a corner of the phone, green objects near the phone, chipped or unpainted nails, logos, Apple logo, brand names, readable text, watermarks, extra fingers, deformed hands.
```

**Motion (5 s)**
```
The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, notch, status bar, icon, image, text, glare, sweep of light or reflection ever appears on it. Locked-off overhead camera, completely still. The phone lies flat on the worktop and does not move at all. At about one second her index finger taps the middle of the screen once, a clear, deliberate press and lift. At about three seconds it taps the lower third of the screen once more, then the hand slides back out of the frame to the right. Her hand never covers a corner of the phone. Steam rises gently from the mug; the band of sunlight stays still. The hand keeps five fingers throughout. Natural, unhurried, realistic movement.
```

### 9.6 Mia on the floor (have the still and a good clip; retake only if needed). Screen: none, glass cards in the room

**Motion (5 s)**
```
Locked-off camera with a very slow, smooth push-in across the coffee table towards her; no shake and no handheld movement. The candle flame flickers gently in the foreground. She holds the phone in both hands with her forearms resting on her knees, its back to the camera throughout. She scrolls with her thumb, pauses, a small smile spreads, then she taps once and lets her head rest back against the sofa for a moment. The daylight and the lamp stay steady. She is the only person in the scene. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

### 9.7 Mia's hands, paying (new). Screen: Marigold Lane, the basket, then "Pay"

Her point of view in the same room as 9.6: the same cardigan, jeans, nails and ring. No face, so no reference image is needed.

**Still**
```
Candid first-person photograph in a real, lived-in home, looking like a frame from a 35mm film camera, not a render. The camera is the eyes of a young woman sitting on a worn rug on the floor of her living room with her back against a sofa, looking down at the smartphone in her own hands. The only parts of her we see are her two hands, her forearms in the cuffs of a cream cable-knit cardigan with the sleeves pushed up, and her knees in relaxed light-blue straight-leg jeans. She is the only person in the image: no face, no second person, no reflection.

Her forearms rest on her drawn-up knees, which keeps the phone steady. She holds the phone upright in portrait orientation in both hands just above her knees, about 35 cm below her eyes, with the screen facing up towards the camera and tilted slightly towards it. The phone is in the centre of the frame and fills about 50% of the frame height. Her left hand cradles it from the left and behind, the left fingertips just visible along the left side between the corners. Her right hand holds the right edge from behind, and her right thumb is lifted just above the lower half of the screen, about to tap. All four corners of the screen are clearly visible, with the thin black bezel showing all the way round; no finger covers a corner or lies along an edge.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen indoors, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Her hands: slim, elegant young hands with light skin and a warm undertone, hyper-real texture with fine knuckle creases and a little natural pinkness at the fingertips. Her nails are a fresh gel manicure, medium-length almond shape, sheer milky pink, with fine gold line-art on two nails; a thin gold ring on her right index finger. Beyond her knees, soft but readable: the edge of a low round travertine coffee table with a plain mustard-yellow ceramic mug of tea on it, a worn vintage rug in faded rust, cream and indigo, pale oak floorboards, and a pair of socks kicked off by the rug. Light: a bright overcast afternoon, soft even daylight from a window at the left mixed with the warm glow of a lamp; no sun beams and no hard shadows on the phone. Photographed on a 28mm lens at f/4 from her eye level, the hands, nails and phone sharp, the room soft. Natural, slightly muted colour, true-to-life whites, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: a second person, any face, any head, a selfie, AI-generated look, CGI, render, showroom styling, golden hour, HDR, teal and orange grade, oversaturated colour, oversharpening, plastic skin, neon or glowing green screen, glare or shadows on the screen, fingers covering the screen corners, green objects near the phone, chunky or older-looking hands, chipped or unpainted nails, logos, Apple logo, brand names, readable text, watermarks, extra fingers, deformed hands.
```

**Motion (5 s)**
```
The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, notch, status bar, icon, image, text, glare, sweep of light or reflection ever appears on it. Static camera with a very slight, slow drift in. Her forearms rest on her knees and the phone stays steady and level in her hands; it does not wobble, rock, tilt or twist, and keeps its exact shape and size. Only her right thumb moves. At about one second it lands on the lower third of the screen and drags slowly up to the middle in one scroll, then lifts. At about three seconds it taps the lower middle of the screen once, a clear, deliberate press and lift, then rests just above the screen. The thumb never lies along the edge of the screen. The hands keep five fingers throughout. Natural, unhurried, realistic movement.
```

### 9.8 The phone on the yellow chair (new: the P1 still in §5b). Screen: home screen, the four apps land, then the end line

Use the P1 still prompt as written in §5b.

**Motion (5 s)**
```
The phone screen stays a solid, flat, matte chroma-key green for the entire clip; no interface, notch, status bar, icon, image, text, glare, sweep of light or reflection ever appears on it. Very slow, smooth push-in straight down towards the phone, with no rotation and no shake. The phone lies still on the suede and nothing in the scene moves; the light stays steady. No people, no hands.
```

## 10. Café and Athlete: the stills (25 Sep 2026)

Two sequences Faisal chose on 25 Sep 2026. **Café** replaces 9.1 as the opener. It is an FPV drone dive over the
rooftops that lands overhead on a phone on a terrace table; she taps, the app opens, and the camera pushes into the
app's hero photo, which becomes the live café. **Athlete** replaces 9.4 and 9.5 as the Join section. He walks up to
his car's boot, books an evening boxing session over the shoulder, smirks, then opens the boot. Stills first; the
motion prompts follow once the frames are chosen. Settings as §2: GPT Image 2.5, 16:9, 2k, four per prompt.

**Order of generation.**
- Café: C2 (the landing) first, then C1 with C2 attached so the terrace below matches, then C3.
- Athlete: A0 (character sheet), then AL (the empty location), then A1, B and C, each with A0 and AL attached. Add the
  chosen A1 as a third reference for B and C so the light matches.

**Continuity for Athlete.** Shot A is one clip, and the edit cuts away at his pause and returns to the same take, so
the two A halves match by construction. B and C carry the same fixed description: the car, the street, the sun behind
him and low, his outfit, the bag. Casting: Faisal asked for a dark-skinned British athlete for this sequence (25 Sep
2026), which changes his 24 Sep note in §1 for this shot only.

### Café

**v2, 25 Sep 2026, after Faisal's first C2.** The faults in that frame:
- The hands had no logic: the pressing finger came in from the side, and the cup hand reached across with no body
  behind it.
- The phone lay flat and nobody held it.
- An empty chair faced the wrong way.
- A green wall closed the terrace off, so nothing said pavement, kerb or road.

The fix:
- **Her place:** she now sits at the bottom edge of the frame facing the street, so only her chair's two armrests and
  her lap show.
- **The phone:** her left hand holds it, resting on the table. Her right index finger comes up from her side to press
  a button.
- **The street:** beyond the table is the pavement, then the kerb, then the road in sun.
- **Every item** is placed by position in the frame.
- **The light** is bright late-morning sun, not golden hour, because the pavement shot is already golden hour. The
  table sits in the awning's shade, which keeps the green even.
- **The food:** brunch and an iced matcha, placed well away from the phone.

**C2. The landing, overhead on a terrace table (generate first; this is the end frame of the dive)**
```
Overhead photograph of a brunch table on a café's pavement terrace, looking like a real frame shot on film, not a render. Late morning on a bright, sunny autumn day in a northern English city. The camera points straight down from about 1.3 metres above a small round white Carrara marble bistro table, about 60 cm across, which fills the centre of the frame. The top of the frame is the street side; the bottom of the frame is where she sits.

Where she sits: at the bottom edge of the frame, facing the street, in a woven rattan bistro chair. From above we see only the two curved bamboo-framed rattan armrests of her chair, one in each lower corner of the frame, and between them her knees and thighs in light-wash straight-leg jeans. We never see her face, head or shoulders. Her forearms come up onto the table from the bottom edge of the frame.

How she uses the phone, as a real person does: she holds it in her left hand, low over the table just in front of her, her left forearm resting along the near edge of the table. The phone is upright in portrait orientation, its top pointing away from her towards the street and its bottom edge resting lightly on the marble, and it leans back in her hand at a shallow angle of about 20 degrees, so the screen faces up towards the camera. Her left fingers wrap around the left side and the back of the phone, their tips just showing along the left side between the corners, and her left thumb rests on the phone's left frame, not on the screen. Her right hand comes up from her side of the table, from below the phone, wrist relaxed, her right forearm resting on the table edge: her index finger is extended and hovers about a centimetre above the lower middle of the screen, about to press a button, her other fingers loosely curled under. The rest of her right hand stays below the phone, off the screen. The phone sits just left of the centre of the frame and fills about 40% of the frame height. All four corners of the screen are clearly visible, with the thin black bezel showing all the way round; one lower corner shows on each side of her index finger, and no finger lies along an edge.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

Her hands: slim, elegant young hands with light skin and a warm undertone, hyper-real texture with fine creases over the knuckles, faint veins on the backs of the hands and a little natural pinkness at the fingertips. Her nails are a fresh gel manicure, short almond shape, glossy cherry red, neat cuticles. A fine gold chain bracelet on her left wrist, a thin gold ring on her right middle finger, and the pushed-up cuffs of an oversized cream cable-knit jumper on both forearms.

On the table, each item exactly where it is:
- Upper right, well away from the phone: her brunch on a round speckled oatmeal stoneware plate about 26 cm across: two slices of toasted sourdough topped with whipped ricotta, blistered roasted cherry tomatoes on the vine and a soft poached egg with a glossy golden yolk, finished with a drizzle of olive oil, cracked black pepper and flaky salt. A fork and a knife with brushed-brass handles rest together across the right side of the plate.
- Right of the plate, near the right edge of the table and at least a hand's width from the phone: an iced matcha latte in a clear, straight-sided glass, a soft milky pale jade green layered over white milk, with a few ice cubes and a plain white paper straw.
- Upper left: a small clear glass carafe of water with a clear tumbler beside it, catching bright highlights.
- Lower left, beside her left elbow: a folded mustard-yellow linen napkin and a pair of folded tortoiseshell sunglasses.
- A few sourdough crumbs on the marble near the plate. Nothing else is on the table.

Around the table, seen from above:
- Along the top edge of the frame, soft and close to the lens: the scalloped hem of a sage-green canvas awning hanging down from above the camera.
- Beyond the table at the top of the frame: about a metre of pale grey sandstone paving slabs, then a granite kerb, then a strip of dark asphalt road in bright sun with a worn double yellow line along its edge, a cast-iron drain grate and a few fallen leaves in the gutter. The crisp scalloped shadow of the awning's hem runs across the paving between the table and the kerb.
- Left: the edge of a neighbouring round marble table, empty, cut off by the left edge of the frame, with one rattan chair tucked under it.
- Right: the rim of a round terracotta planter of lavender and a black metal café barrier post.
- Under the table: pale grey sandstone slabs with fine grit, darker joints and a single fallen leaf.

Light: late morning, a bright, clear, sunny day, the sun high and only slightly warm, not golden hour. The pavement beyond, the kerb and the road are in bright direct sunlight. The table, her hands, the phone and the food are all in the clean, bright open shade of the awning, lit evenly by strong daylight bouncing up off the pale paving, with soft shadows under the plate, the glass and her hands. No hard sun edge crosses the table or the phone. Photographed on a 35mm lens at f/5.6, everything on the table sharp, the awning hem soft. Natural colour, true whites, clean and fresh, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: her face, her head, her shoulders, a second person at the table, an empty chair facing the table, a wall or fence behind the table, the phone lying flat with no one holding it, a hand coming in from the side, fingers covering the screen corners, a finger lying along the edge of the screen, AI-generated look, CGI, render, golden hour, orange light, HDR, oversaturated colour, orange-and-teal grade, oversharpening, plastic skin, plastic-looking food, neon or glowing green screen, glare, reflections or shadows on the screen, a sun edge across the table or phone, green objects touching the phone, chipped or unpainted nails, logos, Apple logo, brand names, readable text, writing on the awning, printed straws, watermarks, extra fingers, deformed hands.
```

**C1. The top of the dive, over the rooftops (attach your chosen C2 as image 1)**
```
Use the attached image (image 1) only for the café terrace far below: the sage-green scalloped awning, the white marble tables, the rattan chairs and the bright late-morning light. Everything else comes from this prompt.

Aerial photograph from an FPV drone, looking like a real frame from a drone camera, not a render. Late morning on a bright, sunny autumn day. The drone hovers about 40 metres above the rooftops of a city-centre district of converted red-brick Victorian warehouses in the north of England, looking forward and down at about 45 degrees.

What is in the frame, from front to back:
- In the foreground, below and ahead of the drone: the flat roof of a warehouse with grey bitumen felt, a row of three glass skylights, two galvanised steel air vents, a low brick parapet with sandstone coping stones, and a small roof garden in one corner with four wooden planters of ornamental grasses and a pair of folding chairs.
- In the middle distance, left and right: pitched Welsh slate roofs with lead flashing, tall red-brick chimney stacks with clay pots, rusted black iron fire escapes zig-zagging down the side walls, and rows of tall arched warehouse windows with dark frames.
- Through the centre of the frame: a narrow one-way street runs away from the camera between the buildings like a canyon, about 12 metres wide, with pale grey pavements on both sides, a dark asphalt road with a worn double yellow line along each kerb, three parked cars with no readable plates, a cyclist and a few people walking.
- At the bottom of that street, small but clear and in the exact centre of the frame: the café's pavement terrace, a sage-green canvas awning with a scalloped hem over a sage-painted timber shopfront with big windows, and in front of it two rows of small round white marble tables with rattan chairs, about eight tables in all, a few of them taken by people eating and talking, one terracotta planter of lavender at each end.
- In the far distance: more red-brick rooftops fading into a light haze, and a clear pale-blue sky with a few small white clouds along the top edge of the frame.

Light: bright late-morning sun from the upper left, high in the sky and only slightly warm, not golden hour; the red brick is lit a clean terracotta, the slate roofs catch a silvery sheen, and short, crisp shadows fall to the lower right. The café terrace is in sunlight with the awning casting shade over the tables nearest the shopfront. No recognisable landmarks, no famous buildings, no towers you could name.

Photographed on an 18mm lens at f/5.6, sharp across the frame, a very slight natural lens distortion at the edges. Natural colour, clean and true, gentle contrast, a little atmospheric haze in the distance, fine grain. Photoreal, hyper-realistic.

Avoid: recognisable landmarks, famous buildings, readable signs, shop names, logos, text, writing on the awning, readable number plates, golden hour, sunset, orange light, fisheye distortion, tilt-shift miniature look, toy-town look, CGI, render, video-game look, HDR, oversaturated colour, orange-and-teal grade, oversharpening, warped or bending buildings, watermarks.
```

**C3. Inside the café (the app's hero photo, then the live shot it becomes)**
```
Bright, natural interior photograph of an independent neighbourhood café, looking like a real frame shot on film, not a render. Late morning on a sunny autumn day. The camera is at counter height, about 60 cm back from the end of a long pastry counter on the right of the frame, looking along the counter and across the room towards the big front windows.

What is in the frame, from front to back:
- In the foreground at the right, sharp: the end of a glass pastry cabinet with curved glass. Inside, on three white ceramic trays in a neat row: glossy almond croissants topped with flaked almonds and icing sugar, pains au chocolat with dark chocolate showing at the ends, and cinnamon knots glazed with sugar. On a white cake stand on top of the cabinet: a whole lemon tart with one slice cut out. Small white price cards stand in front of each tray, too soft and small to read.
- The counter: its front is laid in glossy sage-green zellige tiles with slight handmade variation in the glaze; its top is thick pale oak with a soft worn edge. On the counter, further along: a white ceramic pot of wooden stirrers, a small stack of brown paper takeaway bags with nothing printed on them, and a glass jar of biscotti.
- Behind the counter, soft: a polished chrome two-group espresso machine with a row of white cups upside down on top, a coffee grinder with a hopper of dark beans, and a back wall of open pale oak shelves holding plain amber glass jars of coffee beans, white ceramic jugs, a few stacked plates and two trailing pothos plants whose leaves hang down. No one stands behind the counter.
- Overhead: three brass pendant lights with ribbed glass shades, switched on, glowing softly.
- The room, soft but readable: a floor of pale speckled terrazzo, whitewashed brick on the left wall with a large unframed abstract painting in sage and terracotta, and four small round white marble tables with the same woven rattan chairs as the terrace. At the table nearest the window, two customers in their mid to late twenties: a woman in a camel wool coat laughing, and a man in a navy overshirt holding a cup, both softly out of focus.
- The front: two tall timber-framed windows and a glazed door painted sage green, and through them the terrace outside: the underside of the sage-green awning with its scalloped hem, the white marble tables and rattan chairs in sunlight, and the bright street beyond.

Light: bright late-morning daylight pours in through the front windows, clean and only slightly warm, not golden hour, laying soft sunlit patches across the terrazzo floor and the tables by the window; the counter and the pastries are lit by soft, bright window light with gentle shadows and a little warm glow from the pendants. Steam rises gently from a cup on the counter. Photographed on a 35mm lens at f/2.8, the pastries in the foreground sharp, the room behind soft with gentle depth. Natural colour, true whites, clean and fresh, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched, like a high-end lifestyle photograph for the café's own app.

Avoid: staff, anyone behind the counter, a card terminal, a till, logos, brand names, readable text, readable price cards, printed bags, a chalkboard menu with words, signage, writing on the windows, golden hour, sunset, orange light, CGI, render, HDR, oversaturated colour, orange-and-teal grade, oversharpening, plastic-looking food, watermarks.
```

### Athlete

The geography, fixed for every shot:
- He walks along the pavement towards the back of his car.
- The car is parked at the kerb with its tailgate towards him.
- The sun is low, behind him and over his left shoulder.

**A0. His character sheet (generate first)**
```
Professional character reference sheet on a plain light-grey studio background, a photograph, not an illustration. One man shown five ways in a clean row with even spacing: a front-facing head-and-shoulders portrait, a three-quarter head-and-shoulders portrait, a left-profile head-and-shoulders portrait, and two full-length views of him standing, from the front and from the back, in the same outfit. Every view is the same person with an identical face, hair, skin tone, build and clothes.

Him: a 25-year-old British man of Black Caribbean heritage, dark brown skin with a warm undertone, a boxer's athletic build: lean, broad shoulders, a strong neck, defined forearms. Handsome in a natural, believable way, the kind of good-looking real person who does well on social media, not a retouched model. A fresh skin fade with a sharp line-up, short textured curls on top, and a neat short beard with a crisp line-up along the cheeks. Dark brown eyes, groomed brows. Hyper-realistic skin: visible pores, a natural sheen on the forehead and cheekbones, subtle variation in tone, fine texture, individual lashes and beard hairs, like an unretouched high-end campaign portrait.

Outfit: a fitted black zip-up technical training jacket, zipped halfway over a plain heather-grey T-shirt, dark charcoal tapered joggers, clean white leather low-top trainers, and a plain black analogue watch on his left wrist. A black canvas duffel gym bag on his left shoulder, with a pair of mustard-yellow boxing hand wraps tucked into its side pocket. No logos anywhere.

Soft, even studio light from the front. A neutral expression in the portraits, with a hint of a smile in the three-quarter view. Photographed on an 85mm lens at f/8, everything sharp. Natural colour, true skin tones. Photoreal, hyper-realistic.

Avoid: a different face between views, illustration, drawing, CGI, render, plastic skin, airbrushed skin, beauty filter, older-looking, wrinkles, logos on the clothes, bag or trainers, brand names, text, labels, watermarks, extra fingers, deformed hands.
```

**AL. The street and his car, nobody in it (generate second)**
```
Photograph of a quiet residential street in a northern English city late on a sunny autumn afternoon, looking like a real frame shot on film, not a render. The camera stands on the wide grey pavement at chest height, looking along it. Just ahead on the right, a modern dark graphite-grey five-door hatchback is parked at the kerb, facing away from the camera, so we see its tailgate and rear window at a slight three-quarter angle. The car is clean with a satin-grey finish, dark tinted rear glass and slim LED tail lights, and it has no badges, no model names and no logos anywhere. The number plate cannot be seen: a low hedge and the angle hide it. Along the left of the pavement, a row of modern red-brick townhouses with dark window frames and black front doors, small front gardens behind low brick walls and neat hedges, and a young tree with orange autumn leaves, a few leaves lying on the pavement. The street is empty of people.

Light: the sun is low behind the camera and to the left, raking along the pavement and warming the brick, the hedges and the car's rear in golden late-afternoon light, with long soft shadows stretching away from the camera. Photographed on a 35mm lens at f/4, the car sharp, the far end of the street soft. Natural colour, warm but true, gentle contrast, real film grain. Photoreal, hyper-realistic.

Avoid: people, car badges, a car maker's logo, a number plate, readable text, house numbers, street signs, CGI, render, HDR, oversaturated colour, orange-and-teal grade, oversharpening, watermarks.
```

**A1. Walking to the boot (image 1: A0; image 2: AL)**
```
Use the man in image 1 (his character sheet) for his face, hair, skin tone, build, clothes and bag, exactly as they are there. Use image 2 for the car, the street and the light, exactly as they are there. Everything else comes from this prompt.

Candid photograph, a frame from a moving shot in a real commercial, looking like it was shot on film, not a render. A medium shot, from the top of his head to his hips, of the man from image 1 walking along the pavement of the street from image 2 late on a sunny autumn afternoon, towards the back of his dark graphite-grey hatchback, which is parked at the kerb just ahead of him. The camera travels alongside him at chest height, slightly ahead, so we see him from a three-quarter front angle, walking from frame left towards frame right; the tailgate and rear window of the car fill the right edge of the frame, softly out of focus. His black canvas duffel gym bag hangs from his left shoulder, the mustard-yellow hand wraps showing in its side pocket. He holds his smartphone in his right hand at chest height, the back of the phone towards the camera, and looks down at it mid-stride, relaxed and focused. Behind him, soft: the red-brick townhouses, the hedges and the young tree with orange leaves.

Light: the sun is low behind him, over his left shoulder, rimming his head, shoulders and the edge of the bag with warm gold light; his face is in soft, warm open shade with light bouncing up from the pavement. Photographed on a 50mm lens at f/2.8, him sharp, the background softly out of focus. Natural colour, true dark skin tones with a healthy sheen, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: a different man from image 1, a different car from image 2, a second person, logos on the clothes, bag or car, car badges, a number plate, brand names, readable text, the phone screen facing the camera, AI-generated look, CGI, render, HDR, oversaturated colour, orange-and-teal grade, oversharpening, plastic skin, beauty filter, extra fingers, deformed hands.
```

**B. Over the shoulder, booking (image 1: A0; image 2: AL; image 3: your chosen A1)**
```
Use image 1 (his character sheet) for his skin tone, hand, jacket, hair and bag strap, exactly as they are there. Use images 2 and 3 for the car, the street and the light, exactly as they are there. Everything else comes from this prompt.

Candid over-the-shoulder photograph, a frame from a real commercial, looking like it was shot on film, not a render. The man stands still on the pavement just behind the tailgate of his dark graphite-grey hatchback, facing the car, looking down at the smartphone in his right hand. The camera is just behind and above his right shoulder, about 30 cm away, looking down past the shoulder onto the phone at about 30 degrees. In the upper left, softly out of focus: the back of his right shoulder in the black training jacket, the side of his neck and the edge of his fresh skin fade. His face is not in the frame. The strap of the black duffel bag crosses his left shoulder.

How he holds it: one-handed, the phone upright in his right hand, held close in front of his chest with his elbow tucked against his side, which keeps it steady. The phone rests across his palm and the base of his fingers, his four fingers wrapped around the left edge with their tips just showing, his little finger under the back near the bottom, and his thumb lifted just above the lower half of the screen, about to tap. The phone is the true size of a 6.1-inch phone in a grown man's hand, in the centre of the frame, filling about 45% of the frame height, the screen tilted up towards his eyes and seen by the camera at a slight angle, within about 30 degrees of facing the lens. All four corners of the screen are clearly visible, with the thin black bezel showing all the way round; no finger covers a corner or lies along an edge.

The screen shows a solid, flat, matte broadcast chroma-key green (#00B140) from edge to edge, at the brightness of a real phone screen, not glowing or neon, evenly lit, with no interface, no icons, no text, no notch, no punch-hole camera, no glare, no reflections and no shadows across it. The phone: a modern unbranded smartphone, about 6.1 inches, a dark graphite aluminium frame, flat glass front, thin even black bezels, softly rounded corners, no logo anywhere.

His hand: dark brown skin with a warm undertone and lighter palms, real texture, visible knuckle creases, short clean nails, the black cuff of the training jacket at his wrist. Beyond the phone, softly out of focus: the tailgate and dark rear window of the graphite hatchback, holding only a soft warm reflection of the sky, and a strip of grey pavement.

Light: the sun is low behind him, over his left shoulder, lighting the back of his shoulder and neck gold. The phone is in the soft shade of his own body, so the screen is evenly lit, with no sun or shadow edge across it. Photographed on a 50mm lens at f/2.8, the phone and thumb sharp, the car soft. Natural colour, true skin tones, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: his face, a second person, a reflection of a person in the car's glass, car badges, a number plate, logos, Apple logo, brand names, readable text, AI-generated look, CGI, render, HDR, oversaturated colour, oversharpening, plastic skin, neon or glowing green screen, glare, reflections or shadows on the screen, sunlight on the screen, fingers covering the screen corners, an oversized hand, fingers pinching the phone, extra fingers, deformed hands.
```

**C. His face, from the phone (image 1: A0; image 2: your chosen A1)**
```
Use the man in image 1 (his character sheet) for his face, hair, beard, skin tone and jacket, exactly as they are there. Use image 2 for the street and the light. Everything else comes from this prompt.

Candid close-up photograph, a frame from a real commercial, looking like it was shot on film, not a render. A close-up of the man's face and shoulders seen from where his phone is: the camera is at the height of his chest, about 35 cm in front of him, looking up at his face at a gentle angle of about 15 degrees. His eyes are lowered to the phone just below the lens, focused, and the corner of his mouth is just beginning to lift into a small, satisfied smirk; he is not posing and not looking into the lens. His face sits slightly left of centre, from the top of his head to the zip of his black training jacket, with the bag strap across his left shoulder. Behind him, soft and out of focus: the upper floors of the red-brick townhouses, the orange leaves of the young tree and a warm, pale-gold late-afternoon sky.

Light: the low sun is behind him over his left shoulder, drawing a warm gold rim along the edge of his head, ear, beard and shoulder. His face is in soft, warm open shade, with a faint cool-white glow from the phone screen on his cheekbones, nose, lips and under his eyes, and small real catchlights from the screen in his eyes. Hyper-realistic skin: visible pores, a natural sheen on the forehead and cheekbones, fine texture, individual lashes and beard hairs. Photographed on a 50mm lens at f/2, his eyes sharp, the background a smooth blur. Natural colour, true dark skin tones, gentle contrast, real film grain. Photoreal, hyper-realistic, unretouched.

Avoid: a different man from image 1, looking straight into the lens, a posed smile, a big grin, showing teeth, a steep low angle up the nostrils, a double chin, wide-angle distortion, the phone in frame, a second person, logos, brand names, readable text, AI-generated look, CGI, render, HDR, oversaturated colour, orange-and-teal grade, oversharpening, plastic skin, airbrushed skin, beauty filter.
```

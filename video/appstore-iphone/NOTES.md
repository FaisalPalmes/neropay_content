# App Store stills v2 (23 Sep 2026) — `stills/`

Six 1320 × 2868 screenshots (Apple's 6.9" portrait size): `stills/index.html#1…#6`, rendered by
`node stills/render.cjs` into `stills/out/` (git-ignored).

Faisal's ruling on v1 of the stills: keep our own layout and copy, exactly as his export — wordmark, yellow rule,
kicker, headline with the marker, sub, chips. The SumUp carousel was a reference for the art only: some screens
inside a phone, some bare in a heavy yellow glass outline, with a piece of the screen lifted out over them. So the
floating tags, the diagonal bar and the enlarged headline of v1 are gone.

1. **Hero** — his Higgsfield photograph (`stills/assets/hero-src.webp`, prompt in `HIGGSFIELD-PROMPT.md`), the green
   screen keyed by `stills/key-hero.py` and the keypad screen placed underneath. Kicker, headline and sub are new
   ("Contactless" / "Take card payments on your phone." / "Your customer taps their card on your phone.") and wait
   on his approval; the tap screen replaces the keypad when he sends it.
2. **Take a payment** — bare in the glass outline.
3. **NeroPOS** — in the phone, the cheesecake lifted.
4. **Transactions** — bare in the glass outline, the NeroWeb sale lifted.
5. **Reports** — in the phone, the total and the chart tooltip lifted.
6. **Payment links** — in the phone, the amount field lifted.

The screens are his 923 × 2000 export, so at App Store size they are upscaled about 1.3×.

# App Store preview, iPhone — v6 (23 Sep 2026) is current; v5 and earlier are below and superseded

**File** `renders/FINAL-appstore-iphone-v6.mp4` · 886 × 1920 · 30 fps · 29.0s · (filled in on render)

## v6 — Faisal: "a full video with these new elements, the new background and the whole new aesthetic"

The video is now built from the carousel stills themselves, not from a code-drawn phone:

- **The slides are the stills.** Each section is one of the six carousel slides at the stills' own 660 × 1434,
  scaled to the frame (the same 0.46 aspect, 2.5px lost top and bottom): the white hero with the Visa card, the
  keypad and the transactions list in the yellow glass outline, and the three hand photographs. Same copy, same
  pink-and-blue grounds with the frosted disc, and the blooms drift slowly.
- **Between them, a carousel swipe.** The slide pulls back into a card (to 83%, rounded corners, a soft shadow),
  slides across to the next and pushes back in. Over 1.05s, eased at both ends. The art trails the card and the copy
  trails it less, so the swipe has depth.
- **Something happens on every slide.**
  - Hero: the amount comes up, the contactless signal goes out three times and the mark lands.
  - Keypad: 4, 5, 7, 5, then CHARGE, and the amount lifts off the screen.
  - NeroPOS: the finger's tap sends out a ring and the Black Truffle Butter card lifts out.
  - Transactions: the NeroWeb row lifts, and the place it left goes blank.
  - Reports: the total and the chart tooltip lift.
  - Payment links: the thumb on Send, and the amount field lifts.

  The photographs punch in and ease back as they land, then drift closer. They only ever scale up from their foot,
  so the arms never leave the frame's bottom edge. The glass outlines rise and turn into place.
- **Kept from v5:** the Shutter up at the head, the swish that draws down into the mark on the glass tile, and the
  white close.

How it is built: the hands and the glass outlines carry CSS filters in the stills (drop shadows, the photo screen's
softening). v1 showed that a filter on anything that moves flickers, so those are baked once, transparent, from the
stills page. They are rendered at 1800 × 2868 with 120px spare each side for the parallax:
`node stills/render.cjs layers` → `assets/v6/` (git-ignored; run `stills/cut-photo.py` first if the cut-outs are
missing). The grounds, the copy, the hero's screen, the taps and the lifts are live HTML with no filter.

Rebuild: `node stills/render.cjs layers`, `npm run check`, `npx hyperframes render --fps 30 -o renders/v6-picture.mp4`,
`bash mix.sh renders/v6-picture.mp4 renders/FINAL-appstore-iphone-v6.mp4`. v5's composition and mix are in `archive/`.

# App Store preview, iPhone — v5 (23 Sep 2026) (superseded)

**File** `renders/FINAL-appstore-iphone-v5.mp4` · 886 × 1920 · 30 fps · 29.0s · 16.4 MB · −13.9 LUFS / −1.8 dBTP ·
md5 `d8682c6cdd835e9ce7c8c739ea03e368` · Higgsfield media `cce72b47-2900-43de-8268-77beb2cdd6e0`.

## v5 — Faisal's notes on v4, and what changed

| Note | v5 |
|---|---|
| The frosted panes behind the phones read as a phone outline with a shadow | Removed. In their place, twelve narrow stripes at the mark's 46.5° made of clear glass (a pale fill, a bright rim, a faint shadow) stand in the 3D world at depths of 700–1,500px behind the sections, spread along the whole flight path. The camera flies past them, so they drift at their own parallax; they are just visible and never the subject |
| The outro: the yellow comes in and covers the screen; make it turn into the logo's two lines in the same swish | One motion. Each yellow band is the logo bar itself under a stretch: it enters from its corner, meets the other on the 46.5° seam and covers the frame (25.75s), then draws straight down into its bar on the glass tile (26.75s). The same four corners travel the whole way, so there is no second set of shapes. The bars' seam-side edges are pinned to the seam so the two bands meet with no wedge |

Mastering: the true peak came out at −1.0 dBTP on the first pass (the swish's thump), so `mix.sh` now limits at
0.84 and targets −2.0 dBTP; the master is −1.8.

# v4 (superseded)

**File** `renders/FINAL-appstore-iphone-v4.mp4` · 886 × 1920 · 30 fps · 29.0s · 16.0 MB · −13.8 LUFS / −1.4 dBTP ·
md5 `c636220bf84fc69db7b1411611f93c96` · Higgsfield media `f9cc3a68-b18a-4f7d-bd73-73c1892b5567`.

## v4 — Faisal's notes on v3, and what changed

| Note | v4 |
|---|---|
| The phone comes in 2D and flickers into 3D on the click | The cause: its entrance faded `opacity` 0→1, and Chromium flattens any `preserve-3d` group below opacity 1, so it was drawn flat until the fade ended — on the click. The phone never carries opacity now. It leaps up from below the frame, tilted, and lands at rest, solid in every frame; as the camera leaves it tilts away, still solid. `LESSONS.md` has the rule |
| The buttons are there on some screens and not others | Same cause. The geometry is now identical in every frame: two volume keys on the left, power on the right, each a dense stack through the band so it reads as one solid key at any angle. Which side you see depends only on which way the phone is turned |
| The close: keep the two yellow stripes, but put a clear liquid glass square around them | A clear glass tile — no colour and no yellow light, read by its rim, top highlight, inner thickness and soft shadow — rises in as the shutter parts; the bars slide in on it and a light sheen crosses it once. The wordmark sits below |

Also: 24 band slices instead of 16 for a smoother rim; clicks retimed to the new landing.

# v3 (superseded)

**File** `renders/FINAL-appstore-iphone-v3.mp4` · 886 × 1920 · 30 fps · 29.0s · 16.3 MB · −13.8 LUFS / −1.4 dBTP ·
md5 `1aa7e5c4fb371c2910e3f4e37f6e8bf3` · Higgsfield media `de6ff248-9d32-469a-8639-369397fcf441`.

## v3 — Faisal's notes on v2, and what changed

| Note | v3 |
|---|---|
| No 3D depth to the phone — a real phone's thickness, not too thick | The phone is a solid now: a flat front face, a back plate and sixteen rounded slices between them, 64px deep on a 700px-wide phone (about an iPhone's ratio). The slices shade darker towards the middle so the rim reads as a rounded metal band; the side buttons stand proud of it. The front face stays one flat group so the screen never splits against the body |
| The copy and the phone sat in two different places, top and bottom | Each section is one unit: the copy sits on the phone's own front plane, left-aligned to the phone's left edge, directly above it — the same composition on every screen. The unit turns as one (±15°, alternating), so the text is in the same perspective as the phone, and the copy rises as the phone flips in |
| The close had too many colours — liquid glass, black, white and yellow | One colour. The shutter closes over the last screen, parts again onto white, and the mark's two bars slide in along the 46.5° seam in yellow, then the light wordmark. No glass tile, no second set of stripes, no black |

Two build faults found and fixed before the render:

- **Shutter corners.** The shutter wrapper was 220% of a tall frame, so rotated to 46.5° its short sides fell
  short of two frame corners and left white notches while it closed. It is a 4,400px square now, and the halves
  overlap by 2px so no hairline shows on the seam.
- **Close under the closing shutter.** The white close started at 25.6s, while the shutter was still closing,
  so the gap showed plain white instead of the last screen. It starts at 25.88s, as the halves meet.

An alternative close is in the build (`#root.altclose`: yellow ground, white bars, the all-white wordmark) if the
white one reads too quiet. Not rendered as a video.

# v2 (superseded)

**File** `renders/FINAL-appstore-iphone-v2.mp4` · 886 × 1920 · 30 fps · 29.0s · 16.8 MB · −13.8 LUFS / −1.4 dBTP ·
md5 `1c3db388fc0fc6d847861fd94af1c38c` · Higgsfield media `95de77ce-860a-41ec-940c-16572defa056`.

## v2 — Faisal's notes on v1, and what changed

v1 was "too flat — the same picture throughout". His notes, and the answer to each:

| Note | v2 |
|---|---|
| A real phone, the screens on it, as if someone is using the app | A neutral handset drawn in code — status bar, camera island, side buttons, no maker's mark — with each screen cropped to the app card alone (x 69–853, y 680–2000 of his export) so it fills the phone screen edge to edge |
| The camera moving in 3D between sections; the text in the same 3D space as the phone | One CSS 3D world. Each screen is a section — its copy and its phone standing together — 1,080px apart, alternating depth and angle. The camera is a pure function of time: it holds a section at an angle (never flat front-on), then flies to the next in 0.9s, lifting back mid-flight. A slow orbit runs on top so the view is never still |
| The phone "flipping", swipes and whooshes between screens | The phone flips in edge-on as the camera arrives and flips away as it leaves; a whoosh on every flight |
| No zooms — they zoomed into nothing | Removed |
| A harsh line between the copy and the phone | The copy is set live in Poppins (kicker, headline, marker, sub, chips — his words verbatim), so the whole frame sits on one background with no seam. His wordmark stays placed artwork |
| The background dynamic: the yellow light, the liquid-glass blur | Four soft lights (yellow, white, blue, blush) drift on their own clocks and in parallax against the camera, and three frosted panes float behind |
| The intro | Kept exactly |
| The close: not black — white with yellow lines; the liquid glass logo had black at the corners; the lines did not cover the frame | The shutter closes, the glass tile lands on the join, then the halves part again to leave a white close with two yellow stripes running edge to edge. The mark is drawn as vector from the two bars measured off `brand/favicon/neropay-icon-512.png`, so there is no keyed-image fringe |
| Flicker and artefacts | Nothing carries a CSS filter any more; v1's drop-shadow on a scaling image and 90px blurs were re-rasterised every frame |

Three build faults found and fixed before the render, for the next session:

- **Duplicate ids.** The close's stripes were `st1`/`st2`, the same as two sections, so the stripe tween moved a
  whole section of the world. Sections are `sec0…sec4` now.
- **Coplanar layers in preserve-3d.** The phone body and screen share a plane; under `preserve-3d` Chromium split
  them against each other and the dark body cut a diagonal band through the screen at some angles. `.phone` and
  `.copy` are `transform-style: flat` — each turns as one object.
- **The layout check and 3D text.** It measures straight bounding boxes, and a turned line's box grows past its
  neighbour's. The rest-frame snapshot shows no real overlap, so the text blocks carry `data-layout-allow-overlap`.

Rebuild: `bash make-assets.sh`, crop the app cards (in `make-assets.sh`), `npm run check`,
`npx hyperframes render --fps 30 -o renders/v2-picture.mp4`, then `bash mix.sh renders/v2-picture.mp4 <out>`.
v1's composition is kept at `archive/index-v1.html`.

---

# v1 (22 Sep 2026) — superseded

**File** `renders/FINAL-appstore-iphone.mp4` · 886 × 1920 · 30 fps · 26.0s · 10.5 MB
· −13.5 LUFS / −1.4 dBTP · md5 `41a8563735273d3d008210bcc2082674`.
Rebuild it with `bash make-assets.sh && npm run check && npx hyperframes render --fps 30`, then the
audio mix in §3 below.

## 1. The shape

| | |
|---|---|
| 0.00–0.60 | **Shutter up.** The frame is the solid yellow tile; the two halves travel apart perpendicular to the 46.5° seam. Nothing else happens in those 0.6s, per `BRAND-MOTION.md` §3.1 |
| 0.30–4.97 | **Charge it in three taps** — the keypad rises out of the paper, the copy wipes up behind it, a push-in on £45.75 |
| 4.85–9.57 | **Your menu, on the till** — push-in on a dish |
| 9.45–14.17 | **Every sale, one list** — push-in on the first transaction row |
| 14.05–18.77 | **See what sold, and where** — push-in on the sales total |
| 18.65–24.40 | **Send a link. Get paid** — push-in on the send button |
| 23.30–24.30 | **Shutter down.** Screen five is still standing underneath as the halves close |
| 24.30–25.05 | The glass tile lands on the join as they meet, a sheen passes, it holds |
| 25.05–26.00 | The tile rides up, a black panel sweeps the same seam, the wordmark and the line follow it in |

Between every screen: **the cut** — one yellow panel sweeping the same 46.5° seam, 0.30s
(`BRAND-MOTION.md` §3.3). The screen arriving is already standing when the panel clears it, and the
screen it replaces leaves 0.12s later, while the panel is still over it. A wipe reveals a shot, never a hole.

## 2. Why the screens are cut into bands

Each export is split into the wordmark, the copy block and the device, and the three move separately.
That is what lets the layout shift and the copy land on its own beat **without re-typesetting Faisal's
artwork** — the kit is raster only and the wordmark has no vector or font file (`BRAND.md` §5), so
placed art is moved as whole objects and never re-set. The device sits in a 1700px perspective and
turns from −17° to −3.4° across each screen: it is never flat front-on and never still.

## 3. The sound

No voiceover — see §5. The bed is `video/library/bgm/underscore-120-a.mp3` at 0.30, ducked by nothing
because there is no voice, fading out under the close. Cues, all from the committed Pixabay set:
whoosh-short on the shutter open, each of the four cuts and the close; click-soft on each push-in;
impact-bass-1 as the mark lands; pop and chime under the end card. No `glitch-*` — they are crackle by
construction (PP02 v7). Mixed, limited at 0.89, then a two-pass linear `loudnorm` to −14 LUFS / −1.5 dBTP.

## 4. Apple, and what it means for this cut

An App Preview must read as the app in use, captured on device; marketing films assembled from
key art get rejected. This one animates the real exported screens and keeps the overlaid material to
the brand's own open and close, which is the side of that line to be on. It is 26.0s against Apple's
15–30s window, and the size matches the large-iPhone portrait slot.

**It is not a Play Store asset.** Google takes a YouTube link over the feature graphic, not a file, so
the Play version is a second cut and a separate upload.

## 5. Decisions taken while Faisal was away, for him to confirm or reverse

1. **No voiceover.** Three reasons, in order: the App Store carousel autoplays muted, so the video has
   to work silent and a voice would be heard by almost nobody; a synthetic presenter voice carries the
   rail 4 disclosure question and an App Store listing has nowhere to put that disclosure; and the copy
   is already on screen in his own typography. The intro and outro carry the weight instead, which is
   what he asked for as the alternative.
2. **The end card is black, not yellow.** His ruling that day was no dark lockup — light or white
   wordmark only. On yellow there is no wordmark that reads (white on `#FFCF24` is about 1.6:1), so the
   yellow join carries the **mark** in ink, which is the one place yellow may be a ground at 12.75:1,
   and the **wordmark** waits for the black card behind it. If he wants the wordmark on the yellow, the
   kit needs a version that survives it.
3. **The liquid-glass icon is rebuilt in code,** not placed. The file he showed never arrived as an
   attachment, so the tile is drawn — pale glass, thin inner rim, soft shadow — with the mark keyed out
   of `brand/favicon/neropay-icon-512.png` inside it. It reads as his, and it re-renders at any size.
   Swap it for the real artwork when he sends it: it is one file, `assets/icon-glass.png`, and the tile
   becomes an `<img>`.
4. **The closing line is "Card payments and your till, in one app."** Product-factual, no rate, no
   price, no claim. Easy to change; it is one string in `index.html`.
5. **Delivered on a link, not to Drive.** The Drive connector cannot carry a file this size
   (`video/CLAUDE.md`). Download it and drop it in the folder, or send the folder link and it can be
   tried directly.

## 6. Still to do

- The iPad 13-inch cut and the Play Store cut, from the same composition with new bands.
- `renders/` is git-ignored: the master lives on the Higgsfield link in `library.js` until Faisal
  backs it up to Drive, which is the `backup: false` problem the register already tracks.

# App Store preview, iPhone — what was built and what is open

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

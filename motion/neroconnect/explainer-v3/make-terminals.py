#!/usr/bin/env python3
"""The swap plates for v3.6 (24 Sep 2026), from Faisal's two aligned Higgsfield images (NeroPay original, Keelstone edit).
    python3 make-terminals.py
- terminal-keelstone.webp: the edit, colour-matched to the original's ground (the edit came back ~4 levels pinker) and with
  the nav-label strip copied back from the original (the edit misspelt "Transaotions" and "Notfications").
- terminal-yourlogo.webp: the original with "NeroPay" on the bezel inpainted away and "YOUR LOGO" set in its place, same grey,
  same angle, for the opening hook ("There's a name on it … it can be yours").
The three line up pixel for pixel, so a swap between any two changes only the marks."""
import numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
A = Path(__file__).parent / 'assets'
src = Path('/tmp/claude-0/-home-user-neropay-content/db3cb523-aaaf-5606-bdc1-076557584066/images')
nero = np.asarray(Image.open(A / 'terminal-neropay.webp').convert('RGB')).astype(np.float32)
keel = np.asarray(Image.open(A / 'terminal-keelstone-raw.webp').convert('RGB')).astype(np.float32)
# 1. ground match: per-channel offset measured on the ground, faded in with brightness so the dark hardware is untouched
g = np.r_[nero[20:300, 20:300].reshape(-1, 3), nero[1700:1980, 1700:1980].reshape(-1, 3)].mean(0) - \
    np.r_[keel[20:300, 20:300].reshape(-1, 3), keel[1700:1980, 1700:1980].reshape(-1, 3)].mean(0)
w = np.clip((keel.mean(2, keepdims=True) - 120) / 100, 0, 1)
keel = keel + g * w
# 2. the nav labels, back from the original (the screen's bottom strip, above the bezel)
# everything inside the screen above its slanted bottom edge (1493 at x=680, falling 0.103 px per px), over the nav bar
yy, xx = np.mgrid[0:nero.shape[0], 0:nero.shape[1]]
edge = 1493 + (xx - 680) * 0.103
m = ((yy > 1380) & (yy < edge - 3) & (xx > 655) & (xx < 1090)).astype(np.float32)
m = cv2.GaussianBlur(m, (0, 0), 2)[..., None]
keel = keel * (1 - m) + nero * m
Image.fromarray(np.clip(keel, 0, 255).astype(np.uint8)).save(A / 'terminal-keelstone.webp', quality=92)
# 3. YOUR LOGO: inpaint the light-grey "NeroPay" off the dark bezel, then set the words at the same angle
im = nero.astype(np.uint8).copy(); L = im.mean(2)
yy, xx = np.mgrid[0:L.shape[0], 0:L.shape[1]]
below = yy > 1493 + (xx - 680) * 0.103 + 4                   # the bezel only, never the screen above it
txt = ((L > 62) & (L < 215) & below & (yy < 1562) & (xx > 668) & (xx < 818)).astype(np.uint8) * 255
txt = cv2.dilate(txt, np.ones((5, 5), np.uint8))
im = cv2.inpaint(im[..., ::-1].copy(), txt, 9, cv2.INPAINT_TELEA)[..., ::-1]
lay = Image.new('RGBA', (600, 120), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
f = ImageFont.truetype(str(Path(__file__).parent / 'fonts' / 'poppins-latin-500-normal.woff2'), 34)
d.text((10, 40), 'YOUR LOGO', font=f, fill=(128, 126, 132, 235))
lay = lay.rotate(-7.7, resample=Image.BICUBIC, center=(10, 60)).filter(ImageFilter.GaussianBlur(0.5))
base = Image.fromarray(im).convert('RGBA'); base.alpha_composite(lay, (662, 1452))
base.convert('RGB').save(A / 'terminal-yourlogo.webp', quality=92)
print('ground offset', g.round(1))
# 4. lift each plate's grey ground to the film's paper (#FBFAF7), weighted by brightness so the hardware is untouched:
#    the terminal then sits on the page with no box around it, full frame or small
paper = np.array([251, 250, 247], np.float32)
for n in ['neropay', 'yourlogo', 'keelstone']:
    a = np.asarray(Image.open(A / f'terminal-{n}.webp').convert('RGB')).astype(np.float32)
    ground = np.r_[a[20:300, 20:300].reshape(-1, 3), a[1700:1980, 1700:1980].reshape(-1, 3)].mean(0)
    w = np.clip((a.mean(2, keepdims=True) - 150) / (ground.mean() - 150), 0, 1) ** 1.5
    out = a * (1 - w) + (a * paper / ground) * w
    Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(A / f'plate-{n}.webp', quality=92)
print('plates written')

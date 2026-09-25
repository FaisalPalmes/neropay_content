#!/usr/bin/env python3
"""Build the draft "neroconnect" lockup from the supplied wordmark's own letters. PREVIEW, not a kit asset.

    python3 brand/sting/connect-mark.py            ->  brand/sting/neroconnect-light.png (+ prints the letter runs)
    python3 brand/sting/connect-mark.py partner    ->  brand/sting/neropartner-light.png (25 Sep 2026, the partner explainer:
                                                        p and a are the artwork's own yellow letters, r n e recoloured, t built)

Nothing is typeset. "nero" is the supplied artwork untouched. In "connect", o, n and e are the artwork's own
letters recoloured the way "pay" is drawn (yellow fill inside a 4px ink contour). The artwork has no c and no t, so:
c is the o with its right wall cut out between the arms; t is the o's left wall and bottom-left corner, a foot
the length of the bar and a crossbar the thickness of the o's top bar, with the stem rising 30px above x-height.
Faisal asked for the previews on 24 Sep 2026. BRAND.md 5 says the letterform cannot be extended; this extends it
by hand, so it needs Eray's sign-off before it is anything more than a preview.
"""
import numpy as np, cv2
from PIL import Image
from pathlib import Path
HERE = Path(__file__).parent
src = np.array(Image.open(HERE.parent / 'logos/neropay-light-1200.png').convert('RGBA')).astype(np.float32)
A = src[..., 3] / 255
ASC = 36                                             # headroom for the t's stem
def glyph(x0, x1): return A[:, x0:x1 + 1].copy()
n, e, o = glyph(10, 181), glyph(191, 357), glyph(479, 647)
c = o.copy(); c[50:122, 588 - 479:] = 0              # right wall out between the arms, fillets and all
c = c[:, :634 - 479]                                 # and the arms cut back so each ends on a flat face, not a point
# t: local stem at cols 18..62; o's left 84 cols (wall + bottom-left corner) give the stem's foot
TW, R = 126, 112                                     # R: where crossbar and foot end, leaving room for the contour
t = np.zeros((A.shape[0] + ASC, TW), np.float32)
ol = o[:, :84]
t[ASC + 84:, 18:18 + 84] = np.maximum(t[ASC + 84:, 18:18 + 84], ol[84:])        # bottom-left corner and wall
t[ASC + 121:ASC + 157, 18 + 60:R] = 1                                             # the foot, to the glyph's right edge
t[6:ASC + 90, 19:18 + 44] = 1                                                      # the stem, up past x-height
t[ASC + 12:ASC + 50, 2:R] = 1                                                     # the crossbar, on the o's top bar
k = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))   # the artwork's small corner rounding on the square ends
t = cv2.morphologyEx((t > .5).astype(np.uint8), cv2.MORPH_OPEN, k).astype(np.float32)
t = cv2.GaussianBlur(t, (3, 3), 0.7)                # the constructed edges get the artwork's antialias
pad = lambda g: np.vstack([np.zeros((ASC, g.shape[1]), np.float32), g])
ink = np.array([12, 12, 14], np.float32); yel = src[90, 690, :3]                   # the artwork's own yellow, from the p
def yellow(m):                                       # fill inside a 4px contour, as "pay" is drawn
    b = (m > .5).astype(np.uint8); d = cv2.distanceTransform(b, cv2.DIST_L2, 5)
    f = np.clip(d - 4, 0, 1) * np.clip(m, 0, 1)
    rgb = ink * (1 - f[..., None]) + yel * f[..., None]
    return np.dstack([rgb, m * 255])
def dark(x0, x1): s = src[:, x0:x1 + 1].copy(); return np.vstack([np.zeros((ASC, s.shape[1], 4), np.float32), s])
import sys
WORD = sys.argv[1] if len(sys.argv) > 1 else 'connect'
def art(x0, x1): s_ = src[:, x0:x1 + 1].copy(); return np.vstack([np.zeros((ASC, s_.shape[1], 4), np.float32), s_])
r = glyph(365, 475)
LET = {'c': lambda: yellow(pad(c)), 'o': lambda: yellow(pad(o)), 'n': lambda: yellow(pad(n)), 'e': lambda: yellow(pad(e)),
       't': lambda: yellow(t), 'r': lambda: yellow(pad(r)),
       'p': lambda: art(656, 827), 'a': lambda: art(835, 1005)}      # the artwork's own yellow p and a, untouched
GAP = 9
parts = [dark(10, 181), dark(191, 357), dark(365, 475), dark(479, 647)] + [LET[ch]() for ch in WORD]
H = parts[0].shape[0]; W = sum(p.shape[1] for p in parts) + GAP * (len(parts) - 1) + 20
out = np.zeros((H, W, 4), np.float32); x = 10; runs = []
for p in parts:
    out[:, x:x + p.shape[1]] = np.where(p[..., 3:] > out[:, x:x + p.shape[1], 3:], p, out[:, x:x + p.shape[1]])
    runs.append([x, x + p.shape[1]]); x += p.shape[1] + GAP
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(HERE / f'nero{WORD}-light.png')
print(W, H, runs)

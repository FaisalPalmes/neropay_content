"""Liquid-glass cards composited onto footage with sub-pixel placement.

python3 glass_comp.py <spec.json> <sprites_dir> <out_dir>

spec: {"frames": [png, ...], "cards": [{"id", "f": [[x, y, scale, opacity, dy], ...]}]} (from build_overlay.py), with
each card's sprites (<id>-shadow/-mask/-face.png, 3x, from screens/render-sprites.cjs). Per frame and card:
the outer shadow darkens the footage, the footage inside the card's shape is replaced by itself blurred (18 px x scale),
saturated 1.75 and lifted 1.06 (the backdrop-filter the card had in CSS), and the face (fill, rim light, type) goes on
top. Every layer is premultiplied, prefiltered once for its scale and then resampled bilinearly at the exact
floating-point position, so the card looks identical at every sub-pixel phase: no stepping when it drifts slowly.
"""
import cv2, json, os, sys, numpy as np

SPEC, SPR, OUT = sys.argv[1:4]
spec = json.load(open(SPEC)); os.makedirs(OUT, exist_ok=True)
SS = 3.0                                                            # sprite pixels per CSS pixel

def load(p):
    a = cv2.imread(p, cv2.IMREAD_UNCHANGED).astype(np.float32) / 255
    a[..., :3] *= a[..., 3:4]; return a                            # premultiplied BGRA
cards = [dict(c, L={m: load(os.path.join(SPR, f"{c['id']}-{m}.png")) for m in ('shadow', 'mask', 'face')}) for c in spec['cards']]

def place(img, k, cx, cy, W, H):
    """img (sprite, premultiplied) scaled by k about its centre, centre at (cx, cy), into a W x H canvas region."""
    sig = 0.42 / k if k < 1 else 0                                 # anti-alias prefilter for the downscale
    src = cv2.GaussianBlur(img, (0, 0), sig) if sig > 0.3 else img
    h, w = img.shape[:2]
    M = np.float32([[k, 0, cx - k * w / 2], [0, k, cy - k * h / 2]])
    return cv2.warpAffine(src, M, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=0)

for n, fp in enumerate(spec['frames']):
    fr = cv2.imread(fp).astype(np.float32) / 255
    Hh, Ww = fr.shape[:2]
    for c in cards:
        x, y, s, o, dy = c['f'][n]
        if o <= 0.002: continue
        k = s / SS; sh = c['L']['shadow']; h, w = sh.shape[:2]
        # work in a region around the card only
        hw, hh = w * k / 2 + 4, h * k / 2 + 4
        x0, x1 = int(max(0, np.floor(x - hw))), int(min(Ww, np.ceil(x + hw)))
        y0, y1 = int(max(0, np.floor(y + dy - hh))), int(min(Hh, np.ceil(y + dy + hh)))
        if x1 <= x0 or y1 <= y0: continue
        cx, cy = x - x0, y + dy - y0; RW, RH = x1 - x0, y1 - y0
        roi = fr[y0:y1, x0:x1]
        S = place(sh, k, cx, cy, RW, RH) * o
        Mk = place(c['L']['mask'], k, cx, cy, RW, RH)[..., 3:4] * o
        Fc = place(c['L']['face'], k, cx, cy, RW, RH) * o
        # backdrop: the footage behind the card, blurred, saturated, lifted (blur taken on a padded window)
        sg = 18 * s; p = int(3 * sg) + 2
        bx0, by0, bx1, by1 = max(0, x0 - p), max(0, y0 - p), min(Ww, x1 + p), min(Hh, y1 + p)
        bl = cv2.GaussianBlur(fr[by0:by1, bx0:bx1], (0, 0), sg)[y0 - by0:y0 - by0 + RH, x0 - bx0:x0 - bx0 + RW]
        L = bl @ np.float32([0.114, 0.587, 0.299]); bl = np.clip((L[..., None] + (bl - L[..., None]) * 1.75) * 1.06, 0, 1)
        out = roi * (1 - S[..., 3:4]) + S[..., :3]
        out = out * (1 - Mk) + bl * Mk
        out = out * (1 - Fc[..., 3:4]) + Fc[..., :3]
        fr[y0:y1, x0:x1] = out
    cv2.imwrite(os.path.join(OUT, f'{n:04d}.png'), np.clip(fr * 255 + 0.5, 0, 255).astype(np.uint8))
print('glass', len(spec['frames']), 'frames,', len(cards), 'cards')

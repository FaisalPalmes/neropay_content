"""Turn the fingertip on the green screen into what the app does: scroll per frame, presses, and where each target
must sit so it is under the finger when it is pressed.

python3 fingers.py <workdir>

<workdir> holds street.mp4 / table.mp4 and street-t4.json / table-t4.json (the screen tracks). For each plate frame the
screen is rectified to 390x844 (the app's CSS pixels), the finger is the largest non-green, skin-red blob, its tip is
the extreme point along the finger found to a sub-pixel with a soft-key profile, and the contact point is 18 px back
from the tip along the finger (the pad under the nail, where a touchscreen registers). Contact windows are set by hand
from the tip's speed (the finger stops when it presses, lifts when it leaves); inside a drag the content moves 1:1
with the pad, and after the lift it keeps going with a short exponential release. Writes fingers-sage.json and
fingers-nail.json for screens.html, which places each target under its press.
"""
import cv2, json, sys, os, numpy as np

W, H, PAD = 390, 844, 18.0
WD = sys.argv[1]

def sg(x, w=7, p=2):
    h = w // 2; V = np.vander(np.arange(-h, h + 1), p + 1, increasing=True); c = np.linalg.pinv(V)[0]
    xp = np.pad(x, h, mode='edge'); return np.convolve(xp, c[::-1], 'valid')

def tips(name, d0):
    Q = np.array(json.load(open(os.path.join(WD, name + '-t4.json')))['corners_TL_TR_BR_BL'], np.float32)
    cap = cv2.VideoCapture(os.path.join(WD, name + '.mp4')); d0 = np.array(d0, float); d0 /= np.linalg.norm(d0)
    out, n = [], 0
    while True:
        ok, f = cap.read()
        if not ok: break
        M = cv2.getPerspectiveTransform(Q[n], np.float32([[0, 0], [W, 0], [W, H], [0, H]]))
        x = cv2.warpPerspective(f, M, (W, H), flags=cv2.INTER_CUBIC).astype(np.float32) / 255
        key = x[..., 1] - np.maximum(x[..., 0], x[..., 2]); red = x[..., 2] - x[..., 1]
        m = ((key < 0.10) & (red > 0)).astype(np.uint8); m[:36] = 0; m[:, :10] = 0; m[:, -4:] = 0; m[-4:] = 0
        m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
        nl, lab, st, _ = cv2.connectedComponentsWithStats(m); n += 1
        if nl < 2 or st[1:, 4].max() < 3000: out.append(None); continue
        i = 1 + np.argmax(st[1:, 4]); ys, xs = np.nonzero(lab == i); P = np.stack([xs, ys], 1).astype(np.float32)
        pr = P @ d0; tip = P[pr >= np.percentile(pr, 99.7)].mean(0)
        U = np.linalg.svd(P - P.mean(0), full_matrices=False)[2][0]; U = U if U @ d0 > 0 else -U
        ts = np.arange(-12, 8, 0.25); pts = (tip[None] + U[None] * ts[:, None]).astype(np.float32)
        soft = np.clip((0.30 - key) / 0.20, 0, 1).astype(np.float32)
        pv = cv2.remap(soft, pts[:, 0:1], pts[:, 1:2], cv2.INTER_LINEAR).ravel()
        j = np.where((pv[:-1] >= 0.5) & (pv[1:] < 0.5))[0]
        if len(j): j = j[-1]; tip = tip + U * (ts[j] + (pv[j] - 0.5) / (pv[j] - pv[j + 1] + 1e-6) * 0.25)
        out.append((tip - U * PAD).tolist())                      # the pad, not the nail
    return out

def drag(pad, a, b, n=121, tau=0.16):
    """Scroll per frame for a drag in contact from frame a to b (inclusive), then the release."""
    y = sg(np.array([pad[k][1] for k in range(a, b + 1)]))
    s = np.zeros(n); s[a:b + 1] = y[0] - y
    v = max(0.0, (y[-3] - y[-1]) / 2)                             # px per frame at the lift, upward
    for k in range(b + 1, n): s[k] = s[b] + v * tau * 24 * (1 - np.exp(-(k - b) / (tau * 24)))
    return s, v

def press(pad, a, b):
    P = np.array([pad[k] for k in range(a, b)]); return P.mean(0)

# Pavement, Sage & Co: the thumb drags the menu up (plate frames 20-62), then presses at 80-88.
st = tips('street', (-0.45, -1))
sc, v = drag(st, 20, 62)
tap = press(st, 80, 88)
sage = {'scroll': sc.round(2).tolist(), 'press': [80 / 24, 88 / 24], 'x': round(tap[0], 1), 'y': round(tap[1], 1),
        'contentY': round(tap[1] + sc[80], 1)}
json.dump(sage, open(os.path.join(WD, 'fingers-sage.json'), 'w'))
print('sage  drag', round(sc[62], 1), 'px, release', round(v, 2), 'px/f, final', round(sc[-1], 1), '| press at',
      sage['x'], sage['y'], 'content y', sage['contentY'])

# Table, Rosehip Nails: tap on a service (15-18), the next screen pushes in, drag (58-95), tap on a time (98-104).
tb = tips('table', (-1, -0.25))
t1 = press(tb, 15, 18)
sc2, v2 = drag(tb, 58, 95)
t3 = press(tb, 98, 104)
nail = {'press1': [15 / 24, 18 / 24], 'x1': round(t1[0], 1), 'y1': round(t1[1], 1),
        'scroll': sc2.round(2).tolist(), 'press3': [98 / 24, 104 / 24], 'x3': round(t3[0], 1), 'y3': round(t3[1], 1),
        'contentY3': round(t3[1] + sc2[98], 1)}
json.dump(nail, open(os.path.join(WD, 'fingers-nail.json'), 'w'))
print('nail  tap1 at', nail['x1'], nail['y1'], '| drag', round(sc2[95], 1), 'px, release', round(v2, 2),
      '| tap3 at', nail['x3'], nail['y3'], 'content y', nail['contentY3'])

"""How far the screen edge the composite will draw sits from the phone's real edge in the plate, in pixels.

python3 verify_track.py plate.mp4 track.json [--start 0]

Uses the corners the compositor uses (the raw track through the same Savitzky-Golay 5), and measures each visible
edge independently of the tracker: 60 profiles per side, the edge taken where the green-dominance profile crosses
halfway between its own inside and outside levels. Covered profiles (a finger across the edge) are skipped.
"""
import cv2, numpy as np, json, argparse

def savgol(x, w=5, p=3):
    h = w // 2; A = np.vander(np.arange(-h, h + 1), p + 1, increasing=True)
    c = np.linalg.pinv(A)[0]; xp = np.pad(x, h, mode='reflect', reflect_type='odd'); return np.convolve(xp, c[::-1], 'valid')

ap = argparse.ArgumentParser(); ap.add_argument('plate'); ap.add_argument('track'); ap.add_argument('--start', type=int, default=0)
a = ap.parse_args()
raw = np.array(json.load(open(a.track))['raw']); Q = raw.copy()
for c in range(4):
    for d in range(2): Q[:, c, d] = savgol(raw[:, c, d])
cap = cv2.VideoCapture(a.plate); n = 0; errs = []; per = []
while True:
    ok, f = cap.read()
    if not ok: break
    if n >= a.start:
        x = f.astype(np.float32) / 255; k = (x[..., 1] - np.maximum(x[..., 0], x[..., 2])).astype(np.float32)
        q = Q[n]; c = q.mean(0); fe = []
        for i in range(4):
            p, r = q[i], q[(i + 1) % 4]; d = r - p; u = d / np.linalg.norm(d); nr = np.array([-u[1], u[0]])
            if nr @ (c - (p + r) / 2) < 0: nr = -nr
            for t in np.linspace(0.2, 0.8, 60):
                b = p + t * d; offs = np.arange(-8, 8.01, 0.2); pts = b[None] - nr[None] * offs[:, None]
                pr = cv2.remap(k, pts[:, 0:1].astype(np.float32), pts[:, 1:2].astype(np.float32), cv2.INTER_CUBIC).ravel()
                lo, hi = np.median(pr[:12]), np.median(pr[-12:])
                if lo < 0.18 or hi > 0.08 or lo - hi < 0.15: continue
                mid = (lo + hi) / 2; j = np.where((pr[:-1] >= mid) & (pr[1:] < mid))[0]
                if len(j) != 1: continue
                j = j[0]; fe.append(abs(offs[j] + (pr[j] - mid) / (pr[j] - pr[j + 1]) * 0.2))
        errs += fe; per.append(np.mean(fe) if fe else 0)
    n += 1
e = np.array(errs)
print(f'edge error px: mean {e.mean():.2f}  median {np.median(e):.2f}  90% {np.percentile(e, 90):.2f}  '
      f'95% {np.percentile(e, 95):.2f}  worst-frame mean {max(per):.2f}  samples {len(e)}')

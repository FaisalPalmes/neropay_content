"""Float app cards around a phone that faces away from camera (the Mia shot).

python3 float_cards.py plate.mp4 cards_dir out.mp4 --box x0,y0,x1,y1

The phone and the hands holding it are tracked as one patch (corner features, pyramidal optical flow, a
similarity transform per frame, lightly smoothed), so the cards follow the phone and the camera's push-in.
Each card springs out of the phone to its place, then floats. The plate under each card is blurred, so the
translucent card reads as glass.
"""
import cv2, numpy as np, subprocess, argparse, json, os, math

ap = argparse.ArgumentParser()
ap.add_argument('plate'); ap.add_argument('cards'); ap.add_argument('out'); ap.add_argument('--box', required=True)
ap.add_argument('--layer', help='also write the cards alone as an RGBA PNG sequence, pinned to frame 0 (for a Fusion planar transform)')
a = ap.parse_args()
x0, y0, x1, y1 = [int(v) for v in a.box.split(',')]

cap = cv2.VideoCapture(a.plate); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
H0, W0 = frames[0].shape[:2]

# 1. track the phone patch: position (cx, cy) and scale s relative to frame 0
g0 = cv2.cvtColor(frames[0], cv2.COLOR_BGR2GRAY)
m = np.zeros_like(g0); m[y0:y1, x0:x1] = 255
pts = cv2.goodFeaturesToTrack(g0, 300, 0.01, 5, mask=m)
T = [np.eye(2, 3, dtype=np.float64)]; prev = g0; p_prev = pts
for f in frames[1:]:
    g = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
    p_new, st, _ = cv2.calcOpticalFlowPyrLK(prev, g, p_prev, None, winSize=(31, 31), maxLevel=3)
    good = st.ravel() == 1
    A, _ = cv2.estimateAffinePartial2D(p_prev[good], p_new[good], method=cv2.RANSAC, ransacReprojThreshold=2.0)
    A = np.vstack([A, [0, 0, 1]]); T.append((A @ np.vstack([T[-1], [0, 0, 1]]))[:2])
    prev, p_prev = g, p_new[good].reshape(-1, 1, 2)
    if len(p_prev) < 60:   # top up features inside the tracked box
        c = np.array([[x0, y0, 1], [x1, y1, 1]]) @ T[-1].T
        mm = np.zeros_like(g); mm[int(c[0, 1]):int(c[1, 1]), int(c[0, 0]):int(c[1, 0])] = 255
        extra = cv2.goodFeaturesToTrack(g, 200, 0.01, 5, mask=mm)
        if extra is not None: p_prev = np.vstack([p_prev, extra])
c0 = np.array([(x0 + x1) / 2, (y0 + y1) / 2, 1.0]); ph0 = (y1 - y0)
C = np.array([t @ c0 for t in T]); S = np.array([math.hypot(t[0, 0], t[1, 0]) for t in T])
def smooth(x, k=7):
    p = np.pad(x, k // 2, mode='edge'); w = np.hanning(k + 2)[1:-1]; w /= w.sum(); return np.convolve(p, w, 'valid')
C = np.stack([smooth(C[:, 0]), smooth(C[:, 1])], 1); S = smooth(S)
json.dump({'plate': os.path.basename(a.plate), 'center': C.round(2).tolist(), 'scale': S.round(4).tolist()}, open(a.out + '.track.json', 'w'))

# 2. the cards: offset from the phone centre in phone heights, the time each arrives, and its size in phone heights
CARDS = [('shop', (-2.55, -0.55), 0.35, 1.55), ('bunch', (-2.75, 1.25), 1.05, 2.05),
         ('deliver', (2.55, -0.45), 2.0, 1.55), ('paid', (2.7, 0.75), 3.45, 1.7)]
imgs = {n: cv2.imread(os.path.join(a.cards, n + '.png'), cv2.IMREAD_UNCHANGED).astype(np.float32) / 255 for n, *_ in CARDS}
def eo(x): x = min(1, max(0, x)); return 1 - (1 - x) ** 3
def back(x):   # ease-out with a small overshoot
    x = min(1, max(0, x)); c = 1.4; return 1 + (c + 1) * (x - 1) ** 3 + c * (x - 1) ** 2

ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W0}x{H0}', '-r', '24', '-i', '-',
                       '-vf', 'scale=1920:1080:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', a.out],
                      stdin=subprocess.PIPE)
for n, f in enumerate(frames):
    t = n / 24; out = f.astype(np.float32) / 255; ph = ph0 * S[n]; cx, cy = C[n]
    blur = cv2.GaussianBlur(out, (0, 0), 14)
    for i, (name, (ox, oy), t0, hgt) in enumerate(CARDS):
        p = (t - t0) / 0.55
        if p <= 0: continue
        e, k = eo(p), back(p)
        img = imgs[name]
        # card height in the frame, from its height in phone heights (the 2x PNG includes its shadow margin)
        sc = (hgt * ph) / img.shape[0] * (0.88 + 0.12 * k)
        fx = cx + ox * ph * (0.55 + 0.45 * e)
        fy = cy + oy * ph * (0.55 + 0.45 * e) + 3.0 * math.sin(2 * math.pi * (t / 3.2 + i * 0.27)) * (ph / 95)
        w, h = int(img.shape[1] * sc), int(img.shape[0] * sc)
        if w < 4: continue
        c = cv2.resize(img, (w, h), interpolation=cv2.INTER_AREA)
        X, Y = int(round(fx - w / 2)), int(round(fy - h / 2))
        xa, ya, xb, yb = max(0, X), max(0, Y), min(W0, X + w), min(H0, Y + h)
        if xa >= xb or ya >= yb: continue
        cc = c[ya - Y:yb - Y, xa - X:xb - X]; al = cc[..., 3:] * e
        body = np.clip((cc[..., 3:] - 0.35) / 0.25, 0, 1) * e          # the card body, not its soft shadow
        reg = out[ya:yb, xa:xb]
        reg = reg * (1 - body) + blur[ya:yb, xa:xb] * body               # frosted plate under the glass
        reg = reg * (1 - al) + cc[..., :3] * al
        out[ya:yb, xa:xb] = reg
    ff.stdin.write((np.clip(out, 0, 1) * 255).astype(np.uint8).tobytes())
    if a.layer:   # the same cards, animated in place at the frame-0 phone position, on transparency
        os.makedirs(a.layer, exist_ok=True); L = np.zeros((H0, W0, 4), np.float32); ph = ph0; cx, cy = C[0]
        for i, (name, (ox, oy), t0, hgt) in enumerate(CARDS):
            p = (t - t0) / 0.55
            if p <= 0: continue
            e, k = eo(p), back(p); img = imgs[name]; sc = (hgt * ph) / img.shape[0] * (0.88 + 0.12 * k)
            fx = cx + ox * ph * (0.55 + 0.45 * e); fy = cy + oy * ph * (0.55 + 0.45 * e) + 3.0 * math.sin(2 * math.pi * (t / 3.2 + i * 0.27)) * (ph / 95)
            w, h = int(img.shape[1] * sc), int(img.shape[0] * sc)
            if w < 4: continue
            c = cv2.resize(img, (w, h), interpolation=cv2.INTER_AREA); X, Y = int(round(fx - w / 2)), int(round(fy - h / 2))
            xa, ya, xb, yb = max(0, X), max(0, Y), min(W0, X + w), min(H0, Y + h)
            if xa >= xb or ya >= yb: continue
            cc = c[ya - Y:yb - Y, xa - X:xb - X].copy(); cc[..., 3:] *= e
            dst = L[ya:yb, xa:xb]; al = cc[..., 3:]
            dst[..., :3] = cc[..., :3] * al + dst[..., :3] * (1 - al); dst[..., 3:] = al + dst[..., 3:] * (1 - al)
        rgb = np.where(L[..., 3:] > 0, L[..., :3] / np.maximum(L[..., 3:], 1e-6), 0)   # PNG wants straight alpha
        cv2.imwrite(os.path.join(a.layer, f'{n:04d}.png'), (np.dstack([rgb, L[..., 3]]) * 255).clip(0, 255).astype(np.uint8))
ff.stdin.close(); ff.wait()
print(a.out, len(frames), 'scale', round(float(S[0]), 3), '->', round(float(S[-1]), 3))

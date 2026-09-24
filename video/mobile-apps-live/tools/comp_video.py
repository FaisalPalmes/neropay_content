"""Composite a flat app-screen sequence onto a green-screen phone clip.

python3 comp_video.py plate.mp4 screens_dir out.mp4 [--tint b,g,r] [--dim 0.93] [--glare 0.7]

Per frame: find the screen's four corners (side-band line fit, see comp_still.quad), smooth the track over time,
warp the screen frame onto it, and replace only the green: fingers, nails and the notch stay on top. What the
plate's green carries above its own base level (glare, a sheen) is added back over the app so the glass still reads.
The corner track is written beside the output as <out>.track.json, so new screens can go in later without re-tracking.
"""
import cv2, numpy as np, json, sys, os, glob, subprocess, argparse
sys.path.insert(0, os.path.dirname(__file__))
from comp_still import quad

ap = argparse.ArgumentParser()
ap.add_argument('plate'); ap.add_argument('screens'); ap.add_argument('out')
ap.add_argument('--tint', default='1,1,1'); ap.add_argument('--dim', type=float, default=0.93)
ap.add_argument('--glare', type=float, default=0.7); ap.add_argument('--radius', type=float, default=0.12)
a = ap.parse_args()
tint = np.array([float(x) for x in a.tint.split(',')], np.float32)

cap = cv2.VideoCapture(a.plate); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
H0, W0 = frames[0].shape[:2]

# 1. track
Q = np.array([quad(f) for f in frames], np.float32)                  # n x 4 x 2
area = np.array([cv2.contourArea(q) for q in Q]); med = np.median(area)
bad = np.abs(area - med) > 0.25 * med
idx = np.arange(len(Q))
for c in range(4):
    for d in range(2):
        Q[bad, c, d] = np.interp(idx[bad], idx[~bad], Q[~bad, c, d])
# smooth: median 5 kills single-frame snaps, then a light 5-tap average kills detection jitter
def smooth(x):
    xm = np.array([np.median(x[max(0, i - 2):i + 3]) for i in range(len(x))])
    k = np.array([1, 2, 3, 2, 1], np.float32); k /= k.sum()
    p = np.pad(xm, 2, mode='edge'); return np.convolve(p, k, 'valid')
Qs = Q.copy()
for c in range(4):
    for d in range(2):
        Qs[:, c, d] = smooth(Q[:, c, d])
Qs = Qs.mean(1, keepdims=True) + (Qs - Qs.mean(1, keepdims=True)) * 1.015   # overscan so no green rim survives
json.dump({'plate': os.path.basename(a.plate), 'fps': 24, 'corners_TL_TR_BR_BL': Qs.round(2).tolist(), 'rejected': idx[bad].tolist()},
          open(a.out + '.track.json', 'w'))

# 2. composite
shots = sorted(glob.glob(os.path.join(a.screens, '*.png')))
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W0}x{H0}', '-r', '24', '-i', '-',
                       '-vf', 'scale=1920:1080:flags=lanczos,format=yuv420p', '-c:v', 'libx264', '-crf', '15', '-preset', 'slow', a.out],
                      stdin=subprocess.PIPE)
for n, f in enumerate(frames):
    scr = cv2.imread(shots[min(n, len(shots) - 1)]).astype(np.float32) / 255
    h, w = scr.shape[:2]
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), Qs[n])
    # the key decides the screen's shape; the app's edge pixels are replicated a little past the fitted edge,
    # so green the fit misses (a hand hiding part of a side pulls that side in) is still covered
    ws = cv2.warpPerspective(scr, M, (W0, H0), flags=cv2.INTER_AREA, borderMode=cv2.BORDER_REPLICATE)
    inside = cv2.warpPerspective(np.full((h, w), 255, np.uint8), M, (W0, H0))
    wa = cv2.dilate(inside, np.ones((25, 25), np.uint8)).astype(np.float32) / 255
    fl = f.astype(np.float32) / 255
    b, g, rd = fl[..., 0], fl[..., 1], fl[..., 2]
    dom = g - np.maximum(rd, b)
    k = np.clip((dom - 0.03) / 0.07, 0, 1)                       # tolerant: glare-lightened green still counts as screen
    k = cv2.GaussianBlur(k, (3, 3), 0) * wa
    # glare: how much brighter than the screen's own base green each pixel is
    Y = 0.114 * b + 0.587 * g + 0.299 * rd
    core = (dom > 0.2) & (inside > 128)
    base = np.median(Y[core]) if core.any() else Y[inside > 128].mean()
    glare = np.clip(Y - base * 1.04, 0, 1)[..., None] * a.glare
    app = ws * a.dim * tint + glare
    # despill what stays near the screen (fingers, bezel, notch)
    near = cv2.dilate((wa > 0).astype(np.uint8), np.ones((21, 21), np.uint8)).astype(bool)
    g2 = np.minimum(g, np.maximum(rd, b) * 1.02)
    fl[..., 1] = np.where(near, g2, g)
    out = fl * (1 - k[..., None]) + app * k[..., None]
    ff.stdin.write((np.clip(out, 0, 1) * 255).astype(np.uint8).tobytes())
ff.stdin.close(); ff.wait()
print(a.out, 'frames', len(frames), 'rejected', int(bad.sum()))

"""Put an app-screen sequence onto a tracked green-screen phone, with a hard, true screen edge.

python3 comp_screen.py plate.mp4 track.json screens_dir out.mp4 [--start 24] [--end 121] [--dim 0.9] [--tint b,g,r]

- The track is track_screen.py's per-frame sub-pixel corners (lightly filtered, never smoothed away from the plate).
- The screen's outline is the fitted polygon, drawn anti-aliased at 3x: no blurred matte, no overscan, no rescale.
- What stays in front of the screen is decided by colour, not by the green key: skin (fingers, nails) and dark
  (the notch, the bezel) stay; everything else inside the outline becomes app. So glare, and the fake status bar
  and home bar the video model painted onto the green, never show through as ghosts.
- The app is warped from its 2x render onto a 3x canvas and area-downsampled, three sub-frame positions averaged
  (a 180-degree shutter), so it blurs with the hand exactly as the plate does.
- The plate's large-scale glare (luminance above the green's own level, blurred so painted text can't come back)
  is laid back over the app, so the glass still reads.
Output is the plate's own size (1912x1080 for Kling 3.0), frames [start, end).
"""
import cv2, numpy as np, json, glob, os, argparse, subprocess

ap = argparse.ArgumentParser()
ap.add_argument('plate'); ap.add_argument('track'); ap.add_argument('screens'); ap.add_argument('out')
ap.add_argument('--start', type=int, default=0); ap.add_argument('--end', type=int, default=None)
ap.add_argument('--dim', type=float, default=0.9); ap.add_argument('--tint', default='1,1,1')
ap.add_argument('--glare', type=float, default=0.45); ap.add_argument('--grow', type=float, default=0.3)
ap.add_argument('--notch', help='x0,x1,depth,radius on the 390-wide screen: draw a clean notch into the app (the plate\'s is ignored)')
ap.add_argument('--radius', type=float, default=45.0, help='screen corner radius on the 390-wide screen, measured from the plate')
a = ap.parse_args()
tint = np.array([float(x) for x in a.tint.split(',')], np.float32)

cap = cv2.VideoCapture(a.plate); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(f)
H0, W0 = frames[0].shape[:2]
T = json.load(open(a.track)); raw = np.array(T['raw'], np.float64)

def savgol(x, w=5, p=3):
    h = w // 2; A = np.vander(np.arange(-h, h + 1), p + 1, increasing=True)
    c = np.linalg.pinv(A)[0]; xp = np.pad(x, h, mode='reflect', reflect_type='odd'); return np.convolve(xp, c[::-1], 'valid')
Q = raw.copy()
for c in range(4):
    for d in range(2): Q[:, c, d] = savgol(raw[:, c, d])
def at(t):   # corners at fractional frame t (for the shutter)
    t = min(max(t, 0), len(Q) - 1); i = int(np.floor(t)); j = min(i + 1, len(Q) - 1); u = t - i
    return Q[i] * (1 - u) + Q[j] * u
def grow(q, px):   # push each corner out along its diagonal by px
    c = q.mean(0); v = q - c; return c + v * (1 + px / np.linalg.norm(v, axis=1, keepdims=True))

shots = sorted(glob.glob(os.path.join(a.screens, '*.png')))
end = a.end or len(frames); S = 3
ff = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W0}x{H0}', '-r', '24', '-i', '-',
                       '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', a.out],
                      stdin=subprocess.PIPE)
qc = []
for n in range(a.start, end):
    f = frames[n]; x = f.astype(np.float32) / 255
    b, g, r = x[..., 0], x[..., 1], x[..., 2]
    scr = cv2.imread(shots[min(n, len(shots) - 1)]).astype(np.float32) / 255; h, w = scr.shape[:2]
    if a.notch:   # a crisp notch drawn into the app, so it is locked to the screen and never flickers
        nx0, nx1, nd, nr = [float(v) * w / 390 for v in a.notch.split(',')]
        nm = np.zeros((h * 4, w * 4), np.uint8); X0, X1, D, R = [int(v * 4) for v in (nx0, nx1, nd, nr)]
        cv2.rectangle(nm, (X0, 0), (X1, D - R), 255, -1); cv2.rectangle(nm, (X0 + R, 0), (X1 - R, D), 255, -1)
        cv2.circle(nm, (X0 + R, D - R), R, 255, -1); cv2.circle(nm, (X1 - R, D - R), R, 255, -1)
        nm = cv2.resize(nm, (w, h), interpolation=cv2.INTER_AREA).astype(np.float32)[..., None] / 255
        scr = scr * (1 - nm) + np.array([0.05, 0.043, 0.043], np.float32) * nm
        nmask = nm[..., 0]
    q0 = grow(at(n), a.grow)
    x0, y0 = np.floor(q0.min(0)).astype(int) - 6; x1, y1 = np.ceil(q0.max(0)).astype(int) + 6
    x0, y0 = max(0, x0), max(0, y0); x1, y1 = min(W0, x1), min(H0, y1); bw, bh = x1 - x0, y1 - y0
    acc = np.zeros((bh, bw, 3), np.float32); inside = None
    for k, dt in enumerate((-0.25, 0.0, 0.25)):
        qq = (grow(at(n + dt), a.grow) - [x0, y0]) * S
        M = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), qq.astype(np.float32))
        big = cv2.warpPerspective(scr, M, (bw * S, bh * S), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
        acc += cv2.resize(big, (bw, bh), interpolation=cv2.INTER_AREA)
        if dt == 0.0:   # the screen's own outline: a rounded rectangle in screen space, warped, anti-aliased at 3x
            R = int(a.radius * w / 390 * 4); rm = np.zeros((h * 4 // 4, w * 4 // 4), np.uint8)
            rr = np.zeros((h, w), np.uint8); r4 = int(round(a.radius * w / 390))
            cv2.rectangle(rr, (r4, 0), (w - r4, h), 255, -1); cv2.rectangle(rr, (0, r4), (w, h - r4), 255, -1)
            for cx, cy in [(r4, r4), (w - r4, r4), (r4, h - r4), (w - r4, h - r4)]: cv2.circle(rr, (cx, cy), r4, 255, -1, cv2.LINE_AA)
            inside = cv2.resize(cv2.warpPerspective(rr, M, (bw * S, bh * S), flags=cv2.INTER_LINEAR).astype(np.float32) / 255,
                                (bw, bh), interpolation=cv2.INTER_AREA)
    app = acc / 3
    if a.notch:
        Mn = cv2.getPerspectiveTransform(np.float32([[0, 0], [w, 0], [w, h], [0, h]]), ((grow(at(n), a.grow) - [x0, y0]) * S).astype(np.float32))
        notch_px = cv2.resize(cv2.warpPerspective(nmask, Mn, (bw * S, bh * S)), (bw, bh), interpolation=cv2.INTER_AREA)[..., None]
    rb, gb, bb = r[y0:y1, x0:x1], g[y0:y1, x0:x1], b[y0:y1, x0:x1]
    dom = gb - np.maximum(rb, bb); luma = 0.299 * rb + 0.587 * gb + 0.114 * bb
    sstep = lambda v, e0, e1: np.clip((v - e0) / (e1 - e0), 0, 1)
    # in front of the screen: only skin (fingers, nails). The bezel, the notch and the rounded corners come from
    # the outline above, so nothing the model painted onto the green (notch, home bar, smudges) survives
    occ = cv2.GaussianBlur(sstep(rb - gb, -0.01, 0.07), (0, 0), 0.9)
    # plus any strong green just outside the outline (AI video bends the phone's edges a little): the warped app
    # is edge-replicated there, so the green takes the app's own edge colour instead of showing as a sliver
    gk = sstep(dom, 0.06, 0.14) * (cv2.dilate((inside > 0.02).astype(np.uint8), np.ones((9, 9), np.uint8)) > 0)
    alpha = (np.maximum(inside, gk) * (1 - occ))[..., None]
    # glare: the green's own brightness, blurred wide so painted text can't come back, above its base level
    Yb = cv2.GaussianBlur(luma, (0, 0), 7); core = (dom > 0.2) & (inside > 0.99)
    base = np.median(Yb[core]) if core.any() else Yb.mean()
    glare = np.clip(Yb - base * 1.03, 0, 1)[..., None] * a.glare
    if a.notch: glare = glare * (1 - notch_px)
    out = x.copy(); reg = out[y0:y1, x0:x1]
    # despill whatever the plate keeps near the screen (finger edges, the bezel's inner line)
    reg[..., 1] = np.where(inside > 0.001, np.minimum(reg[..., 1], np.maximum(reg[..., 0], reg[..., 2]) * 1.03), reg[..., 1])
    reg[:] = reg * (1 - alpha) + np.clip(app * a.dim * tint + glare, 0, 1) * alpha
    res = (np.clip(out, 0, 1) * 255).astype(np.uint8)
    # QC: strong green left anywhere near the screen after the composite
    rr = res[y0:y1, x0:x1].astype(np.float32) / 255
    qc.append(int(((rr[..., 1] - np.maximum(rr[..., 0], rr[..., 2])) > 0.12).sum()))
    ff.stdin.write(res.tobytes())
ff.stdin.close(); ff.wait()
print(a.out, 'frames', end - a.start, 'green px left per frame: max', max(qc), 'mean', round(float(np.mean(qc)), 1))

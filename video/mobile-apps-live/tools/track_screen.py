"""Sub-pixel screen track for a green-screen phone clip.

python3 track_screen.py plate.mp4 out.json

Per frame, each of the four screen edges is found to a fraction of a pixel: the green/bezel transition is sampled
along ~120 short profiles across the edge, the 0.5 crossing of the green key is interpolated on each, and a robust
line goes through the crossings. Profiles a finger or thumb covers (no clean green-to-dark step) are dropped, so a
covered corner comes from the other three sides. The four lines intersect at the screen's (sharp) corners. A light
Savitzky-Golay pass then removes what is left of the frame-to-frame noise without lagging real motion, and the
jitter before and after it is reported in pixels.
"""
import cv2, numpy as np, json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from comp_still import quad as rough_quad

def keymap(f):
    x = f.astype(np.float32) / 255
    dom = x[..., 1] - np.maximum(x[..., 0], x[..., 2])
    return np.clip((dom - 0.02) / 0.10, 0, 1)

def fit_side(k, p, q, inward, n=120, half=10.0, step=0.25):
    d = q - p; L = np.linalg.norm(d); u = d / L
    ts = np.linspace(0.14, 0.86, n)
    offs = np.arange(-half, half + step, step)                     # from inside (-) to outside (+)
    base = p[None] + ts[:, None] * d[None]                         # n x 2
    pts = base[:, None, :] - inward[None, None, :] * offs[None, :, None]
    mx, my = pts[..., 0].astype(np.float32), pts[..., 1].astype(np.float32)
    prof = cv2.remap(k, mx, my, cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)   # n x m
    out = []
    for i in range(n):
        pr = prof[i]
        if pr[:12].mean() < 0.75 or pr[-12:].mean() > 0.25: continue   # covered or not an edge here
        j = np.where((pr[:-1] >= 0.5) & (pr[1:] < 0.5))[0]
        if len(j) != 1: continue
        j = j[0]; a, b = pr[j], pr[j + 1]; s = offs[j] + (a - 0.5) / (a - b) * step
        out.append(base[i] - inward * s)
    out = np.array(out, np.float32)
    if len(out) < 12: return None, len(out)
    vx, vy, x0, y0 = cv2.fitLine(out, cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
    nrm = np.array([-vy, vx]); r = np.abs((out - [x0, y0]) @ nrm)
    keep = out[r < 0.8]
    if len(keep) >= 12: vx, vy, x0, y0 = cv2.fitLine(keep, cv2.DIST_L2, 0, 0.01, 0.01).ravel()
    return (np.array([x0, y0]), np.array([vx, vy])), len(out)

def corners(lines):
    Q = []
    for i in range(4):
        (p1, d1), (p2, d2) = lines[i - 1], lines[i]
        s = np.linalg.solve(np.array([d1, -d2]).T, p2 - p1); Q.append(p1 + s[0] * d1)
    return np.array(Q, np.float32)

def track(frames):
    raw, counts, prev = [], [], None
    for f in frames:
        k = keymap(f)
        Q0 = rough_quad(f) if prev is None else prev
        c = Q0.mean(0); lines = []; cnt = []
        for i in range(4):
            p, q = Q0[i], Q0[(i + 1) % 4]
            mid = (p + q) / 2; inward = c - mid; e = q - p
            nrm = np.array([-e[1], e[0]]); nrm /= np.linalg.norm(nrm)
            inward = nrm if nrm @ inward > 0 else -nrm
            ln, m = fit_side(k, p, q, inward); cnt.append(m)
            lines.append(ln)
        if any(l is None for l in lines):                          # a side fully covered: fall back to the rough fit
            Q = rough_quad(f)
        else:
            Q = corners(lines)
        # a second pass from the refined corners tightens the side sampling
        if not any(l is None for l in lines):
            c = Q.mean(0); lines2 = []
            for i in range(4):
                p, q = Q[i], Q[(i + 1) % 4]; e = q - p
                nrm = np.array([-e[1], e[0]]); nrm /= np.linalg.norm(nrm)
                inward = nrm if nrm @ (c - (p + q) / 2) > 0 else -nrm
                ln, m = fit_side(k, p, q, inward); lines2.append(ln)
            if not any(l is None for l in lines2): Q = corners(lines2)
        raw.append(Q); counts.append(cnt); prev = Q
    return np.array(raw), counts

def savgol(x, w=7, p=2):
    h = w // 2; A = np.vander(np.arange(-h, h + 1), p + 1, increasing=True)
    c = np.linalg.pinv(A)[0]; xp = np.pad(x, h, mode='reflect', reflect_type='odd')
    return np.convolve(xp, c[::-1], 'valid')

if __name__ == '__main__':
    cap = cv2.VideoCapture(sys.argv[1]); frames = []
    while True:
        ok, f = cap.read()
        if not ok: break
        frames.append(f)
    raw, counts = track(frames)
    sm = raw.copy()
    for c in range(4):
        for d in range(2): sm[:, c, d] = savgol(raw[:, c, d])
    # jitter: the frame-to-frame noise left after removing smooth motion (second difference of the path)
    def jit(Q): a = Q[2:] - 2 * Q[1:-1] + Q[:-2]; return float(np.sqrt((a ** 2).sum(-1)).mean() / np.sqrt(6))
    json.dump({'corners_TL_TR_BR_BL': sm.round(3).tolist(), 'raw': raw.round(3).tolist(), 'edge_samples': counts,
               'jitter_px_raw': round(jit(raw), 3), 'jitter_px_smoothed': round(jit(sm), 3)}, open(sys.argv[2], 'w'))
    print('frames', len(frames), 'jitter px raw', round(jit(raw), 3), 'smoothed', round(jit(sm), 3),
          'min edge samples', np.array(counts).min(0).tolist())

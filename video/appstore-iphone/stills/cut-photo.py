# Cuts one of Faisal's green-screen hand photographs off its wall and keys the phone's screen, for the carousel's
# photo slides. Writes assets/photo-<name>-cut.png (RGBA) and assets/photo-<name>.json with the screen's four
# corners (the rounded screen's bounding quad, found by fitting a straight line to each edge of the green), so
# index.html can map the app onto the screen at the photo's own angle.
#   python3 stills/cut-photo.py pos|reports|links       (numpy and ffmpeg only)
import numpy as np, subprocess, os, sys, json
d = os.path.dirname(os.path.abspath(__file__)); name = sys.argv[1]; W, H = 1116, 2000
raw = subprocess.run(['ffmpeg','-loglevel','error','-i',f'{d}/assets/photo-{name}-src.webp','-f','rawvideo','-pix_fmt','rgb24','-'],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(float)
r, g, b = a[...,0], a[...,1], a[...,2]
gx = g - np.maximum(r, b)

# ── the screen: strict chroma green (the emerald nails are far darker, so they are never keyed) ──
G = (g > 170) & (r < 130) & (b < 130) & (gx > 80)
ys, xs = np.where(G)
x0, x1, y0, y1 = xs.min(), xs.max(), ys.min(), ys.max()

def fit(pts):                      # least squares, then drop points more than 4px off and refit (fingers, corners)
    p = np.array(pts, float)
    for _ in range(3):
        A = np.vstack([p[:,0], np.ones(len(p))]).T
        m, c = np.linalg.lstsq(A, p[:,1], rcond=None)[0]
        res = np.abs(p[:,1] - (m * p[:,0] + c)); keep = res < 4
        if keep.all() or keep.sum() < 20: break
        p = p[keep]
    return m, c
mid = lambda lo, hi: range(int(lo + (hi - lo) * .2), int(lo + (hi - lo) * .8))
# a finger or thumb over the screen can only pull an edge inward, so keep the outermost half of each edge's samples
def outer(pts, keep_low):
    v = np.array([q[1] for q in pts]); cut = np.percentile(v, 55 if keep_low else 45)
    return [q for q in pts if (q[1] <= cut if keep_low else q[1] >= cut)]
left  = fit(outer([(y, np.where(G[y])[0].min()) for y in mid(y0, y1) if G[y].any()], True))        # x = m*y + c
right = fit(outer([(y, np.where(G[y])[0].max()) for y in mid(y0, y1) if G[y].any()], False))
top   = fit(outer([(x, np.where(G[:,x])[0].min()) for x in mid(x0, x1) if G[:,x].any()], True))    # y = m*x + c
bot   = fit(outer([(x, np.where(G[:,x])[0].max()) for x in mid(x0, x1) if G[:,x].any()], False))
def meet(v, h):                    # v: x = mv*y + cv ; h: y = mh*x + ch
    mv, cv = v; mh, ch = h; y = (mh * cv + ch) / (1 - mh * mv); return [round(mv * y + cv, 1), round(y, 1)]
quad = { 'tl': meet(left, top), 'tr': meet(right, top), 'br': meet(right, bot), 'bl': meet(left, bot) }

# ── the wall: flood in from the frame edge over pale, warm, unsaturated pixels ──
mx, mn = a.max(2), a.min(2); sat = (mx - mn) / np.maximum(mx, 1)
wallish = (mx > 140) & (sat < 0.30) & (b <= g + 4) & (r >= g - 3)   # includes the wall in the hand's shadow
# per photo: the deeper shadow the hand throws on the wall, a looser test only where it falls
# (fingers there measure mx ≤ 115, sat ≥ .43; the shadowed wall mx 150–171, sat .28–.35)
SHADE = { 'reports': [(1000, 1700, 760, W), (1440, 1800, 600, W)] }
for ya, yb, xa, xb in SHADE.get(name, []):
    shade = np.zeros((H, W), bool); shade[ya:yb, xa:xb] = True
    wallish |= shade & (mx > 125) & (sat < 0.40) & (b <= g + 4) & (r >= g - 3)
def flood(seed, allow):
    m = seed & allow
    for _ in range(8000):
        n = m.copy()
        n[1:,:] |= m[:-1,:]; n[:-1,:] |= m[1:,:]; n[:,1:] |= m[:,:-1]; n[:,:-1] |= m[:,1:]
        n &= allow
        if (n == m).all(): return m
        m = n
    return m
edge = np.zeros((H, W), bool); edge[0,:] = edge[-1,:] = edge[:,0] = edge[:,-1] = True
subj = ~flood(edge, wallish)
seed = np.zeros((H, W), bool); seed[(y0 + y1) // 2, (x0 + x1) // 2] = True     # the phone itself
subj = flood(seed, subj)                                                        # nothing not joined to it

def box(m, k):
    m = m.astype(float); p = k // 2
    c = np.cumsum(np.pad(m, ((p+1, p), (0, 0)), mode='edge'), 0); m = (c[k:] - c[:-k]) / k
    c = np.cumsum(np.pad(m, ((0, 0), (p+1, p)), mode='edge'), 1); return (c[:, k:] - c[:, :-k]) / k
alpha = np.clip((box(subj, 3) - 0.5) * 2, 0, 1); alpha = box(alpha, 3)

# key the screen, softly at its edge, and pull the green out of the bezel's rim (dark, low-blue pixels near the key)
key = np.clip((g - 150) / 40, 0, 1) * np.clip((gx - 60) / 40, 0, 1)
near = box(G, 9) > 0
key = np.where(near, key, 0)
alpha = alpha * (1 - key)
rim = near & (gx > 8) & (b < r + 12)          # spill (skin or bezel mixed with green) has little blue; the emerald nails have plenty
g2 = np.where(rim, np.minimum(g, (r + b) / 2 + 6), g)

out = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8)
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-i','-',
                f'{d}/assets/photo-{name}-cut.png'], input=out.tobytes(), check=True)
json.dump({ 'w': W, 'h': H, 'quad': quad }, open(f'{d}/assets/photo-{name}.json', 'w'))
# every photo's quad in one script the page can load from file:// (fetch of a local JSON is refused there)
import glob
allq = { os.path.basename(f)[6:-5]: json.load(open(f)) for f in sorted(glob.glob(f'{d}/assets/photo-*.json')) }
open(f'{d}/assets/photo-quads.js', 'w').write('window.PHOTOQ = ' + json.dumps(allq) + ';\n')
print(name, 'quad', quad, 'subject', round(float((alpha > .5).mean()) * 100, 1), '%')

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

def fit(pts):                      # RANSAC: the line through the most samples within 2px, then least squares on those
    p = np.array(pts, float); rng = np.random.default_rng(7); best = None
    for _ in range(600):              # (a thumb, a fingertip or a notch is a minority off the line, never on it)
        i, j = rng.choice(len(p), 2, replace=False)
        if p[i,0] == p[j,0]: continue
        m = (p[j,1] - p[i,1]) / (p[j,0] - p[i,0]); c = p[i,1] - m * p[i,0]
        inl = np.abs(p[:,1] - (m * p[:,0] + c)) < 2
        if best is None or inl.sum() > best.sum(): best = inl
    q = p[best]; A = np.vstack([q[:,0], np.ones(len(q))]).T
    return tuple(np.linalg.lstsq(A, q[:,1], rcond=None)[0])
# sample each edge along its own span: rows between the top and bottom of the green for the sides, and for the top
# and bottom the columns of the green's first and last 40 rows, so a tilted phone's side is never read as its top
mid = lambda lo, hi: range(int(lo + (hi - lo) * .08), int(lo + (hi - lo) * .92))
# a finger or thumb over the screen can only pull an edge inward, so keep the outermost samples of each edge
def outer(pts, keep_low):
    v = np.array([q[1] for q in pts]); cut = np.percentile(v, 60 if keep_low else 40)
    return [q for q in pts if (q[1] <= cut if keep_low else q[1] >= cut)]
tx = np.where(G[y0:y0+40].any(0))[0]; bx = np.where(G[y1-40:y1+1].any(0))[0]
left  = fit(outer([(y, np.where(G[y])[0].min()) for y in mid(y0, y1) if G[y].any()], True))        # x = m*y + c
right = fit(outer([(y, np.where(G[y])[0].max()) for y in mid(y0, y1) if G[y].any()], False))
top   = fit(outer([(x, np.where(G[:,x])[0].min()) for x in mid(tx.min(), tx.max()) if G[:,x].any()], True))    # y = m*x + c
bot   = fit(outer([(x, np.where(G[:,x])[0].max()) for x in mid(bx.min(), bx.max()) if G[:,x].any()], False))
def meet(v, h):                    # v: x = mv*y + cv ; h: y = mh*x + ch
    mv, cv = v; mh, ch = h; y = (mh * cv + ch) / (1 - mh * mv); return [round(mv * y + cv, 1), round(y, 1)]
quad = { 'tl': meet(left, top), 'tr': meet(right, top), 'br': meet(right, bot), 'bl': meet(left, bot) }

# ── the wall: flood in from the frame edge over pale, warm, unsaturated pixels ──
mx, mn = a.max(2), a.min(2); sat = (mx - mn) / np.maximum(mx, 1)
wallish = (mx > 140) & (sat < 0.30) & (b <= g + 4) & (r >= g - 3)   # includes the wall in the hand's shadow
# fair skin passes that test (sat .18–.28), so on the fair-skin photos the wall is held to its own colour: nearly
# grey (sat ≤ .12, wall .03–.11) and only faintly warm (r − b < 28; wall 8–22, skin 40+)
if name in ('pos', 'reports'):
    wallish = (mx > 120) & (sat < 0.12) & (r - b < 28) & (b <= g + 4) & (r >= g - 3)
# per photo: the deeper shadow the hand throws on the wall, a looser test only where it falls
# per photo: the deeper shadow the hand throws on the wall, a looser test only where it falls. On the fair-skin
# reports photo the shadow is the skin's own hue (r:g:b 1 : .88 : .77 against the skin's 1 : .87 : .79), so it is
# told apart by its softness: the flood may not cross a sharp step in brightness, which the hand's edge always is
SHADE = { 'reports': [(560, 880, 740, W), (880, 1300, 935, W), (1300, 2000, 740, W), (1360, 2000, 560, 740)] }
# (the three fingertips, x 740–935 between y 880 and 1300, are left out: their undersides are as soft as the shadow.
# There the fingers are told apart by colour instead: the skin is pinker, r − g 58–66 even in its own shade, where
# the shadow between them is r − g 22–31)
TIPS = { 'reports': [(880, 1300, 740, 935)] }
for ya, yb, xa, xb in SHADE.get(name, []):
    shade = np.zeros((H, W), bool); shade[ya:yb, xa:xb] = True
    Lm = a.mean(2); Ls = (Lm[:-2,1:-1] + Lm[2:,1:-1] + Lm[1:-1,:-2] + Lm[1:-1,2:] + 4 * Lm[1:-1,1:-1]) / 8
    grad = np.zeros((H, W)); gy_ = np.abs(Ls[2:,1:-1] - Ls[:-2,1:-1]); gx_ = np.abs(Ls[1:-1,2:] - Ls[1:-1,:-2])
    grad[2:-2,2:-2] = np.maximum(gy_, gx_) / 2
    wallish |= shade & (mx > 120) & (sat < 0.34) & (b <= g + 4) & (r >= g - 3) & (grad < 4)
# and the darkest of it, tucked under the phone, where it is too dark to be
# told apart by softness: one small box that holds only shadow (the palm beside them measures sat ≥ .47)
for ya, yb, xa, xb in TIPS.get(name, []):
    tips = np.zeros((H, W), bool); tips[ya:yb, xa:xb] = True
    wallish |= tips & (mx > 110) & (mx < 205) & (r - g < 42) & (g - b > 10) & (b <= g + 4)
DEEP = { 'reports': [(1385, 1470, 606, 760, .40, 160)] }
for ya, yb, xa, xb, s_, m_ in DEEP.get(name, []):
    deep = np.zeros((H, W), bool); deep[ya:yb, xa:xb] = True
    wallish |= deep & (mx > 100) & (mx < m_) & (sat < s_) & (b <= g + 4)
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
# a 7px mean cut at half rounds the stair-steps the flood leaves along a soft shadow into a smooth contour
alpha = np.clip((box(subj, 7) - 0.5) * 3 + 0.5, 0, 1); alpha = box(alpha, 3)

# key the screen with a luma matte. The webp stores colour at half resolution, so at a finger's edge over the green
# the colour comes in 2px blocks (a green tint and a stair-stepped key) while brightness is sharp. So, in a 3px
# band around the green: take each pixel's colour from the clean finger, nail or bezel beside it (bled outward a
# pixel at a time), and its opacity from where its brightness sits between the screen's and that colour's
Y = .299 * r + .587 * g + .114 * b
Yg = np.median(Y[G])
band = (box(G, 7) > 0) & ~(box(G, 5) > .999)       # within 3px of the green, but not 2px deep inside it
known = (~(box(G, 7) > 0)).astype(float)
for _ in range(10):
    n = box(known, 3); fill = band & (n > 0) & (known == 0)
    if not fill.any(): break
    r, g, b = [np.where(fill, box(c * known, 3) / np.maximum(n, 1e-6), c) for c in (r, g, b)]
    known = np.where(fill, 1., known)
Yf = .299 * r + .587 * g + .114 * b
d_ = Yf - Yg
luma = np.clip((Y - Yg) / np.where(np.abs(d_) < 1, 1, d_), 0, 1)
gxs = np.clip(1 - gx / (np.median(gx[G]) or 1), 0, 1)   # where the finger's brightness is too close to the screen's
screen_a = np.where(np.abs(d_) > 25, luma, gxs)
screen_a = np.where(G & ~band, 0, np.where(band, screen_a, 1))
alpha = alpha * screen_a
g2 = g

out = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8)
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-i','-',
                f'{d}/assets/photo-{name}-cut.png'], input=out.tobytes(), check=True)
json.dump({ 'w': W, 'h': H, 'quad': quad }, open(f'{d}/assets/photo-{name}.json', 'w'))
# every photo's quad in one script the page can load from file:// (fetch of a local JSON is refused there)
import glob
allq = { os.path.basename(f)[6:-5]: json.load(open(f)) for f in sorted(glob.glob(f'{d}/assets/photo-*.json')) }
open(f'{d}/assets/photo-quads.js', 'w').write('window.PHOTOQ = ' + json.dumps(allq) + ';\n')
print(name, 'quad', quad, 'subject', round(float((alpha > .5).mean()) * 100, 1), '%')

# Cuts the hands, phone and card out of Faisal's Higgsfield photograph (assets/hero-src.webp, 1116 × 2000): the
# wall is found by flooding in from the frame edge over pale, unsaturated pixels, so anything enclosed (the VISA
# letters, the rhinestones, the phone's screen) stays with the subject. The phone's green screen is keyed as in
# key-hero.py. Output: assets/hero-cut.png, RGBA, for the stills' blurred-glass background variants.
#   python3 stills/cut-hero.py      (numpy and ffmpeg only)
import numpy as np, subprocess, os
d = os.path.dirname(os.path.abspath(__file__)); W, H = 1116, 2000
raw = subprocess.run(['ffmpeg','-loglevel','error','-i',f'{d}/assets/hero-src.webp','-f','rawvideo','-pix_fmt','rgb24','-'],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(float)
r, g, b = a[...,0], a[...,1], a[...,2]
mx, mn = a.max(2), a.min(2)
sat = (mx - mn) / np.maximum(mx, 1)
wallish = (mx > 178) & (sat < 0.24) & (b <= g + 4) & (r >= g - 3)   # pale, unsaturated, warm; lilac and green nails fail
# the wall in the fingers' shadow (right of the phone, lower half) is darker and warmer: a looser test there only,
# so a pale highlight on the thumb elsewhere is never taken for wall
shade = np.zeros((H, W), bool); shade[1150:1460, 760:W] = True
wallish |= shade & (mx > 150) & (sat < 0.30) & (b <= g + 4) & (r >= g - 3)

# flood from the border through wall-like pixels (4-neighbour, iterate to a fixed point)
wall = np.zeros((H, W), bool)
wall[0,:] = wallish[0,:]; wall[-1,:] = wallish[-1,:]; wall[:,0] = wallish[:,0]; wall[:,-1] = wallish[:,-1]
for _ in range(4000):
    grow = wall.copy()
    grow[1:,:] |= wall[:-1,:]; grow[:-1,:] |= wall[1:,:]; grow[:,1:] |= wall[:,:-1]; grow[:,:-1] |= wall[:,1:]
    grow &= wallish
    if (grow == wall).all(): break
    wall = grow
subj = ~wall

def box(m, k):                       # separable box blur via cumulative sums
    m = m.astype(float); p = k // 2
    c = np.cumsum(np.pad(m, ((p+1, p), (0, 0)), mode='edge'), 0); m = (c[k:] - c[:-k]) / k
    c = np.cumsum(np.pad(m, ((0, 0), (p+1, p)), mode='edge'), 1); return (c[:, k:] - c[:, :-k]) / k

# drop specks (isolated wall-noise islands): keep pixels whose 9px neighbourhood is mostly subject
subj = box(subj, 9) > 0.5
# pull the edge in by a pixel so no wall colour fringes the skin, then feather it
alpha = np.clip((box(subj, 3) - 0.5) * 2, 0, 1)
alpha = box(alpha, 3)

# the green screen, keyed only inside the phone's screen rectangle
gx = g - np.maximum(r, b)
rect = np.zeros((H, W), bool); rect[575:1410, 360:755] = True
alpha = np.where(rect, alpha * (1 - np.clip((gx - 25) / 90, 0, 1)) ** 1.6, alpha)   # tight key: no green-tinged rim on the card
g2 = np.where(rect & (gx > 0), np.minimum(g, (r + b) / 2 + 10), g)   # despill hard: the blue card's edge picked up green

# the card's bottom edge over the screen (y 760–840) keeps a dark teal rim from the green behind it: pull it to navy
edge = np.zeros((H, W), bool); edge[760:840, 360:755] = True
g2 = np.where(edge & (g > r + 10), np.minimum(g2, (r + b) / 2), g2)
out = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8)
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-i','-',
                f'{d}/assets/hero-cut.png'], input=out.tobytes(), check=True)
print('subject', round(float((alpha > .5).mean()) * 100, 1), '% of frame')

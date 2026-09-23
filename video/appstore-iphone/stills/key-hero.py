# Keys the green screen out of Faisal's Higgsfield photograph (assets/hero-src.webp, 1116 × 2000) so the app can sit
# underneath it. Only the phone's screen rectangle is keyed, so the shop owner's emerald nails keep their colour.
#   python3 stills/key-hero.py      (needs numpy and ffmpeg)
import numpy as np, subprocess, os
d = os.path.dirname(os.path.abspath(__file__)); W, H = 1116, 2000
raw = subprocess.run(['ffmpeg','-loglevel','error','-i',f'{d}/assets/hero-src.webp','-f','rawvideo','-pix_fmt','rgb24','-'],
                     capture_output=True, check=True).stdout
a = np.frombuffer(raw, np.uint8).reshape(H, W, 3).astype(float)
r, g, b = a[...,0], a[...,1], a[...,2]
gx = g - np.maximum(r, b)                                   # how far green exceeds red and blue
rect = np.zeros((H, W), bool); rect[575:1410, 360:755] = True
alpha = np.where(rect, 1 - np.clip((gx - 40) / 100, 0, 1), 1.0)
g2 = np.where(rect & (gx > 0), np.minimum(g, np.maximum(r, b) + 8), g)   # despill the edge
out = np.dstack([r, g2, b, alpha * 255]).clip(0, 255).astype(np.uint8)
subprocess.run(['ffmpeg','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-i','-',
                f'{d}/assets/hero-keyed.png'], input=out.tobytes(), check=True)
print('keyed', int((alpha < .5).sum()), 'px')

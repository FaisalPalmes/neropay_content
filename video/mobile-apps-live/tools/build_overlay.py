"""Write the liquid-glass overlay specs for the three pilot shots (render with screens/render-overlay.cjs).

python3 build_overlay.py <workdir>

<workdir> holds fr-street/, fr-table/, fr-mia/ (the composited or plate frames) and street-t4.json, table-t4.json,
mia-cam.json (the tracks). Cards on the screen shots follow the tracked phone (centre and size, lightly smoothed);
Mia's follow the camera track, so they sit in the room while the camera pushes in.
"""
import json, sys, os, glob, math, numpy as np

W = sys.argv[1]
def sg(x, w=11, p=2):
    h = w // 2; V = np.vander(np.arange(-h, h + 1), p + 1, increasing=True); c = np.linalg.pinv(V)[0]
    xp = np.pad(x, h, mode='reflect', reflect_type='odd'); return np.convolve(xp, c[::-1], 'valid')
def ease(p): p = min(1, max(0, p)); return 1 - (1 - p) ** 4

LEAF = '<img src="sage-icon.svg" style="width:40px;height:40px;border-radius:10px" alt="">'
CLOCK = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>'
POLISH = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C2527E" stroke-width="1.8" stroke-linejoin="round"><rect x="10" y="2.5" width="4" height="6" rx="1"/><rect x="7" y="8.5" width="10" height="13" rx="3"/><path d="M7 14h10"/></svg>'
FLOWER = '<svg width="36" height="36" viewBox="-40 -40 80 80"><g fill="#E8973A"><circle r="13" cx="0" cy="-15"/><circle r="13" cx="14" cy="-5"/><circle r="13" cx="9" cy="12"/><circle r="13" cx="-9" cy="12"/><circle r="13" cx="-14" cy="-5"/></g><circle r="10" fill="#4A2338"/></svg>'
VAN = '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#8A5A1F" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>'
def card(ic, icbg, k=None, t='', s=None, pr=None, icclass=''):
    return (f'<div class="glass"><span class="ic {icclass}" style="background:{icbg}">{ic}</span><span class="tx">'
            + (f'<span class="k">{k}</span>' if k else '') + f'<span class="t">{t}</span>' + (f'<span class="s">{s}</span>' if s else '')
            + '</span>' + (f'<span class="pr">{pr}</span>' if pr else '') + '</div>')

def phone_anchor(track, start, n):
    raw = np.array(json.load(open(os.path.join(W, track)))['raw'])[start:start + n]
    c = raw.mean(1); h = (np.linalg.norm(raw[:, 3] - raw[:, 0], axis=1) + np.linalg.norm(raw[:, 2] - raw[:, 1], axis=1)) / 2
    return sg(c[:, 0]), sg(c[:, 1]), sg(h)

def cards_on_phone(cx, cy, hh, defs):
    out = []
    for j, (cid, html, t0, ox, oy, base) in enumerate(defs):
        f = []
        for i in range(len(cx)):
            t = i / 24; e = ease((t - t0) / 0.5)
            fl = 2.2 * math.sin(2 * math.pi * (t / 3.4 + j * 0.31))
            f.append([float(cx[i] + ox * hh[i]), float(cy[i] + oy * hh[i]), base * (0.94 + 0.06 * e), e, (1 - e) * 22 + fl * e])
        out.append({'id': cid, 'html': html, 'f': f})
    return out

specs = {}
# pavement: the cut starts at plate frame 24, so t here is cut time (tap on the cinnamon knot at 3.33s plate = 2.33s cut)
fr = sorted(glob.glob(os.path.join(W, 'fr-street', '*.png'))); cx, cy, hh = phone_anchor('street-t4.json', 24, len(fr))
specs['street'] = {'w': 1912, 'h': 1080, 'frames': fr, 'cards': cards_on_phone(cx, cy, hh, [
    ('a', card(LEAF, '#74805C', k='Added to your order', t='Cinnamon knot', pr='£3.60'), 2.42, 0.88, -0.12, 1.0),
    ('b', card(CLOCK, '#2E3225', k='Sage &amp; Co', t='Ready in 8 min', s='Collect at the counter'), 2.95, 0.88, 0.1, 1.0)])}
fr = sorted(glob.glob(os.path.join(W, 'fr-table', '*.png'))); cx, cy, hh = phone_anchor('table-t4.json', 0, len(fr))
specs['table'] = {'w': 1912, 'h': 1080, 'frames': fr, 'cards': cards_on_phone(cx, cy, hh, [
    ('a', card(POLISH, '#F6D3DF', k='Rosehip Nails', t='Gel pedicure', s='50 min · with Ella', pr='£35'), 2.36, -0.8, -0.2, 1.0),
    ('b', card('✓', '#34C759', k='Booked', t='Sat 20 · 11:30', s='Rosehip Nails', icclass='ok'), 4.56, -0.8, 0.02, 1.0)])}
# Mia: frame-0 phone centre and height, then the camera's similarity transform per frame
fr = sorted(glob.glob(os.path.join(W, 'fr-mia', '*.png'))); cam = json.load(open(os.path.join(W, 'mia-cam.json')))
P0, PH = np.array([945.0, 458.0]), 110.0
defs = [('shop', card(FLOWER, '#F3DCD6', t='Marigold Lane', s='Florist · open now'), 0.35, -2.7, -0.55),
        ('bunch', card(FLOWER, '#F3DCD6', t='The Sunday Bunch', s='Seasonal, hand-tied', pr='£28.00'), 1.05, -2.9, 1.05),
        ('deliver', card(VAN, '#F6E7C9', k='Delivery', t='Tomorrow, 9–12'), 2.0, 2.6, -0.5),
        ('paid', card('✓', '#34C759', t='Payment confirmed', s='Marigold Lane · £28.00', icclass='ok'), 3.45, 2.85, 0.75)]
mc = []
for j, (cid, html, t0, ox, oy) in enumerate(defs):
    f = []
    for i in range(len(fr)):
        s, r, tx, ty = cam['scale'][i], cam['rot'][i], cam['tx'][i], cam['ty'][i]
        p = P0 + np.array([ox, oy]) * PH
        x = s * (math.cos(r) * p[0] - math.sin(r) * p[1]) + tx; y = s * (math.sin(r) * p[0] + math.cos(r) * p[1]) + ty
        t = i / 24; e = ease((t - t0) / 0.5); fl = 2.0 * math.sin(2 * math.pi * (t / 3.4 + j * 0.27))
        f.append([float(x), float(y), 0.74 * s * (0.94 + 0.06 * e), e, (1 - e) * 18 + fl * e])
    mc.append({'id': cid, 'html': html, 'f': f})
specs['mia'] = {'w': 1912, 'h': 1080, 'frames': fr, 'cards': mc}
for k, v in specs.items():
    json.dump(v, open(os.path.join(W, f'spec-{k}.json'), 'w'))
    print(k, len(v['frames']), 'frames', len(v['cards']), 'cards')

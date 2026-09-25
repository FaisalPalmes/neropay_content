#!/usr/bin/env python3
"""Move every word-anchored time in index.html from one take to another.

    python3 retime.py <old_words.json> <new_words.json> [--head 0.6] [--upto 122.9]

Every reveal in index.html is a film time taken from the word it lands on (data-at, data-mark, data-rule, data-flash, a
scene's [start, end], the stagger bases, the step and knob and chart times). When the take is re-voiced the words move,
so this aligns the two word lists (same script, word by word, by difflib on the normalised words), builds a piecewise-linear
map from old film time to new film time through every matched word's start and end, and rewrites each of those numbers
through it. Numbers above --upto (the close, which is set by hand against the new take) are left alone.
Written 24 Sep 2026 for the re-voice with tone; keep it for the next one.
"""
import json, re, sys, difflib
from pathlib import Path

a = sys.argv[1:]
old = json.load(open(a[0])); new = json.load(open(a[1]))
opt = lambda k, d: float(a[a.index(k) + 1]) if k in a else d
HEAD, UPTO = opt('--head', 0.6), opt('--upto', 1e9)
norm = lambda w: re.sub(r"[^a-z0-9]", "", w.lower())
ow = [w for w in old if norm(w['w'])]; nw = [w for w in new if norm(w['w'])]
sm = difflib.SequenceMatcher(a=[norm(w['w']) for w in ow], b=[norm(w['w']) for w in nw], autojunk=False)
pts = []
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        o, n = ow[blk.a + k], nw[blk.b + k]
        pts += [(o['s'] + HEAD, n['s'] + HEAD), (o['e'] + HEAD, n['e'] + HEAD)]
pts = sorted(set(pts))
mono = []                                            # keep the map monotonic: drop any pair that would run backwards
for x, y in pts:
    if not mono or (x > mono[-1][0] and y >= mono[-1][1]): mono.append((x, y))
matched = sum(b.size for b in sm.get_matching_blocks())
print(f'matched {matched} of {len(ow)} old words, {len(mono)} map points', file=sys.stderr)

def f(x):
    if x <= mono[0][0]: return x + (mono[0][1] - mono[0][0])
    for (x0, y0), (x1, y1) in zip(mono, mono[1:]):
        if x0 <= x <= x1: return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return x + (mono[-1][1] - mono[-1][0])

page = Path(__file__).with_name('index.html'); s = page.read_text()
n = 0
def sub(m):
    global n
    v = float(m.group(2))
    if v > UPTO or v < 0.3: return m.group(0)
    n += 1; return f"{m.group(1)}{f(v):.2f}{m.group(3)}"
pats = [r'(data-(?!new|a=)[a-z0-9]+=")([\d.]+)(")',                    # attributes: every timed data-*, not data-new or the spark angles
        r'(?<!t: )(\[)(\d{2,3}\.\d+)(, )',                                         # the modules' keyframes, [58.6, 0]: decimals only, so RT's integer counts are left alone
        r'(\{ t: \[)([\d.]+)(,)', r'(\{ t: \[[\d.]+, )([\d.]+)(\])',     # scene spans
        r'(\$\{\()([\d.]+)( \+ i)',                                        # stagger bases
        r'(\(t - )([\d.]+)(\))', r'(\(t - )([\d.]+)( \+)', r'(t > )([\d.]+)( \?)',   # scene-specific moves
        r'(\[l[12], )([\d.]+)(\])',
        r"(\[')([\d.]+)(')"]                                              # times written as text inside the card lists (missed on 24 Sep: ten reveals stayed on the old take)
if '--quoted-only' in a: pats = pats[-1:]
for p in pats: s = re.sub(p, sub, s)
if '--quoted-only' not in a: s = re.sub(r'(const STEP = \[)([^\]]+)(\])', lambda m: m.group(1) + ', '.join(f'{f(float(v)):.2f}' for v in m.group(2).split(',')) + m.group(3), s)
page.write_text(s)
print(f'retimed {n} values (+ the step list)', file=sys.stderr)

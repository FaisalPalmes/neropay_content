#!/usr/bin/env python3
"""Breath gate: silence what is left between the words of a take.

    python3 motion/gate.py <series>/<episode> [--inset 0.05] [--ramp 0.03] [--floor 0.0]

Reads data/vo.mp3 + data/vo_words.json (after tighten.mjs) and mutes every gap between two words — an inhale,
a lip noise, room tone — leaving `inset` seconds untouched either side of each word and ramping over `ramp`
seconds so nothing clicks. Rewrites data/vo.mp3 in place; the untouched version is kept as data/vo-ungated.mp3.
Prints the gaps it gated with the peak level found in each, so a breath that was there is on the record.
Faisal's note on PP01 (16 Sep 2026): "get rid of the breathing pauses or the slight inhales".
"""
import json, shutil, subprocess, sys
from pathlib import Path
import numpy as np

args = sys.argv[1:]
ep = Path(__file__).resolve().parent / args[0]
opt = lambda k, d: float(args[args.index(k) + 1]) if k in args else d
INSET, RAMP, FLOOR = opt('--inset', .06), opt('--ramp', .03), opt('--floor', 0.0)
# a gap whose peak is above MAX dBFS is speech Whisper timed a little late or early, not a breath: leave it alone
MAX = opt('--max', -18.0)
D = ep / 'data'; SR = 48000
if not (D / 'vo-ungated.mp3').exists():
    shutil.copy(D / 'vo.mp3', D / 'vo-ungated.mp3')
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(D / 'vo-ungated.mp3'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
y = np.frombuffer(raw, dtype=np.float32).copy()
words = json.loads((D / 'vo_words.json').read_text())
env = np.ones_like(y)
gated, skipped = [], []
for a, b in zip(words, words[1:]):
    s, e = a['e'] + INSET, b['s'] - INSET
    if e - s <= RAMP * 2:
        continue
    i0, i1 = int(s * SR), int(e * SR)
    r = int(RAMP * SR)
    peak = float(np.abs(y[i0:i1]).max()) if i1 > i0 else 0.0
    if 20 * np.log10(peak + 1e-9) > MAX:
        skipped.append((round(s, 2), round(e, 2), round(20 * np.log10(peak + 1e-9), 1)))
        continue
    env[i0:i0 + r] = np.minimum(env[i0:i0 + r], np.linspace(1, FLOOR, r))
    env[i0 + r:i1 - r] = FLOOR
    env[i1 - r:i1] = np.minimum(env[i1 - r:i1], np.linspace(FLOOR, 1, r))
    gated.append((round(s, 2), round(e, 2), round(20 * np.log10(peak + 1e-9), 1)))
out = (y * env).astype(np.float32)
subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '1', '-i', '-', '-c:a', 'libmp3lame', '-q:a', '2', str(D / 'vo.mp3')], input=out.tobytes(), check=True)
loud = [g for g in gated if g[2] > -40]
print(f"{len(gated)} gaps gated, {len(loud)} of them carried something above -40 dBFS (breaths, most likely):")
for s, e, p in loud:
    print(f"  {s:6.2f}-{e:6.2f}s  peak {p} dBFS")
print(f"{len(skipped)} gaps left alone (speech above {MAX} dBFS — a word edge, not a breath):")
for s, e, p in skipped:
    print(f"  {s:6.2f}-{e:6.2f}s  peak {p} dBFS")

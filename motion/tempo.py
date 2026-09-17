#!/usr/bin/env python3
"""Tempo of a bed without librosa: onset-strength autocorrelation over a spectral flux envelope.
   python3 motion/tempo.py <file.mp3>   -> prints bpm and the first strong onset (seconds)"""
import subprocess, sys, numpy as np
f = sys.argv[1]; sr = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
y = np.frombuffer(raw, dtype=np.float32)
hop, win = 256, 1024
frames = (len(y) - win) // hop
S = np.abs(np.fft.rfft(np.stack([y[i*hop:i*hop+win] * np.hanning(win) for i in range(frames)]), axis=1))
flux = np.maximum(0, np.diff(np.log1p(S), axis=0)).sum(axis=1)
flux = flux - np.convolve(flux, np.ones(32) / 32, 'same'); flux = np.maximum(flux, 0)
fps = sr / hop
lags = np.arange(int(fps * 60 / 200), int(fps * 60 / 60))
ac = np.array([np.dot(flux[:-l], flux[l:]) for l in lags])
best = lags[np.argmax(ac)]; bpm = 60 * fps / best
# refine by parabolic interpolation
i = np.argmax(ac)
if 0 < i < len(ac) - 1:
    d = (ac[i-1] - ac[i+1]) / (2 * (ac[i-1] - 2*ac[i] + ac[i+1])); bpm = 60 * fps / (lags[i] + d)
first = np.argmax(flux > flux.max() * .5) / fps
print(f"bpm {bpm:.2f}  first strong onset {first:.3f}s  beat {60/bpm:.4f}s")

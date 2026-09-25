"""Track the camera, not the hands: a smooth similarity transform per frame from the whole room.

python3 camera_track.py plate.mp4 out.json --exclude x0,y0,x1,y1

Corner features across the frame (the wall, the sofa, the shelf, the table), minus a box around the person, are
followed with pyramidal optical flow; each frame's similarity to frame 0 (shift, scale, rotation) comes from all of
them with RANSAC, then a Savitzky-Golay pass. Overlays pinned with this move exactly like the room during a push-in,
with none of the jitter a track of moving fingers gives.
"""
import cv2, numpy as np, json, argparse

ap = argparse.ArgumentParser(); ap.add_argument('plate'); ap.add_argument('out'); ap.add_argument('--exclude', required=True)
a = ap.parse_args(); ex = [int(v) for v in a.exclude.split(',')]
cap = cv2.VideoCapture(a.plate); frames = []
while True:
    ok, f = cap.read()
    if not ok: break
    frames.append(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY))
g0 = frames[0]; mask = np.full_like(g0, 255); mask[ex[1]:ex[3], ex[0]:ex[2]] = 0
p0 = cv2.goodFeaturesToTrack(g0, 1500, 0.005, 8, mask=mask)
A = [np.eye(3)]
for g in frames[1:]:
    p1, st, _ = cv2.calcOpticalFlowPyrLK(g0, g, p0, None, winSize=(31, 31), maxLevel=4,
                                         criteria=(cv2.TERM_CRITERIA_EPS | cv2.TERM_CRITERIA_COUNT, 50, 0.001))
    ok = st.ravel() == 1
    M, inl = cv2.estimateAffinePartial2D(p0[ok], p1[ok], method=cv2.RANSAC, ransacReprojThreshold=1.0, maxIters=5000)
    A.append(np.vstack([M, [0, 0, 1]]))
A = np.array(A)
s = np.hypot(A[:, 0, 0], A[:, 1, 0]); th = np.arctan2(A[:, 1, 0], A[:, 0, 0]); tx, ty = A[:, 0, 2], A[:, 1, 2]
def sg(x, w=9, p=2):
    h = w // 2; V = np.vander(np.arange(-h, h + 1), p + 1, increasing=True); c = np.linalg.pinv(V)[0]
    xp = np.pad(x, h, mode='reflect', reflect_type='odd'); return np.convolve(xp, c[::-1], 'valid')
out = {'scale': sg(s).tolist(), 'rot': sg(th).tolist(), 'tx': sg(tx).tolist(), 'ty': sg(ty).tolist()}
json.dump(out, open(a.out, 'w'))
print('frames', len(frames), 'scale', round(s[0], 4), '->', round(s[-1], 4), 'shift', round(tx[-1], 1), round(ty[-1], 1))

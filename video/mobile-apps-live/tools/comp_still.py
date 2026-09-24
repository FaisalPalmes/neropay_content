import cv2, numpy as np, sys

def key(img):
    f = img.astype(np.float32) / 255
    b, g, r = f[..., 0], f[..., 1], f[..., 2]
    k = g - np.maximum(r, b)                      # green dominance
    return np.clip((k - 0.12) / 0.18, 0, 1)       # 0 = not green, 1 = full green

def quad(img):
    m = (key(img) > 0.5).astype(np.uint8) * 255
    m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
    cs, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    c = max(cs, key=cv2.contourArea)
    pts = c.reshape(-1, 2).astype(np.float32)
    (cx, cy), (w, h), ang = cv2.minAreaRect(cv2.convexHull(c))
    t = np.deg2rad(ang)
    ux, vx = np.array([np.cos(t), np.sin(t)]), np.array([-np.sin(t), np.cos(t)])
    rel = pts - [cx, cy]
    u, v = rel @ ux, rel @ vx
    tol = 0.07 * min(w, h)
    lines = []
    # the four sides in order around the rect: +u, +v, -u, -v
    for axis, sign in [('u', 1), ('v', 1), ('u', -1), ('v', -1)]:
        a_, o_, half, ohalf = (u, v, w / 2, h / 2) if axis == 'u' else (v, u, h / 2, w / 2)
        sel = pts[(np.abs(a_ - sign * half) < tol) & (np.abs(o_) < 0.7 * ohalf)]
        vx_, vy_, x0, y0 = cv2.fitLine(sel, cv2.DIST_HUBER, 0, 0.01, 0.01).ravel()
        lines.append((np.array([x0, y0]), np.array([vx_, vy_])))
    Q = []
    for i in range(4):
        (p1, d1), (p2, d2) = lines[i - 1], lines[i]
        s = np.linalg.solve(np.array([d1, -d2]).T, p2 - p1)
        Q.append(p1 + s[0] * d1)
    Q = np.array(Q, np.float32)
    e = [np.linalg.norm(Q[(i + 1) % 4] - Q[i]) for i in range(4)]
    shorts = list(np.argsort(e)[:2])
    top = min(shorts, key=lambda i: Q[i][1] + Q[(i + 1) % 4][1])
    o = [Q[(top + k) % 4] for k in range(4)]
    d1, d2 = o[1] - o[0], o[2] - o[1]
    if d1[0] * d2[1] - d1[1] * d2[0] < 0:
        o = [o[1], o[0], o[3], o[2]]
    return np.array(o, np.float32)       # TL, TR, BR, BL

def comp(src, screen, out, radius=0.11, dim=0.94):
    img = cv2.imread(src)
    scr = cv2.imread(screen)
    Q = quad(img)
    Q = Q.mean(0) + (Q - Q.mean(0)) * 1.015   # overscan a touch so no green rim survives
    H, W = scr.shape[:2]
    a = np.zeros((H, W), np.uint8)
    r = int(radius * W)
    cv2.rectangle(a, (r, 0), (W - r, H), 255, -1)
    cv2.rectangle(a, (0, r), (W, H - r), 255, -1)
    for cx, cy in [(r, r), (W - r, r), (r, H - r), (W - r, H - r)]:
        cv2.circle(a, (cx, cy), r, 255, -1, cv2.LINE_AA)
    M = cv2.getPerspectiveTransform(np.float32([[0, 0], [W, 0], [W, H], [0, H]]), Q)
    size = (img.shape[1], img.shape[0])
    ws = cv2.warpPerspective(scr, M, size, flags=cv2.INTER_AREA)
    wa = cv2.warpPerspective(a, M, size) / 255.0
    k = cv2.GaussianBlur(key(img), (3, 3), 0)
    alpha = (k * wa)[..., None]
    base = img.astype(np.float32)
    # despill what stays (fingers, bezel edge) near the screen
    b, g, rr = base[..., 0], base[..., 1], base[..., 2]
    near = cv2.dilate((k > 0.02).astype(np.uint8), np.ones((15, 15), np.uint8)).astype(bool)
    base[..., 1] = np.where(near, np.minimum(g, np.maximum(rr, b) * 1.02), g)
    res = base * (1 - alpha) + ws.astype(np.float32) * dim * alpha
    cv2.imwrite(out, np.clip(res, 0, 255).astype(np.uint8), [cv2.IMWRITE_JPEG_QUALITY, 92])
    print(out, Q.round(1).tolist())

if __name__ == '__main__':
    comp(sys.argv[1], sys.argv[2], sys.argv[3])

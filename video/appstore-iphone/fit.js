/* The store formats, shared by the stills page (stills/index.html) and the video (index.html, ipad.html, play.html).
   Everything is laid out once in the iPhone carousel's 660 x 1434; another store's canvas refits it:
   the copy scales by K from the top left; the ground scales to cover; the art (hands, phone, glass) scales and moves
   so that it starts just under the copy, and so that wherever a hand leaves its photograph the photograph's edge
   stays off the canvas (a cut-out arm must never end in mid-air). */
window.FMTS = {
  iphone: { W:660,  H:1434, K:1,    px:[1320, 2868], video:[886, 1920]  },   /* App Store 6.9" */
  ipad:   { W:1032, H:1376, K:1.22, px:[2064, 2752], video:[1200, 1600] },   /* App Store iPad 13" */
  play:   { W:810,  H:1440, K:1.1,  px:[1080, 1920], video:[1080, 1920] }    /* Google Play phone, 9:16 */
};

/* which edges of each photograph a hand crosses (measured from the cut-outs' alpha, 23 Sep 2026) */
const TOUCH = { hero:{ l:1, r:1 }, pos:{ l:1, r:1, b:1 }, reports:{ b:1 }, links:{ l:1, r:1, b:1 } };

/* the bottom of each slide's copy block on the 660 x 1434 frame, measured with Poppins loaded (23 Sep 2026). A table,
   not a measurement at load time, so the page and the video fit identically whether or not the font has arrived */
window.COPYB = { 1:332, 2:386, 3:386, 4:386, 5:386, 6:386, 7:332 };

/* a photo slide's placement on the 660 x 1434 frame, exactly as stills/index.html photoSlide() computes it */
window.photoPlace = name => {
  const Q = PHOTOQ[name].quad;
  const top = Math.min(Q.tl[1], Q.tr[1]), bot = Math.max(Q.bl[1], Q.br[1]);
  const s = Math.max(640 / (bot - top), 954 / (2000 - top) + .005);
  const cx = (Q.tl[0] + Q.tr[0] + Q.br[0] + Q.bl[0]) / 4;
  return { s, ox: 330 - cx * s, oy: 480 - top * s, top, bot };
};

/* the art's extent on the 660 x 1434 frame, by stills slide number (1…7) */
window.artGeo = n => {
  if (n === 1 || n === 7) return { L:-70, R:730, top:350, bot:1010, img:1434, ...TOUCH.hero };
  if (n === 2) return { L:65, R:595, top:486, bot:1405, img:1405, glass:1 };
  if (n === 4) return { L:58, R:602, top:486, bot:1418, img:1418, glass:1 };
  const name = { 3:'pos', 5:'reports', 6:'links' }[n], p = photoPlace(name);
  return { L:p.ox, R:p.ox + 1116*p.s, top:470, bot:p.oy + p.bot*p.s + 12, img:p.oy + 2000*p.s, ...TOUCH[name] };
};

/* where the art goes on a format's canvas: returns the transform for a 660 x 1434 box (origin top left) */
window.fitArt = (fmt, g, copyBottom) => {
  const F = FMTS[fmt];
  if (fmt === 'iphone') return { A:1, tx:0, ty:0 };
  let Yt = copyBottom + 34 * F.K, A;
  if (g.glass) A = Math.min((F.H - 34 - Yt) / (g.bot - g.top), (F.W - 60) / (g.R - g.L));
  else A = (F.H * 0.80 - Yt) / (g.bot - g.top);                     /* the phone ends about where it does on the iPhone */
  const need = (g.l && g.r) ? F.W / (g.R - g.L) + 0.02 : 0;         /* both sides bleed: the photograph must span the canvas */
  A = Math.max(A, need);
  let dx = 0;
  const lo = g.r ? F.W / 2 - (g.R - 330) * A + 2 : -Infinity;       /* right bleed: the right edge stays past the canvas */
  const hi = g.l ? -F.W / 2 - (g.L - 330) * A - 2 : Infinity;       /* left bleed: the left edge stays before it */
  dx = Math.min(Math.max(0, lo), hi);
  if (g.b && (g.img - g.top) * A + Yt < F.H + 2) Yt = F.H + 2 - (g.img - g.top) * A;
  return { A, tx: F.W / 2 + dx - 330 * A, ty: Yt - g.top * A };
};

/* the ground: scaled to cover the canvas, kept to its top so the corner behind the copy stays pale */
window.fitGround = fmt => { const F = FMTS[fmt], S = Math.max(F.W / 660, F.H / 1434);
  return { S, tx: (F.W - 660 * S) / 2 }; };

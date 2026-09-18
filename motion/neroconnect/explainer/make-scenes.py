#!/usr/bin/env python3
"""v2 — writes the scene overlays for the NeroConnect explainer into scenes/, plus data/timeline.js (the film's words and
scene starts, which every scene reads) and data/scenes.json (the edit list build.mjs renders from).

    python3 make-scenes.py

Each scene is one self-contained HTML (glass.css, the fonts, timeline.js and terminal.png are the only external files)
exposing setFrame(n) at 25 fps. v2 (Faisal's notes of 18 Sep 2026 on the first draft): the whole scene sits in a 3D
camera that pushes in on the thing she is talking about, on her words (CAM keyframes anchored with at('phrase')); the
element in focus lifts and brightens; captions are drawn in the scene, grey with the spoken word in ink, placed per scene;
three soft lights (yellow, blue, pink) drift on their own paths; the glass rim is gentler; every scene flies in and out
so the film reads as one 3D space; the close carries the terminal, the socials and the link.

Every figure on screen is one of the seven Faisal approved in the kit's five overlays (£1,842.60 · 61 · £41.20 · £22.85 ·
£18.35 · 37 · £2,418.36) or a name from data.json. Nothing else is a number.
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'data.json'))); M = D['merchants']; P = D['platform']
WORDS = json.load(open(os.path.join(HERE, 'data', 'vo_words.json')))
HEAD, LEAD, TAIL, FPS = 0.6, 0.3, 2.6, 25

# ---- the timeline: sixteen scenes cut at sentence boundaries of the take -------------------------------------------
norm = lambda s: ''.join(c for c in s.lower() if c.isalnum())
def find(phrase, last=False):
    ws = [norm(x) for x in phrase.split()]
    hits = [i for i in range(len(WORDS) - len(ws) + 1) if all(norm(WORDS[i + k]['w']) == ws[k] for k in range(len(ws)))]
    if not hits: raise SystemExit('no such words in the take: ' + phrase)
    return hits[-1] if last else hits[0]
STARTS = [find("So you've"), find("There are three"), find("Everything lives"), find("And when something"), find("Every merchant on"), find("Adding one"),
          find("Now pricing"), find("And it's simple"), find("There's a floor"), find("Your logo"), find("Terminals"), find("Reports show"),
          find("And how it"), find("Your balance"), find("Support comes"), find("Your merchants", last=True)]
FILES = ['s01-open', 's02-three-parties', 's03-dashboard', 's04-attention', 's05-register', 's06-five-steps', 's07-who-sets-what', 's08-margin',
         's09-floor', 's10-branding', 's11-store', 's12-reports', 's13-trend', 's14-wallet', 's15-support', 's16-close']
ARCH = ['v2 tilted panel', 'v4 cascade', 'v2 tilted panel (approved, rebuilt neat)', 'v5 row stack', 'v2 tilted panel', 'v4 cascade', 'v6 floating form',
        'v4 cascade (approved)', 'v1 hero pill', 'v6 floating form', 'v2 tilted panel', 'm18 ledger tiles (approved)', 'v3 chart card (approved)', 'v1 hero pill', 'v5 row stack', 'v1 hero pill + terminal']
SC = []
for k, i in enumerate(STARTS):
    j = STARTS[k + 1] - 1 if k + 1 < len(STARTS) else len(WORDS) - 1
    start = 0 if k == 0 else round(HEAD + WORDS[i]['s'] - LEAD, 3)
    SC.append({'scene': k + 1, 'file': FILES[k] + '.html', 'archetype': ARCH[k], 'start': start, 'first': i, 'last_word': j,
               'vo': ' '.join(x['w'] for x in WORDS[i:j + 1]), 'vo_in': round(HEAD + WORDS[i]['s'], 3), 'vo_out': round(HEAD + WORDS[j]['e'], 3)})
for k in range(len(SC)):
    SC[k]['end'] = SC[k + 1]['start'] if k + 1 < len(SC) else round(HEAD + WORDS[-1]['e'] + TAIL, 3)
    SC[k]['frames'] = round((SC[k]['end'] - SC[k]['start']) * FPS)
SC[-1]['last'] = True; SC[-1]['hardcut'] = True
for a, b in zip(ARCH, ARCH[1:]): assert a.split(' (')[0].split(' +')[0] != b.split(' (')[0].split(' +')[0], (a, b)
os.makedirs(os.path.join(HERE, 'data'), exist_ok=True); os.makedirs(os.path.join(HERE, 'scenes'), exist_ok=True)
json.dump({'fps': FPS, 'head': HEAD, 'vo': 'data/vo-master.mp3', 'scenes': SC}, open(os.path.join(HERE, 'data', 'scenes.json'), 'w'), indent=1, ensure_ascii=False)
open(os.path.join(HERE, 'data', 'timeline.js'), 'w').write('window.HEAD=%s;window.WORDS=%s;window.SCENES=%s;\n' % (HEAD, json.dumps(WORDS, ensure_ascii=False, separators=(',', ':')), json.dumps([{k: v for k, v in s.items() if k in ('scene', 'start', 'end', 'frames', 'first', 'last_word')} for s in SC], separators=(',', ':'))))

# ---- the common frame ------------------------------------------------------------------------------------------------
FILTER = '''<svg width="0" height="0" style="position:absolute"><filter id="rimbend" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="1" seed="3" result="n"/>
<feGaussianBlur in="n" stdDeviation="3" result="nb"/>
<feDisplacementMap in="SourceGraphic" in2="nb" scale="9" xChannelSelector="R" yChannelSelector="G"/>
<feGaussianBlur stdDeviation="1.4"/></filter></svg>'''

COMMON_CSS = '''
/* v2: the camera, the three lights, the captions, the focus lift */
.cam{position:absolute;inset:0;perspective:2600px;perspective-origin:50% 50%;overflow:hidden}
.world{position:absolute;inset:0;transform-origin:0 0;transform-style:preserve-3d;will-change:transform}
.light{opacity:.42;filter:blur(170px)}
.light.y{background:radial-gradient(circle,rgba(251,197,15,.72) 0%,rgba(251,197,15,.30) 34%,rgba(251,197,15,0) 66%)}
.light.b{width:1300px;height:1300px;opacity:.26;background:radial-gradient(circle,rgba(118,160,255,.62) 0%,rgba(118,160,255,.22) 36%,rgba(118,160,255,0) 66%)}
.light.p{width:1100px;height:1100px;opacity:.22;background:radial-gradient(circle,rgba(255,140,196,.6) 0%,rgba(255,140,196,.2) 36%,rgba(255,140,196,0) 66%)}
.glass.liquid::after{box-shadow:0 0 0 1px rgba(11,18,32,.06),0 0 0 3px rgba(255,255,255,.22)}
.rim{padding:16px}
.hot{background:rgba(255,255,255,.80) !important}
.caps{position:absolute;z-index:60;left:120px;top:900px;width:1400px;font-size:34px;font-weight:600;line-height:1.28;letter-spacing:-.012em;color:rgba(11,18,32,.26);text-wrap:balance}
.caps.it{font-style:italic;font-weight:500}
.caps.big{font-size:44px}
.caps.sm{font-size:28px}
.caps.c{text-align:center}
.caps.r{text-align:right}
.caps .ln{display:inline;background:rgba(251,250,247,.78);box-shadow:0 0 0 .34em rgba(251,250,247,.78);border-radius:.14em;box-decoration-break:clone;-webkit-box-decoration-break:clone}
.caps .w{display:inline-block;padding:0 .04em;margin:0 -.04em;border-radius:.1em;transform-origin:50% 70%}
.caps .w.on{color:var(--ink)}
.caps .w.past{color:rgba(11,18,32,.5)}
'''

HEAD_T = '''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../glass/glass.css">
<style>
/* @@TITLE@@ */
@@COMMON@@
@@CSS@@
</style></head><body>
<div class="stage">@@FILTER@@
  <div class="grid"></div>
  <div class="light y"></div><div class="light b"></div><div class="light p"></div>
  <div class="cam"><div class="world">
@@HTML@@
  </div></div>
  <div class="caps @@CAPCLS@@" id="caps" style="@@CAPSTYLE@@"></div>
</div>
<script src="../data/timeline.js"></script>
<script>
const SCENE=@@SCENE@@; const SCN=SCENES[SCENE-1]; const F0=SCN.start, NF=SCN.frames;
const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
const ein=t=>{t=Math.max(0,Math.min(1,t));return t*t*t};
const eio=t=>{t=Math.max(0,Math.min(1,t));return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const seg=(n,a,d)=>Math.max(0,Math.min(1,(n-a)/d));
const fmt=v=>'£'+v.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').replace(/[^a-z0-9]/g,'');
function findW(p,nth=0){const ws=p.split(' ').map(norm);let h=0;for(let i=SCN.first;i+ws.length-1<=SCN.last_word;i++){let ok=true;for(let k=0;k<ws.length;k++){const W=WORDS[i+k].w; if(norm(W)!==ws[k]&&norm(W.replace(/['\u2019].*$/,''))!==ws[k]){ok=false;break}}if(ok){if(h===nth)return i;h++}}throw new Error('no words in this scene: '+p)}
const fr=t=>Math.round((HEAD+t-F0)*25);
const at=(p,n=0)=>fr(WORDS[findW(p,n)].s), endAt=(p,n=0)=>fr(WORDS[findW(p,n)+p.split(' ').length-1].e);
/* lights: three, each on its own slow loop, seeded per scene so no two scenes drift the same way */
const LS=[@@LIGHTS@@];
function lights(n){ document.querySelectorAll('.light').forEach((l,k)=>{const L=LS[k]; const a=n/L.T*Math.PI*2+L.ph; l.style.transform=`translate(${(L.x+Math.cos(a)*L.rx).toFixed(1)}px,${(L.y+Math.sin(a*.8)*L.ry).toFixed(1)}px)`; l.style.opacity=L.o;}); }
/* the camera: keyframes [frame, targetSelector|null, zoom]; the world moves to centre the target over 24 frames */
const CAM=[@@CAM@@]; const CT={};
function measure(){ CAM.forEach(k=>{ if(k[1]&&!CT[k[1]]){ const el=document.querySelector(k[1]); if(!el){CT[k[1]]={x:960,y:540};return} const r=el.getBoundingClientRect(); const s=document.querySelector('.stage').getBoundingClientRect(); const sc=1920/s.width; CT[k[1]]={x:(r.left+r.width/2-s.left)*sc,y:(r.top+r.height/2-s.top)*sc}; } }); }
function camAt(n){ let cur={x:960,y:540,z:1,t:null}, prev=null, kf=null, kprev=null;
  for(const k of CAM){ if(n>=k[0]){ kprev=kf; kf=k; } }
  if(!kf) return cur;
  const to=kf[1]?{...CT[kf[1]],z:kf[2],t:kf[1]}:{x:960,y:540,z:kf[2]||1,t:null};
  const from=kprev?(kprev[1]?{...CT[kprev[1]],z:kprev[2]}:{x:960,y:540,z:kprev[2]||1}):{x:960,y:540,z:1};
  const p=eio(seg(n,kf[0],kf[3]||24));
  return {x:from.x+(to.x-from.x)*p,y:from.y+(to.y-from.y)*p,z:from.z+(to.z-from.z)*p,t:to.t,p};
}
function base(n){
  lights(n);
  const c=camAt(n);
  /* the fly in and out: the scene comes up out of the space and leaves into it */
  const fi=ease(seg(n,0,18)), fo=ein(seg(n,NF-12,12));
  const z=c.z*(.9+.1*fi)*(1+.07*fo), dy=(1-fi)*70+fo*-30;
  const ry=(960-c.x)/960*2.2, rx=(c.y-540)/540*1.4;
  document.querySelector('.world').style.transform=`translate(960px,${540+dy}px) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) scale(${z.toFixed(4)}) translate(${(-c.x).toFixed(1)}px,${(-c.y).toFixed(1)}px)`;
  document.querySelector('.world').style.opacity=Math.min(1,fi*1.5).toFixed(3);
  document.querySelectorAll('.hot').forEach(e=>e.classList.remove('hot'));
  if(c.t){ const el=document.querySelector(c.t); if(el){ el.classList.add('hot'); el.dataset.hot=(c.p===undefined?1:c.p); } }
  document.querySelectorAll('.in').forEach(el=>{const i=+el.dataset.i; const t=ease((n-(4+i*@@STAG@@))/20); const h=el.classList.contains('hot')?1+.035*(+el.dataset.hot||1):1;
    el.style.opacity=t; el.style.transform=(el.dataset.tf||'')+` translateY(${28*(1-t)}px) scale(${(.985+.015*t)*h})`;});
  document.querySelectorAll('[data-n]').forEach(el=>{const i=+el.closest('.in').dataset.i; const t=ease((n-(4+i*@@STAG@@+9))/28);
    el.textContent=el.dataset.int?Math.round(+el.dataset.n*t).toString():fmt(+el.dataset.n*t);});
  captions(n);
}
/* captions: this scene's words, in lines of up to six broken at punctuation; the line being said shows, grey, the word
   being said in ink, said words a shade darker */
const LINES=(()=>{const L=[];let cur=[];for(let i=SCN.first;i<=SCN.last_word;i++){cur.push(i);const w=WORDS[i].w;if((/[.,?!:;]$/.test(w)&&cur.length>=3)||cur.length>=6){L.push(cur);cur=[]}}if(cur.length){if(L.length&&cur.length<=2)L[L.length-1].push(...cur);else L.push(cur)}return L})();
const capEl=document.getElementById('caps');
capEl.innerHTML=LINES.map((l,k)=>`<div class="ln" data-k="${k}" style="display:none">${l.filter(i=>WORDS[i].w).map(i=>`<span class="w" data-i="${i}">${WORDS[i].w}</span>`).join(' ')}</div>`).join('');
function captions(n){ const t=F0+n/25-HEAD; let ci=-1; for(let i=SCN.first;i<=SCN.last_word;i++){ if(t>=WORDS[i].s-.05) ci=i; else break; }
  let li=-1; LINES.forEach((l,k)=>{ if(ci>=l[0]) li=k; }); if(ci<0) li=(t>=WORDS[SCN.first].s-.6)?0:-1;
  const lastEnd=WORDS[SCN.last_word].e+.9; if(t>lastEnd) li=-1;
  capEl.querySelectorAll('.ln').forEach((ln,k)=>{ ln.style.display=k===li?'block':'none'; });
  if(li<0) return; const ln=capEl.querySelector(`.ln[data-k="${li}"]`); const lstart=WORDS[LINES[li][0]].s-.05; const p=ease((t-lstart)/.2);
  ln.style.opacity=p.toFixed(3); ln.style.transform=`translateY(${((1-p)*10).toFixed(1)}px)`;
  ln.querySelectorAll('.w').forEach(sp=>{const i=+sp.dataset.i; const on=i===ci||(i<ci&&!WORDS[ci].w&&!WORDS.slice(i+1,ci+1).some(x=>x.w)); sp.className='w'+(on?' on':(i<ci?' past':'')); sp.style.transform=on?`scale(${(1.08-.08*ease((t-WORDS[i].s)/.14)).toFixed(3)})`:'';});
}
function setFrame(n){ base(n); @@EXTRA@@ }
/* measure the camera targets once, in the settled state, with the camera at rest */
CAM.length=0; setFrame(200); CAM.push(...[@@CAM@@]); measure(); setFrame(300);
</script></body></html>
'''

def eyebrow(sec): return f'<div class="eyebrow"><b>NeroConnect</b> &nbsp;·&nbsp; {sec}</div>'

def write(k, title, css, html, cam, extra='', lights=None, caps=None, stag=6):
    """k: scene number (1-based). cam: list of (frame_expr, selector|None, zoom, dur?). lights: three dicts. caps: (cls, style)."""
    L = lights or [dict(x=-700, y=-900, rx=180, ry=120, T=210, ph=0, o=.42), dict(x=1250, y=520, rx=160, ry=140, T=260, ph=1.7, o=.26), dict(x=300, y=700, rx=220, ry=90, T=300, ph=3.1, o=.2)]
    ls = ','.join('{x:%s,y:%s,rx:%s,ry:%s,T:%s,ph:%s,o:%s}' % (d['x'], d['y'], d['rx'], d['ry'], d['T'], d['ph'], d['o']) for d in L)
    camjs = ','.join('[%s,%s,%s%s]' % (c[0], 'null' if c[1] is None else "'%s'" % c[1], c[2], (',%s' % c[3]) if len(c) > 3 else '') for c in cam)
    cls, style = caps or ('', '')
    out = (HEAD_T.replace('@@TITLE@@', title).replace('@@COMMON@@', COMMON_CSS).replace('@@CSS@@', css).replace('@@FILTER@@', FILTER).replace('@@HTML@@', html)
           .replace('@@CAPCLS@@', cls).replace('@@CAPSTYLE@@', style).replace('@@SCENE@@', str(k)).replace('@@LIGHTS@@', ls).replace('@@CAM@@', camjs)
           .replace('@@STAG@@', str(stag)).replace('@@EXTRA@@', extra))
    open(os.path.join(HERE, 'scenes', FILES[k - 1] + '.html'), 'w').write(out)

# ---- archetype css --------------------------------------------------------------------------------------------------
PANEL_CSS = '''
.scene{position:absolute;inset:0;perspective:2600px;perspective-origin:@@PO@@}
.panel{position:absolute;left:@@PX@@px;top:@@PY@@px;width:@@PW@@px;transform-style:preserve-3d;transform:rotateY(@@RY@@deg) rotateX(@@RX@@deg) rotateZ(@@RZ@@deg) translateZ(-120px)}
.title{position:absolute;left:120px;top:96px;width:440px}
.title .h1{font-size:@@HS@@px;margin-top:20px}
.title .sub{margin-top:18px;font-size:22px}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:440px;line-height:1.5}
'''
def panel_css(po, px, py, pw, ry, rx, rz, hs, more=''):
    return PANEL_CSS.replace('@@PO@@', po).replace('@@PX@@', str(px)).replace('@@PY@@', str(py)).replace('@@PW@@', str(pw)).replace('@@RY@@', str(ry)).replace('@@RX@@', str(rx)).replace('@@RZ@@', str(rz)).replace('@@HS@@', str(hs)) + more
def panel_extra(ry, rx, rz, loop=200):
    return "const p=eio((n%%%d)/%d); document.querySelector('.panel').style.transform=`rotateY(${%s+p*4}deg) rotateX(${%s-p*2}deg) rotateZ(%sdeg) translateZ(-120px)`;" % (loop, loop, ry, rx, rz)

CASCADE_CSS = '''
.scene{position:absolute;inset:0;perspective:2400px;perspective-origin:@@PO@@}
.stack{position:absolute;left:@@SX@@px;top:@@SY@@px;transform-style:preserve-3d;transform:rotateY(@@RY@@deg) rotateX(@@RX@@deg)}
.c{position:absolute;padding:34px 40px;display:flex;flex-direction:column;justify-content:space-between}
.c .lbl{font-size:26px;font-weight:600;color:var(--ink)}
.c .sub{font-size:20px;margin-top:10px}
.c .big{font-size:40px;font-weight:600;letter-spacing:-.02em;line-height:1.1}
.op{position:absolute;width:96px;height:96px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:600;color:var(--ink);background:rgba(255,255,255,.7)}
.op.eq{background:var(--yel)}
.title{position:absolute;left:120px;top:96px;width:460px}
.title .h1{font-size:@@HS@@px;margin-top:20px}
.title .sub{margin-top:18px;font-size:22px}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:440px;line-height:1.5}
'''
def cascade_css(po, sx, sy, ry, rx, hs, more=''):
    return CASCADE_CSS.replace('@@PO@@', po).replace('@@SX@@', str(sx)).replace('@@SY@@', str(sy)).replace('@@RY@@', str(ry)).replace('@@RX@@', str(rx)).replace('@@HS@@', str(hs)) + more
def cascade_extra(ry, rx, loop=220, slide=0):
    return "const p=eio((n%%%d)/%d); document.querySelector('.stack').style.transform=`rotateY(${%s+p*5}deg) rotateX(${%s-p*2}deg) translateX(${%s*ease(seg(n,60,80))}px)`;" % (loop, loop, ry, rx, slide)

ROW_CSS = '''
.title{position:absolute;left:120px;top:96px;width:520px}
.title .h1{font-size:54px;margin-top:20px}
.title .sub{margin-top:18px;font-size:22px}
.scene{position:absolute;inset:0;perspective:2600px;perspective-origin:70% 50%}
.rows{position:absolute;left:720px;top:150px;width:1080px;transform-style:preserve-3d;transform:rotateY(-12deg) rotateX(5deg)}
.row{display:grid;align-items:center;padding:26px 36px;height:118px;margin-bottom:22px;gap:26px;transform-style:preserve-3d}
.row .who{font-size:26px;font-weight:600;color:var(--ink)}
.row .meta{font-size:19px;color:var(--mut);margin-top:6px}
.row .r{justify-self:end;text-align:right}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:520px;line-height:1.5}
.kv{font-size:19px;color:var(--ink2)}
'''
FORM_CSS = '''
.title{position:absolute;left:120px;top:96px;width:560px}
.title .h1{font-size:54px;margin-top:20px}
.title .sub{margin-top:18px;font-size:22px}
.scene{position:absolute;inset:0;perspective:2400px;perspective-origin:65% 45%}
.ctl{position:absolute;padding:28px 34px;transform-style:preserve-3d}
.ctl .lbl{font-size:20px;color:var(--mut);font-weight:500}
.ctl .val{font-size:30px;font-weight:600;color:var(--ink);margin-top:8px;font-variant-numeric:tabular-nums}
.ctl .ro{display:inline-flex;align-items:center;gap:8px;margin-top:14px;font-size:16px;color:var(--mut)}
.ctl .ro i{width:10px;height:10px;border-radius:50%;background:rgba(11,18,32,.25)}
.tog{display:inline-flex;align-items:center;gap:16px;font-size:24px;font-weight:600}
.tog .sw{width:74px;height:40px;border-radius:20px;background:var(--yel);position:relative;box-shadow:0 0 0 1px rgba(11,18,32,.06) inset}
.tog .sw i{position:absolute;top:4px;left:38px;width:32px;height:32px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(11,18,32,.25)}
.tog .sw.off{background:rgba(11,18,32,.12)} .tog .sw.off i{left:4px}
.url{font-size:28px;font-weight:600;letter-spacing:-.01em}
.url b{font-weight:600;color:var(--mut)}
.dns{display:grid;grid-template-columns:110px 1fr;gap:10px 22px;font-size:19px;color:var(--ink2)}
.dns b{color:var(--ink);font-weight:600}
.field{margin-top:10px}
.field .box{height:64px;border-radius:16px;background:rgba(255,255,255,.7);box-shadow:0 0 0 1.5px rgba(11,18,32,.08) inset;display:flex;align-items:center;padding:0 22px;font-size:24px;color:var(--ink);font-weight:500}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:520px;line-height:1.5}
'''
HERO_CSS = '''
.bgcards{position:absolute;inset:0;perspective:2200px}
.bg{position:absolute;padding:34px 40px;width:520px;height:250px;filter:blur(var(--b,6px));opacity:.9}
.bg .lbl{font-size:22px}.bg .num{font-size:60px;margin-top:10px}.bg .sub{font-size:18px;margin-top:22px}
.bg .big{font-size:34px;font-weight:600;margin-top:12px;letter-spacing:-.02em}
.b1{left:110px;top:120px;transform:rotateY(14deg) rotateX(4deg) translateZ(-260px)}
.b2{left:1300px;top:150px;transform:rotateY(-16deg) rotateX(6deg) translateZ(-320px)}
.b3{left:40px;top:720px;transform:rotateY(12deg) rotateX(-6deg) translateZ(-200px)}
.b4{left:1500px;top:730px;transform:rotateY(-14deg) rotateX(-5deg) translateZ(-240px)}
.hero{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:@@PW@@px;height:300px;border-radius:150px;display:flex;align-items:center;justify-content:center;gap:48px;padding:0 70px}
.hero .num{font-size:@@NS@@px;letter-spacing:-.045em}
.hero .side{display:flex;flex-direction:column;gap:10px}
.hero .side .lbl{font-size:30px;font-weight:600;color:var(--ink)}
.hero .side .sub{font-size:22px;max-width:380px}
.hero.glass{background:rgba(255,255,255,.58);-webkit-backdrop-filter:blur(34px) saturate(180%);backdrop-filter:blur(34px) saturate(180%)}
.hero.glass::after{box-shadow:0 0 0 1.5px rgba(255,255,255,.9),0 0 0 2.5px rgba(11,18,32,.06)}
.cap{position:absolute;left:50%;transform:translateX(-50%);top:790px;text-align:center;width:540px}
.cap .eyebrow{margin-bottom:12px}
.cap .sub{font-size:22px;line-height:1.35}
.orb{position:absolute;width:260px;height:260px;border-radius:50%;left:1440px;top:420px;background:rgba(255,255,255,.35);-webkit-backdrop-filter:blur(8px) saturate(200%);backdrop-filter:blur(8px) saturate(200%);box-shadow:0 30px 60px -20px rgba(11,18,32,.25),0 1px 0 rgba(255,255,255,.9) inset}
.orb::before{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.9),rgba(255,255,255,0) 55%)}
.orb.s{width:120px;height:120px;left:300px;top:560px}
'''
def hero_css(pw, ns, more=''): return HERO_CSS.replace('@@PW@@', str(pw)).replace('@@NS@@', str(ns)) + more
HERO_EXTRA = "document.querySelectorAll('.orb').forEach((o,k)=>o.style.transform=`translateY(${Math.sin(n/40+k)*14}px)`); const h=document.querySelector('.hero'); const t=ease(seg(n,28,24)); h.style.transform=`translate(-50%,-50%) scale(${.94+.06*t})`; h.style.opacity=t; document.querySelectorAll('.bg').forEach((b,k)=>{const bb=+b.dataset.b; b.style.filter=`blur(${bb}px)`; b.style.transform=b.dataset.tf+` translateY(${(Math.sin(n/55+k*1.4)*10).toFixed(1)}px)`;});"

def rows_html(sec, h1, sub, rows, foot, cols):
    html = f'<div class="title in" data-i="0">{eyebrow(sec)}<div class="h1">{h1}</div><div class="sub">{sub}</div></div>\n<div class="scene"><div class="rows">\n'
    for k, r in enumerate(rows):
        html += f'<div class="glass liquid row in" id="row{k}" data-i="{k+1}" style="grid-template-columns:{cols}"><div class="rim"></div>{r}</div>\n'
    return html + f'</div></div>\n<div class="foot in" data-i="{len(rows)+1}">{foot}</div>'
ROWS_EXTRA = "const p=eio((n%210)/210); document.querySelector('.rows').style.transform=`rotateY(${-12+p*4}deg) rotateX(${5-p*2}deg)`;"

def form_html(sec, h1, sub, ctls, foot):
    html = f'<div class="title in" data-i="0">{eyebrow(sec)}<div class="h1">{h1}</div><div class="sub">{sub}</div></div>\n<div class="scene">\n'
    for k, (style, tf, inner, deep) in enumerate(ctls):
        html += f'<div class="glass liquid ctl in{" deep" if deep else ""}" id="ctl{k}" data-i="{k+1}" style="{style}" data-tf="{tf}"><div class="rim"></div>{inner}</div>\n'
    return html + f'</div>\n<div class="foot in" data-i="{len(ctls)+1}">{foot}</div>'
FORM_EXTRA = "document.querySelectorAll('.ctl').forEach((c,k)=>{const b=Math.sin(n/38+k*1.3)*6; c.style.transform+=` translateY(${b}px)`;});"

def hero_html(bgs, num, lbl, sub, cap_sec, cap_sub, pw, count=True, orb_left=1440):
    bg = ''.join(f'<div class="glass bg b{k+1} in" id="bg{k+1}" data-i="{k}" data-b="{b}" data-tf="{tf}">{inner}</div>' for k, (b, tf, inner) in enumerate(bgs))
    numhtml = f'<div class="num"{" data-n=%s" % num[1] if count else ""}>{num[0]}</div>' if num else ''
    return f'''<div class="bgcards">{bg}</div>
<div class="orb" style="left:{orb_left}px"></div><div class="orb s"></div>
<div class="glass liquid hero in" id="hero" data-i="4"><div class="rim"></div><div class="drop" style="width:26px;height:26px;left:120px;top:38px"></div>
{numhtml}<div class="side"><div class="lbl">{lbl}</div><div class="sub">{sub}</div></div></div>
<div class="cap in" data-i="5">{eyebrow(cap_sec)}<div class="sub">{cap_sub}</div></div>'''
BGTF = ['rotateY(14deg) rotateX(4deg) translateZ(-260px)', 'rotateY(-16deg) rotateX(6deg) translateZ(-320px)', 'rotateY(12deg) rotateX(-6deg) translateZ(-200px)', 'rotateY(-14deg) rotateX(-5deg) translateZ(-240px)']

# ---- scenes -----------------------------------------------------------------------------------------------------------
def s01():
    css = panel_css('72% 45%', 880, 150, 620, -22, 8, 1.5, 58, '''
.menu{padding:34px 36px}
.menu .hd{font-size:18px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:18px}
.menu .it{display:flex;align-items:center;gap:18px;height:64px;padding:0 18px;border-radius:16px;font-size:24px;font-weight:500;color:var(--ink2)}
.menu .it.on{background:var(--navy);color:#fff;font-weight:600}
.menu .it i{width:12px;height:12px;border-radius:50%;background:rgba(11,18,32,.18)} .menu .it.on i{background:var(--yel)}
.brand{position:absolute;left:120px;top:560px;width:460px;padding:30px 34px}
.brand .lbl{font-size:18px;color:var(--mut)} .brand .nm{font-size:34px;font-weight:600;margin-top:8px;letter-spacing:-.02em}
.brand .dom{font-size:20px;color:var(--ink2);margin-top:6px}
.mark{position:absolute;left:-230px;top:40px;width:150px;height:150px;border-radius:44px;background:var(--navy);display:flex;align-items:center;justify-content:center;color:#fff;font-size:44px;font-weight:700;letter-spacing:-.03em;transform:translateZ(200px);box-shadow:0 40px 80px -30px rgba(11,18,32,.5)}
.mark b{color:var(--yel);font-weight:700}
''')
    items = ['Dashboard', 'Connected accounts', 'Orders', 'Reports', 'Support', 'Logs', 'API logs', 'Rewards', 'Settings']
    menu = ''.join(f'<div class="it{" on" if k == 0 else ""}" id="mi{k}"><i></i>{t}</div>' for k, t in enumerate(items))
    html = f'''<div class="title in" id="ttl" data-i="0">{eyebrow('Overview')}<div class="h1">One platform. Your merchants. Your brand.</div><div class="sub">Card payments for the businesses you look after, run under your name.</div></div>
<div class="glass liquid brand in" id="brand" data-i="1"><div class="rim"></div><div class="lbl">Your platform</div><div class="nm">{P['name']}</div><div class="dom">{P['domain']}</div></div>
<div class="scene"><div class="panel"><div class="glass liquid menu in" id="menu" data-i="2"><div class="rim"></div><div class="hd">NeroConnect</div>{menu}</div>
<div class="mark in" data-i="3">N<b>C</b></div></div></div>
<div class="foot in" data-i="4">Nine screens. One estate. Yours.</div>'''
    cam = [("at('So')", None, 1), ("at('NeroConnect')", '#menu', 1.28, 30), ("at('under')", '#brand', 1.3, 26), ("at('Here')", None, 1.04, 30)]
    extra = panel_extra(-22, 8, 1.5) + " const on=at('run'); document.querySelectorAll('.menu .it').forEach((it,k)=>{const q=ease(seg(n,on+k*3,10)); it.style.opacity=(.35+.65*q).toFixed(2);});"
    write(1, 'S1 open — the menu as a tilted panel', css, html, cam, extra,
          lights=[dict(x=1000, y=300, rx=160, ry=120, T=220, ph=0, o=.4), dict(x=-500, y=-500, rx=140, ry=160, T=270, ph=2, o=.24), dict(x=600, y=900, rx=260, ry=80, T=310, ph=1, o=.2)],
          caps=('', 'left:120px;top:800px;width:560px;font-size:30px'))

def s02():
    css = cascade_css('42% 50%', 660, 120, -12, 5, 56, '''
.c{width:600px;height:270px}
.c1{left:0;top:0;transform:translateZ(-200px);background:rgba(255,255,255,.42)}
.c2{left:240px;top:300px;transform:translateZ(-40px);background:rgba(255,255,255,.52)}
.c3{left:480px;top:600px;transform:translateZ(140px);background:rgba(255,255,255,.72)}
.op1{left:520px;top:250px;transform:translateZ(-30px)}
.op2{left:760px;top:550px;transform:translateZ(170px)}
.tag{display:inline-block;padding:6px 14px;border-radius:999px;font-size:17px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;background:rgba(11,18,32,.07);color:var(--ink2);margin-bottom:14px}
''')
    html = f'''<div class="title in" data-i="0">{eyebrow('How it works')}<div class="h1">Three parts. One arrangement.</div><div class="sub">Who does what, and who decides what.</div></div>
<div class="scene"><div class="stack">
<div class="glass liquid c c1 in" id="c1" data-i="1" data-tf="translateZ(-200px)"><div class="rim"></div><div><div class="tag">NeroPay</div><div class="big">Processes the payments. Owns the compliance.</div></div><div class="sub">The regulated processor underneath</div></div>
<div class="glass op op1 in" data-i="2" data-tf="translateZ(-30px)">→</div>
<div class="glass liquid c c2 in" id="c2" data-i="3" data-tf="translateZ(-40px)"><div class="rim"></div><div><div class="tag">You, the platform</div><div class="big">Bring the merchants. Set the terms.</div></div><div class="sub">Pricing, branding, the store, the relationship</div></div>
<div class="glass op op2 eq in" data-i="4" data-tf="translateZ(170px)">→</div>
<div class="glass liquid c c3 in" id="c3" data-i="5" data-tf="translateZ(140px)"><div class="rim"></div><div class="drop" style="width:22px;height:22px;left:560px;top:36px"></div><div><div class="yline" style="margin-bottom:14px"></div><div class="tag">Your merchants</div><div class="big">Take payments on your dashboard, on your domain.</div></div><div class="sub">Cafés, takeaways, shops</div></div>
</div></div>
<div class="foot in" data-i="6">NeroPay keeps identity checks, compliance and the hard limits. Everything your merchants see is yours.</div>'''
    cam = [("at('There')", None, 1), ("at('NeroPay')", '#c1', 1.32, 26), ("at('You bring')", '#c2', 1.32, 26), ("at('And your')", '#c3', 1.3, 26), ("endAt('yours', 1)", None, 1, 30)]
    write(2, 'S2 three parties — cascade', css, html, cam, cascade_extra(-12, 5),
          lights=[dict(x=-700, y=-900, rx=200, ry=100, T=230, ph=.5, o=.4), dict(x=1150, y=450, rx=120, ry=180, T=280, ph=2.4, o=.24), dict(x=-200, y=800, rx=240, ry=120, T=330, ph=4, o=.2)],
          caps=('', 'left:120px;top:560px;width:480px;font-size:30px'))

def s03():
    # the approved v2, rebuilt as a neat 3×2 grid on one tilted plane (Faisal: the cards were not aligned); the icon rail stays
    css = panel_css('75% 45%', 690, 170, 1040, -22, 9, 1.5, 50, '''
.panel .row{display:grid;grid-template-columns:1fr 1fr 1fr;gap:26px;margin-bottom:26px;transform-style:preserve-3d}
.card{padding:28px 32px;height:232px;display:flex;flex-direction:column;justify-content:space-between;transform-style:preserve-3d}
.card .num{font-size:54px;margin-top:8px}
.card .sub{font-size:18px}
.rail{position:absolute;left:640px;top:360px;display:flex;flex-direction:column;gap:16px;transform:rotateY(-22deg) rotateX(9deg) translateZ(40px)}
.rail .k{width:88px;height:88px;border-radius:24px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:600}
.rail .k.on{background:var(--navy);color:#fff;box-shadow:0 30px 60px -20px rgba(11,18,32,.5)}
.rail .k svg{width:38px;height:38px;stroke:currentColor;fill:none;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.axes{position:absolute;left:170px;top:560px;width:220px;height:220px}
.axes .a{position:absolute;left:110px;top:110px;height:2px;width:100px;transform-origin:0 50%;background:rgba(11,18,32,.25)}
.axes .a::after{content:"";position:absolute;right:-6px;top:-5px;width:12px;height:12px;border-radius:50%;background:#fff;box-shadow:0 0 0 2px rgba(11,18,32,.15)}
.axes .a.y{transform:rotate(-90deg);background:var(--yel)}.axes .a.y::after{background:var(--yel);box-shadow:none}
.axes .a.x{transform:rotate(20deg)}.axes .a.z{transform:rotate(150deg)}
''')
    def card(i, lbl, num, sub, dn=None, integer=False, hero=False):
        nh = f'<div class="num" data-n="{dn}"{" data-int=1" if integer else ""}>{num}</div>' if dn else f'<div class="num">{num}</div>'
        return f'<div class="glass liquid card in" id="k{i}" data-i="{i+3}"{" style=background:rgba(255,255,255,.7)" if hero else ""}><div class="rim"></div><div>{"<div class=yline style=margin-bottom:14px></div>" if hero else ""}<div class="lbl">{lbl}</div>{nh}</div><div class="sub">{sub}</div></div>'
    html = f'''<div class="title in" data-i="0">{eyebrow('Dashboard')}<div class="h1">One place for your whole estate</div><div class="sub">Your merchants, their payments, and what they earn you.</div></div>
<div class="axes in" data-i="1"><div class="a x"></div><div class="a y"></div><div class="a z"></div></div>
<div class="scene">
<div class="rail in" data-i="2" data-tf="rotateY(-22deg) rotateX(9deg) translateZ(40px)">
<div class="glass k on"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg></div>
<div class="glass k"><svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg></div>
<div class="glass k"><svg viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg></div>
<div class="glass k"><svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="M3 10h18"/></svg></div>
<div class="glass k"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/></svg></div>
</div>
<div class="panel">
<div class="row">{card(0, 'Active merchants', '0', 'Live and taking payments', '37', True)}{card(1, 'Payments processed', '£0.00', '61 card payments', '1842.60')}{card(2, 'Needing attention', '0', '1 dispute · 1 compliance check', '2', True)}</div>
<div class="row">{card(3, 'Your platform fee', '£0.00', 'What you charged', '41.20')}{card(4, 'Your net margin', '£0.00', 'What you keep', '18.35', hero=True)}{card(5, 'Available balance', '£0.00', 'Plus a reserve that keeps payouts moving', '2418.36')}</div>
</div></div>
<div class="foot in" data-i="9">Everything your merchants do, in one view.</div>'''
    cam = [("at('Everything')", None, 1), ("at('How many')", '#k0', 1.35, 26), ("at('What they')", '#k1', 1.35, 24), ("at('What you')", '#k4', 1.35, 24), ("at('And what')", '#k2', 1.35, 24), ("endAt('today')", None, 1.02, 30)]
    write(3, 'S3 dashboard — the approved panel, neat', css, html, cam, panel_extra(-22, 9, 1.5),
          caps=('', 'left:120px;top:800px;width:520px;font-size:30px'))

def s04():
    rows = ['<div><div class="who">Blue Anchor Fish Bar</div><div class="meta">Dispute · a customer has challenged a card payment</div></div><div class="kv">Respond within 5 days</div><div class="r"><span class="pill red"><span class="dot"></span> Needs response</span></div>',
            '<div><div class="who">Rosewood Nails</div><div class="meta">Compliance · a document is missing</div></div><div class="kv">Respond within 10 days</div><div class="r"><span class="pill amber"><span class="dot"></span> Information required</span></div>',
            '<div><div class="who">Halcyon Coffee</div><div class="meta">Transaction proof · evidence requested for a payment</div></div><div class="kv">Respond within 7 days</div><div class="r"><span class="pill amber"><span class="dot"></span> Proof requested</span></div>']
    html = rows_html('Dashboard', 'What needs you today', 'Disputes, proof requests and compliance checks, each with its deadline.', rows, 'Only open cases show here. An empty queue means nothing is outstanding.', '1fr 260px 260px')
    cam = [("at('And when')", None, 1), ("at('a dispute')", '#row0', 1.42, 22), ("at('a document')", '#row1', 1.42, 22), ("at('proof')", '#row2', 1.42, 22), ("at('right')", None, 1.02, 30)]
    write(4, 'S4 the attention queue — row stack', ROW_CSS, html, cam, ROWS_EXTRA, stag=7,
          lights=[dict(x=-700, y=-900, rx=180, ry=120, T=210, ph=1, o=.4), dict(x=1300, y=640, rx=180, ry=120, T=250, ph=3, o=.26), dict(x=200, y=300, rx=200, ry=200, T=320, ph=5, o=.18)],
          caps=('it', 'left:120px;top:560px;width:520px;font-size:30px'))

def s05():
    css = panel_css('75% 45%', 700, 140, 1200, -20, 8, 1, 54, '''
.tbl{padding:30px 34px}
.tbl .hd,.tbl .tr{display:grid;grid-template-columns:1.5fr 1.1fr .8fr .8fr;gap:20px;align-items:center;padding:16px 14px}
.tbl .hd{font-size:16px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);font-weight:600;border-bottom:1.5px solid rgba(11,18,32,.09)}
.tbl .tr{height:82px;border-bottom:1.5px solid rgba(11,18,32,.06);font-size:21px;color:var(--ink2)}
.tbl .tr .nm{font-weight:600;color:var(--ink);font-size:23px}
.tbl .tr .ac{font-size:17px;color:var(--mut);margin-top:3px}
.tbl .tr.hero{background:rgba(255,255,255,.75);border-radius:16px}
.count{position:absolute;left:120px;top:560px;width:400px;padding:30px 34px}
.count .num{font-size:88px}
.colhot{background:rgba(251,197,15,.14);border-radius:12px}
''')
    def tr(m, onb, kyc, hero=False):
        pill = '<span class="pill good"><span class="dot"></span> Connected</span>' if onb == 'Connected' else '<span class="pill amber"><span class="dot"></span> Pending</span>'
        k = '<span class="pill ink">Verified</span>' if kyc else '<span class="pill ink" style="opacity:.6">Unverified</span>'
        return f'<div class="tr{" hero" if hero else ""}"><div class="cn"><div class="nm">{m["n"]}</div><div class="ac">{m["acct"]}</div></div><div>{m["e"].split("@")[0]}@…</div><div class="co">{pill}</div><div class="ck">{k}</div></div>'
    rows = tr(M[0], 'Connected', True) + tr(M[1], 'Connected', True) + tr(M[3], 'Connected', True, hero=True) + tr(M[6], 'Pending', False) + tr(M[13], 'Connected', True)
    html = f'''<div class="title in" data-i="0">{eyebrow('Connected accounts')}<div class="h1">Every merchant, one screen</div><div class="sub">Who they are, whether they're live, whether their checks are done.</div></div>
<div class="glass liquid count in" id="count" data-i="1"><div class="rim"></div><div class="lbl">Active merchants</div><div class="num" data-n="37" data-int="1">0</div><div class="sub">Live and taking payments</div></div>
<div class="scene"><div class="panel"><div class="glass liquid tbl in" id="tbl" data-i="2"><div class="rim"></div><div class="hd"><div id="hn">Business</div><div>Contact</div><div id="ho">Onboarding</div><div id="hk">Identity</div></div>{rows}</div></div></div>
<div class="foot in" data-i="3">Identity checks are NeroPay's. Everything else on this screen is yours to act on.</div>'''
    cam = [("at('Every')", None, 1), ("at('Who they')", '#hn', 1.3, 24), ("at('whether they')", '#ho', 1.3, 24), ("at('identity')", '#hk', 1.3, 24), ("endAt('done')", None, 1.02, 28)]
    extra = panel_extra(-20, 8, 1) + " const H={hn:at('Who they'),ho:at('whether they'),hk:at('identity')}; ['hn','ho','hk'].forEach(id=>{const e=document.getElementById(id); const on=n>=H[id]&&n<H[id]+60; e.classList.toggle('colhot',on);});"
    write(5, 'S5 the register — tilted panel', css, html, cam, extra,
          lights=[dict(x=-560, y=-760, rx=160, ry=120, T=240, ph=2, o=.4), dict(x=1400, y=700, rx=120, ry=160, T=200, ph=0, o=.26), dict(x=900, y=-300, rx=260, ry=100, T=300, ph=2.5, o=.2)],
          caps=('', 'left:120px;top:800px;width:520px;font-size:30px'))

def s06():
    css = cascade_css('50% 55%', 120, 270, -8, 6, 56, '''
.c{width:330px;height:300px;padding:28px 30px}
.c .n{width:56px;height:56px;border-radius:50%;background:rgba(11,18,32,.08);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;color:var(--ink);margin-bottom:16px}
.c.last .n{background:var(--yel)}
.title{top:80px;width:1000px}
.s1{left:0;top:0} .s2{left:300px;top:56px} .s3{left:600px;top:112px} .s4{left:900px;top:168px} .s5{left:1200px;top:224px;background:rgba(255,255,255,.75)}
''')
    steps = [('1', 'The person', 'Name, nationality, date of birth, contact'), ('2', 'The business', 'Trading and legal identity'), ('3', 'Addresses', 'Registered and trading'), ('4', 'Terms', 'Agreement accepted'), ('5', 'Review', 'Confirm, and they are live')]
    zs = [-160, -80, 0, 80, 160]
    cards = ''.join(f'<div class="glass liquid c s{k+1}{" last" if k == 4 else ""} in" id="st{k+1}" data-i="{k+1}" data-tf="translateZ({zs[k]}px)"><div class="rim"></div><div><div class="n">{a}</div><div class="lbl">{b}</div><div class="sub">{c}</div></div><div class="sub" style="color:var(--mut)">{"NeroPay runs the checks" if k == 4 else "Validated before the next step"}</div></div>' for k, (a, b, c) in enumerate(steps))
    html = f'''<div class="title in" data-i="0">{eyebrow('Connected accounts')}<div class="h1">Adding a merchant: five steps</div></div>
<div class="scene"><div class="stack">{cards}</div></div>
<div class="foot in" data-i="6">Each step checks itself before the next unlocks. Identity verification runs through NeroPay.</div>'''
    cam = [("at('Adding')", None, 1), ("at('You put')", '#st1', 1.3, 24), ("at('details')", '#st3', 1.25, 30), ("at('NeroPay')", '#st5', 1.3, 24), ("at('taking')", None, 1.02, 30)]
    write(6, 'S6 five steps — cascade', css, html, cam, cascade_extra(-8, 6),
          lights=[dict(x=1100, y=-600, rx=200, ry=160, T=220, ph=0, o=.4), dict(x=-400, y=700, rx=160, ry=120, T=260, ph=1, o=.24), dict(x=1500, y=800, rx=140, ry=140, T=340, ph=2, o=.2)],
          caps=('c', 'left:260px;top:900px;width:1400px;font-size:32px'))

def s07():
    ctls = [('left:700px;top:150px;width:520px', 'rotateY(-10deg) rotateX(4deg) translateZ(40px)', '<div class="lbl">Who pays the processing fee</div><div class="val">Agreed with NeroPay</div><div class="ro"><i></i> Read only · change by request</div>', True),
            ('left:1260px;top:190px;width:520px', 'rotateY(-14deg) rotateX(5deg) translateZ(-20px)', '<div class="lbl">Who pays the monthly account fee</div><div class="val">Agreed with NeroPay</div><div class="ro"><i></i> Read only · change by request</div>', True),
            ('left:700px;top:440px;width:1080px', 'rotateY(-11deg) rotateX(6deg) translateZ(140px)', '<div class="yline" style="margin-bottom:16px"></div><div class="lbl" style="color:var(--ink);font-size:24px;font-weight:600">What your merchants are charged</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:8px"><div class="field"><div class="lbl">Card terminal</div><div class="box">Yours to set</div></div><div class="field"><div class="lbl">Online</div><div class="box">Yours to set</div></div><div class="field"><div class="lbl">Keyed</div><div class="box">Yours to set</div></div></div>', False)]
    html = form_html('Pricing', 'Who sets what', 'Two things are agreed with NeroPay. The rest is yours.', ctls, 'Merchant pricing is yours in every arrangement. Per-merchant rates can override your defaults.')
    cam = [("at('Now')", None, 1), ("at('Who pays')", '#ctl0', 1.36, 24), ("at('and who')", '#ctl1', 1.36, 24), ("at('Everything')", '#ctl2', 1.2, 28), ("at('yours to')", None, 1.02, 30)]
    write(7, 'S7 who sets what — floating form', FORM_CSS, html, cam, FORM_EXTRA, stag=7,
          lights=[dict(x=-700, y=-800, rx=160, ry=140, T=230, ph=1.2, o=.4), dict(x=1500, y=300, rx=120, ry=180, T=270, ph=0, o=.26), dict(x=700, y=900, rx=260, ry=80, T=320, ph=2, o=.2)],
          caps=('', 'left:120px;top:880px;width:900px;font-size:30px'))

def s08():
    # the approved v4 cascade, ported: the same cards, the camera on each as she says it
    css = cascade_css('40% 50%', 520, 120, -14, 6, 60, '''
.c{width:720px;height:330px;padding:38px 46px}
.c .num{font-size:96px}
.c1{left:0;top:0;background:rgba(255,255,255,.4)}
.c2{left:250px;top:230px;background:rgba(255,255,255,.5)}
.c3{left:500px;top:450px;background:rgba(255,255,255,.72)}
.op{width:110px;height:110px;font-size:64px}
.op1{left:640px;top:270px}
.op2{left:900px;top:490px}
.title .h1{font-size:60px}
''')
    html = f'''<div class="title in" data-i="0">{eyebrow('Pricing')}<div class="h1">Your fee. Their cost. Your margin.</div><div class="sub">On every card payment your merchants take.</div></div>
<div class="scene"><div class="stack">
<div class="glass liquid c c1 in" id="c1" data-i="1" data-tf="translateZ(-220px)"><div class="rim"></div><div><div class="lbl">Your platform fee</div><div class="num" data-n="41.20">£0.00</div></div><div class="sub">What you charge your merchants</div></div>
<div class="glass op op1 in" data-i="2" data-tf="translateZ(-30px)">−</div>
<div class="glass liquid c c2 in" id="c2" data-i="3" data-tf="translateZ(-60px)"><div class="rim"></div><div><div class="lbl">NeroPay processing cost</div><div class="num" data-n="22.85">£0.00</div></div><div class="sub">What NeroPay charges you</div></div>
<div class="glass op op2 eq in" data-i="4" data-tf="translateZ(170px)">=</div>
<div class="glass liquid c c3 in" id="c3" data-i="5" data-tf="translateZ(140px)"><div class="rim"></div><div class="drop" style="width:22px;height:22px;left:640px;top:40px"></div><div><div class="yline" style="margin-bottom:16px"></div><div class="lbl">Your net margin</div><div class="num" data-n="18.35">£0.00</div></div><div class="sub">What you keep</div></div>
</div></div>
<div class="foot in" data-i="6">You set what your merchants pay. NeroPay sets the floor beneath every rate, so you can never be charged more than you earn.</div>'''
    cam = [("at('And')", None, 1), ("at('Your fee')", '#c1', 1.28, 22), ("at('minus')", '#c2', 1.28, 22), ("at('is your')", '#c3', 1.28, 22), ("at('on every')", None, 1.02, 30)]
    write(8, 'S8 margin — the approved cascade', css, html, cam, cascade_extra(-14, 6), stag=9,
          lights=[dict(x=-700, y=-900, rx=200, ry=120, T=220, ph=0, o=.4), dict(x=1150, y=450, rx=140, ry=140, T=260, ph=1.7, o=.26), dict(x=-100, y=900, rx=220, ry=90, T=300, ph=3.1, o=.2)],
          caps=('', 'left:120px;top:600px;width:420px;font-size:30px'))

def s09():
    bgs = [(7, BGTF[0], '<div class="lbl">Extra service</div><div class="big">SMS receipts</div><div class="sub">Priced by you, floored by NeroPay</div>'),
           (9, BGTF[1], '<div class="lbl">Extra service</div><div class="big">Instant payouts</div><div class="sub">Priced by you, floored by NeroPay</div>'),
           (5, BGTF[2], '<div class="lbl">Extra service</div><div class="big">Refunds</div><div class="sub">Priced by you, floored by NeroPay</div>'),
           (8, BGTF[3], '<div class="lbl">Extra service</div><div class="big">Non-UK cards</div><div class="sub">Priced by you, floored by NeroPay</div>')]
    html = hero_html(bgs, ('0.00%', None), 'At cost', 'Set a service at the floor and it passes through at NeroPay\'s cost. Never below it.', 'Pricing', 'Never below NeroPay\'s cost. Set at the floor, it passes through.', 1120, count=False)
    cam = [("at('There')", None, 1), ("at('floor')", '#hero', 1.18, 30), ("at('You can')", None, 1, 30), ("at('Set it')", '#hero', 1.22, 30), ("at('through')", None, 1.02, 30)]
    write(9, 'S9 the floor — hero pill', hero_css(1120, 140), html, cam, HERO_EXTRA,
          lights=[dict(x=1000, y=-700, rx=180, ry=120, T=210, ph=0, o=.4), dict(x=-400, y=600, rx=160, ry=140, T=260, ph=1.7, o=.26), dict(x=800, y=900, rx=220, ry=90, T=300, ph=3.1, o=.2)],
          caps=('c', 'left:360px;top:930px;width:1200px;font-size:30px'))

def s10():
    ctls = [('left:700px;top:150px;width:1080px', 'rotateY(-9deg) rotateX(4deg) translateZ(80px)', f'<div class="lbl">Your login link</div><div class="url" style="margin-top:10px">{P["domain"]}<b>/login</b></div><div class="ro"><i style="background:var(--yel)"></i> Your domain is live · links use it automatically</div>', False),
            ('left:700px;top:400px;width:500px', 'rotateY(-12deg) rotateX(6deg) translateZ(20px)', '<div class="lbl">Show NeroPay logo on checkout</div><div class="tog" style="margin-top:14px"><span class="sw off" id="sw"><i></i></span> <span id="swl">Off</span></div><div class="ro"><i></i> Full white label</div>', True),
            ('left:1240px;top:430px;width:540px', 'rotateY(-15deg) rotateX(5deg) translateZ(-30px)', '<div class="lbl">Your logo</div><div class="val" style="display:flex;align-items:center;gap:16px"><span style="width:48px;height:48px;border-radius:14px;background:var(--navy);display:inline-block"></span> Harbourline</div><div class="ro"><i></i> On the dashboard, the checkout, the emails</div>', True),
            ('left:700px;top:660px;width:1080px', 'rotateY(-10deg) rotateX(7deg) translateZ(150px)', f'<div class="lbl">Custom domain · DNS</div><div class="dns" style="margin-top:14px"><b>CNAME</b><span>pay &nbsp;→&nbsp; NeroPay endpoint</span><b>TXT</b><span>{P["txt_token"][:22]}…</span></div><div class="ro"><i style="background:var(--good)"></i> Checked · SSL ready</div>', False)]
    html = form_html('Branding', 'Your logo. Your domain. Your link.', 'Your merchants see your brand, and only your brand.', ctls, 'Turn the NeroPay mark back on where it adds credibility at checkout. Your call.')
    cam = [("at('Your logo')", '#ctl2', 1.34, 22), ("at('Your domain')", '#ctl3', 1.3, 22), ("at('Your login')", '#ctl0', 1.3, 22), ("at('only your')", '#ctl1', 1.34, 22), ("at('if')", None, 1.02, 28)]
    extra = FORM_EXTRA + " const off=at('only your'); const q=ease(seg(n,off+8,10)); document.getElementById('sw').classList.toggle('off',true);"
    write(10, 'S10 branding — floating form', FORM_CSS, html, cam, extra, stag=7,
          lights=[dict(x=1000, y=-700, rx=180, ry=140, T=230, ph=2, o=.4), dict(x=-400, y=700, rx=160, ry=120, T=280, ph=0, o=.26), dict(x=1400, y=900, rx=120, ry=160, T=320, ph=4, o=.2)],
          caps=('', 'left:120px;top:560px;width:520px;font-size:30px'))

def s11():
    css = panel_css('70% 45%', 700, 150, 1140, -18, 8, 1, 54, '''
.modes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;transform-style:preserve-3d}
.mode{padding:28px 30px;height:250px;display:flex;flex-direction:column;justify-content:space-between}
.mode .t{font-size:24px;font-weight:600;color:var(--ink)} .mode .sub{font-size:18px;margin-top:10px}
.mode.on{background:rgba(255,255,255,.74)}
.item{margin-top:26px;padding:30px 34px;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:24px;align-items:center}
.item .nm{font-size:26px;font-weight:600} .item .k{font-size:17px;color:var(--mut)} .item .v{font-size:24px;font-weight:600;margin-top:6px}
.item .bar{height:12px;border-radius:6px;background:rgba(11,18,32,.08);margin-top:12px;overflow:hidden} .item .bar i{display:block;height:100%;width:var(--w,0%);background:var(--yel);border-radius:6px}
''')
    html = f'''<div class="title in" data-i="0">{eyebrow('Store')}<div class="h1">Your store. Your prices.</div><div class="sub">Terminals, tills and accessories, sold under your name.</div></div>
<div class="scene"><div class="panel"><div class="modes" id="modes">
<div class="glass liquid mode in" data-i="1"><div class="rim"></div><div><div class="t">NeroPay store</div><div class="sub">The standard store, NeroPay branding</div></div><div class="sub">Mode 1</div></div>
<div class="glass liquid mode on in" id="mode2" data-i="2" data-tf="translateZ(90px)"><div class="rim"></div><div><div class="yline" style="margin-bottom:14px"></div><div class="t">White-label store</div><div class="sub">Your branding, neutral product names</div></div><div class="sub">Mode 2 · selected</div></div>
<div class="glass liquid mode in" data-i="3"><div class="rim"></div><div><div class="t">Hidden</div><div class="sub">You order the hardware yourself</div></div><div class="sub">Mode 3</div></div>
</div>
<div class="glass liquid item in" id="item" data-i="4" data-tf="translateZ(40px)"><div class="rim"></div><div><div class="nm">Card terminal</div><div class="k">One catalogue item</div></div><div><div class="k">Supply cost</div><div class="v">NeroPay's</div><div class="bar"><i style="--w:55%"></i></div></div><div id="yp"><div class="k">Your price</div><div class="v">Yours</div><div class="bar"><i style="--w:88%"></i></div></div><div id="ym"><div class="k">Your margin</div><div class="v">The difference</div><div class="bar"><i class="m" style="--w:33%"></i></div></div></div>
</div></div>
<div class="foot in" data-i="5">NeroPay ships, supports and handles returns. You set the price and keep the margin.</div>'''
    cam = [("at('Terminals')", None, 1), ("at('through')", '#mode2', 1.3, 24), ("at('at your')", '#yp', 1.4, 24), ("at('NeroPay ships')", None, 1.02, 28), ("at('You keep')", '#ym', 1.4, 22)]
    extra = panel_extra(-18, 8, 1) + " const w=ease(seg(n,at('You keep'),30)); document.querySelector('.item .bar i.m').style.setProperty('--w',(33*w)+'%');"
    write(11, 'S11 the store — tilted panel', css, html, cam, extra,
          lights=[dict(x=-600, y=-800, rx=180, ry=120, T=240, ph=.7, o=.4), dict(x=1500, y=760, rx=140, ry=140, T=270, ph=2.2, o=.26), dict(x=300, y=900, rx=240, ry=80, T=300, ph=4.4, o=.2)],
          caps=('', 'left:120px;top:800px;width:520px;font-size:30px'))

def s12():
    css = '''
.head{position:absolute;left:120px;top:96px;width:1200px}
.head .eyebrow{margin-bottom:22px}
.head .sub{margin-top:18px;font-size:24px;max-width:900px}
.hdr-pill{position:absolute;right:120px;top:104px}
.g{position:absolute;left:120px;top:330px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.tile{padding:38px 42px 34px;height:310px;display:flex;flex-direction:column;justify-content:space-between}
.tile .lbl{display:flex;align-items:center;gap:14px}
.tile .num{margin-top:8px}
.tile .sub{font-size:19px}
.tile.hero{background:rgba(255,255,255,.66)}
.tile .yline{margin-bottom:14px}
.foot{position:absolute;left:120px;right:120px;bottom:64px;display:flex;justify-content:space-between;align-items:center;color:var(--mut);font-size:19px}
'''
    tiles = [('Payments processed', '1842.60', '£0.00', '61 card payments across your merchants', False, False), ('Active merchants', '37', '0', 'Live and taking payments', True, False), ('Your platform fee', '41.20', '£0.00', 'What you charged on those payments', False, False),
             ('NeroPay processing cost', '22.85', '£0.00', 'What NeroPay charged you', False, False), ('Your net margin', '18.35', '£0.00', 'Your fee minus NeroPay\'s cost — what you keep', False, True), ('Extra services margin', '3.40', '£0.00', 'SMS, instant payouts, refunds and more', False, False)]
    g = ''.join(f'<div class="glass liquid tile{" hero" if h else ""} in" id="t{k}" data-i="{k+2}"><div class="rim"></div><div>{"<div class=yline></div>" if h else ""}<div class="lbl">{l}</div><div class="num md" data-n="{dn}"{" data-int=1" if it else ""}>{z}</div></div><div class="sub">{s}</div></div>' for k, (l, dn, z, s, it, h) in enumerate(tiles))
    html = f'''<div class="head in" data-i="0">{eyebrow('Connect Reports')}<div class="h1">What your merchants earn you</div><div class="sub">Every number updates as your merchants take payments.</div></div>
<div class="hdr-pill in" data-i="1"><span class="pill ink"><span class="dot" style="background:var(--yel)"></span> Live</span></div>
<div class="g">{g}</div>
<div class="foot in" data-i="8"><span>You set what your merchants pay. NeroPay sets the floor.</span><span></span></div>'''
    cam = [("at('Reports')", None, 1), ("at('The payments')", '#t0', 1.3, 22), ("at('your fee')", '#t2', 1.3, 22), ("at('NeroPay')", '#t3', 1.3, 22), ("at('what you keep')", '#t4', 1.34, 22)]
    write(12, 'S12 reports — the approved tiles', css, html, cam, '', stag=5,
          caps=('', 'left:1200px;top:210px;width:600px;font-size:26px'))

def s13():
    css = '''
.scene{position:absolute;inset:0;perspective:3000px;perspective-origin:50% 40%}
.big{position:absolute;left:160px;top:110px;width:1600px;height:620px;padding:44px 52px;transform:rotateX(6deg) rotateY(-4deg)}
.big .top{display:flex;justify-content:space-between;align-items:center}
.big .tabs{display:flex;gap:34px;font-size:22px;font-weight:500;color:var(--mut)}
.big .tabs .on{color:var(--ink);position:relative}
.big .tabs .on::after{content:"";position:absolute;left:0;right:0;bottom:-10px;height:4px;border-radius:2px;background:var(--yel)}
.big .h2{font-size:36px}
.chart{position:absolute;left:52px;right:420px;top:130px;bottom:40px}
.chart svg{width:100%;height:100%;overflow:visible}
.readout{position:absolute;right:52px;top:140px;width:330px;padding:28px 30px}
.readout .num{font-size:56px}
.readout .lbl{margin-top:6px}
.readout .rule{margin:20px 0}
.readout .kv{display:flex;justify-content:space-between;font-size:19px;color:var(--ink2);margin:8px 0}
.readout .kv b{font-weight:600;color:var(--ink)}
.small{position:absolute;left:160px;top:770px;width:1600px;display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:24px;transform:rotateX(6deg) rotateY(-4deg)}
.small .s{padding:26px 30px;height:200px;display:flex;flex-direction:column;justify-content:space-between}
.small .num{font-size:46px}
.small .sub{font-size:17px}
.axis{font-size:17px;fill:var(--mut);font-family:Inter}
'''
    html = '''<div class="scene">
<div class="glass liquid big in" id="big" data-i="0" data-tf="rotateX(6deg) rotateY(-4deg)"><div class="rim"></div>
<div class="top"><div><div class="eyebrow"><b>NeroConnect</b> &nbsp;·&nbsp; Connect Reports</div><div class="h2" style="margin-top:10px">Your margin, payment by payment</div></div>
<div class="tabs"><span class="on">Net margin</span><span>Your fee</span><span>NeroPay cost</span><span>Volume</span></div></div>
<div class="chart"><svg viewBox="0 0 1100 420" preserveAspectRatio="none">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbc50f" stop-opacity=".55"/><stop offset="1" stop-color="#fbc50f" stop-opacity="0"/></linearGradient></defs>
<g stroke="rgba(11,18,32,.08)" stroke-width="1"><line x1="0" y1="80" x2="1100" y2="80"/><line x1="0" y1="180" x2="1100" y2="180"/><line x1="0" y1="280" x2="1100" y2="280"/><line x1="0" y1="380" x2="1100" y2="380"/></g>
<path id="area" fill="url(#g)" d=""/><path id="line" fill="none" stroke="#fbc50f" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" d=""/><path id="line2" fill="none" stroke="rgba(11,18,32,.35)" stroke-width="3" stroke-dasharray="8 8" d=""/>
<text class="axis" x="0" y="405">Mon</text><text class="axis" x="180" y="405">Tue</text><text class="axis" x="360" y="405">Wed</text><text class="axis" x="540" y="405">Thu</text><text class="axis" x="720" y="405">Fri</text><text class="axis" x="900" y="405">Sat</text><text class="axis" x="1060" y="405">Sun</text></svg></div>
<div class="glass readout" id="ro"><div class="num" data-n="18.35">£0.00</div><div class="lbl">Net margin this week</div><div class="rule"></div>
<div class="kv"><span>Your fee</span><b>£41.20</b></div><div class="kv"><span>NeroPay cost</span><b>£22.85</b></div><div class="kv"><span>Payments</span><b>61</b></div></div></div>
<div class="small">
<div class="glass liquid s in" data-i="1"><div class="rim"></div><div class="lbl">Active merchants</div><div><div class="num">37</div><div class="sub">Live and taking payments</div></div></div>
<div class="glass liquid s in" id="sT" data-i="2"><div class="rim"></div><div class="lbl">Terminal</div><div><div class="num">£1,412.30</div><div class="sub">44 payments</div></div></div>
<div class="glass liquid s in" id="sO" data-i="3"><div class="rim"></div><div class="lbl">Online</div><div><div class="num">£430.30</div><div class="sub">17 payments</div></div></div>
<div class="glass liquid s in" data-i="4"><div class="rim"></div><div class="lbl">Extra services</div><div><div class="num">£3.40</div><div class="sub">SMS, instant payouts, refunds</div></div></div>
</div></div>'''
    extra = '''const pts=[[0,300],[90,270],[180,285],[270,220],[360,240],[450,170],[540,190],[630,120],[720,150],[810,90],[900,110],[990,60],[1100,75]];
const pts2=[[0,340],[180,330],[360,300],[540,290],[720,250],[900,230],[1100,210]];
const path=(ps,k)=>{const m=Math.max(1,Math.ceil(ps.length*k));return 'M'+ps.slice(0,m).map(p=>p.join(' ')).join(' L ');};
const k=ease(seg(n,20,60)); document.getElementById('line').setAttribute('d',path(pts,k)); document.getElementById('line2').setAttribute('d',path(pts2,k));
const m=Math.max(1,Math.ceil(pts.length*k)); document.getElementById('area').setAttribute('d',path(pts,k)+` L ${pts[m-1][0]} 420 L 0 420 Z`);'''
    cam = [("at('And how')", '#big', 1.12, 30), ("at('terminal')", '#sT', 1.4, 22), ("at('online')", '#sO', 1.4, 22), ("at('side by')", None, 1.02, 30)]
    write(13, 'S13 trend — the approved chart', css, html, cam, extra,
          lights=[dict(x=-560, y=-800, rx=180, ry=120, T=220, ph=0, o=.42), dict(x=1400, y=560, rx=140, ry=140, T=260, ph=1.7, o=.24), dict(x=200, y=900, rx=220, ry=90, T=300, ph=3.1, o=.18)],
          caps=('sm', 'left:1280px;top:790px;width:500px;font-size:24px'))

def s14():
    bgs = [(7, BGTF[0], '<div class="lbl">Payments processed</div><div class="num">£1,842.60</div><div class="sub">61 card payments across your merchants</div>'),
           (0, BGTF[1], '<div class="lbl">Connect reserve</div><div class="big">Held back for thin days</div><div class="sub">Keeps platform-paid processing moving</div>'),
           (5, BGTF[2], '<div class="lbl">Your net margin</div><div class="num">£18.35</div><div class="sub">What you keep</div>'),
           (8, BGTF[3], '<div class="lbl">Active merchants</div><div class="num">37</div><div class="sub">Live and taking payments</div>')]
    html = hero_html(bgs, ('£0.00', '2418.36'), 'Available balance', 'Cleared funds, yours to move. A reserve sits behind it so payouts keep flowing.', 'Wallet', 'Yours to move. The reserve covers a thin day.', 1120)
    cam = [("at('Your balance')", '#hero', 1.16, 30), ("at('And a reserve')", '#bg2', 1.3, 26), ("at('so payouts')", None, 1.02, 30)]
    write(14, 'S14 the wallet — hero pill', hero_css(1120, 150), html, cam, HERO_EXTRA,
          lights=[dict(x=-700, y=-900, rx=180, ry=120, T=210, ph=0, o=.4), dict(x=1250, y=560, rx=160, ry=140, T=260, ph=1.7, o=.26), dict(x=500, y=900, rx=220, ry=90, T=300, ph=3.1, o=.2)],
          caps=('c', 'left:360px;top:930px;width:1200px;font-size:30px'))

def s15():
    css = ROW_CSS + '''
.rows{left:640px;top:130px;width:1160px}
.row{height:380px;padding:38px 44px;align-items:start;grid-template-columns:1fr 1fr}
.row .t{font-size:34px;font-weight:600;letter-spacing:-.02em}
.row ul{list-style:none;margin-top:18px;padding:0} .row li{font-size:21px;color:var(--ink2);padding:8px 0 8px 30px;position:relative} .row li::before{content:"";position:absolute;left:0;top:18px;width:12px;height:12px;border-radius:50%;background:rgba(11,18,32,.18)}
.row.prem li::before{background:var(--yel)}
'''
    html = f'''<div class="title in" data-i="0">{eyebrow('Support')}<div class="h1">Two tiers of support</div><div class="sub">Free covers you. Premium covers your merchants, in your name.</div></div>
<div class="scene"><div class="rows">
<div class="glass liquid row in" id="row0" data-i="1"><div class="rim"></div><div><div class="t">Free</div><div class="sub">Included</div><ul><li>Your platform dashboard and settings</li><li>Live chat in UK hours, and the guides</li></ul></div><div><div class="sub">You handle</div><ul><li>Your merchants' questions</li><li>Shipping queries</li></ul></div></div>
<div class="glass liquid row prem in" id="row1" data-i="2" data-tf="translateZ(60px)"><div class="rim"></div><div><div class="yline" style="margin-bottom:14px"></div><div class="t">Premium</div><div class="sub">Monthly · white-label</div><ul><li id="l1">Your merchants' tickets and live chat</li><li id="l2">Their hardware shipped and supported</li></ul></div><div><div class="sub">Answered as you</div><ul><li id="l3">Phone support under your name</li><li>Devices prepared in your branding</li></ul></div></div>
</div></div>
<div class="foot in" data-i="3">The Premium price is shown on the Connect Support screen.</div>'''
    cam = [("at('Support')", None, 1), ("at('Free')", '#row0', 1.2, 26), ("at('Premium')", '#row1', 1.2, 26), ("at('all in')", None, 1.02, 30)]
    extra = ROWS_EXTRA + " [['l1','tickets'],['l2','ships'],['l3','picks']].forEach(([id,w])=>{const e=document.getElementById(id); const q=n>=at(w)&&n<at(w)+50; e.style.color=q?'var(--ink)':''; e.style.fontWeight=q?'600':'';});"
    write(15, 'S15 support — two tall rows', css, html, cam, extra, stag=8,
          lights=[dict(x=1000, y=-600, rx=180, ry=120, T=230, ph=1, o=.4), dict(x=-500, y=700, rx=160, ry=140, T=270, ph=0, o=.26), dict(x=1500, y=900, rx=140, ry=120, T=320, ph=3, o=.2)],
          caps=('it', 'left:120px;top:560px;width:480px;font-size:30px'))

def s16():
    css = '''
.scene{position:absolute;inset:0;perspective:2400px;perspective-origin:60% 50%}
.card{position:absolute;left:120px;top:150px;width:1040px;height:760px;padding:64px 70px;transform:rotateY(6deg) rotateX(2deg)}
.card .big{font-size:84px;font-weight:600;letter-spacing:-.03em;line-height:1.02}
.card .mark{font-size:44px;font-weight:700;letter-spacing:-.02em;margin-top:26px}
.card .mk{width:72px;height:6px;border-radius:3px;background:var(--yel);margin-top:22px}
.card .line{font-size:24px;color:var(--mut);margin-top:26px;max-width:720px;line-height:1.4}
.url{display:inline-flex;align-items:center;gap:16px;padding:18px 34px;border-radius:999px;font-size:32px;font-weight:600;margin-top:40px}
.url i{width:12px;height:12px;border-radius:50%;background:var(--yel)}
.socs{display:flex;gap:18px;margin-top:34px}
.soc{width:84px;height:84px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--ink)}
.soc svg{width:38px;height:38px}
.term{position:absolute;left:1250px;top:90px;width:540px;height:780px;transform-style:preserve-3d}
.term img{width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 60px 60px rgba(11,18,32,.28))}
.tag{position:absolute;left:1200px;top:890px;width:640px;text-align:center;font-size:16px;color:var(--mut);letter-spacing:.1em;text-transform:uppercase;font-weight:600}
'''
    socs = ['<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2.2"/><circle cx="17.4" cy="6.6" r="1.3" fill="currentColor"/></svg>',
            '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M13.6 21.5v-7.2h2.5l.4-3h-2.9V9.4c0-.9.3-1.5 1.5-1.5h1.6V5.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.6v7.2z"/></svg>',
            '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M16.6 3c.3 2.3 1.6 3.7 3.8 3.9V10c-1.4 0-2.7-.4-3.8-1.2v6.4c0 3.2-2.6 5.7-5.8 5.7S5 18.4 5 15.2s2.6-5.7 5.8-5.7c.3 0 .6 0 .9.1v3.3c-.3-.1-.6-.2-.9-.2-1.4 0-2.6 1.1-2.6 2.5s1.2 2.5 2.6 2.5 2.6-1.1 2.6-2.5V3z"/></svg>',
            '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 9.4h3V20H6zM7.5 4.6a1.75 1.75 0 110 3.5 1.75 1.75 0 010-3.5zM10.9 9.4h2.9v1.5c.4-.8 1.4-1.7 3-1.7 3.1 0 3.7 2.1 3.7 4.7V20h-3v-5.4c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9V20h-2.9z"/></svg>',
            '<svg viewBox="0 0 24 24"><rect x="2.5" y="6" width="19" height="12.5" rx="4" fill="currentColor"/><path d="M10 9.4v5.7l4.8-2.85z" fill="#fff"/></svg>']
    socs_html = ''.join(f'<div class="glass liquid soc in" data-i="{4+k}"><div class="rim"></div>{s}</div>' for k, s in enumerate(socs))
    html = f'''<div class="scene">
<div class="glass liquid card in" id="card" data-i="0" data-tf="rotateY(6deg) rotateX(2deg)"><div class="rim"></div><div class="drop" style="width:26px;height:26px;left:120px;top:38px"></div>
<div class="eyebrow in" data-i="1"><b>NeroConnect</b> &nbsp;·&nbsp; Your platform</div>
<div class="big in" id="big" data-i="1" style="margin-top:22px">Your merchants.<br>Your brand.</div>
<div class="mark in" data-i="2">Nero<b>Connect</b></div><div class="mk in" data-i="2"></div>
<div class="line in" data-i="3">Card payments for the businesses you look after, run under your name. NeroPay stays underneath.</div>
<div class="glass liquid url in" id="url" data-i="3"><div class="rim"></div><i></i> docs.neropay.app</div>
<div class="socs">{socs_html}</div></div>
<div class="term in" id="term" data-i="2"><img src="../glass/terminal.png" alt=""></div>
<div class="tag in" data-i="5">The terminal your merchants take payments on</div>
</div>'''
    cam = [("at('Your merchants')", '#big', 1.22, 30), ("at('NeroConnect')", '#term', 1.14, 30), ("at('The full')", '#url', 1.26, 30), ("endAt('docs.neropay.app') + 20", None, 1.04, 40)]
    extra = "const tm=document.getElementById('term'); tm.style.transform=`translateY(${(Math.sin(n/45)*10).toFixed(1)}px) rotateY(${(-6+Math.sin(n/70)*4).toFixed(2)}deg)`;"
    write(16, 'S16 close — the terminal, the socials, the link', css, html, cam, extra, stag=6,
          lights=[dict(x=-600, y=-800, rx=200, ry=140, T=230, ph=0, o=.4), dict(x=1300, y=600, rx=160, ry=160, T=270, ph=2, o=.26), dict(x=200, y=900, rx=240, ry=100, T=320, ph=4, o=.22)],
          caps=('', 'left:120px;top:960px;width:900px;font-size:28px'))

if __name__ == '__main__':
    for fn in [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16]: fn()
    print('film %.1f s, %d frames' % (SC[-1]['end'], sum(s['frames'] for s in SC)))
    for s in SC: print('%2d %-24s %6.2f-%6.2f %4d fr' % (s['scene'], s['file'], s['start'], s['end'], s['frames']))

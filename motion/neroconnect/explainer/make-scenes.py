#!/usr/bin/env python3
"""Writes the scene overlays for the NeroConnect explainer into scenes/, one self-contained HTML per scene (glass.css and
the fonts are the only external files), each exposing setFrame(n) at 25 fps: frame 0 empty, settled by frame 70, an
ambient drift after; the scene's hero move lives in setFrame too so a render is deterministic.

    python3 make-scenes.py            # writes scenes/sNN-*.html and the two new archetype references in glass/

Every figure on screen is one of the seven Faisal approved in the kit's five overlays (£1,842.60 · 61 · £41.20 · £22.85 ·
£18.35 · 37 · £2,418.36) or a name from data.json (Harbourline Ltd and its merchants). Nothing else is a number.
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
D = json.load(open(os.path.join(HERE, 'data.json')))
M = D['merchants']; P = D['platform']

FILTER = '''<svg width="0" height="0" style="position:absolute"><filter id="rimbend" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="1" seed="3" result="n"/>
<feGaussianBlur in="n" stdDeviation="2" result="nb"/>
<feDisplacementMap in="SourceGraphic" in2="nb" scale="26" xChannelSelector="R" yChannelSelector="G"/>
<feGaussianBlur stdDeviation="1.2"/></filter></svg>'''

HEAD = '''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../glass/glass.css">
<style>
/* %(title)s */
%(css)s
</style></head><body>
<div class="stage">%(filter)s
  <div class="grid"></div>
  <div class="light" style="--lx:%(lx)spx;--ly:%(ly)spx;opacity:%(lo)s"></div><div class="light two" style="--lx2:%(lx2)spx;--ly2:%(ly2)spx;opacity:%(lo2)s"></div>
%(html)s
</div>
<script>
const ease=t=>1-Math.pow(1-Math.max(0,Math.min(1,t)),3);
const eio=t=>t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2;
const seg=(n,a,d)=>Math.max(0,Math.min(1,(n-a)/d));
const fmt=v=>'£'+v.toLocaleString('en-GB',{minimumFractionDigits:2,maximumFractionDigits:2});
const L1=[%(lx)s,%(ly)s], L2=[%(lx2)s,%(ly2)s];
function base(n){
  /* the light drifts on a 190-frame loop — the only ambient motion; entrances stagger from frame 4, six frames apart */
  const p=eio((n%%190)/190), p2=eio(((n+95)%%190)/190);
  const l=document.querySelector('.light'), l2=document.querySelector('.light.two');
  l.style.setProperty('--lx',(L1[0]+p*%(ldx)s)+'px'); l.style.setProperty('--ly',(L1[1]+p*%(ldy)s)+'px');
  l2.style.setProperty('--lx2',(L2[0]-p2*140)+'px'); l2.style.setProperty('--ly2',(L2[1]+p2*70)+'px');
  document.querySelectorAll('.in').forEach(el=>{const i=+el.dataset.i; const t=ease((n-(4+i*%(stag)s))/20);
    el.style.opacity=t; el.style.transform=(el.dataset.tf||'')+` translateY(${28*(1-t)}px) scale(${.985+.015*t})`;});
  document.querySelectorAll('[data-n]').forEach(el=>{const i=+el.closest('.in').dataset.i; const t=ease((n-(4+i*%(stag)s+9))/28);
    el.textContent=el.dataset.int?Math.round(+el.dataset.n*t).toString():fmt(+el.dataset.n*t);});
}
function setFrame(n){ base(n); %(extra)s }
setFrame(300);
</script></body></html>
'''

def write(name, title, css, html, extra='', lx=-620, ly=-780, lo=.55, lx2=1500, ly2=820, lo2=.24, ldx=200, ldy=120, stag=6, folder='scenes'):
    out = HEAD % dict(title=title, css=css, filter=FILTER, html=html, extra=extra, lx=lx, ly=ly, lo=lo, lx2=lx2, ly2=ly2, lo2=lo2, ldx=ldx, ldy=ldy, stag=stag)
    path = os.path.join(HERE, folder, name + '.html'); os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w').write(out); return path

def eyebrow(sec): return f'<div class="eyebrow"><b>NeroConnect</b> &nbsp;·&nbsp; {sec}</div>'

# ---------------------------------------------------------------------------------------------------------------
# v5 — row stack: glass rows sliding in one at a time, one lit
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
.row.lit{background:rgba(255,255,255,.72);transform:translateZ(90px)}
.row.lit .who{font-size:28px}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:520px;line-height:1.5}
.kv{font-size:19px;color:var(--ink2)}
'''

def rows_scene(name, title_sec, h1, sub, rows, foot, lit, cols, lx=-700, ly=-900, lx2=1300, ly2=640, lo2=.3):
    html = f'<div class="title in" data-i="0">{eyebrow(title_sec)}<div class="h1">{h1}</div><div class="sub">{sub}</div></div>\n<div class="scene"><div class="rows">\n'
    for k, r in enumerate(rows):
        html += f'<div class="glass liquid row{" lit" if k == lit else ""} in" data-i="{k+1}" style="grid-template-columns:{cols}"><div class="rim"></div>{r}</div>\n'
    html += f'</div></div>\n<div class="foot in" data-i="{len(rows)+1}">{foot}</div>'
    extra = "const p=eio((n%210)/210); document.querySelector('.rows').style.transform=`rotateY(${-12+p*4}deg) rotateX(${5-p*2}deg)`; const z=ease(seg(n,40,30)); const lit=document.querySelector('.row.lit'); if(lit) lit.style.transform=(lit.dataset.tf||'')+` translateZ(${90*z}px)`; lit && (lit.dataset.tf=`translateZ(${90*z}px)`);"
    return write(name, 'row stack — ' + h1, ROW_CSS, html, extra, lx=lx, ly=ly, lx2=lx2, ly2=ly2, lo2=lo2, stag=7)

# v6 — floating form: controls as glass objects hovering at slight angles
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
.field .floor{font-size:17px;color:var(--mut);margin-top:10px}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:520px;line-height:1.5}
'''

def form_scene(name, sec, h1, sub, ctls, foot, lx=-560, ly=-760, lx2=1350, ly2=520, lo2=.3):
    html = f'<div class="title in" data-i="0">{eyebrow(sec)}<div class="h1">{h1}</div><div class="sub">{sub}</div></div>\n<div class="scene">\n'
    for k, (style, tf, inner, deep) in enumerate(ctls):
        html += f'<div class="glass liquid ctl in{" deep" if deep else ""}" data-i="{k+1}" style="{style}" data-tf="{tf}"><div class="rim"></div>{inner}</div>\n'
    html += f'</div>\n<div class="foot in" data-i="{len(ctls)+1}">{foot}</div>'
    extra = "document.querySelectorAll('.ctl').forEach((c,k)=>{const b=Math.sin(n/38+k*1.3)*6; c.style.transform+=` translateY(${b}px)`;});"
    return write(name, 'floating form — ' + h1, FORM_CSS, html, extra, lx=lx, ly=ly, lx2=lx2, ly2=ly2, lo2=lo2, stag=7)

# ---------------------------------------------------------------------------------------------------------------
PANEL_CSS = '''
.scene{position:absolute;inset:0;perspective:2600px;perspective-origin:%(po)s}
.panel{position:absolute;left:%(px)spx;top:%(py)spx;width:%(pw)spx;transform-style:preserve-3d;transform:rotateY(%(ry)sdeg) rotateX(%(rx)sdeg) rotateZ(%(rz)sdeg) translateZ(-120px)}
.title{position:absolute;left:120px;top:96px;width:440px}
.title .h1{font-size:%(hs)spx;margin-top:20px}
.title .sub{margin-top:18px;font-size:22px}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:440px;line-height:1.5}
%(more)s
'''

def panel_extra(ry, rx, rz, loop=200, push=0):
    return f"const p=eio((n%{loop})/{loop}); const pu=1+{push}*ease(seg(n,60,60)); document.querySelector('.panel').style.transform=`rotateY(${{{ry}+p*4}}deg) rotateX(${{{rx}-p*2}}deg) rotateZ({rz}deg) translateZ(-120px) scale(${{pu}})`;"

# ---------------------------------------------------------------------------------------------------------------
def s01():
    css = PANEL_CSS % dict(po='72% 45%', px=880, py=150, pw=620, ry=-22, rx=8, rz=1.5, hs=58, more='''
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
    menu = ''.join(f'<div class="it{" on" if k == 0 else ""}"><i></i>{t}</div>' for k, t in enumerate(items))
    html = f'''<div class="title in" data-i="0">{eyebrow('Overview')}<div class="h1">One platform. Your merchants. Your brand.</div><div class="sub">Card payments for the businesses you look after, run under your name.</div></div>
<div class="glass liquid brand in" data-i="1"><div class="rim"></div><div class="lbl">Your platform</div><div class="nm">{P['name']}</div><div class="dom">{P['domain']}</div></div>
<div class="scene"><div class="panel"><div class="glass liquid menu in" data-i="2"><div class="rim"></div><div class="hd">NeroConnect</div>{menu}</div>
<div class="mark in" data-i="3">N<b>C</b></div></div></div>
<div class="foot in" data-i="4">Nine screens. One estate. Yours.</div>'''
    write('s01-open', 'S1 open — the menu as a tilted panel', css, html, panel_extra(-22, 8, 1.5, push=.04), lx=1000, ly=300, lo=.5, lx2=-500, ly2=-500, lo2=.3)

CASCADE_CSS = '''
.scene{position:absolute;inset:0;perspective:2400px;perspective-origin:%(po)s}
.stack{position:absolute;left:%(sx)spx;top:%(sy)spx;transform-style:preserve-3d;transform:rotateY(%(ry)sdeg) rotateX(%(rx)sdeg)}
.c{position:absolute;padding:34px 40px;display:flex;flex-direction:column;justify-content:space-between}
.c .lbl{font-size:26px;font-weight:600;color:var(--ink)}
.c .sub{font-size:20px;margin-top:10px}
.c .big{font-size:40px;font-weight:600;letter-spacing:-.02em;line-height:1.1}
.op{position:absolute;width:96px;height:96px;border-radius:50%%;display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:600;color:var(--ink);background:rgba(255,255,255,.7)}
.op.eq{background:var(--yel)}
.title{position:absolute;left:120px;top:96px;width:460px}
.title .h1{font-size:%(hs)spx;margin-top:20px}
.title .sub{margin-top:18px;font-size:22px}
.foot{position:absolute;left:120px;bottom:64px;color:var(--mut);font-size:19px;max-width:440px;line-height:1.5}
%(more)s
'''

def s02():
    css = CASCADE_CSS % dict(po='42% 50%', sx=660, sy=120, ry=-12, rx=5, hs=56, more='''
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
<div class="glass liquid c c1 in" data-i="1"><div class="rim"></div><div><div class="tag">NeroPay</div><div class="big">Processes the payments. Owns the compliance.</div></div><div class="sub">The regulated processor underneath</div></div>
<div class="glass op op1 in" data-i="2">→</div>
<div class="glass liquid c c2 in" data-i="3"><div class="rim"></div><div><div class="tag">You, the platform</div><div class="big">Bring the merchants. Set the terms.</div></div><div class="sub">Pricing, branding, the store, the relationship</div></div>
<div class="glass op op2 eq in" data-i="4">→</div>
<div class="glass liquid c c3 in" data-i="5"><div class="rim"></div><div class="drop" style="width:22px;height:22px;left:560px;top:36px"></div><div><div class="yline" style="margin-bottom:14px"></div><div class="tag">Your merchants</div><div class="big">Take payments on your dashboard, on your domain.</div></div><div class="sub">Cafés, takeaways, shops</div></div>
</div></div>
<div class="foot in" data-i="6">NeroPay keeps identity checks, compliance and the hard limits. Everything your merchants see is yours.</div>'''
    write('s02-three-parties', 'S2 three parties — cascade', css, html, "const p=eio((n%220)/220); document.querySelector('.stack').style.transform=`rotateY(${-12+p*5}deg) rotateX(${5-p*2}deg)`;", lx=-700, ly=-900, lo=.5, lx2=1150, ly2=450, lo2=.32)

def s03():
    # the approved v2, reused as-is (the "one place for your whole estate" beat)
    src = open(os.path.join(HERE, 'glass', 'v2-tilted-panel.html')).read().replace('href="glass.css"', 'href="../glass/glass.css"')
    src = src.replace('setFrame(200);', 'setFrame(300);')
    open(os.path.join(HERE, 'scenes', 's03-dashboard.html'), 'w').write(src)

def s04():
    rows = [
        '<div><div class="who">Blue Anchor Fish Bar</div><div class="meta">Dispute · a customer has challenged a card payment</div></div><div class="kv">Respond within 5 days</div><div class="r"><span class="pill red"><span class="dot"></span> Needs response</span></div>',
        '<div><div class="who">Halcyon Coffee</div><div class="meta">Transaction proof · evidence requested for a payment</div></div><div class="kv">Respond within 7 days</div><div class="r"><span class="pill amber"><span class="dot"></span> Proof requested</span></div>',
        '<div><div class="who">Rosewood Nails</div><div class="meta">Compliance · a document is missing</div></div><div class="kv">Respond within 10 days</div><div class="r"><span class="pill amber"><span class="dot"></span> Information required</span></div>',
    ]
    rows_scene('s04-attention', 'Dashboard', 'What needs you today', 'Disputes, proof requests and compliance checks, each with its deadline.', rows,
               'Only open cases show here. An empty queue means nothing is outstanding.', 0, '1fr 260px 260px')

def s05():
    css = PANEL_CSS % dict(po='75% 45%', px=700, py=140, pw=1200, ry=-20, rx=8, rz=1, hs=54, more='''
.tbl{padding:30px 34px}
.tbl .hd,.tbl .tr{display:grid;grid-template-columns:1.5fr 1.1fr .8fr .8fr;gap:20px;align-items:center;padding:16px 14px}
.tbl .hd{font-size:16px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);font-weight:600;border-bottom:1.5px solid rgba(11,18,32,.09)}
.tbl .tr{height:82px;border-bottom:1.5px solid rgba(11,18,32,.06);font-size:21px;color:var(--ink2)}
.tbl .tr .nm{font-weight:600;color:var(--ink);font-size:23px}
.tbl .tr .ac{font-size:17px;color:var(--mut);margin-top:3px}
.tbl .tr.hero{background:rgba(255,255,255,.75);border-radius:16px;transform:translateZ(60px)}
.count{position:absolute;left:120px;top:560px;width:400px;padding:30px 34px}
.count .num{font-size:88px}
''')
    def tr(m, onb, kyc, hero=False):
        pill = '<span class="pill good"><span class="dot"></span> Connected</span>' if onb == 'Connected' else '<span class="pill amber"><span class="dot"></span> Pending</span>'
        k = '<span class="pill ink">Verified</span>' if kyc else '<span class="pill ink" style="opacity:.6">Unverified</span>'
        return f'<div class="tr{" hero" if hero else ""}"><div><div class="nm">{m["n"]}</div><div class="ac">{m["acct"]}</div></div><div>{m["e"].split("@")[0]}@…</div><div>{pill}</div><div>{k}</div></div>'
    rows = tr(M[0], 'Connected', True) + tr(M[1], 'Connected', True) + tr(M[3], 'Connected', True, hero=True) + tr(M[6], 'Pending', False) + tr(M[13], 'Connected', True)
    html = f'''<div class="title in" data-i="0">{eyebrow('Connected accounts')}<div class="h1">Every merchant, one screen</div><div class="sub">Who they are, whether they're live, whether their checks are done.</div></div>
<div class="glass liquid count in" data-i="1"><div class="rim"></div><div class="lbl">Active merchants</div><div class="num" data-n="37" data-int="1">0</div><div class="sub">Live and taking payments</div></div>
<div class="scene"><div class="panel"><div class="glass liquid tbl in" data-i="2"><div class="rim"></div><div class="hd"><div>Business</div><div>Contact</div><div>Onboarding</div><div>Identity</div></div>{rows}</div></div></div>
<div class="foot in" data-i="3">Identity checks are NeroPay's. Everything else on this screen is yours to act on.</div>'''
    write('s05-register', 'S5 the register — tilted panel', css, html, panel_extra(-20, 8, 1), lx=-560, ly=-760, lo=.5, lx2=1400, ly2=700, lo2=.28)

def s06():
    css = CASCADE_CSS % dict(po='50% 55%', sx=180, sy=260, ry=-8, rx=6, hs=56, more='''
.c{width:330px;height:300px;padding:28px 30px}
.c .n{width:56px;height:56px;border-radius:50%;background:rgba(11,18,32,.08);display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;color:var(--ink);margin-bottom:16px}
.c.last .n{background:var(--yel)}
.title{top:80px;width:1000px}
.s1{left:0;top:0;transform:translateZ(-160px)}
.s2{left:320px;top:60px;transform:translateZ(-80px)}
.s3{left:640px;top:120px;transform:translateZ(0)}
.s4{left:960px;top:180px;transform:translateZ(80px)}
.s5{left:1280px;top:240px;transform:translateZ(160px);background:rgba(255,255,255,.75)}
''')
    steps = [('1', 'The person', 'Name, nationality, date of birth, contact'), ('2', 'The business', 'Trading and legal identity'), ('3', 'Addresses', 'Registered and trading'), ('4', 'Terms', 'Agreement accepted'), ('5', 'Review', 'Confirm, and they are live')]
    cards = ''.join(f'<div class="glass liquid c s{k+1}{" last" if k == 4 else ""} in" data-i="{k+1}"><div class="rim"></div><div><div class="n">{a}</div><div class="lbl">{b}</div><div class="sub">{c}</div></div><div class="sub" style="color:var(--mut)">{"NeroPay runs the checks" if k == 4 else "Validated before the next step"}</div></div>' for k, (a, b, c) in enumerate(steps))
    html = f'''<div class="title in" data-i="0">{eyebrow('Connected accounts')}<div class="h1">Adding a merchant: five steps</div></div>
<div class="scene"><div class="stack">{cards}</div></div>
<div class="foot in" data-i="6">Each step checks itself before the next unlocks. Identity verification runs through NeroPay.</div>'''
    write('s06-five-steps', 'S6 five steps — cascade', css, html, "const p=eio((n%220)/220); document.querySelector('.stack').style.transform=`rotateY(${-8+p*4}deg) rotateX(${6-p*2}deg) translateX(${-40*ease(seg(n,60,80))}px)`;", lx=1100, ly=-600, lo=.5, lx2=-400, ly2=700, lo2=.3)

def s07():
    ctls = [
        ('left:700px;top:150px;width:520px', 'rotateY(-10deg) rotateX(4deg) translateZ(40px)', '<div class="lbl">Who pays the processing fee</div><div class="val">Agreed with NeroPay</div><div class="ro"><i></i> Read only · change by request</div>', True),
        ('left:1260px;top:190px;width:520px', 'rotateY(-14deg) rotateX(5deg) translateZ(-20px)', '<div class="lbl">Who pays the monthly account fee</div><div class="val">Agreed with NeroPay</div><div class="ro"><i></i> Read only · change by request</div>', True),
        ('left:700px;top:440px;width:1080px', 'rotateY(-11deg) rotateX(6deg) translateZ(140px)', '<div class="yline" style="margin-bottom:16px"></div><div class="lbl" style="color:var(--ink);font-size:24px;font-weight:600">What your merchants are charged</div><div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;margin-top:8px"><div class="field"><div class="lbl">Card terminal</div><div class="box">Yours to set</div></div><div class="field"><div class="lbl">Online</div><div class="box">Yours to set</div></div><div class="field"><div class="lbl">Keyed</div><div class="box">Yours to set</div></div></div>', False),
    ]
    form_scene('s07-who-sets-what', 'Pricing', 'Who sets what', 'Two things are agreed with NeroPay. The rest is yours.', ctls,
               'Merchant pricing is yours in every arrangement. Per-merchant rates can override your defaults.', lx=-700, ly=-800, lx2=1500, ly2=300, lo2=.3)

def s08():
    src = open(os.path.join(HERE, 'glass', 'v4-cascade.html')).read().replace('href="glass.css"', 'href="../glass/glass.css"')
    open(os.path.join(HERE, 'scenes', 's08-margin.html'), 'w').write(src)

HERO_CSS = '''
.bgcards{position:absolute;inset:0;perspective:2200px}
.bg{position:absolute;padding:34px 40px;width:520px;height:250px;filter:blur(var(--b,6px));opacity:.9}
.bg .lbl{font-size:22px}.bg .num{font-size:60px;margin-top:10px}.bg .sub{font-size:18px;margin-top:22px}
.bg .big{font-size:34px;font-weight:600;margin-top:12px;letter-spacing:-.02em}
.b1{left:110px;top:120px;transform:rotateY(14deg) rotateX(4deg) translateZ(-260px)}
.b2{left:1300px;top:150px;transform:rotateY(-16deg) rotateX(6deg) translateZ(-320px)}
.b3{left:40px;top:720px;transform:rotateY(12deg) rotateX(-6deg) translateZ(-200px)}
.b4{left:1500px;top:730px;transform:rotateY(-14deg) rotateX(-5deg) translateZ(-240px)}
.hero{position:absolute;left:50%%;top:50%%;transform:translate(-50%%,-50%%);width:%(pw)spx;height:300px;border-radius:150px;display:flex;align-items:center;justify-content:center;gap:48px;padding:0 70px}
.hero .num{font-size:%(ns)spx;letter-spacing:-.045em}
.hero .side{display:flex;flex-direction:column;gap:10px}
.hero .side .lbl{font-size:30px;font-weight:600;color:var(--ink)}
.hero .side .sub{font-size:22px;max-width:380px}
.hero.glass{background:rgba(255,255,255,.58);-webkit-backdrop-filter:blur(34px) saturate(180%%);backdrop-filter:blur(34px) saturate(180%%)}
.hero.glass::after{box-shadow:0 0 0 1.5px rgba(255,255,255,.9),0 0 0 2.5px rgba(11,18,32,.06)}
.cap{position:absolute;left:50%%;transform:translateX(-50%%);top:790px;text-align:center;width:540px}
.cap .eyebrow{margin-bottom:12px}
.cap .sub{font-size:22px;line-height:1.35}
.orb{position:absolute;width:260px;height:260px;border-radius:50%%;left:1440px;top:420px;background:rgba(255,255,255,.35);-webkit-backdrop-filter:blur(8px) saturate(200%%);backdrop-filter:blur(8px) saturate(200%%);box-shadow:0 30px 60px -20px rgba(11,18,32,.25),0 1px 0 rgba(255,255,255,.9) inset}
.orb::before{content:"";position:absolute;inset:0;border-radius:50%%;background:radial-gradient(circle at 35%% 30%%,rgba(255,255,255,.9),rgba(255,255,255,0) 55%%)}
.orb.s{width:120px;height:120px;left:300px;top:560px}
%(more)s
'''

def hero_scene(name, title, bgs, hero_num, hero_lbl, hero_sub, cap_sec, cap_sub, pw=1120, ns=150, more='', count=True, lx=-700, ly=-900, lx2=1200, ly2=500, lo2=.35, orb_left=1440):
    css = HERO_CSS % dict(pw=pw, ns=ns, more=more)
    bg = ''.join(f'<div class="glass bg b{k+1} in" data-i="{k}" style="--b:{b}px">{inner}</div>' for k, (b, inner) in enumerate(bgs))
    numhtml = f'<div class="num"{" data-n=%s" % hero_num[1] if count else ""}>{hero_num[0]}</div>' if hero_num else ''
    html = f'''<div class="bgcards">{bg}</div>
<div class="orb" style="left:{orb_left}px"></div><div class="orb s"></div>
<div class="glass liquid hero in" data-i="4"><div class="rim"></div><div class="drop" style="width:26px;height:26px;left:120px;top:38px"></div><div class="drop" style="width:14px;height:14px;left:{pw-140}px;top:230px"></div>
{numhtml}<div class="side"><div class="lbl">{hero_lbl}</div><div class="sub">{hero_sub}</div></div></div>
<div class="cap in" data-i="5">{eyebrow(cap_sec)}<div class="sub">{cap_sub}</div></div>'''
    extra = "document.querySelector('.orb').style.transform=`translateY(${Math.sin(n/40)*14}px)`; const h=document.querySelector('.hero'); const t=ease(seg(n,28,24)); h.style.transform=`translate(-50%,-50%) scale(${.94+.06*t})`; h.style.opacity=t; const d=1+.05*ease(seg(n,90,90)); document.querySelectorAll('.bg').forEach(b=>b.style.filter=`blur(${(+b.style.getPropertyValue('--b').replace('px','')||6)*d}px)`);"
    write(name, title, css, html, extra, lx=lx, ly=ly, lo=.5, lx2=lx2, ly2=ly2, lo2=lo2)

def s09():
    bgs = [(7, '<div class="lbl">Extra service</div><div class="big">SMS receipts</div><div class="sub">Priced by you, floored by NeroPay</div>'),
           (9, '<div class="lbl">Extra service</div><div class="big">Instant payouts</div><div class="sub">Priced by you, floored by NeroPay</div>'),
           (5, '<div class="lbl">Extra service</div><div class="big">Refunds</div><div class="sub">Priced by you, floored by NeroPay</div>'),
           (8, '<div class="lbl">Extra service</div><div class="big">Non-UK cards</div><div class="sub">Priced by you, floored by NeroPay</div>')]
    hero_scene('s09-floor', 'S9 the floor — hero pill', bgs, ('0.00%', None), 'At cost', 'Set a service at the floor and it passes through at NeroPay\'s cost. Never below it.', 'Pricing', 'Never below NeroPay\'s cost. Set at the floor, it passes through.', ns=140, count=False, lx=1000, ly=-700, lx2=-400, ly2=600)

def s10():
    ctls = [
        ('left:700px;top:150px;width:1080px', 'rotateY(-9deg) rotateX(4deg) translateZ(80px)', f'<div class="lbl">Your login link</div><div class="url" style="margin-top:10px">{P["domain"]}<b>/login</b></div><div class="ro"><i style="background:var(--yel)"></i> Your domain is live · links use it automatically</div>', False),
        ('left:700px;top:400px;width:500px', 'rotateY(-12deg) rotateX(6deg) translateZ(20px)', '<div class="lbl">Show NeroPay logo on checkout</div><div class="tog" style="margin-top:14px"><span class="sw off"><i></i></span> Off</div><div class="ro"><i></i> Full white label</div>', True),
        ('left:1240px;top:430px;width:540px', 'rotateY(-15deg) rotateX(5deg) translateZ(-30px)', '<div class="lbl">Your logo</div><div class="val" style="display:flex;align-items:center;gap:16px"><span style="width:48px;height:48px;border-radius:14px;background:var(--navy);display:inline-block"></span> Harbourline</div><div class="ro"><i></i> On the dashboard, the checkout, the emails</div>', True),
        ('left:700px;top:660px;width:1080px', 'rotateY(-10deg) rotateX(7deg) translateZ(150px)', f'<div class="lbl">Custom domain · DNS</div><div class="dns" style="margin-top:14px"><b>CNAME</b><span>pay &nbsp;→&nbsp; NeroPay endpoint</span><b>TXT</b><span>{P["txt_token"][:22]}…</span></div><div class="ro"><i style="background:var(--good)"></i> Checked · SSL ready</div>', False),
    ]
    form_scene('s10-branding', 'Branding', 'Your logo. Your domain. Your link.', 'Your merchants see your brand, and only your brand.', ctls,
               'Turn the NeroPay mark back on where it adds credibility at checkout. Your call.', lx=1000, ly=-700, lx2=-400, ly2=700)

def s11():
    css = PANEL_CSS % dict(po='70% 45%', px=700, py=150, pw=1140, ry=-18, rx=8, rz=1, hs=54, more='''
.modes{display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;transform-style:preserve-3d}
.mode{padding:28px 30px;height:250px;display:flex;flex-direction:column;justify-content:space-between}
.mode .t{font-size:24px;font-weight:600;color:var(--ink)} .mode .sub{font-size:18px;margin-top:10px}
.mode.on{background:rgba(255,255,255,.74);transform:translateZ(90px)}
.item{margin-top:26px;padding:30px 34px;display:grid;grid-template-columns:1.4fr 1fr 1fr 1fr;gap:24px;align-items:center;transform:translateZ(40px)}
.item .nm{font-size:26px;font-weight:600} .item .k{font-size:17px;color:var(--mut)} .item .v{font-size:24px;font-weight:600;margin-top:6px}
.item .bar{height:12px;border-radius:6px;background:rgba(11,18,32,.08);margin-top:12px;overflow:hidden} .item .bar i{display:block;height:100%;width:var(--w,0%);background:var(--yel);border-radius:6px}
''')
    html = f'''<div class="title in" data-i="0">{eyebrow('Store')}<div class="h1">Your store. Your prices.</div><div class="sub">Terminals, tills and accessories, sold under your name.</div></div>
<div class="scene"><div class="panel"><div class="modes">
<div class="glass liquid mode in" data-i="1"><div class="rim"></div><div><div class="t">NeroPay store</div><div class="sub">The standard store, NeroPay branding</div></div><div class="sub">Mode 1</div></div>
<div class="glass liquid mode on in" data-i="2"><div class="rim"></div><div><div class="yline" style="margin-bottom:14px"></div><div class="t">White-label store</div><div class="sub">Your branding, neutral product names</div></div><div class="sub">Mode 2 · selected</div></div>
<div class="glass liquid mode in" data-i="3"><div class="rim"></div><div><div class="t">Hidden</div><div class="sub">You order the hardware yourself</div></div><div class="sub">Mode 3</div></div>
</div>
<div class="glass liquid item in" data-i="4"><div class="rim"></div><div><div class="nm">Card terminal</div><div class="k">One catalogue item</div></div><div><div class="k">Supply cost</div><div class="v">NeroPay's</div><div class="bar"><i style="--w:55%"></i></div></div><div><div class="k">Your price</div><div class="v">Yours</div><div class="bar"><i style="--w:88%"></i></div></div><div><div class="k">Your margin</div><div class="v">The difference</div><div class="bar"><i class="m" style="--w:33%"></i></div></div></div>
</div></div>
<div class="foot in" data-i="5">NeroPay ships, supports and handles returns. You set the price and keep the margin.</div>'''
    extra = panel_extra(-18, 8, 1) + " const w=ease(seg(n,40,40)); document.querySelector('.item .bar i.m').style.setProperty('--w',(33*w)+'%');"
    write('s11-store', 'S11 the store — tilted panel', css, html, extra, lx=-600, ly=-800, lo=.5, lx2=1500, ly2=760, lo2=.3)

def s12():
    src = open(os.path.join(HERE, 'glass', 'm18-ledger-tiles.html')).read().replace('href="glass.css"', 'href="../glass/glass.css"')
    open(os.path.join(HERE, 'scenes', 's12-reports.html'), 'w').write(src)

def s13():
    src = open(os.path.join(HERE, 'glass', 'v3-chart-card.html')).read().replace('href="glass.css"', 'href="../glass/glass.css"')
    open(os.path.join(HERE, 'scenes', 's13-trend.html'), 'w').write(src)

def s14():
    bgs = [(7, '<div class="lbl">Payments processed</div><div class="num">£1,842.60</div><div class="sub">61 card payments across your merchants</div>'),
           (9, '<div class="lbl">Reserve</div><div class="big">Held back for thin days</div><div class="sub">Keeps platform-paid processing moving</div>'),
           (5, '<div class="lbl">Your net margin</div><div class="num">£18.35</div><div class="sub">What you keep</div>'),
           (8, '<div class="lbl">Active merchants</div><div class="num">37</div><div class="sub">Live and taking payments</div>')]
    hero_scene('s14-wallet', 'S14 the wallet — hero pill', bgs, ('£0.00', '2418.36'), 'Available balance', 'Cleared funds, yours to move. A reserve sits behind it so payouts keep flowing.', 'Wallet', 'Yours to move. The reserve covers a thin day.', lx=-700, ly=-900, lx2=1250, ly2=560)

def s15():
    css = ROW_CSS + '''
.rows{left:640px;top:130px;width:1160px}
.row{height:380px;padding:38px 44px;align-items:start;grid-template-columns:1fr 1fr}
.row .t{font-size:34px;font-weight:600;letter-spacing:-.02em}
.row ul{list-style:none;margin-top:18px;padding:0} .row li{font-size:21px;color:var(--ink2);padding:8px 0 8px 30px;position:relative} .row li::before{content:"";position:absolute;left:0;top:18px;width:12px;height:12px;border-radius:50%;background:rgba(11,18,32,.18)}
.row.lit li::before{background:var(--yel)}
'''
    html = f'''<div class="title in" data-i="0">{eyebrow('Support')}<div class="h1">Two tiers of support</div><div class="sub">Free covers you. Premium covers your merchants, in your name.</div></div>
<div class="scene"><div class="rows">
<div class="glass liquid row in" data-i="1"><div class="rim"></div><div><div class="t">Free</div><div class="sub">Included</div><ul><li>Your platform dashboard and settings</li><li>Live chat in UK hours, and the guides</li></ul></div><div><div class="sub">You handle</div><ul><li>Your merchants' questions</li><li>Shipping queries</li></ul></div></div>
<div class="glass liquid row lit in" data-i="2"><div class="rim"></div><div><div class="yline" style="margin-bottom:14px"></div><div class="t">Premium</div><div class="sub">Monthly · white-label</div><ul><li>Your merchants' tickets and live chat</li><li>Their hardware shipped and supported</li></ul></div><div><div class="sub">Answered as you</div><ul><li>Phone support under your name</li><li>Devices prepared in your branding</li></ul></div></div>
</div></div>
<div class="foot in" data-i="3">The Premium price is shown on the Connect Support screen.</div>'''
    extra = "const p=eio((n%210)/210); document.querySelector('.rows').style.transform=`rotateY(${-12+p*4}deg) rotateX(${5-p*2}deg)`; const z=ease(seg(n,40,30)); const lit=document.querySelector('.row.lit'); lit.dataset.tf=`translateZ(${90*z}px)`;"
    write('s15-support', 'S15 support — two tall rows', css, html, extra, lx=1000, ly=-600, lo=.5, lx2=-500, ly2=700, lo2=.3, stag=8)

def s16():
    css = HERO_CSS % dict(pw=1240, ns=120, more='''
.hero{flex-direction:column;gap:14px;height:340px;border-radius:60px}
.hero .big{font-size:76px;font-weight:600;letter-spacing:-.03em;line-height:1.05;text-align:center}
.hero .big b{font-weight:600;color:var(--ink)}
.hero .mark{font-size:40px;font-weight:700;letter-spacing:-.02em;margin-top:8px}
.hero .mark b{color:var(--ink)}
.hero .mk{width:64px;height:6px;border-radius:3px;background:var(--yel);margin-top:18px}
.url{position:absolute;left:50%;top:770px;transform:translateX(-50%);display:inline-flex;align-items:center;gap:16px;padding:18px 34px;border-radius:999px;font-size:30px;font-weight:600}
.url i{width:12px;height:12px;border-radius:50%;background:var(--yel)}
''')
    html = '''<div class="orb" style="left:1500px;top:180px"></div><div class="orb s" style="left:240px;top:640px"></div>
<div class="glass liquid hero in" data-i="0"><div class="rim"></div><div class="drop" style="width:26px;height:26px;left:120px;top:38px"></div>
<div class="big">Your merchants.<br>Your brand.</div><div class="mark">Nero<b>Connect</b></div><div class="mk"></div></div>
<div class="glass liquid url in" data-i="2"><div class="rim"></div><i></i> docs.neropay.app</div>
<div class="cap in" data-i="3" style="top:870px"><div class="sub">The full guides, screen by screen.</div></div>'''
    extra = "document.querySelectorAll('.orb').forEach((o,k)=>o.style.transform=`translateY(${Math.sin(n/40+k)*14}px)`); const h=document.querySelector('.hero'); const t=ease(seg(n,10,26)); h.style.transform=`translate(-50%,-50%) scale(${.94+.06*t})`; h.style.opacity=t;"
    write('s16-close', 'S16 close — text only', css, html, extra, lx=-600, ly=-800, lo=.5, lx2=1300, ly2=600, lo2=.32)

# the two archetype references, kept beside the approved five
def refs():
    rows = ['<div><div class="who">Reference row</div><div class="meta">A glass row, sliding in on its own frame</div></div><div class="kv">Detail</div><div class="r"><span class="pill ink">Status</span></div>',
            '<div><div class="who">The lit row</div><div class="meta">One row lifts and carries the accent</div></div><div class="kv">Detail</div><div class="r"><span class="pill red"><span class="dot"></span> Needs response</span></div>',
            '<div><div class="who">Another row</div><div class="meta">Stagger six frames</div></div><div class="kv">Detail</div><div class="r"><span class="pill good"><span class="dot"></span> Connected</span></div>',
            '<div><div class="who">And another</div><div class="meta">Never more than five</div></div><div class="kv">Detail</div><div class="r"><span class="pill amber"><span class="dot"></span> Pending</span></div>']
    p = rows_scene('v5-row-stack', 'Reference', 'Row stack', 'Glass rows sliding in one at a time, one lit.', rows, 'For lists: the attention queue, the register, fee rows, orders, support plans.', 1, '1fr 220px 260px')
    os.replace(p, os.path.join(HERE, 'glass', 'v5-row-stack.html'))
    ctls = [('left:700px;top:150px;width:520px', 'rotateY(-10deg) rotateX(4deg) translateZ(40px)', '<div class="lbl">A toggle</div><div class="tog" style="margin-top:14px"><span class="sw"><i></i></span> On</div>', False),
            ('left:1260px;top:190px;width:520px', 'rotateY(-14deg) rotateX(5deg) translateZ(-20px)', '<div class="lbl">A read-only panel</div><div class="val">Agreed with NeroPay</div><div class="ro"><i></i> Read only</div>', True),
            ('left:700px;top:420px;width:1080px', 'rotateY(-9deg) rotateX(4deg) translateZ(80px)', '<div class="lbl">A URL pill</div><div class="url" style="margin-top:10px">pay.harbourline.co.uk<b>/login</b></div>', False),
            ('left:700px;top:620px;width:520px', 'rotateY(-12deg) rotateX(7deg) translateZ(150px)', '<div class="lbl">A field with its floor</div><div class="field"><div class="box">Yours to set</div><div class="floor">Floor: NeroPay\'s cost</div></div>', False),
            ('left:1260px;top:640px;width:520px', 'rotateY(-15deg) rotateX(6deg) translateZ(20px)', '<div class="lbl">A DNS record</div><div class="dns" style="margin-top:14px"><b>CNAME</b><span>pay → endpoint</span></div>', True)]
    p = form_scene('v6-floating-form', 'Reference', 'Floating form', 'Controls as glass objects hovering at slight angles.', ctls, 'For settings, pricing, branding, domain, store modes.')
    os.replace(p, os.path.join(HERE, 'glass', 'v6-floating-form.html'))
    # the references sit in glass/, so their stylesheet path is local
    for f in ['v5-row-stack.html', 'v6-floating-form.html']:
        q = os.path.join(HERE, 'glass', f); s = open(q).read().replace('href="../glass/glass.css"', 'href="glass.css"'); open(q, 'w').write(s)

if __name__ == '__main__':
    os.makedirs(os.path.join(HERE, 'scenes'), exist_ok=True)
    for fn in [s01, s02, s03, s04, s05, s06, s07, s08, s09, s10, s11, s12, s13, s14, s15, s16, refs]: fn()
    print('scenes:', sorted(f for f in os.listdir(os.path.join(HERE, 'scenes'))))

/* NeroPay Content Warehouse — rendering + sketches */
(function () {
  "use strict";

  /* ---------- rough sketch library ----------
     Every sketch is a hand-drawn-feel wireframe, not a finished design.
     It exists to show composition: where the subject sits, where type goes,
     what the eye hits first. Swap for real creative when it's shot.        */

  var SK = {};

  SK.reel = function (o) {
    o = o || {};
    var rows = (o.beats || []).slice(0, 4);
    var s = '<svg viewBox="0 0 200 356" role="img" aria-label="Rough sketch: vertical reel frame. ' + esc(o.alt || '') + '">';
    s += '<rect x="1" y="1" width="198" height="354" rx="3" class="s-fill" stroke="var(--sk-line)" stroke-width="1.3"/>';
    s += '<rect x="9" y="9" width="182" height="22" class="s-line" stroke-dasharray="3 3"/>';
    s += '<text class="s-t" x="15" y="24">AI-generated presenter · first 3s</text>';
    if (o.subject === 'presenter') {
      s += '<circle cx="100" cy="132" r="30" class="s-line"/>';
      s += '<path d="M62 196 q38 -34 76 0" class="s-line"/>';
      s += '<text class="s-t" x="100" y="216" text-anchor="middle">presenter, centre, eyes to lens</text>';
    } else if (o.subject === 'product') {
      s += '<rect x="52" y="104" width="96" height="62" rx="4" class="s-line"/>';
      s += '<rect x="62" y="114" width="76" height="34" class="s-dash"/>';
      s += '<path d="M40 166 h120" class="s-line"/>';
      s += '<text class="s-t" x="100" y="186" text-anchor="middle">terminal on counter, locked off</text>';
    } else if (o.subject === 'street') {
      s += '<path d="M18 190 h164" class="s-line"/>';
      s += '<rect x="24" y="118" width="44" height="72" class="s-line"/>';
      s += '<rect x="74" y="102" width="52" height="88" class="s-line"/>';
      s += '<rect x="132" y="126" width="44" height="64" class="s-line"/>';
      s += '<rect x="30" y="128" width="32" height="12" class="s-dash"/>';
      s += '<rect x="82" y="112" width="36" height="12" class="s-dash"/>';
      s += '<text class="s-t" x="100" y="212" text-anchor="middle">shopfronts, walking, handheld</text>';
    } else if (o.subject === 'graphic') {
      for (var g = 0; g < 5; g++) {
        s += '<rect x="30" y="' + (104 + g * 20) + '" width="140" height="13" class="' + (g === 0 ? 's-yl' : 's-fill') + '" stroke="var(--sk-line)" stroke-width="1"/>';
      }
      s += '<text class="s-t" x="100" y="216" text-anchor="middle">figures build one row at a time</text>';
    }
    var y = 240;
    rows.forEach(function (b) {
      s += '<rect x="20" y="' + y + '" width="160" height="12" class="s-fill" stroke="var(--sk-line)" stroke-width="1"/>';
      s += '<text class="s-t" x="24" y="' + (y + 9) + '">' + esc(b) + '</text>';
      y += 18;
    });
    s += '<rect x="20" y="318" width="160" height="20" class="s-dash"/>';
    s += '<text class="s-t" x="100" y="331" text-anchor="middle">burned-in subtitles · watched on mute</text>';
    s += '</svg>';
    return s;
  };

  SK.carousel = function (o) {
    o = o || {};
    var cards = (o.cards || []).slice(0, 4);
    var w = 200, cw = 44, gap = 8, x0 = 4;
    var s = '<svg viewBox="0 0 ' + w + ' 132" role="img" aria-label="Rough sketch: carousel cards. ' + esc(o.alt || '') + '">';
    cards.forEach(function (c, i) {
      var x = x0 + i * (cw + gap);
      s += '<rect x="' + x + '" y="6" width="' + cw + '" height="55" rx="2" class="' + (i === 0 ? 's-yl' : 's-fill') + '" stroke="var(--sk-line)" stroke-width="1.2"/>';
      if (i === 0) {
        s += '<rect x="' + (x + 6) + '" y="20" width="32" height="5" fill="var(--ink)" opacity=".55"/>';
        s += '<rect x="' + (x + 6) + '" y="29" width="24" height="5" fill="var(--ink)" opacity=".35"/>';
      } else {
        s += '<rect x="' + (x + 5) + '" y="14" width="14" height="4" class="s-yl"/>';
        s += '<rect x="' + (x + 5) + '" y="24" width="34" height="4" fill="var(--sk-line)" opacity=".6"/>';
        s += '<rect x="' + (x + 5) + '" y="32" width="28" height="4" fill="var(--sk-line)" opacity=".4"/>';
        s += '<rect x="' + (x + 5) + '" y="44" width="34" height="9" class="s-dash"/>';
      }
      s += '<text class="s-t" x="' + (x + cw / 2) + '" y="74" text-anchor="middle">' + esc(c) + '</text>';
    });
    s += '<text class="s-t" x="4" y="104">4:5 cards · charcoal ground · one yellow accent per card</text>';
    s += '<text class="s-t" x="4" y="118">card 1 is the title, last card carries the payoff line</text>';
    s += '</svg>';
    return s;
  };

  SK.statcard = function (o) {
    o = o || {};
    var s = '<svg viewBox="0 0 200 200" role="img" aria-label="Rough sketch: stat card. ' + esc(o.alt || '') + '">';
    s += '<rect x="1" y="1" width="198" height="198" rx="3" fill="var(--ink)"/>';
    s += '<text x="100" y="86" text-anchor="middle" font-family="Schibsted Grotesk,sans-serif" font-size="34" font-weight="800" fill="var(--yl)">' + esc(o.big || '00%') + '</text>';
    s += '<rect x="70" y="100" width="60" height="2" class="s-yl"/>';
    s += '<text x="100" y="126" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" fill="#EDEDED">' + esc(o.line1 || '') + '</text>';
    s += '<text x="100" y="140" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="8" fill="#9A9A9A">' + esc(o.line2 || '') + '</text>';
    s += '<text x="100" y="180" text-anchor="middle" font-family="IBM Plex Sans,sans-serif" font-size="6.5" fill="#7A7A7A">' + esc(o.src || '') + '</text>';
    s += '</svg>';
    return s;
  };

  SK.photo = function (o) {
    o = o || {};
    var s = '<svg viewBox="0 0 200 132" role="img" aria-label="Rough sketch: photo composition. ' + esc(o.alt || '') + '">';
    s += '<rect x="1" y="1" width="198" height="112" rx="2" class="s-fill" stroke="var(--sk-line)" stroke-width="1.3"/>';
    s += '<path d="M67 1 V113 M133 1 V113 M1 38 H199 M1 76 H199" class="s-dash"/>';
    (o.shapes || []).forEach(function (sh) {
      s += '<rect x="' + sh[0] + '" y="' + sh[1] + '" width="' + sh[2] + '" height="' + sh[3] + '" class="s-line"/>';
    });
    if (o.focus) s += '<circle cx="' + o.focus[0] + '" cy="' + o.focus[1] + '" r="7" class="s-yl"/>';
    s += '<text class="s-t" x="4" y="126">' + esc(o.note || '') + '</text>';
    s += '</svg>';
    return s;
  };

  SK.none = function () {
    var s = '<svg viewBox="0 0 200 96" role="img" aria-label="Rough sketch: text only, no image.">';
    s += '<rect x="1" y="1" width="198" height="94" rx="3" class="s-dash"/>';
    for (var i = 0; i < 5; i++) {
      s += '<rect x="18" y="' + (20 + i * 12) + '" width="' + (164 - (i === 4 ? 70 : 0)) + '" height="4" fill="var(--sk-line)" opacity="' + (0.5 - i * 0.06) + '"/>';
    }
    s += '<text class="s-t" x="100" y="88" text-anchor="middle">no image — deliberately</text>';
    s += '</svg>';
    return s;
  };

  function esc(t) {
    return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------- post rendering ---------- */

  function renderPost(p) {
    var sk = SK[p.sketch.type] ? SK[p.sketch.type](p.sketch) : SK.none();
    var h = '<article class="post" id="' + p.id + '" data-ch="' + p.channel + '" data-pillar="' + p.pillar + '" data-status="' + (p.blocked ? 'blocked' : 'ready') + '">';
    h += '<div class="post-h">';
    h += '<span class="id">' + esc(p.id) + '</span>';
    h += '<h3>' + esc(p.title) + '</h3>';
    h += '<span class="chip ' + (p.channel === 'linkedin' ? 'li' : 'mt') + '">' + (p.channel === 'linkedin' ? 'LinkedIn' : 'IG + FB') + '</span>';
    h += '<span class="chip p">' + esc(p.pillar) + '</span>';
    h += '<span class="chip d">' + esc(p.format) + '</span>';
    h += '<span class="chip d">' + esc(p.date) + '</span>';
    h += '<span class="chip ' + (p.blocked ? 'blocked' : 'ready') + '">' + (p.blocked ? 'Blocked' : 'Ready') + '</span>';
    h += '</div><div class="post-b"><div>';
    h += '<div class="copy" id="c-' + p.id + '">' + esc(p.copy) + '</div>';
    h += '<button class="cp" type="button" data-copy="c-' + p.id + '">Copy text</button>';
    h += '<div class="mb"><span class="lbl">Creative — in words</span><p>' + esc(p.creative) + '</p></div>';
    if (p.why) h += '<div class="mb"><span class="lbl">Why it works</span><p>' + esc(p.why) + '</p></div>';
    if (p.blocked) h += '<div class="flag"><b>Blocked</b>' + esc(p.blocked) + '</div>';
    h += '</div><div><div class="sk">' + sk + '<p class="cap">' + esc(p.sketch.cap || 'Rough sketch — composition only.') + '</p></div></div>';
    h += '</div></article>';
    return h;
  }

  function mount(sel, list) {
    var el = document.querySelector(sel);
    if (!el) return;
    el.innerHTML = list.map(renderPost).join('');
  }

  /* ---------- filters ---------- */
  function wireFilters(scope) {
    var root = document.querySelector(scope);
    if (!root) return;
    var btns = root.querySelectorAll('button.f[data-filter]');
    var out = root.querySelector('[data-count]');
    function apply() {
      var active = {};
      btns.forEach(function (b) {
        if (b.getAttribute('aria-pressed') === 'true') {
          var k = b.dataset.filter, v = b.dataset.value;
          (active[k] = active[k] || []).push(v);
        }
      });
      var n = 0;
      root.querySelectorAll('.post').forEach(function (card) {
        var show = Object.keys(active).every(function (k) {
          return active[k].indexOf(card.dataset[k]) > -1;
        });
        card.hidden = !show;
        if (show) n++;
      });
      if (out) out.textContent = n + ' of ' + root.querySelectorAll('.post').length + ' shown';
    }
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.getAttribute('aria-pressed') === 'true';
        if (b.dataset.exclusive === 'true') {
          root.querySelectorAll('button.f[data-filter="' + b.dataset.filter + '"]').forEach(function (o) {
            o.setAttribute('aria-pressed', 'false');
          });
        }
        b.setAttribute('aria-pressed', on ? 'false' : 'true');
        apply();
      });
    });
    apply();
  }

  /* ---------- copy ---------- */
  function toast(msg) {
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 1500);
  }
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-copy]');
    if (!b) return;
    var src = document.getElementById(b.dataset.copy);
    if (!src) return;
    var txt = src.innerText;
    var done = function () { toast('Copied'); };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, fallback);
      } else { fallback(); }
    } catch (err) { fallback(); }
    function fallback() {
      try {
        var ta = document.createElement('textarea');
        ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); document.body.removeChild(ta); done();
      } catch (e2) {
        var r = document.createRange(); r.selectNodeContents(src);
        var s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
        toast('Selected — press Ctrl/Cmd+C');
      }
    }
  });

  /* ---------- nav current ---------- */
  function markNav() {
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a.n').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href === here || (here === '' && href === 'index.html')) a.setAttribute('aria-current', 'page');
    });
  }

  window.NP = { SK: SK, mount: mount, wireFilters: wireFilters, esc: esc, toast: toast };
  document.addEventListener('DOMContentLoaded', markNav);
})();

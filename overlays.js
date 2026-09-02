/* NeroPay Content Warehouse — post-production assets for the video series.

   Every graphic here is one generation-pack.md already calls for: the 21 overlay
   stills, the title and end cards, the AI-presenter disclosure and the two specimen
   statements. Nothing new is invented. They are drawn as SVG so every figure is
   exact — video and image models mangle numbers, this doesn't — and exported to
   PNG (transparent, or on black for keying) from youtube.html.

   Rules baked in: pure black or transparent ground, white sans-serif, one yellow
   accent, no icons, no gradients, no logos except the wordmark on the cards.       */
window.OVERLAY_ART = (function () {
  "use strict";

  var Y = '#F5C518', W = '#FFFFFF', D = '#9A9A9A', K = '#000000';
  var SANS = "Chivo,'Helvetica Neue',Helvetica,Arial,sans-serif";
  var MONO = "'Martian Mono',Menlo,Consolas,monospace";
  var F16 = { w: 1920, h: 1080, m: 160, ar: '16:9' };
  var F9  = { w: 1080, h: 1920, m: 100, ar: '9:16' };

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /* one <text>. s is a string or an array of segments [{s, fill, w, size}] */
  function t(x, y, s, o) {
    o = o || {};
    var a = '<text x="' + x + '" y="' + y + '" font-family="' + (o.mono ? MONO : SANS) + '"' +
      ' font-size="' + (o.size || 48) + '" font-weight="' + (o.w || 400) + '" fill="' + (o.fill || W) + '"';
    if (o.anchor) a += ' text-anchor="' + o.anchor + '"';
    if (o.ls) a += ' letter-spacing="' + o.ls + '"';
    if (o.op != null) a += ' opacity="' + o.op + '"';
    a += ' style="font-variant-numeric:tabular-nums">';
    if (Array.isArray(s)) {
      s.forEach(function (g) {
        a += '<tspan' + (g.fill ? ' fill="' + g.fill + '"' : '') + (g.w ? ' font-weight="' + g.w + '"' : '') +
          (g.size ? ' font-size="' + g.size + '"' : '') + '>' + esc(g.s) + '</tspan>';
      });
    } else a += esc(s);
    return a + '</text>';
  }

  /* naive word wrap on an average glyph width — good enough for these lengths */
  function wrap(s, max) {
    if (Array.isArray(s)) return [s];
    var words = String(s).split(' '), lines = [], cur = '';
    words.forEach(function (w) {
      var next = (cur + ' ' + w).trim();
      if (next.length > max && cur) { lines.push(cur); cur = w; } else cur = next;
    });
    if (cur) lines.push(cur);
    return lines;
  }

  /* A vertical stack of blocks, centred in the frame unless o.top is given.
     kinds: text | row | rule | gap | check | minus                              */
  function stack(blocks, F, o) {
    o = o || {};
    var M = o.margin != null ? o.margin : F.m, center = o.align === 'center';
    var x0 = o.x != null ? o.x : (center ? F.w / 2 : M);
    var avail = o.avail || (F.w - 2 * M);
    blocks.forEach(function (b) {
      var size = b.size || 48;
      if (b.k === 'gap') b._h = b.h;
      else if (b.k === 'rule') b._h = b.h || 4;
      else if (b.k === 'text') {
        b._lines = wrap(b.s, Math.max(8, Math.floor(avail / (size * (b.gly || 0.55)))));
        b._h = Math.round(size * 1.25) * b._lines.length;
      } else b._h = Math.round(size * 1.25);
    });
    var total = 0;
    blocks.forEach(function (b, i) { total += b._h + (i < blocks.length - 1 ? (b.gap || 0) : 0); });
    var y = o.top != null ? o.top : Math.round((F.h - total) / 2);
    var out = '';
    blocks.forEach(function (b) {
      var size = b.size || 48, lh = Math.round(size * 1.25), base = y + Math.round(size * 0.92);
      if (b.k === 'text') {
        b._lines.forEach(function (ln, i) {
          out += t(b.x != null ? b.x : x0, base + i * lh, ln,
            { size: size, fill: b.fill, w: b.w, anchor: b.anchor || (center ? 'middle' : null), mono: b.mono, ls: b.ls });
        });
      } else if (b.k === 'row') {
        b.cells.forEach(function (c) {
          var cx = c.x == null ? x0 : (c.x <= 1 ? Math.round(c.x * F.w) : c.x);
          out += t(cx, base, c.s, { size: c.size || size, fill: c.fill || b.fill, w: c.w || b.w, anchor: c.anchor, mono: c.mono || b.mono });
        });
      } else if (b.k === 'rule') {
        var x1 = b.x1 != null ? Math.round(b.x1 * F.w) : (center ? Math.round((F.w - avail) / 2) : x0);
        var x2 = b.x2 != null ? Math.round(b.x2 * F.w) : (center ? Math.round((F.w + avail) / 2) : F.w - M);
        out += '<rect x="' + x1 + '" y="' + y + '" width="' + (x2 - x1) + '" height="' + (b.h || 4) + '" fill="' + (b.fill || W) + '"/>';
      } else if (b.k === 'check') {
        var s = Math.round(size * 0.78);
        out += '<rect x="' + x0 + '" y="' + (y + Math.round(size * 0.2)) + '" width="' + s + '" height="' + s +
          '" fill="none" stroke="' + (b.fill || W) + '" stroke-width="4"/>' +
          t(x0 + Math.round(size * 1.35), base, b.s, { size: size, fill: b.fill, w: b.w });
      } else if (b.k === 'minus') {
        out += '<rect x="' + x0 + '" y="' + (y + Math.round(size * 0.5)) + '" width="' + Math.round(size * 0.9) +
          '" height="' + Math.round(size * 0.14) + '" fill="' + Y + '"/>' +
          t(x0 + Math.round(size * 1.3), base, b.s, { size: size, fill: b.fill, w: b.w, ls: b.ls });
      }
      y += b._h + (b.gap || 0);
    });
    return out;
  }

  function wordmark(size) { return [{ s: 'Nero', fill: W }, { s: 'Pay', fill: Y }]; }

  /* ---------- the assets ---------- */
  var A = {}, ORDER = [];
  function def(id, a) { a.id = id; A[id] = a; ORDER.push(id); }

  /* B1 — the rate you were quoted */
  def('B1/OV-1', { vid: 'B1', title: 'The advertised rate is the debit rate', use: 'sits over B1-03 and B1-04', frame: F16,
    draw: function (F) {
      var R = 0.62, rows = [['Consumer debit', '0.50%', Y], ['Consumer credit', '1.20%'], ['Business / commercial', '2.60%'],
        ['American Express', '1.75%'], ['International / non-UK', '2.90%']];
      var b = [{ k: 'text', s: 'the advertised rate', size: 34, fill: D, gap: 28 }];
      rows.forEach(function (r) { b.push({ k: 'row', size: 54, gap: 18, cells: [{ s: r[0] }, { s: r[1], x: R, anchor: 'end', fill: r[2] || W, w: 600 }] }); });
      return stack(b, F);
    } });

  def('B1/OV-2', { vid: 'B1', title: 'The itemised statement, by card type', use: 'sits over B1-06 and B1-07', frame: F16,
    draw: function (F) {
      var c = [0.50, 0.66, 0.78, 0.917];
      function row(r, o) {
        o = o || {};
        return { k: 'row', size: o.size || 44, gap: o.gap != null ? o.gap : 14, w: o.w, cells: [
          { s: r[0], fill: o.fill }, { s: r[1], x: c[0], anchor: 'end', fill: o.fill }, { s: r[2], x: c[1], anchor: 'end', fill: o.fill },
          { s: r[3], x: c[2], anchor: 'end', fill: r[5] || o.fill }, { s: r[4], x: c[3], anchor: 'end', fill: o.fill }] };
      }
      var b = [row(['Card type', 'Transactions', 'Value', 'Rate', 'Charge'], { size: 28, fill: D, gap: 22 })];
      [['Consumer debit', '601', '£20,164.00', '0.50%', '£100.82', Y], ['Consumer credit', '118', '£5,590.00', '1.20%', '£67.08'],
       ['Business / commercial', '31', '£1,420.00', '2.60%', '£36.92'], ['American Express', '14', '£658.00', '1.75%', '£11.52'],
       ['International / non-UK', '16', '£568.00', '2.90%', '£16.47']].forEach(function (r) { b.push(row(r)); });
      b.push({ k: 'gap', h: 10 }, { k: 'rule', h: 3, gap: 22 });
      b.push(row(['Total', '780', '£28,400.00', '', '£232.81'], { w: 700, gap: 34 }));
      b.push({ k: 'text', s: 'Illustrative example. Not a real statement.', size: 28, fill: D });
      return stack(b, F);
    } });

  def('B1/OV-3', { vid: 'B1', title: 'The charges that are not a percentage', use: 'sits over B1-08 and B1-09', frame: F16,
    draw: function (F) {
      var b = [];
      [['Authorisation fees', '780 at 4p', '£31.20'], ['Terminal rental', 'monthly', '£17.50'], ['PCI DSS compliance fee', 'monthly', '£9.95'],
       ['Account / statement fee', 'monthly', '£5.00'], ['Settlement fee — payouts to your bank', '4 at £3.00', '£12.00'],
       ['Minimum monthly service charge', 'not triggered', '£0.00']].forEach(function (r) {
        b.push({ k: 'row', size: 40, gap: 14, cells: [{ s: r[0] }, { s: r[1], x: 0.50, fill: D }, { s: r[2], x: 0.917, anchor: 'end', w: 600 }] });
      });
      b.push({ k: 'gap', h: 10 }, { k: 'rule', h: 3, gap: 22 });
      b.push({ k: 'row', size: 44, w: 700, cells: [{ s: 'These charges alone' },
        { s: [{ s: 'equal to ' }, { s: '0.27%', fill: Y }, { s: ' of turnover' }], x: 0.50, w: 500 }, { s: '£75.65', x: 0.917, anchor: 'end' }] });
      return stack(b, F);
    } });

  def('B1/OV-4', { vid: 'B1', title: 'How to work out your effective rate', use: 'sits over B1-10', frame: F16,
    draw: function (F) {
      var cx = 520, y = F.h / 2, o = '';
      o += t(cx, y - 36, 'EVERY CHARGE ON THE STATEMENT', { size: 40, w: 700, anchor: 'middle', ls: '0.04em' });
      o += '<rect x="' + (cx - 390) + '" y="' + (y + 2) + '" width="780" height="5" fill="' + W + '"/>';
      o += t(cx, y + 72, 'TOTAL CARD TURNOVER', { size: 40, w: 700, anchor: 'middle', ls: '0.04em' });
      o += t(1040, y + 22, '× 100  =', { size: 58, w: 500, anchor: 'middle' });
      o += t(1180, y + 22, 'YOUR EFFECTIVE RATE', { size: 54, w: 800, fill: Y, ls: '0.02em' });
      return o;
    } });

  def('B1/OV-5', { vid: 'B1', title: 'Advertised against actually paid', use: 'sits over B1-11 and B1-12', frame: F16,
    draw: function (F) {
      var y = F.h / 2 - 40, o = '';
      o += t(520, y - 150, 'ADVERTISED', { size: 34, fill: D, ls: '0.22em', anchor: 'middle' });
      o += t(520, y + 40, '0.50%', { size: 170, w: 800, anchor: 'middle', ls: '-0.02em' });
      o += '<path d="M900 ' + (y - 20) + ' h120 m-40 -40 l40 40 l-40 40" stroke="' + W + '" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      o += t(1400, y - 150, 'ACTUALLY PAID', { size: 34, fill: D, ls: '0.22em', anchor: 'middle' });
      o += t(1400, y + 40, '1.09%', { size: 230, w: 800, fill: Y, anchor: 'middle', ls: '-0.02em' });
      o += t(960, y + 190, 'Total charges £308.46 on £28,400.00 of card turnover', { size: 36, anchor: 'middle' });
      o += t(960, y + 246, 'More than double the advertised rate', { size: 36, anchor: 'middle' });
      return o;
    } });

  def('B1/OV-6', { vid: 'B1', title: 'Tiered 0.50% against flat 0.70%', use: 'sits over B1-13 and B1-14', frame: F16,
    draw: function (F) {
      var Ax = 0.44, Bx = 0.90;
      var b = [{ k: 'row', size: 40, gap: 30, cells: [{ s: '' }, { s: '0.50% TIERED', x: Ax, w: 800, ls: '0.06em' },
        { s: '0.70% FLAT', x: Bx, anchor: 'middle', w: 800, fill: Y }] }];
      [['Debit rate', '0.50%', '0.70%'], ['Credit, commercial, Amex, overseas', 'higher rates', '0.70%'],
       ['Fees', 'authorisation, rental, PCI, account, payouts', 'none']].forEach(function (r) {
        b.push({ k: 'row', size: 32, gap: 18, cells: [{ s: r[0] }, { s: r[1], x: Ax }, { s: r[2], x: Bx, anchor: 'middle' }] });
      });
      b.push({ k: 'gap', h: 6 }, { k: 'rule', h: 3, gap: 20 });
      b.push({ k: 'row', size: 40, w: 700, gap: 44, cells: [{ s: 'Total charges' }, { s: '£308.46', x: Ax }, { s: '£198.81', x: Bx, anchor: 'middle' }] });
      b.push({ k: 'text', s: '£109.65 a month cheaper on the higher headline rate', size: 44, fill: Y, w: 600, x: F.w / 2, anchor: 'middle' });
      return stack(b, F);
    } });

  def('B1/OV-7', { vid: 'B1', title: 'Seven questions to ask any provider', use: 'sits over B1-15 and B1-16', frame: F16,
    draw: function (F) {
      var q = ['What is the rate on consumer credit cards', 'What is the rate on business and commercial cards',
        'What is the rate on American Express', 'What is the rate on non-UK cards', 'What does each payout to my bank cost',
        'Is there a PCI fee, account fee or minimum monthly charge', 'What is my effective rate'];
      return stack(q.map(function (s, i) { return { k: 'check', s: s, size: 42, gap: 16, fill: i === q.length - 1 ? Y : W, w: i === q.length - 1 ? 700 : 400 }; }), F);
    } });

  /* B2 — two quotes, two businesses */
  def('B2/OV-1', { vid: 'B2', title: 'Option A and option B', use: 'sits over B2-03', frame: F16,
    draw: function (F) {
      function block(l, big, sub, x) {
        return stack([{ k: 'text', s: l, size: 40, fill: Y, ls: '0.22em', w: 600, gap: 34 }, { k: 'text', s: big, size: 110, w: 800, gap: 22, ls: '-0.02em' },
          { k: 'text', s: sub, size: 40 }], F, { align: 'center', x: x, avail: 820 });
      }
      return block('OPTION A', '0.70% flat', 'no fee per transaction', F.w * 0.28) + block('OPTION B', '0.40%', 'plus 8p on every sale', F.w * 0.72);
    } });

  def('B2/OV-2', { vid: 'B2', title: 'A £4.00 coffee, both ways', use: 'sits over B2-05 and B2-06', frame: F16,
    draw: function (F) {
      return stack([
        { k: 'text', s: 'A £4.00 coffee', size: 60, w: 800, gap: 44 },
        { k: 'row', size: 46, gap: 48, cells: [{ s: 'Option A' }, { s: '0.70% flat', x: 0.40, fill: D }, { s: '2.8p', x: 0.88, anchor: 'end', fill: Y, w: 700 }] },
        { k: 'row', size: 46, gap: 48, cells: [{ s: 'Option B' }, { s: '0.40% is 1.6p plus 8p fee', x: 0.40, fill: D }, { s: '9.6p', x: 0.88, anchor: 'end', size: 74, w: 700 }] },
        { k: 'text', s: 'the cheaper-looking rate costs three and a half times more', size: 40 }], F);
    } });

  def('B2/OV-3', { vid: 'B2', title: 'The crossover point', use: 'sits over B2-07', frame: F16,
    draw: function (F) {
      return stack([
        { k: 'text', s: 'the average sale where the two options cost the same', size: 38, gap: 26 },
        { k: 'text', s: '£26.67', size: 220, w: 800, fill: Y, gap: 44, ls: '-0.02em' },
        { k: 'row', size: 36, cells: [{ s: 'below this, 0.70% flat is cheaper', x: 0.28, anchor: 'middle' }, { s: 'above this, 0.40% + 8p is cheaper', x: 0.72, anchor: 'middle' }] }
      ], F, { align: 'center' });
    } });

  function monthly(id, use, head, sub, r1, r2, line, hl) {
    def(id, { vid: 'B2', title: head.charAt(0) + head.slice(1).toLowerCase() + ', month by month', use: use, frame: F16,
      draw: function (F) {
        return stack([
          { k: 'text', s: head, size: 56, w: 800, ls: '0.08em', gap: 14 },
          { k: 'text', s: sub, size: 36, fill: D, gap: 44 },
          { k: 'row', size: 54, gap: 20, cells: [{ s: r1[0] }, { s: r1[1], x: 0.62, anchor: 'end', w: 700, fill: hl === 1 ? Y : W }] },
          { k: 'row', size: 54, gap: 44, cells: [{ s: r2[0] }, { s: r2[1], x: 0.62, anchor: 'end', w: 700, fill: hl === 2 ? Y : W }] },
          { k: 'text', s: line, size: 40 }], F);
      } });
  }
  monthly('B2/OV-4', 'sits over B2-08 and B2-09', 'THE CAFÉ', '£9,600 across 1,600 sales, average sale £6.00', ['0.70% flat', '£67.20'], ['0.40% + 8p', '£166.40'], 'the lower rate costs two and a half times more', 1);
  monthly('B2/OV-5', 'sits over B2-10', 'THE RESTAURANT', '£28,400 across 780 sales, average sale £36.41', ['0.70% flat', '£198.80'], ['0.40% + 8p', '£176.00'], 'here the pence fee is worth paying', 2);

  def('B2/OV-6', { vid: 'B2', title: 'How to work out your average sale', use: 'sits over B2-11 and B2-12', frame: F16,
    draw: function (F) {
      return stack([
        { k: 'text', s: 'TOTAL CARD TURNOVER  ÷  NUMBER OF TRANSACTIONS', size: 44, w: 700, ls: '0.04em', gap: 28, gly: 0.65 },
        { k: 'text', s: '=  YOUR AVERAGE SALE', size: 64, w: 800, fill: Y, ls: '0.03em', gap: 44 },
        { k: 'text', s: 'both figures are on your monthly statement', size: 32, fill: D }], F, { align: 'center' });
    } });

  /* B3 — four questions before you sign */
  function card(id, use, title, head, lines, small, src) {
    def(id, { vid: 'B3', title: title, use: use, frame: F16,
      draw: function (F) {
        var b = [{ k: 'text', s: head, size: 52, w: 700, fill: Y, gap: 36 }];
        lines.forEach(function (s) { b.push({ k: 'text', s: s, size: 42, gap: 22 }); });
        if (small && small.length) { b.push({ k: 'gap', h: 10 }); small.forEach(function (s) { b.push({ k: 'text', s: s, size: 34, gap: 14 }); }); }
        b.push({ k: 'gap', h: 22 }, { k: 'text', s: src, size: 30, fill: D });
        return stack(b, F);
      } });
  }
  card('B3/OV-1', 'sits over B3-03 and B3-04', 'Q1 · minimum terms are capped', 'Q1 — How long, and what happens at the end?',
    ['PSR Specific Direction 16', 'New POS terminal hire capped at 18 months initial term, monthly rolling thereafter', 'In force January 2023'], [], 'Source: psr.org.uk');
  card('B3/OV-2', 'sits over B3-05 to B3-07', 'Q2 · own it, or rent it', 'Q2 — Own it, or rent it?',
    ['Dojo — machines remain Dojo’s property; up to £400 + VAT per machine if not returned in 30 days',
     'Worldpay — early exit: remaining rentals less 5%; £85 + VAT per machine per week if not returned in 7 days',
     'Teya — remains the property of Teya at all times'], [],
    'Correct as of 18 Aug 2026. Source: published terms at dojo.tech, worldpay.com, teya.com');
  card('B3/OV-3', 'sits over B3-08 and B3-09', 'Q3 · the exit fee as a number', 'Q3 — What is the exit fee, as a number?',
    ['Dojo — based on your agreed plan; not published', 'takepayments — not published',
     'Teya annual plan — £40 per remaining month, plus an unpublished cancellation fee'], [],
    'Correct as of 18 Aug 2026. Source: published fee schedules and terms');
  card('B3/OV-4', 'sits over B3-10 and B3-11', 'Q4 · what can change without me', 'Q4 — What can change without me?',
    ['Price variation clauses', 'PCI non-compliance charges', 'Minimum monthly service charges'],
    ['Dojo: £15 + VAT per month PCI non-compliance', 'Teya: £29.99 under £2,500 monthly card turnover'],
    'Correct as of 18 Aug 2026');

  def('B3/OV-5', { vid: 'B3', title: 'Most have not looked; most who did found it easy', use: 'sits over B3-14 and B3-15', frame: F16,
    draw: function (F) {
      function side(big, cap, x) {
        return stack([{ k: 'text', s: big, size: 200, w: 800, fill: Y, gap: 16, ls: '-0.03em' }, { k: 'text', s: cap, size: 34 }],
          F, { align: 'center', x: x, avail: 680, top: F.h / 2 - 260 });
      }
      var o = side('42%', 'had not switched or considered switching in 2 years', F.w * 0.30) +
              side('76%', 'of those who did switch found it easy', F.w * 0.70);
      o += t(F.w / 2, F.h - 210, 'PSR / IFF Research survey of 1,037 UK SME merchants', { size: 28, fill: D, anchor: 'middle' });
      o += t(F.w / 2, F.h - 168, 'Fieldwork Oct–Dec 2019. Source: psr.org.uk', { size: 28, fill: D, anchor: 'middle' });
      return o;
    } });

  /* A-series — partners, 9:16 */
  def('A1/OV-1', { vid: 'A1', title: 'Three steps', use: 'sits over A1-04 and A1-05', frame: F9,
    draw: function (F) {
      var steps = ['YOU INTRODUCE', 'WE WORK OUT THEIR REAL RATE', 'THEY DECIDE'], tx = F.m + 230, avail = F.w - tx - F.m;
      var items = steps.map(function (s) { return wrap(s, Math.floor(avail / (64 * 0.66))); });
      var hs = items.map(function (ls) { return Math.max(150, ls.length * 80); }), gap = 110;
      var total = hs.reduce(function (a, b) { return a + b; }, 0) + gap * (steps.length - 1);
      var y = Math.round((F.h - total) / 2), o = '';
      items.forEach(function (ls, i) {
        o += t(F.m, y + 128, String(i + 1), { size: 150, w: 900, fill: Y });
        var ty = y + (hs[i] - ls.length * 80) / 2 + 64;
        ls.forEach(function (ln, j) { o += t(tx, ty + j * 80 + 8, ln, { size: 64, w: 800, ls: '0.02em' }); });
        y += hs[i] + gap;
      });
      return o;
    } });

  def('A2/OV-1', { vid: 'A2', title: 'What a partner never does', use: 'sits over A2-03 and A2-04', frame: F9,
    draw: function (F) {
      return stack(['NO SELLING', 'NO PRICING', 'NO SUPPORT', 'NO STOCK', 'NO TARGET', 'NO TIE-IN'].map(function (s) {
        return { k: 'minus', s: s, size: 76, w: 900, gap: 36, ls: '0.03em' };
      }), F);
    } });

  def('A3/OV-1', { vid: 'A3', title: 'What you get, what you never get', use: 'sits over A3-04 and A3-05', frame: F9,
    draw: function (F) {
      return stack([
        { k: 'text', s: 'WHAT YOU GET', size: 44, fill: Y, ls: '0.22em', w: 700, gap: 40 },
        { k: 'text', s: '41 scans', size: 78, w: 700, gap: 12 }, { k: 'text', s: '9 enquiries', size: 78, w: 700, gap: 12 },
        { k: 'text', s: '3 live', size: 78, w: 700, gap: 70 },
        { k: 'rule', x1: 0.22, x2: 0.78, h: 3, gap: 70 },
        { k: 'text', s: 'WHAT YOU NEVER GET', size: 44, fill: Y, ls: '0.22em', w: 700, gap: 40 },
        { k: 'text', s: 'names', size: 78, w: 700 }], F, { align: 'center' });
    } });

  /* shared cards */
  function titleCard(id, F) {
    def(id, { vid: 'ALL', title: 'Title card · ' + F.ar, use: 'every [TITLE] card, ' + F.ar, frame: F, opaque: true,
      draw: function (F) {
        return '<rect width="' + F.w + '" height="' + F.h + '" fill="' + K + '"/>' + stack([
          { k: 'text', s: 'EXPLAINED BY', size: 34, fill: D, mono: true, ls: '0.38em', gap: 44 },
          { k: 'text', s: wordmark(), size: F.ar === '16:9' ? 220 : 170, w: 900, ls: '-0.04em' }], F, { align: 'center' });
      } });
  }
  titleCard('TITLE/16x9', F16);
  titleCard('TITLE/9x16', F9);

  function endCard(id, F, series) {
    var b = series === 'B';
    def(id, { vid: 'ALL', title: 'End card · ' + (b ? 'business videos' : 'partner videos'), use: 'every [END] card on ' + (b ? 'B1–B3' : 'A1–A3') + ', ' + F.ar, frame: F, opaque: true,
      draw: function (F) {
        var blocks = [{ k: 'text', s: wordmark(), size: F.ar === '16:9' ? 150 : 130, w: 900, ls: '-0.04em', gap: 60 },
          { k: 'text', s: 'Subscribe for more', size: 56, w: 600, gap: b ? 90 : 26 }];
        if (!b) blocks.push({ k: 'text', s: 'partners.neropay.app', size: 40, fill: Y, mono: true, gap: 90 });
        blocks.push({ k: 'text', s: b ? 'Illustrative figures. No saving is guaranteed. NeroPay is a trading name of Nero Panda Ltd.' : 'NeroPay is a trading name of Nero Panda Ltd.', size: 28, fill: D });
        return '<rect width="' + F.w + '" height="' + F.h + '" fill="#141416"/>' + stack(blocks, F, { align: 'center' });
      } });
  }
  endCard('END/B', F16, 'B');
  endCard('END/A', F9, 'A');

  function disclosure(id, F) {
    def(id, { vid: 'ALL', title: 'AI presenter disclosure · ' + F.ar, use: 'first three seconds of every video, ' + F.ar + ' — lower third, transparent', frame: F,
      draw: function (F) {
        var x = F.m, y = F.h - F.m - 40, o = '';
        o += '<rect x="' + (x - 28) + '" y="' + (y - 84) + '" width="' + (F.ar === '16:9' ? 700 : 640) + '" height="128" fill="' + K + '" opacity="0.62"/>';
        o += '<rect x="' + x + '" y="' + (y - 50) + '" width="22" height="22" fill="' + Y + '"/>';
        o += t(x + 44, y - 30, 'AI-generated presenter', { size: 44, w: 700 });
        o += t(x + 44, y + 16, 'This presenter is not a real person', { size: 26, fill: '#D6D6D6' });
        return o;
      } });
  }
  disclosure('AI/16x9', F16);
  disclosure('AI/9x16', F9);

  /* specimen statements — fictional merchant, illustrative figures */
  function statement(flat) {
    return function (F) {
      var P = '#F4F2EE', INK = '#131316', MUTE = '#6E6C74', RULE = '#D9D5CC', o = '';
      var lo = { fill: INK }, mu = { fill: MUTE, mono: true, size: 18 };
      o += '<rect width="' + F.w + '" height="' + F.h + '" fill="' + P + '"/>';
      if (flat) {
        o += '<rect width="' + F.w + '" height="150" fill="#141416"/>';
        o += t(100, 98, wordmark(), { size: 64, w: 900, ls: '-0.03em' });
        o += t(F.w - 100, 72, 'Monthly card processing statement', { size: 30, fill: W, anchor: 'end', w: 600 });
        o += t(F.w - 100, 112, 'Statement period  01 Jul 2026 – 31 Jul 2026', { size: 22, fill: '#B8B6B1', anchor: 'end', mono: true });
      } else {
        o += '<rect width="' + F.w + '" height="150" fill="#FFFFFF"/><rect y="150" width="' + F.w + '" height="2" fill="' + RULE + '"/>';
        o += t(100, 88, 'Northwick Payment Services', { size: 52, w: 800, fill: '#1F3A5F', ls: '-0.02em' });
        o += t(100, 124, 'Card acceptance for independent business  ·  rates from 0.50%', { size: 24, fill: MUTE });
        o += t(F.w - 100, 72, 'Monthly card processing statement', { size: 30, fill: INK, anchor: 'end', w: 600 });
        o += t(F.w - 100, 112, 'Statement period  01 Jul 2026 – 31 Jul 2026', { size: 22, fill: MUTE, anchor: 'end', mono: true });
      }
      o += '<rect y="152" width="' + F.w + '" height="46" fill="' + (flat ? Y : '#E4E1DA') + '"/>';
      o += t(F.w / 2, 183, 'SPECIMEN  ·  ILLUSTRATIVE FIGURES  ·  NOT A REAL STATEMENT  ·  FICTIONAL MERCHANT', { size: 20, fill: INK, anchor: 'middle', mono: true, ls: '0.2em', w: 500 });

      o += t(100, 262, 'Specimen Restaurant Ltd', { size: 30, w: 700, fill: INK });
      o += t(100, 298, 'Wilmslow Road, Manchester', { size: 24, fill: MUTE });
      o += t(100, 332, 'Merchant ID  ••••••4471   ·   Terminal  ••••2183', { size: 20, fill: MUTE, mono: true });

      var tiles = [['Card turnover', '£28,400.00'], ['Transactions', '780'], ['Total charges', flat ? '£198.81' : '£308.46'], ['Effective rate', flat ? '0.70%' : '1.09%', true]];
      tiles.forEach(function (tl, i) {
        var x = 900 + i * 232, hi = !!tl[2];
        o += '<rect x="' + x + '" y="236" width="212" height="110" fill="' + (hi ? '#141416' : '#FFFFFF') + '" stroke="' + (hi ? '#141416' : RULE) + '" stroke-width="2"/>';
        o += t(x + 18, 270, tl[0].toUpperCase(), { size: 16, fill: hi ? '#B8B6B1' : MUTE, mono: true, ls: '0.14em' });
        o += t(x + 18, 322, tl[1], { size: 38, w: 800, fill: hi ? Y : INK });
      });

      var cx = [640, 830, 980, 1180], hdr = ['Card type', 'Transactions', 'Value', 'Rate', 'Charge'];
      o += t(100, 412, hdr[0].toUpperCase(), { size: 16, fill: MUTE, mono: true, ls: '0.14em' });
      hdr.slice(1).forEach(function (h, i) { o += t(cx[i], 412, h.toUpperCase(), { size: 16, fill: MUTE, mono: true, ls: '0.14em', anchor: 'end' }); });
      o += '<rect x="100" y="426" width="1080" height="2" fill="' + INK + '"/>';
      var rows = flat
        ? [['Consumer debit', '601', '£20,164.00', '0.70%', '£141.15'], ['Consumer credit', '118', '£5,590.00', '0.70%', '£39.13'],
           ['Business / commercial', '31', '£1,420.00', '0.70%', '£9.94'], ['American Express', '14', '£658.00', '0.70%', '£4.61'],
           ['International / non-UK', '16', '£568.00', '0.70%', '£3.98']]
        : [['Consumer debit', '601', '£20,164.00', '0.50%', '£100.82'], ['Consumer credit', '118', '£5,590.00', '1.20%', '£67.08'],
           ['Business / commercial', '31', '£1,420.00', '2.60%', '£36.92'], ['American Express', '14', '£658.00', '1.75%', '£11.52'],
           ['International / non-UK', '16', '£568.00', '2.90%', '£16.47']];
      var y = 470;
      rows.forEach(function (r) {
        o += t(100, y, r[0], { size: 26, fill: INK });
        r.slice(1).forEach(function (v, i) { o += t(cx[i], y, v, { size: 26, fill: INK, anchor: 'end' }); });
        o += '<rect x="100" y="' + (y + 14) + '" width="1080" height="1" fill="' + RULE + '"/>';
        y += 46;
      });
      y += 8;
      o += t(100, y, 'Card processing charges', { size: 26, fill: INK, w: 800 });
      [['780', 0], ['£28,400.00', 1], [flat ? '0.70%' : '', 2], [flat ? '£198.81' : '£232.81', 3]].forEach(function (c) { o += t(cx[c[1]], y, c[0], { size: 26, fill: INK, anchor: 'end', w: 800 }); });

      var rx = 1260, ry = 412;
      o += t(rx, ry, 'OTHER CHARGES', { size: 16, fill: MUTE, mono: true, ls: '0.14em' });
      o += '<rect x="' + rx + '" y="426" width="560" height="2" fill="' + INK + '"/>';
      var other = flat
        ? [['Authorisation fees', 'none'], ['Terminal rental', 'none'], ['PCI DSS compliance fee', 'none'], ['Account / statement fee', 'none'], ['Settlement fee', 'none'], ['Minimum monthly service charge', 'none']]
        : [['Authorisation fees · 780 at 4p', '£31.20'], ['Terminal rental · monthly', '£17.50'], ['PCI DSS compliance fee · monthly', '£9.95'],
           ['Account / statement fee · monthly', '£5.00'], ['Settlement fee · 4 at £3.00', '£12.00'], ['Minimum monthly service charge', '£0.00']];
      y = 466;
      other.forEach(function (r) {
        o += t(rx, y, r[0], { size: 22, fill: INK });
        o += t(1820, y, r[1], { size: 22, fill: r[1] === 'none' ? MUTE : INK, anchor: 'end' });
        o += '<rect x="' + rx + '" y="' + (y + 12) + '" width="560" height="1" fill="' + RULE + '"/>';
        y += 40;
      });
      y += 6;
      o += t(rx, y, 'Other charges', { size: 24, fill: INK, w: 800 });
      o += t(1820, y, flat ? '£0.00' : '£75.65', { size: 24, fill: INK, anchor: 'end', w: 800 });

      o += '<rect x="' + rx + '" y="' + (y + 40) + '" width="560" height="120" fill="#141416"/>';
      o += t(rx + 24, y + 80, 'TOTAL CHARGES THIS MONTH', { size: 16, fill: '#B8B6B1', mono: true, ls: '0.14em' });
      o += t(rx + 24, y + 134, flat ? '£198.81' : '£308.46', { size: 44, w: 800, fill: W });
      o += t(1796, y + 134, flat ? 'effective 0.70%' : 'effective 1.09%', { size: 22, fill: Y, anchor: 'end', mono: true });

      o += t(100, F.h - 44, flat
        ? 'Specimen statement built for Explained by NeroPay. Figures are illustrative; no saving is guaranteed. NeroPay is a trading name of Nero Panda Ltd.'
        : 'Northwick Payment Services is a fictional provider created for illustration. Every figure on this page is invented. Effective rate = total charges ÷ card turnover.',
        { size: 18, fill: MUTE, mono: true });
      return o;
    };
  }
  def('STATEMENT/TIERED', { vid: 'ALL', title: 'Specimen statement · tiered (Northwick)', use: 'cut alongside B1 OV-2 and OV-3 — fictional provider, advertised from 0.50%, effective 1.09%', frame: F16, opaque: true, draw: statement(false) });
  def('STATEMENT/FLAT', { vid: 'ALL', title: 'Specimen statement · flat (NeroPay)', use: 'cut alongside B1 OV-6 — one 0.70% rate on every card, no other charges (rate still to settle with Eray)', frame: F16, opaque: true, draw: statement(true) });

  /* ---------- output ---------- */
  function svg(id, o) {
    o = o || {};
    var a = A[id], F = a.frame;
    var s = '<svg xmlns="http://www.w3.org/2000/svg" width="' + F.w + '" height="' + F.h + '" viewBox="0 0 ' + F.w + ' ' + F.h + '" role="img" aria-label="' + esc(a.title) + '">';
    if (o.fontCSS) s += '<style>' + o.fontCSS + '</style>';
    if (!o.transparent && !a.opaque) s += '<rect width="' + F.w + '" height="' + F.h + '" fill="' + K + '"/>';
    return s + a.draw(F) + '</svg>';
  }

  /* embed the web fonts so an exported PNG matches the preview; falls back silently */
  var fontCSS = null;
  function blobToDataURL(b) {
    return new Promise(function (res, rej) { var r = new FileReader(); r.onload = function () { res(r.result); }; r.onerror = rej; r.readAsDataURL(b); });
  }
  function fonts() {
    if (fontCSS !== null) return Promise.resolve(fontCSS);
    var url = 'https://fonts.googleapis.com/css2?family=Chivo:wght@400;500;600;700;800;900&family=Martian+Mono:wght@400;500&display=swap';
    function get(u) { /* give up after 6s so an unreachable font host never hangs the export */
      var ac = typeof AbortController !== 'undefined' ? new AbortController() : null;
      var timer = setTimeout(function () { if (ac) ac.abort(); }, 6000);
      return fetch(u, ac ? { signal: ac.signal } : {}).then(function (r) { clearTimeout(timer); return r; }, function (e) { clearTimeout(timer); throw e; });
    }
    return get(url).then(function (r) { return r.text(); }).then(function (css) {
      var blocks = css.split('@font-face').slice(1).filter(function (b) { return /U\+0000-00FF/.test(b); });
      return Promise.all(blocks.map(function (b) {
        var m = b.match(/url\(([^)]+)\)/);
        if (!m) return '';
        return get(m[1]).then(function (r) { return r.blob(); }).then(blobToDataURL).then(function (d) {
          return '@font-face' + b.split('}')[0].replace(m[1], d).replace(/unicode-range:[^;]+;/, '') + '}';
        });
      }));
    }).then(function (arr) { fontCSS = arr.join('\n'); return fontCSS; })
      .catch(function () { fontCSS = ''; return ''; });
  }

  function toPng(id, o) {
    o = o || {};
    return fonts().then(function (css) {
      var s = svg(id, { transparent: o.transparent, fontCSS: css }), F = A[id].frame, scale = o.scale || 1;
      return new Promise(function (res, rej) {
        var img = new Image();
        var url = URL.createObjectURL(new Blob([s], { type: 'image/svg+xml;charset=utf-8' }));
        img.onload = function () {
          var c = document.createElement('canvas');
          c.width = F.w * scale; c.height = F.h * scale;
          c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
          URL.revokeObjectURL(url);
          c.toBlob(function (b) { b ? res(b) : rej(new Error('export failed')); }, 'image/png');
        };
        img.onerror = function () { URL.revokeObjectURL(url); rej(new Error('svg failed to load')); };
        img.src = url;
      });
    });
  }

  function download(blob, name) {
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 800);
  }
  function fileName(id, suffix) { return 'neropay-' + id.replace(/\//g, '-').toLowerCase() + (suffix || ''); }

  return {
    ids: function () { return ORDER.slice(); },
    meta: function (id) { var a = A[id]; return { id: id, vid: a.vid, title: a.title, use: a.use, ar: a.frame.ar, w: a.frame.w, h: a.frame.h, opaque: !!a.opaque }; },
    svg: svg,
    toPng: toPng,
    download: download,
    fileName: fileName
  };
})();

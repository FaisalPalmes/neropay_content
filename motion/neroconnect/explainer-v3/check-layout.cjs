// The layout gate (24 Sep 2026). v3.4 shipped with flashed cards knocked out of place: a CSS rule for the yellow flash
// set position:relative on every [data-hit], which overrode the cards' absolute placement, so "Proof of payment" fell
// off the bottom and the pricing cards overlapped. Neither the jitter gate nor the frame sheets caught it. This does:
// for every scene, once everything in it has arrived, every card (.g), headline (.h), sub and kicker must sit inside the
// frame with a 40 px safe margin, no two cards may overlap, no card may cover a headline, and nothing may sit on the corner mark.
//   node check-layout.cjs          exit 1 on any fault
const { chromium } = require(require('child_process').execSync('npm root -g', { encoding: 'utf8' }).trim() + '/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => document.fonts.ready);
  const faults = await p.evaluate(() => {
    const out = [], M = 40, W = 1920, H = 1080;
    const scenes = [...document.querySelectorAll('.sc')];
    const bug = document.getElementById('bug').getBoundingClientRect();
    const hit = (a, b) => a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1;
    SC.forEach((s, i) => {
      const ats = [...s.el.querySelectorAll('[data-at]')].map(e => +e.dataset.at);
      const t = Math.min(s.t[1] - 0.05, Math.max(s.t[0], ...ats) + 0.8);   // everything landed, scene not yet leaving
      setTime(t);
      const name = (s.el.querySelector('.h') || s.el).textContent.trim().slice(0, 28);
      const boxes = [...s.el.querySelectorAll('.g, .h, .sub, .kick')].filter(e => getComputedStyle(e).opacity > 0.5 && !e.closest('.ph'))
        .map(e => ({ e, r: e.getBoundingClientRect(), k: e.classList.contains('g') ? 'card' : 'text',
          label: e.textContent.trim().replace(/\s+/g, ' ').slice(0, 30) }));
      for (const x of boxes) {
        const r = x.r; if (!r.width) continue;
        if (r.left < M || r.top < M || r.right > W - M || r.bottom > H - M)
          out.push(`scene ${i + 1} "${name}" at ${t.toFixed(2)}s: ${x.k} "${x.label}" outside the frame (${Math.round(r.left)},${Math.round(r.top)} to ${Math.round(r.right)},${Math.round(r.bottom)})`);
        if (hit(r, bug)) out.push(`scene ${i + 1} "${name}": ${x.k} "${x.label}" covers the corner mark`);
      }
      const cards = boxes.filter(x => x.k === 'card'), texts = boxes.filter(x => x.e.classList.contains('h'));
      for (let a = 0; a < cards.length; a++) for (let c = a + 1; c < cards.length; c++)
        if (!cards[a].e.contains(cards[c].e) && !cards[c].e.contains(cards[a].e) && hit(cards[a].r, cards[c].r)
          && !cards[a].e.hasAttribute('data-layered') && !cards[c].e.hasAttribute('data-layered'))   // data-layered: stacked on purpose (the reserve behind the balance)
          out.push(`scene ${i + 1} "${name}": cards "${cards[a].label}" and "${cards[c].label}" overlap`);
      for (const c of cards) for (const h of texts) if (!c.e.contains(h.e) && hit(c.r, h.r))
        out.push(`scene ${i + 1} "${name}": card "${c.label}" covers headline "${h.label}"`);
    });
    return out;
  });
  await b.close();
  faults.forEach(f => console.log('  ' + f));
  console.log(faults.length ? `FAIL: ${faults.length} layout fault(s)` : 'ok: every card and headline in frame, nothing overlapping');
  process.exit(faults.length ? 1 : 0);
})();

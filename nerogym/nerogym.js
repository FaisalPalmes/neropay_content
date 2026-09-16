/* NeroGym brief — shared behaviour. Everything numeric is read from data.js (window.NG)
   so a figure changed there changes everywhere it appears. */
(function(){
  'use strict';
  const NG = window.NG || {};
  /* X set on the model page follows the reader to every other page (per-browser convenience only). */
  try { const x = Number(localStorage.getItem('ng.lease')); if (NG.lease && x >= NG.lease.min && x <= NG.lease.max) NG.lease.default = x; } catch (e) {}
  const gbp = (n, opt={}) => {
    if (n === null || n === undefined || isNaN(n)) return '—';
    const neg = n < 0; n = Math.abs(n);
    const s = opt.k && n >= 10000 ? '£' + (n/1000).toFixed(n >= 100000 ? 0 : 1).replace(/\.0$/,'') + 'k'
            : '£' + Math.round(n).toLocaleString('en-GB');
    return (neg ? '−' : '') + s;
  };
  const gbp2 = n => '£' + Number(n).toFixed(2);
  window.NGfmt = { gbp, gbp2 };

  /* ---- sums ---- */
  const sum = (rows, k) => rows.reduce((a,r)=>a+(Number(r[k])||0),0);
  const capexBy = (ph, k) => sum((NG.capex||[]).filter(r => ph==null || r.ph===ph), k);
  const opexTotal = (k) => sum((NG.opex||[]), k);                       // everything on the running-costs ledger
  const opexFixed = (k) => sum((NG.opex||[]).filter(r => !r.var), k);   // what the model treats as fixed (marketing is a variable)
  window.NGsum = { sum, capexBy, opexTotal, opexFixed };

  /* ---- figures in prose: <span class="fig" data-fig="capex.mid"> ---- */
  const figs = {
    'capex.low': () => gbp(capexBy(null,'low'),{k:1}),
    'capex.mid': () => gbp(capexBy(null,'mid'),{k:1}),
    'capex.high': () => gbp(capexBy(null,'high'),{k:1}),
    'capex.mid.exact': () => gbp(capexBy(null,'mid')),
    'opex.low': () => gbp(opexTotal('low')),
    'opex.mid': () => gbp(opexTotal('mid')),
    'opex.high': () => gbp(opexTotal('high')),
    'lease.default': () => gbp(NG.lease ? NG.lease.default : 0),
    'opex.mid.plusLease': () => gbp(opexTotal('mid') + (NG.lease ? NG.lease.default : 0)),
    'be.mid': () => String(breakEven(NG.lease.default, NG.price.default, 'mid').members),
    'be.low': () => String(breakEven(NG.lease.default, NG.price.default, 'low').members),
    'be.high': () => String(breakEven(NG.lease.default, NG.price.default, 'high').members),
    'fixed.mid': () => gbp(opexFixed('mid') + NG.lease.default),
    'opexfixed.mid': () => gbp(opexFixed('mid')),
    'anc.mid': () => gbp(sum(NG.ancillary,'mid')),
    'contrib.mid': () => gbp2(breakEven(NG.lease.default, NG.price.default, 'mid').contrib),
    'net.mid': () => gbp2(breakEven(NG.lease.default, NG.price.default, 'mid').net),
    'price.default': () => gbp2(NG.price.default),
    'date': () => NG.meta.date
  };
  (NG.capex||[]).forEach(r => { figs['cx.'+r.id+'.mid'] = () => gbp(r.mid); figs['cx.'+r.id+'.low'] = () => gbp(r.low); figs['cx.'+r.id+'.high'] = () => gbp(r.high); });
  (NG.opex||[]).forEach(r => { figs['ox.'+r.id+'.mid'] = () => gbp(r.mid); });
  const phases = NG.phases || [];
  phases.forEach(p => { figs['ph.'+p.id+'.mid'] = () => gbp(capexBy(p.id,'mid'),{k:1}); figs['ph.'+p.id+'.low'] = () => gbp(capexBy(p.id,'low'),{k:1}); figs['ph.'+p.id+'.high'] = () => gbp(capexBy(p.id,'high'),{k:1}); });

  document.querySelectorAll('[data-fig]').forEach(el => {
    const f = figs[el.dataset.fig]; if (f) el.textContent = f();
  });

  /* ---- the model ---- */
  function breakEven(lease, price, tier, extraFixed){
    const a = NG.assump;
    const fixed = opexFixed(tier) + lease + (extraFixed || 0);   // £/month before per-member costs
    const net = price * a.realisation / (1 + a.vat);              // headline → achieved → net of VAT
    const perMember = net * a.collection + a.varPerMember + a.churn * a.cpa; // DD fee, consumables, replacing churn
    const contrib = net - perMember;
    const anc = NG.ancillary ? sum(NG.ancillary, tier) : 0;       // PT rent, vending, recovery, passes
    const members = Math.max(0, Math.ceil((fixed - anc) / contrib));
    return { fixed, net, contrib, anc, members, perMember };
  }
  function pnl(members, lease, price, tier, extraFixed){
    const b = breakEven(lease, price, tier, extraFixed);
    const rev = members * b.net;
    const marketing = members * NG.assump.churn * NG.assump.cpa;
    const profit = members * b.contrib + b.anc - b.fixed;
    return { rev, profit, marketing, anc: b.anc, fixed: b.fixed, contrib: b.contrib };
  }
  window.NGmodel = { breakEven, pnl };

  /* ---- ledger rendering ---- */
  function srcHtml(src){
    if (!src || !src.length) return '';
    return '<span class="src">' + src.map(s => s.u ? `<a href="${s.u}" target="_blank" rel="noopener">${s.t}</a>` : s.t).join(' · ') + '</span>';
  }
  function row(r, tier, cols){
    const tag = r.tag ? `<span class="tag ${r.tagc||''}">${r.tag}</span>` : '';
    let h = `<tr><td class="lab"><b>${r.item}</b>${tag}${r.note ? `<span class="sup">${r.note}</span>`:''}${r.who ? `<span class="sup"><em>Who:</em> ${r.who}</span>`:''}${srcHtml(r.src)}</td>`;
    if (cols === 3) h += `<td class="n">${gbp(r.low)}</td><td class="n">${gbp(r.mid)}</td><td class="n">${gbp(r.high)}</td>`;
    else h += `<td class="n">${gbp(r[tier])}</td>`;
    return h + '</tr>';
  }
  function renderCapex(el, opts={}){
    const tier = opts.tier || 'mid', cols = opts.cols || 3, ph = opts.phase || null;
    const list = phases.filter(p => ph==null || p.id===ph);
    let h = `<div class="tbl"><table><thead><tr><th>Item · who supplies it · source</th>` +
      (cols===3 ? '<th class="n">Value</th><th class="n">Mid</th><th class="n">Premium</th>' : `<th class="n">${tier[0].toUpperCase()+tier.slice(1)}</th>`) + '</tr></thead><tbody>';
    list.forEach(p => {
      const rows = (NG.capex||[]).filter(r => r.ph===p.id);
      if (!rows.length) return;
      if (ph==null) h += `<tr class="grp"><td colspan="${cols===3?4:2}"><span>${p.when}</span>${p.name}</td></tr>`;
      rows.forEach(r => h += row(r, tier, cols));
      if (ph==null) h += `<tr class="sub"><td>Subtotal · ${p.name}</td>` + (cols===3 ? `<td class="n">${gbp(capexBy(p.id,'low'))}</td><td class="n">${gbp(capexBy(p.id,'mid'))}</td><td class="n">${gbp(capexBy(p.id,'high'))}</td>` : `<td class="n">${gbp(capexBy(p.id,tier))}</td>`) + '</tr>';
    });
    if (ph==null) h += `<tr class="tot"><td>Total capital to open, before the premises deposit and rent-free period</td>` + (cols===3 ? `<td class="n">${gbp(capexBy(null,'low'))}</td><td class="n">${gbp(capexBy(null,'mid'))}</td><td class="n">${gbp(capexBy(null,'high'))}</td>` : `<td class="n">${gbp(capexBy(null,tier))}</td>`) + '</tr>';
    else h += `<tr class="tot"><td>Subtotal</td>` + (cols===3 ? `<td class="n">${gbp(capexBy(ph,'low'))}</td><td class="n">${gbp(capexBy(ph,'mid'))}</td><td class="n">${gbp(capexBy(ph,'high'))}</td>` : `<td class="n">${gbp(capexBy(ph,tier))}</td>`) + '</tr>';
    el.innerHTML = h + '</tbody></table></div>';
  }
  function renderOpex(el, opts={}){
    const lease = opts.lease == null ? (NG.lease ? NG.lease.default : 0) : opts.lease;
    let h = `<div class="tbl"><table><thead><tr><th>Monthly line · who · source</th><th class="n">Lean</th><th class="n">Mid</th><th class="n">Full</th></tr></thead><tbody>`;
    h += `<tr><td class="lab x"><b>X · premises rent</b><span class="sup">Set on the premises page. Service charge, insurance rent and business rates are separate lines below.</span></td><td class="n x">${gbp(lease)}</td><td class="n x">${gbp(lease)}</td><td class="n x">${gbp(lease)}</td></tr>`;
    const groups = [...new Set((NG.opex||[]).map(r=>r.g))];
    groups.forEach(g => {
      h += `<tr class="grp"><td colspan="4">${g}</td></tr>`;
      (NG.opex||[]).filter(r=>r.g===g).forEach(r => h += row(r, 'mid', 3));
    });
    h += `<tr class="sub"><td>Running costs excluding rent</td><td class="n">${gbp(opexTotal('low'))}</td><td class="n">${gbp(opexTotal('mid'))}</td><td class="n">${gbp(opexTotal('high'))}</td></tr>`;
    h += `<tr class="tot"><td>Total monthly cost with X at ${gbp(lease)}</td><td class="n">${gbp(opexTotal('low')+lease)}</td><td class="n">${gbp(opexTotal('mid')+lease)}</td><td class="n">${gbp(opexTotal('high')+lease)}</td></tr>`;
    el.innerHTML = h + '</tbody></table></div>';
  }
  window.NGrender = { renderCapex, renderOpex };
  document.querySelectorAll('[data-capex]').forEach(el => renderCapex(el, { phase: el.dataset.capex || null, cols: Number(el.dataset.cols||3), tier: el.dataset.tier||'mid' }));
  document.querySelectorAll('[data-opex]').forEach(el => renderOpex(el));

  /* ---- rail: highlight the section in view ---- */
  const links = [...document.querySelectorAll('.rail a[href^="#"]')];
  if (links.length && 'IntersectionObserver' in window){
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting){ links.forEach(l=>l.classList.remove('on')); const a = map.get(e.target.id); if (a) a.classList.add('on'); } });
    }, { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((a,id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }
  document.querySelectorAll('.rail .print').forEach(b => b.addEventListener('click', () => window.print()));

  /* ---- segmented controls ---- */
  document.querySelectorAll('.seg').forEach(seg => {
    seg.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      seg.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x===b ? 'true':'false'));
      seg.dispatchEvent(new CustomEvent('change', { detail: b.dataset.v }));
    });
  });
})();

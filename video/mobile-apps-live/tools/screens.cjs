const { chromium } = require(require('path').resolve(__dirname, '../../../motion/node_modules/playwright'));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const p = await b.newPage({ viewport: { width: 1200, height: 1000 }, deviceScaleFactor: 3 });
  await p.goto('file://' + require('path').resolve(__dirname, '../../mobile-apps/index.html') + '');
  await p.waitForTimeout(1500);
  const shots = [['sage', 0.2, 'sage-menu'], ['sage', 3, 'sage-basket'], ['kes', 0.2, 'kes-slots'], ['kes', 3, 'kes-booked'], ['iro', 3, 'iro-in'], ['mar', 3, 'mar-paid']];
  for (const [id, t, name] of shots) {
    await p.evaluate(([id, t]) => {
      document.querySelectorAll('#flat').forEach(e => e.remove());
      const host = document.createElement('div'); host.id = 'flat';
      host.style.cssText = 'position:fixed;left:0;top:0;width:390px;height:844px;z-index:99999;overflow:hidden;background:#fff';
      const app = document.createElement('div'); app.className = 'app'; app.style.transform = 'none'; app.style.height = '844px';
      const L = document.getElementById(id).cloneNode(true); L.id = ''; L.style.transform = 'none'; L.style.opacity = 1; L.style.visibility = 'visible'; L.style.display = '';
      app.appendChild(L); host.appendChild(app); document.body.appendChild(host);
      const Q = el => (s => el.querySelector(s));
      const fn = { sage: window.sageState, kes: window.kesState, iro: window.iroState, mar: window.marState }[id];
      if (fn) fn(L, t);
    }, [id, t]);
    await p.waitForTimeout(200);
    await p.locator('#flat').screenshot({ path: `${process.argv[2]}/${name}.png` });
  }
  await b.close();
})();

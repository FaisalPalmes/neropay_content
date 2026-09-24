// Writes the store formats from index.html: iphone.html (886 x 1920, App Store) and ipad.html (1200 x 1600, App Store).
// They are generated for the render and removed after it, because two root compositions fail `hyperframes check`.
//   node make-formats.mjs
import { readFileSync, writeFileSync } from 'node:fs';
const src = readFileSync(new URL('./index.html', import.meta.url), 'utf8');
for (const [name, W, H] of [['iphone', 886, 1920], ['ipad', 1200, 1600]]) {
  let s = src
    .replace('width=1080, height=1920', `width=${W}, height=${H}`)
    .replace('html,body{width:1080px;height:1920px', `html,body{width:${W}px;height:${H}px`)
    .replace('#root{position:relative;width:1080px;height:1920px', `#root{position:relative;width:${W}px;height:${H}px`)
    .replace('data-width="1080" data-height="1920"', `data-width="${W}" data-height="${H}"`)
    .replace('<script src="vendor/gsap.min.js"></script>', `<script>window.FMT = [${W}, ${H}]</script><script src="vendor/gsap.min.js"></script>`);
  if (!s.includes(`window.FMT = [${W}`) || !s.includes(`data-width="${W}"`)) throw new Error('format replace failed: ' + name);
  writeFileSync(new URL(`./${name}.html`, import.meta.url), s);
}

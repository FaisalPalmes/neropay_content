/* NC01 mix cues from the composition's own anchors: load index.html headless, read window.ANCHORS / CAMS / DURATION,
   write data/mix.json. Every cue is tied to a word or a camera move, so a re-take re-times the sound with the picture.
   node motion/neroconnect/nc01/mkmix.mjs */
import { chromium } from 'playwright';
import { readdirSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path'; import { fileURLToPath, pathToFileURL } from 'node:url';
const EP = dirname(fileURLToPath(import.meta.url));
const root = process.env.PLAYWRIGHT_BROWSERS_PATH || '/opt/pw-browsers';
const build = readdirSync(root).filter(d => d.startsWith('chromium-')).sort().pop();
const browser = await chromium.launch({ executablePath: resolve(root, build, 'chrome-linux/chrome'), args:['--allow-file-access-from-files'] });
const pg = await browser.newPage({ viewport:{ width:960, height:540 } });
await pg.goto(pathToFileURL(resolve(EP, 'index.html')).href + '?caps=0');
await pg.waitForFunction(() => window.READY === true, null, { timeout:60000 });
const { A, CAMS, DURATION, HEAD } = await pg.evaluate(() => ({ A:window.ANCHORS, CAMS:window.CAMS, DURATION:window.DURATION, HEAD:window.HEAD }));
await browser.close();
const r = x => +x.toFixed(3);
const cues = [];
const cue = (sfx, t, gain, why) => cues.push({ sfx, t:r(t), gain, why });
/* S0 */
cue('sparkle', A.build, .16, 'the statement rises word by word');
cue('whoosh-short', A.pay - .2, .12, 'the card arcs in');
cue('ping', A.run - .1, .2, 'the tap: the ripple, the tiles rise');
cue('impact-bass-2', A.runEnd - .1, .2, '"to run one." lands');
/* flights */
const fl = ['whoosh-short', 'whoosh', 'whoosh-cinematic', 'whoosh-short', 'whoosh', 'whoosh-short', 'whoosh-cinematic'];
CAMS.slice(1).forEach((c, i) => cue(fl[i], c.t, .14, `the flight to ${c.st}`));
/* S1 */
cue('pop', A.term - .1, .2, 'the terminal rises'); cue('click-soft', A.till - .1, .2, 'the till rises'); cue('pop', A.settle - .1, .18, 'the ledger rises');
cue('click', A.settle + .5, .16, 'SETTLED stamps'); cue('key-press', A.comp - .1, .2, 'the document rises'); cue('click-soft', A.comp + .5, .16, 'COMPLIANCE stamps');
cue('pop', A.supp - .1, .18, 'the phone rises'); cue('notification', A.built, .14, 'the nameplate hangs in: NeroPay.'); cue('sparkle', A.own + .05, .22, 'the plate rolls to YOUR BRAND; the terminal re-badges');
/* S2 */
cue('pop', Math.max(A.h2 - .2, A.sign - .3), .18, 'the dashboard rises'); cue('typing', A.dom, .16, 'the address bar types');
cue('click-soft', A.logo, .16, 'Your logo'); cue('click', A.brand, .16, 'Your branding');
[0, 1, 2].forEach(i => cue(i % 2 ? 'click-soft' : 'pop', A.bring + .2 + i * .14, .14, `merchant ${i + 1} lights`));
/* S3 */
cue('ping', A.us + .1, .18, 'the card taps');
['acq', 'money', 'paper', 'supp2'].forEach((k, i) => cue(i % 2 ? 'impact-bass-1' : 'impact-bass-2', A[k], .16, `pillar ${i + 1} grows`));
cue('chime', A.account, .18, 'the bank lights: their account');
/* S4 */
cue('click', A.platPays, .16, 'table one'); cue('click-soft', A.npFee, .14, 'row'); cue('click', A.bills, .14, 'row');
cue('click-soft', A.merchPays, .16, 'table two'); cue('click', A.direct, .14, 'row'); cue('click-soft', A.onTop, .14, 'row'); cue('sparkle', A.either, .14, 'the serif: yours either way');
/* S5 */
cue('pop', A.epos, .18, 'the van rises'); cue('click-soft', A.soft, .16, 'the tiles'); cue('pop', A.group - .1, .18, 'the group rises');
cue('whoosh-short', A.isnt - .1, .12, 'they sink'); cue('pop', A.cafes - .1, .18, 'the cafés rise'); cue('notification', A.partner, .14, 'the partner sign');
cue('key-press', A.setup - .1, .18, 'the document rises'); cue('click', A.reg + .15, .16, 'AGREED FIRST stamps');
/* S6 + end */
cue('notification', Math.max(A.url - .1, A.h6 + .3), .16, 'docs.neropay.app hangs in'); cue('pop', A.read - .1, .16, 'the docs page rises');
cue('chime', A.end, .18, 'the end card lands'); [0, 1, 2].forEach(i => cue('click-soft', A.end + .5 + i * .18, .12, 'a row ticks in'));
cues.sort((a, b) => a.t - b.t);
/* no sound twice in a row */
for (let i = 1; i < cues.length; i++) if (cues[i].sfx === cues[i - 1].sfx) cues[i].sfx = cues[i].sfx === 'pop' ? 'click-soft' : cues[i].sfx === 'click-soft' ? 'click' : cues[i].sfx === 'click' ? 'pop' : cues[i].sfx.startsWith('whoosh') ? (cues[i].sfx === 'whoosh' ? 'whoosh-short' : 'whoosh') : cues[i].sfx === 'impact-bass-1' ? 'impact-bass-2' : 'impact-bass-1';
const spec = { duration:r(DURATION), head:r(HEAD), vo:'data/vo.mp3', target:-14, tp:-1.5,
  bed:{ file:'video/library/bgm/neroconnect-pulse-100.mp3', t:0, gain:.2, duck:{ threshold:.025, ratio:5, attack:12, release:420 }, fade:2.6 }, cues };
writeFileSync(resolve(EP, 'data/mix.json'), JSON.stringify(spec, null, 1) + '\n');
console.log(cues.length, 'cues, duration', spec.duration);

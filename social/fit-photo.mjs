#!/usr/bin/env node
/* social/fit-photo.mjs — fit a tall (9:16) photo to the 4:5 card by keeping its top and bottom halves and
   crossfading the join, which then sits behind the glass slab. For flat lays with an empty middle.
     node social/fit-photo.mjs <in> <out.jpg>      → 2160×2700 JPEG */
import { createRequire } from 'node:module'; import { execSync } from 'node:child_process'; import { writeFileSync } from 'node:fs'; import { pathToFileURL } from 'node:url';
const req=createRequire(import.meta.url); const {chromium}=req(execSync('npm root -g').toString().trim()+'/playwright');
const [src,out]=process.argv.slice(2); const b=await chromium.launch(); const p=await b.newPage();
await p.goto(pathToFileURL(src).href);
const data=await p.evaluate(async()=>{const i=document.querySelector('img');await i.decode();const W=2160,H=2700,s=W/i.naturalWidth,sh=i.naturalHeight*s;
 const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');const half=H/2;
  const o=160, t=document.createElement('canvas');t.width=W;t.height=half+o;const tx=t.getContext('2d');
 tx.drawImage(i,0,i.naturalHeight-(half+o)/s,i.naturalWidth,(half+o)/s,0,0,W,half+o);                          // bottom half + overlap
 const g=tx.createLinearGradient(0,0,0,half+o);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(2*o/(half+o),'rgba(0,0,0,1)');g.addColorStop(1,'rgba(0,0,0,1)');
 tx.globalCompositeOperation='destination-in';tx.fillStyle=g;tx.fillRect(0,0,W,half+o);
 x.drawImage(i,0,0,i.naturalWidth,(half+o)/s,0,0,W,half+o);                                                  // top half + overlap
 x.drawImage(t,0,half-o);                                                                                      // crossfade over the join
 return [i.naturalWidth,i.naturalHeight,c.toDataURL('image/jpeg',0.93)];});
writeFileSync(out,Buffer.from(data[2].split(',')[1],'base64')); console.log('source',data[0],'x',data[1]); await b.close();

# NC01 — the NeroConnect intro

Built 17 September 2026 from `PROPOSAL.md` beside this file. **v1** (the proposal script as approved that morning) was
rejected by Faisal the same afternoon on two counts: the two-modes passage carried the June playbook's story, which the
September docs supersede, and the picture had overlaps, floor clipping and type that was not in the scene's perspective.
**v2** is the rebuild: a new take, a new layout, the same premise. Voice: **Olivia — Warm, British Female**
(`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), the partner-side voice. No figure in the video, by design (`motion/neroconnect/CLAUDE.md`).

## The takes (flow `V5Z2DUgxnS9rAnIxR1yP` — rows in `video/library/LEDGER.md`)

- **v1**, parked under `data/v1/`: `vo-main-raw.mp3` (node `Jo9eDqzSmwcJIwVmFSuz`, 95.8 s, 1,535 credits, closing sentence
  garbled by a prompt error) + `vo-close-raw.mp3` (node `TbC1LYLwdHlQB9mK91Q7`, 9.0 s, 140 credits), spliced at 83.10 s, and
  the tightened/gated `vo.mp3` with its words, captions, anchors and mix. Kept for the record; nothing reads from it.
- **v2, the take that ships**: `data/vo-v2-raw.mp3` — node `yI3Up4DDCjpXBD7CPXSE`, generation `tyKk9Md8Z3LXnBfkSomI`, 92.1 s,
  1,429 credits, one clean read of the script below. `data/vo.mp3` is that take after `tighten.mjs --gap .32 --min .45 --tempo 1.03`
  (33 gaps, 92.11 s → 77.69 s → 75.43 s at 1.03×) and `gate.py --inset .12 --max -30` (two gaps left alone as word edges).

Word timings: faster-whisper `small.en` in the Higgsfield sandbox with the script as the initial prompt, 259 words. Whisper
heard "bills" as "builds", "your branding" as "you're branding", "cafés" as "cafes", "programme" as "program"; `vo_words.json`
carries the script's spellings and the composition's `find()` accepts either, so a re-take re-times everything.

> [warmly] You don't have to build a payments company to run one. Everything it takes already exists. The card terminals.
> The till software. The settlement, the compliance, the support desk. We built all of it for NeroPay, and NeroConnect lets
> you run it under your own name. Here's how it works. You sign up as a platform and you get one dashboard for every
> merchant you look after. Your logo on the dashboard, your domain in the address bar, and if you want it, your branding on
> the terminal itself. You bring the merchants. [curious] And underneath, it's us: the card acquiring, the money landing in
> their account, the paperwork, the support. There are two ways to set it up. Either your platform pays NeroPay's processing
> fee and bills your merchants yourself, or each merchant pays it directly, with your fee on top. Either way, you set what
> your merchants pay. Who it's for: EPOS installers. Software companies with restaurants or salons on their platform. Anyone
> looking after a group of merchants. [serious] And who it isn't for. If you look after three cafés, the partner programme is
> the right door — one introduction and nothing to run. And depending on the setup, there can be regulatory questions on
> your side too, so that's a conversation we have before a contract, not after. [warmly] The documentation is public. Read
> it at docs dot NeroPay dot app, then talk to us. That's it for today. Follow us for more of this.

**What changed in the words, and why.** The modes passage now says what docs.neropay.app says ("Choosing your partnership
mode"): the arrangement decides who pays NeroPay's processing fee, and merchant pricing is the platform's in both. Neither
mode is named, nothing is called simpler, disputes are not mentioned (they are the platform's in every mode — NC02's
material). The regulatory line was tied to Platform mode in the June playbook; with no mode named it is generalised to
"depending on the setup, there can be regulatory questions on your side too". **Open with Faisal:** keep that wording, or cut
the line — the September docs do not carry it.

## The picture — v2

One three.js world (`motion/lib/world3d.js`), seven sections 62 units apart, the view swinging left and right, the last flight
pulling back to the whole world. The rules Faisal set on v1, now built in:

- **Type stands in the scene.** Each section's kicker and heading sit on a standing glass **board** (`.board`, a DOM sign at
  `ry 0`) at the back of its mat, seen at the same angle as the objects. Nothing is turned to face the camera. Boards sit
  where no object crosses them on screen — S3's stands at the right, the platform stays left of it.
- **Footed, spaced, never clipping.** Every object in `objects-nc.js` has its origin on the floor (`canvasSlab` is footed
  whatever its lean); the stack stands on a `shelf()` with the five pieces spaced and staggered in depth; `up()`/`down()` land
  an object on a base. Pillar words are `textPlane`s set into the pillar faces (WebGL paints over the CSS layer, so a sign on
  an object would be hidden by it).
- **The frame is full.** Section boxes are shallow (y to 19, z −6.5..7) and the boards sit just above the objects, so there is
  no empty sky (PP02 v2 ruling).

| Section | Words | On screen |
|---|---|---|
| S0 the statement | "You don't have to build a payments company to run one." | One large board (kicker NeroConnect, the statement word by word); the hero terminal at full size; a card arcs in and taps it with a yellow contactless ripple; three frosted tiles with payment marks rise on the tap |
| S1 the stack | "Everything it takes already exists … under your own name." | The shelf; terminal, till, ledger (stamps SETTLED), document (stamps COMPLIANCE · OK), support phone rise on their words with a kicker hung over each; the nameplate rolls NeroPay. → YOUR BRAND and the terminal's badge crossfades |
| S2 the dashboard | "You sign up as a platform … You bring the merchants." | The drawn dashboard (address bar types `pay.yourbrand.co.uk`, the logo slot fills, rows tick in LIVE); three pills stacked beside the board — Your logo · Your domain · Your branding; three shops on a raised shelf light and a re-badged terminal rises at each door |
| S3 underneath | "And underneath, it's us …" | A platform (a small street of theirs, a re-badged terminal, the NeroPay mark on its edge) floats; four glass pillars — ACQUIRING · SETTLEMENT · COMPLIANCE · SUPPORT, a mark etched in each — grow on their words and catch it; a card taps a terminal at the left, the payment pulses along the floor to a bank that lights on "their account" |
| S4 two ways | "There are two ways to set it up … you set what your merchants pay." | Board "Who pays our processing fee."; table one **Your platform pays** (NeroPay's fee → your platform · merchant billing → you); table two **The merchant pays** (NeroPay's fee → the merchant · your fee → on top); serif *Merchant pricing is yours either way.* |
| S5 for, and not for | "Who it's for … before a contract, not after." | Detailed van, six software tiles, a shop group, kickers; on "who it isn't for" they sink and the left board dims; the right board "Three cafés? Partner programme." with the pill and the serif; a document rises and stamps AGREED FIRST; serif *a conversation before a contract, not after.* |
| S6 the docs | "The documentation is public … then talk to us." | Board "Read it. Then talk to us."; nameplate docs.neropay.app; a docs page (article list, "Choosing your arrangement" highlighted); the re-badged terminal |
| S7 the end | "That's it for today. Follow us for more of this." | Pull-back to the whole world; a glass panel at the left: NeroConnect, "Card payments under your own brand.", one serif line, READ docs.neropay.app · TALK neropay.app · FOLLOW NeroPay on social media with the Instagram, Facebook, LinkedIn and YouTube marks; footer: the trading-name line only |

Timing law: every beat passes (`render.mjs` report). `HEAD` two beats at 99.85 bpm, `TAIL` 8.2 s; 84.47 s in all.

## Sound

Bed `video/library/bgm/neroconnect-pulse-100.mp3` at 0.2 under the voice, ducked 5:1, faded over the last 2.6 s. Cues are
generated from the composition's own anchors by `mkmix.mjs` (54 cues, none twice in a row), so the sound re-times with the
picture. Master: `mix.mjs` to −14 LUFS / −1.5 dBTP.

## Delivery

**v2, 17 Sep 2026, for Faisal's review.**

- `out/final/nc01-16x9.mp4` — 1920×1080, 84.50 s, 2,535 frames, md5 `13fcd904ce9adec401323191ebab25aa`. Loudness −14.38 LUFS,
  −2.18 dBTP (the mix ceiling is set to −2.4 in `mix.json` because the AAC true-peak read lands ~0.9 dB over the limiter's
  target; v1's −1.5 ceiling gave −0.64 on this mix). Single-frame luma spikes: 0. Frame-to-frame jumps over 12 luma: 0.
  Contact sheet `out/final/contact.jpg`, 24 stills.
- Higgsfield media store: https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/d7d50f7c-9fcb-4930-9a70-a297ba1a1d2f.mp4
  (media `d7d50f7c-9fcb-4930-9a70-a297ba1a1d2f`). A 13.5 MB review encode (`-crf 24`) went to Faisal in chat with the sheet.
- v1 (media `5218d858-c4b5-45b0-9e4d-683772da5de8`) is withdrawn: wrong on the modes, and the design faults listed at the top.
- Not yet rendered: 4:5 (Meta, with captions), 9:16, 1:1. About 35 minutes each, on request.
- Warehouse: `posts.js` L12 carries the video on Tue 22 Sep, blocked until Faisal approves this render; L9 and M11 (the
  two-arrangement carousel) were corrected to the same facts and re-rendered to `social/out/`.

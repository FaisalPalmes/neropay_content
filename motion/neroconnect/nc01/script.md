# NC01 — the NeroConnect intro

Built 17 September 2026 from `PROPOSAL.md` beside this file; Faisal approved the script as read ("okay i like the script,
go ahead and run the full edit"). Voice: **Olivia — Warm, British Female** (`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), the
partner-side voice. No figure in the video, by design (`motion/neroconnect/CLAUDE.md`).

## The take (flow `V5Z2DUgxnS9rAnIxR1yP`, 17 Sep 2026 — rows in `video/library/LEDGER.md`)

- `data/vo-main-raw.mp3` — node `Jo9eDqzSmwcJIwVmFSuz`, 95.8 s, 1,535 credits. The proposal script, except that the closing
  sentence went into the generation garbled by a prompt error ("Read it at NeroPay dot app, forward slash docs… actually,
  docs dot NeroPay dot app"). Everything before 83.10 s is the script as written.
- `data/vo-close-raw.mp3` — node `TbC1LYLwdHlQB9mK91Q7`, 9.0 s, 140 credits. The closing sentence alone.
- `data/vo-review.mp3` (= `data/vo-raw.mp3`) — the first take cut at 83.10 s inside the silence after "not after", a 0.32 s
  gap, then the closing take: 92.4 s. The file Faisal reviewed and approved.
- `data/vo.mp3` — the review take after `tighten.mjs --gap .32 --min .45 --tempo 1.03` (31 gaps, 92.42 s → 81.40 s →
  79.03 s at 1.03×) and `gate.py --inset .12 --max -30` (19 gaps gated, 21 left alone as word edges).

Word timings: faster-whisper `small.en` in the Higgsfield sandbox with the script as the initial prompt, 251 words. Whisper
heard "cafés" as "cafes", "programme" as "program" and the URL as "docs · .neropay · .app."; the composition finds every
anchor by normalised word (`find()` strips accents and punctuation), so none of that matters and a re-take re-times everything.

> [warmly] You don't have to build a payments company to run one. Everything it takes already exists. The card terminals.
> The till software. The settlement, the compliance, the support desk. We built all of it for NeroPay, and NeroConnect lets
> you run it under your own name. Here's how it works. You sign up as a platform and you get one dashboard for every
> merchant you look after. Your logo on the dashboard, your domain in the address bar, and if you want it, your branding on
> the terminal itself. You bring the merchants. [curious] And underneath, it's us: the card acquiring, the money landing in
> their account, the paperwork, the support. There are two ways to run it. Connected mode: you work under the NeroPay name,
> we set the merchant rates and we handle the disputes. It's the simpler start. Platform mode: your brand, your pricing, and
> more of the responsibility, disputes included. It's for when you want your own name on everything. Who it's for: EPOS
> installers. Software companies with restaurants or salons on their platform. Anyone looking after a group of merchants.
> [serious] And who it isn't for. If you look after three cafés, the partner programme is the right door — one introduction
> and nothing to run. And platform mode can need its own regulatory permissions, so that's a conversation we have before a
> contract, not after. [warmly] The documentation is public. Read it at docs dot NeroPay dot app, then talk to us. That's it
> for today. Follow us for more of this.

## The picture — seven sections in a line, and the whole world

One three.js world (`motion/lib/world3d.js`), seven sections 62 units apart along one route, the view swinging left and
right; flights between them climb and pull back (`flight()`, wideR 150) and the last one pulls back to a section whose box
is the whole world. Composition `HEAD` = two beats at 99.85 bpm (1.202 s), `TAIL` 7.6 s for the end card and footer;
87.54 s in all. Objects new to this episode live in `objects-nc.js` beside the composition.

| Section | Words | On screen |
|---|---|---|
| S0 the statement | "You don't have to build a payments company to run one." | Three lines rise word by word on empty paper; the camera waits until the line has been read (the law) before flying |
| S1 the stack | "Everything it takes already exists … under your own name." | Five objects out of the paper, one per phrase: our terminal (`brandTerminal`), a till screen, a ledger strip that stamps SETTLED, a document that stamps COMPLIANCE · OK, a support phone; a kicker hangs over each. On "We built all of it for NeroPay" a nameplate hangs in reading **NeroPay.**; on "your own name" it rolls to **YOUR BRAND** and the terminal's badge crossfades to the placeholder mark at the same moment |
| S2 the dashboard | "You sign up as a platform … You bring the merchants." | A drawn dashboard slab (browser bar, sidebar with a logo slot, merchant list). The address bar types `pay.yourbrand.co.uk`; the logo slot fills; rows tick in with LIVE pills; three pills hang over it — Your logo · Your domain · Your branding; four shopfronts light on the right and a re-badged terminal rises at each door |
| S3 underneath | "And underneath, it's us …" | A floating platform slab; four pillars grow under it on their words — ACQUIRING · SETTLEMENT · COMPLIANCE · SUPPORT; a yellow payment path draws along the floor from a card to a bank-shaped tile that lights on "their account"; the small NeroPay mark at the pillars' foot |
| S4 two modes | "There are two ways to run it … your own name on everything." | Twin glass tables, Connected and Platform, four rows each ticking in on their words (Brand · Rates/Pricing · Disputes · Start/For), the last row on the marker; our terminal beside Connected, the re-badged one beside Platform; the serif aside *may need its own regulatory permissions* |
| S5 for, and not for | "Who it's for … before a contract, not after." | A van with a ladder rack, six software tiles, a group of shops under one roofline rise on their words with kickers; on "who it isn't for" they sink into the paper; three cafés rise with the PARTNER PROGRAMME → sign and the serif *one introduction and nothing to run.*; a document rises and stamps PERMISSIONS?; the serif *a conversation before a contract, not after.* |
| S6 the docs | "The documentation is public … then talk to us." | The heading, the nameplate **docs.neropay.app** hanging in, THEN TALK TO US, the re-badged terminal at the kerb |
| S7 the whole world | "That's it for today. Follow us for more of this." | The camera climbs until all seven sections are in one frame; the end card lands over it: the mark, "Card payments under your own brand. NeroConnect, from NeroPay.", FOLLOW US FOR MORE, docs.neropay.app, and the footer held to the end: *NeroConnect is provided by NeroPay, the trading name of Nero Panda Ltd. Platform mode may require your own regulatory permissions.* |

Type animation as PP02 (word-by-word rise with a tracking settle, hanging signs, the marker drawing, captions popping per
word) plus the odometer-style **roll** on the nameplate. Timing law: every beat passes (`render.mjs` report), the tightest
being the statement at 4.41 s held for 4.4 s needed and the footer at 8.59 s for 8.4 s.

## Sound

Bed: `video/library/bgm/neroconnect-pulse-100.mp3` (Eleven Music v2, 99.85 bpm by `tempo.py`, no vocals — Whisper finds no
speech), at 0.2 under the voice, ducked 5:1, faded over the last 2.6 s. 64 cues from `video/library/sfx/`, none twice in a
row (`data/mix.json`, checked). Master: `mix.mjs` with the limiter stage — −14.20 LUFS, −1.25 dBTP.

## Crops

16:9 first (LinkedIn, no burnt captions), rendered 17 Sep 2026 with `--jpeg`. 4:5 and 9:16 on request (~35 minutes each).

## Delivery — v1, 17 Sep 2026, for Faisal's review

- `out/final/nc01-16x9.mp4` — 1920×1080, 87.57 s, 2,627 frames, md5 `5245f549e2f3d361177670eab524eb4c`. Loudness −14.21 LUFS,
  −1.25 dBTP (the ceiling is −1.5; PP02 shipped at −1.2 — the AAC true-peak read runs a shade over the limiter's target).
  Single-frame luma spikes: 0. Frame-to-frame jumps over 12 luma: 0. Contact sheet `out/final/contact.jpg`, 23 stills.
- Higgsfield media store: https://d2ol7oe51mr4n9.cloudfront.net/user_38ZXgS1FsFgzPivSruKltDoPHGB/5218d858-c4b5-45b0-9e4d-683772da5de8.mp4
  (media `5218d858-c4b5-45b0-9e4d-683772da5de8`). An 11 MB review encode (`-crf 24`) went to Faisal in chat with the sheet.
- **Known fault carried to v2:** in S4 the serif aside *may need its own regulatory permissions* was partly hidden by the
  Platform-side terminal standing in front of it; the sign now sits at x 2.5, z 6 (`index.html`), clear of it. Not
  re-rendered yet — v2 collects Faisal's notes with it.
- Not yet rendered: 4:5 (Meta, with captions), 9:16, 1:1. About 35 minutes each, on request.
- Warehouse: `posts.js` L12 carries the video on Tue 22 Sep, blocked until the render is approved; L9 (the two-modes
  document) moved to Wed 30 Sep as the follow-up.

# NeroConnect explainer — draft for Faisal, 18 Sep 2026 (nothing final until approved)

Built from Faisal's handover of 18 Sep 2026 (`HANDOVER.md`), the overlay brief (`BRIEF-overlays.md`) and the kit: the five
approved overlays in `glass/`, `data.json` (Harbourline Ltd and sixteen invented merchants), `HANDBOOK.md` as the only
source of product facts. Landscape first (1920×1080, 25 fps); the cut-downs come from the same scenes afterwards.

**Voice:** Olivia — Warm, British Female (`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), the same voice as PP02, at Faisal's
request ("same voice as last, same high energy") — the handover's unhurried mid-thirties male read is not used. One
continuous take (134.2 s raw, 2,158 credits, flow `V5Z2DUgxnS9rAnIxR1yP`, node `6LPztr9vOxFYer0eKrOW`), tightened
`--gap .32 --min .45` with no tempo change (48 gaps, 134.2 s → 119.0 s), gated `--inset .12 --max -30`. The scenes are
cut from it at sentence boundaries, so a line Faisal cuts is one re-take of that scene, or one splice.

## The script as recorded (Faisal edits, then it is re-voiced)

> [curious] So you've got merchants. Cafés, takeaways, shops, all taking card payments. NeroConnect lets you run those
> payments for them, under your own brand. Here's how it works. There are three parts to it. NeroPay processes the
> payments and handles the compliance. You bring the merchants and set the terms. And your merchants take payments on a
> dashboard that's yours, on a domain that's yours. Everything lives in one place. How many merchants are live, what
> they've taken, what you've earned, and what needs you today. And when something does need you, a dispute, a document,
> proof of a payment, it's right at the top, with a deadline. Nothing hides. Every merchant on one screen. Who they are,
> whether they're live, and whether their identity checks are done. Adding one takes five steps. You put in their details,
> NeroPay runs the checks, and they're taking payments. [excited] Now, pricing. Two things are agreed with NeroPay up
> front: who pays the processing fee, and who pays the monthly account fee. Everything else, what your merchants are
> actually charged, is yours to set. And it's simple maths. Your fee, minus NeroPay's cost, is your margin. On every
> single payment. There's a floor under every price, too. You can't set a rate below NeroPay's cost, so you can never lose
> money on a service. Set it at the floor, and you're passing it through at cost. Your logo. Your domain. Your login link.
> Your merchants see your brand, and only your brand, if that's what you want. Terminals, tills and accessories, sold
> through your own store at your own prices. NeroPay ships them and supports them. You keep the margin. Reports show you
> what your merchants earn you. The payments, your fee, NeroPay's cost, and what you keep. And how it moves over time,
> terminal and online, side by side. Your balance is yours to move. And a reserve sits behind it, so payouts keep flowing
> even on a thin day. [warmly] Support comes in two tiers. Free covers the platform. Premium answers your merchants'
> tickets, ships their hardware, and picks up the phone, all in your name. Your merchants. Your brand. NeroConnect. The
> full guides are at docs dot neropay dot app.

370 words; the handover asked for 420–480 and 2:30–3:30. At Olivia's pace this runs 1:59 with air. If Faisal wants the
longer film, the places that take another line are: the dashboard (3), the store's fulfilment (11), the wallet (14).

## The sixteen scenes

The film sits at 0.6 s HEAD; each scene starts 0.35 s before its first word so the entrance lands as she speaks; a
10-frame dissolve joins scenes, a hard cut into the close; 2 s of air after the last word. `data/scenes.json` is the
edit list `build.mjs` renders from.

| # | Scene | Archetype | Runs | Hero move | Voice |
|---|---|---|---|---|---|
| 1 | s01-open | v2 tilted panel | 10.3 s | push-in on the menu panel | So you've got merchants, cafes, takeaways, shops, all taking card payments. NeroConnect lets you run those payments for them, under your own brand. Here's how it works. |
| 2 | s02-three-parties | v4 cascade | 11.4 s | stack drifts, the third card lifts | There are three parts to it. NeroPay processes the payments and handles the compliance. You bring the merchants and set the terms. And your merchants take payments on a dashboard that's yours, on a domain that's yours. |
| 3 | s03-dashboard | v2 tilted panel (approved) | 6.6 s | panel drift | Everything lives in one place. How many merchants are live? What they've taken? What you've earned? And what needs you today? |
| 4 | s04-attention | v5 row stack | 8.0 s | the lit row lifts | And when something does need you, a dispute, a document, proof of a payment, it's right at the top with a deadline. Nothing hides. |
| 5 | s05-register | v2 tilted panel | 6.0 s | panel drift, active-merchant count | Every merchant on one screen. Who they are, whether they're live, and whether their identity checks are done. |
| 6 | s06-five-steps | v4 cascade | 6.3 s | stack drifts and slides | Adding one takes five steps. You put in their details, NeroPay runs the checks, and they're taking payments. |
| 7 | s07-who-sets-what | v6 floating form | 11.3 s | controls hover | Now, pricing. Two things are agreed with NeroPay up front. Who pays the processing fee, and who pays the monthly account fee? Everything else, what your merchants are actually charged, is yours to set. |
| 8 | s08-margin | v4 cascade (approved) | 6.0 s | stack drifts, numbers count | And it's simple maths. Your fee minus NeroPay's cost is your margin, on every single payment. |
| 9 | s09-floor | v1 hero pill | 9.7 s | the pill scales in, background racks out of focus | There's a floor under every price too. You can't set a rate below NeroPay's cost, so you can never lose money on a service. Set it at the floor, and you're passing it through at cost. |
| 10 | s10-branding | v6 floating form | 6.4 s | controls hover | Your logo. Your domain. Your login link. Your merchant see your brand, and only your brand, if that's what you want. |
| 11 | s11-store | v2 tilted panel | 7.2 s | panel drift, the margin bar draws | Terminals, tills and accessories. Sold through your own store at your own prices. NeroPay ships them and supports them. You keep the margin. |
| 12 | s12-reports | m18 ledger tiles (approved) | 5.3 s | tiles count up | Reports show you what your merchants earn you. The payments, your fee, NeroPay's cost, and what you keep. |
| 13 | s13-trend | v3 chart card (approved) | 4.6 s | the line draws | And how it moves over time, terminal and online, side by side. |
| 14 | s14-wallet | v1 hero pill | 6.1 s | the pill scales in, the balance counts | Your balance is yours to move. And a reserve sits behind it, so payouts keep flowing even on a thin day. |
| 15 | s15-support | v5 row stack | 8.9 s | the Premium row lifts | Support comes in two tiers. Free covers the platform. Premium answers your merchant's tickets, ships their hardware, and picks up the phone all in your name. |
| 16 | s16-close | v1 hero pill | 7.4 s | the pill scales in, the link lands | Your merchants. Your brand. NeroConnect. The full guides are at docs .neuropay .app. |

No two consecutive scenes share an archetype (asserted when the timeline is written); across the film v2 ×4, v4 ×3, v1 ×3,
v5 ×2, v6 ×2, m18 ×1, v3 ×1. The two new archetype references are `glass/v5-row-stack.html` and `glass/v6-floating-form.html`;
the approved five are used untouched for scenes 3, 8, 12 and 13.

## Figures on screen (`claims.md` to follow at the final)

Only the seven figures Faisal approved inside the five kit overlays appear anywhere — £1,842.60 · 61 payments · £41.20 ·
£22.85 · £18.35 · 37 merchants · £2,418.36 — plus names from `data.json`. Scenes 7, 9, 10 and 11 carry no figure by design
("Yours to set", "0.00% at cost", "Supply cost: NeroPay's"). No date, no NCPA/NCPF, no "ledger", no real company but
NeroPay.

## Decisions taken, for Faisal to confirm or reverse

1. **The voice.** Olivia, high energy, per Faisal's message — not the handover's spec.
2. **One take, not sixteen.** Continuity of energy; scenes cut at sentences; edits are a re-take of one scene.
3. **The 17 Sep series note vs this brief.** `motion/neroconnect/CLAUDE.md` (17 Sep) says no margin figure, no reports
   screen, no support tiers, and "earn a margin" is not the register. This brief (18 Sep) approves overlays that show all
   three with invented figures. The later brief wins here; the series note should be updated once Faisal confirms.
4. **"You can never lose money on a service"** is the handover's own line (the protected-base floor). It is a product
   fact, not an earnings claim, but it is the one line a compliance reader might pause on. Easy to soften to "so a
   service is never sold below cost".
5. **Music.** None sourced (the handover forbids improvising a bed). The preview is voice only.
6. **Captions.** Not on the preview. The final burns Inter captions from the word timings, per the handover.

## Status

Draft sent to Faisal 18 Sep 2026: stills of all sixteen scenes and the two references (`out/glass/`), the take tightened, the
timeline set, a 720p preview (`out/nc-explainer-16x9-preview.mp4`, 2:02, voice only, no captions, not mastered) rendered as
three parallel `build.mjs --preview --scenes` runs then `--join` (one run is ~0.85 fps on this box; three run at ~5 fps
together). Nothing rendered at delivery quality; nothing published. Awaiting Faisal's notes on the script, the scenes and
the voice before the master.

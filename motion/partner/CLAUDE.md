# Partner Programme — series brief

A series in the motion graphics style. **Read `motion/CLAUDE.md` first** for the style, the rails and
the gate. **Then read `BRIEF.md` beside this file** — Faisal's brief, v4 final of 17 September 2026: the programme
exactly (Part 1), the five hard rules and the compliance line (Part 2), the two modules (Part 3), the social
short-form system with its hook library (Part 4), the long-form explainer (Part 5) and the QA list (Part 6). Every
figure in it is final and approved; there are no open questions. This file is only what is particular to building
it here.

**Premise.** What a partner earns, led by the potential (per merchant, its condition on the same frame) for a viewer who has never heard of us, then how it works and why there is nothing to sell, as an animated diagram: the street of
shopfronts that light when introduced, the ledger row that goes live, the Bonus Dial, the Rate Climb. Every number
on screen sits with the volume or count that earns it, at every frame.

**Channel.** Meta and TikTok for the social short-form (4:5 first for Meta, then 9:16 and 1:1), the partner landing
page, docs and YouTube for the long-form (16:9). LinkedIn carries the 16:9 and 4:5 cuts.

**Ground.** The white world — `#FBFAF7`, ink type, the yellow as the accent, a little blush and lilac in the glass
pieces and the glass tint. Never dark: Faisal rejected the dark-ground first cut on 17 Sep 2026 ("no more black background
theme"); the partner brief's dark tokens are not used. Poppins is the family, Martian Mono for figures and kickers,
Source Serif 4 italic for the human line — the merchant videos' fonts. Captions drawn in the picture, the spoken word
on a yellow marker.

**Movement.** The camera never stops (a slow orbit and breath); one real payment card (`paymentCard()`, `motion/lib/glass.js`) drifts and turns at the edge of every section, half out of frame, never the focus; objects sway;
every phrase that can be a graphic is one. The view swings left, right and centre from section to section so the
type is never in the same place twice running.

**Voice.** **Olivia — Warm, British Female** (`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), chosen by Faisal for PP01 on
16 Sep 2026. Verity stays the merchant series voice. The read is UGC: one continuous piece of talking, condition
first, no one-liners, tightened gently (`tighten.mjs --gap .32 --min .45 --tempo 1.03`) and gated only where nothing louder than −30 dBFS sits between words (`gate.py --inset .12 --max -30`) — the v2 settings clipped words.

**Sound.** An upbeat instrumental bed throughout (PP01: `video/library/bgm/partner-upbeat-118.mp3`, 117.84 bpm; PP02:
`partner-walk-108.mp3`, 107.9 bpm — both Eleven Music v2, no vocals), ducked under the voice; effects only on something moving, no effect twice in a row, one
soft thud on the CTA landing.

## Two rulings for every partner video — Faisal, 17 Sep 2026

1. **The bonus is said as paid, not as conditional.** The take never says "based on what they take in their first
   thirty days". It says the bonus is paid "once they've been taking card payments with us for thirty days" — certain,
   only delayed. The tier condition (£100 / £200 / £300 by first-30-day takings) stays on screen, in the module's
   small print and the compliance super, so BRIEF.md's rule — every figure with its condition on the same frame —
   still holds; it is no longer in the sentence.
2. **Every video portrays how little the partner does.** We handle everything: the partner does not sell, does not set
   up, and does not even have to make the call — a name and a phone number is enough and we close it for them. No copy
   may sound like work for the partner (PP02's "walk down your road and count" was cut for this).
4. **Objects float; nothing sits on the shops or in the bottom half (17 Sep 2026, PP02 v4).** The phone, the terminals
   and the receipts hover above the street in the upper half of the frame, never in front of a shop and never cut by a
   frame edge. A vehicle sits flat on the road — no pitch, no wobble. Strikes are red and carry the feeling. A stack of
   overlays keeps clear space between its items. A soft shadow under the type and the panels, never a hard one.
3. **The voice leads (17 Sep 2026, PP02 v3).** Nothing is on screen before she has said it; every graphic is anchored to
   the word that earns it, so the overlays feel guided by her. Headings that mirror the take rise word by spoken word,
   the typewriter types on her words, a shop lights on the word that names it. The camera lands before the first word
   of a stop, never after.

## The figures and the gate

`figures.json` carries `partner_bonus_tiers`, `partner_revenue_share_tiers` and `partner_active_gate` as confirmed
records (BRIEF.md v4, Part 1; £500 in older material is superseded). `checks.py` asserts for every episode here: the
thresholds the composition steps at are the register's; every pound figure on screen sits in the same element as
its condition; both rest frames carry "£40,000+ / 111+" and "Most partners start at 20%: three a month."; the
brief's banned register (passive income, easy money, guaranteed, no effort, risk-free, no cost no contract, "up to
40%" alone, £500, any personal attribute) is absent from the take and the screen; no competitor and no hardware
maker is named; "yours either way" and the CTA are in the take; no exclamation mark in a super; no draft mark.

Rail 10 still covers anything beyond the public tiers: negotiated partner terms, margins, the share in pounds.

## Episode bank

| # | Folder | What | State |
|---|---|---|---|
| 1 | `pp01/` | The programme, complete — the earnings hook, who we are, the bonus, the share, the quiet month, the close on neropay.app/partners; one continuous UGC script, Olivia, the white world, six sections, 68 s | **v4 delivered 17 Sep 2026 (4:5)** — one real card per section in place of the spheres; Faisal's generated plates (`pp01/AI-PLATES.md`) still to come, and the video re-renders when they do — `script.md` and `claims.md` in the folder |
| 2 | `pp02/` | Your road — the network angle as one walk down one English high street, no place named; the hook question, the receipt, the three strikes, the phone and the van, the lamp-post signs, the quiet month, the nameplate; Olivia, 49 s | **v4 delivered 17 Sep 2026 (4:5)** — the voice leads: every graphic on its word; a bare count that flips into the question; red strikes; the phone, the terminals and the receipts floating above the street; the continuous climb; the van flat on the road; the CTA stack spaced; `PROPOSAL.md`, `script.md`, `claims.md` in the folder; location lines for ads not yet recorded |
| — | | Brief A's hook library (37 hooks × two bodies) as swappable openings on a shared body, per BRIEF.md Part 4 | Not started — the body would be cut from PP01's script once its register is approved |
| — | | Brief B, the 2:30–3:00 long-form explainer, chaptered for YouTube | Not started |
| — | | Turkish pass | After the English set has run clean for two weeks (BRIEF.md Part 2) |

## Open with Faisal

- Length: PP01 runs 68 s against the brief's 22–28 s social module. The rewrite asked for a complete, engaging
  piece; if the short modules are still wanted, the hook + body + close are cut from this script.
- The other crops of v4 (9:16, 1:1, 16:9) — rendered on request, about 35 minutes each.

**The partner link is `neropay.app/partners`** (Faisal, 17 Sep 2026) — in the take, on screen and in the compliance super; the brief's `partners.neropay.app` is not used.

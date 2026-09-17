# Partner Programme — series brief

A series in the motion graphics style. **Read `motion/CLAUDE.md` first** for the style, the rails and
the gate. **Then read `BRIEF.md` beside this file** — Faisal's brief of 16 September 2026: the programme
exactly (Part 1), the five hard rules and the compliance line (Part 2), the brand tokens and the two modules
(Part 3), the social short-form system with its hook library (Part 4), the long-form explainer (Part 5), the QA
list (Part 6) and what is open with Eray (Part 7). This file is only what is particular to building it here.

**Premise.** What a partner earns and the condition, said condition-first, as an animated diagram: the
street of shopfronts that light when introduced, the ledger row that goes live, the Bonus Dial, the Rate
Climb. Every number on screen sits with the volume or count that earns it, at every frame.

**Channel.** Meta and TikTok for the social short-form (9:16 first, 1:1 and 4:5), the partner landing page,
docs and YouTube for the long-form (16:9). LinkedIn carries the 16:9 and 4:5 cuts.

**Ground.** The brief's dark ground — `world({ dark:true })`, `#0A0B0D`, white ink, `#8A8F97` dim, the yellow
as the one accent, green only for LIVE. Poppins is the family (house ruling, 16 Sep 2026); the brief's Inter and
DejaVu Mono are not used. Captions drawn in the picture, the spoken word on a yellow block.

**Voice.** **Olivia — Warm, British Female** (`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), chosen by Faisal for PP01
on 16 Sep 2026. Verity stays the merchant series voice. The read is UGC: one continuous piece of talking,
condition first, no one-liners, tightened at 1.06× and breath-gated (`motion/tighten.mjs --tempo`, `motion/gate.py`).

**Sound.** An upbeat instrumental bed throughout (`video/library/bgm/partner-upbeat-118.mp3`, Eleven Music v2,
117.84 bpm, no vocals), ducked under the voice; effects only on something moving, no effect twice in a row, one
soft thud on the CTA landing.

## Draft builds only — the gate as it stands

`/CLAUDE.md`: *"The partner incentive model is not signed off. No partner post carries figures; L4 stays
blocked."* That still holds for anything **published**. For **draft builds**, Faisal's brief released the
programme figures, and they sit in `figures.json` as `partner_bonus_tiers`, `partner_revenue_share_tiers` and
`partner_active_gate` with `status: "draft"` and a `confirm_open` field naming what Eray has to settle:

1. Is £300 the top bonus tier, or does the £500 on the live leaflets and landing page exist?
2. One definition of "active merchant" for the T&Cs.
3. What exactly the revenue share is a share of, and when and how it is paid.

`verify.py` accepts a draft record through `draft_figure()`, marks the build DRAFT, `finish.sh` names every
export `-DRAFT`, and the composition carries a draft mark on every frame. When Faisal clears the three items,
flip the records to `confirmed`, remove the mark, drop `-DRAFT` from `finish.sh`, and re-render. If the top
tier becomes £500, the dial's third step and the compliance line change and nothing else (BRIEF.md Part 1).

**What `checks.py` asserts** for every episode here: the thresholds the composition steps at are the
register's; every pound figure on screen sits in the same element as its condition; both rest frames carry
"£40,000+ / 111+" and the "Most partners start at 20%: three a month." line; the brief's banned register
(passive income, easy money, guaranteed, no effort, risk-free, no cost no contract, "up to 40%" alone, £500,
any personal attribute) is absent from the take and the screen; no competitor and no hardware maker is named;
"yours either way" and the CTA are in the take; no exclamation mark in a super.

## Episode bank

| # | Folder | What | State |
|---|---|---|---|
| 1 | `pp01/` | The programme, complete, condition first — one continuous UGC script, Olivia, dark world, six sections, 70 s, four crops | **DRAFT rendered 17 Sep 2026** — awaiting Faisal's review and Eray's three answers. `script.md` and `claims.md` in the folder |
| — | | Brief A's hook library (37 hooks × two bodies) as swappable openings on a shared body, per BRIEF.md Part 4 | Not started — the body would be cut from PP01's script once its register is approved |
| — | | Brief B, the 2:30–3:00 long-form explainer, chaptered for YouTube | Not started — needs the CONFIRM items closed first, since it carries the figures in full |
| — | | Turkish pass | After the English set has run clean for two weeks (BRIEF.md Part 2) |

## Open with Faisal

- The three CONFIRM items above, with Eray.
- Length: PP01 runs 70 s against the brief's 22–28 s social module. The rewrite asked for a complete, engaging
  piece; if the short modules are still wanted, the hook + body + close are cut from this script.
- Whether the long-form should wait for the figures or be built figureless for the mechanics first.

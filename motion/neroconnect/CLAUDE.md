# NeroConnect — series brief

A series in the motion graphics style. **Read `motion/CLAUDE.md` first** for the style, the rails and the gate, then
`MOTION-HANDOVER.md`'s rulings (Faisal, 17 Sep 2026). This file is what is particular to NeroConnect.

**Premise.** NeroConnect is NeroPay's white-label payments platform: a software company, an EPOS installer or anyone
looking after a group of merchants runs card payments under their own name, on our rails. The series sells the
*network model* — the terminals, the till software, the settlement, the compliance and the support already exist, and
NeroConnect lets you run them as your own. Business-minded viewers, not owner-operators.

**Channel.** LinkedIn first (16:9 native, no burnt captions), then 4:5 for Meta and 1:1 as a fallback. Posted as NeroPay.

**Source of truth.** The public docs at docs.neropay.app (NeroConnect section, 16 articles publishing Sep 2026) and, for
what may be said, the docs build plan and partner handbooks on Drive (`NeroConnect` folder). Public names, confirmed by
Faisal 17 Sep 2026: **Connected mode** and **Platform mode**. Custom terminal branding is available (Faisal, same day).

## What a NeroConnect video may not say — from the docs build plan §8 and the open questions in §7

- **No fee, no rate, no margin, no wholesale figure**, and no worked example with real numbers. Connect Reports and the
  pricing screens never appear, even blurred (rail 7 and the plan's confidentiality section).
- **Nothing about the store's monthly payment plans.** Whether a merchant instalment plan is inside FCA consumer credit
  is an open question for Eray, which puts it under rail 1 until answered.
- **No support plan price** (the £500 Premium figure is not approved as public).
- **"Effortless", "no effort", "no cost", "risk-free", "passive"** do not appear, in the take or on screen. The feeling of
  ease is built by *structure* (the stack already standing, the name swapping) not by those words — the same rule as
  the partner brief, Part 2.
- **Platform mode may need its own regulatory permissions.** Said plainly, as the concession, in every video that
  explains the two modes. It is also what keeps "run your own payments brand" honest.
- **No real platform, partner or merchant named.** The brand on the terminal and the dashboard is a placeholder mark
  ("YOUR BRAND"), never a real logo and never a NeroPay card or prop.
- **"Earn a margin on every transaction"** and its cousins are not the register. Say what the platform *does*: sets its
  merchant pricing (Platform mode), keeps the relationship, runs one dashboard.

## Figures and the gate

The intro (NC01) states no number, which is unusual for `motion/` and deliberate: an intro to a mechanism needs none.
`checks.py` still runs: it asserts no digit-led figure on screen, no banned register, both CTAs in the take, no
competitor and no hardware maker named, and the regulatory line present. A later episode that states a figure adds a
`figures.json` record first, as everywhere else.

## Voice and sound

**Olivia — Warm, British Female** (`pPoztmvzd5p26S3MsNrV`, `eleven_v3`), the partner-side voice — NeroConnect is the same
audience. One continuous UGC read, tightened `--gap .32 --min .45 --tempo 1.03`, gated `--inset .12 --max -30`. A new
instrumental bed per video from Eleven Music v2, ledger row before it ships.

## Episode bank

| # | Folder | What | State |
|---|---|---|---|
| 1 | `nc01/` | The intro: you don't have to build a payments company to run one — the stack that already exists, the name roll, the rails underneath, the two modes, who it's for and isn't, the docs, the whole world; Olivia, 87.5 s | **script approved and 16:9 rendering, 17 Sep 2026** — `PROPOSAL.md`, `script.md`, `claims.md`, `checks.py`, `objects-nc.js` in the folder |
| 2 | — | The two modes, in depth: one decision, a row at a time | not started — cut from NC01 once approved |
| 3 | — | A day on the platform: a merchant is created, goes live, takes a payment, the money lands, the statement is generated | not started |
| 4 | — | The wrong door: NeroConnect or the partner programme | not started |

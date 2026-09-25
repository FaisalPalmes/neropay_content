# Partner Programme explainer: claims register

Every figure on screen, where it comes from, and the condition it travels with. Source for all of them: `motion/partner/BRIEF.md`
v4, Part 1 (final, confirmed by Faisal 17 Sep 2026) and the `figures.json` records `partner_bonus_tiers`,
`partner_revenue_share_tiers` and `partner_active_gate`. Built 25 Sep 2026. Marked final, as the brief directs.

| On screen | Condition shown in the same frame | Scene |
|---|---|---|
| £100–£300 | "for every business that goes live", "set by what it takes in its first 30 days" | 2 (hook) |
| £100 | "£0–£20,000 in their first 30 days", "per merchant that goes live" | 7, Bonus Dial |
| £200 | "£20,000–£39,999 in their first 30 days", "per merchant that goes live" | 7, Bonus Dial |
| £300 | "£40,000+ in their first 30 days", "per merchant that goes live" | 7, Bonus Dial (rest frame) |
| £0 / £20,000 / £40,000+ | the Dial's volume scale, labelled "What the business takes in its first 30 days" | 7 |
| 3 × £100–£300 | "Bonus, set by its first 30 days", "each depending on that business" | 8 |
| 1, 2, 3 (calendar) · Active Partner | "In any calendar month", "new active merchants" | 9 |
| 0% | "Under 3 this month: no revenue share" | 10, Rate Climb (before the base) |
| 20% | "3–20 new active merchants this month" | 10, Rate Climb |
| 25% | "21–35 new active merchants this month" | 10 |
| 30% | "36–60 new active merchants this month" | 10 |
| 35% | "61–110 new active merchants this month" | 10 |
| 40% | "111+ new active merchants in one month", with "Most partners start at 20%: three a month." | 10 (rest frame) |
| None (revenue share that month) · Paid either way | "Under three in a month?" | 11 |
| 3 of 3 · Active Partner · 20% · whole network · £100–£300 each, by their first 30 days | the month ledger | 12 |
| Full compliance line, verbatim from the brief (terms URL: neropay.app/partners) | held from 130.2 s to the outro, 3.7 s = 92 frames | 14 |

**How the modules keep the rule.** The Bonus Dial and the Rate Climb each compute the figure and its condition from one state
on the same frame (`module()` in `index.html`), so a figure can never show without the condition that earns it. The Dial's volume
crosses each threshold as she says the bonus it earns; the Climb passes every threshold (3, 21, 36, 61, 111) and skips none.

**Not on screen, by design.** No total income, no revenue share in pounds, no share of merchant turnover (the approved wording,
"a share of what your merchants' card payments earn NeroPay", is used as written), no £500, none of the banned register (passive
income, easy money, guaranteed income, no effort, risk-free, no cost no contract, "up to" alone), no lifestyle imagery, no personal
attribute. The merchant names in the ledger and dashboard are the invented set used across the NeroConnect films.

**One departure from the brief, at Faisal's instruction (25 Sep 2026).** The terms link is **neropay.app/partners**, not the
brief's partners.neropay.app. Confirm both resolve before this goes on docs.neropay.app.

**Upload.** The voice is generated (ElevenLabs, Olivia): the description carries the full compliance line and "Voice generated with AI".

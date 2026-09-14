# The Maths — series brief

One series in the motion graphics style. **Read `motion/CLAUDE.md` first** — it carries the style,
the rails, the pipeline and the `figures.json` gate. This file is only what's particular to The Maths.

From `MOTION-SERIES-BRIEF v1.0` (Faisal), 14 September 2026.

**Premise.** Each episode takes one number out of a merchant's life and works it out on screen. We
show our own workings, including the cases where NeroPay is not the best answer. That concession is
the format's whole reason to exist and the reason anyone stops for it.

**Spec.** 30–45 seconds · primary 9:16, also exported 16:9 / 4:5 / 1:1 · one number per episode; if an
episode needs two ideas it is two episodes · "we", never Faisal. Judged on **saves and shares**, never
likes or follower count.

**Strategic job.** Social is not an acquisition channel. This series serves, in order: credibility
after contact → manufacturing shopping-around behaviour → partner recruitment.

## Episode bank

| # | Number | The turn | State |
|---|---|---|---|
| 1 | 3.30% | What you'd pay *us* on a £4 coffee. Don't switch. | **Blocked** — states a NeroPay transaction rate |
| 2 | £0 | Our POS software against what a paid restaurant POS tier costs a year | Needs the free-tier concession on screen |
| 3 | £20.51 | The average sale where a fixed fee stops hurting and starts helping | **Blocked** — the crossover is 8p ÷ (1.69% − 1.30%) |
| 4 | 42% | UK merchants who haven't considered switching in two years | **Clear** — fully sourced, nothing blocked |
| 5 | 8p vs 15p | Why the fixed fee moves more money than the rate | **Blocked** — open question with Eray |

**Destination.** Every episode ends at `neropay.app/maths`, a public break-even calculator that
returns the honest answer including when NeroPay loses. Not built yet — until it exists, end cards
point at `neropay.app`.

## Open questions — raised 14 September 2026, awaiting Faisal

**1. Episode 1 (3.30%) is blocked.** The turn is good — the honest "don't switch" is the strongest
thing in the bank — but the episode is built on stating a NeroPay transaction rate, and `/CLAUDE.md`
says not to: *"Do not state the terminal price or any transaction rate — the internal figures conflict
and it's an open question for Eray."* 3.30% is also a fourth number, not any of the three already on
record (1.30% + 15p standard, 0.80% bespoke floor, 0.70% flat in the video series). Needs Eray to
settle the rate before it can be written.

**2. Episode 3 (£20.51) is blocked, and the reason isn't obvious.** The crossover only works out at
£20.51 on one set of inputs:

```
8p ÷ (1.69% − 1.30%) = £20.51
```

So the episode implicitly states NeroPay at **1.30% + 8p** — a rate that appears nowhere in this repo
(the internal standard is 1.30% + **15p**), and it depends on the exact 8p figure that blocks episode
5. Same blocker, one layer down. Two ways out: settle the rate with Eray, or rewrite the episode as
pure maths between two unnamed benchmarks with no NeroPay figure in it at all — which is the version
that survives a price change anyway, and reads as more honest, not less.

**3. Episode 2 (£0) works, with one condition.** It has to concede on screen that free POS tiers
exist elsewhere. `/CLAUDE.md` records that *"competitors charge for POS software" is inaccurate* — the
true claim is about paid tiers — and post L8 corrects it publicly. The benchmark record is scoped to
"a typical paid restaurant POS tier" for exactly this reason. Without the concession the episode
reintroduces a line we've already retracted, and rail 4 of the style is the concession rail anyway.

**4. Episode 4 (42%) is clear.** Every figure is sourced, nothing is blocked, no NeroPay rate is
needed, and the concession writes itself — 76% of people who switched found it easy, which is as much
an argument for going to someone else as for coming to us. Recommended as episode 1 of the series.
The fieldwork date (Oct–Dec 2019) must be on screen; it's old and stating it undated is a
substantiation problem.

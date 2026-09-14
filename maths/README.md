# The Maths — series workspace

The spec is the series block at the end of `/CLAUDE.md`. The figure register is `/figures.json`.
This file is the open-questions list: what is blocking which episode, and the working behind it.

## Layout

```
maths/
  verify.py          stage 3 — the arithmetic gate, run before any frame is rendered
  <episode>/
    checks.py        computes every on-screen figure and asserts it. Required.
    index.html       self-contained, setFrame(n) drives the render
    script.md        VO script and on-screen copy
    out/             git-ignored
```

```
python3 maths/verify.py             # audit figures.json
python3 maths/verify.py episode-4   # audit, then run that episode's checks
```

`checks.py` runs with `figure()`, `check()`, `scan_copy()` and `crossover()` in scope. Any figure it
touches must resolve to a confirmed `figures.json` record or the build stops.

## Open questions — raised 14 September 2026, awaiting Faisal

**1. Episode 1 (3.30%) is blocked.** The turn is good — the honest "don't switch" is the strongest
thing in the bank — but the episode is built on stating a NeroPay transaction rate, and `CLAUDE.md`
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
exist elsewhere. `CLAUDE.md` records that *"competitors charge for POS software" is inaccurate* — the
true claim is about paid tiers — and post L8 corrects it publicly. The benchmark record is scoped to
"a typical paid restaurant POS tier" for exactly this reason. Without the concession the episode
reintroduces a line we've already retracted, and rail 8 is the concession rail regardless.

**4. Episode 4 (42%) is clear.** Every figure is sourced, nothing is blocked, no NeroPay rate is
needed, and the concession writes itself — 76% of people who switched found it easy, which is as much
an argument for going to someone else as for coming to us. Recommended as episode 1 of the series.
The fieldwork date (Oct–Dec 2019) must be on screen; it's old and stating it undated is a
substantiation problem.

## Two tooling questions

**Renderer.** The brief specifies a bespoke Playwright `setFrame(n)` + ffmpeg pipeline and names
`anim.py` and `edit.py` as existing code to reuse. Neither is in this repo — `CLAUDE.md` already
records that `anim.py` and `neropay-edit-pipeline.zip` were never attached. Meanwhile `video/` is a
HyperFrames workspace that already does HTML → frames → ffmpeg, is installed by the session-start
hook, and has `video/b1-rate-you-were-quoted/` as a working reference. Either bring `anim.py` and
`edit.py` across, or build the series on HyperFrames and keep the brief's discipline — `figures.json`,
the timing law, the stage-3 gate — on top of it. Faisal's call, not one to make in passing.

**ElevenLabs.** The MCP isn't connected in this session, so no VO and no word timestamps here. Since
the pipeline is audio-first, an episode can be written, verified and laid out, but not rendered to a
real timeline until that's available.

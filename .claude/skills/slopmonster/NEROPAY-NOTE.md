# /slopmonster in this repo — what is different from upstream

Installed 17 Sep 2026 from https://github.com/ItsssssJack/SlopMonster (MIT, licence kept beside this file)
into `.claude/skills/slopmonster/`, at Faisal's ask, so every session has it. `SKILL.md`, `references/`,
`prompts/`, `tools/` and `examples/` are upstream's own; the mascot images and the GitHub Action were left out.
Both regression suites pass here (`python3 tools/test_deslop.py`, `bash tools/test_cleanse.sh`).

Four things to know before using it on NeroPay copy:

1. **The rails win.** The linter scores for AI tells; it knows nothing about s.21 FSMA, the earnings-claim
   register or "we, never I". A 5/5 is not clearance to post. `/CLAUDE.md`, `rails.html` and
   `/linkedin-post` still decide, and the rewrite passes must not soften a figure's condition or move a
   concession out of a post.
2. **Our numbers are real, so use `--allow-proof`.** The "invented proof" rule flags any number-plus-noun.
   On the first live run, post L1 scored 4/5 only because "98 food businesses" tripped it — a NeroPay
   count, sourced in `/CLAUDE.md`. Every figure we publish carries a date and a source, so score with
   `python3 .claude/skills/slopmonster/tools/deslop.py --allow-proof --text "…"` and let the other four
   rules do the work. A figure that is *not* in the register does not get `--allow-proof`; it gets cut.
3. **The cleanse step sends the draft to another model.** `tools/cleanse.sh` looks for a `codex` CLI (then
   `claude`); neither is on the web container, so it prints the prompt for pasting. Marketing copy is fine to
   paste into another chat; anything under rail 10 (negotiated rates, partner terms, margins) or rail 7 (real
   data) is not, and never was going to be in a post anyway.
4. **Score the words a reader sees.** For a post, pass the `copy` field; for a page, the built HTML. The
   catalogue is English only — the Turkish scripts score 5/5 because the scorer cannot read them.

Where it sits in the loop: draft → `/linkedin-post` audit (or the rails read for Meta) → `/slopmonster` score
and rewrite → rails read again → Faisal reviews. It is a second opinion on register, not a gate on truth.

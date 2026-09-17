# SlopMonster in this repo — how it was installed and how to use it here

Installed 17 Sep 2026 from https://github.com/ItsssssJack/SlopMonster at commit `f261dbf`
(7 Sep 2026), MIT licence (`LICENSE` is beside this note). Two deviations from upstream:

- `docs/img/` (3 MB of README illustrations) and `.github/workflows/slop.yml` are not copied.
  The workflow is a build gate for a repo whose product is copy; ours is a static site with
  no CI, and the gate would fail on every page that quotes a competitor figure.
- Nothing else changed. `tools/deslop.py` is stdlib Python, no network, no writes.

## What it does here

`/slopmonster` lints copy for AI tells and scores it out of five: vocabulary, constructions,
punctuation cadence, rule-of-three rhythm, invented proof. Run it on every caption before it
ships and on any draft that reads too smoothly:

```bash
python3 .claude/skills/slopmonster/tools/deslop.py --text "paste the caption"
node -e "global.window={};require('./posts.js');process.stdout.write(window.POSTS.find(p=>p.id==='L3').copy)" \
  | python3 .claude/skills/slopmonster/tools/deslop.py --text "$(cat)"
```

Measured on the warehouse the day it was installed: L8 and M4 score 5/5; L3 loses a point for
one three-item list; L1 loses a point for "98 food businesses", which is our own count and
therefore a false positive. Use `--allow-proof` when the figure is sourced in `CLAUDE.md` or
`figures.json`.

## What outranks it

- **The rails in `CLAUDE.md` outrank the linter.** A concession sentence, a dated competitor
  figure or a "correct as of" line stays even if the scorer dislikes its shape.
- **The invented-proof rule is ours already** (rails 5 and 7). Anything it flags that is not in
  `CLAUDE.md` §"Numbers you can use" or `figures.json` does not ship.
- **The house prose in this repo uses em dashes freely.** That is documentation, not copy.
  Post copy follows the linter on this: at most one em dash per post, usually none.
- **Step 3, the rival-model cleanse, does not run in a cloud session.** `tools/cleanse.sh`
  needs the `codex` CLI, which is not installed, and it correctly refuses to route a Claude draft
  back to `claude`. It prints the prompt instead; paste it into a non-Anthropic model yourself if
  a piece needs the second opinion. Steps 1, 2 and 4 work as written.

# Standing notices — printed at the start of every session by the session-start hook

One line per notice, newest first. Keep it to what a session must know before it writes a word or a
frame, and retire a line once it is folded into the docs and nobody can get it wrong any more.

2026-09-22 · `library.js` / `library.html` is the DELIVERY REGISTER — the only place that records a decision. Write the row in the same commit that renders a video. A session may set any state including `approved`, but only when Faisal says so in chat, and `by` must name who and when. Never infer `approved` from a render or a README calling itself final.
2026-09-22 · Six finished videos exist ONLY as Higgsfield CDN links — no durable copy anywhere. Faisal must download them into their Drive folders; a session cannot (the connector will not carry files that size). `backup: false` in `library.js` marks each one.
2026-09-21 · The yellow full stop is RETIRED (Faisal). The mark's 46.5° diagonal is the signature instead — measured off the icon, carried in `social/templates/stage.css` as `--ang`. `BRAND-MOTION.md` is the spec for what a video does at the top, the cut and the end. Finished renders are not reissued; `BRAND.md` §6.3 still open.
2026-09-21 · Card templates are v2: the corner seam, the double-slash rule, the symbol stamp on interior carousel cards. Re-render creative with `node social/render.mjs` rather than reusing anything exported before today.
2026-09-21 · Never register a `UserPromptSubmit` hook, and never register any hook before its script is committed. A missing hook script blocks every prompt and the session cannot be told to undo it. `.claude/hooks/prune-dead-hooks.py` now strips dead hooks at every session start.
2026-09-19 · BRAND CHANGED. New kit from Eray at `brand/`; `BRAND.md` is the authority. Yellow #FFCF24, ink #111114. The wordmark is placed artwork, lowercase, never typeset, no full stop. Finished renders are not reissued without Faisal.
2026-09-19 · Captions rewritten. Every post in `posts.js` scores 5/5 on `/slopmonster --allow-proof`. Keep it that way; the linter runs before a caption ships.
2026-09-17 · Partner figures are final (`figures.json` `partner_*`). Each figure travels with its condition, per merchant, never a total.

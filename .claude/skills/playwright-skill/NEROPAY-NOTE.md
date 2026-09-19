# playwright-skill in this repo

Installed 19 Sep 2026 from https://github.com/willmarple/playwright-skill (MIT), at Faisal's ask. `SKILL.md`, `bin/`
and the `skill/` docs are upstream's; `dist/` is the TypeScript build of upstream's `src/` (two of the bin scripts
need it). Tests and sources were left out.

It drives `playwright-cli` (Microsoft's `@playwright/cli`, 0.1.21 when installed). The session-start hook now installs
it globally on cloud sessions; on a local machine run `npm install -g @playwright/cli` once. Chromium is already at
`/opt/pw-browsers/` in a cloud session.

What it is for here: the verification step in `CLAUDE.md` (load every page, no console errors, `.post` count equals
`POSTS.length`, nothing overflows at 390px), checking `social/out/` renders against the brief, and reading a page's
accessibility tree. It is not the render route for cards (that is `social/render.mjs`) and not a HyperFrames
render tool. `bin/auth-save` stores credentials in a local file: never point it at a live NeroPay dashboard (rail 7).

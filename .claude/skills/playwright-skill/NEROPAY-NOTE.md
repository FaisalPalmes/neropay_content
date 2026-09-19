# playwright-skill in this repo

Installed 19 Sep 2026 from https://github.com/willmarple/playwright-skill (MIT), at Faisal's ask. `SKILL.md`, `bin/`
and the `skill/` docs are upstream's; `dist/` is the TypeScript build of upstream's `src/` (two of the bin scripts
need it). Tests and sources were left out.

It drives `playwright-cli` (Microsoft's `@playwright/cli`, 0.1.21 when installed). The session-start hook installs it
globally on cloud sessions and writes `.playwright/cli.config.json` at the repo root, pointing it at the pre-installed
Playwright Chromium with `--no-sandbox` (its default is Google Chrome, which the image lacks, and the sandbox fails as
root). Verified 19 Sep 2026: `bin/open`, then `playwright-cli goto http://127.0.0.1:8765/social.html`, returned an
accessibility tree with all 24 posts. Two things it will not do: open a `file:` URL (refused by design; serve the
repo with `python3 -m http.server 8765 --bind 127.0.0.1` first) and fetch Google Fonts (the page's font requests are
blocked at the proxy, harmless). On a local machine run `npm install -g @playwright/cli` once and no config is needed.

What it is for here: the verification step in `CLAUDE.md` (load every page, no console errors, `.post` count equals
`POSTS.length`, nothing overflows at 390px), checking `social/out/` renders against the brief, and reading a page's
accessibility tree. It is not the render route for cards (that is `social/render.mjs`) and not a HyperFrames
render tool. `bin/auth-save` stores credentials in a local file: never point it at a live NeroPay dashboard (rail 7).

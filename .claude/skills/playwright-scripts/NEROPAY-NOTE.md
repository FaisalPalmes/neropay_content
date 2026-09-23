# playwright-scripts in this repo

Installed 23 Sep 2026 from https://github.com/lackeyjb/playwright-skill (`skills/playwright-skill/`, v5.0.0, MIT;
LICENSE beside this file), at Faisal's ask. Renamed `playwright-scripts` in its frontmatter because this repo already
has a `playwright-skill` (willmarple's, driving `@playwright/cli`). Nothing else changed. Its tests were left out.

It writes a Playwright script and runs it through `run.js` with its helpers. Its default is a visible browser, which a
cloud session does not have, so always run headless against the pre-installed Chromium:

    PW_HEADLESS=true PW_EXECUTABLE_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome \
      node .claude/skills/playwright-scripts/run.js <script.js>

Serve the site first (`python3 -m http.server 8765 --bind 127.0.0.1`). The session-start hook installs its
`playwright` package (`node_modules/` is git-ignored). Verified 23 Sep 2026: all eight pages at 390 and 1440, no
console errors, no horizontal overflow, `.post` count equal to `POSTS.length`.

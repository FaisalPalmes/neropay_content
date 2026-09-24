# last30days — NeroPay house notes

Installed 24 Sep 2026 at Faisal's request from mvanhorn/last30days-skill (MIT, v3.25.0). The upstream
`assets/` folder (14 MB of demo images and audio) is left out; nothing in the skill needs it.

**Run it with Python 3.12+.** The container's default `python3` is 3.11 and the engine refuses it. Set
`LAST30DAYS_PYTHON=python3.12` before invoking. Verified 24 Sep 2026 with `--diagnose`: the keyless sources
that work from the web container are Reddit, Hacker News, Polymarket, GitHub and web grounding. X, YouTube,
TikTok and the rest need paid keys and are off.

**Browser cookies stay off.** The engine can read browser login cookies (for X) only when explicitly told to
with `--allow-browser-cookies`, and `agentcookie` only if that CLI is installed. Never pass the flag; run with
`AGENTCOOKIE=off FROM_BROWSER=off`. There is no browser in the container anyway.

**What it is for:** ideas, audience language, what UK merchants are complaining about this month.
**What it is never for:** a figure that goes into copy. Competitor prices come only from the dated register in
`generation-pack.md` (rail 5); every on-screen number needs a confirmed `figures.json` record. A Reddit thread
is not a source. Nothing it finds names a merchant (rail 6).

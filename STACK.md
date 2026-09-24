# The stack — what a NeroPay content session has to work with

Written 15 Sep 2026 so a new Claude Code session can be brought up to speed in one file. Point a
session at this and it knows what tools exist, what is already licensed and committed, what it can
reach from where, and what it must not do. Everything here was verified in a live session on the
date shown, not recalled.

A session that will own the social posts reads `SOCIAL-HANDOVER.md` before this file; it is the
social cut of everything below.

Read order for a session that will touch video: this file → `CLAUDE.md` (the rails) →
`video/PLAYBOOK.md` (the standing brief) → `video/LESSONS.md` (the fault log) → `video/AUDIO.md`
(sound) → `video/TOOLS.md` (third-party libraries).

---

## 1. Credentials — read this before asking anyone for a key

**There are no API keys to hand over, and no session holds one.** This is not a restriction to work
around; it is how the credentials are designed to work here.

| What | Where it lives | Can it be copied to another session? |
|---|---|---|
| Connector auth (ElevenLabs, Higgsfield, Drive, Gmail, Calendar, Notion, Facebook Ads) | OAuth held by Anthropic, attached per session | **No key exists to copy.** Enable the connector on the other session instead |
| GitHub | a scoped credential injected by the harness; the real token never enters the VM | No — every session gets its own |
| `FREESOUND_TOKEN` | `video/library/.env`, git-ignored, on Faisal's machine | Not needed — `fetch-sounds.mjs` has worked without it since 12 Sep 2026 |
| ElevenLabs / HeyGen / Gemini API keys | **not set anywhere in this repo or container** | n/a |

Three correct ways to give a session a credential, in order of preference:

1. **A connector**, when one exists for the service. Nothing to store, nothing to leak, and the
   traffic reaches the service through Anthropic's servers rather than the session's network — so it
   works even when the environment's allowlist would block the host.
2. **An environment API credential** (cloud sessions, Pro and Max plans). Stored on the cloud
   environment with the hosts it applies to; the proxy attaches it *after* the request leaves the VM.
   The session never sees the value, and the host becomes reachable. Note that any tool which checks
   for an env var (`hyperframes tts`, the `media-use` engine) will believe there is no key — call the
   API with plain `curl` on this route.
3. **A git-ignored `.env`** for a local session, the pattern `video/library/.env` already uses.

Never paste a key into a chat, a commit, a PR body or a prompt handed to another session. A key
pasted into a conversation is in that conversation's transcript for good.

## 2. Connectors on the account — verified live, 15 Sep 2026

| Connector | What it gives a content session |
|---|---|
| **ElevenLabs** | `creative_generate_speech` (voiceover), `creative_list_voices`, `creative_design_voice`, `creative_transcribe_audio`, plus image and video generation. **Authenticated and working in a cloud session with no API key and no allowlist change.** |
| **Higgsfield** | `sandbox_exec` — a sandbox with open internet, where every B1 render happens; `media_upload` / `media_confirm` for delivering an MP4; `generate_video` / `generate_image` / `generate_audio` for the presenter and stills |
| **Google Drive** | search, read, create files, move and rename; **cannot carry an MP4** — the connector takes text through the tool call, so exports go to Drive as a note with links. Layout since 16 Sep 2026: `05 - Video Edits (YouTube) › MERCHANT VIDEOS / PARTNER VIDEOS › MM-YYYY › kind (Explained / Behind the Counter / Motion graphics) › video › 01–04` (the READ ME there; `video/PLAYBOOK.md` §6) |
| **Gmail, Google Calendar, Notion** | inbox, scheduling, workspace docs |
| **Facebook Ads** | the full ads API. `CLAUDE.md` puts paid campaigns in a separate session — **do not build campaigns from a content session**; ad *copy* is fine |
| **Anthropic Economic Index** | public usage data; not used by this repo |

### The ElevenLabs route, concretely

Voices are chosen from `creative_list_voices`, never from memory. British-accent options confirmed on
the account include `JBFqnCBsd6RMkjVDRZzb` (George, warm narrator), `onwK4e9ZLuTAKqWW03F9` (Daniel,
broadcast), `Xb7hH8MSUJpSbSDYk0k2` (Alice, educator), `VDYfIKeHJwXUpUQhs8FR` (Tom, calm advertising)
and `c3QefzBhE1Cx4Yl23IV3` (natural young female, advertising). **Pick one, write it down here, and
keep it for the series** — a narrator that changes between episodes sounds like two products.

Each generation lands on a *flow*, an editable canvas, and returns a URL; you poll
`creative_get_flow_run_status` until it completes. Getting the file into the repo: output hosted on
`storage.googleapis.com` **is** downloadable from a cloud session (tested, 200), but
`api.us.elevenlabs.io` is not (403 at CONNECT), so a result that lands there needs the allowlist, a
local session, or the Higgsfield sandbox. Commit the audio and its `words.json` with the build.

Before relying on it for a delivery, check **which ElevenLabs account the connector is signed in to** —
that account carries the usage and the commercial-use licence.

## 3. Skills — already committed, nothing to install

Seventeen HyperFrames skills are committed under `.claude/skills/`, so any session that clones this
repo has them without a network fetch:

```
hyperframes (entry point)  hyperframes-core  hyperframes-animation  hyperframes-keyframes
hyperframes-creative  hyperframes-cli  hyperframes-audio  hyperframes-registry  media-use
general-video  motion-graphics  faceless-explainer  product-launch-video  slideshow
embedded-captions  talking-head-recut  remotion-to-hyperframes
```

Plus **`/brag`** (latent-spaces/brag, MIT, installed 16 Sep 2026): a 15–25 s launch video of the current
project — plan → brief → HyperFrames composition → render, with Kenney CC0 SFX bundled. The ende.app music
tracks are deliberately not committed (licence unverified); `.claude/skills/brag/NEROPAY-NOTE.md` has the
detail. Output lives in `video/brag-output/`; the first run is the warehouse's own brag, rendered locally in
45 s because a pure-graphics composition needs no clip extraction.

**`/linkedin-post`** (added 17 Sep 2026): the LinkedIn writing and audit rules distilled from two MIT skills
(sergebulaev/linkedin-skills, marian-kamenistak/linkedin-post-writing-skill) and re-cut to NeroPay's rails —
"we" never "I", no earnings register, figures with conditions. Read it before any LinkedIn copy.

**`/slopmonster`** (added 17 Sep 2026, Faisal's ask): [ItsssssJack/SlopMonster](https://github.com/ItsssssJack/SlopMonster)
(MIT, Jack Roberts), copied whole into `.claude/skills/slopmonster/`. `tools/deslop.py` scores any copy out of 5 for AI
tells (vocabulary, `not just X but Y` shapes, punctuation cadence, rule-of-three rhythm, invented proof) with stdlib
Python only and exits non-zero below 5, so it can gate a build; `tools/cleanse.sh` hands a draft to a rival model
family through the `codex` or `claude` CLI, or prints the prompt when neither is installed (neither is, in the web
container). Trigger: `/slopmonster`, "does this sound like AI", "de-slop this". Run
`python3 .claude/skills/slopmonster/tools/deslop.py --allow-proof --text "…"` on every caption and every script before
it goes to Faisal — `--allow-proof` because our figures are real and sourced (post L1 lost a point on install only for
"98 food businesses"); the NC01 v2 take scored 5/5. NeroPay's rails and `/linkedin-post` still decide what posts — the
scorer knows nothing about s.21 FSMA; `.claude/skills/slopmonster/NEROPAY-NOTE.md` has the four things to know. Both of
its test suites pass here. Refresh by re-cloning the upstream repo.

Start every video request at `/hyperframes` — it routes to the owning workflow. `/media-use` sources
and generates media; `/hyperframes-audio` mixes audio already placed in a composition. Refresh with
`npx hyperframes skills update <name>`; `HYPERFRAMES_SKIP_SKILLS=1` is set so the CLI leaves the
committed copies alone.

**Caveman** (added 16 Sep 2026, Faisal's ask — to save tokens): four skills from
[JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) v2.7.0, copied from its MIT-licensed
`skills/` folder (licence file kept in `.claude/skills/caveman/`):

```
caveman  caveman-help  caveman-commit  caveman-review
```

`/caveman` (or "be brief", "less tokens") puts the session's replies into terse mode — articles, filler
and hedging go, code, commands, figures and error strings stay exact — until "stop caveman";
`/caveman lite|full|ultra` sets the level and `/caveman-help` is the card. `/caveman-commit` and
`/caveman-review` are the terse commit-message and code-review forms. Two things to know: the mode
compresses *chat replies only* — anything persisted (copy in `posts.js`, scripts, docs, commit bodies,
anything a merchant or a reviewer reads) stays in normal prose, and the rails in `/CLAUDE.md` and
`rails.html` are never to be "compressed". The rest of the upstream set was left out on purpose:
`caveman-compress` rewrites memory files such as `CLAUDE.md` into caveman-speak (our rails must stay
exact and readable), `caveman-stats` and `cavecrew` need the Claude Code hooks and subagent presets of
the global installer, and `caveman-setup`/`-discover`/`-learn`/`-manage`/`-optimize`/`-evidence-review`
drive the Caveman Cloud gateway, which we do not use. Refresh by re-copying from the upstream `skills/`
folder; nothing here is fetched at session start.

**Design, browser and 3D skills (added 19 Sep 2026, Faisal's ask):** `/impeccable` (pbakaus/impeccable 4.3.1, Apache
2.0) for a design critique, audit or polish of the warehouse pages and the `social/` templates, hooks deliberately not
installed; `taste-skill`, `redesign-skill`, `soft-skill` and `minimalist-skill` from leonxlnx/taste-skill (MIT) for the
same surfaces; `playwright-skill` (willmarple, MIT) driving `@playwright/cli`, which the session-start hook now installs,
for the page checks in `CLAUDE.md`; `img2threejs` (Apache 2.0) for a procedural Three.js model of the terminal from a
photograph. `SOCIAL-BRIEF.md` and `MOTION-SYSTEM.md` outrank all of them on the look; each folder's `NEROPAY-NOTE.md`
says where. The two "awesome" lists Faisal sent the same day are catalogues, recorded in `video/TOOLS.md`, not installed.

**Added 23 Sep 2026 (Faisal's ask):** `ui-ux-pro-max` (nextlevelbuilder/ui-ux-pro-max-skill 2.13.0, MIT), a local
search over UX rules, styles, palettes and font pairings (`scripts/search.py`, Python, no network). Use its UX rules
and pre-delivery checklist; ignore its `--design-system` generator, which proposes its own palette and fonts and
does not know `BRAND.md`. And `playwright-scripts` (lackeyjb/playwright-skill 5.0.0, MIT, renamed from
`playwright-skill` so it does not collide with the one above): it writes a full Playwright script and runs it through
`run.js`, which suits a multi-page check (every page at 390 and 1440, console errors, overflow, screenshots) better
than the CLI. Run it headless against the pre-installed Chromium:
`PW_HEADLESS=true PW_EXECUTABLE_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome node .claude/skills/playwright-scripts/run.js <script>`.
The session-start hook installs its `playwright` package. `/impeccable` and `taste-skill` were checked against
upstream the same day and are current.

**`/prompt-master`** (added 21 Sep 2026, v1.8.0, MIT, upstream nidhinjs/prompt-master) writes one
finished, tool-routed prompt from a rough idea: Higgsfield video and image, ElevenLabs voice, an agentic
brief for another session, or a decompile of a prompt that keeps missing. It fires only when you ask for a
prompt. The rails and `BRAND.md` outrank whatever it writes; `.claude/skills/prompt-master/NEROPAY-NOTE.md`
has the detail.

## 4. The toolchain

| Piece | Version / location | Notes |
|---|---|---|
| Node | 22.22.2 | HyperFrames needs 22+ |
| HyperFrames | 0.8.31, pinned in `video/package.json` scripts | `npx hyperframes check` before every render |
| GSAP | 3.14.2, **vendored** at `video/vendor/gsap.min.js` | never from a CDN — a CDN script renders black |
| Remotion | `edit/` — bundler, cli, renderer, media-parser, media-utils, react | the fixed series edit only; don't rebuild it in HyperFrames |
| Poppins | `@fontsource/poppins` in `edit/` | brand typeface; local file, never Google Fonts |
| ffmpeg / ffprobe | system build, paths exported by the session-start hook | Remotion's bundled ffmpeg is built `--disable-filters` and fails HyperFrames frame extraction (LESSONS #57) |
| Chrome | HyperFrames' headless shell, or the pre-installed Playwright one | fetched by the hook |
| Pillow | 12.3, in the image | `from PIL import Image` — crops, resizes, contact sheets, alpha masks |
| OpenCV | `opencv-python-headless` 5.0 (with numpy), pip-installed by the hook | `import cv2` — frame analysis, face/feature detection for auto-reframing, perspective and optical flow. Headless build: no `imshow` |

`.claude/hooks/session-start.sh` installs all of this — **but it exits immediately in a local
session** (`CLAUDE_CODE_REMOTE != true`), so a local machine needs Node 22, a real ffmpeg,
`npm install` in `video/` and `npx hyperframes browser ensure` done by hand once.

### Hooks — the one rule, learnt the hard way (21 Sep 2026)

**Never register a `UserPromptSubmit` hook, and never register any hook before its script is committed
and executable.** A session installing a skill wrote a `UserPromptSubmit` hook pointing at
`.claude/skills/planning-with-files/hooks/claude-hook.sh` while that file did not exist. A prompt hook
that exits non-zero blocks the prompt, so every message Faisal typed came back as *"A hook blocked your
prompt"* — and because the block is on the prompt itself, that session could not be told to undo it. It
had to be repaired from a second session.

The skill was never installed — there was never a `SKILL.md`, only the hook path — and the folder is gone
from the repo at Faisal's instruction (21 Sep 2026). The defence is one file:

`.claude/hooks/prune-dead-hooks.py` runs as **step 0 of the session-start hook, before the local-session
exit**, and removes any hook whose script is missing from `.claude/settings.json`,
`.claude/settings.local.json` and the same two under `~/.claude/`. It copies each file to
`*.before-prune.json` before it writes and never touches a hook whose script exists, or anything outside
`hooks`. A settings file it cannot parse is skipped. Because the folder is deleted, a container still
carrying that registration now has it stripped at session start rather than papered over.

A session whose container cannot reach this file — an old checkout, or a branch that predates it — cannot
be repaired from inside, because the block is on the prompt. Start a fresh session instead.

If a skill's installer offers to add a hook: decline `UserPromptSubmit` outright, and for any other event
commit the script first, `chmod +x` it, then register it, then open a fresh session and check that a prompt
still goes through before pushing.

## 5. Resources already in the repo

- **The brand kit.** `brand/` — Eray's 19 Sep 2026 identity: the lowercase `neropay` wordmark in four
  versions, the diagonal-N symbol as favicons, and the social and SEO artwork. `BRAND.md` is the
  authority on values and on what the kit is missing (no vector, no font, no Instagram or YouTube sizes).

- **Sound.** Nineteen effects committed at `video/library/sfx/` (Pixabay licence, commercial use, no
  attribution), a Freesound CC0 set declared in `video/library/sounds.json` and fetched by
  `fetch-sounds.mjs`, and `video/library/LEDGER.md` — the licence record every sound must appear in
  before it ships. Full guidance in `video/AUDIO.md`.
- **The reference build.** `video/b1-v8/` is the B1 master: liquid-glass overlays, the clamped virtual
  camera, per-word captions, the beat grid, the `sfx()` helper, and `sandbox.sh` — the render pipeline
  end to end, including the loudness pass and the peak gate. Copy its patterns. `video/b1-v7/` was
  rejected; keep it for the hold report, not the look.
- **The content source of truth.** `generation-pack.md` (six video scripts, every figure reconciling to
  £308.46, the competitor register dated 18 Aug 2026), `posts.js`, `calls.js`, `ideas.js`,
  `overlays.js`, `scripts-tr.js` (Turkish, with `SCRIPTS_TR.guide`).
- **Third-party libraries** Faisal has saved, each with a verdict and a licence: `video/TOOLS.md`.

## 6. What the network reaches

A cloud session's outbound traffic is limited by the environment's **Network access** level, which is
**Trusted** by default: package registries, GitHub and cloud SDKs only. Measured 15 Sep 2026 —
`api.elevenlabs.io`, `api.heygen.com`, `huggingface.co`, `freesound.org`, `pixabay.com` and the
Higgsfield CDN all refuse at CONNECT; `storage.googleapis.com` answers. Connector traffic and GitHub
bypass the allowlist entirely. The full table and the four ways round it are in `video/AUDIO.md` §2.

Practically: **build and check here, render in the Higgsfield sandbox, or work locally.** Real clips
and new sounds cannot be fetched into a cloud container.

## 7. The rails, in one line each

The full text is in `CLAUDE.md` and `rails.html`, and it governs every session that writes a word or
a frame. No credit or lending language (s.21 FSMA). No earnings claims. Nothing commercial from a
personal profile; Faisal is never named. AI presenters and synthetic voices are disclosed at upload,
per upload. Competitor figures carry their date. No merchant named without consent. No real data. No
guaranteed savings — concede a case in every educational piece. Organic is written to ad standards.
No negotiated rates, margins or commercial terms. No terminal price and no transaction rate, spoken
or on screen. "We", never "I". No emoji, no hashtag piles.

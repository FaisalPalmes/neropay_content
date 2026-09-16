# The stack — what a NeroPay content session has to work with

Written 15 Sep 2026 so a new Claude Code session can be brought up to speed in one file. Point a
session at this and it knows what tools exist, what is already licensed and committed, what it can
reach from where, and what it must not do. Everything here was verified in a live session on the
date shown, not recalled.

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

`.claude/hooks/session-start.sh` installs all of this — **but it exits immediately in a local
session** (`CLAUDE_CODE_REMOTE != true`), so a local machine needs Node 22, a real ffmpeg,
`npm install` in `video/` and `npx hyperframes browser ensure` done by hand once.

## 5. Resources already in the repo

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

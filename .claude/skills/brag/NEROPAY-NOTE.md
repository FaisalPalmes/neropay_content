# /brag in this repo — what is different from upstream

Installed 16 Sep 2026 from https://github.com/latent-spaces/brag (MIT, v0.2.2) into `.claude/skills/brag/`
so every session has it. Two changes from the upstream copy:

1. **The five ende.app music tracks are not committed.** Upstream's own `assets/music/README.md` says the
   licence is unverified and must be documented before the skill is redistributed; this repo is public and
   the NeroPay ledger rule (`video/library/LEDGER.md`) is that no sound ships without a licence that covers
   commercial use. The cue presets in `assets/music/cues/` are kept for the beat grids. For a bed, use a
   track from `video/library/sounds.json` (Freesound CC0, fetched by `fetch-sounds.mjs`) or one generated
   under a licence we hold, and add the ledger line.
2. **Output goes to `video/brag-output/`**, not a `brag-output/` at the repo root — the root stays flat.

The Kenney SFX (`assets/sfx/`, CC0) and the keyboard set (opengameart, CC0) are committed as upstream ships
them. Everything in `video/AUDIO.md` still applies: the mix levels, the −14 LUFS master, the peak gate, and
rail 4 if `--voice` is ever used.

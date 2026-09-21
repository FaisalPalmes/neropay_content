# planning-with-files — not installed; this folder is a shim

There is no skill here. On 21 September 2026 a session registered a `UserPromptSubmit` hook pointing at
`hooks/claude-hook.sh` in this folder before any of it existed. A prompt hook whose script is missing exits
non-zero, and a non-zero `UserPromptSubmit` hook **blocks the prompt** — so every message Faisal typed in that
session came back as *"A hook blocked your prompt"*, and the session could not be told to undo it. It had to be
fixed from a second session.

Two things came out of it, and both are the actual fix:

1. `hooks/claude-hook.sh` exits 0 and does nothing. Any container still carrying the old registration now runs a
   file that succeeds. Keep it until nothing anywhere points here.
2. `.claude/hooks/prune-dead-hooks.py` runs at every session start and removes any hook whose script is not on
   disk, from `.claude/settings.json`, `.claude/settings.local.json` and the same two under `~/.claude/`. It
   copies the file to `*.before-prune.json` before changing it and leaves every working hook alone.

**The rule for any session here: never register a hook before its script is committed and executable, and never
register a `UserPromptSubmit` hook at all.** A `SessionStart` hook that fails prints a warning; a prompt hook that
fails takes the session away from Faisal. If a skill's installer wants to add one, decline it and say so.

If the real planning-with-files skill is ever wanted, install it properly — SKILL.md and its scripts committed
first, the hook registered last, and only after a test session accepts a prompt.

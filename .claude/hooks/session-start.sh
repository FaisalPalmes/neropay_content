#!/bin/bash
# Session start for Claude Code on the web: makes the two video toolchains runnable.
#   edit/   Remotion editor (bundled ffmpeg, Playwright's headless Chromium)
#   video/  HyperFrames (needs node 22, ffmpeg on PATH, its own Chrome Headless Shell)
# Idempotent: every step is a no-op when already done. Local sessions skip it.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

ROOT="${CLAUDE_PROJECT_DIR:-$(cd "$(dirname "$0")/../.." && pwd)}"
cd "$ROOT"

# 1. node modules for both editors (npm install is cached by the container snapshot)
( cd edit && npm install --no-audit --no-fund --loglevel=error )
( cd video && npm install --no-audit --no-fund --loglevel=error )

# 2. ffmpeg / ffprobe. HyperFrames' frame extraction needs a full build (the fps filter, the image2 muxer);
#    Remotion's bundled ffmpeg is built with --disable-filters and fails every extraction in ~100 ms, so a local
#    render dies with "VIDEO_SOURCE_UNRENDERABLE; ffmpeg_failed" (LESSONS #57). Prefer the distro build, install
#    it if the network allows, and fall back to Remotion's only for `hyperframes doctor` and ffprobe work.
FF="$ROOT/edit/node_modules/@remotion/compositor-linux-x64-gnu"
if [ ! -x /usr/bin/ffmpeg ] && command -v apt-get >/dev/null 2>&1; then
  ( apt-get update -q && DEBIAN_FRONTEND=noninteractive apt-get install -y -q ffmpeg ) >/tmp/ffmpeg-apt.log 2>&1 || true
fi
if [ -x /usr/bin/ffmpeg ]; then
  echo 'export HYPERFRAMES_FFMPEG_PATH="/usr/bin/ffmpeg"' >> "$CLAUDE_ENV_FILE"
  echo 'export HYPERFRAMES_FFPROBE_PATH="/usr/bin/ffprobe"' >> "$CLAUDE_ENV_FILE"
elif [ -x "$FF/ffmpeg" ]; then
  command -v ffmpeg >/dev/null 2>&1 || { ln -sf "$FF/ffmpeg" /usr/local/bin/ffmpeg 2>/dev/null || true; ln -sf "$FF/ffprobe" /usr/local/bin/ffprobe 2>/dev/null || true; }
  echo "export HYPERFRAMES_FFMPEG_PATH=\"$FF/ffmpeg\"" >> "$CLAUDE_ENV_FILE"
  echo "export HYPERFRAMES_FFPROBE_PATH=\"$FF/ffprobe\"" >> "$CLAUDE_ENV_FILE"
  echo "session-start: only Remotion's stripped ffmpeg is available — local HyperFrames renders will fail at frame extraction; render in the sandbox"
fi

# 3. a browser HyperFrames can render with: its own headless shell if it can be fetched,
#    else the Playwright one that is pre-installed in the remote image
SHELL_PW=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell
if ! ( cd video && npx hyperframes browser ensure >/dev/null 2>&1 ); then
  if [ -x "$SHELL_PW" ]; then
    echo "export HYPERFRAMES_BROWSER_PATH=\"$SHELL_PW\"" >> "$CLAUDE_ENV_FILE"
  fi
fi

# 3b. playwright-cli for .claude/skills/playwright-skill (bin/open etc. call it bare). Its default is Google
#     Chrome, which this image does not have, and Chromium's sandbox fails as root, so point it at the
#     pre-installed Playwright Chromium with --no-sandbox through the launch config it reads from the cwd.
#     The config is environment-specific and git-ignored; file: URLs are refused by design, so the page
#     checks run against `python3 -m http.server`.
command -v playwright-cli >/dev/null 2>&1 || npm install -g @playwright/cli --no-audit --no-fund --loglevel=error >/dev/null 2>&1 || true
PW_CHROME=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
if [ -x "$PW_CHROME" ] && [ ! -f .playwright/cli.config.json ]; then
  mkdir -p .playwright
  printf '{ "browser": { "launchOptions": { "executablePath": "%s", "args": ["--no-sandbox", "--disable-dev-shm-usage"] } } }\n' "$PW_CHROME" > .playwright/cli.config.json
fi

# 4. keep HyperFrames quiet about skills: they are committed under .claude/skills
echo 'export HYPERFRAMES_SKIP_SKILLS=1' >> "$CLAUDE_ENV_FILE"

# 5. standing notices — the one thing every session on this repo must see before it writes anything.
#    Edit .claude/NOTICES.md to change what is printed; the hook never needs touching again.
if [ -f .claude/NOTICES.md ]; then
  echo ""
  echo "NeroPay — standing notices (.claude/NOTICES.md):"
  grep -E '^[0-9]{4}-[0-9]{2}-[0-9]{2} ' .claude/NOTICES.md | head -5 | sed 's/^/  • /'
fi

# 6. a stale checkout is the way a session quietly works on the old brand. Say so, loudly, and do not
#    pull on its behalf: a session may be mid-edit and a surprise merge is worse than a warning.
if git rev-parse --git-dir >/dev/null 2>&1; then
  git fetch -q origin main 2>/dev/null || true
  BEHIND=$(git rev-list --count HEAD..origin/main 2>/dev/null || echo 0)
  if [ "${BEHIND:-0}" -gt 0 ]; then
    echo ""
    echo "  !! This checkout is ${BEHIND} commit(s) behind origin/main. Run: git pull origin main"
    echo "     Another session has pushed. Work here may be built on stale briefs or brand values."
  fi
fi
echo ""

( cd video && npx hyperframes doctor --json | node -e '
  let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
    const d = JSON.parse(s);
    const bad = d.checks.filter((c) => !c.ok && ["Chrome", "FFmpeg", "FFprobe", "Node.js"].includes(c.name));
    console.log(bad.length ? "hyperframes doctor: " + bad.map((c) => c.name + " — " + c.detail).join("; ") : "hyperframes doctor: render toolchain ok");
  });' )

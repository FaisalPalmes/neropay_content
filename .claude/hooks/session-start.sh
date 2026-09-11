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

# 4. keep HyperFrames quiet about skills: they are committed under .claude/skills
echo 'export HYPERFRAMES_SKIP_SKILLS=1' >> "$CLAUDE_ENV_FILE"

( cd video && npx hyperframes doctor --json | node -e '
  let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
    const d = JSON.parse(s);
    const bad = d.checks.filter((c) => !c.ok && ["Chrome", "FFmpeg", "FFprobe", "Node.js"].includes(c.name));
    console.log(bad.length ? "hyperframes doctor: " + bad.map((c) => c.name + " — " + c.detail).join("; ") : "hyperframes doctor: render toolchain ok");
  });' )

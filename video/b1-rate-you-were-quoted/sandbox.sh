#!/bin/bash
# Rebuild the B1 edit from a clean Higgsfield sandbox and render it.
# Run it through sandbox_exec with background:true (a plain nohup loses the sandbox after ~10 s):
#   bash sandbox.sh > /home/user/hf/boot.log 2>&1
# Reads data/sources.json for the clip → CDN mapping. Needs curl, ffmpeg, node 20+, git, npm.
set -euo pipefail
ROOT=${ROOT:-/home/user/hf}
REPO=https://github.com/faisalpalmes/neropay_content
PROJECT=video/b1-rate-you-were-quoted
mkdir -p "$ROOT"/clips "$ROOT"/proxies
cd "$ROOT"
[ -d repo ] || git clone -q --depth 1 "$REPO" repo
( cd repo && git checkout -q -- . && git pull -q )
SRC="$ROOT/repo/$PROJECT/data/sources.json"
BASE=$(node -e 'console.log(require(process.argv[1]).base)' "$SRC")
node -e 'const s=require(process.argv[1]);for(const [k,v] of Object.entries(s.clips))console.log(k,v)' "$SRC" > "$ROOT"/map.txt
# 1. clips (source 4K) — in parallel, ten at a time
while read -r id name; do
  [ -s "clips/$id.mp4" ] || curl -sf -o "clips/$id.mp4" "$BASE/$name.mp4" &
  while [ "$(jobs -r | wc -l)" -ge 10 ]; do sleep 1; done
done < "$ROOT"/map.txt
wait
echo "clips: $(ls clips/*.mp4 | wc -l)"
# 2. node 22 + hyperframes
[ -x "$ROOT"/n22/bin/node ] || npm i --silent node@22 -g --prefix "$ROOT"/n22
export PATH="$ROOT"/n22/bin:$PATH
( cd repo/video && npm install --silent --no-audit --no-fund )
# 3. 1080p proxies (4K sources crash the Chrome capture — LESSONS.md #16)
ls clips/*.mp4 | xargs -P 4 -I{} sh -c 'b=$(basename {}); [ -s proxies/$b ] || ffmpeg -y -v error -i {} -vf scale=1920:1080:flags=lanczos -r 24 -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart proxies/$b'
mkdir -p "repo/$PROJECT/assets/clips" && cp proxies/*.mp4 "repo/$PROJECT/assets/clips/"
# 4. build, check, render, loudness
cd "repo/$PROJECT"
export HYPERFRAMES_SKIP_SKILLS=1
HF="$ROOT/repo/video/node_modules/.bin/hyperframes"
node ../library/fetch-sounds.mjs --into assets/sfx        # needs FREESOUND_TOKEN in the environment
node cut.mjs | tail -3                                      # real cuts from the proxies, with faded audio joins
node build.mjs | tail -3
"$HF" check --json > "$ROOT"/check.json 2>/dev/null || true
node -e 'const j=require(process.argv[1]);console.log("CHECK ok="+j.ok,"runtime err="+j.runtime.errorCount,"contrast warn="+j.contrast.warningCount)' "$ROOT"/check.json
mkdir -p renders
"$HF" render -q "${QUALITY:-high}" -o renders/b1-high.mp4 --quiet
ffmpeg -y -v error -i renders/b1-high.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -c:v copy -c:a aac -b:a 192k renders/b1-final.mp4
ffprobe -v error -show_entries format=duration,size -of csv=p=0 renders/b1-final.mp4
echo BOOT_DONE

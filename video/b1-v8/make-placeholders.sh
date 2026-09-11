#!/bin/bash
# Local stand-ins for the takes, cut to the real lengths in data/takes.json, so `node cut.mjs && node build.mjs`
# here sees the same durations the sandbox will. Source: v6's grey placeholder clips (any short mp4 will do).
set -euo pipefail
cd "$(dirname "$0")"
SRC=../b1-rate-you-were-quoted/assets/clips
mkdir -p assets/clips
node -e 'const t=require("./data/takes.json");for(const [k,v] of Object.entries(t))if(!k.startsWith("_"))console.log(k,v)' | while read -r id len; do
  rm -f "assets/clips/$id.mp4"
  ffmpeg -nostdin -y -v error -stream_loop 3 -i "$SRC/$id.mp4" -t "$len" -c:v libx264 -preset ultrafast -crf 30 -c:a aac -b:a 64k "assets/clips/$id.mp4" < /dev/null
done
echo "placeholders: $(ls assets/clips/*.mp4 | wc -l)"

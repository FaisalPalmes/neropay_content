#!/bin/bash
# Rebuild the B1 v7 master from a clean Higgsfield sandbox and render it.
# Run it through sandbox_exec with background:true (a foreground call loses the sandbox ~10 s after it returns):
#   FREESOUND_TOKEN=... bash sandbox.sh > /home/user/hf/boot.log 2>&1
# Reads data/sources.json for the clip → CDN mapping (the same files as Drive "01 Clips in", byte for byte)
# and data/angles.json for the crop per shot. Needs curl, ffmpeg, node 20+, git, npm.
set -euo pipefail
ROOT=${ROOT:-/home/user/hf}
REPO=https://github.com/faisalpalmes/neropay_content
PROJECT=video/b1-v7
mkdir -p "$ROOT"/clips "$ROOT"/proxies
cd "$ROOT"
BRANCH=${BRANCH:-main}
[ -d repo ] || git clone -q --depth 1 -b "$BRANCH" "$REPO" repo
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
# 3. one 1080p proxy per clip, cut to its angle straight from the 4K source (MOTION-SYSTEM.md §1).
#    Measured on a real frame: Ava's face at (1950, 900) of 3840×2160, head top 600, shoulders 1410.
#    FRONT  the whole frame                     SIDE  1.5× window from the left edge → Ava in the right third
#    CLOSE  1.7× window on her face             the 2 variants are the same angle a little looser
crop_for() {
  case "$1" in
    FRONT)  echo 'scale=1920:1080:flags=lanczos' ;;
    FRONT2) echo 'crop=3491:1964:177:81,scale=1920:1080:flags=lanczos' ;;
    SIDE)   echo 'crop=2560:1440:0:420,scale=1920:1080:flags=lanczos' ;;
    SIDE2)  echo 'crop=2704:1521:0:398,scale=1920:1080:flags=lanczos' ;;
    CLOSE)  echo 'crop=2259:1271:820:392,scale=1920:1080:flags=lanczos' ;;
    CLOSE2) echo 'crop=2430:1367:735:353,scale=1920:1080:flags=lanczos' ;;
    *) echo "unknown angle $1" >&2; exit 1 ;;
  esac
}
node -e 'const a=require(process.argv[1]);for(const [k,v] of Object.entries(a))if(!k.startsWith("_"))console.log(k,v)' "$ROOT/repo/$PROJECT/data/angles.json" > "$ROOT"/angles.txt
while read -r id angle; do
  vf=$(crop_for "$angle")
  # -nostdin: a backgrounded ffmpeg inside a while-read loop otherwise eats the loop's stdin as keystrokes
  [ -s "proxies/$id.mp4" ] || ffmpeg -nostdin -y -v error -i "clips/$id.mp4" -vf "$vf" -r 24 -c:v libx264 -preset fast -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "proxies/$id.mp4" < /dev/null &
  while [ "$(jobs -r | wc -l)" -ge 4 ]; do sleep 1; done
done < "$ROOT"/angles.txt
wait
echo "proxies: $(ls proxies/*.mp4 | wc -l)"
mkdir -p "repo/$PROJECT/assets/clips" && rm -f "repo/$PROJECT/assets/clips/"*.mp4 "repo/$PROJECT/assets/cut/"*.mp4 && cp proxies/*.mp4 "repo/$PROJECT/assets/clips/"
# 4. sounds, cut, build, check, render, loudness
cd "repo/$PROJECT"
export HYPERFRAMES_SKIP_SKILLS=1
HF="$ROOT/repo/video/node_modules/.bin/hyperframes"
node ../library/fetch-sounds.mjs --into assets/sfx        # needs FREESOUND_TOKEN in the environment
node cut.mjs | tail -3                                      # real cuts from the proxies, with faded audio joins
node build.mjs | tail -14
"$HF" check --json > "$ROOT"/check.json 2>/dev/null || true
node -e 'const j=require(process.argv[1]);console.log("CHECK ok="+j.ok,"runtime err="+j.runtime.errorCount,"layout err="+j.layout.errorCount,"contrast warn="+j.contrast.warningCount)' "$ROOT"/check.json
mkdir -p renders review
"$HF" render -q "${QUALITY:-high}" -o renders/b1-v7-high.mp4 --quiet
ffmpeg -y -v error -i renders/b1-v7-high.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:v copy -c:a aac -b:a 192k renders/b1-v7-final.mp4
ffprobe -v error -show_entries stream=width,height:format=duration,size -of csv=p=0 renders/b1-v7-final.mp4
# 5. the review sheets (MOTION-SYSTEM.md §7): every overlay's last held frame at full size, and a frame every 6 s
AT=$(node -e 'const m=require("./review/manifest.json");console.log(m.contact_at.map(x=>Math.round(x*100)/100).join(","))')
mkdir -p review/held && for t in ${AT//,/ }; do ffmpeg -nostdin -y -v error -ss "$t" -i renders/b1-v7-final.mp4 -frames:v 1 "review/held/$(printf '%07.2f' "$t").png"; done
# (ffmpeg's tile filter, not ImageMagick's montage — montage aborts on twelve full-size PNGs in the sandbox)
N=$(ls review/held/*.png | wc -l); ROWS=$(( (N + 2) / 3 ))
ffmpeg -nostdin -y -v error -framerate 1 -pattern_type glob -i 'review/held/*.png' -vf "tile=3x${ROWS}:padding=8:color=0x141416" -frames:v 1 -q:v 2 review/overlays-contact.jpg
mkdir -p review/every6 && for t in $(seq 1 6 163); do ffmpeg -nostdin -y -v error -ss "$t" -i renders/b1-v7-final.mp4 -frames:v 1 "review/every6/$(printf '%03d' "$t").png"; done
N=$(ls review/every6/*.png | wc -l); ROWS=$(( (N + 5) / 6 ))
ffmpeg -nostdin -y -v error -framerate 1 -pattern_type glob -i 'review/every6/*.png' -vf "scale=480:270,tile=6x${ROWS}:padding=4:color=0x141416" -frames:v 1 -q:v 4 review/frames-contact.jpg
# 6. the frame scan (MOTION-SYSTEM.md §7, LESSONS #55): mean luma of every frame; a frame that differs from both
#    neighbours by more than 4 is a flash — a blank cut frame, a dropped overlay — and fails the gate
ffmpeg -nostdin -v error -i renders/b1-v7-final.mp4 -vf "scale=480:270,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=review/yavg.txt" -f null -
python3 - <<'PY' | tee review/spikes.txt
import re
ys=[float(m.group(1)) for l in open('review/yavg.txt') for m in [re.search(r'YAVG=([0-9.]+)',l)] if m]
sp=[(i,round(i/30,3),round(ys[i-1],1),round(ys[i],1),round(ys[i+1],1)) for i in range(1,len(ys)-1) if abs(ys[i]-ys[i-1])>4 and abs(ys[i]-ys[i+1])>4 and (ys[i]<min(ys[i-1],ys[i+1]) or ys[i]>max(ys[i-1],ys[i+1]))]
print('frames', len(ys), 'single-frame spikes', len(sp), sp)
PY
echo BOOT_DONE

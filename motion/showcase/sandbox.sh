#!/bin/bash
# Render the showcase from a clean Higgsfield sandbox: the only place that can reach Freesound for the bed.
# Run through sandbox_exec with background:true, UPLOAD_URL set to a media_upload presigned URL:
#   BRANCH=claude/funny-bohr-7yese4 UPLOAD_URL='https://…' bash sandbox.sh > /home/user/hf/boot.log 2>&1
set -euo pipefail
ROOT=${ROOT:-/home/user/hf}; REPO=https://github.com/faisalpalmes/neropay_content; PROJECT=motion/showcase
BRANCH=${BRANCH:-main}
mkdir -p "$ROOT" && cd "$ROOT"
[ -d repo ] || git clone -q --depth 1 -b "$BRANCH" "$REPO" repo
( cd repo && git checkout -q -- . && git pull -q )
# node 22 + the pinned CLI + playwright, installed in motion/ (motion/package.json)
[ -x "$ROOT"/n22/bin/node ] || npm i --silent node@22 -g --prefix "$ROOT"/n22
export PATH="$ROOT"/n22/bin:$PATH
( cd repo/motion && npm install --silent --no-audit --no-fund )
cd "repo/$PROJECT"
export HYPERFRAMES_SKIP_SKILLS=1
HF="$ROOT/repo/motion/node_modules/.bin/hyperframes"
# sounds: the Pixabay effects from the library, the Freesound bed fetched for real, then every file peak-checked (LESSONS #68)
mkdir -p assets/sfx
for s in impact-bass-1 impact-bass-2 whoosh-short sparkle chime click-soft riser; do cp ../../video/library/sfx/$s.mp3 assets/sfx/; done
node ../../video/library/fetch-sounds.mjs --into assets/sfx
for f in assets/sfx/*.m4a assets/sfx/*.mp3; do
  peak=$(ffmpeg -nostdin -i "$f" -af volumedetect -f null - 2>&1 | sed -n 's/.*max_volume: \([-0-9.]*\) dB.*/\1/p')
  awk -v v="${peak:--99}" 'BEGIN{exit !(v < -40)}' && { echo "SILENT SOUND $f (peak ${peak:-none} dB) — not rendering"; exit 1; }
done
echo "sounds ok: $(ls assets/sfx | wc -l) files, bed peak $(ffmpeg -nostdin -i assets/sfx/music-showcase.m4a -af volumedetect -f null - 2>&1 | sed -n 's/.*max_volume: \([-0-9.]*\) dB.*/\1/p') dB"
"$HF" check --json > "$ROOT"/check.json 2>/dev/null || true
node -e 'const j=require(process.argv[1]);console.log("CHECK ok="+j.ok,"runtime err="+j.runtime.errorCount,"layout err="+j.layout.errorCount)' "$ROOT"/check.json
mkdir -p renders review
"$HF" render . -q "${QUALITY:-high}" -o renders/showcase-high.mp4 --quiet
ffmpeg -y -v error -i renders/showcase-high.mp4 -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 48000 -c:v copy -c:a aac -b:a 192k renders/showcase-final.mp4
ffprobe -v error -show_entries stream=width,height:format=duration,size -of csv=p=0 renders/showcase-final.mp4
ffmpeg -y -v error -i renders/showcase-final.mp4 -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak" || true
# the frame scan (LESSONS #55): a single-frame luma spike is a flash
ffmpeg -nostdin -v error -i renders/showcase-final.mp4 -vf "scale=270:480,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=review/yavg.txt" -f null -
python3 - <<'PY' | tee review/spikes.txt
import re
ys=[float(m.group(1)) for l in open('review/yavg.txt') for m in [re.search(r'YAVG=([0-9.]+)',l)] if m]
sp=[(i,round(i/30,2)) for i in range(1,len(ys)-1) if abs(ys[i]-ys[i-1])>4 and abs(ys[i]-ys[i+1])>4 and (ys[i]<min(ys[i-1],ys[i+1]) or ys[i]>max(ys[i-1],ys[i+1]))]
print('frames', len(ys), 'single-frame spikes', len(sp), sp)
PY
{ echo "showcase $(git -C "$ROOT/repo" rev-parse --short HEAD) $(date -u +%FT%TZ)"; cat review/spikes.txt; md5sum renders/showcase-final.mp4;
  ffprobe -v error -show_entries stream=width,height:format=duration,size -of csv=p=0 renders/showcase-final.mp4; } | tee review/report.txt
[ -n "${UPLOAD_URL:-}" ] && curl -sf -X PUT --upload-file renders/showcase-final.mp4 "$UPLOAD_URL" -o /dev/null -w "upload HTTP %{http_code}\n"
echo DONE

#!/bin/bash
# Burn captions into 9:16, 4:5 and 1:1 (16:9 stays clean for YouTube), mux the loudnormed mix into
# every crop, contact sheet, loudness + single-frame spike report. Nothing published.
set -euo pipefail
cd "$(dirname "$0")"
EP=mg02; FONTS=../../assets/fonts-ttf
mkdir -p out/final
for r in 9x16 4x5 1x1 16x9; do
  src=out/$EP-$r.mp4; dst=out/final/$EP-$r.mp4
  if [ "$r" = 16x9 ]; then VF="null"; else VF="ass=data/captions-$r.ass:fontsdir=$FONTS"; fi
  ffmpeg -y -v error -i "$src" -i out/mix.m4a -vf "$VF" -map 0:v -map 1:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$dst"
  printf "%-8s %s\n" "$r" "$(ffprobe -v error -show_entries stream=width,height:format=duration -of csv=p=0 "$dst" | tr '\n' ' ')"
done
ffmpeg -i out/final/$EP-9x16.mp4 -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | grep -E '"input_i"|"input_tp"'
rm -f /tmp/claude-0/cs_*.png
for t in 0.3 2.6 4.5 8.6 12.0 14.5 20.6 24.0 27.6 30.8 38.0 52.0; do ffmpeg -nostdin -y -v error -ss $t -i out/final/$EP-9x16.mp4 -frames:v 1 /tmp/claude-0/cs_$(printf '%05.2f' $t).png; done
ffmpeg -y -v error -pattern_type glob -i '/tmp/claude-0/cs_*.png' -filter_complex "scale=320:-1,tile=4x3:padding=8:margin=8:color=0x1A1D22" -frames:v 1 out/final/contact.jpg
ffmpeg -nostdin -v error -i out/final/$EP-9x16.mp4 -vf "scale=270:480,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=/tmp/claude-0/yavg.txt" -f null -
python3 - <<'PY'
import re
ys=[float(m.group(1)) for l in open('/tmp/claude-0/yavg.txt') for m in [re.search(r'YAVG=([0-9.]+)',l)] if m]
sp=[(i,round(i/30,2)) for i in range(1,len(ys)-1) if abs(ys[i]-ys[i-1])>4 and abs(ys[i]-ys[i+1])>4 and (ys[i]<min(ys[i-1],ys[i+1]) or ys[i]>max(ys[i-1],ys[i+1]))]
print('frames',len(ys),'single-frame spikes',len(sp),sp)
PY
md5sum out/final/*.mp4

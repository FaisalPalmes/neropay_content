#!/bin/bash
# NC01: captions are drawn by the composition (16:9 renders without them); mux the loudnormed mix into every crop,
# contact sheet, loudness + single-frame spike report. Nothing published. The full ffmpeg is /usr/bin/ffmpeg — the one
# on PATH in the cloud container is Remotion's build with filters stripped (LESSONS #57).
set -euo pipefail
export PATH=/usr/bin:$PATH
cd "$(dirname "$0")"
EP=nc01
mkdir -p out/final
for r in ${@:-16x9 4x5 9x16 1x1}; do
  src=out/$EP-$r.mp4; dst=out/final/$EP-$r.mp4
  [ -f "$src" ] || { echo "$r not rendered yet"; continue; }
  ffmpeg -y -v error -i "$src" -i out/mix.m4a -map 0:v -map 1:a -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a copy -shortest -movflags +faststart "$dst"
  printf "%-8s %s\n" "$r" "$(ffprobe -v error -show_entries stream=width,height:format=duration -of csv=p=0 "$dst" | tr '\n' ' ')"
done
M=out/final/$EP-16x9.mp4; [ -f "$M" ] || M=out/final/$EP-4x5.mp4; [ -f "$M" ] || exit 0
ffmpeg -i "$M" -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | grep -E '"input_i"|"input_tp"'
T=/tmp/claude-0/nc01; mkdir -p $T; rm -f $T/cs_*.png
for t in 1 3.4 6.5 9.5 12 14.8 18 23 27 30 33 36 40 44 48 52 56 60 64 68 72 76 80 84; do ffmpeg -nostdin -y -v error -ss $t -i "$M" -frames:v 1 $T/cs_$(printf '%05.2f' $t).png; done
ffmpeg -y -v error -pattern_type glob -i "$T/cs_*.png" -filter_complex "scale=480:-1,tile=4x6:padding=8:margin=8:color=0x1A1D22" -frames:v 1 out/final/contact.jpg
ffmpeg -nostdin -v error -i "$M" -vf "scale=480:270,signalstats,metadata=print:key=lavfi.signalstats.YAVG:file=$T/yavg.txt" -f null -
python3 - <<PY
import re
ys=[float(m.group(1)) for l in open('$T/yavg.txt') for m in [re.search(r'YAVG=([0-9.]+)',l)] if m]
sp=[(i,round(i/30,2)) for i in range(1,len(ys)-1) if abs(ys[i]-ys[i-1])>4 and abs(ys[i]-ys[i+1])>4 and (ys[i]<min(ys[i-1],ys[i+1]) or ys[i]>max(ys[i-1],ys[i+1]))]
jumps=[(i,round(i/30,2),round(ys[i]-ys[i-1],1)) for i in range(1,len(ys)) if abs(ys[i]-ys[i-1])>12]
print('frames',len(ys),'single-frame spikes',len(sp),sp)
print('frame-to-frame jumps over 12 luma',len(jumps),jumps[:12])
PY
md5sum out/final/*.mp4

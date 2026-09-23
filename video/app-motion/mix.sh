#!/bin/bash
# Sound for the light app motion: the partner-upbeat-118 bed, a cue on every move, the sting's hit where its
# letters meet (14.334 + 0.92 = beat 30), mastered to -14 LUFS.
#   bash mix.sh renders/picture-30blur.mp4 renders/FINAL-app-motion.mp4
set -euo pipefail
cd "$(dirname "$0")"
IN=$1; OUT=$2; L=../library/sfx; TMP=$(mktemp -d)
B=$(python3 -c "print(60/118)"); BAR=$(python3 -c "print(240/118)")
t() { python3 -c "B=$B;BAR=$BAR;print(round(($1)*1000))"; }
CUES=(
  "whoosh-short $(t "0") 0.24"
  "key-press $(t "B*1") 0.18" "key-press $(t "B*1.5") 0.18" "key-press $(t "B*2") 0.18" "key-press $(t "B*2.5") 0.18" "click $(t "B*3") 0.20"
  "whoosh $(t "BAR-0.2") 0.26" "pop $(t "BAR+0.3") 0.14" "click-soft $(t "BAR+B") 0.10" "click-soft $(t "BAR+B*2") 0.09" "ping $(t "BAR+B*2.5") 0.10"
  "whoosh-short $(t "BAR*2-0.2") 0.26" "click-soft $(t "BAR*2+B*1.5") 0.14" "pop $(t "BAR*2+B*2") 0.15"
  "whoosh-cinematic $(t "BAR*3-0.2") 0.22" "pop $(t "BAR*3+B*2") 0.11"
  "whoosh $(t "BAR*4-0.25") 0.24" "sparkle $(t "BAR*4+0.3") 0.07" "pop $(t "BAR*4+B*2.5") 0.13" "pop $(t "BAR*4+B*3") 0.13"
  "whoosh $(t "BAR*5-0.2") 0.26" "typing $(t "BAR*5+0.35") 0.08" "click $(t "BAR*5+B*3") 0.18" "ping $(t "BAR*5+B*3.5") 0.10"
  "whoosh-short $(t "BAR*6-0.2") 0.26" "whoosh-short $(t "BAR*6") 0.16" "whoosh-short $(t "BAR*6+B") 0.14" "whoosh-short $(t "BAR*6+B*1.5") 0.14"
  "whoosh $(t "13.7") 0.18" "impact-bass-1 $(t "B*30") 0.22" "sparkle $(t "14.334+1.2") 0.10" "chime $(t "14.334+1.5") 0.08"
)
ARGS=(-i "$IN" -i ../library/bgm/partner-upbeat-118.mp3)
FC="[1:a]atrim=0:17.8,asetpts=N/SR/TB,volume=0.55,afade=t=out:st=15.6:d=2.2,aformat=cl=stereo[bed];"
MIX="[bed]"; i=2
for c in "${CUES[@]}"; do read -r f ms g <<< "$c"
  ARGS+=(-i "$L/$f.mp3"); FC+="[$i:a]volume=$g,adelay=$ms|$ms,aformat=cl=stereo[c$i];"; MIX+="[c$i]"; i=$((i+1)); done
FC+="${MIX}amix=inputs=$((i-1)):normalize=0:duration=first[mx];[mx]alimiter=limit=0.84:level=false,aformat=cl=stereo:r=48000[a]"
ffmpeg -y -loglevel error "${ARGS[@]}" -filter_complex "$FC" -map 0:v -map "[a]" -c:v copy -c:a pcm_s16le -shortest "$TMP/m.mov"
J=$(ffmpeg -y -i "$TMP/m.mov" -vn -af "loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
read I TP LRA TH OFF <<< "$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
ffmpeg -y -loglevel error -i "$TMP/m.mov" -af "loudnorm=I=-14:TP=-2.0:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aformat=cl=stereo:r=48000" \
  -c:v copy -c:a aac -b:a 192k -t 17.8 -movflags +faststart "$OUT"
rm -rf "$TMP"
ffmpeg -i "$OUT" -vn -af "loudnorm=I=-14:TP=-1.5:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"

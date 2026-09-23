#!/bin/bash
# Sound for the app motion test: the partner-upbeat-118 bed and a cue on every move, mastered to -14 LUFS.
#   bash mix.sh renders/picture.mp4 renders/FINAL-app-motion-test.mp4
set -euo pipefail
cd "$(dirname "$0")"
IN=$1; OUT=$2; L=../library/sfx; TMP=$(mktemp -d)
B=$(python3 -c "print(60/118)")
t() { python3 -c "print(round(($1)*1000))"; }
CUES=(
  "whoosh-short $(t "0") 0.24"
  "key-press $(t "$B*1") 0.18" "key-press $(t "$B*1.5") 0.18" "key-press $(t "$B*2") 0.18" "key-press $(t "$B*2.5") 0.18"
  "click $(t "$B*3") 0.20"
  "whoosh $(t "$B*4-0.2") 0.26"
  "pop $(t "$B*4+0.3") 0.14" "click-soft $(t "$B*5") 0.10" "click-soft $(t "$B*6") 0.09" "ping $(t "$B*6.5") 0.10"
  "whoosh-cinematic $(t "$B*8-0.2") 0.22"
  "pop $(t "$B*10") 0.12"
  "whoosh-short $(t "$B*12-0.3") 0.26" "impact-bass-1 $(t "$B*12") 0.22" "chime $(t "$B*13.5") 0.12"
)
ARGS=(-i "$IN" -i ../library/bgm/partner-upbeat-118.mp3)
FC="[1:a]atrim=0:8.6,asetpts=N/SR/TB,volume=0.55,afade=t=out:st=7.9:d=0.7,aformat=cl=stereo[bed];"
MIX="[bed]"; i=2
for c in "${CUES[@]}"; do read -r f ms g <<< "$c"
  ARGS+=(-i "$L/$f.mp3"); FC+="[$i:a]volume=$g,adelay=$ms|$ms,aformat=cl=stereo[c$i];"; MIX+="[c$i]"; i=$((i+1)); done
FC+="${MIX}amix=inputs=$((i-1)):normalize=0:duration=first[mx];[mx]alimiter=limit=0.84:level=false,aformat=cl=stereo:r=48000[a]"
ffmpeg -y -loglevel error "${ARGS[@]}" -filter_complex "$FC" -map 0:v -map "[a]" -c:v copy -c:a pcm_s16le -shortest "$TMP/m.mov"
J=$(ffmpeg -y -i "$TMP/m.mov" -vn -af "loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
read I TP LRA TH OFF <<< "$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
ffmpeg -y -loglevel error -i "$TMP/m.mov" -af "loudnorm=I=-14:TP=-2.0:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aformat=cl=stereo:r=48000" \
  -c:v copy -c:a aac -b:a 192k -t 8.6 -movflags +faststart "$OUT"
rm -rf "$TMP"
ffmpeg -i "$OUT" -vn -af "loudnorm=I=-14:TP=-1.5:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"

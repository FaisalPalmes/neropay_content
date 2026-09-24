#!/bin/bash
# Sound for the Mobile Apps ad: the partner-upbeat-118 bed (as AM02), a soft cue on every touch, slide and reveal,
# the outro's hit where its letters meet (24.9 + 0.92), mastered to -14 LUFS under -1.5 dBTP.
#   bash mix.sh renders/picture-30blur.mp4 renders/FINAL-mobile-apps.mp4
set -euo pipefail
cd "$(dirname "$0")"
IN=$1; OUT=$2; L=../library/sfx; TMP=$(mktemp -d)
t() { python3 -c "print(round(($1)*1000))"; }
CUES=(
  "whoosh-short $(t 0) 0.20"
  "pop $(t 1.0) 0.09" "pop $(t 1.35) 0.09" "pop $(t 1.7) 0.09" "pop $(t 2.05) 0.09"
  "click-soft $(t 4.0) 0.14" "whoosh-short $(t 4.15) 0.13"
  "click-soft $(t 5.8) 0.14" "pop $(t 6.0) 0.10" "click-soft $(t 7.25) 0.14"
  "whoosh-short $(t 8.0) 0.13" "click-soft $(t 10.0) 0.14" "ping $(t 10.35) 0.10"
  "whoosh-short $(t 11.8) 0.13" "click-soft $(t 13.8) 0.14" "pop $(t 13.85) 0.10"
  "whoosh-short $(t 15.6) 0.13" "click-soft $(t 17.35) 0.14" "whoosh-short $(t 17.5) 0.09" "click $(t 18.6) 0.16" "chime $(t 18.75) 0.10"
  "whoosh $(t 20.2) 0.17" "whoosh-short $(t 20.55) 0.09" "whoosh-short $(t 20.69) 0.09" "whoosh-short $(t 20.83) 0.09" "sparkle $(t 22.25) 0.08"
  "whoosh $(t 24.1) 0.14" "impact-bass-1 $(t 24.9+0.92) 0.22" "sparkle $(t 24.9+1.2) 0.09"
  "whoosh-short $(t 24.9+1.85) 0.12" "pop $(t 24.9+2.0) 0.10" "chime $(t 24.9+2.2) 0.08"
)
ARGS=(-i "$IN" -i ../library/bgm/partner-upbeat-118.mp3)
FC="[1:a]atrim=0:29.9,asetpts=N/SR/TB,volume=0.55,afade=t=in:st=0:d=0.4,afade=t=out:st=27.5:d=2.4,aformat=cl=stereo[bed];"
MIX="[bed]"; i=2
for c in "${CUES[@]}"; do read -r f ms g <<< "$c"
  ARGS+=(-i "$L/$f.mp3"); FC+="[$i:a]volume=$g,adelay=$ms|$ms,aformat=cl=stereo[c$i];"; MIX+="[c$i]"; i=$((i+1)); done
FC+="${MIX}amix=inputs=$((i-1)):normalize=0:duration=first[mx];[mx]alimiter=limit=0.84:level=false,aformat=cl=stereo:r=48000[a]"
ffmpeg -y -loglevel error "${ARGS[@]}" -filter_complex "$FC" -map 0:v -map "[a]" -c:v copy -c:a pcm_s16le -shortest "$TMP/m.mov"
J=$(ffmpeg -y -i "$TMP/m.mov" -vn -af "loudnorm=I=-14:TP=-3.0:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
read I TP LRA TH OFF <<< "$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
ffmpeg -y -loglevel error -i "$TMP/m.mov" -af "loudnorm=I=-14:TP=-3.0:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aformat=cl=stereo:r=48000" \
  -c:v copy -c:a aac -b:a 192k -t 29.9 -movflags +faststart "$OUT"
rm -rf "$TMP"
ffmpeg -i "$OUT" -vn -af "loudnorm=I=-14:TP=-1.5:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"

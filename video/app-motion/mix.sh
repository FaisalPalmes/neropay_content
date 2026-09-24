#!/bin/bash
# Sound for the light app motion: the partner-upbeat-118 bed, a cue on every move, the sting's hit where its
# letters meet (26.54 + 0.92 = beat 54), mastered to -14 LUFS.
#   bash mix.sh renders/picture-30blur.mp4 renders/FINAL-app-motion.mp4
set -euo pipefail
cd "$(dirname "$0")"
IN=$1; OUT=$2; L=../library/sfx; TMP=$(mktemp -d)
B=$(python3 -c "print(60/118)"); BAR=$(python3 -c "print(240/118)")
t() { python3 -c "B=$B;BAR=$BAR;print(round(($1)*1000))"; }
CUES=(
  "whoosh-short $(t "0") 0.20"
  "key-press $(t "B*2") 0.18" "key-press $(t "B*2.5") 0.18" "key-press $(t "B*3") 0.18" "key-press $(t "B*3.5") 0.18" "click $(t "B*4.5") 0.20"
  "whoosh-short $(t "B*6.5") 0.13" "pop $(t "B*7.3") 0.13"
  "click-soft $(t "B*8.5") 0.06" "click-soft $(t "B*10.5") 0.05" "click-soft $(t "B*12.5") 0.05" "click-soft $(t "B*14.5") 0.04"
  "ping $(t "B*11.6") 0.10"
  "whoosh $(t "B*14.4") 0.24"
  "click-soft $(t "B*17.5") 0.14" "pop $(t "B*18") 0.13" "whoosh-short $(t "B*19.9") 0.07" "whoosh-short $(t "B*20.9") 0.13"
  "whoosh-cinematic $(t "B*22.2") 0.20" "pop $(t "B*25") 0.10" "whoosh $(t "B*27") 0.14"
  "whoosh-short $(t "B*30.6") 0.15" "sparkle $(t "B*31.6") 0.06" "pop $(t "B*34") 0.12" "pop $(t "B*35") 0.12" "whoosh-short $(t "B*37") 0.07"
  "whoosh-short $(t "B*37.9") 0.15" "typing $(t "B*39.2") 0.08" "click $(t "B*42.8") 0.18" "ping $(t "B*43.4") 0.10"
  "whoosh $(t "B*45.5") 0.15" "whoosh-short $(t "B*46") 0.11" "whoosh-short $(t "B*46.6") 0.11"
  "whoosh $(t "25.7") 0.16" "impact-bass-1 $(t "B*54") 0.22" "sparkle $(t "26.54+1.2") 0.09"
  "whoosh-short $(t "26.54+1.85") 0.12" "pop $(t "26.54+2.0") 0.10" "chime $(t "26.54+2.2") 0.08"
)
ARGS=(-i "$IN" -i ../library/bgm/partner-upbeat-118.mp3)
FC="[1:a]atrim=0:31.5,asetpts=N/SR/TB,volume=0.55,afade=t=out:st=29.0:d=2.5,aformat=cl=stereo[bed];"
MIX="[bed]"; i=2
for c in "${CUES[@]}"; do read -r f ms g <<< "$c"
  ARGS+=(-i "$L/$f.mp3"); FC+="[$i:a]volume=$g,adelay=$ms|$ms,aformat=cl=stereo[c$i];"; MIX+="[c$i]"; i=$((i+1)); done
FC+="${MIX}amix=inputs=$((i-1)):normalize=0:duration=first[mx];[mx]alimiter=limit=0.84:level=false,aformat=cl=stereo:r=48000[a]"
ffmpeg -y -loglevel error "${ARGS[@]}" -filter_complex "$FC" -map 0:v -map "[a]" -c:v copy -c:a pcm_s16le -shortest "$TMP/m.mov"
J=$(ffmpeg -y -i "$TMP/m.mov" -vn -af "loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
read I TP LRA TH OFF <<< "$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
ffmpeg -y -loglevel error -i "$TMP/m.mov" -af "loudnorm=I=-14:TP=-2.0:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aformat=cl=stereo:r=48000" \
  -c:v copy -c:a aac -b:a 192k -t 31.5 -movflags +faststart "$OUT"
rm -rf "$TMP"
ffmpeg -i "$OUT" -vn -af "loudnorm=I=-14:TP=-1.5:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"

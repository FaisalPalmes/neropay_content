#!/bin/bash
# Lays the sound under a rendered picture and masters it to the house target (-14 LUFS, true peak under -1.5 dBTP).
#   bash mix.sh renders/v6-picture.mp4 renders/FINAL-appstore-iphone-v6.mp4
# Cues follow the v6 timeline in index.html (SW = the swipes, LAND = when each slide lands). Every file is from the
# committed, ledgered library. v5's mix is kept at archive/mix-v5.sh.
set -euo pipefail
cd "$(dirname "$0")"
IN=$1; OUT=$2; L=../library/sfx; TMP=$(mktemp -d)
# file  seconds  gain
CUES=(
  "whoosh-short 0.00 0.26"                                        # the Shutter up
  "pop 0.75 0.10"                                                 # the amount comes up on the hero screen
  "click-soft 1.35 0.10" "click-soft 2.30 0.08" "click-soft 3.25 0.07"   # the contactless signal, three times
  "whoosh 4.20 0.20" "whoosh-short 8.45 0.22" "whoosh 12.70 0.20" "whoosh-short 16.95 0.22" "whoosh 21.20 0.20"  # the swipes
  "key-press 5.75 0.16" "key-press 6.05 0.16" "key-press 6.35 0.16" "key-press 6.65 0.16"  # 4, 5, 7, 5
  "click 7.15 0.16"                                               # CHARGE
  "pop 7.50 0.14"                                                 # the amount lifts
  "click-soft 10.25 0.14" "pop 10.65 0.14"                        # the tap on the dish, the card lifts
  "pop 14.70 0.14"                                                # the NeroWeb row lifts
  "pop 18.85 0.13" "pop 19.30 0.10"                               # the total, the tooltip
  "click-soft 23.10 0.14" "pop 23.55 0.13"                        # Send, the amount field lifts
  "whoosh 24.95 0.22" "impact-bass-1 25.74 0.18" "whoosh-short 25.78 0.20" "pop 26.72 0.16" "chime 26.95 0.12"  # the swish and the close
)
ARGS=(-i "$IN" -i ../library/bgm/underscore-120-a.mp3)
FC="[1:a]atrim=0:29,asetpts=N/SR/TB,volume=0.30,afade=t=in:st=0:d=0.5,afade=t=out:st=27.3:d=1.7,aformat=cl=stereo[bed];"
MIX="[bed]"; i=2
for c in "${CUES[@]}"; do
  read -r f t g <<< "$c"; ms=$(python3 -c "print(round($t*1000))")
  ARGS+=(-i "$L/$f.mp3"); FC+="[$i:a]volume=$g,adelay=$ms|$ms,aformat=cl=stereo[c$i];"; MIX+="[c$i]"; i=$((i+1))
done
N=$((i-1))
FC+="${MIX}amix=inputs=$N:normalize=0:duration=first[mx];[mx]alimiter=limit=0.84:level=false,aformat=cl=stereo:r=48000[a]"
ffmpeg -y -loglevel error "${ARGS[@]}" -filter_complex "$FC" -map 0:v -map "[a]" -c:v copy -c:a pcm_s16le -shortest "$TMP/mixed.mov"
J=$(ffmpeg -y -i "$TMP/mixed.mov" -vn -af "loudnorm=I=-14:TP=-2.0:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
read I TP LRA TH OFF <<< "$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
ffmpeg -y -loglevel error -i "$TMP/mixed.mov" \
 -af "loudnorm=I=-14:TP=-2.0:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aformat=cl=stereo:r=48000" \
 -c:v copy -c:a aac -b:a 192k -t 29 -movflags +faststart "$OUT"
rm -rf "$TMP"
ffmpeg -i "$OUT" -vn -af "loudnorm=I=-14:TP=-1.5:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"

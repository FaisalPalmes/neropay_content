#!/bin/bash
# Lays the sound under a rendered picture and masters it to the house target (-14 LUFS / -1.5 dBTP).
#   bash mix.sh renders/v2-picture.mp4 renders/FINAL-appstore-iphone-v2.mp4
# Cues follow the v2 timeline in index.html. Every file is from the committed, ledgered library.
# One effect per movement, never the same one twice running, and no glitch-* (crackle by construction).
set -euo pipefail
cd "$(dirname "$0")"
IN=$1; OUT=$2; L=../library; TMP=$(mktemp -d)
ffmpeg -y -loglevel error -i "$IN" \
 -i $L/bgm/underscore-120-a.mp3 \
 -i $L/sfx/whoosh-short.mp3 -i $L/sfx/whoosh.mp3 -i $L/sfx/click-soft.mp3 \
 -i $L/sfx/impact-bass-1.mp3 -i $L/sfx/pop.mp3 -i $L/sfx/chime.mp3 \
 -filter_complex "\
[1:a]atrim=0:29,asetpts=N/SR/TB,volume=0.30,afade=t=in:st=0:d=0.5,afade=t=out:st=27.3:d=1.7,aformat=cl=stereo[bed];\
[2:a]volume=0.26,adelay=0|0[u0];\
[3:a]volume=0.20,adelay=4600|4600[f1];\
[2:a]volume=0.22,adelay=9700|9700[f2];\
[3:a]volume=0.20,adelay=14800|14800[f3];\
[2:a]volume=0.22,adelay=19900|19900[f4];\
[4:a]volume=0.12,adelay=900|900[l0];\
[4:a]volume=0.12,adelay=5700|5700[l1];\
[4:a]volume=0.12,adelay=10800|10800[l2];\
[4:a]volume=0.12,adelay=15900|15900[l3];\
[4:a]volume=0.12,adelay=21000|21000[l4];\
[3:a]volume=0.22,adelay=24600|24600[sd];\
[5:a]volume=0.22,adelay=25580|25580[imp];\
[2:a]volume=0.20,adelay=26150|26150[op];\
[6:a]volume=0.16,adelay=26620|26620[pp];\
[7:a]volume=0.12,adelay=26900|26900[ch];\
[bed][u0][f1][f2][f3][f4][l0][l1][l2][l3][l4][sd][imp][op][pp][ch]amix=inputs=16:normalize=0:duration=first[mx];\
[mx]alimiter=limit=0.89:level=false,aformat=cl=stereo:r=48000[a]" \
 -map 0:v -map "[a]" -c:v copy -c:a pcm_s16le -shortest "$TMP/mixed.mov"
J=$(ffmpeg -y -i "$TMP/mixed.mov" -vn -af "loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
read I TP LRA TH OFF <<< "$(echo "$J" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")"
ffmpeg -y -loglevel error -i "$TMP/mixed.mov" \
 -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$I:measured_TP=$TP:measured_LRA=$LRA:measured_thresh=$TH:offset=$OFF:linear=true,aformat=cl=stereo:r=48000" \
 -c:v copy -c:a aac -b:a 192k -t 29 -movflags +faststart "$OUT"
rm -rf "$TMP"
ffmpeg -i "$OUT" -vn -af "loudnorm=I=-14:TP=-1.5:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"

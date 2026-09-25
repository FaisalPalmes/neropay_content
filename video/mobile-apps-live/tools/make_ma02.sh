#!/usr/bin/env bash
# MA02 live-action pilot, end to end: fingers -> app screens -> screen composite -> glass cards -> sound -> clips + reel.
# bash make_ma02.sh <workdir>
# <workdir> holds the three Kling plates (street.mp4, table.mp4, mia.mp4) and their tracks (street-t4.json and
# table-t4.json from track_screen.py, mia-cam.json from camera_track.py). Everything it makes lands there.
set -euo pipefail
W=$(cd "$1" && pwd); T=$(cd "$(dirname "$0")" && pwd); S=$T/../screens; L=$T/../../library
cd "$W"

python3 "$T/fingers.py" .
rm -rf scr-sage scr-nail fr-street fr-table fr-mia ov-street ov-table ov-mia sp-street sp-table sp-mia
node "$S/render-screens.cjs" sage fingers-sage.json scr-sage
node "$S/render-screens.cjs" nail fingers-nail.json scr-nail
python3 "$T/comp_screen.py" street.mp4 street-t4.json scr-sage street-comp.mp4 --start 24 --tint 1.0,0.99,0.97 --radius 36 --png fr-street &
python3 "$T/comp_screen.py" table.mp4 table-t4.json scr-nail table-comp.mp4 --tint 0.9,0.96,1.0 --dim 0.95 --glare 0.35 --radius 37 --png fr-table &
mkdir -p fr-mia && ffmpeg -v error -y -i mia.mp4 -start_number 0 fr-mia/%04d.png &
wait
python3 "$T/build_overlay.py" .
for k in street table mia; do
  node "$S/render-sprites.cjs" spec-$k.json sp-$k
  python3 "$T/glass_comp.py" spec-$k.json sp-$k ov-$k &
done
wait

# sound: the bed plus a cue on every press and every card, timed from fingers-*.json (cut seconds)
python3 - "$L" <<'PY'
import json, os, subprocess, sys
L = sys.argv[1]; fs, fn = json.load(open('fingers-sage.json')), json.load(open('fingers-nail.json'))
up = fs['press'][1] - 1
cues = {'street': [('click-soft', fs['press'][0] - 1, -8), ('pop', up + 0.06, -10), ('chime', up + 0.5, -14)],
        'table': [('click-soft', fn['press1'][0], -8), ('whoosh-short', fn['press1'][1] + 0.02, -22), ('pop', fn['press1'][1] + 0.2, -11),
                  ('click-soft', fn['press3'][0], -8), ('chime', fn['press3'][1] + 0.26, -12)],
        'mia': [('pop', 0.37, -11), ('pop', 1.07, -11), ('pop', 2.02, -11), ('chime', 3.47, -10)]}
bedoff = {'street': 0, 'table': 4.1, 'mia': 8.2}
for k, cs in cues.items():
    n = len(os.listdir(f'ov-{k}')); dur = n / 24
    ins = ['-framerate', '24', '-i', f'ov-{k}/%04d.png', '-ss', str(bedoff[k]), '-t', str(dur), '-i', f'{L}/bgm/partner-upbeat-118.mp3']
    fl = [f'[1:a]volume=-16dB,afade=t=in:d=0.3,afade=t=out:st={dur - 0.5}:d=0.5[bed]']; mx = ['[bed]']
    for i, (s, t, db) in enumerate(cs):
        ins += ['-i', f'{L}/sfx/{s}.mp3']; ms = int(round(t * 1000))
        fl.append(f'[{i + 2}:a]volume={db}dB,adelay={ms}|{ms}[s{i}]'); mx.append(f'[s{i}]')
    fl.append(''.join(mx) + f'amix=inputs={len(mx)}:normalize=0:duration=first[a]')
    subprocess.run(['ffmpeg', '-v', 'error', '-y'] + ins + ['-filter_complex', ';'.join(fl), '-map', '0:v', '-map', '[a]',
                    '-c:v', 'libx264', '-crf', '14', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-c:a', 'pcm_s16le', '-ar', '48000',
                    '-shortest', f'raw-{k}.mov'], check=True)
    print(k, 'cues', [(s, round(t, 2)) for s, t, _ in cs])
PY
ffmpeg -v error -y -i raw-street.mov -i raw-table.mov -i raw-mia.mov -filter_complex \
  "[0:v][1:v]xfade=transition=fade:duration=0.35:offset=3.69[v1];[v1][2:v]xfade=transition=fade:duration=0.35:offset=8.38,format=yuv420p[v];[0:a][1:a]acrossfade=d=0.35[a1];[a1][2:a]acrossfade=d=0.35[a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 15 -preset slow -c:a pcm_s16le raw-reel.mov

# loudness: a gain found by measuring (three rounds), then a limiter at -6 dBFS (AAC overshoots it by up to 3 dB) so the true peak stays under -3.
# loudnorm alone lands short whenever the peaks stop its linear gain, so the gain is solved against the limited result.
meas() { ffmpeg -hide_banner -i "$1" -af ebur128=peak=true -f null - 2>&1 | awk '/^ +I:/{i=$2} /^ +Peak:/{p=$2} END{print i, p}'; }
for k in street table mia reel; do
  G=0
  for round in 1 2 3 4; do
    ffmpeg -v error -y -i raw-$k.mov -c:v copy -af "volume=${G}dB,aresample=192000,alimiter=limit=0.5:level=false:attack=1:release=60,aresample=48000" \
      -c:a aac -b:a 192k -movflags +faststart MA02-$k-v4.mp4
    read -r I P <<< "$(meas MA02-$k-v4.mp4)"
    G=$(python3 -c "print(round($G + (-14 - $I), 2))")
  done
  echo "MA02-$k-v4.mp4 I $I LUFS, peak $P dBFS"
done

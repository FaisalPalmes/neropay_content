#!/bin/bash
# Renders the App Store cuts: iPhone 886 x 1920 and iPad 1200 x 1600, at 120 fps blended to 30, mixed, then cut to
# 30.0s because Apple refuses app previews longer than 30 seconds (the outro's subtext has settled by 29.1s).
# The Google Play promo is the 1080 x 1920 master from render.sh.
#   bash make-assets.sh && bash render-stores.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p renders
HF="npx --yes hyperframes@0.8.31"
node make-formats.mjs
trap 'rm -f iphone.html ipad.html' EXIT
$HF render --fps 120 -c iphone.html -o renders/iphone-120.mp4 &
$HF render --fps 120 -c ipad.html -o renders/ipad-120.mp4 &
wait
for f in iphone ipad; do
  ffmpeg -y -loglevel error -i renders/$f-120.mp4 -vf "tmix=frames=4:weights='1 1 1 1',fps=30" -c:v libx264 -crf 15 -pix_fmt yuv420p renders/$f-30blur.mp4
  bash mix.sh renders/$f-30blur.mp4 renders/$f-mixed.mp4
  ffmpeg -y -loglevel error -i renders/$f-mixed.mp4 -t 30 -c:v copy -af "afade=t=out:st=29.2:d=0.8" -c:a aac -b:a 192k -movflags +faststart renders/FINAL-app-motion-$f.mp4
  ffmpeg -i renders/FINAL-app-motion-$f.mp4 -vn -af "loudnorm=I=-14:TP=-1.5:print_format=summary" -f null - 2>&1 | grep -E "Input Integrated|Input True Peak"
done

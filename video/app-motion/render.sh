#!/bin/bash
# Renders the light app motion in both background variants at 120 fps, blends four frames into one for the motion
# blur, and mixes each. index.html is the textured (reeded) glass; glass.html, the clear-pane variant, is generated
# from it for the render and removed after, because two root compositions fail `hyperframes check`.
#   bash make-assets.sh && bash render.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p renders
HF="npx --yes hyperframes@0.8.31"
sed 's#<script src="vendor/gsap.min.js"></script>#<script>window.BG = "pane"</script><script src="vendor/gsap.min.js"></script>#' index.html > glass.html
trap 'rm -f glass.html' EXIT
$HF render --fps 120 -o renders/reeded-120.mp4 &
$HF render --fps 120 -c glass.html -o renders/glass-120.mp4 &
wait
for v in reeded glass; do
  ffmpeg -y -loglevel error -i renders/$v-120.mp4 -vf "tmix=frames=4:weights='1 1 1 1',fps=30" -c:v libx264 -crf 15 -pix_fmt yuv420p renders/$v-30blur.mp4
  bash mix.sh renders/$v-30blur.mp4 renders/FINAL-app-motion-$v.mp4
done

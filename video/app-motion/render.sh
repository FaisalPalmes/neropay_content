#!/bin/bash
# Renders the light app motion (clear-glass look, the default) at 120 fps, blends four frames into one for the motion
# blur, and mixes it. The textured-glass look is still in index.html behind window.BG = "reeded".
#   bash make-assets.sh && bash render.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p renders
npx --yes hyperframes@0.8.31 render --fps 120 -o renders/picture-120.mp4
ffmpeg -y -loglevel error -i renders/picture-120.mp4 -vf "tmix=frames=4:weights='1 1 1 1',fps=30" -c:v libx264 -crf 15 -pix_fmt yuv420p renders/picture-30blur.mp4
bash mix.sh renders/picture-30blur.mp4 renders/FINAL-app-motion.mp4

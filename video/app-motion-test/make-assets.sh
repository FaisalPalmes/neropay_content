#!/bin/bash
# Copies in the files the repo keeps once and ignores per project: GSAP, Poppins and the white wordmark.
#   bash make-assets.sh && npx hyperframes render --fps 120 -o renders/picture-120.mp4
#   ffmpeg -i renders/picture-120.mp4 -vf "tmix=frames=4:weights='1 1 1 1',fps=30" -c:v libx264 -crf 15 renders/picture-30blur.mp4
#   bash mix.sh renders/picture-30blur.mp4 renders/FINAL-app-motion-test.mp4
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p vendor fonts assets
cp ../vendor/gsap.min.js vendor/
cp ../../motion/node_modules/@fontsource/poppins/files/poppins-latin-{400,500,600,700}-normal.woff2 fonts/
cp ../../brand/logos/neropay-white-640.png assets/wordmark-white.png

#!/bin/bash
# Copies in the files the repo keeps once and ignores per project: GSAP, Poppins, the five app screens (committed
# in app-motion-test) and the yellow logo sting (brand/sting) with its last frame for the hold.
#   bash make-assets.sh && bash render.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p vendor fonts assets
cp ../vendor/gsap.min.js vendor/
cp ../../motion/node_modules/@fontsource/poppins/files/poppins-latin-{400,500,600,700}-normal.woff2 fonts/
cp ../app-motion-test/assets/app{1,2,3,4,5}.png assets/
cp ../../brand/sting/neropay-sting-yellow-9x16.mp4 assets/sting-yellow-9x16.mp4
ffmpeg -y -loglevel error -sseof -0.04 -i assets/sting-yellow-9x16.mp4 -frames:v 1 -update 1 assets/sting-yellow-9x16-last.png

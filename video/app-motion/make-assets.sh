#!/bin/bash
# Copies in the files the repo keeps once and ignores per project: GSAP, Poppins, the five app screens (committed
# in app-motion-test) and the locked yellow outro (brand/sting) with this video's subtext.
#   bash make-assets.sh && bash render.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p vendor fonts assets
cp ../vendor/gsap.min.js vendor/
cp ../../motion/node_modules/@fontsource/poppins/files/poppins-latin-{400,500,600,700}-normal.woff2 fonts/
cp ../app-motion-test/assets/app{1,2,3,4,5}.png assets/
# the locked outro (brand/sting/outro.html), yellow, with this video's subtext
(cd ../.. && SMALL="" BIG="neropay.app" node brand/sting/render.cjs outro yellow 9x16 video/app-motion/assets/outro-yellow-9x16-neropay-app.mp4)

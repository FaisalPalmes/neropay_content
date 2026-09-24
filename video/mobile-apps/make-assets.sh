#!/bin/bash
# Copies in the files the repo keeps once and ignores per project: GSAP and Poppins, and renders the locked outro
# (brand/sting/outro.html, yellow) with this video's subtext. The merchant fonts (Inter, Fraunces, Bebas Neue,
# Archivo, DM Serif Display, all OFL, from @fontsource via the Cowork handover) are committed in merchant-fonts/.
#   bash make-assets.sh && bash render.sh
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p vendor fonts assets
cp ../vendor/gsap.min.js vendor/
cp ../../motion/node_modules/@fontsource/poppins/files/poppins-latin-{400,500,600,700}-normal.woff2 fonts/
(cd ../.. && SMALL="Available on Android & iOS" BIG="neropay.app" node brand/sting/render.cjs outro yellow 9x16 video/mobile-apps/assets/outro-android-ios.mp4)

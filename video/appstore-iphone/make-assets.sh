#!/bin/bash
# Rebuilds every derived asset this composition needs. Only assets/screens/*.webp — Faisal's five
# exported App Store carousel frames — and the repo's brand/ kit are inputs; everything else is made here.
#   bash make-assets.sh
set -euo pipefail
cd "$(dirname "$0")"
ROOT=../..

# 1. the three bands. Each screen is one 923×2000 export; it is cut where the artwork already divides:
#    the wordmark, the copy block (kicker, headline, sub, chips), and the device. Cutting rather than
#    re-typesetting is the point — Faisal's type is placed art and must not be re-set (BRAND.md §5).
mkdir -p assets/bands
for i in 1 2 3 4 5; do
  ffmpeg -y -loglevel error -i assets/screens/s$i.webp -vf "crop=923:180:0:0"    assets/bands/head$i.png
  ffmpeg -y -loglevel error -i assets/screens/s$i.webp -vf "crop=923:485:0:170"  assets/bands/body$i.png
  ffmpeg -y -loglevel error -i assets/screens/s$i.webp -vf "crop=923:1345:0:655" assets/bands/dev$i.png
done

# 2. the mark on transparency, keyed out of the app icon, for the glass tile on the close
ffmpeg -y -loglevel error -i $ROOT/brand/favicon/neropay-icon-512.png \
  -vf "colorkey=0xFFCF24:0.34:0.06,colorkey=0xFFD426:0.30:0.05,format=rgba,scale=1024:1024:flags=lanczos" \
  -frames:v 1 assets/mark.png

# 3. the wordmark for a dark ground — placed artwork, never typeset, never recoloured
cp $ROOT/brand/logos/neropay-dark-1200.png assets/wordmark-white.png

# 4. fonts and the GSAP build, vendored: this container reaches no CDN
mkdir -p fonts vendor
cp $ROOT/motion/assets/fonts/poppins-latin-{500,600,700}-normal.woff2 fonts/
cp ../vendor/gsap.min.js vendor/gsap.min.js
echo "assets rebuilt"

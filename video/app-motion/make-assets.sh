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
# the grain for the textured glass, made once: static noise, laid on in soft-light
ffmpeg -y -loglevel error -f lavfi -i "color=c=gray:s=540x960,noise=alls=60:allf=u,format=gray" -frames:v 1 assets/grain.png
# the locked outro (brand/sting/outro.html), yellow, with this video's subtext
(cd ../.. && SMALL="" BIG="neropay.app" node brand/sting/render.cjs outro yellow 9x16 video/app-motion/assets/outro-yellow-9x16-neropay-app.mp4)
# the outro for each App Store frame: fitted whole over a patch of its own ground scaled up to the frame, so every
# pixel around it is the video's own colour and no box shows (an edge smear shifted the chroma by a couple of levels)
O=assets/outro-yellow-9x16-neropay-app.mp4
ffmpeg -y -loglevel error -i $O -filter_complex "[0]split[a][b];[a]crop=64:64:8:8,scale=886:1920[bg];[b]scale=886:1576[fg];[bg][fg]overlay=0:172,format=yuv420p" -c:v libx264 -crf 12 -an assets/outro-neropay-app-iphone.mp4
ffmpeg -y -loglevel error -i $O -filter_complex "[0]split[a][b];[a]crop=64:64:8:8,scale=1200:1600[bg];[b]scale=900:1600[fg];[bg][fg]overlay=150:0,format=yuv420p" -c:v libx264 -crf 12 -an assets/outro-neropay-app-ipad.mp4

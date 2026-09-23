#!/bin/bash
# Renders and masters the preview for every store: iPhone (886x1920), iPad (1200x1600), Google Play (1080x1920).
#   bash render-all.sh
# ipad.html and play.html are generated from index.html for the render and removed after it: two root compositions
# in the project at once fail `hyperframes check` (multiple_root_compositions), so they never stay on disk.
set -euo pipefail
cd "$(dirname "$0")"
HF="npx --yes hyperframes@0.8.31"
node stills/render.cjs layers
$HF render --fps 30 -o renders/iphone-picture.mp4
node make-formats.mjs
trap 'rm -f ipad.html play.html' EXIT
$HF render --fps 30 -c ipad.html -o renders/ipad-picture.mp4
$HF render --fps 30 -c play.html -o renders/play-picture.mp4
rm -f ipad.html play.html
for f in iphone ipad play; do bash mix.sh renders/$f-picture.mp4 renders/FINAL-$f.mp4; done

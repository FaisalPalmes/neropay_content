#!/bin/sh
# Assemble a page: _build.sh <name> "<title>" "<desc>"  — reads <name>.body.html
set -e
n=$1; t=$2; d=$3
{
  sed -e "s|__TITLE__|$t|" -e "s|__DESC__|$d|" -e "s|__C_$n| aria-current=\"page\"|" -e 's|__C_[a-z]*||g' _head.tpl
  cat "$n.body.html"
  cat _foot.tpl
} > "$n.html"
echo "built $n.html"

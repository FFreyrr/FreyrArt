#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p assets/videos

download_video() {
  local file="$1"
  local out="assets/videos/$file"
  local primary="https://ffreyrr.github.io/portfolio-video/videos/$file"
  local fallback="https://raw.githubusercontent.com/FFreyrr/portfolio-video/main/videos/$file"

  if [ -s "$out" ]; then
    echo "Already downloaded: $out"
    return
  fi

  echo "Downloading: $file"
  curl -L --fail --retry 3 --connect-timeout 20 --max-time 900 "$primary" -o "$out" \
    || curl -L --fail --retry 3 --connect-timeout 20 --max-time 900 "$fallback" -o "$out"
}

download_video "the-last-look.mp4"
download_video "The_Bottle_青少年心理疾病成因_—_FreyrArt.mp4"
download_video "hoo.mp4"
download_video "在地共生_Local_Symbiosis_—_FreyrArt.mp4"
download_video "追觅_DreameRing_—_FreyrArt.mp4"
download_video "dreame-ring.mp4"
download_video "endgame.mp4"
download_video "star-trace.mp4"

echo "Done."
du -sh assets/videos

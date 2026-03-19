#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -ne 6 ]; then
  echo "Usage: $0 <input> <output-dir> <frame-width> <frame-height> <cols> <rows>"
  exit 1
fi

input="$1"
output_dir="$2"
frame_width="$3"
frame_height="$4"
cols="$5"
rows="$6"

mkdir -p "$output_dir"

for row in $(seq 0 $((rows - 1))); do
  for col in $(seq 0 $((cols - 1))); do
    offset_y=$((row * frame_height))
    offset_x=$((col * frame_width))
    frame_index=$((row * cols + col + 1))
    output_file=$(printf "%s/frame-%03d.png" "$output_dir" "$frame_index")

    sips -c "$frame_height" "$frame_width" \
      --cropOffset "$offset_y" "$offset_x" \
      "$input" \
      --out "$output_file" >/dev/null
  done
done

echo "Generated $((cols * rows)) frames in $output_dir"

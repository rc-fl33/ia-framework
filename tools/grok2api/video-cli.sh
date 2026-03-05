#!/bin/bash
###############################################################################
# Grok Video Generation - v2 API CLI
#
# Two-step workflow using grok2api v2:
#   1. Generate base image via /v1/images/generations
#   2. Animate image into video via /v1/chat/completions with video_config
#
# Usage:
#   ./video-cli.sh "landscape prompt" "animation description"
#   ./video-cli.sh --aspect-ratio 9:16 --duration 6 "prompt" "animation"
#   ./video-cli.sh --nsfw --preset fun "prompt" "animation"
#
# Flags:
#   --aspect-ratio  16:9|9:16|1:1|2:3|3:2  (default: 16:9)
#   --duration      6|10|15                 (default: 10)
#   --resolution    480p|720p               (default: 720p)
#   --preset        fun|normal|spicy|custom (default: normal)
#   --nsfw          Route output to nsfw directory
###############################################################################

set -e

# Check if Docker container is running
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if ! "${SCRIPT_DIR}/check-docker.sh" --silent; then
    echo ""
    echo "grok2api Docker container is not running"
    echo ""
    echo "Run this command to see details:"
    echo "  ${SCRIPT_DIR}/check-docker.sh"
    exit 1
fi

# Defaults
ASPECT_RATIO="16:9"
DURATION=10
RESOLUTION="720p"
PRESET="normal"
NSFW=false

# Parse flags
while [[ $# -gt 0 ]]; do
    case "$1" in
        --aspect-ratio)
            ASPECT_RATIO="$2"
            shift 2
            ;;
        --duration)
            DURATION="$2"
            shift 2
            ;;
        --resolution)
            RESOLUTION="$2"
            shift 2
            ;;
        --preset)
            PRESET="$2"
            shift 2
            ;;
        --nsfw)
            NSFW=true
            shift
            ;;
        -*)
            echo "Unknown flag: $1"
            exit 1
            ;;
        *)
            break
            ;;
    esac
done

if [ $# -lt 2 ]; then
    echo "Usage: $0 [flags] \"image prompt\" \"animation prompt\""
    echo ""
    echo "Flags:"
    echo "  --aspect-ratio  16:9|9:16|1:1|2:3|3:2  (default: 16:9)"
    echo "  --duration      6|10|15                 (default: 10)"
    echo "  --resolution    480p|720p               (default: 720p)"
    echo "  --preset        fun|normal|spicy|custom (default: normal)"
    echo "  --nsfw          Route output to nsfw directory"
    echo ""
    echo "Examples:"
    echo "  $0 \"A cyberpunk city at night\" \"camera flying through neon streets\""
    echo "  $0 --duration 15 --preset fun \"Mountain landscape\" \"clouds moving\""
    echo ""
    echo "Two-step process:"
    echo "  1. Generate base image from first prompt"
    echo "  2. Animate image into video using second prompt + video_config"
    exit 1
fi

IMAGE_PROMPT="$1"
VIDEO_PROMPT="$2"

# Set output directory based on nsfw flag
if [ "$NSFW" = true ]; then
    OUTPUT_DIR="$HOME/grok-output/videos/nsfw"
else
    OUTPUT_DIR="$HOME/grok-output/videos/sfw"
fi
mkdir -p "$OUTPUT_DIR"

# Map aspect ratio to image size for step 1
case "$ASPECT_RATIO" in
    "16:9") IMAGE_SIZE="1280x720" ;;
    "9:16") IMAGE_SIZE="720x1280" ;;
    "1:1")  IMAGE_SIZE="1024x1024" ;;
    "2:3")  IMAGE_SIZE="1024x1792" ;;
    "3:2")  IMAGE_SIZE="1792x1024" ;;
    *)      IMAGE_SIZE="1280x720" ;;
esac

API_BASE="http://localhost:8000"

echo "================================================================"
echo "  Grok Image-to-Video Generation (v2)"
echo "================================================================"
echo ""
echo "  Aspect Ratio: $ASPECT_RATIO"
echo "  Duration:     ${DURATION}s"
echo "  Resolution:   $RESOLUTION"
echo "  Preset:       $PRESET"
echo "  Output:       $OUTPUT_DIR"
echo ""

# Step 1: Generate base image via /v1/images/generations
echo "[1/3] Generating base image..."
echo "Prompt: \"$IMAGE_PROMPT\""
echo ""

IMAGE_RESPONSE=$(curl -s -X POST "${API_BASE}/v1/images/generations" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"grok-imagine-1.0\",
    \"prompt\": \"$IMAGE_PROMPT\",
    \"n\": 1,
    \"size\": \"$IMAGE_SIZE\"
  }" --max-time 120)

# Check for errors
ERROR=$(echo "$IMAGE_RESPONSE" | jq -r '.error.message // empty' 2>/dev/null)
if [ -n "$ERROR" ]; then
    echo "API Error (image generation): $ERROR"
    exit 1
fi

# Extract image URL from structured response
IMAGE_URL=$(echo "$IMAGE_RESPONSE" | jq -r '.data[0].url // empty' 2>/dev/null)

if [ -z "$IMAGE_URL" ]; then
    echo "Error: Failed to generate image"
    echo "Response: $IMAGE_RESPONSE"
    exit 1
fi

echo "Image generated: $IMAGE_URL"
echo ""

# Step 2: Generate video via /v1/chat/completions with video_config
echo "[2/3] Animating image into video..."
echo "Animation: \"$VIDEO_PROMPT\""
echo ""

VIDEO_RESPONSE=$(curl -s -X POST "${API_BASE}/v1/chat/completions" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"grok-imagine-1.0-video\",
    \"messages\": [{
      \"role\": \"user\",
      \"content\": [
        {\"type\": \"text\", \"text\": \"$VIDEO_PROMPT\"},
        {\"type\": \"image_url\", \"image_url\": {\"url\": \"$IMAGE_URL\"}}
      ]
    }],
    \"video_config\": {
      \"aspect_ratio\": \"$ASPECT_RATIO\",
      \"video_length\": $DURATION,
      \"resolution_name\": \"$RESOLUTION\",
      \"preset\": \"$PRESET\"
    },
    \"stream\": false
  }" --max-time 300)

# Check for errors
ERROR=$(echo "$VIDEO_RESPONSE" | jq -r '.error.message // empty' 2>/dev/null)
if [ -n "$ERROR" ]; then
    echo "API Error (video generation): $ERROR"
    exit 1
fi

# Extract video URL from structured response
VIDEO_URL=$(echo "$VIDEO_RESPONSE" | jq -r '.data[0].url // empty' 2>/dev/null)

if [ -z "$VIDEO_URL" ]; then
    echo "Error: Failed to generate video"
    echo "Response: $VIDEO_RESPONSE"
    exit 1
fi

# Handle relative URLs
if [[ ! "$VIDEO_URL" =~ ^http ]]; then
    VIDEO_URL="${API_BASE}${VIDEO_URL}"
fi

echo "Video URL: $VIDEO_URL"
echo ""

# Step 3: Download video
echo "[3/3] Downloading video..."

TIMESTAMP=$(date +%Y%m%d-%H%M%S)
VIDEO_FILENAME="${OUTPUT_DIR}/grok-video-${TIMESTAMP}-1.mp4"
curl -s -L --max-time 120 "$VIDEO_URL" -o "$VIDEO_FILENAME"

if [ -f "$VIDEO_FILENAME" ] && [ -s "$VIDEO_FILENAME" ]; then
    VIDEO_SIZE=$(du -h "$VIDEO_FILENAME" | cut -f1)
    echo "Video saved: $VIDEO_FILENAME ($VIDEO_SIZE)"
else
    rm -f "$VIDEO_FILENAME"
    echo "Failed to download video"
    exit 1
fi

echo ""
echo "================================================================"
echo "  Complete!"
echo "================================================================"
echo ""
echo "Source Image: $IMAGE_URL"
echo "Video File:   $VIDEO_FILENAME"
echo ""
echo "Play video:"
echo "  mpv \"$VIDEO_FILENAME\""
echo "  # or"
echo "  xdg-open \"$VIDEO_FILENAME\""
echo ""

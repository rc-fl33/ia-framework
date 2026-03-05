#!/bin/bash
###############################################################################
# Grok Image Generation - Simple CLI Wrapper
#
# Uses the /v1/images/generations endpoint (OpenAI-compatible)
# Model: grok-imagine-1.0
#
# Usage: ./image-cli.sh "your prompt here"
#        ./image-cli.sh "your prompt" 2            # generate 2 images
#        ./image-cli.sh --size 1024x1024 "prompt"  # square
#        ./image-cli.sh --nsfw --format jpg "prompt"
#
# Flags:
#   --size     1280x720|720x1280|1024x1024|1792x1024|1024x1792 (default: 1280x720)
#   --format   png|jpg  (default: png, downloads jpg then converts)
#   --nsfw     Route output to nsfw directory
#   --count N  Number of images to generate
###############################################################################

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
IMG_SIZE="${SIZE:-1280x720}"
IMG_FORMAT="png"
NSFW=false
IMG_COUNT=""

# Parse flags
while [[ $# -gt 0 ]]; do
    case "$1" in
        --size)
            IMG_SIZE="$2"
            shift 2
            ;;
        --format)
            IMG_FORMAT="$2"
            shift 2
            ;;
        --nsfw)
            NSFW=true
            shift
            ;;
        --count)
            IMG_COUNT="$2"
            shift 2
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

if [ -z "$1" ]; then
    echo "Usage: $0 [flags] \"your prompt\" [count]"
    echo ""
    echo "Flags:"
    echo "  --size     1280x720|720x1280|1024x1024|1792x1024|1024x1792"
    echo "             (default: 1280x720, or SIZE env var)"
    echo "  --format   png|jpg  (default: png)"
    echo "  --nsfw     Route output to nsfw directory"
    echo "  --count N  Number of images to generate"
    echo ""
    echo "Environment variables:"
    echo "  SIZE=1280x720  Fallback for --size flag"
    echo ""
    echo "Examples:"
    echo "  $0 \"A cat playing piano\""
    echo "  $0 --size 1024x1024 --format jpg \"Cyberpunk city\" 2"
    echo "  $0 --nsfw --count 3 \"prompt here\""
    exit 1
fi

PROMPT="$1"

# Count: --count flag takes priority, then positional $2, then default 1
if [ -z "$IMG_COUNT" ]; then
    IMG_COUNT="${2:-1}"
fi

# Set output directory based on nsfw flag
if [ "$NSFW" = true ]; then
    OUTPUT_DIR="$HOME/grok-output/images/nsfw"
else
    OUTPUT_DIR="$HOME/grok-output/images/sfw"
fi
mkdir -p "$OUTPUT_DIR"

# Determine file extension
if [ "$IMG_FORMAT" = "png" ]; then
    FILE_EXT="png"
else
    FILE_EXT="jpg"
fi

echo "Generating ${IMG_COUNT} image(s) at ${IMG_SIZE} (${IMG_FORMAT})..."
echo "Prompt: \"$PROMPT\""
echo ""

# Call the dedicated image generation endpoint
RESPONSE=$(curl -s -X POST http://localhost:8000/v1/images/generations \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"grok-imagine-1.0\",
    \"prompt\": \"$PROMPT\",
    \"n\": $IMG_COUNT,
    \"size\": \"$IMG_SIZE\"
  }" --max-time 120)

# Check for errors
ERROR=$(echo "$RESPONSE" | jq -r '.error.message // empty' 2>/dev/null)
if [ -n "$ERROR" ]; then
    echo "API Error: $ERROR"
    exit 1
fi

# Extract URLs from response data array
URLS=$(echo "$RESPONSE" | jq -r '.data[].url // empty' 2>/dev/null)

if [ -z "$URLS" ]; then
    echo "No image URLs in API response"
    echo ""
    echo "Raw response:"
    echo "$RESPONSE" | head -5
    exit 1
fi

# Download images
IMG_NUM=1
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
for URL in $URLS; do
    JPG_FILENAME="${OUTPUT_DIR}/grok-image-${TIMESTAMP}-${IMG_NUM}.jpg"
    FINAL_FILENAME="${OUTPUT_DIR}/grok-image-${TIMESTAMP}-${IMG_NUM}.${FILE_EXT}"
    echo "Downloading image $IMG_NUM..."

    curl -s -L --max-time 30 "$URL" -o "$JPG_FILENAME" 2>/dev/null

    if [ -f "$JPG_FILENAME" ] && [ -s "$JPG_FILENAME" ]; then
        if [ "$IMG_FORMAT" = "png" ]; then
            # Convert jpg to png
            bun "${SCRIPT_DIR}/convert-jpg-to-png.ts" "$JPG_FILENAME" 2>/dev/null
            # convert-jpg-to-png.ts creates a .png file and removes the .jpg
            PNG_CONVERTED="${JPG_FILENAME%.jpg}.png"
            if [ -f "$PNG_CONVERTED" ] && [ -s "$PNG_CONVERTED" ]; then
                FINAL_FILENAME="$PNG_CONVERTED"
            else
                # Conversion failed, keep the jpg
                FINAL_FILENAME="$JPG_FILENAME"
                FILE_EXT="jpg"
                echo "  PNG conversion failed, keeping JPG"
            fi
        fi
        SIZE_H=$(du -h "$FINAL_FILENAME" | cut -f1)
        DIMS=$(file "$FINAL_FILENAME" | grep -oP '\d+x\d+')
        echo "  Saved: $FINAL_FILENAME ($SIZE_H, ${DIMS})"
        IMG_NUM=$((IMG_NUM + 1))
    else
        rm -f "$JPG_FILENAME"
        echo "  Failed to download: $URL"
    fi
done

echo ""
echo "Done! Images saved to: $OUTPUT_DIR"

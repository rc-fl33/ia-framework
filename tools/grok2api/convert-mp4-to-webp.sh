#!/bin/bash
###############################################################################
# MP4 to Animated WebP Converter
#
# Converts MP4 videos to animated WebP format for Ghost hero images
#
# Usage: ./convert-mp4-to-webp.sh input.mp4 [output.webp]
###############################################################################

if [ -z "$1" ]; then
    echo "Usage: $0 input.mp4 [output.webp]"
    echo ""
    echo "Example:"
    echo "  $0 hero.mp4"
    echo "  $0 hero.mp4 hero.webp"
    exit 1
fi

INPUT="$1"
# Default output: change hero.mp4 → hero.webp (keep name consistent)
DEFAULT_OUTPUT="${INPUT%.mp4}.webp"
OUTPUT="${2:-$DEFAULT_OUTPUT}"

if [ ! -f "$INPUT" ]; then
    echo "❌ Error: Input file not found: $INPUT"
    exit 1
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║  MP4 → Animated WebP Converter                         ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "Input:  $INPUT"
echo "Output: $OUTPUT"
echo ""

# Use bundled ffmpeg or system ffmpeg
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FFMPEG_BIN="$SCRIPT_DIR/bin/ffmpeg"

if [ -f "$FFMPEG_BIN" ]; then
    FFMPEG="$FFMPEG_BIN"
elif command -v ffmpeg &> /dev/null; then
    FFMPEG="ffmpeg"
else
    echo "❌ Error: ffmpeg not found"
    echo "   Run: bash $SCRIPT_DIR/setup-ffmpeg.sh"
    exit 1
fi

echo "🎬 Converting to animated WebP..."
echo ""

# Convert to animated WebP (optimized for instant loading - Option B)
# -loop 0: Loop forever (like autoplay loop)
# -lossless 0: Lossy compression (smaller file size)
# -compression_level 6: Maximum compression
# -quality 40: Very aggressive compression for <500KB target (down from 60)
# -preset picture: Optimized for photographic content
# -fps=6: Very reduced frame rate for smaller file (from 24fps)
# -scale=500:-1: Scale to 500px width, maintain aspect ratio
# -an: No audio
"$FFMPEG" -i "$INPUT" \
    -vcodec libwebp \
    -loop 0 \
    -lossless 0 \
    -compression_level 6 \
    -quality 40 \
    -preset picture \
    -vf "fps=6,scale=500:-1:flags=lanczos" \
    -an \
    "$OUTPUT" \
    -y 2>&1 | grep -E "Duration|time=|Stream|Output|error" || true

if [ $? -eq 0 ] && [ -f "$OUTPUT" ]; then
    echo ""
    echo "✓ Conversion complete!"
    echo ""

    # Show file sizes
    INPUT_SIZE=$(du -h "$INPUT" | cut -f1)
    OUTPUT_SIZE=$(du -h "$OUTPUT" | cut -f1)

    echo "File sizes:"
    echo "  Input (MP4):   $INPUT_SIZE"
    echo "  Output (WebP): $OUTPUT_SIZE"
    echo ""

    # Show file info
    echo "Output info:"
    file "$OUTPUT"
else
    echo ""
    echo "❌ Conversion failed"
    exit 1
fi

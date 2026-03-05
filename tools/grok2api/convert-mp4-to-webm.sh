#!/bin/bash
###############################################################################
# MP4 to WebM Converter
#
# Converts MP4 videos to WebM format optimized for web/blog use
#
# Usage: ./convert-mp4-to-webm.sh input.mp4 [output.webm]
###############################################################################

if [ -z "$1" ]; then
    echo "Usage: $0 input.mp4 [output.webm]"
    echo ""
    echo "Example:"
    echo "  $0 hero-video.mp4"
    echo "  $0 hero-video.mp4 hero-video-web.webm"
    exit 1
fi

INPUT="$1"
OUTPUT="${2:-${INPUT%.mp4}.webm}"

if [ ! -f "$INPUT" ]; then
    echo "❌ Error: Input file not found: $INPUT"
    exit 1
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║  MP4 → WebM Converter                                  ║"
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

echo "🎬 Converting..."
echo ""

# Convert with VP9 codec, no audio (for blog hero videos)
# -crf 30: Constant Rate Factor (quality, 0=best, 51=worst, 30=good balance)
# -b:v 0: Variable bitrate (optimal for VP9)
# -deadline good: Encoding speed vs quality (best/good/realtime)
# -an: Remove audio track
"$FFMPEG" -i "$INPUT" \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -deadline good \
    -an \
    -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" \
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
    echo "  Input (MP4):  $INPUT_SIZE"
    echo "  Output (WebM): $OUTPUT_SIZE"
    echo ""

    # Show file info
    echo "Output info:"
    FFPROBE="${FFMPEG/ffmpeg/ffprobe}"
    if [ -f "$FFPROBE" ]; then
        "$FFPROBE" -v error -show_entries format=duration,size,bit_rate -show_entries stream=codec_name,width,height -of default=noprint_wrappers=1 "$OUTPUT" 2>/dev/null || file "$OUTPUT"
    else
        file "$OUTPUT"
    fi
else
    echo ""
    echo "❌ Conversion failed"
    exit 1
fi

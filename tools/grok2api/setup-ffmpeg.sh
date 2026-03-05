#!/bin/bash
###############################################################################
# Download and setup static ffmpeg binary for the framework
#
# Downloads a portable ffmpeg build that doesn't require system installation
###############################################################################

FFMPEG_DIR="$(dirname "$0")/bin"
FFMPEG_BIN="$FFMPEG_DIR/ffmpeg"

mkdir -p "$FFMPEG_DIR"

if [ -f "$FFMPEG_BIN" ]; then
    echo "✓ ffmpeg already installed at $FFMPEG_BIN"
    exit 0
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Installing Static FFmpeg Binary                       ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Detect architecture
ARCH=$(uname -m)
if [ "$ARCH" = "x86_64" ]; then
    DOWNLOAD_URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz"
elif [ "$ARCH" = "aarch64" ] || [ "$ARCH" = "arm64" ]; then
    DOWNLOAD_URL="https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-arm64-static.tar.xz"
else
    echo "❌ Unsupported architecture: $ARCH"
    exit 1
fi

echo "📦 Downloading ffmpeg for $ARCH..."
echo "   Source: johnvansickle.com (static builds)"
echo ""

# Download to temp directory
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

curl -L "$DOWNLOAD_URL" -o ffmpeg.tar.xz

if [ $? -ne 0 ]; then
    echo "❌ Download failed"
    rm -rf "$TEMP_DIR"
    exit 1
fi

echo "📦 Extracting..."
tar xf ffmpeg.tar.xz

# Find the ffmpeg binary
FFMPEG_EXTRACTED=$(find . -name "ffmpeg" -type f | head -1)

if [ -z "$FFMPEG_EXTRACTED" ]; then
    echo "❌ ffmpeg binary not found in archive"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Copy to library
cp "$FFMPEG_EXTRACTED" "$FFMPEG_BIN"
chmod +x "$FFMPEG_BIN"

# Cleanup
cd - > /dev/null
rm -rf "$TEMP_DIR"

echo "✓ ffmpeg installed to $FFMPEG_BIN"
echo ""
echo "Version:"
"$FFMPEG_BIN" -version | head -1
echo ""
echo "✓ Setup complete!"

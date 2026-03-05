#!/bin/bash
##
# Video Analysis Tool - Dependency Installation
#
# Installs required dependencies for video download and analysis:
#   - yt-dlp (YouTube downloader)
#   - ffmpeg (video processing)
#   - @anthropic-ai/sdk (already installed via bun)
#
# Usage:
#   bash install-dependencies.sh
##

set -e

echo ""
echo "═════════════════════════════════════════════════"
echo "Video Analysis Tool - Dependency Installation"
echo "═════════════════════════════════════════════════"
echo ""

# Check if running on Ubuntu/Debian
if ! command -v apt-get &> /dev/null; then
    echo "⚠️  This script is for Ubuntu/Debian systems."
    echo "For other systems, install manually:"
    echo "  - yt-dlp: pip install yt-dlp"
    echo "  - ffmpeg: brew install ffmpeg (macOS) or equivalent"
    exit 1
fi

# Install ffmpeg
echo "Step 1: Installing ffmpeg..."
if command -v ffmpeg &> /dev/null; then
    echo "✓ ffmpeg already installed: $(ffmpeg -version | head -n1)"
else
    echo "Installing ffmpeg via apt-get..."
    sudo apt-get update
    sudo apt-get install -y ffmpeg
    echo "✓ ffmpeg installed"
fi
echo ""

# Install yt-dlp
echo "Step 2: Installing yt-dlp..."
if command -v yt-dlp &> /dev/null; then
    echo "✓ yt-dlp already installed: $(yt-dlp --version)"
else
    echo "Installing yt-dlp via pip..."

    # Check if pip is available
    if ! command -v pip3 &> /dev/null; then
        echo "pip3 not found. Installing python3-pip..."
        sudo apt-get install -y python3-pip
    fi

    pip3 install yt-dlp
    echo "✓ yt-dlp installed"
fi
echo ""

# Verify installations
echo "═════════════════════════════════════════════════"
echo "✅ Verification"
echo "═════════════════════════════════════════════════"
echo ""

echo "ffmpeg version:"
ffmpeg -version | head -n1
echo ""

echo "yt-dlp version:"
yt-dlp --version
echo ""

echo "Anthropic SDK:"
if [ -d "node_modules/@anthropic-ai/sdk" ]; then
    echo "✓ @anthropic-ai/sdk installed"
else
    echo "⚠️  @anthropic-ai/sdk not found. Run: bun add @anthropic-ai/sdk"
fi
echo ""

echo "═════════════════════════════════════════════════"
echo "✅ INSTALLATION COMPLETE"
echo "═════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo "1. Ensure ANTHROPIC_API_KEY is set in .env"
echo "2. Test with: bun run analyze-video.ts --url <url> --interval 5 --output test.md"
echo ""

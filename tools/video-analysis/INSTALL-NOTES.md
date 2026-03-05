# Video Analysis Tool - Installation Notes

## Current Status

✅ **yt-dlp** - Installed to `~/.local/bin/yt-dlp` (version 2025.12.08)
✅ **@anthropic-ai/sdk** - Installed via bun
❌ **ffmpeg** - Not installed (requires sudo)
⚠️  **JS runtime** - Not available (optional, improves YouTube extraction)

## Required: ffmpeg Installation

ffmpeg requires sudo access to install:

```bash
sudo apt-get update && sudo apt-get install -y ffmpeg
```

**Why required:**
- Frame extraction from video
- Video format conversion
- yt-dlp requires it for merging video+audio

## Optional: JavaScript Runtime

yt-dlp recommends a JavaScript runtime for better YouTube format extraction:

```bash
# Option 1: Install deno (recommended)
curl -fsSL https://deno.land/install.sh | sh

# Option 2: Use existing node (if installed)
# yt-dlp will auto-detect node.js if available
```

**Without JS runtime:**
- YouTube extraction still works
- Some formats may be unavailable
- May see warnings during download

## Testing

Once ffmpeg is installed, test the full pipeline:

```bash
# Test full workflow
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --interval 10 \
  --output /tmp/test-analysis.md

# Should output:
# ✅ VIDEO ANALYSIS COMPLETE
# Output: /tmp/test-analysis.md
# Frames analyzed: ~N
```

## Current Blockers

**Cannot proceed with video analysis until ffmpeg is installed.**

Command to install ffmpeg:
```bash
sudo apt-get install -y ffmpeg
```

This requires your password for sudo access.

---

**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-01-23

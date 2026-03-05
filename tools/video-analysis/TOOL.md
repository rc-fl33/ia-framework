---
name: video-analysis
type: utility
classification: public
description: Video content analysis via frame extraction and Claude vision - YouTube downloads, automated frame analysis, structured markdown reports
version: 1.0.0
last_updated: 2026-02-14
env_required: true
env_keys:
  - ANTHROPIC_API_KEY
commands:
  - bun tools/video-analysis/analyze-video.ts --url <url> --interval <seconds> --output <file>
  - bun tools/video-analysis/download-video.ts --url <url> --output <path>
  - bun tools/video-analysis/extract-frames.ts --video <path> --interval <seconds> --output <dir>
related_tools:
  - @anthropic-ai/sdk
  - youtube-dl-exec
  - @ffmpeg/ffmpeg
  - skills/ghost
  - skills/advisory
---

# Video Analysis Tool

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Pure JavaScript video analysis utility.

**Why Public:**
- Standard video processing patterns (download, frame extraction, vision analysis)
- No proprietary logic - orchestrates open source tools (yt-dlp, FFmpeg WASM, Claude API)
- Useful for content research and OSINT workflows
- Well-documented integration points for Ghost and Advisory skills

---

## Purpose

Extract insights from YouTube videos and other video sources through automated frame-by-frame analysis. Downloads video, extracts frames at intervals, analyzes screenshots with Claude's vision capabilities, aggregates insights into structured markdown reports, then cleans up temporary files.

**Core Capabilities:**
- **YouTube download**: Via yt-dlp wrapper (pure JavaScript, no Python required)
- **Frame extraction**: FFmpeg WebAssembly (no system dependencies)
- **Vision analysis**: Claude 3.5 Sonnet image understanding
- **Report generation**: Structured markdown with timeline, summary, metadata
- **Automatic cleanup**: Removes video and frames after analysis
- **Cost optimization**: Configurable frame intervals

**Use Cases:**
- **Ghost research**: Analyze video sources for blog post research
- **OSINT investigations**: Extract information from video evidence
- **Content summarization**: Generate text summaries of video tutorials
- **Technical documentation**: Extract diagrams, code, slides from videos
- **Fact-checking**: Verify claims made in video content

---

## Usage

### Full Analysis Pipeline

**Analyze YouTube video (5-second intervals):**
```bash
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --interval 5 \
  --output research-notes.md

# Output:
# 🎬 Video Analysis Pipeline
# ═══════════════════════════════════════════════════
# URL: https://youtu.be/1gQJdIlaXuY
# Interval: 5 seconds
# Output: research-notes.md
# Model: claude-3-5-sonnet-20241022
# Keep frames: false
# Keep video: false
#
# Step 1: Downloading video...
# ✓ Downloaded: Video Title
#
# Step 2: Extracting frames...
# ✓ Extracted 120 frames
#
# Step 3: Analyzing frames with Claude...
#   Analyzing frame 1/120 (0:05)...
#   Analyzing frame 2/120 (0:10)...
#   ...
# ✓ Analyzed 120 frames
#
# Step 4: Generating summary...
# ✓ Summary generated
#
# Step 5: Writing analysis...
# ✓ Analysis written to research-notes.md
#
# Step 6: Cleanup...
# ✓ Deleted video
# ✓ Deleted 120 frames
#
# ═══════════════════════════════════════════════════
# ✅ VIDEO ANALYSIS COMPLETE
# ═══════════════════════════════════════════════════
# Output: research-notes.md
# Frames analyzed: 120
```

**Custom interval (10 seconds for cost savings):**
```bash
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --interval 10 \
  --output notes.md

# 10-minute video = 60 frames (vs 120 at 5-second intervals)
# Cost: ~$0.12-$0.60 (vs $0.24-$1.20)
```

**Keep frames for debugging:**
```bash
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --interval 5 \
  --output analysis.md \
  --keep-frames \
  --keep-video

# Frames preserved in /tmp/video-analysis-<timestamp>/frames/
# Video preserved in /tmp/video-analysis-<timestamp>/video.mp4
```

**Use Opus model for complex analysis:**
```bash
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --interval 5 \
  --output deep-analysis.md \
  --model claude-opus-4-20250514

# More expensive but better for complex diagrams, code, technical content
```

---

### Component Scripts

**Download only:**
```bash
bun run tools/video-analysis/download-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --output /tmp/video.mp4

# Output:
# 📥 Video Download
# ═══════════════════════════════════════════════════
# URL: https://youtu.be/1gQJdIlaXuY
# Output: /tmp/video.mp4
# Quality: best
#
# ═══════════════════════════════════════════════════
# ✅ DOWNLOAD COMPLETE
# ═══════════════════════════════════════════════════
# Video: /tmp/video.mp4
# Title: Example Video Title
# Duration: 10:23
# Author: Channel Name
```

**Extract frames only:**
```bash
bun run tools/video-analysis/extract-frames.ts \
  --video /tmp/video.mp4 \
  --interval 5 \
  --output /tmp/frames/

# Output:
# 🎞️  Frame Extraction
# ═══════════════════════════════════════════════════
# Video: /tmp/video.mp4
# Interval: 5 seconds
# Output: /tmp/frames/
#
#   Loading FFmpeg.wasm...
#   Loading video into memory...
#   Extracting frames (1 frame per 5 seconds)...
#
# ═══════════════════════════════════════════════════
# ✅ EXTRACTION COMPLETE
# ═══════════════════════════════════════════════════
# Frames extracted: 120
# Output directory: /tmp/frames/
```

---

### Programmatic Usage

**Full pipeline:**
```typescript
import { analyzeVideo } from '@/tools/video-analysis/analyze-video';

const result = await analyzeVideo({
  url: 'https://youtu.be/1gQJdIlaXuY',
  interval: 5,
  output: 'research/video-analysis.md',
  keepFrames: false,
  keepVideo: false,
  model: 'claude-3-5-sonnet-20241022'
});

if (result.success) {
  console.log(`Analysis complete: ${result.output}`);
  console.log(`Frames analyzed: ${result.framesAnalyzed}`);
} else {
  console.error(`Analysis failed: ${result.error}`);
}
```

**Download only:**
```typescript
import { downloadVideo } from '@/tools/video-analysis/download-video';

const result = await downloadVideo({
  url: 'https://youtu.be/1gQJdIlaXuY',
  output: '/tmp/video.mp4',
  quality: 'best'
});

if (result.success) {
  console.log(`Downloaded: ${result.metadata?.title}`);
  console.log(`Duration: ${result.metadata?.duration}s`);
}
```

**Extract frames only:**
```typescript
import { extractFrames } from '@/tools/video-analysis/extract-frames';

const result = await extractFrames({
  video: '/tmp/video.mp4',
  interval: 5,
  output: '/tmp/frames/'
});

if (result.success) {
  console.log(`Extracted ${result.count} frames`);
  console.log(`Frames: ${result.frames?.join(', ')}`);
}
```

---

## Configuration

### Environment Variables

**Required:**
```bash
# .env
ANTHROPIC_API_KEY=[insert key]  # Claude API key for vision analysis
```

**Verify environment:**
```bash
# Check API key is set
grep ANTHROPIC_API_KEY .env

# Test API access
bun run -e 'import Anthropic from "@anthropic-ai/sdk"; const c = new Anthropic({apiKey: process.env.ANTHROPIC_API_KEY}); await c.messages.create({model: "claude-3-5-sonnet-20241022", max_tokens: 10, messages: [{role: "user", content: "test"}]}); console.log("✓ API works")'
```

---

### Dependencies

**All JavaScript - no system dependencies:**
```bash
cd /home/groves/ia-framework-private
bun install

# Installs:
# - @distube/ytdl-core (YouTube downloader, pure JS)
# - youtube-dl-exec (yt-dlp wrapper)
# - @ffmpeg/ffmpeg (FFmpeg compiled to WebAssembly)
# - @ffmpeg/util (FFmpeg utilities)
# - @anthropic-ai/sdk (Claude API)
```

**yt-dlp installation (one-time):**
```bash
# Install yt-dlp to ~/.local/bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ~/.local/bin/yt-dlp
chmod a+rx ~/.local/bin/yt-dlp

# Verify
yt-dlp --version
```

---

### Frame Interval Optimization

**Cost vs detail tradeoff:**

| Interval | 10-min video | Cost (Sonnet) | Use Case |
|----------|--------------|---------------|----------|
| 5s | 120 frames | $0.24-$1.20 | Detailed analysis, tutorials, code walkthroughs |
| 10s | 60 frames | $0.12-$0.60 | Standard analysis, interviews, presentations |
| 15s | 40 frames | $0.08-$0.40 | Quick overview, long videos, cost optimization |
| 30s | 20 frames | $0.04-$0.20 | Very long videos, background monitoring |

**Recommendations:**
- **Tutorials/Code**: 5s (need to catch all code/diagrams)
- **Interviews/Talks**: 10s (slides change infrequently)
- **Long documentaries**: 15-30s (overview only)
- **Cost-sensitive**: Start with 15s, reduce interval if needed

---

### Model Selection

**Claude model options:**

| Model | Best For | Cost/Frame | Frame Analysis Quality |
|-------|----------|------------|------------------------|
| Haiku 3.5 | Cost optimization | $0.001-$0.005 | Basic description |
| Sonnet 3.5 | Default (recommended) | $0.002-$0.010 | Detailed analysis |
| Opus 4 | Complex technical content | $0.015-$0.075 | Deep understanding |

**When to use Opus:**
- Complex diagrams or charts
- Code screenshots (syntax highlighting, multi-language)
- Technical presentations with dense information
- Legal/medical documents requiring precision

---

## API Reference

### analyzeVideo()

#### `analyzeVideo(options: AnalyzeOptions): Promise<AnalysisResult>`

Complete video analysis pipeline.

**Parameters:**
```typescript
interface AnalyzeOptions {
  url: string;                 // YouTube URL or video file path
  interval: number;            // Seconds between frames (1-60 recommended)
  output: string;              // Output markdown file path
  keepFrames?: boolean;        // Keep extracted frames (default: false)
  keepVideo?: boolean;         // Keep downloaded video (default: false)
  model?: string;              // Claude model (default: claude-3-5-sonnet-20241022)
}
```

**Returns:**
```typescript
interface AnalysisResult {
  success: boolean;
  output?: string;             // Path to generated markdown file
  framesAnalyzed?: number;     // Number of frames analyzed
  error?: string;              // Error message if failed
}
```

**Process:**
1. Downloads video to `/tmp/video-analysis-<timestamp>/video.mp4`
2. Extracts frames to `/tmp/video-analysis-<timestamp>/frames/`
3. Analyzes each frame with Claude vision API
4. Generates summary via Claude (consolidates frame analyses)
5. Writes markdown report
6. Cleans up temporary files (unless keepFrames/keepVideo)

---

### downloadVideo()

#### `downloadVideo(options: DownloadOptions): Promise<DownloadResult>`

Download video from YouTube or other sources.

**Parameters:**
```typescript
interface DownloadOptions {
  url: string;                 // Video URL
  output: string;              // Output file path (.mp4)
  quality?: 'best' | 'worst';  // Video quality (default: 'best')
}
```

**Returns:**
```typescript
interface DownloadResult {
  success: boolean;
  path?: string;               // Downloaded file path
  metadata?: {
    title: string;             // Video title
    duration: number;          // Duration in seconds
    author: string;            // Channel/uploader name
  };
  error?: string;
}
```

---

### extractFrames()

#### `extractFrames(options: ExtractOptions): Promise<ExtractResult>`

Extract frames from video file.

**Parameters:**
```typescript
interface ExtractOptions {
  video: string;               // Video file path
  interval: number;            // Seconds between frames
  output: string;              // Output directory for frames
}
```

**Returns:**
```typescript
interface ExtractResult {
  success: boolean;
  frames?: string[];           // Paths to extracted frame files
  count?: number;              // Number of frames extracted
  error?: string;
}
```

**Frame naming:** `frame_00001.png`, `frame_00002.png`, etc.

---

## Architecture

### Analysis Pipeline Flow

```
User runs: bun run analyze-video.ts --url <url> --interval 5 --output notes.md
   ↓
1. Create temp directory
   /tmp/video-analysis-<timestamp>/
   ↓
2. Download video (download-video.ts)
   youtube-dl-exec (wraps yt-dlp)
   → /tmp/video-analysis-<timestamp>/video.mp4
   Extract metadata: title, duration, author
   ↓
3. Extract frames (extract-frames.ts)
   Load FFmpeg.wasm from CDN
   Read video into WebAssembly memory
   Extract 1 frame every N seconds: fps=1/N
   → /tmp/video-analysis-<timestamp>/frames/frame_00001.png ...
   ↓
4. Analyze each frame
   For each frame:
     Read as base64
     Send to Claude vision API
     Prompt: "Analyze this frame - describe content, extract text/diagrams/code"
     Store: {frame: N, timestamp: "M:SS", analysis: "..."}
   ↓
5. Generate summary
   Consolidate all frame analyses
   Send to Claude: "Summarize video based on frame analyses"
   Extract: high-level summary + key insights + data points
   ↓
6. Write markdown report
   # Video Analysis: <title>
   **URL:** ...
   **Duration:** ...
   **Frames Analyzed:** ...

   ## Summary
   <summary>

   ## Detailed Timeline
   ### 0:05 - Frame 1
   <analysis>
   ...

   ## Metadata
   - Source: <url>
   - Uploader: <author>
   - Analysis Model: <model>
   ↓
7. Cleanup
   Delete video.mp4 (unless --keep-video)
   Delete frames/ (unless --keep-frames)
   Delete temp directory
   ↓
8. Return result
   {success: true, output: "notes.md", framesAnalyzed: 120}
```

---

### Technology Stack

**Download:**
```
youtube-dl-exec (Node wrapper)
   ↓
yt-dlp (~/.local/bin/yt-dlp)
   ↓
Downloads YouTube video → video.mp4
```

**Frame Extraction:**
```
@ffmpeg/ffmpeg (WebAssembly)
   ↓
Loads ffmpeg-core.wasm from unpkg.com
   ↓
Reads video.mp4 into virtual filesystem
   ↓
Executes: ffmpeg -i input.mp4 -vf fps=1/5 frame_%05d.png
   ↓
Writes frames to actual filesystem
```

**Vision Analysis:**
```
@anthropic-ai/sdk
   ↓
For each frame:
  Read frame as base64
  messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: [
        {type: "image", source: {type: "base64", media_type: "image/png", data: <base64>}},
        {type: "text", text: "Analyze this frame..."}
      ]
    }]
  })
   ↓
Extract text response → frame analysis
```

---

## Scripts

### Ghost Research Integration

**Add to Phase 1 (RESEARCH):**
```typescript
// skills/ghost/scripts/research-video-sources.ts
import { analyzeVideo } from '@/tools/video-analysis/analyze-video';

async function researchVideoSources(postDir: string, videoUrls: string[]) {
  for (const url of videoUrls) {
    const outputFile = `${postDir}/video-analysis-${Date.now()}.md`;

    const result = await analyzeVideo({
      url,
      interval: 10,  // 10s for cost efficiency
      output: outputFile,
      model: 'claude-3-5-sonnet-20241022'
    });

    if (result.success) {
      console.log(`✓ Analyzed video: ${outputFile}`);
    } else {
      console.error(`✗ Failed to analyze ${url}: ${result.error}`);
    }
  }
}
```

---

### Advisor OSINT Integration

**Add to OSINT research workflow:**
```typescript
// skills/advisor/scripts/osint-video-analysis.ts
import { analyzeVideo } from '@/tools/video-analysis/analyze-video';

async function analyzeOSINTVideo(investigationId: string, videoUrl: string) {
  const result = await analyzeVideo({
    url: videoUrl,
    interval: 5,   // 5s for detailed OSINT
    output: `private/output/advisory/${investigationId}/video-evidence.md`,
    keepFrames: true,  // Keep frames as evidence
    keepVideo: true,   // Keep video as evidence
    model: 'claude-opus-4-20250514'  // Use Opus for precision
  });

  return result;
}
```

---

### Batch Video Analysis

```bash
#!/bin/bash
# Batch analyze multiple YouTube videos

URLS=(
  "https://youtu.be/1gQJdIlaXuY"
  "https://youtu.be/abc123def45"
  "https://youtu.be/xyz789ghi01"
)

for url in "${URLS[@]}"; do
  VIDEO_ID=$(echo "$url" | sed 's/.*youtu\.be\///' | sed 's/.*v=//' | cut -d'&' -f1)

  echo "Analyzing: $url"
  bun run tools/video-analysis/analyze-video.ts \
    --url "$url" \
    --interval 10 \
    --output "research/video-${VIDEO_ID}.md"
done
```

---

## Dependencies

### Runtime

**External (npm packages):**
- `@distube/ytdl-core` - YouTube video downloader
- `youtube-dl-exec` - yt-dlp wrapper for Node.js
- `@ffmpeg/ffmpeg` - FFmpeg compiled to WebAssembly
- `@ffmpeg/util` - FFmpeg utility functions
- `@anthropic-ai/sdk` - Claude API client

**External (binaries):**
- `yt-dlp` - YouTube download CLI (~/.local/bin/yt-dlp)

**Internal:**
- Node.js `fs`, `path`, `os` modules
- Bun runtime

### Framework Integration

**Used By:**
- `skills/ghost/phases/01-research.md` - Video source analysis
- `skills/advisory/` - OSINT video evidence analysis

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/ghost/phases/01-research.md` — instructs agent to use video-analysis tool when sources include video content
- `skills/advisory/` — uses analyze-video.ts for OSINT analysis of video evidence

No direct TypeScript importers in hooks — invoked via CLI from skill workflows.

---

**File Structure:**
```
tools/video-analysis/
├── analyze-video.ts           # Main orchestration script
├── download-video.ts           # YouTube download wrapper
├── extract-frames.ts           # Frame extraction via FFmpeg WASM
├── install-dependencies.sh     # yt-dlp installation script
├── INSTALL-NOTES.md            # Installation troubleshooting
├── README.md                   # Original documentation
└── TOOL.md                     # This file
```

---

## Troubleshooting

### "ANTHROPIC_API_KEY not found in .env"

**Cause:** Missing or misconfigured API key

**Fix:**
```bash
# Add to .env
echo "ANTHROPIC_API_KEY=[insert key]" >> .env

# Verify
grep ANTHROPIC_API_KEY .env

# Test
bun run -e 'console.log(process.env.ANTHROPIC_API_KEY ? "✓ Set" : "✗ Missing")'
```

---

### "yt-dlp: command not found"

**Cause:** yt-dlp not installed or not in PATH

**Fix:**
```bash
# Install to ~/.local/bin
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o ~/.local/bin/yt-dlp
chmod a+rx ~/.local/bin/yt-dlp

# Add to PATH if needed
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify
yt-dlp --version
```

---

### "Download failed: Video unavailable"

**Cause:** Age-restricted, private, or deleted video

**Debug:**
```bash
# Test yt-dlp directly
yt-dlp "https://youtu.be/1gQJdIlaXuY"

# Check if age-restricted
yt-dlp --cookies-from-browser firefox "https://youtu.be/1gQJdIlaXuY"
```

**Workarounds:**
- Age-restricted: Use `--cookies-from-browser` with yt-dlp
- Private: Download manually, provide file path instead of URL
- Deleted: Use archived version or find alternative source

---

### "Frame extraction failed: No frames were extracted"

**Cause:** Video too short, interval too large, or FFmpeg error

**Debug:**
```bash
# Test manual extraction
bun run tools/video-analysis/extract-frames.ts \
  --video /tmp/video.mp4 \
  --interval 5 \
  --output /tmp/test-frames/

# Check video duration
ffprobe -i /tmp/video.mp4 -show_entries format=duration -v quiet -of csv="p=0"
```

**Fix:**
```bash
# Reduce interval if video is short
# For 30-second video, use 3-second interval
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/..." \
  --interval 3 \
  --output notes.md
```

---

### "Analysis failed: Rate limit exceeded"

**Cause:** Claude API rate limit (RPM or TPM)

**Fix:**
```bash
# Add delay between frames
# Modify analyze-video.ts (line 173):
# await new Promise(r => setTimeout(r, 1000));  // 1s delay
```

**Or use longer intervals:**
```bash
# 10s interval = 60 frames for 10-min video (slower API calls)
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/..." \
  --interval 10 \
  --output notes.md
```

---

### "FFmpeg.wasm failed to load"

**Cause:** Network issue loading from unpkg.com

**Fix:**
```bash
# Check network
curl -I https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd/ffmpeg-core.wasm

# If unreachable, wait and retry
# Or modify extract-frames.ts to use local copy
```

---

### High cost (unexpected API charges)

**Cause:** Too many frames analyzed

**Cost breakdown:**
```
10-minute video, 5-second interval = 120 frames
Claude Sonnet: $0.003/image × 120 = $0.36
Claude Opus: $0.015/image × 120 = $1.80
```

**Fix:**
```bash
# Increase interval to reduce frames
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/..." \
  --interval 15 \  # 40 frames instead of 120
  --output notes.md
```

---

## Related Tools

- **@anthropic-ai/sdk** - Claude API client for vision analysis
- **yt-dlp** - YouTube downloader (external binary)
- **FFmpeg.wasm** - WebAssembly video processing
- **skills/ghost** - Blog research workflow integration
- **skills/advisory** - OSINT investigation integration

---

## Version History

### 1.0.0 (2026-01-23)
- ✅ Pure JavaScript implementation (no system dependencies)
- ✅ YouTube video download via yt-dlp wrapper
- ✅ Frame extraction via FFmpeg WebAssembly
- ✅ Claude vision API integration
- ✅ Markdown report generation
- ✅ Automatic cleanup
- ✅ Configurable frame intervals
- ✅ Multiple model support (Haiku, Sonnet, Opus)
- ✅ Cost optimization features

---

## References

- **Claude Vision API**: https://docs.anthropic.com/en/docs/vision
- **yt-dlp**: https://github.com/yt-dlp/yt-dlp
- **FFmpeg.wasm**: https://github.com/ffmpegwasm/ffmpeg.wasm
- **youtube-dl-exec**: https://www.npmjs.com/package/youtube-dl-exec
- **Anthropic SDK**: https://github.com/anthropics/anthropic-sdk-typescript

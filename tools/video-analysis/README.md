# Video Analysis Tool (Pure JavaScript)

Download, analyze, and clean up videos for content research using pure JavaScript libraries - no system dependencies required.

## Purpose

Extract insights from YouTube videos and other video sources by:
1. Downloading video to temporary directory
2. Extracting frames at intervals
3. Analyzing screenshots with Claude's vision capabilities
4. Aggregating insights into structured notes
5. Cleaning up video and frames after analysis

## Dependencies

**All dependencies installed via bun - no sudo required:**

```bash
cd /home/groves/ia-framework-private
bun install
```

**Packages used:**
- `@distube/ytdl-core` - YouTube video downloader (pure JS)
- `@ffmpeg/ffmpeg` - FFmpeg compiled to WebAssembly (pure JS)
- `@ffmpeg/util` - FFmpeg utilities
- `@anthropic-ai/sdk` - Claude API for vision analysis

**No system dependencies required** - everything runs in JavaScript/WebAssembly.

## Usage

```bash
# Analyze YouTube video
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --interval 5 \
  --output research-notes.md

# Custom frame interval (10 seconds)
bun run tools/video-analysis/analyze-video.ts \
  --url "https://youtu.be/1gQJdIlaXuY" \
  --interval 10 \
  --output notes.md
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--url` | YouTube URL or video file path | Required |
| `--interval` | Seconds between frame extractions | 5 |
| `--output` | Output file for aggregated insights | `video-analysis.md` |
| `--keep-frames` | Keep extracted frames (for debugging) | false |
| `--keep-video` | Keep downloaded video (for debugging) | false |

## Output Format

```markdown
# Video Analysis: [Title]

**URL:** https://youtu.be/...
**Duration:** 12:34
**Analyzed:** 2026-01-23T12:00:00Z
**Frames Analyzed:** 150

## Summary

[High-level summary of video content]

## Key Insights

1. [Insight from analysis]
2. [Insight from analysis]
3. [Insight from analysis]

## Detailed Timeline

### 00:00:05 - Frame 1
[Description of visual content and analysis]

### 00:00:10 - Frame 2
[Description of visual content and analysis]

[...]

## References

- Source: [URL]
- Methodology: Frame extraction at 5-second intervals
```

## Workflow Scripts

### 1. download-video.ts

Downloads video from YouTube or other sources using yt-dlp.

```bash
bun run tools/video-analysis/download-video.ts \
  --url "https://youtu.be/..." \
  --output /tmp/video.mp4
```

### 2. extract-frames.ts

Extracts frames from video at specified intervals using ffmpeg.

```bash
bun run tools/video-analysis/extract-frames.ts \
  --video /tmp/video.mp4 \
  --interval 5 \
  --output /tmp/frames/
```

### 3. analyze-video.ts

Orchestrates entire workflow: download → extract → analyze → cleanup.

## Integration

### Ghost Research Workflow

Add to Phase 1 (RESEARCH) for video source analysis:

```typescript
// skills/ghost/phases/01-research.md
// If research includes YouTube videos, analyze them:
const videoAnalysis = await analyzeVideo({
  url: 'https://youtu.be/...',
  interval: 5,
  output: `${postDir}/video-research.md`
});
```

### Advisor OSINT Workflow

Integrate into OSINT research for video content analysis:

```typescript
// skills/advisor/scripts/osint-research.ts
if (source.type === 'video') {
  const insights = await analyzeVideo(source.url);
}
```

## Cost Considerations

**Image Analysis Cost:**
- Each frame sent to Claude API for vision analysis
- 5-second intervals on 10-minute video = 120 frames
- Cost: ~$0.24-$1.20 per video (depending on model)

**Recommendation:** Use 10-second intervals for cost efficiency unless high detail needed.

## Limitations

- YouTube age-restricted videos require authentication
- Private/unlisted videos need direct video file path
- Large videos (>1 hour) generate many frames - consider longer intervals
- Audio transcription not included (vision-only analysis)

## Future Enhancements

- [ ] Audio transcription with Whisper API
- [ ] Automatic interval adjustment based on scene changes
- [ ] Parallel frame analysis for speed
- [ ] Support for other video platforms (Vimeo, etc.)
- [ ] OCR extraction from slides/text in video

---

**Version:** 1.0
**Last Updated:** 2026-01-23
**Framework:** Intelligence Adjacent (IA)

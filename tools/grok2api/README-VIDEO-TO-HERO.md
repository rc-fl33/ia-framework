# Converting Grok Videos to Ghost Hero Images

## The Correct Format: Animated WebP

Ghost **only accepts WebP** format for animated hero images, not video files (MP4/WebM).

## Workflow

1. **Generate video in Grok web UI** (https://grok.com)
2. **Download MP4** from Grok as `hero-video.mp4`
3. **Convert to animated WebP:**
   ```bash
   bash tools/api/grok/convert-mp4-to-webp.sh hero-video.mp4
   # Output: hero-video.webp (automatic naming)
   ```
4. **Upload to Ghost:**
   ```bash
   bun skills/ghost/scripts/upload-hero-manual.ts <post-id> hero-video.webp "Alt text"
   ```

## File Sizes

Typical results (optimized settings):
- MP4: ~2.8MB (original from Grok, 24fps)
- WebP: ~2.5MB (optimized: 12fps, quality 60, lossy compression)

**Previous versions:**
- Lossless WebP: ~5.7MB (too large, no longer used)
- Quality 80 WebP: ~6.8MB (artifacts, no longer used)

## Why Not WebM?

WebM is a **video format** - Ghost rejects it for hero images.
WebP is an **image format** that supports animation - Ghost accepts it.


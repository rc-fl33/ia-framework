---
name: grok2api
type: api-client
classification: public
description: Grok image, video, chat, voice, image editing, and LLM provider via local Docker service (grok2api)
version: 3.0
last_updated: 2026-02-19
env_required: false
commands: []
---

> **FOR AI AGENTS:** Local Docker-based image/video generation, image editing, multimodal chat, voice, and LLM provider using X.com/Grok models.
> Load when: User needs hero images, video content, visual assets, Grok chat, image editing, voice, or cross-provider model comparison

---

# Grok Tool

**Image generation, video generation, image editing, multimodal chat, voice, admin, and LLM provider via grok2api Docker service**

Provides access to Grok models (`grok-imagine-1.0`, `grok-4.1-thinking`, etc.) through a locally-hosted Docker service (chenyme/grok2api).

---

## Classification

**Type:** api-client
**Visibility:** public
**Commands:** None (programmatic API and CLI scripts)

---

## Purpose

Enables visual content, chat, voice, and LLM provider capabilities for framework workflows:

1. **Text to Image:** Generate images via `POST /v1/images/generations` (configurable size and count)
2. **Image Editing:** Edit existing images via `POST /v1/images/edits` (multipart/form-data, PNG/JPEG/WebP up to 50MB)
3. **Text to Video:** Generate video via `grok-imagine-1.0-video`
4. **Chat:** Access Grok chat models via `POST /v1/chat/completions`
5. **Streaming Chat:** SSE-based async generator via `chatStream()`
6. **Reasoning Chat:** Explicit reasoning effort control via `chatWithReasoning()`
7. **Vision Chat:** Image analysis via `chatWithImage()`
8. **Multimodal Chat:** All 4 content types (text, image_url, input_audio, file) via `chatMultimodal()`
9. **Voice / LiveKit:** Real-time audio via `getVoiceToken()`
10. **LLM Provider:** Cross-provider model comparison via `Grok2ApiProvider` class
11. **Admin API:** Token management, NSFW control, cache management, config

**Architecture:** Runs locally via Docker (grok2api), proxying requests to X.com/Grok API using SSO session tokens.

---

## Setup

### Initial Installation

```bash
# 1. Clone grok2api repository
git clone https://github.com/chenyme/grok2api ~/grok2api

# 2. Build and start via framework docker-compose
docker compose -f tools/grok2api/deploy/docker-compose.yml up -d --build

# 3. Add SSO token (get from grok.com browser cookies)
# Edit ~/grok2api-data/token.json — see Token Configuration below
```

### Docker Management

```bash
# Start/stop/restart
docker compose -f tools/grok2api/deploy/docker-compose.yml up -d
docker compose -f tools/grok2api/deploy/docker-compose.yml down
docker restart grok2api

# View logs
docker logs -f grok2api

# Health check (from host)
./tools/grok2api/check-docker.sh
./tools/grok2api/check-docker.sh --silent  # For scripts (exit codes 0-4)

# Rebuild after repo update
cd ~/grok2api && git pull
docker compose -f tools/grok2api/deploy/docker-compose.yml up -d --build
```

### Token Configuration

**File:** `~/grok2api-data/token.json`

```json
{
  "ssoBasic": [
    {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
      "status": "active",
      "quota": 80
    }
  ],
  "ssoSuper": []
}
```

**How to get the SSO token:**
1. Open browser -> grok.com -> log in
2. DevTools (F12) -> Application -> Cookies -> `https://grok.com`
3. Copy the `sso` cookie value (starts with `eyJ0eXAi...`)
4. Paste as the `token` field value in token.json

**Optional:** Set `cf_clearance` in `~/grok2api-data/config.toml` (copy from browser cookies) to avoid Cloudflare blocks.

### Admin Panel

**URL:** `http://localhost:8000` (follow links to admin)
**Key:** `grok2api` (set via `app_key` in `~/grok2api-data/config.toml`)

Manage tokens, view usage, clear cache, and monitor health through the web UI.

---

## Usage

### CLI Scripts

```bash
# Generate image (default: 1280x720 landscape)
./tools/grok2api/image-cli.sh "A cyberpunk city at night"

# Generate 2 images at square size
./tools/grok2api/image-cli.sh "A cyberpunk city at night" 2

# Custom size
SIZE=1024x1024 ./tools/grok2api/image-cli.sh "A cyberpunk city at night"
```

**Available sizes:** `1280x720` (16:9), `720x1280` (9:16), `1024x1024` (1:1), `1792x1024` (3:2), `1024x1792` (2:3)

### Programmatic API

```typescript
import {
  generateImage,
  editImage,
  generateVideo,
  chat,
  chatStream,
  chatWithReasoning,
  chatWithImage,
  chatMultimodal,
  fetchModels,
  ensureDockerRunning,
} from '@/tools/grok2api/client';

// Generate image
const images = await generateImage({ prompt: "cyberpunk city at night" });

// Edit existing image
const edited = await editImage({
  prompt: "Add neon signs to the buildings",
  imagePath: "/path/to/source.png",
});

// Chat with Grok
const response = await chat({
  model: 'grok-4.1-thinking',
  messages: [{ role: 'user', content: 'Explain quantum computing' }]
});

// Stream response chunks
for await (const chunk of chatStream({
  model: 'grok-4.1-fast',
  messages: [{ role: 'user', content: 'Write a story' }]
})) {
  process.stdout.write(chunk);
}

// Chat with reasoning effort control
const reasoned = await chatWithReasoning(
  'Analyze this security architecture...',
  'high',          // effort: none | minimal | low | medium | high | xhigh
  'grok-4.1-thinking'
);

// Vision: analyze an image
const analysis = await chatWithImage(
  'Describe what you see in this image',
  'https://example.com/photo.jpg'
);

// Multimodal: text + image + audio + file
const multi = await chatMultimodal([
  {
    role: 'user',
    content: [
      { type: 'text', text: 'Analyze this' },
      { type: 'image_url', image_url: { url: 'https://example.com/img.png' } },
    ]
  }
]);

// Fetch live model list from Docker service
const models = await fetchModels();
```

### LLM Provider (Cross-Provider Comparison)

```typescript
import { Grok2ApiProvider } from '@/tools/grok2api/provider';

const provider = new Grok2ApiProvider();

// Single model call (returns ModelCallResult, same as OpenRouter)
const result = await provider.call('grok-4.20-beta', 'Explain TypeScript');
// result.status, result.content, result.tokens, result.latency_ms, result.cost (always 0)

// Parallel model comparison
const results = await provider.callParallel(
  ['grok-4.1-fast', 'grok-4.1-thinking', 'grok-4.20-beta'],
  'Compare REST vs GraphQL'
);

// Service availability check
const available = await provider.isAvailable();

// List models from Docker service
const models = await provider.listModels();

// Session statistics
const stats = provider.getSessionStats();
// { requests, totalTokens, totalCost (0), startTime, duration_ms }
```

**Provider CLI:**
```bash
bun tools/grok2api/provider.ts grok-4.20-beta "Hello world"
bun tools/grok2api/provider.ts grok-4.1-fast "Explain TypeScript"
```

### Admin API

```typescript
import {
  listTokens,
  addToken,
  refreshTokens,
  enableNSFW,
  isNSFWEnabled,
  getCacheStats,
  clearCache,
  getConfig,
  updateConfig,
} from '@/tools/grok2api/admin-client';

// Token management
const tokens = await listTokens();
await addToken('ssoBasic', 'eyJ0eXAi...', 80);
const refreshed = await refreshTokens();

// NSFW control
await enableNSFW();
const nsfw = await isNSFWEnabled();

// Cache management
const stats = await getCacheStats();
// { localImages, localVideos, onlineAssets, totalSizeBytes }
await clearCache('images');   // 'images' | 'videos' | 'all'
await clearOnlineAssets();

// Config management
const config = await getConfig();
await updateConfig('image', 'nsfw', true);
```

### Voice / LiveKit

```typescript
import { getVoiceToken } from '@/tools/grok2api/voice-client';

const connection = await getVoiceToken({
  voice: 'ara',
  personality: 'assistant',
  speed: 1.0,
});
// connection: { url, token, participantName, roomName }
```

---

## Output Directory

All generated output uses a unified directory structure with NSFW isolation:

```
~/grok-output/
├── images/
│   ├── sfw/       # Standard image generation
│   └── nsfw/      # NSFW image generation
├── edits/
│   ├── sfw/       # Standard image edits
│   └── nsfw/      # NSFW image edits
└── videos/
    ├── sfw/       # Standard video generation
    └── nsfw/      # NSFW video generation (includes preset: 'spicy')
```

Files are auto-named with timestamps: `grok-{type}-{date}-{time}-{index}.{ext}`

NSFW routing is automatic based on the `nsfw` option or `preset: 'spicy'` for videos.

---

## Available Models

### Chat Models
| Model | Description |
|-------|-------------|
| `grok-3` | Grok 3 base |
| `grok-3-mini` | Grok 3 lightweight |
| `grok-3-thinking` | Grok 3 with reasoning |
| `grok-4` | Grok 4 base |
| `grok-4-mini` | Grok 4 lightweight |
| `grok-4-thinking` | Grok 4 with reasoning |
| `grok-4.1-mini` | Grok 4.1 mini |
| `grok-4.1-fast` | Grok 4.1 fast |
| `grok-4.1-expert` | Grok 4.1 expert reasoning |
| `grok-4.1-thinking` | Grok 4.1 advanced thinking |
| `grok-4.20-beta` | Grok 4.20 beta |
| `grok-4-heavy` | Most powerful (Super account only) |

### Generation Models
| Model | Endpoint | Description |
|-------|----------|-------------|
| `grok-imagine-1.0` | `POST /v1/images/generations` | Text-to-image |
| `grok-imagine-1.0-edit` | `POST /v1/images/edits` | Image editing |
| `grok-imagine-1.0-video` | Video endpoint | Text/image-to-video |

---

## API Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `POST` | `/v1/chat/completions` | Chat (OpenAI-compatible) |
| `POST` | `/v1/images/generations` | Image generation |
| `POST` | `/v1/images/edits` | Image editing (multipart/form-data) |
| `POST` | `/v1/audio/speech` | Voice / LiveKit token |
| `GET` | `/v1/models` | List available models |
| `GET` | `/v1/files/image/{name}` | Serve cached images |
| `GET` | `/v1/files/video/{name}` | Serve cached videos |
| `GET` | `/v1/admin/*` | Admin panel APIs |

---

## Data Persistence

All persistent data lives outside the container on the host filesystem:

| Host Path | Container Path | Purpose |
|-----------|---------------|---------|
| `~/grok2api-data/config.toml` | `/app/data/config.toml` | Runtime configuration |
| `~/grok2api-data/token.json` | `/app/data/token.json` | SSO session tokens |
| `~/grok2api-data/tmp/` | `/app/data/tmp/` | Image/video cache |
| `~/grok2api-logs/` | `/app/logs/` | Application logs |

Container runs as host user (UID 1000) -- all files are editable without sudo.

---

## Architecture

```
User Request
    |
CLI Script / TypeScript API / Provider
    |
ensureDockerRunning() <- check-docker.sh health check
    |
localhost:8000 (grok2api Docker)
    |
X.com/Grok API (via SSO session token)
    |
Generated Media / Chat Response / Voice Token
    |
Download to ~/grok-output/{images,edits,videos}/{sfw,nsfw}/
```

**Framework files:**
- `tools/grok2api/deploy/docker-compose.yml` -- Container orchestration
- `tools/grok2api/deploy/grok2api.Dockerfile` -- VPS deployment image
- `tools/grok2api/deploy/deploy-grok2api-vps.sh` -- VPS deploy script
- `tools/grok2api/image-cli.sh` -- Image generation CLI
- `tools/grok2api/video-cli.sh` -- Video generation CLI
- `tools/grok2api/client.ts` -- TypeScript image/video/editing API
- `tools/grok2api/chat-client.ts` -- TypeScript chat API (base, stream, reasoning, vision, multimodal)
- `tools/grok2api/admin-client.ts` -- Admin API (tokens, NSFW, cache, config)
- `tools/grok2api/voice-client.ts` -- Voice / LiveKit client
- `tools/grok2api/provider.ts` -- LLM provider (OpenRouter-compatible interface)
- `tools/grok2api/types.ts` -- Shared type definitions (v2)
- `tools/grok2api/check-docker.sh` -- Health check script

**External:**
- `~/grok2api/` -- Upstream repo clone (build context)
- `~/grok2api-data/` -- Persistent data (config, tokens, cache)
- `~/grok2api-logs/` -- Application logs
- `~/grok-output/` -- Generated media output (NSFW-isolated)

---

## Troubleshooting

### Container Not Running

```bash
# Check status
docker ps -a | grep grok2api

# Start stopped container
docker start grok2api

# Full rebuild
docker compose -f tools/grok2api/deploy/docker-compose.yml up -d --build
```

### 401 Authentication Errors

**Cause:** SSO token expired or invalid

**Fix:**
1. Log in to grok.com in browser
2. Copy `sso` cookie from DevTools
3. Update `~/grok2api-data/token.json` -- set `token` field, set `status` to `"active"`
4. `docker restart grok2api`

### Token Not Loading (0 tokens)

**Cause:** Wrong token.json format. Must be a list of objects, not a dict.

**Wrong:**
```json
{"ssoNormal": {"user1": "eyJ..."}}
```

**Correct:**
```json
{"ssoBasic": [{"token": "eyJ...", "status": "active", "quota": 80}]}
```

Note: Pool name changed from `ssoNormal` to `ssoBasic` in v0.3+.

### Model Not Found

Models were renamed in grok2api v0.3+:
- `grok-imagine-0.9` -> `grok-imagine-1.0`
- `grok-3-fast` -> `grok-3`
- `grok-4-fast` -> `grok-4-mini`
- `grok-4.1` -> `grok-4.1-fast`

Check `curl http://localhost:8000/v1/models` for current list.

### Health Endpoint Returns 404

The `/health` endpoint was removed in grok2api v0.3+. Use `/v1/models` instead.

---

## Consumers

**Skills:**
- `skills/ghost/scripts/` -- Hero image generation for blog posts
- `skills/ghost/scripts/get-grok-trends.ts` -- Grok chat client

**Tools:**
- `tools/model-ranker/` -- Cross-provider model comparison via `Grok2ApiProvider`
- `tools/model-router/` -- Intelligent query routing across LLM providers

---

## Version History

- **3.0** (2026-02-19): Full API expansion: LLM provider, admin, voice, image editing, multimodal chat, NSFW routing, unified output dirs
- **2.0** (2026-02-18): Rebuilt for grok2api v0.3+ -- new API endpoints, model names, token format, framework docker-compose
- **1.0** (2026-01-24): Initial release with image/video generation

---

## References

- **grok2api GitHub:** https://github.com/chenyme/grok2api
- **Framework docker-compose:** tools/grok2api/deploy/docker-compose.yml

---

**Framework:** Intelligence Adjacent (IA)

# grok2api Migration: v1.0 to v2.0

**Date:** 2026-02-18
**Trigger:** grok2api upstream repo (chenyme/grok2api) had breaking changes; container was deleted and files reorganized without documentation.

---

## What Broke

### 1. Token Format Changed (caused `'str' object has no attribute 'get'`)

The token storage format changed from a dict-of-strings to a list-of-objects, and the pool name was renamed.

**v1 format** (`setting.toml` + `token.json`):
```json
{
  "ssoNormal": {
    "user1": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
  },
  "ssoSuper": {}
}
```

**v2 format** (`config.toml` + `token.json`):
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

**Key changes:**
- Pool name: `ssoNormal` -> `ssoBasic`
- Token value: bare string -> `TokenInfo` object with `token`, `status`, `quota` fields
- Structure: dict keyed by username -> list of objects
- The `sso` field name -> `token` field name (the actual SSO cookie value is the same)

### 2. SSO Tokens Expired (caused `401` errors)

After fixing the format, the actual SSO session tokens were returning 401 from X.com/Grok API. Tokens had been invalidated or expired.

**Fix:** Get fresh `sso` cookie from grok.com browser DevTools.

### 3. Config File Format Changed

**v1:** `~/grok2api/data/setting.toml`
```toml
[global]
base_url = "http://localhost:8000"
admin_username = "admin"
admin_password = "admin"

[grok]
cf_clearance = ""
```

**v2:** `~/grok2api-data/config.toml` (auto-created from `config.defaults.toml`)
```toml
[app]
app_url = "http://127.0.0.1:8000"
app_key = "grok2api"

[proxy]
cf_clearance = ""
browser = "chrome136"

[retry]
max_retry = 3
retry_status_codes = [401, 429, 403]

[token]
auto_refresh = true
fail_threshold = 5

[cache]
limit_mb = 512

# ... many more sections
```

**Key changes:**
- Filename: `setting.toml` -> `config.toml`
- Section `[global]` -> `[app]`
- Section `[grok]` -> split into `[proxy]`, `[retry]`, `[token]`, etc.
- `admin_password` -> `app_key`
- Much more granular configuration

### 4. Model Names Renamed

| v1 Model | v2 Model |
|----------|----------|
| `grok-imagine-0.9` | `grok-imagine-1.0` |
| `grok-3-fast` | `grok-3` |
| `grok-4-fast` | `grok-4-mini` |
| `grok-4.1` | `grok-4.1-fast` |
| `grok-4-fast-expert` | removed |
| `grok-4-expert` | removed |
| — | `grok-imagine-1.0-edit` (new) |
| — | `grok-imagine-1.0-video` (new) |
| — | `grok-4.20-beta` (new) |
| — | `grok-3-thinking` (new) |
| — | `grok-4-thinking` (new) |

### 5. API Endpoints Changed

| v1 Endpoint | v2 Endpoint | Notes |
|-------------|-------------|-------|
| `GET /health` | removed | Use `GET /v1/models` instead |
| `POST /v1/chat/completions` (images) | `POST /v1/images/generations` | Dedicated image endpoint |
| — | `POST /v1/images/edits` | New image editing endpoint |
| `POST /admin` | `GET /v1/admin/*` | Full admin API |

**Image generation request changed:**

v2 (dedicated endpoint):
```json
{
  "model": "grok-imagine-0.9",
  "messages": [{"role": "user", "content": [{"type": "text", "text": "prompt"}]}],
  "stream": false
}
```

v2 (dedicated endpoint):
```json
{
  "model": "grok-imagine-1.0",
  "prompt": "prompt",
  "n": 1,
  "size": "1280x720"
}
```

**Image generation response changed:**

v1: Parse image URLs from markdown in `choices[0].message.content`

v2: Structured response with `data[].url`:
```json
{
  "data": [{"url": "http://127.0.0.1:8000/v1/files/image/uuid.jpg"}]
}
```

### 6. Container Image Outdated

The locally-built `grok2api-local:latest` was from Jan 24, 2026. The upstream repo had 20+ commits since then including proxy fixes, retry improvements, and new model support. Python version also changed from 3.11 to 3.13.

### 7. No Framework Docker Compose

The container had been started with manual `docker run` commands using hardcoded bind mounts. No restart policy, no reproducible setup.

### 8. Data Directory Mismatch

- Container mounted `~/grok2api-data:/app/data` (absolute path)
- Fresh repo's docker-compose used `./data:/app/data` (relative)
- Old documentation referenced `~/grok2api/data/` (wrong)

---

## What Was Fixed

### Infrastructure
- **Created** `tools/grok2api/deploy/docker-compose.yml` — framework-owned orchestration
  - Builds from `~/grok2api` repo clone
  - Mounts `~/grok2api-data` and `~/grok2api-logs`
  - Runs as host user (UID 1000) — no root-owned files
  - `restart: unless-stopped`
- **Updated** `tools/grok2api/deploy/grok2api.Dockerfile` — Python 3.13, uv package manager, correct entrypoint
- **Rebuilt** container from fresh repo source

### Configuration
- Migrated from `setting.toml` to `config.toml` (auto-created by entrypoint)
- Migrated `token.json` to new list-of-objects format with `ssoBasic` pool
- Set `cf_clearance` from fresh browser cookies
- Fresh SSO token from grok.com

### Scripts
- **Updated** `image-cli.sh` — new `/v1/images/generations` endpoint, `size` parameter, `grok-imagine-1.0` model
- **Updated** `check-docker.sh` — `/v1/models` health endpoint, correct container name references
- **Updated** `chat-client.ts` — new model list, health endpoint, setup instructions
- **Updated** `TOOL.md` — complete rewrite for v2.0

### Naming
- **Renamed** (previously `tools/grok/`) -> `tools/grok2api/` for clarity
- Updated all imports across 7 TypeScript files
- Updated tool catalog and all documentation references

---

## Rebuild Procedure (Future Reference)

If grok2api breaks again or needs updating:

```bash
# 1. Update repo
cd ~/grok2api && git pull

# 2. Rebuild container
docker compose -f tools/grok2api/deploy/docker-compose.yml up -d --build

# 3. If token format changed, check logs
docker logs grok2api --tail 20

# 4. If tokens expired, refresh from browser
#    grok.com -> DevTools -> Cookies -> copy 'sso' value
#    Edit ~/grok2api-data/token.json

# 5. If config format changed
#    Delete ~/grok2api-data/config.toml
#    Restart container (entrypoint recreates from defaults)
#    Re-apply cf_clearance

# 6. Verify
curl -s http://localhost:8000/v1/models | python3 -m json.tool
./tools/grok2api/check-docker.sh
```

---

## File Locations

| Purpose | Path |
|---------|------|
| Framework orchestration | `tools/grok2api/deploy/docker-compose.yml` |
| Framework scripts | `tools/grok2api/` |
| Upstream repo (build context) | `~/grok2api/` |
| Persistent data | `~/grok2api-data/` |
| Config | `~/grok2api-data/config.toml` |
| Tokens | `~/grok2api-data/token.json` |
| Logs | `~/grok2api-logs/` |
| Generated images | `~/grok-generated-images/` |
| Generated videos | `~/grok-generated-videos/` |

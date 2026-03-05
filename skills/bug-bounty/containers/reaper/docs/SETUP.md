# Reaper Setup Guide

**Reaper is a web/API proxy that captures traffic to SQLite for agent analysis.**

---

## Architecture

```
┌─────────────────────────────────────────┐
│  Local Machine (Twingate Connected)     │
│                                         │
│  Browser → reaper-api.internal:8080     │
│  Web UI  → reaper-ui.internal:8000      │
└────────────────┬────────────────────────┘
                 │ Twingate Network
                 ▼
┌─────────────────────────────────────────┐
│           OVHcloud VPS                  │
│                                         │
│  ┌─────────────────────┐               │
│  │  Reaper Container   │               │
│  │  - Proxy: :8080     │               │
│  │  - Web UI: :8000    │               │
│  └──────────┬──────────┘               │
│             │ writes                    │
│             ▼                           │
│  /opt/pentest-data/reaper.db           │
│  (SQLite - OUTSIDE container)          │
│                                         │
└─────────────────────────────────────────┘
              │
              │ SSH + sqlite3
              ▼
┌─────────────────────────────────────────┐
│  Security Agent (local)                 │
│  ssh $VPS "sqlite3 /opt/pentest-data/   │
│            reaper.db 'SELECT ...'"      │
└─────────────────────────────────────────┘
```

**Key Points:**
- Browser proxies through Twingate to Reaper on VPS
- Database lives OUTSIDE container (persistent)
- No MCP - direct SQLite queries via SSH
- Agent queries database for captured traffic analysis

---

## VPS Setup

### 1. Start Reaper Container

```bash
# SSH to VPS
source .env
VPS_CMD="ssh -i $VPS_SSH_KEY -p $VPS_PORT $VPS_USER@$VPS_HOST"

# Create database file on host (required for bind mount)
$VPS_CMD "sudo touch /opt/pentest-data/reaper.db && sudo chmod 666 /opt/pentest-data/reaper.db"

# Start Reaper with external database mount
$VPS_CMD "docker run -d --name reaper \
  -e LISTEN_ADDR=0.0.0.0 \
  -e PORT=8000 \
  -e PROXY_PORT=8080 \
  -p 8080:8080 \
  -p 8000:8000 \
  -v /opt/pentest-data/reaper.db:/app/reaper.db \
  -v /opt/pentest-data:/data \
  ghcr.io/ghostsecurity/reaper:latest"

# Verify running
$VPS_CMD "docker ps | grep reaper"
$VPS_CMD "curl -s http://localhost:8000/health"
```

### 2. Configure Browser Proxy (via Twingate)

**Access via Twingate internal network:**

- **Web UI:** `http://reaper-ui.internal:8000/explore`
- **Proxy:** `reaper-api.internal:8080`

**Browser proxy settings:**
- HTTP Proxy: `reaper-api.internal`
- Port: `8080`

**Prerequisite:** Twingate client connected to security network.

### 3. Install CA Certificate (for HTTPS)

```bash
# Extract CA cert from container
$VPS_CMD "docker cp reaper:/root/.reaper/reaper-ca-cert.pem /opt/pentest-data/"

# Copy to local machine
scp -i $VPS_SSH_KEY -P $VPS_PORT $VPS_USER@$VPS_HOST:/opt/pentest-data/reaper-ca-cert.pem ./

# Install on Windows
certutil -addstore -f "Root" ".\reaper-ca-cert.pem"

# Install on Linux
sudo cp reaper-ca-cert.pem /usr/local/share/ca-certificates/reaper-ca-cert.crt
sudo update-ca-certificates

# Install on macOS
sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain reaper-ca-cert.pem
```

### 4. Capture Traffic

1. Browse target site with proxy configured
2. Traffic captured to `/opt/pentest-data/reaper.db`
3. View in Web UI: `http://reaper-ui.internal:8000/explore` (via Twingate)

---

## Agent Database Queries

**Query captured traffic directly via SSH + sqlite3:**

```bash
# Check database exists
$VPS_CMD "ls -la /opt/pentest-data/reaper.db"

# List captured hosts (filter to your target scope)
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db 'SELECT DISTINCT host FROM requests'"

# Get endpoints for target (SCOPE FILTER REQUIRED - Reaper captures ALL traffic)
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db \"SELECT method, url, COUNT(*) FROM requests WHERE host LIKE '%x.com%' GROUP BY method, url\""

# Get request details with headers
$VPS_CMD "sqlite3 -json /opt/pentest-data/reaper.db \"SELECT * FROM requests WHERE host LIKE '%x.com%' LIMIT 10\""

# Find GraphQL queries
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db \"SELECT url, body FROM requests WHERE url LIKE '%graphql%' LIMIT 20\""

# Export scoped traffic to JSON for local analysis
$VPS_CMD "sqlite3 -json /opt/pentest-data/reaper.db \"SELECT * FROM requests WHERE host LIKE '%x.com%'\"" > captured-traffic.json
```

**⚠️ IMPORTANT:** Reaper captures ALL browser traffic. Always filter queries by target scope (host LIKE '%target%').

---

## Database Schema

```sql
-- Actual Reaper schema (requests table)
CREATE TABLE requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT,
    method TEXT,
    host TEXT,              -- Use this for scope filtering
    url TEXT,               -- Full URL including path and query params
    headers TEXT,           -- JSON string of request headers
    proto TEXT,
    proto_major INTEGER,
    proto_minor INTEGER,
    content_type TEXT,
    content_length INTEGER,
    header_keys TEXT,
    param_keys TEXT,
    body_keys TEXT,
    body TEXT,
    created_at DATETIME
);

-- Common queries for pentesting (ALWAYS filter by host for scope)
-- Find authentication endpoints
SELECT * FROM requests WHERE host LIKE '%x.com%' AND (url LIKE '%auth%' OR url LIKE '%login%' OR url LIKE '%oauth%');

-- Find API endpoints
SELECT DISTINCT url FROM requests WHERE host LIKE '%x.com%' AND url LIKE '%api%';

-- Find GraphQL operations
SELECT url, json_extract(body, '$.operationName') as operation FROM requests WHERE host LIKE '%x.com%' AND url LIKE '%graphql%';

-- Get auth headers for test plan
SELECT headers FROM requests WHERE host LIKE '%x.com%' AND headers LIKE '%Authorization%' LIMIT 1;
```

---

## Cleanup

```bash
# Stop and remove container
$VPS_CMD "docker stop reaper && docker rm reaper"

# Optionally keep database for analysis
$VPS_CMD "ls -la /opt/pentest-data/reaper.db"

# Or delete if engagement complete
$VPS_CMD "rm /opt/pentest-data/reaper.db"
```

---

## Troubleshooting

### Browser shows certificate error
- Install CA certificate (Step 3)
- Restart browser after install

### No traffic captured
- Verify proxy settings: `reaper-api.internal:8080`
- Verify Twingate client is connected to security network
- Test with HTTP site first (before HTTPS)

### Database not found or empty
- Ensure bind mount is correct: `-v /opt/pentest-data/reaper.db:/app/reaper.db`
- Database file must exist on host BEFORE starting container
- Check permissions: `chmod 666 /opt/pentest-data/reaper.db`

### Container won't start
```bash
# Check for port conflicts
$VPS_CMD "netstat -tlnp | grep -E '8080|8000'"

# Check Docker logs
$VPS_CMD "docker logs reaper"
```

---

**Location:** OVHcloud VPS (deployed via `/opt/security-tools/docker-compose.yml`)
**Database:** `/opt/pentest-data/reaper.db`
**Access:** SSH + sqlite3 (no MCP)

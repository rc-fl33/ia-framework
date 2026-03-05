# Reaper Container Tools

**Image:** ghcr.io/ghostsecurity/reaper:latest
**Purpose:** Web/API proxy, traffic capture, endpoint discovery
**Access Method:** SSH + sqlite3 (database lives OUTSIDE container)
**Ports:** 8080 (proxy), 8000 (web UI)

---

## Architecture

```
Browser → Reaper Proxy (:8080) → Target Site
              ↓
        Captures to SQLite
              ↓
    /opt/pentest-data/reaper.db (OUTSIDE container)
              ↓
    Agent queries via: ssh $VPS "sqlite3 /opt/pentest-data/reaper.db 'SELECT ...'"
```

**Key:** Database is mounted OUTSIDE container for persistence and direct access.

---

## Quick Start

```bash
# Create database file on host (required for bind mount)
$VPS_CMD "sudo touch /opt/pentest-data/reaper.db && sudo chmod 666 /opt/pentest-data/reaper.db"

# Start Reaper on VPS
$VPS_CMD "docker run -d --name reaper \
  -e LISTEN_ADDR=0.0.0.0 -e PORT=8000 -e PROXY_PORT=8080 \
  -p 8080:8080 -p 8000:8000 \
  -v /opt/pentest-data/reaper.db:/app/reaper.db \
  -v /opt/pentest-data:/data \
  ghcr.io/ghostsecurity/reaper:latest"

# Access via Twingate (connect to security network first)
# Proxy: reaper-api.internal:8080
# Web UI: http://reaper-ui.internal:8000/explore

# Configure browser proxy: reaper-api.internal:8080
# Browse target site - traffic captured

# Query captured data (ALWAYS filter by host for scope - Reaper captures ALL traffic)
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db \"SELECT DISTINCT host FROM requests WHERE host LIKE '%x.com%'\""
```

---

## Agent Query Examples

**⚠️ SCOPE FILTER REQUIRED:** Reaper captures ALL browser traffic. Always filter by `host` column.

```bash
# List captured hosts (check what's been captured)
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db 'SELECT DISTINCT host FROM requests'"

# Get endpoints for target (SCOPED)
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db \"SELECT method, url FROM requests WHERE host LIKE '%x.com%'\""

# Find GraphQL queries with operation names (SCOPED)
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db \"SELECT url, body FROM requests WHERE host LIKE '%x.com%' AND url LIKE '%graphql%'\""

# Get authentication headers (SCOPED)
$VPS_CMD "sqlite3 /opt/pentest-data/reaper.db \"SELECT headers FROM requests WHERE host LIKE '%x.com%' LIMIT 1\""

# Export SCOPED traffic to JSON
$VPS_CMD "sqlite3 -json /opt/pentest-data/reaper.db \"SELECT * FROM requests WHERE host LIKE '%x.com%'\"" > traffic.json
```

---

## Use Cases

- **Endpoint Discovery:** Capture real API endpoints from authenticated browsing
- **GraphQL Mapping:** Extract query IDs, operation names, variables
- **Header Analysis:** Capture actual authentication headers for test plan
- **Parameter Enumeration:** Identify query params, form fields, JSON keys
- **Request/Response Pairs:** Full traffic capture for replay testing

---

## Database Location

- **Inside container:** `/app/reaper.db` (bind mounted from host)
- **Outside container:** `/opt/pentest-data/reaper.db` (persistent)
- **Access:** Direct sqlite3 queries via SSH (no MCP, no docker exec needed)
- **Setup:** Database file must exist on host BEFORE starting container (see Quick Start)

---

## See Also

- `SETUP.md` - Full setup instructions with CA certificate installation
- `../../scripts/pentest/reaper_proxy_crawler.py` - Automated crawling script

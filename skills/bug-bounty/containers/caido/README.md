# Caido Web Security Proxy Container

Modern web proxy for security testing with full WebSocket, HTTP/2, and GraphQL support.

## Quick Deploy

```bash
# Deploy to VPS
cd deploy
./deploy-to-vps.sh

# Or manually with docker-compose
docker-compose up -d
```

## Access

- **Web UI:** http://caido.internal:7000 (via Twingate)
- **Proxy:** caido.internal:8080

## Browser Setup

1. Download CA certificate from http://caido.internal:7000/settings/certificates
2. Install certificate in browser (Settings → Certificates → Import)
3. Configure proxy:
   - HTTP Proxy: caido.internal:8080
   - HTTPS Proxy: caido.internal:8080
   - Use for all protocols

## Why Caido?

### Advantages Over Reaper
- ✅ **WebSocket Inspection:** Full frame-by-frame WebSocket capture
- ✅ **Interactive UI:** No SQL needed, visual traffic analysis
- ✅ **Request Modification:** Intercept and modify on the fly
- ✅ **Modern Protocols:** HTTP/2, Server-Sent Events support
- ✅ **GraphQL Aware:** Structured query and mutation viewing

### Advantages Over Burp Suite
- ✅ **Modern UI:** Fast, clean interface (not Java Swing)
- ✅ **Lightweight:** No JVM overhead
- ✅ **Free Features:** Many Pro features included in free tier
- ✅ **Docker Native:** Easy containerized deployment

## Use Cases

### 1. WebSocket Debugging
**Scenario:** Grok Imagine shows progress % but no HTTP polling visible
**Solution:** Caido WebSocket tab reveals wss://grok.com/ws/imagine/listen
**Result:** Discovered real-time completion mechanism

### 2. API Reverse Engineering
- Browse authenticated web app through proxy
- View all endpoints in Site Map
- Export as cURL for replication
- Modify and replay requests in Repeater

### 3. GraphQL Testing
- Auto-detect GraphQL endpoints
- View operation names and variables
- Test mutations interactively
- Export queries for automation

## Data Persistence

- **Host Path:** `/opt/pentest-data/caido`
- **Container Path:** `/home/caido/.local/share/caido`
- **Contains:** Projects, settings, CA certificates

## Troubleshooting

### Container won't start
```bash
# Check logs
docker logs caido

# Verify data directory permissions
ssh vps "ls -la /opt/pentest-data/caido"
```

### Can't connect to proxy
```bash
# Verify Twingate connection
twingate status

# Check container status
docker ps | grep caido

# Test connectivity
curl -x http://caido.internal:8080 http://example.com
```

### Certificate issues
```bash
# Re-download certificate from UI
# http://caido.internal:7000/settings/certificates

# Clear browser SSL cache
# Chrome: chrome://settings/certificates
# Firefox: about:preferences#privacy → Certificates
```

## Documentation

- **Container Docs:** `docs/TOOLS.md`
- **Official Docs:** https://docs.caido.io/
- **Docker Hub:** https://hub.docker.com/r/caido/caido

## See Also

- **Reaper:** Bulk traffic capture with SQL queries
- **Playwright:** Browser automation for crawling
- **Burp Suite:** Enterprise proxy (if Caido limitations found)

---

**Created:** 2026-01-24
**Use Case:** Grok Imagine API reverse engineering (WebSocket discovery)
**Status:** Production ready

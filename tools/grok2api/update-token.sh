#!/bin/bash
###############################################################################
# Grok SSO Token Manual Update Script
#
# Usage: ./update-token.sh "YOUR_SSO_TOKEN_HERE"
#
# Steps to get your SSO token:
# 1. Open https://grok.com in your browser
# 2. Log in if not already logged in
# 3. Press F12 to open DevTools
# 4. Go to: Application → Cookies → .grok.com
# 5. Copy the value of the "sso" cookie
# 6. Run this script with that value
###############################################################################

if [ -z "$1" ]; then
    echo "Usage: $0 \"YOUR_SSO_TOKEN\""
    echo ""
    echo "Steps to get your SSO token:"
    echo "  1. Open https://grok.com in your browser"
    echo "  2. Log in if not already logged in"
    echo "  3. Press F12 to open DevTools"
    echo "  4. Go to: Application → Cookies → .grok.com"
    echo "  5. Copy the value of the 'sso' cookie"
    echo "  6. Run: $0 \"paste-token-here\""
    exit 1
fi

SSO_TOKEN="$1"
TOKEN_FILE="$HOME/grok2api-data/token.json"

if [ ! -f "$TOKEN_FILE" ]; then
    echo "❌ Error: Token file not found at $TOKEN_FILE"
    exit 1
fi

echo "╔════════════════════════════════════════════════════════╗"
echo "║  Grok SSO Token Update                                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "📝 Updating token.json..."

# Backup existing file
cp "$TOKEN_FILE" "$TOKEN_FILE.backup"
echo "   Backup saved: $TOKEN_FILE.backup"

# Update token using jq
jq --arg token "$SSO_TOKEN" '.ssoBasic[0] = {"token": $token, "status": "active", "quota": 80}' "$TOKEN_FILE" > "$TOKEN_FILE.tmp"
mv "$TOKEN_FILE.tmp" "$TOKEN_FILE"

echo "✓ Token updated in $TOKEN_FILE"
echo ""

# Restart Docker
echo "🐳 Restarting Docker container..."
docker restart grok2api

echo "✓ Docker container restarted"
echo ""

# Wait and verify
echo "🔍 Verifying service..."
echo "   Waiting 5 seconds for Docker to start..."
sleep 5

HEALTH=$(curl -s http://localhost:8000/v1/models | jq -r '.object' 2>/dev/null)

if [ "$HEALTH" = "list" ]; then
    echo "✓ Service is healthy!"
    echo ""
    echo "╔════════════════════════════════════════════════════════╗"
    echo "║  Token Update Complete!                                ║"
    echo "╚════════════════════════════════════════════════════════╝"
    echo ""
    echo "Next steps:"
    echo "  • Admin dashboard: http://localhost:8000/manage"
    echo "  • Test generation: bash tools/api/grok/image-cli.sh \"test\""
else
    echo "⚠️  Service health check failed"
    echo "   Check logs: docker logs grok2api"
fi

#!/bin/bash
# Deploy Caido to VPS
# Usage: ./deploy-to-vps.sh

set -e

VPS_HOST="vps-2809d4b8.vps.ovh.us"
DEPLOY_DIR="/opt/security-tools/caido"
DATA_DIR="/opt/pentest-data/caido"

echo "🚀 Deploying Caido to VPS..."

# Create directories on VPS
echo "📁 Creating directories..."
ssh "$VPS_HOST" "sudo mkdir -p $DEPLOY_DIR $DATA_DIR && sudo chmod -R 755 $DEPLOY_DIR && sudo chmod -R 777 $DATA_DIR"

# Copy docker-compose.yml to VPS
echo "📦 Copying docker-compose.yml..."
scp docker-compose.yml "$VPS_HOST:$DEPLOY_DIR/"

# Start Caido
echo "🐳 Starting Caido container..."
ssh "$VPS_HOST" "cd $DEPLOY_DIR && docker-compose pull && docker-compose up -d"

# Wait for container to start
sleep 5

# Check status
echo "✅ Checking container status..."
ssh "$VPS_HOST" "docker ps | grep caido"

echo ""
echo "🎉 Caido deployed successfully!"
echo ""
echo "Access via Twingate:"
echo "  Web UI: http://caido.internal:7000"
echo "  Proxy: caido.internal:8080"
echo ""
echo "Next steps:"
echo "  1. Connect to Twingate security network"
echo "  2. Visit http://caido.internal:7000"
echo "  3. Download CA certificate from Settings → Certificates"
echo "  4. Install certificate in your browser"
echo "  5. Configure browser proxy: caido.internal:8080"
echo ""

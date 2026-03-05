#!/bin/bash
##
# VPS Deployment Script for App Downloaders
#
# Deploys APK/IPA downloaders to OVH VPS for isolated execution.
# Useful for avoiding IP bans and running in clean environment.
#
# Target VPS:
#   - Host: vps-2809d4b8.vps.ovh.us
#   - User: debian
#   - Port: 2222
#   - Key: /home/groves/.ssh/gro_256
#
# @version 1.0
# @created 2026-01-23
##

set -euo pipefail

# VPS Configuration
VPS_HOST="${VPS_HOST:-vps-2809d4b8.vps.ovh.us}"
VPS_USER="${VPS_USER:-debian}"
VPS_PORT="${VPS_PORT:-2222}"
VPS_KEY="${VPS_KEY:-/home/groves/.ssh/gro_256}"
REMOTE_DIR="/home/debian/app-downloader"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
  echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
  echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${NC} $1"
}

# Verify SSH key exists
if [[ ! -f "$VPS_KEY" ]]; then
  log_error "SSH key not found: $VPS_KEY"
  exit 1
fi

log_info "Deploying app downloaders to VPS..."
log_info "Target: ${VPS_USER}@${VPS_HOST}:${VPS_PORT}"

# Test SSH connection
log_info "Testing SSH connection..."
if ! ssh -i "$VPS_KEY" -p "$VPS_PORT" "${VPS_USER}@${VPS_HOST}" "echo 'Connection successful'" &>/dev/null; then
  log_error "SSH connection failed"
  exit 1
fi
log_info "SSH connection successful"

# Create remote directory
log_info "Creating remote directory..."
ssh -i "$VPS_KEY" -p "$VPS_PORT" "${VPS_USER}@${VPS_HOST}" "mkdir -p ${REMOTE_DIR}"

# Copy files to VPS
log_info "Copying files to VPS..."
scp -i "$VPS_KEY" -P "$VPS_PORT" \
  download-apk.ts \
  download-ipa.ts \
  README.md \
  "${VPS_USER}@${VPS_HOST}:${REMOTE_DIR}/"

log_info "Files copied successfully"

# Install dependencies on VPS
log_info "Installing dependencies on VPS..."
ssh -i "$VPS_KEY" -p "$VPS_PORT" "${VPS_USER}@${VPS_HOST}" <<'ENDSSH'
cd /home/debian/app-downloader

# Install Bun if not already installed
if ! command -v bun &> /dev/null; then
  echo "Installing Bun..."
  curl -fsSL https://bun.sh/install | bash
  export BUN_INSTALL="$HOME/.bun"
  export PATH="$BUN_INSTALL/bin:$PATH"
fi

# Install Playwright
echo "Installing Playwright..."
bun install playwright

# Install Playwright browsers
echo "Installing Playwright browsers..."
bunx playwright install chromium

# Install ipatool (if available on Linux)
if command -v apt-get &> /dev/null; then
  echo "Note: ipatool installation on Linux requires manual setup"
  echo "See: https://github.com/majd/ipatool"
fi

echo "Dependencies installed successfully"
ENDSSH

log_info "Dependencies installed"

# Create .env template if it doesn't exist
log_info "Creating .env template..."
ssh -i "$VPS_KEY" -p "$VPS_PORT" "${VPS_USER}@${VPS_HOST}" <<'ENDSSH'
cd /home/debian/app-downloader

if [[ ! -f .env ]]; then
  cat > .env <<EOF
# Apple credentials (for IPA downloads)
# ⚠️ Warning: Use a dedicated Apple ID, not your primary account
APPLE_ID=
APPLE_PASSWORD=

# Optional: Output directories
APK_OUTPUT_DIR=/home/debian/app-downloader/output/apks
IPA_OUTPUT_DIR=/home/debian/app-downloader/output/ipas
EOF
  echo ".env template created"
else
  echo ".env already exists, skipping"
fi
ENDSSH

log_info ".env template created"

# Make scripts executable
log_info "Making scripts executable..."
ssh -i "$VPS_KEY" -p "$VPS_PORT" "${VPS_USER}@${VPS_HOST}" \
  "chmod +x ${REMOTE_DIR}/*.ts"

# Test deployment
log_info "Testing deployment..."
ssh -i "$VPS_KEY" -p "$VPS_PORT" "${VPS_USER}@${VPS_HOST}" <<'ENDSSH'
cd /home/debian/app-downloader
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

echo "Running APK downloader help..."
bun run download-apk.ts

echo "Running IPA downloader help..."
bun run download-ipa.ts
ENDSSH

log_info "Deployment test completed"

echo ""
log_info "✅ Deployment successful!"
echo ""
log_info "Next steps:"
echo "  1. SSH to VPS: ssh -i $VPS_KEY -p $VPS_PORT ${VPS_USER}@${VPS_HOST}"
echo "  2. Edit .env: cd $REMOTE_DIR && nano .env"
echo "  3. Run downloaders:"
echo "     - APK: bun run download-apk.ts com.twitter.android"
echo "     - IPA: bun run download-ipa.ts com.twitter.app"
echo ""
log_warn "Remember to set APPLE_ID and APPLE_PASSWORD in .env for IPA downloads"

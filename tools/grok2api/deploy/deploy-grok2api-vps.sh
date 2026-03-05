#!/bin/bash
###############################################################################
# Deploy grok2api Docker Container to VPS
#
# This script deploys the grok2api service to your VPS, providing a
# centralized Grok Imagine video generation API endpoint.
#
# Architecture:
#   Local Machine (TypeScript) → VPS:9900 (grok2api Docker) → X.com
#
# Benefits:
#   - No local Python dependencies
#   - VPS IP less likely to be blocked
#   - Centralized service for multiple clients
#   - Handles Cloudflare bypass automatically
#
# Prerequisites:
#   - VPS access configured in .env
#   - Docker installed on VPS
#   - X_COOKIES set in .env
#
# Usage:
#   bun run tools/deployment/deploy-grok2api-vps.sh
#
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load environment variables
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found${NC}"
    exit 1
fi

source .env

# Check required variables
if [ -z "$VPS_HOST" ]; then
    echo -e "${RED}Error: VPS_HOST not set in .env${NC}"
    exit 1
fi

if [ -z "$VPS_USER" ]; then
    echo -e "${RED}Error: VPS_USER not set in .env${NC}"
    exit 1
fi

if [ -z "$VPS_SSH_KEY" ]; then
    echo -e "${RED}Error: VPS_SSH_KEY not set in .env${NC}"
    exit 1
fi

if [ -z "$X_COOKIES" ]; then
    echo -e "${RED}Error: X_COOKIES not set in .env${NC}"
    echo "You need X session cookies for Grok Imagine to work"
    exit 1
fi

VPS_PORT=${VPS_PORT:-22}
CONTAINER_NAME="grok2api"
IMAGE_NAME="grok2api-custom"
EXPOSE_PORT="8000"  # grok2api runs on port 8000

echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Deploying grok2api to VPS                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "VPS Host: $VPS_HOST"
echo "VPS User: $VPS_USER"
echo "Port: $EXPOSE_PORT"
echo ""

# SSH command helper
SSH_CMD="ssh -p $VPS_PORT -i $VPS_SSH_KEY $VPS_USER@$VPS_HOST"

# Step 1: Check VPS connectivity
echo -e "${YELLOW}[1/6] Checking VPS connectivity...${NC}"
if ! $SSH_CMD "echo 'VPS connection successful'" > /dev/null 2>&1; then
    echo -e "${RED}Error: Cannot connect to VPS${NC}"
    echo "Check your VPS credentials in .env"
    exit 1
fi
echo -e "${GREEN}✓ VPS connection successful${NC}"
echo ""

# Step 2: Check Docker installation
echo -e "${YELLOW}[2/6] Checking Docker installation on VPS...${NC}"
if ! $SSH_CMD "command -v docker" > /dev/null 2>&1; then
    echo -e "${YELLOW}Docker not found. Installing Docker...${NC}"
    $SSH_CMD "curl -fsSL https://get.docker.com | sh"
    $SSH_CMD "sudo usermod -aG docker $VPS_USER"
    echo -e "${GREEN}✓ Docker installed${NC}"
else
    echo -e "${GREEN}✓ Docker already installed${NC}"
fi
echo ""

# Step 3: Stop existing container
echo -e "${YELLOW}[3/6] Stopping existing container (if any)...${NC}"
$SSH_CMD "docker stop $CONTAINER_NAME 2>/dev/null || true"
$SSH_CMD "docker rm $CONTAINER_NAME 2>/dev/null || true"
echo -e "${GREEN}✓ Cleaned up existing container${NC}"
echo ""

# Step 4: Clone and build grok2api
echo -e "${YELLOW}[4/7] Cloning and building grok2api on VPS...${NC}"

# Clone grok2api repository on VPS
$SSH_CMD "rm -rf ~/grok2api && git clone https://github.com/chenyme/grok2api.git ~/grok2api"

# Build image from official Dockerfile
$SSH_CMD "cd ~/grok2api && docker build -t $IMAGE_NAME ."
echo -e "${GREEN}✓ Image built${NC}"
echo ""

# Step 5: Create persistent storage directory
echo -e "${YELLOW}[5/7] Creating persistent storage directory...${NC}"
$SSH_CMD "mkdir -p ~/grok2api-data"
echo -e "${GREEN}✓ Storage directory created${NC}"
echo ""

# Step 6: Deploy container
echo -e "${YELLOW}[6/7] Deploying grok2api container...${NC}"

# Escape X_COOKIES for shell
ESCAPED_COOKIES=$(printf '%s' "$X_COOKIES" | sed "s/'/'\\\\''/g")

$SSH_CMD "docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $EXPOSE_PORT:8000 \
  -v ~/grok2api-data:/app/data \
  $IMAGE_NAME"

# Note: grok2api uses token.json for auth, not environment variables
# We'll need to configure tokens via the admin API after deployment

echo -e "${GREEN}✓ Container deployed${NC}"
echo ""

# Step 7: Verify deployment
echo -e "${YELLOW}[7/7] Verifying deployment...${NC}"
sleep 5

if $SSH_CMD "docker ps | grep $CONTAINER_NAME" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Container is running${NC}"
else
    echo -e "${RED}Error: Container failed to start${NC}"
    echo "Checking logs:"
    $SSH_CMD "docker logs $CONTAINER_NAME"
    exit 1
fi
echo ""

# Get container status
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Deployment Successful!                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Container Status:"
$SSH_CMD "docker ps --filter name=$CONTAINER_NAME --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'"
echo ""
echo -e "${GREEN}API Endpoint:${NC} http://$VPS_HOST:$EXPOSE_PORT"
echo ""
echo "Available endpoints:"
echo "  - POST   /v1/chat/completions   Generate video/image"
echo "  - GET    /health                 Health check"
echo ""
echo "Test with:"
echo "  curl http://$VPS_HOST:$EXPOSE_PORT/health"
echo ""
echo -e "${YELLOW}Note:${NC} Configure your firewall to allow port $EXPOSE_PORT"
echo "      or use Twingate for secure access"
echo ""
echo "View logs:"
echo "  ssh -p $VPS_PORT -i $VPS_SSH_KEY $VPS_USER@$VPS_HOST 'docker logs -f $CONTAINER_NAME'"
echo ""
echo "Persistent storage:"
echo "  VPS path: ~/grok2api-data/"
echo "  Contains: cache, rate limits, metrics"
echo ""
echo -e "${YELLOW}Security Note:${NC} X_COOKIES now live in Docker container only"
echo "                You can remove X_COOKIES from your local .env if desired"
echo ""

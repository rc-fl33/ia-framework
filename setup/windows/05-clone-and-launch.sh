#!/bin/bash
# Clone Framework and Launch Claude Code (WSL)
# Run this after 01-install-prerequisites.sh in the Windows setup
#
# Usage: Run this in WSL terminal
#   curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/05-clone-and-launch.sh -o /tmp/05-clone-and-launch.sh && chmod +x /tmp/05-clone-and-launch.sh && /tmp/05-clone-and-launch.sh

set -euo pipefail

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo "======================================================"
echo "  Clone Framework & Launch Claude Code (WSL)"
echo "======================================================"
echo ""

# Check if framework already cloned
if [ -d "$HOME/ia-framework" ]; then
    echo -e "  ${GREEN}[OK]${NC} Framework already cloned at: ~/ia-framework"
else
    echo -e "  ${YELLOW}Cloning IA Framework...${NC}"
    git clone https://github.com/notchrisgroves/ia-framework.git "$HOME/ia-framework"
    echo -e "  ${GREEN}[OK]${NC} Framework cloned to ~/ia-framework"
fi

echo ""
echo "  Ready to launch Claude Code"
echo ""

read -p "  Launch Claude Code now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd "$HOME/ia-framework"
    exec claude
fi

echo ""
echo "  To launch manually:"
echo "    cd ~/ia-framework"
echo "    claude"
echo ""

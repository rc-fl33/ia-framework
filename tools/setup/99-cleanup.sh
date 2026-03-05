#!/usr/bin/env bash
# Linux Cleanup Script for IA Framework
# Removes installed tools and Docker Engine
#
# Usage: Run from terminal
#   curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/tools/setup/linux/99-cleanup.sh -o /tmp/99-cleanup.sh
#   chmod +x /tmp/99-cleanup.sh
#   /tmp/99-cleanup.sh
#
# What this script does:
# - Offers full cleanup or selective removal
# - Uninstalls Docker Engine (optional)
# - Removes Bun JavaScript runtime (optional)
# - Removes GitHub CLI (gh) (optional)
# - Removes git-lfs (optional)
# - Cleans up configuration files (optional)
# - Removes framework directory (optional)
#
# CAUTION: This will DELETE selected tools and configurations!

set -e

# Color output helpers
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo ""
echo -e "${RED}======================================================"
echo -e "  IA Framework - Linux Cleanup"
echo -e "======================================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  WARNING: This can DELETE installed tools!${NC}"
echo ""
echo -e "${NC}Choose cleanup mode:${NC}"
echo -e "  1) Full cleanup - Remove everything"
echo -e "  2) Selective cleanup - Choose what to remove"
echo -e "  3) Cancel"
echo ""

read -p "Enter choice (1/2/3): " cleanup_mode

if [ "$cleanup_mode" = "3" ] || [ -z "$cleanup_mode" ]; then
    echo ""
    echo -e "${GRAY}  [CANCELLED] Cleanup cancelled - no changes made${NC}"
    echo ""
    exit 0
fi

# Initialize flags
remove_docker=false
remove_bun=false
remove_gh=false
remove_gitlfs=false
remove_configs=false
remove_framework=false

if [ "$cleanup_mode" = "1" ]; then
    echo ""
    echo -e "${RED}Full cleanup mode - this will remove:${NC}"
    echo -e "  - Docker Engine"
    echo -e "  - Bun JavaScript runtime"
    echo -e "  - GitHub CLI (gh)"
    echo -e "  - git-lfs"
    echo -e "  - Shell configuration references"
    echo ""
    read -p "⚠️  Type 'DELETE' to confirm full cleanup: " confirm

    if [ "$confirm" != "DELETE" ]; then
        echo ""
        echo -e "${GRAY}  [CANCELLED] Cleanup cancelled - no changes made${NC}"
        echo ""
        exit 0
    fi

    # Set all flags to true
    remove_docker=true
    remove_bun=true
    remove_gh=true
    remove_gitlfs=true
    remove_configs=true

elif [ "$cleanup_mode" = "2" ]; then
    echo ""
    echo -e "${CYAN}Selective cleanup mode${NC}"
    echo ""

    # Ask about each component
    read -p "Remove Docker Engine? (y/N): " choice
    [ "$choice" = "y" ] || [ "$choice" = "Y" ] && remove_docker=true

    read -p "Remove Bun JavaScript runtime? (y/N): " choice
    [ "$choice" = "y" ] || [ "$choice" = "Y" ] && remove_bun=true

    read -p "Remove GitHub CLI (gh)? (y/N): " choice
    [ "$choice" = "y" ] || [ "$choice" = "Y" ] && remove_gh=true

    read -p "Remove git-lfs? (y/N): " choice
    [ "$choice" = "y" ] || [ "$choice" = "Y" ] && remove_gitlfs=true

    read -p "Clean shell configuration files (.bashrc, .zshrc)? (y/N): " choice
    [ "$choice" = "y" ] || [ "$choice" = "Y" ] && remove_configs=true

    # Check if any action selected
    if [ "$remove_docker" = false ] && [ "$remove_bun" = false ] && [ "$remove_gh" = false ] && [ "$remove_gitlfs" = false ] && [ "$remove_configs" = false ]; then
        echo ""
        echo -e "${GRAY}  [CANCELLED] No components selected - no changes made${NC}"
        echo ""
        exit 0
    fi
else
    echo ""
    echo -e "${RED}Invalid choice${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${YELLOW}Starting cleanup...${NC}"
echo ""

# Step 1: Uninstall Docker Engine
if [ "$remove_docker" = true ]; then
    echo -e "${CYAN}Step 1: Uninstall Docker Engine${NC}"
    echo "--------------------------------"
    echo ""

    if command -v docker &> /dev/null; then
        echo -e "  Found Docker Engine, uninstalling..."

        # Detect package manager
        if command -v apt-get &> /dev/null; then
            # Ubuntu/Debian
            sudo apt-get remove -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 2>/dev/null || true
            sudo apt-get purge -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 2>/dev/null || true
            sudo apt-get autoremove -y 2>/dev/null || true

            # Remove Docker repository
            sudo rm -f /etc/apt/sources.list.d/docker.list
            sudo rm -f /etc/apt/keyrings/docker.gpg

            echo -e "${GREEN}  [OK] Docker Engine uninstalled${NC}"
        elif command -v dnf &> /dev/null; then
            # Fedora
            sudo dnf remove -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 2>/dev/null || true
            sudo rm -f /etc/yum.repos.d/docker-ce.repo
            echo -e "${GREEN}  [OK] Docker Engine uninstalled${NC}"
        elif command -v yum &> /dev/null; then
            # RHEL/CentOS
            sudo yum remove -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin 2>/dev/null || true
            sudo rm -f /etc/yum.repos.d/docker-ce.repo
            echo -e "${GREEN}  [OK] Docker Engine uninstalled${NC}"
        else
            echo -e "${YELLOW}  [WARN] Unknown package manager, skipping Docker removal${NC}"
        fi

        # Remove Docker data directories
        sudo rm -rf /var/lib/docker 2>/dev/null || true
        sudo rm -rf /var/lib/containerd 2>/dev/null || true

        # Remove Docker group
        sudo groupdel docker 2>/dev/null || true
    else
        echo -e "${GREEN}  [OK] Docker Engine not installed${NC}"
    fi
    echo ""
else
    echo -e "${GRAY}  [SKIPPED] Docker Engine - not selected for removal${NC}"
    echo ""
fi

# Step 2: Remove Bun
if [ "$remove_bun" = true ]; then
    echo -e "${CYAN}Step 2: Remove Bun JavaScript Runtime${NC}"
    echo "--------------------------------------"
    echo ""

    if [ -d "$HOME/.bun" ]; then
        echo -e "  Found Bun installation, removing..."
        rm -rf "$HOME/.bun"
        echo -e "${GREEN}  [OK] Bun removed${NC}"
    else
        echo -e "${GREEN}  [OK] Bun not installed${NC}"
    fi
    echo ""
else
    echo -e "${GRAY}  [SKIPPED] Bun - not selected for removal${NC}"
    echo ""
fi

# Step 3: Remove GitHub CLI
if [ "$remove_gh" = true ]; then
    echo -e "${CYAN}Step 3: Remove GitHub CLI (gh)${NC}"
    echo "-------------------------------"
    echo ""

    if command -v gh &> /dev/null; then
        echo -e "  Found GitHub CLI, uninstalling..."

        if command -v apt-get &> /dev/null; then
            # Ubuntu/Debian
            sudo apt-get remove -y gh 2>/dev/null || true
            sudo rm -f /etc/apt/sources.list.d/github-cli.list
            sudo rm -f /usr/share/keyrings/githubcli-archive-keyring.gpg
            echo -e "${GREEN}  [OK] GitHub CLI uninstalled${NC}"
        elif command -v dnf &> /dev/null; then
            # Fedora
            sudo dnf remove -y gh 2>/dev/null || true
            sudo rm -f /etc/yum.repos.d/github-cli.repo
            echo -e "${GREEN}  [OK] GitHub CLI uninstalled${NC}"
        elif command -v yum &> /dev/null; then
            # RHEL/CentOS
            sudo yum remove -y gh 2>/dev/null || true
            sudo rm -f /etc/yum.repos.d/github-cli.repo
            echo -e "${GREEN}  [OK] GitHub CLI uninstalled${NC}"
        else
            echo -e "${YELLOW}  [WARN] Unknown package manager, skipping gh removal${NC}"
        fi
    else
        echo -e "${GREEN}  [OK] GitHub CLI not installed${NC}"
    fi
    echo ""
else
    echo -e "${GRAY}  [SKIPPED] GitHub CLI - not selected for removal${NC}"
    echo ""
fi

# Step 4: Remove git-lfs
if [ "$remove_gitlfs" = true ]; then
    echo -e "${CYAN}Step 4: Remove git-lfs${NC}"
    echo "----------------------"
    echo ""

    if command -v git-lfs &> /dev/null; then
        echo -e "  Found git-lfs, uninstalling..."

        # Uninstall git-lfs hooks
        git lfs uninstall 2>/dev/null || true

        if command -v apt-get &> /dev/null; then
            sudo apt-get remove -y git-lfs 2>/dev/null || true
            echo -e "${GREEN}  [OK] git-lfs uninstalled${NC}"
        elif command -v dnf &> /dev/null; then
            sudo dnf remove -y git-lfs 2>/dev/null || true
            echo -e "${GREEN}  [OK] git-lfs uninstalled${NC}"
        elif command -v yum &> /dev/null; then
            sudo yum remove -y git-lfs 2>/dev/null || true
            echo -e "${GREEN}  [OK] git-lfs uninstalled${NC}"
        else
            echo -e "${YELLOW}  [WARN] Unknown package manager, skipping git-lfs removal${NC}"
        fi
    else
        echo -e "${GREEN}  [OK] git-lfs not installed${NC}"
    fi
    echo ""
else
    echo -e "${GRAY}  [SKIPPED] git-lfs - not selected for removal${NC}"
    echo ""
fi

# Step 5: Clean up configuration files
if [ "$remove_configs" = true ]; then
    echo -e "${CYAN}Step 5: Clean Up Configuration Files${NC}"
    echo "-------------------------------------"
    echo ""

    # Remove .bun references from shell configs
    for config in "$HOME/.bashrc" "$HOME/.zshrc" "$HOME/.profile"; do
        if [ -f "$config" ]; then
            if grep -q ".bun" "$config"; then
                echo -e "  Cleaning $config..."
                sed -i.backup '/\.bun/d' "$config"
            fi
        fi
    done

    echo -e "${GREEN}  [OK] Configuration files cleaned${NC}"
    echo ""
else
    echo -e "${GRAY}  [SKIPPED] Configuration cleanup - not selected${NC}"
    echo ""
fi

# Step 6: Remove framework directory (always ask)
echo -e "${CYAN}Step 6: Remove Framework Directory (Optional)${NC}"
echo "----------------------------------------------"
echo ""

if [ -d "$HOME/ia-framework" ]; then
    echo -e "  Found framework directory: $HOME/ia-framework"
    read -p "  Remove framework directory? (y/N): " remove_framework_choice

    if [ "$remove_framework_choice" = "y" ] || [ "$remove_framework_choice" = "Y" ]; then
        rm -rf "$HOME/ia-framework"
        echo -e "${GREEN}  [OK] Framework directory removed${NC}"
    else
        echo -e "${GRAY}  [SKIPPED] Framework directory kept${NC}"
    fi
else
    echo -e "${GREEN}  [OK] No framework directory found${NC}"
fi

# Final instructions
echo ""
echo -e "${CYAN}======================================================"
echo -e "  [SUCCESS] Cleanup Complete"
echo -e "======================================================${NC}"
echo ""
echo -e "${NC}Cleanup summary:${NC}"
[ "$remove_docker" = true ] && echo -e "  ✓ Docker Engine removed"
[ "$remove_bun" = true ] && echo -e "  ✓ Bun removed"
[ "$remove_gh" = true ] && echo -e "  ✓ GitHub CLI removed"
[ "$remove_gitlfs" = true ] && echo -e "  ✓ git-lfs removed"
[ "$remove_configs" = true ] && echo -e "  ✓ Configuration files cleaned"
echo ""
echo -e "${NC}To reinstall, run:${NC}"
echo -e "${CYAN}  curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/tools/setup/linux/01-install-prerequisites.sh -o /tmp/01-install-prerequisites.sh${NC}"
echo -e "${CYAN}  chmod +x /tmp/01-install-prerequisites.sh${NC}"
echo -e "${CYAN}  /tmp/01-install-prerequisites.sh${NC}"
echo ""
echo -e "${GRAY}Note: You may need to reload your shell:${NC}"
echo -e "${GRAY}  source ~/.bashrc  # or source ~/.zshrc${NC}"
echo ""

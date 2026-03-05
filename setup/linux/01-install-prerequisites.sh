#!/bin/bash
# Prerequisites Installation Script for IA Framework (Linux/macOS)
# Automates installation of required dependencies
#
# Usage: Run from Bash terminal
#   ./setup/linux/01-install-prerequisites.sh
#
# This script is for NATIVE Linux and macOS only.
# For Windows/WSL, use the PowerShell scripts in setup/windows/
#
# What this script does:
# - Auto-detects Linux distribution (Ubuntu/Debian/RHEL/Fedora/Arch/macOS)
# - Installs git, unzip, curl, and other prerequisites
# - Installs Bun (JavaScript runtime)
# - Installs GitHub CLI for authentication
# - Installs git-lfs for large file support
# - Configures PATH for local binaries

set -euo pipefail

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Helper functions
print_header() {
    echo -e "${CYAN}$1${NC}"
}

print_success() {
    echo -e "  ${GREEN}[OK]${NC} $1"
}

print_error() {
    echo -e "  ${RED}[FAIL]${NC} $1"
}

print_warning() {
    echo -e "  ${YELLOW}[WARN]${NC} $1"
}

print_info() {
    echo -e "  ${CYAN}[INFO]${NC} $1"
}

# Detect Linux distribution and package manager
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$ID
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        DISTRO=$DISTRIB_ID
    elif [ "$(uname)" = "Darwin" ]; then
        DISTRO="macos"
    else
        DISTRO="unknown"
    fi

    echo "$DISTRO" | tr '[:upper:]' '[:lower:]'
}

# Detect package manager
detect_package_manager() {
    if [ "$(uname)" = "Darwin" ]; then
        if command -v brew &> /dev/null; then
            echo "brew"
        else
            echo "macports"
        fi
    elif command -v apt-get &> /dev/null; then
        echo "apt"
    elif command -v dnf &> /dev/null; then
        echo "dnf"
    elif command -v yum &> /dev/null; then
        echo "yum"
    elif command -v pacman &> /dev/null; then
        echo "pacman"
    elif command -v zypper &> /dev/null; then
        echo "zypper"
    else
        echo "unknown"
    fi
}

# Check if command exists
command_exists() {
    command -v "$1" &> /dev/null
}

# Print section header
print_header() {
    echo ""
    echo "======================================================"
    echo "  $1"
    echo "======================================================"
    echo ""
}

# Main
print_header "IA Framework - Prerequisites Installation (Linux/macOS)"

DISTRO=$(detect_distro)
PKG_MGR=$(detect_package_manager)

print_header "Step 1: Detect System"

echo "  Detected: $DISTRO"
echo "  Package manager: $PKG_MGR"

print_header "Step 2: Install Prerequisites"

# Check and install prerequisites
install_prerequisites() {
    local missing=()

    # Check for curl
    if ! command_exists curl; then
        missing+=("curl")
    fi

    # Check for git
    if ! command_exists git; then
        missing+=("git")
    fi

    # Check for unzip
    if ! command_exists unzip; then
        missing+=("unzip")
    fi

    if [ ${#missing[@]} -eq 0 ]; then
        print_success "All prerequisites already installed"
        return 0
    fi

    echo "  Installing: ${missing[*]}..."

    case $PKG_MGR in
        apt)
            sudo apt-get update
            sudo apt-get install -y "${missing[@]}"
            ;;
        dnf|yum)
            sudo $PKG_MGR install -y "${missing[@]}"
            ;;
        pacman)
            sudo pacman -S --noconfirm "${missing[@]}"
            ;;
        zypper)
            sudo zypper install -y "${missing[@]}"
            ;;
        brew)
            brew install "${missing[@]}"
            ;;
        macports)
            sudo port install "${missing[@]}"
            ;;
        *)
            print_error "Unsupported package manager: $PKG_MGR"
            return 1
            ;;
    esac

    print_success "Prerequisites installed"
}

install_prerequisites

# Install Bun
print_header "Step 3: Install Bun"

if command_exists bun; then
    print_success "Bun $(bun --version) already installed"
else
    print_info "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash

    # Add to PATH for current session
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"

    # Add to shell config
    SHELL_CONFIG=""
    if [ -n "${BASH_VERSION:-}" ]; then
        SHELL_CONFIG="$HOME/.bashrc"
    elif [ -n "${ZSH_VERSION:-}" ]; then
        SHELL_CONFIG="$HOME/.zshrc"
    fi

    if [ -n "$SHELL_CONFIG" ]; then
        if ! grep -q 'BUN_INSTALL' "$SHELL_CONFIG" 2>/dev/null; then
            echo 'export BUN_INSTALL="$HOME/.bun"' >> "$SHELL_CONFIG"
            echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> "$SHELL_CONFIG"
            print_success "Bun added to $SHELL_CONFIG"
        fi
    fi

    print_success "Bun installed"
fi

# Install GitHub CLI
print_header "Step 4: Install GitHub CLI"

if command_exists gh; then
    print_success "GitHub CLI $(gh --version | head -1) already installed"
else
    print_info "Installing GitHub CLI..."

    # Detect architecture
    ARCH=$(uname -m)
    case $ARCH in
        x86_64)
            ARCH="amd64"
            ;;
        aarch64|arm64)
            ARCH="arm64"
            ;;
    esac

    case $DISTRO in
        ubuntu|debian)
            curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
            sudo apt-get update
            sudo apt-get install -y gh
            ;;
        macos)
            if command_exists brew; then
                brew install gh
            else
                curl -fsSL https://cli.github.com/github-cli-2.tar.gz | tar xz -C /tmp
                sudo mv /tmp/github-cli-2*/bin/gh /usr/local/bin/
            fi
            ;;
        *)
            # Generic install
            curl -fsSL "https://github.com/cli/cli/releases/download/v2.67.1/gh_${2}_${ARCH}.tar.gz" -o /tmp/gh.tar.gz
            tar xzf /tmp/gh.tar.gz -C /tmp
            sudo mv /tmp/gh-2.67.1/bin/gh /usr/local/bin/
            rm -rf /tmp/gh.tar.gz /tmp/gh-2.67.1
            ;;
    esac

    print_success "GitHub CLI installed"
fi

# Install git-lfs
print_header "Step 5: Install git-lfs"

if command_exists git-lfs; then
    print_success "git-lfs already installed"
else
    print_info "Installing git-lfs..."

    case $DISTRO in
        ubuntu|debian)
            sudo apt-get install -y git-lfs
            ;;
        macos)
            if command_exists brew; then
                brew install git-lfs
            fi
            ;;
        *)
            curl -fsSL https://packagecloud.io/github/git-lfs/install.sh | bash
            ;;
    esac

    # Initialize git-lfs
    if command_exists git-lfs; then
        git lfs install --skip-smudge 2>/dev/null || true
    fi

    print_success "git-lfs installed"
fi

# Install Claude Code CLI
print_header "Step 6: Install Claude Code CLI"

if command_exists claude; then
    print_success "Claude Code CLI already installed"
else
    print_info "Installing Claude Code CLI..."

    if [ "$(uname)" = "Darwin" ]; then
        # macOS
        if command_exists brew; then
            brew install anthropic/homebrew-tap/claude
        else
            curl -fsSL https://claude.ai/install.sh | sh
        fi
    else
        # Linux
        curl -fsSL https://claude.ai/install.sh | sh
    fi

    print_success "Claude Code CLI installed"
fi

# Add local/bin to PATH
print_header "Step 7: Configure PATH"

if [ -d "$HOME/.local/bin" ]; then
    if [[ ":$PATH:" != *":$HOME/.local/bin:"* ]]; then
        SHELL_CONFIG=""
        if [ -n "${BASH_VERSION:-}" ]; then
            SHELL_CONFIG="$HOME/.bashrc"
        elif [ -n "${ZSH_VERSION:-}" ]; then
            SHELL_CONFIG="$HOME/.zshrc"
        fi

        if [ -n "$SHELL_CONFIG" ]; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$SHELL_CONFIG"
            export PATH="$HOME/.local/bin:$PATH"
            print_success "Added ~/.local/bin to PATH"
        fi
    else
        print_success "~/.local/bin already in PATH"
    fi
fi

# Ensure bun is in PATH
BUN_BIN="$HOME/.bun/bin"
if [ -d "$BUN_BIN" ] && [[ ":$PATH:" != *":$BUN_BIN:"* ]]; then
    SHELL_CONFIG=""
    if [ -n "${BASH_VERSION:-}" ]; then
        SHELL_CONFIG="$HOME/.bashrc"
    elif [ -n "${ZSH_VERSION:-}" ]; then
        SHELL_CONFIG="$HOME/.zshrc"
    fi

    if [ -n "$SHELL_CONFIG" ]; then
        if ! grep -q 'BUN_INSTALL' "$SHELL_CONFIG"; then
            echo 'export BUN_INSTALL="$HOME/.bun"' >> "$SHELL_CONFIG"
            echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> "$SHELL_CONFIG"
        fi
        export PATH="$BUN_BIN:$PATH"
    fi
    print_success "Added bun to PATH"
fi

# Summary
print_header "Installation Complete"

echo "Installed versions:"
echo "  • git $(git --version | awk '{print $3}')"
echo "  • curl $(curl --version | head -1 | awk '{print $2}')"
echo "  • unzip $(unzip -v | head -1 | awk '{print $2}')"
if command_exists bun; then
    echo "  • bun $(bun --version)"
fi
if command_exists gh; then
    echo "  • gh $(gh --version | head -1 | awk '{print $3}')"
fi
if command_exists git-lfs; then
    echo "  • git-lfs $(git-lfs version | awk '{print $1}')"
fi
if command_exists claude; then
    echo "  • claude (Claude Code CLI)"
fi

echo ""
echo "Next steps:"
echo "  1. Authenticate with GitHub: gh auth login"
echo "  2. Clone the framework: git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework"
echo "  3. Navigate to framework: cd ~/ia-framework"
echo "  4. Launch Claude Code: claude"
echo ""
echo "Optional:"
echo "  • Install Docker: ./setup/linux/02-install-docker.sh"
echo "  • Optimize system: ./setup/linux/03-optimize-system.sh"
echo "  • Install Quarto: bun tools/setup/quarto-installer.ts"

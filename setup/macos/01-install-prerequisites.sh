#!/bin/bash
# Prerequisites Installation Script for IA Framework (macOS)
# Automates installation of required dependencies
#
# Usage: Run from Terminal
#   ./setup/macos/01-install-prerequisites.sh
#
# What this script does:
# - Installs Homebrew (if not present)
# - Installs git, bun, and other prerequisites via Homebrew
# - Installs GitHub CLI for authentication
# - Installs git-lfs for large file support
# - Configures PATH for Homebrew binaries

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

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect macOS version
detect_macos_version() {
    MACOS_VERSION=$(sw_vers -productVersion)
    MACOS_NAME=$(sw_vers -productName)
}

# Detect architecture
detect_architecture() {
    ARCH=$(uname -m)
    if [ "$ARCH" = "arm64" ]; then
        BREW_PREFIX="/opt/homebrew"
    else
        BREW_PREFIX="/usr/local"
    fi
}

echo ""
print_header "======================================================"
print_header "  IA Framework - Prerequisites Installation (macOS)"
print_header "======================================================"
echo ""

# Step 1: Detect macOS version and architecture
print_header "Step 1: Detect macOS Version"
print_header "-----------------------------"
echo ""

detect_macos_version
detect_architecture

print_success "Detected: $MACOS_NAME $MACOS_VERSION"
print_info "Architecture: $ARCH"
print_info "Homebrew prefix: $BREW_PREFIX"
echo ""

# Step 2: Check current prerequisites
print_header "Step 2: Check Current Prerequisites"
print_header "------------------------------------"
echo ""

ALL_INSTALLED=true

# Check Homebrew
if command_exists brew; then
    print_success "Homebrew $(brew --version | head -1 | awk '{print $2}') is installed"
else
    print_warning "Homebrew is not installed"
    ALL_INSTALLED=false
fi

# Check git
if command_exists git; then
    print_success "git $(git --version | awk '{print $3}') is installed"
else
    print_warning "git is not installed"
    ALL_INSTALLED=false
fi

# Check bun
if command_exists bun; then
    print_success "bun $(bun --version) is installed"
else
    print_warning "bun is not installed"
    ALL_INSTALLED=false
fi

# Check GitHub CLI
if command_exists gh; then
    print_success "gh $(gh --version | head -1 | awk '{print $3}') is installed"
else
    print_warning "gh (GitHub CLI) is not installed"
    ALL_INSTALLED=false
fi

# Check git-lfs
if command_exists git-lfs; then
    print_success "git-lfs is installed"
else
    print_warning "git-lfs is not installed"
    ALL_INSTALLED=false
fi

# Check Claude Code
if command_exists claude; then
    print_success "claude (Claude Code CLI) is installed"
else
    print_warning "claude (Claude Code CLI) is not installed"
    ALL_INSTALLED=false
fi

echo ""

if $ALL_INSTALLED; then
    print_header "======================================================"
    print_header "  [DONE] All Prerequisites Already Installed"
    print_header "======================================================"
    echo ""
    echo "Your system is ready for the IA Framework."
    echo ""
    echo "Next steps:"
    echo "  1. Clone the framework: git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework"
    echo "  2. Navigate to framework: cd ~/ia-framework"
    echo "  3. Launch Claude Code: claude"
    echo ""
    exit 0
fi

# Ask for confirmation
print_header "This script will install:"
echo "  • Homebrew (macOS package manager)"
echo "  • git (version control)"
echo "  • bun (JavaScript runtime)"
echo "  • GitHub CLI (gh)"
echo "  • git-lfs (large file support)"
echo "  • Claude Code CLI (official installer)"
echo ""

read -p "Proceed with installation? (Y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    print_warning "Installation cancelled"
    echo ""
    echo "Manual installation:"
    echo "  # Install Homebrew"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo ""
    echo "  # Install packages"
    echo "  brew install git bun gh git-lfs"
    echo ""
    exit 0
fi

echo ""

# Step 3: Install Homebrew
print_header "Step 3: Install Homebrew"
print_header "------------------------"
echo ""

if command_exists brew; then
    print_success "Homebrew is already installed"
else
    print_info "Installing Homebrew..."
    print_warning "You may be prompted for your password"
    echo ""

    if /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; then
        print_success "Homebrew installed successfully"

        # Configure PATH for Homebrew (especially important on Apple Silicon)
        if [ "$ARCH" = "arm64" ]; then
            print_info "Configuring PATH for Apple Silicon..."

            # Add to shell config
            SHELL_CONFIG=""
            if [ -n "${BASH_VERSION:-}" ]; then
                SHELL_CONFIG="$HOME/.bash_profile"
            elif [ -n "${ZSH_VERSION:-}" ]; then
                SHELL_CONFIG="$HOME/.zshrc"
            fi

            if [ -n "$SHELL_CONFIG" ]; then
                if ! grep -q "eval.*$BREW_PREFIX/bin/brew.*shellenv" "$SHELL_CONFIG" 2>/dev/null; then
                    echo "eval \"\$($BREW_PREFIX/bin/brew shellenv)\"" >> "$SHELL_CONFIG"
                    print_success "PATH configured in $SHELL_CONFIG"
                fi

                # Source the config for current session
                eval "$($BREW_PREFIX/bin/brew shellenv)"
            fi
        fi
    else
        print_error "Failed to install Homebrew"
        echo ""
        print_warning "Try installing manually:"
        echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        echo ""
        exit 1
    fi
fi

echo ""

# Step 4: Install git
print_header "Step 4: Install git"
print_header "-------------------"
echo ""

if command_exists git; then
    print_success "git is already installed ($(git --version | awk '{print $3}'))"
else
    print_info "Installing git via Homebrew..."
    if brew install git; then
        print_success "git installed"
    else
        print_error "Failed to install git"
        exit 1
    fi
fi

echo ""

# Step 5: Install bun
print_header "Step 5: Install bun"
print_header "-------------------"
echo ""

if command_exists bun; then
    print_success "bun is already installed ($(bun --version))"
else
    print_info "Installing bun via Homebrew..."
    if brew install oven-sh/bun/bun; then
        print_success "bun installed"
    else
        print_error "Failed to install bun via Homebrew"
        print_info "Trying direct installation..."
        if curl -fsSL https://bun.com/install | bash; then
            print_success "bun installed via direct method"
        else
            print_error "Failed to install bun"
            exit 1
        fi
    fi
fi

echo ""

# Step 6: Install GitHub CLI
print_header "Step 6: Install GitHub CLI"
print_header "--------------------------"
echo ""

if command_exists gh; then
    print_success "GitHub CLI is already installed ($(gh --version | head -1))"
else
    print_info "Installing GitHub CLI via Homebrew..."
    if brew install gh; then
        print_success "GitHub CLI installed"
    else
        print_error "Failed to install GitHub CLI"
        exit 1
    fi
fi

echo ""

# Step 7: Install git-lfs
print_header "Step 7: Install git-lfs"
print_header "-----------------------"
echo ""

if command_exists git-lfs; then
    print_success "git-lfs is already installed"
else
    print_info "Installing git-lfs via Homebrew..."
    if brew install git-lfs; then
        print_success "git-lfs installed"
        git lfs install
        print_success "git-lfs configured"
    else
        print_error "Failed to install git-lfs"
        exit 1
    fi
fi

echo ""

# Step 8: Install Claude Code
print_header "Step 8: Install Claude Code"
print_header "---------------------------"
echo ""

if command_exists claude; then
    print_success "Claude Code is already installed ($(claude --version 2>/dev/null || echo 'version check unavailable'))"
else
    print_info "Installing Claude Code..."
    echo ""

    if curl -fsSL https://claude.ai/install.sh | bash; then
        print_success "Claude Code installed successfully"
    else
        print_error "Failed to install Claude Code"
        print_warning "Try installing manually:"
        echo "  curl -fsSL https://claude.ai/install.sh | bash"
        echo ""
    fi
fi

echo ""

# Step 9: Verify Homebrew doctor
print_header "Step 9: Verify Installation"
print_header "---------------------------"
echo ""

print_info "Running brew doctor to check for issues..."
echo ""

# Run brew doctor but don't fail on warnings
brew doctor || true

echo ""

# Final summary
print_header "======================================================"
print_header "  [DONE] Prerequisites Installation Complete"
print_header "======================================================"
echo ""

echo "Installed components:"
if command_exists brew; then
    echo "  • Homebrew $(brew --version | head -1 | awk '{print $2}')"
fi
if command_exists git; then
    echo "  • git $(git --version | awk '{print $3}')"
fi
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
echo "  1. Restart your shell (or run: source ~/.zshrc)"
echo "  2. Authenticate with GitHub: gh auth login"
echo "  3. Clone the framework: git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework"
echo "  4. Navigate to framework: cd ~/ia-framework"
echo "  5. Launch Claude Code: claude"
echo ""
echo "Optional:"
echo "  • Install Docker: ./setup/macos/02-install-docker.sh"
echo ""

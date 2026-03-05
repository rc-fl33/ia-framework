#!/bin/bash
# Docker Installation Script for IA Framework (macOS)
# Offers choice between Docker Desktop (GUI) and Colima (lightweight CLI)
#
# Usage: Run from Terminal
#   ./setup/macos/02-install-docker.sh
#
# What this script does:
# - Checks if Docker is already installed
# - Offers choice between Docker Desktop and Colima
# - Docker Desktop: Full GUI, easier for beginners, requires license for enterprise
# - Colima: Lightweight CLI, open-source, no license restrictions
# - Installs selected option via Homebrew
# - Verifies installation with test container

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
    echo -e "  ${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "  ${RED}❌${NC} $1"
}

print_warning() {
    echo -e "  ${YELLOW}⚠️${NC} $1"
}

print_info() {
    echo -e "  ${CYAN}ℹ️${NC} $1"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Detect architecture
detect_architecture() {
    ARCH=$(uname -m)
    if [ "$ARCH" = "arm64" ]; then
        print_info "Architecture: Apple Silicon (M1/M2/M3)"
    else
        print_info "Architecture: Intel x86_64"
    fi
}

# Check if Docker is installed (Desktop or Engine)
check_docker_installed() {
    if command_exists docker; then
        return 0
    else
        return 1
    fi
}

# Check if Docker Desktop is installed
check_docker_desktop_installed() {
    if [ -d "/Applications/Docker.app" ]; then
        return 0
    else
        return 1
    fi
}

# Check if Colima is installed
check_colima_installed() {
    if command_exists colima; then
        return 0
    else
        return 1
    fi
}

# Check if Docker daemon is running
check_docker_running() {
    if docker ps >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

echo ""
print_header "======================================================"
print_header "  IA Framework - Docker Installation (macOS)"
print_header "======================================================"
echo ""

# Step 1: Check prerequisites
print_header "Step 1: Check Prerequisites"
print_header "---------------------------"
echo ""

detect_architecture

# Check for Homebrew
if ! command_exists brew; then
    print_error "Homebrew is not installed"
    print_warning "Install Homebrew first: ./setup/macos/01-install-prerequisites.sh"
    echo ""
    exit 1
fi

print_success "Homebrew is installed"

# Check current Docker status
if check_docker_installed; then
    print_success "Docker is already installed ($(docker --version))"

    # Check which Docker implementation
    if check_docker_desktop_installed; then
        print_info "Docker Desktop detected"
    elif check_colima_installed && colima status >/dev/null 2>&1; then
        print_info "Colima detected"
    fi

    # Check if running
    if check_docker_running; then
        print_success "Docker daemon is running"
    else
        print_warning "Docker is installed but not running"
        if check_docker_desktop_installed; then
            echo ""
            print_info "Start Docker Desktop from Applications"
        elif check_colima_installed; then
            echo ""
            print_info "Start Colima: colima start"
        fi
    fi

    echo ""
    print_header "======================================================"
    print_header "  ✅ Docker Already Installed"
    print_header "======================================================"
    echo ""
    echo "Verify Docker works:"
    echo "  docker --version"
    echo "  docker ps"
    echo "  docker run hello-world"
    echo ""
    exit 0
fi

echo ""

# Step 2: Choose Docker implementation
print_header "Step 2: Choose Docker Implementation"
print_header "-------------------------------------"
echo ""

echo "Two Docker options are available for macOS:"
echo ""
echo "1. Docker Desktop (Recommended for beginners)"
echo "   ✓ Full GUI application"
echo "   ✓ Easy to use and configure"
echo "   ✓ Built-in Kubernetes support"
echo "   ✓ Dashboard for managing containers"
echo "   ✗ Requires license for enterprise use"
echo "   ✗ More resource-intensive"
echo ""
echo "2. Colima (Lightweight alternative)"
echo "   ✓ Command-line only (no GUI)"
echo "   ✓ Open-source, no license restrictions"
echo "   ✓ Lighter on system resources"
echo "   ✓ Good for developers who prefer CLI"
echo "   ✗ No graphical dashboard"
echo "   ✗ Requires more manual configuration"
echo ""

read -p "Choose option (1 for Docker Desktop, 2 for Colima): " -n 1 -r
echo ""

DOCKER_CHOICE=""
if [[ $REPLY =~ ^[1]$ ]]; then
    DOCKER_CHOICE="desktop"
elif [[ $REPLY =~ ^[2]$ ]]; then
    DOCKER_CHOICE="colima"
else
    echo ""
    print_error "Invalid choice"
    echo ""
    exit 1
fi

echo ""

# Step 3: Install Docker
print_header "Step 3: Install Docker"
print_header "----------------------"
echo ""

if [ "$DOCKER_CHOICE" = "desktop" ]; then
    print_info "Installing Docker Desktop..."
    print_warning "This may take several minutes (~500MB download)"
    echo ""

    print_info "Note: Docker Desktop is free for:"
    echo "  • Personal use"
    echo "  • Small businesses (<250 employees AND <$10M revenue)"
    echo "  • Education"
    echo "  See: https://www.docker.com/pricing/"
    echo ""

    if brew install --cask docker; then
        print_success "Docker Desktop installed"

        echo ""
        print_info "Starting Docker Desktop..."
        open -a Docker

        echo ""
        print_warning "Waiting for Docker Desktop to start (this takes 30-60 seconds)..."
        print_info "You may be prompted to authorize Docker"

        # Wait for Docker to be ready (up to 2 minutes)
        MAX_WAIT=120
        WAITED=0
        while ! docker ps >/dev/null 2>&1; do
            if [ $WAITED -ge $MAX_WAIT ]; then
                print_warning "Docker Desktop is taking longer than expected to start"
                print_info "Check Docker Desktop in Applications and wait for it to fully start"
                break
            fi
            sleep 5
            WAITED=$((WAITED + 5))
            echo -n "."
        done
        echo ""

        if docker ps >/dev/null 2>&1; then
            print_success "Docker Desktop is running"
        else
            print_warning "Docker Desktop installed but not yet running"
            print_info "Open Docker Desktop from Applications and wait for it to start"
        fi
    else
        print_error "Failed to install Docker Desktop"
        echo ""
        print_warning "Try installing manually:"
        echo "  1. Visit: https://www.docker.com/products/docker-desktop/"
        echo "  2. Download Docker Desktop for Mac"
        echo "  3. Open the .dmg file and drag Docker to Applications"
        echo ""
        exit 1
    fi

elif [ "$DOCKER_CHOICE" = "colima" ]; then
    print_info "Installing Colima and Docker CLI..."
    echo ""

    # Install Docker client and Colima
    if brew install docker colima; then
        print_success "Docker CLI and Colima installed"

        echo ""
        print_info "Starting Colima..."
        print_warning "First start takes 1-2 minutes (downloading VM image)"
        echo ""

        # Start Colima with recommended settings
        # 2 CPUs, 4GB RAM, 60GB disk
        if colima start --cpu 2 --memory 4 --disk 60; then
            print_success "Colima started successfully"
        else
            print_error "Failed to start Colima"
            echo ""
            print_warning "Try starting manually:"
            echo "  colima start --cpu 2 --memory 4 --disk 60"
            echo ""
            exit 1
        fi
    else
        print_error "Failed to install Colima"
        echo ""
        print_warning "Try installing manually:"
        echo "  brew install docker colima"
        echo "  colima start"
        echo ""
        exit 1
    fi
fi

echo ""

# Step 4: Verify installation
print_header "Step 4: Verify Installation"
print_header "---------------------------"
echo ""

# Check Docker version
if command_exists docker; then
    DOCKER_VERSION=$(docker --version)
    print_success "Docker installed: $DOCKER_VERSION"
else
    print_error "Docker command not found"
    exit 1
fi

# Check Docker daemon
if check_docker_running; then
    print_success "Docker daemon is running"
else
    print_error "Docker daemon is not running"
    if [ "$DOCKER_CHOICE" = "desktop" ]; then
        print_warning "Open Docker Desktop from Applications"
    else
        print_warning "Start Colima: colima start"
    fi
    exit 1
fi

# Run test container
echo ""
print_info "Testing Docker with hello-world container..."
echo ""

if docker run --rm hello-world >/dev/null 2>&1; then
    print_success "Docker test container ran successfully"
else
    print_warning "Docker test container failed"
fi

echo ""

# Final summary
print_header "======================================================"
print_header "  ✅ Docker Installation Complete"
print_header "======================================================"
echo ""

if [ "$DOCKER_CHOICE" = "desktop" ]; then
    echo "Installed: Docker Desktop"
    echo "  • Docker Engine $(docker --version | awk '{print $3}' | tr -d ',')"
    echo "  • Docker Compose (built-in)"
    echo "  • Kubernetes (enable in Docker Desktop settings)"
    echo ""
    echo "Docker Desktop features:"
    echo "  • Dashboard: Click Docker icon in menu bar"
    echo "  • Settings: Docker icon → Preferences"
    echo "  • Resources: Adjust CPU/Memory in Preferences → Resources"
    echo ""
else
    echo "Installed: Colima + Docker CLI"
    echo "  • Docker CLI $(docker --version | awk '{print $3}' | tr -d ',')"
    echo "  • Colima $(colima version | head -1)"
    echo "  • Docker Compose (install with: brew install docker-compose)"
    echo ""
    echo "Colima commands:"
    echo "  • Start: colima start"
    echo "  • Stop: colima stop"
    echo "  • Status: colima status"
    echo "  • Restart: colima restart"
    echo "  • Delete: colima delete"
    echo ""
    echo "Adjust resources:"
    echo "  colima stop"
    echo "  colima start --cpu 4 --memory 8 --disk 100"
    echo ""
fi

echo "Verify Docker works:"
echo "  docker --version"
echo "  docker ps"
echo "  docker run hello-world"
echo ""

echo "Next steps:"
echo "  1. Test: docker run hello-world"
echo "  2. Clone framework: git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework"
echo "  3. Launch Claude Code: cd ~/ia-framework && claude"
echo ""

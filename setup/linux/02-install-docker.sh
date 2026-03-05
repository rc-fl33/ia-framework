#!/bin/bash
# Docker Engine Installation Script for IA Framework (Linux)
# Automates Docker Engine installation (native, no Desktop GUI)
#
# Usage: Run from Bash terminal
#   ./setup/linux/02-install-docker.sh
#
# What this script does:
# - Auto-detects Linux distribution
# - Installs Docker Engine (native daemon, no GUI)
# - Configures Docker to start on boot
# - Adds current user to docker group (no sudo required)
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

# Detect Linux distribution
detect_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        DISTRO=$ID
        VERSION=$VERSION_ID
    elif type lsb_release >/dev/null 2>&1; then
        DISTRO=$(lsb_release -si | tr '[:upper:]' '[:lower:]')
        VERSION=$(lsb_release -sr)
    elif [ -f /etc/lsb-release ]; then
        . /etc/lsb-release
        DISTRO=$(echo $DISTRIB_ID | tr '[:upper:]' '[:lower:]')
        VERSION=$DISTRIB_RELEASE
    else
        DISTRO="unknown"
        VERSION="unknown"
    fi
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Docker is installed
check_docker_installed() {
    if command_exists docker; then
        return 0
    else
        return 1
    fi
}

# Check if Docker daemon is running
check_docker_running() {
    if systemctl is-active --quiet docker 2>/dev/null; then
        return 0
    else
        return 1
    fi
}

echo ""
print_header "======================================================"
print_header "  IA Framework - Docker Engine Installation (Linux)"
print_header "======================================================"
echo ""

# Step 1: Check prerequisites
print_header "Step 1: Check Prerequisites"
print_header "---------------------------"
echo ""

# Detect distribution
detect_distro

if [ "$DISTRO" = "unknown" ]; then
    print_error "Could not detect Linux distribution"
    print_warning "Supported distributions: Ubuntu, Debian, RHEL, Fedora, Arch"
    echo ""
    exit 1
fi

print_success "Detected: $DISTRO $VERSION"

# Check if Docker is already installed
if check_docker_installed; then
    print_success "Docker is already installed ($(docker --version))"

    # Check if Docker is running
    if check_docker_running; then
        print_success "Docker daemon is running"
    else
        print_warning "Docker is installed but not running"
    fi

    # Check if user is in docker group
    if groups | grep -q docker; then
        print_success "Current user is in docker group"
    else
        print_warning "Current user is not in docker group"
        echo ""
        print_info "Add user to docker group to run without sudo:"
        echo "  sudo usermod -aG docker $USER"
        echo "  newgrp docker  # Or log out and back in"
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

# Check required commands
if ! command_exists curl; then
    print_error "curl is not installed"
    print_warning "Install curl first: ./setup/linux/01-install-prerequisites.sh"
    echo ""
    exit 1
fi

echo ""

# Ask for confirmation
print_header "This script will install:"
echo "  • Docker Engine (native daemon, no GUI)"
echo "  • Docker CLI and containerd"
echo "  • Docker Compose plugin"
echo "  • Configure Docker to start on boot"
echo "  • Add current user ($USER) to docker group"
echo ""
echo "Platform: $DISTRO $VERSION"
echo ""
echo "Note: This installs Docker Engine (server), not Docker Desktop."
echo "      Docker Engine is lighter and runs natively without a GUI."
echo ""

read -p "Proceed with Docker installation? (Y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    print_warning "Installation cancelled"
    echo ""
    echo "Manual installation:"
    echo "  Visit: https://docs.docker.com/engine/install/"
    echo "  Select your distribution for detailed instructions"
    echo ""
    exit 0
fi

echo ""

# Step 2: Install Docker Engine
print_header "Step 2: Install Docker Engine"
print_header "------------------------------"
echo ""

case "$DISTRO" in
    ubuntu|debian|pop)
        print_info "Installing Docker on $DISTRO..."
        echo ""

        # Remove old versions
        sudo apt-get remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

        # Install dependencies
        sudo apt-get update
        sudo apt-get install -y ca-certificates curl gnupg

        # Add Docker's official GPG key
        sudo install -m 0755 -d /etc/apt/keyrings
        curl -fsSL https://download.docker.com/linux/$DISTRO/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
        sudo chmod a+r /etc/apt/keyrings/docker.gpg

        # Set up repository
        echo \
          "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/$DISTRO \
          $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
          sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

        # Install Docker Engine
        sudo apt-get update
        sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

        print_success "Docker Engine installed"
        ;;

    fedora)
        print_info "Installing Docker on Fedora..."
        echo ""

        # Remove old versions
        sudo dnf remove -y docker docker-client docker-client-latest docker-common docker-latest \
            docker-latest-logrotate docker-logrotate docker-selinux docker-engine-selinux docker-engine 2>/dev/null || true

        # Install dependencies
        sudo dnf -y install dnf-plugins-core

        # Add Docker repository
        sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo

        # Install Docker Engine
        sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

        print_success "Docker Engine installed"
        ;;

    rhel|centos)
        print_info "Installing Docker on $DISTRO..."
        echo ""

        # Remove old versions
        sudo yum remove -y docker docker-client docker-client-latest docker-common docker-latest \
            docker-latest-logrotate docker-logrotate docker-engine 2>/dev/null || true

        # Install dependencies
        sudo yum install -y yum-utils

        # Add Docker repository
        sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

        # Install Docker Engine
        sudo yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

        print_success "Docker Engine installed"
        ;;

    arch|manjaro)
        print_info "Installing Docker on Arch Linux..."
        echo ""

        # Install Docker
        sudo pacman -Sy --noconfirm docker docker-compose

        print_success "Docker Engine installed"
        ;;

    *)
        print_error "Unsupported distribution: $DISTRO"
        print_warning "Manual installation required"
        echo ""
        echo "Visit: https://docs.docker.com/engine/install/"
        echo ""
        exit 1
        ;;
esac

echo ""

# Step 3: Start and enable Docker
print_header "Step 3: Start Docker Service"
print_header "-----------------------------"
echo ""

if sudo systemctl start docker; then
    print_success "Docker service started"
else
    print_error "Failed to start Docker service"
    echo ""
    exit 1
fi

if sudo systemctl enable docker; then
    print_success "Docker service enabled (starts on boot)"
else
    print_warning "Failed to enable Docker service"
fi

echo ""

# Step 4: Add user to docker group
print_header "Step 4: Configure User Permissions"
print_header "-----------------------------------"
echo ""

if sudo usermod -aG docker "$USER"; then
    print_success "Added $USER to docker group"
    print_warning "You must log out and back in (or run 'newgrp docker') for this to take effect"
else
    print_error "Failed to add user to docker group"
fi

echo ""

# Step 5: Verify installation
print_header "Step 5: Verify Installation"
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
    print_warning "Try: sudo systemctl start docker"
fi

# Try to run test container (with sudo since user group change needs re-login)
echo ""
print_info "Testing Docker with hello-world container..."
echo ""

if sudo docker run --rm hello-world >/dev/null 2>&1; then
    print_success "Docker test container ran successfully"
else
    print_warning "Docker test container failed (this may be expected before re-login)"
fi

echo ""

# Final summary
print_header "======================================================"
print_header "  ✅ Docker Engine Installation Complete"
print_header "======================================================"
echo ""

echo "Installed components:"
echo "  • Docker Engine $(docker --version | awk '{print $3}' | tr -d ',')"
echo "  • Docker Compose (plugin)"
echo "  • containerd"
echo ""

print_warning "IMPORTANT: You must log out and back in for docker group changes to take effect"
echo ""
echo "After logging back in, verify Docker works:"
echo "  docker --version"
echo "  docker ps"
echo "  docker run hello-world"
echo ""

echo "Quick test without re-login:"
echo "  newgrp docker  # Activates docker group for current session"
echo "  docker ps      # Should work without sudo"
echo ""

echo "Next steps:"
echo "  1. Log out and back in (or run 'newgrp docker')"
echo "  2. Test: docker run hello-world"
echo "  3. Clone framework: git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework"
echo "  4. Launch Claude Code: cd ~/ia-framework && claude"
echo ""

echo "Optional:"
echo "  • Optimize system: ./setup/linux/03-optimize-system.sh"
echo ""

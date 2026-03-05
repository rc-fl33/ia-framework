#!/bin/bash
# System Optimization Script for IA Framework (Linux)
# Optional performance optimizations for development and containers
#
# Usage: Run from Bash terminal
#   ./setup/linux/03-optimize-system.sh
#
# What this script does (all optional):
# - Increases file watch limits (for Node.js dev servers)
# - Optimizes Docker daemon settings
# - Configures swap settings for better performance
# - Sets up log rotation for containers
#
# Note: These are OPTIONAL optimizations. The framework works fine without them.

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

# Backup file with timestamp
backup_file() {
    local file=$1
    if [ -f "$file" ]; then
        local backup="${file}.backup.$(date +%Y%m%d_%H%M%S)"
        sudo cp "$file" "$backup"
        print_success "Backed up: $backup"
        return 0
    fi
    return 1
}

echo ""
print_header "======================================================"
print_header "  IA Framework - System Optimization (Linux)"
print_header "======================================================"
echo ""

print_warning "These optimizations are OPTIONAL. The framework works fine without them."
echo ""
echo "This script will:"
echo "  • Increase file watch limits (fixes 'too many files open' errors)"
echo "  • Optimize Docker daemon settings (if Docker is installed)"
echo "  • Configure swap settings for better performance"
echo "  • Set up log rotation for Docker containers"
echo ""
echo "All original files are backed up with timestamps."
echo ""

read -p "Proceed with optimizations? (Y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Nn]$ ]]; then
    echo ""
    print_warning "Optimization cancelled"
    echo ""
    exit 0
fi

echo ""

# Step 1: Increase file watch limits
print_header "Step 1: Increase File Watch Limits"
print_header "-----------------------------------"
echo ""

SYSCTL_CONF="/etc/sysctl.conf"
CURRENT_MAX_USER_WATCHES=$(sysctl -n fs.inotify.max_user_watches 2>/dev/null || echo "not set")
CURRENT_MAX_USER_INSTANCES=$(sysctl -n fs.inotify.max_user_instances 2>/dev/null || echo "not set")

print_info "Current settings:"
echo "  fs.inotify.max_user_watches = $CURRENT_MAX_USER_WATCHES"
echo "  fs.inotify.max_user_instances = $CURRENT_MAX_USER_INSTANCES"
echo ""

# Recommended values
TARGET_WATCHES=524288
TARGET_INSTANCES=512

NEEDS_UPDATE=false
if [ "$CURRENT_MAX_USER_WATCHES" != "$TARGET_WATCHES" ] || [ "$CURRENT_MAX_USER_INSTANCES" != "$TARGET_INSTANCES" ]; then
    NEEDS_UPDATE=true
fi

if [ "$NEEDS_UPDATE" = true ]; then
    print_info "Updating file watch limits..."

    # Backup sysctl.conf
    backup_file "$SYSCTL_CONF"

    # Remove old settings if they exist
    sudo sed -i '/fs.inotify.max_user_watches/d' "$SYSCTL_CONF"
    sudo sed -i '/fs.inotify.max_user_instances/d' "$SYSCTL_CONF"

    # Add new settings
    echo "fs.inotify.max_user_watches = $TARGET_WATCHES" | sudo tee -a "$SYSCTL_CONF" >/dev/null
    echo "fs.inotify.max_user_instances = $TARGET_INSTANCES" | sudo tee -a "$SYSCTL_CONF" >/dev/null

    # Apply immediately
    sudo sysctl -p >/dev/null

    print_success "File watch limits increased"
    print_info "New settings:"
    echo "  fs.inotify.max_user_watches = $(sysctl -n fs.inotify.max_user_watches)"
    echo "  fs.inotify.max_user_instances = $(sysctl -n fs.inotify.max_user_instances)"
else
    print_success "File watch limits already optimal"
fi

echo ""

# Step 2: Optimize Docker (if installed)
if command_exists docker; then
    print_header "Step 2: Optimize Docker Settings"
    print_header "---------------------------------"
    echo ""

    DOCKER_DAEMON_JSON="/etc/docker/daemon.json"

    if [ -f "$DOCKER_DAEMON_JSON" ]; then
        print_info "Docker daemon.json exists, checking configuration..."
        backup_file "$DOCKER_DAEMON_JSON"
    else
        print_info "Creating Docker daemon configuration..."
    fi

    # Create optimized daemon.json
    sudo tee "$DOCKER_DAEMON_JSON" >/dev/null <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "default-address-pools": [
    {
      "base": "172.80.0.0/16",
      "size": 24
    }
  ],
  "dns": ["8.8.8.8", "8.8.4.4"],
  "features": {
    "buildkit": true
  }
}
EOF

    print_success "Docker daemon configuration optimized"
    print_info "Changes:"
    echo "  • Log rotation: 10MB max, 3 files"
    echo "  • Storage driver: overlay2 (most efficient)"
    echo "  • DNS: Google DNS (8.8.8.8)"
    echo "  • BuildKit: enabled (faster builds)"

    # Restart Docker to apply changes
    echo ""
    print_info "Restarting Docker daemon..."
    if sudo systemctl restart docker; then
        print_success "Docker daemon restarted"
    else
        print_error "Failed to restart Docker daemon"
        print_warning "You may need to check logs: sudo journalctl -xeu docker"
    fi

    echo ""
else
    print_header "Step 2: Optimize Docker Settings"
    print_header "---------------------------------"
    echo ""
    print_info "Docker not installed, skipping Docker optimizations"
    echo ""
fi

# Step 3: Optimize swap settings
print_header "Step 3: Optimize Swap Settings"
print_header "-------------------------------"
echo ""

CURRENT_SWAPPINESS=$(sysctl -n vm.swappiness 2>/dev/null || echo "not set")
print_info "Current swappiness: $CURRENT_SWAPPINESS"

# Recommended value for development (10 = use swap less aggressively)
TARGET_SWAPPINESS=10

if [ "$CURRENT_SWAPPINESS" != "$TARGET_SWAPPINESS" ]; then
    print_info "Setting swappiness to $TARGET_SWAPPINESS (reduces swap usage)..."

    # Remove old setting
    sudo sed -i '/vm.swappiness/d' "$SYSCTL_CONF"

    # Add new setting
    echo "vm.swappiness = $TARGET_SWAPPINESS" | sudo tee -a "$SYSCTL_CONF" >/dev/null

    # Apply immediately
    sudo sysctl -p >/dev/null

    print_success "Swappiness optimized"
    print_info "New swappiness: $(sysctl -n vm.swappiness)"
    echo "  (Lower = use RAM more, swap less = better performance)"
else
    print_success "Swappiness already optimal"
fi

echo ""

# Step 4: Configure system limits
print_header "Step 4: Configure System Limits"
print_header "--------------------------------"
echo ""

LIMITS_CONF="/etc/security/limits.conf"
print_info "Checking system limits configuration..."

backup_file "$LIMITS_CONF"

# Add limits if not present
if ! grep -q "* soft nofile" "$LIMITS_CONF" 2>/dev/null; then
    echo ""
    echo "# IA Framework optimizations" | sudo tee -a "$LIMITS_CONF" >/dev/null
    echo "* soft nofile 65536" | sudo tee -a "$LIMITS_CONF" >/dev/null
    echo "* hard nofile 65536" | sudo tee -a "$LIMITS_CONF" >/dev/null
    echo "* soft nproc 65536" | sudo tee -a "$LIMITS_CONF" >/dev/null
    echo "* hard nproc 65536" | sudo tee -a "$LIMITS_CONF" >/dev/null
    print_success "System limits configured"
    print_info "Changes:"
    echo "  • Max open files: 65536"
    echo "  • Max processes: 65536"
    print_warning "You must log out and back in for these changes to take effect"
else
    print_success "System limits already configured"
fi

echo ""

# Final summary
print_header "======================================================"
print_header "  ✅ System Optimization Complete"
print_header "======================================================"
echo ""

echo "Optimizations applied:"
echo "  ✓ File watch limits increased"
if command_exists docker; then
    echo "  ✓ Docker daemon optimized"
fi
echo "  ✓ Swap settings optimized"
echo "  ✓ System limits configured"
echo ""

print_warning "IMPORTANT: Log out and back in for all changes to take effect"
echo ""

echo "Verify optimizations:"
echo "  # File watch limits"
echo "  sysctl fs.inotify.max_user_watches"
echo ""
echo "  # Swappiness"
echo "  sysctl vm.swappiness"
echo ""
if command_exists docker; then
    echo "  # Docker daemon"
    echo "  docker info | grep -i 'storage driver'"
    echo ""
fi
echo "  # System limits (after re-login)"
echo "  ulimit -n"
echo ""

echo "What these optimizations do:"
echo "  • File watches: Prevents 'too many open files' errors in dev servers"
echo "  • Docker logs: Prevents containers from filling disk with logs"
echo "  • Swappiness: Uses RAM more aggressively = faster performance"
echo "  • System limits: Allows more files/processes = better for containers"
echo ""

echo "Next steps:"
echo "  1. Log out and back in"
echo "  2. Clone framework: git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework"
echo "  3. Launch Claude Code: cd ~/ia-framework && claude"
echo ""

# Clone Framework and Launch Claude Code (Windows/WSL)
# Run this after Step 4 (prerequisites) in the setup guide
#
# Usage: Run from PowerShell
#   .\tools\setup\windows\05-clone-and-launch.ps1
#
# Or directly from GitHub:
#   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/05-clone-and-launch.ps1" -OutFile "$env:TEMP\05-clone-and-launch.ps1"; & "$env:TEMP\05-clone-and-launch.ps1"

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  Clone Framework & Launch Claude Code" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Check if framework already cloned (in WSL home)
$wslCheck = wsl bash -c "[ -d ~/ia-framework ] && echo 'exists'"

if ($wslCheck -eq "exists") {
    Write-Host "  [OK] Framework already cloned at: ~/ia-framework (in WSL)" -ForegroundColor Green
} else {
    Write-Host "  Cloning IA Framework in WSL..." -ForegroundColor Yellow
    try {
        wsl git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework
        Write-Host "  [OK] Framework cloned to ~/ia-framework" -ForegroundColor Green
    } catch {
        Write-Host "  [ERROR] Failed to clone: $_" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "  Ready to launch Claude Code" -ForegroundColor White
Write-Host ""

$confirm = Read-Host "  Launch Claude Code now? (y/n)"
if ($confirm -eq 'y' -or $confirm -eq 'Y') {
    Write-Host ""
    Write-Host "  Launching Claude Code in WSL..." -ForegroundColor Yellow

    # Launch WSL and run claude
    wsl -e bash -c "cd ~/ia-framework && claude"

    Write-Host ""
    Write-Host "  Claude Code session ended" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "  To launch manually, run in WSL:" -ForegroundColor Gray
    Write-Host "    cd ~/ia-framework" -ForegroundColor Gray
    Write-Host "    claude" -ForegroundColor Gray
}

Write-Host ""

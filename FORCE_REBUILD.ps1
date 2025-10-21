# Force complete rebuild and clear all caches

Write-Host "🔄 Forcing complete rebuild..." -ForegroundColor Cyan

# Stop any running dev servers
Write-Host "Stopping any running processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Clear node_modules cache
Write-Host "Clearing node_modules cache..." -ForegroundColor Yellow
if (Test-Path "node_modules\.vite") {
    Remove-Item -Recurse -Force "node_modules\.vite"
}

# Clear dist folder
Write-Host "Clearing dist folder..." -ForegroundColor Yellow
if (Test-Path "dist") {
    Remove-Item -Recurse -Force "dist"
}

# Clear Vite cache
Write-Host "Clearing Vite cache..." -ForegroundColor Yellow
if (Test-Path ".vite") {
    Remove-Item -Recurse -Force ".vite"
}

Write-Host "✅ Cache cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "Now run: npm run dev" -ForegroundColor Cyan
Write-Host "Then open browser in incognito mode or clear browser cache" -ForegroundColor Yellow

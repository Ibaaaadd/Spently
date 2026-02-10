# Spently Authentication - Quick Start Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 Spently Auth Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check directory
if (!(Test-Path "frontend") -or !(Test-Path "backend")) {
    Write-Host "❌ Error: Run this script from Spently root directory" -ForegroundColor Red
    exit 1
}

# Frontend Setup
Write-Host "📦 Setting up Frontend..." -ForegroundColor Yellow
Set-Location frontend

if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env created - Please add GOOGLE_CLIENT_ID" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env exists" -ForegroundColor Green
}

Set-Location ..

# Backend Setup
Write-Host ""
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Set-Location backend

if (!(Test-Path "vendor")) {
    Write-Host "Installing dependencies..." -ForegroundColor Cyan
    composer install
} else {
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

if (!(Test-Path ".env")) {
    Copy-Item ".env.example" ".env"
    php artisan key:generate
    Write-Host "✅ .env created - Please add GOOGLE_CLIENT_SECRET" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "Running migrations..." -ForegroundColor Cyan
php artisan migrate

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Setup Google OAuth (REQUIRED):" -ForegroundColor Yellow
Write-Host "   - Read GOOGLE_OAUTH_SETUP.md" -ForegroundColor Gray
Write-Host "   - Get Client ID & Secret from Google Console" -ForegroundColor Gray
Write-Host "   - Update backend/.env: GOOGLE_CLIENT_SECRET" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start servers:" -ForegroundColor White
Write-Host "   Backend:  cd backend && php artisan serve" -ForegroundColor Gray
Write-Host "   Frontend: cd frontend && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open: http://localhost:5173/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green

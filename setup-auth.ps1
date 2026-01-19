# Spently Authentication - Quick Start Script
# Run this script to setup authentication system

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 Spently Auth Setup Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (!(Test-Path "frontend") -or !(Test-Path "backend")) {
    Write-Host "❌ Error: Please run this script from the Spently root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Setting up Frontend..." -ForegroundColor Yellow
Write-Host ""

# Frontend Setup
Set-Location frontend

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Cyan
    npm install
} else {
    Write-Host "✅ Frontend dependencies already installed" -ForegroundColor Green
}

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "Creating frontend .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host "⚠️  Please edit frontend/.env and add your VITE_GOOGLE_CLIENT_ID" -ForegroundColor Yellow
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Set-Location ..

Write-Host ""
Write-Host "📦 Setting up Backend..." -ForegroundColor Yellow
Write-Host ""

# Backend Setup
Set-Location backend

# Check if vendor exists
if (!(Test-Path "vendor")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Cyan
    composer install
} else {
    Write-Host "✅ Backend dependencies already installed" -ForegroundColor Green
}

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "Creating backend .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host "Generating application key..." -ForegroundColor Cyan
    php artisan key:generate
}

# Run migrations
Write-Host ""
Write-Host "Running database migrations..." -ForegroundColor Cyan
php artisan migrate

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Backend Server:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   php artisan serve" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start Frontend Dev Server (in new terminal):" -ForegroundColor White
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open browser and go to:" -ForegroundColor White
Write-Host "   http://localhost:5173/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "4. (Optional) Setup Google OAuth:" -ForegroundColor White
Write-Host "   - Get Client ID from Google Cloud Console" -ForegroundColor Gray
Write-Host "   - Edit frontend/.env: VITE_GOOGLE_CLIENT_ID" -ForegroundColor Gray
Write-Host "   - Edit backend/.env: GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - AUTH_README.md - Quick start guide" -ForegroundColor Gray
Write-Host "   - frontend/AUTH_SETUP.md - Detailed setup" -ForegroundColor Gray
Write-Host "   - auth-preview.html - UI Preview" -ForegroundColor Gray
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green

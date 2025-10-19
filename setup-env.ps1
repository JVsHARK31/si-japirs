# Si-JAPIRS Environment Setup Script for Windows PowerShell
# Usage: .\setup-env.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Si-JAPIRS Environment Setup" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan

# Check if .env.local exists
$envFile = ".env.local"
$productionFile = ".env.production"

if (Test-Path $envFile) {
    Write-Host "[!] .env.local already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to backup existing file? (y/n)"
    
    if ($response -eq 'y') {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupFile = ".env.local.backup_$timestamp"
        Copy-Item $envFile $backupFile
        Write-Host "[✓] Backup created: $backupFile" -ForegroundColor Green
    }
}

# Copy production env to local
Write-Host "[*] Setting up environment variables..." -ForegroundColor Cyan
Copy-Item $productionFile $envFile -Force
Write-Host "[✓] Environment file created from production template" -ForegroundColor Green

# Generate new NEXTAUTH_SECRET
Write-Host "[*] Generating new NEXTAUTH_SECRET..." -ForegroundColor Cyan
$bytes = New-Object byte[] 32
[Security.Cryptography.RNGCryptoServiceProvider]::Create().GetBytes($bytes)
$secret = [Convert]::ToBase64String($bytes)

# Update NEXTAUTH_SECRET in .env.local
$content = Get-Content $envFile
$content = $content -replace 'NEXTAUTH_SECRET=.*', "NEXTAUTH_SECRET=$secret"
Set-Content $envFile $content
Write-Host "[✓] New NEXTAUTH_SECRET generated and saved" -ForegroundColor Green

# Ask for domain update
Write-Host ""
Write-Host "[?] Enter your production domain (or press Enter to keep default):" -ForegroundColor Yellow
Write-Host "    Current: https://si-japirs.vercel.app" -ForegroundColor Gray
$domain = Read-Host "    New domain"

if ($domain -ne "") {
    $content = Get-Content $envFile
    $content = $content -replace 'NEXTAUTH_URL=.*', "NEXTAUTH_URL=$domain"
    Set-Content $envFile $content
    Write-Host "[✓] Domain updated to: $domain" -ForegroundColor Green
}

# Ask for database password
Write-Host ""
Write-Host "[?] Enter your Supabase database password:" -ForegroundColor Yellow
Write-Host "    (or press Enter to update manually later)" -ForegroundColor Gray
$dbPassword = Read-Host -AsSecureString "    Password"

if ($dbPassword.Length -gt 0) {
    $dbPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($dbPassword))
    $content = Get-Content $envFile
    $content = $content -replace 'postgresql://postgres:password@', "postgresql://postgres:$dbPasswordPlain@"
    Set-Content $envFile $content
    Write-Host "[✓] Database password updated" -ForegroundColor Green
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review .env.local file" -ForegroundColor White
Write-Host "2. Update any remaining placeholders" -ForegroundColor White
Write-Host "3. Add Google OAuth redirect URLs in Google Console" -ForegroundColor White
Write-Host "4. Run: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "For deployment:" -ForegroundColor Yellow
Write-Host "- Copy content from .env.local" -ForegroundColor White
Write-Host "- Import to your hosting platform" -ForegroundColor White
Write-Host ""

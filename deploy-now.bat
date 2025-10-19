@echo off
echo ====================================================
echo       DEPLOY SI-JAPIRS TO VERCEL - AUTO SCRIPT
echo ====================================================
echo.

echo [STEP 1] Checking Vercel CLI...
vercel --version
if errorlevel 1 (
    echo [ERROR] Vercel CLI not installed!
    echo Installing Vercel CLI...
    npm install -g vercel
)
echo.

echo [STEP 2] Checking login status...
vercel whoami 2>nul
if errorlevel 1 (
    echo [!] You need to login to Vercel first!
    echo.
    echo Opening browser for authentication...
    vercel login
    echo.
    echo After login successful, run this script again.
    pause
    exit /b
)

echo [STEP 3] Current directory:
cd
echo.

echo [STEP 4] Starting deployment...
echo.
echo IMPORTANT: Answer the prompts as follows:
echo - Set up and deploy? = Y
echo - Which scope? = Select your account
echo - Link to existing? = N
echo - Project name? = si-japirs  
echo - Directory? = ./
echo - Override settings? = N
echo.
pause
echo.

echo Deploying...
vercel

echo.
echo [STEP 5] Deploy to production...
vercel --prod

echo.
echo ====================================================
echo       DEPLOYMENT COMPLETE!
echo ====================================================
echo.
echo Your site should be live at:
echo https://si-japirs.vercel.app
echo.
echo If not working:
echo 1. Check Vercel Dashboard: https://vercel.com/dashboard
echo 2. Verify environment variables are set
echo 3. Check build logs for errors
echo.
pause

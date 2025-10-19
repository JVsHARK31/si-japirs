# 🚀 Si-JAPIRS Deployment Guide

## 📁 Environment Variable Files

### Files Available:
1. **`.env.local`** - Your current local environment (DO NOT SHARE)
2. **`.env.example`** - Template with placeholders
3. **`.env.production`** - Ready-to-use production values

---

## 🔧 Quick Deploy to Vercel

### Method 1: Import .env File (FASTEST)
1. Go to: https://vercel.com/new
2. Import your GitHub repository: `JVsHARK31/si-japirs`
3. In Environment Variables section:
   - Click **"Import .env"** button
   - Copy ALL content from `.env.production` file
   - Paste into the import field
   - Click Import
4. **IMPORTANT**: Update `NEXTAUTH_URL` to your actual domain:
   ```
   NEXTAUTH_URL=https://[your-project-name].vercel.app
   ```
5. Click Deploy

### Method 2: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy with env file
vercel --env-file=.env.production

# Or link existing project
vercel link
vercel env pull .env.production
vercel --prod
```

---

## 🔧 Quick Deploy to Netlify

### Method 1: Import in UI
1. Go to: https://app.netlify.com/start
2. Connect GitHub repository
3. Go to Site Settings → Environment Variables
4. Click "Import from .env file"
5. Copy content from `.env.production`
6. Update `NEXTAUTH_URL` to:
   ```
   NEXTAUTH_URL=https://[your-site-name].netlify.app
   ```
7. Deploy

### Method 2: Using netlify.toml
Create `netlify.toml` in root:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  # Copy all variables from .env.production here
```

---

## 🔧 Quick Deploy to Railway

### Import Method:
1. Go to: https://railway.app
2. New Project → Deploy from GitHub
3. Select repository
4. Go to Variables tab
5. Click "Raw Editor"
6. Paste entire `.env.production` content
7. Update `NEXTAUTH_URL`
8. Deploy

---

## 🔧 Deploy to Render

### Import Method:
1. Go to: https://render.com
2. New → Web Service
3. Connect repository
4. Environment → Add from .env
5. Paste `.env.production` content
6. Update URLs
7. Deploy

---

## ⚠️ IMPORTANT CHECKLIST

### Before Deploying:

#### 1. Update Domain URLs
```env
# Change this to your actual domain
NEXTAUTH_URL=https://your-actual-domain.com
```

#### 2. Generate New Secret (CRITICAL!)
```bash
# Generate new NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

#### 3. Update Google OAuth Redirect URLs
Go to: https://console.cloud.google.com/apis/credentials
Add your production URL:
```
https://your-domain.com/api/auth/callback/google
```

#### 4. Update Supabase Database Password
Replace `password` in DATABASE_URL with your actual Supabase password

---

## 📋 Copy-Paste Ready Environment Variables

### For Vercel/Netlify Import:
```env
NEXTAUTH_URL=https://si-japirs.vercel.app
NEXTAUTH_SECRET=[GENERATE_NEW_SECRET_HERE]
GOOGLE_CLIENT_ID=[YOUR_GOOGLE_CLIENT_ID]
GOOGLE_CLIENT_SECRET=[YOUR_GOOGLE_CLIENT_SECRET]
DATABASE_URL=postgresql://postgres:password@db.jlmwduhvglbjktllcpvn.supabase.co:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://jlmwduhvglbjktllcpvn.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbXdkdWh2Z2xiamt0bGxjcHZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3ODI3NTksImV4cCI6MjA3NjM1ODc1OX0.qGFjdH6ZykLUSng6_PbxrYXi6cfKmBUbfcKn4FXHcuc
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsbXdkdWh2Z2xiamt0bGxjcHZuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDc4Mjc1OSwiZXhwIjoyMDc2MzU4NzU5fQ.Qz93Ij_1trZhzyfStLbxx_Y4nWqQyzG3yX6PNfRCKPY
GPT_API_KEY=sk-YjXePMaYR1aP2xhXOxVCgg
GPT_API_URL=https://ai.sumopod.com/v1
GPT_MODEL=gpt-4.1-nano
SCHOLAR_API_KEY=2a638fdc13bac43fb3fbd78db61e72d41c7b04857d561a6e5f9098a8a13b9e7e
SCHOLAR_API_URL=https://serpapi.com/search
FILE_MAX_MB=30
```

---

## 🎯 Quick Deploy Links

### One-Click Deploy Buttons:

#### Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JVsHARK31/si-japirs&env=NEXTAUTH_URL,NEXTAUTH_SECRET,GOOGLE_CLIENT_ID,GOOGLE_CLIENT_SECRET,DATABASE_URL,NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,GPT_API_KEY,GPT_API_URL,GPT_MODEL,SCHOLAR_API_KEY,SCHOLAR_API_URL)

#### Deploy to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/JVsHARK31/si-japirs)

#### Deploy to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/si-japirs)

---

## 🔍 Verify Deployment

After deployment, check:
1. ✅ Homepage loads: https://your-domain.com
2. ✅ Login works: https://your-domain.com/auth/sign-in
3. ✅ Google OAuth redirects properly
4. ✅ Dashboard accessible after login
5. ✅ AI features working

---

## 🆘 Troubleshooting

### "Invalid redirect_uri" Error
- Add your production URL to Google Console OAuth settings

### "Database connection failed"
- Check DATABASE_URL format
- Verify Supabase password is correct

### "NEXTAUTH_SECRET missing"
- Generate new secret and add to environment

### "API calls failing"
- Verify all API keys are set correctly
- Check API rate limits

---

## 📞 Support

- GitHub Issues: https://github.com/JVsHARK31/si-japirs/issues
- Documentation: Check README.md
- Environment Issues: Verify all variables in `.env.production`

---

**Ready to Deploy! Just copy `.env.production` content and import to your hosting platform!** 🚀

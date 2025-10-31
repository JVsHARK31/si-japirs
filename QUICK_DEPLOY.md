# 🚀 QUICK DEPLOYMENT GUIDE - Si-JAPIRS

## 📋 Copy-Paste Environment Variables

Copy all these variables and paste into Netlify/Vercel environment settings:

```env
# See NETLIFY_ENV_VARS.txt file for actual values (DO NOT COMMIT)
DATABASE_URL=[Your Database URL - check NETLIFY_ENV_VARS.txt]
NEXTAUTH_URL=CHANGE_TO_YOUR_DEPLOYMENT_URL
NEXTAUTH_SECRET=[Your NextAuth Secret - check NETLIFY_ENV_VARS.txt]
GOOGLE_CLIENT_ID=[Your Google Client ID - check NETLIFY_ENV_VARS.txt]
GOOGLE_CLIENT_SECRET=[Your Google Secret - check NETLIFY_ENV_VARS.txt]
DISCORD_CLIENT_ID=[Your Discord Client ID - check NETLIFY_ENV_VARS.txt]
DISCORD_CLIENT_SECRET=[Your Discord Secret - check NETLIFY_ENV_VARS.txt]
NEXT_PUBLIC_SUPABASE_URL=https://dvofigdahianevlsafpy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2b2ZpZ2RhaGlhbmV2bHNhZnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTk3NjEsImV4cCI6MjA3NzQ3NTc2MX0.XGm24HVzGs8IyZflN7uJ6OR0c9bRuUORyUi02eTgWHs
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2b2ZpZ2RhaGlhbmV2bHNhZnB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg5OTc2MSwiZXhwIjoyMDc3NDc1NzYxfQ.jZzrK0q477bCzeR371rDegQXzKENDui-Qh3FZSQWawU
OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
OPENAI_API_BASE=https://api.chatanywhere.tech/v1
NEXT_PUBLIC_OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
NEXT_PUBLIC_OPENAI_API_BASE=https://api.chatanywhere.tech/v1
SCHOLAR_API_KEY=2a638fdc13bac43fb3fbd78db61e72d41c7b04857d561a6e5f9098a8a13b9e7e
SCHOLAR_API_URL=https://serpapi.com/search
FILE_MAX_MB=30
```

## 🚀 Deploy to Netlify (5 Minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy Si-JAPIRS"
git push
```

### Step 2: Deploy
1. Go to: https://app.netlify.com/start
2. Click "Import from Git" → Choose your repository
3. Build settings (auto-detected):
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Click "Show advanced" → Add the environment variables above
5. **IMPORTANT**: Change `NEXTAUTH_URL` to `https://YOUR-SITE.netlify.app`
6. Click "Deploy site"

### Step 3: After Deploy
1. Copy your site URL (e.g., `amazing-site-123.netlify.app`)
2. Go to Settings → Environment variables
3. Update `NEXTAUTH_URL` with your actual URL
4. Trigger redeploy

## 🚀 Deploy to Vercel (3 Minutes)

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Deploy Si-JAPIRS"
git push
```

### Step 2: Deploy
1. Go to: https://vercel.com/new
2. Import your GitHub repository
3. Add environment variables (paste all from above)
4. **IMPORTANT**: Change `NEXTAUTH_URL` to `https://YOUR-PROJECT.vercel.app`
5. Click "Deploy"

### Step 3: After Deploy
1. Copy your deployment URL
2. Go to Settings → Environment Variables
3. Update `NEXTAUTH_URL` with actual URL
4. Redeploy

## ⚠️ IMPORTANT: Update OAuth Redirects

### Google OAuth
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Add these Authorized redirect URIs:
   - For Netlify: `https://YOUR-SITE.netlify.app/api/auth/callback/google`
   - For Vercel: `https://YOUR-PROJECT.vercel.app/api/auth/callback/google`

### Discord OAuth
1. Go to: https://discord.com/developers/applications/1433743928795861053/oauth2
2. Add these Redirects:
   - For Netlify: `https://YOUR-SITE.netlify.app/api/auth/callback/discord`
   - For Vercel: `https://YOUR-PROJECT.vercel.app/api/auth/callback/discord`

## ✅ Test Your Deployment

1. Visit your deployed site
2. Click "Sign In"
3. Test:
   - ✅ Google Sign In
   - ✅ Discord Sign In
   - ✅ Email Sign In (if using)

## 🔧 Troubleshooting

### If OAuth doesn't work:
1. Check NEXTAUTH_URL is correct
2. Verify redirect URLs are added
3. Clear browser cookies
4. Check console for errors

### If build fails:
1. Check all environment variables are added
2. Make sure Node version is 20
3. Check build logs for specific errors

## 📱 Your Apps Will Be Live At:

- **Netlify**: `https://[your-chosen-name].netlify.app`
- **Vercel**: `https://[your-project-name].vercel.app`

## 🎉 That's It!

Your Si-JAPIRS app with Google & Discord authentication is now live!

---

**Need help?** Check the detailed guides:
- DEPLOY_TO_NETLIFY.md
- DEPLOY_TO_VERCEL.md

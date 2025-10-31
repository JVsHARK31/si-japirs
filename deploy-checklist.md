# ✅ Deployment Checklist for Si-JAPIRS

## Pre-Deployment Checklist

### 1. Code Preparation
- [x] All code committed to Git
- [x] Authentication system configured
- [x] Environment variables prepared
- [x] Build configuration files ready (netlify.toml, vercel.json)
- [x] No console errors in development

### 2. Environment Variables Ready
- [x] DATABASE_URL configured
- [x] NEXTAUTH_URL (update after deployment)
- [x] NEXTAUTH_SECRET set
- [x] Google OAuth credentials
- [x] Discord OAuth credentials
- [x] Supabase credentials
- [x] AI API keys

### 3. OAuth Configuration
- [ ] Google OAuth redirect URLs will be updated after deployment
- [ ] Discord OAuth redirect URLs will be updated after deployment
- [ ] Supabase OAuth settings configured

## Deployment Commands

### For Netlify

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy Si-JAPIRS to Netlify"
git push

# 2. Using Netlify CLI (if installed)
netlify deploy --prod

# 3. Or deploy via dashboard
# https://app.netlify.com/start
```

### For Vercel

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy Si-JAPIRS to Vercel"
git push

# 2. Using Vercel CLI (if installed)
vercel --prod

# 3. Or deploy via dashboard
# https://vercel.com/new
```

## Post-Deployment Steps

### 1. Update NEXTAUTH_URL
- [ ] Netlify: Update to `https://YOUR-SITE.netlify.app`
- [ ] Vercel: Update to `https://YOUR-PROJECT.vercel.app`

### 2. Update OAuth Redirect URLs

#### Google Cloud Console
Add these URLs:
- `https://YOUR-SITE.netlify.app/api/auth/callback/google`
- `https://YOUR-PROJECT.vercel.app/api/auth/callback/google`

#### Discord Developer Portal
Add these URLs:
- `https://YOUR-SITE.netlify.app/api/auth/callback/discord`
- `https://YOUR-PROJECT.vercel.app/api/auth/callback/discord`

### 3. Test Authentication
- [ ] Test Google sign-in
- [ ] Test Discord sign-in
- [ ] Test email sign-in
- [ ] Test protected routes

### 4. Verify Features
- [ ] Homepage loads correctly
- [ ] Sign-in page works
- [ ] Dashboard accessible after login
- [ ] AI features functional
- [ ] Mobile responsive

## Deployment URLs

After deployment, your app will be available at:

### Netlify
- Main URL: `https://[your-site-name].netlify.app`
- Preview deploys: `https://deploy-preview-[number]--[your-site-name].netlify.app`

### Vercel
- Main URL: `https://[your-project-name].vercel.app`
- Preview deploys: `https://[your-project-name]-[hash].vercel.app`

## Environment Variables Quick Copy

Copy and paste these into your deployment platform:

```env
DATABASE_URL=[Your Database URL from .env.local]
NEXTAUTH_URL=UPDATE_WITH_YOUR_DEPLOYMENT_URL
NEXTAUTH_SECRET=[Your NextAuth Secret from .env.local]
GOOGLE_CLIENT_ID=[Your Google Client ID from .env.local]
GOOGLE_CLIENT_SECRET=[Your Google Client Secret from .env.local]
DISCORD_CLIENT_ID=[Your Discord Client ID from .env.local]
DISCORD_CLIENT_SECRET=[Your Discord Client Secret from .env.local]
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

## Troubleshooting

### Build Errors
- Check Node.js version (should be 20)
- Verify all dependencies installed
- Check for TypeScript errors

### Authentication Issues
- Verify NEXTAUTH_URL matches deployment URL
- Check OAuth redirect URLs updated
- Clear cookies and cache

### Database Issues
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Test connection from local first

## Success Indicators

✅ **Deployment Successful When:**
- Build completes without errors
- Site loads at deployment URL
- Authentication works
- All pages accessible
- No console errors

## Support Contacts

- **Netlify Support**: https://www.netlify.com/support/
- **Vercel Support**: https://vercel.com/support
- **Supabase Support**: https://supabase.com/support

---

🚀 **Ready to Deploy!** Follow the guides in DEPLOY_TO_NETLIFY.md or DEPLOY_TO_VERCEL.md

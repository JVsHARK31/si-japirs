# 🚀 Deploy Si-JAPIRS to Netlify

## Step 1: Prepare for Deployment

### Prerequisites
- GitHub account
- Netlify account (sign up at https://www.netlify.com)
- Your code pushed to a GitHub repository

## Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial deployment of Si-JAPIRS with OAuth authentication"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/si-japirs.git

# Push to GitHub
git push -u origin master
```

## Step 3: Deploy on Netlify

### Option A: Deploy via Netlify Dashboard

1. **Login to Netlify**
   - Go to https://app.netlify.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select your `si-japirs` repository

3. **Configure Build Settings**
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 20

4. **Add Environment Variables**
   Click "Show advanced" → "New variable" and add each of these:

   ```env
   DATABASE_URL=postgresql://postgres:athallah310706@db.dvofigdahianevlsafpy.supabase.co:5432/postgres
   NEXTAUTH_URL=https://YOUR-SITE-NAME.netlify.app
   NEXTAUTH_SECRET=DuVDHFQ375nlR6lera4fcydqh27NpU1A10Nx8NsEC7Y=
   
   # Google OAuth
   GOOGLE_CLIENT_ID=[Your Google Client ID from .env.local]
   GOOGLE_CLIENT_SECRET=[Your Google Client Secret from .env.local]
   
   # Discord OAuth
   DISCORD_CLIENT_ID=1433743928795861053
   DISCORD_CLIENT_SECRET=2TJj8wbaD5NTcZP5I1L5hwhjNFBlxSEj
   
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://dvofigdahianevlsafpy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2b2ZpZ2RhaGlhbmV2bHNhZnB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4OTk3NjEsImV4cCI6MjA3NzQ3NTc2MX0.XGm24HVzGs8IyZflN7uJ6OR0c9bRuUORyUi02eTgWHs
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2b2ZpZ2RhaGlhbmV2bHNhZnB5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTg5OTc2MSwiZXhwIjoyMDc3NDc1NzYxfQ.jZzrK0q477bCzeR371rDegQXzKENDui-Qh3FZSQWawU
   
   # AI APIs
   OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
   OPENAI_API_BASE=https://api.chatanywhere.tech/v1
   NEXT_PUBLIC_OPENAI_API_KEY=sk-POcyyRhXrzVwwPedbzrHqfQgNNqslFSXTcgR3KEakZpdzzte
   NEXT_PUBLIC_OPENAI_API_BASE=https://api.chatanywhere.tech/v1
   
   # Scholar API
   SCHOLAR_API_KEY=2a638fdc13bac43fb3fbd78db61e72d41c7b04857d561a6e5f9098a8a13b9e7e
   SCHOLAR_API_URL=https://serpapi.com/search
   
   # File Upload
   FILE_MAX_MB=30
   ```

5. **Deploy Site**
   - Click "Deploy site"
   - Wait for deployment to complete (3-5 minutes)

### Option B: Deploy via Netlify CLI

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Project**
   ```bash
   netlify init
   ```

4. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Step 4: Update OAuth Redirect URLs

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add to Authorized redirect URIs:
   - `https://YOUR-SITE-NAME.netlify.app/api/auth/callback/google`
   - `https://YOUR-SITE-NAME.netlify.app/auth/callback`

### Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 settings
4. Add to Redirects:
   - `https://YOUR-SITE-NAME.netlify.app/api/auth/callback/discord`
   - `https://YOUR-SITE-NAME.netlify.app/auth/callback`

## Step 5: Update NEXTAUTH_URL

1. Go to Netlify Dashboard → Site settings → Environment variables
2. Update `NEXTAUTH_URL` to your actual Netlify URL:
   ```
   NEXTAUTH_URL=https://YOUR-SITE-NAME.netlify.app
   ```
3. Trigger a redeploy: Deploy → Trigger deploy → Clear cache and deploy site

## Step 6: Test Your Deployment

1. Visit your site: `https://YOUR-SITE-NAME.netlify.app`
2. Test sign in with:
   - Google OAuth
   - Discord OAuth
   - Email/Password

## Common Issues & Solutions

### Build Failed
- Check Node version is set to 20
- Verify all environment variables are set
- Check build logs for specific errors

### OAuth Not Working
- Verify redirect URLs are updated
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies and try again

### Database Connection Error
- Verify DATABASE_URL is correct
- Check Supabase project is active
- Ensure connection pooling is enabled

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Add custom domain
3. Update DNS records
4. Update NEXTAUTH_URL to new domain
5. Update OAuth redirect URLs

## Performance Optimization

Netlify automatically provides:
- ✅ CDN distribution
- ✅ SSL certificate
- ✅ Automatic HTTPS
- ✅ Brotli compression
- ✅ Edge functions
- ✅ Preview deployments

## Monitoring

1. **Analytics**: Site settings → Analytics
2. **Functions**: Functions tab for API logs
3. **Build logs**: Deploys tab
4. **Form submissions**: Forms tab

## Support

- Netlify Status: https://www.netlifystatus.com/
- Netlify Support: https://www.netlify.com/support/
- Documentation: https://docs.netlify.com/

---

🎉 **Your Si-JAPIRS app is now live on Netlify!**

# 🚀 Deploy Si-JAPIRS to Vercel

## Step 1: Prepare for Deployment

### Prerequisites
- GitHub account
- Vercel account (sign up at https://vercel.com)
- Your code pushed to a GitHub repository

## Step 2: Push to GitHub

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Deploy Si-JAPIRS with OAuth authentication to Vercel"

# Add your GitHub repository as origin
git remote add origin https://github.com/YOUR_USERNAME/si-japirs.git

# Push to GitHub
git push -u origin master
```

## Step 3: Deploy on Vercel

### Option A: Deploy via Vercel Dashboard

1. **Login to Vercel**
   - Go to https://vercel.com
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import Git Repository
   - Select your `si-japirs` repository

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Add Environment Variables**
   Click "Environment Variables" and add:

   ```env
   DATABASE_URL=postgresql://postgres:athallah310706@db.dvofigdahianevlsafpy.supabase.co:5432/postgres
   NEXTAUTH_URL=https://YOUR-PROJECT-NAME.vercel.app
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

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

4. **Set Environment Variables**
   ```bash
   # Use the Vercel dashboard or CLI to set each variable
   vercel env add DATABASE_URL production
   vercel env add NEXTAUTH_URL production
   # ... add all other variables
   ```

## Step 4: Update OAuth Redirect URLs

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Select your OAuth 2.0 Client ID
3. Add to Authorized redirect URIs:
   - `https://YOUR-PROJECT-NAME.vercel.app/api/auth/callback/google`
   - `https://YOUR-PROJECT-NAME.vercel.app/auth/callback`
   - `https://dvofigdahianevlsafpy.supabase.co/auth/v1/callback`

### Discord OAuth
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Select your application
3. Go to OAuth2 settings
4. Add to Redirects:
   - `https://YOUR-PROJECT-NAME.vercel.app/api/auth/callback/discord`
   - `https://YOUR-PROJECT-NAME.vercel.app/auth/callback`
   - `https://dvofigdahianevlsafpy.supabase.co/auth/v1/callback`

## Step 5: Update NEXTAUTH_URL

1. Go to Vercel Dashboard → Settings → Environment Variables
2. Edit `NEXTAUTH_URL`:
   ```
   NEXTAUTH_URL=https://YOUR-PROJECT-NAME.vercel.app
   ```
3. Redeploy: Deployments → Three dots → Redeploy

## Step 6: Test Your Deployment

1. Visit: `https://YOUR-PROJECT-NAME.vercel.app`
2. Test authentication:
   - Sign in with Google
   - Sign in with Discord
   - Sign in with Email
3. Test protected routes:
   - `/dashboard`
   - `/exercises`
   - `/consult`

## Vercel Features

### Automatic Features
- ✅ **Edge Functions**: Serverless functions at edge locations
- ✅ **Analytics**: Built-in Web Vitals
- ✅ **Preview Deployments**: Automatic PR previews
- ✅ **SSL Certificate**: Automatic HTTPS
- ✅ **Global CDN**: 100+ edge locations
- ✅ **DDoS Protection**: Enterprise-grade protection
- ✅ **Image Optimization**: Automatic Next.js image optimization

### Performance Monitoring
1. **Analytics**: Project Dashboard → Analytics
2. **Web Vitals**: Real user monitoring
3. **Function Logs**: Functions tab
4. **Build Logs**: Deployments → View build logs

## Custom Domain (Optional)

1. **Add Domain**
   - Settings → Domains
   - Add your domain
   - Configure DNS:
     ```
     Type: A
     Name: @
     Value: 76.76.21.21
     
     Type: CNAME
     Name: www
     Value: cname.vercel-dns.com
     ```

2. **Update Environment**
   - Update `NEXTAUTH_URL` to your custom domain
   - Update OAuth redirect URLs

## Deployment Optimization

### Build Optimization
```json
// vercel.json optimizations
{
  "functions": {
    "app/api/**/*": {
      "maxDuration": 30,
      "memory": 1024
    }
  },
  "regions": ["sin1", "hnd1", "iad1"]
}
```

### Environment-Based Deployment
- **Production**: Main branch
- **Preview**: Feature branches
- **Development**: Local only

## Troubleshooting

### Common Issues

1. **Build Failed**
   ```bash
   # Clear cache and rebuild
   vercel --force
   ```

2. **Environment Variables Not Working**
   - Ensure variables are set for correct environment
   - Redeploy after adding variables
   - Check for typos in variable names

3. **OAuth Redirect Error**
   - Verify all redirect URLs are added
   - Check NEXTAUTH_URL matches deployment URL
   - Clear cookies and try again

4. **Database Connection Issues**
   - Check DATABASE_URL format
   - Verify Supabase project is active
   - Enable connection pooling

## Monitoring & Logs

1. **Function Logs**
   ```bash
   vercel logs
   ```

2. **Build Logs**
   ```bash
   vercel inspect [deployment-url]
   ```

3. **Real-time Logs**
   - Dashboard → Functions → View logs

## CI/CD Integration

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID}}
          vercel-project-id: ${{ secrets.PROJECT_ID}}
          vercel-args: '--prod'
```

## Support Resources

- **Vercel Status**: https://www.vercel-status.com/
- **Documentation**: https://vercel.com/docs
- **Community**: https://github.com/vercel/next.js/discussions
- **Support**: https://vercel.com/support

---

🎉 **Your Si-JAPIRS app is now live on Vercel!**

### Quick Links
- **Live Site**: https://YOUR-PROJECT-NAME.vercel.app
- **Dashboard**: https://vercel.com/dashboard
- **Analytics**: https://vercel.com/analytics

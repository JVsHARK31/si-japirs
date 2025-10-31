# 🚀 NETLIFY DEPLOYMENT - QUICK STEPS

## ✅ Step 1: GitHub Push Complete!
Your code has been successfully pushed to GitHub.

## 📝 Step 2: Deploy to Netlify

### Go to Netlify:
1. Open: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **"Deploy with GitHub"**
4. Select your repository: **si-japirs**

## ⚙️ Step 3: Configure Build Settings

Use these settings:
- **Base directory**: Leave empty
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20 (will be auto-detected)

## 🔑 Step 4: Add Environment Variables

Click "Show advanced" before deploying and add ALL variables from the file:
**NETLIFY_ENV_VARS.txt**

⚠️ **IMPORTANT**: 
1. Copy ALL variables from NETLIFY_ENV_VARS.txt
2. Change `NEXTAUTH_URL` from `https://YOUR-SITE-NAME.netlify.app` to your actual Netlify URL (you'll get this after first deployment)

## 🚀 Step 5: Deploy

Click **"Deploy site"** and wait 3-5 minutes for deployment.

## 🔗 Step 6: Get Your Site URL

After deployment:
1. Copy your site URL (e.g., `amazing-site-123.netlify.app`)
2. Go to **Site settings** → **Environment variables**
3. Update `NEXTAUTH_URL` to your actual URL
4. Trigger redeploy: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**

## 🔐 Step 7: Update OAuth Redirects

### For Google:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. Add Authorized redirect URI:
   - `https://YOUR-SITE.netlify.app/api/auth/callback/google`

### For Discord:
1. Go to: https://discord.com/developers/applications/1433743928795861053/oauth2
2. Add Redirect:
   - `https://YOUR-SITE.netlify.app/api/auth/callback/discord`

## ✅ Step 8: Test Your Site

Visit your site and test:
- [ ] Homepage loads
- [ ] Sign in with Google works
- [ ] Sign in with Discord works
- [ ] Dashboard accessible after login

## 🎉 Deployment Complete!

Your Si-JAPIRS app is now live on Netlify!

---

## 🆘 Troubleshooting

### If OAuth doesn't work:
1. Check NEXTAUTH_URL matches your Netlify URL exactly
2. Verify redirect URLs are added in Google/Discord
3. Clear browser cookies and try again

### If build fails:
1. Check build logs in Netlify dashboard
2. Verify all environment variables are set
3. Make sure Node version is set to 20

---

## 📋 Quick Reference

- **Netlify Dashboard**: https://app.netlify.com
- **Your Repository**: https://github.com/JVsHARK31/si-japirs
- **Environment Variables**: Check NETLIFY_ENV_VARS.txt file

# 📥 Environment Variables Import Guide for Si-JAPIRS

## 🚀 Quick Import Files Available

### 📁 Files for Import:
| File | Purpose | Format | Safe to Share? |
|------|---------|--------|----------------|
| `.env.production` | Production-ready values | ENV | ❌ No (contains secrets) |
| `.env.example` | Template with placeholders | ENV | ✅ Yes |
| `env-export.json` | JSON format for platforms | JSON | ❌ No (contains secrets) |
| `.env.local` | Your local environment | ENV | ❌ Never share |

---

## 🎯 One-Click Import Instructions

### 1️⃣ **Vercel** (Easiest)

#### Method A: Direct Import
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Click **"Import .env"** button
5. Open `.env.production` file
6. Copy ALL content (Ctrl+A, Ctrl+C)
7. Paste in Vercel import field
8. Click Import
9. Change `NEXTAUTH_URL` to your Vercel URL

#### Method B: Bulk Add
```bash
# Copy this entire block and paste in Vercel:

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

### 2️⃣ **Netlify**

1. Site Settings → Environment Variables
2. Click "Import variables"
3. Select ".env file" format
4. Copy content from `.env.production`
5. Paste and import
6. Update `NEXTAUTH_URL` to your Netlify URL

---

### 3️⃣ **Railway**

1. Go to Variables tab
2. Click "Raw Editor" mode
3. Copy entire `.env.production` content
4. Paste and save
5. Update `NEXTAUTH_URL`

---

### 4️⃣ **Render**

1. Environment → Secret Files
2. Add `.env` file
3. Copy `.env.production` content
4. Save

---

## ⚙️ Automatic Setup Script (Windows)

Run this PowerShell script to set up environment:
```powershell
# Run in project directory
.\setup-env.ps1
```

This script will:
- ✅ Create .env.local from template
- ✅ Generate new NEXTAUTH_SECRET
- ✅ Prompt for your domain
- ✅ Prompt for database password

---

## 📋 Manual Copy-Paste Values

If import doesn't work, add these one by one:

| Key | Value |
|-----|-------|
| `NEXTAUTH_URL` | `https://your-domain.com` |
| `NEXTAUTH_SECRET` | Generate new! |
| `GOOGLE_CLIENT_ID` | `[YOUR_GOOGLE_CLIENT_ID]` |
| `GOOGLE_CLIENT_SECRET` | `[YOUR_GOOGLE_CLIENT_SECRET]` |
| `DATABASE_URL` | Update password! |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://jlmwduhvglbjktllcpvn.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbG...` (long key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbG...` (long key) |
| `GPT_API_KEY` | `sk-YjXePMaYR1aP2xhXOxVCgg` |
| `GPT_API_URL` | `https://ai.sumopod.com/v1` |
| `GPT_MODEL` | `gpt-4.1-nano` |
| `SCHOLAR_API_KEY` | `2a638fdc...` (long key) |
| `SCHOLAR_API_URL` | `https://serpapi.com/search` |
| `FILE_MAX_MB` | `30` |

---

## ⚠️ IMPORTANT REMINDERS

### Before Deploying:
1. **Generate NEW NEXTAUTH_SECRET**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   ```

2. **Update NEXTAUTH_URL** to your actual domain

3. **Update DATABASE_URL** password

4. **Add Google OAuth Redirect URLs**
   - Go to Google Console
   - Add: `https://your-domain.com/api/auth/callback/google`

---

## 🎯 Quick Deploy Commands

### Deploy with Vercel CLI:
```bash
vercel --env-file=.env.production
```

### Deploy with Netlify CLI:
```bash
netlify deploy --prod
```

### Using Docker:
```bash
docker run --env-file=.env.production -p 3000:3000 si-japirs
```

---

## ✅ Verification Checklist

After importing environment variables:

- [ ] NEXTAUTH_URL matches your domain
- [ ] NEXTAUTH_SECRET is newly generated
- [ ] Google OAuth redirect URLs added
- [ ] Database password is correct
- [ ] All variables show as "Set" in platform

---

## 🆘 Common Issues

### "Missing environment variable"
- Check if all variables from `.env.production` are imported

### "Invalid NEXTAUTH_URL"
- Must match exact deployment URL (including https://)

### "Google OAuth error"
- Add redirect URL in Google Console

### "Database connection failed"  
- Update password in DATABASE_URL

---

**Just copy `.env.production` → Import to platform → Deploy! 🚀**

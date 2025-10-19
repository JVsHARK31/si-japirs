# 🚀 Deploy as sijapirs.vercel.app

## Quick Deploy Link
Click this link to start deployment:

### 👉 [**DEPLOY NOW**](https://vercel.com/new/clone?repository-url=https://github.com/JVsHARK31/si-japirs)

---

## 📋 Step-by-Step Instructions

### Step 1: Click Deploy Link
Go to: https://vercel.com/new/clone?repository-url=https://github.com/JVsHARK31/si-japirs

### Step 2: Login
- Sign in with GitHub (JVsHARK31)
- Authorize Vercel

### Step 3: Configure Project
**IMPORTANT**: In "Project Name" field, type: **sijapirs** (no hyphen!)

### Step 4: Environment Variables
Click "Environment Variables" and add these from your `.env.local` file:
- Copy all values from: `C:\Users\HP\Downloads\Website Si-JAPIR\si-japir\.env.local`
- **Important**: Change `NEXTAUTH_URL` to `https://sijapirs.vercel.app`

### Step 5: Deploy
Click "Deploy" and wait 2-3 minutes.

---

## ✅ Expected Result
- Website live at: **https://sijapirs.vercel.app**
- Project name in Vercel: **sijapirs**
- All features working

---

## 📝 Manual Deploy via CLI

```bash
# Login
vercel login

# Deploy
cd "C:\Users\HP\Downloads\Website Si-JAPIR\si-japir"
vercel

# When asked for project name, type: sijapirs
# Deploy to production
vercel --prod
```

---

## ⚠️ Important Notes
1. Project name MUST be: **sijapirs** (without hyphen)
2. NEXTAUTH_URL MUST be: **https://sijapirs.vercel.app**
3. Update database password in DATABASE_URL
4. Add Google OAuth redirect: `https://sijapirs.vercel.app/api/auth/callback/google`

---

**Ready to deploy as sijapirs.vercel.app!** 🚀

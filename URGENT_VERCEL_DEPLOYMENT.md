# 🚨 URGENT: Deploy Si-JAPIRS ke Vercel SEKARANG

## ⚠️ MASALAH ANDA:
Project **BELUM DI-IMPORT** ke Vercel! Makanya error 404.

---

## ✅ SOLUSI LANGSUNG (Pilih Salah Satu):

## 🔴 CARA 1: VIA BROWSER (PALING MUDAH)

### Step 1: Buka Link Import
👉 **[KLIK LINK INI](https://vercel.com/import/git?r=https://github.com/JVsHARK31/si-japirs)**

Atau copy paste: 
```
https://vercel.com/import/git?r=https://github.com/JVsHARK31/si-japirs
```

### Step 2: Login/Signup
- Jika belum punya akun → **Sign up with GitHub**
- Jika sudah punya → **Login**

### Step 3: Import Repository
- Akan muncul: "Import Git Repository"
- Repository URL sudah terisi: `https://github.com/JVsHARK31/si-japirs`
- Klik **"Continue"**

### Step 4: Configure Project
- **Project Name**: `si-japirs` (atau biarkan default)
- **Framework Preset**: Next.js (auto-detected)
- **Root Directory**: Kosongkan saja
- **Build Settings**: Biarkan default

### Step 5: Environment Variables (PENTING!)
Scroll ke bawah ke **"Environment Variables"**

**BUKA FILE INI DI NOTEPAD:**
```
C:\Users\HP\Downloads\Website Si-JAPIR\si-japir\.env.local
```

**COPY-PASTE SATU PER SATU:**

| Key | Value (Copy dari .env.local) |
|-----|------|
| `NEXTAUTH_URL` | `https://si-japirs.vercel.app` |
| `NEXTAUTH_SECRET` | (copy dari .env.local) |
| `GOOGLE_CLIENT_ID` | (copy dari .env.local) |
| `GOOGLE_CLIENT_SECRET` | (copy dari .env.local) |
| `DATABASE_URL` | (copy dari .env.local - GANTI PASSWORD!) |
| `NEXT_PUBLIC_SUPABASE_URL` | (copy dari .env.local) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | (copy dari .env.local) |
| `SUPABASE_SERVICE_ROLE_KEY` | (copy dari .env.local) |
| `GPT_API_KEY` | (copy dari .env.local) |
| `GPT_API_URL` | `https://ai.sumopod.com/v1` |
| `GPT_MODEL` | `gpt-4.1-nano` |
| `SCHOLAR_API_KEY` | (copy dari .env.local) |
| `SCHOLAR_API_URL` | `https://serpapi.com/search` |
| `FILE_MAX_MB` | `30` |

### Step 6: Deploy
Klik tombol **"Deploy"** → Tunggu 2-3 menit

---

## 🔵 CARA 2: VIA VERCEL CLI (Command Line)

Buka Command Prompt/Terminal:

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Masuk ke folder project
cd "C:\Users\HP\Downloads\Website Si-JAPIR\si-japir"

# 3. Login ke Vercel
vercel login

# 4. Deploy
vercel

# 5. Ikuti prompt:
# - Set up and deploy? → Y
# - Which scope? → Pilih akun Anda
# - Link to existing project? → N
# - What's your project name? → si-japirs
# - In which directory? → ./
# - Want to override settings? → N

# 6. Setelah selesai, deploy ke production:
vercel --prod
```

---

## 🟢 CARA 3: MANUAL VIA DASHBOARD

1. **Buka Vercel Dashboard**
   - Go to: https://vercel.com/dashboard
   - Login dengan GitHub

2. **Add New Project**
   - Klik **"Add New"** → **"Project"**

3. **Import Git Repository**
   - Klik **"Import from GitHub"**
   - Cari: `JVsHARK31/si-japirs`
   - Klik **"Import"**

4. **Configure & Deploy**
   - Tambahkan environment variables (lihat list di atas)
   - Klik **"Deploy"**

---

## 📱 VERIFIKASI DEPLOYMENT

### Check Status:
1. Buka: https://vercel.com/dashboard
2. Lihat project `si-japirs`
3. Check status:
   - ✅ **Green** = Success
   - 🔄 **Yellow** = Building
   - ❌ **Red** = Failed

### Jika Success:
Website akan live di: **https://si-japirs.vercel.app**

### Jika Failed:
Check error di **"Function Logs"** atau **"Build Logs"**

---

## 🆘 TROUBLESHOOTING

### Error: "Repository not found"
**Fix**: Pastikan repository public di GitHub

### Error: "Build failed"
**Fix**: Check logs, biasanya karena env variables missing

### Error: "Invalid environment variables"
**Fix**: Pastikan semua variables di-add dengan benar

### Error: "404 setelah deploy"
**Fix**: Check apakah build success di dashboard

---

## 🔥 QUICK CHECKLIST

- [ ] Sudah login Vercel?
- [ ] Repository sudah di-import?
- [ ] Environment variables sudah di-add SEMUA?
- [ ] DATABASE_URL password sudah diganti?
- [ ] NEXTAUTH_URL = https://si-japirs.vercel.app?
- [ ] Build status = Success?

---

## 📞 NEED HELP?

Jika masih error setelah ikuti semua langkah:

1. **Screenshot error message**
2. **Check Build Logs** di Vercel Dashboard
3. **Pastikan semua env variables terisi**
4. **Coba redeploy**: Klik "Redeploy" di dashboard

---

**⚡ LAKUKAN SEKARANG: Klik link import di atas dan ikuti langkah-langkahnya!**

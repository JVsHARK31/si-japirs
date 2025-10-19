# 🔐 Google OAuth Configuration for Si-JAPIR

## ✅ Current Configuration

### Google OAuth Credentials (UPDATED)
- **Client ID**: `[CONFIGURED IN .env.local]`
- **Client Secret**: `[CONFIGURED IN .env.local]`
- **Status**: ✅ CONFIGURED & ACTIVE

### NextAuth Configuration
- **URL**: http://localhost:3000
- **Secret**: ✅ Secure secret generated
- **Provider**: Google OAuth 2.0

---

## 🔧 Google Console Setup Requirements

### IMPORTANT: Add these URLs to your Google Console

1. **Go to**: https://console.cloud.google.com/apis/credentials
2. **Select your OAuth 2.0 Client ID**
3. **Add these Authorized redirect URIs**:

```
http://localhost:3000/api/auth/callback/google
http://localhost:3001/api/auth/callback/google
http://localhost:3002/api/auth/callback/google
```

For production (when deployed):
```
https://your-domain.com/api/auth/callback/google
```

### Authorized JavaScript origins:
```
http://localhost:3000
http://localhost:3001
http://localhost:3002
```

---

## 🧪 Testing Google Login

### Step 1: Access Login Page
1. Open browser
2. Go to: http://localhost:3000/auth/sign-in
3. Click "Masuk dengan Google"

### Step 2: Google OAuth Flow
1. You'll be redirected to Google
2. Choose your Google account
3. Grant permissions
4. You'll be redirected back to dashboard

### Expected Result:
- ✅ Successful login
- ✅ Redirected to /dashboard
- ✅ User name displayed
- ✅ User avatar from Google

---

## 🛠️ Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution**: Add the exact redirect URI shown in error message to Google Console

### Error: "Access blocked"
**Solution**: 
1. Make sure OAuth consent screen is configured
2. Add test users if app is in testing mode
3. Or publish app for production

### Error: "Invalid client"
**Solution**: 
1. Check Client ID is correct
2. Check Client Secret is correct
3. Restart server after changes

---

## 📋 Checklist

Before testing login:
- [✅] Google Client ID updated in .env.local
- [✅] Google Client Secret updated in .env.local
- [✅] NEXTAUTH_SECRET is set
- [✅] Server restarted with new config
- [ ] Redirect URIs added in Google Console
- [ ] JavaScript origins added in Google Console
- [ ] OAuth consent screen configured

---

## 🔒 Security Notes

1. **Never commit .env.local to git**
2. **Keep Client Secret confidential**
3. **Use different credentials for production**
4. **Enable 2FA on Google Cloud account**
5. **Restrict API keys in production**

---

## 📱 Testing on Different Ports

If port 3000 is busy, the app may run on 3001 or 3002.
Make sure ALL these redirect URIs are added to Google Console:
- http://localhost:3000/api/auth/callback/google
- http://localhost:3001/api/auth/callback/google
- http://localhost:3002/api/auth/callback/google

---

## ✅ Configuration Status

| Component | Status | Details |
|-----------|--------|---------|
| Client ID | ✅ Updated | New ID configured |
| Client Secret | ✅ Updated | New secret configured |
| NextAuth Secret | ✅ Generated | Secure random secret |
| Environment File | ✅ Updated | .env.local configured |
| Server | ✅ Running | http://localhost:3000 |
| Database | ✅ Schema Ready | Prisma configured |

---

## 🚀 Ready to Test!

Your Google OAuth is now configured with the new credentials.
Visit http://localhost:3000/auth/sign-in to test the login flow.

# Google OAuth Setup - Quick Guide

## ✅ What Changed

We switched from email magic links to **Google OAuth** for simpler, faster authentication.

## 🚀 Setup Steps (5 minutes)

### 1. Create Google OAuth Credentials

1. Go to: https://console.cloud.google.com/
2. Create a new project (or select existing)
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure consent screen (if first time):
   - User Type: External
   - App name: "Rate My Advisor"
   - Support email: your email
   - Developer contact: your email
   - Save and continue
6. Create OAuth client:
   - Application type: **Web application**
   - Name: "Rate My Advisor Web"
   - Authorized redirect URIs:
     - `https://rate-my-advisor.vercel.app/api/auth/callback/google`
     - `http://localhost:3000/api/auth/callback/google` (for local dev)
   - Click **Create**
7. **Copy the Client ID and Client Secret**

### 2. Add to Vercel

```bash
# Add Google Client ID
vercel env add GOOGLE_CLIENT_ID production
# Paste your Client ID when prompted

# Add Google Client Secret
vercel env add GOOGLE_CLIENT_SECRET production
# Paste your Client Secret when prompted
```

### 3. Redeploy

```bash
vercel --prod
```

## ✅ Benefits

- ✅ **No email configuration needed**
- ✅ **One-click sign-in**
- ✅ **Works immediately**
- ✅ **More reliable**
- ✅ **Better user experience**

## 🎯 That's It!

Users can now sign in with their Google account. No more email configuration headaches!


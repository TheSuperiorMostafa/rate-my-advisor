# Fix Production Sign-In Error

## Quick Fixes

### 1. Add Google OAuth Redirect URI

**This is the most common issue!**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. In "Authorized redirect URIs", add:
   ```
   https://rate-my-advisor.vercel.app/api/auth/callback/google
   ```
4. Click **SAVE**
5. Wait 1-2 minutes for changes to propagate

### 2. Verify NEXTAUTH_URL

In Vercel dashboard:
- Go to: Settings → Environment Variables
- Check `NEXTAUTH_URL` is set to: `https://rate-my-advisor.vercel.app`
- Make sure it's set for **Production** environment

### 3. Check Vercel Logs

Run this to see the actual error:
```bash
vercel logs --follow
```

Then try signing in and watch for errors.

### 4. Verify Environment Variables

All these should be set in Vercel (Production):
- ✅ `DATABASE_URL`
- ✅ `NEXTAUTH_SECRET`
- ✅ `NEXTAUTH_URL` = `https://rate-my-advisor.vercel.app`
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`

### 5. Common Error Messages

**"invalid_client"** → Google OAuth redirect URI not added
**"Configuration"** → Missing NEXTAUTH_SECRET or NEXTAUTH_URL
**"Database connection"** → DATABASE_URL incorrect or database not accessible

## Test After Fix

1. Clear browser cache
2. Visit: https://rate-my-advisor.vercel.app/auth/signin
3. Click "Sign in with Google"
4. Should redirect to Google, then back to your app


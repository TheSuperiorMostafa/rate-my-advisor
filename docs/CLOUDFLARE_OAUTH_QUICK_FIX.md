# Quick Fix: OAuth Error on Cloudflare Pages

## Most Common Issue: NEXTAUTH_URL Mismatch

**The Problem:** Your API runs on Vercel, but users visit your site on Cloudflare Pages. NextAuth needs to know the correct callback URL.

## ✅ Quick Fix (5 minutes)

### Step 1: Check Vercel Environment Variables

Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

**Verify `NEXTAUTH_URL` is set to:**
```
https://rate-my-advisor.com
```

**NOT:**
- ❌ `https://rate-my-advisor.vercel.app`
- ❌ `http://rate-my-advisor.com`
- ❌ `https://rate-my-advisor.com/` (no trailing slash)

**Make sure it's set for PRODUCTION environment** (check the environment dropdown).

### Step 2: Verify Google Console Redirect URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs"

**Must include:**
```
https://rate-my-advisor.com/api/auth/callback/google
```

### Step 3: Redeploy Vercel

After updating `NEXTAUTH_URL`:
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy" on latest deployment
3. Wait 2-3 minutes

### Step 4: Test

1. Clear browser cache
2. Visit: `https://rate-my-advisor.com/auth/signin`
3. Click "Sign in with Google"
4. Should work now!

## 🔍 If Still Not Working

### Check What Error You're Getting

**Error 401: invalid_client**
- Redirect URI not in Google Console
- Client ID/Secret mismatch

**Error: Configuration**
- Missing `NEXTAUTH_SECRET` or `NEXTAUTH_URL` in Vercel

**Error: AccessDenied**
- OAuth consent screen issue
- User denied access

### Verify Environment Variables

**In Vercel (Production):**
- ✅ `NEXTAUTH_URL` = `https://rate-my-advisor.com`
- ✅ `NEXTAUTH_SECRET` = (32+ character string)
- ✅ `GOOGLE_CLIENT_ID` = (matches Google Console)
- ✅ `GOOGLE_CLIENT_SECRET` = (matches Google Console)

**In Cloudflare Pages (Production):**
- ✅ Same values as above

### Check Vercel Logs

```bash
vercel logs --follow
```

Then try signing in and watch for errors.

## 📋 Complete Checklist

- [ ] `NEXTAUTH_URL` in Vercel = `https://rate-my-advisor.com` (Production)
- [ ] `GOOGLE_CLIENT_ID` in Vercel matches Google Console (Production)
- [ ] `GOOGLE_CLIENT_SECRET` in Vercel matches Google Console (Production)
- [ ] `NEXTAUTH_SECRET` is set in Vercel (Production)
- [ ] Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
- [ ] Redeployed Vercel after updating environment variables
- [ ] Cleared browser cache
- [ ] Tested again

## 🆘 Still Having Issues?

1. **Check the exact error message** in browser console (F12 → Console)
2. **Check Vercel logs** for server-side errors
3. **Verify the redirect URI** in the OAuth request (Network tab → look for `redirect_uri` parameter)
4. **Make sure all variables are set for Production**, not Preview/Development

See `FIX_CLOUDFLARE_OAUTH.md` for detailed troubleshooting.


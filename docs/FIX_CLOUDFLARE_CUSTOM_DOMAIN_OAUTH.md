# Fix OAuth After Switching to Cloudflare Custom Domain

## The Problem

OAuth was working before, but after switching to Cloudflare custom domain (`rate-my-advisor.com`), you're getting:
- **Error 401: invalid_client**
- **"The Auth client was not found"**

## Root Cause

When using Cloudflare Pages with custom domain and proxying API to Vercel:

1. **User visits:** `https://rate-my-advisor.com` (Cloudflare)
2. **OAuth starts:** `/api/auth/signin/google` (proxied to Vercel)
3. **NextAuth generates callback URL:** Must be `https://rate-my-advisor.com/api/auth/callback/google`
4. **Problem:** If NextAuth uses wrong base URL, it generates wrong callback URL
5. **Google rejects:** Because callback URL doesn't match what's in Google Console

## ✅ The Fix

### Step 1: Verify NEXTAUTH_URL in Vercel

**Critical:** Vercel must use your **Cloudflare domain**, not Vercel domain.

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Check `NEXTAUTH_URL` (Production)
3. **Must be:** `https://rate-my-advisor.com`
4. **NOT:** `https://rate-my-advisor.vercel.app`

### Step 2: Verify Google Console Redirect URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. **Authorized redirect URIs** must include:
   ```
   https://rate-my-advisor.com/api/auth/callback/google
   ```
4. **Remove** any Vercel URLs if you're only using Cloudflare domain now

### Step 3: Redeploy Vercel

**After updating environment variables:**

1. Go to Vercel Dashboard → Deployments
2. Click **"Redeploy"** on latest deployment
3. **Wait 2-3 minutes** for deployment to complete

### Step 4: Clear Browser Cache

1. Clear browser cache and cookies
2. Or use incognito/private window
3. Test again

## 🔍 Why This Happens

When you use Cloudflare custom domain:

- **Frontend:** Served from Cloudflare Pages (`rate-my-advisor.com`)
- **API:** Proxied to Vercel (`rate-my-advisor.vercel.app`)
- **OAuth Callback:** Must go to Cloudflare domain (`rate-my-advisor.com/api/auth/callback/google`)

NextAuth on Vercel needs to know the **public-facing domain** (Cloudflare), not the internal Vercel domain.

## 🎯 Quick Checklist

- [ ] `NEXTAUTH_URL` in Vercel = `https://rate-my-advisor.com` (Production)
- [ ] `GOOGLE_CLIENT_ID` matches Google Console (Production)
- [ ] `GOOGLE_CLIENT_SECRET` matches Google Console (Production)
- [ ] Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
- [ ] All variables set for **Production** environment (not Preview)
- [ ] **Redeployed Vercel** after updating environment variables
- [ ] Cleared browser cache
- [ ] Tested again

## 📝 Important Notes

1. **The API runs on Vercel**, but users visit Cloudflare domain
2. **NEXTAUTH_URL must point to Cloudflare domain** so OAuth callbacks work
3. **After changing NEXTAUTH_URL, you MUST redeploy** for changes to take effect
4. **Google Console redirect URI** must match the domain users actually visit

## 🆘 Still Not Working?

After redeploying, check Vercel logs:

```bash
vercel logs --follow
```

Look for:
- OAuth redirect URL being generated
- Any errors about invalid_client
- Configuration values

The improved logging will show what base URL NextAuth is using for OAuth callbacks.


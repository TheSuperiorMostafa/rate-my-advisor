# Fix OAuth Error on Cloudflare Pages (API Proxied to Vercel)

## The Problem

OAuth works on localhost but fails on your published Cloudflare Pages site, even though the Google OAuth redirect URI is correct.

## Root Cause

When using Cloudflare Pages with API proxied to Vercel, there are **two places** where environment variables need to be set:

1. **Cloudflare Pages** - For the frontend
2. **Vercel** - For the API backend (where NextAuth actually runs)

The OAuth callback happens on Vercel, so Vercel needs the correct `NEXTAUTH_URL` pointing to your **Cloudflare Pages domain**, not the Vercel domain.

## ✅ Step-by-Step Fix

### Step 1: Verify Your Production Domain

Your production domain is: **`https://rate-my-advisor.com`** (Cloudflare Pages)

### Step 2: Set Environment Variables in Vercel

**This is critical!** The API runs on Vercel, so Vercel needs the correct environment variables.

Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

**Set these for PRODUCTION environment:**

1. **NEXTAUTH_URL**
   - Value: `https://rate-my-advisor.com` (your Cloudflare Pages domain)
   - ❌ NOT: `https://rate-my-advisor.vercel.app`
   - ✅ Must be your actual production domain

2. **GOOGLE_CLIENT_ID**
   - Copy exact value from Google Cloud Console
   - Format: `382231355260-xxxxx.apps.googleusercontent.com`

3. **GOOGLE_CLIENT_SECRET**
   - Copy exact value from Google Cloud Console
   - Format: `GOCSPX-xxxxx`

4. **NEXTAUTH_SECRET**
   - A random 32+ character string
   - Generate with: `openssl rand -base64 32`

**Important:** Make sure all variables are set for **Production** environment (not Preview/Development).

### Step 3: Set Environment Variables in Cloudflare Pages

Even though the API runs on Vercel, Cloudflare Pages also needs these for the frontend:

```bash
wrangler pages secret put NEXTAUTH_URL --project-name=rate-my-advisor
# Value: https://rate-my-advisor.com

wrangler pages secret put GOOGLE_CLIENT_ID --project-name=rate-my-advisor
# Value: Your Google Client ID

wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=rate-my-advisor
# Value: Your Google Client Secret

wrangler pages secret put NEXTAUTH_SECRET --project-name=rate-my-advisor
# Value: Same secret as in Vercel
```

**Or via Dashboard:**
1. Cloudflare Dashboard → Pages → rate-my-advisor
2. Settings → Environment Variables
3. Add variables for **Production** environment

### Step 4: Verify Google Cloud Console Redirect URIs

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs"

**You MUST have these exact URIs:**

```
https://rate-my-advisor.com/api/auth/callback/google
https://www.rate-my-advisor.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**Important:**
- ✅ Use `https` (not `http`) for production
- ✅ Include `/api/auth/callback/google` (exact path)
- ✅ No trailing slashes
- ✅ Case-sensitive

### Step 5: Update the Proxy Middleware (if needed)

Check `functions/_middleware.ts` to ensure it's correctly proxying OAuth requests:

```typescript
// The proxy should forward all /api/* requests to Vercel
if (url.pathname.startsWith('/api/')) {
  const vercelUrl = `https://rate-my-advisor.vercel.app${url.pathname}${url.search}`;
  // ... proxy logic
}
```

### Step 6: Redeploy Both Services

**After updating environment variables:**

1. **Redeploy Vercel:**
   - Go to Vercel Dashboard → Deployments
   - Click "Redeploy" on latest deployment
   - Or push a new commit

2. **Redeploy Cloudflare Pages:**
   ```bash
   npm run pages:deploy
   ```
   Or trigger a new deployment from the Cloudflare Dashboard

3. **Wait 2-3 minutes** for changes to propagate

### Step 7: Test the OAuth Flow

1. Clear browser cache
2. Visit: `https://rate-my-advisor.com/auth/signin`
3. Click "Sign in with Google"
4. Check browser DevTools → Network tab
5. Look for the OAuth request and verify:
   - `redirect_uri` parameter = `https://rate-my-advisor.com/api/auth/callback/google`
   - Not `https://rate-my-advisor.vercel.app/api/auth/callback/google`

## 🔍 Debugging

### Check Vercel Logs

```bash
vercel logs --follow
```

Then try signing in and watch for:
- OAuth errors
- Missing environment variables
- Wrong redirect URI

### Check Cloudflare Function Logs

1. Cloudflare Dashboard → Pages → rate-my-advisor
2. Functions → Logs
3. Look for proxy errors or OAuth callback issues

### Verify Environment Variables

**In Vercel:**
```bash
vercel env ls
```

**In Cloudflare:**
```bash
wrangler pages secret list --project-name=rate-my-advisor
```

## 🎯 Common Issues

### Issue 1: NEXTAUTH_URL Points to Vercel Instead of Cloudflare

**Symptom:** OAuth redirects to `https://rate-my-advisor.vercel.app/api/auth/callback/google`

**Fix:** Set `NEXTAUTH_URL=https://rate-my-advisor.com` in Vercel (Production)

### Issue 2: Environment Variables Not Set for Production

**Symptom:** Works in Preview but not Production

**Fix:** Make sure all OAuth variables are set for **Production** environment in both Vercel and Cloudflare

### Issue 3: Proxy Not Forwarding Headers Correctly

**Symptom:** OAuth callback fails with cookie/session errors

**Fix:** Check `functions/_middleware.ts` is forwarding all headers, especially cookies

### Issue 4: Google Console Redirect URI Mismatch

**Symptom:** Error 401: invalid_client

**Fix:** Add exact redirect URI: `https://rate-my-advisor.com/api/auth/callback/google`

## ✅ Quick Checklist

- [ ] `NEXTAUTH_URL` in Vercel = `https://rate-my-advisor.com` (Production)
- [ ] `NEXTAUTH_URL` in Cloudflare Pages = `https://rate-my-advisor.com` (Production)
- [ ] `GOOGLE_CLIENT_ID` matches Google Console (both Vercel and Cloudflare)
- [ ] `GOOGLE_CLIENT_SECRET` matches Google Console (both Vercel and Cloudflare)
- [ ] `NEXTAUTH_SECRET` is the same in both Vercel and Cloudflare
- [ ] Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
- [ ] All variables set for **Production** environment (not Preview)
- [ ] Redeployed both Vercel and Cloudflare Pages after changes
- [ ] Cleared browser cache before testing

## 📝 Important Notes

1. **The API runs on Vercel**, so Vercel's `NEXTAUTH_URL` must point to your **Cloudflare Pages domain** (where users actually visit)

2. **Both services need the same environment variables** because:
   - Cloudflare Pages frontend might need them for client-side code
   - Vercel backend definitely needs them for NextAuth

3. **The redirect URI in Google Console** must match your **Cloudflare Pages domain**, not Vercel, because that's where users are redirected after OAuth

4. **After updating environment variables**, you MUST redeploy for changes to take effect


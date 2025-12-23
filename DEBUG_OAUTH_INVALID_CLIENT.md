# Debug OAuth Error 401: invalid_client (Redirect URI Already Added)

Since the redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is already in Google Cloud Console, the issue is likely one of these:

## 🔍 Most Likely Causes

### 1. Client ID/Secret Mismatch in Vercel

**Check:**
1. Go to Google Cloud Console: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. **Copy the exact Client ID** (starts with numbers like `382231355260-...`)
4. **Copy the exact Client Secret** (starts with `GOCSPX-...`)

**Verify in Vercel:**
1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Check `GOOGLE_CLIENT_ID` (Production) - must match Google Console **exactly**
3. Check `GOOGLE_CLIENT_SECRET` (Production) - must match Google Console **exactly**
4. **Important:** Make sure they're set for **Production** environment (not Preview/Development)

**Common issues:**
- Extra spaces before/after the values
- Missing characters
- Using localhost client ID instead of production
- Values set for wrong environment (Preview instead of Production)

### 2. NEXTAUTH_URL Mismatch

**Check in Vercel:**
1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Check `NEXTAUTH_URL` value
3. **Must be exactly:** `https://rate-my-advisor.com` (no trailing slash)
4. **Must be set for Production** environment

**Common issues:**
- Set to `https://rate-my-advisor.vercel.app` instead of `https://rate-my-advisor.com`
- Set to `http://` instead of `https://`
- Has trailing slash: `https://rate-my-advisor.com/`
- Not set for Production environment

### 3. www vs non-www Domain Mismatch

**If you visit `www.rate-my-advisor.com`:**
- Make sure `NEXTAUTH_URL` = `https://www.rate-my-advisor.com`
- Make sure redirect URI in Google Console includes: `https://www.rate-my-advisor.com/api/auth/callback/google`

**If you visit `rate-my-advisor.com` (no www):**
- Make sure `NEXTAUTH_URL` = `https://rate-my-advisor.com`
- Make sure redirect URI in Google Console includes: `https://rate-my-advisor.com/api/auth/callback/google`

**Best practice:** Add both redirect URIs to Google Console:
```
https://rate-my-advisor.com/api/auth/callback/google
https://www.rate-my-advisor.com/api/auth/callback/google
```

### 4. OAuth Client is Disabled

**Check in Google Cloud Console:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. Check if it says "Disabled" - if so, enable it
4. Make sure the client is in the correct Google Cloud project

### 5. Wrong Google Cloud Project

**Check:**
1. In Google Cloud Console, check the project dropdown (top of page)
2. Make sure you're in the correct project
3. The Client ID should match what's in Vercel

### 6. Environment Variables Not Applied

**After updating environment variables in Vercel:**
1. You MUST redeploy for changes to take effect
2. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
3. Click "Redeploy" on the latest deployment
4. Wait for deployment to complete

## ✅ Step-by-Step Diagnostic

### Step 1: Verify Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Verify:
   - ✅ Client is **Active** (not disabled)
   - ✅ Client ID matches what's in Vercel
   - ✅ Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is listed
   - ✅ OAuth consent screen is configured

### Step 2: Verify Vercel Environment Variables

Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

**For each variable, check:**
- ✅ Value matches Google Console exactly (no extra spaces)
- ✅ Set for **Production** environment (check the environment dropdown)
- ✅ No typos or missing characters

**Required variables:**
- `GOOGLE_CLIENT_ID` = Your Client ID from Google Console
- `GOOGLE_CLIENT_SECRET` = Your Client Secret from Google Console  
- `NEXTAUTH_URL` = `https://rate-my-advisor.com` (or `https://www.rate-my-advisor.com` if you use www)
- `NEXTAUTH_SECRET` = A random 32+ character string

### Step 3: Check Vercel Logs

```bash
vercel logs --follow
```

Then try signing in and watch for:
- Error messages about missing environment variables
- OAuth errors
- Client ID/Secret validation errors

### Step 4: Test the Exact Redirect URI

When you click "Sign in with Google", check the browser's Network tab:
1. Open browser DevTools (F12)
2. Go to Network tab
3. Click "Sign in with Google"
4. Look for the OAuth request
5. Check the `redirect_uri` parameter in the request
6. It should be exactly: `https://rate-my-advisor.com/api/auth/callback/google`

If it's different, that's the issue - check `NEXTAUTH_URL`.

### Step 5: Clear and Re-add Environment Variables

Sometimes Vercel caches old values:

1. In Vercel, delete the environment variable
2. Save
3. Add it again with the correct value
4. Make sure it's set for **Production**
5. Redeploy

## 🎯 Quick Fix Checklist

- [ ] Client ID in Vercel matches Google Console exactly
- [ ] Client Secret in Vercel matches Google Console exactly
- [ ] Both are set for **Production** environment in Vercel
- [ ] `NEXTAUTH_URL` = `https://rate-my-advisor.com` (or www version if you use www)
- [ ] `NEXTAUTH_URL` is set for **Production** environment
- [ ] OAuth client is Active in Google Console
- [ ] Redeployed after updating environment variables
- [ ] Cleared browser cache before testing

## 🔧 Most Common Fix

**The most common issue when redirect URI is already there:**

1. **Client ID/Secret in Vercel don't match Google Console**
   - Solution: Copy exact values from Google Console and update in Vercel (Production)

2. **NEXTAUTH_URL is wrong or not set for Production**
   - Solution: Set `NEXTAUTH_URL` = `https://rate-my-advisor.com` for Production

3. **Environment variables are set for Preview/Development but not Production**
   - Solution: Make sure all OAuth variables are set for **Production** environment

## 📝 After Making Changes

1. **Redeploy in Vercel** (required for env var changes)
2. **Wait 1-2 minutes** for changes to propagate
3. **Clear browser cache** before testing
4. **Test again**


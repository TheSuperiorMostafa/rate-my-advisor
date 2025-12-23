# Fix OAuth Error 401: invalid_client in Production

## The Problem
OAuth works on localhost but fails in production with "Error 401: invalid_client". This means Google can't find your OAuth client or the redirect URI doesn't match.

## Root Causes

1. **Redirect URI Mismatch** - The redirect URI in Google Cloud Console doesn't match your production domain
2. **Wrong NEXTAUTH_URL** - Environment variable doesn't match your actual domain
3. **Client ID/Secret Mismatch** - Production environment variables don't match Google Console
4. **Missing Redirect URI** - The production domain redirect URI isn't added to Google Console

## ✅ Step-by-Step Fix

### Step 1: Verify Your Production Domain
Your production domain is: **`rate-my-advisor.com`**

### Step 2: Check Google Cloud Console Redirect URIs

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs" section

**You MUST have these exact URIs (case-sensitive, no trailing slashes):**

```
https://rate-my-advisor.com/api/auth/callback/google
https://www.rate-my-advisor.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

**Important:**
- ✅ Must use `https` (not `http`) for production
- ✅ Must include `/api/auth/callback/google` (exact path)
- ✅ No trailing slash
- ✅ Exact domain match (including www if you use it)

### Step 3: Verify Vercel Environment Variables

Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

**Check these variables are set for PRODUCTION:**

1. **NEXTAUTH_URL**
   - Should be: `https://rate-my-advisor.com`
   - NOT: `https://rate-my-advisor.vercel.app`
   - Make sure it's set for **Production** environment

2. **GOOGLE_CLIENT_ID**
   - Should match your Google Cloud Console Client ID exactly
   - Format: `382231355260-xxxxx.apps.googleusercontent.com`
   - Make sure it's set for **Production** environment

3. **GOOGLE_CLIENT_SECRET**
   - Should match your Google Cloud Console Client Secret exactly
   - Format: `GOCSPX-xxxxx`
   - Make sure it's set for **Production** environment

4. **NEXTAUTH_SECRET**
   - Should be a random 32+ character string
   - Make sure it's set for **Production** environment

### Step 4: Common Issues to Check

#### Issue A: Redirect URI Not Added
**Symptom:** Works on localhost, fails in production

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth client
3. Add: `https://rate-my-advisor.com/api/auth/callback/google`
4. Click **SAVE**
5. Wait 2-3 minutes for propagation

#### Issue B: Wrong NEXTAUTH_URL
**Symptom:** OAuth redirects to wrong URL

**Fix:**
1. In Vercel, update `NEXTAUTH_URL` to: `https://rate-my-advisor.com`
2. Make sure it's set for **Production** (not Preview or Development)
3. Redeploy

#### Issue C: Client ID/Secret Mismatch
**Symptom:** "invalid_client" error

**Fix:**
1. In Google Cloud Console, copy the exact Client ID
2. In Vercel, update `GOOGLE_CLIENT_ID` with the exact value
3. In Google Cloud Console, copy the exact Client Secret
4. In Vercel, update `GOOGLE_CLIENT_SECRET` with the exact value
5. Make sure both are set for **Production**
6. Redeploy

#### Issue D: Different Client IDs for Localhost vs Production
**Symptom:** Works locally but not in production

**Fix:**
- You can use the SAME OAuth client for both localhost and production
- Just add both redirect URIs to the same client:
  - `http://localhost:3000/api/auth/callback/google`
  - `https://rate-my-advisor.com/api/auth/callback/google`

### Step 5: Verify OAuth Client Status

In Google Cloud Console:
1. Go to: https://console.cloud.google.com/apis/credentials
2. Check your OAuth client is **Active** (not disabled)
3. Check OAuth consent screen is configured
4. If in "Testing" mode, make sure your email is added as a test user

### Step 6: Redeploy After Changes

After updating:
1. Environment variables in Vercel → Redeploy
2. Redirect URIs in Google Console → Wait 2-3 minutes, then test

### Step 7: Test

1. Clear browser cache and cookies
2. Visit: https://rate-my-advisor.com/auth/signin
3. Click "Sign in with Google"
4. Should redirect to Google, then back to your app

## 🔍 Debugging

### Check Vercel Logs
```bash
vercel logs --follow
```

Then try signing in and watch for errors.

### Verify Environment Variables
In Vercel dashboard, check that all variables are:
- ✅ Set for **Production** environment
- ✅ Have correct values (no extra spaces)
- ✅ Match Google Cloud Console exactly

### Test Redirect URI Format
The redirect URI Google receives should be:
```
https://rate-my-advisor.com/api/auth/callback/google
```

If it's different (e.g., includes port, different domain), that's the issue.

## ✅ Checklist

- [ ] Redirect URI added to Google Cloud Console: `https://rate-my-advisor.com/api/auth/callback/google`
- [ ] NEXTAUTH_URL in Vercel = `https://rate-my-advisor.com` (Production)
- [ ] GOOGLE_CLIENT_ID in Vercel matches Google Console (Production)
- [ ] GOOGLE_CLIENT_SECRET in Vercel matches Google Console (Production)
- [ ] NEXTAUTH_SECRET is set (Production)
- [ ] OAuth client is Active in Google Console
- [ ] Redeployed after changes
- [ ] Waited 2-3 minutes after Google Console changes
- [ ] Cleared browser cache before testing

## 🎯 Most Likely Fix

Based on your description, the most likely issue is:

**The redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is not added to your Google OAuth client.**

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. Add the redirect URI above
4. Save
5. Wait 2-3 minutes
6. Test again


# Fix: Error 401: invalid_client - "The Auth client was not found"

## The Error

You're seeing: **"Error 401: invalid_client - The Auth client was not found"**

This means Google OAuth cannot find your OAuth client ID. This is different from a redirect URI mismatch.

## Root Causes

1. **Client ID doesn't exist** in Google Cloud Console
2. **Client ID mismatch** - Vercel has different Client ID than Google Console
3. **Wrong Google Cloud project** - Client ID is from a different project
4. **Client ID is disabled** in Google Console
5. **Client ID format is wrong** (missing characters, extra spaces)

## ✅ Step-by-Step Fix

### Step 1: Verify Client ID in Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. **Check the project dropdown** (top of page) - make sure you're in the correct project
3. Find your OAuth 2.0 Client ID
4. **Click on it** to open details
5. **Copy the exact Client ID** (starts with numbers like `382231355260-...`)
6. **Check if it says "Disabled"** - if so, enable it

### Step 2: Verify Client ID in Vercel

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Find `GOOGLE_CLIENT_ID` (Production environment)
3. **Compare character-by-character** with Google Console
4. **Check for:**
   - Extra spaces before/after
   - Missing characters
   - Different Client ID entirely
   - Wrong environment (Preview instead of Production)

### Step 3: Verify Client Secret

1. In Google Console, click "Reset" or "Show" next to Client Secret
2. **Copy the exact Client Secret** (starts with `GOCSPX-...`)
3. In Vercel, find `GOOGLE_CLIENT_SECRET` (Production)
4. **Compare character-by-character**
5. **Must match exactly**

### Step 4: Check OAuth Consent Screen

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Make sure OAuth consent screen is **configured**
3. Check if it says "Published" (not "Testing")
4. If in Testing mode, add your email to test users

### Step 5: Verify Redirect URIs (Again)

Even though this is "invalid_client", double-check redirect URIs:

1. In Google Console → OAuth Client → Authorized redirect URIs
2. **Must have exactly:**
   ```
   https://rate-my-advisor.com/api/auth/callback/google
   ```
3. **No trailing slash**
4. **Exact domain match**

### Step 6: Clear and Re-add Environment Variables

Sometimes Vercel caches old values:

1. In Vercel, **delete** `GOOGLE_CLIENT_ID` (Production)
2. **Delete** `GOOGLE_CLIENT_SECRET` (Production)
3. **Save**
4. **Add them again** with exact values from Google Console
5. **Make sure** they're set for **Production** environment
6. **Redeploy** Vercel

### Step 7: Check for Multiple OAuth Clients

1. In Google Console, check if you have **multiple** OAuth clients
2. Make sure you're using the **correct one**
3. The Client ID in Vercel must match **one** of them exactly

## 🔍 Debugging Steps

### Check What Client ID is Being Used

1. Open browser DevTools (F12) → Network tab
2. Try signing in with Google
3. Look for the request to `accounts.google.com`
4. Check the `client_id` parameter in the URL
5. **Compare** with your Google Console Client ID

### Check Vercel Logs

```bash
vercel logs --follow
```

Then try signing in and look for:
- Client ID being used
- Any OAuth errors
- Environment variable issues

### Test the Client ID Directly

You can test if the Client ID is valid by visiting:

```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=https://rate-my-advisor.com/api/auth/callback/google&response_type=code&scope=openid%20email%20profile
```

Replace `YOUR_CLIENT_ID` with your actual Client ID.

**If you get "invalid_client":**
- Client ID doesn't exist
- Client ID is from wrong project
- Client ID is disabled

**If it redirects to Google:**
- Client ID is valid
- Issue is likely with redirect URI or Client Secret

## ✅ Quick Fix Checklist

- [ ] Client ID in Vercel matches Google Console **exactly** (character-by-character)
- [ ] Client Secret in Vercel matches Google Console **exactly** (character-by-character)
- [ ] Both are set for **Production** environment (not Preview)
- [ ] OAuth client is **Active** (not disabled) in Google Console
- [ ] You're in the **correct Google Cloud project**
- [ ] OAuth consent screen is configured
- [ ] Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
- [ ] Deleted and re-added environment variables in Vercel
- [ ] Redeployed Vercel after changes
- [ ] Cleared browser cache

## 🎯 Most Common Fix

**90% of "invalid_client" errors are caused by:**

1. **Client ID/Secret mismatch** - Values in Vercel don't match Google Console
2. **Wrong environment** - Variables set for Preview instead of Production
3. **Extra spaces** - Copy-paste added spaces before/after values

**Solution:**
1. Copy exact Client ID from Google Console (no spaces)
2. Copy exact Client Secret from Google Console (no spaces)
3. Delete old values in Vercel
4. Add new values for **Production** environment
5. Redeploy

## 📝 After Fixing

1. **Redeploy Vercel** (required for env var changes)
2. **Wait 2-3 minutes** for changes to propagate
3. **Clear browser cache**
4. **Test again** at: https://rate-my-advisor.com/auth/signin

## 🆘 Still Not Working?

If you've verified everything above and it still doesn't work:

1. **Create a new OAuth client** in Google Console
2. **Copy the new Client ID and Secret**
3. **Update in Vercel** (Production)
4. **Add redirect URI** for the new client
5. **Redeploy**

Sometimes creating a fresh OAuth client resolves issues with corrupted or misconfigured clients.



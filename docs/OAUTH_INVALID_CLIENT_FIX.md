# Fix OAuth Error 401: invalid_client - Complete Guide

## The Problem
**"Error 401: invalid_client - The OAuth client was not found"**

This works on localhost but fails in production. This means Google can't find your OAuth client with the Client ID you're using.

## Root Causes (Most Common to Least Common)

### 1. **Environment Variables Have Extra Quotes or Whitespace** ⚠️ MOST COMMON
When you copy-paste from Google Console or Vercel UI, sometimes quotes or spaces get added:
- `GOOGLE_CLIENT_ID="382231355260-..."` ❌ (has quotes)
- `GOOGLE_CLIENT_ID= 382231355260-...` ❌ (has leading space)
- `GOOGLE_CLIENT_ID=382231355260-... ` ❌ (has trailing space)

**Fix:** Delete and re-add the variables in Vercel, ensuring NO quotes and NO spaces.

### 2. **Environment Variables Set for Wrong Environment**
Vercel has separate environments: Production, Preview, Development.
- If your production site uses Production environment, variables MUST be set for Production
- If you only set them for Preview, production won't see them

**Fix:** Check the environment dropdown when adding variables - must be **Production**.

### 3. **Client ID/Secret Don't Match Google Console**
The values in Vercel must match Google Console **exactly** (character-by-character).
- Different Client ID entirely
- Typo in Client ID or Secret
- Using Client ID from a different Google Cloud project

**Fix:** Compare character-by-character between Vercel and Google Console.

### 4. **Using Different OAuth Client**
You might have multiple OAuth clients in Google Console. The Client ID in Vercel must be the same one that has your redirect URIs configured.

**Fix:** Verify the Client ID in Vercel matches the Client ID in Google Console that has the redirect URIs.

### 5. **OAuth Client is Disabled**
In Google Console, OAuth clients can be disabled. Check if your client shows "Disabled" status.

**Fix:** Enable the OAuth client in Google Console.

### 6. **Propagation Delay**
After making changes in Google Console or Vercel, there can be a 5-10 minute delay before changes take effect.

**Fix:** Wait 5-10 minutes and try again.

## ✅ Step-by-Step Fix

### Step 1: Get EXACT Values from Google Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. **Check the project dropdown** (top of page) - make sure you're in the CORRECT project
3. Click on your **OAuth 2.0 Client ID**
4. **Copy the Client ID** - it should look like: `382231355260-xxxxx.apps.googleusercontent.com`
   - Select the entire value
   - Copy it (don't type it manually)
5. **Copy the Client Secret** - it should start with: `GOCSPX-xxxxx`
   - Click "Show" to reveal it
   - Copy the entire value
6. **Verify it's ENABLED** (not disabled) - if disabled, click "Enable"

### Step 2: Delete and Re-add in Vercel (CRITICAL!)

**This is the most important step - it removes any hidden quotes or whitespace.**

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

2. **Delete GOOGLE_CLIENT_ID:**
   - Find `GOOGLE_CLIENT_ID` in the list
   - Click the **X** to delete it
   - Confirm deletion

3. **Delete GOOGLE_CLIENT_SECRET:**
   - Find `GOOGLE_CLIENT_SECRET` in the list
   - Click the **X** to delete it
   - Confirm deletion

4. **Re-add GOOGLE_CLIENT_ID:**
   - Click **"Add New"**
   - **Key:** `GOOGLE_CLIENT_ID` (type exactly)
   - **Value:** Paste the Client ID from Google Console (Ctrl+V / Cmd+V)
   - **Environment:** Select **Production** (NOT Preview!)
   - Click **"Save"**
   - **Double-check:** No quotes, no spaces before/after

5. **Re-add GOOGLE_CLIENT_SECRET:**
   - Click **"Add New"**
   - **Key:** `GOOGLE_CLIENT_SECRET` (type exactly)
   - **Value:** Paste the Client Secret from Google Console (Ctrl+V / Cmd+V)
   - **Environment:** Select **Production** (NOT Preview!)
   - Click **"Save"**
   - **Double-check:** No quotes, no spaces before/after

### Step 3: Verify NEXTAUTH_URL

1. In Vercel, find `NEXTAUTH_URL`
2. **Must be:** `https://rate-my-advisor.com` (or your production domain)
3. **Must NOT have:**
   - Trailing slash (`/`)
   - Quotes (`"` or `'`)
   - Leading/trailing spaces
4. **Must be set for Production**
5. If wrong, delete and re-add it (same process as above)

### Step 4: Verify Redirect URIs in Google Console

1. In Google Console → Your OAuth Client
2. Check **"Authorized redirect URIs"** includes:
   - `https://rate-my-advisor.com/api/auth/callback/google`
   - `https://rate-my-advisor-hestyas-projects.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for local dev)
3. Check **"Authorized JavaScript origins"** includes:
   - `https://rate-my-advisor.com`
   - `https://rate-my-advisor-hestyas-projects.vercel.app`
   - `http://localhost:3000` (for local dev)
4. **Important:** No trailing commas, no typos
5. Click **"Save"** if you made changes

### Step 5: REDEPLOY Vercel (REQUIRED!)

**After changing environment variables, you MUST redeploy for changes to take effect.**

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. **Wait 2-3 minutes** for deployment to complete

### Step 6: Wait and Test

1. **Wait 5-10 minutes** after Google Console changes (propagation delay)
2. **Clear browser cache and cookies** for your site
3. Go to: https://rate-my-advisor.com/auth/signin
4. Click **"Sign in with Google"**
5. Should redirect to Google login (not show error)

## Debugging: Check Vercel Logs

After redeploying, check if environment variables are being read correctly:

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click on the latest deployment
3. Click **"Functions"** tab
4. Look for logs that show:
   - `✅ GOOGLE_CLIENT_ID is set: 382231355260...`
   - `✅ GOOGLE_CLIENT_SECRET is set: GOCSPX-...`
   - `✅ NEXTAUTH_URL: https://rate-my-advisor.com`

If you see:
- `❌ GOOGLE_CLIENT_ID is missing in production!` → Variable not set or wrong environment
- `❌ GOOGLE_CLIENT_ID contains quotes!` → Delete and re-add without quotes
- `⚠️ GOOGLE_CLIENT_SECRET format looks unusual` → Check if it starts with `GOCSPX-`

## Common Mistakes to Avoid

### ❌ Don't Do This:
```
GOOGLE_CLIENT_ID="382231355260-..."
GOOGLE_CLIENT_SECRET="GOCSPX-..."
NEXTAUTH_URL="https://rate-my-advisor.com/"
```

### ✅ Do This:
```
GOOGLE_CLIENT_ID=382231355260-xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
NEXTAUTH_URL=https://rate-my-advisor.com
```

## If Still Not Working

### Option 1: Regenerate OAuth Credentials
1. In Google Console, create a **new** OAuth 2.0 Client ID
2. Copy the new Client ID and Secret
3. Update Vercel environment variables with new credentials
4. Add redirect URIs to the new client
5. Redeploy

### Option 2: Check for Multiple OAuth Clients
1. In Google Console, list all OAuth 2.0 Client IDs
2. Make sure you're using the same Client ID that has your redirect URIs
3. If you have multiple clients, delete the unused ones or use the correct one

### Option 3: Verify Project Match
1. Check which Google Cloud project your OAuth client is in
2. Make sure you're looking at the correct project in Google Console
3. The Client ID must be from the same project

## Quick Checklist

- [ ] Client ID in Vercel matches Google Console **exactly** (character-by-character)
- [ ] Client Secret in Vercel matches Google Console **exactly** (character-by-character)
- [ ] No quotes around values in Vercel
- [ ] No spaces before/after values in Vercel
- [ ] Both variables set for **Production** environment (not Preview)
- [ ] `NEXTAUTH_URL` set correctly (no trailing slash, no quotes)
- [ ] Redirect URIs added to Google Console (no typos, no trailing commas)
- [ ] OAuth client is **Enabled** in Google Console
- [ ] Redeployed after changing environment variables
- [ ] Waited 5-10 minutes after Google Console changes
- [ ] Cleared browser cache/cookies before testing

## Still Having Issues?

If none of the above works, the issue might be:
1. **Different Google Cloud project** - Check if you have multiple projects
2. **OAuth consent screen not configured** - Go to OAuth consent screen and fill out required fields
3. **API not enabled** - Make sure Google+ API or Google Identity API is enabled
4. **Rate limiting** - Wait a few hours and try again


# Fix OAuth Error 401: invalid_client - Step by Step

## The Problem
"The OAuth client was not found" means Google can't find your OAuth client with the Client ID you're using.

## ✅ Step-by-Step Fix

### Step 1: Go to Google Cloud Console
1. Visit: https://console.cloud.google.com/apis/credentials
2. Make sure you're in the correct project (top dropdown)

### Step 2: Find Your OAuth Client
1. Look for "OAuth 2.0 Client IDs" section
2. You should see a client that starts with: `382231355260-...`
3. **Click on it** to open details

### Step 3: Verify Client ID
- The Client ID should be: `382231355260-pglml9v85l4k5hkvu3ph45amml1q7bi3.apps.googleusercontent.com`
- **Copy this exact value**

### Step 4: Check Authorized Redirect URIs
In the OAuth client details, under "Authorized redirect URIs", you MUST have:

```
https://rate-my-advisor.vercel.app/api/auth/callback/google
```

**Important:**
- ✅ Must be exactly this (no trailing slash)
- ✅ Must use `https` (not `http`)
- ✅ Must include `/api/auth/callback/google`

### Step 5: Update Vercel Environment Variables

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

2. **Update GOOGLE_CLIENT_ID:**
   - Click on `GOOGLE_CLIENT_ID` (Production)
   - Delete the old value
   - Add: `382231355260-pglml9v85l4k5hkvu3ph45amml1q7bi3.apps.googleusercontent.com`
   - Save

3. **Update GOOGLE_CLIENT_SECRET:**
   - Click on `GOOGLE_CLIENT_SECRET` (Production)
   - Delete the old value
   - Add your Client Secret from Google Console (starts with `GOCSPX-`)
   - Save

4. **Verify NEXTAUTH_URL:**
   - Should be: `https://rate-my-advisor.vercel.app`
   - Make sure it's set for **Production**

### Step 6: Redeploy
After updating environment variables:
1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Wait for deployment to complete

### Step 7: Test
1. Clear browser cache/cookies
2. Visit: https://rate-my-advisor.vercel.app/auth/signin
3. Try signing in again

## 🔍 Still Not Working?

### Check OAuth Consent Screen
1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Make sure:
   - App is in "Testing" or "Production" mode
   - Your email (`superiormostafa@gmail.com`) is added as a test user (if in Testing mode)

### Verify Application Type
In the OAuth client:
- **Application type** must be: "Web application"
- **Authorized JavaScript origins** can be empty or include your domain
- **Authorized redirect URIs** must include the exact callback URL

### Common Mistakes
- ❌ Client ID has extra spaces or newlines
- ❌ Redirect URI has trailing slash
- ❌ Using `http` instead of `https`
- ❌ OAuth client is in a different Google Cloud project
- ❌ OAuth consent screen not configured

## 🎯 Quick Test
After fixing, the sign-in should redirect to Google, then back to your app without errors.


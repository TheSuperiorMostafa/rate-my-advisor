# Verify OAuth Configuration - Step by Step

## The Error
**"Error 401: invalid_client - The Auth client was not found"**

This means Google cannot find your OAuth client ID. Let's verify everything step by step.

## ✅ Step 1: Get Client ID from Google Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. **Check the project dropdown** (top of page) - make sure you're in the correct project
3. Click on your **OAuth 2.0 Client ID**
4. **Copy the Client ID** - it should look like: `382231355260-xxxxx.apps.googleusercontent.com`
5. **Copy the Client Secret** - it should start with: `GOCSPX-xxxxx`
6. **Check if it says "Disabled"** - if so, click "Enable"

## ✅ Step 2: Verify in Vercel

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Find `GOOGLE_CLIENT_ID` 
3. **Check the environment dropdown** - must be set for **Production**
4. **Compare character-by-character** with Google Console
5. **Check for:**
   - Extra spaces before/after
   - Missing characters
   - Different Client ID entirely

6. Repeat for `GOOGLE_CLIENT_SECRET`

## ✅ Step 3: Common Issues

### Issue 1: Client ID has extra spaces
**Fix:** Delete and re-add the variable, copy-paste directly from Google Console

### Issue 2: Set for wrong environment
**Fix:** Make sure both are set for **Production** (not Preview or Development)

### Issue 3: Using different Client ID
**Fix:** Make sure you're using the same Client ID that has the redirect URI configured

### Issue 4: Client ID from different project
**Fix:** Check the Google Cloud project - must match the one with the redirect URI

## ✅ Step 4: After Fixing

1. **Redeploy Vercel** (required for env var changes)
2. **Wait 2-3 minutes**
3. **Clear browser cache**
4. **Test again**

## 🔍 Quick Test

To verify the Client ID is correct, you can test it directly:

Visit this URL (replace YOUR_CLIENT_ID):
```
https://accounts.google.com/o/oauth2/v2/auth?client_id=YOUR_CLIENT_ID&redirect_uri=https://rate-my-advisor.com/api/auth/callback/google&response_type=code&scope=openid%20email%20profile
```

**If you get "invalid_client":**
- Client ID doesn't exist
- Client ID is from wrong project
- Client ID is disabled

**If it redirects to Google:**
- Client ID is valid
- Issue is likely with redirect URI or Client Secret


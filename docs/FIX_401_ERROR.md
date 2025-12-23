# Fix Error 401: invalid_client

## 🔴 The Problem

Error `401: invalid_client` means the redirect URI in Google Cloud Console doesn't match what NextAuth is using.

## ✅ The Fix

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/apis/credentials
2. Make sure your project is selected (top dropdown)

### Step 2: Edit Your OAuth Client

1. Find your OAuth 2.0 Client ID
   - It should start with: `382231355260-...`
   - Click on it to edit

### Step 3: Add the Correct Redirect URI

In the "Authorized redirect URIs" section, make sure you have:

```
https://rate-my-advisor.vercel.app/api/auth/callback/google
```

**If it's not there:**
1. Click **"+ ADD URI"**
2. Paste: `https://rate-my-advisor.vercel.app/api/auth/callback/google`
3. Click **"SAVE"**

### Step 4: Also Add Localhost (for testing)

Add this one too:
```
http://localhost:3000/api/auth/callback/google
```

### Step 5: Save and Wait

1. Click **"SAVE"** at the bottom
2. Wait 1-2 minutes for changes to propagate
3. Try signing in again

## 🎯 Quick Checklist

- [ ] Redirect URI matches exactly: `https://rate-my-advisor.vercel.app/api/auth/callback/google`
- [ ] No extra spaces or characters
- [ ] Saved the changes
- [ ] Waited 1-2 minutes

## 🔍 Still Not Working?

Check:
- Client ID is correct: `382231355260-pglml9v85l4k5hkvu3ph45amml1q7bi3.apps.googleusercontent.com`
- Client Secret is set in Vercel
- Redirect URI matches exactly (case-sensitive, no trailing slash)


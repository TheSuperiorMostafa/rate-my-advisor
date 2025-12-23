# Fix Error 401: invalid_client

## The Problem
"The Auth client was not found" + "Error 401: invalid_client" means Google can't find your OAuth client or the redirect URI doesn't match.

## ✅ Step-by-Step Fix

### 1. Verify Client ID in Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your OAuth 2.0 Client ID
3. **Copy the exact Client ID** (should start with `382231355260-...`)
4. Verify it matches what's in Vercel

### 2. Check Redirect URI Format

The redirect URI in Google Console must match **EXACTLY**:

```
https://rate-my-advisor.vercel.app/api/auth/callback/google
```

**Common mistakes:**
- ❌ `https://rate-my-advisor.vercel.app/api/auth/callback/google/` (trailing slash)
- ❌ `http://rate-my-advisor.vercel.app/api/auth/callback/google` (http instead of https)
- ❌ `https://rate-my-advisor.vercel.app/auth/callback/google` (missing /api)
- ❌ Different casing or spaces

### 3. Verify in Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. Check "Authorized redirect URIs" section
4. Make sure you have **EXACTLY**:
   ```
   https://rate-my-advisor.vercel.app/api/auth/callback/google
   ```
5. If it's not there or different, **delete the old one** and add the correct one
6. Click **SAVE**

### 4. Verify Vercel Environment Variables

In Vercel dashboard:
- `GOOGLE_CLIENT_ID` = Your Client ID from Google Console
- `GOOGLE_CLIENT_SECRET` = Your Client Secret from Google Console
- `NEXTAUTH_URL` = `https://rate-my-advisor.vercel.app`

### 5. Wait and Test

1. Wait 2-3 minutes after saving in Google Console
2. Clear browser cache
3. Try signing in again

## 🔍 Still Not Working?

### Check Client ID Format
Your Client ID should look like:
```
382231355260-pglml9v85l4k5hkvu3ph45amml1q7bi3.apps.googleusercontent.com
```

### Check if Client is Active
In Google Cloud Console, make sure:
- OAuth consent screen is configured
- App is in "Testing" or "Production" mode
- Your email is added as a test user (if in Testing mode)

### Verify Application Type
Make sure your OAuth client is set as:
- **Application type**: Web application
- **Authorized JavaScript origins**: (can be empty or add your domain)
- **Authorized redirect URIs**: Must include the exact callback URL


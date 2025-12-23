# Cloudflare Pages OAuth Checklist

Since `NEXTAUTH_URL` is correctly set to `https://rate-my-advisor.com`, check these items:

## ✅ Quick Checklist

### 1. Google Cloud Console Redirect URI
- [ ] Go to: https://console.cloud.google.com/apis/credentials
- [ ] Click your OAuth 2.0 Client ID
- [ ] Verify this EXACT URI is listed:
  ```
  https://rate-my-advisor.com/api/auth/callback/google
  ```
- [ ] No trailing slash
- [ ] Uses `https` (not `http`)
- [ ] Clicked SAVE after adding

### 2. Vercel Environment Variables (Production)
- [ ] `NEXTAUTH_URL` = `https://rate-my-advisor.com` ✅ (You confirmed this)
- [ ] `GOOGLE_CLIENT_ID` = (matches Google Console exactly)
- [ ] `GOOGLE_CLIENT_SECRET` = (matches Google Console exactly)
- [ ] `NEXTAUTH_SECRET` = (32+ character string)
- [ ] All set for **Production** environment (check dropdown)

### 3. Verify Client ID/Secret Match
1. Copy Client ID from Google Console
2. Compare with Vercel `GOOGLE_CLIENT_ID` (Production)
3. Must match **exactly** (no extra spaces, same characters)
4. Repeat for Client Secret

### 4. Redeploy After Changes
- [ ] Redeployed Vercel after updating environment variables
- [ ] Waited 2-3 minutes for deployment to complete

### 5. Test the Flow
- [ ] Cleared browser cache
- [ ] Visit: `https://rate-my-advisor.com/auth/signin`
- [ ] Click "Sign in with Google"
- [ ] Check what happens:
  - Does it redirect to Google? ✅
  - After Google auth, does it redirect back? ❓
  - What error message appears? ❓

## 🔍 What Error Are You Seeing?

### If you see "Error 401: invalid_client"
**Most likely causes:**
1. Redirect URI not in Google Console
2. Client ID/Secret mismatch
3. Wrong Google Cloud project

**Fix:**
- Add redirect URI to Google Console
- Copy exact Client ID/Secret from Google Console
- Update in Vercel (Production)
- Redeploy

### If you see "Error: Configuration"
**Most likely causes:**
1. Missing `NEXTAUTH_SECRET`
2. Missing `NEXTAUTH_URL` (but you have this ✅)

**Fix:**
- Set `NEXTAUTH_SECRET` in Vercel (Production)
- Redeploy

### If you see "Error: OAuthCallback" or "Error: Callback"
**Most likely causes:**
1. OAuth callback processing failed
2. Database connection issue
3. Session/cookie issue

**Fix:**
- Check Vercel logs: `vercel logs --follow`
- Verify database connection
- Check cookie settings

### If redirect goes to wrong domain
**Most likely causes:**
1. `NEXTAUTH_URL` set to Vercel domain (but you have it correct ✅)
2. Proxy not forwarding host correctly

**Fix:**
- Verify `NEXTAUTH_URL` = `https://rate-my-advisor.com` (not Vercel URL)
- Check proxy middleware is forwarding headers correctly

## 🛠️ Debug Steps

### Step 1: Check Browser Console
1. Open DevTools (F12) → Console
2. Try signing in
3. Look for error messages
4. Share the exact error

### Step 2: Check Network Tab
1. Open DevTools (F12) → Network
2. Try signing in
3. Look for failed requests (red)
4. Check the `redirect_uri` parameter in OAuth request
5. Should be: `https://rate-my-advisor.com/api/auth/callback/google`

### Step 3: Check Vercel Logs
```bash
vercel logs --follow
```
Then try signing in and watch for errors.

### Step 4: Test Callback URL Directly
Visit:
```
https://rate-my-advisor.com/api/auth/callback/google?error=test
```
This will show if the route is accessible and configured.

## 📝 Most Common Fix

**90% of OAuth issues are:**
1. Redirect URI not in Google Console ← **Check this first!**
2. Client ID/Secret mismatch ← **Check this second!**
3. Environment variables not set for Production ← **Check this third!**

## 🆘 Still Not Working?

Share:
1. **Exact error message** you see (from browser console or signin page)
2. **What happens** when you click "Sign in with Google"
   - Does it redirect to Google?
   - Does it redirect back?
   - Where does it fail?
3. **Screenshot** of the error (if possible)
4. **Vercel logs** output (if available)

With this information, we can provide a targeted fix!


# Diagnose OAuth Error on Cloudflare Pages

Since `NEXTAUTH_URL` is already set correctly to `https://rate-my-advisor.com`, let's check other potential issues.

## Step 1: Identify the Exact Error

**What error message are you seeing?**

1. **In the browser:**
   - Open DevTools (F12) → Console tab
   - Try signing in with Google
   - Look for error messages

2. **In the browser Network tab:**
   - Open DevTools (F12) → Network tab
   - Try signing in with Google
   - Look for failed requests (red)
   - Check the response for error messages

3. **Common error messages:**
   - `Error 401: invalid_client` → Client ID/Secret or redirect URI issue
   - `Error: Configuration` → Missing NEXTAUTH_SECRET
   - `Error: AccessDenied` → OAuth consent screen issue
   - `Error: Verification` → Token verification failed

## Step 2: Verify Google Console Redirect URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs"

**Must have EXACTLY:**
```
https://rate-my-advisor.com/api/auth/callback/google
```

**Check:**
- ✅ Uses `https` (not `http`)
- ✅ No trailing slash
- ✅ Exact domain match
- ✅ Includes `/api/auth/callback/google`

**If missing, add it and click SAVE**

## Step 3: Verify All Vercel Environment Variables

Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

**Check these are set for PRODUCTION:**

1. **NEXTAUTH_URL** ✅ (You confirmed this is correct: `https://rate-my-advisor.com`)

2. **NEXTAUTH_SECRET**
   - Should be a random 32+ character string
   - Generate with: `openssl rand -base64 32`
   - Must be set for Production

3. **GOOGLE_CLIENT_ID**
   - Should match Google Console exactly
   - Format: `382231355260-xxxxx.apps.googleusercontent.com`
   - Must be set for Production

4. **GOOGLE_CLIENT_SECRET**
   - Should match Google Console exactly
   - Format: `GOCSPX-xxxxx`
   - Must be set for Production

**Important:** Check the environment dropdown - make sure all are set for **Production**, not Preview/Development.

## Step 4: Verify Cloudflare Pages Environment Variables

Even though API runs on Vercel, Cloudflare Pages might need these too:

```bash
wrangler pages secret list --project-name=rate-my-advisor
```

**Or check in Dashboard:**
1. Cloudflare Dashboard → Pages → rate-my-advisor
2. Settings → Environment Variables
3. Verify Production environment has:
   - `NEXTAUTH_URL` = `https://rate-my-advisor.com`
   - `GOOGLE_CLIENT_ID` = (same as Vercel)
   - `GOOGLE_CLIENT_SECRET` = (same as Vercel)
   - `NEXTAUTH_SECRET` = (same as Vercel)

## Step 5: Check the OAuth Request

When you click "Sign in with Google", check what redirect URI is being used:

1. Open DevTools (F12) → Network tab
2. Click "Sign in with Google"
3. Look for the request to `accounts.google.com`
4. Check the `redirect_uri` parameter in the URL

**It should be:**
```
https://rate-my-advisor.com/api/auth/callback/google
```

**If it's different (like `https://rate-my-advisor.vercel.app/...`), that's the problem!**

## Step 6: Check Vercel Logs

```bash
vercel logs --follow
```

Then try signing in and watch for:
- OAuth errors
- Missing environment variables
- Configuration errors

## Step 7: Check Cookie/Session Issues

OAuth uses cookies for sessions. Check if cookies are being set:

1. Open DevTools (F12) → Application tab → Cookies
2. Try signing in
3. Check if `next-auth.session-token` cookie is set
4. Check the domain - should be `rate-my-advisor.com`

**If cookies aren't being set:**
- Check browser isn't blocking third-party cookies
- Check if you're using HTTPS (required for secure cookies)
- Check CORS settings

## Step 8: Test the Redirect URI Directly

Try accessing the callback URL directly (it should show an error, but the error message is helpful):

```
https://rate-my-advisor.com/api/auth/callback/google?error=test
```

This will show you if:
- The route is accessible
- NextAuth is configured correctly
- There are any server errors

## Common Issues & Fixes

### Issue 1: "Error 401: invalid_client"

**Causes:**
- Redirect URI not in Google Console
- Client ID/Secret mismatch
- Wrong Google Cloud project

**Fix:**
1. Verify redirect URI in Google Console
2. Copy exact Client ID/Secret from Google Console
3. Update in Vercel (Production)
4. Redeploy

### Issue 2: "Error: Configuration"

**Causes:**
- Missing `NEXTAUTH_SECRET`
- Missing `NEXTAUTH_URL`

**Fix:**
1. Set `NEXTAUTH_SECRET` in Vercel (Production)
2. Verify `NEXTAUTH_URL` is set correctly
3. Redeploy

### Issue 3: Cookies Not Working

**Causes:**
- Domain mismatch
- CORS issues
- HTTPS required

**Fix:**
1. Ensure using HTTPS
2. Check CORS headers in proxy middleware
3. Verify cookie domain matches your site domain

### Issue 4: Redirect Goes to Wrong Domain

**Causes:**
- `NEXTAUTH_URL` set to Vercel domain
- Proxy not forwarding host correctly

**Fix:**
1. Verify `NEXTAUTH_URL` = `https://rate-my-advisor.com` (not Vercel URL)
2. Check proxy middleware forwards `X-Forwarded-Host` header
3. Redeploy both services

## Quick Test Checklist

- [ ] What exact error message are you seeing?
- [ ] Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
- [ ] `GOOGLE_CLIENT_ID` in Vercel matches Google Console exactly (Production)
- [ ] `GOOGLE_CLIENT_SECRET` in Vercel matches Google Console exactly (Production)
- [ ] `NEXTAUTH_SECRET` is set in Vercel (Production)
- [ ] All variables set for **Production** environment (not Preview)
- [ ] Redeployed Vercel after any changes
- [ ] Checked browser console for errors
- [ ] Checked Network tab for failed requests
- [ ] Checked Vercel logs for server errors

## Next Steps

Once you identify the exact error message, we can provide a targeted fix. The most common issues are:

1. **Redirect URI not in Google Console** (most common)
2. **Client ID/Secret mismatch** (second most common)
3. **Environment variables not set for Production** (third most common)

Share the exact error message and we'll fix it!



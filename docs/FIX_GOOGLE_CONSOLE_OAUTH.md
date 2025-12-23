# Fix Google Console OAuth Configuration

## Issue Found

You have a **corrupted/incomplete redirect URI** in your Google Console:

```
https://rate-my-advisor-6qj1e7crz-hestyas-projects.vercel.app/api/autl
```

This URI is incomplete (should end with `/api/auth/callback/google`). This might be causing OAuth issues.

## ✅ Clean Up Your Google Console Configuration

### Step 1: Remove the Corrupted URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. In "Authorized redirect URIs", find and **DELETE** this line:
   ```
   https://rate-my-advisor-6qj1e7crz-hestyas-projects.vercel.app/api/autl
   ```
4. Click **SAVE**

### Step 2: Verify Authorized JavaScript Origins

Keep these (they look correct):
- ✅ `https://rate-my-advisor.vercel.app`
- ✅ `http://localhost:3000`
- ✅ `https://rate-my-advisor.com`
- ✅ `https://www.rate-my-advisor.com`

### Step 3: Verify Authorized Redirect URIs

Keep only these (remove the corrupted one):

**Production:**
- ✅ `https://rate-my-advisor.com/api/auth/callback/google`
- ✅ `https://www.rate-my-advisor.com/api/auth/callback/google` (if you use www)

**Development:**
- ✅ `http://localhost:3000/api/auth/callback/google`

**Optional (if you still use Vercel directly):**
- ✅ `https://rate-my-advisor.vercel.app/api/auth/callback/google`

**Remove:**
- ❌ `https://rate-my-advisor-6qj1e7crz-hestyas-projects.vercel.app/api/autl` (corrupted)

### Step 4: Final Configuration

**Authorized JavaScript Origins:**
```
https://rate-my-advisor.vercel.app
http://localhost:3000
https://rate-my-advisor.com
https://www.rate-my-advisor.com
```

**Authorized Redirect URIs:**
```
https://rate-my-advisor.com/api/auth/callback/google
https://www.rate-my-advisor.com/api/auth/callback/google
http://localhost:3000/api/auth/callback/google
```

(Optional: Keep `https://rate-my-advisor.vercel.app/api/auth/callback/google` if you access Vercel directly)

### Step 5: Save and Wait

1. Click **SAVE** in Google Console
2. Wait 1-2 minutes for changes to propagate
3. Clear browser cache
4. Test OAuth again

## Why This Matters

Google validates redirect URIs **exactly**. If there's a corrupted URI or typo, it can cause OAuth to fail. The incomplete URI ending in `/api/autl` instead of `/api/auth/callback/google` is definitely wrong.

## After Fixing

1. **Test OAuth:**
   - Visit: `https://rate-my-advisor.com/auth/signin`
   - Click "Sign in with Google"
   - Should work now!

2. **If still not working:**
   - Check Vercel logs: `vercel logs --follow`
   - Verify environment variables match Google Console
   - Check browser console for errors

## Additional Check

Since you're using Cloudflare Pages, make sure:

1. **Vercel environment variables** (Production):
   - `NEXTAUTH_URL` = `https://rate-my-advisor.com` ✅
   - `GOOGLE_CLIENT_ID` = (matches Google Console)
   - `GOOGLE_CLIENT_SECRET` = (matches Google Console)
   - `NEXTAUTH_SECRET` = (set)

2. **All set for Production environment** (not Preview/Development)

3. **Redeployed Vercel** after any changes


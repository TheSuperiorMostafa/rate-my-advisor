# CRITICAL: Fix invalid_client Error

## The Problem
**"Error 401: invalid_client - The Auth client was not found"**

This means the Client ID in Vercel **does not match** what's in Google Console, or it's from a different project.

## 🚨 IMMEDIATE ACTION REQUIRED

### Step 1: Get EXACT Values from Google Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. **Check project dropdown** - make sure you're in the RIGHT project
3. Click your **OAuth 2.0 Client ID**
4. **Copy Client ID** - starts with numbers like `382231355260-...`
5. **Copy Client Secret** - starts with `GOCSPX-...`
6. **Verify it's ENABLED** (not disabled)

### Step 2: Update Vercel Environment Variables

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Find `GOOGLE_CLIENT_ID`
3. **DELETE it** (click the X)
4. **Click "Add New"**
5. **Key:** `GOOGLE_CLIENT_ID`
6. **Value:** Paste EXACT Client ID from Google Console (no spaces)
7. **Environment:** Select **Production** (not Preview!)
8. **Click "Save"**

9. Repeat for `GOOGLE_CLIENT_SECRET`:
   - Delete old one
   - Add new one with EXACT value from Google Console
   - Set for **Production**

### Step 3: Verify NEXTAUTH_URL

1. In Vercel, check `NEXTAUTH_URL`
2. **Must be:** `https://rate-my-advisor.com`
3. **Must be set for Production**
4. If wrong, fix it

### Step 4: REDEPLOY Vercel

**CRITICAL:** After changing environment variables, you MUST redeploy!

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click **"Redeploy"** on latest deployment
3. Wait 2-3 minutes

### Step 5: Verify Redirect URI in Google Console

1. In Google Console → OAuth Client
2. Check "Authorized redirect URIs"
3. **Must have:** `https://rate-my-advisor.com/api/auth/callback/google`
4. If missing, add it and click SAVE

## ✅ Checklist

- [ ] Client ID in Vercel matches Google Console **exactly** (character-by-character)
- [ ] Client Secret in Vercel matches Google Console **exactly** (character-by-character)
- [ ] Both set for **Production** environment (check dropdown!)
- [ ] OAuth client is **Enabled** in Google Console
- [ ] You're in the **correct Google Cloud project**
- [ ] Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
- [ ] `NEXTAUTH_URL` = `https://rate-my-advisor.com` (Production)
- [ ] **Redeployed Vercel** after updating environment variables
- [ ] Cleared browser cache
- [ ] Tested again

## 🔍 Debug: Check What Vercel is Using

After redeploying, check Vercel logs:

```bash
vercel logs --follow
```

Look for:
- `✅ GOOGLE_CLIENT_ID is set: 382231355260-...`
- Compare with Google Console

If they don't match, that's the problem!

## 🆘 Still Not Working?

If you've verified everything above and it still doesn't work:

1. **Create a NEW OAuth client** in Google Console
2. **Copy the new Client ID and Secret**
3. **Update in Vercel** (Production)
4. **Add redirect URI** for the new client
5. **Redeploy**

Sometimes creating a fresh OAuth client resolves issues with corrupted or misconfigured clients.



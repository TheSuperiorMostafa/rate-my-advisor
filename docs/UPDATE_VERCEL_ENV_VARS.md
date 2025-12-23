# Update Vercel Environment Variables

## Your OAuth Credentials

**Get these from Google Cloud Console:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Copy the **Client ID** (starts with numbers like `382231355260-...`)
4. Copy the **Client Secret** (starts with `GOCSPX-...`)

## ✅ Step-by-Step: Update in Vercel

### Step 1: Go to Environment Variables

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

### Step 2: Update GOOGLE_CLIENT_ID

1. Find `GOOGLE_CLIENT_ID` in the list
2. **Check the environment** - must be set for **Production**
3. **Click on it** to edit
4. **Verify the value matches your Google Console Client ID exactly**
   - Should start with numbers like `382231355260-...`
   - Should end with `.apps.googleusercontent.com`
5. **No spaces before or after**
6. **If different, update it**
7. **Make sure it's set for Production** (check the environment dropdown)
8. **Save**

### Step 3: Update GOOGLE_CLIENT_SECRET

1. Find `GOOGLE_CLIENT_SECRET` in the list
2. **Check the environment** - must be set for **Production**
3. **Click on it** to edit
4. **Verify the value matches your Google Console Client Secret exactly**
   - Should start with `GOCSPX-...`
5. **No spaces before or after**
6. **If different, update it**
7. **Make sure it's set for Production** (check the environment dropdown)
8. **Save**

### Step 4: Verify NEXTAUTH_URL

1. Find `NEXTAUTH_URL`
2. **Must be:** `https://rate-my-advisor.com`
3. **Must be set for Production**
4. If wrong, fix it

### Step 5: REDEPLOY (CRITICAL!)

**After updating environment variables, you MUST redeploy:**

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. **Wait 2-3 minutes** for deployment to complete

### Step 6: Verify Redirect URI in Google Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth 2.0 Client ID
3. Check "Authorized redirect URIs"
4. **Must include:**
   ```
   https://rate-my-advisor.com/api/auth/callback/google
   ```
5. If missing, **add it** and click **SAVE**

## ✅ Final Checklist

- [ ] `GOOGLE_CLIENT_ID` in Vercel matches Google Console exactly (Production)
- [ ] `GOOGLE_CLIENT_SECRET` in Vercel matches Google Console exactly (Production)
- [ ] `NEXTAUTH_URL` = `https://rate-my-advisor.com` (Production)
- [ ] Redirect URI `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
- [ ] **Redeployed Vercel** after updating
- [ ] Cleared browser cache
- [ ] Tested OAuth again

## 🆘 If Still Not Working

After redeploying, check Vercel logs:

```bash
vercel logs --follow
```

Look for the startup logs that show:
- `✅ GOOGLE_CLIENT_ID is set: ...` (first 30 characters)

If it shows a different Client ID, the environment variable wasn't updated correctly.


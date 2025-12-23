# Quick Redeploy Vercel to Fix OAuth

## The Issue

After switching to Cloudflare custom domain, OAuth stopped working. This is because Vercel needs to be redeployed with the correct `NEXTAUTH_URL`.

## ✅ Quick Fix (2 minutes)

### Step 1: Verify NEXTAUTH_URL in Vercel

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Find `NEXTAUTH_URL` (Production environment)
3. **Must be:** `https://rate-my-advisor.com`
4. If it's different, **update it now**

### Step 2: Redeploy Vercel

**Option A: Via Dashboard (Easiest)**
1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click the **three dots** (⋯) on the latest deployment
3. Click **"Redeploy"**
4. Wait 2-3 minutes

**Option B: Via CLI**
```bash
vercel --prod
```

### Step 3: Test

1. Wait 2-3 minutes for deployment to complete
2. Clear browser cache
3. Visit: https://rate-my-advisor.com/auth/signin
4. Try signing in with Google

## 🔍 Why This Works

When you redeploy Vercel:
- NextAuth reads the updated `NEXTAUTH_URL`
- OAuth callbacks use the correct domain (`rate-my-advisor.com`)
- Google accepts the callback because it matches the redirect URI

## ⚠️ Important

- **Must redeploy** after changing environment variables
- Changes don't take effect until redeployment
- Wait 2-3 minutes after redeploy before testing

## 🆘 Still Not Working?

After redeploying, check logs:
```bash
vercel logs --follow
```

Look for the redirect callback logs - they'll show what base URL is being used.


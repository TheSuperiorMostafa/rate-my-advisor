# Fix: Missing GOOGLE_CLIENT_SECRET for Production

## 🔴 The Problem

Your `GOOGLE_CLIENT_SECRET` is set for **Development** and **Preview**, but **NOT for Production**!

That's why:
- ✅ Works on localhost (uses Development)
- ❌ Fails in production (Production environment has no secret)

## ✅ The Fix

### Step 1: Add GOOGLE_CLIENT_SECRET for Production

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

2. Find `GOOGLE_CLIENT_SECRET`

3. Click on it to edit

4. **Add it for Production:**
   - In the environment dropdown, select **Production**
   - Paste the value: `GOCSPX-F914_D6zJTXiHoIYFspxZU...` (your full secret)
   - Click **Save**

### Step 2: Verify All Production Variables

Make sure these are set for **Production**:

- ✅ `GOOGLE_CLIENT_ID` = `382231355260-pg1m19v8514k5hkv...` (already set)
- ✅ `GOOGLE_CLIENT_SECRET` = `GOCSPX-F914_D6zJTXiHoIYFspxZU...` (ADD THIS!)
- ✅ `NEXTAUTH_URL` = `https://rate-my-advisor.com`
- ✅ `NEXTAUTH_SECRET` = (your secret)

### Step 3: Clean Up (Optional)

You can keep the Development/Preview versions if you want, but they're not needed for production to work.

### Step 4: Redeploy

After adding the Production secret:
1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

### Step 5: Test

1. Clear browser cache
2. Visit: https://rate-my-advisor.com/auth/signin
3. Click "Sign in with Google"
4. Should work now! ✅

## 🎯 Summary

**The issue:** `GOOGLE_CLIENT_SECRET` was missing for Production environment.

**The fix:** Add `GOOGLE_CLIENT_SECRET` for Production with the same value you have for Development/Preview.


# Google OAuth - Quick Setup Guide

## Step 1: Consent Screen

**Choose: External** ✅

- App name: `Rate My Advisor`
- Support email: `your-email@gmail.com`
- Developer contact: `your-email@gmail.com`
- Save and continue

## Step 2: Create OAuth Client

1. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: `Rate My Advisor Web`
4. **Authorized redirect URIs:**
   ```
   https://rate-my-advisor.vercel.app/api/auth/callback/google
   http://localhost:3000/api/auth/callback/google
   ```
5. Click **Create**
6. **Copy Client ID and Client Secret**

## Step 3: Add to Vercel

Once you have the credentials, I'll add them:

```bash
vercel env add GOOGLE_CLIENT_ID production
vercel env add GOOGLE_CLIENT_SECRET production
```

## Step 4: Test Users (Testing Mode)

Since you chose "External", the app starts in testing mode:
- Go to **OAuth consent screen** → **Test users**
- Add test users (your email, etc.)
- Only test users can sign in until you publish

## Step 5: Publish to Production (Later)

When ready:
- Go to **OAuth consent screen**
- Click **Publish App**
- App becomes available to all Google users

---

**That's it!** Once you share the Client ID and Secret, I'll add them and redeploy.


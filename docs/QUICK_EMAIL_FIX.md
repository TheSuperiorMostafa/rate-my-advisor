# Quick Email Fix

## Problem
Your app is missing `SMTP_USER` and `SMTP_PASSWORD` environment variables.

## Quick Solution: Gmail (2 minutes)

### Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. If 2FA is not enabled, enable it first
4. Select:
   - App: "Mail"
   - Device: "Other (Custom name)"
   - Name: "Rate My Advisor"
5. Click "Generate"
6. **Copy the 16-character password** (looks like: `abcd efgh ijkl mnop`)

### Step 2: Add to Vercel

Run these commands (I'll help you):

```bash
# Add your Gmail address
vercel env add SMTP_USER production
# When prompted, enter: your-email@gmail.com

# Add the App Password
vercel env add SMTP_PASSWORD production  
# When prompted, paste the 16-character password (no spaces)
```

### Step 3: Verify SMTP Settings

Make sure these are set:
- `SMTP_HOST=smtp.gmail.com` ✅ (already set)
- `SMTP_PORT=587` ✅ (already set)
- `SMTP_USER=your-email@gmail.com` ❌ (need to add)
- `SMTP_PASSWORD=your-app-password` ❌ (need to add)
- `EMAIL_FROM=noreply@ratemyadvisor.com` ✅ (already set)

### Step 4: Redeploy

```bash
vercel --prod
```

## Alternative: SendGrid (Better for Production)

If you prefer SendGrid:

1. Sign up: https://sendgrid.com
2. Create API Key
3. Use these values:
   - `SMTP_HOST=smtp.sendgrid.net`
   - `SMTP_USER=apikey`
   - `SMTP_PASSWORD=your-sendgrid-api-key`

## Test

After setup:
1. Visit `/auth/signin`
2. Enter your email
3. Check inbox for magic link


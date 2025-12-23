# Add Resend Environment Variables to Vercel

## Quick Setup

### Step 1: Get Your Resend API Key

1. Go to: https://resend.com/api-keys
2. If you don't have one, click "Create API Key"
3. Name it: "Rate My Advisor Production"
4. **Copy the API key** (starts with `re_...`)

### Step 2: Add to Vercel

Run these commands (you'll be prompted for the values):

```bash
# Add Resend API Key
vercel env add RESEND_API_KEY production

# Add Email From Address
vercel env add EMAIL_FROM production
# Use: noreply@rate-my-advisor.com (if domain verified)
# Or: onboarding@resend.dev (if domain not verified yet)
```

### Step 3: Redeploy

After adding environment variables, redeploy:

```bash
vercel --prod --yes
```

Or redeploy from Vercel Dashboard.

## What Email Address to Use?

**If your domain is verified in Resend:**
- Use: `noreply@rate-my-advisor.com`

**If domain not verified yet:**
- Use: `onboarding@resend.dev` (temporary, works immediately)

You can always update `EMAIL_FROM` later once domain verification completes.


# Get Your Resend API Key

## Quick Steps

1. **Go to Resend Dashboard:**
   - Visit: https://resend.com/api-keys
   - Sign in if needed

2. **Create or Copy API Key:**
   - If you see an existing API key, click to reveal and copy it
   - If no key exists, click "Create API Key"
   - Name it: "Rate My Advisor Production"
   - **Copy the key** (starts with `re_...`)

3. **Share the API Key:**
   - Once you have it, I can add it to Vercel for you
   - Or you can add it yourself using the command below

## Add It Yourself (Alternative)

If you prefer to add it yourself:

```bash
# Add Resend API Key
vercel env add RESEND_API_KEY production
# Paste your API key when prompted

# Update Email From (if domain verified)
vercel env add EMAIL_FROM production
# Use: noreply@rate-my-advisor.com (if domain verified)
# Or: onboarding@resend.dev (if not verified yet)
```

## What Email Address Should I Use?

Since you added DNS records, check if your domain is verified:

1. Go to: https://resend.com/domains
2. Check if `rate-my-advisor.com` shows as "Verified"

**If verified:**
- Use: `noreply@rate-my-advisor.com`

**If not verified yet:**
- Use: `onboarding@resend.dev` (temporary, works immediately)
- You can update later once verification completes



# Resend Email Setup for Magic Links

## Why Resend?

- ✅ **3,000 emails/month free** (perfect for starting)
- ✅ **Super easy setup** - just one API key
- ✅ **No SMTP configuration** needed
- ✅ **Great deliverability** - emails don't go to spam
- ✅ **Built for transactional emails** like magic links

## Step 1: Sign Up for Resend

1. Go to: https://resend.com
2. Click "Sign Up" (free)
3. Verify your email
4. Complete onboarding

## Step 2: Get Your API Key

1. Go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: "Rate My Advisor Production"
4. **Copy the API key** (starts with `re_...`)
5. ⚠️ **Save it now** - you won't see it again!

## Step 3: Add Domain (Optional but Recommended)

For production, you should verify your domain:

1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter: `rate-my-advisor.com`
4. Add the DNS records Resend provides
5. Wait for verification (usually a few minutes)

**If you skip this:** Resend will send from `onboarding@resend.dev` (works but less professional)

## Step 4: Update Code to Use Resend API

Instead of SMTP, we'll use Resend's API directly (better performance and features).

### Install Resend Package

```bash
npm install resend
```

### Update auth-config.ts

The code will be updated to use Resend API instead of SMTP.

## Step 5: Set Environment Variables in Vercel

Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

**Add for Production:**

1. **RESEND_API_KEY**
   - Value: Your Resend API key (starts with `re_...`)
   - Environment: Production

2. **EMAIL_FROM** (if using custom domain)
   - Value: `noreply@rate-my-advisor.com`
   - Or: `onboarding@resend.dev` (if no custom domain)
   - Environment: Production

**Remove these (not needed with Resend):**
- ❌ SMTP_HOST
- ❌ SMTP_PORT
- ❌ SMTP_USER
- ❌ SMTP_PASSWORD

## Step 6: Redeploy

After adding environment variables:
1. Go to Vercel Dashboard → Deployments
2. Click "Redeploy"
3. Wait 2-3 minutes

## Step 7: Test

1. Visit: https://rate-my-advisor.com/auth/signin
2. Enter your email
3. Click "Send magic link"
4. Check your email (including spam folder)
5. Click the link to sign in

## 🎨 Customize Email Template (Optional)

Resend allows you to customize the magic link email. The default NextAuth template works, but you can make it prettier.

## 📊 Monitor Usage

1. Go to: https://resend.com/emails
2. See sent emails, delivery status, opens, clicks
3. Check usage against your 3,000/month limit

## 🆘 Troubleshooting

### Email not sending
- Check `RESEND_API_KEY` is set correctly
- Verify API key is active in Resend dashboard
- Check Vercel logs for errors

### Email in spam
- Verify your domain in Resend
- Use custom domain for `EMAIL_FROM`
- Check Resend dashboard for delivery issues

### Rate limits
- Free tier: 3,000 emails/month
- Upgrade if you need more: https://resend.com/pricing

## 💰 Pricing

- **Free:** 3,000 emails/month
- **Pro:** $20/month for 50,000 emails
- **Enterprise:** Custom pricing

Perfect for starting out - 3,000 emails/month is plenty for a new app!


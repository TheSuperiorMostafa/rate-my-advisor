# Email Setup Guide

## Current Status

Your app needs email for:
1. **NextAuth magic link sign-in** - Users receive login links
2. **.edu email verification** - Students verify their .edu email

## Required Environment Variables

You need these set in Vercel:

```
SMTP_HOST=smtp.gmail.com (or your email provider)
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@ratemyadvisor.com
```

## Setup Options

### Option 1: Gmail (Easiest for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Rate My Advisor"
   - Copy the 16-character password

3. **Add to Vercel:**
   ```bash
   vercel env add SMTP_USER production
   # Enter: your-email@gmail.com
   
   vercel env add SMTP_PASSWORD production
   # Enter: the 16-character app password
   ```

4. **Set SMTP_HOST (if not set):**
   ```bash
   vercel env add SMTP_HOST production
   # Enter: smtp.gmail.com
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up:** https://sendgrid.com (free tier: 100 emails/day)
2. **Create API Key:**
   - Settings → API Keys → Create API Key
   - Copy the key

3. **Add to Vercel:**
   ```bash
   vercel env add SMTP_HOST production
   # Enter: smtp.sendgrid.net
   
   vercel env add SMTP_USER production
   # Enter: apikey
   
   vercel env add SMTP_PASSWORD production
   # Enter: your-sendgrid-api-key
   ```

### Option 3: Resend (Modern, Simple)

1. **Sign up:** https://resend.com (free tier: 3,000 emails/month)
2. **Get API Key:**
   - Dashboard → API Keys → Create
   - Copy the key

3. **Update code to use Resend API** (requires code changes)

## Quick Fix Commands

If using Gmail:

```bash
# Add SMTP_USER
vercel env add SMTP_USER production

# Add SMTP_PASSWORD  
vercel env add SMTP_PASSWORD production

# Verify SMTP_HOST is set
vercel env ls | grep SMTP_HOST
```

## Testing

After setting up:
1. Redeploy: `vercel --prod`
2. Try signing in at `/auth/signin`
3. Check email inbox for magic link

## Troubleshooting

**Error: "Invalid login"**
- Check SMTP_USER and SMTP_PASSWORD are correct
- For Gmail: Make sure you're using an App Password, not your regular password

**Error: "Connection timeout"**
- Check SMTP_HOST and SMTP_PORT are correct
- Try port 465 with secure: true (requires code change)

**Error: "Authentication failed"**
- Verify credentials are correct
- For Gmail: Make sure 2FA is enabled and App Password is generated


# Email Magic Link Authentication Setup

## Overview

Email magic link authentication allows users to sign in/up by receiving a secure link via email. No password required!

## ✅ Implementation Complete

The following has been implemented:

1. **EmailProvider** added to NextAuth configuration
2. **AuthModal** updated with email sign-in option
3. **Sign-in page** updated with email authentication
4. **Email verification page** already exists at `/auth/verify-email`

## 🔧 Required Environment Variables

Add these to your Vercel environment variables (Production):

```bash
SMTP_HOST="smtp.gmail.com"  # or your SMTP provider
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@ratemyadvisor.com"
```

### Setting Up Gmail SMTP

1. Go to your Google Account settings
2. Enable 2-Step Verification
3. Generate an App Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "Rate My Advisor"
   - Copy the 16-character password
4. Use that password as `SMTP_PASSWORD`

### Other SMTP Providers

**SendGrid:**
```
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
```

**Resend:**
```
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASSWORD="your-resend-api-key"
```

## 📧 How It Works

1. User enters email address
2. Clicks "Send magic link"
3. NextAuth sends email with secure link
4. User clicks link in email
5. Automatically signed in and redirected

## 🎨 User Experience

### AuthModal Component
- Shows Google and Email options
- Email form with validation
- Success message when email is sent
- Option to use different email

### Sign-in Page
- Same options as modal
- Email form with divider
- Success state with instructions

## 🔒 Security

- Magic links expire after 24 hours
- Links are single-use (consumed after click)
- Secure token generation by NextAuth
- Email verification required

## 🧪 Testing

1. Set up SMTP environment variables
2. Visit `/auth/signin`
3. Enter your email
4. Click "Send magic link"
5. Check your email
6. Click the link
7. Should be signed in automatically

## 📝 Notes

- The email template is handled by NextAuth by default
- You can customize the email template in `auth-config.ts` if needed
- The `verifyRequest` page is at `/auth/verify-email`
- Users are automatically created on first sign-in

## 🆘 Troubleshooting

### Email not sending
- Check SMTP credentials are correct
- Verify SMTP port (587 for TLS, 465 for SSL)
- Check spam folder
- Review Vercel logs for SMTP errors

### Link not working
- Check `NEXTAUTH_URL` is set correctly
- Verify link hasn't expired (24 hours)
- Ensure link hasn't been used already

### User not created
- Check database connection
- Verify Prisma adapter is working
- Check Vercel logs for errors



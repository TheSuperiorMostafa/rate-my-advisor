# Email Provider Alternatives for Magic Links

## 🏆 Recommended: Resend

**Best for:** Next.js apps, developer-friendly, great free tier

### Why Resend?
- ✅ **3,000 emails/month free** (perfect for starting out)
- ✅ **Super easy setup** - just API key
- ✅ **Built for transactional emails** (magic links, notifications)
- ✅ **Great deliverability** - emails don't go to spam
- ✅ **Simple API** - no SMTP configuration needed
- ✅ **Beautiful email templates** (optional)
- ✅ **Great documentation**

### Setup:
1. Sign up: https://resend.com
2. Get API key from dashboard
3. Use Resend API directly (better than SMTP)

## Other Options

### 1. SendGrid
- **Free tier:** 100 emails/day
- **Pros:** Well-established, reliable
- **Cons:** More complex setup, lower free tier
- **Setup:** SMTP or API

### 2. Postmark
- **Free tier:** 100 emails/month
- **Pros:** Excellent deliverability, great for transactional
- **Cons:** Smaller free tier, more expensive
- **Setup:** SMTP or API

### 3. Brevo (formerly Sendinblue)
- **Free tier:** 300 emails/day
- **Pros:** Good free tier, easy setup
- **Cons:** Less developer-focused
- **Setup:** SMTP

### 4. Mailgun
- **Free tier:** 5,000 emails/month (first 3 months), then 1,000/month
- **Pros:** Good free tier, reliable
- **Cons:** Requires domain verification
- **Setup:** SMTP or API

### 5. AWS SES
- **Free tier:** 62,000 emails/month (if on EC2)
- **Pros:** Very cheap, scalable
- **Cons:** More complex setup, requires AWS account
- **Setup:** SMTP or API

## 💡 Recommendation

**Use Resend** - It's the best balance of:
- Ease of setup
- Free tier
- Developer experience
- Deliverability

See `RESEND_SETUP.md` for step-by-step setup instructions.


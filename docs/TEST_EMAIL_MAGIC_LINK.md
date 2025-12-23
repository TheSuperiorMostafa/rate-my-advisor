# Test Email Magic Link

## ✅ Email Template is Included

The code includes a **full HTML email template** with:
- Branded header with gradient background
- Clear call-to-action button
- Plain text fallback
- Security notice
- Link expiration notice

## 🧪 How to Test

### Step 1: Verify Environment Variables

Check Vercel has:
- ✅ `RESEND_API_KEY` = `re_8TTuJcos_BHkzL9cuntnCQ56W3roxkQkR` (Production)
- ✅ `EMAIL_FROM` = `noreply@rate-my-advisor.com` (Production)

### Step 2: Test the Flow

1. Visit: https://rate-my-advisor.com/auth/signin
2. Enter your email address
3. Click "Send magic link"
4. Check your email inbox (and spam folder)
5. You should receive a **beautiful HTML email** with:
   - Purple gradient header saying "Rate My Advisor"
   - "Sign In" button
   - Link expiration notice

### Step 3: Check Resend Dashboard

1. Go to: https://resend.com/emails
2. You should see the email you just sent
3. Check delivery status
4. See if it was opened/clicked

## 🔍 Verify Email is Sending

### Check Vercel Logs

After trying to send an email, check logs:

```bash
vercel logs <deployment-id>
```

Look for:
- `📤 Sending email via Resend to...`
- `✅ Magic link sent via Resend...`
- Or `❌ Resend API error:` if there's an issue

### Check Resend Dashboard

1. Go to: https://resend.com/emails
2. See all sent emails
3. Check delivery status
4. View email content

## 📧 Email Template Details

The email includes:
- **HTML version:** Beautiful styled email with button
- **Text version:** Plain text fallback for email clients that don't support HTML
- **Subject:** "Sign in to rate-my-advisor.com"
- **From:** noreply@rate-my-advisor.com (or onboarding@resend.dev if domain not verified)

## 🆘 If Email Doesn't Send

### Check 1: Resend API Key
- Verify `RESEND_API_KEY` is set in Vercel (Production)
- Check it matches: `re_8TTuJcos_BHkzL9cuntnCQ56W3roxkQkR`

### Check 2: Domain Verification
- If using `noreply@rate-my-advisor.com`, domain must be verified in Resend
- Check: https://resend.com/domains
- If not verified, use `onboarding@resend.dev` temporarily

### Check 3: Vercel Logs
- Look for error messages
- Check if Resend API is being called
- Verify email address format

### Check 4: Resend Dashboard
- Go to: https://resend.com/emails
- See if email appears (even if failed)
- Check error messages

## ✅ Expected Behavior

When you click "Send magic link":
1. ✅ Button shows "Sending..." state
2. ✅ Success message appears: "Check your email"
3. ✅ Email arrives within seconds
4. ✅ Email has beautiful HTML template
5. ✅ Clicking link signs you in

The template is definitely there and will be used when `RESEND_API_KEY` is set!


# Email Troubleshooting

## Changes Made

1. ✅ Added `secure: false` and `requireTLS: true` to SMTP config
2. ✅ Updated `EMAIL_FROM` to match your Gmail address (Gmail requirement)
3. ✅ Improved error messages to show actual errors

## Gmail Requirements

Gmail requires:
- **FROM address must match authenticated user** - Fixed! ✅
- **App Password** (not regular password) - You have this ✅
- **TLS encryption** - Added `requireTLS: true` ✅

## Common Issues

### Issue: "Invalid login"
- **Solution:** Make sure you're using an App Password, not your regular Gmail password
- **Check:** Go to https://myaccount.google.com/apppasswords and verify

### Issue: "FROM address mismatch"
- **Solution:** EMAIL_FROM must match SMTP_USER (or be an alias)
- **Fixed:** Changed EMAIL_FROM to `superiormostafa@gmail.com`

### Issue: "Connection timeout"
- **Solution:** Check SMTP_HOST is `smtp.gmail.com` and SMTP_PORT is `587`
- **Alternative:** Try port `465` with `secure: true`

### Issue: "Authentication failed"
- **Solution:** 
  1. Verify 2FA is enabled on Gmail
  2. Generate a new App Password
  3. Make sure no spaces in the password when adding to Vercel

## Testing

After deployment:
1. Visit `/auth/signin`
2. Enter your email
3. Check browser console for detailed error (if any)
4. Check Gmail inbox (and spam folder)

## Next Steps

If it still doesn't work:
1. Check Vercel logs for detailed error
2. Try generating a new App Password
3. Consider using SendGrid for production (more reliable)


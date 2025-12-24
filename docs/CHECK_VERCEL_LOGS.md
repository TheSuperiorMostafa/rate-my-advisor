# How to Check Vercel Logs for Email Authentication Errors

## The Error You're Seeing

The Vercel logs show an error in `sendVerificationRequest` but the error message is cut off. We need to see the full error to fix it.

## How to View Full Logs

### Option 1: Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/hestyas-projects/rate-my-advisor

2. **Click "Logs" tab** (or go to: https://vercel.com/hestyas-projects/rate-my-advisor/logs)

3. **Filter by Function**
   - Look for logs from `/api/auth/signin/email`
   - Or search for: `sendVerificationRequest`

4. **Look for Error Messages**
   - Search for: `❌` or `Error` or `Failed`
   - The full error message should be there

### Option 2: Vercel CLI

```bash
# Get latest deployment ID
vercel ls

# View logs for that deployment
vercel logs <deployment-url>
```

## What to Look For

After the new deployment (with logging), you should see:

1. **Configuration Check** (at startup):
   ```
   🔍 NextAuth Configuration Check (Production):
      RESEND_API_KEY: re_8TTuJcos... ✅ or ❌ NOT SET
      EMAIL_FROM: noreply@rate-my-advisor.com ✅ or ❌ NOT SET
   ```

2. **When Email is Sent**:
   ```
   📧 Sending magic link to user@example.com via Resend
   📧 Email configuration: { from: '...', nextAuthUrl: '...', hasApiKey: true }
   ```

3. **If There's an Error**:
   ```
   ❌ Resend email error: [error message]
      Error message: [detailed message]
      Error stack: [stack trace]
   ```

## Common Issues Based on Logs

### If you see "RESEND_API_KEY: ❌ NOT SET"
- **Problem**: Environment variable not available at runtime
- **Fix**: 
  1. Go to Vercel → Settings → Environment Variables
  2. Verify `RESEND_API_KEY` is set for **Production**
  3. **Redeploy** after adding/updating

### If you see "Resend API error"
- **Problem**: Resend API is rejecting the request
- **Check**:
  - API key is valid (not revoked)
  - `EMAIL_FROM` domain is verified in Resend
  - API key has correct permissions

### If you see "Failed to send email via Resend"
- **Problem**: Network or API issue
- **Check**: Resend dashboard for API status

## Next Steps

1. **Wait for new deployment** (triggered by the push)
2. **Check Vercel logs** using the steps above
3. **Look for the detailed error message**
4. **Share the full error** so we can fix it

The new logging will show exactly what's happening!


# How to Check Vercel Logs for OAuth Errors

## Quick Method: Vercel Dashboard

1. **Go to your deployments:**
   - https://vercel.com/hestyas-projects/rate-my-advisor/deployments

2. **Click on the latest deployment** (the one that just failed)

3. **Click the "Functions" tab** at the top

4. **Look for errors:**
   - Errors will show in **red**
   - Look for functions like `/api/auth/[...nextauth]` or `/api/auth/callback/google`
   - Click on any function to see detailed logs

5. **Check the logs for:**
   - `❌` symbols (error markers)
   - `Error:` messages
   - Stack traces
   - Database connection errors
   - OAuth callback errors

## Common OAuth Errors After Redirect

### Error: "Database connection failed"
- **Fix:** Check `DATABASE_URL` environment variable in Vercel

### Error: "User creation failed"
- **Fix:** Check database schema matches Prisma schema

### Error: "Session creation failed"
- **Fix:** Check `NEXTAUTH_SECRET` is set

### Error: "Redirect callback failed"
- **Fix:** Check `NEXTAUTH_URL` matches your domain

## Using Vercel CLI

```bash
# Follow logs in real-time
vercel logs --follow

# Filter for errors only
vercel logs --follow | grep -i error

# Filter for OAuth-related logs
vercel logs --follow | grep -i "oauth\|auth\|signin"
```

## What to Look For

After OAuth redirect, check for these log messages:

1. **✅ Sign in attempt:** - Should show user email and provider
2. **❌ Sign in error:** - This is where the error is happening
3. **❌ Database error:** - Database connection or query issues
4. **❌ OAuth error:** - OAuth-specific errors
5. **❌ Error in session callback:** - Session creation issues
6. **❌ Error in jwt callback:** - Token creation issues

## Next Steps

Once you find the error in the logs:

1. **Copy the error message** and stack trace
2. **Check the specific function** that's failing
3. **Look for environment variable issues**
4. **Check database connectivity**

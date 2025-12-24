# Complete Fix for OAuth Error 401: invalid_client

## The Problem

You were getting:
```
Access blocked: Authorization Error
The OAuth client was not found.
Error 401: invalid_client
```

This worked on localhost but failed in production (Vercel).

## Root Causes Identified

1. **Environment variables had quotes and newlines** - Most common issue
2. **Prisma TypeScript type errors** - Blocking deployment
3. **PKCE code verifier cookie issues** - Causing callback failures
4. **JWT callback not handling Google OAuth correctly** - Preventing login

## Complete Fix Applied

### 1. Fixed Environment Variables in Vercel

**Problem:** Environment variables in Vercel had quotes and newline characters (`\n`) that were being included in the actual values.

**Solution:**
```bash
# Delete and re-add variables without quotes
vercel env rm GOOGLE_CLIENT_ID production --yes
vercel env rm GOOGLE_CLIENT_SECRET production --yes
vercel env rm NEXTAUTH_URL production --yes

# Re-add with clean values (no quotes, no spaces)
# Replace YOUR_CLIENT_ID with your actual Client ID from Google Console
echo "YOUR_CLIENT_ID.apps.googleusercontent.com" | vercel env add GOOGLE_CLIENT_ID production
# Replace YOUR_CLIENT_SECRET with your actual Client Secret from Google Console
echo "YOUR_CLIENT_SECRET" | vercel env add GOOGLE_CLIENT_SECRET production
echo "https://rate-my-advisor.com" | vercel env add NEXTAUTH_URL production
```

**Key Points:**
- ✅ No quotes around values
- ✅ No spaces before/after
- ✅ Must be set for **Production** environment
- ✅ Copy-paste directly from Google Console

### 2. Improved Environment Variable Parsing in Code

**File:** `src/lib/auth-config.ts`

**Problem:** Even after fixing Vercel, the code needed to handle edge cases where quotes or newlines might still be present.

**Solution:**
```typescript
// Strip quotes and newlines if present (some .env files add quotes and newlines)
const googleClientId = (process.env.GOOGLE_CLIENT_ID || "")
  .replace(/^["']|["']$/g, "")  // Remove surrounding quotes
  .replace(/\\n/g, "")           // Remove literal \n characters
  .trim();                      // Remove whitespace

const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "")
  .replace(/^["']|["']$/g, "")  // Remove surrounding quotes
  .replace(/\\n/g, "")          // Remove literal \n characters
  .trim();                      // Remove whitespace

const nextAuthUrl = (process.env.NEXTAUTH_URL || "")
  .replace(/^["']|["']$/g, "")  // Remove surrounding quotes
  .replace(/\\n/g, "")          // Remove literal \n characters
  .trim();                      // Remove whitespace
```

**Why This Works:**
- Handles quotes that might be added by Vercel UI or export
- Removes newline characters that can break OAuth
- Trims whitespace that can cause mismatches

### 3. Fixed PKCE Code Verifier Error

**Error:** `InvalidCheck: pkceCodeVerifier value could not be parsed`

**Problem:** NextAuth v5 uses PKCE (Proof Key for Code Exchange) for OAuth security. The code verifier is stored in cookies, and if cookies aren't configured properly, the callback can't verify the PKCE challenge.

**Solution:** Added explicit cookie configuration in `authOptions`:

```typescript
cookies: {
  sessionToken: {
    name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
  callbackUrl: {
    name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.callback-url`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
  csrfToken: {
    name: `${process.env.NODE_ENV === "production" ? "__Host-" : ""}next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
    },
  },
  pkceCodeVerifier: {
    name: `${process.env.NODE_ENV === "production" ? "__Secure-" : ""}next-auth.pkce.code_verifier`,
    options: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15, // 15 minutes
    },
  },
},
```

**Key Points:**
- Uses `__Secure-` prefix in production (requires HTTPS)
- Uses `__Host-` prefix for CSRF token (stricter security)
- `httpOnly: true` - Prevents JavaScript access (security)
- `sameSite: "lax"` - Allows cross-site requests for OAuth
- `secure: true` in production - Requires HTTPS
- `maxAge: 60 * 15` - PKCE code verifier expires in 15 minutes

### 4. Fixed JWT Callback for Google OAuth

**Problem:** After OAuth redirect, user wasn't being logged in because the JWT callback wasn't properly handling Google OAuth when the user object was present.

**Solution:** Reorganized JWT callback to handle Google OAuth first:

```typescript
async jwt({ token, user, account, trigger }) {
  console.log("🔄 JWT callback called:", {
    hasUser: !!user,
    hasAccount: !!account,
    provider: account?.provider,
    hasTokenSub: !!token.sub,
    trigger,
  });

  // For Google OAuth, when user is present (first time login)
  if (user && account?.provider === "google") {
    console.log("✅ Google OAuth - setting token from user object");
    token.sub = user.id;
    token.email = user.email || "";
    token.name = user.name || "";
    token.role = (user as any).role || "USER";
    token.eduVerified = (user as any).eduVerified || false;
    
    // Also fetch from DB to get full user data
    try {
      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (dbUser) {
        token.role = dbUser.role as "USER" | "ADMIN";
        token.eduVerified = dbUser.eduVerified;
        // ... handle firstName/lastName
      }
    } catch (error) {
      console.error("❌ Error fetching user in JWT callback:", error);
    }
    return token;
  }

  // ... handle other providers
}
```

**Why This Works:**
- Handles Google OAuth immediately when user object is present
- Sets token from user object first (ensures login works)
- Then fetches from DB to get complete user data
- Proper logging helps debug issues

### 5. Added Detailed Logging

**Added throughout the code:**
- OAuth configuration logging
- Sign-in attempt logging
- JWT callback logging
- Error logging with details

**Example:**
```typescript
if (process.env.NODE_ENV === "production") {
  console.log("🔍 Google OAuth Provider Configuration:");
  console.log("   Client ID:", googleClientId.substring(0, 30) + "...");
  console.log("   Redirect URI:", redirectUri);
  console.log("   Expected in Google Console:", redirectUri);
}
```

## Verification Steps

### 1. Check Environment Variables

Run the verification script:
```bash
./scripts/verify-oauth-values.sh
```

Or manually check:
```bash
vercel env pull .env.check --environment=production
cat .env.check | grep -E "^(GOOGLE_CLIENT_ID|GOOGLE_CLIENT_SECRET|NEXTAUTH_URL)="
```

**Should show:**
- No quotes around values
- No `\n` characters
- Correct values matching Google Console

### 2. Check Vercel Logs

After OAuth attempt, check logs for:
- `🔍 Google OAuth Provider Configuration:` - Shows config
- `✅ Sign in attempt:` - Shows OAuth started
- `🔄 JWT callback called:` - Shows token creation
- `✅ Google OAuth - setting token from user object:` - Confirms login

### 3. Test OAuth Flow

1. Go to sign-in page
2. Click "Sign in with Google"
3. Should redirect to Google
4. After Google login, should redirect back
5. Should be logged in (check session)

## Common Issues and Solutions

### Issue: Still getting 401 error

**Check:**
1. Environment variables in Vercel (no quotes, no spaces)
2. Client ID matches Google Console exactly
3. Redirect URI matches Google Console exactly
4. Variables set for **Production** (not Preview)

**Fix:**
```bash
# Delete and re-add variables
vercel env rm GOOGLE_CLIENT_ID production --yes
echo "YOUR_CLIENT_ID" | vercel env add GOOGLE_CLIENT_ID production
```

### Issue: PKCE error after redirect

**Check:**
1. Cookies are configured (see section 3 above)
2. Using HTTPS in production
3. `NEXTAUTH_URL` is correct

**Fix:** Ensure cookie configuration is in `authOptions` (already done)

### Issue: Redirects but not logged in

**Check:**
1. JWT callback is being called (check logs)
2. Token is being set (check logs)
3. Session callback is working

**Fix:** JWT callback should handle Google OAuth first (already done)

## Files Modified

1. **`src/lib/auth-config.ts`**
   - Improved environment variable parsing
   - Added cookie configuration
   - Fixed JWT callback for Google OAuth
   - Added detailed logging

2. **Vercel Environment Variables**
   - `GOOGLE_CLIENT_ID` - Cleaned (no quotes)
   - `GOOGLE_CLIENT_SECRET` - Cleaned (no quotes)
   - `NEXTAUTH_URL` - Cleaned (no quotes, no trailing slash)

## Summary

The OAuth 401 error was fixed by:
1. ✅ Removing quotes/newlines from Vercel environment variables
2. ✅ Improving code to handle edge cases in env var parsing
3. ✅ Configuring cookies properly for PKCE
4. ✅ Fixing JWT callback to handle Google OAuth correctly
5. ✅ Adding comprehensive logging for debugging

All changes are committed and deployed. OAuth should now work correctly in production.


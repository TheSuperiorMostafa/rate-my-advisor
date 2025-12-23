# OAuth Setup Guide - Updated for Modal Flow

## Current Setup

The app now uses a **modal-based authentication** flow, but the OAuth redirects still work the same way. Here's what you need to ensure:

## ✅ Required Redirect URIs in Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

Click your OAuth 2.0 Client ID, then add these **exact** redirect URIs:

### Production
```
https://rate-my-advisor.com/api/auth/callback/google
https://www.rate-my-advisor.com/api/auth/callback/google
```

### Development
```
http://localhost:3000/api/auth/callback/google
```

**Important:**
- ✅ Must use `https` for production (not `http`)
- ✅ Must include `/api/auth/callback/google` (exact path)
- ✅ No trailing slashes
- ✅ Case-sensitive

## ✅ Vercel Environment Variables

Make sure these are set for **Production**:

1. **NEXTAUTH_URL** = `https://rate-my-advisor.com`
2. **GOOGLE_CLIENT_ID** = Your Client ID from Google Console
3. **GOOGLE_CLIENT_SECRET** = Your Client Secret from Google Console
4. **NEXTAUTH_SECRET** = Generated secret (32+ chars)

## How the Modal Flow Works

1. User clicks "Sign Up" or "Sign In" → Modal opens
2. User clicks "Sign up/in with Google" → Redirects to Google
3. User authenticates with Google → Google redirects back to `/api/auth/callback/google`
4. NextAuth processes the callback → Creates/updates user account
5. User is redirected to `/` (homepage) → Modal is closed (user navigated away)

## OAuth Configuration Updates

The OAuth provider now includes:
- `prompt: "consent"` - Ensures users see consent screen (good for new signups)
- `access_type: "offline"` - Allows refresh tokens if needed
- Better error handling in signIn callback
- Redirect validation to prevent open redirects

## Testing

### Localhost
1. Make sure `http://localhost:3000/api/auth/callback/google` is in Google Console
2. Set `NEXTAUTH_URL=http://localhost:3000` in `.env.local`
3. Test the modal flow

### Production
1. Make sure `https://rate-my-advisor.com/api/auth/callback/google` is in Google Console
2. Verify all environment variables are set in Vercel (Production)
3. Redeploy after any changes
4. Test the modal flow

## Troubleshooting

### "invalid_client" Error
- Check redirect URI matches exactly in Google Console
- Verify Client ID/Secret in Vercel match Google Console
- Ensure NEXTAUTH_URL is correct

### Modal Doesn't Close After Auth
- This is expected - user navigates away during OAuth
- Modal will be closed when user returns to homepage
- Consider adding a check to close modal on successful auth

### Redirect Loop
- Check NEXTAUTH_URL matches your actual domain
- Verify redirect callback is working
- Check browser console for errors

## Next Steps

If you want to improve the modal experience:
1. Add a check to close modal when user returns from OAuth
2. Show a "Redirecting to Google..." message
3. Handle OAuth errors more gracefully in the modal


# Add Redirect URIs - No Wildcards

## ❌ Google Doesn't Support Wildcards

You cannot use `https://*.vercel.app/...` - Google requires exact URLs.

## ✅ Add These Specific URIs

Add **ALL** of these redirect URIs to your Google OAuth client:

### Production URIs:
1. `https://rate-my-advisor.vercel.app/api/auth/callback/google`
2. `https://rate-my-advisor-6qj1e7crz-hestyas-projects.vercel.app/api/auth/callback/google`

### Development URI:
3. `http://localhost:3000/api/auth/callback/google`

## 📋 Step-by-Step

1. **Go to:** https://console.cloud.google.com/apis/credentials
2. **Click** your OAuth 2.0 Client ID (382231355260-...)
3. **Scroll to** "Authorized redirect URIs"
4. **Add each URI one by one:**
   - Click "+ ADD URI"
   - Paste: `https://rate-my-advisor.vercel.app/api/auth/callback/google`
   - Click "+ ADD URI" again
   - Paste: `https://rate-my-advisor-6qj1e7crz-hestyas-projects.vercel.app/api/auth/callback/google`
   - Click "+ ADD URI" again
   - Paste: `http://localhost:3000/api/auth/callback/google`
5. **Click "SAVE"** at the bottom
6. **Wait 1-2 minutes** for changes to propagate
7. **Try signing in again**

## 🎯 Why Multiple URIs?

- Vercel uses different URLs for different deployments
- The main domain redirects to the latest deployment
- Each deployment has its own URL
- Adding both covers all cases

## ✅ After Adding

You should have 3 redirect URIs total. Then try signing in again!


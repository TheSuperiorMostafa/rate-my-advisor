# Testing Guide - Production Website

## 🌐 Your Production URLs

### Main Domain
**https://rate-my-advisor.vercel.app**

### Latest Deployment
Check Vercel dashboard for the latest deployment URL, or use the main domain above.

## 🧪 Testing Google OAuth Sign-In

### Step 1: Add Yourself as Test User (If in Testing Mode)

1. Go to: https://console.cloud.google.com/
2. Navigate to: **APIs & Services** → **OAuth consent screen**
3. Scroll to **Test users** section
4. Click **+ ADD USERS**
5. Add your email address (the one you'll use to sign in)
6. Click **ADD**

### Step 2: Test Sign-In

1. **Visit the sign-in page:**
   ```
   https://rate-my-advisor.vercel.app/auth/signin
   ```

2. **Click "Sign in with Google"**
   - You should see the Google sign-in popup

3. **Sign in with your Google account**
   - Use the email you added as a test user

4. **Grant permissions**
   - Click "Allow" to grant access

5. **You should be redirected back**
   - You'll be signed in and redirected to the home page
   - You should see your name/email in the header (if AuthButton is visible)

## ✅ What to Check

- [ ] Sign-in page loads correctly
- [ ] Google sign-in button appears
- [ ] Clicking button opens Google sign-in popup
- [ ] Can sign in with Google account
- [ ] Redirects back to app after sign-in
- [ ] User is authenticated (can access protected routes)
- [ ] Can sign out

## 🐛 Troubleshooting

### Error: "Access blocked: This app's request is invalid"
- **Solution:** Make sure you added yourself as a test user in Google Cloud Console

### Error: "redirect_uri_mismatch"
- **Solution:** Check that the redirect URI in Google Console matches:
  ```
  https://rate-my-advisor.vercel.app/api/auth/callback/google
  ```

### Error: "Invalid client"
- **Solution:** Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set in Vercel

### Sign-in works but user not created
- **Solution:** Check database connection and Prisma adapter

## 📝 Next Steps After Testing

1. **Create Admin User:**
   - After signing in, update your user role to ADMIN in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
   ```

2. **Test Admin Dashboard:**
   - Visit `/admin/moderation`
   - Should be accessible if you're an admin

3. **Publish App (When Ready):**
   - Go to Google Cloud Console → OAuth consent screen
   - Click "Publish App"
   - App becomes available to all Google users

## 🔗 Quick Links

- **Sign In:** https://rate-my-advisor.vercel.app/auth/signin
- **Home:** https://rate-my-advisor.vercel.app
- **Admin:** https://rate-my-advisor.vercel.app/admin/moderation (requires ADMIN role)



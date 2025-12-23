# How to Find Test Users in Google Cloud Console

## 📍 Step-by-Step Location

### Option 1: Direct Path

1. **Go to Google Cloud Console:**
   ```
   https://console.cloud.google.com/
   ```

2. **Select your project** (top dropdown)

3. **Navigate to OAuth consent screen:**
   - Click **☰ (Menu)** → **APIs & Services** → **OAuth consent screen**
   - OR direct link: https://console.cloud.google.com/apis/credentials/consent

4. **Scroll down** on the OAuth consent screen page

5. **Look for "Test users" section:**
   - It's usually near the bottom of the page
   - Below the "Scopes" section
   - Above or near "Publishing status"

### Option 2: If You Don't See It

The "Test users" section only appears if:
- ✅ You've selected "External" user type
- ✅ You've filled in the required consent screen fields
- ✅ You've saved the consent screen configuration

**If it's not there:**
1. Make sure you completed the consent screen setup
2. Fill in all required fields (App name, Support email, etc.)
3. Click "Save and Continue" through all steps
4. Then scroll down - Test users should appear

### Option 3: Visual Guide

The page structure should look like:
```
OAuth consent screen
├── App information
│   ├── App name
│   ├── User support email
│   └── ...
├── App domain
├── Authorized domains
├── Developer contact information
├── Scopes
└── Test users  ← LOOK HERE
    └── + ADD USERS button
```

## 🎯 Quick Alternative

If you can't find it, you can also:
1. **Publish the app** (if you're ready)
   - Scroll to "Publishing status"
   - Click "PUBLISH APP"
   - This makes it available to all users (no test users needed)

2. **Or skip test users for now:**
   - Try signing in anyway
   - If you get an error, we'll troubleshoot

## 📸 Screenshot Location

The "Test users" section should look like this:
```
┌─────────────────────────────────────┐
│ Test users                          │
│                                     │
│ Add test users to your app. Test    │
│ users can access your app even     │
│ when it's in testing mode.          │
│                                     │
│ [Email addresses]                  │
│                                     │
│ [+ ADD USERS]                       │
└─────────────────────────────────────┘
```

## 🔍 Still Can't Find It?

Try this:
1. Make sure you're in the correct project
2. Check that you selected "External" (not "Internal")
3. Complete all consent screen steps first
4. Refresh the page
5. Look for "Publishing status" - Test users is usually right above it


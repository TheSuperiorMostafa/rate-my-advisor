#!/bin/bash

# Script to verify OAuth environment variables match Google Console

echo "🔍 Verifying OAuth Configuration..."
echo ""

# Pull production environment variables
echo "📥 Pulling production environment variables from Vercel..."
vercel env pull .env.vercel.check --environment=production --yes 2>&1 | grep -v "Downloading" | grep -v "Created"

echo ""
echo "📋 Current Values in Vercel (Production):"
echo ""

# Extract and display GOOGLE_CLIENT_ID
GOOGLE_CLIENT_ID=$(grep "^GOOGLE_CLIENT_ID=" .env.vercel.check 2>/dev/null | cut -d'=' -f2- | sed 's/^"//' | sed 's/"$//' | sed 's/\\n$//' | tr -d '\n')
if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "❌ GOOGLE_CLIENT_ID: NOT SET"
else
    echo "✅ GOOGLE_CLIENT_ID: $GOOGLE_CLIENT_ID"
    echo "   Length: ${#GOOGLE_CLIENT_ID} characters"
    if [[ "$GOOGLE_CLIENT_ID" != *".apps.googleusercontent.com"* ]]; then
        echo "   ⚠️  WARNING: Doesn't contain '.apps.googleusercontent.com'"
    fi
    if [[ "$GOOGLE_CLIENT_ID" == *"\""* ]] || [[ "$GOOGLE_CLIENT_ID" == *"'"* ]]; then
        echo "   ⚠️  WARNING: Contains quotes!"
    fi
    if [[ "$GOOGLE_CLIENT_ID" == *"\\n"* ]]; then
        echo "   ⚠️  WARNING: Contains literal \\n characters!"
    fi
fi

echo ""

# Extract and display GOOGLE_CLIENT_SECRET (first 20 chars)
GOOGLE_CLIENT_SECRET=$(grep "^GOOGLE_CLIENT_SECRET=" .env.vercel.check 2>/dev/null | cut -d'=' -f2- | sed 's/^"//' | sed 's/"$//' | sed 's/\\n$//' | tr -d '\n')
if [ -z "$GOOGLE_CLIENT_SECRET" ]; then
    echo "❌ GOOGLE_CLIENT_SECRET: NOT SET"
else
    echo "✅ GOOGLE_CLIENT_SECRET: ${GOOGLE_CLIENT_SECRET:0:20}... (hidden)"
    echo "   Length: ${#GOOGLE_CLIENT_SECRET} characters"
    if [[ "$GOOGLE_CLIENT_SECRET" != "GOCSPX-"* ]]; then
        echo "   ⚠️  WARNING: Doesn't start with 'GOCSPX-'"
        echo "   Starts with: ${GOOGLE_CLIENT_SECRET:0:10}..."
    fi
    if [[ "$GOOGLE_CLIENT_SECRET" == *"\""* ]] || [[ "$GOOGLE_CLIENT_SECRET" == *"'"* ]]; then
        echo "   ⚠️  WARNING: Contains quotes!"
    fi
    if [[ "$GOOGLE_CLIENT_SECRET" == *"\\n"* ]]; then
        echo "   ⚠️  WARNING: Contains literal \\n characters!"
    fi
fi

echo ""

# Extract and display NEXTAUTH_URL
NEXTAUTH_URL=$(grep "^NEXTAUTH_URL=" .env.vercel.check 2>/dev/null | cut -d'=' -f2- | sed 's/^"//' | sed 's/"$//' | sed 's/\\n$//' | tr -d '\n')
if [ -z "$NEXTAUTH_URL" ]; then
    echo "❌ NEXTAUTH_URL: NOT SET"
else
    echo "✅ NEXTAUTH_URL: $NEXTAUTH_URL"
    echo "   Redirect URI will be: ${NEXTAUTH_URL%/}/api/auth/callback/google"
    if [[ "$NEXTAUTH_URL" == *"/" ]]; then
        echo "   ⚠️  WARNING: Has trailing slash"
    fi
    if [[ "$NEXTAUTH_URL" != "https://"* ]]; then
        echo "   ⚠️  WARNING: Doesn't start with 'https://'"
    fi
    if [[ "$NEXTAUTH_URL" == *"\""* ]] || [[ "$NEXTAUTH_URL" == *"'"* ]]; then
        echo "   ⚠️  WARNING: Contains quotes!"
    fi
    if [[ "$NEXTAUTH_URL" == *"\\n"* ]]; then
        echo "   ⚠️  WARNING: Contains literal \\n characters!"
    fi
fi

echo ""
echo "📝 Next Steps:"
echo "1. Go to: https://console.cloud.google.com/apis/credentials"
echo "2. Click your OAuth 2.0 Client ID"
echo "3. Compare the Client ID above with Google Console (must match EXACTLY)"
echo "4. Verify the redirect URI in Google Console matches:"
echo "   ${NEXTAUTH_URL%/}/api/auth/callback/google"
echo ""
echo "5. If values have quotes or \\n, delete and re-add them in Vercel:"
echo "   https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables"
echo ""
echo "6. After fixing, redeploy your application"

# Clean up
rm -f .env.vercel.check


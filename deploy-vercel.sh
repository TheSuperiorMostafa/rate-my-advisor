#!/bin/bash
# Deploy to Vercel via CLI

echo "🚀 Deploying to Vercel..."
echo ""

# Check if logged in
if ! vercel whoami &>/dev/null; then
    echo "❌ Not logged in to Vercel"
    echo "Please run: vercel login"
    echo "Then run this script again"
    exit 1
fi

echo "✅ Logged in to Vercel"
echo ""

# Deploy
echo "📤 Deploying project..."
vercel --yes

echo ""
echo "✅ Deployment started!"
echo ""
echo "Next steps:"
echo "1. Add environment variables in Vercel Dashboard"
echo "2. Set up database"
echo "3. Run migrations"
echo ""
echo "See NEXT_STEPS.md for details"


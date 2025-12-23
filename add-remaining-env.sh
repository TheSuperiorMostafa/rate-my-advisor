#!/bin/bash
# Script to add remaining environment variables

echo "📝 Adding remaining environment variables..."
echo ""

# Add SMTP_USER
read -p "Enter your SMTP email (e.g., your-email@gmail.com): " SMTP_USER
if [ ! -z "$SMTP_USER" ]; then
    echo "$SMTP_USER" | vercel env add SMTP_USER production
    echo "✅ Added SMTP_USER"
fi

# Add SMTP_PASSWORD
read -p "Enter your SMTP app password: " SMTP_PASSWORD
if [ ! -z "$SMTP_PASSWORD" ]; then
    echo "$SMTP_PASSWORD" | vercel env add SMTP_PASSWORD production
    echo "✅ Added SMTP_PASSWORD"
fi

echo ""
echo "✅ Done!"
echo ""
echo "Next: Set up database and add DATABASE_URL"



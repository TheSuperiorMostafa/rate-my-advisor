#!/bin/bash

# Deployment Script
# Usage: ./scripts/deploy.sh

set -e

echo "🚀 Starting deployment process..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
  echo "Installing Vercel CLI..."
  npm i -g vercel
fi

# Check if logged in
if ! vercel whoami &> /dev/null; then
  echo "Please login to Vercel:"
  vercel login
fi

# Pull environment variables
echo "📥 Pulling environment variables..."
vercel env pull .env.production

# Check DATABASE_URL
if [ -z "$DATABASE_URL" ]; then
  echo "⚠️  Warning: DATABASE_URL not found in .env.production"
  echo "Please set DATABASE_URL in Vercel dashboard"
fi

# Run migrations
echo "🗄️  Running database migrations..."
export DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2-)
npx prisma migrate deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "Check your deployment at: https://yourdomain.com"


#!/bin/bash
# Prepare Next.js build for Cloudflare Pages deployment

set -e

echo "🔨 Building Next.js app..."
npm run build

echo "📦 Preparing Cloudflare Pages deployment..."

# Create deployment directory
DEPLOY_DIR=".cloudflare-pages"
rm -rf $DEPLOY_DIR
mkdir -p $DEPLOY_DIR

# Copy static files
echo "📋 Copying static files..."
cp -r .next/static $DEPLOY_DIR/static 2>/dev/null || true
cp -r public $DEPLOY_DIR/public 2>/dev/null || true

# Copy necessary Next.js files (excluding large cache)
echo "📋 Copying Next.js build files..."
mkdir -p $DEPLOY_DIR/.next
cp -r .next/standalone $DEPLOY_DIR/.next/standalone 2>/dev/null || true
cp -r .next/server $DEPLOY_DIR/.next/server 2>/dev/null || true
cp .next/BUILD_ID $DEPLOY_DIR/.next/ 2>/dev/null || true

# Copy functions
echo "📋 Copying Cloudflare Functions..."
cp -r functions $DEPLOY_DIR/functions 2>/dev/null || true

# Copy wrangler config
cp wrangler.toml $DEPLOY_DIR/ 2>/dev/null || true

echo "✅ Deployment package ready in $DEPLOY_DIR"
echo "📊 Size: $(du -sh $DEPLOY_DIR | cut -f1)"


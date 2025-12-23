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
# Also copy to _next/static for Next.js routing
mkdir -p $DEPLOY_DIR/_next/static
cp -r .next/static/* $DEPLOY_DIR/_next/static/ 2>/dev/null || true
cp -r public $DEPLOY_DIR/public 2>/dev/null || true

# Copy HTML files from Next.js build to root
echo "📋 Copying HTML files..."
# Copy index.html to root
cp .next/server/app/index.html $DEPLOY_DIR/index.html 2>/dev/null || true

# Copy other static HTML pages
find .next/server/app -name "*.html" -type f | while read htmlfile; do
  # Get relative path from .next/server/app
  relpath=${htmlfile#.next/server/app/}
  # Create directory structure
  dirpath=$(dirname "$relpath")
  if [ "$dirpath" != "." ]; then
    mkdir -p "$DEPLOY_DIR/$dirpath"
  fi
  # Copy file
  cp "$htmlfile" "$DEPLOY_DIR/$relpath" 2>/dev/null || true
done

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


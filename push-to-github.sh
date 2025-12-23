#!/bin/bash
# Script to push code to GitHub

echo "🚀 Pushing to GitHub..."
echo ""
echo "Before running this, make sure you:"
echo "1. Created a repository on GitHub: https://github.com/new"
echo "2. Have the repository URL ready"
echo ""
read -p "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

echo ""
echo "📤 Adding remote and pushing..."
git remote add origin "$REPO_URL" 2>/dev/null || git remote set-url origin "$REPO_URL"
git branch -M main
git push -u origin main

echo ""
echo "✅ Done! Check your GitHub repository."
echo ""
echo "Next: Deploy on Vercel at https://vercel.com/new"



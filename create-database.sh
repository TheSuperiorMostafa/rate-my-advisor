#!/bin/bash
# Script to help create database and add DATABASE_URL

echo "🗄️  Setting up Vercel Postgres Database"
echo ""
echo "Unfortunately, database creation must be done via Vercel Dashboard."
echo "But I'll guide you through the quickest way:"
echo ""
echo "1. Open this URL in your browser:"
echo "   https://vercel.com/hestyas-projects/rate-my-advisor/storage"
echo ""
echo "2. Click 'Create Database' → 'Postgres' → 'Hobby' (free)"
echo ""
echo "3. After creation, copy the connection string"
echo ""
echo "4. Then run this command with your connection string:"
echo "   echo 'YOUR_CONNECTION_STRING' | vercel env add DATABASE_URL production"
echo ""
echo "Or I can try to automate it if you provide the connection string..."


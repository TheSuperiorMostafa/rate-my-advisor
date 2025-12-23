# Deploy to Production - Quick Guide

## ✅ Step 1: Code is Pushed
Code has been pushed to GitHub. Vercel should auto-deploy.

## ⚙️ Step 2: Verify Environment Variables in Vercel

Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables

Make sure these are set:
- `DATABASE_URL` - Your Prisma Postgres connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - `https://rate-my-advisor.vercel.app`
- `GOOGLE_CLIENT_ID` - Your Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth Client Secret

## 🗄️ Step 3: Run Database Migrations

After deployment, run migrations on production:

```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

Or use Vercel CLI:
```bash
vercel env pull .env.production
export DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2)
npx prisma migrate deploy
```

## ✅ Step 4: Test Production

1. Visit: https://rate-my-advisor.vercel.app
2. Try signing in with Google
3. Test writing a review
4. Verify everything works!

## 🔧 If Google OAuth Fails

Make sure the production URL is added to Google Cloud Console:
- Go to: https://console.cloud.google.com/apis/credentials
- Edit your OAuth client
- Add: `https://rate-my-advisor.vercel.app/api/auth/callback/google`
- Save

## 🎯 That's It!

Your app should be live on Vercel!


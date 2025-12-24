# Fix: DATABASE_URL Missing in Vercel Production

## Problem

The submission API is failing with:
```
Can't reach database server at `localhost:5432`
```

This means `DATABASE_URL` is not set in Vercel production, so Prisma is trying to connect to localhost.

## Solution

Add `DATABASE_URL` to Vercel production environment variables.

### Option 1: If you have a Vercel Postgres database

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/storage
2. Find your Postgres database
3. Click on it
4. Copy the connection string
5. Add it to Vercel:
   ```bash
   echo "YOUR_CONNECTION_STRING" | vercel env add DATABASE_URL production
   ```

### Option 2: If you have an external database (Supabase/Neon/etc.)

1. Get your connection string from your database provider
2. Add it to Vercel:
   ```bash
   echo "YOUR_CONNECTION_STRING" | vercel env add DATABASE_URL production
   ```

### Option 3: Create a new Vercel Postgres database

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/storage
2. Click "Create Database"
3. Select "Postgres"
4. Choose "Hobby" plan (free)
5. Click "Create"
6. Copy the connection string
7. Add it to Vercel:
   ```bash
   echo "YOUR_CONNECTION_STRING" | vercel env add DATABASE_URL production
   ```

## After Adding DATABASE_URL

1. **Redeploy:**
   ```bash
   vercel --prod
   ```

2. **Run migrations (if needed):**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

## Verify

After redeployment, test the submission form - it should work now.


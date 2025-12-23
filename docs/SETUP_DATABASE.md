# Set Up Database

## Option 1: Vercel Postgres (Recommended - via Dashboard)

Database creation via CLI is not fully supported. Use the dashboard:

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **Postgres**
5. Choose **Hobby** plan (free)
6. Click **"Create"**
7. Copy the connection string
8. Add via CLI:
   ```bash
   echo "YOUR_CONNECTION_STRING" | vercel env add DATABASE_URL production
   ```

## Option 2: External Database (Supabase/Neon)

### Supabase (Free)
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy **Connection pooling** URL (important for serverless!)
5. Add via CLI:
   ```bash
   echo "YOUR_SUPABASE_URL" | vercel env add DATABASE_URL production
   ```

### Neon (Free)
1. Go to https://neon.tech
2. Create new project
3. Copy connection string
4. Add via CLI:
   ```bash
   echo "YOUR_NEON_URL" | vercel env add DATABASE_URL production
   ```

## After Adding DATABASE_URL

1. **Redeploy:**
   ```bash
   vercel --prod
   ```

2. **Run migrations:**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

3. **Seed database (optional):**
   ```bash
   npx prisma db seed
   ```

---

**Quick command to add DATABASE_URL after you get it:**
```bash
echo "YOUR_DATABASE_URL" | vercel env add DATABASE_URL production
```


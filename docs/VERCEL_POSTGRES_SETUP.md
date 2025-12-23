# Vercel Postgres Setup - Quick Steps

## Step 1: Create Database (2 minutes)

1. **Open Storage Page:**
   - https://vercel.com/hestyas-projects/rate-my-advisor/storage
   - (I've tried to open it for you)

2. **Create Database:**
   - Click **"Create Database"** button
   - Select **"Postgres"**
   - Choose **"Hobby"** plan (free tier)
   - Click **"Create"**
   - Wait ~30 seconds for provisioning

3. **Get Connection String:**
   - After creation, you'll see the database
   - Click on it to view details
   - Find the **"Connection String"** or **"POSTGRES_URL"**
   - Copy it (looks like: `postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb`)

## Step 2: Share Connection String

Once you have the connection string, just paste it here and I'll:
- ✅ Add it as `DATABASE_URL` environment variable
- ✅ Redeploy the app
- ✅ Run Prisma migrations
- ✅ Seed the database (optional)

## What Happens Next

After I add the connection string:

1. **Redeploy:**
   ```bash
   vercel --prod
   ```

2. **Run Migrations:**
   ```bash
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

3. **Seed Database (Optional):**
   ```bash
   npx prisma db seed
   ```

4. **Your app will be fully functional!** 🎉

---

**Quick Checklist:**
- [ ] Open Storage page
- [ ] Create Postgres database (Hobby plan)
- [ ] Copy connection string
- [ ] Paste it here
- [ ] I'll handle the rest! 🚀


# Deployment Steps - Follow These Now

## ✅ Step 1: Git Repository (DONE)
- Git initialized ✅
- Files committed ✅

## 📤 Step 2: Push to GitHub

**You need to create a GitHub repository first:**

1. Go to https://github.com/new
2. Create a new repository (name it `rate-my-advisor` or similar)
3. **Don't** initialize with README
4. Copy the repository URL

Then run:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## 🚀 Step 3: Deploy to Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub repository
4. Click "Import"
5. Vercel will auto-detect Next.js ✅

### Option B: Via Vercel CLI

```bash
# Login to Vercel (if not already)
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account with ID: KiZx3uKGwfoJRlP2PVcGH4Kf)
# - Link to existing project? No
# - Project name? rate-my-advisor
# - Directory? ./
# - Override settings? No
```

## ⚙️ Step 4: Environment Variables

**After first deployment, add these in Vercel Dashboard:**

Go to: Project → Settings → Environment Variables

Add these (copy from your `.env.local`):

```
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=ARMpt/cbtBsdcqTchtGlJXmrmOJ80t2W3YYWQkmU2AI=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@ratemyadvisor.com
ENABLE_CAPTCHA=false
```

**Important:** Update `NEXTAUTH_URL` after deployment with your actual Vercel URL!

## 🗄️ Step 5: Set Up Database

### Recommended: Vercel Postgres

1. In Vercel Dashboard → Your Project → **Storage** tab
2. Click **"Create Database"** → Select **Postgres**
3. Choose **Hobby** plan (free)
4. Copy the connection string
5. Add as `DATABASE_URL` in Environment Variables
6. Redeploy

### Alternative: Supabase (Free)

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy **Connection pooling** URL (important for serverless!)
5. Add as `DATABASE_URL` in Vercel
6. Redeploy

## 🔄 Step 6: Run Migrations

After database is set up:

**Via Vercel CLI:**
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

**Or via Vercel Dashboard:**
- Go to Project → Functions
- Run: `npx prisma migrate deploy`

## 🌱 Step 7: Seed Database (Optional)

```bash
npx prisma db seed
```

## 👤 Step 8: Create Admin User

1. Visit your deployed site
2. Sign up with your email
3. Update your user:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

## ✅ Step 9: Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL`:
- Go to Environment Variables
- Update to: `https://your-actual-app-name.vercel.app`
- Redeploy

---

## Quick Commands Summary

```bash
# 1. Push to GitHub (after creating repo)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main

# 2. Deploy to Vercel (via CLI)
vercel login
vercel

# 3. After adding DATABASE_URL, run migrations
vercel env pull .env.local
npx prisma migrate deploy
```

---

**Ready! Start with Step 2 (GitHub) or Step 3 (Vercel deployment).** 🚀


# Vercel Deployment Instructions

## Your Vercel User ID
**User ID:** `KiZx3uKGwfoJRlP2PVcGH4Kf`

## Step 1: Push to GitHub

If you haven't already, create a GitHub repository and push:

```bash
# If you haven't created a GitHub repo yet:
# 1. Go to github.com and create a new repository
# 2. Then run:

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy on Vercel

### Option A: Via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings ✅

### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login (will open browser)
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name? rate-my-advisor (or your choice)
# - Directory? ./
# - Override settings? No
```

## Step 3: Environment Variables

After deployment starts, add these in Vercel Dashboard:

**Go to:** Project Settings → Environment Variables

Add these variables (copy from your `.env.local`):

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

**Important:** 
- Update `NEXTAUTH_URL` after first deployment with your actual Vercel URL
- Get production `DATABASE_URL` from your database provider

## Step 4: Set Up Production Database

### Recommended: Vercel Postgres

1. In Vercel Dashboard → Your Project → **Storage** tab
2. Click **"Create Database"** → Select **Postgres**
3. Choose plan (Hobby is free)
4. Copy the connection string
5. Add as `DATABASE_URL` in Environment Variables

### Alternative: Supabase (Free)

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" for serverless)
5. Add as `DATABASE_URL` in Vercel

## Step 5: After First Deployment

### Run Migrations

**Option 1: Via Vercel CLI**
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

**Option 2: Via Vercel Dashboard**
- Go to Project → Functions
- Run command: `npx prisma migrate deploy`

### Seed Database (Optional)
```bash
npx prisma db seed
```

### Create Admin User

1. Visit your deployed site: `https://your-app.vercel.app`
2. Sign up with your email
3. Update your user in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

## Step 6: Update NEXTAUTH_URL

After deployment, update `NEXTAUTH_URL` in Vercel:
- Go to Environment Variables
- Update `NEXTAUTH_URL` to: `https://your-actual-app-name.vercel.app`
- Redeploy

## Troubleshooting

**Build fails?**
- Check build logs in Vercel Dashboard
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

**Database connection fails?**
- Verify `DATABASE_URL` is correct
- Check database allows external connections
- For Supabase, use "Connection pooling" URL

**Environment variables not working?**
- Redeploy after adding variables
- Check variable names match exactly
- Ensure no typos

## Your Deployment URL

After deployment, your app will be at:
`https://your-project-name.vercel.app`

---

**Ready to deploy! Follow the steps above.** 🚀


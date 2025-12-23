# Deploy to Vercel via CLI

## Step 1: Login to Vercel

In your terminal, run:
```bash
vercel login
```

**Follow the prompts:**
- Select "Continue with GitHub" (since you're logged into GitHub)
- It will open a browser window
- Authorize Vercel
- Return to terminal

## Step 2: Deploy

After login, run:
```bash
vercel
```

**Or use the script:**
```bash
./deploy-vercel.sh
```

**Follow the prompts:**
- Set up and deploy? **Yes**
- Which scope? (select your account)
- Link to existing project? **No**
- Project name? **rate-my-advisor** (or press Enter for default)
- Directory? **./** (press Enter)
- Override settings? **No**

## Step 3: Production Deploy

After first deployment, deploy to production:
```bash
vercel --prod
```

## Step 4: Add Environment Variables

After deployment, add environment variables:

**Option A: Via Vercel Dashboard**
- Go to your project → Settings → Environment Variables
- Add all variables from your `.env.local`

**Option B: Via CLI**
```bash
vercel env add DATABASE_URL
vercel env add NEXTAUTH_URL
vercel env add NEXTAUTH_SECRET
# ... etc
```

## Step 5: Set Up Database

1. In Vercel Dashboard → Your Project → **Storage**
2. Create Postgres database
3. Copy connection string
4. Add as `DATABASE_URL` environment variable
5. Redeploy

## Step 6: Run Migrations

```bash
vercel env pull .env.local
npx prisma migrate deploy
```

---

**Start with: `vercel login` in your terminal!**


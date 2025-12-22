# Deployment Guide - Rate My Advisor

## Quick Deploy to Vercel

### Step 1: Prepare Your Code
- ✅ All code is ready
- ✅ Database schema is ready
- ✅ Environment variables documented

### Step 2: Deploy to Vercel

1. **Push to GitHub** (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

### Step 3: Set Environment Variables in Vercel

Add these in Vercel Dashboard → Project Settings → Environment Variables:

**Required:**
```
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-generated-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@ratemyadvisor.com
```

**Optional:**
```
ENABLE_CAPTCHA=false
NEXT_PUBLIC_CAPTCHA_PROVIDER=hcaptcha
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-key
HCAPTCHA_SECRET_KEY=your-secret
```

### Step 4: Set Up Production Database

**Option A: Vercel Postgres (Recommended)**
- In Vercel Dashboard → Storage → Create Postgres
- Copy the connection string to `DATABASE_URL`

**Option B: External Database (Supabase/Neon)**
- Create database on Supabase or Neon
- Copy connection string to `DATABASE_URL`

### Step 5: Run Database Migrations

After deployment, run migrations:

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Or via Vercel Dashboard → Functions → Run command
npx prisma migrate deploy
```

### Step 6: Seed Database (Optional)

```bash
npx prisma db seed
```

### Step 7: Create Admin User

After first deployment:
1. Sign up via the app
2. Update your user in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

## Post-Deployment Checklist

- [ ] App loads at production URL
- [ ] Database migrations completed
- [ ] Admin user created
- [ ] Test review submission
- [ ] Test admin moderation
- [ ] Verify email sending works
- [ ] Check API routes work
- [ ] Test authentication flow

## Troubleshooting

### Build Fails
- Check build logs in Vercel
- Ensure all dependencies are in `package.json`
- Check for TypeScript errors

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Check database allows connections from Vercel IPs
- Ensure SSL is enabled if required

### Environment Variables
- All variables must be set in Vercel Dashboard
- Redeploy after adding new variables
- Check variable names match exactly

## Next Steps After Launch

1. Monitor error logs
2. Set up analytics
3. Configure custom domain
4. Set up monitoring/alerts
5. Review and approve initial reviews


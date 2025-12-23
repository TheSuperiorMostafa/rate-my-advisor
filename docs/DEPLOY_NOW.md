# Deploy Now - Quick Steps

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## 2. Deploy on Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Vercel auto-detects Next.js ✅

## 3. Add Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

**Copy these from your `.env.local`:**

```
DATABASE_URL
NEXTAUTH_URL (change to your Vercel URL)
NEXTAUTH_SECRET
SMTP_HOST
SMTP_PORT
SMTP_USER
SMTP_PASSWORD
EMAIL_FROM
```

## 4. Set Up Production Database

**Easiest: Vercel Postgres**
- Vercel Dashboard → Storage → Create Postgres
- Copy connection string → Add as `DATABASE_URL`

**Or use Supabase/Neon:**
- Create free account
- Create database
- Copy connection string → Add as `DATABASE_URL`

## 5. Deploy

Click "Deploy" in Vercel. It will:
- Install dependencies
- Run `prisma generate`
- Build the app
- Deploy

## 6. Run Migrations

After first deployment, in Vercel Dashboard → Functions → Run:

```bash
npx prisma migrate deploy
```

Or via terminal:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

## 7. Seed Database (Optional)

```bash
npx prisma db seed
```

## 8. Create Admin User

1. Visit your deployed site
2. Sign up with your email
3. Run in database:
   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

## 9. Test

- Visit your site
- Test review submission
- Test admin panel (after making yourself admin)

## Troubleshooting

**Build fails?**
- Check build logs in Vercel
- Ensure all env vars are set
- Check database connection

**Database errors?**
- Verify `DATABASE_URL` is correct
- Run migrations: `npx prisma migrate deploy`
- Check database allows external connections

**Need to make changes?**
- Edit code locally
- Push to GitHub
- Vercel auto-deploys

---

**Ready? Push to GitHub and deploy! 🚀**


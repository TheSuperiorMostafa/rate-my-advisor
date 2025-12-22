# Quick Deploy Guide

Fastest path to production deployment.

## 5-Minute Deploy

### 1. Database (2 minutes)

**Supabase:**
1. Go to [supabase.com](https://supabase.com) → New Project
2. Copy connection string from Settings → Database
3. Save password!

**Neon:**
1. Go to [neon.tech](https://neon.tech) → Create Project
2. Copy connection string from dashboard

### 2. Vercel (1 minute)

1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repo
3. Add environment variables (see below)
4. Deploy!

### 3. Environment Variables

Copy-paste these into Vercel:

```env
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres?sslmode=require
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

### 4. Run Migrations

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull env vars
vercel env pull .env.production

# Run migrations
export DATABASE_URL="your-connection-string"
npx prisma migrate deploy
```

### 5. Create Admin

```sql
-- After signing up, run:
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Done! 🎉

Your app is live at: `https://yourdomain.com`

---

## Full Guide

See `DEPLOYMENT_GUIDE.md` for complete instructions.


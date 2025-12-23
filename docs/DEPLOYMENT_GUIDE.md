# Deployment Guide: Vercel + PostgreSQL

Complete step-by-step guide for deploying Rate My Advisor to production.

## Prerequisites

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Supabase or Neon account (free tier works)
- [ ] Domain name (optional, but recommended)
- [ ] hCaptcha account (if using CAPTCHA)

---

## Part 1: Database Setup

### Option A: Supabase (Recommended for Simplicity)

#### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - **Project Name:** `rate-my-advisor`
   - **Database Password:** Generate strong password (save it!)
   - **Region:** Choose closest to your users
   - **Pricing Plan:** Free tier is fine for MVP
5. Click "Create new project"
6. Wait 2-3 minutes for project to initialize

#### Step 2: Get Database Connection String

1. Go to **Settings** → **Database**
2. Find **Connection string** section
3. Select **URI** tab
4. Copy the connection string
5. Replace `[YOUR-PASSWORD]` with your database password

**Format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

#### Step 3: Test Connection

```bash
# Test with psql (if installed)
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Or use Supabase SQL Editor
# Go to SQL Editor in Supabase dashboard
```

---

### Option B: Neon (Alternative)

#### Step 1: Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up / Log in
3. Click "Create Project"
4. Fill in:
   - **Project Name:** `rate-my-advisor`
   - **Region:** Choose closest to your users
   - **PostgreSQL Version:** 15 or 16
5. Click "Create Project"

#### Step 2: Get Database Connection String

1. In project dashboard, find **Connection Details**
2. Copy the connection string
3. It will look like:
   ```
   postgresql://[user]:[password]@[hostname]/[database]?sslmode=require
   ```

---

## Part 2: Vercel Setup

### Step 1: Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Sign up / Log in with GitHub
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (or leave default)
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

### Step 2: Configure Environment Variables

In Vercel project settings, add these environment variables:

#### Required Variables

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"
```

#### Optional Variables

```env
# CAPTCHA (if enabled)
ENABLE_CAPTCHA="true"
NEXT_PUBLIC_HCAPTCHA_SITE_KEY="your-site-key"
HCAPTCHA_SECRET_KEY="your-secret-key"
NEXT_PUBLIC_CAPTCHA_PROVIDER="hcaptcha"

# Rate Limiting (if using Redis)
REDIS_URL="redis://..."
```

#### Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and use as `NEXTAUTH_SECRET`.

---

## Part 3: Database Migrations

### Step 1: Run Migrations in Production

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migration
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate
```

**Option B: Using Supabase SQL Editor**

1. Go to Supabase → SQL Editor
2. Copy contents of `prisma/migrations/[latest]/migration.sql`
3. Paste and run in SQL Editor

**Option C: Direct Connection**

```bash
# Set DATABASE_URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# Run migration
npx prisma migrate deploy

# Generate client
npx prisma generate
```

### Step 2: Verify Migration

```bash
# Check migration status
npx prisma migrate status

# Or use Prisma Studio
npx prisma studio
```

---

## Part 4: Optional Database Seeding

### Seed Production Database (Optional)

**⚠️ Warning:** Only seed if you want initial data. Don't seed if you want empty database.

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# Run seed
npx tsx prisma/seed.ts
```

**Or use Supabase SQL Editor:**
- Manually insert initial universities/departments if needed

---

## Part 5: NextAuth Production Configuration

### Step 1: Update NEXTAUTH_URL

In Vercel environment variables:
```env
NEXTAUTH_URL="https://yourdomain.com"
```

**Important:** Must match your actual domain (no trailing slash).

### Step 2: Configure Email Provider

**For Gmail:**
1. Enable 2-factor authentication
2. Generate App Password: [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Use App Password (not regular password) in `SMTP_PASSWORD`

**For SendGrid:**
```env
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT="587"
SMTP_USER="apikey"
SMTP_PASSWORD="your-sendgrid-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

**For Resend:**
```env
SMTP_HOST="smtp.resend.com"
SMTP_PORT="587"
SMTP_USER="resend"
SMTP_PASSWORD="re_your-api-key"
EMAIL_FROM="noreply@yourdomain.com"
```

### Step 3: Test Authentication

1. Deploy to Vercel
2. Visit `https://yourdomain.com/auth/signin`
3. Enter email
4. Check email for magic link
5. Click link to sign in

---

## Part 6: Domain Configuration

### Step 1: Add Domain in Vercel

1. Go to Vercel project → **Settings** → **Domains**
2. Enter your domain (e.g., `ratemyadvisor.com`)
3. Follow DNS configuration instructions

### Step 2: Configure DNS

**For Root Domain (ratemyadvisor.com):**

Add these DNS records:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**For Subdomain (app.ratemyadvisor.com):**

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### Step 3: SSL Certificate

- Vercel automatically provisions SSL certificates
- Wait 1-24 hours for DNS propagation
- Check SSL status in Vercel dashboard

### Step 4: Update Environment Variables

After domain is configured:
1. Update `NEXTAUTH_URL` to your domain
2. Update `NEXT_PUBLIC_APP_URL` to your domain
3. Redeploy (Vercel auto-deploys on env var changes)

---

## Part 7: SEO Configuration

### Step 1: Update next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // SEO
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
```

### Step 2: Create robots.txt

Create `public/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://yourdomain.com/sitemap.xml
```

### Step 3: Create sitemap.xml (Optional)

Create `app/sitemap.ts`:

```typescript
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://yourdomain.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // Add more URLs as needed
  ];
}
```

### Step 4: Verify SEO

- Test with [Google Search Console](https://search.google.com/search-console)
- Submit sitemap
- Check mobile-friendliness
- Test page speed with [PageSpeed Insights](https://pagespeed.web.dev/)

---

## Part 8: Logging & Monitoring

### Step 1: Vercel Analytics (Built-in)

1. Go to Vercel project → **Analytics**
2. Enable Web Analytics (free tier available)
3. View metrics in dashboard

### Step 2: Error Tracking (Sentry - Recommended)

**Install Sentry:**

```bash
npm install @sentry/nextjs
```

**Configure Sentry:**

```bash
npx @sentry/wizard@latest -i nextjs
```

**Add to Vercel env vars:**
```env
SENTRY_DSN="your-sentry-dsn"
SENTRY_AUTH_TOKEN="your-auth-token"
```

**Update next.config.js:**
```javascript
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // ... your config
};

module.exports = withSentryConfig(nextConfig, {
  // Sentry options
});
```

### Step 3: Database Monitoring

**Supabase:**
- Built-in monitoring in dashboard
- Go to **Database** → **Reports** for query performance

**Neon:**
- Built-in metrics in dashboard
- Monitor connection pool usage

### Step 4: Application Logs

**Vercel Logs:**
- View in Vercel dashboard → **Deployments** → Click deployment → **Logs**
- Real-time logs available

**Custom Logging:**
```typescript
// Use console.log (Vercel captures these)
console.log('Review submitted:', reviewId);
console.error('Error:', error);

// Or use structured logging
import { log } from 'next-axiom'; // Optional: install axiom
log.info('Review submitted', { reviewId });
```

---

## Part 9: Backup Strategy

### Option A: Supabase Automatic Backups

**Supabase (Free Tier):**
- Daily backups (7 days retention)
- Manual backup available

**To Create Manual Backup:**
1. Go to Supabase → **Database** → **Backups**
2. Click "Create Backup"
3. Download SQL dump

**To Restore:**
```bash
# Download backup from Supabase
# Restore using psql
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" < backup.sql
```

### Option B: Neon Automatic Backups

**Neon:**
- Point-in-time recovery (PITR)
- Automatic backups
- Manual snapshot available

**To Create Snapshot:**
1. Go to Neon dashboard
2. Click "Create Branch" (creates snapshot)
3. Or use `pg_dump` for manual backup

### Option C: Manual Backup Script

Create `scripts/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="backup_${DATE}.sql"

# Supabase
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Or Neon
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Upload to S3/cloud storage (optional)
# aws s3 cp "$BACKUP_FILE" s3://your-bucket/backups/
```

**Schedule with cron:**
```bash
# Daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

### Option D: Prisma Migrate Backup

```bash
# Export schema
npx prisma db pull

# Export data (if needed)
pg_dump --data-only "$DATABASE_URL" > data_backup.sql
```

---

## Part 10: Deployment Checklist

### Pre-Deployment

- [ ] Database created (Supabase/Neon)
- [ ] Environment variables set in Vercel
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] SMTP credentials configured
- [ ] Domain DNS configured (if using custom domain)
- [ ] CAPTCHA keys obtained (if using)

### Database Setup

- [ ] Prisma migrations run (`npx prisma migrate deploy`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] Database connection tested
- [ ] Initial data seeded (optional)

### Application Deployment

- [ ] Code pushed to GitHub
- [ ] Vercel project connected
- [ ] Environment variables added
- [ ] Build successful
- [ ] Deployment live

### Post-Deployment

- [ ] Test sign-in flow
- [ ] Test review submission
- [ ] Test admin moderation
- [ ] Verify SSL certificate
- [ ] Test API endpoints
- [ ] Check error logs
- [ ] Verify analytics tracking

### Monitoring Setup

- [ ] Vercel Analytics enabled
- [ ] Error tracking configured (Sentry)
- [ ] Database monitoring active
- [ ] Backup strategy in place

---

## Part 11: Exact Commands

### Initial Setup

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login to Vercel
vercel login

# 3. Link project
vercel link

# 4. Pull environment variables
vercel env pull .env.production

# 5. Set DATABASE_URL (or use .env.production)
export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# 6. Run migrations
npx prisma migrate deploy

# 7. Generate Prisma Client
npx prisma generate

# 8. (Optional) Seed database
npx tsx prisma/seed.ts
```

### Deploy to Vercel

```bash
# Deploy (from project root)
vercel --prod

# Or push to main branch (auto-deploys)
git push origin main
```

### Verify Deployment

```bash
# Check deployment status
vercel ls

# View logs
vercel logs [deployment-url]

# Open deployment
vercel open
```

### Database Operations

```bash
# Check migration status
npx prisma migrate status

# Create new migration (dev only)
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Open Prisma Studio
npx prisma studio
```

---

## Part 12: Production Environment Variables

### Complete .env.production Template

```env
# Database
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?sslmode=require"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-generated-secret-32-chars"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"

# App
NEXT_PUBLIC_APP_URL="https://yourdomain.com"
NODE_ENV="production"

# CAPTCHA (Optional)
ENABLE_CAPTCHA="true"
NEXT_PUBLIC_HCAPTCHA_SITE_KEY="your-site-key"
HCAPTCHA_SECRET_KEY="your-secret-key"
NEXT_PUBLIC_CAPTCHA_PROVIDER="hcaptcha"

# Monitoring (Optional)
SENTRY_DSN="your-sentry-dsn"
```

---

## Part 13: Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check connection string format
# Ensure SSL mode is set: ?sslmode=require
# Verify password is correct
# Check firewall/network restrictions
```

**2. Migration Fails**
```bash
# Check DATABASE_URL is set correctly
# Verify database exists
# Check user permissions
# Review migration SQL for errors
```

**3. NextAuth Not Working**
```bash
# Verify NEXTAUTH_URL matches domain exactly
# Check NEXTAUTH_SECRET is set
# Ensure SMTP credentials are correct
# Check email spam folder
```

**4. Build Fails on Vercel**
```bash
# Check build logs in Vercel dashboard
# Verify all dependencies in package.json
# Ensure TypeScript errors are fixed
# Check environment variables are set
```

**5. Rate Limiting Issues**
```bash
# In-memory rate limiting resets on restart
# Consider Redis for production
# Check rate limit headers in response
```

---

## Part 14: Performance Optimization

### Database

- [ ] Enable connection pooling (Supabase/Neon have this)
- [ ] Add indexes for frequently queried fields
- [ ] Monitor slow queries
- [ ] Use materialized views for aggregations

### Application

- [ ] Enable Vercel Edge Caching
- [ ] Optimize images (Next.js Image component)
- [ ] Enable compression
- [ ] Use CDN for static assets

### Monitoring

- [ ] Set up alerts for errors
- [ ] Monitor API response times
- [ ] Track database query performance
- [ ] Monitor rate limit hits

---

## Part 15: Security Checklist

- [ ] All environment variables set (no hardcoded secrets)
- [ ] NEXTAUTH_SECRET is strong (32+ characters)
- [ ] Database password is strong
- [ ] SSL/TLS enabled (automatic with Vercel)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] CAPTCHA enabled (recommended)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention (React auto-escaping)
- [ ] CSRF protection (NextAuth handles this)

---

## Quick Reference

### Deploy Command
```bash
vercel --prod
```

### Run Migrations
```bash
npx prisma migrate deploy
```

### Check Status
```bash
vercel ls
npx prisma migrate status
```

### View Logs
```bash
vercel logs
```

### Backup Database
```bash
pg_dump "$DATABASE_URL" > backup.sql
```

---

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [NextAuth.js Docs](https://authjs.dev)
- [Prisma Docs](https://www.prisma.io/docs)

---

## Post-Deployment Tasks

1. **Create First Admin User**
   ```sql
   -- After signing up, update role
   UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
   ```

2. **Test All Features**
   - Sign in/out
   - Submit review
   - View advisor pages
   - Admin moderation
   - Report review

3. **Set Up Monitoring**
   - Enable Vercel Analytics
   - Configure Sentry (optional)
   - Set up uptime monitoring

4. **Configure Backups**
   - Enable automatic backups
   - Test restore process
   - Document backup procedure

5. **SEO Setup**
   - Submit to Google Search Console
   - Submit sitemap
   - Test meta tags
   - Verify structured data

---

Your application is now ready for production! 🚀


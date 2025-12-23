# Deployment Checklist

Quick reference checklist for deploying Rate My Advisor to production.

## Pre-Deployment

### Database Setup
- [ ] Create Supabase or Neon account
- [ ] Create new database project
- [ ] Save database connection string
- [ ] Test database connection

### Vercel Setup
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Create new Vercel project

### Environment Variables
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_URL` - Production domain
- [ ] `NEXTAUTH_SECRET` - Generated secret (32+ chars)
- [ ] `SMTP_HOST` - Email server host
- [ ] `SMTP_PORT` - Email server port
- [ ] `SMTP_USER` - Email username
- [ ] `SMTP_PASSWORD` - Email password/app key
- [ ] `EMAIL_FROM` - Sender email address
- [ ] `NEXT_PUBLIC_APP_URL` - Production domain
- [ ] `NODE_ENV=production`
- [ ] (Optional) CAPTCHA keys
- [ ] (Optional) Sentry DSN

## Database Migration

- [ ] Run `npx prisma migrate deploy`
- [ ] Verify migration success
- [ ] Run `npx prisma generate`
- [ ] (Optional) Run seed script

## Deployment

- [ ] Push code to GitHub main branch
- [ ] Verify Vercel auto-deployment triggered
- [ ] Check build logs for errors
- [ ] Verify deployment successful

## Domain Configuration

- [ ] Add domain in Vercel dashboard
- [ ] Configure DNS records
- [ ] Wait for DNS propagation
- [ ] Verify SSL certificate active
- [ ] Update `NEXTAUTH_URL` to production domain
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Redeploy after domain changes

## Post-Deployment Testing

- [ ] Test homepage loads
- [ ] Test university search
- [ ] Test advisor profile pages
- [ ] Test review submission
- [ ] Test sign-in flow
- [ ] Test email verification
- [ ] Test admin moderation
- [ ] Test report functionality

## Admin Setup

- [ ] Sign up as regular user
- [ ] Update user role to ADMIN in database
- [ ] Test admin login
- [ ] Test moderation dashboard

## Monitoring Setup

- [ ] Enable Vercel Analytics
- [ ] (Optional) Configure Sentry
- [ ] Set up database monitoring
- [ ] Configure backup strategy

## SEO Setup

- [ ] Update `robots.txt` with production domain
- [ ] Update `sitemap.ts` with production domain
- [ ] Submit sitemap to Google Search Console
- [ ] Verify meta tags on pages
- [ ] Test structured data

## Security Verification

- [ ] All secrets in environment variables (not code)
- [ ] SSL certificate active
- [ ] Rate limiting working
- [ ] CAPTCHA enabled (if configured)
- [ ] Input validation on all endpoints
- [ ] Admin routes protected

## Backup Strategy

- [ ] Enable automatic database backups
- [ ] Test backup restore process
- [ ] Document backup procedure
- [ ] Set up backup schedule (if manual)

---

## Quick Commands

```bash
# Deploy
vercel --prod

# Run migrations
npx prisma migrate deploy

# Create backup
./scripts/backup.sh

# View logs
vercel logs
```

---

## Support

- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- Neon Dashboard: https://console.neon.tech


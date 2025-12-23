# Cloudflare Pages Deployment Guide

This guide explains how to deploy rate-my-advisor.com to Cloudflare Pages while keeping the backend API on Vercel.

## Architecture

- **Frontend**: Cloudflare Pages (Next.js static assets + Cloudflare Functions)
- **Backend API**: Vercel (proxied through Cloudflare Functions)
- **Domain**: rate-my-advisor.com (Cloudflare DNS)

## Quick Deploy

```bash
# Deploy to Cloudflare Pages
npm run pages:deploy
```

## Setup Steps

### 1. Prerequisites

- Cloudflare account with Pages enabled
- Wrangler CLI installed (`npm install -g wrangler`)
- Domain `rate-my-advisor.com` added to Cloudflare

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Deploy

```bash
npm run pages:deploy
```

This will:
1. Build the Next.js app
2. Prepare deployment package (excludes large cache files)
3. Deploy to Cloudflare Pages

### 4. Configure Custom Domain

```bash
# Add custom domain
wrangler pages domain add rate-my-advisor.com --project-name=rate-my-advisor

# Add www subdomain (optional)
wrangler pages domain add www.rate-my-advisor.com --project-name=rate-my-advisor
```

**Or via Cloudflare Dashboard:**
1. Go to Cloudflare Dashboard → Pages → rate-my-advisor
2. Settings → Custom Domains → Add domain
3. Add `rate-my-advisor.com` and `www.rate-my-advisor.com`

### 5. Configure DNS

In Cloudflare Dashboard → DNS → Records:

1. Add CNAME record:
   - Name: `@` (or `rate-my-advisor.com`)
   - Target: `rate-my-advisor.pages.dev`
   - Proxy: ✅ (orange cloud)

2. Add CNAME record for www:
   - Name: `www`
   - Target: `rate-my-advisor.pages.dev`
   - Proxy: ✅ (orange cloud)

### 6. Set Environment Variables

**Via CLI:**
```bash
wrangler pages secret put DATABASE_URL --project-name=rate-my-advisor
wrangler pages secret put NEXTAUTH_SECRET --project-name=rate-my-advisor
wrangler pages secret put NEXTAUTH_URL --project-name=rate-my-advisor
wrangler pages secret put GOOGLE_CLIENT_ID --project-name=rate-my-advisor
wrangler pages secret put GOOGLE_CLIENT_SECRET --project-name=rate-my-advisor
```

**Or via Dashboard:**
1. Cloudflare Dashboard → Pages → rate-my-advisor
2. Settings → Environment Variables
3. Add variables for Production environment

**Required Variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - `https://rate-my-advisor.com`
- `NEXTAUTH_SECRET` - NextAuth secret key
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret

**Optional:**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `EMAIL_FROM`

### 7. Update Vercel Backend URL

If your Vercel deployment URL is different, update `functions/api/[[path]].ts`:

```typescript
const vercelUrl = `https://YOUR-VERCEL-URL.vercel.app${fullPath}`;
```

## How It Works

### API Proxy

All `/api/*` requests are automatically proxied to Vercel via Cloudflare Functions:

```
User → Cloudflare Pages → /api/* → Cloudflare Function → Vercel Backend
```

The proxy function is located at `functions/api/[[path]].ts` and handles:
- All HTTP methods (GET, POST, PUT, DELETE, etc.)
- Headers forwarding
- CORS handling
- Error handling

### Static Assets

- Next.js static files served from Cloudflare's CDN
- Client-side routing handled by Next.js
- Server Components rendered on Cloudflare edge

## Deployment Workflow

### Manual Deployment

```bash
npm run pages:deploy
```

### Continuous Deployment (GitHub)

1. Go to Cloudflare Dashboard → Pages → rate-my-advisor
2. Settings → Builds & deployments
3. Connect GitHub repository
4. Configure:
   - **Build command**: `npm run build`
   - **Build output directory**: `.cloudflare-pages`
   - **Root directory**: `/`

**Note:** You'll need to add a GitHub Action or use Cloudflare's build system.

## Troubleshooting

### Deployment Fails

1. Check build logs: `wrangler pages deployment tail --project-name=rate-my-advisor`
2. Verify all environment variables are set
3. Check file size limits (25MB per file)

### API Requests Fail

1. Verify Vercel backend is accessible
2. Check `functions/api/[[path]].ts` has correct Vercel URL
3. Check Cloudflare Function logs in dashboard
4. Verify CORS settings

### Domain Not Working

1. Verify DNS records point to `rate-my-advisor.pages.dev`
2. Check SSL/TLS mode (should be "Full" or "Full (strict)")
3. Wait for DNS propagation (up to 24 hours)
4. Verify custom domain is added in Pages settings

### Environment Variables Not Working

1. Ensure variables are set for Production environment
2. Redeploy after adding variables
3. Check variable names match exactly (case-sensitive)

## Monitoring

- **Cloudflare Dashboard**: View deployments, logs, analytics
- **Function Logs**: Cloudflare Dashboard → Pages → rate-my-advisor → Functions → Logs
- **Vercel Dashboard**: Monitor backend API performance

## Rollback

```bash
# List deployments
wrangler pages deployment list --project-name=rate-my-advisor

# Retry a specific deployment
wrangler pages deployment retry <deployment-id> --project-name=rate-my-advisor
```

## Current Deployment

- **Project**: rate-my-advisor
- **URL**: https://rate-my-advisor.pages.dev
- **Custom Domain**: rate-my-advisor.com (after DNS setup)

## Notes

- Cloudflare Pages has a 25MB file size limit
- API responses are proxied in real-time (no caching by default)
- Static assets are served from Cloudflare's global CDN
- Functions run on Cloudflare's edge network

# How to Check Cloudflare Pages Deployment Status

## Quick Methods

### Method 1: Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard:**
   - https://dash.cloudflare.com
   - Or direct link: https://dash.cloudflare.com → Pages → rate-my-advisor

2. **View Deployments:**
   - Click on **"rate-my-advisor"** project
   - You'll see a list of all deployments
   - Latest deployment is at the top

3. **Check Status:**
   - ✅ **Success** - Deployment completed successfully
   - ⏳ **Building** - Currently deploying
   - ❌ **Failed** - Deployment failed (click to see logs)

4. **View Deployment Details:**
   - Click on any deployment to see:
     - Build logs
     - Function logs
     - Deployment time
     - Commit hash
     - Branch

### Method 2: Via Wrangler CLI

```bash
# List all deployments
wrangler pages deployment list --project-name=rate-my-advisor

# View specific deployment details
wrangler pages deployment get <deployment-id> --project-name=rate-my-advisor

# View deployment logs
wrangler pages deployment tail --project-name=rate-my-advisor
```

### Method 3: Check Deployment URL

Visit your deployment URL to see if it's live:
- **Production:** https://rate-my-advisor.com
- **Preview:** https://rate-my-advisor.pages.dev

## What to Look For

### Successful Deployment
- Status shows ✅ **Success**
- Deployment time is recent
- URL is accessible
- Functions are working

### Failed Deployment
- Status shows ❌ **Failed**
- Click to see error logs
- Common issues:
  - Build errors
  - Function errors
  - Environment variable issues

## Check Function Logs

1. **Via Dashboard:**
   - Cloudflare Dashboard → Pages → rate-my-advisor
   - Click **"Functions"** tab
   - Click **"Logs"** to see real-time logs

2. **Via CLI:**
   ```bash
   wrangler pages deployment tail --project-name=rate-my-advisor
   ```

## Check Recent Changes

After pushing code changes:

1. **Check if deployment was triggered:**
   - Cloudflare Dashboard → Pages → rate-my-advisor
   - Look for a new deployment with your latest commit

2. **If no new deployment:**
   - Cloudflare Pages auto-deploys from GitHub
   - Check if GitHub integration is set up
   - Or deploy manually: `npm run pages:deploy`

## Manual Deployment Check

If you want to trigger a new deployment:

```bash
# Deploy to Cloudflare Pages
npm run pages:deploy

# Or use wrangler directly
wrangler pages deploy .cloudflare-pages --project-name=rate-my-advisor
```

## Verify Deployment is Live

1. **Check the site:**
   - Visit: https://rate-my-advisor.com
   - Should load without errors

2. **Check API endpoints:**
   - Visit: https://rate-my-advisor.com/api/universities
   - Should return data (or empty array)

3. **Check functions:**
   - Cloudflare Dashboard → Pages → rate-my-advisor → Functions
   - Should show function invocations

## Troubleshooting

### Deployment Not Showing Up

1. **Check GitHub integration:**
   - Cloudflare Dashboard → Pages → rate-my-advisor → Settings
   - Check "GitHub" section
   - Verify repository is connected

2. **Check build settings:**
   - Settings → Builds & deployments
   - Verify build command and output directory

3. **Manual deploy:**
   ```bash
   npm run pages:deploy
   ```

### Deployment Failed

1. **Check build logs:**
   - Click on failed deployment
   - View "Build Logs" tab
   - Look for error messages

2. **Common issues:**
   - Build command failing
   - Missing environment variables
   - File size limits (25MB per file)
   - Function errors

### Functions Not Working

1. **Check function logs:**
   - Cloudflare Dashboard → Pages → rate-my-advisor → Functions → Logs
   - Look for errors

2. **Check middleware:**
   - Verify `functions/_middleware.ts` is deployed
   - Check for syntax errors

## Quick Status Check Command

```bash
# Check deployment status
wrangler pages deployment list --project-name=rate-my-advisor | head -10
```

This shows the 10 most recent deployments with their status.


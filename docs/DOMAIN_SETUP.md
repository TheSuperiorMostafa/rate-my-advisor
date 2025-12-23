# Setup rate-my-advisor.com Domain

## Step 1: Add Domain to Vercel ✅
Domain has been added via CLI. Verify in Vercel dashboard:
https://vercel.com/hestyas-projects/rate-my-advisor/settings/domains

## Step 2: Configure DNS in Cloudflare

1. Go to: https://dash.cloudflare.com
2. Select your domain: `rate-my-advisor.com`
3. Go to **DNS** → **Records**
4. Add/Update these records:

### Root Domain (rate-my-advisor.com)
```
Type: CNAME
Name: @
Target: cname.vercel-dns.com
Proxy: OFF (gray cloud - important!)
TTL: Auto
```

### WWW Subdomain (www.rate-my-advisor.com)
```
Type: CNAME
Name: www
Target: cname.vercel-dns.com
Proxy: OFF (gray cloud - important!)
TTL: Auto
```

**Important:** Make sure Proxy is OFF (gray cloud), not ON (orange cloud). Vercel needs direct DNS, not proxied.

## Step 3: Wait for DNS Propagation
- Usually takes 5-10 minutes
- Check status in Vercel dashboard
- Vercel will automatically provision SSL certificate

## Step 4: Update Google OAuth Redirect URI

1. Go to: https://console.cloud.google.com/apis/credentials
2. Click your OAuth client
3. In "Authorized redirect URIs", add:
   ```
   https://rate-my-advisor.com/api/auth/callback/google
   https://www.rate-my-advisor.com/api/auth/callback/google
   ```
4. Remove the old Vercel URL (optional, but cleaner)
5. Click **SAVE**

## Step 5: Update Vercel Environment Variables

1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/settings/environment-variables
2. Update `NEXTAUTH_URL` (Production):
   - Old: `https://rate-my-advisor.vercel.app`
   - New: `https://rate-my-advisor.com`
3. Save

## Step 6: Redeploy

After updating environment variables, Vercel should auto-redeploy. Or manually:
1. Go to: https://vercel.com/hestyas-projects/rate-my-advisor/deployments
2. Click "Redeploy" on latest deployment

## Step 7: Test

1. Visit: https://rate-my-advisor.com
2. Try signing in - should work now!
3. OAuth will use the consistent domain

## ✅ Benefits

- ✅ One consistent URL (no more Vercel preview URLs)
- ✅ Professional domain name
- ✅ OAuth will work reliably
- ✅ Better SEO
- ✅ SSL automatically configured by Vercel


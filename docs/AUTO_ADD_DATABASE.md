# Auto-Add Database Connection

Unfortunately, Vercel doesn't support creating databases via CLI - it must be done through the dashboard.

## Quickest Way:

1. **I've opened the Storage page for you**
   - If it didn't open: https://vercel.com/hestyas-projects/rate-my-advisor/storage

2. **Create Database:**
   - Click "Create Database"
   - Select "Postgres"
   - Choose "Hobby" plan (free)
   - Click "Create"
   - Wait for it to provision (~30 seconds)

3. **Copy Connection String:**
   - After creation, you'll see the connection string
   - Copy it (it looks like: `postgres://...`)

4. **Share it with me and I'll add it:**
   - Just paste the connection string here
   - I'll run: `echo "YOUR_STRING" | vercel env add DATABASE_URL production`
   - Then redeploy and run migrations

## Alternative: Use External Database

If you prefer, I can help you set up:
- **Supabase** (free, via CLI/API)
- **Neon** (free, via CLI/API)

Just let me know which you prefer!

---

**Once you have the connection string, share it and I'll add it immediately!** 🚀


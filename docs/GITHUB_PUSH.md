# Push to GitHub - Quick Guide

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `rate-my-advisor` (or your choice)
3. Description: "Rate My Advisor - Platform for reviewing academic advisors"
4. Choose: **Public** or **Private**
5. **DO NOT** check "Initialize with README"
6. Click **"Create repository"**

## Step 2: Copy Repository URL

After creating, GitHub will show you the repository URL. It will look like:
- `https://github.com/YOUR_USERNAME/rate-my-advisor.git`

## Step 3: Push Your Code

Run these commands (replace with your actual repo URL):

```bash
git remote add origin https://github.com/YOUR_USERNAME/rate-my-advisor.git
git branch -M main
git push -u origin main
```

## Step 4: Verify

Go to your GitHub repository page and verify all files are there.

## Next: Deploy to Vercel

After pushing to GitHub:
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Deploy!

---

**Need help? Share your GitHub username and I can help you set up the commands!**


# Localhost Testing Guide

## ✅ Server Status

Your app is now running at: **http://localhost:3000**

## 🧪 Test These Pages

### 1. Homepage
- **URL:** http://localhost:3000
- **What to check:** University search should work

### 2. University Page
- **URL:** http://localhost:3000/u/[universityId]/[slug]
- **What to check:** Departments list, advisor search

### 3. Department Page
- **URL:** http://localhost:3000/d/[departmentId]/[slug]
- **What to check:** Advisors list

### 4. Advisor Profile
- **URL:** http://localhost:3000/a/[advisorId]/[slug]
- **What to check:** Ratings, reviews, "Write a review" button

### 5. Write Review
- **URL:** http://localhost:3000/a/[advisorId]/[slug]/review
- **What to check:** Form validation, star ratings, tags

### 6. Legal Pages
- Privacy: http://localhost:3000/privacy
- Terms: http://localhost:3000/terms
- DMCA: http://localhost:3000/dmca
- Content Policy: http://localhost:3000/content-policy
- Moderation Policy: http://localhost:3000/moderation-policy

## 🔍 Quick Database Check

To see if you have data:
```bash
npx prisma studio
```
This opens a GUI to browse your database.

If you need to seed the database:
```bash
npx tsx prisma/seed.ts
```

## ⚠️ Known Limitations for Local Testing

1. **Email (Magic Links):** Currently using dummy SMTP credentials. For full email testing, update `.env.local` with real SMTP credentials.

2. **Authentication:** Sign-in will work but magic link emails won't send. You can test the UI flow.

3. **CAPTCHA:** Disabled for local testing (set `ENABLE_CAPTCHA="false"`).

## 🐛 Troubleshooting

### Server won't start?
- Check if port 3000 is already in use
- Check `.env.local` has all required variables
- Run `npx prisma generate` again

### Database errors?
- Verify PostgreSQL is running: `pg_isready`
- Check `DATABASE_URL` in `.env.local`
- Run migrations: `npx prisma migrate dev`

### Styling issues?
- Make sure Tailwind is configured (check `tailwind.config.js`)
- Restart the dev server

## 🎯 Next Steps

1. **Browse the app** - Navigate through all pages
2. **Test forms** - Try submitting a review (will be pending moderation)
3. **Check database** - Use Prisma Studio to see data
4. **Create admin user** - Follow `CREATE_ADMIN_USER.md` to access `/admin`

## 📝 Notes

- The app is in development mode
- Hot reload is enabled (changes auto-refresh)
- Database is local PostgreSQL
- All reviews start as "pending" status

---

**Happy Testing! 🚀**


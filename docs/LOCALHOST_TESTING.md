# Testing on Localhost

## Quick Start

### 1. Install Dependencies (if not already done)

```bash
npm install
```

This will install all dependencies including the newly added `lucide-react` for icons.

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory with these variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rate_my_advisor?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth (for sign-in)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (optional for local testing)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@ratemyadvisor.com"

# CAPTCHA (optional - set to false for local testing)
ENABLE_CAPTCHA="false"
```

**Quick NEXTAUTH_SECRET generator:**
```bash
openssl rand -base64 32
```

### 3. Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database with sample data
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:3000**

## Testing the Redesigned Pages

### Home Page
- Visit: `http://localhost:3000`
- ✅ Check hero section with search bar
- ✅ Verify "How It Works" 3-step section
- ✅ Check featured universities grid
- ✅ Test search functionality

### University Page
- Visit: `http://localhost:3000/u/[universityId]/[slug]`
- ✅ Check breadcrumbs navigation
- ✅ Test department search
- ✅ Click on department cards

### Department Page
- Visit: `http://localhost:3000/d/[departmentId]/[slug]`
- ✅ Check breadcrumbs
- ✅ Test advisor search
- ✅ Click on advisor cards

### Advisor Profile Page
- Visit: `http://localhost:3000/a/[advisorId]/[slug]`
- ✅ Check overall rating display
- ✅ Verify rating distribution histogram
- ✅ Check category breakdown bars
- ✅ Test review sorting dropdown
- ✅ Check review cards formatting
- ✅ Test "Write a Review" button (mobile sticky)

### Review Form Page
- Visit: `http://localhost:3000/a/[advisorId]/[slug]/review`
- ✅ Test all 6 rating categories
- ✅ Test tag selector
- ✅ Test meeting type/timeframe selects
- ✅ Test review textarea with character count
- ✅ Test form validation
- ✅ Submit a test review

## Common Issues & Solutions

### Issue: Database Connection Error
**Solution:**
- Make sure PostgreSQL is running
- Check DATABASE_URL in `.env.local`
- Run `npx prisma migrate dev` to create database

### Issue: Prisma Client Not Generated
**Solution:**
```bash
npx prisma generate
```

### Issue: Port 3000 Already in Use
**Solution:**
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Issue: Missing Icons
**Solution:**
```bash
# Make sure lucide-react is installed
npm install lucide-react
```

### Issue: Styles Not Loading
**Solution:**
```bash
# Rebuild Tailwind
npm run dev
# Or if that doesn't work, restart the dev server
```

## Testing Checklist

### Visual Testing
- [ ] All pages load without errors
- [ ] Typography looks correct (headings, body text)
- [ ] Colors match design system (blue primary, grays)
- [ ] Cards have proper shadows/borders
- [ ] Buttons have correct styles
- [ ] Icons display correctly
- [ ] Spacing looks consistent

### Functional Testing
- [ ] Search works on all pages
- [ ] Navigation (breadcrumbs, links) works
- [ ] Forms submit correctly
- [ ] Rating inputs work
- [ ] Sort dropdowns work
- [ ] Mobile menu works (if applicable)
- [ ] Auth button works

### Responsive Testing
- [ ] Test on mobile (375px width)
- [ ] Test on tablet (768px width)
- [ ] Test on desktop (1920px width)
- [ ] Check sticky elements on mobile
- [ ] Verify touch targets are large enough

### Browser Testing
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (if on Mac)
- [ ] Mobile browser (iOS Safari, Chrome Mobile)

## Quick Test Commands

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting errors
npm run lint

# Build for production (test build)
npm run build

# Start production server (test production build)
npm start
```

## Getting Sample Data

If you need sample data to test with:

```bash
# Seed the database
npx prisma db seed
```

This will create:
- Sample universities
- Sample departments
- Sample advisors
- Sample reviews

## Next Steps After Testing

1. **Fix any issues** you find
2. **Test all user flows**:
   - Search → University → Department → Advisor → Review
   - Sign in → Write review → Submit
   - Browse reviews → Sort → Filter
3. **Check console** for any errors
4. **Test on different devices** if possible
5. **Verify all links** work correctly

## Need Help?

- Check browser console for errors
- Check terminal for server errors
- Verify all environment variables are set
- Make sure database is running and accessible
- Check that all dependencies are installed


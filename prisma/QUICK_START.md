# Quick Start: Database Setup & Seeding

## Complete Setup from Scratch

### Step 1: Install Dependencies
```bash
npm install -D tsx
```

### Step 2: Set Up Environment
Create `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/rate_my_advisor?schema=public"
```

### Step 3: Generate Prisma Client
```bash
npx prisma generate
```

### Step 4: Create Database (if it doesn't exist)
```bash
createdb rate_my_advisor
# Or via psql:
psql -U postgres -c "CREATE DATABASE rate_my_advisor;"
```

### Step 5: Run Migration
```bash
npx prisma migrate dev --name init
```

### Step 6: Seed Database
```bash
npx tsx prisma/seed.ts
```

### Step 7: Verify (Optional)
```bash
npx prisma studio
```

## What Gets Created

The seed script creates:
- ✅ **3 Universities**: MIT, Stanford, UC Berkeley
- ✅ **9 Departments**: 3 per university (CS, Engineering, Business, etc.)
- ✅ **45 Advisors**: 5 per department
- ✅ **135-225 Reviews**: 2-5 reviews per advisor
- ✅ **12 Tags**: Common review tags (Responsive, Knowledgeable, etc.)
- ✅ **Ratings**: All 6 category ratings per review
- ✅ **Helpful Votes**: Some votes on approved reviews

## Expected Output

When you run the seed script, you should see:
```
🌱 Starting database seed...
🧹 Clearing existing data...
📝 Creating tags...
✅ Created 12 tags
🏛️  Creating universities...
✅ Created 3 universities
📚 Creating departments...
✅ Created 9 departments
👥 Creating advisors...
✅ Created 45 advisors
📝 Creating reviews...
✅ Created ~180 reviews with ratings and tags
👍 Creating helpful votes...
✅ Created helpful votes

✨ Seed completed successfully!
📊 Summary:
   Universities: 3
   Departments: 9
   Advisors: 45
   Reviews: ~180
   Tags: 12
   Ratings: ~1080
```

## All-in-One Command (After Initial Setup)

To reset and reseed everything:
```bash
npx prisma migrate reset
```
This runs migrations AND the seed script automatically.

## Next Steps

After seeding:
1. Start your Next.js dev server: `npm run dev`
2. Browse data in Prisma Studio: `npx prisma studio`
3. Start building your app!


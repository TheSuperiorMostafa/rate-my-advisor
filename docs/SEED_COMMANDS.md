# Seed Script Commands

## Prerequisites

Install `tsx` for running TypeScript files directly:
```bash
npm install -D tsx
```

Or use `ts-node`:
```bash
npm install -D ts-node @types/node
```

## Exact Commands to Run

### 1. Install Dependencies (if not already installed)
```bash
npm install -D tsx
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Database Migration
```bash
npx prisma migrate dev --name init
```

### 4. Run Seed Script

**Option A: Using tsx (recommended)**
```bash
npx tsx prisma/seed.ts
```

**Option B: Using npm script (if configured in package.json)**
```bash
npm run db:seed
```

**Option C: Using Prisma's built-in seed**
```bash
npx prisma db seed
```

## Verify Seed Data

### Option 1: Prisma Studio (Visual Browser)
```bash
npx prisma studio
```
Opens at `http://localhost:5555` - browse all tables visually.

### Option 2: Database Query
```bash
psql $DATABASE_URL
```

Then run:
```sql
SELECT COUNT(*) FROM universities;
SELECT COUNT(*) FROM departments;
SELECT COUNT(*) FROM advisors;
SELECT COUNT(*) FROM reviews;
SELECT COUNT(*) FROM tags;
```

Expected counts:
- Universities: 3
- Departments: 9
- Advisors: 45
- Reviews: ~135-225 (2-5 per advisor)
- Tags: 12

## Reset and Reseed

To clear all data and reseed:
```bash
npx prisma migrate reset
```
This will:
1. Drop the database
2. Recreate it
3. Run all migrations
4. Run the seed script automatically

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run: `npx prisma generate`

### "Database does not exist"
Create it first:
```bash
createdb rate_my_advisor
# Or via psql:
psql -U postgres -c "CREATE DATABASE rate_my_advisor;"
```

### "DATABASE_URL not set"
Ensure `.env.local` exists with:
```
DATABASE_URL="postgresql://user:password@localhost:5432/rate_my_advisor?schema=public"
```

### TypeScript errors
Ensure `tsconfig.json` includes:
```json
{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true
  }
}
```

## Package.json Scripts (Optional)

Add these to your `package.json` for convenience:

```json
{
  "scripts": {
    "db:seed": "tsx prisma/seed.ts",
    "db:reset": "prisma migrate reset",
    "db:studio": "prisma studio"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

Then you can simply run:
```bash
npm run db:seed
```


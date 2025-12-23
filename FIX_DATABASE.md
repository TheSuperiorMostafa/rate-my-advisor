# Fix Database Connection - Exact Commands

## Step 1: Navigate to Project
```bash
cd "/Users/mostafamahdi/Desktop/Rate my advisor "
```

## Step 2: Sync Database Schema to Prisma Cloud
```bash
export DATABASE_URL="postgres://d4f0b91898dbc11c1af603d11910ee2f12765acfa943550b871bc3b132a5f76a:sk_m2oRA5uzuhHWhfO7BXGwE@db.prisma.io:5432/postgres?sslmode=require"
npx prisma db push --skip-generate
```

## Step 3: Generate Prisma Client
```bash
npx prisma generate
```

## Step 4: Restart Dev Server
If your dev server is running:
1. Press `Ctrl+C` to stop it
2. Then run:
```bash
npm run dev
```

## Step 5: Test Sign In
1. Go to: http://localhost:3000/auth/signin
2. Click "Sign in with Google"
3. Complete Google sign-in
4. You should be redirected back successfully!

---

**Note:** The issue was that Prisma was using a local database from `.env`, but the app uses the Prisma cloud database from `.env.local`. The commands above sync the cloud database with your schema.


# Migration Steps for NextAuth

## Step 1: Update Database Schema

Run the migration to add the new fields:

```bash
npx prisma migrate dev --name add_auth_and_roles
```

This will:
- Add `role` field to User (default: "USER")
- Add `eduVerified` boolean field
- Add `eduEmail` field
- Create `EduVerification` table

## Step 2: Generate Prisma Client

```bash
npx prisma generate
```

## Step 3: Update Environment Variables

Add to `.env.local`:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@ratemyadvisor.com"
```

Generate secret:
```bash
openssl rand -base64 32
```

## Step 4: Update Your Root Layout

Add the `Providers` component to wrap your app. See `src/app/layout.example.tsx` for reference.

## Step 5: Test

1. Start your dev server: `npm run dev`
2. Visit `/auth/signin`
3. Sign in with your email
4. Check your email for the magic link
5. Click the link to sign in

## Step 6: Create Admin User

After signing in, update your user role:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

Or use Prisma Studio:
```bash
npx prisma studio
```

## Verification

- ✅ Can sign in via email magic link
- ✅ Can access `/admin` routes (if ADMIN)
- ✅ Can verify .edu email
- ✅ Reviews show verified badge


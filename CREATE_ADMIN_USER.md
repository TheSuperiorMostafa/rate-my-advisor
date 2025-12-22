# How to Create the First Admin User

## Option 1: Direct Database Update (Recommended for First Admin)

1. **Sign up as a regular user** through the app (use the sign-in page)
2. **Find your user ID** in the database:

```sql
SELECT id, email, role FROM users WHERE email = 'your-email@example.com';
```

3. **Update the user role to ADMIN**:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Option 2: Using Prisma Studio

1. Run `npx prisma studio`
2. Navigate to the `users` table
3. Find your user record
4. Edit the `role` field and change it from `USER` to `ADMIN`
5. Save

## Option 3: Using a Migration Script

Create a file `prisma/make-admin.ts`:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx prisma/make-admin.ts <email>");
    process.exit(1);
  }

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });

  console.log(`User ${user.email} is now an ADMIN`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Then run:
```bash
npx tsx prisma/make-admin.ts your-email@example.com
```

## Verify Admin Access

After updating, sign out and sign back in. You should now have access to:
- `/admin/*` routes
- `/api/mod/*` routes
- "Admin" badge in the auth button

## Multiple Admins

To create additional admins, repeat any of the above methods with different user emails.


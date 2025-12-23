# Prisma Migration Instructions

## Prerequisites

1. **Database Setup**: Ensure PostgreSQL is running and `DATABASE_URL` is set in `.env.local`
2. **Environment File**: Create `.env.local` with your database connection string:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/rate_my_advisor?schema=public"
   ```

## Step-by-Step Migration Process

### 1. Generate Prisma Client
```bash
npx prisma generate
```
This creates the Prisma Client based on your schema.

### 2. Create Initial Migration
```bash
npx prisma migrate dev --name init
```
This will:
- Create a new migration file in `prisma/migrations/`
- Apply the migration to your database
- Generate Prisma Client automatically

**Note**: If you get an error about the database not existing, create it first:
```bash
# For local PostgreSQL
createdb rate_my_advisor

# Or via psql
psql -U postgres
CREATE DATABASE rate_my_advisor;
\q
```

### 3. Verify Migration
```bash
npx prisma studio
```
Opens Prisma Studio in your browser to view the database tables.

### 4. Seed the Database (Optional)
```bash
npm run db:seed
# Or directly:
npx tsx prisma/seed.ts
```

## Common Commands

### Create a New Migration (after schema changes)
```bash
npx prisma migrate dev --name describe_your_changes
```

### Reset Database (⚠️ DESTRUCTIVE - deletes all data)
```bash
npx prisma migrate reset
```
This will:
- Drop the database
- Create a new database
- Run all migrations
- Run the seed script

### Apply Migrations (production)
```bash
npx prisma migrate deploy
```
Use this in production to apply pending migrations without creating new ones.

### View Migration Status
```bash
npx prisma migrate status
```

### Push Schema Changes (development only)
```bash
npx prisma db push
```
⚠️ **Warning**: Use only in development. This syncs your schema without creating migration files.

## Troubleshooting

### Migration Conflicts
If you have conflicts:
```bash
# Reset and start fresh (dev only)
npx prisma migrate reset

# Or resolve manually by editing migration files
```

### Database Connection Issues
- Verify `DATABASE_URL` in `.env.local`
- Check PostgreSQL is running: `pg_isready`
- Test connection: `psql $DATABASE_URL`

### Schema Drift
If your database and schema are out of sync:
```bash
# See what's different
npx prisma db pull

# Or reset (dev only)
npx prisma migrate reset
```

## Production Deployment

1. **Never run `migrate dev` in production**
2. **Use `migrate deploy`** to apply migrations
3. **Backup database** before migrations
4. **Test migrations** in staging first

```bash
# Production workflow
npx prisma migrate deploy
npx prisma generate
```


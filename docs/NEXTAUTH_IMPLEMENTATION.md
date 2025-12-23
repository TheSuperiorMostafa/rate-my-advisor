# NextAuth Implementation Summary

## ✅ What Was Implemented

### 1. Authentication System
- **Email Magic Link** authentication (simplest option)
- NextAuth.js v5 (beta) with Prisma adapter
- Database session strategy
- Role-based access control (USER | ADMIN)

### 2. Schema Updates
- Added `role` field to User (default: "USER")
- Added `eduVerified` boolean field
- Added `eduEmail` field (hashed)
- Added `EduVerification` model for verification codes

### 3. Middleware Protection
- `/admin/*` routes require ADMIN role
- `/api/mod/*` routes require ADMIN role
- Automatic redirects for unauthorized access

### 4. .edu Email Verification
- Request verification code via API
- 6-digit code sent to .edu email
- 15-minute expiration
- Verified badge stored on user account
- Reviews show "Verified Student" badge when user is verified

### 5. UI Components
- `AuthButton` - Sign in/out with role badges
- `EduVerification` - Component for verifying .edu email
- Sign-in page with email input
- Verify email confirmation page

## Files Created/Modified

### New Files
1. `src/lib/auth-config.ts` - NextAuth configuration
2. `src/app/api/auth/[...nextauth]/route.ts` - NextAuth API handler
3. `src/middleware.ts` - Route protection middleware
4. `src/app/auth/signin/page.tsx` - Sign-in page
5. `src/app/auth/verify-email/page.tsx` - Email verification page
6. `src/app/providers.tsx` - SessionProvider wrapper
7. `src/components/auth/AuthButton.tsx` - Auth button component
8. `src/components/auth/EduVerification.tsx` - .edu verification component
9. `src/components/ui/button.tsx` - Button component
10. `src/lib/utils.ts` - Utility functions
11. `src/types/next-auth.d.ts` - TypeScript declarations
12. `src/app/api/auth/edu-verify/request/route.ts` - Request verification code
13. `src/app/api/auth/edu-verify/confirm/route.ts` - Confirm verification code

### Modified Files
1. `prisma/schema.prisma` - Added role, eduVerified, EduVerification model
2. `src/lib/auth.ts` - Updated to use NextAuth sessions
3. `src/app/api/advisors/[id]/reviews/route.ts` - Uses verified status from session

## Setup Instructions

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_auth_and_roles
npx prisma generate
```

### 2. Add Environment Variables

See `ENV_VARIABLES.md` for complete list. Minimum required:

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@ratemyadvisor.com"
```

### 3. Update Root Layout

Add SessionProvider to your root layout:

```tsx
// src/app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
```

### 4. Create First Admin User

See `CREATE_ADMIN_USER.md` for instructions. Quick method:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

## Usage

### Sign In
1. User visits `/auth/signin`
2. Enters email address
3. Receives magic link via email
4. Clicks link to sign in

### Verify .edu Email
1. User signs in
2. Uses `EduVerification` component
3. Enters .edu email
4. Receives 6-digit code
5. Enters code to verify
6. Reviews now show "Verified Student" badge

### Admin Access
1. User with ADMIN role can access `/admin/*` routes
2. Middleware automatically protects routes
3. Non-admins are redirected to home

## API Endpoints

### Authentication
- `POST /api/auth/signin` - NextAuth sign-in
- `GET /api/auth/callback/*` - NextAuth callback
- `POST /api/auth/signout` - Sign out

### .edu Verification
- `POST /api/auth/edu-verify/request` - Request verification code
- `POST /api/auth/edu-verify/confirm` - Confirm code and verify

## Review Display

When a user creates a review:
- If `session.user.eduVerified === true`, review shows `isVerified: true`
- Review displays "Verified Student" badge
- User name remains anonymous (only badge shown)

## Security Features

1. **Role-based access** - Middleware enforces ADMIN role
2. **Email verification** - Only .edu emails can be verified
3. **Code expiration** - Verification codes expire in 15 minutes
4. **Rate limiting** - Verification requests limited to 3/hour
5. **Hashed storage** - .edu emails stored as SHA-256 hash

## Testing

1. **Test Sign In**:
   ```bash
   # Visit http://localhost:3000/auth/signin
   # Enter email, check email for magic link
   ```

2. **Test Admin Access**:
   ```bash
   # Create admin user (see CREATE_ADMIN_USER.md)
   # Visit http://localhost:3000/admin
   # Should have access
   ```

3. **Test .edu Verification**:
   ```bash
   # Sign in, use EduVerification component
   # Enter .edu email, receive code
   # Enter code to verify
   ```

## Troubleshooting

### "NEXTAUTH_SECRET is not set"
- Generate secret: `openssl rand -base64 32`
- Add to `.env.local`

### "Email not sending"
- Check SMTP credentials
- For Gmail, use App Password (not regular password)
- Check spam folder

### "Cannot access admin routes"
- Verify user role is "ADMIN" in database
- Sign out and sign back in to refresh session
- Check middleware configuration

### "Verification code not working"
- Codes expire in 15 minutes
- Check email spam folder
- Verify .edu domain is correct


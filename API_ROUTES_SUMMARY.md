# API Routes Implementation Summary

## Files Created

### Helper Utilities (`src/lib/`)

1. **prisma.ts** - Prisma client singleton
2. **validation.ts** - Zod schemas for all endpoints
3. **sanitize.ts** - Text sanitization and content analysis
4. **auth.ts** - Authentication helpers (getUserId, isAdmin, getClientIP)
5. **rate-limit.ts** - In-memory rate limiting (with production notes)
6. **ratings.ts** - Rating aggregation logic
7. **api-response.ts** - Standardized response helpers

### Public API Routes

1. **GET /api/universities** - List universities with search
2. **GET /api/universities/[id]** - Get university details
3. **GET /api/universities/[id]/departments** - List departments for university
4. **GET /api/departments/[id]/advisors** - List advisors with search
5. **GET /api/advisors/[id]** - Get advisor with rating aggregates
6. **GET /api/advisors/[id]/reviews** - Get approved reviews for advisor

### Authenticated Routes (Auth Required)

7. **POST /api/advisors/[id]/reviews** - Create review (defaults to pending)
8. **POST /api/reviews/[id]/vote** - Upvote helpful review
9. **POST /api/reviews/[id]/report** - Report inappropriate review

### Admin Routes

10. **GET /api/mod/reviews** - Get moderation queue
11. **POST /api/mod/reviews/[id]/approve** - Approve review
12. **POST /api/mod/reviews/[id]/reject** - Reject review

## Features Implemented

### ✅ Validation
- All inputs validated with Zod schemas
- Type-safe request/response handling
- Error messages for invalid inputs

### ✅ Rate Limiting
- In-memory rate limiting (100 req/min for most endpoints)
- Stricter limits for submissions (3 reviews/day, 5 reports/day)
- Production note: Use Redis-based solution

### ✅ Text Sanitization
- Email/phone number removal
- URL removal
- Profanity detection (basic)
- Medical/crime keyword detection
- Auto-flagging for problematic content

### ✅ Duplicate Prevention
- One vote per user/IP per review
- Unique constraints in database
- Proper error handling

### ✅ Rating Aggregations
- Overall rating (average of 6 categories)
- Per-category averages
- Review count
- Cached helpful counts

### ✅ Security
- Admin-only routes protected
- IP-based tracking for anonymous users
- Content analysis before approval
- Status-based filtering (approved reviews only)

## Required Dependencies

Add these to `package.json`:

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@prisma/client": "^6.19.1",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "prisma": "^6.19.1"
  }
}
```

## Configuration Needed

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
```

## TODO: Authentication Integration

The `auth.ts` file has placeholder functions. You need to:

1. **Integrate NextAuth.js** or your auth system
2. **Implement `getUserId()`** - Extract user ID from session/JWT
3. **Implement `isAdmin()`** - Check if user has admin role
4. **Update User model** - Add role field or admin_users table

Example NextAuth integration:

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserId(request: NextRequest): Promise<string | null> {
  const session = await getServerSession(authOptions);
  return session?.user?.id || null;
}
```

## Testing the Routes

### Example Requests

```bash
# Get universities
curl http://localhost:3000/api/universities?query=MIT

# Get advisor with ratings
curl http://localhost:3000/api/advisors/[advisor-id]

# Create review
curl -X POST http://localhost:3000/api/advisors/[advisor-id]/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "ratings": {
      "accuracy": 5,
      "responsiveness": 4,
      "helpfulness": 5,
      "availability": 3,
      "advocacy": 4,
      "clarity": 5
    },
    "text": "Great advisor who really helped me...",
    "meetingType": "in_person",
    "timeframe": "last_6_months"
  }'

# Vote on review
curl -X POST http://localhost:3000/api/reviews/[review-id]/vote
```

## Production Considerations

1. **Rate Limiting**: Replace in-memory with Redis (@upstash/ratelimit)
2. **Authentication**: Implement full NextAuth.js setup
3. **Email Verification**: Integrate Resend or SendGrid
4. **Profanity Filter**: Use comprehensive library or service
5. **Caching**: Add Redis caching for frequently accessed data
6. **Monitoring**: Add error tracking (Sentry)
7. **Logging**: Structured logging for moderation actions

## Error Handling

All routes return standardized error responses:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (auth required)
- `403` - Forbidden (admin required)
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error


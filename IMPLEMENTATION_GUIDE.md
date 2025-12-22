# Implementation Guide: Rate My Advisor

## 1. Technology Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js v5 (Auth.js)
- **Validation:** Zod
- **Forms:** React Hook Form
- **UI Components:** shadcn/ui (Radix UI + Tailwind)
- **Email:** Resend
- **Deployment:** Vercel

---

## 2. Folder Structure

```
rate-my-advisor/
├── .env.local                    # Local environment variables
├── .env.example                  # Example env file
├── .eslintrc.json                # ESLint config
├── .gitignore
├── next.config.js                # Next.js config
├── package.json
├── postcss.config.js             # PostCSS for Tailwind
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
├── prisma/
│   ├── schema.prisma             # Prisma schema
│   ├── seed.ts                   # Database seed script
│   └── migrations/               # Auto-generated migrations
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles
│   │   ├── (public)/             # Public route group
│   │   │   ├── universities/
│   │   │   │   ├── page.tsx      # University list
│   │   │   │   └── [slug]/
│   │   │   │       ├── page.tsx  # University detail
│   │   │   │       └── departments/
│   │   │   │           └── [slug]/
│   │   │   │               ├── page.tsx  # Department detail
│   │   │   │               └── advisors/
│   │   │   │                   └── [slug]/
│   │   │   │                       └── page.tsx  # Advisor profile
│   │   │   ├── search/
│   │   │   │   └── page.tsx      # Search results
│   │   │   ├── reviews/
│   │   │   │   └── submitted/
│   │   │   │       └── page.tsx  # Review submission success
│   │   │   └── verify/
│   │   │       └── [token]/
│   │   │           └── page.tsx  # Email verification
│   │   ├── (admin)/              # Admin route group
│   │   │   ├── admin/
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx  # Admin login
│   │   │   │   ├── moderation/
│   │   │   │   │   ├── page.tsx  # Moderation queue
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx  # Review detail (admin)
│   │   │   │   └── reports/
│   │   │   │       └── page.tsx  # Reports dashboard
│   │   │   └── layout.tsx        # Admin layout (with auth check)
│   │   ├── api/                  # API routes
│   │   │   ├── universities/
│   │   │   │   ├── route.ts      # GET /api/universities
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts  # GET /api/universities/[slug]
│   │   │   ├── universities/
│   │   │   │   └── [universitySlug]/
│   │   │   │       └── departments/
│   │   │   │           ├── route.ts
│   │   │   │           └── [slug]/
│   │   │   │               └── route.ts
│   │   │   ├── universities/
│   │   │   │   └── [universitySlug]/
│   │   │   │       └── departments/
│   │   │   │           └── [departmentSlug]/
│   │   │   │               └── advisors/
│   │   │   │                   ├── route.ts
│   │   │   │                   └── [slug]/
│   │   │   │                       └── route.ts
│   │   │   ├── reviews/
│   │   │   │   ├── route.ts      # POST /api/reviews
│   │   │   │   └── [id]/
│   │   │   │       ├── route.ts  # GET /api/reviews/[id]
│   │   │   │       ├── upvote/
│   │   │   │       │   └── route.ts
│   │   │   │       └── report/
│   │   │   │           └── route.ts
│   │   │   ├── search/
│   │   │   │   └── route.ts      # GET /api/search
│   │   │   ├── verify/
│   │   │   │   └── [token]/
│   │   │   │       └── route.ts  # GET /api/verify/[token]
│   │   │   ├── admin/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── logout/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── moderation/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── route.ts
│   │   │   │   ├── reviews/
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── approve/
│   │   │   │   │       │   └── route.ts
│   │   │   │   │       ├── reject/
│   │   │   │   │       │   └── route.ts
│   │   │   │   │       └── flag/
│   │   │   │   │           └── route.ts
│   │   │   │   └── reports/
│   │   │   │       ├── route.ts
│   │   │   │       └── [id]/
│   │   │   │           └── resolve/
│   │   │   │               └── route.ts
│   │   │   └── auth/
│   │   │       └── [...nextauth]/
│   │   │           └── route.ts  # NextAuth handler
│   │   └── error.tsx              # Error boundary
│   ├── components/                # React components
│   │   ├── ui/                    # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── select.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── Breadcrumb.tsx
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── university/
│   │   │   ├── UniversityCard.tsx
│   │   │   ├── UniversityHeader.tsx
│   │   │   └── UniversityList.tsx
│   │   ├── department/
│   │   │   ├── DepartmentCard.tsx
│   │   │   ├── DepartmentHeader.tsx
│   │   │   └── DepartmentList.tsx
│   │   ├── advisor/
│   │   │   ├── AdvisorCard.tsx
│   │   │   ├── AdvisorHeader.tsx
│   │   │   └── AdvisorList.tsx
│   │   ├── rating/
│   │   │   ├── StarRating.tsx
│   │   │   ├── RatingInput.tsx
│   │   │   ├── RatingBreakdown.tsx
│   │   │   └── OverallRating.tsx
│   │   ├── review/
│   │   │   ├── ReviewCard.tsx
│   │   │   ├── ReviewList.tsx
│   │   │   ├── ReviewForm.tsx
│   │   │   ├── ReviewText.tsx
│   │   │   ├── ReviewTags.tsx
│   │   │   ├── ReviewMetadata.tsx
│   │   │   ├── HelpfulButton.tsx
│   │   │   └── ReportButton.tsx
│   │   ├── moderation/
│   │   │   ├── ModerationQueue.tsx
│   │   │   ├── ModerationCard.tsx
│   │   │   ├── ModerationActions.tsx
│   │   │   ├── ReportCard.tsx
│   │   │   └── ContentPreview.tsx
│   │   └── shared/
│   │       ├── Pagination.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── ErrorMessage.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Disclaimer.tsx
│   │       └── VerifiedBadge.tsx
│   ├── lib/                       # Utilities and config
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth config
│   │   ├── validation.ts          # Zod schemas
│   │   ├── email.ts               # Email utilities (Resend)
│   │   ├── moderation.ts          # Auto-flagging logic
│   │   ├── utils.ts               # General utilities
│   │   └── constants.ts           # App constants
│   ├── types/                     # TypeScript types
│   │   ├── database.ts            # Prisma-generated types
│   │   ├── api.ts                 # API request/response types
│   │   └── review.ts              # Review-related types
│   └── hooks/                     # Custom React hooks
│       ├── useReviews.ts
│       ├── useSearch.ts
│       └── useModeration.ts
├── public/                        # Static assets
│   ├── images/
│   └── favicon.ico
└── README.md
```

---

## 3. Required Packages

### 3.1 Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "typescript": "^5.4.0",
    "@prisma/client": "^5.15.0",
    "prisma": "^5.15.0",
    "next-auth": "^5.0.0-beta.15",
    "@auth/prisma-adapter": "^2.4.0",
    "zod": "^3.23.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4",
    "resend": "^3.2.0",
    "bcryptjs": "^2.4.3",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.2.1",
    "lucide-react": "^0.378.0",
    "date-fns": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/bcryptjs": "^2.4.6",
    "autoprefixer": "^10.4.17",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "@typescript-eslint/eslint-plugin": "^6.21.0",
    "@typescript-eslint/parser": "^6.21.0",
    "prettier": "^3.2.5",
    "prettier-plugin-tailwindcss": "^0.5.11"
  }
}
```

### 3.2 Package Installation Command

```bash
npm install next@latest react@latest react-dom@latest typescript @prisma/client prisma next-auth@beta @auth/prisma-adapter zod react-hook-form @hookform/resolvers resend bcryptjs @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-toast class-variance-authority clsx tailwind-merge lucide-react date-fns

npm install -D @types/node @types/react @types/react-dom @types/bcryptjs autoprefixer postcss tailwindcss eslint eslint-config-next @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier prettier-plugin-tailwindcss
```

---

## 4. Environment Variables

### 4.1 `.env.example` File

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/rate_my_advisor?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxxxxx"
EMAIL_FROM="noreply@yourdomain.com"
EMAIL_FROM_NAME="Rate My Advisor"

# App
APP_URL="http://localhost:3000"
NODE_ENV="development"

# Rate Limiting (optional)
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=60000
```

### 4.2 Environment-Specific Notes

**Development (.env.local):**
- Use local PostgreSQL or Docker container
- `NEXTAUTH_URL` = `http://localhost:3000`
- Use Resend test API key

**Production (.env.production):**
- Use production PostgreSQL (Supabase/Railway/AWS RDS)
- `NEXTAUTH_URL` = your production domain
- Generate strong `NEXTAUTH_SECRET` (use `openssl rand -base64 32`)
- Use production Resend API key

---

## 5. Step-by-Step Setup Commands

### 5.1 Initial Project Setup

```bash
# 1. Create Next.js app with TypeScript
npx create-next-app@latest rate-my-advisor --typescript --tailwind --app --no-src-dir --import-alias "@/*"

# 2. Navigate to project
cd rate-my-advisor

# 3. Install all dependencies
npm install next@latest react@latest react-dom@latest typescript @prisma/client prisma next-auth@beta @auth/prisma-adapter zod react-hook-form @hookform/resolvers resend bcryptjs @radix-ui/react-slot @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-toast class-variance-authority clsx tailwind-merge lucide-react date-fns

npm install -D @types/node @types/react @types/react-dom @types/bcryptjs autoprefixer postcss tailwindcss eslint eslint-config-next @typescript-eslint/eslint-plugin @typescript-eslint/parser prettier prettier-plugin-tailwindcss
```

### 5.2 Folder Structure Setup

```bash
# 4. Create folder structure
mkdir -p src/app/{api,\(public\),\(admin\)}
mkdir -p src/app/\(public\)/universities/\[slug\]/departments/\[slug\]/advisors/\[slug\]
mkdir -p src/app/\(public\)/{search,reviews/submitted,verify/\[token\]}
mkdir -p src/app/\(admin\)/admin/{login,moderation/\[id\],reports}
mkdir -p src/app/api/{universities,reviews,search,verify,admin}
mkdir -p src/components/{ui,layout,search,university,department,advisor,rating,review,moderation,shared}
mkdir -p src/lib src/types src/hooks
mkdir -p prisma public/images
```

### 5.3 Configuration Files

```bash
# 5. Initialize Prisma
npx prisma init

# 6. Create .env.local (copy from .env.example and fill in values)
cp .env.example .env.local
# Edit .env.local with your database URL and secrets
```

### 5.4 Database Setup

```bash
# 7. Create Prisma schema (see Prisma schema section below)
# Edit prisma/schema.prisma

# 8. Generate Prisma Client
npx prisma generate

# 9. Create and run migrations
npx prisma migrate dev --name init

# 10. (Optional) Seed database
# Create prisma/seed.ts, then:
npx prisma db seed
```

### 5.5 shadcn/ui Setup

```bash
# 11. Initialize shadcn/ui
npx shadcn@latest init
# Select: TypeScript, Default style, App directory, Tailwind CSS, CSS variables

# 12. Add required shadcn/ui components
npx shadcn@latest add button input textarea select card badge dialog toast label form
```

### 5.6 NextAuth Setup

```bash
# 13. Create NextAuth API route structure
mkdir -p src/app/api/auth/\[...nextauth\]
# Create route.ts file (see NextAuth config section)
```

### 5.7 Development Server

```bash
# 14. Start development server
npm run dev

# 15. Open browser
open http://localhost:3000
```

### 5.8 Additional Setup

```bash
# 16. Set up Prettier (create .prettierrc)
# 17. Set up ESLint (update .eslintrc.json)
# 18. Create README.md with project documentation
```

---

## 6. Configuration Files

### 6.1 `tsconfig.json`

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
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 6.2 `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### 6.3 `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
```

### 6.4 `.eslintrc.json`

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "project": "./tsconfig.json"
  },
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-explicit-any": "warn",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### 6.5 `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": false,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

### 6.6 `package.json` Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,js,jsx,json,md}\"",
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "type-check": "tsc --noEmit"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

---

## 7. Prisma Schema Outline

### 7.1 Schema File Location
`prisma/schema.prisma`

### 7.2 Key Models (from Technical Plan)

```prisma
// See TECHNICAL_PLAN.md Section 2.2 for full schema
// Key models:
// - University
// - Department
// - Advisor
// - Review
// - ReviewRating
// - Tag
// - ReviewTag
// - ReviewUpvote
// - ReviewReport
// - ReviewVerification
// - AdminUser (via NextAuth)
```

**Note:** Full Prisma schema will be implemented based on the database schema in TECHNICAL_PLAN.md Section 2.2.

---

## 8. Engineering Rules Checklist

### 8.1 Code Quality

**Linting:**
- [ ] ESLint runs on all `.ts`, `.tsx`, `.js`, `.jsx` files
- [ ] No `any` types (use `unknown` or proper types)
- [ ] All unused variables removed (or prefixed with `_`)
- [ ] React hooks dependencies properly declared
- [ ] No `console.log` in production code (use proper logging)

**Formatting:**
- [ ] Prettier configured and runs on save
- [ ] Consistent indentation (2 spaces)
- [ ] Trailing commas in multi-line objects/arrays
- [ ] Single quotes for strings (or double, but consistent)
- [ ] Tailwind classes sorted via prettier-plugin-tailwindcss

**TypeScript:**
- [ ] Strict mode enabled
- [ ] All functions have explicit return types
- [ ] No `@ts-ignore` or `@ts-expect-error` without comments
- [ ] Prisma types generated and used (`Prisma.AdvisorCreateInput`, etc.)
- [ ] API routes have typed request/response

### 8.2 Error Handling

**API Routes:**
- [ ] All API routes wrapped in try-catch
- [ ] Proper HTTP status codes returned (200, 400, 401, 403, 404, 500)
- [ ] Error messages never expose sensitive data
- [ ] Validation errors return 400 with details
- [ ] Database errors return 500 with generic message

**Client-Side:**
- [ ] All async operations wrapped in try-catch
- [ ] Error boundaries for React components
- [ ] User-friendly error messages displayed
- [ ] Loading states shown during async operations
- [ ] Network errors handled gracefully

**Database:**
- [ ] All Prisma queries use transactions where needed
- [ ] Foreign key constraints handled
- [ ] Unique constraint violations caught and handled
- [ ] Connection errors logged and retried

### 8.3 Security

**Authentication:**
- [ ] Admin routes protected with NextAuth middleware
- [ ] Passwords hashed with bcrypt (12+ salt rounds)
- [ ] JWT tokens have expiration
- [ ] Session management secure (HttpOnly cookies)

**Input Validation:**
- [ ] All user inputs validated with Zod schemas
- [ ] Server-side validation (not just client-side)
- [ ] SQL injection prevented (Prisma parameterized queries)
- [ ] XSS prevented (React auto-escaping, sanitize HTML if needed)

**Rate Limiting:**
- [ ] API endpoints rate-limited (100 req/min per IP)
- [ ] Review submission limited (3 per IP per day)
- [ ] Upvote limited (1 per review per IP)
- [ ] Report limited (5 per IP per day)

**Content Security:**
- [ ] Auto-flagging for profanity, contact info, etc.
- [ ] Email addresses hashed before storage
- [ ] No PII in logs or error messages
- [ ] HTTPS enforced in production

### 8.4 Performance

**Database:**
- [ ] Indexes on all foreign keys
- [ ] Indexes on search fields (name, slug)
- [ ] Materialized view for advisor ratings (refresh on review approval)
- [ ] Connection pooling configured

**Frontend:**
- [ ] Images optimized (Next.js Image component)
- [ ] Code splitting (dynamic imports for heavy components)
- [ ] Lazy loading for review lists
- [ ] Static pages generated where possible (SSG)

**API:**
- [ ] Response caching for read-heavy endpoints (5-10 min)
- [ ] Pagination for all list endpoints
- [ ] Database queries optimized (avoid N+1)

### 8.5 Testing

**Before Committing:**
- [ ] Type checking passes (`npm run type-check`)
- [ ] Linting passes (`npm run lint`)
- [ ] Formatting passes (`npm run format:check`)
- [ ] No console errors in browser
- [ ] Manual smoke test of changed features

**Before Deploying:**
- [ ] All migrations tested
- [ ] Database seed script works
- [ ] Environment variables set correctly
- [ ] Build succeeds (`npm run build`)
- [ ] Production build tested locally

### 8.6 Git & Version Control

**Commits:**
- [ ] Descriptive commit messages
- [ ] Related changes grouped in single commit
- [ ] `.env.local` in `.gitignore`
- [ ] `node_modules` in `.gitignore`
- [ ] Prisma migrations committed

**Branches:**
- [ ] Feature branches for new features
- [ ] `main` branch always deployable
- [ ] PR reviews required before merge

### 8.7 Documentation

**Code:**
- [ ] Complex functions have JSDoc comments
- [ ] API routes have request/response examples
- [ ] Component props documented (TypeScript types)
- [ ] Environment variables documented in `.env.example`

**Project:**
- [ ] README.md with setup instructions
- [ ] PRD and Technical Plan kept up to date
- [ ] API endpoints documented (or use OpenAPI/Swagger)

### 8.8 Accessibility

- [ ] Semantic HTML used (`<nav>`, `<main>`, `<article>`, etc.)
- [ ] ARIA labels where needed
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Color contrast meets WCAG AA
- [ ] Alt text for images

### 8.9 SEO

- [ ] Unique `<title>` tags on all pages
- [ ] Unique `<meta description>` on all pages
- [ ] Open Graph tags for social sharing
- [ ] Structured data (JSON-LD) for advisor profiles
- [ ] Sitemap generated
- [ ] robots.txt configured

---

## 9. Development Workflow

### 9.1 Daily Development

1. Pull latest changes: `git pull origin main`
2. Create feature branch: `git checkout -b feature/feature-name`
3. Make changes
4. Run type check: `npm run type-check`
5. Run linter: `npm run lint`
6. Format code: `npm run format`
7. Test locally: `npm run dev`
8. Commit: `git commit -m "feat: description"`
9. Push: `git push origin feature/feature-name`
10. Create PR

### 9.2 Database Changes

1. Update `prisma/schema.prisma`
2. Generate Prisma Client: `npm run db:generate`
3. Create migration: `npm run db:migrate`
4. Test migration locally
5. Commit schema and migration files

### 9.3 Before Deployment

1. Update version in `package.json`
2. Run full test suite (when available)
3. Build production: `npm run build`
4. Test production build locally: `npm start`
5. Verify environment variables
6. Deploy to staging first
7. Test staging thoroughly
8. Deploy to production

---

## 10. Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run type-check       # TypeScript type check

# Database
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema changes (dev)
npm run db:migrate       # Create migration
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database

# Git
git checkout -b feature/name  # Create feature branch
git commit -m "type: message" # Commit (conventional commits)
```

---

## 11. Next Steps

1. **Set up Prisma schema** based on TECHNICAL_PLAN.md Section 2.2
2. **Create NextAuth configuration** for admin authentication
3. **Set up Zod schemas** for validation
4. **Create initial UI components** (shadcn/ui base components)
5. **Implement API routes** starting with public endpoints
6. **Build pages** starting with homepage and university list
7. **Implement moderation system** (auto-flagging + manual review)
8. **Add email verification** flow
9. **Set up deployment** (Vercel + database)
10. **Test end-to-end** workflows

---

## 12. Resources

- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js v5 Docs](https://authjs.dev)
- [Zod Docs](https://zod.dev)
- [React Hook Form Docs](https://react-hook-form.com)
- [shadcn/ui Docs](https://ui.shadcn.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)


# Rate My Advisor

A platform for students to find and review academic advisors at universities nationwide.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Database:** PostgreSQL + Prisma
- **Authentication:** NextAuth.js v5
- **Validation:** Zod
- **Forms:** React Hook Form

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your values

# Set up database
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Run development server
npm run dev
```

## Deployment

See `DEPLOY_NOW.md` for quick deployment steps to Vercel.

## Environment Variables

See `ENV_VARIABLES.md` for complete list of required environment variables.

## Documentation

- `PRD.md` - Product Requirements Document
- `TECHNICAL_PLAN.md` - Technical implementation plan
- `LAUNCH_READINESS_CHECKLIST.md` - Pre-launch checklist
- `ROADMAP.md` - Future features

## License

ISC



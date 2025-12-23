# Changelog

All notable changes to Rate My Advisor will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-12-22

### Added - MVP Launch

#### Core Features
- University, department, and advisor browsing
- Search functionality across all entities
- Advisor profile pages with rating summaries
- Review submission with 6-category ratings
- Anonymous and verified (.edu) reviews
- Review sorting (newest, helpful, highest, lowest)
- Rating aggregations and distributions
- Tag system for reviews

#### Authentication
- Email magic link authentication (NextAuth.js)
- Role-based access control (USER/ADMIN)
- .edu email verification with 6-digit codes
- Verified student badges on reviews

#### Moderation
- Admin moderation dashboard
- Review approval/rejection workflow
- Report handling system
- Auto-flagging for problematic content
- Moderation audit trail

#### Abuse Prevention
- Rate limiting (IP + fingerprint-based)
- Spam detection heuristics
- Text sanitization (email/phone removal)
- Threat detection and removal
- CAPTCHA integration (optional)

#### SEO & Performance
- Server-side rendering (SSR)
- Dynamic sitemap generation
- robots.txt configuration
- Security headers
- Optimized database queries

#### Legal & Policy
- Privacy Policy
- Terms of Service
- DMCA Policy
- Content Policy
- Moderation Policy

### Technical Stack
- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Prisma + PostgreSQL
- NextAuth.js v5
- Zod validation
- React Hook Form

---

## [Unreleased] - Future Versions

### Planned for v1.1.0
- Enhanced search with filters
- User accounts and profiles
- Review editing
- Email notifications
- Analytics dashboard

### Planned for v2.0.0
- Advisor verification and responses
- ML-based spam detection
- Mobile apps (iOS/Android)
- Public API
- Multi-language support

See [ROADMAP.md](./ROADMAP.md) for detailed future plans.

---

## Version History

- **1.0.0** (2024-12-22) - Initial MVP release


# Technical Plan: Rate My Advisor

## 1. Technology Stack Recommendations

### 1.1 Frontend
- **Framework:** Next.js 14+ (React) - for SSR/SSG and SEO
- **Styling:** Tailwind CSS + shadcn/ui components
- **State Management:** React Context / Zustand (lightweight)
- **Forms:** React Hook Form + Zod validation
- **Search:** Client-side filtering + server-side search API

### 1.2 Backend
- **Framework:** Next.js API Routes (or separate Express.js/Fastify)
- **Database:** PostgreSQL (via Supabase, Railway, or self-hosted)
- **ORM:** Prisma or Drizzle
- **Authentication:** NextAuth.js (for admin) or simple JWT
- **Email:** Resend, SendGrid, or AWS SES

### 1.3 Infrastructure
- **Hosting:** Vercel (Next.js) or Railway/Render
- **Database:** Supabase, Railway PostgreSQL, or AWS RDS
- **CDN:** Vercel Edge Network or Cloudflare
- **Monitoring:** Sentry (errors), Vercel Analytics

### 1.4 Third-Party Services
- **Email Verification:** Custom .edu email validation
- **Content Moderation:** Basic keyword filtering + manual review
- **Search:** PostgreSQL full-text search or Algolia (if needed)

---

## 2. Data Model

### 2.1 Entity Relationship Diagram

```
University (1) ──< (N) Department
Department (1) ──< (N) Advisor
Advisor (1) ──< (N) Review
Review (1) ──< (N) ReviewRating (category ratings)
Review (1) ──< (N) ReviewTag (many-to-many via junction)
Review (1) ──< (N) ReviewReport
Review (1) ──< (N) ReviewUpvote
Review (1) ──< (0..1) ReviewVerification
Tag (1) ──< (N) ReviewTag
```

### 2.2 Database Schema

#### 2.2.1 University
```sql
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  location VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_universities_name ON universities(name);
```

#### 2.2.2 Department
```sql
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(university_id, slug)
);

CREATE INDEX idx_departments_university ON departments(university_id);
CREATE INDEX idx_departments_slug ON departments(slug);
```

#### 2.2.3 Advisor
```sql
CREATE TABLE advisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  title VARCHAR(255), -- e.g., "Senior Academic Advisor"
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(department_id, slug)
);

CREATE INDEX idx_advisors_department ON advisors(department_id);
CREATE INDEX idx_advisors_slug ON advisors(slug);
CREATE INDEX idx_advisors_name ON advisors(last_name, first_name);
```

#### 2.2.4 Review
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  advisor_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  text TEXT NOT NULL CHECK (LENGTH(text) >= 50 AND LENGTH(text) <= 2000),
  meeting_type VARCHAR(50) NOT NULL CHECK (meeting_type IN ('in_person', 'virtual', 'email', 'mixed')),
  timeframe VARCHAR(50) NOT NULL CHECK (timeframe IN ('last_6_months', '6_12_months', '1_2_years', '2_plus_years')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'flagged')),
  is_verified BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP,
  reviewed_by UUID -- admin user ID
);

CREATE INDEX idx_reviews_advisor ON reviews(advisor_id);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created ON reviews(created_at DESC);
CREATE INDEX idx_reviews_helpful ON reviews(helpful_count DESC);
```

#### 2.2.5 ReviewRating (Category Ratings)
```sql
CREATE TABLE review_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL CHECK (category IN ('accuracy', 'responsiveness', 'helpfulness', 'availability', 'advocacy', 'clarity')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  UNIQUE(review_id, category)
);

CREATE INDEX idx_review_ratings_review ON review_ratings(review_id);
CREATE INDEX idx_review_ratings_category ON review_ratings(category, rating);
```

#### 2.2.6 Tag
```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tags_slug ON tags(slug);
```

#### 2.2.7 ReviewTag (Junction Table)
```sql
CREATE TABLE review_tags (
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (review_id, tag_id)
);

CREATE INDEX idx_review_tags_review ON review_tags(review_id);
CREATE INDEX idx_review_tags_tag ON review_tags(tag_id);
```

#### 2.2.8 ReviewUpvote
```sql
CREATE TABLE review_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(review_id, ip_address) -- Prevent duplicate upvotes from same IP
);

CREATE INDEX idx_review_upvotes_review ON review_upvotes(review_id);
```

#### 2.2.9 ReviewReport
```sql
CREATE TABLE review_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  reason VARCHAR(50) NOT NULL CHECK (reason IN ('doxxing', 'hate_speech', 'off_topic', 'spam', 'other')),
  details TEXT,
  ip_address INET,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by UUID -- admin user ID
);

CREATE INDEX idx_review_reports_review ON review_reports(review_id);
CREATE INDEX idx_review_reports_status ON review_reports(status);
```

#### 2.2.10 ReviewVerification
```sql
CREATE TABLE review_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL, -- Hashed or encrypted
  verification_token UUID UNIQUE NOT NULL,
  verified_at TIMESTAMP,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_review_verifications_token ON review_verifications(verification_token);
CREATE INDEX idx_review_verifications_review ON review_verifications(review_id);
```

#### 2.2.11 AdminUser (for moderation)
```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'moderator' CHECK (role IN ('moderator', 'admin')),
  created_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_admin_users_email ON admin_users(email);
```

### 2.3 Computed Fields & Views

#### 2.3.1 Advisor Aggregated Ratings (Materialized View or Computed)
```sql
-- Materialized view for performance
CREATE MATERIALIZED VIEW advisor_ratings_summary AS
SELECT 
  a.id AS advisor_id,
  COUNT(r.id) AS total_reviews,
  AVG(
    (rr_accuracy.rating + rr_responsiveness.rating + rr_helpfulness.rating + 
     rr_availability.rating + rr_advocacy.rating + rr_clarity.rating) / 6.0
  ) AS overall_rating,
  AVG(rr_accuracy.rating) AS accuracy_avg,
  AVG(rr_responsiveness.rating) AS responsiveness_avg,
  AVG(rr_helpfulness.rating) AS helpfulness_avg,
  AVG(rr_availability.rating) AS availability_avg,
  AVG(rr_advocacy.rating) AS advocacy_avg,
  AVG(rr_clarity.rating) AS clarity_avg
FROM advisors a
LEFT JOIN reviews r ON a.id = r.advisor_id AND r.status = 'approved'
LEFT JOIN review_ratings rr_accuracy ON r.id = rr_accuracy.review_id AND rr_accuracy.category = 'accuracy'
LEFT JOIN review_ratings rr_responsiveness ON r.id = rr_responsiveness.review_id AND rr_responsiveness.category = 'responsiveness'
LEFT JOIN review_ratings rr_helpfulness ON r.id = rr_helpfulness.review_id AND rr_helpfulness.category = 'helpfulness'
LEFT JOIN review_ratings rr_availability ON r.id = rr_availability.review_id AND rr_availability.category = 'availability'
LEFT JOIN review_ratings rr_advocacy ON r.id = rr_advocacy.review_id AND rr_advocacy.category = 'advocacy'
LEFT JOIN review_ratings rr_clarity ON r.id = rr_clarity.review_id AND rr_clarity.category = 'clarity'
GROUP BY a.id;

CREATE UNIQUE INDEX idx_advisor_ratings_summary_advisor ON advisor_ratings_summary(advisor_id);

-- Refresh after review approval/rejection
-- REFRESH MATERIALIZED VIEW advisor_ratings_summary;
```

---

## 3. API Endpoints

### 3.1 Public Endpoints (No Auth Required)

#### 3.1.1 Universities
```
GET /api/universities
  Query params: ?page=1&limit=20&search=mit
  Response: { universities: [...], total: 100, page: 1, limit: 20 }

GET /api/universities/:slug
  Response: { university: {...}, departments: [...] }
```

#### 3.1.2 Departments
```
GET /api/universities/:universitySlug/departments
  Query params: ?page=1&limit=20
  Response: { departments: [...], total: 50 }

GET /api/universities/:universitySlug/departments/:slug
  Response: { department: {...}, advisors: [...] }
```

#### 3.1.3 Advisors
```
GET /api/universities/:universitySlug/departments/:departmentSlug/advisors
  Query params: ?page=1&limit=20&search=smith
  Response: { advisors: [...], total: 30 }

GET /api/universities/:universitySlug/departments/:departmentSlug/advisors/:slug
  Response: {
    advisor: {...},
    ratings: {
      overall: 4.2,
      accuracy: 4.5,
      responsiveness: 4.0,
      ...
    },
    reviews: [...],
    total_reviews: 15
  }
```

#### 3.1.4 Reviews
```
GET /api/reviews/:reviewId
  Response: { review: {...} }

POST /api/reviews
  Body: {
    advisor_id: "uuid",
    ratings: {
      accuracy: 5,
      responsiveness: 4,
      helpfulness: 5,
      availability: 3,
      advocacy: 4,
      clarity: 5
    },
    text: "Great advisor...",
    meeting_type: "in_person",
    timeframe: "last_6_months",
    tags: ["responsive", "knowledgeable"],
    email?: "student@university.edu" // optional
  }
  Response: { 
    review_id: "uuid",
    verification_token?: "uuid" // if email provided
  }

POST /api/reviews/:reviewId/upvote
  Headers: { "X-Forwarded-For": "ip" }
  Response: { helpful_count: 5 }

POST /api/reviews/:reviewId/report
  Body: {
    reason: "off_topic",
    details?: "Additional context"
  }
  Response: { report_id: "uuid" }
```

#### 3.1.5 Search
```
GET /api/search
  Query params: ?q=mit+computer+science&type=all|university|department|advisor
  Response: {
    universities: [...],
    departments: [...],
    advisors: [...]
  }
```

#### 3.1.6 Verification
```
GET /api/verify/:token
  Response: { verified: true, review_id: "uuid" }
```

### 3.2 Admin Endpoints (Auth Required)

#### 3.2.1 Authentication
```
POST /api/admin/login
  Body: { email: "...", password: "..." }
  Response: { token: "jwt", user: {...} }

POST /api/admin/logout
  Headers: { Authorization: "Bearer token" }
```

#### 3.2.2 Moderation Queue
```
GET /api/admin/moderation
  Query params: ?status=pending|reported|flagged&page=1&limit=20
  Response: { reviews: [...], total: 50 }

GET /api/admin/moderation/:reviewId
  Response: { review: {...}, reports: [...] }
```

#### 3.2.3 Review Actions
```
POST /api/admin/reviews/:reviewId/approve
  Body: { notes?: "..." }
  Response: { success: true }

POST /api/admin/reviews/:reviewId/reject
  Body: { reason: "...", notes: "..." }
  Response: { success: true }

POST /api/admin/reviews/:reviewId/flag
  Body: { reason: "..." }
  Response: { success: true }
```

#### 3.2.4 Reports
```
GET /api/admin/reports
  Query params: ?status=pending&page=1
  Response: { reports: [...], total: 10 }

POST /api/admin/reports/:reportId/resolve
  Body: { action: "dismiss|remove_review", notes: "..." }
  Response: { success: true }
```

---

## 4. Pages & Routes

### 4.1 Public Pages

#### 4.1.1 Homepage
- **Route:** `/`
- **Purpose:** Landing page with search, featured universities, CTA
- **Components:** SearchBar, UniversityGrid, HeroSection

#### 4.1.2 University List
- **Route:** `/universities`
- **Purpose:** Browse all universities
- **Components:** UniversityCard, Pagination, SearchBar

#### 4.1.3 University Detail
- **Route:** `/universities/[slug]`
- **Purpose:** View university and its departments
- **Components:** UniversityHeader, DepartmentList, Breadcrumb

#### 4.1.4 Department Detail
- **Route:** `/universities/[universitySlug]/departments/[slug]`
- **Purpose:** View department and its advisors
- **Components:** DepartmentHeader, AdvisorList, Breadcrumb

#### 4.1.5 Advisor Profile
- **Route:** `/universities/[universitySlug]/departments/[departmentSlug]/advisors/[slug]`
- **Purpose:** View advisor ratings and reviews
- **Components:** AdvisorHeader, RatingBreakdown, ReviewList, ReviewForm, Breadcrumb

#### 4.1.6 Search Results
- **Route:** `/search?q=...`
- **Purpose:** Display search results across all entities
- **Components:** SearchResults, ResultCard, Filters

#### 4.1.7 Review Submission Success
- **Route:** `/reviews/submitted`
- **Purpose:** Confirmation page after review submission
- **Components:** SuccessMessage, VerificationPrompt

#### 4.1.8 Verification Page
- **Route:** `/verify/[token]`
- **Purpose:** Email verification confirmation
- **Components:** VerificationStatus

### 4.2 Admin Pages

#### 4.2.1 Admin Login
- **Route:** `/admin/login`
- **Purpose:** Admin authentication
- **Components:** LoginForm

#### 4.2.2 Moderation Dashboard
- **Route:** `/admin/moderation`
- **Purpose:** View and manage moderation queue
- **Components:** ModerationQueue, ReviewCard, ActionButtons, Filters

#### 4.2.3 Review Detail (Admin)
- **Route:** `/admin/reviews/[id]`
- **Purpose:** Detailed review view for moderation
- **Components:** ReviewDetail, ModerationActions, ReportHistory

#### 4.2.4 Reports Dashboard
- **Route:** `/admin/reports`
- **Purpose:** View and resolve reports
- **Components:** ReportList, ReportDetail, ResolutionForm

---

## 5. UI Components

### 5.1 Layout Components
- `Layout` - Main app layout with header/footer
- `Header` - Navigation bar with logo, search, links
- `Footer` - Footer with links, disclaimer, legal
- `Breadcrumb` - Navigation breadcrumb trail
- `Container` - Page container with max-width

### 5.2 Search & Navigation
- `SearchBar` - Global search input with autocomplete
- `SearchResults` - Search results display
- `Navigation` - Main navigation menu

### 5.3 University/Department/Advisor Components
- `UniversityCard` - University preview card
- `UniversityHeader` - University detail header
- `DepartmentCard` - Department preview card
- `DepartmentHeader` - Department detail header
- `AdvisorCard` - Advisor preview card with rating
- `AdvisorHeader` - Advisor profile header with overall rating

### 5.4 Rating Components
- `StarRating` - Display star rating (1-5)
- `RatingInput` - Star rating input component
- `RatingBreakdown` - Category ratings breakdown (bars/charts)
- `OverallRating` - Large overall rating display

### 5.5 Review Components
- `ReviewCard` - Individual review card
- `ReviewList` - List of reviews with sorting/filtering
- `ReviewForm` - Review submission form
- `ReviewText` - Review text content (with truncation)
- `ReviewTags` - Tag display component
- `ReviewMetadata` - Meeting type, timeframe, verified badge
- `HelpfulButton` - Upvote button with count
- `ReportButton` - Report review button

### 5.6 Form Components
- `TextInput` - Text input field
- `TextArea` - Textarea with character counter
- `Select` - Dropdown select
- `Checkbox` - Checkbox input
- `TagSelector` - Multi-select tag picker
- `FormError` - Error message display
- `SubmitButton` - Form submit button with loading state

### 5.7 Moderation Components
- `ModerationQueue` - Queue list view
- `ModerationCard` - Review card for moderation
- `ModerationActions` - Approve/Reject/Flag buttons
- `ReportCard` - Report display card
- `ContentPreview` - Preview of review content with highlights

### 5.8 Utility Components
- `Pagination` - Page navigation
- `LoadingSpinner` - Loading indicator
- `ErrorMessage` - Error message display
- `EmptyState` - Empty state message
- `Disclaimer` - Disclaimer text component
- `VerifiedBadge` - Verified .edu badge icon

---

## 6. Moderation Flow

### 6.1 Review Submission Flow

```
1. User submits review
   ↓
2. Content filtering (auto-flag check)
   ├─ Profanity detected → status = 'flagged'
   ├─ Contact info detected → status = 'flagged'
   ├─ Medical terms detected → status = 'flagged'
   ├─ Crime keywords detected → status = 'flagged'
   └─ Clean → status = 'pending'
   ↓
3. If email provided:
   ├─ Validate .edu domain
   ├─ Generate verification token
   ├─ Send verification email
   └─ Create ReviewVerification record
   ↓
4. Review saved to database (status: 'pending' or 'flagged')
   ↓
5. If flagged: Admin notification (optional)
   ↓
6. Review appears in moderation queue
```

### 6.2 Auto-Flagging Rules

**Pattern Matching:**
- **Email:** `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`
- **Phone:** `\b\d{3}[-.]?\d{3}[-.]?\d{4}\b` or `\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b`
- **Address:** Keywords like "street", "avenue", "road" + numbers
- **Profanity:** Predefined list of common profanity
- **Medical:** Keywords like "diagnosis", "treatment", "medication", "illness"
- **Crime:** Keywords like "illegal", "criminal", "lawsuit", "arrest", "fraud"

**Action:** Set `status = 'flagged'`, add to moderation queue with priority

### 6.3 Manual Moderation Process

```
1. Admin logs into moderation dashboard
   ↓
2. Views moderation queue
   ├─ Filter by: Pending, Flagged, Reported
   ├─ Sort by: Date, Priority
   └─ See review count badges
   ↓
3. Clicks on review to view details
   ├─ See full review content
   ├─ See auto-flag reasons (if flagged)
   ├─ See reports (if reported)
   └─ See advisor context
   ↓
4. Admin decision:
   ├─ APPROVE:
   │  ├─ Set status = 'approved'
   │  ├─ Update advisor ratings (refresh materialized view)
   │  ├─ Log action with admin ID
   │  └─ Remove from queue
   │
   ├─ REJECT:
   │  ├─ Set status = 'rejected'
   │  ├─ Record rejection reason
   │  ├─ Log action with admin ID
   │  └─ Remove from queue
   │
   └─ EDIT (optional):
      ├─ Admin edits review text (remove violations)
      ├─ Set status = 'approved'
      └─ Log edit action
   ↓
5. If approved: Review appears on advisor profile
```

### 6.4 Report Handling Flow

```
1. User clicks "Report" on review
   ↓
2. Report form submitted
   ├─ Reason selected
   ├─ Optional details provided
   └─ IP address recorded
   ↓
3. Report saved to review_reports table
   ├─ status = 'pending'
   └─ review status unchanged (unless auto-flag)
   ↓
4. Review appears in "Reported" filter in moderation queue
   ↓
5. Admin reviews report
   ├─ Views report reason and details
   ├─ Reviews original review content
   └─ Makes decision
   ↓
6. Admin resolves report:
   ├─ DISMISS: Report marked as dismissed, review stays
   └─ REMOVE: Review status = 'rejected', report marked as resolved
   ↓
7. If multiple reports (>3): Auto-flag review for priority review
```

### 6.5 Bulk Actions (Future Enhancement)

- Select multiple reviews
- Bulk approve/reject
- Bulk assign to moderator
- Export queue for external review

---

## 7. Deployment Plan

### 7.1 Pre-Deployment Checklist

**Code Quality:**
- [ ] All tests passing (unit, integration)
- [ ] Linting and formatting (ESLint, Prettier)
- [ ] Type checking (TypeScript)
- [ ] Code review completed

**Security:**
- [ ] Environment variables configured
- [ ] Database credentials secured
- [ ] API rate limiting configured
- [ ] CORS settings configured
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)

**Database:**
- [ ] Schema migrations ready
- [ ] Seed data prepared (initial universities/departments)
- [ ] Backup strategy defined
- [ ] Indexes created for performance

**Content:**
- [ ] Disclaimer text finalized
- [ ] Terms of Service prepared
- [ ] Privacy Policy prepared
- [ ] Initial tag list defined

### 7.2 Environment Setup

#### 7.2.1 Development
```
- Local PostgreSQL or Docker container
- Next.js dev server
- Environment: .env.local
- Hot reload enabled
```

#### 7.2.2 Staging
```
- Staging database (separate from production)
- Preview deployments (Vercel)
- Environment: .env.staging
- Test moderation workflow
```

#### 7.2.3 Production
```
- Production database (managed service)
- Vercel production deployment
- Environment: .env.production
- CDN enabled
- Monitoring enabled
```

### 7.3 Deployment Steps

#### Phase 1: Infrastructure Setup
1. **Database:**
   - Create PostgreSQL database (Supabase/Railway/AWS RDS)
   - Run migrations to create schema
   - Create indexes
   - Seed initial data (universities, departments, tags)

2. **Hosting:**
   - Set up Vercel project
   - Connect GitHub repository
   - Configure environment variables
   - Set up custom domain (if applicable)

3. **Email Service:**
   - Set up Resend/SendGrid account
   - Configure SMTP settings
   - Create email templates
   - Test email delivery

#### Phase 2: Application Deployment
1. **Build & Deploy:**
   ```bash
   # Vercel auto-deploys on push to main
   git push origin main
   ```

2. **Verify Deployment:**
   - Check build logs
   - Verify environment variables
   - Test public pages
   - Test API endpoints

3. **Database Connection:**
   - Verify database connection
   - Test CRUD operations
   - Verify indexes

#### Phase 3: Initial Content Setup
1. **Seed Data:**
   - Import universities (top 100-200 US universities)
   - Import departments (major departments per university)
   - Create initial tag list
   - Create first admin user

2. **Content Verification:**
   - Verify universities display correctly
   - Verify departments link correctly
   - Test search functionality

#### Phase 4: Admin Setup
1. **Create Admin Accounts:**
   - Create initial admin user via database
   - Test admin login
   - Verify moderation queue access

2. **Test Moderation:**
   - Submit test review
   - Verify auto-flagging works
   - Test approve/reject flow
   - Test report flow

#### Phase 5: Launch
1. **Final Checks:**
   - [ ] All pages load correctly
   - [ ] SEO metadata present
   - [ ] Disclaimer visible
   - [ ] Forms submit correctly
   - [ ] Email verification works
   - [ ] Moderation queue functional

2. **Go Live:**
   - Remove maintenance mode (if any)
   - Announce launch (if applicable)
   - Monitor error logs

### 7.4 Post-Launch Monitoring

**Metrics to Track:**
- Error rates (Sentry)
- Page load times (Vercel Analytics)
- API response times
- Database query performance
- Moderation queue size
- Review submission rate

**Alerts:**
- High error rate (>1%)
- Database connection failures
- Moderation queue backlog (>50 items)
- Unusual traffic spikes

### 7.5 Rollback Plan

**If Issues Detected:**
1. Revert to previous deployment (Vercel rollback)
2. Check database for data corruption
3. Review error logs
4. Fix issues in development
5. Re-deploy after testing

**Database Rollback:**
- Keep migration history
- Create rollback migrations if needed
- Backup before major schema changes

### 7.6 Scaling Considerations

**When to Scale:**
- Database: >10,000 reviews, slow queries
- CDN: High traffic, slow page loads
- Search: >100,000 advisors, slow search

**Scaling Options:**
- Database: Read replicas, connection pooling
- Caching: Redis for frequently accessed data
- Search: Algolia or Elasticsearch for advanced search
- CDN: Vercel Edge Network or Cloudflare

---

## 8. Security Considerations

### 8.1 Input Validation
- All user inputs validated on server-side
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize HTML, use React's built-in escaping)
- Rate limiting on API endpoints (max 100 req/min per IP)

### 8.2 Authentication
- Admin passwords hashed with bcrypt (salt rounds: 12)
- JWT tokens for admin sessions (expire after 24 hours)
- Secure cookie settings (HttpOnly, Secure, SameSite)

### 8.3 Data Protection
- Email addresses hashed before storage (for verification)
- IP addresses stored for rate limiting only
- No PII stored in reviews (anonymous by design)

### 8.4 Content Security
- CSP headers configured
- HTTPS enforced (Vercel default)
- Regular security audits of dependencies

---

## 9. Performance Optimizations

### 9.1 Database
- Indexes on all foreign keys and search fields
- Materialized view for advisor ratings (refresh on review approval)
- Connection pooling (PgBouncer or Prisma connection pool)

### 9.2 Frontend
- Next.js SSR/SSG for SEO
- Image optimization (Next.js Image component)
- Code splitting (dynamic imports)
- Lazy loading for review lists

### 9.3 Caching
- Static pages cached (university/department/advisor pages)
- API responses cached (5-10 minutes for read-heavy endpoints)
- CDN caching for static assets

---

## 10. Testing Strategy

### 10.1 Unit Tests
- Component rendering
- Form validation
- Utility functions
- Rating calculations

### 10.2 Integration Tests
- API endpoints
- Database operations
- Email sending
- Moderation workflows

### 10.3 E2E Tests (Optional for MVP)
- User flows (submit review, browse advisors)
- Admin flows (moderate reviews)

### 10.4 Manual Testing Checklist
- [ ] Browse universities
- [ ] Search functionality
- [ ] Submit review
- [ ] Email verification
- [ ] Upvote review
- [ ] Report review
- [ ] Admin login
- [ ] Moderation queue
- [ ] Approve/reject reviews

---

## 11. Future Enhancements (Post-MVP)

- Advisor claim/verification process
- Advanced search filters
- Review editing (with re-moderation)
- User accounts and review history
- Email notifications
- Public API
- Multi-language support
- Analytics dashboard
- Bulk import for universities/departments


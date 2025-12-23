# Prisma Schema Model Explanations

## Core Models

### User
**Purpose:** Minimal user model for optional accounts. Supports future features like user profiles, review history, and authenticated interactions. Currently used primarily for admin authentication via NextAuth.

**Why:** Enables optional user accounts without requiring login for browsing/reviewing. Anonymous reviews use `userId = null`.

---

### University
**Purpose:** Top-level entity representing educational institutions (e.g., "MIT", "Stanford University"). Acts as the root of the hierarchy: University → Department → Advisor.

**Why:** Core navigation structure. Users browse by university first, then drill down to departments and advisors. Slug enables SEO-friendly URLs.

---

### Department
**Purpose:** Academic departments/colleges within a university (e.g., "Computer Science", "Engineering"). Belongs to one university.

**Why:** Organizes advisors by academic discipline. Many universities have multiple departments, each with different advisors. Unique slug per university prevents conflicts.

---

### Advisor
**Purpose:** Individual academic advisors within a department. The primary entity being reviewed.

**Why:** Core entity of the application. Students review advisors, not departments or universities. `isActive` soft delete preserves review history if advisor leaves.

---

## Review System

### Review
**Purpose:** User-submitted reviews of advisors. Supports both anonymous (`userId = null`) and verified (via email verification) reviews.

**Why:** Central content entity. Status field (`pending`/`approved`/`rejected`/`flagged`) enables moderation workflow. `helpfulCount` cached for performance (updated via triggers or app logic).

---

### ReviewRating
**Purpose:** Stores the 6 category ratings (Accuracy, Responsiveness, Helpfulness, Availability, Advocacy, Clarity) as separate records per review.

**Why:** Normalized structure allows easy aggregation (calculate averages per category). Unique constraint ensures one rating per category per review.

---

### Tag
**Purpose:** Predefined tags for reviews (e.g., "responsive", "knowledgeable", "hard to reach"). Users select from list.

**Why:** Enables filtering and quick scanning of review characteristics. Prevents tag spam and maintains consistency.

---

### ReviewTag
**Purpose:** Junction table linking reviews to tags (many-to-many relationship).

**Why:** A review can have multiple tags, and tags can appear on multiple reviews. Junction table is standard pattern for many-to-many.

---

## Interaction Models

### ReviewVote
**Purpose:** Tracks "helpful" upvotes on reviews. Prevents duplicate votes via unique constraints on `(reviewId, userId)` for logged-in users and `(reviewId, ipAddress)` for anonymous users.

**Why:** Prevents vote manipulation. Dual unique constraints handle both authenticated and anonymous voting. IP-based tracking for anonymous users (consider hashing IPs for privacy).

---

### ReviewReport
**Purpose:** User reports on reviews that violate guidelines. Tracks reason, status, and resolution.

**Why:** Enables community-driven moderation. Reports feed into admin moderation queue. Status tracking prevents duplicate processing.

---

## Moderation & Verification

### EmailVerification
**Purpose:** Stores .edu email verification requests. Links verification token to review for optional verified badge.

**Why:** Enables optional verification without requiring full user accounts. Token-based flow via email link. Expires after 7 days for security.

---

### AdminAction
**Purpose:** Audit trail of all moderation actions (approve, reject, flag, edit). Tracks who did what and when.

**Why:** Accountability and transparency. Enables review of moderation decisions. Useful for debugging and compliance.

---

## Authentication (NextAuth.js)

### Account, Session, VerificationToken
**Purpose:** Required by NextAuth.js v5 for authentication. Handles OAuth providers, sessions, and email verification tokens.

**Why:** NextAuth.js requires these tables for its authentication system. Used for admin login only in MVP.

---

## Design Decisions

1. **Soft Deletes:** `isActive` on Advisor instead of hard deletes to preserve review history
2. **Status Field:** `status` on Review for moderation workflow (pending → approved/rejected)
3. **Cached Counts:** `helpfulCount` on Review to avoid counting votes on every query
4. **Slugs:** URL-friendly identifiers for SEO (e.g., `/universities/mit/departments/cs/advisors/john-smith`)
5. **Indexes:** Strategic indexes on search fields (name, slug) and foreign keys for performance
6. **Cascade Deletes:** Deleting university/department/advisor cascades to reviews to maintain data integrity
7. **Optional User:** Reviews can exist without User (anonymous), but User can have multiple reviews


# Product Requirements Document: Rate My Advisor

## 1. Overview

**Product Name:** Rate My Advisor  
**Version:** MVP (v1.0)  
**Last Updated:** 2024

### 1.1 Product Vision
A web platform where students can discover, review, and rate academic advisors to help other students make informed decisions about their advising relationships.

### 1.2 Target Users
- **Primary:** Current and former students seeking advisor reviews
- **Secondary:** Students writing reviews about their advisors
- **Tertiary:** Administrators moderating content

### 1.3 Core Value Proposition
- Help students find advisors who match their needs
- Provide transparency in advisor-student relationships
- Enable data-driven advisor selection

---

## 2. User Stories

### 2.1 Discovery & Browsing

**US-1: Browse Universities**
- **As a** student
- **I want to** browse a list of universities
- **So that** I can find my institution or explore other schools

**US-2: Search Universities**
- **As a** student
- **I want to** search for universities by name
- **So that** I can quickly find my school

**US-3: Browse Departments**
- **As a** student
- **I want to** see departments/colleges within a university
- **So that** I can narrow down to my area of study

**US-4: Browse Advisors**
- **As a** student
- **I want to** see a list of advisors in a department
- **So that** I can explore available advisors

**US-5: Search Advisors**
- **As a** student
- **I want to** search for advisors by name within a department/university
- **So that** I can find a specific advisor

### 2.2 Advisor Profile & Reviews

**US-6: View Advisor Profile**
- **As a** student
- **I want to** view an advisor's profile with ratings and reviews
- **So that** I can evaluate if they're a good fit

**US-7: View Overall Rating**
- **As a** student
- **I want to** see an overall rating (average of all categories)
- **So that** I can quickly assess advisor quality

**US-8: View Category Breakdown**
- **As a** student
- **I want to** see ratings for Accuracy, Responsiveness, Helpfulness, Availability, Advocacy, and Clarity
- **So that** I can understand strengths and weaknesses

**US-9: Read Reviews**
- **As a** student
- **I want to** read detailed reviews from other students
- **So that** I can learn about specific experiences

**US-10: Sort/Filter Reviews**
- **As a** student
- **I want to** sort reviews by date, helpfulness, or rating
- **So that** I can find the most relevant information

### 2.3 Review Submission

**US-11: Submit Review**
- **As a** student
- **I want to** submit a review for an advisor
- **So that** I can share my experience with others

**US-12: Rate Categories**
- **As a** student
- **I want to** provide star ratings (1-5) for each category
- **So that** I can provide structured feedback

**US-13: Add Tags**
- **As a** student
- **I want to** add tags to my review (e.g., "responsive", "knowledgeable", "hard to reach")
- **So that** I can highlight key characteristics

**US-14: Write Free Text**
- **As a** student
- **I want to** write a detailed text review
- **So that** I can provide context and specific examples

**US-15: Specify Meeting Type**
- **As a** student
- **I want to** indicate if the review is based on in-person, virtual, or email interactions
- **So that** others understand the context

**US-16: Specify Timeframe**
- **As a** student
- **I want to** indicate when I worked with this advisor (e.g., "2023-2024")
- **So that** reviews reflect current vs. historical experiences

**US-17: Verify with .edu Email**
- **As a** student
- **I want to** optionally verify my review with a .edu email
- **So that** my review shows a verified badge

**US-18: Anonymous Display**
- **As a** student
- **I want to** submit reviews anonymously
- **So that** I can share honest feedback without fear of retaliation

### 2.4 Review Interaction

**US-19: Upvote Helpful Reviews**
- **As a** student
- **I want to** upvote reviews I find helpful
- **So that** the most useful reviews surface to the top

**US-20: Report Review**
- **As a** student
- **I want to** report reviews that violate guidelines
- **So that** inappropriate content can be removed

### 2.5 Moderation

**US-21: View Moderation Queue**
- **As an** administrator
- **I want to** see a queue of reported reviews and new submissions
- **So that** I can review content for policy violations

**US-22: Approve/Reject Reviews**
- **As an** administrator
- **I want to** approve or reject reviews with notes
- **So that** only appropriate content is published

**US-23: Auto-Flag Content**
- **As the** system
- **I want to** automatically flag reviews containing profanity or suspicious patterns
- **So that** administrators can prioritize problematic content

### 2.6 SEO & Public Access

**US-24: Public Advisor Pages**
- **As a** search engine or user
- **I want to** access advisor profile pages via direct URL
- **So that** pages are indexable and shareable

**US-25: Public University Pages**
- **As a** search engine or user
- **I want to** access university listing pages via direct URL
- **So that** pages are indexable and shareable

---

## 3. Acceptance Criteria

### 3.1 Discovery Features

**AC-1: University Browsing**
- [ ] Universities displayed in alphabetical order
- [ ] Pagination for 50+ universities (20 per page)
- [ ] University name and location visible
- [ ] Clickable to view departments

**AC-2: Search Functionality**
- [ ] Search works for partial matches (e.g., "MIT" finds "Massachusetts Institute of Technology")
- [ ] Search results ranked by relevance
- [ ] Search works across universities, departments, and advisors
- [ ] Empty state shown when no results found

**AC-3: Department Listing**
- [ ] Departments listed alphabetically
- [ ] Department name and advisor count visible
- [ ] Clickable to view advisors

**AC-4: Advisor Listing**
- [ ] Advisors listed alphabetically by last name
- [ ] Advisor name, overall rating, and review count visible
- [ ] Clickable to view full profile

### 3.2 Advisor Profile

**AC-5: Overall Rating Display**
- [ ] Overall rating calculated as average of all 6 category ratings
- [ ] Displayed as stars (1-5) and numeric (e.g., "4.2/5.0")
- [ ] Total review count displayed
- [ ] Rating updates in real-time when new reviews are approved

**AC-6: Category Breakdown**
- [ ] All 6 categories displayed: Accuracy, Responsiveness, Helpfulness, Availability, Advocacy, Clarity
- [ ] Each category shows average rating and count
- [ ] Visual representation (stars or bars) for each category

**AC-7: Review Display**
- [ ] Reviews displayed in reverse chronological order by default
- [ ] Each review shows: ratings, tags, text, meeting type, timeframe, helpful count
- [ ] Verified badge shown if reviewer verified with .edu email
- [ ] "Report" button on each review

**AC-8: Review Sorting**
- [ ] Sort by: Most Recent, Most Helpful, Highest Rated, Lowest Rated
- [ ] Sort option persists during session

### 3.3 Review Submission

**AC-9: Review Form**
- [ ] All 6 category ratings required (1-5 stars each)
- [ ] Free text field required (min 50 chars, max 2000 chars)
- [ ] Tags optional (multi-select from predefined list, max 5)
- [ ] Meeting type required (dropdown: In-Person, Virtual, Email, Mixed)
- [ ] Timeframe required (dropdown: Last 6 months, 6-12 months ago, 1-2 years ago, 2+ years ago)
- [ ] Optional .edu email field for verification
- [ ] Clear disclaimer about review guidelines visible

**AC-10: Review Validation**
- [ ] Form validates all required fields before submission
- [ ] Text length validation (50-2000 chars)
- [ ] Email validation for .edu domain if provided
- [ ] Error messages displayed for invalid inputs

**AC-11: Review Submission Flow**
- [ ] Submit button creates review in "pending" status
- [ ] Success message displayed after submission
- [ ] If .edu email provided, verification email sent
- [ ] Review appears in moderation queue
- [ ] User can see their pending review status

**AC-12: Email Verification**
- [ ] Verification email sent to .edu address
- [ ] Email contains unique verification link
- [ ] Link expires after 7 days
- [ ] Verified badge applied to review after verification
- [ ] Review remains anonymous (no email displayed)

### 3.4 Review Interaction

**AC-13: Upvote Functionality**
- [ ] "Helpful" button on each review
- [ ] Click increments helpful count
- [ ] User can only upvote once per review (tracked by session/IP)
- [ ] Helpful count visible on review

**AC-14: Report Functionality**
- [ ] "Report" button on each review
- [ ] Report form with reason dropdown (Doxxing, Hate Speech, Off-Topic, Spam, Other)
- [ ] Optional text field for additional details
- [ ] Report submitted to moderation queue
- [ ] Confirmation message displayed

### 3.5 Moderation

**AC-15: Moderation Queue**
- [ ] Queue shows: pending reviews, reported reviews, auto-flagged reviews
- [ ] Each item shows: review content, advisor, submission date, flags
- [ ] Filters: All, Pending, Reported, Auto-Flagged
- [ ] Sort by: Date, Priority

**AC-16: Review Actions**
- [ ] Approve: Review published immediately
- [ ] Reject: Review marked as rejected with reason
- [ ] Edit: Admin can edit review content before approval
- [ ] Actions logged with admin ID and timestamp

**AC-17: Auto-Flagging**
- [ ] Reviews with profanity automatically flagged
- [ ] Reviews with personal contact info (email/phone) automatically flagged
- [ ] Reviews with medical details automatically flagged
- [ ] Reviews with crime accusations automatically flagged
- [ ] Flagged reviews require manual review

### 3.6 Safety & Content Guidelines

**AC-18: Content Filtering**
- [ ] Profanity filter blocks common profanity
- [ ] Pattern matching for email addresses and phone numbers
- [ ] Pattern matching for addresses
- [ ] Medical terminology detection (basic keywords)
- [ ] Crime-related keyword detection

**AC-19: Disclaimer Display**
- [ ] Disclaimer visible on review submission form
- [ ] Disclaimer visible on advisor profile pages
- [ ] Disclaimer includes: review guidelines, defamation warning, off-topic policy

**AC-20: Review Guidelines Enforcement**
- [ ] Reviews must be about advising service only
- [ ] No personal attacks or harassment
- [ ] No doxxing (contact info removed)
- [ ] No medical details
- [ ] No crime accusations
- [ ] No hate speech

### 3.7 SEO & Public Pages

**AC-21: Public URLs**
- [ ] University pages: `/university/{slug}`
- [ ] Department pages: `/university/{slug}/department/{slug}`
- [ ] Advisor pages: `/university/{slug}/department/{slug}/advisor/{slug}`
- [ ] All pages accessible without authentication

**AC-22: SEO Metadata**
- [ ] Each page has unique `<title>` tag
- [ ] Each page has unique `<meta description>`
- [ ] Open Graph tags for social sharing
- [ ] Structured data (JSON-LD) for advisor profiles

---

## 4. Edge Cases & Error Handling

### 4.1 Data Edge Cases

**EC-1: Advisor with No Reviews**
- Display "No reviews yet" message
- Show "Be the first to review" CTA
- Overall rating shows as "N/A" or "—"

**EC-2: Advisor with Single Review**
- Overall rating equals that review's average
- Category breakdown shows single review's ratings

**EC-3: Deleted/Inactive Advisor**
- Advisor marked as inactive in database
- Profile page shows "This advisor is no longer active"
- Reviews remain visible but marked as historical

**EC-4: Duplicate Advisor Names**
- Use unique slug/ID for each advisor
- Display department/university context to disambiguate
- Allow users to report duplicates for merge

**EC-5: University/Department Not Found**
- 404 page with helpful message
- Suggest similar universities/departments if available
- Search functionality accessible from 404

### 4.2 User Input Edge Cases

**EC-6: Invalid Email Verification**
- Non-.edu emails rejected with clear error
- Expired verification links show error message
- Already-verified reviews show confirmation

**EC-7: Review Spam/Abuse**
- Rate limiting: max 3 reviews per IP per day
- Duplicate content detection (similarity check)
- Account/IP blocking for repeated violations

**EC-8: Very Long Review Text**
- Character counter visible (e.g., "1,234/2,000")
- Text truncated in preview, expandable to full
- Line breaks preserved in display

**EC-9: Special Characters in Names**
- Unicode support for international names
- Proper URL encoding for slugs
- Display handles accented characters correctly

### 4.3 System Edge Cases

**EC-10: Concurrent Review Submissions**
- Database transactions prevent race conditions
- Rating calculations use atomic updates
- Cache invalidation on review approval

**EC-11: Moderation Queue Overflow**
- Pagination for large queues
- Priority sorting (reported > auto-flagged > pending)
- Bulk actions for similar reviews

**EC-12: Search Performance**
- Search results limited to 100 items
- Pagination for large result sets
- Loading states during search

**EC-13: Network Failures**
- Graceful error messages for API failures
- Retry logic for transient failures
- Offline detection and messaging

**EC-14: Browser Compatibility**
- Support for modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Mobile-responsive design

### 4.4 Content Moderation Edge Cases

**EC-15: False Positives in Auto-Flagging**
- Admin can override auto-flags
- Pattern matching tuned to reduce false positives
- Manual review for borderline cases

**EC-16: Disputed Reviews**
- Reviewers cannot edit after submission
- Advisors cannot delete reviews (only report)
- Appeals process via support contact

**EC-17: Mass Reporting**
- Detect coordinated reporting attacks
- Rate limit reporting (max 5 reports per IP per day)
- Admin notification for unusual patterns

---

## 5. Safety & Defamation Constraints

### 5.1 Content Restrictions

**CR-1: No Doxxing**
- Personal emails, phone numbers, addresses must be removed
- Pattern matching to detect and flag contact information
- Manual review for any flagged personal information

**CR-2: No Crime Accusations**
- Reviews cannot contain accusations of illegal activity
- Auto-flag keywords: "illegal", "criminal", "lawsuit", "arrest", etc.
- Such content automatically rejected

**CR-3: No Medical Details**
- Reviews cannot contain medical information about advisor or students
- Auto-flag medical terminology
- Focus on advising service only

**CR-4: No Hate Speech**
- Profanity filter blocks common offensive language
- Hate speech detection for slurs and discriminatory language
- Zero tolerance policy

**CR-5: Advising Service Only**
- Reviews must focus on advisor's performance in their role
- Off-topic content (personal life, appearance, etc.) rejected
- Clear guidelines in disclaimer

### 5.2 Disclaimer Text

**Standard Disclaimer (to appear on all pages):**

> **Review Guidelines & Disclaimer**
> 
> Reviews on Rate My Advisor are user-generated and reflect individual experiences. We encourage honest, constructive feedback about advisors' professional performance.
> 
> **What's Allowed:**
> - Feedback about advisor's accuracy, responsiveness, helpfulness, availability, advocacy, and clarity
> - Specific examples of positive or negative interactions
> - Recommendations or warnings based on your experience
> 
> **What's Not Allowed:**
> - Personal contact information (emails, phone numbers, addresses)
> - Accusations of crimes or illegal activity
> - Medical information or health details
> - Hate speech, profanity, or discriminatory language
> - Content unrelated to advising services
> 
> Reviews are moderated for compliance. We reserve the right to remove reviews that violate these guidelines. Rate My Advisor is not responsible for the accuracy of user-submitted content. Reviews are opinions and should not be considered factual statements.

### 5.3 Legal Considerations

- Reviews are opinions, not facts
- Platform provides moderation but does not guarantee accuracy
- Users agree to terms of service before submitting reviews
- Clear reporting mechanism for defamation concerns
- DMCA and content removal requests handled via support

---

## 6. Success Metrics (Post-MVP)

*Note: Not required for MVP, but included for future planning*

- Number of universities, departments, advisors in database
- Monthly active users
- Reviews submitted per month
- Average reviews per advisor
- Moderation queue size and resolution time
- Search success rate
- Page load times
- SEO ranking for target keywords

---

## 7. Out of Scope (Non-Goals)

- **Messaging:** No direct communication between users
- **Payments:** No paid features or subscriptions
- **Complex Analytics:** Basic metrics only, no advanced dashboards
- **User Accounts:** No login required for browsing; optional for verification
- **Advisor Responses:** Advisors cannot respond to reviews
- **Notifications:** No email/SMS notifications (except verification)
- **Mobile Apps:** Web-only for MVP
- **Social Features:** No following, sharing to social media (basic sharing via URL)

---

## 8. Future Considerations (Post-MVP)

- Advisor claim/verification process
- Advanced search filters (rating ranges, tags, timeframe)
- Review editing (with moderation)
- User accounts and review history
- Email notifications for new reviews
- API for third-party integrations
- Multi-language support


# Launch Readiness Checklist

Complete checklist to ensure Rate My Advisor is ready for public launch.

---

## Part 1: Functional QA Scenarios

### Core User Flows

#### Discovery & Browsing
- [ ] **Homepage loads** - Verify page loads without errors
- [ ] **University search** - Search for "MIT", "Stanford", verify results
- [ ] **University page** - Click university, verify departments list
- [ ] **Department page** - Click department, verify advisors list
- [ ] **Advisor profile** - Click advisor, verify ratings and reviews display
- [ ] **Empty states** - Test with advisor with no reviews
- [ ] **Pagination** - Test with 50+ universities/departments/advisors

#### Review Submission
- [ ] **Write review button** - Click from advisor page, form loads
- [ ] **Form validation** - Submit empty form, verify errors
- [ ] **Star ratings** - Rate all 6 categories, verify values saved
- [ ] **Tag selection** - Select 1-5 tags, verify saved
- [ ] **Text validation** - Test min 50 chars, max 2000 chars
- [ ] **Content warnings** - Type email/phone, verify warning appears
- [ ] **Submit review** - Complete form, verify success page
- [ ] **Anonymous submission** - Submit without login, verify works
- [ ] **Verified badge** - Submit with verified .edu email, verify badge

#### Review Interaction
- [ ] **Upvote helpful** - Click helpful, verify count increments
- [ ] **Duplicate upvote** - Try to upvote twice, verify blocked
- [ ] **Report review** - Click report, fill form, verify submitted
- [ ] **Sort reviews** - Test all sort options (newest, helpful, highest, lowest)
- [ ] **Review display** - Verify ratings, tags, verified badge show correctly

#### Authentication
- [ ] **Sign in** - Enter email, receive magic link
- [ ] **Magic link** - Click link, verify sign-in successful
- [ ] **Sign out** - Click sign out, verify logged out
- [ ] **Session persistence** - Refresh page, verify still logged in
- [ ] **.edu verification** - Request code, enter code, verify badge

#### Admin Moderation
- [ ] **Admin login** - Sign in as admin, verify access
- [ ] **Moderation queue** - View pending reviews
- [ ] **Approve review** - Approve review, verify appears on advisor page
- [ ] **Reject review** - Reject with reason, verify logged
- [ ] **Reports tab** - View reported reviews
- [ ] **Resolve reports** - Keep/remove review, verify action

### Edge Cases

- [ ] **No reviews** - Advisor with 0 reviews, verify empty state
- [ ] **Single review** - Advisor with 1 review, verify ratings calculate
- [ ] **Many reviews** - Advisor with 100+ reviews, verify pagination
- [ ] **Special characters** - Names with accents, verify display
- [ ] **Long text** - Review with 2000 chars, verify truncation
- [ ] **Network error** - Disconnect network, verify error handling
- [ ] **Invalid IDs** - Visit `/a/invalid-id`, verify 404
- [ ] **Rate limit** - Submit 4 reviews quickly, verify blocked

### Performance

- [ ] **Page load time** - Homepage loads < 2 seconds
- [ ] **API response** - API endpoints respond < 500ms
- [ ] **Database queries** - No N+1 queries
- [ ] **Image optimization** - Images load optimized
- [ ] **Mobile responsive** - Test on mobile device
- [ ] **Browser compatibility** - Test Chrome, Firefox, Safari, Edge

---

## Part 2: Security Checks

### Authentication & Authorization
- [ ] **Admin routes protected** - Non-admin cannot access `/admin/*`
- [ ] **API routes protected** - `/api/mod/*` requires admin
- [ ] **Session security** - Sessions expire correctly
- [ ] **Password hashing** - Admin passwords hashed (bcrypt)
- [ ] **JWT tokens** - Tokens expire after 24 hours

### Input Validation
- [ ] **SQL injection** - Test with SQL in inputs, verify blocked
- [ ] **XSS attacks** - Test with `<script>` tags, verify escaped
- [ ] **CSRF protection** - NextAuth handles CSRF
- [ ] **Rate limiting** - Test rate limits on all endpoints
- [ ] **File upload** - No file upload endpoints (N/A)

### Data Protection
- [ ] **PII removal** - Emails/phones removed from reviews
- [ ] **Email hashing** - .edu emails hashed before storage
- [ ] **IP addresses** - Only used for rate limiting
- [ ] **Error messages** - No sensitive data in error messages
- [ ] **Environment variables** - No secrets in code

### Infrastructure
- [ ] **HTTPS enforced** - All traffic over HTTPS
- [ ] **Security headers** - X-Frame-Options, X-Content-Type-Options set
- [ ] **CORS configured** - Only allowed origins
- [ ] **Database access** - Connection string secure
- [ ] **Backup encryption** - Backups encrypted (if applicable)

### Content Security
- [ ] **Spam detection** - Spam reviews blocked
- [ ] **Threat detection** - Threats auto-rejected
- [ ] **Profanity filter** - Profanity flagged
- [ ] **Contact info removal** - Emails/phones removed
- [ ] **CAPTCHA working** - Bot submissions blocked (if enabled)

---

## Part 3: Moderation Policy Document

See `MODERATION_POLICY.md` (created below)

---

## Part 4: Content Policy (Footer Text)

See footer content policy text (created below)

---

## Part 5: Legal Pages

- [ ] **Privacy Policy** - See `PRIVACY_POLICY.md` outline
- [ ] **Terms of Service** - See `TERMS_OF_SERVICE.md` outline
- [ ] **DMCA Policy** - See `DMCA_POLICY.md` outline

---

## Part 6: Versioning & Roadmap

- [ ] **Version number** - Set in `package.json`
- [ ] **Changelog** - Document v1.0.0 features
- [ ] **Roadmap** - See `ROADMAP.md` for Phase 2 features

---

## Pre-Launch Final Checks

### Technical
- [ ] All tests passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build succeeds
- [ ] Database migrations complete
- [ ] Environment variables set

### Content
- [ ] Disclaimer text on all pages
- [ ] Content policy in footer
- [ ] Legal pages created
- [ ] Moderation policy documented

### Business
- [ ] First admin user created
- [ ] Support email configured
- [ ] Backup strategy in place
- [ ] Monitoring configured

### Launch
- [ ] Domain configured
- [ ] SSL certificate active
- [ ] Analytics tracking
- [ ] Error tracking active

---

## Launch Day Checklist

- [ ] Final QA pass completed
- [ ] All security checks passed
- [ ] Legal pages published
- [ ] Support channels ready
- [ ] Monitoring alerts configured
- [ ] Backup verified
- [ ] Team briefed on moderation
- [ ] **GO LIVE** 🚀

---

## Post-Launch Monitoring (First 48 Hours)

- [ ] Monitor error logs hourly
- [ ] Check moderation queue every 4 hours
- [ ] Review user submissions
- [ ] Monitor database performance
- [ ] Check rate limit hits
- [ ] Review analytics
- [ ] Address any critical issues immediately


# Abuse Prevention Implementation

## Overview

This document describes the abuse prevention measures implemented in Rate My Advisor, including tradeoffs and configuration options.

## Features Implemented

### 1. Enhanced Rate Limiting

**Implementation:**
- Dual-layer rate limiting: IP-based + fingerprint-based
- Fingerprinting uses: IP + User-Agent + Accept-Language
- Per-endpoint limits with configurable windows

**Limits:**
- Review submissions: 3 per IP, 5 per fingerprint per 24 hours
- Reports: 5 per IP, 10 per fingerprint per 24 hours

**Tradeoffs:**
- ✅ **Pros:** Catches VPN/proxy users, harder to bypass
- ⚠️ **Cons:** In-memory storage (lost on restart), not distributed
- 🔄 **Production:** Use Redis for distributed rate limiting

**Code:** `src/lib/rate-limit.ts`, `src/lib/abuse-prevention.ts`

---

### 2. Spam Detection Heuristics

**Heuristics Implemented:**

1. **Repeated Text Detection**
   - Detects when >50% of text is repeated
   - Catches copy-paste spam

2. **Link Count**
   - Maximum 3 links per review
   - Prevents promotional spam

3. **Profanity Score**
   - Calculates ratio of profanity words
   - Threshold: 30% profanity = spam

4. **Spam Patterns**
   - Repeated characters (e.g., "aaaaaaaaaa")
   - ALL CAPS spam
   - Long number sequences

5. **Unique Word Count**
   - Minimum 10 unique words required
   - Prevents low-effort reviews

6. **Threat Detection**
   - Auto-rejects reviews with threats
   - Blocks explicit violence keywords

**Spam Score Calculation:**
- Score 0-1 (higher = more likely spam)
- Auto-reject if score ≥ 0.5 OR threats detected

**Tradeoffs:**
- ✅ **Pros:** Catches common spam patterns, fast
- ⚠️ **Cons:** May have false positives, needs tuning
- 🔄 **Production:** Use ML-based spam detection (e.g., Google Perspective API)

**Code:** `src/lib/abuse-prevention.ts`

---

### 3. Server-Side Text Sanitization

**Sanitization Rules:**

1. **Email Removal**
   - Pattern: `/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi`
   - Replaced with: `[email removed]`

2. **Phone Number Removal**
   - Pattern: `/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/gi`
   - Replaced with: `[phone removed]`

3. **URL Handling** (Two Options)

   **Option A: Remove All URLs (Default - Safer)**
   - Removes all URLs
   - Prevents link spam and phishing
   - **Tradeoff:** Removes legitimate references

   **Option B: Whitelist Safe URLs**
   - Allows only `.edu` domains
   - More permissive but requires maintenance
   - **Tradeoff:** Need to maintain whitelist

4. **Threat Removal**
   - Removes explicit threats
   - Replaced with: `[threat removed]`

**Tradeoffs:**
- ✅ **Pros:** Prevents doxxing, removes threats
- ⚠️ **Cons:** May remove legitimate content
- 🔄 **Production:** Use ML-based content moderation

**Code:** `src/lib/sanitize.ts`

---

### 4. CAPTCHA Integration

**Implementation:**
- Supports both hCaptcha and reCAPTCHA
- Client-side widget + server-side verification
- Optional (can be enabled via env var)

**hCaptcha vs reCAPTCHA:**

| Feature | hCaptcha | reCAPTCHA |
|---------|----------|-----------|
| Privacy | ✅ Better (privacy-focused) | ⚠️ Google tracking |
| Performance | ✅ Lighter | ⚠️ Heavier |
| Bot Detection | ✅ Good | ✅ Excellent |
| Cost | ✅ Free | ✅ Free |
| User Experience | ✅ Simple | ⚠️ Can be annoying |
| **Recommendation** | ✅ **Use for MVP** | Use if better detection needed |

**Configuration:**
```env
ENABLE_CAPTCHA=true
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-site-key
HCAPTCHA_SECRET_KEY=your-secret-key
NEXT_PUBLIC_CAPTCHA_PROVIDER=hcaptcha
```

**Tradeoffs:**
- ✅ **Pros:** Blocks bots effectively, industry standard
- ⚠️ **Cons:** Adds friction for users, requires API keys
- 🔄 **Production:** Enable for high-risk actions only

**Code:** `src/lib/captcha.ts`, `src/components/ui/Captcha.tsx`

---

## Implementation Details

### Rate Limiting

**Current:** In-memory (lost on restart)
**Production:** Redis-based (distributed, persistent)

```typescript
// Current implementation
const fingerprint = generateFingerprint(request);
checkRateLimit(fingerprint, { maxRequests: 3, windowMs: 24*60*60*1000 });

// Production recommendation
import { Ratelimit } from "@upstash/ratelimit";
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "24 h"),
});
```

### Spam Detection

**Current:** Rule-based heuristics
**Production:** ML-based (Google Perspective API, AWS Comprehend)

```typescript
// Current
const spamDetection = detectSpam(text);
if (spamDetection.isSpam) {
  return errorResponse("Review rejected: spam detected");
}

// Production option
const perspectiveScore = await checkPerspectiveAPI(text);
if (perspectiveScore.toxicity > 0.7) {
  return errorResponse("Review rejected: inappropriate content");
}
```

### Text Sanitization

**Current:** Pattern-based removal
**Production:** Enhanced with ML + manual review queue

**URL Handling Decision:**
- **Chosen:** Remove all URLs (safer, simpler)
- **Alternative:** Whitelist `.edu` domains only
- **Tradeoff:** Legitimate references removed vs. link spam risk

---

## Configuration

### Environment Variables

```env
# Rate Limiting (optional - uses in-memory by default)
REDIS_URL=redis://... # For production

# CAPTCHA (optional)
ENABLE_CAPTCHA=true
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-site-key
HCAPTCHA_SECRET_KEY=your-secret-key
NEXT_PUBLIC_CAPTCHA_PROVIDER=hcaptcha

# Or reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
NEXT_PUBLIC_CAPTCHA_PROVIDER=recaptcha
```

### Spam Thresholds (Configurable)

Edit `src/lib/abuse-prevention.ts`:

```typescript
const SPAM_THRESHOLDS = {
  MAX_LINKS: 3,                    // Adjust as needed
  REPEATED_TEXT_THRESHOLD: 0.5,    // 50% repetition
  MIN_UNIQUE_WORDS: 10,            // Minimum words
  PROFANITY_SCORE_THRESHOLD: 0.3,  // 30% profanity
};
```

---

## Security Layers

1. **Rate Limiting** → Prevents volume-based attacks
2. **Spam Detection** → Catches automated/spam content
3. **Text Sanitization** → Removes PII and threats
4. **CAPTCHA** → Blocks bots
5. **Moderation Queue** → Manual review for flagged content

---

## Production Recommendations

### Immediate (MVP)
- ✅ Current implementation is sufficient
- ✅ Enable CAPTCHA for production
- ⚠️ Monitor false positive rates

### Short-term
- 🔄 Move rate limiting to Redis
- 🔄 Expand profanity word list
- 🔄 Add more spam patterns

### Long-term
- 🔄 ML-based spam detection (Perspective API)
- 🔄 Behavioral analysis (typing patterns, etc.)
- 🔄 Reputation scoring for users
- 🔄 Automated moderation with confidence scores

---

## Testing

Test spam detection:
```bash
# Repeated text
curl -X POST /api/advisors/[id]/reviews \
  -d '{"text": "great great great great great great..."}'

# Too many links
curl -X POST /api/advisors/[id]/reviews \
  -d '{"text": "Check out https://spam.com and https://spam2.com..."}'

# Threats
curl -X POST /api/advisors/[id]/reviews \
  -d '{"text": "I will harm this advisor..."}'
```

All should be rejected with appropriate error messages.

---

## Tradeoff Summary

| Feature | Current Approach | Tradeoff | Production Option |
|---------|-----------------|----------|-------------------|
| Rate Limiting | In-memory | Lost on restart | Redis |
| Spam Detection | Rule-based | May have false positives | ML-based |
| URL Handling | Remove all | Removes legitimate refs | Whitelist |
| CAPTCHA | Optional | Adds friction | Enable for high-risk |
| Profanity | Basic list | May miss some | Comprehensive library |

---

## Files Modified/Created

1. `src/lib/abuse-prevention.ts` - Spam detection heuristics
2. `src/lib/sanitize.ts` - Enhanced text sanitization
3. `src/lib/captcha.ts` - CAPTCHA verification
4. `src/components/ui/Captcha.tsx` - CAPTCHA widget
5. `src/app/api/advisors/[id]/reviews/route.ts` - Enhanced with all checks
6. `src/app/api/reviews/[id]/report/route.ts` - Enhanced rate limiting

All abuse prevention measures are now active and protecting the application.


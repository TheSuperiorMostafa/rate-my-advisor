# Abuse Prevention - Implementation Summary

## ✅ Files Created/Modified

### New Files
1. **`src/lib/abuse-prevention.ts`** - Spam detection heuristics
2. **`src/lib/captcha.ts`** - CAPTCHA verification (hCaptcha/reCAPTCHA)
3. **`src/components/ui/Captcha.tsx`** - CAPTCHA widget component
4. **`ABUSE_PREVENTION.md`** - Detailed documentation

### Modified Files
1. **`src/lib/sanitize.ts`** - Enhanced with threat removal, URL options
2. **`src/lib/rate-limit.ts`** - Added `rateLimitResponse` helper
3. **`src/lib/validation.ts`** - Added `captchaToken` to review schema
4. **`src/app/api/advisors/[id]/reviews/route.ts`** - Enhanced with all abuse checks
5. **`src/app/api/reviews/[id]/report/route.ts`** - Enhanced rate limiting
6. **`src/components/review/ReviewForm.tsx`** - Added CAPTCHA widget

## ✅ Features Implemented

### 1. Enhanced Rate Limiting
- **Dual-layer:** IP + fingerprint-based
- **Fingerprinting:** IP + User-Agent + Accept-Language hash
- **Review submissions:** 3/IP, 5/fingerprint per 24h
- **Reports:** 5/IP, 10/fingerprint per 24h

### 2. Spam Detection Heuristics
- ✅ Repeated text detection (>50% repetition)
- ✅ Link count limit (max 3 links)
- ✅ Profanity score (30% threshold)
- ✅ Spam patterns (repeated chars, ALL CAPS, long numbers)
- ✅ Unique word count (min 10 words)
- ✅ Threat detection (auto-reject)

### 3. Server-Side Text Sanitization
- ✅ Email removal (pattern-based)
- ✅ Phone number removal (pattern-based)
- ✅ URL handling: **Remove all URLs** (safer default)
- ✅ Threat removal (explicit violence keywords)

### 4. CAPTCHA Integration
- ✅ hCaptcha support (recommended - privacy-friendly)
- ✅ reCAPTCHA support (alternative)
- ✅ Optional (enable via env var)
- ✅ Client widget + server verification

## Configuration

### Environment Variables

```env
# CAPTCHA (Optional)
ENABLE_CAPTCHA=true
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your-site-key
HCAPTCHA_SECRET_KEY=your-secret-key
NEXT_PUBLIC_CAPTCHA_PROVIDER=hcaptcha

# Or reCAPTCHA
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your-site-key
RECAPTCHA_SECRET_KEY=your-secret-key
NEXT_PUBLIC_CAPTCHA_PROVIDER=recaptcha
```

## Tradeoffs Explained

### Rate Limiting
- **Current:** In-memory (fast, but lost on restart)
- **Production:** Redis (distributed, persistent)
- **Tradeoff:** Simplicity vs. scalability

### Spam Detection
- **Current:** Rule-based heuristics (fast, configurable)
- **Production:** ML-based (better accuracy, requires API)
- **Tradeoff:** Control vs. accuracy

### URL Handling
- **Chosen:** Remove all URLs (safer, simpler)
- **Alternative:** Whitelist `.edu` domains
- **Tradeoff:** Safety vs. flexibility

### CAPTCHA
- **hCaptcha:** Privacy-friendly, lighter, recommended
- **reCAPTCHA:** Better bot detection, but heavier
- **Tradeoff:** Privacy/performance vs. detection quality

## Security Layers

1. **Rate Limiting** → Prevents volume attacks
2. **Spam Detection** → Catches automated content
3. **Text Sanitization** → Removes PII/threats
4. **CAPTCHA** → Blocks bots
5. **Moderation Queue** → Manual review for flagged content

## Testing

All abuse prevention is active. Test with:
- Repeated text spam
- Multiple links
- Threat keywords
- Rate limit by submitting multiple reviews quickly

See `ABUSE_PREVENTION.md` for detailed documentation and production recommendations.


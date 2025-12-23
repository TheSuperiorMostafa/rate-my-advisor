/**
 * Abuse prevention utilities
 * Spam detection, content analysis, and fingerprinting
 */

import crypto from "crypto";

// Spam detection thresholds
const SPAM_THRESHOLDS = {
  MAX_LINKS: 3, // Maximum allowed links
  REPEATED_TEXT_THRESHOLD: 0.5, // 50% of text is repeated
  MIN_UNIQUE_WORDS: 10, // Minimum unique words for valid review
  PROFANITY_SCORE_THRESHOLD: 0.3, // 30% profanity words = spam
};

// Extended profanity list (basic - expand in production)
const PROFANITY_WORDS = [
  // Common profanity (keeping minimal for example)
  "damn", "hell", "crap", "stupid", "idiot",
  // Add more comprehensive list in production
];

// Threat keywords
const THREAT_KEYWORDS = [
  "kill", "murder", "death", "harm", "hurt", "attack", "violence",
  "threat", "danger", "weapon", "gun", "knife", "bomb",
];

// Spam patterns
const SPAM_PATTERNS = [
  /(.)\1{10,}/gi, // Repeated characters (e.g., "aaaaaaaaaa")
  /(.)\1{4,}/gi, // Short repeated patterns
  /[A-Z]{20,}/g, // ALL CAPS spam
  /\d{10,}/g, // Long number sequences
];

/**
 * Generate fingerprint from request headers
 */
export function generateFingerprint(request: Request): string {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const userAgent = request.headers.get("user-agent") || "";
  const acceptLanguage = request.headers.get("accept-language") || "";
  
  // Create hash from fingerprint components
  const fingerprint = `${ip}:${userAgent}:${acceptLanguage}`;
  return crypto.createHash("sha256").update(fingerprint).digest("hex").substring(0, 16);
}

/**
 * Check for repeated text patterns
 */
export function detectRepeatedText(text: string): { isSpam: boolean; score: number } {
  const words = text.toLowerCase().split(/\s+/);
  const uniqueWords = new Set(words);
  const repetitionRatio = 1 - uniqueWords.size / words.length;

  return {
    isSpam: repetitionRatio > SPAM_THRESHOLDS.REPEATED_TEXT_THRESHOLD,
    score: repetitionRatio,
  };
}

/**
 * Count links in text
 */
export function countLinks(text: string): number {
  const urlPattern = /https?:\/\/[^\s]+/gi;
  const matches = text.match(urlPattern);
  return matches ? matches.length : 0;
}

/**
 * Calculate profanity score
 */
export function calculateProfanityScore(text: string): { score: number; words: string[] } {
  const lowerText = text.toLowerCase();
  const words = lowerText.split(/\s+/);
  const foundProfanity: string[] = [];

  PROFANITY_WORDS.forEach((word) => {
    if (lowerText.includes(word)) {
      foundProfanity.push(word);
    }
  });

  const score = foundProfanity.length / words.length;
  return {
    score,
    words: foundProfanity,
  };
}

/**
 * Detect spam patterns
 */
export function detectSpamPatterns(text: string): { isSpam: boolean; patterns: string[] } {
  const foundPatterns: string[] = [];

  SPAM_PATTERNS.forEach((pattern) => {
    if (pattern.test(text)) {
      foundPatterns.push(pattern.toString());
    }
  });

  return {
    isSpam: foundPatterns.length > 0,
    patterns: foundPatterns,
  };
}

/**
 * Check for threats
 */
export function containsThreats(text: string): boolean {
  const lowerText = text.toLowerCase();
  return THREAT_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Comprehensive spam detection
 */
export interface SpamDetectionResult {
  isSpam: boolean;
  score: number; // 0-1, higher = more likely spam
  reasons: string[];
  details: {
    repeatedText: number;
    linkCount: number;
    profanityScore: number;
    hasSpamPatterns: boolean;
    hasThreats: boolean;
    uniqueWordCount: number;
  };
}

export function detectSpam(text: string): SpamDetectionResult {
  const reasons: string[] = [];
  let spamScore = 0;

  // Check repeated text
  const repeatedText = detectRepeatedText(text);
  if (repeatedText.isSpam) {
    reasons.push("Excessive text repetition");
    spamScore += 0.3;
  }

  // Check links
  const linkCount = countLinks(text);
  if (linkCount > SPAM_THRESHOLDS.MAX_LINKS) {
    reasons.push(`Too many links (${linkCount})`);
    spamScore += 0.2;
  }

  // Check profanity
  const profanity = calculateProfanityScore(text);
  if (profanity.score > SPAM_THRESHOLDS.PROFANITY_SCORE_THRESHOLD) {
    reasons.push("Excessive profanity");
    spamScore += 0.3;
  }

  // Check spam patterns
  const spamPatterns = detectSpamPatterns(text);
  if (spamPatterns.isSpam) {
    reasons.push("Spam patterns detected");
    spamScore += 0.2;
  }

  // Check threats
  if (containsThreats(text)) {
    reasons.push("Threats detected");
    spamScore += 1.0; // Auto-reject threats
  }

  // Check unique word count
  const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
  if (uniqueWords.size < SPAM_THRESHOLDS.MIN_UNIQUE_WORDS) {
    reasons.push("Too few unique words");
    spamScore += 0.2;
  }

  return {
    isSpam: spamScore >= 0.5 || containsThreats(text),
    score: Math.min(spamScore, 1.0),
    reasons,
    details: {
      repeatedText: repeatedText.score,
      linkCount,
      profanityScore: profanity.score,
      hasSpamPatterns: spamPatterns.isSpam,
      hasThreats: containsThreats(text),
      uniqueWordCount: uniqueWords.size,
    },
  };
}



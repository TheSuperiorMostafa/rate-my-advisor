/**
 * Text sanitization utilities for reviews
 * Removes personal information and filters profanity
 */

// Patterns to detect and remove
const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
const PHONE_PATTERN = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/gi;
const URL_PATTERN = /https?:\/\/[^\s]+/gi;

// Safe URL domains (whitelist approach - more restrictive)
const SAFE_DOMAINS = [
  "university.edu",
  "edu",
  // Add more trusted domains as needed
];

// Threat patterns
const THREAT_PATTERNS = [
  /\b(kill|murder|death|harm|hurt|attack|violence|threat|danger|weapon|gun|knife|bomb)\b/gi,
];

// Basic profanity list (expand as needed)
const PROFANITY_WORDS: string[] = [
  // Add common profanity here - keeping minimal for example
  // In production, use a comprehensive library or service
];

// Medical/crime keywords that should flag content
const MEDICAL_KEYWORDS = [
  "diagnosis",
  "treatment",
  "medication",
  "illness",
  "disease",
  "symptom",
  "prescription",
  "therapy",
];

const CRIME_KEYWORDS = [
  "illegal",
  "criminal",
  "lawsuit",
  "arrest",
  "fraud",
  "theft",
  "assault",
  "harassment",
];

/**
 * Check if URL is safe (whitelist approach)
 */
function isSafeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();
    return SAFE_DOMAINS.some((domain) => hostname.endsWith(domain));
  } catch {
    return false;
  }
}

/**
 * Sanitizes text by removing personal information and threats
 * Option 1: Remove all URLs (more restrictive, safer)
 * Option 2: Allow only safe URLs (whitelist approach)
 */
export function sanitizeText(text: string, options: { allowSafeUrls?: boolean } = {}): string {
  let sanitized = text;

  // Remove emails
  sanitized = sanitized.replace(EMAIL_PATTERN, "[email removed]");

  // Remove phone numbers
  sanitized = sanitized.replace(PHONE_PATTERN, "[phone removed]");

  // Handle URLs based on option
  if (options.allowSafeUrls) {
    // Whitelist approach: remove unsafe URLs, keep safe ones
    sanitized = sanitized.replace(URL_PATTERN, (match) => {
      return isSafeUrl(match) ? match : "[url removed]";
    });
  } else {
    // Remove all URLs (default - safer)
    sanitized = sanitized.replace(URL_PATTERN, "[url removed]");
  }

  // Remove explicit threats
  THREAT_PATTERNS.forEach((pattern) => {
    sanitized = sanitized.replace(pattern, "[threat removed]");
  });

  return sanitized.trim();
}

/**
 * Checks if text contains profanity
 */
export function containsProfanity(text: string): boolean {
  const lowerText = text.toLowerCase();
  return PROFANITY_WORDS.some((word) => lowerText.includes(word));
}

/**
 * Checks if text contains medical information
 */
export function containsMedicalInfo(text: string): boolean {
  const lowerText = text.toLowerCase();
  return MEDICAL_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Checks if text contains crime accusations
 */
export function containsCrimeAccusations(text: string): boolean {
  const lowerText = text.toLowerCase();
  return CRIME_KEYWORDS.some((keyword) => lowerText.includes(keyword));
}

/**
 * Checks if text contains personal contact information
 */
export function containsContactInfo(text: string): boolean {
  return EMAIL_PATTERN.test(text) || PHONE_PATTERN.test(text);
}

/**
 * Analyzes text and returns flags for moderation
 */
export interface TextAnalysisResult {
  isClean: boolean;
  flags: string[];
  sanitized: string;
  spamScore?: number;
  hasThreats?: boolean;
}

export function analyzeText(text: string, options: { allowSafeUrls?: boolean } = {}): TextAnalysisResult {
  const flags: string[] = [];
  let sanitized = text;

  // Check for contact info
  if (containsContactInfo(text)) {
    flags.push("contact_info");
    sanitized = sanitizeText(text, options);
  }

  // Check for profanity
  if (containsProfanity(text)) {
    flags.push("profanity");
  }

  // Check for medical info
  if (containsMedicalInfo(text)) {
    flags.push("medical_info");
  }

  // Check for crime accusations
  if (containsCrimeAccusations(text)) {
    flags.push("crime_accusation");
  }

  // Check for threats
  const hasThreats = THREAT_PATTERNS.some((pattern) => pattern.test(text));
  if (hasThreats) {
    flags.push("threats");
    sanitized = sanitizeText(text, options);
  }

  return {
    isClean: flags.length === 0,
    flags,
    sanitized,
    hasThreats,
  };
}


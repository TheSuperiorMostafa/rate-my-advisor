/**
 * CAPTCHA verification utilities
 * Using hCaptcha (privacy-friendly alternative to reCAPTCHA)
 * 
 * Tradeoffs:
 * - hCaptcha: More privacy-friendly, pays users, lighter weight
 * - reCAPTCHA: More widely used, better bot detection, but heavier and privacy concerns
 * 
 * For MVP, hCaptcha is recommended due to privacy and performance
 */

const HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify";

/**
 * Verify hCaptcha token
 */
export async function verifyCaptcha(
  token: string,
  secretKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data["error-codes"]?.join(", ") || "CAPTCHA verification failed",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "CAPTCHA verification error",
    };
  }
}

/**
 * Verify reCAPTCHA token (alternative implementation)
 */
export async function verifyRecaptcha(
  token: string,
  secretKey: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: data["error-codes"]?.join(", ") || "reCAPTCHA verification failed",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "reCAPTCHA verification error",
    };
  }
}



"use client";

import { useEffect, useRef } from "react";

interface CaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onError?: (error: string) => void;
  provider?: "hcaptcha" | "recaptcha";
}

/**
 * CAPTCHA component
 * Supports both hCaptcha and reCAPTCHA
 * 
 * Usage:
 * <Captcha
 *   siteKey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY}
 *   onVerify={(token) => setCaptchaToken(token)}
 *   provider="hcaptcha"
 * />
 */
export function Captcha({ siteKey, onVerify, onError, provider = "hcaptcha" }: CaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;

    // Load hCaptcha script
    if (provider === "hcaptcha") {
      const script = document.createElement("script");
      script.src = "https://js.hcaptcha.com/1/api.js";
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.hcaptcha && containerRef.current) {
          widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            "error-callback": (error: string) => {
              onError?.(error);
            },
          });
        }
      };

      document.head.appendChild(script);

      return () => {
        if (widgetIdRef.current && window.hcaptcha) {
          window.hcaptcha.reset(widgetIdRef.current);
        }
      };
    }

    // Load reCAPTCHA script
    if (provider === "recaptcha") {
      const script = document.createElement("script");
      script.src = `https://www.google.com/recaptcha/api.js?render=${siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.grecaptcha && containerRef.current) {
          widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              onVerify(token);
            },
            "error-callback": (error: string) => {
              onError?.(error);
            },
          });
        }
      };

      document.head.appendChild(script);
    }
  }, [siteKey, provider, onVerify, onError]);

  return <div ref={containerRef} />;
}

// TypeScript declarations for CAPTCHA libraries
declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
    grecaptcha?: {
      render: (container: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
    };
  }
}


import { z } from "zod";

export const reviewFormSchema = z.object({
  ratings: z.object({
    accuracy: z.number().int().min(1).max(5),
    responsiveness: z.number().int().min(1).max(5),
    helpfulness: z.number().int().min(1).max(5),
    availability: z.number().int().min(1).max(5),
    advocacy: z.number().int().min(1).max(5),
    clarity: z.number().int().min(1).max(5),
  }),
  text: z
    .string()
    .min(50, "Review must be at least 50 characters")
    .max(2000, "Review must be less than 2000 characters"),
  meetingType: z.enum(["in_person", "virtual", "email", "mixed"]),
  timeframe: z.enum(["last_6_months", "6_12_months", "1_2_years", "2_plus_years"]),
  tags: z.array(z.string().uuid()).max(5).optional(),
  rulesAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the review guidelines",
  }),
});

export type ReviewFormData = z.infer<typeof reviewFormSchema>;

// Client-side content checking
export const EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi;
export const PHONE_PATTERN = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b|\b\(\d{3}\)\s?\d{3}[-.]?\d{4}\b/gi;

export function checkForContactInfo(text: string): {
  hasEmail: boolean;
  hasPhone: boolean;
  message: string;
} {
  const hasEmail = EMAIL_PATTERN.test(text);
  const hasPhone = PHONE_PATTERN.test(text);

  let message = "";
  if (hasEmail && hasPhone) {
    message = "Please remove email addresses and phone numbers from your review.";
  } else if (hasEmail) {
    message = "Please remove email addresses from your review.";
  } else if (hasPhone) {
    message = "Please remove phone numbers from your review.";
  }

  return { hasEmail, hasPhone, message };
}



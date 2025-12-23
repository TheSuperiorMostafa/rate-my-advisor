import { z } from "zod";

// University schemas
export const universityQuerySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Department schemas
export const departmentParamsSchema = z.object({
  id: z.string().uuid(),
});

// Advisor schemas
export const advisorParamsSchema = z.object({
  id: z.string().uuid(),
});

export const advisorQuerySchema = z.object({
  query: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

// Review schemas
export const createReviewSchema = z.object({
  ratings: z.object({
    accuracy: z.number().int().min(1).max(5),
    responsiveness: z.number().int().min(1).max(5),
    helpfulness: z.number().int().min(1).max(5),
    availability: z.number().int().min(1).max(5),
    advocacy: z.number().int().min(1).max(5),
    clarity: z.number().int().min(1).max(5),
  }),
  text: z.string().min(50).max(2000),
  meetingType: z.enum(["in_person", "virtual", "email", "mixed"]),
  timeframe: z.enum(["last_6_months", "6_12_months", "1_2_years", "2_plus_years"]),
  tags: z.array(z.string().uuid()).max(5).optional(),
  email: z.string().email().endsWith(".edu").optional(),
  captchaToken: z.string().optional(), // CAPTCHA token if enabled
});

export const reviewParamsSchema = z.object({
  id: z.string().uuid(),
});

export const reviewVoteSchema = z.object({
  // No body needed, just auth/IP tracking
});

export const reviewReportSchema = z.object({
  reason: z.enum(["doxxing", "hate_speech", "off_topic", "spam", "other"]),
  details: z.string().max(500).optional(),
});

// Moderation schemas
export const moderationQuerySchema = z.object({
  status: z.enum(["pending", "approved", "rejected", "reported", "flagged", "all"]).default("pending"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const moderationActionSchema = z.object({
  notes: z.string().max(1000).optional(),
});

export const moderationRejectSchema = z.object({
  reason: z.string().min(1).max(200),
  notes: z.string().max(1000).optional(),
});


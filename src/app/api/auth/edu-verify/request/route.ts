import { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { successResponse, errorResponse, unauthorizedResponse, rateLimitResponse } from "@/lib/api-response";
import { rateLimitMiddleware } from "@/lib/rate-limit";
import nodemailer from "nodemailer";

const requestSchema = z.object({
  email: z.string().email().refine((email) => email.endsWith(".edu"), {
    message: "Email must be a .edu address",
  }),
});

/**
 * Generate 6-digit verification code
 */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || "noreply@ratemyadvisor.com",
    to: email,
    subject: "Verify Your .edu Email - Rate My Advisor",
    html: `
      <h2>Verify Your Student Email</h2>
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimit = rateLimitMiddleware(request, {
    maxRequests: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    keyPrefix: "edu_verify_request",
  });
  if (rateLimit) return rateLimit;

  // Check authentication
  const session = await getSession(request);
  if (!session?.user?.id) {
    return unauthorizedResponse("Must be signed in to verify email");
  }

  try {
    const body = await request.json();
    const { email } = requestSchema.parse(body);

    // Check if already verified
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { eduVerified: true },
    });

    if (user?.eduVerified) {
      return errorResponse("Email already verified", 400);
    }

    // Generate code
    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes

    // Delete any existing unverified codes
    await prisma.eduVerification.deleteMany({
      where: {
        userId: session.user.id,
        verifiedAt: null,
      },
    });

    // Create verification record
    await prisma.eduVerification.create({
      data: {
        userId: session.user.id,
        email,
        code,
        expiresAt,
      },
    });

    // Send email
    try {
      await sendVerificationEmail(email, code);
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return errorResponse("Failed to send verification email", 500);
    }

    return successResponse({
      message: "Verification code sent to your email",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(error.issues[0]?.message || "Validation error", 400);
    }
    if (error instanceof Error) {
      return errorResponse(error.message, 400);
    }
    return errorResponse("Internal server error", 500);
  }
}


import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { prisma } from "./prisma";

/**
 * Get user ID from request (for authenticated routes)
 */
export async function getUserId(request: NextRequest): Promise<string | null> {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token?.sub || null;
}

/**
 * Get full user session (for API routes)
 */
export async function getSession(request?: NextRequest) {
  if (!request) return null;
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  if (!token?.sub) return null;
  
  // Get user from database to include role and eduVerified
  const user = await prisma.user.findUnique({
    where: { id: token.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      eduVerified: true,
    },
  });
  
  if (!user) return null;
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
      eduVerified: user.eduVerified,
    },
  };
}

/**
 * Check if user is admin
 */
export async function isAdmin(request: NextRequest): Promise<boolean> {
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  return token?.role === "ADMIN";
}

/**
 * Get session in server components (for pages)
 * Use this in server components instead of getSession
 */
export async function getServerSession() {
  const { headers } = await import("next/headers");
  const headersList = await headers();
  const { getToken } = await import("next-auth/jwt");
  
  const token = await getToken({
    req: {
      headers: Object.fromEntries(headersList.entries()),
    } as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token?.sub) return null;

  // Get user from database to include role and eduVerified
  const user = await prisma.user.findUnique({
    where: { id: token.sub },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      eduVerified: true,
    },
  });

  if (!user) return null;

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "USER" | "ADMIN",
      eduVerified: user.eduVerified,
    },
  };
}

/**
 * Get client IP address for rate limiting
 */
export function getClientIP(request: NextRequest): string {
  // Check various headers for real IP (behind proxy)
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback (won't work in production behind proxy)
  return "unknown";
}


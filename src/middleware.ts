import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Public routes - allow all
  if (
    path.startsWith("/api/universities") ||
    path.startsWith("/api/departments") ||
    (path.startsWith("/api/advisors") && !path.includes("/reviews")) ||
    path.startsWith("/api/search") ||
    path.startsWith("/api/tags") ||
    path === "/" ||
    path.startsWith("/auth") ||
    path.startsWith("/u/") ||
    path.startsWith("/d/") ||
    (path.startsWith("/a/") && !path.includes("/review")) ||
    path.startsWith("/privacy") ||
    path.startsWith("/terms") ||
    path.startsWith("/dmca") ||
    path.startsWith("/content-policy") ||
    path.startsWith("/moderation-policy")
  ) {
    return NextResponse.next();
  }

  // Admin routes - require ADMIN role
  if (path.startsWith("/admin") || path.startsWith("/api/mod")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - require authentication
  if (
    path.startsWith("/api/reviews") ||
    (path.startsWith("/api/advisors") && path.includes("/reviews"))
  ) {
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Review submission pages - require authentication
  if (path.includes("/review") && !path.includes("/success")) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/signin", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/mod/:path*",
    "/api/reviews/:path*",
    "/api/advisors/:path*/reviews",
    "/a/:path*/review/:path*",
  ],
};


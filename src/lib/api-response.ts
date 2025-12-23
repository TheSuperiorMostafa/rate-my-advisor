import { NextResponse } from "next/server";

/**
 * Standardized API response helpers
 */

export function successResponse<T>(data: T, status: number = 200): NextResponse {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(
  message: string,
  status: number = 400,
  errors?: Record<string, string[]>
): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(errors && { errors }),
    },
    { status }
  );
}

export function notFoundResponse(message: string = "Resource not found"): NextResponse {
  return errorResponse(message, 404);
}

export function unauthorizedResponse(message: string = "Unauthorized"): NextResponse {
  return errorResponse(message, 401);
}

export function forbiddenResponse(message: string = "Forbidden"): NextResponse {
  return errorResponse(message, 403);
}

export function rateLimitResponse(resetAt: number): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: "Rate limit exceeded",
      resetAt: new Date(resetAt).toISOString(),
    },
    {
      status: 429,
      headers: {
        "Retry-After": Math.ceil((resetAt - Date.now()) / 1000).toString(),
      },
    }
  );
}



import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";
import { NextResponse } from "next/server";

let handlers: { GET: any; POST: any } | null = null;
let initError: Error | null = null;

try {
  const result = NextAuth(authOptions);
  handlers = result.handlers;
} catch (error) {
  console.error("❌ NextAuth initialization error:", error);
  initError = error instanceof Error ? error : new Error(String(error));
}

export async function GET(req: Request) {
  if (initError) {
    console.error("NextAuth GET error:", initError);
    return NextResponse.json(
      { 
        error: "Authentication not configured",
        details: initError.message
      },
      { status: 500 }
    );
  }
  
  if (!handlers) {
    return NextResponse.json(
      { error: "Handlers not initialized" },
      { status: 500 }
    );
  }

  try {
    return await handlers.GET(req);
  } catch (error) {
    console.error("NextAuth GET handler error:", error);
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (initError) {
    console.error("NextAuth POST error:", initError);
    return NextResponse.json(
      { 
        error: "Authentication not configured",
        details: initError.message
      },
      { status: 500 }
    );
  }
  
  if (!handlers) {
    return NextResponse.json(
      { error: "Handlers not initialized" },
      { status: 500 }
    );
  }

  try {
    return await handlers.POST(req);
  } catch (error) {
    console.error("NextAuth POST handler error:", error);
    if (error instanceof Error) {
      console.error("   Error message:", error.message);
      console.error("   Error stack:", error.stack);
    }
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : typeof error
      },
      { status: 500 }
    );
  }
}


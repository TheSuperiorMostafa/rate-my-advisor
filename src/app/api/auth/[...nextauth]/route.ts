import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

let handlers: { GET: any; POST: any };

try {
  const result = NextAuth(authOptions);
  handlers = result.handlers;
} catch (error) {
  console.error("❌ NextAuth initialization error:", error);
  // Fallback handlers that return error
  handlers = {
    GET: async () => new Response(JSON.stringify({ error: "Authentication not configured" }), { status: 500 }),
    POST: async () => new Response(JSON.stringify({ error: "Authentication not configured" }), { status: 500 }),
  };
}

export const { GET, POST } = handlers;


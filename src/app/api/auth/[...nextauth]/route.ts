import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth-config";

let handlers: { GET: any; POST: any };

try {
  const result = NextAuth(authOptions);
  handlers = result.handlers;
} catch (error) {
  console.error("❌ NextAuth initialization error:", error);
  // Fallback handlers that return error with more details
  handlers = {
    GET: async (req: Request) => {
      console.error("NextAuth GET error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Authentication not configured",
          details: error instanceof Error ? error.message : "Unknown error"
        }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    },
    POST: async (req: Request) => {
      console.error("NextAuth POST error:", error);
      return new Response(
        JSON.stringify({ 
          error: "Authentication not configured",
          details: error instanceof Error ? error.message : "Unknown error"
        }), 
        { 
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    },
  };
}

export const { GET, POST } = handlers;


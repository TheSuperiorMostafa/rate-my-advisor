import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

// Validate OAuth configuration
const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
const nextAuthUrl = process.env.NEXTAUTH_URL || "";

if (process.env.NODE_ENV === "production") {
  if (!googleClientId) {
    console.error("❌ GOOGLE_CLIENT_ID is missing in production!");
  } else {
    console.log("✅ GOOGLE_CLIENT_ID is set:", googleClientId.substring(0, 30) + "...");
    if (!googleClientId.includes(".apps.googleusercontent.com")) {
      console.error("❌ GOOGLE_CLIENT_ID format looks incorrect - should contain '.apps.googleusercontent.com'");
      console.error("   Current value starts with:", googleClientId.substring(0, 30) + "...");
    }
  }
  if (!googleClientSecret) {
    console.error("❌ GOOGLE_CLIENT_SECRET is missing in production!");
  } else {
    console.log("✅ GOOGLE_CLIENT_SECRET is set:", googleClientSecret.substring(0, 10) + "...");
    if (!googleClientSecret.startsWith("GOCSPX-")) {
      console.warn("⚠️ GOOGLE_CLIENT_SECRET format looks unusual - should start with 'GOCSPX-'");
    }
  }
  if (!nextAuthUrl) {
    console.error("❌ NEXTAUTH_URL is missing in production!");
  } else {
    console.log("✅ NEXTAUTH_URL:", nextAuthUrl);
  }
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Required for Vercel/production deployments
  // Explicitly set the base URL for OAuth callbacks when behind proxy
  ...(process.env.NEXTAUTH_URL && {
    basePath: undefined, // Use default /api/auth
  }),
  providers: [
    GoogleProvider({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          console.log("❌ Missing credentials");
          return null;
        }

        // Check if credentials match admin env vars
        const adminUsername = (process.env.ADMIN_USERNAME || "admin").trim();
        const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();
        const providedUsername = String(credentials.username).trim();
        const providedPassword = String(credentials.password).trim();

        console.log("🔐 Auth attempt:", {
          providedUsername,
          adminUsername,
          usernameMatch: providedUsername === adminUsername,
          passwordLength: providedPassword.length,
          adminPasswordLength: adminPassword.length,
          passwordMatch: providedPassword === adminPassword,
        });

        if (providedUsername === adminUsername && providedPassword === adminPassword) {
          // Find or create admin user
          let user = await prisma.user.findUnique({
            where: { email: `${adminUsername}@admin.local` },
          });

          if (!user) {
            // Create admin user if doesn't exist
            user = await prisma.user.create({
              data: {
                email: `${adminUsername}@admin.local`,
                name: "Admin",
                role: "ADMIN",
                emailVerified: new Date(),
              },
            });
          } else if (user.role !== "ADMIN") {
            // Update to admin if not already
            user = await prisma.user.update({
              where: { id: user.id },
              data: { role: "ADMIN" },
            });
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as "USER" | "ADMIN",
            eduVerified: user.eduVerified,
          };
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-email",
  },
  callbacks: {
    async session({ session, token }) {
      // With JWT strategy, we get token instead of user
      if (token && session.user) {
        // Get user from database to include role (for both OAuth and credentials)
        try {
          const userId = token.sub;
          if (userId) {
            const dbUser = await prisma.user.findUnique({
              where: { id: userId },
              select: {
                id: true,
                email: true,
                name: true,
                role: true,
                eduVerified: true,
              },
            });

            if (dbUser) {
              session.user.id = dbUser.id;
              session.user.email = dbUser.email || session.user.email || "";
              session.user.name = dbUser.name || session.user.name || "";
              session.user.role = dbUser.role as "USER" | "ADMIN";
              session.user.eduVerified = dbUser.eduVerified;
            } else {
              // Fallback to token data
              session.user.id = userId;
              session.user.role = (token.role as "USER" | "ADMIN") || "USER";
              session.user.eduVerified = (token.eduVerified as boolean) || false;
            }
          }
        } catch (error) {
          console.error("❌ Error in session callback:", error);
          // Fallback to token data
          if (token.sub) {
            session.user.id = token.sub;
            session.user.role = (token.role as "USER" | "ADMIN") || "USER";
            session.user.eduVerified = (token.eduVerified as boolean) || false;
          }
        }
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // For credentials provider, user is passed directly
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.eduVerified = user.eduVerified;
      } else if (account && account.provider === "google" && account.providerAccountId) {
        // For Google OAuth, fetch user from DB
        try {
          const accountRecord = await prisma.account.findUnique({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
            include: { user: true },
          });
          if (accountRecord?.user) {
            token.sub = accountRecord.user.id;
            token.email = accountRecord.user.email || "";
            token.name = accountRecord.user.name || "";
            token.role = accountRecord.user.role as "USER" | "ADMIN";
            token.eduVerified = accountRecord.user.eduVerified;
          }
        } catch (error) {
          console.error("Error fetching user in jwt callback:", error);
          // Continue with token as-is if DB query fails
        }
      }
      return token;
    },
    async signIn({ user, account, profile }) {
      try {
        console.log("✅ Sign in attempt:", { 
          userId: user?.id, 
          email: user?.email,
          provider: account?.provider,
          accountId: account?.providerAccountId 
        });
        
        // Log OAuth errors if present
        if (account?.error) {
          console.error("❌ OAuth error in signIn callback:", account.error);
          console.error("   Error details:", {
            error: account.error,
            errorDescription: account.error_description,
            errorUri: account.error_uri,
          });
          
          // Log configuration for debugging
          if (account.error === "invalid_client") {
            console.error("🔍 Debugging invalid_client error:");
            console.error("   GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 30) + "..." : "NOT SET");
            console.error("   GOOGLE_CLIENT_SECRET:", process.env.GOOGLE_CLIENT_SECRET ? "SET (hidden)" : "NOT SET");
            console.error("   NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "NOT SET");
          }
          
          return false;
        }
        
        // Allow sign in for Google OAuth
        if (account?.provider === "google") {
          return true;
        }
        
        // Allow credentials (admin login)
        if (account?.provider === "credentials") {
          return true;
        }
        
        return true;
      } catch (error) {
        console.error("❌ Sign in error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // When behind Cloudflare proxy, always use NEXTAUTH_URL for OAuth callbacks
      // This ensures OAuth redirects go to the correct domain (Cloudflare, not Vercel)
      const redirectBaseUrl = process.env.NEXTAUTH_URL || baseUrl;
      
      // Log for debugging
      if (process.env.NODE_ENV === "production") {
        console.log("🔀 Redirect callback:", {
          url,
          baseUrl,
          nextAuthUrl: process.env.NEXTAUTH_URL,
          using: redirectBaseUrl,
        });
      }
      
      // Ensure redirects stay within the same origin
      if (url.startsWith("/")) return `${redirectBaseUrl}${url}`;
      
      try {
        const urlObj = new URL(url);
        if (urlObj.origin === redirectBaseUrl || urlObj.origin === baseUrl) {
          return url;
        }
      } catch {
        // Invalid URL, use baseUrl
      }
      
      return redirectBaseUrl;
    },
  },
  session: {
    strategy: "jwt", // Changed to JWT to support credentials provider
  },
};


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
  }
  if (!googleClientSecret) {
    console.error("❌ GOOGLE_CLIENT_SECRET is missing in production!");
  }
  if (!nextAuthUrl) {
    console.error("❌ NEXTAUTH_URL is missing in production!");
  } else {
    console.log("✅ NEXTAUTH_URL:", nextAuthUrl);
  }
  if (googleClientId && !googleClientId.includes(".apps.googleusercontent.com")) {
    console.error("❌ GOOGLE_CLIENT_ID format looks incorrect:", googleClientId.substring(0, 20) + "...");
  }
}

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Required for Vercel/production deployments
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
      // Ensure redirects stay within the same origin
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt", // Changed to JWT to support credentials provider
  },
};


import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";

export const authOptions: NextAuthConfig = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true, // Required for Vercel/production deployments
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify-email",
  },
  callbacks: {
    async session({ session, user }) {
      // With database sessions, user is available
      if (session.user && user) {
        try {
          // Get user from database to include role
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
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
            session.user.role = dbUser.role as "USER" | "ADMIN";
            session.user.eduVerified = dbUser.eduVerified;
          } else {
            // User not found in DB yet (shouldn't happen, but handle gracefully)
            console.warn(`User ${user.id} not found in database`);
            session.user.id = user.id;
            session.user.role = "USER";
            session.user.eduVerified = false;
          }
        } catch (error) {
          console.error("❌ Error in session callback:", error);
          // Return basic session even if database query fails
          if (user) {
            session.user.id = user.id;
            session.user.role = "USER";
            session.user.eduVerified = false;
          }
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      try {
        console.log("✅ Sign in attempt:", { userId: user?.id, email: user?.email });
        return true;
      } catch (error) {
        console.error("❌ Sign in error:", error);
        return false;
      }
    },
  },
  session: {
    strategy: "database",
  },
};


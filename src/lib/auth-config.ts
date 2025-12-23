import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { Resend } from "resend";

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
    EmailProvider({
      // Only set server if Resend is not configured (fallback to SMTP)
      ...(process.env.RESEND_API_KEY
        ? {} // No server config - we'll use Resend API directly
        : {
            server: {
              host: process.env.SMTP_HOST || "smtp.resend.com",
              port: Number(process.env.SMTP_PORT) || 587,
              auth: {
                user: process.env.SMTP_USER || "resend",
                pass: process.env.SMTP_PASSWORD || "",
              },
            },
          }),
      from: process.env.EMAIL_FROM || "onboarding@resend.dev",
      // Custom email sending with Resend API (better than SMTP)
      async sendVerificationRequest({ identifier: email, url, provider }) {
        const { host } = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
        
        console.log(`📧 Sending magic link to ${email}`);
        
        // Use Resend API if available (better than SMTP)
        if (process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            
            // Use onboarding@resend.dev if domain not verified, otherwise use custom domain
            const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
            
            // Log which email address is being used
            console.log(`📧 Email configuration:`, {
              from: emailFrom,
              resendApiKeySet: !!process.env.RESEND_API_KEY,
              nextAuthUrl: process.env.NEXTAUTH_URL,
            });
            
            const emailHtml = `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #5B2D8B 0%, #7C3AED 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">Rate My Advisor</h1>
                  </div>
                  <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
                    <h2 style="color: #1f2937; margin-top: 0;">Sign in to your account</h2>
                    <p style="color: #6b7280;">Click the button below to sign in to Rate My Advisor. This link will expire in 24 hours.</p>
                    <div style="text-align: center; margin: 30px 0;">
                      <a href="${url}" style="display: inline-block; background: #5B2D8B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Sign In</a>
                    </div>
                    <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                      If you didn't request this email, you can safely ignore it.
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
                      Or copy and paste this link into your browser:<br>
                      <a href="${url}" style="color: #5B2D8B; word-break: break-all;">${url}</a>
                    </p>
                  </div>
                </body>
              </html>
            `;
            
            const emailText = `Sign in to ${host}\n\nClick this link to sign in:\n${url}\n\nThis link will expire in 24 hours.\n\nIf you didn't request this email, you can safely ignore it.`;
            
            console.log(`📤 Sending email via Resend to ${email} from ${emailFrom}`);
            
            const result = await resend.emails.send({
              from: emailFrom,
              to: email,
              subject: `Sign in to ${host}`,
              html: emailHtml,
              text: emailText,
            });
            
            // Resend API returns { data: { id: string } } on success
            // or { error: { message: string, name: string } } on error
            if (result.error) {
              console.error("❌ Resend API error:", result.error);
              console.error("   Error details:", JSON.stringify(result.error, null, 2));
              throw new Error(`Failed to send email via Resend: ${result.error.message || JSON.stringify(result.error)}`);
            }
            
            // Success - Resend returns data with id
            if (result.data?.id) {
              console.log(`✅ Magic link sent via Resend to ${email}`);
              console.log(`   Email ID: ${result.data.id}`);
              console.log(`   From: ${emailFrom}`);
            } else {
              // This shouldn't happen, but log it
              console.warn(`⚠️ Resend sent email but no ID returned for ${email}`);
            }
            
            // Return early - email sent successfully via Resend
            // NextAuth won't try to send again
            return;
          } catch (error) {
            console.error("❌ Resend email error:", error);
            // Don't throw - let NextAuth fall back to SMTP if configured
            // But log the error so we know what happened
            if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
              console.log("⚠️ Resend failed, falling back to SMTP");
            } else {
              throw error; // No fallback available, throw error
            }
          }
        }
        
        // If no RESEND_API_KEY, NextAuth will use SMTP server config above
        // or its default email sending mechanism
        console.log(`📧 Using SMTP/default email for ${email}`);
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
        
        // Allow email magic link
        if (account?.provider === "email") {
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


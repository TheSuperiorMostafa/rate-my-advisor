import type { NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";
import ResendProvider from "next-auth/providers/resend";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "./prisma";
import { Resend } from "resend";

// Custom adapter wrapper to handle account linking
// Wrap adapter creation in try-catch to prevent initialization errors
let baseAdapter: Adapter | null = null;
try {
  baseAdapter = PrismaAdapter(prisma) as Adapter;
} catch (error) {
  console.error("❌ Failed to create PrismaAdapter:", error);
  // If adapter fails, we'll create a minimal adapter that won't break NextAuth
}

// Create a safe adapter that handles missing baseAdapter
const customAdapter: Adapter = {
  ...(baseAdapter || ({} as Adapter)),
  async getUserByAccount({ providerAccountId, provider }) {
    if (!baseAdapter?.getUserByAccount) return null;
    // First try default behavior
    try {
      return await baseAdapter.getUserByAccount({ providerAccountId, provider });
    } catch (error) {
      // If not found, return null (user might not have this account linked yet)
      return null;
    }
  },
  async getUserByEmail(email) {
    if (!baseAdapter?.getUserByEmail) return null;
    // For Google OAuth, we need to be careful about account linking
    // If a user exists but doesn't have Google account linked, we should still return them
    // This allows NextAuth to link the account instead of throwing OAuthAccountNotLinked
    try {
      return await baseAdapter.getUserByEmail(email);
    } catch (error) {
      return null;
    }
  },
  async createUser(user) {
    if (!baseAdapter?.createUser) {
      // Fallback if adapter not available - create user directly
      try {
        const newUser = await prisma.user.create({
          data: {
            email: user.email || "",
            name: user.name || null,
            emailVerified: user.emailVerified || null,
            image: user.image || null,
          },
        });
        return {
          id: newUser.id,
          email: newUser.email || "",
          emailVerified: newUser.emailVerified,
          name: newUser.name,
          image: newUser.image,
        } as any;
      } catch (error) {
        console.error("❌ Error creating user:", error);
        throw error;
      }
    }
    
    // Check if user with this email already exists
    if (user.email) {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (existingUser) {
          console.log("✅ User already exists with email, returning existing user:", user.email);
          // Return existing user instead of creating new one
          // Note: Account linking will be handled by linkAccount method
          return {
            id: existingUser.id,
            email: existingUser.email || "",
            emailVerified: existingUser.emailVerified,
            name: existingUser.name,
            image: existingUser.image,
          } as any;
        }
      } catch (error) {
        console.error("❌ Error checking existing user:", error);
        // Continue to create new user
      }
    }
    // Otherwise use default adapter behavior
    return await baseAdapter.createUser(user);
  },
  async linkAccount(account) {
    try {
      // First check if account already exists
      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
      });
      
      if (existingAccount) {
        console.log("✅ Account already linked:", account.provider);
        return existingAccount as any;
      }
      
      // Check if user exists and needs account linking
      if (account.userId) {
        const user = await prisma.user.findUnique({
          where: { id: account.userId },
          include: {
            accounts: {
              where: { provider: account.provider },
            },
          },
        });
        
        if (user && user.accounts.length > 0) {
          // Account already linked to this user
          return user.accounts[0] as any;
        }
        
        // User exists but account not linked - create the link
        if (user && user.accounts.length === 0) {
          console.log("✅ Linking", account.provider, "account to existing user:", user.email);
          // Generate account ID (required by Prisma schema)
          const accountId = `${account.provider}_${account.providerAccountId}_${user.id}`;
          return await prisma.account.create({
            data: {
              id: accountId,
              userId: user.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: typeof account.refresh_token === 'string' ? account.refresh_token : null,
              access_token: typeof account.access_token === 'string' ? account.access_token : null,
              expires_at: typeof account.expires_at === 'number' ? account.expires_at : null,
              token_type: typeof account.token_type === 'string' ? account.token_type : null,
              scope: typeof account.scope === 'string' ? account.scope : null,
              id_token: typeof account.id_token === 'string' ? account.id_token : null,
              session_state: typeof account.session_state === 'string' ? account.session_state : null,
            },
          }) as any;
        }
      }
      
      // Use default adapter to create the account link
      if (baseAdapter?.linkAccount) {
        return await baseAdapter.linkAccount(account);
      }
      // Fallback if adapter not available
      throw new Error("Adapter linkAccount not available");
    } catch (error: any) {
      // If account already exists (unique constraint), return it
      if (error?.code === "P2002") {
        const existingAccount = await prisma.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });
        if (existingAccount) {
          console.log("✅ Found existing account after error:", account.provider);
          return existingAccount as any;
        }
      }
      console.error("❌ Error linking account:", error);
      throw error;
    }
  },
};

// Validate OAuth configuration
// Strip quotes and newlines if present (some .env files add quotes and newlines)
const googleClientId = (process.env.GOOGLE_CLIENT_ID || "")
  .replace(/^["']|["']$/g, "")  // Remove surrounding quotes
  .replace(/\\n/g, "")           // Remove literal \n characters
  .trim();                      // Remove whitespace
const googleClientSecret = (process.env.GOOGLE_CLIENT_SECRET || "")
  .replace(/^["']|["']$/g, "")  // Remove surrounding quotes
  .replace(/\\n/g, "")          // Remove literal \n characters
  .trim();                      // Remove whitespace
// Trim NEXTAUTH_URL to remove any newlines or whitespace
const nextAuthUrl = (process.env.NEXTAUTH_URL || "")
  .replace(/^["']|["']$/g, "")  // Remove surrounding quotes
  .replace(/\\n/g, "")          // Remove literal \n characters
  .trim();                      // Remove whitespace

// Log configuration in development for debugging
if (process.env.NODE_ENV === "development") {
  console.log("🔍 OAuth Configuration Check:");
  console.log("   GOOGLE_CLIENT_ID:", googleClientId ? `${googleClientId.substring(0, 30)}...` : "❌ NOT SET");
  console.log("   GOOGLE_CLIENT_SECRET:", googleClientSecret ? `${googleClientSecret.substring(0, 10)}...` : "❌ NOT SET");
  console.log("   NEXTAUTH_URL:", nextAuthUrl || "❌ NOT SET");
  
  if (!googleClientId || !googleClientSecret) {
    console.log("ℹ️  Google OAuth not configured (optional - email magic links work without it)");
  }
  
  if (googleClientSecret && !googleClientSecret.startsWith("GOCSPX-")) {
    console.warn("⚠️ GOOGLE_CLIENT_SECRET format looks unusual - should start with 'GOCSPX-'");
  }
}

if (process.env.NODE_ENV === "production") {
  console.log("🔍 Google OAuth Configuration Check (Production):");
  if (!googleClientId) {
    console.error("❌ GOOGLE_CLIENT_ID is missing in production!");
    console.error("   Raw value from env:", process.env.GOOGLE_CLIENT_ID ? `"${process.env.GOOGLE_CLIENT_ID}"` : "undefined");
  } else {
    console.log("✅ GOOGLE_CLIENT_ID is set:", googleClientId.substring(0, 30) + "...");
    console.log("   Full length:", googleClientId.length, "characters");
    if (!googleClientId.includes(".apps.googleusercontent.com")) {
      console.error("❌ GOOGLE_CLIENT_ID format looks incorrect - should contain '.apps.googleusercontent.com'");
      console.error("   Current value starts with:", googleClientId.substring(0, 30) + "...");
    }
    // Check for common issues
    if (googleClientId.includes('"') || googleClientId.includes("'")) {
      console.error("❌ GOOGLE_CLIENT_ID contains quotes! Remove quotes from Vercel environment variable.");
    }
  }
  if (!googleClientSecret) {
    console.error("❌ GOOGLE_CLIENT_SECRET is missing in production!");
    console.error("   Raw value from env:", process.env.GOOGLE_CLIENT_SECRET ? "SET (hidden)" : "undefined");
  } else {
    console.log("✅ GOOGLE_CLIENT_SECRET is set:", googleClientSecret.substring(0, 10) + "...");
    console.log("   Full length:", googleClientSecret.length, "characters");
    if (!googleClientSecret.startsWith("GOCSPX-")) {
      console.warn("⚠️ GOOGLE_CLIENT_SECRET format looks unusual - should start with 'GOCSPX-'");
      console.warn("   Current value starts with:", googleClientSecret.substring(0, 10) + "...");
    }
    // Check for common issues
    if (googleClientSecret.includes('"') || googleClientSecret.includes("'")) {
      console.error("❌ GOOGLE_CLIENT_SECRET contains quotes! Remove quotes from Vercel environment variable.");
    }
  }
  if (!nextAuthUrl) {
    console.error("❌ NEXTAUTH_URL is missing in production!");
  } else {
    console.log("✅ NEXTAUTH_URL:", nextAuthUrl);
    console.log("   Redirect URI will be:", `${nextAuthUrl}/api/auth/callback/google`);
    if (nextAuthUrl.endsWith("/")) {
      console.warn("⚠️ NEXTAUTH_URL has trailing slash - should be removed");
    }
  }
  
  // Final check
  if (!googleClientId || !googleClientSecret) {
    console.error("❌ Google OAuth will NOT work - missing credentials!");
    console.error("   Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel Production environment variables.");
  } else {
    console.log("✅ Google OAuth provider will be initialized");
  }
}

// Log environment variable availability at module load time
if (process.env.NODE_ENV === "production") {
  console.log("🔍 NextAuth Configuration Check (Production):");
  console.log("   RESEND_API_KEY:", process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : "❌ NOT SET");
  console.log("   EMAIL_FROM:", process.env.EMAIL_FROM || "❌ NOT SET");
  console.log("   NEXTAUTH_URL:", process.env.NEXTAUTH_URL || "❌ NOT SET");
  console.log("   NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "✅ SET" : "❌ NOT SET");
}

// Validate Resend configuration
// In Vercel serverless, env vars are available at runtime, but we need to check them
// when the provider is actually used, not at module load
const getResendApiKey = () => {
  const key = process.env.RESEND_API_KEY?.trim();
  return key || "";
};

const getEmailFrom = () => {
  const from = process.env.EMAIL_FROM?.trim();
  return from || "onboarding@resend.dev";
};

// Create a function that returns the provider configuration
// This allows us to check env vars at runtime when providers are initialized
const createResendProvider = () => {
  const apiKey = getResendApiKey();
  const emailFrom = getEmailFrom();
  
  // Log in production to help debug
  if (process.env.NODE_ENV === "production") {
    console.log("🔍 ResendProvider Configuration Check (Runtime):");
    console.log("   RESEND_API_KEY:", apiKey ? `${apiKey.substring(0, 10)}...` : "❌ NOT SET");
    console.log("   EMAIL_FROM:", emailFrom || "❌ NOT SET");
    
    if (!apiKey) {
      console.error("❌ RESEND_API_KEY is not set! Email authentication will not work.");
      console.error("   Please set RESEND_API_KEY in your environment variables.");
      return null;
    }
    console.log("✅ ResendProvider will be initialized with API key");
  }
  
  if (!apiKey) {
    return null;
  }
  
  return ResendProvider({
    id: "email",
    apiKey: apiKey,
    from: emailFrom,
    async sendVerificationRequest({ identifier: email, url }) {
      // Check if Resend API key is configured
      if (!process.env.RESEND_API_KEY) {
        const errorMsg = "RESEND_API_KEY is not configured. Please set RESEND_API_KEY in your environment variables.";
        console.error(`❌ ${errorMsg}`);
        throw new Error(errorMsg);
      }

      const { host } = new URL(process.env.NEXTAUTH_URL || "http://localhost:3000");
      const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";
      
      console.log(`📧 Sending magic link to ${email} via Resend`);
      console.log(`📧 Email configuration:`, {
        from: emailFrom,
        nextAuthUrl: process.env.NEXTAUTH_URL,
        hasApiKey: !!process.env.RESEND_API_KEY,
      });
      
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        
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
        console.log(`🔗 Magic link URL: ${url}`);
        
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
          console.log(`   To: ${email}`);
          console.log(`   Subject: Sign in to ${host}`);
          console.log(`   View in Resend: https://resend.com/emails/${result.data.id}`);
        } else {
          console.warn(`⚠️ Resend sent email but no ID returned for ${email}`);
          console.warn(`   Full result:`, JSON.stringify(result, null, 2));
        }
      } catch (error) {
        console.error("❌ Resend email error:", error);
        if (error instanceof Error) {
          console.error("   Error message:", error.message);
          console.error("   Error stack:", error.stack);
        }
        throw error;
      }
    },
  });
};

// Validate required configuration before creating authOptions
const nextAuthSecret = process.env.NEXTAUTH_SECRET?.trim();
if (!nextAuthSecret && process.env.NODE_ENV === "production") {
  console.error("❌ CRITICAL: NEXTAUTH_SECRET is not set in production!");
}

export const authOptions: NextAuthConfig = {
  adapter: customAdapter as any,
  secret: nextAuthSecret || "fallback-secret-for-development-only",
  trustHost: true, // Required for Vercel/production deployments
  debug: true, // Enable debug logging to help diagnose OAuth issues
  // Explicitly set the base URL for OAuth callbacks when behind proxy
  ...(process.env.NEXTAUTH_URL && {
    basePath: undefined, // Use default /api/auth
  }),
  providers: [
    // Only add GoogleProvider if credentials are available
    ...(googleClientId && googleClientSecret ? [
      (() => {
        const redirectUri = nextAuthUrl ? `${nextAuthUrl.replace(/\/$/, "")}/api/auth/callback/google` : undefined;
        
        // Log OAuth configuration in production for debugging
        if (process.env.NODE_ENV === "production") {
          console.log("🔍 Google OAuth Provider Configuration:");
          console.log("   Client ID:", googleClientId.substring(0, 30) + "...");
          console.log("   Client ID full length:", googleClientId.length);
          console.log("   Client Secret starts with:", googleClientSecret.substring(0, 10) + "...");
          console.log("   NEXTAUTH_URL:", nextAuthUrl);
          console.log("   Redirect URI:", redirectUri);
          console.log("   Expected in Google Console:", redirectUri);
        }
        
        return GoogleProvider({
          clientId: googleClientId,
          clientSecret: googleClientSecret,
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code",
            },
          },
          // Explicitly set redirect URI to ensure it matches Google Console exactly
          ...(redirectUri ? {
            redirectUri: redirectUri,
          } : {}),
          // Enable account linking for existing email accounts
          // This allows Google OAuth to link to existing email-based accounts
          allowDangerousEmailAccountLinking: true,
        });
      })()
    ] : []),
    // Use ResendProvider with custom sendVerificationRequest to ensure emails are sent
    // Check at runtime - in Vercel serverless, env vars are available at runtime
    // Call createResendProvider once and use the result
    ...(() => {
      const provider = createResendProvider();
      return provider ? [provider] : [];
    })(),
  ],
  pages: {
    signIn: "/auth/signin",
    // Don't redirect to verifyRequest page - stay on sign-in page to show success message
    // verifyRequest: "/auth/verify-email",
  },
  callbacks: {
    async session({ session, token }) {
      // With JWT strategy, we get token instead of user
      if (token && session.user) {
        // Get user from database to include role (for both OAuth and credentials)
        // But don't fail if database is unavailable
        try {
          const userId = token.sub;
          if (userId) {
            try {
              const dbUser = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                  eduVerified: true,
                },
              }) as { id: string; email: string | null; name: string | null; firstName?: string | null; lastName?: string | null; role: string; eduVerified: boolean } | null;
              
              // Fetch firstName and lastName separately if needed
              if (dbUser) {
                const fullUser = await prisma.user.findUnique({
                  where: { id: userId },
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                });
                if (fullUser) {
                  (dbUser as any).firstName = fullUser.firstName;
                  (dbUser as any).lastName = fullUser.lastName;
                }
              }

              if (dbUser) {
                session.user.id = dbUser.id;
                session.user.email = dbUser.email || session.user.email || "";
                // Use full name if available, otherwise construct from firstName/lastName
                session.user.name = dbUser.name || (dbUser.firstName && dbUser.lastName 
                  ? `${dbUser.firstName} ${dbUser.lastName}` 
                  : dbUser.email?.split("@")[0] || session.user.name || "");
                session.user.role = dbUser.role as "USER" | "ADMIN";
                session.user.eduVerified = dbUser.eduVerified;
                return session;
              }
            } catch (dbError) {
              console.error("❌ Database error in session callback:", dbError);
              // Continue to fallback
            }
            
            // Fallback to token data if DB query fails or user not found
            session.user.id = userId;
            session.user.role = (token.role as "USER" | "ADMIN") || "USER";
            session.user.eduVerified = (token.eduVerified as boolean) || false;
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
    async jwt({ token, user, account, trigger }) {
      // For email provider, always fetch from DB to get latest data (including updated name from signup)
      // Also fetch on subsequent requests (when user is not present but token.sub exists)
      if (account?.provider === "email" || (!user && token.sub && account?.provider !== "google")) {
        // Fetch from DB to ensure we have the latest user data
        // But don't fail if database is unavailable
        if (token.sub) {
          try {
            try {
              const dbUser = await prisma.user.findUnique({
                where: { id: token.sub },
                select: {
                  id: true,
                  email: true,
                  name: true,
                  role: true,
                  eduVerified: true,
                },
              }) as { id: string; email: string | null; name: string | null; firstName?: string | null; lastName?: string | null; role: string; eduVerified: boolean } | null;
              
              // Fetch firstName and lastName separately if needed
              if (dbUser) {
                const fullUser = await prisma.user.findUnique({
                  where: { id: token.sub },
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                });
                if (fullUser) {
                  (dbUser as any).firstName = fullUser.firstName;
                  (dbUser as any).lastName = fullUser.lastName;
                }
              }
              
              if (dbUser) {
                token.sub = dbUser.id;
                token.email = dbUser.email || "";
                // Use full name if available, otherwise construct from firstName/lastName
                token.name = dbUser.name || (dbUser.firstName && dbUser.lastName 
                  ? `${dbUser.firstName} ${dbUser.lastName}` 
                  : dbUser.email?.split("@")[0] || "");
                token.role = dbUser.role as "USER" | "ADMIN";
                token.eduVerified = dbUser.eduVerified;
                
                if (account?.provider === "email") {
                  console.log("📧 Email provider JWT callback - updated token with DB data:", {
                    userId: dbUser.id,
                    email: dbUser.email,
                    name: token.name,
                  });
                }
                return token;
              }
            } catch (dbError) {
              console.error("❌ Database error in jwt callback:", dbError);
              // Continue to return token as-is
            }
          } catch (error) {
            console.error("Error in jwt callback (email):", error);
            // Return token as-is if anything fails
          }
        }
      }
      
      // For credentials provider, user is passed directly
      if (user) {
        console.log("👤 JWT callback - user object present:", {
          userId: user.id,
          email: user.email,
          role: user.role,
        });
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
        
        // Handle Google OAuth account linking
        // The adapter's createUser and linkAccount methods handle account linking
        // We just need to ensure the user ID is correct if an existing user is found
        if (account?.provider === "google" && user?.email) {
          try {
            // Check if a user with this email already exists
            const existingUser = await prisma.user.findUnique({
              where: { email: user.email },
              include: {
                accounts: {
                  where: { provider: "google" },
                },
              },
            });

            if (existingUser) {
              // Update user.id to point to existing user so NextAuth uses it
              user.id = existingUser.id;
              if (existingUser.accounts.length > 0) {
                console.log("✅ Google account already linked to existing user:", user.email);
              } else {
                console.log("✅ Will link Google account to existing user:", user.email);
              }
            }
          } catch (error: any) {
            console.error("❌ Error checking existing user:", error);
            // Don't block sign-in, let adapter handle it
          }
          return true;
        }
        
        // Allow email magic link
        if (account?.provider === "email") {
          // Check for pending signup data and update user
          // But don't block sign-in if anything fails
          if (user?.email && user?.id) {
            try {
              // Try to find pending signup, but don't fail if table doesn't exist or DB is unavailable
              let pendingSignup = null;
              try {
                pendingSignup = await prisma.pendingSignup.findUnique({
                  where: { email: user.email },
                });
              } catch (dbError: any) {
                // If table doesn't exist or DB is unavailable, just log and continue
                if (dbError?.code === 'P2021' || dbError?.message?.includes('does not exist') || dbError?.message?.includes('Can\'t reach database')) {
                  console.log("📧 Database unavailable or PendingSignup table not found - skipping pending signup data");
                } else {
                  console.error("❌ Database error checking pending signup:", dbError);
                }
                // Don't throw - allow sign-in to proceed
              }

              if (pendingSignup) {
                try {
                  // Ensure new users are always created as USER (not ADMIN)
                  // Only superiormostafa@gmail.com should be admin
                  const isAdminEmail = user.email === "superiormostafa@gmail.com";
                  
                  // Update user with pending signup data
                  await prisma.user.update({
                    where: { id: user.id },
                    data: {
                      firstName: pendingSignup.firstName,
                      lastName: pendingSignup.lastName,
                      name: `${pendingSignup.firstName} ${pendingSignup.lastName}`,
                      birthday: pendingSignup.birthday,
                      universityId: pendingSignup.universityId || null,
                      fieldOfStudy: pendingSignup.fieldOfStudy || null,
                      emailVerified: new Date(),
                      // Only set role to ADMIN if it's the admin email
                      role: isAdminEmail ? "ADMIN" : "USER",
                    },
                  });

                  // Delete pending signup after successful account creation
                  try {
                    await prisma.pendingSignup.delete({
                      where: { id: pendingSignup.id },
                    });
                  } catch (deleteError) {
                    console.error("❌ Error deleting pending signup:", deleteError);
                    // Don't throw - user update succeeded
                  }

                  console.log("✅ User account created with signup data:", {
                    email: user.email,
                    firstName: pendingSignup.firstName,
                    lastName: pendingSignup.lastName,
                  });
                } catch (updateError) {
                  console.error("❌ Error updating user with pending signup data:", updateError);
                  // Don't throw - allow sign-in to proceed
                }
              } else {
                console.log("📧 Email sign-in - no pending signup found for:", user.email);
              }
            } catch (error) {
              console.error("❌ Error in email sign-in callback:", error);
              if (error instanceof Error) {
                console.error("   Error message:", error.message);
                console.error("   Error stack:", error.stack);
              }
              // Don't block sign-in if this fails - allow user to sign in anyway
              // The pending signup data can be added later if needed
            }
          }
          return true;
        }
        
        
        return true;
      } catch (error) {
        console.error("❌ Sign in error:", error);
        return false;
      }
    },
    async redirect({ url, baseUrl }) {
      // Simplified redirect callback - always return a safe URL
      // Don't throw any errors that could cause "Configuration" error
      try {
        // Get NEXTAUTH_URL and trim it to remove any newlines or whitespace
        const nextAuthUrlTrimmed = (process.env.NEXTAUTH_URL || "").trim();
        const redirectBaseUrl = nextAuthUrlTrimmed || baseUrl;
        
        // If URL is relative, just prepend base URL
        if (url.startsWith("/")) {
          // Don't redirect to auth pages after successful sign-in
          if (url.includes("/auth/signin") || url.includes("/auth/signup")) {
            return `${redirectBaseUrl}/`;
          }
          return `${redirectBaseUrl}${url}`;
        }
        
        // If URL is absolute, validate it's from the same origin
        try {
          const urlObj = new URL(url);
          const baseUrlObj = new URL(baseUrl);
          
          // If same origin, return the URL (but not auth pages)
          if (urlObj.origin === baseUrlObj.origin) {
            if (urlObj.pathname.includes("/auth/signin") || urlObj.pathname.includes("/auth/signup")) {
              return `${baseUrl}/`;
            }
            return url;
          }
        } catch {
          // Invalid URL format, fall through to return baseUrl
        }
        
        // Default: return homepage
        return `${redirectBaseUrl}/`;
      } catch (error) {
        // If anything fails, just return the baseUrl homepage
        console.error("❌ Error in redirect callback (non-fatal):", error);
        return baseUrl || "/";
      }
    },
  },
  session: {
    strategy: "jwt", // Changed to JWT to support credentials provider
  },
};


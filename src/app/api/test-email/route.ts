import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * Test endpoint to verify Resend email sending works
 * Visit: /api/test-email?email=your@email.com
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const testEmail = searchParams.get("email");

  if (!testEmail) {
    return NextResponse.json(
      { error: "Please provide ?email=your@email.com" },
      { status: 400 }
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || "onboarding@resend.dev";

  if (!resendApiKey) {
    return NextResponse.json(
      {
        error: "RESEND_API_KEY not configured",
        configured: false,
      },
      { status: 500 }
    );
  }

  try {
    const resend = new Resend(resendApiKey);

    const testUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/signin`;
    
    const result = await resend.emails.send({
      from: emailFrom,
      to: testEmail,
      subject: "Test Email - Rate My Advisor",
      html: `
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
              <h2 style="color: #1f2937; margin-top: 0;">✅ Test Email Successful!</h2>
              <p style="color: #6b7280;">This is a test email to verify Resend is working correctly.</p>
              <p style="color: #6b7280;">If you received this, your email magic link authentication is configured correctly!</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${testUrl}" style="display: inline-block; background: #5B2D8B; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">Go to Sign In</a>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `Test Email - Rate My Advisor\n\nThis is a test email to verify Resend is working correctly.\n\nIf you received this, your email magic link authentication is configured correctly!\n\nVisit: ${testUrl}`,
    });

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: "Failed to send test email",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully!",
      emailId: result.data?.id,
      to: testEmail,
      from: emailFrom,
      resendApiKey: resendApiKey.substring(0, 10) + "...",
    });
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to send test email",
      },
      { status: 500 }
    );
  }
}


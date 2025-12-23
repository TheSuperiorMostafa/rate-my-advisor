# Environment Variables Required

## NextAuth Configuration

Add these to your `.env.local` file:

```env
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Email Provider (SMTP)
SMTP_HOST="smtp.gmail.com"  # or your SMTP provider
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="your-app-password"
EMAIL_FROM="noreply@ratemyadvisor.com"
```

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

## SMTP Providers

### Gmail
- Host: `smtp.gmail.com`
- Port: `587`
- Use an [App Password](https://support.google.com/accounts/answer/185833) (not your regular password)

### SendGrid
- Host: `smtp.sendgrid.net`
- Port: `587`
- User: `apikey`
- Password: Your SendGrid API key

### Resend
- Host: `smtp.resend.com`
- Port: `587`
- User: `resend`
- Password: Your Resend API key

## Database

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rate_my_advisor?schema=public"
```


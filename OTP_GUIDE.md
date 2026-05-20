# OTP System Guide

## How OTP Works in EL SPACE

### Registration Flow
1. User fills in Name, Email, and Role (Client/Freelancer)
2. Clicks "Continue" → OTP is generated and sent via email
3. User enters 6-digit OTP
4. Account is created and user is redirected to dashboard

### Login Flow
1. User enters Email
2. Clicks "Send OTP" → OTP is generated and sent via email
3. User enters 6-digit OTP
4. User is logged in and redirected to dashboard

## Email Configuration

Your email is now configured with:
- **SMTP Provider**: Gmail (smtp.gmail.com)
- **Email**: elcoderssoftwares12@gmail.com
- **App Password**: Configured ✓

### Important: Gmail App Password
The password you're using (`zblm wwyp eoic tzfa`) is a Gmail App Password. Make sure:
1. ✅ 2-Step Verification is enabled on the Google account
2. ✅ App Password is generated for "Mail"
3. ✅ No spaces in the actual password when using (remove spaces: `zblmwwypeoictzfa`)

If email doesn't work, try removing spaces from the app password:

```env
EMAIL_PASSWORD=zblmwwypeoictzfa
```

## Development Mode

If email sending fails, the system automatically:
1. Shows the OTP on screen (development only)
2. Continues with registration/login
3. Logs warnings to console

This allows testing without email configuration.

## Testing OTP

### Manual Test:
1. Start the dev server: `npm run dev`
2. Go to `http://localhost:3000/auth/register`
3. Fill in the form and click "Continue"
4. Check email for OTP (or see it on screen in dev mode)
5. Enter OTP and complete registration

### API Test:
```bash
# Send OTP
curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","type":"register"}'

# Verify OTP
curl -X POST http://localhost:3000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'
```

## OTP Settings

- **Length**: 6 digits (configured via `OTP_LENGTH=6`)
- **Expiry**: 15 minutes (configured via `OTP_EXPIRY=900`)
- **Max Attempts**: 5 attempts (hardcoded in `lib/otp.ts`)
- **Storage**: In-memory (use Redis for production)

## Troubleshooting

### OTP Not Sending
1. Check build logs for email errors
2. Verify Gmail App Password is correct
3. Try removing spaces from `EMAIL_PASSWORD`
4. Check console for `[OTP]` logs

### OTP Not Verifying
1. Make sure OTP is entered within 15 minutes
2. Check for whitespace in OTP input
3. Verify email matches exactly (case-sensitive)

### Email Configuration Issues
```bash
# Test email connection
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'elcoderssoftwares12@gmail.com',
    pass: 'zblmwwypeoictzfa'
  }
});
transporter.verify().then(() => console.log('✅ Email connected')).catch(err => console.error('❌', err));
"
```

## Security Notes

⚠️ **Important for Production**:
- The OTP store is in-memory (will reset on server restart)
- For production, use Redis or database storage
- Add rate limiting to prevent abuse
- Monitor OTP failures for security threats

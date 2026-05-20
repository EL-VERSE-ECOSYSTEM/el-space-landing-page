# Environment Variables Documentation

## ✅ All Configured Variables

This file documents all environment variables used in the EL SPACE application.

### Supabase Configuration
| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://klhkzxdcdstcnqvihfcs.supabase.co` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase anonymous/public key (used by clients) |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Alternative publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | `placeholder-service-role-key` | ⚠️ Server-only key (never expose to client) |

### Email Configuration
| Variable | Value | Description |
|----------|-------|-------------|
| `EMAIL_HOST` | `smtp.gmail.com` | SMTP server hostname |
| `EMAIL_PORT` | `587` | SMTP port (587 for TLS, 465 for SSL) |
| `EMAIL_USER` | `elcoderssoftwares12@gmail.com` | SMTP username (your Gmail) |
| `EMAIL_PASSWORD` | `zblmwwypeoictzfa` | Gmail App Password (no spaces) |
| `NEXT_PUBLIC_EMAIL_FROM` | `elcoderssoftwares12@gmail.com` | From address for outgoing emails |

### OTP Configuration
| Variable | Value | Description |
|----------|-------|-------------|
| `OTP_EXPIRY` | `900` | OTP expiration time in seconds (900 = 15 minutes) |
| `OTP_LENGTH` | `6` | Number of digits in OTP code |

### Authentication
| Variable | Value | Description |
|----------|-------|-------------|
| `JWT_SECRET` | `el-space-secret-key` | Secret key for JWT token generation |

### Stripe (Optional - Phase 3)
| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_placeholder` | Stripe publishable key (client-safe) |
| `STRIPE_SECRET_KEY` | `sk_test_placeholder` | ⚠️ Stripe secret key (server-only) |

### Korapay Payment Gateway
| Variable | Value | Description |
|----------|-------|-------------|
| `KORAPAY_PUBLIC_KEY` | `pk_live_kM7m7BBtdH1Af514QMna1xHxLM8v1vutv72sWpNk` | Korapay public key |
| `KORAPAY_SECRET_KEY` | `sk_live_e9tiXn1oqUAPpT23YRF3BJPewmGKksuhkdEDPigu` | ⚠️ Korapay secret key (server-only) |

### Application Configuration
| Variable | Value | Description |
|----------|-------|-------------|
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Base URL of your application |
| `NEXT_PUBLIC_APP_NAME` | `EL SPACE` | Display name of your application |

---

## 🔒 Security Notes

### Never expose these keys to the client:
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `KORAPAY_SECRET_KEY`
- `JWT_SECRET`
- `EMAIL_PASSWORD`

Only variables prefixed with `NEXT_PUBLIC_` are safe to expose to the browser.

## 📝 File Locations

These environment variables are used in:
- `lib/supabase.ts` - Supabase client
- `lib/email.ts` - Email service
- `lib/otp.ts` - OTP generation and verification
- `utils/supabase/server.ts` - Server-side Supabase client
- `utils/supabase/client.ts` - Browser-side Supabase client
- `middleware.ts` - Route protection middleware
- `app/api/auth/send-otp/route.ts` - OTP sending endpoint
- `app/api/auth/verify-otp/route.ts` - OTP verification endpoint

## 🔧 Quick Start

1. Copy `.env.local.example` to `.env.local`
2. Update the values with your credentials
3. Restart your development server
4. Test OTP flow at `/auth/register` or `/auth/login`

## ⚠️ Troubleshooting

### Gmail App Password Issues
If emails aren't sending:
1. Make sure 2-Step Verification is enabled
2. Generate a new App Password for "Mail"
3. Remove any spaces from the password
4. Update `EMAIL_PASSWORD` in `.env.local`

### Supabase Connection Issues
If database operations fail:
1. Verify your Supabase project is active
2. Check that `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct
3. Ensure database tables exist in Supabase
4. Check RLS (Row Level Security) policies

### OTP Not Working
If OTP verification fails:
1. Make sure OTP is entered within 15 minutes
2. Check that email matches exactly
3. Look for console logs starting with `[OTP]`
4. In development, OTP is shown on screen if email fails

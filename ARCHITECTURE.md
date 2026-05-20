# EL SPACE - Architecture Quick Reference

## 🏗️ System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Next.js)                 │
│          (Dashboard, Forms, Real-time UI, Messaging)        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Layer (Next.js Routes)               │
├─────────────────────────────────────────────────────────────┤
│ /api/auth/*              │ /api/payments/korapay           │
│ /api/applications/*      │ /api/storage/upload             │
│ /api/jobs/*              │ /api/messages/*                 │
│ /api/projects/*          │ /api/notifications/push         │
│ /api/profile/*           │ /api/disputes/*                 │
│ /api/earnings/*          │ /api/milestones/*               │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  Service Layer (lib/*.ts)                   │
├─────────────────────────────────────────────────────────────┤
│ • supabase.ts           - Database operations               │
│ • korapay.ts            - Payment processing                │
│ • email.ts              - Email templates & sending         │
│ • otp.ts                - OTP generation & verification     │
│ • s3.ts                 - File uploads & management         │
│ • websocket.ts          - Real-time messaging               │
│ • push-notifications.ts - Push notifications                │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                         │
├─────────────────────────────────────────────────────────────┤
│ Supabase    │ PostgreSQL   │ Nodemailer  │ AWS S3           │
│ Socket.io   │ Web Push API │ Korapay     │ JWT/Auth         │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 File Organization

```
lib/
├── supabase.ts              # ⭐ Database (Users, Projects, Disputes)
├── korapay.ts               # ⭐ Payment Integration
├── email.ts                 # ⭐ Email Templates & SMTP
├── otp.ts                   # ⭐ OTP Generation + Supabase Storage
├── s3.ts                    # ⭐ AWS S3 File Uploads
├── websocket.ts             # ⭐ Socket.io Real-time Messaging
├── push-notifications.ts    # ⭐ Web Push Notifications
├── types.ts                 # TypeScript interfaces
├── utils.ts                 # Utility functions
├── constants.ts             # Brand colors, content
└── email-templates.ts       # Email template strings

app/api/
├── auth/                    # Authentication routes
├── payments/korapay/        # ⭐ Payment API
├── storage/upload/          # ⭐ S3 Upload API
├── messages/                # ⭐ Messaging API
├── notifications/push/      # ⭐ Push Notifications API
├── disputes/                # ⭐ Dispute Resolution API
├── projects/                # Project management
├── applications/            # Job applications
├── profile/                 # User profiles
├── earnings/                # Earnings tracking
└── milestones/              # Milestone management
```

---

## 🔄 Request Flow Examples

### Example 1: User Registration with OTP
```
User Registration Form
    ↓
POST /api/auth/register
    ↓
Generates OTP → otp.ts/generateOTP()
    ↓
Stores in DB → otp.ts/storeOTP() 
    ↓ (with Supabase fallback)
Sends Email → email.ts/sendOTPEmail()
    ↓
Gmail SMTP
    ↓
User receives OTP email
    ↓
User enters OTP
    ↓
POST /api/auth/verify-otp
    ↓
otp.ts/verifyOTP()
    ↓
Create user in Supabase → supabase.ts/createUser()
    ↓
Send welcome email
    ↓
Set session → JWT token
    ↓
Redirect to dashboard
```

### Example 2: Project Payment Flow
```
Client clicks "Release Payment"
    ↓
POST /api/payments/korapay { action: "initialize" }
    ↓
korapay.ts/initializePayment()
    ↓
supabase.ts/createPayment() [Save to DB]
    ↓
Korapay returns checkout URL
    ↓
Redirect to Korapay checkout
    ↓
User completes payment on Korapay
    ↓
Korapay webhook → GET /api/payments/korapay
    ↓
POST /api/payments/korapay { action: "verify" }
    ↓
korapay.ts/verifyPayment()
    ↓
Update payment status in DB
    ↓
Send payment notification to freelancer
    ↓
push-notifications.ts/notifyPaymentReceived()
    ↓
Release funds to freelancer wallet
```

### Example 3: Real-Time Messaging
```
Client connects to WebSocket
    ↓
socket.emit('user:join', userId)
    ↓
User stores in connectedUsers map
    ↓
socket.emit('room:join', projectId, userId)
    ↓
User joins Socket.io room
    ↓
User types message
    ↓
socket.emit('message:send', { ... })
    ↓
websocket.ts stores in Supabase
    ↓
io.to(roomName).emit('message:new')
    ↓
Broadcast to all in project room
    ↓
Recipient displays message
    ↓
Optional: Send push notification if not connected
```

### Example 4: File Upload
```
User selects portfolio file
    ↓
POST /api/storage/upload (multipart/form-data)
    ↓
action: "portfolio", userId, file
    ↓
s3.ts/uploadPortfolioFile()
    ↓
AWS S3 PutObject
    ↓
Generate URL
    ↓
Return { url, key, bucket }
    ↓
Save URL to user DB record
```

### Example 5: Dispute Resolution
```
Client files dispute
    ↓
POST /api/disputes { action: "create" }
    ↓
supabase.ts/createDispute()
    ↓
Create dispute record
    ↓
Send email to both parties
    ↓
Freelancer adds evidence
    ↓
POST /api/disputes { action: "addEvidence" }
    ↓
Upload evidence file to S3
    ↓
supabase.ts/addDisputeEvidence()
    ↓
Assign mediator
    ↓
POST /api/disputes { action: "createMediation" }
    ↓
supabase.ts/createMediationSession()
    ↓
Record outcome
    ↓
POST /api/disputes { action: "recordOutcome" }
    ↓
supabase.ts/recordMediationOutcome()
    ↓
Resolve with compensation
    ↓
POST /api/disputes { action: "resolve" }
    ↓
supabase.ts/resolveDispute()
    ↓
Send resolution emails
```

---

## 🔑 Environment Dependencies

| Service | Env Variables | File |
|---------|---------------|------|
| **Supabase** | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase.ts` |
| **Email (SMTP)** | `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASSWORD` | `lib/email.ts` |
| **Korapay** | `KORAPAY_PUBLIC_KEY`, `KORAPAY_SECRET_KEY` | `lib/korapay.ts` |
| **AWS S3** | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` | `lib/s3.ts` |
| **Push Notifications** | `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` | `lib/push-notifications.ts` |
| **WebSocket** | `NEXT_PUBLIC_WEBSOCKET_URL` | `lib/websocket.ts` |
| **JWT** | `JWT_SECRET` | `lib/utils.ts` |

---

## 📊 Data Flow Diagram

```
User Registration
├─ OTP Email
│  └─ Email Service (Nodemailer) → SMTP → Gmail
├─ User Data
│  └─ Supabase DB
├─ Session
│  └─ JWT Token

Job Management
├─ Create/Update Projects
│  └─ Supabase DB
├─ Upload Media
│  └─ AWS S3
└─ Notifications
   └─ Push/Email

Payments
├─ Initialize Payment
│  └─ Korapay API
├─ Verify Payment
│  └─ Korapay API + Supabase
└─ Process Payout
   └─ Korapay API

Real-Time Messaging
├─ Status: Connected Users
│  └─ Socket.io in-memory map
├─ Messages: Persistence
│  └─ Supabase DB
└─ Delivery: Broadcasting
   └─ Socket.io rooms

File Storage
├─ Upload: Binary → S3
├─ Store: Metadata → Supabase
└─ Retrieve: Presigned URLs ← S3

Push Notifications
├─ Subscribe: Service Worker
│  └─ Supabase (push_subscriptions)
└─ Send: Web Push Protocol
   └─ Browser Notification

Disputes
├─ File: Supabase
├─ Evidence: S3 + Supabase
├─ Mediation: Supabase
└─ Resolution: Supabase + Email
```

---

## 🚦 Key Endpoints Quick Reference

| HTTP Method | Endpoint | Purpose | Auth |
|------------|----------|---------|------|
| **POST** | `/api/auth/request-otp` | Send OTP email | ❌ |
| **POST** | `/api/auth/verify-otp` | Verify OTP | ❌ |
| **GET** | `/api/profile` | Get user profile | ✅ |
| **PATCH** | `/api/profile` | Update profile | ✅ |
| **GET** | `/api/jobs` | List open jobs | ✅ |
| **POST** | `/api/jobs` | Create new job | ✅ |
| **POST** | `/api/applications` | Apply to job | ✅ |
| **POST** | `/api/payments/korapay` | Payment operations | ✅ |
| **POST** | `/api/storage/upload` | Upload file | ✅ |
| **GET** | `/api/messages` | Get messages | ✅ |
| **POST** | `/api/messages` | Message operations | ✅ |
| **POST** | `/api/notifications/push` | Push notification | ✅ |
| **GET** | `/api/disputes` | Get disputes | ✅ |
| **POST** | `/api/disputes` | Dispute operations | ✅ |

---

## 🔐 Error Handling

Each service implements consistent error handling:

```typescript
// Pattern used across all services
try {
  // Operation
  const result = await someOperation();
  return NextResponse.json({ success: true, data: result });
} catch (error) {
  console.error('Error:', error);
  return NextResponse.json(
    { error: 'User-friendly error message' },
    { status: 500 }
  );
}
```

---

## 🧪 Quick Test Commands

```bash
# Test OTP Email
curl -X POST http://localhost:3000/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User"}'

# Test Upload
curl -X POST http://localhost:3000/api/storage/upload \
  -F "file=@portfolio.pdf" \
  -F "action=portfolio" \
  -F "userId=user-123"

# Test Payment
curl -X POST http://localhost:3000/api/payments/korapay \
  -H "Content-Type: application/json" \
  -d '{"action":"initialize","amount":5000,"currency":"USD",...}'
```

---

## 📈 Scalability Considerations

| Service | Scale Method | Limit |
|---------|-------------|-------|
| **Supabase** | Auto-scaling PostgreSQL | 1M+ connections |
| **S3** | Auto-scaling storage | Unlimited |
| **Socket.io** | Multiple server instances | 100k+ concurrent |
| **Email** | SMTP queue + retry | 10k+/day with Gmail |
| **Korapay** | Their infrastructure | Depends on account |
| **Push Notifications** | Batch processing | 100k+ per send |

---

## 🎯 Monitoring Checklist

- [ ] Database query performance (Supabase analytics)
- [ ] API response times (Next.js logs)
- [ ] Email delivery rates (Gmail API)
- [ ] Payment success rates (Korapay dashboard)
- [ ] S3 upload speeds (CloudWatch)
- [ ] WebSocket connection stability (Socket.io stats)
- [ ] Push notification delivery (Web Push dashboard)
- [ ] Error rates (Sentry or similar)

---

## 📚 Service Documentation

| Service | Docs | Key Functions |
|---------|------|---------------|
| Supabase | [supabase.com/docs](https://supabase.com/docs) | `createUser`, `createProject`, `createPayment` |
| Korapay | [korapay.com/docs](https://korapay.com/docs) | `initializePayment`, `verifyPayment`, `createPayout` |
| Socket.io | [socket.io/docs](https://socket.io/docs) | `on`, `emit`, `to` |
| AWS S3 | [docs.aws.amazon.com/s3](https://docs.aws.amazon.com/s3) | `PutObject`, `GetObject` |
| Web Push | [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Push_API) | `subscribe`, `publish` |

---

This architecture provides a scalable, maintainable foundation for the EL SPACE marketplace platform.

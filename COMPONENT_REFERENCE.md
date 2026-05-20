# Quick Reference - Component & Page Summary

## Components Overview

### 🎨 UI Components (48+ from shadcn/ui)
Located: `components/ui/`
- Form: input, textarea, select, checkbox, radio-group, label, field, input-group
- Buttons: button, button-group, toggle, toggle-group  
- Display: card, badge, avatar, separator, skeleton, empty
- Navigation: tabs, breadcrumb, navigation-menu, sidebar
- Overlays: dialog, drawer, popover, alert-dialog, context-menu, dropdown-menu, sheet, hover-card
- Lists: table, pagination
- Feedback: toast, alert, spinner, progress
- Special: calendar, carousel, chart, command, input-otp, phone-input, otp-notification, carousel

### 📱 Section Components (Landing Page)
Located: `components/sections/`

| Component | Purpose | Status |
|-----------|---------|--------|
| Navbar | Navigation + CTA | ✅ |
| Footer | Links + Company Info | ✅ |
| Hero | Main headline section | ✅ |
| TrustBar | Metrics/Stats | ✅ |
| HowItWorks | Workflow (2 variants) | ✅ |
| Features | Feature highlights | ✅ |
| Pricing | Pricing comparison | ✅ |
| EarningsCalculator | Interactive calculator | ✅ |
| TrustSafetyFeatures | Security features | ✅ |
| WhyChoose | Value prop (2 variants) | ✅ |
| FeaturedTalent | Freelancer showcase | ✅ |
| Testimonials | User reviews | ✅ |
| FAQ | Q&A section | ✅ |
| CTA | Call to action | ✅ |
| JobPostingForm | Post job form | ✅ |
| FreelancerApplicationForm | Apply form | ✅ |

### 🎯 Freelancer Components
Located: `components/freelancer/`
- Portfolio.tsx - Portfolio items management
- ApplicationCard.tsx - Application display
- FreelancerComparison.tsx - Compare freelancers
- MilestonePaymentTracker.tsx - Milestone/payment tracking
- ProjectTimeline.tsx - Project timeline visual
- QuickHire.tsx - Quick hire option
- SkillEndorsement.tsx - Skill endorsement system
- SmartRecommendations.tsx - AI recommendations
- WorkSampleGallery.tsx - Portfolio gallery

### 🛡️ Dashboard Components
Located: `components/dashboard/`
- auth-guard.tsx - DashboardLayout wrapper + useAuth hook

---

## Pages Overview

### PUBLIC PAGES (7)
- `/` - Home/Landing
- `/pricing` - Pricing
- `/how-it-works` - Workflows
- `/privacy` - Privacy Policy
- `/terms` - Terms of Service
- `/cookies` - Cookie Policy
- `/contact` - Contact Form

### AUTH PAGES (2)
- `/auth/login` - Multi-step login
- `/auth/register` - Multi-step registration

### CLIENT PAGES (3)
- `/client` - Client dashboard
- `/client/dashboard` - Client dashboard (alt route)
- `/jobs/post` - Post a job
- `/jobs` - Browse jobs
- `/jobs/[id]` - Job detail + apply

### FREELANCER PAGES (4)
- `/freelancer` - Browse freelancers
- `/freelancer/[id]` - Freelancer profile detail
- `/freelancer/dashboard` - Freelancer dashboard
- `/freelancers` - Freelancers list with filters

### GENERAL USER PAGES (5)
- `/dashboard` - Generic dashboard (redirect hub)
- `/messages` - Messaging interface
- `/notifications` - Notification center
- `/feed` - Activity/Project feed
- `/applications` - Job applications
- `/earnings` - Earnings dashboard
- `/settings` - Profile settings

### MISSING PAGES (5) ❌
- `/wallet` - Wallet management
- `/disputes` - Dispute management
- `/reviews` - Review management
- `/payments` - Payment history
- `/milestones` - Milestone tracking

---

## TypeScript Types & Interfaces

### Core Types (lib/types.ts)
```typescript
type UserType = 'client' | 'freelancer'
type UserRole = 'admin' | 'moderator' | 'user'
type VerificationBadge = 0 | 1 | 2 | 3
type ProjectStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
type MilestoneStatus = 'pending' | 'in_progress' | 'submitted' | 'approved' | 'released' | 'disputed'
type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'escrowed'
type AvailabilityStatus = 'available' | 'busy' | 'unavailable'
```

### Core Interfaces (lib/types.ts)
1. **User** - Account with email, name, verified_badge, created_at
2. **FreelancerProfile** - Rates, skills, rating, portfolio, availability
3. **ClientProfile** - Company info, budget, verification status
4. **Project** - Job details (title, budget, skills, timeline, status)
5. **Milestone** - Milestone (amount, status, due_date, payment_id)
6. **Payment** - Transaction (amount, fee, status, method)
7. **Wallet** - Balance tracking
8. **Review** - Rating + comment with visibility
9. **Application** - Job application (cover_letter, proposed_rate, status)
10. **Notification** - Message (type, title, read status)
11. **TimeLog** - Time tracking for hourly work
12. **Dispute** - Conflict resolution (reason, status, resolution)
13. **Message** - Direct message (content, attachments, read)
14. **SavedFreelancer** - Bookmarked freelancer
15. **TestProject** - Verification test project
16. **Referral** - Referral program tracking

### Specialized Types
- `Currency` (lib/korapay.ts) - 'NGN' | 'USD' | 'GHS' | 'KES' | 'USDT' | 'SOL' | 'USDC'
- `ProjectSize` (lib/fees.ts) - 'micro' | 'standard' | 'premium'
- `Message` (lib/websocket.ts) - WebSocket message
- `ConversationRoom` (lib/websocket.ts) - Chat room
- `PushNotification` (lib/push-notifications.ts) - Push notification
- `OTPData` (lib/otp.ts) - OTP validation
- `InitializePaymentParams` (lib/korapay.ts) - Korapay payment

---

## API Routes (15 Total)

| Route | Purpose | Status |
|-------|---------|--------|
| `/api/applications` | Job applications | ✅ |
| `/api/auth/**` | Authentication | ✅ |
| `/api/contact` | Contact form | ✅ |
| `/api/disputes` | Dispute management | ✅ |
| `/api/earnings` | Earnings data | ✅ |
| `/api/feed` | Feed/Activity | ✅ |
| `/api/messages` | Messaging | ✅ |
| `/api/milestones` | Milestone tracking | ✅ |
| `/api/notifications` | Notification management | ✅ |
| `/api/payments` | Payment processing | ✅ |
| `/api/profile` | User profile | ✅ |
| `/api/projects` | Job/Project management | ✅ |
| `/api/reviews` | Review/Rating | ✅ |
| `/api/storage` | File storage (S3) | ✅ |
| `/api/wallet` | Wallet management | ✅ |

---

## Known Issues & TODO Items

### 🔴 Critical
1. **Missing Pages (5)** - Wallet, Disputes, Reviews, Payments, Milestones
2. **Theme Provider** - Not wrapped in RootLayout
3. **Auth Context** - 6 TODOs using hardcoded 'user-123' IDs

### ⚠️ Medium
1. Real-time WebSocket not active
2. Push notifications not fully implemented
3. Notifications filtering needs expansion
4. Dashboard stats using mock data

### 💡 Low
1. Advanced analytics
2. Admin panel
3. Performance metrics
4. SEO optimization

---

## System Architecture

### Frontend Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + CSS Modules
- **UI Library:** shadcn/ui (48+ components)
- **Type Safety:** TypeScript
- **Auth:** Custom OTP + Google OAuth
- **Theme:** next-themes for dark mode
- **Notifications:** Sonner (toast)
- **Charts:** Recharts

### Key Libraries
- lucide-react (icons)
- next-themes (dark mode)
- sonner (notifications)
- react-hook-form (forms)
- zod (validation)
- supabase-js (backend)

### Backend Integration
- Supabase (PostgreSQL)
- Korapay (Payments)
- AWS S3 (File storage)
- WebSocket (Real-time)
- Push notifications

---

## Quick Navigation

### To Update Pages
- Public pages: `app/page.tsx`, `app/pricing/`, etc.
- Auth pages: `app/auth/login/`, `app/auth/register/`
- Dashboard pages: `app/client/`, `app/freelancer/`
- Feature pages: `app/jobs/`, `app/messages/`, etc.

### To Update Components
- Section components: `components/sections/`
- UI components: `components/ui/`
- Freelancer features: `components/freelancer/`
- Dashboard: `components/dashboard/`

### To Update Types
- Main types: `lib/types.ts`
- Specialized: `lib/otp.ts`, `lib/korapay.ts`, `lib/websocket.ts`

### To Update Navigation
- Nav links: `lib/constants.ts` (NAV_LINKS)
- Footer links: `lib/constants.ts` (FOOTER_SECTIONS)

---

## Last Updated
April 11, 2026 - Comprehensive Workspace Audit Complete

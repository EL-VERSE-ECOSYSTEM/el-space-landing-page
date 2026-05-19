# EL SPACE - Quick Testing Guide

## 🧪 Testing the OTP Authentication System

### Prerequisites
- Gmail account with app password configured
- Environment variables set in `.env.local`
- Development server running: `npm run dev`

---

## 📧 Gmail Setup

### 1. Create App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification
3. Go to App Passwords
4. Select "Mail" and "Windows Computer"
5. Copy the 16-character password
6. Add to `.env.local`:
   ```
   EMAIL_PASSWORD=zblm wwyp eoic tzfa
   ```

### 2. Check Inbox
- Primary inbox for most emails
- **Promotions tab** for platform emails (common for OTP)
- **Spam folder** if email doesn't arrive

---

## ✅ Test Flows

### Test 1: Registration with New Email

**Steps:**
1. Open http://localhost:3000
2. Click "Apply as Freelancer" or "Post a Job"
3. You'll be redirected to `/auth/register`
4. Enter:
   - **Full Name:** John Doe
   - **Email:** your-email@gmail.com
   - **I am a:** Select "Freelancer" or "Client"
5. Click "Continue"
6. You should see: "OTP sent to your email!"

**Check Email:**
- Go to Gmail
- Open email from `elcoderssoftwares12@gmail.com`
- Subject: "Your EL SPACE OTP: [6 digits]"
- Copy the 6-digit code

**Back to App:**
1. Enter the OTP code
2. Click "Create Account"
3. You should see: "Registration successful!"
4. Redirected to `/dashboard`
5. Check email for Welcome email

**Expected Email:**
```
Subject: Welcome to EL SPACE, John Doe! 🚀
From: elcoderssoftwares12@gmail.com
```

---

### Test 2: Login with Existing Email

**Steps:**
1. Open http://localhost:3000/auth/login
2. Enter your email (from Test 1)
3. Click "Send OTP"
4. Check Gmail for OTP
5. Enter the 6-digit code
6. Click "Verify & Login"
7. Redirected to `/dashboard`

---

### Test 3: Invalid OTP

**Steps:**
1. Start registration/login
2. Send OTP to email
3. Enter wrong code (e.g., "123456")
4. You should see error: "Invalid OTP. 4 attempts remaining."
5. Try 4 more times
6. After 5 failed attempts: "Too many attempts. Please request a new OTP."

---

### Test 4: Expired OTP

**Steps:**
1. Send OTP
2. Wait 15+ minutes
3. Try to enter OTP
4. You should see: "OTP has expired. Please request a new one."

---

## 🔍 Debugging

### OTP Not Received?

**Check 1: Gmail Promotions Tab**
```
Gmail → Promotions Tab → Look for email from elcoderssoftwares12@gmail.com
```

**Check 2: Email Address Typo**
```
Make sure you enter correct email address
```

**Check 3: Terminal Logs**
```
Check terminal for error messages when sending OTP
```

**Check 4: Verify Email Connection**
```
Run: curl -X POST http://localhost:3000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@gmail.com","type":"register"}'
```

**Check 5: Gmail App Password**
```
Make sure you're using 16-character app password, not regular password
```

---

### OTP Verification Error?

**Check 1: OTP Code**
```
Make sure you copied the entire 6-digit code
No spaces or extra characters
```

**Check 2: Time Sync**
```
Make sure your computer time is correct
```

**Check 3: Browser Cache**
```
Try clearing browser cache or use incognito window
```

---

## 📊 Testing Checklist

### Registration Flow
- [ ] Can access `/auth/register`
- [ ] Form accepts email, name, user type
- [ ] OTP email is sent
- [ ] OTP email contains 6-digit code
- [ ] Can enter OTP and verify
- [ ] Welcome email is sent
- [ ] User is logged in and redirected to dashboard
- [ ] Logout button works
- [ ] Redirected to login when accessing dashboard without auth

### Login Flow
- [ ] Can access `/auth/login`
- [ ] Form accepts email only
- [ ] OTP email is sent
- [ ] Can enter OTP and verify
- [ ] User is logged in and redirected to dashboard
- [ ] Session persists on page refresh

### Error Handling
- [ ] Wrong OTP shows error message
- [ ] Expired OTP shows error message
- [ ] Too many attempts shows error message
- [ ] Invalid email shows validation error
- [ ] All error messages are user-friendly

### Email Templates
- [ ] OTP email has EL SPACE branding
- [ ] OTP email contains formatted code
- [ ] OTP email shows expiry time
- [ ] Welcome email is personalized
- [ ] Welcome email shows next steps based on user type
- [ ] All email links are functional

---

## 🎬 Video Test Scenario

1. **Start at landing page** (`/`)
   - Show modern design
   - Explain features
   
2. **Click "Post a Job" button** → `/auth/register`
   - Fill out registration form
   - Click Continue
   
3. **Check Gmail** → Open received OTP email
   - Show email template quality
   - Copy 6-digit code
   
4. **Enter OTP** → Complete registration
   - Show Success message
   - Redirect to dashboard
   
5. **Check Welcome Email** → Show personalized message
   - Highlight dynamic content
   - Show professional design
   
6. **Access Dashboard** → `/dashboard`
   - Show authenticated page
   - Click Logout
   
7. **Login Again** → `/auth/login`
   - Quick OTP login
   - Instant dashboard access

---

## 📱 Test on Mobile

1. Use phone browser or DevTools mobile view
2. Test touch interactions
3. Verify email input on mobile keyboard
4. Check OTP input experience (mobile number keyboard)
5. Verify dashboard layout on small screens

---

## 🔐 Security Tests

- [ ] Can't manually set auth cookie
- [ ] OTP only works for intended email
- [ ] Session expires after 7 days (optional test)
- [ ] CSRF protection in place
- [ ] No sensitive data in URL params
- [ ] Rate limiting on OTP requests (future)

---

## 📈 Performance Tests

- [ ] Page load time < 2 seconds
- [ ] OTP send completes in < 3 seconds
- [ ] Dashboard load < 1 second
- [ ] No console errors

---

## 💡 Tips

- **Keep browser DevTools open** (F12) to see network requests
- **Check Console tab** for JavaScript errors
- **Check Network tab** to verify API requests
- **Check Application tab** to inspect cookies and localStorage
- **Use test emails** (e.g., yourname+test@gmail.com)
- **Take screenshots** of each success state for documentation

---

## 🚀 Ready for Production?

Before deploying, verify:

- [ ] All email templates render correctly
- [ ] No hardcoded test data in code
- [ ] Environment variables configured
- [ ] Error handling complete
- [ ] Rate limiting implemented
- [ ] HTTPS enabled
- [ ] CORS configured properly
- [ ] Database backup in place
- [ ] Monitoring/logging setup
- [ ] Documentation complete

---

**Last Updated:** April 10, 2026
**Version:** 1.0 - MVP

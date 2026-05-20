-- EL SPACE Supabase Schema (Comprehensive)

-- 1. Users & Authentication Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Users Table
-- Note: id is UUID matching auth.users.id
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  el_space_id TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('client', 'freelancer')) NOT NULL,
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')) DEFAULT 'user',
  avatar_url TEXT,
  bio TEXT,
  password_hash TEXT, -- For legacy/OTP fallback if needed
  verified_badge INTEGER DEFAULT 0, -- 0: None, 1: Portfolio, 2: Test Passed, 3: ELACCESS
  verified_at TIMESTAMPTZ,
  phone_number TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Freelancer Profiles
CREATE TABLE IF NOT EXISTS freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  hourly_rate NUMERIC DEFAULT 0,
  years_experience INTEGER DEFAULT 0,
  portfolio_url TEXT,
  github_url TEXT,
  linkedin_url TEXT,
  skills TEXT[] DEFAULT '{}',
  total_earnings NUMERIC DEFAULT 0,
  total_projects INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  availability_status TEXT CHECK (availability_status IN ('available', 'busy', 'unavailable')) DEFAULT 'available',
  bio TEXT,
  timezone TEXT,
  languages TEXT[] DEFAULT '{}',
  verified_test_project_id UUID,
  korapay_account_id TEXT,
  skills_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Client Profiles
CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  company_name TEXT,
  company_url TEXT,
  company_size TEXT,
  budget_limit NUMERIC,
  total_spent NUMERIC DEFAULT 0,
  total_projects_posted INTEGER DEFAULT 0,
  avg_rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  verification_status TEXT CHECK (verification_status IN ('unverified', 'verified')) DEFAULT 'unverified',
  korapay_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  budget_min NUMERIC NOT NULL,
  budget_max NUMERIC NOT NULL,
  required_skills TEXT[] DEFAULT '{}',
  timeline TEXT,
  status TEXT CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')) DEFAULT 'draft',
  accepted_freelancer_id UUID REFERENCES users(id),
  total_budget NUMERIC DEFAULT 0,
  fixed_fee_amount NUMERIC,
  hourly_rate NUMERIC,
  estimated_hours NUMERIC,
  visibility TEXT CHECK (visibility IN ('public', 'private', 'invite-only')) DEFAULT 'public',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- 6. Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT NOT NULL,
  proposed_rate NUMERIC,
  estimated_days INTEGER,
  status TEXT CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')) DEFAULT 'pending',
  attachment_urls TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, freelancer_id)
);

-- 7. Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pending', 'in_progress', 'submitted', 'approved', 'released', 'disputed')) DEFAULT 'pending',
  due_date TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  released_at TIMESTAMPTZ,
  submission_notes TEXT,
  submission_attachments TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Wallets
CREATE TABLE IF NOT EXISTS wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  balance NUMERIC DEFAULT 0,
  escrow_balance NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Payments & Transactions
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id),
  milestone_id UUID REFERENCES milestones(id),
  user_id UUID REFERENCES users(id) NOT NULL, -- The user initiating the payment
  recipient_id UUID REFERENCES users(id),
  amount NUMERIC NOT NULL,
  fee_amount NUMERIC DEFAULT 0,
  currency TEXT DEFAULT 'USD',
  status TEXT CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'escrowed')) DEFAULT 'pending',
  payment_method TEXT CHECK (payment_method IN ('card', 'bank_transfer', 'mobile_money', 'crypto', 'wallet')),
  payment_type TEXT CHECK (payment_type IN ('wallet_funding', 'milestone_funding', 'payout', 'withdrawal', 'internal_transfer')),
  reference TEXT UNIQUE,
  korapay_reference TEXT UNIQUE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES users(id) NOT NULL,
  reviewee_id UUID REFERENCES users(id) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  visibility TEXT CHECK (visibility IN ('public', 'private')) DEFAULT 'public',
  reviewer_role TEXT CHECK (reviewer_role IN ('client', 'freelancer')) NOT NULL,
  both_submitted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. Messages & Chat
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_participants (
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) NOT NULL,
  content TEXT NOT NULL,
  attachment_urls TEXT[] DEFAULT '{}',
  is_system_message BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  related_id UUID, -- project_id, milestone_id, etc.
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  subscription_json JSONB NOT NULL,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. Time Tracking
CREATE TABLE IF NOT EXISTS time_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 0,
  activity_description TEXT,
  screenshot_url TEXT,
  billable BOOLEAN DEFAULT TRUE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. Disputes
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  initiated_by UUID REFERENCES users(id) NOT NULL,
  initiated_against UUID REFERENCES users(id) NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('open', 'in_review', 'resolved', 'closed', 'escalated')) DEFAULT 'open',
  resolution TEXT,
  compensation_amount NUMERIC,
  compensation_to UUID REFERENCES users(id),
  escalation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS dispute_evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dispute_id UUID REFERENCES disputes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) NOT NULL,
  evidence TEXT NOT NULL,
  attachment_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. Verified Tests
CREATE TABLE IF NOT EXISTS test_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget NUMERIC,
  status TEXT CHECK (status IN ('assigned', 'in_progress', 'submitted', 'approved', 'rejected')) DEFAULT 'assigned',
  submission_url TEXT,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. Referrals
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referred_user_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  referral_type TEXT CHECK (referral_type IN ('client', 'freelancer')),
  status TEXT CHECK (status IN ('pending', 'completed')) DEFAULT 'pending',
  reward_amount NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 17. Contact Requests
CREATE TABLE IF NOT EXISTS contact_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'responded', 'closed')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. Miscellaneous
CREATE TABLE IF NOT EXISTS saved_freelancers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  freelancer_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  folder_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, freelancer_id)
);

CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS otp_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL,
  metadata JSONB,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. Row Level Security (RLS) Policies

-- Enable RLS on all tables
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE') LOOP
        EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', t);
    END LOOP;
END $$;

-- Users Policies
CREATE POLICY "Public profiles are viewable by everyone." ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON users FOR UPDATE USING (auth.uid() = id);

-- Profiles Policies
CREATE POLICY "Freelancer profiles are public." ON freelancer_profiles FOR SELECT USING (true);
CREATE POLICY "Clients can update own profile." ON freelancer_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Client profiles are public." ON client_profiles FOR SELECT USING (true);
CREATE POLICY "Clients can update own client profile." ON client_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Projects Policies
CREATE POLICY "Open projects are viewable by everyone." ON projects FOR SELECT USING (status = 'open' OR visibility = 'public' OR auth.uid() = client_id OR auth.uid() = accepted_freelancer_id);
CREATE POLICY "Clients can manage own projects." ON projects FOR ALL USING (auth.uid() = client_id);

-- Messages Policies
CREATE POLICY "Participants can view room messages." ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chat_participants WHERE room_id = messages.room_id AND user_id = auth.uid())
);
CREATE POLICY "Participants can send messages." ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chat_participants WHERE room_id = messages.room_id AND user_id = auth.uid())
);

-- Wallet Policies
CREATE POLICY "Users can view own wallet." ON wallets FOR SELECT USING (auth.uid() = user_id);

-- Notifications Policies
CREATE POLICY "Users can view own notifications." ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications." ON notifications FOR UPDATE USING (auth.uid() = user_id);

-- 20. Useful Functions & Triggers

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
DECLARE
    t text;
BEGIN
    FOR t IN (SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND column_name = 'updated_at') LOOP
        EXECUTE format('CREATE TRIGGER update_updated_at BEFORE UPDATE ON %I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t);
    END LOOP;
END $$;
